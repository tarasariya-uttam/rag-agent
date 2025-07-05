import os
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

def get_qdrant_client():
    """Get Qdrant client instance"""
    qdrant_url = os.getenv("QDRANT_URL", "http://localhost:6333")
    return QdrantClient(url=qdrant_url)

def init_qdrant_collection():
    """Initialize Qdrant collection if it doesn't exist"""
    client = get_qdrant_client()
    collection_name = "chunks"
    
    try:
        # Check if collection exists
        collections = client.get_collections()
        collection_names = [col.name for col in collections.collections]
        
        if collection_name not in collection_names:
            # Create collection
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
            )
            print(f"Created Qdrant collection: {collection_name}")
        else:
            print(f"Qdrant collection {collection_name} already exists")
            
    except Exception as e:
        print(f"Error initializing Qdrant collection: {e}")
        raise 