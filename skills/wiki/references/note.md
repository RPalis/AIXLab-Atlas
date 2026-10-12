# Mode: note

Lowest-ceremony capture. A thought worth keeping, but not worth formalizing.

**Not this mode:**
- A non-obvious decision with a rejected alternative: [`decisions`](../../decisions/SKILL.md).
- A question that needs real stakeholder input: `log-unknown` (`docs/UNKNOWNS.md`).
- Material from someone else (a file, a link): `compile` mode. It goes in `sources/`.

## Step 1: Write the entry

Append the thought verbatim to `docs/notes/my-notes/YYYY-MM-DD.md` under a timestamped bullet. Create the file if today has none. Create `my-notes/` if it is missing (see `setup`). No structure is required.

## Step 2: Fold it in now

Run `compile` mode's Steps 2 to 4 for this one entry. Treat the dated file as the source. Write the footer with `wiki-footer`. Skip `lint` and the graph. In a project with no `notes/wiki/` yet, create `index.md`, `log.md`, `sources.md`, `artifacts.md`, `decisions.md` and `topics/` from [`page-types.md`](page-types.md).

## Step 3: Notes written by hand

A person can edit files in `my-notes/` with no AI. Before any capture, run `wiki-status`. Ingest each `NEW` or `CHANGED` note the same way, and credit it as "added by hand".

## Step 4: Say what happened

Name the pages created or updated, in one bullet each.

**Completion criterion:** the note exists verbatim in `my-notes/`, has a current footer, and appears on at least one topic page or in a register.
