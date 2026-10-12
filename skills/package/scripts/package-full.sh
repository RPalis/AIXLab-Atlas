#!/bin/bash
set -e

# /handoff full
# Produces <app-name>.zip at the repo root with three folders:
#   site/           unminified static build + source maps — drop on any static host
#   development/    raw source, no node_modules — for a developer to read/rebuild
#   documentation/  the project docs (text only)
# Mirrors this suite's `scaffold` frontend/ convention.

REPO="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
APP="$(basename "$REPO")"
STAGE="$REPO/.pkg-stage"
OUT="$REPO/${APP}.zip"
ROOT="$STAGE/$APP"
FRONTEND="${FRONTEND:-}"
if [ -z "$FRONTEND" ]; then
  for d in frontend angular react web client app; do [ -f "$REPO/$d/package.json" ] && FRONTEND="$d" && break; done
fi
[ -z "$FRONTEND" ] && { echo "No frontend found (looked for frontend/, angular/, ... with a package.json). Set FRONTEND=<dir>."; exit 1; }
cd "$REPO"

echo "=================================================="
echo "Packaging (full): ${APP}"
echo "=================================================="

# --- Step 1: type-check before building ---
if [ -f "$FRONTEND/tsconfig.json" ]; then
  echo "Type-checking..."
  (cd "$FRONTEND" && npx tsc -b --noEmit)
fi

rm -rf "$STAGE"; mkdir -p "$ROOT/development"

# --- Step 2: build the unminified site (source maps, relative base) ---
if [ -f "$FRONTEND/.storybook/main.ts" ] || [ -f "$FRONTEND/.storybook/main.js" ]; then
  echo "Building static Storybook..."
  npm run build-storybook --prefix "$FRONTEND" -o "$FRONTEND/public/storybook" || true
fi
echo "Building unminified site bundle..."
if [ -f "$FRONTEND/angular.json" ]; then
  ( cd "$FRONTEND" && npx ng build --configuration development --base-href ./ )
else
  npm run build --prefix "$FRONTEND" -- --mode development --base ./ 2>/dev/null \
    || npm run build --prefix "$FRONTEND"
fi
SITE_SRC=$(find "$REPO/$FRONTEND" -maxdepth 4 -type f -name index.html \
    \( -path '*/dist/*' -o -path '*/build/*' \) -not -path '*/node_modules/*' 2>/dev/null | head -1 | xargs -r dirname)
[ -z "$SITE_SRC" ] && { echo 'Could not locate the build output — set SITE_SRC and re-run.'; exit 1; }
cp -R "$SITE_SRC" "$ROOT/site"

# --- one-click local-serve helpers (localhost = secure context, needed for clipboard/figma) ---
cat > "$ROOT/site/serve.command" <<'SERVE_CMD'
#!/bin/bash
cd "$(dirname "$0")" || exit 1
echo "Serving $(pwd) at http://localhost:8080/  (Ctrl+C to stop)"
ruby -run -e httpd . -p 8080 --bind-address=127.0.0.1
SERVE_CMD
chmod +x "$ROOT/site/serve.command"
cat > "$ROOT/site/serve.ps1" <<'SERVE_PS1'
$port = 8080
$root = $PSScriptRoot
Add-Type -AssemblyName System.Net.HttpListener 2>$null
python -m http.server $port 2>$null || (
  Write-Host "Serving $root -> http://localhost:$port/  (Ctrl+C to stop)"
  npx --yes serve -l $port .
)
SERVE_PS1
cat > "$ROOT/site/serve.bat" <<'SERVE_BAT'
@echo off
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0serve.ps1"
SERVE_BAT

# --- Step 3: development/ — raw source, no node_modules/build output ---
for d in frontend angular backend electron; do
  [ -d "$REPO/$d" ] && rsync -a --exclude node_modules --exclude dist --exclude .angular --exclude build \
      --exclude '.DS_Store' --exclude '*.log' "$REPO/$d/" "$ROOT/development/$d/"
done
[ -d "$REPO/shared" ] && rsync -a --exclude node_modules --exclude '.DS_Store' "$REPO/shared/" "$ROOT/development/shared/"
for f in package.json package-lock.json docker-compose.yml README.md; do
  [ -f "$REPO/$f" ] && cp "$REPO/$f" "$ROOT/development/"
done

# --- Step 4: documentation/ — text-only project docs ---
TOOLS="$(cd -P "$(dirname "${BASH_SOURCE[0]}")" && cd ../../../tools && pwd)"  # repo: tools/, installed: ~/.agents/tools
docsname="$("$TOOLS/find-docs-folder/find-docs-folder.sh" "$REPO" 2>/dev/null || true)"
docsrc="$REPO/${docsname:-docs}"; [ -d "$REPO/documentation" ] && docsrc="$REPO/documentation"
# sources/ holds other people's material (often confidential) and my-notes/ is raw capture:
# neither ships in a handoff. The wiki (compiled, cited) does, and so does wiki-site/ if built.
[ -d "$docsrc" ] && rsync -a --exclude '.DS_Store' --exclude '*.docx' --exclude '*.pdf' --exclude '*.pptx' --exclude '*.zip' \
  --exclude '/sources/' --exclude 'my-notes/' "$docsrc/" "$ROOT/documentation/"
[ -d "$REPO/wiki-site" ] && rsync -a --exclude '.DS_Store' "$REPO/wiki-site/" "$ROOT/documentation/wiki-site/"
if [ -f "$docsrc/notes/wiki/sources.md" ] && [ -x "$TOOLS/wiki-status/wiki-status.sh" ]; then
  pending="$("$TOOLS/wiki-status/wiki-status.sh" "$REPO" | grep -E '^(UNREGISTERED|LOOSE|NEW|CHANGED|DRAFTS)' || true)"
  [ -n "$pending" ] && echo "Note: the wiki has unprocessed work (run the wiki skill, then wiki publish, to refresh wiki-site/):" && echo "$pending"
fi
[ -f "$REPO/DESIGN.md" ] && cp "$REPO/DESIGN.md" "$ROOT/documentation/"

# --- top-level handoff README ---
cat > "$ROOT/README.md" <<EOF
# ${APP} — Handoff Package

- **site/** — the built static app (index.html + JS + source maps). Drop it on any static web server; no Node runtime needed.
- **development/** — the full source (no node_modules). Run \`npm install\` then rebuild from here.
- **documentation/** — how the app works (PERSONA_WALKTHROUGH.md, OOUX_OBJECT_MAP.md, DESIGN.md, ADRs, the project wiki, and wiki-site/ when built). Raw client and team material (sources/) and personal notes are not included.

## Run it locally

- **macOS:** double-click **site/serve.command**, or \`cd site && python3 -m http.server 8080\`.
- **Windows:** double-click **site/serve.bat**.
- **Any host:** point a static server (IIS, Apache, nginx) at **site/**.

Then open http://localhost:8080. Serve via **localhost**, not a LAN IP or \`file://\` — clipboard-based features (e.g. \`figma\`) need a secure context.
EOF

find "$STAGE" -name '.DS_Store' -delete
rm -f "$OUT"; ( cd "$STAGE" && zip -r -X -q "$OUT" "$APP" -x '*.DS_Store' )
rm -rf "$STAGE"

echo "=================================================="
unzip -l "$OUT" | grep -iE 'node_modules|__MACOSX|\.DS_Store' && echo '!! cruft leaked' || echo 'clean'
unzip -l "$OUT" | awk '{print $4}' | grep -E "/(site|development|documentation)/?$" | sort -u
echo "Packaged: $OUT"
echo "=================================================="
