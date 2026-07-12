// Tipi del Contract Review Agent.

export type ClauseAssessment = "info" | "warning" | "risk";

/** Esito del confronto semantico con la libreria di riferimento (RAG, D21). */
export interface ClauseReference {
  kind: "standard" | "risky";
  /** Testo della formulazione di riferimento più simile. */
  text: string;
  /** Similarità coseno 0–1. */
  similarity: number;
}

export interface FoundClause {
  category: string;
  label: string;
  level: ClauseAssessment;
  excerpt: string;
  comment: string;
  occurrences?: number;
  reference?: ClauseReference;
}

export interface MissingProtection {
  category: string;
  label: string;
  why: string;
}

export interface KeyDate {
  label: string;
  raw: string;
  /** Presente solo per date assolute → abilita "aggiungi allo scadenzario". */
  isoDate?: string;
}

export interface ContractAnalysis {
  engine: "llm" | "heuristic";
  clauses: FoundClause[];
  missing: MissingProtection[];
  keyDates: KeyDate[];
  /** Sintesi discorsiva (solo LLM; vuota in modalità euristica). */
  summary: string;
  libraryVersion: string;
  warning?: string;
  /** true se il confronto semantico con la libreria è stato eseguito. */
  ragUsed?: boolean;
}
