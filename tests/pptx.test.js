// The PowerPoint round trip: export, read back, find what changed, and write only those words into deck.js.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath, pathToFileURL } from "node:url";
import { bodyText, colorsFromCss, deckChanges, deckToPptx, fieldsOf, patchDeckSource, readPptx, stringLiterals, unzip, zip } from "../present/pptx.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const deck = (await import(pathToFileURL(path.join(root, "deck.js")).href)).default;
const colors = colorsFromCss(fs.readFileSync(path.join(root, "present/talk.css"), "utf8"));
const inflateRaw = (b) => zlib.inflateRawSync(b);
const exported = deckToPptx(deck, { colors });

/** The exported file with one slide's XML changed. */
function withSlide(n, change) {
  const files = unzip(exported);
  const name = `ppt/slides/slide${n}.xml`;
  const text = new TextDecoder().decode(files.get(name));
  files.set(name, new TextEncoder().encode(change(text)));
  return zip([...files.entries()]);
}
const slideNumber = (id) => deck.slides.findIndex((s) => s.id === id) + 2;   // +1 for the guide page, +1 to count from one
const xmlText = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Plain words (no marks, braces or line breaks) on some slide, so the tests follow whatever the deck says now
const plain = (f) => !/[*{}\n]/.test(f.value) && f.value.length > 12;
const pick = (where) => {
  for (const s of deck.slides) { if (!where(s)) continue; const f = fieldsOf(s).find(plain); if (f) return { slide: s, field: f }; }
  throw new Error("No slide with plain words to test.");
};

test("an untouched export reads back with no changes", () => {
  const read = readPptx(exported, { inflateRaw });
  assert.equal(read.length, deck.slides.length + 1);
  const { changes, warnings } = deckChanges(deck, read, { colors });
  assert.deepEqual(changes, []);
  assert.deepEqual(warnings, []);
});

test("every word a slide shows has a box, and notes come back whole", () => {
  const read = readPptx(exported, { inflateRaw });
  deck.slides.forEach((s, i) => {
    const page = read[i + 1];
    assert.equal(page.id, s.id);
    assert.equal(page.notes, s.notes || "");
    for (const f of fieldsOf(s)) assert.ok(page.fields.has(f.path) || [...page.fields.keys()].some((k) => k.startsWith("@")), `${s.id} ${f.path}`);
  });
});

test("structure is never exported as words", () => {
  const paths = deck.slides.flatMap((s) => fieldsOf(s).map((f) => f.path.split(".")[0]));
  for (const key of ["id", "part", "kind", "tone", "notes", "render", "timer", "title"]) assert.ok(!paths.includes(key), key);
});

test("bold runs become **strong**, italics *emphasis*, and split runs join", () => {
  const xml = '<a:p><a:r><a:rPr b="0"/><a:t>Four </a:t></a:r><a:r><a:rPr lang="en-US" b="1"/><a:t>reso</a:t></a:r><a:r><a:rPr b="1" err="1"/><a:t>urces </a:t></a:r>' +
    '<a:r><a:rPr/><a:t>of the </a:t></a:r><a:r><a:rPr i="1"/><a:t>reader</a:t></a:r></a:p><a:p><a:r><a:t>A &amp; B</a:t></a:r><a:br/><a:r><a:t>C</a:t></a:r></a:p>';
  assert.equal(bodyText(xml), "Four **resources** of the *reader*\nA & B\nC");
});

test("an edit in a box changes only that field", () => {
  const { slide, field } = pick((s) => s.kind === "cards");
  const file = withSlide(slideNumber(slide.id), (x) => x.replace(`<a:t>${xmlText(field.value)}</a:t>`, "<a:t>Edited words.</a:t>"));
  const { changes } = deckChanges(deck, readPptx(file, { inflateRaw }), { colors });
  assert.deepEqual(changes.map((c) => [c.slideId, c.path, c.to]), [[slide.id, field.path, "Edited words."]]);
});

