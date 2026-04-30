# Sprite

**An intelligent directory navigation and command augmentation tool for Zsh**

Sprite (`sp`) streamlines terminal workflow by providing smart directory navigation with various matching types, intelligent autocompletion, and customizable shortcuts. Navigate to deeply nested directories instantly, execute commands with path completion, and create shortcuts for your most-used commands.

## ✨ Key Features

- **🚀 Smart Navigation** - Jump to any directory with partial matching (exact, prefix, suffix, or contains)
- **⚡ Quick-Nav** - Instantly navigate to the best match by pressing Enter
- **🎯 Tab Completion** - Interactive menu-based path completion integrated with Zsh
- **🔗 Custom Shortcuts** - Create command aliases that work with path completion
- **🧠 Learning Algorithm** - Adapts to your usage patterns with frequency-based and recency-based ranking
- **⚙️ Highly Configurable** - Customize matching behavior, exclusions, and result limits
- **💾 Persistent History** - SQLite-backed database remembers your navigation patterns
- **🔄 Auto-Refresh** - Keeps your directory database up-to-date automatically

---

## 📦 Installation

### Automatic Installation (Recommended)

Install Sprite with a single command:

```sh
curl -fsSL https://jlkendrick.github.io/sprite/docs/install.sh | bash
```

The installer will:

- Download the latest binary to `~/.local/bin`
- Set up Zsh completion scripts
- Configure your `.zshrc` automatically
- Initialize the directory database

**Note:** Currently supports macOS only. Linux support coming soon.

---

### Homebrew

Install via the `[jlkendrick/tap](https://github.com/jlkendrick/homebrew-tap)` Homebrew tap:

```sh
brew tap jlkendrick/tap
brew install sprite
```

Or install in a single command:

```sh
brew install jlkendrick/tap/sprite
```

Then finish setup by configuring your shell and building the initial database:

```sh
sp-binary init
source ~/.zshrc
```

`sp-binary init` adds the Sprite completion block and `sp()` function to your `~/.zshrc` and builds the directory database from your home directory. This step is also mentioned in the formula caveats.

---

### Manual Installation

If you prefer manual installation or need more control:

#### 1️⃣ Download the Binary

Download or build the `sp-binary` executable and move it to a directory in your `PATH`:

```sh
# Download from the repository
curl -fsSL -o ~/.local/bin/sp-binary https://raw.githubusercontent.com/jlkendrick/sprite/main/docs/bin/sp-binary

# Make it executable
chmod +x ~/.local/bin/sp-binary

# Ensure ~/.local/bin is in your PATH
export PATH="$HOME/.local/bin:$PATH"
```

#### 2️⃣ Finish Setup

You have two options for the rest of the setup:

**Option A — Semi-automatic (recommended):** Let `sp-binary` configure your shell and build the database for you:

```sh
sp-binary init
source ~/.zshrc
```

