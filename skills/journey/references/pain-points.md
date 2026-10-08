# Journey: pain-points mode

Part of the [`journey`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Requires a `## Current State` diagram from `map` or `blueprint` mode; if none exists, run one of those first. Against a blueprint, wait times between steps are usually the highest-value thing to score — a 22-minute wait with nothing visibly wrong in either step it sits between is exactly the kind of pain point a plain swimlane would miss.

### Step 1: Score each step

Walk the diagram (or table, for a `blueprint`) step by step, wait times included, or ask which to focus on for a large process. **Autonomous mode** (suite `AGENTS.md` §2.9): with no one to narrow scope with, default to walking the whole diagram rather than guessing which subset matters — more coverage, not less, is the safe direction here. For each step or wait time with real friction, capture:
- **Severity** (1-3): how bad it is when it happens — 1 (annoying), 2 (causes rework or delay), 3 (blocks the process or causes a real error downstream)
- **Frequency** (1-3): how often — 1 (rare/edge case), 2 (regularly), 3 (nearly every time)
- **Root cause**: the actual reason, not just the symptom ("Manager approval takes 3 days" is a symptom; "approval only happens in a weekly in-person meeting" is a root cause). For a wait-time entry from `blueprint`, the root cause is usually a queuing/batching/handoff issue, not anything wrong with the steps on either side of it.

Don't score a step just because it exists — a step with no real friction gets skipped, not a placeholder low score. Ask rather than guess at severity/frequency; these are usually known by whoever does the work, not inferable from the process alone. **Autonomous mode:** a fabricated severity/frequency number is tier 3 (§2.9) — never invent one. Leave the step unscored, log it to `docs/UNKNOWNS.md` as needing input from whoever does the work, and continue scoring the steps where real evidence exists.

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
