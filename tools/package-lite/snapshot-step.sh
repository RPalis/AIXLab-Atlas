#!/bin/bash
# Shared by package-lite.sh and package-figma.sh. Source it, then call `snapshot_backend`.
#
# Needs these set by the caller: REPO FRONTEND BACKEND APP STAGE LITE (path to this folder).
# Writes $STAGE/backend-snapshot.json. Starts the backend if it isn't up and records the port in
# STARTED_PORT, which the caller's cleanup trap stops again. Optional env: BACKEND_URL.

snapshot_backend() {
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
}
