# Competitors: analysis mode

Part of the [`competitors`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

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

**Autonomous mode** (suite `AGENTS.md` §2.9): take the platform, stage and user from `docs/PRODUCT_BRIEF.md` or `docs/PERSONA_WALKTHROUGH.md` when they say. Otherwise default to web, pre-build (the more conservative reading: decisions to make, not claimed capabilities), categories chosen from the product's core workflows, Markdown only (no Word or deck unless asked). Log each default in one line, and log the stage default as a tier-2 assumption (`../../../tools/log-unknown/log-unknown.sh --skill competitors --tier 2 "..."`). If there's no `discover` doc and no competitors supplied, that's the same tier-3 stop `discover` names: skip and log.

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

Append to `docs/COMPETITIVE_ANALYSIS.md` using the "analysis mode addendum" in [`templates/competitive-analysis-template.md`](../templates/competitive-analysis-template.md). Sections, in order: Executive Summary, Key Findings, Comparison Matrix, Top Opportunities, Potential Risks, Questions requiring further research, Items to manually verify before sharing. Include the method-and-evidence-standard section defining the three ratings and this analysis's limitations. If the analysis is desk research, put a visible evidence warning at the top.

For a Word document or a slide deck, hand the Markdown to [`showcase`](../../showcase/SKILL.md)'s `doc` or `deck` mode (e.g. `/showcase COMPETITIVE_ANALYSIS.md`). `deck` mode keeps the evidence warning first, splits the matrix by category, and keeps the verification checklist as a slide; the Markdown stays the source of truth.

**Completion criterion:** every required section is present, every claim is rated, sources are numbered and resolved in a register, and the verification checklist names the specific claims a stakeholder is most likely to challenge.
