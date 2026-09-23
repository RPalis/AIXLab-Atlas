#!/bin/bash
# detect-project-phase.sh [repo-root]
#
# Resolves the file-existence signals from help's Step 1 table (see
# skills/help/SKILL.md) into a phase on Before Discover → Discover → Decide →
# Design → Deliver. Prints two lines to stdout and exits 0:
#   PHASE=<phase>
#   SIGNAL=<the file(s) that decided it>
#
# This only covers the signals that are actually files on disk. help's own table
# has two rows this script can't see — "no recent audit output mentioned" and
# "audit's code/a11y modes not yet run" — because audit doesn't persist a doc; both
# collapse into a single `design` phase here. A caller that needs the mid-build vs.
# nearing-done distinction (help, when a human is present to ask; a skill's own
# autonomous-mode default, when there isn't) still has to apply that judgment on
# top of this script's output, same as help's own Step 2 already does for any
# signal this table can't fully resolve.
#
# Not a decision-maker on its own — a skill (help, interview, setup) is expected to
# read PHASE and decide what that means for its own next step.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
cd "$REPO"

find_frontend() {
  for d in frontend angular react web client app; do
    [ -f "$d/package.json" ] && echo "$d" && return
  done
  [ -f package.json ] && echo "." && return
  echo ""
}

DOCS=""
if DOCS=$("$HERE/../find-docs-folder/find-docs-folder.sh" "$REPO" 2>/dev/null); then :; else DOCS=""; fi
FRONTEND="$(find_frontend)"

# 1. Nothing started
if [ -z "$DOCS" ] && [ ! -f README.md ] && [ ! -f AGENTS.md ] && [ -z "$FRONTEND" ]; then
  echo "PHASE=before-discover"
  echo "SIGNAL=no docs folder, no README.md/AGENTS.md, no package.json"
  exit 0
fi

# From here on a docs folder is needed to read the rest of the signals.
if [ -z "$DOCS" ]; then
  echo "PHASE=before-discover"
  echo "SIGNAL=no docs folder found (README/AGENTS.md or package.json exist, but no docs/ yet)"
  exit 0
fi

# 2. Setup done, research not started
if [ -f "$DOCS/UNKNOWNS.md" ] && [ ! -f "$DOCS/PERSONA_WALKTHROUGH.md" ]; then
  echo "PHASE=early-discover"
  echo "SIGNAL=$DOCS/UNKNOWNS.md exists, no $DOCS/PERSONA_WALKTHROUGH.md"
  exit 0
fi

# 3. Users understood, scope not framed
if [ -f "$DOCS/PERSONA_WALKTHROUGH.md" ] && [ ! -f "$DOCS/OOUX_OBJECT_MAP.md" ]; then
  echo "PHASE=discover-to-decide"
  echo "SIGNAL=$DOCS/PERSONA_WALKTHROUGH.md exists, no $DOCS/OOUX_OBJECT_MAP.md"
  exit 0
fi

# 4. Scope framed, nothing built
if [ -f "$DOCS/OOUX_OBJECT_MAP.md" ] && [ -z "$FRONTEND" ]; then
  echo "PHASE=decide-to-design"
  echo "SIGNAL=$DOCS/OOUX_OBJECT_MAP.md exists, no frontend package.json found"
  exit 0
fi

# 5. Building, tokens not established
if [ -n "$FRONTEND" ] && [ ! -f DESIGN.md ] && [ ! -f "$FRONTEND/DESIGN.md" ]; then
  echo "PHASE=early-design"
  echo "SIGNAL=frontend exists ($FRONTEND), no DESIGN.md"
  exit 0
fi

# 8. Shipped once already (checked before the generic design bucket, since a
# shipped project still has DESIGN.md/frontend and would otherwise match rule 6/7)
PACKAGE_OUT=$(find "$REPO" -maxdepth 1 \( -iname '*-production' -o -iname '*.zip' \) 2>/dev/null | head -1)
SHOWCASE_OUT=$(find "$DOCS" -maxdepth 1 \( -iname '*.pptx' -o -iname '*-showcase.pptx' \) 2>/dev/null | head -1)
GUIDE_OUT=""
[ -f "$DOCS/USER_GUIDE.md" ] && GUIDE_OUT="$DOCS/USER_GUIDE.md"
if [ -n "$PACKAGE_OUT" ] || [ -n "$SHOWCASE_OUT" ] || [ -n "$GUIDE_OUT" ]; then
  echo "PHASE=deliver"
  echo "SIGNAL=${PACKAGE_OUT:-${SHOWCASE_OUT:-$GUIDE_OUT}}"
  exit 0
fi

# 6/7. Mid-build through the Design→Deliver boundary — collapsed, see header comment.
echo "PHASE=design"
echo "SIGNAL=DESIGN.md and frontend exist, no package/showcase/guide output yet (mid-build vs. nearing-done needs judgment this script can't see — check for recent audit findings)"
exit 0
