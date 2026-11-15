// The deck as a PowerPoint file, for editing words slide by slide, and the way back into deck.js.
//
// Export: deckToPptx(deck, { colors }) builds a .pptx from deck.js. Every word a slide shows is its own text box,
// named for the field it came from ("lirn:cards.1.body"), with the speaker notes in the notes pane. The look is an
// approximation of the stage for editing; it never travels back.
// Import: readPptx(bytes, { inflateRaw }) reads an edited file, deckChanges(deck, read) lists the words that changed,
// and patchDeckSource(source, deck, changes) writes only those strings into deck.js. Layout, colors, kinds, timers and
// the theme stay as they are, so an edited PowerPoint can only ever change words.
//
// No dependencies: the zip is stored (no compression) when writing, and inflateRaw is passed in when reading
// (zlib.inflateRawSync in Node). Works in the browser and in Node.
import { buildDeck, inline } from "./core.js";

// ---------- What counts as words ----------

/** Keys that are structure, not words: never exported, never changed by an import. */
const STRUCTURE = new Set(["id", "part", "kind", "tone", "title", "notes", "src", "side", "render", "timer", "url", "sun", "key", "later", "frame", "decorative", "number"]);
/** A field that is exactly one of these braces shows the deck's own value, and edits go to the deck. */
const DECK_FIELDS = { "{title}": "title", "{subtitle}": "subtitle", "{by}": "by" };
export const GUIDE_ID = "_how-to-edit";
const MARK = "lirn:";
const NOTE_LINE = (id) => `slide id: ${id} (keep this line; it tells the importer which slide this is)`;

/** Every string a slide shows, in source order: [{ path: "cards.1.body", key: "body", value }]. */
export function fieldsOf(slide) {
  const out = [];
  const walk = (value, path, key) => {
    if (typeof value === "string") out.push({ path: path.join("."), key, value });
    else if (Array.isArray(value)) value.forEach((v, i) => walk(v, [...path, String(i)], null));
    else if (value && typeof value === "object") for (const k of Object.keys(value)) {
      if (path.length === 0 && STRUCTURE.has(k)) continue;
      if (path.length > 0 && (k === "key" || k === "later")) continue;
      walk(value[k], [...path, k], k);
    }
  };
  walk(slide, [], null);
  return out;
}

// ---------- Export ----------

