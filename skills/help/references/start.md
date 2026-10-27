# Start: the first-run questions

Used by `help` in two cases: Step 0 found no `WORKFLOW.md`, or the user typed `help start`. Goal: learn who the person is and where the project stands, then save a workflow that wraps every skill in plan, source, audit and approval.

## Rules

- At most five questions, one at a time. Give a recommended answer with each.
- Skip any question the repo, the project `AGENTS.md` or an existing `WORKFLOW.md` already answers. Say what you inferred and ask "right?" instead.
- In an interactive Claude Code session, use the `AskUserQuestion` tool for the multiple-choice questions. Where it is not available (Chat, Claude Design), ask in text with a numbered list and accept a number or a word.
- If the user says skip, stop. Save nothing. Do not ask again in this session.
- Ask for no names, emails or other personal details. Role and goal are enough.

## The questions

1. **Role.** UX researcher, UX designer, UX writer or content designer, UI designer, design systems, or design engineer (front-end and design). If the answer is "other", ask one short line and map it to the nearest row in [`role-phase-map.md`](role-phase-map.md).
2. **Where the project stands.** Idea, discovery, definition, design or prototype, testing, handoff or build, live. Pre-fill from the Step 1 signals: "It looks like X because Y. Right?"
3. **Goal for this week.** Offer the three most likely goals from the role's core skills for that phase (see the map), plus "something else".
4. **Environment.** Claude Code, Chat or Claude Design, and whether a shell is available. Infer it first and ask only if unclear. It decides the command prefix and whether skills that need a shell (`prototype`, `package`, `storybook`, `showcase`, `skill-manager`) are usable.
5. **Guardrails.** Strict (default): plan first, a source for every claim, an audit after each step, a person approves. Light: plan first and audit at the end. Recommend strict.

## Then

1. Build the workflow card from [`role-phase-map.md`](role-phase-map.md) and [`workflow-card.md`](workflow-card.md).
2. Show it in chat, with the next three commands for this person's environment.
3. Ask: "Save this as `<docs>/WORKFLOW.md`?" Write only after a yes. If a file system is not available, return the text and the path.
4. Say what happens next in one line: the user runs the first skill, and `help` will recommend from this workflow.

## If a WORKFLOW.md already exists

Show it and ask what changed (role, phase, goal, guardrails, a new person). Update the lines that changed and the `Updated:` date. Add a new person on a new line under People. Never remove or rewrite someone else's line.

## Boundaries

- `start` asks and saves. It does not run any other skill. The user does that, or accepts a recommendation.
- The default mode of `help` reads the project and recommends. `start` asks the person. They share the workflow file but not the job.
- The role map is a starting point. If it suggests a skill the user does not need, swap it in the card and say so.
