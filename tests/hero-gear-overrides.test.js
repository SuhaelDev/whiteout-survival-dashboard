// Overrides must be reversible: correcting one has to change the rendered value, and
// clearing one has to fall back to the game read.
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
// simulate the user's real state: correct overrides, but a saved extract already polluted
// with the OLD wrong values, which is exactly what was on the live account
const saved=read("data/current-player-state.json");
saved.owner_profile=true;
saved.extract_applied_capture="live-read-2026-07-27c";
saved.last_saved=new Date().toISOString();
saved.hero_gear_current_overrides={gwen:{top_right:{enhancement:"40"}}};
saved.extracted_current.hero_gear.gwen.gear.top_right.enhancement=50;
saved.extracted_current.hero_gear.gwen.gear.top_right.visible_enhancement=50;
w.localStorage.setItem("wos-personal-dashboard-state-v1",JSON.stringify(saved));
let code=fs.readFileSync(P+"/src/app.js","utf8").replace(/^\s*import .*$/gm,"");
code+="\n;window.__st=()=>state;\n";
(async()=>{
  w.eval(code);
  await new Promise(r=>setTimeout(r,1500));
  const st=w.__st();
  const g=st.extracted_current.hero_gear.gwen.gear;
  let bad=0;
  const chk=(n,got,want)=>{const ok=got===want;if(!ok)bad++;console.log(`${ok?"PASS":"FAIL"} - ${n}${ok?"":` (got ${got} want ${want})`}`);};
  chk("override 40 wins over a polluted saved extract", g.top_right.enhancement, 40);
  chk("pieces with no override keep the game read", g.bottom_left.enhancement, 40);
  chk("top_left untouched", g.top_left.enhancement, 50);
  // clearing the override must fall back to the file, not to the polluted 50
  delete st.hero_gear_current_overrides.gwen;
  w.localStorage.setItem("wos-personal-dashboard-state-v1",JSON.stringify(st));
  const dom2=new JSDOM(fs.readFileSync(P+"/index.html","utf8"),{runScripts:"outside-only",url:"https://x.test/"});
  const w2=dom2.window;
  w2.fetch=w.fetch; w2.matchMedia=w.matchMedia; w2.requestAnimationFrame=fn=>setTimeout(fn,0);
  w2.localStorage.setItem("wos-personal-dashboard-state-v1",w.localStorage.getItem("wos-personal-dashboard-state-v1"));
  w2.eval(code);
  await new Promise(r=>setTimeout(r,1500));
  chk("cleared override falls back to the game read", w2.__st().extracted_current.hero_gear.gwen.gear.top_right.enhancement, 40);
  console.log(bad?`\n${bad} FAILED`:"\nOverride reversibility OK");
})();
