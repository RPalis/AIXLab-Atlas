# Help: atlas mode

Part of the [`help`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Welcome to **UX Atlas**, a modular, end-to-end framework that supports the whole product design process: collecting information, organizing thoughts, exposing details, and generating ideas. A prototype is a major milestone, where the team checks that everything lines up, but the groundwork (collected information, architecture, workflow patterns) has to be right before prototyping starts. A quick start (the minimum information, then a prototype to test, then backfill) is supported for a project joined midway. The suite follows one process, **Discover → Decide → Design → Deliver**, with a handful of skills usable at any point rather than gated to one phase.

Several skills below are **multi-mode**: one skill, several named modes for related-but-distinct jobs (`audit`'s `craft`/`heuristic`/`code`/`spec`/`a11y`/`perf`, `figma`'s `capture`/`import`/`sync`, `map`'s `objects`/`ia`/`site`/`flow`/`audit`/`document`, `interview`'s `questions`/`analysis`/`usability`, `competitors`' `discover`/`add`/`analysis`/`benchmark`). Say which mode you want, or the skill will ask.

Not sure where to start, or which skill fits what you're doing right now? Default `help` mode reads the actual state of the current repo and tells you the next 1-3 moves, rather than making you read this whole map.

## Contents

  - Before Discover
  - Discover
  - Decide
  - Design
  - Deliver
  - Usable Anytime
  - Meta: Managing the Suite Itself
  - Complete Skill Directory

### Before Discover
Nothing exists yet, not even `README.md`.

0. [`setup`](../../setup/SKILL.md) creates the repo's doc shell — a docs folder named after the project (e.g. `pocket-atlas-docs/`, not a bare `docs/`), `README.md`, a project `AGENTS.md` recording that name, empty `UNKNOWNS.md`, `sources/` for what others hand over (immutable), `artifacts/` for what we make by hand, `notes/` for raw notes and the wiki — before any research, design, or code starts. Works on an existing product too, appending to whatever's already there instead of overwriting it, then hands off to `brief` for a lay-of-the-land pass (even mid-lifecycle) and default `help` mode for the full gap analysis of what to backfill.
1. [`brief`](../../brief/SKILL.md) interrogates whoever already has the idea in their head: what the product is, who it's for, the distinct user types, their core tasks, devices/context of use, competitive landscape, constraints. Writes `docs/PRODUCT_BRIEF.md`, the domain brief [`persona`](../../persona/SKILL.md) expects as input. On an existing product, it drafts from the codebase first and confirms the gaps instead of starting blank.

### Discover
Understand the users and the problem before proposing anything.

1. **Kicking off with a team or stakeholders?** → [`workshop`](../../workshop/SKILL.md)'s `plan` mode plans a working session: activities, timing, agenda.
2. **Coming out of a physical workshop with photos of the board?** → [`workshop`](../../workshop/SKILL.md)'s `ingest` mode turns whiteboard/sticky-note photos into a deck, doc, CSV, or a replicated FigJam board.
3. **Who else is in this market?** → [`competitors`](../../competitors/SKILL.md)'s `discover` mode: interrogates market/tool-type/workflows/differentiators, researches the web for candidates, narrows to the 3-5 closest, then profiles each in parallel with features, workflow, UX patterns, and a real screenshot. Producing `docs/COMPETITIVE_ANALYSIS.md`. Go deeper per UX category with `analysis`, or score yourself against best-in-class products from any industry with `benchmark`.
4. **Need real user input** (early, or validating a working prototype)? → [`interview`](../../interview/SKILL.md)'s `questions` mode, phase-aware, builds the question bank and script. **Interviews already run?** Its `analysis` mode turns the transcripts into evidence-backed themes.
5. **Formalize who the users are and their day-to-day** → [`persona`](../../persona/SKILL.md), producing `docs/PERSONA_WALKTHROUGH.md`.
6. **A real process is broken or slow, and it needs fixing, not just a persona narrative?** → [`journey`](../../journey/SKILL.md): maps the current-state process — a swimlane (`map`) or, for a customer-facing process where timing and cross-team handoffs matter, a full service blueprint (`blueprint`) — scores pain points by severity × frequency, and scopes fix directions with measurable targets. Producing `docs/JOURNEY_MAP.md`. Its `experience` mode is a different job: one persona through one scenario, emotions and evidence included.
7. **Turn the research into something buildable** → [`problems`](../../problems/SKILL.md): problem statements (no proposed solutions) and prioritised, traceable user stories, from personas, journeys, interview themes and pain points. Producing `docs/PROBLEM_STATEMENTS.md`.
8. **Define what success looks like** → [`metrics`](../../metrics/SKILL.md): OKRs framed against the right framework for the product's medium and adoption model (HEART, CASTLE, or SELECT), each Key Result tagged by category. Producing `docs/OKR.md`.

Once there's a real sense of the users and their needs, move to **Decide**.

### Decide
Frame the problem, scope the objects, make the calls that are expensive to reverse.

1. **One problem, many possible directions** → [`brainstorming`](../../brainstorming/SKILL.md): a structured ideation pass from one signed-off problem statement to a scored shortlist, never a single winner.
2. **Model the domain** → [`map`](../../map/SKILL.md)'s `objects` mode, an interactive ORCA walkthrough (Objects, Relationships, CTAs, Attributes) seeding `docs/OOUX_OBJECT_MAP.md` plus an entity-relationship diagram.
3. **Structure the content and navigation** → [`map`](../../map/SKILL.md)'s `ia` mode: pages, labels, navigation and search around the user's mental model, every node traced to an input or tagged `PROPOSED`.
4. **Plan the build architecture** → [`map`](../../map/SKILL.md)'s `site` mode: the proposed route/workspace/component structure as a diagram, before any of it is built.
5. **Sketch a journey or workflow** → [`map`](../../map/SKILL.md)'s `flow` mode, sourcing from a persona walkthrough or the `objects` model's CTAs.
6. **Hit a genuinely hard call?** → [`interrogate`](../../interrogate/SKILL.md) interrogates it one question at a time, then optionally hands off to [`decisions`](../../decisions/SKILL.md) for a permanent ADR.
7. **Collect visual references** → [`moodboard`](../../moodboard/SKILL.md): a library of style inspiration, synthesized into `VISUAL_LANGUAGE.md` for `restyle` to use later.

Once scope, IA, and the object model are settled, move to **Design**.

### Design
Build the actual prototype.

1. **Set up the prototype** → [`scaffold`](../../scaffold/SKILL.md): base React/Vite/Tailwind v4 scaffold, plus an optional site-type layer (`dashboard`, `chatbot`, `marketing-site`, `crm-app`, `mobile-app`).
2. **Tokens & brand** → [`styleguide`](../../styleguide/SKILL.md) for the two-layer architecture and `DESIGN.md`; its forge mode casts a new brand's real values in first.
3. **Build, then loop** → [`audit`](../../audit/SKILL.md)'s `craft` mode (find problems, scored, as a task list) ↔ [`refine`](../../refine/SKILL.md) (fix and unify). Repeat until the score holds. Need a deeper, evidence-based pass? `heuristic` mode runs 12 named usability heuristics, severity-rated.
4. **Document as it solidifies** → [`storybook`](../../storybook/SKILL.md) (components), [`map`](../../map/SKILL.md)'s `document` mode (regenerates the site diagram — interactive, Mermaid, SVG — from the real built app, and reconciles the object model if it's drifted; its `audit` mode does the reconciliation alone, without the diagram refresh), [`wiki`](../../wiki/SKILL.md) (anything else worth remembering).
5. **Accessibility and speed** → [`audit`](../../audit/SKILL.md)'s `a11y` mode (WCAG 2.2 AA, with a mobile and screen-reader step) and `perf` mode (measured load and interaction numbers), once the UI has stabilized enough that findings won't immediately go stale. Run `node tools/check-token-contrast/check-token-contrast.mjs src/index.css` first; it needs no agent.
6. **Moving to/from Figma?** → [`figma`](../../figma/SKILL.md): `capture` (screen → Figma layers), `import` (Figma frame → code), or `sync` (token system ↔ Figma library).
7. **Compare other looks on the real app** → [`restyle`](../../restyle/SKILL.md): a few full-token-set candidate directions from references or a `moodboard`, live-applied to the running prototype, then handed to `styleguide` `forge` to commit.

Once the prototype holds up under `audit`'s `craft` and `a11y` modes, move to **Deliver**.

### Deliver
Ship it, validate it, hand it off.

1. **Code standards** → [`audit`](../../audit/SKILL.md)'s `code` mode before anything ships; `spec` mode checks the build against its approved design, screen by screen.
2. **Package** → [`package`](../../package/SKILL.md) for the static handoff bundle (`full` or `lite`), or `figma` for a flat set of files to attach to Figma Make.
3. **Present to stakeholders** → [`showcase`](../../showcase/SKILL.md) (`story`: day-in-the-life PowerPoint deck, or `reveal`: reveal.js deck). **Share a research or analysis report** (a competitor analysis, benchmark, interview analysis, IA) → `showcase`'s `doc` mode for a Word document or `deck` mode for a condensed PowerPoint, from the report's Markdown file. **Document for end users** → [`guide`](../../guide/SKILL.md), diagrams via `map`'s `flow` mode. **Write it up as a backlog** → [`requirements`](../../requirements/SKILL.md): reads the built prototype into Epics & Features, optional Jira/ADO export.
4. **Validating with real users?** → [`interview`](../../interview/SKILL.md)'s `usability` mode for a task-based test plan and moderator script, or its `questions` mode in the Validation focus for a conversation about specific screens (reads `docs/UNKNOWNS.md` for what's still open).
5. **One specific change from a screenshot or a pointed-at element** → [`redline`](../../redline/SKILL.md): `markup` (a marked-up screenshot) or `pick` (a live element plus a note). No confirm step; review the diff.