test("when an app drops every box name, words are matched by order", () => {
  const { slide, field } = pick((s) => s.kind === "statement");
  const n = slideNumber(slide.id);
  const renamed = (x) => x.replace(/name="lirn:[^"]*" descr="lirn:[^"]*"/g, 'name="Google Shape;1;p1"').replace(/name="deco" descr=""/g, 'name="Google Shape;2;p1"');
  const untouched = deckChanges(deck, readPptx(withSlide(n, renamed), { inflateRaw }), { colors });
  assert.deepEqual(untouched.changes, []);
  assert.equal(untouched.warnings.length, 1);
  const edited = deckChanges(deck, readPptx(withSlide(n, (x) => renamed(x).replace(`<a:t>${xmlText(field.value)}</a:t>`, "<a:t>Edited words.</a:t>")), { inflateRaw }), { colors });
  assert.deepEqual(edited.changes.map((c) => [c.slideId, c.path, c.to]), [[slide.id, field.path, "Edited words."]]);
});

test("the title slide edits the deck's own title", () => {
  const title = deck.slides.find((s) => s.heading === "{title}");
  if (!title) return;
  const file = withSlide(slideNumber(title.id), (x) => x.replace(`<a:t>${xmlText(deck.title)}</a:t>`, "<a:t>A New Title</a:t>"));
  const { changes } = deckChanges(deck, readPptx(file, { inflateRaw }), { colors });
  assert.deepEqual(changes.map((c) => [c.slideId, c.path, c.to]), [[null, "title", "A New Title"]]);
});

test("string literals: escapes decoded, keys found, comments skipped", () => {
  const src = 'const a = { heading: "He said \\"hi\\"\\nok", body: [\'one\', "two"] }; // "not this"\n/* "nor this" */ x("y")';
  const lits = stringLiterals(src);
  assert.deepEqual(lits.map((l) => [l.key, l.value]), [["heading", 'He said "hi"\nok'], [null, "one"], [null, "two"], [null, "y"]]);
});

test("patching writes the right one of two identical strings, and nothing else", () => {
  const src = `export default {\n  title: "T",\n  slides: [\n    { id: "a", kind: "list", items: [{ name: "Same", why: "x" }, { name: "Same", why: "y" }], notes: "n" },\n    { id: "b", heading: "Same", notes: "m" }\n  ]\n};\n`;
  const d = { title: "T", slides: [{ id: "a", items: [{ name: "Same", why: "x" }, { name: "Same", why: "y" }], notes: "n" }, { id: "b", heading: "Same", notes: "m" }] };
  const out = patchDeckSource(src, d, [
    { slideId: "a", path: "items.1.name", key: "name", rank: 1, from: "Same", to: "Second" },
    { slideId: "b", path: "notes", key: "notes", rank: 0, from: "m", to: 'quote " and\nnewline' },
    { slideId: null, path: "title", key: "title", rank: 0, from: "T", to: "Title" }
  ]);
  assert.equal(out, src.replace('{ name: "Same", why: "y" }', '{ name: "Second", why: "y" }').replace('notes: "m"', 'notes: "quote \\" and\\nnewline"').replace('title: "T"', 'title: "Title"'));
});

test("the real deck.js patches in place for every field", () => {
  const src = fs.readFileSync(path.join(root, "deck.js"), "utf8");
  // Change every field of every slide at once; the patch has to find each one
  const changes = [];
  deck.slides.forEach((s) => {
    const seen = new Map();
    for (const f of fieldsOf(s)) {
      const tag = f.key + "\0" + f.value, rank = seen.get(tag) || 0; seen.set(tag, rank + 1);
      if (/^\{(title|subtitle|by)\}$/.test(f.value.trim())) continue;
      changes.push({ slideId: s.id, path: f.path, key: f.key, rank, from: f.value, to: f.value + " ✓" });
    }
  });
  const out = patchDeckSource(src, deck, changes);
  assert.equal(out.split("✓").length - 1, changes.length);
});
