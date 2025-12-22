---
id: 002
title: Capture Hackathon Context
stage: general
date: 2025-12-21
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: unknown
command: /sp.context
labels: ["context", "hackathon", "requirements", "constraints", "evaluation-criteria"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/project-context.md
tests:
  - N/A
---

## Prompt

Hackathon Context:

This project is part of Panaversity Hackathon I: Create a Textbook for Teaching
Physical AI & Humanoid Robotics.

The evaluation focuses on:
- Spec-driven development
- AI-native design
- Educational clarity
- Practical robotics workflows
- Future extensibility

Constraints:
- Students may not have physical humanoid robots.
- Simulation-first approach is required.
- RTX GPU systems may not be universally available.

Opportunities:
- Claude subagents can be used for reusable intelligence.
- RAG chatbot integration increases score.
- Personalization and Urdu translation provide bonus points.

Deployment Target:
- GitHub Pages or Vercel

## Response snapshot

Created comprehensive project context document at `.specify/memory/project-context.md` capturing:
- Hackathon evaluation criteria (5 dimensions)
- Critical constraints (hardware accessibility, GPU availability, simulation-first)
- Score enhancement opportunities (Claude subagents, RAG chatbot, personalization, Urdu translation)
- Deployment targets (GitHub Pages primary, Vercel alternative)
- Strategic recommendations (MVP vs high-value vs bonus features)
- Success metrics and context usage guidelines

This context will inform all future specification, planning, and implementation decisions.

## Outcome

- ✅ Impact: Established critical project context that shapes all feature development and prioritization decisions
- 🧪 Tests: N/A (documentation)
- 📁 Files: Created .specify/memory/project-context.md
- 🔁 Next prompts: Begin first feature specification with /sp.specify (e.g., "Create chapter 1: Introduction to Physical AI")
- 🧠 Reflection: Hackathon constraints (simulation-first, no hardware assumption) align perfectly with constitutional principle VI. RAG chatbot should be prioritized as high-value scoring opportunity.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Validate that first feature specification incorporates hackathon evaluation criteria and constraints
