// Supabase Edge Function: ai-proxy
// Proxies AI API calls (Anthropic Claude + Google Gemini) without exposing keys to the browser.
// Auth: requires a valid Supabase JWT (enforced automatically by Supabase unless verify_jwt = false).

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info",
};

type Provider = "claude" | "gemini-image" | "gemini-veo";

interface ProxyRequest {
  provider: Provider;
  body: Record<string, unknown>;
}

const CLAUDE_ENDPOINT = "https://api.anthropic.com/v1/messages";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image";
const GEMINI_VEO_MODEL = "veo-3.0-generate-001";
const CLAUDE_MODEL = "claude-sonnet-4-6";

async function callClaude(body: Record<string, unknown>) {
  const key = Deno.env.get("CLAUDE_API_KEY");
  if (!key) return new Response(JSON.stringify({ error: "CLAUDE_API_KEY not configured" }), { status: 500 });

  const payload = {
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    ...body,
  };

  const res = await fetch(CLAUDE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } });
}

async function callGemini(model: string, body: Record<string, unknown>, action: string) {
  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), { status: 500 });

  const url = `${GEMINI_BASE}/${model}:${action}?key=${key}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } });
}

function decodeJwtRole(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });

  const role = decodeJwtRole(req.headers.get("authorization"));
  if (role !== "authenticated") {
    return new Response(JSON.stringify({ error: "Authenticated user required" }), { status: 403, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  }

  let payload: ProxyRequest;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  }

  const { provider, body } = payload;
  if (!provider || !body) {
    return new Response(JSON.stringify({ error: "Missing provider or body" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  }

  let upstream: Response;
  switch (provider) {
    case "claude":
      upstream = await callClaude(body);
      break;
    case "gemini-image":
      upstream = await callGemini(GEMINI_IMAGE_MODEL, body, "generateContent");
      break;
    case "gemini-veo":
      upstream = await callGemini(GEMINI_VEO_MODEL, body, "predictLongRunning");
      break;
    default:
      return new Response(JSON.stringify({ error: `Unknown provider: ${provider}` }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
  }

  const upstreamBody = await upstream.text();
  return new Response(upstreamBody, {
    status: upstream.status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