const EMU = 914400;                       // per inch
const W = 13.333, H = 7.5;                // 16:9
const X = 0.9, CW = W - 2 * X;            // left margin, content width
const NS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
const HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const emu = (inches) => Math.round(inches * EMU);
const hex = (c) => String(c).trim().replace(/^#/, "").toUpperCase();

/** The point size that fits text in a box, starting at pt and going no lower than 60% of it. */
function fit(text, w, h, pt, { charW = 0.5, lineH = 1.25 } = {}) {
  const lines = String(text).split("\n");
  for (let size = pt; size >= Math.round(pt * 0.6); size--) {
    const perLine = Math.max(1, Math.floor(w / ((size / 72) * charW)));
    const count = lines.reduce((n, line) => n + Math.max(1, Math.ceil(line.length / perLine)), 0);
    if (count * (size / 72) * lineH <= h) return size;
  }
  return Math.round(pt * 0.6);
}

/** A slide being drawn: text boxes for fields, and decoration the importer ignores. */
class Sheet {
  constructor(colors) { this.c = colors; this.shapes = []; this.next = 2; this.decoTexts = []; }

  box(x, y, w, h, xml, { name, fill, geom = "rect" } = {}) {
    const id = this.next++;
    const tag = name ? `name="${esc(name)}" descr="${esc(name)}"` : 'name="deco" descr=""';
    const fillXml = fill ? `<a:solidFill><a:srgbClr val="${hex(fill)}"/></a:solidFill>` : "<a:noFill/>";
    this.shapes.push(`<p:sp><p:nvSpPr><p:cNvPr id="${id}" ${tag}/><p:cNvSpPr${xml ? ' txBox="1"' : ""}/><p:nvPr/></p:nvSpPr>` +
      `<p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="${geom}"><a:avLst/></a:prstGeom>${fillXml}<a:ln><a:noFill/></a:ln></p:spPr>` +
      (xml || '<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody>') + "</p:sp>");
  }

  /** A field's words, editable. style: { pt, font: "heading"|"reading", color, caps, anchor } */
  field(field, x, y, w, h, style) {
    if (!field) return;
    this.box(x, y, w, h, textBody(field.shown, { ...style, pt: fit(field.shown, w, h, style.pt, style) }, this.c), { name: MARK + field.path });
  }

  /** Words that are not content: a slide number, a timer, a label. */
  label(text, x, y, w, h, style) {
    this.decoTexts.push(text);
    this.box(x, y, w, h, textBody(text, style, this.c, { plain: true }), { fill: style.fill, geom: style.geom });
  }

  rule(x, y, w, color) { this.box(x, y, w, 0.02, "", { fill: color }); }
}

/** A text body: one paragraph per line, **strong** as bold in the accent color, *emphasis* as italic. */
function textBody(text, { pt = 18, font = "reading", color, accent, caps = false, anchor = "t", align = "l" }, c, { plain = false } = {}) {
  const typeface = font === "heading" ? "Montserrat" : "Newsreader";
  const run = (t, { b = false, i = false } = {}) => {
    const fill = hex(b && accent ? accent : color || c.ink);
    return `<a:r><a:rPr lang="en-US" sz="${pt * 100}"${b ? ' b="1"' : ' b="0"'}${i ? ' i="1"' : ""}${caps ? ' cap="all" spc="150"' : ""} dirty="0">` +
      `<a:solidFill><a:srgbClr val="${fill}"/></a:solidFill><a:latin typeface="${typeface}"/></a:rPr><a:t>${esc(t)}</a:t></a:r>`;
  };
  const paragraphs = String(text).split("\n").map((line) => {
    const runs = plain ? (line ? run(line) : "") : inline(line).map((r) =>
      r.strong !== undefined ? run(r.strong, { b: true }) : r.em !== undefined ? run(r.em, { i: true }) : r.text ? run(r.text) : "").join("");
    return `<a:p><a:pPr algn="${align}"><a:lnSpc><a:spcPct val="110000"/></a:lnSpc></a:pPr>${runs}<a:endParaRPr lang="en-US" sz="${pt * 100}" dirty="0"/></a:p>`;
  });
  return `<p:txBody><a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" anchor="${anchor}"><a:normAutofit/></a:bodyPr><a:lstStyle/>${paragraphs.join("")}</p:txBody>`;
}

/** The fields of one slide as the export shows them: deck braces filled with the deck's own words. */
function shownFields(slide, deck) {
  return fieldsOf(slide).map((f) => {
    const deckKey = DECK_FIELDS[f.value.trim()];
    return deckKey ? { ...f, path: "@" + deckKey, shown: deck[deckKey] ?? f.value } : { ...f, shown: f.value };
  });
}

const human = (path) => path.split(".").map((p) => (/^\d+$/.test(p) ? String(Number(p) + 1) : p)).join(" › ");

/** Lays one slide out by its kind. Returns the slide XML and the decoration words. */
function drawSlide(s, model, deck, c) {
  const sheet = new Sheet(c);
  const raw = deck.slides[s.index];             // the words as deck.js has them, not the built model
  const all = shownFields(raw, deck);
  const take = (path) => { const i = all.findIndex((f) => f.path === path || (f.key === path && !f.path.includes("."))); return i < 0 ? null : all.splice(i, 1)[0]; };
  const takeAll = (prefix) => { const out = all.filter((f) => f.path === prefix || f.path.startsWith(prefix + ".")); out.forEach((f) => all.splice(all.indexOf(f), 1)); return out; };
  const dark = s.kind === "title" || s.kind === "section" || s.tone === "night" || s.tone === "inverse";
  const water = !dark && (s.kind === "pause" || s.tone === "water");
  const ink = dark ? c.onInverse : c.ink, soft = dark ? c.onInverse2 : c.soft, accent = dark ? c.accentOnInverse : c.accent;
  const bg = dark ? c.inverse : water ? c.water : c.page;
  const T = { font: "heading", color: ink, accent };
  const R = { font: "reading", color: soft, accent };

  const kicker = (y = 0.55) => sheet.field(take("kicker"), X, y, CW, 0.35, { ...T, pt: 12, color: accent, caps: true });
  const heading = (y, h, pt = 34, w = CW) => sheet.field(take("heading"), X, y, w, h, { ...T, pt });
  const foot = () => sheet.field(take("foot"), X, 6.45, CW, 0.5, { ...T, pt: 14, color: accent });

  if (s.kind === "title") {
    kicker(2.9);
    heading(3.3, 1.7, 44);
    sheet.field(take("sub"), X, 5.05, CW * 0.8, 0.9, { ...R, pt: 20 });
    sheet.field(take("by"), X, 6.15, CW, 0.45, { ...T, pt: 14 });
  } else if (s.kind === "section") {
    sheet.label(String(s.number ?? s.part?.index ?? "").padStart(2, "0"), X, 2.2, 2, 0.4, { font: "heading", pt: 14, color: accent });
    heading(2.7, 1.6, 44);
    takeAll("body").forEach((f, i) => sheet.field(f, X, 4.45 + i * 0.9, CW * 0.8, 0.85, { ...R, pt: 22 }));
  } else if (s.kind === "pause") {
    const w = CW - 3.4;
    kicker();
    heading(0.95, 1.6, 34, w);
    takeAll("body").forEach((f, i) => sheet.field(f, X, 2.75 + i * 1.3, w, 1.25 * (i ? 1 : 2), { ...R, pt: 22, color: ink }));
    sheet.label((s.timer?.minutes ?? "") + " min\ntimer", W - X - 2.8, 2.4, 2.8, 2.2,
      { font: "heading", pt: 28, color: c.ink, fill: c.raised, geom: "roundRect", anchor: "ctr", align: "ctr" });
    foot();
  } else if (s.kind === "statement" || s.kind === "link" || s.kind === "quote" || s.kind === "plan" || s.kind === "embed" || s.kind === "code") {
    kicker();
    heading(0.95, 1.6, 36);
    let y = 2.75;
    const big = take("big"); if (big) { sheet.field(big, X, y, CW, 0.9, { ...T, pt: 28, color: accent }); y += 1.05; }
    for (const k of ["text", "cite", "caption"]) { const f = take(k); if (f) { sheet.field(f, X, y, CW * 0.85, 0.9, { ...R, pt: 22, color: ink }); y += 1; } }
    const body = takeAll("body");
    body.forEach((f) => { const h = Math.max(0.6, (6.3 - y) / body.length - 0.1); sheet.field(f, X, y, CW * 0.85, h, { ...R, pt: 22 }); y += h + 0.1; });
    if (s.kind === "link" && model.url) sheet.label(model.url.replace(/^https?:\/\//, "").replace(/\/$/, ""), X, 5.7, CW, 0.5, { font: "heading", pt: 18, color: ink });
    foot();
  } else if (s.kind === "cards" && Array.isArray(s.cards)) {
    kicker();
    heading(0.95, 1.2, 32);
    const n = s.cards.length, gap = 0.4, w = (CW - gap * (n - 1)) / n;
    s.cards.forEach((card, i) => {
      const x = X + i * (w + gap);
      sheet.rule(x, 2.35, w, card.key ? accent : c.line);
      sheet.field(take(`cards.${i}.kicker`), x, 2.5, w, 0.5, { ...T, pt: 10, color: soft, caps: true });
      sheet.field(take(`cards.${i}.heading`), x, 3.0, w, 0.95, { ...T, pt: 20 });
      sheet.field(take(`cards.${i}.body`), x, 4.0, w, 1.95, { ...R, pt: 15 });
    });
    takeAll("body").forEach((f) => sheet.field(f, X, 5.95, CW, 0.45, { ...R, pt: 14 }));
    foot();
  } else if ((s.kind === "list" || s.kind === "steps" || (s.kind === "custom" && !s.answer && !s.rows)) && Array.isArray(s.items || s.steps)) {
    kicker();
    heading(0.95, 1.25, 32);
    const rows = s.items || s.steps, top = 2.35, h = (6.3 - top) / rows.length;
    rows.forEach((item, i) => {
      const y = top + i * h;
      sheet.rule(X, y, CW, item.key ? accent : c.line);
      sheet.label(String(i + 1).padStart(2, "0"), X, y + 0.12, 0.5, 0.35, { font: "heading", pt: 12, color: accent });
      if (s.steps) sheet.field(take(`steps.${i}`), X + 0.7, y + 0.1, CW - 0.7, h - 0.15, { ...T, pt: 18 });
      else {
        sheet.field(take(`items.${i}.name`), X + 0.7, y + 0.08, CW - 0.7, h * 0.45, { ...T, pt: 18 });
        sheet.field(take(`items.${i}.why`), X + 0.7, y + 0.1 + h * 0.45, CW - 0.7, h * 0.5 - 0.1, { ...R, pt: 14 });
      }
    });
    foot();
  } else {
    // A drawn figure or a kind without a layout here: its words as labeled boxes in a grid
    kicker();
    heading(0.95, 1.25, 30);
    const rest = all.filter((f) => f.key !== "foot");
    const cols = rest.length > 8 ? 3 : 2, gap = 0.3, w = (CW - gap * (cols - 1)) / cols;
    const perCol = Math.ceil(rest.length / cols), top = 2.3, h = (6.3 - top) / Math.max(1, perCol);
    rest.slice().forEach((f, i) => {
      const x = X + Math.floor(i / perCol) * (w + gap), y = top + (i % perCol) * h;
      sheet.label(human(f.path), x, y, w, 0.22, { font: "heading", pt: 8, color: soft, caps: true });
      sheet.field(take(f.path), x, y + 0.24, w, h - 0.3, { ...R, pt: 13, color: ink });
    });
    foot();
  }
  // Anything left over still gets a box, so no word is lost
  all.slice().forEach((f, i) => sheet.field(take(f.path), X, 6.0 - i * 0.4, CW, 0.38, { ...R, pt: 12 }));

  sheet.label(`${s.n} / ${model.slides.length}${s.part ? " · " + s.part.title : ""}`, X, 7.0, CW, 0.3, { font: "heading", pt: 9, color: soft });
  const bgXml = `<p:bg><p:bgPr><a:solidFill><a:srgbClr val="${hex(bg)}"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>`;
  return `${HEAD}<p:sld ${NS}><p:cSld name="${esc(s.id)}">${bgXml}<p:spTree>${GROUP}${sheet.shapes.join("")}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}

function guideSlide(deck, c) {
  const sheet = new Sheet(c);
  const steps = [
    "Change any words in any text box. Bold shows as emphasis on the stage, in the accent color.",
    "Leave braces such as {mins} or {length} as they are: they fill in from the deck, so lengths stay true.",
    "Speaker notes are editable too. Keep each notes page's last line (slide id: …).",
    "Words only. Fonts, colors, layout, new slides, new boxes or moved slides here don't carry over; ask for those separately.",
    "When you're done, give the .pptx to Claude Code. The changed words go into deck.js and are checked, and nothing else changes."
  ];
  sheet.label("Editing this deck", X, 0.6, CW, 0.4, { font: "heading", pt: 12, color: c.accent, caps: true });
  sheet.label(`${deck.title}: words only`, X, 1.0, CW, 1.0, { font: "heading", pt: 34, color: c.ink });
  steps.forEach((t, i) => {
    sheet.label(String(i + 1).padStart(2, "0"), X, 2.3 + i * 0.85, 0.5, 0.4, { font: "heading", pt: 14, color: c.accent });
    sheet.label(t, X + 0.7, 2.3 + i * 0.85, CW - 0.7, 0.8, { font: "reading", pt: 17, color: c.ink });
  });
  const bgXml = `<p:bg><p:bgPr><a:solidFill><a:srgbClr val="${hex(c.page)}"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>`;
  return `${HEAD}<p:sld ${NS}><p:cSld name="${GUIDE_ID}">${bgXml}<p:spTree>${GROUP}${sheet.shapes.join("")}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}

const GROUP = '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>';

function notesXml(text, id) {
  const lines = [...(text ? String(text).split("\n") : []), "", NOTE_LINE(id)];
  const paras = lines.map((l) => `<a:p>${l ? `<a:r><a:rPr lang="en-US" sz="1200" dirty="0"/><a:t>${esc(l)}</a:t></a:r>` : ""}<a:endParaRPr lang="en-US" sz="1200" dirty="0"/></a:p>`).join("");
  return `${HEAD}<p:notes ${NS}><p:cSld><p:spTree>${GROUP}` +
    `<p:sp><p:nvSpPr><p:cNvPr id="2" name="Slide Image"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg"/></p:nvPr></p:nvSpPr><p:spPr/></p:sp>` +
    `<p:sp><p:nvSpPr><p:cNvPr id="3" name="Notes"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr/>` +
    `<p:txBody><a:bodyPr/><a:lstStyle/>${paras}</p:txBody></p:sp></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>`;
}

function themeXml(name, c) {
  const clr = (tag, v) => `<a:${tag}><a:srgbClr val="${hex(v)}"/></a:${tag}>`;
  const fill = `<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>`;
  const ln = (w) => `<a:ln w="${w}" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln>`;
  return `${HEAD}<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="${esc(name)}"><a:themeElements>` +
    `<a:clrScheme name="${esc(name)}">${clr("dk1", c.ink)}${clr("lt1", c.raised)}${clr("dk2", c.inverse)}${clr("lt2", c.page)}` +
    `${clr("accent1", c.accent)}${clr("accent2", c.accentOnInverse)}${clr("accent3", c.water)}${clr("accent4", c.soft)}${clr("accent5", c.line)}${clr("accent6", c.onInverse2)}` +
    `${clr("hlink", c.accent)}${clr("folHlink", c.soft)}</a:clrScheme>` +
    `<a:fontScheme name="${esc(name)}"><a:majorFont><a:latin typeface="Montserrat"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont>` +
    `<a:minorFont><a:latin typeface="Newsreader"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme>` +
    `<a:fmtScheme name="${esc(name)}"><a:fillStyleLst>${fill}${fill}${fill}</a:fillStyleLst>` +
    `<a:lnStyleLst>${ln(6350)}${ln(12700)}${ln(19050)}</a:lnStyleLst>` +
    `<a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>` +
    `<a:bgFillStyleLst>${fill}${fill}${fill}</a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>`;
}

const REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/";
const rels = (list) => `${HEAD}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
  list.map(([id, type, target]) => `<Relationship Id="${id}" Type="${type.startsWith("http") ? type : REL + type}" Target="${target}"/>`).join("") + "</Relationships>";
const CT = "application/vnd.openxmlformats-officedocument.";

/**
 * The deck as a .pptx (bytes). colors: the talk's light theme as hex, by role:
 * { page, raised, ink, soft, accent, line, inverse, onInverse, onInverse2, accentOnInverse, water }.
 */
export function deckToPptx(deck, { colors, guide = true } = {}) {
  if (!colors) throw new Error("deckToPptx needs the talk's colors.");
  const model = buildDeck(deck);
  const slides = [...(guide ? [{ guide: true }] : []), ...model.slides];
  const files = [];
  const add = (name, text) => files.push([name, text]);

  add("[Content_Types].xml", `${HEAD}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/ppt/presentation.xml" ContentType="${CT}presentationml.presentation.main+xml"/>` +
    `<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="${CT}presentationml.slideMaster+xml"/>` +
    `<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="${CT}presentationml.slideLayout+xml"/>` +
    `<Override PartName="/ppt/notesMasters/notesMaster1.xml" ContentType="${CT}presentationml.notesMaster+xml"/>` +
    `<Override PartName="/ppt/theme/theme1.xml" ContentType="${CT}theme+xml"/><Override PartName="/ppt/theme/theme2.xml" ContentType="${CT}theme+xml"/>` +
    `<Override PartName="/ppt/presProps.xml" ContentType="${CT}presentationml.presProps+xml"/><Override PartName="/ppt/viewProps.xml" ContentType="${CT}presentationml.viewProps+xml"/>` +
    `<Override PartName="/ppt/tableStyles.xml" ContentType="${CT}presentationml.tableStyles+xml"/>` +
    `<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="${CT}extended-properties+xml"/>` +
    slides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="${CT}presentationml.slide+xml"/><Override PartName="/ppt/notesSlides/notesSlide${i + 1}.xml" ContentType="${CT}presentationml.notesSlide+xml"/>`).join("") +
    "</Types>");
  add("_rels/.rels", rels([["rId1", "officeDocument", "ppt/presentation.xml"],
    ["rId2", "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties", "docProps/core.xml"],
    ["rId3", "extended-properties", "docProps/app.xml"]]));
  add("docProps/core.xml", `${HEAD}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${esc(deck.title || "")}</dc:title><dc:creator>${esc(deck.by || "")}</dc:creator></cp:coreProperties>`);
  add("docProps/app.xml", `${HEAD}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Present Kit</Application><Slides>${slides.length}</Slides></Properties>`);

  add("ppt/presentation.xml", `${HEAD}<p:presentation ${NS} saveSubsetFonts="1"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>` +
    `<p:notesMasterIdLst><p:notesMasterId r:id="rId2"/></p:notesMasterIdLst><p:sldIdLst>` +
    slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${10 + i}"/>`).join("") +
    `</p:sldIdLst><p:sldSz cx="12192000" cy="6858000"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`);
  add("ppt/_rels/presentation.xml.rels", rels([["rId1", "slideMaster", "slideMasters/slideMaster1.xml"], ["rId2", "notesMaster", "notesMasters/notesMaster1.xml"],
    ["rId3", "theme", "theme/theme1.xml"], ["rId4", "presProps", "presProps.xml"], ["rId5", "viewProps", "viewProps.xml"], ["rId6", "tableStyles", "tableStyles.xml"],
    ...slides.map((_, i) => [`rId${10 + i}`, "slide", `slides/slide${i + 1}.xml`])]));
  add("ppt/presProps.xml", `${HEAD}<p:presentationPr ${NS}/>`);
  add("ppt/viewProps.xml", `${HEAD}<p:viewPr ${NS}><p:normalViewPr><p:restoredLeft sz="15620"/><p:restoredTop sz="70000"/></p:normalViewPr><p:gridSpacing cx="76200" cy="76200"/></p:viewPr>`);
  add("ppt/tableStyles.xml", `${HEAD}<a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>`);
  add("ppt/theme/theme1.xml", themeXml(deck.title || "Deck", colors));
  add("ppt/theme/theme2.xml", themeXml("Notes", colors));

  const clrMap = '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>';
  const style = (sz, face) => `<a:lvl1pPr><a:defRPr sz="${sz}"><a:latin typeface="${face}"/></a:defRPr></a:lvl1pPr>`;
  add("ppt/slideMasters/slideMaster1.xml", `${HEAD}<p:sldMaster ${NS}><p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="${hex(colors.page)}"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>` +
    `<p:spTree>${GROUP}</p:spTree></p:cSld>${clrMap}<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst>` +
    `<p:txStyles><p:titleStyle>${style(3600, "+mj-lt")}</p:titleStyle><p:bodyStyle>${style(2000, "+mn-lt")}</p:bodyStyle><p:otherStyle>${style(1800, "+mn-lt")}</p:otherStyle></p:txStyles></p:sldMaster>`);
  add("ppt/slideMasters/_rels/slideMaster1.xml.rels", rels([["rId1", "slideLayout", "../slideLayouts/slideLayout1.xml"], ["rId2", "theme", "../theme/theme1.xml"]]));
  add("ppt/slideLayouts/slideLayout1.xml", `${HEAD}<p:sldLayout ${NS} type="blank" preserve="1"><p:cSld name="Blank"><p:spTree>${GROUP}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`);
  add("ppt/slideLayouts/_rels/slideLayout1.xml.rels", rels([["rId1", "slideMaster", "../slideMasters/slideMaster1.xml"]]));
  add("ppt/notesMasters/notesMaster1.xml", `${HEAD}<p:notesMaster ${NS}><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree>${GROUP}` +
    `<p:sp><p:nvSpPr><p:cNvPr id="2" name="Slide Image"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg" idx="2"/></p:nvPr></p:nvSpPr>` +
    `<p:spPr><a:xfrm><a:off x="381000" y="685800"/><a:ext cx="6096000" cy="3429000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr></p:sp>` +
    `<p:sp><p:nvSpPr><p:cNvPr id="3" name="Notes"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" sz="quarter" idx="3"/></p:nvPr></p:nvSpPr>` +
    `<p:spPr><a:xfrm><a:off x="685800" y="4343400"/><a:ext cx="5486400" cy="4114800"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>` +
    `<p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp></p:spTree></p:cSld>${clrMap}` +
    `<p:notesStyle>${style(1200, "+mn-lt")}</p:notesStyle></p:notesMaster>`);
  add("ppt/notesMasters/_rels/notesMaster1.xml.rels", rels([["rId1", "theme", "../theme/theme2.xml"]]));

  slides.forEach((s, i) => {
    const n = i + 1;
    add(`ppt/slides/slide${n}.xml`, s.guide ? guideSlide(deck, colors) : drawSlide(s, model, deck, colors));
    add(`ppt/slides/_rels/slide${n}.xml.rels`, rels([["rId1", "slideLayout", "../slideLayouts/slideLayout1.xml"], ["rId2", "notesSlide", `../notesSlides/notesSlide${n}.xml`]]));
    add(`ppt/notesSlides/notesSlide${n}.xml`, notesXml(s.guide ? "This page explains how to edit. The importer skips it." : s.notes, s.guide ? GUIDE_ID : s.id));
    add(`ppt/notesSlides/_rels/notesSlide${n}.xml.rels`, rels([["rId1", "notesMaster", "../notesMasters/notesMaster1.xml"], ["rId2", "slide", `../slides/slide${n}.xml`]]));
  });
  return zip(files);
}

