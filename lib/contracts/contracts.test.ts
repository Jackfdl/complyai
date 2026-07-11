import { describe, expect, it } from "vitest";
import { analyzeContract, extractKeyDates, findClauses, findMissing } from "./analyze";
import { buildContractPrompt, validateContractAnalysis } from "./llm";

const CONTRACT_IT = `Contratto di fornitura servizi cloud.
Art. 3 — Durata. Il contratto ha durata di 12 mesi a decorrere dal 01/09/2026 e si rinnova tacitamente per uguale periodo, salvo disdetta con preavviso di 60 giorni.
Art. 7 — La responsabilità del Fornitore è limitata all'importo dei corrispettivi annui.
Art. 9 — In caso di ritardo si applica una penale di euro 100 per giorno.
Art. 12 — Foro competente esclusivo è quello di Dublino.`;

describe("findClauses", () => {
  it("individua rinnovo tacito, limitazione responsabilità, penali e foro", () => {
    const found = findClauses(CONTRACT_IT, "it");
    const ids = found.map((f) => f.category);
    expect(ids).toContain("auto-renewal");
    expect(ids).toContain("liability-cap");
    expect(ids).toContain("penalties");
    expect(ids).toContain("governing-law");
    expect(ids).toContain("termination"); // "disdetta"
  });

  it("ogni clausola trovata ha estratto e commento dalla libreria", () => {
    const renewal = findClauses(CONTRACT_IT, "it").find((f) => f.category === "auto-renewal");
    expect(renewal?.excerpt).toMatch(/rinnova tacitamente/);
    expect(renewal?.comment).toMatch(/finestra di disdetta/);
    expect(renewal?.level).toBe("warning");
  });
});

describe("findMissing", () => {
  it("segnala le protezioni attese assenti (riservatezza, GDPR, forza maggiore)", () => {
    const found = findClauses(CONTRACT_IT, "it");
    const missing = findMissing(found, "it").map((m) => m.category);
    expect(missing).toContain("confidentiality");
    expect(missing).toContain("data-protection");
    expect(missing).toContain("force-majeure");
    expect(missing).not.toContain("termination");
  });
});

describe("extractKeyDates", () => {
  it("estrae la data assoluta con isoDate e la finestra di preavviso", () => {
    const dates = extractKeyDates(CONTRACT_IT, "it");
    expect(dates.some((d) => d.isoDate === "2026-09-01")).toBe(true);
    expect(dates.some((d) => d.label.includes("preavviso") || d.label.includes("Preavviso") || d.label.includes("disdetta"))).toBe(true);
    expect(dates.some((d) => d.label.includes("Durata"))).toBe(true);
  });

  it("estrae date testuali italiane (31 dicembre 2026)", () => {
    const dates = extractKeyDates("Il contratto scade il 31 dicembre 2026.", "it");
    expect(dates.some((d) => d.isoDate === "2026-12-31")).toBe(true);
  });

  it("scarta date impossibili (45/13/2026)", () => {
    const dates = extractKeyDates("Consegna il 45/13/2026 come da accordi.", "it");
    expect(dates.every((d) => !d.isoDate)).toBe(true);
  });
});

describe("analyzeContract (fallback completo)", () => {
  it("engine heuristic, con clausole, mancanti e date", () => {
    const r = analyzeContract(CONTRACT_IT, "it");
    expect(r.engine).toBe("heuristic");
    expect(r.clauses.length).toBeGreaterThanOrEqual(4);
    expect(r.missing.length).toBeGreaterThanOrEqual(3);
    expect(r.keyDates.length).toBeGreaterThanOrEqual(2);
    expect(r.libraryVersion).toMatch(/^v0\.1\.0/);
  });
});

describe("validateContractAnalysis", () => {
  const good = JSON.stringify({
    summary: "Contratto con rinnovo tacito e foro estero.",
    clauses: [
      { category: "auto-renewal", label: "Rinnovo tacito", level: "risk", excerpt: "si rinnova tacitamente", comment: "Disdetta 60gg" },
    ],
    missing: [{ label: "Riservatezza", why: "Assente" }],
    keyDates: [{ label: "Decorrenza", raw: "dal 01/09/2026", isoDate: "2026-09-01" }],
  });

  it("accetta e normalizza una risposta valida", () => {
    const r = validateContractAnalysis(good);
    expect(r?.clauses).toHaveLength(1);
    expect(r?.clauses[0].level).toBe("risk");
    expect(r?.keyDates[0].isoDate).toBe("2026-09-01");
  });

  it("normalizza livelli sconosciuti a 'info' e scarta isoDate malformate", () => {
    const odd = JSON.stringify({
      clauses: [{ label: "X", level: "boh", excerpt: "estratto" }],
      keyDates: [{ label: "D", raw: "r", isoDate: "31/12/2026" }],
    });
    const r = validateContractAnalysis(odd);
    expect(r?.clauses[0].level).toBe("info");
    expect(r?.keyDates[0].isoDate).toBeUndefined();
  });

  it("rifiuta risposte senza clausole valide", () => {
    expect(validateContractAnalysis("testo non json")).toBeNull();
    expect(validateContractAnalysis('{"clauses":[{"label":"senza excerpt"}]}')).toBeNull();
  });
});

describe("buildContractPrompt", () => {
  it("contiene categorie della libreria, schema JSON e il testo", () => {
    const p = buildContractPrompt("Testo del contratto.", "it");
    expect(p).toContain("auto-renewal");
    expect(p).toContain('{"summary"');
    expect(p).toContain("Testo del contratto.");
    expect(p).toMatch(/Non inventare/);
  });
});

describe("sentenceAround (qualità estratti)", () => {
  it("non spezza i separatori decimali", () => {
    const t = "Il Fornitore applica una penale di euro 36.000 in caso di grave ritardo.";
    const pen = findClauses(t, "it").find((c) => c.category === "penalties");
    expect(pen?.excerpt).toContain("36.000");
  });
  it("non spezza le abbreviazioni (art., c.c.)", () => {
    const t = "Ai sensi dell'art. 1229 c.c. la responsabilità è limitata al massimo previsto.";
    const cap = findClauses(t, "it").find((c) => c.category === "liability-cap");
    expect(cap?.excerpt).toContain("responsabilità è limitata");
    expect(cap?.excerpt).toContain("art. 1229");
  });
});

describe("libreria clausole ampliata", () => {
  it("individua IP, esclusiva, modifiche unilaterali, revisione prezzi e SLA", () => {
    const t = [
      "La proprietà intellettuale degli sviluppi resta del Fornitore.",
      "È previsto un patto di esclusiva a favore del Fornitore.",
      "Il Fornitore si riserva di modificare le condizioni economiche.",
      "È ammessa la revisione dei prezzi su base annua.",
      "I livelli di servizio (SLA) prevedono un uptime del 99%.",
    ].join("\n");
    const ids = findClauses(t, "it").map((c) => c.category);
    expect(ids).toContain("ip");
    expect(ids).toContain("exclusivity");
    expect(ids).toContain("unilateral-changes");
    expect(ids).toContain("price-revision");
    expect(ids).toContain("sla");
  });
  it("non confonde il foro esclusivo con l'esclusiva contrattuale", () => {
    const t = "Foro competente esclusivo per ogni controversia è quello di Milano.";
    const ids = findClauses(t, "it").map((c) => c.category);
    expect(ids).toContain("governing-law");
    expect(ids).not.toContain("exclusivity");
  });
});
