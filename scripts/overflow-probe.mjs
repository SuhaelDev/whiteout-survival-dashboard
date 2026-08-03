/* For each module, find the *root* overflowing elements - the outermost nodes
   that stick past the viewport - rather than the hundreds of descendants they
   drag along. Reports the CSS that is actually forcing the width. */
import { webkit, devices } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:5173";
const MODULES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["chief-gear", "charms", "heroes", "hero-gear", "pets", "experts", "research", "t12-research", "troops"];

const PROBE = `(() => {
  const vw = document.documentElement.clientWidth;
  const over = [];
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed') return;
    if (r.right > vw + 1.5) over.push(el);
  });
  // Keep only elements with no overflowing ancestor in the set: the roots.
  const set = new Set(over);
  const roots = over.filter((el) => {
    let p = el.parentElement;
    while (p) { if (set.has(p)) return false; p = p.parentElement; }
    return true;
  });
  const describe = (el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const parent = el.parentElement;
    const pcs = parent ? getComputedStyle(parent) : null;
    return {
      sel: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).trim().split(/\\s+/).join('.') : ''),
      right: Math.round(r.right), width: Math.round(r.width), left: Math.round(r.left),
      minWidth: cs.minWidth, width_css: cs.width, gtc: cs.gridTemplateColumns.slice(0, 90),
      display: cs.display, whiteSpace: cs.whiteSpace, flexBasis: cs.flexBasis,
      parent: parent ? parent.tagName.toLowerCase() + (parent.className ? '.' + String(parent.className).trim().split(/\\s+/).join('.') : '') : null,
      parentDisplay: pcs ? pcs.display : null,
      parentGtc: pcs ? pcs.gridTemplateColumns.slice(0, 90) : null,
      parentOverflowX: pcs ? pcs.overflowX : null,
    };
  };
  const seen = new Set();
  return roots.map(describe).filter((d) => {
    if (seen.has(d.sel)) return false;
    seen.add(d.sel);
    return true;
  });
})()`;

const browser = await webkit.launch();
const context = await browser.newContext({ ...devices["iPhone 15 Pro"] });
await context.addInitScript(() => {
  try {
    localStorage.setItem(
      "wos-personal-dashboard-state-v1",
      JSON.stringify({ onboarded_at: "2026-08-03T00:00:00.000Z", owner_profile: true }),
    );
  } catch {}
});
const page = await context.newPage();
await page.goto(`${BASE}/`, { waitUntil: "load" });
await page.waitForFunction("document.querySelectorAll('#moduleNav .nav-button').length > 0", null, { timeout: 20000 });

for (const id of MODULES) {
  await page.evaluate((tab) => document.querySelector(`#moduleNav [data-tab="${tab}"]`)?.click(), id);
  await page.waitForTimeout(600);
  const roots = await page.evaluate(PROBE);
  console.log(`\n===== ${id} =====`);
  if (!roots.length) {
    console.log("  no overflow");
    continue;
  }
  for (const r of roots.slice(0, 8)) {
    console.log(`  ${r.sel}`);
    console.log(`     box l=${r.left} w=${r.width} right=${r.right}  min-width:${r.minWidth} width:${r.width_css} display:${r.display} ws:${r.whiteSpace}`);
    if (r.gtc && r.gtc !== "none") console.log(`     grid-template-columns: ${r.gtc}`);
    console.log(`     parent ${r.parent} (${r.parentDisplay}, overflow-x:${r.parentOverflowX})`);
    if (r.parentGtc && r.parentGtc !== "none") console.log(`     parent gtc: ${r.parentGtc}`);
  }
}
await browser.close();
