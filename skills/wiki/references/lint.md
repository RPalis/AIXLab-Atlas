# Mode: lint

## Contents
- [Checks](#checks)
- [Report](#report)
- [Graph view](#graph-view)

Goal: find what drifted. Report it. Fix only what needs no human call.

Run at natural checkpoints: after an `audit`, before a `package` handoff, or when `wiki-status` shows `LINT` above 14 days (or `never`).

## Checks

Start with `wiki-status`. Then check:

- **Contradictions.** Pages that disagree on the same fact.
- **Staleness.** A page that names a screen, feature or decision that changed. Compare with `OOUX_OBJECT_MAP.md`, `DESIGN.md` and `adr/`.
- **Orphans.** Topic pages that nothing links to and that are not in `index.md`.
- **Gaps.** A topic named on three or more pages that has no page of its own.
- **Unregistered or loose files.** The `UNREGISTERED` and `LOOSE` lines.
- **Register drift.** An ID cited on a page that is not in a register. A register row whose file is gone. An ADR with no `decisions.md` row (ignore `adr/README.md`).
- **Footer drift.** A `log.md` ingest line for a file whose footer is missing, or the reverse. This means something was edited outside the process.
- **Broken links and anchors.** Check every relative link and `#section` anchor in the wiki.
- **Promotion candidates.** A section longer than about one screen, or linked from three or more pages, that should become a topic page.
- **Folder READMEs.** A folder with no `README.md` (`NOREADME`). Add one from the templates. This needs no human call.
- **Drafts.** List each `status: draft` page with its age.
- **Publish risk.** A `Publish = yes` source whose file looks confidential (the user decides; flag it only).

## Report

Report findings in bullets, grouped by check. Do not fix a contradiction, a staleness or a publish risk. They need a human call. Fix without asking: an orphan (add it to `index.md`), a missing register backlink, a broken link caused by a rename. List the fixes you made.

Append `## [YYYY-MM-DD] lint, <counts>` to `log.md`.

## Graph view

Regenerate `constellation.html`: a standalone file with an inline Vis.js network. One node per **non-draft** topic page, one edge per link between them. Clicking a node shows the page summary. It uses the same library and pattern as [`map`](../../map/SKILL.md)'s `site` mode. Excluding drafts keeps unreviewed pages out of the published site, which copies this file.

**Completion criterion:** the report lists every check with a count (zero is a result), `log.md` has the lint line, and `constellation.html` matches the current non-draft pages.
