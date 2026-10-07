---
name: help
description: >-
  Two modes. Default mode figures out which skill in this suite to use next, given the actual state of the current project, not a static list — reads what docs already exist to place the project on Discover/Decide/Design/Deliver, then recommends the next 1-3 skills with a reason. `atlas` mode is the full browsable directory of the suite: every skill, every phase, every mode, cross-linked. Use default mode when the user asks "what should I do next," "which skill do I need," or is otherwise unsure where they are in the process. Use `atlas` mode when they want to see the whole roadmap, browse what's available, or understand how the suite fits together.
argument-hint: "[blank: what's next | atlas: browse every skill]"
---

# Help

Say which mode you want, or this skill asks: **default** ("you are here" — reads the repo, gives the next move) or **`atlas`** (the full map — every skill, every phase, browsable any time).

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Walkthrough link

End every response, in either mode, with a one-line link to the suite's visual walkthrough (`index.html`) so the user can see the whole workflow without asking. Find it in this order, and use the first that exists:

1. `path=` in `~/.agents/skills/.ux-atlas.version` (written by `install.sh`) → `<path>/index.html`.
2. The current repo's own `index.html`, if this is the UX Atlas repo itself.

Render it as a clickable markdown link, e.g. `[UX Atlas walkthrough](file:///abs/path/to/index.html)`. If neither resolves (hub installed by hand, repo moved), skip the line silently rather than guessing a path. **Completion criterion:** the link points at a file that exists right now.

## Default mode

### Step 1: Read the signals

Run [`tools/detect-project-phase`](../../tools/detect-project-phase/detect-project-phase.sh) — it resolves the same signals below into a `PHASE=` value directly, so this table is the reference for what each phase means, not a manual walkthrough to repeat by hand. The table below writes `docs/...` as shorthand for whatever [`tools/find-docs-folder`](../../tools/find-docs-folder/find-docs-folder.sh) resolves. Its `design` phase collapses this table's last two rows (mid-build vs. nearing-done) — it can't see whether `audit` has run, since `audit` doesn't persist a doc; that distinction still needs a look at the actual state, same as ever:

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

Not a rigid state machine — a project can legitimately have `DESIGN.md` before `PERSONA_WALKTHROUGH.md` (started with a prototype, backfilling research). Use the signals to form a hypothesis, then confirm it in Step 2 rather than asserting it as fact.

**Check `docs/PRODUCT_BRIEF.md` independently of where the table otherwise places the project.** It's cheap to backfill (`brief`'s reconnaissance pass drafts it from whatever else already exists rather than a blank interview) and everything else reads better against a confirmed one, so a missing brief is always worth surfacing even on a project that's clearly well past Discover by every other signal — a real pattern when this suite gets layered onto a repo after work already started (`setup`'s existing-product hand-off routes through `brief` for exactly this reason, then here). Don't let a later-phase signal from the table above crowd it out of the recommendation.

### Step 2: Ask if the signals don't resolve it

If file signals are ambiguous, or the user's actual goal doesn't obviously match where the files say they are, ask one direct question: "what are you trying to get done right now?" Don't run the Step 1 table past the user as a report; it's your reasoning, not their answer.

**Autonomous mode** (suite `AGENTS.md` §2.9): with no one to ask, default to the earliest phase any ambiguous signal points at — under-assuming progress just recommends a backfill step that turns out to already be done (cheap to notice, cheap to skip), while over-assuming skips work that's actually still needed. Log the assumption and which signal was ambiguous.

### On-ramps: situations that skip the linear flow

Some starting points aren't "the project is at phase X"; they're a specific event that has its own answer regardless of overall project phase:

