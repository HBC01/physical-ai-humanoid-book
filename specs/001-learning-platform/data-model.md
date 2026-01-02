# Data Model: Physical AI Learning Platform

## User Profile (PostgreSQL)
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `hardware_config`: JSON (CPU, GPU, RAM, Robot Type)
- `software_stack`: JSON (OS, ROS version, CUDA version)
- `preferred_language`: Enum (English, Urdu)

## Chapter Metadata (PostgreSQL/Markdown)
- `id`: String (Slug)
- `title`: String
- `week_number`: Integer
- `content_hash`: String (For cache invalidation)

## Vector Store (Qdrant)
- `point_id`: UUID
- `vector`: float[dim] (Gemini Embeddings)
- `payload`:
  - `text`: String chunk
  - `chapter_id`: String
  - `importance_score`: Float
