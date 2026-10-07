---
name: competitors
description: >-
  Four modes for competitive and best-in-class research. `discover` (default) interrogates the stakeholder one question at a time on market, tool type, core workflows, and differentiators, researches the web to surface candidate competitors and alternatives they may not already know about, lets them narrow to the 3-5 closest experiences, then profiles each in parallel (one research agent per competitor where available) — key features, core workflow, UX patterns, a screenshot of the real product, and why it's a viable competitor. `add` appends one more competitor found later without re-running the full landscape scan. `analysis` takes an existing `discover` doc and runs a deeper, evidence-rated pass organised by UX category rather than by competitor, with a three-tier confidence label on every claim and a ranked opportunity table. `benchmark` scores 3-5 products (yours, competitors, and best-in-class references from any industry) 1-5 against one rubric on the same tasks, with evidence and a confidence rating on every score, plus a flow teardown and an adopt/adapt/avoid pattern library. Writes docs/COMPETITIVE_ANALYSIS.md (discover, add, analysis) or docs/UX_BENCHMARK.md (benchmark), and supersedes brief's lightweight competitive-landscape question once discover has run. Use when the user needs to know who else is in their market, wants a structured feature/workflow/UX comparison against real competitors with visual evidence, has found one more competitor to add, wants competitors analysed by UX category with confidence ratings, or wants to score and rank products against a rubric or find best-in-class UX patterns to adopt.
argument-hint: "[discover: scan the market | add: one more competitor | analysis: deeper by UX category | benchmark: score best-in-class UX]"
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
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## The evidence rule — shared across all modes

**Do not invent information. Never assume a feature exists.**

If something cannot be verified, say so explicitly rather than describing it as though seen. Every claim in `discover`, `add`, and `analysis` carries one of three ratings (`benchmark` uses its own stricter version, below):

- **Verified** — first-party documentation, official help centres, published pages, a real captured screenshot, or the stakeholder's own direct knowledge.
- **Likely** — credible third-party sources: design case studies, reputable reporting, app-store listings, marketing copy that describes rather than documents.
- **Not Verified** — nothing better than a guess. Say so and explain why, rather than rounding up. Absence of evidence in a web search is not evidence of absence; say that explicitly wherever a finding rests on one.

A vendor's claim about its own product (an accuracy percentage, "industry-first," a performance figure) is reported **as a vendor claim**, never restated as established fact. A short honest matrix beats a long confident one. If you catch yourself writing a plausible-sounding UI detail you haven't actually seen, stop and rate it Not Verified.

If no web research capability is available in the current environment, say so plainly and ask the stakeholder directly for names or facts they know, rather than inventing a plausible-sounding answer from general knowledge. A fabricated competitor or feature is worse than a short, honestly incomplete one.

## Mode: discover

### Step 1: Interrogate the market

Read `docs/PRODUCT_BRIEF.md` and `docs/PERSONA_WALKTHROUGH.md` first if they exist — don't re-ask what's already answered there. Whatever's still unclear, ask one question at a time (same discipline as [`interrogate`](../interrogate/SKILL.md)), each paired with a recommendation, waiting for an answer before moving on:

1. **Type of tool.** What kind of product is this, in one sentence — specific enough to search on ("expense-report software for small agencies," not "business software").
2. **Core workflows.** The 1-3 tasks a user actually comes here to do. This is what competitors get compared against, not their marketing copy.
3. **Differentiators.** What's meant to set this apart from the typical solution in the space — a specific mechanism or choice, not "better UX" or "easier to use."
4. **Known competitors.** Names already top of mind, including a non-software substitute if that's the real alternative ("a spreadsheet," "doing it manually," "not doing it at all").

**Completion criterion:** all four areas have a real answer (from existing docs or the stakeholder), specific enough to search on — not a placeholder.

**Autonomous mode** (suite `AGENTS.md` §2.9): if `docs/PRODUCT_BRIEF.md` (or `docs/PERSONA_WALKTHROUGH.md`) already answers all four areas, proceed straight to Step 2 with those answers. If any area is still unanswered with no stakeholder to ask, this is the same hard tier-3 stop `brief`'s own autonomous-mode note names for a genuinely new idea — this skill can't research a market category that hasn't been defined. Log which areas are missing (`../../tools/log-unknown/log-unknown.sh --skill competitors --tier 3 "..."`) and stop rather than guessing at what kind of product this is.

