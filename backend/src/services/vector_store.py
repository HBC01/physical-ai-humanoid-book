from qdrant_client import QdrantClient
from ..core.config import settings

class VectorStore:
    def __init__(self):
        self.client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )

    def search(self, vector: list[float], collection: str, top_k: int = 5):
        return self.client.search(
            collection_name=collection,
            query_vector=vector,
            limit=top_k
        )

vector_store = VectorStore()
