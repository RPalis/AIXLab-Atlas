---
name: competitors
description: >-
  Researches competitors and best-in-class UX. Modes: discover (scan and profile the market), add
  (one more competitor), analysis (deeper, evidence-rated by UX category), benchmark (score products
  1-5 on one rubric). Use when you need to know who else is in the market or which UX patterns to
  adopt.
argument-hint: "[discover: scan the market | add: one more competitor | analysis: deeper by UX category | benchmark: score best-in-class UX]"
disable-model-invocation: true
---

# Competitive Analysis

Most stakeholders can name one or two competitors off the top of their head. `discover` exists for the rest of the market they don't know about yet, and for turning a name into an actual comparison: real features, a real workflow, real UX patterns, a real screenshot — not a guess at what a company with that name probably does. `analysis` goes deeper on how competitors solve one specific problem, category by category. `benchmark` widens the lens past direct competitors: it scores how the best products in any industry solve the same task, so the target is best-in-class, not just "better than the other guys in our market." The end deliverable is a curated report of the 3-5 experiences closest to what's being built, not an exhaustive market survey.

**Not this skill:**
- A quick, top-of-mind competitive mention during initial scoping → [`brief`](../brief/SKILL.md)'s own competitive-landscape question. That question still runs and still gets recorded; this skill supersedes it once it's run, going from "what the stakeholder happens to remember" to a real researched landscape. `brief`'s Step 4 hand-off points here once its own table is thin or the stakeholder said "I'm not sure who else is out there."
- Formalizing target *users* (mental models, day-in-the-life) → [`persona`](../persona/SKILL.md). This skill profiles other companies' products, not this product's own users — though a competitor's UX patterns are legitimate input to a persona's friction map or an ORCA session's CTA design.
- Deciding this product's own information architecture or object model → [`map`](../map/SKILL.md) (`objects` or `ia` mode). A competitor's workflow can inform that decision; this skill doesn't make it.

Say which mode if not specified. Running this for the first time on a project almost always means `discover`. A later "found one more" almost always means `add`. A request to go deeper on UX patterns, compare by category, or rate confidence on an existing analysis means `analysis`. A request to score, rank, or find the best way anyone solves a task, including products outside this market, means `benchmark`.

`analysis` and `benchmark` both end in a ranked opportunity list but differ in what they measure: `analysis` is a qualitative, per-category read of the competitors already identified, with no scores; `benchmark` puts a 1-5 number on every product for every rubric dimension, on tasks chosen to be comparable. They combine well: a prior `analysis` is a valid input to `benchmark`.

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## The evidence rule — shared across all modes

**Do not invent information. Never assume a feature exists.**

If something cannot be verified, say so explicitly rather than describing it as though seen. Every claim in `discover`, `add`, and `analysis` carries one of three ratings (`benchmark` uses its own stricter version, below):

- **Verified** — first-party documentation, official help centres, published pages, a real captured screenshot, or the stakeholder's own direct knowledge.
- **Likely** — credible third-party sources: design case studies, reputable reporting, app-store listings, marketing copy that describes rather than documents.
- **Not Verified** — nothing better than a guess. Say so and explain why, rather than rounding up. Absence of evidence in a web search is not evidence of absence; say that explicitly wherever a finding rests on one.

A vendor's claim about its own product (an accuracy percentage, "industry-first," a performance figure) is reported **as a vendor claim**, never restated as established fact. A short honest matrix beats a long confident one. If you catch yourself writing a plausible-sounding UI detail you haven't actually seen, stop and rate it Not Verified.

If no web research capability is available in the current environment, say so plainly and ask the stakeholder directly for names or facts they know, rather than inventing a plausible-sounding answer from general knowledge. A fabricated competitor or feature is worse than a short, honestly incomplete one.

## Modes

Open the reference file for the chosen mode and follow it. Load only that file. Cross-references between modes name the mode, so open that mode's file when one is named.

| Mode | What it does | File |
|---|---|---|
| `discover` | scan the market | [references/discover.md](references/discover.md) |
| `add` | one more competitor | [references/add.md](references/add.md) |
| `analysis` | deeper by UX category | [references/analysis.md](references/analysis.md) |
| `benchmark` | score best-in-class UX | [references/benchmark.md](references/benchmark.md) |

## Anti-patterns

- Starting `analysis` before Step 0's gate, or starting `benchmark` scoring before Phase 1's gate.
- Reformatting `discover`'s data instead of running the fresh per-category pass `analysis` requires.
- Inflating confidence or a score to make a matrix look more authoritative or complete than the evidence allows.
- Describing a screen not actually seen as though it were.
- Scoring one product on a softer bar than the others, or benchmarking tasks that aren't comparable across products.
- Restating a vendor's marketing claim as fact.
- Ranking opportunities without the effort and confidence columns, which is where the honesty lives.
- Delivering without the manual-verification checklist.
