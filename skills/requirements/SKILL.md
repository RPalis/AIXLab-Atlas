---
name: requirements
description: >-
  Writes a requirements doc from a built prototype: Epics, Features, user stories and acceptance
  criteria. Can publish to Jira or Azure DevOps through a connected MCP server. Use when asked for a
  PRD, backlog or tickets.
disable-model-invocation: true
---

# Requirements Synthesis

Turns a built prototype into a **requirements doc**: Epics, each containing Features with user stories and acceptance criteria, written from what the prototype *actually does* rather than what was originally proposed. This is the reverse direction of [`map`](../map/SKILL.md)'s `objects` mode, which models objects before code exists — `requirements` runs after, reading the finished (or near-finished) thing back into product language for a PM, stakeholder, or tracker.

**Not this skill:**
- Modeling objects before or during a build → [`map`](../map/SKILL.md)'s `objects` mode.
- A narrative stakeholder presentation → [`showcase`](../showcase/SKILL.md).
- End-user "how to use this" documentation → [`guide`](../guide/SKILL.md).
- Recording *why* a specific call was made → [`decisions`](../decisions/SKILL.md); this skill links to existing ADRs, it doesn't write new ones.

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Step 1: Gather the source material

Read, in this order of trust (real code wins over docs when they disagree):

1. **The actual codebase**: routes, components, and `shared/types.ts`/`shared/workflow.ts` or equivalent, for what's genuinely built versus stubbed or planned.
2. **`docs/OOUX_OBJECT_MAP.md`**, if present: Objects map to candidate Epics, CTAs to candidate Features. If missing or drifted from the code, note that in Step 4 rather than silently trusting it.
3. **`docs/PERSONA_WALKTHROUGH.md`**, if present: supplies the `<actor>` and `<benefit>` for user stories, and the Overview section's framing.
4. **`DESIGN.md`** and **`docs/adr/`**: non-obvious constraints and rejected alternatives worth a one-line callout on the Feature they affect, not restated in full.
5. **`docs/UNKNOWNS.md`**, if present: open questions become Out of Scope candidates rather than invented answers.

**Completion criterion:** every Epic/Feature traces to something real, either code that exists or a doc backing it, not a generic guess at what a prototype like this "probably" has.

## Step 2: Derive Epics and Features

- An **Epic** is a cohesive capability area, usually one OOUX Object or a tight cluster of related objects (e.g. the `Submission` object and its review lifecycle becomes one Epic, not one Epic per CRUD action).
- A **Feature** under an Epic is one user-facing capability, usually one CTA or a small group of tightly coupled CTAs (e.g. "Submit for Review" and "Withdraw Submission" as separate Features under the Submission Epic).
- For each Feature, write:
  - **User stories**: `As a <actor>, I want <capability>, so that <benefit>`, actor and benefit sourced from the persona walkthrough where one exists, not invented.
  - **Acceptance criteria**: a checklist derived from the object's actual CTA rules and states in code (who can trigger it, what states it moves between, validation that actually exists), not generic boilerplate criteria.
  - **Status**: `Built`, `Partial`, or `Planned`, based on what Step 1 actually found in code, not what the docs claim.

Confirm the Epic/Feature breakdown with the user before writing the full doc if the prototype is large enough that the grouping is a real judgment call (more than ~6 Epics, or an Object that could plausibly split two ways). For a small prototype, proceed directly to Step 3. **Autonomous mode** (suite `AGENTS.md` §2.9, tier 2): proceed with the best-supported grouping rather than pausing — it's correctable later, not a one-way door. Note in `docs/REQUIREMENTS.md` itself (a short line under the affected Epic) that the split was an autonomous judgment call, and log it (`../../tools/log-unknown/log-unknown.sh --skill requirements --tier 2 "..."`).

## Step 3: Write the doc

Write `docs/REQUIREMENTS.md` using [`templates/requirements-template.md`](templates/requirements-template.md). Link each Epic back to its source OOUX Object and any relevant ADR rather than re-explaining decisions already recorded there.

**Completion criterion:** a PM who has never seen the prototype could read this doc and understand what it does, in Epic/Feature/acceptance-criteria shape, without needing to open the code.

## Step 4: Offer tracker export (optional)

Check whether a Jira or Azure DevOps MCP server is already connected (look for tools whose names indicate one, e.g. an `atlassian`/`jira` or `azure-devops`/`ado` prefix). Never assume one is present, and never ask the user to set one up; if neither is connected, skip this step and finish at the markdown doc.

If one is connected, offer to publish:
- Each **Epic** as a parent-level issue (Epic issue type in Jira, or an Azure DevOps Epic work item).
- Each **Feature** as a child issue/work item under its Epic, using the tracker's native parent/child or Epic-link relationship, not just a text reference.
- Carry the user stories and acceptance criteria into the issue body as-is.

Confirm the target project/board with the user before creating anything, and report back what was created (issue keys/links), the same way [`figma`](../figma/SKILL.md) confirms scope before writing to an external system. **Autonomous mode:** this stays tier 3 (§2.9) regardless of an MCP being connected — a write to a shared tracker is never a default-and-log decision. Skip the export, finish at the markdown doc, and log that a tracker export is available once a target project/board is confirmed.
