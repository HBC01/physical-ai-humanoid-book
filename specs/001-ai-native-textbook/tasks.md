# Tasks: Physical AI & Humanoid Robotics – An AI-Native Textbook

**Input**: Design documents from `/specs/001-ai-native-textbook/`
**Prerequisites**: plan.md (✅ complete), spec.md (✅ complete), research.md (✅ complete), ADRs (✅ 3 created)

**Tests**: Not explicitly requested in spec - tasks focus on content creation and feature implementation

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Static documentation site structure:
- **Content**: `docs/modules/[module-name]/` for curriculum chapters
- **Components**: `src/components/` for React components
- **Services**: `src/services/` for business logic
- **i18n**: `i18n/en/`, `i18n/ur/` for translations
- **Config**: Root-level configuration files

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Docusaurus project and basic structure

- [x] T001 Initialize Docusaurus v3 project with TypeScript and React 18
- [x] T002 [P] Configure package.json with dependencies (Docusaurus v3, React 18, MDX v2, Zustand, TypeScript, Jest, Playwright, axe-core)
- [x] T003 [P] Create project directory structure (docs/modules/, src/components/, src/services/, i18n/, tests/)
- [x] T004 [P] Configure docusaurus.config.js with i18n settings (en, ur locales), GitHub Pages baseUrl
- [x] T005 [P] Configure sidebars.js for 7-module navigation structure
- [x] T006 [P] Setup TypeScript configuration in tsconfig.json
- [x] T007 [P] Configure ESLint and Prettier for code quality
- [x] T008 Create .github/workflows/deploy.yml for GitHub Actions deployment to GitHub Pages

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create docs/modules/ directory with 7 module subdirectories (01-foundations/, 02-ros2/, 03-simulation/, 04-isaac/, 05-vla/, 06-conversational/, 07-capstone/)
- [x] T010 [P] Create homepage in docs/index.mdx with textbook introduction and navigation
- [x] T011 [P] Create module index pages (docs/modules/[01-07]-*/index.mdx) with module overviews
- [x] T012 [P] Setup Docusaurus theme configuration in src/theme/ for custom styling
- [x] T013 [P] Configure Algolia DocSearch or local search plugin in docusaurus.config.js
- [x] T014 [P] Create base React component structure in src/components/ (AIAssistant/, ProgressTracker/, ExerciseRunner/, CodeBlock/, LanguageSwitcher/)
- [x] T015 Create src/services/progress/storage.ts with Zustand store and localStorage persist setup
- [x] T016 [P] Setup i18n directory structure (i18n/en/docusaurus-plugin-content-docs/, i18n/ur/docusaurus-plugin-content-docs/)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Core Curriculum Content Access (Priority: P1) 🎯 MVP

**Goal**: Deliver complete educational content for all 7 modules with 21+ chapters, navigation, search, and responsive design

**Independent Test**: Visit deployed textbook, navigate through all 7 modules, verify all chapters present, test search functionality, check mobile responsiveness

### Content Creation for User Story 1

**Module 1: Foundations of Physical AI & Embodied Intelligence**

- [x] T017 [P] [US1] Write docs/modules/01-foundations/chapter-01-intro.mdx (Introduction to Physical AI, 2000-4000 words, learning objectives, diagrams)
- [x] T018 [P] [US1] Write docs/modules/01-foundations/chapter-02-embodied-intelligence.mdx (Embodied Intelligence concepts, 2000-4000 words, code examples)
- [x] T019 [P] [US1] Write docs/modules/01-foundations/chapter-03-physical-systems.mdx (Physical Systems overview, 2000-4000 words, Mermaid diagrams)

**Module 2: ROS 2 - Robotic Nervous System**

- [X] T020 [P] [US1] Write docs/modules/02-ros2/chapter-01-ros2-intro.mdx (ROS 2 introduction, installation, 2000-4000 words, setup instructions)
- [X] T021 [P] [US1] Write docs/modules/02-ros2/chapter-02-nodes-topics.mdx (Nodes and topics, 2000-4000 words, Python code examples with comments)
- [X] T022 [P] [US1] Write docs/modules/02-ros2/chapter-03-services-actions.mdx (Services and actions, 2000-4000 words, beginner-friendly examples)

**Module 3: Gazebo & Unity - Digital Twin**

