# D-heroes report: heroes, hero-gear, pets, experts

Fix file: `.audit-work/fixes/D-heroes.css` (phone shell + desktop shell sections). Scratch: `.audit-work/D-heroes/` (harness runs `run0-*` = before, `run1-*` = intermediate, `run2-*` = after; `flows*.mjs` = tab-specific Playwright flows; `measure*.mjs` = geometry probes; `measure0.log` = numbers quoted below).

## 1. Summary

- Tabs: heroes, hero-gear, pets, experts. Harness: Chromium `--interact basic` on all 22 viewports, `--interact full` on m320/m390/mL844/t768/d1100/d1440, `--nav` once per shell, WebKit on m320/m390/mL844. Own flows (`flows.mjs`: pick heroes, strip scrolled to the end, all four gear selects, bulk targets, pet level/quality/attempts, expert relationship + skill selects, bulk apply, every disclosure, every wide table scrolled, under-bar check) at m320/m390/mL844/t768/d1440, plus d1920.
- Findings table: 24 rows. Fixed in CSS: 14 (plus the `.mtabs`/sheet overflow that the pet-card-grid fix clears), 7 of them cross-cutting primitives. Intentional: 3 (tile badges, two designed wide-table scrollers). Probe artifacts: 2 (wrapped inline `<strong>` runs). Needs app.js: 1 (desktop smart-card subtitle hover `title`). Lead's, not mine: 2 (phone-chrome `#mProfileFacts` e1; `.smart-card__rank`, fixed centrally). Residual: 1 (d1100, one 121px option label 5px wider than its 12px select). Also reviewed and left: desktop 9px captions (parity), `.pet-rarity-badge` / pet-card `.gd-time-row` contrast (colour, out of scope).
- Root causes, in order of impact: `.pet-card-grid` 320px track floor (pets/experts page-wide overflow at 320px), 16px touch font inside desktop-sized select tracks (experts), nutshell material head that cannot shrink below its longest word, narrow `.hero-field-groups` split at 236px cards (tablets and d1280), 28px native checkboxes on touch tablets, smart-card grid packed 2-5 to a row on phones, line clamps sized for 720px lines, smart-panel bar facts `flex: none` at <= 720px, strip end fade over the last portrait.

## 2. Findings

