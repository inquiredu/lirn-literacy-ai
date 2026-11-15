// The rules of a presentation, with no page in sight: the deck's shape, timers, the session clock, pace,
// the {braces}, the keys, and what is saved where. The stage, the presenter view, the review and the checks
// all import this file, so each rule has exactly one copy. Tested by tests/core.test.js.

export const MIN_MINUTES = 1;
export const MAX_MINUTES = 60;
export const PROTOCOL = 1;   // the version of the messages between the stage and the presenter view

export const KINDS = ["title", "statement", "section", "pause", "steps", "cards", "split", "quote", "stats",
  "list", "plan", "code", "embed", "link", "custom"];

// A slide's ground, from the design system's own pairs (present/theme.css and slides.css):
// inverse, the full-bleed band; accent, peach; water, soft ice; warm, soft peach; night, the Night theme on one slide.
export const TONES = ["inverse", "accent", "water", "warm", "night"];
export const DEFAULT_TONES = { title: "night", section: "inverse", pause: "water" };

// What each kind needs, so the checks can say so before the morning does
const REQUIRED = {
  title: ["heading"], statement: ["heading"], section: ["heading"], pause: ["heading"], steps: ["heading", "steps"],
  cards: ["cards"], split: ["image"], quote: ["text"], stats: ["stats"], list: ["items"], plan: [], code: ["code"],
  embed: ["src", "heading"], link: ["heading"], custom: ["render"]
};


// ---------- Small helpers ----------

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
export const words = (n) => (Number.isInteger(n) && n >= 0 && n <= 10 ? WORDS[n] : String(n));
export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
export const clampMinutes = (n) => clamp(Math.round(n), MIN_MINUTES, MAX_MINUTES);

/** "1 minute", "4 minutes", "2 hours" (whole hours from two up read in hours). */
export function lengthLabel(minutes, { asWords = false } = {}) {
  const [n, unit] = minutes >= 120 && minutes % 60 === 0 ? [minutes / 60, "hours"] : [minutes, minutes === 1 ? "minute" : "minutes"];
  return (asWords ? words(n) : String(n)) + " " + unit;
}

/** 4:05 under an hour, 1:04:05 from an hour up. */
export function clockFace(seconds, { hours = false } = {}) {
  const s = Math.max(0, Math.ceil(seconds));
  const mm = String(Math.floor(s / 60) % 60).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  if (hours || s >= 3600) return Math.floor(s / 3600) + ":" + mm + ":" + ss;
  return Math.floor(s / 60) + ":" + ss;
}

/** Today's date in a time zone, as 2026-10-09. A saved call to order only counts on the day it was made. */
export function dayIn(timeZone, date = new Date()) {
  try { return new Intl.DateTimeFormat("en-CA", { timeZone: timeZone || undefined }).format(date); }
  catch { return new Intl.DateTimeFormat("en-CA").format(date); }
}

