// Motore di classificazione — funzioni pure, deterministiche, testate (engine.test.ts).
// Nessun LLM: ogni esito deriva dalle risposte e cita la base normativa.
import {
  CONTENT_VERSION,
  OMNIBUS_CAVEAT,
  annexIIIAreas,
  art63DocumentationObligation,
  art63Exemptions,
  baselineObligations,
  gpaiObligations,
  highRiskDeployerObligations,
  highRiskProviderObligations,
  prohibitedGuidance,
  prohibitedPractices,
  transparencyFlags,
} from "./content";
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

export function classify(answers: CheckerAnswers): ClassificationResult {
  const findings: Finding[] = [];
  const obligations: Obligation[] = [];
  const deadlines: DeadlineItem[] = [];
  const caveats: string[] = [];
  let pendingOmnibusUsed = false;

  // --- 1. Pratiche vietate (art. 5): prevalgono su tutto -------------------
  const prohibited = byId(prohibitedPractices, answers.prohibitedPractices);
  if (prohibited.length > 0) {
    for (const p of prohibited) {
      findings.push({
        kind: "prohibited",
        title: `Pratica vietata: ${p.label}`,
        detail: p.description + (p.note ? ` — ${p.note}` : ""),
        ref: p.ref,
      });
    }
    deadlines.push({
      date: "Già applicabile (dal 2 feb 2025)",
      what: "Divieti art. 5 in vigore; sanzioni fino a 35 M€ / 7% del fatturato mondiale.",
      ref: "Artt. 5, 99(3) e 113 AI Act",
    });
    if (prohibited.some((p) => p.id === "ncii-csam")) {
      deadlines.push({
        date: "2 dic 2026",
        what: "Efficacia del nuovo divieto su NCII/CSAM introdotto dall'Omnibus.",
        ref: "Art. 5 AI Act mod. Omnibus",
        pendingOmnibus: true,
      });
      pendingOmnibusUsed = true;
    }
    obligations.push(...forRole(prohibitedGuidance, answers.role));
    caveats.push(
      "Esito basato sulle tue risposte: se ritieni applicabile un'eccezione prevista dall'art. 5, serve una verifica legale professionale prima di procedere."
    );
    if (pendingOmnibusUsed) caveats.push(OMNIBUS_CAVEAT);
    return {
      level: "prohibited",
      findings,
      obligations,
      deadlines,
      caveats,
      contentVersion: CONTENT_VERSION,
    };
  }

  // --- 2. Alto rischio ------------------------------------------------------
  let high = false;

  // 2a. Annex I (prodotti regolamentati)
  if (answers.annexI === "sectionA") {
    if (answers.safetyCarveout) {
      findings.push({
        kind: "high-annex1",
        title: "Prodotto regolamentato, ma funzione non di sicurezza",
        detail:
          "Funzioni limitate ad assistenza, ottimizzazione, comfort o controllo qualità non costituiscono «componente di sicurezza» se un malfunzionamento non mette in pericolo salute o sicurezza (definizione ristretta dall'Omnibus). Da documentare.",
        ref: "Art. 6(1) AI Act mod. Omnibus",
      });
      pendingOmnibusUsed = true;
    } else {
      high = true;
      findings.push({
        kind: "high-annex1",
        title: "Alto rischio — Annex I (prodotto regolamentato)",
        detail:
          "Sistema che è (o è componente di sicurezza di) un prodotto soggetto alla normativa UE armonizzata elencata in Annex I, sez. A.",
        ref: "Art. 6(1) e Annex I AI Act",
      });
      deadlines.push({
        date: "2 ago 2028",
        what: "Applicazione obblighi alto rischio per sistemi Annex I (post-Omnibus; era 2 ago 2027).",
        ref: "Art. 113 AI Act mod. Omnibus",
        pendingOmnibus: true,
      });
      pendingOmnibusUsed = true;
    }
  }
  if (answers.annexI === "machinery") {
    findings.push({
      kind: "machinery",
      title: "Macchinari: regime speciale post-Omnibus",
      detail:
        "Il Regolamento Macchine è spostato in Annex I sez. B: gli obblighi AI Act cap. III non si applicano direttamente; i requisiti AI saranno integrati nella normativa di settore (atti delegati attesi entro ago 2028). Resta la conformità al Reg. Macchine.",
      ref: "Annex I AI Act mod. Omnibus; Reg. (UE) 2023/1230",
    });
    pendingOmnibusUsed = true;
    caveats.push(
      "Ambito macchinari in evoluzione: monitora gli atti delegati della Commissione prima di considerare stabile questo esito."
    );
  }
  if (answers.annexI === "unsure") {
    caveats.push(
      "Non hai saputo indicare se il sistema rientra in un prodotto regolamentato (Annex I): verifica con il fornitore o un consulente, perché cambia scadenze e obblighi."
    );
  }

  // 2b. Annex III (casi d'uso)
  const areas = byId(annexIIIAreas, answers.annexIIIAreas);
  if (areas.length > 0) {
    const exemptionValid = isArt63ExemptionValid(answers);
    if (exemptionValid) {
      const ex = byId(art63Exemptions, answers.art63Exemptions);
      findings.push({
        kind: "exempt-63",
        title: "Caso d'uso Annex III con deroga art. 6(3) rivendicata",
        detail: `Aree: ${areas.map((a) => a.label).join("; ")}. Deroghe: ${ex
          .map((e) => e.label)
          .join("; ")}. La valutazione va documentata e il sistema registrato.`,
        ref: "Art. 6(3)–(4) AI Act",
      });
      obligations.push(...forRole([art63DocumentationObligation], answers.role));
      caveats.push(
        "La deroga art. 6(3) è un'autovalutazione che l'autorità può contestare: documentala con rigore e falla verificare da un professionista."
      );
    } else {
      high = true;
      for (const a of areas) {
        findings.push({
          kind: "high-annex3",
          title: `Alto rischio — ${a.label}`,
          detail: a.description + (a.note ? ` — ${a.note}` : ""),
          ref: a.ref,
        });
      }
      if (answers.profiling && answers.art63Exemptions.length > 0) {
        findings.push({
          kind: "high-annex3",
          title: "Deroga art. 6(3) non applicabile per profilazione",
          detail:
            "Un sistema Annex III che effettua profilazione di persone fisiche è sempre considerato ad alto rischio, anche se ricorre una delle condizioni di deroga.",
          ref: "Art. 6(3), ultimo comma, AI Act",
        });
      }
      deadlines.push({
        date: "2 dic 2027",
        what: "Applicazione obblighi alto rischio per sistemi Annex III (post-Omnibus; era 2 ago 2026).",
        ref: "Art. 113 AI Act mod. Omnibus",
        pendingOmnibus: true,
      });
      pendingOmnibusUsed = true;
    }
  }

  if (high) {
    obligations.push(...forRole(highRiskProviderObligations, answers.role));
    obligations.push(...forRole(highRiskDeployerObligations, answers.role));
  }

  // --- 3. Trasparenza (art. 50) — si applica anche in aggiunta all'alto rischio
  const flags = byId(transparencyFlags, answers.transparencyFlags);
  if (flags.length > 0) {
    for (const f of flags) {
      findings.push({
        kind: "transparency",
        title: `Obbligo di trasparenza: ${f.label}`,
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
        deadline: "2 ago 2026",
      });
    }
    deadlines.push({
      date: "2 ago 2026",
      what: "Obblighi di trasparenza art. 50: NON rinviati dall'Omnibus (unica grazia: marcatura 50(2) al 2 dic 2026 per sistemi già sul mercato).",
      ref: "Art. 50 e 113 AI Act",
    });
  }

  // --- 4. GPAI ---------------------------------------------------------------
  if (answers.gpai) {
    findings.push({
      kind: "gpai",
      title: "Provider di modello GPAI",
      detail: "Obblighi specifici in vigore dal 2 ago 2025 (documentazione, copyright policy, sintesi training data).",
      ref: "Artt. 51–56 AI Act",
    });
    obligations.push(...forRole(gpaiObligations, answers.role));
    deadlines.push({
      date: "Già applicabile (dal 2 ago 2025)",
      what: "Obblighi per provider di modelli GPAI.",
      ref: "Artt. 51–56 e 113 AI Act",
    });
  }

  // --- 5. Livello finale + baseline -----------------------------------------
  const level = high ? "high" : flags.length > 0 ? "transparency" : "minimal";
  if (level === "minimal") {
    findings.push({
      kind: "minimal",
      title: "Nessun obbligo specifico individuato (rischio minimo)",
      detail:
        "In base alle risposte, il sistema non ricade in divieti, alto rischio o obblighi di trasparenza. Restano le buone prassi e gli obblighi generali.",
      ref: "Reg. (UE) 2024/1689 (impianto per livelli di rischio)",
    });
  }
  obligations.push(...forRole(baselineObligations, answers.role));

  if (pendingOmnibusUsed || obligations.some((o) => o.pendingOmnibus)) {
    caveats.push(OMNIBUS_CAVEAT);
  }

  return { level, findings, obligations, deadlines, caveats, contentVersion: CONTENT_VERSION };
}
