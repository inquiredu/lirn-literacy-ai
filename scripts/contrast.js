// Checks every color pair the slides and the views use, in both inquiredu themes, against WCAG 2.1 AA (4.5:1 for
// text, 3:1 for the focus ring and the bar's current mark), with the values read straight from present/inquiredu.css:
// node scripts/contrast.js. It also fails a var(--name) in the kit's CSS that nothing defines, which a browser
// would skip without a word. check-all.js runs it.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const brand = read("present/inquiredu.css");

// The custom properties a block of the brand's stylesheet defines
const block = (selector) => {
  const at = brand.indexOf(selector + " {");
  if (at < 0) throw new Error(`present/inquiredu.css has no "${selector}" block`);
  const body = brand.slice(at + selector.length + 2, brand.indexOf("\n}", at));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
};
const light = { ...block(":root"), ...block(':root, [data-theme="light"]') };
const themes = { Ivory: light, Night: { ...light, ...block('[data-theme="dark"]') } };

const resolve = (t, name, seen = new Set()) => {
  if (seen.has(name)) throw new Error(`--${name} refers to itself`);
  seen.add(name);
  const v = t[name];
  if (v === undefined) return undefined;
  const ref = /^var\(--([\w-]+)\)$/.exec(v);
  return ref ? resolve(t, ref[1], seen) : v;
};

const channel = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [text token, ground token, minimum, where the kit uses it]
const TEXT = 4.5, GRAPHIC = 3;
const pairs = [
  ["fg-1", "surface-page", TEXT, "slide words"], ["fg-2", "surface-page", TEXT, "soft words, the hero clock's label"],
  ["fg-accent", "surface-page", TEXT, "kickers, strong words, figures"], ["fg-warm", "surface-page", TEXT, "the title slide's kicker"],
  ["status-danger", "surface-page", TEXT, "the clock over time, in the hero"],
  ["fg-1", "surface-raised", TEXT, "cards, the timer, the rail, dialogs"], ["fg-2", "surface-raised", TEXT, "controls at rest, card text"],
  ["fg-accent", "surface-raised", TEXT, "strong words on cards, the open clock"], ["status-danger", "surface-raised", TEXT, "a timer at Time"],
  ["status-warning", "surface-raised", TEXT, "pace behind, in the notes"],
  ["fg-1", "surface-sunken", TEXT, "code, the review's ground"], ["fg-2", "surface-sunken", TEXT, "slide numbers in the review"],
  ["on-action-primary", "action-primary", TEXT, "primary buttons"], ["fg-1", "control-bg", TEXT, "other buttons"],
  ["fg-on-accent", "surface-accent", TEXT, "the address pill, the accent tone"],
  ["fg-on-inverse", "surface-inverse", TEXT, "the inverse band"], ["fg-on-inverse-2", "surface-inverse", TEXT, "soft words on the band"],
  ["fg-accent-on-inverse", "surface-inverse", TEXT, "accents on the band"],
  ["fg-1", "surface-water-soft", TEXT, "the water tone, pressed buttons"], ["fg-2", "surface-water-soft", TEXT, "soft words on water"],
  ["fg-warm", "surface-accent-soft", TEXT, "the warm tone"],
  ["fg-on-toast", "surface-toast", TEXT, "the key hint, notices"],
  ["status-info", "status-info-bg", TEXT, "the notes window, alone"], ["status-warning", "status-warning-bg", TEXT, "the Alpha badge"],
  ["border-focus", "surface-page", GRAPHIC, "the focus ring"], ["indicator-selected", "surface-raised", GRAPHIC, "the current slide on the bar"]
];

const failures = [];
let checked = 0;
for (const [name, t] of Object.entries(themes)) {
  for (const [fg, bg, min, use] of pairs) {
    const a = resolve(t, fg), b = resolve(t, bg);
    if (!/^#[0-9A-Fa-f]{6}$/.test(a || "") || !/^#[0-9A-Fa-f]{6}$/.test(b || "")) { failures.push(`${name}: --${fg} or --${bg} doesn't resolve to a color (${use})`); continue; }
    const r = ratio(a, b);
    checked++;
    if (r < min) failures.push(`${name}: --${fg} ${a} on --${bg} ${b} is ${r.toFixed(2)}:1, under ${min}:1 (${use})`);
  }
}
const qr = ratio("#101438", "#FFFFFF");
checked++;
if (qr < 7) failures.push(`the QR code's ink on its ground is ${qr.toFixed(2)}:1; keep it dark on light`);

// Every var(--name) the kit's CSS uses has to be defined somewhere: the brand, theme.css, or the rule itself
const kitCss = ["present/theme.css", "present/slides.css", "present/stage.css", "present/notes.css", "present/review.css", "index.css"];
const defined = new Set([...Object.keys(themes.Night), ...Object.keys(light)]);
for (const f of kitCss) for (const m of read(f).matchAll(/(--[\w-]+)\s*:/g)) defined.add(m[1].slice(2));
["i", "n", "elapsed", "clock-room"].forEach((n) => defined.add(n));   // set from the stage's script, or with a fallback
for (const f of kitCss) {
  for (const m of read(f).matchAll(/var\(--([\w-]+)/g)) {
    if (!defined.has(m[1])) failures.push(`${f} uses var(--${m[1]}), which nothing defines`);
  }
}

if (failures.length) {
  console.error(`contrast: ${failures.length} problem${failures.length === 1 ? "" : "s"}`);
  [...new Set(failures)].forEach((f) => console.error("  - " + f));
  process.exit(1);
}
console.log(`contrast: ${checked} color pairs in Ivory and Night, from present/inquiredu.css, all clear; every token the kit's CSS names is defined`);
