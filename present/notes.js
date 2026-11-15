// The presenter view: speaker notes in a second window, for the presenter's eyes only. It follows the stage
// and can drive it (slides, the timer, the session clock, a wait, a blank screen). It keeps no state of its
// own: the stage sends its state raw and this window works out every figure with the same functions in core.js.
// With no stage open, it reads like a script: the arrows move through the notes on their own.
import {
  KEYS, PROTOCOL, actionFor, channelName, clamp, clockFace, clockStart, lengthLabel, paceWords, sessionClock,
  slideFromHash, slideTitle, timerView
} from "./core.js";
import { h, loadDeck, refreshLive, rich, say } from "./dom.js";

const { model } = await loadDeck({ theme: false });
const N = model.slides.length;
const hasClock = model.clock !== false && Number.isFinite(model.length) && model.length > 0;
document.title = "Speaker notes · " + model.title;

let state = null;            // the stage's last word
let heardAt = 0;
let index = slideFromHash(model, location.hash);
let shown = -1;

const $ = {};
const button = (label, onClick, extra = {}) => h("button", { type: "button", on: { click: onClick }, ...extra }, label);
const send = (action, extra = {}) => channel?.postMessage({ v: PROTOCOL, deck: model.id, type: "cmd", action, ...extra });
const connected = () => Date.now() - heardAt < 3000;

$.count = h("span"); $.clock = h("span", { class: "n-clock" });
$.status = h("p", { class: "n-status", role: "status" });
$.part = h("strong"); $.planned = h("span"); $.here = h("span"); $.pace = h("span", { class: "n-pace" });
$.heading = h("h1", { class: "n-heading" });
$.note = h("div", { class: "n-note" });
$.tDisplay = h("span", { class: "t-display" }); $.tStatus = h("span", { class: "t-status" });
$.tGo = button("Start", () => send("timer"), { class: "primary" });
$.timer = h("section", { class: "n-card n-timer", "aria-label": "Timer on the stage", hidden: true },
  h("p", { class: "label" }, "Timer on the stage"),
  h("p", { class: "t-read" }, $.tDisplay, $.tStatus),
  h("div", { class: "n-buttons" }, $.tGo,
    button("−1 min", () => send("minus"), { "aria-label": "−1 min: one minute less" }),
    button("+1 min", () => send("plus"), { "aria-label": "+1 min: one minute more" }),
    button("Reset", () => send("reset-timer"))));
$.next = h("p", { class: "n-next" });
$.call = button("Call to order", () => send("call"), { class: "primary" });
$.pause = button("Pause", () => send("pause"));
$.reset = button("Reset the clock", () => send("reset-clock"));
$.waitRead = h("span", { class: "n-wait-read" });
$.waits = [1, 2, 3, 5].map((m) => button(m + " min", () => send("wait", { minutes: m }), { dataset: { wait: String(m) }, "aria-pressed": "false" }));
$.clear = button("Clear", () => send("wait", { minutes: null }));
$.blank = button("Blank the screen", () => send("blank"), { "aria-pressed": "false" });
$.now = model.planned !== null && hasClock ? button("Jump to now", () => send("now")) : null;
$.clockBox = h("section", { class: "n-card", "aria-label": "Session clock", hidden: !hasClock },
  h("p", { class: "label" }, "Session clock"),
  h("div", { class: "n-buttons" }, $.call, $.pause, $.reset),
  h("p", { class: "label" }, "Wait time ", $.waitRead),
  h("div", { class: "n-buttons" }, $.waits, $.clear));

document.body.append(h("main", { class: "notes" },
  h("header", { class: "n-top" }, $.count, $.clock),
  $.status,
  h("p", { class: "n-part" }, $.part, $.planned, $.here, $.pace),
  h("div", {}, h("p", { class: "label" }, "On the stage"), $.heading),
  $.note,
  $.timer,
  $.next,
  h("div", { class: "n-nav" }, button("← Back", () => go(index - 1)), button("Next →", () => go(index + 1), { class: "primary" })),
  $.clockBox,
  h("div", { class: "n-buttons" }, $.blank, $.now),
  h("p", { class: "n-links" },
    h("a", { href: "present.html", target: "present-stage-" + model.id }, "The stage"),
    h("a", { href: "review.html", target: "_blank", rel: "noopener" }, "Review"),
    model.links?.site && h("a", { href: model.links.site, target: "_blank", rel: "noopener" }, "The site"))));

function go(i) {
  const target = clamp(i, 0, N - 1);
  if (connected()) send("go", { index: target });   // the stage moves, then says where it is
  else { index = target; render(); }
}

const minutesFor = (key) => state?.lengths?.[key] ?? model.timers[key];

