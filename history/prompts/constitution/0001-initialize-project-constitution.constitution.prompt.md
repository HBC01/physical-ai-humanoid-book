---
id: 0001
title: Initialize project constitution
stage: constitution
date: 2026-01-01
surface: agent
model: claude-sonnet-4.5
feature: none
branch: master
user: default
command: /sp.constitution
labels: ["constitution", "initialization", "robotics"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
  - .specify/templates/plan-template.md
tests:
  - none
---

## Prompt

Project Purpose: Physical AI & Humanoid Robotics Textbook + RAG Chatbot + Personalization + Urdu Translation
Users: Students & professionals learning Physical AI
Constraints:
  - Must cover ROS 2, Gazebo, NVIDIA Isaac, VLA modules
  - Chatbot must answer questions on book content
  - Personalization via user hardware/software profile
  - Urdu translation button per chapter
Tech Stack:
  - Docusaurus (book)
  - FastAPI backend for RAG
  - Neon Postgres (user DB)
  - Qdrant Cloud (vector DB)
  - Gemini-2.5-Flash model via OpenAI SDK (used inside Claude Code)
  - Claude Code + MCP context7
  - BetterAuth (Signup/Signin)

## Response snapshot

I have initialized the project constitution at `.specify/memory/constitution.md` with 5 core principles:
1. Domain-Specific Accuracy (ROS 2/Isaac)
2. RAG-First Contextual Awareness
3. Adaptive Learning & Personalization
4. Localization (Urdu Translation)
5. Integrated Tech Stack Consistency

I also updated the `plan-template.md` to include these as mandatory gates for future features.

## Outcome

- ✅ Impact: High - Established base project rules and tech stack.
- 🧪 Tests: n/a
- 📁 Files: Updated constitution.md and plan-template.md
- 🔁 Next prompts: /sp.specify for the first feature
- 🧠 Reflection: The prompt was clear on constraints, allowing for a highly specific constitution from the start.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): n/a
