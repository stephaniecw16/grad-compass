"""Check local module, asset, browser-suite, and Markdown links after file moves."""

from pathlib import Path
import re
import json
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
issues = []
count = 0
manifest_path = ROOT / "config/public-assets.json"
public_assets = (
    set(json.loads(manifest_path.read_text())) if manifest_path.exists() else None
)


def check(owner, value, base=None):
    global count
    parts = urlsplit(value)
    if parts.scheme or parts.netloc or not parts.path:
        return
    path = unquote(parts.path)
    target = (
        ROOT / path.lstrip("/")
        if path.startswith("/")
        else (base or owner.parent) / path
    )
    count += 1
    if not target.exists():
        issues.append(f"{owner.relative_to(ROOT)}: missing {value}")
    if (
        public_assets is not None
        and owner.relative_to(ROOT).as_posix() in public_assets
        and target.is_file()
    ):
        relative = target.resolve().relative_to(ROOT).as_posix()
        if relative not in public_assets and not relative.startswith("tests/"):
            issues.append(
                f"{owner.relative_to(ROOT)}: {relative} is missing from the hosted asset allowlist"
            )


imports = r"""(?:^\s*import(?:\s+(?:[\w$*{},\s]+?\bfrom))?\s*|\bimport\s*\(\s*)(['"])([^'"\n]+)\1"""
for owner in (ROOT / "src").rglob("*.js"):
    # Type-only JSDoc imports are checked by TypeScript and have no browser asset.
    text = re.sub(r"/\*\*[\s\S]*?\*/", "", owner.read_text())
    for _, value in re.findall(imports, text, re.MULTILINE):
        check(owner, value)
    for value in re.findall(
        r"""new URL\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url""", text
    ):
        check(owner, value)
        if (owner.parent / urlsplit(value).path).is_dir() and not value.endswith("/"):
            issues.append(
                f"{owner.relative_to(ROOT)}: directory URL needs trailing slash: {value}"
            )
for owner in [*ROOT.glob("*.html"), *(ROOT / "tests" / "browser").glob("*.html")]:
    text = owner.read_text()
    base_match = re.search(r"""<base\s+href=['"]([^'"]+)['"]""", text)
    base = (owner.parent / base_match[1]).resolve() if base_match else owner.parent
    for _, value in re.findall(imports, text, re.MULTILINE):
        check(owner, value, base)
    for value in re.findall(r"""(?:src|href)=['"]([^'"]+)['"]""", text):
        check(
            owner,
            value,
            base if not base_match or value != base_match[1] else owner.parent,
        )
    for value in re.findall(r"""fetch\(\s*['"]([^'"]+)['"]""", text):
        check(owner, value, base)
for entry in public_assets or []:
    if not (ROOT / entry).is_file():
        issues.append(f"Public asset does not exist: {entry}")
for owner in [*ROOT.glob("*.md"), *(ROOT / "docs").glob("*.md")]:
    for value in re.findall(r"\]\(([^)]+)\)", owner.read_text()):
        check(owner, value)
if issues:
    raise SystemExit("\n".join(issues))
print(f"{count} local module, asset, test and documentation paths verified.")
