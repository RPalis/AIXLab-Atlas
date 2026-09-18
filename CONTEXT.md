# UX Atlas

A portable, standalone suite of AI Agent Skills for taking a UX prototype through Discover → Decide → Design → Deliver. This repo is the suite's own source — the skills it ships, not a prototype built with them.

## Language

**Suite**:
This repository itself — UX Atlas — the collection of skills in `skills/` plus its own `AGENTS.md` and `README.md`. Distinct from a _prototype_, which is what the suite is used to build.
_Avoid_: Library, toolkit, framework

**Skill**:
One folder under `skills/` with a `SKILL.md` that owns a single lifecycle-phase job (e.g. `styleguide`, `persona`, `map`). The unit the suite is composed of.
_Avoid_: Plugin, module, command

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
_Avoid_: Generated doc, artifact, output

**Token (Layer 1 / Layer 2)**:
A CSS custom property in the suite's mandatory two-layer architecture. Layer 1 (Raw Brand Palette) holds raw brand hex/RGB values at `:root`; Layer 2 (Semantic Roles) holds UI-intent variables (`--bg-page`, `--action-primary`) bound to Layer 1 and rebound under `.dark`. Component code only ever references Layer 2.
_Avoid_: Variable, CSS var, style constant

**Unknown**:
A decision that genuinely cannot be made from code, existing docs, or a reasonable default, logged as a line in a prototype's `UNKNOWNS.md` rather than guessed. Resolved unknowns are promoted into whichever living doc owns that domain and removed from the list.
_Avoid_: TODO, open question, assumption
