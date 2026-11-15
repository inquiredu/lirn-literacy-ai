// A QR code for the deck's address, made in the page from deck.url, so the code on the stage can never fall
// out of step with the address beside it, and no library or service is loaded to draw it.
// Byte mode, error correction level M (about 15% of the code can be covered and it still scans), the smallest
// version that fits. The mask is chosen by the standard's four penalty rules. Checked against the qrcode
// package, module for module, by tests/qr.test.js.

// Error-correction codewords per block, and blocks, for level M at versions 1 to 40 (ISO/IEC 18004, table 9)
const EC_PER_BLOCK = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28];
const BLOCKS = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49];
const FORMAT_M = 0;   // the two bits that name level M in the format information

const sizeOf = (version) => version * 4 + 17;

function rawModules(version) {
  let n = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const align = Math.floor(version / 7) + 2;
    n -= (25 * align - 10) * align - 55;
    if (version >= 7) n -= 36;
  }
  return n;
}
const dataCodewords = (version) => Math.floor(rawModules(version) / 8) - EC_PER_BLOCK[version] * BLOCKS[version];

function alignmentPositions(version) {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
  const out = [6];
  for (let pos = sizeOf(version) - 7; out.length < count; pos -= step) out.splice(1, 0, pos);
  return out;
}


// ---------- Reed-Solomon over GF(256) ----------

function gfMultiply(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function rsDivisor(degree) {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 0x02);
  }
  return result;
}

function rsRemainder(data, divisor) {
  const result = new Array(divisor.length).fill(0);
  for (const b of data) {
    const factor = b ^ result.shift();
    result.push(0);
    divisor.forEach((coef, i) => { result[i] ^= gfMultiply(coef, factor); });
  }
  return result;
}


// ---------- The codewords ----------

function encodeBytes(bytes) {
  let version = 1;
  for (; version <= 40; version++) {
    const countBits = version < 10 ? 8 : 16;
    if (4 + countBits + bytes.length * 8 <= dataCodewords(version) * 8) break;
  }
  if (version > 40) throw new Error("The address is too long for a QR code.");

  const bits = [];
  const push = (value, length) => { for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1); };
  push(0b0100, 4);                                   // byte mode
  push(bytes.length, version < 10 ? 8 : 16);
  bytes.forEach((b) => push(b, 8));
  const capacity = dataCodewords(version) * 8;
  push(0, Math.min(4, capacity - bits.length));       // terminator
  push(0, (8 - (bits.length % 8)) % 8);               // to a whole byte
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) push(pad, 8);

  const data = [];
  for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0));
  return { version, codewords: interleave(version, data) };
}

function interleave(version, data) {
  const blockCount = BLOCKS[version];
  const ecLength = EC_PER_BLOCK[version];
  const raw = Math.floor(rawModules(version) / 8);
  const shortBlocks = blockCount - (raw % blockCount);
  const shortLength = Math.floor(raw / blockCount);
  const divisor = rsDivisor(ecLength);
  const blocks = [];
  for (let i = 0, k = 0; i < blockCount; i++) {
    const dat = data.slice(k, k + shortLength - ecLength + (i < shortBlocks ? 0 : 1));
    k += dat.length;
    const ec = rsRemainder(dat, divisor);
    if (i < shortBlocks) dat.push(0);                 // a placeholder, skipped below, so the columns line up
    blocks.push(dat.concat(ec));
  }
  const out = [];
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((block, j) => { if (i !== shortLength - ecLength || j >= shortBlocks) out.push(block[i]); });
  }
  return out;
}


// ---------- The grid ----------

function makeGrid(version) {
  const size = sizeOf(version);
  const modules = Array.from({ length: size }, () => new Array(size).fill(false));
  const fixed = Array.from({ length: size }, () => new Array(size).fill(false));
  const set = (x, y, dark) => { modules[y][x] = dark; fixed[y][x] = true; };

  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }   // timing patterns
  const finder = (cx, cy) => {
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= size || y >= size) continue;
      const d = Math.max(Math.abs(dx), Math.abs(dy));
      set(x, y, d !== 2 && d !== 4);
    }
  };
  finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
  const align = alignmentPositions(version);
  align.forEach((ay, i) => align.forEach((ax, j) => {
    if ((i === 0 && j === 0) || (i === 0 && j === align.length - 1) || (i === align.length - 1 && j === 0)) return;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(ax + dx, ay + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }));
  drawFormat(modules, fixed, 0);                      // reserves the format areas; redrawn for each mask
  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const dark = ((bits >>> i) & 1) === 1;
      const a = size - 11 + (i % 3), b = Math.floor(i / 3);
      set(a, b, dark); set(b, a, dark);
    }
  }
  return { size, modules, fixed };
}

