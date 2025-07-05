import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.upload import router as upload_router
from api.search import router as search_router
from api.journal import router as journal_router
from api.chat import router as chat_router
from services.qdrant_client import init_qdrant_collection

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    try:
        init_qdrant_collection()
    except Exception as e:
        print(f"Warning: Could not initialize Qdrant: {e}")

app.include_router(chat_router)
app.include_router(upload_router)
app.include_router(search_router)
app.include_router(journal_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
