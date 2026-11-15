// Every check in one go: node scripts/check-all.js (or npm test)
// The deck as the pages read it, the colors, and the tests for the rules in present/core.js and the QR code.
// The git hooks in .githooks run the same; this is for a clone without them, and for GitHub Actions.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tests = fs.readdirSync(path.join(root, "tests")).filter((f) => f.endsWith(".test.js")).map((f) => path.join(root, "tests", f));
const checks = [
  ["the deck", [path.join(root, "scripts/check.js")]],
  ["the colors", [path.join(root, "scripts/contrast.js")]],
  ["the tests", ["--test", "--test-reporter=dot", ...tests]]
];
let failed = 0;
for (const [name, args] of checks) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit", cwd: root });
  if (result.status !== 0) { failed++; console.error(`check-all: ${name} failed`); }
}
console.log(failed ? `check-all: ${failed} of ${checks.length} checks failed` : `check-all: all ${checks.length} checks pass`);
process.exit(failed ? 1 : 0);
