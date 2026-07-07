// Client LLM condiviso — SOLO server-side (API route): la chiave non tocca mai il browser.
// Provider-agnostico: qualunque endpoint OpenAI-compatibile via env (D14).
//   LLM_BASE_URL  es. https://api.mistral.ai/v1  (o https://api.groq.com/openai/v1)
//   LLM_API_KEY   chiave del provider
//   LLM_MODEL     es. mistral-small-latest

export function isLlmConfigured(): boolean {
  return Boolean(
    process.env.LLM_BASE_URL && process.env.LLM_API_KEY && process.env.LLM_MODEL
  );
}

/** Esegue una chat completion; null su qualunque errore (il chiamante ha un fallback). */
export async function callChatCompletion(
  prompt: string,
  timeoutMs = 45000
): Promise<string | null> {
  if (!isLlmConfigured()) return null;
  try {
    const res = await fetch(`${process.env.LLM_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${process.env.LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL,
        temperature: 0,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const content: unknown = data?.choices?.[0]?.message?.content;
    return typeof content === "string" ? content : null;
  } catch {
    return null;
  }
}

/** Estrae il primo blocco JSON {...} da una risposta, tollerando code fence e testo attorno. */
export function extractJsonBlock(raw: string): unknown | null {
  const cleaned = raw.replace(/```(?:json)?/gi, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}
