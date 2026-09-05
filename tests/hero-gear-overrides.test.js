// Overrides must be reversible: correcting one has to change the rendered value, and
// clearing one has to fall back to the game read.
//
// Corrections are keyed by gear SET, not by hero, because a set moves between heroes and
// its levels move with it. The set keeps a pristine gear_baseline (the game read) and the
// working copy is rebuilt from it on every load, so a correction can always be undone.
const fs=require("fs");
const P=require("path").join(__dirname,"..");
const {JSDOM}=require("jsdom");
const dom=new JSDOM(fs.readFileSync(P+"/index.html","utf8"),{runScripts:"outside-only",url:"https://x.test/"});
const w=dom.window;
const read=p=>JSON.parse(fs.readFileSync(P+"/"+p.split("?")[0],"utf8"));
w.fetch=async u=>{u=String(u); if(u.startsWith("/api/"))return{ok:false,status:401,json:async()=>({})};
  try{return{ok:true,json:async()=>read(u)};}catch{return{ok:false,json:async()=>({})};}};
w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
w.requestAnimationFrame=fn=>setTimeout(fn,0);
w.localStorage.clear();
// simulate the user's real state: a correct override, but a saved extract already
// polluted with the OLD wrong value, which is exactly what was on the live account.
// gwen holds Marksman Set 2, so the correction is keyed marksman_2.
const saved=read("data/current-player-state.json");
saved.owner_profile=true;
saved.extract_applied_capture="live-read-2026-07-27c";
saved.last_saved=new Date().toISOString();
saved.hero_gear_current_overrides={marksman_2:{top_right:{enhancement:"40"}}};
saved.extracted_current.hero_gear.gwen.gear.top_right.enhancement=50;
saved.extracted_current.hero_gear.gwen.gear.top_right.visible_enhancement=50;
w.localStorage.setItem("wos-personal-dashboard-state-v1",JSON.stringify(saved));
let code=fs.readFileSync(P+"/src/app.js","utf8").replace(/^\s*import .*$/gm,"");
code+="\n;window.__st=()=>state;\n";
(async()=>{
  w.eval(code);
  await new Promise(r=>setTimeout(r,1500));
  const st=w.__st();
  let bad=0;
  const chk=(n,got,want)=>{const ok=got===want;if(!ok)bad++;console.log(`${ok?"PASS":"FAIL"} - ${n}${ok?"":` (got ${got} want ${want})`}`);};
  chk("gwen still holds marksman set 2", st.hero_gear_sets.marksman_2.hero_id, "gwen");
  const g=st.hero_gear_sets.marksman_2.gear;
  chk("override 40 wins over a polluted saved extract", g.top_right.enhancement, 40);
  chk("pieces with no override keep the game read", g.bottom_left.enhancement, 40);
  chk("top_left untouched", g.top_left.enhancement, 50);
  // the baseline must stay pristine, or clearing the override would fall back to itself
  chk("the baseline still holds the game read", st.hero_gear_sets.marksman_2.gear_baseline.top_right.enhancement, 40);
  // clearing the override must fall back to the file, not to the polluted 50
  delete st.hero_gear_current_overrides.marksman_2;
  w.localStorage.setItem("wos-personal-dashboard-state-v1",JSON.stringify(st));
  const dom2=new JSDOM(fs.readFileSync(P+"/index.html","utf8"),{runScripts:"outside-only",url:"https://x.test/"});
  const w2=dom2.window;
  w2.fetch=w.fetch; w2.matchMedia=w.matchMedia; w2.requestAnimationFrame=fn=>setTimeout(fn,0);
  w2.localStorage.setItem("wos-personal-dashboard-state-v1",w.localStorage.getItem("wos-personal-dashboard-state-v1"));
  w2.eval(code);
  await new Promise(r=>setTimeout(r,1500));
  chk("cleared override falls back to the game read", w2.__st().hero_gear_sets.marksman_2.gear.top_right.enhancement, 40);
  console.log(bad?`\n${bad} FAILED`:"\nOverride reversibility OK");
  process.exit(bad?1:0);
})();
