# Implementation Plan: Physical AI Learning Platform

**Branch**: `001-learning-platform` | **Date**: 2026-01-01 | **Spec**: `/specs/001-learning-platform/spec.md`
**Input**: Feature specification from `/specs/001-learning-platform/spec.md`

## Summary

Build a Physical AI educational ecosystem featuring a Docusaurus textbook and a RAG-powered chatbot. The platform integrates hardware-based content personalization and instant Urdu translation. The architecture uses a FastAPI backend to orchestrate Qdrant Cloud vector search and Gemini 2.5 Flash intelligence, while BetterAuth manages localized user profiles.

## Technical Context

**Language/Version**: Python 3.11, TypeScript 5.x
**Primary Dependencies**: FastAPI, Docusaurus, OpenAI SDK (for Gemini), BetterAuth
**Storage**: Neon PostgreSQL (Relational), Qdrant Cloud (Vector)
**Testing**: Pytest, Vitest, Playwright
**Target Platform**: GitHub Pages (Frontend), Vercel/Fly.io (Backend)
**Project Type**: Web Application (Frontend + Backend)
**Performance Goals**: <5s Chatbot response, <1s Translation toggle latency
**Constraints**: ROS 2 / Isaac Sim compatible code examples
**Scale/Scope**: 13 Chapters, 7 Core Modules

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] I. Domain-Specific Accuracy (ROS 2/Isaac/VLA)
- [x] II. RAG-First Contextual Awareness (Book as source)
- [x] III. Adaptive Learning & Personalization
- [x] IV. Localization (Urdu translation)
- [x] V. Integrated Tech Stack (Docusaurus/FastAPI/Neon/Qdrant/Gemini)

## Project Structure

### Documentation (this feature)

```text
specs/001-learning-platform/
├── plan.md              # This file
├── research.md          # RAG/Auth strategies
├── data-model.md        # User & Vector schemas
├── quickstart.md        # Dev setup
├── contracts/           # API definitions
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
physical-ai-book/        # Docusaurus Frontend
├── docs/                # Chapter Markdown (Week 1-13)
├── src/
│   ├── components/      # ChatWidget, PersonalizationToggle
│   └── services/        # API client for Backend
└── docusaurus.config.ts

backend/                 # FastAPI Backend
├── src/
│   ├── api/             # Endpoints (chat, translate, profiles)
│   ├── services/        # RAG Engine, Gemini/Qdrant clients
│   └── models/          # SQLAlchemy/Pydantic schemas
└── tests/               # Integration & Contract tests
```

**Structure Decision**: Split Frontend/Backend directories to accommodate the dual-stack nature (TypeScript/Docusaurus for content, Python/FastAPI for AI/Robotics integrations).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Dual-Stack (TS/Python) | Ecosystem alignment | Node.js backend would lack robust native ROS 2/Robotics library support. |