### Usable Anytime
Not gated to one phase.

- [`decisions`](../../decisions/SKILL.md) / [`interrogate`](../../interrogate/SKILL.md): capturing and interrogating decisions, whenever one comes up.
- [`wiki`](../../wiki/SKILL.md)'s default `compile` mode: ingest a client file, another team's artifact or a link into the cited wiki, or sweep everything unprocessed. Also runs in the background as `wiki-agent`.
- [`wiki`](../../wiki/SKILL.md)'s `note` mode: a quick, low-ceremony capture that folds straight in.
- [`wiki`](../../wiki/SKILL.md)'s `lint` and `publish` modes: a health check, and a read-only static site for people without the repo.
- `docs/UNKNOWNS.md`: the running list every skill defers to instead of guessing (AGENTS.md §2.6), tying Discover through Deliver together.

### Meta: Managing the Suite Itself

One skill sits outside the lifecycle entirely — it manages the skill library, not a prototype:

- [`skill-manager`](../../skill-manager/SKILL.md): install, delete, disable, enable, list, and sync skills in the shared `~/.agents/skills` library (symlinked into Claude Code and Gemini CLI), and show what any installed skill does.

### Complete Skill Directory

#### Before Discover
- **[`setup`](../../setup/SKILL.md)**: Bootstrap a prototype repo's doc shell — a docs folder named after the project (`<project-slug>-docs/`, not a bare `docs/`, so it reads unambiguously in a third-party vault tool), `README.md`, a project `AGENTS.md` recording that name and doc ownership, empty `UNKNOWNS.md`, `notes/` — before anything else runs, on a brand-new repo or an existing product, appending rather than overwriting whatever's already there. On an existing product, also inventories the whole suite's docs (not just its own four), hands that to `brief` for a lay-of-the-land pass, then to default `help` mode for concrete backfill moves.
- **[`brief`](../../brief/SKILL.md)**: Interactively interrogate whoever already has the product idea, one question at a time (or in themed batches, the user's choice): what it is, who it's for, distinct user types and their core tasks, devices and context of use, competitive landscape, constraints. Writes `docs/PRODUCT_BRIEF.md`; pushes anything unresolved to `docs/UNKNOWNS.md`. On an existing product, drafts the brief from the codebase first and confirms it with the stakeholder rather than starting blank.

#### Discover
- **[`workshop`](../../workshop/SKILL.md)**: Two modes for the same event, from opposite sides. `plan` (default): activity selection, written agenda, optional FigJam board and/or slide deck, before the workshop happens. `ingest`: convert photos of the physical workshop board that resulted (whiteboard, stickies, affinity map, risk matrix) into a PowerPoint deck, Word/Markdown doc, CSV, or a replicated FigJam board, after it happened.
- **[`competitors`](../../competitors/SKILL.md)**: Four modes. `discover` (default): interrogates market, tool type, workflows, and differentiators one question at a time, researches the web to surface candidates the stakeholder may not already know about, narrows to the 3-5 closest experiences, then profiles each in parallel (one research agent per competitor where available) — key features, core workflow, UX patterns, and a real screenshot. `add`: appends one more competitor found later without re-running the full scan. `analysis`: a deeper, evidence-rated pass organised by UX category, confidence-tagged, with a ranked opportunity list. `benchmark`: scores 3-5 products (yours, competitors, best-in-class from any industry) 1-5 on one rubric with evidence, plus a flow teardown and an adopt/adapt/avoid pattern library. Writes `docs/COMPETITIVE_ANALYSIS.md` or `docs/UX_BENCHMARK.md`; supersedes `brief`'s lightweight competitive-landscape question once it's run.
- **[`persona`](../../persona/SKILL.md)**: Transform user research, interview notes, or domain briefs into rich persona cards, mental models, friction maps, and step-by-step "Day in the Life" walkthroughs.
- **[`interview`](../../interview/SKILL.md)**: Three modes. `questions` (default): phase-aware research kit (question bank, script, synthesis template) for discovery interviews early on or validation interviews against a working prototype. `analysis`: turns transcripts into evidence-backed themes, with verbatim quotes tagged by interview number, weak-signal flags, and a plan-first approval gate. `usability`: a bias-reviewed test plan and moderator script for a built prototype — task scenarios with success criteria, timed agenda, metrics sheet; the researcher moderates, never an AI.
- **[`journey`](../../journey/SKILL.md)**: Five modes, two jobs. Four on one artifact (`docs/JOURNEY_MAP.md`). `map`: the current-state process as it actually runs today — actors, steps, handoffs — as a swimlane diagram. `blueprint`: the service-blueprint variant for a customer-facing process, alternative to `map` — Physical Evidence/Customer/Frontstage/Backstage/Support-Process layers as a time-ordered table, plus duration and cross-team handoff wait times. `pain-points`: scores each step or wait time's friction (severity × frequency) with root cause. `solutions`: explores fix directions per pain point and sets a measurable target. The fifth, `experience`, is a different job: one persona through one scenario, emotions and evidence included, every claim cited or marked `ASSUMPTION`. The first four are as-is, not proposed — distinct from `persona`'s day-in-the-life narrative and `map`'s `flow` mode (future-state).
- **[`problems`](../../problems/SKILL.md)**: Turns personas, journey maps, interview themes and pain points into problem statements (never with a proposed solution) and prioritised, traceable user stories. Pre-build; the built-prototype counterpart is `requirements`. Writes `docs/PROBLEM_STATEMENTS.md`.
- **[`metrics`](../../metrics/SKILL.md)**: Defines OKRs against the right framework for the product's medium and adoption model — HEART (opt-in digital), CASTLE (mandatory-use digital/workplace, via NN/g), or SELECT (physical tools/services, this suite's own). Every Key Result tagged by category. Writes `docs/OKR.md`; pulls candidate Key Results from `journey`'s `solutions` mode when it's run.

