// The stage: one slide at a time, sized to read on a projector or a screen shared small in a meeting.
// It owns the presentation's state (which slide, the timers, the session clock, a wait, a blank screen),
// saves it under the deck's name, and tells the presenter view about every change. Keys are in core.js.
//
// Add ?at=25 to the address to rehearse 25 minutes into the session: the clock acts as if it was called to order
// then, the pace mark and N follow, and nothing about the pretend start is saved.
import {
  KEYS, PROTOCOL, actionFor, adjustRun, channelName, clamp, cleanLengths, cleanRuns, clockStart, createStore, dayIn,
  lengthLabel, plannedPosition, sessionClock, slideForNow, slideFromHash, slideTitle, timerView, togglePause, toggleRun
} from "./core.js";
import { browserStorage, h, loadDeck, refreshLive, say } from "./dom.js";
import { groundIsDark, qrSvg, renderSlide, toneOf } from "./kinds.js";

const { model } = await loadDeck();
const N = model.slides.length;
const store = createStore(browserStorage(), model.id, dayIn(model.timeZone));
const hasClock = model.clock !== false && Number.isFinite(model.length) && model.length > 0;
const embeds = new Map();

// ---------- State, read back from this browser so a reload mid-session loses nothing ----------
let index = slideFromHash(model, location.hash);
let lengths = cleanLengths(store.get("lengths"), model.timers);
let runs = cleanRuns(store.getToday("runs"), model.timers);
let saved = store.getToday("clock");          // { start, pausedAt } after a call to order, { reset: true } after a reset
let wait = store.getToday("wait");            // { minutes, run } while a wait-time countdown is on
let blank = false;
let partSince = Date.now();
let overlay = null;                           // "clock" while the session clock is open large
let doneSaid = new Set();

const rehearse = /^(\d{1,3})$/.exec(new URLSearchParams(location.search).get("at") || "");
if (rehearse) saved = { start: Date.now() - Number(rehearse[1]) * 60_000, pausedAt: null };

const minutesFor = (key) => lengths[key] ?? model.timers[key];
const clockNow = (now = Date.now()) => {
  const start = clockStart(saved, model, now);
  return { start, pausedAt: saved?.pausedAt ?? null, view: sessionClock(now, start, saved?.pausedAt ?? null, model.length || 1) };
};
const save = () => {
  store.set("lengths", lengths);
  store.setToday("runs", Object.keys(runs).length ? runs : null);
  if (!rehearse) store.setToday("clock", saved);   // a rehearsal's pretend call to order is never kept
  store.setToday("wait", wait);
};


// ---------- The page around the slide ----------
const stage = h("main", { class: "stage", id: "stage", tabIndex: -1 });
const frame = h("div", { class: "slide-frame stage-frame" }, stage);
const live = { title: h("span", { class: "rail-title" }), length: h("span", { class: "rail-len" }), where: h("span", { class: "rail-where" }), count: h("span", { class: "rail-count" }) };
const siteHref = model.links?.site || "./";
const shortUrl = model.url ? model.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "";

const bar = h("div", { class: "bar" });
const paceMark = h("span", { class: "pace-mark", hidden: true, title: "Where the plan says we are" });
const rail = h("footer", { class: "rail" },
  bar, paceMark,
  h("p", { class: "rail-part" },
    model.mark && h("img", { class: "rail-mark", src: model.mark.src, alt: "" }),
    live.title, live.length, live.where),
  shortUrl && h("a", { class: "rail-url", href: siteHref }, shortUrl),
  h("p", { class: "rail-right" }, live.count));

const button = (label, onClick, extra = {}) => h("button", { type: "button", on: { click: onClick }, ...extra }, label);
const fullButton = button("Full screen", () => act("fullscreen"));
const controls = h("nav", { class: "controls", "aria-label": "Presenter controls" },
  button("←", () => act("prev"), { "aria-label": "Previous slide" }),
  model.planned !== null && hasClock && button("Jump to now", () => act("now"), { title: "Where the plan says we are (N)" }),
  button("Speaker notes", () => act("notes"), { title: "Opens in a second window (S)" }),
  button("Keys", () => act("help"), { title: "Every key (?)", class: "keys-button" }),
  fullButton,
  button("Open the site", () => act("site"), { title: "Leaves full screen and opens the site in a new tab" }),
  button("→", () => act("next"), { "aria-label": "Next slide" }));
