fpath=(~/.zsh/completions $fpath)

zstyle ':completion:*' list-grouped yes
zstyle ':completion:*' menu select
zstyle ':completion:*' matcher-list '' 'r:|=*'

setopt menucomplete
setopt autolist

autoload -Uz compinit && compinit

# The other content of your existing .zshrc file #
# ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃ ⌃  #
# | | | | | | | | | | | | | | | | | | | | | | |  #
# | | | | | | | | | | | | | | | | | | | | | | |  #
# ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄ ⌄  #
# The other content of your existing .zshrc file #

sp-binary -enter sp refresh &> /dev/null & disown