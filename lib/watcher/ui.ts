// Stringhe UI del Regulation Watcher (IT/EN).
import type { Locale } from "@/lib/i18n";

const it = {
  kicker: "Regulation Watcher · beta",
  title: "Radar normativo",
  body: "Ogni giorno controlliamo fonti ufficiali UE (Gazzetta Ufficiale via EUR-Lex, Commissione/AI Office, EDPB), applichiamo tag deterministici per parole chiave e segnaliamo ciò che tocca AI Act e dintorni. Nessun riassunto generato da AI: titoli e link originali, sempre verificabili alla fonte.",
  relevantBadge: "Rilevante AI Act",
  emptyTitle: "Nessun elemento ancora raccolto",
  emptyBody: "Il primo aggiornamento automatico arriva con l'esecuzione giornaliera (ore 6:00 UTC). Torna più tardi.",
  notConfigured: "Il radar è in configurazione (backend non ancora collegato).",
  sourceLabel: "Fonte",
  updatedDaily: "Aggiornamento automatico giornaliero · ultime 30 voci",
  backHome: "← ComplyAI",
  tagLabels: {
    "ai-act": "AI Act",
    omnibus: "Omnibus",
    gpai: "GPAI",
    ai: "AI",
    gdpr: "GDPR",
    cyber: "Cyber",
  } as Record<string, string>,
};

export type WatcherUi = typeof it;

const en: WatcherUi = {
  kicker: "Regulation Watcher · beta",
  title: "Regulatory radar",
  body: "Every day we check official EU sources (Official Journal via EUR-Lex, Commission/AI Office, EDPB), apply deterministic keyword tags and flag what touches the AI Act and its surroundings. No AI-generated summaries: original titles and links, always verifiable at the source.",
  relevantBadge: "AI Act relevant",
  emptyTitle: "No items collected yet",
  emptyBody: "The first automatic update arrives with the daily run (6:00 UTC). Check back later.",
  notConfigured: "The radar is being configured (backend not connected yet).",
  sourceLabel: "Source",
  updatedDaily: "Automatic daily update · latest 30 entries",
  backHome: "← ComplyAI",
  tagLabels: {
    "ai-act": "AI Act",
    omnibus: "Omnibus",
    gpai: "GPAI",
    ai: "AI",
    gdpr: "GDPR",
    cyber: "Cyber",
  },
};

const packs: Record<Locale, WatcherUi> = { it, en };

export function getWatcherUi(locale: Locale): WatcherUi {
  return packs[locale];
}
