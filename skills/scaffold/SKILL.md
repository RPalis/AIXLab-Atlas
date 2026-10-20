---
name: scaffold
description: >-
  Creates a new prototype: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide and local mock data.
  Adds an optional site-type layer (dashboard, chatbot, marketing site, CRM, mobile app). Use when
  starting a prototype from scratch.
disable-model-invocation: true
---

# Proto-Type

This skill automates creating a high-fidelity, zero-friction prototype workspace. It has two parts: a **base scaffold** that's a complete, independently useful prototype on its own, and an **optional type layer** for prototypes that fit a recognizable site archetype. Not every prototype fits a type — the base scaffold alone is a fully valid outcome, so don't force one onto something genuinely bespoke.

---

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

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
   - Optional: a "Project wiki" link to `./wiki/index.html`, when the project publishes its wiki next to the prototype (`wiki`'s `publish` mode with `--out <frontend>/public/wiki`). Add it only if that folder exists.
   - A data-reset control is optional, not required. Add one only if the prototype actually persists mock data to `localStorage` and iterative testing benefits from a clean-slate button.

### Before you scaffold: check the foundations

A prototype is a major milestone: it is where the team checks that everything lines up. The groundwork comes first. Collected information, the locked problem, the domain, content and navigation structure, the architecture, and the workflow patterns all have to be settled before prototyping, because a prototype built on a guess hides the guess.

Run [`foundations-check`](../../tools/foundations-check/foundations-check.sh). It lists seven foundations and the skill that makes each:

| Foundation | Doc | Made by |
|---|---|---|
| brief | `PRODUCT_BRIEF.md` | [`brief`](../brief/SKILL.md) |
| users | `PERSONA_WALKTHROUGH.md` | [`persona`](../persona/SKILL.md) |
| problem | `PROBLEM_STATEMENTS.md` | [`problems`](../problems/SKILL.md) |
| domain | `OOUX_OBJECT_MAP.md` | [`map`](../map/SKILL.md) `objects` |
| content | `INFORMATION_ARCHITECTURE.md` | `map` `ia` |
| architecture | `ARCHITECTURE_MAP.md` | `map` `site` |
| workflow | `JOURNEY_MAP.md` or a saved `map` `flow` | [`journey`](../journey/SKILL.md), `map` `flow` |

If all seven exist, go on. If any is missing:
1. Say which are missing, and recommend the order to make them (brief and users first, then the locked problem, then domain, content, architecture and workflow).
2. Offer three ways forward, and recommend the first when there is time:
   - **Make them first.** Run the skills in the table, then come back.
   - **Quick start.** For a project joined midway, or when something is needed to look at and test soon. Run [`brief`](../brief/SKILL.md)'s minimum pace (the core task, its main steps, the key objects), then scaffold. The prototype becomes the thing you test. Backfill the rest from what testing shows: [`interview`](../interview/SKILL.md) `usability` to test, [`map`](../map/SKILL.md) `document` to draw the architecture and object model from the built app, then `persona`, `map` `ia` and `journey`.
   - **Scaffold anyway**, with no extra questions.
3. This is the user's call. It shapes the product, so it is a checkpoint (suite `AGENTS.md` §2.9) and never a default.
4. For a quick start or scaffold-anyway, log it: `../../tools/log-unknown/log-unknown.sh --skill scaffold --tier 2 "Scaffolded before: <missing foundations>. Backfill after testing."` Then go on. A quick start is a valid, supported path, not a shortcut to apologize for.

**Autonomous mode:** do not scaffold with a foundation missing. Stop, name what is missing, and log it as a tier 3 unknown. The coordinator resolves this with the designer before it dispatches.

### Scaffolding Instructions

#### Step 0: Check for an Existing Figma Library
Before initializing, ask whether a Figma library is already set up for this product. If the user provides a link:
- Treat it as the source of truth for Step 2's tokens — use [`figma`](../figma/SKILL.md)'s `sync` mode, Import direction, to cast the library's Variables into the Two-Layer Token Architecture (via [`styleguide`](../styleguide/SKILL.md) forge mode) instead of the placeholder palette.
- **Autonomous mode:** using a real Figma library as the token/component source is also a checkpoint, not a tier — it's a bigger call than the type layer (everything downstream depends on it). If a real library link turns up anywhere in the docs and no designer has confirmed using it, stop before scaffolding anything at all rather than guessing either way; proceeding with the placeholder palette while a real library sits unconfirmed is exactly the kind of guess this rule exists to prevent.
- If the library also has real component frames (not just Variables), use [`figma`](../figma/SKILL.md)'s `import` mode for the shell/nav components in Step 4 so the base UI matches the library's actual components rather than being designed from scratch.
- If the user has no Figma library yet, proceed with the placeholder palette and skip this — don't block scaffolding on it.

#### Step 1: Initialize Vite + React + TypeScript App
```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install lucide-react clsx tailwind-merge react-router-dom
npm install -D tailwindcss@4 @tailwindcss/vite
```

Add the Tailwind plugin to `frontend/vite.config.ts`. Tailwind v4 needs no PostCSS file and no `tailwind.config.js`:
```ts
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

#### Step 2: Configure Tailwind & CSS Tokens
Copy the two-layer token file from [`styleguide`](../styleguide/SKILL.md)'s [`templates/index.css`](../styleguide/templates/index.css) to `frontend/src/index.css`. It already holds Layer 1, Layer 2 (light and `.dark`), the Tailwind v4 `@theme inline` mapping and a reduced-motion rule. Import it once in `main.tsx`. Run `styleguide` forge mode later to replace the placeholder palette with a real brand.

#### Step 3: Implement Shared Domain Types & Mock Seed Data
Create `shared/types.ts` and `shared/seed.ts` with rich realistic mockup records (avoid placeholder "Lorem Ipsum").

#### Step 4: Scaffold Shell & Navigation
Integrate `AppShell`, `SideNav`, `Header`, and `PrototypeTools` panel.

#### Step 5: Claim a Free Dev Server Port
Before the first `npm run dev`, check that Vite's default port (5173) isn't already bound by another running prototype:
```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN
```
If that returns a process, don't kill it blindly — it may be another prototype the user still has open. Instead pick the next free port (5174, 5175, ...) by repeating the check, then pin it in `frontend/vite.config.ts` so it's stable across restarts instead of Vite silently hopping ports each run:
```ts
export default defineConfig({
  server: { port: 5174, strictPort: true },
})
```
`strictPort: true` makes a real conflict fail loudly instead of silently starting on a different port than the user expects.

### Template Assets
- [`templates/App-shell-template.tsx`](templates/App-shell-template.tsx): Ready-to-use prototype shell with dark mode & tools.
- [`templates/mock-store-template.ts`](templates/mock-store-template.ts): Type-safe `localStorage` mock data hook.

---

## Optional Type Layer

Once the base scaffold exists, ask whether this prototype fits a recognizable site archetype. If it doesn't fit cleanly, stop here — the base scaffold is complete on its own; don't force-fit a type. **Autonomous mode** (suite `AGENTS.md` §2.9): this is a **checkpoint**, not a tier — the type layer shapes the actual product, so it's never picked without a designer's say, even when a signal in the docs looks clear-cut. Whatever's driving the work resolves this with the designer before dispatching the work that would apply it (see `agents/scaffold-agent.md`); a base scaffold with no type layer applied yet is a complete, valid state to stop at in the meantime, not a stall.

| Type | When to use | Reference |
|---|---|---|
| **Dashboard** | Core surface is a multi-widget analytics view, not a single workflow | [`references/dashboard.md`](references/dashboard.md) |
| **Chatbot / Conversational** | Core surface is a chat/assistant interaction | [`references/chatbot.md`](references/chatbot.md) |
| **Marketing Site** | Core surface is persuasion/conversion: landing pages, campaigns, product marketing | [`references/marketing-site.md`](references/marketing-site.md) |
| **CRM / Record-Management App** | Core surface is managing records through a lifecycle: contacts, deals, tickets, cases | [`references/crm-app.md`](references/crm-app.md) |
| **Mobile App** | The product ships as a phone or tablet app (iOS, Android or both) | [`references/mobile-app.md`](references/mobile-app.md) |

A prototype can also combine types (a product with both a marketing site and a CRM-style admin area); apply each reference to the relevant section rather than picking one for the whole app.
