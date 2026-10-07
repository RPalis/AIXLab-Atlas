#!/bin/bash
set -euo pipefail

# /package figma
# Produces <app-name>-figma/ at the repo root: a handful of flat, unminified files for Figma Make
# (index.html, app.js + a few chunks, app.css, package.json, MAKE_PROMPT.txt), each under the size
# limit. Libraries stay as imports by name (package.json lists them). When the repo has a backend/,
# its GET responses are captured to backend-snapshot.json and static-backend.js serves them.
#
# Overrides (env): FRONTEND=<dir> BACKEND=<dir> BACKEND_URL=<url> HOOKS=<file> OUT=<dir>
#                  LIMIT=<bytes, default 900000>   BUNDLE_DEPS=1 (inline libraries instead)

REPO="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TOOLS="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && cd ../../../tools && pwd)"  # repo: tools/, installed: ~/.agents/tools
LITE="$TOOLS/package-lite"
FIG="$TOOLS/package-figma"
source "$LITE/snapshot-step.sh"
APP="$(basename "$REPO")"
cd "$REPO"

FRONTEND="${FRONTEND:-}"
if [ -z "$FRONTEND" ]; then
  for d in frontend react web client app; do [ -f "$d/package.json" ] && FRONTEND="$d" && break; done
fi
[ -z "$FRONTEND" ] && [ -f package.json ] && FRONTEND="."
[ -z "$FRONTEND" ] && { echo "No frontend found (looked for frontend/, react/, ... with a package.json). Set FRONTEND=<dir>."; exit 1; }
[ -f "$FRONTEND/angular.json" ] && { echo "Angular isn't supported by /package figma (Figma Make runs React). Use /package lite instead."; exit 1; }
BACKEND="${BACKEND:-}"; [ -z "$BACKEND" ] && [ -d backend ] && BACKEND=backend
OUT="${OUT:-$REPO/$APP-figma}"
LIMIT="${LIMIT:-900000}"
STAGE="$REPO/.pkg-figma"
BUILD="$STAGE/out"
STARTED_PORT=""

echo "=================================================="
echo "Packaging (figma): $APP   frontend=$FRONTEND${BACKEND:+  backend=$BACKEND}"
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

# --- Step 1: snapshot the backend ---
if [ -n "$BACKEND" ]; then snapshot_backend; fi

# --- Step 2: flat, unminified build ---
node "$FIG/build-flat.mjs" --frontend "$FRONTEND" --out "$BUILD" --limit "$LIMIT" ${BUNDLE_DEPS:+--bundle-deps}

# --- Step 3: static backend + hooks (flat, unminified) ---
INJECT=""
if [ -n "$BACKEND" ]; then
  cp "$LITE/static-backend.js" "$BUILD/static-backend.js"
  cp "$STAGE/backend-snapshot.json" "$BUILD/backend-snapshot.json"
  INJECT="static-backend.js"
  HOOKS="${HOOKS:-}"
  if [ -z "$HOOKS" ]; then
    for f in "$BACKEND/static-hooks.ts" "$BACKEND/static-hooks.js"; do [ -f "$f" ] && HOOKS="$f" && break; done
  fi
  if [ -n "$HOOKS" ]; then
    echo "Bundling hooks from $HOOKS ..."
    HOOKS_ABS="$(cd "$(dirname "$HOOKS")" && pwd)/$(basename "$HOOKS")"  # absolute: the esbuild call runs from $FRONTEND
    ( cd "$FRONTEND" && npx --no-install esbuild "$HOOKS_ABS" --bundle --format=iife \
        --global-name=__staticBackendHooks --platform=browser --target=es2020 --log-level=warning \
        --outfile="$BUILD/static-backend-hooks.js" ) \
      || { echo "esbuild failed for $HOOKS (it ships with Vite under $FRONTEND/node_modules)."; exit 1; }
    INJECT="$INJECT,static-backend-hooks.js"
  fi
fi

# --- Step 4: flatten, package.json, prompt, size check ---
echo ""
STATUS=0
node "$FIG/finalize.mjs" --dir "$BUILD" --frontend "$FRONTEND" --app "$APP" --limit "$LIMIT" \
  ${BUNDLE_DEPS:+--bundle-deps} ${INJECT:+--inject "$INJECT"} || STATUS=$?

rm -rf "$OUT"; cp -R "$BUILD" "$OUT"
echo "=================================================="
echo "Packaged: $OUT"
[ "$STATUS" -ne 0 ] && echo "!! finalize reported problems (above) — the folder was written but won't upload cleanly until they're fixed."
echo "Attach every file except MAKE_PROMPT.txt to a Figma Make chat; paste MAKE_PROMPT.txt as the message."
echo "=================================================="
exit "$STATUS"
