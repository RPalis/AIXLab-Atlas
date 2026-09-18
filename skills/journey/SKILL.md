---
name: journey
description: >-
  Map a real, current-state process end-to-end (not a proposed one), find where it actually hurts, and scope what to fix. Four modes — map (swimlane diagram of the process as it exists today, actors/steps/handoffs) or blueprint (service-blueprint variant for customer-facing processes: physical evidence/customer/frontstage/backstage/support-process layers, plus duration and cross-team handoff wait times) as alternative starting points, then pain-points (score each step's friction by severity x frequency, with root cause) and solutions (explore directions per pain point and set a measurable target) building on whichever was used. Discover-phase, before Decide. Distinct from persona's Day in the Life (a person's whole day, narrative, feeds screen design) and map's flow mode (a proposed/future-state workflow). Use when a stakeholder describes a broken or slow process, before proposing a fix to a workflow, when asked for a service blueprint, or when asked to journey-map, process-map, or find pain points in how something works today.
---

# Journey Mapping

Four modes, one artifact: `docs/JOURNEY_MAP.md`. Where this process actually stands today, where it actually hurts, and what's worth fixing first — grounded in the current state, not a proposed one.

- **`map`** (default): the process as it exists today — actors, steps, handoffs, systems touched — as a swimlane diagram.
- **`blueprint`**: alternative to `map` for a customer-facing service process where the frontstage/backstage split and cross-team handoff timing are the point — the real service-blueprint layers (Physical Evidence, Customer Actions, Frontstage, Backstage, Support Processes), plus duration per step and wait time at each handoff.
- **`pain-points`**: for each step, score real friction (severity × frequency) and its root cause. Needs a current-state diagram from `map` or `blueprint` to run against.
- **`solutions`**: for the pain points worth acting on, explore fix directions and set a measurable target.

Say which mode, or this skill asks — including which of `map`/`blueprint` fits, if it's not obvious (see `blueprint`'s Step 1). `map` and `blueprint` are alternative starting points, not sequential to each other; `pain-points` and `solutions` build on whichever was used, and aren't required to run in the same sitting — they're re-run standalone later (a process changes, a fix ships, worth re-scoring).

**Not this skill:**
- A single persona's whole day across many tasks and tools, narrative-driven, feeding screen/scene design → [`persona`](../persona/SKILL.md)'s Day in the Life walkthrough. Persona is about a *person*; `journey` is about a *process* — one might narrate a morning, the other maps how expense approvals actually move through four people and two systems.
- A proposed or future-state workflow (what should happen once something's built) → [`map`](../map/SKILL.md)'s `flow` mode. `journey`'s `map` mode is deliberately as-is; if the process being diagrammed doesn't exist yet, that's `flow` mode, not this.
- Modeling objects/CTAs for something being built → [`map`](../map/SKILL.md)'s `objects` mode, which `journey`'s `solutions` mode hands off to once a fix direction is picked.
- Setting the metrics/targets a whole project is accountable to → [`metrics`](../metrics/SKILL.md). `journey`'s `solutions` mode proposes per-pain-point targets as candidate Key Results; `metrics` is where they get framed against a chosen framework and tracked.

---

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Mode: map

### Step 1: Identify the process and its boundary

Ask (don't assume): what process, where does it start and end, and who's the primary actor whose journey this traces. A process without a clear start/end trigger ("handling customer requests" is too broad; "a support ticket from submission to resolution" has a boundary) produces an unusable diagram — narrow it before mapping.

### Step 2: Walk the steps interactively

Same discipline as [`interrogate`](../interrogate/SKILL.md) and `map`'s `objects` mode: one step at a time, confirm before moving on, don't invent steps nobody described. For each step, capture:
- **Actor/lane**: who does this step (a role, not a person's name)
- **Action**: what actually happens, in plain language
- **System(s) touched**: tools, forms, spreadsheets, approvals — whatever's actually used, including informal ones ("a Slack DM to the manager" is a real system if that's how it actually works)
- **Handoff**: what moves to the next actor, and how (an email, a status change, a physical form)

Capture the process **as it actually runs**, including workarounds and informal steps nobody put in a manual — that's usually where `pain-points` mode finds the most. Don't smooth it into how it's supposed to work on paper.

### Step 3: Build the swimlane diagram

Render as Mermaid `flowchart TD`, one subgraph per actor/lane (same subgraph-by-group technique as `map`'s `site` mode):

```mermaid
flowchart TD
    subgraph Requester["Requester"]
        A[Submit expense form] --> B[Attach receipts]
    end
    subgraph Manager["Manager"]
        C{Approve?}
    end
    subgraph Finance["Finance"]
        D[Enter into ledger]
        E[Issue reimbursement]
    end
    B --> C
    C -->|Yes| D --> E
    C -->|No| F[Return to requester]
    F --> A
```

Keep node labels to the action, not the full narrative (3-6 words, matching `map`'s `flow` mode convention). Write to `docs/JOURNEY_MAP.md` under a `## Current State` heading, with a one-line caption noting the process boundary from Step 1. Use [`templates/journey-map-template.md`](templates/journey-map-template.md) for the full document shape (all three sections; `pain-points` and `solutions` modes append to the same file).

**Completion criterion:** every step traces to something the actor actually confirmed happens (not assumed or idealized), every actor has their own lane, and the diagram's handoffs match what Step 2 captured.

---

## Mode: blueprint

The service-blueprint variant of `map`: same as-is discipline, but for a customer-facing process where *what the customer sees vs. what happens behind the scenes* and *how long each handoff actually takes* are the point — a plain actor-lane swimlane loses both.

### Step 1: Confirm this is the right mode

Ask if it's not already obvious: does this process have a real customer (or end-user) facing side, with work also happening behind the scenes across multiple teams/systems, where the timing of handoffs between them matters? If it's a single-team internal process with no real frontstage/backstage split, `map` mode is simpler and loses nothing — don't default to `blueprint` just because it sounds more thorough.

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

Write to `docs/JOURNEY_MAP.md` under the same `## Current State` heading `map` mode would use (a project has one current-state diagram, in whichever shape actually fits it), with a one-line caption noting the process boundary and that this is the blueprint variant. Use [`templates/journey-map-template.md`](templates/journey-map-template.md)'s blueprint section for the full shape.

**Completion criterion:** every step has real Frontstage/Backstage/Support entries (not blank rows padded for symmetry — Physical Evidence alone is genuinely optional), every duration/wait-time is either a real confirmed number or explicitly marked unconfirmed, and the layers read as one continuous customer experience top-to-bottom, not disconnected team-by-team logs.

---

## Mode: pain-points

Requires a `## Current State` diagram from `map` or `blueprint` mode; if none exists, run one of those first. Against a blueprint, wait times between steps are usually the highest-value thing to score — a 22-minute wait with nothing visibly wrong in either step it sits between is exactly the kind of pain point a plain swimlane would miss.

### Step 1: Score each step

Walk the diagram (or table, for a `blueprint`) step by step, wait times included, or ask which to focus on for a large process. For each step or wait time with real friction, capture:
- **Severity** (1-3): how bad it is when it happens — 1 (annoying), 2 (causes rework or delay), 3 (blocks the process or causes a real error downstream)
- **Frequency** (1-3): how often — 1 (rare/edge case), 2 (regularly), 3 (nearly every time)
- **Root cause**: the actual reason, not just the symptom ("Manager approval takes 3 days" is a symptom; "approval only happens in a weekly in-person meeting" is a root cause). For a wait-time entry from `blueprint`, the root cause is usually a queuing/batching/handoff issue, not anything wrong with the steps on either side of it.

Don't score a step just because it exists — a step with no real friction gets skipped, not a placeholder low score. Ask rather than guess at severity/frequency; these are usually known by whoever does the work, not inferable from the process alone.

### Step 2: Write the pain points

Append a `## Pain Points` section to `docs/JOURNEY_MAP.md`, one entry per scored step, referencing the step's node from the diagram:

```markdown
### Manager approval (Severity 3 × Frequency 3 = 9)
**Root cause:** approvals only happen in a weekly in-person meeting; anything submitted after cutoff waits a full week.
**Evidence:** [who said this / how it was confirmed]
```

Sort by severity × frequency descending so the worst is first. Push anything genuinely unclear (nobody present can confirm the real root cause) to `docs/UNKNOWNS.md` rather than guessing (see AGENTS.md §2.6).

**Completion criterion:** every pain point has a severity, frequency, and root cause distinct from its symptom, and the list is ordered by score, not by the order steps appear in the diagram.

---

## Mode: solutions

Requires a `## Pain Points` section from `pain-points` mode.

### Step 1: Pick what's worth solving

Not every pain point gets a solution pass — ask which ones to tackle now (usually the top few by score), rather than working the entire list by default. A low-score pain point is documented, not necessarily fixed.

### Step 2: Explore directions per pain point

For each pain point being tackled, offer 2-3 concrete directions (not just one), naming the real tradeoff between them (faster to ship vs. addresses the root cause vs. needs a system nobody's built yet). Let the user pick or combine rather than defaulting to the first idea.

### Step 3: Set a measurable target

For the chosen direction, state what "fixed" looks like as a number: a target severity/frequency reduction, a cycle-time goal, an error-rate goal — something [`metrics`](../metrics/SKILL.md) could use as a candidate Key Result. If no honest number is knowable yet, say so explicitly rather than inventing a plausible-sounding target.

### Step 4: Write it up

Append a `## Solutions` section to `docs/JOURNEY_MAP.md`:

```markdown
### Manager approval → async approval via existing tool
**Direction chosen:** move approval into the existing ticketing tool with a 48-hour SLA, instead of the weekly meeting. (Considered: a dedicated approval app — more control, but nothing exists to build it on yet; delegating approval authority — faster, but manager wanted to keep visibility.)
**Target:** cycle time from submission to approval drops from ~7 days (worst case) to under 2 business days.
```

### Step 5: Hand off

- A direction ready to build → [`map`](../map/SKILL.md)'s `objects` mode to model what it needs, or straight to [`scaffold`](../scaffold/SKILL.md) if the object model already covers it.
- A real tradeoff worth a permanent record → [`decisions`](../decisions/SKILL.md).
- The targets set here → [`metrics`](../metrics/SKILL.md), as candidate Key Results once a framework is chosen.

**Completion criterion:** every tackled pain point has a chosen direction with its rejected alternatives named, a stated target (or an explicit "not yet knowable"), and a hand-off to whichever skill acts on it next.
