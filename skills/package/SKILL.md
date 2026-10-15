---
name: package
description: >-
  Package the current repo for handoff, in two modes: "full" (unminified site + raw source + docs, three-folder zip, for a developer to read/rebuild) or "lite" (minified production/ folder that runs on any static host with no backend process — index.html at the root, everything else in assets/, the backend's API embedded as a snapshot with edits persisted to localStorage). Repo-agnostic — frontend (React/Vue/etc. or Angular), optional backend, optional Electron. Use /package full or /package lite.
---

# App Packaging

Two distinct handoffs, not one script trying to do both. Call the mode explicitly: **`/package full`** or **`/package lite`**.

Repo-agnostic — works whether the repo is a frontend-only prototype or a full-stack app: frontend dir = whichever of `frontend/` or `angular/` has a `package.json`/`angular.json`; `backend/` and `electron/` are picked up automatically when present, skipped when absent.

| | `full` | `lite` |
|---|---|---|
| **Output** | `<app-name>.zip` at repo root | `production/` folder at repo root |
| **Contains** | `site/` (unminified + source maps) + `development/` (raw source, no `node_modules`) + `documentation/` | the app's real production build (minified, hashed, tree-shaken): `index.html` at the root, everything else under `assets/`, plus an embedded snapshot of the backend so it runs with no server process |
| **For** | a developer who needs to read, extract, or rebuild the app | someone who just needs to *run* it, on any static host |
| **`node_modules`** | excluded; the recipient runs `npm install` and rebuilds from `development/` | not applicable; nothing to install, it's a compiled build |
| **Backend** | shipped as source in `development/`; runs separately | not shipped; its GET responses are captured into `assets/backend-snapshot.json` and served in-browser, with writes persisted to `localStorage` |
| **Zip** | always (that's the deliverable) | never by default, a plain folder is what "lite" implies; offer to zip only if asked |

Run either **on request**, after a batch of edits, not after every single change.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Environment
- **Needs:** a file system, a shell and Node.js (npm).
- **If it isn't available:** No shell or Node.js here: stop and tell the user to run this skill in an environment that has them, such as Claude Code. Do not simulate install or build output.

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
5. **Assemble `documentation/`.** The project's docs, text only (binaries like screenshots/PDFs stripped from this folder; see `showcase`/`guide` for those as separate deliverables).
6. **Zip and verify.** Checks for leaked `node_modules`/`.DS_Store`, confirms all three folders are present, confirms source maps exist in `site/`.

## Mode: `lite`

Run [`scripts/package-lite.sh`](scripts/package-lite.sh) from the repo root:
```bash
bash scripts/package-lite.sh
```

The result is a `production/` folder that is the real app, as close to production as a static folder can get: drop it on any static host (or `python3 -m http.server` inside it) and it runs with **no backend process**. Overrides when detection guesses wrong: `FRONTEND=<dir>`, `BACKEND=<dir>`, `BACKEND_URL=<url>`, `HOOKS=<file>`, `OUT=<dir>`.

What it does, in order:

1. **Snapshot the backend** (only when the repo has a `backend/`; skipped otherwise). [`lite/snapshot-backend.mjs`](scripts/lite/snapshot-backend.mjs) discovers the API routes from the backend source (Express-style `app.get('/x')` incl. mounted routers, NestJS decorators, Flask/FastAPI decorators), the frontend's own `fetch()` literals, and an OpenAPI document if one is served; then requests every GET from the running backend, expanding `:id` params with ids from the parent collection, and writes the responses to `assets/backend-snapshot.json`. The backend is started from `backend/` if it isn't already up (`npm run dev`, else `npm start`) and stopped again afterward. Routes the heuristics miss (query-string variants, unusual mounts) go one per line in `backend/static-routes.txt`.
2. **Build production.** The framework's real production config, relative base so the folder works from any path: Vite's default `build` (minified, hashed, no maps), or `ng build --configuration production`. Source maps are stripped if a build emits them anyway.
3. **Lay it out.** [`lite/normalize-layout.mjs`](scripts/lite/normalize-layout.mjs): `index.html` stays at the root, along with only the files that don't work anywhere else (`favicon.ico`, `robots.txt`, manifests, host config like `_redirects`/`.htaccess`, `404.html`). Everything else — bundles, `public/` files, embedded sub-apps like `storybook/` or `graphify/` — moves into `assets/`, and references are rewritten (`./logo.png` → `./assets/logo.png`, `<script src="main-XYZ.js">` → `assets/main-XYZ.js`). Rewriting is type-aware: chunk-to-chunk `import()`s and CSS `url()`s are relative to the file that moved with them, so they're left alone.
4. **Embed the static backend.** [`lite/static-backend.js`](scripts/lite/static-backend.js) is copied into `assets/` and a `<script>` for it is injected into `index.html` ahead of the app bundle. It patches `fetch` and `XMLHttpRequest`: requests under the API prefix are answered from the snapshot instead of the network. GETs return the captured response; POST/PUT/PATCH/DELETE get generic REST semantics against the same collections (POST appends and mints an id in the collection's own style — `REQ-2026-090` after `REQ-2026-089`, `42` after `41` — and mirrors any `createdAt`/`updatedAt` fields; PATCH/PUT merge by id; DELETE removes). Every change is written to `localStorage` under `static-backend:<app>` and layered over the snapshot, so it survives reloads. Opening the app with `?reset` (or `__staticBackend.reset()` in the console) discards local changes.
5. **Report.** Root entries (expect `index.html` + `assets/` + at most the allowlist), size, file count, zero maps, the snapshot's route/capture counts, any moved directory that the bundle references *without* a trailing slash (could be a SPA route, could be a link that now needs `assets/…/` — check by hand), and whether each embedded sub-app is linked from the app's own UI (keep) or nothing references it (dev-only cruft; confirm before removing).

### Hooks: when generic CRUD isn't the real behavior

Most prototype backends are CRUD over seed data, and the generic handling above reproduces them. Routes that *compute* — a workflow transition (`POST /requests/:id/action` running a state machine), a rebalance calculation, a write that touches several collections — need a hook, or the packaged app will answer them with the item unchanged and log `static-backend: no hook for POST /requests/:id/action` in the console.

After the first run, **walk the app in the browser served from `production/` with the backend stopped**, watching the console for those warnings. For each one, add an entry to `backend/static-hooks.ts` (start from [`lite/static-hooks.template.ts`](scripts/lite/static-hooks.template.ts); the types are inline). Hooks are TypeScript, bundled with the frontend's own esbuild into `assets/static-backend-hooks.js`, so they can import the same `shared/` modules the real backend uses — the transition logic is written once, not reimplemented in the browser:

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

**Completion criterion (both modes):** the doc reconciliation step (full) or the browser walk with the backend stopped (lite) was actually performed and reported, not skipped. The verification step's output is reported to the user (root entries, size, snapshot counts, remaining console warnings and which hooks they'd need), not just "done."
