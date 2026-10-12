// Extracts the MacBook Pro from a marketing poster using BFS flood-fill.
// Run with: node scripts/process-macbook-pro.mjs <source>
import sharp from "sharp";
import { statSync } from "fs";

const SRC = process.argv[2] ||
  "/private/tmp/claude-501/-Users-uius-Downloads-Loop-Methods/e8e6142d-ee16-4d00-8cf0-c94afc321339/images/13.png";
const OUT = "public/products";
const CANVAS = 1600;

console.log(`Source: ${SRC}`);

const { data: raw, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width: W, height: H } = info;
console.log(`  Input: ${W}×${H}`);

const px = new Uint8ClampedArray(raw);
const THRESHOLD = 72; // R,G,B all below this = dark background

function isBackground(i) {
  return px[i] <= THRESHOLD && px[i + 1] <= THRESHOLD && px[i + 2] <= THRESHOLD;
}

// BFS flood-fill from all four edges
const alpha = new Uint8ClampedArray(W * H).fill(1); // 1 = keep, 0 = remove
const queue = [];
function seed(x, y) {
  const i = (y * W + x) * 4;
  if (isBackground(i) && alpha[y * W + x]) { alpha[y * W + x] = 0; queue.push(y * W + x); }
}
for (let x = 0; x < W; x++) { seed(x, 0); seed(x, H - 1); }
for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y); }

let head = 0;
while (head < queue.length) {
  const idx = queue[head++];
  const x = idx % W, y = Math.floor(idx / W);
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
    const ni = ny * W + nx;
    if (alpha[ni] && isBackground(ni * 4)) { alpha[ni] = 0; queue.push(ni); }
  }
}

console.log(`  BFS removed ${queue.length} background pixels`);

// Build output buffer with alpha
const out = Buffer.alloc(W * H * 4);
let kept = 0;
for (let i = 0; i < W * H; i++) {
  const s = i * 4;
  out[s]     = px[s];
  out[s + 1] = px[s + 1];
  out[s + 2] = px[s + 2];
  out[s + 3] = alpha[i] ? px[s + 3] : 0;
  if (alpha[i]) kept++;
}
console.log(`  Opaque pixels kept: ${kept}`);

// Trim to content bounds
let minX = W, maxX = 0, minY = H, maxY = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (out[(y * W + x) * 4 + 3] > 0) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
  }
}
const cW = maxX - minX + 1, cH = maxY - minY + 1;
console.log(`  Trimmed content: ${cW}×${cH} at (${minX},${minY})`);

// Extract trimmed region
const trimBuf = Buffer.alloc(cW * cH * 4);
for (let y = 0; y < cH; y++) {
  for (let x = 0; x < cW; x++) {
    const si = ((minY + y) * W + (minX + x)) * 4;
    const di = (y * cW + x) * 4;
    trimBuf[di]     = out[si];
    trimBuf[di + 1] = out[si + 1];
    trimBuf[di + 2] = out[si + 2];
    trimBuf[di + 3] = out[si + 3];
  }
}

// Normalise onto 1600×1600 canvas — laptop width ~86% of canvas width
const TARGET_W = Math.round(CANVAS * 0.86);
const scale = Math.min(TARGET_W / cW, TARGET_W / cH, 1); // never upscale
const scaledW = Math.round(cW * scale);
const scaledH = Math.round(cH * scale);

const scaledBuf = await sharp(trimBuf, { raw: { width: cW, height: cH, channels: 4 } })
  .resize(scaledW, scaledH, { kernel: "lanczos3", fit: "fill" })
  .raw()
  .toBuffer();

// Place on CANVAS×CANVAS transparent canvas
const canvasBuf = Buffer.alloc(CANVAS * CANVAS * 4, 0);
const offX = Math.round((CANVAS - scaledW) / 2);
const offY = Math.round((CANVAS - scaledH) / 2);
for (let y = 0; y < scaledH; y++) {
  for (let x = 0; x < scaledW; x++) {
    const si = (y * scaledW + x) * 4;
    const di = ((offY + y) * CANVAS + (offX + x)) * 4;
    canvasBuf[di]     = scaledBuf[si];
    canvasBuf[di + 1] = scaledBuf[si + 1];
    canvasBuf[di + 2] = scaledBuf[si + 2];
    canvasBuf[di + 3] = scaledBuf[si + 3];
  }
}

const raw2 = { raw: { width: CANVAS, height: CANVAS, channels: 4 } };

await sharp(canvasBuf, raw2).webp({ quality: 92 }).toFile(`${OUT}/macbook-pro-m5.webp`);
await sharp(canvasBuf, raw2).avif({ quality: 92 }).toFile(`${OUT}/macbook-pro-m5.avif`);

const wm = await sharp(`${OUT}/macbook-pro-m5.webp`).metadata();
console.log(`\nmacbook-pro-m5.webp: ${wm.width}×${wm.height}  (${(statSync(OUT+"/macbook-pro-m5.webp").size/1024).toFixed(0)}KB)`);

// Corner check
const { data: check } = await sharp(`${OUT}/macbook-pro-m5.webp`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const corners = [
  check[3],
  check[(CANVAS - 1) * 4 + 3],
  check[(CANVAS * (CANVAS - 1)) * 4 + 3],
  check[(CANVAS * CANVAS - 1) * 4 + 3],
];
console.log(`  Corner alphas: ${corners.join(", ")} (all must be 0)`);

// Quick dark-BG composite preview
await sharp(canvasBuf, raw2)
  .flatten({ background: { r: 10, g: 10, b: 10, alpha: 1 } })
  .png()
  .toFile(`${OUT}/macbook-pro-m5-preview.png`);
console.log(`  Preview on #0A0A0A written to ${OUT}/macbook-pro-m5-preview.png`);

console.log("\nDone.");
