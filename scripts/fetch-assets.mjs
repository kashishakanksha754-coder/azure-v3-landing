/**
 * Processes 2026 Apple product images:
 * - Removes background (corner sampling → transparent)
 * - Trims transparent space
 * - Normalises to a 1600×1600 canvas (product centred in 1200×1200 box)
 * - Exports WebP + AVIF
 *
 * Also processes the lineup photo for the CTA (no bg removal, just resize).
 *
 * Usage: node scripts/fetch-assets.mjs
 */
import sharp from "sharp";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PRODUCTS_DIR = path.join(ROOT, "public/products");
const IMAGES_DIR = path.join(ROOT, "public/images");

const CANVAS = 1600;
const INNER = 1200; // product fits inside this box, centred on canvas
const THRESHOLD = 22; // colour distance to treat as background
const FEATHER = 2;    // edge feather px

// ── Helpers ────────────────────────────────────────────────────────────────

function avg(vals) { return vals.reduce((a, b) => a + b, 0) / vals.length; }

async function sampleCorner(data, w, h, cx, cy, radius = 4) {
  let r = [], g = [], b = [];
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const px = Math.max(0, Math.min(w - 1, cx + dx));
      const py = Math.max(0, Math.min(h - 1, cy + dy));
      const i = (py * w + px) * 4;
      r.push(data[i]); g.push(data[i + 1]); b.push(data[i + 2]);
    }
  }
  return { r: avg(r), g: avg(g), b: avg(b) };
}

async function removeBackground(inputPath) {
  const img = sharp(inputPath);
  const meta = await img.metadata();
  const { width: w, height: h } = meta;
  console.log(`  Input: ${w}×${h}`);

  const buf = await img.ensureAlpha().raw().toBuffer();
  const data = new Uint8Array(buf);

  // Sample all four corners
  const corners = await Promise.all([
    sampleCorner(data, w, h, 0, 0),
    sampleCorner(data, w, h, w - 1, 0),
    sampleCorner(data, w, h, 0, h - 1),
    sampleCorner(data, w, h, w - 1, h - 1),
  ]);
  const bgR = avg(corners.map(c => c.r));
  const bgG = avg(corners.map(c => c.g));
  const bgB = avg(corners.map(c => c.b));
  console.log(`  Background: rgb(${Math.round(bgR)}, ${Math.round(bgG)}, ${Math.round(bgB)})`);

  // Check if background is complex (high variance between corners suggests gradient/scene)
  const cornerDist = corners.map(c => {
    const dr = c.r - bgR, dg = c.g - bgG, db = c.b - bgB;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  });
  const maxCornerDist = Math.max(...cornerDist);
  if (maxCornerDist > 60) {
    console.warn(`  WARNING: Corner colours vary a lot (max dist ${maxCornerDist.toFixed(0)}). Background may not be solid.`);
  }

  // Remove background pixels
  const out = Buffer.from(data);
  let removed = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const dr = data[i] - bgR, dg = data[i + 1] - bgG, db = data[i + 2] - bgB;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (dist < THRESHOLD + FEATHER) {
        // Smooth edge: linearly fade alpha near the threshold
        const alpha = Math.min(1, Math.max(0, (dist - THRESHOLD) / FEATHER));
        out[i + 3] = Math.round(255 * alpha);
        if (alpha < 1) removed++;
      }
    }
  }
  console.log(`  Removed ${((removed / (w * h)) * 100).toFixed(1)}% background pixels`);

  return { buf: out, w, h };
}

