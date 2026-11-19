# Literacy in an AI Era: handoff

Updated November 18, 2026. The underlying presentation engine follows `STANDARD.md`.

## Draft opening activity, November 18

Andrew's design: the room watches Gemini make text, names what a student would need to work with it, and then meets the four roles, with the AI-era version as the room's next step. One model runs on the presenter's screen, and anyone can try the same prompts alongside (`links.gemini`).

- **Slide 2, `story-model`** (4 min): "Write a three paragraph story about a girl," then "…about a boy." What would a student need to know or do to work with this text?
- **Slide 3, `story-detail`** (4 min): add a detail ("…a girl who lives in the suburbs," "…a boy who lives in the middle of a big city"). What changed? What would a student need now?
- **Slide 4, `teaching-question`** (3 min): "What should I do when a first grader guesses at a word?" What did you need this time that the story didn't ask of you? The question is a draft: confirm it and run it several times beforehand.
- Removed: `read-this` (the session description read closely) and `roles-grid` (the roles pause). `how-made` is now "How this session was made." `four-roles` notes sort the opening's chat answers into the roles, and `roles-now` asks "What would you add?"
- Minutes rebalanced to keep 60: open 8→15, lens 11→8, making 16→14, social 8→7, revisit 7→6. A proposal; move them if another part needs the time.
- **Slide 9, `roles-now`** (November 19) is now "Reading AI text, critically": Origin, Representation, Authority, Agency, a proposal from a critical literacies perspective (drawing on Janks 2010 and Lewison, Flint & Van Sluys 2002; not yet checked against the sources). A note on top says it sits on a foundation of reading skills and relates most to comprehension and content knowledge. It replaces the Freebody-and-Luke-derived roles; slide 8 still shows the originals.
- Still to do: screenshots of a Gemini run as a backup, and who drives Gemini on screen (the notes say Andrew).

## Draft additions, November 15

Three new slides, proposed for an hour on Zoom with mainly elementary teachers. Their wording is a draft for Andrew and Sean, and their citations are from established research but haven't been re-checked against the sources.

- **Slide 8, `roles-now`** (Part 1, after the table activity): a proposed version of the four roles for AI-era text. Code breaker and maker, Sense maker, Author, Verifier. Each card shows its lineage (Freebody & Luke 1990, then Serafini 2012). Marked on the slide as a proposal, not a validated model.
- **Slides 20 and 21, `basics-checking` and `basics-thinking`** (Part 3, between the evidence and the verification moves): six elementary literacy skills the reading research says matter more with AI. Knowledge and vocabulary, monitoring, sourcing; complex text, writing, discussion. Short words on the slide, talking points and sources in the notes and foot.

Part minutes are unchanged, so Parts 1 and 3 are now likely to run three to five minutes long together. Decide where to trim. The deck still says its audience is literacy leaders, and the activities assume an in-person room ("at your table"); adapting them for Zoom breakout rooms is not done.

## Current revision

Developed on `codex/leadership-presentation`. The user approved this revision for `main` on November 14, 2026.

The user asked for significant improvements in professionalism while retaining the existing structure. The revision removes the scrapbook treatment and gives the session a consistent editorial style suited to literacy leaders. It keeps joint authorship, all 28 slides, the six-part 60-minute plan, seven timers, stable slide IDs, QR navigation, presenter controls, speaker notes, and the printable review.

The landing page now includes a linked agenda, explicit intended outcomes, inquiry questions, individual professional author biographies with source links, and a resource link. New public wording and revised slide headings are proposed editorial copy for Andrew and Sean to review. The existing study claims, sample cases, and research caveats have not been independently re-researched in this design pass.

Seasonal artwork and portrait files remain in the repository but are no longer shown. The shared brand source `present/inquiredu.css` is unchanged. The talk's existing paper-and-spruce palette and self-hosted fonts remain.

## Editing words in PowerPoint

The review page's **Download .pptx to edit** builds a PowerPoint file from `deck.js` (every word in its own text box, notes in the notes pane). Edit it in PowerPoint, Keynote or Google Slides and give it back to Claude Code, which runs `node scripts/pptx.js import`. Only changed words go into `deck.js`; the theme and layout never change. Checked: export and import round trip with no changes, through LibreOffice too, and five edits made with python-pptx came back as exactly five strings in `deck.js`. Not checked: a file saved by PowerPoint, Keynote or Google Slides themselves.

## Day-of call: breakout rooms

Made at the call to order by headcount (participants, not presenters), and sent to the co-host in a private chat. The title slide's notes repeat it.

| Participants | Cases pause (`hold-test`) |
| --- | --- |
| 9 or more | Three rooms (Case A, B, C), participants choose |
| Under 9 | Main room; take the case closest to your grades, chat waterfall |

The opening Gemini activity is whole group, with no breakout rooms.

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
