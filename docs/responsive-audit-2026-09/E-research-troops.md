# Group E - research, t12-research, troops

Fix file: `.audit-work/fixes/E-research-troops.css` (phone section + desktop section, every rule shell-scoped). Scratch: `.audit-work/E-research-troops/` (harness runs `run1-basic` .. `run6-basic-final`, flow script `flows.mjs`, visual walk `walk.mjs`, probes).

## 1. Summary

- Tabs: research, t12-research, troops. Chromium at all 22 matrix viewports (`--interact basic`, before and after), `--interact full` at m320/m390/mL844/t768/d1100/d1440, WebKit at m320/m390/mL844, `--nav` at m390/t768/d1440, own flow script (every select kind, 10-digit numbers, Train/Promote, all toggles, Apply recommendation, every disclosure) at m320/m390/mL844/t768/d1440, visual walk (viewport strips, targets selected, disclosures open) at m320/m390/mL844/t768/d1440/d1920 plus WebKit m320.
- Defects found: 20 distinct root causes (7 tab-specific, 8 cross-cutting primitives that other tabs share, 5 review-only e/x/t items). Fixed in CSS: 19. Needs app.js: 1 (hover text for the desktop smart-card title ellipsis; optional). Left/intentional: 3 (global profile summary ellipsis - not my tab; native `<select>` value clipping of the long Government Buff labels; desktop smart-card title ellipsis whose full text is on the node cards below).
- Final matrix (`run6-basic-final`): every viewport `ok` for all three tabs except `e1` at m320/m360 = the phone hero's `#mProfileFacts` ellipsis (global chrome, not mine) and `e1` at t768 research = the desktop smart-card title ellipsis (intentional, see residuals). WebKit m320/m390/mL844, `--interact full` and `--nav` show the same two `e1`s and nothing else.
- Desktop (>= 1101px) changes, all justified by findings at those widths: troops plan table `table-layout: auto` (overlaps at every width up to 2560), `.gd-level-badge small` / `.smart-card__route small` 9px -> 10px, `.regular-node__body strong` wraps instead of ellipsis (e21 at d1440), `.gd-time-row` wraps (duration split "54d / 4h" in 355px cards), `.research-node-card select` chevron restored.

## 2. Findings

