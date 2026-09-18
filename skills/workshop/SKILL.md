---
name: workshop
description: >-
  Two modes for design-thinking workshops. Plan mode (default) selects activities based on project phase, goals, timing, and participants, produces a written agenda, and optionally builds a FigJam board and/or slide deck from it — for before a workshop happens. Ingest mode converts photos of a workshop's whiteboards, sticky notes, affinity maps, or risk matrices into a structured digital artifact (deck, doc, CSV, or replicated FigJam board) — for after it happened. Use when the user wants to plan or run a design workshop, team offsite, or facilitated working session, or has photos of a workshop board and wants a clean digital record of it.
---

# Design Workshop

Two modes bracket the same workshop from opposite sides of the same table — the plan going in, the board coming out:
- **`plan`** (default) — before the workshop. Builds an agenda from a vendored catalog of real design-thinking activities (see [`references/activity-catalog.md`](references/activity-catalog.md)), then optionally turns that agenda into a FigJam board and/or a slide deck.
- **`ingest`** — after the workshop. Turns photos of the physical board the workshop actually produced into a structured, shareable artifact, preserving what was written rather than paraphrasing it.

Both modes can produce the same two output shapes — a FigJam board, a slide deck — for the same underlying event, just built from opposite ends: `plan` generates a board/deck to run the workshop with, `ingest` generates one from what the workshop actually left behind.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Mode: plan

Positioned as a **Discover/Decide-phase tool** — most workshops happen early, framing the problem before building starts. But a single workshop can legitimately dig end-to-end into one concept or feature, touching Design/Deliver-flavored activities too. The catalog's phase tags are a default starting filter, not a hard restriction.

### Step 1: Establish the workshop parameters

Ask (or infer from existing project docs where possible; don't re-ask what's already known):
- **Project phase**: where is this project right now? (ties to `docs/PERSONA_WALKTHROUGH.md` / `docs/OOUX_OBJECT_MAP.md` existing or not; mirrors the phase-detection logic in [`interview`](../interview/SKILL.md))
- **Goal**: what does this specific workshop need to produce? (e.g. "align stakeholders on scope," "generate feature concepts," "surface and prioritize risks")
- **Timing**: total session length available. This directly constrains how many activities fit.
- **Participants**: who's in the room, and their roles. Affects which activities make sense (e.g. `Stakeholder Map` needs a cross-functional group; `Storyboarding` works with a small design-focused group).

### Step 2: Select activities

Filter the catalog by phase relevance to the stated goal, then narrow further:
- Total activity time must fit the available session time, with room for a break every ~90 minutes and buffer for setup/wrap-up (~15% overhead on top of activity time).
- Sequence activities in a sensible arc: diverge before converge (e.g. `Hopes & Fears` or `Stakeholder Map` before `Prioritization Grid`), ending on something that produces a concrete artifact or next step (`Feedback Grid`, `ROAM Risks`, `Desired Outcomes`) rather than mid-divergence.
- If the goal calls for an activity not in the catalog, say so explicitly rather than force-fitting the closest entry — the catalog is a strong starting set, not exhaustive.

### Step 3: Write the agenda (required output)

```markdown
# Workshop Agenda — [Project Name]

**Goal**: [stated goal]
**Duration**: [total time] · **Participants**: [roles/count]

| Time | Activity | Purpose |
|---|---|---|
| 0:00-0:15 | Intros | [why this activity, tied to the goal] |
| 0:15-0:45 | Stakeholder Map | ... |
| ... | ... | ... |

## Materials Needed
[FigJam board / physical stickies / whiteboard — whatever the format requires]
```

Review this with the user before building anything else — a bad activity match is cheap to fix here, expensive to fix after a FigJam board is already built.

### Step 4 (optional): Build the FigJam board

Only after the agenda is approved. Requires the Figma MCP server connected; follow its `/figma-use` guidance before any write. Create a new FigJam file (or a new page in an existing one) with one section per agenda activity, using the catalog's real instructions text and timing as the section content. Don't paraphrase the instructions, they're already vetted.

### Step 5 (optional): Build a slide deck of the plan

Hand off to [`showcase`](../showcase/SKILL.md) rather than building a second deck generator. The agenda's activity list maps directly onto that skill's slide-per-scene structure (one slide per activity: name, time, purpose).

**Completion criterion:** the agenda's total activity time fits the stated session length including overhead, every activity ties back to the stated goal, and nothing is built (FigJam board or deck) before the agenda itself is approved.

## Mode: ingest

### Step 1: Inspect the photos

Accept one or more JPG, PNG, or HEIC images. For each photo:
- Detect major sections, headings, and swimlanes (e.g. "Hopes" vs. "Fears," a risk matrix's axes, affinity clusters).
- Transcribe every sticky note and handwritten label as written.
- Mark anything genuinely unreadable as `[unclear]` rather than guessing at it; see Extraction Rules below.

If [`scripts/script.sh`](scripts/script.sh) is handy, run it to set up `input/`/`output/` folders before dropping photos in — it's a directory scaffold, not the transcription step; only Claude can do that by actually looking at the images.

### Step 2: Group and structure

- Cluster notes by theme, preserving the board's own groupings where visible (don't invent categories the board didn't have).
- Keep hopes/fears, risks/mitigations, or other paired structures separate; don't merge them into one undifferentiated list.
- Consolidate literal duplicates, but keep near-duplicates that reflect distinct opinions.
- Count notes per theme; this becomes useful signal in the summary (e.g. "Onboarding friction: 6 notes").
- If a FigJam replica is a possible output (see Step 3), also note each sticky's approximate position (which cluster/section, roughly where within it) and color as seen in the photo. Discarded for the other formats, but it's what makes a FigJam replica read as a faithful copy rather than a generic re-layout.

### Step 3: Choose the output format

Ask if not specified; don't guess based on a hunch:
- **PowerPoint (PPTX)**: for presenting findings back to the workshop's participants or stakeholders.
- **Word / Markdown summary**: for a written record that gets read, not presented.
- **CSV**: for feeding the raw notes into another tool (spreadsheet, backlog, affinity-mapping software).
- **Executive summary**: a short prose synthesis, when the ask is "what did we learn," not "show me every sticky note."
- **FigJam board**: a live, editable replica of the physical board, for a team that wants to keep working on it digitally rather than just read a record of it. Requires the Figma MCP server connected (`mcp__claude_ai_Figma__*` tools); if unavailable, say so and fall back to another format rather than silently skipping the option.

More than one can be produced from the same extracted structure if the user wants both a deck and a raw export.

### Step 4: Generate the deliverable

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
- Group stickies into sections/frames matching the photo's clusters, laid out in roughly the same relative arrangement (left-to-right, top-to-bottom groupings) rather than a generic grid — the point is recognizability against the original board, not just data preservation.
- Recreate section headers, matrix axes, or swimlane dividers as FigJam section/frame labels, not just implied by grouping.
- Render `[unclear]` notes as-is rather than guessing at content to make the board look cleaner.

### Extraction Rules

- Preserve original wording where legible; don't clean up phrasing or "improve" what was written.
- Mark uncertain text with `[unclear]`; never invent missing or illegible content to fill a gap.
- Consolidate exact duplicates only.
- Keep hopes/fears (or equivalent paired structures) visually and structurally separate throughout.

**Completion criterion:** every note in the output traces back to a real, transcribed note in a photo, with no invented themes or filler content; the output format matches what the user actually asked for, not a default guessed on their behalf; and, for a FigJam replica specifically, the board's layout and colors visibly echo the original photo rather than a generic re-sort.
