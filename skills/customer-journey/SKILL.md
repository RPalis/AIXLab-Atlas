---
name: customer-journey
description: >-
  Create research-backed, evidence-traceable customer journey maps for a single persona completing a single
  scenario. Trigger whenever a user wants to map a customer or user journey, map an end-to-end experience,
  surface pain points and opportunities across a flow, build an emotional journey, run a journey-mapping
  workshop, or turn interviews / surveys / analytics into a structured journey. Also trigger on: "create a
  journey map", "map the customer journey", "map the user experience", "where does the experience break down",
  "turn this research into a journey map", or when the user uploads research (docx, pdf, pptx, xlsx, csv, images)
  and asks to synthesise it into a journey. Also use to explain the difference between journey maps, experience
  maps, service blueprints and user story maps. Not this skill for a current-state operational process map (use
  journey) or a single persona's whole day (use persona's day mode).
---

# Customer Journey Mapping (Advanced)

Transform research into a structured, end-to-end customer journey that reveals actions, thoughts, emotions, pain
points and opportunities across the experience — with every finding traceable to evidence and every gap labelled
honestly.

Estimated time: **20–30 minutes** for a single persona + single scenario.

**Not this skill:**
- A real, current-state **operational process** (swimlane, service blueprint, pain points scored severity ×
  frequency) → [`journey`](../journey/SKILL.md). This skill maps one persona's experience *through a scenario*,
  with emotions and evidence; `journey` maps how a process actually runs today, actor by actor.
- One person's **whole day**, scene by scene, feeding screen design →
  [`persona`](../persona/SKILL.md)'s `day` mode.
- Producing the underlying persona → [`persona`](../persona/SKILL.md)'s `card` mode. This skill takes an
  existing persona/segment as an input, it doesn't build one.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if
  asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep
  substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no
  unrequested scaffolding.

---

## 0. Non-negotiable principles (read first)

These govern everything below. Do not relax them to "be helpful."

1. **One map = one persona = one scenario.** Never combine personas or journeys into a single map. If the user
   has several, make several maps.
2. **Never invent user behaviours, emotions or pain points.** If there is no evidence, do not fabricate it.
3. **Label every unsupported claim as `ASSUMPTION`.** Do not present assumptions as facts. An assumption is
   allowed — disguising one as evidence is not.
4. **Every pain point and every opportunity must reference supporting research.** If none exists, mark it
   `ASSUMPTION`.
5. **Every stage carries a confidence rating: High / Medium / Low.** Confidence reflects how much real evidence
   backs that stage, not how plausible it sounds.
6. **The output is a first draft, not a final journey map.** Always hand back the Human Review checklist.

---

## 1. When to use this

Use **before**: service design · experience redesign · opportunity mapping · writing problem statements ·
prioritising improvements · cross-functional workshops.

Downstream, the outputs feed directly into [`problem-statement`](../problem-statement/SKILL.md).

---

## 2. What you'll need (inputs)

**Required**
- One persona or user segment (a `persona` `card`-mode output, if one exists)
- One journey or scenario to map
- Relevant research findings (interviews, surveys, analytics, etc.)

**Optional (strengthens the map)**
- Existing journey maps
- Current user flows
- Service blueprints
- Business processes
- Screenshots or prototypes

If any *required* input is missing, ask **up to five** clarifying questions before mapping (see §5, Step 0).
Do not silently assume the missing pieces.

---

## 3. Extracting context from uploaded files (file handles)

Research usually arrives as documents, not clean text. Pull it in *before* mapping so the evidence base is real.
Treat everything you extract as **source evidence** you can cite by filename + location (page, slide, sheet, row,
timestamp).

| Source type | How to read it | What to harvest |
|---|---|---|
| **PDF** (research reports, decks exported to PDF, existing journey maps) | `Read` the `.pdf` directly (it renders pages visually, incl. scanned/diagram pages). For >10 pages use the `pages` range. | Verbatim quotes, stats, existing stages, emotion notes, page numbers for citation |
| **Word `.docx` / `.dotx`** | Read the `docx` skill to parse text, tables, tracked changes and comments | Interview notes, findings, requirements, reviewer comments |
| **PowerPoint `.pptx` / `.potx`** | Read the `pptx` skill to extract slide text + speaker notes | Research readouts, prior journeys, exec framing, per-slide citations |
| **Excel / CSV `.xlsx`/`.csv`/`.tsv`** | Read the `xlsx` skill, or load with pandas via Bash for quick profiling | Survey tallies, analytics, funnel/drop-off %, NPS, verbatim response columns |
| **Images / screenshots** (`.png`, `.jpg`) | View directly with `Read` (renders visually) | UI states, friction evidence, whiteboard photos, sticky notes |
| **Live web research / competitor pages** | `WebSearch` then `web_fetch` | Competitor journeys, benchmarks, review-site pain points |

Extraction rules:
- Quote users **in their own words** wherever possible — verbatims are the strongest evidence.
- Record a **citation anchor** for each fact: `interview 3`, `deck p.12`, `survey n=214`, `analytics: 38% drop
  at checkout`, `screenshot_2.png`.
