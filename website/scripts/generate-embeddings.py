#!/usr/bin/env python3
"""
Generate embeddings for RAG (Retrieval Augmented Generation) chatbot.

This script:
1. Reads all MDX chapter files from docs/modules/
2. Chunks content into 500-1000 token pieces with 50-token overlap
3. Generates embeddings using sentence-transformers (multilingual-e5-small)
4. Outputs JSON file with chunk metadata and embeddings

Usage:
    python scripts/generate-embeddings.py

Output:
    static/embeddings.json - Contains chunks with embeddings for client-side RAG
"""

import os
import re
import json
import tiktoken
from pathlib import Path
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer

# Configuration
DOCS_DIR = Path(__file__).parent.parent / "docs" / "modules"
OUTPUT_FILE = Path(__file__).parent.parent / "static" / "embeddings.json"
MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
CHUNK_SIZE = 800  # Target tokens per chunk
CHUNK_OVERLAP = 50  # Overlap tokens between chunks
ENCODING = "cl100k_base"  # Tokenizer for chunking (cl100k_base encoding)

def extract_frontmatter(content: str) -> Dict[str, Any]:
    """Extract YAML frontmatter from MDX content."""
    frontmatter = {}
    match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if match:
        yaml_content = match.group(1)
        for line in yaml_content.split('\n'):
            if ':' in line:
                key, value = line.split(':', 1)
                frontmatter[key.strip()] = value.strip().strip('"').strip("'")
    return frontmatter

def remove_frontmatter(content: str) -> str:
    """Remove YAML frontmatter from content."""
    return re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)

def clean_mdx_content(content: str) -> str:
    """Clean MDX content by removing JSX components and code fences."""
    # Remove import statements
    content = re.sub(r'^import .*?;?\n', '', content, flags=re.MULTILINE)

    # Remove JSX component tags but keep their content
    content = re.sub(r'<[A-Z]\w+[^>]*>(.*?)</[A-Z]\w+>', r'\1', content, flags=re.DOTALL)
    content = re.sub(r'<[A-Z]\w+[^/>]*/?>', '', content)

    # Keep code blocks but mark them
    content = re.sub(r'```(\w+)?\n(.*?)```', r'Code:\n\2', content, flags=re.DOTALL)

    # Remove HTML comments
    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)

    # Normalize whitespace
    content = re.sub(r'\n{3,}', '\n\n', content)

    return content.strip()

def chunk_text(text: str, encoding_name: str, chunk_size: int, overlap: int) -> List[str]:
    """
    Split text into chunks based on token count.

    Args:
        text: Input text to chunk
        encoding_name: Tokenizer encoding name
        chunk_size: Target tokens per chunk
        overlap: Overlap tokens between chunks

    Returns:
        List of text chunks
    """
    encoding = tiktoken.get_encoding(encoding_name)
    tokens = encoding.encode(text)

    chunks = []
    start = 0

    while start < len(tokens):
        end = start + chunk_size
        chunk_tokens = tokens[start:end]
        chunk_text = encoding.decode(chunk_tokens)
        chunks.append(chunk_text)

        start += chunk_size - overlap

    return chunks

def extract_sections(content: str) -> List[Dict[str, str]]:
    """Extract sections from markdown content based on headers."""
    sections = []
    current_section = {"title": "Introduction", "content": ""}

    lines = content.split('\n')
    for line in lines:
        # Check for headers (## or ###)
        header_match = re.match(r'^(#{2,3})\s+(.+)$', line)
        if header_match:
            # Save previous section if it has content
            if current_section["content"].strip():
                sections.append(current_section)

            # Start new section
            current_section = {
                "title": header_match.group(2).strip(),
                "content": ""
            }
        else:
            current_section["content"] += line + "\n"

    # Add final section
    if current_section["content"].strip():
        sections.append(current_section)

    return sections

