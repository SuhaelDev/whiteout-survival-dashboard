# Data Layer - 2026-07-26T18:56:09Z
Current production shape (pragmatic, not the full Phase-3 normalization):
- Supabase table dashboard_states(id text pk, state jsonb, updated_at timestamptz): rows 'default' (legacy owner) + 'user_<uuid>' per account. Server-side service key only; JWT verified via /auth/v1/user; owner auto-migration on first login.
- Static game data: data/game-data.json (versioned via git + ASSET_CACHE_VERSION), provenance blocks embedded per migration.
- Player state: profile, per-module current/targets, resources, reservations, planner weights, extracted_current (owner capture) with inventory_snapshot + name-pass evidence.
Phase-3 full normalization (users/profiles/items/snapshots/asset tables) remains roadmap; current model preserves raw stacks (snapshot doc) + normalized fields.
