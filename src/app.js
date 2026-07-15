const STORAGE_KEY = "wos-personal-dashboard-state-v1";
const CLOUD_SYNC_KEY_STORAGE_KEY = "wos-personal-dashboard-cloud-sync-key-v1";
const CLOUD_AUTO_SYNC_STORAGE_KEY = "wos-personal-dashboard-cloud-auto-sync-v1";
const CLOUD_SYNC_ENABLED = true;
const CLOUD_LOCAL_NEWER_GRACE_MS = 1000;
const MODULES = [
  ["overview", "Overview"],
  ["planner", "AI Planner"],
  ["current-extract", "Current Extract"],
  ["buildings", "Buildings"],
  ["chief-gear", "Chief Gear"],
  ["charms", "Charms"],
  ["heroes", "Heroes"],
  ["hero-gear", "Hero Gear"],
  ["pets", "Pets"],
  ["experts", "Experts"],
  ["research", "Research"],
  ["t12-research", "T12 Research"],
  ["troops", "Troop Training"],
  ["svs", "SvS Planner"],
  ["resources", "Resources"],
  ["sources", "Sources"],
];

const RESOURCE_LABELS = {
  meat: "Meat",
  wood: "Wood",
  coal: "Coal",
  iron: "Iron",
  fire_crystals: "FC",
  refined_fire_crystals: "RFC",
  hardened_alloy: "Alloy",
  polishing_solution: "Polish",
  design_plans: "Plans",
  lunar_amber: "Amber",
  charm_guides: "Guides",
  charm_designs: "Designs",
  charm_secrets: "Secrets",
  mythic_general_shards: "Mythic Shards",
  epic_general_shards: "Epic Shards",
  rare_general_shards: "Rare Shards",
  hero_gear_xp: "Hero Gear XP",
  mythic_gear: "Mythic Gear",
  mithril: "Mithril",
  essence_stones: "Essence Stones",
  pet_food: "Pet Food",
  pet_manuals: "Taming Manual",
  pet_potions: "Energizing Potion",
  pet_serum: "Strengthening Serum",
  expert_affinity: "Affinity",
  common_sigils: "Sigils",
  books_of_knowledge: "Books",
  steel: "Steel",
  fire_crystal_shards: "Shards",
  chief_stamina: "Chief Stamina",
  stamina_cans: "Stamina Cans (10)",
  pet_custom_chests: "Pet Custom Chests",
  common_wild_marks: "Common Wild Mark",
  advanced_wild_marks: "Advanced Wild Mark",
  healing_speedups_minutes: "Healing Speedups",
  learning_speedups_minutes: "Learning Speedups",
  construction_speedups_minutes: "Construction Speedups",
  research_speedups_minutes: "Research Speedups",
  training_speedups_minutes: "Training Speedups",
  general_speedups_minutes: "General Speedups",
};
for (let gen = 1; gen <= 16; gen += 1) RESOURCE_LABELS[`widgets_gen${gen}`] = `Widgets Gen ${gen}`;

const BUILDING_FIELDS = ["meat", "wood", "coal", "iron", "fire_crystals", "refined_fire_crystals"];
const GEAR_FIELDS = [
  ["hardened_alloy", "alloy"],
  ["polishing_solution", "polish"],
  ["design_plans", "design_plans"],
  ["lunar_amber", "amber"],
];
const CHARM_FIELDS = [
  ["charm_guides", "guides"],
  ["charm_designs", "designs"],
  ["charm_secrets", "secrets"],
];
const CHIEF_TROOP_GROUPS = [
  { id: "infantry", label: "Infantry", gearSlots: ["coat", "pants"] },
  { id: "lancer", label: "Lancer", gearSlots: ["hat", "watch"] },
  { id: "marksman", label: "Marksman", gearSlots: ["ring", "cudgel"] },
];
const PET_FIELDS = [
  ["pet_food", "food"],
  ["pet_manuals", "manuals"],
  ["pet_potions", "potions"],
  ["pet_serum", "serum"],
];
const PET_CHECK_FIELDS = [...PET_FIELDS, ["pet_custom_chests", "chests"]];
const PET_QUALITY_TIERS = ["None", "Green", "Blue", "Purple", "Gold"];
const PET_REFINE_STATS = [
  ["infantry_lethality", "Infantry Lethality"],
  ["infantry_health", "Infantry Health"],
  ["lancer_lethality", "Lancer Lethality"],
  ["lancer_health", "Lancer Health"],
  ["marksman_lethality", "Marksman Lethality"],
  ["marksman_health", "Marksman Health"],
];
const TROOP_TYPES = ["infantry", "lancer", "marksman"];
const SVS_SPEEDUP_POINTS_PER_MINUTE = 30;
const HERO_GEAR_FIELDS = ["essence_stones", "hero_gear_xp", "mythic_gear", "mithril"];
const HERO_GEAR_INVESTMENT_FIELDS = ["essence_stones", "hero_gear_xp", "mythic_gear", "mithril"];
const HERO_GEAR_MAX_ENHANCEMENT = 100;
const HERO_GEAR_MAX_EMPOWERMENT = 100;
const HERO_GEAR_EMPOWERMENT_MIN_MASTERY_LEVEL = 11;
const HERO_GEAR_EMPOWERMENT_SOURCE_OFFSET = 100;
const HERO_GEAR_NORMAL_ENHANCEMENT_XP_OVERRIDES = {
  90: 1910,
};
const HERO_GEAR_DEFAULT_EMPOWERMENT_BREAKPOINTS = [
  { enhancement: 20, mode: "Expedition", statKind: "Attack", value_percent: 20 },
  { enhancement: 40, mode: "Exploration", stat: "Hero Health Up", value_percent: 7.5 },
  { enhancement: 60, mode: "Expedition", statKind: "Defense", value_percent: 30 },
  { enhancement: 80, mode: "Exploration", stat: "Hero Defense Up", value_percent: 15 },
  { enhancement: 100, mode: "Expedition", statKind: "Defense", value_percent: 50 },
];
const HERO_GEAR_EMPOWERMENT_STAT_PATTERNS = {
  attack_side: [
    { enhancement: 20, mode: "Expedition", statKind: "Attack", value_percent: 20 },
    { enhancement: 40, mode: "Exploration", stat: "Hero Health Up", value_percent: 7.5 },
    { enhancement: 60, mode: "Expedition", statKind: "Defense", value_percent: 30 },
    { enhancement: 80, mode: "Exploration", stat: "Hero Attack Up", value_percent: 15 },
    { enhancement: 100, mode: "Expedition", statKind: "Attack", value_percent: 50 },
  ],
  defense_side: [
    { enhancement: 20, mode: "Expedition", statKind: "Defense", value_percent: 20 },
    { enhancement: 40, mode: "Exploration", stat: "Hero Health Up", value_percent: 7.5 },
    { enhancement: 60, mode: "Expedition", statKind: "Attack", value_percent: 30 },
    { enhancement: 80, mode: "Exploration", stat: "Hero Defense Up", value_percent: 15 },
    { enhancement: 100, mode: "Expedition", statKind: "Defense", value_percent: 50 },
  ],
};
const HERO_GEAR_SLOT_EMPOWERMENT_PATTERNS = {
  goggles: "attack_side",
  top_left: "attack_side",
  belt: "attack_side",
  bottom_left: "attack_side",
  gauntlets: "defense_side",
  gloves: "defense_side",
  top_right: "defense_side",
  boots: "defense_side",
  bottom_right: "defense_side",
};
const SMART_RECOMMENDATION_BIASES = [
  ["balanced", "Balanced stats"],
  ["infantry", "Infantry bias"],
  ["lancer", "Lancer bias"],
  ["marksman", "Marksman bias"],
  ["attack", "Attack bias"],
  ["defense", "Defense bias"],
  ["lethality", "Lethality bias"],
  ["health", "Health bias"],
  ["power", "Power / SVS bias"],
];
const SMART_RECOMMENDATION_LIMIT = 120;
const MATERIAL_EXCHANGE_SETS = {
  chief_gear: {
    label: "Enhancement Material Exchange",
    fields: GEAR_FIELDS,
    rules: [
      { id: "gear_design_to_amber", from: "design_plans", fromQty: 10, to: "lunar_amber", toQty: 1, limit: 500 },
      { id: "gear_design_to_polish", from: "design_plans", fromQty: 1, to: "polishing_solution", toQty: 3, limit: 500 },
      { id: "gear_design_to_alloy", from: "design_plans", fromQty: 1, to: "hardened_alloy", toQty: 300, limit: 500 },
      { id: "gear_polish_to_design", from: "polishing_solution", fromQty: 10, to: "design_plans", toQty: 1, limit: 50 },
      { id: "gear_polish_to_alloy", from: "polishing_solution", fromQty: 1, to: "hardened_alloy", toQty: 50, limit: 1000 },
      { id: "gear_alloy_to_design", from: "hardened_alloy", fromQty: 1000, to: "design_plans", toQty: 1, limit: 50 },
      { id: "gear_alloy_to_polish", from: "hardened_alloy", fromQty: 200, to: "polishing_solution", toQty: 1, limit: 500 },
    ],
  },
  chief_charms: {
    label: "Chief Charm Material Exchange",
    fields: CHARM_FIELDS,
    rules: [
      { id: "charm_guides_to_designs", from: "charm_guides", fromQty: 2, to: "charm_designs", toQty: 1, limit: 500 },
      { id: "charm_designs_to_guides", from: "charm_designs", fromQty: 2, to: "charm_guides", toQty: 1, limit: 500 },
      { id: "charm_guides_to_secrets", from: "charm_guides", fromQty: 40, to: "charm_secrets", toQty: 1, limit: 50 },
      { id: "charm_designs_to_secrets", from: "charm_designs", fromQty: 40, to: "charm_secrets", toQty: 1, limit: 50 },
    ],
  },
  pet_chests: {
    label: "Pet Adv. Custom Chest",
    fields: PET_CHECK_FIELDS,
    rules: [
      { id: "chest_to_serum", from: "pet_custom_chests", fromQty: 1, to: "pet_serum", toQty: 1, limit: 100000 },
      { id: "chest_to_potions", from: "pet_custom_chests", fromQty: 1, to: "pet_potions", toQty: 2, limit: 100000 },
      { id: "chest_to_manuals", from: "pet_custom_chests", fromQty: 1, to: "pet_manuals", toQty: 7, limit: 100000 },
    ],
  },
};
const T12_RESEARCH_FIELDS = [
  ["steel", "steel"],
  ["refined_fire_crystals", "refined_fire_crystals"],
  ["fire_crystal_shards", "fire_crystal_shards"],
  ["meat", "meat"],
  ["wood", "wood"],
  ["coal", "coal"],
  ["iron", "iron"],
];
const RESEARCH_COST_FIELDS = T12_RESEARCH_FIELDS;
const T12_UNLOCKED = false;
const OBSERVED_STAT_FIELDS = [
  ["troops_attack_percent", "Troop Attack", "percent"],
  ["troops_defense_percent", "Troop Defense", "percent"],
  ["troops_lethality_percent", "Troop Lethality", "percent"],
  ["troops_health_percent", "Troop Health", "percent"],
  ["troops_deployment_capacity", "Deployment Capacity", "number"],
  ["rally_capacity", "Rally Capacity", "number"],
];
const EXPERT_STAT_LABELS = {
  Attack: "Troop Attack",
  Defense: "Troop Defense",
  "Atk/Def": "Troop Attack / Defense",
  "Leth/Hlth": "Troop Lethality / Health",
  "Lth/Hlth": "Troop Lethality / Health",
  Deploy: "Deployment Capacity",
  Rally: "Rally Capacity",
  "Bear +": "Bear Hunt Bonus",
};
const CALCULATOR_INVENTORY_GROUPS = [
  { title: "Buildings", note: "FC upgrades and regular construction", fields: BUILDING_FIELDS },
  { title: "Chief Gear", note: "Gear level and star upgrades", fields: GEAR_FIELDS },
  { title: "Chief Charms", note: "Charm levels by troop group", fields: CHARM_FIELDS },
  { title: "Hero Gear", note: "Level, enhancement, mastery, and special gear materials", fields: ["hero_gear_xp", "mythic_gear", "mithril", "essence_stones"] },
  {
    title: "Pets",
    note: "Level materials, wild marks, and custom chests",
    fields: [...PET_FIELDS, "pet_custom_chests", "common_wild_marks", "advanced_wild_marks"],
  },
  { title: "Experts", note: "Affinity, sigils, and learning books", fields: ["expert_affinity", "common_sigils", "books_of_knowledge"] },
  { title: "War Academy", note: "Academy research resources", fields: ["steel", "fire_crystal_shards"] },
  {
    title: "Hero Shards & Widgets",
    note: "General shards plus exclusive-gear widgets by hero generation",
    fields: ["mythic_general_shards", "epic_general_shards", "rare_general_shards"],
  },
  {
    title: "Chief Items",
    note: "Stamina cans for pet adventures, beast hunts, and rallies (each can = 10 stamina)",
    fields: ["stamina_cans"],
  },
  {
    title: "Speedups",
    note: "Enter speedups as total minutes",
    fields: [
      "construction_speedups_minutes",
      "general_speedups_minutes",
      "research_speedups_minutes",
      "training_speedups_minutes",
      "learning_speedups_minutes",
      "healing_speedups_minutes",
    ],
  },
];
const WIDGET_GEN_FIELDS = Array.from({ length: 16 }, (_, i) => `widgets_gen${i + 1}`);
const CONSTRUCTION_BUFF_DEFS = [
  ["minister", "Minister construction buff"],
  ["pet", "Pet construction buff"],
  ["chief_order", "Chief Order construction buff"],
  ["event_city", "Event / city construction buff"],
  ["custom", "Custom construction buff"],
];

let gameData;
let templateState;
let extractedState;
let visualAssets = {};
let state;
let activeTab = new URLSearchParams(window.location.search).get("tab") || "overview";
let saveTimer;
let cloudSaveTimer;
let lastPlannerPayload = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function fmt(value, decimals = 0) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return "-";
  if (Math.abs(number) >= 1000000) {
    return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(number);
  }
  return Intl.NumberFormat("en", { maximumFractionDigits: decimals }).format(number);
}

function timeFmt(seconds) {
  const total = Number(seconds || 0);
  if (!total) return "0m";
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeDeep(base, overlay) {
  if (Array.isArray(base) || Array.isArray(overlay)) return overlay ?? base;
  if (typeof base !== "object" || base === null) return overlay ?? base;
  const result = { ...base };
  if (typeof overlay !== "object" || overlay === null) return result;
  Object.entries(overlay).forEach(([key, value]) => {
    result[key] = key in result ? mergeDeep(result[key], value) : value;
  });
  return result;
}

function getPath(object, path) {
  return path.split(".").reduce((current, key) => (current == null ? undefined : current[key]), object);
}

function setPath(object, path, value) {
  const keys = path.split(".");
  let current = object;
  keys.slice(0, -1).forEach((key) => {
    if (!current[key] || typeof current[key] !== "object") current[key] = {};
    current = current[key];
  });
  current[keys.at(-1)] = value;
}

function readSavedState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function extractedBaselineState() {
  return applyExtractedState(clone(templateState), extractedState);
}

function stateFromSaved(savedState) {
  const baseline = extractedBaselineState();
  normalizeTargets(baseline);
  if (!savedState) return baseline;
  let merged = mergeDeep(baseline, savedState);
  if (extractedState) merged.extracted_current = extractedState;
  // Re-apply the bundled game extract on top of saved/cloud state whenever the
  // extract is newer than the last one this state absorbed. Keeps deployed
  // captures (backpack counts, pet refinement, notes) flowing into live DBs.
  const extractTime = Date.parse(extractedState?.extracted_at || "");
  const appliedTime = Date.parse(savedState?.extract_applied_at || "");
  if (Number.isFinite(extractTime) && (!Number.isFinite(appliedTime) || extractTime > appliedTime)) {
    merged = applyExtractedState(merged, extractedState);
    merged.extract_applied_at = extractedState.extracted_at;
  }
  normalizeTargets(merged);
  return merged;
}

async function fetchOptionalJson(path) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function assetFileSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function simpleLevelCode(value) {
  if (value == null) return "";
  const text = String(value).trim();
  const levelMatch = text.match(/^Lv\.?\s*(\d+)$/i);
  if (levelMatch) return levelMatch[1];
  return text;
}

function speedupMinutes(group = {}) {
  return Object.entries(group).reduce((total, [unit, count]) => {
    const amount = Number(count || 0);
    if (unit.endsWith("m")) return total + amount * Number(unit.replace("m", "") || 0);
    if (unit.endsWith("h")) return total + amount * Number(unit.replace("h", "") || 0) * 60;
    if (unit.endsWith("d")) return total + amount * Number(unit.replace("d", "") || 0) * 1440;
    return total;
  }, 0);
}

function percentNumber(text) {
  const matches = String(text || "").match(/[+ ](\d+(?:\.\d+)?)%/g);
  if (!matches?.length) return 0;
  const last = matches.at(-1).match(/(\d+(?:\.\d+)?)/);
  return last ? Number(last[1]) : 0;
}

function observedStars(hero) {
  if (Number.isFinite(Number(hero?.stars))) return Number(hero.stars);
  const full = String(hero?.stars_observed || "").match(/(\d+)\s+full/i);
  if (full) return Number(full[1]);
  if (/no filled/i.test(String(hero?.stars_observed || ""))) return 0;
  return 0;
}

function applyExtractedState(baseState, extracted) {
  if (!extracted) return baseState;
  if (extracted.extracted_current) {
    extracted = extracted.extracted_current;
  }
  const next = mergeDeep(clone(baseState), { extracted_current: extracted });

  if (extracted.profile) {
    next.profile.chief_name = extracted.profile.chief_name || next.profile.chief_name;
    next.profile.state_number = extracted.profile.state_number || next.profile.state_number;
    next.profile.furnace_level = extracted.profile.furnace_level || "Unconfirmed";
    next.profile.power = extracted.profile.power ?? next.profile.power;
    next.profile.vip_level = extracted.profile.vip_level ?? next.profile.vip_level;
    next.profile.alliance = extracted.profile.alliance || next.profile.alliance;
    next.profile.research_speed_pct = percentNumber(extracted.buildings?.research_center?.research_speed_bonus) || next.profile.research_speed_pct;
    next.profile.construction_speed_pct = Number(String(extracted.research?.aggregate_bonuses_visible?.growth?.construction_speed || "").replace(/[^0-9.]/g, "")) || next.profile.construction_speed_pct;
    next.profile.training_speed_pct = Number(String(extracted.research?.aggregate_bonuses_visible?.growth?.training_speed || "").replace(/[^0-9.]/g, "")) || next.profile.training_speed_pct;
  }

  // Bonus Overview (Chief Profile) is the authoritative account-wide stat panel.
  const bonusOverview = extracted.bonus_overview || {};
  if (bonusOverview.growth) {
    if (Number.isFinite(Number(bonusOverview.growth.construction_speed_percent))) {
      next.profile.construction_speed_pct = Number(bonusOverview.growth.construction_speed_percent);
    }
    if (Number.isFinite(Number(bonusOverview.growth.research_speed_percent))) {
      next.profile.research_speed_pct = Number(bonusOverview.growth.research_speed_percent);
    }
  }
  if (Number.isFinite(Number(bonusOverview.military?.training_speed_percent))) {
    next.profile.training_speed_pct = Number(bonusOverview.military.training_speed_percent);
  }
  if (Number.isFinite(Number(bonusOverview.power?.troops_power))) {
    const powerParts = Object.values(bonusOverview.power).map(Number).filter(Number.isFinite);
    next.profile.power_breakdown_total = powerParts.reduce((sum, value) => sum + value, 0);
  }

  if (extracted.construction && typeof extracted.construction === "object") {
    next.construction = mergeDeep(next.construction || {}, clone(extracted.construction));
  }

  Object.entries(extracted.resources || {}).forEach(([key, value]) => {
    if (typeof value === "number") next.resources[key] = value;
  });
  const speedups = extracted.resources?.speedups || null;
  if (speedups) {
    next.resources.general_speedups_minutes = speedupMinutes(speedups.general);
    next.resources.construction_speedups_minutes = speedupMinutes(speedups.construction);
    next.resources.research_speedups_minutes = speedupMinutes(speedups.research);
    next.resources.training_speedups_minutes = speedupMinutes(speedups.training);
    next.resources.learning_speedups_minutes = speedupMinutes(speedups.learning);
    if (speedups.healing) next.resources.healing_speedups_minutes = speedupMinutes(speedups.healing);
  }

  Object.entries(extracted.buildings || {}).forEach(([buildingId, building]) => {
    if (!next.buildings[buildingId] || !building.current) return;
    next.buildings[buildingId].current = simpleLevelCode(building.current);
  });

  Object.entries(extracted.chief_gear || {}).forEach(([slotId, gear]) => {
    if (!next.chief_gear[slotId] || !gear.current) return;
    next.chief_gear[slotId].current = gear.current;
    next.chief_gear[slotId].item_name = gear.item_name;
    next.chief_gear[slotId].power = gear.power;
  });

  Object.entries(extracted.charms || {}).forEach(([slotId, charm]) => {
    if (!next.charms[slotId] || charm.current == null) return;
    next.charms[slotId].current = Number(charm.current);
  });

  Object.entries(extracted.heroes || {}).forEach(([heroId, hero]) => {
    const mappedId = heroId === "lumak_bokan" ? "walis_bokan" : heroId;
    if (!next.heroes[mappedId]) return;
    next.heroes[mappedId].owned = hero.owned !== false;
    next.heroes[mappedId].current_stars = observedStars(hero);
    next.heroes[mappedId].current_level = hero.current_level;
    next.heroes[mappedId].power = hero.power ?? hero.power_preview;
    if (hero.star_tier != null) next.heroes[mappedId].current_star_tier = Number(hero.star_tier) || 0;
    if (hero.widget_level != null) next.heroes[mappedId].current_widget_level = Number(hero.widget_level) || 0;
    const extractedShards = hero.shards_current ?? hero.shards;
    if (extractedShards != null) next.heroes[mappedId].shards = extractedShards;
  });

  const petIdByName = Object.fromEntries(gameData.pets.map((pet) => [normalizeKey(pet.name), pet.pet_id]));
  Object.entries(extracted.pets || {}).forEach(([petId, pet]) => {
    if (!pet || typeof pet !== "object") return;
    const level = pet.level ?? pet.current_level ?? pet.current;
    const mappedId = next.pets[petId] ? petId : petIdByName[normalizeKey(pet.name)];
    if (!mappedId || !next.pets[mappedId]) return;
    if (level != null) next.pets[mappedId].current = String(level);
    if (pet.power != null) next.pets[mappedId].power = pet.power;
    if (pet.refine_stats && typeof pet.refine_stats === "object") {
      next.pets[mappedId].refine_stats = clone(pet.refine_stats);
    }
  });

  Object.entries(extracted.experts || {}).forEach(([expertId, expert]) => {
    if (!next.experts[expertId] || expert.level == null) return;
    next.experts[expertId].relationship_current = expert.level === 100 && /intimate|max/i.test(`${expert.relationship || ""} ${expert.affinity_status || ""}`) ? "100.1" : String(expert.level);
    next.experts[expertId].power = expert.power;
    next.experts[expertId].relationship = expert.relationship;
  });

  if (next.research.normal_research_center) {
    next.research.normal_research_center.priority = "Active";
    next.research.normal_research_center.current_note =
      extracted.research?.active_research?.name || extracted.research?.normal_research_center?.current_note || next.research.normal_research_center.current_note || "";
  }
  if (next.research.war_academy_helios) {
    next.research.war_academy_helios.priority = "Active";
    next.research.war_academy_helios.current_note =
      extracted.research?.war_academy?.active_research?.name || extracted.research?.war_academy_helios?.current_note || next.research.war_academy_helios.current_note || "";
  }
  if (next.research.current_experts) {
    next.research.current_experts.priority = "Active";
    next.research.current_experts.current_note =
      extracted.experts?.active_learning?.expert || extracted.research?.current_experts?.current_note || next.research.current_experts.current_note || "";
  }

  return next;
}

function persistState({ cloud = true } = {}) {
  state.last_saved = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  $("#saveStatus").textContent = `Saved ${new Date(state.last_saved).toLocaleTimeString()}`;
  if (cloud && cloudAutoSyncEnabled()) scheduleCloudSave();
}

function scheduleSave({ render = false } = {}) {
  $("#saveStatus").textContent = "Saving";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    persistState();
    if (render) renderActive();
  }, 150);
}

function setCloudSyncStatus(message) {
  const status = $("#cloudSyncStatus");
  if (status) status.textContent = message;
}

function cloudAutoSyncEnabled() {
  return CLOUD_SYNC_ENABLED || localStorage.getItem(CLOUD_AUTO_SYNC_STORAGE_KEY) === "true";
}

function cloudSyncKey() {
  return ($("#cloudSyncKey")?.value || localStorage.getItem(CLOUD_SYNC_KEY_STORAGE_KEY) || "").trim();
}

function rememberCloudSyncSettings() {
  const key = ($("#cloudSyncKey")?.value || "").trim();
  if (key) localStorage.setItem(CLOUD_SYNC_KEY_STORAGE_KEY, key);
  const auto = Boolean($("#cloudAutoSync")?.checked);
  localStorage.setItem(CLOUD_AUTO_SYNC_STORAGE_KEY, CLOUD_SYNC_ENABLED || auto ? "true" : "false");
}

function initCloudSyncControls() {
  const keyInput = $("#cloudSyncKey");
  const autoInput = $("#cloudAutoSync");
  if (keyInput) keyInput.value = localStorage.getItem(CLOUD_SYNC_KEY_STORAGE_KEY) || "";
  if (autoInput) autoInput.checked = cloudAutoSyncEnabled();
  setCloudSyncStatus(CLOUD_SYNC_ENABLED ? "Shared DB connecting" : keyInput?.value ? "Cloud ready" : "Local only");
}

async function cloudStateRequest(method, payload) {
  const key = cloudSyncKey();
  rememberCloudSyncSettings();
  const headers = { "Content-Type": "application/json" };
  if (key) headers["X-Dashboard-Sync-Key"] = key;
  const response = await fetch("/api/state", {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Cloud sync returned ${response.status}`);
  return body;
}

async function saveStateToCloud({ quiet = false } = {}) {
  if (!quiet) setCloudSyncStatus("Saving cloud");
  persistState({ cloud: false });
  const body = await cloudStateRequest("PUT", { state });
  const savedAt = body.updated_at ? new Date(body.updated_at).toLocaleTimeString() : new Date().toLocaleTimeString();
  setCloudSyncStatus(`Cloud saved ${savedAt}`);
}

function scheduleCloudSave() {
  setCloudSyncStatus("Cloud saving");
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(async () => {
    try {
      await saveStateToCloud({ quiet: true });
    } catch (error) {
      setCloudSyncStatus(`Cloud error: ${error.message}`);
    }
  }, 1200);
}

async function loadStateFromCloud() {
  setCloudSyncStatus("Loading cloud");
  const body = await cloudStateRequest("GET");
  if (!body.state) throw new Error("No cloud state has been saved yet.");
  state = stateFromSaved(body.state);
  persistState({ cloud: false });
  renderActive({ focusNutshell: true });
  const loadedAt = body.updated_at ? new Date(body.updated_at).toLocaleTimeString() : "now";
  setCloudSyncStatus(`Cloud loaded ${loadedAt}`);
}

function stateTimeValue(savedState, fallbackDate) {
  const stateTime = Date.parse(savedState?.last_saved || "");
  if (Number.isFinite(stateTime)) return stateTime;
  const fallbackTime = Date.parse(fallbackDate || "");
  return Number.isFinite(fallbackTime) ? fallbackTime : 0;
}

async function syncInitialStateWithCloud(localState, hasSavedLocalState) {
  if (!CLOUD_SYNC_ENABLED) return;
  setCloudSyncStatus("Loading shared DB");
  try {
    const body = await cloudStateRequest("GET");
    if (!body.state) {
      state = localState;
      if (hasSavedLocalState) {
        await saveStateToCloud({ quiet: true });
        setCloudSyncStatus("Shared DB seeded from this browser");
      } else {
        setCloudSyncStatus("Shared DB empty");
      }
      return;
    }

    const cloudState = stateFromSaved(body.state);
    const localTime = stateTimeValue(localState);
    const cloudTime = Math.max(stateTimeValue(cloudState), stateTimeValue(null, body.updated_at));

    if (hasSavedLocalState && localTime > cloudTime + CLOUD_LOCAL_NEWER_GRACE_MS) {
      state = localState;
      await saveStateToCloud({ quiet: true });
      setCloudSyncStatus("Shared DB updated from this browser");
      return;
    }

    state = cloudState;
    persistState({ cloud: false });
    const loadedAt = body.updated_at ? new Date(body.updated_at).toLocaleTimeString() : "now";
    setCloudSyncStatus(`Shared DB loaded ${loadedAt}`);
  } catch (error) {
    state = localState;
    setCloudSyncStatus(`Shared DB offline: ${error.message}`);
  }
}

function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key];
    if (!acc[value]) acc[value] = [];
    acc[value].push(item);
    return acc;
  }, {});
}

function sortByNumber(items, key) {
  return [...items].sort((a, b) => Number(a[key] || 0) - Number(b[key] || 0));
}

function makeCost(fields) {
  return fields.reduce((acc, field) => {
    const key = Array.isArray(field) ? field[0] : field;
    acc[key] = 0;
    return acc;
  }, {});
}

function addCost(target, source) {
  Object.entries(source).forEach(([key, value]) => {
    target[key] = (target[key] || 0) + Number(value || 0);
  });
  return target;
}

function rangeCost(rows, currentId, targetId, options) {
  const { idKey, orderKey, fields } = options;
  const sorted = sortByNumber(rows, orderKey);
  const current = sorted.find((row) => String(row[idKey]) === String(currentId));
  const target = sorted.find((row) => String(row[idKey]) === String(targetId));
  const cost = makeCost(fields);
  if (!target) return cost;
  const currentOrder = current ? Number(current[orderKey] || 0) : -Infinity;
  const targetOrder = Number(target[orderKey] || 0);
  if (targetOrder <= currentOrder) return cost;
  sorted
    .filter((row) => Number(row[orderKey] || 0) > currentOrder && Number(row[orderKey] || 0) <= targetOrder)
    .forEach((row) => {
      fields.forEach((field) => {
        const outKey = Array.isArray(field) ? field[0] : field;
        const inKey = Array.isArray(field) ? field[1] : field;
        cost[outKey] += Number(row[inKey] || 0);
      });
    });
  return cost;
}

function rangeSum(rows, currentId, targetId, options) {
  const { idKey, orderKey, field } = options;
  const sorted = sortByNumber(rows, orderKey);
  const current = sorted.find((row) => String(row[idKey]) === String(currentId));
  const target = sorted.find((row) => String(row[idKey]) === String(targetId));
  if (!target) return 0;
  const currentOrder = current ? Number(current[orderKey] || 0) : -Infinity;
  const targetOrder = Number(target[orderKey] || 0);
  if (targetOrder <= currentOrder) return 0;
  return sorted
    .filter((row) => Number(row[orderKey] || 0) > currentOrder && Number(row[orderKey] || 0) <= targetOrder)
    .reduce((total, row) => total + Number(row[field] || 0), 0);
}

function optionList(rows, labelKey, valueKey, selected) {
  return rows
    .map((row) => {
      const value = row[valueKey];
      return `<option value="${esc(value)}" ${String(value) === String(selected) ? "selected" : ""}>${esc(row[labelKey])}</option>`;
    })
    .join("");
}

function numberInput(path, value, min = 0, step = 1) {
  return `<input type="number" min="${min}" step="${esc(step)}" value="${esc(value ?? 0)}" data-path="${esc(path)}" />`;
}

function checkboxInput(path, checked) {
  return `<input type="checkbox" ${checked ? "checked" : ""} data-path="${esc(path)}" />`;
}

// Live "fineprint" previews under resource inputs so big numbers are easy to sanity-check.
const FINEPRINT_ABBREV_FIELDS = new Set(["meat", "wood", "coal", "iron"]);

function abbreviatedNumberText(value) {
  const num = Math.abs(Number(value) || 0);
  if (num < 1000) return "";
  const units = [
    [1e12, "T"],
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];
  for (const [size, suffix] of units) {
    if (num >= size) {
      const scaled = num / size;
      const text = scaled >= 100 ? String(Math.round(scaled)) : scaled.toFixed(2).replace(/\.?0+$/, "");
      return `= ${text}${suffix}`;
    }
  }
  return "";
}

function speedupDurationText(minutesValue) {
  const minutes = Math.max(0, Math.round(Number(minutesValue) || 0));
  if (!minutes) return "";
  if (minutes < 60) return `= ${minutes}m`;
  if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const rem = minutes % 60;
    return `= ${hours}h${rem ? ` ${rem}m` : ""}`;
  }
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  return `= ${days}d${hours ? ` ${hours}h` : ""}`;
}

function resourceFineprintText(resourceId, value) {
  if (String(resourceId).endsWith("_speedups_minutes")) return speedupDurationText(value);
  if (FINEPRINT_ABBREV_FIELDS.has(String(resourceId))) return abbreviatedNumberText(value);
  return null;
}

function resourceFineprintHtml(resourceId, value) {
  const fine = resourceFineprintText(resourceId, value);
  if (fine === null) return "";
  return `<small class="value-fineprint" data-fineprint-for="resources.${esc(resourceId)}">${esc(fine)}</small>`;
}

function textInput(path, value) {
  return `<input type="text" value="${esc(value ?? "")}" data-path="${esc(path)}" />`;
}

function selectInput(path, selected, options) {
  return `<select data-path="${esc(path)}">${options
    .map(([value, label]) => `<option value="${esc(value)}" ${String(value) === String(selected) ? "selected" : ""}>${esc(label)}</option>`)
    .join("")}</select>`;
}

function resetTargetButton(action, label = "Reset target") {
  return `<button type="button" class="target-reset-button" data-reset-target="${esc(action)}">${esc(label)}</button>`;
}

function controlValue(target) {
  if (target.type === "checkbox") return target.checked;
  if (target.type === "number") return Number(target.value || 0);
  return target.value;
}

function standaloneSelect(id, options, selected = options[0]?.[0]) {
  return `<select id="${esc(id)}">${options
    .map(([value, label]) => `<option value="${esc(value)}" ${String(value) === String(selected) ? "selected" : ""}>${esc(label)}</option>`)
    .join("")}</select>`;
}

function bulkTargetControls(label, selectId, options, buttons, selected = options[0]?.[0]) {
  return `<div class="bulk-actions" aria-label="${esc(label)}">
    <span>${esc(label)}</span>
    ${standaloneSelect(selectId, options, selected)}
    ${buttons
      .map(
        (button) =>
          `<button type="button" data-bulk-action="${esc(button.action)}" data-source-select="${esc(selectId)}">${esc(button.label)}</button>`,
      )
      .join("")}
  </div>`;
}

function readBulkValue(button) {
  const source = button.dataset.sourceSelect ? document.getElementById(button.dataset.sourceSelect) : null;
  return source ? source.value : button.dataset.value;
}

const RESOURCE_ICON_KIND = {
  meat: "meat",
  wood: "wood",
  coal: "coal",
  iron: "iron",
  diamonds: "diamond",
  fire_crystals: "crystal",
  refined_fire_crystals: "refined-crystal",
  hardened_alloy: "ingot",
  polishing_solution: "polish",
  design_plans: "plans",
  lunar_amber: "amber",
  charm_guides: "book",
  charm_designs: "plans",
  charm_secrets: "secret",
  mythic_general_shards: "shard",
  epic_general_shards: "shard",
  rare_general_shards: "shard",
  hero_gear_xp: "book",
  mythic_gear: "gear",
  mithril: "ingot",
  essence_stones: "crystal",
  pet_food: "pet-food",
  pet_manuals: "book",
  pet_potions: "potion",
  pet_serum: "serum",
  expert_affinity: "affinity",
  common_sigils: "sigil",
  books_of_knowledge: "book",
  steel: "ingot",
  fire_crystal_shards: "shard",
  chief_stamina: "stamina",
  stamina_cans: "stamina",
  pet_custom_chests: "chest",
  common_wild_marks: "shard",
  advanced_wild_marks: "shard",
};
for (let gen = 1; gen <= 16; gen += 1) RESOURCE_ICON_KIND[`widgets_gen${gen}`] = "widget";

function iconKind(scope, label = "") {
  if (RESOURCE_ICON_KIND[scope]) return RESOURCE_ICON_KIND[scope];
  const text = normalizeKey(`${scope} ${label}`);
  if (/meat/.test(text)) return "meat";
  if (/wood|lumber|sawmill/.test(text)) return "wood";
  if (/coal/.test(text)) return "coal";
  if (/iron|steel|alloy|ingot/.test(text)) return "ingot";
  if (/gem|diamond/.test(text)) return "diamond";
  if (/refinedfirecrystal|refinedfc|rfc/.test(text)) return "refined-crystal";
  if (/firecrystal|crystal|shard/.test(text)) return "crystal";
  if (/amber/.test(text)) return "amber";
  if (/polish|solution/.test(text)) return "polish";
  if (/design|plan|blueprint/.test(text)) return "plans";
  if (/guide|manual|book|knowledge/.test(text)) return "book";
  if (/secret/.test(text)) return "secret";
  if (/potion|serum/.test(text)) return "potion";
  if (/shield/.test(text)) return "shield";
  if (/minister|chiefo|chieforder|order|buff|bonus/.test(text)) return "expert";
  if (/speedup|timer|time|countdown|learning|training|healing|construction|research/.test(text)) return "speedup";
  if (/deployment|capacity|marchqueue|marching|marchskin|meteor|chaser|runner|patrol|journey|sprite|warrior|knight|bunny|lantern|aurora/.test(text)) return "march";
  if (/cityskin|city|lostcity|snowman|winterofplenty|icebear|diver|rhapsody/.test(text)) return "city";
  if (/infantry/.test(text)) return "infantry";
  if (/lancer|lance/.test(text)) return "lancer";
  if (/marksman|sniper|sniping|arrow/.test(text)) return "marksman";
  if (/troop|helios|flamesquad|flamelegion/.test(text)) return "troops";
  if (/pet|lion|tiger|ape|chameleon|leopard|mammoth|gorilla|rhino|elk|roc|tapir|wolf|ox|hyena/.test(text)) return "pet";
  if (/expert|cyrille|agnes|holger|romulus|fabian|baldur|valeria|ronne|kathy/.test(text)) return "expert";
  if (/hero|edith|bradley|gordon|gwen|hector|norah|reina|lynn|ahmose|mia|flint|alonso/.test(text)) return "hero";
  if (/gear|coronet|watch|coat|pants|ring|cudgel|ward|cadence|incandescence|zeal|hat/.test(text)) return "gear";
  if (/charm|slot|left|right|top/.test(text)) return "charm";
  if (/building|furnace|academy|center|camp|mine|hut|embassy|shelter|infirmary|office|cookhouse|barricade|command/.test(text)) return "building";
  if (/research|waracademy|flame|crystalarrow|protection|armor|guardian|strike/.test(text)) return "research";
  return "generic";
}

function iconShape(kind) {
  switch (kind) {
    case "meat":
      return '<path d="M17 7c2 0 4 2 4 4 0 4-5 8-9 8-2 0-4-1-5-3l-2 2c-1 1-3-1-2-2l2-2c-1-1-1-2-1-3 0-3 3-5 6-5 1 0 2 0 3 1 1-1 2-1 4 0z"/>';
    case "wood":
      return '<path d="M5 16l11-11 4 4-11 11H5v-4z"/><path d="M8 17l9-9"/>';
    case "coal":
      return '<path d="M12 3l8 6-3 10H7L4 9l8-6z"/><path d="M8 10h8M10 15h5"/>';
    case "ingot":
      return '<path d="M5 17l3-8h11l3 8H5z"/><path d="M8 9l3-4h6l2 4"/>';
    case "diamond":
      return '<path d="M12 21L3 9l4-5h10l4 5-9 12z"/><path d="M3 9h18M8 4l4 17 4-17"/>';
    case "crystal":
      return '<path d="M12 3l5 6-2 12H9L7 9l5-6z"/><path d="M12 3v18M7 9h10"/>';
    case "refined-crystal":
      return '<path d="M12 2l7 7-3 13H8L5 9l7-7z"/><path d="M9 9l3-7 3 7-3 13-3-13z"/>';
    case "shard":
      return '<path d="M10 3l8 5-6 13-6-5 4-13z"/>';
    case "amber":
      return '<path d="M12 3l8 7-4 10H8L4 10l8-7z"/><path d="M9 12h6"/>';
    case "polish":
      return '<path d="M8 3h8v6l3 7c1 3-1 5-4 5H9c-3 0-5-2-4-5l3-7V3z"/><path d="M8 8h8"/>';
    case "plans":
      return '<path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h3"/>';
    case "book":
      return '<path d="M5 4h10a4 4 0 014 4v12H9a4 4 0 00-4-4V4z"/><path d="M9 8h6M9 12h6"/>';
    case "secret":
      return '<path d="M12 3a5 5 0 00-5 5v3H5v10h14V11h-2V8a5 5 0 00-5-5z"/><path d="M9 11V8a3 3 0 016 0v3"/>';
    case "pet-food":
      return '<path d="M7 10h10l2 10H5l2-10z"/><path d="M9 10V7a3 3 0 016 0v3"/><path d="M9 15h6"/>';
    case "potion":
    case "serum":
      return '<path d="M9 3h6v4l4 8c1 3-1 6-4 6H9c-3 0-5-3-4-6l4-8V3z"/><path d="M8 15h8"/>';
    case "affinity":
      return '<path d="M12 21s-8-5-8-11a4 4 0 017-3 4 4 0 017 3c0 6-8 11-8 11z"/>';
    case "sigil":
      return '<path d="M12 3l8 5v8l-8 5-8-5V8l8-5z"/><path d="M12 8v8M8 12h8"/>';
    case "shield":
      return '<path d="M12 3l8 3v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3z"/>';
    case "speedup":
      return '<path d="M12 7v6l4 2"/><path d="M21 12a9 9 0 11-3-7"/><path d="M18 3h3v3"/>';
    case "widget":
      return '<path d="M12 8a4 4 0 110 8 4 4 0 010-8z"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>';
    case "stamina":
      return '<path d="M6 8c0-2 2.7-3 6-3s6 1 6 3v8c0 2-2.7 3-6 3s-6-1-6-3V8z"/><path d="M6 8c0 2 2.7 3 6 3s6-1 6-3"/>';
    case "chest":
      return '<path d="M4 10c0-3 3-5 8-5s8 2 8 5v9H4v-9z"/><path d="M4 12h16M12 12v4"/>';
    case "march":
      return '<path d="M4 17l5-10 5 10"/><path d="M14 17l3-6 3 6"/><path d="M6 17h15"/>';
    case "city":
      return '<path d="M4 20V9l4-3 4 3 4-3 4 3v11H4z"/><path d="M8 20v-5h4v5M16 20v-7"/>';
    case "infantry":
      return '<path d="M12 3l7 4v6c0 4-3 7-7 9-4-2-7-5-7-9V7l7-4z"/><path d="M12 8v8"/>';
    case "lancer":
      return '<path d="M5 19L19 5"/><path d="M14 5h5v5"/><path d="M6 14l4 4"/>';
    case "marksman":
      return '<path d="M4 12h16"/><path d="M15 7l5 5-5 5"/><path d="M6 7l4 5-4 5"/>';
    case "troops":
      return '<path d="M8 20v-4a4 4 0 018 0v4"/><path d="M12 4a4 4 0 110 8 4 4 0 010-8z"/><path d="M4 20v-3a3 3 0 013-3M20 20v-3a3 3 0 00-3-3"/>';
    case "pet":
      return '<path d="M12 14c3 0 6 2 6 5H6c0-3 3-5 6-5z"/><path d="M7 9a2 2 0 110-4 2 2 0 010 4zM17 9a2 2 0 110-4 2 2 0 010 4zM10 8a2 2 0 110-4 2 2 0 010 4zM14 8a2 2 0 110-4 2 2 0 010 4z"/>';
    case "expert":
      return '<path d="M12 4a4 4 0 110 8 4 4 0 010-8z"/><path d="M5 21a7 7 0 0114 0"/><path d="M18 5l2-2M6 5L4 3"/>';
    case "hero":
      return '<path d="M12 3l3 6 6 1-4 5 1 6-6-3-6 3 1-6-4-5 6-1 3-6z"/>';
    case "gear":
      return '<path d="M12 3l8 5-8 5-8-5 8-5z"/><path d="M4 12l8 5 8-5"/><path d="M4 16l8 5 8-5"/>';
    case "charm":
      return '<path d="M12 3l4 5 5 1-4 4 1 6-6-3-6 3 1-6-4-4 5-1 4-5z"/><path d="M12 8v5"/>';
    case "building":
      return '<path d="M4 20V9l8-5 8 5v11H4z"/><path d="M9 20v-6h6v6M7 11h2M15 11h2"/>';
    case "research":
      return '<path d="M9 3h6v5l5 9c1 2 0 4-3 4H7c-3 0-4-2-3-4l5-9V3z"/><path d="M8 15h8"/>';
    default:
      return '<path d="M12 3l8 5v8l-8 5-8-5V8l8-5z"/>';
  }
}

function labelHue(label) {
  return [...String(label || "")].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) % 360, 0);
}

function assetEntryFor(scope, label) {
  const assets = visualAssets.assets || visualAssets;
  const normalizedScope = normalizeKey(scope);
  const normalizedLabel = normalizeKey(label);
  const keys = [
    normalizeKey(`${scope} ${label}`),
    normalizedLabel,
    normalizedScope,
  ].filter(Boolean);
  for (const key of keys) {
    if (assets[key]) return assets[key];
  }
  const equippedMatch = String(scope || "").match(/^equipped\s+(.+?)\s+(top-left|top-right|bottom-left|bottom-right)$/i);
  if (equippedMatch) {
    const heroId = assetFileSlug(equippedMatch[1]);
    const positionFile = equippedMatch[2].toLowerCase().replace("-", "_");
    return { src: `assets/game/equipped-hero-gear/${heroId}-${positionFile}.png` };
  }
  if ((normalizedScope === "herogear" || normalizedScope === "gear") && normalizedLabel) {
    if (/goggles?/.test(normalizedLabel)) return assets.herogeargoggles || assets.goggles || assets.goggle;
    if (/gauntlets?|gloves?/.test(normalizedLabel)) return assets.herogeargauntlets || assets.gloves || assets.glove;
    if (/belts?/.test(normalizedLabel)) return assets.herogearbelt || assets.belt;
    if (/boots?/.test(normalizedLabel)) return assets.herogearboots || assets.boots || assets.boot;
  }
  return null;
}

function assetHasHiddenCount(asset) {
  return Boolean(asset && typeof asset === "object" && (asset.hide_count || asset.hideCount));
}

const ASSET_CACHE_VERSION = "20260716c";

function assetUrl(src) {
  if (!src) return src;
  return `${src}${src.includes("?") ? "&" : "?"}v=${ASSET_CACHE_VERSION}`;
}

function iconHtml(kind, label, size = "md", scope = "") {
  const asset = assetEntryFor(scope, label) || assetEntryFor(kind, label);
  const assetSrc = typeof asset === "string" ? asset : asset?.src;
  if (assetSrc) {
    const hideCount = assetHasHiddenCount(asset);
    const fit = ["contain", "cover"].includes(asset?.fit) ? asset.fit : "contain";
    const position = asset?.position ? String(asset.position).replace(/[^a-z0-9% .-]/gi, "") : "center";
    return `<span class="game-icon game-icon--asset game-icon--${size}${hideCount ? " game-icon--count-crop" : ""}" aria-hidden="true">
      <img class="game-asset${hideCount ? " game-asset--count-crop" : ""}" src="${esc(assetUrl(assetSrc))}" alt="" loading="lazy" style="object-fit:${fit};object-position:${esc(position)}" />
    </span>`;
  }
  const safeKind = String(kind || "generic").replace(/[^a-z0-9-]/g, "");
  return `<span class="game-icon game-icon--${safeKind} game-icon--${size}" style="--icon-hue:${labelHue(label)}" aria-hidden="true">
    <svg viewBox="0 0 24 24" focusable="false">${iconShape(safeKind)}</svg>
  </span>`;
}

function visualLabel(scope, label, meta = "") {
  const text = String(label || "-");
  const kind = iconKind(scope, text);
  return `<span class="visual-label">${iconHtml(kind, text, "md", scope)}<span class="visual-copy"><strong>${esc(text)}</strong>${
    meta ? `<br><span class="muted">${esc(meta)}</span>` : ""
  }</span></span>`;
}

function visualResourceLabel(key, label = RESOURCE_LABELS[key] || key) {
  return `<span class="visual-label visual-label--compact">${iconHtml(iconKind(key, label), label, "sm", key)}<span>${esc(label)}</span></span>`;
}

function fieldKey(field) {
  return Array.isArray(field) ? field[0] : field;
}

function resourceRecord(resourceId) {
  return gameData.resource_types.find((resource) => resource.resource_id === resourceId) || {
    resource_id: resourceId,
    name: RESOURCE_LABELS[resourceId] || titleFromId(resourceId),
    category: "custom",
    unit: "quantity",
  };
}

function resourceCategoryLabel(value) {
  return titleFromId(String(value || "resources").replaceAll("_", " "));
}

function resourceEditorCard(resourceId) {
  const resource = resourceRecord(resourceId);
  const used = availableInventoryValue(resourceId);
  return `<div class="inventory-editor-card">
    <div class="inventory-editor-card__head">
      ${visualResourceLabel(resourceId, resource.name)}
      <span>${esc(resource.unit === "minutes" ? "minutes" : "count")}</span>
    </div>
    <label>
      <span>Current value</span>
      ${numberInput(`resources.${resourceId}`, used)}
      ${resourceFineprintHtml(resourceId, used)}
    </label>
  </div>`;
}

function inventoryEditorGroup(group) {
  const fields = [...new Set(group.fields.map(fieldKey))];
  return `<section class="inventory-editor-group">
    <div class="inventory-editor-group__head">
      <h3>${esc(group.title)}</h3>
      <span>${esc(group.note)}</span>
    </div>
    <div class="inventory-editor-fields">${fields.map(resourceEditorCard).join("")}</div>
  </section>`;
}

function currentEditorControl(label, html) {
  return `<label><span>${esc(label)}</span>${html}</label>`;
}

function currentEditorCard(title, meta, controls, source = "") {
  return `<div class="current-editor-card">
    <div class="current-editor-card__head">
      <strong>${esc(title)}</strong>
      ${meta ? `<span>${esc(meta)}</span>` : ""}
    </div>
    <div class="current-editor-card__fields">${controls.join("")}</div>
    ${source ? `<small>${esc(source)}</small>` : ""}
  </div>`;
}

function currentEditorSection(title, note, cards, options = {}) {
  if (!cards.length) return "";
  const content = `<div class="current-editor-grid">${cards.join("")}</div>`;
  if (options.open) {
    return `<section class="inventory-editor-group current-editor-section">
      <div class="inventory-editor-group__head"><h3>${esc(title)}</h3><span>${esc(note)}</span></div>
      ${content}
    </section>`;
  }
  return `<details class="table-disclosure current-editor-disclosure">
    <summary>${esc(title)} <span>${esc(note)}</span></summary>
    ${content}
  </details>`;
}

function currentProgressEditorHtml() {
  const gearLevels = sortByNumber(gameData.chief_gear_levels, "sequence");
  const charmLevels = [{ charm_level: 0, label: "0", power: 0 }, ...gameData.chief_charm_levels.map((row) => ({ ...row, label: String(row.charm_level) }))];
  const buildingLevelsById = groupBy(gameData.building_levels, "building_id");
  const petLevelsById = groupBy(gameData.pet_levels, "pet_id");
  const expertLevelsById = groupBy(gameData.expert_affinity_levels, "expert_id");
  const heroById = Object.fromEntries(gameData.heroes.map((hero) => [hero.hero_id, hero]));

  const chiefGearCards = gameData.chief_gear_slots
    .map((slot) => {
      const saved = state.chief_gear?.[slot.slot_id];
      if (!saved) return null;
      return currentEditorCard(
        slot.name,
        saved.item_name || saved.slot || "",
        [
          currentEditorControl("Current tier", `<select data-path="chief_gear.${slot.slot_id}.current">${optionList(gearLevels, "gear_level_code", "gear_level_code", saved.current)}</select>`),
          currentEditorControl("Power", numberInput(`chief_gear.${slot.slot_id}.power`, saved.power || 0)),
        ],
        "Chief gear target is reset from this current tier.",
      );
    })
    .filter(Boolean);

  const charmSlotById = Object.fromEntries(gameData.chief_charm_slots.map((slot) => [slot.slot_id, slot]));
  const charmCards = Object.entries(state.charms || {}).map(([slotId, saved]) => {
    const slot = charmSlotById[slotId] || { position: titleFromId(slotId), gear_slot: "" };
    return currentEditorCard(
      `${slot.gear_slot || titleFromId(slotId.split("_")[0])} ${slot.position || ""}`.trim(),
      "Chief charm",
      [
        currentEditorControl("Current level", `<select data-path="charms.${slotId}.current">${optionList(charmLevels, "label", "charm_level", saved.current)}</select>`),
      ],
      "Charm target is reset from this current level.",
    );
  });

  const heroGearCards = Object.entries(state.extracted_current?.hero_gear || {}).flatMap(([heroId, gearSet]) => {
    const hero = heroRecordFor(heroId);
    return heroGearPieces(gearSet.gear).map(([slot, piece]) => {
      const position = HERO_GEAR_POSITION_LABELS[HERO_GEAR_SLOT_POSITIONS[slot]] || titleFromId(slot);
      return currentEditorCard(
        heroGearPieceName(slot, piece),
        `${hero.name} | ${position}`,
        [
          currentEditorControl("Current level", numberInput(`extracted_current.hero_gear.${heroId}.gear.${slot}.level`, Number(piece.level || 0))),
          currentEditorControl("Current +", numberInput(`extracted_current.hero_gear.${heroId}.gear.${slot}.enhancement`, heroGearCurrentEnhancement(piece), 0)),
          heroGearLockedObservedEnhancement(piece)
            ? currentEditorControl("Stat empower gate", `<span class="muted">Locked until Lv ${HERO_GEAR_EMPOWERMENT_MIN_MASTERY_LEVEL}</span>`)
            : "",
          currentEditorControl("Power", numberInput(`extracted_current.hero_gear.${heroId}.gear.${slot}.power`, Number(piece.power || 0), 0)),
        ],
        "Hero gear target is reset from these current values.",
      );
    });
  });

  const buildingCards = gameData.buildings
    .map((building) => {
      const saved = state.buildings?.[building.building_id];
      const levels = sortByNumber(buildingLevelsById[building.building_id] || [], "numerical_level");
      if (!saved || !levels.length) return null;
      return currentEditorCard(
        building.name,
        building.category || "Building",
        [currentEditorControl("Current level", `<select data-path="buildings.${building.building_id}.current">${optionList(levels, "level_code", "level_code", saved.current)}</select>`)],
      );
    })
    .filter(Boolean);

  const petCards = gameData.pets
    .map((pet) => {
      const saved = state.pets?.[pet.pet_id];
      const levels = (petLevelsById[pet.pet_id] || []).map((row) => ({ ...row, label: row.level_code }));
      if (!saved || !levels.length) return null;
      return currentEditorCard(
        pet.name,
        saved.power ? `Power ${fmt(saved.power)}` : "Pet",
        [currentEditorControl("Current level", `<select data-path="pets.${pet.pet_id}.current">${optionList(levels, "label", "level_code", saved.current)}</select>`)],
      );
    })
    .filter(Boolean);

  const expertCards = gameData.experts
    .map((expert) => {
      const saved = state.experts?.[expert.expert_id];
      const levels = (expertLevelsById[expert.expert_id] || []).map((row) => ({ ...row, label: row.relationship_label || row.level_code }));
      if (!saved || !levels.length) return null;
      return currentEditorCard(
        expert.name,
        saved.relationship || "Expert",
        [
          currentEditorControl(
            "Current affinity",
            `<select data-path="experts.${expert.expert_id}.relationship_current">${optionList(levels, "label", "level_code", saved.relationship_current)}</select>`,
          ),
        ],
      );
    })
    .filter(Boolean);

  const heroCards = Object.entries(state.heroes || {})
    .map(([heroId, saved]) => {
      const hero = heroById[heroId] || { name: titleFromId(heroId) };
      return currentEditorCard(
        hero.name,
        [hero.rarity, hero.generation ? `Gen ${hero.generation}` : "", saved.power ? `Power ${fmt(saved.power)}` : ""].filter(Boolean).join(" | "),
        [
          currentEditorControl("Owned", checkboxInput(`heroes.${heroId}.owned`, Boolean(saved.owned))),
          currentEditorControl("Stars", numberInput(`heroes.${heroId}.current_stars`, Number(saved.current_stars || 0), 0, 0.1)),
          currentEditorControl("Widget", numberInput(`heroes.${heroId}.current_widget_level`, Number(saved.current_widget_level || 0), 0)),
          currentEditorControl("Level", numberInput(`heroes.${heroId}.current_level`, Number(saved.current_level || 0), 0)),
        ],
      );
    })
    .filter(Boolean);

  const troopCards = Object.entries(state.troops || {})
    .filter(([, saved]) => Number(saved.tier || 0) < 12)
    .map(([troopId, saved]) =>
      currentEditorCard(
        `${saved.troop_type || titleFromId(troopId)} T${saved.tier || ""}`.trim(),
        "Troop count",
        [currentEditorControl("Current count", numberInput(`troops.${troopId}.current`, Number(saved.current || 0), 0))],
      ),
    );

  return `<section class="current-progress-editor">
    <div class="section-title-row">
      <div>
        <h2>Current Progress Editor</h2>
        <p>Manually correct recorded current values. Target reset buttons use these values as the new baseline.</p>
      </div>
    </div>
    ${currentEditorSection("Chief Gear Current Values", "6 equipped chief gear pieces", chiefGearCards, { open: true })}
    ${currentEditorSection("Hero Gear Current Values", `${fmt(heroGearCards.length)} equipped gear pieces`, heroGearCards, { open: true })}
    ${currentEditorSection("Chief Charm Current Values", `${fmt(charmCards.length)} charms`, charmCards)}
    ${currentEditorSection("Building Current Values", `${fmt(buildingCards.length)} buildings`, buildingCards)}
    ${currentEditorSection("Pet Current Values", `${fmt(petCards.length)} pets`, petCards)}
    ${currentEditorSection("Expert Current Values", `${fmt(expertCards.length)} experts`, expertCards)}
    ${currentEditorSection("Hero Current Values", `${fmt(heroCards.length)} heroes`, heroCards)}
    ${currentEditorSection("Troop Current Values", `${fmt(troopCards.length)} troop rows`, troopCards)}
  </section>`;
}

function costHtml(cost, fields) {
  const visible = fields
    .map(fieldKey)
    .filter((key) => Number(cost[key] || 0) !== 0);
  if (!visible.length) return `<span class="muted">None</span>`;
  return `<div class="cost-cell">${visible
    .map((key) => `<div class="cost-item">${visualResourceLabel(key)}<strong>${fmt(cost[key])}</strong></div>`)
    .join("")}</div>`;
}

function availableInventoryValue(key) {
  return Number(state.resources[key] || 0);
}

/* ---------------------------------------------------------------------------
 * Game-replica UI helpers
 * Shared building blocks that mirror the in-game dialogs:
 * - compact K/M/B numbers like the game HUD
 * - "Requires" rows with have/need + check marks (building upgrade dialog)
 * - material cost tiles with have/need (chief gear enhancement dialog)
 * - "Upgrade Bonus" stat rows with green gains (war academy dialog)
 * - level flow badges with chevrons (8 >>> 9)
 * - gold/blue game buttons and the blue dialog frame
 * ------------------------------------------------------------------------- */

function fmtCompact(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return "-";
  const abs = Math.abs(number);
  const sign = number < 0 ? "-" : "";
  const short = (divisor, suffix) => {
    const scaled = abs / divisor;
    const decimals = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
    return `${sign}${fmt(scaled, decimals).replace(/\.0+$/, "")}${suffix}`;
  };
  if (abs >= 1e9) return short(1e9, "B");
  if (abs >= 1e6) return short(1e6, "M");
  if (abs >= 1e4) return short(1e3, "K");
  return fmt(number);
}

function gameSectionBannerHtml(title) {
  return `<div class="gd-banner"><span>${esc(title)}</span></div>`;
}

function gameLevelFlowHtml(fromLabel, toLabel, options = {}) {
  const changed = String(fromLabel) !== String(toLabel);
  return `<div class="gd-level-flow">
    <div class="gd-level-badge"><small>${esc(options.fromCaption || "Current")}</small><strong>${esc(fromLabel)}</strong></div>
    <span class="gd-chevrons ${changed ? "" : "gd-chevrons--idle"}" aria-hidden="true"><i></i><i></i><i></i></span>
    <div class="gd-level-badge gd-level-badge--target"><small>${esc(options.toCaption || "Target")}</small><strong>${esc(toLabel)}</strong></div>
  </div>`;
}

function gameBonusRowsHtml(rows, title = "Upgrade Bonus") {
  const body = rows
    .filter((row) => row && row.current != null)
    .map((row) => {
      const hasTarget = row.target != null && String(row.target) !== String(row.current);
      const tail = hasTarget
        ? `<span class="gd-arrow" aria-hidden="true"></span><strong class="gd-gain">${esc(row.target)}</strong>`
        : row.delta && !/^\+?0(\.0+)?%?$/.test(String(row.delta))
          ? `<strong class="gd-gain">${esc(row.delta)}</strong>`
          : "";
      return `<div class="gd-bonus-row"><span class="gd-bonus-label">${esc(row.label)}</span><span class="gd-bonus-values"><strong>${esc(row.current)}</strong>${tail}</span></div>`;
    })
    .join("");
  if (!body) return "";
  return `<section class="gd-section">${gameSectionBannerHtml(title)}<div class="gd-bonus-list">${body}</div></section>`;
}

function matchExpertSkillId(expert, skillName, index) {
  const catalog = expert?.skills || [];
  const wanted = normalizeKey(skillName);
  const byName = catalog.find((skill) => normalizeKey(skill.name) === wanted);
  if (byName) return byName.skill_id;
  return catalog[index]?.skill_id || null;
}

function expertSkillLevelRows(skillId) {
  if (!skillId) return [];
  return sortByNumber((gameData.expert_skill_levels || []).filter((row) => row.skill_id === skillId), "skill_level");
}

function expertXpPerMinute() {
  return Number(gameData.expert_learning?.xp_per_learning_minute || 60);
}

function learningTimeText(xp) {
  const minutes = Math.ceil(Number(xp || 0) / expertXpPerMinute());
  return timeFmt(minutes * 60);
}

function expertSkillPlanner(expert, skills) {
  let books = 0;
  let learningXp = 0;
  const body = (skills || [])
    .filter((skill) => skill && skill.name)
    .map((skill, index) => {
      const ready = /maxed|ready/i.test(String(skill.learning_xp || ""));
      const skillId = matchExpertSkillId(expert, skill.name, index);
      const rows = expertSkillLevelRows(skillId);
      const current = Number(skill.level || 0);
      const maxLevel = rows.length ? Math.max(current, Number(rows.at(-1).skill_level)) : current;
      const savedTarget = state.expert_skill_targets?.[skillId];
      const target = Math.min(Math.max(Number(savedTarget ?? current), current), maxLevel);
      const stepRows = rows.filter((row) => Number(row.skill_level) > current && Number(row.skill_level) <= target);
      const stepBooks = stepRows.reduce((sum, row) => sum + Number(row.books || 0), 0);
      const stepXp = stepRows.reduce((sum, row) => sum + Number(row.learning_xp || 0), 0);
      books += stepBooks;
      learningXp += stepXp;
      const options = [];
      for (let level = current; level <= maxLevel; level += 1) {
        options.push(`<option value="${level}" ${level === target ? "selected" : ""}>Lv. ${level}</option>`);
      }
      const targetControl =
        skillId && maxLevel > current
          ? `<select data-path="expert_skill_targets.${esc(skillId)}" aria-label="Target level for ${esc(skill.name)}">${options.join("")}</select>`
          : `<span class="muted">max</span>`;
      const costLine =
        stepBooks || stepXp
          ? `<div class="expert-skill-cost">Lv. ${current} → ${target}: <strong>${fmt(stepBooks)}</strong> books · <strong>${fmtCompact(stepXp)}</strong> XP <span class="muted">(≈ ${learningTimeText(stepXp)} of learning / speedups)</span></div>`
          : "";
      return `<div class="gd-bonus-row expert-skill-row" title="${esc(skill.effect || "")}"><span class="gd-bonus-label">${esc(skill.name)}</span><span class="gd-bonus-values"><strong>Lv. ${esc(skill.level ?? "-")}</strong>${ready ? `<strong class="gd-gain">ready</strong>` : ""}${targetControl}</span></div>${costLine}`;
    })
    .join("");
  if (!body) return { html: "", books: 0, learningXp: 0, learningMinutes: 0 };
  const learningMinutes = Math.ceil(learningXp / expertXpPerMinute());
  const totalLine =
    books || learningXp
      ? `<div class="expert-skill-cost expert-skill-cost--total">Skill plan total: <strong>${fmt(books)}</strong> books · <strong>${fmtCompact(learningXp)}</strong> Learning XP ≈ <strong>${learningTimeText(learningXp)}</strong> of learning time</div>`
      : "";
  const html = `<section class="gd-section">${gameSectionBannerHtml("Expert Skills")}<div class="gd-bonus-list">${body}</div>${totalLine}</section>`;
  return { html, books, learningXp, learningMinutes };
}

function gamePrereqRowHtml(label, met, detail = "") {
  return `<div class="gd-req-row ${met ? "is-met" : "is-short"}">
    <span class="gd-req-label">${esc(label)}${detail ? `<small>${esc(detail)}</small>` : ""}</span>
    <span class="gd-req-status" aria-hidden="true">${met ? "" : ""}</span>
  </div>`;
}

function gameResourceRowHtml(key, required, label = RESOURCE_LABELS[key] || key) {
  const have = availableInventoryValue(key);
  const met = have >= Number(required || 0);
  return `<div class="gd-req-row ${met ? "is-met" : "is-short"}">
    ${iconHtml(iconKind(key, label), label, "md", key)}
    <span class="gd-req-label">${esc(label)}</span>
    <span class="gd-req-amount"><b class="${met ? "gd-have-ok" : "gd-have-short"}">${fmtCompact(have)}</b><i>/</i>${fmtCompact(required)}</span>
    <span class="gd-req-status" aria-hidden="true">${met ? "" : ""}</span>
  </div>`;
}

function gameRequiresHtml(cost, fields, options = {}) {
  const { title = "Requires", prereqHtml = "", note = "", emptyText = "No requirements for this selection." } = options;
  const keys = fieldKeys(fields).filter((key) => Number(cost?.[key] || 0) > 0);
  const rows = keys.map((key) => gameResourceRowHtml(key, cost[key])).join("");
  const body = `${prereqHtml}${rows}` || `<div class="gd-req-empty">${esc(emptyText)}</div>`;
  return `<section class="gd-section">${gameSectionBannerHtml(title)}<div class="gd-req-list">${body}</div>${
    note ? `<p class="gd-note">${esc(note)}</p>` : ""
  }</section>`;
}

function gameCostTilesHtml(cost, fields, options = {}) {
  const { emptyText = "No materials needed for this selection." } = options;
  const keys = fieldKeys(fields).filter((key) => Number(cost?.[key] || 0) > 0);
  if (!keys.length) return `<div class="gd-req-empty">${esc(emptyText)}</div>`;
  return `<div class="gd-cost-tiles">${keys
    .map((key) => {
      const required = Number(cost[key] || 0);
      const have = availableInventoryValue(key);
      const met = have >= required;
      const label = RESOURCE_LABELS[key] || key;
      return `<div class="gd-cost-tile ${met ? "is-met" : "is-short"}" title="${esc(label)}: you have ${fmt(have)}, need ${fmt(required)}">
        <span class="gd-cost-tile__icon">${iconHtml(iconKind(key, label), label, "lg", key)}</span>
        <span class="gd-cost-tile__amount"><b>${fmtCompact(have)}</b>/${fmtCompact(required)}</span>
        <span class="gd-cost-tile__label">${esc(label)}</span>
      </div>`;
    })
    .join("")}</div>`;
}

function gameButtonHtml(label, sub = "", variant = "blue", enabled = true) {
  return `<div class="gd-btn gd-btn--${variant}${enabled ? "" : " gd-btn--disabled"}" role="presentation">
    <span>${esc(label)}</span>${sub ? `<small>${esc(sub)}</small>` : ""}
  </div>`;
}

function gameDialogHtml({ title, body, className = "" }) {
  return `<section class="game-dialog ${className}">
    <header class="game-dialog__title"><span>${esc(title)}</span></header>
    <div class="game-dialog__body">${body}</div>
  </section>`;
}

function gameCostCoverage(cost, fields) {
  const keys = fieldKeys(fields).filter((key) => Number(cost?.[key] || 0) > 0);
  const short = keys.filter((key) => availableInventoryValue(key) < Number(cost[key] || 0));
  return { hasCost: keys.length > 0, covered: keys.length > 0 && short.length === 0, shortCount: short.length };
}

/* Construction cost reduction (e.g. Zinman-style city skills).
 * Verified in game 2026-07-10: displayed building costs for meat/wood/coal/iron
 * were exactly 85% of workbook base rows (72M -> 61.2M etc.), while fire
 * crystal, refined fire crystal, and build time matched the base rows exactly.
 * The discount therefore applies only to the four basic resources. */
const CONSTRUCTION_DISCOUNT_FIELDS = ["meat", "wood", "coal", "iron"];

function constructionCostReductionPct() {
  const pct = Number(state.construction?.cost_reduction_pct);
  if (!Number.isFinite(pct)) return 0;
  return Math.min(90, Math.max(0, pct));
}

function applyConstructionDiscount(cost) {
  const pct = constructionCostReductionPct();
  if (!pct) return cost;
  const factor = (100 - pct) / 100;
  const discounted = { ...cost };
  CONSTRUCTION_DISCOUNT_FIELDS.forEach((key) => {
    if (discounted[key]) discounted[key] = Math.ceil(discounted[key] * factor);
  });
  return discounted;
}

function signedFmt(value, decimals = 0) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return "-";
  return `${number > 0 ? "+" : ""}${fmt(number, decimals)}`;
}

function percentFmt(value, decimals = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return `${fmt(number, decimals)}%`;
}

function signedPercentFmt(value, decimals = 2) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return "-";
  return `${number > 0 ? "+" : ""}${fmt(number, decimals)}%`;
}

function workbookPercentFmt(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "-";
  return percentFmt(number * 100, 2);
}

function signedWorkbookPercentFmt(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return "-";
  return signedPercentFmt(number * 100, 2);
}

function levelRow(rows, idKey, id) {
  return (rows || []).find((row) => String(row[idKey]) === String(id)) || null;
}

function powerImpact(rows, currentId, targetId, idKey) {
  const current = levelRow(rows, idKey, currentId);
  const target = levelRow(rows, idKey, targetId);
  const currentPower = Number(current?.power || 0);
  const targetPower = Number(target?.power || 0);
  return { current, target, currentPower, targetPower, deltaPower: targetPower - currentPower };
}

function statImpactCard(label, current, target, delta, note = "") {
  return `<div class="stat-impact-card">
    <span>${esc(label)}</span>
    <div class="stat-impact-values">
      <div><small>Current</small><strong>${esc(current)}</strong></div>
      <div><small>Target</small><strong>${esc(target)}</strong></div>
      <div><small>Change</small><strong class="${String(delta).startsWith("+") ? "positive" : ""}">${esc(delta)}</strong></div>
    </div>
    ${note ? `<p>${esc(note)}</p>` : ""}
  </div>`;
}

function statSnapshotCard(label, value, source, note = "") {
  return `<div class="stat-impact-card stat-impact-card--snapshot">
    <span>${esc(label)}</span>
    <div class="stat-snapshot-value">
      <strong>${esc(value)}</strong>
      <small>${esc(source)}</small>
    </div>
    ${note ? `<p>${esc(note)}</p>` : ""}
  </div>`;
}

function statImpactPanel(title, cards, note = "") {
  const body = cards.filter(Boolean).join("");
  if (!body && !note) return "";
  return `<section class="stat-impact-panel">
    <div class="stat-impact-head">
      <h3>${esc(title)}</h3>
      ${note ? `<span>${esc(note)}</span>` : ""}
    </div>
    ${body ? `<div class="stat-impact-grid">${body}</div>` : ""}
  </section>`;
}

function expertStatLabel(label) {
  return EXPERT_STAT_LABELS[label] || label || "Stat";
}

function observedStatEntries(record = {}) {
  return OBSERVED_STAT_FIELDS.map(([key, label, type]) => {
    const value = Number(record?.[key]);
    return Number.isFinite(value) ? { key, label, type, value } : null;
  }).filter(Boolean);
}

function observedStatsHtml(record = {}) {
  const entries = observedStatEntries(record);
  if (!entries.length) return `<span class="muted">No stat read</span>`;
  return `<div class="stat-pill-list">${entries
    .map((entry) => `<span><b>${esc(entry.label)}</b>${entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value)}</span>`)
    .join("")}</div>`;
}

function observedStatsText(record = {}) {
  const entries = observedStatEntries(record);
  if (!entries.length) return "";
  return entries.map((entry) => `${entry.label} ${entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value)}`).join(", ");
}

function observedAggregateStats(records) {
  return records.reduce((acc, record) => {
    observedStatEntries(record).forEach((entry) => {
      if (!acc[entry.key]) acc[entry.key] = { ...entry, value: 0 };
      acc[entry.key].value += entry.value;
    });
    return acc;
  }, {});
}

function observedStatCards(record, titlePrefix = "Observed") {
  return observedStatEntries(record).map((entry) =>
    statSnapshotCard(`${titlePrefix} ${entry.label}`, entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value), "Current account", "Captured from the current account"),
  );
}

function expertAffinityImpact(expertId, currentId, targetId) {
  const levels = groupBy(gameData.expert_affinity_levels, "expert_id")[expertId] || [];
  const current = levelRow(levels, "level_code", currentId);
  const target = levelRow(levels, "level_code", targetId);
  const cards = [];
  const changes = [];
  if (current && target) {
    [
      ["primary_stat_label", "primary_stat"],
      ["secondary_stat_label", "secondary_stat"],
    ].forEach(([labelKey, valueKey]) => {
      const label = expertStatLabel(target[labelKey] || current[labelKey]);
      const currentValue = Number(current[valueKey]);
      const targetValue = Number(target[valueKey]);
      if (!Number.isFinite(currentValue) || !Number.isFinite(targetValue)) return;
      const change = {
        label,
        current: workbookPercentFmt(currentValue),
        target: workbookPercentFmt(targetValue),
        delta: signedWorkbookPercentFmt(targetValue - currentValue),
      };
      changes.push(change);
      cards.push(statImpactCard(label, change.current, change.target, change.delta, "Workbook affinity table"));
    });
    const powerChange = {
      label: "Expert Power",
      current: fmt(current.power),
      target: fmt(target.power),
      delta: signedFmt(Number(target.power || 0) - Number(current.power || 0)),
    };
    changes.push(powerChange);
    cards.push(statImpactCard(powerChange.label, powerChange.current, powerChange.target, powerChange.delta, "Workbook affinity table"));
  }
  return { current, target, cards, changes };
}

function statDisplay(value, type) {
  return type === "percent" ? percentFmt(value, 2) : fmt(value);
}

function statDeltaDisplay(value, type) {
  return type === "percent" ? signedPercentFmt(value, 2) : signedFmt(value);
}

function numericStatChange(label, currentValue, targetValue, type) {
  const currentNumber = Number(currentValue || 0);
  const targetNumber = Number(targetValue || 0);
  return {
    label,
    type,
    rawCurrent: currentNumber,
    rawTarget: targetNumber,
    rawDelta: targetNumber - currentNumber,
    current: statDisplay(currentNumber, type),
    target: statDisplay(targetNumber, type),
    delta: statDeltaDisplay(targetNumber - currentNumber, type),
  };
}

function chiefTroopGroupForSlot(slotId) {
  const key = normalizeKey(slotId);
  return CHIEF_TROOP_GROUPS.find((group) => group.gearSlots.includes(key)) || null;
}

function chiefGearStatRow(levelCode) {
  return levelRow(gameData.chief_gear_stat_levels || [], "gear_level_code", levelCode) || {
    stat_percent: 0,
    deployment_capacity: 0,
  };
}

function chiefCharmStatRow(level) {
  return levelRow(gameData.chief_charm_stat_levels || [], "charm_level", level) || {
    stat_percent: 0,
  };
}

function chiefGearAttributeChanges(slotId, currentLevel, targetLevel) {
  const group = chiefTroopGroupForSlot(slotId);
  const troop = group?.label || titleFromId(slotId);
  const current = chiefGearStatRow(currentLevel);
  const target = chiefGearStatRow(targetLevel);
  const changes = [
    numericStatChange(`${troop} Attack`, current.stat_percent, target.stat_percent, "percent"),
    numericStatChange(`${troop} Defense`, current.stat_percent, target.stat_percent, "percent"),
  ];
  if (Number(current.deployment_capacity || 0) || Number(target.deployment_capacity || 0)) {
    changes.push(numericStatChange("Troops Deployment Capacity", current.deployment_capacity, target.deployment_capacity, "number"));
  }
  return changes;
}

function chiefCharmAttributeChanges(gearSlotId, currentLevel, targetLevel) {
  const group = chiefTroopGroupForSlot(gearSlotId);
  const troop = group?.label || titleFromId(gearSlotId);
  const current = chiefCharmStatRow(currentLevel);
  const target = chiefCharmStatRow(targetLevel);
  return [
    numericStatChange(`${troop} Lethality`, current.stat_percent, target.stat_percent, "percent"),
    numericStatChange(`${troop} Health`, current.stat_percent, target.stat_percent, "percent"),
  ];
}

function mergeNumericStatChanges(acc, changes) {
  changes.forEach((change) => {
    if (!acc[change.label]) {
      acc[change.label] = { label: change.label, type: change.type, rawCurrent: 0, rawTarget: 0, rawDelta: 0 };
    }
    acc[change.label].rawCurrent += Number(change.rawCurrent || 0);
    acc[change.label].rawTarget += Number(change.rawTarget || 0);
    acc[change.label].rawDelta = acc[change.label].rawTarget - acc[change.label].rawCurrent;
  });
  return acc;
}

function aggregateStatCards(statMap, note = "Exact attribute table") {
  return Object.values(statMap).map((change) =>
    statImpactCard(
      change.label,
      statDisplay(change.rawCurrent, change.type),
      statDisplay(change.rawTarget, change.type),
      statDeltaDisplay(change.rawDelta, change.type),
      note,
    ),
  );
}

function statBenefitText(changes) {
  return changes
    .filter((change) => Math.abs(Number(change.rawDelta || 0)) > 0)
    .map((change) => `${change.label} ${statDeltaDisplay(change.rawDelta, change.type)}`)
    .join(", ");
}

function statChangeListHtml(changes) {
  if (!changes?.length) return `<span class="muted">No target stat row</span>`;
  return `<div class="stat-change-list">${changes
    .map(
      (change) => `<div>
        <span>${esc(change.label)}</span>
        <strong>${esc(change.current)} -> ${esc(change.target)}</strong>
        <em>${esc(change.delta)}</em>
      </div>`,
    )
    .join("")}</div>`;
}

function needAfterInventory(cost) {
  return Object.entries(cost).reduce((acc, [key, value]) => {
    const need = Math.max(0, Number(value || 0) - availableInventoryValue(key));
    if (need) acc[key] = need;
    return acc;
  }, {});
}

function allBuildingCosts() {
  const levelsByBuilding = groupBy(gameData.building_levels, "building_id");
  return Object.entries(state.buildings).reduce((acc, [buildingId, saved]) => {
    const cost = applyConstructionDiscount(rangeCost(levelsByBuilding[buildingId] || [], saved.current, saved.target, {
      idKey: "level_code",
      orderKey: "numerical_level",
      fields: BUILDING_FIELDS,
    }));
    return addCost(acc, cost);
  }, makeCost(BUILDING_FIELDS));
}

function allGearCosts() {
  return Object.values(state.chief_gear).reduce((acc, saved) => {
    const cost = rangeCost(gameData.chief_gear_levels, saved.current, saved.target, {
      idKey: "gear_level_code",
      orderKey: "sequence",
      fields: GEAR_FIELDS,
    });
    return addCost(acc, cost);
  }, makeCost(GEAR_FIELDS));
}

function allCharmCosts() {
  return Object.values(state.charms).reduce((acc, saved) => {
    const cost = rangeCost([{ charm_level: 0 }, ...gameData.chief_charm_levels], saved.current, saved.target, {
      idKey: "charm_level",
      orderKey: "charm_level",
      fields: CHARM_FIELDS,
    });
    return addCost(acc, cost);
  }, makeCost(CHARM_FIELDS));
}

function allPetCosts() {
  const levelsByPet = groupBy(gameData.pet_levels, "pet_id");
  return Object.entries(state.pets).reduce((acc, [petId, saved]) => {
    const petRows = levelsByPet[petId] || [];
    const cost = rangeCost(petRows.map((row, idx) => ({ ...row, order: idx })), saved.current, saved.target, {
      idKey: "level_code",
      orderKey: "order",
      fields: PET_FIELDS,
    });
    return addCost(acc, cost);
  }, makeCost(PET_FIELDS));
}

function allExpertCosts() {
  const levelsByExpert = groupBy(gameData.expert_affinity_levels, "expert_id");
  return Object.entries(state.experts).reduce((acc, [expertId, saved]) => {
    const rows = levelsByExpert[expertId] || [];
    const cost = rangeCost(rows, saved.relationship_current, saved.relationship_target, {
      idKey: "level_code",
      orderKey: "relationship_level",
      fields: [["expert_affinity", "affinity"], ["common_sigils", "sigils"]],
    });
    return addCost(acc, cost);
  }, { expert_affinity: 0, common_sigils: 0 });
}

function allHeroGearCosts() {
  return Object.entries(state.extracted_current?.hero_gear || {}).reduce((acc, [heroId, gearSet]) => {
    return addCost(acc, heroGearCostToTarget(gearSet, heroId));
  }, makeCost(HERO_GEAR_FIELDS));
}

function maxByOrder(rows, orderKey) {
  return sortByNumber(rows || [], orderKey).at(-1);
}

function rowOrder(rows, idKey, orderKey, id) {
  const row = levelRow(rows, idKey, id);
  const order = Number(row?.[orderKey]);
  return Number.isFinite(order) ? order : null;
}

function ensureTargetAtLeastCurrent(saved, currentKey, targetKey, rows, idKey, orderKey) {
  if (!saved) return false;
  const currentOrder = rowOrder(rows, idKey, orderKey, saved[currentKey]);
  const targetOrder = rowOrder(rows, idKey, orderKey, saved[targetKey]);
  if (currentOrder == null || targetOrder == null || targetOrder >= currentOrder) return false;
  saved[targetKey] = saved[currentKey];
  return true;
}

function setIfChanged(object, key, value) {
  if (!object || object[key] === value) return 0;
  object[key] = value;
  return 1;
}

function resetAllTargetsToCurrent(nextState = state) {
  if (!nextState) return 0;
  let changed = 0;

  Object.values(nextState.buildings || {}).forEach((saved) => {
    if (saved?.current != null) changed += setIfChanged(saved, "target", saved.current);
  });
  Object.values(nextState.chief_gear || {}).forEach((saved) => {
    if (saved?.current != null) changed += setIfChanged(saved, "target", saved.current);
  });
  Object.values(nextState.charms || {}).forEach((saved) => {
    if (saved?.current != null) changed += setIfChanged(saved, "target", saved.current);
  });
  Object.values(nextState.pets || {}).forEach((saved) => {
    if (saved?.current != null) changed += setIfChanged(saved, "target", saved.current);
  });
  Object.values(nextState.experts || {}).forEach((saved) => {
    if (saved?.relationship_current != null) changed += setIfChanged(saved, "relationship_target", saved.relationship_current);
  });
  Object.keys(nextState.expert_skill_targets || {}).forEach((skillId) => {
    changed += setIfChanged(nextState.expert_skill_targets, skillId, null);
  });
  Object.values(nextState.heroes || {}).forEach((saved) => {
    changed += setIfChanged(saved, "target_stars", Number(saved.current_stars || 0));
    changed += setIfChanged(saved, "target_star_tier", Number(saved.current_star_tier || 0));
    changed += setIfChanged(saved, "target_widget_level", Number(saved.current_widget_level || 0));
  });
  Object.values(nextState.troops || {}).forEach((saved) => {
    if (saved?.current != null) changed += setIfChanged(saved, "target", saved.current);
  });

  nextState.hero_gear_targets ||= {};
  nextState.hero_gear_targets.heroes ||= {};
  Object.entries(nextState.extracted_current?.hero_gear || {}).forEach(([heroId, gearSet]) => {
    const heroTargets = (nextState.hero_gear_targets.heroes[heroId] ||= {});
    heroTargets.pieces ||= {};
    heroGearPieces(gearSet.gear).forEach(([slot, piece]) => {
      const pieceTargets = (heroTargets.pieces[slot] ||= {});
      changed += setIfChanged(pieceTargets, "target_level", Number(piece.level || 0));
      changed += setIfChanged(pieceTargets, "target_enhancement", heroGearCurrentEnhancement(piece));
    });
    const special = gearSet.special_item || gearSet.charm_toolkit;
    changed += setIfChanged(heroTargets, "special_enhancement", Number(special?.enhancement || 0));
  });

  nextState.research_targets ||= {};
  Object.values(nextState.research_targets || {}).forEach((group) => {
    Object.values(group || {}).forEach((entry) => {
      if (entry?.current != null) changed += setIfChanged(entry, "target", entry.current);
    });
  });
  const currentResearch = nextState.extracted_current?.research || {};
  const activeNormal = currentResearch.active_research || {};
  if (activeNormal.name) {
    const current = parseResearchCurrentLevel(activeNormal.name);
    const entry = (((nextState.research_targets.regular ||= {}).active_research ||= {}));
    changed += setIfChanged(entry, "current", current);
    changed += setIfChanged(entry, "target", current);
  }
  Object.entries(currentResearch.war_academy?.visible_nodes || {})
    .filter(([, node]) => !/max|complete|completed/i.test(String(node.status || "")))
    .forEach(([nodeId, node]) => {
      const progress = parseResearchLevelProgress(node);
      const entry = (((nextState.research_targets.war_academy ||= {})[nodeId] ||= {}));
      changed += setIfChanged(entry, "current", progress.current);
      changed += setIfChanged(entry, "target", progress.current);
    });

  return changed;
}

function resetChiefGearSlotTarget(slotId) {
  const saved = state.chief_gear?.[slotId];
  if (!saved || saved.current == null) return 0;
  return setIfChanged(saved, "target", saved.current);
}

function resetCharmSlotTarget(slotId) {
  const saved = state.charms?.[slotId];
  if (!saved || saved.current == null) return 0;
  return setIfChanged(saved, "target", Number(saved.current));
}

function resetHeroGearPieceTarget(heroId, slot) {
  const piece = state.extracted_current?.hero_gear?.[heroId]?.gear?.[slot];
  if (!piece) return 0;
  state.hero_gear_targets ||= {};
  state.hero_gear_targets.heroes ||= {};
  const heroTargets = (state.hero_gear_targets.heroes[heroId] ||= {});
  heroTargets.pieces ||= {};
  const pieceTargets = (heroTargets.pieces[slot] ||= {});
  let changed = 0;
  changed += setIfChanged(pieceTargets, "target_level", Number(piece.level || 0));
  changed += setIfChanged(pieceTargets, "target_enhancement", heroGearCurrentEnhancement(piece));
  return changed;
}

function resetTargetAction(action) {
  const [type, id, slot] = String(action || "").split(":");
  if (type === "chief-gear") return resetChiefGearSlotTarget(id);
  if (type === "charm") return resetCharmSlotTarget(id);
  if (type === "hero-gear") return resetHeroGearPieceTarget(id, slot);
  return 0;
}

function normalizeHeroGearCurrentValues(nextState) {
  let changed = false;
  Object.values(nextState?.extracted_current?.hero_gear || {}).forEach((gearSet) => {
    heroGearPieces(gearSet.gear).forEach(([, piece]) => {
      const level = Number(piece.level || 0);
      const rawEnhancement = Number(piece.enhancement || 0);
      if (level > 0 && !heroGearCanEmpowerAtLevel(level) && rawEnhancement > 0 && piece.empowerment == null) {
        if (piece.visible_enhancement == null) piece.visible_enhancement = rawEnhancement;
        piece.empowerment = 0;
        changed = true;
      }
      if (piece.empowerment != null) {
        const normalized = Math.min(HERO_GEAR_MAX_EMPOWERMENT, Math.max(0, Number(piece.empowerment || 0)));
        if (piece.empowerment !== normalized) {
          piece.empowerment = normalized;
          changed = true;
        }
      }
    });
  });
  return changed;
}

function normalizeTargets(nextState) {
  if (!nextState || !gameData) return false;
  let changed = normalizeHeroGearCurrentValues(nextState);
  const levelsByBuilding = groupBy(gameData.building_levels, "building_id");
  Object.entries(nextState.buildings || {}).forEach(([buildingId, saved]) => {
    changed = ensureTargetAtLeastCurrent(saved, "current", "target", levelsByBuilding[buildingId] || [], "level_code", "numerical_level") || changed;
  });
  const gearLevels = sortByNumber(gameData.chief_gear_levels, "sequence");
  Object.values(nextState.chief_gear || {}).forEach((saved) => {
    changed = ensureTargetAtLeastCurrent(saved, "current", "target", gearLevels, "gear_level_code", "sequence") || changed;
  });
  const charmLevels = [{ charm_level: 0, power: 0 }, ...gameData.chief_charm_levels];
  Object.values(nextState.charms || {}).forEach((saved) => {
    changed = ensureTargetAtLeastCurrent(saved, "current", "target", charmLevels, "charm_level", "charm_level") || changed;
  });
  const levelsByPet = groupBy(gameData.pet_levels, "pet_id");
  Object.entries(nextState.pets || {}).forEach(([petId, saved]) => {
    const levels = (levelsByPet[petId] || []).map((row, idx) => ({ ...row, order: idx }));
    changed = ensureTargetAtLeastCurrent(saved, "current", "target", levels, "level_code", "order") || changed;
  });
  const levelsByExpert = groupBy(gameData.expert_affinity_levels, "expert_id");
  Object.entries(nextState.experts || {}).forEach(([expertId, saved]) => {
    changed =
      ensureTargetAtLeastCurrent(saved, "relationship_current", "relationship_target", levelsByExpert[expertId] || [], "level_code", "relationship_level") || changed;
  });
  nextState.expert_skill_targets ||= {};
  Object.entries(nextState.extracted_current?.experts || {}).forEach(([expertId, observed]) => {
    if (!Array.isArray(observed?.skills)) return;
    const catalog = (gameData.experts || []).find((expert) => expert.expert_id === expertId);
    if (!catalog) return;
    observed.skills.forEach((skill, index) => {
      const skillId = matchExpertSkillId(catalog, skill?.name, index);
      if (!skillId) return;
      const current = Number(skill?.level || 0);
      const saved = nextState.expert_skill_targets[skillId];
      if (saved != null && Number(saved) < current) {
        nextState.expert_skill_targets[skillId] = current;
        changed = true;
      }
    });
  });
  nextState.hero_gear_targets ||= {};
  nextState.hero_gear_targets.heroes ||= {};
  Object.entries(nextState.extracted_current?.hero_gear || {}).forEach(([heroId, gearSet]) => {
    const heroTargets = (nextState.hero_gear_targets.heroes[heroId] ||= {});
    heroTargets.pieces ||= {};
    heroGearPieces(gearSet.gear).forEach(([slot, piece]) => {
      const pieceTargets = (heroTargets.pieces[slot] ||= {});
      const currentLevel = Number(piece.level || 0);
      const currentEnhancement = heroGearCurrentEnhancement(piece);
      if (Number(pieceTargets.target_level ?? currentLevel) < currentLevel) {
        pieceTargets.target_level = currentLevel;
        changed = true;
      }
      if (Number(pieceTargets.target_enhancement ?? currentEnhancement) < currentEnhancement) {
        pieceTargets.target_enhancement = currentEnhancement;
        changed = true;
      }
      if (Number(pieceTargets.target_enhancement || 0) > HERO_GEAR_MAX_ENHANCEMENT) {
        pieceTargets.target_enhancement = HERO_GEAR_MAX_ENHANCEMENT;
        changed = true;
      }
    });
  });
  return changed;
}

function applyBuildingBulkTarget(value, fcOnly = false) {
  const levelsByBuilding = groupBy(gameData.building_levels, "building_id");
  Object.entries(state.buildings).forEach(([buildingId, saved]) => {
    const levels = sortByNumber(levelsByBuilding[buildingId] || [], "numerical_level");
    if (!levels.length) return;
    const requested = value === "max" ? maxByOrder(levels, "numerical_level")?.level_code : value;
    const hasTarget = levels.some((level) => String(level.level_code) === String(requested));
    if (!hasTarget) return;
    if (fcOnly && !String(requested).startsWith("FC")) return;
    saved.target = requested;
  });
}

function applyBulkTarget(action, value) {
  if (!value) return false;
  if (action === "buildings-all") {
    applyBuildingBulkTarget(value, false);
    return true;
  }
  if (action === "buildings-fc") {
    applyBuildingBulkTarget(value, true);
    return true;
  }
  if (action === "chief-gear") {
    Object.values(state.chief_gear).forEach((gear) => {
      gear.target = value;
    });
    return true;
  }
  if (action.startsWith("chief-gear:")) {
    const group = CHIEF_TROOP_GROUPS.find((entry) => entry.id === action.split(":")[1]);
    if (!group) return false;
    group.gearSlots.forEach((slotId) => {
      if (state.chief_gear[slotId]) state.chief_gear[slotId].target = value;
    });
    return true;
  }
  if (action === "charms") {
    Object.values(state.charms).forEach((charm) => {
      charm.target = Number(value);
    });
    return true;
  }
  if (action.startsWith("charms:")) {
    const group = CHIEF_TROOP_GROUPS.find((entry) => entry.id === action.split(":")[1]);
    if (!group) return false;
    Object.entries(state.charms).forEach(([slotId, charm]) => {
      const gearSlotId = slotId.split("_")[0];
      if (group.gearSlots.includes(gearSlotId)) charm.target = Number(value);
    });
    return true;
  }
  if (action === "pets") {
    const levelsByPet = groupBy(gameData.pet_levels, "pet_id");
    Object.entries(state.pets).forEach(([petId, pet]) => {
      const levels = levelsByPet[petId] || [];
      const requested = value === "max" ? levels.at(-1)?.level_code : value;
      if (requested && levels.some((level) => String(level.level_code) === String(requested))) pet.target = requested;
    });
    return true;
  }
  if (action === "experts") {
    const levelsByExpert = groupBy(gameData.expert_affinity_levels, "expert_id");
    Object.entries(state.experts).forEach(([expertId, expert]) => {
      const levels = levelsByExpert[expertId] || [];
      const requested = value === "max" ? maxByOrder(levels, "relationship_level")?.level_code : value;
      if (requested && levels.some((level) => String(level.level_code) === String(requested))) expert.relationship_target = requested;
    });
    return true;
  }
  if (action === "hero-gear-level" || action === "hero-gear-enhancement" || action === "hero-special-enhancement") {
    const targetKey = {
      "hero-gear-level": "target_level",
      "hero-gear-enhancement": "target_enhancement",
      "hero-special-enhancement": "special_enhancement",
    }[action];
    const defaultKey = {
      "hero-gear-level": "default_gear_level",
      "hero-gear-enhancement": "default_gear_enhancement",
      "hero-special-enhancement": "default_special_enhancement",
    }[action];
    state.hero_gear_targets ||= {};
    state.hero_gear_targets[defaultKey] = Number(value);
    state.hero_gear_targets.heroes ||= {};
    Object.entries(state.extracted_current?.hero_gear || {}).forEach(([heroId, gearSet]) => {
      const heroTargets = (state.hero_gear_targets.heroes[heroId] ||= {});
      if (action === "hero-special-enhancement") {
        heroTargets.special_enhancement = Number(value);
        return;
      }
      heroTargets.pieces ||= {};
      heroGearPieces(gearSet.gear).forEach(([slot]) => {
        heroTargets.pieces[slot] ||= {};
        heroTargets.pieces[slot][targetKey] = Number(value);
      });
    });
    return true;
  }
  return false;
}

function fieldKeys(fields) {
  return fields.map((field) => (Array.isArray(field) ? field[0] : field));
}

function costIsEmpty(cost) {
  return !Object.values(cost).some((value) => Number(value || 0) > 0);
}

function costGap(cost) {
  return Object.entries(cost).reduce((acc, [key, value]) => {
    const gap = Math.max(0, Number(value || 0) - availableInventoryValue(key));
    if (gap) acc[key] = gap;
    return acc;
  }, {});
}

function exchangeSet(exchangeKey) {
  return exchangeKey ? MATERIAL_EXCHANGE_SETS[exchangeKey] : null;
}

function exchangeTradeText(trade) {
  return `${fmt(trade.fromQty)} ${RESOURCE_LABELS[trade.from] || titleFromId(trade.from)} -> ${fmt(trade.toQty)} ${
    RESOURCE_LABELS[trade.to] || titleFromId(trade.to)
  }`;
}

function exchangeRuleText(rule) {
  return `${fmt(rule.fromQty)} ${RESOURCE_LABELS[rule.from] || titleFromId(rule.from)} -> ${fmt(rule.toQty)} ${
    RESOURCE_LABELS[rule.to] || titleFromId(rule.to)
  } · limit ${fmt(rule.limit)}`;
}

function exchangeRulesHtml(set) {
  if (!set?.rules?.length) return "";
  return `<details class="exchange-rules">
    <summary>${esc(set.label)} rates</summary>
    <div>${set.rules.map((rule) => `<span>${esc(exchangeRuleText(rule))}</span>`).join("")}</div>
  </details>`;
}

function materialExchangePlan(cost, fields, exchangeKey) {
  const set = exchangeSet(exchangeKey);
  const keys = fieldKeys(fields);
  const balances = keys.reduce((acc, key) => {
    acc[key] = availableInventoryValue(key) - Number(cost?.[key] || 0);
    return acc;
  }, {});
  if (!set) {
    return {
      set: null,
      balances,
      gap: keys.reduce((acc, key) => {
        if (balances[key] < 0) acc[key] = Math.abs(balances[key]);
        return acc;
      }, {}),
      trades: [],
    };
  }

  const rules = Object.fromEntries(set.rules.map((rule) => [rule.id, { ...rule, remaining: rule.limit }]));
  const trades = [];
  const recordTrade = (rule, count) => {
    if (!count || count <= 0) return;
    balances[rule.from] = Number(balances[rule.from] || 0) - rule.fromQty * count;
    balances[rule.to] = Number(balances[rule.to] || 0) + rule.toQty * count;
    rule.remaining -= count;
    const existing = trades.find((trade) => trade.id === rule.id);
    if (existing) {
      existing.count += count;
      existing.fromQty += rule.fromQty * count;
      existing.toQty += rule.toQty * count;
      return;
    }
    trades.push({
      id: rule.id,
      from: rule.from,
      to: rule.to,
      count,
      fromQty: rule.fromQty * count,
      toQty: rule.toQty * count,
    });
  };
  const oneStep = (ruleId) => {
    const rule = rules[ruleId];
    if (!rule || Number(balances[rule.to] || 0) >= 0) return;
    const neededTrades = Math.ceil(Math.abs(balances[rule.to]) / rule.toQty);
    const sourceTrades = Math.floor(Math.max(0, Number(balances[rule.from] || 0)) / rule.fromQty);
    recordTrade(rule, Math.min(neededTrades, sourceTrades, rule.remaining));
  };
  const compound = (firstRuleId, secondRuleId, target, firstTradesPerCycle, secondTradesPerCycle) => {
    const first = rules[firstRuleId];
    const second = rules[secondRuleId];
    if (!first || !second || Number(balances[target] || 0) >= 0) return;
    const targetGain = second.toQty * secondTradesPerCycle;
    const neededCycles = Math.ceil(Math.abs(balances[target]) / targetGain);
    const sourceCycles = Math.floor(Math.max(0, Number(balances[first.from] || 0)) / (first.fromQty * firstTradesPerCycle));
    const limitCycles = Math.min(Math.floor(first.remaining / firstTradesPerCycle), Math.floor(second.remaining / secondTradesPerCycle));
    const cycles = Math.min(neededCycles, sourceCycles, limitCycles);
    if (!cycles) return;
    recordTrade(first, cycles * firstTradesPerCycle);
    recordTrade(second, cycles * secondTradesPerCycle);
  };

  if (exchangeKey === "chief_gear") {
    oneStep("gear_design_to_amber");
    compound("gear_polish_to_design", "gear_design_to_amber", "lunar_amber", 10, 1);
    compound("gear_alloy_to_design", "gear_design_to_amber", "lunar_amber", 10, 1);
    oneStep("gear_polish_to_design");
    oneStep("gear_alloy_to_design");
    oneStep("gear_design_to_polish");
    oneStep("gear_alloy_to_polish");
    oneStep("gear_polish_to_alloy");
    oneStep("gear_design_to_alloy");
  } else if (exchangeKey === "chief_charms") {
    oneStep("charm_guides_to_secrets");
    oneStep("charm_designs_to_secrets");
    oneStep("charm_designs_to_guides");
    oneStep("charm_guides_to_designs");
  } else if (exchangeKey === "pet_chests") {
    // Fill the rarest gaps first: serum, then potions, then manuals.
    oneStep("chest_to_serum");
    oneStep("chest_to_potions");
    oneStep("chest_to_manuals");
  }

  const gap = keys.reduce((acc, key) => {
    if (Number(balances[key] || 0) < 0) acc[key] = Math.abs(balances[key]);
    return acc;
  }, {});
  return { set, balances, gap, trades };
}

function exchangeAdjustedNeed(cost, fields, exchangeKey) {
  return exchangeKey ? materialExchangePlan(cost, fields, exchangeKey).gap : costGap(cost);
}

function parseHumanNumber(value) {
  const text = String(value ?? "").trim().replaceAll(",", "");
  const match = text.match(/(-?\d+(?:\.\d+)?)\s*([kmb])?/i);
  if (!match) return 0;
  const multipliers = { k: 1000, m: 1000000, b: 1000000000 };
  return Number(match[1]) * (multipliers[match[2]?.toLowerCase()] || 1);
}

function parseRequiredCostValue(value) {
  const parts = String(value ?? "").split("/");
  return parseHumanNumber(parts.at(-1));
}

function researchCostFromNode(node = {}) {
  return RESEARCH_COST_FIELDS.reduce((acc, field) => {
    const key = fieldKey(field);
    acc[key] = parseRequiredCostValue(node.research_cost?.[key]);
    return acc;
  }, makeCost(RESEARCH_COST_FIELDS));
}

let warAcademyLevelsCache = null;
function warAcademyNodeRows(nodeId) {
  if (!warAcademyLevelsCache) warAcademyLevelsCache = groupBy(gameData.war_academy_levels || [], "node_id");
  return sortByNumber(warAcademyLevelsCache[nodeId] || [], "level");
}

function warAcademyMaxLevel(nodeId) {
  const rows = warAcademyNodeRows(nodeId);
  return rows.length ? Number(rows.at(-1).level || 0) : 0;
}

function warAcademyEffectChange(effect) {
  const text = String(effect || "").replaceAll(",", "");
  const pct = text.match(/^\+?([\d.]+)%\s+(.+)$/);
  if (pct) return { label: pct[2], delta: Number(pct[1]), type: "percent" };
  const num = text.match(/^\+?(\d+)\s+(.+)$/);
  if (num) return { label: num[2], delta: Number(num[1]), type: "number" };
  return null;
}

function warAcademyRangeCost(nodeId, currentLevel, targetLevel) {
  const rows = warAcademyNodeRows(nodeId).filter(
    (row) => Number(row.level) > Number(currentLevel || 0) && Number(row.level) <= Number(targetLevel || 0),
  );
  const cost = makeCost(RESEARCH_COST_FIELDS);
  let seconds = 0;
  let power = 0;
  const changeMap = {};
  rows.forEach((row) => {
    RESEARCH_COST_FIELDS.forEach((field) => {
      const key = fieldKey(field);
      cost[key] += Number(row[key] || 0);
    });
    seconds += Number(row.research_seconds || 0);
    power += Number(row.power || 0);
    const change = warAcademyEffectChange(row.effect);
    if (change) {
      const entry = (changeMap[`${change.label}|${change.type}`] ||= { label: change.label, type: change.type, delta: 0 });
      entry.delta += change.delta;
    }
  });
  return { cost, seconds, minutes: Math.round(seconds / 60), power, steps: rows.length, changes: Object.values(changeMap) };
}

function warAcademyLevelOptions(nodeId, currentLevel, fallbackNext) {
  const max = warAcademyMaxLevel(nodeId);
  if (!max) return researchLevelOptions(currentLevel, fallbackNext);
  const current = Math.max(0, Math.min(max, Number(currentLevel || 0)));
  const options = [];
  for (let level = current; level <= max; level += 1) options.push([level, level ? `Level ${level}` : "Not started"]);
  return options;
}

function romanToNumber(value) {
  const map = { i: 1, v: 5, x: 10 };
  return [...String(value || "").toLowerCase()].reduce((total, char, index, chars) => {
    const current = map[char] || 0;
    const next = map[chars[index + 1]] || 0;
    return total + (current < next ? -current : current);
  }, 0);
}

function parseResearchCurrentLevel(label = "") {
  const roman = String(label).match(/\b([IVX]+)\b$/i);
  if (roman) return romanToNumber(roman[1]);
  const level = String(label).match(/\b(?:Lv\.?|Level)\s*(\d+)\b/i);
  return level ? Number(level[1]) : 0;
}

function parseResearchLevelProgress(node = {}) {
  const progress = String(node.level_progress || node.visible_level_marker || "").match(/(\d+)\s*(?:->|\/)\s*(\d+)/);
  if (progress) return { current: Number(progress[1]), next: Number(progress[2]) };
  const level = Number(node.level || 0);
  return { current: level, next: level + 1 };
}

function ensureResearchTarget(group, nodeId, currentLevel) {
  state.research_targets ||= {};
  state.research_targets[group] ||= {};
  state.research_targets[group][nodeId] ||= {};
  const entry = state.research_targets[group][nodeId];
  if (entry.current == null) entry.current = currentLevel;
  if (entry.target == null) entry.target = entry.current;
  return entry;
}

function researchLevelOptions(currentLevel, nextLevel) {
  const current = Number(currentLevel || 0);
  const next = Math.max(current, Number(nextLevel || current));
  const levels = [...new Set([current, next])].filter((level) => Number.isFinite(level));
  return levels.map((level) => [level, level ? `Level ${level}` : "Not started"]);
}

function parseStatProgress(value) {
  const text = String(value ?? "").replaceAll(",", "");
  const match = text.match(/([+-]?\d+(?:\.\d+)?)\s*(%)?\s*\+\s*([+-]?\d+(?:\.\d+)?)\s*(%)?/);
  if (!match) return null;
  const type = match[2] || match[4] ? "percent" : "number";
  const current = Number(match[1]);
  const delta = Number(match[3]);
  return { current, target: current + delta, delta, type };
}

function researchImpactChanges(node = {}, selected = false) {
  if (!selected) return [];
  const ignored = new Set([
    "level",
    "level_progress",
    "status",
    "effect",
    "power",
    "research_cost",
    "original_time",
    "current_time",
    "remaining_time",
    "finish_cost_diamonds",
  ]);
  return Object.entries(node)
    .filter(([key]) => !ignored.has(key))
    .map(([key, value]) => {
      const progress = parseStatProgress(value);
      if (!progress) return null;
      return numericStatChange(titleFromId(key), progress.current, progress.target, progress.type);
    })
    .filter(Boolean);
}

function researchCostStatusHtml(cost, fields, note = "") {
  if (costIsEmpty(cost)) return `<span class="muted">${esc(note || "Cost not captured")}</span>`;
  return `<div>${costHtml(cost, fields)}${inventoryComparisonHtml(cost, fields, "This research step")}</div>`;
}

function titleCaseWords(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function materialDisplayLabel(key, fields = []) {
  if (RESOURCE_LABELS[key]) return RESOURCE_LABELS[key];
  const field = fields.find((entry) => fieldKey(entry) === key);
  const alias = Array.isArray(field) ? field[1] : key;
  return titleCaseWords(alias);
}

function inventorySnapshot(fields) {
  return fieldKeys(fields).reduce((acc, key) => {
    acc[key] = availableInventoryValue(key);
    return acc;
  }, {});
}

function coverageChipHtml(state, text, tooltip = "") {
  return `<span class="coverage-chip coverage-chip--${state}" title="${esc(tooltip)}">${text}</span>`;
}

function inventoryComparisonHtml(cost, fields, title = "Inventory check", exchangeKey = "") {
  const available = inventorySnapshot(fields);
  const exchangePlan = exchangeKey ? materialExchangePlan(cost, fields, exchangeKey) : null;
  const need = exchangePlan ? exchangePlan.gap : costGap(cost);
  const status = costIsEmpty(need) ? "Covered" : "Need more";
  const exchangeHtml = exchangePlan?.trades.length
    ? `<div class="inventory-check__exchange"><span>Suggested exchange</span><div class="exchange-trade-list">${exchangePlan.trades.map((trade) => `<em>${esc(exchangeTradeText(trade))}</em>`).join("")}</div></div>`
    : "";
  const exchangeRules = exchangePlan ? exchangeRulesHtml(exchangePlan.set) : "";
  const rows = fieldKeys(fields)
    .map((key) => {
      const required = Number(cost[key] || 0);
      const have = Number(available[key] || 0);
      const short = Number(need[key] || 0);
      let stateClass = "is-none";
      let chip = coverageChipHtml("none", "&ndash; none needed", "This material is not required by the selected targets");
      if (required > 0 && short > 0) {
        stateClass = "is-lacking";
        chip = coverageChipHtml("lacking", `&#10007; short ${fmt(short)}`, exchangePlan ? "Still missing after the suggested exchange" : "Missing from inventory");
      } else if (required > 0) {
        stateClass = "is-excess";
        const spare = have - required;
        chip = spare > 0
          ? coverageChipHtml("excess", `&#10003; excess +${fmt(spare)}`, "Covered with spare stock left over")
          : coverageChipHtml("excess", "&#10003; covered exactly", "Covered with nothing to spare");
      }
      const label = materialDisplayLabel(key, fields);
      return `<div class="coverage-row ${stateClass}">
        <span class="coverage-row__name">${visualResourceLabel(key, label)}</span>
        <span class="coverage-row__value">${required > 0 ? fmt(required) : "&ndash;"}</span>
        <span class="coverage-row__value">${fmt(have)}</span>
        ${chip}
      </div>`;
    })
    .join("");
  return `<div class="inventory-check ${costIsEmpty(need) ? "inventory-check--covered" : ""}">
    <div class="inventory-check__head">
      <span>${esc(title)}</span>
      <strong>${exchangePlan ? `${status} after exchange` : status}</strong>
    </div>
    <div class="coverage-table">
      <div class="coverage-row coverage-row--head"><span>Material</span><span>Required</span><span>You have</span><span>Status</span></div>
      ${rows}
    </div>
    ${exchangeHtml}
    ${exchangeRules}
  </div>`;
}

function smartBiasFor(moduleId) {
  const saved = state.smart_recommendations?.[moduleId]?.bias;
  return SMART_RECOMMENDATION_BIASES.some(([value]) => value === saved) ? saved : "balanced";
}

function smartBiasSelectHtml(moduleId) {
  return selectInput(`smart_recommendations.${moduleId}.bias`, smartBiasFor(moduleId), SMART_RECOMMENDATION_BIASES);
}

function nextOrderedRow(rows, currentId, idKey, orderKey) {
  const sorted = sortByNumber(rows || [], orderKey);
  const current = sorted.find((row) => String(row[idKey]) === String(currentId));
  const currentOrder = current ? Number(current[orderKey] || 0) : -Infinity;
  return sorted.find((row) => Number(row[orderKey] || 0) > currentOrder) || null;
}

function addCostCopy(base, extra) {
  return addCost({ ...base }, extra || {});
}

function smartCostAffordable(cost, fields, exchangeKey = "") {
  return costIsEmpty(exchangeAdjustedNeed(cost, fields, exchangeKey));
}

function smartCostPressure(cost, fields) {
  return fieldKeys(fields).reduce((total, key) => {
    const amount = Number(cost?.[key] || 0);
    if (amount <= 0) return total;
    const available = availableInventoryValue(key);
    if (available <= 0) return total + 4;
    return total + amount / available;
  }, 0);
}

function smartLabelMatchesTroop(label, troop) {
  const normalized = normalizeKey(label);
  if (troop === "marksman") return normalized.includes("marksman") || normalized.includes("marksmen");
  return normalized.includes(troop);
}

function smartBiasMultiplier(candidate, label, bias) {
  const normalized = normalizeKey(label);
  const troopType = normalizedTroopKey(candidate.troopType || candidate.meta || "");
  const troopBiases = ["infantry", "lancer", "marksman"];
  if (troopBiases.includes(bias)) {
    if (troopType === bias || smartLabelMatchesTroop(label, bias)) return 3.2;
    if (troopBiases.some((troop) => smartLabelMatchesTroop(label, troop))) return 0.45;
    return 0.85;
  }
  if (bias === "attack") return normalized.includes("attack") || normalized.includes("atk") ? 2.4 : 0.8;
  if (bias === "defense") return normalized.includes("defense") || normalized.includes("def") ? 2.4 : 0.8;
  if (bias === "lethality") return normalized.includes("lethality") || normalized.includes("leth") || normalized.includes("lth") ? 2.6 : 0.75;
  if (bias === "health") return normalized.includes("health") || normalized.includes("hlth") || normalized.includes("hp") ? 2.6 : 0.75;
  if (bias === "power") return normalized.includes("power") || normalized.includes("svs") ? 2.5 : 0.55;
  return 1;
}

function smartChangeBenefit(change, candidate, bias) {
  const delta = Math.max(0, Number(change.rawDelta ?? change.deltaRaw ?? 0));
  if (!delta) return 0;
  const type = change.type || (String(change.delta || "").includes("%") ? "percent" : "number");
  const base = type === "percent" ? delta * 100 : delta * 0.35;
  return base * smartBiasMultiplier(candidate, change.label || "", bias);
}

function smartCandidateBenefit(candidate, bias) {
  const statBenefit = (candidate.changes || []).reduce((total, change) => total + smartChangeBenefit(change, candidate, bias), 0);
  const powerWeight = bias === "power" ? 0.025 : 0.003;
  const powerBenefit = Math.max(0, Number(candidate.powerDelta || 0)) * powerWeight;
  const svsBenefit = Math.max(0, Number(candidate.svsGain || 0)) * (bias === "power" ? 0.2 : 0.05);
  return statBenefit + powerBenefit + svsBenefit;
}

function smartCandidateScore(candidate, fields, bias) {
  const benefit = smartCandidateBenefit(candidate, bias);
  const pressure = smartCostPressure(candidate.cost, fields);
  return benefit / Math.max(0.08, 1 + pressure);
}

function smartOptimize({ moduleId, fields, exchangeKey = "", targetState, buildCandidates }) {
  const bias = smartBiasFor(moduleId);
  const totalCost = makeCost(fields);
  const selected = [];
  let blockedCandidates = [];
  for (let step = 0; step < SMART_RECOMMENDATION_LIMIT; step += 1) {
    const candidates = buildCandidates(targetState)
      .filter((candidate) => candidate && !costIsEmpty(candidate.cost))
      .map((candidate) => ({
        ...candidate,
        benefit: smartCandidateBenefit(candidate, bias),
        score: smartCandidateScore(candidate, fields, bias),
      }))
      .filter((candidate) => candidate.benefit > 0);
    if (!candidates.length) break;
    const affordable = candidates
      .filter((candidate) => smartCostAffordable(addCostCopy(totalCost, candidate.cost), fields, exchangeKey))
      .sort((a, b) => b.score - a.score || b.benefit - a.benefit);
    if (!affordable.length) {
      blockedCandidates = candidates.sort((a, b) => b.score - a.score || b.benefit - a.benefit).slice(0, 6);
      break;
    }
    const best = affordable[0];
    selected.push(best);
    addCost(totalCost, best.cost);
    best.applyToPlan?.(targetState);
  }
  return {
    moduleId,
    bias,
    fields,
    exchangeKey,
    selected,
    blockedCandidates,
    totalCost,
  };
}

function smartCandidateImpactText(candidate) {
  const statText = statBenefitText(candidate.changes || []);
  if (statText) return statText;
  if (candidate.svsGain) return `SVS ${signedFmt(candidate.svsGain)}`;
  if (candidate.powerDelta) return `Power ${signedFmt(candidate.powerDelta)}`;
  return "Best available material fit";
}

function smartRecommendationCardHtml(candidate, index) {
  return `<div class="smart-card">
    <div class="smart-card__head">
      ${iconHtml(candidate.kind || "generic", candidate.label, "sm", candidate.scope || "")}
      <div><strong>${fmt(index + 1)}. ${esc(candidate.label)}</strong>${candidate.meta ? `<span>${esc(candidate.meta)}</span>` : ""}</div>
    </div>
    <div class="smart-card__route">
      <span><small>Start</small><b>${esc(candidate.from)}</b></span>
      <i aria-hidden="true"></i>
      <span><small>Target</small><b>${esc(candidate.to)}</b></span>
    </div>
    <p>${esc(smartCandidateImpactText(candidate))}</p>
    ${costHtml(candidate.cost, candidate.fields || [])}
  </div>`;
}

function smartRecommendationPanelHtml(moduleId, title, plan, note = "") {
  const shown = plan.selected.slice(0, 8);
  const hidden = Math.max(0, plan.selected.length - shown.length);
  const blocked = !plan.selected.length && plan.blockedCandidates.length;
  const cards = shown.length
    ? shown.map(smartRecommendationCardHtml).join("")
    : blocked
      ? plan.blockedCandidates.slice(0, 3).map(smartRecommendationCardHtml).join("")
      : `<div class="smart-empty">No affordable stat-positive target changes found with current materials.</div>`;
  const selectedText = plan.selected.length
    ? `${fmt(plan.selected.length)} recommended upgrade ${plan.selected.length === 1 ? "step" : "steps"}`
    : blocked
      ? "Next best changes are not affordable"
      : "No recommendation available";
  const blockedShown = blocked ? plan.blockedCandidates.slice(0, 3) : [];
  const coverageCost = plan.selected.length
    ? plan.totalCost
    : blockedShown.length
      ? blockedShown.reduce((acc, candidate) => addCost(acc, candidate.cost || {}), makeCost(plan.fields))
      : plan.totalCost;
  const comparisonTitle = plan.selected.length
    ? plan.exchangeKey
      ? "Material coverage (with exchange)"
      : "Material coverage"
    : blockedShown.length
      ? "Material coverage — next best steps shown above (not yet affordable)"
      : plan.exchangeKey
        ? "Material coverage (with exchange)"
        : "Material coverage";
  return `<section class="panel smart-panel">
    <div class="smart-panel__head">
      <div>
        <span class="eyebrow">Smart recommendation</span>
        <h2>${esc(title)}</h2>
        <p>${esc(note || "Ranks affordable target changes by stat gain per material using your current inventory.")}</p>
      </div>
      <div class="smart-controls">
        <label><span>Bias</span>${smartBiasSelectHtml(moduleId)}</label>
        <button type="button" data-smart-apply="${esc(moduleId)}" ${plan.selected.length ? "" : "disabled"}>Apply recommendation</button>
      </div>
    </div>
    <div class="smart-panel__summary">
      <span>${esc(selectedText)}</span>
      <strong>${esc(SMART_RECOMMENDATION_BIASES.find(([value]) => value === plan.bias)?.[1] || "Balanced stats")}</strong>
      ${hidden ? `<em>${fmt(hidden)} more in plan</em>` : ""}
    </div>
    <div class="smart-card-grid">${cards}</div>
    ${inventoryComparisonHtml(coverageCost, plan.fields, comparisonTitle, plan.exchangeKey)}
  </section>`;
}

function upgradeSelectionText(count, singular, plural = `${singular}s`) {
  return `${fmt(count)} ${count === 1 ? singular : plural} selected`;
}

const NUTSHELL_DIRECT_UPGRADE_LIMIT = 10;
const NUTSHELL_IMPACT_CARD_LIMIT = 3;

function upgradeGroupLabel(upgrade = {}) {
  const meta = String(upgrade.meta || "").trim();
  if (meta.includes("|")) return meta.split("|")[0].trim();
  if (meta.includes("·")) return meta.split("·")[0].trim();
  if (["Infantry", "Lancer", "Marksman", "Marksmen"].includes(meta)) return meta === "Marksmen" ? "Marksman" : meta;
  if (upgrade.kind === "building") return "Buildings";
  if (upgrade.kind === "pet") return "Pets";
  if (upgrade.kind === "expert") return "Experts";
  return meta || titleFromId(upgrade.kind || "targets");
}

function parseUpgradePoint(value) {
  const text = String(value || "");
  const level = text.match(/\bLv\.?\s*(\d+|\?)/i);
  if (!level) return null;
  const enhance = text.match(/\/\+(\d+|\?)/);
  return {
    level: level[1] === "?" ? null : Number(level[1]),
    enhancement: enhance?.[1] === "?" ? null : enhance ? Number(enhance[1]) : null,
  };
}

function rangeText(numbers, prefix = "") {
  const clean = numbers.filter((value) => Number.isFinite(value));
  if (!clean.length) return "";
  const min = Math.min(...clean);
  const max = Math.max(...clean);
  return `${prefix}${min === max ? fmt(min) : `${fmt(min)}-${fmt(max)}`}`;
}

function summarizeUpgradePoint(values) {
  const unique = [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];
  if (!unique.length) return "-";
  if (unique.length === 1) return unique[0];
  const parsed = values.map(parseUpgradePoint);
  if (parsed.every(Boolean)) {
    const level = rangeText(parsed.map((point) => point.level), "Lv ");
    const enhancement = rangeText(parsed.map((point) => point.enhancement), "+");
    return [level, enhancement].filter(Boolean).join(" / ");
  }
  return "Mixed";
}

function nutshellUpgradeItems(upgrades = []) {
  if (upgrades.length <= NUTSHELL_DIRECT_UPGRADE_LIMIT) return upgrades;
  const groups = new Map();
  upgrades.forEach((upgrade) => {
    const label = upgradeGroupLabel(upgrade);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(upgrade);
  });
  if (groups.size >= upgrades.length) return upgrades;
  return [...groups.entries()].map(([label, items]) => ({
    kind: items[0]?.kind || "generic",
    scope: items[0]?.scope || "",
    label,
    meta: `${fmt(items.length)} ${items.length === 1 ? "target" : "targets"}`,
    from: summarizeUpgradePoint(items.map((item) => item.from)),
    to: summarizeUpgradePoint(items.map((item) => item.to)),
  }));
}

function upgradePathStripHtml(upgrades = [], empty = "No upgrade targets selected.") {
  if (!upgrades.length) {
    return `<div class="nutshell-upgrade-strip nutshell-upgrade-strip--empty"><span>${esc(empty)}</span></div>`;
  }
  const displayUpgrades = nutshellUpgradeItems(upgrades);
  return `<div class="nutshell-upgrade-strip" aria-label="Selected upgrade paths">${displayUpgrades
    .map(
      (upgrade) => `<div class="nutshell-upgrade-card">
        <div class="nutshell-upgrade-card__head">
          ${iconHtml(upgrade.kind || "generic", upgrade.label, "sm", upgrade.scope || "")}
          <div><strong>${esc(upgrade.label)}</strong>${upgrade.meta ? `<span>${esc(upgrade.meta)}</span>` : ""}</div>
        </div>
        <div class="nutshell-upgrade-route">
          <span><small>Start</small><b>${esc(upgrade.from)}</b></span>
          <i aria-hidden="true"></i>
          <span><small>Target</small><b>${esc(upgrade.to)}</b></span>
        </div>
      </div>`,
    )
    .join("")}</div>`;
}

function upgradeNutshellHtml({
  module,
  selected,
  upgrades = [],
  impactCards = [],
  details = [],
  cost,
  fields,
  empty = "Choose targets above your current levels to see requirements.",
  exchangeKey = "",
}) {
  const keys = fieldKeys(fields);
  const exchangePlan = exchangeKey ? materialExchangePlan(cost, fields, exchangeKey) : null;
  const allEntries = keys.map((key) => {
    const required = Number(cost?.[key] || 0);
    const available = availableInventoryValue(key);
    return {
      key,
      required,
      available,
      balance: exchangePlan ? Number(exchangePlan.balances[key] || 0) : available - required,
    };
  });
  const hasRequired = allEntries.some((entry) => entry.required > 0);
  const entries = hasRequired ? allEntries.filter((entry) => entry.required > 0 || entry.available > 0) : [];
  const neededCount = entries.filter((entry) => entry.balance < 0).length;
  const resultLabel = !hasRequired ? "Awaiting targets" : neededCount ? `${fmt(neededCount)} short${exchangePlan ? " after exchange" : ""}` : exchangePlan ? "Covered after exchange" : "All covered";
  const requiredCount = entries.filter((entry) => entry.required > 0).length;
  const allImpactCards = impactCards.filter(Boolean);
  const visibleImpactCards = allImpactCards.slice(0, NUTSHELL_IMPACT_CARD_LIMIT);
  const hiddenImpactCount = Math.max(0, allImpactCards.length - visibleImpactCards.length);
  const detailItems = [
    ...(exchangePlan ? [...details, exchangePlan.trades.length ? "Exchange applied" : "Exchange-aware"] : details),
    ...(hiddenImpactCount ? [`${fmt(hiddenImpactCount)} more stat changes below`] : []),
  ];
  const detailHtml = detailItems.length
    ? `<div class="nutshell-detail-list">${detailItems.map((detail) => `<span>${esc(detail)}</span>`).join("")}</div>`
    : "";
  const impactHtml = visibleImpactCards.length
    ? `<div class="nutshell-impact">
        <div class="nutshell-impact__head"><strong>Expected impact</strong><span>From selected targets</span></div>
        <div class="nutshell-impact-grid">${visibleImpactCards.join("")}</div>
      </div>`
    : "";
  const materialHtml = entries.length
    ? entries
        .map((entry) => {
          const isShort = entry.balance < 0;
          const isExact = entry.balance === 0;
          const deltaText = isShort ? `Need ${fmt(Math.abs(entry.balance))}` : isExact ? "Covered" : `Excess +${fmt(entry.balance)}`;
          return `<div class="nutshell-material ${isShort ? "nutshell-material--need" : "nutshell-material--excess"}">
            <div class="nutshell-material__head">${visualResourceLabel(entry.key)}<strong>${fmt(entry.required)}</strong></div>
            <div class="nutshell-material__meta"><span>Have ${fmt(entry.available)}</span><b class="${isShort ? "nutshell-delta--need" : "nutshell-delta--excess"}">${esc(deltaText)}</b></div>
          </div>`;
        })
        .join("")
    : `<div class="nutshell-empty">${esc(empty)}</div>`;
  const exchangeHtml = exchangePlan?.trades.length
    ? `<div class="nutshell-exchange"><strong>${esc(exchangePlan.set.label)} applied</strong><div>${exchangePlan.trades
        .map((trade) => `<span>${esc(exchangeTradeText(trade))}</span>`)
        .join("")}</div></div>`
    : "";
  return `<section class="upgrade-nutshell" aria-label="${esc(module)} upgrade summary">
    <div class="upgrade-nutshell__head">
      <div>
        <span class="eyebrow">In a nutshell</span>
        <h3>${esc(module)}</h3>
      </div>
      <strong class="upgrade-nutshell__selected">${esc(selected)}</strong>
    </div>
    ${upgradePathStripHtml(upgrades)}
    ${impactHtml}
    ${detailHtml}
    <div class="nutshell-material-grid">${materialHtml}</div>
    ${exchangeHtml}
  </section>`;
}

function directAffordable(cost) {
  return Object.keys(costGap(cost)).length === 0;
}

function weightedCost(cost) {
  const weights = {
    meat: 1,
    wood: 1,
    coal: 5,
    iron: 20,
    fire_crystals: 1800000,
    refined_fire_crystals: 6500000,
    steel: 800,
    fire_crystal_shards: 350000,
    hardened_alloy: 9000,
    polishing_solution: 900000,
    design_plans: 2600000,
    lunar_amber: 9000000,
    charm_guides: 600000,
    charm_designs: 750000,
    charm_secrets: 2200000,
    pet_food: 12000,
    pet_manuals: 350000,
    pet_potions: 650000,
    pet_serum: 1600000,
    common_sigils: 3000000,
    expert_affinity: 40000,
    hero_gear_xp: 30000,
    essence_stones: 90000,
    mythic_gear: 1200000,
    mithril: 2500000,
  };
  return Object.entries(cost).reduce((total, [key, value]) => total + Number(value || 0) * (weights[key] || 1), 0);
}

function nextLevel(rows, currentId, idKey, orderKey) {
  const sorted = sortByNumber(rows, orderKey);
  const current = sorted.find((row) => String(row[idKey]) === String(currentId));
  if (!current) return { current: null, next: null };
  const currentOrder = Number(current[orderKey] || 0);
  return { current, next: sorted.find((row) => Number(row[orderKey] || 0) > currentOrder) || null };
}

function extractedBuildingIds() {
  return new Set(
    Object.entries(state.extracted_current?.buildings || {})
      .filter(([, building]) => building?.current)
      .map(([id]) => id),
  );
}

function manuallyConfirmedBuilding(buildingId) {
  const current = state.buildings?.[buildingId]?.current;
  const defaultCurrent = templateState.buildings?.[buildingId]?.current;
  return current != null && String(current) !== String(defaultCurrent);
}

function buildingIsConfirmed(buildingId) {
  return extractedBuildingIds().has(buildingId) || manuallyConfirmedBuilding(buildingId);
}

function confirmedPetIds() {
  const byName = Object.fromEntries(gameData.pets.map((pet) => [normalizeKey(pet.name), pet.pet_id]));
  return new Set(
    Object.entries(state.extracted_current?.pets || {})
      .map(([id, pet]) => (state.pets[id] ? id : byName[normalizeKey(pet?.name)]))
      .filter(Boolean),
  );
}

function candidateRow(candidate) {
  const gap = exchangeAdjustedNeed(candidate.cost, candidate.fields, candidate.exchangeKey);
  const affordable = Object.keys(gap).length === 0;
  const score = candidate.benefitValue / Math.max(1, weightedCost(candidate.cost));
  return {
    ...candidate,
    gap,
    affordable,
    score,
  };
}

function plannerCandidates() {
  const candidates = [];
  const levelsByBuilding = groupBy(gameData.building_levels, "building_id");
  gameData.buildings.forEach((building) => {
    const saved = state.buildings[building.building_id];
    const confirmed = buildingIsConfirmed(building.building_id);
    if (!saved || !confirmed) return;
    const levels = levelsByBuilding[building.building_id] || [];
    const step = nextLevel(levels, saved.current, "level_code", "numerical_level");
    if (!step.next) return;
    const cost = applyConstructionDiscount(rangeCost(levels, saved.current, step.next.level_code, {
      idKey: "level_code",
      orderKey: "numerical_level",
      fields: BUILDING_FIELDS,
    }));
    if (costIsEmpty(cost)) return;
    candidates.push(
      candidateRow({
        module: "Building",
        item: building.name,
        from: saved.current,
        to: step.next.level_code,
        cost,
        fields: BUILDING_FIELDS,
        benefit: step.next.build_seconds
          ? `${timeFmt(constructionTimePlan(step.next.build_seconds).adjustedSeconds)} with selected construction buffs (${timeFmt(step.next.build_seconds)} base)`
          : "Next building level",
        benefitValue: Number(step.next.numerical_level || 0) * 100000,
        confidence: "High current-level confidence; building stat delta not in workbook table",
      }),
    );
  });

  const gearLevels = sortByNumber(gameData.chief_gear_levels, "sequence");
  gameData.chief_gear_slots.forEach((slot) => {
    const saved = state.chief_gear[slot.slot_id];
    const step = nextLevel(gearLevels, saved?.current, "gear_level_code", "sequence");
    if (!step.next) return;
    const cost = rangeCost(gearLevels, saved.current, step.next.gear_level_code, {
      idKey: "gear_level_code",
      orderKey: "sequence",
      fields: GEAR_FIELDS,
    });
    const powerDelta = Number(step.next.power || 0) - Number(step.current?.power || 0);
    const statText = statBenefitText(chiefGearAttributeChanges(slot.slot_id, saved.current, step.next.gear_level_code));
    candidates.push(
      candidateRow({
        module: "Chief Gear",
        item: slot.name,
        from: saved.current,
        to: step.next.gear_level_code,
        cost,
        fields: GEAR_FIELDS,
        exchangeKey: "chief_gear",
        benefit: `${statText || "No attribute change"}; +${fmt(powerDelta)} power`,
        benefitValue: Math.max(1, powerDelta) + Math.max(0, Number(chiefGearStatRow(step.next.gear_level_code).stat_percent || 0) * 10000),
        confidence: "High; workbook cost/power plus sourced attribute table",
      }),
    );
  });

  const charmLevels = [{ charm_level: 0, power: 0 }, ...gameData.chief_charm_levels];
  gameData.chief_charm_slots.forEach((slot) => {
    const saved = state.charms[slot.slot_id];
    const step = nextLevel(charmLevels, saved?.current, "charm_level", "charm_level");
    if (!step.next) return;
    const cost = rangeCost(charmLevels, saved.current, step.next.charm_level, {
      idKey: "charm_level",
      orderKey: "charm_level",
      fields: CHARM_FIELDS,
    });
    const powerDelta = Number(step.next.power || 0) - Number(step.current?.power || 0);
    const statText = statBenefitText(chiefCharmAttributeChanges(normalizeKey(slot.gear_slot), saved.current, step.next.charm_level));
    candidates.push(
      candidateRow({
        module: "Charm",
        item: slot.name,
        from: saved.current,
        to: step.next.charm_level,
        cost,
        fields: CHARM_FIELDS,
        exchangeKey: "chief_charms",
        benefit: `${statText || "No attribute change"}; +${fmt(powerDelta)} power`,
        benefitValue: Math.max(1, powerDelta) + Math.max(0, Number(chiefCharmStatRow(step.next.charm_level).stat_percent || 0) * 10000),
        confidence: "High; workbook cost/power plus sourced attribute table",
      }),
    );
  });

  const petIds = confirmedPetIds();
  const levelsByPet = groupBy(gameData.pet_levels, "pet_id");
  gameData.pets.forEach((pet) => {
    if (!petIds.has(pet.pet_id) && String(state.pets[pet.pet_id]?.current) === String(templateState.pets[pet.pet_id]?.current)) return;
    const saved = state.pets[pet.pet_id];
    const levels = (levelsByPet[pet.pet_id] || []).map((row, idx) => ({ ...row, order: idx }));
    const step = nextLevel(levels, saved?.current, "level_code", "order");
    if (!step.next) return;
    const cost = rangeCost(levels, saved.current, step.next.level_code, {
      idKey: "level_code",
      orderKey: "order",
      fields: PET_FIELDS,
    });
    const observed = state.extracted_current?.pets?.[pet.pet_id] || {};
    const observedText = observedStatsText(observed);
    candidates.push(
      candidateRow({
        module: "Pet",
        item: pet.name,
        from: saved.current,
        to: step.next.level_code,
        cost,
        fields: PET_FIELDS,
        benefit: `${observedText ? `${observedText}; ` : ""}${fmt(step.next.svs_points || 0)} SVS points for next level`,
        benefitValue: Math.max(1, Number(step.next.svs_points || 0)),
        confidence: "Medium; workbook has cost/SVS but not live power delta per pet level",
      }),
    );
  });

  const levelsByExpert = groupBy(gameData.expert_affinity_levels, "expert_id");
  gameData.experts.forEach((expert) => {
    const saved = state.experts[expert.expert_id];
    const levels = levelsByExpert[expert.expert_id] || [];
    const step = nextLevel(levels, saved?.relationship_current, "level_code", "relationship_level");
    if (!step.next) return;
    const cost = rangeCost(levels, saved.relationship_current, step.next.level_code, {
      idKey: "level_code",
      orderKey: "relationship_level",
      fields: [["expert_affinity", "affinity"], ["common_sigils", "sigils"]],
    });
    const primaryLabel = expertStatLabel(step.next.primary_stat_label || step.current?.primary_stat_label);
    const primaryDelta = Number(step.next.primary_stat || 0) - Number(step.current?.primary_stat || 0);
    candidates.push(
      candidateRow({
        module: "Expert",
        item: expert.name,
        from: saved.relationship_current,
        to: step.next.level_code,
        cost,
        fields: [["expert_affinity", "affinity"], ["common_sigils", "sigils"]],
        benefit: `${primaryLabel} ${workbookPercentFmt(step.current?.primary_stat || 0)} -> ${workbookPercentFmt(step.next.primary_stat || 0)} (${signedWorkbookPercentFmt(primaryDelta)})`,
        benefitValue: Math.max(1, Number(step.next.power || 0) + Number(step.next.primary_stat || 0) * 1000000),
        confidence: "Medium; affinity stat from workbook, current affinity item inventory must be maintained by user",
      }),
    );
  });

  return candidates.sort((a, b) => Number(b.affordable) - Number(a.affordable) || b.score - a.score);
}

function plannerCoverage() {
  const expectedBuildings = gameData.buildings.map((building) => building.building_id);
  const confirmedBuildings = expectedBuildings.filter((id) => buildingIsConfirmed(id));
  const missingBuildings = expectedBuildings.filter((id) => !buildingIsConfirmed(id));
  const expectedPets = gameData.pets.map((pet) => pet.pet_id);
  const confirmedPets = [...confirmedPetIds()];
  return {
    confirmedBuildings,
    missingBuildings,
    confirmedPets,
    missingPets: expectedPets.filter((id) => !confirmedPets.includes(id)),
    hardGaps: [
      "Full normal research tree exact node costs are not fully extracted.",
      "Full War Academy hidden branch names/costs are not fully extracted.",
      "Flame Tech exact tree/costs remain schema-ready but not populated.",
      "Event reward tiers and troop training calculator are not complete workbook-backed calculators yet.",
    ],
  };
}

function renderNav() {
  $("#moduleNav").innerHTML = MODULES.map(
    ([id, label]) =>
      `<button type="button" class="nav-button ${id === activeTab ? "active" : ""}" data-tab="${id}" aria-current="${id === activeTab ? "page" : "false"}">${esc(label)}</button>`,
  ).join("");
}

function renderProfile() {
  const profile = state.profile;
  $("#profileInputs").innerHTML = `
    <div class="field"><label>Chief</label>${textInput("profile.chief_name", profile.chief_name)}</div>
    <div class="field"><label>State</label>${textInput("profile.state_number", profile.state_number)}</div>
    <div class="field"><label>State age</label>${numberInput("profile.state_age_days", profile.state_age_days)}</div>
    <div class="field"><label>Furnace</label>${textInput("profile.furnace_level", profile.furnace_level)}</div>
    <div class="field"><label>Construction %</label>${numberInput("profile.construction_speed_pct", profile.construction_speed_pct, 0, 0.1)}</div>
    <div class="field"><label>Research %</label>${numberInput("profile.research_speed_pct", profile.research_speed_pct)}</div>
  `;
}

function renderOverview() {
  const buildingCost = allBuildingCosts();
  const gearCost = allGearCosts();
  const charmCost = allCharmCosts();
  const heroGearCost = allHeroGearCosts();
  const petCost = allPetCosts();
  const expertCost = allExpertCosts();
  const coverage = plannerCoverage();
  const buildingNeed = needAfterInventory(buildingCost);
  const gearNeed = exchangeAdjustedNeed(gearCost, GEAR_FIELDS, "chief_gear");
  const charmNeed = exchangeAdjustedNeed(charmCost, CHARM_FIELDS, "chief_charms");
  const heroGearNeed = needAfterInventory(heroGearCost);
  const petNeed = needAfterInventory(petCost);
  const missingBuildingLabels = coverage.missingBuildings.map((id) => gameData.buildings.find((building) => building.building_id === id)?.name || id);
  const missingBuildingNames = missingBuildingLabels.join(", ");
  const missingBuildingSummary =
    missingBuildingLabels.length > 4 ? `${missingBuildingLabels.slice(0, 4).join(", ")} +${missingBuildingLabels.length - 4} more` : missingBuildingNames;
  const workbookCoverage = gameData.coverage.exact_from_workbook || [];
  const tableCoverage = gameData.coverage.schema_ready_needs_in_game_tables || [];

  $("#tab-overview").innerHTML = `
    <div class="summary-grid">
      <div class="metric blue"><span>Building rows</span><strong>${fmt(gameData.building_levels.length)}</strong></div>
      <div class="metric amber"><span>Chief gear levels</span><strong>${fmt(gameData.chief_gear_levels.length)}</strong></div>
      <div class="metric green"><span>Pets tracked</span><strong>${fmt(gameData.pets.length)}</strong></div>
      <div class="metric purple"><span>Research gaps</span><strong>${fmt(gameData.researched_systems.filter((x) => x.status.includes("needed")).length)}</strong></div>
    </div>
    ${
      coverage.missingBuildings.length
        ? `<div class="panel coverage-banner">
            <h2>Accuracy Guardrail</h2>
            <p>Planner excludes ${fmt(coverage.missingBuildings.length)} unconfirmed building rows: ${esc(missingBuildingSummary)}.</p>
          </div>`
        : ""
    }
    <div class="grid-2">
      <div class="panel">
        <h2>Target Cost Snapshot</h2>
        <div class="table-wrap overview-cost-table">
          <table>
            <thead><tr><th>Module</th><th>Remaining cost</th><th>Uncovered by inventory</th></tr></thead>
            <tbody>
              <tr><td>Buildings</td><td>${costHtml(buildingCost, BUILDING_FIELDS)}</td><td>${costHtml(buildingNeed, BUILDING_FIELDS)}</td></tr>
              <tr><td>Chief Gear</td><td>${costHtml(gearCost, GEAR_FIELDS)}</td><td>${costHtml(gearNeed, GEAR_FIELDS)}</td></tr>
              <tr><td>Charms</td><td>${costHtml(charmCost, CHARM_FIELDS)}</td><td>${costHtml(charmNeed, CHARM_FIELDS)}</td></tr>
              <tr><td>Hero Gear</td><td>${costHtml(heroGearCost, HERO_GEAR_FIELDS)}</td><td>${costHtml(heroGearNeed, HERO_GEAR_FIELDS)}</td></tr>
              <tr><td>Pets</td><td>${costHtml(petCost, PET_FIELDS)}</td><td>${costHtml(petNeed, PET_FIELDS)}</td></tr>
              <tr><td>Experts</td><td>${costHtml(expertCost, ["expert_affinity", ["common_sigils", "sigils"]])}</td><td>${costHtml(needAfterInventory(expertCost), ["expert_affinity", ["common_sigils", "sigils"]])}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <h2>Coverage</h2>
        <div class="coverage-summary">
          <span class="status-pill">Workbook ${fmt(workbookCoverage.length)}</span>
          <span class="status-pill warn">Needs table ${fmt(tableCoverage.length)}</span>
        </div>
        <details class="table-disclosure coverage-disclosure">
          <summary>Coverage details</summary>
          <ul class="gap-list">
            ${workbookCoverage.map((item) => `<li><span class="status-pill">Workbook</span> ${esc(item)}</li>`).join("")}
            ${tableCoverage.map((item) => `<li><span class="status-pill warn">Needs table</span> ${esc(item)}</li>`).join("")}
          </ul>
        </details>
      </div>
    </div>
  `;
}

function plannerTableRows(candidates) {
  return candidates
    .slice(0, 16)
    .map(
      (candidate) => `<tr>
        <td title="${esc(candidate.confidence || "")}">${visualLabel(candidate.module, candidate.module)}</td>
        <td>${visualLabel(candidate.module, candidate.item, `${candidate.from} -> ${candidate.to}`)}</td>
        <td>${costHtml(candidate.cost, candidate.fields)}</td>
        <td>${candidate.affordable ? '<span class="status-pill">Affordable</span>' : `<span class="status-pill warn">Gap</span><div class="mini-cost">${costHtml(candidate.gap, Object.keys(candidate.gap))}</div>`}</td>
        <td>${esc(candidate.benefit)}</td>
      </tr>`,
    )
    .join("");
}

function plannerBrief(candidates, coverage) {
  const affordable = candidates.filter((candidate) => candidate.affordable).slice(0, 5);
  const blocked = candidates.filter((candidate) => !candidate.affordable).slice(0, 3);
  const constructionPlan = constructionTimePlan(0);
  const lines = [
    `Account: ${state.profile.chief_name || "unknown"} in State ${state.profile.state_number || "unknown"}, Furnace ${state.profile.furnace_level || "unknown"}, power ${fmt(state.profile.power)}.`,
    `Inventory used for math: the single editable resource values in the Resources page. Random and choice resource chests are intentionally excluded unless the user converts them into those editable values.`,
    `Construction timing uses ${fmt(constructionPlan.totalSpeedPct, 2)}% total construction speed: ${fmt(constructionPlan.baseSpeedPct, 2)}% base plus ${fmt(constructionPlan.activeBuffPct, 2)}% selected minister/pet/chief-order/other buffs.`,
    `Confirmed current systems: ${coverage.confirmedBuildings.length}/${gameData.buildings.length} workbook buildings, ${Object.keys(state.chief_gear).length}/6 chief gear slots, ${Object.keys(state.charms).length}/18 charms, ${coverage.confirmedPets.length}/${gameData.pets.length} pets, ${Object.keys(state.experts).length}/${gameData.experts.length} experts, ${Object.keys(state.extracted_current?.hero_gear || {}).length} hero gear sets.`,
    affordable.length
      ? `Best affordable next steps by immediate value: ${affordable.map((candidate) => `${candidate.module} ${candidate.item} ${candidate.from}->${candidate.to}`).join("; ")}.`
      : "No affordable next step was found from the tracked material balances; update backpack material inventories in Resources to unlock recommendations.",
    blocked.length ? `Closest blocked next steps: ${blocked.map((candidate) => `${candidate.module} ${candidate.item} needs ${Object.entries(candidate.gap).map(([key, value]) => `${fmt(value)} ${RESOURCE_LABELS[key] || key}`).join(", ")}`).join("; ")}.` : "",
    coverage.missingBuildings.length ? `Accuracy warning: missing current building levels for ${coverage.missingBuildings.join(", ")}. Building projections involving those rows are excluded from AI Planner recommendations until confirmed.` : "All workbook building current levels are confirmed or manually overridden.",
  ].filter(Boolean);
  return lines.join("\n\n");
}

function plannerPayload(candidates, coverage) {
  const inventory = Object.keys(state.resources || {}).reduce(
    (acc, key) => {
      acc[key] = availableInventoryValue(key);
      return acc;
    },
    {},
  );
  return {
    generated_at: new Date().toISOString(),
    account: {
      chief_name: state.profile.chief_name,
      chief_id: state.extracted_current?.profile?.chief_id,
      state_number: state.profile.state_number,
      furnace_level: state.profile.furnace_level,
      power: state.profile.power,
      vip_level: state.extracted_current?.profile?.vip_level,
      alliance: state.extracted_current?.profile?.alliance,
    },
    inventory,
    backpack_inventory: {
      direct_resource_value: state.extracted_current?.resources?.backpack_direct_resource_value || {},
      clear_counts: state.extracted_current?.resources?.backpack_clear_counts || {},
      speedups: state.extracted_current?.resources?.speedups || {},
      bonus: state.extracted_current?.resources?.backpack_items?.bonus || [],
    },
    construction_time: {
      base_construction_speed_pct: Number(state.profile.construction_speed_pct || 0),
      active_buff_pct: constructionTimePlan(0).activeBuffPct,
      total_speed_pct: constructionTimePlan(0).totalSpeedPct,
      use_general_speedups_for_construction: Boolean(state.construction?.use_general_speedups_for_construction),
      flat_time_reduction_minutes: Number(state.construction?.flat_time_reduction_minutes || 0),
      buffs: constructionBuffRows(),
      construction_speedups_minutes: Number(state.resources.construction_speedups_minutes || 0),
      general_speedups_minutes: Number(state.resources.general_speedups_minutes || 0),
    },
    current_systems: {
      confirmed_buildings: coverage.confirmedBuildings,
      missing_buildings: coverage.missingBuildings,
      chief_gear_slots: Object.keys(state.chief_gear || {}).length,
      charm_slots: Object.keys(state.charms || {}).length,
      confirmed_pets: coverage.confirmedPets,
      experts: Object.keys(state.experts || {}),
      hero_gear_sets: state.extracted_current?.hero_gear || {},
      hero_gear_targets: state.hero_gear_targets || {},
    },
    data_quality: {
      hard_gaps: coverage.hardGaps,
      open_items: state.extracted_current?.open_items || [],
    },
    deterministic_rules: [
      "Use affordability, costs, and resource gaps exactly as provided by the dashboard.",
      "Do not infer current levels for missing buildings or hidden research nodes.",
      "Treat choice/random chests as unavailable unless the editable inventory already includes them.",
      "Use the LLM only to explain, prioritize, and flag tradeoffs; do not invent game data.",
    ],
    candidates: candidates.slice(0, 40).map((candidate) => ({
      module: candidate.module,
      item: candidate.item,
      from: candidate.from,
      to: candidate.to,
      cost: candidate.cost,
      gap: candidate.gap,
      affordable: candidate.affordable,
      projected_gain: candidate.benefit,
      confidence: candidate.confidence,
      score: candidate.score,
    })),
  };
}

function renderPlanner() {
  const candidates = plannerCandidates();
  const coverage = plannerCoverage();
  const affordable = candidates.filter((candidate) => candidate.affordable);
  lastPlannerPayload = plannerPayload(candidates, coverage);
  const directResources = ["meat", "wood", "coal", "iron", "fire_crystals", "refined_fire_crystals", "steel", "fire_crystal_shards"].map((key) => [
    RESOURCE_LABELS[key] || key,
    availableInventoryValue(key),
  ]);
  const resourceRows = directResources.map(([label, value]) => `<tr><td>${visualLabel(label, label)}</td><td class="number">${objectValue(value)}</td></tr>`);
  const missingBuildingLabels = coverage.missingBuildings.map((id) => gameData.buildings.find((building) => building.building_id === id)?.name || id);
  const missingBuildingNames = missingBuildingLabels.join(", ");
  const missingBuildingSummary =
    missingBuildingLabels.length > 4 ? `${missingBuildingLabels.slice(0, 4).join(", ")} +${missingBuildingLabels.length - 4} more` : missingBuildingNames;

  $("#tab-planner").innerHTML = `
    <div class="toolbar">
      <div>
        <h2>AI Upgrade Planner</h2>
        <p>Ranks exact next-step upgrades from workbook costs and your editable inventory. It is conservative by design.</p>
      </div>
    </div>
    <div class="summary-grid">
      <div class="metric blue"><span>Next-step candidates</span><strong>${fmt(candidates.length)}</strong></div>
      <div class="metric green"><span>Affordable now</span><strong>${fmt(affordable.length)}</strong></div>
      <div class="metric amber"><span>Buildings confirmed</span><strong>${coverage.confirmedBuildings.length}/${gameData.buildings.length}</strong></div>
      <div class="metric purple"><span>Planner mode</span><strong>Conservative</strong></div>
    </div>
    <div class="panel coverage-banner">
      <h2>Data Quality</h2>
      <div class="coverage-summary">
        <span class="status-pill">Buildings ${coverage.confirmedBuildings.length}/${gameData.buildings.length}</span>
        <span class="status-pill warn">Open gaps ${fmt(coverage.hardGaps.length)}</span>
      </div>
      <p>${coverage.missingBuildings.length ? `Planner excludes ${fmt(coverage.missingBuildings.length)} unconfirmed building rows: ${esc(missingBuildingSummary)}.` : "All workbook building current levels are confirmed or manually overridden."}</p>
      <details class="table-disclosure coverage-disclosure">
        <summary>Data gap details</summary>
        <ul class="gap-list">
          ${coverage.missingBuildings.length ? `<li><span class="status-pill warn">Buildings</span> ${esc(missingBuildingNames)}</li>` : ""}
          ${coverage.hardGaps.map((gap) => `<li><span class="status-pill warn">Gap</span> ${esc(gap)}</li>`).join("")}
        </ul>
      </details>
    </div>
    <div class="panel">
      <h2>Recommended Next Steps</h2>
      <div class="table-wrap planner-recommendations">
        <table>
          <thead><tr><th>Module</th><th>Upgrade</th><th>Cost</th><th>Status</th><th>Projected Gain</th></tr></thead>
          <tbody>${plannerTableRows(candidates)}</tbody>
        </table>
      </div>
    </div>
    <div class="panel">
      <div class="planner-action-row">
        <h2>LLM Advisor</h2>
        <div class="advisor-actions">
          <button type="button" id="copyAdvisorPayload">Copy Payload</button>
          <button type="button" class="primary" id="runAdvisor">Run Advisor</button>
          <span id="advisorStatus">Local payload ready</span>
        </div>
      </div>
      <pre class="llm-brief advisor-output" id="advisorOutput">Run Advisor for a written recommendation, or copy the structured payload for your preferred LLM.</pre>
    </div>
    <div class="grid-2">
      <div class="panel">
        <h2>Inventory Used</h2>
        ${miniTable(["Resource", "Available"], resourceRows)}
      </div>
      <div class="panel">
        <h2>Advisor Brief</h2>
        <pre class="llm-brief">${esc(plannerBrief(candidates, coverage))}</pre>
      </div>
    </div>
  `;
}

function miniTable(headers, rows) {
  if (!rows.length) return `<div class="empty-state">No extracted rows saved yet.</div>`;
  return `<div class="table-wrap compact-table"><table>
    <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
    <tbody>${rows.join("")}</tbody>
  </table></div>`;
}

function objectValue(value) {
  if (value == null || value === "") return "-";
  if (typeof value === "number") return fmt(value);
  if (Array.isArray(value)) return value.map((item) => esc(item)).join(", ");
  if (typeof value === "object") return esc(JSON.stringify(value));
  return esc(value);
}

function renderCurrentExtract() {
  const data = state.extracted_current;
  if (!data) {
    $("#tab-current-extract").innerHTML = `
      <div class="empty-state">
        <h2>No Current Extract Loaded</h2>
        <p>Save BlueStacks extraction data to data/current-player-state.json and reload the local dashboard server.</p>
      </div>
    `;
    return;
  }

  const heroes = Object.values(data.heroes || {}).filter((hero) => hero && typeof hero === "object" && hero.name);
  const pets = Object.values(data.pets || {}).filter((pet) => pet && typeof pet === "object" && (pet.level != null || pet.current_level != null));
  const experts = Object.values(data.experts || {}).filter((expert) => expert && typeof expert === "object" && expert.level != null);
  const buildings = Object.values(data.buildings || {}).filter((building) => building && typeof building === "object" && building.name);
  const warAcademy = data.research?.war_academy || {};
  const resourceDisplays = data.resources?.resource_displays || {};
  const troops = data.troops || {};
  const skins = data.skins || {};

  const profileRows = [
    ["Chief", data.profile?.chief_name],
    ["Chief ID", data.profile?.chief_id],
    ["State", data.profile?.state_number],
    ["VIP", data.profile?.vip_level],
    ["Power", data.profile?.power],
    ["Alliance", data.profile?.alliance],
    ["Diamonds", data.resources?.diamonds],
  ].map(([label, value]) => `<tr><td><strong>${esc(label)}</strong></td><td>${objectValue(value)}</td></tr>`);

  const backpackDirectResources = data.resources?.backpack_direct_resource_value || {};
  const resourceRows = [
    ...Object.entries(resourceDisplays).map(
      ([key, value]) => `<tr><td>${visualLabel(key, RESOURCE_LABELS[key] || key.replaceAll("_", " "))}</td><td>${esc(value)}</td></tr>`,
    ),
    ...Object.entries(backpackDirectResources)
      .filter(([key]) => key !== "notes")
      .map(
        ([key, value]) =>
          `<tr><td>${visualLabel(key, `Backpack direct ${RESOURCE_LABELS[key] || key.replaceAll("_", " ")}`)}</td><td>${objectValue(value)}</td></tr>`,
      ),
  ];

  const backpackRows = (data.resources?.backpack_items?.resources || []).map(
    (item) => `<tr>
      <td>${visualLabel("backpack resource", item.name || "-")}</td>
      <td class="number">${objectValue(item.count)}</td>
      <td>${objectValue(item.effect)}</td>
    </tr>`,
  );

  const backpackSpeedupRows = Object.entries(data.resources?.speedups || {}).flatMap(([category, stacks]) =>
    Object.entries(stacks || {}).map(
      ([duration, count]) => `<tr>
        <td>${visualLabel("speedup", category)}</td>
        <td>${esc(duration)}</td>
        <td class="number">${objectValue(count)}</td>
      </tr>`,
    ),
  );

  const backpackBonusRows = (data.resources?.backpack_items?.bonus || []).map(
    (item) => `<tr>
      <td>${visualLabel("bonus", item.name || "-", item.extraction_note || "")}</td>
      <td class="number">${objectValue(item.count)}</td>
      <td>${objectValue(item.effect)}</td>
    </tr>`,
  );

  const backpackOtherRows = (data.resources?.backpack_items?.other || []).map(
    (item) => `<tr>
      <td>${visualLabel("backpack other", item.name || "-", item.extraction_note || "")}</td>
      <td class="number">${objectValue(item.count)}</td>
      <td>${objectValue(item.effect)}</td>
    </tr>`,
  );

  const gearRows = Object.entries(data.chief_gear || {}).map(
    ([slot, gear]) => `<tr>
      <td>${visualLabel("gear", slot, gear.item_name || "")}</td>
      <td>${esc(gear.item_name || "-")}</td>
      <td>${esc(gear.current || "-")}</td>
      <td class="number">${objectValue(gear.power)}</td>
    </tr>`,
  );

  const charmRows = Object.entries(data.charms || {}).map(
    ([slot, charm]) => `<tr><td>${visualLabel("charm", slot.replaceAll("_", " "))}</td><td class="number">${objectValue(charm.current)}</td></tr>`,
  );

  const heroRows = heroes.map(
    (hero) => `<tr>
      <td>${visualLabel("hero", hero.name, `${hero.rarity || ""}${hero.generation ? ` | Gen ${hero.generation}` : ""}`)}</td>
      <td class="number">${objectValue(hero.current_level)}</td>
      <td>${objectValue(hero.stars ?? hero.stars_observed ?? (hero.owned === false ? "Unowned" : ""))}</td>
      <td class="number">${objectValue(hero.power ?? hero.power_preview)}</td>
    </tr>`,
  );

  const petRows = pets.map(
    (pet) => `<tr>
      <td>${visualLabel("pet", pet.name, pet.rarity || "")}</td>
      <td class="number">${objectValue(pet.level ?? pet.current_level)}</td>
      <td class="number">${objectValue(pet.power)}</td>
      <td>${objectValue(pet.troops_attack_percent != null ? `+${pet.troops_attack_percent}% / +${pet.troops_defense_percent}%` : "")}</td>
    </tr>`,
  );

  const expertRows = experts.map(
    (expert) => `<tr>
      <td>${visualLabel("expert", expert.name, expert.relationship || "")}</td>
      <td class="number">${objectValue(expert.level)}</td>
      <td class="number">${objectValue(expert.power)}</td>
      <td>${objectValue(expert.affinity_status || `${expert.affinity_current ?? "-"} / ${expert.affinity_required ?? "-"}`)}</td>
    </tr>`,
  );

  const researchRows = [
    ["Normal active", data.research?.active_research?.name, data.research?.active_research?.remaining_time_observed],
    ["War Academy", data.buildings?.war_academy?.current, data.buildings?.war_academy?.research_speed_bonus],
    ["Fire Crystal Tech", warAcademy.fire_crystal_tech_power, `${warAcademy.fire_crystal_shards ?? "-"} shards`],
    ["War active", warAcademy.active_research?.name, warAcademy.active_research?.remaining_time_observed],
    ["Expert learning", data.experts?.active_learning?.expert, data.experts?.active_learning?.remaining_time_observed],
  ].map(([system, current, detail]) => `<tr><td>${visualLabel("research", system)}</td><td>${objectValue(current)}</td><td>${objectValue(detail)}</td></tr>`);

  const troopRows = [
    ["Total troops", troops.summary?.total_display, `March queue ${troops.summary?.march_queue || "-"} | Injured ${troops.summary?.injured_display || "-"}`],
    ["Helios Infantry", troops.helios_infantry?.count, troops.helios_infantry?.type],
    ["Helios Lancer", troops.helios_lancer?.count, troops.helios_lancer?.type],
    ["Helios Marksman", troops.helios_marksman?.count, troops.helios_marksman?.type],
  ].map(([scope, current, detail]) => `<tr><td>${visualLabel("troop", scope)}</td><td>${objectValue(current)}</td><td>${objectValue(detail)}</td></tr>`);

  const skinRows = [
    ["Current City Skin", skins.current_city_skin?.name, skins.current_city_skin?.acquisition_bonus, "city skin"],
    ...(skins.visible_city_bonus_items || []).map((item) => [item.name, item.duration, item.bonus, "city skin"]),
    ...Object.entries(skins.aggregate_bonus || {}).map(([key, value]) => [key.replaceAll("_", " "), `+${value}%`, "Aggregate skin bonus", "skin bonus"]),
  ].map(([scope, current, detail, iconScope]) => `<tr><td>${visualLabel(iconScope || "skin", scope)}</td><td>${objectValue(current)}</td><td>${objectValue(detail)}</td></tr>`);

  const nodeDetailFields = [
    "effect",
    "helios_infantry_healing_cost_reduction",
    "helios_infantry_training_cost_reduction",
    "helios_infantry_healing_time_reduction",
    "helios_lancer_healing_cost_reduction",
    "helios_lancer_training_cost_reduction",
    "helios_lancer_healing_time_reduction",
    "helios_marksman_healing_cost_reduction",
    "helios_marksman_training_cost_reduction",
    "helios_marksman_healing_time_reduction",
    "infantry_attack",
    "infantry_defense",
    "lancer_attack",
    "lancer_defense",
    "marksman_attack",
    "marksman_defense",
    "troops_deployment_capacity",
  ];
  const warNodeRows = Object.entries(warAcademy.visible_nodes || {}).map(([key, node]) => {
    const detail = nodeDetailFields
      .filter((field) => node[field])
      .map((field) => `${field.replaceAll("_", " ")}: ${node[field]}`)
      .join(" | ");
    const cost = node.research_cost ? Object.entries(node.research_cost).map(([resource, value]) => `${resource.replaceAll("_", " ")} ${value}`).join(" | ") : "";
    const time = [node.current_time, node.original_time ? `base ${node.original_time}` : "", node.finish_cost_diamonds ? `${fmt(node.finish_cost_diamonds)} diamonds` : ""]
      .filter(Boolean)
      .join(" | ");
    return `<tr>
      <td>${visualLabel("research", (node.name || key).replaceAll("_", " "))}</td>
      <td>${objectValue(node.level_progress ?? node.level ?? node.status)}</td>
      <td>${objectValue(detail || node.status)}</td>
      <td>${objectValue(cost)}</td>
      <td>${objectValue(time || node.power)}</td>
    </tr>`;
  });

  const openRows = (data.open_items || []).map((item) => `<tr><td>${objectValue(item)}</td></tr>`);

  const gallery = data.collection_gallery || {};
  const galleryRows = [
    ["Rank", gallery.rank, gallery.level ? `Lv. ${gallery.level} | ${objectValue(gallery.progress_current)} / ${objectValue(gallery.progress_required)}` : ""],
    ...Object.entries(gallery.categories || {}).map(([category, count]) => [category.replaceAll("_", " "), count, "items"]),
    ...(gallery.marching?.opened_items || []).map((item) => [item.name, item.owned ? "Owned" : "Not owned", item.stat_bonus]),
  ].map(([scope, current, detail]) => `<tr><td>${visualLabel("skin gallery", scope)}</td><td>${objectValue(current)}</td><td>${objectValue(detail)}</td></tr>`);

  const buildingRows = buildings.map((building) => {
    const detail = [
      building.status,
      building.furnace_status ? `Status ${building.furnace_status}` : "",
      building.furnace_consumption ? `Cost ${building.furnace_consumption}` : "",
      building.research_speed_bonus ? `Research ${building.research_speed_bonus}` : "",
      building.infirmary_capacity ? `Capacity ${building.infirmary_capacity}` : "",
      building.capacity ? `Capacity ${building.capacity}` : "",
      building.stove ? `Stove ${building.stove}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
    return `<tr>
      <td>${visualLabel("building", building.name)}</td>
      <td>${objectValue(building.current)}</td>
      <td>${objectValue(detail)}</td>
      <td class="number">${objectValue(building.power)}</td>
    </tr>`;
  });

  const bonusOverview = data.bonus_overview || {};
  const bonusOverviewSections = [
    ["Power", bonusOverview.power],
    ["Battle Results", bonusOverview.battle_results],
    ["Military", bonusOverview.military],
    ["City Defenses", bonusOverview.city_defenses],
    ["Resources", bonusOverview.resources],
    ["Growth", bonusOverview.growth],
  ].filter(([, section]) => section && Object.keys(section).length);
  const bonusOverviewHtml = bonusOverviewSections.length
    ? `<div class="panel">
        <h2>Bonus Overview (Chief Profile)</h2>
        <div class="bonus-overview-grid">
          ${bonusOverviewSections
            .map(([title, section]) => `<section class="gd-section">
              ${gameSectionBannerHtml(title)}
              <div class="gd-bonus-list">
                ${Object.entries(section)
                  .map(([key, value]) => ({
                    label: titleFromId(key.replace(/_percent$/, "").replaceAll("_", " ")),
                    value: /percent$/.test(key) ? `${fmt(Number(value), 2)}%` : fmt(Number(value)),
                  }))
                  .map((row) => `<div class="gd-bonus-row"><span class="gd-bonus-label">${esc(row.label)}</span><span class="gd-bonus-values"><strong>${esc(row.value)}</strong></span></div>`)
                  .join("")}
              </div>
            </section>`)
            .join("")}
        </div>
      </div>`
    : "";

  $("#tab-current-extract").innerHTML = `
    <div class="toolbar"><div><h2>Current Extract</h2><p>Loaded from data/current-player-state.json and applied to the calculator fields.</p></div></div>
    <div class="summary-grid">
      <div class="metric blue"><span>Current power</span><strong>${objectValue(data.profile?.power)}</strong></div>
      <div class="metric amber"><span>Heroes read</span><strong>${fmt(heroes.length)}</strong></div>
      <div class="metric green"><span>Pets read</span><strong>${fmt(pets.length)}</strong></div>
      <div class="metric purple"><span>Experts read</span><strong>${fmt(experts.length)}</strong></div>
      <div class="metric blue"><span>Buildings read</span><strong>${fmt(buildings.length)}</strong></div>
    </div>
    <div class="extract-stack">
      ${bonusOverviewHtml}
      <div class="grid-2">
        <div class="panel">
          <h2>Profile</h2>
          ${miniTable(["Field", "Value"], profileRows)}
        </div>
        <div class="panel">
          <h2>Resources</h2>
          ${miniTable(["Resource", "Observed"], resourceRows)}
        </div>
      </div>
      <div class="panel">
        <h2>Backpack Resources</h2>
        ${miniTable(["Item", "Count", "Effect"], backpackRows)}
      </div>
      <div class="grid-2">
        <div class="panel">
          <h2>Backpack Speedups</h2>
          ${miniTable(["Type", "Duration", "Count"], backpackSpeedupRows)}
        </div>
        <div class="panel">
          <h2>Backpack Bonus</h2>
          ${miniTable(["Item", "Count", "Effect"], backpackBonusRows)}
        </div>
      </div>
      <div class="panel">
        <h2>Backpack Other</h2>
        ${miniTable(["Item", "Count", "Effect"], backpackOtherRows)}
      </div>
      <div class="panel">
        <h2>Research</h2>
        ${miniTable(["System", "Current", "Detail"], researchRows)}
      </div>
      <div class="grid-2">
        <div class="panel">
          <h2>Troops</h2>
          ${miniTable(["Scope", "Current", "Detail"], troopRows)}
        </div>
        <div class="panel">
          <h2>Skin Bonuses</h2>
          ${miniTable(["Scope", "Current", "Detail"], skinRows)}
        </div>
      </div>
      <div class="panel">
        <h2>War Academy Nodes</h2>
        ${miniTable(["Node", "Level", "Effect", "Cost", "Time / Power"], warNodeRows)}
      </div>
      <div class="panel">
        <h2>Collection Gallery</h2>
        ${miniTable(["Scope", "Current", "Detail"], galleryRows)}
      </div>
      <div class="panel">
        <h2>Buildings</h2>
        ${miniTable(["Building", "Current", "Detail", "Power"], buildingRows)}
      </div>
      <div class="grid-2">
        <div class="panel">
          <h2>Chief Gear</h2>
          ${miniTable(["Slot", "Item", "Level", "Power"], gearRows)}
        </div>
        <div class="panel">
          <h2>Chief Charms</h2>
          ${miniTable(["Slot", "Level"], charmRows)}
        </div>
      </div>
      <div class="panel">
        <h2>Heroes</h2>
        ${miniTable(["Hero", "Level", "Stars", "Power"], heroRows)}
      </div>
      <div class="panel">
        <h2>Pets</h2>
        ${miniTable(["Pet", "Level", "Power", "Attack/Defense"], petRows)}
      </div>
      <div class="panel">
        <h2>Experts</h2>
        ${miniTable(["Expert", "Level", "Power", "Affinity"], expertRows)}
      </div>
      <div class="panel">
        <h2>Open Items</h2>
        ${miniTable(["Item"], openRows)}
      </div>
    </div>
  `;
}

function getNextLevelCode(levels, currentCode) {
  const currentIndex = levels.findIndex(l => String(l.level_code) === String(currentCode));
  if (currentIndex !== -1 && currentIndex < levels.length - 1) {
    return levels[currentIndex + 1].level_code;
  }
  return null;
}

function isBuildingLevelMet(levelsByBuilding, buildingId, currentCode, requiredCode) {
  const levels = levelsByBuilding[buildingId] || [];
  const currentLvl = levels.find(l => String(l.level_code) === String(currentCode));
  const requiredLvl = levels.find(l => String(l.level_code) === String(requiredCode));
  if (!requiredLvl) return true;
  if (!currentLvl) return false;
  return Number(currentLvl.numerical_level) >= Number(requiredLvl.numerical_level);
}

function renderBuildings() {
  const levelsByBuilding = groupBy(gameData.building_levels, "building_id");
  let totalCost = makeCost(BUILDING_FIELDS);
  let totalBaseSeconds = 0;
  let selectedUpgradeCount = 0;
  const selectedUpgrades = [];
  
  // Calculate global totals
  gameData.buildings.forEach((building) => {
    const levels = sortByNumber(levelsByBuilding[building.building_id] || [], "numerical_level");
    const saved = state.buildings[building.building_id] || { current: levels[0]?.level_code, target: levels.at(-1)?.level_code };
    const cost = applyConstructionDiscount(rangeCost(levels, saved.current, saved.target, {
      idKey: "level_code",
      orderKey: "numerical_level",
      fields: BUILDING_FIELDS,
    }));
    totalCost = addCost(totalCost, cost);
    if (!costIsEmpty(cost)) {
      selectedUpgradeCount += 1;
      selectedUpgrades.push({
        kind: "building",
        scope: "building",
        label: building.name,
        meta: `${levels.length} levels`,
        from: saved.current,
        to: saved.target,
      });
    }
    const baseSeconds = rangeSeconds(levels, saved.current, saved.target);
    totalBaseSeconds += Number(baseSeconds || 0);
  });

  const totalTimePlan = constructionTimePlan(totalBaseSeconds);
  const buffRows = totalTimePlan.buffRows
    .map(
      (buff) => `<tr>
        <td>${visualLabel("buff", buff.label)}</td>
        <td>${checkboxInput(`construction.buffs.${buff.id}.enabled`, buff.enabled)}</td>
        <td>${numberInput(`construction.buffs.${buff.id}.pct`, buff.pct, 0, 0.1)}</td>
      </tr>`,
    )
    .join("");

  const buildingBulk = bulkTargetControls(
    "Quick target",
    "bulkBuildingTarget",
    [
      ["FC10", "FC10"],
      ["FC9", "FC9"],
      ["FC8", "FC8"],
      ["FC7", "FC7"],
      ["FC6", "FC6"],
      ["FC5", "FC5"],
      ["FC4", "FC4"],
      ["FC3", "FC3"],
      ["FC2", "FC2"],
      ["FC1", "FC1"],
      ["30", "Level 30"],
      ["max", "Max available"],
    ],
    [
      { action: "buildings-fc", label: "Apply FC" },
      { action: "buildings-all", label: "Apply all" },
    ],
  );

  // Selected Building details
  const selectedBuildingId = state.selected_building_id || "furnace";
  const selectedBuilding = gameData.buildings.find(b => b.building_id === selectedBuildingId) || gameData.buildings[0];
  const selectedBuildingLevels = sortByNumber(levelsByBuilding[selectedBuilding.building_id] || [], "numerical_level");
  const selectedSaved = state.buildings[selectedBuilding.building_id] || { 
    current: selectedBuildingLevels[0]?.level_code, 
    target: selectedBuildingLevels.at(-1)?.level_code 
  };
  
  const selectedCost = applyConstructionDiscount(rangeCost(selectedBuildingLevels, selectedSaved.current, selectedSaved.target, {
    idKey: "level_code",
    orderKey: "numerical_level",
    fields: BUILDING_FIELDS,
  }));
  
  const selectedBaseSeconds = rangeSeconds(selectedBuildingLevels, selectedSaved.current, selectedSaved.target);
  const selectedTimePlan = constructionTimePlan(selectedBaseSeconds);

  // Render Sidebar
  const sidebarHtml = gameData.buildings.map((b) => {
    const levels = sortByNumber(levelsByBuilding[b.building_id] || [], "numerical_level");
    const saved = state.buildings[b.building_id] || { current: levels[0]?.level_code, target: levels.at(-1)?.level_code };
    const isActive = b.building_id === selectedBuildingId;
    const upgradeSelected = String(saved.current) !== String(saved.target);
    return `<div class="building-list-item ${isActive ? 'active' : ''}" data-select-building-id="${b.building_id}">
      ${iconHtml("building", b.name, "md", b.building_id)}
      <strong>${esc(b.name)}</strong>
      <span class="level-badge">${esc(saved.current)}${upgradeSelected ? `<i class="level-badge__up" aria-hidden="true"></i>` : ""}</span>
    </div>`;
  }).join("");

  // Prerequisites calculations
  const nextLevel = getNextLevelCode(selectedBuildingLevels, selectedSaved.current);
  const prereqs = nextLevel ? (gameData.building_prerequisites || []).filter(
    p => p.building_id === selectedBuilding.building_id && String(p.level_code) === String(nextLevel)
  ) : [];
  
  let allPrereqsMet = true;
  const prereqsListHtml = prereqs.length ? prereqs.map(p => {
    const prereqCurrent = state.buildings[p.prereq_building_id]?.current || "1";
    const isMet = isBuildingLevelMet(levelsByBuilding, p.prereq_building_id, prereqCurrent, p.prereq_level_code);
    if (!isMet) allPrereqsMet = false;
    return gamePrereqRowHtml(
      `${p.prereq_building_name} Lv. ${p.prereq_level_code}`,
      isMet,
      isMet ? "" : `Currently Lv. ${prereqCurrent} — upgrade cost not included below`,
    );
  }).join("") : "";

  const coverage = gameCostCoverage(selectedCost, BUILDING_FIELDS);
  const hasCost = coverage.hasCost;
  const canUpgrade = allPrereqsMet && coverage.covered && hasCost;

  // Extracted building specs -> "Upgrade Bonus" rows like the in-game dialog
  const ext = state.extracted_current?.buildings?.[selectedBuilding.building_id];
  const bonusRows = [];
  if (ext) {
    if (ext.power != null) {
      let targetPower = null;
      if (ext.details_table) {
        const targetClean = simpleLevelCode(selectedSaved.target);
        const match = ext.details_table.find(row => String(row.level).toLowerCase() === String(targetClean).toLowerCase());
        if (match && match.power) targetPower = Number(match.power);
      }
      bonusRows.push({
        label: "Power",
        current: fmt(ext.power),
        target: targetPower != null ? fmt(targetPower) : null,
        delta: targetPower != null ? signedFmt(targetPower - ext.power) : "",
      });
    }
    if (ext.research_speed_bonus) bonusRows.push({ label: "Research Speed", current: String(ext.research_speed_bonus) });
    if (ext.infirmary_capacity) bonusRows.push({ label: "Infirmary Capacity", current: String(ext.infirmary_capacity) });
    if (ext.capacity) bonusRows.push({ label: "Enlistment Capacity", current: String(ext.capacity) });
    if (ext.production) bonusRows.push({ label: "Production Rate", current: `${ext.production.amount} ${ext.production.resource} / ${ext.production.time}` });
    if (ext.furnace_consumption) bonusRows.push({ label: "Furnace Consumption", current: String(ext.furnace_consumption) });
    if (ext.energy_gauge_observed != null) bonusRows.push({ label: "Energy Gauge", current: String(ext.energy_gauge_observed) });
  }

  const queue = state.extracted_current?.buildings?.building_queue;
  const queueHtml = queue
    ? `<div class="city-queue-strip">
        <span class="city-queue-strip__title">City Queues</span>
        <span><strong>Worker 1:</strong> ${esc(queue.queue_1)}</span>
        <span><strong>Worker 2:</strong> ${esc(queue.queue_2)}</span>
        ${state.extracted_current.buildings.training ? `<span><strong>Training:</strong> ${esc(state.extracted_current.buildings.training)}</span>` : ""}
       </div>`
    : "";

  // Build the game-replica upgrade dialog
  const upgradePanelHtml = gameDialogHtml({
    title: selectedBuilding.name,
    className: "building-upgrade-dialog",
    body: `
      <div class="gd-hero-row">
        ${iconHtml("building", selectedBuilding.name, "xl", selectedBuilding.building_id)}
        ${gameLevelFlowHtml(selectedSaved.current, selectedSaved.target)}
      </div>
      <div class="gd-select-row">
        <label class="compact-field">
          <span>Current level</span>
          <select data-path="buildings.${selectedBuilding.building_id}.current">
            ${optionList(selectedBuildingLevels, "level_code", "level_code", selectedSaved.current)}
          </select>
        </label>
        <label class="compact-field">
          <span>Target level</span>
          <select data-path="buildings.${selectedBuilding.building_id}.target">
            ${optionList(selectedBuildingLevels, "level_code", "level_code", selectedSaved.target)}
          </select>
        </label>
      </div>
      ${gameBonusRowsHtml(bonusRows)}
      ${gameRequiresHtml(selectedCost, BUILDING_FIELDS, {
        prereqHtml: prereqsListHtml,
        emptyText: "Building already at target level.",
        note: [
          constructionCostReductionPct() ? `Costs include your ${fmt(constructionCostReductionPct(), 1)}% construction cost reduction (matches in-game display).` : "",
          prereqs.length ? `Prerequisites shown for next level ${nextLevel || "max"}. Their own upgrade costs are not added to this total.` : "",
        ].filter(Boolean).join(" "),
      })}
      <div class="gd-time-row"><span>Original:</span><strong>${timeFmt(selectedTimePlan.baseSeconds)}</strong><span>With buffs:</span><strong class="gd-gain">${timeFmt(selectedTimePlan.adjustedSeconds)}</strong></div>
      <div class="gd-btn-row">
        ${gameButtonHtml(
          !hasCost ? "Target Met" : canUpgrade ? "Upgrade" : "Requirements Not Met",
          !hasCost ? "" : canUpgrade ? "All requirements covered" : `${coverage.shortCount ? `${coverage.shortCount} material${coverage.shortCount === 1 ? "" : "s"} short` : "Prerequisites missing"}`,
          canUpgrade ? "blue" : "grey",
          canUpgrade,
        )}
      </div>
    `,
  });

  $("#tab-buildings").innerHTML = `
    <div class="toolbar"><div><h2>Buildings</h2><p>Upgrade dashboard and resource requirements planner.</p></div>${buildingBulk}</div>
    ${queueHtml}
    ${upgradeNutshellHtml({
      module: "Buildings",
      selected: upgradeSelectionText(selectedUpgradeCount, "building target", "building targets"),
      upgrades: selectedUpgrades,
      details: [
        `Base time ${timeFmt(totalTimePlan.baseSeconds)}`,
        `Buffed ${timeFmt(totalTimePlan.adjustedSeconds)}`,
        `Uncovered ${timeFmt(totalTimePlan.uncoveredSeconds)}`,
      ],
      cost: totalCost,
      fields: BUILDING_FIELDS,
      empty: "Set one or more building targets above current level to see resource gaps.",
    })}
    
    <div class="buildings-view-layout">
      <div class="buildings-sidebar">
        ${sidebarHtml}
      </div>
      <div class="building-upgrade-view">
        ${upgradePanelHtml}
      </div>
    </div>

    <div class="summary-grid">
      <div class="metric blue"><span>Base build time</span><strong>${timeFmt(totalTimePlan.baseSeconds)}</strong></div>
      <div class="metric green"><span>With selected buffs</span><strong>${timeFmt(totalTimePlan.adjustedSeconds)}</strong></div>
      <div class="metric amber"><span>Total construction speed</span><strong>${fmt(totalTimePlan.totalSpeedPct, 2)}%</strong></div>
      <div class="metric purple"><span>Uncovered after speedups</span><strong>${timeFmt(totalTimePlan.uncoveredSeconds)}</strong></div>
    </div>
    <div class="grid-2">
      <div class="panel">
        <h2>Construction Buffs</h2>
        <div class="table-wrap compact-table"><table>
          <thead><tr><th>Buff</th><th>Use</th><th>Speed %</th></tr></thead>
          <tbody>
            <tr>
              <td>${visualLabel("construction", "Base construction speed", "Profile / research / permanent bonuses")}</td>
              <td><span class="status-pill">Always</span></td>
              <td>${numberInput("profile.construction_speed_pct", state.profile.construction_speed_pct, 0, 0.1)}</td>
            </tr>
            <tr>
              <td>${visualLabel("construction", "Construction cost reduction %", "City skills (e.g. Zinman) cut Meat/Wood/Coal/Iron costs; FC and RFC are never discounted")}</td>
              <td><span class="status-pill">Resources</span></td>
              <td>${numberInput("construction.cost_reduction_pct", constructionCostReductionPct(), 0, 0.5)}</td>
            </tr>
            ${buffRows}
            <tr>
              <td>${visualLabel("speedup", "Flat time reduction", "Alliance help or manual reduction minutes")}</td>
              <td><span class="status-pill">After speed %</span></td>
              <td>${numberInput("construction.flat_time_reduction_minutes", state.construction?.flat_time_reduction_minutes || 0)}</td>
            </tr>
          </tbody>
        </table></div>
      </div>
      <div class="panel">
        <h2>Speedup Coverage</h2>
        <div class="table-wrap compact-table"><table>
          <thead><tr><th>Source</th><th class="number">Time</th></tr></thead>
          <tbody>
            <tr><td>${visualLabel("speedup", "Construction speedups")}</td><td class="number">${timeFmt(totalTimePlan.constructionSpeedups)}</td></tr>
            <tr><td>${visualLabel("speedup", "Use general speedups for construction")}</td><td class="number">${checkboxInput("construction.use_general_speedups_for_construction", Boolean(state.construction?.use_general_speedups_for_construction))} ${timeFmt(totalTimePlan.generalSpeedups)}</td></tr>
            <tr><td>${visualLabel("speedup", "Usable speedups")}</td><td class="number">${timeFmt(totalTimePlan.usableSpeedups)}</td></tr>
            <tr><td>${visualLabel("building", "Remaining after selected buffs and speedups")}</td><td class="number">${timeFmt(totalTimePlan.uncoveredSeconds)}</td></tr>
          </tbody>
        </table></div>
      </div>
    </div>
  `;
}

function rangeSeconds(levels, current, target) {
  const cost = rangeCost(levels, current, target, {
    idKey: "level_code",
    orderKey: "numerical_level",
    fields: ["build_seconds"],
  });
  return cost.build_seconds;
}

function constructionBuffRows() {
  const buffs = state.construction?.buffs || {};
  return CONSTRUCTION_BUFF_DEFS.map(([id, label]) => ({
    id,
    label,
    enabled: Boolean(buffs[id]?.enabled),
    pct: Number(buffs[id]?.pct || 0),
  }));
}

function constructionTimePlan(baseSeconds) {
  const baseSpeedPct = Number(state.profile?.construction_speed_pct || 0);
  const buffRows = constructionBuffRows();
  const activeBuffPct = buffRows.reduce((sum, buff) => sum + (buff.enabled ? Number(buff.pct || 0) : 0), 0);
  const totalSpeedPct = Math.max(-99, baseSpeedPct + activeBuffPct);
  const afterSpeed = Math.ceil(Number(baseSeconds || 0) / (1 + totalSpeedPct / 100));
  const flatReductionSeconds = Math.max(0, Number(state.construction?.flat_time_reduction_minutes || 0) * 60);
  const adjustedSeconds = Math.max(0, afterSpeed - flatReductionSeconds);
  const constructionSpeedups = Math.max(0, Number(state.resources.construction_speedups_minutes || 0) * 60);
  const generalSpeedups = state.construction?.use_general_speedups_for_construction ? Math.max(0, Number(state.resources.general_speedups_minutes || 0) * 60) : 0;
  const usableSpeedups = constructionSpeedups + generalSpeedups;
  return {
    baseSeconds: Number(baseSeconds || 0),
    baseSpeedPct,
    activeBuffPct,
    totalSpeedPct,
    flatReductionSeconds,
    adjustedSeconds,
    constructionSpeedups,
    generalSpeedups,
    usableSpeedups,
    uncoveredSeconds: Math.max(0, adjustedSeconds - usableSpeedups),
    buffRows,
  };
}

const HERO_GEAR_SLOT_LABELS = {
  goggles: "Goggles",
  gauntlets: "Gauntlets",
  belt: "Belt",
  boots: "Boots",
  top_left: "Top Left",
  top_right: "Top Right",
  bottom_left: "Bottom Left",
  bottom_right: "Bottom Right",
};

const HERO_GEAR_SLOT_POSITIONS = {
  goggles: "top-left",
  top_left: "top-left",
  gauntlets: "top-right",
  top_right: "top-right",
  belt: "bottom-left",
  bottom_left: "bottom-left",
  boots: "bottom-right",
  bottom_right: "bottom-right",
};

const HERO_GEAR_POSITION_LABELS = {
  "top-left": "Top left",
  "top-right": "Top right",
  "bottom-left": "Bottom left",
  "bottom-right": "Bottom right",
};

const HERO_GEAR_POSITION_ORDER = ["top-left", "top-right", "bottom-left", "bottom-right"];
const HERO_GEAR_TROOP_ORDER = ["infantry", "lancer", "marksman"];
const HERO_GEAR_PRIMARY_LIMITS = {
  infantry: 2,
  lancer: 1,
  marksman: 2,
};

function normalizedTroopKey(value) {
  const key = normalizeKey(value);
  return key === "marksmen" ? "marksman" : key;
}

function titleFromId(id) {
  return String(id || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function heroRecordFor(heroId) {
  const normalizedId = heroId === "lumak_bokan" ? "walis_bokan" : heroId;
  const workbookHero = gameData.heroes.find((hero) => hero.hero_id === normalizedId);
  const extractedHero = state.extracted_current?.heroes?.[heroId] || state.extracted_current?.heroes?.[normalizedId];
  return {
    hero_id: normalizedId,
    name: workbookHero?.name || extractedHero?.name || titleFromId(heroId),
    troop_type: workbookHero?.troop_type || extractedHero?.troop_type || state.extracted_current?.hero_gear?.[heroId]?.troop_type || "-",
    rarity: workbookHero?.rarity || extractedHero?.rarity || "",
    generation: workbookHero?.generation || extractedHero?.generation || "",
  };
}

function heroGearPieces(gear = {}) {
  return Object.entries(gear || {}).filter(([slot, piece]) => slot !== "overview" && piece && typeof piece === "object");
}

function heroGearPiecesByPosition(gear = {}) {
  return heroGearPieces(gear).reduce((acc, [slot, piece]) => {
    const position = HERO_GEAR_SLOT_POSITIONS[slot] || slot.replaceAll("_", "-");
    acc[position] = { slot, piece };
    return acc;
  }, {});
}

function heroGearCanEmpowerAtLevel(level) {
  return Number(level || 0) >= HERO_GEAR_EMPOWERMENT_MIN_MASTERY_LEVEL;
}

function clampHeroGearEnhancement(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) return 0;
  return Math.min(HERO_GEAR_MAX_ENHANCEMENT, Math.max(0, number));
}

function heroGearCurrentEnhancement(piece = {}) {
  const raw = piece.enhancement ?? piece.enhancement_level ?? piece.current_enhancement ?? piece.visible_enhancement ?? piece.observed_enhancement;
  return clampHeroGearEnhancement(raw);
}

function heroGearCurrentEmpowerment(piece = {}) {
  const level = Number(piece.level || 0);
  if (level > 0 && !heroGearCanEmpowerAtLevel(level)) return 0;
  const raw = piece.empowerment ?? piece.empowerment_level ?? piece.current_empowerment ?? heroGearCurrentEnhancement(piece);
  const value = Number(raw || 0);
  if (!Number.isFinite(value)) return 0;
  return Math.min(HERO_GEAR_MAX_EMPOWERMENT, Math.max(0, value));
}

function heroGearObservedEnhancement(piece = {}) {
  return heroGearCurrentEnhancement(piece);
}

function heroGearLockedObservedEnhancement(piece = {}) {
  const level = Number(piece.level || 0);
  const observed = heroGearObservedEnhancement(piece);
  const current = heroGearCurrentEmpowerment(piece);
  return level > 0 && !heroGearCanEmpowerAtLevel(level) && observed > current ? observed : 0;
}

function heroGearTargetEmpowerment(piece = {}, rawTarget, targetLevel) {
  const value = Number(rawTarget ?? heroGearCurrentEnhancement(piece));
  const clamped = Number.isFinite(value) ? Math.min(HERO_GEAR_MAX_EMPOWERMENT, Math.max(0, value)) : 0;
  return heroGearCanEmpowerAtLevel(targetLevel) ? clamped : 0;
}

function heroGearTargetsFor(heroId) {
  const defaults = state.hero_gear_targets || {};
  const heroTargets = defaults.heroes?.[heroId] || {};
  return {
    gearLevel: Number(heroTargets.gear_level ?? defaults.default_gear_level ?? 16),
    gearEnhancement: Number(heroTargets.gear_enhancement ?? defaults.default_gear_enhancement ?? 100),
    specialEnhancement: Number(heroTargets.special_enhancement ?? defaults.default_special_enhancement ?? 10),
  };
}

function heroGearPieceTargetsFor(heroId, slot) {
  const defaults = state.hero_gear_targets || {};
  const heroTargets = defaults.heroes?.[heroId] || {};
  const pieceTargets = heroTargets.pieces?.[slot] || {};
  const piece = state.extracted_current?.hero_gear?.[heroId]?.gear?.[slot] || {};
  const maxMasteryLevel = Math.max(20, ...((gameData.hero_gear_mastery_levels || []).map((row) => Number(row.level || 0))));
  const currentLevel = Number(piece.level || 0);
  const currentEnhancement = heroGearCurrentEnhancement(piece);
  const targetLevel = Number(pieceTargets.target_level ?? pieceTargets.gear_level ?? heroTargets.gear_level ?? defaults.default_gear_level ?? currentLevel);
  const rawTargetEnhancement =
    pieceTargets.target_enhancement ?? pieceTargets.gear_enhancement ?? heroTargets.gear_enhancement ?? defaults.default_gear_enhancement ?? currentEnhancement;
  const clampedTargetLevel = Math.min(maxMasteryLevel, Math.max(0, targetLevel));
  return {
    targetLevel: clampedTargetLevel,
    targetEnhancement: clampHeroGearEnhancement(rawTargetEnhancement),
  };
}

function heroGearCanonicalSlot(slot) {
  const position = HERO_GEAR_SLOT_POSITIONS[slot] || slot;
  return {
    "top-left": "goggles",
    "top-right": "gloves",
    "bottom-left": "belt",
    "bottom-right": "boots",
  }[position] || normalizeKey(slot);
}

function heroGearMasteryRows(piece, slot, hero) {
  const rows = gameData.hero_gear_mastery_levels || [];
  const canonicalSlot = heroGearCanonicalSlot(slot);
  const troop = normalizeKey(hero?.troop_type || "");
  const setNumber = Number(piece?.set_number || piece?.gear_set_number);
  const exactRows =
    Number.isFinite(setNumber) && setNumber > 0
      ? rows.filter(
          (row) =>
            row.scope === "set_piece" &&
            normalizeKey(row.troop_type) === troop &&
            normalizeKey(row.slot) === canonicalSlot &&
            Number(row.set_number) === setNumber,
        )
      : [];
  const rowsByLevel = new Map(rows.filter((row) => row.scope === "base").map((row) => [Number(row.level), row]));
  exactRows.forEach((row) => rowsByLevel.set(Number(row.level), row));
  const sourceRows = sortByNumber([...rowsByLevel.values()], "level");
  return sourceRows.map((row) => ({ ...row, level_id: Number(row.level), order: Number(row.level) }));
}

function heroGearMasteryCostToTarget(piece, targetLevel, slot, hero) {
  const rows = heroGearMasteryRows(piece, slot, hero);
  return rangeCost(rows, Number(piece?.level || 0), Number(targetLevel || 0), {
    idKey: "level_id",
    orderKey: "order",
    fields: HERO_GEAR_FIELDS,
  });
}

function heroGearNormalEnhancementRows() {
  const rows = (gameData.hero_gear_enhancement_levels || []).filter((row) => row.scope === "base" && Number(row.level) <= HERO_GEAR_MAX_ENHANCEMENT);
  return sortByNumber(rows, "level").map((row) => {
    const level = Number(row.level || 0);
    return {
      ...row,
      hero_gear_xp: HERO_GEAR_NORMAL_ENHANCEMENT_XP_OVERRIDES[level] ?? row.hero_gear_xp,
      mythic_gear: 0,
      mithril: 0,
      level_id: level,
      order: level,
    };
  });
}

function heroGearEmpowermentRows(piece, slot, hero) {
  const rows = gameData.hero_gear_enhancement_levels || [];
  const canonicalSlot = heroGearCanonicalSlot(slot);
  const troop = normalizeKey(hero?.troop_type || "");
  const setNumber = Number(piece?.set_number || piece?.gear_set_number);
  const exactRows =
    Number.isFinite(setNumber) && setNumber > 0
      ? rows.filter(
          (row) =>
            row.scope === "set_piece" &&
            normalizeKey(row.troop_type) === troop &&
            normalizeKey(row.slot) === canonicalSlot &&
            Number(row.set_number) === setNumber &&
            Number(row.level) > HERO_GEAR_EMPOWERMENT_SOURCE_OFFSET,
        )
      : [];
  const baseRows = rows.filter((row) => row.scope === "base" && Number(row.level) > HERO_GEAR_EMPOWERMENT_SOURCE_OFFSET);
  const rowsByLevel = new Map(baseRows.map((row) => [Number(row.level), row]));
  exactRows.forEach((row) => rowsByLevel.set(Number(row.level), row));
  const sourceRows = sortByNumber([...rowsByLevel.values()], "level");
  return [
    { scope: "derived", level_id: 0, order: 0, hero_gear_xp: 0, mythic_gear: 0, mithril: 0 },
    ...sourceRows.map((row) => {
      const empowermentLevel = Number(row.level) - HERO_GEAR_EMPOWERMENT_SOURCE_OFFSET;
      return { ...row, empowerment_level: empowermentLevel, level_id: empowermentLevel, order: empowermentLevel };
    }),
  ];
}

function heroGearNormalEnhancementCostToTarget(piece, targetEnhancement) {
  const rows = heroGearNormalEnhancementRows();
  return rangeCost(rows, heroGearCurrentEnhancement(piece), clampHeroGearEnhancement(targetEnhancement), {
    idKey: "level_id",
    orderKey: "order",
    fields: HERO_GEAR_FIELDS,
  });
}

function heroGearEmpowermentCostToTarget(piece, targetEnhancement, slot, hero, targetLevel = piece?.level) {
  const rows = heroGearEmpowermentRows(piece, slot, hero);
  const targetEmpowerment = heroGearTargetEmpowerment(piece, targetEnhancement, targetLevel);
  return rangeCost(rows, heroGearCurrentEmpowerment(piece), targetEmpowerment, {
    idKey: "level_id",
    orderKey: "order",
    fields: HERO_GEAR_FIELDS,
  });
}

function heroGearUsesEmpowermentCost(piece = {}, targetLevel = piece?.level) {
  return heroGearCanEmpowerAtLevel(Number(targetLevel ?? piece?.level ?? 0));
}

function heroGearEnhancementCostToTarget(piece, targetEnhancement, slot, hero, targetLevel = piece?.level) {
  return heroGearUsesEmpowermentCost(piece, targetLevel)
    ? heroGearEmpowermentCostToTarget(piece, targetEnhancement, slot, hero, targetLevel)
    : heroGearNormalEnhancementCostToTarget(piece, targetEnhancement);
}

function heroGearMasteryInvestment(piece, slot, hero) {
  const currentLevel = Number(piece?.level || 0);
  if (!currentLevel) return makeCost(HERO_GEAR_FIELDS);
  return rangeCost(heroGearMasteryRows(piece, slot, hero), 0, currentLevel, {
    idKey: "level_id",
    orderKey: "order",
    fields: HERO_GEAR_FIELDS,
  });
}

function heroGearNormalEnhancementInvestment(piece) {
  const currentEnhancement = heroGearCurrentEnhancement(piece);
  if (!currentEnhancement) return makeCost(HERO_GEAR_FIELDS);
  return rangeCost(heroGearNormalEnhancementRows(), 0, currentEnhancement, {
    idKey: "level_id",
    orderKey: "order",
    fields: HERO_GEAR_FIELDS,
  });
}

function heroGearEmpowermentInvestment(piece, slot, hero) {
  const currentEmpowerment = heroGearCurrentEmpowerment(piece);
  if (!currentEmpowerment) return makeCost(HERO_GEAR_FIELDS);
  return rangeCost(heroGearEmpowermentRows(piece, slot, hero), 0, currentEmpowerment, {
    idKey: "level_id",
    orderKey: "order",
    fields: HERO_GEAR_FIELDS,
  });
}

function heroGearEnhancementInvestment(piece, slot, hero) {
  return heroGearUsesEmpowermentCost(piece)
    ? heroGearEmpowermentInvestment(piece, slot, hero)
    : heroGearNormalEnhancementInvestment(piece);
}

function heroGearPieceInvestment(piece, slot, hero) {
  return addCost(heroGearMasteryInvestment(piece, slot, hero), heroGearEnhancementInvestment(piece, slot, hero));
}

function heroGearSetInvestment(gearSet, heroId) {
  const hero = heroRecordFor(heroId);
  return heroGearPieces(gearSet?.gear).reduce((total, [slot, piece]) => {
    return addCost(total, heroGearPieceInvestment(piece, slot, hero));
  }, makeCost(HERO_GEAR_FIELDS));
}

function heroGearInvestmentMiniHtml(cost, label = "Invested") {
  return `<div class="hero-invested-mini">
    <span>${esc(label)}</span>
    ${HERO_GEAR_INVESTMENT_FIELDS.map((key) => `<b>${fmt(cost?.[key] || 0)} ${esc(RESOURCE_LABELS[key] || titleFromId(key))}</b>`).join("")}
  </div>`;
}

function heroGearPieceCostToTarget(piece, targets, slot, hero) {
  const masteryCost = heroGearMasteryCostToTarget(piece, targets.targetLevel, slot, hero);
  const enhancementCost = heroGearEnhancementCostToTarget(piece, targets.targetEnhancement, slot, hero, targets.targetLevel);
  return addCost(masteryCost, enhancementCost);
}

function heroGearCostToTarget(gearSet, heroId) {
  const hero = heroRecordFor(heroId);
  return heroGearPieces(gearSet?.gear).reduce((total, [slot, piece]) => {
    const targets = heroGearPieceTargetsFor(heroId, slot);
    return addCost(total, heroGearPieceCostToTarget(piece, targets, slot, hero));
  }, makeCost(HERO_GEAR_FIELDS));
}

function commonHeroGearTarget(kind, fallback) {
  const values = [];
  Object.entries(state.extracted_current?.hero_gear || {}).forEach(([heroId, gearSet]) => {
    if (kind === "special") {
      values.push(heroGearTargetsFor(heroId).specialEnhancement);
      return;
    }
    heroGearPieces(gearSet.gear).forEach(([slot]) => {
      const targets = heroGearPieceTargetsFor(heroId, slot);
      values.push(kind === "level" ? targets.targetLevel : targets.targetEnhancement);
    });
  });
  const unique = [...new Set(values.filter((value) => Number.isFinite(Number(value))).map((value) => String(value)))];
  if (unique.length === 1) return unique[0];
  const defaultKey = {
    level: "default_gear_level",
    enhancement: "default_gear_enhancement",
    special: "default_special_enhancement",
  }[kind];
  return String(state.hero_gear_targets?.[defaultKey] ?? fallback);
}

function heroGearPieceTargetsHtml(heroId, gearSet = {}) {
  const pieces = heroGearPieces(gearSet.gear);
  if (!pieces.length) return `<span class="muted">No targets</span>`;
  return `<div class="piece-target-summary">${pieces
    .map(([slot, piece]) => {
      const targets = heroGearPieceTargetsFor(heroId, slot);
      const position = HERO_GEAR_POSITION_LABELS[HERO_GEAR_SLOT_POSITIONS[slot]] || titleFromId(slot);
      const currentLevel = piece.level != null ? `Lv ${piece.level}` : "Lv ?";
      return `<div><span>${esc(position)}</span><strong>${currentLevel} -> Lv ${fmt(targets.targetLevel)} / +${fmt(targets.targetEnhancement)}</strong></div>`;
    })
    .join("")}</div>`;
}

function heroGearPieceName(slot, piece = {}) {
  return piece.name || HERO_GEAR_SLOT_LABELS[slot] || HERO_GEAR_POSITION_LABELS[HERO_GEAR_SLOT_POSITIONS[slot]] || titleFromId(slot);
}

function heroGearPieceMeta(piece = {}) {
  const currentEnhancement = heroGearCurrentEnhancement(piece);
  const lockedObserved = heroGearLockedObservedEnhancement(piece);
  return [
    piece.rarity,
    piece.level != null ? `Lv ${piece.level}` : "",
    piece.enhancement != null || piece.visible_enhancement != null ? `+${currentEnhancement}` : "",
    lockedObserved ? "empower stats locked" : "",
    piece.power != null ? `Power ${fmt(piece.power)}` : "",
  ]
    .filter(Boolean)
    .join(" | ");
}

function heroGearStatLabel(key) {
  return titleFromId(String(key).replace(/_percent$/, "").replaceAll("_", " "));
}

function compactHeroGearStatLabel(label) {
  return String(label || "")
    .replace(/^(Infantry|Lancer|Marksman|Marksmen)\s+/i, "")
    .replace(/Gear Stats/i, "Gear stats")
    .replace(/Hero Attack Up/i, "Hero atk")
    .replace(/Hero Health Up/i, "Hero HP")
    .replace(/Attack Up/i, "Atk")
    .replace(/Health Up/i, "HP");
}

function heroGearPieceStatEntries(piece = {}) {
  return Object.entries(piece.stats || {})
    .map(([key, value]) => {
      const type = key.endsWith("_percent") ? "percent" : "number";
      const number = Number(value);
      if (!Number.isFinite(number)) return null;
      return { key, label: heroGearStatLabel(key), type, value: number };
    })
    .filter(Boolean);
}

function heroGearPieceStatsHtml(piece = {}) {
  const entries = heroGearPieceStatEntries(piece);
  if (!entries.length) return `<span class="muted">No stats captured</span>`;
  return `<div class="stat-pill-list stat-pill-list--compact">${entries
    .map((entry) => `<span><b>${esc(entry.label)}</b>${entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value)}</span>`)
    .join("")}</div>`;
}

function troopLabelForHeroGear(hero = {}) {
  const normalized = normalizedTroopKey(hero?.troop_type || "");
  return {
    infantry: "Infantry",
    lancer: "Lancer",
    marksman: "Marksman",
  }[normalized] || "Troop";
}

function heroGearEmpowermentPatternKey(piece = {}, slot = "") {
  const canonicalSlot = heroGearCanonicalSlot(slot);
  const explicitPattern = HERO_GEAR_SLOT_EMPOWERMENT_PATTERNS[canonicalSlot] || HERO_GEAR_SLOT_EMPOWERMENT_PATTERNS[normalizeKey(slot)];
  if (explicitPattern) return explicitPattern;
  const name = normalizeKey(piece?.name || "");
  if (/goggles|belt/.test(name)) return "attack_side";
  if (/gauntlet|glove|boot/.test(name)) return "defense_side";
  return "";
}

function heroGearDefaultEmpowermentStats(piece = {}, hero = {}, slot = "") {
  const troopLabel = troopLabelForHeroGear(hero);
  const currentEnhancement = heroGearCurrentEmpowerment(piece);
  const patternKey = heroGearEmpowermentPatternKey(piece, slot);
  const patternRows = HERO_GEAR_EMPOWERMENT_STAT_PATTERNS[patternKey] || HERO_GEAR_DEFAULT_EMPOWERMENT_BREAKPOINTS;
  return patternRows.map((row) => ({
    enhancement: row.enhancement,
    mode: row.mode,
    stat: row.stat || `${troopLabel} ${row.statKind}`,
    value_percent: row.value_percent,
    unlocked: row.enhancement <= currentEnhancement,
    source: patternKey ? "slot_screenshot_reference" : "generic_screenshot_reference",
  }));
}

function heroGearEmpowermentStats(piece = {}, hero = {}, slot = "") {
  const defaults = heroGearDefaultEmpowermentStats(piece, hero, slot);
  const byEnhancement = new Map(defaults.map((row) => [Number(row.enhancement), row]));
  (Array.isArray(piece.empowerment_stats) ? piece.empowerment_stats : []).forEach((row) => {
    const enhancement = Number(row.enhancement || 0);
    if (!enhancement) return;
    byEnhancement.set(enhancement, {
      ...byEnhancement.get(enhancement),
      ...row,
      enhancement,
      value_percent: Number(row.value_percent ?? byEnhancement.get(enhancement)?.value_percent ?? 0),
      unlocked: row.unlocked === false ? false : enhancement <= heroGearCurrentEmpowerment(piece),
      source: row.source || "captured_detail",
    });
  });
  return [...byEnhancement.values()].sort((a, b) => Number(a.enhancement || 0) - Number(b.enhancement || 0));
}

function heroGearEmpowermentChipsHtml(piece = {}, hero = {}, targetEnhancement = null, slot = "") {
  const currentEnhancement = heroGearCurrentEmpowerment(piece);
  const target = Math.min(HERO_GEAR_MAX_EMPOWERMENT, Math.max(0, Number(targetEnhancement ?? currentEnhancement)));
  const rows = heroGearEmpowermentStats(piece, hero, slot);
  if (!rows.length) return "";
  return `<div class="hero-empowerment-chips">${rows
    .map((row) => {
      const enhancement = Number(row.enhancement || 0);
      const targeted = enhancement > currentEnhancement && enhancement <= target;
      return `<span class="${row.unlocked ? "is-unlocked" : ""} ${targeted ? "is-targeted" : ""}">
        <b>+${fmt(enhancement)}</b><em>${esc(compactHeroGearStatLabel(row.stat || "Stat"))} ${percentFmt(row.value_percent)}</em>
      </span>`;
    })
    .join("")}</div>`;
}

function heroGearPieceProjectedChanges(heroId, slot, piece = {}) {
  const hero = heroRecordFor(heroId);
  const troop = hero.troop_type || "Hero";
  const targets = heroGearPieceTargetsFor(heroId, slot);
  const changes = [];
  const currentLevel = Number(piece.level || 0);
  const targetLevel = Number(targets.targetLevel || 0);
  if (targetLevel > currentLevel) {
    const currentMastery = Number(piece.troop_mastery?.gear_stats_percent ?? currentLevel * 10);
    const targetMastery = targetLevel * 10;
    if (Number.isFinite(currentMastery) && Number.isFinite(targetMastery) && targetMastery > currentMastery) {
      changes.push(numericStatChange(`${troop} Gear Stats`, currentMastery, targetMastery, "percent"));
    }
  }
  const currentEnhancement = heroGearCurrentEmpowerment(piece);
  const targetEnhancement = heroGearTargetEmpowerment(piece, targets.targetEnhancement, targetLevel);
  heroGearEmpowermentStats(piece, hero, slot)
    .filter((row) => Number(row.enhancement || 0) > currentEnhancement && Number(row.enhancement || 0) <= targetEnhancement)
    .forEach((row) => {
      changes.push(numericStatChange(row.stat || "Empowerment Stat", 0, Number(row.value_percent || 0), "percent"));
    });
  return changes;
}

function heroGearPieceImpactCompactHtml(heroId, slot, piece = {}) {
  const changes = heroGearPieceProjectedChanges(heroId, slot, piece).filter((change) => Math.abs(Number(change.rawDelta || 0)) > 0);
  if (!changes.length) return `<span class="muted">No projected stat change</span>`;
  return `<div class="hero-piece-impact">${changes
    .slice(0, 3)
    .map((change) => `<span><b>${esc(change.label)}</b><em>${esc(change.delta)}</em></span>`)
    .join("")}</div>`;
}

function heroGearEmpowermentHtml(piece = {}, hero = {}, targetEnhancement = null, slot = "") {
  const rows = heroGearEmpowermentStats(piece, hero, slot);
  if (!rows.length) return "";
  const currentEnhancement = heroGearCurrentEmpowerment(piece);
  const target = Math.min(HERO_GEAR_MAX_EMPOWERMENT, Math.max(0, Number(targetEnhancement ?? currentEnhancement)));
  return `<div class="empowerment-list">${rows
    .map((row) => {
      const enhancement = Number(row.enhancement || 0);
      const targeted = enhancement > currentEnhancement && enhancement <= target;
      return `<div class="${row.unlocked ? "is-unlocked" : ""} ${targeted ? "is-targeted" : ""}">
        <span>+${esc(row.enhancement)} ${esc(row.mode || "")}</span>
        <strong>${esc(row.stat || "Stat")} ${percentFmt(row.value_percent)}</strong>
      </div>`;
    })
    .join("")}</div>`;
}

function heroGearAggregateStats(gearEntries) {
  const aggregate = {};
  gearEntries.forEach(([, gearSet]) => {
    heroGearPieces(gearSet.gear).forEach(([, piece]) => {
      heroGearPieceStatEntries(piece).forEach((entry) => {
        if (!aggregate[entry.key]) aggregate[entry.key] = { ...entry, value: 0 };
        aggregate[entry.key].value += entry.value;
      });
    });
  });
  return Object.values(aggregate);
}

function heroGearProjectedStatCards(gearEntries) {
  const projected = {};
  const mergeChange = (label, current, target, type) => {
    mergeNumericStatChanges(projected, [numericStatChange(label, current, target, type)]);
  };
  gearEntries.forEach(([heroId, gearSet]) => {
    const hero = heroRecordFor(heroId);
    const troop = hero.troop_type || gearSet.troop_type || "Hero";
    heroGearPieces(gearSet.gear).forEach(([slot, piece]) => {
      const targets = heroGearPieceTargetsFor(heroId, slot);
      const currentLevel = Number(piece.level || 0);
      const targetLevel = Number(targets.targetLevel || 0);
      if (targetLevel > currentLevel) {
        const currentMastery = Number(piece.troop_mastery?.gear_stats_percent ?? currentLevel * 10);
        const targetMastery = targetLevel * 10;
        if (Number.isFinite(currentMastery) && Number.isFinite(targetMastery)) {
          mergeChange(`${troop} Gear Stats`, currentMastery, targetMastery, "percent");
        }
      }
      const currentEnhancement = heroGearCurrentEmpowerment(piece);
      const targetEnhancement = heroGearTargetEmpowerment(piece, targets.targetEnhancement, targetLevel);
      heroGearEmpowermentStats(piece, hero, slot)
        .filter((row) => Number(row.enhancement || 0) > currentEnhancement && Number(row.enhancement || 0) <= targetEnhancement)
        .forEach((row) => {
          mergeChange(row.stat || "Empowerment Stat", 0, Number(row.value_percent || 0), "percent");
        });
    });
  });
  return aggregateStatCards(projected, "Projected from captured mastery and empowerment breakpoints");
}

function heroGearTroopKey(heroId, gearSet = {}) {
  const hero = heroRecordFor(heroId);
  return normalizedTroopKey(gearSet.troop_type || hero.troop_type);
}

function heroGearPowerTotal(gearSet = {}) {
  return heroGearPieces(gearSet.gear).reduce((total, [, piece]) => total + Number(piece.power || 0), 0);
}

function heroGearPowerText(gearSet = {}) {
  const power = heroGearPowerTotal(gearSet);
  return power > 0 ? `Power ${fmt(power)}` : "Power not captured";
}

function heroGearCurrentPieceCount(gearSet = {}) {
  return heroGearPieces(gearSet.gear).filter(([, piece]) => piece.level != null || piece.enhancement != null).length;
}

function heroGearReadablePieceCount(gearSet = {}) {
  return heroGearPieces(gearSet.gear).filter(([, piece]) => piece.level != null || piece.enhancement != null || piece.name || piece.power).length;
}

function heroGearEntryPriority(entry) {
  const { heroId, gearSet, hero } = entry;
  const currentPieces = heroGearCurrentPieceCount(gearSet);
  const readablePieces = heroGearReadablePieceCount(gearSet);
  const namedPieces = heroGearPieces(gearSet.gear).filter(([, piece]) => piece.name || piece.stats || piece.power).length;
  return {
    currentPieces,
    readablePieces,
    namedPieces,
    generation: Number(hero.generation || 0),
    power: heroGearPowerTotal(gearSet),
    name: hero.name || titleFromId(heroId),
  };
}

function heroGearPrimaryEntries(gearEntries) {
  const grouped = HERO_GEAR_TROOP_ORDER.reduce((acc, key) => ({ ...acc, [key]: [] }), {});
  gearEntries.forEach(([heroId, gearSet]) => {
    const hero = heroRecordFor(heroId);
    const troopKey = heroGearTroopKey(heroId, gearSet);
    if (!grouped[troopKey]) return;
    grouped[troopKey].push({ heroId, gearSet, hero, troopKey });
  });
  return HERO_GEAR_TROOP_ORDER.flatMap((troopKey) => {
    const limit = HERO_GEAR_PRIMARY_LIMITS[troopKey] || 1;
    return grouped[troopKey]
      .sort((a, b) => {
        const aScore = heroGearEntryPriority(a);
        const bScore = heroGearEntryPriority(b);
        return (
          bScore.currentPieces - aScore.currentPieces ||
          bScore.readablePieces - aScore.readablePieces ||
          bScore.namedPieces - aScore.namedPieces ||
          bScore.generation - aScore.generation ||
          bScore.power - aScore.power ||
          aScore.name.localeCompare(bScore.name)
        );
      })
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        setNumber: index + 1,
        setLabel: `${titleFromId(troopKey)} Set ${index + 1}`,
      }));
  });
}

function heroGearEntryPairs(entries) {
  return entries.map((entry) => (Array.isArray(entry) ? entry : [entry.heroId, entry.gearSet]));
}

function heroGearUpgradeSummary(entries) {
  const pairs = heroGearEntryPairs(entries);
  const totalCost = makeCost(HERO_GEAR_FIELDS);
  const investedCost = makeCost(HERO_GEAR_FIELDS);
  const selectedUpgrades = [];
  let selectedPieceCount = 0;
  let totalPower = 0;
  let pieceCount = 0;
  let specialCount = 0;
  pairs.forEach(([heroId, gearSet]) => {
    const hero = heroRecordFor(heroId);
    addCost(totalCost, heroGearCostToTarget(gearSet, heroId));
    addCost(investedCost, heroGearSetInvestment(gearSet, heroId));
    totalPower += heroGearPowerTotal(gearSet);
    pieceCount += heroGearPieces(gearSet.gear).length;
    if (gearSet.special_item || gearSet.charm_toolkit) specialCount += 1;
    heroGearPieces(gearSet.gear).forEach(([slot, piece]) => {
      const pieceTargets = heroGearPieceTargetsFor(heroId, slot);
      const pieceCost = heroGearPieceCostToTarget(piece, pieceTargets, slot, hero);
      if (costIsEmpty(pieceCost)) return;
      const position = HERO_GEAR_SLOT_POSITIONS[slot] || slot.replaceAll("_", "-");
      selectedPieceCount += 1;
      selectedUpgrades.push({
        kind: "gear",
        scope: `equipped ${heroId} ${position}`,
        label: heroGearPieceName(slot, piece),
        meta: `${hero.name} | ${HERO_GEAR_POSITION_LABELS[position] || titleFromId(position)}`,
        from: `Lv ${piece.level ?? "?"}/+${heroGearCurrentEnhancement(piece)}`,
        to: `Lv ${pieceTargets.targetLevel}/+${pieceTargets.targetEnhancement}`,
      });
    });
  });
  return {
    pairs,
    totalCost,
    investedCost,
    selectedUpgrades,
    selectedPieceCount,
    totalPower,
    pieceCount,
    specialCount,
    impactCards: heroGearProjectedStatCards(pairs),
    capturedStats: heroGearAggregateStats(pairs),
  };
}

function heroGearSetInvestmentBreakdown(entries) {
  return entries.reduce((acc, entry) => {
    const [heroId, gearSet] = Array.isArray(entry) ? entry : [entry.heroId, entry.gearSet];
    const setNumber = Number(entry?.setNumber || gearSet?.set_number || gearSet?.gear_set_number || 0);
    const setLabel = entry?.setLabel || (setNumber ? `${titleFromId(heroGearTroopKey(heroId, gearSet))} Set ${setNumber}` : heroRecordFor(heroId).name);
    const investment = heroGearSetInvestment(gearSet, heroId);
    const key = setNumber > 0 ? `set_${setNumber}` : "unassigned";
    acc[key] ||= { setNumber, sets: [], total: makeCost(HERO_GEAR_FIELDS) };
    acc[key].sets.push({ heroId, setLabel, investment });
    addCost(acc[key].total, investment);
    return acc;
  }, {});
}

function heroGearPiecesHtml(gear = {}) {
  if (!gear || typeof gear !== "object") return `<span class="muted">No gear read</span>`;
  if (gear.overview) return `<span class="muted">${esc(gear.overview)}</span>`;
  const pieces = heroGearPieces(gear);
  if (!pieces.length) return `<span class="muted">No gear read</span>`;
  return `<div class="gear-set">${pieces
    .map(([slot, piece]) => {
      const label = heroGearPieceName(slot, piece);
      const meta = heroGearPieceMeta(piece);
      return `<div class="gear-piece">${visualLabel("hero gear", label, meta)}${heroGearPieceStatsHtml(piece)}</div>`;
    })
    .join("")}</div>`;
}

function heroGearSpecialHtml(gearSet = {}) {
  const source = gearSet || {};
  const special = source.special_item || (source.charm_toolkit ? { name: "Charm Toolkit", enhancement: source.charm_toolkit.enhancement } : null);
  if (!special) return `<span class="muted">None read</span>`;
  const meta = special.enhancement != null ? `+${special.enhancement}` : special.enhancement_observed || "";
  return visualLabel("special gear", special.name || "Special Item", meta);
}

function heroGearSlotCardHtml(heroId, position, entry) {
  if (!entry) {
    return `<div class="equipped-slot equipped-slot--empty equipped-slot--${position}">
      <span>${esc(HERO_GEAR_POSITION_LABELS[position] || titleFromId(position))}</span>
      <strong>Not read</strong>
    </div>`;
  }
  const { slot, piece } = entry;
  const label = heroGearPieceName(slot, piece);
  const sourceScope = `equipped ${heroId} ${position}`;
  const sourceState = heroGearPieceStatEntries(piece).length ? "Opened detail" : piece.name ? "Equipped item read" : "Visible slot";
  const targets = heroGearPieceTargetsFor(heroId, slot);
  const targetLevelPath = `hero_gear_targets.heroes.${heroId}.pieces.${slot}.target_level`;
  const targetEnhancementPath = `hero_gear_targets.heroes.${heroId}.pieces.${slot}.target_enhancement`;
  const hero = heroRecordFor(heroId);
  const pieceCost = heroGearPieceCostToTarget(piece, targets, slot, hero);
  const investment = heroGearPieceInvestment(piece, slot, hero);
  const currentEnhancement = heroGearCurrentEnhancement(piece);
  const targetEmpowerment = heroGearTargetEmpowerment(piece, targets.targetEnhancement, targets.targetLevel);
  const lockedObserved = heroGearLockedObservedEnhancement(piece);
  return `<div class="equipped-slot equipped-slot--${position}">
    <div class="equipped-slot__icon">${iconHtml("gear", label, "md", sourceScope)}</div>
    <div class="equipped-slot__copy">
      <span>${esc(HERO_GEAR_POSITION_LABELS[position] || titleFromId(position))}</span>
      <strong>${esc(label)}</strong>
      <small>${esc(sourceState)}</small>
    </div>
    <div class="equipped-slot__badges">
      ${piece.level != null ? `<b>Lv ${esc(piece.level)}</b>` : ""}
      ${piece.enhancement != null || piece.visible_enhancement != null ? `<b>+${esc(currentEnhancement)}</b>` : ""}
      ${piece.rarity ? `<em>${esc(piece.rarity)}</em>` : ""}
      ${lockedObserved ? `<em>empower stats locked</em>` : ""}
    </div>
    <div class="equipped-slot__targets">
      <label><span>Target level</span>${numberInput(targetLevelPath, targets.targetLevel, 0)}</label>
      <label><span>Target +</span>${numberInput(targetEnhancementPath, targets.targetEnhancement, 0)}</label>
      ${resetTargetButton(`hero-gear:${heroId}:${slot}`, "Reset this piece")}
      ${piece.power != null ? `<div><span>Power read</span><strong>${fmt(piece.power)}</strong></div>` : ""}
      <div><span>Enhance XP</span><strong>${fmt(pieceCost.hero_gear_xp)}</strong></div>
    </div>
    <div class="equipped-slot__invested">${heroGearInvestmentMiniHtml(investment, "Current investment")}</div>
    <div class="equipped-slot__materials"><span>Upgrade materials</span>${costHtml(pieceCost, HERO_GEAR_FIELDS)}</div>
    <div class="equipped-slot__stats">${heroGearPieceStatsHtml(piece)}${heroGearEmpowermentHtml(piece, hero, targetEmpowerment, slot)}</div>
	  </div>`;
}

function heroGearMiniSlotHtml(heroId, position, entry) {
  const positionLabel = HERO_GEAR_POSITION_LABELS[position] || titleFromId(position);
  if (!entry) {
    return `<div class="hero-gear-mini-slot hero-gear-mini-slot--empty">
      <span>${esc(positionLabel)}</span>
      <strong>Not read</strong>
    </div>`;
  }
  const { slot, piece } = entry;
  const label = heroGearPieceName(slot, piece);
  const sourceScope = `equipped ${heroId} ${position}`;
  const level = piece.level != null ? `Lv ${piece.level}` : "Lv ?";
  const enhancement = piece.enhancement != null || piece.visible_enhancement != null ? `+${heroGearCurrentEnhancement(piece)}` : "";
  const lockedObserved = heroGearLockedObservedEnhancement(piece);
  return `<div class="hero-gear-mini-slot">
    ${iconHtml("gear", label, "md", sourceScope)}
    <span>${esc(positionLabel)}</span>
    <strong>${esc(level)}${enhancement ? ` <em>${esc(enhancement)}</em>` : ""}${lockedObserved ? ` <em>stats locked</em>` : ""}</strong>
  </div>`;
}

function heroGearPrimaryPieceHtml(heroId, position, entry) {
  const positionLabel = HERO_GEAR_POSITION_LABELS[position] || titleFromId(position);
  if (!entry) {
    return `<div class="hero-primary-piece hero-primary-piece--empty">
      <span>${esc(positionLabel)}</span>
      <strong>Not read</strong>
    </div>`;
  }
  const { slot, piece } = entry;
  const label = heroGearPieceName(slot, piece);
  const targets = heroGearPieceTargetsFor(heroId, slot);
  const targetLevelPath = `hero_gear_targets.heroes.${heroId}.pieces.${slot}.target_level`;
  const targetEnhancementPath = `hero_gear_targets.heroes.${heroId}.pieces.${slot}.target_enhancement`;
  const hero = heroRecordFor(heroId);
  const investment = heroGearPieceInvestment(piece, slot, hero);
  const lockedObserved = heroGearLockedObservedEnhancement(piece);
  const startText = `${piece.level ?? "?"}/+${heroGearCurrentEnhancement(piece)}`;
  const targetText = `${targets.targetLevel}/+${targets.targetEnhancement}`;
  const targetEmpowerment = heroGearTargetEmpowerment(piece, targets.targetEnhancement, targets.targetLevel);
  const primaryChange = heroGearPieceProjectedChanges(heroId, slot, piece).find((change) => Math.abs(Number(change.rawDelta || 0)) > 0);
  return `<div class="hero-primary-piece">
    <div class="hero-primary-piece__head">
      ${iconHtml("gear", label, "md", `equipped ${heroId} ${position}`)}
      <div><span>${esc(positionLabel)}</span><strong>${esc(label)}</strong></div>
    </div>
    <div class="hero-primary-route">
      <span><small>Start</small><b>${esc(startText)}</b>${lockedObserved ? `<em>empower stats locked</em>` : ""}</span>
      <i aria-hidden="true"></i>
      <span><small>End</small><b>${esc(targetText)}</b></span>
    </div>
    <div class="hero-primary-inputs">
      <label><span>Target Lv</span>${numberInput(targetLevelPath, targets.targetLevel, 0)}</label>
      <label><span>Target +</span>${numberInput(targetEnhancementPath, targets.targetEnhancement, 0)}</label>
      ${resetTargetButton(`hero-gear:${heroId}:${slot}`, "Reset piece")}
    </div>
    <div class="hero-primary-impact">${
      primaryChange
        ? `<span><b>${esc(compactHeroGearStatLabel(primaryChange.label))}</b><em>${esc(primaryChange.delta)}</em></span>`
        : `<span class="muted">No projected stat change</span>`
    }</div>
    ${heroGearEmpowermentChipsHtml(piece, hero, targetEmpowerment, slot)}
    ${heroGearInvestmentMiniHtml(investment)}
  </div>`;
}

function heroGearPrimarySetImpactHtml(heroId, gearSet = {}) {
  const projected = {};
  heroGearPieces(gearSet.gear).forEach(([slot, piece]) => {
    heroGearPieceProjectedChanges(heroId, slot, piece)
      .filter((change) => Math.abs(Number(change.rawDelta || 0)) > 0)
      .forEach((change) => mergeNumericStatChanges(projected, [change]));
  });
  const changes = Object.values(projected).filter((change) => Math.abs(Number(change.rawDelta || 0)) > 0);
  if (!changes.length) return `<span class="muted">No projected stat changes</span>`;
  return changes
    .slice(0, 3)
    .map((change) => `<span><b>${esc(compactHeroGearStatLabel(change.label))}</b><em>${esc(statDeltaDisplay(change.rawDelta, change.type))}</em></span>`)
    .join("");
}

function heroGearPrimarySetCardHtml(entry, variant = "primary") {
  const { heroId, gearSet, hero, setLabel } = entry;
  const byPosition = heroGearPiecesByPosition(gearSet.gear || {});
  const pieceHtml = HERO_GEAR_POSITION_ORDER.map((position) => heroGearPrimaryPieceHtml(heroId, position, byPosition[position])).join("");
  const targetCost = heroGearCostToTarget(gearSet, heroId);
  const investedCost = heroGearSetInvestment(gearSet, heroId);
  const targets = heroGearTargetsFor(heroId);
  const special = gearSet.special_item || (gearSet.charm_toolkit ? { name: "Charm Toolkit", enhancement: gearSet.charm_toolkit.enhancement } : null);
  const specialMeta = special
    ? [special.enhancement != null ? `+${special.enhancement}` : "", special.enhancement_observed || ""].filter(Boolean).join(" | ")
    : "";
  return `<article class="hero-primary-card hero-primary-card--${esc(variant)}">
    <div class="hero-primary-card__head">
      <div>
        <span>${esc(setLabel)}</span>
        <h3>${esc(hero.name)}</h3>
      </div>
      ${visualLabel("troop", gearSet.troop_type || hero.troop_type)}
    </div>
    <div class="hero-primary-card__meta">
      <span>${fmt(heroGearCurrentPieceCount(gearSet))}/4 pieces with current levels</span>
      <span>${esc(heroGearPowerText(gearSet))}</span>
      <span>${fmt(investedCost.essence_stones)} stones invested</span>
      <span>${fmt(investedCost.hero_gear_xp)} XP invested</span>
      <span>${fmt(investedCost.mythic_gear)} mythic gear invested</span>
      <span>${fmt(investedCost.mithril)} mithril invested</span>
      <span>${special ? `Special ${specialMeta || "read"}` : "No special read"}</span>
    </div>
    <div class="hero-primary-pieces">${pieceHtml}</div>
    <div class="hero-primary-card__impact">${heroGearPrimarySetImpactHtml(heroId, gearSet)}</div>
    <div class="hero-primary-bottom">
      <div class="special-loadout special-loadout--compact">
        <span>Special</span>
        ${special ? visualLabel("special gear", special.name || "Special Item", specialMeta) : `<strong class="muted">None read</strong>`}
        <label class="inline-target"><span>Target special</span>${numberInput(`hero_gear_targets.heroes.${heroId}.special_enhancement`, targets.specialEnhancement, 0)}</label>
      </div>
      <div class="hero-primary-total">
        <span>Set materials</span>
        ${costHtml(targetCost, HERO_GEAR_FIELDS)}
      </div>
    </div>
  </article>`;
}

function heroGearPrimaryOverviewHtml(primaryEntries) {
  if (!primaryEntries.length) {
    return `<div class="empty-state"><span class="muted">No primary hero gear sets could be matched from the current extract.</span></div>`;
  }
  const mainEntries = HERO_GEAR_TROOP_ORDER.map((troopKey) => primaryEntries.find((entry) => entry.troopKey === troopKey && entry.setNumber === 1)).filter(Boolean);
  const secondaryEntries = primaryEntries.filter((entry) => entry.setNumber > 1);
  return `<section class="hero-primary-overview" aria-label="Primary equipped hero gear sets">
    <div class="section-title-row">
      <div><h2>Main Interchangeable Gear Sets</h2><p>Hero gear can be swapped between heroes. These are the leading Infantry, Lancer, and Marksman sets to plan first.</p></div>
      <span class="status-pill">${fmt(mainEntries.length)} main sets</span>
    </div>
    <div class="hero-primary-grid hero-primary-grid--main">${mainEntries.map((entry) => heroGearPrimarySetCardHtml(entry, "main")).join("")}</div>
    ${
      secondaryEntries.length
        ? `<div class="section-title-row section-title-row--sub">
            <div><h2>Secondary Interchangeable Sets</h2><p>Additional troop sets after the main Infantry, Lancer, and Marksman gear are planned.</p></div>
            <span class="status-pill">${fmt(secondaryEntries.length)} secondary sets</span>
          </div>
          <div class="hero-primary-grid hero-primary-grid--secondary">${secondaryEntries
            .map((entry) => heroGearPrimarySetCardHtml(entry, "secondary"))
            .join("")}</div>`
        : ""
    }
  </section>`;
}

function heroGearLoadoutHtml(heroId, gearSet, hero, targetCost, targets, setLabel = "") {
  const byPosition = heroGearPiecesByPosition(gearSet.gear || {});
  const slotsHtml = HERO_GEAR_POSITION_ORDER.map((position) => heroGearSlotCardHtml(heroId, position, byPosition[position])).join("");
  const miniSlotsHtml = HERO_GEAR_POSITION_ORDER.map((position) => heroGearMiniSlotHtml(heroId, position, byPosition[position])).join("");
  const overview = gearSet.gear?.overview
    ? `<div class="gear-overview-note">${esc(gearSet.gear.overview)}</div>`
    : "";
  const special = gearSet.special_item || (gearSet.charm_toolkit ? { name: "Charm Toolkit", enhancement: gearSet.charm_toolkit.enhancement } : null);
  const specialMeta = special
    ? [special.enhancement != null ? `+${special.enhancement}` : "", special.enhancement_observed || ""].filter(Boolean).join(" | ")
    : "";
  return `<article class="hero-loadout-card">
    <div class="hero-loadout-head">
      ${visualLabel("hero", hero.name, [setLabel, hero.rarity, hero.generation ? `Gen ${hero.generation}` : ""].filter(Boolean).join(" | "))}
      ${visualLabel("troop", gearSet.troop_type || hero.troop_type)}
    </div>
    <div class="hero-loadout-summary">
      <div class="hero-gear-strip">${miniSlotsHtml}</div>
      <div class="hero-loadout-side">
        <div class="special-loadout special-loadout--compact">
          <span>Special</span>
          ${special ? visualLabel("special gear", special.name || "Special Item", specialMeta) : `<strong class="muted">None read</strong>`}
        </div>
        <div class="hero-loadout-targets hero-loadout-targets--compact">
          <label><span>Target special</span>${numberInput(`hero_gear_targets.heroes.${heroId}.special_enhancement`, targets.specialEnhancement, 0)}</label>
          <div><span>Needed</span>${costHtml(targetCost, HERO_GEAR_FIELDS)}</div>
        </div>
      </div>
    </div>
    ${overview}
    <details class="hero-loadout-details">
      <summary>Piece targets and captured stats</summary>
      <div class="equipped-layout">${slotsHtml}</div>
    </details>
  </article>`;
}

function smartChiefGearPlan() {
  const levels = sortByNumber(gameData.chief_gear_levels, "sequence");
  const slotById = Object.fromEntries(gameData.chief_gear_slots.map((slot) => [slot.slot_id, slot]));
  const targets = Object.entries(state.chief_gear || {}).reduce((acc, [slotId, saved]) => {
    acc[slotId] = saved.current;
    return acc;
  }, {});
  return smartOptimize({
    moduleId: "chief_gear",
    fields: GEAR_FIELDS,
    exchangeKey: "chief_gear",
    targetState: targets,
    buildCandidates: (targetState) =>
      Object.entries(state.chief_gear || {})
        .map(([slotId, saved]) => {
          const current = targetState[slotId] ?? saved.current;
          const next = nextOrderedRow(levels, current, "gear_level_code", "sequence");
          if (!next) return null;
          const slot = slotById[slotId] || { name: titleFromId(slotId) };
          const group = chiefTroopGroupForSlot(slotId);
          const impact = powerImpact(levels, current, next.gear_level_code, "gear_level_code");
          const cost = rangeCost(levels, current, next.gear_level_code, {
            idKey: "gear_level_code",
            orderKey: "sequence",
            fields: GEAR_FIELDS,
          });
          return {
            kind: "gear",
            scope: "gear",
            label: slot.name,
            meta: group?.label || "",
            troopType: group?.id || "",
            from: current,
            to: next.gear_level_code,
            fields: GEAR_FIELDS,
            cost,
            powerDelta: impact.deltaPower,
            changes: chiefGearAttributeChanges(slotId, current, next.gear_level_code),
            updates: [{ path: `chief_gear.${slotId}.target`, value: next.gear_level_code }],
            applyToPlan: () => {
              targetState[slotId] = next.gear_level_code;
            },
          };
        })
        .filter(Boolean),
  });
}

function smartCharmPlan() {
  const levels = [{ charm_level: 0, label: "0", power: 0 }, ...gameData.chief_charm_levels.map((row) => ({ ...row, label: String(row.charm_level) }))];
  const gearSlotById = Object.fromEntries(gameData.chief_gear_slots.map((slot) => [slot.slot_id, slot]));
  const targets = Object.entries(state.charms || {}).reduce((acc, [slotId, saved]) => {
    acc[slotId] = saved.current;
    return acc;
  }, {});
  return smartOptimize({
    moduleId: "charms",
    fields: CHARM_FIELDS,
    exchangeKey: "chief_charms",
    targetState: targets,
    buildCandidates: (targetState) =>
      Object.entries(state.charms || {})
        .map(([slotId, saved]) => {
          const current = Number(targetState[slotId] ?? saved.current);
          const next = nextOrderedRow(levels, current, "charm_level", "charm_level");
          if (!next) return null;
          const gearSlotId = slotId.split("_")[0];
          const gearSlot = gearSlotById[gearSlotId] || { name: titleFromId(gearSlotId) };
          const group = chiefTroopGroupForSlot(gearSlotId);
          const impact = powerImpact(levels, current, next.charm_level, "charm_level");
          const cost = rangeCost(levels, current, next.charm_level, {
            idKey: "charm_level",
            orderKey: "charm_level",
            fields: CHARM_FIELDS,
          });
          return {
            kind: "charm",
            scope: "charm",
            label: `${gearSlot.name} ${titleFromId(slotId.split("_").slice(1).join("_"))}`,
            meta: group?.label || "",
            troopType: group?.id || "",
            from: `Lv ${current}`,
            to: `Lv ${next.charm_level}`,
            fields: CHARM_FIELDS,
            cost,
            powerDelta: impact.deltaPower,
            changes: chiefCharmAttributeChanges(gearSlotId, current, next.charm_level),
            updates: [{ path: `charms.${slotId}.target`, value: Number(next.charm_level) }],
            applyToPlan: () => {
              targetState[slotId] = Number(next.charm_level);
            },
          };
        })
        .filter(Boolean),
  });
}

function smartPetPlan() {
  const levelsByPet = groupBy(gameData.pet_levels, "pet_id");
  const targets = Object.entries(state.pets || {}).reduce((acc, [petId, saved]) => {
    acc[petId] = saved.current;
    return acc;
  }, {});
  return smartOptimize({
    moduleId: "pets",
    fields: PET_FIELDS,
    targetState: targets,
    buildCandidates: (targetState) =>
      gameData.pets
        .map((pet) => {
          const saved = state.pets?.[pet.pet_id];
          if (!saved) return null;
          const levels = (levelsByPet[pet.pet_id] || []).map((row, idx) => ({ ...row, order: idx, label: row.level_code }));
          const current = targetState[pet.pet_id] ?? saved.current;
          const next = nextOrderedRow(levels, current, "level_code", "order");
          if (!next) return null;
          const cost = rangeCost(levels, current, next.level_code, {
            idKey: "level_code",
            orderKey: "order",
            fields: PET_FIELDS,
          });
          const svsGain = rangeSum(levels, current, next.level_code, {
            idKey: "level_code",
            orderKey: "order",
            field: "svs_points",
          });
          const observed = state.extracted_current?.pets?.[pet.pet_id] || {};
          return {
            kind: "pet",
            scope: "pet",
            label: pet.name,
            meta: observed.power ? `Power ${fmt(observed.power)}` : "",
            from: `Lv ${current}`,
            to: `Lv ${next.level_code}`,
            fields: PET_FIELDS,
            cost,
            svsGain,
            changes: [numericStatChange("SVS Points", 0, svsGain, "number")],
            updates: [{ path: `pets.${pet.pet_id}.target`, value: next.level_code }],
            applyToPlan: () => {
              targetState[pet.pet_id] = next.level_code;
            },
          };
        })
        .filter(Boolean),
  });
}

function expertAffinityNumericChanges(expertId, currentId, targetId) {
  const levels = groupBy(gameData.expert_affinity_levels, "expert_id")[expertId] || [];
  const current = levelRow(levels, "level_code", currentId);
  const target = levelRow(levels, "level_code", targetId);
  if (!current || !target) return [];
  return [
    ["primary_stat_label", "primary_stat"],
    ["secondary_stat_label", "secondary_stat"],
  ]
    .map(([labelKey, valueKey]) => {
      const currentValue = Number(current[valueKey]);
      const targetValue = Number(target[valueKey]);
      if (!Number.isFinite(currentValue) || !Number.isFinite(targetValue)) return null;
      return numericStatChange(expertStatLabel(target[labelKey] || current[labelKey]), currentValue * 100, targetValue * 100, "percent");
    })
    .filter(Boolean);
}

function smartExpertPlan() {
  const levelsByExpert = groupBy(gameData.expert_affinity_levels, "expert_id");
  const targets = Object.entries(state.experts || {}).reduce((acc, [expertId, saved]) => {
    acc[expertId] = saved.relationship_current;
    return acc;
  }, {});
  return smartOptimize({
    moduleId: "experts",
    fields: ["expert_affinity", ["common_sigils", "sigils"]],
    targetState: targets,
    buildCandidates: (targetState) =>
      gameData.experts
        .map((expert) => {
          const saved = state.experts?.[expert.expert_id];
          if (!saved) return null;
          const levels = levelsByExpert[expert.expert_id] || [];
          const current = targetState[expert.expert_id] ?? saved.relationship_current;
          const next = nextOrderedRow(levels, current, "level_code", "relationship_level");
          if (!next) return null;
          const cost = rangeCost(levels, current, next.level_code, {
            idKey: "level_code",
            orderKey: "relationship_level",
            fields: [["expert_affinity", "affinity"], ["common_sigils", "sigils"]],
          });
          const currentRow = levelRow(levels, "level_code", current);
          return {
            kind: "expert",
            scope: "expert",
            label: expert.name,
            meta: expert.skills?.map((skill) => skill.name).join(", ") || "",
            from: current,
            to: next.level_code,
            fields: ["expert_affinity", ["common_sigils", "sigils"]],
            cost,
            powerDelta: Number(next.power || 0) - Number(currentRow?.power || 0),
            changes: expertAffinityNumericChanges(expert.expert_id, current, next.level_code),
            updates: [{ path: `experts.${expert.expert_id}.relationship_target`, value: next.level_code }],
            applyToPlan: () => {
              targetState[expert.expert_id] = next.level_code;
            },
          };
        })
        .filter(Boolean),
  });
}

function smartHeroGearPlan() {
  const entries = heroGearPrimaryEntries(Object.entries(state.extracted_current?.hero_gear || {}));
  const targetState = { levels: {}, enhancements: {} };
  entries.forEach(({ heroId, gearSet }) => {
    heroGearPieces(gearSet.gear).forEach(([slot, piece]) => {
      const key = `${heroId}:${slot}`;
      targetState.levels[key] = Number(piece.level || 0);
      targetState.enhancements[key] = heroGearCurrentEnhancement(piece);
    });
  });
  return smartOptimize({
    moduleId: "hero_gear",
    fields: HERO_GEAR_FIELDS,
    targetState,
    buildCandidates: (targetState) => {
      const candidates = [];
      entries.forEach(({ heroId, gearSet, hero, setLabel }) => {
        heroGearPieces(gearSet.gear).forEach(([slot, piece]) => {
          const key = `${heroId}:${slot}`;
          const label = heroGearPieceName(slot, piece);
          const troop = hero.troop_type || gearSet.troop_type || "";
          const currentLevel = Number(targetState.levels[key] || 0);
          const nextMastery = nextOrderedRow(heroGearMasteryRows(piece, slot, hero), currentLevel, "level_id", "order");
          if (nextMastery) {
            const nextLevel = Number(nextMastery.level_id);
            const cost = heroGearMasteryCostToTarget({ ...piece, level: currentLevel }, nextLevel, slot, hero);
            candidates.push({
              kind: "gear",
              scope: `equipped ${heroId} ${slot}`,
              label,
              meta: `${setLabel || hero.name} | Mastery`,
              troopType: troop,
              from: `Lv ${currentLevel}`,
              to: `Lv ${nextLevel}`,
              fields: HERO_GEAR_FIELDS,
              cost,
              changes: [numericStatChange(`${troop || "Hero"} Gear Stats`, currentLevel * 10, nextLevel * 10, "percent")],
              updates: [{ path: `hero_gear_targets.heroes.${heroId}.pieces.${slot}.target_level`, value: nextLevel }],
              applyToPlan: () => {
                targetState.levels[key] = nextLevel;
              },
            });
          }

          const currentEnhancement = Number(targetState.enhancements[key] || 0);
          const currentEmpowerment = heroGearCurrentEmpowerment({ ...piece, level: currentLevel, enhancement: currentEnhancement });
          const empowermentRows = heroGearCanEmpowerAtLevel(currentLevel)
            ? heroGearEmpowermentStats(piece, hero, slot)
                .map((row) => ({ ...row, enhancement: Number(row.enhancement || 0) }))
                .filter((row) => row.enhancement > currentEnhancement)
                .sort((a, b) => a.enhancement - b.enhancement)
            : [];
          const nextEmpowerment = empowermentRows[0];
          if (nextEmpowerment) {
            const nextEnhancement = Number(nextEmpowerment.enhancement);
            const cost = heroGearEnhancementCostToTarget({ ...piece, enhancement: currentEnhancement }, nextEnhancement, slot, hero, currentLevel);
            const changes = heroGearEmpowermentStats(piece, hero, slot)
              .filter((row) => Number(row.enhancement || 0) > currentEmpowerment && Number(row.enhancement || 0) <= nextEnhancement)
              .map((row) => numericStatChange(row.stat || "Empowerment Stat", 0, Number(row.value_percent || 0), "percent"));
            candidates.push({
              kind: "gear",
              scope: `equipped ${heroId} ${slot}`,
              label,
              meta: `${setLabel || hero.name} | Enhancement`,
              troopType: troop,
              from: `+${currentEnhancement}`,
              to: `+${nextEnhancement}`,
              fields: HERO_GEAR_FIELDS,
              cost,
              changes,
              updates: [{ path: `hero_gear_targets.heroes.${heroId}.pieces.${slot}.target_enhancement`, value: nextEnhancement }],
              applyToPlan: () => {
                targetState.enhancements[key] = nextEnhancement;
              },
            });
          }
        });
      });
      return candidates;
    },
  });
}

function smartResearchPlan() {
  const academy = state.extracted_current?.research?.war_academy || {};
  const targetState = {};
  Object.entries(academy.visible_nodes || {}).forEach(([nodeId, node]) => {
    if (/max|complete|completed/i.test(String(node.status || ""))) return;
    const progress = parseResearchLevelProgress(node);
    targetState[nodeId] = progress.current;
  });
  return smartOptimize({
    moduleId: "research",
    fields: RESEARCH_COST_FIELDS,
    targetState,
    buildCandidates: (targetState) =>
      Object.entries(academy.visible_nodes || {})
        .map(([nodeId, node]) => {
          if (/max|complete|completed/i.test(String(node.status || ""))) return null;
          const progress = parseResearchLevelProgress(node);
          const current = Number(targetState[nodeId] ?? progress.current);
          const maxLevel = warAcademyMaxLevel(nodeId);
          const next = current + 1;
          if (maxLevel ? next > maxLevel : current !== progress.current) return null;
          const isCapturedStep = current === progress.current && next === Number(progress.next || current + 1);
          const range = maxLevel ? warAcademyRangeCost(nodeId, current, next) : null;
          let cost;
          let changes;
          let powerDelta;
          if (range && !costIsEmpty(range.cost)) {
            cost = range.cost;
            powerDelta = range.power;
            changes = range.changes.map((change) => numericStatChange(change.label, 0, change.delta, change.type));
            if (isCapturedStep) {
              const captured = researchImpactChanges(node, true);
              if (captured.length) changes = captured;
            }
          } else {
            if (!isCapturedStep) return null;
            cost = researchCostFromNode(node);
            changes = researchImpactChanges(node, true);
            powerDelta = parseStatProgress(node.power)?.delta || 0;
          }
          return {
            kind: "research",
            scope: "research",
            label: titleFromId(nodeId),
            meta: node.status || "War Academy",
            troopType: nodeId,
            from: `Level ${current}`,
            to: `Level ${next}`,
            fields: RESEARCH_COST_FIELDS,
            cost,
            powerDelta,
            changes,
            updates: [
              { path: `research_targets.war_academy.${nodeId}.current`, value: progress.current },
              { path: `research_targets.war_academy.${nodeId}.target`, value: next },
            ],
            applyToPlan: () => {
              targetState[nodeId] = next;
            },
          };
        })
        .filter(Boolean),
  });
}

function smartRecommendationPlan(moduleId) {
  const planners = {
    chief_gear: smartChiefGearPlan,
    charms: smartCharmPlan,
    hero_gear: smartHeroGearPlan,
    pets: smartPetPlan,
    experts: smartExpertPlan,
    research: smartResearchPlan,
  };
  return planners[moduleId]?.() || {
    moduleId,
    bias: smartBiasFor(moduleId),
    fields: [],
    selected: [],
    blockedCandidates: [],
    totalCost: {},
  };
}

function resetSmartModuleTargets(moduleId) {
  if (moduleId === "chief_gear") {
    Object.values(state.chief_gear || {}).forEach((saved) => {
      saved.target = saved.current;
    });
  } else if (moduleId === "charms") {
    Object.values(state.charms || {}).forEach((saved) => {
      saved.target = Number(saved.current || 0);
    });
  } else if (moduleId === "pets") {
    Object.values(state.pets || {}).forEach((saved) => {
      saved.target = saved.current;
    });
  } else if (moduleId === "experts") {
    Object.values(state.experts || {}).forEach((saved) => {
      saved.relationship_target = saved.relationship_current;
    });
  } else if (moduleId === "hero_gear") {
    state.hero_gear_targets ||= {};
    state.hero_gear_targets.heroes ||= {};
    Object.entries(state.extracted_current?.hero_gear || {}).forEach(([heroId, gearSet]) => {
      const heroTargets = (state.hero_gear_targets.heroes[heroId] ||= {});
      heroTargets.pieces ||= {};
      heroGearPieces(gearSet.gear).forEach(([slot, piece]) => {
        heroTargets.pieces[slot] ||= {};
        heroTargets.pieces[slot].target_level = Number(piece.level || 0);
        heroTargets.pieces[slot].target_enhancement = heroGearCurrentEnhancement(piece);
      });
    });
  } else if (moduleId === "research") {
    const academy = state.extracted_current?.research?.war_academy || {};
    Object.entries(academy.visible_nodes || {}).forEach(([nodeId, node]) => {
      const progress = parseResearchLevelProgress(node);
      const saved = ensureResearchTarget("war_academy", nodeId, progress.current);
      saved.current = progress.current;
      saved.target = progress.current;
    });
    const activeNormal = state.extracted_current?.research?.active_research || {};
    const normalCurrent = parseResearchCurrentLevel(activeNormal.name);
    if (activeNormal.name) {
      const saved = ensureResearchTarget("regular", "active_research", normalCurrent);
      saved.current = normalCurrent;
      saved.target = normalCurrent;
    }
  }
}

function applySmartRecommendation(moduleId) {
  const plan = smartRecommendationPlan(moduleId);
  if (!plan.selected.length) return 0;
  resetSmartModuleTargets(moduleId);
  plan.selected.forEach((candidate) => {
    candidate.updates?.forEach((update) => setPath(state, update.path, update.value));
  });
  return plan.selected.length;
}

function chiefGearRarityBorderClass(levelCode) {
  const code = String(levelCode || "").toLowerCase();
  if (code.includes("legendary")) return "border-legendary";
  if (code.includes("epic")) return "border-epic";
  if (code.includes("rare")) return "border-rare";
  if (code.includes("uncommon")) return "border-uncommon";
  return "border-common";
}

function renderChiefGear() {
  let totalCost = makeCost(GEAR_FIELDS);
  let totalCurrentPower = 0;
  let totalTargetPower = 0;
  let totalStatChanges = {};
  let selectedUpgradeCount = 0;
  const selectedUpgrades = [];
  const levels = sortByNumber(gameData.chief_gear_levels, "sequence");
  const slotById = Object.fromEntries(gameData.chief_gear_slots.map((slot) => [slot.slot_id, slot]));
  const targetOptions = levels.map((level) => [level.gear_level_code, level.gear_level_code]);
  const maxTarget = levels.at(-1)?.gear_level_code;
  
  // Selected Gear Slot
  const selectedSlotId = state.selected_chief_gear_slot || "hat";
  const selectedSlot = slotById[selectedSlotId] || slotById["hat"];
  const selectedSaved = state.chief_gear[selectedSlotId] || { current: levels[0]?.gear_level_code, target: levels.at(-1)?.gear_level_code };
  
  const selectedImpact = powerImpact(levels, selectedSaved.current, selectedSaved.target, "gear_level_code");
  const selectedStatChanges = chiefGearAttributeChanges(selectedSlotId, selectedSaved.current, selectedSaved.target);
  const selectedPowerChange = {
    label: "Power",
    current: fmt(selectedImpact.currentPower),
    target: fmt(selectedImpact.targetPower),
    delta: signedFmt(selectedImpact.deltaPower),
  };
  const selectedCost = rangeCost(levels, selectedSaved.current, selectedSaved.target, {
    idKey: "gear_level_code",
    orderKey: "sequence",
    fields: GEAR_FIELDS,
  });

  // Calculate totals and group cards
  gameData.chief_gear_slots.forEach((slot) => {
    const saved = state.chief_gear[slot.slot_id];
    const impact = powerImpact(levels, saved.current, saved.target, "gear_level_code");
    const statChanges = chiefGearAttributeChanges(slot.slot_id, saved.current, saved.target);
    const cost = rangeCost(levels, saved.current, saved.target, {
      idKey: "gear_level_code",
      orderKey: "sequence",
      fields: GEAR_FIELDS,
    });
    totalCost = addCost(totalCost, cost);
    if (!costIsEmpty(cost)) {
      selectedUpgradeCount += 1;
      selectedUpgrades.push({
        kind: "gear",
        scope: "gear",
        label: slot.name,
        meta: slot.troop_type || "",
        from: saved.current,
        to: saved.target,
      });
    }
    totalCurrentPower += impact.currentPower;
    totalTargetPower += impact.targetPower;
    mergeNumericStatChanges(totalStatChanges, statChanges);
  });

  // Slot card renderer helper
  function renderSlotCard(slotId) {
    const slot = slotById[slotId];
    if (!slot) return "";
    const saved = state.chief_gear[slotId];
    const borderClass = chiefGearRarityBorderClass(saved.current);
    const isActive = slotId === selectedSlotId;
    const upgradeSelected = String(saved.current) !== String(saved.target);
    return `<div class="chief-gear-slot-card ${borderClass} ${isActive ? 'active-card' : ''}" data-select-chief-gear-slot="${slotId}">
      <div class="chief-gear-slot-card__icon">
        ${iconHtml("chiefgear" + slotId, slot.name, "lg")}
        ${upgradeSelected ? `<span class="gear-up-arrow" aria-hidden="true"></span>` : ""}
      </div>
      <div class="chief-gear-slot-card__info">
        <strong>${esc(slot.name)}</strong>
        <span class="tier-label">${esc(saved.current)}</span>
        ${upgradeSelected ? `<span class="tier-label tier-label--target">${esc(saved.target)}</span>` : ""}
      </div>
    </div>`;
  }

  const gearBulk = bulkTargetControls(
    "All gear target",
    "bulkChiefGearTarget",
    targetOptions,
    [{ action: "chief-gear", label: "Apply all slots" }],
    maxTarget,
  );
  
  const smartPlan = smartRecommendationPlan("chief_gear");

  const avatarSilhouette = `
    <div class="chief-avatar-container" id="chiefGear3d">
      <span class="hero3d-hint">Drag to rotate · click a piece to inspect</span>
      <svg class="chief-avatar-silhouette" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- cudgel angled behind the coat -->
        <g opacity="0.55">
          <path d="M67 30 L73 32 L62 72 L56 70 Z" fill="#00d2ff" opacity="0.55"/>
          <ellipse cx="71" cy="25" rx="7" ry="9" transform="rotate(18 71 25)" fill="#00d2ff" opacity="0.7"/>
          <circle cx="67" cy="19" r="1.6" fill="#2cf5f5"/>
          <circle cx="75" cy="23" r="1.6" fill="#2cf5f5"/>
          <circle cx="74" cy="30" r="1.6" fill="#2cf5f5"/>
        </g>
        <!-- fur hat -->
        <path d="M36 26 Q50 8 64 26 Z" fill="#00d2ff" opacity="0.85"/>
        <rect x="33" y="24" width="34" height="7" rx="3.5" fill="#2cf5f5" opacity="0.65"/>
        <circle cx="50" cy="18" r="2.2" fill="#eafcff" opacity="0.9"/>
        <!-- greatcoat with split hem over the pants -->
        <path d="M50 36 L66 42 L75 58 L66 64 L64 56 L64 110 L53 110 L53 78 L47 78 L47 110 L36 110 L36 56 L34 64 L25 58 L34 42 Z" fill="#00d2ff" opacity="0.6"/>
        <!-- collar -->
        <path d="M44 42 L50 54 L56 42 Z" fill="#2cf5f5" opacity="0.85"/>
        <!-- belt + buckle -->
        <rect x="36" y="72" width="28" height="5" fill="#2cf5f5" opacity="0.5"/>
        <rect x="46.5" y="70.5" width="7" height="8" rx="1.5" fill="#eafcff" opacity="0.85"/>
        <!-- pocket watch on a chain -->
        <path d="M58 64 Q63 70 60 77" stroke="#2cf5f5" stroke-width="1.4" stroke-dasharray="2 2" opacity="0.9" fill="none"/>
        <circle cx="60" cy="82" r="5" stroke="#2cf5f5" stroke-width="1.6" fill="#0d141b" opacity="0.95"/>
        <path d="M60 79.5 L60 82 L62 83.5" stroke="#eafcff" stroke-width="1.1" stroke-linecap="round" fill="none"/>
        <!-- ring with a set stone -->
        <circle cx="40" cy="86" r="3.6" stroke="#2cf5f5" stroke-width="1.6" fill="none" opacity="0.95"/>
        <path d="M40 78.6 L42.6 81.4 L40 84 L37.4 81.4 Z" fill="#eafcff" opacity="0.95"/>
        <!-- boots under the split hem -->
        <path d="M36 110 L47 110 L47 116 L34 116 Z" fill="#00d2ff" opacity="0.35"/>
        <path d="M53 110 L64 110 L66 116 L53 116 Z" fill="#00d2ff" opacity="0.35"/>
        <!-- drifting frost -->
        <circle cx="24" cy="40" r="1.5" fill="#2cf5f5" opacity="0.7"/>
        <circle cx="78" cy="48" r="1" fill="#2cf5f5" opacity="0.7"/>
        <circle cx="30" cy="95" r="1" fill="#2cf5f5" opacity="0.7"/>
        <circle cx="72" cy="100" r="1.5" fill="#2cf5f5" opacity="0.7"/>
        <circle cx="50" cy="128" r="1.2" fill="#2cf5f5" opacity="0.5"/>
      </svg>
    </div>
  `;

  const selectedCoverage = gameCostCoverage(selectedCost, GEAR_FIELDS);
  const editorHtml = gameDialogHtml({
    title: `${selectedSlot.name} — Gear Enhancement`,
    className: "chief-gear-dialog",
    body: `
      <div class="gd-hero-row">
        ${iconHtml("chiefgear" + selectedSlotId, selectedSlot.name, "xl")}
        ${gameLevelFlowHtml(selectedSaved.current, selectedSaved.target)}
      </div>
      <div class="gd-power-row">${iconHtml("power", "Power", "sm")}<strong>${fmt(selectedImpact.currentPower)}</strong><em class="gd-gain">${signedFmt(selectedImpact.deltaPower)}</em></div>
      <div class="gd-select-row">
        <label class="compact-field">
          <span>Current level</span>
          <select data-path="chief_gear.${selectedSlotId}.current">
            ${optionList(levels, "gear_level_code", "gear_level_code", selectedSaved.current)}
          </select>
        </label>
        <label class="compact-field">
          <span>Target level</span>
          <select data-path="chief_gear.${selectedSlotId}.target">
            ${optionList(levels, "gear_level_code", "gear_level_code", selectedSaved.target)}
          </select>
        </label>
      </div>
      ${gameBonusRowsHtml(
        [...selectedStatChanges.map((change) => ({ label: change.label, current: change.current, target: change.target }))],
        "Stat Bonuses",
      )}
      <section class="gd-section">
        ${gameSectionBannerHtml("Enhancement Cost")}
        ${gameCostTilesHtml(selectedCost, GEAR_FIELDS, { emptyText: "Slot already at target level." })}
      </section>
      <div class="gd-btn-row">
        ${gameButtonHtml(
          !selectedCoverage.hasCost ? "Target Met" : selectedCoverage.covered ? "Enhance" : "Materials Short",
          !selectedCoverage.hasCost ? "" : selectedCoverage.covered ? "All materials covered" : `${selectedCoverage.shortCount} material${selectedCoverage.shortCount === 1 ? "" : "s"} short — check exchange below`,
          selectedCoverage.covered && selectedCoverage.hasCost ? "blue" : "grey",
          selectedCoverage.covered && selectedCoverage.hasCost,
        )}
      </div>
    `,
  });

  $("#tab-chief-gear").innerHTML = `
    <div class="toolbar"><div><h2>Chief Gear</h2><p>Upgrade chief equipment items to boost troop stats.</p></div>${gearBulk}</div>
    
    <div class="chief-gear-layout-container">
      <div class="chief-gear-screen">
        <div class="chief-gear-grid-container">
          <div class="chief-gear-col-left">
            ${renderSlotCard("hat")}
            ${renderSlotCard("watch")}
            ${renderSlotCard("coat")}
          </div>
          ${avatarSilhouette}
          <div class="chief-gear-col-right">
            ${renderSlotCard("pants")}
            ${renderSlotCard("ring")}
            ${renderSlotCard("cudgel")}
          </div>
        </div>
      </div>
      
      <div class="chief-gear-editor-view">
        ${editorHtml}
      </div>
    </div>
    
    ${upgradeNutshellHtml({
      module: "Chief Gear",
      selected: upgradeSelectionText(selectedUpgradeCount, "gear target", "gear targets"),
      upgrades: selectedUpgrades,
      impactCards: [
        ...aggregateStatCards(totalStatChanges, "Chief gear attribute table"),
        statImpactCard("Power", fmt(totalCurrentPower), fmt(totalTargetPower), signedFmt(totalTargetPower - totalCurrentPower), "Exact current-to-target power delta"),
      ],
      details: [`Power ${fmt(totalCurrentPower)} -> ${fmt(totalTargetPower)}`, `Gain ${signedFmt(totalTargetPower - totalCurrentPower)}`],
      cost: totalCost,
      fields: GEAR_FIELDS,
      exchangeKey: "chief_gear",
      empty: "Set chief gear targets above current tiers to see material gaps.",
    })}
    
    ${smartRecommendationPanelHtml("chief_gear", "Chief Gear Targets", smartPlan, "Suggests affordable chief gear target changes by stat gain and material pressure.")}
    ${inventoryComparisonHtml(totalCost, GEAR_FIELDS, "Combined gear upgrade materials", "chief_gear")}
  `;
  initHero3d("chiefGear3d", {
    mode: "gear",
    focusPart: selectedSlotId,
    tiers: Object.fromEntries(gameData.chief_gear_slots.map((slot) => [slot.slot_id, hero3dRarityHex(state.chief_gear[slot.slot_id]?.current)])),
  });
}

function charmAvatarHtml() {
  return `<div class="chief-avatar-container" id="charms3d">
    <span class="hero3d-hint">Drag to rotate · click a gem to inspect</span>
    <svg class="chief-avatar-silhouette" viewBox="0 0 320 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 22 Q160 58 306 22" stroke="#2cf5f5" stroke-width="2" stroke-dasharray="5 6" opacity="0.55" fill="none"/>
      <!-- infantry hex charm -->
      <g transform="translate(80 46)">
        <line x1="0" y1="-22" x2="0" y2="-16" stroke="#2cf5f5" stroke-width="1.5" opacity="0.7"/>
        <path d="M0 -16 L14 -8 L14 8 L0 16 L-14 8 L-14 -8 Z" fill="#3ce3a7" opacity="0.28" stroke="#3ce3a7" stroke-width="2"/>
        <path d="M0 -9 L8 -4.5 L8 4.5 L0 9 L-8 4.5 L-8 -4.5 Z" fill="#3ce3a7" opacity="0.75"/>
        <path d="M-3 -3 L0 -6 L3 -3" stroke="#eafcff" stroke-width="1.2" opacity="0.9" fill="none"/>
      </g>
      <!-- lancer kite charm -->
      <g transform="translate(160 58)">
        <line x1="0" y1="-28" x2="0" y2="-18" stroke="#2cf5f5" stroke-width="1.5" opacity="0.7"/>
        <path d="M0 -18 L13 0 L0 18 L-13 0 Z" fill="#4fb7ff" opacity="0.28" stroke="#4fb7ff" stroke-width="2"/>
        <path d="M0 -10 L7 0 L0 10 L-7 0 Z" fill="#4fb7ff" opacity="0.8"/>
        <circle cx="0" cy="0" r="2" fill="#eafcff" opacity="0.9"/>
      </g>
      <!-- marksman round charm -->
      <g transform="translate(240 46)">
        <line x1="0" y1="-22" x2="0" y2="-15" stroke="#2cf5f5" stroke-width="1.5" opacity="0.7"/>
        <circle r="15" fill="#ffc35c" opacity="0.26" stroke="#ffc35c" stroke-width="2"/>
        <circle r="8" fill="#ffc35c" opacity="0.8"/>
        <circle cx="-3" cy="-3" r="2" fill="#fff6e3" opacity="0.9"/>
      </g>
      <!-- sparkles -->
      <path d="M40 62 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5 Z" fill="#2cf5f5" opacity="0.6"/>
      <path d="M282 58 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 Z" fill="#2cf5f5" opacity="0.6"/>
      <circle cx="120" cy="20" r="1.5" fill="#2cf5f5" opacity="0.7"/>
      <circle cx="205" cy="24" r="1.5" fill="#2cf5f5" opacity="0.7"/>
    </svg>
  </div>`;
}

const CHARM_TROOP_BY_GEAR = { coat: "infantry", pants: "infantry", hat: "lancer", watch: "lancer", ring: "marksman", cudgel: "marksman" };

function charmGearSlotCardHtml(gearSlotId, gearSlotById, charmSlotsByGear, selectedSocketId) {
  const gearSlot = gearSlotById[gearSlotId];
  const sockets = charmSlotsByGear[gearSlotId] || [];
  if (!gearSlot || !sockets.length) return "";
  const troop = CHARM_TROOP_BY_GEAR[gearSlotId] || "infantry";
  const isActiveCard = sockets.some((slot) => slot.slot_id === selectedSocketId);
  const maxLevel = Math.max(...sockets.map((slot) => Number(state.charms[slot.slot_id]?.current || 0)));
  const chips = sockets
    .map((slot) => {
      const saved = state.charms[slot.slot_id] || { current: 0, target: 0 };
      const socketSelected = Number(saved.target) > Number(saved.current);
      return `<span class="charm-chip ${slot.slot_id === selectedSocketId ? "active" : ""}" data-select-chief-charm-socket-id="${slot.slot_id}">${esc(String(slot.position || "").charAt(0))} ${esc(saved.current)}${socketSelected ? `<b class="gd-gain">➜${esc(saved.target)}</b>` : ""}</span>`;
    })
    .join("");
  return `<div class="chief-gear-slot-card charm-troop-${troop} ${isActiveCard ? "active-card" : ""}" data-select-chief-charm-socket-id="${gearSlotId}_top">
    <div class="chief-gear-slot-card__icon">${iconHtml(charmArtKey(gearSlotId, maxLevel), "Charm gem", "lg")}</div>
    <div class="chief-gear-slot-card__info">
      <strong>${esc(gearSlot.name)}</strong>
      <span class="tier-label">${esc(titleFromId(troop))} charms</span>
      <div class="charm-chip-row">${chips}</div>
    </div>
  </div>`;
}

function charmArtKey(gearSlotId, level) {
  const slot = normalizeKey(gearSlotId);
  const troopClass = ["coat", "pants"].includes(slot)
    ? "infantry"
    : ["hat", "watch"].includes(slot)
      ? "lancer"
      : "marksman";
  const shape = Number(level) >= 10 ? "round" : "hex";
  return `charm${troopClass}${shape}`;
}

function renderCharms() {
  let totalCost = makeCost(CHARM_FIELDS);
  let totalCurrentPower = 0;
  let totalTargetPower = 0;
  let totalStatChanges = {};
  let selectedUpgradeCount = 0;
  const selectedUpgrades = [];
  const levels = [{ charm_level: 0, label: "0", power: 0 }, ...gameData.chief_charm_levels.map((row) => ({ ...row, label: String(row.charm_level) }))];
  const gearSlotById = Object.fromEntries(gameData.chief_gear_slots.map((slot) => [slot.slot_id, slot]));
  const charmSlotsByGear = groupBy(
    gameData.chief_charm_slots.map((slot) => ({ ...slot, gear_slot_id: normalizeKey(slot.gear_slot) })),
    "gear_slot_id",
  );
  const targetOptions = levels.map((level) => [level.charm_level, `Level ${level.label}`]);
  const maxTarget = gameData.chief_charm_levels.at(-1)?.charm_level;

  // Selected Charm Socket
  const selectedSocketId = state.selected_chief_charm_socket_id || "hat_top";
  const selectedSocket = gameData.chief_charm_slots.find(s => s.slot_id === selectedSocketId) || gameData.chief_charm_slots[0];
  const selectedGearSlotId = normalizeKey(selectedSocket.gear_slot);
  const selectedGearSlot = gearSlotById[selectedGearSlotId];
  
  const selectedSaved = state.charms[selectedSocketId] || { current: 0, target: 0 };
  const selectedImpact = powerImpact(levels, selectedSaved.current, selectedSaved.target, "charm_level");
  const selectedStatChanges = chiefCharmAttributeChanges(selectedGearSlotId, selectedSaved.current, selectedSaved.target);
  const selectedPowerChange = {
    label: "Power",
    current: fmt(selectedImpact.currentPower),
    target: fmt(selectedImpact.targetPower),
    delta: signedFmt(selectedImpact.deltaPower),
  };
  const selectedCost = rangeCost(levels, selectedSaved.current, selectedSaved.target, {
    idKey: "charm_level",
    orderKey: "charm_level",
    fields: CHARM_FIELDS,
  });

  // Calculate totals and group cards
  const groupCards = CHIEF_TROOP_GROUPS.map((group) => {
    let groupCost = makeCost(CHARM_FIELDS);
    let groupCurrentPower = 0;
    let groupTargetPower = 0;
    let groupStatChanges = {};
    
    const gearBlocks = group.gearSlots.map((gearSlotId) => {
      const gearSlot = gearSlotById[gearSlotId];
      const sockets = charmSlotsByGear[gearSlotId] || [];
      
      const socketsHtml = sockets.map((slot) => {
        const saved = state.charms[slot.slot_id];
        const isActive = slot.slot_id === selectedSocketId;
        
        // Sum values for group totals
        const impact = powerImpact(levels, saved.current, saved.target, "charm_level");
        const statChanges = chiefCharmAttributeChanges(gearSlotId, saved.current, saved.target);
        const cost = rangeCost(levels, saved.current, saved.target, {
          idKey: "charm_level",
          orderKey: "charm_level",
          fields: CHARM_FIELDS,
        });
        
        totalCost = addCost(totalCost, cost);
        groupCost = addCost(groupCost, cost);
        
        if (!costIsEmpty(cost)) {
          selectedUpgradeCount += 1;
          selectedUpgrades.push({
            kind: "charm",
            scope: "charm",
            label: `${gearSlot?.name || titleFromId(gearSlotId)} ${slot.position}`,
            meta: group.label,
            from: `Lv ${saved.current}`,
            to: `Lv ${saved.target}`,
          });
        }
        
        groupCurrentPower += impact.currentPower;
        groupTargetPower += impact.targetPower;
        totalCurrentPower += impact.currentPower;
        totalTargetPower += impact.targetPower;
        mergeNumericStatChanges(groupStatChanges, statChanges);
        mergeNumericStatChanges(totalStatChanges, statChanges);
        
        const socketSelected = Number(saved.target) > Number(saved.current);
        return `<div class="charm-socket-node ${isActive ? 'active-socket' : ''}" data-select-chief-charm-socket-id="${slot.slot_id}">
          <div class="charm-socket-node__circle">${iconHtml(charmArtKey(gearSlotId, saved.current), "Charm gem", "md")}${socketSelected ? `<span class="gear-up-arrow" aria-hidden="true"></span>` : ""}</div>
          <span class="charm-socket-node__label">Lv. ${esc(saved.current)}${socketSelected ? ` <b class="gd-gain">➜ ${esc(saved.target)}</b>` : ""}</span>
          <span class="charm-socket-node__sub">${esc(slot.position)}</span>
        </div>`;
      }).join("");
      
      return `<div class="charm-gear-piece-card">
        <div class="charm-gear-piece-card__head">
          ${iconHtml(charmArtKey(gearSlotId, 0), "Charm gem", "sm")}
          <strong>${esc(gearSlot?.name || titleFromId(gearSlotId))}</strong>
        </div>
        <div class="charm-sockets-container">
          ${socketsHtml}
        </div>
      </div>`;
    }).join("");
    
    const groupBulk = bulkTargetControls(
      "Group target",
      `bulkCharmTarget_${group.id}`,
      targetOptions,
      [{ action: `charms:${group.id}`, label: `Apply ${group.label}` }],
      maxTarget,
    );
    
    return `<section class="chief-troop-card charms-troops-group-card chief-troop-card--${group.id}">
      <div class="chief-troop-head">
        ${visualLabel("troop", group.label, group.gearSlots.map((slotId) => gearSlotById[slotId]?.name || titleFromId(slotId)).join(" / "))}
        ${groupBulk}
      </div>
      <div class="charms-slots-layout">${gearBlocks}</div>
      ${gameBonusRowsHtml(
        [
          ...Object.values(groupStatChanges).map((change) => ({
            label: change.label,
            current: statDisplay(change.rawCurrent, change.type),
            target: statDisplay(change.rawTarget, change.type),
          })),
          { label: "Power", current: fmt(groupCurrentPower), target: groupTargetPower !== groupCurrentPower ? fmt(groupTargetPower) : null },
        ],
        `${group.label} Bonus`,
      )}
      ${gameCostTilesHtml(groupCost, CHARM_FIELDS, { emptyText: `No ${group.label.toLowerCase()} charm targets selected.` })}
    </section>`;
  }).join("");

  const charmBulk = bulkTargetControls(
    "All charms target",
    "bulkCharmTarget",
    targetOptions,
    [{ action: "charms", label: "Apply all charms" }],
    maxTarget,
  );
  
  const smartPlan = smartRecommendationPlan("charms");

  const selectedCoverage = gameCostCoverage(selectedCost, CHARM_FIELDS);
  const editorHtml = gameDialogHtml({
    title: `${selectedGearSlot?.name || titleFromId(selectedGearSlotId)} — ${selectedSocket.position} Charm`,
    className: "charm-dialog",
    body: `
      <div class="gd-hero-row">
        ${iconHtml(charmArtKey(selectedGearSlotId, selectedSaved.current), "Charm gem", "xl")}
        ${gameLevelFlowHtml(`Lv. ${selectedSaved.current}`, `Lv. ${selectedSaved.target}`)}
      </div>
      <div class="gd-power-row">${iconHtml("power", "Power", "sm")}<strong>${fmt(selectedImpact.currentPower)}</strong><em class="gd-gain">${signedFmt(selectedImpact.deltaPower)}</em></div>
      <div class="gd-select-row">
        <label class="compact-field">
          <span>Current level</span>
          <select data-path="charms.${selectedSocketId}.current">
            ${optionList(levels, "label", "charm_level", selectedSaved.current)}
          </select>
        </label>
        <label class="compact-field">
          <span>Target level</span>
          <select data-path="charms.${selectedSocketId}.target">
            ${optionList(levels, "label", "charm_level", selectedSaved.target)}
          </select>
        </label>
      </div>
      ${gameBonusRowsHtml(
        selectedStatChanges.map((change) => ({ label: change.label, current: change.current, target: change.target })),
        "Stat Bonuses",
      )}
      <section class="gd-section">
        ${gameSectionBannerHtml("Upgrade Cost")}
        ${gameCostTilesHtml(selectedCost, CHARM_FIELDS, { emptyText: "Charm already at target level." })}
      </section>
      <div class="gd-btn-row">
        ${gameButtonHtml(
          !selectedCoverage.hasCost ? "Target Met" : selectedCoverage.covered ? "Upgrade" : "Materials Short",
          !selectedCoverage.hasCost ? "" : selectedCoverage.covered ? "All materials covered" : `${selectedCoverage.shortCount} material${selectedCoverage.shortCount === 1 ? "" : "s"} short — check exchange below`,
          selectedCoverage.covered && selectedCoverage.hasCost ? "blue" : "grey",
          selectedCoverage.covered && selectedCoverage.hasCost,
        )}
      </div>
    `,
  });

  $("#tab-charms").innerHTML = `
    <div class="toolbar"><div><h2>Chief Charms</h2><p>Grouped by the troop type of the gear piece each charm is attached to.</p></div>${charmBulk}</div>
    <div class="chief-gear-layout-container">
      <div class="chief-gear-screen">
        <div class="chief-gear-grid-container">
          <div class="chief-gear-col-left">
            ${charmGearSlotCardHtml("hat", gearSlotById, charmSlotsByGear, selectedSocketId)}
            ${charmGearSlotCardHtml("watch", gearSlotById, charmSlotsByGear, selectedSocketId)}
            ${charmGearSlotCardHtml("coat", gearSlotById, charmSlotsByGear, selectedSocketId)}
          </div>
          ${charmAvatarHtml()}
          <div class="chief-gear-col-right">
            ${charmGearSlotCardHtml("pants", gearSlotById, charmSlotsByGear, selectedSocketId)}
            ${charmGearSlotCardHtml("ring", gearSlotById, charmSlotsByGear, selectedSocketId)}
            ${charmGearSlotCardHtml("cudgel", gearSlotById, charmSlotsByGear, selectedSocketId)}
          </div>
        </div>
      </div>
      <div class="chief-gear-editor-view">
        ${editorHtml}
      </div>
      <div class="chief-troop-grid">
        ${groupCards}
      </div>
    </div>
    
    ${upgradeNutshellHtml({
      module: "Chief Charms",
      selected: upgradeSelectionText(selectedUpgradeCount, "charm target", "charm targets"),
      upgrades: selectedUpgrades,
      impactCards: [
        ...aggregateStatCards(totalStatChanges, "Charm attribute table"),
        statImpactCard("Power", fmt(totalCurrentPower), fmt(totalTargetPower), signedFmt(totalTargetPower - totalCurrentPower), "Exact current-to-target power delta"),
      ],
      details: [`Power ${fmt(totalCurrentPower)} -> ${fmt(totalTargetPower)}`, `Gain ${signedFmt(totalTargetPower - totalCurrentPower)}`],
      cost: totalCost,
      fields: CHARM_FIELDS,
      exchangeKey: "chief_charms",
      empty: "Set charm targets above current levels to see material gaps.",
    })}
    
    ${smartRecommendationPanelHtml("charms", "Chief Charm Targets", smartPlan, "Suggests affordable charm targets with troop-type and stat bias weighting.")}
    ${inventoryComparisonHtml(totalCost, CHARM_FIELDS, "Combined charm upgrade materials", "chief_charms")}
  `;
  const charmGems = {};
  gameData.chief_charm_slots.forEach((slot) => {
    const gearSlotKey = normalizeKey(slot.gear_slot);
    (charmGems[gearSlotKey] ||= {})[String(slot.position || "").toLowerCase()] = Number(state.charms[slot.slot_id]?.current || 0);
  });
  initHero3d("charms3d", {
    mode: "charms",
    focusPart: selectedGearSlotId,
    focusSocket: selectedSocketId,
    gems: charmGems,
    tiers: Object.fromEntries(gameData.chief_gear_slots.map((slot) => [slot.slot_id, hero3dRarityHex(state.chief_gear[slot.slot_id]?.current)])),
  });
}

function petLevelNumber(code) {
  return Number(String(code ?? "0")) || 0;
}

/* Passive Troop ATK/DEF % for a pet at a given level code.
 * Anchors from wostools.net: post_advancement[k] applies right after the k-th
 * advancement; pre_advancement[k] is the value at level (k+1)*10 before advancing.
 * Whole levels interpolate linearly inside their 10-level block. */
function petTroopAdAt(pet, levelCode) {
  const post = pet.troop_ad_post_advancement;
  const pre = pet.troop_ad_pre_advancement;
  if (!Array.isArray(post) || !post.length) return null;
  const level = petLevelNumber(levelCode);
  const isAdvanced = Math.abs(level - Math.round(level)) > 1e-9;
  if (level <= 0) return post[0];
  if (isAdvanced) return post[Math.min(Math.round(level - 0.1) / 10, post.length - 1)] ?? post.at(-1);
  const k = Math.floor((level - 1) / 10);
  const start = post[Math.min(k, post.length - 1)] ?? post.at(-1);
  const end = pre?.[k] ?? start;
  const within = level - k * 10;
  return start + ((end - start) * within) / 10;
}

function petSkillLevelAt(pet, levelCode) {
  const level = petLevelNumber(levelCode);
  const isAdvanced = Math.abs(level - Math.round(level)) > 1e-9;
  // Skill improves with each completed advancement (10.1, 20.1, ...).
  return isAdvanced ? Math.round((level - 0.1) / 10) : Math.max(0, Math.floor((level - (level % 10 === 0 ? 10 : level % 10)) / 10));
}

function petSkillEffectAt(pet, levelCode) {
  const effects = pet.skill_effects || [];
  if (!effects.length) return null;
  const skillLevel = petSkillLevelAt(pet, levelCode);
  if (skillLevel <= 0) return { level: 0, text: "Locked until first advancement" };
  const idx = Math.min(skillLevel, effects.length) - 1;
  return { level: skillLevel, text: effects[idx] };
}

function petQualityIndex(tier) {
  const idx = PET_QUALITY_TIERS.indexOf(String(tier || "None"));
  return idx < 0 ? 0 : idx;
}

function petRefinementCost(pet, fromTier, toTier) {
  const costs = pet.refinement_costs || [];
  const from = petQualityIndex(fromTier);
  const to = petQualityIndex(toTier);
  const total = { common_wild_marks: 0, advanced_wild_marks: 0 };
  for (let i = from; i < to; i += 1) {
    const step = costs[i]; // costs[0] = None->Green etc.
    if (!step) continue;
    total.common_wild_marks += Number(step.common_wild_marks || 0);
    total.advanced_wild_marks += Number(step.advanced_wild_marks || 0);
  }
  return total;
}

function petRarityBadge(pet) {
  const rarity = String(pet.rarity || "");
  if (!rarity) return "";
  return `<span class="pet-rarity-badge pet-rarity-badge--${rarity.toLowerCase()}">${esc(rarity)} · max ${fmt(pet.max_level || 100)}</span>`;
}

function renderPets() {
  const levelsByPet = groupBy(gameData.pet_levels, "pet_id");
  let totalCost = makeCost(PET_FIELDS);
  let totalSvsGain = 0;
  let selectedUpgradeCount = 0;
  let refineCommon = 0;
  let refineAdvanced = 0;
  const selectedUpgrades = [];
  const observedPets = gameData.pets.map((pet) => state.extracted_current?.pets?.[pet.pet_id]).filter(Boolean);
  const observedPower = observedPets.reduce((total, pet) => total + Number(pet.power || 0), 0);
  const aggregateStats = Object.values(observedAggregateStats(observedPets));
  const rates = gameData.svs_point_rates || {};
  const rows = gameData.pets
    .map((pet) => {
      const levels = (levelsByPet[pet.pet_id] || []).map((row, idx) => ({ ...row, order: idx, label: row.level_code }));
      const saved = state.pets[pet.pet_id];
      const observed = state.extracted_current?.pets?.[pet.pet_id] || {};
      const cost = rangeCost(levels, saved.current, saved.target, {
        idKey: "level_code",
        orderKey: "order",
        fields: PET_FIELDS,
      });
      const svsGain = rangeSum(levels, saved.current, saved.target, {
        idKey: "level_code",
        orderKey: "order",
        field: "svs_points",
      });
      totalCost = addCost(totalCost, cost);
      if (!costIsEmpty(cost)) {
        selectedUpgradeCount += 1;
        selectedUpgrades.push({
          kind: "pet",
          scope: "pet",
          label: pet.name,
          meta: observed.power ? `Power ${fmt(observed.power)}` : "",
          from: `Lv ${saved.current}`,
          to: `Lv ${saved.target}`,
        });
      }
      totalSvsGain += svsGain;
      const upgradeSelected = String(saved.current) !== String(saved.target);

      // Passive Troop ATK/DEF percent modelled per 0.1 advancement step.
      const adCurrent = petTroopAdAt(pet, saved.current);
      const adTarget = petTroopAdAt(pet, saved.target);
      const statRows = [];
      if (adCurrent != null) {
        statRows.push({
          label: "Troop ATK/DEF (base)",
          current: `${adCurrent.toFixed(2)}%`,
          target: upgradeSelected && adTarget != null && adTarget !== adCurrent ? `${adTarget.toFixed(2)}%` : null,
        });
      }
      const skillCurrent = petSkillEffectAt(pet, saved.current);
      const skillTarget = petSkillEffectAt(pet, saved.target);
      if (skillCurrent) {
        statRows.push({
          label: `${pet.skill_name || "Skill"} Lv.${skillCurrent.level}`,
          current: skillCurrent.text,
          target: upgradeSelected && skillTarget && skillTarget.level !== skillCurrent.level ? `Lv.${skillTarget.level}: ${skillTarget.text}` : null,
        });
      }
      observedStatEntries(observed).forEach((entry) =>
        statRows.push({ label: `${entry.label} (captured)`, current: entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value) }),
      );

      // Refinement planning (wild marks per quality tier).
      const qualityCurrent = saved.quality_current || "None";
      const qualityTarget = saved.quality_target || qualityCurrent;
      const attempts = Math.max(1, Number(saved.refine_attempts_per_tier || 1));
      const refineCost = petRefinementCost(pet, qualityCurrent, qualityTarget);
      const refineNeedCommon = refineCost.common_wild_marks * attempts;
      const refineNeedAdvanced = refineCost.advanced_wild_marks * attempts;
      refineCommon += refineNeedCommon;
      refineAdvanced += refineNeedAdvanced;
      const refineSvs = refineNeedCommon * Number(rates.common_wild_mark || 1150) + refineNeedAdvanced * Number(rates.advanced_wild_mark || 15000);
      const refineStats = saved.refine_stats || null;
      let refineStatsHtml = "";
      if (refineStats) {
        const cap = Number(refineStats.cap || 0);
        const rows = PET_REFINE_STATS.map(([key, label]) => {
          const val = Number(refineStats[key] || 0);
          const pct = cap > 0 ? Math.min(100, (val / cap) * 100) : 0;
          return `<div class="refine-stat-row"><span class="refine-stat-row__label">${label}</span><div class="refine-stat-row__bar"><span style="width:${pct.toFixed(1)}%"></span></div><span class="refine-stat-row__val">${val.toFixed(2)}% / ${cap.toFixed(2)}%</span></div>`;
        }).join("");
        const avg = PET_REFINE_STATS.reduce((sum, [key]) => sum + Number(refineStats[key] || 0), 0) / PET_REFINE_STATS.length;
        refineStatsHtml = `<div class="refine-stats"><div class="gd-time-row"><span>Captured in game:</span><strong>${cap ? Math.round((avg / cap) * 100) : 0}% of cap filled</strong><span class="muted">avg ${avg.toFixed(2)}% · cap ${cap.toFixed(2)}% per stat</span></div>${rows}</div>`;
      }
      const qualityOptions = PET_QUALITY_TIERS.map((tier) => [tier, tier]);
      const refinementHtml = `
        <section class="gd-section">
          ${gameSectionBannerHtml("Refinement (Wild Marks)")}
          ${refineStatsHtml}
          <div class="gd-select-row">
            <label class="compact-field"><span>Quality now</span>${selectInput(`pets.${pet.pet_id}.quality_current`, qualityCurrent, qualityOptions)}</label>
            <label class="compact-field"><span>Quality target</span>${selectInput(`pets.${pet.pet_id}.quality_target`, qualityTarget, qualityOptions)}</label>
            <label class="compact-field"><span>Attempts/tier</span>${numberInput(`pets.${pet.pet_id}.refine_attempts_per_tier`, attempts, 1)}</label>
          </div>
          ${refineNeedCommon || refineNeedAdvanced
            ? `<div class="gd-time-row"><span>Marks for plan:</span><strong>${refineNeedCommon ? `${fmt(refineNeedCommon)} common` : ""}${refineNeedCommon && refineNeedAdvanced ? " + " : ""}${refineNeedAdvanced ? `${fmt(refineNeedAdvanced)} advanced` : ""}</strong><span class="muted">≈ ${fmt(refineSvs)} SvS pts</span></div>`
            : ""}
        </section>`;

      return `<div class="pet-card">
        <div class="pet-card__head">
          <span class="pet-card__portrait">${iconHtml("pet", pet.name, "xl", "pet")}${upgradeSelected ? `<span class="gear-up-arrow" aria-hidden="true"></span>` : ""}</span>
          <div class="pet-card__title">
            <strong>${esc(pet.name)}</strong>
            ${petRarityBadge(pet)}
            ${observed.power ? `<span class="gd-power-row">${iconHtml("power", "Power", "sm")}<strong>${fmt(observed.power)}</strong></span>` : ""}
          </div>
          ${gameLevelFlowHtml(`Lv. ${saved.current}`, `Lv. ${saved.target}`)}
        </div>
        <div class="gd-select-row">
          <label class="compact-field"><span>Current</span><select data-path="pets.${pet.pet_id}.current">${optionList(levels, "label", "level_code", saved.current)}</select></label>
          <label class="compact-field"><span>Target</span><select data-path="pets.${pet.pet_id}.target">${optionList(levels, "label", "level_code", saved.target)}</select></label>
        </div>
        ${statRows.length ? gameBonusRowsHtml(statRows, "Bonuses & Skill") : ""}
        ${upgradeSelected ? `<div class="gd-time-row"><span>SVS gain:</span><strong class="gd-gain">${signedFmt(svsGain)}</strong></div>` : ""}
        ${gameCostTilesHtml(cost, PET_FIELDS, { emptyText: "No upgrade selected." })}
        ${refinementHtml}
      </div>`;
    })
    .join("");
  const petTargetOptions = [
    ["max", "Max available"],
    ...sortByNumber(
      [...new Set(gameData.pet_levels.map((level) => level.level_code))].map((level_code) => ({ level_code, order: Number(level_code) })),
      "order",
    ).map((level) => [level.level_code, `Level ${level.level_code}`]),
  ];
  const petBulk = bulkTargetControls("Quick target", "bulkPetTarget", petTargetOptions, [{ action: "pets", label: "Apply all pets" }]);
  const smartPlan = smartRecommendationPlan("pets");
  const chestNote = gameData.pet_material_chest?.note || "";
  const refineDetails = [];
  if (refineCommon) refineDetails.push(`${fmt(refineCommon)} common wild marks planned`);
  if (refineAdvanced) refineDetails.push(`${fmt(refineAdvanced)} advanced wild marks planned`);
  $("#tab-pets").innerHTML = `
    <div class="toolbar"><div><h2>Pets</h2><p>Costs, max levels, and SVS points come from the workbook pet table. Passive stats and skill steps per 0.1 advancement are cross-referenced with wostools.net.</p></div>${petBulk}</div>
    ${upgradeNutshellHtml({
      module: "Pets",
      selected: upgradeSelectionText(selectedUpgradeCount, "pet target", "pet targets"),
      upgrades: selectedUpgrades,
      impactCards: [
        statSnapshotCard("Target SVS Gain", signedFmt(totalSvsGain), "Workbook pet table", "Advancement points x 50 SvS each"),
        ...(refineCommon || refineAdvanced
          ? [statSnapshotCard("Refinement Marks", `${fmt(refineCommon)} common · ${fmt(refineAdvanced)} adv.`, "Quality targets on pet cards", "1,150 / 15,000 SvS pts per mark when spent")]
          : []),
        ...aggregateStats
          .slice(0, 5)
          .map((entry) =>
            statSnapshotCard(entry.label, entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value), "Current pet stats", "Captured from the account"),
          ),
      ],
      details: [`Target SVS ${signedFmt(totalSvsGain)}`, `Power read ${fmt(observedPower)}`, ...refineDetails],
      cost: totalCost,
      fields: PET_CHECK_FIELDS,
      exchangeKey: "pet_chests",
      empty: "Set pet targets above current levels to see material gaps.",
    })}
    ${inventoryComparisonHtml(totalCost, PET_CHECK_FIELDS, "Pet materials incl. custom chest coverage", "pet_chests")}
    ${chestNote ? `<p class="gd-note">${esc(chestNote)} Chests are applied to the rarest shortfalls first (serum → potions → manuals).</p>` : ""}
    ${smartRecommendationPanelHtml("pets", "Pet Targets", smartPlan, "Uses available pet materials to maximize workbook SVS gain.")}
    <div class="pet-card-grid">${rows}</div>
    ${petRefinementInfoPanelHtml()}
    ${statImpactPanel("Observed Pet Combat Stats", aggregateStats.map((entry) =>
      statSnapshotCard(entry.label, entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value), "Current read", "Summed from captured pet detail pages"),
    ), "Base Troop ATK/DEF per pet level now uses the wostools.net anchor table; refinement quality multiplies the base passive.")}
  `;
}

function petRefinementInfoPanelHtml() {
  const groups = new Map();
  (gameData.pets || []).forEach((pet) => {
    const costs = pet.refinement_costs || [];
    if (!costs.length) return;
    const key = JSON.stringify(costs.map((step) => [step.tier, step.common_wild_marks || 0, step.advanced_wild_marks || 0]));
    if (!groups.has(key)) groups.set(key, { costs, rarities: new Set(), sort: Number(costs[0]?.common_wild_marks || 0) });
    groups.get(key).rarities.add(String(pet.rarity || "?"));
  });
  const tiers = ["Green", "Blue", "Purple", "Gold"];
  const ladderRows = [...groups.values()]
    .sort((a, b) => a.sort - b.sort)
    .map((group) => {
      const cells = tiers
        .map((tier) => {
          const step = (group.costs || []).find((entry) => String(entry.tier).toLowerCase() === tier.toLowerCase());
          if (!step) return "<td>&ndash;</td>";
          return `<td>${step.advanced_wild_marks ? `${fmt(step.advanced_wild_marks)} advanced` : `${fmt(step.common_wild_marks)} common`}</td>`;
        })
        .join("");
      return `<tr><td>${esc([...group.rarities].join(" / "))}</td>${cells}</tr>`;
    })
    .join("");
  return `<section class="panel refine-info-panel">
    <h2>Refinement (Wild Marks) — Reference</h2>
    <p class="gd-note">Pick a higher quality target on a pet card to plan wild marks. Refinement rolls are RNG — the Attempts/tier field budgets extra rolls per quality tier. The captured bars on each card show every stat's current % against the shared cap at the pet's advancement.</p>
    <div class="table-wrap compact-table"><table>
      <thead><tr><th>Pet rarity</th>${tiers.map((tier) => `<th>${tier} / attempt</th>`).join("")}</tr></thead>
      <tbody>${ladderRows}</tbody>
    </table></div>
    <p class="gd-note">Marks earn SvS points when spent — 1,150 per common, 15,000 per advanced. Best days: Day 3 (Beast Slay) and Day 5 (Power Boost).</p>
  </section>`;
}

function moduleTable(title, totalCost, fields, headers, rows, actions = "") {
  return `
    <div class="toolbar"><div><h2>${esc(title)}</h2><p>Inventory balances are applied on the Overview tab.</p></div>${actions}</div>
    <div class="summary-grid">
      ${fields
        .map((field, idx) => {
          const key = Array.isArray(field) ? field[0] : field;
          const color = ["blue", "amber", "green", "purple"][idx % 4];
          return `<div class="metric ${color}"><span>${visualResourceLabel(key, RESOURCE_LABELS[key] || key)}</span><strong>${fmt(totalCost[key])}</strong></div>`;
        })
        .join("")}
    </div>
    ${inventoryComparisonHtml(totalCost, fields, `${title} materials`)}
    <div class="table-wrap"><table>
      <thead><tr>${headers.map((header) => `<th>${esc(header)}</th>`).join("")}</tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
}

const HERO_ASCENSION_TIER_COSTS = [
  [1, 1, 2, 2, 2, 2],
  [5, 5, 5, 5, 5, 15],
  [15, 15, 15, 15, 15, 40],
  [40, 40, 40, 40, 40, 100],
  [100, 100, 100, 100, 100, 100],
];
const HERO_WIDGET_LEVEL_COSTS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const HERO_EXCLUSIVE_GEAR_NAMES = {
  jeronimo: "Dawnbreak",
  natalia: "Gale Force",
  molly: "Yeti Spirit",
  zinman: "Woodpecker",
  flint: "Dragonbane",
  philly: "Pharmacologica",
  alonso: "Captain Ahab",
  logan: "Fists of Steel",
  mia: "Fate Crystal",
  greg: "State Edict",
  ahmose: "Guardian's Relic",
  reina: "Ninjaken - Raikiri",
  lynn: "Ella's Tear",
  hector: "Steel Fangs",
  norah: "Snow Cruiser",
  gwen: "Wings of Hope",
  wayne: "Power Boomerang",
  renee: "Illusion Magiball",
  edith: "Charm Toolkit",
  bradley: "Thunder Cannon",
  gordon: "Bonecrux Venom",
};

function heroShardsToTarget(currentStars, currentTier, targetStars, targetTier = 0) {
  let total = 0;
  let stars = Math.max(0, Math.min(5, Number(currentStars) || 0));
  let tier = Math.max(0, Math.min(5, Number(currentTier) || 0));
  const toStars = Math.max(0, Math.min(5, Number(targetStars) || 0));
  const toTier = Math.max(0, Math.min(5, Number(targetTier) || 0));
  while (stars < 5 && (stars < toStars || (stars === toStars && tier < toTier))) {
    total += HERO_ASCENSION_TIER_COSTS[stars][tier];
    tier += 1;
    if (tier >= 6) {
      tier = 0;
      stars += 1;
    }
  }
  return total;
}

function heroWidgetsToTarget(currentLevel, targetLevel) {
  const from = Math.max(0, Math.min(10, Number(currentLevel) || 0));
  const to = Math.max(0, Math.min(10, Number(targetLevel) || 0));
  let total = 0;
  for (let level = from + 1; level <= to; level += 1) total += HERO_WIDGET_LEVEL_COSTS[level - 1];
  return total;
}

function renderHeroes() {
  const grouped = groupBy(gameData.heroes, "generation");
  const starPips = (count, tier) => {
    const stars = Math.max(0, Math.min(5, Number(count || 0)));
    const subTier = Math.max(0, Math.min(5, Number(tier || 0)));
    const pips = Array.from({ length: 5 }, (_, i) => `<i class="${i < stars ? "on" : i === stars && subTier > 0 ? "part" : ""}"></i>`).join("");
    const tierLabel = subTier > 0 && stars < 5 ? `<em class="hero-star-tier">T${subTier}</em>` : "";
    return `<span class="hero-stars" aria-label="${stars} stars, tier ${subTier}">${pips}${tierLabel}</span>`;
  };
  let totalShardsNeeded = 0;
  let totalWidgetsNeeded = 0;
  const widgetsByGen = {};
  const shardsByRarity = { mythic: 0, epic: 0, rare: 0 };
  const cards = gameData.heroes
    .map((hero) => {
      const saved = state.heroes[hero.hero_id];
      const observed = state.extracted_current?.heroes?.[hero.hero_id] || {};
      const gearName = HERO_EXCLUSIVE_GEAR_NAMES[hero.hero_id];
      const shardsNeeded = saved.owned
        ? heroShardsToTarget(saved.current_stars, saved.current_star_tier, saved.target_stars, saved.target_star_tier)
        : 0;
      const shardsShort = Math.max(0, shardsNeeded - Number(saved.shards || 0));
      const widgetsNeeded = saved.owned && gearName ? heroWidgetsToTarget(saved.current_widget_level, saved.target_widget_level) : 0;
      if (saved.owned) {
        totalShardsNeeded += shardsNeeded;
        totalWidgetsNeeded += widgetsNeeded;
        if (widgetsNeeded > 0 && hero.generation) {
          widgetsByGen[hero.generation] = (widgetsByGen[hero.generation] || 0) + widgetsNeeded;
        }
        const rarityKey = normalizeKey(hero.rarity || "");
        if (shardsShort > 0 && rarityKey in shardsByRarity) shardsByRarity[rarityKey] += shardsShort;
      }
      const needsRows = [];
      if (shardsNeeded > 0) needsRows.push(`Shards to target: <strong>${fmt(shardsNeeded)}</strong> (${shardsShort > 0 ? `${fmt(shardsShort)} short` : "covered by stock"})`);
      if (widgetsNeeded > 0) needsRows.push(`Widgets to +${esc(saved.target_widget_level)}: <strong>${fmt(widgetsNeeded)}</strong>`);
      return `<div class="hero-roster-card rarity-${normalizeKey(hero.rarity || "rare")} ${saved.owned ? "" : "is-unowned"}">
        <div class="hero-roster-card__portrait">
          ${iconHtml("hero", hero.name, "xl", hero.hero_id)}
          ${hero.generation ? `<span class="hero-gen-badge">S${esc(hero.generation)}</span>` : ""}
          <span class="hero-troop-badge">${iconHtml("troop", hero.troop_type, "sm")}</span>
          ${observed.level ? `<span class="hero-level-badge">Lv. ${esc(observed.level)}</span>` : ""}
        </div>
        <div class="hero-roster-card__body">
          <strong>${esc(hero.name)}</strong>
          <span class="muted">${esc(hero.rarity || "")}${hero.default_role ? ` · ${esc(hero.default_role)}` : ""}</span>
          ${starPips(saved.current_stars, saved.current_star_tier)}
          ${gearName ? `<span class="hero-widget-line muted">${esc(gearName)}${Number(saved.current_widget_level) > 0 ? ` +${esc(saved.current_widget_level)}` : " (locked)"}</span>` : ""}
          <label class="hero-owned-toggle"><input type="checkbox" ${saved.owned ? "checked" : ""} data-path="heroes.${hero.hero_id}.owned" /><span>Owned</span></label>
          <div class="hero-roster-inputs">
            <label><span>Stars</span>${numberInput(`heroes.${hero.hero_id}.current_stars`, saved.current_stars)}</label>
            <label><span>Tier</span>${numberInput(`heroes.${hero.hero_id}.current_star_tier`, saved.current_star_tier || 0)}</label>
            <label><span>Target</span>${numberInput(`heroes.${hero.hero_id}.target_stars`, saved.target_stars)}</label>
            <label><span>T. tier</span>${numberInput(`heroes.${hero.hero_id}.target_star_tier`, saved.target_star_tier || 0)}</label>
            <label><span>Shards</span>${numberInput(`heroes.${hero.hero_id}.shards`, saved.shards || 0)}</label>
            <label><span>Widget</span>${numberInput(`heroes.${hero.hero_id}.current_widget_level`, saved.current_widget_level)}</label>
            <label><span>W. target</span>${numberInput(`heroes.${hero.hero_id}.target_widget_level`, saved.target_widget_level)}</label>
          </div>
          ${needsRows.length ? `<div class="hero-needs">${needsRows.map((row) => `<span>${row}</span>`).join("")}</div>` : ""}
        </div>
      </div>`;
    })
    .join("");
  const generalShards = {
    mythic: availableInventoryValue("mythic_general_shards"),
    epic: availableInventoryValue("epic_general_shards"),
    rare: availableInventoryValue("rare_general_shards"),
  };
  const shardCoverageRows = Object.entries(shardsByRarity)
    .filter(([, needed]) => needed > 0)
    .map(([rarity, needed]) => {
      const have = generalShards[rarity] || 0;
      const short = Math.max(0, needed - have);
      return `<div class="coverage-row ${short ? "is-lacking" : needed ? "is-excess" : "is-none"}">
        <span class="coverage-row__name">${visualResourceLabel(`${rarity}_general_shards`, `${titleFromId(rarity)} general shards`)}</span>
        <span class="coverage-row__value">${fmt(needed)}</span>
        <span class="coverage-row__value">${fmt(have)}</span>
        ${short ? coverageChipHtml("lacking", `&#10007; short ${fmt(short)}`, "After per-hero shard stock") : coverageChipHtml("excess", "&#10003; covered", "General shards cover the remaining gap")}
      </div>`;
    })
    .join("");
  const widgetGenRows = Object.entries(widgetsByGen)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([gen, needed]) => {
      const have = availableInventoryValue(`widgets_gen${gen}`);
      const short = Math.max(0, needed - have);
      return `<div class="coverage-row ${short ? "is-lacking" : "is-excess"}">
        <span class="coverage-row__name">${visualResourceLabel(`widgets_gen${gen}`, `Widgets · Gen ${gen}`)}</span>
        <span class="coverage-row__value">${fmt(needed)}</span>
        <span class="coverage-row__value">${fmt(have)}</span>
        ${short ? coverageChipHtml("lacking", `&#10007; short ${fmt(short)}`, "Buy or save widgets for this generation") : coverageChipHtml("excess", "&#10003; covered", "Backpack widgets cover this generation")}
      </div>`;
    })
    .join("");
  const widgetShardPanel = `
    <div class="inventory-check">
      <div class="inventory-check__head"><span>Shard & widget coverage (backpack)</span><strong>${fmt(totalShardsNeeded)} shards · ${fmt(totalWidgetsNeeded)} widgets</strong></div>
      <div class="coverage-table">
        <div class="coverage-row coverage-row--head"><span>Item</span><span>Required</span><span>You have</span><span>Status</span></div>
        ${shardCoverageRows || ""}
        ${widgetGenRows || ""}
        ${!shardCoverageRows && !widgetGenRows ? `<div class="coverage-row is-none"><span class="coverage-row__name">No shard or widget gaps for current targets</span><span></span><span></span>${coverageChipHtml("none", "&ndash;", "")}</div>` : ""}
      </div>
      <p class="gd-note">Shard gaps assume hero-specific shards first, then general shards of the same rarity. Widgets are tracked per hero generation — edit counts on the Resources page.</p>
    </div>`;
  $("#tab-heroes").innerHTML = `
    <div class="summary-grid">
      <div class="metric blue"><span>Hero rows</span><strong>${fmt(gameData.heroes.length)}</strong></div>
      <div class="metric amber"><span>Shards needed (targets)</span><strong>${fmt(totalShardsNeeded)}</strong></div>
      <div class="metric green"><span>Widgets needed (targets)</span><strong>${fmt(totalWidgetsNeeded)}</strong></div>
      <div class="metric purple"><span>Owned marked</span><strong>${fmt(Object.values(state.heroes).filter((hero) => hero.owned).length)}</strong></div>
    </div>
    ${widgetShardPanel}
    <p class="muted hero-roster-note">Each star has 6 ascension tiers (T1-T6). Shard costs per tier: 0★ 1/1/2/2/2/2 · 1★ 5x5+15 · 2★ 15x5+40 · 3★ 40x5+100 · 4★ 100x6. Exclusive gear widgets per level: 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 (275 total to +10).</p>
    <div class="hero-roster-grid">${cards}</div>
  `;
}

function renderHeroGear() {
  const gearEntries = Object.entries(state.extracted_current?.hero_gear || {});
  const primaryEntries = heroGearPrimaryEntries(gearEntries);
  const primaryIds = new Set(primaryEntries.map((entry) => entry.heroId));
  const trackedHeroes = gearEntries.length;
  const primarySummary = heroGearUpgradeSummary(primaryEntries);
  const primarySetInvestments = heroGearSetInvestmentBreakdown(primaryEntries);
  const set2Investment = primarySetInvestments.set_2?.total || makeCost(HERO_GEAR_FIELDS);
  const set2Labels = (primarySetInvestments.set_2?.sets || []).map((set) => set.setLabel + ": " + fmt(set.investment.hero_gear_xp) + " XP");
  const allSummary = heroGearUpgradeSummary(gearEntries);
  const capturedGearStats = allSummary.capturedStats;
  const gearRows = gearEntries
    .map(([heroId, gearSet]) => {
      const hero = heroRecordFor(heroId);
      const targets = heroGearTargetsFor(heroId);
      const targetCost = heroGearCostToTarget(gearSet, heroId);
      return `<tr>
        <td>${visualLabel("hero", hero.name, hero.rarity + (hero.generation ? " | Gen " + hero.generation : ""))}</td>
        <td>${visualLabel("troop", gearSet.troop_type || hero.troop_type)}</td>
        <td>${heroGearPiecesHtml(gearSet.gear)}</td>
        <td>${heroGearSpecialHtml(gearSet)}</td>
        <td>${heroGearPieceTargetsHtml(heroId, gearSet)}</td>
        <td>${numberInput("hero_gear_targets.heroes." + heroId + ".special_enhancement", targets.specialEnhancement, 0)}</td>
        <td>${costHtml(targetCost, HERO_GEAR_FIELDS)}</td>
      </tr>`;
    })
    .join("");

  const totalCost = allSummary.totalCost;
  const levelBulk = bulkTargetControls(
    "Target mastery level",
    "bulkHeroGearLevel",
    [
      ["16", "Level 16"],
      ["17", "Level 17"],
      ["18", "Level 18"],
      ["19", "Level 19"],
      ["20", "Level 20"],
    ],
    [{ action: "hero-gear-level", label: "Apply to tracked heroes" }],
    commonHeroGearTarget("level", 16),
  );
  const enhancementBulk = bulkTargetControls(
    "Target +",
    "bulkHeroGearEnhancement",
    [
      ["0", "+0"],
      ["60", "+60"],
      ["80", "+80"],
      ["100", "+100"],
    ],
    [{ action: "hero-gear-enhancement", label: "Apply to tracked heroes" }],
    commonHeroGearTarget("enhancement", 0),
  );
  const specialBulk = bulkTargetControls(
    "Target special",
    "bulkHeroSpecialEnhancement",
    [
      ["5", "+5"],
      ["10", "+10"],
      ["15", "+15"],
    ],
    [{ action: "hero-special-enhancement", label: "Apply to tracked heroes" }],
    commonHeroGearTarget("special", 10),
  );
  const reforgeRows = gameData.hero_gear_reforge
    .slice(0, 101)
    .map((row) => `<tr><td>${fmt(row.level)}</td><td class="number">${fmt(row.xp)}</td><td class="number">${fmt(row.total_xp)}</td></tr>`)
    .join("");
  const smartPlan = smartRecommendationPlan("hero_gear");

  // Selected Hero Logic
  const selectedHeroId = state.selected_hero_id || (gearEntries[0] ? gearEntries[0][0] : "edith");
  const portraitsHtml = gearEntries.map(([heroId, gearSet]) => {
    const hero = heroRecordFor(heroId);
    const isActive = heroId === selectedHeroId;
    const isPrimary = primaryIds.has(heroId);
    return `<button class="hero-portrait-btn ${isActive ? 'active-hero' : ''} ${isPrimary ? 'primary-set' : ''}" data-select-hero-id="${heroId}" title="${esc(hero.name)}">
      ${iconHtml("hero", hero.name, "md", heroId)}
    </button>`;
  }).join("");

  const selectedEntry = gearEntries.find(([id]) => id === selectedHeroId) || gearEntries[0];
  let selectedHeroLayoutHtml = "";
  
  if (selectedEntry) {
    const [heroId, gearSet] = selectedEntry;
    const hero = heroRecordFor(heroId);
    const targets = heroGearTargetsFor(heroId);
    const targetCost = heroGearCostToTarget(gearSet, heroId);
    const isPrimary = primaryIds.has(heroId);
    const setLabel = isPrimary ? "Primary Set" : "Secondary Set";
    
    const byPosition = heroGearPiecesByPosition(gearSet.gear || {});
    
    const slotsHtml = HERO_GEAR_POSITION_ORDER.map((position) => {
      const entry = byPosition[position];
      if (!entry) {
        return `<div class="hero-gear-slot-node equipped-slot--empty">
          <span style="font-size:11px;color:#cbd5e1;font-weight:700;">${esc(HERO_GEAR_POSITION_LABELS[position] || position)}</span>
          <div style="font-size:12px;color:#94a3b8;margin-top:6px;">Not Equipped</div>
        </div>`;
      }
      
      const { slot, piece } = entry;
      const label = heroGearPieceName(slot, piece);
      const pieceTargets = heroGearPieceTargetsFor(heroId, slot);
      const pieceCost = heroGearPieceCostToTarget(piece, pieceTargets, slot, hero);
      const currentEnhancement = heroGearCurrentEnhancement(piece);
      
      return `<div class="hero-gear-slot-node border-${chiefGearRarityBorderClass(piece.rarity || 'epic')}">
        <div class="hero-gear-slot-node__head">
          <div class="hero-gear-slot-node__icon">
            ${iconHtml("gear", label, "lg", `equipped ${heroId} ${position}`)}
          </div>
          <div class="hero-gear-slot-node__title">
            <strong>${esc(label)}</strong>
            <span>${esc(HERO_GEAR_POSITION_LABELS[position])}</span>
          </div>
        </div>
        
        <div class="hero-gear-slot-node__values">
          <label>
            <span>Current Lv</span>
            <select data-path="hero_gear_targets.heroes.${heroId}.pieces.${slot}.current_level" disabled>
              <option>Lv ${esc(piece.level || 0)}</option>
            </select>
          </label>
          <label>
            <span>Target Lv</span>
            <select data-path="hero_gear_targets.heroes.${heroId}.pieces.${slot}.target_level">
              ${optionList(gameData.hero_gear_mastery_levels.filter(row => row.scope === 'base'), "level", "level", pieceTargets.targetLevel)}
            </select>
          </label>
          
          <label>
            <span>Current +</span>
            <select disabled>
              <option>+${esc(currentEnhancement)}</option>
            </select>
          </label>
          <label>
            <span>Target +</span>
            <select data-path="hero_gear_targets.heroes.${heroId}.pieces.${slot}.target_enhancement">
              ${optionList(Array.from({ length: 101 }, (_, i) => ({ level: i })), "level", "level", pieceTargets.targetEnhancement)}
            </select>
          </label>
        </div>
        
        <div class="hero-gear-slot-node__cost">
          ${gameCostTilesHtml(pieceCost, HERO_GEAR_FIELDS, { emptyText: "Piece at target." })}
        </div>
      </div>`;
    }).join("");
    
    selectedHeroLayoutHtml = `
      <div class="hero-gear-layout">
        <div class="hero-profile-card">
          <img src="${assetUrl(`assets/game/hero-${heroId}.png`)}" onerror="this.src='assets/game/hero-wu_ming.png'" alt="${esc(hero.name)}" style="width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.1);" />
          <h3>${esc(hero.name)}</h3>
          <p>${esc(gearSet.troop_type || hero.troop_type)}</p>
          <span class="hero-meta-badge">${esc(setLabel)}</span>
          
          <div class="hero-profile-card__footer">
            <section class="gd-section">
              ${gameSectionBannerHtml("Total Cost to Target")}
              ${gameCostTilesHtml(targetCost, HERO_GEAR_FIELDS, { emptyText: "All pieces at target." })}
            </section>
          </div>
        </div>
        <div class="hero-gear-grid-right">
          ${slotsHtml}
        </div>
      </div>
    `;
  }

  $("#tab-hero-gear").innerHTML = `
    <div class="toolbar"><div><h2>Hero Gear</h2><p>Current sets are loaded from the game extract. Mastery Forging and enhancement materials use workbook tables.</p></div></div>
    
    <div class="panel">
      <h2>Visual Hero Equipment Planner</h2>
      <div class="hero-selector-strip">
        ${portraitsHtml}
      </div>
      ${selectedHeroLayoutHtml}
    </div>
    
    ${upgradeNutshellHtml({
      module: "Hero Gear Primary Sets",
      selected: upgradeSelectionText(primarySummary.selectedPieceCount, "primary gear piece target", "primary gear piece targets"),
      upgrades: primarySummary.selectedUpgrades,
      impactCards: primarySummary.impactCards.length
        ? primarySummary.impactCards
        : [
            statSnapshotCard("Primary Gear Power", fmt(primarySummary.totalPower), "Current account", "No target stat breakpoint selected yet"),
            statSnapshotCard("Primary Pieces", fmt(primarySummary.pieceCount), "Current account", "Set piece targets to project mastery and empowerment gains"),
          ],
      details: [
        fmt(primaryEntries.length) + " primary sets",
        fmt(trackedHeroes) + " tracked loadouts total",
        "Primary power " + fmt(primarySummary.totalPower),
        fmt(primarySummary.investedCost.essence_stones) + " stones invested",
        fmt(primarySummary.investedCost.hero_gear_xp) + " XP invested",
        fmt(set2Investment.hero_gear_xp) + " Set 2 XP invested",
        fmt(primarySummary.investedCost.mythic_gear) + " mythic gear invested",
        fmt(primarySummary.investedCost.mithril) + " mithril invested",
        ...set2Labels,
      ],
      cost: primarySummary.totalCost,
      fields: HERO_GEAR_FIELDS,
      empty: "Set hero gear piece targets above current levels or enhancements to see material gaps.",
    })}
    ${smartRecommendationPanelHtml("hero_gear", "Hero Gear Targets", smartPlan, "Optimizes primary interchangeable hero gear sets using mastery stat gains and enhancement breakpoints.")}
    <div class="summary-grid">
      <div class="metric blue"><span>Tracked sets</span><strong>${fmt(trackedHeroes)}</strong></div>
      <div class="metric blue"><span>Gear power read</span><strong>${fmt(allSummary.totalPower)}</strong></div>
      <div class="metric amber"><span>Essence Stones to targets</span><strong>${fmt(totalCost.essence_stones)}</strong></div>
      <div class="metric purple"><span>XP to targets</span><strong>${fmt(totalCost.hero_gear_xp)}</strong></div>
      <div class="metric green"><span>Mythic Gear to targets</span><strong>${fmt(totalCost.mythic_gear)}</strong></div>
      <div class="metric amber"><span>Mithril to targets</span><strong>${fmt(totalCost.mithril)}</strong></div>
    </div>
    ${inventoryComparisonHtml(totalCost, HERO_GEAR_FIELDS, "All tracked hero gear materials")}
    <details class="table-disclosure">
    <summary>Detailed hero gear impact and investment stats</summary>
    ${statImpactPanel("Hero Gear Impact", [
      ...capturedGearStats.map((entry) =>
        statSnapshotCard(entry.label, entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value), "Captured gear details", "Summed from opened equipped gear detail popups"),
      ),
      statSnapshotCard("Current Equipped Gear Power", fmt(allSummary.totalPower), "Captured gear details", "Sum of opened hero gear detail power values"),
      statSnapshotCard("Essence Stones To Targets", fmt(totalCost.essence_stones), "Target inputs", "Uses workbook mastery forging table"),
      statSnapshotCard("Hero Gear XP To Targets", fmt(totalCost.hero_gear_xp), "Target inputs", "Uses workbook enhancement table"),
      statSnapshotCard("Essence Stones Invested", fmt(allSummary.investedCost.essence_stones), "Current gear levels", "Calculated from level 0 to captured mastery levels"),
      statSnapshotCard("Hero Gear XP Invested", fmt(allSummary.investedCost.hero_gear_xp), "Current gear + levels", "Includes normal enhancement XP and eligible empowerment XP"),
      statSnapshotCard("Set 2 Hero Gear XP Invested", fmt(set2Investment.hero_gear_xp), set2Labels.length ? set2Labels.join(" | ") : "No Set 2 loadouts", "Calculated from secondary interchangeable gear sets only"),
      statSnapshotCard("Mythic Gear To Targets", fmt(totalCost.mythic_gear), "Target inputs", "Uses workbook enhancement table"),
      statSnapshotCard("Mithril To Targets", fmt(totalCost.mithril), "Target inputs", "Uses workbook enhancement table"),
      statSnapshotCard("Mythic Gear Invested", fmt(allSummary.investedCost.mythic_gear), "Eligible empowerment", "Calculated from active empowerment material levels"),
      statSnapshotCard("Mithril Invested", fmt(allSummary.investedCost.mithril), "Eligible empowerment", "Calculated from active empowerment material levels"),
    ], "Opened detail popups provide exact current stats; normal + enhancement XP follows the mythic gear guide, while empowerment stats remain gated by mastery level.")}
    </details>
    <div class="panel hero-gear-actions">
      ${levelBulk}
      ${enhancementBulk}
    </div>
    
    <details class="table-disclosure">
      <summary>Full hero gear target table</summary>
      <div class="table-wrap hero-gear-table"><table>
        <thead><tr><th>Hero</th><th>Troop</th><th>Current Gear Set</th><th>Special</th><th>Piece Targets</th><th>Target Special</th><th>Target Materials</th></tr></thead>
        <tbody>${gearRows || `<tr><td colspan="7"><span class="muted">No hero gear extract loaded yet.</span></td></tr>`}</tbody>
      </table></div>
    </details>
    <details class="table-disclosure">
      <summary>Enhancement XP reference</summary>
      <div class="table-wrap"><table>
        <thead><tr><th>Level</th><th class="number">XP</th><th class="number">Total XP</th></tr></thead>
        <tbody>${reforgeRows}</tbody>
      </table></div>
    </details>
  `;
}

function renderExperts() {
  const levelsByExpert = groupBy(gameData.expert_affinity_levels, "expert_id");
  let totalCost = { expert_affinity: 0, common_sigils: 0, books_of_knowledge: 0 };
  let totalLearningXp = 0;
  let selectedUpgradeCount = 0;
  const selectedUpgrades = [];
  const selectedImpactCards = [];
  const aggregate = state.extracted_current?.experts?.aggregate_bonuses || {};
  const activeLearning = state.extracted_current?.experts?.active_learning;
  const aggregateCards = observedStatEntries(aggregate).map((entry) =>
    statSnapshotCard(entry.label, entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value), "Current account aggregate", "Captured from the Experts page"),
  );
  if (activeLearning) {
    aggregateCards.push(
      statSnapshotCard(
        "Active Learning",
        `${activeLearning.expert || "Expert"} · ${activeLearning.skill || "Skill"} Lv. ${activeLearning.skill_level ?? "-"}`,
        activeLearning.effect || "Learning in progress",
        activeLearning.books_required ? `${fmt(activeLearning.books_available)} / ${fmt(activeLearning.books_required)} books` : "",
      ),
    );
  }
  const rows = gameData.experts
    .map((expert) => {
      const levels = levelsByExpert[expert.expert_id] || [];
      const saved = state.experts[expert.expert_id];
      const observed = state.extracted_current?.experts?.[expert.expert_id] || {};
      const impact = expertAffinityImpact(expert.expert_id, saved.relationship_current, saved.relationship_target);
      const cost = rangeCost(levels, saved.relationship_current, saved.relationship_target, {
        idKey: "level_code",
        orderKey: "relationship_level",
        fields: [["expert_affinity", "affinity"], ["common_sigils", "sigils"]],
      });
      const skillPlan = expertSkillPlanner(expert, observed.skills);
      if (skillPlan.books > 0) cost.books_of_knowledge = skillPlan.books;
      if (skillPlan.learningMinutes > 0) cost.learning_speedups_minutes = skillPlan.learningMinutes;
      totalLearningXp += skillPlan.learningXp;
      totalCost = addCost(totalCost, cost);
      if (!costIsEmpty(cost)) {
        selectedUpgradeCount += 1;
        selectedImpactCards.push(...impact.cards);
        selectedUpgrades.push({
          kind: "expert",
          scope: "expert",
          label: expert.name,
          meta: observed.power ? `Power ${fmt(observed.power)}` : "",
          from: saved.relationship_current,
          to: saved.relationship_target,
        });
      }
      const options = levels.map((level) => ({ ...level, label: level.relationship_label ? `${level.level_code} · ${level.relationship_label}` : level.level_code }));
      const upgradeSelected = !costIsEmpty(cost);
      const statRows = impact.changes.map((change) => ({ label: change.label, current: change.current, target: change.target }));
      const currentLabel = levels.find((level) => String(level.level_code) === String(saved.relationship_current));
      const targetLabel = levels.find((level) => String(level.level_code) === String(saved.relationship_target));
      return `<div class="pet-card expert-card">
        <div class="pet-card__head">
          <span class="pet-card__portrait">${iconHtml("expert", expert.name, "xl", "expert")}${upgradeSelected ? `<span class="gear-up-arrow" aria-hidden="true"></span>` : ""}</span>
          <div class="pet-card__title">
            <strong>${esc(expert.name)}</strong>
            ${observed.power ? `<span class="gd-power-row">${iconHtml("power", "Power", "sm")}<strong>${fmt(observed.power)}</strong></span>` : `<span class="muted">${esc(expert.skills.map((skill) => skill.name).join(", "))}</span>`}
          </div>
          ${gameLevelFlowHtml(currentLabel?.relationship_label || saved.relationship_current, targetLabel?.relationship_label || saved.relationship_target)}
        </div>
        <div class="gd-select-row">
          <label class="compact-field"><span>Current</span><select data-path="experts.${expert.expert_id}.relationship_current">${optionList(options, "label", "level_code", saved.relationship_current)}</select></label>
          <label class="compact-field"><span>Target</span><select data-path="experts.${expert.expert_id}.relationship_target">${optionList(options, "label", "level_code", saved.relationship_target)}</select></label>
        </div>
        ${statRows.length ? gameBonusRowsHtml(statRows, "Stat Bonuses") : ""}
        ${skillPlan.html}
        ${gameCostTilesHtml(cost, ["expert_affinity", ["common_sigils", "sigils"], ["books_of_knowledge", "books"], "learning_speedups_minutes"], { emptyText: "No upgrade selected." })}
      </div>`;
    })
    .join("");
  const expertTargetOptions = [
    ["max", "Max available"],
    ...sortByNumber(
      [...new Set(gameData.expert_affinity_levels.map((level) => level.level_code))].map((level_code) => ({ level_code, order: Number(level_code) })),
      "order",
    ).map((level) => [level.level_code, `Level ${level.level_code}`]),
  ];
  const expertBulk = bulkTargetControls("Quick target", "bulkExpertTarget", expertTargetOptions, [{ action: "experts", label: "Apply all experts" }]);
  const smartPlan = smartRecommendationPlan("experts");
  const totalLearningMinutes = Math.ceil(totalLearningXp / expertXpPerMinute());
  if (totalLearningMinutes > 0) totalCost.learning_speedups_minutes = totalLearningMinutes;
  const learningSpeedupsHave = availableInventoryValue("learning_speedups_minutes");
  const learningShort = Math.max(0, totalLearningMinutes - learningSpeedupsHave);
  const learningCard = totalLearningXp > 0
    ? statSnapshotCard(
        "Learning time for skill targets",
        timeFmt(totalLearningMinutes * 60),
        `${fmtCompact(totalLearningXp)} XP at ${fmt(expertXpPerMinute())} XP/min`,
        learningShort > 0
          ? `You hold ${timeFmt(learningSpeedupsHave * 60)} of learning speedups — ${timeFmt(learningShort * 60)} short`
          : `Covered by your ${timeFmt(learningSpeedupsHave * 60)} of learning speedups`,
      )
    : null;
  $("#tab-experts").innerHTML = `
    <div class="toolbar"><div><h2>Experts</h2><p>Affinity and sigil costs are summed from current exclusive to target inclusive. Skill targets add books + Learning XP; XP accrues at ${fmt(expertXpPerMinute())}/min of learning, so speedup hours are shown per skill.</p></div>${expertBulk}</div>
    ${upgradeNutshellHtml({
      module: "Experts",
      selected: upgradeSelectionText(selectedUpgradeCount, "expert target", "expert targets"),
      upgrades: selectedUpgrades,
      impactCards: [learningCard, ...selectedImpactCards].filter(Boolean),
      details: [
        `${fmt(gameData.experts.length)} experts`,
        ...(totalLearningXp > 0
          ? [
              `${fmtCompact(totalLearningXp)} Learning XP ≈ ${timeFmt(totalLearningMinutes * 60)} of learning`,
              learningShort > 0 ? `${timeFmt(learningShort * 60)} of learning speedups still missing` : "Learning speedups cover the plan",
            ]
          : []),
      ],
      cost: totalCost,
      fields: ["expert_affinity", ["common_sigils", "sigils"], ["books_of_knowledge", "books"], "learning_speedups_minutes"],
      empty: "Set expert relationship or skill targets above current levels to see material gaps.",
    })}
    ${smartRecommendationPanelHtml("experts", "Expert Targets", smartPlan, "Suggests affordable expert affinity targets by workbook stat gain, power gain, and material pressure.")}
    <div class="pet-card-grid">${rows}</div>
    ${statImpactPanel("Current Expert Combat Stats", aggregateCards, "Affinity target changes above are exact from the workbook where the source sheet exposes stat columns.")}
  `;
}

function renderResearch() {
  const currentResearch = state.extracted_current?.research || {};
  const academy = currentResearch.war_academy || {};
  let totalCost = makeCost(RESEARCH_COST_FIELDS);
  let selectedCount = 0;
  let totalWarSeconds = 0;
  const researchSpeedupsHave = availableInventoryValue("research_speedups_minutes");
  const selectedUpgrades = [];
  const totalResearchChanges = {};
  const academyBonuses = Object.entries(academy.aggregate_bonuses || {}).map(([key, value]) =>
    statSnapshotCard(titleFromId(key.replaceAll("_", " ")), String(value), "Current War Academy", "Captured from the current account"),
  );
  if (academy.active_research?.current_card) {
    const card = academy.active_research.current_card;
    academyBonuses.push(
      statSnapshotCard(
        "Active War Academy Research",
        academy.active_research.name || "Active research",
        [card.lancer_attack, card.power, card.remaining_time].filter(Boolean).join(" | "),
        academy.active_research.visible_level_marker || "",
      ),
    );
  }

  const activeNormal = currentResearch.active_research || {};
  const normalCurrent = parseResearchCurrentLevel(activeNormal.name);
  const normalNext = normalCurrent ? normalCurrent + 1 : 1;
  const normalState = ensureResearchTarget("regular", "active_research", normalCurrent);
  const normalSelected = Number(normalState.target || 0) > Number(normalState.current || 0);
  const regularRows = activeNormal.name
    ? `<tr>
        <td>${visualLabel("research", activeNormal.name, activeNormal.remaining_time_observed || "Active")}</td>
        <td>${selectInput(
          "research_targets.regular.active_research.current",
          normalState.current,
          researchLevelOptions(normalState.current, normalNext),
        )}</td>
        <td>${selectInput("research_targets.regular.active_research.target", normalState.target, researchLevelOptions(normalState.current, normalNext))}</td>
        <td>${normalSelected ? `<span class="muted">Cost card not captured for this regular research node.</span>` : `<span class="muted">No target selected</span>`}</td>
        <td><span class="muted">Capture the node detail card to add exact Meat/Wood/Coal/Iron/time costs.</span></td>
      </tr>`
    : `<tr><td colspan="5"><span class="muted">No active regular research captured.</span></td></tr>`;
  if (normalSelected) {
    selectedCount += 1;
    selectedUpgrades.push({
      kind: "research",
      scope: "research",
      label: activeNormal.name || "Regular Research",
      meta: "Regular Research",
      from: normalState.current ? `Level ${normalState.current}` : "Current",
      to: `Level ${normalState.target}`,
    });
  }

  const warNodeEntries = Object.entries(academy.visible_nodes || {})
    .filter(([, node]) => !/max|complete|completed/i.test(String(node.status || "")));
  const warNodeCardHtml = ([nodeId, node]) => {
      const progress = parseResearchLevelProgress(node);
      const saved = ensureResearchTarget("war_academy", nodeId, progress.current);
      const target = Number(saved.target || 0);
      const current = Number(saved.current || 0);
      const selected = target > current;
      const maxLevel = warAcademyMaxLevel(nodeId);
      const capturedStep = current === progress.current && target === progress.next;
      const tableRange = selected && maxLevel ? warAcademyRangeCost(nodeId, current, target) : null;
      const cost = tableRange && !costIsEmpty(tableRange.cost)
        ? tableRange.cost
        : selected && capturedStep
          ? researchCostFromNode(node)
          : makeCost(RESEARCH_COST_FIELDS);
      const capturedChanges = selected && capturedStep ? researchImpactChanges(node, true) : [];
      const changes = capturedChanges.length
        ? capturedChanges
        : (tableRange?.changes || []).map((change) => numericStatChange(change.label, 0, change.delta, change.type));
      if (selected) {
        selectedCount += 1;
        totalCost = addCost(totalCost, cost);
        totalWarSeconds += tableRange?.seconds || 0;
        mergeNumericStatChanges(totalResearchChanges, changes);
        selectedUpgrades.push({
          kind: "research",
          scope: "research",
          label: titleFromId(nodeId),
          meta: node.status || "War Academy",
          from: `Level ${current}`,
          to: `Level ${target}`,
        });
      }
      const costNote = selected && costIsEmpty(cost)
        ? node.status === "Active"
          ? "Already active; start cost was spent."
          : "Cost table missing for this node — capture the in-game card to add it."
        : "No target selected";
      const statRows = selected
        ? capturedChanges.length
          ? capturedChanges.map((change) => ({ label: change.label, current: change.current, target: change.target }))
          : (tableRange?.changes || []).map((change) => ({
              label: change.label,
              current: change.type === "percent" ? `+${change.delta.toFixed(2)}%` : `+${fmt(change.delta)}`,
            }))
        : [];
      return `<div class="research-node-card ${selected ? "is-selected" : ""} ${node.status === "Active" ? "is-active" : ""}">
        <div class="research-node-card__head">
          <span class="research-node-card__hex">${iconHtml("research", titleFromId(nodeId), "lg", "research")}</span>
          <div class="pet-card__title">
            <strong>${esc(titleFromId(nodeId))}</strong>
            <span class="muted">${esc(node.status || "Available")}${node.effect ? ` · ${esc(node.effect)}` : ""}</span>
          </div>
          ${gameLevelFlowHtml(`Lv. ${current}`, `Lv. ${target}`)}
        </div>
        <div class="gd-select-row">
          <label class="compact-field"><span>Current</span>${selectInput(`research_targets.war_academy.${nodeId}.current`, saved.current, warAcademyLevelOptions(nodeId, 0, progress.next))}</label>
          <label class="compact-field"><span>Target</span>${selectInput(`research_targets.war_academy.${nodeId}.target`, saved.target, warAcademyLevelOptions(nodeId, saved.current, progress.next))}</label>
        </div>
        ${statRows.length ? gameBonusRowsHtml(statRows, "Research Bonus") : ""}
        ${costIsEmpty(cost) ? `<p class="gd-note">${esc(costNote)}</p>` : `<section class="gd-section">${gameSectionBannerHtml("Research Cost")}${gameCostTilesHtml(cost, RESEARCH_COST_FIELDS)}${tableRange?.seconds ? `<div class="gd-time-row"><span>Research time:</span><strong>${timeFmt(tableRange.seconds)}</strong><span class="muted">≈ ${fmt(tableRange.minutes)} min of research speedups</span></div>` : ""}</section>`}
      </div>`;
  };
  const warTroopKeyOf = (nodeId) => {
    const text = normalizeKey(nodeId);
    if (text.includes("infantry")) return "infantry";
    if (text.includes("lancer")) return "lancer";
    if (text.includes("marksman")) return "marksman";
    return "other";
  };
  const warSections = ["infantry", "lancer", "marksman", "other"]
    .map((troop) => {
      const entries = warNodeEntries.filter(([nodeId]) => warTroopKeyOf(nodeId) === troop);
      if (!entries.length) return "";
      const heading = troop === "other" ? "Other Nodes" : `${titleFromId(troop)} Branch`;
      return `<section class="war-branch">
        <h3 class="war-branch__head">${visualLabel("troop", heading)}</h3>
        <div class="research-node-grid">${entries.map(warNodeCardHtml).join("")}</div>
      </section>`;
    })
    .join("");

  const regularTrees = currentResearch.regular_trees || {};
  const regularNodeIsMax = (node) => node.status === "MAX" || Number(node.level || 0) >= Number(node.max_level || 0);
  const regularTreesHtml = ["growth", "economy", "battle"]
    .map((treeId) => {
      const tree = regularTrees[treeId];
      if (!tree || !Array.isArray(tree.nodes) || !tree.nodes.length) return "";
      const nodes = tree.nodes
        .map((node) => {
          const maxed = regularNodeIsMax(node);
          const pct = maxed ? 100 : Math.round((Number(node.level || 0) / Math.max(1, Number(node.max_level || 1))) * 100);
          const timeTail = node.active && node.next_level_time_observed ? ` · next level in ${esc(node.next_level_time_observed)}` : "";
          return `<div class="regular-node ${maxed ? "is-max" : ""} ${node.active ? "is-active" : ""}" title="Tier ${esc(node.tier ?? "-")}">
            <span class="regular-node__hex">${iconHtml("research", node.base_name || node.name, "lg", "research")}<span class="regular-node__badge ${maxed ? "is-max" : ""}">${maxed ? "MAX" : `${esc(node.level)}/${esc(node.max_level)}`}</span></span>
            <div class="regular-node__body">
              <strong>${esc(node.name)}</strong>
              <div class="regular-node__meter"><i style="width:${pct}%"></i></div>
              <span class="regular-node__level">${maxed ? "MAX" : `Lv. ${esc(node.level)}/${esc(node.max_level)}`}${timeTail}</span>
            </div>
          </div>`;
        })
        .join("");
      const done = tree.nodes.filter(regularNodeIsMax).length;
      return `<section class="regular-tree">
        <div class="regular-tree__head"><h3>${esc(tree.label || titleFromId(treeId))}</h3><span class="muted">${fmt(done)} of ${fmt(tree.nodes.length)} visible nodes maxed</span></div>
        <div class="regular-node-grid">${nodes}</div>
      </section>`;
    })
    .join("");

  const visibleWarCount = Object.values(academy.visible_nodes || {}).filter((node) => !/max|complete|completed/i.test(String(node.status || ""))).length;
  const smartPlan = smartRecommendationPlan("research");
  $("#tab-research").innerHTML = `
    <div class="toolbar"><div><h2>Research And War Academy</h2><p>Only active or available nodes are shown. Targets can plan every remaining level — costs come from the full wostools.net War Academy table. T12 Exalted research has its own page in the sidebar.</p></div></div>
    ${upgradeNutshellHtml({
      module: "Research",
      selected: upgradeSelectionText(selectedCount, "research target", "research targets"),
      upgrades: selectedUpgrades,
      impactCards: [
        ...(totalWarSeconds
          ? [statSnapshotCard(
              "Research time",
              timeFmt(totalWarSeconds),
              "Sum of selected War Academy levels",
              researchSpeedupsHave >= Math.round(totalWarSeconds / 60)
                ? "Covered by research speedups on hand"
                : `Holding ${fmt(researchSpeedupsHave)} min of research speedups`,
            )]
          : []),
        ...aggregateStatCards(totalResearchChanges, "War Academy cost table (wostools.net) + captured cards"),
      ],
      details: [
        `${fmt(visibleWarCount)} T11 nodes visible`,
        ...(totalWarSeconds ? [`${timeFmt(totalWarSeconds)} research time in plan`] : []),
        T12_UNLOCKED ? "T12 unlocked" : "T12 hidden",
      ],
      cost: totalCost,
      fields: RESEARCH_COST_FIELDS,
      empty: "Set regular or War Academy targets above current levels to see resource gaps.",
    })}
    ${smartRecommendationPanelHtml("research", "Research Targets", smartPlan, "Uses only visible War Academy next-step cards with captured cost and stat deltas.")}
    <div class="summary-grid">
      <div class="metric blue"><span>Research Center</span><strong>${esc(currentResearch.research_center?.level ? `Lv ${currentResearch.research_center.level}` : "-")}</strong></div>
      <div class="metric amber"><span>War Academy power</span><strong>${fmt(academy.fire_crystal_tech_power || 0)}</strong></div>
      <div class="metric green"><span>Selected research targets</span><strong>${fmt(selectedCount)}</strong></div>
      <div class="metric purple"><span>Visible T11 nodes</span><strong>${fmt(visibleWarCount)}</strong></div>
    </div>
    ${inventoryComparisonHtml(totalCost, RESEARCH_COST_FIELDS, "Combined research target resources")}
    ${statImpactPanel("Current War Academy Bonuses", academyBonuses, "Live stats captured from the account. Target rows below use only active/available node cards.")}
    <div class="panel">
      <h2>Regular Research · Growth, Economy &amp; Battle</h2>
      ${regularTrees.note ? `<p class="gd-note">${esc(regularTrees.note)}</p>` : ""}
      ${regularTreesHtml || `<span class="muted">Regular research trees not captured yet.</span>`}
      <h3 class="regular-tree__subhead">Active regular research target</h3>
      <div class="table-wrap compact-table"><table>
        <thead><tr><th>Node</th><th>Current level</th><th>Target level</th><th>Expected effect</th><th>Expected cost</th></tr></thead>
        <tbody>${regularRows}</tbody>
      </table></div>
    </div>
    <div class="panel">
      <h2>T11 War Academy Research</h2>
      ${warSections || `<span class="muted">No active or available T11 nodes captured.</span>`}
    </div>
  `;
}

/* ------------------------------------------------------------------ Troops */

function troopTierRows(troopType) {
  return sortByNumber((gameData.troop_tiers || []).filter((row) => row.troop_type === troopType), "tier");
}

function troopTierRecord(troopType, tier) {
  return (gameData.troop_tiers || []).find((row) => row.troop_type === troopType && Number(row.tier) === Number(tier)) || null;
}

const TROOP_POWER_BY_TIER = { 1: 3, 2: 4, 3: 6, 4: 9, 5: 13, 6: 20, 7: 28, 8: 38, 9: 50, 10: 66, 11: 80, 12: 178 };
const TROOP_GOV_BUFFS = {
  none: { label: "None", speed: 0, capacity: 0 },
  vp: { label: "Vice President (+10% Spd)", speed: 10, capacity: 0 },
  svp: { label: "Supreme VP (+15% Spd)", speed: 15, capacity: 0 },
  moe: { label: "Min. of Education (+50% Spd, +200 Cap)", speed: 50, capacity: 200 },
  smoe: { label: "Supreme Min. (+75% Spd, +300 Cap)", speed: 75, capacity: 300 },
};
const TROOP_MOBILIZE_SPEED = 30; // President skill "Mobilize"
const TROOP_CAPACITY_BOOST_PCT = 200; // Training Capacity Boost item

function troopPlanState() {
  state.troop_plan ||= {};
  const plan = state.troop_plan;
  if (plan.speed_pct == null) plan.speed_pct = Number(state.profile?.training_speed_pct || 0);
  if (plan.base_capacity == null) plan.base_capacity = 1581;
  if (plan.gov_buff == null || !TROOP_GOV_BUFFS[plan.gov_buff]) plan.gov_buff = "none";
  if (plan.mobilize == null) plan.mobilize = false;
  if (plan.capacity_boost == null) plan.capacity_boost = false;
  if (!plan.types || typeof plan.types !== "object") {
    // migrate the old single-plan shape
    const legacyTypes = plan.troop_type === "all" || !plan.troop_type ? TROOP_TYPES : [plan.troop_type];
    plan.types = {};
    TROOP_TYPES.forEach((type) => {
      plan.types[type] = {
        enabled: legacyTypes.includes(type),
        mode: plan.mode === "promote" ? "promote" : "train",
        from_tier: Number(plan.from_tier || 10),
        to_tier: Number(plan.to_tier || 11),
        quantity: Number(plan.quantity || 1581),
      };
    });
  }
  TROOP_TYPES.forEach((type) => {
    plan.types[type] ||= { enabled: type === "infantry", mode: "train", from_tier: 10, to_tier: 11, quantity: 1581 };
  });
  return plan;
}

function troopTotalSpeedPct(plan = troopPlanState()) {
  const gov = TROOP_GOV_BUFFS[plan.gov_buff] || TROOP_GOV_BUFFS.none;
  return Math.max(0, Number(plan.speed_pct || 0)) + gov.speed + (plan.mobilize ? TROOP_MOBILIZE_SPEED : 0);
}

function troopEffectiveCapacity(plan = troopPlanState()) {
  const gov = TROOP_GOV_BUFFS[plan.gov_buff] || TROOP_GOV_BUFFS.none;
  const base = Math.max(1, Number(plan.base_capacity || 0)) + gov.capacity;
  return Math.max(1, Math.round(base * (plan.capacity_boost ? 1 + TROOP_CAPACITY_BOOST_PCT / 100 : 1)));
}

function troopPlanComputation(plan = troopPlanState()) {
  const speedDivisor = 1 + troopTotalSpeedPct(plan) / 100;
  const capacity = troopEffectiveCapacity(plan);
  const perType = [];
  for (const type of TROOP_TYPES) {
    const entry = plan.types[type];
    if (!entry?.enabled) continue;
    const quantity = Math.max(0, Number(entry.quantity || 0));
    if (!quantity) continue;
    const promote = entry.mode === "promote";
    const target = troopTierRecord(type, entry.to_tier);
    if (!target) continue;
    const source = promote ? troopTierRecord(type, entry.from_tier) : null;
    if (promote && !source) continue;
    const baseSeconds = Number(target.base_seconds) - (source ? Number(source.base_seconds) : 0);
    const perTroopSeconds = Math.max(0, baseSeconds) / speedDivisor;
    const cost = {
      meat: (Number(target.meat) - (source ? Number(source.meat) : 0)) * quantity,
      wood: (Number(target.wood) - (source ? Number(source.wood) : 0)) * quantity,
      coal: (Number(target.coal) - (source ? Number(source.coal) : 0)) * quantity,
      iron: (Number(target.iron) - (source ? Number(source.iron) : 0)) * quantity,
    };
    const points = (Number(target.svs_points) - (source ? Number(source.svs_points) : 0)) * quantity;
    const power = ((TROOP_POWER_BY_TIER[entry.to_tier] || 0) - (source ? TROOP_POWER_BY_TIER[entry.from_tier] || 0 : 0)) * quantity;
    perType.push({
      type,
      mode: entry.mode,
      fromTier: entry.from_tier,
      toTier: entry.to_tier,
      quantity,
      seconds: perTroopSeconds * quantity,
      perTroopSeconds,
      batches: Math.ceil(quantity / capacity),
      batchSeconds: Math.min(quantity, capacity) * perTroopSeconds,
      cost,
      points,
      power,
    });
  }
  const totals = perType.reduce(
    (acc, entry) => {
      acc.seconds += entry.seconds;
      acc.points += entry.points;
      acc.power += entry.power;
      acc.batches += entry.batches;
      ["meat", "wood", "coal", "iron"].forEach((key) => {
        acc.cost[key] += entry.cost[key];
      });
      return acc;
    },
    { seconds: 0, points: 0, power: 0, batches: 0, cost: { meat: 0, wood: 0, coal: 0, iron: 0 } },
  );
  totals.minutes = totals.seconds / 60;
  totals.speedupPoints = Math.round(totals.minutes * SVS_SPEEDUP_POINTS_PER_MINUTE);
  return { perType, totals, capacity, speedDivisor };
}

function renderTroops() {
  if (!gameData.troop_tiers?.length) {
    $("#tab-troops").innerHTML = `<div class="empty-state"><h2>Troop data missing</h2><p>Rebuild game data from the workbook.</p></div>`;
    return;
  }
  const plan = troopPlanState();
  const { perType, totals, capacity } = troopPlanComputation(plan);
  const totalSpeed = troopTotalSpeedPct(plan);
  const trainingMinutesNeeded = Math.ceil(totals.minutes);
  const trainingSpeedupsHave = availableInventoryValue("training_speedups_minutes");
  const currentCounts = TROOP_TYPES.map((type) => {
    const rows = Object.entries(state.troops || {}).filter(([id]) => id.startsWith(type));
    const total = rows.reduce((sum, [, entry]) => sum + Number(entry.current || 0), 0);
    return { type, total };
  });
  const tierOptions = [...new Set((gameData.troop_tiers || []).map((row) => row.tier))].sort((a, b) => a - b).map((tier) => [tier, `Tier ${tier}`]);
  const costFields = ["meat", "wood", "coal", "iron"];
  const totalCost = makeCost(costFields);
  Object.assign(totalCost, totals.cost);
  const govOptions = Object.entries(TROOP_GOV_BUFFS).map(([value, buff]) => [value, buff.label]);

  const typeRows = TROOP_TYPES.map((type) => {
    const entry = plan.types[type];
    const result = perType.find((row) => row.type === type);
    return `<tr class="${entry.enabled ? "" : "troop-row--off"}">
      <td><label class="svs-toggle troop-enable">${checkboxInput(`troop_plan.types.${type}.enabled`, entry.enabled)}<span>${visualLabel("troop", titleFromId(type))}</span></label></td>
      <td>${selectInput(`troop_plan.types.${type}.mode`, entry.mode, [["train", "Train new"], ["promote", "Promote"]])}</td>
      <td>${entry.mode === "promote" ? selectInput(`troop_plan.types.${type}.from_tier`, entry.from_tier, tierOptions) : `<span class="muted">&ndash;</span>`}</td>
      <td>${selectInput(`troop_plan.types.${type}.to_tier`, entry.to_tier, tierOptions)}</td>
      <td>${numberInput(`troop_plan.types.${type}.quantity`, entry.quantity, 0)}</td>
      <td>${result ? timeFmt(result.seconds) : "&ndash;"}</td>
      <td>${result ? fmt(result.batches) : "&ndash;"}</td>
      <td>${result ? `+${fmt(result.power)}` : "&ndash;"}</td>
      <td>${result ? fmt(result.points) : "&ndash;"}</td>
    </tr>`;
  }).join("");

  const tierTable = TROOP_TYPES.map((type) => {
    const rows = troopTierRows(type)
      .map(
        (row) => `<tr>
          <td>T${esc(row.tier)}</td>
          <td>${fmt(TROOP_POWER_BY_TIER[row.tier] || 0)}</td>
          <td>${fmt(row.svs_points)}</td>
          <td>${Number(row.base_seconds).toFixed(0)}s</td>
          <td>${fmt(row.meat)}</td>
          <td>${fmt(row.wood)}</td>
          <td>${fmt(row.coal)}</td>
          <td>${fmt(row.iron)}</td>
        </tr>`,
      )
      .join("");
    return `<details class="table-disclosure"><summary>${esc(titleFromId(type))} tier data (per troop, base speed)</summary>
      <div class="table-wrap compact-table"><table>
        <thead><tr><th>Tier</th><th>Power</th><th>SvS Pts</th><th>Base Time</th><th>Meat</th><th>Wood</th><th>Coal</th><th>Iron</th></tr></thead>
        <tbody>${rows}</tbody>
      </table></div></details>`;
  }).join("");

  $("#tab-troops").innerHTML = `
    <div class="toolbar"><div><h2>Troop Training & Promotion</h2><p>Workbook troop table with the full government/president buff stack. Promotion costs are the per-tier differences.</p></div></div>
    <div class="summary-grid">
      ${currentCounts
        .map(
          (entry, idx) => `<div class="metric ${["blue", "amber", "green"][idx]}"><span>${esc(titleFromId(entry.type))} on hand</span><strong>${fmt(entry.total)}</strong></div>`,
        )
        .join("")}
      <div class="metric purple"><span>Total speed bonus</span><strong>${fmt(totalSpeed)}%</strong></div>
    </div>
    <div class="panel">
      <h2>Training Speed & Capacity Bonuses</h2>
      <div class="gd-select-row troop-plan-controls">
        <label class="compact-field"><span>Training Speed % (base)</span>${numberInput("troop_plan.speed_pct", plan.speed_pct, 0)}</label>
        <label class="compact-field"><span>Training Capacity (base)</span>${numberInput("troop_plan.base_capacity", plan.base_capacity, 1)}</label>
        <label class="compact-field"><span>Government Buff</span>${selectInput("troop_plan.gov_buff", plan.gov_buff, govOptions)}</label>
        <label class="compact-field svs-toggle"><span>Mobilize (+${TROOP_MOBILIZE_SPEED}% Spd)</span>${checkboxInput("troop_plan.mobilize", plan.mobilize)}</label>
        <label class="compact-field svs-toggle"><span>Capacity Boost (+${TROOP_CAPACITY_BOOST_PCT}%)</span>${checkboxInput("troop_plan.capacity_boost", plan.capacity_boost)}</label>
      </div>
      <div class="summary-grid">
        <div class="metric blue"><span>Total speed bonus</span><strong>${fmt(totalSpeed)}%</strong></div>
        <div class="metric amber"><span>Effective batch capacity</span><strong>${fmt(capacity)}</strong></div>
        <div class="metric green"><span>Speedups held</span><strong>${fmt(trainingSpeedupsHave)} min</strong></div>
        <div class="metric purple"><span>Enter base capacity</span><strong>without minister bonus</strong></div>
      </div>
    </div>
    <div class="panel">
      <h2>Plan Batches Per Troop Type</h2>
      <div class="table-wrap compact-table"><table>
        <thead><tr><th>Type</th><th>Mode</th><th>From</th><th>To / Tier</th><th>Quantity</th><th>Time</th><th>Batches</th><th>Power</th><th>SvS Pts</th></tr></thead>
        <tbody>${typeRows}</tbody>
        <tfoot><tr><th colspan="5">Total</th><th>${timeFmt(totals.seconds)}</th><th>${fmt(totals.batches)}</th><th>+${fmt(totals.power)}</th><th>${fmt(totals.points)}</th></tr></tfoot>
      </table></div>
      <div class="summary-grid">
        <div class="metric blue"><span>Wall-clock time</span><strong>${timeFmt(totals.seconds)}</strong></div>
        <div class="metric amber"><span>Training speedups needed</span><strong>${fmt(trainingMinutesNeeded)} min</strong></div>
        <div class="metric ${trainingSpeedupsHave >= trainingMinutesNeeded ? "green" : "purple"}"><span>Speedups held</span><strong>${fmt(trainingSpeedupsHave)} min ${trainingSpeedupsHave >= trainingMinutesNeeded ? "✓" : `(short ${fmt(Math.max(0, trainingMinutesNeeded - trainingSpeedupsHave))})`}</strong></div>
        <div class="metric green"><span>Total power gain</span><strong>+${fmt(totals.power)}</strong></div>
      </div>
      ${inventoryComparisonHtml(totalCost, costFields, "Troop Batch Resources")}
      <p class="gd-note">SvS points count the troops themselves. Speedups you burn earn their own ${fmt(SVS_SPEEDUP_POINTS_PER_MINUTE)}/min on speedup days and are tracked on the SvS Planner. Batch capacity = (base + government bonus) ${plan.capacity_boost ? `× ${1 + TROOP_CAPACITY_BOOST_PCT / 100}` : "(Capacity Boost off)"}.</p>
    </div>
    <div class="panel">
      <h2>Reference Tables</h2>
      ${tierTable}
    </div>
  `;
}

/* ------------------------------------------------------------------ SvS Planner */

function svsPlanState() {
  state.svs_plan ||= {};
  const plan = state.svs_plan;
  if (plan.valeria_level == null) plan.valeria_level = 0;
  if (plan.lucky_wheel_spins == null) plan.lucky_wheel_spins = 0;
  if (plan.include_speedups == null) plan.include_speedups = true;
  if (plan.include_shards == null) plan.include_shards = true;
  if (plan.include_marks == null) plan.include_marks = true;
  if (plan.beast_hunts == null) plan.beast_hunts = 0;
  if (plan.beast_tier == null) plan.beast_tier = "26_30";
  if (plan.polar_rallies == null) plan.polar_rallies = 0;
  if (plan.gather_meat == null) plan.gather_meat = 0;
  if (plan.gather_wood == null) plan.gather_wood = 0;
  if (plan.gather_coal == null) plan.gather_coal = 0;
  if (plan.gather_iron == null) plan.gather_iron = 0;
  return plan;
}

function svsGearPoints() {
  const gearLevels = sortByNumber(gameData.chief_gear_levels, "sequence").map((row, idx) => ({ ...row, order: idx }));
  return Object.entries(state.chief_gear || {}).reduce((sum, [, saved]) => {
    if (!saved?.current || !saved?.target) return sum;
    return (
      sum +
      rangeSum(gearLevels, saved.current, saved.target, { idKey: "gear_level_code", orderKey: "order", field: "svs_points" })
    );
  }, 0);
}

function svsCharmPoints() {
  const charmLevels = sortByNumber(gameData.chief_charm_levels, "charm_level").map((row) => ({
    ...row,
    level_code: String(row.charm_level),
    order: Number(row.charm_level),
  }));
  return Object.entries(state.charms || {}).reduce((sum, [, saved]) => {
    if (saved?.current == null || saved?.target == null) return sum;
    return (
      sum +
      rangeSum(charmLevels, String(saved.current), String(saved.target), { idKey: "level_code", orderKey: "order", field: "svs_points" })
    );
  }, 0);
}

function svsPetPoints() {
  const levelsByPet = groupBy(gameData.pet_levels, "pet_id");
  return gameData.pets.reduce((sum, pet) => {
    const saved = state.pets[pet.pet_id];
    if (!saved) return sum;
    const levels = (levelsByPet[pet.pet_id] || []).map((row, idx) => ({ ...row, order: idx }));
    return sum + rangeSum(levels, saved.current, saved.target, { idKey: "level_code", orderKey: "order", field: "svs_points" });
  }, 0);
}

function svsPetMarks() {
  return gameData.pets.reduce(
    (acc, pet) => {
      const saved = state.pets[pet.pet_id];
      if (!saved) return acc;
      const attempts = Math.max(1, Number(saved.refine_attempts_per_tier || 1));
      const cost = petRefinementCost(pet, saved.quality_current || "None", saved.quality_target || saved.quality_current || "None");
      acc.common += cost.common_wild_marks * attempts;
      acc.advanced += cost.advanced_wild_marks * attempts;
      return acc;
    },
    { common: 0, advanced: 0 },
  );
}

function svsExpertPlanTotals() {
  let books = 0;
  let learningXp = 0;
  let sigils = 0;
  const levelsByExpert = groupBy(gameData.expert_affinity_levels, "expert_id");
  gameData.experts.forEach((expert) => {
    const saved = state.experts[expert.expert_id];
    if (!saved) return;
    const observed = state.extracted_current?.experts?.[expert.expert_id] || {};
    const skillPlan = expertSkillPlanner(expert, observed.skills);
    books += skillPlan.books;
    learningXp += skillPlan.learningXp;
    const levels = levelsByExpert[expert.expert_id] || [];
    const cost = rangeCost(levels, saved.relationship_current, saved.relationship_target, {
      idKey: "level_code",
      orderKey: "relationship_level",
      fields: [["expert_affinity", "affinity"], ["common_sigils", "sigils"]],
    });
    sigils += Number(cost.common_sigils || 0);
  });
  return { books, learningXp, sigils, learningMinutes: Math.ceil(learningXp / expertXpPerMinute()) };
}

function svsBuildingCrystals() {
  const cost = allBuildingCosts();
  return { fc: Number(cost.fire_crystals || 0), rfc: Number(cost.refined_fire_crystals || 0) };
}

function svsT12Totals() {
  const targets = state.t12_targets || {};
  let shards = 0;
  let minutes = 0;
  (gameData.t12_research_levels || []).forEach((row) => {
    const saved = targets[row.node_id];
    if (!saved) return;
    const current = Number(saved.current || 0);
    const target = Number(saved.target || 0);
    if (Number(row.level) > current && Number(row.level) <= target) {
      shards += Number(row.fire_crystal_shards || 0);
      minutes += Number(row.research_minutes || 0);
    }
  });
  return { shards, minutes };
}

function svsWarAcademyTotals() {
  const targets = state.research_targets?.war_academy || {};
  let shards = 0;
  let minutes = 0;
  Object.entries(targets).forEach(([nodeId, saved]) => {
    if (!saved) return;
    const range = warAcademyRangeCost(nodeId, saved.current, saved.target);
    shards += Number(range.cost.fire_crystal_shards || 0);
    minutes += range.minutes;
  });
  return { shards, minutes };
}

function renderSvs() {
  const plan = svsPlanState();
  const rates = gameData.svs_point_rates || {};
  const valeriaMultiplier = 1 + (Number(rates.valeria_well_prepared_pct_per_level || 2) / 100) * Math.max(0, Math.min(10, Number(plan.valeria_level || 0)));
  const gearPts = svsGearPoints();
  const charmPts = svsCharmPoints();
  const petPts = svsPetPoints();
  const marks = svsPetMarks();
  const expertTotals = svsExpertPlanTotals();
  const crystals = svsBuildingCrystals();
  const t12 = svsT12Totals();
  const wa = svsWarAcademyTotals();
  const troop = troopPlanComputation();
  const heroGearCost = allHeroGearCosts();
  const widgetsPlanned = gameData.heroes.reduce((sum, hero) => {
    const saved = state.heroes[hero.hero_id];
    if (!saved?.owned || !HERO_EXCLUSIVE_GEAR_NAMES[hero.hero_id]) return sum;
    return sum + heroWidgetsToTarget(saved.current_widget_level, saved.target_widget_level);
  }, 0);

  const speedupFields = [
    "construction_speedups_minutes",
    "research_speedups_minutes",
    "training_speedups_minutes",
    "learning_speedups_minutes",
    "general_speedups_minutes",
  ];
  const speedupInventoryMinutes = speedupFields.reduce((sum, key) => sum + availableInventoryValue(key), 0);
  const plannedSpeedupMinutes = t12.minutes + wa.minutes + expertTotals.learningMinutes + Math.round(troop.totals.minutes || 0);
  const burnMinutes = plan.include_speedups ? Math.max(0, speedupInventoryMinutes - plannedSpeedupMinutes) : 0;

  const BEAST_HUNT_POINTS = { "1_10": 9000, "11_15": 9750, "16_20": 10500, "21_25": 11250, "26_30": 12000 };
  const beastTier = BEAST_HUNT_POINTS[plan.beast_tier] ? plan.beast_tier : "26_30";
  const beastPts = Math.max(0, Number(plan.beast_hunts || 0)) * BEAST_HUNT_POINTS[beastTier];
  const polarPts = Math.max(0, Number(plan.polar_rallies || 0)) * 30000;
  const gatherPts = Math.round(
    (Number(plan.gather_meat || 0) / 1000) * Number(rates.gather_meat_per_1000 || 2) +
      (Number(plan.gather_wood || 0) / 1000) * Number(rates.gather_wood_per_1000 || 2) +
      (Number(plan.gather_coal || 0) / 200) * Number(rates.gather_coal_per_200 || 2) +
      (Number(plan.gather_iron || 0) / 50) * Number(rates.gather_iron_per_50 || 2),
  );
  const staminaCans = availableInventoryValue("stamina_cans");

  const shardEntries = plan.include_shards
    ? [
        { label: "Mythic hero shards", qty: availableInventoryValue("mythic_general_shards"), rate: Number(rates.mythic_hero_shard || 3040) },
        { label: "Epic hero shards", qty: availableInventoryValue("epic_general_shards"), rate: Number(rates.epic_hero_shard || 1220) },
        { label: "Rare hero shards", qty: availableInventoryValue("rare_general_shards"), rate: Number(rates.rare_hero_shard || 350) },
      ]
    : [];
  const markEntries = plan.include_marks
    ? [
        { label: "Common wild marks (planned)", qty: marks.common, rate: Number(rates.common_wild_mark || 1150) },
        { label: "Advanced wild marks (planned)", qty: marks.advanced, rate: Number(rates.advanced_wild_mark || 15000) },
      ]
    : [];
  const markPts = markEntries.reduce((sum, entry) => sum + entry.qty * entry.rate, 0);

  const activityRows = [
    { id: "chief_gear", label: "Upgrade Chief Gear (targets)", pts: gearPts, note: `${fmt(rates.chief_gear_per_power || 36)} pts per gear score point`, days: [[5, "high"]] },
    { id: "chief_charms", label: "Upgrade Chief Charms (targets)", pts: charmPts, note: `${fmt(rates.chief_charm_per_power || 70)} pts per charm score point`, days: [[1, "high"], [3, "high"], [4, "high"]] },
    { id: "pets", label: "Pet advancement (targets)", pts: petPts, note: "50 pts per advancement point", days: [[3, "high"], [5, "high"]] },
    ...markEntries.map((entry) => ({
      id: `marks_${entry.label}`,
      label: entry.label,
      pts: entry.qty * entry.rate,
      note: `${fmt(entry.qty)} × ${fmt(entry.rate)}`,
      days: [[3, "high"], [5, "high"]],
    })),
    { id: "fc", label: "Fire Crystals for building (targets)", pts: crystals.fc * Number(rates.fire_crystal || 2000), note: `${fmt(crystals.fc)} FC × ${fmt(rates.fire_crystal || 2000)}`, days: [[1, "high"], [5, "high"], [2, "medium"]] },
    { id: "rfc", label: "Refined FC for building (targets)", pts: crystals.rfc * Number(rates.refined_fire_crystal || 30000), note: `${fmt(crystals.rfc)} RFC × ${fmt(rates.refined_fire_crystal || 30000)}`, days: [[1, "high"], [5, "high"], [2, "medium"]] },
    { id: "t12_shards", label: "FC Shards for T12 research (targets)", pts: t12.shards * Number(rates.fire_crystal_shard_research || 1000), note: `${fmt(t12.shards)} shards × ${fmt(rates.fire_crystal_shard_research || 1000)}`, days: [[1, "high"], [2, "high"], [5, "high"]] },
    { id: "t12_time", label: "Research speedups for T12 plan", pts: Math.round(t12.minutes * SVS_SPEEDUP_POINTS_PER_MINUTE), note: `${timeFmt(t12.minutes * 60)} × ${SVS_SPEEDUP_POINTS_PER_MINUTE}/min`, days: [[1, "high"], [2, "high"], [5, "high"]] },
    { id: "wa_shards", label: "FC Shards for War Academy research (targets)", pts: wa.shards * Number(rates.fire_crystal_shard_research || 1000), note: `${fmt(wa.shards)} shards × ${fmt(rates.fire_crystal_shard_research || 1000)}`, days: [[1, "high"], [2, "high"], [5, "high"]] },
    { id: "wa_time", label: "Research speedups for War Academy plan", pts: Math.round(wa.minutes * SVS_SPEEDUP_POINTS_PER_MINUTE), note: `${timeFmt(wa.minutes * 60)} × ${SVS_SPEEDUP_POINTS_PER_MINUTE}/min`, days: [[1, "high"], [2, "high"], [5, "high"]] },
    { id: "troops", label: "Troop plan (train/promote)", pts: troop.totals.points, note: "Troop points only — planned training speedup minutes are deducted from the burn row", days: [[4, "high"]] },
    { id: "expert_books", label: "Books of Knowledge (skill targets)", pts: expertTotals.books * Number(rates.book_of_knowledge || 60), note: `${fmt(expertTotals.books)} books × ${fmt(rates.book_of_knowledge || 60)}`, days: [[2, "high"], [3, "high"]] },
    { id: "expert_learning", label: "Learning speedups (skill targets)", pts: expertTotals.learningMinutes * SVS_SPEEDUP_POINTS_PER_MINUTE, note: `${timeFmt(expertTotals.learningMinutes * 60)} × ${SVS_SPEEDUP_POINTS_PER_MINUTE}/min`, days: [[5, "high"], [2, "medium"]] },
    { id: "expert_sigils", label: "Expert sigils (affinity targets)", pts: expertTotals.sigils * Number(rates.expert_sigil || 6000), note: `${fmt(expertTotals.sigils)} sigils × ${fmt(rates.expert_sigil || 6000)}`, days: [[2, "high"], [3, "high"]] },
    ...shardEntries.map((entry) => ({
      id: `shards_${entry.label}`,
      label: `${entry.label} (inventory)`,
      pts: entry.qty * entry.rate,
      note: `${fmt(entry.qty)} × ${fmt(entry.rate)}`,
      days: [[2, "high"], [3, "medium"]],
    })),
    { id: "widgets", label: "Widgets for exclusive gear (targets)", pts: widgetsPlanned * Number(rates.widget || 8000), note: `${fmt(widgetsPlanned)} widgets × ${fmt(rates.widget || 8000)}`, days: [[4, "high"], [5, "high"]] },
    { id: "essence", label: "Essence stones for hero gear (targets)", pts: Number(heroGearCost.essence_stones || 0) * Number(rates.essence_stone || 4000), note: `${fmt(heroGearCost.essence_stones || 0)} stones × ${fmt(rates.essence_stone || 4000)}`, days: [[4, "high"], [5, "high"]] },
    { id: "mithril", label: "Mithril for hero gear (targets)", pts: Number(heroGearCost.mithril || 0) * Number(rates.mithril || 144000), note: `${fmt(heroGearCost.mithril || 0)} mithril × ${fmt(rates.mithril || 144000)}`, days: [[4, "high"], [5, "high"]] },
    { id: "beasts", label: "Beast hunts (plan input)", pts: beastPts, note: `${fmt(plan.beast_hunts || 0)} hunts × ${fmt(BEAST_HUNT_POINTS[beastTier])} pts (Lv ${beastTier.replace("_", "-")})`, days: [[3, "high"]] },
    { id: "polar", label: "Polar Terror rallies (plan input)", pts: polarPts, note: `${fmt(plan.polar_rallies || 0)} rallies × 30,000 pts`, days: [[3, "high"]] },
    { id: "gathering", label: "Wilderness gathering (plan input)", pts: gatherPts, note: "2 pts per 1k meat / 1k wood / 200 coal / 50 iron gathered", days: [[2, "high"]] },
    { id: "speedups", label: "Burn remaining speedups (inventory minus planned use)", pts: burnMinutes * SVS_SPEEDUP_POINTS_PER_MINUTE, note: `${fmt(burnMinutes)} min left after ${fmt(plannedSpeedupMinutes)} planned min × ${SVS_SPEEDUP_POINTS_PER_MINUTE}/min`, days: [[5, "high"], [1, "medium"], [2, "medium"]] },
    { id: "wheel", label: "Lucky Wheel spins", pts: Number(plan.lucky_wheel_spins || 0) * Number(rates.lucky_wheel_spin || 8000), note: `${fmt(plan.lucky_wheel_spins)} spins × ${fmt(rates.lucky_wheel_spin || 8000)}`, days: [[2, "high"], [3, "medium"]] },
  ];

  const basePoints = activityRows.reduce((sum, row) => sum + Number(row.pts || 0), 0);
  const boostedPoints = Math.round(basePoints * valeriaMultiplier);

  const DAY_NAMES = { 1: "Day 1", 2: "Day 2", 3: "Day 3", 4: "Day 4", 5: "Day 5" };
  const DAY_FOCUS = { 1: "City Construction", 2: "Research", 3: "Beast Slay", 4: "Hero Development", 5: "Power Boost" };
  const dayChips = (days = []) =>
    days
      .map(([day, tier]) => `<span class="coverage-chip ${tier === "high" ? "coverage-chip--excess" : "coverage-chip--none"}" title="${tier === "high" ? "High" : "Medium"} value on ${DAY_NAMES[day]} · ${DAY_FOCUS[day]}">${DAY_NAMES[day]}</span>`)
      .join(" ");

  const rows = activityRows
    .filter((row) => Number(row.pts || 0) > 0)
    .map(
      (row) => `<tr>
        <td>${esc(row.label)}<br><span class="muted">${esc(row.note)}</span></td>
        <td>${fmt(row.pts)}</td>
        <td>${dayChips(row.days) || "&ndash;"}</td>
      </tr>`,
    )
    .join("");

  const dayTotals = [1, 2, 3, 4, 5].map((day) => ({
    day,
    pts: activityRows.reduce((sum, row) => {
      const primaryDay = (row.days || []).find(([, tier]) => tier === "high")?.[0];
      return sum + (primaryDay === day ? Number(row.pts || 0) : 0);
    }, 0),
  }));

  $("#tab-svs").innerHTML = `
    <div class="toolbar"><div><h2>SvS Prep Planner</h2><p>Projects prep-week points from your selected targets and inventory. Point rates and day mapping follow the wostools.net SvS Prep Phase guide.</p></div></div>
    <div class="summary-grid">
      <div class="metric blue"><span>Projected base points</span><strong>${fmt(basePoints)}</strong></div>
      <div class="metric green"><span>With Valeria ×${valeriaMultiplier.toFixed(2)}</span><strong>${fmt(boostedPoints)}</strong></div>
      <div class="metric amber"><span>Gear + charm points</span><strong>${fmt(gearPts + charmPts)}</strong></div>
      <div class="metric purple"><span>Pets + marks points</span><strong>${fmt(petPts + markPts)}</strong></div>
    </div>
    <div class="panel">
      <h2>Plan inputs</h2>
      <div class="gd-select-row troop-plan-controls">
        <label class="compact-field"><span>Valeria "Well Prepared" level</span>${numberInput("svs_plan.valeria_level", plan.valeria_level, 0, 1)}</label>
        <label class="compact-field"><span>Lucky Wheel spins (Day 2)</span>${numberInput("svs_plan.lucky_wheel_spins", plan.lucky_wheel_spins, 0)}</label>
        <label class="compact-field svs-toggle"><span>Burn all speedups</span>${checkboxInput("svs_plan.include_speedups", plan.include_speedups)}</label>
        <label class="compact-field svs-toggle"><span>Use hero shards</span>${checkboxInput("svs_plan.include_shards", plan.include_shards)}</label>
        <label class="compact-field svs-toggle"><span>Spend wild marks</span>${checkboxInput("svs_plan.include_marks", plan.include_marks)}</label>
      </div>
      <div class="gd-select-row troop-plan-controls">
        <label class="compact-field"><span>Polar Terror rallies (Day 3)</span>${numberInput("svs_plan.polar_rallies", plan.polar_rallies, 0)}</label>
        <label class="compact-field"><span>Beast hunts (Day 3)</span>${numberInput("svs_plan.beast_hunts", plan.beast_hunts, 0)}</label>
        <label class="compact-field"><span>Beast level</span>${selectInput("svs_plan.beast_tier", beastTier, [["1_10", "Lv 1-10 · 9,000 pts"], ["11_15", "Lv 11-15 · 9,750 pts"], ["16_20", "Lv 16-20 · 10,500 pts"], ["21_25", "Lv 21-25 · 11,250 pts"], ["26_30", "Lv 26-30 · 12,000 pts"]])}</label>
      </div>
      <div class="gd-select-row troop-plan-controls">
        <label class="compact-field"><span>Meat gathered (Day 2)</span>${numberInput("svs_plan.gather_meat", plan.gather_meat, 0)}</label>
        <label class="compact-field"><span>Wood gathered (Day 2)</span>${numberInput("svs_plan.gather_wood", plan.gather_wood, 0)}</label>
        <label class="compact-field"><span>Coal gathered (Day 2)</span>${numberInput("svs_plan.gather_coal", plan.gather_coal, 0)}</label>
        <label class="compact-field"><span>Iron gathered (Day 2)</span>${numberInput("svs_plan.gather_iron", plan.gather_iron, 0)}</label>
      </div>
      <p class="gd-note">Chief stamina on hand: ${fmt(staminaCans)} cans ≈ ${fmt(staminaCans * 10)} stamina for beast hunts and Polar Terror rallies.</p>
      <div class="table-wrap compact-table"><table>
        <thead><tr><th>Activity (auto from targets/inventory)</th><th>Points</th><th>Best day</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="3"><span class="muted">No point sources yet — set upgrade targets or add inventory.</span></td></tr>`}</tbody>
        <tfoot><tr><th>Total (base)</th><th>${fmt(basePoints)}</th><th></th></tr><tr><th>Total with Valeria</th><th>${fmt(boostedPoints)}</th><th></th></tr></tfoot>
      </table></div>
      <p class="gd-note">Troop, T12, and War Academy rows follow the plans on their own pages. The burn row deducts the ${fmt(plannedSpeedupMinutes)} speedup minutes already committed to those plans, so nothing is counted twice.</p>
    </div>
    <div class="panel">
      <h2>Projected points by best day</h2>
      <div class="summary-grid">
        ${dayTotals.map(({ day, pts }, idx) => `<div class="metric ${["blue", "green", "amber", "purple", "blue"][idx]}"><span>${DAY_NAMES[day]} · ${DAY_FOCUS[day]}</span><strong>${fmt(pts)}</strong></div>`).join("")}
      </div>
      <p class="gd-note">Each activity is assigned to its first high-value day. Activities with several green days can be shifted between them without losing value.</p>
    </div>
    <div class="panel">
      <h2>Prep day schedule — wostools.net guide</h2>
      <div class="table-wrap compact-table"><table>
        <thead><tr><th>Day</th><th>Focus</th><th>Spend on this day</th></tr></thead>
        <tbody>
          <tr><td>Day 1</td><td>City Construction</td><td>Start FC / Refined FC building upgrades, construction speedups, chief charm score. FC shards + research speedups are also high value today.</td></tr>
          <tr><td>Day 2</td><td>Research</td><td>FC shards, research speedups, Lucky Wheel, hero shards, expert sigils, Books of Knowledge, gathering returns. Start long troop training for Day 4.</td></tr>
          <tr><td>Day 3</td><td>Beast Slay</td><td>Pet advancement + wild marks, chief charm score, beast hunts and Polar Terror rallies, sigils + books.</td></tr>
          <tr><td>Day 4</td><td>Hero Development</td><td>Troop training / promotion finishes, essence stones, widgets, mithril, chief charm score.</td></tr>
          <tr><td>Day 5</td><td>Power Boost</td><td>Pets + wild marks, chief gear score, every speedup type, FC / RFC / FC shards, essence + widgets + mithril.</td></tr>
        </tbody>
      </table></div>
      <p class="gd-note">Valeria's "Well Prepared" (+2%/level) multiplies every prep point scored. Day chips above mark high (green) and medium (grey) value days from the guide.</p>
    </div>
  `;
}

/* ------------------------------------------------------------------ T12 Research */

function t12NodeTargets(nodeId, maxLevel) {
  state.t12_targets ||= {};
  state.t12_targets[nodeId] ||= { current: 0, target: 0 };
  const entry = state.t12_targets[nodeId];
  entry.current = Math.max(0, Math.min(maxLevel, Number(entry.current || 0)));
  entry.target = Math.max(entry.current, Math.min(maxLevel, Number(entry.target || 0)));
  return entry;
}

function renderT12() {
  const rows = gameData.t12_research_levels || [];
  if (!rows.length) {
    $("#tab-t12-research").innerHTML = `<div class="empty-state"><h2>T12 data missing</h2></div>`;
    return;
  }
  const byNode = groupBy(rows, "node_id");
  const fields = T12_RESEARCH_FIELDS;
  let totalCost = makeCost(fields);
  let totalMinutes = 0;
  let totalPower = 0;
  let selectedCount = 0;

  const nodeOrder = {};
  rows.forEach((row, idx) => {
    if (!(row.node_id in nodeOrder)) nodeOrder[row.node_id] = idx;
  });
  const typeSections = TROOP_TYPES.map((type) => {
    const nodes = Object.entries(byNode)
      .filter(([, levels]) => levels[0]?.troop_type === type)
      .sort(([a], [b]) => (nodeOrder[a] ?? 0) - (nodeOrder[b] ?? 0));
    const cards = nodes
      .map(([nodeId, levels]) => {
        const sorted = sortByNumber(levels, "level");
        const maxLevel = Number(sorted.at(-1).level);
        const saved = t12NodeTargets(nodeId, maxLevel);
        const stepRows = sorted.filter((row) => Number(row.level) > saved.current && Number(row.level) <= saved.target);
        const cost = stepRows.reduce((acc, row) => {
          fields.forEach((field) => {
            const key = fieldKey(field);
            acc[key] += Number(row[key] || 0);
          });
          return acc;
        }, makeCost(fields));
        const minutes = stepRows.reduce((sum, row) => sum + Number(row.research_minutes || 0), 0);
        // Power (and stat where present) are CUMULATIVE; costs/minutes are per level.
        const rowAt = (level) => sorted.filter((row) => Number(row.level) <= level).at(-1);
        const currentRow = rowAt(saved.current);
        const targetRow = rowAt(saved.target);
        const statNow = Number(currentRow?.stat_percent || 0);
        const statTarget = Number(targetRow?.stat_percent || statNow);
        const hasStat = sorted.some((row) => row.stat_percent != null);
        const effectText = String(targetRow?.effect || sorted[0]?.effect || "");
        const requirementText = String(sorted[0]?.requirements || "");
        const power = Math.max(0, Number(targetRow?.power || 0) - Number(currentRow?.power || 0));
        if (stepRows.length) {
          selectedCount += 1;
          totalCost = addCost(totalCost, cost);
          totalMinutes += minutes;
          totalPower += power;
        }
        const levelOptions = [[0, "Level 0"], ...sorted.map((row) => [row.level, `Level ${row.level}`])];
        return `<div class="research-node-card ${stepRows.length ? "is-selected" : ""}">
          <div class="research-node-card__head">
            <span class="research-node-card__hex">${iconHtml("research", sorted[0].node_name, "lg", "research")}</span>
            <div class="pet-card__title">
              <strong>${esc(sorted[0].node_name)}</strong>
              <span class="muted">${esc(titleFromId(type))} · ${fmt(maxLevel)} levels${requirementText ? ` · needs ${esc(requirementText)}` : ""}</span>
              ${effectText ? `<span class="muted">${esc(effectText)}</span>` : ""}
            </div>
            ${gameLevelFlowHtml(`Lv. ${saved.current}`, `Lv. ${saved.target}`)}
          </div>
          <div class="gd-select-row">
            <label class="compact-field"><span>Current</span>${selectInput(`t12_targets.${nodeId}.current`, saved.current, levelOptions)}</label>
            <label class="compact-field"><span>Target</span>${selectInput(`t12_targets.${nodeId}.target`, saved.target, levelOptions)}</label>
          </div>
          ${stepRows.length
            ? `${gameBonusRowsHtml(
                [
                  ...(hasStat ? [{ label: "Stat", current: `${statNow.toFixed(1)}%`, target: `${statTarget.toFixed(1)}%` }] : []),
                  ...(effectText ? [{ label: "Per level", current: effectText }] : []),
                  { label: "Research time", current: minutes ? timeFmt(minutes * 60) : "instant" },
                  { label: "Power", current: `+${fmt(power)}` },
                ],
                "Step Impact",
              )}${gameCostTilesHtml(cost, fields)}`
            : `<p class="gd-note">No step selected.</p>`}
        </div>`;
      })
      .join("");
    return `<div class="panel"><h2>${esc(titleFromId(type))} T12 nodes</h2><div class="research-node-grid">${cards}</div></div>`;
  }).join("");

  const totalsCards = (gameData.t12_totals || [])
    .map(
      (row) => `<div class="metric blue"><span>${esc(titleFromId(row.troop_type))} full T12 line</span><strong>${fmt(row.steel)} steel · ${fmt(row.refined_fire_crystals)} RFC · ${fmt(row.fire_crystal_shards)} shards</strong></div>`,
    )
    .join("");
  const researchSpeedupsHave = availableInventoryValue("research_speedups_minutes");
  const shardsPts = Number(totalCost.fire_crystal_shards || 0) * Number(gameData.svs_point_rates?.fire_crystal_shard_research || 1000);
  const timePts = Math.round(totalMinutes * SVS_SPEEDUP_POINTS_PER_MINUTE);

  $("#tab-t12-research").innerHTML = `
    <div class="toolbar"><div><h2>T12 Exalted Research</h2><p>Full verified pipeline (wostools.net cross-check): 5 sequence-gated Exalted unlock tracks per troop type, then Molten I/II/III branches, the gateway skill, and Solar Supremacy. ${T12_UNLOCKED ? "" : "Not unlocked on this account yet — use this page for forward planning."}</p></div></div>
    ${upgradeNutshellHtml({
      module: "T12 Research",
      selected: upgradeSelectionText(selectedCount, "T12 node", "T12 nodes"),
      upgrades: [],
      impactCards: [
        statSnapshotCard("Research time", timeFmt(totalMinutes * 60), "Sum of selected levels", researchSpeedupsHave >= totalMinutes ? "Covered by research speedups" : `Research speedups held: ${fmt(researchSpeedupsHave)} min`),
        statSnapshotCard("Power gain", `+${fmt(totalPower)}`, "Sum of selected levels", ""),
        statSnapshotCard("SvS points", fmt(shardsPts + timePts), "Shards ×1,000 + minutes ×30", ""),
      ],
      details: [`${timeFmt(totalMinutes * 60)} research time`, `+${fmt(totalPower)} power`],
      cost: totalCost,
      fields,
      empty: "Select node targets below to see the full T12 bill of materials.",
    })}
    <div class="summary-grid">${totalsCards}</div>
    ${inventoryComparisonHtml(totalCost, fields, "T12 research materials")}
    ${typeSections}
  `;
}

function renderResources() {
  const grouped = groupBy(gameData.resource_types, "category");
  const gensWithExclusive = [...new Set(
    gameData.heroes
      .filter((hero) => HERO_EXCLUSIVE_GEAR_NAMES[hero.hero_id] && hero.generation)
      .map((hero) => Number(hero.generation)),
  )].sort((a, b) => a - b);
  const widgetGroup = {
    title: "Widgets by Generation",
    note: "Exclusive-gear widgets in your backpack, one pool per hero generation",
    fields: gensWithExclusive.map((gen) => `widgets_gen${gen}`),
  };
  $("#tab-resources").innerHTML = `
    <div class="toolbar"><div><h2>Resources</h2><p>Edit the single current value used by every upgrade calculator. Changes save to the shared database automatically.</p></div></div>
    <div class="inventory-editor">
      ${[...CALCULATOR_INVENTORY_GROUPS, widgetGroup].map(inventoryEditorGroup).join("")}
    </div>
    ${currentProgressEditorHtml()}
    <details class="table-disclosure resource-disclosure">
      <summary>All resource fields</summary>
      <div class="resource-grid">
        ${Object.entries(grouped)
          .map(
            ([category, resources]) => `<section class="resource-group">
              <h3>${esc(resourceCategoryLabel(category))}</h3>
              <div class="resource-fields">
                ${resources
                  .map(
                    (resource) => `<div class="compact-field">
                      <label>${visualResourceLabel(resource.resource_id, resource.name)}</label>
                      ${numberInput(`resources.${resource.resource_id}`, state.resources[resource.resource_id] || 0)}
                      ${resourceFineprintHtml(resource.resource_id, state.resources[resource.resource_id] || 0)}
                    </div>`,
                  )
                  .join("")}
              </div>
            </section>`,
          )
          .join("")}
      </div>
    </details>
    <div class="panel" style="margin-top:14px">
      <h2>Notes</h2>
      <textarea class="notes-box" data-path="custom_notes">${esc(state.custom_notes || "")}</textarea>
    </div>
  `;
}

function renderSources() {
  $("#tab-sources").innerHTML = `
    <div class="grid-2">
      <div class="panel">
        <h2>Source Inventory</h2>
        <ul class="source-list">
          ${gameData.sources
            .map(
              (source) => `<li>
                <a href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(source.label)}</a>
                <div class="muted">${esc(source.notes)}</div>
              </li>`,
            )
            .join("")}
        </ul>
      </div>
      <div class="panel">
        <h2>Workbook Gaps</h2>
        <ul class="gap-list">
          ${gameData.gaps
            .map(
              (gap) => `<li>
                <span class="status-pill ${gap.Priority === "High" ? "gap" : "warn"}">${esc(gap.Priority)}</span>
                <strong>${esc(gap["Gap / validation item"])}</strong>
                <div class="muted">${esc(gap["Why it matters"])}</div>
              </li>`,
            )
            .join("")}
        </ul>
      </div>
    </div>
  `;
}

function focusActiveNutshell() {
  const activePanel = $(`#tab-${activeTab}`);
  const nutshell = activePanel?.querySelector(".upgrade-nutshell");
  if (!nutshell) return;
  requestAnimationFrame(() => {
    const top = Math.max(0, nutshell.getBoundingClientRect().top + window.scrollY - 8);
    window.scrollTo({ top, behavior: "auto" });
  });
}

function renderActive(options = {}) {
  document.body.dataset.activeTab = activeTab;
  renderNav();
  renderProfile();
  const renderers = {
    overview: renderOverview,
    planner: renderPlanner,
    "current-extract": renderCurrentExtract,
    buildings: renderBuildings,
    "chief-gear": renderChiefGear,
    charms: renderCharms,
    heroes: renderHeroes,
    "hero-gear": renderHeroGear,
    pets: renderPets,
    experts: renderExperts,
    research: renderResearch,
    "t12-research": renderT12,
    troops: renderTroops,
    svs: renderSvs,
    resources: renderResources,
    sources: renderSources,
  };
  renderers[activeTab]();
  $$(".tab-panel").forEach((panel) => panel.classList.remove("active"));
  $(`#tab-${activeTab}`).classList.add("active");
  if (options.focusNutshell) focusActiveNutshell();
}

function setAdvisorStatus(message) {
  const status = $("#advisorStatus");
  if (status) status.textContent = message;
}

async function copyAdvisorPayload() {
  const payload = lastPlannerPayload || plannerPayload(plannerCandidates(), plannerCoverage());
  const text = JSON.stringify(payload, null, 2);
  await navigator.clipboard.writeText(text);
  setAdvisorStatus("Payload copied");
}

async function runAdvisor() {
  const output = $("#advisorOutput");
  const payload = lastPlannerPayload || plannerPayload(plannerCandidates(), plannerCoverage());
  setAdvisorStatus("Running advisor");
  try {
    const response = await fetch("/api/advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `Advisor endpoint returned ${response.status}`);
    output.textContent = body.advice || body.output_text || JSON.stringify(body, null, 2);
    setAdvisorStatus("Advisor updated");
  } catch (error) {
    output.textContent = `Advisor endpoint unavailable.\n\n${error.message}\n\nPayload remains available above and can be copied for any LLM.`;
    setAdvisorStatus("Endpoint unavailable");
  }
}

function bindEvents() {
  document.addEventListener("input", (event) => {
    const target = event.target;
    if (!target.matches("input[data-path], textarea[data-path]")) return;
    setPath(state, target.dataset.path, controlValue(target));
    const path = target.dataset.path || "";
    if (path.startsWith("resources.")) {
      const fine = resourceFineprintText(path.slice("resources.".length), target.value);
      if (fine !== null) {
        document.querySelectorAll(`[data-fineprint-for="${path}"]`).forEach((el) => {
          el.textContent = fine;
        });
      }
    }
    scheduleSave();
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (!target.matches("[data-path]")) return;
    setPath(state, target.dataset.path, controlValue(target));
    normalizeTargets(state);
    scheduleSave({ render: true });
  });

  document.addEventListener("click", async (event) => {
    const resetButton = event.target.closest("[data-reset-target]");
    if (resetButton) {
      const changed = resetTargetAction(resetButton.dataset.resetTarget);
      normalizeTargets(state);
      persistState();
      renderActive({ focusNutshell: true });
      $("#saveStatus").textContent = changed ? "Reset selected target" : "Selected target already current";
      return;
    }
    const bulkButton = event.target.closest("[data-bulk-action]");
    if (bulkButton) {
      if (applyBulkTarget(bulkButton.dataset.bulkAction, readBulkValue(bulkButton))) {
        normalizeTargets(state);
        persistState();
        renderActive();
      }
      return;
    }
    const smartButton = event.target.closest("[data-smart-apply]");
    if (smartButton) {
      const applied = applySmartRecommendation(smartButton.dataset.smartApply);
      if (applied) {
        normalizeTargets(state);
        persistState();
        renderActive({ focusNutshell: true });
        $("#saveStatus").textContent = `Applied ${fmt(applied)} smart upgrade steps`;
      }
      return;
    }
    if (event.target.closest("#copyAdvisorPayload")) {
      try {
        await copyAdvisorPayload();
      } catch (error) {
        setAdvisorStatus(`Copy failed: ${error.message}`);
      }
    }

    if (event.target.closest("#runAdvisor")) {
      await runAdvisor();
    }
    const selectBuilding = event.target.closest("[data-select-building-id]");
    if (selectBuilding) {
      state.selected_building_id = selectBuilding.dataset.selectBuildingId;
      renderActive();
      return;
    }
    const selectChiefGear = event.target.closest("[data-select-chief-gear-slot]");
    if (selectChiefGear) {
      state.selected_chief_gear_slot = selectChiefGear.dataset.selectChiefGearSlot;
      renderActive();
      return;
    }
    const selectCharmSocket = event.target.closest("[data-select-chief-charm-socket-id]");
    if (selectCharmSocket) {
      state.selected_chief_charm_socket_id = selectCharmSocket.dataset.selectChiefCharmSocketId;
      renderActive();
      return;
    }
    const selectHero = event.target.closest("[data-select-hero-id]");
    if (selectHero) {
      state.selected_hero_id = selectHero.dataset.selectHeroId;
      renderActive();
      return;
    }
  });

  $("#moduleNav").addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab]");
    if (!button) return;
    activeTab = button.dataset.tab;
    renderActive();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });

  $("#exportState").addEventListener("click", () => {
    persistState();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `whiteout-dashboard-state-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  $("#importState").addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const imported = JSON.parse(await file.text());
    state = stateFromSaved(imported);
    persistState();
    renderActive();
    event.target.value = "";
  });

  $("#cloudSyncKey")?.addEventListener("input", rememberCloudSyncSettings);
  $("#cloudAutoSync")?.addEventListener("change", () => {
    rememberCloudSyncSettings();
    setCloudSyncStatus(cloudAutoSyncEnabled() ? "Cloud auto on" : "Cloud auto off");
  });
  $("#saveCloudState")?.addEventListener("click", async () => {
    try {
      await saveStateToCloud();
    } catch (error) {
      setCloudSyncStatus(`Cloud error: ${error.message}`);
    }
  });
  $("#loadCloudState")?.addEventListener("click", async () => {
    try {
      await loadStateFromCloud();
    } catch (error) {
      // Shared DB unreachable (e.g. running locally without the API):
      // fall back to re-reading the bundled game extract so current values
      // still refresh. Targets are preserved.
      try {
        const fresh = await fetchOptionalJson(`data/current-player-state.json?t=${Date.now()}`);
        if (fresh) {
          extractedState = fresh.extracted_current || fresh;
          state = applyExtractedState(state, extractedState);
          normalizeTargets(state);
          persistState({ cloud: false });
          renderActive({ focusNutshell: true });
          setCloudSyncStatus("Shared DB offline: reloaded local extract");
          return;
        }
      } catch (_) {
        /* fall through to error status */
      }
      setCloudSyncStatus(`Cloud error: ${error.message}`);
    }
  });

  $("#resetTargets").addEventListener("click", () => {
    const changed = resetAllTargetsToCurrent(state);
    normalizeTargets(state);
    persistState();
    renderActive({ focusNutshell: true });
    $("#saveStatus").textContent = changed ? `Reset ${fmt(changed)} targets` : "Targets already current";
  });

  $("#resetState").addEventListener("click", () => {
    if (!confirm("Reset all saved dashboard inputs?")) return;
    state = extractedBaselineState();
    normalizeTargets(state);
    persistState();
    renderActive();
  });
}

async function init() {
  try {
    const [gameResponse, templateResponse, currentState, assetsManifest] = await Promise.all([
      fetch("data/game-data.json"),
      fetch("data/player-state-template.json"),
      fetchOptionalJson("data/current-player-state.json"),
      fetchOptionalJson("assets/game/manifest.json"),
    ]);
    gameData = await gameResponse.json();
    templateState = await templateResponse.json();
    extractedState = currentState;
    if (extractedState && extractedState.extracted_current) {
      extractedState = extractedState.extracted_current;
    }
    visualAssets = assetsManifest || {};
    const savedLocalState = readSavedState();
    const localState = stateFromSaved(savedLocalState);
    state = localState;
    bindEvents();
    initCloudSyncControls();
    await syncInitialStateWithCloud(localState, Boolean(savedLocalState));
    renderActive();
    $("#saveStatus").textContent = state.last_saved ? `Saved ${new Date(state.last_saved).toLocaleTimeString()}` : extractedState ? "Current extract loaded" : "Ready";
  } catch (error) {
    console.error(error);
    document.querySelector(".content-area").innerHTML = $("#errorTemplate").innerHTML;
    $("#saveStatus").textContent = "Data error";
  }
}

init();

/* ------------------------------------------------------ 3D chief model */

const HERO3D = {
  lib: null,
  libPromise: null,
  failed: false,
  renderer: null,
  scene: null,
  camera: null,
  rig: null,
  model: null,
  mixer: null,
  clock: null,
  badges: {},
  gems: {},
  anchors: {},
  bones: {},
  snow: null,
  raf: 0,
  frame: 0,
  hostEl: null,
  mode: "gear",
  focusPart: null,
  focusSocket: null,
  camFrom: null,
  camTo: null,
  lookFrom: null,
  lookTo: null,
  tweenT: 1,
  yaw: 0,
  targetYaw: 0,
  dragging: false,
  dragMoved: 0,
  lastX: 0,
  lastW: 0,
  lastH: 0,
};

const HERO3D_RARITY_HEX = {
  "border-legendary": 0xff7a45,
  "border-epic": 0xb07bff,
  "border-rare": 0x4fb7ff,
  "border-uncommon": 0x3ce3a7,
  "border-common": 0x9aa7b5,
};

function hero3dRarityHex(levelCode) {
  return HERO3D_RARITY_HEX[chiefGearRarityBorderClass(levelCode)] || 0x9aa7b5;
}

const HERO3D_MODEL_URL = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/Soldier.glb";

/* Per-slot config: bone (Mixamo rig), rig-space offset from the bone, icon key,
 * camera direction preset, and the world-space frame box [h, w] the close-up must fit. */
const HERO3D_SLOTS = {
  hat: { bone: "mixamorig:Head", offset: [0, 0.36, 0.02], icon: "chiefgearhat", dir: [0.3, 0.22, 1], frame: [0.95, 0.9], troop: "lancer" },
  watch: { bone: "mixamorig:LeftHand", offset: [-0.2, 0.02, 0.15], icon: "chiefgearwatch", dir: [-0.65, 0.12, 0.95], frame: [0.95, 0.9], troop: "lancer" },
  coat: { bone: "mixamorig:Spine1", offset: [0, 0.06, 0.34], icon: "chiefgearcoat", dir: [0.25, 0.08, 1], frame: [1.2, 1.1], troop: "infantry" },
  pants: { bone: "mixamorig:Hips", offset: [0, -0.15, 0.32], icon: "chiefgearpants", dir: [0.25, -0.02, 1], frame: [1.2, 1.05], troop: "infantry" },
  ring: { bone: "mixamorig:RightHand", offset: [0.2, 0.02, 0.15], icon: "chiefgearring", dir: [0.7, 0.12, 0.95], frame: [0.95, 0.9], troop: "marksman" },
  cudgel: { bone: "mixamorig:Spine2", offset: [0, 0.1, -0.4], icon: "chiefgearcudgel", dir: [0.4, 0.16, -1], frame: [1.2, 1.1], troop: "marksman" },
};

const HERO3D_DEFAULT_ANCHORS = {
  hat: [0, 1.62, 0.06],
  watch: [-0.28, 1.0, 0.14],
  coat: [0, 1.24, 0.2],
  pants: [0, 0.78, 0.18],
  ring: [0.28, 1.0, 0.14],
  cudgel: [0, 1.32, -0.24],
};

const HERO3D_TROOP_COLOR = { infantry: 0x3ce3a7, lancer: 0x4fb7ff, marksman: 0xffc35c };

function hero3dLoadLib() {
  if (HERO3D.lib) return Promise.resolve(HERO3D.lib);
  if (HERO3D.failed) return Promise.reject(new Error("hero3d unavailable"));
  if (!HERO3D.libPromise) {
    let importPromise;
    try {
      importPromise = Promise.all([import("three"), import("three/addons/loaders/GLTFLoader.js")]);
    } catch (error) {
      importPromise = Promise.reject(error);
    }
    HERO3D.libPromise = importPromise
      .then(([T, loaderModule]) => {
        HERO3D.lib = T;
        HERO3D.GLTFLoader = loaderModule.GLTFLoader;
        return T;
      })
      .catch((error) => {
        HERO3D.failed = true;
        HERO3D.libPromise = null;
        throw error;
      });
  }
  return HERO3D.libPromise;
}

function hero3dShowFallback() {
  const host = HERO3D.hostEl;
  if (!host) return;
  const fallback = host.querySelector("svg");
  if (fallback) fallback.style.display = "";
  if (HERO3D.renderer?.domElement?.parentElement === host) HERO3D.renderer.domElement.style.display = "none";
}

function hero3dBadgeTexture(T, iconKey) {
  HERO3D.textures ||= {};
  if (HERO3D.textures[iconKey]) return HERO3D.textures[iconKey];
  const entry = (visualAssets?.assets || visualAssets || {})[iconKey];
  const path = typeof entry === "string" ? entry : entry?.src;
  if (!path) return null;
  const texture = new T.TextureLoader().load(assetUrl(path));
  texture.colorSpace = T.SRGBColorSpace;
  HERO3D.textures[iconKey] = texture;
  return texture;
}

function hero3dMakeBadge(T, iconKey, part, radius = 0.08) {
  const group = new T.Group();
  const backing = new T.Mesh(
    new T.CircleGeometry(radius * 1.06, 28),
    new T.MeshBasicMaterial({ color: 0x0b141d, transparent: true, opacity: 0.82, depthTest: false }),
  );
  backing.renderOrder = 30;
  backing.userData.part = part;
  group.add(backing);
  group.userData.iconKey = iconKey;
  const texture = hero3dBadgeTexture(T, iconKey);
  if (texture) {
    const plate = new T.Mesh(
      new T.CircleGeometry(radius * 0.92, 28),
      new T.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false }),
    );
    plate.position.z = 0.004;
    plate.renderOrder = 31;
    plate.userData.part = part;
    group.add(plate);
    group.userData.hasPlate = true;
  }
  const ring = new T.Mesh(
    new T.TorusGeometry(radius * 1.08, radius * 0.13, 10, 36),
    new T.MeshStandardMaterial({ color: 0x9aa7b5, emissive: 0x9aa7b5, emissiveIntensity: 0.45, roughness: 0.4, metalness: 0.4, transparent: true, depthTest: false }),
  );
  ring.renderOrder = 32;
  ring.userData.part = part;
  group.add(ring);
  group.userData.part = part;
  group.userData.ring = ring;
  group.userData.radius = radius;
  return group;
}

function hero3dBuildScene() {
  if (typeof window !== "undefined") window.__HERO3D = HERO3D;
  const T = HERO3D.lib;
  const scene = new T.Scene();
  const rig = new T.Group();
  scene.add(rig);

  scene.add(new T.HemisphereLight(0xcfe6ff, 0x0a1420, 1.35));
  scene.add(new T.AmbientLight(0x37536e, 0.85));
  const sun = new T.DirectionalLight(0xfff2e0, 2.4);
  sun.position.set(2.5, 4.2, 3.2);
  scene.add(sun);
  const rim = new T.PointLight(0x2cf5f5, 18, 10);
  rim.position.set(-2.2, 1.7, -2.1);
  scene.add(rim);
  const fill = new T.PointLight(0x6fb7ff, 8, 8);
  fill.position.set(1.8, 0.9, 2.4);
  scene.add(fill);

  // ice platform
  const platform = new T.Mesh(
    new T.CylinderGeometry(0.85, 0.95, 0.08, 36),
    new T.MeshStandardMaterial({ color: 0x16344d, roughness: 0.75, metalness: 0.15 }),
  );
  platform.position.set(0, 0.04, 0);
  rig.add(platform);
  const glowRing = new T.Mesh(
    new T.TorusGeometry(0.85, 0.016, 10, 60),
    new T.MeshStandardMaterial({ color: 0x2cf5f5, emissive: 0x2cf5f5, emissiveIntensity: 1.0 }),
  );
  glowRing.rotation.x = Math.PI / 2;
  glowRing.position.y = 0.09;
  rig.add(glowRing);

  // badges (gear icons anchored to body parts)
  Object.entries(HERO3D_SLOTS).forEach(([part, spec]) => {
    const badge = hero3dMakeBadge(T, spec.icon, part, 0.085);
    badge.position.set(...HERO3D_DEFAULT_ANCHORS[part]);
    rig.add(badge);
    HERO3D.badges[part] = badge;
    HERO3D.anchors[part] = [...HERO3D_DEFAULT_ANCHORS[part]];

    // charm gems around the badge (charms mode)
    const troopColor = HERO3D_TROOP_COLOR[spec.troop];
    const gemIcon = `charm${spec.troop}hex`;
    const offsets = { top: [0, 0.18, 0], left: [-0.18, -0.02, 0], right: [0.18, -0.02, 0] };
    HERO3D.gems[part] = {};
    Object.entries(offsets).forEach(([position, offset]) => {
      const gem = hero3dMakeBadge(T, gemIcon, part, 0.055);
      gem.userData.socket = `${part}_${position}`;
      gem.userData.offset = offset;
      gem.userData.ring.material.color.setHex(troopColor);
      gem.userData.ring.material.emissive.setHex(troopColor);
      gem.visible = false;
      rig.add(gem);
      HERO3D.gems[part][position] = gem;
    });
  });

  // snow: two depth layers with per-flake speed and sway
  HERO3D.snowLayers = [];
  [
    { count: 170, size: 0.026, speed: [0.1, 0.24], opacity: 0.9 },
    { count: 120, size: 0.015, speed: [0.05, 0.12], opacity: 0.55 },
  ].forEach((layerSpec) => {
    const positions = new Float32Array(layerSpec.count * 3);
    const speeds = new Float32Array(layerSpec.count);
    const phases = new Float32Array(layerSpec.count);
    for (let i = 0; i < layerSpec.count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 3.6;
      positions[i * 3 + 1] = Math.random() * 2.7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.6;
      speeds[i] = layerSpec.speed[0] + Math.random() * (layerSpec.speed[1] - layerSpec.speed[0]);
      phases[i] = Math.random() * Math.PI * 2;
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.BufferAttribute(positions, 3));
    const points = new T.Points(
      geometry,
      new T.PointsMaterial({ color: 0xdff1ff, size: layerSpec.size, transparent: true, opacity: layerSpec.opacity, depthWrite: false }),
    );
    scene.add(points);
    HERO3D.snowLayers.push({ points, speeds, phases });
  });

  HERO3D.scene = scene;
  HERO3D.rig = rig;
  HERO3D.camera = new T.PerspectiveCamera(38, 1, 0.1, 40);
  HERO3D.camera.position.set(0, 1.35, 3.4);
  HERO3D.clock = new T.Clock();

  // load the character
  const loader = new HERO3D.GLTFLoader();
  loader.load(
    HERO3D_MODEL_URL,
    (gltf) => {
      const model = gltf.scene;
      const T2 = HERO3D.lib;
      model.updateMatrixWorld(true);
      const headTop = model.getObjectByName("mixamorig:HeadTop_End") || model.getObjectByName("mixamorigHeadTop_End");
      let height;
      if (headTop) {
        const probe = new T2.Vector3();
        headTop.getWorldPosition(probe);
        height = Math.max(0.2, probe.y);
      } else {
        const box = new T2.Box3().setFromObject(model);
        height = Math.max(0.2, box.max.y - box.min.y);
      }
      const scale = 1.72 / height;
      model.scale.setScalar(scale);
      model.position.y = 0.08;
      model.traverse((child) => {
        if (child.isMesh) {
          child.frustumCulled = false;
          if (/visor/i.test(child.name || "")) child.visible = false;
          if (child.material) {
            child.material.roughness = Math.min(1, (child.material.roughness ?? 0.8) + 0.15);
            child.material.envMapIntensity = 0.5;
            child.material.color = new T2.Color(0x9fb2c6); // cool the camo toward winter slate
          }
        }
      });
      HERO3D.rig.add(model);
      HERO3D.model = model;
      HERO3D.mixer = new T2.AnimationMixer(model);
      const idle = gltf.animations.find((clip) => /idle/i.test(clip.name)) || gltf.animations[0];
      if (idle) HERO3D.mixer.clipAction(idle).play();
      Object.entries(HERO3D_SLOTS).forEach(([part, spec]) => {
        HERO3D.bones[part] = model.getObjectByName(spec.bone) || model.getObjectByName(spec.bone.replace(":", "")) || null;
      });
      try {
        hero3dBuildOutfit(model);
        HERO3D.mixer.update(0);
        hero3dUpdateOutfit();
      } catch (error) {
        /* outfit is decorative — never block the hero */
      }
      // re-frame the current focus now that the real body is in place
      hero3dSetFocus(HERO3D.mode, HERO3D.focusPart, HERO3D.focusSocket, true);
    },
    undefined,
    () => {
      hero3dShowFallback();
    },
  );
}

const HERO3D_OUTFIT_SPECS = [
  { bone: "mixamorig:Head", kind: "ushanka", offset: [0, 0.125, 0] },
  { bone: "mixamorig:Neck", kind: "collar", offset: [0, 0.035, 0.01] },
  { bone: "mixamorig:Spine1", kind: "coat", offset: [0, 0.05, 0] },
  { bone: "mixamorig:Hips", kind: "skirt", offset: [0, -0.09, 0] },
  { bone: "mixamorig:LeftArm", kind: "shoulderFur", offset: [-0.01, 0.045, 0] },
  { bone: "mixamorig:RightArm", kind: "shoulderFur", offset: [0.01, 0.045, 0] },
  { bone: "mixamorig:LeftHand", kind: "mitten", offset: [0, -0.04, 0.01] },
  { bone: "mixamorig:RightHand", kind: "mitten", offset: [0, -0.04, 0.01] },
  { bone: "mixamorig:LeftLeg", kind: "bootCuff", offset: [0, -0.3, 0.01] },
  { bone: "mixamorig:RightLeg", kind: "bootCuff", offset: [0, -0.3, 0.01] },
  { bone: "mixamorig:LeftFoot", kind: "boot", offset: [0, -0.03, 0.05] },
  { bone: "mixamorig:RightFoot", kind: "boot", offset: [0, -0.03, 0.05] },
];

function hero3dOutfitPiece(T, kind, materials) {
  const { fur, leather, cloth, clothDark, gold } = materials;
  const group = new T.Group();
  if (kind === "ushanka") {
    const band = new T.Mesh(new T.TorusGeometry(0.124, 0.052, 12, 24), fur);
    band.rotation.x = Math.PI / 2;
    band.position.y = -0.035;
    group.add(band);
    const dome = new T.Mesh(new T.SphereGeometry(0.138, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.55), leather);
    dome.scale.y = 0.85;
    dome.position.y = -0.005;
    group.add(dome);
    const badge = new T.Mesh(new T.CircleGeometry(0.027, 16), gold);
    badge.position.set(0, 0.02, 0.131);
    group.add(badge);
    [-1, 1].forEach((side) => {
      const flap = new T.Mesh(new T.BoxGeometry(0.042, 0.1, 0.065), fur);
      flap.position.set(side * 0.122, -0.095, -0.012);
      flap.rotation.z = side * 0.1;
      group.add(flap);
    });
  } else if (kind === "collar") {
    const collar = new T.Mesh(new T.TorusGeometry(0.145, 0.062, 12, 24), fur);
    collar.rotation.x = Math.PI / 2;
    group.add(collar);
  } else if (kind === "coat") {
    const body = new T.Mesh(new T.CylinderGeometry(0.2, 0.215, 0.42, 20, 1, true), cloth);
    group.add(body);
    const placket = new T.Mesh(new T.BoxGeometry(0.036, 0.4, 0.014), clothDark);
    placket.position.set(0, 0, 0.208);
    group.add(placket);
    [0.12, 0.02, -0.08].forEach((y) => {
      const button = new T.Mesh(new T.SphereGeometry(0.013, 10, 8), gold);
      button.position.set(0.035, y, 0.215);
      group.add(button);
    });
    const belt = new T.Mesh(new T.TorusGeometry(0.212, 0.024, 10, 24), clothDark);
    belt.rotation.x = Math.PI / 2;
    belt.position.y = -0.17;
    group.add(belt);
    const buckle = new T.Mesh(new T.BoxGeometry(0.055, 0.042, 0.015), gold);
    buckle.position.set(0, -0.17, 0.222);
    group.add(buckle);
  } else if (kind === "skirt") {
    const skirt = new T.Mesh(new T.CylinderGeometry(0.215, 0.27, 0.3, 20, 1, true), cloth);
    group.add(skirt);
    const hem = new T.Mesh(new T.TorusGeometry(0.265, 0.026, 10, 26), fur);
    hem.rotation.x = Math.PI / 2;
    hem.position.y = -0.15;
    group.add(hem);
  } else if (kind === "shoulderFur") {
    const pad = new T.Mesh(new T.SphereGeometry(0.08, 14, 10), fur);
    pad.scale.set(1.18, 0.6, 1.18);
    group.add(pad);
  } else if (kind === "mitten") {
    const mitt = new T.Mesh(new T.SphereGeometry(0.068, 14, 10), leather);
    mitt.scale.set(1, 0.85, 1.2);
    group.add(mitt);
    const cuff = new T.Mesh(new T.TorusGeometry(0.062, 0.026, 10, 18), fur);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.y = 0.05;
    group.add(cuff);
  } else if (kind === "bootCuff") {
    const cuff = new T.Mesh(new T.TorusGeometry(0.073, 0.034, 10, 18), fur);
    cuff.rotation.x = Math.PI / 2;
    group.add(cuff);
  } else if (kind === "boot") {
    const boot = new T.Mesh(new T.SphereGeometry(0.085, 14, 10), leather);
    boot.scale.set(0.95, 0.62, 1.55);
    group.add(boot);
  }
  return group;
}

function hero3dBuildOutfit(model) {
  const T = HERO3D.lib;
  const materials = {
    fur: new T.MeshStandardMaterial({ color: 0xe9eff5, roughness: 0.95, metalness: 0.02 }),
    leather: new T.MeshStandardMaterial({ color: 0x5d4030, roughness: 0.8, metalness: 0.05 }),
    cloth: new T.MeshStandardMaterial({ color: 0x2f4157, roughness: 0.85, metalness: 0.05, side: T.DoubleSide }),
    clothDark: new T.MeshStandardMaterial({ color: 0x22303f, roughness: 0.85, metalness: 0.05 }),
    gold: new T.MeshStandardMaterial({ color: 0xffd257, roughness: 0.35, metalness: 0.6 }),
  };
  HERO3D.outfit = [];
  HERO3D_OUTFIT_SPECS.forEach((spec) => {
    const bone = model.getObjectByName(spec.bone) || model.getObjectByName(spec.bone.replace(":", ""));
    if (!bone) return;
    const piece = hero3dOutfitPiece(T, spec.kind, materials);
    HERO3D.rig.add(piece);
    HERO3D.outfit.push({ piece, bone, offset: new T.Vector3(...spec.offset), kind: spec.kind });
  });
}

function hero3dUpdateOutfit() {
  if (!HERO3D.outfit?.length) return;
  const T = HERO3D.lib;
  const pos = (HERO3D.__oPos ||= new T.Vector3());
  HERO3D.outfit.forEach((item) => {
    item.bone.getWorldPosition(pos);
    HERO3D.rig.worldToLocal(pos);
    item.piece.position.copy(pos).add(item.offset);
  });
}

function hero3dEnsureBadgePlates() {
  const T = HERO3D.lib;
  if (!T) return;
  const ensure = (badge) => {
    if (!badge || badge.userData.hasPlate || !badge.userData.iconKey) return;
    const texture = hero3dBadgeTexture(T, badge.userData.iconKey);
    if (!texture) return;
    const radius = badge.userData.radius || 0.085;
    const plate = new T.Mesh(new T.CircleGeometry(radius * 0.92, 28), new T.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false }));
    plate.position.z = 0.004;
    plate.renderOrder = 31;
    plate.userData.part = badge.userData.part;
    if (badge.userData.socket) plate.userData.socket = badge.userData.socket;
    badge.add(plate);
    badge.userData.hasPlate = true;
  };
  Object.values(HERO3D.badges).forEach(ensure);
  Object.values(HERO3D.gems).forEach((sockets) => Object.values(sockets).forEach(ensure));
}

function hero3dResize(host) {
  if (!HERO3D.renderer || !HERO3D.camera || !host) return;
  const width = host.clientWidth;
  const height = host.clientHeight;
  HERO3D.lastW = width;
  HERO3D.lastH = height;
  if (width < 40 || height < 40) return; // hidden tab: layout not computed yet
  const prevAspect = HERO3D.camera.aspect || 1;
  HERO3D.renderer.setSize(width, height, false);
  HERO3D.camera.aspect = width / height;
  HERO3D.camera.updateProjectionMatrix();
  if (Math.abs(HERO3D.camera.aspect - prevAspect) / prevAspect > 0.15) {
    hero3dSetFocus(HERO3D.mode, HERO3D.focusPart, HERO3D.focusSocket, true);
  } else {
    HERO3D.renderer.render(HERO3D.scene, HERO3D.camera);
  }
}

function hero3dSetFocus(mode, part, socket, immediate = false) {
  const T = HERO3D.lib;
  if (!T || !HERO3D.camera) return;
  const isPart = Boolean(HERO3D_SLOTS[part]);
  HERO3D.focusPart = isPart ? part : null;
  HERO3D.focusSocket = socket || null;

  const anchor = isPart ? new T.Vector3(...(HERO3D.anchors[part] || HERO3D_DEFAULT_ANCHORS[part])) : new T.Vector3(0, 0.95, 0);
  if (isPart) anchor.x *= 0.35; // keep the body in frame when focusing side-mounted parts
  const dir = isPart ? new T.Vector3(...HERO3D_SLOTS[part].dir).normalize() : new T.Vector3(0.12, 0.14, 1).normalize();
  const frame = isPart ? HERO3D_SLOTS[part].frame : [2.4, 1.5];
  const aspect = Math.max(0.4, HERO3D.camera.aspect || 1);
  const tanHalf = Math.tan(((HERO3D.camera.fov || 38) * Math.PI) / 360);
  const dist = Math.max(frame[0] / (2 * tanHalf), frame[1] / (2 * tanHalf * aspect), 0.8);

  HERO3D.camFrom = HERO3D.camera.position.clone();
  HERO3D.camTo = anchor.clone().add(dir.multiplyScalar(dist));
  HERO3D.camTo.y = Math.max(0.35, HERO3D.camTo.y);
  HERO3D.lookFrom = HERO3D.lookTo ? HERO3D.lookTo.clone() : anchor.clone();
  HERO3D.lookTo = anchor.clone();

  const jump = immediate || (typeof document !== "undefined" && document.visibilityState !== "visible");
  if (!jump) HERO3D.targetYaw = 0; // present the intended angle on a fresh fly-to
  HERO3D.tweenT = jump ? 1 : 0;
  if (jump) {
    HERO3D.camera.position.copy(HERO3D.camTo);
    HERO3D.camera.lookAt(HERO3D.lookTo);
    HERO3D.renderer?.render(HERO3D.scene, HERO3D.camera);
  }
}

function hero3dAnimate() {
  HERO3D.raf = requestAnimationFrame(hero3dAnimate);
  const { renderer, camera, scene, rig } = HERO3D;
  if (!renderer || !renderer.domElement.isConnected) return;
  HERO3D.frame += 1;
  if (HERO3D.frame % 15 === 0) {
    const host = renderer.domElement.parentElement;
    if (host && (host.clientWidth !== HERO3D.lastW || host.clientHeight !== HERO3D.lastH)) hero3dResize(host);
  }
  const delta = HERO3D.clock ? HERO3D.clock.getDelta() : 0.016;
  const t = HERO3D.clock ? HERO3D.clock.elapsedTime : 0;

  HERO3D.mixer?.update(delta);
  hero3dUpdateOutfit();

  // keep badges glued to their bones (rig-local so drag rotation stays coherent)
  const T = HERO3D.lib;
  const scratch = (HERO3D.__scratch ||= new T.Vector3());
  Object.entries(HERO3D_SLOTS).forEach(([part, spec]) => {
    const badge = HERO3D.badges[part];
    if (!badge) return;
    const bone = HERO3D.bones[part];
    if (bone) {
      bone.getWorldPosition(scratch);
      rig.worldToLocal(scratch);
      scratch.x += spec.offset[0];
      scratch.y += spec.offset[1];
      scratch.z += spec.offset[2];
      badge.position.copy(scratch);
      HERO3D.anchors[part] = [scratch.x, scratch.y, scratch.z];
    }
    badge.position.y += Math.sin(t * 1.8 + badge.position.x * 5) * 0.006;
    badge.quaternion.copy(camera.quaternion);
    const focused = HERO3D.focusPart === part;
    const ring = badge.userData.ring;
    ring.material.emissiveIntensity = focused ? 0.9 + Math.sin(t * 5) * 0.35 : 0.45;
    badge.scale.setScalar(focused ? 1.18 : 1);
    // charm gems trail their badge
    const gems = HERO3D.gems[part] || {};
    Object.entries(gems).forEach(([position, gem]) => {
      if (!gem.visible) return;
      const offset = gem.userData.offset;
      gem.position.set(badge.position.x + offset[0], badge.position.y + offset[1], badge.position.z + offset[2]);
      gem.quaternion.copy(camera.quaternion);
      const gemFocused = HERO3D.focusSocket && gem.userData.socket === HERO3D.focusSocket;
      gem.userData.ring.material.emissiveIntensity = gemFocused ? 1.2 + Math.sin(t * 6) * 0.3 : 0.5;
      gem.scale.setScalar((gemFocused ? 1.3 : 1) * (gem.userData.levelScale || 1));
    });
  });

  // camera tween
  if (HERO3D.tweenT < 1) {
    HERO3D.tweenT = Math.min(1, HERO3D.tweenT + delta * 1.6);
    const k = 1 - Math.pow(1 - HERO3D.tweenT, 3);
    camera.position.lerpVectors(HERO3D.camFrom, HERO3D.camTo, k);
    const look = HERO3D.lookFrom.clone().lerp(HERO3D.lookTo, k);
    camera.lookAt(look);
  } else if (HERO3D.lookTo) {
    camera.lookAt(HERO3D.lookTo);
  }

  // orbit + snow
  HERO3D.yaw += (HERO3D.targetYaw - HERO3D.yaw) * 0.12;
  rig.rotation.y = HERO3D.yaw + (HERO3D.dragging ? 0 : Math.sin(t * 0.3) * 0.04);
  HERO3D.snowLayers?.forEach((layer) => {
    const positions = layer.points.geometry.attributes.position;
    for (let i = 0; i < positions.count; i += 1) {
      let y = positions.getY(i) - layer.speeds[i] * delta;
      let x = positions.getX(i) + Math.sin(t * 0.7 + layer.phases[i]) * delta * 0.07;
      if (y < 0.02) {
        y = 2.7;
        x = (Math.random() - 0.5) * 3.6;
        positions.setZ(i, (Math.random() - 0.5) * 3.6);
      }
      positions.setY(i, y);
      positions.setX(i, x);
    }
    positions.needsUpdate = true;
  });

  renderer.render(scene, camera);
}

function hero3dPointerEvents(canvas) {
  canvas.style.touchAction = "none";
  canvas.addEventListener("pointerdown", (event) => {
    HERO3D.dragging = true;
    HERO3D.dragMoved = 0;
    HERO3D.lastX = event.clientX;
    canvas.setPointerCapture?.(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!HERO3D.dragging) return;
    const dx = event.clientX - HERO3D.lastX;
    HERO3D.lastX = event.clientX;
    HERO3D.dragMoved += Math.abs(dx);
    HERO3D.targetYaw = Math.max(-2.6, Math.min(2.6, HERO3D.targetYaw + dx * 0.011));
  });
  const stop = () => {
    HERO3D.dragging = false;
  };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
  canvas.addEventListener("click", (event) => {
    if (HERO3D.dragMoved > 6 || !HERO3D.lib) return;
    const T = HERO3D.lib;
    const rect = canvas.getBoundingClientRect();
    const pointer = new T.Vector2(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    const raycaster = new T.Raycaster();
    raycaster.setFromCamera(pointer, HERO3D.camera);
    const targets = [...Object.values(HERO3D.badges), ...Object.values(HERO3D.gems).flatMap((sockets) => Object.values(sockets))];
    const hits = raycaster.intersectObjects(targets, true);
    const hit = hits.find((entry) => entry.object.userData.part || entry.object.parent?.userData?.part);
    if (!hit) return;
    const part = hit.object.userData.part || hit.object.parent.userData.part;
    const socket = hit.object.userData.socket || hit.object.parent?.userData?.socket;
    if (HERO3D.mode === "gear") {
      state.selected_chief_gear_slot = part;
      renderActive();
    } else {
      state.selected_chief_charm_socket_id = socket || `${part}_top`;
      renderActive();
    }
  });
}

function initHero3d(containerId, config) {
  const container = document.getElementById(containerId);
  if (!container) return;
  hero3dLoadLib()
    .then(() => {
      const T = HERO3D.lib;
      if (!HERO3D.scene) hero3dBuildScene();
      if (!HERO3D.renderer) {
        HERO3D.renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
        HERO3D.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        hero3dPointerEvents(HERO3D.renderer.domElement);
        hero3dAnimate();
      }
      const host = document.getElementById(containerId);
      if (!host) return;
      const fallback = host.querySelector("svg");
      if (fallback) fallback.style.display = "none";
      HERO3D.renderer.domElement.style.display = "";
      if (HERO3D.renderer.domElement.parentElement !== host) host.appendChild(HERO3D.renderer.domElement);
      HERO3D.hostEl = host;
      HERO3D.resize = hero3dResize;
      hero3dEnsureBadgePlates();
      hero3dResize(host);
      if (!HERO3D.resizeObserver && typeof ResizeObserver !== "undefined") {
        HERO3D.resizeObserver = new ResizeObserver(() => {
          if (HERO3D.renderer.domElement.isConnected) hero3dResize(HERO3D.hostEl);
        });
      }
      HERO3D.resizeObserver?.observe(host);

      const modeChanged = HERO3D.mode !== config.mode;
      HERO3D.mode = config.mode;

      // rarity ring tint per gear badge
      Object.entries(config.tiers || {}).forEach(([part, hex]) => {
        const ring = HERO3D.badges[part]?.userData.ring;
        if (ring) {
          ring.material.color.setHex(hex);
          ring.material.emissive.setHex(hex);
        }
      });

      // charm gems: visibility + level scale (charms mode only)
      const showGems = config.mode === "charms";
      Object.entries(HERO3D.gems).forEach(([part, sockets]) => {
        Object.entries(sockets).forEach(([position, gem]) => {
          gem.visible = showGems;
          if (!showGems) return;
          const level = Number(config.gems?.[part]?.[position] || 0);
          gem.userData.levelScale = level > 0 ? 0.8 + Math.min(1, level / 16) * 0.4 : 0.5;
          gem.children.forEach((child) => {
            if (child.material && "opacity" in child.material) child.material.opacity = level > 0 ? (child.userData === gem.userData.ring ? 1 : 0.95) : 0.3;
          });
        });
      });

      const focusChanged = HERO3D.focusPart !== (config.focusPart || null) || HERO3D.focusSocket !== (config.focusSocket || null);
      if (modeChanged || focusChanged || HERO3D.tweenT >= 1) {
        hero3dSetFocus(config.mode, config.focusPart, config.focusSocket, modeChanged && !focusChanged);
      }
    })
    .catch(() => {
      /* WebGL/CDN unavailable — SVG fallback stays visible */
    });
}

/* wave10 build marker: charms gear-style screen, centered close-ups, layered snow, refit outfit, floated badges. */
