#include <gtest/gtest.h>

#include <algorithm>
#include <filesystem>

#include "Database.h"
#include "utils/TempConfigFile.hpp"

using namespace std;
using ConfigArgs = TempConfigFile::Args;

class CommandsTest : public ::testing::Test {
protected:
	void SetUp() override {
		ConfigArgs args;
		args.db_path = (filesystem::temp_directory_path() / "sprite_commands_test.db").string();
		filesystem::remove(args.db_path);
		temp_config = make_unique<TempConfigFile>(args);
		config = make_unique<Config>(temp_config->get_path());
		db = make_unique<Database>(*config);
		// No build() — the command log is independent of the filesystem scan
	}
	void TearDown() override {
		string db_path = config->get_db_path();
		db.reset();
		config.reset();
		temp_config.reset();
		filesystem::remove(db_path);
	}

	CommandsTable& commands() { return db->get_commands_table(); }

	unique_ptr<TempConfigFile> temp_config;
	unique_ptr<Config> config;
	unique_ptr<Database> db;
};

// ---- Logging / upsert ----

TEST_F(CommandsTest, LogAndRecall) {
	commands().log("cmake -S . -B build", "/proj/sprite", 0);
	auto results = commands().recall({"cmake"}, "/proj/sprite", false, 10);
	ASSERT_EQ(results.size(), 1u);
	EXPECT_EQ(results[0], "cmake -S . -B build");
}

TEST_F(CommandsTest, ReLogBumpsInsteadOfDuplicating) {
	commands().log("git status", "/proj/sprite", 0);
	commands().log("git status", "/proj/sprite", 0);
	commands().log("git status", "/proj/sprite", 1);
	// Still a single row for (command, directory)
	size_t count = 0;
	*db << "SELECT COUNT(*) FROM commands WHERE command = ? AND directory = ?;"
	    << "git status" << "/proj/sprite" >> count;
	EXPECT_EQ(count, 1u);
	// use_count incremented across the three logs
	int use_count = 0;
	*db << "SELECT use_count FROM commands WHERE command = ? AND directory = ?;"
	    << "git status" << "/proj/sprite" >> use_count;
	EXPECT_EQ(use_count, 3);
}

TEST_F(CommandsTest, EmptyCommandOrDirIsNotLogged) {
	commands().log("", "/proj/sprite", 0);
	commands().log("ls", "", 0);
	EXPECT_TRUE(commands().recall({}, "/proj/sprite", true, 10).empty());
}

// ---- Directory scoping ----

TEST_F(CommandsTest, RecallIsScopedToDirectory) {
	commands().log("make", "/proj/a", 0);
	commands().log("make", "/proj/b", 0);
	auto in_a = commands().recall({"make"}, "/proj/a", false, 10);
	ASSERT_EQ(in_a.size(), 1u);
	// --all ignores the directory scope and returns both
	auto all = commands().recall({"make"}, "", true, 10);
	EXPECT_EQ(all.size(), 2u);
}

TEST_F(CommandsTest, RecallNoTermsReturnsDirectoryCommands) {
	commands().log("one", "/proj/a", 0);
	commands().log("two", "/proj/a", 0);
	commands().log("elsewhere", "/proj/b", 0);
	auto results = commands().recall({}, "/proj/a", false, 10);
	EXPECT_EQ(results.size(), 2u);
}

// ---- Matching ----

TEST_F(CommandsTest, MultiTermIsAnd) {
	commands().log("cmake -S . -B build", "/proj", 0);
	commands().log("cmake --version", "/proj", 0);
	// Both terms must appear: only the first command matches
	auto results = commands().recall({"cmake", "build"}, "/proj", false, 10);
	ASSERT_EQ(results.size(), 1u);
	EXPECT_EQ(results[0], "cmake -S . -B build");
}

TEST_F(CommandsTest, MatchIsCaseInsensitive) {
	commands().log("Docker compose up", "/proj", 0);
	auto results = commands().recall({"docker"}, "/proj", false, 10);
	ASSERT_EQ(results.size(), 1u);
}

TEST_F(CommandsTest, WildcardsInTermsAreLiteral) {
	commands().log("echo 100% done", "/proj", 0);
	commands().log("echo anything here", "/proj", 0);
	// '%' must match a literal percent, not act as a LIKE wildcard
	auto results = commands().recall({"100%"}, "/proj", false, 10);
	ASSERT_EQ(results.size(), 1u);
	EXPECT_EQ(results[0], "echo 100% done");
}

// ---- Ranking ----

TEST_F(CommandsTest, RankedByRecencyThenFrequency) {
	commands().log("first", "/proj", 0);
	commands().log("second", "/proj", 0);
	// "first" used again -> most recent -> should rank ahead of "second"
	commands().log("first", "/proj", 0);
	auto results = commands().recall({}, "/proj", false, 10);
	ASSERT_EQ(results.size(), 2u);
	EXPECT_EQ(results[0], "first");
	EXPECT_EQ(results[1], "second");
}

TEST_F(CommandsTest, LimitIsRespected) {
	for (int i = 0; i < 5; i++)
		commands().log("cmd-" + to_string(i), "/proj", 0);
	auto results = commands().recall({}, "/proj", false, 3);
	EXPECT_EQ(results.size(), 3u);
}
