// Gear sets are the durable thing; the hero is an assignment you can change at will.
//
// In game, mastery level and Gear XP live on the gear and move with it when you put a set
// on someone else. Only exclusive-gear widgets are hero-bound. The planner used to infer
// which heroes held the five sets by ranking the game read, so a hero from a newer
// generation could never receive one. These checks pin the replacement: an explicit,
// editable set roster whose investment survives being reassigned.
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const ROOT = path.join(__dirname, "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p.split("?")[0]), "utf8"));

let failed = 0;
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed += 1;
  console.log(`${ok ? "PASS" : "FAIL"} - ${name}${ok ? "" : ` (got ${JSON.stringify(got)}, want ${JSON.stringify(want)})`}`);
};
const ok = (name, cond, detail = "") => {
  if (!cond) failed += 1;
  console.log(`${cond ? "PASS" : "FAIL"} - ${name}${cond ? "" : ` :: ${detail}`}`);
};

function boot(savedState) {
  const dom = new JSDOM(fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), {
    runScripts: "outside-only",
    url: "https://x.test/",
  });
  const w = dom.window;
  w.fetch = async (u) => {
    u = String(u);
    if (u.startsWith("/api/")) return { ok: false, status: 401, json: async () => ({}) };
    try {
      return { ok: true, json: async () => read(u) };
    } catch {
      return { ok: false, json: async () => ({}) };
    }
  };
  w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  w.requestAnimationFrame = (fn) => setTimeout(fn, 0);
  w.confirm = () => true;
  w.localStorage.clear();
  w.localStorage.setItem("wos-personal-dashboard-state-v1", JSON.stringify(savedState));
  const errors = [];
  w.addEventListener("error", (e) => errors.push(String(e.error || e.message)));
  let code = fs.readFileSync(path.join(ROOT, "src/app.js"), "utf8").replace(/^\s*import .*$/gm, "");
  code += "\n;window.__st=()=>state;window.__render=()=>renderActive();window.__setTab=(t)=>{activeTab=t;};\n";
  w.eval(code);
  return { w, errors };
}

