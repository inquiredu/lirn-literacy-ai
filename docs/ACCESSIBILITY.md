# Accessibility

The target is WCAG 2.2 AA, in both inquiredu themes (Ivory and Night), at 1280px and at 375px wide.

## Checked by a script

- `node scripts/a11y.js` (with `THEME=light` or `THEME=dark`) runs axe on every slide of the stage, the speaker notes, the review, the landing page and the sample's embedded tool, at 1280px and 375px. On October 11, 2026, after the move to the inquiredu design system, the sample deck had no violations in either theme (21 pages and slides).
- `node scripts/contrast.js` reads the brand's own values from `present/inquiredu.css` and checks the 53 pairs the kit uses, text at 4.5:1 and the focus ring and the bar's current mark at 3:1, in Ivory and Night. It also fails a token the kit's CSS names that nothing defines. It runs with the other checks. The brand's own build checks its 104 pairs too.
- `node scripts/check.js` fails a picture without alt text (or `decorative: true`).

## Built in

- The stage announces each slide politely ("Slide 6 of 17: What do you need from a stage?"), a timer at "Time.", and every change to the clock, through one live region.
- Every control has a name; the timer, the wait buttons and the clock are labeled groups; wait buttons and the blank button say whether they're pressed.
- Dialogs (the QR code and the keys) are native, so focus moves in and comes back, and Escape closes them. The open session clock sends focus to "Back to the corner" and returns it to the clock face when it closes.
- The focus ring is the brand's: a page-colored gap, then a cyan ring (cyan-700 in Ivory at 3.3:1, cyan-600 in Night at 7.8:1).
- Controls are readable at rest, 4.5:1. They used to fade until hovered, and that fails for anyone who can't see them.
- The progress bar's jump buttons appear only where each keeps a 24px target (WCAG 2.5.8). Narrower, the bar shows progress and nothing more, and the arrows and keys still move.
- Under reduced motion nothing eases in, glides or fades.
- Touch targets are at least 44px on a coarse pointer.

## Still needs a person

- A pass with a screen reader: VoiceOver with Safari, and NVDA with Chrome, over the stage, the timer, the clock and its wait time, the speaker notes and the review.
- The keyboard alone, through every control, in full screen and out.
- A real projector, a real clicker, and a meeting app sharing the stage tab.
- Zoom to 200% and 400% on the review.
- Any `embed` or `custom` slide: what runs inside an embed is that page's own responsibility, and the scan only sees its frame.

An automated scan catches about a third of real problems. It can't certify a deck on its own.
