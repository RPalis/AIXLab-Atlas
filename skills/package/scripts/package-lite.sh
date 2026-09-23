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
LITE="$REPO/tools/package-lite"
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
if [ -n "$BACKEND" ]; then
  detect_backend_url() {
    [ -n "${BACKEND_URL:-}" ] && { echo "$BACKEND_URL"; return; }
    local t
    t=$(cat "$FRONTEND"/vite.config.* 2>/dev/null | grep -oE "target:\s*['\"]https?://[^'\"]+" | head -1 | grep -oE "https?://.*") && [ -n "$t" ] && { echo "$t"; return; }
    t=$(cat "$FRONTEND"/proxy.conf.json 2>/dev/null | grep -oE '"target":\s*"https?://[^"]+' | head -1 | grep -oE "https?://.*") && [ -n "$t" ] && { echo "$t"; return; }
    t=$(grep -rhoE "https?://localhost:[0-9]{4,5}" "$FRONTEND/src" 2>/dev/null | head -1) && [ -n "$t" ] && { echo "$t"; return; }
    local p
    p=$(grep -rhoE "PORT\s*(\|\||\?\?)\s*[0-9]{4,5}" "$BACKEND/src" 2>/dev/null | grep -oE "[0-9]{4,5}" | head -1)
    [ -z "$p" ] && p=$(grep -rhoE "listen\(\s*[0-9]{4,5}" "$BACKEND/src" 2>/dev/null | grep -oE "[0-9]{4,5}" | head -1)
    echo "http://localhost:${p:-3001}"
  }
  BACKEND_URL="$(detect_backend_url)"
  PORT="$(echo "$BACKEND_URL" | grep -oE ':[0-9]+' | tr -d ':' || true)"
  is_up() { [ "$(curl -s -o /dev/null -m 2 -w '%{http_code}' "$BACKEND_URL/" 2>/dev/null)" != "000" ]; }

  if is_up; then
    echo "Backend is up at $BACKEND_URL"
  else
    echo "Backend not reachable at $BACKEND_URL — starting it from $BACKEND/ ..."
    if grep -q '"dev"' "$BACKEND/package.json"; then
      (cd "$BACKEND" && npm run dev > "$STAGE/backend.log" 2>&1 &)
    else
      (cd "$BACKEND" && npm start > "$STAGE/backend.log" 2>&1 &)
    fi
    for _ in $(seq 1 60); do is_up && break; sleep 1; done
    if ! is_up; then
      echo "Backend didn't answer at $BACKEND_URL within 60s. Last log lines:"; tail -20 "$STAGE/backend.log" || true
      echo "Start it yourself and re-run, or set BACKEND_URL=<url> if it listens elsewhere."
      exit 1
    fi
    STARTED_PORT="$PORT"
  fi

  ROUTES_FILE=""; [ -f "$BACKEND/static-routes.txt" ] && ROUTES_FILE="$BACKEND/static-routes.txt"
  node "$LITE/snapshot-backend.mjs" --backend-dir "$BACKEND" --frontend "$FRONTEND" --backend-url "$BACKEND_URL" \
    --app "$APP" --out "$STAGE/backend-snapshot.json" ${ROUTES_FILE:+--routes "$ROUTES_FILE"}
  echo ""
fi

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
    ( cd "$FRONTEND" && npx --no-install esbuild "$(cd "$(dirname "$HOOKS")" && pwd)/$(basename "$HOOKS")" --bundle --format=iife \
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
