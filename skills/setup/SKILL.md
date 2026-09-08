---
name: setup
description: Bootstrap a brand-new prototype repo's docs and layout (README.md, a project-level AGENTS.md that records which skill owns which doc, and an empty docs/UNKNOWNS.md) before any code or design work starts. Runs first, ahead of scaffold. Use when starting a prototype project from nothing, or when an existing repo is missing the doc scaffolding the rest of this suite expects.
disable-model-invocation: true
---

# Setup

The step before Discover even starts. `scaffold` builds the actual application code; this skill only touches the repo's own documentation shell (README, a project `AGENTS.md`, and `docs/UNKNOWNS.md`) so every skill that runs after it has somewhere consistent to write.

## Step 1: Explore the current state

Before writing anything, check what's already here:
- Does `README.md` or `AGENTS.md`/`CLAUDE.md` already exist? If so, read it. Don't silently overwrite a doc someone already wrote.
- Does `docs/` exist, and does it already contain any of this suite's living docs (`UNKNOWNS.md`, `PERSONA_WALKTHROUGH.md`, `OOUX_OBJECT_MAP.md`, `adr/`)? A repo mid-project needs gaps filled in, not a fresh layout imposed over it.
- Is there a `package.json` / `src/` already? If so, `scaffold` already ran (or this isn't a from-scratch prototype). `setup` can still run to backfill missing docs, but say so rather than treating it as a brand-new project.

## Step 2: Confirm scope with the user

Ask only what isn't already answerable from context:
- **Project name and one-line purpose**: what is this prototype for, in one sentence.
- **Starting point**: a genuinely new idea, or an existing repo/codebase this suite is being layered onto.

Don't ask about the two things covered in later steps of the actual lifecycle. Project name/purpose is all `setup` needs; screens, personas, and tokens all come later from the skills that own them.

## Step 3: Write the doc shell

Only these three, nothing else, and never overwrite what already exists:

**`README.md`**: project name, the one-paragraph purpose from Step 2, and a `## Status` line stating this is an early-stage prototype. Leave placeholder headings for sections later skills will fill in (install/run instructions once `scaffold` exists, a feature overview once screens exist) rather than inventing their content now.

**`AGENTS.md`** (project-level, distinct from this suite's own `AGENTS.md`): a short doc for any agent working in *this* prototype repo, recording which doc is owned by which skill so nothing downstream duplicates or conflicts:

```markdown
# AGENTS.md

This prototype is built with UX Atlas. Doc ownership:
- `docs/UNKNOWNS.md` — appended to by any skill; cleared as questions resolve
- `docs/PRODUCT_BRIEF.md` — owned by `brief`
- `docs/PERSONA_WALKTHROUGH.md` — owned by `persona`
- `docs/OOUX_OBJECT_MAP.md` — owned by `concepting`
- `DESIGN.md` — owned by `tokens`, regenerated from `index.css`, never hand-edited out of sync
- `docs/adr/` — owned by `decisions`
- `docs/USER_GUIDE.md` — owned by `guide`
- `docs/REQUIREMENTS.md` — owned by `requirements`
- `docs/wiki/` — owned by `wiki`; fed continuously by `note`'s quick captures, and by anything typed directly into `docs/wiki/inbox/`

## Working Agreements

- **Capture decisions as they happen.** A non-obvious call made while working in this repo doesn't wait for someone to ask "why did we do it this way?" later: write it up with `decisions` if it's a real tradeoff with a rejected alternative, or with `note` if it's smaller than that but still worth keeping.
- **Don't let a thought evaporate at the end of a session.** Anything worth remembering that doesn't have an obvious home yet, an idea, a risk, an observation, goes through `note` immediately. It folds into `docs/wiki/` on its own; nothing needs a separate pass to not get lost.
- **Defer to `docs/UNKNOWNS.md` instead of guessing.** If a decision genuinely needs input this session doesn't have, log it there rather than inventing a plausible-sounding answer (see the suite's own AGENTS.md §2.6).
- **Suggest next steps at natural checkpoints.** After finishing a skill's work, or whenever a session looks like it's wrapping up, briefly state what `help` would recommend next, don't wait to be asked "what now?"
```

**`docs/UNKNOWNS.md`**: created empty with just a one-line header (`# Unknowns`). This is the one doc safe to pre-create with no content: it's an append-only running list from day one, not authored output any one skill produces.

Do **not** pre-create `PERSONA_WALKTHROUGH.md`, `OOUX_OBJECT_MAP.md`, `DESIGN.md`, `docs/adr/`, `docs/REQUIREMENTS.md`, or `docs/wiki/`. Those belong to `persona`, `concepting`, `tokens`, `decisions`, `requirements`, and `wiki`/`note` respectively, and a hollow stub sitting there before that work happens is dead weight, not scaffolding. This skill sets the table; it doesn't serve the meal.

## Step 4: Hand off

Point at [`brief`](../brief/SKILL.md) next, almost always: it gets the stakeholder's own product vision (who it's for, core tasks, devices, competitors) down before any of Discover's user-research skills run, and most of what `interview`, `workshop`, and `persona` need starts there. Skip straight to one of those instead only if that groundwork is already documented elsewhere and the user says so.

**Completion criterion:** `README.md` and the project `AGENTS.md` exist and match what was actually confirmed in Step 2 (not invented detail), `docs/UNKNOWNS.md` exists and is empty, and no doc owned by another skill was pre-stubbed.
