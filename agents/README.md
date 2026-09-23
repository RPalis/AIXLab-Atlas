# Agents

Subagent definitions that run one of this suite's skills with minimal
back-and-forth. Each one is a thin wrapper: it finds the skill's real
`SKILL.md`, states autonomous mode explicitly (suite `AGENTS.md` §2.9), and
follows the skill exactly as written, including whatever tools that skill
already calls (relative paths inside a `SKILL.md` resolve fine once the file
is read from its real location, no rewriting needed). Most of them really do
run fully unattended; two (`scaffold-agent`, `competitors-agent`) have a
checkpoint a human resolves before they're dispatched — see below.

**Not every skill gets an agent.** Only ones whose ask-points are already tier-1
(safe default, log it) or tier-2 (conservative assumption, log it) across the
board — see the conversation that produced these for the reasoning per skill.
A skill with a real tier-3 stop, or genuine subjective judgment at its core
(`craft`-mode scoring, `map`'s `objects` mode, styleguide's forge-mode sourcing),
isn't a good candidate yet: an agent can still do the mechanical prep for one of
those, but shouldn't be trusted to run the whole thing unattended and call the
output final. `competitors-agent` is a good candidate specifically *because* it
has a real, well-defined tier-3 stop (an unanswered brief) rather than because
it lacks one — the stop condition is the point, not a gap.

**Mechanical vs. UX-consequential is a second, separate axis from the tiers.**
The tiers (§2.9) answer "is this safe enough to guess"; a **checkpoint** answers
a different question — "does the designer want to have made this call
themselves, even if a guess would be safe." Which site-type layer a scaffold
becomes and which competitors anchor a positioning narrative are checkpoints:
never guessed, not even at tier 1. Everything else in this directory — code
checks, packaging, documenting what's already built — is mechanical and runs
fully unattended. A background agent can't pause mid-run to ask a question, so
every checkpoint is resolved by `coordinator-agent` live with the designer
*before* it dispatches the agent whose work depends on the answer, never by the
dispatched agent itself. See `coordinator-agent.md`'s "Checkpoints" section for
the mechanism.

## Status

These are real, working subagent definitions, but **not yet wired into
`install.sh`** — they live only in this repo for now, not copied to a hub or
symlinked into any client the way `skills/` and `tools/` are. Validate the
pattern with these before building that distribution machinery out.

**To actually run `coordinator-agent`**, every agent it might dispatch needs to
be discoverable as a subagent type in whatever environment it runs — for
Claude Code, that means these files (or copies of them) need to live somewhere
the harness looks for subagent definitions (its own `.claude/agents/`
convention) in the project being driven, not just in this suite repo. Until
`agents/` is wired into `install.sh` the same way `skills/` and `tools/` are,
that placement is a manual step.

## Current agents

- **`audit-agent.md`** — runs `audit` in `code` mode (autonomous default per the
  skill itself), writes findings to `<docs>/AUDIT_CODE_FINDINGS.md` since there's
  no chat for an unattended run's report to land in.
- **`package-agent.md`** — runs `package`'s `lite` or `full` mode end to end;
  both are already script-driven with a scripted verification step.
- **`scaffold-agent.md`** — runs `scaffold`'s base scaffold mechanics unattended,
  but expects the type layer and Figma library decisions already resolved by
  whoever dispatches it (checkpoints, never guessed); stops before scaffolding
  anything at all if an unconfirmed Figma library turns up.
- **`storybook-agent.md`** — runs `storybook` end to end; the skill has no
  ask-points at all.
- **`requirements-agent.md`** — runs `requirements` end to end into
  `docs/REQUIREMENTS.md`; auto-groups a large prototype's Epics/Features rather
  than pausing (tier 2, logged), but never auto-publishes to a connected
  Jira/ADO tracker (tier 3, always a human-confirmed write).
- **`guide-agent.md`** — runs `guide` end to end into `docs/USER_GUIDE.md`; no
  ask-points in the skill, but verifies each phase against real code before
  writing it rather than trusting a doc that might describe something aspirational.
- **`competitors-agent.md`** — runs `competitors`' `discover` mode in two
  dispatchable phases: `discover` (research, rank, propose a top-5 — no
  profiling, no doc written) and `profile` (deep-dive exactly the candidates a
  human confirmed). Hard-stops (tier 3, logged) before either phase if
  `docs/PRODUCT_BRIEF.md` doesn't already answer what kind of product this is.
- **`coordinator-agent.md`** — doesn't do skill work itself. Dispatches the six
  above in priority order via a readiness table (per-agent prerequisite +
  "already done" checks, not just `tools/detect-project-phase`'s coarser phase
  value), stops the instant a new blocking item appears in
  `tools/log-unknown --list-blocking`, refuses to let `package-agent`/
  `requirements-agent`/`guide-agent` run while `audit-agent` has found an
  unresolved P0 (no `refine-agent` exists yet to close that gap automatically),
  and — the main behavior change from a purely background loop — pauses to
  resolve `scaffold-agent`'s and `competitors-agent`'s checkpoints live with the
  designer before dispatching either. Expect most runs to do a few hops and
  then correctly hand off to a human, since only 7 of the suite's ~24 skills
  have agents so far.

## Format

Standard Claude Code subagent file: YAML frontmatter (`name`, `description`,
`tools`) plus instructions in the body. `description` states what the agent does
and when to use it, the same way a skill's frontmatter does, so it can be
selected the same way.
