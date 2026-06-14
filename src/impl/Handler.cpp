#include "Handler.h"

#include <cstdlib>
#include <fstream>
#include <filesystem>
#include <mach-o/dyld.h>
#include <unistd.h>

Handler::Handler(Database& db, const std::string& version) : db(db), version(version) {}

// Parsed form of a `recall` invocation. recall is passed through raw (so candidate commands keep
// their own flags), and we pick out our own flags here; everything else is a fuzzy search term.
struct RecallArgs {
	std::vector<std::string> terms;
	std::string in_value;
	bool all = false;
	bool list = false;
	bool shortcuts = false;
};

static RecallArgs parse_recall_args(const std::vector<std::string>& tokens, size_t start) {
	RecallArgs r;
	for (size_t i = start; i < tokens.size(); i++) {
		const std::string& tok = tokens[i];
		if (tok == "--all" or tok == "-a") r.all = true;
		else if (tok == "--list" or tok == "-l") r.list = true;
		else if (tok == "--shortcuts") r.shortcuts = true;
		else if (tok == "--in" or tok == "-i") { if (i + 1 < tokens.size()) r.in_value = tokens[++i]; }
		else r.terms.push_back(tok);
	}
	return r;
}

// Resolve the directory a recall is scoped to. Empty -> the shell's logical $PWD (what the
// recorder logs). A path (contains '/' or '~') is used as-is; a bare partial is resolved through
// the paths index, exactly like navigation (so `--in sprite` finds the repo).
static std::string recall_resolve_dir(Database& db, const std::string& in_value) {
	if (in_value.empty()) {
		const char* pwd = std::getenv("PWD");
		if (pwd and pwd[0] != '\0')
			return pwd;
		std::error_code ec;
		auto cwd = std::filesystem::current_path(ec);
		return ec ? std::string() : cwd.string();
	}
	if (in_value.find('/') != std::string::npos or in_value.find('~') != std::string::npos)
		return in_value;
	std::vector<std::string> matches = db.get_paths_table().query(in_value);
	return matches.empty() ? in_value : matches[0];
}

int Handler::handle_tab(int argc, char* argv[]) {
	// Need at least 4 arguments: sp_binary, --tab, sp, partial_path
	if (argc < 4) {
		std::cerr << "Tab completion requires at least a partial path" << std::endl;
		return 1;
	}

	// Tab on `recall`: pop up the matching commands as the completion menu (the navigation
	// equivalent of completing a path). Selecting one drops it on the line to run with Enter.
	if (std::string(argv[3]) == "recall") {
		std::vector<std::string> tokens(argv, argv + argc);
		RecallArgs ra = parse_recall_args(tokens, 4);
		const int limit = db.get_config().get_max_results();
		std::vector<std::string> matches = ra.shortcuts
			? db.get_shortcuts_table().search_commands(ra.terms, limit)
			: db.get_commands_table().recall(ra.terms, recall_resolve_dir(db, ra.in_value), ra.all, limit);
		for (const auto& match : matches)
			std::cout << match << std::endl;
		return 0;
	}

	// Last argument is the partial path
	std::string partial = argv[argc - 1];

	// Check if we need to do lazy, in-memory file completion
	// Our heurisitc is if the last char in the partial path is a '/'
	if (not partial.empty() and partial.back() == '/') {
		// Lazy, in-memory file completion
		std::vector<std::string> matches = db.get_paths_table().collect_files(partial);
		for (const auto& match : matches)
			std::cout << match << std::endl;
		return 0;
	}
	
	// Get matches for the partial path and print them for zsh completion
	std::vector<std::string> matches = db.get_paths_table().query(partial);
	for (const auto& match : matches)
		std::cout << match << std::endl;

	return 0;
}


