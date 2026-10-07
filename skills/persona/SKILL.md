---
name: persona
description: >-
  Two modes. `card` (default) builds research-grounded, 2-4 persona profiles from
  interview notes, survey data, or user segments — name, goals, frustrations, behaviors,
  context of use, a defining quote — applying a relevance test to every field and refusing
  to skip the research-grounding question. `day` takes one existing persona card and
  writes its chronological "Day in the Life" walkthrough: numbered scenes tied to actual
  screens, with friction and autonomy points called out inline, feeding prototype UX
  requirements. Use `card` when asked to define user archetypes, target audience, or turn
  research into personas. Use `day` when asked to map a day-in-the-life story or translate
  a persona into prototype user journeys — always ask which persona if `card` has produced
  more than one.
---

# UX Persona & Day-in-the-Life Documentation

Personas are fictional but realistic descriptions of typical or target users — `card`
synthesizes research into a memorable, actionable profile. `day` takes one such profile
and dramatizes it: a chronological walkthrough of their actual day, tied to real screens,
that serves as prototype UX ground truth.

**Not this skill:**
- Researching other companies' products → [`competitors`](../competitors/SKILL.md).
  A competitor's UX pattern is legitimate input to `day`'s friction map, this skill doesn't
  research competitors itself.
- Mapping a real, current-state operational process end-to-end →
  [`journey`](../journey/SKILL.md). `journey` maps a process (actors, steps, handoffs,
  pain points scored by severity × frequency); `day` maps one person's whole day,
  narrative, feeding screen design. Different jobs, easy to conflate by name alone.
- Modeling this product's objects, relationships, or CTAs →
  [`map`](../map/SKILL.md)'s `objects` mode. A persona's goals inform that model; this
  skill doesn't build it.

Say which mode if not specified. Building personas for the first time on a project means
`card`. Wanting a narrative walkthrough of one persona's day means `day` — and `day`
always needs `card`'s output as its subject, never invents one from scratch.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the
  result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut
  padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no
  speculative abstractions, no unrequested scaffolding.

## The research-grounding rule — shared across both modes

**A persona built without research is an assumption document, not a persona.** If no
research exists when `card` is asked to run, flag this clearly and offer either a
lightweight research plan or clearly labeled "proto-personas" that need validation before
they're used to drive design decisions. Never write a card or a day walkthrough that
presents an assumption as an observed fact.

## Mode: card

### Step 1: Establish the research foundation

Ask what research is available. Accepted inputs: interview notes or transcripts, survey
results, field study observations, analytics segments, existing user segments or market
research. Apply the research-grounding rule above if nothing exists.

**Completion criterion:** either real research is in hand, or the output will be
explicitly labeled proto-persona throughout.

### Step 2: Identify user clusters

From the research, group users by shared behaviors and usage patterns, goals and
motivations, frustrations and pain points, and context of use (when, where, how often, on
what device). Merge clusters that are too similar; drop ones peripheral to the product.
Aim for **2-4 personas** for most products — enough to cover meaningful variation without
diluting focus. If more are genuinely needed, say so and explain the tradeoff (each added
persona dilutes team focus and design-decision clarity) rather than refusing outright.

### Step 3: Build each persona

**Required:**
- **Name** — fictional but believable, not generic ("Anna," not "User A").
- **Photo** — describe one if you can't provide it (stock-photo type, not a real person).
- **Age, location, occupation** — enough to anchor context.
- **Tag line** — one grounded, useful sentence capturing their essence, not a clever one.
- **Goals** (2-3) — what they're ultimately trying to achieve.
- **Frustrations / pain points** (2-3) — what currently gets in their way.
- **Behaviors** — how they currently solve the problem: tools, workarounds, habits.
- **Context of use** — required by job or by choice, how often, what device.
- **A quote** — one direct-voice sentence capturing their attitude toward the problem
  space.

**Optional (include only if design-relevant):** experience level with similar products,
tech comfort level, key tasks in the product, decision-making style.

**Never include** a detail that doesn't affect a design decision.

### Step 4: Apply the relevance test

