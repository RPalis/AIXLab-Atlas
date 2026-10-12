# 0001: The wiki is a librarian over immutable sources and editable artifacts

Date: 2026-10-10. Settled in an `interrogate` session on making the notes system a project wiki.

## Decision
The `wiki` skill is the project's librarian and the only writer to `docs/notes/wiki/`. Raw material that others wrote goes in `docs/sources/` and is never edited. Material we make by hand goes in `docs/artifacts/`. The wiki registers both in `sources.md` and `artifacts.md`, cites them by stable ID (`S-004`, `A-001`), and keeps one page per topic only. A background `wiki-agent` can run beside other work. Every other skill reads the wiki first and cites IDs.

## Why
Karpathy's LLM-wiki pattern has three layers: immutable raw sources, a model-maintained wiki, and a schema. The old `wiki` had the second and part of the third. Client files and other teams' artifacts went "anywhere in `docs/`", so nothing marked them immutable, links were not handled, and a published wiki could not tell the client's words from our conclusions. One writer prevents contradictory edits. A stable ID keeps a citation valid when a file is renamed in the editor.

## Rejected alternatives
- **One page per source, term and decision.** Too many tiny files. Registers (one row each) keep provenance without the volume. Only topics get pages.
- **Move terms and decisions into the wiki.** It breaks `interrogate`, `decisions` and their files. The wiki links to `GLOSSARY.md` and `adr/` and does not copy them.
- **Keep dropping everything in `docs/`.** No immutability, no safe default for what to publish.
- **One `artifacts/` folder for inbound and outbound.** "Artifact" means both to other teams. Splitting by who wrote it (sources vs artifacts) keeps the immutable rule clean.
- **Move skill-generated docs into `artifacts/`.** Every skill's fixed path would break for no gain. The register gives one view of both.
- **Move `wiki/` to `docs/wiki/`, or put `sources/` inside `notes/`.** Nine files and every existing project would need a migration, and `notes/` is the capture zone where immutability does not fit.
- **Auto-ingest on file drop with a hook or file watcher.** Hooks work in few clients, and it skips the confirm step. Ingest is started by the user or the coordinator, with `wiki-status` as the safety net.
- **A background agent that asks for confirmation.** It cannot pause. It follows AGENTS.md §9 instead: file clear facts, flag conflicts, start new pages as drafts, skip tier 3 calls.
- **Every skill writes to the wiki.** Many writers means contradictions and inconsistent page shapes.
- **Never touch a person's files.** Cleaner, but a note cannot then show where it went. A marked footer is allowed, and it doubles as the "processed" marker.
- **Publish everything, or publish by sharing the folder.** One confidential source could leak, and people without an editor could not read it. Publish is a filtered static site: sources, `my-notes/` and draft pages stay out unless a source is opted in.
- **Notion or Confluence only.** It makes the wiki depend on a paid tool, against AGENTS.md §2.5. A push stays optional.
- **Obsidian-specific features** (wikilinks, Dataview, canvas). The team uses Obsidian and Plainva and others use Notion. Standard Markdown links with GitHub anchors work in all of them (AGENTS.md §2.10).

## Scope
Applies to every prototype the suite sets up (`setup` creates `sources/` and `artifacts/`). It does not change which skill owns which doc. Existing projects keep `notes/wiki/` where it is; `entities/` pages move to `topics/` when `lint` proposes it and the user agrees.
