# Page types and formats

## Contents
- [index.md](#indexmd)
- [log.md](#logmd)
- [sources.md](#sourcesmd)
- [artifacts.md](#artifactsmd)
- [decisions.md](#decisionsmd)
- [Topic pages](#topic-pages)
- [Link snapshots](#link-snapshots)

The wiki has no page for a single source, term or decision. Registers hold those as rows. Only topics get their own page.

## index.md

The front door. Categorized catalog: one line per page with a link and a summary. Update it on every ingest. Include a Mermaid graph of topics when there are more than five.

```markdown
# Project wiki

## Start here
- [Sources](sources.md): everything others gave us
- [Artifacts](artifacts.md): what we made
- [Decisions](decisions.md): key calls and why
- [Glossary](../../GLOSSARY.md): project terms

## Topics
- [Onboarding](topics/onboarding.md): how a new advisor gets set up (persona, 3 sources)
```

## log.md

Append-only. One heading per event. Never rewrite an old line.

```markdown
## [YYYY-MM-DD] ingest, S-004 client brief, touched: [Onboarding](topics/onboarding.md), [Sources](sources.md)
## [YYYY-MM-DD] lint, 2 contradictions, 1 gap, 3 drafts
## [YYYY-MM-DD] publish, 14 pages, 2 sources opted in
## [YYYY-MM-DD] milestone: persona — PERSONA_WALKTHROUGH.md confirmed
```

A background run also writes a `### Needs review` list under its ingest line: new draft pages, flagged conflicts, skipped steps.

## sources.md

One row per file or link in `sources/`. IDs run `S-001`, `S-002` and never repeat. The Path cell is a real relative link, so it works in an editor.

```markdown
| ID | Title | Origin | Date | Path | Told us | Used in | Publish |
|---|---|---|---|---|---|---|---|
| S-001 | Client brief v2 | client | 2026-10-02 | [brief](../../sources/client/brief-v2.pdf) | Advisors need offline mode | [Onboarding](topics/onboarding.md) | no |
```

- **Origin:** `client`, `team:<name>`, `research` or `link`.
- **Told us:** one line, in your words. It is not a copy.
- **Used in:** links to the topic pages that cite this ID. This is the "incorporated into" record for a source.
- **Publish:** `no` by default. `yes` opts the file into the published site. A blank cell means `no`.

## artifacts.md

One row per thing we made, including skill-owned docs. IDs run `A-001`.

```markdown
| ID | Title | Kind | Owner | Path | Cites | Publish |
|---|---|---|---|---|---|---|
| A-001 | Advisor onboarding flow | workflow | Aaron | [onboard](../../artifacts/workflows/onboard.md) | S-001, S-004 | yes |
| A-002 | Persona walkthrough | persona | `persona` skill | [doc](../../PERSONA_WALKTHROUGH.md) | S-002 | yes |
| A-003 | Day-in-the-life deck | deck | `showcase` | [deck](../../exports/story.html) | A-002 | yes |
| A-004 | Stakeholder readout | download | `showcase` | [pptx](../../exports/readout.pptx) | S-001 | yes |
```

- **Kind:** `workflow`, `sitemap`, `persona`, `diagram`, `deck`, `download` or another plain word. Reuse an existing kind before you add a new one.
- **Owner:** a person or the skill that keeps the file.
- **Publish:** `yes` by default. `no` keeps it out of the site.
- A skill-owned doc outside `artifacts/` can be listed too. `wiki-site` publishes it from where it is. It never publishes anything from `sources/` through this register, and never from `my-notes/`.

## decisions.md

A digest. One row per ADR. The ADR in `adr/` stays the source of truth.

```markdown
| ADR | Decision | Why in one line | Cites |
|---|---|---|---|
| [0004](../../adr/0004-offline-first.md) | Offline-first sync | Advisors work in client homes with no signal | S-001 |
```

Add a row when `decisions` writes an ADR. Do not copy the ADR text.

## Topic pages

A topic is a durable thing that comes up more than once: a persona, a pain point, a recurring theme, a workflow the team keeps citing. Do not make a page for something said once. Check `index.md` first so you do not create a near-duplicate.

```markdown
---
type: topic
status: stable          # draft | stable. A background run starts new pages as draft.
updated: YYYY-MM-DD
---
# Topic name

## Summary
Two to four sentences: what this is and why it matters to the project.

## What we know
- A fact, with its source. (S-004)
- A fact from an artifact. (A-001)

## Related
- [Other topic](other-topic.md)

## Open questions
Unresolved points. Cross-check `docs/UNKNOWNS.md`.
```

Promotion rule: a section that grows past about one screen, or that three or more pages link to, moves to its own topic page. Leave a link behind. `lint` proposes the move.

## Link snapshots

A link becomes a file in `sources/links/<slug>.md`. It is immutable once written.

```markdown
---
url: https://example.com/page
fetched: YYYY-MM-DD
title: Page title
---
# Page title

[The page text, as plain Markdown.]
```

The snapshot keeps the content when the page changes or disappears. To refresh a link, save a new snapshot with a new ID. Do not overwrite the old one.
