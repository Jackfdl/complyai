// Applicazione dei match semantici alle clausole (RAG, D21).
// Funzioni pure e testate: la soglia e le regole di upgrade sono QUI,
// non sparse nella route — stessa filosofia del motore deterministico.
import type { ClauseReference, FoundClause } from "./types";

/** Sotto questa similarità coseno il riferimento non viene mostrato. */
export const RAG_SIMILARITY_THRESHOLD = 0.78;

/** Sopra questa soglia un match "risky" alza una clausola informativa a warning. */
export const RAG_UPGRADE_THRESHOLD = 0.84;

export interface SnippetMatch {
  kind: "standard" | "risky";
  text: string;
  similarity: number;
}

/**
 * Applica un match a una clausola: allega il riferimento se abbastanza simile
 * e, se il riferimento è una formulazione rischiosa molto simile, alza il livello
 * (mai abbassarlo: il RAG aggiunge prudenza, non ne toglie).
 */
export function applyReference(
  clause: FoundClause,
  match: SnippetMatch | null
): FoundClause {
  if (!match || match.similarity < RAG_SIMILARITY_THRESHOLD) return clause;
  const reference: ClauseReference = {
    kind: match.kind,
    text: match.text,
    similarity: Math.round(match.similarity * 100) / 100,
  };
  let level = clause.level;
  if (
    match.kind === "risky" &&
    match.similarity >= RAG_UPGRADE_THRESHOLD &&
    level === "info"
  ) {
    level = "warning";
  }
  return { ...clause, level, reference };
}

/** Applica i match in blocco (stesso ordine delle clausole; null = nessun match). */
export function applyReferences(
  clauses: FoundClause[],
  matches: (SnippetMatch | null)[]
): FoundClause[] {
  return clauses.map((c, i) => applyReference(c, matches[i] ?? null));
}
