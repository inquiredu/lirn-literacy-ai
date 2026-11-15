# The Present Standard

Version 1.1 · October 11, 2026 (1.0, October 10: the rules; 1.1: section M, the look)

How a presentation is built into a project: a site that carries its own talk, its own timers and its own speaker notes, instead of a slide file that lives somewhere else. It is drawn from two that ran in real rooms:

- **What We Talk About** (`inquiredu/what-we-talk-about`, `src/talk/`, built September 29, 2026): React, one list of beats shown three ways (a landing page, the talk as a book, and a stage), with a QR code back to the site and a plain-language way to edit.
- **Hands On** (`inquiredu/a-mn-hackathon`, `present.html`, built October 7 to 9, 2026): plain HTML, one session file behind every page, a session clock the presenter calls to order, timers you stretch without stopping, and speaker notes in a second window that drives the stage.

This kit is the reference implementation. A project can use the kit as it is, or build its own stage (in React, say) as long as it meets the **musts** below. Each rule says where it came from: **[WWTA]** What We Talk About, **[HO]** Hands On, **[new]** added here, usually to fix something one of them got wrong.

## The principles

1. **One source.** Every word, link, length, note and timer lives in one deck file, and every view reads it. Anything typed twice drifts. [both]
2. **Lengths, not clock times.** The stage and the plan say how long things run. The plan stays true when the room runs long. [HO]
3. **The stage keeps the state.** Other windows show it and send it commands. They never keep a copy of their own. [new]
4. **The room sees only what's for the room.** Speaker notes never appear on the shared screen. [HO]
5. **There's always a way back.** The site's address and a code to scan stay on the stage, for anyone who arrives late or wanders off. [WWTA]
6. **Rehearsal is safe.** A rehearsal never starts the real clock, and the real day never needs a button pressed to be right. [HO]
7. **Changes are seen, not just described.** Every edit comes with before and after pictures. [WWTA]
8. **Checked the way the browser reads it.** A brace nothing fills, a missing picture, a part that doesn't add up all fail a check before anyone in the room sees them. [HO]

## A. The deck file

- **Must** keep the whole talk in one file: the title, parts, slides, speaker notes, timers, links and the public address. [both]
- **Must** give the deck an `id` in kebab-case. It names everything the deck saves in a browser. [new]
- **Must** give every slide a stable `id` in kebab-case. Numbers come from a slide's position and are never typed. [WWTA]
- **Must** describe slides as data: a `kind`, plus the words that kind needs. Markup is built from the data, never from HTML strings, so the deck can't inject markup. [HO; WWTA's "never `dangerouslySetInnerHTML`"]
- **Must** allow an escape hatch for a one-off layout (`kind: "custom"` with a render function) that still follows the rule above. [new, for what WWTA's JSX beats could do]
- **Must** group slides into parts that each run as one unbroken stretch. Parts **should** have minutes, and the minutes **should** add up to the session's length. [WWTA parts; HO minutes]
- **Must** fill words from the deck with braces (`{title}`, `{url}`, `{length}`, `{build.length}`, `{mins}`), and a timer's length **must** stay live in the words. When the presenter stretches a pause from four minutes to six, "Four minutes in pairs" becomes "Six minutes in pairs" on the slide and in the notes. [HO braces; WWTA's `<Mins>` and `noteWithMins`, made general]
- **Must** give every slide speaker notes, even one line. [WWTA test]
- **Must** give every picture alt text, or mark it decorative. [WWTA test]

## B. The stage

