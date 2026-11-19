# The deck file

One file describes a whole talk, and every view reads it: the stage, the speaker notes, the review and the printed backup. To start a new talk, copy `deck.js`, change what's inside, and run `node scripts/check.js`.

## The deck, field by field

```js
export default {
  id: "school-board-oct",          // kebab-case; names what the deck saves in the browser and its notes channel
  title, subtitle, by,             // shown on the stage, in the review, and in braces: {title}
  url: "https://…/",               // the public address: printed on the stage and drawn as its QR code
  links: { site: "./", … },        // links for {links.name}; site is where "Open the site" goes
  theme: "light",                  // inquiredu's Ivory (the default), or "dark" for Night
  art: { dark: "assets/…svg" },    // optional: a drawing for the bare side of dark slides (title, sections, night); see Drawings
  logo: { light: "assets/inquiredu-wordmark.svg", dark: "assets/inquiredu-wordmark-reversed.svg", alt: "inquiredu" },
                                   // the brand's files: one for light grounds, one for dark; the title slide and review use it
  mark: { src: "assets/inquiredu-monogram.svg" },   // the small mark in the rail
  length: 60,                      // minutes for the session clock; leave it out and the parts' minutes decide
  day: "2026-11-06", start: "10:00", timeZone: "America/Chicago",   // optional: on that day, the clock counts from start
  clock: false,                    // optional: no session clock at all
  qr: false,                       // optional: no QR tile in the corner (Q and link slides still work)
  pace: false,                     // optional: no pace mark on the progress bar
  parts: [ … ],
  slides: [ … ]
};
```

## Parts

```js
{ id: "trust", title: "1 · Trust", minutes: 12, tone: "inverse", where: "Main room" }
```

