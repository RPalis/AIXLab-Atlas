# Folder READMEs

## Contents
- [The rule](#the-rule)
- [Docs root](#docs-root)
- [sources/ subfolders](#sources-subfolders)
- [artifacts/ subfolders](#artifacts-subfolders)
- [wiki/topics/](#wikitopics)
- [adr/](#adr)

## The rule

Every folder the suite creates gets a `README.md`. It has three parts, each short: what the folder is for, how to use it (numbered steps), and one thing not to do. Write it when you create the folder. `wiki-status`, `lint` and `wiki-site` ignore `README.md` files. Use the templates below. In a template, `<docs>` is the project's docs folder.

## Docs root

Create `<docs>/README.md` if missing. If one exists, add the "Where does it go?" and "Common tasks" sections to it and keep the rest.

```markdown
# Project docs

Open this folder in a Markdown editor. It is the project's vault. Everyone edits the same plain files, and the `wiki` skill reads them, so edits flow in and nothing needs importing.

To get started, pick one:
- [Obsidian](https://obsidian.md): free for personal use, opens a folder as a vault.
- [Plainva](https://github.com/KDOJP/plainva): free, open source, opens an existing vault as it is. It is still in beta, so keep backups.
- [Visual Studio Code](https://code.visualstudio.com): any editor that edits files works, and VS Code has a Markdown preview built in.

Notion, OneNote and Apple Notes keep their own copy of a note. Edits there do not come back into this folder, so use them to read, not to edit.

## Where does it go?

| You have | Put it in |
|---|---|
| A file from the client | `sources/client/` |
| An artifact from another team | `sources/teams/<team>/` |
| A web page or link | Ask `wiki`: "ingest this link". It saves a copy in `sources/links/`. |
| Your notes from a meeting or feedback session | `notes/my-notes/`, one file per session |
| A quick thought | Ask `wiki`: "note: ..." |
| A workflow, sitemap or persona you made | `artifacts/<kind>/` |
| A choice with a rejected alternative | Ask for `decisions`. It writes `adr/`. |
| A question only a stakeholder can answer | `UNKNOWNS.md` |

Rule: if someone else wrote it, it is a source and you never edit it. If you wrote it, it is yours to edit.

## Common tasks

1. **Add material.** Drop the file in the right folder, then say "I added things". The `wiki` skill files it.
2. **See what waits.** Ask `help`, or run `tools/wiki-status`.
3. **Read the wiki.** Open `notes/wiki/index.md`.
4. **Check the wiki's health.** Ask for `wiki lint`.
5. **Share it.** Ask for `wiki publish`. Private sources and draft pages stay out.

Each folder has its own README with more detail.
```

## sources/ subfolders

```markdown
# Client files            (sources/client/)

Files the client gave you: briefs, decks, specs, feedback, recordings, transcripts.

How to use it:
1. Drop the file here. Keep the original name.
2. Say "I added things". `wiki` gives it an ID (`S-nnn`).
3. Ask `wiki` for the takeaways.

Do not edit a file here. Make an adapted copy in `../../artifacts/` and cite the original.
```

```markdown
# Other teams' artifacts  (sources/teams/)

Material from other teams: sitemaps, flows, designs, specs. Use one subfolder per team (`teams/platform/`).

How to use it:
1. Make or choose the team's subfolder.
2. Drop the file in. Keep the original name.
3. Say "I added things".

Do not edit a file here, even if the team calls it a draft.
```

```markdown
# Research  (sources/research/)

Research the team did not write itself: published studies, vendor reports, analytics exports, interview recordings from another group.

How to use it: drop the file in and say "I added things".

Your own interview notes belong in `../../notes/my-notes/`.
```

```markdown
# Saved links  (sources/links/)

Text copies of web pages, saved by the `wiki` skill. A copy keeps the content when the page changes or disappears.

How to use it:
1. Say "ingest this link: <url>".
2. `wiki` saves a dated copy here and gives it an ID.
3. A page that needs a login cannot be fetched. Paste its text into a file here instead.

Do not edit a copy. To refresh a link, ask for a new copy.
```

## artifacts/ subfolders

Pre-create `workflows/`, `sitemaps/` and `personas/`. Create another kind when the first file of that kind arrives, with the generic template.

```markdown
# Workflows  (artifacts/workflows/)

Step-by-step descriptions of how something is done: who does what, in what order, with which handoffs.

How to use it:
1. Add one file per workflow (`advisor-onboarding.md`).
2. List the sources it relies on, by ID (S-004).
3. Say "I added things". `wiki` lists it in `artifacts.md`.

If the workflow is an adapted copy of another team's, keep the original in `../../sources/teams/`.
```

```markdown
# Sitemaps  (artifacts/sitemaps/)

Our proposed or current site structure. Plain Markdown lists or Mermaid diagrams.

How to use it: add one file per sitemap. Cite the sources it comes from. Say "I added things".

A sitemap another team gave you is a source: it belongs in `../../sources/teams/`.
```

```markdown
# Personas  (artifacts/personas/)

Hand-made personas. A persona that the `persona` skill writes stays in `PERSONA_WALKTHROUGH.md`.

How to use it: add one file per persona. Cite the research it rests on. Say "I added things".
```

Generic template for a new kind:

```markdown
# <Kind>  (artifacts/<kind>/)

<One line: what this kind of artifact is.>

How to use it:
1. Add one file per item.
2. Cite the sources it relies on by ID.
3. Say "I added things".
```

## wiki/topics/

Create on the first topic page.

```markdown
# Topics  (notes/wiki/topics/)

One page per durable topic: a persona, a pain point, a recurring theme. Written by the `wiki` skill from your sources, artifacts and notes.

How to use it:
1. Find a topic in `../index.md` and read it.
2. To correct a fact, edit the page. The skill never overwrites your text.
3. A page marked `status: draft` was added by a background run. Review it, then change the status to `stable`.

Do not make a page for something said once.
```

## adr/

`decisions` creates this folder. It adds this file when it writes the first ADR.

```markdown
# Decision records  (adr/)

One short record per non-obvious decision, with the alternatives that were rejected and why.

How to use it:
1. Ask for `decisions` when a choice will raise "why did we do it this way?" later.
2. Read a record before you propose a change that it may already have ruled out.

The wiki lists each record in `notes/wiki/decisions.md`. Do not copy record text elsewhere.
```
