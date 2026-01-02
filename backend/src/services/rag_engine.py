from ..services.vector_store import vector_store
from ..services.ai_client import ai_client

class RAGEngine:
    def __init__(self, collection: str = "textbook"):
        self.collection = collection

    def query(self, user_query: str):
        # 1. Get embedding for query
        query_vector = ai_client.get_embeddings(user_query)

        # 2. Search vector store
        results = vector_store.search(query_vector, self.collection)

        # 3. Build context
        context = "\n".join([res.payload["text"] for res in results if "text" in res.payload])

        # 4. Generate response
        prompt = f"Using this context:\n{context}\n\nAnswer this question: {user_query}"
        return ai_client.generate_response(prompt)

rag_engine = RAGEngine()
