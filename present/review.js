// The review: the same slides as a book to read, for anyone who missed a part or comes back after.
// On a wide screen each spread is the slide on the left page and its speaker notes on the facing page, and a leaf
// turns around the spine to the next; on a narrow one, single pages lift away. Every slide keeps an address of its
// own (review.html#parable), and printing still gives one slide to a page: the backup deck, made from the deck.
import { lengthLabel, slideTitle } from "./core.js";
import { browserStorage, h, loadDeck, rich } from "./dom.js";
import { renderSlide } from "./kinds.js";

const { model } = await loadDeck();
document.title = "Review · " + model.title;
const NOTES_KEY = `present:${model.id}:review-notes`;
const storage = browserStorage();
let withNotes = false;
try { withNotes = storage?.getItem(NOTES_KEY) === "1"; } catch { /* private window */ }

const ctx = { model, mode: "review", timer: null, embeds: null };
const slides = model.slides;
const notesButton = h("button", { type: "button", class: "tool", "aria-pressed": String(withNotes), on: { click: () => setNotes(!withNotes) } }, "Notes in print");
const contentsButton = h("button", { type: "button", class: "tool", "aria-expanded": "false", "aria-controls": "contents", on: { click: () => toggleContents() } }, "Contents");

const contents = h("nav", { class: "contents", id: "contents", hidden: true, "aria-labelledby": "contents-title" },
  h("h2", { id: "contents-title" }, "Contents"),
  groups().map(({ part, slides: group }) => h("div", { class: "toc-part" },
    part && h("h3", {}, rich(part.title, { model }), part.minutes ? h("span", { class: "toc-len" }, " · " + lengthLabel(part.minutes)) : ""),
    h("ol", { start: String(group[0].n) }, group.map((s) => h("li", {}, h("a", { href: "#" + s.id, on: { click: () => toggleContents(false) } }, slideTitle(s, model))))))));

// The printed backup: every slide in order, one to a page. Hidden on screen, where the book shows them.
const pages = slides.map((s) => h("article", { class: "page", id: "print-" + s.id },
  h("div", { class: "slide-frame page-frame" }, renderSlide(s, ctx)),
  h("aside", { class: "page-notes", "aria-label": "Speaker notes" }, h("p", { class: "label" }, "Speaker notes"), notesParagraphs(s))));

// ---------- The book ----------
const wide = matchMedia("(min-width: 900px)");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const leftSlot = h("div", { class: "bpage bpage-left" });
const rightSlot = h("div", { class: "bpage bpage-right" });
const spread = h("div", { class: "spread" }, leftSlot, rightSlot);
const folio = h("span", { class: "folio" });
const prevButton = h("button", { type: "button", class: "turn", "aria-label": "Previous page", on: { click: () => go(at - 1) } }, "‹");
const nextButton = h("button", { type: "button", class: "turn", "aria-label": "Next page", on: { click: () => go(at + 1) } }, "›");
const live = h("p", { class: "sr-only", "aria-live": "polite" });
const book = h("section", { class: "book", "aria-roledescription": "book", "aria-label": model.title },
  spread, h("div", { class: "book-nav" }, prevButton, folio, nextButton), live);
let at = Math.max(0, indexOf(location.hash));
let turning = null;

/** The slide, laid out for a left page. A fresh copy each time, so a turning leaf and the page under it never share nodes. */
function slidePage(i) {
  const s = slides[i];
  return h("div", { class: "slide-frame book-frame" }, renderSlide(s, ctx));
}

/** The facing page: where it sits in the session, its title, and what the presenter says. */
function notesPage(i) {
  const s = slides[i];
  return h("div", { class: "notes-page" },
    h("p", { class: "running-head" }, s.part ? rich(s.part.title, { model }) : "", h("span", {}, String(s.n) + " / " + slides.length)),
    h("h2", { class: "notes-title" }, slideTitle(s, model)),
    h("div", { class: "notes-body" }, notesParagraphs(s)),
    h("p", { class: "folio-n", "aria-hidden": "true" }, String(s.n)));
}

/** On a narrow screen one page holds both: the slide, then its notes. */
function singlePage(i) {
  return h("div", { class: "single" }, slidePage(i), notesPage(i));
}

function fill(slot, node) { slot.replaceChildren(node); slot.scrollTop = 0; }

function show(i) {
  if (wide.matches) { fill(leftSlot, slidePage(i)); fill(rightSlot, notesPage(i)); }
  else { fill(leftSlot, singlePage(i)); rightSlot.replaceChildren(); }
  spread.classList.toggle("is-single", !wide.matches);
  folio.textContent = `${slides[i].n} of ${slides.length}`;
  prevButton.disabled = i === 0;
  nextButton.disabled = i === slides.length - 1;
  live.textContent = `Page ${slides[i].n} of ${slides.length}: ${slideTitle(slides[i], model)}`;
  if (location.hash.slice(1) !== slides[i].id) history.replaceState(null, "", "#" + slides[i].id);
}