#### Decide
- **[`brainstorming`](../../brainstorming/SKILL.md)**: Runs a structured ideation pass against one signed-off problem statement: 15 ideas, assumption-breakers, clustered into named directions, each scored for user value, effort and risk. Produces a shortlist, never a single winner.
- **[`map`](../../map/SKILL.md)**: Six modes total (two more live in Design, see below). `objects`: interactive OOUX/ORCA modeling (Objects, Relationships, Calls-to-Action, Attributes), seeding `docs/OOUX_OBJECT_MAP.md` plus an entity-relationship diagram. `ia`: structures content, navigation, labelling and search around the user's mental model as a gated, evidence-graded sitemap (every node traced to an input or tagged `PROPOSED`); content-first, run before `site`. `site`: plans the proposed route/workspace/component architecture as a diagram, before any of it is built. `flow`: a complete, evidence-grounded end-to-end user flow for one goal — entry points, every decision branch, error/empty states, recovery paths, exit points — not site structure (that's `site`). Any mode can export its diagram to FigJam once the Figma MCP server is connected.
- **[`moodboard`](../../moodboard/SKILL.md)**: Maintains `<docs>/inspiration/` — screenshots or URLs of styles the user likes, dropped in over time — and synthesizes them into a living `VISUAL_LANGUAGE.md`: recurring color, typography, spacing, shape, and elevation patterns plus descriptive adjectives, each citing which reference it came from.

