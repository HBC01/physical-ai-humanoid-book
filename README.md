# Physical AI & Humanoid Robotics Book

**An AI-Native Textbook for Building Intelligent Humanoid Robots**

> An open-source, interactive, production-ready educational platform built with Docusaurus 3.9, React 19, and TypeScript. Supporting ROS 2, NVIDIA Isaac, and Vision-Language-Action (VLA) models.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A520.0-brightgreen)]()
[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.9.2-green)]()

**Live Demo (Production):** [https://physical-ai-humanoid-book-kappa.vercel.app/](https://physical-ai-humanoid-book-kappa.vercel.app/)
**GitHub Pages (Static):** [https://HBC01.github.io/physical-ai-humanoid-book/](https://HBC01.github.io/physical-ai-humanoid-book/)

**Hackathon Context:** December 2025 - Building the future of robotics education

---

## 📖 Overview

The **Physical AI & Humanoid Robotics Book** is a comprehensive, bilingual educational platform that addresses the fragmentation problem in robotics education. It provides a structured learning path from ROS 2 basics to building autonomous humanoid robots using cutting-edge AI techniques.

### What Makes This Unique

- **First Comprehensive Bilingual Physical AI Curriculum** - Available in English and Urdu (اردو), making it accessible to 160M+ Urdu speakers globally
- **AI-Native Design** - Built from the ground up to integrate interactive AI assistance throughout the learning journey
- **Production-Ready** - Not a prototype—7 complete modules with 21+ chapters, professional UI/UX, and responsive design
- **Open Source** - MIT licensed for community contributions and global accessibility
- **Simulation-First** - CPU-friendly exercises using freely available tools (no expensive hardware required)

---

## ✨ Key Features

### 📚 Comprehensive Curriculum

**7 Progressive Modules** covering the complete robotics development pipeline:

1. **Module 1: Foundations of Physical AI**
   - Introduction to embodied intelligence
   - Physical systems and robot architectures
   - Sensor-motor integration fundamentals

2. **Module 2: ROS 2 Fundamentals**
   - ROS 2 architecture and core concepts
   - Nodes, topics, services, and actions
   - Building distributed robotic systems

3. **Module 3: Simulation Environments**
   - Gazebo for realistic robot simulation
   - Unity for robotics development
   - Digital twins and virtual testing

4. **Module 4: NVIDIA Isaac Platform**
   - Isaac Sim for high-fidelity simulation
   - Isaac ROS integration
   - End-to-end simulation workflows

5. **Module 5: Vision-Language-Action (VLA) Models**
   - Foundation models for robotics
   - Vision systems and perception
   - Language grounding for robot control

6. **Module 6: Conversational AI for Humanoids**
   - Dialog systems and natural interaction
   - Speech recognition and synthesis
   - Human-robot interaction patterns

7. **Module 7: Capstone Project**
   - Building a complete humanoid robot system
   - Implementation best practices
   - Deployment and production considerations

### 🌍 Bilingual Support

- **English + Urdu (اردو)** - Full content translation
- **Right-to-Left (RTL)** support for Urdu
- **Language Switcher** - Seamless switching between languages
- **Accessible to 160M+ Urdu Speakers** worldwide

### 🎨 Developer-Friendly Features

- **Full-Text Search** - Fast local search across all content
- **Syntax Highlighting** - Code examples with Prism integration
- **Dark Mode** - Easy on the eyes for late-night studying
- **Mobile Responsive** - Learn anywhere, on any device
- **Progressive Web App** - Offline-capable learning experience

### 🛠️ Modern Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Docusaurus 3.9.2 | Static site generation, documentation platform |
| **Frontend** | React 19 | Component-based UI, interactive features |
| **Language** | TypeScript 5.6 | Type safety, developer experience |
| **Styling** | CSS Modules | Scoped styling, theming support |
| **Search** | @easyops-cn/docusaurus-search-local | Client-side full-text search |
| **Syntax** | Prism React Renderer 2.3 | Code highlighting |
| **State** | Zustand 5.0 | Lightweight state management |
| **Build** | Node.js ≥20 | Modern JavaScript runtime |

### 🎮 Interactive Learning

- **8 Simulation Exercises** - Hands-on practice with ROS 2, Gazebo, and Isaac Sim
- **AI Assistant (Two-Agent Architecture)** - Intelligent dual-mode learning assistant:
  - **PRIMARY AGENT (RAG)**: Textbook-based responses with citations when content is found
  - **SECONDARY AGENT (General Knowledge)**: Confident robotics explanations when textbook context is unavailable
  - **Automatic Routing**: Seamlessly switches between agents based on query type
  - **Domain-Aware**: Validates questions stay within Physical AI/Robotics scope
  - **Natural Conversations**: No "not covered in book" messages - just helpful answers
  - **Bilingual Support**: Works in both English and Urdu
  - Powered by Gemini 2.5 Flash with keyword-based retrieval
- **Progress Tracking** - Monitor your learning journey
- **Code Examples** - Copy-paste ready examples in every chapter

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥20.0
- **npm** or **yarn**
- Git (for cloning)

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/HBC01/physical-ai-humanoid-book.git
cd physical-ai-humanoid-book

# Navigate to website directory
cd website

# Install dependencies
npm install

# Start development server
npm start
```

The site will open automatically at `http://localhost:3000/physical-ai-humanoid-book/`

### Build for Production

```bash
# Create optimized production build
npm run build

# Serve production build locally
npm run serve
```

### Additional Commands

```bash
# Clear cache (useful for troubleshooting)
npm run clear

# Type checking
npm run typecheck

# Run tests
npm test

# Run end-to-end tests
npm run test:e2e

# Accessibility tests
npm run test:a11y
```

---

## 📁 Project Structure

```
physical-ai-humanoid-book/
├── website/                      # Docusaurus application
│   ├── docs/                     # Content files
│   │   ├── modules/              # 7 curriculum modules
│   │   │   ├── 01-foundations/
│   │   │   ├── 02-ros2/
│   │   │   ├── 03-simulation/
│   │   │   ├── 04-isaac/
│   │   │   ├── 05-vla/
│   │   │   ├── 06-conversational/
│   │   │   └── 07-capstone/
│   │   ├── exercises/            # Interactive exercises
│   │   └── intro.md              # Homepage content
│   ├── src/                      # React components
│   │   ├── components/           # Reusable UI components
│   │   │   ├── AIAssistant/      # RAG chatbot
│   │   │   ├── CodeBlock/        # Enhanced code blocks
│   │   │   ├── ExerciseRunner/   # Interactive exercises
│   │   │   ├── ProgressTracker/  # Learning progress
│   │   │   └── LanguageSwitcher/ # i18n controls
│   │   ├── services/             # Business logic
│   │   │   └── progress/         # Progress storage
│   │   ├── pages/                # Custom pages
│   │   └── css/                  # Global styles
│   ├── static/                   # Static assets
│   │   └── img/                  # Images and icons
│   ├── i18n/                     # Translations
│   │   ├── en/                   # English
│   │   └── ur/                   # Urdu
│   ├── blog/                     # Blog posts
│   ├── docusaurus.config.ts      # Main configuration
│   ├── sidebars.ts               # Navigation structure
│   ├── package.json              # Dependencies
│   └── tsconfig.json             # TypeScript config
├── docs/                         # Root-level documentation
│   └── exercises/
├── specs/                        # Feature specifications
│   └── 001-ai-native-textbook/
├── history/                      # Development history
│   ├── adr/                      # Architecture Decision Records
│   └── prompts/                  # Prompt History Records
├── .specify/                     # SpecKit Plus templates
├── .github/                      # GitHub workflows
│   └── workflows/
│       └── deploy.yml            # Auto-deployment
├── package.json                  # Root dependencies
├── README.md                     # This file
├── QUICK_START.md                # Quick setup guide
├── DEMO_SCRIPT.md                # Hackathon demo guide
├── JUDGE_PITCH.md                # Pitch materials
├── HACKATHON_CHECKLIST.md        # Feature verification
└── INDEX.md                      # Documentation index
```

---

## 🎓 Curriculum Highlights

### Module 1: Foundations of Physical AI
Learn the core principles of embodied intelligence, physical systems, and how AI models interact with the real world through sensors and actuators.

**Key Topics:**
- What is Physical AI?
- Embodied Intelligence vs. Traditional AI
- Physical Systems and Robot Architectures
- Sensor-Motor Integration

### Module 5: Vision-Language-Action (VLA) Models
Dive deep into cutting-edge foundation models that combine vision, language, and action for end-to-end robot control.

**Key Topics:**
- Introduction to VLA Models
- Vision Systems and Perception Pipelines
- Language Grounding for Robot Control
- Multimodal Learning for Robotics

### Module 7: Capstone Project
Build a complete humanoid robot system that integrates everything learned across all modules.

**Key Topics:**
- Project Planning and Architecture
- Implementation Guide (Step-by-Step)
- Testing, Validation, and Deployment
- Production Best Practices

---

## 🌐 Localization

### Supported Languages

- **English** (default)
- **Urdu (اردو)** - Full RTL support

### Running in Urdu

```bash
npm start -- --locale ur
```

### Adding New Languages

1. Add locale to `docusaurus.config.ts`:
```typescript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'ur', 'your-language'],
}
```

2. Generate translation files:
```bash
npm run write-translations -- --locale your-language
```

3. Translate content in `i18n/your-language/`

---

## 🤖 AI Assistant Architecture

### Two-Agent System

The AI Assistant uses an intelligent **two-layer agent strategy** to provide optimal learning experiences:

#### PRIMARY AGENT - Textbook RAG Agent
**Activated when:** Embeddings/keywords find relevant textbook content (`context.length > 0`)

**Features:**
- Uses textbook-based content for answers
- Provides structured, cited responses
- References specific chapters and sections
- Gives complete answers without asking permission
- Supports both English and Urdu

#### SECONDARY AGENT - General Knowledge Agent
**Activated when:** No textbook context found (`context.length === 0`)

**Features:**
- Answers confidently using general robotics knowledge
- Provides 1-2 paragraph educational explanations
- NEVER mentions missing data, embeddings, or textbook
- Stays within Physical AI/Robotics domain
- Politely refuses non-robotics questions

### Routing Logic

```
User Query → Retrieve Context from Embeddings/Keywords

IF context.length > 0:
    → Route to PRIMARY RAG AGENT
    → Use textbook content
    → Provide cited answer

ELSE IF context.length === 0:
    → Check if robotics-related
    → IF yes: Route to SECONDARY GENERAL AGENT
    → IF no: Politely refuse

ELSE:
    → Ask for clarification
```

### Safety Features

- ✅ Never contradicts textbook content
- ✅ Never hallucinates citations
- ✅ Never blames missing embeddings
- ✅ Never degrades user confidence
- ✅ Domain validation for robotics-only queries
- ✅ Graceful refusal for out-of-scope questions

### Powered By

- **LLM:** Gemini 2.5 Flash via OpenAI-compatible SDK
- **Retrieval:** Keyword-based search with TF-IDF scoring
- **Fallback:** CPU-friendly, no GPU required
- **Languages:** English and Urdu (اردو)

---

## 🔧 Tech Stack Details

### Core Technologies

- **Docusaurus 3.9.2** - Documentation framework with MDX support
- **React 19** - Modern UI library with concurrent features
- **TypeScript 5.6** - Type-safe JavaScript
- **Node.js ≥20** - JavaScript runtime

### Key Dependencies

- **@mdx-js/react 3.0** - Write JSX in Markdown
- **Prism React Renderer 2.3** - Syntax highlighting
- **Zustand 5.0** - State management
- **@easyops-cn/docusaurus-search-local** - Local search

### Development Tools

- **ESLint 9.17** - Code linting
- **Prettier 3.4** - Code formatting
- **Jest 29.7** - Unit testing
- **Playwright 1.48** - E2E testing
- **@axe-core/playwright** - Accessibility testing

---

## 🏆 Hackathon Submission Details

### Problem Solved

**Fragmentation in Physical AI Education** - Learning resources for building intelligent robots are scattered across documentation, research papers, and tutorials. Students struggle to find a structured path from basics to production-ready systems.

### Our Solution

A comprehensive, bilingual, AI-native textbook that provides:
- Structured 7-module curriculum
- CPU-friendly simulation exercises
- Interactive AI learning assistant
- Production-ready modern web platform
- Open-source for community contributions

### Innovation

1. **First Bilingual Physical AI Curriculum** - English + Urdu support breaks language barriers
2. **AI-Native Design with Two-Agent Architecture**:
   - **Primary RAG Agent**: Textbook-based answers with citations and structured explanations
   - **Secondary General Agent**: Confident robotics knowledge when textbook context is unavailable
   - **Intelligent Routing**: Automatic agent selection based on query and context availability
   - **Domain Validation**: Ensures questions stay within Physical AI/Robotics scope
   - **Seamless Experience**: No mentions of missing data or limitations - just helpful answers
3. **Simulation-First Approach** - No expensive hardware required, CPU-friendly exercises
4. **Modern Web Technologies** - Docusaurus 3.9, React 19, TypeScript 5.6

### Impact

**Target Audiences:**
- **Students** - Structured learning path from beginner to advanced
- **Researchers** - Reference documentation for Physical AI concepts
- **Industry** - Training material for robotics teams

**Global Reach:**
- Accessible to **160M+ Urdu speakers** worldwide
- Open-source for **unlimited global distribution**
- Mobile-responsive for **learning anywhere**

---

## 📊 Project Metrics

| Metric | Value |
|--------|-------|
| **Modules** | 7 comprehensive |
| **Chapters** | 21+ |
| **Simulation Exercises** | 8 hands-on labs |
| **Languages** | 2 (English + Urdu) |
| **Bilingual Support** | Full RTL for Urdu |
| **License** | MIT (Open Source) |
| **Build Status** | ✅ Production-ready |
| **Mobile Responsive** | ✅ All devices |
| **Production Build** | ✅ Optimized |

---

## 🤝 Contributing

We welcome contributions from the robotics and education communities!

### How to Contribute

1. **Fork the repository**
```bash
git clone https://github.com/YOUR-USERNAME/physical-ai-humanoid-book.git
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Add your content**
- Place module content in `website/docs/modules/`
- Add exercises in `website/docs/exercises/`
- Update translations in `website/i18n/ur/` for Urdu

4. **Test locally**
```bash
cd website
npm install
npm start
```

5. **Submit a Pull Request**

### Contribution Guidelines

- Follow existing file structure and naming conventions
- Include both English and Urdu translations when possible
- Add code examples with proper syntax highlighting
- Test on multiple devices (desktop, tablet, mobile)
- Update documentation if adding new features

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Open Source Forever** - Free to use, modify, and distribute for educational purposes.

---

## 🙏 Acknowledgments

- **Panaversity** - For advancing Physical AI education globally
- **NVIDIA Isaac Platform** - For cutting-edge robotics simulation tools
- **Open Robotics (ROS)** - For the ROS 2 framework
- **Docusaurus Community** - For the amazing documentation platform
- **React Team** - For the powerful UI library
- **Open Source Contributors** - For making this possible

---

## 📞 Contact & Support

### Issues & Bug Reports
[GitHub Issues](https://github.com/HBC01/physical-ai-humanoid-book/issues)

### Discussions & Questions
[GitHub Discussions](https://github.com/HBC01/physical-ai-humanoid-book/discussions)

### Follow Development
[GitHub Repository](https://github.com/HBC01/physical-ai-humanoid-book)

---

## 🎬 Hackathon Demo / Quick Demo Script

### Homepage Overview (15 seconds)
1. Show landing page with project title and tagline
2. Highlight key features: 7 modules, bilingual, interactive

### Module Navigation (30 seconds)
1. Navigate to **Module 1: Foundations**
2. Show chapter structure and content
3. Scroll through a chapter with code examples

### Bilingual Toggle (15 seconds)
1. Switch to Urdu language
2. Show RTL support
3. Navigate through Urdu content

### Search Demo (15 seconds)
1. Use search bar to find "ROS 2 nodes"
2. Show instant results
3. Navigate to search result

### Interactive Features (15 seconds)
1. Show **Module 5: VLA Models** interactive examples
2. Demonstrate progress tracking (if time permits)
3. Showcase dark mode toggle

**Total Demo Time:** 90 seconds

**Closing Line:** "Production-ready, open-source, and accessible to millions. Let's democratize robotics education together."

---

## 🌟 Project Status

- ✅ **Build Status:** Successful
- ✅ **Production Ready:** Yes
- ✅ **All Features Complete:** Yes
- ✅ **Documentation:** Complete
- ✅ **Tests:** Passing
- ✅ **Accessibility:** Verified
- ✅ **Mobile Responsive:** Yes
- ✅ **Bilingual Support:** Full

---

## 🎯 Quick Links

- **Live Demo (Production):** [https://physical-ai-humanoid-book-kappa.vercel.app/](https://physical-ai-humanoid-book-kappa.vercel.app/)
- **GitHub Pages (Static):** [https://HBC01.github.io/physical-ai-humanoid-book/](https://HBC01.github.io/physical-ai-humanoid-book/)
- **Quick Start Guide:** [QUICK_START.md](QUICK_START.md)
- **Demo Script:** [DEMO_SCRIPT.md](DEMO_SCRIPT.md)
- **Feature Checklist:** [HACKATHON_CHECKLIST.md](HACKATHON_CHECKLIST.md)
- **Judge Pitch:** [JUDGE_PITCH.md](JUDGE_PITCH.md)
- **Documentation Index:** [INDEX.md](INDEX.md)

---

**Built with ❤️ for the Physical AI & Humanoid Robotics Community**

---

© 2025 Physical AI & Humanoid Robotics Book | MIT License | [Panaversity](https://panaversity.org)
