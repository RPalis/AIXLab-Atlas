#!/bin/bash
# adr-bundle.sh [--title "<title>"] <adr-folder | adr-file...>
#
# Joins ADRs into one Markdown document on stdout, so `showcase` (doc, deck) can
# present decisions, which live one per file. Mechanical: nothing is added,
# reworded or dropped.
#   - A folder is read in name order (0001-..., 0002-...). README.md is skipped.
#   - One H1 for the whole bundle (--title, default "Decisions"). Each ADR's own
#     headings move down one level (its H1 becomes an H2), outside code fences.
#   - ADRs are separated by a blank line.
# Exit 0 on success, 2 on bad usage or no ADR found.

set -euo pipefail

TITLE="Decisions"
if [ "${1:-}" = "--title" ]; then TITLE="${2:-Decisions}"; shift 2; fi
[ "$#" -ge 1 ] || { echo "usage: adr-bundle.sh [--title \"<title>\"] <adr-folder | adr-file...>" >&2; exit 2; }

FILES=()
for arg in "$@"; do
  if [ -d "$arg" ]; then
    while IFS= read -r f; do FILES+=("$f"); done < <(find "$arg" -maxdepth 1 -type f -name '*.md' ! -name 'README.md' | sort)
  elif [ -f "$arg" ]; then FILES+=("$arg")
  else echo "adr-bundle: not found: $arg" >&2; exit 2
  fi
done
[ "${#FILES[@]}" -gt 0 ] || { echo "adr-bundle: no ADR files found" >&2; exit 2; }

echo "# $TITLE"
echo ""
for f in "${FILES[@]}"; do
  awk '/^```/ {fence = !fence} !fence && /^#/ {print "#" $0; next} {print}' "$f"
  echo ""
done
