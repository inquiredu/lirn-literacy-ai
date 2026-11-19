// The research library: the reading that goes with the talk. Its words and entries come from the deck
// (deck.library, kept in library.js); the rules for filtering, shelving and the address are in core.js.
// This page only draws what they return, and keeps the filters in the address so a view can be shared.
import { h, loadDeck, rich, say } from "./dom.js";
import { libraryFilters, libraryQuery, libraryShelves, slideTitle, fill, LIBRARY_ERAS, LIBRARY_FORMS } from "./core.js";

const { deck, model } = await loadDeck({ theme: false });
const lib = deck.library;
const land = deck.landing || {};
const w = lib.words;
const ctx = { model };
const words = (text) => rich(text, ctx);
const plain = (text, values = {}) => fill(String(text), ctx).replace(/\[(\w+)\]/g, (whole, key) => (key in values ? values[key] : whole));
document.title = plain(w.title) + " · " + model.title;

let filters = libraryFilters(location.search, lib);

const masthead = h("nav", { class: "masthead", "aria-label": "Session navigation" },
  h("a", { class: "identity", href: "./" }, land.identity, h("span", {}, land.context)),
  h("div", { class: "nav-links" },
    h("a", { href: "./#overview" }, land.nav?.overview),
    h("a", { href: "./#agenda" }, land.nav?.agenda),
    h("a", { href: "review.html" }, land.nav?.review)));

const counts = (key, value) => lib.entries.filter((e) => e[key] === value).length;
const intro = h("header", { class: "lib-hero" },
  h("div", { class: "lib-hero-words" },
    h("p", { class: "eyebrow" }, words(w.eyebrow)),
    h("h1", {}, words(w.title)),
    h("p", { class: "lead" }, words(w.lead))),
  h("dl", { class: "lib-key" }, LIBRARY_ERAS.map((era) => h("div", { class: "lib-key-row" },
    h("dt", {}, h("span", { class: "lib-era lib-era-" + era }, w.eras[era].name), h("span", { class: "lib-key-n" }, plain(w.sources, { n: counts("era", era) }))),
    h("dd", {}, words(w.eras[era].about))))));

// One group of choices: radio buttons, so arrow keys move within a group and a screen reader hears "2 of 3"
const choice = (name, legend, options) => h("fieldset", { class: "lib-choice" },
  h("legend", {}, legend),
  h("div", { class: "lib-options" }, options.map(([value, label]) => {
    const input = h("input", { type: "radio", name, value, checked: filters[name] === value, on: { change: () => update({ [name]: value }) } });
    return h("label", { class: "lib-option" }, input, h("span", {}, label));
  })));

const search = h("input", { type: "search", id: "lib-q", value: filters.q, maxlength: "80", autocomplete: "off", spellcheck: "false",
  on: { input: () => update({ q: search.value.trim() }, { quiet: true }) } });
const free = h("input", { type: "checkbox", id: "lib-free", checked: filters.free, on: { change: () => update({ free: free.checked }) } });
const clear = h("button", { type: "button", class: "lib-clear", on: { click: () => reset() } }, w.clear);
const status = h("p", { class: "lib-status" });

const controls = h("form", { class: "lib-filters", "aria-label": w.filtersLabel, on: { submit: (e) => e.preventDefault() } },
  choice("era", w.filters.era, [["", w.all], ...LIBRARY_ERAS.map((era) => [era, w.eras[era].name])]),
  choice("form", w.filters.form, [["", w.all], ...LIBRARY_FORMS.map((form) => [form, w.forms[form].name])]),
  choice("topic", w.filters.topic, [["", w.all], ...lib.topics.map((t) => [t.id, t.name])]),
  h("div", { class: "lib-more" },
    h("div", { class: "lib-search" }, h("label", { for: "lib-q" }, w.filters.search), search),
    h("label", { class: "lib-check", for: "lib-free" }, free, h("span", {}, w.filters.free)),
    clear));

const results = h("div", { class: "lib-results" });

const slideLinks = (entry) => entry.slides?.length && h("p", { class: "lib-cited" },
  h("span", { class: "lib-cited-k" }, w.cited), " ",
  entry.slides.map((id, i) => [i ? ", " : "", h("a", { href: "review.html#" + id }, slideTitle(model.slideById.get(id), model))]));

