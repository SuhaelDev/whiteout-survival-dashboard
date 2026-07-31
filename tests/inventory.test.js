// Wave 43 - the merged Inventory page.
// "Current Extract" (read-only tables) and "Resources" (editors) showed the same data
// twice with only one of them editable. They are now one page. What is pinned here:
//   1. Both old modules are gone and exactly one replaces them.
//   2. Every material row writes to resources.<key> - the same path the calculators read.
//   3. A fresh capture still overwrites typed-in values, but records what it moved.
//   4. Editing on this page does NOT trigger a full re-render (which would collapse
//      every section and lose scroll position mid-edit).
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "src/app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "src/styles.css"), "utf8");

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : `\n    got  ${JSON.stringify(got)}\n    want ${JSON.stringify(want)}`}`);
};
const has = (name, re, hay = src) => {
  const ok = re.test(hay);
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}`);
};
const absent = (name, re, hay = src) => {
  const ok = !re.test(hay);
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}`);
};
const grab = (re) => {
  const m = src.match(re);
  if (!m) throw new Error("missing " + re);
  return m[0];
};

// --- 1. one page replaces two -----------------------------------------------
absent("renderCurrentExtract is gone", /function renderCurrentExtract\(/);
absent("renderResources is gone", /function renderResources\(/);
absent("no current-extract module", /"current-extract"/);
absent("no resources module entry", /\["resources", "Resources"\]/);
has("inventory module exists", /\["inventory", "Inventory"\]/);
has("inventory renderer wired", /inventory: renderInventory,/);
has("inventory tab panel exists", /id="tab-inventory"/, html);
absent("old extract panel removed", /id="tab-current-extract"/, html);
absent("old resources panel removed", /id="tab-resources"/, html);

// the dead editors that only the old Resources page used
absent("CALCULATOR_INVENTORY_GROUPS removed", /CALCULATOR_INVENTORY_GROUPS/);
absent("currentProgressEditorHtml removed", /function currentProgressEditorHtml/);
absent("resourceEditorCard removed", /function resourceEditorCard/);

// --- 2. nav is grouped, sidebar footer is tucked away ------------------------
has("nav groups defined", /const MODULE_GROUPS = \[/);
has("MODULES derived from the groups", /const MODULES = MODULE_GROUPS\.flatMap/);
has("renderNav emits groups", /<div class="nav-group">/);
has("group label styled", /\.nav-group__label \{/, css);

const groups = grab(/const MODULE_GROUPS = \[[\s\S]*?\n\];/);
const groupNames = [...groups.matchAll(/\["([A-Z][^"]*)", \[/g)].map((m) => m[1]);
check("five sidebar groups", groupNames, ["Start here", "Chief", "Heroes & Pets", "Research & Troops", "Events & Extras"]);
const tabIds = [...groups.matchAll(/\["([a-z0-9-]+)", "/g)].map((m) => m[1]);
check("every module still reachable", tabIds.length, 16);
check("no duplicate tabs", tabIds.length, new Set(tabIds).size);

has("destructive tools moved behind a disclosure", /<details class="sidebar-tools">/, html);
["exportState", "importState", "openWizard", "resetTargets", "resetState"].forEach((id) =>
  has(`${id} still present (moved, not deleted)`, new RegExp(`id="${id}"`), html));
has("reset marked as dangerous", /id="resetState" class="danger"/, html);

// --- 3. rows are editable and write the canonical path -----------------------
has("material rows bind to resources.<key>", /numberInput\(`resources\.\$\{key\}`, value\)/);
has("reservations editable on the same row", /numberInput\(`resource_reservations\.\$\{key\}`, reserved\)/);
has("chief gear tier editable", /data-path="chief_gear\.\$\{slot\.slot_id\}\.current"/);
has("charm level editable", /data-path="charms\.\$\{slotId\}\.current"/);
has("building level editable", /data-path="buildings\.\$\{building\.building_id\}\.current"/);
has("pet level editable", /data-path="pets\.\$\{pet\.pet_id\}\.current"/);
has("expert level editable", /data-path="experts\.\$\{expert\.expert_id\}\.relationship_current"/);
has("hero gear mastery editable", /extracted_current\.hero_gear\.\$\{heroId\}\.gear\.\$\{slot\}\.level/);
has("profile fields editable", /textInput\("profile\.chief_name", profile\.chief_name\)/);

// every field the calculators consume must appear in a group
const groupBlock = grab(/const INVENTORY_MATERIAL_GROUPS = \[[\s\S]*?\n\];/);
const grouped = new Set([...groupBlock.matchAll(/"([a-z0-9_]+)"/g)].map((m) => m[1]));
[
  "meat", "wood", "coal", "iron", "steel", "fire_crystals", "refined_fire_crystals", "fire_crystal_shards",
  "hardened_alloy", "polishing_solution", "design_plans", "lunar_amber",
  "charm_guides", "charm_designs", "charm_secrets",
  "hero_gear_xp", "mythic_gear", "mithril", "essence_stones", "widgets",
  "pet_manuals", "pet_potions", "pet_serum", "pet_food", "pet_custom_chests",
  "expert_affinity", "books_of_knowledge",
].forEach((key) => check(`${key} has a home`, grouped.has(key), true));

// values that previously had no editor anywhere
["diamonds", "expert_sigils", "match_stakes", "trek_attempts", "trek_compass", "wonderstar_coins", "warhymn_testaments", "mystery_badges", "chief_stamina", "fire_crystal_embers"]
  .forEach((key) => check(`${key} is now editable`, grouped.has(key), true));

has("unclaimed keys still get a section", /id: "mat-other"/);
has("per-expert sigils get their own section", /id: "mat-sigils"/);

// --- 4. capture diff ---------------------------------------------------------
has("diff is computed on apply", /const changes = captureDiffEntries\(beforeCapture, next\);/);
has("diff records the previous value", /changes\.push\(\{ path: `\$\{prefix\}\.\$\{key\}`, key, label: label\(key\), section, from: Number\(from\), to: Number\(to\) \}\)/);
has("diff panel rendered", /function inventoryCaptureDiffHtml\(\)/);
has("diff can be dismissed", /data-inv-diff-dismiss/);

const diffFn = new Function(`
  const RESOURCE_LABELS = { lunar_amber: "Amber" };
  const titleFromId = (s) => s;
  ${grab(/const CAPTURE_DIFF_WATCH = \[[\s\S]*?\n\];/)}
  ${grab(/function captureDiffEntries\([\s\S]*?\n\}/)}
  return captureDiffEntries;
