#!/bin/bash
# log-unknown.sh --skill <name> --tier <2|3> [--blocking] "<question or assumption>"
# log-unknown.sh --list-blocking [repo-root]
#
# Appends a consistently-formatted line to <docs>/UNKNOWNS.md (resolved via
# tools/find-docs-folder), instead of every skill's autonomous-mode fallback
# (suite AGENTS.md §2.9) hand-writing its own wording. One format means the file
# stays queryable later — by a human skimming it, or an agent grepping for
# "blocking" to find out what actually needs a person before it can continue.
#
# --tier 2: a conservative assumption was made and logged, work continued.
# --tier 3 (--blocking implied if not passed explicitly): a step was skipped
#   entirely pending human input: the assumption tier is inferred from the
#   distinction tier 2 vs 3 already draws in AGENTS.md §2.9, not something this
#   script decides.
#
# Creates <docs>/UNKNOWNS.md with the standard one-line header if it doesn't
# exist yet (same as setup's own Step 3), rather than requiring setup to have
# run first.
#
# --list-blocking prints every tier-3/blocking line currently open, across the
# whole file, for a quick "what's actually stuck" read — by a human, or an
# orchestrating agent checking whether a run needs attention before continuing.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "${1:-}" = "--list-blocking" ]; then
  REPO="${2:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
  DOCS="$("$HERE/../find-docs-folder/find-docs-folder.sh" "$REPO")"
  grep -n 'blocking' "$REPO/$DOCS/UNKNOWNS.md" 2>/dev/null || { echo "no blocking entries"; exit 0; }
  exit 0
fi

SKILL=""; TIER=""; BLOCKING=""; TEXT=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --skill) SKILL="$2"; shift 2 ;;
    --tier) TIER="$2"; shift 2 ;;
    --blocking) BLOCKING="1"; shift ;;
    --repo) REPO_ARG="$2"; shift 2 ;;
    *) TEXT="$1"; shift ;;
  esac
done

if [ -z "$SKILL" ] || [ -z "$TIER" ] || [ -z "$TEXT" ]; then
  echo "usage: log-unknown.sh --skill <name> --tier <2|3> [--blocking] \"<question or assumption>\"" >&2
  echo "       log-unknown.sh --list-blocking [repo-root]" >&2
  exit 2
fi

REPO="${REPO_ARG:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
DOCS="$("$HERE/../find-docs-folder/find-docs-folder.sh" "$REPO")"
FILE="$REPO/$DOCS/UNKNOWNS.md"

if [ ! -f "$FILE" ]; then
  echo "# Unknowns" > "$FILE"
  echo "" >> "$FILE"
fi

[ "$TIER" = "3" ] && BLOCKING="1"
STATUS="assumption"
[ -n "$BLOCKING" ] && STATUS="blocking"

DATE="$(date +%Y-%m-%d)"
echo "- [$DATE] **$SKILL** (tier $TIER, $STATUS): $TEXT" >> "$FILE"
echo "logged to $DOCS/UNKNOWNS.md"