| tab | viewport(s) | kind | element (path) | root cause | fix (rule) | status |
|---|---|---|---|---|---|---|
| research, t12-research | m320 | `H! V10` / `H! V58` | `.panel > .war-branch > .research-node-grid > .research-node-card` (x9), `#tab-t12-research .research-node-grid > .research-node-card` (x57), each 25px past the viewport, docW 345 | `.research-node-grid { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) }`: 320px track in a ~290px content box | phone: `minmax(min(320px, 100%), 1fr)`; same for `.regular-node-grid` (215px) | fixed |
| troops | m320 | `H! V3` | `.gd-select-row.troop-plan-controls > label.compact-field` "Training Capacity (base)" and `.svs-toggle` "Mobilize" 15px past the viewport (the 44px checkbox was off-screen) | `.gd-select-row { 1fr 1fr }` + `.troop-plan-controls .compact-field { min-width: 150px }` = 310px grid in a 290px panel | phone: `.troop-plan-controls { grid-template-columns: repeat(auto-fit, minmax(min(100%, 160px), 1fr)) }`, `.compact-field { min-width: 0 }` | fixed |
| troops | t600-d2560 (all desktop-shell widths) | `O6` .. `O1` | `table > tbody > tr > td > select` "Train new/Promote" <-> `strong` "Infantry/Lancer/Marksman" (33-46px), `select` "Tier 11" <-> `input` "1581" (12x44), `select` <-> `span.muted` | `.compact-table table { table-layout: fixed }` shares 9 columns equally (80px at t768, 122px at d1440) while `td select { min-width: 112px }` and the checkbox+icon+name cell need 128px / 158px; the 900px floor in styles.css does not help under fixed layout | desktop: `#tab-troops .compact-table table { table-layout: auto }` (scrolls inside `.table-wrap` below ~910px, fits from d1280) | fixed |
| troops | t600-t1194 (touch tablets) | `t5` | 5 x `input[type=checkbox]` 28x28 (`.troop-enable` x3, `.compact-field.svs-toggle` x2) | pointer-coarse block sizes native checkboxes at 28px | desktop + `@media (pointer: coarse)`: `#tab-troops input[type="checkbox"] { width/height/min-height: 40px }` (native control scales) | fixed |
| research | t600 | `O1` + word breaking | `.compact-table td > select` "Level 6" <-> `span.muted` "No target selected"; node name "Ass / ault / Tec / hni" | 5-column regular-research table, `table-layout: fixed`, 420px floor at <= 720px -> 84px columns for 112px selects; `overflow-wrap: break-word` chops the name | desktop `@media (max-width: 1100px)`: `#tab-research .compact-table table { table-layout: auto }` | fixed |
| research, t12-research | all | `x24` / `x114` | `.gd-level-badge > small` "CURRENT" / "TARGET" 9px (2 per card); `.smart-card__route > span > small` "NOW"/"AFTER" 9px (2 per smart card) | `.gd-level-badge small { font-size: 9px }`, `.smart-card__route small { font-size: 9px }` | both shells: 10px | fixed |
| research | phones, t600/d700 | `x6` after a target is set | `.nutshell-impact-grid .stat-impact-values > div > small` "Current"/"Target"/"Change" 9px | `@media (max-width: 720px) .upgrade-nutshell .stat-impact-values small { font-size: 9px }` (unscoped, lands on phones) | phone + desktop <= 720px: 10px | fixed (cross-cutting) |
| research | m320-mL844, t768 (e2-e12), d1440 (e21), d1920 (e13) | `e` | `.regular-node__body > strong` "Special Defensive Training VI", "Tool Enhancement VII" ... | `white-space: nowrap; text-overflow: ellipsis`; the `title` attr holds the tier, not the name - no way to read it | both shells: `white-space: normal; overflow: visible; text-overflow: clip` | fixed |
| research | m360-m430 | `e3` + `e3` | `.smart-card__head > div > strong` "Helios Lancer Fi..." (x3); `p.smart-card__impact` clamped mid-phrase (x3) | mobile.css `.smart-card-grid { minmax(140px, 1fr) }` still fits two 178px cards in a 366px phone | phone: `.smart-card-grid { minmax(0, 1fr) }` (2 columns from 700px), title/meta `white-space: normal`, `.smart-card p { -webkit-line-clamp: unset }` | fixed (cross-cutting) |
| research (all tabs with a smart panel) | all | `O1` 17x15 | `span.smart-card__rank` "1" <-> `strong` "Helios Lancer First Aid" | title column ran under the absolutely positioned rank badge | lead fixed centrally (`.smart-card__head { padding-right: 30px }`); confirmed gone in run2+ | fixed by lead |
| troops | m320-m430 (visual) | invisible control | `.troop-plan-controls > label.compact-field.svs-toggle > input[type=checkbox]` Mobilize / Capacity Boost: a faint 44px square, no box, no check mark (WebKit and Chromium) | mobile.css draws the 44px checkbox as a `background-image`; styles.css `.compact-field input { background: rgba(15,23,42,.8) !important }` shorthand wipes the image | phone: restate the two images + repeat/position/size with `!important` on `.compact-field input[type="checkbox"]` (+ `:checked`, `:active`) | fixed (cross-cutting: SvS toggles share it) |
| troops (all tabs with `.table-disclosure`) | m320-m390 (visual) | mid-word wrap | `.table-disclosure summary::after` "SHO / W", "HID / E" beside a two-line title | pseudo-element flex item under `.panel { overflow-wrap: anywhere }` shrinks to one glyph per line | phone: `summary::after { white-space: nowrap; flex: 0 0 auto }` | fixed (cross-cutting) |
| troops, research, t12-research (every tab with an inventory check) | m320-m430 (visual) | mid-word wrap | `.coverage-row--head > span` "REQUIR / ED", `.coverage-row__name` "Me / at", "Shard / s", "Coa / l" | 4-column `.coverage-row` (1.5fr/.85fr/.85fr/1.3fr) in a ~280px row cannot hold 10px-caps "REQUIRED" or icon+"Shards"; mobile.css `overflow-wrap: anywhere` then breaks mid-word | phone `@media (max-width: 480px)`: 3 columns, material spans the row, head "Material" hidden | fixed (cross-cutting) |
| troops | m320-m430 (visual) | usability | pinned `td:first-child` (checkbox + 58px icon + name = 198px) left 92px of a 290px scroller for the other 8 columns | `.troop-enable` row layout | phone: `.troop-enable .visual-label { flex-direction: column }` (name under the icon) -> ~125px pinned column | fixed |
| research, t12-research | m320 (visual), t768/d1440 (visual, 330-360px cards) | word-per-line / split number | `.gd-time-row` "Research time:" / "54d 4h" / "~ 78,000 min of research speedups" squeezed into three narrow columns, "54d / 4h" split | `.gd-time-row { display: flex; justify-content: center }` without wrap | both shells: `flex-wrap: wrap; row-gap: 2px`, `strong { white-space: nowrap }` | fixed |
| research, t12-research | all shells (visual) | missing affordance | `.research-node-card .compact-field select`: `appearance: none` and `background-image: none` - Current/Target selects are plain boxes | styles.css:5221 `background: #f6faff !important` shorthand beats the non-important chevron gradient at :5238 | desktop: gradient/position/size/repeat restated with `!important` on `.research-node-card select`; phone: same for `.research-node-card .compact-field select` (dark-ink chevron) | fixed (cross-cutting: `.pet-card select`, `.game-dialog select` have the same cause) |
| troops (all tabs with `.compact-field` selects) | phones (visual) | missing affordance | `[data-path="troop_plan.gov_buff"]` and every `.compact-field select`: mobile.css `appearance: none` + drawn chevron, image wiped by the same `.compact-field select { background: ... !important }` | as above | phone: mobile.css chevron restated with `!important` on `.compact-field select` | fixed (cross-cutting) |
| research | t768 (3-up smart cards ~230px) | `e1` | `.smart-card__head > div > strong` "Helios Marksman First Aid" | single-line desktop title, now 30px narrower after the lead's rank fix | none in CSS; full text is on the T11 node card below; app.js `title` attr proposed for hover | intentional / needs app.js (optional) |
| all three | m320, m360 | `e1` | `.hero-content > details.mprofile > summary > span#mProfileFacts` "[B2D]Sorrow · FC9 · State 2476" | phone hero chrome (mobile.js), single-line facts strip | not my tab; expandable `<details>` shows the profile | out of scope (global) |
| troops | phones (visual) | native clipping | `[data-path="troop_plan.gov_buff"]` closed control shows "Min. of Education (+50% Spd, +2" | option label longer than a 290px select; the open list shows the full label | none (native `<select>` behaviour); shorter labels would need app.js `TROOP_GOV_BUFFS` | intentional |

