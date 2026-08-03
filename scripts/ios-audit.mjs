/* Drives the dashboard in WebKit with an iPhone profile and reports the things
   that actually break on iOS: focus-zoom-triggering controls, sub-44px touch
   targets, horizontal page overflow, safe-area handling, console errors, and
   whether every module renders. Screenshots land in .ios-audit/. */
import { webkit, devices } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "http://127.0.0.1:5173";
const OUT = process.env.OUT || ".ios-audit";
const ONLY = process.argv[2];

const MODULES = [
  "overview",
  "planner",
  "inventory",
  "buildings",
  "chief-gear",
  "charms",
  "heroes",
  "hero-gear",
  "pets",
  "experts",
  "research",
  "t12-research",
  "troops",
  "svs",
  "skins",
  "sources",
];

fs.mkdirSync(OUT, { recursive: true });

const AUDIT = `(() => {
  const out = { smallFonts: [], smallTargets: [], overflow: [], notes: [] };
  const vw = document.documentElement.clientWidth;

  // Anything focusable under 16px makes Safari zoom the viewport on focus.
  document.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.type === 'hidden' || el.type === 'file') return;
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < 16) {
      out.smallFonts.push({
        tag: el.tagName.toLowerCase(), type: el.type || '', size,
        cls: el.className || '', path: el.dataset.path || '',
      });
    }
  });

  // Apple's minimum comfortable hit area is 44x44pt.
  const clickable = 'button, a[href], summary, [role="button"], input[type="checkbox"], .nav-button, .mtab, .extract-chip, .planner-tab, .charm-chip, .inv-reset';
  document.querySelectorAll(clickable).forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;      // hidden
    if (el.closest('[hidden]')) return;
    if (r.height < 44 || r.width < 32) {
      out.smallTargets.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 60),
        text: (el.textContent || '').trim().slice(0, 28),
        w: Math.round(r.width), h: Math.round(r.height),
      });
    }
  });

  // Anything sticking out past the viewport creates a sideways page scroll.
  document.querySelectorAll('body *').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (r.right > vw + 1.5 && getComputedStyle(el).position !== 'fixed') {
      // A wide table inside its own overflow-x wrapper is intentional.
      if (el.closest('.table-wrap, [style*="overflow"], .hero-selector-strip')) return;
      const parent = el.parentElement;
      if (parent) {
        const po = getComputedStyle(parent).overflowX;
        if (po === 'auto' || po === 'scroll' || po === 'hidden') return;
      }
      out.overflow.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 60),
        right: Math.round(r.right), vw,
      });
    }
  });

  out.docScrollWidth = document.documentElement.scrollWidth;
  out.viewportWidth = vw;
  out.horizontalScroll = document.documentElement.scrollWidth > vw + 1;
  out.shell = document.documentElement.dataset.shell;
  out.mchrome = document.documentElement.dataset.mchrome || null;
  out.tabbar = !!document.querySelector('.mtabs');
  out.topbar = !!document.querySelector('.mtopbar');
  out.sidebarInSheet = !!document.querySelector('.msheet__body > .sidebar');
  out.navButtons = document.querySelectorAll('#moduleNav .nav-button').length;
  out.activeTab = document.body.dataset.activeTab;
  const panel = document.querySelector('.tab-panel.active');
  out.activePanelChildren = panel ? panel.children.length : -1;
  return out;
})()`;

function dedupe(list, keyer) {
  const seen = new Map();
  for (const item of list) {
    const key = keyer(item);
    if (!seen.has(key)) seen.set(key, { ...item, count: 1 });
    else seen.get(key).count += 1;
  }
  return [...seen.values()];
}

const results = {};
const consoleErrors = [];
const pageErrors = [];

const browser = await webkit.launch();
const context = await browser.newContext({
  ...devices["iPhone 15 Pro"],
  // Playwright's descriptor is a good stand-in for a real device: 393x852 CSS
  // px, DPR 3, hasTouch, Safari UA.
});
const page = await context.newPage();

page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 300));
});
page.on("pageerror", (err) => pageErrors.push(String(err).slice(0, 300)));

// A fresh profile has no saved state, so maybeOpenOnboarding() throws the
// wizard over everything and there is nothing to audit. Mark it configured -
// stateLooksConfigured() only checks onboarded_at / owner_profile / chief_name.
await context.addInitScript(() => {
  try {
    if (!localStorage.getItem("wos-personal-dashboard-state-v1")) {
      localStorage.setItem(
        "wos-personal-dashboard-state-v1",
        JSON.stringify({ onboarded_at: "2026-08-03T00:00:00.000Z", owner_profile: true }),
      );
    }
  } catch {}
});

await page.goto(`${BASE}/`, { waitUntil: "load" });
await page.waitForFunction("document.querySelectorAll('#moduleNav .nav-button').length > 0", null, {
  timeout: 20000,
});
await page.waitForTimeout(400);

