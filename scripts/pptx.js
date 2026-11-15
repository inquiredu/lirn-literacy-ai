// The deck as PowerPoint, and edited words back into deck.js.
//
//   node scripts/pptx.js export [file.pptx]        writes the deck as a .pptx (default: .preview/<deck id>.pptx)
//   node scripts/pptx.js import file.pptx [...]     writes the words changed in the file(s) into deck.js
//   node scripts/pptx.js import file.pptx --dry-run lists what would change, and changes nothing
//
// Import changes words only: layout, colors, kinds, timers and the theme are never touched. After writing, the deck
// is checked; if the edited deck has a problem, deck.js is put back as it was and the problem is reported.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath, pathToFileURL } from "node:url";
import { deckProblems } from "../present/core.js";
import { colorsFromCss, deckChanges, deckToPptx, patchDeckSource, readPptx } from "../present/pptx.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deckPath = path.join(root, "deck.js");
const loadDeck = async (file = deckPath) => (await import(pathToFileURL(file).href + "?t=" + Date.now() + Math.random())).default;
const colors = () => colorsFromCss(fs.readFileSync(path.join(root, "present/talk.css"), "utf8"));

const [command, ...args] = process.argv.slice(2);
const dry = args.includes("--dry-run");
const files = args.filter((a) => !a.startsWith("--"));

if (command === "export") {
  const deck = await loadDeck();
  const out = files[0] || path.join(root, ".preview", `${deck.id}.pptx`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, deckToPptx(deck, { colors: colors() }));
  console.log(`pptx: wrote ${path.relative(process.cwd(), out)} (${deck.slides.length} slides, words and notes editable)`);
} else if (command === "import" && files.length) {
  let total = 0;
  for (const file of files) {
    const deck = await loadDeck();
    const read = readPptx(new Uint8Array(fs.readFileSync(file)), { inflateRaw: (b) => zlib.inflateRawSync(b) });
    const { changes, warnings } = deckChanges(deck, read, { colors: colors() });
    console.log(`\n${path.basename(file)}: ${changes.length} change${changes.length === 1 ? "" : "s"}`);
    for (const c of changes) console.log(`  ${c.slideId ? `slide ${c.n} (${c.slideId})` : "the deck"} · ${c.path}\n    was: ${show(c.from)}\n    now: ${show(c.to)}`);
    for (const w of warnings) console.log(`  note: ${w}`);
    if (!changes.length || dry) continue;

    const before = fs.readFileSync(deckPath, "utf8");
    const after = patchDeckSource(before, deck, changes);
    fs.writeFileSync(deckPath, after);
    let problems;
    try { problems = deckProblems(await loadDeck()); } catch (e) { problems = [String(e.message || e)]; }
    if (problems.length) {
      fs.writeFileSync(deckPath, before);
      console.error(`  deck.js put back: the edited deck has ${problems.length} problem${problems.length === 1 ? "" : "s"}:\n  - ${problems.join("\n  - ")}`);
      process.exit(1);
    }
    total += changes.length;
  }
  console.log(dry ? "\npptx: dry run, deck.js unchanged" : `\npptx: ${total} change${total === 1 ? "" : "s"} written to deck.js; run node scripts/check-all.js`);
} else {
  console.log("Usage: node scripts/pptx.js export [file.pptx] | import file.pptx [more.pptx] [--dry-run]");
  process.exit(command ? 1 : 0);
}

function show(text) {
  const one = String(text).replace(/\n/g, " ⏎ ");
  return one.length > 160 ? one.slice(0, 157) + "…" : one;
}