- If a file is unreadable or ambiguous, say so — do not guess its contents.
- Build a lightweight **evidence ledger** (claim → source → confidence) that the map's citations point back to.

---

## 4. Output surface — this release is document-only

**Deliver as Markdown / `.docx` / `.pptx`.** Figma/FigJam production (reading an existing board, or building the
map as live FigJam stickies and sections) is documented below for when Figma scope is revisited, but is **not
available this release** — do not attempt it, and tell the user the document version is what ships now.

<details>
<summary>Deferred: Figma / FigJam production (not available this release)</summary>

Load the mandatory `figma-use` skill **before** any `use_figma` write call. NodeIds are session-specific — always
re-search / re-read at the start of a session; never reuse IDs from a past session.

**READ** — an existing design/board into context: Figma MCP `get_design_context` / `get_screenshot` /
`get_metadata`; FigJam via `get_figjam` or `figjam_get_board_contents` / `figjam_get_connections`; variables/
styles via `figma_get_variables` / `figma_get_styles` / `figma_search_components`.

**ANALYSE** — check the existing map against the 5 key components (§6) and per-stage schema (§7): one actor /
one scenario? emotion curve present? pain points evidence-backed or asserted? Flag multiple personas on one map,
missing emotion layer, click-by-click granularity, ownerless opportunities, unsupported stages.

**CREATE** — FigJam: one section per phase, a table (rows = Goal/Actions/Thoughts/Emotions/Pain
points/Opportunities/Evidence/Confidence, columns = stages), stickies colour-coded by layer, an emotion curve via
shapes + connectors, then auto-arrange. Figma: a presentation-ready file bound to design-system tokens.

Always validate visually after building: screenshot → check alignment/spacing/balance → iterate (max ~3 passes)
→ final screenshot to confirm. Never leave components floating outside a Section/Frame.

</details>

---

## 5. The workflow

```
Choose persona → Define journey → Map experience → Identify pain points → Highlight opportunities → Review & Export
```

### Step 0 — Clarify (only if required inputs are missing)
Ask **up to five** clarifying questions covering: product, feature/service, business objective, journey
objective, persona, scenario, success outcome, and what research exists. Then stop and wait. Skip this step if
the inputs are already sufficient.

### Step 1 — Choose persona
Lock exactly one persona/segment, grounded in research. Note who they are and what makes their view distinct.
One map = one point of view.

### Step 2 — Define journey
State the single scenario, the user's success outcome, and the business + journey objectives. Confirm start and
end boundaries so the map has clear edges.

### Step 3 — Map experience
Break the journey into **5–8 logical stages**. Fill the per-stage schema (§7) for each, pulling actions,
thoughts and emotions from evidence — verbatims first.

### Step 4 — Identify pain points
For each stage surface friction, then across the whole journey identify: emotional low points, critical
moments, drop-off risks, unmet needs and service gaps. Each pain point cites research or is marked `ASSUMPTION`.

### Step 5 — Highlight opportunities
Pair each meaningful pain point with an improvement opportunity. Each opportunity cites research or is marked
`ASSUMPTION`. Assign an owner where possible and note how impact would be measured.

### Step 6 — Review & export
Produce the six deliverables (§8), attach the Human Review checklist (§10), and export to the chosen
document format(s) — Markdown, `.docx`, `.pptx`.

**Completion criterion:** all six deliverables exist, every pain point and opportunity carries a citation or
`ASSUMPTION`, and the Human Review checklist is attached.

---

## 6. The 5 key components (every map must have these)

1. **Actor** — the one persona, grounded in real data.
2. **Scenario + expectations** — the situation and what the actor is trying to achieve.
3. **Journey phases** — 5–8 natural stages. Common patterns:
   - E-commerce: Discover → Try → Buy → Use → Seek support
   - Big purchases: Engagement → Education → Research → Evaluation → Justification
   - B2B tools: Purchase → Adoption → Retention → Expansion → Advocacy
4. **Actions, mindsets, emotions** — what they do; what they think (verbatims); how they feel (as a curve).
5. **Opportunities** — what changes, who owns it, where the biggest wins are, how success is measured.

---

## 7. Per-stage schema (fill for each of the 5–8 stages)

For **every** stage capture all eight fields:

- **User goal** — what they're trying to achieve at this stage
- **User actions** — what they do (narrative, not click-by-click)
- **Thoughts** — questions/motivations, in the user's words where possible
- **Emotions** — the felt state (e.g. confident, confused, frustrated, delighted) → plotted on the curve
- **Pain points** — friction, each with a citation or `ASSUMPTION`
- **Opportunities** — improvements, each with a citation or `ASSUMPTION`
- **Supporting evidence** — the source anchor(s) behind this stage
- **Confidence** — **High / Medium / Low**, based on strength of evidence

---

## 8. The six required deliverables

Always produce all six, in this order:

1. **Executive Summary** — the journey in brief: who, scenario, the headline highs/lows and top opportunities.
2. **Journey Map** — the structured end-to-end map (stages × the per-stage schema).
3. **Emotional Journey** — the emotion curve across stages, marking highs and lows.
4. **Pain Points & Opportunities** — friction paired with improvement opportunities per stage, each cited.
5. **Prioritised Opportunity List** — opportunities ranked (e.g. impact × confidence, or impact × effort), with
   owners where known.