/** The moment a wall-clock time happens on a day in a time zone: ("2026-10-09", "10:00", "America/Chicago") -> epoch ms. */
export function zonedTime(day, time, timeZone) {
  const [y, mo, d] = day.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const wall = Date.UTC(y, mo - 1, d, h, mi);
  const offsetAt = (t) => {
    const parts = {};
    new Intl.DateTimeFormat("en-US", { timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      .formatToParts(new Date(t)).forEach((p) => { parts[p.type] = p.value; });
    return Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second) - t;
  };
  let t = wall - offsetAt(wall);
  t = wall - offsetAt(t);   // a second pass settles the hour a daylight-saving change moves
  return t;
}


// ---------- The deck ----------

/**
 * Lays out the deck the way every view reads it: slides numbered by position (never by hand), each part
 * knowing its slides and where it sits in the plan, and each timer resolved to a key and a length.
 * A slide's timer is a number of minutes, or { minutes, key } when several slides share one countdown.
 */
export function buildDeck(deck) {
  const parts = (deck.parts || []).map((p, i) => ({ ...p, index: i, slides: [], offset: 0 }));
  const partById = new Map(parts.map((p) => [p.id, p]));
  const timers = {};
  const slides = (deck.slides || []).map((s, i) => {
    let timer = null;
    if (typeof s.timer === "number") timer = { key: s.id, minutes: clampMinutes(s.timer) };
    else if (s.timer && typeof s.timer === "object") timer = { key: s.timer.key || s.id, minutes: clampMinutes(Number(s.timer.minutes)) };
    if (timer && !(timer.key in timers)) timers[timer.key] = timer.minutes;
    const part = partById.get(s.part) || null;
    const slide = { ...s, index: i, n: i + 1, part, partId: s.part ?? null, timer };
    if (part) part.slides.push(i);
    return slide;
  });
  let at = 0;
  parts.forEach((p) => { p.offset = at; at += p.minutes || 0; });
  const planned = parts.length && parts.every((p) => Number.isFinite(p.minutes)) ? at : null;
  return {
    ...deck,
    parts, slides, partById, timers, planned,
    slideById: new Map(slides.map((s) => [s.id, s])),
    length: Number.isFinite(deck.length) ? deck.length : planned
  };
}

/**
 * A slide's title for the rail, the notes, the contents and screen readers: its title if it has one, or its
 * heading, as plain words (braces filled, **marks** dropped). Give a slide a title when its heading is long.
 */
export function slideTitle(s, model) {
  const raw = s.title || s.heading || s.text || s.id;
  const words = model ? fill(raw, { model, slide: s }) : raw;
  return inline(words).map((r) => r.text ?? r.strong ?? r.em ?? " ").join("").replace(/\s+/g, " ").trim();
}

/** The address names the slide: #parable, or #12 from an older link. Unknown addresses open the first slide. */
export function slideFromHash(model, hash) {
  const h = decodeURIComponent(String(hash || "").replace(/^#\/?/, ""));
  if (!h) return 0;
  if (model.slideById.has(h)) return model.slideById.get(h).index;
  const n = Number.parseInt(h, 10);
  return /^\d+$/.test(h) && n >= 1 ? Math.min(n, model.slides.length) - 1 : 0;
}

/**
 * Everything wrong with a deck, in plain words. The checks fail on these and the stage lists them in the
 * console. fileExists, when given, lets the checks look for images on disk.
 */
export function deckProblems(deck, { fileExists } = {}) {
  const problems = [];
  const say = (m) => problems.push(m);
  const model = buildDeck(deck);
  const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/;

  if (!deck.id || !kebab.test(deck.id)) say(`The deck needs an id in kebab-case (it names what this deck saves in the browser): ${JSON.stringify(deck.id)}`);
  if (!deck.title) say("The deck needs a title.");
  if (!model.slides.length) say("The deck has no slides.");
  if (deck.url && !/^https:\/\//.test(deck.url)) say(`The deck's url should be an https address: ${deck.url}`);
  if (deck.theme !== undefined && !["light", "dark"].includes(deck.theme)) say(`The deck's theme is "light" (Ivory) or "dark" (Night), not ${JSON.stringify(deck.theme)}.`);
  if (deck.logo && !(deck.logo.light || deck.logo.dark)) say("The deck's logo needs a file: logo: { light, dark, alt }.");
  Object.entries(deck.links || {}).forEach(([name, url]) => {
    if (url && !/^(https:\/\/|mailto:|\.{0,2}\/|[\w-]+\.html)/.test(url)) say(`The link "${name}" isn't an https or relative address: ${url}`);
  });

  const partIds = new Set();
  model.parts.forEach((p) => {
    if (!p.id || !kebab.test(p.id)) say(`A part needs an id in kebab-case: ${JSON.stringify(p.id)}`);
    if (partIds.has(p.id)) say(`Two parts share the id "${p.id}".`);
    partIds.add(p.id);
    if (!p.title) say(`The part "${p.id}" needs a title.`);
    if (p.color !== undefined) say(`The part "${p.id}" has a color; parts take a tone now (${TONES.join(", ")}), for their section slide.`);
    if (p.tone !== undefined && !TONES.includes(p.tone)) say(`The part "${p.id}" has an unknown tone "${p.tone}". Known: ${TONES.join(", ")}.`);
    if (p.minutes !== undefined && !(Number.isInteger(p.minutes) && p.minutes > 0)) say(`The part "${p.id}" has minutes that aren't a whole number: ${p.minutes}`);
    if (!p.slides.length) say(`The part "${p.id}" has no slides.`);
  });
  if (deck.length !== undefined && model.planned !== null && model.planned !== deck.length) {
    say(`The parts add up to ${model.planned} minutes, but the deck says it runs ${deck.length}.`);
  }

  const ids = new Set();
  let lastPart = -1;
  model.slides.forEach((s) => {
    const where = `Slide ${s.n} (${s.id})`;
    if (!s.id || !kebab.test(s.id)) say(`Slide ${s.n} needs an id in kebab-case: ${JSON.stringify(s.id)}`);
    if (ids.has(s.id)) say(`Two slides share the id "${s.id}".`);
    ids.add(s.id);
    if (!KINDS.includes(s.kind)) say(`${where} has an unknown kind "${s.kind}". Known: ${KINDS.join(", ")}.`);
    (REQUIRED[s.kind] || []).forEach((field) => { if (s[field] === undefined || s[field] === "") say(`${where} is a ${s.kind} and needs ${field}.`); });
    if (s.kind === "custom" && typeof s.render !== "function") say(`${where} is custom and needs a render function.`);
    if (s.tone !== undefined && !TONES.includes(s.tone)) say(`${where} has an unknown tone "${s.tone}". Known: ${TONES.join(", ")}.`);
    const keys = [...(s.items || []), ...(s.cards || [])].filter((x) => x && x.key).length;
    if (keys > 1) say(`${where} marks ${keys} items as key; ✦ marks one key item per slide.`);
    if (model.parts.length) {
      if (!s.partId) say(`${where} needs a part.`);
      else if (!s.part) say(`${where} names a part the deck doesn't have: ${s.partId}`);
      else if (s.part.index < lastPart) say(`${where} sits in "${s.partId}" after a later part; keep each part in one stretch.`);
      else lastPart = s.part.index;
    }
    if (!s.notes || !String(s.notes).trim()) say(`${where} has no speaker notes. Write one line, even "Let it sit."`);
    const raw = deck.slides[s.index].timer;
    const rawMinutes = typeof raw === "number" ? raw : raw?.minutes;
    if (raw !== undefined && !(Number.isInteger(rawMinutes) && rawMinutes >= MIN_MINUTES && rawMinutes <= MAX_MINUTES)) {
      say(`${where} has a timer that isn't a whole number of minutes from ${MIN_MINUTES} to ${MAX_MINUTES}: ${JSON.stringify(raw)}`);
    }
    if (s.timer && model.timers[s.timer.key] !== s.timer.minutes) say(`${where} shares the timer "${s.timer.key}" but gives it a different length.`);

    // Pictures: on disk, with words for anyone who can't see them
    images(s).forEach(({ src, alt, decorative }) => {
      if (fileExists && src && !/^(https?:|data:)/.test(src) && !fileExists(src)) say(`${where} uses a picture that isn't there: ${src}`);
      if (!decorative && !(typeof alt === "string" && alt.trim().length >= 5)) say(`${where} has a picture without alt text (or mark it decorative: true): ${src}`);
    });

    // Every brace in the slide's words has to mean something
    walkStrings(deck.slides[s.index], (text, key) => {
      if (key === "code" || key === "src" || key === "id") return;
      tokens(text).forEach((t) => {
        if (t.token && resolveToken(t, { model, slide: s }) === null) say(`${where} has {${t.token}}, which nothing fills in.`);
      });
    });
  });
  ["title", "subtitle", "by"].forEach((key) => {
    if (typeof deck[key] === "string") tokens(deck[key]).forEach((t) => {
      if (t.token && resolveToken(t, { model, slide: null }) === null) say(`The deck's ${key} has {${t.token}}, which nothing fills in.`);
    });
  });
  if (deck.resources !== undefined) problems.push(...resourceProblems(deck.resources, { parts: partIds }));
  return problems;
}

// ---------- Sources ----------
// deck.resources (resources.js): every source the talk leans on, looked at three ways. The sources page
// shows them; these are the rules that keep each entry honest as people add, cut and edit.
export const RESOURCE_CHECKS = ["found", "says", "others"];
export const RESOURCE_STATUSES = ["yes", "partly", "no", "open"];
export const RESOURCE_VERDICTS = ["stands", "care", "aside"];
export const RESOURCE_FROM = ["deck", "doc", "added"];

export function resourceProblems(resources, { parts } = {}) {
  const problems = [];
  const say = (m) => problems.push(m);
  const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  const https = (url) => /^https:\/\//.test(url);
  if (!resources || !Array.isArray(resources.entries)) return ["The deck's resources need a list of entries."];
  if (resources.checked !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(resources.checked)) say(`The resources' checked date should read YYYY-MM-DD: ${resources.checked}`);
  const ids = new Set();
  resources.entries.forEach((e, i) => {
    const where = `Source ${i + 1} (${e.id || "no id"})`;
    if (!e.id || !kebab.test(e.id)) say(`${where} needs an id in kebab-case.`);
    if (ids.has(e.id)) say(`Two sources share the id "${e.id}".`);
    ids.add(e.id);
    if (!e.title) say(`${where} needs a title.`);
    if (!e.who) say(`${where} needs to say who made it.`);
    if (!RESOURCE_VERDICTS.includes(e.verdict)) say(`${where} needs a verdict: ${RESOURCE_VERDICTS.join(", ")}.`);
    if (!RESOURCE_FROM.includes(e.from)) say(`${where} needs to say where it came from: ${RESOURCE_FROM.join(", ")}.`);
    if (e.url !== undefined && e.url !== null && !https(e.url)) say(`${where} has a link that isn't https: ${e.url}`);
    if (!Array.isArray(e.parts)) say(`${where} needs a list of parts (empty is fine).`);
    else if (parts) e.parts.forEach((p) => { if (!parts.has(p)) say(`${where} names a part the deck doesn't have: ${p}`); });
    if (e.verdict !== "aside" && e.parts?.length === 0) say(`${where} is kept but belongs to no part of the talk.`);
    const checks = e.checks || {};
    const extra = Object.keys(checks).filter((k) => !RESOURCE_CHECKS.includes(k));
    if (extra.length) say(`${where} has checks nobody reads: ${extra.join(", ")}.`);
    RESOURCE_CHECKS.forEach((k) => {
      const c = checks[k];
      if (!c) { say(`${where} is missing the "${k}" check. Every source gets all three; "open" is fine.`); return; }
      if (!RESOURCE_STATUSES.includes(c.status)) say(`${where} has an unknown status for "${k}": ${JSON.stringify(c.status)}. Known: ${RESOURCE_STATUSES.join(", ")}.`);
      if (!c.note || !String(c.note).trim()) say(`${where} says nothing about the "${k}" check. Say what was looked at, or that it wasn't.`);
      if (c.link !== undefined && !https(c.link)) say(`${where} has a "${k}" link that isn't https: ${c.link}`);
      if (c.status !== "open" && c.status !== "no" && !c.link && e.verdict !== "aside") say(`${where} passes "${k}" without a link to what was looked at.`);
    });
  });
  return problems;
}

function images(slide) {
  const out = [];
  const add = (img) => { if (img && typeof img === "object" && img.src) out.push(img); };
  add(slide.image);
  (slide.cards || []).forEach((c) => add(c.image));
  return out;
}

function walkStrings(node, visit, key = "") {
  if (typeof node === "string") visit(node, key);
  else if (Array.isArray(node)) node.forEach((v) => walkStrings(v, visit, key));
  else if (node && typeof node === "object") Object.entries(node).forEach(([k, v]) => walkStrings(v, visit, k));
}


// ---------- {Braces} ----------
// Words that follow the deck instead of being typed twice. A timer's length can change on the day, so
// {mins} stays live: the views draw it as a span that the clock keeps up to date.
//
//   {title} {subtitle} {by} {url}      the deck's own words; {url} reads without https:// or the last slash
//   {length}                           how long the session runs: "30 minutes", "2 hours"
//   {build.length}                     how long a part runs, by its id
//   {mins}                             this slide's timer, as the presenter last set it: "4 minutes"
//   {pairs.mins}                       a timer by its key
//   {links.site}                       a link from the deck's links
//   {count} {parts}                    how many slides, how many parts
// Add :words for "four minutes", :number for "4", or :unit for "minutes". Start with a capital to capitalize.
// To show a brace as typed, double it: {{mins}} reads {mins}.

const TOKEN = /\{\{([^{}]*)\}\}|\{([A-Za-z][\w-]*(?:\.[\w-]+)?)(?::(words|number|unit))?\}/g;

/** Splits text into plain runs and {braces}: [{ text }, { token, name, field, modifier, cap }]. */
export function tokens(text) {
  const out = [];
  let last = 0;
  text = String(text);
  text.replace(TOKEN, (whole, literal, body, modifier, at) => {
    if (at > last) out.push({ text: text.slice(last, at) });
    last = at + whole.length;
    if (literal !== undefined) { out.push({ text: "{" + literal + "}" }); return whole; }
    const cap = /^[A-Z]/.test(body);
    const lower = body.charAt(0).toLowerCase() + body.slice(1);
    const [name, field] = lower.split(".");
    out.push({ token: body + (modifier ? ":" + modifier : ""), whole, name, field, modifier, cap });
    last = at + whole.length;
    return whole;
  });
  if (last < String(text).length) out.push({ text: String(text).slice(last) });
  return out;
}

const shortUrl = (url) => String(url || "").replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * What a brace stands for: { text } now, { timer: key } for a live timer length, or null when nothing fills it.
 * minutesFor(key) gives a timer's current length; without it, the deck's own length.
 */
export function resolveToken(t, { model, slide, minutesFor } = {}) {
  const { name, field } = t;
  const minutes = (key) => (minutesFor ? minutesFor(key) : model.timers[key]);
  if (!field) {
    if (name === "title" || name === "subtitle" || name === "by") return model[name] ? { text: model[name] } : null;
    if (name === "url") return model.url ? { text: shortUrl(model.url) } : null;
    if (name === "length") return model.length ? { length: model.length } : null;
    if (name === "count") return { text: String(model.slides.length) };
    if (name === "parts") return { text: String(model.parts.length) };
    if (name === "mins") return slide?.timer ? { timer: slide.timer.key, length: minutes(slide.timer.key) } : null;
    return null;
  }
  if (name === "links") return model.links?.[field] ? { text: model.links[field] } : null;
  if (field === "length" && model.partById.get(name)?.minutes) return { length: model.partById.get(name).minutes };
  if (field === "mins" && name in model.timers) return { timer: name, length: minutes(name) };
  return null;
}

/** The words a resolved brace reads as, for a length that may have changed since. */
export function tokenText(t, value) {
  let text;
  if (value.length !== undefined) {
    const n = value.length;
    if (t.modifier === "number") text = String(n >= 120 && n % 60 === 0 ? n / 60 : n);
    else if (t.modifier === "unit") text = lengthLabel(n).split(" ")[1];
    else text = lengthLabel(n, { asWords: t.modifier === "words" });
  } else {
    text = value.text;
  }
  return t.cap ? capitalize(text) : text;
}

/** Fills every brace in plain text; unknown braces stay as typed so the mistake is visible. */
export function fill(text, ctx) {
  return tokens(text).map((t) => {
    if (!t.token) return t.text;
    const value = resolveToken(t, ctx);
    return value ? tokenText(t, value) : t.whole;
  }).join("");
}

/**
 * Splits words into runs for the page: plain text, **strong**, *emphasis*, line breaks and braces.
 * The views build elements from these runs (never HTML strings), so a deck can't inject markup.
 */
export function inline(text) {
  const runs = [];
  const re = /\*\*([^*]+)\*\*|\*([^*\s][^*]*)\*|\n/g;
  let last = 0;
  let m;
  const str = String(text);
  while ((m = re.exec(str))) {
    if (m.index > last) runs.push({ text: str.slice(last, m.index) });
    if (m[0] === "\n") runs.push({ br: true });
    else if (m[1] !== undefined) runs.push({ strong: m[1] });
    else runs.push({ em: m[2] });
    last = m.index + m[0].length;
  }
  if (last < str.length) runs.push({ text: str.slice(last) });
  return runs;
}


// ---------- Timers ----------
// A countdown the presenter starts, pauses, and stretches or shrinks as the conversation goes.
// run: { end } (epoch ms) while running, { left } (seconds) while paused, undefined when untouched.

export function secondsLeft(run, minutes, now) {
  if (!run) return minutes * 60;
  if (run.end !== undefined) return Math.max(0, (run.end - now) / 1000);
  return run.left ?? minutes * 60;
}

export function timerView(run, minutes, now) {
  const total = minutes * 60;
  const left = secondsLeft(run, minutes, now);
  const done = left <= 0;
  const running = run?.end !== undefined && !done;
  const touched = left < total;
  return {
    seconds: left,
    display: clockFace(left),
    status: done ? "Time" : running ? "Running" : touched ? "Paused" : "Ready",
    action: running ? "Pause" : done ? "Restart" : touched ? "Resume" : "Start",
    running,
    done,
    pct: total ? (100 * left) / total : 0   // share of the time left, for the bar
  };
}

export function toggleRun(run, minutes, now) {
  const v = timerView(run, minutes, now);
  if (v.running) return { left: v.seconds };
  return { end: now + (v.done ? minutes * 60 : v.seconds) * 1000 };
}

/**
 * A minute more or less without stopping: a running timer keeps running with the minute added to what's left.
 * Time left never drops below zero, and the length stays between one minute and an hour.
 */
export function adjustRun(run, minutes, delta, now) {
  const next = clampMinutes(minutes + delta);
  const change = (next - minutes) * 60;
  if (!run) return { minutes: next, run: undefined };
  const left = Math.max(0, secondsLeft(run, minutes, now) + change);
  return { minutes: next, run: run.end !== undefined ? { end: now + left * 1000 } : { left } };
}


// ---------- The session clock ----------
// The whole session, to the second. It waits for the presenter's call to order; on the deck's own day it
// counts from the advertised start, so the room sees the right figure even if nobody presses anything.
// clock: { start, pausedAt } in epoch ms; start is null before the call to order.

/** When the session began: the call to order saved today, or the advertised start on the deck's day, or not yet. */
export function clockStart(saved, model, now) {
  if (saved && saved.reset) return null;
  if (saved && Number.isFinite(saved.start)) return saved.start;
  if (model.day && model.start && model.timeZone && dayIn(model.timeZone, new Date(now)) === model.day) {
    return zonedTime(model.day, model.start, model.timeZone);
  }
  return null;
}

export function sessionClock(now, start, pausedAt, lengthMinutes) {
  const length = lengthMinutes * 60;
  const hours = length >= 3600;
  const at = pausedAt ?? now;
  if (start === null || start === undefined || at < start) {
    return { state: "ready", display: clockFace(length, { hours }), label: lengthLabel(lengthMinutes), pct: 0, elapsed: 0, over: false };
  }
  const elapsed = (at - start) / 1000;
  const left = length - elapsed;
  const paused = pausedAt !== null && pausedAt !== undefined;
  if (left >= 0) {
    return { state: paused ? "paused" : "running", display: clockFace(left, { hours }), label: paused ? "paused" : "left", pct: (100 * elapsed) / length, elapsed, over: false };
  }
  return { state: paused ? "paused" : "over", display: "+" + clockFace(-left, { hours }), label: paused ? "paused" : "over", pct: 100, elapsed, over: true };
}

/** Pause or resume. A pause doesn't count: resuming moves the start later by however long it lasted. */
export function togglePause(clock, now) {
  if (clock.start === null || clock.start === undefined) return clock;
  if (clock.pausedAt !== null && clock.pausedAt !== undefined) return { start: clock.start + (now - clock.pausedAt), pausedAt: null };
  return { start: clock.start, pausedAt: now };
}


// ---------- Pace ----------
// The plan spreads each part's minutes evenly over its slides. Set against the session clock, that says
// where the plan would be now, and how far ahead or behind the room is. Lengths, never clock times.

/** Minutes into the plan at which a slide begins, or null without part minutes. */
export function plannedAt(model, index) {
  const s = model.slides[index];
  if (model.planned === null || !s?.part) return null;
  const p = s.part;
  return p.offset + (p.slides.indexOf(index) / p.slides.length) * p.minutes;
}

/** Where the plan says the room is, as a slide position (fractional, 0 to the slide count). */
export function plannedPosition(model, elapsedMinutes) {
  if (model.planned === null) return null;
  for (const p of model.parts) {
    if (elapsedMinutes < p.offset + p.minutes) {
      const frac = Math.max(0, elapsedMinutes - p.offset) / p.minutes;
      return p.slides[0] + frac * p.slides.length;
    }
  }
  return model.slides.length;
}

/** The first slide of the part the plan says is on: N jumps there. */
export function slideForNow(model, elapsedMinutes) {
  if (model.planned === null) return null;
  const p = model.parts.find((part) => elapsedMinutes < part.offset + part.minutes) || model.parts[model.parts.length - 1];
  return p.slides[0];
}

/** "On plan", "4 min behind the plan", "2 min ahead": within a minute either way counts as on plan. */
export function paceWords(model, index, elapsedMinutes) {
  const at = plannedAt(model, index);
  if (at === null) return null;
  const diff = Math.round(elapsedMinutes - at);
  if (Math.abs(diff) <= 1) return { diff, text: "On plan" };
  return { diff, text: diff > 0 ? `${diff} min behind the plan` : `${-diff} min ahead of the plan` };
}


// ---------- Keys ----------
// One table: the stage and the presenter view act on it, and the help and the hint are written from it.

export const KEYS = [
  { action: "next", keys: ["ArrowRight", "ArrowDown", "PageDown", " "], label: "→ or Space", does: "Next slide" },
  { action: "prev", keys: ["ArrowLeft", "ArrowUp", "PageUp"], label: "←", does: "Previous slide" },
  { action: "first", keys: ["Home"], label: "Home", does: "First slide" },
  { action: "last", keys: ["End"], label: "End", does: "Last slide" },
  { action: "timer", keys: ["t", "T"], label: "T", does: "Start or pause this slide's timer (on the first slide: call to order)" },
  { action: "plus", keys: ["+", "="], label: "+", does: "A minute more on the timer, without stopping it" },
  { action: "minus", keys: ["-", "_"], label: "−", does: "A minute less on the timer" },
  { action: "notes", keys: ["s", "S"], label: "S", does: "Speaker notes, in a second window", stageOnly: true },
  { action: "clock", keys: ["c", "C"], label: "C", does: "The session clock, large, with wait time", stageOnly: true },
  { action: "pause", keys: ["p", "P"], label: "P", does: "Pause or resume the session clock" },
  { action: "now", keys: ["n", "N"], label: "N", does: "Jump to where the plan says we are" },
  { action: "blank", keys: ["b", "B", "."], label: "B", does: "Blank the screen; any key brings it back" },
  { action: "qr", keys: ["q", "Q"], label: "Q", does: "The way back to the site, as a large QR code", stageOnly: true },
  { action: "fullscreen", keys: ["f", "F"], label: "F", does: "Full screen", stageOnly: true },
  { action: "help", keys: ["?"], label: "?", does: "These keys", stageOnly: true },
  { action: "escape", keys: ["Escape"], label: "Esc", does: "Close what's open", stageOnly: true }
];
const BY_KEY = new Map(KEYS.flatMap((k) => k.keys.map((key) => [key, k.action])));

/**
 * The action a key press asks for, or null. Shortcuts with ⌘, Ctrl or Alt belong to the browser
 * (⌘P prints, Ctrl+C copies), typing belongs to the field, and Space or Enter on a button presses the button.
 */
export function actionFor({ key, metaKey, ctrlKey, altKey, target } = {}) {
  if (metaKey || ctrlKey || altKey) return null;
  const tag = target?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "IFRAME" || target?.isContentEditable) return null;
  if ((tag === "BUTTON" || tag === "A" || tag === "SUMMARY") && (key === " " || key === "Enter")) return null;
  return BY_KEY.get(key) ?? null;
}


// ---------- What's saved, and where ----------
// Sites on one GitHub Pages account share an origin (inquiredu.org/one-talk and inquiredu.org/another), so
// they share localStorage and BroadcastChannel names. Everything here is named for the deck's id.

export const channelName = (deckId) => `present:${deckId}`;

/**
 * A small, careful store: JSON values under the deck's name, some kept for today only. A blocked or
 * private-window storage reads as empty and writes nowhere, and the presentation still runs.
 */
export function createStore(storage, deckId, today) {
  const name = (key) => `present:${deckId}:${key}`;
  const get = (key) => {
    try { return JSON.parse(storage?.getItem(name(key)) ?? "null"); } catch { return null; }
  };
  const set = (key, value) => {
    try { value === null ? storage?.removeItem(name(key)) : storage?.setItem(name(key), JSON.stringify(value)); } catch { /* private window */ }
  };
  return {
    get, set,
    /** For values that belong to one day: a call to order, running timers, a wait. */
    getToday: (key) => { const v = get(key); return v && v.day === today ? v.value : null; },
    setToday: (key, value) => set(key, value === null ? null : { day: today, value })
  };
}

/** Saved lengths, cleaned: whole minutes in range, only for timers the deck still has. */
export function cleanLengths(saved, timers) {
  const out = { ...timers };
  if (saved && typeof saved === "object") {
    Object.keys(timers).forEach((key) => {
      const n = Number(saved[key]);
      if (saved[key] !== undefined && Number.isFinite(n)) out[key] = clampMinutes(n);
    });
  }
  return out;
}

/** Saved runs, cleaned: only shapes a timer can be in, only for timers the deck still has. */
export function cleanRuns(saved, timers) {
  const out = {};
  if (saved && typeof saved === "object") {
    Object.keys(timers).forEach((key) => {
      const r = saved[key];
      if (r && Number.isFinite(r.end)) out[key] = { end: r.end };
      else if (r && Number.isFinite(r.left) && r.left >= 0) out[key] = { left: r.left };
    });
  }
  return out;
}