def process_mdx_file(file_path: Path) -> List[Dict[str, Any]]:
    """
    Process a single MDX file and generate chunks.

    Args:
        file_path: Path to MDX file

    Returns:
        List of chunk dictionaries with metadata
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        raw_content = f.read()

    # Extract metadata from frontmatter
    frontmatter = extract_frontmatter(raw_content)
    title = frontmatter.get('title', file_path.stem)

    # Clean content
    content = remove_frontmatter(raw_content)
    content = clean_mdx_content(content)

    # Extract module and chapter from path
    parts = file_path.parts
    module_idx = parts.index('modules') + 1 if 'modules' in parts else -1
    module = parts[module_idx] if module_idx > 0 else 'unknown'

    # Extract sections
    sections = extract_sections(content)

    chunks = []
    for section in sections:
        section_content = section["content"].strip()
        if not section_content:
            continue

        # Chunk the section content
        section_chunks = chunk_text(
            section_content,
            ENCODING,
            CHUNK_SIZE,
            CHUNK_OVERLAP
        )

        for idx, chunk_text in enumerate(section_chunks):
            if len(chunk_text.strip()) < 50:  # Skip tiny chunks
                continue

            chunks.append({
                "module": module,
                "chapter": title,
                "section": section["title"],
                "chunk_index": idx,
                "content": chunk_text,
                "file_path": str(file_path.relative_to(file_path.parent.parent.parent)),
                "url": f"/docs/modules/{module}/{file_path.stem}"
            })

    return chunks

def generate_embeddings(chunks: List[Dict[str, Any]], model: SentenceTransformer) -> List[Dict[str, Any]]:
    """
    Generate embeddings for all chunks.

    Args:
        chunks: List of chunk dictionaries
        model: SentenceTransformer model

    Returns:
        List of chunks with embeddings added
    """
    print(f"Generating embeddings for {len(chunks)} chunks...")

    # Extract content for embedding
    texts = [chunk["content"] for chunk in chunks]

    # Generate embeddings in batches
    embeddings = model.encode(
        texts,
        batch_size=32,
        show_progress_bar=True,
        convert_to_numpy=True
    )

    # Add embeddings to chunks
    for chunk, embedding in zip(chunks, embeddings):
        chunk["embedding"] = embedding.tolist()

    return chunks

def main():
    """Main execution function."""
    print("=== RAG Embedding Generation ===\n")

    # Load embedding model
    print(f"Loading model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)
    print(f"Model loaded. Embedding dimension: {model.get_sentence_embedding_dimension()}\n")

    # Find all MDX files
    mdx_files = list(DOCS_DIR.rglob("*.mdx")) + list(DOCS_DIR.rglob("*.md"))
    print(f"Found {len(mdx_files)} documentation files\n")

    # Process all files
    all_chunks = []
    for file_path in mdx_files:
        print(f"Processing: {file_path.relative_to(DOCS_DIR.parent.parent)}")
        try:
            chunks = process_mdx_file(file_path)
            all_chunks.extend(chunks)
            print(f"  → Generated {len(chunks)} chunks")
        except Exception as e:
            print(f"  ✗ Error: {e}")

    print(f"\nTotal chunks: {len(all_chunks)}")

    # Generate embeddings
    chunks_with_embeddings = generate_embeddings(all_chunks, model)

    # Create output directory if needed
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Save to JSON
    output_data = {
        "model": MODEL_NAME,
        "embedding_dim": model.get_sentence_embedding_dimension(),
        "chunk_size": CHUNK_SIZE,
        "overlap": CHUNK_OVERLAP,
        "total_chunks": len(chunks_with_embeddings),
        "chunks": chunks_with_embeddings
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Embeddings saved to: {OUTPUT_FILE}")
    print(f"  Total size: {OUTPUT_FILE.stat().st_size / 1024 / 1024:.2f} MB")
    print("\nDone!")

if __name__ == "__main__":
    main()
