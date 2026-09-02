# Responsive layout audit, 2 September 2026

Goal: no card, word, image or control overlapping or cut off at a border, on
every module, through every navigation and input, on phones of every size
(Chrome / installed PWA), tablets and desktops. Both shells were audited: the
phone shell (`html[data-shell="mobile"]`, `src/mobile.css`) and the desktop-first
breakpoints in `src/styles.css` that also serve tablets and narrow windows.

## How it was done

1. `scripts/responsive-audit.mjs` (new) drives every module at 22 viewports in
   both shells, in Chromium and WebKit, and reports page overflow, elements past
   the viewport, clipped or truncated text, text wider than its box, overlapping
   text/controls, see-through sticky columns, content under the tab bar, sub-16px
   controls and sub-40px targets on touch. Interaction passes re-probe after
   opening every disclosure, scrolling every wrapper to its end, and activating
   every kind of button, chip, select, input and checkbox. `--nav` navigates the
   way a user does (tab bar, More sheet, nav chips).
2. A baseline of the deployed build was taken (`.audit-work/baseline`, matrix
   below), then six parallel audit groups each owned a slice of the app, fixed
   root causes in their own CSS file (tested by injection), exercised their
   modules' flows with their own Playwright scripts, and reported
   (`A-chrome.md` … `F-events.md` in this folder; the brief they worked from is
   `BRIEF.md`). Rules several groups found independently were consolidated by
   the lead, then everything was merged: phone rules into `mobile.css`
   (sections 18–19), tablet/desktop rules at the end of `styles.css`, every one
   scoped to a shell.
3. The merged build was re-run through the full matrix, WebKit on phones, the
   full-interaction pass and the real-navigation pass, then deployed and the
   live site re-audited.

## What was broken (highlights)

- Every module at any window or tablet 720px wide or narrower scrolled
  sideways: a stale `@media (max-width: 720px)` rule gave the nav strip a
  negative margin after the tablet shell had flattened the sidebar.
- Phones: `.grid-2` still fitted two 140px columns at 366px, crushing the
  Overview cost table and the Planner brief into 178px and painting them over
  each other; compact tables used `table-layout: fixed` and rendered headers
  one letter per line; the pinned first column of scrolling tables was
  transparent (scrolled cells painted straight through it); the Charms, Pets,
  Experts, Research, T12 and SvS pages were wider than a 320px screen because
  of hard 320px grid tracks and 150px field floors; coverage rows broke
  "REQUIRED", "Shards" and "118,580" mid-word; the smart recommendation grid
  packed two cards per row and truncated every title; captions were set at
  9px; the Troops "Mobilize"/"Capacity Boost" and SvS toggles were invisible
  and every `.compact-field` select had no chevron, because a `background:`
  shorthand with `!important` wiped the drawn images.
- Phones, navigation: choosing a module inside the More sheet left the sheet
  open (app.js re-rendered the nav before the bubble-phase listener saw the
  tapped button); a tap on the scrim never closed it in WebKit.
- Tablets: 28px native checkboxes on every tab that has them; the Inventory
  search controls slid under the sticky nav strip; the "focus the upgrade
  nutshell" scroll parked its target 52px under that strip; the Planner
  recommendations table was a multi-screen sideways scroller.
- Desktop: the Troops plan table painted its selects over the troop names at
  every width up to 2560px; the smart-card rank badge sat over long titles;
  short windows (1280×600, 1366×650) clipped the sidebar's save panel; the
  hero band clipped the sixth profile field between 1101 and 1122px.

## What changed

- `src/styles.css`: the 720px nav fix; `.smart-card__head` clearance for the
  rank badge; the form-control `background` shorthand made a longhand; a
  scoped tablet/desktop section at the end (captions to 10px, intro copy
  unclamped ≤1100px, drawn 44px checkboxes on touch tablets, and each group's
  desktop-shell fixes).
- `src/mobile.css`: section 18 (shared primitives: `.grid-2` single column,
  auto table layout, opaque sticky column, unclamped intro copy, transparent
  field checkboxes) and section 19 (shared module rules plus each group's
  phone fixes).
- `src/mobile.js`: capture-phase close of the sheet on module pick; `pointerup`
  close on the scrim for WebKit.
- `src/app.js`: `focusActiveNutshell()` uses `scrollIntoView` so
  `scroll-margin-top` clears the sticky strip; smart-card titles carry a
  `title` for their desktop ellipsis; two labels gained real break
  opportunities.
- `index.html` / `sw.js`: build version bumped to `20260902-audit2`.
- `scripts/responsive-audit.mjs`, `scripts/responsive-audit-lib.mjs`: the
  harness; `docs/MOBILE_PWA.md` documents it.

## Matrices

Codes: `H!` page scrolls sideways · `Vn` elements past the viewport · `Wn`
scroll wrappers wider than the viewport · `Cn` clipped · `Tn` text wider than
its box · `On` overlaps · `Sn` see-through sticky cells · `B!` content under
the tab bar · `fn` sub-16px controls on touch · `tn` sub-40px targets on touch
· `en` ellipsis truncations · `xn` sub-10px text.

