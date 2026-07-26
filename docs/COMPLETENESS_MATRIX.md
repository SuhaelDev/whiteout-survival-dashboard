# Completeness Matrix - 2026-07-26T18:56:09Z
Status legend: Complete = data + player state + calcs + tests verified · Partial = works, gaps listed · Missing/Unverified/Blocked as stated.

| Module | Page | Static data | Player state | Costs | Stats | Images | Calcs | Tests | Status |
|---|---|---|---|---|---|---|---|---|---|
| Profile | yes | n/a | game-verified 2026-07-27 (ID 383664139) | n/a | n/a | n/a | n/a | - | Complete |
| Backpack/Resources | yes | resource catalog partial | 32 fields game-verified; unknowns queued | n/a | n/a | icons partial | coverage math | reservation test | Partial (pass B pending) |
| Buildings/FC | yes | workbook to FC10 | 15/15 confirmed | yes | build time only | milestone art partial | yes | smoke | Partial (stat deltas absent in workbook) |
| Fire Crystal Refinement | partial page (T12) | workbook | partial | yes | yes | partial | yes | smoke | Partial |
| Chief Gear | yes | full + tier art T2-T4 | game-cross-checked | yes | yes (sourced) | 64 tier/star icons | yes | smoke | Complete- (sub-T2 art missing) |
| Chief Charms (to 11) | yes | L10/11/12 game-verified; others flagged | charms 9-11 verified | verified steps | panel-verified deltas logged | charm art | yes | 6 assertions | Complete for 9-12; 13-16 Unverified |
| Heroes/shards | yes | 62 heroes, portraits 58/62 | roster Lv80 captured (stars pending detail pass) | shard ladders | n/a | portraits | yes | smoke | Partial |
| Hero Gear | yes | XP/empower tables game-audited | PRIMARY EXTRACT STALE (game: Lv16 +100 vs stored Lv14) | yes | breakpoints verified | tier art | yes | 27 box-state tests | Partial (re-extract queued) |
| Pets | yes | workbook + captures | verified wave20-era | yes | yes | yes | yes | smoke | Complete- |
| Troops | yes | tiers + SvS pts verified | counts partial | yes | yes | n/a | yes | manual calc check | Partial |
| Research Center (normal) | partial | active queues only | 2 live queues captured | partial | partial | node icons | partial | - | Partial |
| War Academy | yes | to max (wostools) | verified | yes | yes | yes | yes | smoke | Complete- |
| T11/T12/Exalted | yes | verified vs sources | yes | yes | yes | yes | yes | smoke | Complete- |
| Flame Tech | no | none | none | - | - | - | - | - | Missing (post-workbook system) |
| Experts (9 legacy) | yes | workbook | captured | yes | yes | icons | yes | smoke | Complete- |
| Gareth | yes | wosheroes + 4 game anchors | full live capture | yes | yes (talent+skills+affinity) | portrait pending | yes | 11 assertions | Complete- (portrait asset, reqs low-conf) |
| Collection Gallery | no | none | none | - | - | - | - | - | Missing |
| SvS prep | yes | wostools-modeled | yes | n/a | points | n/a | yes (Valeria-boosted) | verified math | Complete- |
| Planner | yes | n/a | inventory-aware | exact | transparent | n/a | deterministic v1 | determinism+reservation tests | Complete v1 |
| Auth/Accounts | yes | n/a | per-user rows | - | - | - | - | guest/owner scenario tests | Blocked on Supabase config (user action) |
