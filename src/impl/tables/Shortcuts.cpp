#include "tables/Shortcuts.h"
#include "Database.h"

#include <cctype>


void ShortcutsTable::create_table() const {
	try {
		db << "BEGIN TRANSACTION;";
		
		db << "CREATE TABLE IF NOT EXISTS shortcuts ("
		"id INTEGER PRIMARY KEY AUTOINCREMENT, "
		"shortcut TEXT NOT NULL, "
		"command TEXT NOT NULL, "
		"last_accessed INTEGER NOT NULL, "
		"access_count INTEGER NOT NULL DEFAULT 0"
		");";
		db << "CREATE UNIQUE INDEX IF NOT EXISTS idx_shortcut ON shortcuts (shortcut);";
		db << "CREATE INDEX IF NOT EXISTS idx_shortcuts_recency ON shortcuts (shortcut, last_accessed DESC);";
		db << "CREATE INDEX IF NOT EXISTS idx_shortcuts_freq ON shortcuts (shortcut, access_count DESC);";
		
		db << "COMMIT;";
	} catch (const sqlite::sqlite_exception& e) {
		db << "ROLLBACK;";
		std::cerr << "Error creating shortcuts table: " << e.what() << std::endl;
	}
}


void ShortcutsTable::drop_table() const {
	db << "DROP TABLE IF EXISTS shortcuts;";
}


std::vector<std::string> ShortcutsTable::query(const std::string& input) const {
	// We only do exact matches for shortcuts (might change this in the future)
	std::vector<std::string> results;
	try {
		db << "SELECT command FROM shortcuts WHERE shortcut = ? LIMIT 1;" << input >> [&](std::string command) {
			results.push_back(command);
		};
	} catch (const sqlite::sqlite_exception& e) {
		std::cerr << "Error querying shortcuts: " << e.what() << std::endl;
	}
	return results;
}


void ShortcutsTable::access(const std::string& command) {
	// This function is a no-op for shortcuts (for now)
	return;
}


void ShortcutsTable::add_shortcut(const std::string& shortcut, const std::string& command) {
	long long time_now = Time::now();

	try {
		db << "INSERT INTO shortcuts (shortcut, command, last_accessed) VALUES (?, ?, ?);"
			<< shortcut
			<< command
			<< time_now;
	} catch (const sqlite::sqlite_exception& e) {
		std::cerr << "Error adding shortcut to database: " << e.what() << std::endl;
	}
}


void ShortcutsTable::delete_shortcut(const std::string& shortcut) {
	try {
		db << "DELETE FROM shortcuts WHERE shortcut = ?;"
			<< shortcut;
	} catch (const sqlite::sqlite_exception& e) {
		std::cerr << "Error deleting shortcut from database: " << e.what() << std::endl;
	}
}


std::vector<std::string> ShortcutsTable::select_all_shortcuts() const {
	std::vector<std::string> shortcuts;
	try {
		db << "SELECT shortcut FROM shortcuts;" >> [&](std::string shortcut) {
			shortcuts.push_back(shortcut);
		};
	} catch (const sqlite::sqlite_exception& e) {
		std::cerr << "Error listing shortcuts from database: " << e.what() << std::endl;
	}
	return shortcuts;
}


std::vector<std::string> ShortcutsTable::search_commands(const std::vector<std::string>& terms, int limit) const {
	// The shortcuts table is tiny, so scan it and filter in C++ (case-insensitive substring,
	// AND across terms) rather than building dynamic SQL.
	auto to_lower = [](std::string s) {
		for (char& c : s) c = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
		return s;
	};
	std::vector<std::string> lowered_terms;
	for (const auto& t : terms) lowered_terms.push_back(to_lower(t));

	std::vector<std::string> results;
	try {
		db << "SELECT shortcut, command FROM shortcuts ORDER BY shortcut;"
		   >> [&](std::string shortcut, std::string command) {
			if (static_cast<int>(results.size()) >= limit)
				return;
			std::string haystack = to_lower(command);
			for (const auto& term : lowered_terms) {
				if (haystack.find(term) == std::string::npos)
					return;
			}
			results.push_back(shortcut + " | " + command);
		};
	} catch (const sqlite::sqlite_exception& e) {
		std::cerr << "Error searching shortcuts: " << e.what() << std::endl;
	}
	return results;
}


std::string ShortcutsTable::select_shortcut_command(const std::string& shortcut) const {
	std::string command = "";
	try {
		db << "SELECT command FROM shortcuts WHERE shortcut = ? LIMIT 1;"
			<< shortcut >> [&](std::string cmd) {
			command = cmd;
		};
	} catch (const sqlite::sqlite_exception& e) {
		std::cerr << "Error selecting shortcut command from database: " << e.what() << std::endl;
	}

	return command;
}