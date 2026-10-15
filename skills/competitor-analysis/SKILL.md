---
name: competitor-analysis
description: >-
  Competitive analysis in three sequential modes. `discover` (default) interviews the
  stakeholder on market, tool type, workflows and differentiators, researches the web for
  candidates they may not know, narrows to the 3-5 closest, then profiles each with
  features, workflow, UX patterns, a real screenshot and why it is viable. `add` appends
  one more competitor. `analyse` takes a finished `discover` doc and runs a deeper,
  evidence-rated pass by UX category with confidence labels and ranked opportunities.
  Writes docs/COMPETITIVE_ANALYSIS.md. Use when the user needs to know who else is in
  their market, wants a structured comparison against real competitors with visual
  evidence, has one more competitor to add, or wants competitors analysed by UX category.
---

# Competitive Analysis

Most stakeholders can name one or two competitors off the top of their head. `discover`
exists for the rest of the market they don't know about yet, and for turning a name into
an actual comparison: real features, a real workflow, real UX patterns, a real screenshot
— not a guess at what a company with that name probably does. `analyse` exists for when
the question isn't "who's out there" but "how do they solve this specific problem, and
where can we differentiate" — a deeper, per-category, evidence-rated pass over
competitors already identified.

**Not this skill:**
- A quick, top-of-mind competitive mention during initial scoping →
  [`brief`](../brief/SKILL.md)'s own competitive-landscape question. That question still
  runs and still gets recorded; `discover` supersedes it once it's run. `brief`'s Step 4
  hand-off points here once its own table is thin or the stakeholder said "I'm not sure
  who else is out there."
- Formalizing target *users* (mental models, day-in-the-life) →
  [`persona`](../persona/SKILL.md). This skill profiles other companies' products, not
  this product's own users — though a competitor's UX pattern is legitimate input to
  `persona`'s `day` mode friction map, not something this skill decides.
- Deciding this product's own information architecture or object model →
  [`map`](../map/SKILL.md). A competitor's workflow can inform that decision; this skill
  doesn't make it.

Say which mode if not specified. Running this for the first time on a project almost
always means `discover`. A later "found one more" almost always means `add`. A request to
go deeper on UX patterns, compare by category, or rate confidence on an existing analysis
means `analyse`.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the
  result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut
  padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no
  speculative abstractions, no unrequested scaffolding.

## Environment
- **Needs:** web search and page fetching. Browser tooling gives real screenshots. A file system is optional.
- **If it isn't available:** No web access here: say so, ask the user for sources, and never invent product facts. No browser tooling: skip screenshots and say so. No file system here: return the finished document in the conversation and name the path it would be saved to. Never claim a file was written when it was not.
- **Parallel sub-agents:** use them only where available; otherwise do the same work one item at a time.

## The evidence rule — shared across all three modes

**Do not invent information. Never assume a feature exists.**

If something cannot be verified, say so explicitly rather than describing it as though
seen. Every claim in every mode carries one of three ratings:

- **Verified** — first-party documentation, official help centres, published pages, a
  real captured screenshot, or the stakeholder's own direct knowledge.
- **Likely** — credible third-party sources: design case studies, reputable reporting,
  app-store listings, marketing copy that describes rather than documents.
- **Not Verified** — nothing better than a guess. Say so and explain why, rather than
  rounding up. Absence of evidence in a web search is not evidence of absence — say that
  explicitly wherever a finding rests on one.

A vendor's claim about its own product (an accuracy percentage, "industry-first," a
performance figure) is reported **as a vendor claim**, never restated as established fact.
A short honest matrix beats a long confident one. If you catch yourself writing a
plausible-sounding UI detail you haven't actually seen, stop and rate it Not Verified.

If no web research capability is available in the current environment, say so plainly and
ask the stakeholder directly for names or facts they know, rather than inventing a
plausible-sounding answer from general knowledge. A fabricated competitor or feature is
worse than a short, honestly incomplete one.

## Mode: discover

### Step 1: Interrogate the market

Read `docs/PRODUCT_BRIEF.md` and `docs/PERSONA_WALKTHROUGH.md` first if they exist —
don't re-ask what's already answered there. Whatever's still unclear, ask one question at
a time (same discipline as [`interrogate`](../interrogate/SKILL.md)), each paired with a
recommendation, waiting for an answer before moving on:

1. **Type of tool.** What kind of product is this, in one sentence — specific enough to
   search on ("expense-report software for small agencies," not "business software").
2. **Core workflows.** The 1-3 tasks a user actually comes here to do. This is what
   competitors get compared against, not their marketing copy.
3. **Differentiators.** What's meant to set this apart from the typical solution in the
   space — a specific mechanism or choice, not "better UX" or "easier to use."
