# A-chrome report: Overview tab + app chrome

Fix file: `.audit-work/fixes/A-chrome.css` (phone section -> mobile.css, desktop section -> styles.css).
Scratch: `.audit-work/A-chrome/` (harness runs `base-all`, `full`, `webkit`, `fix1`, `fix2-*`, `edge1101`, `final-*`, `nav-*`; flow script `chrome-flows.mjs`, flow output under `flows/`).

## 1. Summary

- Covered: `overview`, `wizard` (3 steps, long values), `sheet` (More sheet + adopted sidebar: brand, grouped nav, `#saveStatus`, signed-out `#accountPanel` with email + 2 buttons + note via a stubbed `/api/config`, `<details class="sidebar-tools">`), `profile` (`.mprofile` + `.profile-grid`, long chief name / 10-digit state), hero band 320-2560px, `.mtoast` (offline/online/update/A2HS), `.mtabs` labels + `.mtopbar` title/status, `.skip-link`, sticky sidebar at >= 1101px incl. short windows (1101x520, 1280x600, 1366x650, 1440x700), flattened nav strip <= 1100px (16 chips, active chip, fade, brand row, save/account panel below content), `focusActiveNutshell()` on tablets.
- Engines / viewports: Chromium all 22 matrix viewports (`--interact basic`), `--interact full` on m320/m390/mL844/t768/d1100/d1440, WebKit m320/m390/mL844, `--nav` all 16 modules at m390 and t768, ad-hoc 1101x520d/1101x800d/1120x800d/1160x800d/1280x600d/1366x650d/1440x700d/1440x1080d/1600x1000d.
- Defects found 11 / fixed in CSS 9 / need JS 2 (CSS half in place) / documented residual 2. Desktop >= 1171px is pixel-identical with and without the fix file (canvas diff of the overview at d1280, d1366, d1440, d1920, d2560, 1440x1080, 1600x1000: 0 differing pixels); the two deliberate >= 1101px changes (1101-1150px profile grid, sidebar under 690px tall) are justified below.

## 2. Findings