async function normaliseProduct(inputPath, outBase) {
  console.log(`\nProcessing: ${path.basename(inputPath)}`);

  const { buf, w, h } = await removeBackground(inputPath);

  // Trim transparent — use PNG as intermediate (not raw) so sharp can parse it in composite
  const trimmedPng = await sharp(buf, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 5 })
    .png()
    .toBuffer({ resolveWithObject: true });

  const tw = trimmedPng.info.width;
  const th = trimmedPng.info.height;
  console.log(`  Trimmed: ${tw}×${th}`);

  // Scale to fit inside INNER×INNER (no upscaling beyond original)
  const scale = Math.min(INNER / tw, INNER / th, 1);
  const sw = Math.round(tw * scale);
  const sh = Math.round(th * scale);
  const offsetX = Math.round((CANVAS - sw) / 2);
  const offsetY = Math.round((CANVAS - sh) / 2);

  // Resize the trimmed PNG
  const resizedPng = await sharp(trimmedPng.data)
    .resize(sw, sh, { fit: "fill" })
    .png()
    .toBuffer();

  // Composite onto transparent canvas
  const canvas = sharp({
    create: { width: CANVAS, height: CANVAS, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  }).composite([{ input: resizedPng, left: offsetX, top: offsetY }]);

  const webpOut = `${outBase}.webp`;
  const avifOut = `${outBase}.avif`;

  await canvas.clone().webp({ quality: 90 }).toFile(webpOut);
  await canvas.clone().avif({ quality: 60 }).toFile(avifOut);

  const check = await sharp(webpOut).metadata();
  console.log(`  ✓ ${path.basename(webpOut)} — ${check.width}×${check.height}`);
}

// ── Product jobs ───────────────────────────────────────────────────────────

const JOBS = [
  {
    src: "/tmp/apple2026/watch-series12/Apple-Watch-Series-12-black-aluminum-with-burgundy-plaid-Sport-Loop.jpg",
    out: path.join(PRODUCTS_DIR, "watch-series12"),
  },
  {
    src: "/tmp/apple2026/watch-ultra4/Apple-Watch-Ultra-4-alpine-loop-band-burgundy.jpg",
    out: path.join(PRODUCTS_DIR, "watch-ultra4"),
  },
  {
    src: "/tmp/apple2026/airpods5/Apple-AirPods-5.jpg",
    out: path.join(PRODUCTS_DIR, "airpods5"),
  },
  {
    src: "/tmp/apple2026/mac-studio/Apple-Mac-Studio.jpg",
    out: path.join(PRODUCTS_DIR, "mac-studio"),
  },
  // Re-normalise existing products that appear in hero/shop
  {
    src: path.join(ROOT, "scripts/iphone-18-pro-src.jpg"),
    out: path.join(PRODUCTS_DIR, "iphone-18-pro"),
  },
  {
    src: path.join(ROOT, "public/products/ipad-air.png"),
    out: path.join(PRODUCTS_DIR, "ipad-air-norm"),
  },
  {
    src: path.join(ROOT, "public/products/studio-display.png"),
    out: path.join(PRODUCTS_DIR, "studio-display-norm"),
  },
  {
    src: path.join(ROOT, "public/products/macbook-air.png"),
    out: path.join(PRODUCTS_DIR, "macbook-air-norm"),
  },
  {
    src: path.join(ROOT, "public/products/airpods-pro3.png"),
    out: path.join(PRODUCTS_DIR, "airpods-pro3-norm"),
  },
];

// ── Lineup photo (CTA background — resize only, no bg removal) ────────────

async function processLineupPhoto() {
  console.log("\nProcessing lineup photo for CTA...");
  const src = "/tmp/apple2026/lineup/Apple-iPhone-18-Pro-lineup-Apple-Watch-Series-12-Apple-Watch-Ultra-4-Airpods-5.jpg";
  const out = path.join(IMAGES_DIR, "cta-lineup.jpg");
  await sharp(src)
    .resize(2400, null, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toFile(out);
  const m = await sharp(out).metadata();
  console.log(`  ✓ cta-lineup.jpg — ${m.width}×${m.height}`);
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const skipped = [];
  for (const job of JOBS) {
    if (!existsSync(job.src)) {
      console.warn(`SKIP (not found): ${job.src}`);
      skipped.push(job.src);
      continue;
    }
    try {
      await normaliseProduct(job.src, job.out);
    } catch (err) {
      console.error(`ERROR processing ${job.src}:`, err.message);
      skipped.push(job.src);
    }
  }
  await processLineupPhoto();
  if (skipped.length) {
    console.log("\nSkipped:", skipped.join("\n  "));
  }
  console.log("\nDone.");
}

main().catch(e => { console.error(e); process.exit(1); });
