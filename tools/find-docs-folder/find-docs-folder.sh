#!/bin/bash
# find-docs-folder.sh [repo-root]
#
# Resolves this suite's docs folder for a project repo. Prints the folder's
# relative path (no trailing slash) to stdout and exits 0 on success.
# Exits 1 with nothing on stdout if no docs folder can be resolved — the
# caller (a skill) decides what to do about that (ask the user, treat it as
# a brand-new project, etc.); this script never asks or guesses beyond the
# lookup order below.
#
# Lookup order:
#   1. Project-level AGENTS.md's "Docs folder: `<name>`" line (the
#      authoritative source once `setup` has run).
#   2. A single `*-docs/` directory at the repo root (the naming convention,
#      found even if AGENTS.md is missing or hasn't been updated).
#   3. A plain `docs/` directory at the repo root (the older, pre-convention
#      name `setup` leaves alone if it finds one already in place).
#
# If more than one `*-docs/` directory exists at the root, that's ambiguous —
# exits 1 rather than guessing.

set -euo pipefail

REPO="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
cd "$REPO"

# 1. Project AGENTS.md
if [ -f AGENTS.md ]; then
  slug=$(grep -oE 'Docs folder: `[^`]+`' AGENTS.md | head -1 | grep -oE '`[^`]+`' | tr -d '`')
  if [ -n "$slug" ]; then
    folder="${slug%/}"
    if [ -d "$folder" ]; then
      echo "$folder"
      exit 0
    fi
    echo "find-docs-folder: AGENTS.md names '$folder' but it doesn't exist at the repo root." >&2
    exit 1
  fi
fi

# 2. A single *-docs/ directory
matches=()
for d in *-docs; do
  [ -d "$d" ] && matches+=("$d")
done
if [ "${#matches[@]}" -eq 1 ]; then
  echo "${matches[0]}"
  exit 0
elif [ "${#matches[@]}" -gt 1 ]; then
  echo "find-docs-folder: multiple *-docs/ directories found (${matches[*]}) and no AGENTS.md to disambiguate." >&2
  exit 1
fi

# 3. Plain docs/
if [ -d docs ]; then
  echo "docs"
  exit 0
fi

echo "find-docs-folder: no docs folder found under $REPO." >&2
exit 1
