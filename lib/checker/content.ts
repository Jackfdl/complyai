// Contenuti normativi del Checker (italiano) — versione v0.1.0-beta.
// Fonti e stato di verifica: docs/FONTI-NORMATIVE.md.
// ⚠️ Le modifiche del pacchetto "Omnibus digitale su AI" (approvazione finale Consiglio
// 29 giu 2026) diventano vincolanti solo con la pubblicazione in Gazzetta Ufficiale UE,
// attesa entro il 2 ago 2026: le voci interessate sono marcate `pendingOmnibus`.
import type { CitedItem, Obligation } from "./types";

export const CONTENT_VERSION = "v0.1.0-beta (6 luglio 2026)";

export const OMNIBUS_CAVEAT =
  "Le date e le regole marcate 'Omnibus' derivano dal pacchetto Omnibus digitale su AI, approvato in via definitiva dal Consiglio UE il 29 giugno 2026 ma vincolante solo dopo la pubblicazione in Gazzetta Ufficiale (attesa entro il 2 agosto 2026). Verifica lo stato su EUR-Lex.";

export const LEGAL_DISCLAIMER =
  "Questo report ha finalità informative e non costituisce parere legale. La classificazione si basa sulle risposte fornite: risposte imprecise producono esiti imprecisi. Per decisioni con effetti giuridici rivolgiti a un professionista abilitato.";

// ---------------------------------------------------------------------------
// Art. 5 — Pratiche vietate (in vigore dal 2 febbraio 2025)
// ---------------------------------------------------------------------------
export const prohibitedPractices: CitedItem[] = [
  {
    id: "subliminal",
    label: "Manipolazione subliminale o ingannevole",
    description:
      "Tecniche subliminali o volutamente manipolative/ingannevoli che distorcono materialmente il comportamento di persone causando (o rendendo probabile) un danno significativo.",
    ref: "Art. 5(1)(a) AI Act",
  },
  {
    id: "vulnerabilities",
    label: "Sfruttamento di vulnerabilità",
    description:
      "Sfruttamento delle vulnerabilità dovute a età, disabilità o condizione socio-economica per distorcere il comportamento causando danno significativo.",
    ref: "Art. 5(1)(b) AI Act",
  },
  {
    id: "social-scoring",
    label: "Punteggio sociale (social scoring)",
    description:
      "Valutazione/classificazione di persone in base a comportamento sociale o caratteristiche personali, con trattamenti pregiudizievoli sproporzionati o fuori contesto.",
    ref: "Art. 5(1)(c) AI Act",
  },
  {
    id: "crime-prediction",
    label: "Previsione di reati basata solo su profilazione",
    description:
      "Valutazione del rischio che una persona commetta un reato basata unicamente su profilazione o tratti della personalità.",
    ref: "Art. 5(1)(d) AI Act",
    note: "Non copre il supporto alla valutazione umana fondata su fatti oggettivi verificabili.",
  },
  {
    id: "face-scraping",
    label: "Scraping indiscriminato di immagini facciali",
    description:
      "Creazione/ampliamento di banche dati di riconoscimento facciale tramite raccolta non mirata da internet o videosorveglianza.",
    ref: "Art. 5(1)(e) AI Act",
  },
  {
    id: "emotion-work-school",
    label: "Riconoscimento emozioni sul lavoro o a scuola",
    description:
      "Inferenza delle emozioni di una persona nei luoghi di lavoro o negli istituti di istruzione.",
    ref: "Art. 5(1)(f) AI Act",
    note: "Eccezione: motivi medici o di sicurezza.",
  },
  {
    id: "biometric-sensitive",
    label: "Categorizzazione biometrica su dati sensibili",
    description:
      "Categorizzazione biometrica per dedurre razza, opinioni politiche, appartenenza sindacale, convinzioni religiose/filosofiche, vita/orientamento sessuale.",
    ref: "Art. 5(1)(g) AI Act",
  },
  {
    id: "rbi-realtime",
    label: "Identificazione biometrica remota in tempo reale",
    description:
      "Identificazione biometrica remota «in tempo reale» in spazi accessibili al pubblico per finalità di contrasto (law enforcement).",
    ref: "Art. 5(1)(h) AI Act",
    note: "Eccezioni tassative e strettamente condizionate per le autorità.",
  },
  {
    id: "ncii-csam",
    label: "Generazione di immagini intime non consensuali o CSAM",
    description:
      "Sistemi che generano/manipolano materiale intimo di persone identificabili senza consenso esplicito, o materiale di abuso sessuale su minori.",
    ref: "Art. 5 AI Act come modificato dall'Omnibus",
    note: "Nuovo divieto Omnibus, efficace dal 2 dicembre 2026 (in attesa di pubblicazione in GU). Per i provider rileva anche l'output prevedibile e riproducibile in assenza di adeguate misure tecniche di prevenzione.",
  },
];

