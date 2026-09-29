# Deliverables

Six outputs, always. Compressing for a format means fewer rows, never unrated rows — no format is
allowed to drop the **scores, the evidence, the confidence ratings, or the Validation Checklist.**

## The six outputs

### 1. UX Benchmark Scorecard
Every product × every dimension, scored 1–5, side by side, with a **per-product average** (down the
column) and a **per-dimension average** (across the row). Confidence colour on every cell. If
weighted, show raw and weighted averages. This is the at-a-glance answer to "where do we stand?"

### 2. Flow Teardown
Each key task compared across products, step by step: **number of steps, decision points, and
friction** per product. This is the evidence behind the Task-efficiency scores and the most useful
artefact for the design team.

### 3. Pattern Library
The notable UX / navigation / layout patterns each product uses, named and tagged **adopt / adapt /
avoid**, with the rationale that makes each tag actionable. Structure per `patterns.md`.

### 4. Strengths & Gaps
Per product: where it wins, where it leaves room. Plus the **market's weak spots** — the shared
blind spots that are your richest opportunity space.

### 5. Prioritised Opportunity List
The ranked moves for your product, by **impact · user value · confidence** (+ effort where known).
State explicitly that a `Not Verified` opportunity is a hypothesis for research, not a plan. Add a
one-line reading note: which are the pragmatic starting set (low effort, well evidenced) vs which
carry strategic weight but need real commitment.

### 6. Validation Checklist
Every score or claim that needs manual verification before it informs design (spec in
`evidence-and-verification.md`). This is a real deliverable, never an appendix nobody opens.

Also include a short **method & evidence-standard** section: define the three confidence ratings and
state the benchmark's limitations plainly. If it's desk research, put a visible **evidence warning**
on the cover / first frame.

## Choosing the format — this release

**Available now:** `.docx` and `.xlsx` only.

| Format | Best when | Build with |
|---|---|---|
| **Spreadsheet** (`.xlsx`) | The scorecard is the star — sortable, filterable, per-product & per-dimension averages computed live | `xlsx` skill |
| **Document** (`.docx`) | Stakeholder circulation, the record of what was found, full teardown + every source | `docx` skill |

**Research the facts first, then read the output-format skill.** Never open a format SKILL.md before
the scoring is done — it anchors you on mechanics before you have anything correct to put in them.

## Spreadsheet build notes (`.xlsx`) — usually the primary artefact

- One sheet: Scorecard (products × dimensions), with `AVERAGE` formulas for both axes.
- Conditional formatting for the confidence colours (green `D6E9D6` / amber `FCEFCC` / red `F6D8D6`),
  and optionally a colour scale on the 1–5 scores.
- Separate tabs: Flow Teardown, Pattern Library, Opportunities, Sources, Validation Checklist.
- Freeze the header row and the product-name column so the matrix stays readable when scrolled.

## Document build notes (`.docx`)

- Narrative sections portrait; the wide scorecard landscape (`orientation` goes **inside** `size`).
- `cantSplit: true` on table rows so rows don't break across pages.
- Set `columnWidths` on the table **and** `width` on every cell, both in DXA.
- `ShadingType.CLEAR`, never `SOLID`.
- Render to PDF and read the pages back before delivering.

## Deferred formats — documented, not available this release

Figma/FigJam and presentation build-notes are kept here for when Figma scope is revisited:

**Figma / FigJam build notes**
- Load `/figma-use` before every `use_figma` call. Add `/figma-use-figjam` for FigJam,
  `/figma-use-slides` for Slides.
- FigJam suits this well: one section per dimension (or per task), one sticky per finding,
  colour-coded by confidence. The red clusters become visually obvious — that's the point.
- Put opportunities on a 2×2 of impact against effort, confidence as sticky colour.
- Include a legend frame (the three confidence colours) and a standalone evidence-warning frame.
- Keep the source register on the board. Screenshot the result and look at it before delivering.

**Presentation build notes**
- Lead with the evidence-warning slide, not the findings.
- Split the scorecard across slides by dimension group; never shrink type to force it onto one.
- Confidence stays a visible colour-coded column, not a footnote.
- Keep the Validation Checklist as a real slide. Speaker notes carry the evidence detail.
