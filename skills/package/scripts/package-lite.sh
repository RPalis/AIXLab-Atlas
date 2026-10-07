#!/bin/bash
set -euo pipefail

# /package lite
# Produces <app-name>-production/ at the repo root: the real minified production build, laid out as
# index.html at the root (plus the few files that only work there) with everything else under
# assets/. When the repo has a backend/, its GET responses are captured into
# assets/backend-snapshot.json and assets/static-backend.js answers the app's API calls from
# that snapshot — writes persist to localStorage — so the folder runs on any static host with
# no backend process. No zip by default (a plain folder is what "lite" implies).
#
# Overrides (env): FRONTEND=<dir> BACKEND=<dir> BACKEND_URL=<url> HOOKS=<file> OUT=<dir>

REPO="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TOOLS="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && cd ../../../tools && pwd)"  # repo: tools/, installed: ~/.agents/tools
LITE="$TOOLS/package-lite"
source "$LITE/snapshot-step.sh"
APP="$(basename "$REPO")"
cd "$REPO"

FRONTEND="${FRONTEND:-}"
if [ -z "$FRONTEND" ]; then
  for d in frontend angular react web client app; do [ -f "$d/package.json" ] && FRONTEND="$d" && break; done
fi
[ -z "$FRONTEND" ] && [ -f package.json ] && FRONTEND="."
[ -z "$FRONTEND" ] && { echo "No frontend found (looked for frontend/, angular/, ... with a package.json). Set FRONTEND=<dir>."; exit 1; }
BACKEND="${BACKEND:-}"; [ -z "$BACKEND" ] && [ -d backend ] && BACKEND=backend
OUT="${OUT:-$REPO/$APP-production}"
STAGE="$REPO/.pkg-lite"
STARTED_PORT=""

echo "=================================================="
echo "Packaging (lite): $APP   frontend=$FRONTEND${BACKEND:+  backend=$BACKEND}"
echo "=================================================="
rm -rf "$STAGE"; mkdir -p "$STAGE"

cleanup() {
  if [ -n "$STARTED_PORT" ]; then
    lsof -ti "tcp:$STARTED_PORT" -sTCP:LISTEN 2>/dev/null | xargs kill 2>/dev/null || true
    echo "Stopped the backend this script started (port $STARTED_PORT)."
  fi
  rm -rf "$STAGE"
}
trap cleanup EXIT

# --- Step 1: snapshot the backend (needs it running; started here if it isn't) ---
if [ -n "$BACKEND" ]; then snapshot_backend; fi

# --- Step 2: build production (minified, hashed, no maps) ---
if [ -f "$FRONTEND/angular.json" ]; then
  ( cd "$FRONTEND" && npx ng build --configuration production --base-href ./ )
else
  # Relative base so the folder works from any path on the host; fall back if the build script
  # doesn't pass args through to vite.
  npm run build --prefix "$FRONTEND" -- --base ./ 2>/dev/null || npm run build --prefix "$FRONTEND"
fi
BUILD_ROOT=$(find "$REPO/$FRONTEND" -maxdepth 1 -type d \( -name dist -o -name build \) -not -path '*/node_modules/*' 2>/dev/null | head -1)
[ -z "$BUILD_ROOT" ] && { echo 'Could not locate the build output directory.'; exit 1; }
# The app's own index.html sits at the build root (Vite/CRA/webpack). Angular nests it
# (dist/<project>/browser/index.html): take the SHALLOWEST match, never one inside an
# embedded sub-app (storybook, docs) that ships its own index.html deeper down.
if [ -f "$BUILD_ROOT/index.html" ]; then
  BUILD_OUTPUT="$BUILD_ROOT"
else
  BUILD_OUTPUT=$(find "$BUILD_ROOT" -maxdepth 3 -type f -name index.html -not -path '*/node_modules/*' 2>/dev/null \
      | awk '{ print gsub(/\//, "/"), $0 }' | sort -n | head -1 | cut -d' ' -f2- | xargs -r dirname)
fi
[ -z "$BUILD_OUTPUT" ] && { echo 'Could not locate the build output.'; exit 1; }

# --- Step 3: assemble <app-name>-production/ ---
rm -rf "$OUT"
cp -R "$BUILD_OUTPUT" "$OUT"
find "$OUT" -name '.DS_Store' -delete
find "$OUT" -iname '*.map' -delete
mkdir -p "$OUT/assets"

INJECT=""
if [ -n "$BACKEND" ]; then
  cp "$LITE/static-backend.js" "$OUT/assets/static-backend.js"
  cp "$STAGE/backend-snapshot.json" "$OUT/assets/backend-snapshot.json"
  INJECT="static-backend.js"
  HOOKS="${HOOKS:-}"
  if [ -z "$HOOKS" ]; then
    for f in "$BACKEND/static-hooks.ts" "$BACKEND/static-hooks.js"; do [ -f "$f" ] && HOOKS="$f" && break; done
  fi
  if [ -n "$HOOKS" ]; then
    echo "Bundling hooks from $HOOKS ..."
    HOOKS_ABS="$(cd "$(dirname "$HOOKS")" && pwd)/$(basename "$HOOKS")"  # absolute: the esbuild call runs from $FRONTEND
    ( cd "$FRONTEND" && npx --no-install esbuild "$HOOKS_ABS" --bundle --format=iife \
        --global-name=__staticBackendHooks --platform=browser --target=es2020 --minify --log-level=warning \
        --outfile="$OUT/assets/static-backend-hooks.js" ) \
      || { echo "esbuild failed for $HOOKS (it ships with Vite/Angular under $FRONTEND/node_modules)."; exit 1; }
    INJECT="$INJECT,static-backend-hooks.js"
  fi
fi

echo ""
node "$LITE/normalize-layout.mjs" --dir "$OUT" ${INJECT:+--inject "$INJECT"}

# Embedded sub-apps (storybook, wiki, graphify...) now live under assets/. Whether each is worth
# shipping depends on whether the app itself links to it; report so that call can be made.
for sub in $(find "$OUT/assets" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; 2>/dev/null); do
  hit=$(grep -rl "$sub" "$REPO/$FRONTEND/src" 2>/dev/null | head -1)
  if [ -n "$hit" ]; then echo "assets/$sub/: linked from the app ($(echo "$hit" | sed "s|$REPO/||")) — ships"
  else echo "assets/$sub/: nothing in $FRONTEND/src references it — dev-only? confirm before removing"; fi
done

# --- Step 4: verify ---
echo "=================================================="
echo "source maps remaining (expect 0): $(find "$OUT" -iname '*.map' | wc -l | tr -d ' ')"
echo "root entries: $(ls -A "$OUT" | tr '\n' ' ')"
echo "size: $(du -sh "$OUT" | cut -f1)   files: $(find "$OUT" -type f | wc -l | tr -d ' ')"
if [ -n "$BACKEND" ]; then
  grep -q 'static-backend.js' "$OUT/index.html" && echo "static backend: injected (snapshot $(du -h "$OUT/assets/backend-snapshot.json" | cut -f1 | tr -d ' ')${HOOKS:+, hooks bundled})" \
    || { echo "!! static-backend.js not referenced from index.html"; exit 1; }
  echo "  runs without $BACKEND/ — changes persist in the browser's localStorage; open with ?reset to discard them"
fi
echo "Packaged: $OUT"
echo "(no zip by default — offer to zip only if the user wants a single artifact to send)"
echo "=================================================="