// ---------------------------------------------------------------------------
// Annex III — Aree ad alto rischio (obblighi dal 2 dicembre 2027, post-Omnibus)
// ---------------------------------------------------------------------------
export const annexIIIAreas: CitedItem[] = [
  {
    id: "biometrics",
    label: "Biometria (non vietata)",
    description:
      "Identificazione biometrica remota, categorizzazione biometrica su attributi sensibili consentiti, riconoscimento delle emozioni (fuori dai casi vietati).",
    ref: "Annex III, punto 1 AI Act",
  },
  {
    id: "critical-infrastructure",
    label: "Infrastrutture critiche",
    description:
      "Componenti di sicurezza nella gestione di infrastrutture digitali critiche, traffico stradale, forniture di acqua, gas, riscaldamento, elettricità.",
    ref: "Annex III, punto 2 AI Act",
  },
  {
    id: "education",
    label: "Istruzione e formazione",
    description:
      "Ammissione/assegnazione a istituti, valutazione dei risultati di apprendimento, livello di istruzione, sorveglianza durante esami.",
    ref: "Annex III, punto 3 AI Act",
  },
  {
    id: "employment",
    label: "Lavoro e gestione dei lavoratori",
    description:
      "Selezione del personale (screening CV, valutazione candidati), decisioni su promozioni/licenziamenti, assegnazione compiti, monitoraggio e valutazione delle prestazioni.",
    ref: "Annex III, punto 4 AI Act",
  },
  {
    id: "essential-services",
    label: "Servizi essenziali pubblici e privati",
    description:
      "Accesso a prestazioni pubbliche essenziali; affidabilità creditizia/credit scoring; pricing di assicurazioni vita e salute; smistamento chiamate di emergenza.",
    ref: "Annex III, punto 5 AI Act",
    note: "Eccezione credit scoring: rilevazione frodi finanziarie.",
  },
  {
    id: "law-enforcement",
    label: "Attività di contrasto (law enforcement)",
    description:
      "Valutazione rischi individuali, poligrafi, affidabilità delle prove, profilazione nelle indagini.",
    ref: "Annex III, punto 6 AI Act",
  },
  {
    id: "migration",
    label: "Migrazione, asilo, controllo frontiere",
    description:
      "Poligrafi, valutazione rischi, esame domande di asilo/visti, identificazione di persone.",
    ref: "Annex III, punto 7 AI Act",
  },
  {
    id: "justice",
    label: "Giustizia e processi democratici",
    description:
      "Supporto ad autorità giudiziarie su fatti e diritto; sistemi per influenzare l'esito di elezioni o il comportamento di voto.",
    ref: "Annex III, punto 8 AI Act",
  },
];

// ---------------------------------------------------------------------------
// Art. 6(3) — Deroghe alla classificazione alto rischio (Annex III)
// ---------------------------------------------------------------------------
export const art63Exemptions: CitedItem[] = [
  {
    id: "narrow-procedural",
    label: "Compito procedurale ristretto",
    description: "Il sistema svolge solo un compito procedurale limitato (es. smistamento documenti, deduplicazione).",
    ref: "Art. 6(3)(a) AI Act",
  },
  {
    id: "improve-human-result",
    label: "Migliora il risultato di un'attività umana già completata",
    description: "Es. rifinitura del linguaggio di un testo già scritto da una persona.",
    ref: "Art. 6(3)(b) AI Act",
  },
  {
    id: "pattern-detection",
    label: "Rileva pattern decisionali senza sostituire la valutazione umana",
    description: "Individua schemi o scostamenti rispetto a decisioni precedenti, senza sostituire o influenzare la valutazione umana senza adeguata revisione.",
    ref: "Art. 6(3)(c) AI Act",
  },
  {
    id: "preparatory",
    label: "Compito preparatorio",
    description: "Svolge solo un compito preparatorio rispetto a una valutazione rilevante per i casi Annex III.",
    ref: "Art. 6(3)(d) AI Act",
  },
];

