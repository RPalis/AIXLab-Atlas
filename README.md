# UX Atlas

**[Design Process](#the-design-process-discover-decide-design-deliver) · [Getting Started](#getting-started) · [Skills Catalog](#skills-catalog) · [Installation & Team Setup](#installation-team-setup) · [Philosophy & Core Principles](#philosophy-core-principles)**

A comprehensive, end-to-end suite of specialized AI Agent Skills for UX designers, product designers, and design engineers building high-fidelity interactive prototypes, from discovery through delivery.

This library is fully self-contained: every skill works standalone from this folder alone, with no dependency on any other installed skill. Clone or copy this repo, run `install.sh`, and the whole lifecycle is available.

---

## The Design Process: Discover → Decide → Design → Deliver

This is the actual framework: four phases, each with a recommended path through and branches for different situations. Most work travels through all four in order; some skills are usable at any point along the way (see **Usable Anytime** below) rather than belonging to one phase.

Several skills below are **multi-mode**: one skill covering several related-but-distinct jobs (`audit`, `figma`, `map`, `interview`, `package`). Say which mode you want, or the skill asks.

Not sure what to run next? **[`help`](skills/help/SKILL.md)** reads the actual state of the current repo and tells you the next 1-3 moves.

### Before Discover
Nothing exists yet.

0. **[`setup`](skills/setup/SKILL.md)** creates the repo's doc shell (`README.md`, a project `AGENTS.md`, empty `docs/UNKNOWNS.md`, `docs/notes/` for the wiki and anything else worth jotting down) before any research, design, or code starts. Also works layered onto an existing product: it appends to whatever's already there instead of overwriting it.
1. **[`brief`](skills/brief/SKILL.md)** interrogates whoever already has the idea (product, audience, user types, core tasks, devices, competitors, constraints) and writes `docs/PRODUCT_BRIEF.md`, the domain brief `persona` later expects as input. On an existing product it drafts from the codebase first and confirms the gaps, rather than starting from a blank interview.

### Discover
Understand the users and the problem before proposing anything.

1. **Kicking off with a team or stakeholders?** Start with **[`workshop`](skills/workshop/SKILL.md)**'s `plan` mode. It plans a working session (activities, timing, agenda) rather than assuming everyone already agrees on the problem.
2. **Coming out of a physical workshop with photos of the board?** **[`workshop`](skills/workshop/SKILL.md)**'s `ingest` mode turns whiteboard/sticky-note photos into a deck, doc, CSV, or a replicated FigJam board.
3. **Need real user input**, either because it's early and nothing's documented yet, or because a working prototype needs validation? **[`interview`](skills/interview/SKILL.md)** builds the question bank and script, phase-aware so it knows which kind of questions to ask.
4. From what's learned, **[`persona`](skills/persona/SKILL.md)** formalizes who the users are and what a real day looks like for them, the `docs/PERSONA_WALKTHROUGH.md` that most other skills in this suite read from.

→ Once there's a real sense of who the users are and what they need, move to **Decide**.

### Decide
Frame the problem, scope the objects, make the calls that are expensive to reverse later.

1. **[`map`](skills/map/SKILL.md)**'s **`objects`** mode walks through OOUX/ORCA interactively (Objects, Relationships, Calls-to-Action, Attributes), seeding `docs/OOUX_OBJECT_MAP.md` plus an entity-relationship diagram before any code exists.
2. **[`map`](skills/map/SKILL.md)**'s **`site`** mode plans the proposed route/workspace/component architecture as a diagram, before any of it is built.
3. **[`map`](skills/map/SKILL.md)**'s **`flow`** mode sketches a persona journey or branching workflow, sourcing from a persona walkthrough or the `objects` model's CTAs.
4. **Hit a genuinely hard call along the way**, a tradeoff, a rejected-alternative decision, something worth interrogating rather than guessing at? **[`interrogate`](skills/interrogate/SKILL.md)** interrogates it one question at a time, then optionally hands off to **[`decisions`](skills/decisions/SKILL.md)** to write it up as a permanent ADR. `decisions` also works standalone for a decision made outside an interrogation session.

→ With scope and object model settled, move to **Design**.

### Design
Build the actual prototype.

1. **[`scaffold`](skills/scaffold/SKILL.md)** scaffolds the base React/Vite/Tailwind prototype, then optionally layers on a site-type module (`dashboard`, `chatbot`, `marketing-site`, `crm-app`) if the prototype fits one.
2. **[`styleguide`](skills/styleguide/SKILL.md)** establishes the two-layer token architecture and a spec-conformant `DESIGN.md`. **Casting a new brand?** Its forge mode does that from live CSS, a brand guide, or verified hex values.
3. Build out the screens, then **loop between two skills**: **[`audit`](skills/audit/SKILL.md)**'s `craft` mode finds problems (a scored critique, output as a task list) and **[`refine`](skills/refine/SKILL.md)** fixes and unifies them. Run the loop again until the score holds.
4. Document the system as it solidifies: **[`storybook`](skills/storybook/SKILL.md)** for component docs, **[`map`](skills/map/SKILL.md)**'s `document` mode to regenerate the site diagram (interactive, Mermaid, SVG) from the real built app and reconcile the object model if it's drifted (its `audit` mode does the reconciliation alone, without the diagram refresh), **[`wiki`](skills/wiki/SKILL.md)** for anything else worth remembering that doesn't have a dedicated doc.
5. **[`audit`](skills/audit/SKILL.md)**'s `a11y` mode runs the deep WCAG AA sweep once the UI has stabilized enough that findings won't immediately go stale.
6. **Pulling from or pushing to Figma along the way?** See **Usable Anytime** below.

→ Once the prototype holds up under `audit`'s `craft` and `a11y` modes, move to **Deliver**.

### Deliver
Ship it, validate it, hand it off.

1. **[`audit`](skills/audit/SKILL.md)**'s `code` mode audits coding standards (token adherence, structure/reuse, mechanical hygiene) before anything goes out the door.
2. **[`package`](skills/package/SKILL.md)** builds the static handoff bundle.
3. **Need to present this to stakeholders?** **[`showcase`](skills/showcase/SKILL.md)** builds a PDF/PowerPoint or reveal.js deck, narrative sourced from `persona`. **Need end-user documentation?** **[`guide`](skills/guide/SKILL.md)** writes it, diagrams via `map`'s `flow` mode. **Need it written up as a backlog?** **[`requirements`](skills/requirements/SKILL.md)** turns the built prototype into Epics and Features, optionally pushed straight to Jira or Azure DevOps.
4. **Validating with real users?** Loop back to **[`interview`](skills/interview/SKILL.md)** in validation mode. It reads `docs/UNKNOWNS.md` for what's still an open question and builds the next round's guide around it.

### Usable Anytime
Not gated to one phase. Reach for these whenever the situation calls for them, from any point in Discover through Deliver.

- **[`help`](skills/help/SKILL.md)**: the situational advisor version of this whole section: reads the repo, tells you what's next.
- **[`decisions`](skills/decisions/SKILL.md)** / **[`interrogate`](skills/interrogate/SKILL.md)**: capturing and interrogating decisions, wherever in the process one comes up.
- **[`wiki`](skills/wiki/SKILL.md)**: two modes. `note` mode is a quick, low-ceremony capture for a thought worth keeping, mid-task, dropped into `docs/notes/my-notes/` and folded straight in. Default `compile` mode compiles scattered notes into an interlinked wiki as the project accumulates them, including any spec, transcript, or research doc a teammate, PM, client, or user drops directly into `docs/`.
- **[`figma`](skills/figma/SKILL.md)**: moving work to and from Figma, whenever it's part of the workflow: `capture` (a screen to Figma as layers), `import` (a Figma frame in as code), or `sync` (a full token-system sync).
- **[`docs/UNKNOWNS.md`](AGENTS.md)**: the running list every skill defers to instead of guessing (see AGENTS.md §2.6), not a skill itself, but the thread that ties Discover through Deliver together.

> **Use `docs/notes/` for all project notes.** `setup` creates it as this project's general notes home, safe to open directly in Obsidian or any other markdown editor. Drop meeting notes, scratch thoughts, and anything a teammate, PM, client, or user hands you there (`docs/notes/my-notes/` for raw capture); `wiki` compiles what's worth keeping, and can also cross-reference standalone documents placed elsewhere in `docs/`.

### Managing the suite itself

One skill sits outside Discover→Decide→Design→Deliver entirely: it manages the skill library, not a prototype.

- **[`skill-manager`](skills/skill-manager/SKILL.md)**: install, delete, disable, enable, list, and sync skills in the shared library at `~/.agents/skills` (symlinked into Claude Code and Gemini CLI), and show what any installed skill does.

---

## Getting Started

Clone the repo and run the installer:

```bash
git clone https://github.com/kiersky-coforge/ux-atlas.git
cd ux-atlas
./install.sh
```

That opens an arrow-key picker — ↑/↓ to move, space to toggle a client, `a` to toggle all, Enter to confirm — which links every skill into the shared hub (`~/.agents/skills/`) and then wires up whichever clients you picked. Supported clients: Claude Code, Gemini CLI, Antigravity, OpenAI Codex CLI, GitHub Copilot CLI, Cursor, and Grok CLI. When it finishes, it'll offer to open this repo's `index.html` for the full walkthrough.

For scripting, skip the picker with flags:

```bash
./install.sh --all
```

See [Installation & Team Setup](#installation-team-setup) below for how the installer is structured and how to re-run it safely.

---

## Skills Catalog

Full reference: every skill, alphabetical-ish by phase for lookup rather than narrative order.

| Skill Name | Phase | Purpose | Trigger / Commands |
|---|---|---|---|
| [`router`](skills/router/SKILL.md) | **Router** | Master index & navigation guide across the entire design process | `/router`, "design skills", "prototype workflow" |
| [`help`](skills/help/SKILL.md) | **Router** | Reads the current repo's actual state and recommends the next 1-3 skills, with reasons | `/help`, "what should I do next", "which skill do I need" |
| [`setup`](skills/setup/SKILL.md) | **Before Discover** | Bootstrap a prototype repo's doc shell: README, project AGENTS.md, empty UNKNOWNS.md, docs/notes/. Works on an existing product too, appending rather than overwriting | `/setup`, "start a new prototype repo", "bootstrap this project", "add UX Atlas to this repo" |
| [`brief`](skills/brief/SKILL.md) | **Before Discover** | Interrogates the stakeholder for product, audience, user types, tasks, devices, competitors, constraints; writes `docs/PRODUCT_BRIEF.md`. On an existing product, drafts from the codebase first and confirms it instead | `/brief`, "product brief", "get this out of my head", "discovery interview", "brief for our existing app" |
| [`workshop`](skills/workshop/SKILL.md) | **Discover** | Two modes: default `plan` (design-thinking workshop: activities, agenda, optional FigJam board/deck) or `ingest` (convert workshop board photos into a deck, doc, CSV, or replicated FigJam board) | `/workshop`, `/workshop ingest`, "plan a workshop", "design thinking session", "digitize this whiteboard", "turn these sticky notes into a doc" |
| [`persona`](skills/persona/SKILL.md) | **Discover** | Formalize user archetypes, mental models, & "Day in the Life" walkthroughs | `/persona`, "persona doc", "day in the life" |
| [`interview`](skills/interview/SKILL.md) | **Discover / Deliver** | Phase-aware question bank + script + synthesis template for user research | `/interview`, "interview questions", "user research" |
| [`map`](skills/map/SKILL.md) | **Decide / Design** | Five modes: `objects` (interactive OOUX/ORCA modeling + entity-relationship diagram), `site` (proposed route/component architecture, before it's built), `flow` (persona journey/workflow as Mermaid), `audit` (reconcile the object model against built code), `document` (regenerate the site diagram from the real app, plus reconcile if needed). Any mode can export to FigJam via Figma MCP | `/map objects`, `/map site`, `/map flow`, `/map audit`, `/map document`, "ooux map", "feature concept", "sitemap", "architecture map", "flowchart this journey" |
| [`scaffold`](skills/scaffold/SKILL.md) | **Design** | Scaffold React 19 + Vite + Tailwind + Lucide prototype; base scaffold + optional site-type layer | `/scaffold`, "new prototype", "scaffold app" |
| [`styleguide`](skills/styleguide/SKILL.md) | **Design** | Generate 2-layer token architecture (Raw + Semantic) and a spec-conformant `DESIGN.md`; forge mode casts a new brand's palette & fonts into the suite's fixed semantic token roles | `/styleguide`, `/styleguide forge`, "design tokens", "style guide", "create DESIGN.md", "brand forge", "cast brand tokens" |
| [`audit`](skills/audit/SKILL.md) | **Design / Deliver** | Multi-mode: `craft` (scored UX critique as a task list), `code` (coding-standards audit), `a11y` (deep WCAG AA sweep) | `/audit craft`, `/audit code`, `/audit a11y`, "audit this prototype" |
| [`refine`](skills/refine/SKILL.md) | **Design** | Fix and unify: micro-interactions, responsive grids, dark mode, polish | `/refine`, "polish UI", "refine styling" |
| [`storybook`](skills/storybook/SKILL.md) | **Design** | 5-tier Atomic Storybook docs + embed live Storybook in prototype menu | `/storybook`, "setup storybook", "atomic docs" |
| [`package`](skills/package/SKILL.md) | **Deliver** | Two modes: `full` (site + source + docs handoff zip) or `lite` (minified `production/` folder only) | `/package full`, `/package lite`, "package prototype" |
| [`showcase`](skills/showcase/SKILL.md) | **Deliver** | Shareable presentation from a prototype: PDF/PowerPoint deck or reveal.js web deck | `/showcase`, "build a deck", "presentation for this prototype" |
| [`guide`](skills/guide/SKILL.md) | **Deliver** | End-user documentation: Getting Started + phase-by-phase walkthrough | `/guide`, "write a user guide", "end-user docs" |
| [`requirements`](skills/requirements/SKILL.md) | **Deliver** | Reads the built prototype into Epics & Features with user stories and acceptance criteria; optional Jira/ADO export via MCP | `/requirements`, "PRD", "epics and features", "turn this into a backlog" |
| [`decisions`](skills/decisions/SKILL.md) | **Anytime** | Lightweight ADRs capturing a decision and its rejected alternatives | `/decisions`, "ADR", "record this decision" |
| [`interrogate`](skills/interrogate/SKILL.md) | **Anytime** | Interrogate a design decision one question at a time; hands off to `decisions` | `/interrogate`, "grill this decision", "stress-test this design call" |
| [`wiki`](skills/wiki/SKILL.md) | **Anytime** | Two modes: default `compile` (compile `docs/notes/` and any other document dropped into `docs/` into a small, interlinked, tool-agnostic markdown wiki with a `constellation` graph view) or `note` (quick, low-ceremony capture into `docs/notes/my-notes/` that folds immediately into the wiki) | `/wiki`, `/wiki note`, "build a wiki", "compile these notes", "quick note", "jot this down", "don't let me forget" |
| [`figma`](skills/figma/SKILL.md) | **Anytime** | Multi-mode: `capture` (live screen → Figma layers), `import` (Figma frame → code), `sync` (bidirectional token sync with a Figma library) | `/figma capture`, `/figma import`, `/figma sync` |
| [`skill-manager`](skills/skill-manager/SKILL.md) | **Meta** | Install, delete, disable, enable, list, and sync skills in the shared `~/.agents/skills` library; show what any skill does | `/skill-manager install`, `/skill-manager list`, `/skill-manager details` |

---

## Installation & Team Setup

The picker in [Getting Started](#getting-started) above pre-checks whichever clients it finds already set up on your machine. Currently supported: **Claude Code** (`~/.claude/skills/`), **Gemini CLI** (`~/.gemini/skills/`), **Antigravity** (`~/.gemini/config/skills/`), **OpenAI Codex CLI** (`~/.codex/skills/`), **GitHub Copilot CLI** (`~/.copilot/skills/`), **Cursor** (`~/.cursor/skills/`), and **Grok CLI** (`~/.grok/skills/`). Each client is a symlink chained to the hub entry (`~/.agents/skills/`), not a separate direct link to this repo, matching how other skill packs on a shared machine are typically wired: one real copy, everything else pointing at it.

For scripting or CI, skip the picker with flags: `./install.sh --all`, `--none` (hub only), or any combination of `--claude`, `--gemini-cli`, `--antigravity`, `--codex`, `--copilot`, `--cursor`, `--grok`. Add `--open` or `--no-open` to control whether it launches `index.html` afterward without prompting.

Re-run `install.sh` any time, especially after a skill gets renamed in this repo. It tracks what it installed last time and removes stale entries (an old skill name's dangling symlink) from the hub and every client it manages, without touching anything else that happens to live in those shared directories.

Every skill name in this repo is checked against what actually already lives in a user's global skills folder before it's finalized, not just guessed at (e.g. this suite uses `package` rather than `handoff`, since a different, already-installed `handoff` skill turned up at install time; and `interrogate` rather than `grill`, since `grilling`/`grill-with-docs` are common generic skill names) so installing this suite won't silently overwrite unrelated skills already on your machine.

---

## Philosophy & Core Principles

1. **Prototypes Are Fast & High-Fidelity**: Use local in-memory/localStorage stores and deterministic seed data. Eliminate backend overhead so design iterations take minutes, not days.
2. **Two-Layer Design Token Discipline**: Layer 1 holds raw palette hex values; Layer 2 holds semantic tokens that auto-flip in dark/light mode. Component code never references raw hex codes.
3. **Atomic Component Hierarchy**: Group all UI primitives strictly into Foundations, Atoms, Molecules, Organisms, and Widgets.
4. **Self-Documenting Prototypes**: Every prototype embeds its own Storybook design system, UX architecture graph, and persona walkthrough directly in its "Prototype Tools" menu.
5. **Zero External Skill Dependencies**: Every skill in this suite is fully self-contained; no skill requires another skill outside this folder to be installed. Share this folder with anyone and the entire lifecycle works out of the box.
6. **Unknowns Before Invention**: A decision that genuinely needs real user input gets logged to `docs/UNKNOWNS.md` instead of guessed at, and resolved answers get promoted into whichever doc already owns that domain.

See [AGENTS.md](AGENTS.md) for the full authoring standard, naming rules, and how to refine or extend a skill.
