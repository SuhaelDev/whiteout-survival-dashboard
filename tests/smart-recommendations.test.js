// Wave 42 - smart recommendation panels.
// Three properties are pinned here:
//   1. Scarcity is judged against what is LEFT after the plan so far, not the full stock.
//      Otherwise every step is priced as if it were the first and the engine never eases
//      off a material it is draining.
//   2. Hero gear empowerment steps never exceed the mastery ceiling. A Lv 12 piece caps at
//      +59 regardless of Gear XP, so proposing +60 is a step the player cannot take.
//   3. Blocked steps carry a shortfall so the panel can name the missing material.
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "src/app.js"), "utf8");

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n    got  ${JSON.stringify(got)}\n    want ${JSON.stringify(want)}`}`);
};
const has = (name, re) => {
  const ok = re.test(src);
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}`);
};
const grab = (re) => {
  const m = src.match(re);
  if (!m) throw new Error("missing " + re);
  return m[0];
};

// --- 1. cost pressure eases as the stock drains ----------------------------
const HAVE = {};
const pressure = new Function("HAVE", `
  const availableInventoryValue = (k) => Number(HAVE[k] || 0);
  const fieldKeys = (fields) => fields.map((f) => f[0]);
  ${grab(/function smartCostPressure\([\s\S]*?\n\}/)}
  return smartCostPressure;
`)(HAVE);

const FIELDS = [["alloy", "Alloy"], ["amber", "Amber"]];
Object.assign(HAVE, { alloy: 1000, amber: 100 });

check("no spend: 100 of 1000 alloy", pressure({ alloy: 100 }, FIELDS), 0.1);
check("after spending 900, the same 100 costs 10x", pressure({ alloy: 100 }, FIELDS, { alloy: 900 }), 1);
check("spending past the stock is heavily penalised", pressure({ alloy: 100 }, FIELDS, { alloy: 1000 }), 4);
check("empty stock is penalised, not divided by zero", pressure({ amber: 5 }, [["amber", "Amber"]], { amber: 100 }), 4);
const early = pressure({ alloy: 200 }, FIELDS, { alloy: 0 });
const late = pressure({ alloy: 200 }, FIELDS, { alloy: 700 });
check("later steps in a plan cost strictly more", late > early, true);

// --- 2. the optimiser actually threads the running spend through ------------
has(
  "smartCandidateScore is called with the running total",
  /score: smartCandidateScore\(candidate, fields, bias, totalCost\)/,
);
has("smartCostPressure accepts a spent argument", /function smartCostPressure\(cost, fields, spent = null\)/);
has(
  "available is reduced by what the plan already spent",
  /availableInventoryValue\(key\) - Number\(spent\?\.\[key\] \|\| 0\)/,
);

// --- 3. hero gear empowerment respects the mastery ceiling ------------------
has(
  "hero gear planner computes an empowerment ceiling",
  /const empowermentCeiling = heroGearEmpowermentCapForMastery\(currentLevel\)/,
);
has(
  "empowerment candidates are filtered by that ceiling",
  /row\.enhancement > currentEnhancement && row\.enhancement <= empowermentCeiling/,
);

const cap = new Function(`
  ${grab(/const HERO_GEAR_EMPOWERMENT_MASTERY_REQUIREMENTS = \{[^}]*\};/)}
  const HERO_GEAR_EMPOWERMENT_MIN_MASTERY_LEVEL = 11;
  const HERO_GEAR_EMPOWERMENT_FULL_MASTERY_LEVEL = 15;
  const HERO_GEAR_MAX_EMPOWERMENT = 100;
  ${grab(/function heroGearEmpowermentCapForMastery\([\s\S]*?\n\}/)}
  return heroGearEmpowermentCapForMastery;
