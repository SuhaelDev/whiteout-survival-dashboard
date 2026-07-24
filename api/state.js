"use strict";

const DEFAULT_TABLE = "dashboard_states";
const DEFAULT_STATE_ID = "default";
const DEFAULT_OWNER_EMAIL = "suhaeldev2003@gmail.com";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function requiredConfig() {
  return {
    supabaseUrl: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: process.env.SUPABASE_ANON_KEY,
    syncSecret: process.env.DASHBOARD_SYNC_SECRET,
    requireSyncKey: process.env.DASHBOARD_REQUIRE_SYNC_KEY === "true",
    table: process.env.SUPABASE_STATE_TABLE || DEFAULT_TABLE,
    stateId: process.env.DASHBOARD_STATE_ID || DEFAULT_STATE_ID,
    ownerEmail: (process.env.DASHBOARD_OWNER_EMAIL || DEFAULT_OWNER_EMAIL).toLowerCase(),
  };
}

function isConfigured(config) {
  return Boolean(config.supabaseUrl && config.serviceRoleKey);
}

function legacyKeyAccepted(req, config) {
  if (!config.requireSyncKey) return false;
  const header = req.headers["x-dashboard-sync-key"];
  const provided = Array.isArray(header) ? header[0] : header;
  return Boolean(provided && config.syncSecret && provided === config.syncSecret);
}

function bearerToken(req) {
  const header = req.headers.authorization;
  const value = Array.isArray(header) ? header[0] : header;
  if (!value || !/^Bearer\s+/i.test(value)) return null;
  return value.replace(/^Bearer\s+/i, "").trim() || null;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString("utf8") || "{}");
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function supabaseEndpoint(config, suffix = "") {
  const base = config.supabaseUrl.replace(/\/+$/, "");
  return `${base}/rest/v1/${encodeURIComponent(config.table)}${suffix}`;
}

function supabaseHeaders(config, extra = {}) {
  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function verifyUser(config, jwt) {
  const base = config.supabaseUrl.replace(/\/+$/, "");
  const response = await fetch(`${base}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: config.anonKey || config.serviceRoleKey,
      Authorization: `Bearer ${jwt}`,
    },
  });
  if (!response.ok) return null;
  const body = await response.json().catch(() => null);
  if (!body || !body.id) return null;
  return { id: body.id, email: String(body.email || "").toLowerCase() };
}

async function readStateRow(config, rowId) {
  const query = `?id=eq.${encodeURIComponent(rowId)}&select=id,state,updated_at&limit=1`;
  const response = await fetch(supabaseEndpoint(config, query), {
    method: "GET",
    headers: supabaseHeaders(config),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(body || `Supabase read failed with ${response.status}`);
  const rows = JSON.parse(body || "[]");
  return rows[0] || null;
}

async function writeStateRow(config, rowId, dashboardState) {
  const response = await fetch(supabaseEndpoint(config), {
    method: "POST",
    headers: supabaseHeaders(config, { Prefer: "resolution=merge-duplicates,return=representation" }),
    body: JSON.stringify({
      id: rowId,
      state: dashboardState,
      updated_at: new Date().toISOString(),
    }),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(body || `Supabase write failed with ${response.status}`);
  const rows = JSON.parse(body || "[]");
  return rows[0] || null;
}

module.exports = async function stateHandler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  const config = requiredConfig();
  if (!isConfigured(config)) {
    sendJson(res, 503, {
      error: "Cloud sync is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
    });
    return;
  }

  try {
    // Resolve the caller: signed-in Supabase user (per-user row) or legacy sync key (shared row).
    const jwt = bearerToken(req);
    let rowId = null;
    let user = null;
    if (jwt) {
      user = await verifyUser(config, jwt);
      if (!user) {
        sendJson(res, 401, { error: "Your session has expired. Sign in again to sync." });
        return;
      }
      rowId = `user_${user.id}`;
    } else if (legacyKeyAccepted(req, config)) {
      rowId = config.stateId;
    } else {
      sendJson(res, 401, { error: "Sign in to sync your dashboard to the cloud." });
      return;
    }

    if (req.method === "GET") {
      let row = await readStateRow(config, rowId);
      // First login for the dashboard owner: migrate the legacy shared row into their account.
      if (!row && user && user.email === config.ownerEmail) {
        const legacy = await readStateRow(config, config.stateId);
        if (legacy && legacy.state) {
          const migrated = { ...legacy.state, owner_profile: true };
          row = await writeStateRow(config, rowId, migrated);
        }
      }
      sendJson(res, 200, row ? { state: row.state, updated_at: row.updated_at } : { state: null, updated_at: null });
      return;
    }

    if (req.method === "PUT") {
      const payload = await readJsonBody(req);
      if (!payload || typeof payload.state !== "object" || Array.isArray(payload.state)) {
        sendJson(res, 400, { error: "Request body must include a dashboard state object." });
        return;
      }
      if (user && user.email === config.ownerEmail && payload.state.owner_profile !== true) {
        payload.state.owner_profile = true;
      }
      const row = await writeStateRow(config, rowId, payload.state);
      sendJson(res, 200, { ok: true, updated_at: row?.updated_at || new Date().toISOString() });
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    const status = error instanceof SyntaxError ? 400 : 500;
    sendJson(res, status, { error: error.message });
  }
};
