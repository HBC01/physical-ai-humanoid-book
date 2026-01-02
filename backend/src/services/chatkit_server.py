from collections.abc import AsyncIterator
from datetime import datetime
import json
from typing import Any, Optional

from pydantic import BaseModel
from sqlalchemy.orm import Session
from .ai_client import ai_client
from .rag_engine import rag_engine

class ChatKitMessage(BaseModel):
    role: str
    content: str

class ChatKitRequest(BaseModel):
    thread_id: str
    message: Optional[str] = None
    history: list[ChatKitMessage] = []

class ChatKitServer:
    """
    Manual implementation of the ChatKit protocol for server-side RAG.
    """
    async def process_request(self, request: ChatKitRequest) -> AsyncIterator[str]:
        # 1. User Query
        user_query = request.message or ""

        # 2. RAG Context Retrieval
        # We query the RAG engine to get relevant snippets from the book
        context = rag_engine.get_context(user_query)

        # 3. System Prompt Construction
        system_prompt = (
            "You are the Physical AI Tutor, an expert in humanoid robotics and ROS 2. "
            "Use the following textbook context to answer the user's question accurately. "
            "If the answer is not in the context, politely state that it's outside the current syllabus. "
            f"\n\nCONTEXT:\n{context}"
        )

        # 4. Gemini Streaming via ai_client
        messages = [{"role": "system", "content": system_prompt}]
        for msg in request.history:
            messages.append({"role": msg.role, "content": msg.content})

        if user_query:
            messages.append({"role": "user", "content": user_query})

        # Generate streaming response
        response_stream = ai_client.client.chat.completions.create(
            model="gpt-4o", # Model mapped to Gemini 2.5 Flash
            messages=messages,
            stream=True
        )

        for chunk in response_stream:
            content = chunk.choices[0].delta.content
            if content:
                # ChatKit SSE format
                yield f"event: thread.item.delta\ndata: {json.dumps({'delta': {'content': content}})}\n\n"

        yield "event: thread.item.done\ndata: {}\n\n"

chat_server = ChatKitServer()
