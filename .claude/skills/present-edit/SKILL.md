---
name: present-edit
description: Apply plain-language edits to a Present Kit deck (reword a slide, add or move a slide, change speaker notes or a timer, add a picture, adjust the look) and show before and after pictures. Use when the user describes changes to the talk or its slides, for example "pause-need: six minutes" or "after the quote, a new slide with the five rules".
---

# Apply edits to the deck

Read `docs/EDITING.md`; it is the method. With a change list:

1. **Parse** it into separate changes. Resolve each slide with `node scripts/preview.js map` (number, id, or part of the title). If a slide or an intent is ambiguous, ask instead of guessing.
2. **Branch.** Work on a branch, never on `main`.
3. **Before pictures:** `node scripts/preview.js shoot before <slides...>` (set `PREVIEW_BROWSER` to a Chrome path if Playwright's browser isn't installed).
4. **Apply** in `deck.js`: words, kinds, notes, timers, order. A new slide needs a unique kebab-case `id`, a `part`, a `kind` with its fields (`docs/DECK.md`), and speaker notes. Pictures go in `assets/` (about 900px wide) with real alt text. Shared look goes in `present/theme.css` or `present/slides.css`. Never type a length, link or address a brace can give.
5. **Verify:** `node scripts/check-all.js`, and `node scripts/a11y.js` for the slides that changed. Don't claim more than was run.
6. **After pictures and compare:** `node scripts/preview.js shoot after <slides...>`, then `node scripts/preview.js compare before after`. Look at `.preview/compare.html` yourself before showing it.
7. **Report per change:** done or not, what was assumed, and any wording drafted for the user, marked as a draft.
8. **Commit and push** to the branch. Open a pull request only when asked. Never merge or deploy without explicit approval.

Do not invent facts, quotes or figures. Say when a speaker note is a placeholder.
