import { describe, expect, it } from "vitest";
import {
  RAG_SIMILARITY_THRESHOLD,
  RAG_UPGRADE_THRESHOLD,
  applyReference,
  applyReferences,
} from "./rag";
import { REFERENCE_SNIPPETS, validateSnippets } from "./snippets";
import type { FoundClause } from "./types";

const clause: FoundClause = {
  category: "liability-cap",
  label: "Limitazione di responsabilità",
  level: "info",
  excerpt: "La responsabilità è limitata ai corrispettivi annui.",
  comment: "",
};

describe("libreria snippet di riferimento", () => {
  it("è integra: id unici, categorie valide, testi sostanziosi", () => {
    expect(validateSnippets()).toEqual([]);
    expect(REFERENCE_SNIPPETS.length).toBeGreaterThanOrEqual(20);
  });

  it("copre entrambi i tipi (standard e risky)", () => {
    const kinds = new Set(REFERENCE_SNIPPETS.map((s) => s.kind));
    expect(kinds.has("standard")).toBe(true);
    expect(kinds.has("risky")).toBe(true);
  });
});

describe("applyReference", () => {
  it("sotto soglia: nessun riferimento allegato", () => {
    const r = applyReference(clause, {
      kind: "risky",
      text: "x",
      similarity: RAG_SIMILARITY_THRESHOLD - 0.01,
    });
    expect(r.reference).toBeUndefined();
    expect(r.level).toBe("info");
  });

  it("match standard sopra soglia: riferimento allegato, livello invariato", () => {
    const r = applyReference(clause, { kind: "standard", text: "std", similarity: 0.9 });
    expect(r.reference?.kind).toBe("standard");
    expect(r.level).toBe("info");
  });

  it("match risky molto simile: alza 'info' a 'warning'", () => {
    const r = applyReference(clause, {
      kind: "risky",
      text: "rischiosa",
      similarity: RAG_UPGRADE_THRESHOLD + 0.01,
    });
    expect(r.reference?.kind).toBe("risky");
    expect(r.level).toBe("warning");
  });

  it("non abbassa MAI il livello (risk resta risk anche con match standard)", () => {
    const risky: FoundClause = { ...clause, level: "risk" };
    const r = applyReference(risky, { kind: "standard", text: "std", similarity: 0.95 });
    expect(r.level).toBe("risk");
  });

  it("similarità arrotondata a due decimali", () => {
    const r = applyReference(clause, { kind: "standard", text: "s", similarity: 0.8765 });
    expect(r.reference?.similarity).toBe(0.88);
  });
});

describe("applyReferences", () => {
  it("applica in blocco preservando ordine e clausole senza match", () => {
    const out = applyReferences(
      [clause, { ...clause, category: "penalties" }],
      [{ kind: "risky", text: "r", similarity: 0.9 }, null]
    );
    expect(out[0].reference).toBeDefined();
    expect(out[1].reference).toBeUndefined();
    expect(out).toHaveLength(2);
  });
});
