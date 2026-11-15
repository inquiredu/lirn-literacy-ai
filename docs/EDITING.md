# Editing a deck by describing changes

The quick way to change a talk: describe what you want in plain words, one line per change, and see it as before and after pictures. Nothing merges or deploys until you say so. (This is What We Talk About's edit loop, brought to the kit.)

## Editing the words in PowerPoint or Google Slides

For a pass over the wording, slide by slide: the review page's **Download .pptx to edit** builds a PowerPoint file from `deck.js`. Every word on a slide is its own text box, and the speaker notes are in the notes pane. Edit it in PowerPoint, Keynote or Google Slides (File → Download → Microsoft PowerPoint), then give the file to Claude Code. Claude runs `node scripts/pptx.js import file.pptx --dry-run` to show what would change, then the same without `--dry-run` to write only the changed words into `deck.js`, and `node scripts/check-all.js`. If the edited deck has a problem, `deck.js` is put back and the problem is reported. `node scripts/pptx.js export` writes the same file from a terminal.

Only words travel back. Bold becomes `**strong**` and italic `*emphasis*`. Braces stay as typed. Anything else in the file (fonts, colors, layout, a new slide or box) is left behind with a note, so the site's theme can't change. Structural changes still go through the loop below.

## The loop

1. **Describe.** One line per change. Point at a slide by its number, its id, or part of its title. `node scripts/preview.js map` lists them all.
2. **Before pictures.** `node scripts/preview.js shoot before 6 parable`: each slide named, on the stage (1440×900), in the review (1440×900) and on a phone (375×760), with motion off.
3. **Apply.** The change goes into `deck.js` (or, for the look, `present/theme.css` and `present/slides.css`), then `node scripts/check-all.js`.
4. **After pictures and a comparison.** `node scripts/preview.js shoot after 6 parable`, then `node scripts/preview.js compare before after`, which writes `.preview/compare.html`: before and after side by side, with "no visible change" where nothing moved.
5. **Answer.** "Ship it", or "change X". Approved changes go to a branch and a pull request. Merging is the owner's call, and merging is what deploys.

## How to describe a change

- `parable: say "in systems filled with people" instead of "a child"`
- `#12: make the quote the whole slide and drop the picture`
- `pause-need: six minutes`
- `after "Two copies drift": a new slide, the five rules again, as a list`
- `everywhere: the coral looks too orange`

For a rewrite, give the idea in your own words; the wording comes back marked as a draft for you to adjust. Attach pictures as files. They go into `assets/` at about 900px wide, with alt text written for them.

## Where each kind of change lives

| Change | File |
| --- | --- |
| Words, a slide's kind, its notes, its timer, its place | `deck.js` |
| A part's name, length or color | `deck.js`, `parts` |
| Colors and type | The inquiredu design system (`BrandID/inquiredu`), then `node scripts/sync-brand.js`. Which token each part of the stage uses: `present/theme.css` |
| A slide's ground | `tone` on the slide, or on its part for a section slide (`docs/DECK.md`, Tones) |
| How a kind of slide is laid out | `present/slides.css`, and `present/kinds.js` for its elements |
| The public address and its QR code | `url` in `deck.js` (the code is drawn from it; nothing to regenerate) |
| Pictures | `assets/` |

## What is checked every time

`node scripts/check-all.js`: the deck as the pages read it (ids, kinds, parts, notes, alt text, pictures on disk, braces, timers), the colors in both themes, and the tests. `node scripts/a11y.js` scans the slides that changed for WCAG 2.2 AA problems, and the scan doesn't replace a keyboard and a screen reader. Report only what was run.

`node scripts/preview.js pdf` (or `pdf notes`) writes the printed backup to `.preview/`, one slide to a page, for a network that blocks the site.

Pictures need Playwright, once: `npm i -D playwright`, then `npx playwright install chromium`, or set `PREVIEW_BROWSER` to a Chrome path. `.preview/` is ignored by git.
