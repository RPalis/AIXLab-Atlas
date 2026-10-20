# UX Atlas: competitive analysis and best-practice gap list

Date: 2026-10-08. Sections 1 to 10 are the assessment as first written. Section 11 records what was checked afterward and what was changed on the `best-practices-alignment` branch.

Compared against:

- **Pocock**: Matt Pocock's `mattpocock/skills` (engineering and productivity skills).
- **Impeccable**: Paul Bakaus's `pbakaus/impeccable` (frontend design skill, v4.2.2 installed locally).
- **Platform docs**: the Agent Skills spec (agentskills.io), Anthropic's skill authoring guide, Claude Code skills and plugins docs, OpenAI Codex skills docs, Gemini CLI skills docs.

## 1. Verdict

UX Atlas has the widest process coverage of the three. Neither competitor covers research, personas, OOUX, IA, journeys, metrics, or stakeholder deliverables. That is the moat.

UX Atlas is weaker in three areas:

1. **Portability.** Several choices break or degrade in Codex, on claude.ai uploads, and in single-skill installs.
2. **Context cost.** All 29 skills are model-invoked. Together the descriptions are about 20,500 characters (about 5,100 tokens) in every session.
3. **Design craft depth.** `refine` is 57 lines. Impeccable has 24 commands, a measurable quality floor, and a deterministic detector. Part of `refine`'s guidance also conflicts with current craft practice (see 6.4).

Top five moves, in order:

1. Fix hard spec violations: five descriptions over 1,024 characters and the non-spec `argument-hint` key.
2. Split invocation: make phase skills user-invoked and keep a small model-invoked core.
3. Make the suite self-contained per install target: ship a plugin, or vendor `tools/` into each skill.
4. Split big multi-mode skills into a router plus one reference file per mode.
5. Turn the Golden Rule (two-layer tokens) into a deterministic check with a hook.

## 2. Method and confidence

| Label | Meaning |
|---|---|
| **Repo-verified** | I read or measured it in this repo. |
| **Docs-verified** | I read it on the official docs page named in section 10. |
| **Unverified** | Inferred. Test before acting. |

Limits: I read Impeccable's `SKILL.md`, `routing.md`, `craft-floor.md`, and file listing, not all 36 reference files. I read Pocock's README, `SCOPE.md`, `ask-matt`, and `writing-great-skills` (local copy from 2026-08-27), not every skill. I did not read Cursor or Copilot skill docs.

## 3. Side by side

| Dimension | UX Atlas | Pocock | Impeccable |
|---|---|---|---|
| Domain | UX process, Discover to Deliver, plus prototype build | Software engineering workflow | Frontend visual craft |
| Shape | 29 skills, 13 with modes, 8 agents, 14 shell/node tools | About 25 skills in `engineering/` and `productivity/` | 1 skill, 24 sub-commands, 36 reference files, engine binary |
| Invocation | All 29 model-invoked | Split: user-invoked orchestrators, model-invoked primitives, a router (`ask-matt`) | One description; sub-commands routed inside; `pin` creates shortcuts |
| Context cost | About 20,500 description characters | Low: user-invoked skills have no description in context | One description (about 1,000 characters) |
| Determinism | Grep scripts (`check-hardcoded-colors`, `audit-mechanical-checks`), phase detection | TDD loop, regression tests | 59-rule detector, CLI with exit codes, edit-time hook, browser extension |
| Project context | `AGENTS.md`, `PRODUCT_BRIEF.md`, `DESIGN.md`, `UNKNOWNS.md`, ADRs | `GLOSSARY.md` (older: `CONTEXT.md`), ADRs, per-repo setup skill | `PRODUCT.md`, `DESIGN.md`, `.impeccable/config.json`, a `context` loader, `doctor` |
| Distribution | `install.sh` from a clone | Claude/Codex/Copilot plugins, `npx skills add`, Gemini folders | `npx impeccable install`, plugins, submodule, ZIP, about 16 harnesses |
| Authoring guidance | `AGENTS.md` §4 (structure, ASD-STE100, prose hygiene) | `writing-great-skills`, `writing-for-agents`, `SCOPE.md`, `.out-of-scope/` | Rules written as measurable thresholds |
| Scope discipline | Merge rules in `AGENTS.md` §6 | "New skills are not accepted." Compose existing ones. | One skill; commands added inside it |
| Autonomous mode | Three-tier rules and checkpoints (§2.9) | None found | None found |
| Evals and CI | None found | `.github/`, changesets, changelog | `tests/`, detector rules, CI exit codes |

