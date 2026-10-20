# 0003: The four phases follow the double diamond, and skills sit where their output is locked

Date: 2026-10-12. Settled in a design discussion with the maintainer.

## Decision
The workflow follows the double diamond.
- **Discover** diverges: gather everything.
- **Decide** converges: lock the problem statements and How Might We questions, the success measures, and the structure the solution lives in (object model, IA, architecture, flows).
- **Design** diverges again: explore several solutions, prototype, and test to find the right path.
- **Deliver** converges: one solution, with the visual language locked and the work built with development.

A skill belongs to the phase where its output is made or locked. `problems`, `metrics` and `map` are in Decide. `brainstorming`, `scaffold`, `refine`, `restyle`, `figma` and `interview` `usability` are in Design. `styleguide`, `storybook`, `package`, `requirements`, `guide`, `showcase`, `redline` and `audit` `code` and `spec` are in Deliver. `moodboard` stays in Decide, where the maintainer placed it. `problems` now writes a How Might We question for every problem statement. `foundations-check` adds the locked problem as a seventh foundation.

## Why
The maintainer set the model, and the suite did not state it. The old placement contradicted it: problem statements sat in Discover, solution ideation sat in Decide, and the visual language sat in Design.

## Rejected alternatives
- **`map` in Design.** It explores structure, but its output (object model, IA, architecture, flows) has to be locked before designing, so it belongs where it is locked.
- **`styleguide` and `storybook` in Design.** They are delivery assets for development, so they sit in Deliver. `restyle` still compares looks in Design, and hands the pick to `styleguide` `forge` to commit.
- **Leave `brainstorming` in Decide.** Ideating solutions is the second diverge, so it belongs in Design.
- **Leave usability testing in Deliver.** Testing prototypes is how the team picks the path, so it sits in Design. Deliver keeps the final checks and the development handoff.

## Scope
Phase labels in the README, AGENTS.md, the atlas and `index.html`; the How Might We output of `problems`; the foundations check. No skill was renamed or removed. A project that already uses the old order keeps working, because no file path changed.
