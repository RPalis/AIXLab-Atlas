---
name: package
description: >-
  Packages the repo for handoff. Modes: full (site, source and docs zip), lite (static-host folder),
  figma (flat files for Figma Make). Use when the prototype is ready to go to developers,
  stakeholders or Figma.
argument-hint: "[full: site + source + docs | lite: static-host folder | figma: Make-ready files]"
disable-model-invocation: true
---

# App Packaging

Three distinct handoffs, not one script trying to do all of them. Call the mode explicitly: **`/package full`**, **`/package lite`**, or **`/package figma`**.

Repo-agnostic — works whether the repo is a frontend-only prototype or a full-stack app: frontend dir = whichever of `frontend/` or `angular/` has a `package.json`/`angular.json`; `backend/` and `electron/` are picked up automatically when present, skipped when absent.

| | `full` | `lite` | `figma` |
|---|---|---|---|
| **Output** | `<app-name>.zip` at repo root | `<app-name>-production/` folder at repo root | `<app-name>-figma/` folder at repo root |
| **Contains** | `site/` (unminified + source maps) + `development/` (raw source, no `node_modules`) + `documentation/` | the app's real production build (minified, hashed, tree-shaken): `index.html` at the root, everything else under `assets/`, plus an embedded snapshot of the backend so it runs with no server process | a flat folder, no subfolders: `index.html`, `app.css`, a few unminified `.js` files, `package.json`, `MAKE_PROMPT.txt`, plus the backend snapshot and shim when there's a backend. Every file under the size limit |
| **For** | a developer who needs to read, extract, or rebuild the app | someone who just needs to *run* it, on any static host | getting the prototype into Figma Make to share and keep prompting on |
| **`node_modules`** | excluded; the recipient runs `npm install` and rebuilds from `development/` | not applicable; nothing to install, it's a compiled build | not applicable; libraries stay as imports by name and Make installs them from `package.json` |
| **Backend** | shipped as source in `development/`; runs separately | not shipped; its GET responses are captured into `assets/backend-snapshot.json` and served in-browser, with writes persisted to `localStorage` | same snapshot and shim as `lite`, flat in the root |
| **Zip** | always (that's the deliverable) | never by default, a plain folder is what "lite" implies | never; the files are attached to a chat one by one |

Run either **on request**, after a batch of edits, not after every single change.

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Mode: `full`

Run [`scripts/package-full.sh`](scripts/package-full.sh):
```bash
bash scripts/package-full.sh
```

What it does, in order:
1. **Type-check** (`npx tsc -b --noEmit`). Catch drift before building.
2. **Reconcile docs with the live app.** Before packaging, check that `docs/PERSONA_WALKTHROUGH.md`, `docs/OOUX_OBJECT_MAP.md`, `DESIGN.md`, and any `docs/adr/` entries still match the current code (routes, components, workflows). This is a judgment step. Compare docs against source and fix what's drifted; don't skip it because the script itself can't do it for you.
3. **Build the unminified site.** Source maps on, relative base href, so it drops onto any static host and deep links still work. Ships with one-click local-serve helpers (`serve.command` for macOS, `serve.bat`/`serve.ps1` for Windows); clipboard-based features like `figma` need a secure context (localhost), which these provide.
4. **Assemble `development/`.** Raw source from whichever of `frontend/`, `angular/`, `backend/`, `electron/`, `shared/` are present, `node_modules` excluded (the recipient reinstalls), configs and lockfiles included so it's buildable.
5. **Assemble `documentation/`.** The project's docs, text only (binaries like screenshots/PDFs stripped from this folder; see `showcase`/`guide` for those as separate deliverables). `sources/` (other people's material, often confidential) and `notes/my-notes/` are left out. If `wiki-site/` exists it is included. To ship the wiki inside the prototype itself, build it into the frontend's `public/wiki/` (see [`wiki`](../wiki/SKILL.md)'s `publish` mode); the normal build then carries it. If `wiki-status` shows unprocessed wiki work, the script prints it: run [`wiki`](../wiki/SKILL.md), then its `publish` mode, to refresh the site before you hand it off.
6. **Zip and verify.** Checks for leaked `node_modules`/`.DS_Store`, confirms all three folders are present, confirms source maps exist in `site/`.

## Mode: `lite`

Run [`scripts/package-lite.sh`](scripts/package-lite.sh) from the repo root:
```bash
bash scripts/package-lite.sh
```