int Handler::handle_enter(std::vector<std::string>& commands, std::vector<Flag>& flags) {
	// If --enter was called with no arguments, that is the eqivalent of "cd"
	// where we want to cd to home dir
	if (commands.empty() and flags.empty()) {
		std::cout << "cd ~" << std::endl;
		return 0;
	}

	// Check if a subcommand-less flag was passed (e.g. "--version" ("-v"))
	if (ArgParsing::has_flag(flags, "version")) {
		std::cout << "echo Sprite version " << version << std::endl;
		return 0;
	}

	bool bypass = ArgParsing::has_flag(flags, "[bypass]");
	std::string first_token = bypass ? ArgParsing::get_flag_value(flags, "[bypass]") : (not commands.empty() ? commands[0] : "");

	// Check if a subcommand was passed
	if (not bypass) {
		if (first_token == "build" or first_token == "rebuild")
			return Subcommands::handle_re_build(*this, commands, flags);
		else if (first_token == "refresh")
			return Subcommands::handle_refresh(*this, commands, flags);
		else if (first_token == "install")
			return Subcommands::handle_install(*this, commands, flags);
		else if (first_token == "init")
			return Subcommands::handle_init(*this, commands, flags);
		else if (first_token == "add")
			return Subcommands::handle_add(*this, commands, flags);
		else if (first_token == "delete")
			return Subcommands::handle_delete(*this, commands, flags);
		else if (first_token == "list")
			return Subcommands::handle_list(*this, commands, flags);
		else if (first_token == "show")
			return Subcommands::handle_show(*this, commands, flags);
		else if (first_token == "recall")
			return Subcommands::handle_recall(*this, commands, flags);
	}

	// If we are here, need to handle a shortcut or a path. We prioritize shortcuts over paths

	std::vector<std::string> matches = db.get_shortcuts_table().query(first_token);
	std::string command = matches.empty() ? "" : matches[0];
	if (not command.empty()) {
		// Try to complete the last command as a path
		std::string last_token = commands.size() > 1 ? commands.back() : "";
		if (not last_token.empty() and 
				last_token.find('/') == std::string::npos and 
				last_token.find('~') == std::string::npos) {
			
			// Partial path, need to complete
			std::vector<std::string> matches = db.get_paths_table().query(last_token);
			if (!matches.empty())
				last_token = matches[0];
		}

		// Check if the completion needs to be embedded in the command
		// We use {} to embed the completion in the command
		const size_t start = command.find("{}");
		if (start != std::string::npos)
			// Replace the {} with the last token
			command = command.replace(start, 2, last_token);
		else
			// Add the last token to the command
			command += " " + last_token;

		// Execute the shortcut
		std::cout << command << std::endl;

		// Update the database with the accessed path
		db.get_shortcuts_table().access(command);

		return 0;
	}

	// If we are here, we need to handle a path
	
	// Last token (or arg passed to --) is the path to complete
	std::string path = !commands.empty() ? commands.back() : ArgParsing::get_flag_value(flags, "[bypass]");
	// Check if path is full path or partial
	if (path.find('/') == std::string::npos and 
		path.find('~') == std::string::npos and 
		path.find('.') == std::string::npos) {
		// Partial path, need to complete
		std::vector<std::string> matches = db.get_paths_table().query(path);
		if (matches.empty()) {
			// 'cd' to the path if no matches found for entries like "~", "..", etc.
			std::cout << "cd " << path << std::endl;
			return 0;
		}
		// Use the first match
		path = matches[0];
	}

	// Update the database with the accessed path
	db.get_paths_table().access(path);
	
	// Now we need to assemble the final command to output.
	// Arguments look something like: sp-binary --enter sp [...] [path]
	std::string prefix = "";
	if (commands.size() > 1) {
		// Build the prefix from all arguments except the last one (and any "--" delimiters)
		for (size_t i = 0; i < commands.size() - 1; i++) {
			if (i > 0) prefix += " ";
			prefix += commands[i] != "--" ? commands[i] : "";
		}
	}
		
	// Decide what to output based on presence of prefix args and matches
	// If no prefix args, just 'cd' to the matched path
	if (prefix.empty())
		// No output, just 'cd' to the path
		std::cout << "cd " << path << std::endl;
	else
		// Execute the output with the path
		std::cout << prefix << " " << path << std::endl;

	return 0;
}

// Record a command via the recorder hook: `sp-binary --log --dir <cwd> --exit <code> -- <command>`.
// Parsed by hand so the logged command's own flags are never interpreted as Sprite flags.
int Handler::handle_log(int argc, char* argv[]) {
	std::string directory;
	int exit_code = 0;
	std::string command;

	for (int i = 2; i < argc; i++) {
		std::string arg = argv[i];
		if (arg == "--dir" and i + 1 < argc) {
			directory = argv[++i];
		} else if (arg == "--exit" and i + 1 < argc) {
			try { exit_code = std::stoi(argv[++i]); } catch (...) { exit_code = 0; }
		} else if (arg == "--") {
			// Everything after `--` is the verbatim command line
			for (int j = i + 1; j < argc; j++) {
				if (j > i + 1) command += " ";
				command += argv[j];
			}
			break;
		}
	}

	// Never disrupt the prompt: silently skip if there's nothing meaningful to record
	if (command.empty() or directory.empty())
		return 0;

	db.get_commands_table().log(command, directory, exit_code);
	return 0;
}

