---
name: showcase
description: >-
  Build a shareable presentation from a prototype: either a static PowerPoint deck (a day-in-the-life narrative — title, problem-with-numbers, one time-stamped scene per slide with a real 16:10 screenshot beside 1-3 sentences of story, closing with the ask — generated from a deck.json by the bundled pptxgenjs builder, with a Playwright overflow check before the file is written) or a reveal.js web-based deck. Narrative sourced from persona's scenes, screenshots captured from the running prototype at the exact state each slide describes. Use when the user wants to present the prototype to stakeholders, walk them through a day in the life, share a feature overview, or build a demo deck.
---

# Feature Showcase

Builds a presentation *about* a prototype, not a UI pattern to scaffold within one. Two output modes share the same underlying work (deciding what to show, pulling narrative, sequencing scenes); only the final render step differs.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Environment
- **Needs:** a file system, a shell, Node.js, and browser tooling such as Playwright for real screenshots.
- **If it isn't available:** No shell or Node.js here: stop and tell the user to run this skill in an environment that has them, such as Claude Code. Do not simulate install or build output. No browser tooling: say so and ask for screenshots instead of inventing them.

## Step 1: Choose the output mode

- **Static deck (PowerPoint)**: for email, offline sharing, or a stakeholder who wants to flip through it themselves. Export to PDF from PowerPoint if a PDF is what's wanted.
- **reveal.js web deck**: for a live-presented, in-browser deck with real transitions. Appropriate when the presenter is driving it live or wants a shareable link rather than a file.

Ask if not specified; don't guess.

## Step 2: Source the narrative

Pull scenes directly from [`persona`](../persona/SKILL.md)'s existing walkthrough (`docs/PERSONA_WALKTHROUGH.md`) if it exists — its scene format (title, screenshot, narrative, "what's on screen" bullets) maps almost directly onto a slide, and its Day in the Life gives each scene a clock time. Only ask the user for new copy on features/scenes the walkthrough doesn't cover; don't rewrite narrative that's already written.

Before capturing anything, write the outline with [`templates/deck-outline-template.md`](templates/deck-outline-template.md) and confirm it with the user: protagonist and date, the problem in one breath, the ordered scenes with a time of day each, the closing ask. Shape it as a **story with a clock**, not a feature tour: one protagonist, one morning (or one shift, one case), scenes in the order they'd actually happen, and a closing that counts what got done. 12-18 scenes is the sweet spot; beyond that, split into acts or cut.

**Completion criterion:** the outline names a protagonist, a date, a time for every scene, and every scene traces to a persona scene or user-supplied copy.

## Step 3: Capture screenshots

If real browser tooling is available (Playwright is the default; the built-in browser or Claude in Chrome work for one-offs), capture from the running prototype. If not, tell the user explicitly and ask them to supply screenshots. Don't fabricate placeholder imagery and present it as real UI.

For the static deck, copy [`templates/capture-template.js`](templates/capture-template.js) into the scratchpad and script the whole run:

- **1600×1000 viewport at 2× device scale.** That's a 16:10 frame, the exact aspect of the deck's image slot, so screenshots land uncropped and unletterboxed. Don't change it without changing `build-deck.js` too.
- **One PNG per scene, `NN_slug.png`, in story order**, into `<docs>/showcase_screenshots/` so the deck's sources ship with the docs.
- **Drive to the state the slide describes**, not just the route: open the modal, expand the row, select the item, scroll the relevant panel into frame. A slide whose copy mentions something not visible in its screenshot is a bug, and the most common one. When a state won't reproduce headlessly, fix the capture (a different selector, a longer wait, a targeted follow-up script for that one shot) rather than softening the copy to match a weaker screenshot.
- **Auto-accept dialogs** and screenshot `ERROR_state.png` on failure so a broken step is diagnosable.
- Review every capture before writing copy. Blur, empty states, stale seed data, and a cursor left over a tooltip all read as sloppiness at 7.9 inches wide.

**Completion criterion:** every scene in the outline has a reviewed screenshot showing exactly the state its copy will describe.

## Step 4: Assemble

### Static deck (PowerPoint)

The deck is data plus a fixed builder, so the quality is in the copy and the screenshots, not in re-inventing layout each time.

1. **Write `deck.json`** from the outline, using [`templates/deck-template.json`](templates/deck-template.json) as the shape. The structure is fixed: title → problem (headline, two sentences, up to three big numbers) → one slide per scene → closing (what got done, three beats, the ask). Per scene: `time`, `image`, `headline`, `body`, optional `quote`, optional `notes`. Alternate `imageSide` right/left (the builder does this by default). Copy rules that keep it fitting and reading like a story:
   - **Headline** 3-7 words, ≤ 45 characters: what this moment *demonstrates* ("Friction where it belongs"), not what the screen is called ("Confirmation modal").
   - **Body** 1-3 sentences, ≤ 280 characters, in the protagonist's terms: what's on screen and why it matters to her right now. No feature lists, no "users can…".
   - **Quote** only when the UI has real text worth lifting — an agent's reasoning, a system verdict — quoted verbatim from the screenshot, ≤ 200 characters. At most one per slide, and not on every slide.
   - **Numbers** on the problem and closing slides must be the numbers visible in the screenshots. Don't round for effect.
2. **Theme.** If the project has a `DESIGN.md` / `index.css` raw palette, set `theme` from it (a dark brand color for the title/problem/closing slides, one accent for time chips and stats). Otherwise drop the block and take the neutral default.
3. **Install and preview.** In the scratchpad: `npm i pptxgenjs playwright` (Chromium via `npx playwright install chromium` if it's not already there), then

   ```bash
   node <skill>/scripts/render-preview.js deck.json <docs>/showcase_screenshots ./render
   ```

   It renders every scene slide as HTML at the builder's exact geometry, writes a PNG per slide, and exits non-zero listing any headline/body/quote that overflows its box. Shorten the copy and re-run until it reports `no overflow`. Look at the PNGs: this is where a screenshot that doesn't match its copy gets caught.
4. **Build.**

   ```bash
   node <skill>/scripts/build-deck.js deck.json <docs>/showcase_screenshots <docs>/<Project>-Showcase.pptx
   ```

   Open the result (`open <file>`) and page through it once before handing it over.

Keep `deck.json` and the capture script alongside the screenshots in the docs folder so the deck can be regenerated after the prototype changes — re-capture, rebuild, done.

### reveal.js web deck
Use [`templates/reveal-template.html`](templates/reveal-template.html) as the starting structure: one `<section>` per scene, screenshots as background or inline images, minimal transition config (`slide` is safer than heavy 3D transitions for a professional audience). This produces a single self-contained HTML file, with no build step and no server required to view it.

## Step 5: Review before sharing

Walk through the assembled deck end-to-end. Check: does the narrative order make sense as a sequence with a clock (not just per scene), does every screenshot show the state its copy describes, do the problem-slide and closing-slide numbers match what's on screen, and is the closing slide's ask/next-step clear.

**Completion criterion:** every slide's narrative traces back to a real `persona` scene or explicit user-supplied copy, with no invented feature descriptions, and every screenshot is real (captured or user-supplied), never a placeholder presented as real UI.