Tooling note (for anyone using their own Playwright scripts): a `fullPage: true` screenshot on the tablet contexts (`hasTouch: true, isMobile: false`) resets Playwright's `(pointer: coarse)` emulation; every probe after it reports the 13px / 34px desktop controls (`f18 t13` .. `f120 t115`). `probe-coarse.mjs` shows the media query and the 16px/44px controls survive every re-render when no such screenshot is taken, and the harness (viewport screenshots) never shows it. `flows.mjs` now captures viewports only.

## 3. Proposed app.js edits

1. `smartRecommendationCardHtml()` (~app.js:2994) - give the desktop single-line title a hover affordance for its ellipsis (CSS cannot add hover text; on phones the title now wraps).

   old:
   ```
      <div><strong>${esc(candidate.label)}</strong>${sub ? `<span>${esc(sub)}</span>` : ""}</div>
   ```
   new:
   ```
      <div><strong title="${esc(candidate.label)}">${esc(candidate.label)}</strong>${sub ? `<span>${esc(sub)}</span>` : ""}</div>
   ```

2. Optional, troops `TROOP_GOV_BUFFS` (~app.js:8322): the closed Government Buff select clips "Min. of Education (+50% Spd, +200 Cap)" / "Supreme Min. (+75% Spd, +300 Cap)" on phones (native behaviour, the open list is complete). Shorter labels such as `"Education Min. (+50% Spd, +200 cap)"` would fit a 320px phone; not required.

## 4. Cross-cutting fixes other tabs need (all in the PHONE section unless noted, flagged `CROSS-CUTTING` in the file)

- `.smart-card-grid` one column on portrait phones (two from 700px) + title/meta wrap + impact `p` unclamped - every smart recommendation panel (buildings, chief-gear, charms, pets, experts, research).
- `.compact-field input[type="checkbox"]` drawn box restored with `!important` - every `.compact-field.svs-toggle` checkbox on phones was invisible (SvS planner toggles, troops).
- `.compact-field select` chevron restored on phones (`!important`); `.research-node-card select` chevron restored in both shells - `.pet-card select` and `.game-dialog select` have the identical cause (styles.css:5221 shorthand) and need the same restatement.
- `.table-disclosure summary::after { white-space: nowrap; flex: 0 0 auto }` - "SHO W" / "HID E" on every disclosure on phones.
- `.coverage-row` stacked layout below 480px - every inventory check on portrait phones ("REQUIR ED", "Me at").
- `.upgrade-nutshell .stat-impact-values small` 10px (phone, and desktop <= 720px) - every nutshell with impact cards.
- `.gd-level-badge small` / `.smart-card__route small` 10px, `.gd-time-row` wrap - shared game-dialog primitives (pets, hero gear, chief gear use `gameLevelFlowHtml` / `.gd-time-row` too).
- Tablet 40px native checkbox rule is scoped to `#tab-troops`; the same `width/height: 40px` would lift the 28px `t` flags on every tab's checkboxes under `(pointer: coarse)`.

