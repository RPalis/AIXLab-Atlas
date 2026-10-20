# UX Atlas

A portable, standalone suite of AI Agent Skills that supports the whole product design workflow through Discover → Decide → Design → Deliver. The prototype is a major milestone in it, not the goal, and the groundwork comes first. A quick start (minimum information, then a prototype to test, then backfill) is a supported path. This repo is the suite's own source — the skills it ships, not a prototype built with them.

## Language

**Suite**:
This repository itself — UX Atlas — the collection of skills in `skills/` plus its own `AGENTS.md` and `README.md`. Distinct from a _prototype_, which is what the suite is used to build.
_Avoid_: Library, toolkit, framework

**Skill**:
One folder under `skills/` with a `SKILL.md` that owns a single lifecycle-phase job (e.g. `styleguide`, `persona`, `map`). The unit the suite is composed of.
_Avoid_: Module, command

**Plugin**:
The Claude Code packaging of the whole suite (`.claude-plugin/`): skills, tools, agents and an opt-in hook installed as one unit. Skills in it are named `/ux-atlas:<skill>`. Not a synonym for skill.
_Avoid_: Using "plugin" for a single skill

**User-invoked / model-invoked**:
A user-invoked skill has `disable-model-invocation: true`: it starts only when the user types it, and its description costs no context in Claude Code. A model-invoked skill can also start from plain language. `help` is the model-invoked front door.
_Avoid_: Manual/automatic skill

**Tool**:
A deterministic script in `tools/` with no judgment in it (`design-check`, `check-token-contrast`, `doctor`). A skill decides; a tool does.
_Avoid_: Helper, utility

**Router**:
The short `SKILL.md` of a multi-mode skill. It names the modes and the rules they share, and points to one `references/<mode>.md` per mode.
_Avoid_: Index file

**Mode**:
A named sub-job inside a multi-mode skill, for related-but-distinct jobs that share one workflow shape rather than warranting separate skills (e.g. `styleguide`'s default vs. `forge`, `figma`'s `capture`/`import`/`sync`).
_Avoid_: Submode, variant, flag

**Prototype (repo)**:
A separate, target codebase that a skill from this suite is run against to produce or refine a UX prototype. Not this repo.
_Avoid_: Project, app, target repo

**Docs folder**:
A prototype repo's own documentation folder, named `<project-slug>-docs/` (never a bare `docs/`) so it reads unambiguously as its own vault when opened directly in a third-party tool like Obsidian. Every `docs/...` path written in a `SKILL.md` is shorthand for this, resolved from the prototype's own `AGENTS.md`.
_Avoid_: docs/, output folder

**Living doc**:
A doc owned by exactly one skill and kept in sync with its source of truth as that source changes, never hand-edited out of sync (e.g. `DESIGN.md` is regenerated from `index.css` by `styleguide`, not edited directly).
_Avoid_: Generated doc, output. Not an _artifact_ (see below): a living doc is owned by a skill, an artifact by the team.

**Source**:
Material another person wrote that a project depends on: a client file, another team's artifact, a saved copy of a link. Lives in a prototype's `sources/`, is immutable, and gets a stable ID (`S-004`) in the wiki's `sources.md`. If someone else wrote it, it is a source, whatever they call it.
_Avoid_: Resource, asset, input

**Artifact**:
Material the project team makes and keeps by hand: a workflow, a sitemap, a hand-made persona. Lives in a prototype's `artifacts/`, is editable, and gets an ID (`A-001`) in the wiki's `artifacts.md`. Not a _living doc_ (owned by a skill). Not a _source_ (written by others).
_Avoid_: Resource, asset, deliverable

**Librarian**:
The `wiki` skill, and its background `wiki-agent`, as the only writer to a prototype's `notes/wiki/`. Every other skill reads the wiki first and cites source IDs.
_Avoid_: Wiki bot, indexer

**Token (Layer 1 / Layer 2)**:
A CSS custom property in the suite's mandatory two-layer architecture. Layer 1 (Raw Brand Palette) holds raw brand hex/RGB values at `:root`; Layer 2 (Semantic Roles) holds UI-intent variables (`--bg-page`, `--action-primary`) bound to Layer 1 and rebound under `.dark`. Component code only ever references Layer 2.
_Avoid_: Variable, CSS var, style constant

**Unknown**:
A decision that genuinely cannot be made from code, existing docs, or a reasonable default, logged as a line in a prototype's `UNKNOWNS.md` rather than guessed. Resolved unknowns are promoted into whichever living doc owns that domain and removed from the list.
_Avoid_: TODO, open question, assumption