// ---------- Zip ----------

const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (bytes) => { let c = 0xFFFFFFFF; for (const b of bytes) c = CRC[(c ^ b) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };

/** A stored (uncompressed) zip of [name, text] pairs. */
export function zip(files) {
  const enc = new TextEncoder();
  const parts = [], central = [];
  let offset = 0;
  for (const [name, text] of files) {
    const nameBytes = enc.encode(name), data = typeof text === "string" ? enc.encode(text) : text, crc = crc32(data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true); local.setUint16(4, 20, true); local.setUint16(6, 0x0800, true); local.setUint16(8, 0, true);
    local.setUint16(10, 0, true); local.setUint16(12, 0x21, true); local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true); local.setUint32(22, data.length, true); local.setUint16(26, nameBytes.length, true); local.setUint16(28, 0, true);
    parts.push(new Uint8Array(local.buffer), nameBytes, data);
    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true); cen.setUint16(4, 20, true); cen.setUint16(6, 20, true); cen.setUint16(8, 0x0800, true); cen.setUint16(10, 0, true);
    cen.setUint16(12, 0, true); cen.setUint16(14, 0x21, true); cen.setUint32(16, crc, true); cen.setUint32(20, data.length, true); cen.setUint32(24, data.length, true);
    cen.setUint16(28, nameBytes.length, true); cen.setUint32(42, offset, true);
    central.push(new Uint8Array(cen.buffer), nameBytes);
    offset += 30 + nameBytes.length + data.length;
  }
  const cenSize = central.reduce((n, b) => n + b.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
  end.setUint32(12, cenSize, true); end.setUint32(16, offset, true);
  const all = [...parts, ...central, new Uint8Array(end.buffer)];
  const out = new Uint8Array(all.reduce((n, b) => n + b.length, 0));
  let at = 0; for (const b of all) { out.set(b, at); at += b.length; }
  return out;
}

