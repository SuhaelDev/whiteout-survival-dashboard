// Surplus must flow to the most valuable shortfall first.
// Chief gear worth, ascending: alloy < polish < plans < amber.
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "src/app.js"), "utf8");
const grab = (re) => { const m = src.match(re); if (!m) throw new Error("missing " + re); return m[0]; };

const code = [
  grab(/const MATERIAL_EXCHANGE_VALUE_ORDER = \{[\s\S]*?\n\};/),
  "const GEAR_FIELDS=" + grab(/const GEAR_FIELDS = \[[\s\S]*?\n\];/).split("=")[1],
  "const CHARM_FIELDS=" + grab(/const CHARM_FIELDS = \[[\s\S]*?\n\];/).split("=")[1],
  "const PET_FIELDS=" + grab(/const PET_FIELDS = \[[\s\S]*?\n\];/).split("=")[1],
  "const PET_CHECK_FIELDS=" + grab(/const PET_CHECK_FIELDS = \[[\s\S]*?\];/).split("=")[1],
  grab(/const MATERIAL_EXCHANGE_SETS = \{[\s\S]*?\n\};/),
  grab(/function fieldKey\([\s\S]*?\n\}/),
  grab(/function fieldKeys\([\s\S]*?\n\}/),
  grab(/function exchangeSet\([\s\S]*?\n\}/),
  grab(/function materialExchangePlan\([\s\S]*?\n\}\n\nfunction exchangeAdjustedNeed/).replace(/\n\nfunction exchangeAdjustedNeed$/, ""),
].join("\n");

const HAVE = {};
const plan = new Function("HAVE", `
  const availableInventoryValue = (k) => Number(HAVE[k] || 0);
  ${code}
  return materialExchangePlan;
`)(HAVE);

const GEAR = [["hardened_alloy", "alloy"], ["polishing_solution", "polish"], ["design_plans", "design_plans"], ["lunar_amber", "amber"]];
let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n    got  ${JSON.stringify(got)}\n    want ${JSON.stringify(want)}`}`);
};
function run(have, cost) {
  Object.keys(HAVE).forEach((k) => delete HAVE[k]);
  Object.assign(HAVE, have);
  const p = plan(cost, GEAR, "chief_gear");
  return { gap: p.gap, to: p.trades.map((t) => t.to), first: p.trades[0], trades: p.trades };
}

// Amber is the most valuable, so a big plans surplus must fully cover amber before
// a single plan goes anywhere cheaper.
let r = run({ hardened_alloy: 0, polishing_solution: 0, design_plans: 2000, lunar_amber: 0 },
            { hardened_alloy: 100000, polishing_solution: 500, design_plans: 0, lunar_amber: 90 });
check("plans surplus fills amber first", r.first.to, "lunar_amber");
check("amber fully covered", r.gap.lunar_amber, undefined);
check("then polish, then alloy", r.to, ["lunar_amber", "polishing_solution", "hardened_alloy"]);

// The live case: only 375 spare plans, which cannot make the 90 amber needed.
// It should still push everything it can into amber, then drop the remainder.
r = run({ hardened_alloy: 291848, polishing_solution: 2840, design_plans: 995, lunar_amber: 0 },
        { hardened_alloy: 304000, polishing_solution: 3720, design_plans: 620, lunar_amber: 90 });
check("amber taken as far as the surplus allows", r.trades[0].fromQty, 370);
check("only the unusable remainder drops down", r.trades[1].fromQty, 5);
check("nothing skipped ahead of amber", r.to[0], "lunar_amber");

// Excess polish has no direct route to amber, so it must go via plans before
// being spent on alloy.
r = run({ hardened_alloy: 0, polishing_solution: 5000, design_plans: 0, lunar_amber: 0 },
        { hardened_alloy: 100000, polishing_solution: 0, design_plans: 0, lunar_amber: 20 });
check("polish routes through plans to reach amber", r.to.slice(0, 2), ["design_plans", "lunar_amber"]);
check("alloy only gets what is left", r.to[2], "hardened_alloy");

// Excess alloy fills the dearer shortfall first.
r = run({ hardened_alloy: 500000, polishing_solution: 0, design_plans: 0, lunar_amber: 0 },
        { hardened_alloy: 0, polishing_solution: 100, design_plans: 10, lunar_amber: 0 });
check("alloy surplus fills plans before polish", r.to, ["design_plans", "polishing_solution"]);
check("both covered", r.gap, {});

// Nothing to do when everything is covered.
r = run({ hardened_alloy: 10, polishing_solution: 10, design_plans: 10, lunar_amber: 10 },
        { hardened_alloy: 1, polishing_solution: 1, design_plans: 1, lunar_amber: 1 });
check("no trades when nothing is short", r.trades.length, 0);

// Known gap: the rule set has no route out of amber, so an amber surplus is stranded.
r = run({ hardened_alloy: 0, polishing_solution: 0, design_plans: 0, lunar_amber: 500 },
        { hardened_alloy: 10000, polishing_solution: 100, design_plans: 50, lunar_amber: 0 });
check("excess amber is currently stranded (no amber-> rules modelled)", r.trades.length, 0);

console.log(failed ? `\n${failed} FAILED` : "\nAll exchange priority checks passed");
process.exit(failed ? 1 : 0);
