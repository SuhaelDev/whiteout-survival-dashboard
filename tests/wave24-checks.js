// Wave 24: everything below was read straight off the live game on 27 July 2026.
// If a future pass changes one of these, change it here too - that is the point of the test.
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const state = JSON.parse(fs.readFileSync(path.join(root, "data/current-player-state.json"), "utf8"));
const extract = state.extracted_current;
const r = extract.resources;

let failures = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"} - ${label}${ok ? "" : ` (got ${actual}, want ${expected})`}`);
}

// Chief gear materials, from the Gear Enhancement panel
check("hardened alloy 112,555", r.hardened_alloy, 112555);
check("polishing solution 1,081", r.polishing_solution, 1081);
check("design plans 614", r.design_plans, 614);
check("lunar amber 0", r.lunar_amber, 0);

// Charm materials, from the Charm Upgrades panel
check("charm guides 1,095", r.charm_guides, 1095);
check("charm designs 857", r.charm_designs, 857);
check("charm secrets 0", r.charm_secrets, 0);

// Hero gear materials, from Mastery Forging
check("essence stones 427", r.essence_stones, 427);
check("mythic gear 0", r.mythic_gear, 0);

// Fire crystal family, named from the item tooltips
check("fire crystals 479", r.fire_crystals, 479);
check("refined fire crystals 156", r.refined_fire_crystals, 156);
check("fire crystal shards 92", r.fire_crystal_shards, 92);

// Pets
check("taming manuals 481", r.pet_manuals, 481);
check("energizing potions 67", r.pet_potions, 67);
check("strengthening serum 8", r.pet_serum, 8);
check("common wild marks 77", r.common_wild_marks, 77);
check("advanced wild marks 6", r.advanced_wild_marks, 6);
check("stamina cans 706", r.stamina_cans, 706);

// Speedups: totals must equal the counted stacks
const MINUTES = { "1m": 1, "5m": 5, "1h": 60, "3h": 180, "8h": 480 };
const total = (stacks) =>
  Object.entries(stacks || {})
    .filter(([k]) => MINUTES[k])
    .reduce((sum, [k, n]) => sum + MINUTES[k] * Number(n || 0), 0);
["general", "construction", "training", "research", "healing", "learning"].forEach((kind) => {
  check(`${kind} speedup minutes match counted stacks`, r[`${kind}_speedups_minutes`], total(r.speedups[kind]));
});
check("construction speedups 51,089", r.construction_speedups_minutes, 51089);
check("general speedups 14,595", r.general_speedups_minutes, 14595);

// Stale duplicate keys must stay gone - they used to fight the canonical fields
["pet_wild_marks", "wild_marks_common", "wild_marks_advanced", "strengthening_serum"].forEach((key) => {
  check(`no leftover "${key}" key`, r[key], undefined);
});

// Chief gear tiers and stars
check("hat Legendary T2 (1-Star)", extract.chief_gear.hat.current, "Legendary T2 (1-Star)");
check("watch Legendary T2 (1-Star)", extract.chief_gear.watch.current, "Legendary T2 (1-Star)");
check("coat Legendary T3 (3-Star)", extract.chief_gear.coat.current, "Legendary T3 (3-Star)");
check("pants Legendary T3 (3-Star)", extract.chief_gear.pants.current, "Legendary T3 (3-Star)");
check("ring Legendary T3", extract.chief_gear.ring.current, "Legendary T3");
check("cudgel Legendary T3", extract.chief_gear.cudgel.current, "Legendary T3");

// Charms: 9 on hat and watch, 10 on coat and pants, 11 on ring and cudgel
Object.entries({ hat: 9, watch: 9, coat: 10, pants: 10, ring: 11, cudgel: 11 }).forEach(([slot, level]) => {
  ["top", "left", "right"].forEach((pos) => {
    check(`charm ${slot} ${pos} = ${level}`, extract.charms[`${slot}_${pos}`].current, level);
  });
});

// Hero gear, per hero and slot
const HERO_GEAR = {
  edith: { top_left: [15, 100], top_right: [15, 99], bottom_left: [16, 100], bottom_right: [15, 60] },
  bradley: { top_left: [15, 100], top_right: [13, 40], bottom_left: [13, 40], bottom_right: [15, 80] },
  gordon: { top_left: [12, 59], top_right: [12, 40], bottom_left: [12, 40], bottom_right: [13, 59] },
  gwen: { top_left: [10, 50], top_right: [7, 40], bottom_left: [7, 40], bottom_right: [8, 50] },
  hector: { top_left: [8, 40], top_right: [8, 50], bottom_left: [8, 50], bottom_right: [7, 40] },
};
Object.entries(HERO_GEAR).forEach(([hero, slots]) => {
  Object.entries(slots).forEach(([slot, [level, enhancement]]) => {
    const piece = extract.hero_gear[hero].gear[slot];
    check(`${hero} ${slot} Lv.${level}`, piece.level, level);
    check(`${hero} ${slot} +${enhancement}`, piece.enhancement, enhancement);
  });
});

// The capture must carry an id, so a fresh read always lands over a stale cloud row
check("capture has an id", typeof extract.capture_id, "string");
check("state carries no pre-applied capture marker", state.extract_applied_capture, undefined);

// ---- Wave 25: the eleven fields read on the second pass of 27 July ----
check("steel 2.8M", r.steel, 2800000);
check("fire crystal shards 92", r.fire_crystal_shards, 92);
check("pet food 173,190", r.pet_food, 173190);
check("books of knowledge 3,510", r.books_of_knowledge, 3510);
check("affinity gift value 118,580", r.expert_affinity, 118580);
check("hero gear xp 11,880", r.hero_gear_xp, 11880);
check("mithril 18", r.mithril, 18);
check("mythic general shards 310", r.mythic_general_shards, 310);
check("epic general shards 72", r.epic_general_shards, 72);
check("rare general shards 2", r.rare_general_shards, 2);
check("exclusive-gear widgets 0", r.widgets, 0);
check("match stakes 144,200", r.match_stakes, 144200);
check("pet custom chests 0", r.pet_custom_chests, 0);
check("common sigils 126", r.common_sigils, 126);

// Affinity total must equal the counted gift stacks
const gifts = r.expert_affinity_gifts_observed;
const giftValue = gifts.compass.owned * gifts.compass.affinity_each
  + gifts.fiery_heart.owned * gifts.fiery_heart.affinity_each
  + gifts.sail_of_conquest.owned * gifts.sail_of_conquest.affinity_each;
check("affinity total matches counted gifts", r.expert_affinity, giftValue);

// Hero Gear XP must equal the counted components - this is the number that was
// previously mislabelled as "Widgets"
const xp = r.hero_gear_xp_items_observed;
check("gear xp matches counted components", r.hero_gear_xp, xp.xp_100_components * 100 + xp.xp_10_components * 10);

// Per-expert sigils
Object.entries({ cyrille: 0, agnes: 15, holger: 9, romulus: 17, fabian: 6, baldur: 0, valeria: 2, ronne: 10, kathy: 2, gareth: 29 })
  .forEach(([id, count]) => check(`${id} sigils ${count}`, r[`sigils_${id}`], count));

console.log(failures ? `\n${failures} FAILED` : "\nAll wave24 checks passed");
process.exit(failures ? 1 : 0);
