---
name: router
description: Interactive navigator and roadmap for the UX Design & Prototyping Skills Suite, organized around Discover, Decide, Design, and Deliver. Use when starting a new design project, exploring available prototype skills, or planning an end-to-end prototype lifecycle.
disable-model-invocation: true
---

# UX Design & Prototyping Suite Router

Welcome to **UX Atlas**, a modular, end-to-end framework for turning user insights and product concepts into high-craft, interactive, shareable prototypes. The suite follows one process, **Discover → Decide → Design → Deliver**, with a handful of skills usable at any point rather than gated to one phase.

Several skills below are **multi-mode**: one skill, several named modes for related-but-distinct jobs (`audit`'s `craft`/`code`/`a11y`, `figma`'s `capture`/`import`/`sync`). Say which mode you want, or the skill will ask.

Not sure where to start, or which skill fits what you're doing right now? [`help`](../help/SKILL.md) reads the actual state of the current repo and tells you the next 1-3 moves, rather than making you read this whole map.

## Before Discover
Nothing exists yet, not even `README.md`.

0. [`setup`](../setup/SKILL.md) creates the repo's doc shell (`README.md`, a project `AGENTS.md`, empty `docs/UNKNOWNS.md`, `docs/notes/` for the wiki and anything else worth jotting down) before any research, design, or code starts. Works on an existing product too, appending to whatever's already there instead of overwriting it.
1. [`brief`](../brief/SKILL.md) interrogates whoever already has the idea in their head: what the product is, who it's for, the distinct user types, their core tasks, devices/context of use, competitive landscape, constraints. Writes `docs/PRODUCT_BRIEF.md`, the domain brief [`persona`](../persona/SKILL.md) expects as input. On an existing product, it drafts from the codebase first and confirms the gaps instead of starting blank.

## Discover
Understand the users and the problem before proposing anything.

1. **Kicking off with a team or stakeholders?** → [`workshop`](../workshop/SKILL.md) plans a working session: activities, timing, agenda.
2. **Coming out of a physical workshop with photos of the board?** → [`digitize`](../digitize/SKILL.md) turns whiteboard/sticky-note photos into a deck, doc, CSV, or a replicated FigJam board.
3. **Need real user input** (early, or validating a working prototype)? → [`interview`](../interview/SKILL.md), phase-aware, builds the question bank and script.
4. **Formalize who the users are and their day-to-day** → [`persona`](../persona/SKILL.md), producing `docs/PERSONA_WALKTHROUGH.md`.

Once there's a real sense of the users and their needs, move to **Decide**.

## Decide
Frame the problem, scope the objects, make the calls that are expensive to reverse.

1. **Model the domain** → [`concepting`](../concepting/SKILL.md) in Plan mode, an interactive ORCA walkthrough (Objects, Relationships, CTAs, Attributes) seeding `docs/OOUX_OBJECT_MAP.md`.
2. **Hit a genuinely hard call?** → [`interrogate`](../interrogate/SKILL.md) interrogates it one question at a time, then optionally hands off to [`decisions`](../decisions/SKILL.md) for a permanent ADR.

Once scope and the object model are settled, move to **Design**.

## Design
Build the actual prototype.

1. **Scaffold** → [`scaffold`](../scaffold/SKILL.md): base React/Vite/Tailwind scaffold, plus an optional site-type layer (`dashboard`, `chatbot`, `marketing-site`, `crm-app`).
2. **Tokens & brand** → [`tokens`](../tokens/SKILL.md) for the two-layer architecture and `DESIGN.md`; [`forge`](../forge/SKILL.md) if casting a new brand.
3. **Build, then loop** → [`audit`](../audit/SKILL.md)'s `craft` mode (find problems, scored, as a task list) ↔ [`refine`](../refine/SKILL.md) (fix and unify). Repeat until the score holds.
4. **Document as it solidifies** → [`storybook`](../storybook/SKILL.md) (components), [`map`](../map/SKILL.md)'s `site` mode (route/component graph: interactive, Mermaid, or SVG) or `flow` mode (journey/workflow diagrams), [`wiki`](../wiki/SKILL.md) (anything else worth remembering).
5. **Accessibility** → [`audit`](../audit/SKILL.md)'s `a11y` mode, once the UI has stabilized enough that findings won't immediately go stale.
6. **Moving to/from Figma?** → see Usable Anytime, below.

