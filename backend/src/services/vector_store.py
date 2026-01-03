from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
from ..core.config import settings
import uuid

class VectorStore:
    def __init__(self):
        self.client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )

    def create_collection(self, collection_name: str, vector_size: int = 1536):
        """Create collection if it doesn't exist"""
        self.client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE)
        )

    def upsert(self, collection: str, chunks: list[str], embeddings: list[list[float]]):
        """Upsert chunks and embeddings to Qdrant"""
        points = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            points.append(PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={"text": chunk, "chunk_index": i}
            ))
        self.client.upsert(collection_name=collection, points=points)

    def search(self, vector: list[float], collection: str, top_k: int = 5):
        return self.client.search(
            collection_name=collection,
            query_vector=vector,
            limit=top_k
        )

vector_store = VectorStore()
