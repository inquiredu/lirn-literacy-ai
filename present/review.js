// The review: the talk as a book, turned the way What We Talk About's book turns. A Contents spread comes first; then
// each slide sits on the left page with its speaker notes on the facing page, and on a narrow screen one page holds
// both. A turn slides the next spread in from the side it comes from as it fades up; reduced motion turns at once.
// Every spread has an address (#contents, #parable, #12), "Show all pages on one scroll" lays the whole book out to
// read down, and printing gives one slide to a page with its notes: the backup deck.
import { lengthLabel, slideTitle, spreadFromHash } from "./core.js";
import { h, loadDeck, rich, say } from "./dom.js";
import { renderSlide } from "./kinds.js";
import { colorsFrom, deckToPptx } from "./pptx.js";

const { deck, model } = await loadDeck();
document.title = "Review · " + model.title;

const ctx = { model, mode: "review", timer: null, embeds: null };
const slides = model.slides;
const LAST = slides.length;   // spread 0 is the Contents; spread n is slide n with its notes

// The printed backup: every slide in order, one to a page. Hidden on screen, where the book shows them.
const pages = slides.map((s) => h("article", { class: "page", id: "print-" + s.id },
  h("div", { class: "slide-frame page-frame" }, renderSlide(s, ctx)),
  h("aside", { class: "page-notes", "aria-label": "Speaker notes" }, h("p", { class: "label" }, "Speaker notes"), notesParagraphs(s))));

// ---------- The book ----------
const wide = matchMedia("(min-width: 900px)");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const spread = h("div", { class: "spread" });
const where = h("span", { class: "where" });
const prevButton = h("button", { type: "button", class: "tool", on: { click: () => turn(at - 1) } }, h("span", { "aria-hidden": "true" }, "←"), "Previous");
const nextButton = h("button", { type: "button", class: "tool", on: { click: () => turn(at + 1) } }, "Next", h("span", { "aria-hidden": "true" }, "→"));
const contentsButton = h("button", { type: "button", class: "tool", on: { click: () => open(0) } }, "Contents");
const flatButton = h("button", { type: "button", class: "tool", "aria-pressed": "false", on: { click: () => setFlat(!flat) } }, "Show all pages on one scroll");
const book = h("section", { class: "book", "aria-roledescription": "book", "aria-label": model.title },
  h("div", { class: "book-tools" }, contentsButton, flatButton),
  spread,
  h("div", { class: "book-nav" }, prevButton, where, nextButton));
let at = Math.max(0, spreadFromHash(model, location.hash));
let flat = false;

/** The address and the words for a spread: #contents, or the slide's own id. */
const addressOf = (i) => (i === 0 ? "contents" : slides[i - 1].id);
const labelOf = (i) => (i === 0 ? "Contents" : `Slide ${i} of ${LAST}`);

/** A page of the book. side: l and r on a spread, c alone. */
function bookPage(kind, side, label, ...children) {
  return h("article", { class: "bpage bpage-" + kind, "data-side": side, "aria-label": label, tabindex: "-1" }, children);
}

/** The slide, filling a left page. */
function slideFrame(s) {
  return h("div", { class: "slide-frame book-frame" }, renderSlide(s, ctx));
}

/** The facing page's words: where the slide sits in the session, its title, what the presenter says, the folio. */
function notesWords(s) {
  return [
    h("p", { class: "running-head" }, s.part ? rich(s.part.title, { model }) : "", h("span", {}, `${s.n} / ${LAST}`)),
    h("h2", { class: "notes-title" }, slideTitle(s, model)),
    h("div", { class: "notes-body" }, notesParagraphs(s)),
    h("p", { class: "folio-n", "aria-hidden": "true" }, String(s.n))];
}

