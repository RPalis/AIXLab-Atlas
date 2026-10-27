---
name: help
description: >-
  Three modes. Default mode works out which skill to use next from the actual state of the current project: it reads the docs, places the project on Discover/Decide/Design/Deliver and recommends the next 1-3 skills with a reason. The first time it runs in a project with no WORKFLOW.md, it first asks a few short questions (your role, where the project stands, this week's goal) and saves a guided workflow with plan, source, audit and approval steps built in. `start` mode redoes or updates that workflow. `atlas` mode is the browsable directory of every skill, phase and mode. Use when the user is new, unsure where to start, asks "what should I do next" or "which skill do I need", says they are a researcher, designer, writer or design-systems person starting out, or wants to see the whole roadmap.
---

# Help

Three modes. **default** ("you are here": reads the repo, gives the next move, and on the first run in a project asks a few questions to build a workflow). **`start`** (redo or update that workflow). **`atlas`** (the full map: every skill, every phase). Boundary: default mode recommends from the project's files; `start` asks the person and saves what it learned; neither runs the other skills for you.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Environment
- **Needs:** the conversation. It reads the project's docs folder when one exists.
- **If it isn't available:** No file system here: ask the user which docs exist, then recommend from that. Never claim to have read a file you could not open.
- **Parallel sub-agents:** use them only where available; otherwise do the same work one item at a time.

## Default mode

### Step 0: Check for a saved workflow

Find the docs folder (the project's `AGENTS.md` names it; otherwise `docs/`). Then:

- **`WORKFLOW.md` exists.** Read it (it is short). If its `Updated:` date is more than 14 days old, or the phase docs have clearly moved on since, offer a one-line refresh ("run `help start` to update it"). Otherwise recommend from its Sequence and phase, and skip the Step 1 table unless the user says something changed.
- **`WORKFLOW.md` is missing.** Run the first-run questions in [`references/start.md`](references/start.md) once, then continue with Step 1 using the answers. If the user declines or says skip, don't save anything and don't ask again in this session.
- **No file system.** Run the questions anyway, and return the workflow text with its path instead of writing it.

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

Not a rigid state machine — a project can legitimately have `DESIGN.md` before `PERSONA_WALKTHROUGH.md` (started with a prototype, backfilling research). Use the signals to form a hypothesis, then confirm it in Step 2 rather than asserting it as fact.

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
- **Don't know who else is out there, or need a real feature/workflow/UX comparison against competitors** → [`competitor-analysis`](../competitor-analysis/SKILL.md)'s `discover` mode.
- **Have interview transcripts and need insights out of them** → [`interview-analysis`](../interview-analysis/SKILL.md).
- **Have personas, journeys or pain points and need them turned into problem statements and user stories** → [`problem-statement`](../problem-statement/SKILL.md).
- **Want scored evidence of how competitors solve the same problem** → [`ux-benchmark`](../ux-benchmark/SKILL.md).
- **Have a prototype and are about to put it in front of users** → [`usability-test-plan`](../usability-test-plan/SKILL.md).

Check on-ramps before falling back to the phase table. A mid-Design project that just got back from a stakeholder workshop still needs `workshop`'s `ingest` mode first, not whatever Design-phase skill the file signals suggest.

### Step 3: Recommend

Give 1-3 ranked skills, each with a one-line reason tied to what was actually found (a file that exists or doesn't, not a generic phase description). When a `WORKFLOW.md` exists, take the first recommendation from its role's core skills and wrap it in the framework steps from [`references/workflow-card.md`](references/workflow-card.md): plan first, cite a source, audit, human decision. Point to `atlas` mode for the full picture if the user wants the whole path, not just the next step. Don't recommend a skill whose living doc already exists and looks current; that's re-doing finished work.

**Completion criterion:** every recommendation names the specific signal (a file, or the user's stated goal) that produced it. Never give a recommendation that's just "you're in Design phase, so try one of these" with no link back to actual project state.

## `start` mode

Redo or update the workflow. Follow [`references/start.md`](references/start.md). The role-to-skill mapping is in [`references/role-phase-map.md`](references/role-phase-map.md) and the saved format in [`references/workflow-card.md`](references/workflow-card.md). Load those files only now, not in default mode unless Step 0 sends you here.

## `atlas` mode

Read [`references/atlas.md`](references/atlas.md) and present it. It holds the whole directory: every skill, grouped by phase, with its modes. Don't load it for default or `start` mode.
