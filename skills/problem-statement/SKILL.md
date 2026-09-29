---
name: problem-statement
description: >-
  Transform research findings (personas, journey maps, pain points) into clear problem statements and
  actionable, prioritised user stories. Trigger on "write the problem statement", "create user stories",
  "problem statements and user stories", "prioritise the backlog from research", or when personas/journey
  maps/pain points exist and need to become buildable backlog items.
---

# Problem Statements & User Stories

Turn validated research into problem statements product teams can act on, then into prioritised, traceable
user stories. ~20 minutes for a persona set with journey maps already in hand.

**Not this skill:**
- Producing the personas or journey maps this reads → [`persona`](../persona/SKILL.md),
  [`journey`](../journey/SKILL.md)'s `experience` or `map`/`blueprint` modes. This skill turns
  their findings into backlog items; it doesn't do the research itself.
- Proposing a solution → problem statements never include one. That's `brainstorming`'s job, downstream of
  this skill's output.
- Feasibility/market checks → pull those from [`competitor-analysis`](../competitor-analysis/SKILL.md) or
  [`ux-benchmark`](../ux-benchmark/SKILL.md) as supporting evidence, don't invent them here.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if
  asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep
  substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no
  unrequested scaffolding.

## Why use this

Use before: ideation workshops, backlog refinement, sprint planning, wireframing, writing acceptance criteria,
product development.

## What you'll need

**Required:** personas · journey map or identified pain points · business objectives
**Optional:** research synthesis · existing backlog · technical constraints · product roadmap · success metrics

## The workflow

Review research → Define problems → Create user stories → Prioritise backlog → Review & Share → Get sign-off

**Completion criterion:** every problem statement traces to research or a validated business goal, and no
problem statement contains a proposed solution.

## The master prompt

> You are a Senior Product Manager and UX Strategist. Your role is to transform validated research into clear
> problem statements and actionable user stories. Your objective is to help product teams understand what
> problem should be solved before deciding how to solve it. Never propose solutions inside problem statements.
> Every problem statement and user story must be traceable back to research or validated business goals. If
> evidence is missing, clearly label it as `ASSUMPTION`. Do not present assumptions as facts.
>
> Before you begin: ask up to five clarifying questions if important information is missing.
>
> Identify the key user problems. For each problem statement include: Problem title · Description · Supporting
> research · User impact · Business impact · Confidence. Do not include proposed solutions.
>
> For each validated problem, generate user stories using the format: As a... I want to... so that... Also
> include: Priority · Supporting evidence · Success criteria · Dependencies · Risks or assumptions.
>
> Prioritise the stories using: User value · Business value · Frequency · Confidence · Implementation effort.
> [`feature-prioritization`](../feature-prioritization/SKILL.md) has a fuller framework if this simple weighting
> isn't enough for the backlog at hand.
>
> Finally produce: (1) Executive Summary, (2) Problem Statements, (3) User Stories, (4) Success Criteria,
> (5) Prioritised Backlog, (6) Assumptions & Validation Checklist. Ensure every problem statement and user
> story can be traced back to research wherever possible.

## Final outputs (all six required)

Problem Statements (no proposed solutions) · User Stories (linked to validated need + business goal) · Success
Criteria · Prioritised Backlog (user value × business value × frequency × confidence × effort) · Assumptions &
Validation Checklist.

## Human review required before backlog entry

- [ ] Every problem statement supported by research
- [ ] User stories describe outcomes, not solutions
- [ ] Priorities validate against business objectives
- [ ] Dependencies and technical feasibility reviewed

**Treat the output as a first draft, not a final product backlog.**

## What's next

Feed the approved problem statements and user stories to the stage folder. Keep prompts/context in the same
task-stage folder — this is the reusable working set for downstream steps. Use in
[`brainstorming`](../brainstorming/SKILL.md), workshop planning, wireframes, usability test scripts.
