---
name: setup
description: Bootstrap a prototype repo's docs and layout (README.md, a project-level AGENTS.md that records which skill owns which doc, an empty docs/UNKNOWNS.md, and a docs/notes/ home for the wiki and anything else worth jotting down) before any code or design work starts. Runs first, ahead of scaffold. Works equally on a brand-new repo or an existing product: never overwrites a README or AGENTS.md that's already there, appends what's missing instead, and on an existing product points brief at reading the codebase rather than a cold interview. Use when starting a prototype project from nothing, or when an existing repo (new or already underway) is missing the doc scaffolding the rest of this suite expects.
disable-model-invocation: true
---

# Setup

The step before Discover starts. `scaffold` builds the actual application code; this skill only touches the repo's documentation shell (README, a project `AGENTS.md`, `docs/UNKNOWNS.md`, and `docs/notes/`) so every skill that runs after it has somewhere consistent to write.

## Step 1: Explore the current state

Before writing anything, check what's already here:
- Does `README.md` or `AGENTS.md`/`CLAUDE.md` already exist? If so, read it in full — it's existing, possibly hand-written content, not a draft to replace, so never overwrite it (see Step 3).
- Does `docs/` exist, and already contain any of this suite's living docs (`UNKNOWNS.md`, `PERSONA_WALKTHROUGH.md`, `OOUX_OBJECT_MAP.md`, `adr/`, `notes/`)? A repo mid-project needs gaps filled in, not a fresh layout imposed over it.
- Is there a `package.json` / `src/` already, with real application code (not just a scaffold stub)? If so, this is an **existing product**: `scaffold` already ran, or this suite is being layered onto something that predates it entirely. `setup` still runs to backfill missing docs, but say so rather than treat it as a brand-new project, and carry that into Step 4's hand-off.

## Step 2: Confirm scope with the user

Ask only what isn't already answerable from context:
- **Project name and one-line purpose**: what is this prototype for, in one sentence. If an existing README already states this, confirm it rather than asking cold.
- **Starting point**: a genuinely new idea, or an existing repo/codebase this suite is being layered onto (already answered by Step 1 if a real `src/` turned up).

Don't ask about anything covered in later lifecycle steps. Project name/purpose is all `setup` needs; screens, personas, and tokens come later from the skills that own them.

## Step 3: Write the doc shell

Four things, nothing else. For each: **if it already exists, append what's missing rather than overwriting anything.** A repo `setup` is layered onto may already have a README with real content, or an AGENTS.md from a different tool — that content stays; this skill only fills gaps.

**`README.md`**: if missing, create it with project name, the one-paragraph purpose from Step 2, and a `## Status` line stating this is an early-stage prototype (or, on an existing product, whatever status is actually true). Leave placeholder headings for sections later skills will fill in (install/run instructions once `scaffold` exists, a feature overview once screens exist) rather than inventing content now. If a README already exists, leave its content untouched; only append a `## Status` line if one isn't already present in some form.