6. **Assumptions & Validation Checklist** — every `ASSUMPTION` and every stage needing manual verification.

Cross-journey callouts to include: **emotional high points, emotional low points, critical moments, drop-off
risks, unmet needs, service gaps.**

---

## 9. Output format (text version)

```
EXECUTIVE SUMMARY
[Persona] · [Scenario] · [Success outcome] — headline highs, lows, top 3 opportunities.

ACTOR:    [Persona name + brief description]
SCENARIO: [What they're trying to do + expectations]
OBJECTIVES: business → […] · journey → […]

| Layer            | Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5 |
|------------------|---------|---------|---------|---------|---------|
| User goal        |         |         |         |         |         |
| Actions          |         |         |         |         |         |
| Thoughts         |         |         |         |         |         |
| Emotions         |   ↗     |   ↘     |   ↗     |   ↘     |   ↗     |
| Pain points      |         |         |         |         |         |
| Opportunities    |         |         |         |         |         |
| Evidence         |         |         |         |         |         |
| Confidence       |  H/M/L  |  H/M/L  |  H/M/L  |  H/M/L  |  H/M/L  |

EMOTIONAL JOURNEY: single line across stages; ★ = high point, ▼ = low point, ! = critical moment.

PAIN POINTS & OPPORTUNITIES: per stage, each with [source] or [ASSUMPTION].

PRIORITISED OPPORTUNITIES:
1. [opp] — impact / confidence / owner
2. …

ASSUMPTIONS & VALIDATION CHECKLIST:
- [ ] [assumption or stage to verify]
```

Adapt to the medium — table, visual diagram, written narrative — based on what the user needs.

---

## 10. Human review required (attach to every output)

Before this journey map is used:
- [ ] Verify every stage is supported by research.
- [ ] Remove or clearly label any assumptions.
- [ ] Ensure the emotional journey reflects real evidence.
- [ ] Validate opportunities against your business goals.

**Treat the output as a first draft, not a final journey map.**

---

## 11. The master prompt (system framing)

Use this framing when generating the map:

> You are a Senior UX Designer and Service Designer. Your role is to create a research-backed customer journey
> map that accurately represents one user's experience through a single scenario. The journey should help
> product teams understand what users are trying to achieve, where friction occurs, and where the greatest
> opportunities for improvement exist. Never invent user behaviours, emotions or pain points. If evidence is
> missing, clearly label it as `ASSUMPTION` and never present assumptions as facts. Create one journey map for
> ONE persona completing ONE scenario; do not combine personas or journeys. Break the journey into 5–8 logical
> stages, each with user goal, actions, thoughts, emotions, pain points, opportunities, supporting evidence and
> a confidence rating (High/Medium/Low). Identify emotional highs and lows, critical moments, drop-off risks,
> unmet needs and service gaps. Every pain point and opportunity must reference supporting research or be marked
> `ASSUMPTION`. Finally produce: (1) Executive Summary, (2) Journey Map, (3) Emotional Journey, (4) Pain Points &
> Opportunities, (5) Prioritised Opportunity List, (6) Assumptions & Validation Checklist. Ensure every finding
> can be traced back to research wherever possible.

Structured intake to fill before generating:
`PROJECT`: product · feature/service · business objective · journey objective.
`USER`: persona · scenario · success outcome.
`RESEARCH`: interview findings · survey results · analytics · competitor research · existing journey maps · user flows.

---

## 12. Related methods (know the difference)

| Method | Scope | Perspective | Purpose |
|---|---|---|---|
| **Journey Map** (this skill) | Specific actor + product/service | User | Understand a specific experience |
| **Experience Map** | Generic human behaviour | Human | Understand broader behaviour before a product exists |
| **Service Blueprint / process map** ([`journey`](../journey/SKILL.md)) | Same journey, behind the scenes, current-state | Business | Understand the internal processes that support the journey |
| **User Story Map** | Feature-level | Product team | Plan and implement features in Agile |

Common sequence: Experience Map → Journey Map (this skill) → Service Blueprint (`journey`) → User Story Map.

---

## 13. Facilitation tips

- One map, one actor — resist combining personas.
- Root actions and mindsets in real data; use verbatims.
- The emotion curve is the heart of the map — if it's flat, dig deeper.
- Phases should feel natural — if stakeholders argue over the names, the phases aren't right yet.
- The goal is alignment, not perfection — the mapping conversation is often as valuable as the artifact.

---

## 14. Common mistakes to avoid

- Too granular (a journey map is narrative, not a click-by-click log).
- Multiple actors on one map.
- Skipping the emotion layer.
- Building the map with no research behind it.
- Presenting assumptions as facts, or opportunities with no owner.
- Treating it as a one-time artifact instead of a living document.

---

## 15. What's next

- Feed the journey map into the stage-related folder of the project.
- Keep prompts / `.md` files / chat-history context / tooling together in the same task-stage folder — this is
  the reusable working set for the project.
- Use these outputs in [`problem-statement`](../problem-statement/SKILL.md).