- [ ] T023 [P] [US1] Write docs/modules/03-simulation/chapter-01-gazebo-intro.mdx (Gazebo introduction, 2000-4000 words, installation guide)
- [ ] T024 [P] [US1] Write docs/modules/03-simulation/chapter-02-unity-robotics.mdx (Unity for robotics, 2000-4000 words, setup instructions)
- [ ] T025 [P] [US1] Write docs/modules/03-simulation/chapter-03-digital-twins.mdx (Digital twin concepts, 2000-4000 words, practical examples)

**Module 4: NVIDIA Isaac Sim & Isaac ROS**

- [ ] T026 [P] [US1] Write docs/modules/04-isaac/chapter-01-isaac-sim-intro.mdx (Isaac Sim introduction, 2000-4000 words, CPU-compatible setup)
- [ ] T027 [P] [US1] Write docs/modules/04-isaac/chapter-02-isaac-ros.mdx (Isaac ROS integration, 2000-4000 words, ROS 2 bridge examples)
- [ ] T028 [P] [US1] Write docs/modules/04-isaac/chapter-03-simulation-workflows.mdx (Simulation workflows, 2000-4000 words, performance notes for CPU vs GPU)

**Module 5: Vision-Language-Action (VLA)**

- [ ] T029 [P] [US1] Write docs/modules/05-vla/chapter-01-vla-intro.mdx (VLA concepts, 2000-4000 words, multimodal learning)
- [ ] T030 [P] [US1] Write docs/modules/05-vla/chapter-02-vision-systems.mdx (Vision systems for robots, 2000-4000 words, OpenCV examples)
- [ ] T031 [P] [US1] Write docs/modules/05-vla/chapter-03-language-grounding.mdx (Language grounding, 2000-4000 words, NLP integration)

**Module 6: Conversational Robotics**

- [ ] T032 [P] [US1] Write docs/modules/06-conversational/chapter-01-dialog-systems.mdx (Dialog systems, 2000-4000 words, chatbot basics)
- [ ] T033 [P] [US1] Write docs/modules/06-conversational/chapter-02-speech-recognition.mdx (Speech recognition for robots, 2000-4000 words, libraries and tools)
- [ ] T034 [P] [US1] Write docs/modules/06-conversational/chapter-03-natural-interaction.mdx (Natural human-robot interaction, 2000-4000 words, UX patterns)

**Module 7: Capstone - Autonomous Humanoid Robot**

- [ ] T035 [P] [US1] Write docs/modules/07-capstone/chapter-01-project-overview.mdx (Capstone project overview, 2000-4000 words, integration of all modules)
- [ ] T036 [P] [US1] Write docs/modules/07-capstone/chapter-02-implementation-guide.mdx (Step-by-step implementation, 2000-4000 words, full code examples)
- [ ] T037 [P] [US1] Write docs/modules/07-capstone/chapter-03-deployment.mdx (Deployment and testing, 2000-4000 words, troubleshooting guide)

### Navigation & Search for User Story 1

- [X] T038 [US1] Update sidebars.js with complete navigation structure for all 7 modules and 21 chapters
- [X] T039 [US1] Configure search indexing (Algolia or local search) to cover all chapter content
- [X] T040 [US1] Add breadcrumb navigation and "Next Chapter" links to chapter templates

### UI Polish for User Story 1

- [X] T041 [P] [US1] Create responsive CSS overrides in src/theme/custom.css for mobile optimization
- [X] T042 [P] [US1] Add custom React components for enhanced code blocks with syntax highlighting in src/components/CodeBlock/
- [X] T043 [P] [US1] Implement dark mode toggle (Docusaurus built-in) and test across all pages

**Checkpoint**: At this point, User Story 1 should be fully functional - 7 modules with 21+ chapters, full navigation, search, and responsive design

---

## Phase 4: User Story 2 - Simulation-Based Hands-On Exercises (Priority: P2)

**Goal**: Deliver practical simulation exercises for each module with setup instructions, expected outcomes, and troubleshooting

**Independent Test**: Select an exercise from any module, follow setup instructions on CPU-only system, run simulation, verify expected behavior matches documentation

### Exercise Creation for User Story 2

