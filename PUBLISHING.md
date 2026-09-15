# Website publication checklist

## Scope

Publish only this dedicated website repository. Never initialize or upload the parent projects directory.
Proprietary product implementations belong in separate private repositories; public showcases contain only approved descriptions and sanitized media.

This checklist is preparation, not security clearance. Do not publish until the outstanding reviews below are complete.

## Existing checkout

The website has a dedicated Git repository on `main`. A separate publication checkout was prepared with targeted history cleanup to remove the original thesis PDF from previous commits. Publish the sanitized replacement from that cleaned checkout, not from the original history. Replacing remote history requires explicit approval and a force-with-lease tied to the reviewed remote commit. Existing clones and cached copies are not removed by this operation.
The parent projects directory is not a Git working tree, so run Git commands from this website directory (or use `git -C majdbenchobba.github.io` from the parent).

On this Windows environment, Git reported an ownership mismatch. After confirming that you trust this specific checkout, a read-only PowerShell inspection from the parent can use a command-scoped exception:

```powershell
$repo = (Resolve-Path -LiteralPath 'majdbenchobba.github.io').Path.Replace('\','/')
git -c "safe.directory=$repo" -C majdbenchobba.github.io status --short --branch
```

This does not change global Git settings. Never use a wildcard trust exception.

## Before publishing

- [ ] Confirm the destination is `majdbenchobba/majdbenchobba.github.io`, and inspect the current remote state before pushing. A local `origin/main` reference can be stale.
- [ ] Review the complete proposed file list and diff, including new/untracked files. Do not use a parent-directory `git add .`.
- [ ] Scan current files and full reachable Git history for secrets using a dedicated secret scanner. Do not paste discovered values into reports; record redacted findings. Rotate credentials confirmed exposed.
- [ ] Confirm public biography, business descriptions, project status, grades, and dates with the owner. Do not publish private background notes.
- [ ] Review the three existing binary assets below, including embedded metadata and PDF content.
- [ ] Review externally linked design documents separately; a link from this site is not clearance of their contents or rights.
- [ ] Preview the local website at desktop and mobile widths. Check all six pages, navigation, keyboard focus, project filters, and horizontal overflow. Live-site inspection does not verify unpublished local changes.
- [ ] Check external destinations and JavaScript-generated project links.
- [ ] Run `python scripts/validate_site.py` and `git diff --check` inside this repository.
- [ ] Before an approved commit, review the staged diff and file list again. Ignore rules do not protect already-tracked files or history.
- [ ] Inspect GitHub Pages settings before pushing: an existing branch-based deployment may publish automatically, independently of the validation workflow.
- [ ] Obtain explicit approval for the exact commit/push operation and destination. Never force-push as routine publication preparation.
- [ ] After deployment, verify the live site rather than assuming a successful push means the intended pages are live.

## Binary asset review queue

All three files were found in the existing tracked website. Their presence in Git is not proof of permission, privacy, or metadata review.

| File | Required review | Status |
| --- | --- | --- |
| `assets/cynth-v1/cynth-v1-breadboard.jpg` | Visible personal details, location/EXIF metadata, ownership | No EXIF fields detected; visual/rights review pending |
| `assets/cynth-v1/cynth-v1-front-panel.jpg` | Visible personal details, location/EXIF metadata, ownership | No EXIF fields detected; visual/rights review pending |
| `assets/cynth-v1/cynth-v1-thesis-presentation.pdf` | Every page, personal identifiers, document metadata, third-party material | Student identifier redacted; document metadata removed; image-only content/rights review pending |

The public thesis PDF has been sanitized. The visible author name and academic content are retained; the original is preserved outside this website directory. Automated checks cover all 30 pages, identifier removal, PDF Info/XMP/object metadata, document IDs, attachments, and active content. Render comparison permits at most one colour level per channel outside the redaction area to account for PDF renderer rounding. The existing asset URL is unchanged.

The current JPEGs have no EXIF fields detected. Standard JPEG format and density fields are not personal metadata. Visible content and publication rights still need review.

These checks cover current files only. Previous PDF versions may retain the identifier and metadata in Git history or on the live website. Replacing a tracked file does not remove historical or cached copies. Never publish the private backup or the parent projects directory.

## Automated checks and limits

`.github/workflows/validate.yml` runs the standard-library HTML validator on pushes to `main`, pull requests, and manual dispatch. It uses read-only repository permissions and does not deploy anything.

The workflow does not prevent a separately configured GitHub Pages deployment. Required status checks or deployment gates must be configured separately.

The validator checks local references, fragments, IDs, basic metadata, and selected biography wording. It is not a secret scanner, a browser test, an external-link checker, or an asset-rights audit.

`.gitignore` reduces accidental inclusion of common credential, database, log, archive, and local-review files. It is not a security boundary and cannot detect secrets embedded in otherwise allowed files.