### Step 2: Search for candidates

Using whatever web search and page-fetching capability is available in the current environment, look for products and companies matching the category and workflows from Step 1. Aim wide enough to be useful — direct competitors, adjacent tools people actually compare this product against, the known names from Step 1 — but stop once the list covers the category rather than padding it for a round number. Note where each candidate came from (a comparison page, a review site, a category listicle, or "stakeholder-provided") so it can be sanity-checked, not just the name.

If no web research capability is available in the current environment, say so plainly and fall back to asking the stakeholder directly for names they know, rather than inventing a plausible-sounding list from general knowledge. A fabricated competitor is worse than a short real one.

### Step 3: Let the stakeholder pick

Present the candidate list with a one-line description and source per entry. Ask which ones are worth a full profile, steering toward **3-5** — the closest experiences to what's being built, not the broadest possible coverage. Also ask whether a competitor they already know about is missing from the list, and add it if so. **Autonomous mode** (suite `AGENTS.md` §2.9): this selection is a **checkpoint**, not a tier — which competitors anchor the product's competitive positioning is a call a designer wants to have made themselves, even though guessing here would be low-risk. Never auto-select and proceed to profiling in the same run. Report the ranked candidate list and a proposed top-5, and stop — whatever's driving the work resolves the pick with the designer before a full profile pass runs (see `agents/competitors-agent.md`'s two-phase split for the concrete mechanism). Every candidate Step 2 found still gets documented once profiling does run (see Step 5), selected or not. The "anyone we're missing" question has no autonomous answer either — no source has that knowledge — log it to `docs/UNKNOWNS.md` as a standing question rather than skipping it silently.

**Completion criterion:** every candidate presented has a stated source, and the selected subset (ideally 3-5) was an explicit stakeholder choice, not an assumption that more coverage is automatically better.

### Step 4: Research each selected competitor

Each competitor's research is independent of the others, so where the current environment supports launching parallel agents, dispatch one per selected competitor to do this step concurrently rather than working through them one at a time; fall back to doing them sequentially yourself if it doesn't. For each competitor, using web research (their own site, product pages, comparison/review content) plus real screenshot/browser tooling if available:

- **Key features** — what they actually offer, read from the product itself where possible, not just marketing copy.
- **Core workflow** — how a user actually accomplishes the main task, as a short numbered sequence, not a feature list restated as steps.
- **UX patterns worth noting** — anything notably good, bad, or distinctive, and why it stands out, not a generic "clean UI" observation.
- **Why they're a real competitor** — a specific signal (user base, funding, category leadership, or being the default substitute people already reach for), not just "they exist in this space."
- **Screenshot** — if real screenshot/browser tooling is available, capture the product's actual UI (the core-workflow screen, not the marketing homepage) with [`tools/capture-screenshot`](../../tools/capture-screenshot/capture-screenshot.mjs):
  ```bash
  node ../../tools/capture-screenshot/capture-screenshot.mjs --url <product-url> --out <docs>/competitor-screenshots/<competitor-slug>.png
  ```
  Pass `--click <selector>` if one extra click (dismiss a cookie banner, open the workflow screen) is needed to reach the right state; for anything more involved (login, a multi-step flow), drive it with the built-in browser or Claude in Chrome instead and skip the script. If no screenshot tooling is available at all, say so explicitly and leave the profile's screenshot slot noting "not captured" rather than fabricating or describing imagery that wasn't actually seen.

If the stakeholder already knows a competitor well and web research would just restate what they said, ask them directly and credit it as stakeholder-provided rather than re-deriving it from a search.

**Completion criterion:** every profile traces to a cited source, explicit stakeholder knowledge, or a real captured screenshot — nothing invented to fill a gap. A feature, workflow step, UX pattern, or image with no real source behind it doesn't go in the doc.

### Step 5: Build the comparison matrix and write the doc

Use [`templates/competitive-analysis-template.md`](templates/competitive-analysis-template.md) to write `docs/COMPETITIVE_ANALYSIS.md`: a comparison matrix (one column per competitor, one row per dimension) followed by a full profile section per competitor, screenshot embedded via a standard markdown image link (`![<competitor> core workflow](competitor-screenshots/<slug>.png)`). The matrix and the profiles must agree — a row in the matrix and its corresponding profile section describe the same fact, not a summarized-into-drift version of it.

