from fastapi import APIRouter
from qdrant_client import QdrantClient
from qdrant_client.http.models import Filter, FieldCondition, MatchValue
import os

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")

router = APIRouter()

@router.get("/api/{journal_id}")
async def get_journal_chunks(journal_id: str):
    # Connect to Qdrant
    client = QdrantClient(QDRANT_URL)
    
    # Create filter for source_doc_id
    filter_condition = Filter(
        must=[
            FieldCondition(
                key="source_doc_id",
                match=MatchValue(value=journal_id)
            )
        ]
    )
    
    # Search for chunks matching the journal_id
    search_results = client.search(
        collection_name="chunks",
        query_vector=[0] * 1536,  # Dummy vector since we're filtering
        query_filter=filter_condition,
        limit=100,  # Adjust as needed
        with_payload=True,
        with_vectors=False
    )
    
    # Build response
    chunks = []
    for hit in search_results:
        chunks.append({
            "id": hit.id,
            "text": hit.payload.get("text", ""),
            "payload": hit.payload
        })
    
    return {
        "journal_id": journal_id,
        "chunks": chunks
    } 