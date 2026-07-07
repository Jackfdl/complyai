import { describe, expect, it } from "vitest";
import {
  auditToCsv,
  filterEntries,
  moduleKey,
  moduleLabel,
  parseAction,
  summarizeEntry,
  verbLabel,
  type AuditRecord,
} from "./logic";

const rec = (over: Partial<AuditRecord>): AuditRecord => ({
  id: 1,
  at: "2026-07-07T10:00:00Z",
  action: "deadline.created",
  entity: "deadlines",
  entity_id: "abc",
  details: null,
  prev_state: null,
  new_state: null,
  ...over,
});

const SAMPLE: AuditRecord[] = [
  rec({ id: 1, action: "assessment.created", entity: "assessments", new_state: { system_name: "Chatbot HR", level: "high" } }),
  rec({ id: 2, action: "deadline.updated", entity: "deadlines", new_state: { title: "Disdetta noleggio", due_date: "2026-09-01" } }),
  rec({ id: 3, action: "contract_review.deleted", entity: "contract_reviews", prev_state: { title: "Fornitura cloud" } }),
  rec({ id: 4, action: "matrix.created", entity: "control_matrices", new_state: { title: "GDPR", rows: 12 } }),
];

describe("parseAction", () => {
  it("estrae modulo e verbo noti", () => {
    expect(parseAction("deadline.updated")).toEqual({ module: "deadline", verb: "updated" });
    expect(parseAction("contract_review.deleted")).toEqual({ module: "contract_review", verb: "deleted" });
  });
  it("normalizza verbi sconosciuti a 'other'", () => {
    expect(parseAction("watch.run").verb).toBe("other");
    expect(parseAction("senzaverbo").verb).toBe("other");
  });
});

describe("moduleKey / moduleLabel", () => {
  it("usa il prefisso azione e ripiega sulla colonna entity", () => {
    expect(moduleKey(SAMPLE[0])).toBe("assessment");
    expect(moduleKey(rec({ action: "boh", entity: "deadlines" }))).toBe("deadline");
  });
  it("etichetta bilingue", () => {
    expect(moduleLabel("contract_review", "it")).toBe("Revisione contratto");
    expect(moduleLabel("contract_review", "en")).toBe("Contract review");
    expect(verbLabel("deleted", "it")).toBe("Eliminazione");
  });
});

describe("summarizeEntry", () => {
  it("riassume i campi noti dallo stato", () => {
    expect(summarizeEntry(SAMPLE[0], "it")).toContain("Sistema: Chatbot HR");
    expect(summarizeEntry(SAMPLE[1], "it")).toContain("Scadenza: 2026-09-01");
    expect(summarizeEntry(SAMPLE[3], "it")).toContain("Righe: 12");
  });
  it("usa prev_state per le eliminazioni", () => {
    expect(summarizeEntry(SAMPLE[2], "it")).toContain("Titolo: Fornitura cloud");
  });
});

describe("filterEntries", () => {
  it("filtra per modulo", () => {
    const r = filterEntries(SAMPLE, { module: "deadline" }, "it");
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe(2);
  });
  it("filtra per verbo", () => {
    expect(filterEntries(SAMPLE, { verb: "created" }, "it").map((e) => e.id)).toEqual([1, 4]);
  });
  it("filtra per testo su etichetta e sintesi", () => {
    expect(filterEntries(SAMPLE, { query: "cloud" }, "it").map((e) => e.id)).toEqual([3]);
    expect(filterEntries(SAMPLE, { query: "revisione" }, "it").map((e) => e.id)).toEqual([3]);
  });
  it("all = nessun filtro", () => {
    expect(filterEntries(SAMPLE, { module: "all", verb: "all", query: "" }, "it")).toHaveLength(4);
  });
});

describe("auditToCsv", () => {
  const csv = auditToCsv(SAMPLE, "it", ["Quando", "Modulo", "Azione", "Action", "ID", "Dettaglio"]);
  it("ha intestazione e una riga per voce", () => {
    const rows = csv.trimEnd().split("\r\n");
    expect(rows).toHaveLength(5);
    expect(rows[0]).toBe("Quando,Modulo,Azione,Action,ID,Dettaglio");
  });
  it("include etichette leggibili e azione grezza", () => {
    expect(csv).toContain("Revisione contratto");
    expect(csv).toContain("contract_review.deleted");
  });
  it("effettua l'escaping delle virgole", () => {
    const withComma = auditToCsv(
      [rec({ new_state: { title: "A, B, C" } })],
      "it",
      ["a", "b", "c", "d", "e", "f"]
    );
    expect(withComma).toContain('"Titolo: A, B, C"');
  });
});
