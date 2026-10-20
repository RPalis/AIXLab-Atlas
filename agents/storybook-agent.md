---
name: storybook-agent
description: >-
  Runs the UX Atlas `storybook` skill unattended: scaffolds Storybook in the prototype,
  wires it to the app's real design tokens, generates Foundation and Component stories
  for every component across the 5-tier hierarchy, builds a static export, and embeds
  it in the running prototype. The skill has no ask-points at all, so this agent runs
  it straight through. Use when a prototype's components have settled enough to
  document (after `styleguide` and the base scaffold, alongside or after `refine`), or
  when explicitly asked for an autonomous/background Storybook build.
tools: Read, Write, Edit, Bash, Glob
---

**Where the skill lives.** Look in this order: `skills/storybook/SKILL.md` (inside the suite repo), `~/.agents/skills/storybook/SKILL.md` (hub install), then the plugin cache: `find ~/.claude/plugins -path '*/skills/storybook/SKILL.md' | head -1`. Paths inside that file are relative to it.

You are running unattended — no human is watching this session, though this
particular skill has nothing that would have paused for one anyway.

## Step 1: Find the skill

Read `skills/storybook/SKILL.md` (in the suite repo) or
`~/.agents/skills/storybook/SKILL.md` (installed hub copy) in full before doing
anything else.

## Step 2: Run it exactly as written

Follow all four steps: scaffold Storybook (`npx storybook@latest init --type
react --builder vite`), wire `.storybook/preview.ts` to import the app's real
`src/index.css` so it shares the live two-layer token engine and dark-mode
toggle rather than a separate copy, generate stories for every component
currently in `src/components/{atoms,molecules,organisms,widgets}` plus
Foundations stories for the token system itself, then build the static export
and wire the in-app iframe modal.

**Coverage, not judgment, is the thing to get right here.** Walk the actual
component tree rather than a fixed list — every real component gets a story,
including ones added since the last run. A component with no clear tier yet
(ambiguous atomic classification) still gets a story; place it by your best read
of the 5-tier table and note the placement in your final report rather than
skipping the component over an ambiguous tier.

## Step 3: Verify before reporting done

Confirm `npm run build-storybook -o public/storybook` actually succeeds and the
output directory has real content (not a stale/partial build from a failed
run), and that the iframe modal in `AppShell.tsx`/`UserMenu.tsx` actually opens
it — don't report success on the build command exiting 0 alone.

## Step 4: Log and report

Log the milestone: `tools/log-milestone --skill storybook --event "Storybook
built and embedded: N components documented across 5 tiers"`.

End with a short structured summary: component/story counts per tier, any
component placed in an ambiguous tier and why, and confirmation the static
build and in-app embed both actually work.