function card(entry) {
  const form = w.forms[entry.form];
  const scholarly = entry.form === "research" && entry.peer;
  const label = entry.form === "research" ? (entry.peer ? entry.kind : entry.kind + " · " + w.notReviewed) : form.badge + " · " + entry.kind;
  const titleId = "lib-t-" + entry.id;
  return h("article", { class: "lib-entry" + (scholarly ? "" : " lib-entry-other"), id: entry.id, "aria-labelledby": titleId },
    h("div", { class: "lib-meta" },
      h("span", { class: "lib-year" }, String(entry.year)),
      h("span", { class: "lib-era lib-era-" + entry.era }, w.eras[entry.era].name),
      h("span", { class: "lib-kind" + (scholarly ? "" : " lib-kind-other") }, label)),
    h("div", { class: "lib-body" },
      h("h4", { id: titleId, class: "lib-title" }, h("a", { href: entry.url, rel: "noopener" }, entry.title)),
      h("p", { class: "lib-cite" }, entry.authors, " (", String(entry.year), "). ", h("span", { class: "lib-venue" }, entry.venue), "."),
      h("p", { class: "lib-adds" }, words(entry.adds)),
      entry.who && h("p", { class: "lib-who" }, h("span", { class: "lib-k" }, w.who), " ", words(entry.who)),
      entry.caution && h("p", { class: "lib-caution" }, h("span", { class: "lib-k" }, w.caution), " ", words(entry.caution)),
      h("p", { class: "lib-access" },
        entry.free ? w.free : w.paid,
        entry.freeUrl && [" ", h("a", { href: entry.freeUrl, rel: "noopener", "aria-label": w.freeCopy + ": " + entry.title }, w.freeCopy)],
        h("span", { class: "lib-url" }, " ", entry.freeUrl || entry.url)),
      slideLinks(entry)));
}

function shelf({ topic, groups, count }) {
  const part = topic.part && model.parts.find((p) => p.id === topic.part);
  return h("section", { class: "lib-shelf", "aria-labelledby": "lib-s-" + topic.id },
    h("div", { class: "lib-shelf-head" },
      h("h2", { id: "lib-s-" + topic.id }, topic.name),
      h("p", { class: "intro" }, words(topic.about)),
      h("p", { class: "lib-shelf-meta" }, plain(w.sources, { n: count }),
        part && [" · ", h("a", { href: "review.html#" + model.slides[part.slides[0]].id }, plain(w.inTalk, { part: part.title }))])),
    h("div", { class: "lib-groups" }, groups.map((g) => h("div", { class: "lib-group" },
      h("h3", { class: "lib-group-h" }, h("span", { class: "lib-era lib-era-" + g.era }, w.eras[g.era].name), h("span", { class: "lib-group-about" }, w.eras[g.era].short)),
      g.entries.map(card)))));
}

function draw({ quiet = false } = {}) {
  const { shelves, count, total } = libraryShelves(lib, filters);
  const line = count === total ? plain(w.showingAll, { n: total }) : plain(w.showing, { n: count, total });
  status.textContent = line;
  const active = Boolean(libraryQuery(filters));
  clear.hidden = !active;
  results.replaceChildren(...(shelves.length ? shelves.map(shelf) : [h("p", { class: "lib-none" }, w.none)]));
  if (!quiet) say(line);
}

let announce;
function update(change, { quiet = false } = {}) {
  filters = { ...filters, ...change };
  history.replaceState(null, "", location.pathname + libraryQuery(filters) + location.hash);
  draw({ quiet: true });
  clearTimeout(announce);                                   // a search announces once the typing stops
  announce = setTimeout(() => say(status.textContent), quiet ? 700 : 0);
}

function reset() {
  filters = libraryFilters("", lib);
  controls.reset();
  controls.querySelectorAll('input[type="radio"][value=""]').forEach((input) => { input.checked = true; });
  search.value = "";
  free.checked = false;
  history.replaceState(null, "", location.pathname);
  draw();
  search.focus();
}

const method = h("section", { class: "lib-method", "aria-labelledby": "lib-m" },
  h("div", { class: "section-intro" }, h("p", { class: "eyebrow" }, words(w.method.label)), h("h2", { id: "lib-m" }, words(w.method.heading))),
  h("div", { class: "lib-method-body" }, w.method.body.map((p) => h("p", {}, words(p)))));

const footer = land.made && h("footer", { class: "made" }, h("p", {}, words(land.made)));
document.querySelector("main").replaceChildren(masthead, intro, controls, status, results, method, ...(footer ? [footer] : []));
draw({ quiet: true });
if (location.hash.length > 1) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
