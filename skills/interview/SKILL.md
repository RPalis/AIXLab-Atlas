---
name: interview
description: >-
  Plans and analyzes research with real users. Modes: questions (interview kit), analysis
  (transcripts to evidence-backed themes), usability (test plan and moderator script for a built
  prototype). Use when preparing to talk to users, holding transcripts, or testing a prototype.
argument-hint: "[questions: build interview kit | analysis: synthesise transcripts | usability: test plan + script]"
disable-model-invocation: true
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
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Read the wiki first
- If the project has a wiki, read it before you ask the user, and cite source IDs such as `(S-004)`. Read only: the [`wiki`](../wiki/SKILL.md) skill alone writes to it. Rules: [`reading-rule.md`](../wiki/references/reading-rule.md).

## Modes

Open the reference file for the chosen mode and follow it. Load only that file. Cross-references between modes name the mode, so open that mode's file when one is named.

| Mode | What it does | File |
|---|---|---|
| `questions` | build interview kit | [references/questions.md](references/questions.md) |
| `analysis` | synthesise transcripts | [references/analysis.md](references/analysis.md) |
| `usability` | test plan + script | [references/usability.md](references/usability.md) |