Before finalizing any detail, ask: *would this change a design decision?* If yes, include
it. If no, cut it. A favorite coffee order is noise; a preferred device and time of day is
signal.

### Output Format

```
## [Name], [Age]
[Occupation] · [Location]

> "[Their defining quote]"

**[Tag line]**

### Goals
- ...

### Frustrations
- ...

### Behaviors
- ...

### Context of use
[1-2 sentences on how, when, and where they'd use the product]
```

### Quality checklist (before delivering)

- [ ] Each persona is grounded in real research, or clearly labeled proto-persona.
- [ ] Name and photo aid memorability.
- [ ] Goals and frustrations reflect research, not product-team assumptions.
- [ ] Every included detail passes the relevance test.
- [ ] Tag line is clear and useful, not just clever.
- [ ] Personas feel like distinct characters, not slight variations of each other.
- [ ] 2-4 personas total, or the tradeoff for more was explained.

**Completion criterion:** every persona in the set passes the checklist above.

### Common mistakes to avoid

| Mistake | Fix |
|---|---|
| Building personas from assumptions, not research | Ground every trait in observed data, or label it proto-persona |
| Too many personas | 2-4 is almost always enough; explain the tradeoff for more |
| Including irrelevant details | Apply the relevance test to every field |
| Making the tag line too witty | It should be useful, not entertaining |
| Treating personas as a one-time deliverable | Revisit as more is learned |
| Designing only for the primary persona | Secondary personas represent real edge cases |

## Mode: day

### Step 0: Identify the subject

**Read the existing `card` output first.** If more than one persona exists, ask which one
this walkthrough is for — never assume the first or primary one silently. If no `card`
output exists at all, stop and say so: offer to run `card` first rather than deriving a
fresh archetype inline. A day walkthrough for a persona nobody has actually defined
inherits every risk the research-grounding rule exists to prevent.

**Completion criterion:** a named, already-defined persona is confirmed as the subject
before Step 1 begins.

### Step 1: Extract mental model and workflow shape

From the confirmed persona's card plus any additional domain notes, interviews, or PRDs,
define: primary goals & KPIs (what makes their day successful), cognitive load & pain
points (where they get overwhelmed or slowed down), and tool stack & context switching
(what they're juggling simultaneously). This extends the card's existing goals and
frustrations into a day-shaped structure — it doesn't re-derive them from scratch.

### Step 2: Write the Day-in-the-Life walkthrough

Write it as a sequence of numbered scenes, not a table:

```markdown
## Scene 1 — [Title, e.g. "Morning Triage"]
![screenshot](./screenshots/scene-1.png)

[1-3 sentences of narrative: what's happening, why now, what triggered it]

**What's on screen:**
- [bullet per notable UI element / data point / affordance visible in this scene]
```

Group scenes into realistic phases across the day. Don't force every scene into a rigid
friction/autonomy table — a scene with nothing notable there shouldn't carry an empty
cell for it. Where a scene does hinge on a specific friction point (a compliance
checkpoint, an irreversible action) or an autonomy opportunity (auto-rebalancing, batch
approval), call it out in the scene's own narrative, not a separate column.

If a screenshot isn't available yet (walkthrough written before the prototype exists),
skip the image and write the scene narrative first. Add screenshots once real screens
exist.

### Step 3: Formalize and link

Save to `docs/PERSONA_WALKTHROUGH.md`, or a name specific to the persona (e.g.
`docs/<PERSONA_NAME>_DAY_WALKTHROUGH.md`) if `card` produced more than one. Embed a
summary link in the prototype's `UserMenu` / `PrototypeTools` panel, where one exists.
**Skip this embed step when the research-only setup path is in use** — a research-only
project has no prototype menu to link into.

**Completion criterion:** the walkthrough exists as scenes (not a table), every scene ties
back to the confirmed persona from Step 0, and it's linked from the prototype where one
exists.

## Deliverables & Template

Use [`templates/persona-walkthrough-template.md`](templates/persona-walkthrough-template.md)
for `day` mode output. `card` mode has no separate template file — its Output Format block
above is the template.
