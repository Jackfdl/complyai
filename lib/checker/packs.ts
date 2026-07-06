// Pacchetti di contenuto normativo per lingua.
// Gli id sono identici tra le lingue (verificato dai test): cambia solo il testo.
// Italiano = lingua di riferimento (D7); l'inglese porta un caveat di revisione.
import type { Locale } from "@/lib/i18n";
import type { CitedItem, DeadlineItem, Obligation } from "./types";
import { contentIt } from "./content-it";
import { contentEn } from "./content-en";

/** Stringhe usate dal motore per findings/scadenze/caveat. */
export interface EngineStrings {
  prohibitedPrefix: string;
  transparencyPrefix: string;
  dlProhibited: DeadlineItem;
  dlNcii: DeadlineItem;
  dlAnnex3: DeadlineItem;
  dlAnnex1: DeadlineItem;
  dlArt50: DeadlineItem;
  dlGpai: DeadlineItem;
  fAnnex1: { title: string; detail: string; ref: string };
  fCarveout: { title: string; detail: string; ref: string };
  fMachinery: { title: string; detail: string; ref: string };
  fProfiling: { title: string; detail: string; ref: string };
  fExempt63: {
    title: string;
    ref: string;
    detail: (areas: string, exemptions: string) => string;
  };
  fMinimal: { title: string; detail: string; ref: string };
  fGpai: { title: string; detail: string; ref: string };
  cProhibitedException: string;
  cExempt63: string;
  cMachinery: string;
  cAnnexIUnsure: string;
}

export interface CheckerContent {
  version: string;
  omnibusCaveat: string;
  legalDisclaimer: string;
  /** Presente solo dove i contenuti non sono ancora passati da revisione (EN). */
  reviewCaveat?: string;
  prohibitedPractices: CitedItem[];
  annexIIIAreas: CitedItem[];
  art63Exemptions: CitedItem[];
  transparencyFlags: CitedItem[];
  highRiskProvider: Obligation[];
  highRiskDeployer: Obligation[];
  baseline: Obligation[];
  art63Doc: Obligation;
  gpai: Obligation[];
  prohibitedGuidance: Obligation[];
  strings: EngineStrings;
}

const packs: Record<Locale, CheckerContent> = {
  it: contentIt,
  en: contentEn,
};

export function getContent(locale: Locale): CheckerContent {
  return packs[locale];
}
