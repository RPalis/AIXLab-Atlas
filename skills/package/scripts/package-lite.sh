#!/bin/bash
set -e

# /handoff lite
# Produces production/ at the repo root: the real minified production build —
# everything a user of the running app can actually reach, minus dev-only cruft
# nothing in the app links to. No zip by default (a plain folder is what "lite" implies).

REPO="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
FRONTEND=$(find . -maxdepth 2 \( -name angular.json -o -name package.json \) -path '*/frontend/*' -o -path '*/angular/*' 2>/dev/null | head -1 | xargs -r dirname)
OUT_DIR="$REPO/production"

echo "=================================================="
echo "Packaging (lite): $(basename "$REPO")"
echo "=================================================="

# --- Step 1: build production (minified, hashed, no maps — Vite's default `build` already is) ---
if [ -f "$FRONTEND/angular.json" ]; then
  ( cd "$FRONTEND" && npx ng build --configuration production --base-href ./ )
else
  npm run build --prefix "$FRONTEND"
fi
BUILD_OUTPUT=$(find "$REPO/$FRONTEND" -maxdepth 4 -type f -name index.html \
    \( -path '*/dist/*' -o -path '*/build/*' \) -not -path '*/node_modules/*' 2>/dev/null | head -1 | xargs -r dirname)
[ -z "$BUILD_OUTPUT" ] && { echo 'Could not locate the build output.'; exit 1; }

# --- Step 2: copy and strip to bare essentials ---
rm -rf "$OUT_DIR"
cp -R "$BUILD_OUTPUT" "$OUT_DIR"
find "$OUT_DIR" -name '.DS_Store' -delete

echo ""
echo "Reachability check — verify before deleting anything below:"
echo "  Is it linked from the app's own UI (Prototype Tools menu, a nav item)?"
echo "  Linked -> keep it (part of what ships). Not linked -> real cruft, safe to remove."
echo ""
for sub in storybook wiki constellation docs-viewer; do
  if [ -d "$OUT_DIR/$sub" ]; then
    hit=$(grep -rl "$sub" "$REPO/$FRONTEND/src" 2>/dev/null | head -1)
    if [ -n "$hit" ]; then
      echo "  KEEP:   $sub/  (referenced in $hit)"
    else
      echo "  REVIEW: $sub/  (no reference found in src — confirm before removing)"
    fi
  fi
done

find "$OUT_DIR" -iname '*.map' -delete

echo "=================================================="
find "$OUT_DIR" -iname '*.map' | wc -l | xargs echo 'source maps remaining (expect 0):'
du -sh "$OUT_DIR"
ls "$OUT_DIR" | wc -l | xargs echo 'top-level file count:'
head -c 200 "$OUT_DIR/index.html"
echo ""
echo "Packaged: $OUT_DIR"
echo "(no zip by default — offer to zip only if the user wants a single artifact to send)"
[ -d "$REPO/backend" ] && echo "NOTE: backend/ present but not included in production/ — it must be run separately."
echo "=================================================="