- [X] T044 [P] [US2] Create docs/exercises/ros2-publisher/ with exercise-01-simple-publisher.mdx (ROS 2 publisher exercise, Gazebo setup, expected output)
- [X] T045 [P] [US2] Create docs/exercises/ros2-subscriber/ with exercise-02-subscriber-node.mdx (ROS 2 subscriber exercise, troubleshooting section)
- [X] T046 [P] [US2] Create docs/exercises/gazebo-robot-spawn/ with exercise-03-spawn-robot.mdx (Gazebo robot spawning, URDF setup, CPU compatibility notes)
- [X] T047 [P] [US2] Create docs/exercises/pybullet-control/ with exercise-04-robot-control.mdx (PyBullet control exercise, Python code, variations)
- [X] T048 [P] [US2] Create docs/exercises/isaac-navigation/ with exercise-05-navigation.mdx (Isaac Sim navigation, setup instructions, GPU vs CPU performance)
- [X] T049 [P] [US2] Create docs/exercises/vla-vision/ with exercise-06-object-detection.mdx (VLA vision exercise, OpenCV integration, expected results)
- [X] T050 [P] [US2] Create docs/exercises/conversational-speech/ with exercise-07-speech-commands.mdx (Speech recognition exercise, library setup, testing)
- [X] T051 [P] [US2] Create docs/exercises/capstone-integration/ with exercise-08-full-integration.mdx (Capstone integration exercise, all modules combined)

### Exercise Runner Component for User Story 2

- [X] T052 [US2] Implement src/components/ExerciseRunner/index.tsx (React component to display exercise instructions, setup, and results)
- [X] T053 [US2] Add ExerciseRunner component to exercise MDX files for interactive display
- [X] T054 [US2] Create docs/exercises/troubleshooting.md with common issues and solutions across all simulation tools

**Checkpoint**: At this point, User Story 2 should be fully functional - 8+ exercises with setup, execution, and troubleshooting guides

---

## Phase 5: User Story 3 - AI Assistant for Learning Support (Priority: P3)

**Goal**: Deliver RAG chatbot that answers questions, provides citations, and maintains conversational context

**Independent Test**: Open AI assistant, ask curriculum questions, verify contextually relevant responses with chapter citations

### RAG Infrastructure for User Story 3

- [X] T055 [US3] Create scripts/generate-embeddings.py (Python script to chunk chapters into 500-1000 token pieces with 50-token overlap)
- [X] T056 [US3] Implement embedding generation using multilingual-e5-small in scripts/generate-embeddings.py (output JSON with chunk metadata)
- [X] T057 [US3] Create src/services/rag/embeddings.ts to load pre-computed embeddings into client-side vector index
- [X] T058 [US3] Implement src/services/rag/retrieval.ts with cosine similarity search for top-3 chunk retrieval
- [X] T059 [US3] Create api/chat.ts Vercel serverless function for LLM generation (GPT-4o-mini, prompt engineering for citations)
- [X] T060 [US3] Implement src/services/rag/llm-client.ts to call Vercel API with retrieved chunks

### AI Assistant UI Component for User Story 3

- [X] T061 [US3] Implement src/components/AIAssistant/ChatInterface.tsx (chat UI with message history, input field)
- [X] T062 [US3] Implement src/components/AIAssistant/CitationParser.tsx (parse `[Chapter X, Section Y]` into clickable links)
- [X] T063 [US3] Implement src/hooks/useAIAssistant.ts (React hook for chat state, message sending, context tracking)
- [X] T064 [US3] Add AIAssistant component to Docusaurus theme layout (accessible from all pages)
- [X] T065 [US3] Implement current chapter context detection (URL-based) and pass to RAG system

### RAG Optimization for User Story 3

- [X] T066 [P] [US3] Setup Vercel KV caching for common questions in api/chat.ts
- [X] T067 [P] [US3] Implement rate limiting (20 queries/user/day, 2/minute) in api/chat.ts
- [X] T068 [P] [US3] Add prompt engineering for English and Urdu support in api/chat.ts

**Checkpoint**: At this point, User Story 3 should be fully functional - AI assistant with RAG, citations, and conversational context

---

## Phase 6: User Story 4 - Progress Tracking and Personalization (Priority: P4)

**Goal**: Deliver progress tracking, learning profiles, and personalized recommendations

**Independent Test**: Create profile, mark chapters complete, verify progress tracking, check personalized recommendations

### Progress Tracking Infrastructure for User Story 4

