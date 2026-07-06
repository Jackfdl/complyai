import { describe, expect, it } from "vitest";
import { segmentPolicy, splitSentences } from "./segment";
import { analyzeHeuristic, suggestRow } from "./heuristics";
import { buildPrompt, validateLlmRows } from "./llm";

const POLICY_IT = `Policy uso AI aziendale.
1. Il personale deve utilizzare solo strumenti AI approvati dal responsabile IT.
2. È vietato inserire dati personali dei clienti nei prompt di sistemi AI esterni.
3. I dipendenti dovrebbero segnalare preferibilmente ogni output anomalo.
Il weekend l'ufficio è chiuso.`;

describe("segmentPolicy", () => {
  it("individua obbligo, divieto e raccomandazione, ignorando frasi neutre", () => {
    const st = segmentPolicy(POLICY_IT);
    expect(st).toHaveLength(3);
    expect(st[0].kind).toBe("obligation");
    expect(st[1].kind).toBe("prohibition");
    expect(st[2].kind).toBe("recommendation");
  });

  it("'non deve' è divieto, non obbligo (priorità dei marcatori)", () => {
    const st = segmentPolicy("Il fornitore non deve subappaltare il servizio senza consenso scritto.");
    expect(st[0].kind).toBe("prohibition");
  });

  it("funziona anche in inglese", () => {
    const st = segmentPolicy(
      "Employees must complete annual security training. Vendors shall not access production data."
    );
    expect(st.map((s) => s.kind)).toEqual(["obligation", "prohibition"]);
  });

  it("splitSentences ripulisce numerazioni ed elenchi puntati", () => {
    const s = splitSentences("- il personale deve firmare il registro degli accessi;\n2) i log devono essere conservati.");
    expect(s[0].startsWith("il personale deve")).toBe(true);
    expect(s[1].startsWith("i log devono")).toBe(true);
  });
});

describe("heuristics", () => {
  it("assegna owner e cadenza dai contesti (privacy → DPO, annuale)", () => {
    const st = segmentPolicy("I dati personali devono essere cancellati con verifica annuale.")[0];
    const row = suggestRow(st, "it");
    expect(row.owner).toMatch(/DPO/);
    expect(row.frequency).toBe("Annuale");
  });

  it("divieti → controllo di verifica assenza violazioni", () => {
    const st = segmentPolicy("È vietato condividere le credenziali di accesso.")[0];
    const row = suggestRow(st, "it");
    expect(row.control).toMatch(/assenza di violazioni/);
    expect(row.owner).toMatch(/IT/);
  });

  it("analyzeHeuristic produce engine 'heuristic' con righe", () => {
    const r = analyzeHeuristic(POLICY_IT, "it");
    expect(r.engine).toBe("heuristic");
    expect(r.rows.length).toBe(3);
    expect(r.rows[0].requirement).toMatch(/strumenti AI approvati/);
  });
});

describe("validateLlmRows", () => {
  const good = JSON.stringify({
    rows: [
      { requirement: "R1", control: "C1", owner: "IT", frequency: "Mensile", evidence: "Log" },
    ],
  });

  it("accetta JSON valido", () => {
    const rows = validateLlmRows(good);
    expect(rows).toHaveLength(1);
    expect(rows?.[0].requirement).toBe("R1");
  });

  it("tollera code fence e testo attorno", () => {
    const rows = validateLlmRows("Ecco il risultato:\n```json\n" + good + "\n```\nSpero aiuti!");
    expect(rows).toHaveLength(1);
  });

  it("rifiuta risposte senza rows o non-JSON", () => {
    expect(validateLlmRows("non è json")).toBeNull();
    expect(validateLlmRows('{"altro": 1}')).toBeNull();
    expect(validateLlmRows('{"rows": [{"control": "senza requirement"}]}')).toBeNull();
  });

  it("scarta righe senza requirement ma tiene le valide", () => {
    const mixed = JSON.stringify({ rows: [{ control: "x" }, { requirement: "ok" }] });
    const rows = validateLlmRows(mixed);
    expect(rows).toHaveLength(1);
    expect(rows?.[0].requirement).toBe("ok");
  });
});

describe("buildPrompt", () => {
  it("contiene schema JSON, limite righe e il testo della policy", () => {
    const p = buildPrompt("Testo della policy.", "it");
    expect(p).toContain('{"rows":[{"requirement"');
    expect(p).toContain("Massimo 40 righe");
    expect(p).toContain("Testo della policy.");
  });
});
