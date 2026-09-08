---
name: workshop
description: Plan a design-thinking workshop: select activities based on project phase, goals, timing, and participants, produce a written agenda, and optionally build a FigJam board and/or slide deck from it. Use when the user wants to plan or run a design workshop, team offsite, or facilitated working session.
disable-model-invocation: true
---

# Design Workshop

Builds a workshop agenda from a vendored catalog of real design-thinking activities (see [`references/activity-catalog.md`](references/activity-catalog.md)), then optionally turns that agenda into a FigJam board and/or a slide deck.

Positioned as a **Discover/Decide-phase tool** — most workshops happen early, framing the problem before building starts. But a single workshop can legitimately dig end-to-end into one concept or feature, touching Design/Deliver-flavored activities too. The catalog's phase tags are a default starting filter, not a hard restriction.

## Step 1: Establish the workshop parameters

Ask (or infer from existing project docs where possible; don't re-ask what's already known):
- **Project phase**: where is this project right now? (ties to `docs/PERSONA_WALKTHROUGH.md` / `docs/OOUX_OBJECT_MAP.md` existing or not; mirrors the phase-detection logic in [`interview`](../interview/SKILL.md))
- **Goal**: what does this specific workshop need to produce? (e.g. "align stakeholders on scope," "generate feature concepts," "surface and prioritize risks")
- **Timing**: total session length available. This directly constrains how many activities fit.
- **Participants**: who's in the room, and their roles. Affects which activities make sense (e.g. `Stakeholder Map` needs a cross-functional group; `Storyboarding` works with a small design-focused group).

## Step 2: Select activities

Filter the catalog by phase relevance to the stated goal, then narrow further:
- Total activity time must fit the available session time, with room for a break every ~90 minutes and buffer for setup/wrap-up (~15% overhead on top of activity time).
- Sequence activities in a sensible arc: diverge before converge (e.g. `Hopes & Fears` or `Stakeholder Map` before `Prioritization Grid`), ending on something that produces a concrete artifact or next step (`Feedback Grid`, `ROAM Risks`, `Desired Outcomes`) rather than mid-divergence.
- If the goal calls for an activity not in the catalog, say so explicitly rather than force-fitting the closest entry — the catalog is a strong starting set, not exhaustive.

## Step 3: Write the agenda (required output)

```markdown
# Workshop Agenda — [Project Name]

**Goal**: [stated goal]
**Duration**: [total time] · **Participants**: [roles/count]

| Time | Activity | Purpose |
|---|---|---|
| 0:00-0:15 | Intros | [why this activity, tied to the goal] |
| 0:15-0:45 | Stakeholder Map | ... |
| ... | ... | ... |

## Materials Needed
[FigJam board / physical stickies / whiteboard — whatever the format requires]
```

Review this with the user before building anything else — a bad activity match is cheap to fix here, expensive to fix after a FigJam board is already built.

## Step 4 (optional): Build the FigJam board

Only after the agenda is approved. Requires the Figma MCP server connected; follow its `/figma-use` guidance before any write. Create a new FigJam file (or a new page in an existing one) with one section per agenda activity, using the catalog's real instructions text and timing as the section content. Don't paraphrase the instructions, they're already vetted.

## Step 5 (optional): Build a slide deck of the plan

Hand off to [`showcase`](../showcase/SKILL.md) rather than building a second deck generator. The agenda's activity list maps directly onto that skill's slide-per-scene structure (one slide per activity: name, time, purpose).

**Completion criterion:** the agenda's total activity time fits the stated session length including overhead, every activity ties back to the stated goal, and nothing is built (FigJam board or deck) before the agenda itself is approved.
