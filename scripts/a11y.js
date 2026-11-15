// An automated WCAG 2.2 A and AA scan of the stage (every slide), the presenter view and the review,
// at 1280px and 375px wide: node scripts/a11y.js   (THEME=light to scan the other theme)
// axe catches roughly a third of real problems. Keyboard, zoom and screen-reader checks stay with a person:
// docs/ACCESSIBILITY.md lists them. Needs, once: npm i -D playwright @axe-core/playwright
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildDeck } from "../present/core.js";
import { createServer } from "./serve.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const model = buildDeck((await import(pathToFileURL(path.join(root, "deck.js")).href)).default);
let chromium, AxeBuilder;
try {
  ({ chromium } = await import("playwright"));
  ({ AxeBuilder } = await import("@axe-core/playwright"));
} catch {
  console.error("The scan needs Playwright and axe: npm i -D playwright @axe-core/playwright");
  process.exit(1);
}

const server = createServer();
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch(process.env.PREVIEW_BROWSER ? { executablePath: process.env.PREVIEW_BROWSER } : {});
const routes = [...model.slides.map((s) => `present.html#${s.id}`), "notes.html", "review.html", "index.html"];
const seen = new Map();
try {
  for (const width of [1280, 375]) {
    const context = await browser.newContext({ viewport: { width, height: 800 }, reducedMotion: "reduce", colorScheme: process.env.THEME === "light" ? "light" : "dark" });
    const page = await context.newPage();
    for (const route of routes) {
      const response = await page.goto(base + route, { waitUntil: "networkidle" });
      if (response && !response.ok()) throw new Error(`Cannot scan ${route}: HTTP ${response.status()}`);
      if (process.env.THEME) await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, process.env.THEME);
      await page.waitForTimeout(250);
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      for (const v of violations) for (const n of v.nodes) {
        const key = `${v.id} ${route} ${n.target.join(" ")}`;
        if (!seen.has(key)) seen.set(key, { rule: v.id, impact: v.impact, help: v.help, route, width, target: n.target.join(" "), summary: n.failureSummary.split("\n").slice(1).join(" ").trim() });
      }
    }
    await context.close();
  }
} finally { await browser.close(); server.close(); }

const found = [...seen.values()];
const byRule = Map.groupBy(found, (f) => f.rule);
for (const [rule, items] of byRule) {
  console.log(`\n[${items[0].impact}] ${rule}: ${items[0].help} (${items.length})`);
  for (const f of items.slice(0, 8)) console.log(`  ${f.route} @${f.width}px  ${f.target}\n    ${f.summary.slice(0, 220)}`);
  if (items.length > 8) console.log(`  …and ${items.length - 8} more`);
}
console.log(found.length ? `\n${found.length} axe violations across ${byRule.size} rules.` : `\nNo axe violations on ${routes.length} pages and slides at 1280 and 375px${process.env.THEME ? ` (${process.env.THEME} theme)` : ""}.`);
process.exitCode = found.length ? 1 : 0;
