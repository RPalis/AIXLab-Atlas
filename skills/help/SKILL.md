---
name: help
description: Two modes. Default mode figures out which skill in this suite to use next, given the actual state of the current project, not a static list — reads what docs already exist to place the project on Discover/Decide/Design/Deliver, then recommends the next 1-3 skills with a reason. `atlas` mode is the full browsable directory of the suite: every skill, every phase, every mode, cross-linked. Use default mode when the user asks "what should I do next," "which skill do I need," or is otherwise unsure where they are in the process. Use `atlas` mode when they want to see the whole roadmap, browse what's available, or understand how the suite fits together.
disable-model-invocation: true
---

# Help

Say which mode you want, or this skill asks: **default** ("you are here" — reads the repo, gives the next move) or **`atlas`** (the full map — every skill, every phase, browsable any time).

## Default mode

### Step 1: Read the signals

Check for these, in this order, to place the project on Discover → Decide → Design → Deliver:

| Signal found | Reading |
|---|---|
| No `README.md`/`AGENTS.md`, no `docs/`, no `package.json` | Nothing started yet → **before Discover** |
| `docs/UNKNOWNS.md` exists, no `PERSONA_WALKTHROUGH.md` | Setup done, research not started → **early Discover** |
| `docs/PERSONA_WALKTHROUGH.md` exists, no `OOUX_OBJECT_MAP.md` | Users understood, scope not framed → **Discover → Decide** |
| `docs/OOUX_OBJECT_MAP.md` exists, no `package.json`/`src/` | Scope framed, nothing built → **Decide → Design** |
| `src/` exists, no `index.css` token layer or no `DESIGN.md` | Building, tokens not established → **early Design** |
| `DESIGN.md` and components exist, no recent `audit` output mentioned | Mid-build → **Design, loop craft-audit ↔ refine** |
| Screens built, `audit`'s `code`/`a11y` modes not yet run | Nearing done → **Design → Deliver boundary** |
| `package`/`showcase`/`guide` output already exists | Shipped once already → **Deliver, or back to Discover for the next round** |

Not a rigid state machine — a project can legitimately have `DESIGN.md` before `PERSONA_WALKTHROUGH.md` (started with a scaffold, backfilling research). Use the signals to form a hypothesis, then confirm it in Step 2 rather than asserting it as fact.

**Check `docs/PRODUCT_BRIEF.md` independently of where the table otherwise places the project.** It's cheap to backfill (`brief`'s reconnaissance pass drafts it from whatever else already exists rather than a blank interview) and everything else reads better against a confirmed one, so a missing brief is always worth surfacing even on a project that's clearly well past Discover by every other signal — a real pattern when this suite gets layered onto a repo after work already started (`setup`'s existing-product hand-off routes through `brief` for exactly this reason, then here). Don't let a later-phase signal from the table above crowd it out of the recommendation.

### Step 2: Ask if the signals don't resolve it

If file signals are ambiguous, or the user's actual goal doesn't obviously match where the files say they are, ask one direct question: "what are you trying to get done right now?" Don't run the Step 1 table past the user as a report; it's your reasoning, not their answer.

### On-ramps: situations that skip the linear flow

Some starting points aren't "the project is at phase X"; they're a specific event that has its own answer regardless of overall project phase:

- **Nothing exists yet, not even an idea captured anywhere** → [`setup`](../setup/SKILL.md), always first.
- **Just came out of a physical workshop with photos of a board** → [`workshop`](../workshop/SKILL.md)'s `ingest` mode.
- **Something in the running prototype looks or feels wrong right now** → [`audit`](../audit/SKILL.md) (ask which mode, usually `craft`).
- **Stuck on a real tradeoff, can't decide between two directions** → [`interrogate`](../interrogate/SKILL.md).
- **Need to move something to/from Figma** → [`figma`](../figma/SKILL.md).
- **A decision was already made and needs to survive past this conversation** → [`decisions`](../decisions/SKILL.md).
- **A real process is broken or slow, and it needs mapping/fixing, not just a persona narrative** → [`journey`](../journey/SKILL.md).
- **Need to define what success looks like, or an existing goal has no real metric behind it** → [`metrics`](../metrics/SKILL.md).
- **Don't know who else is out there, or need a real feature/workflow/UX comparison against competitors** → [`competitors`](../competitors/SKILL.md)'s `discover` mode.

