// The sources page: every source the talk leans on, from deck.resources (resources.js), with its three checks
// showing. Filters narrow by verdict and by part of the talk. Built with h() and rich(), so no source text
// ever becomes HTML. Read-only for now; the entries are shaped so an editor can write them back later.
import { h, loadDeck, rich, say } from "./dom.js";
import { RESOURCE_CHECKS } from "./core.js";

const { model, deck } = await loadDeck({ theme: false });
const res = deck.resources || { entries: [] };
const ctx = { model };
document.title = "Sources · " + model.title;

const CHECK = {
  found: { label: "Found as cited", ask: "Is it real, and is it what the citation says?" },
  says: { label: "Says what we say", ask: "Does the work itself say the thing we'd use it for?" },
  others: { label: "Someone else's look", ask: "Does anyone besides its authors describe it the same way?" }
};
const STATUS = { yes: "Yes", partly: "Partly", no: "No", open: "Not yet" };   // the mark beside each word is drawn in resources.css
const VERDICT = {
  stands: { word: "Stands up", plural: "Stand up" },
  care: { word: "Use with care", plural: "Use with care" },
  aside: { word: "Set aside", plural: "Set aside for now" }
};
const FROM = { deck: "Behind a slide", doc: "From the research document", added: "Found for this page" };

