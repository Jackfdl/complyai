// Tipi del Contract Review Agent.

export type ClauseAssessment = "info" | "warning" | "risk";

export interface FoundClause {
  category: string;
  label: string;
  level: ClauseAssessment;
  excerpt: string;
  comment: string;
  occurrences?: number;
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
}
