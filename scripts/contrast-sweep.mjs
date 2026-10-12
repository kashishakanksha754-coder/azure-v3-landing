/**
 * contrast-sweep.mjs — WCAG colour contrast + axe accessibility audit
 * Usage: node scripts/contrast-sweep.mjs [URL]
 * Default URL: https://azure-innovations-landing.vercel.app/about
 */
import { chromium } from "playwright";

const URL = process.argv[2] ?? "https://azure-innovations-landing.vercel.app/about";
const WIDTHS = [390, 768, 1280, 1440];

const AXE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js";

async function runAxe(page) {
  // Inject axe-core
  await page.addScriptTag({ url: AXE_CDN });
  const results = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    });
    return {
      violations: r.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.length,
        help: v.help,
        helpUrl: v.helpUrl,
      })),
      passes: r.passes.length,
      incomplete: r.incomplete.length,
    };
  });
  return results;
}

const browser = await chromium.launch();
let totalViolations = 0;
const allViolations = [];

for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewportSize({ width, height: 900 });
  await page.goto(URL, { waitUntil: "networkidle" });
  // Scroll to reveal content
  await page.evaluate(() => window.scrollTo(0, 200));
  await new Promise((r) => setTimeout(r, 800));

  const results = await runAxe(page);
  console.log(`\n[${width}px] passes: ${results.passes}, incomplete: ${results.incomplete}, violations: ${results.violations.length}`);

  if (results.violations.length > 0) {
    for (const v of results.violations) {
      totalViolations++;
      allViolations.push({ width, ...v });
      console.error(`  ✗ [${v.impact}] ${v.id}: ${v.help} (${v.nodes} node${v.nodes !== 1 ? "s" : ""})`);
      console.error(`    ${v.helpUrl}`);
    }
  } else {
    console.log(`  ✓ Zero violations at ${width}px`);
  }

  await page.close();
}

await browser.close();

console.log(`\n${"─".repeat(60)}`);
if (totalViolations === 0) {
  console.log("✓ PASS — zero WCAG 2.1 AA violations across all widths");
  process.exit(0);
} else {
  console.error(`✗ FAIL — ${totalViolations} violation(s) found`);
  process.exit(1);
}
