// Analisi contratto → memo di revisione. POST autenticato; fallback su libreria locale.
// Arricchimento RAG (D21): ogni clausola trovata viene confrontata semanticamente
// con la libreria di riferimento (pgvector); se il confronto non è disponibile,
// l'analisi resta identica (degradazione silenziosa).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { analyzeContract } from "@/lib/contracts/analyze";
import { MAX_CONTRACT_CHARS, analyzeContractWithLlm, isLlmConfigured } from "@/lib/contracts/llm";
import { applyReferences, type SnippetMatch } from "@/lib/contracts/rag";
import { embedTexts, isEmbeddingConfigured } from "@/lib/embeddings";
import type { ContractAnalysis } from "@/lib/contracts/types";

export const maxDuration = 60;

/** Max clausole confrontate per analisi (prudenza sulla quota embeddings). */
const MAX_RAG_CLAUSES = 12;

async function enrichWithReferences(
  supabase: SupabaseClient,
  analysis: ContractAnalysis
): Promise<ContractAnalysis> {
  if (!isEmbeddingConfigured() || analysis.clauses.length === 0) return analysis;
  const subset = analysis.clauses.slice(0, MAX_RAG_CLAUSES);
  const embeddings = await embedTexts(subset.map((c) => c.excerpt));
  if (!embeddings) return analysis;

  const matches: (SnippetMatch | null)[] = [];
  for (const embedding of embeddings) {
    const { data, error } = await supabase.rpc("match_clause_snippets", {
      query_embedding: JSON.stringify(embedding),
      match_count: 1,
    });
    if (error || !Array.isArray(data) || data.length === 0) {
      matches.push(null);
      continue;
    }
    const top = data[0] as { kind: string; text: string; similarity: number };
    matches.push({
      kind: top.kind === "risky" ? "risky" : "standard",
      text: top.text,
      similarity: Number(top.similarity) || 0,
    });
  }

  const enriched = applyReferences(subset, matches);
  return {
    ...analysis,
    clauses: [...enriched, ...analysis.clauses.slice(MAX_RAG_CLAUSES)],
    ragUsed: matches.some((m) => m !== null),
  };
}

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

  let analysis: ContractAnalysis;
  if (isLlmConfigured()) {
    const result = await analyzeContractWithLlm(text, locale);
    analysis = result ?? { ...analyzeContract(text, locale), warning: "llm-fallback" };
  } else {
    analysis = analyzeContract(text, locale);
  }

  analysis = await enrichWithReferences(supabase, analysis);
  return Response.json(analysis);
}
