# B-planner-inventory — responsive audit report

Fix file: `.audit-work/fixes/B-planner-inventory.css` (phone section → mobile.css §19, desktop section → styles.css).
Scratch: `.audit-work/B-planner-inventory/` (flow driver `flows.mjs`, runs `run1-*` = before, `fix1-*`/`fix2-*`/`fix3-*` = after).

## 1. Summary

- Tabs: `planner`, `inventory`.
- Runs, before the fix (current source incl. the lead's global fixes): Chromium `--interact basic` at all 22 viewports (`run1-basic`), `--interact full` at m320/m390/mL844/t768/d1100/d1440 (`run1-full`), WebKit basic at m320/m390/mL844 (`run1-webkit`), flow driver both tabs at m320/m390/mL844/t768/d1440/d1920 (`flows1-planner`, `flows2-inventory`).
- Runs, after the fix (`--extra-css .audit-work/fixes/B-planner-inventory.css`): Chromium basic at all 22 viewports (`fix2-basic-phones`, `fix2-basic-desk`), full at the 6 representative viewports (`fix2-full`), WebKit basic m320/m390/mL844 (`fix2-webkit`), `--nav` at m390/t768/d1440 (`fix3-nav`), flow driver: planner at m320/mL844/t768 Chromium (`fix1-planner`) and m320/mL844 WebKit (`fix3-planner-webkit`), inventory at m320/m390/mL844/t768/d1440/d1920 (`fix2-inventory`) and t768/t1024 (`fix3-inventory-tablet`).
- Defects: **12 found (planner 5, inventory 7), 11 fixed in CSS, 1 needs app.js (I7), 0 open.** One shared finding (hero-band profile summary ellipsis) is intentional and outside these tabs. Every probe code on both tabs after the fix is `ok` except that shared `e1` at m320/m360.
- Stale brief items: `renderPlanner()`/`renderInventory()` do not render `[data-smart-panel]`, `.inventory-check`, `.coverage-row`/`.coverage-chip` (those come from `smartRecommendationPanelHtml()` / `inventoryComparisonHtml()`, called only by chief-gear, charms, pets, hero-gear, experts, research, troops, t12) — nothing to verify on these tabs.
- Desktop ≥ 1101px: unchanged (no desktop-section rule applies above 1100px except the `pointer: coarse` checkbox rule, which only affects touch devices).

## 2. Findings

| # | tab | viewport(s) | kind | element (path) | root cause | fix (rule) | status |
|---|---|---|---|---|---|---|---|
| P1 | planner | m320–m430, mL667–mL932 | usability (scroller 1040/268 = 3.9 screens; rows ~285px; names cut at wrapper edge) | `#tab-planner .planner-list > div.table-wrap.planner-recommendations > table` | `.planner-recommendations table { min-width: 1040px }`, `td:nth-child(3) { width: 280px }`, `td:nth-child(4) { width: 190px }`, `.cost-cell` stacking 6 × 42px `.game-icon--sm` rows; pinned first column alone does not make a 6-column table usable | Phone section "recommendations table as cards": `table { display: block; min-width: 0 }`, `thead { display: none }`, `tbody { display: grid; repeat(auto-fill, minmax(min(100%, 340px), 1fr)) }`, `tr { display: grid }`, `td { display: block; position: static; width: auto; padding: 0 }`, `td:nth-child(2) { order: -1 }` (44px icon head), Area icon hidden + name as pill, `td:nth-child(n)::before` column labels, `.cost-cell { auto-fill minmax(150px) }`, 28px cost icons | fixed |
| P2 | planner | t600, d700, t768, t834, d900 (desktop shell ≤ 900) | usability (1040px table scrolls 1–2 screens, no pinned column, ~300px rows) | same | same | Desktop section, same rules under `@media (max-width: 900px) html[data-shell="desktop"]` → 1 card/row < ~700px, 2 cards/row above. 901–1100 keeps the table (scrolls ≤ 48px at t1024, fits from d1100) | fixed |
| P3 | planner | m320–m430 | text wrap mid-word (pseudo-element, not probe-visible): "SH / OW" | `#tab-planner .panel > details.table-disclosure > summary::after` ("Set materials aside (they will not be spent in any plan)") | `.table-disclosure summary` is `display: flex; justify-content: space-between`; the `::after` label has no `flex: none`/`nowrap`, so it shrinks to one word's width beside the long title | `html[data-shell="mobile"] .table-disclosure summary::after { flex: 0 0 auto; white-space: nowrap }` | fixed (cross-cutting) |
| P4 | planner | t600 (`e1`, 16px cut) — also any desktop-shell width whose line holds < ~117 chars | truncated (`-webkit-line-clamp: 2`, no way to read the rest) | `#tab-planner > div.toolbar > div > p` | `.toolbar p { display: -webkit-box; -webkit-line-clamp: 2 }` sized for ≥ 1101px; lead unclamped phones only | `@media (max-width: 1100px) html[data-shell="desktop"] .toolbar p { display: block; overflow: visible; -webkit-line-clamp: unset; max-width: none }` | fixed (cross-cutting) |
| P5 | planner | m320–m430 (cosmetic) | cost list indented ~40px under "Do this first" | `.planner-top__row > div.planner-top__cost` | `.planner-top__cost { justify-items: end }` right-aligns the grid items inside a block that has already wrapped under the description | `html[data-shell="mobile"] .planner-top__cost { justify-items: start }` + `@media (min-width: 700px)` restores `end` for landscape rows | fixed |
| I1 | inventory | m320–m430 | button label wrapped to 2 lines ("Got / it") | `#tab-inventory > details.panel.inv-diff > summary.inv-diff__bar > button.ghost` | `.inv-diff__bar { display: flex }`, title `flex: 1 1 auto`, button shrinks | `html[data-shell="mobile"] .inv-diff__bar > button { flex: 0 0 auto; white-space: nowrap }` | fixed |
| I2 | inventory | m320–m430 | 58px row icons left ~116px of a 266px wrapper for the numeric columns; every table scrolled | `#tab-inventory .table-wrap .visual-label .game-icon.game-icon--md` | `.game-icon { width: 58px }` (desktop size) inside phone tables | `html[data-shell="mobile"] #tab-inventory .table-wrap .game-icon--md { width: 40px; height: 40px; border-radius: 7px }` + `.visual-label { gap: 8px }` | fixed (candidate for every module's tables) |
| I3 | inventory | m320–m430 | header cell broke into 3 lines ("Last / game / read") | `#tab-inventory .table-wrap th` | auto table layout wraps headers at every word | `html[data-shell="mobile"] #tab-inventory .table-wrap th { white-space: nowrap }` (costs ~30px of sideways scroll on the 4-column editable tables, header row back to one line) | fixed |
| I4 | inventory | m320–mL932 (`t1` after any edit, `run1-full` actions input-10..check-13) | small target 36px | `tr[data-inv-key] > td.inv-captured > button.inv-reset` | mobile.css §7 sets `.inv-reset { min-height: 36px }`, under the 40px floor | `html[data-shell="mobile"] .inv-reset { min-height: 40px }` | fixed |
| I5 | inventory | t600, t768, t834, t1024, t1194 (`t62`) | 62 small targets 28×28 | `div.table-wrap.compact-table > table > tbody > tr > td.inv-cell > input[type=checkbox]` (Heroes You Own / Not Owned) | styles.css `pointer: coarse` block stops at 28px because a native checkbox ignores padding | `@media (pointer: coarse) html[data-shell="desktop"] #tab-inventory td input[type="checkbox"]` drawn the phone-shell way: `appearance: none`, 44×44, SVG box 22px, `:checked` variant | fixed (cross-cutting candidate) |
| I6 | inventory | t768, t834, t1024, t1194 (761–1100 desktop shell; not probe-visible: sticky vs sticky) | search field hidden under the sticky nav strip once the page scrolls; only the chip row peeks out | `#tab-inventory > div.panel.extract-controls` (`position: sticky; top: 8px; z-index: 4`) vs `nav#moduleNav.module-nav` (`sticky; top: 0; z-index: 40`, ~60px) | the ≤ 760px block makes the bar static but the flattened-sidebar nav strip exists up to 1100px | `@media (max-width: 1100px) html[data-shell="desktop"] .extract-controls { position: static }` | fixed |
| I7 | inventory | m320–m430 (cosmetic) | label wraps with a lone "·" line ("Bradley / · / Goggles") | `[data-extract-section="prog-hero-gear"] td:first-child .visual-copy strong` | label text `${hero.name} · ${piece}` wraps at the spaces around the dot; `white-space: nowrap` would widen the pinned column to ~190px of 266 | app.js: non-breaking space before the dot (see §3) | needs app.js |
| N1 | both (and every tab) | m320, m360 (`e1`); any width after a long chief name | truncated (single-line summary, ellipsis) | `section.hero-band > .hero-content > details.mprofile > summary > span#mProfileFacts.mprofile__facts` | mobile.css §5 `.mprofile__facts { white-space: nowrap; text-overflow: ellipsis }` — the collapsed profile summary; full values are in the opened `<details>` | none (intentional, phone chrome, not these tabs) | intentional |

Verified and clean (no rule needed): sticky first column opaque on every inventory table scrolled 160px and to the end (`fix2-inventory` states 15–22, Chromium + WebKit); coverage banner / gap list / `SHOW`-`HIDE` labels; planner tabs and chips wrapping; `.summary-grid` 2×2; reservation inputs (typed 1234567890 → full re-render clean); `#runAdvisor` (dev server answers `{}` → "Advisor updated"); advisor `pre.llm-brief` and `.grid-2` "What we counted" / "Advisor Brief" single column on portrait phones, two columns from 700px; `.extract-controls` static on phones; category chips, search + clear, expand/collapse all; typing 10 digits / a 70-char name into cells (fineprint `= 1.23B`, revert button appears, cell width unchanged); hero checkbox toggle; `.inv-reset` click; building select change; diff dismissal re-render; nothing under the phone tab bar (`underBar` clean at every state); More sheet and profile pseudo-tabs `ok`.

## 3. Proposed app.js edits

**I7 — `inventoryProgressSections()` → `heroGearRow` (src/app.js line 4160).** CSS cannot stop a wrap at the "·" without `white-space: nowrap` on the whole label, which would grow the pinned first column to ~190px of a 266px phone wrapper.

Old:
```js
      <td>${visualLabel("gear", `${hero.name} · ${heroGearPieceName(slot, piece)}`)}</td>
```
New:
```js
      <td>${visualLabel("gear", `${hero.name}\u00a0· ${heroGearPieceName(slot, piece)}`)}</td>
```
Effect: `\u00a0` is a literal U+00A0 in the template string, so "Bradley ·" stays on one line, the piece name wraps under it. `esc()` passes U+00A0 through unchanged.

No other markup change needed; every other fix is CSS-only.

## 4. Cross-cutting fixes (promote to the shared sections)

1. `html[data-shell="mobile"] .table-disclosure summary::after { flex: 0 0 auto; white-space: nowrap }` — `.table-disclosure` is rendered by 8 call sites (planner ×2, current-editor disclosures, hero gear ×3, troops); any long summary title reproduces "SH / OW".
2. `@media (max-width: 1100px) html[data-shell="desktop"] .toolbar p { … unclamp … }` — every module has the clamped intro; t600 cut the planner copy, longer intros clamp at t768 too.
3. Drawn 44px `td input[type="checkbox"]` for `@media (pointer: coarse) html[data-shell="desktop"]` — scoped `#tab-inventory` here; the same 28px checkboxes are in Heroes (`t62` at t768 in the baseline), Buildings construction buffs (app.js 4522/4747) and Troops (8334). Drop the `#tab-inventory` scope to promote.
4. `html[data-shell="mobile"] #tab-inventory .table-wrap .game-icon--md { 40px }` — every module table uses the 58px `visualLabel()` icon; on a phone it is the single biggest reason 3–4 column tables scroll. Candidate: `html[data-shell="mobile"] .table-wrap .game-icon--md`.
5. `.extract-controls` static ≤ 1100px — the only in-content sticky panel in styles.css (`grep "position: sticky"`: `.sidebar`, `th`, `.module-nav`, `.extract-controls`), so no other tab has the sticky-under-nav case; noted for anyone adding one.

## 5. Residual issues

- N1 (hero-band `#mProfileFacts` ellipsis) — outside these tabs; the phone chrome's one-line summary with the full text one tap away (lead's call).
- Inventory editable tables still scroll sideways on portrait phones (post-fix `scrollWidth/clientWidth`, `fix2-basic-phones`): m320 — capture diff 310/266, materials 418–429/266, hero rows 489–496/266, hero gear 423–454/266, reference 284–349/266; m390 — 349–496/336; mL844 and every tablet/desktop width — nothing scrolls. Cause: 4–5 columns with two `min-width: 88px` inputs (+ a 44px checkbox) cannot fit 266px; a per-row card layout would need column labels that differ per section (Item/You have/Last game read/Set aside vs Hero/Owned/Level/Stars/Widget vs Piece/Mastery/Enhancement/Power …), which CSS cannot generate from `<thead>`. Intentional scroller per the brief: wrapper inside the viewport, pinned first column opaque (`S` never flagged), each section's rows read left to right.
- Native `<select>` text clipped inside the 112px control on ≤ 430px phones ("Legend…" in Chief Gear, "Intimat…" in Experts): the control's own rendering, the open list shows the full option text; widening the select only adds sideways scroll.
- I7 until the app.js edit lands.
- Not changed on purpose: the desktop (≥ 1101px) recommendations table (rows ~290px tall from the stacked cost list) — desktop parity rule.

## 6. Final evidence

Harness matrix rows with `--extra-css .audit-work/fixes/B-planner-inventory.css` (Chromium unless noted; `e1` = N1 hero-band ellipsis):

`fix2-basic-phones` / `fix2-basic-desk` (`--interact basic`, all 22 viewports):

| module | m320 | m360 | m375 | m390 | m412 | m430 | mL667 | mL844 | mL932 |
|---|---|---|---|---|---|---|---|---|---|
| planner | e1 | e1 | ok | ok | ok | ok | ok | ok | ok |
| inventory | e1 | e1 | ok | ok | ok | ok | ok | ok | ok |
| sheet | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| profile | e1 | e1 | ok | ok | ok | ok | ok | ok | ok |

| module | t600 | t768 | t834 | t1024 | t1194 | d700 | d900 | d1100 | d1280 | d1366 | d1440 | d1920 | d2560 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| planner | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| inventory | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |

`fix2-full` (`--interact full`, 13 planner + 14 inventory actions per viewport, every action `ok` except the shared `e1` at m320):

| module | m320 | m390 | mL844 | t768 | d1100 | d1440 |
|---|---|---|---|---|---|---|
| planner | e1 | ok | ok | ok | ok | ok |
| inventory | e1 | ok | ok | ok | ok | ok |

`fix2-webkit` (`--engine webkit`, basic):

| module | m320 | m390 | mL844 |
|---|---|---|---|
| planner | e1 | ok | ok |
| inventory | e1 | ok | ok |
| sheet | ok | ok | ok |

`fix3-nav` (`--nav`, real taps: tab bar / More sheet at m390, nav chips at t768 and d1440; `nav: ok` and `activeTab` correct for both tabs at all three):

| module | m390 | t768 | d1440 |
|---|---|---|---|
| planner | ok | ok | ok |
| inventory | ok | ok | ok |

Before, for comparison (`run1-basic`, same source without the fix file): planner `e1` at t600, inventory `t62` at t600/t768/t834/t1024/t1194; `run1-full` inventory `t1` after every edit action at m320/m390/mL844; the remaining defects (P1–P3, P5, I1–I3, I6, I7) are not probe-visible and were found in the screenshots.

Flow-driver results after the fix (`flows.mjs`, every state probed): planner 14 states × m320/mL844/t768 (Chromium) and m320/mL844 (WebKit) — all `ok` except `e1` at m320; inventory 23 states × m320/m390/mL844/t768/d1440/d1920 + t768/t1024 — all `ok` except `e1` at m320 and `e1` at m390 after the long chief name (N1).

Screenshots looked at last (all under `.audit-work/B-planner-inventory/`):
- `fix1-planner/m320/01-base-collapsed-walk03..06,09,12.png`, `04-view-best-value-45-view.png`, `06-view-unconfirmed-18-view.png`, `12-show-all-rows-view.png` — cards at 320px incl. a "Gap" card with its shortfall list, the one-line "HIDE" label, the left-aligned "Do this first" cost.
- `fix1-planner/mL844/01-base-collapsed-walk04..06.png` — two cards per row, cost lines in two columns, landscape.
- `fix1-planner/t768/01-base-collapsed-walk02..03.png` — desktop-shell cards on a portrait iPad.
- `fix3-planner-webkit/m320/01-base-collapsed-walk03..04.png` — WebKit rendering of the cards.
- `fix2-inventory/m320/01-base-walk02..03.png`, `02-expand-all-sec-mat-main-1.png`, `02-expand-all-sec-ros-heroes-1.png`, `02-expand-all-sec-prog-hero-gear-1.png`, `02-expand-all-sec-ref-backpack-1.png`, `09-typed-10-digits-into-meat-view.png` — 40px icons, one-line headers, revert button, fineprint.
- `flows2-inventory/m320/*` (pre-fix, every section and interaction state) and `flows2-inventory/t768/02-expand-all-sec-mat-main-1.png` (the sticky-under-nav defect), `fix3-inventory-tablet/t768/02-page-scrolled-900-view.png` (fixed).
- `flows1-planner/{m320,mL844,t768,d1440,d1920}/01-base-collapsed-walk*.png` (pre-fix walks; d1440/d1920 unchanged by the fix).