| tab | viewport(s) | kind | element (path) | root cause | fix (rule) | status |
|---|---|---|---|---|---|---|
| overview | m320-m430, mL844 (Chromium + WebKit); t768, t834, d900; 1101x800, 1120x800 | O: "Guides"/"Designs" text under "63,420"/"51,660"; "Taming Manual"/"Strengthening Serum" under "15,710"/"2,010" | `div.panel > div.table-wrap.overview-cost-table > table > tbody > tr > td > div.cost-cell > div.cost-item > span.visual-label--compact > span` vs sibling `strong` | `.overview-cost-table .cost-item { grid-template-columns: minmax(72px, 1fr) auto }` resolves to `72px 37.8px` at the cell minimum, but the label needs 42px icon + 6px gap + one whole word (>= 81px); on phones mobile.css §10 `.cost-cell { minmax(0, 1fr) }` reports 0 min-content to the auto table layout, so the two cost columns are 82px at 320px; in the desktop shell `table-layout: fixed` shares ~105px per cost column at 768px and ~144px at 1101px | icon in its own 34px column, label over value beside it (`.visual-label--compact { display: contents }`, `.game-icon` row 1/span 2, text row 1, `strong` row 2 left-aligned); `.cost-cell { grid-template-columns: auto }` (phone) and `.cost-item { grid-template-columns: 34px auto }` so the cell reports its longest word; desktop `@media (max-width: 1170px)`: same + `table-layout: auto; min-width: 0` | fixed |
| overview | m320, m360 | e: `#mProfileFacts` "[B2D]Sorrow · FC9 · State 2476" ellipsised (50px / 10px over) | `details.mprofile > summary.mprofile__summary > span#mProfileFacts` | `white-space: nowrap; text-overflow: ellipsis` with ~150px left beside the "Chief profile" label | `.mprofile__facts { white-space: normal; overflow: visible; overflow-wrap: anywhere }` (row already min 44px) | fixed |
| sheet | every phone; tap failure at m320 + mL844 (Chromium and WebKit) | O/C: adopted `.module-nav` is `position: sticky; top: 0; z-index: 40` inside the scrolling sheet body, slides over `#saveStatus` / `#accountPanel` / "Data & reset" (at 320x568 and 844x390 the "Data & reset" summary could not be tapped: `elementFromPoint` = `div.nav-group`); its right column of buttons faded by the horizontal mask | `div.msheet__body > aside.sidebar > nav#moduleNav.module-nav` | styles.css `@media (max-width: 1100px) .module-nav { position: sticky; z-index: 40; box-shadow; mask-image }` (lines 3619 + 7310) is unscoped and reaches every phone; mobile.css §4 only resets display/grid/overflow/margin/padding | `html[data-shell="mobile"] .msheet__body .module-nav { position: static; z-index: auto; background: transparent; box-shadow: none; mask-image: none }` | fixed (flows `sheet-fixed-*`: reachable at all three viewports in both engines) |
| sheet | WebKit m320, mL844 | tap on `.msheet__scrim` does not close the sheet (touch tap fires pointerdown/up + touchstart/end, never `click`; a mouse click does close) | `div.msheet > div.msheet__scrim` | mobile.js closes the scrim only from a document-level `click` listener; a bare `div` is not "clickable" for touch-synthesised clicks | `.msheet__scrim { cursor: pointer }` (standard iOS opt-in; not enough in Playwright WebKit) + proposed mobile.js `pointerup` fallback (section 3, verified: closes at m320/mL844) | needs mobile.js |
| all tabs with `.table-disclosure` (planner x1, troops x3 at m320) | m320 | T: "Show" caption rendered "SHO / W" (21x31px) | `details.table-disclosure > summary::after` | `::after` is a flex item that inherits mobile.css §10 `.panel { overflow-wrap: anywhere }`, so once the summary text pushes on it its min-content collapses to one glyph | `.table-disclosure summary::after { flex: 0 0 auto; white-space: nowrap; overflow-wrap: normal }` -> 34x15px | fixed (cross-cutting) |
| chrome >= 1101 | 1280x600, 1366x650, 1101x520 (any window < ~690px tall) | C: with "Data & reset" open `.module-nav` is squeezed to 10px / 60px / 0px and at 1101x520 `.save-panel` overflows the `overflow: hidden` sidebar ("Reset everything" 52px below the window, unreachable) | `aside.sidebar > div.save-panel`, `nav.module-nav` | `.save-panel { flex: 0 0 auto }` never shrinks; only the nav shrinks (`min-height: 0`) | `@media (min-width: 1101px) and (max-height: 690px)`: `.module-nav { flex-shrink: 1000; min-height: 132px }`, `.save-panel { flex: 0 1 auto; min-height: 0; overflow-y: auto; padding-inline: 4px; margin-inline: -4px }` | fixed (nav >= 132px, panel scrolls, last button reachable at 600/650/520) |
| chrome >= 1101 | all windows <= 1090px tall | last nav row ("Sources") 12px inside the 22px bottom fade at scroll end | `nav.module-nav` mask | fade zone 22px vs 10px group margin | `@media (min-width: 1101px) and (max-height: 1090px) .module-nav::after { height: 12px }` | fixed (residual > 1090px tall, see 5) |
| chrome <= 1100 | t600, t768, t834, t1024, d700, d900, d1100 | "Sources" chip 20px inside the 36px right fade at scroll end | `nav.module-nav` mask | fade 36px vs 16px padding | `@media (max-width: 1100px) .module-nav::after { flex: 0 0 36px }` | fixed (`lastPxInFade` 20 -> 0 everywhere) |
| chrome <= 1100 | t600-d1100 (all 7 tabs with a nutshell) | after `#resetTargets` / `[data-reset-target]` / `[data-smart-apply]` the "In a nutshell" card is parked with its top at y=8, 52px under the 60px sticky strip | `section.upgrade-nutshell` | `focusActiveNutshell()` uses `window.scrollTo(top - 8)`, blind to sticky chrome | CSS `@media (max-width: 1100px) .upgrade-nutshell { scroll-margin-top: 68px }` + app.js `scrollIntoView` (section 3; verified simulated: hiddenBy 0 at t600/t768/t1024/d900/d1100, 10px on phones/desktop) | needs app.js |
| hero band | 1101-1122px wide (1101x520, 1101x800) | C: 6th `.profile-grid` field "Research %" cut by `.hero-band { overflow: hidden }` (5px past the viewport) | `section.hero-band > div.hero-content > div#profileInputs.profile-grid > div.field` | `repeat(6, minmax(130px, 1fr))` + 5x10px gaps = 830px > 809px content beside the 260px sidebar | `@media (min-width: 1101px) and (max-width: 1150px) .profile-grid { repeat(6, minmax(0, 1fr)) }` (126px fields at 1101px) | fixed (deliberate >= 1101px change) |
| overview / wizard / every tab | t600, d700 | H! W1 C1: `.module-nav` 12px past both edges | `nav.module-nav` | stale `@media (max-width: 720px) .module-nav { margin: 0 -12px }` after the sidebar became `display: contents` | fixed by the lead in src/styles.css | fixed (verified `ok`) |
| overview | m320 | cost table scrolls 19px inside `.table-wrap` (m360 and up fit) | `div.table-wrap.overview-cost-table` | 76 + 2 x 126px column minimums vs 270px | none | intentional (sticky opaque first column; 3 columns of icon + word cannot fit 270px without breaking words) |
| overview | t600, t768 with `--shots all` only | f6 t1 | `.profile-grid input`, `.sidebar-tools > summary` | harness artifact: after a full-page screenshot Chromium stops matching `(pointer: coarse)` (`coarse: false` in the scrolled/expanded stages), so the coarse-pointer block no longer applies; not reproducible with `--shots issues` | none | artifact |
| wizard | all 22 viewports + long values | none | card fits (scrolls at m320/mL844 with `overflow: auto`), footer one row, 16px fields on touch, labels intact | | | clean |
| toast | m320, m390, mL844, t768, d1440 | none | offline/online/update/A2HS toasts inside the viewport, 14px above the tab bar (bottom 497 vs tab bar 511 at m320), 2 lines at 320px, button never overlaps the text | | | clean |
| tab bar / top bar | all phones, Chromium + WebKit | none | "Inventory" 47px (WebKit 48px) in 62px buttons at 320px, no ellipsis; longest module titles and statuses fit the top bar | | | clean |
| profile | m320-mL844 | none | 2 x 142-404px fields, 44px/16px inputs; 55-char name + 10-digit state wrap in the summary (3-4 lines at 320px) | | | clean |
| skip-link | m320 | none | 125x38 at 0,0 on focus | | | clean |

