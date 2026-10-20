---
name: wiki
description: >-
  Librarian for the project wiki. Turns client files, other teams' material, links and your notes
  into an interlinked, cited Markdown wiki, keeps it current, and publishes it as a static site.
  Modes: compile, note, lint, publish. Use when the user drops or links a document, jots a thought,
  says they added things, or asks to organize notes or publish the wiki.
argument-hint: "[compile: ingest sources into wiki | note: quick capture | lint: health check | publish: build site]"
---

# Wiki (the librarian)

Raw material gets re-read from scratch every time it is needed. This skill **compiles** it once into a small set of interlinked, cited pages and keeps them current. It does the bookkeeping (cross-references, contradictions, staleness). The thinking stays with the team.

The method comes from Karpathy's LLM-wiki pattern: raw sources that are never edited, a wiki the model maintains, and a schema of rules. This file and its references are the schema.

Four modes. Load one reference per run.

| Mode | Use when | Reference |
|---|---|---|
| `compile` (default) | A link, a file, or "I added things". Ingests one source or sweeps everything unprocessed. | [`references/compile.md`](references/compile.md) |
| `note` | A thought worth keeping, with no ceremony. | [`references/note.md`](references/note.md) |
| `lint` | A checkpoint, or the wiki feels stale. Finds contradictions, gaps, orphans, drift. | [`references/lint.md`](references/lint.md) |
| `publish` | The client or another team needs to read the wiki without the repo. | [`references/publish.md`](references/publish.md) |

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Layers

```
docs/
  sources/        IMMUTABLE. Written by others. Read, never edit.
    client/  teams/  research/  links/
  artifacts/      EDITABLE. Written by us and kept by hand: workflows/, sitemaps/, personas/ ...
  notes/
    my-notes/     Your raw capture zone. Drop things freely.
    wiki/         Owned by this skill. Nobody else writes here.
      index.md  log.md  sources.md  decisions.md  artifacts.md
      topics/<slug>.md      the only per-item pages
      constellation.html    graph view (lint regenerates it)
  GLOSSARY.md  adr/  PERSONA_WALKTHROUGH.md ...   skill-owned docs, unchanged
```

`docs/` is shorthand for the project's real docs folder. Resolve it with [`find-docs-folder`](../../tools/find-docs-folder/find-docs-folder.sh). Page formats are in [`references/page-types.md`](references/page-types.md).

## Rules for every mode

1. **Who wrote it decides where it lives.** Others wrote it (client, another team, a link): `sources/`. We wrote it: `artifacts/`, or the fixed path a skill uses. A team's sitemap stays untouched in `sources/teams/`. Your adapted copy goes in `artifacts/sitemaps/` and cites the original by ID.
2. **Only this skill writes to `notes/wiki/`.** Every other skill reads the wiki and cites it ([`references/reading-rule.md`](references/reading-rule.md)). Skills still write through `log-milestone`, `log-unknown` and `decisions`. This skill sweeps those in.
3. **Never edit text that a person wrote.** One exception: a marked footer at the end of `my-notes/` and `artifacts/` files that lists where the file was incorporated. Write it only with [`wiki-footer`](../../tools/wiki-footer/wiki-footer.sh). Never put a footer in `sources/`. A source's "incorporated into" links go in its `sources.md` row.
4. **Point, do not copy.** The wiki links to ADRs in `adr/`, to `GLOSSARY.md`, and to skill-owned docs. It adds context (which sources informed it, what it affects). It does not keep a second copy that can drift.
5. **Cite by stable ID.** A claim on a topic page cites `(S-004)` for a source or `(A-001)` for an artifact, not a file path. A rename in the editor never breaks a citation. The register maps the ID to the file. A `my-notes/` file has no ID. Cite it by a dated link, such as `([2026-10-10 client kickoff](../../my-notes/2026-10-10-client-kickoff.md))`, and say whose statement it records ("client said", "we decided").
6. **Links are standard Markdown.** Use `[text](path.md)` and `[text](path.md#section)` with GitHub heading anchors. Never use `[[wikilinks]]`, Dataview or canvas files. Frontmatter is plain `key: value` lines. Obsidian, Plainva, GitHub and VS Code all follow these links.
7. **One writer at a time.** If another `wiki` run is active, wait. Two writers on the same page cause contradictions.
8. **Every folder gets a README.** When you create a folder (`topics/`, a team folder in `sources/teams/`, a new artifact kind), add a `README.md` from [`setup`'s templates](../setup/references/folder-readmes.md): what it is for, how to use it, one thing not to do. `wiki-status` lists folders without one as `NOREADME`.
9. **Contradictions are flagged, never resolved silently.** Write `> ⚠️ Conflicts with [other](other.md), needs resolution` next to the claim.

## Interactive and background runs

- **Interactive** (the user runs `wiki`): show the takeaways and the topic pages the source touches. Wait for a yes, then file.
- **Background** ([`wiki-agent`](../../agents/wiki-agent.md), no human present): do not pause. Follow suite `AGENTS.md` §9. File clear facts. Flag contradictions inline. Start new topic pages with `status: draft` and list them under "Needs review" in `log.md`. Log a blocking conflict with `log-unknown --tier 3`. Skip a step that needs a call between two real sources.

## Boundaries

- A decision with a rejected alternative: [`decisions`](../decisions/SKILL.md). The wiki links to the ADR.
- A term: `GLOSSARY.md`, written by `interrogate` and `decisions`. The wiki links to it.
- A question that needs real stakeholder input: `docs/UNKNOWNS.md` ([`log-unknown`](../../tools/log-unknown/log-unknown.sh)).
- A skill's own deliverable (`PERSONA_WALKTHROUGH.md`, `OOUX_OBJECT_MAP.md`): the owning skill keeps it. The wiki registers it in `artifacts.md`.

## `log.md` is the whole project's log

It holds `ingest`, `lint` and `publish` lines from this skill, and `milestone` lines from any skill, written with [`log-milestone`](../../tools/log-milestone/log-milestone.sh). It is a resume point for an agent, a narrative record, and raw material for a [`showcase`](../showcase/SKILL.md) case study.

## Tools

| Tool | Does |
|---|---|
| [`wiki-status`](../../tools/wiki-status/wiki-status.sh) | Lists unregistered sources, loose files, new or changed notes, drafts, folders with no README, and lint age. No model. |
| [`wiki-footer`](../../tools/wiki-footer/wiki-footer.sh) | Writes or replaces the "incorporated into" footer. |
| [`wiki-site`](../../tools/wiki-site/wiki-site.mjs) | Builds the static site with the publish filter. Needs `npm i marked`. |

**Completion criterion:** every file in `sources/` has a `sources.md` row, every `my-notes/` and `artifacts/` file has a current footer, every topic page is reachable from `index.md`, every run left a `log.md` line, and `wiki-status` reports `OK` (or only `DRAFTS` waiting for review).
