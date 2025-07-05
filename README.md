# GenAI Labs Technical Challenge

A comprehensive document ingestion and AI-powered chat system built with modern technologies. This project demonstrates a complete RAG (Retrieval-Augmented Generation) pipeline with document processing, vector storage, and intelligent chat capabilities.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### One-Command Setup
```bash
./setup.sh
```
The script will guide you through adding your OpenAI API key and start all services automatically.

### Manual Setup
```bash
# 1. Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env

# 2. Start services
docker-compose up
```

## 🌐 Access Points

Once running, access the application at:
- **Frontend Application**: http://localhost:5173
- **Backend API Documentation**: http://localhost:8000/docs
- **Qdrant Vector Database Dashboard**: http://localhost:6333/dashboard

## 🏗️ Architecture & Technologies

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive styling
- **Axios** for API communication

### Backend
- **FastAPI** (Python) for high-performance API development
- **Uvicorn** ASGI server for production deployment
- **Pydantic** for data validation and serialization
- **CORS middleware** for cross-origin requests

### Vector Database
- **Qdrant** for high-performance vector similarity search
- **1536-dimensional embeddings** using OpenAI's text-embedding-ada-002
- **Cosine similarity** for semantic search

### AI & ML
- **OpenAI GPT-4** for intelligent chat responses
- **OpenAI text-embedding-ada-002** for document embeddings
- **Chunking strategy** for optimal document processing

### Infrastructure
- **Docker** for containerized deployment
- **Docker Compose** for multi-service orchestration
- **Volume persistence** for Qdrant data storage

## 📋 Features

### 1. Document Upload & Processing
- **Supported Formats**: PDF and JSON files
- **Intelligent Chunking**: Breaks documents into optimal-sized chunks
- **Automatic Embedding**: Converts text chunks to vector embeddings
- **Vector Storage**: Stores embeddings in Qdrant for fast retrieval

### 2. AI-Powered Chat
- **Context-Aware Responses**: Uses uploaded documents as context
- **Semantic Search**: Finds relevant document chunks for each query
- **Intelligent Answering**: Generates responses using GPT-4 with document context
- **Usage Tracking**: Monitors API usage and costs

### 3. Similarity Search
- **Semantic Matching**: Find similar document chunks using vector similarity
- **Real-time Search**: Instant results with Qdrant's optimized search
- **Usage Analytics**: Track search patterns and popular queries

### 4. Journal Management
- **Document Organization**: Group chunks by journal/document ID
- **Easy Retrieval**: Find all chunks from a specific document
- **Structured Data**: Maintain document metadata and relationships

## 🔌 API Endpoints

### Document Upload
```http
POST /api/upload
Content-Type: multipart/form-data

- file: PDF or JSON file
```

**Response**: 202 Accepted with processing status

### Chat Interface
```http
POST /api/chat/query
Content-Type: application/json

{
  "message": "Your question here",
  "journal_id": "optional_document_id"
}
```

**Response**: AI-generated answer with context sources

### Similarity Search
```http
POST /api/similarity_search
Content-Type: application/json

{
  "query": "search text",
  "limit": 5
}
```

**Response**: List of similar document chunks with similarity scores

### Journal Retrieval
```http
GET /api/{journal_id}
```

**Response**: All chunks from the specified journal/document

## 🔧 Project Structure

```
genailabs-technical-challange/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Chat.tsx     # Chat interface
│   │   │   ├── SimilaritySearch.tsx
│   │   │   ├── FindChunkById.tsx
│   │   │   └── UploadModal.tsx
│   │   └── App.tsx          # Main application
│   ├── Dockerfile           # Frontend container
│   └── package.json
├── backend/                  # FastAPI backend
│   ├── api/                 # API route handlers
│   │   ├── upload.py        # File upload endpoint
│   │   ├── chat.py          # Chat API
│   │   ├── search.py        # Similarity search
│   │   └── journal.py       # Journal retrieval
│   ├── services/            # Business logic
│   │   ├── chunker.py       # Document chunking
│   │   ├── embedder.py      # OpenAI embeddings
│   │   └── qdrant_client.py # Vector DB client
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container
├── docker-compose.yml       # Multi-service orchestration
├── setup.sh                 # Automated setup script
├── .env                     # Environment variables
└── README.md               # This file
```

## 🛠️ Development

### Local Development (Without Docker)
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

### Environment Variables
```bash
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=http://localhost:6333  # Default
```

## 📊 Performance & Scalability

- **Vector Search**: Sub-second similarity search with Qdrant
- **Document Processing**: Efficient chunking and embedding pipeline
- **API Response**: Fast response times with FastAPI async support
- **Memory Usage**: Optimized Docker containers with Alpine images
- **Data Persistence**: Qdrant data persisted across container restarts

## 🔒 Security & Best Practices

- **Environment Variables**: Sensitive data stored in .env (not committed)
- **CORS Configuration**: Properly configured for frontend-backend communication
- **Input Validation**: Pydantic models for API request validation
- **Error Handling**: Comprehensive error handling and logging
- **Container Security**: Minimal base images and proper user permissions

## 🧪 Testing

The application includes comprehensive error handling and validation:
- File format validation for uploads
- API key validation for OpenAI services
- Vector database connection health checks
- Frontend error boundaries and loading states

## 🚀 Deployment

### Production Considerations
- Use production-grade Docker images
- Configure proper environment variables
- Set up monitoring and logging
- Implement rate limiting for API endpoints
- Consider using a reverse proxy (nginx)

### Scaling
- Qdrant supports horizontal scaling
- FastAPI can be deployed with multiple workers
- Frontend can be served via CDN for global distribution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is part of the GenAI Labs technical challenge.

## 🆘 Troubleshooting

### Common Issues
1. **Docker not running**: Ensure Docker Desktop is started
2. **Port conflicts**: Check if ports 5173, 8000, or 6333 are in use
3. **OpenAI API errors**: Verify your API key is valid and has credits
4. **Qdrant connection issues**: Check if the vector database container is running

### Logs
```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs qdrant
```

---

**Built with ❤️ using modern AI and web technologies**