**`AGENTS.md`** (project-level, distinct from this suite's own `AGENTS.md`): a short doc for any agent working in *this* prototype repo, recording which doc is owned by which skill so nothing downstream duplicates or conflicts. If missing, create it with the block below. If it already exists (this suite's own, or a different tool's), append this block under its own `## UX Atlas` heading instead of replacing the file, so nothing already written there is lost:

```markdown
# AGENTS.md

This prototype is built with UX Atlas. Doc ownership:
- `docs/UNKNOWNS.md` — appended to by any skill; cleared as questions resolve
- `docs/PRODUCT_BRIEF.md` — owned by `brief`
- `docs/PERSONA_WALKTHROUGH.md` — owned by `persona`
- `docs/OOUX_OBJECT_MAP.md` — owned by `map`'s `objects` mode
- `DESIGN.md` — owned by `styleguide`, regenerated from `index.css`, never hand-edited out of sync
- `docs/adr/` — owned by `decisions`
- `docs/USER_GUIDE.md` — owned by `guide`
- `docs/REQUIREMENTS.md` — owned by `requirements`
- `docs/notes/` — general notes home, safe to open directly in Obsidian or any other markdown editor; use it for **all** project notes. `docs/notes/my-notes/` inside it is the raw capture zone (fed by `wiki`'s `note` mode quick captures, or typed by hand); `docs/notes/wiki/` next to it is owned by `wiki`'s default `compile` mode, which compiles `my-notes/` plus any other document dropped into `docs/` (specs, client feedback, research) into an interlinked knowledge base

## Working Agreements

- **Capture decisions as they happen.** A non-obvious call made while working in this repo doesn't wait for someone to ask "why did we do it this way?" later: write it up with `decisions` if it's a real tradeoff with a rejected alternative, or with `wiki`'s `note` mode if it's smaller than that but still worth keeping.
- **Don't let a thought evaporate at the end of a session.** Anything worth remembering that doesn't have an obvious home yet, an idea, a risk, an observation, goes through `wiki`'s `note` mode immediately. It lands in `docs/notes/my-notes/` and folds into `docs/notes/wiki/` on its own; nothing needs a separate pass to not get lost.
- **Use `docs/notes/` for all project notes.** Meeting notes, scratch thoughts, research, anything a teammate, PM, client, or user hands over, belongs under `docs/notes/` (or elsewhere in `docs/` if it's a standalone document someone else maintains) rather than scattered across the repo or left outside version control entirely. `wiki` picks up anything placed there.
- **Defer to `docs/UNKNOWNS.md` instead of guessing.** If a decision genuinely needs input this session doesn't have, log it there rather than inventing a plausible-sounding answer (see the suite's own AGENTS.md §2.6).
- **Suggest next steps at natural checkpoints.** After finishing a skill's work, or whenever a session looks like it's wrapping up, briefly state what `help` would recommend next, don't wait to be asked "what now?"
```

**`docs/UNKNOWNS.md`**: if missing, create it empty with just a one-line header (`# Unknowns`). This is the one doc safe to pre-create with no content: an append-only running list from day one, not authored output any one skill produces. If it already exists, leave it alone entirely.

**`docs/notes/`**: if missing, create the folder with a single `docs/notes/README.md` explaining what it's for, so it's never an unexplained empty folder:

```markdown
# Notes

This is the project's general notes home. **Use it for all project notes**: meeting notes, scratch thoughts, research, anything a teammate, PM, client, or user hands over that doesn't belong in a specific doc above. Open this folder directly in Obsidian or any other markdown editor to work outside the IDE; nothing here depends on a specific tool.

- `my-notes/` — raw, unprocessed capture: quick thoughts from `wiki`'s `note` mode, or anything typed here by hand. Drop things here freely; nothing needs to be tidy on the way in.
- `wiki/` — this suite's compiled knowledge wiki (owned by the `wiki` skill): browse `wiki/index.md` once it exists. It compiles `my-notes/`, but also reads and cross-references any other document dropped anywhere in `docs/` (a spec, a client brief, user research) that this suite didn't produce itself, so those don't need to live in this folder specifically to get picked up.
```

Only the `docs/notes/` folder and this one README get pre-created. Don't pre-create `my-notes/` or `wiki/` themselves; they stay absent until `wiki` (either mode) actually has something to put there.

Do **not** pre-create `PERSONA_WALKTHROUGH.md`, `OOUX_OBJECT_MAP.md`, `DESIGN.md`, `docs/adr/`, `docs/REQUIREMENTS.md`, `docs/notes/my-notes/`, or `docs/notes/wiki/`. Those belong to `persona`, `map`'s `objects` mode, `styleguide`, `decisions`, `requirements`, and `wiki` (both modes) respectively — a hollow stub sitting there before that work happens is dead weight, not scaffolding. This skill sets the table; it doesn't serve the meal.

## Step 4: Hand off

Point at [`brief`](../brief/SKILL.md) next, almost always: it captures the stakeholder's own product vision (who it's for, core tasks, devices, competitors) before any of Discover's user-research skills run, and most of what `interview`, `workshop`, and `persona` need starts there. Skip straight to one of those instead only if that groundwork is already documented elsewhere and the user says so.

**If Step 1 found an existing product** (real `src/` and application code, not just a scaffold stub), say so explicitly when handing off, and tell `brief` to run its reconnaissance pass first: read the current codebase and draft the brief from what the product already does, then confirm the gaps with the stakeholder, rather than starting from a blank interview. `brief` supports this directly (its own Step 0.5).

**Completion criterion:** `README.md` and the project `AGENTS.md` exist (pre-existing content preserved, only gaps filled) and reflect what was actually confirmed in Step 2 (not invented detail), `docs/UNKNOWNS.md` exists, `docs/notes/README.md` exists, and no doc owned by another skill was pre-stubbed.
