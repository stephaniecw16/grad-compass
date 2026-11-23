"""Exercise commit/push safeguards in disposable repositories, never on GitHub."""

import importlib.util
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

SCRIPTS = Path(__file__).resolve().parent


def load(name):
    spec = importlib.util.spec_from_file_location(name, SCRIPTS / (name + ".py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class GitToolsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.git("init", "-b", "main")
        self.git("config", "user.name", "Fictional Test")
        self.git("config", "user.email", "fictional@example.invalid")
        (self.root / "scripts").mkdir()
        shutil.copy(SCRIPTS / "repository_audit.py", self.root / "scripts")
        (self.root / "scripts/check.mjs").write_text('console.log("Disposable check runner")\n')
        (self.root / "README.md").write_text("Baseline\n")
        self.git("add", ".")
        self.git("commit", "-m", "Test baseline")
        self.git(
            "remote", "add", "origin", "https://github.com/stephaniecw16/gradapp-student.git"
        )
        self.git("update-ref", "refs/remotes/origin/main", "HEAD")
        self.git("config", "branch.main.remote", "origin")
        self.git("config", "branch.main.merge", "refs/heads/main")
        self.sync = load("sync_git")
        self.sync.ROOT = self.root
        self.audit = load("repository_audit")

    def git(self, *args):
        return (
            subprocess.check_output(
                ["git", *args], cwd=self.root, stderr=subprocess.DEVNULL
            )
            .decode()
            .strip()
        )

    def run_sync(self, paths=("README.md",)):
        with patch.object(
            sys, "argv", ["sync_git.py", "--message", "Test change", "--", *paths]
        ):
            self.sync.main()

    def test_existing_staging_preserved(self):
        (self.root / "README.md").write_text("Changed\n")
        self.git("add", "README.md")
        with self.assertRaisesRegex(SystemExit, "Existing staged"):
            self.run_sync()
        self.assertEqual(self.git("diff", "--cached", "--name-only"), "README.md")

    def test_other_changes_block_commit(self):
        (self.root / "other.js").write_text("const other = 1;\n")
        with self.assertRaisesRegex(SystemExit, "Other working changes"):
            self.run_sync()
        self.assertEqual(self.git("log", "-1", "--format=%s"), "Test baseline")

    def test_missing_upstream_blocks_sync(self):
        self.git("config", "--unset", "branch.main.merge")
        with self.assertRaises(subprocess.CalledProcessError):
            self.run_sync()
        self.assertEqual(self.git("log", "-1", "--format=%s"), "Test baseline")

    def test_wrong_remote_blocks_sync(self):
        self.git("remote", "set-url", "origin", "https://example.invalid/unrelated.git")
        with self.assertRaisesRegex(SystemExit, "push URL differs"):
            self.run_sync()

    def test_audit_private_file_and_staged_secret(self):
        (self.root / "real-letter.pdf").write_bytes(b"%PDF-fictional-audit-fixture")
        (self.root / "token.txt").write_text("gh" + "p_" + "A" * 36)
        self.git("add", ".")
        (self.root / "token.txt").write_text("Working file looks harmless")
        _, issues = self.audit.audit(self.root, staged=True)
        self.assertEqual({name for name, _ in issues}, {"real-letter.pdf", "token.txt"})

    def test_checked_commit_push_and_failure_preserves_commit(self):
        (self.root / "README.md").write_text("Changed\n")
        original_git = self.sync.git
        pushes = []

        def intercept(*args, **kwargs):
            if args[0] == "push":
                pushes.append(args)
                raise subprocess.CalledProcessError(1, ["git", *args])
            return original_git(*args, **kwargs)

        with patch.object(self.sync, "git", side_effect=intercept):
            with self.assertRaises(subprocess.CalledProcessError):
                self.run_sync()
        self.assertEqual(pushes, [("push", "origin", "HEAD:refs/heads/main")])
        self.assertEqual(self.git("log", "-1", "--format=%s"), "Test change")
        self.assertEqual(self.git("status", "--porcelain"), "")

    def test_failed_checks_prevent_commit(self):
        (self.root / "scripts/check.mjs").write_text("process.exit(1)\n")
        with self.assertRaises(subprocess.CalledProcessError):
            self.run_sync(("scripts/check.mjs",))
        self.assertEqual(self.git("log", "-1", "--format=%s"), "Test baseline")
        self.assertEqual(self.git("diff", "--cached", "--name-only"), "")


if __name__ == "__main__":
    unittest.main()