**Autonomous mode:** append a short "Other candidates found" list after the profiles — every candidate Step 2 turned up that didn't get a full profile, each with its one-line description and source, so nothing found silently disappears even though only the top ~5 were deep-dived. A later `add` pass can promote one of these to a full profile without re-running Step 2.

### Step 6: Hand off

- If `docs/PRODUCT_BRIEF.md`'s Competitive Landscape table exists and is now thinner than this analysis, tell the stakeholder it's superseded and point the table at `docs/COMPETITIVE_ANALYSIS.md` rather than leaving two competing sources of truth.
- A UX pattern worth reacting to (adopting, deliberately avoiding) that affects this product's own design → carries into [`persona`](../persona/SKILL.md)'s friction map or [`map`](../map/SKILL.md)'s `objects`/`site` modes as input, not as something this skill decides.
- A real open question this research couldn't settle (a competitor's actual pricing, a workflow behind a paywall this session can't see) → `docs/UNKNOWNS.md` (see AGENTS.md §2.6) rather than guessed at.

**Completion criterion:** `docs/COMPETITIVE_ANALYSIS.md` exists with a matrix and a profile per selected competitor (screenshots embedded where captured), every fact in it traces to a cited source, a real screenshot, or the stakeholder directly, and anything genuinely unresolved landed in `docs/UNKNOWNS.md` instead of being invented.

## Mode: add

For one more competitor found after `discover` already ran — a stakeholder mentions a name mid-project, or a new entrant shows up later.

### Step 1: Profile the one competitor

Run Step 4 from `discover` mode for just this competitor: key features, core workflow, UX patterns worth noting, a screenshot if tooling is available, and why they're a real competitor, sourced the same way (web research, or stakeholder-provided if they already know it well).

### Step 2: Insert into the existing doc

Add one column to the comparison matrix and one profile section to `docs/COMPETITIVE_ANALYSIS.md`, matching the exact structure already there. Don't reformat or re-derive the existing competitors' entries while doing this — this mode adds one row, it doesn't re-run the whole analysis.

**Completion criterion:** the new competitor's matrix row and profile section use the same structure and level of detail as the existing entries, and nothing else in the doc changed.

## Mode: analysis

For a deeper, per-category, evidence-rated pass on competitors already identified, whether by `discover` or supplied directly. **This mode runs a fresh research pass per category** rather than reformatting `discover`'s profiles: a per-competitor profile can miss a market-wide pattern that only shows up when every competitor is checked against the same specific question.

### Step 0: Gate on what's still missing

If `docs/COMPETITIVE_ANALYSIS.md` already exists from `discover`, read it first and don't re-ask what it already answered (which competitors, the core workflow, the differentiator). Ask up to five questions about whichever of these remain unclear:

| Gap | Why it changes the analysis |
|---|---|
| Platform | Web, mobile app, or both. Patterns differ sharply between surfaces. |
| Categories to prioritise | Determines depth vs. breadth. |
| Product stage | Pre-build means the "Our Product" column becomes decisions-to-make. |
| Target user specifics | A confident power user and a nervous novice make opposite patterns correct. |
| Word or slide version wanted | Markdown is always written; `showcase` makes the Word or PowerPoint version afterwards. |

**Autonomous mode** (suite `AGENTS.md` §2.9): take the platform, stage and user from `docs/PRODUCT_BRIEF.md` or `docs/PERSONA_WALKTHROUGH.md` when they say. Otherwise default to web, pre-build (the more conservative reading: decisions to make, not claimed capabilities), categories chosen from the product's core workflows, Markdown only (no Word or deck unless asked). Log each default in one line, and log the stage default as a tier-2 assumption (`../../tools/log-unknown/log-unknown.sh --skill competitors --tier 2 "..."`). If there's no `discover` doc and no competitors supplied, that's the same tier-3 stop `discover` names: skip and log.

**Completion criterion:** every gap either has an answer or was already resolved by an existing doc.

### Step 1: Choose categories

Choose based on the product; don't analyse categories that aren't relevant. Illustrative, not exhaustive: Navigation, Search, Onboarding, Checkout, Account, Pricing, Personalisation, Notifications, Trust, Accessibility, Mobile UX, Empty states, Error handling. State briefly why any obvious category was excluded.

