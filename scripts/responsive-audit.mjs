/* Responsive layout audit.
   --------------------------------------------------------------------------
   Drives every module across a matrix of phone / tablet / desktop viewports in
   BOTH shells (the html[data-shell="mobile"] phone layer and the desktop-first
   breakpoints in styles.css) and reports, per module and viewport:

     page-hscroll               the document is wider than the viewport
     viewport-overflow          an element sticks past the viewport edge and
                                nothing scrolls or clips it (causes hscroll)
     scroller-wider-than-viewport   an overflow-x:auto wrapper is itself wider
                                than the viewport (the wrapper is not doing
                                its job)
     clipped-at-viewport        an element sticks past the viewport but an
                                overflow:hidden ancestor cuts it off
     clipped                    an overflow:hidden box cuts off its own text or
                                a descendant (no ellipsis) - "cut out at the
                                border"
     truncated                  ellipsis / line-clamp truncation is active
     text-overflow              an element's own text runs wider than its box
                                with overflow visible (sticks out of a card,
                                may sit over a neighbour)
     overlap                    two text / control / image atoms intersect
                                (a badge positioned inside a picture, and
                                inline runs that merely wrapped, are not
                                counted)
     sticky-see-through         a sticky table cell with a transparent fill
                                inside a scroller: scrolled cells paint
                                through it
     under-bar                  the last content row sits under the fixed
                                phone tab bar when scrolled to the bottom
     small-font-control         < 16px input/select on touch (iOS focus zoom)
     small-target               < 40px tall control on touch
     tiny-text                  < 10px text

   Interaction passes (--interact basic|full) re-run the probe after opening
   every <details>, then (full) after activating each kind of button / chip /
   select / input in the module, so re-rendered states are covered too. Each
   module is also probed with every horizontal scroller scrolled to its end.

   Usage
     node scripts/responsive-audit.mjs [options]
       --base http://127.0.0.1:5173      server to audit (default local dev)
       --engine chromium|webkit          default chromium
       --tabs a,b,c                      default: all 16 modules (+ "wizard")
       --viewports m390,t768,d1440       default: the full matrix (--list);
                                         also ad-hoc 414x896m / 1000x700d
       --interact none|basic|full        default basic
       --shots none|issues|all           default issues
       --out .responsive-audit           output dir
       --extra-css a.css,b.css           inject these stylesheets after load
                                         (test a fix without touching index.html)
       --nav                             navigate the way a user does (tab bar /
                                         More sheet / sidebar chips) instead of
                                         a synthetic click on the sidebar button
       --max-shots N                     issue screenshots per stage (default 8)
       --max-actions N                   full-interaction actions per module
       --quiet                           only print the summary table
       --list                            print the viewport matrix and exit

   Output
     <out>/report-<engine>.json   everything
     <out>/summary-<engine>.md    matrix + top issues per viewport
     <out>/shots/<vp>/<tab>-<stage>-<n>-<kind>.png   flagged element screenshots
   ========================================================================== */
import { chromium, webkit } from "playwright";
import fs from "node:fs";
import path from "node:path";
import {
  ALL_TABS, VIEWPORTS, parseViewport, contextOptions, SEED, installAudit, waitForApp,
  SHOT_KINDS, flagsOf, CODES_LEGEND,
} from "./responsive-audit-lib.mjs";

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = process.argv[i + 1];
  if (v === undefined || v.startsWith("--")) return true;
  return v;
}
const list = (v) => String(v).split(",").map((s) => s.trim()).filter(Boolean);

if (arg("list", false)) {
  for (const [k, v] of Object.entries(VIEWPORTS)) console.log(`${k.padEnd(7)} ${v[0]}x${v[1]}  ${v[2]}  ${v[3] ? "touch" : "mouse"}`);
  process.exit(0);
}

const BASE = String(arg("base", process.env.BASE || "http://127.0.0.1:5173")).replace(/\/$/, "");
const ENGINE = String(arg("engine", "chromium"));
const OUT = path.resolve(String(arg("out", ".responsive-audit")));
const TABS = list(arg("tabs", ALL_TABS.join(",")));
const VP_NAMES = list(arg("viewports", Object.keys(VIEWPORTS).join(",")));
const EXTRA_CSS = arg("extra-css", "") ? list(arg("extra-css", "")) : [];
const INTERACT = String(arg("interact", "basic"));
const SHOTS = String(arg("shots", "issues"));
const NAV_REAL = Boolean(arg("nav", false));
const MAX_SHOTS = Number(arg("max-shots", 8));
const MAX_ACTIONS = Number(arg("max-actions", 30));
const QUIET = Boolean(arg("quiet", false));

