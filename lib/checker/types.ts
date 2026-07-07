// Tipi del dominio "AI Act Compliance Checker".
// Il motore è deterministico: nessun LLM, ogni esito cita la base normativa (D4).

export type Role = "provider" | "deployer" | "both";

export type RiskLevel = "prohibited" | "high" | "transparency" | "minimal";

/** Voce di contenuto normativo con citazione puntuale. */
export interface CitedItem {
  id: string;
  label: string;
  description: string;
  /** Base normativa, es. "Art. 5(1)(a) AI Act" */
  ref: string;
  /** Caveat: eccezioni, incertezze, rinvii Omnibus in attesa di GU. */
  note?: string;
}

export interface Obligation extends CitedItem {
  appliesTo: Exclude<Role, "both">[];
  /** Scadenza in formato leggibile; undefined = già applicabile. */
  deadline?: string;
  /** true se la data deriva dall'Omnibus non ancora pubblicato in GU. */
  pendingOmnibus?: boolean;
}

export type ObligationStatus = "ok" | "partial" | "missing" | "unknown" | "na";

export type AnnexIAnswer = "no" | "sectionA" | "machinery" | "unsure";

export interface CheckerAnswers {
  role: Role;
  systemName: string;
  systemDescription: string;
  /** id delle pratiche art. 5 selezionate; [] = nessuna. */
  prohibitedPractices: string[];
  annexI: AnnexIAnswer;
  /** Solo assistenza/ottimizzazione/comfort/controllo qualità, senza rischi per salute/sicurezza. */
  safetyCarveout: boolean;
  /** id delle aree Annex III selezionate; [] = nessuna. */
  annexIIIAreas: string[];
  /** id delle deroghe art. 6(3) rivendicate. */
  art63Exemptions: string[];
  /** Il sistema effettua profilazione di persone fisiche (esclude le deroghe 6(3)). */
  profiling: boolean;
  /** id degli obblighi di trasparenza art. 50 pertinenti. */
  transparencyFlags: string[];
  /** L'azienda sviluppa e fornisce un modello di AI per finalità generali. */
  gpai: boolean;
}

export interface Finding {
  kind: "prohibited" | "high-annex3" | "high-annex1" | "exempt-63" | "transparency" | "machinery" | "gpai" | "minimal";
  title: string;
  detail: string;
  ref: string;
}

export interface DeadlineItem {
  date: string;
  what: string;
  ref: string;
  pendingOmnibus?: boolean;
  /** Data assoluta YYYY-MM-DD → abilita "aggiungi allo Scadenzario". Assente per le date già applicabili. */
  isoDate?: string;
}

export interface ClassificationResult {
  level: RiskLevel;
  findings: Finding[];
  obligations: Obligation[];
  deadlines: DeadlineItem[];
  caveats: string[];
  contentVersion: string;
}
