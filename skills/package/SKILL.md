---
name: package
description: Package the prototype for handoff, in two modes: "full" (unminified site + raw source + docs, three-folder zip, for a developer to read/rebuild) or "lite" (minified production/ folder only, bare essentials, just to run it). Use /package full or /package lite.
disable-model-invocation: true
---

# Prototype Packaging

Two distinct handoffs, not one script trying to do both. Call the mode explicitly: **`/package full`** or **`/package lite`**.

| | `full` | `lite` |
|---|---|---|
| **Output** | `<app-name>.zip` at repo root | `production/` folder at repo root |
| **Contains** | `site/` (unminified + source maps) + `development/` (raw source, no `node_modules`) + `documentation/` | just the app's real production build: minified, hashed, tree-shaken |
| **For** | a developer who needs to read, extract, or rebuild the app | someone who just needs to *run* it |
| **`node_modules`** | excluded; the recipient runs `npm install` and rebuilds from `development/` | not applicable; nothing to install, it's a compiled build |
| **Zip** | always (that's the deliverable) | never by default, a plain folder is what "lite" implies; offer to zip only if asked |

Run either **on request**, after a batch of edits, not after every single change.

## Mode: `full`

Run [`scripts/package-full.sh`](scripts/package-full.sh):
```bash
bash scripts/package-full.sh
```

What it does, in order:
1. **Type-check** (`npx tsc -b --noEmit`). Catch drift before building.
2. **Reconcile docs with the live app.** Before packaging, check that `docs/PERSONA_WALKTHROUGH.md`, `docs/OOUX_OBJECT_MAP.md`, `DESIGN.md`, and any `docs/adr/` entries still match the current code (routes, components, workflows). This is a judgment step. Compare docs against source and fix what's drifted; don't skip it because the script itself can't do it for you.
3. **Build the unminified site.** Source maps on, relative base href, so it drops onto any static host and deep links still work. Ships with one-click local-serve helpers (`serve.command` for macOS, `serve.bat`/`serve.ps1` for Windows); clipboard-based features like `figma` need a secure context (localhost), which these provide.
4. **Assemble `development/`.** Raw `frontend/` + `shared/` source, `node_modules` excluded (the recipient reinstalls), configs and lockfiles included so it's buildable.
5. **Assemble `documentation/`.** The project's docs, text only (binaries like screenshots/PDFs stripped from this folder; see `showcase`/`guide` for those as separate deliverables).
6. **Zip and verify.** Checks for leaked `node_modules`/`.DS_Store`, confirms all three folders are present, confirms source maps exist in `site/`.

## Mode: `lite`

Run [`scripts/package-lite.sh`](scripts/package-lite.sh):
```bash
bash scripts/package-lite.sh
```

What it does, in order:
1. **Build production.** The framework's real production config (Vite's default `build` already is this: minified, hashed filenames, no maps). If the default build unexpectedly emits maps, strip them post-build rather than accepting a bloated "lite" package.
2. **Copy to `production/`, then strip to bare essentials.** Remove anything that isn't the shipped app itself, but check reachability first: if the prototype embeds tooling (a Storybook viewer from `storybook`, a `constellation.html` from `wiki`) as static assets, grep the app's own source for a link/route to it before touching it.
   - **Linked from the app's own UI** (reachable via the Prototype Tools menu or a nav item) → keep it. "Lite" means minified, not "missing pieces a user can click into and hit a 404."
   - **Not linked anywhere** → genuine dev-only cruft, safe to remove.
   - Unsure which applies → ask, don't assume.
3. **Verify.** Zero `.map` files, low single-digit MB for a typical prototype, small flat file count, sane `index.html`.

**Completion criterion (both modes):** the doc reconciliation step (full) or reachability check (lite) was actually performed and reported, not skipped. The verification step's output is reported to the user (cruft check, folder contents, size), not just "done."