### Step 2: Research each category, across all competitors

For each chosen category, research every competitor's specific handling of it: a fresh, targeted look at that one dimension across the whole set. Work from strongest source to weakest: first-party documentation supports Verified; credible third-party supports Likely; nothing found is Not Verified. Number sources `[1]`, `[2]`… for a source register.

### Step 3: Build the category-based comparison matrix

Organise **by category, not by competitor**, so market-wide patterns are visible in one view. Each row: Feature, Competitor (or "All N" for market-wide), Our Product (current state or the decision required), Evidence, Confidence (Verified/Likely/Not Verified, exactly one), Source. A visibly red-heavy matrix (lots of Not Verified) is honest output, not failed output.

### Step 4: Summarise and rank opportunities

Summarise: patterns every competitor uses (table stakes, not advantages); where competitors differ (usually traceable to business model); unexpected transferable ideas; opportunities for this product. Rank opportunities by Impact · User value · Implementation effort · Confidence, in a table. Confidence here means strength of evidence behind the opportunity, not likelihood of success: a Not Verified opportunity is a hypothesis for research, not a plan. Say that explicitly. Flag which opportunities are the pragmatic starting set (low effort, well evidenced) and which carry strategic weight but demand real commitment.

### Step 5: Write it up

Append to `docs/COMPETITIVE_ANALYSIS.md` using the "analysis mode addendum" in [`templates/competitive-analysis-template.md`](templates/competitive-analysis-template.md). Sections, in order: Executive Summary, Key Findings, Comparison Matrix, Top Opportunities, Potential Risks, Questions requiring further research, Items to manually verify before sharing. Include the method-and-evidence-standard section defining the three ratings and this analysis's limitations. If the analysis is desk research, put a visible evidence warning at the top.

For a Word document or a slide deck, hand the Markdown to [`showcase`](../showcase/SKILL.md)'s `doc` or `deck` mode (e.g. `/showcase COMPETITIVE_ANALYSIS.md`). `deck` mode keeps the evidence warning first, splits the matrix by category, and keeps the verification checklist as a slide; the Markdown stays the source of truth.

**Completion criterion:** every required section is present, every claim is rated, sources are numbered and resolved in a register, and the verification checklist names the specific claims a stakeholder is most likely to challenge.


## Mode: benchmark

