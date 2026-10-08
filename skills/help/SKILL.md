---
name: help
description: >-
  Front door for the UX Atlas suite. Reads the project state and recommends the next one to three
  skills, with the exact command to run. Modes: blank (what next), atlas (list every skill), doctor
  (check project health). Use when the user starts or continues UX, research, design or prototype
  work without naming a skill, asks what to do next, or asks what the suite can do.
argument-hint: "[blank: what's next | atlas: browse every skill | doctor: check project health]"
---

# Help

This is the front door to the suite. Most phase skills are user-invoked, so the agent cannot start them on its own, and a new user may not know they exist. This skill closes that gap: it reads the project, then tells the user which skill to run next and the exact command to type.

Modes: **default** ("you are here": reads the repo, gives the next move), **`atlas`** (the full map of every skill and phase), **`doctor`** (a health check of the project's docs, tokens and design rules). With no mode named, run default.

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

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
- **The product is a phone or tablet app** → [`scaffold`](../scaffold/SKILL.md) with its `mobile-app` type layer, then [`audit`](../audit/SKILL.md)'s `a11y` and `perf` modes against the mobile checklists.
- **Something is slow, janky, or heavy to load** → [`audit`](../audit/SKILL.md)'s `perf` mode, then [`refine`](../refine/SKILL.md).
- **The project feels out of sync (stale `DESIGN.md`, missing docs folder, token problems)** → `doctor` mode of this skill.

Check on-ramps before falling back to the phase table. A mid-Design project that just got back from a stakeholder workshop still needs `workshop`'s `ingest` mode first, not whatever Design-phase skill the file signals suggest.

### Step 3: Recommend

Give 1-3 ranked skills, each with a one-line reason tied to what was actually found (a file that exists or doesn't, not a generic phase description) and the exact command to run. Write the command as `/ux-atlas:<skill>` when the suite is installed as a plugin, and `/<skill>` when it is installed as plain skills. If unsure which, show `/<skill>` and mention the plugin prefix once. A model-invoked skill (`audit`, `refine`, `redline`, `styleguide`, `decisions`, `interrogate`, `wiki`) can be started for the user when they say yes. A user-invoked skill cannot, so hand over the command and wait. Point to `atlas` mode for the full picture if the user wants the whole path, not just the next step. Don't recommend a skill whose living doc already exists and looks current; that's re-doing finished work.

**Completion criterion:** every recommendation names the specific signal (a file, or the user's stated goal) that produced it. Never give a recommendation that's just "you're in Design phase, so try one of these" with no link back to actual project state.

## Modes

Open the reference file for the chosen mode and follow it. Load only that file. Cross-references between modes name the mode, so open that mode's file when one is named.

| Mode | What it does | File |
|---|---|---|
| `atlas` | browse every skill | [references/atlas.md](references/atlas.md) |
| `doctor` | check project health | [references/doctor.md](references/doctor.md) |
