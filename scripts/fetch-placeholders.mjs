// Pexels placeholder images for Azure Innovations landing page.
// Credit: Images from Pexels (pexels.com) — free to use, no attribution required.
// Replace with real Azure photography or official Apple imagery before launch.
// See IMAGES_TO_REPLACE.md for details.

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../public/images');

const IMAGES = [
  { file: 'choose.jpg',        id: 7974,      label: 'laptop, phone and cup on a clean desk (How we help — Choose)' },
  { file: 'deploy.jpg',        id: 1181354,   label: 'engineer beside server racks (How we help — Deploy)' },
  { file: 'manage.jpg',        id: 18104,     label: 'MacBook beside iPhone on a clean desk (How we help — Manage)' },
  { file: 'support.jpg',       id: 7709172,   label: 'support specialist with headset and laptop (How we help — Support)' },
  { file: 'business.jpg',      id: 4158,      label: 'MacBook, iPad and iPhone on a desk (Solutions — Business)' },
  { file: 'device-mgmt.jpg',   id: 18105,     label: 'laptop and smartphone on a white desk (Solutions — Device Management)' },
  { file: 'infrastructure.jpg', id: 1181354,  label: 'engineer beside server racks (Solutions — IT Infrastructure)' },
  { file: 'mac.jpg',           id: 7057,      label: 'iMac with keyboard and mouse (Products — Mac)' },
  { file: 'ipad.jpg',          id: 196644,    label: 'iPad on a desk (Products — iPad)' },
  { file: 'watch.jpg',         id: 5054541,   label: 'Apple Watch with sport band (Products — Apple Watch)' },
  { file: 'accessories.jpg',   id: 3756879,   label: 'wireless earphones on a dark background (Products — Accessories)' },
];

await mkdir(OUT, { recursive: true });

let failed = 0;
for (const img of IMAGES) {
  const outPath = path.join(OUT, img.file);
  if (existsSync(outPath)) {
    console.log(`  ✓ ${img.file} already exists`);
    continue;
  }
  const url = `https://images.pexels.com/photos/${img.id}/pexels-photo-${img.id}.jpeg?auto=compress&cs=tinysrgb&w=1800`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 10000) throw new Error(`File too small (${buf.byteLength} bytes) — possibly a redirect page`);
    await writeFile(outPath, Buffer.from(buf));
    console.log(`  ↓ ${img.file} (${Math.round(buf.byteLength / 1024)} KB)`);
  } catch (e) {
    failed++;
    console.error(`  ✗ ${img.file}: ${e.message}`);
  }
}

if (failed > 0) {
  console.log(`\n${failed} image(s) failed. Components fall back to a warm gradient — replace manually.`);
} else {
  console.log('\nAll images downloaded.');
}