## 4. Where UX Atlas already leads

Keep these. They are the reason to choose this suite.

1. **Upstream research and decision skills.** `persona`, `interview`, `journey`, `metrics`, `problems`, `brainstorming`, `map` (objects, ia, flow, site). Neither competitor has them.
2. **Evidence discipline.** Confidence tags, `UNKNOWNS.md`, and "never invent". Pocock's grilling resolves open questions in conversation but writes no equivalent log. Impeccable's `PRODUCT.md` has an "evidence" section but no unknowns register.
3. **Two-layer token architecture** with a fixed semantic role list. Impeccable generates a `DESIGN.md` from existing code. Atlas prescribes the structure.
4. **Autonomous-mode rules.** Tiers 1 to 3 plus the "UX decision is a checkpoint" rule. No competitor states this.
5. **Stakeholder deliverables.** `showcase` (Word, PowerPoint, reveal.js), `package` (three modes), `figma` (three modes).
6. **Audit variety.** Five audit modes with different rubrics and a stated rule not to merge their scores.
7. **Phase awareness.** `help` plus `tools/detect-project-phase` read repo state and recommend the next skill.

## 5. Gaps against platform documentation

### 5.1 Compliance matrix

| # | Rule (source) | Atlas state | Evidence | Severity |
|---|---|---|---|---|
| P1 | `description` max 1,024 characters (spec; Anthropic guide) | 5 skills exceed it: `competitors` 1,647, `map` 1,587, `setup` 1,360, `journey` 1,282, `showcase` 1,100 | Repo-verified (folded text, whitespace collapsed) | **High**. Strict validators and the API reject these. |
| P2 | Claude Code truncates `description` plus `when_to_use` at 1,536 characters in the listing | `competitors` and `map` exceed it, so trigger text is cut | Docs-verified, repo-verified | High |
| P3 | Outside Claude Code, only `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` are accepted. Other keys are a hard error on upload. | `argument-hint` in 13 skills | Docs-verified, repo-verified | **High** for any claude.ai or API upload |
| P4 | Keep `SKILL.md` under 500 lines and about 5,000 tokens (spec; guide) | `map` is 505 body lines. `audit` 408, `interview` 299, `journey` 281, `competitors` 263 are near the limit and carry every mode's text. | Repo-verified | Medium |
| P5 | Codex builds its skill list within 2% of the context window (8,000 characters if unknown). Longer lists shorten descriptions first, then omit skills with a warning. | About 20,500 characters of descriptions | Docs-verified | **High** for Codex users |
| P6 | Keep references self-contained and relative to the skill root (spec) | 50 references to `../../tools/...` across 16 skills, plus many `../<skill>/SKILL.md` links | Repo-verified | **High** for any install that copies one skill alone |
| P7 | Reference files over 100 lines should start with a table of contents (guide) | `competitors/references/benchmark/rubric.md` has 123 lines and no contents list | Repo-verified | Low |
| P8 | Write descriptions in third person with what and when (guide) | Mostly met. `audit` and `refine` open with imperatives. | Repo-verified | Low |
| P9 | Avoid vague or overly generic names (guide) | `help`, `guide`, `map`, `package`, `setup`, `wiki`, `brief`, `metrics`, `problems` are generic | Repo-verified | Medium (see P10) |
| P10 | A user-level skill replaces a built-in command with the same name (Claude Code) | `help` may shadow `/help`. Namespaced plugin skills would not. | Docs-verified for the rule. Whether `/help` is replaced is **unverified**. | Medium. Test it. |
| P11 | Test with Haiku, Sonnet, and Opus. Write at least three evals per skill. | No evals found | Repo-verified | Medium |
| P12 | Use `allowed-tools` with `${CLAUDE_SKILL_DIR}` to run bundled scripts without prompts | Not used. Scripts live outside the skill folder, so it cannot be used as written. | Docs-verified, repo-verified | Low |
| P13 | `license`, `metadata.version`, `compatibility` are optional spec fields | None set. There is no `LICENSE` file in the repo root. | Repo-verified | Medium for sharing the repo |