fs.mkdirSync(path.join(OUT, "shots"), { recursive: true });
const engine = ENGINE === "webkit" ? webkit : chromium;
const browser = await engine.launch();
const report = { meta: { base: BASE, engine: ENGINE, started: new Date().toISOString(), interact: INTERACT, extraCss: EXTRA_CSS, nav: NAV_REAL }, viewports: {} };
const log = (...a) => { if (!QUIET) console.log(...a); };

async function newContext(vp, { seed = true } = {}) {
  const context = await browser.newContext(contextOptions(vp));
  if (seed) await context.addInitScript(SEED);
  return context;
}

async function prepare(page, vp, tab) {
  await page.goto(`${BASE}/?shell=${vp.shell}&tab=${tab}`, { waitUntil: "load" });
  await waitForApp(page);
  await installAudit(page, EXTRA_CSS);
}

async function scrollThrough(page) {
  const ys = await page.evaluate("window.__audit.scrollThrough()");
  for (const y of ys) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
}

/* Real navigation: the tab bar / More sheet on a phone, the nav chips on a
   tablet or desktop. Returns "ok", or a string describing what went wrong
   (the audit continues with a synthetic switch so the module still gets
   probed, and the navigation problem is recorded). */
async function navigate(page, vp, id) {
  if (!NAV_REAL) return page.evaluate((t) => window.__audit.switchTab(t), id);
  const sheetOpen = () => page.evaluate(() => !!document.querySelector(".msheet.open"));
  try {
    if (vp.shell === "mobile") {
      if (await sheetOpen()) {
        await page.keyboard.press("Escape");
        await page.waitForTimeout(400);
      }
      const pinned = await page.$(`.mtabs [data-mtab="${id}"]`);
      if (pinned) await pinned.tap();
      else {
        await page.tap(".mtabs [data-msheet-open]");
        await page.waitForFunction(() => !!document.querySelector(".msheet.open"), null, { timeout: 3000 });
        await page.waitForTimeout(350);
        const btn = page.locator(`.msheet.open #moduleNav [data-tab="${id}"]`);
        await btn.scrollIntoViewIfNeeded({ timeout: 5000 });
        await btn.tap({ timeout: 5000 });
        const closed = await page
          .waitForFunction(() => !document.querySelector(".msheet.open"), null, { timeout: 1500 })
          .then(() => true)
          .catch(() => false);
        if (!closed) {
          await page.keyboard.press("Escape");
          await page.waitForTimeout(400);
          return "sheet stayed open after picking a module (closed with Escape)";
        }
      }
    } else {
      await page.evaluate((t) => {
        const b = document.querySelector(`#moduleNav [data-tab="${CSS.escape(t)}"]`);
        if (b) b.scrollIntoView({ inline: "center", block: "nearest" });
      }, id);
      await page.waitForTimeout(250);
      const btn = page.locator(`#moduleNav [data-tab="${id}"]`);
      if (vp.touch) await btn.tap({ timeout: 8000, force: true }); else await btn.click({ timeout: 8000, force: true });
    }
    const ok = await page
      .waitForFunction((t) => document.body.dataset.activeTab === t, id, { timeout: 5000 })
      .then(() => true)
      .catch(() => false);
    if (ok) return "ok";
    await page.evaluate((t) => window.__audit.switchTab(t), id);
    return "real navigation did not switch the module (fell back to synthetic click)";
  } catch (e) {
    await page.evaluate((t) => window.__audit.switchTab(t), id).catch(() => {});
    return `real navigation failed: ${String(e).split("\n")[0].slice(0, 160)} (fell back to synthetic click)`;
  }
}

