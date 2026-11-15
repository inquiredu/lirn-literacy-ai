# Literacy Across Modalities: handoff

Updated November 14, 2026. The underlying presentation engine follows `STANDARD.md`.

## Current revision

Developed on `codex/leadership-presentation`. The user approved this revision for `main` on November 14, 2026.

The user asked for significant improvements in professionalism while retaining the existing structure. The revision removes the scrapbook treatment and gives the session a consistent editorial style suited to literacy leaders. It keeps joint authorship, all 28 slides, the six-part 60-minute plan, seven timers, stable slide IDs, QR navigation, presenter controls, speaker notes, and the printable review.

The landing page now includes a linked agenda, explicit intended outcomes, inquiry questions, individual professional author biographies with source links, and a resource link. New public wording and revised slide headings are proposed editorial copy for Andrew and Sean to review. The existing study claims, sample cases, and research caveats have not been independently re-researched in this design pass.

Seasonal artwork and portrait files remain in the repository but are no longer shown. The shared brand source `present/inquiredu.css` is unchanged. The talk's existing paper-and-spruce palette and self-hosted fonts remain.

## Editing words in PowerPoint

The review page's **Download .pptx to edit** builds a PowerPoint file from `deck.js` (every word in its own text box, notes in the notes pane). Edit it in PowerPoint, Keynote or Google Slides and give it back to Claude Code, which runs `node scripts/pptx.js import`. Only changed words go into `deck.js`; the theme and layout never change. Checked: export and import round trip with no changes, through LibreOffice too, and five edits made with python-pptx came back as exactly five strings in `deck.js`. Not checked: a file saved by PowerPoint, Keynote or Google Slides themselves.

## Day-of call: breakout rooms

Made at the call to order by headcount (participants, not presenters), and sent to the co-host in a private chat. The title slide's notes repeat it.

| Participants | Roles pause (`roles-grid`) | Cases pause (`hold-test`) |
| --- | --- | --- |
| 12 or more | Four rooms, one per role, assigned automatically | Three rooms (Case A, B, C), participants choose |
| 9 to 11 | Main room; roles by first name, chat waterfall | Three rooms, participants choose |
| Under 9 | Main room | Main room; take the case closest to your grades, chat waterfall |

Before the day: turn on breakout rooms and "Allow participants to choose room" on the meeting, and name a co-host to run them. Allow about a minute and a half to open and close each round.

## Outstanding content decisions

Decided with Sean on November 15, 2026, step by step after the content review (`docs/CONTENT-REVIEW.md`): responses go in the Zoom chat; after the session, observations come back by email (addresses pasted in the chat, kept off the public deck); breakout rooms switch on by headcount (below); a K–2 beat and Case C; grade bands on every card; three figures; four added perspectives.

**For Andrew** (Sean said Andrew, who also works in this repo, will supply these). Each is an `[ADD]` in a slide's notes in `deck.js`:

| Slide | What's needed |
| --- | --- |
| `how-made` | Exactly what you changed in Gemini's session description, and what you didn't check |
| `framings` | The author of the "AI as thought partner / AI as source of content" framing from Andrew's earlier session |
| `noticing-a` (notes) | Confirm "Kit 05 (Curriculum Mapping)" on What We Talk About; the site couldn't be reached to check |
| `noticing-b` | An EL colleague's view on Case B, if one can be had before the day |
| `check-this` | Keep the prepared Charlotte's Web answer, or generate one live with planted errors |
| `moves` | Vet the Dakota and Ojibwe example with district American Indian education staff, or drop it |
| `t-chart` | The University of Minnesota study on AI and interpersonal connection; it should be checked against its source before it goes on a slide |
| `keep-learning` | When the session's resources go up on What We Talk About |

Also: confirm the session date and start time before setting `day` and `start` (the clock waits for the presenter until then), and confirm the 2026–27 LiRN series theme.

## Verification

November 15, 2026, after the content review (`docs/CONTENT-REVIEW.md`): `node scripts/check-all.js` passes (30 slides, 60 minutes, 7 timers; 53 contrast pairs); `node scripts/a11y.js` finds no axe violations on 33 pages and slides at 1280 and 375px in light and dark. The three new figures were checked by screenshot on the stage, on a phone and in the review, and their new color pairs by arithmetic (11.6:1 or better). Not checked: a live Zoom screen share, breakout rooms, and the full text of the cited papers.

Earlier:

Verified in Chrome on November 14, 2026:

- `node scripts/check-all.js` passes: deck validation, 53 contrast pairs in both themes, and the core/QR test suite.
- axe reports no violations on 31 pages and slides at 1280px and 375px in both light and dark themes.
- All 28 stage layouts visually inspected. Desktop and phone checks found no horizontal overflow.
- Landing agenda targets, review contents and keyboard navigation, two-way stage/notes synchronization, and timer persistence after reload pass browser checks.
- The print export produces 28 pages at 16:9.

Automated checks cannot establish research accuracy or replace a real projector, clicker, screen reader, or a Safari/Firefox review.

## Continuing work

Read `CLAUDE.md`, `docs/DECK.md`, and the latest entries in `docs/DECISIONS.md`. Edit content in `deck.js`; every view reads it. Run `node scripts/check-all.js` before committing. Optional browser QA uses Playwright and axe with the installed Chrome path through `PREVIEW_BROWSER`. Keep changes on a branch and let the owner merge.
