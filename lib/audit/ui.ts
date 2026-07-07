// Stringhe UI dell'Audit Trail Builder (IT/EN).
import type { Locale } from "@/lib/i18n";

const it = {
  kicker: "Audit Trail Builder · beta",
  title: "Registro audit",
  body: "Ogni azione sui tuoi dati (valutazioni, scadenze, revisioni contratti, matrici controlli) viene registrata automaticamente in un log a sola aggiunta. Qui lo consulti, lo filtri e lo esporti per un revisore esterno.",
  appendOnly:
    "Registro append-only: le voci non sono modificabili né eliminabili, nemmeno da te. È una garanzia di integrità, non un limite.",
  needLogin: "Accedi per consultare il tuo registro audit.",
  notConfigured: "Il registro sarà disponibile a breve (backend in configurazione).",
  loading: "Caricamento…",
  empty: "Nessuna voce registrata finora. Usa gli altri moduli (salva una valutazione, crea una scadenza) e le azioni compariranno qui.",
  noMatch: "Nessuna voce corrisponde ai filtri impostati.",
  fModule: "Modulo",
  fVerb: "Azione",
  fSearch: "Cerca",
  fSearchPh: "Testo, ID, titolo…",
  all: "Tutti",
  verbs: {
    all: "Tutte",
    created: "Creazione",
    updated: "Modifica",
    deleted: "Eliminazione",
    other: "Altro",
  },
  count: (n: number, total: number) => `${n} di ${total} voci`,
  csvBtn: "Esporta CSV",
  jsonBtn: "Esporta JSON",
  colWhen: "Data e ora",
  colModule: "Modulo",
  colAction: "Azione",
  colId: "ID",
  colDetail: "Dettaglio",
  refresh: "Aggiorna",
  backHome: "← ComplyAI",
  signOut: "Esci",
};

export type AuditUi = typeof it;

const en: AuditUi = {
  kicker: "Audit Trail Builder · beta",
  title: "Audit log",
  body: "Every action on your data (assessments, deadlines, contract reviews, controls matrices) is recorded automatically in an append-only log. Here you can review, filter and export it for an external auditor.",
  appendOnly:
    "Append-only log: entries cannot be edited or deleted, not even by you. It is an integrity guarantee, not a limitation.",
  needLogin: "Sign in to review your audit log.",
  notConfigured: "The log will be available shortly (backend being configured).",
  loading: "Loading…",
  empty: "No entries recorded yet. Use the other modules (save an assessment, create a deadline) and the actions will appear here.",
  noMatch: "No entry matches the current filters.",
  fModule: "Module",
  fVerb: "Action",
  fSearch: "Search",
  fSearchPh: "Text, ID, title…",
  all: "All",
  verbs: {
    all: "All",
    created: "Created",
    updated: "Updated",
    deleted: "Deleted",
    other: "Other",
  },
  count: (n, total) => `${n} of ${total} entries`,
  csvBtn: "Export CSV",
  jsonBtn: "Export JSON",
  colWhen: "Date and time",
  colModule: "Module",
  colAction: "Action",
  colId: "ID",
  colDetail: "Detail",
  refresh: "Refresh",
  backHome: "← ComplyAI",
  signOut: "Sign out",
};

const packs: Record<Locale, AuditUi> = { it, en };

export function getAuditUi(locale: Locale): AuditUi {
  return packs[locale];
}
