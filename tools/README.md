# Tools

Shared, deterministic scripts that skills call for mechanical work — no judgment, no
asking the user, no prose-level decisions. Same input always produces the same output.

This is the dividing line from `skills/`: a **skill** decides *what* to do and *why*
(ask the user, weigh a tradeoff, reconcile docs against code); a **tool** just *does*
one mechanical thing a skill would otherwise have to reimplement, or re-describe in
prose, every time it comes up.

Move something here when two or more skills need the same mechanical step, or a
skill's instructions contain a step with no decision in it (a grep, a file copy, a
lookup) that's currently just written out as prose for the model to re-derive each run.

## Layout

Each tool gets its own directory: `tools/<tool-name>/`, with a script and (if useful)
a short usage comment at the top of the script itself rather than a separate README.
Skills reference tools by relative path, e.g. `../../tools/find-docs-folder/find-docs-folder.sh`.

## Current tools

- **`find-docs-folder/`** — resolves this suite's docs folder for the current repo
  (reads the project `AGENTS.md`, falls back to `*-docs/` or `docs/`). Used by `setup`,
  `help`, `showcase`.
- **`check-hardcoded-colors/`** — greps a path for raw hex colors and raw Tailwind
  palette classes that should be semantic tokens instead. Used by `audit` (`code`
  mode) and `figma` (`import` mode verification).
- **`figma-capture-helper/`** — writes the static `enableFigmaCapture()` boilerplate
  (Figma's `capture.js` loader) into a target file, so the snippet is generated once
  from a template instead of hand-typed per project. Used by `figma` (`capture` mode).
- **`package-lite/`** — the mechanical build steps for `/package lite`: backend route
  snapshotting, static-host layout normalization, and the in-browser static-backend
  shim. Used by `package` (`lite` mode). No judgment lives here — hook-writing and doc
  reconciliation stay in the skill.
- **`package-figma/`** — the mechanical steps for `/package figma`: `build-flat.mjs` runs
  the project's own Vite with unminified, flat-named, size-capped output and libraries left
  as imports; `finalize.mjs` flattens leftover subfolders, writes `package.json` and
  `MAKE_PROMPT.txt`, and checks every file against the size limit. Reuses
  `package-lite/`'s backend snapshot and shim. Used by `package` (`figma` mode).
- **`pptx-deck-builder/`** — renders a `.pptx` from a `deck.json`: `build-deck.js`
  builds it, `render-preview.js` does an overflow check first via a geometry-faithful
  HTML render (story slides only). Three slide shapes share the same builder — `story`
  (narrative + real screenshot per slide), `themes` (title + bullet list, no screenshot)
  and `slides` (report-style: `callout`, `bullets`, `table` with confidence-colored
  cells, `quote`, `checklist`, `section`; checked against fixed fit limits before
  anything is written). Used by `showcase` (`story`, and `deck` mode's `slides`) and
  `workshop`'s `ingest` mode (`themes`, via `markdown-to-pptx` below). Needs the
  `pptxgenjs` npm package, found in the current directory first.
- **`markdown-to-docx/`** — turns a Markdown report into a styled `.docx`
  (`md-to-docx.mjs`): cover title, headings, nested lists, task lists, callouts, tables
  with confidence-colored cells, landscape pages for wide tables, images, header and page
  numbers, theme colors from a small JSON. A faithful conversion with no judgment: it
  never condenses or rewords. Used by `showcase`'s `doc` mode. Needs the `docx` npm
  package, found in the current directory first.
- **`markdown-to-pptx/`** — no-dependency parser that turns a plain Markdown report
  (`# title`, `## section` → slide, bullets/paragraphs → bullet list) into a
  `deck.json` for `pptx-deck-builder`'s `themes` shape. Used by `workshop`'s `ingest`
  mode: the Markdown is the real deliverable, the PPTX is a derived, best-effort
  render on top of it — the conversion can fail (missing npm dependency) without
  losing the deliverable. Reusable by any skill whose output is a Markdown report
  that sometimes also needs a slide version.
- **`capture-screenshot/`** — one real screenshot (fixed viewport, optional single
  click, error-state capture on failure) to a conventioned path. Used by `competitors`.
  Not used by `showcase`, which needs a multi-scene loop with a different driven state
  per shot — more than this tool's single-shot shape covers; it keeps its own
  per-project capture template for that.
- **`audit-mechanical-checks/`** — the grep-able, non-deliberative half of `audit`'s
  `code` mode: clickable non-semantic `<div onClick>`s, files with interactive
  elements but no `focus:ring`/`focus-visible` styling anywhere, and repo-root hygiene
  (stray lock files, zips, a generated `production/` folder). Used by `audit` (`code`
  mode).
- **`detect-project-phase/`** — resolves `help`'s Step 1 file-existence signals into
  a `PHASE=` value (before-discover → early-discover → discover-to-decide →
  decide-to-design → early-design → design → deliver). Used by `help`, `interview`
  (autonomous-mode default), and `setup` (existing-product inventory) so the same
  phase table isn't re-derived three times. Can't see the two signals that depend on
  whether `audit` has run (it persists no doc), so `design` collapses `help`'s
  mid-build/nearing-done distinction — a caller that needs that split still applies
  its own judgment on top.
- **`log-unknown/`** — appends a consistently-formatted line to `docs/UNKNOWNS.md`
  (`--skill <name> --tier <2|3> [--blocking] "<text>"`), and `--list-blocking` reads
  every open blocking entry back. This is the mechanism behind suite `AGENTS.md`
  §2.6/§2.9: every skill's "log it to `docs/UNKNOWNS.md`" autonomous-mode fallback
  goes through this instead of a hand-written line, so the file stays something an
  agent can query later, not just something a human reads.
- **`log-milestone/`** — appends a checkpoint entry to the project's wiki log
  (`docs/notes/wiki/log.md`): `--skill <name> --event "<fact>" [--why "<narrative>"]`.
  Widens that file from `wiki`'s own ingest history into a whole-project log, for
  three things at once — a resumable handoff point for an agent picking the project
  back up, the connective narrative between a project's ADRs/docs/phase transitions,
  and case-study material `showcase` can mine later (`--list --why-only`). For
  meaningful checkpoints only, not every skill run — see the tool's own header
  comment for the line. Used by `setup`, `brief`, `decisions`, `package`, `showcase`;
  any skill with a natural checkpoint can adopt the same call.
