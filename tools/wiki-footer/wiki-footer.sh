#!/bin/bash
# wiki-footer.sh <file> "<Text>|<relative/path.md>" ["<Text>|<path>" ...]
#
# Writes (or rewrites) the wiki's "incorporated into" footer at the end of a
# hand-written file, between <!-- wiki:begin --> and <!-- wiki:end --> markers.
# Text above the footer is never touched. A second run replaces the footer, so
# links do not pile up. The footer date is the "processed" marker that
# wiki-status compares against the file's modification time.
#
# Used by `wiki` (compile, note) on my-notes/ and artifacts/ files only. Never
# run it on a file in sources/: sources stay immutable.
#
# Exit 0 on success, 2 on bad usage.

set -euo pipefail

FILE="${1:-}"
[ -n "$FILE" ] && shift || true
if [ -z "$FILE" ] || [ "$#" -eq 0 ] || [ ! -f "$FILE" ]; then
  echo "usage: wiki-footer.sh <file> \"<Text>|<relative/path.md>\" [...]" >&2
  exit 2
fi

LINKS=""
for item in "$@"; do
  text="${item%%|*}"; path="${item#*|}"
  [ -n "$LINKS" ] && LINKS="$LINKS · "
  LINKS="$LINKS[$text]($path)"
done

DATE="$(date +%Y-%m-%d)"
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

# Drop any existing footer, then trim trailing blank lines.
awk '
  /<!-- wiki:begin -->/ {skip=1; next}
  /<!-- wiki:end -->/   {skip=0; next}
  !skip {print}
' "$FILE" | awk '{lines[NR]=$0} END {n=NR; while (n>0 && lines[n]=="") n--; for (i=1;i<=n;i++) print lines[i]}' > "$TMP"

{
  cat "$TMP"
  echo ""
  echo "<!-- wiki:begin -->"
  echo "---"
  echo "*Incorporated into the wiki on $DATE:* $LINKS"
  echo "<!-- wiki:end -->"
} > "$FILE"

echo "footer written: $FILE"
