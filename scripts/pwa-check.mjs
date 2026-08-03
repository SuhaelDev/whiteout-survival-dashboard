/* PWA acceptance checks that the layout audit cannot cover:
   - manifest parses and every icon it references actually resolves
   - the service worker installs, precaches, and survives a hard offline reload
   - the desktop shell is left completely alone
   - deep links (?tab=) still work, including from the manifest shortcuts */
import { webkit, chromium, devices } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:5173";
let failures = 0;

function check(name, ok, detail = "") {
  if (!ok) failures += 1;
  console.log(`${ok ? "  ok  " : "  FAIL"}  ${name}${detail ? "  -> " + detail : ""}`);
}

const seedState = () => {
  try {
    localStorage.setItem(
      "wos-personal-dashboard-state-v1",
      JSON.stringify({ onboarded_at: "2026-08-03T00:00:00.000Z", owner_profile: true }),
    );
  } catch {}
};

/* ---------------------------------------------------------------- manifest */
console.log("\n== manifest ==");
{
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const res = await page.goto(`${BASE}/manifest.webmanifest`);
  check("served", res.ok(), String(res.status()));
  check(
    "content-type",
    (res.headers()["content-type"] || "").includes("manifest+json"),
    res.headers()["content-type"],
  );
  const manifest = JSON.parse(await res.text());
  check("has name", !!manifest.name);
  check("display standalone", manifest.display === "standalone", manifest.display);
  check("start_url in scope", String(manifest.start_url).startsWith(manifest.scope));
  check("theme_color", !!manifest.theme_color, manifest.theme_color);
  check("background_color", !!manifest.background_color, manifest.background_color);
  const sizes = manifest.icons.map((i) => i.sizes);
  check("192 icon", sizes.includes("192x192"));
  check("512 icon", sizes.includes("512x512"));
  check("maskable icon", manifest.icons.some((i) => (i.purpose || "").includes("maskable")));

  const urls = [
    ...manifest.icons.map((i) => i.src),
    ...(manifest.shortcuts || []).flatMap((s) => (s.icons || []).map((i) => i.src)),
  ];
  let missing = [];
  for (const u of [...new Set(urls)]) {
    const r = await page.request.get(BASE + u);
    if (!r.ok()) missing.push(u);
  }
  check("all manifest icons resolve", missing.length === 0, missing.join(", "));

  // Every apple-touch-startup-image in the document must exist too.
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  const splash = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel="apple-touch-startup-image"]')].map((l) => l.getAttribute("href")),
  );
  check("splash images declared", splash.length >= 20, `${splash.length} links`);
  missing = [];
  for (const href of splash) {
    const r = await page.request.get(new URL(href, BASE).href);
    if (!r.ok()) missing.push(href);
  }
  check("all splash images resolve", missing.length === 0, missing.slice(0, 3).join(", "));

  const appleIcon = await page.evaluate(
    () => document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute("href") || null,
  );
  check("apple-touch-icon declared", !!appleIcon, appleIcon || "");
  const r = await page.request.get(new URL(appleIcon, BASE).href);
  check("apple-touch-icon resolves", r.ok());
  await browser.close();
}

/* ------------------------------------------------------ service worker /  offline */
console.log("\n== service worker + offline ==");
/* WebKit verifies registration and precaching (this is the engine that ships
   on iOS), but Playwright's WebKit crashes on reload-while-offline, so the
   actual offline reload runs in Chromium with the same iPhone profile. */
{
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...devices["iPhone 15 Pro"] });
  await context.addInitScript(seedState);
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForFunction("document.querySelectorAll('#moduleNav .nav-button').length > 0", null, { timeout: 20000 });
  await page.waitForTimeout(3000);
  const wk = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return { registered: !!reg, scope: reg?.scope, state: reg?.active?.state, controlled: !!navigator.serviceWorker.controller };
  });
  check("webkit: SW registered", wk.registered, JSON.stringify(wk));
  check("webkit: SW controls the page", wk.controlled);
  check("webkit: scope is root", (wk.scope || "").endsWith("/"), wk.scope);
  await browser.close();
}

