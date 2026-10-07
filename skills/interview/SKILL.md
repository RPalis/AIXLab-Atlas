---
name: interview
description: >-
  Three modes for user research with real people. `questions` (default) builds a phase-aware research kit (question bank, interview script, and synthesis template) for either discovery (early, open-ended) or validation (later, hypothesis-testing) interviews, reading docs/UNKNOWNS.md to fold in open questions raised elsewhere in the project. `analysis` turns interview transcripts into structured, evidence-backed insights (themes, pain points, needs, workarounds, verbatim quotes with interview numbers, weak-signal flags) through a gated, plan-first process. `usability` turns a built prototype into a bias-reviewed usability test plan and moderator script: realistic task scenarios with success criteria, a timed agenda, and a metrics sheet. Use when preparing to talk to real users, when you have transcripts to analyse or synthesise, or when a prototype exists and needs real users to try it.
argument-hint: "[questions: build interview kit | analysis: synthesise transcripts | usability: test plan + script]"
---

# User Research

Three modes, one set of real participants. They run in order around a round of research, but each stands alone:

- **`questions`** (default): before the interviews. Builds the kit: a question bank, an interview script, a synthesis template.
- **`analysis`**: after the interviews. Turns transcripts into themes, pain points, and evidence, with every quote traced to an interview.
- **`usability`**: for a prototype that already exists. Builds a task-based test plan and moderator script, to see whether people can actually do the thing.

**Not this skill:**
- Formalizing personas or day-in-the-life walkthroughs → [`persona`](../persona/SKILL.md). An `analysis` theme's evidence feeds a persona card; this skill doesn't build the card.
- Mapping findings onto a journey → [`journey`](../journey/SKILL.md)'s `experience` mode.
- Turning findings into problem statements and user stories → [`problems`](../problems/SKILL.md).
- An expert review of the prototype with no participants → [`audit`](../audit/SKILL.md) (`craft` or `heuristic`). `usability` needs real people; `audit` doesn't.
- `questions` in its Validation focus vs `usability`: validation questions are a conversation about specific screens ("when you saw this state, what did you expect?"); `usability` is a timed, task-based session that measures whether participants complete scenarios, with success criteria, moderator rules, and a metrics sheet. Use the conversation for "why", `usability` for "can they".

Say which mode if not specified. Preparing to talk to people means `questions`; having transcripts in hand means `analysis`; having a clickable prototype to put in front of people means `usability`.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Mode: questions

Produces a complete, ready-to-run interview kit, not just a question list. Which focus to use is **context-aware**, not something to ask the user to declare:

- **No `docs/PERSONA_WALKTHROUGH.md` or `docs/OOUX_OBJECT_MAP.md` yet** → **Discovery focus**: open-ended questions to lock in who the users are and what they need, feeding directly into [`persona`](../persona/SKILL.md) and [`map`](../map/SKILL.md)'s `objects` mode.
- **A working prototype already exists** (`frontend/` scaffolded, screens built) → **Validation focus**: targeted, hypothesis-testing questions about specific screens/flows, informed by what's actually been built and any `docs/UNKNOWNS.md` entries.
- **Both signals present** → ask the user which is the goal for this round rather than guessing; a project can legitimately need both at once (validating shipped features while still discovering an adjacent user segment). **Autonomous mode** (suite `AGENTS.md` §2.9): run [`tools/detect-project-phase`](../../tools/detect-project-phase/detect-project-phase.sh) rather than picking a fixed focus — `PHASE=before-discover`/`early-discover`/`discover-to-decide` defaults to the Discovery focus (still locking in who the users are), `PHASE=decide-to-design`/`early-design`/`design`/`deliver` defaults to the Validation focus (testing what's already built). Log the default and the `PHASE`/`SIGNAL` it came from; the other focus is available on request.

### Step 1: Read `docs/UNKNOWNS.md`

If it exists, every open item there is a candidate interview question — these accumulated naturally from work elsewhere in the project (see AGENTS.md §2.6). Fold relevant unknowns into the question bank below rather than starting from a blank page.

### Step 2: Build the question bank

Use [`templates/discovery-questions.md`](templates/discovery-questions.md) or [`templates/validation-questions.md`](templates/validation-questions.md) depending on the focus. Discovery questions are open-ended ("walk me through the last time you had to..."); validation questions test a specific hypothesis against a specific screen ("when you saw this state, what did you expect to happen next?"). Don't write validation-style leading questions into a discovery guide or vice versa.

### Step 3: Write the interview script

Use [`templates/interview-script-template.md`](templates/interview-script-template.md). Include a short **target persona blurb**: who this interview is trying to reach, 2-3 sentences, pulled from `docs/PERSONA_WALKTHROUGH.md` if it exists, otherwise a best-guess draft marked unconfirmed. Not a full recruiting/screening flow, just enough for whoever is scheduling interviews to know who to look for.

### Step 4: Prepare the synthesis template

Use [`templates/synthesis-template.md`](templates/synthesis-template.md) to capture what's actually heard, ready to fill in immediately after each interview while it's fresh, not written from memory days later.

### Step 5: Route what you learn

After interviews are synthesized, route each finding to where it belongs; don't leave it stranded in the synthesis doc:
- A confirmed fact about users/workflow → update `docs/PERSONA_WALKTHROUGH.md` via [`persona`](../persona/SKILL.md).
- A confirmed fact about objects/entities/CTAs → update `docs/OOUX_OBJECT_MAP.md` via [`map`](../map/SKILL.md)'s `objects` mode.
- An item that resolved an `docs/UNKNOWNS.md` entry → remove it from `UNKNOWNS.md` and promote the answer to whichever doc owns that domain.
- Something learned that raises a *new* open question → append it to `docs/UNKNOWNS.md` for the next round rather than losing it.

**Completion criterion:** every question in the bank ties to either an unresolved persona/domain gap or a specific `UNKNOWNS.md` entry. No generic filler questions that don't inform a real project decision.

## Mode: analysis

This mode runs as **ordered, gated phases**. The gates are the point: you plan before you
analyse, and you do not write the report before the plan is approved. This mirrors the rule the
work itself lives by — *build a plan first, share it for approval, execute only after approval.*

Treat every output as a **first draft, not final analysis.**

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
- **Autonomous mode** (suite `AGENTS.md` §2.9): transcripts and research objectives can't be invented, and a remaining PII hit can't be waved through. If any required input is missing or PII remains, skip, log tier 3 (`../../tools/log-unknown/log-unknown.sh --skill interview --tier 3 "..."`), and stop. Take the clarifying answers from `docs/PRODUCT_BRIEF.md` where they exist and log the rest as defaults.

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
- **Format.** The Markdown report (`docs/INTERVIEW_ANALYSIS.md`) is the deliverable and the approved plan file is always kept. If an evidence log or affinity matrix is wanted as a spreadsheet, also write `docs/interview-evidence-log.csv` (theme, quote, interview #, confidence). If a findings presentation is wanted, run [`tools/markdown-to-pptx`](../../tools/markdown-to-pptx/md-to-deck.mjs) on the Markdown; the deck is a best-effort render and the Markdown stays the source of truth.
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

[`persona`](../persona/SKILL.md)'s `card` mode (a theme's evidence feeds a persona card), [`journey`](../journey/SKILL.md)'s `experience` mode (this output is a valid input), and [`problems`](../problems/SKILL.md), which reads the Pain Point List.

### Anti-patterns
- Analysing before the plan is approved, or skipping the PII gate.
- A quote without its interview number, or a paraphrase presented as a quote.
- A theme with one quote not marked `WEAK SIGNAL`.
- "No user said X" reported as a finding.
- Treating a format reference as interview data.
- Dropping confidence tags to fit a slide or spreadsheet.
- Delivering without the human-review checklist, or as if it were final.

**Completion criterion:** the report carries all six outputs, every finding has a confidence tag, every quote has an interview number, and the human-review checklist is attached.

## Mode: usability

### The bias rule — the core of this mode

**Tasks are scenarios, never instructions.** "You want to buy running shoes for a marathon" — never "use the
search bar to find shoes." An instruction tests whether someone can follow directions; a scenario tests
whether the design itself is findable and clear.

- **No leading language anywhere.** A question that hints its answer gets rewritten, not kept with a caveat.
- **Every task has a stated success criterion** — how do you know, objectively, that the participant
  completed it?
- **The intro always includes**: think-aloud instructions, consent, and "we are testing the design, not you."
- **Use the real screen names** from the prototype link — never a paraphrased or invented name.

### What you'll need

**Required**
- The prototype — what it does, in 3-4 lines, plus the link (so tasks reference real screen names)
- What you need to learn — hypotheses, questions, task-success definitions
- Participant profile — as close to the target persona as possible (use the `persona` `card`-mode output if
  one exists)
- Session length

**Optional**
- Previous research findings

If any required input is missing, ask **up to three** clarifying questions. Do not start writing until the
context is sufficient. **Autonomous mode** (suite `AGENTS.md` §2.9): describe the prototype from the codebase and docs, take learning goals from `docs/UNKNOWNS.md` and the persona doc, default the session length to 30 minutes and log each default. If there's no built prototype to test, skip and log tier 3 (`../../tools/log-unknown/log-unknown.sh --skill interview --tier 3 "..."`). The pilot and the researcher's approval (Step 5) are human steps: write the script marked unpiloted and unapproved, never as ready to run.

### The workflow

```
Define goals → Describe participants → Draft script → Bias review → Pilot + approve → Run sessions
```

#### Step 1 — Define goals
Restate what needs to be learned — hypotheses, open questions, what "task success" means for this round.

#### Step 2 — Describe participants
Confirm the participant profile against the target persona, session count, and recruiting guidance: **5 per
segment finds most usability issues; only claim quantitative metrics at 12+ participants.** Don't let a
5-person session claim a success-rate percentage as if it were statistically meaningful.

#### Step 3 — Draft the script
Produce, in order:
1. **Intro script** — think-aloud instructions, consent, "we are testing the design, not you."
2. **3-5 warm-up questions** (and/or a short pre-test survey) — background and habits, nothing about the UI
   yet.
3. **4-6 task scenarios** — scenario wording + success criterion + one follow-up question each, using real
   screen names from the prototype link.
4. **Post-test** — satisfaction ratings (1-5 per area) plus 2-3 open questions, or the full **SUS 10-item
   set** if a benchmarkable score is wanted (0-100 scale; industry average ≈ 68).
5. **Moderator notes per task** — if the participant is stuck, **wait 10 seconds, then probe — never help.**
6. **Timing** — every section timed so the whole script comfortably fits the stated session length.

#### Step 4 — Bias review — GATE
Check the draft for:
- Leading or biased wording
- Double-barrelled questions
- Tasks that hint the answer or name the UI control directly
- Missing success criteria
- Redundant questions
- Sections that overflow the stated session time

**Rewrite anything that fails, and flag what was rewritten.** Do not proceed to Step 5 with a flagged item
left unresolved.

#### Step 5 — Pilot + approve
Run the script once on a colleague before any real session. Fix timings and wording based on what actually
happens, not what looked right on paper. The researcher approves the final script before Step 6.

#### Step 6 — Run sessions
**The researcher moderates. This skill's output is never used to have an AI moderate live participants** — an
AI-moderated platform is a separate, explicit, researcher's-own choice, not a default. Produce an unmoderated
variant of each task alongside the moderated script, for tools that run unmoderated at scale (moderated
answers *why*, unmoderated answers *what*, at volume) — keep at least one moderated round regardless.

**Completion criterion:** every task is a scenario (not an instruction) with a success criterion and a
follow-up, the bias review has been run and its flags resolved, and the script has been piloted before any
real session is booked.

### Output format

```
EXECUTIVE PLAN SUMMARY
AGENDA: [section] -> [minutes]
TASK n: [scenario] -> [success criterion] -> [follow-up]
METRICS: [task] -> [success] / [time] / [errors]
```

Example — *TASK 2: "You and three friends had dinner. Make everyone pay their share." → success: reaches
confirmation screen having split the bill → follow-up: "What did you expect to happen after tapping Split?"*

### Final outputs

1. **Executive test plan + moderator script** — timed to the session length, with intro (think-aloud +
   consent), warm-ups, and close.
2. **Task scenarios** — 4-6 realistic scenarios, each with a success criterion and one follow-up, real screen
   names, no leading wording.
3. **Post-test question set** — satisfaction 1-5 per area + opens, or the SUS 10-item set.
4. **Metrics sheet** — task success rate, time on task, error count, ready to fill per participant.
5. **Unmoderated task variants** — the same tasks phrased for an unmoderated run.

### Human review required

Before sessions are booked:
- **You moderate — an AI never talks to participants.** An AI-moderated platform is an explicit, separate
  choice the researcher makes, never this skill's default.
- Pilot the script once on a colleague; fix timings and wording.
- The researcher approves the final script.
- Leading wording or a missing success criterion turns feedback analysis into opinion, not evidence — catch
  it here, not after sessions run.
- Don't claim metrics from 5 users. 5 per segment finds issues; numbers need 12+.

**Treat the output as a first draft, not final research.**