## 3. Proposed source edits (CSS cannot do these)

### 3a. src/app.js `focusActiveNutshell()` (line ~8942) — scroll with `scrollIntoView` so `scroll-margin-top` clears the sticky strip

Old:
```js
  requestAnimationFrame(() => {
    const top = Math.max(0, nutshell.getBoundingClientRect().top + window.scrollY - 8);
    window.scrollTo({ top, behavior: "auto" });
  });
```
New:
```js
  requestAnimationFrame(() => {
    // scrollIntoView honours .upgrade-nutshell's scroll-margin-top, which
    // styles.css raises to 68px under 1100px where the module nav is a sticky
    // strip at the top of the window; window.scrollTo() cannot see sticky
    // chrome and parked the card 52px underneath it on tablets.
    nutshell.scrollIntoView({ block: "start", behavior: "auto" });
  });
```
Why: every trigger (`#resetTargets`, `[data-reset-target]`, `[data-smart-apply]`, cloud load, extract refresh) hid 52px of the card under the strip at every <= 1100px width. The CSS half (`scroll-margin-top: 68px` at <= 1100px, desktop shell) is in the fix file; base `scroll-margin-top: 10px` (styles.css 1052) keeps phones and >= 1101px within 2px of today.

### 3b. src/mobile.js `bindChrome()` — close the sheet on a touch/pen `pointerup` on the scrim

