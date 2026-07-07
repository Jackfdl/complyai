// Stringhe UI del Contract Review Agent (IT/EN).
import type { Locale } from "@/lib/i18n";
import type { ClauseAssessment } from "./types";

const it = {
  kicker: "Contract Review Agent · beta",
  title: "Revisione contratti",
  body: "Carica un contratto (PDF, DOCX, TXT) o incollane il testo: estraiamo le clausole chiave, segnaliamo quelle da verificare, le protezioni standard mancanti e le date importanti — che puoi mandare allo Scadenzario con un click.",
  privacyNotice:
    "L'estrazione del testo dal file avviene interamente nel tuo browser. Se sei connesso e l'analisi AI è attiva, il TESTO viene inviato al provider AI configurato (Mistral, UE) per la sola analisi: valuta di anonimizzare nomi e importi. Se salvi, conserviamo il memo di revisione, non il contratto.",
  uploadLabel: "Carica il contratto",
  uploadHint: "PDF, DOCX o TXT — max ~60 pagine",
  extracting: "Estrazione testo in corso…",
  extractUnsupported: "Formato non supportato: usa PDF, DOCX o TXT, oppure incolla il testo.",
  extractFailed: "Estrazione non riuscita (il PDF potrebbe essere una scansione senza testo): incolla il testo manualmente.",
  extractedOk: (n: number) => `Testo estratto: ${n.toLocaleString("it-IT")} caratteri. Controlla e poi analizza.`,
  pasteLabel: "…oppure incolla il testo del contratto *",
  pastePh: "Incolla qui il testo (min 200, max 30.000 caratteri)…",
  titleLabel: "Nome del contratto",
  titlePh: "Es. Fornitura software gestionale — Acme Srl",
  analyzeBtn: "Analizza il contratto",
  analyzing: "Analisi in corso…",
  engineLlm: "Analisi AI (rivedi ogni punto: l'AI può sbagliare; fa fede il testo del contratto)",
  engineHeuristic: "Analisi con libreria clausole locale (pattern deterministici — nessun dato inviato a terzi)",
  engineFallback: "L'AI non ha risposto: mostrata l'analisi con la libreria locale.",
  needLogin: "Accedi per usare l'analisi AI e salvare i memo. Senza account resta disponibile l'analisi con libreria locale.",
  notConfigured: "Backend in configurazione: disponibile l'analisi con libreria locale.",
  memoTitle: "Memo di revisione",
  summaryTitle: "Sintesi",
  clausesTitle: "Clausole individuate",
  levels: {
    info: "Nota",
    warning: "Da verificare",
    risk: "Attenzione",
  } as Record<ClauseAssessment, string>,
  missingTitle: "Protezioni standard non trovate",
  missingHint: "Non trovate ≠ certamente assenti: la formulazione potrebbe essere atipica. Verifica prima di negoziare.",
  datesTitle: "Date e termini chiave",
  addToDeadlines: "→ Scadenzario",
  addedToDeadlines: "Aggiunta ✓",
  saveBtn: "Salva memo",
  updateBtn: "Aggiorna memo",
  savedOk: "Salvato ✓",
  saveErr: "Salvataggio non riuscito:",
  printBtn: "Stampa / salva PDF",
  myReviews: "I miei memo",
  open: "Apri",
  del: "Elimina",
  confirmDelete: "Eliminare questo memo? L'azione resta tracciata nel registro audit.",
  noClauses: "Nessuna clausola nota individuata: il testo potrebbe essere troppo breve o atipico.",
  disclaimer:
    "Questo memo ha finalità informative e non costituisce parere legale. Per la firma o la negoziazione di un contratto rivolgiti a un professionista abilitato.",
  libraryLabel: "Libreria clausole:",
  loading: "Caricamento…",
  backHome: "← ComplyAI",
  signOut: "Esci",
};

export type ContractsUi = typeof it;

const en: ContractsUi = {
  kicker: "Contract Review Agent · beta",
  title: "Contract review",
  body: "Upload a contract (PDF, DOCX, TXT) or paste its text: we extract the key clauses, flag the ones to verify, the missing standard protections and the important dates — which you can send to the Deadline Tracker in one click.",
  privacyNotice:
    "Text extraction from the file happens entirely in your browser. If you are signed in and AI analysis is enabled, the TEXT is sent to the configured AI provider (Mistral, EU) for analysis only: consider anonymising names and amounts. If you save, we store the review memo, not the contract.",
  uploadLabel: "Upload the contract",
  uploadHint: "PDF, DOCX or TXT — max ~60 pages",
  extracting: "Extracting text…",
  extractUnsupported: "Unsupported format: use PDF, DOCX or TXT, or paste the text.",
  extractFailed: "Extraction failed (the PDF may be a scan without text): paste the text manually.",
  extractedOk: (n) => `Text extracted: ${n.toLocaleString("en-GB")} characters. Review it, then analyse.`,
  pasteLabel: "…or paste the contract text *",
  pastePh: "Paste the text here (min 200, max 30,000 characters)…",
  titleLabel: "Contract name",
  titlePh: "E.g. Software supply — Acme Ltd",
  analyzeBtn: "Analyse the contract",
  analyzing: "Analysing…",
  engineLlm: "AI analysis (review every point: AI can be wrong; the contract text prevails)",
  engineHeuristic: "Analysis with local clause library (deterministic patterns — no data sent to third parties)",
  engineFallback: "The AI did not respond: showing the local library analysis.",
  needLogin: "Sign in to use AI analysis and save memos. Without an account, the local library analysis remains available.",
  notConfigured: "Backend being configured: local library analysis available.",
  memoTitle: "Review memo",
  summaryTitle: "Summary",
  clausesTitle: "Clauses found",
  levels: {
    info: "Note",
    warning: "To verify",
    risk: "Attention",
  },
  missingTitle: "Standard protections not found",
  missingHint: "Not found ≠ certainly absent: the wording may be atypical. Verify before negotiating.",
  datesTitle: "Key dates and terms",
  addToDeadlines: "→ Deadline tracker",
  addedToDeadlines: "Added ✓",
  saveBtn: "Save memo",
  updateBtn: "Update memo",
  savedOk: "Saved ✓",
  saveErr: "Save failed:",
  printBtn: "Print / save PDF",
  myReviews: "My memos",
  open: "Open",
  del: "Delete",
  confirmDelete: "Delete this memo? The action remains tracked in the audit log.",
  noClauses: "No known clause found: the text may be too short or atypical.",
  disclaimer:
    "This memo is for information purposes and does not constitute legal advice. For signing or negotiating a contract, consult a qualified professional.",
  libraryLabel: "Clause library:",
  loading: "Loading…",
  backHome: "← ComplyAI",
  signOut: "Sign out",
};

const packs: Record<Locale, ContractsUi> = { it, en };

export function getContractsUi(locale: Locale): ContractsUi {
  return packs[locale];
}
