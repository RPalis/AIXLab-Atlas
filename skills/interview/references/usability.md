# Interview: usability mode

Part of the [`interview`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

## Contents

  - The bias rule — the core of this mode
  - What you'll need
  - The workflow
  - Output format
  - Final outputs
  - Human review required

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
context is sufficient. **Autonomous mode** (suite `AGENTS.md` §2.9): describe the prototype from the codebase and docs, take learning goals from `docs/UNKNOWNS.md` and the persona doc, default the session length to 30 minutes and log each default. If there's no built prototype to test, skip and log tier 3 (`../../../tools/log-unknown/log-unknown.sh --skill interview --tier 3 "..."`). The pilot and the researcher's approval (Step 5) are human steps: write the script marked unpiloted and unapproved, never as ready to run.

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
