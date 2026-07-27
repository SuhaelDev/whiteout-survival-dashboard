
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

## 2026-07-27T04:52:06Z - wave22 gap closure (all read-only)
- IDENTITY CORRECTION: Chief Profile at full resolution reads **[B2D]Sorrow, Alliance B2D**. The "BMO" recorded in wave19 was a low-resolution misread and has been reverted. Power 706.4M, Kills 262.1M, Silver Medallion I, Leader, State 2476 (initial 2456).
- REFORGE RULES REPLACED WITH GAME TEXT: Enhancement Reforge returns 100% of Enhancement XP; Mastery Reforge returns 50% of Essence Stones and 100% of Mythic Gear; both tabs state "Cannot reforge ascended Legendary gear!". The previous "100% mithril returned" model was wrong - **mithril appears in no hero-gear panel in this version** and is now weighted 0 in the planner and documented as unused.
- Reforge Bank rebuilt: Mythic Gear column replaces Mithril, only non-ascended pieces are counted, each row shows an N/M reforgeable tag with an ascended count.
- Mastery Forging Lv15->Lv16 game-verified: 160 Essence Stones + 6 Mythic Gear (gear strength/stats 150% -> 160%). Mythic Gear balance is 0 - this is now the real blocker on Edith's next mastery step.
- Gear Details independently confirmed the empowerment model: +20 (Expedition) Infantry Attack +20.0%, +40 (Exploration) Hero Health Up +7.5%.
- Wild Marks resolved per rarity: Common 77, Advanced 6 (the prior 219 aggregate is gone). Cave Lion refinement captured (Lv100, 3,323,640 power, six stats vs the 22.35% cap).
- NEW MODULE "Skins & Bonuses" (17th tab): game's permanent collection-bonus system, with Total Bonus captured - Troops Atk +18%/300%, Def +61%/300%, Lth +14.5%/300%, HP +3%/300%, Hunting March +90%/500%, Gathering +5%; owned city skins sampled; categories City/Marching/Avatar Frame/Nameplate. Renders an explicit "no capture yet" state for other players rather than inventing numbers.
- ASSETS: Gareth's official portrait added (assets/game/expert-gareth.webp) plus five clearly-labelled placeholder skill icons (assets/game/experts/*.svg) - placeholders are visibly marked "placeholder", never passed off as official art.
- Tests: tests/wave22-checks.js (16 assertions) added; wave19 (17) and hero-gear box states (27) still pass; all 17 tabs render.
