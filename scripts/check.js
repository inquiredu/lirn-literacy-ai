// Checks the deck the way the pages read it: node scripts/check.js
// The git hooks in .githooks and the GitHub Actions workflow run it too. A brace nothing fills shows on the
// stage as typed, a missing picture shows as a gap, and the browser only mentions them in the console;
// this turns those, and their cousins, into a failure before the room sees them.
// node scripts/check.js other-deck.js checks another deck file.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { deckProblems, buildDeck } from "../present/core.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deckFile = path.resolve(root, process.argv[2] || "deck.js");
const problems = [];
const warnings = [];

let deck;
try {
  deck = (await import(pathToFileURL(deckFile).href)).default;
} catch (error) {
  console.error(`check: the deck didn't load: ${error.message}`);
  process.exit(1);
}

// The deck's own rules, the same ones the stage lists in the console
const deckDir = path.dirname(deckFile);
problems.push(...deckProblems(deck, { fileExists: (src) => fs.existsSync(path.join(deckDir, src.split(/[?#]/)[0])) }));

// The mark and embedded pages are files too
if (deck.mark?.src && !fs.existsSync(path.join(deckDir, deck.mark.src))) problems.push(`The deck's mark isn't there: ${deck.mark.src}`);
["light", "dark"].forEach((ground) => {
  const src = deck.logo?.[ground];
  if (src && !fs.existsSync(path.join(deckDir, src))) problems.push(`The deck's logo for ${ground} grounds isn't there: ${src}`);
});
(deck.slides || []).filter((s) => s.kind === "embed" && s.src && !/^https?:/.test(s.src)).forEach((s) => {
  if (!fs.existsSync(path.join(deckDir, s.src.split(/[?#]/)[0]))) problems.push(`Slide ${s.id} embeds a page that isn't there: ${s.src}`);
});

// Placeholders left from the sample
if (/example\.(org|com)/.test(deck.url || "")) warnings.push(`The deck's url is still a placeholder (${deck.url}): the QR code on the stage points there.`);

// Every page names a deck that exists, and every script parses: one syntax error stops a module, and the page goes quiet
for (const page of fs.readdirSync(root).filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const named = /data-deck="([^"]+)"/.exec(html)?.[1];
  if (named && !fs.existsSync(path.join(root, named))) problems.push(`${page} names a deck that isn't there: ${named}`);
}
for (const dir of ["present", "scripts"]) {
  for (const file of fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith(".js"))) {
    const result = spawnSync(process.execPath, ["--check", path.join(root, dir, file)], { encoding: "utf8" });
    if (result.status !== 0) problems.push(`${dir}/${file} doesn't parse: ${(result.stderr.split("\n").find((l) => /Error/.test(l)) || result.stderr).trim()}`);
  }
}

const model = buildDeck(deck);
if (warnings.length) warnings.forEach((w) => console.warn("check: note: " + w));
if (problems.length) {
  console.error(`check: ${problems.length} problem${problems.length === 1 ? "" : "s"} in ${path.relative(root, deckFile)}`);
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}
const timers = Object.keys(model.timers).length;
console.log(`check: ${model.slides.length} slides in ${model.parts.length} parts, ${model.length ? model.length + " minutes" : "no session clock"}, ${timers} timer${timers === 1 ? "" : "s"}: all clear`);
