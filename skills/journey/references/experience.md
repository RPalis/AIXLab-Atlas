# Journey: experience mode

Part of the [`journey`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Transform research into a structured, end-to-end **persona experience** through **one scenario** — actions, thoughts, emotions, pain points and opportunities — with every finding traceable to evidence and every gap labelled honestly. This is a different subject from `map`/`blueprint`: those trace how a *process* runs regardless of who's in it; `experience` traces how *one person* feels moving through *one specific situation*.

Estimated time: **20-30 minutes** for a single persona + single scenario.

### Non-negotiable principles (read first)

1. **One map = one persona = one scenario.** Never combine personas or scenarios into a single map. If the user has several, make several.
2. **Never invent user behaviours, emotions or pain points.** If there is no evidence, do not fabricate it.
3. **Label every unsupported claim as `ASSUMPTION`.** Do not present assumptions as facts. An assumption is allowed — disguising one as evidence is not.
4. **Every pain point and every opportunity must reference supporting research.** If none exists, mark it `ASSUMPTION`.
5. **Every stage carries a confidence rating: High / Medium / Low.** Confidence reflects how much real evidence backs that stage, not how plausible it sounds.
6. **The output is a first draft, not a final map.** Always hand back the Human Review checklist.

### What you'll need

**Required:** one persona or user segment (a `persona` `card`-mode output, if one exists) · one scenario to map · relevant research findings (interviews, surveys, analytics).
**Optional (strengthens the map):** existing journey maps · current user flows · a `map` `flow`-mode diagram · business processes · screenshots or prototypes.

If any required input is missing, ask **up to five** clarifying questions before mapping. Do not silently assume the missing pieces.

### Extracting context from uploaded files

Research usually arrives as documents, not clean text. Treat everything extracted as **source evidence**, citable by filename + location (page, slide, sheet, row, timestamp). PDFs, `.docx`, `.pptx`, `.xlsx`/`.csv`, images and live web research all count — quote users in their own words wherever possible; if a file is unreadable or ambiguous, say so rather than guess its contents. Build a lightweight evidence ledger (claim → source → confidence) the map's citations point back to.

### The workflow

```
Choose persona → Define scenario → Map experience → Identify pain points → Highlight opportunities → Review & Export
```

**Step 0 — Clarify** (only if required inputs are missing): product, feature/service, business objective, scenario objective, persona, success outcome, what research exists. Then stop and wait.

**Step 1 — Choose persona.** Lock exactly one persona/segment, grounded in research. One map = one point of view.

**Step 2 — Define the scenario.** State the single scenario, the user's success outcome, and the business + scenario objectives. Confirm start and end boundaries.

**Step 3 — Map the experience.** Break the scenario into **5-8 logical stages**. For **every** stage capture: user goal, user actions (narrative, not click-by-click), thoughts (verbatims where possible), emotions (plotted on a curve), pain points (cited or `ASSUMPTION`), opportunities (cited or `ASSUMPTION`), supporting evidence, and a confidence rating (High/Medium/Low).

**Step 4 — Identify pain points.** For each stage surface friction, then across the whole scenario identify: emotional low points, critical moments, drop-off risks, unmet needs, service gaps. Each pain point cites research or is marked `ASSUMPTION`.

**Step 5 — Highlight opportunities.** Pair each meaningful pain point with an improvement opportunity, cited or `ASSUMPTION`. Assign an owner where possible; note how impact would be measured.

**Step 6 — Review & export.** Produce the six deliverables below, attach the Human Review checklist, and write it as Markdown in the docs folder (a Word or PowerPoint version comes from [`showcase`](../../showcase/SKILL.md)'s `doc` or `deck` mode, with the Markdown as the source of truth).

**Completion criterion:** all six deliverables exist, every pain point and opportunity carries a citation or `ASSUMPTION`, and the Human Review checklist is attached.

### The six required deliverables

1. **Executive Summary** — who, scenario, headline highs/lows, top opportunities.
2. **Experience Map** — the structured stage-by-stage map.
3. **Emotional Journey** — the emotion curve, marking highs and lows.
4. **Pain Points & Opportunities** — friction paired with improvement, per stage, each cited.
5. **Prioritised Opportunity List** — ranked (impact × confidence, or impact × effort), owners where known.
6. **Assumptions & Validation Checklist** — every `ASSUMPTION` and every stage needing manual verification.

### Output format (text version)

```
EXECUTIVE SUMMARY
[Persona] · [Scenario] · [Success outcome] — headline highs, lows, top 3 opportunities.

ACTOR: [Persona name + brief description]
SCENARIO: [What they're trying to do + expectations]

| Layer         | Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5 |
|---------------|---------|---------|---------|---------|---------|
| User goal     |         |         |         |         |         |
| Actions       |         |         |         |         |         |
| Thoughts      |         |         |         |         |         |
| Emotions      |   ↗     |   ↘     |   ↗     |   ↘     |   ↗     |
| Pain points   |         |         |         |         |         |
| Opportunities |         |         |         |         |         |
| Evidence      |         |         |         |         |         |
| Confidence    |  H/M/L  |  H/M/L  |  H/M/L  |  H/M/L  |  H/M/L  |

PRIORITISED OPPORTUNITIES: [opp] — impact / confidence / owner …
ASSUMPTIONS & VALIDATION CHECKLIST: - [ ] [assumption or stage to verify]
```

Write to `docs/CUSTOMER_JOURNEY.md`. Use [`templates/experience-template.md`](../templates/experience-template.md) for the full document shape.

### Human review required

- [ ] Verify every stage is supported by research.
- [ ] Remove or clearly label any assumptions.
- [ ] Ensure the emotional journey reflects real evidence.
- [ ] Validate opportunities against business goals.

**Treat the output as a first draft, not a final map.**

### What's next

Hand off to [`problems`](../../problems/SKILL.md) — a confirmed pain point or opportunity here is exactly the kind of input it expects.