Once the prototype holds up under `audit`'s `craft` and `a11y` modes, move to **Deliver**.

## Deliver
Ship it, validate it, hand it off.

1. **Code standards** → [`audit`](../audit/SKILL.md)'s `code` mode before anything ships.
2. **Package** → [`package`](../package/SKILL.md) for the static handoff bundle (`full` or `lite`).
3. **Present to stakeholders** → [`showcase`](../showcase/SKILL.md) (PDF/PowerPoint or reveal.js deck). **Document for end users** → [`guide`](../guide/SKILL.md), diagrams via `map`'s `flow` mode. **Write it up as a backlog** → [`requirements`](../requirements/SKILL.md): reads the built prototype into Epics & Features, optional Jira/ADO export.
4. **Validating with real users?** → loop back to [`interview`](../interview/SKILL.md) in validation mode, which reads `docs/UNKNOWNS.md` for what's still open.

## Usable Anytime
Not gated to one phase.

- [`decisions`](../decisions/SKILL.md) / [`interrogate`](../interrogate/SKILL.md): capturing and interrogating decisions, whenever one comes up.
- [`note`](../note/SKILL.md): a quick, low-ceremony capture that folds straight into the wiki, no separate compile step needed.
- [`wiki`](../wiki/SKILL.md): compiling scattered notes as the project accumulates them.
- [`figma`](../figma/SKILL.md): moving work to and from Figma, whenever it's part of the workflow: `capture` (screen → Figma layers), `import` (Figma frame → code), or `sync` (token system ↔ Figma library).
- `docs/UNKNOWNS.md`: the running list every skill defers to instead of guessing (AGENTS.md §2.6), tying Discover through Deliver together.

## Meta: Managing the Suite Itself

One skill sits outside the lifecycle entirely — it manages the skill library, not a prototype:

- [`skill-manager`](../skill-manager/SKILL.md): install, delete, disable, enable, list, and sync skills in the shared `~/.agents/skills` library (symlinked into Claude Code and Gemini CLI), and show what any installed skill does.

## Complete Skill Directory