(async () => {
  const saved = read("data/current-player-state.json");
  saved.owner_profile = true;
  saved.extract_applied_capture = "live-read-2026-07-27c";
  saved.last_saved = new Date().toISOString();

  const { w, errors } = boot(saved);
  await new Promise((r) => setTimeout(r, 2000));
  const st = w.__st();

  // --- 1. the old inference becomes an editable roster, once -----------------
  ok("no uncaught errors on load", errors.length === 0, errors.join(" | "));
  check("the five invested loadouts became five sets", Object.keys(st.hero_gear_sets || {}).sort(), [
    "infantry_1", "infantry_2", "lancer_1", "marksman_1", "marksman_2",
  ]);
  check("infantry_1 kept edith", st.hero_gear_sets.infantry_1.hero_id, "edith");
  check("marksman_2 kept gwen", st.hero_gear_sets.marksman_2.hero_id, "gwen");
  check("the levels came across with the set", st.hero_gear_sets.infantry_1.gear.bottom_left.level, 16);
  ok("per-hero targets moved onto the set", Boolean(st.hero_gear_targets.sets.infantry_1));

  // --- 2. every set offers a picker over the owned roster --------------------
  w.__setTab("hero-gear");
  w.__render();
  const tab = w.document.querySelector("#tab-hero-gear");
  const picker = tab.querySelector("select[data-path='hero_gear_sets.infantry_1.hero_id']");
  ok("infantry_1 has a hero picker", Boolean(picker));
  check("the picker shows who has it", picker.value, "edith");
  const values = [...picker.querySelectorAll("option")].map((o) => o.value);
  ok("other owned heroes are selectable", values.includes("jeronimo"));
  ok("a set can be left unassigned", values.includes(""));
  check("one add button per troop line", tab.querySelectorAll("[data-hero-gear-add-set]").length, 3);
  check("one remove button per set", tab.querySelectorAll("[data-hero-gear-remove-set]").length, 5);

  // --- 3. the investment follows the gear, not the hero ----------------------
  const before = JSON.parse(JSON.stringify(st.hero_gear_sets.infantry_1.gear));
  const widgetsBefore = st.heroes.edith.current_widget_level;
  picker.value = "jeronimo";
  picker.dispatchEvent(new w.Event("change", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 300));
  check("the set moved", w.__st().hero_gear_sets.infantry_1.hero_id, "jeronimo");
  check(
    "mastery levels moved with it",
    Object.fromEntries(Object.entries(w.__st().hero_gear_sets.infantry_1.gear).map(([k, v]) => [k, v.level])),
    Object.fromEntries(Object.entries(before).map(([k, v]) => [k, v.level])),
  );
  check(
    "enhancement moved with it",
    w.__st().hero_gear_sets.infantry_1.gear.top_left.enhancement,
    before.top_left.enhancement,
  );
  check("widgets stayed on the hero", w.__st().heroes.edith.current_widget_level, widgetsBefore);

  // --- 4. new generations need no code change -------------------------------
  const game = read("data/game-data.json");
  const newest = game.heroes
    .filter((h) => h.troop_type === "Infantry")
    .sort((a, b) => Number(b.generation || 0) - Number(a.generation || 0))[0];
  ok("the game data carries a newest-generation infantry hero", Number(newest.generation || 0) > 7, String(newest.generation));
  w.__st().heroes[newest.hero_id] = { ...(w.__st().heroes[newest.hero_id] || {}), owned: true };
  w.__render();
  const picker2 = w.document.querySelector("#tab-hero-gear select[data-path='hero_gear_sets.infantry_1.hero_id']");
  ok(
    `Gen ${newest.generation} ${newest.name} appears once ticked Owned`,
    [...picker2.querySelectorAll("option")].some((o) => o.value === newest.hero_id),
  );
  picker2.value = newest.hero_id;
  picker2.dispatchEvent(new w.Event("change", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 300));
  check("the set went onto the new hero", w.__st().hero_gear_sets.infantry_1.hero_id, newest.hero_id);
  check(
    "with its levels intact",
    w.__st().hero_gear_sets.infantry_1.gear.bottom_left.level,
    before.bottom_left.level,
  );

  // --- 5. the roster grows and shrinks ---------------------------------------
  w.document
    .querySelector("#tab-hero-gear [data-hero-gear-add-set='lancer']")
    .dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 300));
  ok("a second lancer set can be added", Boolean(w.__st().hero_gear_sets.lancer_2));
  check("it starts unassigned", w.__st().hero_gear_sets.lancer_2.hero_id, "");
  check("with four empty slots", Object.keys(w.__st().hero_gear_sets.lancer_2.gear).sort(), [
    "bottom_left", "bottom_right", "top_left", "top_right",
  ]);
  w.document
    .querySelector("#tab-hero-gear [data-hero-gear-remove-set='lancer_2']")
    .dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  await new Promise((r) => setTimeout(r, 300));
  ok("and removed again", !w.__st().hero_gear_sets.lancer_2);

  // --- 6. none of it is lost on reload --------------------------------------
  const persisted = JSON.parse(w.localStorage.getItem("wos-personal-dashboard-state-v1"));
  const reloaded = boot(persisted);
  await new Promise((r) => setTimeout(r, 2000));
  ok("no errors on reload", reloaded.errors.length === 0, reloaded.errors.join(" | "));
  check("the assignment persisted", reloaded.w.__st().hero_gear_sets.infantry_1.hero_id, newest.hero_id);
  check(
    "the investment persisted",
    reloaded.w.__st().hero_gear_sets.infantry_1.gear.bottom_left.level,
    before.bottom_left.level,
  );
  check("seeding did not run a second time", Object.keys(reloaded.w.__st().hero_gear_sets).sort(), [
    "infantry_1", "infantry_2", "lancer_1", "marksman_1", "marksman_2",
  ]);

  console.log(failed ? `\n${failed} FAILED` : "\nAll hero gear set checks passed");
  process.exit(failed ? 1 : 0);
})().catch((e) => {
  console.error("TEST ERROR", e);
  process.exit(1);
});
