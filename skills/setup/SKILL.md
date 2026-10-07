---
name: setup
description: >-
  Bootstrap a prototype repo's docs and layout (README.md, a project-level AGENTS.md that records the docs folder's real name and which skill owns which doc, an empty UNKNOWNS.md, a notes/ home for the wiki and anything else worth jotting down, and a repo/ folder of relative symlinks to the root-level README/AGENTS/CLAUDE/CONTEXT docs so a notes tool opened on the docs folder can read them) before any code or design work starts. Names the docs folder after the project (e.g. pocket-atlas-docs/, not a bare docs/) so it's unambiguous when opened directly as a vault in a third-party tool like Obsidian. Runs first, ahead of scaffold. Works equally on a brand-new repo or an existing product: never overwrites a README or AGENTS.md that's already there, appends what's missing instead. On an existing product it also inventories every doc the wider suite owns (personas, object map, tokens, ADRs, requirements, etc.), notes anything already present under a different name, feeds that inventory to brief for a fuller lay-of-the-land reconnaissance (even mid-lifecycle, unless a current PRODUCT_BRIEF.md already exists), then hands off to help to turn the inventory into concrete backfill moves. Use when starting a prototype project from nothing, or when an existing repo (new or already underway) is missing the doc scaffolding the rest of this suite expects.
---

# Setup

The step before Discover starts. `scaffold` builds the actual application code; this skill only touches the repo's documentation shell (README, a project `AGENTS.md`, `<project-slug>-docs/UNKNOWNS.md`, and `<project-slug>-docs/notes/`) so every skill that runs after it has somewhere consistent to write.

**Docs folder naming:** this suite's docs live in a folder named `<project-slug>-docs/` — a kebab-case slug of the project name — not a bare `docs/`. A generic `docs/` reads as an unlabeled, ambiguous vault when opened directly in a third-party tool like Obsidian; naming it after the project fixes that. See the suite's own `AGENTS.md` §7 for the full convention. Every other skill in this suite writes `docs/...` in its own instructions as shorthand for whatever this skill actually named the folder — they resolve the real name from the project `AGENTS.md` this skill writes (Step 3), not from a literal `docs/` path.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.
- If `setup` itself fired because the user described what they wanted rather than typing `/setup`, say so in one line ("Using the `setup` skill (`/setup`) to bootstrap your docs.") — the same convention Step 3's `AGENTS.md` block asks every downstream skill to follow, so it should hold from the very first skill a user encounters.

## Step 0: Check for a newer skill suite version

Before anything else, check whether the installed UX Atlas skills are behind the suite's GitHub repo, so a user starting a new project isn't unknowingly working from stale skills.

