from openai import OpenAI
from ..core.config import settings

class AIClient:
    def __init__(self):
        # Gemini is used via OpenAI-compatible SDK
        self.client = OpenAI(
            api_key=settings.GEMINI_API_KEY,
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )

    def generate_response(self, content: str, model: str = "gpt-4o"): # Maps to Gemini
        response = self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": content}]
        )
        return response.choices[0].message.content

    def get_embeddings(self, text: str):
        response = self.client.embeddings.create(
            input=[text],
            model="text-embedding-3-small" # Generic mapping
        )
        return response.data[0].embedding

ai_client = AIClient()