`)();
const rows = [20, 40, 60, 80, 100].map((enhancement) => ({ enhancement }));
const offered = (masteryLevel, currentEnhancement) =>
  rows
    .filter((row) => row.enhancement > currentEnhancement && row.enhancement <= cap(masteryLevel))
    .map((row) => row.enhancement);

check("Lv 10 offers no empowerment at all", offered(10, 0), []);
check("Lv 11 offers +20 only", offered(11, 0), [20]);
check("Lv 12 at +20 offers +40, never +60", offered(12, 20), [40]);
check("Lv 12 at +40 offers nothing more", offered(12, 40), []);
check("Lv 15 at +20 opens the rest", offered(15, 20), [40, 60, 80, 100]);

// --- 4. blocked steps explain themselves ------------------------------------
has(
  "blocked candidates carry a shortfall",
  /shortfall: exchangeAdjustedNeed\(addCostCopy\(totalCost, candidate\.cost\), fields, exchangeKey\)/,
);
has("panel renders the shortfall text", /blockedReason: smartShortfallText\(candidate\.shortfall, plan\.fields\)/);

const shortfallText = new Function(`
  const fieldKeys = (fields) => fields.map((f) => f[0]);
  const fmt = (n) => String(n);
  const titleFromId = (s) => s;
  const RESOURCE_LABELS = { alloy: "Hardened Alloy", amber: "Lunar Amber" };
  ${grab(/function smartShortfallText\([\s\S]*?\n\}/)}
  return smartShortfallText;
`)();
check("names every missing material", shortfallText({ alloy: 12, amber: 3 }, FIELDS), "Short 12 Hardened Alloy, 3 Lunar Amber");
check("silent when nothing is missing", shortfallText({ alloy: 0 }, FIELDS), "");

// --- 5. panels are collapsible and remember their state ---------------------
has("panel is a details element", /<details class="panel smart-panel" data-smart-panel=/);
has("open state comes from saved state", /function smartPanelIsOpen\(moduleId\)/);
has("panels default to open", /return saved === undefined \? true : Boolean\(saved\)/);
has(
  "toggling persists (capture phase, since toggle does not bubble)",
  /setPath\(state, `smart_recommendations\.\$\{panel\.dataset\.smartPanel\}\.open`, panel\.open\)/,
);
has("summary carries a verdict pill", /smart-pill smart-pill--\$\{verdictTone\}/);
has("cards are an ordered list", /<ol class="smart-card-grid">/);

// --- 6. hero gear steps name the hero and the item --------------------------
has("mastery step names the hero", /label: `\$\{hero\.name\} · \$\{label\}`,\n\s+meta: `Mastery Forging/);
has("empowerment step names the hero", /label: `\$\{hero\.name\} · \$\{label\}`,\n\s+meta: `Empowerment/);
has("piece names prefer the item over the grid position", /const HERO_GEAR_POSITION_ITEM_NAMES = \{/);

const pieceName = new Function(`
  ${grab(/const HERO_GEAR_POSITION_ITEM_NAMES = \{[\s\S]*?\n\};/)}
  ${grab(/const HERO_GEAR_SLOT_LABELS = \{[\s\S]*?\n\};/)}
  ${grab(/const HERO_GEAR_SLOT_POSITIONS = \{[\s\S]*?\n\};/)}
  const HERO_GEAR_POSITION_LABELS = {};
  const titleFromId = (s) => s;
  ${grab(/function heroGearPieceName\([\s\S]*?\n\}/)}
  return heroGearPieceName;
`)();
check("bottom_right reads as Boots", pieceName("bottom_right"), "Boots");
check("top_left reads as Goggles", pieceName("top_left"), "Goggles");
check("top_right reads as Gauntlet", pieceName("top_right"), "Gauntlet");
check("bottom_left reads as Belt", pieceName("bottom_left"), "Belt");
check("an explicit piece name still wins", pieceName("bottom_right", { name: "Frosted Boots" }), "Frosted Boots");

// --- 7. the AI Planner's own hero gear path is gated too --------------------
has(
  "planner hero gear computes a ceiling",
  /const ceiling = heroGearCanEmpowerAtLevel\(piece\.level\)\s*\n\s*\? heroGearEmpowermentCapForMastery\(piece\.level\)/,
);
has("planner target respects that ceiling", /Math\.min\(HERO_GEAR_MAX_ENHANCEMENT, ceiling, current \+ 10\)/);
has("planner names the item", /item: `\$\{hero\.name \|\| setLabel\} \$\{heroGearPieceName\(slot, piece\)\}`/);

// --- 8. placeholder benefits are labelled, not hidden -----------------------
has("building benefit flagged as estimated", /benefitEstimated: "Building stat gains are not in the workbook yet/);
has("hero gear benefit flagged as estimated", /benefitEstimated: "Ranked on how many stat lines move/);
has("estimated rows are excluded from the headline pick", /filtered\.find\(\(candidate\) => !candidate\.benefitEstimated\)/);
has("estimated marker rendered in the score cell", /class="score-estimated"/);

console.log(failed ? `\n${failed} FAILED` : "\nAll smart recommendation checks passed");
process.exit(failed ? 1 : 0);
