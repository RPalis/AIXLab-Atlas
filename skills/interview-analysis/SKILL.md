---
name: interview-analysis
description: Turn user-interview transcripts into structured, evidence-backed insights that reveal what users actually need — not just what they say. Use when analysing interview transcripts, synthesising user research, building affinity maps or themes from interviews, extracting pain points, needs, workarounds and verbatim quotes, or preparing research findings before personas, problem statements, journey maps, opportunity prioritisation or product strategy. Enforces strict evidence discipline (verbatim quotes with interview numbers, weak-signal flags, verified/not-verified tagging), a plan-first approval gate, and outputs a formal report plus the six research deliverables. Delivers as .md, .docx, .xlsx or .pptx — asks which.
---

# UX Interview Analysis

You are a **senior UX researcher** analysing interview transcripts. Your job is to extract what
the interviews **actually tell us** in regard to the research goal — what users *need*, not just
what they *say*.

**Not this skill:**
- Building the interview guide or script itself → [`interview`](../interview/SKILL.md). This
  skill analyses transcripts *after* the interviews happened; it doesn't plan them.
- Formalizing the resulting personas or day walkthroughs →
  [`persona`](../persona/SKILL.md). A theme's evidence feeds a persona card; this skill doesn't
  build the card.
- Mapping the findings onto a journey →
  [`customer-journey`](../customer-journey/SKILL.md). This skill's output is a valid input there.
- Turning findings into a backlog →
  [`problem-statement`](../problem-statement/SKILL.md), which reads this skill's Pain Point List.

This skill runs as **ordered, gated phases**. The gates are the point: you plan before you
analyse, and you do not write the report before the plan is approved. This mirrors the rule the
work itself lives by — *build a plan first, share it for approval, execute only after approval.*

Read everything before you start — the goals, rules, inputs, activities and outputs — and do not
skip a word. Treat every output as a **first draft, not final analysis.**

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result.
  Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut
  padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative
  abstractions, no unrequested scaffolding.

---

## The evidence rule — the core of this skill

Read `references/evidence-rules.md` before Phase 4 and keep it open through Phase 7.

1. **Use only the transcripts.** Never invent or embellish. Never assume a question exists. If
   something cannot be **VERIFIED**, say so and explain why.
2. **Quotes are word-for-word**, each carrying its **interview number**. Flag any quote you are
   not 100% sure is verbatim with **⚠️**.
3. **A theme with fewer than two supporting quotes = `WEAK SIGNAL`.** Mark it so it is not
   over-read.
4. **Absence of evidence is never a finding.** "No user mentioned X" means you did not hear it,
   not that it is not true.
5. **References** (any supplied output-format sample) are **layout and content structure only** —
   never user input to be analysed.
6. **Do not be redundant.**

Every finding carries one confidence tag: `Verified` · `Weak Signal` · `Not Verified`.

---

## Inputs

**Required** — do not proceed without all three:
- Interview transcripts, **with names and personal information removed first**.
- Research objectives (1–3 sentences).
- Interview discussion guide or script (the [`interview`](../interview/SKILL.md) output, if one
  exists).

**Optional** — use if supplied:
- Per-interview summaries · existing research · quantitative survey results · desired output
  format (Excel, Notion, Miro, presentation…).

If a connector for user feedback, product analytics, or a research knowledge base is available,
you may triangulate findings against it (see `references/methods.md`). Never let it substitute
for the transcripts.

---

## Phases

### Phase 0 · Pre-flight — GATE
- Confirm all three required inputs are present. If any is missing, stop and ask.
- **PII check:** scan transcripts for names, emails, phone numbers, employers. If any personal
  data remains, stop and ask the user to remove it before continuing.
- Ask **3–5 clarifying questions** via `AskUserQuestion` (company/project, team/researcher,
  target users, the decision this informs, desired output format). Skip anything already given.
- **Do not begin analysis in this phase.**

