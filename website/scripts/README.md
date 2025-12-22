# RAG Embedding Generation

This directory contains scripts for generating embeddings for the RAG (Retrieval Augmented Generation) chatbot.

## Setup

Install Python dependencies:

```bash
pip install -r requirements.txt
```

## Generate Embeddings

Run the embedding generation script:

```bash
cd website/scripts
python generate-embeddings.py
```

This will:
1. Read all MDX/MD files from `docs/modules/`
2. Clean and chunk the content (800 tokens per chunk, 50-token overlap)
3. Generate embeddings using `paraphrase-multilingual-MiniLM-L12-v2` model
4. Output `static/embeddings.json` (~384D embeddings)

## Output

The script creates `website/static/embeddings.json` with structure:

```json
{
  "model": "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
  "embedding_dim": 384,
  "chunk_size": 800,
  "overlap": 50,
  "total_chunks": 150,
  "chunks": [
    {
      "module": "02-ros2",
      "chapter": "ROS 2 Fundamentals",
      "section": "Nodes and Topics",
      "chunk_index": 0,
      "content": "...",
      "file_path": "docs/modules/02-ros2/chapter-01.mdx",
      "url": "/docs/modules/02-ros2/chapter-01",
      "embedding": [0.123, -0.456, ...]
    }
  ]
}
```

## Usage in Frontend

The generated embeddings are loaded client-side by the RAG services:

```typescript
import { loadEmbeddings } from '../services/rag/embeddings';

const data = await loadEmbeddings();
// data.chunks contains all chunks with embeddings
```

## Notes

- Run this script whenever documentation content changes
- The embeddings file will be ~2-5MB depending on content size
- For production, consider pre-generating and caching embeddings in CI/CD
- The multilingual model supports both English and Urdu content
