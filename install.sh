#!/bin/bash
set -e

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/skills" && pwd)"
SOURCE_TOOLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/tools"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HUB="$HOME/.agents/skills"
MANIFEST="$HUB/.ux-atlas.manifest"
TOOLS_HUB="$HOME/.agents/tools"
TOOLS_MANIFEST="$TOOLS_HUB/.ux-atlas.manifest"

# Clients that read ~/.agents/skills directly (checked against each product's skills docs):
# Gemini CLI, OpenAI Codex, GitHub Copilot and Cursor. Linking them again only makes every skill
# appear twice, so selecting one is a no-op and old links this script made are retired. Claude Code
# does not read the hub, so it still needs a link. Antigravity and Grok are linked until their docs say otherwise.
HUB_DIRECT="gemini-cli codex copilot cursor"
is_hub_direct() { case " $HUB_DIRECT " in *" $1 "*) return 0 ;; *) return 1 ;; esac; }

# Known client skill directories. Each entry is "label|path|name".
# The hub (~/.agents/skills) is the one real copy: skills are copied there from
# this repo. Every client below gets a single symlink to ~/.agents/skills/<name>,
# the same layout other skill packs on this machine use (a real directory in the
# hub, one-hop symlinks everywhere else). Gemini CLI is listed so nobody goes
# looking for it, but it's a no-op: Gemini reads ~/.agents/skills directly, so
# the hub copy alone reaches it, and a second link in ~/.gemini/skills only makes
# it print a "Skill conflict detected" line per skill. Its path is still recorded
# so the picker can detect it and the cleanup below can retire old links.
CLIENTS_LABEL=(claude gemini-cli antigravity codex copilot cursor grok)
CLIENTS_PATH=(
  "$HOME/.claude/skills"
  "$HOME/.gemini/skills"
  "$HOME/.gemini/config/skills"
  "$HOME/.codex/skills"
  "$HOME/.copilot/skills"
  "$HOME/.cursor/skills"
  "$HOME/.grok/skills"
)
CLIENTS_NAME=(
  "Claude Code"
  "Gemini CLI"
  "Antigravity (Gemini config)"
  "OpenAI Codex CLI"
  "GitHub Copilot CLI"
  "Cursor"
  "Grok CLI"
)

bold() { printf "\033[1m%s\033[0m" "$1"; }
dim()  { printf "\033[2m%s\033[0m" "$1"; }

# Hide the blinking terminal cursor while redrawing the menu in place (it's
# what makes each keypress look like it "jumps") and always restore it,
# even on Ctrl+C or an early exit.
hide_cursor() { printf "\033[?25l"; }
show_cursor() { printf "\033[?25h"; }
trap show_cursor EXIT INT TERM

