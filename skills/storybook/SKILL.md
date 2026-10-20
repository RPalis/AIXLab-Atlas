---
name: storybook
description: >-
  Build, maintain, and embed a 5-tier Atomic Design Storybook documentation site (Foundations, Atoms, Molecules, Organisms, Widgets) with interactive examples and embedded in-app prototype viewing. Use when documenting a prototype's components, building stories for them, or embedding Storybook inside the prototype.
---

# UX Atomic Storybook Builder & Documentation

This skill scaffolds and maintains a comprehensive **Atomic Design System Storybook** embedded directly inside the prototype application.

---

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Environment
- **Needs:** a file system, a shell and Node.js (npm).
- **If it isn't available:** No shell or Node.js here: stop and tell the user to run this skill in an environment that has them, such as Claude Code. Do not simulate install or build output.

## The 5-Tier Component Hierarchy

| Tier | Folder | Scope & Responsibility | Examples |
|---|---|---|---|
| **Foundations** | `src/stories/Foundations/` | Token specs & visual guidelines (no runnable component code) | `Typography`, `ColorPalette`, `Spacing`, `Elevation` |
| **Atoms** | `src/stories/Atoms/` | Base UI primitives with single visual roles | `Button`, `Badge`, `Avatar`, `Input`, `CountBadge`, `Logo` |
| **Molecules** | `src/stories/Molecules/` | Composed single-purpose groups | `Card`, `PageHeader`, `ReviewStepper`, `MultiSelectFilter` |
| **Organisms** | `src/stories/Organisms/` | Complex, multi-control sections | `Modal`, `SideNav`, `SubmissionsTable`, `Toolbar` |
| **Widgets** | `src/stories/Widgets/` | Full-page assembled views | `HomeView`, `ApprovedModelsView`, `SubmitNewView` |

---

## Process

### Step 1: Scaffold Storybook in `frontend/`
```bash
npx storybook@latest init --type react --builder vite
```

### Step 2: Configure Storybook with Prototype Tokens
Configure `.storybook/preview.ts` to import `src/index.css` so Storybook shares the exact two-layer token engine and dark mode toggle with the live prototype.

### Step 3: Generate Foundation & Component Stories
Create structured stories for all core components with argument controls (`args`), variant knobs, and grounded usage descriptions.

### Step 4: Build Static Storybook & Embed in Prototype
```bash
npm run build-storybook -o public/storybook
```
Wire the iframe modal in `AppShell.tsx` / `UserMenu.tsx` so stakeholders can explore the live design system directly inside the running prototype!
