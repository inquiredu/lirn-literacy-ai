// The rules every view shares: node --test tests/
// Timer cases come from both sites' tests (Hands On's stage-timer and What We Talk About's talk tests);
// the rest cover what the kit added: the clock in epoch time, pace, braces, keys and named storage.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildDeck, deckProblems, slideFromHash, slideTitle, timerView, toggleRun, adjustRun, secondsLeft, clampMinutes,
  sessionClock, togglePause, clockStart, zonedTime, dayIn, plannedAt, plannedPosition, slideForNow, paceWords,
  tokens, fill, inline, lengthLabel, clockFace, words, actionFor, KEYS, createStore, cleanLengths, cleanRuns, channelName
} from "../present/core.js";

const DECK = {
  id: "test-deck", title: "A Test", url: "https://example.org/test/", by: "A. Presenter",
  links: { site: "https://example.org/test/", backup: "" },
  parts: [{ id: "open", title: "Opening", minutes: 10 }, { id: "work", title: "Work", minutes: 20 }],
  slides: [
    { id: "hello", part: "open", kind: "title", heading: "{title}", notes: "Welcome." },
    { id: "plan", part: "open", kind: "plan", heading: "The plan", notes: "{Length} in all." },
    { id: "pairs", part: "work", kind: "pause", heading: "Talk", notes: "{Mins:words} in pairs.", timer: 4 },
    { id: "build", part: "work", kind: "statement", heading: "Build", notes: "Shared timer.", timer: { minutes: 15, key: "rooms" } },
    { id: "build-2", part: "work", kind: "statement", heading: "Keep building", notes: "Same timer, {rooms.mins} in all.", timer: { minutes: 15, key: "rooms" } }
  ]
};
const t0 = 1_000_000;


// ---------- The deck ----------

test("slides are numbered by position, parts know their slides and their place in the plan", () => {
  const m = buildDeck(DECK);
  assert.deepEqual(m.slides.map((s) => s.n), [1, 2, 3, 4, 5]);
  assert.deepEqual(m.parts.map((p) => [p.id, p.offset, p.slides]), [["open", 0, [0, 1]], ["work", 10, [2, 3, 4]]]);
  assert.equal(m.planned, 30);
  assert.equal(m.length, 30, "without a length, the parts decide it");
  assert.equal(buildDeck({ ...DECK, length: 45 }).length, 45);
});

test("timers resolve to a key and a length; slides that name one key share it", () => {
  const m = buildDeck(DECK);
  assert.deepEqual(m.slides[2].timer, { key: "pairs", minutes: 4 });
  assert.deepEqual(m.slides[3].timer, m.slides[4].timer);
  assert.deepEqual(m.timers, { pairs: 4, rooms: 15 });
  assert.equal(buildDeck({ ...DECK, slides: [{ ...DECK.slides[0], timer: 90 }] }).slides[0].timer.minutes, 60, "at most an hour");
});

test("the address names a slide by id, or by number from an older link", () => {
  const m = buildDeck(DECK);
  assert.equal(slideFromHash(m, "#pairs"), 2);
  assert.equal(slideFromHash(m, "#/build-2"), 4);
  assert.equal(slideFromHash(m, "#3"), 2);
  assert.equal(slideFromHash(m, "#99"), 4, "past the end opens the last slide");
  assert.equal(slideFromHash(m, "#nope"), 0);
  assert.equal(slideFromHash(m, ""), 0);
  assert.equal(slideTitle(m.slides[2]), "Talk");
});

test("a sound deck has no problems", () => {
  assert.deepEqual(deckProblems(DECK), []);
});

