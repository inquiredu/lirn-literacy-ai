# Handoff: [the talk's name]

Copy this file to `HANDOFF.md` at the root of the talk's project (the kit's own `HANDOFF.md` describes the kit, not your talk).

The record for whoever picks this talk up next, on another computer or in a new chat: what was decided and why, what exists, and what's left. Fill in the brackets; keep it short and true.

## The session

[Who it's for, how many, how long, where (in a room, on Meet, on Zoom), and the tone.]

## Decisions

The decisions that shape this talk, with the reason for each. One line each in `docs/DECISIONS.md` too.

- [Decision, and why.]

## What exists

| Page | Address | What it does |
| --- | --- | --- |
| Present | `present.html` | The stage |
| Speaker notes | `notes.html` | Opens from the stage with S; follows it and drives it |
| Review | `review.html` | Every slide as a page, with notes on request; prints as the backup |

Shared spaces and decks, all in `links` in `deck.js`:

| Link | What it is | Who owns it |
| --- | --- | --- |
| [name] | [what] | [account] |

## Verified, and not

- Verified: [what was run and seen: `node scripts/check-all.js`, `node scripts/a11y.js`, the stage walked with the keyboard, the notes window in a second window, a reload mid-timer]
- Not verified: [a real projector, a clicker, a screen reader, the live site]

## What's left

- [ ]

## Starter prompt for a new chat

> I'm working on "[the talk]", a presentation built with the Present Kit. Start by reading `CLAUDE.md`, then `HANDOFF.md`. Everything about the talk lives in `deck.js`; the rules are in `STANDARD.md`. Use made-up data only, keep WCAG 2.2 AA, and ask me before publishing anything.
