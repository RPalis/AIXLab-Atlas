---
name: journey
description: >-
  Maps how work happens today and where it hurts. Modes: map (current-state swimlane), blueprint
  (service layers and wait times), pain-points (score friction), solutions (fix directions with
  targets), experience (one persona through one scenario). Use when a process is slow or broken, or
  to map a customer journey.
argument-hint: "[map: current-state swimlane | blueprint: service layers | pain-points: score friction | solutions: fix directions | experience: persona scenario journey]"
disable-model-invocation: true
---

# Journey Mapping

Five modes, two different jobs sharing one skill because they're the same *shape* of work — trace a sequence, find where it hurts, evidence every claim — even though `map`/`blueprint`/`pain-points`/`solutions` and `experience` map genuinely different subjects.

- **`map`** (default): the *process* as it exists today — actors, steps, handoffs, systems touched — as a swimlane diagram. `docs/JOURNEY_MAP.md`.
- **`blueprint`**: alternative to `map` for a customer-facing service process where the frontstage/backstage split and cross-team handoff timing are the point.
- **`pain-points`**: for each step, score real friction (severity × frequency) and its root cause. Needs a current-state diagram from `map` or `blueprint`.
- **`solutions`**: for the pain points worth acting on, explore fix directions and set a measurable target.
- **`experience`**: one *persona* through one specific scenario — actions, thoughts, emotions, pain points and opportunities per stage, an emotion curve, every claim cited or marked `ASSUMPTION`. `docs/CUSTOMER_JOURNEY.md`. Does not require `map`/`blueprint` to have run first — it's a different subject, not a later stage of the same one.

Say which mode, or this skill asks. `map` and `blueprint` are alternative starting points for the *process* track, not sequential to each other; `pain-points` and `solutions` build on whichever was used. `experience` is independent of all four — pick it directly when the question is "what does this feel like for one user," not "how does this process actually run."

**Not this skill:**
- A single persona's whole day across many tasks and tools, narrative-driven, feeding screen/scene design → [`persona`](../persona/SKILL.md)'s `day` mode. Persona is about a *person's whole day*; `journey`'s `experience` mode is about *one scenario*, with an emotion curve and per-stage evidence discipline `persona` doesn't have.
- A proposed or future-state workflow (what should happen once something's built) → [`map`](../map/SKILL.md)'s `flow` mode. `journey`'s `map` mode is deliberately as-is; if the process being diagrammed doesn't exist yet, that's `flow` mode, not this.
- Modeling objects/CTAs for something being built → [`map`](../map/SKILL.md)'s `objects` mode, which `journey`'s `solutions` mode hands off to once a fix direction is picked.
- Setting the metrics/targets a whole project is accountable to → [`metrics`](../metrics/SKILL.md). `journey`'s `solutions` mode proposes per-pain-point targets as candidate Key Results; `metrics` is where they get framed against a chosen framework and tracked.
- Turning `experience`'s findings into a backlog → [`problems`](../problems/SKILL.md), which reads this skill's output as one of its inputs.

---

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Modes

Open the reference file for the chosen mode and follow it. Load only that file. Cross-references between modes name the mode, so open that mode's file when one is named.

| Mode | What it does | File |
|---|---|---|
| `map` | current-state swimlane | [references/map.md](references/map.md) |
| `blueprint` | service layers | [references/blueprint.md](references/blueprint.md) |
| `pain-points` | score friction | [references/pain-points.md](references/pain-points.md) |
| `solutions` | fix directions | [references/solutions.md](references/solutions.md) |
| `experience` | persona scenario journey | [references/experience.md](references/experience.md) |