// Wrap a string in single quotes for safe `eval` in the sp() shell wrapper, escaping any
// embedded single quotes as '\''.
static std::string shell_single_quote(const std::string& s) {
	std::string out = "'";
	for (char c : s) {
		if (c == '\'') out += "'\\''";
		else out += c;
	}
	out += "'";
	return out;
}

int Handler::Subcommands::handle_re_build(Handler& handler, std::vector<std::string>& commands, std::vector<Flag>& flags) {
	// Relevant flags for build/rebuild:
	std::string init_path = ArgParsing::get_flag_value(flags, "root", handler.get_init_path());
	bool force = ArgParsing::has_flag(flags, "force");
				
	if (handler.db.build(init_path, force)) {
		std::cout << "echo Build from " << init_path << " complete" << std::endl;
		return 0;
	} else
		return 1;
}

int Handler::Subcommands::handle_refresh(Handler& handler, std::vector<std::string>& commands, std::vector<Flag>& flags) {
	// Relevant flags for refresh:
	std::string init_path = ArgParsing::get_flag_value(flags, "root", handler.get_init_path());

	if (handler.db.refresh(init_path)) {
		std::cout << "echo Refresh from " << init_path << " complete" << std::endl;
		return 0;
	} else
		return 1;
}

int Handler::Subcommands::handle_install(Handler& handler, std::vector<std::string>& commands, std::vector<Flag>& flags) {
	// Relevant flags for install:
	std::string version = ArgParsing::get_flag_value(flags, "version", "latest");
	if (version == "latest")
		version = handler.version;
	// Curl command to download and run the installation script
	std::string curl_command = std::format(
		"curl -fsSL https://raw.githubusercontent.com/jlkendrick/sprite/{}/docs/install.sh | bash",
		version.c_str()
	);
	std::cout << "echo Updating Sprite to version " << version << "..." << std::endl;
	std::cout << "echo Running: " << curl_command << std::endl;
	return 0;
}

static std::string get_executable_path() {
	char buffer[4096];
	uint32_t size = sizeof(buffer);
	if (_NSGetExecutablePath(buffer, &size) != 0)
		return "";
	std::error_code ec;
	auto canonical = std::filesystem::canonical(buffer, ec);
	if (ec) return buffer;
	return canonical.string();
}

static std::string find_first_on_path(const std::string& name) {
	const char* path_env = std::getenv("PATH");
	if (!path_env) return "";
	std::string path_str = path_env;
	size_t start = 0;
	while (start <= path_str.size()) {
		size_t end = path_str.find(':', start);
		std::string dir = path_str.substr(start, end == std::string::npos ? std::string::npos : end - start);
		start = (end == std::string::npos) ? path_str.size() + 1 : end + 1;
		if (dir.empty()) continue;
		std::string candidate = dir + "/" + name;
		if (access(candidate.c_str(), X_OK) == 0) {
			std::error_code ec;
			auto canonical = std::filesystem::canonical(candidate, ec);
			return ec ? candidate : canonical.string();
		}
	}
	return "";
}

