---
name: map
description: >-
  Models a product's structure as evidence-graded diagrams. Modes: objects (OOUX object model), ia
  (content and navigation), site (proposed architecture), flow (one end-to-end user flow), audit
  (model against code), document (as-built diagrams). Use when planning or documenting information
  architecture, flows or architecture.
argument-hint: "[objects: OOUX object model | ia: content and navigation | site: proposed architecture | flow: end-to-end user flow | audit: model vs code | document: as-built diagrams]"
disable-model-invocation: true
---

# Map & Domain Modeling

Six modes, one job: turn a prototype's structure — proposed or built — into something you can see instead of just read.

- **`ia`** (Decide): structures the product's content, navigation, labelling and search around the user's mental model, as a gated, evidence-graded sitemap. Content-first: run before `site`.
- **`site`** (Decide, before code exists): plans the proposed route/workspace/component architecture as a diagram.
- **`objects`** (Decide): interactive OOUX/ORCA modeling — Objects, Relationships, Calls-to-Action, Attributes — producing `docs/OOUX_OBJECT_MAP.md` and an entity-relationship diagram.
- **`flow`** (Decide onward): a complete, evidence-grounded end-to-end user flow for one goal — every entry point, decision branch, error/empty state, recovery path and exit point, screen by screen, structured to translate directly into wireframes.
- **`audit`** (Decide→Design bridge): reconciles the `objects` model against actual code once it exists. Flags drift; doesn't silently overwrite either side.
- **`document`** (Design, once code exists): regenerates every diagram from the real built app — the in-app interactive architecture map, Mermaid, SVG — and updates the OOUX diagram if the model has drifted since the last `audit`.

Say which mode, or this skill asks. Don't blend them: a route diagram with journey arrows on it, or a flow organized by page instead of by step, both mean the wrong mode was picked. `ia` decides what content exists and how users find it; `site` then plans the routes and components that build it. `site` and `document` both produce an architecture diagram, but from opposite ends of the same question — `site` proposes it before anything is built, `document` documents what's actually there.

**Not this skill:**
- Mapping the full emotional experience of a persona through a scenario, or a current-state process → [`journey`](../journey/SKILL.md)'s `experience` or `map`/`blueprint` modes. `flow` mode is the sequence and logic of one task; it isn't about emotion or process-as-it-runs-today.
- Building the actual screens → [`scaffold`](../scaffold/SKILL.md). A flow is the sequence and logic, not the visual layout.

**Autonomous mode** (suite `AGENTS.md` §2.9): with no mode named, infer from the same repo-state signals [`help`](../help/SKILL.md)'s Step 1 uses — no `src/` yet → `objects` (the foundational Decide-phase mode, needed before `site` can plan against it); `src/` exists but no recent diagram refresh → `document`; an explicit persona/workflow to diagram → `flow`. If genuinely no signal either way, default to `objects`. Log which mode ran and why.

---

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Modes

Open the reference file for the chosen mode and follow it. Load only that file. Cross-references between modes name the mode, so open that mode's file when one is named.

| Mode | What it does | File |
|---|---|---|
| `objects` | OOUX object model | [references/objects.md](references/objects.md) |
| `ia` | content and navigation | [references/ia.md](references/ia.md) |
| `site` | proposed architecture | [references/site.md](references/site.md) |
| `flow` | end-to-end user flow | [references/flow.md](references/flow.md) |
| `audit` | model vs code | [references/audit.md](references/audit.md) |
| `document` | as-built diagrams | [references/document.md](references/document.md) |

## Optional: export to FigJam

Any diagram-producing mode can push its diagram into FigJam once the Figma MCP server is connected (`mcp__claude_ai_Figma__*` tools, its diagram-generation capability). Never assume it's present; check first, and if not connected, finish at the Mermaid/SVG output and say so rather than guessing at Figma's structure.

If connected: offer to generate the diagram in FigJam from the same node/edge data (`site`/`document` modes), step sequence (`flow` mode), or entity/relationship data (`objects` mode) already built for the Mermaid output, not a re-derived version. Confirm the target Figma file or board with the user before creating anything — the same discipline [`figma`](../figma/SKILL.md) and [`requirements`](../requirements/SKILL.md) use before writing to an external system — and report back what was created (file/board link).
