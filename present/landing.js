// Session overview. Content and agenda come from the same deck as the stage and notes.
import { h, loadDeck, rich } from "./dom.js";
import { lengthLabel } from "./core.js";

const { deck, model } = await loadDeck({ theme: false });
const ctx = { model };
const land = deck.landing || {};
document.title = model.title;
const words = (text) => rich(text, ctx);
const list = (items, cls) => items?.length && h("ol", { class: cls }, items.map((t) => h("li", {}, words(t))));

const masthead = h("nav", { class: "masthead", "aria-label": "Session navigation" },
  h("a", { class: "identity", href: "./" }, land.identity, h("span", {}, land.context)),
  h("div", { class: "nav-links" },
    h("a", { href: "#overview" }, land.nav?.overview),
    h("a", { href: "#agenda" }, land.nav?.agenda),
    h("a", { href: "review.html" }, land.nav?.review)));

const agenda = h("aside", { class: "agenda", id: "agenda", "aria-labelledby": "agenda-head" },
  h("div", { class: "agenda-head" }, h("h2", { id: "agenda-head" }, land.agendaHeading), h("p", {}, words(land.agendaLabel))),
  h("ol", {}, model.parts.map((part, i) => h("li", {},
    h("a", { href: "review.html#" + model.slides[part.slides[0]].id },
      h("span", { class: "agenda-n", "aria-hidden": "true" }, String(i + 1).padStart(2, "0")),
      h("span", { class: "agenda-name" }, words(part.title)),
      h("span", { class: "agenda-time" }, lengthLabel(part.minutes)))))));

const hero = h("header", { class: "hero" },
  h("div", { class: "hero-words" },
    h("p", { class: "eyebrow" }, land.overviewLabel),
    h("h1", {}, words(model.title)),
    h("p", { class: "lead" }, words(model.subtitle)),
    h("p", { class: "byline" }, words(model.by)),
    h("div", { class: "ways" },
      h("a", { class: "primary-link", href: "review.html" }, land.reviewLabel, h("span", { "aria-hidden": "true" }, "↗")),
      h("a", { class: "secondary-link", href: "present.html" }, land.presentLabel))),
  agenda);

const questions = land.questions && h("section", { class: "questions", id: "overview", "aria-labelledby": "q-head" },
  h("div", { class: "section-intro" },
    h("p", { class: "eyebrow" }, land.questions.label),
    h("h2", { id: "q-head" }, words(land.questions.heading)),
    h("p", { class: "intro" }, words(land.questions.intro))),
  list(land.questions.items, "asks"));

const aim = land.aim && h("section", { class: "aim", "aria-labelledby": "a-head" },
  h("div", { class: "section-intro" },
    h("p", { class: "eyebrow" }, land.aim.label),
    h("h2", { id: "a-head" }, words(land.aim.heading)),
    h("p", { class: "intro" }, words(land.aim.intro))),
  h("div", {}, list(land.aim.items, "takeaways"), h("p", { class: "close" }, words(land.aim.close))));

const us = land.us && h("section", { class: "facilitators", "aria-labelledby": "u-head" },
  h("h2", { id: "u-head", class: "eyebrow" }, words(land.us.heading)),
  h("div", {}, land.us.body.map((p, i) => h("p", { class: i ? "intro" : "facilitator-names" }, words(p)))));

const resources = land.resources && h("section", { class: "resources", "aria-labelledby": "r-head" },
  h("div", {}, h("h2", { id: "r-head" }, words(land.resources.heading)), h("p", {}, words(land.resources.body))),
  h("a", { href: deck.links.wwta }, words(land.resources.label), h("span", { "aria-hidden": "true" }, " ↗")));

const footer = land.made && h("footer", { class: "made" }, h("p", {}, words(land.made)));
document.querySelector("main").replaceChildren(...[masthead, hero, questions, aim, us, resources, footer].filter(Boolean));
