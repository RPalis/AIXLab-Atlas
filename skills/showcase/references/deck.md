# Showcase: deck mode

Part of the [`showcase`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

A condensed presentation of a report, for a live audience that has to reach a decision. A 300-line analysis can't go on slides as-is, so this mode condenses with judgment, and you approve what gets cut before anything is built.

### Step 1: Read the source and the audience

If the input is an ADR folder or several ADR files, join them first: `../../../tools/adr-bundle/adr-bundle.sh <folder-or-files> > <docs>/exports/decisions-source.md`. Use that file as the source, with the `decisions` recipe in [`references/report-deck-recipes.md`](report-deck-recipes.md).

Read the whole Markdown file, and pre-flight it the same way as `doc` mode's Step 1. Ask, only if not already clear: who is the audience, and what decision should the deck help them reach? That decides which findings lead. **Autonomous mode:** assume a stakeholder readout and log it.

### Step 2: Draft the slide outline and confirm it

Write the outline to `<docs>/exports/<name>-deck-outline.md`: one line per slide (type, headline, what it carries from the source), then a **Left out** list of anything from the source that didn't make it, so the cuts are visible rather than silent. Follow the rules below, and the per-artifact recipes in [`references/report-deck-recipes.md`](report-deck-recipes.md).

- **Nothing is added.** Every slide's content comes from the Markdown. Numbers are verbatim. No new finding, score, or recommendation.
- **Evidence travels with the claim.** A condensed finding keeps its confidence tag and its source reference (an interview number, a source `[n]`). Shortening a finding never drops its rating, and a `Not Verified` item stays labelled as one.
- **Lead with the warning.** If the source carries an evidence warning (desk research, unverified claims), it is the first content slide, as a `callout` with `tone: warning`, not a footnote.
- **A headline states the claim**, not the topic ("Re-keying costs adjusters four entries per claim", not "Re-keying").
- **Tables stay tables.** A scorecard or comparison matrix becomes `table` slides, split by category when it has more than eight rows. Never shrink type to force it onto one slide.
- **The verification checklist stays a real slide**, never dropped to save space.
- Keep the long evidence (full quotes lists, source registers) in speaker notes rather than deleting it.

Confirm the outline with the user before building. **Autonomous mode** (suite `AGENTS.md` §2.9, tier 2): build from the outline anyway, taking the most conservative reading (more slides, fewer cuts), and log the **Left out** list and that the outline wasn't confirmed as an assumption (`../../../tools/log-unknown/log-unknown.sh --skill showcase --tier 2 "..."`).

### Step 3: Write `deck.json` and build

Write `deck.json` from [`templates/report-deck-template.json`](../templates/report-deck-template.json): `title`, `subtitle`, `tag`, `footer`, an optional `theme` (same keys as `doc` mode's, taken from `DESIGN.md` when there is one), and `slides`, each with a `type`: `callout`, `bullets`, `table`, `quote`, `checklist`, or `section`. Then:

```bash
npm i pptxgenjs       # once, in the scratchpad
node ../../../tools/pptx-deck-builder/build-deck.js deck.json . <docs>/exports/<name>.pptx
```

The builder checks every slide against fixed fit limits (bullets per slide, characters per bullet, table rows and columns, cell length) before writing anything, and exits listing each slide that doesn't fit by index. Shorten or split the slide and re-run until it builds. (`render-preview.js` only covers `story` slides, so for a `deck` open the file and page through it.)

### Step 4: Review

Page through the deck. Check: the evidence warning leads, every table cell's confidence color shows, no claim lost its tag or source, the checklist slide is there, and the **Left out** list matches what you'd expect to be missing. Keep `deck.json` and the outline next to the output so the deck can be rebuilt after the Markdown changes.

**Completion criterion:** every slide traces to a passage in the Markdown, confidence tags and source references survive on every claim that had them, and the outline's Left out list is accurate.
