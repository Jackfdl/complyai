// Stringhe UI della pagina Guardrail (IT/EN).
import type { Locale } from "@/lib/i18n";

const it = {
  kicker: "Garanzie e limiti",
  title: "Cosa fa ComplyAI — e cosa non farà mai",
  intro:
    "La compliance vive di fiducia. Qui trovi, in chiaro, i confini entro cui operano gli strumenti: cosa fanno in autonomia, cosa richiede sempre te, e i meccanismi tecnici che lo garantiscono. Non sono promesse di marketing: sono regole scritte nel prodotto e verificabili.",
  versionLabel: "Versione dei guardrail:",
  backHome: "← ComplyAI",
  footerNote:
    "Questi principi valgono per tutti i moduli della suite. Le sigle tra parentesi (es. D10) rimandano al registro decisioni del progetto.",
};

export type GuardrailsUi = typeof it;

const en: GuardrailsUi = {
  kicker: "Safeguards and limits",
  title: "What ComplyAI does — and what it will never do",
  intro:
    "Compliance runs on trust. Here, in plain terms, are the boundaries the tools operate within: what they do autonomously, what always requires you, and the technical mechanisms that guarantee it. These are not marketing promises: they are rules written into the product and verifiable.",
  versionLabel: "Guardrails version:",
  backHome: "← ComplyAI",
  footerNote:
    "These principles apply to every module of the suite. The codes in brackets (e.g. D10) refer to the project's decision log.",
};

const packs: Record<Locale, GuardrailsUi> = { it, en };

export function getGuardrailsUi(locale: Locale): GuardrailsUi {
  return packs[locale];
}
