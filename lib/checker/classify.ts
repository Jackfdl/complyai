// Motore di classificazione — funzioni pure, deterministiche, multilingua.
// Testato in classify.test.ts. Nessun LLM: ogni esito cita la base normativa.
import type { Locale } from "@/lib/i18n";
import { getContent } from "./packs";
import type {
  CheckerAnswers,
  ClassificationResult,
  DeadlineItem,
  Finding,
  Obligation,
  Role,
} from "./types";

function byId<T extends { id: string }>(items: T[], ids: string[]): T[] {
  return items.filter((i) => ids.includes(i.id));
}

function forRole(obligations: Obligation[], role: Role): Obligation[] {
  if (role === "both") return obligations;
  return obligations.filter((o) => o.appliesTo.includes(role));
}

/** Deroga art. 6(3) valida solo se rivendicata E senza profilazione (art. 6(3), ultimo comma). */
export function isArt63ExemptionValid(answers: CheckerAnswers): boolean {
  return answers.art63Exemptions.length > 0 && !answers.profiling;
}

export function classify(
  answers: CheckerAnswers,
  locale: Locale = "it"
): ClassificationResult {
  const c = getContent(locale);
  const s = c.strings;
  const findings: Finding[] = [];
  const obligations: Obligation[] = [];
  const deadlines: DeadlineItem[] = [];
  const caveats: string[] = [];
  let pendingOmnibusUsed = false;

  // --- 1. Pratiche vietate (art. 5): prevalgono su tutto -------------------
  const prohibited = byId(c.prohibitedPractices, answers.prohibitedPractices);
  if (prohibited.length > 0) {
    for (const p of prohibited) {
      findings.push({
        kind: "prohibited",
        title: `${s.prohibitedPrefix} ${p.label}`,
        detail: p.description + (p.note ? ` — ${p.note}` : ""),
        ref: p.ref,
      });
    }
    deadlines.push(s.dlProhibited);
    if (prohibited.some((p) => p.id === "ncii-csam")) {
      deadlines.push(s.dlNcii);
      pendingOmnibusUsed = true;
    }
    obligations.push(...forRole(c.prohibitedGuidance, answers.role));
    caveats.push(s.cProhibitedException);
    if (pendingOmnibusUsed) caveats.push(c.omnibusCaveat);
    if (c.reviewCaveat) caveats.push(c.reviewCaveat);
    return {
      level: "prohibited",
      findings,
      obligations,
      deadlines,
      caveats,
      contentVersion: c.version,
    };
  }

  // --- 2. Alto rischio ------------------------------------------------------
  let high = false;

  // 2a. Annex I (prodotti regolamentati)
  if (answers.annexI === "sectionA") {
    if (answers.safetyCarveout) {
      findings.push({ kind: "high-annex1", ...s.fCarveout });
      pendingOmnibusUsed = true;
    } else {
      high = true;
      findings.push({ kind: "high-annex1", ...s.fAnnex1 });
      deadlines.push(s.dlAnnex1);
      pendingOmnibusUsed = true;
    }
  }
  if (answers.annexI === "machinery") {
    findings.push({ kind: "machinery", ...s.fMachinery });
    pendingOmnibusUsed = true;
    caveats.push(s.cMachinery);
  }
  if (answers.annexI === "unsure") {
    caveats.push(s.cAnnexIUnsure);
  }

  // 2b. Annex III (casi d'uso)
  const areas = byId(c.annexIIIAreas, answers.annexIIIAreas);
  if (areas.length > 0) {
    const exemptionValid = isArt63ExemptionValid(answers);
    if (exemptionValid) {
      const ex = byId(c.art63Exemptions, answers.art63Exemptions);
      findings.push({
        kind: "exempt-63",
        title: s.fExempt63.title,
        detail: s.fExempt63.detail(
          areas.map((a) => a.label).join("; "),
          ex.map((e) => e.label).join("; ")
        ),
        ref: s.fExempt63.ref,
      });
      obligations.push(...forRole([c.art63Doc], answers.role));
      caveats.push(s.cExempt63);
    } else {
      high = true;
      for (const a of areas) {
        findings.push({
          kind: "high-annex3",
          title: a.label,
          detail: a.description + (a.note ? ` — ${a.note}` : ""),
          ref: a.ref,
        });
      }
      if (answers.profiling && answers.art63Exemptions.length > 0) {
        findings.push({ kind: "high-annex3", ...s.fProfiling });
      }
      deadlines.push(s.dlAnnex3);
      pendingOmnibusUsed = true;
    }
  }

  if (high) {
    obligations.push(...forRole(c.highRiskProvider, answers.role));
    obligations.push(...forRole(c.highRiskDeployer, answers.role));
  }

  // --- 3. Trasparenza (art. 50) — si somma senza abbassare l'alto rischio ---
  const flags = byId(c.transparencyFlags, answers.transparencyFlags);
  if (flags.length > 0) {
    for (const f of flags) {
      findings.push({
        kind: "transparency",
        title: `${s.transparencyPrefix} ${f.label}`,
        detail: f.description + (f.note ? ` — ${f.note}` : ""),
        ref: f.ref,
      });
      obligations.push({
        id: `t-${f.id}`,
        label: f.label,
        description: f.description,
        ref: f.ref,
        note: f.note,
        appliesTo: ["provider", "deployer"],
        deadline: s.dlArt50.date,
      });
    }
    deadlines.push(s.dlArt50);
  }

  // --- 4. GPAI ---------------------------------------------------------------
  if (answers.gpai) {
    findings.push({ kind: "gpai", ...s.fGpai });
    obligations.push(...forRole(c.gpai, answers.role));
    deadlines.push(s.dlGpai);
  }

  // --- 5. Livello finale + baseline -----------------------------------------
  const level = high ? "high" : flags.length > 0 ? "transparency" : "minimal";
  if (level === "minimal") {
    findings.push({ kind: "minimal", ...s.fMinimal });
  }
  obligations.push(...forRole(c.baseline, answers.role));

  if (pendingOmnibusUsed || obligations.some((o) => o.pendingOmnibus)) {
    caveats.push(c.omnibusCaveat);
  }
  if (c.reviewCaveat) caveats.push(c.reviewCaveat);

  return {
    level,
    findings,
    obligations,
    deadlines,
    caveats,
    contentVersion: c.version,
  };
}