/** The files in a zip, by name: Uint8Arrays. inflateRaw(bytes) handles compressed entries. */
export function unzip(bytes, inflateRaw) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let end = bytes.length - 22;
  while (end >= 0 && view.getUint32(end, true) !== 0x06054b50) end--;
  if (end < 0) throw new Error("This isn't a .pptx file (no zip directory found).");
  const count = view.getUint16(end + 10, true);
  let at = view.getUint32(end + 16, true);
  const dec = new TextDecoder(), out = new Map();
  for (let i = 0; i < count; i++) {
    const method = view.getUint16(at + 10, true), size = view.getUint32(at + 20, true);
    const nameLen = view.getUint16(at + 28, true), extra = view.getUint16(at + 30, true), comment = view.getUint16(at + 32, true);
    const local = view.getUint32(at + 42, true);
    const name = dec.decode(bytes.subarray(at + 46, at + 46 + nameLen));
    const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
    const raw = bytes.subarray(start, start + size);
    if (method === 0) out.set(name, raw);
    else if (method === 8) { if (!inflateRaw) throw new Error("This file is compressed; pass inflateRaw."); out.set(name, new Uint8Array(inflateRaw(raw))); }
    else throw new Error(`Unsupported compression in ${name}.`);
    at += 46 + nameLen + extra + comment;
  }
  return out;
}

