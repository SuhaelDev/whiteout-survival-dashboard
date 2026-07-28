// The enhancement badge on a hero gear tile.
//
// Two tracks, and they must not be confused. Below mastery 11 a piece is on the regular
// enhancement track: the level shows plainly, no plus sign and no coloured box, because the
// band colours belong to empowerment. At mastery 11 and up the piece is ascended and the
// value is empowerment, shown as +N in a pill coloured by which breakpoint it has passed.
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");

const bandFn = src.match(/function heroGearEnhancementBand\([\s\S]*?\n\}/);
if (!bandFn) { console.log("FAIL - heroGearEnhancementBand not found"); process.exit(1); }
const band = new Function(bandFn[0] + "; return heroGearEnhancementBand;")();

let failed = 0;
const check = (name, got, want) => {
  const ok = got === want;
  console.log(ok ? "PASS" : `FAIL (got ${got}, want ${want})`, "-", name);
  if (!ok) failed++;
};

// Bands sampled from the in-game grid, one per empowerment breakpoint.
[
  [1, "base"], [19, "base"],
  [20, "early"], [39, "early"],
  [40, "low"], [59, "low"],
  [60, "mid"], [79, "mid"],
  [80, "high"], [99, "high"],
  [100, "max"],
].forEach(([step, want]) => check(`+${step} is ${want}`, band(step), want));

// Boundaries are the breakpoints themselves, so a band must never start one early.
[20, 40, 60, 80, 100].forEach((bp) => {
  check(`+${bp - 1} and +${bp} differ`, band(bp - 1) === band(bp), false);
});

// Values confirmed against the game screenshots
check("+100 red (game: 239,56,57)", band(100), "max");
check("+99 orange (game: 231,114,41)", band(99), "high");
check("+80 orange", band(80), "high");
check("+60 purple (game: 140,69,214)", band(60), "mid");
check("+59 blue", band(59), "low");
check("+40 blue (game: 77,130,206)", band(40), "low");

// The tile must pick the plain style off mastery, not off the enhancement value.
const tileFn = src.match(/function heroGearTileHtml\([\s\S]*?\n\}\n/);
if (!tileFn) { console.log("FAIL - heroGearTileHtml not found"); process.exit(1); }
const tileSrc = tileFn[0];
check("plain style is gated on ascension", /ascended[\s\S]*?hg-tile__step--plain/.test(tileSrc), true);
check("plus sign only on the ascended branch", (tileSrc.match(/\+\$\{fmt\(enhancement\)\}/g) || []).length, 1);
check("plain branch prints the bare level", /hg-tile__step--plain">\$\{fmt\(enhancement\)\}/.test(tileSrc), true);

// Every band needs a colour rule, or a tile renders an invisible pill.
const css = fs.readFileSync(path.join(__dirname, "..", "src", "styles.css"), "utf8");
["base", "early", "low", "mid", "high", "max", "plain"].forEach((b) => {
  check(`css defines --${b}`, css.includes(`.hg-tile__step--${b}`), true);
});

console.log(failed ? `\n${failed} FAILED` : "\nAll hero gear badge checks passed");
process.exit(failed ? 1 : 0);
