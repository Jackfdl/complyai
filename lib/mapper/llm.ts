// Analisi LLM del Mapper — usa il client condiviso lib/llm.ts (D14).
import { callChatCompletion, extractJsonBlock, isLlmConfigured } from "@/lib/llm";
import type { AnalysisResult } from "./types";

export { isLlmConfigured };

export const MAX_POLICY_CHARS = 12000;
export const MAX_ROWS = 40;

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
  const parsed: any = extractJsonBlock(raw);
  if (!parsed || !Array.isArray(parsed.rows)) return null;
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
  const content = await callChatCompletion(buildPrompt(text, locale));
  if (!content) return null;
  return validateLlmRows(content);
}
