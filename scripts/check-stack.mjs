/**
 * check-stack.mjs — measure Services stacking card behaviour
 * Usage: node scripts/check-stack.mjs [url]
 * Default URL: https://azure-innovations-landing.vercel.app
 */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "https://azure-innovations-landing.vercel.app";
const VP = { width: 1440, height: 900 };

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize(VP);
await page.goto(URL, { waitUntil: "networkidle" });

// ── Locate elements ──────────────────────────────────────────────────────────
const stack = page.locator("#services .stack, #services [style*='flow-root'], #services [style*='relative']").first();
const cards = page.locator(".svc-card");
const N = await cards.count();

if (N !== 4) {
  console.error(`Expected 4 .svc-card elements, found ${N}. Check selector.`);
  await browser.close(); process.exit(1);
}

// ── Print computed top values at start ──────────────────────────────────────
console.log("\n=== Computed sticky top values at page load ===");
for (let i = 0; i < N; i++) {
  const top = await cards.nth(i).evaluate(el => getComputedStyle(el).top);
  const pos = await cards.nth(i).evaluate(el => getComputedStyle(el).position);
  console.log(`  card ${i + 1}: position=${pos}, computed top=${top}`);
}

// ── Find the stack's bounding box ─────────────────────────────────────────
const stackBox = await page.locator("#services .svc-card").first().evaluate(el => {
  // Walk up to find the stack container
  let p = el.parentElement;
  while (p && !p.style.display?.includes("flow-root") && !p.classList.contains("stack")) {
    // also accept the direct parent of .svc-card elements
    if (p.querySelector(".svc-card") === el || p.children.length >= 4) break;
    p = p.parentElement;
  }
  const rect = (p ?? el.parentElement).getBoundingClientRect();
  return { top: rect.top + window.scrollY, bottom: rect.bottom + window.scrollY, height: rect.height };
});

console.log(`\nStack container: top=${stackBox.top.toFixed(0)}, bottom=${stackBox.bottom.toFixed(0)}, height=${stackBox.height.toFixed(0)}`);

// ── Scroll sweep ─────────────────────────────────────────────────────────────
const startY = Math.max(0, stackBox.top - 200);
const endY = stackBox.bottom + 200;
const STEP = 40;

console.log(`\n=== Scroll sweep: ${startY.toFixed(0)} → ${endY.toFixed(0)}, step=${STEP} ===`);
console.log("scrollY   | card1.top  card2.top  card3.top  card4.top  | stack.bottom");
console.log("----------+-----------------------------------------------+-------------");

let card4At140Start = null;
let card4At140End = null;
let card4MaxTop = -Infinity;

for (let y = startY; y <= endY; y += STEP) {
  await page.evaluate(sy => window.scrollTo(0, sy), y);
  await page.waitForTimeout(120);

  const tops = [];
  for (let i = 0; i < N; i++) {
    const rect = await cards.nth(i).boundingBox();
    tops.push(rect ? rect.y : null);
  }

  const stackBottom = await page.evaluate(() => {
    const el = document.querySelector(".svc-card")?.parentElement;
    return el ? el.getBoundingClientRect().bottom : null;
  });

  const t = tops.map(v => v === null ? " null" : String(Math.round(v)).padStart(5));
  const sb = stackBottom === null ? "  null" : String(Math.round(stackBottom)).padStart(6);
  const scrollY = Math.round(y);

  console.log(`${String(scrollY).padStart(8)}  | ${t.join("  ")}  |  ${sb}`);

  if (tops[3] !== null) {
    if (Math.abs(tops[3] - 140) <= 1) {
      if (card4At140Start === null) card4At140Start = scrollY;
      card4At140End = scrollY;
    }
    if (tops[3] > card4MaxTop) card4MaxTop = tops[3];
  }
}

// ── Summary ─────────────────────────────────────────────────────────────────
console.log("\n=== Summary ===");
const holdPx = card4At140Start !== null ? (card4At140End - card4At140Start) : 0;
console.log(`Card 4 maximum top seen: ${card4MaxTop.toFixed(0)}px`);
if (card4At140Start !== null) {
  console.log(`Card 4 first at top=140 at scrollY=${card4At140Start}`);
  console.log(`Card 4 hold at top=140: ${holdPx}px  (required ≥ ${Math.round(0.16 * VP.height)}px = 0.16×${VP.height})`);
  console.log(holdPx >= 0.16 * VP.height ? "PASS ✓" : "FAIL ✗ — runway too short");
} else {
  console.log("FAIL ✗ — Card 4 never reached top=140 in the scroll range. Runway or sticky broken.");
}

await browser.close();