int Handler::Subcommands::handle_init(Handler& handler, std::vector<std::string>& commands, std::vector<Flag>& flags) {
	const char* home_env = std::getenv("HOME");
	if (!home_env) {
		std::cerr << "HOME environment variable not set" << std::endl;
		return 1;
	}
	std::string home = home_env;
	std::string zshrc_path = home + "/.zshrc";
	std::string init_path = ArgParsing::get_flag_value(flags, "root", home);

	// Detect installation method from where the binary actually lives
	std::string exe_path = get_executable_path();
	bool is_local_bin = exe_path.find(home + "/.local/bin/") != std::string::npos;

	// Warn if another sp-binary earlier on PATH will shadow this one — common when
	// switching between the curl|bash installer (~/.local/bin) and Homebrew.
	std::string first_on_path = find_first_on_path("sp-binary");
	if (!first_on_path.empty() && !exe_path.empty() && first_on_path != exe_path) {
		std::cerr << "Warning: another sp-binary is earlier on your PATH and will be used instead of this one." << std::endl;
		std::cerr << "  Running:    " << exe_path << std::endl;
		std::cerr << "  Shadowed by: " << first_on_path << std::endl;
		std::cerr << "Remove the shadowing binary (e.g. `rm " << first_on_path << " && hash -r`) so `sp-binary` resolves to this install." << std::endl;
	}

	// Read existing .zshrc to avoid duplicating any block
	std::string zshrc_content;
	{
		std::ifstream in(zshrc_path);
		if (in.is_open())
			zshrc_content = std::string((std::istreambuf_iterator<char>(in)), std::istreambuf_iterator<char>());
	}

	// Always install _sp and add the completion block — Homebrew adds its own _sp too but
	// compinit picks the first match in fpath, so duplication is harmless. Skipping this on
	// Homebrew was a mistake: Homebrew adds to fpath but doesn't run compinit.
	std::string completions_dir = home + "/.zsh/completions";
	std::error_code ec;
	std::filesystem::create_directories(completions_dir, ec);

	std::string completion_file = completions_dir + "/_sp";
	if (!std::filesystem::exists(completion_file)) {
		std::ofstream out(completion_file);
		out << R"(#compdef sp

_sp() {
  local completions
  completions=("${(@f)$(sp-binary --tab "${words[@]}")}")

  compadd -S '' -Q -U -V 'Available Options' -- "${completions[@]}"
}
)";
	}

	std::string completion_block;
	if (zshrc_content.find("# Begin Sprite Zsh completion configuration") == std::string::npos) {
		completion_block = "# Begin Sprite Zsh completion configuration\n"
			"fpath=(" + completions_dir + " $fpath)\n"
			"\n"
			"zstyle ':completion:*' list-grouped yes\n"
			"zstyle ':completion:*' menu select\n"
			"zstyle ':completion:*' matcher-list '' 'r:|=*'\n"
			"\n"
			"setopt menucomplete\n"
			"setopt autolist\n"
			"\n"
			"autoload -Uz compinit && compinit -u\n"
			"# End Sprite Zsh completion configuration\n\n";
	}

	// Prepend the completion block so compinit runs before any later completion config
	if (!completion_block.empty()) {
		std::ofstream out(zshrc_path);
		if (!out.is_open()) {
			std::cerr << "Failed to open " << zshrc_path << std::endl;
			return 1;
		}
		out << completion_block << zshrc_content;
		zshrc_content = completion_block + zshrc_content;
	}

	// Append PATH export only if the binary lives in ~/.local/bin and PATH isn't already set
	std::string append_block;
	if (is_local_bin && zshrc_content.find("# Add ~/.local/bin to PATH") == std::string::npos) {
		append_block += "\n# Add ~/.local/bin to PATH\nexport PATH=\"$HOME/.local/bin:$PATH\"\n";
	}

	// Append the sp() function and auto-refresh if not already present
	if (zshrc_content.find("sp-binary --enter sp") == std::string::npos) {
		append_block += R"(
# Sprite
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
)";
	}

	// Command recorder: log each command + the directory it ran in (for `sp recall`).
	if (zshrc_content.find("Sprite command recorder") == std::string::npos) {
		append_block += R"(
# Sprite command recorder
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
)";
	}

	if (!append_block.empty()) {
		std::ofstream out(zshrc_path, std::ios::app);
		if (!out.is_open()) {
			std::cerr << "Failed to open " << zshrc_path << std::endl;
			return 1;
		}
		out << append_block;
	}

	std::cerr << "Shell configuration written to " << zshrc_path << std::endl;

	if (!handler.db.build(init_path)) {
		std::cerr << "Failed to build database from " << init_path << std::endl;
		return 1;
	}

	std::cerr << "Database initialized from " << init_path << std::endl;
	std::cerr << "Run: source ~/.zshrc" << std::endl;

	// Emit a no-op on stdout so the sp() shell wrapper's eval succeeds silently
	std::cout << ":" << std::endl;
	return 0;
}