### 5.2 Per-system notes

| System | What works today | What to change |
|---|---|---|
| **Claude Code** | Hub copy plus symlink in `~/.claude/skills` works. | Add a plugin manifest so skills are namespaced and the tools folder travels with them. Add `disable-model-invocation`. Consider `paths` and `context: fork`. |
| **Claude.ai and API upload** | Not usable as is (P1, P3, P6). | Provide a build step that outputs clean per-skill ZIPs: spec keys only, tools vendored in. |
| **Codex** | `~/.agents/skills` is on its scan path. | `~/.codex/skills` is not on the documented path, so the `install.sh` link may only add duplicates (same-name skills are not merged). **Unverified.** Add `agents/openai.yaml` with `policy.allow_implicit_invocation` per skill. Fix the description budget (P5). |
| **Gemini CLI** | Reads `~/.agents/skills`. `install.sh` already treats it as a no-op. Activation shows a consent prompt per skill. | None needed beyond P1 to P6. Keep descriptions short because every one enters the system prompt. |
| **Cursor, Copilot** | `install.sh` links them. | **Unverified.** Read their current skill docs before claiming support. |

### 5.3 Install-path risk in `install.sh`

- `install.sh` copies `tools/` to `~/.agents/tools` and relies on `../../tools/...` resolving from `~/.agents/skills/<name>`. Through the `~/.claude/skills/<name>` symlink, a model that builds the path from the symlink location gets `~/.claude/tools`, which does not exist. Whether it works depends on how each client reports the skill's base directory. **Unverified.** Test in each client.
- `install.sh` does not install `agents/`. The eight agent files never reach a client.
- Pocock's README warns that installing both a plugin and copied files loads every skill twice. A plugin option will need the same warning and a collision check in `install.sh`.

## 6. Gaps against Pocock

### 6.1 Invocation split (largest structural difference)

Pocock separates skills the user types (set `disable-model-invocation: true`, no description in context) from primitives that the agent or other skills reach. Atlas has 0 of 29 skills with this flag. On this machine, 29 skills in `~/.agents/skills` carry the flag. They are Pocock's orchestrators and older personal skills, not Atlas skills.

Proposed split to decide:

| Keep model-invoked (agent must reach them) | Make user-invoked (user types them in a known order) |
|---|---|
| `audit`, `refine`, `redline`, `interrogate`, `decisions`, `styleguide`, `wiki` | `setup`, `brief`, `workshop`, `competitors`, `persona`, `interview`, `journey`, `metrics`, `problems`, `brainstorming`, `scaffold`, `storybook`, `package`, `showcase`, `guide`, `requirements`, `moodboard`, `restyle`, `figma`, `skill-manager` |

`help` stays model-invoked and becomes the router, like `ask-matt`. `map` is a judgment call. Expected result: description load drops by roughly two thirds. Cost: the agent will not start these on its own, and `coordinator-agent` must read them by path (it already does).

Codex needs the same split in `agents/openai.yaml`. Gemini has no equivalent, so shorter descriptions are the only lever there.

### 6.2 Description writing (from `writing-great-skills`)

- Front-load the leading word. Use one trigger per branch. Cut identity that the body repeats.
- Atlas descriptions list every mode, every output file, and "supersedes X". That is body content. Example: `competitors` spends 1,647 characters on four modes.
- Target: 300 to 600 characters per description, mode details in the body.

