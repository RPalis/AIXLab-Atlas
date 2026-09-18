---
name: brief
description: >-
  Extracts a mile-wide, inch-deep product brief before any deeper user research exists: what the product is, who it's for, the distinct user types, their core tasks, devices and context of use, the competitive landscape, and constraints. On a brand-new idea this is a stakeholder interrogation; on an existing product it's a reconnaissance pass — drafted from the codebase plus whatever other suite docs already exist (personas, object map, ADRs, etc., handed off by setup) — then confirmed with the stakeholder after. Worth running even mid-lifecycle, not just pre-Discover, as the lay-of-the-land doc most often skipped when the suite is layered onto something already underway. Writes docs/PRODUCT_BRIEF.md and pushes anything genuinely unresolvable to docs/UNKNOWNS.md. Runs after setup, before Discover's user-research skills. Use when starting a brand-new product idea, when asked for a product brief for an app that already exists, or to get what's in the founder's head down before research begins.
---

# Product Brief

`setup` builds the repo's doc shell. `brief` fills in the first real content: a mile-wide, inch-deep look at what's actually being built, before `workshop` brings in a room full of people or `interview` goes out to real users. Where the content comes from depends on what's already there: straight from whoever has the idea in their head on a new product (Step 1), or read out of the working codebase and then confirmed on an existing one (Step 0.5).

**Not this skill:**
- Formalizing user archetypes from research already gathered → [`persona`](../persona/SKILL.md). `brief` is one of the "domain briefs" persona expects as input, not a replacement for it.
- Building a question bank for interviewing real external users → [`interview`](../interview/SKILL.md).
- Planning a multi-stakeholder working session → [`workshop`](../workshop/SKILL.md). `brief` is one person's (or one aligned team's) head, not a group session with activities and timing.
- Modeling objects and CTAs → [`map`](../map/SKILL.md)'s `objects` mode, which needs the scope `brief` establishes first.
- A real competitive landscape scan — finding competitors the stakeholder doesn't already know about, profiling their features/workflow/UX → [`competitors`](../competitors/SKILL.md)'s `discover` mode. `brief`'s own competitive-landscape question only captures what's already top of mind.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Step 0: Explore, then choose pace

Check `README.md` (the one-line purpose `setup` wrote) and `docs/UNKNOWNS.md` first — don't re-ask what's already answerable from context.

Ask the user how they want to run this:
- **One question at a time** (recommended for a fuzzy or early idea): the same discipline as [`interrogate`](../interrogate/SKILL.md), each question paired with a recommendation or example, waiting for an answer before moving on.
- **Themed batches**: the same seven areas below, grouped into rounds (Product · Audience & Tasks · Devices & Context · Competitive Landscape · Constraints & Success), asked together per round for a faster pass when the user already has clarity.

Either pace covers the same ground; only the delivery cadence differs. This is Step 1's pace; skip straight to Step 0.5 first if there's a real product to read.

## Step 0.5: Existing product? Draft from the codebase first

If Step 0 (or `setup`, handing off) turned up a real `src/` with actual application code, not just a scaffold stub, don't open with a blank interrogation — a lot of the answer is already sitting in the repo. Read before asking:

- `README.md` and any existing docs for the stated purpose and audience.
- `package.json` (name, description, dependencies — a payments SDK or a calendar library says something about scope).
- Route/page/screen structure and top-level navigation for what the product actually lets someone do.
- Component and page names for the user-facing vocabulary already in use (reuse it in the brief rather than inventing new terms for the same things).
- Any auth/role logic for distinct user types already built, even if never written down as such.

**If `setup` handed off an inventory of the suite's other living docs** (`PERSONA_WALKTHROUGH.md`, `OOUX_OBJECT_MAP.md`, `DESIGN.md`, `docs/adr/`, `docs/REQUIREMENTS.md`, etc.), read whichever of those already exist too — a project this far along has more signal sitting in already-written docs than in raw code. Personas already answer audience & user types; an object map already answers core tasks; ADRs may already answer constraints or rejected alternatives worth citing. Draft from the fullest picture available, not just what Step 0.5's own bullet list above would find from code alone.

Draft a tentative answer for each of the seven areas in Step 1 from what this turns up, marking every one `(inferred from codebase — confirm)`. Then walk the stakeholder through confirming or correcting each, batched or one at a time per their Step 0 pace choice — same as a normal interrogation but starting from a draft instead of a blank page. Areas nothing existing can answer (competitive landscape, non-technical constraints, what "success" looks like) still need a real answer from the stakeholder, not a guess.

**Completion criterion:** every inferred answer was actually confirmed or corrected by the stakeholder, not left standing on the inference alone.

## Step 1: Interrogate

The same seven areas whether this is a blank-page interrogation or confirming a Step 0.5 draft against the stakeholder:

1. **The product.** One sentence of what it is, the problem it solves, and why it needs to exist now rather than never or already.
2. **Audience & user types.** Not just "who," but the distinct roles if there's more than one (e.g. an admin and an end customer are different user types with different goals). For each: their primary goal in using this product.
3. **Core tasks.** Per user type, the top tasks they need to accomplish, in priority order, and what "done" looks like for each. This is the seed [`map`](../map/SKILL.md)'s `objects` mode will later turn into CTAs.
4. **Devices & context of use.** Desktop, mobile, tablet, or a mix; the primary environment (office desk, on the move, a shop floor); any accessibility need already known. Feeds [`scaffold`](../scaffold/SKILL.md)'s site-type choice later.
5. **Competitive landscape.** Named competitors or alternatives the stakeholder already knows, off the top of their head, including "doing it in a spreadsheet" or "not doing it at all" as a real competitor. This is a quick capture, not a research pass — if the stakeholder genuinely doesn't know who else is out there, or the answer is thin, note that explicitly and point to [`competitors`](../competitors/SKILL.md)'s `discover` mode rather than pressing them to guess.
6. **Constraints & non-negotiables.** Anything already fixed and not up for debate: a required integration, an existing brand, a deadline, a mandated platform.
7. **Success.** What tells the stakeholder this worked, if anything measurable is known yet.

For each area, offer a concrete recommendation or example rather than leaving it open-ended; if the user genuinely doesn't know yet, note it as an open question rather than pressing them to invent one on the spot.

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
- Competitive landscape came back thin, or the stakeholder said they don't know who else is out there → [`competitors`](../competitors/SKILL.md)'s `discover` mode.
- Scope and tasks solid enough to start structuring → [`map`](../map/SKILL.md)'s `objects` mode.

**Completion criterion:** `docs/PRODUCT_BRIEF.md` exists, every section traces to what the stakeholder actually said, and nothing unresolved was silently invented to fill a gap instead of landing in `docs/UNKNOWNS.md`.