4. **Known competitors.** Names already top of mind, including a non-software substitute
   if that's the real alternative ("a spreadsheet," "doing it manually," "not doing it at
   all").

**Completion criterion:** all four areas have a real answer, specific enough to search on
— not a placeholder.

### Step 2: Search for candidates

Using whatever web search and page-fetching capability is available, look for products
matching the category and workflows from Step 1. Aim wide enough to be useful — direct
competitors, adjacent tools people actually compare this product against, the known names
from Step 1 — but stop once the list covers the category rather than padding it for a
round number. Note where each candidate came from (a comparison page, a review site, a
category listicle, or "stakeholder-provided") so it can be sanity-checked, not just the
name.

### Step 3: Let the stakeholder pick

Present the candidate list with a one-line description and source per entry. Ask which
ones are worth a full profile, steering toward **3-5** — the closest experiences to what's
being built, not the broadest possible coverage. Also ask whether a competitor they
already know about is missing, and add it if so.

**Completion criterion:** every candidate presented has a stated source, and the selected
subset (ideally 3-5) was an explicit stakeholder choice.

### Step 4: Research each selected competitor

Each competitor's research is independent, so where the current environment supports
launching parallel agents, dispatch one per selected competitor concurrently; fall back to
sequential otherwise. For each, using web research (their own site, product pages,
comparison/review content) plus real screenshot/browser tooling if available:

- **Key features** — what they actually offer, read from the product itself where
  possible, not just marketing copy. Rated per the evidence rule.
- **Core workflow** — how a user actually accomplishes the main task, as a short numbered
  sequence, not a feature list restated as steps.
- **UX patterns worth noting** — anything notably good, bad, or distinctive, and why it
  stands out, not a generic "clean UI" observation.
- **Why they're a real competitor** — a specific signal (user base, funding, category
  leadership, being the default substitute), not just "they exist in this space."
- **Screenshot** — real capture of the core-workflow screen (not the marketing homepage)
  under `<docs>/competitor-screenshots/<competitor-slug>.png` if tooling is available. If
  not, say so explicitly and leave the slot noting "not captured."

If the stakeholder already knows a competitor well and web research would just restate
what they said, ask them directly and credit it as stakeholder-provided.

**Completion criterion:** every profile traces to a cited source, explicit stakeholder
knowledge, or a real captured screenshot, each carrying its Verified/Likely/Not Verified
rating — nothing invented to fill a gap.

### Step 5: Build the comparison matrix and write the doc

Use [`templates/competitive-analysis-template.md`](templates/competitive-analysis-template.md)
to write `docs/COMPETITIVE_ANALYSIS.md`: a comparison matrix (one column per competitor,
one row per dimension), each cell carrying its confidence rating, followed by a full
profile section per competitor with the screenshot embedded
(`![<competitor> core workflow](competitor-screenshots/<slug>.png)`). The matrix and the
profiles must agree — a row and its corresponding profile section describe the same fact.

### Step 6: Hand off

- If `docs/PRODUCT_BRIEF.md`'s Competitive Landscape table exists and is now thinner than
  this analysis, tell the stakeholder it's superseded and point at
  `docs/COMPETITIVE_ANALYSIS.md`.
- A UX pattern worth reacting to carries into [`persona`](../persona/SKILL.md)'s `day`
  mode friction map, or [`map`](../map/SKILL.md)'s `objects`/`site` modes, as input — not
  as something this skill decides.
- A real open question this research couldn't settle → `docs/UNKNOWNS.md`.

**Completion criterion:** `docs/COMPETITIVE_ANALYSIS.md` exists with a rated matrix and a
profile per selected competitor, and anything genuinely unresolved landed in
`docs/UNKNOWNS.md` instead of being invented.

## Mode: add

For one more competitor found after `discover` already ran.

### Step 1: Profile the one competitor

Run Step 4 from `discover` for just this competitor: features, workflow, UX patterns, a
screenshot if available, why they're a real competitor, each rated per the evidence rule.

### Step 2: Insert into the existing doc

Add one column to the comparison matrix and one profile section, matching the exact
structure already there. Don't reformat or re-derive the existing entries.

**Completion criterion:** the new competitor's matrix row and profile section match the
existing entries' structure and rating discipline, and nothing else in the doc changed.

## Mode: analyse

For a deeper, per-category, evidence-rated pass on competitors already identified —
whether by `discover` or supplied directly. **This mode runs a fresh research pass per
category** rather than reformatting `discover`'s existing profiles: a per-competitor
profile can miss a market-wide pattern that only shows up when every competitor is
checked against the same specific category question.

