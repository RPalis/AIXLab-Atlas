---
name: digitize
description: Convert photos of workshop whiteboards, sticky notes, affinity maps, or risk matrices into a structured digital artifact: PowerPoint deck, Word doc, Markdown summary, CSV, or a replicated FigJam board. Use when the user has photos of a workshop board (retro, brainstorm, hopes/fears, prioritization matrix) and wants a clean digital record of it.
disable-model-invocation: true
---

# Workshop Photo Digitizer

Turns photos of a physical workshop board into a structured, shareable artifact, preserving what was actually written, not a paraphrase of it.

## Step 1: Inspect the photos

Accept one or more JPG, PNG, or HEIC images. For each photo:
- Detect major sections, headings, and swimlanes (e.g. "Hopes" vs. "Fears," a risk matrix's axes, affinity clusters).
- Transcribe every sticky note and handwritten label as written.
- Mark anything genuinely unreadable as `[unclear]` rather than guessing at it; see Extraction Rules below.

If [`scripts/script.sh`](scripts/script.sh) is handy, run it to set up `input/`/`output/` folders before dropping photos in; it's a directory scaffold, not the transcription step. That part only Claude can do by actually looking at the images.

## Step 2: Group and structure

- Cluster notes by theme, preserving the board's own groupings where visible (don't invent categories the board didn't have).
- Keep hopes/fears, risks/mitigations, or other paired structures separate; don't merge them into one undifferentiated list.
- Consolidate literal duplicates, but keep near-duplicates that reflect distinct opinions.
- Count notes per theme; this becomes useful signal in the summary (e.g. "Onboarding friction: 6 notes").
- If a FigJam replica is a possible output (see Step 3), also note each sticky's approximate position (which cluster/section, roughly where within it) and color as seen in the photo. This is discarded for the other formats but is exactly what makes a FigJam replica read as a faithful copy rather than a generic re-layout.

## Step 3: Choose the output format

Ask if not specified; don't guess based on a hunch:
- **PowerPoint (PPTX)**: for presenting findings back to the workshop's participants or stakeholders.
- **Word / Markdown summary**: for a written record that gets read, not presented.
- **CSV**: for feeding the raw notes into another tool (spreadsheet, backlog, affinity-mapping software).
- **Executive summary**: a short prose synthesis, when the ask is "what did we learn," not "show me every sticky note."
- **FigJam board**: a live, editable replica of the physical board, for a team that wants to keep working on it digitally rather than just read a record of it. Requires the Figma MCP server connected (`mcp__claude_ai_Figma__*` tools); if it isn't available, say so and fall back to one of the other formats rather than silently skipping the option.

More than one can be produced from the same extracted structure if the user wants both a deck and a raw export.

## Step 4: Generate the deliverable

Whatever the format, build it from the same structured extraction; don't re-derive content per format.

**PPTX:**
- Slide 1, Workshop Summary: date (if known), purpose, list of themes.
- Slide 2+: one slide per theme, theme title, consolidated notes, note count.
- Optional closing slides: risk matrix recreation, affinity diagram, action items, decision log. Include only the ones the board actually produced.

**Word / Markdown:** same section structure as the deck (summary, then one section per theme), as flowing prose/lists rather than slides.

**CSV:** one row per note, columns for theme, note text, and `[unclear]` flag.

**Executive summary:** a short synthesis (what came up, what mattered most, any decisions or actions), themes named but not exhaustively listed note-by-note.

**FigJam board:** follow the connected Figma MCP's `/figma-use` guidance before any write. Create a new FigJam file (or a new page in an existing one) and replicate the board as closely as the photos allow:
- One sticky note per transcribed note, in the note's own color where distinguishable in the photo (don't default everything to yellow).
- Group stickies into sections/frames matching the photo's clusters, laid out in roughly the same relative arrangement (left-to-right, top-to-bottom groupings) rather than a generic grid. The point is recognizability against the original board, not just data preservation.
- Recreate section headers, matrix axes, or swimlane dividers as FigJam section/frame labels, not just implied by grouping.
- Render `[unclear]` notes as-is on their sticky rather than guessing at the content to make the board look cleaner.

## Extraction Rules

- Preserve original wording where legible; don't clean up phrasing or "improve" what was written.
- Mark uncertain text with `[unclear]`; never invent missing or illegible content to fill a gap.
- Consolidate exact duplicates only.
- Keep hopes/fears (or equivalent paired structures) visually and structurally separate throughout.

**Completion criterion:** every note in the output traces back to a real, transcribed note in a photo, with no invented themes or filler content; the output format matches what the user actually asked for, not a default guessed on their behalf; and, for a FigJam replica specifically, the board's layout and colors visibly echo the original photo rather than a generic re-sort.
