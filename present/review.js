// The review presents each slide beside its speaker notes, with a quiet crossfade on navigation.
// Narrow screens stack the two. Stable slide anchors, keyboard controls, and the printable backup
// share the same deck as the stage.
import { lengthLabel, slideTitle } from "./core.js";
import { h, loadDeck, rich, say } from "./dom.js";
import { renderSlide } from "./kinds.js";
import { colorsFrom, deckToPptx } from "./pptx.js";

const { deck, model } = await loadDeck();
document.title = "Review · " + model.title;

const ctx = { model, mode: "review", timer: null, embeds: null };
const slides = model.slides;
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
const book = h("section", { class: "book", "aria-roledescription": "slide review", "aria-label": model.title },
  spread, h("div", { class: "book-nav" }, prevButton, folio, nextButton), live);
let at = Math.max(0, indexOf(location.hash));
let turning = null;

/** The slide in the reading spread. */
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

/** Change the spread without a decorative page-turn transition. */
function go(i) {
  i = Math.min(slides.length - 1, Math.max(0, i));
  if (i === at) return;
  turning?.cancel();
  at = i;
  show(i);
  if (!still.matches && typeof spread.animate === "function") {
    turning = spread.animate([{ opacity: .65 }, { opacity: 1 }], { duration: 160, easing: "ease-out" });
  }
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
      h("p", { class: "kicker" }, "Session reading"),
      h("h1", {}, rich(model.title, { model })),
      model.by && h("p", { class: "byline" }, rich(model.by, { model }))),
    h("div", { class: "tools" },
      h("a", { class: "tool", href: "./" }, "Overview"),
      contentsButton,
      h("a", { class: "tool primary", href: "present.html" }, "Present"),
      h("button", { type: "button", class: "tool", on: { click: () => window.print() } }, "Print or save as PDF"),
      h("button", { type: "button", class: "tool", title: "Every slide's words and notes, to edit in PowerPoint or Google Slides and hand back to Claude Code", on: { click: downloadPptx } }, "Download .pptx to edit"))),
  h("main", { class: "review" }, contents, book, h("div", { class: "print-pages" }, pages)));
show(at);

function toggleContents(open = contents.hidden) {
  contents.hidden = !open;
  contentsButton.setAttribute("aria-expanded", String(open));
  if (open) contents.querySelector("a")?.focus();
  else if (contents.contains(document.activeElement)) contentsButton.focus();
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
