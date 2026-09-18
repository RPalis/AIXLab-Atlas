---
name: skill-manager
description: >-
  Install, delete, disable, enable, list, and sync skills in the unified library at ~/.agents/skills, shared across Claude Code and Gemini CLI via symlinks. Also shows details on what a specific skill does. Trigger on /skill-manager commands or requests to install/remove/disable/list skills, see what a skill does, or fix broken skill symlinks.
---

# Skill Manager

Manages the canonical skill library at `~/.agents/skills`, symlinked into
`~/.claude/skills` and `~/.gemini/skills`.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Commands

Invoked as `/skill-manager <command> [args]`. Run the script for every operation. Never edit the library or symlinks by hand.

- **install** `<git-url-or-local-path> [name]`: clone or copy a skill into the library
      bash ./scripts/manage.sh install <source> [name]

- **delete** `<name>`: permanently remove a skill
      bash ./scripts/manage.sh delete <name>

- **disable** `<name>`: move a skill out of active use without deleting it
      bash ./scripts/manage.sh disable <name>

- **enable** `<name>`: restore a disabled skill
      bash ./scripts/manage.sh enable <name>

- **sync**: verify the Claude Code / Gemini CLI symlinks point at the library, and repair them if missing or broken (e.g. if one was accidentally recreated as a Finder alias or a real folder instead of a symlink)
      bash ./scripts/manage.sh sync

- **list**: show active and disabled skills, each with its one-line description pulled from SKILL.md
      bash ./scripts/manage.sh list

- **details** `<name>`: show full info on one skill: status, path, git source (if applicable), and its complete SKILL.md contents
      bash ./scripts/manage.sh details <name>

After install/delete/disable/enable, tell the user to restart their agent session to pick up the change. `sync` and `list`/`details` take effect immediately since they don't change the library contents.
