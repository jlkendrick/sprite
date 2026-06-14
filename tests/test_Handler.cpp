#include <gtest/gtest.h>

#include <filesystem>

#include "Database.h"
#include "Handler.h"
#include "utils/TempConfigFile.hpp"

using namespace std;
using ConfigArgs = TempConfigFile::Args;

class HandlerTest : public ::testing::Test {
protected:
	void SetUp() override {
		ConfigArgs args;
		args.db_path = (filesystem::temp_directory_path() / "sprite_handler_test.db").string();
		filesystem::remove(args.db_path);
		temp_config = make_unique<TempConfigFile>(args);
		config = make_unique<Config>(temp_config->get_path());
		db = make_unique<Database>(*config);
		db->build(config->get_init_path());
		handler = make_unique<Handler>(*db);
	}
	void TearDown() override {
		string db_path = config->get_db_path();
		handler.reset();
		db.reset();
		config.reset();
		temp_config.reset();
		filesystem::remove(db_path);
	}

	// Runs handle_enter and returns {return_code, stdout_output}
	pair<int, string> run_enter(vector<string> commands, vector<Flag> flags = {}) {
		testing::internal::CaptureStdout();
		testing::internal::CaptureStderr();
		int ret = handler->handle_enter(commands, flags);
		testing::internal::GetCapturedStderr();
		return {ret, testing::internal::GetCapturedStdout()};
	}

	unique_ptr<TempConfigFile> temp_config;
	unique_ptr<Config> config;
	unique_ptr<Database> db;
	unique_ptr<Handler> handler;
};

// ---- Navigation ----

TEST_F(HandlerTest, EnterNoArgs) {
	auto [ret, output] = run_enter({}, {});
	EXPECT_EQ(ret, 0);
	EXPECT_EQ(output, "cd ~\n");
}

TEST_F(HandlerTest, EnterPartialPath) {
	string mockfs = config->get_init_path();
	auto [ret, output] = run_enter({"1"});
	EXPECT_EQ(ret, 0);
	EXPECT_TRUE(output.starts_with("cd " + mockfs));
	EXPECT_TRUE(output.ends_with("/1\n"));
}

TEST_F(HandlerTest, EnterFullAbsolutePath) {
	auto [ret, output] = run_enter({"/tmp"});
	EXPECT_EQ(ret, 0);
	EXPECT_EQ(output, "cd /tmp\n");
}

TEST_F(HandlerTest, EnterUnknownPartial) {
	auto [ret, output] = run_enter({"zzz_no_match"});
	EXPECT_EQ(ret, 0);
	EXPECT_EQ(output, "cd zzz_no_match\n");
}

TEST_F(HandlerTest, EnterVersionFlag) {
	auto [ret, output] = run_enter({}, {{"", "version", ""}});
	EXPECT_EQ(ret, 0);
	EXPECT_EQ(output, "echo Sprite version 1.0.1\n");
}

// Shortcut takes priority over path lookup; no last token so command gets a trailing space
TEST_F(HandlerTest, EnterShortcutResolution) {
	db->get_shortcuts_table().add_shortcut("gs", "git status");
	auto [ret, output] = run_enter({"gs"});
	EXPECT_EQ(ret, 0);
	EXPECT_EQ(output, "git status \n");
}

// ---- Subcommands ----

TEST_F(HandlerTest, AddShortcut) {
	auto [ret, output] = run_enter({"add", "gs", "git status"});
	EXPECT_EQ(ret, 0);
	EXPECT_NE(output.find("echo Shortcut"), string::npos);
	// Verify the shortcut was persisted to the DB
	auto results = db->get_shortcuts_table().query("gs");
	ASSERT_EQ(results.size(), 1u);
	EXPECT_EQ(results[0], "git status");
}

TEST_F(HandlerTest, AddShortcutTooFewArgs) {
	auto [ret, output] = run_enter({"add", "gs"});
	EXPECT_EQ(ret, 1);
}

TEST_F(HandlerTest, DeleteShortcut) {
	db->get_shortcuts_table().add_shortcut("gs", "git status");
	auto [ret, output] = run_enter({"delete", "gs"});
	EXPECT_EQ(ret, 0);
	EXPECT_TRUE(db->get_shortcuts_table().query("gs").empty());
}

TEST_F(HandlerTest, DeleteShortcutWrongArgCount) {
	auto [ret, output] = run_enter({"delete"});
	EXPECT_EQ(ret, 1);
}

TEST_F(HandlerTest, ListShortcuts) {
	db->get_shortcuts_table().add_shortcut("gs", "git status");
	db->get_shortcuts_table().add_shortcut("la", "ls -la");
	auto [ret, output] = run_enter({"list"});
	EXPECT_EQ(ret, 0);
	EXPECT_NE(output.find("gs"), string::npos);
	EXPECT_NE(output.find("la"), string::npos);
}

TEST_F(HandlerTest, ShowShortcut) {
	db->get_shortcuts_table().add_shortcut("gs", "git status");
	auto [ret, output] = run_enter({"show", "gs"});
	EXPECT_EQ(ret, 0);
	EXPECT_NE(output.find("gs"), string::npos);
	EXPECT_NE(output.find("git status"), string::npos);
}

TEST_F(HandlerTest, ShowMissingShortcut) {
	auto [ret, output] = run_enter({"show", "missing"});
	EXPECT_EQ(ret, 1);
}