### 6.3 Authoring failure modes missing from `AGENTS.md` §4

`writing-great-skills` names failure modes that Atlas does not guard against by name:

| Failure mode | Atlas exposure |
|---|---|
| **Premature completion** (a step ends early) | Atlas has "Completion Criterion" per step. Few are checkable or exhaustive. Audit one skill to measure. |
| **No-op lines** (the model already does it) | Output Discipline asks for short chat replies and simple code. Test whether it changes behavior. |
| **Negation** (steering by prohibition) | Atlas rules use "never" and "forbidden" often, for example the Golden Rule. Pair each with the positive target. |
| **Sediment and sprawl** | `map` and `audit` carry every mode in one file. |
| **Duplication** | The Output Discipline block is repeated verbatim in 29 files. |

Judgment call: ASD-STE100 (§4 Writing Standard) is a human readability standard. I found no evidence that it improves agent adherence. Keep it for user-facing docs. Do not enforce it as an agent-prompt rule without a test.

### 6.4 Smaller items

| Item | Pocock practice | Atlas action |
|---|---|---|
| Scope guard | `SCOPE.md` and `.out-of-scope/` record rejected ideas. "New skills are not accepted." | Add an out-of-scope log. Atlas grew by merging forks (§6 of `AGENTS.md`), so state a rule for what gets in. |
| Inline doc updates | `grill-with-docs` updates the glossary and ADRs during the interview. | `interrogate` hands off to `decisions` as a second step. Offer a one-step path that writes the ADR inline. |
| Domain glossary | `GLOSSARY.md` per project. Pocock's README says it renamed `CONTEXT.md`. | Atlas's own `CONTEXT.md` is the older name. `setup` writes no glossary for a prototype. OOUX covers nouns but is not a term list. Decide whether to add one. |
| Router skill | `ask-matt`, user-invoked, names every flow | `help` is close. Make it user-invoked or short, and keep the atlas table in a reference file. |
| Versioning | Changesets, `CHANGELOG.md` | Add `CHANGELOG.md`, `metadata.version`, and a version in the install manifest (a version file already exists). |
| Anti-framework position | README argues against process-owning frameworks | Atlas's Discover to Deliver chain and `coordinator-agent` look like a framework. Keep every skill usable alone, and keep the coordinator optional. |

## 7. Gaps against Impeccable

### 7.1 Command coverage map

| Impeccable command | Atlas coverage | Gap |
|---|---|---|
| `init`, `teach` (PRODUCT.md) | `setup`, `brief` | None. Atlas is deeper. |
| `shape` (task discovery) | `brief`, `brainstorming`, `map flow` | None |
| `document` (DESIGN.md from code) | `styleguide`, `map document` | Check that Atlas's `DESIGN.md` loads cleanly in Impeccable (**unverified**). |
| `extract` (tokens and components to system) | `styleguide`, `storybook` | Partial. No "find repeated patterns and extract" pass. |
| `critique` | `audit craft`, `audit heuristic` | None. Atlas is stronger on evidence and severity. |
| `audit` (a11y, performance, responsive) | `audit a11y`, `audit code` | Performance has no mode. The word appears in 3 files, none as an audit. |
| `polish` | `refine` | `refine` is thin (57 lines, 6 heuristics). |
| `bolder`, `quieter`, `distill` | `restyle` (new direction only) | No in-place intensity control. |
| `harden` (errors, i18n, edge cases) | None | Localization and RTL appear in 4 files, none as a check. |
| `onboard` (first run, empty states) | `map flow` mentions empty states | No design pass for first-run. |
| `animate` | `refine` heuristic 3 | No motion rules. "Reduced motion" appears in **0** skill files. |
| `colorize`, `typeset`, `layout` | `styleguide`, `refine` | No focused reference for type scale, measure, or spacing rhythm. |
| `clarify` (UX copy) | None | No UX-writing mode. |
| `adapt` (devices, native) | `audit craft` responsive row | Web only. No iOS or Android reference. |
| `optimize` (performance) | None | Gap. |
| `delight`, `overdrive` | `audit craft` delight dimension | Mostly absent. |
| `live` (browser variants) | `redline pick`, `restyle` | Comparable. |
| `pin`, `hooks`, `doctor` | `skill-manager` partly | See 7.3 and 7.4. |

