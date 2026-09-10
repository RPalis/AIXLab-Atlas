---
name: competitors
description: Two modes for competitive analysis. `discover` (default) runs a guided pass — establishes the product's market/category, researches the web to surface candidate competitors and alternatives the stakeholder may not already know about, lets them pick which ones actually matter, then captures each chosen competitor's key features, core workflow, and UX patterns: what makes them unique and a viable competitor, not just that they exist. `add` appends one more competitor found later without re-running the full landscape scan. Writes docs/COMPETITIVE_ANALYSIS.md — a comparison matrix plus a profile per competitor — and supersedes brief's lightweight competitive-landscape question once it's run. Use when the user needs to know who else is in their market, wants a structured feature/workflow/UX comparison against real competitors, or has found one more competitor to add to an existing analysis.
disable-model-invocation: true
---

# Competitive Analysis

Most stakeholders can name one or two competitors off the top of their head. This skill exists for the rest of the market they don't know about yet, and for turning a name into an actual comparison: real features, a real workflow, real UX patterns, not a guess at what a company with that name probably does.

**Not this skill:**
- A quick, top-of-mind competitive mention during initial scoping → [`brief`](../brief/SKILL.md)'s own competitive-landscape question. That question still runs and still gets recorded; this skill supersedes it once it's run, going from "what the stakeholder happens to remember" to a real researched landscape. `brief`'s Step 4 hand-off points here once its own table is thin or the stakeholder said "I'm not sure who else is out there."
- Formalizing target *users* (mental models, day-in-the-life) → [`persona`](../persona/SKILL.md). This skill profiles other companies' products, not this product's own users — though a competitor's UX patterns are legitimate input to a persona's friction map or an ORCA session's CTA design.
- Deciding this product's own information architecture or object model → [`map`](../map/SKILL.md). A competitor's workflow can inform that decision; this skill doesn't make it.

Say which mode if not specified — running this for the first time on a project almost always means `discover`; a later "found one more" almost always means `add`.

## Mode: discover

### Step 1: Establish the market

Read `docs/PRODUCT_BRIEF.md` and `docs/PERSONA_WALKTHROUGH.md` if they exist — the product's category, audience, and core tasks are usually already answered there, and re-interrogating the stakeholder from scratch duplicates `brief`'s job. If neither exists yet, ask directly: what does this product do, in one sentence, and who is it for? The goal is a category description specific enough to search on ("expense-report software for small agencies," not "business software"), not a full brief-style interrogation.

### Step 2: Search for candidates

Using whatever web search and page-fetching capability is available in the current environment, look for products and companies operating in that category. Aim wide enough to be useful — direct competitors, adjacent tools people actually compare this product against, and a genuine non-software alternative when it's a real substitute ("a spreadsheet," "doing it manually," "not doing it at all") — but stop once the list covers the category rather than padding it for a round number. Note where each candidate came from (a comparison page, a review site, a category listicle) so the stakeholder can sanity-check the source, not just the name.

If no web research capability is available in the current environment, say so plainly and fall back to asking the stakeholder directly for names they know, rather than inventing a plausible-sounding list from general knowledge. A fabricated competitor is worse than a short real one.

### Step 3: Let the stakeholder pick

Present the candidate list with a one-line description and source per entry. Ask which ones are actually worth a full profile — the point is filtering to what's genuinely relevant to this product's specific niche or differentiator, not profiling everything that turned up. Also ask whether a competitor they already know about is missing from the list, and add it if so.

**Completion criterion:** every candidate presented has a stated source (a URL, or "stakeholder-provided"), and the selected subset was an explicit choice, not an assumption that more coverage is automatically better.

### Step 4: Profile each selected competitor

For each one, using the same web research capability (their own site, product pages, and any comparison or review content that turns up), capture:

- **Key features** — what they actually offer, read from the product itself where possible, not just marketing copy.
- **Core workflow** — how a user actually accomplishes the main task, as a short numbered sequence, not a feature list restated as steps.
- **UX patterns worth noting** — anything notably good, bad, or distinctive, and why it stands out, not a generic "clean UI" observation.
- **Why they're a real competitor** — a specific signal (user base, funding, category leadership, or being the default substitute people already reach for), not just "they exist in this space."

If the stakeholder already knows a competitor well and web research would just restate what they said, ask them directly and credit it as stakeholder-provided rather than re-deriving it from a search.

**Completion criterion:** every profile traces to a cited source or explicit stakeholder knowledge — nothing invented to fill a gap. A feature, workflow step, or UX pattern with no real source behind it doesn't go in the doc.

### Step 5: Build the comparison matrix and write the doc

Use [`templates/competitive-analysis-template.md`](templates/competitive-analysis-template.md) to write `docs/COMPETITIVE_ANALYSIS.md`: a comparison matrix (one column per competitor, one row per dimension) followed by a full profile section per competitor. The matrix and the profiles must agree — a row in the matrix and its corresponding profile section describe the same fact, not a summarized-into-drift version of it.

### Step 6: Hand off

- If `docs/PRODUCT_BRIEF.md`'s Competitive Landscape table exists and is now thinner than this analysis, tell the stakeholder it's superseded and point the table at `docs/COMPETITIVE_ANALYSIS.md` rather than leaving two competing sources of truth.
- A UX pattern worth reacting to (adopting, deliberately avoiding) that affects this product's own design → carries into [`persona`](../persona/SKILL.md)'s friction map or [`map`](../map/SKILL.md)'s `objects`/`site` modes as input, not as something this skill decides.
- A real open question this research couldn't settle (a competitor's actual pricing, a workflow behind a paywall this session can't see) → `docs/UNKNOWNS.md` (see AGENTS.md §2.6) rather than guessed at.

**Completion criterion:** `docs/COMPETITIVE_ANALYSIS.md` exists with a matrix and a profile per selected competitor, every fact in it traces to a cited source or the stakeholder directly, and anything genuinely unresolved landed in `docs/UNKNOWNS.md` instead of being invented.

## Mode: add

For one more competitor found after `discover` already ran — a stakeholder mentions a name mid-project, or a new entrant shows up later.

### Step 1: Profile the one competitor

Run Step 4 from `discover` mode for just this competitor: key features, core workflow, UX patterns worth noting, and why they're a real competitor, sourced the same way (web research, or stakeholder-provided if they already know it well).

### Step 2: Insert into the existing doc

Add one column to the comparison matrix and one profile section to `docs/COMPETITIVE_ANALYSIS.md`, matching the exact structure already there. Don't reformat or re-derive the existing competitors' entries while doing this — this mode adds one row, it doesn't re-run the whole analysis.

**Completion criterion:** the new competitor's matrix row and profile section use the same structure and level of detail as the existing entries, and nothing else in the doc changed.
