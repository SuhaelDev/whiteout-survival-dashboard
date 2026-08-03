/* Proves the "desktop untouched" constraint: renders every module at desktop
   size against both the original HEAD checkout and the working tree, then
   compares the screenshots pixel for pixel. Any non-zero diff is a regression.

   Usage: node scripts/desktop-parity.mjs <origBase> <newBase> */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const ORIG = process.argv[2] || "http://127.0.0.1:5174";
const NEW = process.argv[3] || "http://127.0.0.1:5173";
const OUT = ".desktop-parity";

const MODULES = [
  "overview", "planner", "inventory", "buildings", "chief-gear", "charms",
  "heroes", "hero-gear", "pets", "experts", "research", "t12-research",
  "troops", "svs", "skins", "sources",
];

fs.mkdirSync(OUT, { recursive: true });

async function shoot(base, tag) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    // Freeze anything that would differ between two runs for reasons other
    // than our changes. Blocking service workers matters: the new build ships
    // one, and letting it serve the 2.2 MB hero from cache changes decode
    // timing, which changes text antialiasing over the band. Blocking it
    // isolates the CSS/markup delta, which is what "desktop untouched" is
    // actually about.
    reducedMotion: "reduce",
    serviceWorkers: "block",
  });
  await context.addInitScript(() => {
    try {
      localStorage.setItem(
        "wos-personal-dashboard-state-v1",
        JSON.stringify({ onboarded_at: "2026-08-03T00:00:00.000Z", owner_profile: true }),
      );
    } catch {}
    // The save status prints a wall-clock time; pin it so the two runs match.
    const fixed = new Date("2026-08-03T12:00:00Z");
    const RealDate = Date;
    // eslint-disable-next-line no-global-assign
    Date = class extends RealDate {
      constructor(...args) {
        return args.length ? new RealDate(...args) : new RealDate(fixed);
      }
      static now() {
        return fixed.getTime();
      }
    };
  });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "load" });
  await page.waitForFunction("document.querySelectorAll('#moduleNav .nav-button').length > 0", null, { timeout: 30000 });
  await page.waitForTimeout(600);

  for (const id of MODULES) {
    await page.evaluate((tab) => document.querySelector(`#moduleNav [data-tab="${tab}"]`)?.click(), id);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, `${tag}-${id}.png`), fullPage: true });
  }
  await browser.close();
}

function diff(a, b) {
  const A = PNG.sync.read(fs.readFileSync(a));
  const B = PNG.sync.read(fs.readFileSync(b));
  if (A.width !== B.width || A.height !== B.height) {
    return { sizeMismatch: `${A.width}x${A.height} vs ${B.width}x${B.height}` };
  }
  let differing = 0;
  let maxDelta = 0;
  for (let i = 0; i < A.data.length; i += 4) {
    const d =
      Math.abs(A.data[i] - B.data[i]) +
      Math.abs(A.data[i + 1] - B.data[i + 1]) +
      Math.abs(A.data[i + 2] - B.data[i + 2]);
    if (d > 6) {
      differing += 1;
      if (d > maxDelta) maxDelta = d;
    }
  }
  return { differing, total: A.width * A.height, maxDelta };
}

await shoot(ORIG, "orig");
await shoot(NEW, "new");

let fails = 0;
for (const id of MODULES) {
  const r = diff(path.join(OUT, `orig-${id}.png`), path.join(OUT, `new-${id}.png`));
  if (r.sizeMismatch) {
    console.log(`${id.padEnd(14)} SIZE MISMATCH ${r.sizeMismatch}`);
    fails += 1;
  } else if (r.differing > 0) {
    const pct = ((r.differing / r.total) * 100).toFixed(4);
    console.log(`${id.padEnd(14)} ${r.differing} px differ (${pct}%), max delta ${r.maxDelta}`);
    fails += 1;
  } else {
    console.log(`${id.padEnd(14)} identical`);
  }
}
console.log(fails === 0 ? "\nDESKTOP UNCHANGED" : `\n${fails}/${MODULES.length} modules differ`);