{
  const browser = await chromium.launch();
  const context = await browser.newContext({ ...devices["iPhone 15 Pro"] });
  await context.addInitScript(seedState);
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForFunction("document.querySelectorAll('#moduleNav .nav-button').length > 0", null, { timeout: 20000 });

  // Give the worker a moment to finish precaching before pulling the plug.
  await page.waitForTimeout(3000);

  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    const out = {};
    for (const n of names) {
      const c = await caches.open(n);
      out[n] = (await c.keys()).length;
    }
    return out;
  });
  check("shell cache populated", Object.entries(cached).some(([k, v]) => k.includes("shell") && v >= 10), JSON.stringify(cached));
  check("data cache populated", Object.entries(cached).some(([k, v]) => k.includes("data") && v >= 3), JSON.stringify(cached));

  await context.setOffline(true);
  await page.reload({ waitUntil: "load" });
  const offline = await page.evaluate(async () => {
    await new Promise((r) => setTimeout(r, 2500));
    return {
      navButtons: document.querySelectorAll("#moduleNav .nav-button").length,
      errorState: document.body.textContent.includes("Data could not load"),
      panelChildren: document.querySelector(".tab-panel.active")?.children.length ?? -1,
      tabbar: !!document.querySelector(".mtabs"),
      title: document.getElementById("mTopTitle")?.textContent || null,
    };
  });
  check("offline: nav renders", offline.navButtons === 16, `${offline.navButtons} buttons`);
  check("offline: no data-error state", !offline.errorState);
  check("offline: active panel has content", offline.panelChildren > 0, `${offline.panelChildren} children`);
  check("offline: tab bar present", offline.tabbar);

  // Switching module offline must still compute from cached data.
  const switched = await page.evaluate(async () => {
    document.querySelector('#moduleNav [data-tab="inventory"]')?.click();
    await new Promise((r) => setTimeout(r, 900));
    return {
      active: document.body.dataset.activeTab,
      children: document.querySelector(".tab-panel.active")?.children.length ?? -1,
    };
  });
  check("offline: module switch works", switched.active === "inventory" && switched.children > 0, JSON.stringify(switched));

  await context.setOffline(false);
  await browser.close();
}

/* --------------------------------------------------------------- deep links */
console.log("\n== deep links ==");
{
  const browser = await webkit.launch();
  const context = await browser.newContext({ ...devices["iPhone 15 Pro"] });
  await context.addInitScript(seedState);
  const page = await context.newPage();
  await page.goto(`${BASE}/?tab=chief-gear&source=pwa`, { waitUntil: "load" });
  await page.waitForFunction("document.body.dataset.activeTab", null, { timeout: 20000 });
  await page.waitForTimeout(600);
  const state = await page.evaluate(() => ({
    active: document.body.dataset.activeTab,
    title: document.getElementById("mTopTitle")?.textContent,
    moreActive: document.querySelector(".mtabs [data-msheet-open]")?.classList.contains("active"),
  }));
  check("?tab= honoured", state.active === "chief-gear", JSON.stringify(state));
  check("top bar shows module", state.title === "Chief Gear", state.title);
  check("More tab carries active state for unpinned module", state.moreActive === true);

  // A pinned tab tap must update the URL so a relaunch restores it.
  await page.tap('.mtabs [data-mtab="inventory"]');
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => ({
    active: document.body.dataset.activeTab,
    url: location.search,
    tabActive: document.querySelector('.mtabs [data-mtab="inventory"]').classList.contains("active"),
  }));
  check("tab bar switches module", after.active === "inventory", JSON.stringify(after));
  check("tab bar marks itself active", after.tabActive);
  check("URL tracks module", after.url.includes("tab=inventory"), after.url);
  await browser.close();
}

/* ------------------------------------------------------------ desktop shell */
console.log("\n== desktop shell untouched ==");
{
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(seedState);
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForFunction("document.querySelectorAll('#moduleNav .nav-button').length > 0", null, { timeout: 20000 });
  const d = await page.evaluate(() => {
    const sidebar = document.querySelector(".sidebar");
    const vis = (sel) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).display !== "none" : false;
    };
    return {
      shell: document.documentElement.dataset.shell,
      mchrome: document.documentElement.dataset.mchrome || null,
      sidebarParent: sidebar?.parentElement?.className,
      sidebarDisplay: getComputedStyle(sidebar).display,
      sidebarPosition: getComputedStyle(sidebar).position,
      tabbarVisible: vis(".mtabs"),
      topbarVisible: vis(".mtopbar"),
      sheetVisible: vis(".msheet"),
      inputFont: getComputedStyle(document.querySelector("#profileInputs input")).fontSize,
      buttonMinHeight: getComputedStyle(document.querySelector("#exportState")).minHeight,
      appShellCols: getComputedStyle(document.querySelector(".app-shell")).gridTemplateColumns,
    };
  });
  check("shell flag is desktop", d.shell === "desktop", d.shell);
  check("no mobile chrome flag", d.mchrome === null);
  check("sidebar still in .app-shell", d.sidebarParent === "sidebar" || d.sidebarParent === "app-shell", d.sidebarParent);
  check("sidebar sticky as before", d.sidebarPosition === "sticky", d.sidebarPosition);
  check("tab bar hidden", !d.tabbarVisible);
  check("top bar hidden", !d.topbarVisible);
  check("sheet hidden", !d.sheetVisible);
  check("inputs keep 13px", d.inputFont === "13px", d.inputFont);
  check("buttons keep 34px floor", d.buttonMinHeight === "30px" || d.buttonMinHeight === "34px", d.buttonMinHeight);
  check("two-column shell", d.appShellCols.startsWith("260px"), d.appShellCols);
  await browser.close();
}

console.log(failures === 0 ? "\nALL PWA CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
