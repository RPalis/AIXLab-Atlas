# Persona & Day-in-the-Life Walkthrough: [Persona Name / Role]

## 1. Persona Profile

- **Target User**: [e.g., Sarah Chen, Senior Wealth Advisor]
- **Experience Level / Tech Comfort**: [e.g., 15+ years experience, expects instant responsiveness, low tolerance for modal clutter]
- **Primary Mental Model**: [e.g., "Think in client goals, not in individual ticker transactions"]
- **Key Pain Points**:
  - Context switching across multiple siloed software systems
  - Fear of accidental compliance violations during bulk edits
  - Lack of unified morning summary for high-priority alerts

---

## 2. Core Archetype & Decision Drivers

```mermaid
quadrantChart
    title Persona Decision Dynamics
    x-axis Low Friction / Speed --> High Governance / Control
    y-axis Reactive Task Execution --> Proactive Strategic Advisory
    quadrant-1 Strategic Autonomy
    quadrant-2 Governed Review
    quadrant-3 Fast Tactical Entry
    quadrant-4 Friction-Heavy Compliance
    "Sarah's Target Experience": [0.65, 0.85]
    "Legacy Workflow Pain": [0.85, 0.25]
```

---

## 3. Chronological Day-in-the-Life Walkthrough

### Scene 1: Morning Exception Triage & Agenda Brief (8:00 AM)
![screenshot](./screenshots/scene-1.png)

Before market open, Sarah needs to know what demands immediate attention. She opens the dashboard and scans overnight drift alerts alongside her meeting schedule. The AI assistant has already generated a prioritized 3-item action summary with one-click drill-downs.

**What's on screen:**
- `PrimaryDashboard` → `MorningBriefWidget`
- Prioritized alert list with severity badges
- One-click drill-down into each flagged item

### Scene 2: Client Review & Interactive What-If Modeling (10:30 AM)
![screenshot](./screenshots/scene-2.png)

Presenting rebalancing options live, Sarah opens the Client Detail view and triggers the scenario simulation slider. Every change previews its intent before anything irreversible executes. That's the one friction point in this scene that's deliberate.

**What's on screen:**
- `ClientDetailView` → `ScenarioSimulator`
- Live-updating preview of proposed changes
- Explicit confirm step before execution

### Scene 3: Compliance & Multi-Tier Intake Approval (2:00 PM)
![screenshot](./screenshots/scene-3.png)

Submitting a trade order with a full audit trail, Sarah steps through the governance stepper. Risk above a set threshold auto-escalates to Legal, a "highest wins" rule when multiple friction sources combine.

**What's on screen:**
- `GovernanceStepper` with step-by-step sign-off
- Auto-escalation banner when risk threshold is exceeded

### Scene 4: Daily Wrap & Batch Automation (4:30 PM)
![screenshot](./screenshots/scene-4.png)

Sarah verifies the daily queue is clear and confirms overnight batch jobs are scheduled before logging off.

**What's on screen:**
- `ActivityHistoryView` with today's completed/queued items
