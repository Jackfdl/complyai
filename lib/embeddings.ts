// Embeddings — SOLO server-side. Usa lo stesso provider LLM già configurato (D14):
// richiede un endpoint /embeddings OpenAI-compatibile (Mistral: mistral-embed, 1024 dim).
//   EMBED_MODEL (opzionale, default "mistral-embed")

export const EMBEDDING_DIMENSIONS = 1024;

export function isEmbeddingConfigured(): boolean {
  return Boolean(process.env.LLM_BASE_URL && process.env.LLM_API_KEY);
}

/** Embedding in batch; null su qualunque errore (il chiamante degrada senza RAG). */
export async function embedTexts(
  texts: string[],
  timeoutMs = 30000
): Promise<number[][] | null> {
  if (!isEmbeddingConfigured() || texts.length === 0) return null;
  try {
    const res = await fetch(`${process.env.LLM_BASE_URL}/embeddings`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.EMBED_MODEL ?? "mistral-embed",
        input: texts,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data?.data)) return null;
    const out: number[][] = [];
    for (const item of data.data) {
      if (!Array.isArray(item?.embedding)) return null;
      out.push(item.embedding as number[]);
    }
    return out.length === texts.length ? out : null;
  } catch {
    return null;
  }
}
