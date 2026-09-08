---
name: storybook
description: Build, maintain, and embed a 5-tier Atomic Design Storybook documentation site (Foundations, Atoms, Molecules, Organisms, Widgets) with interactive examples and embedded in-app prototype viewing.
disable-model-invocation: true
---

# UX Atomic Storybook Builder & Documentation

This skill scaffolds and maintains a comprehensive **Atomic Design System Storybook** embedded directly inside the prototype application.

---

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
