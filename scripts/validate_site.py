"""Offline checks for the static portfolio. No third-party dependencies."""

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys


ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.references = []
        self.tags = Counter()
        self.description = False
        self.language = False
        self.title_parts = []
        self.in_title = False
        self.source = path.read_text(encoding="utf-8")
        self.feed(self.source)
        self.close()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags[tag] += 1
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "html":
            self.language = attrs.get("lang") == "en"
        if tag == "title":
            self.in_title = True
        if tag == "meta" and attrs.get("name") == "description":
            self.description = bool(attrs.get("content", "").strip())
        for attribute in ("href", "src"):
            if attrs.get(attribute):
                self.references.append(attrs[attribute])

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title_parts.append(data)


def main():
    errors = []
    pages = {path.resolve(): Page(path) for path in ROOT.glob("*.html")}
    if not pages:
        errors.append("No HTML pages found")
    checked = 0
    for path, page in pages.items():
        label = path.name
        for tag in ("html", "head", "body", "main", "h1", "title"):
            if page.tags[tag] != 1:
                errors.append(f"{label}: expected exactly one {tag}, got {page.tags[tag]}")
        if not page.language or not page.description or not "".join(page.title_parts).strip():
            errors.append(f"{label}: missing English language, description, or title")
        for identifier, count in Counter(page.ids).items():
            if count > 1:
                errors.append(f"{label}: duplicate ID {identifier!r}")
        for reference in page.references:
            url = urlsplit(reference)
            if url.scheme or url.netloc:
                continue
            checked += 1
            local = unquote(url.path)
            if local.startswith("/"):
                target = (ROOT / local.lstrip("/")).resolve()
            elif local:
                target = (path.parent / local).resolve()
            else:
                target = path
            if not target.is_relative_to(ROOT):
                errors.append(f"{label}: reference escapes website: {reference}")
                continue
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                errors.append(f"{label}: missing local target: {reference}")
                continue
            if url.fragment and target.suffix.lower() == ".html":
                target_page = pages.get(target)
                if target_page is None:
                    target_page = Page(target)
                if unquote(url.fragment) not in target_page.ids:
                    errors.append(f"{label}: missing fragment: {reference}")

    required = {
        "index.html": ("Tunisia", "Solara", "solara.html", "Solarna Systems", "SolarnaPV", "The MSc programme is currently paused", "the degree was not conferred"),
        "education.html": ("The programme is currently paused", "the MSc degree was not conferred", "No MSc thesis manuscript or PDF is publicly distributed"),
        "solara.html": ("proprietary and in development", "source code is not publicly distributed", "development goal", "https://usesolara.pages.dev/"),
    }
    for name, phrases in required.items():
        page = pages.get((ROOT / name).resolve())
        if page is None:
            errors.append(f"Missing required page: {name}")
            continue
        normalized = " ".join(page.source.split()).lower()
        for phrase in phrases:
            if phrase.lower() not in normalized:
                errors.append(f"{name}: missing expected wording: {phrase}")
        if name == "education.html":
            for stale in (
                "2024-present", "current programme", "current thesis",
                "thesis project is in progress", "degree is not yet complete",
            ):
                if stale in normalized:
                    errors.append(f"{name}: outdated education wording: {stale}")

    education = pages.get((ROOT / "education.html").resolve())
    if education:
        for marker in (
            'class="case-page project-detail education-page"',
            'href="#main-content"', 'id="main-content"', 'aria-current="page"',
        ):
            if marker not in education.source:
                errors.append(f"education.html: missing layout/accessibility marker: {marker}")
        if education.tags["details"] != 2 or education.tags["summary"] != 2:
            errors.append("education.html: expected two coursework disclosures with summaries")
        if education.source.count('class="education-results"') != 2:
            errors.append("education.html: missing coursework disclosure styling")
        if education.source.count("</details>") != 2:
            errors.append("education.html: coursework disclosures must close")
        bachelors = education.source.find('id="bachelors"')
        masters = education.source.find('id="masters"')
        if bachelors < 0 or masters < 0 or bachelors >= masters:
            errors.append("education.html: completed bachelor's degree must precede master's studies")

    project_pages = ("solara.html", "solarna.html", "biasforge.html", "cynth-v1.html")
    for name in project_pages:
        page = pages.get((ROOT / name).resolve())
        if page is None:
            errors.append(f"Missing project page: {name}")
        elif 'class="case-page project-detail"' not in page.source:
            errors.append(f"{name}: missing project-detail styling opt-in")

    shared_css = (ROOT / "styles.css").read_text(encoding="utf-8")
    if ".project-detail {" not in shared_css:
        errors.append("styles.css: missing scoped project-page styles")
    solarna = pages.get((ROOT / "solarna.html").resolve())
    if solarna and "not client projects or construction documents" not in solarna.source:
        errors.append("solarna.html: retain the illustrative-example qualification")
    biasforge = pages.get((ROOT / "biasforge.html").resolve())
    if biasforge:
        for stale in ("BF-0.8.1a", "1,000 founding users", "11 tools", "4 bundles"):
            if stale in biasforge.source:
                errors.append(f"biasforge.html: stale commercial claim: {stale}")

    homepage = pages.get((ROOT / "index.html").resolve())
    if homepage:
        expected_sections = (
            "main-content", "current-work", "engineering-work", "selected-work",
            "about", "creative-direction", "contact",
        )
        positions = []
        for identifier in expected_sections:
            marker = f'id="{identifier}"'
            position = homepage.source.find(marker)
            if position < 0:
                errors.append(f"index.html: missing homepage section {identifier}")
            positions.append(position)
        if positions != sorted(positions):
            errors.append("index.html: homepage sections are out of order")
        if "Private development" not in homepage.source:
            errors.append("index.html: missing private-development label")
        if "MSc studies not completed</span>" in homepage.source:
            errors.append("index.html: degree status should not be a project badge")
        if 'href="https://pv.solarnasystems.com/"' not in homepage.source:
            errors.append("index.html: missing SolarnaPV project link")
        if 'id="filter-row"' in homepage.source:
            errors.append("index.html: obsolete mixed-project filters remain")
        if 'href="#main-content"' not in homepage.source:
            errors.append("index.html: missing skip link")

    if errors:
        print("Portfolio validation FAILED:")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"PASS: {len(pages)} HTML pages; {checked} local references; metadata, IDs, fragments, and biography checks.")
    print("Not checked: external URLs, JavaScript-generated links, visual layout, secrets, or asset publication rights.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
