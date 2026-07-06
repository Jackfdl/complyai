import { describe, expect, it } from "vitest";
import { classify, isArt63ExemptionValid } from "./engine";
import type { CheckerAnswers } from "./types";

const base: CheckerAnswers = {
  role: "deployer",
  systemName: "Test",
  systemDescription: "",
  prohibitedPractices: [],
  annexI: "no",
  safetyCarveout: false,
  annexIIIAreas: [],
  art63Exemptions: [],
  profiling: false,
  transparencyFlags: [],
  gpai: false,
};

describe("classify — pratiche vietate", () => {
  it("una pratica art. 5 produce esito 'prohibited' e prevale su tutto", () => {
    const r = classify({
      ...base,
      prohibitedPractices: ["emotion-work-school"],
      annexIIIAreas: ["employment"],
      transparencyFlags: ["chatbot"],
    });
    expect(r.level).toBe("prohibited");
    expect(r.findings.some((f) => f.ref.includes("5(1)(f)"))).toBe(true);
    // niente obblighi alto rischio in un esito vietato
    expect(r.obligations.some((o) => o.id.startsWith("hr-"))).toBe(false);
  });

  it("il nuovo divieto NCII/CSAM aggiunge la scadenza Omnibus 2 dic 2026", () => {
    const r = classify({ ...base, prohibitedPractices: ["ncii-csam"] });
    expect(r.level).toBe("prohibited");
    expect(r.deadlines.some((d) => d.date === "2 dic 2026" && d.pendingOmnibus)).toBe(true);
  });
});

describe("classify — alto rischio Annex III", () => {
  it("area Annex III senza deroghe → high con scadenza 2 dic 2027 (Omnibus)", () => {
    const r = classify({ ...base, annexIIIAreas: ["employment"] });
    expect(r.level).toBe("high");
    expect(r.deadlines.some((d) => d.date === "2 dic 2027" && d.pendingOmnibus)).toBe(true);
    expect(r.caveats.join(" ")).toMatch(/Gazzetta Ufficiale/);
  });

  it("deployer riceve gli obblighi art. 26, non quelli del provider", () => {
    const r = classify({ ...base, role: "deployer", annexIIIAreas: ["employment"] });
    expect(r.obligations.some((o) => o.id === "hr-d-26-7")).toBe(true);
    expect(r.obligations.some((o) => o.id === "hr-p-9")).toBe(false);
  });

  it("provider riceve artt. 9–15 e registrazione", () => {
    const r = classify({ ...base, role: "provider", annexIIIAreas: ["essential-services"] });
    expect(r.obligations.some((o) => o.id === "hr-p-9")).toBe(true);
    expect(r.obligations.some((o) => o.id === "hr-p-49")).toBe(true);
    expect(r.obligations.some((o) => o.id === "hr-d-26-1")).toBe(false);
  });

  it("role 'both' unisce i due set di obblighi", () => {
    const r = classify({ ...base, role: "both", annexIIIAreas: ["employment"] });
    expect(r.obligations.some((o) => o.id === "hr-p-9")).toBe(true);
    expect(r.obligations.some((o) => o.id === "hr-d-26-1")).toBe(true);
  });
});

describe("classify — deroga art. 6(3)", () => {
  it("deroga valida senza profilazione → non alto rischio, con obbligo di documentazione", () => {
    const r = classify({
      ...base,
      role: "provider",
      annexIIIAreas: ["employment"],
      art63Exemptions: ["narrow-procedural"],
    });
    expect(r.level).toBe("minimal");
    expect(r.obligations.some((o) => o.id === "hr-63-doc")).toBe(true);
    expect(r.findings.some((f) => f.kind === "exempt-63")).toBe(true);
  });

  it("la profilazione annulla la deroga (art. 6(3) ultimo comma)", () => {
    expect(
      isArt63ExemptionValid({ ...base, art63Exemptions: ["narrow-procedural"], profiling: true })
    ).toBe(false);
    const r = classify({
      ...base,
      annexIIIAreas: ["employment"],
      art63Exemptions: ["narrow-procedural"],
      profiling: true,
    });
    expect(r.level).toBe("high");
    expect(r.findings.some((f) => f.title.includes("profilazione"))).toBe(true);
  });
});

describe("classify — trasparenza art. 50", () => {
  it("chatbot senza altro → 'transparency' con scadenza 2 ago 2026 NON rinviata", () => {
    const r = classify({ ...base, transparencyFlags: ["chatbot"] });
    expect(r.level).toBe("transparency");
    const d = r.deadlines.find((x) => x.date === "2 ago 2026");
    expect(d).toBeDefined();
    expect(d?.pendingOmnibus).toBeUndefined();
  });

  it("la trasparenza si somma all'alto rischio senza abbassarlo", () => {
    const r = classify({ ...base, annexIIIAreas: ["employment"], transparencyFlags: ["chatbot"] });
    expect(r.level).toBe("high");
    expect(r.obligations.some((o) => o.id === "t-chatbot")).toBe(true);
  });
});

describe("classify — Annex I e macchinari", () => {
  it("prodotto regolamentato sez. A → high con scadenza 2 ago 2028", () => {
    const r = classify({ ...base, role: "provider", annexI: "sectionA" });
    expect(r.level).toBe("high");
    expect(r.deadlines.some((d) => d.date === "2 ago 2028")).toBe(true);
  });

  it("carve-out funzioni non di sicurezza → non alto rischio (Omnibus)", () => {
    const r = classify({ ...base, annexI: "sectionA", safetyCarveout: true });
    expect(r.level).toBe("minimal");
    expect(r.caveats.join(" ")).toMatch(/Gazzetta Ufficiale/);
  });

  it("macchinari → regime speciale segnalato, non high automatico", () => {
    const r = classify({ ...base, annexI: "machinery" });
    expect(r.level).toBe("minimal");
    expect(r.findings.some((f) => f.kind === "machinery")).toBe(true);
  });
});

describe("classify — minimo e baseline", () => {
  it("nessun flag → minimal con obblighi baseline (art. 4, GDPR)", () => {
    const r = classify(base);
    expect(r.level).toBe("minimal");
    expect(r.obligations.some((o) => o.id === "base-4")).toBe(true);
    expect(r.obligations.some((o) => o.id === "base-gdpr")).toBe(true);
  });

  it("gpai aggiunge il rinvio artt. 53–55 per il provider", () => {
    const r = classify({ ...base, role: "provider", gpai: true });
    expect(r.obligations.some((o) => o.id === "gpai-53")).toBe(true);
  });
});