const toast = h("p", { class: "toast", role: "status", hidden: true });

// The session clock: one element in three places (big on the first slide, in the rail's corner, large over the stage)
const sc = {
  backdrop: h("div", { class: "sc-backdrop", hidden: true, on: { click: () => openClock(false) } }),
  time: h("span", { class: "sc-time" }), label: h("span", { class: "sc-label" }),
  waitTime: h("span", { class: "sc-wait-time" }),
  start: button("Call to order", () => act("call"), { class: "sc-start" }),
  pause: button("Pause", () => act("pause"), { hidden: true }),
  reset: button("Reset", () => act("reset-clock"), { hidden: true }),
  clear: button("Clear", () => { act("wait", { minutes: null }); sc.close.focus(); }, { class: "sc-clear", hidden: true }),
  close: button("Back to the corner", () => openClock(false), { class: "sc-close" })
};
sc.face = h("button", { type: "button", class: "sc-face", "aria-expanded": "false", title: "The session clock: show it large (C)", on: { click: () => openClock(overlay !== "clock") } }, sc.time, sc.label);
sc.wait = h("div", { class: "sc-wait", hidden: true }, h("span", { class: "sc-wait-label" }, "Wait time"), sc.waitTime);
sc.waits = [1, 2, 3, 5].map((m) => button(m + " min", () => act("wait", { minutes: m }), { dataset: { wait: String(m) }, "aria-pressed": "false" }));
sc.box = h("section", { class: "session-clock", "aria-label": "Session clock", hidden: !hasClock },
  sc.face, sc.wait,
  h("div", { class: "sc-actions" },
    h("div", { class: "sc-row" }, sc.start, sc.pause, sc.reset),
    h("div", { class: "sc-waits", role: "group", "aria-label": "Wait time" }, h("span", {}, "Wait time"), sc.waits, sc.clear),
    sc.close));

// The way back to the site: the address in the rail, a code to scan in the corner, large on Q
const qrBig = model.url && h("dialog", { class: "qr-big", "aria-labelledby": "qr-title", on: { click: (e) => { if (e.target === qrBig || e.target.closest(".qr-x")) qrBig.close(); } } },
  h("button", { type: "button", class: "qr-x" }, "Close"),
  h("h2", { id: "qr-title" }, "Scan to open the site"),
  qrSvg(model.url, { label: "QR code for " + shortUrl }),
  h("p", { class: "qr-addr" }, shortUrl),
  h("p", { class: "qr-how" }, "Q, Esc or a click closes this"));
const qrTile = model.url && model.qr !== false && h("button", { type: "button", class: "qr-tile", "aria-label": "Show a large QR code for the site", on: { click: () => act("qr") } }, qrSvg(model.url));

const help = h("dialog", { class: "help", "aria-labelledby": "help-title", on: { click: (e) => { if (e.target === help || e.target.closest(".help-x")) help.close(); } } },
  h("button", { type: "button", class: "help-x" }, "Close"),
  h("h2", { id: "help-title" }, "Keys"),
  h("dl", {}, KEYS.filter((k) => k.action !== "escape").map((k) => [h("dt", {}, h("kbd", {}, k.label)), h("dd", {}, k.does)])),
  h("p", { class: "help-foot" }, "A clicker works too: its forward and back buttons send Page Down and Page Up, and its blank button sends B or a full stop."));

const blankEl = h("div", { class: "blank", hidden: true, "aria-hidden": "true" });
const hint = h("p", { class: "hint", "aria-hidden": "true" }, "→ next · ← back · S speaker notes · F full screen · ? every key");

document.body.append(frame, rail, controls, toast, sc.backdrop, sc.box, qrTile || "", qrBig || "", help, blankEl, hint);
setTimeout(() => hint.classList.add("gone"), 6000);