- [X] T069 [US4] Implement src/services/progress/storage.ts with Zustand store (profile, progress, metadata) and localStorage persist
- [X] T070 [US4] Create src/services/progress/recommendations.ts with rule-based recommendation engine (prerequisites, struggle detection, goals)
- [X] T071 [US4] Implement src/hooks/useProgress.ts (React hook for progress tracking, chapter completion, exercise attempts)
- [X] T072 [US4] Add export/import/clear functions to src/services/progress/storage.ts (JSON download, file upload, data erasure)

### Progress Tracking UI Components for User Story 4

- [X] T073 [US4] Implement src/components/ProgressTracker/Dashboard.tsx (completion %, visual progress bars, recommendations widget)
- [X] T074 [US4] Implement src/components/ProgressTracker/ProfileSetup.tsx (experience level, learning goals, language preference)
- [X] T075 [US4] Implement src/components/ProgressTracker/ChapterProgress.tsx (mark complete, track time spent, resume reading)
- [X] T076 [US4] Implement src/components/ProgressTracker/ExerciseProgress.tsx (track attempts, completion status, struggle detection)
- [X] T077 [US4] Create /dashboard custom page in src/pages/dashboard.tsx with full ProgressTracker dashboard
- [X] T078 [US4] Add progress indicators to sidebar navigation (checkmarks for completed chapters)

### Recommendation Engine for User Story 4

- [X] T079 [US4] Implement sequential progression recommendations in src/services/progress/recommendations.ts
- [X] T080 [US4] Implement struggle detection (>3 exercise attempts) → review chapter recommendations
- [X] T081 [US4] Implement time-away detection (>7 days) → refresher recommendations
- [X] T082 [US4] Implement goal alignment recommendations based on user-stated goals

**Checkpoint**: At this point, User Story 4 should be fully functional - progress tracking, dashboard, and personalized recommendations

---

## Phase 7: User Story 5 - Multi-Language Support with Urdu Translation (Priority: P5)

**Goal**: Deliver Urdu translation with RTL support for all core content

**Independent Test**: Switch to Urdu, navigate chapters, verify RTL rendering, test language switcher, check AI assistant in Urdu

### i18n Setup for User Story 5

- [X] T083 [US5] Configure Docusaurus i18n in docusaurus.config.js for Urdu locale (ur) with RTL support
- [X] T084 [US5] Create i18n/ur/ directory structure mirroring i18n/en/ for translated content
- [X] T085 [US5] Translate UI strings (navigation, buttons, labels) in i18n/ur/docusaurus-theme-classic/

### Content Translation for User Story 5

- [X] T086 [P] [US5] Translate Module 1 chapters (3 chapters) to Urdu in i18n/ur/docusaurus-plugin-content-docs/modules/01-foundations/
- [X] T087 [P] [US5] Translate Module 2 chapters (3 chapters) to Urdu in i18n/ur/docusaurus-plugin-content-docs/modules/02-ros2/
- [X] T088 [P] [US5] Translate Module 3 chapters (3 chapters) to Urdu in i18n/ur/docusaurus-plugin-content-docs/modules/03-simulation/
- [X] T089 [P] [US5] Translate Module 4 chapters (3 chapters) to Urdu in i18n/ur/docusaurus-plugin-content-docs/modules/04-isaac/
- [X] T090 [P] [US5] Translate Module 5 chapters (3 chapters) to Urdu in i18n/ur/docusaurus-plugin-content-docs/modules/05-vla/
- [X] T091 [P] [US5] Translate Module 6 chapters (3 chapters) to Urdu in i18n/ur/docusaurus-plugin-content-docs/modules/06-conversational/
- [X] T092 [P] [US5] Translate Module 7 chapters (3 chapters) to Urdu in i18n/ur/docusaurus-plugin-content-docs/modules/07-capstone/
- [X] T093 [P] [US5] Translate exercise documentation to Urdu with code examples remaining in original syntax but Urdu comments

### Language Switcher Component for User Story 5

- [X] T094 [US5] Implement src/components/LanguageSwitcher/index.tsx (dropdown to switch between English and Urdu)
- [X] T095 [US5] Add LanguageSwitcher to Docusaurus theme layout (navbar)
- [X] T096 [US5] Implement language preference persistence in localStorage
- [X] T097 [US5] Test RTL rendering for Urdu content across all pages and components

### Urdu Support for AI Assistant (User Story 5)

