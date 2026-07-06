// Analisi policy → matrice controlli. POST autenticato (la quota LLM è condivisa:
// niente endpoint aperto ad anonimi). Fallback euristico se l'LLM manca o fallisce.
import { createClient } from "@supabase/supabase-js";
import { analyzeHeuristic } from "@/lib/mapper/heuristics";
import { MAX_POLICY_CHARS, analyzeWithLlm, isLlmConfigured } from "@/lib/mapper/llm";

export const maxDuration = 60;

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return Response.json({ error: "not configured" }, { status: 503 });
  }

  // Autenticazione: token utente Supabase nel header Authorization.
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
  if (text.length < 40) {
    return Response.json({ error: "text too short" }, { status: 400 });
  }
  if (text.length > MAX_POLICY_CHARS) {
    return Response.json(
      { error: `text too long (max ${MAX_POLICY_CHARS} chars)` },
      { status: 413 }
    );
  }

  if (isLlmConfigured()) {
    const rows = await analyzeWithLlm(text, locale);
    if (rows) {
      return Response.json({ rows, engine: "llm" });
    }
    // LLM configurato ma non ha risposto/validato → fallback dichiarato
    const fallback = analyzeHeuristic(text, locale);
    return Response.json({ ...fallback, warning: "llm-fallback" });
  }

  return Response.json(analyzeHeuristic(text, locale));
}
