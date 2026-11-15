// The front door reads the deck, so the talk's title, subtitle, byline and joint name are typed once, in deck.js.
// textContent only: deck words never become HTML.
import { loadDeck } from "./dom.js";
import { inline } from "./core.js";

const { deck, model } = await loadDeck({ theme: false });
const title = deck.slides.find((s) => s.kind === "title");
const plain = (text) => inline(text || "").map((run) => run.text ?? run.strong ?? run.em ?? " ").join("");
const words = {
  kicker: plain(title?.kicker),
  title: model.title,
  subtitle: model.subtitle,
  by: model.by
};
for (const el of document.querySelectorAll("[data-fill]")) {
  const value = words[el.dataset.fill];
  if (value) el.textContent = value; else el.hidden = true;
}
document.title = model.title;