### 7.2 Deterministic checks

Impeccable ships a 59-rule detector. It runs in CI (exit codes 0, 1, 2), on a URL, in a browser extension, and as an edit-time hook that returns findings to the agent. Rules cite measurable values (contrast 4.5:1, measure 65 to 75ch, tracking limit, shadow offsets).

Atlas has the Golden Rule, which is machine-checkable, but only a grep script enforces it. Missing:

- A hook (Claude Code `PostToolUse`, Codex hooks) that runs `check-hardcoded-colors` after UI file edits. The script also needs `dark:` override detection, which the Golden Rule names but the script does not check.
- A token contrast check: compute WCAG ratios for every Layer 2 pair in light and dark from `index.css`. `audit a11y` reasons about this today. A script gives the same answer every run.
- JSON output and exit codes for CI.
- A way to suppress a finding with a reason.

### 7.3 Craft quality of existing guidance

Concrete issues in `skills/refine/SKILL.md` (**repo-verified**), judged against Impeccable's `craft-floor` and Anthropic's "concise, specific" rule:

| Line of guidance | Problem |
|---|---|
| `transition-all duration-150` on buttons and tabs | `transition-all` animates layout properties and costs frames. Name the properties. |
| "Subtle red glow on danger buttons" | Impeccable's floor says zero-offset colored glows do not count as depth. |
| "Subtle backdrop blurs ... on floating headers" and a heading named "Subtle Glassmorphism" | Impeccable bans decorative glass and blur. Blur has cost on low-end devices. Limit it to a stated purpose. |
| No mention of `prefers-reduced-motion` | The `audit a11y` mode also never names it. WCAG 2.3.3 and common practice expect it. |
| Dark surface values given as literal hex | Fine as examples, but it conflicts with the "never hardcode hex" rule a few files away. Point to the semantic role. |
| Heuristics are advice, not thresholds | Impeccable gives measurable limits. Add: body measure, contrast, tap target size, radius range, one elevation method per element. |

### 7.4 Project-context mechanics

- **Context loader.** Impeccable runs `impeccable context` once per session and loads product, design, surface brief, and platform notes. Atlas skills each re-read `AGENTS.md`, resolve the docs folder (`find-docs-folder`), and re-detect the phase (`detect-project-phase`). A shared loader that prints one digest would cut repeated reads. It also would give a single place to fix docs-folder lookup bugs.
- **Drift report (`doctor`).** Atlas has several living docs and an install manifest, but nothing reports drift: `DESIGN.md` against `index.css`, docs-folder name against `AGENTS.md`, installed skills against the repo. `help` or `skill-manager` could add a `doctor` mode.
- **Per-harness builds.** Impeccable generates a folder per harness (`dist/`), with `openai.yaml` and `.toml` agents. Atlas copies one tree. A build script would also solve P3 and P6.
- **Bounded verification.** Impeccable states "inspect once, fix in one batch, confirm once, stop." Atlas's `refine` and `audit` have no pass limit. Add one to control cost.

### 7.5 Agents

Atlas's `agents/*.md` are thin wrappers that say "find the skill's `SKILL.md` and follow it." Claude Code can do this directly:

- A subagent definition can list `skills:` and get the full skill text injected at start.
- A skill can set `context: fork` and `agent:` to run as a subagent.

Both are more reliable than a path lookup. Agent files also use Claude-only frontmatter (`tools:`). Codex agents use `.toml` (Impeccable ships those). Nothing installs `agents/` today (5.3).

## 8. Prioritized backlog

Effort: S = under half a day, M = 1 to 2 days, L = more than 2 days. Owner is the file or skill that changes.

### P0: Fix before sharing the suite outside this machine