Check on-ramps before falling back to the phase table. A mid-Design project that just got back from a stakeholder workshop still needs `workshop`'s `ingest` mode first, not whatever Design-phase skill the file signals suggest.

### Step 3: Recommend

Give 1-3 ranked skills, each with a one-line reason tied to what was actually found (a file that exists or doesn't, not a generic phase description). Point to `atlas` mode for the full picture if the user wants the whole path, not just the next step. Don't recommend a skill whose living doc already exists and looks current; that's re-doing finished work.

**Completion criterion:** every recommendation names the specific signal (a file, or the user's stated goal) that produced it. Never give a recommendation that's just "you're in Design phase, so try one of these" with no link back to actual project state.

## `atlas` mode

Welcome to **UX Atlas**, a modular, end-to-end framework for turning user insights and product concepts into high-craft, interactive, shareable prototypes. The suite follows one process, **Discover → Decide → Design → Deliver**, with a handful of skills usable at any point rather than gated to one phase.

Several skills below are **multi-mode**: one skill, several named modes for related-but-distinct jobs (`audit`'s `craft`/`code`/`a11y`, `figma`'s `capture`/`import`/`sync`, `map`'s `objects`/`site`/`flow`/`audit`/`document`). Say which mode you want, or the skill will ask.

Not sure where to start, or which skill fits what you're doing right now? Default `help` mode reads the actual state of the current repo and tells you the next 1-3 moves, rather than making you read this whole map.

### Before Discover
Nothing exists yet, not even `README.md`.

0. [`setup`](../setup/SKILL.md) creates the repo's doc shell — a docs folder named after the project (e.g. `pocket-atlas-docs/`, not a bare `docs/`), `README.md`, a project `AGENTS.md` recording that name, empty `UNKNOWNS.md`, `notes/` for the wiki and anything else worth jotting down — before any research, design, or code starts. Works on an existing product too, appending to whatever's already there instead of overwriting it, then hands off to `brief` for a lay-of-the-land pass (even mid-lifecycle) and default `help` mode for the full gap analysis of what to backfill.
1. [`brief`](../brief/SKILL.md) interrogates whoever already has the idea in their head: what the product is, who it's for, the distinct user types, their core tasks, devices/context of use, competitive landscape, constraints. Writes `docs/PRODUCT_BRIEF.md`, the domain brief [`persona`](../persona/SKILL.md) expects as input. On an existing product, it drafts from the codebase first and confirms the gaps instead of starting blank.

### Discover
Understand the users and the problem before proposing anything.

1. **Kicking off with a team or stakeholders?** → [`workshop`](../workshop/SKILL.md)'s `plan` mode plans a working session: activities, timing, agenda.
2. **Coming out of a physical workshop with photos of the board?** → [`workshop`](../workshop/SKILL.md)'s `ingest` mode turns whiteboard/sticky-note photos into a deck, doc, CSV, or a replicated FigJam board.
3. **Who else is in this market?** → [`competitors`](../competitors/SKILL.md)'s `discover` mode: researches the web for candidate competitors, lets the user pick which to profile, then captures their features, workflow, and UX patterns. Producing `docs/COMPETITIVE_ANALYSIS.md`.
4. **Need real user input** (early, or validating a working prototype)? → [`interview`](../interview/SKILL.md), phase-aware, builds the question bank and script.
5. **Formalize who the users are and their day-to-day** → [`persona`](../persona/SKILL.md), producing `docs/PERSONA_WALKTHROUGH.md`.
6. **A real process is broken or slow, and it needs fixing, not just a persona narrative?** → [`journey`](../journey/SKILL.md): maps the current-state process — a swimlane (`map`) or, for a customer-facing process where timing and cross-team handoffs matter, a full service blueprint (`blueprint`) — scores pain points by severity × frequency, and scopes fix directions with measurable targets. Producing `docs/JOURNEY_MAP.md`.
7. **Define what success looks like** → [`metrics`](../metrics/SKILL.md): OKRs framed against the right framework for the product's medium and adoption model (HEART, CASTLE, or SELECT), each Key Result tagged by category. Producing `docs/OKR.md`.

Once there's a real sense of the users and their needs, move to **Decide**.

### Decide
Frame the problem, scope the objects, make the calls that are expensive to reverse.

1. **Model the domain** → [`map`](../map/SKILL.md)'s `objects` mode, an interactive ORCA walkthrough (Objects, Relationships, CTAs, Attributes) seeding `docs/OOUX_OBJECT_MAP.md` plus an entity-relationship diagram.
2. **Plan the information architecture** → [`map`](../map/SKILL.md)'s `site` mode: the proposed route/workspace/component structure as a diagram, before any of it is built.
3. **Sketch a journey or workflow** → [`map`](../map/SKILL.md)'s `flow` mode, sourcing from a persona walkthrough or the `objects` model's CTAs.
4. **Hit a genuinely hard call?** → [`interrogate`](../interrogate/SKILL.md) interrogates it one question at a time, then optionally hands off to [`decisions`](../decisions/SKILL.md) for a permanent ADR.

Once scope, IA, and the object model are settled, move to **Design**.

### Design
Build the actual prototype.

1. **Scaffold** → [`scaffold`](../scaffold/SKILL.md): base React/Vite/Tailwind scaffold, plus an optional site-type layer (`dashboard`, `chatbot`, `marketing-site`, `crm-app`).
2. **Tokens & brand** → [`styleguide`](../styleguide/SKILL.md) for the two-layer architecture and `DESIGN.md`; its forge mode casts a new brand's real values in first.
3. **Build, then loop** → [`audit`](../audit/SKILL.md)'s `craft` mode (find problems, scored, as a task list) ↔ [`refine`](../refine/SKILL.md) (fix and unify). Repeat until the score holds.
4. **Document as it solidifies** → [`storybook`](../storybook/SKILL.md) (components), [`map`](../map/SKILL.md)'s `document` mode (regenerates the site diagram — interactive, Mermaid, SVG — from the real built app, and reconciles the object model if it's drifted; its `audit` mode does the reconciliation alone, without the diagram refresh), [`wiki`](../wiki/SKILL.md) (anything else worth remembering).
5. **Accessibility** → [`audit`](../audit/SKILL.md)'s `a11y` mode, once the UI has stabilized enough that findings won't immediately go stale.
6. **Moving to/from Figma?** → see Usable Anytime, below.

Once the prototype holds up under `audit`'s `craft` and `a11y` modes, move to **Deliver**.

### Deliver
Ship it, validate it, hand it off.

1. **Code standards** → [`audit`](../audit/SKILL.md)'s `code` mode before anything ships.
2. **Package** → [`package`](../package/SKILL.md) for the static handoff bundle (`full` or `lite`).
3. **Present to stakeholders** → [`showcase`](../showcase/SKILL.md) (PDF/PowerPoint or reveal.js deck). **Document for end users** → [`guide`](../guide/SKILL.md), diagrams via `map`'s `flow` mode. **Write it up as a backlog** → [`requirements`](../requirements/SKILL.md): reads the built prototype into Epics & Features, optional Jira/ADO export.
4. **Validating with real users?** → loop back to [`interview`](../interview/SKILL.md) in validation mode, which reads `docs/UNKNOWNS.md` for what's still open.

### Usable Anytime
Not gated to one phase.

- [`decisions`](../decisions/SKILL.md) / [`interrogate`](../interrogate/SKILL.md): capturing and interrogating decisions, whenever one comes up.
- [`wiki`](../wiki/SKILL.md)'s `note` mode: a quick, low-ceremony capture that folds straight in, no separate compile step needed.
- [`wiki`](../wiki/SKILL.md)'s default `compile` mode: compiling scattered notes as the project accumulates them.
- [`figma`](../figma/SKILL.md): moving work to and from Figma, whenever it's part of the workflow: `capture` (screen → Figma layers), `import` (Figma frame → code), or `sync` (token system ↔ Figma library).
- `docs/UNKNOWNS.md`: the running list every skill defers to instead of guessing (AGENTS.md §2.6), tying Discover through Deliver together.

### Meta: Managing the Suite Itself

One skill sits outside the lifecycle entirely — it manages the skill library, not a prototype:

- [`skill-manager`](../skill-manager/SKILL.md): install, delete, disable, enable, list, and sync skills in the shared `~/.agents/skills` library (symlinked into Claude Code and Gemini CLI), and show what any installed skill does.

### Complete Skill Directory

#### Before Discover
- **[`setup`](../setup/SKILL.md)**: Bootstrap a prototype repo's doc shell — a docs folder named after the project (`<project-slug>-docs/`, not a bare `docs/`, so it reads unambiguously in a third-party vault tool), `README.md`, a project `AGENTS.md` recording that name and doc ownership, empty `UNKNOWNS.md`, `notes/` — before anything else runs, on a brand-new repo or an existing product, appending rather than overwriting whatever's already there. On an existing product, also inventories the whole suite's docs (not just its own four), hands that to `brief` for a lay-of-the-land pass, then to default `help` mode for concrete backfill moves.
- **[`brief`](../brief/SKILL.md)**: Interactively interrogate whoever already has the product idea, one question at a time (or in themed batches, the user's choice): what it is, who it's for, distinct user types and their core tasks, devices and context of use, competitive landscape, constraints. Writes `docs/PRODUCT_BRIEF.md`; pushes anything unresolved to `docs/UNKNOWNS.md`. On an existing product, drafts the brief from the codebase first and confirms it with the stakeholder rather than starting blank.

#### Discover
- **[`workshop`](../workshop/SKILL.md)**: Two modes for the same event, from opposite sides. `plan` (default): activity selection, written agenda, optional FigJam board and/or slide deck, before the workshop happens. `ingest`: convert photos of the physical workshop board that resulted (whiteboard, stickies, affinity map, risk matrix) into a PowerPoint deck, Word/Markdown doc, CSV, or a replicated FigJam board, after it happened.
- **[`competitors`](../competitors/SKILL.md)**: Two modes. `discover` (default): researches the web to surface candidate competitors and alternatives the stakeholder may not already know about, lets them pick which to profile, then captures each one's key features, core workflow, and UX patterns. `add`: appends one more competitor found later without re-running the full scan. Writes `docs/COMPETITIVE_ANALYSIS.md`; supersedes `brief`'s lightweight competitive-landscape question once it's run.
- **[`persona`](../persona/SKILL.md)**: Transform user research, interview notes, or domain briefs into rich persona cards, mental models, friction maps, and step-by-step "Day in the Life" walkthroughs.
- **[`interview`](../interview/SKILL.md)**: Phase-aware research kit (question bank, script, synthesis template) for discovery interviews early on or validation interviews against a working prototype.
- **[`journey`](../journey/SKILL.md)**: Four modes, one artifact (`docs/JOURNEY_MAP.md`). `map`: the current-state process as it actually runs today — actors, steps, handoffs — as a swimlane diagram. `blueprint`: the service-blueprint variant for a customer-facing process, alternative to `map` — Physical Evidence/Customer/Frontstage/Backstage/Support-Process layers as a time-ordered table, plus duration and cross-team handoff wait times. `pain-points`: scores each step or wait time's friction (severity × frequency) with root cause. `solutions`: explores fix directions per pain point and sets a measurable target. As-is, not proposed — distinct from `persona`'s day-in-the-life narrative and `map`'s `flow` mode (future-state).
- **[`metrics`](../metrics/SKILL.md)**: Defines OKRs against the right framework for the product's medium and adoption model — HEART (opt-in digital), CASTLE (mandatory-use digital/workplace, via NN/g), or SELECT (physical tools/services, this suite's own). Every Key Result tagged by category. Writes `docs/OKR.md`; pulls candidate Key Results from `journey`'s `solutions` mode when it's run.

#### Decide
- **[`map`](../map/SKILL.md)**: Five modes total (two more live in Design, see below). `objects`: interactive OOUX/ORCA modeling (Objects, Relationships, Calls-to-Action, Attributes), seeding `docs/OOUX_OBJECT_MAP.md` plus an entity-relationship diagram. `site`: plans the proposed route/workspace/component architecture as a diagram, before any of it is built. `flow`: turns a persona walkthrough or the `objects` model's CTAs into a Mermaid flowchart — user journeys and process flows, not site structure (that's `site`). Any mode can export its diagram to FigJam once the Figma MCP server is connected.

#### Design
- **[`scaffold`](../scaffold/SKILL.md)**: Scaffold a lightweight, zero-backend-dependency React 19 + TypeScript + Vite + Tailwind CSS prototype: a complete base scaffold, plus an optional site-type layer for prototypes that fit a recognizable archetype.
- **[`styleguide`](../styleguide/SKILL.md)**: Establish the two-layer token architecture (Layer 1 Raw Palette + Layer 2 Semantic auto-flipping CSS variables) and generate a spec-conformant `DESIGN.md`. Default mode uses a placeholder palette; forge mode casts a dedicated brand token preset for a new company or sub-brand from live CSS, brand guidelines, or verified hex matrices.
- **[`audit`](../audit/SKILL.md)**: Three modes: `craft` (scored critique: hierarchy, cognitive load, IA, consistency, responsive, delight, producing a task list before any fixing), `code` (coding standards: token adherence, structure/reuse, mechanical hygiene), `a11y` (deep WCAG 2.1/2.2 AA sweep, ranked pass/fail per success criterion). None of the modes fix anything.
- **[`refine`](../refine/SKILL.md)**: Fix and unify. Apply micro-interactions, responsive container grids, dark mode tuning, and refined visual craft. Checks for a recent `audit` `craft`-mode findings list first, and suggests running it if none exists.
- **[`storybook`](../storybook/SKILL.md)**: Organize UI into the 5 Atomic Design tiers (Foundations, Atoms, Molecules, Organisms, Widgets), build Storybook stories, and embed static Storybook inside the prototype's user menu.
- **[`map`](../map/SKILL.md)**'s remaining two modes: `document` regenerates the site diagram (interactive in-app Vis.js modal, Mermaid, SVG) from the real built app, and reconciles `docs/OOUX_OBJECT_MAP.md` if it's drifted. `audit` does that object-model reconciliation alone, without the diagram refresh — useful for a lighter check mid-build.

#### Deliver
- **[`package`](../package/SKILL.md)**: Two modes: `full` (unminified site + raw source + docs, a three-folder handoff zip for a developer to rebuild) or `lite` (minified `production/` folder only, bare essentials, just to run it).
- **[`showcase`](../showcase/SKILL.md)**: Build a shareable presentation from the prototype: a static PDF/PowerPoint deck or a reveal.js web deck, narrative sourced from `persona`'s scenes.
- **[`guide`](../guide/SKILL.md)**: Write end-user documentation, Getting Started plus a phase-by-phase walkthrough, as a Markdown doc with an optional PDF export.
- **[`requirements`](../requirements/SKILL.md)**: Read the built prototype (code, OOUX object map, persona walkthrough, ADRs) and write it up as Epics containing Features with user stories and acceptance criteria, as `docs/REQUIREMENTS.md`. Optionally publishes Epics/Features straight to Jira or Azure DevOps once an MCP server for one is connected.

#### Usable Anytime
- **[`decisions`](../decisions/SKILL.md)**: Capture a non-obvious UX or architecture decision, and the alternatives it rejected, as a short ADR in `docs/adr/`.
- **[`interrogate`](../interrogate/SKILL.md)**: Interrogate a design decision one question at a time until reaching shared understanding, then optionally hand off to `decisions`.
- **[`wiki`](../wiki/SKILL.md)**: Two modes. Default `compile` mode builds and maintains a small, interlinked, tool-agnostic markdown wiki, including a `constellation` graph view of how entities connect. `note` mode is the lowest-ceremony capture in the suite: a quick thought dropped into `docs/notes/my-notes/`, then immediately folded into the wiki. No formal ADR, no separate compile step to remember to run.
- **[`figma`](../figma/SKILL.md)**: Three modes: `capture` (button/right-click that sends a live screen into Figma as editable layers, no MCP needed), `import` (a Figma frame/selection into the codebase as convention-conformant code), `sync` (bidirectional token sync between `index.css`/`DESIGN.md` and a Figma library).

#### Meta
- **[`skill-manager`](../skill-manager/SKILL.md)**: Install, delete, disable, enable, list, and sync skills in the shared `~/.agents/skills` library, and show what any installed skill does. Manages the library itself, outside the design lifecycle.