## 5. Residual issues

- `#mProfileFacts` ellipsis (m320/m360, all tabs): phone hero chrome, outside this group; the `<details>` opens the full profile.
- Desktop smart-card title ellipsis at t768 (3 cards of ~230px): intentional per the brief (single line, full text elsewhere); app.js edit 1 adds hover text.
- Native clipping of the long Government Buff labels inside the closed `<select>` on phones; app.js edit 2 if wanted.
- The troops reference tables (8 columns) and plan table (9 columns) scroll inside `.table-wrap` on phones and at t768 (plan table below ~910px); first column pinned and opaque - intentional per the brief.

## 6. Final evidence

Matrix rows (`run6-basic-final`, Chromium, `--interact basic`, `--extra-css .audit-work/fixes/E-research-troops.css`):

| module | m320 | m360 | m375 | m390 | m412 | m430 | mL667 | mL844 | mL932 | t600 | t768 | t834 | t1024 | t1194 | d700 | d900 | d1100 | d1280 | d1366 | d1440 | d1920 | d2560 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| research | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | ok | e1 | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| t12-research | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| troops | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |

(m320/m360 `e1` = `#mProfileFacts` in the phone hero; t768 research `e1` = desktop smart-card title, intentional. Baseline for comparison, `run1-basic` before any fix: research `H! V10 O1 e2 x24` at m320 and `O1 e21 x24` at d1440, t12-research `H! V58 e1 x114` at m320 and `x114` everywhere, troops `H! V3 e1` at m320 and `O6 t5` at t600-t1194 / `O6`..`O1` at d700-d2560.)

WebKit (`run4-webkit`, m320/m390/mL844): research `e1 | ok | ok`, t12-research `e1 | ok | ok`, troops `e1 | ok | ok` (the m320 `e1` is `#mProfileFacts`).
`--interact full` (`run3-full`, m320/m390/mL844/t768/d1100/d1440): research `e1 | ok | ok | e1 | ok | ok`, t12-research `e1 | ok | ok | ok | ok | ok`, troops `e1 | ok | ok | ok | ok | ok`.
`--nav` (`run5-nav`, m390/t768/d1440): research `ok | e1 | ok`, t12-research `ok | ok | ok`, troops `ok | ok | ok`.
Flow script (`flows-final/chromium-summary.md`, 90 probes across m320/m390/mL844/t768/d1440): all `ok` except the m320 `e1` (profile facts) and t768 research `e1` (smart-card title). Before the fixes (`flows-before`): m320 `H! V10` / `H! V58` / `H! V3` on every step, t768 troops `O6 t5`.

Screenshots looked at last (viewport strips, targets selected, disclosures open):
- `.audit-work/E-research-troops/walk-m320b/m320/troops-selected-02..05.png`, `t12-research-selected-02..05.png`; `walk/m320/research-selected-02..24.png`
- `.audit-work/E-research-troops/walk/m390/troops-selected-02..04.png`, `research-selected-04,05,14.png`
- `.audit-work/E-research-troops/walk/mL844/research-selected-02,05,07,18.png`, `troops-selected-02,03.png`
- `.audit-work/E-research-troops/walk/t768/research-selected-04..08.png`, `troops-selected-01..03.png`, `t12-research-selected-03.png`; `walk-timerow/t768/research-selected-06.png`
- `.audit-work/E-research-troops/walk/d1440/troops-selected-02.png`, `research-selected-02,04,06.png`; `walk-timerow/d1440/research-selected-06.png`
- `.audit-work/E-research-troops/walk/d1920/research-selected-04,05.png`, `t12-research-selected-03.png`
- WebKit: `.audit-work/E-research-troops/walk-webkit/m320/troops-selected-02..04.png`, `research-selected-07,22,23.png`
- Harness shots: `.audit-work/E-research-troops/run1-basic/shots/{m320,t600,t768,d1280}/…` (before), `run6-basic-final/shots/` (after; only the two `e1`s remain, no layout shots).
