# Test Report - 2026-07-26T18:56:09Z
- tests/wave19-checks.js: 17/17 PASS (Gareth data integrity, charm verified steps, provenance flags).
- tests/hero-gear-states.test.js: 27/27 PASS (green/blue/grey/invalid canonical states incl. boundaries, cur=tgt, max, invalid target, NaN).
- jsdom system checks: 16/16 tabs render (guest AND owner states); Gareth renders on Experts with captured levels; sigils_gareth resource present; widgets migration (extract wins, legacy pools summed when no capture); planner v1 panels render; 66 candidates / 37 affordable; two-run determinism PASS; reservations reduce charm affordability 18->12 PASS.
- Auth scenarios (wave18 suite): guest blank + wizard; owner extract gating; magic-link/Google buttons render (live flow blocked on Supabase config).
- Production smoke: deploy log Ready + alias (Vercel API re-auth required for programmatic check; Chrome extension offline for in-browser pass - manual refresh recommended).
