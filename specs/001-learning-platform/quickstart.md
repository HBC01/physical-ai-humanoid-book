# Quickstart: Physical AI Learning Platform

## Prerequisites
- Node.js 18+
- Python 3.11+
- Qdrant Cloud Account & API Key
- Neon PostgreSQL URL
- Gemini API Key (OpenAI SDK compatible)

## Setup Steps

### 1. Frontend (Docusaurus)
```bash
cd physical-ai-book
npm install
npm start
```

### 2. Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env # Fill with keys
uvicorn main:app --reload
```

## Local Development Flow
1. Add markdown chapters to `physical-ai-book/docs`
2. Run ingestion script to update Qdrant vectors
3. Test chatbot interactions locally via the embedded widget