TEST_F(HandlerTest, ShowWrongArgCount) {
	auto [ret, output] = run_enter({"show"});
	EXPECT_EQ(ret, 1);
}

// ---- Tab completion ----

TEST_F(HandlerTest, TabCompletionPartial) {
	string mockfs = config->get_init_path();
	vector<string> args = {"sp-binary", "--tab", "sp", "1"};
	vector<const char*> argv_ptrs;
	for (const auto& a : args) argv_ptrs.push_back(a.c_str());

	testing::internal::CaptureStdout();
	testing::internal::CaptureStderr();
	int ret = handler->handle_tab(argv_ptrs.size(), const_cast<char**>(argv_ptrs.data()));
	testing::internal::GetCapturedStderr();
	string output = testing::internal::GetCapturedStdout();

	EXPECT_EQ(ret, 0);
	EXPECT_NE(output.find(mockfs + "/1"), string::npos);
}

TEST_F(HandlerTest, TabCompletionTooFewArgs) {
	const char* argv[] = {"sp-binary", "--tab", "sp"};
	testing::internal::CaptureStderr();
	int ret = handler->handle_tab(3, const_cast<char**>(argv));
	testing::internal::GetCapturedStderr();
	EXPECT_EQ(ret, 1);
}

// ---- Command recall ----
// recall is passed through raw, so flags (--in/--all/--list/--shortcuts) are query tokens here.
// Use an explicit absolute --in dir so scoping is deterministic (no dependence on $PWD).

// Enter = quick-recall: paste the best match onto the prompt (print -z) for review, not execute.
TEST_F(HandlerTest, RecallPastesTopMatchToPrompt) {
	db->get_commands_table().log("cmake -S . -B build", "/test/dir", 0);
	auto [ret, output] = run_enter({"recall", "--in", "/test/dir", "cmake"});
	EXPECT_EQ(ret, 0);
	EXPECT_EQ(output, "print -z -- 'cmake -S . -B build'\n");
}

// A flag-bearing command (e.g. selected via Tab) round-trips through `sp recall` without the
// flags being parsed as Sprite flags, and is pasted back verbatim.
TEST_F(HandlerTest, RecallRoundTripsCommandWithFlags) {
	db->get_commands_table().log("git log --oneline -10", "/test/dir", 0);
	auto [ret, output] = run_enter({"recall", "--in", "/test/dir", "git", "log", "--oneline", "-10"});
	EXPECT_EQ(ret, 0);
	EXPECT_EQ(output, "print -z -- 'git log --oneline -10'\n");
}

// Single quotes in a pasted command are escaped so the print -z line evals safely
TEST_F(HandlerTest, RecallPasteEscapesSingleQuotes) {
	db->get_commands_table().log("echo 'hi there'", "/test/dir", 0);
	auto [ret, output] = run_enter({"recall", "--in", "/test/dir", "hi"});
	EXPECT_EQ(ret, 0);
	EXPECT_EQ(output, "print -z -- 'echo '\\''hi there'\\'''\n");
}

TEST_F(HandlerTest, RecallNoMatch) {
	auto [ret, output] = run_enter({"recall", "--in", "/test/dir", "zzz_no_match"});
	EXPECT_EQ(ret, 1);
	EXPECT_NE(output.find("no recalled command"), string::npos);
}

TEST_F(HandlerTest, RecallListEmitsEchoPerMatch) {
	db->get_commands_table().log("one", "/test/dir", 0);
	db->get_commands_table().log("two", "/test/dir", 0);
	auto [ret, output] = run_enter({"recall", "--in", "/test/dir", "--list"});
	EXPECT_EQ(ret, 0);
	EXPECT_NE(output.find("echo 'one'"), string::npos);
	EXPECT_NE(output.find("echo 'two'"), string::npos);
}

TEST_F(HandlerTest, RecallShortcutsSearchesShortcutCommands) {
	db->get_shortcuts_table().add_shortcut("cc", "cd {} && claude");
	db->get_shortcuts_table().add_shortcut("code", "code");
	auto [ret, output] = run_enter({"recall", "cd", "--shortcuts"});
	EXPECT_EQ(ret, 0);
	EXPECT_NE(output.find("cc | cd {} && claude"), string::npos);
	EXPECT_EQ(output.find("code | code"), string::npos);  // "code" command has no "cd"
}

// Tab = browse: handle_tab returns the matching commands for the completion menu
TEST_F(HandlerTest, TabRecallListsMatchingCommands) {
	db->get_commands_table().log("cmake -S . -B build", "/test/dir", 0);
	db->get_commands_table().log("cmake --version", "/test/dir", 0);
	vector<string> args = {"sp-binary", "--tab", "sp", "recall", "--in", "/test/dir", "cmake"};
	vector<const char*> argv_ptrs;
	for (const auto& a : args) argv_ptrs.push_back(a.c_str());

	testing::internal::CaptureStdout();
	testing::internal::CaptureStderr();
	int ret = handler->handle_tab(argv_ptrs.size(), const_cast<char**>(argv_ptrs.data()));
	testing::internal::GetCapturedStderr();
	string output = testing::internal::GetCapturedStdout();

	EXPECT_EQ(ret, 0);
	EXPECT_NE(output.find("cmake -S . -B build"), string::npos);
	EXPECT_NE(output.find("cmake --version"), string::npos);
}
