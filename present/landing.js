// The front door, where the QR code leads. Every word comes from deck.js: the title slide's kicker, the deck's
// title, subtitle and byline, and deck.landing (the questions, what we hope for, and why the two of us).
// Elements are built with h() and words with rich(), so deck text never becomes HTML.
import { h, loadDeck, rich } from "./dom.js";

const { deck, model } = await loadDeck({ theme: false });
const ctx = { model };
const title = deck.slides.find((s) => s.kind === "title");
const land = deck.landing || {};
const season = model.parts.find((p) => p.season?.art)?.season;
document.title = model.title;

const list = (items, cls) => items?.length && h("ol", { class: cls }, items.map((t) => h("li", {}, rich(t, ctx))));

const hero = h("header", { class: "hero" },
  h("div", { class: "hero-words" },
    title?.kicker && h("p", { class: "eyebrow" }, rich(title.kicker, ctx)),
    h("h1", {}, rich(model.title, ctx)),
    model.subtitle && h("p", { class: "lead" }, rich(model.subtitle, ctx)),
    title?.by && h("p", { class: "byline" }, rich(title.by, ctx)),
    h("div", { class: "ways" },
      h("a", { href: "review.html" }, h("strong", {}, "Read it"), h("span", {}, "The slides, with our notes.")),
      h("a", { href: "present.html" }, h("strong", {}, "Present"), h("span", {}, "For presenting.")))),
  season && h("figure", { class: "field-note hero-note" },
    h("img", { src: season.art, alt: "", decoding: "async" }),
    season.caption && h("figcaption", {}, rich(season.caption, ctx))));

const questions = land.questions && h("section", { class: "sheet questions", "aria-labelledby": "q-head" },
  h("h2", { id: "q-head" }, rich(land.questions.heading, ctx)),
  land.questions.intro && h("p", { class: "intro" }, rich(land.questions.intro, ctx)),
  list(land.questions.items, "asks"));

const aim = land.aim && h("section", { class: "aim", "aria-labelledby": "a-head" },
  h("h2", { id: "a-head" }, rich(land.aim.heading, ctx)),
  land.aim.intro && h("p", { class: "intro" }, rich(land.aim.intro, ctx)),
  list(land.aim.items, "takeaways"),
  land.aim.close && h("p", { class: "close" }, rich(land.aim.close, ctx)));

const usSeason = land.us?.season && model.partById.get(land.us.season)?.season;
const us = land.us && h("section", { class: "sheet us" + (usSeason || land.us.photo ? " with-note" : ""), "aria-labelledby": "u-head" },
  h("div", { class: "us-words" },
    h("h2", { id: "u-head" }, rich(land.us.heading, ctx)),
    (land.us.body || []).map((p) => h("p", {}, rich(p, ctx))),
    land.us.signoff && h("p", { class: "signoff" }, rich(land.us.signoff, ctx))),
  (land.us.photo || usSeason?.art) && h("div", { class: "us-collage" },
    usSeason?.art && h("figure", { class: "field-note us-note" + (land.us.photo ? " tucked" : "") },
      h("img", { src: usSeason.art, alt: "", decoding: "async" }),
      !land.us.photo && usSeason.caption && h("figcaption", {}, rich(usSeason.caption, ctx))),
    land.us.photo && h("figure", { class: "field-note us-photo" },
      h("img", { src: land.us.photo.src, alt: land.us.photo.alt || "", decoding: "async" }),
      land.us.photo.caption && h("figcaption", {}, rich(land.us.photo.caption, ctx)))));

const made = land.made && h("p", { class: "made" }, rich(land.made, ctx));

document.querySelector("main").replaceChildren(...[hero, questions, aim, us, made].filter(Boolean));