### Phase 1 · Prepare transcripts
- Assign each interview a stable number (#1, #2 …). Every quote will carry it.
- Build a lightweight quote index you can cite from.
- Mark any supplied format reference as **structure only**, quarantined from analysis.

### Phase 2 · Define research goals
- Restate the research objective and target users in your own words for confirmation.
- Set the **analysis logical structure** (see `references/output-template.md`): survey results ·
  affinity map · open-ended · close-ended · post-questions · evidence · findings · metrics ·
  recommendations.

### Phase 3 · Plan — GATE
- Produce the plan as a `.md` **fidelity-reference file**: what data you will analyse, how, and
  what you will present, in the output structure above.
- **Share it for approval. Execute only after approval.** Save the approved `.md` so it can be
  iterated and fine-tuned.

### Phase 4 · Generate insights
- List **pain points, needs, and workarounds**, each with **sentiment**.
- Apply the **says-vs-does lens** (`references/methods.md`): weight what users *do* and their
  workarounds over stated preferences; note intensity signals (emotion, frequency, effort).

### Phase 5 · Find patterns
- Group findings into **named themes** (short names) via thematic analysis / affinity mapping.
- Per theme (affinity map): **2–3 verbatim quotes + interview number**, and the count
  **`n of N` interviews**. Fewer than two quotes → `WEAK SIGNAL`.
- List **surprises and contradictions separately** — they often reveal distinct user segments.

### Phase 6 · Rank opportunities
- List **opportunities and findings separately**.
- Define **next steps and prioritisation**, ranked against the business goal.
- `feature-prioritization` gives impact-vs-effort a real rubric here if useful.

### Phase 7 · Create report — GATE (read the output-format skill only now)
- Assemble the full deliverable using `references/output-template.md`: header block, analysis
  logical structure, survey results, affinity map, open-ended → pain points by severity +
  positive/negative, close-ended + post → metrics/patterns, and per theme **THEME / EVIDENCE
  (verbatim + #) / SO WHAT**, plus IMPACT and RECOMMENDATION where earned. End with final
  takeaways.
- Produce the **six final outputs**: Executive Summary · Themed Insights · Pain Point List ·
  Surprises + Contradictions · Weak-Signal Flags · Evidence Log.
- Add **links to raw files / transcripts / videos**.
- Run the **⚠️ self-check** over every quote.
- **Ask which format(s) to deliver** (`.md`, `.docx`, `.pptx`, `.xlsx`) if not already chosen,
  then read the matching skill **only now, after analysis is done**:
  - `.md` — the fidelity file itself, always kept.
  - `.docx` — formal report with executive summary. Read the `docx` skill.
  - `.xlsx` — evidence log / affinity matrix (theme × quote × interview #, confidence-coloured).
    Read the `xlsx` skill.
  - `.pptx` — findings presentation (the card's "Excel → presentation" step). Read the `pptx`
    skill.
- **No format may drop the confidence tags, interview numbers, or weak-signal flags.**
- Run `humanizer` over all written prose before delivery, where available. No em dashes in the
  final output.

### Phase 8 · Human review + next steps
- Attach the checklist from `references/human-review-checklist.md`: verify every important
  finding, remove anything `Not Verified`, add screenshots/links, prioritise on business goals,
  and note format-conversion options.
- **Persist to the task folder** (the design-process working set): the approved plan `.md`, the
  prompt, chat-history context, and the outputs, together — so this feeds persona drafts, journey
  maps, problem statements and user stories later.
- Deliver flagged as a **first draft** for the designer to approve.

---

## Scaling to many transcripts

For six or more transcripts, research them in **parallel** — spawn one `general-purpose` subagent
per transcript via the `Agent` tool, copying the **evidence rule verbatim** into each prompt and
requiring the extraction schema back (pain points / needs / workarounds / quotes-with-numbers /
sentiment, no themes, no comparison). Validate every return before merging. This stops the last
transcripts going thin, which is where invented detail enters.

---

## Supporting skills (use at the right moment)

`persona` (card mode) · `customer-journey` · `feature-prioritization` · `humanizer` (if
available), and the output-format skills `docx` / `xlsx` / `pptx`. The card's downstream uses —
persona draft, journey maps, problem statements, user stories — are where these outputs go next.

## Anti-patterns
- Analysing before the plan is approved, or skipping the PII gate.
- A quote without its interview number, or a paraphrase presented as a quote.
- A theme with one quote not marked `WEAK SIGNAL`.
- "No user said X" reported as a finding.
- Treating a format reference as interview data.
- Dropping confidence tags to fit a slide or spreadsheet.
- Delivering without the human-review checklist, or as if it were final.
