#ifndef SHORTCUTS_TABLE_H
#define SHORTCUTS_TABLE_H

#include "Table.h"

class ShortcutsTable : public Table {
public:
		ShortcutsTable(Database& db) : Table(db) {}

		void create_table() const override;
		void drop_table() const override;
		std::vector<std::string> query(const std::string& input) const override;
		void access(const std::string& input) override;

		void add_shortcut(const std::string& shortcut, const std::string& command);
		void delete_shortcut(const std::string& shortcut);
		std::vector<std::string> select_all_shortcuts() const;
		std::string select_shortcut_command(const std::string& shortcut) const;

		// Return "shortcut | command" for shortcuts whose command contains every term
		// (case-insensitive). Used by `sp recall --shortcuts`.
		std::vector<std::string> search_commands(const std::vector<std::string>& terms, int limit) const;
};

#endif // SHORTCUTS_TABLE_H