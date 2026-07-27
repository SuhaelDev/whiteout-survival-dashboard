
## 2026-07-26T17:36:52.282729+00:00 - wave19 data migrations
- Gareth (Ironthorn Chief) added as Expert #10: 110 affinity rows (formula-corrected stats; source rows 30-39/44 flagged as typos), 81 skill/talent rows (Books of Knowledge + Learning XP; requirements low-confidence except game-verified GoI L5 = Acquaintance 3), special research summary (2 trees / 6 paths / 18,000 sigils, Lancer-focused). Sources: wosheroes.com (retrieved 2026-07-26T17:36:52.282729+00:00) + in-game verification anchors.
- Chief Charm levels 10/11/12 step costs game-verified (105/105, 140/105, 116/90+3 secrets); workbook values preserved as workbook_*; all other levels flagged unverified.
- Player profile: alliance B2D -> BMO, player_id 383664139, initial_state 2456, power 705,749,076.
- Inventory snapshot (32 resource fields) written into extracted_current with capture provenance.

## 2026-07-27T03:48:57Z - wave21 live capture (read-only, session reconnected)
- HERO GEAR RE-EXTRACTED from Heroes > hero > Gear for all invested sets. 16 piece corrections. Game truth: Edith Lv15+100 / Lv15+99 / Lv16+100 / Lv15+60 (Charm Toolkit +3); Bradley Lv15+100 / Lv13+40 / Lv13+40 / Lv15+80 (Thunder Cannon +9); Gordon Lv12+59 / Lv12+40 / Lv12+40 / Lv13+59 (Bonecrux Venom +10); Gwen Lv10+50 / Lv7+40 / Lv7+40 / Lv8+50 (Wings of Hope +10); Hector Lv8+40 / Lv8+50 / Lv8+50 / Lv7+40 (Steel Fangs +10); Gatot holds 4 un-levelled epic pieces (Golden Fang +2).
- CORRECTION: this supersedes the wave16c values (Gwen/Hector modelled at +100/+100/+70/+70). The live game does not match that assumption, so invested-XP/reforge figures changed accordingly: Edith 2,020,080 · Bradley 1,393,080 · Gordon 990,280 · Gwen 26,160 · Hector 26,160 gear XP.
- Removed legacy duplicate slot keys on Edith (goggles/gauntlets/belt/boots alongside positional keys) that would have double-counted her set.
- Dropped the wave17 manual hero-gear overrides so the capture is the single source of truth.
- INVENTORY PASS B completed with item-name popups. All differences vs pass A are live gains, not counting errors (charm guides 1,011->1,095; designs 723->857; design plans 476->614; polish 529->1,081; alloy 57,187->112,327; amber 17->18; essence 404->427; widgets 9,380->11,880; mythic general shards 265->310). Names confirmed: red-hex scroll = Charm Design; grey stone = Common Wild Mark (pet refinement, NOT mithril).
- Mithril: absent from the backpack in both passes -> stays 0, flagged for a reforge-UI check.
- common_wild_marks left at its prior 219 (aggregation unclear); verified Common tile stored separately as wild_marks_common_verified=77 with an open question.