async function shootIssues(page, vp, tab, stage, result) {
  if (SHOTS === "none") return [];
  const dir = path.join(OUT, "shots", vp.name);
  fs.mkdirSync(dir, { recursive: true });
  const files = [];
  const picks = result.issues.filter((i) => SHOT_KINDS.has(i.kind) && i.id).slice(0, MAX_SHOTS);
  if (!picks.length && SHOTS !== "all") return files;
  await page.evaluate(() => { document.documentElement.dataset.auditAnnotate = "1"; });
  let n = 0;
  for (const it of picks) {
    n += 1;
    const ok = await page.evaluate((id) => window.__audit.scrollIntoView(id), it.id);
    if (!ok) continue;
    await page.waitForTimeout(120);
    const file = path.join(dir, `${tab}-${stage}-${n}-${it.kind}.png`);
    await page.screenshot({ path: file, fullPage: false });
    it.shot = path.relative(OUT, file);
    files.push(file);
  }
  if (SHOTS === "all") {
    await page.evaluate(() => window.scrollTo(0, 0));
    if (vp.touch) {
      // A fullPage screenshot on a touch context drops Chromium's
      // (pointer: coarse) emulation for the rest of the page's life, which
      // turns every later probe's f/t checks into noise. Slice the page with
      // viewport screenshots instead.
      const ys = await page.evaluate("window.__audit.scrollThrough()");
      let n = 0;
      for (const y of ys.slice(0, 12)) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(80);
        n += 1;
        const file = path.join(dir, `${tab}-${stage}-page${String(n).padStart(2, "0")}.png`);
        await page.screenshot({ path: file, fullPage: false });
        files.push(file);
      }
    } else {
      const file = path.join(dir, `${tab}-${stage}-full.png`);
      await page.screenshot({ path: file, fullPage: true }).catch(async () => {
        await page.screenshot({ path: file, fullPage: false });
      });
      files.push(file);
    }
  }
  await page.evaluate(() => { delete document.documentElement.dataset.auditAnnotate; window.scrollTo(0, 0); });
  return files;
}

async function runStage(page, vp, tab, stage, rootSel) {
  const result = await page.evaluate((cfg) => window.__audit.probe(cfg), { rootSel, touch: vp.touch });
  if (vp.shell === "mobile" && !rootSel) {
    const ub = await page.evaluate("window.__audit.underBar()");
    if (ub && ub.hidden) {
      result.issues.push({ kind: "under-bar", severity: "high", id: null, sel: ub.sel, path: ub.path, text: ub.text, by: ub.by, count: 1, examples: [ub.text] });
      result.counts["under-bar"] = 1;
    }
    result.underBar = ub;
  }
  await shootIssues(page, vp, tab, stage, result);
  return result;
}

async function auditWizard(vp) {
  const context = await newContext(vp, { seed: false });
  const page = await context.newPage();
  const stages = [];
  try {
    await page.goto(`${BASE}/?shell=${vp.shell}`, { waitUntil: "load" });
    await page.waitForSelector("#wizardOverlay", { timeout: 30000 });
    await installAudit(page, EXTRA_CSS);
    for (let step = 0; step < 3; step += 1) {
      const r = await page.evaluate((cfg) => window.__audit.probe(cfg), { rootSel: "#wizardOverlay", touch: vp.touch });
      r.card = await page.evaluate(() => {
        const c = document.querySelector(".wizard-card");
        if (!c) return null;
        const rc = c.getBoundingClientRect();
        return { top: Math.round(rc.top), bottom: Math.round(rc.bottom), vh: innerHeight, fits: rc.top >= -1 && rc.bottom <= innerHeight + 1, scrolls: c.scrollHeight > c.clientHeight + 1, overflowY: getComputedStyle(c).overflowY };
      });
      if (r.card && !r.card.fits && r.card.overflowY !== "auto" && r.card.overflowY !== "scroll") {
        r.issues.push({ kind: "clipped-at-viewport", severity: "high", sel: "div.wizard-card", path: "div.wizard-overlay > div.wizard-card", text: "wizard card taller than viewport", count: 1, examples: [], by: r.card.bottom - r.card.vh });
        r.counts["clipped-at-viewport"] = (r.counts["clipped-at-viewport"] || 0) + 1;
      }
      await shootIssues(page, vp, "wizard", `step${step + 1}`, r);
      stages.push({ stage: `step${step + 1}`, result: r });
      const next = await page.$('[data-wizard-nav="next"]');
      if (!next) break;
      await next.click();
      await page.waitForTimeout(350);
    }
  } catch (e) {
    stages.push({ stage: "error", error: String(e).slice(0, 300) });
  }
  await context.close();
  return stages;
}

