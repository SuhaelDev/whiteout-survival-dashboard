// Canonical hero-gear progression box states (green/blue/grey/invalid).
// Run: node tests/hero-gear-states.test.js
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "..", "src", "app.js"), "utf8");
const fnMatch = src.match(/function heroGearEmpowermentRowState\([\s\S]*?\n\}/);
if (!fnMatch) { console.log("FAIL - function not found"); process.exit(1); }
const rowState = new Function(fnMatch[0] + "; return heroGearEmpowermentRowState;")();

let failed = 0;
const check = (name, got, want) => { const ok = got === want; console.log(ok ? "PASS" : `FAIL (got ${got}, want ${want})`, "-", name); if (!ok) failed++; };
const BP = [20, 40, 60, 80, 100];

// current == target: no blue anywhere
BP.forEach((e) => check(`cur=tgt=60, +${e} never targeted`, rowState(e, 60, 60), e <= 60 ? "unlocked" : "locked"));
// first level to first level
check("cur=0 tgt=0 +20 locked", rowState(20, 0, 0), "locked");
// first to maximum: all blue
BP.forEach((e) => check(`cur=0 tgt=100 +${e} targeted`, rowState(e, 0, 100), "targeted"));
// mid to higher target
check("cur=40 tgt=80 +20 green", rowState(20, 40, 80), "unlocked");
check("cur=40 tgt=80 +40 green (current step is green)", rowState(40, 40, 80), "unlocked");
check("cur=40 tgt=80 +60 blue", rowState(60, 40, 80), "targeted");
check("cur=40 tgt=80 +80 blue (boundary inclusive)", rowState(80, 40, 80), "targeted");
check("cur=40 tgt=80 +100 grey", rowState(100, 40, 80), "locked");
// maximum to maximum
BP.forEach((e) => check(`cur=tgt=100 +${e} green`, rowState(e, 100, 100), "unlocked"));
// invalid: target below current
check("tgt<cur invalid", rowState(60, 80, 60), "invalid");
// invalid inputs
check("NaN enhancement invalid", rowState("x", 40, 80), "invalid");
check("zero/negative step invalid", rowState(0, 40, 80), "invalid");
// tier boundary: exactly at current
check("+100 at cur=100 green", rowState(100, 100, 100), "unlocked");
// default target = current when null
check("null target defaults to current", rowState(60, 60, null), "unlocked");
check("null target above current locked", rowState(80, 60, null), "locked");

process.exit(failed ? 1 : 0);
