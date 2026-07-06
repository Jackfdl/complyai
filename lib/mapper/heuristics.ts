// Suggerimenti euristici per la matrice controlli (fallback deterministico, D14).
// Sono BOZZE dichiarate come tali: l'utente le rifinisce nell'editor.
import { segmentPolicy } from "./segment";
import type { AnalysisResult, Statement } from "./types";

interface OwnerRule {
  keywords: string[];
  it: string;
  en: string;
}

const OWNER_RULES: OwnerRule[] = [
  { keywords: ["dati personali", "privacy", "gdpr", "interessat", "data protection", "personal data", "consent"], it: "DPO / Referente privacy", en: "DPO / Privacy lead" },
  { keywords: ["password", "accesso", "accessi", "credenzial", "backup", "sistem", "software", "access", "system", "network", "log"], it: "Responsabile IT", en: "IT manager" },
  { keywords: ["formazione", "personale", "dipendent", "assunzion", "training", "employee", "staff", "hiring"], it: "HR", en: "HR" },
  { keywords: ["contratt", "fornitor", "clausol", "contract", "supplier", "vendor"], it: "Ufficio legale / Acquisti", en: "Legal / Procurement" },
  { keywords: ["intelligenza artificiale", " ai ", "algoritm", "artificial intelligence", "model"], it: "Referente AI", en: "AI lead" },
  { keywords: ["bilancio", "fattur", "pagament", "budget", "invoice", "payment"], it: "Amministrazione", en: "Finance" },
];

const FREQ_RULES: { keywords: string[]; it: string; en: string }[] = [
  { keywords: ["giornalier", "quotidian", "daily"], it: "Giornaliera", en: "Daily" },
  { keywords: ["settimanal", "weekly"], it: "Settimanale", en: "Weekly" },
  { keywords: ["mensil", "monthly"], it: "Mensile", en: "Monthly" },
  { keywords: ["trimestral", "quarterly"], it: "Trimestrale", en: "Quarterly" },
  { keywords: ["semestral", "semi-annual"], it: "Semestrale", en: "Half-yearly" },
  { keywords: ["annual", "annuale", "yearly", "ogni anno"], it: "Annuale", en: "Yearly" },
];

function pick<T extends { keywords: string[] }>(rules: T[], text: string): T | undefined {
  const s = ` ${text.toLowerCase()} `;
  return rules.find((r) => r.keywords.some((k) => s.includes(k)));
}

function truncate(s: string, max = 110): string {
  return s.length <= max ? s : s.slice(0, max - 1).trimEnd() + "…";
}

export function suggestRow(st: Statement, locale: "it" | "en") {
  const owner = pick(OWNER_RULES, st.text);
  const freq = pick(FREQ_RULES, st.text);
  const it = locale === "it";

  const control =
    st.kind === "prohibition"
      ? it
        ? `Verificare periodicamente l'assenza di violazioni di: "${truncate(st.text)}"`
        : `Periodically verify there are no violations of: "${truncate(st.text)}"`
      : it
        ? `Definire e verificare l'attuazione di: "${truncate(st.text)}"`
        : `Define and verify implementation of: "${truncate(st.text)}"`;

  const evidence =
    st.kind === "prohibition"
      ? it
        ? "Verbale di verifica / esiti controlli a campione"
        : "Verification minutes / spot-check results"
      : it
        ? "Procedura documentata + registro delle esecuzioni"
        : "Documented procedure + execution log";

  return {
    id: st.id,
    requirement: st.text,
    control,
    owner: owner ? (it ? owner.it : owner.en) : it ? "Titolare / Direzione" : "Owner / Management",
    frequency: freq ? (it ? freq.it : freq.en) : it ? "Annuale" : "Yearly",
    evidence,
  };
}

/** Analisi completa senza LLM: segmentazione + suggerimenti euristici. */
export function analyzeHeuristic(text: string, locale: "it" | "en"): AnalysisResult {
  const statements = segmentPolicy(text).slice(0, 40);
  return {
    rows: statements.map((st) => suggestRow(st, locale)),
    engine: "heuristic",
  };
}