// ---------- Import ----------

const unxml = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, e) =>
  e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
    : { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[e.toLowerCase()]);
const attr = (attrs, name) => { const m = new RegExp(`\\b${name}="([^"]*)"`).exec(attrs || ""); return m ? unxml(m[1]) : null; };
const truthy = (v) => v === "1" || v === "true";

/** A text body back into deck words: bold runs become **strong**, italic *emphasis*, paragraphs \n. */
export function bodyText(txBody) {
  const lines = [];
  const paraRe = /<a:p(?:\s[^>]*)?>([\s\S]*?)<\/a:p>|<a:p\s*\/>/g;
  let p;
  while ((p = paraRe.exec(txBody))) {
    const segs = [];
    const re = /<a:r>([\s\S]*?)<\/a:r>|<a:br\b[^>]*?(?:\/>|>[\s\S]*?<\/a:br>)|<a:fld\b[^>]*>([\s\S]*?)<\/a:fld>/g;
    let m;
    while ((m = re.exec(p[1] || ""))) {
      if (m[0].startsWith("<a:br")) { segs.push({ text: "\n", b: false, i: false }); continue; }
      const inner = m[1] ?? m[2] ?? "";
      const rPr = /<a:rPr\b([^>]*)/.exec(inner);
      const t = /<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/.exec(inner);
      segs.push({ text: t ? unxml(t[1]) : "", b: truthy(attr(rPr?.[1], "b")), i: truthy(attr(rPr?.[1], "i")) });
    }
    // Join runs that share a format (apps split runs for spelling and language), then mark them up
    const merged = [];
    for (const s of segs) {
      const last = merged[merged.length - 1];
      if (last && last.b === s.b && last.i === s.i && s.text !== "\n" && last.text !== "\n") last.text += s.text;
      else merged.push({ ...s });
    }
    lines.push(merged.map(({ text, b, i }) => {
      if (text === "\n" || !text.trim() || !(b || i)) return text;
      const mark = b ? "**" : "*";
      const lead = text.match(/^\s*/)[0], trail = text.match(/\s*$/)[0];
      return lead + mark + text.trim() + mark + trail;
    }).join(""));
  }
  return lines.join("\n");
}