const modules = ONLY ? [ONLY] : MODULES;

for (const id of modules) {
  await page.evaluate((tab) => {
    document.querySelector(`#moduleNav [data-tab="${tab}"]`)?.click();
  }, id);
  await page.waitForTimeout(650);
  const audit = await page.evaluate(AUDIT);
  audit.smallFonts = dedupe(audit.smallFonts, (f) => `${f.tag}.${f.type}.${f.cls}`);
  audit.smallTargets = dedupe(audit.smallTargets, (t) => `${t.tag}.${t.cls}.${t.h}`);
  audit.overflow = dedupe(audit.overflow, (o) => `${o.tag}.${o.cls}`);
  results[id] = audit;
  await page.screenshot({ path: path.join(OUT, `${id}.png`), fullPage: false });
}

// Sheet behaviour - tap it like a user would so hit-testing is exercised too.
await page.tap(".mtabs [data-msheet-open]");
await page.waitForTimeout(900);
const sheet = await page.evaluate(() => {
  const s = document.querySelector(".msheet");
  const panel = s.querySelector(".msheet__panel");
  const r = panel.getBoundingClientRect();
  const tabs = document.querySelector(".mtabs").getBoundingClientRect();
  return {
    open: s.classList.contains("open"),
    visible: getComputedStyle(s).visibility,
    transform: getComputedStyle(panel).transform,
    panelTop: Math.round(r.top),
    panelBottom: Math.round(r.bottom),
    panelH: Math.round(r.height),
    viewportH: window.innerHeight,
    tabsTop: Math.round(tabs.top),
    tabsBottom: Math.round(tabs.bottom),
    navButtons: s.querySelectorAll(".nav-button").length,
    appShellInert: document.querySelector(".app-shell").inert === true,
    focus: document.activeElement?.className || null,
  };
});
await page.screenshot({ path: path.join(OUT, "sheet-open.png") });

await page.evaluate(() => document.querySelector(".msheet__scrim").click());
await page.waitForTimeout(400);
const sheetClosed = await page.evaluate(
  () => !document.querySelector(".msheet").classList.contains("open"),
);

// Landscape
await page.setViewportSize({ width: 852, height: 393 });
await page.waitForTimeout(700);
const landscape = await page.evaluate(AUDIT);
await page.screenshot({ path: path.join(OUT, "landscape.png") });
await page.setViewportSize({ width: 393, height: 852 });
await page.waitForTimeout(500);

// Service worker + offline
const swState = await page.evaluate(async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  return {
    registered: !!reg,
    scope: reg?.scope || null,
    active: reg?.active?.state || null,
    controller: !!navigator.serviceWorker.controller,
    caches: await caches.keys(),
  };
});

fs.writeFileSync(
  path.join(OUT, "report.json"),
  JSON.stringify(
    { results, sheet, sheetClosed, landscape, swState, consoleErrors, pageErrors },
    null,
    2,
  ),
);

// Console summary
const line = (s) => process.stdout.write(s + "\n");
line("=== SHELL ===");
line(JSON.stringify(
  {
    shell: results[modules[0]].shell,
    mchrome: results[modules[0]].mchrome,
    tabbar: results[modules[0]].tabbar,
    topbar: results[modules[0]].topbar,
    sidebarInSheet: results[modules[0]].sidebarInSheet,
    navButtons: results[modules[0]].navButtons,
  }));
line("\n=== PER MODULE ===");
for (const [id, r] of Object.entries(results)) {
  const flags = [];
  if (r.horizontalScroll) flags.push(`H-SCROLL ${r.docScrollWidth}>${r.viewportWidth}`);
  if (r.smallFonts.length) flags.push(`fonts:${r.smallFonts.length}`);
  if (r.smallTargets.length) flags.push(`targets:${r.smallTargets.length}`);
  if (r.overflow.length) flags.push(`overflow:${r.overflow.length}`);
  if (r.activePanelChildren === 0) flags.push("EMPTY PANEL");
  line(`${id.padEnd(14)} ${flags.length ? flags.join("  ") : "clean"}`);
}
line("\n=== SHEET ===");
line(JSON.stringify(sheet) + `  closedOnScrim=${sheetClosed}`);
line("\n=== LANDSCAPE ===");
line(
  JSON.stringify({
    hScroll: landscape.horizontalScroll,
    docW: landscape.docScrollWidth,
    vw: landscape.viewportWidth,
    shell: landscape.shell,
    targets: landscape.smallTargets.length,
  }),
);
line("\n=== SERVICE WORKER ===");
line(JSON.stringify(swState));
line("\n=== ERRORS ===");
line(`console: ${consoleErrors.length}  pageerror: ${pageErrors.length}`);
consoleErrors.slice(0, 8).forEach((e) => line("  ! " + e));
pageErrors.slice(0, 8).forEach((e) => line("  !! " + e));

await browser.close();