/** The Contents, by part, each slide with its number; on a spread the parts run across both pages. */
function contentsPages(asOne) {
  const parts = groups();
  const page = (side, list, first) => bookPage("contents", side, first ? "Contents" : "Contents, continued",
    first && h("h2", { class: "contents-title" }, "Contents"),
    list.map(({ part, slides: group }) => h("div", { class: "toc-part" },
      part && h("h3", {}, rich(part.title, { model }), part.minutes ? h("span", { class: "toc-len" }, " · " + lengthLabel(part.minutes)) : ""),
      h("ol", { class: "toc" }, group.map((s) => h("li", {},
        h("a", { href: "#" + s.id, on: { click: (e) => { e.preventDefault(); open(s.n); } } },
          h("span", {}, slideTitle(s, model)), h("span", { class: "pn" }, String(s.n)))))))));
  if (asOne) return [page("c", parts, true)];
  // Split where the two pages come out closest in lines: a part's heading and its slides, and the title on the left
  const lines = (list) => list.reduce((n, g) => n + 2 + g.slides.length, 0);
  let cut = 1, best = Infinity;
  for (let k = 1; k < parts.length; k++) {
    const gap = Math.abs(3 + lines(parts.slice(0, k)) - lines(parts.slice(k)));
    if (gap < best) { best = gap; cut = k; }
  }
  return [page("l", parts.slice(0, cut), true), page("r", parts.slice(cut), false)];
}

/** The pages of spread i: on a wide screen, two facing pages; on a narrow one, a single page. */
function pagesOf(i) {
  if (i === 0) return contentsPages(!wide.matches);
  const s = slides[i - 1];
  if (!wide.matches) return [bookPage("single", "c", `Slide ${s.n}: ${slideTitle(s, model)}`, slideFrame(s), h("div", { class: "notes-page" }, notesWords(s)))];
  return [
    bookPage("slide", "l", `Slide ${s.n}: ${slideTitle(s, model)}`, slideFrame(s)),
    bookPage("notes", "r", `Speaker notes for slide ${s.n}`, h("div", { class: "notes-page" }, notesWords(s)))];
}

/**
 * Lay spread i open. dir is the way the reader is going: 1 slides the new pages in from the right, -1 from the left,
 * 0 (a jump from the contents, a resize) just shows them. New pages are new nodes, so the CSS turn plays as they land.
 */
function show(i, dir = 0) {
  at = i;
  spread.classList.toggle("turn-f", dir > 0);
  spread.classList.toggle("turn-b", dir < 0);
  const shown = pagesOf(i);
  spread.replaceChildren(...shown);
  spread.classList.toggle("two", shown.length === 2);
  where.textContent = labelOf(i);
  prevButton.disabled = i === 0;
  nextButton.disabled = i === LAST;
  mark(i);
}

/** Keep the address on what's open, without adding to the history. */
function mark(i) {
  if (location.hash.slice(1) !== addressOf(i)) history.replaceState(null, "", "#" + addressOf(i));
}

/** Turn to spread i, a page at a time or several, and say where the reader is. */
function turn(i) {
  i = Math.min(LAST, Math.max(0, i));
  if (flat || i === at) return;
  show(i, Math.sign(i - at));
  // A long notes page leaves the reader low on the page: bring the top of the new spread back into view
  if (spread.getBoundingClientRect().top < 0) spread.scrollIntoView({ block: "start" });
  say(i === 0 ? "Contents" : `${labelOf(i)}: ${slideTitle(slides[i - 1], model)}`);
}

/** Open spread i from the contents: no turn, and focus goes to the page that opened, since the link is gone. */
function open(i) {
  if (flat) {
    const target = spread.querySelector(`[data-spread="${i}"]`);
    target?.scrollIntoView({ block: "start" });
    target?.focus({ preventScroll: true });
    at = i; mark(i);
    return;
  }
  show(i, 0);
  if (spread.getBoundingClientRect().top < 0) spread.scrollIntoView({ block: "start" });
  spread.querySelector(".bpage")?.focus({ preventScroll: true });
}

// ---------- All pages on one scroll ----------
/** Every page in one column, to read down: the contents, then each slide with its notes beneath. */
function layFlat() {
  const all = [...contentsPages(true), ...slides.map((s) => bookPage("single", "c", `Slide ${s.n}: ${slideTitle(s, model)}`, slideFrame(s), h("div", { class: "notes-page" }, notesWords(s))))];
  all.forEach((p, i) => { p.dataset.spread = String(i); });
  spread.classList.remove("turn-f", "turn-b", "two");
  spread.replaceChildren(...all);
}

