---
name: metrics
description: >-
  Define OKRs (Objectives and Key Results) for a product using the right metrics framework for its medium and adoption model — HEART (Google's framework, opt-in digital products), CASTLE (NN/g's framework, mandatory-use digital/workplace tools), or SELECT (physical tools and services: Success rate, Error reduction, Learnability, Efficiency, Cognitive & Physical Load, Throughput). Each Key Result gets tagged with its framework category. Discover-phase, usable standalone or after brief/journey. Writes docs/OKR.md. Use when asked to define OKRs, KPIs, success metrics, or goals/targets for a product, or when journey's solutions mode has produced targets that need framing against a real metrics framework.
---

# Metrics: OKRs & KPIs

Turns "what does success look like" into Objectives with measurable Key Results, each tagged against a metrics framework chosen for the product's actual medium and adoption model — not a generic template applied regardless of context.

**Not this skill:**
- Scoring how good the current build actually is (hierarchy, cognitive load in the craft sense, accessibility, code standards) → [`audit`](../audit/SKILL.md). `metrics` sets the target; `audit` is one way of checking progress toward a craft-related one.
- Turning the built prototype into Epics/Features/user stories for a backlog → [`requirements`](../requirements/SKILL.md).
- Mapping a process and finding where it hurts → [`journey`](../journey/SKILL.md). `journey`'s `solutions` mode proposes per-pain-point targets; this skill is where those targets get framed as real Key Results against a chosen framework, alongside whatever other Objectives the product needs beyond process pain points.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Step 1: Pick the framework

Two questions decide it. Answer from `docs/PRODUCT_BRIEF.md` if it exists and is clear on these points; ask directly if it doesn't, or if the brief is ambiguous — don't guess at either answer.

**Question 1 — medium:** is this primarily a **physical** tool or service (a kiosk, a handheld device, an in-person service process, hardware) or a **digital** product?
- Physical → **SELECT**, skip Question 2.
- Digital → continue.

**Question 2 — adoption model:** can users choose not to use this, or leave if they don't like it (**opt-in** — most consumer apps, purchased B2B SaaS a customer could churn from), or is usage **mandatory** for whoever has to use it (**mandatory-use** — internal tools, intranets, employer-mandated enterprise software, healthcare/government systems)?
- Opt-in → **HEART**
- Mandatory-use → **CASTLE**

### The three frameworks

**HEART** (Google; opt-in digital products) — pick one or two categories that are the actual focus, not all five:
- **Happiness**: attitudes, gathered via survey (satisfaction, perceived ease of use, NPS)
- **Engagement**: depth of involvement (visit frequency, content created/shared)
- **Adoption**: new-user or new-feature uptake (upgrades, first-time purchases)
- **Retention**: keeping existing users over time (renewal rate, repeat usage)
- **Task Success**: efficiency/effectiveness/error rate on key tasks

**CASTLE** ([NN/g](https://www.nngroup.com/articles/castle-framework/); mandatory-use digital/workplace tools — retention and adoption don't mean anything when usage isn't a choice):
- **Cognitive Load**: mental effort to complete key tasks, working-memory burden, resumability after interruption
- **Advanced Feature Usage**: uptake of optional-but-beneficial features (accelerators, customization)
- **Satisfaction**: how users feel, via survey/post-task questionnaire/analytics signals (rage clicks)
- **Task Efficiency**: how quickly users complete key workflows (time-on-task, steps)
- **Learnability**: effort/time for a new user to reach effective use, tracked longitudinally
- **Errors**: data-entry mistakes and system errors that disrupt workflows

**SELECT** (this suite's own framework; physical tools and services):
- **Success rate**: task completion rate in the real physical interaction
- **Error reduction**: mistakes and their real-world consequences, often safety-relevant in physical contexts
- **Learnability**: first-touch effectiveness — no tooltips or help docs on a kiosk, it has to work on try one
- **Efficiency**: time/steps to complete the interaction
- **Cognitive & Physical Load**: mental effort *and* physical exertion — reach, strain, motion, fatigue — as one combined dimension, since both are "what this costs the user's body and brain to operate"
- **Throughput**: volume handled over time (units processed/hour, queue clearance rate)

If none of the three genuinely fits (a hybrid physical/digital product, or a product that's opt-in for some users and mandatory for others), say so explicitly and propose which framework's categories come closest, or a custom set — don't force a bad fit silently.

## Step 2: Define Objectives

An Objective is a qualitative, ambitious statement of what success looks like for a defined period (a quarter, a phase, a launch) — not a metric itself. Ask what the product is actually trying to achieve right now, distinct from its full product vision in `docs/PRODUCT_BRIEF.md`. 2-4 Objectives is normal; more than that usually means the period is trying to cover too much.

## Step 3: Define Key Results per Objective, tagged by category

For each Objective, 2-4 Key Results — specific, measurable, time-bound. Every Key Result gets tagged with one category from the chosen framework (`[Task Efficiency]`, `[Cognitive & Physical Load]`, etc.), so it's traceable to *why* it matters, not just a number someone picked. A Key Result that doesn't map to any category in the framework is a signal the framework choice needs revisiting, or that this Key Result belongs to a different Objective.

State the current baseline alongside the target wherever it's known ("baseline: unknown, first measurement due after launch" is an honest answer — don't invent a baseline).

**Candidate source:** if `docs/JOURNEY_MAP.md` has a `## Solutions` section, its per-pain-point targets are strong Key Result candidates — offer them explicitly rather than starting purely from a blank page, but don't include one just because it exists; it still needs to trace to a real Objective for this period.

## Step 4: Write docs/OKR.md

```markdown
# OKRs

**Framework:** CASTLE (mandatory-use digital tool)

## Objective: Cut new-hire ramp time on the claims queue

- **KR1** [Learnability] Median time to first successful claim processed independently drops from 9 days (baseline) to 4 days
- **KR2** [Cognitive Load] NASA-TLX score on the claims intake task drops from 62 (baseline) to under 45
- **KR3** [Errors] Data-entry error rate on claims drops from 6% (baseline) to under 2%
```

Use [`templates/okr-template.md`](templates/okr-template.md) for the full shape.

## Step 5: Hand off

- Baselines that need real measurement before a target is trustworthy → note it in `docs/UNKNOWNS.md` or point at whichever `audit` mode would surface it (craft-related cognitive load, a11y-related errors).
- Objectives tied to a specific process fix → back to [`journey`](../journey/SKILL.md)'s `solutions` mode if the fix direction itself isn't settled yet.
- Once built, checking progress → `audit`'s relevant mode for craft/a11y-flavored Key Results; a real usability test or `interview`'s validation mode for the rest.

**Completion criterion:** the framework choice is stated with its reasoning (medium + adoption model, not just picked), every Key Result is tagged with a real category from that framework, every target has a stated baseline or an explicit "unknown, to be measured," and nothing was invented to fill a gap instead of landing in `docs/UNKNOWNS.md`.
