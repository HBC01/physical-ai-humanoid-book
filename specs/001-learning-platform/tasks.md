# Tasks: Physical AI Learning Platform

**Input**: Design documents from `/specs/001-learning-platform/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Pytest for backend logic and Vitest for frontend components are requested.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Path Conventions

- **Web app**: `backend/src/`, `physical-ai-book/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend directory structure in /backend
- [X] T002 Initialize FastAPI project with dependencies in backend/requirements.txt
- [X] T003 Configure BetterAuth in backend/src/core/auth.py
- [X] T004 [P] Setup TypeScript configurations for physical-ai-book/tsconfig.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Setup Neon PostgreSQL connection in backend/src/core/database.py
- [X] T006 [P] Implement Qdrant Cloud client in backend/src/services/vector_store.py
- [X] T007 [P] Implement Gemini 2.5 Flash client (OpenAI SDK) in backend/src/services/ai_client.py
- [X] T008 Setup User and Profile models in backend/src/models/user.py
- [X] T009 Create ingestion script for textbook content in backend/scripts/ingest_docs.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Interactive Textbook Learning (Priority: P1) 🎯 MVP

**Goal**: Students can read ROS 2 content and get chatbot answers about rclpy examples.

**Independent Test**: Chatbot answers a specific query about an rclpy snippet from the ROS 2 chapter.

### Implementation for User Story 1

- [X] T010 [P] [US1] Write Week 1-2 (ROS 2) chapters in physical-ai-book/docs/
- [X] T011 [US1] Implement RAG retrieval logic in backend/src/services/rag_engine.py
- [X] T012 [US1] Create Chat API endpoint in backend/src/api/chat.py
- [X] T013 [P] [US1] Develop ChatWidget component in physical-ai-book/src/components/ChatWidget.tsx
- [X] T014 [US1] Integrate ChatWidget into Docusaurus theme in physical-ai-book/src/theme/Root.tsx

**Checkpoint**: User Story 1 (MVP) is fully functional.

---

## Phase 4: User Story 2 - Localized Accessibility (Priority: P2)

**Goal**: Provide Urdu translation for textbook chapters using Gemini.

**Independent Test**: Urdu toggle translates chapter text without breaking layout.

### Implementation for User Story 2

- [ ] T015 [P] [US2] Create Translation API endpoint in backend/src/api/translate.py
- [ ] T016 [US2] Implement translation caching logic in backend/src/services/translator.py
- [ ] T017 [P] [US2] Create TranslationToggle component in physical-ai-book/src/components/TranslationToggle.tsx
- [ ] T018 [US2] Add Week 3-6 (Gazebo/Unity) content in physical-ai-book/docs/

**Checkpoint**: Localization features are functional.

---

## Phase 5: User Story 3 - Personalized Robotics Simulation (Priority: P3)

**Goal**: Adapt technical examples based on user's hardware (e.g., Orin Nano).

**Independent Test**: Authenticated user sees Orin-specific highlights in Isaac Sim module.

### Implementation for User Story 3

- [ ] T019 [P] [US3] Implement hardware profile update API in backend/src/api/profiles.py
- [ ] T020 [US3] Implement content filtering logic in backend/src/services/personalizer.py
- [ ] T021 [P] [US3] Create ProfileSettings component in physical-ai-book/src/components/ProfileSettings.tsx
- [ ] T022 [US3] Add Week 7-13 (Isaac Sim / VLA) content in physical-ai-book/docs/

---

## Phase N: Polish & Deployment

- [ ] T023 [P] Configure GitHub Pages deployment for physical-ai-book/
- [ ] T024 Final E2E testing of RAG + Auth flow
- [ ] T025 Cleanup and documentation in README.md

---

## Dependencies & Execution Order

1. **Setup & Foundation** (T001-T009) must be completed first.
2. **User Story 1** (T010-T014) is the MVP and should follow foundation.
3. **User Story 2 & 3** can proceed in parallel once foundation is ready.

## Parallel Options: User Story 1
```bash
# Frontend and content can start together
Task: T010 [US1] Write ROS 2 chapters
Task: T013 [US1] Develop ChatWidget component
```
