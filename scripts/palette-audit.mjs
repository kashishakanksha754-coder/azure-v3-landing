#!/usr/bin/env node
/**
 * palette-audit.mjs
 * Scans src/ for hardcoded colour literals that should be CSS tokens.
 * Ignores pure neutrals (rgba(0,0,0,...), rgba(255,255,255,...), #fff, #000),
 * gradient stops we know are intentional, and test files.
 *
 * Usage:  node scripts/palette-audit.mjs
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = join(process.cwd(), "src");

// Patterns to flag
const FLAG = [
  // Any 3- or 6-digit hex that is not a pure neutral
  /#(?!fff\b|000\b|ffffff\b|000000\b)[0-9a-fA-F]{3,6}\b/gi,
  // rgba / rgb with specific hue values (not pure black/white)
  /rgba?\(\s*(?!0\s*,\s*0\s*,\s*0|255\s*,\s*255\s*,\s*255)[0-9].*?\)/gi,
];

// Strings to skip (known-intentional, outside palette scope)
const SKIP_PATTERNS = [
  /rgba\(37,211,102/,     // WhatsApp green shadow — follows var(--whatsapp) bg
  /rgba\(0,0,0/,
  /rgba\(255,255,255/,
  /linear-gradient.*#fff/, // collage veil gradient to white
  /drop-shadow/,
  /#c00\b/,               // error red in EnquiryModal — not a brand colour
];

const SKIP_FILES = [
  /\.test\./,
  /\.spec\./,
  /node_modules/,
  /\.next/,
  /tokens\.css$/,          // token definitions — hex literals ARE the source of truth
];

async function walk(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, files);
    else if (/\.(tsx?|css|mjs|js)$/.test(entry.name)) files.push(full);
  }
  return files;
}

let hits = 0;

for (const file of await walk(ROOT)) {
  if (SKIP_FILES.some((re) => re.test(file))) continue;
  const rel = relative(process.cwd(), file);
  const src = await readFile(file, "utf8");
  const lines = src.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (SKIP_PATTERNS.some((re) => re.test(line))) continue;

    for (const pat of FLAG) {
      pat.lastIndex = 0;
      if (pat.test(line)) {
        console.log(`${rel}:${i + 1}  ${line.trim()}`);
        hits++;
        break;
      }
    }
  }
}

if (hits === 0) {
  console.log("palette-audit: PASS — no hardcoded colour literals found.");
  process.exit(0);
} else {
  console.log(`\npalette-audit: FAIL — ${hits} hardcoded colour literal(s) found above.`);
  process.exit(1);
}
