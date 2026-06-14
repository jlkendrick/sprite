#ifndef COMMANDS_TABLE_H
#define COMMANDS_TABLE_H

#include "Table.h"

#include <string>
#include <vector>

// Stores commands the user has run, keyed by the directory they were run in, so that a
// command can later be recalled by fuzzy-searching the commands previously run in a directory.
class CommandsTable : public Table {
public:
		CommandsTable(Database& db) : Table(db) {}

		void create_table() const override;
		void drop_table() const override;
		std::vector<std::string> query(const std::string& input) const override;
		void access(const std::string& input) override;

		// Record a command run in `directory`. Re-running the same command in the same
		// directory bumps its usage instead of creating a duplicate row (UPSERT).
		void log(const std::string& command, const std::string& directory, int exit_code);

		// Fuzzy-search logged commands: every term must appear (case-insensitive substring).
		// Scoped to `directory` unless `all` is true. Ranked most-recent-then-most-used.
		std::vector<std::string> recall(const std::vector<std::string>& terms,
		                                const std::string& directory, bool all, int limit) const;
};

#endif // COMMANDS_TABLE_H
