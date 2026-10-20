# Journey: solutions mode

Part of the [`journey`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Requires a `## Pain Points` section from `pain-points` mode.

### Step 1: Pick what's worth solving

Not every pain point gets a solution pass — ask which ones to tackle now (usually the top few by score), rather than working the entire list by default. A low-score pain point is documented, not necessarily fixed. **Autonomous mode:** default to the top few by score (the stated usual answer), log the cutoff used, and note the rest are documented but unaddressed.

### Step 2: Explore directions per pain point

For each pain point being tackled, offer 2-3 concrete directions (not just one), naming the real tradeoff between them (faster to ship vs. addresses the root cause vs. needs a system nobody's built yet). Let the user pick or combine rather than defaulting to the first idea.

### Step 3: Set a measurable target

For the chosen direction, state what "fixed" looks like as a number: a target severity/frequency reduction, a cycle-time goal, an error-rate goal — something [`metrics`](../../metrics/SKILL.md) could use as a candidate Key Result. If no honest number is knowable yet, say so explicitly rather than inventing a plausible-sounding target.

### Step 4: Write it up

Append a `## Solutions` section to `docs/JOURNEY_MAP.md`:

```markdown
### Manager approval → async approval via existing tool
**Direction chosen:** move approval into the existing ticketing tool with a 48-hour SLA, instead of the weekly meeting. (Considered: a dedicated approval app — more control, but nothing exists to build it on yet; delegating approval authority — faster, but manager wanted to keep visibility.)
**Target:** cycle time from submission to approval drops from ~7 days (worst case) to under 2 business days.
```

### Step 5: Hand off

- A direction ready to build → [`map`](../../map/SKILL.md)'s `objects` mode to model what it needs, or straight to [`scaffold`](../../scaffold/SKILL.md) if the object model already covers it.
- A real tradeoff worth a permanent record → [`decisions`](../../decisions/SKILL.md).
- The targets set here → [`metrics`](../../metrics/SKILL.md), as candidate Key Results once a framework is chosen.

**Completion criterion:** every tackled pain point has a chosen direction with its rejected alternatives named, a stated target (or an explicit "not yet knowable"), and a hand-off to whichever skill acts on it next.

---
