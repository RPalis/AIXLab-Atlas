# AIX Lab-Atlas

A fork of [UX Atlas](https://github.com/kiersky-coforge/ux-atlas), extended with skills from the AIX pilot.

**[Design Process](#the-design-process-discover-decide-design-deliver) · [Getting Started](#getting-started) · [Skills Catalog](#skills-catalog) · [Installation & Team Setup](#installation-team-setup) · [Philosophy & Core Principles](#philosophy-core-principles)**

A comprehensive, end-to-end suite of specialized AI Agent Skills for UX designers, product designers, and design engineers building high-fidelity interactive prototypes, from discovery through delivery.

**New here? Start with the [onboarding guides](ONBOARDING.md)**: a 2-page quick start, plus a click-by-click guide for Claude Code and one for Claude Design.

This library is fully self-contained: every skill works standalone from this folder alone, with no dependency on any other installed skill. Clone or copy this repo, run `install.sh`, and the whole lifecycle is available.

---

## The Design Process: Discover → Decide → Design → Deliver

This is the actual framework: four phases, each with a recommended path through and branches for different situations. Most work travels through all four in order; some skills are usable at any point along the way (see **Usable Anytime** below) rather than belonging to one phase.

Several skills below are **multi-mode**: one skill covering several related-but-distinct jobs (`audit`, `figma`, `map`, `interview`, `package`, `persona`, `journey`, `competitor-analysis`). Say which mode you want, or the skill asks.

Not sure what to run next? **[`help`](skills/help/SKILL.md)** reads the actual state of the current repo and tells you the next 1-3 moves. Want the whole roadmap instead? `help`'s `atlas` mode is the full browsable directory.

### Before Discover
Nothing exists yet.

0. **[`setup`](skills/setup/SKILL.md)** creates the repo's doc shell (`README.md`, a project `AGENTS.md`, empty `docs/UNKNOWNS.md`, `docs/notes/` for the wiki and anything else worth jotting down) before any research, design, or code starts. Also works layered onto an existing product: it appends to whatever's already there instead of overwriting it.
1. **[`brief`](skills/brief/SKILL.md)** interrogates whoever already has the idea (product, audience, user types, core tasks, devices, competitors, constraints) and writes `docs/PRODUCT_BRIEF.md`, the domain brief `persona` later expects as input. On an existing product it drafts from the codebase first and confirms the gaps, rather than starting from a blank interview.

### Discover
Understand the users and the problem before proposing anything.

1. **Kicking off with a team or stakeholders?** Start with **[`workshop`](skills/workshop/SKILL.md)**'s `plan` mode. It plans a working session (activities, timing, agenda) rather than assuming everyone already agrees on the problem. **Workshop isn't only an opener** — the same skill runs again mid-Discover once competitor analysis, interviews, personas or journey mapping already exist, to socialize findings and align a room before moving on. Run it wherever it's actually needed, not only here.
2. **Coming out of a physical workshop with photos of the board?** **[`workshop`](skills/workshop/SKILL.md)**'s `ingest` mode turns whiteboard/sticky-note photos into a deck, doc, CSV, or a replicated FigJam board.
3. **Who else is in this market?** **[`competitor-analysis`](skills/competitor-analysis/SKILL.md)**'s `discover` mode interrogates market, tool type, workflows, and differentiators, researches the web for candidates the stakeholder may not already know about, narrows to the 3-5 closest experiences, then profiles each in parallel — features, workflow, UX patterns, a real screenshot — into `docs/COMPETITIVE_ANALYSIS.md`. `add` appends one more competitor found later. `analyse` runs a deeper, evidence-rated pass organised by UX category, with a confidence tag on every claim and a ranked opportunity list — use it when the analysis needs to stand on its own as evidence, not just a landscape scan.
4. **Need real user input**, either because it's early and nothing's documented yet, or because a working prototype needs validation? **[`interview`](skills/interview/SKILL.md)** builds the question bank and script, phase-aware so it knows which kind of questions to ask.
5. **Interviews already run — what did they actually say?** **[`interview-analysis`](skills/interview-analysis/SKILL.md)** turns transcripts into evidence-backed themes: verbatim quotes tagged with interview number, a `WEAK SIGNAL` flag on anything under two supporting quotes, and six required outputs including a full evidence log. Gated: it won't write the report before you approve the plan.
6. From what's learned, **[`persona`](skills/persona/SKILL.md)**'s `card` mode formalizes who the users are — research-grounded profiles, 2-4 of them, with a relevance test on every field. `day` mode takes one existing card and writes its chronological "Day in the Life" walkthrough, `docs/PERSONA_WALKTHROUGH.md`, that most other skills in this suite read from. `day` always needs a `card` first; it never invents a persona from scratch.
7. **A real process is broken or slow, and it needs fixing** — or **you want the persona × scenario experience, emotions included, not a process audit?** **[`journey`](skills/journey/SKILL.md)** covers both jobs. `map` mode (swimlane) or `blueprint` mode (service-blueprint variant, for a customer-facing process where timing and cross-team handoffs matter) trace a *process* as it actually runs today, then `pain-points` scores friction by severity × frequency and `solutions` scopes fix directions with measurable targets. `experience` mode is the other job entirely: one *persona* through one *scenario* — actions, thoughts, emotions, pain points and opportunities per stage, an emotion curve, every claim cited or marked `ASSUMPTION`. Pick `experience` directly when the question is "what does this feel like for one user," not "how does this process run."
8. **Comparing against best-in-class, not just direct competitors?** **[`ux-benchmark`](skills/ux-benchmark/SKILL.md)** scores 3-5 products 1-5 against a fixed rubric — features, flows, IA, navigation, patterns — every score backed by evidence and a confidence rating. The scored cousin of `competitor-analysis`; also usable later, right before IA or wireframing, whenever a scorecard is more useful than a narrative.
9. **Turn the research into something buildable.** **[`problem-statement`](skills/problem-statement/SKILL.md)** transforms personas, journey maps and pain points into problem statements (no proposed solutions) and prioritised, traceable user stories. This is the last step of Discover — everything downstream reads its output, not raw research. **Different job from `requirements` in Deliver**: this works from research, before anything is built; `requirements` works from a *built* prototype, for tracker export. Use `problem-statement` to decide what to build; use `requirements` to hand off what was built.
10. **Define what success looks like.** **[`metrics`](skills/metrics/SKILL.md)** frames OKRs against the right model for the product (HEART, CASTLE, or SELECT), each Key Result tagged by category. Writes `docs/OKR.md`; pulls candidate Key Results from `journey`'s `solutions` mode when it's run.

→ Once there's a signed-off problem statement and a real sense of who the users are, move to **Decide**.

### Decide
Turn one problem into a direction, then scope the objects, before making the calls that are expensive to reverse later.

1. **One signed-off problem statement, many possible directions.** **[`brainstorming`](skills/brainstorming/SKILL.md)** runs a structured ideation pass: 15 ideas, 3 assumption-breakers, clustered into 3-4 named directions, each scored user value/effort/risk. Produces a shortlist for the team to pick from — never a single recommended winner. Do this before defining IA, building wireframes, or committing to a direction.
2. **Once a direction is picked**, structure the product's content and navigation. **[`information-architecture`](skills/information-architecture/SKILL.md)** organises pages, labels, navigation and search around the user's mental model, never the org chart — every page/label/path traces to a real input or is tagged `PROPOSED`, and the draft has to pass a feedback-loop check (depth, breadth, orphans, a simulated tree test) before it goes to human review.
3. **[`map`](skills/map/SKILL.md)**'s **`objects`** mode walks through OOUX/ORCA interactively (Objects, Relationships, Calls-to-Action, Attributes), seeding `docs/OOUX_OBJECT_MAP.md` plus an entity-relationship diagram before any code exists.
4. **[`map`](skills/map/SKILL.md)**'s **`site`** mode plans the proposed route/workspace/component architecture as a diagram, before any of it is built.
5. **Sequencing one specific task, screen by screen?** **[`map`](skills/map/SKILL.md)**'s **`flow`** mode designs a complete, evidence-grounded flow — entry points, every decision branch, error/empty states, recovery paths, exit points — structured so it translates directly into wireframes. Reads the IA's screen names rather than inventing new ones.
6. **Hit a genuinely hard call along the way**, a tradeoff, a rejected-alternative decision, something worth interrogating rather than guessing at? **[`interrogate`](skills/interrogate/SKILL.md)** interrogates it one question at a time, then optionally hands off to **[`decisions`](skills/decisions/SKILL.md)** to write it up as a permanent ADR. `decisions` also works standalone for a decision made outside an interrogation session.

→ With a direction, structure and object model settled, move to **Design**.

### Design
Build the actual prototype.

1. **[`prototype`](skills/prototype/SKILL.md)** scaffolds the base React/Vite/Tailwind prototype, then optionally layers on a site-type module (`dashboard`, `chatbot`, `marketing-site`, `crm-app`) if the prototype fits one. This one skill covers both a lo-fi structural pass and the hi-fi interactive build — there's no separate wireframe-only artifact in this suite; the prototype itself is the wireframe once screens exist, then it's refined toward hi-fi in place.
2. **[`styleguide`](skills/styleguide/SKILL.md)** establishes the two-layer token architecture and a spec-conformant `DESIGN.md`. **Casting a new brand?** Its forge mode does that from live CSS, a brand guide, or verified hex values.
3. Build out the screens, then **loop between two skills**: **[`audit`](skills/audit/SKILL.md)**'s `craft` mode finds problems (a fast, 5-dimension scored critique, output as a task list) and **[`refine`](skills/refine/SKILL.md)** fixes and unifies them. Run the loop again until the score holds. **Need a deeper, evidence-based pass** — a redesign case, prioritising a UX backlog, or accessibility remediation planning? **`audit`**'s `heuristic` mode runs a full Nielsen-heuristic evaluation, issue by issue, severity-rated 0-4. It is **not the same rubric as `craft`** and the two scores aren't comparable — `craft` is the lightweight in-progress check, `heuristic` is the one that stands on its own as evidence.
4. Document the system as it solidifies: **[`storybook`](skills/storybook/SKILL.md)** for component docs, **[`map`](skills/map/SKILL.md)**'s `document` mode to regenerate the site diagram (interactive, Mermaid, SVG) from the real built app and reconcile the object model if it's drifted (its `audit` mode does the reconciliation alone, without the diagram refresh), **[`wiki`](skills/wiki/SKILL.md)** for anything else worth remembering that doesn't have a dedicated doc.
5. **[`audit`](skills/audit/SKILL.md)**'s `a11y` mode runs the deep WCAG AA sweep once the UI has stabilized enough that findings won't immediately go stale. Some teams run this before usability testing (catch accessibility issues while they're cheap to fix); others run it after, once real user sessions have already surfaced the highest-impact problems. Both orders are valid — pick the one that fits how the team works, not a fixed rule.
6. **Pulling from or pushing to Figma along the way?** See **Usable Anytime** below.

→ Once the prototype holds up under `audit`'s `craft`, `heuristic`, and `a11y` modes, move to **Deliver**.

### Deliver
Ship it, validate it, hand it off.

1. **Ready for real users?** **[`usability-test-plan`](skills/usability-test-plan/SKILL.md)** turns a states-checked prototype into a timed test plan and moderator script — task scenarios (never instructions), a stated success criterion per task, a bias-review pass, and a metrics sheet. The researcher moderates; this skill never has an AI run sessions with real participants. (See the note in Design step 5 above about a11y-vs-testing order — either sequence is fine.)
2. **[`audit`](skills/audit/SKILL.md)**'s `code` mode audits coding standards (token adherence, structure/reuse, mechanical hygiene) before anything goes out the door.
3. **Before handoff or a release sign-off**, **`audit`**'s `spec` mode compares the built product against its approved design — the `map` `flow`-mode output, `prototype`'s output, and `styleguide`'s tokens/`DESIGN.md`, together — screen by screen, at every breakpoint, logging every drift as expected-vs-actual with severity and an owner. Checks design fidelity only; anything that's really a code bug routes to `code` mode or engineering, unscored.
4. **[`package`](skills/package/SKILL.md)** builds the static handoff bundle.
5. **Need to present this to stakeholders?** **[`showcase`](skills/showcase/SKILL.md)** builds a day-in-the-life PowerPoint deck (time-stamped scenes, real screenshots, generated from `deck.json`) or a reveal.js deck, narrative sourced from `persona`. **Need end-user documentation?** **[`guide`](skills/guide/SKILL.md)** writes it, diagrams via `map`'s `flow` mode. **Need it written up as a backlog?** **[`requirements`](skills/requirements/SKILL.md)** turns the *built* prototype into Epics and Features, optionally pushed straight to Jira or Azure DevOps — the post-build counterpart to Discover's `problem-statement`, not a replacement for it.
6. **Validating with real users?** Loop back to **[`interview`](skills/interview/SKILL.md)** in validation mode. It reads `docs/UNKNOWNS.md` for what's still an open question and builds the next round's guide around it.

### Usable Anytime
Not gated to one phase. Reach for these whenever the situation calls for them, from any point in Discover through Deliver.

- **[`help`](skills/help/SKILL.md)**: default mode is the situational advisor version of this whole section (reads the repo, tells you what's next); `atlas` mode is the full browsable directory.
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

Clone this fork and run the installer:

```bash
git clone https://github.com/RPalis/AIXLab-Atlas.git
cd AIXLab-Atlas
./install.sh
```

That opens an arrow-key picker — ↑/↓ to move, space to toggle a client, `a` to toggle all, Enter to confirm — which copies every skill into the shared hub (`~/.agents/skills/`) and wires up whichever clients you picked. Supported clients: Claude Code, Gemini CLI, Antigravity, OpenAI Codex CLI, GitHub Copilot CLI, Cursor, and Grok CLI. When it finishes, it'll offer to open this repo's `index.html` for the full walkthrough.

For scripting, skip the picker with flags:

```bash
./install.sh --all
```

See [Installation & Team Setup](#installation-team-setup) below for how the installer is structured and how to re-run it safely.

---

## Environments

Every skill declares what it needs in an `## Environment` section. Most research and thinking skills need only the conversation, so they work anywhere skills can be loaded. Skills that write project files need a file system, and skills that build or package a prototype need a shell and Node.js, which means Claude Code or another environment that has them. When something is missing, a skill says so and returns its output in the conversation instead of pretending it wrote a file.

Support for loading these skills in Claude Design is being verified and is not claimed here.

| Skill | File system | Shell / Node.js | MCP server | Web access |
|---|---|---|---|---|
| [`audit`](skills/audit/SKILL.md) | Optional | Optional | - | - |
| [`brainstorming`](skills/brainstorming/SKILL.md) | Optional | - | - | - |
| [`brief`](skills/brief/SKILL.md) | Yes | - | - | - |
| [`competitor-analysis`](skills/competitor-analysis/SKILL.md) | Optional | - | - | Yes |
| [`decisions`](skills/decisions/SKILL.md) | Optional | - | - | - |
| [`figma`](skills/figma/SKILL.md) | Yes | - | Yes | - |
| [`guide`](skills/guide/SKILL.md) | Yes | - | - | - |
| [`help`](skills/help/SKILL.md) | Optional | - | - | - |
| [`information-architecture`](skills/information-architecture/SKILL.md) | Optional | - | - | - |
| [`interrogate`](skills/interrogate/SKILL.md) | Optional | - | - | - |
| [`interview`](skills/interview/SKILL.md) | Optional | - | - | - |
| [`interview-analysis`](skills/interview-analysis/SKILL.md) | Optional | - | - | - |
| [`journey`](skills/journey/SKILL.md) | Optional | - | - | - |
| [`map`](skills/map/SKILL.md) | Optional | Optional | Optional | - |
| [`metrics`](skills/metrics/SKILL.md) | Optional | - | - | - |
| [`package`](skills/package/SKILL.md) | Yes | Yes | - | - |
| [`persona`](skills/persona/SKILL.md) | Optional | - | - | - |
| [`problem-statement`](skills/problem-statement/SKILL.md) | Optional | - | - | - |
| [`prototype`](skills/prototype/SKILL.md) | Yes | Yes | - | - |
| [`refine`](skills/refine/SKILL.md) | Yes | - | - | - |
| [`requirements`](skills/requirements/SKILL.md) | Yes | - | Optional | - |
| [`setup`](skills/setup/SKILL.md) | Yes | - | - | - |
| [`showcase`](skills/showcase/SKILL.md) | Yes | Yes | - | Optional |
| [`skill-manager`](skills/skill-manager/SKILL.md) | Yes | Yes | - | - |
| [`storybook`](skills/storybook/SKILL.md) | Yes | Yes | - | - |
| [`styleguide`](skills/styleguide/SKILL.md) | Yes | - | - | - |
| [`usability-test-plan`](skills/usability-test-plan/SKILL.md) | Optional | - | - | - |
| [`ux-benchmark`](skills/ux-benchmark/SKILL.md) | Optional | - | - | Yes |
| [`wiki`](skills/wiki/SKILL.md) | Yes | - | - | - |
| [`workshop`](skills/workshop/SKILL.md) | Optional | Optional | Optional | - |

"Optional" means the skill works without it and says what it skipped. Details are in each skill's `## Environment` section.

---

## Skills Catalog

Full reference: every skill, alphabetical-ish by phase for lookup rather than narrative order.

| Skill Name | Phase | Purpose | Trigger / Commands |
|---|---|---|---|
| [`help`](skills/help/SKILL.md) | **Router** | Two modes: default reads the current repo's actual state and recommends the next 1-3 skills, with reasons; `atlas` is the full browsable directory across the entire design process | `/help`, `/help atlas`, "what should I do next", "which skill do I need", "design skills", "prototype workflow" |
| [`setup`](skills/setup/SKILL.md) | **Before Discover** | Bootstrap a prototype repo's doc shell: README, project AGENTS.md, empty UNKNOWNS.md, docs/notes/. Works on an existing product too, appending rather than overwriting | `/setup`, "start a new prototype repo", "bootstrap this project", "add UX Atlas to this repo" |
| [`brief`](skills/brief/SKILL.md) | **Before Discover** | Interrogates the stakeholder for product, audience, user types, tasks, devices, competitors, constraints; writes `docs/PRODUCT_BRIEF.md`. On an existing product, drafts from the codebase first and confirms it instead | `/brief`, "product brief", "get this out of my head", "discovery interview", "brief for our existing app" |
| [`workshop`](skills/workshop/SKILL.md) | **Discover** | Two modes: default `plan` (design-thinking workshop: activities, agenda, optional FigJam board/deck) or `ingest` (convert workshop board photos into a deck, doc, CSV, or replicated FigJam board). Usable both as a Discover opener and mid-sequence to socialize findings | `/workshop`, `/workshop ingest`, "plan a workshop", "design thinking session", "digitize this whiteboard", "turn these sticky notes into a doc" |
| [`competitor-analysis`](skills/competitor-analysis/SKILL.md) | **Discover** | Three modes: `discover` (interrogate market/tool-type/workflows/differentiators, research the web for candidates, narrow to the 3-5 closest, profile each in parallel with a real screenshot), `add` (append one more competitor found later), `analyse` (a deeper, evidence-rated pass organised by UX category, confidence-tagged, with a ranked opportunity list). Writes `docs/COMPETITIVE_ANALYSIS.md`; supersedes `brief`'s competitive-landscape question | `/competitor-analysis discover`, `/competitor-analysis add`, `/competitor-analysis analyse`, "who are our competitors", "competitive analysis", "benchmark our product against", "find alternatives to our product" |
| [`interview`](skills/interview/SKILL.md) | **Discover / Deliver** | Phase-aware question bank + script + synthesis template for user research | `/interview`, "interview questions", "user research" |
| [`interview-analysis`](skills/interview-analysis/SKILL.md) | **Discover** | Turns interview transcripts into evidence-backed themes: verbatim quotes with interview numbers, weak-signal flags, a plan-first approval gate, and six required outputs. Delivers as `.md`, `.docx`, `.xlsx` or `.pptx` | `/interview-analysis`, "analyse these interviews", "synthesise this research", "affinity map from transcripts" |
| [`persona`](skills/persona/SKILL.md) | **Discover** | Two modes: `card` (research-grounded persona profiles, 2-4, with a relevance test) and `day` (one card's chronological "Day in the Life" walkthrough — always needs a card first) | `/persona card`, `/persona day`, "persona doc", "day in the life" |
| [`journey`](skills/journey/SKILL.md) | **Discover** | Five modes, two jobs: `map` (current-state swimlane) or `blueprint` (service-blueprint variant) as alternative process-mapping starting points, `pain-points` (severity × frequency scoring) and `solutions` (fix directions + measurable targets) building on either; `experience` (a different job — one persona through one scenario, emotions and evidence, every claim cited or `ASSUMPTION`) | `/journey map`, `/journey blueprint`, `/journey pain-points`, `/journey solutions`, `/journey experience`, "map this process", "service blueprint", "where are the pain points", "map the customer journey" |
| [`ux-benchmark`](skills/ux-benchmark/SKILL.md) | **Discover** | Scores 3-5 products 1-5 against a fixed 10-dimension rubric, every score evidenced and confidence-rated. The scored cousin of `competitor-analysis`; also usable later, before IA or wireframing | `/ux-benchmark`, "UX benchmark", "score these products", "build a UX scorecard", "benchmark our product against X" |
| [`problem-statement`](skills/problem-statement/SKILL.md) | **Discover** | Transforms personas, journey maps and pain points into problem statements (no proposed solutions) and prioritised, traceable user stories. The last step of Discover. Pre-build — see `requirements` for the built-prototype counterpart | `/problem-statement`, "write the problem statement", "create user stories", "prioritise the backlog from research" |
| [`metrics`](skills/metrics/SKILL.md) | **Discover** | OKRs framed against the right model for the product (HEART, CASTLE, or SELECT), each Key Result tagged by category. Writes `docs/OKR.md` | `/metrics`, "define OKRs", "what does success look like", "key results" |
| [`brainstorming`](skills/brainstorming/SKILL.md) | **Decide** | Turns one signed-off problem statement into 15 ideas, 3 assumption-breakers, clustered into 3-4 named directions scored user value/effort/risk. Produces a shortlist, never a single winner | `/brainstorming`, "run a brainstorm", "ideation session", "generate ideas for this problem" |
| [`information-architecture`](skills/information-architecture/SKILL.md) | **Decide** | Organises content, navigation and search around the user's mental model; every page/label/path traces to a real input or is tagged `PROPOSED`. Gated on a feedback-loop check (depth, breadth, orphans, a simulated tree test) before human review | `/information-architecture`, "build the sitemap", "organise the navigation", "IA for [product]" |
| [`map`](skills/map/SKILL.md) | **Decide / Design** | Five modes: `objects` (interactive OOUX/ORCA modeling + entity-relationship diagram), `site` (proposed route/component architecture, before it's built), `flow` (a complete, evidence-grounded end-to-end user flow for one goal — entry points, every decision branch, error/empty states, recovery paths, exit points, screen by screen), `audit` (reconcile the object model against built code), `document` (regenerate the site diagram from the real app, plus reconcile if needed). Any mode can export to FigJam via Figma MCP | `/map objects`, `/map site`, `/map flow`, `/map audit`, `/map document`, "ooux map", "feature concept", "sitemap", "architecture map", "design the user flow", "what screens do we need for X" |
| [`prototype`](skills/prototype/SKILL.md) | **Design** | React 19 + Vite + Tailwind + Lucide prototype; base scaffold + optional site-type layer. Covers both the structural (wireframe-equivalent) pass and the hi-fi interactive build as one continuous skill | `/prototype`, "new prototype", "scaffold app" |
| [`styleguide`](skills/styleguide/SKILL.md) | **Design** | Generate 2-layer token architecture (Raw + Semantic) and a spec-conformant `DESIGN.md`; forge mode casts a new brand's palette & fonts into the suite's fixed semantic token roles | `/styleguide`, `/styleguide forge`, "design tokens", "style guide", "create DESIGN.md", "brand forge", "cast brand tokens" |
| [`audit`](skills/audit/SKILL.md) | **Design / Deliver** | Five modes: `craft` (fast, 5-dimension scored UX critique), `heuristic` (deep, evidence-based Nielsen-heuristic pass, severity-rated 0-4 — not the same rubric as `craft`, not comparable to it), `code` (coding-standards audit), `spec` (compares the build against its approved design — `map` flow output + `prototype` output + `styleguide` tokens — screen by screen, at every breakpoint; design fidelity only, not code), `a11y` (deep WCAG AA sweep) | `/audit craft`, `/audit heuristic`, `/audit code`, `/audit spec`, `/audit a11y`, "audit this prototype", "does the build match the design" |
| [`refine`](skills/refine/SKILL.md) | **Design** | Fix and unify: micro-interactions, responsive grids, dark mode, polish | `/refine`, "polish UI", "refine styling" |
| [`storybook`](skills/storybook/SKILL.md) | **Design** | 5-tier Atomic Storybook docs + embed live Storybook in prototype menu | `/storybook`, "setup storybook", "atomic docs" |
| [`usability-test-plan`](skills/usability-test-plan/SKILL.md) | **Deliver** | Turns a states-checked prototype into a timed test plan + moderator script: task scenarios with success criteria, a bias-review pass, a metrics sheet. The researcher moderates — never an AI, by default | `/usability-test-plan`, "write a usability test plan", "build a moderator script", "test scenarios for this prototype" |
| [`package`](skills/package/SKILL.md) | **Deliver** | Two modes: `full` (site + source + docs handoff zip) or `lite` (minified `production/` folder that runs on any static host — backend embedded as a snapshot, edits persisted to localStorage) | `/package full`, `/package lite`, "package prototype" |
| [`showcase`](skills/showcase/SKILL.md) | **Deliver** | Shareable presentation from a prototype: a day-in-the-life PowerPoint deck built from `deck.json` + real screenshots (with an overflow check before it's written), or a reveal.js web deck | `/showcase`, "build a deck", "presentation for this prototype" |
| [`guide`](skills/guide/SKILL.md) | **Deliver** | End-user documentation: Getting Started + phase-by-phase walkthrough | `/guide`, "write a user guide", "end-user docs" |
| [`requirements`](skills/requirements/SKILL.md) | **Deliver** | Reads the *built* prototype into Epics & Features with user stories and acceptance criteria; optional Jira/ADO export via MCP. Post-build — see `problem-statement` for the pre-build counterpart | `/requirements`, "PRD", "epics and features", "turn this into a backlog" |
| [`decisions`](skills/decisions/SKILL.md) | **Anytime** | Lightweight ADRs capturing a decision and its rejected alternatives | `/decisions`, "ADR", "record this decision" |
| [`interrogate`](skills/interrogate/SKILL.md) | **Anytime** | Interrogate a design decision one question at a time; hands off to `decisions` | `/interrogate`, "grill this decision", "stress-test this design call" |
| [`wiki`](skills/wiki/SKILL.md) | **Anytime** | Two modes: default `compile` (compile `docs/notes/` and any other document dropped into `docs/` into a small, interlinked, tool-agnostic markdown wiki with a `constellation` graph view) or `note` (quick, low-ceremony capture into `docs/notes/my-notes/` that folds immediately into the wiki) | `/wiki`, `/wiki note`, "build a wiki", "compile these notes", "quick note", "jot this down", "don't let me forget" |
| [`figma`](skills/figma/SKILL.md) | **Anytime** | Multi-mode: `capture` (live screen → Figma layers), `import` (Figma frame → code), `sync` (bidirectional token sync with a Figma library) | `/figma capture`, `/figma import`, `/figma sync` |
| [`skill-manager`](skills/skill-manager/SKILL.md) | **Meta** | Install, delete, disable, enable, list, and sync skills in the shared `~/.agents/skills` library; show what any skill does | `/skill-manager install`, `/skill-manager list`, `/skill-manager details` |

---

## Installation & Team Setup

The picker in [Getting Started](#getting-started) above pre-checks whichever clients it finds already set up on your machine. Currently supported: **Claude Code** (`~/.claude/skills/`), **Gemini CLI** (no link needed, see below), **Antigravity** (`~/.gemini/config/skills/`), **OpenAI Codex CLI** (`~/.codex/skills/`), **GitHub Copilot CLI** (`~/.copilot/skills/`), **Cursor** (`~/.cursor/skills/`), and **Grok CLI** (`~/.grok/skills/`). Each client gets a single symlink to the hub copy (`~/.agents/skills/<name>`), the same layout other skill packs on a shared machine use: one real copy in `~/.agents/skills/`, client tools pointing at it. **Gemini CLI** is in the picker so it's not missing when you expect it, but selecting it links nothing: Gemini reads `~/.agents/skills/` directly and picks the skills up from the hub alone. A second link in `~/.gemini/skills/` only makes it warn about duplicates, so the installer also removes any it made in earlier versions. Re-run `./install.sh` after editing a skill; the hub is a copy, not a link back to this repo.

For scripting or CI, skip the picker with flags: `./install.sh --all`, `--none` (hub only), or any combination of `--claude`, `--gemini-cli` (accepted, links nothing), `--antigravity`, `--codex`, `--copilot`, `--cursor`, `--grok`. Add `--open` or `--no-open` to control whether it launches `index.html` afterward without prompting.

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
