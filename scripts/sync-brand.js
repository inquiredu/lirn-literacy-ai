// Brings the inquiredu design system's stylesheet into the kit: node scripts/sync-brand.js [path/to/inquiredu.css]
// (default: ../BrandID/inquiredu/inquiredu.css, the brand's home in VIBECODE). The copy is the brand's file
// unchanged except its Google Fonts @import, since the kit self-hosts the same families (present/fonts.css).
// Run it after the brand changes, then node scripts/check-all.js: the contrast check reads the new values.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(root, process.argv[2] || "../BrandID/inquiredu/inquiredu.css");
if (!fs.existsSync(source)) {
  console.error(`sync-brand: there's no brand stylesheet at ${source}. Pass its path: node scripts/sync-brand.js path/to/inquiredu.css`);
  process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
const body = fs.readFileSync(source, "utf8").split("\n").filter((line) => !/^@import url\("https:\/\/fonts\.googleapis\.com/.test(line)).join("\n");
const header = `/* Copied from BrandID/inquiredu/inquiredu.css (inquiredu/brand), ${today}, by scripts/sync-brand.js.
   Unchanged except the Google Fonts @import line: the Present Kit loads nothing from elsewhere, so the same
   families are self-hosted in present/fonts/ (see present/fonts.css). Change the brand there, then sync. */\n`;
fs.writeFileSync(path.join(root, "present/inquiredu.css"), header + body);
console.log(`sync-brand: present/inquiredu.css now matches ${path.relative(root, source)}, without its font import`);
