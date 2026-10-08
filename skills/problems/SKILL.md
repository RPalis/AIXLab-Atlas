---
name: problems
description: >-
  Turns research (personas, journeys, pain points) into problem statements and prioritized user
  stories. Never proposes solutions. Use when research exists and needs to become a backlog.
disable-model-invocation: true
---

# Problem Statements & User Stories

Turn validated research into problem statements product teams can act on, then into prioritised, traceable
user stories. ~20 minutes for a persona set with journey maps already in hand.

**Not this skill:**
- Producing the personas, journey maps or interview themes this reads → [`persona`](../persona/SKILL.md),
  [`journey`](../journey/SKILL.md)'s `experience` or `map`/`blueprint` modes, [`interview`](../interview/SKILL.md)'s
  `analysis` mode. This skill turns their findings into backlog items; it doesn't do the research itself.
- The pre-research product brief → [`brief`](../brief/SKILL.md). `brief` captures what the founder already knows
  before any research exists; this skill needs research as input, so it runs after Discover, not instead of `brief`.
- Requirements for a prototype that's already built → [`requirements`](../requirements/SKILL.md), which reads the
  built code and writes Epics, Features and acceptance criteria. This skill's stories come earlier, from research,
  and can seed that doc.
- Proposing a solution → problem statements never include one. That's `brainstorming`'s job, downstream of
  this skill's output.
- Feasibility/market checks → pull those from [`competitors`](../competitors/SKILL.md)' `analysis` or `benchmark`
  modes as supporting evidence, don't invent them here.

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Why use this

Use before: ideation workshops, backlog refinement, sprint planning, wireframing, writing acceptance criteria,
product development.

## What you'll need

**Required:** personas · journey map or identified pain points · business objectives
**Autonomous mode** (suite `AGENTS.md` §2.9): take personas, journeys and pain points from the docs folder (`PERSONA_WALKTHROUGH.md`, `JOURNEY_MAP.md`, interview analysis) and business objectives from `docs/PRODUCT_BRIEF.md` or `docs/OKR.md`. If there's no research at all, a problem statement would be invention: skip, log tier 3 (`../../tools/log-unknown/log-unknown.sh --skill problems --tier 3 "..."`), and stop. Anything not traceable to a doc is labelled `ASSUMPTION`, as the master prompt already requires.

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

Write the approved problem statements and user stories to `docs/PROBLEM_STATEMENTS.md`. They feed
[`brainstorming`](../brainstorming/SKILL.md), [`workshop`](../workshop/SKILL.md) planning, wireframes, and
[`interview`](../interview/SKILL.md)'s `usability` mode.
