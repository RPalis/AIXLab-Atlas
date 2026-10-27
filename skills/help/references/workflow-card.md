# Workflow card

The card is shown in chat and, after a yes, saved as `<docs>/WORKFLOW.md`. Keep the file at 40 lines or fewer so reading it stays cheap. Use the date format `YYYY-MM-DD`.

## The framework around every skill run

Each step in the sequence carries the same five checks. Strict mode applies all five. Light mode applies Plan and Audit.

1. **Plan.** Show the plan and wait for a yes before creating or changing a file.
2. **Ground.** Every finding names its source (a file, a quote, a screen). A missing fact goes to `<docs>/UNKNOWNS.md`. A guess is labelled as a guess.
3. **Gate.** A person approves each file change. In Claude Code, a project that starts in plan mode makes this automatic.
4. **Audit.** Run the audit that fits the step (see below). Audit finds problems and fixes nothing. The user marks each finding accept, reject or unsure.
5. **Memory.** The result is saved in the docs folder (the skill's own doc, `UNKNOWNS.md`, `adr/`), not left in the chat.

Audit that fits the step: research outputs, the evidence rules inside `interview-analysis`; screens, `audit` craft or heuristic; accessibility, `audit` a11y; tokens and structure, `audit` code; a build against its design, `audit` spec.

## Command prefix by environment

| Environment | How the user calls a skill |
|---|---|
| Claude Code | `/aix-lab-atlas:<skill>`, for example `/aix-lab-atlas:brief` |
| Chat | Type `/`, then `aix-lab-atlas`, and pick the skill, or ask for it by name |
| Claude Design | `/<skill>`, for example `/brief`, after the skills are copied into the project |

## WORKFLOW.md template

```markdown
# Workflow
Updated: YYYY-MM-DD · Guardrails: strict

## People
- <role> · <environment>

## Project
Phase: <Discover | Decide | Design | Deliver> · Goal this week: <one line>

## Sequence
1. `<skill> [mode]`: <why now> → <file it writes>
2. `<skill> [mode]`: <why now> → <file it writes>
3. `audit <mode>`: <what it checks> → findings only
(3 to 6 steps. Core skills first, optional ones marked "optional".)

## Every step
Plan first, wait for a yes · Cite a source or log to UNKNOWNS.md · Audit, then decide · Save to the docs folder

## Next three commands
1. `<prefix><skill>`
2. `<prefix><skill>`
3. `<prefix><skill>`
```

## Staleness

- `Updated:` older than 14 days: `help` offers a refresh.
- The phase docs for a later phase now exist: `help` offers a refresh.
- Never refresh without asking.