/** Reads an edited .pptx: [{ id, name, fields: Map(path → text), unnamed: [text], notes }], in slide order. */
export function readPptx(bytes, { inflateRaw } = {}) {
  const files = unzip(bytes, inflateRaw);
  const dec = new TextDecoder();
  const read = (name) => (files.has(name) ? dec.decode(files.get(name)) : null);
  const relsOf = (part) => {
    const dir = part.slice(0, part.lastIndexOf("/") + 1);
    const xml = read(`${dir}_rels/${part.slice(dir.length)}.rels`) || "";
    const out = new Map();
    for (const m of xml.matchAll(/<Relationship\b([^>]*)\/?>/g)) {
      const target = attr(m[1], "Target"), type = attr(m[1], "Type") || "";
      out.set(attr(m[1], "Id"), { type, path: resolve(dir, target) });
    }
    return out;
  };
  const pres = read("ppt/presentation.xml");
  if (!pres) throw new Error("This file has no ppt/presentation.xml; is it a PowerPoint file?");
  const presRels = relsOf("ppt/presentation.xml");
  const order = [...pres.matchAll(/<p:sldId\b([^>]*)\/?>/g)].map((m) => presRels.get(attr(m[1], "r:id"))?.path).filter(Boolean);
  return order.map((part) => {
    const xml = read(part) || "";
    const fields = new Map(), unnamed = [];
    for (const sp of xml.matchAll(/<p:sp\b[^>]*>([\s\S]*?)<\/p:sp>/g)) {
      const c = /<p:cNvPr\b([^>]*?)\/?>/.exec(sp[1]);
      const tx = /<p:txBody>([\s\S]*?)<\/p:txBody>/.exec(sp[1]);
      if (!tx) continue;
      const tag = [attr(c?.[1], "name"), attr(c?.[1], "descr")].find((v) => v && v.startsWith(MARK));
      const text = bodyText(tx[1]);
      if (tag) fields.set(tag.slice(MARK.length), text);
      else if (text.trim()) unnamed.push(text);
    }
    const notesPart = [...relsOf(part).values()].find((r) => r.type.endsWith("/notesSlide"))?.path;
    let notes = null, id = null;
    const notesXml = notesPart && read(notesPart);
    if (notesXml) {
      const body = [...notesXml.matchAll(/<p:sp\b[^>]*>([\s\S]*?)<\/p:sp>/g)].find((m) => /<p:ph\b[^>]*type="body"/.test(m[1]));
      const tx = body && /<p:txBody>([\s\S]*?)<\/p:txBody>/.exec(body[1]);
      if (tx) {
        const lines = bodyText(tx[1]).split("\n");
        const at = lines.findIndex((l) => /^slide id: \S+/.test(l.trim()));
        if (at >= 0) { id = /^slide id: (\S+)/.exec(lines[at].trim())[1]; lines.splice(at, 1); }
        while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
        notes = lines.join("\n");
      }
    }
    const name = /<p:cSld\b[^>]*\bname="([^"]*)"/.exec(xml)?.[1] ?? null;
    return { id: id || (name && name !== "" ? unxml(name) : null), name, fields, unnamed, notes };
  });
}