const entries = res.entries || [];
const kept = entries.filter((e) => e.verdict !== "aside");
const aside = entries.filter((e) => e.verdict === "aside");
const partsUsed = model.parts.filter((p) => kept.some((e) => e.parts.includes(p.id)));
const dateWords = (iso) => iso ? new Date(iso + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";

// ---------- One source ----------
function statusMark(status) {
  return h("span", { class: "status", dataset: { status } }, h("span", { class: "mark", "aria-hidden": "true" }), STATUS[status] || STATUS.open);
}

function source(e) {
  const titleWords = rich(e.title, ctx);
  const checks = h("ol", { class: "checks", "aria-label": "Three checks" }, RESOURCE_CHECKS.map((key) => {
    const c = e.checks[key];
    return h("li", { class: "check", dataset: { status: c.status } },
      h("p", { class: "check-head" }, h("span", { class: "check-name" }, CHECK[key].label), statusMark(c.status)),
      h("p", { class: "check-note" }, rich(c.note, ctx)),
      c.link && h("a", { class: "check-link", href: c.link, rel: "noopener noreferrer" }, "What we looked at", h("span", { class: "sr-only" }, " for " + CHECK[key].label.toLowerCase() + ", " + e.title)));
  }));
  return h("article", { class: "source", id: e.id, dataset: { verdict: e.verdict, parts: e.parts.join(" ") } },
    h("p", { class: "source-top" },
      h("span", { class: "kind" }, e.kind || "Source"),
      e.year && h("span", { class: "year" }, String(e.year)),
      h("span", { class: "verdict", dataset: { verdict: e.verdict } }, VERDICT[e.verdict].word)),
    h("h3", {}, e.url ? h("a", { href: e.url, rel: "noopener noreferrer" }, titleWords) : titleWords),
    h("p", { class: "who" }, rich(e.who, ctx), e.where && [" · ", h("span", { class: "where" }, rich(e.where, ctx))]),
    e.what && h("p", { class: "what" }, rich(e.what, ctx)),
    e.use && h("p", { class: "use" }, h("strong", {}, e.verdict === "aside" ? "What it's good for: " : "What we'd take from it: "), rich(e.use, ctx)),
    e.careful && h("p", { class: "careful" }, h("strong", {}, "Careful: "), rich(e.careful, ctx)),
    checks,
    h("p", { class: "source-foot" },
      h("span", { class: "from" }, FROM[e.from] || ""),
      e.parts.map((id) => { const p = model.partById.get(id); return p && h("span", { class: "part-tag" }, p.title); })));
}

// ---------- The page ----------
const hero = h("header", { class: "hero" },
  h("p", { class: "eyebrow" }, "Sources"),
  h("h1", {}, "What we read, and how we checked it"),
  res.intro && h("p", { class: "lead" }, rich(res.intro, ctx)),
  h("p", { class: "byline" }, `${entries.length} sources · checked ${dateWords(res.checked)} · `,
    h("a", { href: "./" }, rich(model.title, ctx)), " · ", h("a", { href: "review.html" }, "the slides")));

const legend = h("section", { class: "legend sheet", "aria-labelledby": "legend-head" },
  h("h2", { id: "legend-head" }, "The three checks"),
  h("ol", { class: "legend-checks" }, RESOURCE_CHECKS.map((key) => h("li", {}, h("strong", {}, CHECK[key].label), " ", CHECK[key].ask))),
  h("p", { class: "legend-status" }, Object.keys(STATUS).map((k) => statusMark(k))),
  res.doc && h("p", { class: "legend-doc" }, rich(res.doc, ctx)));

// Filters: real buttons that narrow the list, with the count said aloud
let verdictFilter = "all", partFilter = "all";
const count = h("p", { class: "count", "aria-live": "polite" });
const chip = (group, value, label, n) => h("button", {
  type: "button", class: "chip", "aria-pressed": String(value === "all"), dataset: { group, value },
  on: { click: () => choose(group, value) }
}, label, n !== undefined && h("span", { class: "n" }, String(n)));
const verdictChips = h("div", { class: "chips", role: "group", "aria-label": "Show by verdict" },
  chip("verdict", "all", "Everything kept", kept.length),
  chip("verdict", "stands", VERDICT.stands.plural, kept.filter((e) => e.verdict === "stands").length),
  chip("verdict", "care", VERDICT.care.plural, kept.filter((e) => e.verdict === "care").length));
const partChips = h("div", { class: "chips", role: "group", "aria-label": "Show by part of the talk" },
  chip("part", "all", "Every part"),
  partsUsed.map((p) => chip("part", p.id, p.title, kept.filter((e) => e.parts.includes(p.id)).length)));
const filters = h("nav", { class: "filters", "aria-label": "Filter the sources" }, verdictChips, partChips, count);

// Kept sources, grouped by the part of the talk each one serves first
const groups = partsUsed.map((p) => {
  const list = kept.filter((e) => e.parts[0] === p.id);
  return list.length && h("section", { class: "group", dataset: { part: p.id }, "aria-labelledby": "g-" + p.id },
    h("h2", { id: "g-" + p.id }, p.title, p.season?.caption && h("span", { class: "season" }, p.season.caption)),
    h("div", { class: "sources" }, list.map(source)));
}).filter(Boolean);

const setAside = aside.length && h("section", { class: "group set-aside", "aria-labelledby": "g-aside" },
  h("h2", { id: "g-aside" }, VERDICT.aside.plural),
  h("p", { class: "intro" }, "Cited in the research document, and not something we'd stand on yet. Each says why."),
  h("div", { class: "sources" }, aside.map(source)));

const empty = h("p", { class: "empty", hidden: true }, "Nothing matches both filters. Try every part, or everything kept.");

function choose(group, value) {
  if (group === "verdict") verdictFilter = value; else partFilter = value;
  filters.querySelectorAll(`.chip[data-group="${group}"]`).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.value === value)));
  apply(true);
}

function apply(announce) {
  let shown = 0;
  document.querySelectorAll(".group:not(.set-aside) .source").forEach((el) => {
    const ok = (verdictFilter === "all" || el.dataset.verdict === verdictFilter) && (partFilter === "all" || el.dataset.parts.split(" ").includes(partFilter));
    el.hidden = !ok;
    if (ok) shown++;
  });
  document.querySelectorAll(".group:not(.set-aside)").forEach((g) => { g.hidden = !g.querySelector(".source:not([hidden])"); });
  if (setAside) setAside.hidden = verdictFilter !== "all" || partFilter !== "all";
  empty.hidden = shown > 0;
  const words = `Showing ${shown} of ${kept.length} sources we're keeping` + (setAside && !setAside.hidden ? `, and ${aside.length} set aside.` : ".");
  count.textContent = words;
  if (announce) say(words);
}

document.querySelector("main").replaceChildren(hero, legend, filters, ...groups, empty, setAside || "");
apply(false);
if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