test("the checks name what's wrong, in words", () => {
  const broken = {
    ...DECK, id: "Not Kebab", length: 25, url: "http://example.org",
    slides: [
      { id: "a", part: "work", kind: "title", heading: "Late part first", notes: "x" },
      { id: "a", part: "open", kind: "wobble", notes: "" },
      { id: "c", part: "nowhere", kind: "split", image: { src: "pic.png" }, notes: "x", heading: "{nothing}" },
      { id: "d", part: "work", kind: "statement", heading: "Odd timer", notes: "x", timer: 2.5 },
      { id: "e", part: "work", kind: "statement", heading: "Shared", notes: "x", timer: { minutes: 3, key: "k" } },
      { id: "f", part: "work", kind: "statement", heading: "Shared", notes: "x", timer: { minutes: 5, key: "k" } }
    ]
  };
  const problems = deckProblems(broken, { fileExists: () => false }).join("\n");
  for (const words of ["kebab-case", "https address", "add up to 30 minutes", "Two slides share the id \"a\"", "unknown kind \"wobble\"",
    "no speaker notes", "names a part the deck doesn't have", "after a later part", "picture that isn't there", "without alt text",
    "{nothing}", "whole number of minutes", "different length"]) {
    assert.ok(problems.includes(words), `expected a problem mentioning ${words}\n${problems}`);
  }
  assert.match(deckProblems({ ...DECK, parts: [...DECK.parts, { id: "spare", title: "Spare", minutes: 5 }] }).join("\n"), /The part "spare" has no slides/);
});


// ---------- Braces and words ----------

test("braces fill from the deck, with words, numbers, units and capitals", () => {
  const m = buildDeck(DECK);
  const ctx = { model: m, slide: m.slides[2] };
  assert.equal(fill("{title} by {by}", ctx), "A Test by A. Presenter");
  assert.equal(fill("{length}, {Length:words}", { ...ctx, model: buildDeck({ ...DECK, length: 120 }) }), "2 hours, Two hours");
  assert.equal(fill("{Mins:words} in pairs", ctx), "Four minutes in pairs");
  assert.equal(fill("{mins:number}/{mins:unit}", ctx), "4/minutes");
  assert.equal(fill("{work.length} of work, {rooms.mins} in rooms", ctx), "20 minutes of work, 15 minutes in rooms");
  assert.equal(fill("Back at {url}", ctx), "Back at example.org/test");
  assert.equal(fill("{links.site}", ctx), "https://example.org/test/");
  assert.equal(fill("{links.backup} {oops}", ctx), "{links.backup} {oops}", "unknown or empty braces stay as typed");
  assert.equal(fill("{mins}", { model: m, slide: m.slides[2], minutesFor: () => 6 }), "6 minutes", "a live length follows the presenter");
});

test("braces inside words split into runs the views can keep live", () => {
  assert.deepEqual(tokens("A {mins} pause").map((t) => t.text ?? t.token), ["A ", "mins", " pause"]);
  assert.deepEqual(inline("We mean **mistrust**, *gently*.\nThen"), [
    { text: "We mean " }, { strong: "mistrust" }, { text: ", " }, { em: "gently" }, { text: "." }, { br: true }, { text: "Then" }
  ]);
  assert.deepEqual(inline("2 * 3 * 4"), [{ text: "2 * 3 * 4" }], "a lone asterisk is just an asterisk");
});

test("lengths and faces read the way people say them", () => {
  assert.deepEqual([lengthLabel(1), lengthLabel(4), lengthLabel(90), lengthLabel(120), lengthLabel(4, { asWords: true })],
    ["1 minute", "4 minutes", "90 minutes", "2 hours", "four minutes"]);
  assert.deepEqual([clockFace(240), clockFace(59.2), clockFace(3725), clockFace(300, { hours: true })], ["4:00", "1:00", "1:02:05", "0:05:00"]);
  assert.equal(words(11), "11");
});


// ---------- Timers ----------

test("a timer walks Ready, Running, Paused, Time, with the right button each time", () => {
  assert.deepEqual([timerView(undefined, 4, t0).display, timerView(undefined, 4, t0).status, timerView(undefined, 4, t0).action, timerView(undefined, 4, t0).pct],
    ["4:00", "Ready", "Start", 100]);
  let run = toggleRun(undefined, 4, t0);
  assert.equal(timerView(run, 4, t0 + 30_500).display, "3:30");
  assert.equal(timerView(run, 4, t0 + 30_500).status, "Running");
  run = toggleRun(run, 4, t0 + 60_000);
  assert.deepEqual([timerView(run, 4, t0 + 999_999).display, timerView(run, 4, t0).action], ["3:00", "Resume"], "paused holds");
  run = toggleRun(run, 4, t0 + 100_000);
  assert.equal(timerView(run, 4, t0 + 280_000).status, "Time");
  assert.equal(timerView(run, 4, t0 + 999_999).display, "0:00", "never negative");
  assert.equal(timerView(run, 4, t0 + 999_999).action, "Restart");
  assert.equal(timerView(toggleRun(run, 4, t0 + 999_999), 4, t0 + 999_999).display, "4:00", "restart starts over");
});

