---
name: persona
description: Formalize user personas, mental models, pain points, and chronological 'Day in the Life' walkthroughs that drive prototype requirements. Use when user wants to document user archetypes, map a day-in-the-life story, or translate research into prototype user journeys.
disable-model-invocation: true
---

# UX Persona & Journey Documentation

This skill transforms qualitative research, interviews, or domain requirements into structured **Persona Walkthrough Documents** and **Day in the Life** narratives that serve as the foundational truth for prototype UX design.

---

## Core Objectives

1. **Ground Prototype Features in User Reality**: Every feature in the prototype must tie to a specific persona goal, decision trigger, or pain point.
2. **Chronological Journey Mapping**: Map the user's workflow sequentially (e.g. Morning Scan -> Client Meeting Prep -> Live Review -> Compliance Lock -> Post-Market Wrap).
3. **Friction & Autonomy Modeling**: Identify high-friction friction zones (e.g., compliance checkpoints, irreversible actions) and autonomy opportunities (e.g., auto-rebalancing, batch approvals).

---

## Process

### Step 1: Extract Persona Archetype & Mental Model
Gather all available domain notes, interviews, or PRDs. Define:
- **Role & Title**: (e.g. Senior Wealth Advisor, Compliance Officer, Tech Intake Manager)
- **Primary Goals & KPIs**: What makes their day successful?
- **Cognitive Load & Pain Points**: Where do they get overwhelmed or slowed down?
- **Tool Stack & Context Switching**: What apps are they juggling simultaneously?

### Step 2: Write the "Day in the Life" Walkthrough
Write it as a **sequence of numbered scenes**, not a table. This is the format that actually reads well and gets used in practice. Each scene is a short section:

```markdown
## Scene 1 — [Title, e.g. "Morning Triage"]
![screenshot](./screenshots/scene-1.png)

[1-3 sentences of narrative: what's happening, why now, what triggered it]

**What's on screen:**
- [bullet per notable UI element / data point / affordance visible in this scene]
```

Group scenes into realistic phases across the persona's day (e.g. Morning Ingestion & Alert Triage → High-Value Focus Work → Collaboration & Sign-Off → Wrap-Up & Next-Day Horizon), but don't force every scene into a rigid table, since a scene that has no meaningful "friction" or "system behavior" shouldn't carry an empty table cell for it. Where a scene *does* hinge on a specific friction point or autonomy rule (a compliance checkpoint, an irreversible action, an auto-rebalancing decision), call it out explicitly in the scene's narrative rather than a separate column. It reads better and doesn't get skipped.

If a screenshot isn't available yet (walkthrough written before the prototype exists), skip the image and write the scene narrative first. Screenshots get added once real screens exist.

### Step 3: Formalize into Markdown & Link in Prototype
Save the output to `docs/PERSONA_WALKTHROUGH.md` (or a name specific to the persona, e.g. `docs/ADVISOR_DAY_WALKTHROUGH.md`) in the project repository.
Embed a summary link in the prototype's `UserMenu` / `PrototypeTools` panel.

---

## Deliverables & Template

Use the template at [`templates/persona-walkthrough-template.md`](templates/persona-walkthrough-template.md) for generating consistent documentation.
