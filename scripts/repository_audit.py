"""Screen Git-tracked (or staged) files for private artifacts and common secrets."""

import argparse
from pathlib import Path, PurePosixPath
import re
import subprocess

# No uploaded documents or admissions fixtures belong in the student-site repository.
FIXTURES = set()

PRIVATE_DIRS = {
    "uploads",
    "exports",
    "private",
    "backups",
    "artifacts",
    ".aws",
    ".codex",
    ".vercel",
    "node_modules",
    "__pycache__",
}
PRIVATE_SUFFIXES = {
    ".pdf",
    ".docx",
    ".zip",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".db",
    ".sqlite",
    ".sqlite3",
    ".pem",
    ".key",
    ".p12",
    ".pfx",
    ".pyc",
}
SECRET_PATTERNS = (
    rb"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----",
    rb"gh[pousr]_[A-Za-z0-9]{30,}",
    rb"github_pat_[A-Za-z0-9_]{50,}",
    rb"AKIA[0-9A-Z]{16}",
    rb"sk-(?:proj-)?[A-Za-z0-9_-]{40,}",
)


def audit(root, staged=False):
    names = (
        subprocess.check_output(["git", "ls-files", "-z"], cwd=root)
        .decode()
        .split("\0")
    )
    issues = []
    count = 0
    for name in filter(None, names):
        path = PurePosixPath(name)
        count += 1
        if (
            set(path.parts) & PRIVATE_DIRS
            or path.name.startswith(
                ("credentials", "secrets", "gradapp-profile", "preview-")
            )
            or path.name.endswith("-receipt.json")
            or (path.name.startswith(".env") and path.name != ".env.example")
            or (path.suffix.lower() in PRIVATE_SUFFIXES and name not in FIXTURES)
        ):
            issues.append((name, "private artifact or unreviewed attachment"))
        if (root / name).is_symlink():
            issues.append((name, "symlink requires manual review"))
            continue
        # Read index bytes for pre-commit audits; never print matched secret content.
        data = (
            subprocess.check_output(["git", "show", ":" + name], cwd=root)
            if staged
            else (root / name).read_bytes()
        )
        if any(re.search(pattern, data) for pattern in SECRET_PATTERNS):
            issues.append((name, "possible credential or private key"))
    return count, issues


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--staged",
        action="store_true",
        help="Inspect index contents rather than working files",
    )
    args = parser.parse_args()
    root = Path(
        subprocess.check_output(
            ["git", "rev-parse", "--show-toplevel"], text=True
        ).strip()
    )
    count, issues = audit(root, args.staged)
    for name, reason in issues:
        print(f"{name}: {reason}")
    if not count or issues:
        raise SystemExit("Repository audit failed; review files before committing.")
    print(
        f"Repository audit passed ({count} files; reviewed fictional attachments only)."
    )


if __name__ == "__main__":
    main()
