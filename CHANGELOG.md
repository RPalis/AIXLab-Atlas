# Changelog

Versions follow `.claude-plugin/plugin.json` and `package.json`. Keep them equal.

## 0.2.0 (unreleased)

Aligns the suite with the Agent Skills spec and the Claude, Codex and Gemini skill docs.
See `ux-atlas-docs/SKILL_LIBRARY_COMPETITIVE_ANALYSIS.md` for the reasoning behind each change.

### Added
- Claude Code plugin and marketplace manifests (`.claude-plugin/`). Skills install as `/ux-atlas:<skill>`.
- `audit` `perf` mode. `audit` `a11y` now covers WCAG 2.2 and mobile screen readers.
- `refine` craft floor and lens references: motion, UX copy, hardening, first run, performance, mobile.
- `scaffold` `mobile-app` type layer.
- `help` `doctor` mode and `tools/doctor`.
- `tools/design-check`, `tools/check-token-contrast`, and the opt-in `tools/design-hook`.
- `GLOSSARY.md` in each prototype, written by `setup`, grown by `interrogate` and `decisions`.
- `scripts/validate.mjs`, `scripts/build-portable.mjs`, `scripts/sync-skill-metadata.mjs`, tests, CI, and `evals/`.
- `agents/openai.yaml` for every skill (generated). `SCOPE.md` and `.out-of-scope/`.
- MIT `LICENSE` (copyright Aaron Kiersky, @akiersky) and a `license` field in `plugin.json` and `package.json`.

### Changed
- 21 phase skills are user-invoked (`disable-model-invocation: true`). Eight stay model-invoked. `help` is the front door.
- Every description is 600 characters or fewer. Five were over the 1,024-character spec limit.
- Nine mode-heavy skills are now a short router plus one reference file per mode.
- Scaffold and styleguide use Tailwind CSS v4 (`@theme inline`, no `tailwind.config.js`).
- The default token palette now passes WCAG AA. The earlier `text-muted`, `border-input` and accent-foreground values failed.
- `install.sh` no longer links hub-direct clients (Gemini, Codex, Copilot, Cursor). It installs `agents/` and warns when the plugin is also present.
- Output Discipline is one bullet per skill; the long form moves to the project `AGENTS.md` that `setup` writes.
- Fixed raw palette classes and hex in the shipped `scaffold` and `map` templates.

### Fixed
- `audit` `a11y` listed WCAG 2.5.5 as AA. AA target size is 2.5.8 (24 px). 2.5.5 is AAA.