/** Turn to page i: a leaf swings around the spine (or a single page lifts away), then the spread settles. */
function go(i) {
  i = Math.min(slides.length - 1, Math.max(0, i));
  if (i === at) return;
  if (turning) turning.finish();
  const from = at;
  at = i;
  if (still.matches || typeof Element.prototype.animate !== "function") return show(i);
  const forward = i > from;
  const duration = 760;
  const easing = "cubic-bezier(.645,.045,.355,1)";
  const leaf = h("div", { class: "leaf " + (wide.matches ? (forward ? "leaf-forward" : "leaf-back") : "leaf-single"), "aria-hidden": "true" });
  const face = (node, side) => h("div", { class: `leaf-face ${side} bpage ${node.className.includes("notes") ? "bpage-right" : "bpage-left"}` }, node, h("div", { class: "shade" }));

  let frames;
  let after = () => show(i);
  if (wide.matches) {
    if (forward) {
      // The right page lifts from the spine and lands on the left as the next slide; the next notes wait beneath
      leaf.append(face(notesPage(from), "front"), face(slidePage(i), "back"));
      fill(rightSlot, notesPage(i));
      frames = [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-180deg)" }];
    } else {
      leaf.append(face(slidePage(from), "front"), face(notesPage(i), "back"));
      fill(leftSlot, slidePage(i));
      frames = [{ transform: "rotateY(0deg)" }, { transform: "rotateY(180deg)" }];
    }
  } else {
    // One page: it swings up off the spine toward the reader and away (or, going back, swings down into place),
    // solid all the way, with the next page already lying beneath
    if (book.getBoundingClientRect().top < 0) book.scrollIntoView({ block: "start", behavior: "instant" });
    leaf.append(face(singlePage(forward ? from : i), "front"));
    if (forward) fill(leftSlot, singlePage(i));
    const flat = { transform: "rotateY(0deg)" }, up = { transform: "rotateY(-92deg)" };
    frames = forward ? [flat, up] : [up, flat];
  }
  spread.append(leaf);
  // Light falls off the leaf as it rises toward the reader, and comes back as it lies down
  const rising = [{ opacity: 0 }, { opacity: .32 }], settling = [{ opacity: .32 }, { opacity: 0 }];
  leaf.querySelectorAll(".shade").forEach((s, n) => s.animate(
    n === 0 && (wide.matches || forward) ? rising : settling, { duration, easing, fill: "both" }));
  turning = leaf.animate(frames, { duration, easing, fill: "forwards" });
  const done = () => { leaf.remove(); turning = null; after(); };
  turning.finished.then(done, done);
  folio.textContent = `${slides[i].n} of ${slides.length}`;
}

function indexOf(hash) {
  const id = decodeURIComponent((hash || "").replace(/^#/, ""));
  const n = slides.findIndex((s) => s.id === id || String(s.n) === id);
  return n;
}

// Keys, the way a reader expects: arrows, Page Up and Down, Space, Home and End. ⌘, Ctrl and Alt stay with the browser.
document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.("input, textarea, select, [contenteditable]")) return;
  const map = { ArrowRight: at + 1, PageDown: at + 1, " ": e.shiftKey ? at - 1 : at + 1, ArrowLeft: at - 1, PageUp: at - 1, Home: 0, End: slides.length - 1 };
  if (e.key === "Escape") return toggleContents(false);
  if (!(e.key in map) || e.target.closest?.("button, a") && e.key === " ") return;
  e.preventDefault();
  go(map[e.key]);
});

// A swipe turns the page on a phone or a tablet
let swipe = null;
spread.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") swipe = { x: e.clientX, y: e.clientY }; });
spread.addEventListener("pointerup", (e) => {
  if (!swipe) return;
  const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
  swipe = null;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(at + (dx < 0 ? 1 : -1));
});

window.addEventListener("hashchange", () => { const i = indexOf(location.hash); if (i >= 0) go(i); });
wide.addEventListener("change", () => show(at));

document.body.append(
  h("header", { class: "review-head" },
    h("div", { class: "head-words" },
      h("p", { class: "kicker" }, "Review"),
      h("h1", {}, rich(model.title, { model })),
      model.by && h("p", { class: "byline" }, rich(model.by, { model }))),
    h("div", { class: "tools" },
      contentsButton,
      h("a", { class: "tool primary", href: "present.html" }, "Present"),
      notesButton,
      h("button", { type: "button", class: "tool", on: { click: () => window.print() } }, "Print or save as PDF"))),
  h("main", { class: "review" }, contents, book, h("div", { class: "print-pages" }, pages)));
setNotes(withNotes);
show(at);

function toggleContents(open = contents.hidden) {
  contents.hidden = !open;
  contentsButton.setAttribute("aria-expanded", String(open));
  if (open) contents.querySelector("a")?.focus();
}

function setNotes(on) {
  withNotes = on;
  document.body.classList.toggle("with-notes", on);
  notesButton.setAttribute("aria-pressed", String(on));
  try { storage?.setItem(NOTES_KEY, on ? "1" : "0"); } catch { /* private window */ }
}

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
