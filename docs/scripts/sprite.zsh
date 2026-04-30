# Sprite shell integration
# Source this file from your ~/.zshrc:
#   source "$(brew --prefix)/etc/sprite.zsh"

sp() {
  local cmd
  cmd=$(sp-binary --enter sp "$@")
  if [[ -n "$cmd" ]]; then
    eval "$cmd"
  else
    echo "sp-error: No command found for '$*'"
  fi
}

sp-binary --enter sp refresh &> /dev/null & disown
