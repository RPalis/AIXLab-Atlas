---
name: usability-test-plan
description: >-
  Turn a states-checked prototype into a structured, unbiased usability test plan and moderator script —
  realistic task scenarios with success criteria, a timed agenda, and a bias review pass, tailored to your
  goals, participants and session length. Use before booking test sessions, ahead of feedback analysis, before
  iterating a prototype into hi-fi, or before UX/UI handoff. Trigger on "write a usability test plan", "build
  a moderator script", "plan a usability test", "test scenarios for this prototype", or when a prototype
  exists and needs real users to try it.
---

# Usability Test Plan + Script

Turns a prototype and a set of learning goals into a timed test plan, a moderator script, and a metrics sheet
— ready to run, not just outlined. ~20-30 minutes.

**Not this skill:**
- Building the prototype this tests → `prototype`, or writing the interview guide for *discovery* research
  (before anything is built) → Atlas's `interview`. This skill is specifically for testing something that
  already exists.
- Clustering or analysing what participants said once sessions run → the researcher's own synthesis pass;
  this skill produces the plan and script, not the readout.
- Choosing the prioritisation framework for what the findings imply → a prioritisation framework of your choice (for example RICE or impact versus effort).

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if
  asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep
  substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no
  unrequested scaffolding.

## The bias rule — the core of this skill

**Tasks are scenarios, never instructions.** "You want to buy running shoes for a marathon" — never "use the
search bar to find shoes." An instruction tests whether someone can follow directions; a scenario tests
whether the design itself is findable and clear.

- **No leading language anywhere.** A question that hints its answer gets rewritten, not kept with a caveat.
- **Every task has a stated success criterion** — how do you know, objectively, that the participant
  completed it?
- **The intro always includes**: think-aloud instructions, consent, and "we are testing the design, not you."
- **Use the real screen names** from the prototype link — never a paraphrased or invented name.

## What you'll need

**Required**
- The prototype — what it does, in 3-4 lines, plus the link (so tasks reference real screen names)
- What you need to learn — hypotheses, questions, task-success definitions
- Participant profile — as close to the target persona as possible (use the `persona` `card`-mode output if
  one exists)
- Session length

**Optional**
- Previous research findings

If any required input is missing, ask **up to three** clarifying questions. Do not start writing until the
context is sufficient.

## The workflow

```
Define goals → Describe participants → Draft script → Bias review → Pilot + approve → Run sessions
```

### Step 1 — Define goals
Restate what needs to be learned — hypotheses, open questions, what "task success" means for this round.

### Step 2 — Describe participants
Confirm the participant profile against the target persona, session count, and recruiting guidance: **5 per
segment finds most usability issues; only claim quantitative metrics at 12+ participants.** Don't let a
5-person session claim a success-rate percentage as if it were statistically meaningful.

### Step 3 — Draft the script
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

### Step 4 — Bias review — GATE
Check the draft for:
- Leading or biased wording
- Double-barrelled questions
- Tasks that hint the answer or name the UI control directly
- Missing success criteria
- Redundant questions
- Sections that overflow the stated session time

**Rewrite anything that fails, and flag what was rewritten.** Do not proceed to Step 5 with a flagged item
left unresolved.

### Step 5 — Pilot + approve
Run the script once on a colleague before any real session. Fix timings and wording based on what actually
happens, not what looked right on paper. The researcher approves the final script before Step 6.

### Step 6 — Run sessions
**The researcher moderates. This skill's output is never used to have an AI moderate live participants** — an
AI-moderated platform is a separate, explicit, researcher's-own choice, not a default. Produce an unmoderated
variant of each task alongside the moderated script, for tools that run unmoderated at scale (moderated
answers *why*, unmoderated answers *what*, at volume) — keep at least one moderated round regardless.

**Completion criterion:** every task is a scenario (not an instruction) with a success criterion and a
follow-up, the bias review has been run and its flags resolved, and the script has been piloted before any
real session is booked.

## Output format

```
EXECUTIVE PLAN SUMMARY
AGENDA: [section] -> [minutes]
TASK n: [scenario] -> [success criterion] -> [follow-up]
METRICS: [task] -> [success] / [time] / [errors]
```

Example — *TASK 2: "You and three friends had dinner. Make everyone pay their share." → success: reaches
confirmation screen having split the bill → follow-up: "What did you expect to happen after tapping Split?"*

## Final outputs

1. **Executive test plan + moderator script** — timed to the session length, with intro (think-aloud +
   consent), warm-ups, and close.
2. **Task scenarios** — 4-6 realistic scenarios, each with a success criterion and one follow-up, real screen
   names, no leading wording.
3. **Post-test question set** — satisfaction 1-5 per area + opens, or the SUS 10-item set.
4. **Metrics sheet** — task success rate, time on task, error count, ready to fill per participant.
5. **Unmoderated task variants** — the same tasks phrased for an unmoderated run.

## Human review required

Before sessions are booked:
- **You moderate — an AI never talks to participants.** An AI-moderated platform is an explicit, separate
  choice the researcher makes, never this skill's default.
- Pilot the script once on a colleague; fix timings and wording.
- The researcher approves the final script.
- Leading wording or a missing success criterion turns feedback analysis into opinion, not evidence — catch
  it here, not after sessions run.
- Don't claim metrics from 5 users. 5 per segment finds issues; numbers need 12+.

**Treat the output as a first draft, not final research.**
