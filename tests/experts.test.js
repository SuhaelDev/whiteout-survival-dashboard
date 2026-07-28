// Expert card behaviour: the relationship band, the talent skill, and Gareth's skill costs.
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const game = JSON.parse(fs.readFileSync(path.join(root, "data/game-data.json"), "utf8"));
const state = JSON.parse(fs.readFileSync(path.join(root, "data/current-player-state.json"), "utf8"));

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : ` (got ${JSON.stringify(got)}, want ${JSON.stringify(want)})`}`);
};
const lift = (name) => {
  const m = src.match(new RegExp(`function ${name}\\([\\s\\S]*?\\n\\}`));
  if (!m) { console.log(`FAIL - ${name} not found`); failed += 1; return () => {}; }
  return m[0];
};

// --- relationship band ----------------------------------------------------
// Advancements sit at 10.1, 20.1 ... so level 90 is still the 80.1 band.
const standing = new Function(lift("expertRelationshipStanding") + "; return expertRelationshipStanding;")();
const agnes = game.expert_affinity_levels.filter((r) => r.expert_id === "agnes");
check("level 90 is still Close 2", standing(agnes, "90").label, "Close 2");
check("90.1 becomes Close 3", standing(agnes, "90.1").label, "Close 3");
check("level 84 reports 84, not the band level", standing(agnes, "84").level, 84);
check("level 90 reports 90", standing(agnes, "90").level, 90);
check("100.1 is Intimate", standing(agnes, "100.1").label, "Intimate");
check("level 5 is Stranger", standing(agnes, "5").label, "Stranger");

// --- talent skill ---------------------------------------------------------
const passed = new Function(lift("expertAdvancementsPassed") + "; return expertAdvancementsPassed;")();
check("level 9 has passed none", passed("9"), 0);
check("level 10 unadvanced has passed none", passed("10"), 0);
check("10.1 has passed one", passed("10.1"), 1);
check("level 19 has passed one", passed("19"), 1);
check("level 20 unadvanced has passed one", passed("20"), 1);
check("20.1 has passed two", passed("20.1"), 2);
check("100.1 has passed ten", passed("100.1"), 10);

const isTalent = new Function(lift("expertSkillIsTalent") + "; return expertSkillIsTalent;")();
const rally = game.expert_skill_levels.filter((r) => r.skill_id === "gareth_rallying_cry");
const gifts = game.expert_skill_levels.filter((r) => r.skill_id === "gareth_gifts_of_iron");
check("Rallying Cry is a talent", isTalent(rally), true);
check("Gifts of Iron is not a talent", isTalent(gifts), false);
check("Rallying Cry has one level per advancement plus the base", rally.length, 11);

// --- Gareth skill costs ---------------------------------------------------
// The column held running totals, so a range sum counted every level below it again.
const TOTALS = {
  gareth_gifts_of_iron: { xp: 1164000, books: 13500, levels: 10 },
  gareth_porcupine: { xp: 34560000, books: 250000, levels: 20 },
  gareth_undefeated_will: { xp: 38880000, books: 250000, levels: 20 },
  gareth_fearsome_reputation: { xp: 152059800, books: 800000, levels: 20 },
};
Object.entries(TOTALS).forEach(([id, want]) => {
  const rows = game.expert_skill_levels.filter((r) => r.skill_id === id);
  const xp = rows.reduce((s, r) => s + Number(r.learning_xp || 0), 0);
  const books = rows.reduce((s, r) => s + Number(r.books || 0), 0);
  check(`${id} levels`, rows.length, want.levels);
  check(`${id} sums to the table total`, xp, want.xp);
  check(`${id} books sum to the table total`, books, want.books);
  // per-level, not cumulative: no single level may hold the whole total
  check(`${id} is per-level not cumulative`, rows.every((r) => Number(r.learning_xp || 0) < want.xp), true);
});

// --- state ---------------------------------------------------------------
check("Gareth exists in the saved experts block", typeof state.experts.gareth, "object");
check("Gareth sits at the level-10 advancement", state.experts.gareth.relationship_current, "10.1");

// Gareth's affinity and sigil bands, from the requirement table
const gareth = game.expert_affinity_levels.filter((r) => r.expert_id === "gareth");
const band = (lo, hi, key) =>
  gareth.filter((r) => { const b = Math.floor(Number(r.level_code)); return b >= lo && b <= hi; })
        .reduce((s, r) => s + Number(r[key] || 0), 0);
check("sigils 1-10", band(1, 10, "sigils"), 30);
check("sigils 91-100", band(91, 100, "sigils"), 540);
check("affinity 1-10", band(1, 10, "affinity"), 34900);
check("affinity 91-100", band(91, 100, "affinity"), 558750);
check("total sigils", band(1, 100, "sigils"), 2730);
check("total affinity", band(1, 100, "affinity"), 2561350);

// --- cloud sync ----------------------------------------------------------
// A missing toggle must not be read as "the user turned auto-sync off".
check("auto sync no longer consults stored preference",
  /function cloudAutoSyncEnabled\(\)[\s\S]*?return Boolean\(AUTH\.session\);/.test(src), true);
check("preference only written when the toggle exists",
  /const toggle = \$\("#cloudAutoSync"\);\s*\n\s*if \(toggle\)/.test(src), true);

console.log(failed ? `\n${failed} FAILED` : "\nAll expert checks passed");
process.exit(failed ? 1 : 0);
