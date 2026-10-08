# Help: doctor mode

Part of the [`help`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Reports whether a prototype project is in sync with the suite's conventions. It finds drift. It never fixes it. Each problem names the skill that fixes it.

## Step 1: Run the tool

Run [`tools/doctor`](../../../tools/doctor/doctor.mjs) from the project root:

```bash
node ../../../tools/doctor/doctor.mjs
```

The tool prints a context digest (docs folder, phase, token file, open blocking unknowns, design-hook state) and then a list of problems. Add `--json` for machine-readable output. The exit code is 0 for no problems and 1 for problems.

## Step 2: Report

- Show the digest in three or four lines. Do not repeat every key.
- List each problem with its fix skill and the exact command to run it.
- Order problems by effect: a missing docs folder or token file first, then contrast failures, then design-check findings.
- Offer to turn on the edit-time design hook if it is off and the project has a token file: `node ../../../tools/design-hook/design-hook.mjs --enable`.

## Step 3: Stop

Do not repair drift as a side effect of the check. Hand over the commands and wait.

**Completion criterion:** the report lists every problem the tool found, each with one fix skill, and nothing was changed on disk.

**Autonomous mode** (suite `AGENTS.md` §2.9): write the tool output to `<docs>/DOCTOR_REPORT.md` and stop. Log a milestone only when a blocking unknown or a contrast failure is open.
