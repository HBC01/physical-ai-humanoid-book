# Implementation Plan: Physical AI & Humanoid Robotics – An AI-Native Textbook

**Branch**: `001-ai-native-textbook` | **Date**: 2025-12-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-native-textbook/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create an AI-native educational textbook for Physical AI & Humanoid Robotics curriculum with 7 core modules (21+ chapters). The textbook must be deployed as a static site on GitHub Pages, featuring simulation-based exercises (Gazebo, PyBullet), an embedded RAG chatbot for learning support, progress tracking, and multi-language support (English/Urdu). Prioritized for hackathon scoring: P1 (core content), P3 (RAG chatbot), P2 (simulations), P4/P5 (personalization/translation).

## Technical Context

**Language/Version**: JavaScript/TypeScript (ES2022+), Node.js 18+ for build tooling
**Primary Dependencies**: Docusaurus v3 (static site generator), React 18+, MDX v2, Zustand (state management), multilingual-e5-small (embeddings)
**Storage**: localStorage (via Zustand persist) for progress tracking, ~50-100KB typical usage
**Testing**: Jest for component testing, Playwright for E2E, axe-core for accessibility validation
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 years), mobile-responsive, GitHub Pages static hosting
**Project Type**: Static documentation website with interactive React components
**Performance Goals**: <3s page load on 3G, <1s search results, 2-5min site build for 21+ chapters, <2s RAG response end-to-end
**Constraints**: GitHub Pages limitations (static only), Vercel serverless for RAG LLM calls, CPU-only simulation compatibility
**Scale/Scope**: 7 curriculum modules, 21+ chapters (3 per module), ~50-100 pages, 1000s of concurrent learners, ~$30-50/month operational costs

**Key Technical Decisions (Resolved via Phase 0 Research)**:
1. **Static Site Generator**: ✅ Docusaurus v3 - Native i18n/RTL, docs-focused, gh-pages integration, 107/120 score
2. **RAG Chatbot Architecture**: ✅ Hybrid (client-side retrieval + Vercel serverless LLM) - Cost-effective ($8-13/mo MVP), <2s latency
3. **Progress Tracking**: ✅ localStorage + Zustand persist - 5MB sufficient, 1KB bundle, privacy-preserving
4. **I18n Strategy**: ✅ Docusaurus i18n plugin with `i18n/ur/` structure - Automatic RTL detection, seamless switching

**See research.md for detailed rationale, alternatives considered, and implementation guidance.**

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Constitutional Compliance Assessment

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| **I. Spec-Driven Development** | Must use Spec-Kit Plus workflow | ✅ PASS | Following SDD: spec.md → plan.md → tasks.md workflow |
| **II. Curriculum Alignment** | Align with Panaversity Physical AI syllabus | ✅ PASS | 7 modules match specified curriculum exactly |
| **III. AI-Native Design** | Dynamic, interactive, machine-readable | ✅ PASS | RAG chatbot (P3), personalization (P4), structured metadata for AI |
| **IV. Modular Content** | Structured, reusable content units | ✅ PASS | MDX format enables component reuse, chapters are independent units |
| **V. Beginner-Friendly Code** | Tested, commented, progressive complexity | ✅ PASS | Spec requires tested code examples with inline comments (FR-011, FR-012) |
| **VI. Simulation-First** | Free simulation tools, no hardware required | ✅ PASS | P2 priority, Gazebo/PyBullet/Isaac Sim, CPU-compatible (FR-006, FR-007) |
| **VII. GitHub Pages** | Deployable to GitHub Pages | ✅ PASS | Explicit requirement (FR-037), static site architecture |
| **VIII. Extension-Ready** | Support future enhancements | ✅ PASS | Plugin-based architecture, clear extension points for P4/P5 features |
| **IX. Clarity Over Verbosity** | Concise, focused content | ✅ PASS | Editorial requirement in constitution, spec success criteria SC-001 |
| **X. Explained Decisions** | Document architectural rationale | ✅ PASS | This plan includes ADR suggestions, research phase documents choices |