function render() {
  if (index === shown) return;
  shown = index;
  const slide = model.slides[index];
  const next = model.slides[index + 1];
  $.count.textContent = `Slide ${slide.n} of ${N}`;
  $.part.textContent = slide.part ? slide.part.title : model.title;
  $.planned.textContent = slide.part?.minutes ? ` · planned ${lengthLabel(slide.part.minutes)}` : "";
  $.heading.textContent = slideTitle(slide, model);
  $.note.replaceChildren(...String(slide.notes || "No notes for this slide.").split(/\n{2,}/).map((p) =>
    h("p", {}, rich(p, { model, slide, minutesFor }))));
  $.next.replaceChildren(next ? h("strong", {}, "Next: ") : "", next ? slideTitle(next, model) : "That's the last slide.");
  history.replaceState(null, "", "#" + slide.id);
  say(`Slide ${slide.n}: ${slideTitle(slide, model)}`);
}

function tick() {
  const now = Date.now();
  const live = connected();
  $.status.textContent = live
    ? (state.rehearse ? "Following the stage (a rehearsal: the clock started as asked in the address)." : "Following the stage.")
    : "Not hearing from the stage. Open the stage (present.html) in this browser and these notes will follow it.";
  $.status.classList.toggle("off", !live);
  document.body.classList.toggle("alone", !live);

  const slide = model.slides[index];
  const clock = state?.clock ?? null;
  const start = clockStart(clock, model, now);
  const c = sessionClock(now, start, clock?.pausedAt ?? null, model.length || 1);
  if (hasClock) {
    $.clock.textContent = c.state === "ready" ? `${c.display} to go` : `${c.display} ${c.label}`;
    $.clock.classList.toggle("over", c.over);
    $.call.hidden = c.state !== "ready";
    $.pause.hidden = c.state === "ready";
    $.reset.hidden = c.state === "ready";
    $.pause.textContent = c.state === "paused" ? "Resume" : "Pause";
    const pace = c.state === "ready" ? null : paceWords(model, index, c.elapsed / 60);
    $.pace.textContent = pace ? pace.text : "";
    $.pace.dataset.diff = pace ? String(Math.sign(pace.diff) * (Math.abs(pace.diff) > 1 ? 1 : 0)) : "0";
    const w = state?.wait ? timerView(state.wait.run, state.wait.minutes, now) : null;
    $.waitRead.textContent = w ? `· ${w.done ? "Time" : w.display}` : "";
    $.waits.forEach((b) => b.setAttribute("aria-pressed", String(!!w && Number(b.dataset.wait) === state.wait.minutes)));
    $.clear.hidden = !w;
  }
  $.here.textContent = live && state.partSince ? ` · here ${clockFace((now - state.partSince) / 1000)}` : "";
  $.blank.setAttribute("aria-pressed", String(!!state?.blank && live));
  $.blank.textContent = state?.blank && live ? "Bring the slide back" : "Blank the screen";

  const t = slide.timer;
  $.timer.hidden = !t;
  if (t) {
    const v = timerView(state?.runs?.[t.key], minutesFor(t.key), now);
    $.tDisplay.textContent = v.display;
    $.tStatus.textContent = `${v.status} · ${minutesFor(t.key)} min`;
    $.tGo.textContent = v.action;
    $.timer.classList.toggle("done", v.done);
  }
  refreshLive($.note, minutesFor);
  [...$.timer.querySelectorAll("button"), $.call, $.pause, $.reset, ...$.waits, $.clear, $.blank, $.now].forEach((b) => { if (b) b.disabled = !live; });
}
setInterval(tick, 250);

// ---------- Hearing the stage ----------
const channel = "BroadcastChannel" in window ? new BroadcastChannel(channelName(model.id)) : null;
if (channel) {
  channel.onmessage = ({ data }) => {
    if (!data || data.v !== PROTOCOL || data.deck !== model.id || data.type !== "state") return;
    if (!Number.isInteger(data.index) || data.index < 0 || data.index >= N) return;
    state = data;
    heardAt = Date.now();
    index = data.index;
    render();
  };
  channel.postMessage({ v: PROTOCOL, deck: model.id, type: "hello" });
}

// ---------- Keys: a clicker pointed at this window drives the stage too ----------
const STAGE_ONLY = new Set(KEYS.filter((k) => k.stageOnly).map((k) => k.action));
document.addEventListener("keydown", (event) => {
  const action = actionFor(event);
  if (!action || STAGE_ONLY.has(action)) return;
  event.preventDefault();
  if (action === "next") go(index + 1);
  else if (action === "prev") go(index - 1);
  else if (action === "first") go(0);
  else if (action === "last") go(N - 1);
  else if (connected()) send(action);
});

render();
tick();
