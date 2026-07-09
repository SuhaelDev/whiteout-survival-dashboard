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
};

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
  { title: "Pets", note: "Pet level upgrade materials", fields: PET_FIELDS },
  { title: "Experts", note: "Affinity, sigils, and learning books", fields: ["expert_affinity", "common_sigils", "books_of_knowledge"] },
  { title: "War Academy", note: "Academy research resources", fields: ["steel", "fire_crystal_shards"] },
  {
    title: "Speedups",
    note: "Enter speedups as total minutes",
    fields: ["construction_speedups_minutes", "general_speedups_minutes", "research_speedups_minutes", "training_speedups_minutes", "learning_speedups_minutes"],
  },
];
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
let activeTab = "overview";
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
  const merged = mergeDeep(baseline, savedState);
  if (extractedState) merged.extracted_current = extractedState;
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

  Object.entries(extracted.resources || {}).forEach(([key, value]) => {
    if (typeof value === "number") next.resources[key] = value;
  });
  const speedups = extracted.resources?.speedups || {};
  next.resources.general_speedups_minutes = speedupMinutes(speedups.general);
  next.resources.construction_speedups_minutes = speedupMinutes(speedups.construction);
  next.resources.research_speedups_minutes = speedupMinutes(speedups.research);
  next.resources.training_speedups_minutes = speedupMinutes(speedups.training);
  next.resources.learning_speedups_minutes = speedupMinutes(speedups.learning);

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
  });

  const petIdByName = Object.fromEntries(gameData.pets.map((pet) => [normalizeKey(pet.name), pet.pet_id]));
  Object.entries(extracted.pets || {}).forEach(([petId, pet]) => {
    const level = pet?.level ?? pet?.current_level;
    if (!pet || typeof pet !== "object" || level == null) return;
    const mappedId = next.pets[petId] ? petId : petIdByName[normalizeKey(pet.name)];
    if (!mappedId || !next.pets[mappedId]) return;
    next.pets[mappedId].current = String(level);
    next.pets[mappedId].power = pet.power;
  });

  Object.entries(extracted.experts || {}).forEach(([expertId, expert]) => {
    if (!next.experts[expertId] || expert.level == null) return;
    next.experts[expertId].relationship_current = expert.level === 100 && /intimate|max/i.test(`${expert.relationship || ""} ${expert.affinity_status || ""}`) ? "100.1" : String(expert.level);
    next.experts[expertId].power = expert.power;
    next.experts[expertId].relationship = expert.relationship;
  });

  if (next.research.normal_research_center) {
    next.research.normal_research_center.priority = "Active";
    next.research.normal_research_center.current_note = extracted.research?.active_research?.name || "";
  }
  if (next.research.war_academy_helios) {
    next.research.war_academy_helios.priority = "Active";
    next.research.war_academy_helios.current_note = extracted.research?.war_academy?.active_research?.name || "";
  }
  if (next.research.current_experts) {
    next.research.current_experts.priority = "Active";
    next.research.current_experts.current_note = extracted.experts?.active_learning?.expert || "";
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
};

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

