// Tipi del Policy-to-Controls Mapper.

export type StatementKind = "obligation" | "prohibition" | "recommendation";

export interface Statement {
  id: string;
  text: string;
  kind: StatementKind;
}

export type RowStatus = "todo" | "in-progress" | "active" | "na";

export interface ControlRow {
  id: string;
  /** Requisito: frase della policy da cui nasce il controllo. */
  requirement: string;
  /** Controllo operativo (cosa si fa, concretamente). */
  control: string;
  /** Ruolo responsabile (owner). */
  owner: string;
  /** Cadenza: una tantum, mensile, trimestrale, annuale… */
  frequency: string;
  /** Evidenza richiesta (cosa dimostra che il controllo è stato eseguito). */
  evidence: string;
  status: RowStatus;
}

export type AnalysisEngine = "llm" | "heuristic";

export interface AnalysisResult {
  rows: Omit<ControlRow, "status">[];
  engine: AnalysisEngine;
  warning?: string;
}