// On one scroll the address follows the last page whose top has passed the top third of the window, so switching
// back to the book opens the page being read
let reading = 0;
addEventListener("scroll", () => {
  if (!flat || reading) return;
  reading = requestAnimationFrame(() => {
    reading = 0;
    let i = 0;
    for (const p of spread.children) {
      if (p.getBoundingClientRect().top > innerHeight / 3) break;
      i = Number(p.dataset.spread);
    }
    if (i !== at) { at = i; mark(i); }
  });
}, { passive: true });

function setFlat(on) {
  flat = on;
  flatButton.setAttribute("aria-pressed", String(on));
  book.classList.toggle("is-flat", on);
  if (on) {
    const keep = at;
    layFlat();
    if (keep > 0) spread.querySelector(`[data-spread="${keep}"]`)?.scrollIntoView({ block: "start" });
    say("Showing all pages on one scroll.");
  } else {
    show(at);
    book.scrollIntoView({ block: "start" });
    say("Showing one spread at a time.");
  }
}

// Keys, the way a reader expects: arrows, Page Up and Down, Space, Home and End. ⌘, Ctrl and Alt stay with the
// browser, and on one scroll every key does what it does on any page.
document.addEventListener("keydown", (e) => {
  if (flat || e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.("input, textarea, select, [contenteditable]")) return;
  const map = { ArrowRight: at + 1, PageDown: at + 1, " ": e.shiftKey ? at - 1 : at + 1, ArrowLeft: at - 1, PageUp: at - 1, Home: 0, End: LAST };
  if (!(e.key in map) || e.target.closest?.("button, a") && e.key === " ") return;
  e.preventDefault();
  turn(map[e.key]);
});

// A swipe turns the page on a phone or a tablet
let swipe = null;
spread.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") swipe = { x: e.clientX, y: e.clientY }; });
spread.addEventListener("pointerup", (e) => {
  if (!swipe || flat) return;
  const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
  swipe = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) turn(at + (dx < 0 ? 1 : -1));
});

window.addEventListener("hashchange", () => { const i = spreadFromHash(model, location.hash); if (i >= 0) (flat ? open(i) : turn(i)); });
wide.addEventListener("change", () => { if (!flat) show(at); });

document.body.append(
  h("header", { class: "review-head" },
    h("div", { class: "head-words" },
      h("p", { class: "kicker" }, "Session reading"),
      h("h1", {}, rich(model.title, { model })),
      model.by && h("p", { class: "byline" }, rich(model.by, { model }))),
    h("div", { class: "tools" },
      h("a", { class: "tool", href: "./" }, "Overview"),
      h("a", { class: "tool primary", href: "present.html" }, "Present"),
      h("button", { type: "button", class: "tool", on: { click: () => window.print() } }, "Print or save as PDF"),
      h("button", { type: "button", class: "tool", title: "Every slide's words and notes, to edit in PowerPoint or Google Slides and hand back to Claude Code", on: { click: downloadPptx } }, "Download .pptx to edit"))),
  h("main", { class: "review" }, book, h("div", { class: "print-pages" }, pages)));
show(at);

function notesParagraphs(s) {
  return String(s.notes || "No notes for this slide.").split(/\n{2,}/).map((p) => h("p", {}, rich(p, { model, slide: s })));
}

function groups() {
  const out = [];
  slides.forEach((s) => {
    const last = out[out.length - 1];
    if (last && last.part === s.part) last.slides.push(s);
    else out.push({ part: s.part, slides: [s] });
  });
  return out;
}

// The deck as a PowerPoint file for editing words, built here from deck.js so it is never out of date. Colors come
// from the talk's own tokens in the light theme; the file is for words, and its look never travels back.
function downloadPptx() {
  const probe = h("div", { "data-theme": "light", hidden: true });
  document.body.append(probe);
  const style = getComputedStyle(probe);
  const colors = colorsFrom((name) => style.getPropertyValue("--" + name).trim());
  probe.remove();
  const blob = new Blob([deckToPptx(deck, { colors })], { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" });
  const link = h("a", { href: URL.createObjectURL(blob), download: (model.id || "deck") + ".pptx" });
  document.body.append(link);
  link.click();
  setTimeout(() => { URL.revokeObjectURL(link.href); link.remove(); }, 1000);
  say("Downloaded " + (model.id || "deck") + ".pptx");
}
