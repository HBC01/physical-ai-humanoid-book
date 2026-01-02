from typing import Dict
from ..services.ai_client import AIClient

class TranslatorService:
    def __init__(self):
        self.ai = AIClient()
        self.cache: Dict[str, str] = {}

    async def translate_to_urdu(self, text: str, content_id: str) -> str:
        # Check cache
        if content_id in self.cache:
            return self.cache[content_id]

        prompt = f"""
        Translate the following technical textbook content about Physical AI and Robotics into Urdu.
        Maintain technical terms like 'ROS 2', 'rclpy', 'node', 'publisher' in English script where appropriate for clarity,
        but provide the explanation in fluent Urdu.

        Content:
        {text}
        """

        response = self.ai.client.chat.completions.create(
            model="gemini-2.0-flash",
            messages=[
                {"role": "system", "content": "You are an expert translator specializing in technical robotics content for Urdu-speaking students."},
                {"role": "user", "content": prompt}
            ]
        )

        translated_text = response.choices[0].message.content
        self.cache[content_id] = translated_text
        return translated_text

translator_service = TranslatorService()
