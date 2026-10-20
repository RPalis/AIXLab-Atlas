# Competitors: benchmark mode

Part of the [`competitors`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

A scored, rubric-based comparison of how 3-5 products solve the same tasks: **yours plus competitors and best-in-class references**, any of which can come from outside this market (the best checkout flow anywhere is a valid reference for yours). Every product is scored 1-5 on every dimension, with evidence and a confidence rating. This is a **summative** measurement of the current state of each experience, not an exploration of what to build. Run it before information architecture (`map`'s `ia` mode), user flows, wireframing, a brainstorm, or setting your own UX standards: it shows where you stand and which patterns to adopt, adapt, or beat.

Role while running it: a senior UX researcher and lead product designer. Measure objectively against a fixed rubric. Don't guess, and don't inflate.

## Contents

  - The evidence rule for this mode
  - The six phases (gated, run in order)
  - Phase 1: Define scope and tasks (gate: don't skip)
  - Phase 2: Choose the rubric
  - Phase 3: Walk each product's flows
  - Phase 4: Score each dimension
  - Phase 5: Extract patterns and gaps
  - Phase 6: Rank opportunities
  - Deliverables
  - Human review before this informs design

### The evidence rule for this mode

**Score only what you can observe. Never invent a feature, flow, screen or price.**

- Every score needs evidence: a specific screen, step or observation. No evidence, no score.
- Anything you can't verify directly is labelled **NOT VERIFIED**. Don't guess it into a number.
- Apply the **same scale to every product**: a "5" means the same bar everywhere.
- Separate what you **OBSERVED** from what you **INFERRED**. Never present inference as fact.
- A search that finds nothing produces `NOT VERIFIED — searched [where], nothing found. This does not establish absence.` Never write "no product does X".
- Vendor claims about their own product stay labelled as vendor claims.

The full evidence ladder, the OBSERVED/INFERRED discipline, the review pass and the validation checklist are in [`references/benchmark/evidence-and-verification.md`](benchmark/evidence-and-verification.md). Read it before scoring.

### The six phases (gated, run in order)

Each phase feeds the next. **Do not compare until Phase 3. Do not score until Phase 4. Do not rank until Phase 6.** Staging the work makes it harder to reach a conclusion first and gather evidence toward it afterwards.

1. **Define scope and tasks.** Lock products, tasks, persona, rubric.
2. **Choose the rubric.** Default 10 dimensions or a tailored set, with 1-5 anchors agreed.
3. **Walk each product's flows.** Task by task, end to end: steps, decision points, friction.
4. **Score each dimension.** 1-5 per product with rationale, evidence, pattern, verdict.
5. **Extract patterns and gaps.** Table stakes, outliers, where the market is weak.
6. **Rank opportunities.** By impact, user value, and confidence.

Then produce the six deliverables and run the human-review gate.

### Phase 1: Define scope and tasks (gate: don't skip)

Ask up to five questions about whatever is missing, and don't start until scope, products and rubric are clear. If a task isn't comparable across all products, say so before scoring. The question bank is in [`references/benchmark/calibration-questions.md`](benchmark/calibration-questions.md). The essentials:

| Input | Needed for |
|---|---|
| **3-5 products** with URLs, app links or screenshots, each labelled yours / competitor / best-in-class | The comparison set |
| **5-10 key tasks or flows** (onboarding, checkout, search…) | The comparable spine of the benchmark |
| **Persona and a definition of "good"** | What a "5" is *for this user*. Pull from a `persona` `card` output if one exists. |
| **Rubric**, default 10 or tailored | The scoring dimensions ([`references/benchmark/rubric.md`](benchmark/rubric.md)) |
| **Evidence reach**: hands-on, desk research, or supplied screenshots | Sets the confidence ceiling for the whole benchmark |

Optional: a prior `analysis` doc, screen recordings, an existing design system or UX standards, analytics or prior research, an accessibility target (e.g. WCAG 2.2 AA).

**Autonomous mode** (suite `AGENTS.md` §2.9): evidence reach defaults to desk research (the lowest ceiling, so nothing is overclaimed). Draw products from `docs/COMPETITIVE_ANALYSIS.md` and tasks from `docs/PRODUCT_BRIEF.md`'s core tasks. If neither exists, products and tasks can't be invented: skip, log tier 3 (`../../../tools/log-unknown/log-unknown.sh --skill competitors --tier 3 "..."`), and stop.

**Completion criterion:** products, tasks, persona and rubric are named, and every task is confirmed comparable across all products.

### Phase 2: Choose the rubric

Use the default 10 dimensions or tailor them. [`references/benchmark/rubric.md`](benchmark/rubric.md) carries all ten with 1-5 behavioural anchors, so "the same 5 means the same bar" is enforceable. Drop dimensions the product doesn't need and say why. For an enterprise or captive-audience tool, add the CASTLE lens from [`references/benchmark/metrics.md`](benchmark/metrics.md). Agree the rubric with the user before walking any flows.

### Phase 3: Walk each product's flows

For each product, walk each key task end to end. Record the number of steps, the decision points, and the friction. This is the raw material for both the score and the Flow Teardown.

Respect walkthrough limits: no payment, no account creation with real details, no scraping. A screen you can't reach is a reportable `NOT VERIFIED — [reason]`, never a guess.

### Phase 4: Score each dimension

Score every dimension 1-5 for every product, recording four things for each:

| Field | Content |
|---|---|
| **Score and one-line rationale** | Anchored to the rubric; the same bar across products |
| **Evidence** | The exact screen, step or observation the score rests on |
| **Pattern** | The specific UX, navigation or layout pattern, tagged **adopt / adapt / avoid** |
| **Verdict** | A **strength**, or a **gap = your opportunity** |

Pattern naming and tagging rules are in [`references/benchmark/patterns.md`](benchmark/patterns.md). Where hard metrics exist (task success rate, time-on-task, SEQ, SUS), anchor the score in them via [`references/benchmark/metrics.md`](benchmark/metrics.md) instead of impression alone.

Then run the review pass from the evidence reference: flag any score without evidence, any unverified feature, price or claim, any dimension scored on a different bar, any non-comparable task. Rewrite or downgrade whatever you flag.

### Phase 5: Extract patterns and gaps

1. **Table stakes**: patterns every product shares. The cost of entry, not an advantage.
2. **Outliers**: the one product doing something different, and why (usually business model).
3. **Where the market is weak**: the shared blind spot, usually the richest opportunity.
4. **Per-product strengths and gaps.**

### Phase 6: Rank opportunities

Rank moves for the user's product by impact · user value · confidence, adding implementation effort where known. Present a prioritised table. Confidence means strength of evidence behind the opportunity: a `Not Verified` opportunity is a hypothesis for research, not a plan, so say so under the table.

### Deliverables

Produce all six (specs and format in [`references/benchmark/deliverables.md`](benchmark/deliverables.md)): the Scorecard, the Flow Teardown, the Pattern Library, Strengths and Gaps, the Prioritised Opportunity List, and the Validation Checklist. Written to `docs/UX_BENCHMARK.md` plus `docs/ux-benchmark-scorecard.csv`.

Build a plan first and share it for approval, save the working analysis as Markdown you can iterate on, and execute only after approval. Benchmarking is a program, not a one-off: structure it so the same tasks and the same bar can be re-run next quarter.

### Human review before this informs design

- Verify every score against the actual product. A score without evidence is an opinion.
- Remove anything marked Not Verified (features, pricing, claims).
- Check the rubric was applied consistently.
- Confirm the tasks are comparable, not cherry-picked screens.
- Treat the output as a first draft, not final research.

**Completion criterion:** the scorecard has a 1-5 score, evidence, pattern and verdict for every product × dimension (or an explicit NOT VERIFIED), every opportunity carries a confidence rating, and the Validation Checklist exists.