for (const vpName of VP_NAMES) {
  const vp = parseViewport(vpName);
  const vpReport = { ...vp, tabs: {}, consoleErrors: [], pageErrors: [] };
  report.viewports[vp.name] = vpReport;
  log(`\n===== ${vp.name}  ${vp.w}x${vp.h}  shell=${vp.shell}  ${vp.touch ? "touch" : "mouse"}  ${ENGINE} =====`);

  const tabs = TABS.filter((t) => t !== "wizard");
  if (TABS.includes("wizard")) {
    const stages = await auditWizard(vp);
    vpReport.tabs.wizard = { stages };
    log(`  ${"wizard".padEnd(14)} ${flagsOf(stages.map((s) => s.result))}`);
  }
  if (!tabs.length) continue;

  const context = await newContext(vp);
  const page = await context.newPage();
  page.on("console", (m) => { if (m.type() === "error") vpReport.consoleErrors.push(m.text().slice(0, 300)); });
  page.on("pageerror", (e) => vpReport.pageErrors.push(String(e).slice(0, 300)));

  try {
    await prepare(page, vp, tabs[0]);
  } catch (e) {
    vpReport.error = `load failed: ${String(e).slice(0, 300)}`;
    log("  ! " + vpReport.error);
    await context.close();
    continue;
  }

  for (const tab of tabs) {
    const entry = { stages: [] };
    vpReport.tabs[tab] = entry;
    try {
      const navResult = await navigate(page, vp, tab);
      await page.waitForFunction((t) => document.body.dataset.activeTab === t, tab, { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(tab === "chief-gear" || tab === "charms" ? 1600 : 700);
      entry.nav = navResult;
      if (NAV_REAL && navResult !== "ok") log(`  ${tab.padEnd(14)} NAV: ${navResult}`);
      entry.activeTab = await page.evaluate(() => document.body.dataset.activeTab);
      await scrollThrough(page);

      const base = await runStage(page, vp, tab, "base");
      entry.stages.push({ stage: "base", result: base });

      // Every horizontal scroller scrolled to its end: sticky columns, clipped tails.
      const scrolled = await page.evaluate("window.__audit.scrollWrappers(true)");
      if (scrolled > 0) {
        await page.waitForTimeout(150);
        const r = await runStage(page, vp, tab, "scrolled");
        r.scrollers = scrolled;
        entry.stages.push({ stage: "scrolled", result: r });
        await page.evaluate("window.__audit.scrollWrappers(false)");
      }

      if (INTERACT !== "none") {
        const opened = await page.evaluate("window.__audit.expandAll('.tab-panel.active')");
        if (opened > 0) {
          await page.waitForTimeout(500);
          await scrollThrough(page);
          const exp = await runStage(page, vp, tab, "expanded");
          exp.opened = opened;
          entry.stages.push({ stage: "expanded", result: exp });
        }
      }

      if (INTERACT === "full") {
        const actions = await page.evaluate("window.__audit.listActions('.tab-panel.active', 2)");
        entry.actions = [];
        for (const act of actions.slice(0, MAX_ACTIONS)) {
          const done = await page.evaluate((a) => window.__audit.doAction(a), act);
          await page.waitForTimeout(650);
          await page.evaluate("window.__audit.expandAll('.tab-panel.active')");
          await page.waitForTimeout(150);
          const r = await runStage(page, vp, tab, `act-${act.act}`);
          const flags = flagsOf([r]);
          entry.actions.push({ ...act, done, flags, counts: r.counts, issues: r.issues.filter((i) => SHOT_KINDS.has(i.kind)) });
          const active = await page.evaluate(() => document.body.dataset.activeTab);
          if (active !== tab) {
            await navigate(page, vp, tab);
            await page.waitForTimeout(500);
          }
        }
      }

      const acted = entry.actions ? entry.actions.filter((a) => a.flags !== "ok") : [];
      log(`  ${tab.padEnd(14)} ${flagsOf(entry.stages.map((s) => s.result))}${entry.actions ? `   actions:${entry.actions.length}${acted.length ? " (" + acted.map((a) => a.act + ":" + a.flags).join(", ") + ")" : ""}` : ""}`);
    } catch (e) {
      entry.error = String(e).slice(0, 400);
      log(`  ${tab.padEnd(14)} ERROR ${entry.error}`);
    }
  }

  // Phone-only chrome: the More sheet and the collapsible profile.
  if (vp.shell === "mobile") {
    try {
      await page.tap(".mtabs [data-msheet-open]");
      await page.waitForTimeout(600);
      const sheet = await runStage(page, vp, "sheet", "open", ".msheet");
      sheet.sheetOpen = await page.evaluate(() => document.querySelector(".msheet").classList.contains("open"));
      vpReport.tabs.sheet = { stages: [{ stage: "open", result: sheet }] };
      log(`  ${"sheet".padEnd(14)} ${flagsOf([sheet])}${sheet.sheetOpen ? "" : "  (did not open)"}`);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(450);
    } catch (e) {
      vpReport.tabs.sheet = { error: String(e).slice(0, 300) };
      log(`  sheet          ERROR ${vpReport.tabs.sheet.error}`);
    }
    try {
      const has = await page.evaluate(() => { const d = document.querySelector(".mprofile"); if (!d) return false; d.open = true; return true; });
      if (has) {
        await page.waitForTimeout(300);
        const prof = await runStage(page, vp, "profile", "open", ".hero-band");
        vpReport.tabs.profile = { stages: [{ stage: "open", result: prof }] };
        log(`  ${"profile".padEnd(14)} ${flagsOf([prof])}`);
        await page.evaluate(() => { const d = document.querySelector(".mprofile"); if (d) d.open = false; });
      }
    } catch (e) {
      vpReport.tabs.profile = { error: String(e).slice(0, 300) };
    }
  }

  if (vpReport.consoleErrors.length || vpReport.pageErrors.length) {
    log(`  errors: console ${vpReport.consoleErrors.length}, page ${vpReport.pageErrors.length}`);
    vpReport.pageErrors.slice(0, 3).forEach((e) => log("   !! " + e));
  }
  await context.close();
}

await browser.close();
report.meta.finished = new Date().toISOString();

/* ------------------------------------------------------------------------
   Write outputs
   ------------------------------------------------------------------------ */
fs.writeFileSync(path.join(OUT, `report-${ENGINE}.json`), JSON.stringify(report, null, 2));

const vps = Object.values(report.viewports);
const tabNames = [...new Set(vps.flatMap((v) => Object.keys(v.tabs)))];
let md = `# Responsive audit (${ENGINE}) - ${report.meta.started}\n\nbase: ${BASE}  interact: ${INTERACT}  extra-css: ${EXTRA_CSS.join(", ") || "none"}\n\n${CODES_LEGEND}\n\n`;
md += `| module | ${vps.map((v) => v.name).join(" | ")} |\n|---|${vps.map(() => "---").join("|")}|\n`;
for (const t of tabNames) {
  md += `| ${t} | ${vps.map((v) => { const e = v.tabs[t]; if (!e) return "-"; if (e.error) return "ERR"; return flagsOf((e.stages || []).map((s) => s.result)); }).join(" | ")} |\n`;
}
md += "\n";
for (const v of vps) {
  const lines = [];
  for (const [t, e] of Object.entries(v.tabs)) {
    for (const s of e.stages || []) {
      const r = s.result;
      if (!r) continue;
      if (r.hscroll) lines.push(`- **${t}/${s.stage}**: page-hscroll docW=${r.docW} vw=${r.vw}`);
      for (const it of r.issues) {
        if (!SHOT_KINDS.has(it.kind)) continue;
        const by = it.by != null ? ` by ${it.by}px` : it.overflowPx != null ? ` by ${it.overflowPx}px` : it.overlapPx ? ` ${it.overlapPx.x}x${it.overlapPx.y}px` : "";
        const other = it.other ? ` <-> \`${it.other.sel}\` "${it.other.text}"` : "";
        const victims = it.victims && it.victims.length ? ` victims: ${it.victims.map((x) => `${x.sel} "${x.text}"`).slice(0, 3).join("; ")}` : "";
        lines.push(`- **${t}/${s.stage}** ${it.kind}${by} ×${it.count}: \`${it.path}\` "${it.text}"${other}${victims}${it.shot ? ` [shot](${it.shot.replace(/\\/g, "/")})` : ""}`);
      }
    }
    for (const a of e.actions || []) {
      for (const it of a.issues || []) {
        lines.push(`- **${t}/after ${a.kind} "${a.text}"** ${it.kind} ×${it.count}: \`${it.path}\` "${it.text}"${it.other ? ` <-> \`${it.other.sel}\`` : ""}`);
      }
    }
  }
  if (lines.length || v.pageErrors.length) {
    md += `## ${v.name} (${v.w}x${v.h}, ${v.shell}${v.touch ? ", touch" : ""})\n\n${lines.slice(0, 150).join("\n")}\n`;
    if (lines.length > 150) md += `- ... ${lines.length - 150} more in report json\n`;
    if (v.pageErrors.length) md += `\nPage errors:\n${v.pageErrors.slice(0, 5).map((x) => "- " + x).join("\n")}\n`;
    md += "\n";
  }
}
fs.writeFileSync(path.join(OUT, `summary-${ENGINE}.md`), md);

console.log("\n" + md.split("\n").slice(0, 8 + tabNames.length).join("\n"));
console.log(`\nreport: ${path.join(OUT, `report-${ENGINE}.json`)}\nsummary: ${path.join(OUT, `summary-${ENGINE}.md`)}`);
