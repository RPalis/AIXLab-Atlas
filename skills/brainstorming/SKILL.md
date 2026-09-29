---
name: brainstorming
description: >-
  Turn one signed-off problem statement into many ideas, then a scored shortlist the team takes into sketching
  — never a single winner. Use before defining information architecture, solution definition, building
  wireframes, or committing to a single direction. Trigger on "run a brainstorm", "ideation session",
  "generate ideas for this problem", "what directions could we take", or when a problem statement exists and
  needs options before a direction is picked.
---

# Brainstorming Planner

Runs a structured ideation session against one problem: diverge into many ideas, then converge into a small,
scored set of directions — not a single winner. ~20-30 minutes.

**Not this skill:**
- Producing the problem statement this reads → [`problem-statement`](../problem-statement/SKILL.md). This
  skill takes one signed-off problem statement as input; it doesn't write one.
- Planning the session logistics (agenda, timing, activities for a live workshop) →
  Atlas's `workshop` `plan` mode, whose activity catalogue this skill's session can draw from as an optional
  input.
- Deciding the site's information architecture or building wireframes from the chosen direction → those
  happen after this skill, once a direction is picked and validated.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if
  asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep
  substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no
  unrequested scaffolding.

## The evidence rule

Every candidate direction stays tied to the problem statement it answers. A direction with no line back to
the problem, or a scored direction with no stated basis for its score, doesn't belong in the shortlist —
**flag it, don't silently drop it**, so the team can see what got cut and why.

## What you'll need

**Required**
- One signed-off problem statement (the [`problem-statement`](../problem-statement/SKILL.md) output)
- Constraints — tech, brand, timeline
- Top research findings for context

**Optional**
- A workshop brainstorm plan (Atlas's `workshop` `plan` mode output)
- The user journey and previous outputs
- Dev data, inputs and constraints

If any required input is missing, ask **up to three** clarifying questions before ideating. Do not start
until the context is sufficient.

## The workflow

```
Frame the problem → Create the activity boards → Generate 15 ideas → Add breakers → Cluster into directions → Score value/effort/risk → Shortlist with team
```

### Step 1 — Frame the problem
Restate the problem statement, its success criteria, and the constraints (tech, brand, timeline) for
confirmation before generating anything.

### Step 2 — Create the activity boards
Lay out the session structure: Divergent Thinking (How-Might-We questions, assumptions, opportunities, risks)
→ Idea Generation (AI exploration, competitor inspiration, wild ideas, feasible ideas) → Convergence
(clustering, prioritisation, impact vs effort).

### Step 3 — Generate 15 ideas
One line each. Breadth over depth at this step — a narrow idea list makes the convergence step meaningless.

### Step 4 — Add assumption-breakers
Add **3 assumption-breakers**: "what if we didn't…" — each one names the specific assumption it breaks, not
a generic provocation.

### Step 5 — Cluster into directions
Group all ideas (the 15 plus the breakers) into **3-4 named directions**. A direction needs a name concrete
enough that the team can discuss it without re-explaining what it means each time.

### Step 6 — Score each direction
Score **user value / effort / risk**, each High-Medium-Low, with the one-line reasoning behind each score.
Flag any direction that ignores a stated constraint.

**Completion criterion:** every direction traces to the problem statement, every score has a stated basis,
and every constraint-violating direction is flagged, not silently dropped.

### Step 7 — Shortlist with team
Present the scored list. **The team picks the direction — this skill never picks for them.** Bring the full
scored list, not a single recommended winner.

## Review pass — before handing it over

Summarise:
1. Which directions respect the constraints.
2. Which assumptions the breakers expose.
3. What needs validating before sketching starts.

Flag any direction that ignores a constraint.

## Final outputs

1. **Session script** — objective, problem statement, success criteria, constraints, activities.
2. **Activity board** for each stage — Divergent Thinking / Idea Generation / Convergence, with time
   allotted for each.
3. **Named Directions** — 3-4 clustered directions, each scored user value / effort / risk (H-M-L).
4. **Sketching Shortlist** — the scored list the team takes into sketching, not a single winner.

Example — *"What if setup needed zero data, everything imported later?" — value: High / risk: Medium.*

## Human review required

Before anything gets sketched:
- The team picks the direction, not this skill.
- Sanity-check feasibility with engineering first — recommended, not optional.
- Bring the scored list to the team, not a single winner.
- Watch for ideas untied to the problem, or unscored directions — IA and wireframes will organise around the
  loudest idea in the room, not the best one, unless the scoring actually did its job.

**Treat the output as a first draft, not final research.**

## What's next

- Re-evaluate whether another session is needed.
- Summarise the key takeaways and directions.
- Feed the executive summary to the next step — typically
  [`information-architecture`](../information-architecture/SKILL.md) or `map`'s `flow` mode.
- Keep prompts / `.md` files / chat-history context / tooling in the same task-stage folder — this is the
  reusable working set for downstream steps.
