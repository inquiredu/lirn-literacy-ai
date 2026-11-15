// The kinds of slide. Each takes a slide from the deck and returns its elements; the stage, the review and
// the printed backup all draw slides with these, so a slide looks the same everywhere it appears.
// To add a kind: a function here, its name in KINDS in core.js (with what it needs), and its styles in slides.css.
// For a one-off, a slide can be kind: "custom" with render({ h, rich, mode, model, slide }) in the deck.
import { h, rich, svg } from "./dom.js";
import { qrPath } from "./qr.js";
import { DEFAULT_TONES, lengthLabel, slideTitle, artFor } from "./core.js";

/** The slide's elements, wrapped: tone, part, and the timer beside the words when there is one. */
export function renderSlide(slide, ctx) {
  const c = { ...ctx, slide, t: (text) => rich(text, { model: ctx.model, slide, minutesFor: ctx.minutesFor }) };
  const H = ctx.mode === "stage" ? "h1" : "h2";
  const H2 = ctx.mode === "stage" ? "h2" : "h3";
  c.H = H; c.H2 = H2;
  const body = KIND_VIEWS[slide.kind] ? KIND_VIEWS[slide.kind](slide, c) : [h("p", { class: "body" }, "Unknown kind: " + slide.kind)];
  const main = h("div", { class: "slide-main" }, body);
  [...main.children].forEach((child) => child.classList.add("r"));
  const inner = h("div", { class: "slide-in" + (ctx.timer ? " with-timer" : "") }, main);
  if (ctx.timer) { ctx.timer.classList.add("r"); inner.append(h("div", { class: "slide-timer" }, ctx.timer)); }
  const tone = toneOf(slide);
  const sun = slide.kind === "title" && slide.sun !== false && !slide.image ? h("div", { class: "sun r", "aria-hidden": "true" }) : null;
  // A drawing for the slide's bare side (core.js artFor): decoration, so it says nothing to a screen reader
  const art = artFor(slide, ctx.model);
  const drawing = art && h("img", { class: `art ${art.dark ? "art-dark" : "art-light"}`, src: art.src, alt: "", "aria-hidden": "true", dataset: { variant: String(art.variant) } });
  return h("section", {
    class: `slide kind-${slide.kind}${tone ? " tone-" + tone : ""}${ctx.timer ? " has-timer" : ""}${slide.image ? " has-image" : ""}${art ? (art.dark ? " has-art-dark" : " has-art") : ""}`,
    dataset: { part: slide.part?.id ?? "", ...(tone === "night" ? { theme: "dark" } : {}) },
    "aria-roledescription": "slide",
    "aria-label": `Slide ${slide.n} of ${ctx.model.slides.length}: ${slideTitle(slide, ctx.model)}`
  }, sun, drawing, inner);
}

/** A slide's ground: its own tone, else (for a section) its part's, else its kind's (core.js DEFAULT_TONES). */
export const toneOf = (slide) => slide.tone || (slide.kind === "section" && slide.part?.tone) || DEFAULT_TONES[slide.kind] || "";

/** Whether a tone's ground is dark in a deck's theme: the inverse band flips with the theme, peach never does. */
export function groundIsDark(tone, theme) {
  if (tone === "night") return true;
  if (tone === "inverse") return theme !== "dark";
  if (tone === "accent") return false;
  return theme === "dark";
}

/** The logo for a ground: the deck's logo has a file for light grounds and one for dark. */
export const logoFor = (model, dark) => model.logo && (dark ? model.logo.dark || model.logo.light : model.logo.light || model.logo.dark);

function img(image, className = "media") {
  if (!image) return null;
  return h("img", { class: className, src: image.src, alt: image.decorative ? "" : image.alt, loading: "lazy", decoding: "async" });
}

const paragraphs = (value, c, className = "body") =>
  (Array.isArray(value) ? value : value ? [value] : []).map((p) => h("p", { class: className }, c.t(p)));

const urlPill = (c) => (c.model.url ? h("p", { class: "url-pill" }, c.t("{url}")) : null);

export function qrSvg(text, { label } = {}) {
  const { size, path } = qrPath(text);
  const pad = 4;
  return svg("svg", {
    class: "qr", viewBox: `${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`, "shape-rendering": "crispEdges",
    ...(label ? { role: "img", "aria-label": label } : { "aria-hidden": "true" }), focusable: "false"
  }, svg("path", { d: path, fill: "currentColor" }));
}

