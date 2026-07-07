// Analisi deterministica del contratto: clausole trovate, protezioni mancanti,
// date e termini chiave. Funzioni pure, testate in contracts.test.ts.
// È anche il fallback quando l'analisi LLM non è disponibile (D15).
import { CLAUSE_CATEGORIES, CLAUSE_LIBRARY_VERSION } from "./library";
import type { ContractAnalysis, FoundClause, KeyDate, MissingProtection } from "./types";

const MONTHS_IT = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
const MONTHS_EN = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

/** Frase (o suo intorno) che contiene l'indice dato. */
function sentenceAround(text: string, index: number, maxLen = 260): string {
  const start = Math.max(
    text.lastIndexOf(".", index),
    text.lastIndexOf("\n", index),
    0
  );
  let end = text.indexOf(".", index);
  if (end === -1) end = Math.min(text.length, index + maxLen);
  const s = text.slice(start + 1, end + 1).replace(/\s+/g, " ").trim();
  return s.length > maxLen ? s.slice(0, maxLen - 1).trimEnd() + "…" : s;
}

export function findClauses(text: string, locale: "it" | "en"): FoundClause[] {
  const lower = text.toLowerCase();
  const found: FoundClause[] = [];
  for (const cat of CLAUSE_CATEGORIES) {
    const idx = cat.patterns
      .map((p) => lower.indexOf(p))
      .filter((i) => i !== -1)
      .sort((a, b) => a - b);
    if (idx.length === 0) continue;
    found.push({
      category: cat.id,
      label: cat.label[locale],
      level: cat.level,
      excerpt: sentenceAround(text, idx[0]),
      comment: cat.riskNote ? cat.riskNote[locale] : "",
      occurrences: idx.length,
    });
  }
  return found;
}

export function findMissing(
  found: FoundClause[],
  locale: "it" | "en"
): MissingProtection[] {
  const foundIds = new Set(found.map((f) => f.category));
  return CLAUSE_CATEGORIES.filter((c) => c.expected && !foundIds.has(c.id)).map(
    (c) => ({
      category: c.id,
      label: c.label[locale],
      why: c.whyExpected ? c.whyExpected[locale] : "",
    })
  );
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Estrae date assolute e termini/finestre rilevanti. */
export function extractKeyDates(text: string, locale: "it" | "en"): KeyDate[] {
  const out: KeyDate[] = [];
  const seen = new Set<string>();
  const push = (d: KeyDate) => {
    const k = `${d.label}|${d.raw}`;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(d);
    }
  };
  const it = locale === "it";

  // 1. Date numeriche: 31/12/2026, 31-12-2026, 31.12.2026
  for (const m of text.matchAll(/\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](20\d{2})\b/g)) {
    const [, d, mo, y] = m;
    const day = Number(d);
    const mon = Number(mo);
    if (day < 1 || day > 31 || mon < 1 || mon > 12) continue;
    push({
      label: it ? "Data indicata nel contratto" : "Date in the contract",
      raw: sentenceAround(text, m.index ?? 0, 160),
      isoDate: `${y}-${pad(mon)}-${pad(day)}`,
    });
  }

  // 2. Date testuali: "31 dicembre 2026" / "31 December 2026"
  const months = it ? MONTHS_IT : MONTHS_EN;
  const monthRe = new RegExp(`\\b(\\d{1,2})[°º]?\\s+(${months.join("|")})\\s+(20\\d{2})\\b`, "gi");
  for (const m of text.matchAll(monthRe)) {
    const mon = months.indexOf(m[2].toLowerCase()) + 1;
    push({
      label: it ? "Data indicata nel contratto" : "Date in the contract",
      raw: sentenceAround(text, m.index ?? 0, 160),
      isoDate: `${m[3]}-${pad(mon)}-${pad(Number(m[1]))}`,
    });
  }

  // 3. Preavvisi: "preavviso di 60 giorni", "60 giorni prima", "60 days' notice"
  for (const m of text.matchAll(
    /preavviso(?:\s+scritto)?\s+di\s+(?:almeno\s+)?(\d+)\s+(giorni|mesi)|(\d+)\s+(giorni|mesi)\s+prima|(\d+)\s+(days|months)['’]?\s+(?:written\s+)?notice/gi
  )) {
    push({
      label: it ? "Finestra di preavviso/disdetta" : "Notice/cancellation window",
      raw: sentenceAround(text, m.index ?? 0, 200),
    });
  }

  // 4. Durate e rinnovi: "durata di 12 mesi", "per un periodo di 2 anni", "term of 12 months"
  for (const m of text.matchAll(
    /durata\s+di\s+(\d+)\s+(mesi|anni)|per\s+un\s+periodo\s+di\s+(\d+)\s+(mesi|anni)|term\s+of\s+(\d+)\s+(months|years)|si\s+rinnova\w*\s+(?:tacitamente\s+)?per/gi
  )) {
    push({
      label: it ? "Durata / rinnovo" : "Term / renewal",
      raw: sentenceAround(text, m.index ?? 0, 200),
    });
  }

  return out.slice(0, 20);
}

export function analyzeContract(
  text: string,
  locale: "it" | "en"
): ContractAnalysis {
  const clauses = findClauses(text, locale);
  return {
    engine: "heuristic",
    clauses,
    missing: findMissing(clauses, locale),
    keyDates: extractKeyDates(text, locale),
    summary: "",
    libraryVersion: CLAUSE_LIBRARY_VERSION,
  };
}
