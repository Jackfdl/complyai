// Guardrail espliciti (Fase 3.2) — dati versionati e verificabili.
// Ogni guardrail dichiara un PRINCIPIO e il MECCANISMO reale con cui è garantito
// nel prodotto (non marketing): dove possibile cita la decisione in docs/DECISIONI.md.
// Bilingue IT/EN; l'integrità (versione, id unici, parità, categorie) è testata.

export const GUARDRAILS_VERSION = "v1.0 (7 luglio 2026)";

export type GuardrailCategory =
  | "autonomy"
  | "no-external"
  | "audit"
  | "no-legal-certainty"
  | "data"
  | "determinism";

/** Ordine di presentazione delle categorie. */
export const GUARDRAIL_CATEGORY_ORDER: GuardrailCategory[] = [
  "autonomy",
  "no-external",
  "audit",
  "no-legal-certainty",
  "data",
  "determinism",
];

export const CATEGORY_LABELS: Record<GuardrailCategory, { it: string; en: string }> = {
  autonomy: { it: "Autonomia e controllo", en: "Autonomy and control" },
  "no-external": { it: "Nessuna comunicazione esterna", en: "No external communication" },
  audit: { it: "Tracciabilità immutabile", en: "Immutable audit trail" },
  "no-legal-certainty": { it: "Nessuna certezza legale assoluta", en: "No absolute legal certainty" },
  data: { it: "Dati e privacy", en: "Data and privacy" },
  determinism: { it: "Determinismo e riproducibilità", en: "Determinism and reproducibility" },
};

export interface Guardrail {
  id: string;
  category: GuardrailCategory;
  /** Il principio, in una frase. */
  principle: { it: string; en: string };
  /** Come è garantito nel prodotto (meccanismo concreto). */
  detail: { it: string; en: string };
}

