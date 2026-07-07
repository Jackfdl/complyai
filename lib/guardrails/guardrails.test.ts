import { describe, expect, it } from "vitest";
import {
  CATEGORY_LABELS,
  GUARDRAILS,
  GUARDRAILS_VERSION,
  GUARDRAIL_CATEGORY_ORDER,
  guardrailsByCategory,
  type GuardrailCategory,
} from "./content";

describe("guardrails — integrità", () => {
  it("ha una versione", () => {
    expect(GUARDRAILS_VERSION).toMatch(/^v\d/);
  });

  it("id univoci", () => {
    const ids = GUARDRAILS.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ogni guardrail ha principio e dettaglio in IT e EN non vuoti", () => {
    for (const g of GUARDRAILS) {
      expect(g.principle.it.trim().length).toBeGreaterThan(0);
      expect(g.principle.en.trim().length).toBeGreaterThan(0);
      expect(g.detail.it.trim().length).toBeGreaterThan(0);
      expect(g.detail.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("ogni categoria usata è nell'ordine di presentazione e ha etichetta", () => {
    for (const g of GUARDRAILS) {
      expect(GUARDRAIL_CATEGORY_ORDER).toContain(g.category);
      expect(CATEGORY_LABELS[g.category].it.length).toBeGreaterThan(0);
      expect(CATEGORY_LABELS[g.category].en.length).toBeGreaterThan(0);
    }
  });

  it("ogni categoria dichiarata ha almeno un guardrail", () => {
    for (const cat of GUARDRAIL_CATEGORY_ORDER) {
      expect(guardrailsByCategory(cat as GuardrailCategory).length).toBeGreaterThan(0);
    }
  });

  it("guardrailsByCategory partiziona tutti i guardrail", () => {
    const total = GUARDRAIL_CATEGORY_ORDER.reduce(
      (n, c) => n + guardrailsByCategory(c as GuardrailCategory).length,
      0
    );
    expect(total).toBe(GUARDRAILS.length);
  });
});