Old:
```js
  bindSheetDrag();
}
```
New:
```js
  bindSheetDrag();

  // iOS Safari only synthesises a click for a tap on something it considers
  // clickable; the scrim is a bare div, so a tap outside the sheet reached the
  // document click handler above only on some engines (Playwright WebKit: a
  // scrim tap fires pointerup/touchend and never click). Close on the pointer
  // gesture itself; the mouse keeps the click path so a drag that ends on the
  // scrim does not dismiss the sheet.
  sheet.querySelector("[data-msheet-close]").addEventListener("pointerup", (event) => {
    if (event.pointerType === "mouse") return;
    closeSheet();
  });
}
```
Why: verified in WebKit at m320 and mL844 (`.audit-work/A-chrome/debug-scrim3.mjs`): with the fallback the sheet closes on a scrim tap; Escape, the grab-handle drag and picking a module already closed it. `closeSheet()` is idempotent (`if (!sheetOpen) return`) so a double close from click + pointerup is harmless.

Sheet open/close/focus otherwise verified fine in both engines: opens from the tab bar and the top-bar menu, `aria-expanded` mirrors, `.app-shell` inert while open, focus lands on the active nav button, Escape closes and restores focus, picking a module closes it (lead's capture-phase listener), switches the module, syncs `?tab=`, scrolls to top; "More" carries the active state for unpinned modules.

## 4. Cross-cutting fixes other tabs need (promote to mobile.css / styles.css)

1. `html[data-shell="mobile"] .table-disclosure summary::after { flex: 0 0 auto; white-space: nowrap; overflow-wrap: normal }` — fixes "SHO / W" on planner ("Set materials aside...") and the three troops tier disclosures at m320; every `.table-disclosure` inside a `.panel` is exposed.
2. `html[data-shell="mobile"] .msheet__body .module-nav { position: static; z-index: auto; background: transparent; box-shadow: none; -webkit-mask-image: none; mask-image: none }` — mobile.css §4 must reset everything styles.css's unscoped `@media (max-width: 1100px)` blocks (lines 3619-3633 and 7271-7313) put on `.module-nav`; the same hazard applies to any future rule in those blocks (`.nav-button` is already overridden).
3. Pattern for other cost tables inside `.table-wrap` (hero-gear, planner): mobile.css §10 `.cost-cell { grid-template-columns: minmax(0, 1fr) }` zeroes the cell's min-content; inside a scroller it should be `auto` (`.table-wrap .cost-cell`) so the column keeps its longest word and the wrapper scrolls. Only applied to `.overview-cost-table` here.
4. Harness note: `--shots all` (full-page screenshots) flips `(pointer: coarse)` off in Chromium for the following stages, producing phantom `f`/`t` codes on touch tablets; use `--shots issues` for pass/fail runs.

## 5. Residual issues

1. Sidebar (>= 1101px) bottom fade over the last nav row at the scroll end is only fixed for windows <= 1090px tall. In a taller window the nav's grid rows are stretched to fill the sidebar and any trailing spacer re-spaces the groups (2560x1440 diffed 28,600 px with an unconditional rule); between 1090 and ~1224px tall the nav still scrolls only with the taller signed-out account panel, and there "Sources" keeps 12px under the fade. A scroll-driven mask (`animation-timeline: scroll(self)`) would fix it without JS.
2. Scrim tap closing the sheet on WebKit needs the mobile.js edit in 3b; CSS alone (`cursor: pointer`) did not change the Playwright WebKit result (real iOS may differ; the edit covers both).
3. `focusActiveNutshell()` needs the app.js edit in 3a; the CSS half is harmless on its own.
4. Overview cost table scrolls 19px at 320px (intentional, see findings). Keyboard-open state (`data-kb="open"`, tab bar slides out) and iOS safe-area insets are not testable in Playwright.
5. Not a defect but noted: `.profile-grid` at 900px renders 5 + 1 fields (fluid `auto-fit`); full-page screenshots draw the closed (off-screen) sheet in the middle of the page — a capture artifact of `position: fixed` + `translate3d(0, 100%, 0)`, not visible on a device.

## 6. Final evidence

Runs with `--extra-css .audit-work/fixes/A-chrome.css` (final file):

All 22 matrix viewports (`final-all`, Chromium, `--interact basic`):

| module | m320 | m360 | m375 | m390 | m412 | m430 | mL667 | mL844 | mL932 | t600 | t768 | t834 | t1024 | t1194 | d700 | d900 | d1100 | d1280 | d1366 | d1440 | d1920 | d2560 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| wizard | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| overview | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| sheet | ok | ok | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |
| profile | ok | ok | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |


WebKit (`final-webkit`, `--interact basic`):

| module | m320 | m390 | mL844 |
|---|---|---|---|
| wizard | ok | ok | ok |
| overview | ok | ok | ok |
| sheet | ok | ok | ok |
| profile | ok | ok | ok |

Edge and short windows (`final-edge`):

| module | 1101x520d | 1101x800d | 1120x800d | 1160x800d | 1280x600d | 1366x650d | 1440x700d |
|---|---|---|---|---|---|---|---|
| overview | ok | ok | ok | ok | ok | ok | ok |

`--interact full` (`final-full`): wizard/overview/sheet/profile `ok` at m320, m390, mL844, t768, d1100, d1440 (overview action "Coverage details" ok).

`--nav` (real taps, `nav-mobile` m390 and `nav-tablet` t768): all 16 modules `nav: ok` in both shells; sheet closes after picking a module.

Desktop parity (`parity.mjs`, canvas pixel diff with vs without the fix file, overview at rest and scrolled): d1280 0, d1366 0, d1440 0, d1920 0, d2560 0, 1440x1080 0, 1600x1000 0 differing pixels.

Flow evidence (`.audit-work/A-chrome/flows-fixed.log`, `flows-A/B/C.log` for the base): sheet "Data & reset" reachable (m320 lastBottom 531 <= 568; mL844 353 <= 390; WebKit same); sidebar short windows nav >= 132px + save panel scrollable, "Reset everything" reachable (1280x600: 582 <= 600; 1366x650: 632 <= 650; 1101x520: 502 <= 520); tablet strip `lastPxInFade` 0 at t600/t768/t1024/d700/d900/d1100; cost table no mid-word breaks, m320 scroll 19px, m360/m390/mL844/t768 fit.

Screenshots looked at last:
- `.audit-work/A-chrome/fullshots2/shots/m320/overview-base-full.png`, `.../m320/profile-open-full.png`, `.../m390/overview-base-full.png`, `.../mL844/overview-base-full.png`, `.../t768/overview-base-full.png`, `.../d900/overview-base-full.png`, `.../d1440/overview-base-full.png`
- `.audit-work/A-chrome/flows/cost-m320.png`, `cost-m320-scrolled.png`, `cost-m390.png`, `cost-t768.png`
- `.audit-work/A-chrome/flows/sheet-fixed-chromium/m320-sheet-open.png`, `m320-sheet-tools.png`, `m390-sheet-open.png`, `mL844-sheet-tools.png`; `sheet-fixed-webkit/m320-sheet-tools.png`
- `.audit-work/A-chrome/flows/sidebar-fixed2-chromium/1280x600d-sidebar-tools-open-panelend.png`, `1101x520d-sidebar-tools-open-panelend.png`
- `.audit-work/A-chrome/flows/tabletnav-fixed-chromium/t768-nav-end.png`, `t600-bottom-tools.png`
- `.audit-work/A-chrome/flows/toast-base-chromium/m320-toast-a2hs.png`, `mL844-toast-update.png`
- `.audit-work/A-chrome/flows/wizard-base-chromium/m320-wizard-step1.png`, `m320-wizard-step3-scrolled.png`, `mL844-wizard-step1.png`, `t600-wizard-step1.png`
- `.audit-work/A-chrome/flows/tabbar-base-chromium/m320-tabbar-zoom.png`, `tabbar-base-webkit/m320-tabbar-zoom.png`
- Base defects: `.audit-work/A-chrome/full/shots/m390/overview-base-1-overlap.png`, `.../m320/overview-base-2-overlap.png`, `.../t768/overview-base-1-overlap.png`, `.../mL844/overview-base-1-overlap.png`; `.audit-work/A-chrome/flows/sheet-base-chromium/m320-sheet-bottom.png` (sticky nav over the account panel), `m390-sheet-open.png` (faded second column); `.audit-work/A-chrome/edge1101/shots/1101x800d/overview-base-1-clipped-at-viewport.png`.