// ---------- The progress bar: one segment per slide, a wider gap where a part begins ----------
const segments = model.slides.map((s) => h("button", {
  type: "button", class: "seg" + (s.index > 0 && s.part && s.part.slides[0] === s.index ? " part-start" : ""),
  "aria-label": `Go to slide ${s.n}: ${slideTitle(s, model)}`, on: { click: () => show(s.index) }
}));
bar.append(...segments);
// Jump buttons only where each keeps a 24px target (WCAG 2.5.8); narrower, the bar shows progress and nothing more
const fitBar = () => {
  const roomy = bar.clientWidth / N >= 24;
  bar.classList.toggle("jump", roomy);
  segments.forEach((seg) => { seg.tabIndex = roomy ? 0 : -1; seg.toggleAttribute("aria-hidden", !roomy); });
};
new ResizeObserver(fitBar).observe(bar);


// ---------- Timers, on slides that ask for one ----------
function timerBlock(key) {
  const display = h("p", { class: "t-display" });
  const status = h("p", { class: "t-status" });
  const fill = h("i");
  const go = button("Start", () => act("timer"), { class: "t-go" });
  return h("div", { class: "timer", role: "group", "aria-label": "Timer", dataset: { key } },
    status, display, h("div", { class: "t-bar" }, fill),
    h("div", { class: "t-btns" },
      go,
      button("−1 min", () => act("minus"), { "aria-label": "One minute less" }),
      button("+1 min", () => act("plus"), { "aria-label": "One minute more" }),
      button("Reset", () => act("reset-timer"), { class: "t-reset" })));
}

function timerNow(now = Date.now()) {
  const t = model.slides[index].timer;
  if (!t) return null;
  return { key: t.key, minutes: minutesFor(t.key), view: timerView(runs[t.key], minutesFor(t.key), now) };
}


// ---------- Showing a slide ----------
function show(i) {
  const next = clamp(i, 0, N - 1);
  const first = !stage.firstChild;
  if (!first && model.slides[next].partId !== model.slides[index].partId) partSince = Date.now();
  index = next;
  const slide = model.slides[index];
  const timer = slide.timer ? timerBlock(slide.timer.key) : null;
  const node = renderSlide(slide, { model, mode: "stage", timer, embeds, minutesFor });
  node.querySelectorAll(".r").forEach((el, k) => el.style.setProperty("--i", String(k)));
  stage.replaceChildren(node);
  stage.scrollTop = 0;
  void node.offsetWidth;          // settle the starting styles first, so the ease-in runs (rAF would wait for a visible tab)
  node.classList.add("on");
  history.replaceState(null, "", location.search + "#" + slide.id);

  const part = slide.part;
  live.title.textContent = part ? part.title : model.title;
  live.length.textContent = part?.minutes ? lengthLabel(part.minutes).replace(" minutes", " min").replace(" minute", " min") : "";
  live.where.textContent = part?.where || "";
  live.count.textContent = `${index + 1} / ${N}`;
  if (qrTile) qrTile.hidden = slide.kind === "link";
  segments.forEach((seg, k) => {
    seg.classList.toggle("now", k === index);
    seg.classList.toggle("past", k < index);
    seg.toggleAttribute("aria-current", k === index);
  });
  placeClock();
  say(`Slide ${slide.n} of ${N}: ${slideTitle(slide, model)}`);
  tick();
  send();
}


// ---------- The clock in its three places ----------
function placeClock() {
  sc.box.dataset.mode = overlay === "clock" ? "open" : index === 0 ? "hero" : "corner";
  // Waiting on the first slide, the clock sits on that slide's ground (Night, on the title), so it wears its theme
  if (sc.box.dataset.mode === "hero") sc.box.dataset.theme = groundIsDark(toneOf(model.slides[0]), model.theme) ? "dark" : "light";
  else delete sc.box.dataset.theme;
  sc.backdrop.hidden = overlay !== "clock";
  sc.face.setAttribute("aria-expanded", String(overlay === "clock"));
}

function openClock(open) {
  if (!hasClock) return;
  const hadFocus = sc.box.contains(document.activeElement);
  overlay = open ? "clock" : null;
  placeClock();
  if (open) sc.close.focus();
  else if (hadFocus) sc.face.focus();   // back where the keyboard left off
}