function iconHtml(kind, label, size = "md", scope = "") {
  const asset = assetEntryFor(scope, label) || assetEntryFor(kind, label);
  const assetSrc = typeof asset === "string" ? asset : asset?.src;
  if (assetSrc) {
    const hideCount = assetHasHiddenCount(asset);
    const fit = ["contain", "cover"].includes(asset?.fit) ? asset.fit : "contain";
    const position = asset?.position ? String(asset.position).replace(/[^a-z0-9% .-]/gi, "") : "center";
    return `<span class="game-icon game-icon--asset game-icon--${size}${hideCount ? " game-icon--count-crop" : ""}" aria-hidden="true">
      <img class="game-asset${hideCount ? " game-asset--count-crop" : ""}" src="${esc(assetSrc)}" alt="" loading="lazy" style="object-fit:${fit};object-position:${esc(position)}" />
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
    const cost = rangeCost(levelsByBuilding[buildingId] || [], saved.current, saved.target, {
      idKey: "level_code",
      orderKey: "numerical_level",
      fields: BUILDING_FIELDS,
    });
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
  Object.values(nextState.heroes || {}).forEach((saved) => {
    changed += setIfChanged(saved, "target_stars", Number(saved.current_stars || 0));
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

function inventorySnapshot(fields) {
  return fieldKeys(fields).reduce((acc, key) => {
    acc[key] = availableInventoryValue(key);
    return acc;
  }, {});
}

function inventoryComparisonHtml(cost, fields, title = "Inventory check", exchangeKey = "") {
  const available = inventorySnapshot(fields);
  const exchangePlan = exchangeKey ? materialExchangePlan(cost, fields, exchangeKey) : null;
  const need = exchangePlan ? exchangePlan.gap : costGap(cost);
  const status = costIsEmpty(need) ? "Covered" : "Need more";
  const exchangeHtml = exchangePlan?.trades.length
    ? `<div><span>Suggested exchange</span><div class="exchange-trade-list">${exchangePlan.trades.map((trade) => `<em>${esc(exchangeTradeText(trade))}</em>`).join("")}</div></div>`
    : "";
  const exchangeRules = exchangePlan ? exchangeRulesHtml(exchangePlan.set) : "";
  return `<div class="inventory-check ${costIsEmpty(need) ? "inventory-check--covered" : ""}">
    <div class="inventory-check__head">
      <span>${esc(title)}</span>
      <strong>${exchangePlan ? `${status} after exchange` : status}</strong>
    </div>
    <div class="inventory-check__grid">
      <div><span>Required</span>${costHtml(cost, fields)}</div>
      <div><span>You have</span>${costHtml(available, fields)}</div>
      <div><span>${exchangePlan ? "Need after exchange" : "Need more"}</span>${costHtml(need, fields)}</div>
      ${exchangeHtml}
    </div>
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
  const comparisonTitle = plan.exchangeKey ? `${title} recommendation materials after exchange` : `${title} recommendation materials`;
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
    ${inventoryComparisonHtml(plan.totalCost, plan.fields, comparisonTitle, plan.exchangeKey)}
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
    ${upgradePathStripHtml(upgrades, empty)}
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
    const cost = rangeCost(levels, saved.current, step.next.level_code, {
      idKey: "level_code",
      orderKey: "numerical_level",
      fields: BUILDING_FIELDS,
    });
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

function renderBuildings() {
  const levelsByBuilding = groupBy(gameData.building_levels, "building_id");
  let totalCost = makeCost(BUILDING_FIELDS);
  let totalBaseSeconds = 0;
  let selectedUpgradeCount = 0;
  const selectedUpgrades = [];
  const rows = gameData.buildings
    .map((building) => {
      const levels = sortByNumber(levelsByBuilding[building.building_id] || [], "numerical_level");
      const saved = state.buildings[building.building_id] || { current: levels[0]?.level_code, target: levels.at(-1)?.level_code };
      const cost = rangeCost(levels, saved.current, saved.target, {
        idKey: "level_code",
        orderKey: "numerical_level",
        fields: BUILDING_FIELDS,
      });
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
      const timePlan = constructionTimePlan(baseSeconds);
      const options = optionList(levels, "level_code", "level_code", saved.current);
      const targetOptions = optionList(levels, "level_code", "level_code", saved.target);
      return `<tr>
        <td>${visualLabel("building", building.name, `${levels.length} levels`)}</td>
        <td><select data-path="buildings.${building.building_id}.current">${options}</select></td>
        <td><select data-path="buildings.${building.building_id}.target">${targetOptions}</select></td>
        <td>${costHtml(cost, BUILDING_FIELDS)}</td>
        <td class="number">${timeFmt(baseSeconds)}</td>
        <td class="number">${timeFmt(timePlan.adjustedSeconds)}</td>
      </tr>`;
    })
    .join("");
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
      { action: "buildings-fc", label: "Apply FC buildings" },
      { action: "buildings-all", label: "Apply all possible" },
    ],
  );

  $("#tab-buildings").innerHTML = `
    <div class="toolbar"><div><h2>Buildings</h2><p>Costs are summed from current exclusive to target inclusive.</p></div>${buildingBulk}</div>
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
    <div class="summary-grid">
      <div class="metric blue"><span>${visualResourceLabel("meat", "Meat")}</span><strong>${fmt(totalCost.meat)}</strong></div>
      <div class="metric blue"><span>${visualResourceLabel("wood", "Wood")}</span><strong>${fmt(totalCost.wood)}</strong></div>
      <div class="metric amber"><span>${visualResourceLabel("fire_crystals", "Fire Crystals")}</span><strong>${fmt(totalCost.fire_crystals)}</strong></div>
      <div class="metric green"><span>${visualResourceLabel("refined_fire_crystals", "Refined FC")}</span><strong>${fmt(totalCost.refined_fire_crystals)}</strong></div>
    </div>
    ${inventoryComparisonHtml(totalCost, BUILDING_FIELDS, "Combined building upgrade resources")}
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
    <div class="table-wrap"><table>
      <thead><tr><th>Building</th><th>Current</th><th>Target</th><th>Cost</th><th class="number">Base time</th><th class="number">Buffed time</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
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
          if (current !== progress.current) return null;
          const next = Number(progress.next || current + 1);
          if (next <= current) return null;
          const cost = researchCostFromNode(node);
          const changes = researchImpactChanges(node, true);
          const powerProgress = parseStatProgress(node.power);
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
            powerDelta: powerProgress?.delta || 0,
            changes,
            updates: [
              { path: `research_targets.war_academy.${nodeId}.current`, value: current },
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
  const groupCards = CHIEF_TROOP_GROUPS.map((group) => {
    let groupCost = makeCost(GEAR_FIELDS);
    let groupCurrentPower = 0;
    let groupTargetPower = 0;
    let groupStatChanges = {};
    const rows = group.gearSlots
      .map((slotId) => {
        const slot = slotById[slotId];
        const saved = state.chief_gear[slotId];
        const impact = powerImpact(levels, saved.current, saved.target, "gear_level_code");
        const statChanges = chiefGearAttributeChanges(slotId, saved.current, saved.target);
        const powerChange = {
          label: "Power",
          current: fmt(impact.currentPower),
          target: fmt(impact.targetPower),
          delta: signedFmt(impact.deltaPower),
        };
        const cost = rangeCost(levels, saved.current, saved.target, {
          idKey: "gear_level_code",
          orderKey: "sequence",
          fields: GEAR_FIELDS,
        });
        totalCost = addCost(totalCost, cost);
        groupCost = addCost(groupCost, cost);
        if (!costIsEmpty(cost)) {
          selectedUpgradeCount += 1;
          selectedUpgrades.push({
            kind: "gear",
            scope: "gear",
            label: slot.name,
            meta: group.label,
            from: saved.current,
            to: saved.target,
          });
        }
        groupCurrentPower += impact.currentPower;
        groupTargetPower += impact.targetPower;
        totalCurrentPower += impact.currentPower;
        totalTargetPower += impact.targetPower;
        mergeNumericStatChanges(groupStatChanges, statChanges);
        mergeNumericStatChanges(totalStatChanges, statChanges);
        const meta = [saved.item_name, saved.power != null ? `Power ${fmt(saved.power)}` : ""].filter(Boolean).join(" | ");
        return `<div class="chief-control-row">
          <div class="chief-control-main">${visualLabel("gear", slot.name, meta)}</div>
          <label><span>Current</span><select data-path="chief_gear.${slot.slot_id}.current">${optionList(levels, "gear_level_code", "gear_level_code", saved.current)}</select></label>
          <label class="target-with-reset"><span>Target</span><select data-path="chief_gear.${slot.slot_id}.target">${optionList(levels, "gear_level_code", "gear_level_code", saved.target)}</select>${resetTargetButton(`chief-gear:${slot.slot_id}`)}</label>
          <div class="chief-control-impact"><span>Stat impact</span>${statChangeListHtml([...statChanges, powerChange])}</div>
          <div class="chief-control-cost"><span>Cost</span>${costHtml(cost, GEAR_FIELDS)}</div>
        </div>`;
      })
      .join("");
    const groupBulk = bulkTargetControls(
      "Group target",
      `bulkChiefGearTarget_${group.id}`,
      targetOptions,
      [{ action: `chief-gear:${group.id}`, label: `Apply ${group.label}` }],
      maxTarget,
    );
    return `<section class="chief-troop-card chief-troop-card--${group.id}">
      <div class="chief-troop-head">
        ${visualLabel("troop", group.label, group.gearSlots.map((slotId) => slotById[slotId]?.name || titleFromId(slotId)).join(" / "))}
        ${groupBulk}
      </div>
      <div class="chief-control-list">${rows}</div>
      ${statImpactPanel(`${group.label} Gear Impact`, [
        ...aggregateStatCards(groupStatChanges, "Chief gear attribute table"),
        statImpactCard("Workbook Power", fmt(groupCurrentPower), fmt(groupTargetPower), signedFmt(groupTargetPower - groupCurrentPower), "Exact from gear level rows"),
      ], "Attack, defense, and deployment are calculated from the sourced chief gear stat table.")}
      ${inventoryComparisonHtml(groupCost, GEAR_FIELDS, `${group.label} gear materials`)}
    </section>`;
  }).join("");
  const gearBulk = bulkTargetControls(
    "All gear target",
    "bulkChiefGearTarget",
    targetOptions,
    [{ action: "chief-gear", label: "Apply all slots" }],
    maxTarget,
  );
  const smartPlan = smartRecommendationPlan("chief_gear");
  $("#tab-chief-gear").innerHTML = `
    <div class="toolbar"><div><h2>Chief Gear</h2><p>Grouped by troop type using the in-game chief gear stat mapping.</p></div>${gearBulk}</div>
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
    <div class="summary-grid">
      ${GEAR_FIELDS.map((field, idx) => {
        const key = Array.isArray(field) ? field[0] : field;
        const color = ["blue", "amber", "green", "purple"][idx % 4];
        return `<div class="metric ${color}"><span>${visualResourceLabel(key, RESOURCE_LABELS[key] || key)}</span><strong>${fmt(totalCost[key])}</strong></div>`;
      }).join("")}
      <div class="metric blue"><span>Projected power gain</span><strong>${signedFmt(totalTargetPower - totalCurrentPower)}</strong></div>
    </div>
    ${statImpactPanel("Total Chief Gear Impact", [
      ...aggregateStatCards(totalStatChanges, "Chief gear attribute table"),
      statImpactCard("Workbook Power", fmt(totalCurrentPower), fmt(totalTargetPower), signedFmt(totalTargetPower - totalCurrentPower), "Exact current-to-target power delta"),
    ], "Material costs and power are exact from the workbook. Attribute stats use the confirmed chief gear table and status-step interpolation.")}
    ${inventoryComparisonHtml(totalCost, GEAR_FIELDS, "Combined gear upgrade materials", "chief_gear")}
    <div class="chief-troop-grid">${groupCards}</div>
  `;
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
  const groupCards = CHIEF_TROOP_GROUPS.map((group) => {
    let groupCost = makeCost(CHARM_FIELDS);
    let groupCurrentPower = 0;
    let groupTargetPower = 0;
    let groupStatChanges = {};
    const gearBlocks = group.gearSlots
      .map((gearSlotId) => {
        const gearSlot = gearSlotById[gearSlotId];
        const rows = (charmSlotsByGear[gearSlotId] || [])
          .map((slot) => {
            const saved = state.charms[slot.slot_id];
            const impact = powerImpact(levels, saved.current, saved.target, "charm_level");
            const statChanges = chiefCharmAttributeChanges(gearSlotId, saved.current, saved.target);
            const powerChange = {
              label: "Power",
              current: fmt(impact.currentPower),
              target: fmt(impact.targetPower),
              delta: signedFmt(impact.deltaPower),
            };
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
            return `<div class="chief-control-row chief-control-row--charm">
              <div class="chief-control-main">${visualLabel("charm", slot.position, `${slot.gear_slot} charm`)}</div>
              <label><span>Current</span><select data-path="charms.${slot.slot_id}.current">${optionList(levels, "label", "charm_level", saved.current)}</select></label>
              <label class="target-with-reset"><span>Target</span><select data-path="charms.${slot.slot_id}.target">${optionList(levels, "label", "charm_level", saved.target)}</select>${resetTargetButton(`charm:${slot.slot_id}`)}</label>
              <div class="chief-control-impact"><span>Stat impact</span>${statChangeListHtml([...statChanges, powerChange])}</div>
              <div class="chief-control-cost"><span>Cost</span>${costHtml(cost, CHARM_FIELDS)}</div>
            </div>`;
          })
          .join("");
        return `<div class="chief-gear-cluster">
          <h3>${visualLabel("gear", gearSlot?.name || titleFromId(gearSlotId))}</h3>
          <div class="chief-control-list">${rows}</div>
        </div>`;
      })
      .join("");
    const groupBulk = bulkTargetControls(
      "Group target",
      `bulkCharmTarget_${group.id}`,
      targetOptions,
      [{ action: `charms:${group.id}`, label: `Apply ${group.label}` }],
      maxTarget,
    );
    return `<section class="chief-troop-card chief-troop-card--${group.id}">
      <div class="chief-troop-head">
        ${visualLabel("troop", group.label, group.gearSlots.map((slotId) => gearSlotById[slotId]?.name || titleFromId(slotId)).join(" / "))}
        ${groupBulk}
      </div>
      <div class="chief-gear-clusters">${gearBlocks}</div>
      ${statImpactPanel(`${group.label} Charm Impact`, [
        ...aggregateStatCards(groupStatChanges, "Charm attribute table"),
        statImpactCard("Workbook Power", fmt(groupCurrentPower), fmt(groupTargetPower), signedFmt(groupTargetPower - groupCurrentPower), "Exact from charm level rows"),
      ], "Lethality and health are calculated from the sourced charm stat table.")}
      ${inventoryComparisonHtml(groupCost, CHARM_FIELDS, `${group.label} charm materials`)}
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
  $("#tab-charms").innerHTML = `
    <div class="toolbar"><div><h2>Chief Charms</h2><p>Grouped by the troop type of the gear piece each charm is attached to.</p></div>${charmBulk}</div>
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
    <div class="summary-grid">
      ${CHARM_FIELDS.map((field, idx) => {
        const key = Array.isArray(field) ? field[0] : field;
        const color = ["blue", "amber", "green", "purple"][idx % 4];
        return `<div class="metric ${color}"><span>${visualResourceLabel(key, RESOURCE_LABELS[key] || key)}</span><strong>${fmt(totalCost[key])}</strong></div>`;
      }).join("")}
      <div class="metric blue"><span>Projected power gain</span><strong>${signedFmt(totalTargetPower - totalCurrentPower)}</strong></div>
    </div>
    ${statImpactPanel("Total Charm Impact", [
      ...aggregateStatCards(totalStatChanges, "Charm attribute table"),
      statImpactCard("Workbook Power", fmt(totalCurrentPower), fmt(totalTargetPower), signedFmt(totalTargetPower - totalCurrentPower), "Exact current-to-target power delta"),
    ], "Charm materials and power are exact from the workbook. Lethality and health totals use the confirmed charm stat table.")}
    ${inventoryComparisonHtml(totalCost, CHARM_FIELDS, "Combined charm upgrade materials", "chief_charms")}
    <div class="chief-troop-grid">${groupCards}</div>
  `;
}