function resolve(dir, target) {
  if (!target) return null;
  if (target.startsWith("/")) return target.slice(1);
  const out = dir.split("/").filter(Boolean);
  for (const seg of target.split("/")) { if (seg === "..") out.pop(); else if (seg !== ".") out.push(seg); }
  return out.join("/");
}

/**
 * What an edited file changes in the deck: { changes: [{ slideId, path, key, rank, from, to }], warnings: [] }.
 * A slide is matched by the id in its notes, then its name, then its place; a field by its box's name or alt text,
 * and, when an app has dropped every name on a slide, by the order of its text boxes.
 */
export function deckChanges(deck, read, { colors } = {}) {
  const model = buildDeck(deck);
  const warnings = [], changes = [];
  const pages = read.filter((p) => p.id !== GUIDE_ID);
  const byId = new Map(pages.filter((p) => p.id).map((p) => [p.id, p]));
  const samePlaces = pages.length === model.slides.length;
  const unknown = pages.filter((p) => p.id && !model.slideById.has(p.id));
  if (unknown.length) warnings.push(`Not in the deck, so skipped: ${unknown.map((p) => p.id).join(", ")}. New slides are made in deck.js.`);
  const deckEdits = new Map();

  model.slides.forEach((s, i) => {
    const page = byId.get(s.id) || (samePlaces && !pages[i].id ? pages[i] : null);
    if (!page) { warnings.push(`Slide ${s.n} (${s.id}) isn't in the file; left as it is.`); return; }
    const fields = fieldsOf(deck.slides[i]);
    let found = page.fields;
    if (!found.size && fields.length) {
      // Every name dropped (some apps rename boxes): fall back on order, skipping slide numbers and labels
      const deco = new Set(decoTexts(s, model, deck, colors).map((t) => t.replace(/\s+/g, " ").trim()));
      const texts = page.unnamed.filter((t) => !deco.has(t.replace(/\s+/g, " ").trim()));
      const shown = layoutOrder(s, model, deck, colors);
      if (texts.length === shown.length) { found = new Map(shown.map((path, k) => [path, texts[k]])); warnings.push(`Slide ${s.n} (${s.id}): box names were lost, so words were matched by order. Check this one.`); }
      else { warnings.push(`Slide ${s.n} (${s.id}): box names were lost and the boxes don't line up (${texts.length} found, ${shown.length} expected); left as it is.`); return; }
    }
    const seen = new Map();
    for (const f of fields) {
      const tag = `${f.key}\u0000${f.value}`;
      const rank = seen.get(tag) || 0; seen.set(tag, rank + 1);
      const deckKey = DECK_FIELDS[f.value.trim()];
      const path = deckKey ? "@" + deckKey : f.path;
      if (!found.has(path)) { warnings.push(`Slide ${s.n} (${s.id}): the box for ${f.path} is missing; left as it is.`); continue; }
      const text = found.get(path);
      if (deckKey) { if (text !== deck[deckKey]) deckEdits.set(deckKey, text); continue; }
      if (text !== f.value) changes.push({ slideId: s.id, n: s.n, path: f.path, key: f.key, rank, from: f.value, to: text });
    }
    const extra = page.unnamed.length && page.fields.size ? page.unnamed.filter((t) => !decoTexts(s, model, deck, colors).includes(t)) : [];
    if (extra.length) warnings.push(`Slide ${s.n} (${s.id}): ${extra.length} new text box${extra.length === 1 ? "" : "es"} skipped (words only go into boxes that came from the deck).`);
    if (page.notes !== null && page.notes !== (deck.slides[i].notes || "")) {
      const tag = `notes\u0000${deck.slides[i].notes || ""}`;
      changes.push({ slideId: s.id, n: s.n, path: "notes", key: "notes", rank: 0, from: deck.slides[i].notes || "", to: page.notes, _tag: tag });
    }
  });
  for (const [key, to] of deckEdits) changes.push({ slideId: null, n: 0, path: key, key, rank: 0, from: deck[key], to });
  return { changes, warnings };
}

// The decoration words and the field order of a slide as the export draws it, for matching a file whose box names were lost
function drawn(s, model, deck, colors) {
  const sheetXml = drawSlide(s, model, deck, colors || FALLBACK_COLORS);
  const order = [...sheetXml.matchAll(/name="lirn:([^"]+)"/g)].map((m) => unxml(m[1]));
  const deco = [...sheetXml.matchAll(/<p:sp>(?:(?!<\/p:sp>)[\s\S])*?name="deco"[\s\S]*?<\/p:sp>/g)].map((m) => {
    const tx = /<p:txBody>([\s\S]*?)<\/p:txBody>/.exec(m[0]); return tx ? bodyText(tx[1]) : "";
  }).filter((t) => t.trim());
  return { order, deco };
}
const layoutOrder = (s, model, deck, colors) => drawn(s, model, deck, colors).order;
const decoTexts = (s, model, deck, colors) => drawn(s, model, deck, colors).deco;
const FALLBACK_COLORS = { page: "FFFFFF", raised: "FFFFFF", ink: "000000", soft: "444444", accent: "000000", line: "CCCCCC", inverse: "000000", onInverse: "FFFFFF", onInverse2: "CCCCCC", accentOnInverse: "FFFFFF", water: "EEEEEE" };

