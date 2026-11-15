// The review: the same slides as pages to read, for anyone who missed a part or comes back after.
// Contents by part, every slide with an address of its own (review.html#parable), the speaker notes on
// request, and a print layout of one slide to a page: the backup deck, made from the deck, so it can't drift.
import { lengthLabel, slideTitle } from "./core.js";
import { browserStorage, h, loadDeck, rich } from "./dom.js";
import { logoFor, renderSlide } from "./kinds.js";

const { model } = await loadDeck();
document.title = "Review · " + model.title;
const NOTES_KEY = `present:${model.id}:review-notes`;
const storage = browserStorage();
let withNotes = false;
try { withNotes = storage?.getItem(NOTES_KEY) === "1"; } catch { /* private window */ }

const ctx = { model, mode: "review", timer: null, embeds: null };
const notesButton = h("button", { type: "button", class: "tool", "aria-pressed": String(withNotes), on: { click: () => setNotes(!withNotes) } }, "Speaker notes");

const contents = h("nav", { class: "contents", "aria-labelledby": "contents-title" },
  h("h2", { id: "contents-title" }, "Contents"),
  groups().map(({ part, slides }) => h("div", { class: "toc-part" },
    part && h("h3", {}, rich(part.title, { model }), part.minutes ? h("span", { class: "toc-len" }, " · " + lengthLabel(part.minutes)) : ""),
    h("ol", { start: String(slides[0].n) }, slides.map((s) => h("li", {}, h("a", { href: "#" + s.id }, slideTitle(s, model))))))));

const pages = model.slides.map((s) => h("article", { class: "page", id: s.id, "aria-labelledby": s.id + "-n" },
  h("p", { class: "page-n", id: s.id + "-n" }, h("span", { class: "sr-only" }, "Slide "), String(s.n), h("span", { class: "sr-only" }, ": " + slideTitle(s, model))),
  h("div", { class: "slide-frame page-frame" }, renderSlide(s, ctx)),
  h("aside", { class: "page-notes", "aria-label": "Speaker notes" },
    h("p", { class: "label" }, "Speaker notes"),
    String(s.notes || "No notes for this slide.").split(/\n{2,}/).map((p) => h("p", {}, rich(p, { model, slide: s }))))));

document.body.append(
  h("header", { class: "review-head" },
    logoFor(model, model.theme === "dark") && h("img", { class: "logo", src: logoFor(model, model.theme === "dark"), alt: model.logo.alt || "" }),
    h("p", { class: "kicker" }, "Review"),
    h("h1", {}, rich(model.title, { model })),
    model.subtitle && h("p", { class: "lede" }, rich(model.subtitle, { model })),
    model.by && h("p", { class: "byline" }, "by ", rich(model.by, { model })),
    h("div", { class: "tools" },
      h("a", { class: "tool primary", href: "present.html" }, "Present"),
      notesButton,
      h("button", { type: "button", class: "tool", on: { click: () => window.print() } }, "Print or save as PDF"))),
  h("main", { class: "review" }, contents, pages));
setNotes(withNotes);

function setNotes(on) {
  withNotes = on;
  document.body.classList.toggle("with-notes", on);
  notesButton.setAttribute("aria-pressed", String(on));
  try { storage?.setItem(NOTES_KEY, on ? "1" : "0"); } catch { /* private window */ }
}

function groups() {
  const out = [];
  model.slides.forEach((s) => {
    const last = out[out.length - 1];
    if (last && last.part === s.part) last.slides.push(s);
    else out.push({ part: s.part, slides: [s] });
  });
  return out;
}

// An address that names a slide opens there, once the pages exist
if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
