# Responsive audit + fix brief (read fully before starting)

Project: `C:\Users\suhae\.gemini\antigravity\scratch\whiteout-survival-dashboard`
Live site: https://whiteout-survival-dashboard.vercel.app/ (do NOT deploy; the lead deploys)
Local server: **already running** at http://127.0.0.1:5173 (`node scripts/dev-server.mjs 5173`). Do not start a second one on that port. If it is down, start it in the background on 5173.

## Goal

The owner wants the dashboard usable on **phones of every size (Chrome / installed PWA), tablets and desktops** with **nothing overlapping and nothing cut off** at borders or frames, on every tab, through every navigation, input and state change. Your job: audit the tabs assigned to you at every viewport in the matrix, fix every layout defect you find, prove the fix with the harness, and report.

Definition of done for each of your tabs, at **every** viewport in the matrix (`node scripts/responsive-audit.mjs --list`), Chromium for all and WebKit for the phone viewports:

- no `H!`, `V`, `W`, `C`, `T`, `O`, `S`, `B!` codes in any stage (base, scrolled, expanded, actions) — or the finding is documented as intentional with a reason (see "What counts as intentional").
- no `f` (sub-16px controls) on phone viewports.
- every `e` (ellipsis / line-clamp truncation) reviewed: either removed on phones or justified (a truncation with a hover/expand affordance is fine on desktop; a clamped sentence with no way to read it is not).
- `t` (small targets) and `x` (sub-10px text) reviewed and fixed where cheap.
- the tab looks right in screenshots you have actually looked at: portrait phone, landscape phone, tablet, laptop, large desktop.
- desktop at >= 1101px looks the same as before unless you deliberately fixed a real desktop defect (say so in the report).

## The app in two minutes

- Vanilla JS single-page app: `index.html`, `src/app.js` (~10k lines, renders every tab with innerHTML, re-renders a whole panel on most changes), `src/styles.css` (7.3k lines, desktop-first), `src/mobile.css` (phone layer), `src/mobile.js` (phone chrome).
- **Two shells, one switch:** `<html data-shell="mobile|desktop">`. Mobile = coarse pointer AND short edge <= 500px, i.e. phones in either orientation. Tablets and desktops (any width, even a narrow window) get the desktop shell. `?shell=mobile|desktop` forces it; the harness always forces it.
- **Phone shell** (`src/mobile.css`, every rule scoped `html[data-shell="mobile"]`): static top bar, fixed bottom tab bar (`.mtabs`, height in `--mtabs-h`), a "More" bottom sheet that *adopts* the real `<aside class="sidebar">`, a collapsible chief profile `<details class="mprofile">` in the hero band, 16px controls (iOS zoom), 44px targets, drawn checkboxes, sticky first table column, `.table-wrap` horizontal scrollers, three.js canvases with `touch-action: pan-y`.
- **Desktop shell** (`src/styles.css`): 260px sticky sidebar at >= 1101px; at <= 1100px the sidebar flattens into the grid (sticky horizontal nav strip on top, account/backup panel below the content). Other breakpoints: 1000, 900, 800, 760, 720, 600. `@media (pointer: coarse)` block at the end enlarges controls for touch tablets. `.content-area` is capped at 1440px.
- Tabs: overview, planner, inventory, buildings, chief-gear, charms, heroes, hero-gear, pets, experts, research, t12-research, troops, svs, skins, sources. Renderers are `renderOverview()` … `renderSources()` in app.js (grep `^function render`). `renderActive()` sets `body[data-active-tab]`.
- State: localStorage key `wos-personal-dashboard-state-v1`. The harness seeds `{onboarded_at, owner_profile:true}` which makes app.js load the owner's real game extract (`data/current-player-state.json`), so every tab renders realistic content. Without a seed the onboarding wizard overlay appears (the harness's `wizard` pseudo-tab tests that).
- Dark theme override block near the end of styles.css (line ~4955 onward) uses `!important` heavily (panel backgrounds, `td/th background-color: transparent !important`, `summary` padding, etc.). If a rule of yours has no effect, that block is the first place to look.
- Cache-busting: `?v=` on the CSS/JS links in index.html and `BUILD` in sw.js. The lead bumps these at merge time; you do not need to.

## Tooling

### The harness

```
node scripts/responsive-audit.mjs --tabs heroes,hero-gear --viewports m320,m390,mL844,t768,d1440 --interact full --extra-css .audit-work/fixes/<your-file>.css --out .audit-work/<your-group>/run1
```