const KIND_VIEWS = {
  // The opening, after the brand's title slide: the logo and the part along the top, the words low on the left,
  // and the sun at the edge (sun: false to leave it out; an image takes its place)
  title(s, c) {
    const logo = logoFor(c.model, groundIsDark(toneOf(s), c.model.theme));
    const top = h("div", { class: "title-top" },
      logo ? h("img", { class: "logo", src: logo, alt: c.model.logo.alt || "" }) : h("span"),
      s.part && h("p", { class: "index-label" }, `${String(s.part.index + 1).padStart(2, "0")} / `, c.t(s.part.title)));
    const words = h("div", { class: "title-words" },
      s.kicker && h("p", { class: "kicker" }, c.t(s.kicker)),
      h(c.H, { class: "display title" }, c.t(s.heading)),
      s.sub && h("p", { class: "lede" }, c.t(s.sub)),
      s.by && h("p", { class: "byline" }, c.t(s.by)));
    if (!s.image) return [top, words];
    return [top, h("div", { class: "split" + (s.image.side === "left" ? " rev" : "") }, words, img(s.image))];
  },

  // One idea: a heading, a big line, a sentence, a foot
  statement(s, c) {
    return [
      s.kicker && h("p", { class: "kicker" }, c.t(s.kicker)),
      h(c.H, { class: "display heading" }, c.t(s.heading)),
      s.big && h("p", { class: "big" }, c.t(s.big)),
      ...paragraphs(s.body, c, "lede"),
      s.url && urlPill(c),
      s.foot && h("p", { class: "foot" }, c.t(s.foot))
    ];
  },

  // A part's opening banner: the brand's full-bleed band, or the part's own tone
  section(s, c) {
    const words = h("div", {},
      h("p", { class: "section-n" }, c.t(s.number ?? String(s.part?.index ?? ""))),
      h(c.H, { class: "display heading" }, c.t(s.heading)),
      ...paragraphs(s.body, c, "lede"));
    return s.image ? [h("div", { class: "split" }, words, s.image.frame ? h("div", { class: "frame" }, img(s.image)) : img(s.image))] : [words];
  },

  // Time for the room: a question, how long, and the timer beside it
  pause(s, c) {
    return [
      s.kicker && h("p", { class: "kicker" }, c.t(s.kicker)),
      h(c.H, { class: "display heading" }, c.t(s.heading)),
      ...paragraphs(s.body, c, "ask"),
      s.foot && h("p", { class: "foot" }, c.t(s.foot))
    ];
  },

  steps(s, c) {
    return [
      s.kicker && h("p", { class: "kicker" }, c.t(s.kicker)),
      h(c.H, { class: "display heading" }, c.t(s.heading)),
      h("ol", { class: "steps" }, s.steps.map((step) => h("li", {}, c.t(step)))),
      s.foot && h("p", { class: "foot" }, c.t(s.foot))
    ];
  },

  // Two to four side by side: pairs, three meanings, awards
  cards(s, c) {
    return [
      s.kicker && h("p", { class: "kicker" }, c.t(s.kicker)),
      s.heading && h(c.H, { class: "display heading" }, c.t(s.heading)),
      h("ul", { class: "cards", style: { "--n": String(Math.min(s.cards.length, 4)) } }, s.cards.map((card) =>
        h("li", { class: "card" + (card.key ? " key" : "") },
          card.key && h("span", { class: "card-icon star", "aria-hidden": "true" }, "✦"),
          card.kicker && h("p", { class: "card-k" }, c.t(card.kicker)),
          card.heading && h(c.H2, { class: "card-t" }, c.t(card.heading)),
          card.body && h("p", { class: "card-b" }, c.t(card.body))))),
      ...paragraphs(s.body, c, "body soft"),
      s.foot && h("p", { class: "foot" }, c.t(s.foot))
    ];
  },

  // Words beside a picture: most slides in a talk
  split(s, c) {
    const words = h("div", {},
      s.kicker && h("p", { class: "kicker" }, c.t(s.kicker)),
      s.heading && h(c.H, { class: "display heading" }, c.t(s.heading)),
      ...paragraphs(s.body, c, "lede"),
      s.quote && h("blockquote", { class: "pull" }, c.t(s.quote)),
      s.cite && h("p", { class: "cite" }, c.t(s.cite)),
      s.foot && h("p", { class: "foot" }, c.t(s.foot)));
    return [h("div", { class: "split" + (s.image.side === "left" ? " rev" : "") }, words, img(s.image))];
  },

  // One line, said and left to sit
  quote(s, c) {
    return [
      h("blockquote", { class: "quote" }, h("p", {}, c.t(s.text))),
      s.cite && h("p", { class: "cite" }, c.t(s.cite))
    ];
  },

  // Figures that carry the point
  stats(s, c) {
    return [
      s.kicker && h("p", { class: "kicker" }, c.t(s.kicker)),
      s.heading && h(c.H, { class: "display heading" }, c.t(s.heading)),
      h("ul", { class: "stats" }, s.stats.map((st) =>
        h("li", {}, h("span", { class: "stat-n" }, c.t(st.num)), h("span", { class: "stat-l" }, c.t(st.label))))),
      ...paragraphs(s.body, c, "body soft"),
      s.cite && h("p", { class: "cite" }, c.t(s.cite))
    ];
  },

  // Numbered rungs, one line each; a rung marked later is shown fainter
  list(s, c) {
    return [
      s.kicker && h("p", { class: "kicker" }, c.t(s.kicker)),
      h(c.H, { class: "display heading" }, c.t(s.heading)),
      h("ol", { class: "ladder" }, s.items.map((item) =>
        h("li", { class: item.later ? "later" : "" },
          h("strong", {}, item.key && h("span", { class: "star", "aria-hidden": "true" }, "✦"), c.t(item.name)),
          item.why && h("span", {}, c.t(item.why))))),
      s.foot && h("p", { class: "foot" }, c.t(s.foot))
    ];
  },

  // The session at a glance, from the parts: how long each runs, never when it starts
  plan(s, c) {
    return [
      h(c.H, { class: "display heading" }, c.t(s.heading || "The plan")),
      h("ol", { class: "plan" }, c.model.parts.map((p) =>
        h("li", {},
          h("span", { class: "plan-len" }, p.minutes ? lengthLabel(p.minutes).replace(" minutes", " min").replace(" minute", " min") : ""),
          h("strong", {}, c.t(p.title)),
          p.where && h("span", { class: "plan-where" }, c.t(p.where))))),
      s.url && urlPill(c),
      s.foot && h("p", { class: "foot" }, c.t(s.foot))
    ];
  },

  // A few lines of code, shown as typed: braces here are left alone
  code(s, c) {
    return [
      s.heading && h(c.H, { class: "display heading" }, c.t(s.heading)),
      h("pre", { class: "code" }, h("code", {}, s.code)),
      s.caption && h("p", { class: "caption" }, c.t(s.caption))
    ];
  },

  // Something live on the stage. The frame is kept, so a tool keeps its state when you come back to it.
  embed(s, c) {
    let frame = c.embeds?.get(s.id);
    if (!frame) {
      frame = h("iframe", { class: "embed", src: s.src, title: s.frameTitle || slideTitle(s, c.model), loading: "lazy" });
      c.embeds?.set(s.id, frame);
    }
    if (c.mode !== "stage") return [h(c.H, { class: "display heading" }, c.t(s.heading)), s.caption && h("p", { class: "caption" }, c.t(s.caption)),
      h("p", { class: "body soft" }, "Live on the stage: ", h("a", { href: s.src }, "open it"), ".")];
    return [h(c.H, { class: "display heading" }, c.t(s.heading)), frame, s.caption && h("p", { class: "caption" }, c.t(s.caption))];
  },

  // The way back, on a slide of its own: the address, large, and a code to scan
  link(s, c) {
    const words = h("div", {},
      h(c.H, { class: "display heading" }, c.t(s.heading)),
      urlPill(c),
      ...paragraphs(s.body, c, "lede"),
      s.foot && h("p", { class: "foot" }, c.t(s.foot)));
    if (!c.model.url) return [words];
    return [h("div", { class: "split link-split" }, words, h("div", { class: "qr-card" }, qrSvg(c.model.url, { label: "QR code for " + c.model.url })))];
  },

  custom(s, c) {
    const out = s.render({ h, rich: c.t, mode: c.mode, model: c.model, slide: s });
    return Array.isArray(out) ? out : [out];
  }
};
