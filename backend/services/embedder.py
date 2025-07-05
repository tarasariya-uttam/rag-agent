import os
import openai

def batch_embed(texts):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    if not openai.api_key:
        raise RuntimeError("OPENAI_API_KEY not set in environment.")
    response = openai.embeddings.create(
        input=texts,
        model="text-embedding-3-small"
    )
    return [d.embedding for d in response.data]

def embed_chunks(chunks):
    print(f"[stub] embedding {len(chunks)} chunks")
    return []