`)();
const before = { resources: { lunar_amber: 500, mithril: 18, coal: 7, brand_new: undefined } };
const after = { resources: { lunar_amber: 1234, mithril: 99, coal: 7, wood: 42 } };
const entries = diffFn(before, after);
check("only changed fields are reported", entries.map((e) => e.key), ["lunar_amber", "mithril"]);
check("biggest move first", entries[0].key, "lunar_amber");
check("carries the previous value", entries[0].from, 500);
check("carries the new value", entries[0].to, 1234);
check("unchanged value ignored", entries.some((e) => e.key === "coal"), false);
check("brand-new key is not a 'change'", entries.some((e) => e.key === "wood"), false);

// --- 5. editing must not re-render the whole page ---------------------------
has("inventory edits skip the re-render", /const onInventory = activeTab === "inventory" && target\.closest\("#tab-inventory"\)/);
has("saves without render on this page", /scheduleSave\(\{ render: false \}\);\n      return;/);
has("fineprint refreshed in place", /fineprint\.innerHTML = resourceFineprintHtml\(key, rawInventoryValue\(key\)\)/);
has("reset-to-capture offered when values drift", /data-inv-reset=/);
has("reset writes the captured number back", /setPath\(state, `resources\.\$\{key\}`, captured\)/);

// --- 6. clutter is split out, not dumped ------------------------------------
has("blank hero gear separated", /id: "prog-hero-gear-blank"/);
has("unowned heroes separated", /id: "ros-heroes-unowned"/);
has("empty troop tiers separated", /id: "ros-troops-empty"/);
has("search box present", /id="extractSearch"/);
has("filter runs against the inventory tab", /const root = \$\("#tab-inventory"\)/);
has("view state persisted under inventory_view", /inventory_view\.open/);
absent("no leftover extract_view writes", /setPath\(state, "extract_view/);

console.log(failed ? `\n${failed} FAILED` : "\nAll inventory checks passed");
process.exit(failed ? 1 : 0);