- [X] T098 [US5] Update api/chat.ts to detect Urdu queries and respond in Urdu
- [X] T099 [US5] Update src/services/rag/embeddings.ts to support Urdu embeddings (multilingual-e5-small already supports)
- [X] T100 [US5] Test AI assistant with Urdu questions and verify citations work correctly

**Checkpoint**: At this point, User Story 5 should be fully functional - full Urdu translation with RTL, language switcher, and Urdu AI assistant

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final polish, documentation, testing, and deployment setup

- [X] T101 [P] Run axe-core accessibility audit on all pages and fix WCAG 2.1 AA violations
- [X] T102 [P] Setup Jest configuration in jest.config.js and write component tests for AIAssistant, ProgressTracker
- [X] T103 [P] Setup Playwright configuration in playwright.config.ts and write E2E tests for navigation, search, exercises
- [X] T104 [P] Optimize images in docs/assets/ and configure Docusaurus image optimization
- [X] T105 [P] Add code linting validation to GitHub Actions workflow (ESLint, Prettier)
- [X] T106 [P] Setup Vercel project for serverless API deployment and configure environment variables for LLM API key
- [X] T107 [P] Create README.md with project overview, setup instructions, and contribution guidelines
- [X] T108 [P] Create docs/contributors-guide.md with content authoring guidelines and MDX component usage
- [X] T109 Run full build (npm run build) and verify build completes in <10 minutes with all 21+ chapters
- [X] T110 Deploy to GitHub Pages and verify all 7 modules, exercises, AI assistant, and progress tracking work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 (exercises need chapter content as context)
- **User Story 3 (Phase 5)**: Depends on User Story 1 (RAG needs chapter content to embed)
- **User Story 4 (Phase 6)**: Depends on User Story 1 (progress tracking needs chapters to track)
- **User Story 5 (Phase 7)**: Depends on User Story 1 completion (translation needs English content finalized)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ MVP
- **User Story 2 (P2)**: Depends on US1 (needs chapters for exercise context)
- **User Story 3 (P3)**: Depends on US1 (needs chapters to embed for RAG)
- **User Story 4 (P4)**: Depends on US1 (needs chapters to track progress)
- **User Story 5 (P5)**: Depends on US1 (needs English content to translate)

### Within Each User Story

**User Story 1 (Content)**:
- T017-T037: All chapter writing tasks can run in parallel (different files)
- T038-T040: Navigation tasks run after all chapters written
- T041-T043: UI polish can run in parallel after foundational setup

**User Story 2 (Exercises)**:
- T044-T051: All exercise creation tasks can run in parallel (different files)
- T052-T054: Exercise runner component and troubleshooting after exercises created

**User Story 3 (RAG)**:
- T055-T056: Embedding generation must run first (creates data for retrieval)
- T057-T060: RAG infrastructure tasks sequential (embeddings → retrieval → LLM client)
- T061-T065: UI components can run in parallel after infrastructure ready
- T066-T068: Optimization tasks can run in parallel

**User Story 4 (Progress)**:
- T069-T072: Infrastructure tasks sequential (store → recommendations → hooks → export)
- T073-T078: UI components can run in parallel after infrastructure ready
- T079-T082: Recommendation engine enhancements can run in parallel

**User Story 5 (i18n)**:
- T083-T085: i18n setup must run first
- T086-T093: All translation tasks can run in parallel (different files/modules)
- T094-T097: Language switcher tasks sequential
- T098-T100: AI assistant Urdu support sequential

---

## Parallel Execution Examples

### Phase 1 (Setup)
All tasks except T001 can run in parallel after project initialization:
```bash
# Run in parallel: T002, T003, T004, T005, T006, T007, T008
```

### Phase 3 (User Story 1 - Content)
Module writing can be fully parallelized:
```bash
# Module 1: T017, T018, T019 (parallel)
# Module 2: T020, T021, T022 (parallel)
# Module 3: T023, T024, T025 (parallel)
# Module 4: T026, T027, T028 (parallel)
# Module 5: T029, T030, T031 (parallel)
# Module 6: T032, T033, T034 (parallel)
# Module 7: T035, T036, T037 (parallel)
# UI polish: T041, T042, T043 (parallel)
```

### Phase 4 (User Story 2 - Exercises)
All exercise creation can run in parallel:
```bash
# Exercises: T044, T045, T046, T047, T048, T049, T050, T051 (parallel)
```

### Phase 5 (User Story 3 - RAG)
Optimization tasks can run in parallel:
```bash
# RAG optimization: T066, T067, T068 (parallel)
```

