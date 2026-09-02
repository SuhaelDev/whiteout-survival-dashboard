# C-chief report: buildings, chief-gear, charms

## 1. Summary

- Tabs: `buildings`, `chief-gear`, `charms`. Fix file: `.audit-work/fixes/C-chief.css` (10 rules, 2 sections, every rule scoped to one shell). Scratch: `.audit-work/C-chief/`.
- Runs (all against the live dev server, lead's global fixes included from run2 on):
  - `run1-basic` no fix, all 22 viewports, Chromium (current truth before my rules).
  - `run2-full-nofix` `--interact full` m320/m390/mL844/t768/d1100/d1440, no fix.
  - `run3-basic-fix`, `run4-m320-fix`, `run5-webkit-fix` intermediate.
  - `run6-basic-fix-all` all 22 viewports with the fix (final matrix below).
  - `run7-full-fix` `--interact full` on the six representative viewports with the fix.
  - `run8-webkit-final` WebKit m320/m390/mL844 with the fix.
  - `run9-nav` `--nav` m390 (phone shell, tab bar + More sheet) and d1440 (desktop shell).
  - `run10-buildings-desktop` / `run11-buildings-full` buildings at t600..d1100 after rule 10.
  - Own scripts: `flows.mjs` (every building incl. the 3 longest names, all 6 slot cards, all 18 charm chips, 6 socket nodes, 2 charm cards, current/target selects to next/first/max, bulk selects + Apply FC / Apply all / Apply all slots / Apply all charms / Apply Infantry / Lancer / Marksman, 10-digit input, every checkbox, sidebar scrolled, smart panel open + bias + Apply recommendation, all `<details>`; scroll-walk screenshots) at m320/m360/m390/mL844/t768/d1440/d1920; `measure.mjs` (mid-word breaks, table column widths, select value fit); `repro-e3.mjs`.
- Defects: 13 found in my scope (10 fixed in CSS, 1 fixed centrally by the lead, 1 needs app.js, 1 unreproduced) + 5 reviewed as intentional. Three of the fixes are cross-cutting primitives (section 4).
- Desktop >= 1101px: unchanged except two deliberate fixes justified by findings at those widths: 9px captions raised to 10px (rule 5, `x` codes at d1440/d1920/d2560) and nothing else. Rule 10 stops at 1100px; rule 4 at 900px.

## 2. Findings

| tab | viewport(s) | kind | element (path) | root cause | fix (rule in C-chief.css) | status |
|---|---|---|---|---|---|---|
| chief-gear, charms | m320-m412 | C4 / T6 / O1 / e7 | `.chief-gear-screen > .chief-gear-grid-container > .chief-gear-col-* > .chief-gear-slot-card > __info > span.tier-label(.tier-label--target)`, `.charm-chip-row > button.charm-chip`, `__info > strong` | two-column grid gives each card 111-170px; styles.css lays the card out as an 80px icon beside the text, so the text box was 15-41px wide: labels overflowed (T), the target pill / charm chips poked out of the card (clipped by `.chief-gear-screen{overflow:hidden}` at 320 = C, painted over the neighbour at 360-412 = O), slot names ellipsised "Wa..." (e); the doubled padding (screen 16px + grid 16px from the unscoped <=1000px block) and `.chief-gear-col-* {align-items:flex-end/start}` shrink-wrapped the cards | 1: vertical card at <=600px in the mobile shell, columns `align-items:stretch`, grid padding 0, icon 72px, `strong` wraps | fixed (run6: m320-m430 ok) |
| charms | m320 | H! V13 (docW 345), `.mtabs` "More" pushed 21px off-screen (harness sheet tap failed) | `section.chief-troop-card > .chief-troop-head / .charms-slots-layout / section.gd-section / .gd-cost-tiles` all 320px wide | `.charms-slots-layout { repeat(auto-fit, minmax(320px, 1fr)) }` (styles.css 4565) inside a ~270px card; the layout viewport then grew to 345px and the fixed tab bar with it | 2: `minmax(min(100%, 320px), 1fr)` | fixed (run6 m320 charms: e1 only; sheet ok) |
| chief-gear, charms | m320 | C `.chief-gear-grid-container` by 2-10px | same as above | rule 1 (`min-width:0; width:100%`) | fixed |
| buildings, chief-gear, charms | all 22 | x2 / x4-13 / x24-33 | `.gd-level-badge small` (9px "CURRENT/TARGET", styles 5306), `.charm-socket-node__sub` (9px, 4646), `.smart-card__route small` (9px, 900), `.upgrade-nutshell .stat-impact-values small` (9px in the <=720 block, 4006) | sub-10px captions | 3 (phone) and 5 (desktop, incl. >= 1101 deliberately) | fixed (no `x` anywhere in run6) |
| chief-gear, charms (+ every module with a smart panel) | t600, d700 (desktop shell <= ~760px) | O3 C3 | `summary.smart-panel__bar > .smart-panel__bar-main > .eyebrow` / `strong` vs `.smart-panel__bar-facts > .smart-pill` | `.smart-panel__bar-facts { flex: none }` (styles 668) + `.smart-panel__gain { white-space: nowrap }`: below ~760px the 550px facts no longer fit beside the title, `bar-main` shrank to ~20px, the pill painted over "Chief Gear Targets", the facts were clipped by `.smart-panel{overflow:hidden}` | 4: desktop shell <=900px, bar wraps (mirror of mobile.css section 10) | fixed (run6 t600/d700 ok) |
| chief-gear, charms (+ hero-gear, pets, experts, research) | all | O1/O2 | `li.smart-card > span.smart-card__rank` over `.smart-card__head strong` | absolutely positioned badge over a full-width nowrap title | lead: `.smart-card__head { padding-right: 30px }` in styles.css | fixed by lead (confirmed in run3+) |
| charms (+ every nutshell) | m320 | O1 | `.nutshell-material__head > .visual-label > span "Designs"` vs `strong "51,660"` | `.nutshell-material-grid { repeat(2, minmax(0,1fr)) }` in the <=720 block (styles 3976) = two ~128px tiles at 320 | 6: one column at <=359px (also `.nutshell-upgrade-strip`, whose START/TARGET `b` hyphen-wrapped "Legendary T4 (3-" / "Star)" in 103px) | fixed (run4/run6 m320) |
| chief-gear, charms (+ every inventory check / smart panel) | m320-m375 | mid-word breaks, probe-invisible: head "REQUIRE/D", names "Guid/es" "Desig/ns" "Amb/er", numbers "112,5/55", chips "covere/d exactly" | `.inventory-check > .coverage-table > .coverage-row > *` | mobile.css section 10 keeps four columns with `overflow-wrap:anywhere`; rows are 237px (320, inside the smart panel) to 292px (375) so the name column is 69-87px beside a 42px icon (measure.mjs: broken words at 320/360/375, clean from 390) | 7: <=389px two-line row (name spans line 1; required/have/status line 2), icon 30px | fixed (measure.mjs: 0 broken words at 320-390) |
| chief-gear | m320-m430 | select value cut inside the control ("Epic T1 (3-S") | `.chief-gear-dialog .gd-select-row select` | two side-by-side selects give 87-142px of text room; "Legendary T4 (3-Star)" is 164px at the 16px phone control size | 8: stack the two selects at <=600px | fixed (inner 222-292px >= 164). Residual: the longest option "Legendary T1 (1-Star Status: 1)" (233px) is still cut by 11px at 320 only |
| buildings | m320-m430 | `.table-wrap` scrolls sideways for a 3-column table (378px vs 268-378px) | `.panel > .table-wrap.compact-table > table` (Construction Buffs) | min-content 378px: 58px icon + unbreakable "Meat/Wood/Coal/Iron" in the subtitle (col 1 = 202px), nowrap "After speed %" pill (88), 72px number input (88) | 9: icon 40px, pill wraps, input 64px, subtitle may break inside its token | fixed from 360px (308/308, 323/323, 338/338); 320 still scrolls 39px inside `.table-wrap` (sticky opaque first column) |
| buildings | t768 (desktop shell 721-1100px: t768, t834, t1024, t1194, d900, d1100) | column collapse, probe-invisible: "Bas / e / con / stru / ctio / n" one syllable per line beside a 58px icon | same table | `.grid-2` is two columns in the <=1100 block, `.compact-table table { table-layout: fixed }` (styles 1943) splits 334px into three 111px columns, `td { overflow-wrap: break-word }` breaks every word | 10: desktop shell <=1100px `table-layout:auto` + the rule-9 trims (min-content 302px < 334px) | fixed (t768 walk: three real columns, whole words; run10/run11 codes unchanged) |
| buildings | d1100-d1440 (desktop >= 1101 too) | "Meat/Wood/Coal/Ir / on" mid-token break in the subtitle | `.compact-table td .visual-copy .muted` | "/" is not a line-break opportunity in Chromium; the fixed 188px column cannot hold the 118px token beside the icon | needs app.js (section 3) | open - needs app.js |
| buildings | t600, t768, t834, t1024, t1194 | t6 | `tr > td > input[type=checkbox]` (28x28) x6 | lead's `@media (pointer: coarse)` block: native checkbox kept at 28px, comment says "as large as it goes without redrawing the control the way the phone shell does" | none (lead's policy). Optional promotion: copy mobile.css section 6 checkbox drawing (44px transparent control, 22px drawn box) into that block | intentional |
| chief-gear, charms | t1024, t1194, d1100-d2560 | O1 | `#chiefGear3d canvas` / `#charms3d canvas` vs `span.hero3d-hint "Drag to rotate ..."` | one label over the three.js canvas, nothing else touches it | none | intentional (brief) |
| all | m320, m360 | e1 | `details.mprofile > summary > span#mProfileFacts` "[B2D]Sorrow · FC9 · State 2476" | lead's hero-band chrome, nowrap + ellipsis; tapping the summary expands the full profile | none (not my element) | intentional (expand affordance) |
| chief-gear | m320 | hyphen wrap "Legendary T4 (3-" / "Star)" in the 113px `.tier-label--target` pill | `.chief-gear-slot-card__info .tier-label--target` | legitimate break after "-"; fully inside the card; 360px+ fits on one line | none | accepted |
| buildings | t768-t1194 | 800px inner scroller | `.buildings-sidebar { max-height: 800px; overflow-y: auto }` | desktop behaviour kept on tablets; mobile.css already unscrolls it on phones; sidebar-scrolled step probes clean | none | intentional |
| chief-gear | m390 | e3 in `run7` after `select-9` / `select-10` (dialog current/target selects) | unknown | replaying the identical action list (`repro-e3.mjs`, same seed) is `ok` at every step; base/scrolled/expanded stages never show it; low severity | none | open - not reproduced |