- **Nothing exists yet, not even an idea captured anywhere** → [`setup`](../setup/SKILL.md), always first.
- **Just came out of a physical workshop with photos of a board** → [`workshop`](../workshop/SKILL.md)'s `ingest` mode.
- **Something in the running prototype looks or feels wrong, broadly, and needs finding rather than a specific fix already in mind** → [`audit`](../audit/SKILL.md) (ask which mode, usually `craft`).
- **A specific, already-decided edit — a marked-up screenshot, or pointing at a live element and saying what to change** → [`redline`](../redline/SKILL.md), not `audit`/`refine` — the difference is whether the fix still needs finding (`audit`) or is already known and just needs doing (`redline`).
- **Screenshots or URLs of styles the user likes, wanting the app to look more like that** → [`restyle`](../restyle/SKILL.md) for options to choose from right now, or [`moodboard`](../moodboard/SKILL.md) first if references are still accumulating and nothing needs deciding yet.
- **Stuck on a real tradeoff, can't decide between two directions** → [`interrogate`](../interrogate/SKILL.md).
- **Need to move something to/from Figma** → [`figma`](../figma/SKILL.md).
- **A decision was already made and needs to survive past this conversation** → [`decisions`](../decisions/SKILL.md).
- **A real process is broken or slow, and it needs mapping/fixing, not just a persona narrative** → [`journey`](../journey/SKILL.md).
- **Need to define what success looks like, or an existing goal has no real metric behind it** → [`metrics`](../metrics/SKILL.md).
- **Don't know who else is out there, or need a real feature/workflow/UX comparison against competitors** → [`competitors`](../competitors/SKILL.md)'s `discover` mode.
- **Want to know how the best products anywhere solve a task, scored against a rubric** → [`competitors`](../competitors/SKILL.md)'s `benchmark` mode.
- **Interviews already happened and the transcripts are in hand** → [`interview`](../interview/SKILL.md)'s `analysis` mode.
- **Research is done and it needs to become a problem statement and a backlog** → [`problems`](../problems/SKILL.md).
- **A prototype exists and real users need to try it** → [`interview`](../interview/SKILL.md)'s `usability` mode.

Check on-ramps before falling back to the phase table. A mid-Design project that just got back from a stakeholder workshop still needs `workshop`'s `ingest` mode first, not whatever Design-phase skill the file signals suggest.

### Step 3: Recommend

