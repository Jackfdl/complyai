// Analisi LLM del contratto — usa il client condiviso lib/llm.ts (D15).
import { callChatCompletion, extractJsonBlock, isLlmConfigured } from "@/lib/llm";
import { CLAUSE_CATEGORIES, CLAUSE_LIBRARY_VERSION } from "./library";
import type { ContractAnalysis, FoundClause, KeyDate, MissingProtection } from "./types";

export { isLlmConfigured };

export const MAX_CONTRACT_CHARS = 30000;

export function buildContractPrompt(text: string, locale: "it" | "en"): string {
  const lang = locale === "it" ? "italiano" : "English";
  const categories = CLAUSE_CATEGORIES.map(
    (c) => `${c.id}: ${c.label[locale]}`
  ).join("; ");
  return [
    `Sei un revisore contrattuale che assiste una PMI (lato cliente). Analizza il contratto qui sotto.`,
    `Categorie di clausole da cercare: ${categories}.`,
    `Per ogni clausola trovata: categoria, breve estratto testuale FEDELE (max 250 caratteri), livello ("info" = neutra, "warning" = da verificare, "risk" = potenzialmente sfavorevole alla PMI) e un commento pratico.`,
    `Elenca le protezioni standard assenti (missing) e le date/finestre chiave (keyDates); per le date assolute aggiungi isoDate in formato YYYY-MM-DD.`,
    `Scrivi una sintesi (summary) di massimo 120 parole, prudente, senza certezze legali assolute.`,
    `Rispondi in ${lang}, SOLO con JSON valido senza code fence:`,
    `{"summary":"...","clauses":[{"category":"...","label":"...","level":"info|warning|risk","excerpt":"...","comment":"..."}],"missing":[{"label":"...","why":"..."}],"keyDates":[{"label":"...","raw":"...","isoDate":"YYYY-MM-DD (opzionale)"}]}`,
    `Non inventare clausole o date assenti dal testo.`,
    ``,
    `CONTRATTO:`,
    `"""`,
    text,
    `"""`,
  ].join("\n");
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Valida e normalizza la risposta del modello. Esportata per i test. */
export function validateContractAnalysis(raw: string): Omit<ContractAnalysis, "engine" | "libraryVersion"> | null {
  const parsed: any = extractJsonBlock(raw);
  if (!parsed || !Array.isArray(parsed.clauses)) return null;

  const clauses: FoundClause[] = [];
  for (const c of parsed.clauses.slice(0, 30)) {
    const label = typeof c?.label === "string" ? c.label.trim() : "";
    const excerpt = typeof c?.excerpt === "string" ? c.excerpt.trim() : "";
    if (!label || !excerpt) continue;
    const level = c?.level === "risk" ? "risk" : c?.level === "warning" ? "warning" : "info";
    clauses.push({
      category: typeof c?.category === "string" ? c.category : "other",
      label,
      level,
      excerpt: excerpt.slice(0, 300),
      comment: typeof c?.comment === "string" ? c.comment.trim() : "",
    });
  }
  if (clauses.length === 0) return null;

  const missing: MissingProtection[] = [];
  if (Array.isArray(parsed.missing)) {
    for (const m of parsed.missing.slice(0, 15)) {
      const label = typeof m?.label === "string" ? m.label.trim() : "";
      if (!label) continue;
      missing.push({
        category: "llm",
        label,
        why: typeof m?.why === "string" ? m.why.trim() : "",
      });
    }
  }

  const keyDates: KeyDate[] = [];
  if (Array.isArray(parsed.keyDates)) {
    for (const d of parsed.keyDates.slice(0, 20)) {
      const label = typeof d?.label === "string" ? d.label.trim() : "";
      const rawTxt = typeof d?.raw === "string" ? d.raw.trim() : "";
      if (!label || !rawTxt) continue;
      const iso =
        typeof d?.isoDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d.isoDate)
          ? d.isoDate
          : undefined;
      keyDates.push({ label, raw: rawTxt.slice(0, 250), isoDate: iso });
    }
  }

  return {
    summary: typeof parsed.summary === "string" ? parsed.summary.trim() : "",
    clauses,
    missing,
    keyDates,
  };
}

export async function analyzeContractWithLlm(
  text: string,
  locale: "it" | "en"
): Promise<ContractAnalysis | null> {
  const content = await callChatCompletion(buildContractPrompt(text, locale), 55000);
  if (!content) return null;
  const validated = validateContractAnalysis(content);
  if (!validated) return null;
  return { engine: "llm", libraryVersion: CLAUSE_LIBRARY_VERSION, ...validated };
}
