// Before and after pictures of slides, so a change can be reviewed by looking instead of reading code.
//
//   node scripts/preview.js map                        # every slide: number, id, part, title
//   node scripts/preview.js shoot before 3 parable     # pictures into .preview/before/
//   ...make the change...
//   node scripts/preview.js shoot after 3 parable
//   node scripts/preview.js compare before after       # writes .preview/compare.html
//   node scripts/preview.js shoot all all              # every slide
//   node scripts/preview.js pdf                        # the printed backup, .preview/backup.pdf (add notes for speaker notes)
//
// A slide is named by number, id, or part of its title. Each is shot on the stage (1440×900), in the review
// (1440×900) and on a phone (375×760), with motion off so the picture is the resting state.
// Needs Playwright, once: npm i -D playwright (the kit itself has no dependencies). If Playwright's own browser
// isn't installed, set PREVIEW_BROWSER to a Chrome or Chromium path.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildDeck, slideTitle } from "../present/core.js";
import { createServer } from "./serve.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, ".preview");
const model = buildDeck((await import(pathToFileURL(path.join(root, "deck.js")).href)).default);
const VIEWS = [
  { name: "stage", route: (s) => `present.html#${s.id}`, size: { width: 1440, height: 900 }, label: "On the stage" },
  { name: "review", route: (s) => `review.html#${s.id}`, size: { width: 1440, height: 900 }, label: "In the review" },
  { name: "phone", route: (s) => `present.html#${s.id}`, size: { width: 375, height: 760 }, label: "On a phone" }
];

function resolveSlide(spec) {
  const s = String(spec).trim();
  if (/^\d+$/.test(s)) { const hit = model.slides[Number(s) - 1]; if (hit) return hit; }
  if (model.slideById.has(s.toLowerCase())) return model.slideById.get(s.toLowerCase());
  const hits = model.slides.filter((m) => slideTitle(m, model).toLowerCase().includes(s.toLowerCase()));
  if (hits.length === 1) return hits[0];
  throw new Error(hits.length ? `"${s}" matches several slides: ${hits.map((h) => `${h.n} ${h.id}`).join(", ")}` : `No slide matches "${s}". Run: node scripts/preview.js map`);
}

async function browser() {
  let chromium;
  try { ({ chromium } = await import("playwright")); }
  catch { throw new Error("Pictures need Playwright: npm i -D playwright (then npx playwright install chromium, or set PREVIEW_BROWSER)."); }
  return chromium.launch(process.env.PREVIEW_BROWSER ? { executablePath: process.env.PREVIEW_BROWSER } : {});
}

async function withServer(fn) {
  const server = createServer();
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  try { return await fn(`http://127.0.0.1:${server.address().port}/`); } finally { server.close(); }
}

async function shoot(label, specs) {
  if (!label || !specs.length) throw new Error("Usage: shoot <label> <slide...> (or: shoot <label> all)");
  const slides = specs[0] === "all" ? model.slides : specs.map(resolveSlide);
  const out = path.join(OUT, label);
  fs.mkdirSync(out, { recursive: true });
  await withServer(async (base) => {
    const b = await browser();
    try {
      for (const v of VIEWS) {
        const context = await b.newContext({ viewport: v.size, reducedMotion: "reduce", hasTouch: v.name === "phone" });
        const page = await context.newPage();
        page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.warn(`  ${v.name}: ${m.text()}`); });
        page.on("pageerror", (e) => console.error(`  ${v.name}: ${e.message}`));
        for (const s of slides) {
          await page.goto(base + v.route(s), { waitUntil: "networkidle" });
          await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 8000 }).catch(() => {});
          if (v.name === "review") await page.evaluate((id) => document.getElementById(id)?.scrollIntoView(), s.id);
          await page.waitForTimeout(400);
          await page.screenshot({ path: path.join(out, `${String(s.n).padStart(2, "0")}-${s.id}-${v.name}.png`) });
        }
        await context.close();
      }
    } finally { await b.close(); }
  });
  console.log(`Saved ${slides.length * VIEWS.length} pictures to ${path.relative(root, out)}/ for: ${slides.map((s) => `${s.n} ${s.id}`).join(", ")}`);
}

async function pdf(withNotes) {
  fs.mkdirSync(OUT, { recursive: true });
  const file = path.join(OUT, withNotes ? "backup-with-notes.pdf" : "backup.pdf");
  await withServer(async (base) => {
    const b = await browser();
    try {
      const page = await (await b.newContext()).newPage();
      await page.goto(base + "review.html", { waitUntil: "networkidle" });
      await page.evaluate((on) => document.querySelectorAll(".page-notes").forEach((n) => { n.style.display = on ? "" : "none"; }), withNotes);
      await page.emulateMedia({ media: "print", reducedMotion: "reduce" });
      await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true });
    } finally { await b.close(); }
  });
  console.log(`Wrote ${path.relative(root, file)}: ${model.slides.length} slides, one to a page.`);
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const uri = (f) => `data:image/png;base64,${fs.readFileSync(f).toString("base64")}`;

