import os
import glob
from ..services.vector_store import vector_store
from ..services.ai_client import ai_client

def ingest_directory(docs_dir: str, collection: str):
    files = glob.glob(os.path.join(docs_dir, "**/*.md"), recursive=True)
    for file_path in files:
        with open(file_path, "r") as f:
            content = f.read()
            # Basic chunking by paragraph
            chunks = content.split("\n\n")
            for chunk in chunks:
                if len(chunk.strip()) < 50:
                    continue
                embedding = ai_client.get_embeddings(chunk)
                # Logic to upsert to Qdrant would go here
                print(f"Ingested chunk from {file_path}")

if __name__ == "__main__":
    ingest_directory("../physical-ai-book/docs", "textbook")
