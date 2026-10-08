# Persona: day mode

Part of the [`persona`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

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
