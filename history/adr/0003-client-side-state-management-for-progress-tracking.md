# ADR-0003: Client-Side State Management for Progress Tracking

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2025-12-21
- **Feature:** Physical AI & Humanoid Robotics – An AI-Native Textbook
- **Context:** Need to implement progress tracking and personalization for students learning through the textbook (track chapter completion, exercise attempts, learning goals, personalized recommendations) without backend infrastructure. Must work on static GitHub Pages site, preserve student privacy (no PII), support export/import for data portability, and scale to thousands of learners. This is a bonus scoring opportunity for hackathon (personalization feature).

<!-- Significance checklist (ALL must be true to justify this ADR)
     ✅ 1) Impact: Long-term consequence - shapes how student data is stored, privacy model, cross-device experience
     ✅ 2) Alternatives: 3 approaches evaluated (localStorage+Zustand, IndexedDB, Redux Toolkit)
     ✅ 3) Scope: Cross-cutting - affects all pages (progress indicators), dashboard, recommendation engine, data privacy
-->

## Decision

Adopt **localStorage + Zustand with Persist Middleware** for client-side state management with the following integrated components:

**Storage Layer**:
- **Browser Storage**: localStorage (5-10MB capacity, synchronous API)
- **Data Size**: 50-100KB typical usage for progress tracking (well within limits)
- **Persistence**: Automatic via Zustand persist middleware
- **Privacy**: Client-side only, anonymous UUIDs, no server transmission

**State Management**:
- **Library**: Zustand (1KB bundle size)
- **Pattern**: Simple hook-based state with persist plugin
- **Structure**: Flat store with profile, progress, and metadata sections
- **Access**: React hooks (`useProgress()`, `useStore()`)

**Data Model**:
```typescript
{
  profile: {
    id: string (anonymous UUID)
    experienceLevel: 'beginner' | 'intermediate' | 'advanced'
    goals: string[]
    preferences: { language: 'en' | 'ur', theme: 'light' | 'dark' }
  },
  progress: {
    completedChapters: string[]
    chaptersInProgress: Record<string, { lastVisited, scrollPosition }>
    exerciseAttempts: Record<string, { attempts, completed, lastAttempt }>
  },
  metadata: {
    createdAt: number
    lastUpdated: number
    version: string
  }
}
```

**Recommendation Engine**:
- **Type**: Rule-based (no backend ML)
- **Rules**: Sequential progression, prerequisites check, struggle detection (>3 attempts), goal alignment, time-away refresher (>7 days)
- **Output**: Top 5 personalized chapter recommendations with rationale

**Data Portability**:
- **Export**: Download progress as JSON file (user-initiated)
- **Import**: Upload JSON to restore progress (validation included)
- **Clear**: Delete all data (right to erasure)

**Privacy Safeguards**:
- No personally identifiable information (PII) stored
- Anonymous UUID only
- No tracking across devices (inherent in localStorage)
- No server transmission of user data
- Transparent consent messaging

## Consequences

### Positive

- **Zero Infrastructure Cost**: No backend required; storage is free (browser localStorage)
- **Privacy-Preserving**: Data never leaves user's device; GDPR-friendly by design
- **Simple Implementation**: Zustand minimal API (1KB); synchronous localStorage access
- **Fast Performance**: Local reads/writes (<1ms latency); no network round-trips
- **Sufficient Capacity**: 5-10MB localStorage easily handles 50-100KB progress data
- **Wide Browser Support**: 99%+ compatibility (localStorage ubiquitous)
- **Data Portability**: Export/import enables manual cross-device sync
- **No Vendor Lock-In**: localStorage is standard; easy migration if needed
- **Transparent to Users**: Clear explanation of local-only storage builds trust

### Negative

