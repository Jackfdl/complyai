// Seeding della libreria di riferimento in Supabase (pgvector) — D21.
// Da lanciare una volta (e a ogni aggiornamento di snippets.ts):
//   curl -X POST -H "Authorization: Bearer <CRON_SECRET>" .../api/contracts/seed-snippets
import { createClient } from "@supabase/supabase-js";
import { embedTexts, isEmbeddingConfigured } from "@/lib/embeddings";
import { REFERENCE_SNIPPETS, SNIPPETS_VERSION } from "@/lib/contracts/snippets";

export const maxDuration = 60;

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service || !isEmbeddingConfigured()) {
    return Response.json({ error: "not configured" }, { status: 503 });
  }

  const embeddings = await embedTexts(REFERENCE_SNIPPETS.map((s) => s.text));
  if (!embeddings) {
    return Response.json({ error: "embedding failed" }, { status: 502 });
  }

  const admin = createClient(url, service, { auth: { persistSession: false } });
  const rows = REFERENCE_SNIPPETS.map((s, i) => ({
    id: s.id,
    category: s.category,
    kind: s.kind,
    lang: s.lang,
    text: s.text,
    embedding: JSON.stringify(embeddings[i]),
    version: SNIPPETS_VERSION,
  }));
  const { error } = await admin
    .from("clause_snippets")
    .upsert(rows, { onConflict: "id" });
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ ok: true, seeded: rows.length, version: SNIPPETS_VERSION });
}