### Step 0: Gate on what's still missing

If `docs/COMPETITIVE_ANALYSIS.md` already exists from `discover`, read it first — don't
re-ask what it already answered (which competitors, the core workflow, the differentiator).
Ask up to five questions, using `AskUserQuestion`, about whichever of these remain unclear:

| Gap | Why it changes the analysis |
|---|---|
| Platform | Web, mobile app, or both — patterns differ sharply between surfaces |
| Categories to prioritise | Determines depth vs. breadth |
| Deliverable format | Document (.docx), presentation (.pptx), or both |
| Product stage | Pre-build means the "Our Product" column becomes decisions-to-make |
| Target user specifics | A confident power user and a nervous novice make opposite
  patterns correct |

**Completion criterion:** every gap either has an answer or was already resolved by an
existing doc — don't ask about something `discover` already settled.

### Step 1: Choose categories

Choose based on the product; don't analyse categories that aren't relevant. Illustrative,
not exhaustive: Navigation, Search, Onboarding, Checkout, Account, Pricing,
Personalisation, Notifications, Trust, Accessibility, Mobile UX, Empty states, Error
handling. State briefly why any obvious category was excluded.

### Step 2: Research each category, across all competitors

For each chosen category, research every competitor's specific handling of it — not a
restatement of `discover`'s profile, a fresh, targeted look at that one dimension across
the whole set. Work from strongest source to weakest: first-party documentation supports
Verified; credible third-party supports Likely; nothing found is Not Verified. Number
sources `[1]`, `[2]`… for a source register.

### Step 3: Build the category-based comparison matrix

Organise **by category, not by competitor**, so market-wide patterns are visible in one
view. For every row: Feature, Competitor (or "All N" for market-wide), Our Product
(current state or the decision required), Evidence, Confidence
(Verified/Likely/Not Verified — exactly one), Source. Colour-code Confidence: green
`D6E9D6` Verified, amber `FCEFCC` Likely, red `F6D8D6` Not Verified. A visibly red-heavy
matrix is honest output, not failed output.

### Step 4: Summarise and rank opportunities

Summarise: patterns every competitor uses (table stakes, not advantages); where
competitors differ (usually traceable to business model); unexpected transferable ideas;
opportunities for this product. Rank opportunities by Impact · User value · Implementation
effort · Confidence, in a table. Confidence here means strength of evidence behind the
opportunity, not likelihood of success — a Not Verified opportunity is a hypothesis for
research, not a plan. Say that explicitly. Flag which opportunities are the pragmatic
starting set (low effort, well evidenced) versus which carry strategic weight but demand
real commitment.

### Step 5: Produce the deliverable

Sections, in order: Executive Summary, Key Findings, Comparison Matrix, Top Opportunities,
Potential Risks, Questions requiring further research, Items to manually verify before
sharing with stakeholders. Include a method-and-evidence-standard section defining the
three confidence ratings and this analysis's limitations. If the analysis is desk
research, put a visible evidence warning on the cover or first page. No format is allowed
to drop the confidence ratings, sources, or verification checklist — compressing for
slides means fewer rows, never unrated rows.

**Format** (Figma routes are out of scope for this package):

| Format | Best when | Build with |
|---|---|---|
| Document (.docx) | Stakeholder circulation, full matrix with every source | `docx` skill |
| Presentation (.pptx) | Reviews, exec readouts, a live audience and a decision to reach | `pptx` skill |

**Document build notes:** narrative sections portrait, wide matrices landscape
(orientation inside size); `cantSplit: true` on table rows; set `columnWidths` on the
table and `width` on every cell, both in DXA; `ShadingType.CLEAR` never `SOLID`; render to
PDF and read the pages back before delivering.

**Presentation build notes:** lead with the evidence warning slide, not the findings —
it's the thing most likely to be skipped and most damaging to omit. Split the matrix by
category across slides; never shrink type to force it onto one. Confidence stays a visible
colour-coded column, not a footnote. Keep the verification checklist as a real slide.
Speaker notes carry the evidence detail that won't fit on the slide.

**Completion criterion:** the deliverable carries every required section, every claim
rated, sources numbered and resolved in a register, and the verification checklist names
the specific claims a stakeholder is most likely to challenge.

## Anti-patterns

- Starting `analyse` before Step 0's gate.
- Reformatting `discover`'s data instead of running the fresh per-category pass this mode
  requires.
- Inflating confidence to make a matrix look more authoritative than the evidence allows.
- Describing a screen not actually seen as though it were.
- Restating a vendor's marketing claim as fact.
- Ranking opportunities without the effort column, which is where the honesty lives.
- Delivering without the manual-verification checklist.
