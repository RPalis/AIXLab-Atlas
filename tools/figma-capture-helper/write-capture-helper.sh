#!/bin/bash
# write-capture-helper.sh <dest-file>
#
# Writes the static enableFigmaCapture() helper (Figma's html-to-design
# capture.js loader) to <dest-file>, e.g.:
#   write-capture-helper.sh src/lib/figma-capture.ts
#
# Purely mechanical — the file's contents never change per project. What
# varies (button vs. context menu, where it's wired in) is a placement
# decision the calling skill makes; this script only produces the module to
# import from wherever that wiring goes.
#
# Refuses to overwrite an existing file that doesn't already look like this
# helper (starts with the same declare-global block) so a hand-modified copy
# isn't silently clobbered.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="$HERE/capture-helper.template.ts"

if [ "$#" -ne 1 ]; then
  echo "usage: write-capture-helper.sh <dest-file>" >&2
  exit 2
fi
DEST="$1"

if [ -f "$DEST" ] && ! grep -q "FIGMA_CAPTURE_SCRIPT_ID" "$DEST"; then
  echo "write-capture-helper.sh: $DEST already exists and doesn't look like a capture helper — not overwriting." >&2
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
cp "$TEMPLATE" "$DEST"
echo "Wrote $DEST"