1. Read `~/.agents/skills/.ux-atlas.version` (written by `install.sh` at install time; a hub installed via `skill-manager` or copied by hand won't have one — treat that as "unknown, skip silently," not an error).
2. If it exists and has `repo=` and `sha=` lines (it may carry only `path=` when the suite wasn't installed from a git checkout; treat that as "unknown" too), parse them, then check the remote's current `main` HEAD: `git ls-remote <repo> HEAD`.
3. If the network call fails (offline, no access) or the file is missing, say nothing and move on — this check must never block setup.
4. If the remote SHA differs from the recorded `sha=`, tell the user in one line that a newer version of the skill suite is available and how to get it (re-run `install.sh` from a fresh `git pull` of the suite repo, or `/skill-manager sync` if they manage it that way) — then continue with the rest of setup regardless of their answer. This is a heads-up, not a blocker.

## Step 1: Explore the current state

Before writing anything, check what's already here:
- Does `README.md` or `AGENTS.md`/`CLAUDE.md` already exist? If so, read it in full — it's existing, possibly hand-written content, not a draft to replace, so never overwrite it (see Step 3).
- Does a docs folder already exist? Run [`tools/find-docs-folder`](../../tools/find-docs-folder/find-docs-folder.sh) first — it resolves `docs/` (the older, pre-convention name), `<project-slug>-docs/`, or anything the project's own `AGENTS.md` already names, in that priority order. A non-zero exit means none of those were found (treat as a fresh project, proceed to Step 3). If it resolves one, check whether it already contains any of this suite's living docs (`UNKNOWNS.md`, `PRODUCT_BRIEF.md`, `COMPETITIVE_ANALYSIS.md`, `PERSONA_WALKTHROUGH.md`, `JOURNEY_MAP.md`, `OKR.md`, `OOUX_OBJECT_MAP.md`, `adr/`, `notes/`)? A repo mid-project needs gaps filled in, not a fresh layout imposed over it. **If a plain `docs/` already exists, leave it named exactly that** — don't rename it to `<project-slug>-docs/` on your own initiative; that's an existing structure other tooling or habits may depend on. Only ask the user if they'd like it renamed; otherwise keep filling gaps under the name that's already there. This one's already autonomous-safe (suite `AGENTS.md` §2.9): the default with no one to ask is simply not renaming, so unattended runs behave the same as attended ones here.
- Is there a `package.json` / `src/` already, with real application code (not just a scaffold stub)? If so, this is an **existing product**: `scaffold` already ran, or this suite is being layered onto something that predates it entirely. `setup` still runs to backfill missing docs, but say so rather than treat it as a brand-new project, and carry that into Step 4's hand-off.

**On an existing product, don't stop at the four docs this skill owns.** Run [`tools/detect-project-phase`](../../tools/detect-project-phase/detect-project-phase.sh) — the same phase signals [`help`](../help/SKILL.md)'s Step 1 uses — to ground the Step 4 hand-off in how far the project has actually gotten, not just whether the doc shell is present, then still look beyond just the `PHASE` value: `COMPETITIVE_ANALYSIS.md`, `PERSONA_WALKTHROUGH.md`, `JOURNEY_MAP.md`, `OKR.md`, `OOUX_OBJECT_MAP.md`, `index.css`/`DESIGN.md` (token layer), `adr/`, Storybook output, `audit` findings, `REQUIREMENTS.md`, `USER_GUIDE.md`, and `package`/`showcase` output — wherever the docs folder turns out to be; the tool only checks the subset of these its phase table depends on, not the full inventory this hand-off needs. Also look for content that's clearly the same thing under a different name or location — a hand-rolled `personas.md`, design tokens defined somewhere other than `index.css`, an ADR log under a different folder. Note anything found this way in Step 3's `AGENTS.md` block (a short "already present, under a different name" line) rather than silently duplicating it or ignoring it; don't move or rename the user's files without asking.

## Step 2: Confirm scope with the user

Ask only what isn't already answerable from context:
- **Project name and one-line purpose**: what is this prototype for, in one sentence. If an existing README already states this, confirm it rather than asking cold. Derive the docs-folder slug from this name (lowercase, spaces/punctuation to hyphens — e.g. "Pocket Atlas" → `pocket-atlas-docs/`); confirm the slug alongside the name if it's not obvious, rather than silently picking one.
- **Starting point**: a genuinely new idea, or an existing repo/codebase this suite is being layered onto (already answered by Step 1 if a real `src/` turned up).

**Autonomous mode** (suite `AGENTS.md` §2.9): if nothing in the repo states a name or purpose, this is tier 2, not tier 3 — a placeholder is correctable later, and blocking the whole doc shell on it isn't worth it. Use the repo directory's own name as the placeholder project name, leave the one-line purpose as an open item, and log both to `docs/UNKNOWNS.md` as assumptions needing confirmation rather than pausing setup entirely. The docs-folder slug still derives from that placeholder name; if the real name changes later, the folder can be renamed then.

Don't ask about anything covered in later lifecycle steps. Project name/purpose is all `setup` needs; screens, personas, and tokens come later from the skills that own them.

## Step 3: Write the doc shell

Four things plus a set of symlinks, nothing else. For each: **if it already exists, append what's missing rather than overwriting anything.** A repo `setup` is layered onto may already have a README with real content, or an AGENTS.md from a different tool — that content stays; this skill only fills gaps.

**`README.md`**: if missing, create it with project name, the one-paragraph purpose from Step 2, and a `## Status` line stating this is an early-stage prototype (or, on an existing product, whatever status is actually true). Leave placeholder headings for sections later skills will fill in (install/run instructions once `scaffold` exists, a feature overview once screens exist) rather than inventing content now. If a README already exists, leave its content untouched; only append a `## Status` line if one isn't already present in some form.

**`AGENTS.md`** (project-level, distinct from this suite's own `AGENTS.md`): a short doc for any agent working in *this* prototype repo, recording the docs folder's real name and which doc is owned by which skill so nothing downstream duplicates, conflicts, or falls back to a bare `docs/` by mistake. If missing, create it with the block below, substituting the actual `<project-slug>` from Step 2 (and the actual folder name — plain `docs` — if Step 1 found one already using the older convention). If it already exists (this suite's own, or a different tool's), append this block under its own `## UX Atlas` heading instead of replacing the file, so nothing already written there is lost:

```markdown
# AGENTS.md

This prototype is built with UX Atlas. Docs folder: `<project-slug>-docs/`.

Doc ownership:
- `<project-slug>-docs/UNKNOWNS.md` — appended to by any skill; cleared as questions resolve
- `<project-slug>-docs/PRODUCT_BRIEF.md` — owned by `brief`
- `<project-slug>-docs/COMPETITIVE_ANALYSIS.md` — owned by `competitors`
- `<project-slug>-docs/PERSONA_WALKTHROUGH.md` — owned by `persona`
- `<project-slug>-docs/JOURNEY_MAP.md` — owned by `journey`
- `<project-slug>-docs/OKR.md` — owned by `metrics`
- `<project-slug>-docs/OOUX_OBJECT_MAP.md` — owned by `map`'s `objects` mode
- `DESIGN.md` — owned by `styleguide`, regenerated from `index.css`, never hand-edited out of sync
- `<project-slug>-docs/adr/` — owned by `decisions`
- `<project-slug>-docs/USER_GUIDE.md` — owned by `guide`
- `<project-slug>-docs/REQUIREMENTS.md` — owned by `requirements`
- `<project-slug>-docs/repo/` — relative symlinks to the repo's root-level docs (`README.md`, `AGENTS.md`, `CLAUDE.md`/`CONTEXT.md` when present) so they're readable from inside the docs vault; edit the originals at the root, not here
- `<project-slug>-docs/notes/` — general notes home, safe to open directly in Obsidian or any other markdown editor; use it for **all** project notes. `<project-slug>-docs/notes/my-notes/` inside it is the raw capture zone (fed by `wiki`'s `note` mode quick captures, or typed by hand); `<project-slug>-docs/notes/wiki/` next to it is owned by `wiki`'s default `compile` mode, which compiles `my-notes/` plus any other document dropped into `<project-slug>-docs/` (specs, client feedback, research) into an interlinked knowledge base

## Working Agreements

- **Capture decisions as they happen.** A non-obvious call made while working in this repo doesn't wait for someone to ask "why did we do it this way?" later: write it up with `decisions` if it's a real tradeoff with a rejected alternative, or with `wiki`'s `note` mode if it's smaller than that but still worth keeping.
- **Don't let a thought evaporate at the end of a session.** Anything worth remembering that doesn't have an obvious home yet, an idea, a risk, an observation, goes through `wiki`'s `note` mode immediately. It lands in `<project-slug>-docs/notes/my-notes/` and folds into `<project-slug>-docs/notes/wiki/` on its own; nothing needs a separate pass to not get lost.
- **Use `<project-slug>-docs/notes/` for all project notes.** Meeting notes, scratch thoughts, research, anything a teammate, PM, client, or user hands over, belongs there (or elsewhere under `<project-slug>-docs/` if it's a standalone document someone else maintains) rather than scattered across the repo or left outside version control entirely. `wiki` picks up anything placed there.
- **Defer to `<project-slug>-docs/UNKNOWNS.md` instead of guessing.** If a decision genuinely needs input this session doesn't have, log it there rather than inventing a plausible-sounding answer (see the suite's own AGENTS.md §2.6).
- **Suggest next steps at natural checkpoints.** After finishing a skill's work, or whenever a session looks like it's wrapping up, briefly state what `help` would recommend next, don't wait to be asked "what now?"
- **Name the slash command when a skill auto-invokes from plain language.** Most people working in this repo won't type `/scaffold` or `/audit` themselves — they'll just describe what they want, and the right skill should fire anyway. When that happens, say which skill ran and its slash form in one short line (e.g. "Using the `styleguide` skill (`/styleguide`) to set up your tokens.") so next time they can invoke it directly instead of relying on inference. Skip this for a skill they've already directly invoked or clearly named in the request — the point is teaching the shortcut, not narrating routine skill use.
```

**`<project-slug>-docs/UNKNOWNS.md`**: if missing, create it empty with just a one-line header (`# Unknowns`). This is the one doc safe to pre-create with no content: an append-only running list from day one, not authored output any one skill produces. If it already exists, leave it alone entirely.

**`<project-slug>-docs/notes/`**: if missing, create the folder with a single `notes/README.md` explaining what it's for, so it's never an unexplained empty folder:

```markdown
# Notes

This is the project's general notes home. **Use it for all project notes**: meeting notes, scratch thoughts, research, anything a teammate, PM, client, or user hands over that doesn't belong in a specific doc above. Open this folder directly in Obsidian or any other markdown editor to work outside the IDE; nothing here depends on a specific tool.

- `my-notes/` — raw, unprocessed capture: quick thoughts from `wiki`'s `note` mode, or anything typed here by hand. Drop things here freely; nothing needs to be tidy on the way in.
- `wiki/` — this suite's compiled knowledge wiki (owned by the `wiki` skill): browse `wiki/index.md` once it exists. It compiles `my-notes/`, but also reads and cross-references any other document dropped anywhere in this docs folder (a spec, a client brief, user research) that this suite didn't produce itself, so those don't need to live in this folder specifically to get picked up.
```

Unlike the other living docs below, `notes/`'s two subfolders **are** pre-created — this README already points at them by name, so an empty vault with a dangling reference is worse than the small head start below. Each gets its own explainer, not real content:

**`notes/my-notes/README.md`**:

```markdown
# My Notes

Raw, unprocessed capture — nothing here needs to be tidy on the way in. Two ways in:
- `wiki`'s `note` mode drops a quick thought here mid-task, no ceremony.
- Type directly into a file yourself, in this folder or any markdown editor pointed at it.

**Format**: one file per day, `YYYY-MM-DD.md`, thoughts as timestamped bullets:

\`\`\`markdown
## 2026-01-15
- 14:20 — client mentioned they'd rather see a weekly digest than real-time alerts, worth a persona note
- 16:05 — the settings page nav pattern feels wrong, revisit after audit
\`\`\`

No required structure beyond that. `wiki` reads everything here (by `note` mode immediately, or by `compile` mode's periodic sweep) and folds it into the compiled wiki next to this folder — nothing typed here is a dead end.
```

**`notes/wiki/README.md`**:

```markdown
# About This Wiki

This folder is a compiled, interlinked knowledge base, built and maintained by the `wiki` skill from `../my-notes/` and anything else dropped into the docs folder that this suite didn't produce itself (a spec, a client brief, meeting notes). It isn't hand-written from scratch — `wiki` reads sources, cross-references them, and keeps this folder current.

Once `wiki` has run at least once, this folder holds:
- `index.md` — content-oriented catalog, the front door
- `log.md` — append-only record of what changed and when
- `entities/` — one page per durable "thing" worth its own file (a persona, a recurring decision topic, a domain term)
- `constellation.html` — a standalone interactive graph view, open directly in a browser

**Editing by hand:** every file here is plain markdown, cross-referenced with standard `[text](file.md)` links rather than Obsidian-only `[[wikilink]]` syntax — no Obsidian or specific tool required, safe to open and edit directly. If you correct or add something by hand, note it in `log.md` yourself, or just let the next `wiki` `compile` pass pick up the change (it checks for anything that doesn't match what it last wrote). Deleting/renaming an entity page by hand is safe too; `compile` mode's linting pass (contradictions, staleness, orphans) will flag anything that's now inconsistent rather than silently breaking.
```

**Root-doc symlinks into the docs folder**: the repo's root-level markdown (`README.md`, the project `AGENTS.md`, and `CLAUDE.md` / `CONTEXT.md` when they exist) lives outside the docs folder, so a notes tool opened on `<project-slug>-docs/` as a vault can't see it. Fix that with a `<project-slug>-docs/repo/` folder holding one relative symlink per root doc, so the vault reads them in place without a second copy drifting out of date:

```bash
mkdir -p <project-slug>-docs/repo
cd <project-slug>-docs/repo
for f in README.md AGENTS.md CLAUDE.md CONTEXT.md; do
  [ -f "../../$f" ] && [ ! -e "$f" ] && ln -s "../../$f" "$f"
done
```

Relative targets (`../../README.md`), not absolute, so the links survive a clone or a moved checkout. Only link files that actually exist — never create a dangling link for a doc the repo doesn't have — and skip any name already present (a real file or a link someone made by hand). If `CLAUDE.md` is itself a symlink to `AGENTS.md`, link it anyway; it resolves fine through two hops. Add a one-line `## Repo docs` note to `notes/README.md` (or the docs folder's own README if there is one) saying `repo/` holds links to the root-level docs, not originals — edit the originals at the repo root. On an existing project where the docs folder predates this step, add the `repo/` folder the same way; it's additive.

Do **not** pre-create `COMPETITIVE_ANALYSIS.md`, `PERSONA_WALKTHROUGH.md`, `JOURNEY_MAP.md`, `OKR.md`, `OOUX_OBJECT_MAP.md`, `DESIGN.md`, `adr/`, `REQUIREMENTS.md`, or any of `wiki`'s own real output (`notes/wiki/index.md`, `log.md`, `entities/`, `constellation.html`) or `notes/my-notes/`'s dated capture files. Those belong to `competitors`, `persona`, `journey`, `metrics`, `map`'s `objects` mode, `styleguide`, `decisions`, `requirements`, and `wiki` respectively — a hollow stub standing in for actual content is dead weight, not scaffolding. The two README files above are the exception: they're documentation about the folders, not a stand-in for what the folders will eventually hold, so they're safe to write immediately.

## Step 4: Hand off

Log the bootstrap as the project's first milestone: `../../tools/log-milestone/log-milestone.sh --skill setup --event "Doc shell bootstrapped"` (add `--why "..."` if this was an existing product the suite was layered onto after the fact — that context is exactly the kind of thing worth having later).

**Point at [`brief`](../brief/SKILL.md) next, on a new project or an existing one, unless `PRODUCT_BRIEF.md` already exists in the docs folder and looks current** (in which case skip straight to the `help` hand-off below — that ground is already covered). `brief` is the lay-of-the-land pass for this suite: on a brand-new idea it's a stakeholder interrogation; on an existing product it's a codebase reconnaissance pass, drafted first and confirmed with the stakeholder after (its own Step 0.5). Even a project that's already deep into Design or Deliver benefits from this — it's often the one foundational doc that got skipped if the suite was layered on after the fact, and everything `persona`, `map`, and `requirements` do downstream reads better against a confirmed brief than none at all.

**Hand Step 1's full inventory to `brief` along with the hand-off**, not just "there's a `src/`": tell it explicitly what already exists (`DESIGN.md`, `PERSONA_WALKTHROUGH.md`, an object map, ADRs, whatever Step 1 turned up) so its Step 0.5 reconnaissance drafts from the fullest picture available, not just route/component structure. Say explicitly that this is an existing product and what's already in place.

**After `brief` (or immediately, if it was skipped because a current one already exists), point at [`help`](../help/SKILL.md)** to turn Step 1's inventory into the actual next 1-3 moves — which skill backfills what's still missing (personas, object map, tokens, ADRs, requirements) rather than restarting at Discover. `help` is what makes the "atlas" of the project useful: a picture of where everything stands, not just a doc shell.

**Completion criterion:** `README.md` and the project `AGENTS.md` exist (pre-existing content preserved, only gaps filled) and reflect what was actually confirmed in Step 2 (not invented detail), the project `AGENTS.md` states the docs folder's real name, `<docs-folder>/UNKNOWNS.md` exists, `<docs-folder>/notes/README.md` + `notes/my-notes/README.md` + `notes/wiki/README.md` all exist, `<docs-folder>/repo/` holds a relative symlink for each root-level doc that exists (`README.md`, `AGENTS.md`, and `CLAUDE.md`/`CONTEXT.md` when present) with no dangling links, no doc owned by another skill was pre-stubbed (the three READMEs are documentation, not stand-ins, and don't count as stubbing), and the hand-off names both `brief` (or explains why it was skipped) and `help`, grounded in what Step 1's full inventory actually found.
