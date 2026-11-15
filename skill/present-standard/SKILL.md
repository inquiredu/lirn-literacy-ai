---
name: present-standard
description: Start or review a presentation built into a project (a stage with timers, speaker notes in a second window, a review, a QR code back to the site) using the Present Standard and the Present Kit. Use when a project needs a talk, a workshop deck, a "present" page or a presenter view, or when the user asks whether an existing one meets the standard.
---

# The Present Standard

The standard (`STANDARD.md`) and its reference implementation (the Present Kit) came from two talks that ran in real rooms: What We Talk About's talk pages and Hands On's presenter view. Start every new presentation from the kit instead of from scratch.

## Where the kit is

The kit lives at `~/Documents/VIBECODE/present-kit`, and in the private repository `inquiredu/present-kit` (clone it on another machine). If neither can be found, ask the user where it is; don't rebuild it from memory. It wears the inquiredu design system; a talk that is one of Sean's personal pieces uses North Shore instead (see the kit's README, "For another brand").

## Starting a talk in a project

1. Read the kit's `STANDARD.md` and `README.md`.
2. Copy the kit into the project: the whole folder for a static site, or `public/talk/` in a Vite or React app (it needs no build and works under `script-src 'self'`). Drop the sample's `assets/tally.html` and its pictures once the deck no longer uses them.
3. In `deck.js`: a new kebab-case `id` (unique among decks on that site, since sites on one GitHub Pages account share storage), the title, the real public `url` (it becomes the QR code), parts with minutes that add up to the session, and slides with speaker notes.
4. Copy `CLAUDE.md`'s rules into the project's own `CLAUDE.md` (or link to them), add the hooks (`git config core.hooksPath .githooks`), and copy `docs/TALK-HANDOFF.md` to the project's `HANDOFF.md` and fill it in. Delete the kit's own `HANDOFF.md` and `docs/REVIEW-2026-10-10.html` from the copy.
5. Run `node scripts/check-all.js`; rehearse with `node scripts/serve.js` and `present.html?at=10`.

## Building a stage some other way

If the project needs its own components, import the kit's `present/core.js` for the rules and copy `tests/core.test.js` with it, then meet sections B to H of `STANDARD.md`. Run the conformance check at the end of `STANDARD.md` before calling it done.

## Reviewing an existing presentation

Go through `STANDARD.md` section by section and report each **must** as met, missed or not applicable, with the file and line that shows it. Reproduce a suspected bug in a browser before reporting it. The usual misses are notes drawn on the stage, a second copy of the clock in the notes window, ⌘ or Ctrl shortcuts caught by the stage, running timers lost on reload, and storage keys not named for the deck.