function renderPets() {
  const levelsByPet = groupBy(gameData.pet_levels, "pet_id");
  let totalCost = makeCost(PET_FIELDS);
  let totalSvsGain = 0;
  let selectedUpgradeCount = 0;
  const selectedUpgrades = [];
  const observedPets = gameData.pets.map((pet) => state.extracted_current?.pets?.[pet.pet_id]).filter(Boolean);
  const observedPower = observedPets.reduce((total, pet) => total + Number(pet.power || 0), 0);
  const aggregateStats = Object.values(observedAggregateStats(observedPets));
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
      return `<tr>
        <td>${visualLabel("pet", pet.name, observed.power ? `Power ${fmt(observed.power)}` : "")}</td>
        <td><select data-path="pets.${pet.pet_id}.current">${optionList(levels, "label", "level_code", saved.current)}</select></td>
        <td><select data-path="pets.${pet.pet_id}.target">${optionList(levels, "label", "level_code", saved.target)}</select></td>
        <td>${observedStatsHtml(observed)}</td>
        <td><div class="impact-stack"><strong>${signedFmt(svsGain)} SVS</strong><span>Target combat stat table not in workbook extract</span></div></td>
        <td>${costHtml(cost, PET_FIELDS)}</td>
      </tr>`;
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
  $("#tab-pets").innerHTML = `
    <div class="toolbar"><div><h2>Pets</h2><p>Current combat bonuses are captured from the account. Target costs and SVS points use the workbook pet table.</p></div>${petBulk}</div>
    ${upgradeNutshellHtml({
      module: "Pets",
      selected: upgradeSelectionText(selectedUpgradeCount, "pet target", "pet targets"),
      upgrades: selectedUpgrades,
      impactCards: [
        statSnapshotCard("Target SVS Gain", signedFmt(totalSvsGain), "Workbook pet table", "Combat target stat table still needs full in-game extraction"),
        ...aggregateStats
          .slice(0, 6)
          .map((entry) =>
            statSnapshotCard(entry.label, entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value), "Current pet stats", "Captured from the account"),
          ),
      ],
      details: [`Target SVS ${signedFmt(totalSvsGain)}`, `Power read ${fmt(observedPower)}`],
      cost: totalCost,
      fields: PET_FIELDS,
      empty: "Set pet targets above current levels to see material gaps.",
    })}
    ${smartRecommendationPanelHtml("pets", "Pet Targets", smartPlan, "Uses available pet materials to maximize workbook SVS gain; combat stat target rows still need full extraction.")}
    <div class="summary-grid">
      ${PET_FIELDS.map((field, idx) => {
        const key = Array.isArray(field) ? field[0] : field;
        const color = ["blue", "amber", "green", "purple"][idx % 4];
        return `<div class="metric ${color}"><span>${visualResourceLabel(key, RESOURCE_LABELS[key] || key)}</span><strong>${fmt(totalCost[key])}</strong></div>`;
      }).join("")}
      <div class="metric blue"><span>Pet power read</span><strong>${fmt(observedPower)}</strong></div>
      <div class="metric green"><span>Target SVS gain</span><strong>${fmt(totalSvsGain)}</strong></div>
    </div>
    ${statImpactPanel("Observed Pet Combat Stats", aggregateStats.map((entry) =>
      statSnapshotCard(entry.label, entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value), "Current read", "Summed from captured pet detail pages"),
    ), "Pet target combat percentages still need a confirmed in-game level stat table.")}
    ${inventoryComparisonHtml(totalCost, PET_FIELDS, "Pets materials")}
    <div class="table-wrap pets-table"><table>
      <thead><tr><th>Pet</th><th>Current</th><th>Target</th><th>Current Stats</th><th>Target Gain</th><th>Cost</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
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

function renderHeroes() {
  const grouped = groupBy(gameData.heroes, "generation");
  const rows = gameData.heroes
    .map((hero) => {
      const saved = state.heroes[hero.hero_id];
      return `<tr>
        <td>${visualLabel("hero", hero.name, `${hero.rarity}${hero.generation ? ` | Gen ${hero.generation}` : ""}`)}</td>
        <td>${visualLabel("troop", hero.troop_type)}</td>
        <td>${esc(hero.default_role || "-")}</td>
        <td><input type="checkbox" ${saved.owned ? "checked" : ""} data-path="heroes.${hero.hero_id}.owned" /></td>
        <td>${numberInput(`heroes.${hero.hero_id}.current_stars`, saved.current_stars)}</td>
        <td>${numberInput(`heroes.${hero.hero_id}.target_stars`, saved.target_stars)}</td>
        <td>${numberInput(`heroes.${hero.hero_id}.current_widget_level`, saved.current_widget_level)}</td>
        <td>${numberInput(`heroes.${hero.hero_id}.target_widget_level`, saved.target_widget_level)}</td>
      </tr>`;
    })
    .join("");
  $("#tab-heroes").innerHTML = `
    <div class="summary-grid">
      <div class="metric blue"><span>Hero rows</span><strong>${fmt(gameData.heroes.length)}</strong></div>
      <div class="metric amber"><span>Mythic generations</span><strong>${fmt(Object.keys(grouped).filter((x) => x !== "null").length)}</strong></div>
      <div class="metric green"><span>Owned marked</span><strong>${fmt(Object.values(state.heroes).filter((hero) => hero.owned).length)}</strong></div>
      <div class="metric purple"><span>Latest seeded gen</span><strong>${fmt(Math.max(...gameData.heroes.map((hero) => hero.generation || 0)))}</strong></div>
    </div>
    <div class="table-wrap"><table>
      <thead><tr><th>Hero</th><th>Troop</th><th>Role</th><th>Owned</th><th>Stars</th><th>Target</th><th>Widget</th><th>Target</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
}