| # | Change | Effort | Owner |
|---|---|---|---|
| 1 | Shorten the 5 descriptions over 1,024 characters to 300 to 600 characters. Move mode lists into the body. | S | `competitors`, `map`, `setup`, `journey`, `showcase` |
| 2 | Resolve `argument-hint`: strip it in a build step, or move the hint into the description. Amend `AGENTS.md` §4, which requires it. | S | `AGENTS.md`, 13 skills, new build script |
| 3 | Write `scripts/validate.sh` from the §6 checklist in `AGENTS.md`, plus: description ≤ 1,024, allowed frontmatter keys, body ≤ 500 lines, link check, name equals folder. Run `skills-ref validate`. Add a CI workflow. | M | `scripts/`, `.github/` |
| 4 | Test how `../../tools/...` resolves in Claude Code, Codex, and Gemini through a symlinked install. Record the result. | S | `install.sh`, notes |
| 5 | Add `LICENSE`, `CHANGELOG.md`, `metadata.version`. | S | repo root |

### P1: Best-in-class structure

| # | Change | Effort | Owner |
|---|---|---|---|
| 6 | Make the suite self-contained per target. Option A: Claude plugin plus marketplace file, Codex plugin; `tools/` ships inside the plugin. Option B: vendor needed scripts into each skill's `scripts/` and reference them with `${CLAUDE_SKILL_DIR}`. Option A is less work and gives namespaced names (fixes P9/P10). Option B is the only route for single-skill uploads. | L | repo root, `install.sh` |
| 7 | Add the invocation split (6.1). Add `agents/openai.yaml` per skill. | M | 29 skills |
| 8 | Split `map`, `audit`, `interview`, `journey`, `competitors`, `figma` into a router `SKILL.md` plus `references/<mode>.md`. Load one mode per run. | L | six skills |
| 9 | Turn the Golden Rule into a detector with hook: extend `check-hardcoded-colors` to catch `dark:` overrides, add JSON output and exit codes, add a token contrast script, add a hook installer. | M | `tools/`, `styleguide`, `audit` |
| 10 | Rewrite `refine` with a measurable craft floor. Remove or qualify the items in 7.3. Add reduced-motion to `refine` and `audit a11y`. | M | `refine`, `audit` |
| 11 | Add missing craft modes as references, not new skills (the merge rule in §6 of `AGENTS.md` applies): UX copy, harden (errors, i18n, RTL, edge cases), performance, first-run and empty states, motion. Native mobile only if the suite leaves web-only scope. | L | `refine`, `audit`, `styleguide` |
| 12 | Make `install.sh` install `agents/`, drop the likely-redundant `~/.codex/skills` link after testing, and warn when a plugin copy is also present. | M | `install.sh` |

### P2: Polish and durability

| # | Change | Effort | Owner |
|---|---|---|---|
| 13 | Write 3 evals per skill (query, files, expected behavior). Run on Haiku, Sonnet, Opus. Add trigger tests for descriptions. | L | new `evals/` |
| 14 | Replace agent wrappers with `skills:` preload or `context: fork`. Add `.toml` agents for Codex. | M | `agents/` |
| 15 | Add a shared context loader and a `doctor` mode (7.4). | M | `tools/`, `help` |
| 16 | Add authoring-failure-mode guidance and an out-of-scope log (6.3, 6.4). Decide the scope of ASD-STE100. | S | `AGENTS.md` |
| 17 | Remove the duplicated Output Discipline block from skill bodies. Write it once into the project `AGENTS.md` that `setup` creates. This changes §2.8, so it needs a decision. | S | `AGENTS.md`, `setup`, 29 skills |
| 18 | Add a one-step "interrogate and record" path. Decide on a prototype glossary. | S | `interrogate`, `decisions`, `setup` |
| 19 | Decide on Tailwind v3 versus v4. `scaffold` and `AGENTS.md` pin v3. Tailwind v4 moved to CSS-first configuration, which interacts with the two-layer token files. **Unverified** for the exact current status in Oct 2026. | S (decide), L (migrate) | `scaffold`, `styleguide` |
| 20 | Add a table of contents to reference files over 100 lines. | S | `competitors/references/benchmark/rubric.md` |

