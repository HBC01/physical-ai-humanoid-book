from openai import OpenAI
from google import genai
from ..core.config import settings

class AIClient:
    def __init__(self):
        # Gemini for text generation (via OpenAI-compatible SDK)
        self.llm_client = OpenAI(
            api_key=settings.GEMINI_API_KEY,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        # Gemini for embeddings (via Google SDK)
        self.embed_client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def generate_response(self, content: str, model: str = "gpt-4o"):
        """Generate response using Gemini"""
        response = self.llm_client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": content}]
        )
        return response.choices[0].message.content

    def get_embeddings(self, text: str):
        """Get embeddings using Gemini API"""
        response = self.embed_client.models.embed_content(
            model="text-embedding-004",
            contents=[text]
        )
        return response.embeddings[0].values

ai_client = AIClient()