function drawFormat(modules, fixed, mask) {
  const size = modules.length;
  const data = (FORMAT_M << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  const bits = ((data << 10) | rem) ^ 0x5412;
  const bit = (i) => ((bits >>> i) & 1) === 1;
  const set = (x, y, dark) => { modules[y][x] = dark; fixed[y][x] = true; };
  for (let i = 0; i <= 5; i++) set(8, i, bit(i));
  set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
  for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
  for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
  for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
  set(8, size - 8, true);                             // the dark module
}

function placeCodewords({ size, modules, fixed }, codewords) {
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;                       // the vertical timing pattern
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!fixed[y][x] && i < codewords.length * 8) {
          modules[y][x] = ((codewords[i >>> 3] >>> (7 - (i & 7))) & 1) === 1;
          i++;
        }
      }
    }
  }
}

const MASKS = [
  (x, y) => (x + y) % 2 === 0,
  (x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0
];

function applyMask({ size, modules, fixed }, mask) {
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    if (!fixed[y][x] && MASKS[mask](x, y)) modules[y][x] = !modules[y][x];
  }
}

// The four penalty rules: long runs, 2×2 blocks, finder-like patterns, and an uneven share of dark
function penalty(modules) {
  const size = modules.length;
  const get = (r, c) => (modules[r][c] ? 1 : 0);
  let points = 0;
  for (let r = 0; r < size; r++) {
    let runRow = 0, runCol = 0, lastRow = -1, lastCol = -1;
    let bitsRow = 0, bitsCol = 0;
    for (let c = 0; c < size; c++) {
      const a = get(r, c), b = get(c, r);
      if (a === lastRow) runRow++; else { if (runRow >= 5) points += 3 + (runRow - 5); lastRow = a; runRow = 1; }
      if (b === lastCol) runCol++; else { if (runCol >= 5) points += 3 + (runCol - 5); lastCol = b; runCol = 1; }
      bitsRow = ((bitsRow << 1) & 0x7ff) | a;
      bitsCol = ((bitsCol << 1) & 0x7ff) | b;
      if (c >= 10 && (bitsRow === 0x5d0 || bitsRow === 0x05d)) points += 40;
      if (c >= 10 && (bitsCol === 0x5d0 || bitsCol === 0x05d)) points += 40;
    }
    if (runRow >= 5) points += 3 + (runRow - 5);
    if (runCol >= 5) points += 3 + (runCol - 5);
  }
  for (let r = 0; r < size - 1; r++) for (let c = 0; c < size - 1; c++) {
    const sum = get(r, c) + get(r, c + 1) + get(r + 1, c) + get(r + 1, c + 1);
    if (sum === 0 || sum === 4) points += 3;
  }
  let dark = 0;
  modules.forEach((row) => row.forEach((m) => { if (m) dark++; }));
  points += Math.abs(Math.ceil((dark * 100) / (size * size) / 5) - 10) * 10;
  return points;
}


// ---------- In and out ----------

/**
 * The QR code for some text: { version, size, mask, modules } where modules[y][x] is true for dark.
 * Pass mask (0-7) to force one; otherwise the lowest penalty wins.
 */
export function qrCode(text, { mask } = {}) {
  const bytes = Array.from(new TextEncoder().encode(String(text)));
  const { version, codewords } = encodeBytes(bytes);
  const grid = makeGrid(version);
  placeCodewords(grid, codewords);
  let chosen = mask;
  if (chosen === undefined) {
    let best = Infinity;
    for (let m = 0; m < 8; m++) {
      drawFormat(grid.modules, grid.fixed, m);
      applyMask(grid, m);
      const p = penalty(grid.modules);
      applyMask(grid, m);                             // a mask undoes itself
      if (p < best) { best = p; chosen = m; }
    }
  }
  drawFormat(grid.modules, grid.fixed, chosen);
  applyMask(grid, chosen);
  return { version, size: grid.size, mask: chosen, modules: grid.modules };
}

/** The code as one SVG path, one unit per module: a horizontal run of dark modules is one rectangle. */
export function qrPath(text) {
  const { size, modules } = qrCode(text);
  let d = "";
  modules.forEach((row, y) => {
    for (let x = 0; x < size; x++) {
      if (!row[x]) continue;
      let w = 1;
      while (x + w < size && row[x + w]) w++;
      d += `M${x} ${y}h${w}v1h-${w}z`;
      x += w - 1;
    }
  });
  return { size, path: d };
}
