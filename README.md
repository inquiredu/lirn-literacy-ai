# Literacy Across Modalities

A LiRN working session by Andrew Rummel and Sean Beaverson on literacy, AI, and professional judgment. The landing page, 31-slide presentation, speaker notes, and printable review all read `deck.js`.

The current design uses a restrained editorial layout with a linked session agenda and paired slide-and-notes reading view. See `HANDOFF.md` for content decisions still awaiting the presenters.

## Presentation engine

A presentation that lives inside a project: one deck file, a stage for the room, speaker notes in a window of their own, and a review to read again or print as the backup. Plain HTML, CSS and JavaScript modules. No build step, no dependencies, nothing loaded from elsewhere, nothing sent anywhere. An inquiredu kit, by Sean Beaverson, in the inquiredu design system.

It is the reference implementation of [the Present Standard](STANDARD.md), which brings together the best of two stages that ran in real rooms: What We Talk About's talk pages and Hands On's presenter view.

**Status: Alpha.** Built, and checked in Chrome on the stage, the speaker notes and the review, at desktop and phone widths, in both themes. Not yet run in a room, with a clicker, or under a screen reader.

## Start a deck

1. Copy this folder into your project (or start a repo from it).
2. Edit `deck.js`: the `id` (unique among decks on one site), the title, the public `url` (it becomes the QR code), the parts and their minutes, and the slides. [docs/DECK.md](docs/DECK.md) explains every field and every kind of slide.
3. Run the checks: `node scripts/check-all.js`. They say, in words, what the deck still needs.
4. Rehearse: `node scripts/serve.js`, then open http://localhost:4188/present.html. Press S for the speaker notes, ? for every key. Add `?at=12` to the address to rehearse twelve minutes into the session.
5. Turn on the git hooks once per clone: `git config core.hooksPath .githooks`.

## Presenting

Open `present.html` on the computer that shares its screen, and press S to open the speaker notes in a second window. In a meeting, share the stage tab (or its window), not the whole screen. The notes follow the stage and drive it: slides, the timer, the session clock, wait time and a blank screen. A clicker works pointed at either window.

| | |
| --- | --- |
| → Space Page Down | Next slide (← Page Up for back) |
| T | Start or pause the slide's timer; on the first slide, call the session to order |
| + and − | A minute more or less, without stopping the timer |
| S | Speaker notes, in a second window |
| C | The session clock, large, with wait time (P pauses it) |
| N | Jump to where the plan says the room should be |
| Q | The site's QR code, large |
| B | Blank the screen; any key brings it back |
| F | Full screen |
| ? | Every key |

The session clock waits for the call to order. On the deck's own `day` (with `start` and `timeZone` set), it counts from the advertised start without a button. A reload loses nothing: the slide, the running timers, the clock and a wait are all kept for that day, under the deck's name.

## The files

| Path | What it is |
| --- | --- |
| `deck.js` | The deck: every word, link, length, note and timer. The one file you edit for a new talk |
| `present.html`, `notes.html`, `review.html` | The stage, the speaker notes, the review. Each names its deck with `data-deck="deck.js"` |
| `present/core.js` | The rules, with no page: the deck's shape, timers, the clock, pace, braces, keys, saved state, and the checks |
| `present/qr.js` | The QR code, drawn from the deck's address in the page (checked module for module against the `qrcode` package) |
| `present/kinds.js`, `present/dom.js` | The kinds of slide, and building elements without HTML strings |
| `present/stage.js`, `present/notes.js`, `present/review.js` | The three views |
| `present/inquiredu.css` | The inquiredu design system's stylesheet, copied unchanged but for its web-font line (`scripts/sync-brand.js`) |
| `present/fonts.css`, `present/fonts/` | Montserrat, Newsreader and IBM Plex Mono, self-hosted (Fontsource 5.3.0, SIL Open Font License) |
| `present/theme.css` | Which of the brand's semantic tokens each part of the stage uses. No colors of its own |
| `present/slides.css`, `stage.css`, `notes.css`, `review.css` | Slides (the same on the stage, in the review and in print), and each view's own frame |
| `assets/inquiredu-*.svg` | The wordmark, reversed wordmark, endorsed lockups and monogram, copied unchanged from the brand |
| `scripts/check.js`, `contrast.js`, `check-all.js` | The deck as the pages read it, every color pair in both themes, and everything in one go |
| `scripts/sync-brand.js` | Brings in the brand's stylesheet again after the brand changes |
| `scripts/serve.js` | A small local server |
| `scripts/preview.js` | Before and after pictures, a comparison page, a slide map, and the printed backup as a PDF |
| `scripts/a11y.js` | An automated WCAG 2.2 AA scan of every slide in both themes |
| `tests/` | Tests for the rules and the QR code: `node --test tests/*.test.js` |
| `.githooks/`, `.github/workflows/` | The checks on every commit, push and pull request, and a stop on anything shaped like a key |
| `docs/` | The deck reference, editing, accessibility, decisions, and a handoff to fill in for a talk |
| `HANDOFF.md` | Where the kit itself stands: what exists, what's verified, what's next |