- `--viewports` names from `--list` (m = phone, mL = landscape phone, t = tablet/touch, d = desktop/mouse) or ad-hoc `414x896m` / `1000x700d`.
- `--interact basic` = base + every horizontal scroller scrolled to its end + all `<details>` opened. `--interact full` also activates up to `--max-actions` controls (2 per kind of button/chip/select/input/checkbox), probing after each. Use `full` on your tabs at least once per shell; it is slow, so scope it.
- `--extra-css` injects your fix file(s) after load, so you test fixes **without touching the source CSS**.
- `--engine webkit` for iOS Safari rendering (phone viewports).
- `--nav` uses real taps through the tab bar / More sheet / nav chips instead of a synthetic click. Run it once per shell to prove navigation.
- Output: `summary-<engine>.md` (matrix table + per-viewport findings with element paths, computed styles hints and screenshot links), `report-<engine>.json` (everything, including `styles` for each flagged element: width/min-width/white-space/parent grid columns, and `hscrollers`), `shots/<vp>/<tab>-<stage>-<n>-<kind>.png` (viewport screenshot centred on the flagged element, outlined). **Look at the screenshots** with the Read tool; a dashed outline marks the flagged element (orange = overlap, red = overflow/clipping, yellow = text wider than box, purple = see-through sticky cell).
- Codes in the matrix: `H!` page scrolls sideways, `Vn` elements past the viewport edge, `Wn` scroll wrappers wider than the viewport, `Cn` clipped by overflow:hidden, `Tn` text wider than its box, `On` overlaps, `Sn` see-through sticky cells, `B!` content under the tab bar, `fn` sub-16px controls on touch, `tn` sub-40px targets on touch, `en` ellipsis truncations, `xn` sub-10px text.

### Your own interaction scripts

The harness cannot know tab-specific flows (pick a hero, switch a chief gear slot, change a planner view, type into a specific field). Write small Playwright scripts (Playwright 1.61 + Chromium/WebKit are installed and resolvable from the project dir) using `scripts/responsive-audit-lib.mjs`:

