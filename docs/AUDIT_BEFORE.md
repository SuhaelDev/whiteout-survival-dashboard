# AUDIT_BEFORE - 2026-07-26T17:36:52.282729+00:00
- Repo: SuhaelDev/whiteout-survival-dashboard @ main, commit 32b292a (wave18) at audit start; framework: static SPA (vanilla JS) + Vercel serverless /api; persistence: localStorage + Supabase (dashboard_states table) via /api/state; auth: Supabase magic-link (code-ready, awaiting SUPABASE_ANON_KEY + Site URL config); env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (set), SUPABASE_ANON_KEY (missing), DASHBOARD_* optional.
- Backups: backups/wave19-baseline/ (game-data, current-player-state, template + git head).
- Production at audit start: dpl_H5EgHtCwdtd1zh9P62J7FzCAwKmQ (wave17b) then wave18 32b292a READY.
- Baseline UI state: all 16 tabs render (jsdom); live site verified wave16c-wave17c earlier in session; account panel + wizard live in wave18.
- Known defects at audit time: charm workbook costs inflated (4-5x, now migrated with 3 game-verified rows); primary hero-gear extract stale vs live game (Lv16 +100 etc.) - reconciliation pending; per-gen widget model contradicted by game (single pool, migration added); essence/mithril/gearXP counts unverified; Gareth absent (now added).
- Hardcoded personal data: bundled extract gated to owner since wave18 (verified: guest state contains none).
