"use strict";

const DEFAULT_TABLE = "dashboard_states";
const DEFAULT_STATE_ID = "default";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function requiredConfig() {
  return {
    supabaseUrl: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    syncSecret: process.env.DASHBOARD_SYNC_SECRET,
    requireSyncKey: process.env.DASHBOARD_REQUIRE_SYNC_KEY === "true",
    table: process.env.SUPABASE_STATE_TABLE || DEFAULT_TABLE,
    stateId: process.env.DASHBOARD_STATE_ID || DEFAULT_STATE_ID,
  };
}

function isConfigured(config) {
  return Boolean(config.supabaseUrl && config.serviceRoleKey);
}

function isAuthorized(req, config) {
  if (!config.requireSyncKey) return true;
  const header = req.headers["x-dashboard-sync-key"];
  const provided = Array.isArray(header) ? header[0] : header;
  return Boolean(provided && config.syncSecret && provided === config.syncSecret);
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

async function readState(config) {
  const query = `?id=eq.${encodeURIComponent(config.stateId)}&select=id,state,updated_at&limit=1`;
  const response = await fetch(supabaseEndpoint(config, query), {
    method: "GET",
    headers: supabaseHeaders(config),
  });
  const body = await response.text();
  if (!response.ok) throw new Error(body || `Supabase read failed with ${response.status}`);
  const rows = JSON.parse(body || "[]");
  return rows[0] || null;
}

async function writeState(config, dashboardState) {
  const response = await fetch(supabaseEndpoint(config), {
    method: "POST",
    headers: supabaseHeaders(config, { Prefer: "resolution=merge-duplicates,return=representation" }),
    body: JSON.stringify({
      id: config.stateId,
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

  if (!isAuthorized(req, config)) {
    sendJson(res, 401, { error: "Invalid or missing dashboard sync key." });
    return;
  }

  try {
    if (req.method === "GET") {
      const row = await readState(config);
      sendJson(res, 200, row ? { state: row.state, updated_at: row.updated_at } : { state: null, updated_at: null });
      return;
    }

    if (req.method === "PUT") {
      const payload = await readJsonBody(req);
      if (!payload || typeof payload.state !== "object" || Array.isArray(payload.state)) {
        sendJson(res, 400, { error: "Request body must include a dashboard state object." });
        return;
      }
      const row = await writeState(config, payload.state);
      sendJson(res, 200, { ok: true, updated_at: row?.updated_at || new Date().toISOString() });
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    const status = error instanceof SyntaxError ? 400 : 500;
    sendJson(res, status, { error: error.message });
  }
};
