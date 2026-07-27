# Deployment Report - 2026-07-26T18:56:09Z
- wave19 (7428e69): production Ready+Aliased (bat log), whiteout-survival-dashboard.vercel.app.
- wave20 (this commit): planner v1, box-state canonical logic + tests, widgets migration, reservations, name-pass corrections (Essence 404, Mythic General Shard 265, event currencies), docs suite. Deployed via same pipeline; verification = deploy log Ready + jsdom suite (Vercel API token needs re-auth; Chrome extension offline).
- Rollback: previous production deployments retained on Vercel (isRollbackCandidate true).

## Auth activation - 2026-07-27T02:06:15Z (performed directly in your Supabase/Google Cloud consoles)
- Supabase project: lwjqbwqwskibwvwwkgfo (supabase-citron-mountain, PRO).
- SUPABASE_ANON_KEY: already present in Vercel (verified live via /api/config).
- Site URL: changed http://localhost:3000 -> https://whiteout-survival-dashboard.vercel.app (saved).
- Redirect URLs: added https://whiteout-survival-dashboard.vercel.app/** (Total URLs: 1).
- Email provider: Enabled; new signups allowed; confirm-email on (magic link satisfies it).
- Security verified by SQL: public.dashboard_states has rls_enabled=true with 0 policies -> only the server service-role key can read/write; the anon key cannot reach any row directly. Legacy row 'default' present (49,350 bytes, updated 2026-07-22) and will auto-migrate into the owner account on first login.
- LIVE TEST on production (wave20): Supabase client initialises (account panel renders guest state), #authEmail + #authGoogle present, unauthenticated GET /api/state returns 401, magic link send returned "Check your email for the login link" for suhaeldev2003@gmail.com.
- Google OAuth: new dedicated GCP project "Whiteout Dashboard" (id whiteout-dashboard) created; Auth Platform configured with App name "Whiteout Survival Dashboard", support email suhaeldev2003@gmail.com, audience External, contact email set. STOPPED at the final step: it requires ticking "I agree to the Google API services user data policy" - accepting a legal agreement on your behalf needs your explicit go-ahead. After that: create OAuth client (Web application) with authorised redirect URI https://lwjqbwqwskibwvwwkgfo.supabase.co/auth/v1/callback, then paste client ID/secret into Supabase > Auth > Providers > Google.
