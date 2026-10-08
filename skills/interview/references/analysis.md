# Interview: analysis mode

Part of the [`interview`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

This mode runs as **ordered, gated phases**. The gates are the point: you plan before you
analyse, and you do not write the report before the plan is approved. This mirrors the rule the
work itself lives by — *build a plan first, share it for approval, execute only after approval.*

Treat every output as a **first draft, not final analysis.**

## Contents

  - The evidence rule — the core of this mode
  - Inputs
  - Phases
  - Scaling to many transcripts
  - Where this goes next
  - Anti-patterns

### The evidence rule — the core of this mode

Read `references/analysis/evidence-rules.md` before Phase 4 and keep it open through Phase 7.

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

### Inputs

**Required** — do not proceed without all three:
- Interview transcripts, **with names and personal information removed first**.
- Research objectives (1–3 sentences).
- Interview discussion guide or script (this skill's `questions` mode output, if one exists).

**Optional** — use if supplied:
- Per-interview summaries · existing research · quantitative survey results · desired output
  format (Excel, Notion, Miro, presentation…).

If a connector for user feedback, product analytics, or a research knowledge base is available,
you may triangulate findings against it (see `references/analysis/methods.md`). Never let it substitute
for the transcripts.

### Phases

#### Phase 0 · Pre-flight — GATE
- Confirm all three required inputs are present. If any is missing, stop and ask.
- **PII check:** scan transcripts for names, emails, phone numbers, employers. If any personal
  data remains, stop and ask the user to remove it before continuing.
- Ask **3–5 clarifying questions** (company/project, team/researcher,
  target users, the decision this informs, desired output format). Skip anything already given.
- **Do not begin analysis in this phase.**
- **Autonomous mode** (suite `AGENTS.md` §2.9): transcripts and research objectives can't be invented, and a remaining PII hit can't be waved through. If any required input is missing or PII remains, skip, log tier 3 (`../../../tools/log-unknown/log-unknown.sh --skill interview --tier 3 "..."`), and stop. Take the clarifying answers from `docs/PRODUCT_BRIEF.md` where they exist and log the rest as defaults.

#### Phase 1 · Prepare transcripts
- Assign each interview a stable number (#1, #2 …). Every quote will carry it.
- Build a lightweight quote index you can cite from.
- Mark any supplied format reference as **structure only**, quarantined from analysis.

#### Phase 2 · Define research goals
- Restate the research objective and target users in your own words for confirmation.
- Set the **analysis logical structure** (see `references/analysis/output-template.md`): survey results ·
  affinity map · open-ended · close-ended · post-questions · evidence · findings · metrics ·
  recommendations.

#### Phase 3 · Plan — GATE
- Produce the plan as a `.md` **fidelity-reference file**: what data you will analyse, how, and
  what you will present, in the output structure above.
- **Share it for approval. Execute only after approval.** Save the approved `.md` so it can be
  iterated and fine-tuned. **Autonomous mode:** write the plan to `docs/` and stop here; approval is the human step, and nothing after it runs without one.

#### Phase 4 · Generate insights
- List **pain points, needs, and workarounds**, each with **sentiment**.
- Apply the **says-vs-does lens** (`references/analysis/methods.md`): weight what users *do* and their
  workarounds over stated preferences; note intensity signals (emotion, frequency, effort).

#### Phase 5 · Find patterns
- Group findings into **named themes** (short names) via thematic analysis / affinity mapping.
- Per theme (affinity map): **2–3 verbatim quotes + interview number**, and the count
  **`n of N` interviews**. Fewer than two quotes → `WEAK SIGNAL`.
- List **surprises and contradictions separately** — they often reveal distinct user segments.

#### Phase 6 · Rank opportunities
- List **opportunities and findings separately**.
- Define **next steps and prioritisation**, ranked against the business goal.

#### Phase 7 · Create report — GATE
- Assemble the full deliverable using `references/analysis/output-template.md`: header block, analysis
  logical structure, survey results, affinity map, open-ended → pain points by severity +
  positive/negative, close-ended + post → metrics/patterns, and per theme **THEME / EVIDENCE
  (verbatim + #) / SO WHAT**, plus IMPACT and RECOMMENDATION where earned. End with final
  takeaways.
- Produce the **six final outputs**: Executive Summary · Themed Insights · Pain Point List ·
  Surprises + Contradictions · Weak-Signal Flags · Evidence Log.
- Add **links to raw files / transcripts / videos**.
- Run the **⚠️ self-check** over every quote.
- **Format.** The Markdown report (`docs/INTERVIEW_ANALYSIS.md`) is the deliverable and the approved plan file is always kept. If an evidence log or affinity matrix is wanted as a spreadsheet, also write `docs/interview-evidence-log.csv` (theme, quote, interview #, confidence). For a Word report or a findings presentation, hand the Markdown to [`showcase`](../../showcase/SKILL.md)'s `doc` or `deck` mode (e.g. `/showcase interview-analysis.md`); the Markdown stays the source of truth.
- **No format may drop the confidence tags, interview numbers, or weak-signal flags.**
- Keep prose plain, and use no em dashes in the final output.

#### Phase 8 · Human review + next steps
- Attach the checklist from `references/analysis/human-review-checklist.md`: verify every important
  finding, remove anything `Not Verified`, add screenshots/links, prioritise on business goals,
  and note format-conversion options.
- **Persist to the docs folder**: the approved plan, the outputs, and the evidence log together, so this feeds persona drafts, journey maps, problem statements and user stories later.
- Deliver flagged as a **first draft** for the designer to approve.

### Scaling to many transcripts

For six or more transcripts, research them in **parallel** — use one research agent per transcript where available, copying the **evidence rule verbatim** into each prompt and
requiring the extraction schema back (pain points / needs / workarounds / quotes-with-numbers /
sentiment, no themes, no comparison). Validate every return before merging. This stops the last
transcripts going thin, which is where invented detail enters.

### Where this goes next

[`persona`](../../persona/SKILL.md)'s `card` mode (a theme's evidence feeds a persona card), [`journey`](../../journey/SKILL.md)'s `experience` mode (this output is a valid input), and [`problems`](../../problems/SKILL.md), which reads the Pain Point List.

### Anti-patterns
- Analysing before the plan is approved, or skipping the PII gate.
- A quote without its interview number, or a paraphrase presented as a quote.
- A theme with one quote not marked `WEAK SIGNAL`.
- "No user said X" reported as a finding.
- Treating a format reference as interview data.
- Dropping confidence tags to fit a slide or spreadsheet.
- Delivering without the human-review checklist, or as if it were final.

**Completion criterion:** the report carries all six outputs, every finding has a confidence tag, every quote has an interview number, and the human-review checklist is attached.