export const GUARDRAILS: Guardrail[] = [
  {
    id: "drafts",
    category: "autonomy",
    principle: {
      it: "Le analisi AI sono bozze, non verdetti.",
      en: "AI analyses are drafts, not verdicts.",
    },
    detail: {
      it: "Ogni elemento generato (clausola, controllo, obbligo) resta modificabile prima di essere salvato: decidi tu cosa tenere. Lo strumento non decide al posto tuo.",
      en: "Every generated item (clause, control, obligation) stays editable before you save it: you decide what to keep. The tool does not decide for you.",
    },
  },
  {
    id: "no-irreversible",
    category: "autonomy",
    principle: {
      it: "Nessuna azione irreversibile senza di te.",
      en: "No irreversible action without you.",
    },
    detail: {
      it: "Salvataggi ed eliminazioni li avvii tu; le cancellazioni chiedono conferma esplicita. L'app non elimina né altera i tuoi dati in autonomia.",
      en: "You initiate saves and deletions; deletions ask for explicit confirmation. The app never deletes or alters your data on its own.",
    },
  },
  {
    id: "no-comms",
    category: "no-external",
    principle: {
      it: "L'app non comunica con l'esterno per tuo conto.",
      en: "The app does not communicate externally on your behalf.",
    },
    detail: {
      it: "Nessuna email, messaggio o invio a terzi viene generato automaticamente. I promemoria restano nel tuo calendario tramite un file .ics che sei tu a esportare e importare.",
      en: "No email, message or transfer to third parties is generated automatically. Reminders live in your own calendar via an .ics file that you export and import.",
    },
  },
  {
    id: "ai-transmission",
    category: "no-external",
    principle: {
      it: "L'unica trasmissione esterna è l'analisi AI: opzionale e trasparente.",
      en: "The only external transmission is AI analysis: optional and transparent.",
    },
    detail: {
      it: "Solo se sei connesso e attivi l'analisi AI, il testo (non il file) viene inviato al provider LLM in UE per la sola analisi, con opt-out dal training obbligatorio (D14/D15). Tutto il resto gira nel tuo browser o sul tuo database.",
      en: "Only if you are signed in and enable AI analysis, the text (not the file) is sent to the EU LLM provider for analysis only, with mandatory training opt-out (D14/D15). Everything else runs in your browser or on your database.",
    },
  },
  {
    id: "append-only",
    category: "audit",
    principle: {
      it: "Il registro audit è immutabile, anche per te.",
      en: "The audit log is immutable, even for you.",
    },
    detail: {
      it: "Ogni creazione, modifica ed eliminazione è tracciata in un log append-only protetto a tre livelli (RLS, REVOKE, trigger DB che blocca update/delete): nessuno può alterarlo o cancellarlo. È una garanzia di integrità per un revisore esterno (D10/D16).",
      en: "Every create, update and delete is recorded in an append-only log protected at three levels (RLS, REVOKE, a DB trigger blocking update/delete): no one can alter or erase it. It is an integrity guarantee for an external auditor (D10/D16).",
    },
  },
  {
    id: "informational",
    category: "no-legal-certainty",
    principle: {
      it: "Supporto informativo, non parere legale.",
      en: "Informational support, not legal advice.",
    },
    detail: {
      it: "Gli esiti citano la base normativa ma non sostituiscono un professionista abilitato. Per decisioni con effetti giuridici (firma, negoziazione, classificazione definitiva) rivolgiti a un legale.",
      en: "Results cite the legal basis but do not replace a qualified professional. For decisions with legal effects (signing, negotiating, final classification), consult a lawyer.",
    },
  },
  {
    id: "pending-flags",
    category: "no-legal-certainty",
    principle: {
      it: "Ciò che non è ancora certo è segnalato.",
      en: "What is not yet certain is flagged.",
    },
    detail: {
      it: "Le date e le regole che derivano da norme non ancora pubblicate in Gazzetta Ufficiale UE (pacchetto Omnibus) sono marcate esplicitamente, non presentate come vigenti (D6/D9).",
      en: "Dates and rules stemming from legislation not yet published in the EU Official Journal (Omnibus package) are explicitly flagged, not presented as in force (D6/D9).",
    },
  },
  {
    id: "data-minimization",
    category: "data",
    principle: {
      it: "Dati minimi, nell'UE.",
      en: "Minimal data, in the EU.",
    },
    detail: {
      it: "Conserviamo il minimo indispensabile — ad esempio il memo di revisione, non il contratto integrale — su infrastruttura in regione UE (GDPR). Il documento del contratto resta nel tuo browser salvo analisi AI esplicita (D10/D15).",
      en: "We keep the bare minimum — e.g. the review memo, not the full contract — on EU-region infrastructure (GDPR). The contract document stays in your browser unless you explicitly request AI analysis (D10/D15).",
    },
  },
  {
    id: "your-data",
    category: "data",
    principle: {
      it: "I tuoi dati sono solo tuoi.",
      en: "Your data is yours alone.",
    },
    detail: {
      it: "Row Level Security per-utente: ogni riga è leggibile solo dal tuo account. La chiave pubblica del client non dà accesso ai dati altrui; la sicurezza è dichiarata nello schema SQL (D10).",
      en: "Per-user Row Level Security: each row is readable only by your account. The public client key gives no access to others' data; security is declared in the SQL schema (D10).",
    },
  },
  {
    id: "rules-first",
    category: "determinism",
    principle: {
      it: "Regole deterministiche dove possibile.",
      en: "Deterministic rules where possible.",
    },
    detail: {
      it: "La classificazione AI Act e la libreria clausole sono motori a regole con citazioni puntuali: stessa domanda → stesso esito → stessa fonte. Verificabili, riproducibili e coperti da test (D4/D9/D15).",
      en: "The AI Act classification and the clause library are rule engines with precise citations: same question → same result → same source. Verifiable, reproducible and covered by tests (D4/D9/D15).",
    },
  },
  {
    id: "ai-fallback",
    category: "determinism",
    principle: {
      it: "L'AI non è mai un single point of failure.",
      en: "AI is never a single point of failure.",
    },
    detail: {
      it: "Dove usiamo l'AI c'è sempre un fallback deterministico locale: se il provider non risponde o restituisce un output non valido, l'analisi continua con la libreria locale e te lo diciamo in chiaro (D14/D15).",
      en: "Wherever we use AI there is always a local deterministic fallback: if the provider does not respond or returns invalid output, the analysis continues with the local library and we tell you clearly (D14/D15).",
    },
  },
];

export function guardrailsByCategory(category: GuardrailCategory): Guardrail[] {
  return GUARDRAILS.filter((g) => g.category === category);
}
