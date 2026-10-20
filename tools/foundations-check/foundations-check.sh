#!/bin/bash
# foundations-check.sh [--check] [repo-root]
#
# Reports which foundations exist before prototyping starts. The prototype is a
# milestone where the team checks that everything lines up; collecting the
# information and settling architecture and workflow patterns come first.
# Mechanical: it only looks for files. A missing foundation is a prompt for the
# caller (a skill, or a person) to decide, not a block.
#
# One line per foundation:
#   HAVE <area> <file>
#   MISSING <area> <skill that makes it>
# then:  QUICKSTART ...   (only when PRODUCT_BRIEF.md says "Status: minimum")
#        SUMMARY have=<n> missing=<n>
#
# Areas: brief, users, problem, domain, content, architecture, workflow.
#   workflow = JOURNEY_MAP.md, or any docs file with "flow" in its name (a `map`
#   flow output has no fixed filename, so the check looks by name).
# Exit 0 always, unless --check is set: then exit 1 when anything is missing.
# Used by `scaffold`, `scaffold-agent`, `coordinator-agent`, `help` and `doctor`.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECK=""
[ "${1:-}" = "--check" ] && { CHECK=1; shift; }
REPO="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
cd "$REPO"

DOCS="$("$HERE/../find-docs-folder/find-docs-folder.sh" "$REPO" 2>/dev/null)" || DOCS=""
have=0; missing=0

check() { # area file skill
  if [ -n "$DOCS" ] && [ -f "$DOCS/$2" ]; then echo "HAVE $1 $DOCS/$2"; have=$((have+1))
  else echo "MISSING $1 $3"; missing=$((missing+1)); fi
}

check brief        PRODUCT_BRIEF.md           "brief"
check users        PERSONA_WALKTHROUGH.md     "persona"
check problem      PROBLEM_STATEMENTS.md      "problems"
check domain       OOUX_OBJECT_MAP.md         "map (objects mode)"
check content      INFORMATION_ARCHITECTURE.md "map (ia mode)"
check architecture ARCHITECTURE_MAP.md        "map (site mode)"

flow=""
if [ -n "$DOCS" ]; then
  if [ -f "$DOCS/JOURNEY_MAP.md" ]; then flow="$DOCS/JOURNEY_MAP.md"
  else flow="$(find "$DOCS" -maxdepth 2 -type f -iname '*flow*.md' ! -path '*/notes/*' ! -path '*/sources/*' 2>/dev/null | sort | head -1)"; fi
fi
if [ -n "$flow" ]; then echo "HAVE workflow $flow"; have=$((have+1))
else echo "MISSING workflow journey, or map (flow mode)"; missing=$((missing+1)); fi

if [ -n "$DOCS" ] && [ -f "$DOCS/PRODUCT_BRIEF.md" ] && grep -qi '^status: *minimum' "$DOCS/PRODUCT_BRIEF.md"; then echo "QUICKSTART brief is minimum: backfill the rest after testing"; fi
echo "SUMMARY have=$have missing=$missing"
[ -n "$CHECK" ] && [ "$missing" -gt 0 ] && exit 1
exit 0
