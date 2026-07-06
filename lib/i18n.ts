// i18n leggero, senza dipendenze (vedi docs/DECISIONI.md, D7).
// Convenzioni: codice e chiavi in inglese; contenuti UI in messages/<locale>.json.
import it from "@/messages/it.json";
import en from "@/messages/en.json";

export const locales = ["it", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

/** La forma dei messaggi è definita dal dizionario italiano (lingua di riferimento). */
export type Messages = typeof it;

const dictionaries: Record<Locale, Messages> = { it, en };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Messages {
  return dictionaries[locale];
}