### Before (deployed build, Chromium, `--interact basic`)

| module | m320 | m360 | m375 | m390 | m412 | m430 | mL667 | mL844 | mL932 | t600 | t768 | t834 | t1024 | t1194 | d700 | d900 | d1100 | d1280 | d1366 | d1440 | d1920 | d2560 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| wizard | ok | ok | ok | ok | ok | ok | ok | ok | ok | H! | ok | ok | ok | ok | H! | ok | ok | ok | ok | ok | ok | ok |
| overview | e1 | e1 | ok | ok | ok | ok | O2 | O1 | ok | H! W1 C1 | O2 | O2 | ok | ok | H! W1 C1 | O1 | ok | ok | ok | ok | ok | ok |
| planner | e2 | e2 | e1 | e1 | e1 | e1 | ok | ok | ok | H! W1 C1 e1 | ok | ok | ok | ok | H! W1 C1 | ok | ok | ok | ok | ok | ok | ok |
| inventory | O1 e2 | O1 e2 | O1 e1 | e1 | O1 e1 | O1 | ok | ok | ok | H! W1 C1 t62 | t62 | t62 | t62 | t62 | H! W1 C1 | ok | ok | ok | ok | ok | ok | ok |
| buildings | e1 x2 | e1 x2 | x2 | x2 | x2 | x2 | x2 | x2 | x2 | H! W1 C1 t6 x2 | t6 x2 | t6 x2 | t6 x2 | t6 x2 | H! W1 C1 x2 | x2 | x2 | x2 | x2 | x2 | x2 | x2 |
| chief-gear | C4 O1 e1 x13 | C1 T6 O1 e7 x13 | C1 T6 O1 e5 x13 | T6 O1 e2 x13 | T6 O1 x13 | O1 x13 | O1 x13 | O1 x4 | O1 x4 | H! W1 C4 O3 x13 | O1 x4 | O1 x4 | O2 x4 | O2 x4 | H! W1 C1 O3 x13 | O1 x4 | O2 x4 | O2 x4 | O2 x4 | O2 x4 | O2 x4 | O2 x4 |
| charms | H! V13 C10 O2 e2 x33 | C10 T6 O1 e8 x33 | C1 T6 O1 e6 x33 | C1 T6 O1 e3 x33 | T2 O1 e1 x33 | O1 e1 x33 | O1 x33 | O1 x24 | O1 x24 | H! W1 C1 O3 x33 | O1 x24 | O1 x24 | O2 x24 | O2 x24 | H! W1 C1 O1 x33 | O1 x24 | O2 x24 | O2 x24 | O2 x24 | O2 x24 | O2 x24 | O2 x24 |
| heroes | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | H! W1 C1 t62 | T62 t62 | t62 | T62 t62 | t62 | H! W1 C1 | ok | ok | T62 | ok | ok | ok | ok |
| hero-gear | O6 e2 x12 | O5 e9 x12 | O5 e6 x12 | O6 e6 x12 | O6 e6 x12 | O6 e6 x12 | O6 e7 x12 | O6 e6 x12 | O6 e5 x12 | H! W1 C1 O7 x12 | O6 x12 | O5 x12 | O5 x12 | O6 x12 | H! W1 C1 O5 x12 | O6 x12 | O6 x12 | O5 x12 | O6 x12 | O5 x12 | O6 x12 | O6 x12 |
| pets | H! V16 O2 e2 x36 | O2 e1 x36 | O2 x36 | O1 x36 | O1 x36 | O1 x36 | O1 x36 | O1 x36 | O1 x36 | H! W1 C1 O1 x36 | O2 x36 | O1 x36 | O1 x36 | O1 x36 | H! W1 C1 O1 x36 | O1 x36 | O1 x36 | O1 x36 | O1 x36 | O1 x36 | O1 x36 | O1 x36 |
| experts | H! V11 O1 e8 x39 | O1 e7 x39 | O1 e6 x39 | O1 e6 x39 | O1 e6 x39 | O1 e6 x39 | O1 e5 x39 | O1 e5 x30 | O1 e5 x30 | H! W1 C1 O2 x39 | O1 e5 x30 | O1 e5 x30 | O1 e5 x30 | O1 e5 x30 | H! W1 C1 O1 x39 | O1 e5 x30 | O1 e5 x30 | O1 e5 x30 | O1 e5 x30 | O1 e5 x30 | O1 e5 x30 | O1 e5 x30 |
| research | H! V10 O3 e3 x24 | O3 e8 x24 | O3 e6 x24 | O3 e6 x24 | O3 e6 x24 | O3 e5 x24 | O1 e4 x24 | O1 e2 x24 | O1 x24 | H! W1 C1 O2 e1 x24 | O1 e11 x24 | O1 e3 x24 | O1 e9 x24 | O1 x24 | H! W1 C1 O1 x24 | O1 e1 x24 | O1 e3 x24 | O1 e9 x24 | O1 e3 x24 | O1 e21 x24 | O1 e13 x24 | O1 e13 x24 |
| t12-research | H! V58 e2 x114 | e2 x114 | e1 x114 | e1 x114 | e1 x114 | e1 x114 | x114 | x114 | x114 | H! W1 C1 x114 | x114 | x114 | x114 | x114 | H! W1 C1 x114 | x114 | x114 | x114 | x114 | x114 | x114 | x114 |
| troops | H! V3 O2 e1 | O2 e1 | O2 | O2 | O2 | O2 | O4 | O4 | O4 | H! W1 C1 O6 t5 | O6 t5 | O6 t5 | O6 t5 | O6 t5 | H! W1 C1 O6 | O6 | O2 | O6 | O2 | O2 | O1 | O1 |
| svs | H! V6 e1 | e1 | ok | ok | ok | ok | ok | ok | ok | H! W1 C1 t3 | t3 | t3 | t3 | t3 | H! W1 C1 | ok | ok | ok | ok | ok | ok | ok |
| skins | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | H! W1 C1 | ok | ok | ok | ok | H! W1 C1 | ok | ok | ok | ok | ok | ok | ok |
| sources | O2 e1 | O2 e1 | O2 | O2 | O2 | O2 | O2 | O2 | ok | H! W1 C1 t9 | O2 t9 | O2 t9 | t9 | O2 t9 | H! W1 C1 | O1 | ok | O1 | ok | ok | ok | ok |
| sheet | ok | ok | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |
| profile | e1 | e1 | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |

### After (merged build, Chromium, `--interact basic`)

| module | m320 | m360 | m375 | m390 | m412 | m430 | mL667 | mL844 | mL932 | t600 | t768 | t834 | t1024 | t1194 | d700 | d900 | d1100 | d1280 | d1366 | d1440 | d1920 | d2560 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| overview | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| planner | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| inventory | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| buildings | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| chief-gear | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | O1 | O1 | ok | ok | O1 | O1 | O1 | O1 | O1 | O1 |
| charms | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | O1 | O1 | ok | ok | O1 | O1 | O1 | O1 | O1 | O1 |
| heroes | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| hero-gear | O5 | O4 | O4 | O5 | O5 | O5 | O5 | O5 | O5 | O5 | O5 | O4 | O4 | O5 | O4 | O5 | O5 | O4 e5 | O5 | O4 | O5 | O5 |
| pets | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| experts | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | e5 | e5 | e5 | e5 | e5 | e5 | e5 |
| research | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| t12-research | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| troops | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| svs | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| skins | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| sources | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| sheet | ok | ok | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |
| profile | ok | ok | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |

### Production (https://whiteout-survival-dashboard.vercel.app after the deploy, Chromium, refined overlap probe)

| module | m320 | m360 | m375 | m390 | m412 | m430 | mL667 | mL844 | mL932 | t600 | t768 | t834 | t1024 | t1194 | d700 | d900 | d1100 | d1280 | d1366 | d1440 | d1920 | d2560 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| wizard | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| overview | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| planner | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| inventory | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| buildings | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| chief-gear | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| charms | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| heroes | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| hero-gear | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | e5 | ok | ok | ok | ok |
| pets | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| experts | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | e5 | e5 | e5 | e5 | e5 | e5 | e5 |
| research | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| t12-research | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| troops | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| svs | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| skins | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| sources | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| sheet | ok | ok | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |
| profile | ok | ok | ok | ok | ok | ok | ok | ok | ok | - | - | - | - | - | - | - | - | - | - | - | - | - |

WebKit on the live site (m320 / m390 / m430 / mL844): every module, the More
sheet and the profile `ok`, no errors. The `e5` on experts and hero-gear at
desktop widths is the smart-card subtitle ellipsis, which carries a hover title.

Residual codes in the matrices above, all reviewed:

- `hero-gear O4/O5`: the "+100" / "Lv.15" badges deliberately overlaid on the
  gear tiles (inside the tile, no text collision).
- `chief-gear / charms O1` at ≥1024px: the "Drag to rotate" hint over the
  three.js canvas.
- `experts e5`, `research e1` on desktop: single-line smart-card titles with a
  hover title; they wrap on phones and touch tablets.
- `e1` at 320/360px on every module: the one-line chief-profile summary in the
  hero band, which expands on tap.

Other verification of the merged build, all with zero page or console errors:

- WebKit (iOS Safari engine), phones m320/m360/m390/m430/mL667/mL844, every
  module plus the More sheet and profile: `ok` everywhere except the hero-gear
  tile badges.
- Full-interaction pass (m320/m390/mL844/t768/d1440, 635 control activations
  across all modules, probe after each): no new finding; the only flag after any
  action is the 3D canvas hint on chief-gear/charms at 1440px.
- Real navigation (m390 tab bar + More sheet, t768 nav strip, d1440 sidebar):
  all 16 modules switch correctly; the sheet closes after a pick.
- The onboarding wizard overlay, three steps, at all 22 viewports: `ok`.

The overlap probe was refined after these runs so that a badge positioned
inside a picture and inline runs that merely wrapped are no longer counted;
with it, hero-gear, chief-gear and charms read `ok` too (checked at 390 and
1440px).