// ---------------------------------------------------------------------------
// Art. 50 — Obblighi di trasparenza (APPLICABILI DAL 2 AGOSTO 2026 — non rinviati)
// ---------------------------------------------------------------------------
export const transparencyFlags: CitedItem[] = [
  {
    id: "chatbot",
    label: "Le persone interagiscono direttamente con l'AI (es. chatbot)",
    description: "Obbligo del provider di progettare il sistema perché le persone sappiano di interagire con un'AI, salvo evidenza dal contesto.",
    ref: "Art. 50(1) AI Act",
  },
  {
    id: "synthetic-content",
    label: "Genera contenuti sintetici (testo, immagini, audio, video)",
    description: "Obbligo del provider di marcare gli output in formato leggibile dalla macchina e rilevabili come generati/manipolati artificialmente.",
    ref: "Art. 50(2) AI Act",
    note: "Omnibus: per i sistemi immessi sul mercato prima del 2 ago 2026, marcatura obbligatoria dal 2 dic 2026; per quelli immessi dopo, da subito.",
  },
  {
    id: "emotion-biometric",
    label: "Riconoscimento emozioni o categorizzazione biometrica (consentiti)",
    description: "Obbligo del deployer di informare le persone fisiche esposte al sistema.",
    ref: "Art. 50(3) AI Act",
  },
  {
    id: "deepfake",
    label: "Genera o manipola deep fake",
    description: "Obbligo del deployer di rendere noto che il contenuto è stato generato o manipolato artificialmente.",
    ref: "Art. 50(4) AI Act",
    note: "Modalità attenuate per opere manifestamente artistiche/creative/satiriche.",
  },
  {
    id: "public-interest-text",
    label: "Pubblica testi generati dall'AI su temi di interesse pubblico",
    description: "Obbligo del deployer di dichiarare la generazione artificiale del testo pubblicato per informare il pubblico.",
    ref: "Art. 50(4) AI Act",
    note: "Eccezione: revisione umana con responsabilità editoriale.",
  },
];

