"""
FastAPI Application Entry Point for Vercel Deployment
"""
from fastapi import FastAPI
from src.api.chat import router as chat_router
from src.api.translate import router as translate_router

# Create FastAPI application
app = FastAPI(
    title="Physical AI Humanoid Book API",
    description="RAG-powered chat and translation API",
    version="0.1.0"
)

# Include routers
app.include_router(chat_router, prefix="/api")
app.include_router(translate_router, prefix="/api")


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Physical AI Humanoid Book API is running"}


@app.get("/health")
async def health():
    """Health check endpoint for Vercel"""
    return {"status": "healthy"}
