---
name: showcase
description: >-
  Turn work into something shareable, in one of four modes. From a prototype: `story` builds a static PowerPoint day-in-the-life deck (title, problem-with-numbers, one time-stamped scene per slide with a real 16:10 screenshot beside 1-3 sentences of story, closing with the ask) from a deck.json by the bundled pptxgenjs builder with an overflow check, and `reveal` builds a reveal.js web deck. From a Markdown report, such as the output of competitors (analysis, benchmark), interview (analysis, usability), map's ia mode, journey's experience mode or any other suite artifact: `doc` converts it faithfully into a styled Word document (colored confidence cells, callouts, landscape pages for wide tables, theme from the project's DESIGN.md), and `deck` condenses it into a PowerPoint, with the user confirming the slide outline first, keeping confidence tags, sources and the verification checklist. Use when the user wants to present a prototype to stakeholders, or hand a stakeholder a polished Word document or slide deck of a research or analysis artifact (e.g. `/showcase interview-analysis.md`).
argument-hint: "[story: day-in-the-life deck | reveal: live web deck | doc: report to Word | deck: report to PowerPoint] or a .md file"
---

# Showcase

Packages work for people who weren't in the room. Two kinds of input, four modes:

- **From a prototype**: `story` (a static PowerPoint day-in-the-life deck with real screenshots) and `reveal` (a reveal.js web deck). Both build a presentation *about* the prototype, and share the same underlying work (deciding what to show, pulling narrative from `persona`'s scenes, sequencing scenes); only the final render step differs.
- **From a Markdown report**: `doc` (a faithful, styled Word document) and `deck` (a condensed PowerPoint). Give it the output of another skill, e.g. `/showcase interview-analysis.md`, and it makes the shareable version. The Markdown stays the source of truth: change it and re-run, and never edit the Word or PowerPoint file by hand.

**Not this skill:**
- Producing the analysis, benchmark, interview themes or any other content a report contains → the skill that owns it ([`competitors`](../competitors/SKILL.md), [`interview`](../interview/SKILL.md), [`map`](../map/SKILL.md) `ia`, [`journey`](../journey/SKILL.md)). `doc` and `deck` never add a finding, a score, or a claim that isn't in the Markdown.
- A mechanical heading-per-slide split of a short board summary → `workshop`'s `ingest` mode uses [`tools/markdown-to-pptx`](../../tools/markdown-to-pptx/md-to-deck.mjs) directly. `deck` mode is for reports too long and too evidence-heavy for that: it condenses with judgment and you approve the outline.
- A handoff bundle of the prototype itself (site, source, docs) → [`package`](../package/SKILL.md).
- Documentation that teaches someone to use the app → [`guide`](../guide/SKILL.md).

**Picking the mode.** A prototype to present means `story` or `reveal`. A `.md` path, or "put this analysis in a Word doc / deck", means `doc` or `deck`. Given just a `.md` file with no mode, ask Word or PowerPoint. Don't guess between `story` and `reveal` either: ask. **Autonomous mode** (suite `AGENTS.md` §2.9): a bare `.md` defaults to `doc` (a faithful conversion with nothing condensed or cut, the safer of the two); a prototype with no mode defaults to `story` — it needs no live presenter and opens anywhere. Log the default; the other mode is available on request. `reveal` is the better pick specifically when the deck is meant to be embedded inside the prototype itself (a shareable link or iframe, not a downloadable file).

**External dependencies**, stated up front: the `docx` npm package (`doc`), `pptxgenjs` (`deck`, `story`), and Playwright with Chromium (`story` screenshots and overflow check). Install into a scratch folder (`npm i docx pptxgenjs`) and run the tools from there.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Modes: `story` and `reveal` (from a prototype)

Pick the output with the mode, then follow the same four steps. `story` produces a static PowerPoint, for email, offline sharing, or a stakeholder who wants to flip through it themselves (export to PDF from PowerPoint if a PDF is wanted). `reveal` produces a web deck, for a live-presented, in-browser deck with real transitions, or a shareable link.

### Step 1: Source the narrative

Resolve the real docs folder with [`tools/find-docs-folder`](../../tools/find-docs-folder/find-docs-folder.sh) — `docs/` below is shorthand for whatever that resolves to. If this deck is meant as (or doubles as) a case study rather than a feature walkthrough, also pull `../../tools/log-milestone/log-milestone.sh --list --why-only` — the project's own narrative log surfaces the real turning points (decisions made, problems hit, why) in a way `PERSONA_WALKTHROUGH.md` alone doesn't, since that's a snapshot of the user's day, not the project's history. Pull scenes directly from [`persona`](../persona/SKILL.md)'s existing walkthrough (`docs/PERSONA_WALKTHROUGH.md`) if it exists — its scene format (title, screenshot, narrative, "what's on screen" bullets) maps almost directly onto a slide, and its Day in the Life gives each scene a clock time. Only ask the user for new copy on features/scenes the walkthrough doesn't cover; don't rewrite narrative that's already written. **Autonomous mode:** inventing narrative copy is tier 3 (§2.9) — never fabricate what a scene's story would say. Build the deck from what the walkthrough actually covers, skip features it doesn't, and log the gap to `docs/UNKNOWNS.md` rather than guessing at copy.

Before capturing anything, write the outline with [`templates/deck-outline-template.md`](templates/deck-outline-template.md) and confirm it with the user: protagonist and date, the problem in one breath, the ordered scenes with a time of day each, the closing ask. Shape it as a **story with a clock**, not a feature tour: one protagonist, one morning (or one shift, one case), scenes in the order they'd actually happen, and a closing that counts what got done. 12-18 scenes is the sweet spot; beyond that, split into acts or cut.

**Completion criterion:** the outline names a protagonist, a date, a time for every scene, and every scene traces to a persona scene or user-supplied copy.

### Step 2: Capture screenshots

If real browser tooling is available (Playwright is the default; the built-in browser or Claude in Chrome work for one-offs), capture from the running prototype. If not, tell the user explicitly and ask them to supply screenshots. Don't fabricate placeholder imagery and present it as real UI. **Autonomous mode:** a missing screenshot is tier 3 (§2.9), not a default-and-continue — never fabricate one. If tooling is genuinely unavailable, stop at the outline (Step 2's output), log to `docs/UNKNOWNS.md` that capture is blocked pending browser tooling or user-supplied images, and don't assemble a deck with placeholder imagery.

For the static deck, copy [`templates/capture-template.js`](templates/capture-template.js) into the scratchpad and script the whole run — a multi-scene loop with a different driven state per shot is more than [`tools/capture-screenshot`](../../tools/capture-screenshot/capture-screenshot.mjs)'s single-shot shape covers (that tool is a better fit for `competitors`, one screenshot per target with at most one extra click). Both share the same viewport convention:

- **1600×1000 viewport at 2× device scale.** That's a 16:10 frame, the exact aspect of the deck's image slot, so screenshots land uncropped and unletterboxed. Don't change it without changing `build-deck.js` too.
- **One PNG per scene, `NN_slug.png`, in story order**, into `<docs>/showcase_screenshots/` so the deck's sources ship with the docs.
- **Drive to the state the slide describes**, not just the route: open the modal, expand the row, select the item, scroll the relevant panel into frame. A slide whose copy mentions something not visible in its screenshot is a bug, and the most common one. When a state won't reproduce headlessly, fix the capture (a different selector, a longer wait, a targeted follow-up script for that one shot) rather than softening the copy to match a weaker screenshot.
- **Auto-accept dialogs** and screenshot `ERROR_state.png` on failure so a broken step is diagnosable.
- Review every capture before writing copy. Blur, empty states, stale seed data, and a cursor left over a tooltip all read as sloppiness at 7.9 inches wide.

**Completion criterion:** every scene in the outline has a reviewed screenshot showing exactly the state its copy will describe.

### Step 3: Assemble

#### Static deck (`story`)

The deck is data plus [`tools/pptx-deck-builder`](../../tools/pptx-deck-builder/build-deck.js), a fixed builder shared with `workshop`'s `ingest` mode, so the quality is in the copy and the screenshots, not in re-inventing layout each time.

1. **Write `deck.json`** from the outline, using [`templates/deck-template.json`](templates/deck-template.json) as the shape. The structure is fixed: title → problem (headline, two sentences, up to three big numbers) → one slide per scene → closing (what got done, three beats, the ask). Per scene: `time`, `image`, `headline`, `body`, optional `quote`, optional `notes`. Alternate `imageSide` right/left (the builder does this by default). Copy rules that keep it fitting and reading like a story:
   - **Headline** 3-7 words, ≤ 45 characters: what this moment *demonstrates* ("Friction where it belongs"), not what the screen is called ("Confirmation modal").
   - **Body** 1-3 sentences, ≤ 280 characters, in the protagonist's terms: what's on screen and why it matters to her right now. No feature lists, no "users can…".
   - **Quote** only when the UI has real text worth lifting — an agent's reasoning, a system verdict — quoted verbatim from the screenshot, ≤ 200 characters. At most one per slide, and not on every slide.
   - **Numbers** on the problem and closing slides must be the numbers visible in the screenshots. Don't round for effect.
2. **Theme.** If the project has a `DESIGN.md` / `index.css` raw palette, set `theme` from it (a dark brand color for the title/problem/closing slides, one accent for time chips and stats). Otherwise drop the block and take the neutral default.
3. **Install and preview.** In the scratchpad: `npm i pptxgenjs playwright` (Chromium via `npx playwright install chromium` if it's not already there), then

   ```bash
   node ../../tools/pptx-deck-builder/render-preview.js deck.json <docs>/showcase_screenshots ./render
   ```

   It renders every scene slide as HTML at the builder's exact geometry, writes a PNG per slide, and exits non-zero listing any headline/body/quote that overflows its box. Shorten the copy and re-run until it reports `no overflow`. Look at the PNGs: this is where a screenshot that doesn't match its copy gets caught.
4. **Build.**

   ```bash
   node ../../tools/pptx-deck-builder/build-deck.js deck.json <docs>/showcase_screenshots <docs>/<Project>-Showcase.pptx
   ```

   Open the result (`open <file>`) and page through it once before handing it over.

Keep `deck.json` and the capture script alongside the screenshots in the docs folder so the deck can be regenerated after the prototype changes — re-capture, rebuild, done.

#### reveal.js web deck (`reveal`)
Use [`templates/reveal-template.html`](templates/reveal-template.html) as the starting structure: one `<section>` per scene, screenshots as background or inline images, minimal transition config (`slide` is safer than heavy 3D transitions for a professional audience). This produces a single self-contained HTML file, with no build step and no server required to view it.

### Step 4: Review before sharing

Walk through the assembled deck end-to-end. Check: does the narrative order make sense as a sequence with a clock (not just per scene), does every screenshot show the state its copy describes, do the problem-slide and closing-slide numbers match what's on screen, and is the closing slide's ask/next-step clear.

**Completion criterion:** every slide's narrative traces back to a real `persona` scene or explicit user-supplied copy, with no invented feature descriptions, and every screenshot is real (captured or user-supplied), never a placeholder presented as real UI.

Log it: `../../tools/log-milestone/log-milestone.sh --skill showcase --event "<Project>-Showcase built (<pptx|reveal.js>)"`.

## Mode: `doc` (Markdown report → Word)

A faithful conversion: every heading, paragraph, list, table, quote, code block and image in the Markdown appears in the document, in order, with nothing condensed, reworded, or added. Use it when the reader needs the full record (a stakeholder circulating the evidence, a client deliverable, an audit trail).

### Step 1: Read the source and pre-flight it

Resolve the path (as given, or under the project's docs folder via [`tools/find-docs-folder`](../../tools/find-docs-folder/find-docs-folder.sh)). Read the whole file. Before converting, report anything in it that a reader would trip on, **without changing it**: unfilled template placeholders (`<...>`), unresolved ⚠️ flags, anything marked `Not Verified` or `ASSUMPTION`, a missing evidence warning on desk research. The conversion keeps all of it; a stakeholder reading a polished document will assume it was checked, so say what wasn't.

### Step 2: Theme

If the project has a `DESIGN.md` / `index.css` raw palette, write a small `theme.json` from it: `dark` (headings, table headers), `accent` (the rule under the title), `body`, `muted`, `canvas`, `font`, hex without `#`. Otherwise take the neutral default. Confidence labels (Verified, Likely, Weak Signal, Inferred, Not Verified, Proposed, ASSUMPTION) get fixed green/amber/red/blue tints regardless of theme, because the colors carry meaning.

### Step 3: Build

```bash
npm i docx            # once, in the scratchpad
node ../../tools/markdown-to-docx/md-to-docx.mjs <source.md> <docs>/exports/<name>.docx [--theme theme.json]
```

The first `# H1` becomes the cover title and a plain paragraph under it the subtitle; `##`–`####` become Heading 1–3. Tables of six or more columns get their own landscape pages, with the heading that introduces them kept alongside. A `>` quote starting "Evidence warning" or "Warning" becomes an amber callout. Local images embed at page width.

### Step 4: Review

Open the file and page through it. Check: wide tables are readable, every table's confidence cells carry their tint, the evidence warning and the verification checklist are present, images landed, and the headers and page numbers are right. Fix the Markdown (not the Word file) and re-run if anything is off.

**Completion criterion:** every block of the source appears in the document in order, confidence tags, interview numbers and source references are intact, and nothing was added.

## Mode: `deck` (Markdown report → PowerPoint)

A condensed presentation of a report, for a live audience that has to reach a decision. A 300-line analysis can't go on slides as-is, so this mode condenses with judgment, and you approve what gets cut before anything is built.

### Step 1: Read the source and the audience

Read the whole Markdown file, and pre-flight it the same way as `doc` mode's Step 1. Ask, only if not already clear: who is the audience, and what decision should the deck help them reach? That decides which findings lead. **Autonomous mode:** assume a stakeholder readout and log it.

### Step 2: Draft the slide outline and confirm it

Write the outline to `<docs>/exports/<name>-deck-outline.md`: one line per slide (type, headline, what it carries from the source), then a **Left out** list of anything from the source that didn't make it, so the cuts are visible rather than silent. Follow the rules below, and the per-artifact recipes in [`references/report-deck-recipes.md`](references/report-deck-recipes.md).

- **Nothing is added.** Every slide's content comes from the Markdown. Numbers are verbatim. No new finding, score, or recommendation.
- **Evidence travels with the claim.** A condensed finding keeps its confidence tag and its source reference (an interview number, a source `[n]`). Shortening a finding never drops its rating, and a `Not Verified` item stays labelled as one.
- **Lead with the warning.** If the source carries an evidence warning (desk research, unverified claims), it is the first content slide, as a `callout` with `tone: warning`, not a footnote.
- **A headline states the claim**, not the topic ("Re-keying costs adjusters four entries per claim", not "Re-keying").
- **Tables stay tables.** A scorecard or comparison matrix becomes `table` slides, split by category when it has more than eight rows. Never shrink type to force it onto one slide.
- **The verification checklist stays a real slide**, never dropped to save space.
- Keep the long evidence (full quotes lists, source registers) in speaker notes rather than deleting it.

Confirm the outline with the user before building. **Autonomous mode** (suite `AGENTS.md` §2.9, tier 2): build from the outline anyway, taking the most conservative reading (more slides, fewer cuts), and log the **Left out** list and that the outline wasn't confirmed as an assumption (`../../tools/log-unknown/log-unknown.sh --skill showcase --tier 2 "..."`).

### Step 3: Write `deck.json` and build

Write `deck.json` from [`templates/report-deck-template.json`](templates/report-deck-template.json): `title`, `subtitle`, `tag`, `footer`, an optional `theme` (same keys as `doc` mode's, taken from `DESIGN.md` when there is one), and `slides`, each with a `type`: `callout`, `bullets`, `table`, `quote`, `checklist`, or `section`. Then:

```bash
npm i pptxgenjs       # once, in the scratchpad
node ../../tools/pptx-deck-builder/build-deck.js deck.json . <docs>/exports/<name>.pptx
```

The builder checks every slide against fixed fit limits (bullets per slide, characters per bullet, table rows and columns, cell length) before writing anything, and exits listing each slide that doesn't fit by index. Shorten or split the slide and re-run until it builds. (`render-preview.js` only covers `story` slides, so for a `deck` open the file and page through it.)

### Step 4: Review

Page through the deck. Check: the evidence warning leads, every table cell's confidence color shows, no claim lost its tag or source, the checklist slide is there, and the **Left out** list matches what you'd expect to be missing. Keep `deck.json` and the outline next to the output so the deck can be rebuilt after the Markdown changes.

**Completion criterion:** every slide traces to a passage in the Markdown, confidence tags and source references survive on every claim that had them, and the outline's Left out list is accurate.