#### Design
- **[`scaffold`](../../scaffold/SKILL.md)**: Scaffold a lightweight, zero-backend-dependency React 19 + TypeScript + Vite + Tailwind CSS v4 prototype: a complete base scaffold, plus an optional site-type layer for prototypes that fit a recognizable archetype.
- **[`styleguide`](../../styleguide/SKILL.md)**: Establish the two-layer token architecture (Layer 1 Raw Palette + Layer 2 Semantic auto-flipping CSS variables) and generate a spec-conformant `DESIGN.md`. Default mode uses a placeholder palette; forge mode casts a dedicated brand token preset for a new company or sub-brand from live CSS, brand guidelines, or verified hex matrices.
- **[`audit`](../../audit/SKILL.md)**: Six modes: `craft` (scored critique: hierarchy, cognitive load, IA, consistency, responsive, delight, producing a task list before any fixing), `heuristic` (a deep, evidence-based pass against 12 named usability heuristics, severity-rated 0-4; a different rubric from `craft`), `code` (coding standards: token adherence, structure/reuse, mechanical hygiene), `spec` (compares the build against its approved design, screen by screen at every breakpoint, logging each drift as expected-vs-actual with severity and an owner; fidelity only, not code), `a11y` (deep WCAG 2.2 AA sweep, ranked pass/fail per success criterion, with a mobile and screen-reader step), `perf` (measured load, interaction and layout-shift numbers against budgets, then the causes). None of the modes fix anything.
- **[`refine`](../../refine/SKILL.md)**: Fix and unify. Apply micro-interactions, responsive container grids, dark mode tuning, and refined visual craft. Checks for a recent `audit` `craft`-mode findings list first, and suggests running it if none exists.
- **[`storybook`](../../storybook/SKILL.md)**: Organize UI into the 5 Atomic Design tiers (Foundations, Atoms, Molecules, Organisms, Widgets), build Storybook stories, and embed static Storybook inside the prototype's user menu.
- **[`map`](../../map/SKILL.md)**'s remaining two modes: `document` regenerates the site diagram (interactive in-app Vis.js modal, Mermaid, SVG) from the real built app, and reconciles `docs/OOUX_OBJECT_MAP.md` if it's drifted. `audit` does that object-model reconciliation alone, without the diagram refresh — useful for a lighter check mid-build.
- **[`figma`](../../figma/SKILL.md)**: Three modes: `capture` (button/right-click that sends a live screen into Figma as editable layers, no MCP needed), `import` (a Figma frame/selection into the codebase as convention-conformant code), `sync` (bidirectional token sync between `index.css`/`DESIGN.md` and a Figma library).
- **[`restyle`](../../restyle/SKILL.md)**: Generates 2-3 candidate visual directions (full token set: color, type, spacing/radius, elevation) from references given directly or from `moodboard`'s synthesis, live-applies each to the running prototype via a temporary switcher so the choice is made against real screens, then hands the winner to `styleguide`'s `forge` mode to actually commit.