A scored, rubric-based comparison of how 3-5 products solve the same tasks: **yours plus competitors and best-in-class references**, any of which can come from outside this market (the best checkout flow anywhere is a valid reference for yours). Every product is scored 1-5 on every dimension, with evidence and a confidence rating. This is a **summative** measurement of the current state of each experience, not an exploration of what to build. Run it before information architecture (`map`'s `ia` mode), user flows, wireframing, a brainstorm, or setting your own UX standards: it shows where you stand and which patterns to adopt, adapt, or beat.

Role while running it: a senior UX researcher and lead product designer. Measure objectively against a fixed rubric. Don't guess, and don't inflate.

### The evidence rule for this mode

**Score only what you can observe. Never invent a feature, flow, screen or price.**

- Every score needs evidence: a specific screen, step or observation. No evidence, no score.
- Anything you can't verify directly is labelled **NOT VERIFIED**. Don't guess it into a number.
- Apply the **same scale to every product**: a "5" means the same bar everywhere.
- Separate what you **OBSERVED** from what you **INFERRED**. Never present inference as fact.
- A search that finds nothing produces `NOT VERIFIED — searched [where], nothing found. This does not establish absence.` Never write "no product does X".
- Vendor claims about their own product stay labelled as vendor claims.

The full evidence ladder, the OBSERVED/INFERRED discipline, the review pass and the validation checklist are in [`references/benchmark/evidence-and-verification.md`](references/benchmark/evidence-and-verification.md). Read it before scoring.

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

Ask up to five questions about whatever is missing, and don't start until scope, products and rubric are clear. If a task isn't comparable across all products, say so before scoring. The question bank is in [`references/benchmark/calibration-questions.md`](references/benchmark/calibration-questions.md). The essentials:

| Input | Needed for |
|---|---|
| **3-5 products** with URLs, app links or screenshots, each labelled yours / competitor / best-in-class | The comparison set |
| **5-10 key tasks or flows** (onboarding, checkout, search…) | The comparable spine of the benchmark |
| **Persona and a definition of "good"** | What a "5" is *for this user*. Pull from a `persona` `card` output if one exists. |
| **Rubric**, default 10 or tailored | The scoring dimensions ([`references/benchmark/rubric.md`](references/benchmark/rubric.md)) |
| **Evidence reach**: hands-on, desk research, or supplied screenshots | Sets the confidence ceiling for the whole benchmark |

Optional: a prior `analysis` doc, screen recordings, an existing design system or UX standards, analytics or prior research, an accessibility target (e.g. WCAG 2.2 AA).

**Autonomous mode** (suite `AGENTS.md` §2.9): evidence reach defaults to desk research (the lowest ceiling, so nothing is overclaimed). Draw products from `docs/COMPETITIVE_ANALYSIS.md` and tasks from `docs/PRODUCT_BRIEF.md`'s core tasks. If neither exists, products and tasks can't be invented: skip, log tier 3 (`../../tools/log-unknown/log-unknown.sh --skill competitors --tier 3 "..."`), and stop.

**Completion criterion:** products, tasks, persona and rubric are named, and every task is confirmed comparable across all products.

### Phase 2: Choose the rubric

Use the default 10 dimensions or tailor them. [`references/benchmark/rubric.md`](references/benchmark/rubric.md) carries all ten with 1-5 behavioural anchors, so "the same 5 means the same bar" is enforceable. Drop dimensions the product doesn't need and say why. For an enterprise or captive-audience tool, add the CASTLE lens from [`references/benchmark/metrics.md`](references/benchmark/metrics.md). Agree the rubric with the user before walking any flows.

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

Pattern naming and tagging rules are in [`references/benchmark/patterns.md`](references/benchmark/patterns.md). Where hard metrics exist (task success rate, time-on-task, SEQ, SUS), anchor the score in them via [`references/benchmark/metrics.md`](references/benchmark/metrics.md) instead of impression alone.

Then run the review pass from the evidence reference: flag any score without evidence, any unverified feature, price or claim, any dimension scored on a different bar, any non-comparable task. Rewrite or downgrade whatever you flag.

### Phase 5: Extract patterns and gaps

1. **Table stakes**: patterns every product shares. The cost of entry, not an advantage.
2. **Outliers**: the one product doing something different, and why (usually business model).
3. **Where the market is weak**: the shared blind spot, usually the richest opportunity.
4. **Per-product strengths and gaps.**

### Phase 6: Rank opportunities

Rank moves for the user's product by impact · user value · confidence, adding implementation effort where known. Present a prioritised table. Confidence means strength of evidence behind the opportunity: a `Not Verified` opportunity is a hypothesis for research, not a plan, so say so under the table.

### Deliverables

Produce all six (specs and format in [`references/benchmark/deliverables.md`](references/benchmark/deliverables.md)): the Scorecard, the Flow Teardown, the Pattern Library, Strengths and Gaps, the Prioritised Opportunity List, and the Validation Checklist. Written to `docs/UX_BENCHMARK.md` plus `docs/ux-benchmark-scorecard.csv`.

Build a plan first and share it for approval, save the working analysis as Markdown you can iterate on, and execute only after approval. Benchmarking is a program, not a one-off: structure it so the same tasks and the same bar can be re-run next quarter.

### Human review before this informs design

- Verify every score against the actual product. A score without evidence is an opinion.
- Remove anything marked Not Verified (features, pricing, claims).
- Check the rubric was applied consistently.
- Confirm the tasks are comparable, not cherry-picked screens.
- Treat the output as a first draft, not final research.

**Completion criterion:** the scorecard has a 1-5 score, evidence, pattern and verdict for every product × dimension (or an explicit NOT VERIFIED), every opportunity carries a confidence rating, and the Validation Checklist exists.

## Anti-patterns

- Starting `analysis` before Step 0's gate, or starting `benchmark` scoring before Phase 1's gate.
- Reformatting `discover`'s data instead of running the fresh per-category pass `analysis` requires.
- Inflating confidence or a score to make a matrix look more authoritative or complete than the evidence allows.
- Describing a screen not actually seen as though it were.
- Scoring one product on a softer bar than the others, or benchmarking tasks that aren't comparable across products.
- Restating a vendor's marketing claim as fact.
- Ranking opportunities without the effort and confidence columns, which is where the honesty lives.
- Delivering without the manual-verification checklist.
