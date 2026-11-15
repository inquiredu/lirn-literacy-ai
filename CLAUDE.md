# Present Kit — notes for Claude

The starting point for any presentation built into an inquiredu project: one deck file, a stage for the room, speaker notes in a second window, and a review that prints as the backup deck. It's for Sean and anyone who presents from a project's own site, and it removes the slide file that lives somewhere else and drifts. It's the reference implementation of `STANDARD.md`, drawn from What We Talk About's talk pages and Hands On's presenter view. Not live, and no real data: the sample deck is about the kit itself. When the kit is copied into a talk's project, this file comes along and its rules apply there unchanged.

## Read first
- `HANDOFF.md` — where the kit stands (in a talk's project: that talk's handoff, from `docs/TALK-HANDOFF.md`)
- `STANDARD.md` — the rules; a change that breaks a must is a bug
- `docs/DECK.md` — every deck field, kind, tone and brace, before editing `deck.js`
- `docs/DECISIONS.md` — why things are the way they are, before undoing one

## Non-negotiables
1. **One source: `deck.js`.** Words, links, lengths, notes, timers and the public address live there, and every view reads it. Reach them with a `{brace}`; never type them into a page.
2. **Lengths, not clock times.** Slides and notes say how long things run (`{mins}`, `{build.length}`, `{length}`), never when they start.
3. **The stage keeps the state.** `present/stage.js` owns the slide, the timers, the clock, a wait and the blank screen. `present/notes.js` shows what the stage sends and sends commands back; never give it state of its own.
4. **The rules live in `present/core.js`**, with no page: timers, the clock, pace, braces, keys, tones, saved state and the deck's checks. Change a rule there, with its test in `tests/core.test.js`.
5. **No HTML strings.** Build elements with `h()` in `present/dom.js` and words with `rich()`. Never `innerHTML` with deck text.
6. **Named for the deck.** Everything saved, and the notes channel, carries the deck's `id` (`present:<id>:…`). Never a bare localStorage key.
7. **The inquiredu design system, through its semantic tokens.** Colors, type and radii come from `present/inquiredu.css` (the brand's own file, synced, never edited by hand). Style with `surface-*`, `fg-*`, `action-*`, `control-*`, `status-*` or the kit's map in `theme.css`; no raw hex and no `el-*` scale in components. Text only in the pairs the brand names. Write `inquiredu` lowercase, always. Logos are the brand's files, never redrawn; no emoji; ✦ once per slide.
8. **Nothing from elsewhere:** no analytics, no requests to other hosts. Fonts are self-hosted in `present/fonts/`.
9. **Made-up data only** in examples and sample slides. No student or staff data in a deck or its pictures.

## Stack and commands
Plain HTML, CSS and ES modules; no build step, no dependencies (a departure from the VIBECODE default, recorded in `docs/DECISIONS.md`).
- `node scripts/check-all.js` — the deck as the pages read it, every color pair in both themes, and the tests. Run before every commit; the hooks run it too once a clone has `git config core.hooksPath .githooks`.
- `node scripts/serve.js` — http://localhost:4188/present.html; `?at=12` rehearses twelve minutes in.
- `node scripts/a11y.js` (`THEME=dark` for Night) and `node scripts/preview.js` (map, shoot, compare, pdf) need `npm i -D playwright @axe-core/playwright` once; `PREVIEW_BROWSER` points at Chrome if Playwright's browser isn't installed.
- `node scripts/sync-brand.js` — after the brand changes in `BrandID/inquiredu`.
- Handed an edited `.pptx` (from the review page's "Download .pptx to edit")? `node scripts/pptx.js import <file> --dry-run`, show the changes, then run it without `--dry-run` and `node scripts/check-all.js`. Only words travel; a note it prints (a skipped box, names matched by order) goes to the user. `node scripts/pptx.js export` writes the same file.
- Say what was run, and what wasn't. Work on a branch and let Sean merge; never deploy or change repository settings unasked.

## Things that will bite you
- The stage and the notes talk over a BroadcastChannel: test them as two tabs or windows of the same browser.
- `requestAnimationFrame` doesn't run in a hidden tab. A slide reveals by forcing a style recalc instead, so a slide advanced from the notes window still appears.
- `URLSearchParams` reads `+` as a space, which is why rehearsal is `?at=12`, not `?now=+12`.
- Sites on one GitHub Pages account share an origin, so they share localStorage. That's why everything is named for the deck's id.
- axe passed controls at 25% opacity that measure about 2:1; check contrast by arithmetic too (`scripts/contrast.js`).
- Kit tokens are declared on `:root, [data-theme]` so one slide can wear the other theme (`data-theme="dark"` on a Night title). A token declared on `:root` alone would keep the page's values inside that slide.
- This folder is iCloud-synced: if `git` or `ls` hangs, `brctl download present-kit` first.