// ---------------------------------------------------------------------------
// Obblighi — Alto rischio, PROVIDER (artt. 8–22 AI Act)
// ---------------------------------------------------------------------------
export const highRiskProviderObligations: Obligation[] = [
  { id: "hr-p-9", label: "Sistema di gestione dei rischi", description: "Processo iterativo e documentato lungo tutto il ciclo di vita del sistema.", ref: "Art. 9 AI Act", appliesTo: ["provider"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-p-10", label: "Governance dei dati", description: "Dataset di training/validazione/test pertinenti, rappresentativi e gestiti per ridurre i bias.", ref: "Art. 10 AI Act", appliesTo: ["provider"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-p-11", label: "Documentazione tecnica", description: "Documentazione conforme all'Annex IV, redatta prima dell'immissione sul mercato e tenuta aggiornata.", ref: "Art. 11 AI Act", appliesTo: ["provider"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-p-12", label: "Registrazione automatica degli eventi (log)", description: "Il sistema deve registrare eventi rilevanti per tracciabilità e monitoraggio post-market.", ref: "Art. 12 AI Act", appliesTo: ["provider"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-p-13", label: "Trasparenza e istruzioni per l'uso", description: "Informazioni chiare al deployer: capacità, limiti, sorveglianza umana, manutenzione.", ref: "Art. 13 AI Act", appliesTo: ["provider"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-p-14", label: "Sorveglianza umana by design", description: "Il sistema deve poter essere efficacemente sorvegliato da persone (misure integrate o da attuare).", ref: "Art. 14 AI Act", appliesTo: ["provider"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-p-15", label: "Accuratezza, robustezza, cybersicurezza", description: "Livelli adeguati e dichiarati, resilienza a errori e attacchi.", ref: "Art. 15 AI Act", appliesTo: ["provider"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-p-17", label: "Sistema di gestione della qualità", description: "QMS documentato che assicura la conformità (strategie, procedure, risorse).", ref: "Art. 17 AI Act", appliesTo: ["provider"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-p-43", label: "Valutazione di conformità", description: "Procedura applicabile prima dell'immissione sul mercato (interna o con organismo notificato).", ref: "Art. 43 AI Act", appliesTo: ["provider"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-p-48", label: "Marcatura CE e dichiarazione UE", description: "Dichiarazione di conformità e marcatura CE del sistema.", ref: "Artt. 47–48 AI Act", appliesTo: ["provider"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-p-49", label: "Registrazione nella banca dati UE", description: "Registrazione del sistema ad alto rischio nella banca dati europea prima dell'uso.", ref: "Art. 49 AI Act", appliesTo: ["provider"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
];

// ---------------------------------------------------------------------------
// Obblighi — Alto rischio, DEPLOYER (art. 26–27 AI Act)
// ---------------------------------------------------------------------------
export const highRiskDeployerObligations: Obligation[] = [
  { id: "hr-d-26-1", label: "Uso conforme alle istruzioni", description: "Misure tecniche e organizzative per usare il sistema secondo le istruzioni del provider.", ref: "Art. 26(1) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-d-26-2", label: "Sorveglianza umana competente", description: "Affidare la sorveglianza a persone con competenza, formazione e autorità adeguate.", ref: "Art. 26(2) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-d-26-4", label: "Pertinenza dei dati di input", description: "Garantire che i dati di input sotto il proprio controllo siano pertinenti e sufficientemente rappresentativi.", ref: "Art. 26(4) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-d-26-5", label: "Monitoraggio e segnalazione", description: "Monitorare il funzionamento; in caso di rischio sospendere l'uso e informare provider e autorità.", ref: "Art. 26(5) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-d-26-6", label: "Conservazione dei log (≥ 6 mesi)", description: "Conservare i log generati dal sistema, se sotto il proprio controllo, per almeno sei mesi.", ref: "Art. 26(6) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-d-26-7", label: "Informativa ai lavoratori", description: "Prima dell'uso sul luogo di lavoro, informare lavoratori e rappresentanze.", ref: "Art. 26(7) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-d-26-9", label: "Raccordo con la DPIA GDPR", description: "Usare le informazioni del provider per la valutazione d'impatto privacy (art. 35 GDPR), se dovuta.", ref: "Art. 26(9) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
  { id: "hr-d-27", label: "Valutazione d'impatto sui diritti fondamentali (FRIA)", description: "Dovuta per organismi pubblici e privati che erogano servizi pubblici; per credit scoring e pricing assicurazioni vita/salute.", ref: "Art. 27 AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true, note: "Verifica se la tua azienda rientra nelle categorie tenute alla FRIA." },
];

// ---------------------------------------------------------------------------
// Obblighi trasversali (qualunque livello di rischio)
// ---------------------------------------------------------------------------
export const baselineObligations: Obligation[] = [
  {
    id: "base-4",
    label: "Alfabetizzazione AI del personale",
    description: "Misure per sostenere lo sviluppo di un adeguato livello di alfabetizzazione AI di staff e collaboratori.",
    ref: "Art. 4 AI Act",
    appliesTo: ["provider", "deployer"],
    note: "In vigore dal 2 feb 2025. L'Omnibus ne attenua la formulazione (da «garantire» a «adottare misure di sostegno»).",
  },
  {
    id: "base-inventory",
    label: "Inventario dei sistemi AI",
    description: "Censimento interno dei sistemi AI in uso con finalità, ruolo (provider/deployer) e dati trattati.",
    ref: "Buona prassi (propedeutica agli obblighi AI Act)",
    appliesTo: ["provider", "deployer"],
  },
  {
    id: "base-gdpr",
    label: "Conformità GDPR dei trattamenti",
    description: "Base giuridica, informative, DPIA ove necessaria: l'AI Act si aggiunge, non sostituisce, il GDPR.",
    ref: "Reg. (UE) 2016/679",
    appliesTo: ["provider", "deployer"],
  },
];

export const art63DocumentationObligation: Obligation = {
  id: "hr-63-doc",
  label: "Documentare la valutazione di non-alto-rischio",
  description: "Se invochi una deroga art. 6(3), la valutazione va documentata prima dell'immissione/uso e il sistema registrato nella banca dati UE.",
  ref: "Art. 6(3)–(4) e Art. 49(2) AI Act",
  appliesTo: ["provider"],
  note: "L'Omnibus semplifica le informazioni da registrare (Annex VIII, sez. B). L'autorità può chiedere conto della valutazione.",
};

export const gpaiObligations: Obligation[] = [
  {
    id: "gpai-53",
    label: "Obblighi per provider di modelli GPAI",
    description: "Documentazione tecnica, informazioni ai downstream provider, policy sul diritto d'autore, sintesi dei contenuti di addestramento.",
    ref: "Artt. 53–55 AI Act",
    appliesTo: ["provider"],
    note: "In vigore dal 2 ago 2025. Obblighi rafforzati se il modello presenta rischio sistemico. Ambito specialistico: approfondimento dedicato consigliato.",
  },
];

export const prohibitedGuidance: Obligation[] = [
  {
    id: "proh-stop",
    label: "Cessare immissione sul mercato e uso della pratica",
    description: "Le pratiche art. 5 sono vietate e sanzionabili fino a 35 M€ o al 7% del fatturato mondiale annuo.",
    ref: "Art. 5 e Art. 99(3) AI Act",
    appliesTo: ["provider", "deployer"],
    note: "Se ritieni applicabile un'eccezione, non procedere senza parere legale professionale.",
  },
];
