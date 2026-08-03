/* Opens and closes the sheet several times and checks it always lands fully
   open / fully closed, plus that the tab bar still navigates while the sheet
   subtree is inert. */
import { webkit, devices } from "playwright";
const browser = await webkit.launch();
const ctx = await browser.newContext({ ...devices["iPhone 15 Pro"] });
await ctx.addInitScript(() => { try { localStorage.setItem("wos-personal-dashboard-state-v1", JSON.stringify({onboarded_at:"2026-08-03T00:00:00.000Z", owner_profile:true})); } catch {} });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", e => errs.push(String(e)));
await page.goto("http://127.0.0.1:5173/", { waitUntil: "load" });
await page.waitForFunction("document.querySelectorAll('#moduleNav .nav-button').length > 0", null, {timeout:20000});
await page.waitForTimeout(500);

const read = () => page.evaluate(() => {
  const s = document.querySelector(".msheet");
  const p = s.querySelector(".msheet__panel");
  const r = p.getBoundingClientRect();
  return { open: s.classList.contains("open"), inert: s.inert === true,
           top: Math.round(r.top), vh: window.innerHeight,
           pe: getComputedStyle(s).pointerEvents };
});

let fails = 0;
for (let i = 0; i < 4; i++) {
  await page.tap(".mtabs [data-msheet-open]");
  await page.waitForTimeout(700);
  const o = await read();
  const fullyOpen = o.open && !o.inert && o.top < o.vh - 400;
  console.log(`open  #${i+1}`, JSON.stringify(o), fullyOpen ? "OK" : "FAIL");
  if (!fullyOpen) fails++;

  // Escape is a real dismissal path and avoids Playwright re-scrolling a
  // viewport-sized scrim before tapping it.
  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);
  const c = await read();
  const fullyClosed = !c.open && c.inert && c.top >= c.vh - 2 && c.pe === "none";
  console.log(`close #${i+1}`, JSON.stringify(c), fullyClosed ? "OK" : "FAIL");
  if (!fullyClosed) fails++;
}

// Tab bar must still navigate with the sheet closed + inert.
for (const id of ["planner", "inventory", "heroes", "overview"]) {
  await page.tap(`.mtabs [data-mtab="${id}"]`);
  await page.waitForTimeout(600);
  const active = await page.evaluate(() => document.body.dataset.activeTab);
  console.log(`tab -> ${id}`, active === id ? "OK" : `FAIL (${active})`);
  if (active !== id) fails++;
}

console.log("pageerrors:", errs.length, errs.slice(0,3).join(" | "));
console.log(fails === 0 && errs.length === 0 ? "SHEET CYCLE PASSED" : `${fails} FAILURES`);
await browser.close();
process.exit(fails === 0 && errs.length === 0 ? 0 : 1);