| tab | viewport(s) | kind | element (path) | root cause | fix (rule) | status |
|---|---|---|---|---|---|---|
| pets, experts | m320 | H! V16 / V11 (+ V "More" tab, sheet W1) | `#tab-pets > .pet-card-grid > .pet-card` (x15), `#tab-experts > .pet-card-grid > .pet-card.expert-card` (x10) | `.pet-card-grid { repeat(auto-fill, minmax(320px, 1fr)) }` resolves to a 320px track in a 296px content box; cards 320px, docW 332; the layout viewport grows to 332 so the fixed `.mtabs` and the More sheet follow | phone: `.pet-card-grid { grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr)) }` | fixed |
| experts | m320-mL932, t600-t1194 | value clipped in `select` (not probed) | `.expert-card .gd-select-row select` (Current/Target relationship) | 16px touch font: "100.1 · Intimate" 118px, longest option "10.1 · Acquaintance 1" 161px; half-width select leaves 101 (m320) / 109 (m360) / 124 (m390, t768) / 143 (mL844) / 104 (t1024) px inside its 28px chevron padding | phone + desktop@pointer:coarse: `.expert-card .gd-select-row { grid-template-columns: minmax(0, 1fr) }` | fixed |
| experts | m320-mL932, t600-t1194 | value clipped "Lv. 1(" (not probed), no left padding | `.expert-skill-controls > select.expert-skill-current`, `.expert-skill-target select` | `.expert-skill-controls { grid-template-columns: 70px 42px 12px 70px }`, `.expert-skill-current { max-width: 84px }`, padding-left 0: 40px inside for 42px of "Lv. 10" at 16px | phone: controls take the whole row (`flex: 1 1 100%`, `minmax(0,1fr) auto auto minmax(0,1fr)`, `max-width: none`, `padding-left: 8px`); touch tablets: `92px 42px 12px 92px` | fixed |
| pets | m320-m430, t768 (and experts after a skill plan: "Learning Speedups" 2,700) | O1 | `.upgrade-nutshell > .nutshell-material-grid > .nutshell-material > .nutshell-material__head > .visual-label > span` "Energizing Potion"/"Strengthening Serum" <> `strong` "3,175"/"2,010" | styles.css ~3976 (<= 600px block) `.nutshell-material-grid { repeat(2, minmax(0,1fr)) }` -> two 133px columns at 320px; at 768px four 173px columns; the head is a space-between flex row whose label cannot shrink below its longest word, so the value paints over it | phone: one column in portrait (`minmax(0,1fr)`), auto-fit 160px in landscape; head `flex-wrap: wrap` + `> strong { margin-left: auto }`; desktop <= 1100px: same head wrap | fixed (cross-cutting) |
| hero-gear, pets, experts | m360-mL932 | e2-e9 | `.smart-card-grid > .smart-card > .smart-card__head > div > strong/span` ("Hector · Goggles" by 2px, "Mastery Forging · Infantry Set 2" by 60px, "Icefire Hunter, Valorous Cold, ..." by 258px) | mobile.css section 10 `.smart-card-grid { repeat(auto-fit, minmax(140px, 1fr)) }` packs 2 cards in 306px and 5 in 790px (149-158px cards); title/subtitle are nowrap ellipsis with no hover | phone: one card per row in portrait, two at >= 700px; `.smart-card__head strong, span { white-space: normal; overflow-wrap: anywhere }` | fixed (cross-cutting) |
| experts, hero-gear | t600-t1194 | e5 | same subtitle span (147-186px wide, skill list 350px) | no hover on a touch tablet | desktop@pointer:coarse: wrap title/subtitle | fixed |
| experts (every desktop width), hero-gear (d1280) | d700-d2560 | e5 | same subtitle span | nowrap ellipsis without a `title`; wrapping would change desktop card heights (parity) | app.js `title` attribute (section 3) | needs app.js |
| pets, experts, hero-gear | m320-m430 | e1 | `.stat-impact-panel > .stat-impact-head > span` ("Troop attack and defence per pet level ...", "Opened detail popups ...", "Affinity target changes ...") by 15-29px | `-webkit-line-clamp: 2` on a footnote written for a 720px line; 270-340px lines cut the sentence | phone: `.stat-impact-head { display: grid; grid-template-columns: minmax(0,1fr) }`, span unclamped, left aligned (a first attempt with `flex: 1 1 100%` did not wrap in Chromium and widened the page: rejected) | fixed (cross-cutting) |
| pets | m390 (after a plan) | e1 | `.smart-card--blocked > p.smart-card__blocked` "Short 13 Energizing Potion, 32 Strengthening Serum" | `.smart-card p { -webkit-line-clamp: 2 }` | phone: `.smart-card p` unclamped | fixed (cross-cutting) |
| hero-gear, experts (every module with a smart panel) | t600, d700 | O1 | `.smart-panel__bar > .smart-panel__bar-facts > .smart-pill--go` "19 steps you can afford now" <> `.smart-panel__bar-main strong` "Expert Targets" | facts group `flex: none`, nowrap pill and nowrap `.smart-panel__gain`; at 600px it runs under the title (mobile.css section 10 already wraps this on the phone shell) | desktop <= 720px: bar `flex-wrap: wrap`, facts `flex: 1 1 100%`, gain wraps | fixed (cross-cutting) |
| heroes | t768, t1024, d1280 | T62 | `.hero-roster-card__body > .hero-field-groups > fieldset.hero-field-group--target > label > span` "Widget" 35px in a 30px column (by 4-5px) | `.hero-roster-grid minmax(230px)` gives 236px cards at 768/1024/1280px (988px content at d1280); `.hero-field-groups { 1.3fr 1fr }` leaves the Target fieldset 87px and its two columns 30px | desktop <= 1365px: `.hero-field-groups { repeat(auto-fit, minmax(112px, 1fr)) }` (stacks the fieldsets under 232px of body; >= 1366px untouched: 258px cards, 37px columns) | fixed (real desktop defect at d1280) |
| heroes | t600-t1194 | t62 | `label.hero-owned-toggle > input[type=checkbox]` 28x28 | styles.css pointer:coarse block sizes native checkboxes 28px | desktop@pointer:coarse: appearance none, 40x40 control with a 22px box drawn in the middle (same technique as mobile.css section 6) | fixed |
| hero-gear | all | strip end fade (visual) | `.hero-selector-strip` last `.hero-portrait-btn` | mask-image fade (last 44px) sits on the scroll box, so at scrollLeft = max the last of 35 portraits is half faded | both shells: `.hero-selector-strip { padding-right: 48px }` (deliberate desktop change) | fixed |
| hero-gear, pets, experts | all | x12 / x36 / x30-39 | `.gd-level-badge small` (9px, 2 per card), `.smart-card__route small` "NOW/AFTER" (9px), `.nutshell-upgrade-route small`, `.stat-impact-values small` "Current" (9px), `.hero-portrait-flag` "2nd" (9px) | decorative captions under 10px | phone + desktop@pointer:coarse: 10px; desktop with a mouse unchanged (parity) | fixed on touch, reviewed on desktop |
| hero-gear | all | O4-O8 | `figure.hg-tile > img.hg-tile__art` <> `.hg-tile__step` "+100" / `.hg-tile__mastery` "Lv.15" | enhancement and mastery badges drawn over the tile art, 4px inside the tile edge (measured: step l56 t4 r4, mastery r6 b4 of a 112px tile); no text meets other text | none | intentional |
| hero-gear | m320-t768 | O1 | `.secondary-gear-panel > p.gd-note > strong` "100% of invested Gear XP" <> `strong` "50% of Essence Stones ..." | two bold inline runs each wrapping across lines: their bounding rects overlap, the glyphs do not (shot `run0-basic/shots/m320/hero-gear-base-6-overlap.png`) | none | probe artifact |
| experts | m320-d1920 (after a skill target) | O1-O2 | `.expert-skill-cost > strong` "3,150" <> `span.muted` "(≈ 1d 21h of learning / speedups)"; `.expert-skill-cost--total > strong` "3,150" <> `strong` "1d 21h" | same wrapped-inline effect: the second run breaks across a line so its bounding rect spans the line (shots `flows2/m320-experts-card1-skills.png`, `t768v-experts-1.png`, `flows0/d1440-experts-card1-skills.png`) | none | probe artifact |
| pets | m320 | 5-column scroller | `.refine-info-panel .table-wrap` 483px in 270px | reference ladder, nowrap cells | none (first column pinned and opaque via the lead's rule) | intentional |
| hero-gear | all phones | 7-column scroller | `.hero-gear-table` 1500px, `.secondary-gear-table` 419px | designed wide tables | none (sticky first column opaque, verified scrolled) | intentional |
| heroes, experts (every inventory check, incl. the one inside each smart panel) | m320, m360 | numbers and names split mid-word (visual, not probed) | `.inventory-check > .coverage-table > .coverage-row > .coverage-row__value` "118,58 / 0", "115,90 / 0"; `.coverage-row__name` "Widg / ets · Gen 6", "Affi / nity" | mobile.css section 10 `.coverage-row { minmax(0,1.5fr) minmax(0,.85fr) minmax(0,.85fr) minmax(0,1.3fr) }` + `.coverage-row > * { overflow-wrap: anywhere }`: 42px value columns inside the smart panel (224px usable at 320px) and 35px of name text beside the 44px icon | phone (`@supports subgrid`): `.coverage-table { max-content max-content minmax(0,1fr) }`, `.coverage-row { grid-template-columns: subgrid }` with the first cell spanning the row (name on line 1, Required / You have / Status on line 2, columns shared by every row), `.coverage-row__value { white-space: nowrap }`; landscape (>= 700px) restores the lead's single-line row | fixed (cross-cutting) |
| pets, experts | m320 | `.mtabs` button V by 8px, sheet W1 | `nav#mTabs > button.mtab` | consequence of the 332px layout viewport above | none needed | fixed by the grid fix |
| heroes, hero-gear, pets, experts | m320, m360 | e1 | `.mprofile__summary > span#mProfileFacts` | phone chrome (lead's) | - | not mine |
| pets, experts, hero-gear | <= t834 | O1 | `.smart-card__rank` "1" <> title | fixed centrally by the lead (`.smart-card__head { padding-right: 30px }`) | - | fixed by lead |
| experts | d1100 | option label clipped 5px (only if chosen) | `.expert-card .gd-select-row select` | 12px font, 116px inside for the 121px "10.1 · Acquaintance 1"; fits at >= 1101px (130px at d1440) | none | residual (minor) |

Interaction states covered by the flows with no new defect after the fixes: Owned off/on, 10-digit shard count, target stars/tier/widget (heroes); strip scrolled to the end, secondary-set hero, last hero (no gear), first hero, Target Lv/+ to max, Current Lv/+ to min, bulk level/enhancement selects, every disclosure, both wide tables scrolled (hero-gear); pet Current 0 / Target max / Gold / 10-digit attempts, bulk max, disclosures, tables scrolled (pets); relationship 1 -> 100.1, skill 0 -> max, bulk max, disclosures (experts). Landscape phones: nothing under the tab bar (`underBar()` clean at mL844).

## 3. Proposed app.js edits

**`smartRecommendationCardHtml` (app.js ~2986)** - desktop `e5` on experts at every width and on hero-gear at d1280: the smart-card title and subtitle are single-line ellipsis with no hover text. Adding `title` gives the desktop hover affordance the brief asks for without changing card heights (CSS wrapping would alter the desktop layout at >= 1101px).

old:
```
      <div><strong>${esc(candidate.label)}</strong>${sub ? `<span>${esc(sub)}</span>` : ""}</div>
```
new:
```
      <div><strong title="${esc(candidate.label)}">${esc(candidate.label)}</strong>${sub ? `<span title="${esc(sub)}">${esc(sub)}</span>` : ""}</div>
```
Why not CSS: only a tooltip can add an affordance without wrapping; on phones and touch tablets the CSS in D-heroes.css wraps the text instead (no hover there).

No other markup change is needed for these four tabs.

## 4. Cross-cutting fixes (candidates for promotion)

All in `.audit-work/fixes/D-heroes.css`; each is used by several module tabs:

1. `.nutshell-material-grid` one column in portrait phones / auto-fit 160px in landscape, and `.nutshell-material__head { flex-wrap: wrap } > strong { margin-left: auto }` (phone, and desktop <= 1100px). Every module's "In a nutshell" box.
2. `.smart-card-grid` one column in portrait phones, two in landscape (mirrors the lead's `.grid-2`), and `.smart-card__head strong/span` wrap on phones and touch tablets. Every module with a smart panel.
3. `.smart-panel__bar` wraps its facts at <= 720px in the desktop shell (t600/d700) - the phone shell already had it (mobile.css section 10).
4. `.stat-impact-head` single-column grid with the footnote unclamped on phones ("Observed ... Stats" panels on pets, experts, hero-gear, research, troops ...).
5. `.smart-card p` unclamped on phones.
6. Sub-10px captions raised to 10px on phones and touch tablets: `.gd-level-badge small`, `.smart-card__route small`, `.nutshell-upgrade-route small`, `.stat-impact-values small`.
7. Pattern for other `auto-fill/auto-fit` grids with a px floor: `minmax(min(Npx, 100%), 1fr)` keeps the floor where it fits and never exceeds the container (used here on `.pet-card-grid`).
8. `.coverage-row` two-line subgrid layout on portrait phones (see the findings row): every inventory check on every module tab renders 6-7 digit values at 320-360px; the lead's single-line split breaks them mid-digit inside the smart panels.
9. Touch tablets: native checkboxes are 28px in the pointer:coarse block, so every checkbox on a tablet is a sub-40px target (heroes t62; the same will hold for `.svs-toggle`, `.troop-enable`, table checkboxes). D-heroes.css draws only `.hero-owned-toggle`; a global version for the lead's block: `@media (pointer: coarse) { html[data-shell="desktop"] input[type="checkbox"] { appearance: none; width: 40px; height: 40px; min-height: 40px; background: <22px box svg> center/22px 22px no-repeat; } }` (checked state as in mobile.css section 6).

## 5. Residual issues

- `O4-O8` on hero-gear at every width: `.hg-tile` enhancement/mastery badges over the tile art (intentional overlay, inside the tile, no text-on-text). Only a markup change (`aria-hidden` on the art or `data-audit-ignore`) would silence the probe; not worth altering production markup for.
- `O1` on hero-gear at <= 768px (`p.gd-note` bold runs) and on experts after a skill plan (`.expert-skill-cost`): wrapped inline elements whose bounding rects intersect; verified visually as clean.
- `x` codes on desktop with a mouse (9px captions): left as designed for parity; raised to 10px on every touch device.
- `e5` on the desktop smart-card subtitle: needs the app.js `title` edit above (wrapping would break parity).
- `e1` at m320/m360: `#mProfileFacts` in the phone chrome (lead's).
- experts d1100: "10.1 · Acquaintance 1" is 5px wider than the 12px select when that option is selected; fits at d1280+.
- Out of scope (colour, not layout): `.pet-rarity-badge` on the light pet card is #d7dee8 on a pale blue surface ("COMMON · MAX 50" is barely legible at any width); suggested `.pet-card .pet-rarity-badge { color: #35507a; background: rgba(31, 58, 95, 0.1); }`. Same family: `.pet-card .gd-time-row` takes the dark-panel colours (`color: var(--text)` on a 6% white fill) so "SVS gain:", "Marks for plan:" and "Sigils:" are white on the pale card; the base `.gd-time-row` colours (`var(--gd-ink)` on `var(--gd-panel)`) are the ones meant for these cards.
- Test-tooling note: any `page.screenshot()` in an emulated touch context drops `pointer: coarse` for the rest of the page's life (the desktop `pointer: fine` rules then apply and every select shrinks to 30-36px). `flows.mjs` restores the media via CDP after each shot; the harness is unaffected because it screenshots after probing. The `t97`/`t19` bursts in `flows0.log` are this artifact, not a defect.

## 6. Final evidence

All with `--extra-css .audit-work/fixes/D-heroes.css` against the live dev server (which already carries the lead's nav-strip and `.smart-card__head` fixes). Reports: `.audit-work/D-heroes/run2-basic`, `run2-full`, `run2-webkit`, `run2-nav`, `flows2`.

Reading the residual codes: `O4/O5` on hero-gear = the four `.hg-tile` badge overlays (+ the wrapped `p.gd-note` bold runs where the note wraps); `e1` at m320/m360 = `#mProfileFacts` (phone chrome, lead's); `e5` on desktop = the smart-card subtitle ellipsis (app.js `title` edit, section 3); `x` on mouse desktops = 9px captions kept for parity; `O1/O2` on experts after a skill plan = the wrapped `.expert-skill-cost` runs. Nothing else remains at any width.

### Chromium, `--interact basic`, all 22 viewports (`run2-basic/summary-chromium.md`)

| module | m320 | m360 | m375 | m390 | m412 | m430 | mL667 | mL844 | mL932 | t600 | t768 | t834 | t1024 | t1194 | d700 | d900 | d1100 | d1280 | d1366 | d1440 | d1920 | d2560 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| heroes | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| hero-gear | O5 e1 | O4 e1 | O4 | O5 | O5 | O5 | O5 | O5 | O5 | O5 | O5 | O4 | O4 | O5 | O4 x12 | O5 x12 | O5 x12 | O4 e5 x12 | O5 x12 | O4 x12 | O5 x12 | O5 x12 |
| pets | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | x36 | x36 | x36 | x36 | x36 | x36 | x36 | x36 |
| experts | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | x39 | e5 x30 | e5 x30 | e5 x30 | e5 x30 | e5 x30 | e5 x30 | e5 x30 |
| sheet | ok | ok | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |
| profile | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |

Before (`run0-basic`, same server, no fix file): heroes `T62 t62` at t768/t1024, `t62` at t600/t834/t1194, `T62` at d1280; hero-gear `O6 e2-e9 x12` on phones, `O7` at t600; pets `H! V16 O2 e2 x36` at m320, `O1-O2` up to t834; experts `H! V11 O1 e7 x39` at m320, `O1 e5-e7` up to t1194.

### Chromium, `--interact full` (`run2-full/summary-chromium.md`; 228 control activations probed, none added a code outside O/e/x)

| module | m320 | m390 | mL844 | t768 | d1100 | d1440 |
|---|---|---|---|---|---|---|
| heroes | e1 | ok | ok | ok | ok | ok |
| hero-gear | O5 e1 | O5 | O5 | O5 | O5 x12 | O4 x12 |
| pets | e1 | ok | ok | ok | x36 | x36 |
| experts | e1 | ok | ok | ok | e5 x30 | e5 x30 |
| sheet | ok | ok | ok | - | - | - |
| profile | e1 | ok | ok | - | - | - |

### WebKit, `--interact basic` (`run2-webkit/summary-webkit.md`)

| module | m320 | m390 | mL844 |
|---|---|---|---|
| heroes | e1 | ok | ok |
| hero-gear | O5 e1 | O5 | O4 |
| pets | e1 | ok | ok |
| experts | e1 | ok | ok |
| sheet | ok | ok | ok |
| profile | e1 | ok | ok |

### Chromium, `--nav` (real taps: tab bar / More sheet at m390, nav chips at t768/d1440; `run2-nav/summary-chromium.md`)

| module | m390 | t768 | d1440 |
|---|---|---|---|
| heroes | ok | ok | ok |
| hero-gear | O5 | O5 | O4 x12 |
| pets | ok | ok | x36 |
| experts | ok | ok | e5 x30 |
| sheet | ok | - | - |
| profile | ok | - | - |

Navigation result for every tab at every one of the three viewports: `ok` (no fallback to the synthetic click).

### Own flows (`flows2.log`, `flows2/flows-chromium.json`; m320, m390, mL844, t768, d1440, d1920)

Every step (base, owned off/on, 10-digit shards, target stars/tier/widget; strip scrolled, secondary hero, last hero, first hero, targets max, current min, bulk selects, expanded, scrolled; pet current 0 / target max / Gold / 10-digit attempts, bulk max, expanded, scrolled; relationship 1 -> 100.1, skill 0 -> max, bulk max, expanded, scrolled) reports only the residual codes above; `underBar()` found nothing under the tab bar at mL844; `pointer: coarse` verified true at every probe.

### Screenshots looked at last (all with the fix file)

- m320: `flows2/m320-pets-nutshell-plan.png`, `flows2/m320-pets-card1-plan.png`, `flows2/m320-experts-card1-skills.png`, `flows2/m320-experts-smart.png`, `flows2/m320-hg-strip-end.png`, `flows2/m320-hg-slot1-currentmin.png`, `flows2/m320-hg-secondary-scrolled.png`, `flows2/m320-pets-refine-info.png`, `cov-m320-heroes-1.png`, `cov-m320-experts-1.png` (coverage inside the smart panel), `cov-m320-experts-2.png` (sigil coverage), `stat-m320-pets-1.png`, `stat-m320-hg-1.png`
- m390: `flows2/m390-heroes-coverage.png`, `flows2/m390-pets-card1-plan.png`, `flows1/m390-experts-card1-plan.png`
- mL844: `flows2/mL844-heroes-card1-longnum.png`, `flows2/mL844-pets-nutshell-plan.png`, `flows2/mL844-pets-smart.png`, `flows1/mL844-hg-layout-secondary.png`, `cov-mL844-heroes-1.png`
- t768 (viewport captures, touch media intact): `t768v-heroes-1.png`, `t768v-experts-1.png`, `t768v-hg-1.png`, `flows2/t768-pets-nutshell.png`, `flows2/t768-heroes-card1.png`
- d1440 / d1920 / d2560: `flows0/d1440-experts-card1-skills.png`, `flows0/d1440-pets-card1-plan.png`, `flows0/d1440-heroes-card1-longnum.png`, `flows0/d1440-hg-slot1-targets.png`, `flows2/d1920-hg-full.png`, `d2560-hg-1.png`
- Before/after references: `run0-basic/shots/m320/hero-gear-base-6-overlap.png` (gd-note artifact), `run0-basic/shots/t600/experts-base-1-overlap.png` (smart bar), baseline `shots/m320/pets-base-3-overlap.png`, `shots/t768/heroes-base-1-text-overflow.png`, `shots/t768/pets-base-2-overlap.png`.

Capture caveat for anyone re-checking tablets: a Playwright `fullPage` screenshot drops the emulated `pointer: coarse` while it renders (verified with `media-test.mjs`: the selects animate 44 -> 31px during the capture), so touch-only rules are missing from full-page images of t-viewports; use viewport screenshots (`shot.mjs`) or the harness's own shots.
