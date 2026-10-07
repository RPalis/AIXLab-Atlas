# Report deck recipes

How `deck` mode condenses each kind of report. The rules in `SKILL.md` always apply (nothing added, evidence travels with the claim, warning first, checklist kept, cuts listed). These recipes say what usually leads and what usually goes to speaker notes. Treat them as defaults: the audience and the decision they need to reach can reorder them.

Confidence colors in tables are automatic for these labels: Verified, Likely, Weak Signal, Inferred, Not Verified, Proposed, ASSUMPTION. Put the label alone in its cell.

## `competitors`: `analysis`

1. Evidence warning (`callout`, warning), if the doc has one.
2. Executive summary (`bullets`).
3. Comparison matrix, split by category (`table`, one slide per category; columns: Feature, Competitor, Our Product, Confidence).
4. Patterns every competitor shares vs where they differ (`bullets`).
5. Top opportunities (`table`: Opportunity, Impact, Effort, Confidence). Keep the line that a `Not Verified` opportunity is a hypothesis, not a plan.
6. Risks and open questions (`bullets`).
7. Verification checklist (`checklist`).
Speaker notes: the source register and per-row evidence.

## `competitors`: `benchmark`

1. Evidence warning (`callout`).
2. Scorecard overview (`table`: product × dimension group, scores as numbers; one slide per dimension group). Averages stay on the slide.
3. Where each product wins and the market's weak spots (`bullets`).
4. Flow teardown: one `table` slide per key task (steps, decision points, friction per product).
5. Pattern library (`table`: Pattern, Product, Adopt/Adapt/Avoid).
6. Ranked opportunities (`table`, confidence column kept).
7. Verification checklist (`checklist`).
Speaker notes: each score's evidence and rationale.

## `interview`: `analysis`

1. Evidence warning (`callout`): sample size and that findings are a first draft.
2. Executive summary (`bullets`, each with its `n of N`).
3. One slide per theme: headline is the theme as a claim, a `quote` slide for the strongest verbatim line with its interview number. A `WEAK SIGNAL` theme is shown as one, never promoted.
4. Themes overview (`table`: Theme, n of N, Confidence, So what).
5. Surprises and contradictions (`bullets`).
6. Pain points by severity (`table`).
7. Verification checklist (`checklist`).
Speaker notes: the evidence log, full quotes, and links to the raw files.

## `interview`: `usability`

1. Goals and participants (`bullets`).
2. Agenda with timings (`table`: Section, Minutes).
3. Task scenarios (`table`: Task, Success criterion, Follow-up; at most 8 rows per slide).
4. Metrics to collect (`bullets`).
5. Bias-review result and open items (`bullets`).
6. Human-review checklist, including that the researcher moderates (`checklist`).

## `map`: `ia`

1. Evidence warning if any node is `PROPOSED` or `Not Verified` (`callout`).
2. Executive summary and the structure's principles (`bullets`).
3. The sitemap, level by level (`table`: Section, Contains, Why it belongs there, Confidence). Split by top-level section.
4. Navigation labels with their rationale (`table`).
5. Risks and recommendations (`bullets`).
6. Validation checklist and the feedback-loop check result (`checklist`).

## `journey`: `experience`, `map`, `blueprint`

Lead with the emotion curve or the swimlane's headline finding as a `bullets` slide, one `table` per stage group (action, thought, emotion, pain point, opportunity), then opportunities and the checklist. A diagram in the source can't be rebuilt as a slide: embed it as an image in `doc` mode instead, or mention it and cut it here (and list it under Left out).

## Anything else

Executive summary first, one slide per major finding with its claim as the headline, tables for any matrix, the source's checklist last. If the source has no checklist, the final slide is the list of claims a stakeholder is most likely to challenge, taken from the source's own limitations section.