int Handler::Subcommands::handle_add(Handler& handler, std::vector<std::string>& commands, std::vector<Flag>& flags) {
	// Relevant flags for add:
	// None for now

	// Validate the arguments passed to add
	if (commands.size() < 3) {
		std::cerr << "Usage sp add [shortcut] [command]" << std::endl;
		return 1;
	}

	std::string shortcut = commands[1];
	std::string command = commands[2];
	// Add the pair to the database
	handler.db.get_shortcuts_table().add_shortcut(shortcut, command);

	std::cout << "echo Shortcut \"" << shortcut << "\" added for command \"" << command << "\"" << std::endl;

	return 0;
}

const std::string Handler::get_init_path() const {
	return db.get_config().get_init_path();
}


int Handler::Subcommands::handle_delete(Handler& handler, std::vector<std::string>& commands, std::vector<Flag>& flags) {
	// Relevant flags for delete:
	// None for now

	if (commands.size() != 2) {
		std::cerr << "Usage sp delete [shortcut]" << std::endl;
		return 1;
	}

	// Validate the arguments passed to delete
	std::string shortcut = commands[1];

	// Delete the shortcut from the database
	handler.db.get_shortcuts_table().delete_shortcut(commands[1]);

	std::cout << "echo Shortcut " << shortcut << " deleted" << std::endl;

	return 0;
}


int Handler::Subcommands::handle_list(Handler& handler, std::vector<std::string>& commands, std::vector<Flag>& flags) {
	// Relevant flags for list:
	// None for now

	// List all shortcuts in the database
	std::vector<std::string> shortcuts = handler.db.get_shortcuts_table().select_all_shortcuts();
	std::string output = "Shortcuts:";
	for (const auto& shortcut : shortcuts)
		output += "\n" + shortcut;
	std::cout << "echo \"" << output << "\"" << std::endl;

	return 0;
}


int Handler::Subcommands::handle_show(Handler& handler, std::vector<std::string>& commands, std::vector<Flag>& flags) {
	// Relevant flags for show: none for now
	
	if (commands.size() != 2) {
		std::cerr << "Usage sp show [shortcut]" << std::endl;
		return 1;
	}

	std::string shortcut = commands[1];

	// Show the shortcut from the database
	std::string command = handler.db.get_shortcuts_table().select_shortcut_command(shortcut);
	if (not command.empty())
		std::cout << "echo \"Shortcut: " << shortcut << " | Command: " << command << "\"" << std::endl;
	else {
		std::cerr << "Shortcut " << shortcut << " not found" << std::endl;
		return 1;
	}

	return 0;
}


int Handler::Subcommands::handle_recall(Handler& handler, std::vector<std::string>& commands, std::vector<Flag>& flags) {
	RecallArgs ra = parse_recall_args(commands, 1);
	const int limit = handler.db.get_config().get_max_results();

	std::vector<std::string> matches;
	std::string scope_label;
	bool list = ra.list;

	if (ra.shortcuts) {
		// Sprite-specific: search shortcut command text (e.g. "every shortcut that uses cd").
		// A "shortcut | command" line isn't runnable, so always show these rather than execute.
		matches = handler.db.get_shortcuts_table().search_commands(ra.terms, limit);
		list = true;
	} else {
		std::string directory = ra.all ? "" : recall_resolve_dir(handler.db, ra.in_value);
		scope_label = directory;
		matches = handler.db.get_commands_table().recall(ra.terms, directory, ra.all, limit);
	}

	if (matches.empty()) {
		std::string query;
		for (size_t i = 0; i < ra.terms.size(); i++) {
			if (i > 0) query += " ";
			query += ra.terms[i];
		}
		std::string message = "sp: no recalled command";
		if (not query.empty()) message += " matching '" + query + "'";
		if (not ra.all and not scope_label.empty()) message += " in " + scope_label;
		std::cout << "echo " << shell_single_quote(message) << std::endl;
		return 1;
	}

	if (list) {
		// Print every candidate (literally, for inspection) rather than running anything
		for (const auto& match : matches)
			std::cout << "echo " << shell_single_quote(match) << std::endl;
	} else {
		// Quick-recall: paste the best match onto the prompt (zsh's `print -z`) so it appears
		// pre-filled and ready to run — pressing Enter again executes it. Nothing runs
		// automatically. (Tab first if you'd rather browse and pick a different match.)
		std::cout << "print -z -- " << shell_single_quote(matches[0]) << std::endl;
	}

	return 0;
}