// Analisi contratto → memo di revisione. POST autenticato; fallback su libreria locale.
import { createClient } from "@supabase/supabase-js";
import { analyzeContract } from "@/lib/contracts/analyze";
import { MAX_CONTRACT_CHARS, analyzeContractWithLlm, isLlmConfigured } from "@/lib/contracts/llm";

export const maxDuration = 60;

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return Response.json({ error: "not configured" }, { status: 503 });
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "unauthorized" }, { status: 401 });
  const supabase = createClient(url, anon, { auth: { persistSession: false } });
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData.user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: { text?: string; locale?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid body" }, { status: 400 });
  }
  const text = (body.text ?? "").trim();
  const locale = body.locale === "en" ? "en" : "it";
  if (text.length < 200) {
    return Response.json({ error: "text too short" }, { status: 400 });
  }
  if (text.length > MAX_CONTRACT_CHARS) {
    return Response.json(
      { error: `text too long (max ${MAX_CONTRACT_CHARS} chars)` },
      { status: 413 }
    );
  }

  if (isLlmConfigured()) {
    const result = await analyzeContractWithLlm(text, locale);
    if (result) return Response.json(result);
    const fallback = analyzeContract(text, locale);
    return Response.json({ ...fallback, warning: "llm-fallback" });
  }

  return Response.json(analyzeContract(text, locale));
}
