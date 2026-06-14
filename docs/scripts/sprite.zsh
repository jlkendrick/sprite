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

# Sprite command recorder: logs each command + the directory it ran in, for `sp recall`.
autoload -Uz add-zsh-hook
_sprite_preexec() { _SPRITE_CMD="$1"; _SPRITE_DIR="$PWD"; }
_sprite_precmd() {
  local _sprite_exit=$?
  [[ -n "$_SPRITE_CMD" ]] && \
    sp-binary --log --dir "$_SPRITE_DIR" --exit "$_sprite_exit" -- "$_SPRITE_CMD" &> /dev/null &|
  unset _SPRITE_CMD
}
add-zsh-hook preexec _sprite_preexec
add-zsh-hook precmd  _sprite_precmd
