#!/bin/bash
# log-milestone.sh --skill <name> --event "<one-line fact>" [--why "<the narrative>"] [--repo <path>]
# log-milestone.sh --list [--why-only] [repo-root]
#
# Appends a checkpoint entry to the project's wiki log — docs/notes/wiki/log.md
# (see skills/wiki/SKILL.md's Structure). That file already exists as an
# append-only chronological record; this tool widens who writes to it from just
# `wiki`'s own ingest events to any skill's meaningful checkpoint, in one
# consistent format, so it works as three things at once: a resumable handoff
# point for an agent picking the project back up, a narrative record of how the
# project actually got here, and raw material [`showcase`](../../skills/showcase/SKILL.md)
# can mine for a case study once the project's done.
#
# This is for MEANINGFUL checkpoints, not every skill run — a phase transition, a
# brief/persona/decision landing, a shipped package. A routine audit pass or a
# minor edit doesn't belong here; that noise is exactly what would make the log
# useless as a narrative later. When in doubt, ask: would this line matter to
# someone reading the whole log end to end after the project ships?
#
# --event is the one-line fact, always present, terse ("PRODUCT_BRIEF.md confirmed
# with stakeholder"). --why is optional narrative color — a decision, a tension
# resolved, a surprise — worth the extra line specifically because it's what a
# case study would actually want later; skip it for a routine milestone with
# nothing more to say than the fact itself.
#
# --list prints every milestone entry (not wiki's own `ingest` lines) in order —
# the fast path to "what actually happened on this project and why," for a human
# or for `showcase` drafting a narrative. --why-only further filters to entries
# that have a `why:` line, the ones with real story content.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ "${1:-}" = "--list" ]; then
  shift
  WHY_ONLY=""
  [ "${1:-}" = "--why-only" ] && { WHY_ONLY=1; shift; }
  REPO="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
  DOCS="$("$HERE/../find-docs-folder/find-docs-folder.sh" "$REPO")"
  LOG="$REPO/$DOCS/notes/wiki/log.md"
  [ -f "$LOG" ] || { echo "no log.md yet"; exit 0; }
  if [ -n "$WHY_ONLY" ]; then
    awk '/^## .* milestone: /{hdr=$0; getwhy=1; next} getwhy && /^> /{print hdr; print; print ""; getwhy=0} /^## /{getwhy=0}' "$LOG"
  else
    grep '^## .* milestone: ' "$LOG" || echo "no milestone entries yet"
  fi
  exit 0
fi

SKILL=""; EVENT=""; WHY=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --skill) SKILL="$2"; shift 2 ;;
    --event) EVENT="$2"; shift 2 ;;
    --why) WHY="$2"; shift 2 ;;
    --repo) REPO_ARG="$2"; shift 2 ;;
    *) shift ;;
  esac
done

if [ -z "$SKILL" ] || [ -z "$EVENT" ]; then
  echo "usage: log-milestone.sh --skill <name> --event \"<one-line fact>\" [--why \"<narrative>\"]" >&2
  echo "       log-milestone.sh --list [--why-only] [repo-root]" >&2
  exit 2
fi

REPO="${REPO_ARG:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
DOCS="$("$HERE/../find-docs-folder/find-docs-folder.sh" "$REPO")"
WIKI_DIR="$REPO/$DOCS/notes/wiki"
LOG="$WIKI_DIR/log.md"
mkdir -p "$WIKI_DIR"
[ -f "$LOG" ] || echo "# Log" > "$LOG"

DATE="$(date +%Y-%m-%d)"
{
  echo ""
  echo "## [$DATE] milestone: $SKILL — $EVENT"
  [ -n "$WHY" ] && echo "> $WHY"
} >> "$LOG"

echo "logged to $DOCS/notes/wiki/log.md"
