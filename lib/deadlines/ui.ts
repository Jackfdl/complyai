// Stringhe UI del Legal Deadline Tracker (IT/EN).
import type { Locale } from "@/lib/i18n";
import type { DeadlineState } from "./logic";

const it = {
  kicker: "Legal Deadline Tracker · beta",
  title: "Scadenzario legale",
  body: "Tieni traccia di obblighi, rinnovi taciti e finestre di disdetta. Gli stati si aggiornano da soli in base alla data; esporta tutto nel tuo calendario con un click. In futuro il Contract Review Agent alimenterà questa lista automaticamente.",
  formTitle: "Nuova scadenza",
  fTitle: "Titolo *",
  fTitlePh: "Es. disdetta contratto noleggio stampanti",
  fDue: "Data di scadenza *",
  fCategory: "Categoria",
  fCategoryPh: "Es. contratti, AI Act, GDPR, fisco…",
  fNotes: "Note",
  fNotesPh: "Es. preavviso 60 giorni, raccomandata PEC…",
  addBtn: "Aggiungi scadenza",
  adding: "Aggiungo…",
  groups: {
    overdue: "In ritardo",
    soon: "Entro 30 giorni",
    upcoming: "Più avanti",
    completed: "Completate",
  } as Record<DeadlineState, string>,
  daysLate: (n: number) => `${n} ${n === 1 ? "giorno" : "giorni"} fa`,
  daysLeft: (n: number) => (n === 0 ? "oggi" : `tra ${n} ${n === 1 ? "giorno" : "giorni"}`),
  completeBtn: "Completata",
  reopenBtn: "Riapri",
  deleteBtn: "Elimina",
  confirmDelete: "Eliminare questa scadenza? L'azione resta tracciata nel registro audit.",
  icsBtn: "Esporta calendario (.ics)",
  icsHint: "Importabile in Google Calendar, Outlook, Apple Calendar.",
  empty: "Nessuna scadenza. Aggiungi la prima con il modulo qui sopra.",
  needLogin: "Accedi per gestire il tuo scadenzario.",
  notConfigured: "Lo scadenzario sarà disponibile a breve (backend in configurazione).",
  loading: "Caricamento…",
  backHome: "← ComplyAI",
  signOut: "Esci",
};

export type DeadlinesUi = typeof it;

const en: DeadlinesUi = {
  kicker: "Legal Deadline Tracker · beta",
  title: "Legal deadline tracker",
  body: "Track obligations, tacit renewals and withdrawal windows. States update automatically based on the date; export everything to your calendar in one click. In the future, the Contract Review Agent will feed this list automatically.",
  formTitle: "New deadline",
  fTitle: "Title *",
  fTitlePh: "E.g. cancel printer rental contract",
  fDue: "Due date *",
  fCategory: "Category",
  fCategoryPh: "E.g. contracts, AI Act, GDPR, tax…",
  fNotes: "Notes",
  fNotesPh: "E.g. 60 days notice, registered mail…",
  addBtn: "Add deadline",
  adding: "Adding…",
  groups: {
    overdue: "Overdue",
    soon: "Within 30 days",
    upcoming: "Later",
    completed: "Completed",
  },
  daysLate: (n) => `${n} ${n === 1 ? "day" : "days"} ago`,
  daysLeft: (n) => (n === 0 ? "today" : `in ${n} ${n === 1 ? "day" : "days"}`),
  completeBtn: "Done",
  reopenBtn: "Reopen",
  deleteBtn: "Delete",
  confirmDelete: "Delete this deadline? The action remains tracked in the audit log.",
  icsBtn: "Export calendar (.ics)",
  icsHint: "Importable into Google Calendar, Outlook, Apple Calendar.",
  empty: "No deadlines. Add the first one with the form above.",
  needLogin: "Sign in to manage your deadlines.",
  notConfigured: "The tracker will be available shortly (backend being configured).",
  loading: "Loading…",
  backHome: "← ComplyAI",
  signOut: "Sign out",
};

const packs: Record<Locale, DeadlinesUi> = { it, en };

export function getDeadlinesUi(locale: Locale): DeadlinesUi {
  return packs[locale];
}