This installs the Zsh completion script to `~/.zsh/completions/_sp`, adds the completion block, `sp()` function, and PATH export to your `~/.zshrc`, and builds the initial database from your home directory. Skip to the [Usage](#-usage) section once it finishes.

**Option B — Fully manual:** Continue with the steps below if you want full control over every file.

#### 3️⃣ Install Zsh Completion Script

Create the completion directory and download the completion script:

```sh
# Create completions directory
mkdir -p ~/.zsh/completions

# Download completion script
curl -fsSL -o ~/.zsh/completions/_sp https://raw.githubusercontent.com/jlkendrick/sprite/main/docs/scripts/_sp
```

Or manually create `~/.zsh/completions/_sp` with the following content:

```sh
#compdef sp

_sp() {
  local completions
  completions=("${(@f)$(sp-binary --tab "${words[@]}")}")

  compadd -Q -U -V 'Available Options' -- "${completions[@]}"
}
```

#### 4️⃣ Configure Zsh

Add the following to your `~/.zshrc`:

```sh
# Sprite Zsh completion configuration
fpath=(~/.zsh/completions $fpath)

zstyle ':completion:*' list-grouped yes
zstyle ':completion:*' menu select
zstyle ':completion:*' matcher-list '' 'r:|=*'

setopt menucomplete
setopt autolist

autoload -Uz compinit && compinit -u

# Sprite command handler
sp() {
  local cmd
  cmd=$(sp-binary --enter sp "$@")

  if [[ -n "$cmd" ]]; then
    eval "$cmd"
  else
    echo "sp-error: No command found for '$*'"
  fi
}

# Auto-refresh database on terminal start
sp-binary --enter sp refresh &> /dev/null & disown
```

#### 5️⃣ Initialize Database

Reload your shell configuration and build the initial database:

```sh
source ~/.zshrc
sp build --root ~
```

---

## 🚀 Usage

### Basic Navigation

Navigate to directories using partial path matching:

```sh
# Tab for completion menu
sp project<Tab>          # Shows all matches for "project"
sp path/to/project       # Navigate to specific path
sp project<Enter>        # Quick-nav to best match

# Navigate with partial matches
sp docs<Enter>           # Jumps to first match containing "docs"
sp proj<Enter>           # Jumps to first match containing "proj"

# No arguments returns to home
sp<Enter>                # cd ~
```

#### Filesystem File Completion

Append a `/` to any path to browse its contents directly from the filesystem, bypassing the database entirely. This is useful when you already know the parent directory and want to drill into it.

```sh
sp ~/Code/<Tab>          # Lists all entries inside ~/Code/
sp /path/to/dir/<Tab>    # Lists all entries inside that directory
sp proj<Tab>             # Database match for "proj" ...
sp /full/path/to/proj/<Tab>  # ... then drill in with /
```

Any path — absolute, relative, or `~`-prefixed — works as long as it ends with `/`.

### Command Execution

Prefix any command with `sp` to get path completion:

```sh
# Open directory in VS Code
sp code project<Tab>     # Autocomplete project path
sp code project<Enter>   # Quick-nav and open

# List directory contents
sp ls documents<Enter>   # ls /path/to/documents

# Copy directories
sp cp -r source<Tab>     # Autocomplete source
sp cp -r /path/to/source dest<Tab>  # Then autocomplete destination
```

### Shortcuts System

Create custom shortcuts that integrate with path completion:

#### Add a Shortcut

```sh
sp add <shortcut> <command>

# Examples
sp add code "code"       # Open in VS Code
sp add idea "idea"       # Open in IntelliJ IDEA
sp add term "open -a Terminal"  # Open in new Terminal window
```

#### Use a Shortcut

Shortcuts work with path completion:

```sh
sp code project<Enter>   # Expands to: code /path/to/project
sp idea backend<Enter>   # Expands to: idea /path/to/backend
sp term logs<Tab>        # Autocomplete then open in new terminal
```

#### Path Placeholder `{}`

Use `{}` in a shortcut command to control exactly where the resolved path is inserted. When a shortcut contains `{}`, Sprite resolves the argument that follows the shortcut name and substitutes it in place of `{}`.

```sh
sp add <shortcut> <command with {}>

# Examples
sp add cc "cd {} && claude"
sp add gitlog "git -C {} log --oneline -10"
```

```sh
sp cc dirv<Enter>        # Expands to: cd /path/to/sprite && claude
sp gitlog backend<Enter> # Expands to: git -C /path/to/backend log --oneline -10
```

Without `{}`, the resolved path is appended to the end of the command. With `{}`, you have full control over placement — including using it multiple times in a single command.

#### List All Shortcuts

```sh
sp list
# Output:
# Shortcuts:
# code | code
# idea | idea
# term | open -a Terminal
```

#### Show Specific Shortcut

```sh
sp show code
# Output: Shortcut: code | Command: code
```

#### Delete a Shortcut

```sh
sp delete code
# Output: Shortcut code deleted
```

### Database Management

#### Build Database

Scans directories and creates a fresh database (resets history):

```sh
sp build                 # Build from configured root
sp build --root ~/Code   # Build from specific directory
```

#### Refresh Database

Updates the database with new/deleted directories (preserves history):

```sh
sp refresh               # Refresh from configured root
sp refresh --root ~/Code # Refresh from specific directory
```

**Note:** A refresh runs automatically when you start a new terminal session.

#### Update Sprite

Install the latest version:

```sh
sp install               # Install latest version
```

### Utility Features

#### Check Version

```sh
sp --version
sp -v
# Output: Sprite version 1.0.1
```

#### Bypass Sprite Commands

Use `--` to bypass Sprite's command interpretation:

```sh
sp -- build              # Navigate to a directory named "build"
sp -- refresh            # Navigate to a directory named "refresh"
```

---

## ⚙️ Configuration

Sprite's configuration file is located at:

- **macOS:** `~/Library/Application Support/sprite/config.json`

### Configuration Options

```json
{
  "paths": {
    "init": "/Users/you",
    "db": "/Users/you/Library/Application Support/sprite/sprite.db"
  },
  "matching": {
    "max_results": 10,
    "max_history_size": 100,
    "type": "contains",
    "promotion_strategy": "recently_accessed",
    "exclusions": {
      "exact": ["node_modules", "dist", "target", ".git"],
      "prefix": ["."],
      "suffix": ["sdk", "Library"],
      "contains": ["release"]
    }
  }
}
```

### Configuration Reference

#### Paths


| Option | Description                          | Default                                            |
| ------ | ------------------------------------ | -------------------------------------------------- |
| `init` | Root directory for database scanning | `~/`                                               |
| `db`   | SQLite database location             | `~/Library/Application Support/sprite/sprite.db` |


#### Matching


| Option               | Type    | Description                      | Options/Default                                   |
| -------------------- | ------- | -------------------------------- | ------------------------------------------------- |
| `max_results`        | integer | Maximum completions to show      | Default: `10`                                     |
| `max_history_size`   | integer | Maximum history entries to track | Default: `100`                                    |
| `type`               | string  | How to match directory names     | `exact`, `prefix`, `suffix`, `contains` (default) |
| `promotion_strategy` | string  | How to rank results              | `recently_accessed` (default), `frequency_based`  |


#### Matching Types

- `**exact**` - Only matches directories with the exact name
- `**prefix**` - Matches directories starting with the query
- `**suffix**` - Matches directories ending with the query
- `**contains**` - Matches directories containing the query (substring match)

#### Promotion Strategies

- `**recently_accessed**` - Prioritizes recently visited directories
- `**frequency_based**` - Prioritizes frequently visited directories

#### Exclusions

Specify directories to exclude from the database. Supports four matching patterns:

```json
{
  "exclusions": {
    "exact": ["node_modules", "dist"],        // Exact name match
    "prefix": [".", "tmp_"],                   // Starts with
    "suffix": ["_backup", ".cache"],          // Ends with
    "contains": ["deprecated", "old"]         // Contains substring
  }
}
```

**Default exclusions:** `.git`, `node_modules`, `browser_components`, `dist`, `out`, `target`, `tmp`, `temp`, `cache`, `venv`, `env`, `obj`, `pkg`, `bin`, and directories starting with `.`

---

## 💡 Tips & Best Practices

### Optimal Root Directory

Choose a root directory that:

- Contains all directories you want to navigate to
- Isn't too broad (avoid scanning entire filesystem)
- Excludes system directories

```sh
# Good choices
sp build --root ~/Code
sp build --root ~/Documents

# Less optimal
sp build --root /  # Too many directories, slow performance
```

### Matching Type Selection

- `**contains**` (default) - Most flexible, finds directories anywhere in the tree
- `**prefix**` - Faster, better for consistent naming schemes
- `**exact**` - Most precise, use when you know exact directory names
- `**suffix**` - Useful for projects with naming patterns (e.g., `-api`, `-web`)

### Effective Shortcuts

Create shortcuts for frequently used commands:

```sh
sp add c "cursor"
sp add penv "source .venv/bin/activate && source .env && clear"
sp add rmdir "rm -rf"
sp add claude "cd {} && claude"
```

Use `{}` when you need the resolved path in a specific position:

```sh
sp add gitlog "git -C {} log --oneline"   # Run git log inside a directory
sp add ls "ls -la {}"                      # List with flags before the path
sp add mkcd "mkdir -p {} && cd {}"        # Create and enter a new directory
```

### Performance

- Use exclusions to prevent scanning large irrelevant directories
- Run `sp refresh` periodically or let it auto-refresh on terminal start
- Adjust `max_results` based on your screen size
- Set appropriate `max_history_size` (larger = better predictions, more storage)

---

## 🏗️ Building from Source

Requirements:

- CMake 3.16+
- Clang compiler
- C++20 support

```sh
# Clone the repository
git clone https://github.com/jlkendrick/sprite.git
cd sprite

# Build
mkdir build && cd build
cmake ..
make

# Binary will be at build/sp-binary
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🔧 Troubleshooting

### Completion not working

1. Ensure `~/.local/bin` is in your `PATH`
2. Verify `fpath` includes `~/.zsh/completions`
3. Run `compinit` to rebuild completion cache
4. Check that `sp-binary` is executable: `chmod +x ~/.local/bin/sp-binary`

### Database not updating

1. Run `sp refresh` manually
2. Check root directory in config: `cat ~/Library/Application\ Support/sprite/config.json`
3. Rebuild database: `sp build --root ~/your/root/path`

### Permission errors

1. Ensure proper permissions on config directory:
  ```sh
   chmod 755 ~/Library/Application\ Support/sprite
   chmod 644 ~/Library/Application\ Support/sprite/config.json
  ```

### Command not found

1. Verify binary location: `which sp-binary`
2. Add to PATH in `.zshrc`: `export PATH="$HOME/.local/bin:$PATH"`
3. Reload shell: `source ~/.zshrc`

---

**Built with ❤️ for faster terminal navigation**