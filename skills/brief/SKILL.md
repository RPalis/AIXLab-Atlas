---
name: brief
description: Interactive interrogation that extracts a founder/stakeholder's own product vision before any user research exists: what the product is, who it's for, the distinct user types, their core tasks, devices and context of use, the competitive landscape, and constraints. Writes docs/PRODUCT_BRIEF.md and pushes anything genuinely unresolvable to docs/UNKNOWNS.md. Runs after setup, before Discover's user-research skills. Use when starting a brand-new product idea, or asked for a product brief, a discovery interview, or to get what's in the founder's head down before research begins.
disable-model-invocation: true
---

# Product Brief

`setup` builds the repo's doc shell. `brief` fills in the first real content: a mile-wide, inch-deep look at what's actually being built, straight from whoever already has the idea in their head, before `workshop` brings in a room full of people or `interview` goes out to real users.

**Not this skill:**
- Formalizing user archetypes from research already gathered → [`persona`](../persona/SKILL.md). `brief` is one of the "domain briefs" persona expects as input, not a replacement for it.
- Building a question bank for interviewing real external users → [`interview`](../interview/SKILL.md).
- Planning a multi-stakeholder working session → [`workshop`](../workshop/SKILL.md). `brief` is one person's (or one aligned team's) head, not a group session with activities and timing.
- Modeling objects and CTAs → [`concepting`](../concepting/SKILL.md), which needs the scope `brief` establishes first.

## Step 0: Explore, then choose pace

Check `README.md` (the one-line purpose `setup` wrote) and `docs/UNKNOWNS.md` first; don't re-ask what's already answerable from context.

Ask the user how they want to run this:
- **One question at a time** (recommended for a fuzzy or early idea): the same discipline as [`interrogate`](../interrogate/SKILL.md), each question paired with a recommendation or example, waiting for an answer before moving on.
- **Themed batches**: the same seven areas below, grouped into rounds (Product · Audience & Tasks · Devices & Context · Competitive Landscape · Constraints & Success), asked together per round for a faster pass when the user already has clarity.

Either pace covers the same ground; only the delivery cadence differs.

## Step 1: Interrogate

1. **The product.** One sentence of what it is, the problem it solves, and why it needs to exist now rather than never or already.
2. **Audience & user types.** Not just "who," but the distinct roles if there's more than one (e.g. an admin and an end customer are different user types with different goals). For each: their primary goal in using this product.
3. **Core tasks.** Per user type, the top tasks they need to accomplish, in priority order, and what "done" looks like for each. This is the seed [`concepting`](../concepting/SKILL.md) will later turn into CTAs.
4. **Devices & context of use.** Desktop, mobile, tablet, or a mix; the primary environment (office desk, on the move, a shop floor); any accessibility need already known. Feeds [`scaffold`](../scaffold/SKILL.md)'s site-type choice later.
5. **Competitive landscape.** Named competitors or alternatives, including "doing it in a spreadsheet" or "not doing it at all" as a real competitor. What's good and bad about each, and the specific gap this product fills that they don't.
6. **Constraints & non-negotiables.** Anything already fixed and not up for debate: a required integration, an existing brand, a deadline, a mandated platform.
7. **Success.** What tells the stakeholder this worked, if anything measurable is known yet.

For each area, offer a concrete recommendation or example rather than leaving it open-ended; if the user genuinely doesn't know yet, note it as an open question rather than pressing them to invent an answer on the spot.

**Completion criterion:** every area has either a real answer from the stakeholder or an explicit "not yet known" rather than an invented placeholder.

## Step 2: Write the brief

Write `docs/PRODUCT_BRIEF.md` using [`templates/product-brief-template.md`](templates/product-brief-template.md).

## Step 3: Push what's unresolved

Anything that needs real competitive research, a real user segment's input, or a stakeholder who wasn't in this conversation, goes to `docs/UNKNOWNS.md` (see AGENTS.md §2.6) rather than being guessed at or left silently blank in the brief.

## Step 4: Hand off

Point to what's next based on what the brief surfaced, not a fixed default:
- Multiple user types with meaningfully different needs → [`persona`](../persona/SKILL.md) to formalize them.
- Open questions that need real users to answer → [`interview`](../interview/SKILL.md).
- A genuinely multi-stakeholder alignment problem surfaced mid-interrogation → [`workshop`](../workshop/SKILL.md).
- Scope and tasks solid enough to start structuring → [`concepting`](../concepting/SKILL.md).

**Completion criterion:** `docs/PRODUCT_BRIEF.md` exists, every section traces to what the stakeholder actually said, and nothing unresolved was silently invented to fill a gap instead of landing in `docs/UNKNOWNS.md`.
