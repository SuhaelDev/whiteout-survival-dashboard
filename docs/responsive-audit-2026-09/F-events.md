# F-events report: `svs`, `skins`, `sources`

Fix file: `.audit-work/fixes/F-events.css` (phone section -> mobile.css section 19; desktop section -> styles.css). Scratch: `.audit-work/F-events/`.

## 1. Summary

- Tabs: svs, skins, sources.
- Runs: Chromium `--interact basic` on all 22 viewports (run1 baseline; run3/run7/run9/run11 during the fix; run13 = final file); Chromium `--interact full` on m320/m390/mL844/t768/d1100/d1440 (run2 baseline, run6, run16 = final); `--nav` on m390 (phone shell) and t768/d1440 (desktop shell) (run5, run17 = final); WebKit on m320/m390/mL844 (run4/run8/run10/run12, run14 = final). Own scripts: `shots.mjs` (full-page + element captures at m320/m390/mL844/t768/d1440/d1920, base and fixed), `flows.mjs` (every SvS number input set to 1234567890, all three toggles flipped, all five beast-level options, scrollers to the end, More sheet, profile details, under-bar at the page bottom, tablet focus) at m320/m390/mL844/t768/d1440, `measure-tables.mjs` / `measure-skins.mjs` (table vs wrapper widths), `pixdiff.mjs` (desktop parity).
- Defects: 10 found (svs 6, skins 1, sources 2, plus the baseline's t600/d700 `H! W1 C1` which was the lead's global nav-strip bug, re-run clean), 9 fixed in CSS, 0 open. Residual: the shell's `#mProfileFacts` ellipsis (`e1` at m320/m360), intentional (see 5).
- Four of the fixes are cross-cutting primitives (see 4): `.troop-plan-controls` (grid + full-row select), the drawn checkbox inside `.compact-field`/`.field`, the drawn select chevron inside `.compact-field`/`.field`, the tablet drawn checkbox for `.svs-toggle`.
- No `src/app.js` edit needed. Note for the lead: the "city-skin image grid" named in the task does not exist in this build - `assets/game/city-skin-*.png` and `march-skin-*.png` are referenced by nothing in `src/`, `index.html` or `sw.js`; `renderSkins()` (app.js 8857) renders four metrics and two tables only.
- Desktop parity at >= 1101px: svs and skins pixel-identical at d1440 and d1920 (`pixdiff.mjs`: 0 differing pixels); sources identical except sub-pixel glyph anti-aliasing on the "Still to confirm" title rows (positions equal within 1/64 px, see finding 7) and the deliberate d1280 fix.

## 2. Findings

