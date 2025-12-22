<!--
Sync Impact Report:
Version Change: Initial → 1.0.0
Modified Principles: N/A (Initial version)
Added Sections:
  - Core Principles (10 principles)
  - Technical Standards
  - Development Workflow
  - Governance
Removed Sections: None
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section reviewed
  ✅ spec-template.md - Requirements alignment verified
  ✅ tasks-template.md - Task categorization reviewed
Follow-up TODOs: None
-->

# Physical AI & Humanoid Robotics Book Constitution

## Core Principles

### I. Spec-Driven Development with Spec-Kit Plus

This project MUST follow Spec-Driven Development (SDD) using Spec-Kit Plus throughout its entire lifecycle. All features, changes, and additions MUST be specified in structured artifacts (spec.md, plan.md, tasks.md) before implementation. No code may be written without corresponding specification artifacts.

**Rationale**: SDD ensures clarity, traceability, and alignment between requirements and implementation. It prevents scope creep and provides a clear audit trail for all design decisions.

### II. Panaversity Curriculum Alignment

All content MUST align with Panaversity's Physical AI & Humanoid Robotics curriculum. Topics, examples, exercises, and progression MUST match the official curriculum scope and learning objectives. Any deviation requires explicit documentation and approval.

**Rationale**: The book serves as an educational resource for a specific curriculum. Alignment ensures students receive consistent, relevant content that supports their learning path.

### III. AI-Native Design

The book MUST be AI-native, not a static textbook. Content MUST be structured to enable dynamic interaction, personalization, and adaptive learning experiences. This includes modular design, semantic markup, and machine-readable metadata.

**Rationale**: AI-native design allows the book to evolve beyond traditional static content, enabling features like personalized learning paths, interactive exercises, and real-time content updates.

### IV. Structured, Modular, and Reusable Content

Claude MUST generate content that is structured, modular, and reusable. Each content unit (chapter, section, example) MUST be independently consumable and composable with other units. Content MUST follow consistent schema and formatting conventions.

**Rationale**: Modularity enables content reuse, easier maintenance, and flexible content assembly for different learning contexts.

### V. Practical, Correct, and Beginner-Friendly Code

All code examples MUST be practical, technically correct, and beginner-friendly. Code MUST be tested, commented, and progressively introduce complexity. Examples MUST solve real problems relevant to Physical AI and humanoid robotics.

**Rationale**: Code quality directly impacts learning effectiveness. Incorrect or overly complex examples confuse learners and undermine trust in the material.

### VI. Simulation-First Approach

The project MUST NOT make assumptions about proprietary hardware. All examples, exercises, and demonstrations MUST prioritize simulation environments (Gazebo, Isaac Sim, PyBullet, etc.) that are freely accessible. Hardware-specific content MUST be clearly labeled and supplemented with simulation alternatives.

**Rationale**: Accessibility and inclusivity require that learning not be gated by expensive hardware. Simulations democratize access to Physical AI learning.

### VII. GitHub Pages Deployment

The final output MUST be deployable to GitHub Pages. All content, assets, and build artifacts MUST be compatible with GitHub Pages' static site hosting requirements. Build processes MUST be reproducible and documented.

**Rationale**: GitHub Pages provides free, reliable hosting with version control integration, making the book accessible to the global learning community.

### VIII. Extension-Ready Architecture

The system MUST support future extensions including personalization, translation, interactive exercises, progress tracking, and adaptive content delivery. Architecture MUST be designed with extension points and clear integration patterns.

**Rationale**: Educational technology evolves rapidly. The system must accommodate future enhancements without requiring fundamental rewrites.

### IX. Clarity Over Verbosity

Content MUST prioritize clarity over verbosity. Explanations MUST be concise, direct, and focused on learning objectives. Avoid unnecessary jargon, tangents, or filler content. Every sentence MUST serve a pedagogical purpose.

**Rationale**: Learner attention is finite. Clear, focused content maximizes comprehension and retention while respecting learners' time.

### X. Explained Design Decisions

All significant design decisions MUST be explained when relevant to the learning context. This includes architectural choices, algorithm selection, tool preferences, and implementation patterns. Explanations MUST clarify the "why" behind technical choices.

**Rationale**: Understanding design rationale builds deeper technical intuition and prepares learners to make informed decisions in their own work.

## Technical Standards

### Content Format
- Primary format: Markdown with MDX extensions for interactive components
- Code blocks MUST specify language for syntax highlighting
- Diagrams MUST use Mermaid or equivalent text-based formats
- Mathematical notation MUST use LaTeX/MathJax

### Code Quality
- All code examples MUST pass linting and formatting checks
- Code MUST include inline comments explaining non-obvious logic
- Examples MUST be self-contained and runnable
- Dependencies MUST be explicitly documented with versions

### Accessibility
- All visual content MUST include alt text
- Content MUST meet WCAG 2.1 Level AA standards
- Navigation MUST be keyboard-accessible
- Color MUST NOT be the only means of conveying information

### Performance
- Page load time MUST be under 3 seconds on 3G connections
- Images MUST be optimized and appropriately sized
- JavaScript bundles MUST be code-split and lazy-loaded where appropriate

## Development Workflow

### Specification Phase
1. User requirements captured in natural language
2. Feature specification created using `/sp.specify`
3. Specification reviewed and approved before planning

### Planning Phase
1. Implementation plan created using `/sp.plan`
2. Architecture and design decisions documented
3. Significant decisions flagged for ADR creation
4. Plan reviewed and approved before task generation

### Task Execution Phase
1. Tasks generated using `/sp.tasks`
2. Tasks executed in dependency order
3. Each task must have clear acceptance criteria
4. Prompt History Records (PHRs) created for all work

### Quality Gates
- All code MUST pass automated tests (if tests specified)
- All content MUST pass accessibility checks
- All changes MUST be reviewed before merge
- Breaking changes MUST include migration guides

## Governance

### Amendment Process
This constitution may be amended through the `/sp.constitution` command. Amendments MUST:
- Document the rationale for changes
- Update version number following semantic versioning
- Update all dependent templates and documentation
- Be approved before taking effect

### Versioning
- **MAJOR**: Backward incompatible changes to core principles
- **MINOR**: New principles or significant expansions
- **PATCH**: Clarifications, wording improvements, fixes

### Compliance
- All pull requests MUST verify constitutional compliance
- Constitution violations MUST be justified in the Complexity Tracking section of plan.md
- Unjustified violations MUST be rejected
- Runtime development guidance is provided in CLAUDE.md

### Review Cycle
Constitution MUST be reviewed:
- Before starting each major feature
- After completing significant architectural work
- Quarterly for relevance and completeness
- When team consensus indicates need for change

**Version**: 1.0.0 | **Ratified**: 2025-12-21 | **Last Amended**: 2025-12-21