// ---------- Writing words back into deck.js ----------

/** Every string literal in a JS source: { start, end, value, key } (key: the property it's the value of, or null). */
export function stringLiterals(src) {
  const out = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "/" && src[i + 1] === "/") { i = src.indexOf("\n", i); if (i < 0) break; continue; }
    if (ch === "/" && src[i + 1] === "*") { i = src.indexOf("*/", i + 2); if (i < 0) break; i += 2; continue; }
    if (ch === '"' || ch === "'" || ch === "`") {
      const start = i;
      let j = i + 1, value = "", dynamic = false;
      while (j < src.length && src[j] !== ch) {
        if (src[j] === "\\") {
          const n = src[j + 1];
          const simple = { n: "\n", t: "\t", r: "\r", b: "\b", f: "\f", v: "\v", 0: "\0" };
          if (n in simple) { value += simple[n]; j += 2; }
          else if (n === "u" && src[j + 2] === "{") { const k = src.indexOf("}", j); value += String.fromCodePoint(parseInt(src.slice(j + 3, k), 16)); j = k + 1; }
          else if (n === "u") { value += String.fromCharCode(parseInt(src.slice(j + 2, j + 6), 16)); j += 6; }
          else if (n === "x") { value += String.fromCharCode(parseInt(src.slice(j + 2, j + 4), 16)); j += 4; }
          else if (n === "\n") { j += 2; }
          else { value += n; j += 2; }
        } else {
          if (ch === "`" && src[j] === "$" && src[j + 1] === "{") dynamic = true;
          value += src[j]; j++;
        }
      }
      let k = start - 1;
      while (k >= 0 && /\s/.test(src[k])) k--;
      let key = null;
      if (src[k] === ":") {
        k--; while (k >= 0 && /\s/.test(src[k])) k--;
        let e = k + 1; while (k >= 0 && /[\w$]/.test(src[k])) k--;
        key = src.slice(k + 1, e) || null;
      }
      if (!dynamic) out.push({ start, end: j + 1, value, key });
      i = j + 1;
      continue;
    }
    i++;
  }
  return out;
}

/**
 * deck.js with the changes written in: only the string literals that held the old words are replaced, so
 * comments, layout, functions and everything else in the file stay exactly as they were.
 */
export function patchDeckSource(src, deck, changes) {
  const lits = stringLiterals(src);
  const slidesAt = src.search(/\bslides\s*:\s*\[/);
  if (slidesAt < 0) throw new Error("deck.js has no slides: [ ... ] to write into.");
  // Where each slide's words live: from its id to the next slide's id
  const regions = new Map();
  let from = slidesAt;
  deck.slides.forEach((s) => {
    const lit = lits.find((l) => l.start > from && l.key === "id" && l.value === s.id);
    if (!lit) throw new Error(`Couldn't find slide "${s.id}" in deck.js.`);
    regions.set(s.id, { start: lit.start }); from = lit.start;
  });
  const ids = deck.slides.map((s) => s.id);
  ids.forEach((id, i) => { regions.get(id).end = i + 1 < ids.length ? regions.get(ids[i + 1]).start : src.length; });

  const edits = [];
  for (const c of changes) {
    const region = c.slideId ? regions.get(c.slideId) : { start: 0, end: slidesAt };
    const key = c.key === undefined ? null : c.key;
    const candidates = lits.filter((l) => l.start >= region.start && l.end <= region.end && l.value === c.from && l.key === key);
    const lit = candidates[c.rank || 0];
    if (!lit) throw new Error(`Couldn't find the words for ${c.slideId || "the deck"} ${c.path} in deck.js.`);
    edits.push({ start: lit.start, end: lit.end, text: JSON.stringify(c.to) });
  }
  edits.sort((a, b) => b.start - a.start);
  for (let i = 1; i < edits.length; i++) if (edits[i].end > edits[i - 1].start) throw new Error("Two changes point at the same words in deck.js.");
  let out = src;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
  return out;
}

/** The talk's colors from a stylesheet's light-theme block (the same tokens the stage uses). */
export function colorsFromCss(css) {
  const block = /:root,\s*\[data-theme="light"\]\s*\{([^}]*)\}/.exec(css)?.[1] || "";
  const token = (name) => new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(block)?.[1];
  return colorsFrom(token);
}

/** The colors by role, given a function that reads a token's hex value. */
export function colorsFrom(token) {
  const c = {
    page: token("surface-page"), raised: token("surface-raised"), ink: token("fg-1"), soft: token("fg-2"), accent: token("fg-accent"),
    line: token("border-hairline"), inverse: token("surface-inverse"), onInverse: token("fg-on-inverse"), onInverse2: token("fg-on-inverse-2"),
    accentOnInverse: token("fg-accent-on-inverse"), water: token("surface-water-soft")
  };
  const missing = Object.entries(c).filter(([, v]) => !v || !/^#?[0-9a-f]{6}$/i.test(String(v).trim())).map(([k]) => k);
  if (missing.length) throw new Error("Missing colors for the export: " + missing.join(", "));
  return c;
}