| Field | What it's for |
| --- | --- |
| `id` | kebab-case, for `{trust.length}` and for slides to name |
| `title` | Shown in the rail, the plan, the contents and the notes |
| `minutes` | How long the part runs. Parts run end to end; together they should make `length` (the check says if they don't) |
| `tone` | The ground of the part's section slide: `inverse` (the default), `accent`, `water`, `warm` or `night`. See Tones below |
| `where` | Optional, a place: "Main room", "Breakout rooms". Shown in the rail and the plan |
| `art` | Optional, a drawing for the light statement, list and steps slides in this part (see Drawings) |

Each part's slides sit together in one stretch. The check fails a slide that comes back to an earlier part.

## Slides

Every slide has:

| Field | What it's for |
| --- | --- |
| `id` | kebab-case and unique. The address (`present.html#trust`), the review's anchors and the preview tool use it. Numbers come from position |
| `part` | The part's id |
| `kind` | One of the kinds below |
| `notes` | What the presenter says or does. Shown only in the speaker notes and, on request, in the review. A blank line starts a new paragraph |
| `title` | Optional: a short name for the rail, the notes and the contents when the heading is long |
| `tone` | Optional: the slide's ground (see Tones below), or leave it out for its kind's default |
| `timer` | Optional: minutes (`4`), or `{ minutes: 25, key: "rooms" }` when several slides share one countdown |

Words anywhere on a slide may use `**strong**` (shown in violet, the one accent, in headings), `*emphasis*`, a line break (`\n`), and braces.

### Tones

Each tone is a ground from the inquiredu design system, with the text pair the brand names for it, checked at 4.5:1 in both themes.

| Tone | Ground | Default for |
| --- | --- | --- |
| `inverse` | The full-bleed band: navy in Ivory, ivory in Night | `section` |
| `water` | Soft ice behind navy text | `pause` |
| `accent` | Peach with navy text. The brand's one warm highlight: use it sparingly | |
| `warm` | Soft peach with warm text | |
| `night` | The slide wears the Night theme, whatever the deck's theme | `title` |

### Kinds

| Kind | Fields | Use it for |
| --- | --- | --- |
| `title` | `heading`, `kicker`, `sub`, `by`, `image`, `sun: false` | The opening, after the brand's title slide: the logo and an index label along the top, the words low on the left, the sun at the edge (an `image` takes its place) |
| `statement` | `heading`, `kicker`, `big`, `body`, `url: true` (the address as a pill), `foot` | One idea, a question, a call to action |
| `section` | `heading`, `body`, `image` (`frame: true` puts a photo on a raised frame), `number` | A part's banner, on the full-bleed band unless its part names another tone. The number defaults to the part's position |
| `pause` | `heading`, `kicker`, `body`, `foot`, with a `timer` | Time for the room: a question and a countdown beside it |
| `steps` | `heading`, `steps` (a list), `kicker`, `foot` | Instructions |
| `cards` | `cards` (`kicker`, `heading`, `body`, `key: true` for the featured one, framed and starred), `heading`, `body`, `foot` | Two to four side by side: pairs, meanings, awards |
| `split` | `image` (`src`, `alt`, `side: "left"`), `heading`, `kicker`, `body`, `quote`, `cite`, `foot` | Words beside a picture |
| `quote` | `text`, `cite` | One line, said and left to sit |
| `stats` | `stats` (`num`, `label`), `heading`, `kicker`, `body`, `cite` | Figures that carry the point |
| `list` | `items` (`name`, `why`, `later: true` for fainter, `key: true` for the ✦), `heading`, `kicker`, `foot` | Numbered rungs: levels, rules, steps with reasons |
| `plan` | `heading`, `url: true`, `foot` | The session from the parts: how long each runs, never when it starts |
| `code` | `code`, `heading`, `caption` | A few lines of code, shown as typed (braces in `code` are left alone) |
| `embed` | `src`, `heading`, `frameTitle`, `caption` | Something live on the stage. It keeps its state when you come back. In the review it becomes a link |
| `link` | `heading`, `body`, `foot` | The address large, with its QR code |
| `custom` | `render({ h, rich, mode, model, slide })` | A one-off layout. Build elements with `h(tag, props, ...children)` and words with `rich(text)`; never HTML strings |

`body` may be one string or a list of paragraphs. The ✦ marks one key item per slide (the check fails a second), and there's no emoji anywhere in an inquiredu deck. Pictures are `{ src, alt }`; a picture that says nothing (a flourish) is `{ src, decorative: true }`. The check fails a picture without either.

## Drawings

A talk can put a drawing in the bare side of its slides, behind the words and silent to a screen reader. `art.dark` on the deck goes on dark slides (the title, section slides, a `night` slide), at the right edge; each part's `art` goes on the light `statement`, `list` and `steps` slides in that part, in the right third, and the words keep the left. Other kinds fill their width and take none. On a slide, `art: false` leaves it out and `art: "assets/…svg"` picks its own, on any kind. Drawings step aside on a phone and in the review's narrow pages, and print with the backup. The rule is `artFor` in `present/core.js`; the check fails a drawing that isn't on disk.

## Braces

Write a length or a name in braces and it follows the deck, so nothing is typed twice. They work in every word of the deck except `code`, `src` and `id`.

| Write | Reads | What it is |
| --- | --- | --- |
| `{title}`, `{subtitle}`, `{by}` | The deck's words | |
| `{url}` | example.org/talk | The address, as people read it aloud |
| `{length}` | 30 minutes, 2 hours | The session |
| `{trust.length}` | 12 minutes | A part, by its id |
| `{mins}` | 4 minutes | This slide's timer, as the presenter last set it, live on the slide and in the notes |
| `{rooms.mins}` | 25 minutes | A timer by its key |
| `{links.site}` | https://… | A link, for notes and chat messages |
| `{count}`, `{parts}` | 17, 5 | How many slides and parts |

Add `:words` for "four minutes", `:number` for "4", or `:unit` for "minutes". Start with a capital to capitalize: `{Mins:words} in pairs` reads "Four minutes in pairs". Double a brace to show it as typed: `{{mins}}` reads `{mins}`. A brace nothing fills stays on the page as typed, and the check fails it.

Clock times are deliberately missing. The stage says how long things run, never when they start, so the plan stays true when the room runs long.

## Timers

A slide with `timer` shows a countdown beside it. T starts or pauses it, + and − add or take away a minute without stopping it, and Reset puts it back. Slides that name the same `key` share one countdown, so it keeps counting from one to the next (two breakout-room slides, say). The presenter's lengths are remembered in that browser; running timers are kept for the day, so a reload doesn't lose them. Lengths run from 1 to 60 minutes.

## The session clock

`length` minutes (or the parts' minutes). It waits on the first slide for the call to order (T, or the button), then lives in the rail's corner; C or a click shows it large on glass, with wait-time countdowns (1, 2, 3, 5 minutes) for think time. P pauses it, and a pause doesn't count. With `day`, `start` and `timeZone` set, it counts from the advertised start on that day without a button, and waits on any other day, so a rehearsal starts clean. Rehearse at any point with `present.html?at=25`, which is 25 minutes in; nothing about a rehearsal is saved.

Pace: with minutes on every part, the plan spreads each part's minutes over its slides. A small mark on the progress bar shows where the plan says the room should be. The speaker notes say "4 min behind the plan" or "On plan", and N jumps there.

## The research library

`deck.library` is the reading list at `library.html`, kept in `library.js` and imported at the top of `deck.js`. `links.library` is its address. Its fields, and the rule for adding a source, are in `docs/LIBRARY.md`.