## 9. Questions only the owner can answer

1. Is the suite for personal use, a team, or public release? Items 5, 6, and 13 only matter for the last two.
2. Will you accept user-invoked phase skills? The agent will no longer start them from a natural-language request.
3. Plugin (Option A) or vendored scripts (Option B) for item 6?
4. Does the suite stay web-only (React, Tailwind)? That decides native mobile and the Tailwind version.
5. May `AGENTS.md` change? Items 2, 16, and 17 each reverse a current rule (`argument-hint` required, ASD-STE100, verbatim Output Discipline).

## 10. Sources

- Agent Skills specification: https://agentskills.io/specification
- Anthropic skill authoring best practices: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Claude Code skills: https://code.claude.com/docs/en/skills
- Claude Code plugins overview: https://code.claude.com/docs/en/plugins
- OpenAI Codex skills (redirects to https://learn.chatgpt.com/docs/build-skills)
- Gemini CLI skills: https://geminicli.com/docs/cli/skills/
- Matt Pocock skills: https://github.com/mattpocock/skills (README, `SCOPE.md`); local copies in `~/.agents/skills/` (`ask-matt`, `writing-great-skills`)
- Impeccable: https://github.com/pbakaus/impeccable (README); local copy in `~/.agents/skills/impeccable`; `craft-floor.md` from the upstream `main` branch
- Repo measurements: description lengths, body line counts, frontmatter keys, and tool-path counts from a script run on 2026-10-08 against the working tree

## 11. Follow-up: checks and changes

### 11.1 The items marked unverified, now checked

| Item | Result | How it was checked |
|---|---|---|
| Does `../../tools/...` resolve through a symlinked install? | Yes in a shell: the kernel resolves `..` from the symlink target, so `~/.claude/skills/decisions/../../tools` reaches `~/.agents/tools`. `~/.claude/tools` does not exist, so a client that normalizes the path as text would fail. The plugin layout has real directories, so it has no such risk. | Ran `ls` on the symlinked path in this Claude Code install. Claude Code reports the skill base directory as the symlink path. |
| Does Codex read `~/.codex/skills`? | No. Codex docs list `$HOME/.agents/skills`. Cursor does read `~/.codex/skills`, so the old `install.sh` link made skills appear in Cursor more than once. | Codex docs; Cursor docs. |
| Cursor | Reads `~/.agents/skills` and `~/.cursor/skills`, and also `~/.claude/skills`, `~/.codex/skills`. | Cursor docs (cursor.com/docs/skills). |
| Copilot | Reads `~/.copilot/skills` and `~/.agents/skills` (CLI and cloud agent). | GitHub Docs. |
| Does `help` shadow `/help`? | Not confirmed. The docs say a user-level skill replaces a built-in command with the same name. The plugin namespaces the skill (`/ux-atlas:help`), so the risk exists only for plain-skills installs. | Claude Code docs. No safe way to test in a live session. |
| Is Tailwind v3 still right? | No. Tailwind 4.3 is current. The 3.4 line is supported until 2027-02-28. | Web search; then built the new token template with Tailwind 4.3.3 and confirmed every semantic utility generates. |
| Does the plugin load? | Manifests, skills and agents pass `claude plugin validate --strict`. A headless session could not start (login expired), so a live skill listing was not run. | `claude plugin validate`. |

### 11.2 Backlog status

| # | Item | Status | Where |
|---|---|---|---|
| 1 | Shorten descriptions over 1,024 chars | Done. All 29 are 600 or fewer. | each `SKILL.md` |
| 2 | Resolve `argument-hint` | Done. Kept for Claude Code; `build-portable` strips it. `AGENTS.md` §4 amended. | `scripts/build-portable.mjs` |
| 3 | Validation script and CI | Done. | `scripts/validate.mjs`, `.github/workflows/validate.yml`, `npm test` |
| 4 | Test `../../tools` resolution | Done (see 11.1). | this section |
| 5 | License, changelog, version | Done. MIT, copyright Aaron Kiersky (@akiersky). | `LICENSE`, `CHANGELOG.md`, `package.json` |
| 6 | Self-contained packaging | Done both ways: plugin and portable per-skill bundles. | `.claude-plugin/`, `hooks/`, `scripts/build-portable.mjs` |
| 7 | Invocation split, `openai.yaml` | Done. 21 user-invoked, 8 model-invoked, `help` is the front door. | frontmatter, `skills/*/agents/openai.yaml`, `scripts/sync-skill-metadata.mjs` |
| 8 | Split big multi-mode skills | Done for 9 skills. Total `SKILL.md` lines fell from 4,446 to 2,271; the largest is `setup` at 176. | `scripts/split-modes.mjs`, `skills/*/references/` |
| 9 | Deterministic Golden Rule check and hook | Done, with tests. | `tools/design-check`, `tools/check-token-contrast`, `tools/design-hook`, `hooks/hooks.json` |
| 10 | Rewrite `refine` with a measurable floor | Done, including reduced motion. | `skills/refine/` |
| 11 | Missing craft areas | Done as references: motion, UX copy, hardening and i18n, first run, performance, mobile. New `audit` `perf` mode. | `skills/refine/references/`, `skills/audit/references/perf.md` |
| 12 | `install.sh` fixes | Done. Hub-direct clients are no-ops, old links retired, `agents/` installed, plugin collision warning. Tested against a throwaway `HOME`. | `install.sh` |
| 13 | Evals | Done as case files with a grading-sheet runner. No automatic grader. | `evals/` |
| 14 | Agent wrappers | Partly done. Lookup is plugin-aware. `skills:` preload is not possible because the skills the agents run are user-invoked, and Claude Code blocks preloading those. | `agents/*.md` |
| 15 | Context loader and `doctor` | Done. | `tools/doctor`, `help` `doctor` mode |
| 16 | Failure-mode guidance, scope log, STE scope | Done. | `AGENTS.md` §4, `SCOPE.md`, `.out-of-scope/` |
| 17 | Output Discipline duplication | Done in a reduced form: one bullet per skill, checked verbatim by the validator; the long form moves to the project `AGENTS.md`. | `AGENTS.md` §2.8, `setup` |
| 18 | One-step decision path and glossary | Done. | `interrogate`, `decisions`, `setup` |
| 19 | Tailwind v3 to v4 | Done in the docs, template and scaffold steps. Not yet run end to end through `npm create vite` with the full scaffold. | `skills/scaffold`, `skills/styleguide` |
| 20 | Contents lists on long references | Done (10 files). | `scripts/add-toc.mjs` |

Additional changes that came out of the work:
- The old default palette failed WCAG AA on `text-muted`, `border-input` and accent text. The new template passes all 40 pairs.
- The shipped `map` and `scaffold` templates used raw hex and palette classes. They now use semantic tokens.
- `audit` `a11y` called WCAG 2.5.5 an AA criterion. AA target size is 2.5.8.
- Mobile app support: `scaffold` `mobile-app` layer, `refine` `mobile.md`, `audit` `a11y` mobile step.

### 11.3 Assumptions to confirm

- **License holder.** Resolved: Aaron Kiersky (@akiersky) holds the copyright and grants MIT. `LICENSE`, `plugin.json`, `package.json` and the README License section say so.
- **Clone URL.** Resolved: the README now clones `kiersky-coforge/ux-atlas`, the same repo the plugin command uses.
- **Plugin size.** The plugin copies the whole repo (about 2 MB without `.git`). The saving is in context, not disk. Descriptions drop from 20,527 characters to 6,885 for all 29 skills (measured). In Claude Code only the 8 model-invocable skills load a description: 2,102 characters. Codex and Gemini list every skill, and 6,885 is now under the Codex 8,000-character list budget.