// ---------- Twice a second: the clock, the timer, a wait, and the pace ----------
function tick() {
  const now = Date.now();
  const clock = clockNow(now);
  const c = clock.view;
  if (hasClock) {
    sc.time.textContent = c.display;
    sc.label.textContent = c.label;
    sc.box.dataset.state = c.state;
    sc.start.hidden = c.state !== "ready";
    sc.pause.hidden = c.state === "ready";
    sc.reset.hidden = c.state === "ready";
    sc.pause.textContent = c.state === "paused" ? "Resume" : "Pause";
    const w = wait && timerView(wait.run, wait.minutes, now);
    sc.wait.hidden = !w;
    sc.box.classList.toggle("waiting", !!w);
    sc.clear.hidden = !w;
    if (w) { sc.waitTime.textContent = w.done ? "Time" : w.display; sc.wait.classList.toggle("done", w.done); }
    sc.waits.forEach((b) => b.setAttribute("aria-pressed", String(!!w && Number(b.dataset.wait) === wait.minutes)));
    rail.style.setProperty("--elapsed", c.pct.toFixed(2) + "%");

    const pos = c.state !== "ready" ? plannedPosition(model, c.elapsed / 60) : null;
    paceMark.hidden = pos === null || model.pace === false;
    if (pos !== null) paceMark.style.left = `calc(${(100 * pos) / N}% - 1px)`;
  }

  const t = timerNow(now);
  const box = stage.querySelector(".timer");
  if (t && box) {
    box.classList.toggle("done", t.view.done);
    box.classList.toggle("running", t.view.running);
    box.querySelector(".t-display").textContent = t.view.display;
    box.querySelector(".t-status").textContent = `${t.view.status} · ${t.minutes} min`;
    box.querySelector(".t-go").textContent = t.view.action;
    box.querySelector(".t-bar i").style.width = t.view.pct.toFixed(2) + "%";
    if (t.view.done && !doneSaid.has(t.key)) { doneSaid.add(t.key); say("Time."); }
    if (!t.view.done) doneSaid.delete(t.key);
  }
  refreshLive(stage, minutesFor);
}
setInterval(tick, 250);


// ---------- Everything the presenter can do, from a key, a button, or the notes window ----------
function act(action, opts = {}) {
  const now = Date.now();
  const slide = model.slides[index];
  const t = slide.timer;
  switch (action) {
    case "next": return show(index + 1);
    case "prev": return show(index - 1);
    case "first": return show(0);
    case "last": return show(N - 1);
    case "go": return Number.isInteger(opts.index) ? show(opts.index) : undefined;
    case "timer":
      if (t) runs[t.key] = toggleRun(runs[t.key], minutesFor(t.key), now);
      else if (hasClock && clockNow(now).view.state === "ready") return act("call");
      else return;
      break;
    case "plus": case "minus": {
      if (!t) return;
      const r = adjustRun(runs[t.key], minutesFor(t.key), action === "plus" ? 1 : -1, now);
      lengths[t.key] = r.minutes;
      if (r.run) runs[t.key] = r.run; else delete runs[t.key];
      say(`Timer: ${lengthLabel(r.minutes)}.`);
      break;
    }
    case "reset-timer": if (t) delete runs[t.key]; break;
    case "call":
      if (!hasClock) return;
      saved = { start: now, pausedAt: null };
      say("Called to order. The session clock is running.");
      break;
    case "pause": {
      const c = clockNow(now);
      if (!hasClock || c.start === null) return;
      saved = togglePause({ start: c.start, pausedAt: c.pausedAt }, now);
      say(saved.pausedAt ? "The session clock is paused." : "The session clock is running again.");
      break;
    }
    case "reset-clock":
      saved = { reset: true }; wait = null;
      say("Reset. The session clock waits for the call to order.");
      break;
    case "wait":
      wait = opts.minutes ? { minutes: opts.minutes, run: toggleRun(undefined, opts.minutes, now) } : null;
      break;
    case "now": {
      const c = clockNow(now).view;
      const i = c.state === "ready" ? null : slideForNow(model, c.elapsed / 60);
      if (i === null) { notify("Jump to now needs the session clock running and parts with minutes."); return; }
      return show(i);
    }
    case "blank":
      blank = !blank;
      blankEl.hidden = !blank;
      say(blank ? "The screen is blank." : "The slide is back.");
      break;
    case "notes": return openNotes();
    case "clock": return openClock(overlay !== "clock");
    case "qr": if (qrBig) qrBig.open ? qrBig.close() : qrBig.showModal(); return;
    case "help": help.open ? help.close() : help.showModal(); return;
    case "escape": if (overlay) openClock(false); return;
    case "fullscreen":
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else document.documentElement.requestFullscreen?.().catch(() => notify("This browser won't go full screen here."));
      return;
    case "site":
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      window.open(siteHref, "_blank", "noopener");
      return;
    default: return;
  }
  save();
  tick();
  send();
}

