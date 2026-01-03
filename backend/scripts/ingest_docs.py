#!/usr/bin/env python3
"""Document ingestion script for RAG vector store population."""
import os
import sys
import glob

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.services.vector_store import vector_store
from src.services.ai_client import ai_client


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> list[str]:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if len(chunk.strip()) >= 50:  # Skip very small chunks
            chunks.append(chunk.strip())
        start = end - overlap
    return chunks


def ingest_directory(docs_dir: str, collection: str = "textbook"):
    """Ingest all markdown files from a directory into Qdrant."""
    # Find all markdown files
    pattern = os.path.join(docs_dir, "**/*.md")
    files = glob.glob(pattern, recursive=True)

    if not files:
        print(f"No markdown files found in {docs_dir}")
        return

    print(f"Found {len(files)} markdown files")

    # Create collection if needed
    try:
        vector_store.create_collection(collection)
        print(f"Created collection: {collection}")
    except Exception:
        print(f"Collection {collection} already exists")

    all_chunks = []
    file_map = []

    for file_path in files:
        rel_path = os.path.relpath(file_path, docs_dir)
        print(f"Processing: {rel_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Add file metadata to content
        enhanced_content = f"[File: {rel_path}]\n{content}"

        # Chunk the content
        chunks = chunk_text(enhanced_content)
        print(f"  - Split into {len(chunks)} chunks")

        for chunk in chunks:
            all_chunks.append(chunk)
            file_map.append(rel_path)

    if not all_chunks:
        print("No content chunks to ingest")
        return

    print(f"\nTotal chunks to embed: {len(all_chunks)}")

    # Get embeddings in batches to avoid rate limits
    batch_size = 10
    all_embeddings = []

    for i in range(0, len(all_chunks), batch_size):
        batch = all_chunks[i:i + batch_size]
        print(f"Embedding batch {i // batch_size + 1}/{(len(all_chunks) - 1) // batch_size + 1}")

        for text in batch:
            embedding = ai_client.get_embeddings(text)
            all_embeddings.append(embedding)

    # Upsert to Qdrant
    print(f"\nUpserting {len(all_embeddings)} vectors to Qdrant...")
    vector_store.upsert(collection, all_chunks, all_embeddings)
    print("Done!")


if __name__ == "__main__":
    docs_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "..",
        "physical-ai-book",
        "docs"
    )
    ingest_directory(docs_dir, "textbook")
