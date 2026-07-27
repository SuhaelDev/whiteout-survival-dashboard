// Wave 19 regression checks: Gareth data integrity + game-verified charm costs.
// Run: node tests/wave19-checks.js  (from repo root)
const fs = require("fs");
const g = JSON.parse(fs.readFileSync(__dirname + "/../data/game-data.json", "utf8"));
let failed = 0;
const check = (name, cond) => { console.log(cond ? "PASS" : "FAIL", "-", name); if (!cond) failed++; };

// Charm level 11 (game-verified 2026-07-27, player 383664139)
const c = (lv) => g.chief_charm_levels.find((r) => Number(r.charm_level) === lv);
// These three used to assert the SINGLE-STEP cost in the full-level fields, which is what
// made every charm plan a quarter of its real cost. A charm level is four steps: the level
// fields now hold the whole level, and the observed step sits alongside it.
check("charm 10 level cost 420/420/0", c(10).guides === 420 && c(10).designs === 420 && c(10).secrets === 0);
check("charm 11 level cost 560/420/0", c(11).guides === 560 && c(11).designs === 420 && c(11).secrets === 0);
check("charm 12 level cost 580/450/15", c(12).guides === 580 && c(12).designs === 450 && c(12).secrets === 15);
check("charm 10 step cost 105/105/0", c(10).observed_step_guides === 105 && c(10).observed_step_designs === 105 && c(10).observed_step_secrets === 0);
check("charm 11 step cost 140/105/0", c(11).observed_step_guides === 140 && c(11).observed_step_designs === 105 && c(11).observed_step_secrets === 0);
check("charm 12 step cost 116/90/3", c(12).observed_step_guides === 116 && c(12).observed_step_designs === 90 && c(12).observed_step_secrets === 3);
check("four steps per charm level", c(10).steps_per_level === 4 && c(11).steps_per_level === 4);
check("level 10 is exactly four observed steps", c(10).observed_step_guides * 4 === c(10).guides && c(10).observed_step_designs * 4 === c(10).designs);
check("level 11 is exactly four observed steps", c(11).observed_step_guides * 4 === c(11).guides && c(11).observed_step_designs * 4 === c(11).designs);
// "game_verified" was the flag when the level fields held a single step. The level cost is
// now the whole level, confirmed by the observed step times four.
check("charm 11 flagged game_verified_step_x4", c(11).verification_status === "game_verified_step_x4");
check("charm 12 flagged as not reconciling", c(12).verification_status === "workbook_aggregate_step_mismatch");
check("charm 13 flagged unverified", c(13).verification_status === "unverified_workbook_aggregate");
check("workbook values preserved", c(11).workbook_guides === 560 && c(11).workbook_designs === 420);

// Gareth
const gareth = g.experts.find((e) => e.expert_id === "gareth");
check("gareth expert exists", Boolean(gareth));
check("gareth has 5 skills incl talent", gareth.skills.length === 5);
const aff = g.expert_affinity_levels.filter((r) => r.expert_id === "gareth");
check("gareth 110 affinity rows", aff.length === 110);
check("gareth L10 stat 5.70%", aff.find((r) => r.level_code === "10").primary_stat === 0.057);
check("gareth L100 stat 30%", aff.find((r) => r.level_code === "100").primary_stat === 0.3);
check("gareth advancement sigils total 2730", aff.filter((r) => r.level_code.endsWith(".1")).reduce((s, r) => s + r.sigils, 0) === 2730);
const goi = g.expert_skill_levels.filter((r) => r.skill_id === "gareth_gifts_of_iron");
check("gifts of iron 10 levels", goi.length === 10);
check("gifts of iron L4 effect 1/12 (game-verified)", goi[3].effect_1 === 1 && goi[3].effect_2 === 12);
check("gifts of iron L5 books 1200 (game-verified)", goi[4].books === 1200);
const rc = g.expert_skill_levels.filter((r) => r.skill_id === "gareth_rallying_cry");
check("rallying cry 11 levels, L2=60000/6%", rc.length === 11 && rc[1].effect_1 === 60000 && rc[1].effect_2 === 0.06);
check("special research 6 paths / 18000 sigils", g.gareth_special_research.paths.length === 6 && g.gareth_special_research.paths.reduce((s, p) => s + p.sigils_total, 0) === 18000);

process.exit(failed ? 1 : 0);
