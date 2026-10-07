---
name: competitors
description: >-
  Two modes for competitive analysis. `discover` (default) interrogates the stakeholder one question at a time on market, tool type, core workflows, and differentiators, researches the web to surface candidate competitors and alternatives they may not already know about, lets them narrow to the 3-5 closest experiences, then profiles each in parallel (one research agent per competitor where available) — key features, core workflow, UX patterns, a screenshot of the real product, and why it's a viable competitor. `add` appends one more competitor found later without re-running the full landscape scan. Writes docs/COMPETITIVE_ANALYSIS.md — a comparison matrix plus a profile per competitor, screenshots included — and supersedes brief's lightweight competitive-landscape question once it's run. Use when the user needs to know who else is in their market, wants a structured feature/workflow/UX comparison against real competitors with visual evidence, or has found one more competitor to add to an existing analysis.
argument-hint: "[discover: scan the market | add: one more competitor]"
---

# Competitive Analysis

Most stakeholders can name one or two competitors off the top of their head. This skill exists for the rest of the market they don't know about yet, and for turning a name into an actual comparison: real features, a real workflow, real UX patterns, a real screenshot — not a guess at what a company with that name probably does. The end deliverable is a curated report of the 3-5 experiences closest to what's being built, not an exhaustive market survey.

**Not this skill:**
- A quick, top-of-mind competitive mention during initial scoping → [`brief`](../brief/SKILL.md)'s own competitive-landscape question. That question still runs and still gets recorded; this skill supersedes it once it's run, going from "what the stakeholder happens to remember" to a real researched landscape. `brief`'s Step 4 hand-off points here once its own table is thin or the stakeholder said "I'm not sure who else is out there."
- Formalizing target *users* (mental models, day-in-the-life) → [`persona`](../persona/SKILL.md). This skill profiles other companies' products, not this product's own users — though a competitor's UX patterns are legitimate input to a persona's friction map or an ORCA session's CTA design.
- Deciding this product's own information architecture or object model → [`map`](../map/SKILL.md). A competitor's workflow can inform that decision; this skill doesn't make it.

Say which mode if not specified — running this for the first time on a project almost always means `discover`; a later "found one more" almost always means `add`.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

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