test("a minute more keeps a running timer running, with the minute added to what's left", () => {
  const run = toggleRun(undefined, 4, t0);
  const r = adjustRun(run, 4, +1, t0 + 60_000);
  assert.equal(r.minutes, 5);
  assert.equal(timerView(r.run, r.minutes, t0 + 60_000).display, "4:00");
  assert.equal(timerView(r.run, r.minutes, t0 + 60_000).running, true);
  assert.equal(timerView(adjustRun(run, 4, -1, t0 + 200_000).run, 3, t0 + 200_000).display, "0:00", "shrinking stops at zero");
  assert.deepEqual(adjustRun(undefined, 1, -1, t0), { minutes: 1, run: undefined }, "never below a minute");
  const paused = { left: 90 };
  assert.deepEqual(adjustRun(paused, 4, +1, t0).run, { left: 150 }, "a paused timer stays paused");
  assert.equal(secondsLeft(undefined, 2, t0), 120);
  assert.equal(clampMinutes(3.6), 4);
});


// ---------- The session clock ----------

test("the clock waits, counts down to the second, pauses, and counts how far over", () => {
  const len = 120;
  assert.deepEqual([sessionClock(t0, null, null, len).state, sessionClock(t0, null, null, len).display], ["ready", "2:00:00"]);
  const start = t0;
  const at = (m, s = 0) => t0 + (m * 60 + s) * 1000;
  assert.deepEqual([sessionClock(at(42, 5), start, null, len).display, sessionClock(at(42, 5), start, null, len).label], ["1:17:55", "left"]);
  assert.equal(sessionClock(at(90), start, null, len).pct, 75);
  assert.equal(sessionClock(at(120), start, null, len).display, "0:00:00", "the last second is still on time");
  assert.deepEqual([sessionClock(at(125, 12), start, null, len).display, sessionClock(at(125, 12), start, null, len).over], ["+0:05:12", true]);
  assert.equal(sessionClock(at(10), start, null, 30).display, "20:00", "under an hour reads as minutes");
  const paused = sessionClock(at(50), start, at(20), 30);
  assert.deepEqual([paused.state, paused.display, paused.label], ["paused", "10:00", "paused"], "a pause holds the figure");
});

test("a pause doesn't count: resuming moves the start later by the pause", () => {
  let clock = { start: t0, pausedAt: null };
  clock = togglePause(clock, t0 + 60_000);
  assert.equal(clock.pausedAt, t0 + 60_000);
  clock = togglePause(clock, t0 + 360_000);
  assert.deepEqual(clock, { start: t0 + 300_000, pausedAt: null });
  assert.deepEqual(togglePause({ start: null, pausedAt: null }, t0), { start: null, pausedAt: null }, "nothing to pause before the call");
});

test("the clock starts from a call to order, or on the deck's day from its start, and waits on other days", () => {
  const model = buildDeck({ ...DECK, day: "2026-10-09", start: "10:00", timeZone: "America/Chicago" });
  const ten = zonedTime("2026-10-09", "10:00", "America/Chicago");
  assert.equal(new Date(ten).toISOString(), "2026-10-09T15:00:00.000Z", "10:00 Central in October is 15:00 UTC");
  assert.equal(clockStart({ start: ten + 240_000 }, model, ten + 300_000), ten + 240_000, "a call to order wins");
  assert.equal(clockStart(null, model, ten + 60_000), ten, "on the day, the advertised start");
  assert.equal(clockStart(null, model, ten - 86_400_000), null, "a rehearsal the day before waits for the call");
  assert.equal(clockStart({ reset: true }, model, ten + 60_000), null, "after a reset it waits, even on the day");
  assert.equal(dayIn("America/Chicago", new Date("2026-10-10T03:00:00Z")), "2026-10-09", "the day is the deck's, not UTC's");
  assert.equal(new Date(zonedTime("2026-03-08", "10:00", "America/Chicago")).toISOString(), "2026-03-08T15:00:00.000Z", "after the spring change");
});


// ---------- Pace ----------

