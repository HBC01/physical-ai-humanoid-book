# Research: Physical AI Platform Implementation

## Decision: RAG Orchestration Layer
**Decision**: Implement a custom FastAPI service as the middleware between Docusaurus and Gemini/Qdrant.
**Rationale**: Allows for complex prompt engineering, caching of Urdu translations, and pre-processing of textbook content before vectorization.
**Alternatives Considered**: Client-side RAG. Rejected due to security (API keys) and performance concerns with large context windows.

## Decision: Authentication & Hardware Profiling
**Decision**: Use BetterAuth with custom attributes for `hardware_tier` and `software_env`.
**Rationale**: Lightweight, handles session management securely, and integrates well with the required Neon PostgreSQL instance.
**Alternatives Considered**: Firebase. Rejected to avoid vendor lock-in and maintain consistency with Neon DB.

## Decision: Urdu Translation Strategy
**Decision**: On-demand translation with per-chapter server-side caching.
**Rationale**: Gemini 2.5 Flash is highly capable in Urdu. Caching reduces token costs and latency for subsequent users.
**Alternatives Considered**: Pre-translating all chapters. Rejected because content is iterative and dynamic based on personalization.
