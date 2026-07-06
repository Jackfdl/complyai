// Stringhe UI del Policy-to-Controls Mapper (IT/EN).
import type { Locale } from "@/lib/i18n";
import type { RowStatus } from "./types";

const it = {
  kicker: "Policy-to-Controls Mapper · beta",
  title: "Da policy a controlli operativi",
  body: "Incolla il testo di una policy interna o di un requisito normativo: lo scomponiamo in requisiti atomici e per ognuno proponiamo controllo operativo, responsabile, cadenza ed evidenza. Tutto è una bozza modificabile: la matrice finale la decidi tu.",
  privacyNotice:
    "Se sei connesso e l'analisi AI è attiva, il testo viene inviato al provider AI configurato (Mistral, UE) per la sola analisi: non incollare dati personali o segreti industriali — anonimizza prima. In alternativa l'analisi euristica locale non invia nulla.",
  inputLabel: "Testo della policy o del requisito *",
  inputPh: "Incolla qui la policy (min 40, max 12.000 caratteri)…",
  titleLabel: "Titolo della matrice",
  titlePh: "Es. Policy uso AI — v1",
  analyzeBtn: "Analizza e proponi controlli",
  analyzing: "Analisi in corso…",
  engineLlm: "Analisi AI (rivedi ogni riga: l'AI può sbagliare)",
  engineHeuristic: "Analisi euristica locale (bozze da rifinire — nessun dato inviato a terzi)",
  engineFallback: "L'AI non ha risposto: mostrata l'analisi euristica locale.",
  noRows: "Nessun obbligo/divieto individuato nel testo. Riformula o aggiungi righe a mano.",
  needLogin: "Accedi per usare l'analisi AI e salvare le matrici. Senza account resta disponibile l'analisi euristica locale.",
  notConfigured: "Backend in configurazione: disponibile l'analisi euristica locale.",
  colRequirement: "Requisito",
  colControl: "Controllo operativo",
  colOwner: "Owner",
  colFrequency: "Cadenza",
  colEvidence: "Evidenza",
  colStatus: "Stato",
  statuses: {
    todo: "Da attivare",
    "in-progress": "In attivazione",
    active: "Attivo",
    na: "Non applicabile",
  } as Record<RowStatus, string>,
  addRow: "+ Aggiungi riga",
  removeRow: "Rimuovi",
  csvBtn: "Esporta CSV",
  printBtn: "Stampa / salva PDF",
  saveBtn: "Salva matrice",
  updateBtn: "Aggiorna matrice",
  savedOk: "Salvata ✓",
  saveErr: "Salvataggio non riuscito:",
  myMatrices: "Le mie matrici",
  open: "Apri",
  del: "Elimina",
  confirmDelete: "Eliminare questa matrice? L'azione resta tracciata nel registro audit.",
  emptyMatrices: "Nessuna matrice salvata.",
  loading: "Caricamento…",
  backHome: "← ComplyAI",
  signOut: "Esci",
  reportTitle: "ComplyAI — Matrice dei controlli",
};

export type MapperUi = typeof it;

const en: MapperUi = {
  kicker: "Policy-to-Controls Mapper · beta",
  title: "From policy to operational controls",
  body: "Paste the text of an internal policy or a regulatory requirement: we break it into atomic requirements and propose an operational control, owner, cadence and evidence for each. Everything is an editable draft: you decide the final matrix.",
  privacyNotice:
    "If you are signed in and AI analysis is enabled, the text is sent to the configured AI provider (Mistral, EU) for analysis only: do not paste personal data or trade secrets — anonymise first. Alternatively, the local heuristic analysis sends nothing.",
  inputLabel: "Policy or requirement text *",
  inputPh: "Paste the policy here (min 40, max 12,000 characters)…",
  titleLabel: "Matrix title",
  titlePh: "E.g. AI usage policy — v1",
  analyzeBtn: "Analyse and propose controls",
  analyzing: "Analysing…",
  engineLlm: "AI analysis (review every row: AI can be wrong)",
  engineHeuristic: "Local heuristic analysis (drafts to refine — no data sent to third parties)",
  engineFallback: "The AI did not respond: showing the local heuristic analysis.",
  noRows: "No obligation/prohibition found in the text. Rephrase or add rows manually.",
  needLogin: "Sign in to use AI analysis and save matrices. Without an account, the local heuristic analysis remains available.",
  notConfigured: "Backend being configured: local heuristic analysis available.",
  colRequirement: "Requirement",
  colControl: "Operational control",
  colOwner: "Owner",
  colFrequency: "Cadence",
  colEvidence: "Evidence",
  colStatus: "Status",
  statuses: {
    todo: "To activate",
    "in-progress": "In progress",
    active: "Active",
    na: "Not applicable",
  },
  addRow: "+ Add row",
  removeRow: "Remove",
  csvBtn: "Export CSV",
  printBtn: "Print / save PDF",
  saveBtn: "Save matrix",
  updateBtn: "Update matrix",
  savedOk: "Saved ✓",
  saveErr: "Save failed:",
  myMatrices: "My matrices",
  open: "Open",
  del: "Delete",
  confirmDelete: "Delete this matrix? The action remains tracked in the audit log.",
  emptyMatrices: "No saved matrices.",
  loading: "Loading…",
  backHome: "← ComplyAI",
  signOut: "Sign out",
  reportTitle: "ComplyAI — Controls matrix",
};

const packs: Record<Locale, MapperUi> = { it, en };

export function getMapperUi(locale: Locale): MapperUi {
  return packs[locale];
}
