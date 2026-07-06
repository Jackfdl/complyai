// Analisi LLM server-side — SOLO da API route (la chiave non tocca mai il browser).
// Provider-agnostico: qualunque endpoint OpenAI-compatibile via env (D14).
//   LLM_BASE_URL  es. https://api.mistral.ai/v1  (o https://api.groq.com/openai/v1)
//   LLM_API_KEY   chiave del provider
//   LLM_MODEL     es. mistral-small-latest
import type { AnalysisResult } from "./types";

export const MAX_POLICY_CHARS = 12000;
export const MAX_ROWS = 40;

export function isLlmConfigured(): boolean {
  return Boolean(
    process.env.LLM_BASE_URL && process.env.LLM_API_KEY && process.env.LLM_MODEL
  );
}

export function buildPrompt(text: string, locale: "it" | "en"): string {
  const lang = locale === "it" ? "italiano" : "English";
  return [
    `Sei un analista di compliance. Scomponi la policy aziendale qui sotto in requisiti atomici (obblighi, divieti, raccomandazioni).`,
    `Per ogni requisito genera: un controllo operativo concreto e verificabile, il ruolo responsabile (owner), la cadenza di esecuzione e l'evidenza documentale attesa.`,
    `Rispondi in ${lang}. Rispondi SOLO con JSON valido, senza testo aggiuntivo né code fence, nel formato:`,
    `{"rows":[{"requirement":"...","control":"...","owner":"...","frequency":"...","evidence":"..."}]}`,
    `Massimo ${MAX_ROWS} righe. Non inventare requisiti assenti dal testo.`,
    ``,
    `POLICY:`,
    `"""`,
    text,
    `"""`,
  ].join("\n");
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Valida e normalizza la risposta del modello. Esportata per i test. */
export function validateLlmRows(raw: string): AnalysisResult["rows"] | null {
  // Tollera code fence e testo attorno: estrae il primo blocco {...}
  const cleaned = raw.replace(/```(?:json)?/gi, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
  if (!Array.isArray(parsed?.rows)) return null;
  const rows = [];
  let i = 0;
  for (const r of parsed.rows.slice(0, MAX_ROWS)) {
    const requirement = typeof r?.requirement === "string" ? r.requirement.trim() : "";
    if (!requirement) continue;
    i += 1;
    rows.push({
      id: `l${i}`,
      requirement,
      control: typeof r?.control === "string" ? r.control.trim() : "",
      owner: typeof r?.owner === "string" ? r.owner.trim() : "",
      frequency: typeof r?.frequency === "string" ? r.frequency.trim() : "",
      evidence: typeof r?.evidence === "string" ? r.evidence.trim() : "",
    });
  }
  return rows.length > 0 ? rows : null;
}

export async function analyzeWithLlm(
  text: string,
  locale: "it" | "en"
): Promise<AnalysisResult["rows"] | null> {
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
        messages: [{ role: "user", content: buildPrompt(text, locale) }],
      }),
      signal: AbortSignal.timeout(45000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    return validateLlmRows(content);
  } catch {
    return null;
  }
}