### Before Discover
- **[`setup`](../setup/SKILL.md)**: Bootstrap a prototype repo's doc shell (`README.md`, a project `AGENTS.md` recording doc ownership, empty `docs/UNKNOWNS.md`, `docs/notes/`) before anything else runs — on a brand-new repo or an existing product, appending rather than overwriting whatever's already there.
- **[`brief`](../brief/SKILL.md)**: Interactively interrogate whoever already has the product idea, one question at a time (or in themed batches, the user's choice): what it is, who it's for, distinct user types and their core tasks, devices and context of use, competitive landscape, constraints. Writes `docs/PRODUCT_BRIEF.md`; pushes anything unresolved to `docs/UNKNOWNS.md`. On an existing product, drafts the brief from the codebase first and confirms it with the stakeholder rather than starting blank.

### Discover
- **[`workshop`](../workshop/SKILL.md)**: Plan a design-thinking workshop: activity selection, written agenda, optional FigJam board and/or slide deck.
- **[`digitize`](../digitize/SKILL.md)**: Convert photos of a physical workshop board (whiteboard, stickies, affinity map, risk matrix) into a PowerPoint deck, Word/Markdown doc, CSV, or a replicated FigJam board.
- **[`persona`](../persona/SKILL.md)**: Transform user research, interview notes, or domain briefs into rich persona cards, mental models, friction maps, and step-by-step "Day in the Life" walkthroughs.
- **[`interview`](../interview/SKILL.md)**: Phase-aware research kit (question bank, script, synthesis template) for discovery interviews early on or validation interviews against a working prototype.

### Decide
- **[`concepting`](../concepting/SKILL.md)**: Interactive OOUX/ORCA modeling: Objects, Relationships, Calls-to-Action, Attributes. Plan mode seeds the model; Audit mode reconciles it against a built prototype.

### Design
- **[`scaffold`](../scaffold/SKILL.md)**: Scaffold a lightweight, zero-backend-dependency React 19 + TypeScript + Vite + Tailwind CSS prototype: a complete base scaffold, plus an optional site-type layer for prototypes that fit a recognizable archetype.
- **[`tokens`](../tokens/SKILL.md)**: Establish the two-layer token architecture (Layer 1 Raw Palette + Layer 2 Semantic auto-flipping CSS variables) and generate a spec-conformant `DESIGN.md`.
- **[`forge`](../forge/SKILL.md)**: Cast a dedicated brand token preset for a new company or sub-brand from live CSS, brand guidelines, or verified hex matrices.
- **[`audit`](../audit/SKILL.md)**: Three modes: `craft` (scored critique: hierarchy, cognitive load, IA, consistency, responsive, delight, producing a task list before any fixing), `code` (coding standards: token adherence, structure/reuse, mechanical hygiene), `a11y` (deep WCAG 2.1/2.2 AA sweep, ranked pass/fail per success criterion). None of the modes fix anything.
- **[`refine`](../refine/SKILL.md)**: Fix and unify. Apply micro-interactions, responsive container grids, dark mode tuning, and refined visual craft.
- **[`storybook`](../storybook/SKILL.md)**: Organize UI into the 5 Atomic Design tiers (Foundations, Atoms, Molecules, Organisms, Widgets), build Storybook stories, and embed static Storybook inside the prototype's user menu.
- **[`map`](../map/SKILL.md)**: Two modes. `site` generates a route/component graph: an interactive in-app Vis.js modal, a portable Mermaid diagram, and an SVG export. `flow` turns a persona walkthrough or branching workflow into a Mermaid flowchart: user journeys and process flows, not site structure (that's `site`). Either mode can export to FigJam once the Figma MCP server is connected.

### Deliver
- **[`package`](../package/SKILL.md)**: Two modes: `full` (unminified site + raw source + docs, a three-folder handoff zip for a developer to rebuild) or `lite` (minified `production/` folder only, bare essentials, just to run it).
- **[`showcase`](../showcase/SKILL.md)**: Build a shareable presentation from the prototype: a static PDF/PowerPoint deck or a reveal.js web deck, narrative sourced from `persona`'s scenes.
- **[`guide`](../guide/SKILL.md)**: Write end-user documentation, Getting Started plus a phase-by-phase walkthrough, as a Markdown doc with an optional PDF export.
- **[`requirements`](../requirements/SKILL.md)**: Read the built prototype (code, OOUX object map, persona walkthrough, ADRs) and write it up as Epics containing Features with user stories and acceptance criteria, as `docs/REQUIREMENTS.md`. Optionally publishes Epics/Features straight to Jira or Azure DevOps once an MCP server for one is connected.

### Usable Anytime
- **[`help`](../help/SKILL.md)**: Reads the current repo's actual state (which docs exist) and recommends the next 1-3 skills, with the reason. The situational advisor version of this router.
- **[`decisions`](../decisions/SKILL.md)**: Capture a non-obvious UX or architecture decision, and the alternatives it rejected, as a short ADR in `docs/adr/`.
- **[`note`](../note/SKILL.md)**: The lowest-ceremony capture in the suite: a quick thought dropped into `docs/notes/my-notes/`, then immediately folded into the wiki. No formal ADR, no separate compile step to remember to run.
- **[`interrogate`](../interrogate/SKILL.md)**: Interrogate a design decision one question at a time until reaching shared understanding, then optionally hand off to `decisions`.
- **[`wiki`](../wiki/SKILL.md)**: Compile scattered notes into a small, interlinked, tool-agnostic markdown wiki, including a `constellation` graph view of how entities connect.
- **[`figma`](../figma/SKILL.md)**: Three modes: `capture` (button/right-click that sends a live screen into Figma as editable layers, no MCP needed), `import` (a Figma frame/selection into the codebase as convention-conformant code), `sync` (bidirectional token sync between `index.css`/`DESIGN.md` and a Figma library).

### Meta
- **[`skill-manager`](../skill-manager/SKILL.md)**: Install, delete, disable, enable, list, and sync skills in the shared `~/.agents/skills` library, and show what any installed skill does. Manages the library itself, outside the design lifecycle.