- **Must** show one slide at a time, sized to read on a projector and on a screen shared small in a meeting. Type scales with the stage, not the window. [both]
- **Must** keep the address naming what's on screen (`present.html#parable`), so a link, a reload or the browser's back button lands on the same slide. An address with a number **should** still work. [WWTA routes; HO `#5`]
- **Must** show where the talk is: the part's name and length, the slide count, and a progress bar in the parts' colors. Jump buttons on the bar appear only where each keeps a 24px target (WCAG 2.5.8). [HO rail; WWTA bar]
- **Must** keep controls on screen for a mouse, and readable at rest (4.5:1). They **may** stay quiet until reached for. [HO, fixed: its faint controls fell under 2:1]
- **Must** work on a phone: controls wrap, tall slides scroll, a swipe moves along. [HO; WWTA swipe]
- **Should** ease each slide's parts in, one beat apart, and **must** not move at all under reduced motion. [WWTA]
- **Should** keep an embedded tool alive when the presenter leaves its slide and comes back. [new, HO rebuilt its frame each time]
- **Should** offer a blank screen (B or a full stop, which is what a clicker's blank button sends). [new]

## C. Keys

One table drives the stage, the presenter view, the help screen and the hint. Shortcuts with ⌘, Ctrl or Alt **must** be left to the browser: ⌘P prints and Ctrl+C copies. Neither should pause the clock or open it. [WWTA; HO got this wrong] Typing in a field **must** be left alone, and Space or Enter on a focused button **must** press that button.

| Key | Does | From |
| --- | --- | --- |
| → Space Page Down ↓ | Next slide | both |
| ← Page Up ↑ | Previous slide | both |
| Home, End | First and last slide | both |
| T | Start or pause this slide's timer; on the first slide, call the session to order | both, HO |
| + and − | A minute more or less, without stopping the timer | HO |
| S | Speaker notes in a second window (the Google Slides key) | HO |
| C | The session clock, large, with wait time | HO |
| P | Pause or resume the session clock | HO |
| N | Jump to where the plan says the room should be | HO |
| Q | The site's QR code, large | WWTA |
| B or . | Blank the screen; any key brings it back | new |
| F | Full screen | both |
| ? | Every key | new |
| Esc | Close what's open | both |

## D. Timers

- **Must** belong to a slide, with a length from 1 to 60 minutes, and run Ready, Running, Paused, Time, with the button saying what it will do (Start, Pause, Resume, Restart). [both]
- **Must** stretch and shrink by a minute without stopping. [HO; WWTA restarted the timer when its length changed]
- **Must** let several slides share one countdown by naming the same key, so a timer keeps counting from one slide to the next. [HO `timerKey`]
- **Must** remember a changed length in that browser, and **must** survive a reload while it runs. [both kept lengths; new: neither kept a running timer]
- **Should** show a bar of the time left, and turn a warning color at Time, and announce "Time." to screen readers. [WWTA bar and announce; HO color]

## E. The session clock and pace

- **Must** count the whole session down to the second, and count how far over once it passes the end. [HO]
- **Must** wait for the presenter's call to order (T, or the button). On the deck's own day it **may** count from the advertised start without one. On any other day it **must** wait, so a rehearsal starts clean. [HO]
- **Must** pause and resume without the pause counting, and reset to waiting. [HO]
- **Should** move between three places: large on the first slide, small in the corner, and large over the stage on a click, with wait-time countdowns for think time. [HO]
- **Should** show pace: a mark on the progress bar where the plan says the room should be, and in the notes, "4 min behind the plan". N jumps there. [new, built from HO's minutes and clock and WWTA's bar]
- **Should** offer a rehearsal address, `?at=25` for 25 minutes in, that never saves its pretend start. [new; HO's `?now=10:50` used clock times]

## F. The presenter view

- **Must** open in its own window (S) and **must** never be drawn on the stage. [HO; WWTA's overlay was seen by the room whenever it was open]
- **Must** show the current slide's title and notes, the next slide, the part and its planned length, the timer and the session clock, and **must** let the presenter move the slides, run the timer, call to order, pause, reset, start a wait and blank the screen. [HO]
- **Must** keep no state of its own. The stage sends its whole state, raw (end times, not formatted text), and the presenter view works out every figure with the same functions. Then the two can't disagree. A stage tab slowed down in the background doesn't slow the notes either. [new: HO's notes ran their own copy of the clock and missed pauses and resets]
- **Must** read alone as a script when no stage is open. [HO]
- **Should** take a clicker's keys when it has focus. [new]

## G. The way back

- **Must** show the site's address on the stage, as a link. [WWTA]
- **Must** show a QR code for it, small in a corner and large on Q, drawn in the page from the deck's address with no library loaded. It **must** step aside on phones. [WWTA drew it at build time with a staleness test; new: drawn at run time, so it can't go stale]
- **Should** offer "Open the site", which leaves full screen first. [HO]

## H. The review and the backup

- **Must** offer every slide as a page to read, with contents by part and an address for each slide. [WWTA book]
- **Should** show the speaker notes on request. [new]
- **Must** print one slide to a 16:9 page from the same deck, so the backup for a blocked network is made from the source and can't drift. [new: HO's backup slide deck was kept by hand and fell behind the site]

## I. What's saved, and privacy

- **Must** name every saved value and the notes channel for the deck (`present:<deck-id>:…`). Sites on one GitHub Pages account share an origin, so two talks on `inquiredu.org` otherwise share storage. [new]
- **Must** keep a call to order, running timers and a wait for that day only. Lengths **may** carry over. [HO]
- **Must** keep working when storage is blocked or in a private window. [both]
- **Must** load nothing from elsewhere by default: no analytics, no fonts, no libraries, no tracking. [both]

## J. Accessibility

- **Must** meet WCAG 2.2 AA where a check can tell, in both themes, at 1280px and 375px wide, with an automated scan of every slide (`node scripts/a11y.js`). [WWTA axe scan; HO's target]
- **Must** keep every text color pair at 4.5:1 in both themes, checked from the design system's own values (`node scripts/contrast.js`). [new]
- **Must** announce slide changes and timer ends politely, label every control, return focus when an overlay closes, and use a focus ring with two tones so it shows on light and dark slides. [both]
- **Must** say what a person still has to check: a screen reader, a real projector, a clicker. [both]

## K. Checks

- **Must** check the deck the way the pages read it: ids, kinds and their fields, parts in order and adding up, notes, alt text, pictures on disk, braces that something fills, timers in range and shared keys that agree, and every script parsing. [HO `check-session`; WWTA tests]
- **Must** test the rules (timers, clock, pace, braces, keys, storage, the QR code) apart from any page. [both]
- **Must** run the checks on every commit and push (git hooks) and every pull request (GitHub Actions), and the commit hook **must** stop credential files and anything shaped like a key. [HO]

## L. Docs and workflow

- **Must** keep a decision log: one line each, date · decision · why. [HO]
- **Must** keep a handoff: what's decided, what exists, what's left, and a starter prompt for a new chat. [HO]
- **Must** give an AI assistant its rules in `CLAUDE.md`. [both]
- **Should** edit from plain-language change lists, with before and after pictures (stage, review, phone) and a comparison page, and nothing merged or deployed without approval. [WWTA]
- **Must** say what was verified and what wasn't. [WWTA "Verified, and not"]

## M. The look

- **Must** take every color, typeface, radius and shadow from the project's design system through its semantic tokens (for inquiredu work, `inquiredu.css`: `surface-*`, `fg-*`, `action-*`, `status-*`). No raw values in components, and one palette per piece. [new]
- **Must** set text only in the pairs the design system names for each ground, so a slide's tone can't pair colors the brand never checked. [new, from the inquiredu README]
- **Must** self-host the design system's fonts, so the stage loads nothing from elsewhere. [the inquiredu README names the Present Kit for this]
- **Must** use the brand's logo files as they are, picked for the ground: never redrawn, retyped or recolored. [inquiredu]
- **Should** open on the design system's own title slide when it has one, and follow its rules for depth and motion (for inquiredu: flat grounds, lines before shadows, fades and short slides, one accent and one ✦ per view). [inquiredu]
- **May** keep a stage's fixed rail and corner controls where the brand's page rules have none: a stage is an instrument the presenter works, not a page to read. Record it as a departure. [new]

## Meeting the standard

A project meets the standard when `node scripts/check-all.js` passes, `node scripts/a11y.js` reports no violations, and a person has walked the stage once with the keyboard and once with the presenter view open in a second window. If a project builds its own stage, it copies `present/core.js` for the rules and `tests/` for their tests, and meets sections B to H with its own components.