- **No Cross-Device Sync**: Progress doesn't follow user across devices automatically (mitigated by export/import)
- **Data Loss Risk**: Clearing browser cache loses progress (mitigated by export reminders)
- **Storage Limits**: 5-10MB cap (sufficient but not unlimited; unlikely to hit with progress data)
- **Browser-Specific**: Separate progress per browser/device; incognito mode doesn't persist
- **No Collaborative Features**: Each user isolated; cannot have multi-user projects or peer comparison
- **No Aggregate Analytics**: Cannot track aggregate user behavior patterns (privacy benefit/limitation)
- **Rule-Based Recommendations Only**: Limited to heuristics; no ML-powered personalization without backend
- **Manual Cross-Device Transfer**: Users must export/import to move data between devices

## Alternatives Considered

### Alternative Storage A: IndexedDB + Dexie.js
- **Components**: IndexedDB (50MB+ capacity), Dexie.js wrapper library (async API)
- **Complexity**: Medium (asynchronous operations, more complex API)
- **Why Rejected**:
  - Overkill for simple key-value progress tracking (50-100KB data)
  - Asynchronous API adds complexity without benefit for this use case
  - Larger library size (Dexie.js ~20KB vs Zustand 1KB)
  - No significant advantage over localStorage for progress tracking
- **When to Reconsider**: If data grows beyond 5MB or requires complex querying (unlikely for progress tracking)

### Alternative State Management B: Redux Toolkit
- **Components**: Redux Toolkit (20KB+), redux-persist for storage
- **Complexity**: High (actions, reducers, middleware, boilerplate)
- **Why Rejected**:
  - Excessive bundle size (20KB+ vs Zustand 1KB) for simple state needs
  - Unnecessary complexity for progress tracking (no time-travel debugging needed)
  - Steeper learning curve
  - More boilerplate code
- **When to Reconsider**: If state management becomes highly complex with many interconnected pieces
- **Strengths Acknowledged**: Excellent for large apps with complex state flows and DevTools

### Alternative State Management C: Jotai
- **Components**: Jotai (3KB), atomic state management
- **Complexity**: Medium (atom-based architecture)
- **Why Rejected**:
  - Slightly larger bundle than Zustand (3KB vs 1KB)
  - More complex mental model (atoms) vs simple hooks
  - Built-in persistence requires additional configuration
  - No significant advantage for this use case
- **When to Reconsider**: If fine-grained reactivity becomes critical
- **Strengths Acknowledged**: Excellent for derived state and granular updates

### Alternative Architecture D: Backend Storage (Firebase/Supabase)
- **Components**: Firebase Authentication + Firestore, or Supabase Auth + PostgreSQL
- **Infrastructure Cost**: $0-25/month (free tiers available)
- **Complexity**: High (authentication, API security, cross-device sync)
- **Why Rejected**:
  - Violates GitHub Pages static-only constraint (requires auth backend)
  - Adds infrastructure complexity and maintenance
  - Privacy concerns (data on third-party servers)
  - Requires user accounts (friction for learners)
  - Not aligned with privacy-preserving goals
- **When to Reconsider**: If cross-device sync becomes critical user requirement and privacy model changes
- **Strengths Acknowledged**: Seamless cross-device sync, real-time updates, richer analytics

## References

- Feature Spec: [specs/001-ai-native-textbook/spec.md](../../specs/001-ai-native-textbook/spec.md) - FR-022 through FR-026 (Progress Tracking requirements), User Story 4 (P4)
- Implementation Plan: [specs/001-ai-native-textbook/plan.md](../../specs/001-ai-native-textbook/plan.md) - Technical Context line 16
- Research Document: [specs/001-ai-native-textbook/research.md](../../specs/001-ai-native-textbook/research.md) - Decision 3 (pages 26-35, privacy analysis and recommendation algorithms)
- Related ADRs: ADR-0001 (Frontend Platform Stack - Docusaurus React hooks integrate with Zustand), ADR-0002 (RAG Chatbot - can reference progress for contextual recommendations)
- Zustand Documentation: [https://github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
- Privacy Compliance: GDPR-friendly by design (no PII, local-only, user control via export/import/clear)