Give 1-3 ranked skills, each with a one-line reason tied to what was actually found (a file that exists or doesn't, not a generic phase description). Point to `atlas` mode for the full picture if the user wants the whole path, not just the next step. Don't recommend a skill whose living doc already exists and looks current; that's re-doing finished work.

**Completion criterion:** every recommendation names the specific signal (a file, or the user's stated goal) that produced it. Never give a recommendation that's just "you're in Design phase, so try one of these" with no link back to actual project state.

## `atlas` mode

Welcome to **UX Atlas**, a modular, end-to-end framework for turning user insights and product concepts into high-craft, interactive, shareable prototypes. The suite follows one process, **Discover → Decide → Design → Deliver**, with a handful of skills usable at any point rather than gated to one phase.

Several skills below are **multi-mode**: one skill, several named modes for related-but-distinct jobs (`audit`'s `craft`/`heuristic`/`code`/`spec`/`a11y`, `figma`'s `capture`/`import`/`sync`, `map`'s `objects`/`ia`/`site`/`flow`/`audit`/`document`, `interview`'s `questions`/`analysis`/`usability`, `competitors`' `discover`/`add`/`analysis`/`benchmark`). Say which mode you want, or the skill will ask.

Not sure where to start, or which skill fits what you're doing right now? Default `help` mode reads the actual state of the current repo and tells you the next 1-3 moves, rather than making you read this whole map.

### Before Discover
Nothing exists yet, not even `README.md`.

0. [`setup`](../setup/SKILL.md) creates the repo's doc shell — a docs folder named after the project (e.g. `pocket-atlas-docs/`, not a bare `docs/`), `README.md`, a project `AGENTS.md` recording that name, empty `UNKNOWNS.md`, `notes/` for the wiki and anything else worth jotting down — before any research, design, or code starts. Works on an existing product too, appending to whatever's already there instead of overwriting it, then hands off to `brief` for a lay-of-the-land pass (even mid-lifecycle) and default `help` mode for the full gap analysis of what to backfill.
1. [`brief`](../brief/SKILL.md) interrogates whoever already has the idea in their head: what the product is, who it's for, the distinct user types, their core tasks, devices/context of use, competitive landscape, constraints. Writes `docs/PRODUCT_BRIEF.md`, the domain brief [`persona`](../persona/SKILL.md) expects as input. On an existing product, it drafts from the codebase first and confirms the gaps instead of starting blank.

### Discover
Understand the users and the problem before proposing anything.

1. **Kicking off with a team or stakeholders?** → [`workshop`](../workshop/SKILL.md)'s `plan` mode plans a working session: activities, timing, agenda.
2. **Coming out of a physical workshop with photos of the board?** → [`workshop`](../workshop/SKILL.md)'s `ingest` mode turns whiteboard/sticky-note photos into a deck, doc, CSV, or a replicated FigJam board.
3. **Who else is in this market?** → [`competitors`](../competitors/SKILL.md)'s `discover` mode: interrogates market/tool-type/workflows/differentiators, researches the web for candidates, narrows to the 3-5 closest, then profiles each in parallel with features, workflow, UX patterns, and a real screenshot. Producing `docs/COMPETITIVE_ANALYSIS.md`. Go deeper per UX category with `analysis`, or score yourself against best-in-class products from any industry with `benchmark`.
4. **Need real user input** (early, or validating a working prototype)? → [`interview`](../interview/SKILL.md)'s `questions` mode, phase-aware, builds the question bank and script. **Interviews already run?** Its `analysis` mode turns the transcripts into evidence-backed themes.
5. **Formalize who the users are and their day-to-day** → [`persona`](../persona/SKILL.md), producing `docs/PERSONA_WALKTHROUGH.md`.
6. **A real process is broken or slow, and it needs fixing, not just a persona narrative?** → [`journey`](../journey/SKILL.md): maps the current-state process — a swimlane (`map`) or, for a customer-facing process where timing and cross-team handoffs matter, a full service blueprint (`blueprint`) — scores pain points by severity × frequency, and scopes fix directions with measurable targets. Producing `docs/JOURNEY_MAP.md`. Its `experience` mode is a different job: one persona through one scenario, emotions and evidence included.
7. **Turn the research into something buildable** → [`problems`](../problems/SKILL.md): problem statements (no proposed solutions) and prioritised, traceable user stories, from personas, journeys, interview themes and pain points. Producing `docs/PROBLEM_STATEMENTS.md`.
8. **Define what success looks like** → [`metrics`](../metrics/SKILL.md): OKRs framed against the right framework for the product's medium and adoption model (HEART, CASTLE, or SELECT), each Key Result tagged by category. Producing `docs/OKR.md`.

Once there's a real sense of the users and their needs, move to **Decide**.

### Decide
Frame the problem, scope the objects, make the calls that are expensive to reverse.

1. **One problem, many possible directions** → [`brainstorming`](../brainstorming/SKILL.md): a structured ideation pass from one signed-off problem statement to a scored shortlist, never a single winner.
2. **Model the domain** → [`map`](../map/SKILL.md)'s `objects` mode, an interactive ORCA walkthrough (Objects, Relationships, CTAs, Attributes) seeding `docs/OOUX_OBJECT_MAP.md` plus an entity-relationship diagram.
3. **Structure the content and navigation** → [`map`](../map/SKILL.md)'s `ia` mode: pages, labels, navigation and search around the user's mental model, every node traced to an input or tagged `PROPOSED`.
4. **Plan the build architecture** → [`map`](../map/SKILL.md)'s `site` mode: the proposed route/workspace/component structure as a diagram, before any of it is built.
5. **Sketch a journey or workflow** → [`map`](../map/SKILL.md)'s `flow` mode, sourcing from a persona walkthrough or the `objects` model's CTAs.
6. **Hit a genuinely hard call?** → [`interrogate`](../interrogate/SKILL.md) interrogates it one question at a time, then optionally hands off to [`decisions`](../decisions/SKILL.md) for a permanent ADR.

Once scope, IA, and the object model are settled, move to **Design**.

### Design
Build the actual prototype.

1. **Set up the prototype** → [`scaffold`](../scaffold/SKILL.md): base React/Vite/Tailwind scaffold, plus an optional site-type layer (`dashboard`, `chatbot`, `marketing-site`, `crm-app`).
2. **Tokens & brand** → [`styleguide`](../styleguide/SKILL.md) for the two-layer architecture and `DESIGN.md`; its forge mode casts a new brand's real values in first.
3. **Build, then loop** → [`audit`](../audit/SKILL.md)'s `craft` mode (find problems, scored, as a task list) ↔ [`refine`](../refine/SKILL.md) (fix and unify). Repeat until the score holds. Need a deeper, evidence-based pass? `heuristic` mode runs 12 named usability heuristics, severity-rated.
4. **Document as it solidifies** → [`storybook`](../storybook/SKILL.md) (components), [`map`](../map/SKILL.md)'s `document` mode (regenerates the site diagram — interactive, Mermaid, SVG — from the real built app, and reconciles the object model if it's drifted; its `audit` mode does the reconciliation alone, without the diagram refresh), [`wiki`](../wiki/SKILL.md) (anything else worth remembering).
5. **Accessibility** → [`audit`](../audit/SKILL.md)'s `a11y` mode, once the UI has stabilized enough that findings won't immediately go stale.
6. **Moving to/from Figma?** → see Usable Anytime, below.

Once the prototype holds up under `audit`'s `craft` and `a11y` modes, move to **Deliver**.

### Deliver
Ship it, validate it, hand it off.

1. **Code standards** → [`audit`](../audit/SKILL.md)'s `code` mode before anything ships; `spec` mode checks the build against its approved design, screen by screen.
2. **Package** → [`package`](../package/SKILL.md) for the static handoff bundle (`full` or `lite`), or `figma` for a flat set of files to attach to Figma Make.
3. **Present to stakeholders** → [`showcase`](../showcase/SKILL.md) (day-in-the-life PowerPoint deck or reveal.js deck). **Document for end users** → [`guide`](../guide/SKILL.md), diagrams via `map`'s `flow` mode. **Write it up as a backlog** → [`requirements`](../requirements/SKILL.md): reads the built prototype into Epics & Features, optional Jira/ADO export.
4. **Validating with real users?** → [`interview`](../interview/SKILL.md)'s `usability` mode for a task-based test plan and moderator script, or its `questions` mode in the Validation focus for a conversation about specific screens (reads `docs/UNKNOWNS.md` for what's still open).

### Usable Anytime
Not gated to one phase.

- [`decisions`](../decisions/SKILL.md) / [`interrogate`](../interrogate/SKILL.md): capturing and interrogating decisions, whenever one comes up.
- [`wiki`](../wiki/SKILL.md)'s `note` mode: a quick, low-ceremony capture that folds straight in, no separate compile step needed.
- [`wiki`](../wiki/SKILL.md)'s default `compile` mode: compiling scattered notes as the project accumulates them.
- [`figma`](../figma/SKILL.md): moving work to and from Figma, whenever it's part of the workflow: `capture` (screen → Figma layers), `import` (Figma frame → code), or `sync` (token system ↔ Figma library).
- [`redline`](../redline/SKILL.md): one targeted UI edit from a marked-up screenshot (`markup` mode) or a live-picked element plus a plain instruction (`pick` mode) — no confirm step, review the diff.
- [`moodboard`](../moodboard/SKILL.md) / [`restyle`](../restyle/SKILL.md): an ongoing library of style inspiration synthesized into `VISUAL_LANGUAGE.md` (`moodboard`), and generating a few full-token-set candidate directions from it live-applied to the real app to choose from (`restyle`), handed to `styleguide` to commit.
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
- **[`competitors`](../competitors/SKILL.md)**: Four modes. `discover` (default): interrogates market, tool type, workflows, and differentiators one question at a time, researches the web to surface candidates the stakeholder may not already know about, narrows to the 3-5 closest experiences, then profiles each in parallel (one research agent per competitor where available) — key features, core workflow, UX patterns, and a real screenshot. `add`: appends one more competitor found later without re-running the full scan. `analysis`: a deeper, evidence-rated pass organised by UX category, confidence-tagged, with a ranked opportunity list. `benchmark`: scores 3-5 products (yours, competitors, best-in-class from any industry) 1-5 on one rubric with evidence, plus a flow teardown and an adopt/adapt/avoid pattern library. Writes `docs/COMPETITIVE_ANALYSIS.md` or `docs/UX_BENCHMARK.md`; supersedes `brief`'s lightweight competitive-landscape question once it's run.
- **[`persona`](../persona/SKILL.md)**: Transform user research, interview notes, or domain briefs into rich persona cards, mental models, friction maps, and step-by-step "Day in the Life" walkthroughs.
- **[`interview`](../interview/SKILL.md)**: Three modes. `questions` (default): phase-aware research kit (question bank, script, synthesis template) for discovery interviews early on or validation interviews against a working prototype. `analysis`: turns transcripts into evidence-backed themes, with verbatim quotes tagged by interview number, weak-signal flags, and a plan-first approval gate. `usability`: a bias-reviewed test plan and moderator script for a built prototype — task scenarios with success criteria, timed agenda, metrics sheet; the researcher moderates, never an AI.
- **[`journey`](../journey/SKILL.md)**: Five modes, two jobs. Four on one artifact (`docs/JOURNEY_MAP.md`). `map`: the current-state process as it actually runs today — actors, steps, handoffs — as a swimlane diagram. `blueprint`: the service-blueprint variant for a customer-facing process, alternative to `map` — Physical Evidence/Customer/Frontstage/Backstage/Support-Process layers as a time-ordered table, plus duration and cross-team handoff wait times. `pain-points`: scores each step or wait time's friction (severity × frequency) with root cause. `solutions`: explores fix directions per pain point and sets a measurable target. The fifth, `experience`, is a different job: one persona through one scenario, emotions and evidence included, every claim cited or marked `ASSUMPTION`. The first four are as-is, not proposed — distinct from `persona`'s day-in-the-life narrative and `map`'s `flow` mode (future-state).
- **[`problems`](../problems/SKILL.md)**: Turns personas, journey maps, interview themes and pain points into problem statements (never with a proposed solution) and prioritised, traceable user stories. Pre-build; the built-prototype counterpart is `requirements`. Writes `docs/PROBLEM_STATEMENTS.md`.
- **[`metrics`](../metrics/SKILL.md)**: Defines OKRs against the right framework for the product's medium and adoption model — HEART (opt-in digital), CASTLE (mandatory-use digital/workplace, via NN/g), or SELECT (physical tools/services, this suite's own). Every Key Result tagged by category. Writes `docs/OKR.md`; pulls candidate Key Results from `journey`'s `solutions` mode when it's run.

