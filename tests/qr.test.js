// The QR code on the stage: node --test tests/
// The fixtures were made with the qrcode package (the one What We Talk About used to generate its code) and
// matched this encoder module for module across versions 1 to 13 and every mask before they were written down.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { qrCode, qrPath } from "../present/qr.js";

const fingerprint = (modules) => createHash("sha256").update(modules.map((r) => r.map((m) => (m ? 1 : 0)).join("")).join("\n")).digest("hex").slice(0, 16);

test("the What We Talk About address draws the same code that site checked in (src/talk/qr.ts)", () => {
  const { size, path } = qrPath("https://inquiredu.org/what-we-talk-about/");
  assert.equal(size, 29);
  assert.ok(path.startsWith("M0 0h7v1h-7zM9 0h1v1h-1zM11 0h1v1h-1zM16 0h1v1h-1zM19 0h2v1h-2zM22 0h7v1h-7z"));
  assert.equal(path.length, 2783);
  assert.equal(createHash("sha256").update(path).digest("hex").slice(0, 16), "6bbbe4948c92e0a9");
});

test("known addresses give known codes, including the version information from version 7 up", () => {
  const cases = [
    { text: "https://inquiredu.org/a-mn-hackathon/", version: 3, mask: 5, sha: "c0bf7c2eed2c005e" },
    { text: "https://example.org/present-kit/review.html#the-way-back-to-the-site-for-anyone-who-arrived-late", version: 6, mask: 2, sha: "53c5d0f89c63326a" },
    { text: "https://example.org/" + "a-longer-address/".repeat(9), version: 9, mask: 4, sha: "a14c5eb76c3d80b0" }
  ];
  for (const c of cases) {
    const q = qrCode(c.text);
    assert.deepEqual([q.version, q.mask, fingerprint(q.modules)], [c.version, c.mask, c.sha], c.text);
  }
});

test("a code is an odd number of modules, at least 21, with the three finder patterns in their corners", () => {
  const { size, modules } = qrCode("https://example.org/present-kit/");
  assert.ok(size >= 21 && size % 2 === 1);
  for (const [x, y] of [[0, 0], [size - 7, 0], [0, size - 7]]) {
    assert.equal(modules[y][x], true, "finder corner is dark");
    assert.equal(modules[y + 1][x + 1], false, "finder ring is light");
    assert.equal(modules[y + 3][x + 3], true, "finder centre is dark");
  }
});

test("the path is one rectangle per run of dark modules, on the module grid", () => {
  const { path } = qrPath("HELLO");
  assert.match(path, /^(M\d+ \d+h\d+v1h-\d+z)+$/);
});

test("an address too long for any QR code says so", () => {
  assert.throws(() => qrCode("x".repeat(3000)), /too long/);
});
