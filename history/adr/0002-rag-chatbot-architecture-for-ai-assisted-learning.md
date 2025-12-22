# ADR-0002: RAG Chatbot Architecture for AI-Assisted Learning

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2025-12-21
- **Feature:** Physical AI & Humanoid Robotics – An AI-Native Textbook
- **Context:** Need to implement Retrieval-Augmented Generation (RAG) chatbot for answering student questions about Physical AI curriculum (21+ chapters, English/Urdu). Must work on static GitHub Pages site without backend infrastructure, provide accurate citations to textbook sections, support conversational context, and remain cost-effective ($8-13/mo MVP, $110-150/mo at 10K students). This is a high-value feature for hackathon scoring (AI-native design criterion).

<!-- Significance checklist (ALL must be true to justify this ADR)
     ✅ 1) Impact: Long-term consequence - shapes AI-assisted learning experience, operational costs, and AI-native hackathon score
     ✅ 2) Alternatives: 3 architectures evaluated (hybrid $110-150/mo, fully API-based $200-300/mo, self-hosted $500+/mo infra)
     ✅ 3) Scope: Cross-cutting - affects client-side JS bundle, serverless API, content chunking, embedding pipeline, LLM costs
-->

## Decision

Adopt **Hybrid Client-Side + Serverless API** architecture for RAG chatbot with the following integrated components:

**Client-Side Components** (bundled with static site):
- **Vector Search**: vectordb.js or custom client-side library (~1KB)
- **Pre-Computed Embeddings**: multilingual-e5-small (384 dimensions), ~2-3MB compressed JSON
- **Chunking Strategy**: 500-1000 tokens per chunk, 50-token overlap, semantic boundaries
- **Retrieval**: Cosine similarity search returning top-3 chunks (<100ms latency)

**Serverless Components** (Vercel Functions):
- **LLM Generation**: GPT-4o-mini (MVP, $0.60/1M output tokens) or Claude Sonnet (production, $15/1M output tokens)
- **API Endpoint**: `/api/chat` for generation only (not retrieval)
- **Rate Limiting**: 20 queries/user/day, 2 queries/minute
- **Caching**: Vercel KV for 70%+ cache hit rate on common questions

**Pre-Processing Pipeline** (build time):
- Chunk textbook content during static site generation
- Generate embeddings using multilingual-e5-small (Hugging Face)
- Package embeddings as JSON with site build
- Index structure supports both English and Urdu queries

**Citation Mechanism**:
- LLM prompted to include inline citations: `[Chapter X, Section Y]`
- Client-side parsing converts citations to clickable markdown links
- Deep links to specific chapter sections

**Cost Structure**:
- MVP (1,000 students, 10 queries each): $8-13/month (embeddings free, LLM only)
- Production (10,000 students): $110-150/month with GPT-4o-mini + caching

## Consequences

### Positive

- **Cost Optimization**: Only LLM calls incur costs (~$0.01-0.02/query); embedding and retrieval are free (client-side)
- **Low Latency**: Client-side retrieval <100ms, total response <2s (retrieval + LLM generation)
- **GitHub Pages Compatible**: No server infrastructure needed on static site; Vercel serverless for LLM only
- **Scalability**: Handles thousands of concurrent users without infrastructure scaling (vector search client-side)
- **Offline Retrieval**: Content search works offline; only LLM generation requires connectivity
- **Multilingual Support**: multilingual-e5-small embeddings support both English and Urdu queries natively
- **Accurate Citations**: Prompt engineering ensures LLM cites specific chapters/sections with deep links
- **Aggressive Caching**: Vercel KV cache reduces costs by 60-70% for common curriculum questions
- **Small Bundle**: 2-3MB embeddings compressed is acceptable for educational site

### Negative

- **Initial Download Size**: 2-3MB embeddings increase initial page load (mitigated by lazy loading)
- **Client Memory Usage**: Loading embeddings into browser memory (~5-10MB uncompressed)
- **API Dependency**: Requires LLM API (Claude/OpenAI) for generation; vendor lock-in risk
- **No Server-Side Filtering**: Cannot implement complex retrieval logic on server (all client-side)
- **Limited Context Window**: Client-side approach restricts how many chunks can be sent to LLM (top-3 only due to cost)
- **Embedding Updates**: Updating textbook content requires rebuilding embeddings and redeploying site (not real-time)
- **Rate Limiting Complexity**: Must implement client-side rate limiting (can be bypassed by determined users)
- **LLM Cost Variability**: At scale (100K+ queries), costs become unpredictable without strict controls

## Alternatives Considered

### Alternative Architecture A: Fully API-Based (Pinecone + OpenAI)
- **Components**: Pinecone vector database (API), OpenAI embeddings (API), OpenAI GPT-4 (API)
- **Cost**: $200-300/month for 10K queries (3 API calls per query)
- **Latency**: 2-3 seconds (network round-trips for embedding, retrieval, generation)
- **Why Rejected**:
  - Higher costs due to embedding API calls ($0.02/1M tokens) and retrieval API overhead
  - Three API round-trips per query increase latency
  - Pinecone free tier limits (1M vectors, but usage-based pricing after)
  - No cost reduction from client-side processing
- **When to Reconsider**: If textbook content updates frequently (daily/weekly) and requires real-time embedding updates

### Alternative Architecture B: Self-Hosted (Weaviate + Llama 3.1 70B)
- **Components**: Self-hosted Weaviate (Docker), self-hosted Llama 3.1 70B (GPU instance), custom API server
- **Infrastructure Cost**: $500+/month (GPU instance for Llama, server for Weaviate, bandwidth)
- **Latency**: <1 second (local inference)
- **Why Rejected**:
  - High infrastructure costs (dedicated GPU server required)
  - Complex deployment and maintenance (Docker, model serving, load balancing)
  - Incompatible with GitHub Pages constraint (requires always-on server)
  - Engineering overhead (DevOps, monitoring, scaling)
- **When to Reconsider**: If project has dedicated infrastructure budget and in-house ML ops expertise
- **Strengths Acknowledged**: Full control, best privacy, lowest per-query cost at extreme scale

### Alternative Architecture C: Fully Client-Side (Transformers.js + WebLLM)
- **Components**: Transformers.js for embeddings, WebLLM for generation (all in-browser)
- **Bundle Size**: 100MB+ (LLM model weights)
- **Why Rejected**:
  - Massive bundle size (100MB+ for even small models) unacceptable for educational site
  - Poor performance on mobile devices and older computers
  - Limited model quality compared to GPT-4o-mini/Claude
  - No multilingual support in available quantized models
- **When to Reconsider**: When browser ML matures and small (<10MB) multilingual models become available

## References

- Feature Spec: [specs/001-ai-native-textbook/spec.md](../../specs/001-ai-native-textbook/spec.md) - FR-016 through FR-021 (RAG requirements)
- Implementation Plan: [specs/001-ai-native-textbook/plan.md](../../specs/001-ai-native-textbook/plan.md) - Technical Context line 15
- Research Document: [specs/001-ai-native-textbook/research.md](../../specs/001-ai-native-textbook/research.md) - Decision 2 (pages 10-25, comprehensive cost analysis and architecture comparison)
- Related ADRs: ADR-0001 (Frontend Platform Stack - Docusaurus enables MDX component embedding for chatbot UI)
- Cost Analysis: MVP $8-13/mo (1K students), Production $110-150/mo (10K students) with GPT-4o-mini + caching
- Embedding Model: [multilingual-e5-small on Hugging Face](https://huggingface.co/intfloat/multilingual-e5-small)
