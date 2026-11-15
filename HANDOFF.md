# Present Kit: handoff

Where the kit stands as of 2026-10-11. The rules are in `STANDARD.md`; how to start a deck is in `README.md`. This file is what exists, what's verified, and what's next.

## Repository

Private GitHub repo `inquiredu/present-kit`, created 2026-10-11. The working copy is `~/Documents/VIBECODE/present-kit`. Docs-only changes go to `main` and get pushed in the same session.

## Where it came from

A review on 2026-10-10 of the two stages Sean built: What We Talk About (`inquiredu/what-we-talk-about`, `src/talk/`, main at `5563350`) and Hands On (`inquiredu/a-mn-hackathon`, `present.html`, main at `1acbcd5`). The review is `docs/REVIEW-2026-10-10.html`, also published privately at https://claude.ai/artifact/JA6ybzpfgxadPKnNZwcvJw. Neither original repository was changed. The review page is kept as it was published: its own palette, and fonts from Google. It's a dated record, not part of the kit, so it isn't held to the kit's inquiredu and offline rules.

## Exists

- **EXISTS** The stage, the speaker notes window, the review with a printable backup, and a landing page, all reading one deck file (`deck.js`, a 17-slide sample about the kit).
- **EXISTS** The rules in `present/core.js` with 23 tests (timers, the session clock, pace, braces, keys, saved state, deck checks) and a QR encoder checked against the `qrcode` package across versions 1 to 13.
- **EXISTS** The inquiredu design system: the brand's stylesheet synced in (`present/inquiredu.css`), its three families self-hosted (`present/fonts/`, Fontsource 5.3.0, OFL), its logo files in `assets/`, and the brand's title slide.
- **EXISTS** Checks: `scripts/check-all.js` (deck, 53 color pairs in Ivory and Night, tests), git hooks with a credential scan, a GitHub Actions workflow, an axe scan (`scripts/a11y.js`), and a before/after picture tool (`scripts/preview.js`).
- **EXISTS** Two skills: `.claude/skills/present-edit` (edit a deck from a change list) and `skill/present-standard` (start or review a presentation in another project, to install at user level).

## Verified, and not

- Verified 2026-10-11, in Chrome: all checks pass; axe finds no violations on 21 pages and slides at 1280 and 375px in both themes; every slide photographed on the stage, in the review and on a phone; the notes window follows and drives the stage; a reload keeps a running timer; ⌘P and Ctrl+C reach the browser, not the stage; the printed backup is 17 pages with and without notes; the self-hosted fonts load with no request elsewhere.
- **VERIFY** A screen reader (VoiceOver, NVDA) over the stage, the clock and the notes.
- **VERIFY** A real projector, a real clicker, and sharing the stage tab in Meet or Zoom.
- **VERIFY** Safari and Firefox.
- **VERIFY** The repo's GitHub Actions run on the first pull request.

## Next

- Set the sample deck's `url` to the kit's real address once it has one (it's `example.org` now, and the check says so).
- Install `skill/present-standard` at user level (`~/.claude/skills/present-standard/`) so any project can start from the kit.
- Decide whether to make the repo public (Hands On's is, under MIT; this one has no license yet).
- Move What We Talk About's talk and Hands On's stage onto the kit, or backport the fixes listed in the review (Hands On's ⌘/Ctrl shortcuts and its notes window's second clock; What We Talk About's notes drawn on the stage).
- Make a social preview card from `BrandID/inquiredu/templates/social-card.html` and upload it in the repo's settings.