| # | tab | viewport(s) | kind | element (path) | root cause | fix (rule) | status |
|---|---|---|---|---|---|---|---|
| 1 | svs | m320 | `H!` docW 335, `V6`: 5 fields 15px past the edge + `nav#mTabs > button.mtab "More"` pushed 11px | `#tab-svs > .panel > .gd-select-row.troop-plan-controls > label.compact-field` ("Lucky Wheel spins", "Use hero shards", "Beast hunts", ...) | `.gd-select-row { grid-template-columns: 1fr 1fr }` (styles.css 5371) + `.troop-plan-controls .compact-field { min-width: 150px }` (6025): 150+10+150 = 310px in a 268px content box | `html[data-shell="mobile"] .troop-plan-controls { grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr)) }` + `... .compact-field { min-width: 0 }` -> 1 column at 320, 2 from 360, 3-5 on landscape | fixed |
| 2 | svs | every phone viewport (probe-blind, seen in shots) | invisible control: the three toggles render as blank 44px squares, no box, no tick | `#tab-svs label.compact-field.svs-toggle > input[type=checkbox]` x3 | `.compact-field input { background: rgba(15,23,42,.8) !important }` (styles.css 391-403) is a SHORTHAND: it resets background-image/-size/-position/-repeat, i.e. the drawn checkbox of mobile.css section 6 | `html[data-shell="mobile"] .compact-field input[type=checkbox], ... .field input[type=checkbox]` restate background-color/-image/-repeat/-position/-size with `!important` (+ `:checked`, `:active`), same SVGs as mobile.css | fixed (cross-cutting) |
| 3 | svs | every phone viewport (probe-blind, seen in shots) | select without dropdown affordance: "Beast level" is a bare box (computed `background-image: none`) | `#tab-svs label.compact-field > select` | same shorthand wipes the chevron mobile.css section 6 draws on `appearance: none` selects | `html[data-shell="mobile"] .compact-field select, ... .field select` restate the two-gradient chevron (`!important`) | fixed (cross-cutting) |
| 4 | svs | m320-m430 (seen in shots; probe-blind) | chips break mid-word: "Da / y 5" | `#tab-svs .compact-table td > span.coverage-chip` | mobile.css section 10 `.coverage-chip { white-space: normal; overflow-wrap: anywhere }` (meant for the coverage table) drops the column's min-content to one glyph under `table-layout: auto` | `html[data-shell="mobile"] #tab-svs .coverage-chip { white-space: nowrap; overflow-wrap: normal }` - chips stack per line; the table still fits (268 = 268 at m320, measured) | fixed |
| 5 | svs | t600, t768, t834, t1024, t1194 | `t3` 28x28 checkboxes | same three toggles | `@media (pointer: coarse)` block (styles.css ~7255) caps a native checkbox at 28px | `@media (pointer: coarse) html[data-shell="desktop"] .svs-toggle input[type=checkbox]`: `appearance: none`, 44x44, drawn 22px box (same SVGs), `background-*` with `!important` | fixed (also Troops' Mobilize / Capacity Boost) |
| 6 | skins | m320, m360, m375 (probe-blind: `W` only fires when the wrapper exceeds the viewport) | 4-column caps table 336px wide scrolls inside a 268 / 308 / 323px `.table-wrap` (by 68 / 28 / 13px) | `#tab-skins .table-wrap table` -> `td > div.skin-bar` | `.skin-bar { min-width: 120px }` (styles.css 6468) | `html[data-shell="mobile"] .skin-bar { min-width: 48px }` -> table 268/308/323 = wrapper (measured), bar 49-53px, still grows with the cell | fixed |
| 7 | sources | m320-m430, mL844 (`O2`); t768, t834, t1194 (`O2`); d900, d1280 (`O1`) | overlap 43x21 / 63x21: `span.status-pill` <-> `strong` title | `#tab-sources .grid-2 > .panel > ul.gap-list > li > span.status-pill` + `strong` | the pill is a 24px inline-flex box in an 18.2px line; when the bold title wraps, its second line runs back under the pill (strong.left 847.89 = li left at d1280) | both shells: `.gap-list li { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: baseline; column-gap: 6px (phone) / 0.275em (desktop = the 3.56px space it replaces) }` + `.gap-list li > .muted { grid-column: 1 / -1 }`. Desktop change at >= 1101 only when a title wraps (d1280: 2nd line now starts at x 895 under the first line's text instead of x 848 under the pill); a one-line title is unchanged (d1440: pill.right 998.97, strong.left 1002.53 -> 1002.55, strong.top 369.8 both) | fixed |
| 8 | sources | t600, t768, t834, t1024, t1194 | `t9` 17px-tall links | `ul.source-list > li > a` x9 | inline anchors; the desktop shell has no touch rule for them (the phone shell has mobile.css section 7) | `@media (pointer: coarse) html[data-shell="desktop"] .source-list a { display: flex; align-items: center; min-height: 44px }` | fixed |
| 9 | svs | m360-m430 (2-column plan rows; probe-blind: a select clips its own value internally) | "Beast level" select shows "Lv 26-30 · 12,000 p" (Chromium) / "Lv 26-30 · 12,000" (WebKit) - the value is cut inside the control | `#tab-svs .troop-plan-controls > label.compact-field > select` | the longest option needs ~145px of text + 12px + 28px padding; a ~150px auto-fit column leaves ~110px; a select cannot wrap | `html[data-shell="mobile"] .troop-plan-controls .compact-field:has(> select) { grid-column: 1 / -1 }` -> the select gets the whole row (available 232px at m320 ... 756px at mL844, measured, `diag-select3.mjs`); Troops' governor-buff select is the same primitive | fixed |
| 10 | svs, skins, sources (all tabs) | m320, m360 | `e1` | `.hero-band .mprofile > summary.mprofile__summary > span#mProfileFacts` "[B2D]Sorrow · FC9 · State 2476" | mobile.css section 5 `.mprofile__facts { white-space: nowrap; overflow: hidden; text-overflow: ellipsis }` | none - shell primitive, single-line summary of a `<details>` whose full content opens on tap (expand affordance) | intentional / shell |
| 11 | svs, skins, sources | t600, d700 (baseline only) | `H! W1 C1` | nav strip | lead's global <=720px nav-strip margin bug | fixed by the lead in styles.css; re-run clean in run3/run7/run9 | fixed (lead) |

Verified not defects: `.metric strong` with 10-digit inputs (fmt() compacts >= 1e6 to "17.8T"; metrics/cells unchanged in size, flows.mjs at m320); the SvS activity table and "What each prep day scores" table fit the wrapper at every phone width (measure-tables.mjs: table = wrapper at m320/m360/m390/m430/mL667); the sticky first column is opaque (lead's fix); nothing under the tab bar at the page bottom at m320/m390/mL844 (`underBar()` by -31/-40px on all three tabs); More sheet and profile details open cleanly (flows3, flows-webkit); no page errors in either engine.

## 3. Proposed `src/app.js` edits

None.

Proposed `src/styles.css` root fix (lead's call; makes findings 2, 3 and half of 5 unnecessary):

- function/site: styles.css 391-403, rule `.field input, .field select, .compact-field input, .compact-field select, textarea { ... }`
- old: `  background: rgba(15, 23, 42, 0.8) !important;`
- new: `  background-color: rgba(15, 23, 42, 0.8) !important;`
- why: the shorthand resets background-image/-size/-position/-repeat with `!important`, which deletes mobile.css section 6's drawn checkbox and select chevron (and any future background-image on a form control). No text input or select in either shell paints a background-image of its own, so the longhand renders identically everywhere else. My CSS-only restatements in F-events.css work without this change; with it they become redundant (keep or drop).

## 4. Cross-cutting fixes (promote)

1. `html[data-shell="mobile"] .troop-plan-controls { grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr)) }` + `.compact-field { min-width: 0 }` + `.compact-field:has(> select) { grid-column: 1 / -1 }` - the same `.gd-select-row.troop-plan-controls` rows are the Troops tab's plan controls (app.js 8383-8386): same 310px overflow at m320 there, and its governor-buff select is the same clipping candidate.
2. Drawn checkbox restated inside `.compact-field` / `.field` (finding 2) - also Troops "Mobilize" / "Capacity Boost" (app.js 8384-8385). Candidate for mobile.css section 6, right after the drawn-checkbox rules.
3. Drawn select chevron restated inside `.compact-field` / `.field` (finding 3) - every phone `<select>` inside a field label: Pets quality now/target (app.js 7074-7075), War Academy current/target (8081-8082), Troops governor buff (8383), SvS beast level (8691), T12 current/target (8805-8806). Candidate for mobile.css section 6.
4. Tablet (`pointer: coarse`, desktop shell) 44px drawn checkbox for `.svs-toggle` (finding 5) - Troops toggles too.
5. `.gap-list li` two-column grid (finding 7) is shared with the Overview and Planner coverage disclosures (app.js 3683, 3936: `<li><span class="status-pill">Check</span> text</li>`). There the bare text node becomes the second column, i.e. the same improvement (a wrapped line no longer runs under the pill). Verified no regression: `run15-gaplist-base` vs `run15-gaplist-fix` (overview, planner at m320/m390/mL844/t768/d1280/d1440, all `<details>` opened) have identical matrices and identical finding lists; `overview-gaplist-m390.png` shows the opened list.
6. Tooling, for every group running its own Playwright scripts on t-viewports: in Chromium a `page.screenshot({ fullPage: true })` on a `hasTouch: true, isMobile: false` context flips `(pointer: coarse)` to false and `(hover: hover)` to true for the rest of that page's life (verified in `.audit-work/F-events/diag-fullpage.mjs`: coarse=true -> viewport shot: still true -> fullPage shot: false, inputs 44px -> 34px; a fresh page or CDP `Emulation.setTouchEmulationEnabled` restores it). Every probe after a fullPage capture on the same page then reports false `f`/`t` findings and the coarse block's 44px controls are gone. The harness is unaffected (viewport shots only). Fix: probe before any fullPage capture, or capture from a fresh page (`shots.mjs` / `flows.mjs` do this now).

## 5. Residual issues

- `e1` on every tab at m320/m360: `#mProfileFacts` (shell, see finding 10). Owner: the shell / group A. If it must go, `html[data-shell="mobile"] .mprofile__facts { white-space: normal }` lets it wrap to two lines inside the 44px summary at 320px.
- The lead's coarse-pointer 28px checkbox stays 28px on every other tablet checkbox outside `.svs-toggle` (not in my tabs).

## 6. Final evidence

Chromium, all 22 viewports, `--interact basic`, `--extra-css .audit-work/fixes/F-events.css` (`.audit-work/F-events/run13-final/summary-chromium.md`, 2026-09-02T07:33Z, 0 shot-kind findings on the three tabs; the `e1` is finding 10):

| module | m320 | m360 | m375 | m390 | m412 | m430 | mL667 | mL844 | mL932 | t600 | t768 | t834 | t1024 | t1194 | d700 | d900 | d1100 | d1280 | d1366 | d1440 | d1920 | d2560 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| svs | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| skins | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| sources | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |

WebKit, `--extra-css`, m320/m390/mL844 (`.audit-work/F-events/run14-webkit-final/summary-webkit.md`, 0 shot-kind findings):

| module | m320 | m390 | mL844 |
|---|---|---|---|
| svs | e1 | ok | ok |
| skins | e1 | ok | ok |
| sources | e1 | ok | ok |

Chromium `--interact full` on the final file (`.audit-work/F-events/run16-full-final/summary-chromium.md`, 0 shot-kind findings in base / scrolled / expanded / after every input, check, select and button action):

| module | m320 | m390 | mL844 | t768 | d1100 | d1440 |
|---|---|---|---|---|---|---|
| svs | e1 | ok | ok | ok | ok | ok |
| skins | e1 | ok | ok | ok | ok | ok |
| sources | e1 | ok | ok | ok | ok | ok |

Chromium `--nav` on the final file (`.audit-work/F-events/run17-nav-final/summary-chromium.md`; phone shell via the tab bar / More sheet at m390, desktop shell via the nav strip at t768 and the sidebar at d1440):

| module | m390 | t768 | d1440 |
|---|---|---|---|
| svs | ok | ok | ok |
| skins | ok | ok | ok |
| sources | ok | ok | ok |

Own flows on the final file (`.audit-work/F-events/flows3.log`, Chromium m320/m390/mL844/t768/d1440; `flows-webkit.log`, WebKit m320/m390/mL844): every stage `ok` (svs base / after 8 inputs = 1234567890 / after 3 toggles / after 5 beast options / scrollers at end; skins and sources base / scrollers); `underBar()` never hidden (content ends 31-40px above the tab bar on all three tabs); More sheet and profile details open at m320 report only the shell `e1`; no page errors in either engine.

Baseline for comparison (`.audit-work/F-events/run1/summary-chromium.md`, before the fix): svs `H! V6 e1` m320, `t3` t600-t1194; skins clean; sources `O2` m320-m430, mL844, t768, t834, t1194, `O1` d900, d1280, `t9` t600-t1194.

Screenshots looked at last (all under `.audit-work/F-events/`; `shots-final/` is the finished file at m320/m390/mL844/t768/d1440/d1920):
- `shots-final/m320/svs.png`, `shots-final/m390/svs-el.png`, `diag-select3-m390.png`, `diag-select3-mL844.png` (final file)
- `shots-fix2/m320/svs.png`, `shots-fix2/m320/svs-el.png`, `shots-fix2/m320/skins.png`, `shots-fix2/m320/sources.png`
- `shots-fix2/m390/svs.png`, `shots-fix2/m390/sources.png`, `diag-select-fix-chromium.png`, `diag-select-fix-webkit.png`
- `shots-fix2/mL844/svs.png`, `shots-fix2/mL844/skins.png`, `shots-fix2/mL844/sources.png`
- `shots-fix2/t768/svs.png`, `shots-fix2/t768/svs-el.png`, `shots-fix2/t768/sources.png`
- `shots-fix2/d1440/svs.png`, `shots-fix2/d1440/sources.png` vs `shots-base/d1440/sources.png`; parity overlays `parity3/d1440-sources.png`, `parity2/d1440-skins.png` (0 diff), `parity2/d1920-svs.png` (0 diff)
- `flows2/m320/svs-bignumbers.png`, `flows2/m320/svs-toggles-off.png`, `flows2/t768/svs-last-input-focused.png`, `flows2/m320/sources-more-sheet.png`
- baseline: `.audit-work/baseline/shots/m320/svs-base-1-viewport-overflow.png`, `.audit-work/baseline/shots/m320/sources-base-1-overlap.png`, `.audit-work/baseline/shots/t768/sources-base-1-overlap.png`

## 7. WebKit cross-check of the whole app (report only, no fixes)

Run: `node scripts/responsive-audit.mjs --engine webkit --viewports m320,m390,m430,mL844 --interact basic --shots issues --max-shots 3 --out .audit-work/F-events/webkit-all` started 2026-09-02 15:17:39 local (07:17:40Z), finished 07:34:05Z; the same in Chromium into `.audit-work/F-events/chromium-all`, 07:34:06Z -> 07:39:49Z. Both against the live dev server as it was at that time (lead's merges only, no group fix files injected). Comparison script: `.audit-work/F-events/crosscheck.mjs`; full output with both matrices: `.audit-work/F-events/crosscheck.md`.

**Page / console errors:** none in either engine at any of the four viewports (`consoleErrors: []` everywhere; no stage errors; every `--nav`-less tab switch landed on the right tab in WebKit).

**WebKit-only issues (present in WebKit, absent in Chromium):**

| tab | vp | chromium | webkit | WebKit-only |
|---|---|---|---|---|
| charms | m390 | C1 T6 e2 x33 | C1 T6 e3 x33 | `truncated`: `div.chief-gear-slot-card.charm-troop-infantry > div.chief-gear-slot-card__info > strong` "Pants" - the clamp bites in WebKit's font metrics only |
| chief-gear | m390 | T6 e2 x13 | T6 e3 x13 | one more `truncated` in WebKit (same element family as above; same paths otherwise) |
| research | mL844 | e2 x24 | e3 x24 | one more `truncated` in WebKit; no new element paths |

**Chromium-only (WebKit is cleaner; for routing, not action):** every `H!` tab at m320 reports exactly one fewer `V` in WebKit (charms V13->V12, pets V16->V15, experts V11->V10, research V10->V9, t12-research V58->V57, troops V3->V2, svs V6->V5): the missing element is `nav#mTabs.mtabs > button.mtab "More"`, which Chromium reports 11px past the viewport when the document is wider than 320px and WebKit does not (fixed-position box vs. an overflowing document). It is a symptom of each tab's own `H!`, not a WebKit defect. hero-gear mL844 O5->O4 and sources m430/mL844 O2->O1: one wrap-dependent overlap fewer in WebKit (a title that wraps in Chromium fits in WebKit's font metrics).

**Identical in both engines:** overview, planner, inventory, buildings, heroes, pets (except the V offset), skins, sheet, profile, wizard.

Matrices (chromium / webkit), m320 | m390 | m430 | mL844:

| module | chromium | webkit |
|---|---|---|
| overview | O2 e1 / O2 / O1 / O1 | O2 e1 / O2 / O1 / O1 |
| planner | e1 / ok / ok / ok | e1 / ok / ok / ok |
| inventory | e1 / ok / ok / ok | e1 / ok / ok / ok |
| buildings | e1 x2 / x2 / x2 / x2 | e1 x2 / x2 / x2 / x2 |
| chief-gear | C4 e1 x13 / T6 e2 x13 / x13 / x4 | C4 e1 x13 / T6 e3 x13 / x13 / x4 |
| charms | H! V13 C10 O1 e1 x33 / C1 T6 e2 x33 / x33 / x24 | H! V12 C10 O1 e1 x33 / C1 T6 e3 x33 / x33 / x24 |
| heroes | e1 / ok / ok / ok | e1 / ok / ok / ok |
| hero-gear | O5 e2 x12 / O5 e10 x12 / O5 e6 x12 / O5 e9 x12 | O5 e2 x12 / O5 e10 x12 / O5 e6 x12 / O4 e9 x12 |
| pets | H! V16 O1 e2 x36 / x36 / x36 / x36 | H! V15 O1 e2 x36 / x36 / x36 / x36 |
| experts | H! V11 e7 x39 / e5 x39 / e5 x39 / e5 x30 | H! V10 e7 x39 / e5 x39 / e5 x39 / e5 x30 |
| research | H! V10 e2 x24 / e6 x24 / e6 x24 / e2 x24 | H! V9 e2 x24 / e6 x24 / e6 x24 / e3 x24 |
| t12-research | H! V58 e1 x114 / x114 / x114 / x114 | H! V57 e1 x114 / x114 / x114 / x114 |
| troops | H! V3 e1 / ok / ok / ok | H! V2 e1 / ok / ok / ok |
| svs | H! V6 e1 / ok / ok / ok | H! V5 e1 / ok / ok / ok |
| skins | e1 / ok / ok / ok | e1 / ok / ok / ok |
| sources | O2 e1 / O2 / O2 / O2 | O2 e1 / O2 / O1 / O1 |
| sheet | ok / ok / ok / ok | ok / ok / ok / ok |
| profile | e1 / ok / ok / ok | e1 / ok / ok / ok |

(svs `H! V6/V5` and sources `O2` in this table are findings 1 and 7 of this report, unfixed on the live server because F-events.css was not merged yet at run time.)
