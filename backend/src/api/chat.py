from fastapi import APIRouter
from pydantic import BaseModel
from ..services.rag_engine import rag_engine

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    reply = rag_engine.query(request.message)
    return {"reply": reply}
