# Literacy Across Modalities: handoff

Updated November 15, 2026. The underlying presentation engine follows `STANDARD.md`.

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

## Outstanding content decisions

- Replace `links.padlet` with the actual session board. It still points to the Padlet homepage.
- Resolve the five `[ADD]` facilitator notes in `deck.js`: changes to the session description, the framing attribution, the prepared/live checking example, University of Minnesota research, and the follow-up submission process.
- Confirm any session date and start time before configuring automatic clock start. The clock currently waits for the presenter.
- The user approved the design and wording direction. Resolve the remaining content placeholders with the presenters.

## Verification

Verified in Chrome on November 14, 2026:

- `node scripts/check-all.js` passes: deck validation, 53 contrast pairs in both themes, and the core/QR test suite.
- axe reports no violations on 31 pages and slides at 1280px and 375px in both light and dark themes.
- All 28 stage layouts visually inspected. Desktop and phone checks found no horizontal overflow.
- Landing agenda targets, review contents and keyboard navigation, two-way stage/notes synchronization, and timer persistence after reload pass browser checks.
- The print export produces 28 pages at 16:9.

Automated checks cannot establish research accuracy or replace a real projector, clicker, screen reader, or a Safari/Firefox review.

## Continuing work

Read `CLAUDE.md`, `docs/DECK.md`, and the latest entries in `docs/DECISIONS.md`. Edit content in `deck.js`; every view reads it. Run `node scripts/check-all.js` before committing. Optional browser QA uses Playwright and axe with the installed Chrome path through `PREVIEW_BROWSER`. Keep changes on a branch and let the owner merge.