### Phase 7 (User Story 5 - i18n)
Translation tasks can be fully parallelized:
```bash
# Translations: T086, T087, T088, T089, T090, T091, T092, T093 (parallel)
```

### Phase 8 (Polish)
Most polish tasks can run in parallel:
```bash
# Polish: T101, T102, T103, T104, T105, T106, T107, T108 (parallel)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T016)
3. Complete Phase 3: User Story 1 - Core Content (T017-T043)
4. **STOP and VALIDATE**: Deploy to GitHub Pages, test 7 modules with 21 chapters, verify navigation and search
5. Demo MVP to stakeholders

**MVP Scope**: 7 modules, 21+ chapters, full navigation, search, responsive design
**Estimated Effort**: ~4-6 weeks for content creation + 1 week for setup/polish

### Incremental Delivery (Add Features Progressively)

1. Complete MVP (Phase 1-3) → Deploy → Test
2. Add User Story 2: Exercises (T044-T054) → Deploy → Test (simulation-based learning)
3. Add User Story 3: RAG Chatbot (T055-T068) → Deploy → Test (AI-native design, high hackathon value)
4. Add User Story 4: Progress Tracking (T069-T082) → Deploy → Test (personalization, bonus points)
5. Add User Story 5: Urdu Translation (T083-T100) → Deploy → Test (i18n, bonus points)
6. Polish (T101-T110) → Final deployment

**Benefit**: Each phase delivers independently testable value; can ship MVP early and iterate

### Parallel Team Strategy

With multiple developers/contributors:

1. **Team completes Phase 1-2 together** (setup and foundation)
2. **Once Foundational ready, parallelize content creation**:
   - Contributor A: Modules 1-2 (T017-T022)
   - Contributor B: Modules 3-4 (T023-T028)
   - Contributor C: Modules 5-7 (T029-T037)
3. **After content complete, parallelize features**:
   - Developer A: User Story 2 (Exercises, T044-T054)
   - Developer B: User Story 3 (RAG Chatbot, T055-T068)
   - Developer C: User Story 4 (Progress Tracking, T069-T082)
4. **i18n and Polish** can be parallelized across team

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run simultaneously
- **[Story] labels**: Map to user stories for traceability (US1 = P1, US2 = P2, etc.)
- **File paths**: Explicit paths ensure tasks are immediately executable
- **Tests**: Not explicitly requested in spec, so test tasks are minimal (accessibility, E2E for validation)
- **Commit strategy**: Commit after completing each user story phase for clear git history
- **Content quality**: Each chapter 2000-4000 words with code examples, diagrams, learning objectives (per spec FR-004, FR-011)
- **Accessibility**: WCAG 2.1 AA required (FR-032-034, SC-008) - validated in Phase 8
- **Build performance**: Target <10min builds for 21+ chapters (plan.md performance goal)

---

## Task Summary

**Total Tasks**: 110
- **Phase 1 (Setup)**: 8 tasks
- **Phase 2 (Foundational)**: 8 tasks
- **Phase 3 (User Story 1 - Content)**: 27 tasks
- **Phase 4 (User Story 2 - Exercises)**: 11 tasks
- **Phase 5 (User Story 3 - RAG)**: 14 tasks
- **Phase 6 (User Story 4 - Progress)**: 14 tasks
- **Phase 7 (User Story 5 - i18n)**: 18 tasks
- **Phase 8 (Polish)**: 10 tasks

**Parallel Opportunities**: 65 tasks marked [P] (59% parallelizable)

**MVP Scope**: Phases 1-3 (43 tasks) = Core textbook with 7 modules and 21 chapters

**High-Value for Hackathon**:
- US1 (P1): Core content ✅ Required
- US3 (P3): RAG chatbot ⭐ High scoring (AI-native design)
- US2 (P2): Simulation exercises ✅ Constitutional requirement
- US4 (P4): Progress tracking 🎯 Bonus points
- US5 (P5): Urdu translation 🎯 Bonus points

**Recommended Implementation Order for Hackathon**:
1. MVP: US1 (Core content) - weeks 1-5
2. High-value: US3 (RAG chatbot) - week 6
3. Constitutional: US2 (Simulation exercises) - week 7
4. Bonus (if time): US4 (Progress tracking) - week 8
5. Bonus (if time): US5 (Urdu translation) - week 9+
