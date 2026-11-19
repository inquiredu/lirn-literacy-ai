# Literacy in an AI Era: handoff

Updated November 19, 2026. The underlying presentation engine follows `STANDARD.md`.

## The review turns like What We Talk About's book, November 19

On branch `claude/hopeful-franklin-rmjmti`, **not merged to main** (Sean's call: no changes to main yet). The review (`review.html`) now reads and turns like What We Talk About's book. Sean picked this over What We Talk About's two slides to a spread, so each spread is still the slide on the left and its speaker notes on the right.

- **The turn:** the new spread slides in 1.5rem from the side you're turning toward as it fades up, over .45s, the same values as What We Talk About's book. Under reduced motion it changes at once. Arrows, Page Up and Down, Space, Home, End, a swipe, or Previous and Next, which now stay pinned under the book.
- **The look:** two pages joined at a shaded spine, lifted off a sunken ground, with folios. The spine and shadows come from the talk's tokens (`--scrim`, `--shadow-3`).
- **Contents** is now the book's first spread (`review.html#contents`), the parts running across both pages, one turn back from slide 1. The Contents button above the book opens it. No address still opens slide 1, so the landing page's links behave as before.
- **Show all pages on one scroll** lays out every page in one column. The address follows the page you're reading, so switching back opens the book there.
- **Long notes:** pages grow with their notes and the window scrolls, instead of each page scrolling on its own. The slide stays at the top of the window beside long notes (`roles-now`, `moves`, `basics-thinking`).
- `contents` is now a reserved slide id (a check in `present/core.js`, with a test), since the review uses `#contents`.
- Verified: `node scripts/check-all.js` passes. Axe finds no violations on 40 pages and slides (now including `review.html#contents`) at 1280 and 375px, in the deck's theme and in Night; the one-scroll view and the longest notes spread are also clear at both widths in both themes. The turn was filmed frame by frame beside What We Talk About's running locally and matches. Keys, the Contents links (focus moves to the page that opens), the address, and the one-scroll round trip were driven in Chromium. The printed backup PDF renders identically page for page before and after.
- Not verified: a screen reader, Safari or Firefox, a real swipe on a phone or tablet (the swipe code is unchanged), zoom to 200% and 400%.

## Introductions slide, November 19

**Slide 2, `intro`** ("Andrew and Sean"): right after the title, on the same dark ground. Andrew Rummel, then Sean Beaverson, each with role and district, beside their coffee-shop photo framed small (`assets/andrew-and-sean.jpg`). The names and roles come from the landing page's bios (`landing.us.people`), so a change there changes the slide.

- The kicker ("Presenting today") and the speaker notes are drafts; the notes have an `[ADD]` for what each of you will say, with lines from your bios to draw on.
- The opening part's 16 minutes now include introductions; no minutes were changed.
- In the photo, Sean is on the left and Andrew on the right (from the earlier sketch's alt text). The photo, not a sketch, is now on the public site.
- `node scripts/check-all.js` passes; axe finds no violations on 39 pages and slides at 1280 and 375px in either theme; the PowerPoint export comes back with no changes. Looked at on the stage, in the review, on a phone and in the printed backup. Not checked: a screen reader, Safari or Firefox.

## Zoom readability, November 19

The question the room answers in the chat was the smallest text on every pause slide (about 13pt next to a 16:9 PowerPoint slide). It and the prompt under the cards on `roles-now` are now about 18pt, heavier, with a rule above (`present/slides.css`, "Room prompts"). The pause slides' label line ("Pick one") is larger, and so is the Charlotte's Web debrief (`what-was-in-it`, in `present/talk.css`). The one change to `deck.js`: `hold-test`'s case reminder sets each case on its own line, since at prompt size the single line broke mid-case. Same words.

- Verified, on the deck after the case slides were split out (33 slides): all 18 participation slides measured at 1920x1080, 1440x900, 1366x768, 1280x720 and 1280x800, and none overflows; the printed backup PDF, the review and a 375px phone checked by picture; `node scripts/check-all.js` passes; axe finds no violations on 39 pages and slides in light and dark.
- Not verified: a live Zoom share.

After the session (decided November 19: sizes only before it; these wait):

- [ ] A room-prompt field on any kind, drawn as the prompt on the slide and shown with a Copy button in the speaker notes, so a co-host can paste it into the Zoom chat or a breakout broadcast. Today the prompt lives in `foot`, which on list and cards slides is often a caveat instead.
- [ ] `moves`: its question to the room ("Which would you test first?") is still about 13pt, in a list foot that can't be styled alone until that field exists.
- [ ] Wording, for Andrew and Sean: instructions out of the label line and into the prompt ("Pick one," "Watch, or try it yourself"); the slash-heavy questions on `story-detail` and `teaching-question` shortened; `check-this` says "mark one claim," where the notes say to post it in the chat.
- [ ] `build-chart` asks the room to work from Case A, Case B and the checked answer, none of them on screen: a one-line reminder of each on the slide, as `hold-test` now has.
- [ ] Smaller text the room reads: research-card bodies (about 14pt), the child's questions on `roles-now` (about 8pt labels). The cases are now on their own slides at about 18pt.
- [ ] The as-you-join chat question is only in the title slide's notes; put it on screen while people arrive.
- [ ] The presenter's corner controls and timer buttons show on the shared screen; a clean-share mode would revisit the October 10 decision to keep them readable at rest.

## Research library, November 19

`library.html` is a reading list for anyone the session leaves curious: 70 sources, each filed as Foundations (39) or AI era (31), by kind of source (59 academic, 5 reports and guides, 3 reflections, 3 to listen to or watch), and by seven questions that follow the session's parts. Filters and a search live in the address, so a view can be shared.

**Hidden for now (Sean's call, November 19), while Sean revises it.** `hidden: true` on `library` in `deck.js` takes it out of the landing page's nav and "Continue the inquiry", and no page or slide links to it. The page itself is unchanged and still opens at its address for anyone who has it. While it's hidden, no other page or slide says "research library" either. "Continue the inquiry" now reads "Explore research and leadership resources at What We Talk About When We Talk About AI", and `keep-learning` says What We Talk About "gathers research, leadership kits, and now this session's resources". Both meant What We Talk About's library, and both are draft wording for Andrew and Sean. To bring it back, delete `hidden: true` (the links return) and put back these words in `deck.js`:
- `landing.resources.body`: "This session's research library gathers the studies behind it and where to read next, sorted by what was known before generative AI and what is being learned now. Leadership resources are at What We Talk About When We Talk About AI."
- `landing.resources.label`: "Leadership resources"
- `way-back` body: "This deck, with speaker notes and sources, to read again or share, and a research library for reading further."

- Entries and the page's words are in `library.js` (imported by `deck.js` as `deck.library`); the rules are in `present/core.js` with tests; `docs/LIBRARY.md` has the fields, the rule for adding a source, what was left out and why.
- Checked November 19: 61 of the 70 against their own registry record (Crossref, OpenAlex, ERIC, arXiv, Open Library), all 55 DOIs tested at doi.org. **Nine still need a person to open them once**; they're listed in `docs/LIBRARY.md`.
- The check also turned up ten small things about the deck's own citations, in the same file under "What the check found about the deck." None was changed in `deck.js`.
- Draft wording for Andrew and Sean: the library's lead and shelf descriptions, and (for when it's shown again) the landing page's "Continue the inquiry" block and the clause on `way-back`.
- `node scripts/check-all.js` passes; axe finds no violations on 39 pages and slides in light and dark at 1280 and 375px; filters work by keyboard; printing gives a plain reading list with addresses. Not checked: a screen reader, Safari or Firefox.

## Draft opening activity, November 18

Andrew's design: the room watches Gemini make text, names what a student would need to work with it, and then meets the four roles, with the AI-era version as the room's next step. One model runs on the presenter's screen, and anyone can try the same prompts alongside (`links.gemini`).

- **Slide 2, `story-model`** (4 min): "Write a three paragraph story about a girl," then "…about a boy." What would a student need to know or do to work with this text?
- **Slide 3, `story-detail`** (4 min): add a detail ("…a girl who lives in the suburbs," "…a boy who lives in the middle of a big city"). What changed? What would a student need now?
- **Slide 4, `teaching-question`** (3 min): "What should I do when a first grader guesses at a word?" What did you need this time that the story didn't ask of you? The question is a draft: confirm it and run it several times beforehand.
- Removed: `read-this` (the session description read closely) and `roles-grid` (the roles pause). `how-made` is now "How this session was made." `four-roles` notes sort the opening's chat answers into the roles, and `roles-now` asks "What would you add?"
- Minutes (rebalanced November 19, sixty in all): open 16, lens 4, making 14, navigating 11, social 7, revisit 8. The four roles slide was removed and "Reading AI text, critically" now closes the session (slide 30), before "A next step and the evidence to examine" (slide 31).
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
| `hold-test` (notes) | An EL colleague's view on Case B, if one can be had before the day |
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
