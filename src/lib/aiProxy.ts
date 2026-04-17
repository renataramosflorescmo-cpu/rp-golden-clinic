import { supabase } from "./supabase";

const FUNCTION_URL = "https://bggqklkeqdmkefvrjuka.supabase.co/functions/v1/ai-proxy";

type Provider = "claude" | "gemini-image" | "gemini-veo";

async function callProxy<T = any>(provider: Provider, body: Record<string, unknown>): Promise<T> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("Sessão expirada. Faça login novamente.");

  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ provider, body }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText.slice(0, 300));
  }
  return res.json();
}

export function claudeMessage(body: { messages: Array<{ role: string; content: string }>; max_tokens?: number }) {
  return callProxy<{ content: Array<{ text: string }> }>("claude", body);
}

export function geminiImage(body: Record<string, unknown>) {
  return callProxy("gemini-image", body);
}

export function geminiVeo(body: Record<string, unknown>) {
  return callProxy("gemini-veo", body);
}
