#!/bin/bash
# check-hardcoded-colors.sh <path> [path...]
#
# Greps the given path(s) for raw color values that should be this suite's
# semantic tokens instead (text-primary, bg-surface, bg-status-success/15, ...).
# Flags two things, both mechanical, neither requiring judgment:
#   - Arbitrary hex values: text-[#fff], bg-[#1e1e1e], border-[#333], or a bare
#     #RGB/#RRGGBB outside a comment
#   - Raw Tailwind palette classes: text-slate-500, bg-emerald-600, border-zinc-300
#
# Exits 1 and lists every match (file:line:text) if anything is found, exits 0
# silently if the path is clean. Deciding whether a specific match is a
# legitimate exception, and picking the right semantic token to replace it
# with, is the caller's job (audit's `code` mode, figma's `import` mode) — this
# script only finds candidates.

set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage: check-hardcoded-colors.sh <path> [path...]" >&2
  exit 2
fi

HEX_PATTERN='text-\[#|bg-\[#|border-\[#|#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?\b'
PALETTE_PATTERN='\b(text|bg|border|ring|fill|stroke|from|via|to)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}\b'

EXCLUDES=(--exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=.git)

found=0

hex_hits=$(grep -rnE "${EXCLUDES[@]}" "$HEX_PATTERN" "$@" 2>/dev/null || true)
if [ -n "$hex_hits" ]; then
  echo "-- raw hex values --"
  echo "$hex_hits"
  found=1
fi

palette_hits=$(grep -rnE "${EXCLUDES[@]}" "$PALETTE_PATTERN" "$@" 2>/dev/null || true)
if [ -n "$palette_hits" ]; then
  echo "-- raw Tailwind palette classes --"
  echo "$palette_hits"
  found=1
fi

exit "$found"