The result is an `<app-name>-production/` folder (the app name comes from the repo directory's own name) that is the real app, as close to production as a static folder can get: drop it on any static host (or `python3 -m http.server` inside it) and it runs with **no backend process**. Overrides when detection guesses wrong: `FRONTEND=<dir>`, `BACKEND=<dir>`, `BACKEND_URL=<url>`, `HOOKS=<file>`, `OUT=<dir>` (set `OUT` to override the folder name/location entirely).

What it does, in order:

1. **Snapshot the backend** (only when the repo has a `backend/`; skipped otherwise). [`tools/package-lite/snapshot-backend.mjs`](../../tools/package-lite/snapshot-backend.mjs) discovers the API routes from the backend source (Express-style `app.get('/x')` incl. mounted routers, NestJS decorators, Flask/FastAPI decorators), the frontend's own `fetch()` literals, and an OpenAPI document if one is served; then requests every GET from the running backend, expanding `:id` params with ids from the parent collection, and writes the responses to `assets/backend-snapshot.json`. The backend is started from `backend/` if it isn't already up (`npm run dev`, else `npm start`) and stopped again afterward. Routes the heuristics miss (query-string variants, unusual mounts) go one per line in `backend/static-routes.txt`.
2. **Build production.** The framework's real production config, relative base so the folder works from any path: Vite's default `build` (minified, hashed, no maps), or `ng build --configuration production`. Source maps are stripped if a build emits them anyway.
3. **Lay it out.** [`tools/package-lite/normalize-layout.mjs`](../../tools/package-lite/normalize-layout.mjs): `index.html` stays at the root, along with only the files that genuinely break when served from a sub-path — host config (`_redirects`, `.htaccess`, `vercel.json`, etc.) and SPA-fallback pages (`404.html`, `200.html`). Everything else — bundles, favicons, manifests, `robots.txt`, `public/` files, embedded sub-apps like `storybook/` or `graphify/` — moves into `assets/`, and references are rewritten (`./logo.png` → `./assets/logo.png`, `<link rel="icon" href="/favicon.ico">` → `./assets/favicon.ico`). Rewriting is type-aware: chunk-to-chunk `import()`s and CSS `url()`s are relative to the file that moved with them, so they're left alone. The goal is a consistent two-entry root: `index.html` + `assets/` (plus host config when the build produces it).
4. **Embed the static backend.** [`tools/package-lite/static-backend.js`](../../tools/package-lite/static-backend.js) is copied into `assets/` and a `<script>` for it is injected into `index.html` ahead of the app bundle. It patches `fetch` and `XMLHttpRequest`: requests under the API prefix are answered from the snapshot instead of the network. GETs return the captured response; POST/PUT/PATCH/DELETE get generic REST semantics against the same collections (POST appends and mints an id in the collection's own style — `REQ-2026-090` after `REQ-2026-089`, `42` after `41` — and mirrors any `createdAt`/`updatedAt` fields; PATCH/PUT merge by id; DELETE removes). Every change is written to `localStorage` under `static-backend:<app>` and layered over the snapshot, so it survives reloads. Opening the app with `?reset` (or `__staticBackend.reset()` in the console) discards local changes.
5. **Report.** Root entries (expect `index.html` + `assets/` + at most the allowlist), size, file count, zero maps, the snapshot's route/capture counts, any moved directory that the bundle references *without* a trailing slash (could be a SPA route, could be a link that now needs `assets/…/` — check by hand), and whether each embedded sub-app is linked from the app's own UI (keep) or nothing references it (dev-only cruft; confirm before removing).

### Hooks: when generic CRUD isn't the real behavior

Most prototype backends are CRUD over seed data, and the generic handling above reproduces them. Routes that *compute* — a workflow transition (`POST /requests/:id/action` running a state machine), a rebalance calculation, a write that touches several collections — need a hook, or the packaged app will answer them with the item unchanged and log `static-backend: no hook for POST /requests/:id/action` in the console.

After the first run, **walk the app in the browser served from `<app-name>-production/` with the backend stopped**, watching the console for those warnings. For each one, add an entry to `backend/static-hooks.ts` (start from [`tools/package-lite/static-hooks.template.ts`](../../tools/package-lite/static-hooks.template.ts); the types are inline). Hooks are TypeScript, bundled with the frontend's own esbuild into `assets/static-backend-hooks.js`, so they can import the same `shared/` modules the real backend uses — the transition logic is written once, not reimplemented in the browser:

```ts
'POST /requests/:id/action': ({ params, body, db }) => {
  const current = db.find('/requests', params.id);
  const next = applyAction(current.tiers, body.action, body.role, body.tier);   // from ../shared/workflow.js
  if (!next.ok) return { status: 403, body: { error: next.reason } };
  return db.update('/requests', params.id, { tiers: next.tiers, state: deriveOverallStage(next.tiers, false) });
},
```

`db` is the same store the generic handling uses (`get`/`set`/`find`/`add`/`update`/`delete`/`nextId`/`reset`), so a hook and the generic routes see one consistent, persisted state. Two options sit beside `routes`: `latencyMs` adds a per-request delay so loading states look like production; `timeShift: true` moves every timestamp in snapshot data forward by the time elapsed since capture, which keeps "today's meetings" and "upcoming" data current for a demo instead of frozen at packaging time. Re-run `/package lite` after adding hooks; then walk the app again until the console is quiet.

### Known limits
- **Time-relative data freezes at capture** unless `timeShift` is on or a hook re-dates it. Re-package right before a demo if dates matter.
- **Query-string variants** (`/schedule?from=…`) are captured only if listed in `backend/static-routes.txt`; otherwise a GET falls back to the route without its query.
- **WebSockets / SSE / file uploads** aren't intercepted. A prototype that streams needs a hook-level substitute or stays a `full` handoff.
- **Deep links on reload** depend on the host's SPA fallback, same as any static build with a client-side router.

`lite` never ships `backend/` itself. If the recipient needs the real backend (auth, real data), that's a `full` handoff.

## Mode: `figma`

For moving a prototype into [Figma Make](https://www.figma.com/make/). Make has no "upload a project" path; the way in is attaching files to a Make chat, and its constraints are narrower than a normal static host's:

- **Every file under 1MB.** Text attachments over that are refused. The total can be larger. The script aims for 900,000 bytes to leave margin (`LIMIT=<bytes>` to change it).
- **Flat.** No subfolders. Files that a build normally puts in `assets/` or `public/` are moved to the root and their references rewritten.
- **Unminified.** Readable code, no hashes in file names.
- **No libraries inside the files.** Packages in the frontend's `dependencies` stay as `import … from 'react'` and are listed in a generated `package.json`; Make installs packages itself. The folder therefore does **not** run by itself on a static host (that's `lite`). `BUNDLE_DEPS=1` inlines the libraries instead if Make turns out to mishandle the imports.

Run [`scripts/package-figma.sh`](scripts/package-figma.sh) from the repo root:
```bash
bash scripts/package-figma.sh
```
Overrides: `FRONTEND=<dir>`, `BACKEND=<dir>`, `BACKEND_URL=<url>`, `HOOKS=<file>`, `OUT=<dir>`, `LIMIT=<bytes>`, `BUNDLE_DEPS=1`. Vite frontends only; an Angular repo is refused with a pointer to `lite`.

What it does, in order:

1. **Snapshot the backend** (only when there's a `backend/`). Same step as `lite`, shared in [`tools/package-lite/snapshot-step.sh`](../../tools/package-lite/snapshot-step.sh).
2. **Build flat.** [`tools/package-figma/build-flat.mjs`](../../tools/package-figma/build-flat.mjs) runs the project's own Vite and `vite.config` with overrides: no minify, no source maps, one `app.css`, relative base, no inlined assets, readable chunk names. If any `.js` file is over the limit it rebuilds split into chunks under the limit (size-based on Vite 8+, grouped by source folder on older Vite). One source module bigger than the limit can't be split; the report names the file and it has to be broken up by hand.
3. **Add the static backend** (when there's a backend). `static-backend.js`, `backend-snapshot.json` and, if `backend/static-hooks.ts` exists, an unminified `static-backend-hooks.js`, all at the root. Hooks work as described under `lite`.
4. **Finalize.** [`tools/package-figma/finalize.mjs`](../../tools/package-figma/finalize.mjs) flattens any leftover subfolder, strips the `<script src="react">`-style tags Vite writes for external packages, adds the `<script>` tags for the backend files, writes `package.json` (the frontend's `dependencies` only) and `MAKE_PROMPT.txt`, then reports every file with its size. It exits non-zero if a file is over the limit, a subfolder remains, or two files from different folders share a name (rename one in the source).
5. **Hand over.** The user attaches every file except `MAKE_PROMPT.txt` to a Make chat and pastes `MAKE_PROMPT.txt` as the message.

### Known limits
- **Not checked inside Make.** The script verifies size, layout and syntax. Whether Make accepts the result as-is, or rewrites it into its own React/TypeScript structure, depends on Make; the prompt asks it to keep the code and touch only what breaks. Expect to iterate with a follow-up message the first time.
- **Make's own project shape is React + TypeScript + Vite.** A flattened-source variant (the app's `.tsx` files at the root with import paths rewritten) would sit closer to that and is not built yet; Make accepts `.ts` text attachments under the same 1MB cap. Worth adding if the built `.js` route fights Make.
- **Large data in code or images** count against the limit like anything else. `backend-snapshot.json` over the limit means trimming routes (`backend/static-routes.txt`) or seed data.

**Completion criterion (all modes):** the doc reconciliation step (full), the browser walk with the backend stopped (lite), or the size and layout report from `finalize.mjs` with exit code 0 (figma) was actually performed and reported, not skipped. The verification step's output is reported to the user (root entries, size, snapshot counts, remaining console warnings and which hooks they'd need), not just "done."

Log it: `../../tools/log-milestone/log-milestone.sh --skill package --event "Packaged (<full|lite|figma>): <app-name>"` — a package run is a real "shipped" checkpoint in the project's narrative log, worth keeping even though it produces no doc of its own.
