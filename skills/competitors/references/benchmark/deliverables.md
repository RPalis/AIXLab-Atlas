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

## Format

The real deliverable is Markdown, the same as the rest of the suite, so it works with no extra
tooling:

| Output | File | Notes |
|---|---|---|
| **Report** (outputs 2-6, method note, evidence warning) | `docs/UX_BENCHMARK.md` | The full record. Every score carries its evidence and confidence rating. |
| **Scorecard** (output 1) | `docs/ux-benchmark-scorecard.csv` | Products × dimensions, 1-5, plus a confidence column per product and a computed per-product and per-dimension average row/column. Opens in Excel or Sheets for sorting and filtering. |

Also paste the scorecard into the report as a Markdown table, so the report stands alone.

**Optional slide version.** If a live audience needs to reach a decision, run
[`tools/markdown-to-pptx`](../../../../tools/markdown-to-pptx/md-to-deck.mjs) on the report. Lead with
the evidence-warning slide, not the findings. Split the scorecard across slides by dimension group;
never shrink type to force it onto one. Confidence stays a visible column, not a footnote. Keep the
Validation Checklist as a real slide. The conversion is best-effort; the Markdown stays the source of
truth.

Figma/FigJam output isn't covered by this mode.
