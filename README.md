# genailabs-technical-challange
GenAI Labs demo of uploading doc, store embeddings in Qdrant VectorDB and Chatbot

Monorepo scaffold for Journal Assistant (FastAPI backend, React frontend).

# Local FastAPI Backend

## Quick Start

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

- Upload endpoint: POST /api/upload (PDF or JSON, returns 202)
- Uploaded files saved in backend/uploads/