test("the plan spreads each part over its slides, and says where the room should be", () => {
  const m = buildDeck(DECK);
  assert.deepEqual([0, 1, 2, 3, 4].map((i) => Math.round(plannedAt(m, i) * 100) / 100), [0, 5, 10, 16.67, 23.33]);
  assert.equal(plannedPosition(m, 5), 1);
  assert.equal(plannedPosition(m, 20), 2 + 1.5);
  assert.equal(plannedPosition(m, 99), 5);
  assert.equal(slideForNow(m, 12), 2, "twelve minutes in, the plan is in Work");
  assert.equal(slideForNow(m, 99), 2, "past the end, the last part");
  assert.deepEqual(paceWords(m, 1, 5.4), { diff: 0, text: "On plan" });
  assert.deepEqual(paceWords(m, 1, 9), { diff: 4, text: "4 min behind the plan" });
  assert.deepEqual(paceWords(m, 3, 12), { diff: -5, text: "5 min ahead of the plan" });
  assert.equal(paceWords(buildDeck({ ...DECK, parts: [] }), 0, 3), null, "no plan, no pace");
});


// ---------- Keys ----------

test("keys map to actions, and leave the browser's shortcuts and typing alone", () => {
  const press = (key, extra = {}) => actionFor({ key, target: { tagName: "MAIN" }, ...extra });
  assert.equal(press("ArrowRight"), "next");
  assert.equal(press("PageDown"), "next", "a clicker's forward button");
  assert.equal(press(" "), "next");
  assert.equal(press("PageUp"), "prev");
  assert.equal(press("t"), "timer");
  assert.equal(press("."), "blank", "a clicker's blank button");
  assert.equal(press("?"), "help");
  assert.equal(press("p", { metaKey: true }), null, "⌘P prints, it doesn't pause the clock");
  assert.equal(press("c", { ctrlKey: true }), null, "Ctrl+C copies, it doesn't open the clock");
  assert.equal(press("f", { altKey: true }), null);
  assert.equal(press("n", { target: { tagName: "INPUT" } }), null, "typing in a field");
  assert.equal(press(" ", { target: { tagName: "BUTTON" } }), null, "Space presses the focused button");
  assert.equal(press("ArrowRight", { target: { tagName: "BUTTON" } }), "next", "arrows still move from a button");
  assert.equal(press("x"), null);
  const all = KEYS.flatMap((k) => k.keys);
  assert.equal(new Set(all).size, all.length, "no key does two things");
});


// ---------- Storage ----------

function memoryStorage() {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)), removeItem: (k) => data.delete(k), data };
}

test("everything saved is named for the deck, and day-only values expire with the day", () => {
  const storage = memoryStorage();
  const today = createStore(storage, "talk-one", "2026-10-09");
  today.set("lengths", { pairs: 6 });
  today.setToday("clock", { start: t0 });
  assert.deepEqual([...storage.data.keys()].sort(), ["present:talk-one:clock", "present:talk-one:lengths"]);
  assert.deepEqual(today.getToday("clock"), { start: t0 });
  const tomorrow = createStore(storage, "talk-one", "2026-10-10");
  assert.equal(tomorrow.getToday("clock"), null, "yesterday's call to order doesn't start today's clock");
  assert.deepEqual(tomorrow.get("lengths"), { pairs: 6 }, "lengths carry over");
  assert.equal(createStore(storage, "talk-two", "2026-10-09").get("lengths"), null, "another deck on the same site sees nothing");
  assert.equal(channelName("talk-one"), "present:talk-one");
  today.setToday("clock", null);
  assert.equal(today.getToday("clock"), null);
});

test("blocked storage reads as empty and the show goes on", () => {
  const blocked = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };
  const store = createStore(blocked, "x", "2026-10-09");
  assert.equal(store.get("lengths"), null);
  assert.doesNotThrow(() => store.set("lengths", { a: 1 }));
  assert.equal(createStore(undefined, "x", "d").getToday("clock"), null);
});

test("saved lengths and runs are cleaned before use", () => {
  const timers = { pairs: 4, rooms: 15 };
  assert.deepEqual(cleanLengths({ pairs: 99, rooms: "x", gone: 3 }, timers), { pairs: 60, rooms: 15 });
  assert.deepEqual(cleanLengths("{not json", timers), timers);
  assert.deepEqual(cleanRuns({ pairs: { end: t0 }, rooms: { left: -5 }, gone: { end: 1 } }, timers), { pairs: { end: t0 } });
});