## 3. Proposed app.js edit

`renderBuildings()`, line 4728. CSS cannot make Chromium break after "/" (it is not a break opportunity), so the subtitle token "Meat/Wood/Coal/Iron" either breaks mid-word ("Coal/Ir / on" at d1100-d1440, "Co / al/Iron" at t768 with rule 10) or forces a 118px min-content. Spaces around the slashes give real break opportunities and keep `esc()` happy (no markup).

Old:

```js
              <td>${visualLabel("construction", "Construction cost reduction %", "City skills (e.g. Zinman) cut Meat/Wood/Coal/Iron costs; FC and RFC are never discounted")}</td>
```

New:

```js
              <td>${visualLabel("construction", "Construction cost reduction %", "City skills (e.g. Zinman) cut Meat / Wood / Coal / Iron costs; FC and RFC are never discounted")}</td>
```

With this in place the `.visual-copy .muted { overflow-wrap: anywhere }` lines of rules 9 and 10 become unnecessary and can be dropped at merge time. (Line 8009, research tab, has the same token in a `.muted` span; other group's call.)

## 4. Cross-cutting fixes (promote)

- Rule 4 (desktop shell <= 900px): `.smart-panel__bar` wraps, `.smart-panel__bar-facts { flex: 1 1 auto; justify-content: flex-start; min-width: 0 }`, `.smart-panel__gain { white-space: normal }`. Every module with a smart panel had `O3` at t600/d700 in the baseline. Candidate for the <=900px block of styles.css.
- Rule 7 (mobile shell <= 389px): two-line `.coverage-row` (`grid-template-areas "name name name" "req have status"`, 30px icon). Every inventory check / smart-panel cost table breaks words mid-glyph at 320-375px today (worst inside the smart panel). Candidate for mobile.css section 10 (replace the four-column `.coverage-row` rule there below 390px).
- Rules 3 + 5: 9px captions -> 10px (`.gd-level-badge small`, `.charm-socket-node__sub`, `.smart-card__route small`, `.upgrade-nutshell .stat-impact-values small`). Removes every `x` code on my tabs at every viewport; the same elements produce most `x` counts on pets, research, hero-gear, experts.
- Rule 6 (mobile shell <= 359px): `.nutshell-material-grid` and `.nutshell-upgrade-strip` one column (the <=720px block forces two). Every module's nutshell.
- Observation for the lead: when any tab overflows sideways on a real phone (`H!`), the layout viewport widens and the fixed `.mtabs` grows with it, so the "More" tab lands partly off-screen (321-345px at m320 charms in run1/run2: the harness's own sheet tap timed out). Any remaining `H!` on another group's tab has this side effect.
- Optional (not applied): tablet checkboxes stay 28px (`t` on every table with checkboxes under the coarse-pointer block). If the lead wants 44px targets there, the mobile.css section 6 drawn-checkbox rules work unchanged under `html[data-shell="desktop"]` + `@media (pointer: coarse)`.

## 5. Residual issues

- Buildings buffs table at 320px still scrolls 39px inside `.table-wrap` (min-content 307px vs 268px). Fits from 360px. Sticky opaque first column, so acceptable per the brief; the app.js edit above shaves it further but does not close the gap at 320.
- "Meat/Wood/Coal/Iron" subtitle breaks inside the token at 721-1440px until the app.js edit lands (CSS mitigation only).
- Chief-gear dialog select at 320px: options longer than 222px ("Legendary T1 (1-Star Status: 1)", 233px) are cut by 11px in the closed control; the dropdown shows the full text.
- `.tier-label--target` hyphen wrap at 320px; `e3` at m390 after harness select actions not reproduced; `t6` tablet checkboxes and `O1` canvas hint are policy / intentional; `e1` is the lead's profile summary.

## 6. Final evidence

`run6-basic-fix-all` (Chromium, `--interact basic`, `--extra-css .audit-work/fixes/C-chief.css`, all 22 viewports):

| module | m320 | m360 | m375 | m390 | m412 | m430 | mL667 | mL844 | mL932 | t600 | t768 | t834 | t1024 | t1194 | d700 | d900 | d1100 | d1280 | d1366 | d1440 | d1920 | d2560 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| buildings | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | t6 | t6 | t6 | t6 | t6 | ok | ok | ok | ok | ok | ok | ok | ok |
| chief-gear | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | O1 | O1 | ok | ok | O1 | O1 | O1 | O1 | O1 | O1 |
| charms | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | O1 | O1 | ok | ok | O1 | O1 | O1 | O1 | O1 | O1 |
| sheet | ok | ok | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |
| profile | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |

(`e1` = lead's `.mprofile__facts`; `t6` = 28px native tablet checkboxes; `O1` = `.hero3d-hint` over the three.js canvas. Baseline `run1` for comparison: buildings `e1 x2 / t6 x2`, chief-gear `C4 O1 e1 x13` .. `O2 x4`, charms `H! V13 C10 O2 e1 x33` .. `O2 x24`.)

`run7-full-fix` (`--interact full`): buildings e1/ok/ok/t6/ok/ok, chief-gear e1/ok(select-9,10: e3)/ok/ok/O1/O1, charms e1/ok/ok/ok/O1/O1 at m320/m390/mL844/t768/d1100/d1440.
`run8-webkit-final` (WebKit): buildings e1/ok/ok, chief-gear e1/ok/ok, charms e1/ok/ok at m320/m390/mL844; sheet ok.
`run9-nav` (`--nav`): m390 all ok (sheet, profile ok); d1440 buildings ok, chief-gear O1, charms O1.
`run10-buildings-desktop` (basic, rule 10): t600/t768/t834/t1024/t1194 t6, d700/d900/d1100 ok. `run11-buildings-full`: t768 t6, d1100 ok.
`flows-fix2/summary.md`, `flows-fix3/summary.md`: every scripted step clean apart from t6 / O1 above; no errors.

Screenshots looked at last (all under `.audit-work/C-chief/`):
`flows-fix2/m320/{buildings,chief-gear,charms}-walk-01..16.png`, `flows-fix2/m390/{buildings,chief-gear}-walk-*.png`, `flows-fix2/mL844/chief-gear-walk-01..11.png`, `flows-fix2/t768/{buildings,chief-gear,charms}-walk-*.png` (buildings shows the pre-rule-10 collapse), `flows-fix3/t768/buildings-walk-03..05.png` (after rule 10), `flows-fix3/m360/{buildings-walk-06,07,chief-gear-walk-04,05,charms-walk-08..10}.png`, `flows-fix2/d1440/*-walk-*.png`, `flows-fix3/d1920/*-walk-*.png`, `run3-basic-fix/shots/m320/charms-base-1-overlap.png`, `run1-basic/shots/{m320,m360,m390,mL844,t600,t768}/*.png`.
