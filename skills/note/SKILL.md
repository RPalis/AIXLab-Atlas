---
name: note
description: Capture a quick, low-ceremony thought (an idea, a risk, an observation, a "don't let me forget this") without the formality of an ADR or a full wiki entity page, then immediately fold it into the wiki so nothing is lost to the end of a session. Use for a quick note, jotting something down mid-task, or capturing something worth remembering that doesn't rise to a decision or an open question.
disable-model-invocation: true
---

# Quick Notes

The lowest-ceremony capture point in this suite. A thought worth keeping but not worth stopping to formalize: [`decisions`](../decisions/SKILL.md) is for a real ADR (a rejected alternative, a permanent record); [`wiki`](../wiki/SKILL.md) is for the deeper compile-and-organize pass; `docs/UNKNOWNS.md` is for a question genuinely blocking on input this session doesn't have. `note` is for everything else worth not losing.

**Not this skill:**
- A non-obvious decision with a rejected alternative → [`decisions`](../decisions/SKILL.md).
- A question that needs real user/stakeholder input to resolve → `docs/UNKNOWNS.md` directly (see AGENTS.md §2.6).
- The periodic lint/contradiction-check/constellation-regen pass → [`wiki`](../wiki/SKILL.md)'s own Step 3 and Step 4, which `note` never runs.

## Step 1: Write the entry

If `docs/wiki/` doesn't exist yet, this is the first capture in the project: create the minimal structure `wiki` maintains (`index.md`, `log.md`, `entities/`, `inbox/`), each started empty.

Append the thought, verbatim, to today's inbox file: `docs/wiki/inbox/YYYY-MM-DD.md`, under a timestamped bullet. Create the file if today doesn't have one yet. No required structure beyond the timestamp; freeform is the point.

## Step 2: Fold it into the wiki immediately

Run [`wiki`](../wiki/SKILL.md)'s **Step 1 (Ingest a source)** right now, treating this entry as the source: identify which entity page(s) it touches or whether it's a new entity, update them, update `index.md`, and append the `log.md` line referencing the inbox file. Don't run wiki's Step 3 (periodic linting) or Step 4 (constellation regen) here; those stay wiki's own periodic job, not something every single note triggers.

## Step 3: Notes written by hand

A person can create or edit a file directly in `docs/wiki/inbox/` in a plain text editor, no AI involved at all. Before starting any new `note` capture, check `docs/wiki/inbox/` for files not yet referenced in `log.md` and ingest those too, the same way, crediting the source as "added by hand" rather than assuming it came through this skill. [`wiki`](../wiki/SKILL.md)'s own runs do this same inbox check.

## Step 4: Say what happened

Tell the user which entity page(s) got created or updated, so the capture visibly compounds into the wiki rather than disappearing into a file.

**Completion criterion:** the note exists verbatim in `docs/wiki/inbox/` (nothing lost even if the fold-in mis-files it) and is reflected in `docs/wiki/index.md` / the relevant entity page / `log.md`, not left sitting unprocessed in the inbox.