function compare(before, after) {
  if (!before || !after) throw new Error("Usage: compare <before-label> <after-label>");
  const dirB = path.join(OUT, before), dirA = path.join(OUT, after);
  const files = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith(".png")) : []);
  const fb = new Set(files(dirB)), fa = new Set(files(dirA));
  if (!fb.size || !fa.size) throw new Error(`Nothing to compare: shoot "${before}" and "${after}" first.`);
  const keys = [...new Set([...fb, ...fa].map((f) => f.replace(/-(stage|review|phone)\.png$/, "")))].sort();
  let changed = 0;
  const sections = keys.map((key) => {
    const [n, ...rest] = key.split("-");
    const slide = model.slides[Number(n) - 1];
    const views = VIEWS.map((v) => {
      const f = `${key}-${v.name}.png`;
      const inB = fb.has(f), inA = fa.has(f);
      const same = inB && inA && fs.readFileSync(path.join(dirB, f)).equals(fs.readFileSync(path.join(dirA, f)));
      if (inB && inA && !same) changed += 1;
      const cell = (ok, d, side) => (ok ? `<figure><figcaption>${side}</figcaption><img alt="${side}: ${esc(v.label)}, ${esc(slide ? slideTitle(slide, model) : key)}" src="${uri(path.join(d, f))}"></figure>` : `<figure class="none"><figcaption>${side}</figcaption><p>Not captured</p></figure>`);
      return `<div class="view"><h3>${v.label}${same ? ' <span class="same">no visible change</span>' : ""}</h3><div class="pair">${cell(inB, dirB, "Before")}${cell(inA, dirA, "After")}</div></div>`;
    }).join("");
    return `<section><h2>${Number(n)} · ${esc(slide ? slideTitle(slide, model) : rest.join("-"))} <code>${esc(rest.join("-"))}</code></h2>${views}</section>`;
  }).join("");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Slide edits</title>
<style>
/* inquiredu's Ivory and Night values, written out: the comparison is one self-contained file to publish */
:root{--bg:#F5F6FA;--fg:#101438;--muted:#4B5288;--line:#D7DAE5;--accent:#7952C7;--ok:#3F6650}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#101438;--fg:#F5F6FA;--muted:#C3C5DA;--line:#2A3068;--accent:#BBA6E3;--ok:#A9BAB0;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#101438;--fg:#F5F6FA;--muted:#C3C5DA;--line:#2A3068;--accent:#BBA6E3;--ok:#A9BAB0;color-scheme:dark}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 Montserrat,system-ui,sans-serif}
main{max-width:76rem;margin:0 auto;padding:2rem 1rem}
h1{font:600 2rem Montserrat,system-ui,sans-serif;color:var(--fg);margin:0 0 .3rem}.sub{color:var(--muted);margin:0 0 2rem}
section{margin-bottom:3rem}h2{font:600 1.4rem Montserrat,system-ui,sans-serif;color:var(--fg);border-top:1.5px solid var(--fg);padding-top:.8rem}
h2 code{font:400 .8rem ui-monospace,monospace;color:var(--muted);margin-left:.5rem}
h3{font-size:.85rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:1.4rem 0 .5rem}
.same{color:var(--ok);text-transform:none;letter-spacing:0;font-weight:700;margin-left:.5rem}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:1rem}figure{margin:0;min-width:0}figcaption{font-weight:700;margin-bottom:.3rem}
img{width:100%;height:auto;display:block;border:1px solid var(--line);background:#fff}.none p{border:1px dashed var(--line);padding:2rem;color:var(--muted)}
@media(max-width:700px){.pair{grid-template-columns:1fr}}
</style></head>
<body><main><h1>Slide edits</h1><p class="sub">${changed} view${changed === 1 ? "" : "s"} changed across ${keys.length} slide${keys.length === 1 ? "" : "s"}. Left is before, right is after.</p>${sections}</main></body></html>
`;
  const target = path.join(OUT, "compare.html");
  fs.writeFileSync(target, html);
  console.log(`Wrote ${path.relative(root, target)} (${changed} changed view${changed === 1 ? "" : "s"}).`);
}

function map() {
  model.slides.forEach((s) => console.log(`${String(s.n).padStart(3)}  ${s.id.padEnd(22)} ${(s.part?.id || "").padEnd(10)} ${s.kind.padEnd(10)} ${slideTitle(s, model)}${s.timer ? `  [timer ${s.timer.key}: ${s.timer.minutes} min]` : ""}`));
}

const [cmd, ...args] = process.argv.slice(2);
try {
  if (cmd === "map") map();
  else if (cmd === "shoot") await shoot(args[0], args.slice(1));
  else if (cmd === "compare") compare(args[0], args[1]);
  else if (cmd === "pdf") await pdf(args.includes("notes"));
  else { console.log("Usage:\n  node scripts/preview.js map\n  node scripts/preview.js shoot <label> <slide...|all>\n  node scripts/preview.js compare <before> <after>\n  node scripts/preview.js pdf [notes]"); process.exitCode = 1; }
} catch (e) { console.error(e.message); process.exitCode = 1; }
