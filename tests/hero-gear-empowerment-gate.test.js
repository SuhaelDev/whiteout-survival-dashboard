// Empowerment milestones are gated on Mastery Forging level, one level per milestone:
// +20 needs ML 11, +40 ML 12, +60 ML 13, +80 ML 14, +100 ML 15. Between milestones a piece
// enhances freely, so the ceiling at a mastery level is one below the milestone it cannot
// cross - ML 12 tops out at +59.
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const game = JSON.parse(fs.readFileSync(path.join(root, "data/game-data.json"), "utf8"));
const state = JSON.parse(fs.readFileSync(path.join(root, "data/current-player-state.json"), "utf8"));

let failed = 0;
const check = (name, got, want) => {
  const ok = got === want;
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : ` (got ${got}, want ${want})`}`);
};
const lift = (name) => {
  const m = src.match(new RegExp(`function ${name}\\([\\s\\S]*?\\n\\}`));
  if (!m) { console.log(`FAIL - ${name} not found`); failed += 1; return "function noop(){}"; }
  return m[0];
};
const consts = src.match(/const HERO_GEAR_EMPOWERMENT_MASTERY_REQUIREMENTS = \{[^}]*\};/)[0]
  + "\nconst HERO_GEAR_EMPOWERMENT_MIN_MASTERY_LEVEL = 11;"
  + "\nconst HERO_GEAR_EMPOWERMENT_FULL_MASTERY_LEVEL = 15;"
  + "\nconst HERO_GEAR_MAX_EMPOWERMENT = 100;";
const req = new Function(consts + lift("heroGearEmpowermentMasteryRequirement") + "; return heroGearEmpowermentMasteryRequirement;")();
const cap = new Function(consts + lift("heroGearEmpowermentCapForMastery") + "; return heroGearEmpowermentCapForMastery;")();
const rowState = new Function(consts + lift("heroGearEmpowermentMasteryRequirement") + lift("heroGearEmpowermentRowState") + "; return heroGearEmpowermentRowState;")();

// milestone -> required mastery
[[20, 11], [40, 12], [60, 13], [80, 14], [100, 15]].forEach(([step, ml]) =>
  check(`+${step} needs Lv ${ml}`, req(step), ml));
// between milestones you only need the level for the last one passed
check("+39 still only needs Lv 11", req(39), 11);
check("+59 still only needs Lv 12", req(59), 12);
check("+99 still only needs Lv 14", req(99), 14);

// ceiling per mastery level
[[10, 0], [11, 39], [12, 59], [13, 79], [14, 99], [15, 100], [16, 100]].forEach(([ml, c]) =>
  check(`Lv ${ml} reaches +${c}`, cap(ml), c));

// row states
check("current milestone reads unlocked", rowState(20, 40, 100, 15), "unlocked");
check("reachable and targeted", rowState(60, 40, 100, 15), "targeted");
check("targeted but mastery too low", rowState(60, 40, 100, 12), "mastery-locked");
check("+100 unreachable at Lv 14", rowState(100, 40, 100, 14), "mastery-locked");
check("+100 reachable at Lv 15", rowState(100, 40, 100, 15), "targeted");
check("no mastery passed in keeps old behaviour", rowState(60, 40, 100), "targeted");
check("above target is plain locked", rowState(100, 40, 60, 15), "locked");
check("target below current is invalid", rowState(20, 60, 40, 15), "invalid");

// data
const mr = game.hero_gear_empowerment_stats.mastery_requirements;
check("requirements stored", JSON.stringify(mr), JSON.stringify({ "20": 11, "40": 12, "60": 13, "80": 14, "100": 15 }));

// Every equipped piece must respect its own cap - this is what confirmed the rule.
let atCap = 0;
Object.entries(state.extracted_current.hero_gear).forEach(([hero, set]) => {
  Object.entries(set.gear || {}).forEach(([slot, piece]) => {
    const ml = Number(piece.level || 0);
    const step = Number(piece.enhancement || 0);
    if (ml < 11) return;
    const ceiling = cap(ml);
    check(`${hero} ${slot} (Lv ${ml} +${step}) within +${ceiling}`, step <= ceiling, true);
    if (step === ceiling) atCap += 1;
  });
});
check("at least one piece sits exactly on its cap", atCap >= 1, true);

console.log(failed ? `\n${failed} FAILED` : "\nAll empowerment gate checks passed");
process.exit(failed ? 1 : 0);
