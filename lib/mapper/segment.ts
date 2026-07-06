// Segmentazione deterministica del testo di una policy in statement atomici.
// Individua obblighi/divieti/raccomandazioni tramite marcatori linguistici IT/EN.
// È il motore di fallback quando l'LLM non è configurato o non risponde (D14).
import type { Statement, StatementKind } from "./types";

const PROHIBITION_MARKERS = [
  "non può",
  "non possono",
  "non deve",
  "non devono",
  "non è consentito",
  "non è permesso",
  "è vietato",
  "è fatto divieto",
  "divieto di",
  "must not",
  "shall not",
  "may not",
  "is prohibited",
  "is forbidden",
  "are prohibited",
];

const OBLIGATION_MARKERS = [
  "deve",
  "devono",
  "dovrà",
  "dovranno",
  "è tenuto",
  "sono tenuti",
  "è obbligatorio",
  "si impegna a",
  "va effettuat",
  "va garantit",
  "occorre",
  "è necessario",
  "must",
  "shall",
  "is required",
  "are required",
  "has to",
  "have to",
];

const RECOMMENDATION_MARKERS = [
  "dovrebbe",
  "dovrebbero",
  "è consigliabile",
  "è raccomandato",
  "si raccomanda",
  "preferibilmente",
  "should",
  "is recommended",
  "it is advisable",
];

function classify(sentence: string): StatementKind | null {
  const s = ` ${sentence.toLowerCase()} `;
  // L'ordine conta: i divieti contengono spesso marcatori d'obbligo ("non deve").
  if (PROHIBITION_MARKERS.some((m) => s.includes(m))) return "prohibition";
  if (OBLIGATION_MARKERS.some((m) => s.includes(m))) return "obligation";
  if (RECOMMENDATION_MARKERS.some((m) => s.includes(m))) return "recommendation";
  return null;
}

/** Divide il testo in frasi/punti elenco, ripulendo numerazioni e spazi. */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?;])\s+|\n+/)
    .map((s) =>
      s
        .replace(/^[\s\-–•*]+/, "")
        .replace(/^(\d+[.)]|[a-z][.)])\s+/i, "")
        .trim()
    )
    .filter((s) => s.length >= 20);
}

/** Estrae gli statement normativi (obblighi/divieti/raccomandazioni) dal testo. */
export function segmentPolicy(text: string): Statement[] {
  const out: Statement[] = [];
  let i = 0;
  for (const sentence of splitSentences(text)) {
    const kind = classify(sentence);
    if (!kind) continue;
    i += 1;
    out.push({ id: `s${i}`, text: sentence, kind });
  }
  return out;
}
