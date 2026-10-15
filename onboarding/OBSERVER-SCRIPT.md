# Observer script: fresh-user session

Use this to run one observed first-time session of the AIX Lab-Atlas skills. One observer, one tester, about 60 minutes including debrief.

The tester follows [`ONBOARDING.md`](../ONBOARDING.md) (or the visual version, [`guide.html`](guide.html)). You watch. You are testing the guide, not the tester.

## Before the session (10 minutes, observer alone)

1. Decide the tester's **route** (A invite, B public, C ZIP), **track** (1 Claude Code, 2 Claude.ai chat) and **operating system**. Write them on the first line of the findings log.
2. Route A: confirm the invitation was sent to the account the tester will use, and that it has not already been accepted on another account.
3. Route C: confirm the ZIP opens and contains `skills`, `README.md`, `install.sh`.
4. Make sure the tester's machine has none of these skills installed already. A clean macOS user account is ideal. If skills exist from an earlier run, delete `~/.claude/skills/<the 30 names>` and `~/.agents/skills` first, otherwise you are not testing a first install.
5. Open [`FINDINGS-LOG.csv`](FINDINGS-LOG.csv) in a spreadsheet. Start a stopwatch.
6. Check that the tester has no real client material open or in the practice folder.

## Say this to the tester

> "I am testing the guide, not you. If anything is confusing, that is a bug in the guide. Please think out loud. I will not help unless you have been stuck for five minutes. If you want to stop, say so at any time."

Give them the guide. Do not demonstrate anything.

## During the session

### What to record

For every step the tester takes:

- The step number from the guide.
- The time they started and finished it.
- Any hesitation longer than 10 seconds, and what they said.
- Any step where the screen did not match the guide.
- Every time you intervened, what you said, and the clock time.

### When you may help

- The tester has been stuck for **5 minutes** on one step. Give the smallest hint that unblocks them and log it as an intervention.
- A **stop rule** triggers (below). Intervene at once.

### Stop rules (end the session or pause and fix first)

| Trigger | Why it matters | Action |
|---|---|---|
| A file is written outside `atlas-practice` | Scope guardrail failed | Pause. Note the path and which skill wrote it. Do not continue until reviewed. |
| Claude asks for a password, key or token | Credential guardrail | Tell the tester not to enter it. Log it. |
| A skill writes a file before showing a plan | Plan-first guardrail failed | Log the skill and the exact wording the tester used. |
| The tester switches on bypass or auto-accept permissions | Permission guardrail | Ask them to switch it off and log it. |
| The tester is distressed or wants to stop | | Stop. |

### Fixed checkpoints

Record the clock time at each. Write "not reached" if the tester does not get there.

| # | Checkpoint | Pass condition |
|---|---|---|
| C1 | Files obtained | Folder with `skills`, `README.md`, `install.sh` open |
| C2 | Install complete | Track 1: installer ends with "installed 30 skills". Track 2: three skills show as on |
| C3 | Skills visible | Typing `/` lists AIX Lab-Atlas skills (Track 1), or the help skill answers (Track 2) |
| C4 | First plan seen | A plan was shown before any file was written |
| C5 | Doc shell created | Track 1: `README.md`, `AGENTS.md`, `<name>-docs/UNKNOWNS.md` exist |
| C6 | Unknowns captured | "I don't know" answers recorded as unknowns, not invented |
| C7 | Evidence guardrail | `persona card` with no research was refused (pass) or invented a persona (fail) |
| C8 | Audit run | At least one finding marked accept, reject or unsure |

### What not to do

- Do not read the guide aloud or point at the screen.
- Do not fix their machine for them. If it needs fixing, that is a finding.
- Do not defend the guide. Write down what they said.

## After the session (15 minutes)

1. Ask the tester to fill in [`FEEDBACK-FORM.md`](FEEDBACK-FORM.md) alone, then ask the three debrief questions:
   - What was the first moment you were unsure what to do?
   - Was there a step you did without understanding it?
   - What would make you use this on real work, and what would stop you?
2. Complete the findings log. Mark each finding as a **guide defect** (the words or order were wrong), a **skill defect** (a skill misbehaved), or an **environment issue** (machine, account, network).
3. Count: checkpoints reached, total interventions, minutes from start to C3.
4. Send the log and the form to the guide owner. Do not edit the guide during the session.

## How to read the results

| Result | Meaning |
|---|---|
| Reached C8 with 0 interventions | The guide works for this route and track |
| Any intervention | The step it happened at needs rewording or a screenshot |
| C4 failed | A skill ran without showing a plan: skill defect, fix before wider testing |
| C7 failed | A skill invented evidence: skill defect, fix before wider testing |
| Stopped before C3 | Install or access route is broken: fix before any more testers |

One tester is one data point. Do not present the time to C3 or C8 as an average or a promise.
