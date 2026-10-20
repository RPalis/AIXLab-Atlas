# Scope

What belongs in UX Atlas, and how a decision to leave something out is recorded.

## A change belongs here when

- It fixes a failure someone saw: what they ran, what the skill did, what they expected.
- It fits the process: Discover, Decide, Design, Deliver (see `AGENTS.md` §1).
- It helps someone through the UX process: collecting information, organizing thoughts, exposing details, or generating ideas. The prototype is a milestone in that work, and the groundwork comes before it, so a change that only makes the build faster is not enough. A quick start for a project joined midway is in scope: it collects the minimum, builds, and backfills.
- It fits an existing skill or mode. Most requests do. Add a mode before a skill, and add a reference file before a mode.
- It works from a fresh install with nothing else needed (`AGENTS.md` §2.5).

## A change stays out when

- It is a setting for one person's workflow. That belongs in the user's own `CLAUDE.md` or `AGENTS.md`.
- It is a branch for one product or one agent harness.
- Existing skills can already do it when composed.
- It matches a file in `.out-of-scope/`.
- It makes the suite a process the user cannot control. Every skill must stay usable on its own, and `coordinator-agent` stays optional.

## New skills

A new skill needs a stated boundary from each neighbor (`AGENTS.md` §6), a shared workflow shape or a real capability gap that no mode can close, a `disable-model-invocation` decision, an `evals/<skill>.json` file, and an entry in the three index docs.

## Recording a rejection

Write one file per rejected idea in `.out-of-scope/<short-name>.md`: the idea, the date, the reason, and what to do instead. Read that folder before proposing something that sounds familiar.