```js
import { chromium } from "playwright";
import { parseViewport, contextOptions, SEED, installAudit, waitForApp, flagsOf } from "./scripts/responsive-audit-lib.mjs";
const vp = parseViewport("m390");
const browser = await chromium.launch();
const context = await browser.newContext(contextOptions(vp));
await context.addInitScript(SEED);
const page = await context.newPage();
await page.goto(`http://127.0.0.1:5173/?shell=${vp.shell}&tab=heroes`, { waitUntil: "load" });
await waitForApp(page);
await installAudit(page, [".audit-work/fixes/D-heroes.css"]);
// ... your clicks / typing (page.tap for touch viewports) ...
await page.waitForTimeout(600);
const r = await page.evaluate((cfg) => window.__audit.probe(cfg), { touch: vp.touch });
console.log(flagsOf([r]), r.issues.map((i) => [i.kind, i.path, i.text]));
await page.screenshot({ path: ".audit-work/D-heroes/after-pick.png", fullPage: true });
await browser.close();
```

`window.__audit` also has `expandAll(rootSel)`, `scrollWrappers(true|false)`, `underBar()`, `listActions(rootSel, perKind)`, `doAction(action)`, `switchTab(id)`, `scrollIntoView(auditId)`. Put your scripts in `.audit-work/<your-group>/`.

The probe is a heuristic. Verify visually. It also cannot see: the on-screen keyboard state, iOS safe-area insets (env() is 0 in Playwright), pseudo-element content (`::after` carets/labels), or hover states.

## Rules of engagement

1. **Write fixes only to your own CSS file:** `.audit-work/fixes/<group>.css` (name given in your task). Never edit `src/styles.css`, `src/mobile.css`, `index.html`, `sw.js`, `manifest.webmanifest`, or another group's file. The lead merges all fix files into the canonical stylesheets at the end, phone rules into mobile.css and desktop/tablet rules into styles.css.
2. **Scope every rule.** Phone rules: `html[data-shell="mobile"] …`. Desktop/tablet rules: `html[data-shell="desktop"] …`, inside `@media (max-width: …)` when width-specific. Never write an unscoped rule; landscape phones are up to 932px wide and would catch tablet media queries otherwise. Group your file into two clearly commented sections: `/* ===== PHONE SHELL ===== */` and `/* ===== DESKTOP SHELL ===== */`.
3. **`src/app.js` is read-only for you.** Read it freely to understand the markup. If a defect genuinely needs a markup change (a table that must be wrapped in `.table-wrap`, a class that has to exist, a label that needs a `<wbr>`), put the exact proposed edit in your report: function name, the exact old snippet, the exact new snippet, and why CSS alone cannot do it. The lead applies these. Prefer CSS-only fixes; most overflow problems are a grid track with an `auto` minimum, `white-space: nowrap`, a fixed `min-width`, `table-layout: fixed`, or a hard `width`.
4. **Desktop parity.** At >= 1101px the desktop rendering must not change unless you are fixing a real defect there. Every desktop-shell rule you add should be justified by a finding at that width.
5. **Do not fight the cascade blindly.** Match `!important` only where styles.css already uses it on the same property. Keep specificity as low as the fix allows.
6. **Do not** commit, push, deploy, run `git` write commands, delete files, or touch `.env.local`, `data/`, `assets/`. Do not modify scripts in `scripts/` (copy them into your folder if you need a variant).
7. Two agents run at the same time against the same dev server; that is fine. Use your own `--out` folders.
8. Cross-cutting primitives already fixed by the lead and present in mobile.css when you start (do not duplicate; extend if needed): `.grid-2` single column on portrait phones, `.compact-table table { table-layout: auto }` on phones, opaque sticky first column, unclamped `.toolbar p` on phones. If you find another cross-cutting primitive (used by several tabs) that is broken, fix it in your file and flag it prominently in the report so the lead can promote it.

## Method

1. Read the baseline for your tabs: `.audit-work/baseline/summary-chromium.md` (matrix at the top; per-viewport findings below; screenshots under `.audit-work/baseline/shots/`). Note it was taken **before** the lead's global fixes.
2. Run the harness on your tabs across all viewports with `--interact basic` (Chromium), then `--interact full` on a representative subset (m320, m390, mL844, t768, d1100, d1440), then WebKit on m320/m390/mL844. Then drive your tab-specific flows with your own scripts at m320, m390, mL844, t768, d1440 at minimum.
3. For every finding: open the screenshot, confirm it is real, find the root cause in styles.css/mobile.css/app.js markup (the report json's `styles` block tells you the element's width/min-width/white-space and the parent's grid columns / flex-wrap / overflow), write the smallest scoped rule that fixes the cause, re-run the harness with `--extra-css`, look at the screenshot again.
4. Do not stop at "the probe is clean". Walk each of your tabs top to bottom in screenshots at m320 (the narrowest), m390, mL844, t768, d1440, d1920: cards, headings, chips, buttons whose text wraps mid-word ("SHO W"), numbers that wrap ("1,234\n,567"), labels colliding with values, icons squashed, images cut, canvases too short, empty half-columns, content hidden behind the sticky nav or the tab bar, modals taller than the screen.
5. Interaction checklist per tab (adapt to the tab): switch every view/tab/chip; open every `<details>`; change every kind of `<select>`; type a very long name and a 10-digit number; toggle checkboxes; pick/select items (hero, slot, building, pet, expert, tier); press every non-destructive button; confirm the re-rendered layout is still clean; on phones open the More sheet and the profile details; in landscape phone confirm nothing hides under the tab bar; on tablets confirm nothing hides under the sticky nav strip after an in-page scroll/focus.
6. Keep notes as you go; the report is the deliverable alongside the CSS.

## What counts as intentional

- A badge or tier chip deliberately overlaid on a tile/portrait, as long as no text collides with other text and it is fully inside the tile.
- Chips/labels over a three.js canvas, as long as they do not cover each other.
- A wide table scrolling sideways inside `.table-wrap` on a phone, as long as the wrapper itself is inside the viewport, the first column is opaque and readable, and the table is not one that would fit if it simply wrapped (a 2-3 column table should fit; a 6+ column table may scroll).
- Ellipsis on a single-line title that has its full text elsewhere or on hover (desktop only).

Everything else that the probe flags, or that you can see in a screenshot, is a defect.

## Report

Write `.audit-work/reports/<group>.md` with:

1. **Summary**: tabs covered, viewports/engines run, how many defects found/fixed/left.
2. **Findings table**: `tab | viewport(s) | kind | element (path) | root cause | fix (rule) | status (fixed / intentional / needs app.js / open)`.
3. **Proposed app.js edits** (exact old/new snippets, function name, reason), if any.
4. **Cross-cutting fixes** you made that other tabs probably need.
5. **Residual issues** you could not fix and why.
6. **Final evidence**: the harness matrix rows for your tabs at all viewports (paste the table rows), and the paths of the screenshots you looked at last.

Be precise and terse. Paths, selectors, pixel numbers. No narration.