#### Decide
- **[`brainstorming`](../brainstorming/SKILL.md)**: Runs a structured ideation pass against one signed-off problem statement: 15 ideas, assumption-breakers, clustered into named directions, each scored for user value, effort and risk. Produces a shortlist, never a single winner.
- **[`map`](../map/SKILL.md)**: Six modes total (two more live in Design, see below). `objects`: interactive OOUX/ORCA modeling (Objects, Relationships, Calls-to-Action, Attributes), seeding `docs/OOUX_OBJECT_MAP.md` plus an entity-relationship diagram. `ia`: structures content, navigation, labelling and search around the user's mental model as a gated, evidence-graded sitemap (every node traced to an input or tagged `PROPOSED`); content-first, run before `site`. `site`: plans the proposed route/workspace/component architecture as a diagram, before any of it is built. `flow`: a complete, evidence-grounded end-to-end user flow for one goal — entry points, every decision branch, error/empty states, recovery paths, exit points — not site structure (that's `site`). Any mode can export its diagram to FigJam once the Figma MCP server is connected.

#### Design
- **[`scaffold`](../scaffold/SKILL.md)**: Scaffold a lightweight, zero-backend-dependency React 19 + TypeScript + Vite + Tailwind CSS prototype: a complete base scaffold, plus an optional site-type layer for prototypes that fit a recognizable archetype.
- **[`styleguide`](../styleguide/SKILL.md)**: Establish the two-layer token architecture (Layer 1 Raw Palette + Layer 2 Semantic auto-flipping CSS variables) and generate a spec-conformant `DESIGN.md`. Default mode uses a placeholder palette; forge mode casts a dedicated brand token preset for a new company or sub-brand from live CSS, brand guidelines, or verified hex matrices.
- **[`audit`](../audit/SKILL.md)**: Five modes: `craft` (scored critique: hierarchy, cognitive load, IA, consistency, responsive, delight, producing a task list before any fixing), `heuristic` (a deep, evidence-based pass against 12 named usability heuristics, severity-rated 0-4; a different rubric from `craft`), `code` (coding standards: token adherence, structure/reuse, mechanical hygiene), `spec` (compares the build against its approved design, screen by screen at every breakpoint, logging each drift as expected-vs-actual with severity and an owner; fidelity only, not code), `a11y` (deep WCAG 2.1/2.2 AA sweep, ranked pass/fail per success criterion). None of the modes fix anything.
- **[`refine`](../refine/SKILL.md)**: Fix and unify. Apply micro-interactions, responsive container grids, dark mode tuning, and refined visual craft. Checks for a recent `audit` `craft`-mode findings list first, and suggests running it if none exists.
- **[`storybook`](../storybook/SKILL.md)**: Organize UI into the 5 Atomic Design tiers (Foundations, Atoms, Molecules, Organisms, Widgets), build Storybook stories, and embed static Storybook inside the prototype's user menu.
- **[`map`](../map/SKILL.md)**'s remaining two modes: `document` regenerates the site diagram (interactive in-app Vis.js modal, Mermaid, SVG) from the real built app, and reconciles `docs/OOUX_OBJECT_MAP.md` if it's drifted. `audit` does that object-model reconciliation alone, without the diagram refresh — useful for a lighter check mid-build.

