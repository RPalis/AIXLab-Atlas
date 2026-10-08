# Evals

Each `evals/<skill>.json` holds at least three cases for one skill. Anthropic's authoring guide asks for evals before wide use, and for tests on every model the skill will run on (Haiku, Sonnet, Opus).

## File shape

```json
{
  "skill": "audit",
  "cases": [
    { "query": "/audit perf", "setup": "Vite prototype with a 600 kB script chunk",
      "expected_behavior": ["Builds and serves the production output before measuring", "..."] }
  ],
  "trigger": { "should_start": ["..."], "should_not_start": ["..."] }
}
```

- `query` is what the user types. `setup` says what the test project needs. `expected_behavior` is a list of checks a grader can answer yes or no.
- `trigger` lists plain-language requests. `should_start` (model-invoked skills only) are requests where the skill must start. `should_not_start` are near misses where it must not start.
- User-invoked skills (`disable-model-invocation: true`) have no `should_start`, because the agent cannot start them. They may list `should_not_start` requests to prove the agent leaves them alone and routes through `help` instead.

## How to run a round

There is no built-in grader. Run it by hand, and record the result.

1. Print the grading sheet for one skill and one model:
   ```bash
   node evals/run.mjs sheet audit sonnet
   ```
2. In a fresh project that matches each case's `setup`, start Claude Code with the plugin (`claude --plugin-dir /path/to/ux-atlas --model sonnet`) and type each `query`.
3. Mark each `expected_behavior` line pass or fail on the sheet. For trigger cases, mark whether the skill started.
4. Save the filled sheet in `evals/results/<date>-<skill>-<model>.md`.
5. On a failure, change the skill (not the eval), then rerun that case on all three models.

Run the whole set before a release and after any change to a description, a router table or a mode file. List what exists with `node evals/run.mjs list`.

`scripts/validate.mjs` fails if a skill has fewer than three cases.