#### Deliver
- **[`package`](../../package/SKILL.md)**: Three modes: `full` (unminified site + raw source + docs, a three-folder handoff zip for a developer to rebuild), `lite` (minified `production/` folder only, bare essentials, just to run it), or `figma` (flat unminified files, each under 1MB, to attach to a Figma Make chat).
- **[`showcase`](../../showcase/SKILL.md)**: Four modes. `story`: a day-in-the-life PowerPoint deck from the prototype (time-stamped scene per slide beside a real screenshot, generated from `deck.json` with an overflow check first). `reveal`: a reveal.js web deck. `doc`: converts a Markdown report from any suite skill (e.g. `interview-analysis.md`) faithfully into a styled Word document. `deck`: condenses such a report into a PowerPoint, with the outline confirmed first and confidence tags, sources and the verification checklist kept.
- **[`guide`](../../guide/SKILL.md)**: Write end-user documentation, Getting Started plus a phase-by-phase walkthrough, as a Markdown doc with an optional PDF export.
- **[`requirements`](../../requirements/SKILL.md)**: Read the built prototype (code, OOUX object map, persona walkthrough, ADRs) and write it up as Epics containing Features with user stories and acceptance criteria, as `docs/REQUIREMENTS.md`. Optionally publishes Epics/Features straight to Jira or Azure DevOps once an MCP server for one is connected.
- **[`redline`](../../redline/SKILL.md)**: Two modes: `markup` (a marked-up screenshot — circles, arrows, strikethroughs, callouts — each annotation becomes one edit, matched to its real source file) or `pick` (point at a live element in the running prototype and describe the change). No confirm-before-edit step; the diff is the review.

#### Usable Anytime
- **[`decisions`](../../decisions/SKILL.md)**: Capture a non-obvious UX or architecture decision, and the alternatives it rejected, as a short ADR in `docs/adr/`.
- **[`interrogate`](../../interrogate/SKILL.md)**: Interrogate a design decision one question at a time until reaching shared understanding, then optionally hand off to `decisions`.
- **[`wiki`](../../wiki/SKILL.md)**: The project librarian, four modes. `compile` (default) turns client files, other teams' artifacts, links and your notes into an interlinked wiki where every claim cites a stable source ID. `note` is a quick capture. `lint` finds contradictions, gaps and drift. `publish` builds a read-only static site. Raw material lives in `sources/` (immutable) and hand-made work in `artifacts/`.

#### Meta
- **[`skill-manager`](../../skill-manager/SKILL.md)**: Install, delete, disable, enable, list, and sync skills in the shared `~/.agents/skills` library, and show what any installed skill does. Manages the library itself, outside the design lifecycle.