#### Deliver
- **[`package`](../package/SKILL.md)**: Three modes: `full` (unminified site + raw source + docs, a three-folder handoff zip for a developer to rebuild), `lite` (minified `production/` folder only, bare essentials, just to run it), or `figma` (flat unminified files, each under 1MB, to attach to a Figma Make chat).
- **[`showcase`](../showcase/SKILL.md)**: Build a shareable presentation from the prototype: a day-in-the-life PowerPoint deck (time-stamped scene per slide beside a real screenshot, generated from `deck.json` with an overflow check first) or a reveal.js web deck, narrative sourced from `persona`'s scenes.
- **[`guide`](../guide/SKILL.md)**: Write end-user documentation, Getting Started plus a phase-by-phase walkthrough, as a Markdown doc with an optional PDF export.
- **[`requirements`](../requirements/SKILL.md)**: Read the built prototype (code, OOUX object map, persona walkthrough, ADRs) and write it up as Epics containing Features with user stories and acceptance criteria, as `docs/REQUIREMENTS.md`. Optionally publishes Epics/Features straight to Jira or Azure DevOps once an MCP server for one is connected.

#### Usable Anytime
- **[`decisions`](../decisions/SKILL.md)**: Capture a non-obvious UX or architecture decision, and the alternatives it rejected, as a short ADR in `docs/adr/`.
- **[`interrogate`](../interrogate/SKILL.md)**: Interrogate a design decision one question at a time until reaching shared understanding, then optionally hand off to `decisions`.
- **[`wiki`](../wiki/SKILL.md)**: Two modes. Default `compile` mode builds and maintains a small, interlinked, tool-agnostic markdown wiki, including a `constellation` graph view of how entities connect. `note` mode is the lowest-ceremony capture in the suite: a quick thought dropped into `docs/notes/my-notes/`, then immediately folded into the wiki. No formal ADR, no separate compile step to remember to run.
- **[`figma`](../figma/SKILL.md)**: Three modes: `capture` (button/right-click that sends a live screen into Figma as editable layers, no MCP needed), `import` (a Figma frame/selection into the codebase as convention-conformant code), `sync` (bidirectional token sync between `index.css`/`DESIGN.md` and a Figma library).
- **[`redline`](../redline/SKILL.md)**: Two modes: `markup` (a marked-up screenshot — circles, arrows, strikethroughs, callouts — each annotation becomes one edit, matched to its real source file) or `pick` (point at a live element in the running prototype and describe the change). No confirm-before-edit step; the diff is the review.
- **[`moodboard`](../moodboard/SKILL.md)**: Maintains `<docs>/inspiration/` — screenshots or URLs of styles the user likes, dropped in over time — and synthesizes them into a living `VISUAL_LANGUAGE.md`: recurring color, typography, spacing, shape, and elevation patterns plus descriptive adjectives, each citing which reference it came from.
- **[`restyle`](../restyle/SKILL.md)**: Generates 2-3 candidate visual directions (full token set: color, type, spacing/radius, elevation) from references given directly or from `moodboard`'s synthesis, live-applies each to the running prototype via a temporary switcher so the choice is made against real screens, then hands the winner to `styleguide`'s `forge` mode to actually commit.

#### Meta
- **[`skill-manager`](../skill-manager/SKILL.md)**: Install, delete, disable, enable, list, and sync skills in the shared `~/.agents/skills` library, and show what any installed skill does. Manages the library itself, outside the design lifecycle.