function renderHeroGear() {
  const gearEntries = Object.entries(state.extracted_current?.hero_gear || {});
  const primaryEntries = heroGearPrimaryEntries(gearEntries);
  const primaryIds = new Set(primaryEntries.map((entry) => entry.heroId));
  const trackedHeroes = gearEntries.length;
  const primarySummary = heroGearUpgradeSummary(primaryEntries);
  const allSummary = heroGearUpgradeSummary(gearEntries);
  const capturedGearStats = allSummary.capturedStats;
  const gearRows = gearEntries
    .map(([heroId, gearSet]) => {
      const hero = heroRecordFor(heroId);
      const targets = heroGearTargetsFor(heroId);
      const targetCost = heroGearCostToTarget(gearSet, heroId);
      return `<tr>
        <td>${visualLabel("hero", hero.name, `${hero.rarity}${hero.generation ? ` | Gen ${hero.generation}` : ""}`)}</td>
        <td>${visualLabel("troop", gearSet.troop_type || hero.troop_type)}</td>
        <td>${heroGearPiecesHtml(gearSet.gear)}</td>
        <td>${heroGearSpecialHtml(gearSet)}</td>
        <td>${heroGearPieceTargetsHtml(heroId, gearSet)}</td>
        <td>${numberInput(`hero_gear_targets.heroes.${heroId}.special_enhancement`, targets.specialEnhancement, 0)}</td>
        <td>${costHtml(targetCost, HERO_GEAR_FIELDS)}</td>
      </tr>`;
    })
    .join("");
  const primaryLoadoutCards = primaryEntries
    .map((entry) => {
      const { heroId, gearSet, hero, setLabel } = entry;
      const targets = heroGearTargetsFor(heroId);
      const targetCost = heroGearCostToTarget(gearSet, heroId);
      return heroGearLoadoutHtml(heroId, gearSet, hero, targetCost, targets, setLabel);
    })
    .join("");
  const otherLoadoutCards = gearEntries
    .filter(([heroId]) => !primaryIds.has(heroId))
    .map(([heroId, gearSet]) => {
      const hero = heroRecordFor(heroId);
      const targets = heroGearTargetsFor(heroId);
      const targetCost = heroGearCostToTarget(gearSet, heroId);
      return heroGearLoadoutHtml(heroId, gearSet, hero, targetCost, targets);
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
  $("#tab-hero-gear").innerHTML = `
    <div class="toolbar"><div><h2>Hero Gear</h2><p>Current sets are loaded from the game extract. Mastery Forging and enhancement materials use workbook tables.</p></div></div>
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
        `${fmt(primaryEntries.length)} primary sets`,
        `${fmt(trackedHeroes)} tracked loadouts total`,
        `Primary power ${fmt(primarySummary.totalPower)}`,
        `${fmt(primarySummary.investedCost.essence_stones)} stones invested`,
        `${fmt(primarySummary.investedCost.hero_gear_xp)} XP invested`,
        `${fmt(primarySummary.investedCost.mythic_gear)} mythic gear invested`,
        `${fmt(primarySummary.investedCost.mithril)} mithril invested`,
      ],
      cost: primarySummary.totalCost,
      fields: HERO_GEAR_FIELDS,
      empty: "Set hero gear piece targets above current levels or enhancements to see material gaps.",
    })}
    ${smartRecommendationPanelHtml("hero_gear", "Hero Gear Targets", smartPlan, "Optimizes primary interchangeable hero gear sets using mastery stat gains and enhancement breakpoints.")}
    ${heroGearPrimaryOverviewHtml(primaryEntries)}
    <div class="summary-grid">
      <div class="metric blue"><span>Tracked sets</span><strong>${fmt(trackedHeroes)}</strong></div>
      <div class="metric amber"><span>Gear pieces read</span><strong>${fmt(allSummary.pieceCount)}</strong></div>
      <div class="metric green"><span>Special items read</span><strong>${fmt(allSummary.specialCount)}</strong></div>
      <div class="metric blue"><span>Gear power read</span><strong>${fmt(allSummary.totalPower)}</strong></div>
      <div class="metric amber"><span>Essence Stones</span><strong>${fmt(totalCost.essence_stones)}</strong></div>
      <div class="metric purple"><span>XP to targets</span><strong>${fmt(totalCost.hero_gear_xp)}</strong></div>
      <div class="metric amber"><span>Stones invested</span><strong>${fmt(allSummary.investedCost.essence_stones)}</strong></div>
      <div class="metric purple"><span>XP invested</span><strong>${fmt(allSummary.investedCost.hero_gear_xp)}</strong></div>
      <div class="metric green"><span>Mythic Gear</span><strong>${fmt(totalCost.mythic_gear)}</strong></div>
      <div class="metric amber"><span>Mithril</span><strong>${fmt(totalCost.mithril)}</strong></div>
      <div class="metric green"><span>Mythic Gear invested</span><strong>${fmt(allSummary.investedCost.mythic_gear)}</strong></div>
      <div class="metric amber"><span>Mithril invested</span><strong>${fmt(allSummary.investedCost.mithril)}</strong></div>
    </div>
    ${inventoryComparisonHtml(totalCost, HERO_GEAR_FIELDS, "All tracked hero gear materials")}
    ${statImpactPanel("Hero Gear Impact", [
      ...capturedGearStats.map((entry) =>
        statSnapshotCard(entry.label, entry.type === "percent" ? percentFmt(entry.value) : fmt(entry.value), "Captured gear details", "Summed from opened equipped gear detail popups"),
      ),
      statSnapshotCard("Current Equipped Gear Power", fmt(allSummary.totalPower), "Captured gear details", "Sum of opened hero gear detail power values"),
      statSnapshotCard("Essence Stones To Targets", fmt(totalCost.essence_stones), "Target inputs", "Uses workbook mastery forging table"),
      statSnapshotCard("Hero Gear XP To Targets", fmt(totalCost.hero_gear_xp), "Target inputs", "Uses workbook enhancement table"),
      statSnapshotCard("Essence Stones Invested", fmt(allSummary.investedCost.essence_stones), "Current gear levels", "Calculated from level 0 to captured mastery levels"),
      statSnapshotCard("Hero Gear XP Invested", fmt(allSummary.investedCost.hero_gear_xp), "Current gear + levels", "Includes normal enhancement XP and eligible empowerment XP"),
      statSnapshotCard("Mythic Gear To Targets", fmt(totalCost.mythic_gear), "Target inputs", "Uses workbook enhancement table"),
      statSnapshotCard("Mithril To Targets", fmt(totalCost.mithril), "Target inputs", "Uses workbook enhancement table"),
      statSnapshotCard("Mythic Gear Invested", fmt(allSummary.investedCost.mythic_gear), "Eligible empowerment", "Calculated from active empowerment material levels"),
      statSnapshotCard("Mithril Invested", fmt(allSummary.investedCost.mithril), "Eligible empowerment", "Calculated from active empowerment material levels"),
    ], "Opened detail popups provide exact current stats; normal + enhancement XP follows the mythic gear guide, while empowerment stats remain gated by mastery level.")}
    <div class="panel hero-gear-actions">
      ${levelBulk}
      ${enhancementBulk}
      ${specialBulk}
    </div>
    <details class="table-disclosure hero-loadout-disclosure" open>
      <summary>Primary loadout detail cards</summary>
      <div class="hero-loadout-grid">${primaryLoadoutCards || `<div class="empty-state"><span class="muted">No hero gear extract loaded yet.</span></div>`}</div>
    </details>
    <details class="table-disclosure hero-loadout-disclosure">
      <summary>Other tracked hero gear loadouts</summary>
      <div class="hero-loadout-grid">${otherLoadoutCards || `<div class="empty-state"><span class="muted">No additional loadouts captured.</span></div>`}</div>
    </details>
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
  let totalCost = { expert_affinity: 0, common_sigils: 0 };
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
      const visibleSkills = Array.isArray(observed.visible_skill_levels) && observed.visible_skill_levels.length
        ? `<div class="impact-stack"><strong>Visible skills ${observed.visible_skill_levels.map((level) => `Lv.${level}`).join(" / ")}</strong><span>${observed.relationship || ""}</span></div>`
        : "";
      return `<tr>
        <td>${visualLabel("expert", expert.name, [expert.skills.map((skill) => skill.name).join(", "), observed.power ? `Power ${fmt(observed.power)}` : ""].filter(Boolean).join(" | "))}</td>
        <td><select data-path="experts.${expert.expert_id}.relationship_current">${optionList(options, "label", "level_code", saved.relationship_current)}</select></td>
        <td><select data-path="experts.${expert.expert_id}.relationship_target">${optionList(options, "label", "level_code", saved.relationship_target)}</select></td>
        <td><div class="expert-current-stack">${observedStatsHtml(observed)}${visibleSkills}</div></td>
        <td>${statChangeListHtml(impact.changes)}</td>
        <td>${costHtml(cost, ["expert_affinity", ["common_sigils", "sigils"]])}</td>
        <td class="number">${fmt(expert.total_books)}</td>
      </tr>`;
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
  $("#tab-experts").innerHTML = `
    <div class="toolbar"><div><h2>Experts</h2><p>Affinity and sigil costs are summed from current exclusive to target inclusive.</p></div>${expertBulk}</div>
    ${upgradeNutshellHtml({
      module: "Experts",
      selected: upgradeSelectionText(selectedUpgradeCount, "expert target", "expert targets"),
      upgrades: selectedUpgrades,
      impactCards: selectedImpactCards,
      details: [`${fmt(gameData.experts.length)} experts`, `${fmt(gameData.expert_affinity_levels.length)} affinity rows`],
      cost: totalCost,
      fields: ["expert_affinity", ["common_sigils", "sigils"]],
      empty: "Set expert relationship targets above current levels to see material gaps.",
    })}
    ${smartRecommendationPanelHtml("experts", "Expert Targets", smartPlan, "Suggests affordable expert affinity targets by workbook stat gain, power gain, and material pressure.")}
    <div class="summary-grid">
      <div class="metric blue"><span>Experts</span><strong>${fmt(gameData.experts.length)}</strong></div>
      <div class="metric amber"><span>Affinity rows</span><strong>${fmt(gameData.expert_affinity_levels.length)}</strong></div>
      <div class="metric green"><span>Skill rows</span><strong>${fmt(gameData.expert_skill_levels.length)}</strong></div>
      <div class="metric purple"><span>Affinity to target</span><strong>${fmt(totalCost.expert_affinity)}</strong></div>
    </div>
    ${statImpactPanel("Current Expert Combat Stats", aggregateCards, "Affinity target changes below are exact from the workbook where the source sheet exposes stat columns.")}
    ${inventoryComparisonHtml(totalCost, ["expert_affinity", ["common_sigils", "sigils"]], "Expert upgrade materials")}
    <div class="table-wrap experts-table"><table>
      <thead><tr><th>Expert</th><th>Current</th><th>Target</th><th>Current Stats</th><th>Target Stat Change</th><th>Cost</th><th class="number">Full books</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
}

function renderResearch() {
  const currentResearch = state.extracted_current?.research || {};
  const academy = currentResearch.war_academy || {};
  let totalCost = makeCost(RESEARCH_COST_FIELDS);
  let selectedCount = 0;
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

  const warRows = Object.entries(academy.visible_nodes || {})
    .filter(([, node]) => !/max|complete|completed/i.test(String(node.status || "")))
    .map(([nodeId, node]) => {
      const progress = parseResearchLevelProgress(node);
      const saved = ensureResearchTarget("war_academy", nodeId, progress.current);
      const target = Number(saved.target || 0);
      const current = Number(saved.current || 0);
      const selected = target > current;
      const cost = selected && current === progress.current && target === progress.next ? researchCostFromNode(node) : makeCost(RESEARCH_COST_FIELDS);
      const changes = researchImpactChanges(node, selected);
      if (selected) {
        selectedCount += 1;
        totalCost = addCost(totalCost, cost);
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
          : "Exact cost is only captured for the visible next step."
        : "No target selected";
      const effectHtml = selected && changes.length ? statChangeListHtml(changes) : `<span class="muted">${esc(node.effect || costNote)}</span>`;
      return `<tr>
        <td>${visualLabel("research", titleFromId(nodeId), node.status || "Available")}</td>
        <td>${selectInput(`research_targets.war_academy.${nodeId}.current`, saved.current, researchLevelOptions(saved.current, progress.next))}</td>
        <td>${selectInput(`research_targets.war_academy.${nodeId}.target`, saved.target, researchLevelOptions(saved.current, progress.next))}</td>
        <td>${effectHtml}</td>
        <td>${costIsEmpty(cost) ? `<span class="muted">${esc(costNote)}</span>` : costHtml(cost, RESEARCH_COST_FIELDS)}</td>
      </tr>`;
    })
    .join("");

  const visibleWarCount = Object.values(academy.visible_nodes || {}).filter((node) => !/max|complete|completed/i.test(String(node.status || ""))).length;
  const t12HiddenNote = T12_UNLOCKED
    ? ""
    : `<div class="locked-note">${visualLabel("research", "T12 hidden", "This account has not unlocked T12 yet.")}</div>`;
  const smartPlan = smartRecommendationPlan("research");
  $("#tab-research").innerHTML = `
    <div class="toolbar"><div><h2>Research And War Academy</h2><p>Only active or available nodes are shown. Completed nodes and locked T12 rows are hidden for this account.</p></div></div>
    ${upgradeNutshellHtml({
      module: "Research",
      selected: upgradeSelectionText(selectedCount, "research target", "research targets"),
      upgrades: selectedUpgrades,
      impactCards: aggregateStatCards(totalResearchChanges, "Captured War Academy next-step card"),
      details: [`${fmt(visibleWarCount)} T11 nodes visible`, T12_UNLOCKED ? "T12 unlocked" : "T12 hidden"],
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
    ${t12HiddenNote}
    ${statImpactPanel("Current War Academy Bonuses", academyBonuses, "Live stats captured from the account. Target rows below use only active/available node cards.")}
    <div class="panel">
      <h2>Regular Research</h2>
      <div class="table-wrap compact-table"><table>
        <thead><tr><th>Node</th><th>Current level</th><th>Target level</th><th>Expected effect</th><th>Expected cost</th></tr></thead>
        <tbody>${regularRows}</tbody>
      </table></div>
    </div>
    <div class="panel">
      <h2>T11 War Academy Research</h2>
      <div class="table-wrap research-table"><table>
        <thead><tr><th>Node</th><th>Current level</th><th>Target level</th><th>Expected stat change</th><th>Expected cost</th></tr></thead>
        <tbody>${warRows || `<tr><td colspan="5"><span class="muted">No active or available T11 nodes captured.</span></td></tr>`}</tbody>
      </table></div>
    </div>
  `;
}

function renderResources() {
  const grouped = groupBy(gameData.resource_types, "category");
  $("#tab-resources").innerHTML = `
    <div class="toolbar"><div><h2>Resources</h2><p>Edit the single current value used by every upgrade calculator. Changes save to the shared database automatically.</p></div></div>
    <div class="inventory-editor">
      ${CALCULATOR_INVENTORY_GROUPS.map(inventoryEditorGroup).join("")}
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
  });

  $("#moduleNav").addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab]");
    if (!button) return;
    activeTab = button.dataset.tab;
    renderActive({ focusNutshell: true });
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
