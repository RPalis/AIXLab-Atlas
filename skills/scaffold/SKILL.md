---
name: scaffold
description: >-
  Scaffold a high-fidelity, interactive UX prototype: React 19, TypeScript, Vite, Tailwind CSS v3, Lucide icons, mock local storage stores. Starts from a generic structured base, then optionally layers on site-type-specific guidance (dashboard, chatbot, marketing site, CRM). Use when starting a new prototype from scratch.
---

# Proto-Type

This skill automates creating a high-fidelity, zero-friction prototype workspace. It has two parts: a **base scaffold** that's a complete, independently useful prototype on its own, and an **optional type layer** for prototypes that fit a recognizable site archetype. Not every prototype fits a type — the base scaffold alone is a fully valid outcome, so don't force one onto something genuinely bespoke.

---

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Base Scaffold

### Prototyping Architecture Principles

1. **Zero Backend Lock-In**: Avoid external databases or complicated authentication services for UI prototypes. Use in-memory React state + `localStorage` persistence + deterministic seed fixtures.
2. **Standard Folder Layout**:
   ```
   frontend/
     src/
       components/
         atoms/ molecules/ organisms/ widgets/   # Atomic tiers (see storybook)
         layout/           # Shell (Nav, Header, PrototypeTools, UserMenu)
       pages/              # Primary product surfaces (DashboardPage, DetailPage)
       hooks/              # Reusable state/data hooks
       types/              # Shared TypeScript types (or shared/types.ts, see below)
       utils/              # Pure helper functions
       stories/            # Storybook stories for Foundations & Components
       index.css           # 2-layer design tokens (:root & .dark)
       App.tsx             # Route management & global prototype shell
     public/
       storybook/          # Built static Storybook (viewable inside prototype)
   shared/                 # Domain types, workflow state machine, & seed fixtures
   docs/                   # Persona docs, PRD, DESIGN.md, & architecture diagrams
   ```
   `pages/` is the real-world convention (not `views/`); component tiers live directly under `components/{atoms,molecules,organisms,widgets}` matching the [`storybook`](../storybook/SKILL.md) taxonomy rather than a flat `ui/`. State is commonly plain `useState`/props or React Context rather than a dedicated `store/` — only add one if state genuinely needs centralizing.
3. **Integrated Prototype Tools**: Every prototype includes a **"Prototype Tools" section inside the existing user-menu dropdown** (an avatar/account popover, not a separate floating drawer) containing:
   - A persona/role switcher, implemented as React Context (a `PersonaType`/`RoleType` union + a registry + a `switchPersona()` setter) rather than `localStorage` — `localStorage` is fine for incidental UI prefs (panel widths, last-used filters) but shouldn't hold the active persona.
   - "Storybook Design System" launcher opening the embedded Storybook modal.
   - "Architecture Map" launcher opening [`map`](../map/SKILL.md)'s `site` mode modal.
   - A data-reset control is optional, not required. Add one only if the prototype actually persists mock data to `localStorage` and iterative testing benefits from a clean-slate button.

### Scaffolding Instructions

#### Step 1: Initialize Vite + React + TypeScript App
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install lucide-react clsx tailwind-merge react-router-dom
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

#### Step 2: Configure Tailwind & CSS Tokens
Implement the two-layer token architecture in `frontend/src/index.css` (Layer 1 raw colors + Layer 2 semantic tokens) and mirror semantic utilities in `frontend/tailwind.config.js`; see [`styleguide`](../styleguide/SKILL.md).

#### Step 3: Implement Shared Domain Types & Mock Seed Data
Create `shared/types.ts` and `shared/seed.ts` with rich realistic mockup records (avoid placeholder "Lorem Ipsum").

#### Step 4: Scaffold Shell & Navigation
Integrate `AppShell`, `SideNav`, `Header`, and `PrototypeTools` panel.

### Template Assets
- [`templates/App-shell-template.tsx`](templates/App-shell-template.tsx): Ready-to-use prototype shell with dark mode & tools.
- [`templates/mock-store-template.ts`](templates/mock-store-template.ts): Type-safe `localStorage` mock data hook.

---

## Optional Type Layer

Once the base scaffold exists, ask whether this prototype fits a recognizable site archetype. If it doesn't fit cleanly, stop here — the base scaffold is complete on its own; don't force-fit a type.

| Type | When to use | Reference |
|---|---|---|
| **Dashboard** | Core surface is a multi-widget analytics view, not a single workflow | [`references/dashboard.md`](references/dashboard.md) |
| **Chatbot / Conversational** | Core surface is a chat/assistant interaction | [`references/chatbot.md`](references/chatbot.md) |
| **Marketing Site** | Core surface is persuasion/conversion: landing pages, campaigns, product marketing | [`references/marketing-site.md`](references/marketing-site.md) |
| **CRM / Record-Management App** | Core surface is managing records through a lifecycle: contacts, deals, tickets, cases | [`references/crm-app.md`](references/crm-app.md) |

A prototype can also combine types (a product with both a marketing site and a CRM-style admin area); apply each reference to the relevant section rather than picking one for the whole app.
