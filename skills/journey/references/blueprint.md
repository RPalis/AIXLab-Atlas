# Journey: blueprint mode

Part of the [`journey`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

The service-blueprint variant of `map`: same as-is discipline, but for a customer-facing process where *what the customer sees vs. what happens behind the scenes* and *how long each handoff actually takes* are the point — a plain actor-lane swimlane loses both.

### Step 1: Confirm this is the right mode

Ask if it's not already obvious: does this process have a real customer (or end-user) facing side, with work also happening behind the scenes across multiple teams/systems, where the timing of handoffs between them matters? If it's a single-team internal process with no real frontstage/backstage split, `map` mode is simpler and loses nothing — don't default to `blueprint` just because it sounds more thorough. **Autonomous mode** (suite `AGENTS.md` §2.9): if genuinely not obvious from context, default to `map` — it's the simpler of the two and produces the same diagram `blueprint` would if the frontstage/backstage split turns out not to matter. Log the default; a `blueprint` pass adding the frontstage/backstage layers is available afterward on request rather than re-running from scratch.

### Step 2: Identify the process and its boundary

Same as `map` mode Step 1 — a clear start/end trigger and the primary customer/end-user whose experience this traces.

### Step 3: Walk the steps interactively, layer by layer

Same one-at-a-time discipline as `map` mode, but capture each step against the real blueprint layers rather than a single actor lane:
- **Physical Evidence** (optional — skip if this step leaves nothing tangible/visible): what the customer sees or touches at this point (a receipt, a lobby, a confirmation screen)
- **Customer Action**: what the customer does
- **Frontstage Action**: what's visible to the customer (a person or system interacting with them directly)
- **Backstage Action**: what happens out of the customer's sight, enabling the frontstage action
- **Support Process**: the internal system/department/team the backstage action depends on
- **Duration**: how long this step takes
- **Wait time**: if there's a delay before the *next* step starts (a queue, a batch process, an approval sitting in someone's inbox), capture it here — this is usually where the real pain lives, not in the steps themselves

Ask for real numbers, not estimates dressed up as precise ("about a week" is more honest than a guessed "4.5 days" if that's genuinely what's known). Note it as unconfirmed if timing is unclear rather than inventing a plausible one.

### Step 4: Build the blueprint table

Render as a time-ordered Markdown table — columns are steps in sequence, rows are the layers — not a Mermaid diagram; timing and wait-time annotations on every flowchart edge get unreadable fast, and this is how real service blueprints are actually drawn:

```markdown
| | 1. Check in | 2. Wait for room | 3. Consultation |
|---|---|---|---|
| **Physical Evidence** | Kiosk screen, printed ticket | Waiting room | Exam room, chart on tablet |
| **Customer Action** | Checks in at kiosk | Waits, watches for name called | Describes symptoms, asks questions |
| *— Line of Interaction —* | | | |
| **Frontstage** | Kiosk confirms appointment | Nurse calls name | Provider examines, discusses |
| *— Line of Visibility —* | | | |
| **Backstage** | System pulls patient record | Nurse pre-checks vitals, updates chart | Provider documents in EHR |
| *— Line of Internal Interaction —* | | | |
| **Support Process** | Scheduling system | Vitals/EHR system | EHR, billing system |
| **Duration** | 2 min | — | 15 min |
| **Wait time (until next step)** | — | avg 22 min | — |
```

Write to `docs/JOURNEY_MAP.md` under the same `## Current State` heading `map` mode would use (a project has one current-state diagram, in whichever shape actually fits it), with a one-line caption noting the process boundary and that this is the blueprint variant. Use [`templates/journey-map-template.md`](../templates/journey-map-template.md)'s blueprint section for the full shape.

**Completion criterion:** every step has real Frontstage/Backstage/Support entries (not blank rows padded for symmetry — Physical Evidence alone is genuinely optional), every duration/wait-time is either a real confirmed number or explicitly marked unconfirmed, and the layers read as one continuous customer experience top-to-bottom, not disconnected team-by-team logs.

---
