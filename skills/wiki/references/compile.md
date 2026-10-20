# Mode: compile (default)

## Contents
- [Step 0: Find what is unprocessed](#step-0-find-what-is-unprocessed)
- [Step 1: Bring the source in](#step-1-bring-the-source-in)
- [Step 2: Read it and plan the changes](#step-2-read-it-and-plan-the-changes)
- [Step 3: File it](#step-3-file-it)
- [Step 4: Close the run](#step-4-close-the-run)
- [Background runs](#background-runs)

Goal: every source and every hand-written file reaches the wiki once, with a trail back to it. Run for one named source (a link or a file), or sweep everything unprocessed.

## Step 0: Find what is unprocessed

Run [`wiki-status`](../../../tools/wiki-status/wiki-status.sh). Read its lines:

| Line | Meaning | Action |
|---|---|---|
| `UNREGISTERED <path>` | A file in `sources/` has no `sources.md` row | Ingest it |
| `LOOSE <path>` | A file in the docs root that no skill owns | Propose a move into the right `sources/` subfolder. Wait for a yes (interactive) or log it for review (background). Move with `git mv` so history stays. |
| `NEW` / `CHANGED <path>` | A `my-notes/` or `artifacts/` file with no footer, or edited after it | Ingest it, then write the footer |
| `NOREADME <dir>` | A folder under `sources/`, `artifacts/` or `notes/` has no README | Add one from the folder-readmes templates. Safe in a background run. |
| `DRAFTS <n>` | Pages waiting for review | Mention them in the close-out. Do not promote them yourself. |

If the user named one source, skip the sweep and go to Step 1 with that source.

**Completion criterion:** you have a list of sources to process, or you have said that nothing is pending.

## Step 1: Bring the source in

- **A file the user dropped in the docs root or named by path:** treat it as `LOOSE`. Propose the destination (`sources/client/`, `sources/teams/<team>/` or `sources/research/`) and move it. It is immutable from this point.
- **A link:** fetch the page and save a snapshot in `sources/links/<slug>.md` (format in [`page-types.md`](page-types.md#link-snapshots)). If the page needs a login (Figma, Confluence, Google Docs, Notion), the fetch fails or returns a sign-in page. Do not guess its content. Ask the user to paste the text or drop an export into `sources/`. In a background run, log a tier 3 unknown and skip it.
- **A `my-notes/` or `artifacts/` file:** it stays where it is. It is not a source. It is still ingested.

Assign the next ID in `sources.md` (`S-nnn`) or `artifacts.md` (`A-nnn`). Add the row. Fill Origin, Date, Path and a one-line "Told us". Leave Publish as `no` for a source.

## Step 2: Read it and plan the changes

Read the source in full. Find:
- Which existing topic pages it touches. Check `index.md` first so you reuse names.
- Whether it introduces a new durable topic. A new topic is a gate: say so, and give the name you propose. Do not make a page for something said once.
- Any claim that conflicts with an existing page.
- Any term that is new or used differently. A term goes to `GLOSSARY.md` through `interrogate`'s rule, not into a wiki page.
- Any decision that has no ADR. Propose `decisions`. Do not write the ADR here.

**Interactive:** show a short summary. List the takeaways, the topic pages you will touch or create, and the conflicts. Wait for a yes. A batch of several files gets one confirmation for the whole batch.

## Step 3: File it

1. Update every touched topic page. Add facts with their ID: `(S-004)`. A `my-notes/` file has no ID: cite it by a dated link and keep the speaker ("client said X", "we agreed Y"). A statement a client made in a meeting is still a note, not a source, so label it as reported speech. For an external document, summarize and cite it. Do not copy its content in.
2. Flag each conflict inline: `> ⚠️ Conflicts with [Other](other.md), needs resolution`.
3. Create new topic pages from the template in [`page-types.md`](page-types.md#topic-pages).
4. Update `sources.md` ("Used in" column), `artifacts.md` ("Cites" column), `decisions.md` and `index.md`.
5. For a `my-notes/` or `artifacts/` file, write the footer: `wiki-footer <file> "<Topic>|<relative path>" ...` (one pair for each page that took something from the file).

**Completion criterion:** every fact from the source sits on a page that cites its ID, and the source row's "Used in" lists those pages.

## Step 4: Close the run

- Append one `ingest` line to `log.md` ([format](page-types.md#logmd)).
- Run `wiki-status` again. Report what is left.
- Tell the user, in bullets: pages created or changed, conflicts flagged, drafts waiting, links that need a pasted copy.
- Log a milestone only for something big (the first ingest, a client brief landing): [`log-milestone`](../../../tools/log-milestone/log-milestone.sh).

## Background runs

No human is present, so do not pause. Apply suite `AGENTS.md` §9:

| Situation | Do |
|---|---|
| A clear fact for an existing page | File it |
| A new durable topic | Create it with `status: draft`. List it under `### Needs review` in the `log.md` line. |
| Two sources disagree and the answer matters | Flag inline. Add `log-unknown --skill wiki --tier 3 --blocking "<the conflict>"`. Continue with other sources. |
| A login-gated link | Log a tier 3 unknown. Skip it. |
| A `LOOSE` file | Do not move it. List it under `### Needs review`. |
| A source whose meaning is unclear | Register it. Write no topic changes. List it under `### Needs review`. |

Never edit a person's text, even to fix an error. Add a flagged note on the topic page instead.