# ---------- banner ----------
# Big chunky-block "UX ATLAS" wordmark, a stylized globe glyph the same height
# as the letters, and a faux drop shadow: print a dim, offset copy first, then
# overlay the bright gradient text on top of it (the trick terminal banners
# like Claude Code / Gemini CLI use). Falls back to a plain bold line when
# stdout isn't a real terminal.
print_banner() {
  # A wireframe globe, not a shaded sphere or a block glyph: an outer limb
  # (the "(" / ")" curve, like a desktop classroom globe's frame), one front
  # meridian running pole to pole, one full equator, two shorter tropic
  # arcs, and a handful of "." shading dots on the lower-right (the
  # shadowed side) — no continents, just lat/long lines and a touch of depth.
  local -a G=(
    "     ( | )     "
    "  ( '  |  ' )  "
    " (  ---+---  ) "
    "(------+------)"
    "(      | .... )"
    " (  ---+---  ) "
    "  ( '  |  ' )  "
    "     ( | )     "
  )
  # Letters are 8 cells wide (was 7) for a bolder, less compressed wordmark.
  local -a U=("██    ██" "██    ██" "██    ██" "██    ██" "██    ██" "██    ██" " ██  ██ " "  ████  ")
  local -a X=("██    ██" " ██  ██ " "  ████  " "   ██   " "   ██   " "  ████  " " ██  ██ " "██    ██")
  local -a A=("  ████  " " ██  ██ " "██    ██" "██    ██" "████████" "██    ██" "██    ██" "██    ██")
  local -a T=("████████" "   ██   " "   ██   " "   ██   " "   ██   " "   ██   " "   ██   " "   ██   ")
  local -a L=("██      " "██      " "██      " "██      " "██      " "██      " "██      " "████████")
  local -a S=(" ██████ " "██      " "██      " " █████  " "     ██ " "     ██ " "██   ██ " " █████  ")

  # Extra room between the two words ("UX" / "ATLAS"), not just between letters.
  local -a lines=()
  local r
  for r in 0 1 2 3 4 5 6 7; do
    lines+=("${G[$r]}   ${U[$r]} ${X[$r]}      ${A[$r]} ${T[$r]} ${L[$r]} ${A[$r]} ${S[$r]}")
  done

  if [ ! -t 1 ]; then
    echo "UX ATLAS"
    return
  fi

  local n=${#lines[@]}
  local i

  # gradient: blue -> cyan -> green (top to bottom), 256-color
  local -a colors=(27 33 39 45 51 50 49 46)

  # drop-shadow pass: dim charcoal copy of the whole wordmark (letters + globe),
  # offset 3 cols right + 2 rows down, printed first so the bright gradient
  # pass below sits on top of it and only the bottom-right sliver peeks out.
  printf "\n\n"
  for i in "${!lines[@]}"; do
    printf "   \033[2;38;5;238m%s\033[0m\n" "${lines[$i]}"
  done

  # move cursor back up over the shadow (including the two leading blank lines)
  printf "\033[%dA" "$((n + 2))"

  # main pass: bold gradient, original position
  for i in "${!lines[@]}"; do
    printf "\033[1;38;5;%sm%s\033[0m\n" "${colors[$i]}" "${lines[$i]}"
  done

  printf "\n    \033[2;38;5;171mSkill installer\033[0m\n\n"
}

# ---------- discover current skill set from this repo ----------
current_skills=()
for skill_path in "$SOURCE_DIR"/*; do
  [ -d "$skill_path" ] && current_skills+=("$(basename "$skill_path")")
done

if [ ${#current_skills[@]} -eq 0 ]; then
  echo "No skills found under $SOURCE_DIR. Nothing to install."
  exit 1
fi

# ---------- discover current tool set from this repo ----------
# Skills reference these by relative path (../../tools/<name>/...), which only
# resolves once installed if tools/ sits next to skills/ in the hub the same way
# it sits next to skills/ in this repo: ~/.agents/tools/ alongside
# ~/.agents/skills/<name>/. No per-client symlinking needed — every client's
# skill symlink already resolves through the hub, so a relative path out of it
# lands in ~/.agents/tools/ regardless of which client followed it there.
current_tools=()
if [ -d "$SOURCE_TOOLS_DIR" ]; then
  for tool_path in "$SOURCE_TOOLS_DIR"/*; do
    [ -d "$tool_path" ] && current_tools+=("$(basename "$tool_path")")
  done
fi

# ---------- flags ----------
selected=()
non_interactive=false
force_open=false
no_open=false
for arg in "$@"; do
  case "$arg" in
    --all) non_interactive=true; selected=("${CLIENTS_LABEL[@]}") ;;
    --none) non_interactive=true ;;
    --claude) non_interactive=true; selected+=("claude") ;;
    --gemini-cli) non_interactive=true; selected+=("gemini-cli") ;;
    --antigravity) non_interactive=true; selected+=("antigravity") ;;
    --codex) non_interactive=true; selected+=("codex") ;;
    --copilot) non_interactive=true; selected+=("copilot") ;;
    --cursor) non_interactive=true; selected+=("cursor") ;;
    --grok) non_interactive=true; selected+=("grok") ;;
    --open) force_open=true ;;
    --no-open) no_open=true ;;
    -h|--help)
      echo "Usage: ./install.sh [--all|--none|--claude|--gemini-cli|--antigravity|--codex|--copilot|--cursor|--grok]... [--open|--no-open]"
      echo "Run with no flags for an interactive arrow-key menu."
      exit 0
      ;;
  esac
done

# ---------- interactive arrow-key checklist ----------
# Reads one logical keypress, resolving multi-byte arrow-key escape sequences
# (ESC [ A/B/C/D) a byte at a time so it isn't fooled by bytes that arrive a
# moment apart over a slower pty. A bare Escape press (nothing follows within
# the timeout) is returned as plain ESC.
read_key() {
  local key ch
  IFS= read -rsn1 key
  if [[ $key == $'\x1b' ]]; then
    if IFS= read -rsn1 -t 1 ch; then
      key+="$ch"
      if [[ $ch == "[" || $ch == "O" ]]; then
        if IFS= read -rsn1 -t 1 ch; then
          key+="$ch"
        fi
      fi
    fi
  fi
  printf '%s' "$key"
}

if [ "$non_interactive" = false ]; then
  # pre-check whichever client dirs already exist on this machine
  checked=()
  for path in "${CLIENTS_PATH[@]}"; do
    if [ -d "$(dirname "$path")" ]; then checked+=(1); else checked+=(0); fi
  done

  cursor=0
  n=${#CLIENTS_LABEL[@]}
  cancelled=false

  # Redraws only the checklist rows (not the banner/header above them), so
  # moving the selection just overwrites those lines in place instead of
  # blanking and repainting the whole screen every keypress.
  print_menu() {
    local i mark note
    for i in "${!CLIENTS_LABEL[@]}"; do
      mark="[ ]"
      [ "${checked[$i]}" = "1" ] && mark="[x]"
      note=""
      if is_hub_direct "${CLIENTS_LABEL[$i]}"; then
        note=" $(dim "(reads the hub directly, nothing to link)")"
      elif [ ! -d "$(dirname "${CLIENTS_PATH[$i]}")" ]; then
        note=" $(dim "(not detected on this machine, will be created)")"
      fi
      if [ "$i" = "$cursor" ]; then
        printf "  \033[1;38;5;69m> %s %s\033[0m%s\033[K\n" "$mark" "${CLIENTS_NAME[$i]}" "$note"
      else
        printf "    %s %s%s\033[K\n" "$mark" "${CLIENTS_NAME[$i]}" "$note"
      fi
    done
    printf "\033[K\n"
  }

  [ -t 1 ] && clear 2>/dev/null || true
  print_banner
  echo "$(dim "Source: $SOURCE_DIR")"
  echo "$(dim "${#current_skills[@]} skills will be copied to ~/.agents/skills (always), then symlinked into whichever clients you pick below. ${#current_tools[@]} shared tools will be copied to ~/.agents/tools (always, no client symlinks needed).")"
  echo ""
  echo "↑/↓ move   space toggle   a toggle all   enter confirm   q cancel"
  echo ""
  hide_cursor
  print_menu

  while true; do
    key=$(read_key)
    case "$key" in
      $'\x1b[A'|k) cursor=$(( (cursor - 1 + n) % n )) ;;
      $'\x1b[B'|j) cursor=$(( (cursor + 1) % n )) ;;
      " ") [ "${checked[$cursor]}" = "1" ] && checked[$cursor]=0 || checked[$cursor]=1 ;;
      a|A)
        all_on=1
        for c in "${checked[@]}"; do [ "$c" = "1" ] || all_on=0; done
        for i in "${!checked[@]}"; do checked[$i]=$(( 1 - all_on )); done
        ;;
      q|Q|$'\x1b') cancelled=true; break ;;
      "") break ;;
    esac
    printf "\033[%dA" "$((n + 1))"
    print_menu
  done
  show_cursor

  if [ "$cancelled" = true ]; then
    echo "Cancelled. Nothing was installed."
    exit 0
  fi

  for i in "${!CLIENTS_LABEL[@]}"; do
    [ "${checked[$i]}" = "1" ] && selected+=("${CLIENTS_LABEL[$i]}")
  done
fi

[ -t 1 ] && clear 2>/dev/null || true
print_banner
echo "=================================================="
echo "Installing UX Atlas"
echo "Source:   $SOURCE_DIR"
echo "Hub:      $HUB (copied)"
if [ ${#selected[@]} -eq 0 ]; then
  echo "Clients:  none selected (hub only)"
else
  echo "Clients:  ${selected[*]}"
fi
echo "=================================================="

mkdir -p "$HUB"
mkdir -p "$TOOLS_HUB"

# ---------- clean up stale tools from a previous install ----------
if [ -f "$TOOLS_MANIFEST" ]; then
  while IFS= read -r old_tool; do
    [ -z "$old_tool" ] && continue
    still_current=false
    for t in "${current_tools[@]}"; do [ "$t" = "$old_tool" ] && still_current=true && break; done
    if [ "$still_current" = false ] && [ -e "$TOOLS_HUB/$old_tool" ]; then
      echo "Removing stale tool from hub: $old_tool"
      rm -rf "$TOOLS_HUB/$old_tool"
    fi
  done < "$TOOLS_MANIFEST"
fi

# ---------- hub: copy this repo's tools to ~/.agents/tools/<name> ----------
for tool_name in "${current_tools[@]}"; do
  echo "Copying tool to hub: $tool_name"
  rm -rf "$TOOLS_HUB/$tool_name"
  cp -R "$SOURCE_TOOLS_DIR/$tool_name" "$TOOLS_HUB/$tool_name"
  chmod +x "$TOOLS_HUB/$tool_name"/*.sh 2>/dev/null || true
done
printf "%s\n" "${current_tools[@]}" > "$TOOLS_MANIFEST"

# ---------- clean up anything this repo installed previously that no longer exists ----------
if [ -f "$MANIFEST" ]; then
  while IFS= read -r old_name; do
    [ -z "$old_name" ] && continue
    still_current=false
    for s in "${current_skills[@]}"; do [ "$s" = "$old_name" ] && still_current=true && break; done
    if [ "$still_current" = false ]; then
      # The manifest only lists names this script put in the hub, so the hub
      # entry is ours to remove whether it's today's copied directory or an
      # older install's symlink.
      if [ -e "$HUB/$old_name" ] || [ -L "$HUB/$old_name" ]; then
        echo "Removing stale skill from hub: $old_name"
        rm -rf "$HUB/$old_name"
      fi
      # Client dirs: only remove a symlink that points at our hub entry (or at
      # this repo, from an older install); never a real directory.
      for path in "${CLIENTS_PATH[@]}"; do
        target="$path/$old_name"
        if [ -L "$target" ]; then
          link_dest="$(readlink "$target" 2>/dev/null || true)"
          if [ "$link_dest" = "$HUB/$old_name" ] || [ "$link_dest" = "$SOURCE_DIR/$old_name" ]; then
            rm -f "$target"
          fi
        fi
      done
    fi
  done < "$MANIFEST"
fi

# ---------- retire links earlier versions of this script made for hub-direct clients ----------
# These clients read the hub directly; the extra links only produced duplicates or conflict
# warnings. Only remove a link that points at our hub entry or this repo, never anything else.
for label in $HUB_DIRECT; do
  for i in "${!CLIENTS_LABEL[@]}"; do
    [ "${CLIENTS_LABEL[$i]}" = "$label" ] || continue
    for skill_name in "${current_skills[@]}"; do
      legacy="${CLIENTS_PATH[$i]}/$skill_name"
      if [ -L "$legacy" ]; then
        link_dest="$(readlink "$legacy" 2>/dev/null || true)"
        if [ "$link_dest" = "$HUB/$skill_name" ] || [ "$link_dest" = "$SOURCE_DIR/$skill_name" ]; then
          rm -f "$legacy"
        fi
      fi
    done
  done
done

# ---------- hub: copy this repo's skills to ~/.agents/skills/<name> ----------
for skill_name in "${current_skills[@]}"; do
  echo "Copying skill to hub: $skill_name"
  rm -rf "$HUB/$skill_name"
  cp -R "$SOURCE_DIR/$skill_name" "$HUB/$skill_name"
done

# ---------- agents: copy agents/*.md to ~/.agents/agents, link into Claude Code ----------
# The agent files drive skills unattended. Claude Code reads ~/.claude/agents; the other clients ignore these.
AGENTS_HUB="$HOME/.agents/agents"
SOURCE_AGENTS_DIR="$REPO_DIR/agents"
mkdir -p "$AGENTS_HUB"
agent_files=()
if [ -d "$SOURCE_AGENTS_DIR" ]; then
  for f in "$SOURCE_AGENTS_DIR"/*.md; do
    [ -f "$f" ] && agent_files+=("$(basename "$f")")
  done
fi
for a in "${agent_files[@]}"; do
  rm -f "$AGENTS_HUB/$a"
  cp "$SOURCE_AGENTS_DIR/$a" "$AGENTS_HUB/$a"
done
for label in "${selected[@]}"; do
  if [ "$label" = "claude" ]; then
    mkdir -p "$HOME/.claude/agents"
    for a in "${agent_files[@]}"; do
      rm -f "$HOME/.claude/agents/$a"
      ln -s "$AGENTS_HUB/$a" "$HOME/.claude/agents/$a"
    done
    echo "Linked ${#agent_files[@]} agents into Claude Code (~/.claude/agents)"
  fi
done

# ---------- warn if the plugin install is also present ----------
if grep -qs '"ux-atlas' "$HOME/.claude/plugins/installed_plugins.json" 2>/dev/null; then
  echo ""
  echo "NOTE: the UX Atlas Claude Code plugin is also installed. Claude Code will list every skill twice"
  echo "      (once as /ux-atlas:<skill>, once as /<skill>). Keep one: run 'claude plugin uninstall ux-atlas'"
  echo "      or re-run this script without --claude."
fi

# ---------- clients: <client>/skills/<name> -> ~/.agents/skills/<name> ----------
for label in "${selected[@]}"; do
  for i in "${!CLIENTS_LABEL[@]}"; do
    if [ "${CLIENTS_LABEL[$i]}" = "$label" ]; then
      target_dir="${CLIENTS_PATH[$i]}"
      if is_hub_direct "$label"; then
        echo "${CLIENTS_NAME[$i]} reads $HUB directly; nothing to link"
        continue
      fi
      mkdir -p "$target_dir"
      for skill_name in "${current_skills[@]}"; do
        rm -rf "$target_dir/$skill_name"
        ln -s "$HUB/$skill_name" "$target_dir/$skill_name"
      done
      echo "Symlinked ${#current_skills[@]} skills into ${CLIENTS_NAME[$i]} ($target_dir)"
    fi
  done
done

# ---------- record what we installed, for next run's cleanup ----------
printf "%s\n" "${current_skills[@]}" > "$MANIFEST"

# ---------- record the installed version, so 'setup' can check for updates ----------
# Best-effort: if this repo isn't a git checkout (e.g. downloaded as a zip),
# skip silently rather than failing the install over it.
installed_sha="$(cd "$REPO_DIR" && git rev-parse HEAD 2>/dev/null || true)"
installed_repo="$(cd "$REPO_DIR" && git remote get-url origin 2>/dev/null || true)"
# 'path=' lets 'help' link the walkthrough (index.html) from an installed copy.
{
  [ -n "$installed_repo" ] && echo "repo=$installed_repo"
  [ -n "$installed_sha" ] && echo "sha=$installed_sha"
  echo "path=$REPO_DIR"
  echo "installed_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
} > "$HUB/.ux-atlas.version"

echo ""
echo "Successfully installed ${#current_skills[@]} skills!"
echo "Canonical hub (copied): $HUB"
[ ${#current_tools[@]} -gt 0 ] && echo "Tools hub (copied, no client symlinks needed): $TOOLS_HUB (${#current_tools[@]} tools)"
for label in "${selected[@]}"; do
  for i in "${!CLIENTS_LABEL[@]}"; do
    if [ "${CLIENTS_LABEL[$i]}" = "$label" ]; then
      if is_hub_direct "$label"; then
        echo "  -> ${CLIENTS_NAME[$i]}: reads the hub directly (reload skills in an open session)"
      else
        echo "  -> ${CLIENTS_NAME[$i]}: ${CLIENTS_PATH[$i]}"
      fi
    fi
  done
done
echo "=================================================="
echo ""
echo "Re-run this script any time (e.g. after a skill rename) to refresh files and clean up stale entries."
echo "Flags for non-interactive use: --all, --none, --claude, --gemini-cli, --antigravity, --codex, --copilot, --cursor, --grok, --open, --no-open"

# ---------- open the instructions in a browser ----------
open_instructions() {
  local target="$REPO_DIR/index.html"
  [ -f "$target" ] || return
  if command -v open >/dev/null 2>&1; then
    open "$target"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$target" >/dev/null 2>&1
  elif command -v start >/dev/null 2>&1; then
    start "" "$target"
  else
    echo "Instructions: $target"
  fi
}

echo ""
if [ -f "$REPO_DIR/index.html" ]; then
  if [ "$no_open" = true ]; then
    :
  elif [ "$force_open" = true ]; then
    open_instructions
  elif [ -t 0 ]; then
    read -r -p "Open install instructions in browser? [Y/n] " open_ans
    case "$open_ans" in
      n|N) : ;;
      *) open_instructions ;;
    esac
  fi
fi
