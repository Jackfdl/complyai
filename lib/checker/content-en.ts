// Regulatory content — ENGLISH.
// Translated from the Italian reference version (D7); same ids, checked by tests.
// ⚠️ Not yet reviewed by a legal professional: the UI shows a review caveat.
import type { CheckerContent } from "./packs";

export const contentEn: CheckerContent = {
  version: "v0.2.0-beta (6 July 2026)",
  omnibusCaveat:
    "Dates and rules marked 'Omnibus' come from the Digital Omnibus on AI, finally approved by the EU Council on 29 June 2026 but binding only once published in the Official Journal (expected by 2 August 2026). Check the status on EUR-Lex.",
  legalDisclaimer:
    "This report is for information purposes and does not constitute legal advice. The classification is based on the answers you provided: inaccurate answers produce inaccurate results. For decisions with legal effects, consult a qualified professional.",
  reviewCaveat:
    "The English version of the regulatory content has not yet been reviewed by a legal professional: the Italian version is the reference text.",

  prohibitedPractices: [
    {
      id: "subliminal",
      label: "Subliminal or deceptive manipulation",
      description:
        "Subliminal or purposefully manipulative/deceptive techniques that materially distort people's behaviour, causing (or making likely) significant harm.",
      ref: "Art. 5(1)(a) AI Act",
    },
    {
      id: "vulnerabilities",
      label: "Exploitation of vulnerabilities",
      description:
        "Exploiting vulnerabilities due to age, disability or socio-economic situation to distort behaviour, causing significant harm.",
      ref: "Art. 5(1)(b) AI Act",
    },
    {
      id: "social-scoring",
      label: "Social scoring",
      description:
        "Evaluating/classifying people based on social behaviour or personal characteristics, leading to detrimental treatment that is disproportionate or out of context.",
      ref: "Art. 5(1)(c) AI Act",
    },
    {
      id: "crime-prediction",
      label: "Crime prediction based solely on profiling",
      description:
        "Assessing the risk that a person commits a criminal offence based solely on profiling or personality traits.",
      ref: "Art. 5(1)(d) AI Act",
      note: "Does not cover support to human assessment based on objective, verifiable facts.",
    },
    {
      id: "face-scraping",
      label: "Untargeted scraping of facial images",
      description:
        "Creating/expanding facial recognition databases through untargeted scraping from the internet or CCTV footage.",
      ref: "Art. 5(1)(e) AI Act",
    },
    {
      id: "emotion-work-school",
      label: "Emotion recognition at work or school",
      description:
        "Inferring a person's emotions in the workplace or in education institutions.",
      ref: "Art. 5(1)(f) AI Act",
      note: "Exception: medical or safety reasons.",
    },
    {
      id: "biometric-sensitive",
      label: "Biometric categorisation on sensitive data",
      description:
        "Biometric categorisation to infer race, political opinions, trade union membership, religious/philosophical beliefs, sex life or sexual orientation.",
      ref: "Art. 5(1)(g) AI Act",
    },
    {
      id: "rbi-realtime",
      label: "Real-time remote biometric identification",
      description:
        "‘Real-time’ remote biometric identification in publicly accessible spaces for law-enforcement purposes.",
      ref: "Art. 5(1)(h) AI Act",
      note: "Narrow, strictly conditioned exceptions for authorities.",
    },
    {
      id: "ncii-csam",
      label: "Generation of non-consensual intimate imagery or CSAM",
      description:
        "Systems that generate/manipulate intimate material of identifiable persons without explicit consent, or child sexual abuse material.",
      ref: "Art. 5 AI Act as amended by the Omnibus",
      note: "New Omnibus prohibition, effective 2 December 2026 (pending OJ publication). For providers it also covers foreseeable, reproducible output in the absence of adequate technical safeguards.",
    },
  ],

  annexIIIAreas: [
    {
      id: "biometrics",
      label: "Biometrics (where not prohibited)",
      description:
        "Remote biometric identification, biometric categorisation on permitted sensitive attributes, emotion recognition (outside the prohibited cases).",
      ref: "Annex III, point 1 AI Act",
    },
    {
      id: "critical-infrastructure",
      label: "Critical infrastructure",
      description:
        "Safety components in the management of critical digital infrastructure, road traffic, water, gas, heating and electricity supply.",
      ref: "Annex III, point 2 AI Act",
    },
    {
      id: "education",
      label: "Education and training",
      description:
        "Admission/assignment to institutions, assessment of learning outcomes, education level, exam proctoring.",
      ref: "Annex III, point 3 AI Act",
    },
    {
      id: "employment",
      label: "Employment and workers management",
      description:
        "Recruitment (CV screening, candidate evaluation), decisions on promotion/termination, task allocation, monitoring and evaluation of performance.",
      ref: "Annex III, point 4 AI Act",
    },
    {
      id: "essential-services",
      label: "Essential public and private services",
      description:
        "Access to essential public benefits; creditworthiness/credit scoring; life and health insurance pricing; emergency call dispatching.",
      ref: "Annex III, point 5 AI Act",
      note: "Credit scoring exception: financial fraud detection.",
    },
    {
      id: "law-enforcement",
      label: "Law enforcement",
      description:
        "Individual risk assessment, polygraphs, reliability of evidence, profiling in investigations.",
      ref: "Annex III, point 6 AI Act",
    },
    {
      id: "migration",
      label: "Migration, asylum, border control",
      description:
        "Polygraphs, risk assessment, examination of asylum/visa applications, identification of persons.",
      ref: "Annex III, point 7 AI Act",
    },
    {
      id: "justice",
      label: "Justice and democratic processes",
      description:
        "Support to judicial authorities on facts and law; systems to influence election outcomes or voting behaviour.",
      ref: "Annex III, point 8 AI Act",
    },
  ],

  art63Exemptions: [
    {
      id: "narrow-procedural",
      label: "Narrow procedural task",
      description:
        "The system only performs a narrow procedural task (e.g. document routing, deduplication).",
      ref: "Art. 6(3)(a) AI Act",
    },
    {
      id: "improve-human-result",
      label: "Improves the result of a completed human activity",
      description: "E.g. polishing the language of a text already written by a person.",
      ref: "Art. 6(3)(b) AI Act",
    },
    {
      id: "pattern-detection",
      label: "Detects decision patterns without replacing human assessment",
      description:
        "Identifies patterns or deviations from previous decisions, without replacing or influencing human assessment without proper review.",
      ref: "Art. 6(3)(c) AI Act",
    },
    {
      id: "preparatory",
      label: "Preparatory task",
      description:
        "Only performs a task preparatory to an assessment relevant to the Annex III use cases.",
      ref: "Art. 6(3)(d) AI Act",
    },
  ],

  transparencyFlags: [
    {
      id: "chatbot",
      label: "People interact directly with the AI (e.g. chatbot)",
      description:
        "Provider obligation to design the system so people know they are interacting with an AI, unless obvious from context.",
      ref: "Art. 50(1) AI Act",
    },
    {
      id: "synthetic-content",
      label: "Generates synthetic content (text, images, audio, video)",
      description:
        "Provider obligation to mark outputs in a machine-readable format, detectable as artificially generated or manipulated.",
      ref: "Art. 50(2) AI Act",
      note: "Omnibus: for systems placed on the market before 2 Aug 2026, marking becomes mandatory on 2 Dec 2026; for those placed later, immediately.",
    },
    {
      id: "emotion-biometric",
      label: "Emotion recognition or biometric categorisation (permitted)",
      description: "Deployer obligation to inform the natural persons exposed to the system.",
      ref: "Art. 50(3) AI Act",
    },
    {
      id: "deepfake",
      label: "Generates or manipulates deep fakes",
      description:
        "Deployer obligation to disclose that the content has been artificially generated or manipulated.",
      ref: "Art. 50(4) AI Act",
      note: "Lighter requirements for evidently artistic/creative/satirical works.",
    },
    {
      id: "public-interest-text",
      label: "Publishes AI-generated text on matters of public interest",
      description:
        "Deployer obligation to disclose that the published text informing the public was artificially generated.",
      ref: "Art. 50(4) AI Act",
      note: "Exception: human review with editorial responsibility.",
    },
  ],

  highRiskProvider: [
    { id: "hr-p-9", label: "Risk management system", description: "An iterative, documented process across the system's entire lifecycle.", ref: "Art. 9 AI Act", appliesTo: ["provider"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-p-10", label: "Data governance", description: "Relevant, representative training/validation/test datasets, managed to mitigate bias.", ref: "Art. 10 AI Act", appliesTo: ["provider"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-p-11", label: "Technical documentation", description: "Documentation per Annex IV, drawn up before placing on the market and kept up to date.", ref: "Art. 11 AI Act", appliesTo: ["provider"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-p-12", label: "Automatic event logging", description: "The system must record relevant events for traceability and post-market monitoring.", ref: "Art. 12 AI Act", appliesTo: ["provider"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-p-13", label: "Transparency and instructions for use", description: "Clear information to the deployer: capabilities, limits, human oversight, maintenance.", ref: "Art. 13 AI Act", appliesTo: ["provider"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-p-14", label: "Human oversight by design", description: "The system must be capable of effective human oversight (built-in or implementable measures).", ref: "Art. 14 AI Act", appliesTo: ["provider"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-p-15", label: "Accuracy, robustness, cybersecurity", description: "Adequate and declared levels, resilience to errors and attacks.", ref: "Art. 15 AI Act", appliesTo: ["provider"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-p-17", label: "Quality management system", description: "A documented QMS ensuring compliance (strategies, procedures, resources).", ref: "Art. 17 AI Act", appliesTo: ["provider"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-p-43", label: "Conformity assessment", description: "The applicable procedure before placing on the market (internal or with a notified body).", ref: "Art. 43 AI Act", appliesTo: ["provider"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-p-48", label: "CE marking and EU declaration", description: "Declaration of conformity and CE marking of the system.", ref: "Arts. 47–48 AI Act", appliesTo: ["provider"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-p-49", label: "Registration in the EU database", description: "Registration of the high-risk system in the European database before use.", ref: "Art. 49 AI Act", appliesTo: ["provider"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
  ],

  highRiskDeployer: [
    { id: "hr-d-26-1", label: "Use per the instructions", description: "Technical and organisational measures to use the system according to the provider's instructions.", ref: "Art. 26(1) AI Act", appliesTo: ["deployer"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-2", label: "Competent human oversight", description: "Assign oversight to people with adequate competence, training and authority.", ref: "Art. 26(2) AI Act", appliesTo: ["deployer"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-4", label: "Relevance of input data", description: "Ensure input data under your control is relevant and sufficiently representative.", ref: "Art. 26(4) AI Act", appliesTo: ["deployer"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-5", label: "Monitoring and reporting", description: "Monitor operation; in case of risk, suspend use and inform the provider and authorities.", ref: "Art. 26(5) AI Act", appliesTo: ["deployer"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-6", label: "Log retention (≥ 6 months)", description: "Keep the logs generated by the system, if under your control, for at least six months.", ref: "Art. 26(6) AI Act", appliesTo: ["deployer"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-7", label: "Informing workers", description: "Before use in the workplace, inform workers and their representatives.", ref: "Art. 26(7) AI Act", appliesTo: ["deployer"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-9", label: "Link with the GDPR DPIA", description: "Use the provider's information for the privacy impact assessment (Art. 35 GDPR), where due.", ref: "Art. 26(9) AI Act", appliesTo: ["deployer"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-27", label: "Fundamental rights impact assessment (FRIA)", description: "Due for public bodies and private entities providing public services; for credit scoring and life/health insurance pricing.", ref: "Art. 27 AI Act", appliesTo: ["deployer"], deadline: "2 Dec 2027 (Annex III)", pendingOmnibus: true, note: "Check whether your company falls within the categories required to carry out a FRIA." },
  ],

  baseline: [
    {
      id: "base-4",
      label: "AI literacy of staff",
      description:
        "Measures to support the development of an adequate level of AI literacy of staff and collaborators.",
      ref: "Art. 4 AI Act",
      appliesTo: ["provider", "deployer"],
      note: "In force since 2 Feb 2025. The Omnibus softens the wording (from ‘ensure’ to ‘take measures to support’).",
    },
    {
      id: "base-inventory",
      label: "Inventory of AI systems",
      description:
        "Internal census of the AI systems in use, with purpose, role (provider/deployer) and data processed.",
      ref: "Good practice (preparatory to AI Act obligations)",
      appliesTo: ["provider", "deployer"],
    },
    {
      id: "base-gdpr",
      label: "GDPR compliance of processing",
      description:
        "Legal basis, notices, DPIA where required: the AI Act complements, not replaces, the GDPR.",
      ref: "Reg. (EU) 2016/679",
      appliesTo: ["provider", "deployer"],
    },
  ],

  art63Doc: {
    id: "hr-63-doc",
    label: "Document the not-high-risk assessment",
    description:
      "If you rely on an Art. 6(3) derogation, the assessment must be documented before placing/using the system, and the system registered in the EU database.",
    ref: "Art. 6(3)–(4) and Art. 49(2) AI Act",
    appliesTo: ["provider"],
    note: "The Omnibus simplifies the information to register (Annex VIII, sec. B). Authorities may request the assessment.",
  },

  gpai: [
    {
      id: "gpai-53",
      label: "Obligations for GPAI model providers",
      description:
        "Technical documentation, information to downstream providers, copyright policy, summary of training content.",
      ref: "Arts. 53–55 AI Act",
      appliesTo: ["provider"],
      note: "In force since 2 Aug 2025. Stronger obligations for models with systemic risk. Specialist area: dedicated analysis recommended.",
    },
  ],

  prohibitedGuidance: [
    {
      id: "proh-stop",
      label: "Stop placing on the market and using the practice",
      description:
        "Art. 5 practices are prohibited, with fines up to €35M or 7% of worldwide annual turnover.",
      ref: "Art. 5 and Art. 99(3) AI Act",
      appliesTo: ["provider", "deployer"],
      note: "If you believe an exception applies, do not proceed without professional legal advice.",
    },
  ],

  strings: {
    prohibitedPrefix: "Prohibited practice:",
    transparencyPrefix: "Transparency obligation:",
    dlProhibited: {
      date: "Already applicable (since 2 Feb 2025)",
      what: "Art. 5 prohibitions in force; fines up to €35M / 7% of worldwide turnover.",
      ref: "Arts. 5, 99(3) and 113 AI Act",
    },
    dlNcii: {
      date: "2 Dec 2026",
      what: "Effect of the new NCII/CSAM prohibition introduced by the Omnibus.",
      ref: "Art. 5 AI Act as amended by the Omnibus",
      pendingOmnibus: true,
      isoDate: "2026-12-02",
    },
    dlAnnex3: {
      date: "2 Dec 2027",
      what: "High-risk obligations apply to Annex III systems (post-Omnibus; was 2 Aug 2026).",
      ref: "Art. 113 AI Act as amended by the Omnibus",
      pendingOmnibus: true,
      isoDate: "2027-12-02",
    },
    dlAnnex1: {
      date: "2 Aug 2028",
      what: "High-risk obligations apply to Annex I systems (post-Omnibus; was 2 Aug 2027).",
      ref: "Art. 113 AI Act as amended by the Omnibus",
      pendingOmnibus: true,
      isoDate: "2028-08-02",
    },
    dlArt50: {
      date: "2 Aug 2026",
      what: "Art. 50 transparency obligations: NOT postponed by the Omnibus (only grace: 50(2) marking until 2 Dec 2026 for systems already on the market).",
      ref: "Arts. 50 and 113 AI Act",
      isoDate: "2026-08-02",
    },
    dlGpai: {
      date: "Already applicable (since 2 Aug 2025)",
      what: "Obligations for GPAI model providers.",
      ref: "Arts. 51–56 and 113 AI Act",
    },
    fAnnex1: {
      title: "High risk — Annex I (regulated product)",
      detail:
        "System that is (or is a safety component of) a product covered by the EU harmonised legislation listed in Annex I, sec. A.",
      ref: "Art. 6(1) and Annex I AI Act",
    },
    fCarveout: {
      title: "Regulated product, but non-safety function",
      detail:
        "Functions limited to assistance, optimisation, convenience or quality control are not a ‘safety component’ if a malfunction would not endanger health or safety (definition narrowed by the Omnibus). To be documented.",
      ref: "Art. 6(1) AI Act as amended by the Omnibus",
    },
    fMachinery: {
      title: "Machinery: special regime post-Omnibus",
      detail:
        "The Machinery Regulation moves to Annex I sec. B: AI Act Chapter III obligations do not apply directly; AI requirements will be integrated into sectoral law (delegated acts expected by Aug 2028). Machinery Regulation compliance still applies.",
      ref: "Annex I AI Act as amended by the Omnibus; Reg. (EU) 2023/1230",
    },
    fProfiling: {
      title: "Art. 6(3) derogation not applicable due to profiling",
      detail:
        "An Annex III system that profiles natural persons is always considered high-risk, even where a derogation condition applies.",
      ref: "Art. 6(3), last subparagraph, AI Act",
    },
    fExempt63: {
      title: "Annex III use case with claimed Art. 6(3) derogation",
      ref: "Art. 6(3)–(4) AI Act",
      detail: (areas, exemptions) =>
        `Areas: ${areas}. Derogations: ${exemptions}. The assessment must be documented and the system registered.`,
    },
    fMinimal: {
      title: "No specific obligation identified (minimal risk)",
      detail:
        "Based on your answers, the system does not fall under prohibitions, high risk or transparency obligations. Good practices and general obligations still apply.",
      ref: "Reg. (EU) 2024/1689 (risk-based framework)",
    },
    fGpai: {
      title: "GPAI model provider",
      detail:
        "Specific obligations in force since 2 Aug 2025 (documentation, copyright policy, training data summary).",
      ref: "Arts. 51–56 AI Act",
    },
    cProhibitedException:
      "Result based on your answers: if you believe an Art. 5 exception applies, obtain professional legal advice before proceeding.",
    cExempt63:
      "The Art. 6(3) derogation is a self-assessment that authorities can challenge: document it rigorously and have it verified by a professional.",
    cMachinery:
      "The machinery scope is evolving: monitor the Commission's delegated acts before treating this result as stable.",
    cAnnexIUnsure:
      "You could not tell whether the system is part of a regulated product (Annex I): check with your supplier or a consultant, as this changes deadlines and obligations.",
  },
};
