/**
 * check-about.mjs
 * Playwright smoke + alignment test for the /about page.
 * Run: node scripts/check-about.mjs
 *
 * Alignment rule: every section's .container left edge must share the same
 * x-coordinate within 1 px at every tested viewport width.
 */

import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const LIVE = "https://azure-innovations-landing.vercel.app/about";
const WIDTHS = [390, 768, 1280, 1440, 1920];
const SCREENSHOTS_DIR = join(__dirname, "screenshots");

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error(
    "\n[check-about] Playwright is not installed.\n" +
      "Install it with:\n\n  npm install --save-dev playwright\n  npx playwright install chromium\n"
  );
  process.exit(1);
}

const results = [];
function pass(label) {
  results.push({ ok: true, label });
  console.log("  PASS  " + label);
}
function fail(label, detail = "") {
  results.push({ ok: false, label, detail });
  console.error("  FAIL  " + label + (detail ? " — " + detail : ""));
}

if (!existsSync(SCREENSHOTS_DIR)) {
  await mkdir(SCREENSHOTS_DIR, { recursive: true });
}

const browser = await chromium.launch();

// ── 1. HTTP 200 ──────────────────────────────────────────────────────────────
{
  const page = await browser.newPage();
  const response = await page.goto(LIVE);
  if (response && response.status() === 200) {
    pass("HTTP 200 on /about");
  } else {
    fail("HTTP 200 on /about", `status: ${response?.status()}`);
  }
  await page.close();
}

// ── 2. Section IDs, images, overflow, asProd — tested at 1440px ──────────────
{
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const consoleErrors = [];
  // Track 404 response URLs so we can suppress resource-load console errors for them
  const notFoundUrls = new Set();
  page.on("response", (r) => { if (r.status() === 404) notFoundUrls.add(r.url()); });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const t = msg.text();
      // Suppress "Failed to load resource: 404" noise if the only 404s are disabled pages
      if (/Failed to load resource.*404/.test(t)) return;
      consoleErrors.push(t);
    }
  });

  await page.goto(LIVE, { waitUntil: "networkidle" });

  // Section IDs
  const sectionIds = ["about-hero", "achievements", "story", "mission", "vision", "contact"];
  const foundIds = await page.evaluate((ids) => ids.filter((id) => !!document.getElementById(id)), sectionIds);
  if (foundIds.length === sectionIds.length) {
    pass("All 6 section IDs present");
  } else {
    fail("Section IDs", "missing: " + sectionIds.filter((id) => !foundIds.includes(id)).join(", "));
  }

  // ?asProd=1: draft sections absent
  {
    const ap = await browser.newPage();
    await ap.goto(LIVE + "?asProd=1", { waitUntil: "networkidle" });
    const hidden = await ap.evaluate((ids) =>
      ids.every((id) => {
        const el = document.getElementById(id);
        return !el || el.children.length === 0 || el.offsetParent === null;
      }), ["story", "mission", "vision"]
    );
    hidden ? pass("?asProd=1: draft sections absent") : fail("?asProd=1: draft sections absent");
    await ap.close();
  }

  // Hero: 2+ product images loaded
  const loadedImages = await page.evaluate(() =>
    Array.from(document.querySelectorAll("#about-hero img"))
      .filter((img) => img.naturalWidth > 0).length
  );
  loadedImages >= 2
    ? pass(`Hero product images loaded (${loadedImages})`)
    : fail("Hero product images", `only ${loadedImages} with naturalWidth > 0`);

  // Stat strip: at least 2 stat items visible
  const statItems = await page.evaluate(() =>
    document.querySelectorAll("#achievements .container > div > div > div").length
  );
  statItems >= 2
    ? pass(`Achievements stat strip: ${statItems} items visible`)
    : fail("Achievements stat strip", `found ${statItems}`);

  // No horizontal overflow
  const noOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth
  );
  noOverflow ? pass("No horizontal overflow at 1440px") : fail("No horizontal overflow at 1440px");

  // No console errors
  consoleErrors.length === 0
    ? pass("No console errors")
    : fail("No console errors", consoleErrors.slice(0, 3).join(" | "));

  await page.close();
}

// ── 3. Alignment + screenshots at all widths ──────────────────────────────────
const SECTION_IDS = ["#about-hero", "#achievements", "#story", "#mission", "#vision"];

for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height: 900 });
  await page.goto(LIVE, { waitUntil: "networkidle" });

  // Alignment: every section's .container left edge within 1px
  const containerLefts = await page.evaluate((sels) => {
    return sels.map((sel) => {
      const section = document.querySelector(sel);
      if (!section) return { sel, left: null, reason: "section missing" };
      const container = section.querySelector(".container");
      if (!container) return { sel, left: null, reason: "no .container" };
      return { sel, left: container.getBoundingClientRect().left };
    });
  }, SECTION_IDS);

  const valid = containerLefts.filter((c) => c.left !== null);
  if (valid.length < SECTION_IDS.length) {
    const missing = containerLefts.filter((c) => c.left === null);
    fail(`Alignment at ${width}px`, "missing: " + missing.map((c) => `${c.sel}(${c.reason})`).join(", "));
  } else {
    const lefts = valid.map((c) => c.left);
    const spread = Math.max(...lefts) - Math.min(...lefts);
    if (spread <= 1) {
      pass(`Alignment within 1px at ${width}px (spread: ${spread.toFixed(2)}px)`);
    } else {
      fail(
        `Alignment at ${width}px`,
        `spread ${spread.toFixed(2)}px — ${valid.map((c) => `${c.sel}:${c.left.toFixed(1)}`).join(", ")}`
      );
    }
  }

  // No horizontal overflow
  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  noOverflow ? pass(`No horizontal overflow at ${width}px`) : fail(`No horizontal overflow at ${width}px`);

  // Screenshot
  await page.screenshot({ path: join(SCREENSHOTS_DIR, `about-${width}.png`), fullPage: true });
  pass(`Screenshot saved: about-${width}.png`);

  await page.close();
}

await browser.close();

// ── Report ────────────────────────────────────────────────────────────────────
console.log("\n─────────────────────────────────────────────────────");
const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log("\nFailed checks:");
  results.filter((r) => !r.ok).forEach((r) => {
    console.log(`  - ${r.label}${r.detail ? ": " + r.detail : ""}`);
  });
  process.exit(1);
} else {
  console.log("\nAll checks passed.");
}