function notify(text) {
  toast.textContent = text;
  toast.hidden = false;
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => { toast.hidden = true; }, 6000);
  say(text);
}

function openNotes() {
  const win = window.open("notes.html", "present-notes-" + model.id, "popup,width=600,height=860");
  if (!win) notify("The browser stopped the notes window. Allow pop-ups for this site, or open notes.html in a window of its own.");
}


// ---------- Keys ----------
document.addEventListener("keydown", (event) => {
  const action = actionFor(event);
  if (!action) return;
  if (qrBig?.open || help.open) {               // a dialog is up: Q and ? close their own, nothing moves behind it
    if ((action === "qr" && qrBig?.open) || (action === "help" && help.open)) { event.preventDefault(); act(action); }
    else if (["next", "prev", "first", "last"].includes(action)) event.preventDefault();
    return;
  }
  if (blank && action !== "notes") { event.preventDefault(); act("blank"); return; }   // any key brings the slide back
  if (action === "escape" && !overlay) return;  // let the browser leave full screen
  event.preventDefault();
  act(action);
});

// A swipe on a phone or tablet moves along; a tall slide still scrolls up and down
let touch = null;
stage.addEventListener("touchstart", (e) => { const p = e.changedTouches[0]; touch = { x: p.clientX, y: p.clientY }; }, { passive: true });
stage.addEventListener("touchend", (e) => {
  const p = e.changedTouches[0];
  if (!touch) return;
  const dx = p.clientX - touch.x, dy = p.clientY - touch.y;
  touch = null;
  if (Math.abs(dx) > 60 && Math.abs(dy) < 45) act(dx < 0 ? "next" : "prev");
});

document.addEventListener("fullscreenchange", () => { fullButton.textContent = document.fullscreenElement ? "Leave full screen" : "Full screen"; });
window.addEventListener("hashchange", () => { const i = slideFromHash(model, location.hash); if (i !== index) show(i); });


// ---------- The presenter view, in a second window ----------
// The stage sends its whole state, raw; the notes window works out the figures itself with the same
// functions, so the two can't disagree, and a stage tab slowed down in the background doesn't slow the notes.
const channel = "BroadcastChannel" in window ? new BroadcastChannel(channelName(model.id)) : null;
function send() {
  channel?.postMessage({ v: PROTOCOL, deck: model.id, type: "state", index, lengths, runs, clock: saved, wait, blank, partSince, rehearse: !!rehearse });
}
if (channel) {
  channel.onmessage = ({ data }) => {
    if (!data || data.v !== PROTOCOL || data.deck !== model.id) return;
    if (data.type === "hello") send();
    if (data.type === "cmd" && typeof data.action === "string") act(data.action, data);
  };
}
setInterval(send, 1000);
window.addEventListener("storage", (e) => {   // another stage tab for the same deck changed the saved state
  if (!e.key?.startsWith("present:" + model.id + ":")) return;
  lengths = cleanLengths(store.get("lengths"), model.timers);
  runs = cleanRuns(store.getToday("runs"), model.timers);
  saved = store.getToday("clock");
  wait = store.getToday("wait");
  tick();
});

show(index);
stage.focus({ preventScroll: true });
