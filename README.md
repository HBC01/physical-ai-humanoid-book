# Physical AI & Humanoid Robotics Learning Platform

A comprehensive learning platform and interactive book for Physical AI and Humanoid Robotics.

## 🚀 Overview
This repository contains the source code for the "Physical AI Humanoid Book", featuring a RAG-powered interactive learning environment.

### Key Components
- **Interactive Book**: Built with [Docusaurus](https://docusaurus.io/), providing structured learning modules.
- **RAG-Powered Chat**: An AI teaching assistant that understands the book content and robotics concepts.
- **Backend Service**: Powered by **FastAPI**, **Qdrant** (Vector DB), **Google Gemini** (LLM), and **ChatKit**.

## 🛠 Tech Stack
- **Frontend**: React, Docusaurus v4
- **Backend**: FastAPI, Python 3.13, Uv
- **AI/ML**: Google Gemini 1.5 Pro, Qdrant Vector DB
- **Database**: PostgreSQL (Neon)
- **Authentication**: BetterAuth
- **DevOps**: GitHub Pages (Frontend), Vercel (Backend)

## 📁 Project Structure
- `backend/`: FastAPI application with RAG engine, AI client, and translation API.
- `physical-ai-book/`: Docusaurus v4 documentation site.
- `specs/`: Project specifications and design documents.
- `history/`: Prompt history records and ADRs.

## 🚦 Local Development

### Prerequisites
- Python 3.13+
- Node.js 20+
- Uv (Python package manager)
- npm/yarn

### 1. Backend Setup
```bash
# Copy environment variables
cp .env.example .env
# Edit .env with your API keys (Gemini, Qdrant, PostgreSQL, BetterAuth)

cd backend
# Install dependencies
uv sync
# Start the server
uv run uvicorn src.api.chat:router:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`
- Chat API: `POST /chat`
- Translate API: `POST /translate`

### 2. Frontend Setup
```bash
cd physical-ai-book
npm install
# Start Docusaurus dev server
npm run start
```

Frontend will be available at `http://localhost:3000`

## 🚢 Deployment

### GitHub Pages (Frontend - Docusaurus)
The book is automatically deployed to GitHub Pages. Configuration in `physical-ai-book/docusaurus.config.ts`:

- **Source Branch**: `main` (or `001-learning-platform`)
- **Source Directory**: `physical-ai-book/`
- **Build Command**: `npm run build`
- **Output Directory**: `build`

### Vercel (Backend - FastAPI)
The backend is prepared for Vercel deployment:
- Configuration: `backend/vercel.json`
- Entry Point: `backend/main.py` (ASGI application)
- Environment Variables: Set in Vercel dashboard (same as `.env`)

## 🔑 Required Environment Variables
```bash
# Database
DATABASE_URL=postgresql://...

# Vector Store
QDRANT_URL=https://...
QDRANT_API_KEY=...

# AI Client
OPENAI_API_KEY=...  # Gemini API key

# Authentication
BETTER_AUTH_SECRET=...
```

## 📖 Usage
1. Build and ingest documents into Qdrant vector database
2. Start the backend FastAPI server
3. Access the Docusaurus book frontend
4. Use the chat interface to query content

## 🤖 Generated with Claude Code
🤖 Generated with [Claude Code](https://claude.com/claude-code)
