from pydantic import BaseModel
from fastapi import APIRouter
from qdrant_client import QdrantClient
import os
from backend.services.embedder import batch_embed
from openai import OpenAI

QDRANT_URL = os.getenv("QDRANT_URL", "http://localhost:6333")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

@router.post("/api/chat/query")
async def chat_with_documents(request: ChatRequest):
    try:
        # Embed the query
        query_vector = batch_embed([request.query])[0]
        
        # Connect to Qdrant
        client = QdrantClient(QDRANT_URL)
        
        # Search for similar chunks with default values
        search_results = client.search(
            collection_name="chunks",
            query_vector=query_vector,
            limit=3,  # Default k value
            score_threshold=0.2,  # Default min_score value
            with_payload=True
        )
        
        if not search_results:
            return {
                "answer": "I couldn't find any relevant information to answer your question.",
                "sources": [],
                "query": request.query
            }
        
        # Prepare context from search results
        context_parts = []
        sources = []
        
        for hit in search_results:
            # Increment usage count
            current_usage = hit.payload.get("usage_count", 0)
            new_usage = current_usage + 1
            client.set_payload(
                collection_name="chunks",
                payload={"usage_count": new_usage},
                points=[hit.id]
            )
            
            # Add to context
            text = hit.payload.get("text", "")
            if text:
                context_parts.append(f"Source: {hit.payload.get('section_heading', 'Unknown')}\n{text}")
                sources.append({
                    "id": hit.id,
                    "score": hit.score,
                    "section_heading": hit.payload.get("section_heading", ""),
                    "journal": hit.payload.get("journal", ""),
                    "publish_year": hit.payload.get("publish_year", ""),
                    "text": text[:200] + "..." if len(text) > 200 else text
                })
        
        # Combine context
        context = "\n\n".join(context_parts)
        
        # Generate LLM response using new OpenAI API
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        
        prompt = f"""Based on the following context, answer the user's question. If the context doesn't contain enough information to answer the question, say so.

Context:
{context}

Question: {request.query}

Answer:"""
        
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers questions based on the provided context. Be concise and accurate."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        answer = response.choices[0].message.content.strip()
        
        return {
            "answer": answer,
            "sources": sources,
            "query": request.query
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "query": request.query
        } 