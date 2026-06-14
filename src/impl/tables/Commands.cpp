#include "tables/Commands.h"
#include "Database.h"
#include "utils/Helpers.h"


void CommandsTable::create_table() const {
	try {
		db << "BEGIN TRANSACTION;";

		db << "CREATE TABLE IF NOT EXISTS commands ("
		"id INTEGER PRIMARY KEY AUTOINCREMENT, "
		"command TEXT NOT NULL, "
		"directory TEXT NOT NULL, "
		"last_used INTEGER NOT NULL, "
		"use_count INTEGER NOT NULL DEFAULT 1, "
		"exit_code INTEGER"
		");";
		// Uniqueness on (command, directory) so re-running a command upserts rather than duplicates
		db << "CREATE UNIQUE INDEX IF NOT EXISTS idx_cmd_dir ON commands (command, directory);";
		db << "CREATE INDEX IF NOT EXISTS idx_cmd_dir_recency ON commands (directory, last_used DESC);";

		db << "COMMIT;";
	} catch (const sqlite::sqlite_exception& e) {
		db << "ROLLBACK;";
		std::cerr << "Error creating commands table: " << e.what() << std::endl;
	}
}


void CommandsTable::drop_table() const {
	db << "DROP TABLE IF EXISTS commands;";
}


// Single-term, directory-agnostic search. The recall subcommand uses recall() directly;
// this satisfies the Table interface and is handy for ad-hoc lookups.
std::vector<std::string> CommandsTable::query(const std::string& input) const {
	return recall({input}, "", true, db.get_config().get_max_results());
}


// Usage is recorded by the recorder hook (--log), not when a command is surfaced by recall.
void CommandsTable::access(const std::string& input) {
	return;
}


void CommandsTable::log(const std::string& command, const std::string& directory, int exit_code) {
	if (command.empty() or directory.empty())
		return;

	long long time_now = Time::now();
	try {
		db << "INSERT INTO commands (command, directory, last_used, use_count, exit_code) "
		      "VALUES (?, ?, ?, 1, ?) "
		      "ON CONFLICT(command, directory) DO UPDATE SET "
		      "last_used = excluded.last_used, "
		      "use_count = use_count + 1, "
		      "exit_code = excluded.exit_code;"
		   << command << directory << time_now << exit_code;
	} catch (const sqlite::sqlite_exception& e) {
		std::cerr << "Error logging command: " << e.what() << std::endl;
	}
}


// Escape LIKE wildcards so a literal '%' or '_' in a search term matches itself (we pair this
// with `ESCAPE '\'` in the query).
static std::string like_escape(const std::string& term) {
	std::string out;
	out.reserve(term.size() + 2);
	for (char c : term) {
		if (c == '\\' or c == '%' or c == '_')
			out += '\\';
		out += c;
	}
	return out;
}


std::vector<std::string> CommandsTable::recall(const std::vector<std::string>& terms,
                                               const std::string& directory, bool all, int limit) const {
	std::vector<std::string> results;

	// Build "WHERE [directory = ?] AND command LIKE ? ESCAPE '\' AND ..." dynamically so each
	// term is an independent (case-insensitive) substring constraint.
	std::string sql = "SELECT command FROM commands WHERE ";
	bool first = true;
	if (not all) {
		sql += "directory = ?";
		first = false;
	}
	for (size_t i = 0; i < terms.size(); ++i) {
		sql += first ? "" : " AND ";
		sql += "command LIKE ? ESCAPE '\\'";
		first = false;
	}
	if (first)
		sql += "1";  // No directory scope and no terms: match everything
	sql += " ORDER BY last_used DESC, use_count DESC LIMIT ?;";

	try {
		auto stmt = db << sql;
		if (not all)
			stmt << directory;
		for (const auto& term : terms)
			stmt << ("%" + like_escape(term) + "%");
		stmt << limit;
		stmt >> [&](std::string command) { results.push_back(command); };
	} catch (const sqlite::sqlite_exception& e) {
		std::cerr << "Error recalling commands: " << e.what() << std::endl;
	}

	return results;
}