**Technical Standards Compliance**:
- ✅ Content Format: Markdown/MDX (per spec dependencies)
- ✅ Code Quality: Linting, testing, version pinning required
- ✅ Accessibility: WCAG 2.1 AA standard (FR-032-034, SC-008)
- ✅ Performance: <3s load on 3G (FR-035, SC-006)

**Quality Gates**:
- ✅ Automated accessibility testing (axe-core)
- ✅ Code examples must pass validation
- ✅ Content review before merge

**Result**: All constitutional principles satisfied. No violations to justify. Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Static site structure (documentation project)
docs/
├── modules/                    # Content organized by curriculum modules
│   ├── 01-foundations/        # Module 1: Foundations of Physical AI
│   │   ├── chapter-01-intro.mdx
│   │   ├── chapter-02-embodied-intelligence.mdx
│   │   └── chapter-03-physical-systems.mdx
│   ├── 02-ros2/               # Module 2: ROS 2
│   ├── 03-simulation/         # Module 3: Gazebo & Unity
│   ├── 04-isaac/              # Module 4: NVIDIA Isaac Sim & Isaac ROS
│   ├── 05-vla/                # Module 5: Vision-Language-Action
│   ├── 06-conversational/     # Module 6: Conversational Robotics
│   └── 07-capstone/           # Module 7: Capstone Project
├── exercises/                  # Simulation exercises (organized by module)
│   ├── ros2-publisher/
│   ├── gazebo-robot-spawn/
│   └── isaac-navigation/
├── assets/                     # Images, diagrams, videos
│   ├── diagrams/
│   └── images/
└── static/                     # Static assets (logos, favicons)

src/
├── components/                 # React components
│   ├── AIAssistant/           # RAG chatbot component
│   ├── ProgressTracker/       # Progress tracking UI
│   ├── ExerciseRunner/        # Exercise execution component
│   ├── CodeBlock/             # Enhanced code display
│   └── LanguageSwitcher/      # i18n controls
├── services/                   # Business logic
│   ├── rag/                   # RAG implementation
│   │   ├── embeddings.ts
│   │   ├── retrieval.ts
│   │   └── llm-client.ts
│   ├── progress/              # Progress tracking
│   │   ├── storage.ts
│   │   └── recommendations.ts
│   └── i18n/                  # Internationalization
│       └── loader.ts
├── hooks/                      # React hooks
│   ├── useProgress.ts
│   ├── useAIAssistant.ts
│   └── useLanguage.ts
├── utils/                      # Utility functions
│   ├── markdown.ts
│   └── analytics.ts
└── theme/                      # Custom theming (SSG-specific)

i18n/
├── en/                         # English translations
│   └── docusaurus-plugin-content-docs/
└── ur/                         # Urdu translations
    └── docusaurus-plugin-content-docs/

tests/
├── components/                 # Component tests (Jest)
├── e2e/                       # End-to-end tests (Playwright)
└── accessibility/             # Accessibility tests (axe-core)

# Build configuration
docusaurus.config.js           # Site configuration
sidebars.js                    # Navigation structure
package.json                   # Dependencies
tsconfig.json                  # TypeScript config
.github/
└── workflows/
    └── deploy.yml             # GitHub Actions for deployment
```

**Structure Decision**: Static documentation site architecture using modular content organization. The `docs/` directory contains educational content organized by curriculum modules, while `src/` contains interactive components (RAG chatbot, progress tracking). This separation enables:
- Independent content authoring without touching code
- Reusable React components across pages
- Client-side services for RAG and progress without backend
- i18n folder structure for English/Urdu translations
- GitHub Actions automated deployment to GitHub Pages

**Key Architectural Choices**:
1. **Content-first structure**: `docs/modules/` mirrors curriculum organization for clarity
2. **Component library**: Reusable React components in `src/components/` for AI features
3. **Service layer**: Business logic separated from UI for testability
4. **Static-first**: No backend - all dynamic features use client-side JavaScript

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
