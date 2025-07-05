from pydantic import BaseModel
from fastapi import APIRouter
from qdrant_client import QdrantClient
import os
from services.embedder import batch_embed

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")

router = APIRouter()

class SearchRequest(BaseModel):
    query: str
    k: int = 10
    min_score: float = 0.25

@router.post("/api/similarity_search")
async def similarity_search(request: SearchRequest):
    try:
        # Embed the query
        query_vector = batch_embed([request.query])[0]
        
        # Connect to Qdrant
        client = QdrantClient(QDRANT_URL)
        
        # Search for similar chunks
        search_results = client.search(
            collection_name="chunks",
            query_vector=query_vector,
            limit=request.k,
            score_threshold=request.min_score,
            with_payload=True
        )
        
        # Prepare results and increment usage counts
        results = []
        for hit in search_results:
            # Get current usage count and increment it
            current_usage = hit.payload.get("usage_count", 0)
            new_usage = current_usage + 1
            
            # Update usage_count
            client.set_payload(
                collection_name="chunks",
                payload={"usage_count": new_usage},
                points=[hit.id]
            )
            
            results.append({
                "id": hit.id,
                "score": hit.score,
                "text": hit.payload.get("text", ""),
                "payload": hit.payload
            })
        
        return results
    except Exception as e:
        return {"error": str(e)} 