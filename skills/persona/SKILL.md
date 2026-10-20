---
name: persona
description: >-
  Builds research-grounded persona cards (card mode) and Day in the Life walkthroughs tied to real
  screens (day mode). Use when asked to define user archetypes or write a persona's day.
argument-hint: "[card: build persona profiles | day: day-in-the-life walkthrough]"
disable-model-invocation: true
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
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Read the wiki first
- If the project has a wiki, read it before you ask the user, and cite source IDs such as `(S-004)`. Read only: the [`wiki`](../wiki/SKILL.md) skill alone writes to it. Rules: [`reading-rule.md`](../wiki/references/reading-rule.md).

## The research-grounding rule — shared across both modes

**A persona built without research is an assumption document, not a persona.** If no
research exists when `card` is asked to run, flag this clearly and offer either a
lightweight research plan or clearly labeled "proto-personas" that need validation before
they're used to drive design decisions. Never write a card or a day walkthrough that
presents an assumption as an observed fact.

## Modes

Open the reference file for the chosen mode and follow it. Load only that file. Cross-references between modes name the mode, so open that mode's file when one is named.

| Mode | What it does | File |
|---|---|---|
| `card` | build persona profiles | [references/card.md](references/card.md) |
| `day` | day-in-the-life walkthrough | [references/day.md](references/day.md) |

## Deliverables & Template

Use [`templates/persona-walkthrough-template.md`](templates/persona-walkthrough-template.md)
for `day` mode output. `card` mode has no separate template file — its Output Format block
above is the template.
