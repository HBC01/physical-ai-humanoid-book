# ADR-0001: Frontend Platform Stack for Educational Content

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2025-12-21
- **Feature:** Physical AI & Humanoid Robotics – An AI-Native Textbook
- **Context:** Need to select an integrated frontend platform for educational content delivery that supports 7 curriculum modules (21+ chapters), multi-language content (English/Urdu with RTL), embedded interactive components (RAG chatbot, progress tracking), and GitHub Pages deployment. Platform must handle beginner-friendly code examples, simulation exercises, and scale to thousands of concurrent learners while maintaining <3s page loads.

<!-- Significance checklist (ALL must be true to justify this ADR)
     ✅ 1) Impact: Long-term consequence - shapes how 21+ chapters are authored, maintained, and deployed
     ✅ 2) Alternatives: 4 frameworks evaluated with scoring matrix (Docusaurus 107/120, Next.js 90, VitePress 85, Astro 88)
     ✅ 3) Scope: Cross-cutting - affects content authoring, component development, i18n workflow, deployment
-->

## Decision

Adopt **Docusaurus v3** as the integrated frontend platform with the following technology stack:

- **Static Site Generator**: Docusaurus v3 (purpose-built for documentation)
- **UI Framework**: React 18+ (Docusaurus built-in)
- **Content Format**: MDX v2 (markdown with embedded React components)
- **Internationalization**: Docusaurus i18n plugin with dedicated `i18n/ur/` structure for Urdu RTL support
- **Search**: Algolia DocSearch (free for open source) or Docusaurus local search plugin
- **Theming**: Docusaurus default theme with custom React component overrides
- **Build System**: Node.js 18+ with Docusaurus CLI
- **Deployment**: GitHub Pages via `docusaurus deploy` command (one-command deployment)

**Project Structure**:
```
docs/modules/          # 7 curriculum modules, 21+ chapters in MDX
src/components/        # Custom React components (AIAssistant, ProgressTracker)
i18n/en/, i18n/ur/    # English and Urdu translations
docusaurus.config.js   # Site configuration with i18n settings
```

## Consequences

### Positive

- **Native i18n/RTL Support**: Built-in internationalization with automatic RTL detection for Urdu; content structure mirrors language codes
- **Documentation Focus**: Purpose-built for educational/technical content with sidebar navigation, search, versioning patterns
- **GitHub Pages Integration**: One-command deployment (`docusaurus deploy`) handles base URL and routing automatically
- **MDX Component Embedding**: Full MDX v2 support allows embedding AIAssistant and ProgressTracker React components directly in educational content
- **Fast Builds**: 2-5 minute builds for 21+ chapters with incremental builds in development mode
- **Mature Plugin Ecosystem**: Extensive plugin system for custom features (RAG integration, progress tracking, analytics)
- **Battle-Tested**: Used by React, Jest, Babel documentation sites; strong Meta backing ensures long-term support
- **Accessibility Built-In**: Default theme meets WCAG 2.1 AA standards
- **Low Learning Curve**: Familiar React patterns; content authors can write in markdown without touching code

### Negative

- **React Lock-In**: Cannot easily switch to Vue/Svelte/Angular without significant rewrite (Docusaurus is React-only)
- **Framework Coupling**: Custom components and plugins tied to Docusaurus APIs; migration to another SSG would require refactoring
- **Limited Server-Side Capabilities**: Static-only architecture means dynamic features (RAG, progress) require client-side JavaScript or external APIs
- **Vendor Dependency**: While open-source (Meta), Docusaurus evolution depends on Meta's priorities
- **Initial Setup Complexity**: Custom components, i18n configuration, and plugin development have learning curve despite overall simplicity
- **Build Time Scaling**: As content grows beyond 100+ pages, build times may increase (mitigated by incremental builds)

## Alternatives Considered

### Alternative Stack A: Next.js/Nextra + Manual i18n + Vercel
- **Components**: Next.js 14 App Router, Nextra docs theme, next-i18next for translations, Vercel deployment
- **Scoring**: 90/120
- **Why Rejected**:
  - i18n/RTL support requires significant custom configuration (next-i18next + RTL CSS)
  - Complexity overkill for static documentation (server components, API routes unnecessary)
  - No built-in docs-focused navigation patterns (must build custom sidebar)
  - Higher maintenance burden for educational content focus
- **When to Reconsider**: If future needs require dynamic server-side rendering or complex API integration

### Alternative Stack B: VitePress + Vue + Manual i18n + GitHub Pages
- **Components**: VitePress, Vue 3 ecosystem, manual i18n implementation, GitHub Pages deployment
- **Scoring**: 85/120
- **Why Rejected**:
  - Vue ecosystem (spec requirement FR-016 implies React for custom components)
  - Weak i18n/RTL support (no built-in solution for Urdu)
  - Immature plugin ecosystem compared to Docusaurus
  - Community and documentation resources smaller than Docusaurus
- **Strengths Acknowledged**: Excellent build performance (Vite) and simplicity for basic docs

### Alternative Stack C: Astro + MDX + astro-i18n + Cloudflare Pages
- **Components**: Astro SSG, framework-agnostic components, astro-i18n plugin, Cloudflare Pages
- **Scoring**: 88/120
- **Why Rejected**:
  - i18n not first-class (requires third-party plugin with limited RTL support)
  - Better suited for general marketing sites than educational documentation
  - Smaller community for docs-specific patterns
  - Less mature plugin ecosystem for educational features
- **Strengths Acknowledged**: Modern architecture, multi-framework support, excellent performance

## References

- Feature Spec: [specs/001-ai-native-textbook/spec.md](../../specs/001-ai-native-textbook/spec.md)
- Implementation Plan: [specs/001-ai-native-textbook/plan.md](../../specs/001-ai-native-textbook/plan.md)
- Research Document: [specs/001-ai-native-textbook/research.md](../../specs/001-ai-native-textbook/research.md) - Decision 1 (pages 4-9)
- Related ADRs: ADR-0002 (RAG Chatbot Architecture), ADR-0003 (Client-Side State Management)
- Scoring Matrix: Docusaurus scored 107/120 across 12 criteria (i18n 9/10, docs focus 10/10, GitHub Pages 10/10, search 9/10, build performance 9/10, MDX 10/10, plugins 9/10, community 10/10)
