// The charm tally: every selected charm target, added up, against one shared material pool.
// Written after the Charms page appeared to disagree with itself - it was actually showing
// two tables, the real total and the separate "smart suggestion" - so these pin the maths.
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const game = JSON.parse(fs.readFileSync(path.join(root, "data/game-data.json"), "utf8"));
const state = JSON.parse(fs.readFileSync(path.join(root, "data/current-player-state.json"), "utf8"));

let failures = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"} - ${label}${ok ? "" : ` (got ${actual}, want ${expected})`}`);
}

const byLevel = new Map(game.chief_charm_levels.map((row) => [Number(row.charm_level), row]));

// Same walk rangeCost() does: every level above current, up to and including target.
function charmCost(current, target) {
  const cost = { guides: 0, designs: 0, secrets: 0 };
  for (let level = Number(current) + 1; level <= Number(target); level += 1) {
    const row = byLevel.get(level);
    if (!row) continue;
    cost.guides += Number(row.guides || 0);
    cost.designs += Number(row.designs || 0);
    cost.secrets += Number(row.secrets || 0);
  }
  return cost;
}

// A charm level is FOUR upgrade steps. The in-game panel quotes only the next step, and
// mistaking that for the level cost is what made every charm plan a quarter of its real
// size. Levels 10 and 11 confirm the x4 rule exactly against the workbook aggregate.
check("four steps per level", byLevel.get(10).steps_per_level, 4);
check("level 10 step is 105 guides", byLevel.get(10).observed_step_guides, 105);
check("level 11 step is 140 guides", byLevel.get(11).observed_step_guides, 140);
check("level 10 costs 420 guides", byLevel.get(10).guides, 420);
check("level 10 costs 420 designs", byLevel.get(10).designs, 420);
check("level 11 costs 560 guides", byLevel.get(11).guides, 560);
check("level 11 costs 420 designs", byLevel.get(11).designs, 420);
check("level 10 is four steps", byLevel.get(10).observed_step_guides * 4, byLevel.get(10).guides);
check("level 11 is four steps", byLevel.get(11).observed_step_guides * 4, byLevel.get(11).guides);

// A single level never invents or loses materials
check("9 -> 10 is one level", charmCost(9, 10).guides, 420);
check("10 -> 11 is one level", charmCost(10, 11).guides, 560);
check("9 -> 11 is both levels", charmCost(9, 11).guides, 980);
check("target equal to current costs nothing", charmCost(11, 11).guides, 0);
check("target below current costs nothing", charmCost(11, 9).guides, 0);

// The scenario that prompted this: hat and watch 9 -> 10, coat and pants 10 -> 11,
// ring and cudgel already at target. Twelve charms, one pool.
const scenario = { hat: [9, 10], watch: [9, 10], coat: [10, 11], pants: [10, 11], ring: [11, 11], cudgel: [11, 11] };
let guides = 0;
let designs = 0;
let upgrades = 0;
Object.values(scenario).forEach(([current, target]) => {
  ["top", "left", "right"].forEach(() => {
    const cost = charmCost(current, target);
    guides += cost.guides;
    designs += cost.designs;
    if (cost.guides || cost.designs || cost.secrets) upgrades += 1;
  });
});
check("twelve charms selected", upgrades, 12);
check("twelve charms need 5,880 guides", guides, 5880);
check("twelve charms need 5,040 designs", designs, 5040);

// Per troop group, and the groups must add back up to the total
const lancer = 6 * charmCost(9, 10).guides;
const infantry = 6 * charmCost(10, 11).guides;
check("lancer group 2,520 guides", lancer, 2520);
check("infantry group 3,360 guides", infantry, 3360);
check("groups sum to the combined total", lancer + infantry, guides);

// Against the counts read from the game, this selection is short - the page must not
// claim it is covered just because each group fits on its own.
const have = state.extracted_current.resources;
check("guides on hand 1,095", have.charm_guides, 1095);
check("designs on hand 857", have.charm_designs, 857);
check("selection is 4,785 guides short", guides - have.charm_guides, 4785);
check("selection is 4,183 designs short", designs - have.charm_designs, 4183);
// With the real level costs not even one group fits, which is the whole point of the fix.
check("no single group fits either", Math.min(lancer, infantry) > have.charm_guides, true);

console.log(failures ? `\n${failures} FAILED` : "\nAll charm cost checks passed");
process.exit(failures ? 1 : 0);
