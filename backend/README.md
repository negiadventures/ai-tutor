# 🔧 AI Tutor – Backend

This is the FastAPI-based backend service that:
- Accepts uploaded `.pdf` or `.docx` files
- Extracts chapter-wise content using PDF parsing (PyMuPDF) or docx reader
- Detects chapter headings via font-size heuristics
- Generates embeddings using HuggingFace Sentence Transformers
- Computes cosine similarity to detect chapter transitions
- Returns structured chapters and enables quiz generation using LLMs

## 🗃️ Project Structure

```ai-tutor-backend/
├── app/
│   ├── main.py                 # FastAPI entrypoint
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── crud.py                 # DB access logic
│   ├── db.py                   # DB access logic
│   ├── file_utils.py           # File extraction/hash logic
│   ├── llm_utils.py            # LLM prompt & response logic
│   ├── aws_utils.py            # S3 upload logic
│   └── config.py               # Config/env vars
├── requirements.txt
└── Dockerfile
```
## 📦 Setup

```bash
cd backend
```
- Make sure tables exists, run all the ddls from ddl dir.
- Update creds in .env file

```bash
pip install -r requirements.txt
docker network create ai-network
docker-compose up --build
```

## 📁 Notable Files

- `main.py` – FastAPI endpoints
- `file_utils.py` – File parsing, hashing, S3 logic
- `vectorize.py` – Text chunking, embedding, similarity logic
