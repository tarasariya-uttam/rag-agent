import os
import uuid
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from qdrant_client import QdrantClient
from qdrant_client.http.models import PointStruct, VectorParams, Distance
from services.chunker import chunk_pdf
from services.embedder import batch_embed

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "../uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter()

@router.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    journal: str = Form(None),
    year: int = Form(None)
):
    if file.content_type not in ["application/pdf", "application/json"]:
        raise HTTPException(status_code=400, detail="Only PDF or JSON files are allowed.")
    filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    if file.content_type == "application/json":
        with open(file_path, "r", encoding="utf-8") as f:
            chunks = json.load(f)
        # Ensure all chunks have valid UUID IDs for Qdrant
        for chunk in chunks:
            # Store original ID in payload if it exists
            if "id" in chunk:
                chunk["original_id"] = chunk["id"]
            # Always generate new UUID for Qdrant
            chunk["id"] = str(uuid.uuid4())
            chunk.setdefault("usage_count", 0)
    else:
        # PDF: chunk and build dicts
        chunks = chunk_pdf(file_path, max_words=500, journal=journal or "unknown", publish_year=year or 0)

    texts = [c["text"] for c in chunks]
    vectors = batch_embed(texts)

    client = QdrantClient(QDRANT_URL)
    # Create collection if not exists
    if "chunks" not in [c.name for c in client.get_collections().collections]:
        client.create_collection(
            collection_name="chunks",
            vectors_config=VectorParams(size=len(vectors[0]), distance=Distance.COSINE)
        )
    points = [
        PointStruct(
            id=chunk["id"],
            vector=vector,
            payload={
                "original_id": chunk.get("original_id", chunk["id"]),
                "source_doc_id": chunk["source_doc_id"],
                "section_heading": chunk["section_heading"],
                "journal": chunk["journal"],
                "publish_year": chunk["publish_year"],
                "usage_count": chunk["usage_count"],
                "attributes": chunk["attributes"],
                "text": chunk["text"]
            }
        )
        for chunk, vector in zip(chunks, vectors)
    ]
    client.upsert(collection_name="chunks", points=points)
    return JSONResponse(status_code=202, content={"inserted": len(chunks)}) 