---
name: help
description: Figure out which skill in this suite to use next, given the actual state of the current project, not a static list. Reads what docs already exist to place the project on Discover/Decide/Design/Deliver, then recommends the next 1-3 skills with a reason. Use when the user asks "what should I do next," "which skill do I need," or is otherwise unsure where they are in the process.
disable-model-invocation: true
---

# Help

[`router`](../router/SKILL.md) is the full directory, browsable any time. This skill is the "you are here" pin: it looks at what actually exists in the repo and gives the next 1-3 moves, instead of making you read the whole map.

## Step 1: Read the signals

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

## Step 2: Ask if the signals don't resolve it

If file signals are ambiguous, or the user's actual goal doesn't obviously match where the files say they are, ask one direct question: "what are you trying to get done right now?" Don't run the Step 1 table past the user as a report; it's your reasoning, not their answer.

## On-ramps: situations that skip the linear flow

Some starting points aren't "the project is at phase X"; they're a specific event that has its own answer regardless of overall project phase:

- **Nothing exists yet, not even an idea captured anywhere** → [`setup`](../setup/SKILL.md), always first.
- **Just came out of a physical workshop with photos of a board** → [`workshop`](../workshop/SKILL.md)'s `ingest` mode.
- **Something in the running prototype looks or feels wrong right now** → [`audit`](../audit/SKILL.md) (ask which mode, usually `craft`).
- **Stuck on a real tradeoff, can't decide between two directions** → [`interrogate`](../interrogate/SKILL.md).
- **Need to move something to/from Figma** → [`figma`](../figma/SKILL.md).
- **A decision was already made and needs to survive past this conversation** → [`decisions`](../decisions/SKILL.md).
- **A real process is broken or slow, and it needs mapping/fixing, not just a persona narrative** → [`journey`](../journey/SKILL.md).
- **Need to define what success looks like, or an existing goal has no real metric behind it** → [`metrics`](../metrics/SKILL.md).

Check on-ramps before falling back to the phase table. A mid-Design project that just got back from a stakeholder workshop still needs `workshop`'s `ingest` mode first, not whatever Design-phase skill the file signals suggest.

## Step 3: Recommend

Give 1-3 ranked skills, each with a one-line reason tied to what was actually found (a file that exists or doesn't, not a generic phase description). Point to `router` for the full picture if the user wants the whole path, not just the next step. Don't recommend a skill whose living doc already exists and looks current; that's re-doing finished work.

**Completion criterion:** every recommendation names the specific signal (a file, or the user's stated goal) that produced it. Never give a recommendation that's just "you're in Design phase, so try one of these" with no link back to actual project state.
