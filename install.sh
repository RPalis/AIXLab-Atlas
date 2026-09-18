#!/bin/bash
set -e

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/skills" && pwd)"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HUB="$HOME/.agents/skills"
MANIFEST="$HUB/.ux-atlas.manifest"

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
  local -a G=(
    "     █████     "
    "  ███  █  ███  "
    " ███   █   ███ "
    "███████████████"
    "███████████████"
    " ███   █   ███ "
    "  ███  █  ███  "
    "     █████     "
  )
  local -a U=("██   ██" "██   ██" "██   ██" "██   ██" "██   ██" "██   ██" " ██ ██ " "  ███  ")
  local -a X=("██   ██" " ██ ██ " "  ███  " "   █   " "   █   " "  ███  " " ██ ██ " "██   ██")
  local -a A=("  ███  " " █   █ " "██   ██" "██   ██" "███████" "██   ██" "██   ██" "██   ██")
  local -a T=("███████" "  ███  " "  ███  " "  ███  " "  ███  " "  ███  " "  ███  " "  ███  ")
  local -a L=("██     " "██     " "██     " "██     " "██     " "██     " "██     " "███████")
  local -a S=(" ██████" "██     " "██     " " █████ " "     ██" "     ██" "██   ██" " █████ ")

  local -a lines=()
  local r
  for r in 0 1 2 3 4 5 6 7; do
    lines+=("${G[$r]}   ${U[$r]} ${X[$r]}    ${A[$r]} ${T[$r]} ${L[$r]} ${A[$r]} ${S[$r]}")
  done

  if [ ! -t 1 ]; then
    echo "UX ATLAS"
    return
  fi

  local n=${#lines[@]}
  local i

  # gradient: blue -> cyan -> green (top to bottom), 256-color
  local -a colors=(27 33 39 45 51 50 49 46)

  # shadow pass: dim charcoal, shifted 3 cols right + 2 rows down
  printf "\n\n"
  for i in "${!lines[@]}"; do
    printf "   \033[2;38;5;236m%s\033[0m\n" "${lines[$i]}"
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
      if [ "${CLIENTS_LABEL[$i]}" = "gemini-cli" ]; then
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
  echo "$(dim "${#current_skills[@]} skills will be copied to ~/.agents/skills (always), then symlinked into whichever clients you pick below.")"
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

# ---------- retire the ~/.gemini/skills links earlier versions of this script made ----------
# Gemini CLI reads the hub directly; these only produced conflict warnings. Only
# remove a link that points at our hub entry or this repo, never anything else.
for skill_name in "${current_skills[@]}"; do
  legacy="$HOME/.gemini/skills/$skill_name"
  if [ -L "$legacy" ]; then
    link_dest="$(readlink "$legacy" 2>/dev/null || true)"
    if [ "$link_dest" = "$HUB/$skill_name" ] || [ "$link_dest" = "$SOURCE_DIR/$skill_name" ]; then
      rm -f "$legacy"
    fi
  fi
done

# ---------- hub: copy this repo's skills to ~/.agents/skills/<name> ----------
for skill_name in "${current_skills[@]}"; do
  echo "Copying skill to hub: $skill_name"
  rm -rf "$HUB/$skill_name"
  cp -R "$SOURCE_DIR/$skill_name" "$HUB/$skill_name"
done

# ---------- clients: <client>/skills/<name> -> ~/.agents/skills/<name> ----------
for label in "${selected[@]}"; do
  for i in "${!CLIENTS_LABEL[@]}"; do
    if [ "${CLIENTS_LABEL[$i]}" = "$label" ]; then
      target_dir="${CLIENTS_PATH[$i]}"
      if [ "$label" = "gemini-cli" ]; then
        echo "Gemini CLI reads $HUB directly; nothing to link"
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

echo ""
echo "Successfully installed ${#current_skills[@]} skills!"
echo "Canonical hub (copied): $HUB"
for label in "${selected[@]}"; do
  for i in "${!CLIENTS_LABEL[@]}"; do
    if [ "${CLIENTS_LABEL[$i]}" = "$label" ]; then
      if [ "$label" = "gemini-cli" ]; then
        echo "  -> Gemini CLI: reads the hub directly (run /skills reload in an open session)"
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
