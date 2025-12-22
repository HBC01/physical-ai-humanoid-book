---
id: 0002
title: Implementation Planning for AI-Native Textbook
stage: plan
date: 2025-12-21
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-ai-native-textbook
branch: 001-ai-native-textbook
user: unknown
command: /sp.plan
labels: ["planning", "architecture", "research", "docusaurus", "rag", "progress-tracking"]
links:
  spec: specs/001-ai-native-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-ai-native-textbook/plan.md
  - specs/001-ai-native-textbook/research.md
tests:
  - N/A (planning phase)
---

## Prompt

Execute /sp.plan command for the AI-native textbook feature (001-ai-native-textbook).

## Response snapshot

Completed comprehensive implementation planning for the Physical AI & Humanoid Robotics AI-native textbook:

**Phase 0 Research (Completed)**:
- Launched 3 parallel research agents for critical technical decisions
- **Decision 1**: Static Site Generator → Docusaurus v3 (107/120 score, native i18n/RTL, docs-focused)
- **Decision 2**: RAG Chatbot → Hybrid client-side + serverless (cost-effective $8-13/mo MVP, <2s latency)
- **Decision 3**: Progress Tracking → localStorage + Zustand persist (1KB bundle, privacy-preserving)

**Key Artifacts Created**:
1. **plan.md**: Updated with Technical Context, Constitution Check (all ✅ PASS), Project Structure (Docusaurus-based)
2. **research.md**: Comprehensive 15-page research document with decision rationale, alternatives considered, cost analysis, implementation timelines

**Technical Architecture**:
- Frontend: Docusaurus v3 static site with React 18, MDX v2, deployed to GitHub Pages
- RAG: Client-side vector search (vectordb.js) + Vercel serverless for LLM (GPT-4o-mini/Claude)
- Storage: Zustand with localStorage persist for progress tracking
- i18n: Native Docusaurus i18n with Urdu RTL support
- Build: 2-5min for 21+ chapters, automated via GitHub Actions

**Constitutional Compliance**: All 10 principles satisfied (Spec-Driven, Curriculum Alignment, AI-Native, Modular Content, Beginner-Friendly Code, Simulation-First, GitHub Pages, Extension-Ready, Clarity, Explained Decisions)

**Cost Estimates**:
- MVP (1,000 students): $8-13/month
- Production (10,000 students): $110-470/month (depending on LLM choice)

**Project Structure Defined**: Clear separation between content (`docs/modules/`), components (`src/components/`), services (`src/services/`), and configuration.

**Next Phase**: Phase 1 design artifacts (data-model.md, contracts/, quickstart.md) to inform task generation.

## Outcome

- ✅ Impact: Comprehensive implementation plan with all critical architectural decisions resolved through research. Clear technical direction for hackathon submission.
- 🧪 Tests: N/A (planning phase, no code written)
- 📁 Files: Updated plan.md with Technical Context and Constitution Check; created research.md (15 pages with 3 major decisions documented)
- 🔁 Next prompts: Continue with Phase 1 design artifacts (data-model.md, contracts/, quickstart.md) or proceed to /sp.tasks for task generation
- 🧠 Reflection: Parallel research agents successfully evaluated 3 critical decisions simultaneously, saving significant time. Docusaurus emerged as clear winner (107/120) for static site generation. Hybrid RAG architecture optimizes for cost ($8-13/mo MVP) while maintaining <2s response times. All decisions align with constitutional principles and hackathon scoring criteria (RAG for AI-native, personalization for bonus).

## Evaluation notes (flywheel)

- Failure modes observed: None. Parallel research agents completed successfully with comprehensive findings.
- Graders run and results (PASS/FAIL): Constitutional Compliance Check - ALL 10 PRINCIPLES PASS
- Prompt variant (if applicable): N/A (standard planning workflow)
- Next experiment (smallest change to try): Validate Docusaurus v3 i18n/RTL with actual Urdu content early in implementation; test client-side vector search performance with 21-chapter embeddings bundle
