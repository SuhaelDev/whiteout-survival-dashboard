"use strict";

const ADVISOR_SYSTEM_PROMPT = [
  "You are a Whiteout Survival upgrade advisor. Use only the dashboard JSON.",
  "Do not infer hidden current levels, hidden research nodes, or unavailable chest conversions.",
  "Treat deterministic affordability, costs, and gaps as authoritative.",
  "Return a concise prioritized plan with risks and data gaps.",
].join(" ");

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}");
  }
  if (Buffer.isBuffer(req.body)) {
    return JSON.parse(req.body.toString("utf8") || "{}");
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

function extractResponseText(result) {
  if (result.output_text && result.output_text.trim()) return result.output_text;

  const parts = [];
  for (const item of result.output || []) {
    for (const content of item.content || []) {
      if (content.text) parts.push(content.text);
    }
  }
  return parts.join("\n");
}

module.exports = async function advisorHandler(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    sendJson(res, 503, { error: "OPENAI_API_KEY is not set for the Vercel advisor function." });
    return;
  }

  try {
    const payload = await readJsonBody(req);
    const model = process.env.OPENAI_MODEL || "gpt-5-mini";
    const maxOutputTokens = Number.parseInt(process.env.OPENAI_MAX_OUTPUT_TOKENS || "4000", 10);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          { role: "system", content: ADVISOR_SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(payload) },
        ],
        max_output_tokens: Number.isFinite(maxOutputTokens) ? maxOutputTokens : 4000,
        reasoning: { effort: process.env.OPENAI_REASONING_EFFORT || "low" },
        text: { verbosity: process.env.OPENAI_TEXT_VERBOSITY || "low" },
      }),
    });

    const text = await response.text();
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { error: text };
    }

    if (!response.ok) {
      sendJson(res, response.status, { error: result.error || result });
      return;
    }

    const advice = extractResponseText(result);
    if (!advice && result.status === "incomplete") {
      const reason = result.incomplete_details?.reason || "unknown";
      sendJson(res, 502, {
        error: `OpenAI returned an incomplete response before producing visible text (${reason}).`,
      });
      return;
    }

    sendJson(res, 200, { advice: advice || JSON.stringify(result, null, 2) });
  } catch (error) {
    const status = error instanceof SyntaxError ? 400 : 500;
    sendJson(res, status, { error: error.message });
  }
};
