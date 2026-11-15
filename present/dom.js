// What the three pages share in the browser: building elements (never from HTML strings), words with
// **strong**, *emphasis* and live {braces}, a polite announcer for screen readers, and loading the deck.
import { buildDeck, deckProblems, inline, tokens, resolveToken, tokenText } from "./core.js";

/** h("p", { class: "kicker", on: { click } , "aria-label": "…" }, "text", node, [more]) */
export function h(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props || {})) {
    if (value === undefined || value === null || value === false) continue;
    if (key === "class") node.className = value;
    else if (key === "on") Object.entries(value).forEach(([type, fn]) => node.addEventListener(type, fn));
    else if (key === "style") Object.entries(value).forEach(([name, v]) => node.style.setProperty(name, v));
    else if (key === "dataset") Object.assign(node.dataset, value);
    else if (key in node && typeof value !== "string") node[key] = value;
    else node.setAttribute(key, value === true ? "" : value);
  }
  append(node, children);
  return node;
}

function append(node, children) {
  children.flat(Infinity).forEach((c) => {
    if (c === undefined || c === null || c === false) return;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  });
}

const SVG = "http://www.w3.org/2000/svg";
export function svg(tag, attrs = {}, ...children) {
  const node = document.createElementNS(SVG, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  children.forEach((c) => node.append(c));
  return node;
}

/**
 * Words for the page. Braces fill from the deck; a timer's length becomes a span the views keep live,
 * so "Four minutes in pairs" turns into "Six minutes in pairs" the moment the presenter adds two.
 */
export function rich(text, ctx) {
  const frag = document.createDocumentFragment();
  if (text === undefined || text === null) return frag;
  inline(String(text)).forEach((run) => {
    if (run.br) frag.append(h("br"));
    else if (run.strong !== undefined) frag.append(h("strong", {}, words(run.strong, ctx)));
    else if (run.em !== undefined) frag.append(h("em", {}, words(run.em, ctx)));
    else frag.append(words(run.text, ctx));
  });
  return frag;
}

function words(text, ctx) {
  const frag = document.createDocumentFragment();
  tokens(text).forEach((t) => {
    if (!t.token) { frag.append(t.text); return; }
    const value = ctx ? resolveToken(t, ctx) : null;
    if (!value) { frag.append(t.whole); return; }
    if (value.timer) frag.append(h("span", { class: "live-mins", dataset: { timer: value.timer, token: t.token } }, tokenText(t, value)));
    else frag.append(tokenText(t, value));
  });
  return frag;
}

/** Brings every live timer length inside root up to date. */
export function refreshLive(root, minutesFor) {
  root.querySelectorAll(".live-mins").forEach((span) => {
    const [t] = tokens("{" + span.dataset.token + "}");
    const text = tokenText(t, { length: minutesFor(span.dataset.timer) });
    if (span.textContent !== text) span.textContent = text;
  });
}

/** Politely tells screen readers what changed: a new slide, a timer at time, a copy. One live region per page. */
export function say(text) {
  let live = document.getElementById("pk-live");
  if (!live) {
    live = h("div", { id: "pk-live", class: "sr-only", "aria-live": "polite", "aria-atomic": "true" });
    document.body.append(live);
  }
  live.textContent = "";
  setTimeout(() => { live.textContent = text; }, 40);
}

export function browserStorage() {
  try { return typeof localStorage === "undefined" ? undefined : localStorage; } catch { return undefined; }
}

/**
 * The deck named by <html data-deck="deck.js">, laid out. Only a file on this site can be a deck.
 * Problems go to the console, in words; the presentation still runs. The stage and the review wear the
 * deck's theme (Ivory, or Night with theme: "dark"); the presenter view follows the presenter's own setting.
 */
export async function loadDeck({ theme = true } = {}) {
  const url = new URL(document.documentElement.dataset.deck || "deck.js", document.baseURI);
  if (url.origin !== location.origin) throw new Error("The deck has to be a file on this site: " + url.href);
  const deck = (await import(url.href)).default;
  const model = buildDeck(deck);
  const problems = deckProblems(deck);
  if (problems.length) console.warn("The deck has " + problems.length + " problem" + (problems.length === 1 ? "" : "s") + ":\n- " + problems.join("\n- "));
  document.documentElement.dataset.theme = theme ? model.theme || "light" : "auto";   // auto: inquiredu.css follows the viewer
  return { deck, model, problems };
}
