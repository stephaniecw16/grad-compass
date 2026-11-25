"""Check, commit explicit changed files, then push the configured upstream."""

import argparse
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def git(*args, capture=False):
    return subprocess.run(
        ["git", *args],
        cwd=ROOT,
        check=True,
        text=True,
        stdout=subprocess.PIPE if capture else None,
    ).stdout


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--message", required=True)
    parser.add_argument("--node", help="Explicit Node 22+ executable for checks")
    parser.add_argument(
        "paths", nargs="+", help="Explicit repository-relative file paths after --"
    )
    args = parser.parse_args()
    if not args.message.strip():
        raise SystemExit("Provide a meaningful commit message.")
    if git("diff", "--cached", "--name-only", capture=True).strip():
        raise SystemExit(
            "Existing staged changes preserved. Review them before using this helper."
        )
    branch = git("symbolic-ref", "--quiet", "--short", "HEAD", capture=True).strip()
    # Refuse an initial push: authenticate, inspect remote history/visibility and set
    # an upstream first, following AGENTS.md.
    git(
        "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}", capture=True
    )
    remote = git("config", "--get", f"branch.{branch}.remote", capture=True).strip()
    urls = git(
        "remote", "get-url", "--push", "--all", remote, capture=True
    ).splitlines()
    allowed = {
        "https://github.com/stephaniecw16/grad-compass.git",
        "https://github.com/stephaniecw16/grad-compass",
        "git@github.com:stephaniecw16/grad-compass.git",
    }
    if len(urls) != 1 or urls[0] not in allowed:
        raise SystemExit(
            "Upstream push URL differs from the intended Grad Compass repository."
        )
    paths = set()
    for name in args.paths:
        path = ROOT / name
        if (
            Path(name).is_absolute()
            or ".." in Path(name).parts
            or path.is_symlink()
            or path.is_dir()
        ):
            raise SystemExit(
                "Use explicit repository-relative file paths; no directories or symlinks."
            )
        paths.add(Path(name).as_posix())
    changed = set(
        filter(None, git("diff", "--name-only", "-z", capture=True).split("\0"))
    )
    changed.update(
        filter(
            None,
            git("ls-files", "--others", "--exclude-standard", "-z", capture=True).split(
                "\0"
            ),
        )
    )
    if not changed:
        raise SystemExit("No changes to commit.")
    if changed - paths:
        raise SystemExit(
            "Other working changes exist. Preserve/review them before using this helper: "
            + ", ".join(sorted(changed - paths))
        )
    subprocess.run(
        [args.node or "node", "scripts/check.mjs"],
        cwd=ROOT,
        check=True,
    )
    git("add", "--", *sorted(paths))
    # If screening fails, leave the staged changes intact for review; never reset.
    subprocess.run(
        [sys.executable, "scripts/repository_audit.py", "--staged"],
        cwd=ROOT,
        check=True,
    )
    git("diff", "--cached", "--check")
    git("commit", "-m", args.message)
    print("Local commit created. Pushing to the configured upstream...", flush=True)
    target = git("config", "--get", f"branch.{branch}.merge", capture=True).strip()
    git("push", remote, f"HEAD:{target}")
    print("Commit and push completed.")


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as error:
        raise SystemExit(
            f"Git sync stopped (command exit {error.returncode}). Local files/commits are preserved; no force-push was attempted."
        )
