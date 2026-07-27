// Wave 22: game-verified reforge/mastery rules, skins module, corrected identity.
const fs = require("fs");
const g = JSON.parse(fs.readFileSync(__dirname + "/../data/game-data.json", "utf8"));
const st = JSON.parse(fs.readFileSync(__dirname + "/../data/current-player-state.json", "utf8"));
const ec = st.extracted_current;
let failed = 0;
const check = (n, c) => { console.log(c ? "PASS" : "FAIL", "-", n); if (!c) failed++; };

const r = g.hero_gear_reforge_rules;
check("enhancement reforge returns 100% XP", r.enhancement_reforge.returns.hero_gear_xp === 1.0);
check("mastery reforge returns 50% essence", r.mastery_reforge.returns.essence_stones === 0.5);
check("mastery reforge returns 100% mythic gear", r.mastery_reforge.returns.mythic_gear === 1.0);
check("ascended gear excluded from reforge", /Ascended/i.test(r.restriction));
check("mithril documented as unused", /not referenced/i.test(r.mithril));
const m16 = g.hero_gear_mastery_levels.find((x) => x.scope === "base" && Number(x.level) === 16);
check("mastery Lv16 = 160 essence + 6 mythic gear", m16.essence_stones === 160 && m16.mythic_gear === 6);
check("mastery Lv16 game_verified", m16.verification_status === "game_verified");

check("identity is B2D (not the misread BMO)", ec.profile.alliance === "B2D" && ec.profile.chief_name === "[B2D]Sorrow");
check("wild marks split per rarity", ec.resources.wild_marks_common === 77 && ec.resources.wild_marks_advanced === 6);
check("no stale aggregate wild mark field", ec.resources.common_wild_marks === undefined);
check("mythic gear = 0 (forge panel)", ec.resources.mythic_gear === 0);
check("mithril = 0", ec.resources.mithril === 0);
check("skins totals captured with caps", ec.skins.totals.troops_defense.current === 61.0 && ec.skins.totals.troops_defense.cap === 300.0);
check("pet refinement sample captured", ec.pets_refinement_verified.cave_lion.cap_percent === 22.35);

// hero gear from wave21 must still hold
check("edith gear game-accurate", ec.hero_gear.edith.gear.bottom_left.level === 16 && ec.hero_gear.edith.gear.bottom_left.enhancement === 100);
check("gwen gear game-accurate", ec.hero_gear.gwen.gear.top_left.enhancement === 50);
process.exit(failed ? 1 : 0);
