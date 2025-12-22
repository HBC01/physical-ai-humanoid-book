# Contributors Guide

Thank you for your interest in contributing to the Physical AI & Humanoid Robotics Textbook! This guide will help you get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Content Authoring](#content-authoring)
- [MDX Component Usage](#mdx-component-usage)
- [Translation Workflow](#translation-workflow)
- [Code Style Standards](#code-style-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Text editor (VS Code recommended)
- Basic knowledge of Markdown and React

### Setup

```bash
git clone https://github.com/HBC01/physical-ai-humanoid-book.git
cd physical-ai-humanoid-book/website
npm install
npm start
```

## Content Authoring

### File Structure

All content files are in `docs/`:

```
docs/
├── modules/
│   ├── 01-foundations/
│   │   ├── chapter-01-intro.mdx
│   │   ├── chapter-02-embodied-intelligence.mdx
│   │   └── chapter-03-physical-systems.mdx
│   ├── 02-ros2/
│   └── ...
└── exercises/
    ├── ros2-publisher/
    └── ...
```

### Chapter Template

```mdx
---
title: "Chapter Title"
sidebar_label: "Short Label"
---

# Chapter Title

## Learning Objectives

After completing this chapter, you will be able to:

- Objective 1
- Objective 2
- Objective 3

## Section 1

Content here with code examples:

\`\`\`python
# Example code
def hello_world():
    print("Hello, Physical AI!")
\`\`\`

## Section 2

More content...

## Key Takeaways

- Takeaway 1
- Takeaway 2

## Next Steps

Link to next chapter or exercises.
```

### Writing Guidelines

**Style:**
- Use clear, concise language
- Explain technical concepts with examples
- Include code snippets for practical demonstrations
- Add diagrams where helpful

**Formatting:**
- Use proper heading hierarchy (H1 → H2 → H3)
- Keep paragraphs short (3-5 sentences)
- Use bullet points for lists
- Use code blocks with language tags

**Technical Accuracy:**
- Verify all code examples run correctly
- Include expected outputs
- Mention common errors and solutions
- Link to official documentation

## MDX Component Usage

### Custom Components

#### ExerciseRunner

For interactive exercises:

```mdx
import ExerciseRunner from '@site/src/components/ExerciseRunner';

<ExerciseRunner
  exerciseId="ros2-publisher-01"
  title="Create a ROS 2 Publisher"
  difficulty="beginner"
  estimatedTime="30 minutes"
  prerequisites={['ROS 2 installed', 'Python basics']}
/>
```

#### ChapterProgress

For chapter completion tracking:

```mdx
import { ChapterProgress } from '@site/src/components/ProgressTracker';

<ChapterProgress
  chapterId="01-foundations/chapter-01-intro"
  chapterTitle="Introduction to Physical AI"
/>
```

#### AIAssistant

Inline AI assistant (optional):

```mdx
import AIAssistant from '@site/src/components/AIAssistant';

<AIAssistant mode="inline" />
```

### Code Blocks

**Basic:**
```mdx
\`\`\`python
print("Hello, world!")
\`\`\`
```

**With title:**
```mdx
\`\`\`python title="publisher.py"
import rclpy
from rclpy.node import Node

class SimplePublisher(Node):
    def __init__(self):
        super().__init__('simple_publisher')
\`\`\`
```

**With highlighting:**
```mdx
\`\`\`python {2-3}
def main():
    # highlight-next-line
    node = SimplePublisher()
    rclpy.spin(node)
\`\`\`
```

### Admonitions

Use for notes, warnings, tips:

```mdx
:::note
This is a note
:::

:::tip
Helpful tip here
:::

:::warning
Important warning
:::

:::danger
Critical information
:::
```

### Tabs

For multi-language examples:

```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="python" label="Python" default>
    \`\`\`python
    print("Hello")
    \`\`\`
  </TabItem>
  <TabItem value="cpp" label="C++">
    \`\`\`cpp
    std::cout << "Hello" << std::endl;
    \`\`\`
  </TabItem>
</Tabs>
```

## Translation Workflow

### Structure

Translations are in `i18n/{locale}/`:

```
i18n/
├── en/  (English - default)
└── ur/  (Urdu - اردو)
    ├── docusaurus-theme-classic/
    │   ├── navbar.json
    │   └── footer.json
    └── docusaurus-plugin-content-docs/
        └── current/
            └── modules/
                └── 01-foundations/
                    └── chapter-01-intro.mdx
```

### Translating Content

1. **Copy English file structure to Urdu:**
   ```bash
   mkdir -p i18n/ur/docusaurus-plugin-content-docs/current/modules/01-foundations
   ```

2. **Translate frontmatter:**
   ```mdx
   ---
   title: "Physical AI کا تعارف"
   sidebar_label: "باب 1: تعارف"
   ---
   ```

3. **Translate content:**
   - Keep code examples in original language
   - Add Urdu comments where helpful
   - Maintain formatting and structure
   - Keep component usage intact

4. **Translate UI strings:**
   Edit `i18n/ur/docusaurus-theme-classic/navbar.json`:
   ```json
   {
     "item.label.Docs": {
       "message": "دستاویزات",
       "description": "Navbar item label for Docs"
     }
   }
   ```

### RTL Support

For Urdu (RTL language):
- Set `direction: 'rtl'` in docusaurus.config.ts (already done)
- CSS automatically handles RTL layout
- Test navigation and components work correctly

## Code Style Standards

### TypeScript/JavaScript

- Use TypeScript for new components
- Follow ESLint rules (npm run lint)
- Use functional components and hooks
- Add JSDoc comments for complex functions

```typescript
/**
 * Retrieve relevant chunks for a user query
 * @param query - User's search query
 * @param topK - Number of results to return
 * @returns Top-k retrieval results with similarity scores
 */
export async function retrieveChunks(
  query: string,
  topK: number = 3
): Promise<RetrievalResult[]> {
  // Implementation
}
```

### Python

- Follow PEP 8 style guide
- Use type hints
- Add docstrings
- Keep functions focused and testable

```python
def generate_embeddings(texts: List[str], model: SentenceTransformer) -> np.ndarray:
    """
    Generate embeddings for a list of texts.

    Args:
        texts: List of text strings to embed
        model: Pre-loaded SentenceTransformer model

    Returns:
        NumPy array of embeddings (n x embedding_dim)
    """
    return model.encode(texts, show_progress_bar=True)
```

### CSS

- Use CSS modules for components
- Follow BEM naming where applicable
- Support dark mode
- Ensure responsive design

```css
.component {
  /* Base styles */
}

.component__element {
  /* Element styles */
}

[data-theme='dark'] .component {
  /* Dark mode styles */
}

@media (max-width: 768px) {
  .component {
    /* Mobile styles */
  }
}
```

## Testing

### Unit Tests (Jest)

Create tests in `__tests__` or `*.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

Run tests:
```bash
npm test
```

### E2E Tests (Playwright)

Create tests in `e2e/`:

```typescript
import { test, expect } from '@playwright/test';

test('navigation works', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Docs');
  await expect(page).toHaveURL(/.*docs.*/);
});
```

Run E2E tests:
```bash
npm run test:e2e
```

### Manual Testing

Before submitting:
- Test in Chrome, Firefox, Safari
- Test mobile responsive design
- Test dark mode
- Test language switching (if applicable)
- Verify accessibility (keyboard navigation, screen reader)

## Submitting Changes

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `translation/locale` - Translation work

### Commit Messages

Use conventional commits:

```
feat: add chapter on PyBullet basics
fix: correct ROS 2 node example typo
docs: update installation instructions
translation(ur): translate Module 1 chapters
```

### Pull Request Process

1. **Create a branch:**
   ```bash
   git checkout -b feature/my-new-chapter
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "feat: add chapter on VLA basics"
   ```

3. **Push to GitHub:**
   ```bash
   git push origin feature/my-new-chapter
   ```

4. **Create Pull Request:**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Fill out template
   - Request review

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New content (chapter, exercise)
- [ ] Bug fix
- [ ] Enhancement
- [ ] Translation
- [ ] Documentation

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No console warnings
```

## Questions?

- Create an issue on GitHub
- Tag maintainers for help
- Join discussions in GitHub Discussions

Thank you for contributing! 🙏
