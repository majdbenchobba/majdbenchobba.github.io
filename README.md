# majdbenchobba.github.io

Personal GitHub Pages portfolio for Majd Ben Chobba, an electrical engineer based in Tunisia and founder of Solarna Systems.

## Contents

- Solara: a source-free overview of an AI workspace in development
- Solarna Systems: engineering business overview
- BiasForge: a separate market-research and trading-workspace project
- Selected public software repositories
- Completed BSc Electrical Engineering and an ongoing MSc thesis project; the degree is not yet complete
- Cynth V.1 bachelor's thesis and virtual synthesizer academic project
- Media, music, and design portfolio links

## Publication boundaries

This repository contains the public portfolio website, not proprietary product implementations.
Solara's overview describes development direction; it is not a release announcement or evidence of production readiness.

For proprietary products, keep source in separate private repositories and publish only approved documentation, sanitized screenshots, and demos in clean public showcase repositories.
Do not copy source history into a showcase or make a private source repository public to create one.

Before publishing any update:

- Review staged files and full Git history for secrets; `.gitignore` does not remove tracked or historical content.
- Exclude credentials, recovery material, environment files, databases, logs, account exports, and private correspondence.
- Review PDFs, images, screenshots, and their metadata for personal information and publication rights.
- Use synthetic example data and rotate any credentials confirmed exposed.
- Distinguish implemented features, prototypes, and roadmap goals. Do not publish unverified test counts or performance claims.

Link validation is not a security audit, a rights review, or approval to publish existing assets.

## Stack and validation

Plain HTML, CSS, and JavaScript for GitHub Pages; no build step is required.

From this website directory, run (Python 3.9+):

```sh
python scripts/validate_site.py
```

Or from the parent projects directory:

```sh
python majdbenchobba.github.io/scripts/validate_site.py
```

The standard-library validator checks local HTML references and fragments, duplicate IDs, basic page metadata, and key biography/publication wording. It does not fetch external URLs, validate JavaScript-generated links, render layouts, or scan secrets.

Review desktop/mobile appearance and public assets separately before deployment.

## Publication workflow

See [PUBLISHING.md](PUBLISHING.md) for the repository-specific review checklist, pending binary-asset reviews, and safe inspection of the existing checkout.

GitHub Actions runs the website validator on pull requests and pushes to `main`. This is validation only, not a new deployment workflow or a security audit. Existing GitHub Pages settings may deploy independently when a push occurs.

The ignore rules exclude common local secrets and operational artifacts from accidental additions. They do not remove already-tracked files or replace a full history scan.