## Using it in another project

**A static site (GitHub Pages and the like).** Put the kit's files in the site, or in a folder of it (`talk/`), and link to `present.html` and `review.html` from your pages. Set `links.site` in the deck to your home page so "Open the site" goes there.

**A Vite or React app.** Put the kit in `public/talk/`. Vite serves it as it is, and the build copies it unchanged. Link to `/talk/present.html` from the app. The kit loads no inline scripts and nothing from another origin, so it works under a strict `script-src 'self'` Content Security Policy. The sample's `assets/tally.html` is the one exception, so replace it. To build the stage from your own components instead, import `present/core.js` (plain ES modules, no DOM) for the rules, copy `tests/core.test.js` with it, and meet sections B to H of the standard.

**Several talks on one site.** Give each deck its own file and `id`, and copy the three pages with their `data-deck` pointing at it. The ids keep their saved state and their notes channels apart.

## The look

The kit wears the inquiredu design system (`BrandID/inquiredu` in VIBECODE, the `inquiredu/brand` repository): the Electric Lake palette, Montserrat for headings, Newsreader for reading, IBM Plex Mono for code and timers. The title slide follows the brand's own, with the reversed wordmark, an index label, and the sun at the edge.

- **Themes:** `theme: "light"` is Ivory, the brand's default; `"dark"` is Night. The speaker notes follow the presenter's own setting.
- **Tones** for a slide's ground, each with the text pair the brand names for it: `inverse` (the full-bleed band, the default for section slides), `water` (soft ice, the default for pauses), `accent` (peach), `warm` (soft peach), and `night` (one slide in Night, the default for the title). A part's `tone` sets its section slide.
- **One accent per slide:** violet for strong words, kickers and figures. Mark the one key item with `key: true` and it gets the ✦.
- **When the brand changes:** `node scripts/sync-brand.js`, then `node scripts/check-all.js`. The contrast check reads the new values.
- **For another brand** (North Shore, or a client's): replace `present/inquiredu.css` with that brand's tokens under the same semantic names (`surface-*`, `fg-*`, `action-*`, `status-*`), its fonts in `present/fonts.css`, and the logo files; `theme.css` stays as it is. One palette per piece.

## Making it yours

- **A new kind of slide:** a function in `present/kinds.js`, its name and required fields in `KINDS` and `REQUIRED` in `present/core.js`, and its styles in `present/slides.css`, on the semantic tokens. For a one-off, use `kind: "custom"` with a `render` function in the deck.
- **The logo and the tab icon:** `logo: { light, dark, alt }` and `mark` in the deck name copies of the brand's files in `assets/`. Never redraw or recolor them.

## Editing by describing changes

Describe what should change, slide by slide. The change is made in `deck.js`, checked, and shown as before and after pictures on the stage, in the review and on a phone. See [docs/EDITING.md](docs/EDITING.md), and `.claude/skills/present-edit` for an AI assistant. Pictures need Playwright once: `npm i -D playwright`.

## Docs

- [STANDARD.md](STANDARD.md): the rules, and where each came from
- [docs/DECK.md](docs/DECK.md): every field, kind and brace
- [docs/EDITING.md](docs/EDITING.md): the plain-language edit loop
- [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md): what is checked, and what still needs a person
- [docs/DECISIONS.md](docs/DECISIONS.md): one line for each decision, with its date and reason
- [HANDOFF.md](HANDOFF.md): where the kit itself stands
- [docs/TALK-HANDOFF.md](docs/TALK-HANDOFF.md): a handoff to copy and fill in for a talk, with a starter prompt for a new chat
- [docs/REVIEW-2026-10-10.html](docs/REVIEW-2026-10-10.html): the review of What We Talk About and Hands On that the standard came from (a dated record; delete it from a talk's copy of the kit)
- [CLAUDE.md](CLAUDE.md): the rules an AI assistant follows when changing a deck
