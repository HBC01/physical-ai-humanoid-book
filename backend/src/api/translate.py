from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.translator import translator_service

router = APIRouter()

class TranslationRequest(BaseModel):
    text: str
    content_id: str

class TranslationResponse(BaseModel):
    translated_text: str

@router.post("/translate", response_model=TranslationResponse)
async def translate_content(request: TranslationRequest):
    try:
        translated = await translator_service.translate_to_urdu(
            request.text,
            request.content_id
        )
        return TranslationResponse(translated_text=translated)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
