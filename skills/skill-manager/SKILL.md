---
name: skill-manager
description: >-
  Installs, removes, disables, enables, lists and syncs skills in the shared ~/.agents/skills
  library. Use for /skill-manager commands or broken skill links.
disable-model-invocation: true
---

# Skill Manager

Manages the canonical skill library at `~/.agents/skills`, symlinked into
`~/.claude/skills` and `~/.gemini/skills`.

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

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
