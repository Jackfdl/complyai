// Contenuti normativi — ITALIANO (lingua di riferimento, D7).
// Versione v0.2.0-beta · Fonti e stato di verifica: docs/FONTI-NORMATIVE.md.
import type { CheckerContent } from "./packs";

export const contentIt: CheckerContent = {
  version: "v0.2.0-beta (6 luglio 2026)",
  omnibusCaveat:
    "Le date e le regole marcate 'Omnibus' derivano dal pacchetto Omnibus digitale su AI, approvato in via definitiva dal Consiglio UE il 29 giugno 2026 ma vincolante solo dopo la pubblicazione in Gazzetta Ufficiale (attesa entro il 2 agosto 2026). Verifica lo stato su EUR-Lex.",
  legalDisclaimer:
    "Questo report ha finalità informative e non costituisce parere legale. La classificazione si basa sulle risposte fornite: risposte imprecise producono esiti imprecisi. Per decisioni con effetti giuridici rivolgiti a un professionista abilitato.",

  prohibitedPractices: [
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
  ],

  annexIIIAreas: [
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
  ],

  art63Exemptions: [
    {
      id: "narrow-procedural",
      label: "Compito procedurale ristretto",
      description:
        "Il sistema svolge solo un compito procedurale limitato (es. smistamento documenti, deduplicazione).",
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
      description:
        "Individua schemi o scostamenti rispetto a decisioni precedenti, senza sostituire o influenzare la valutazione umana senza adeguata revisione.",
      ref: "Art. 6(3)(c) AI Act",
    },
    {
      id: "preparatory",
      label: "Compito preparatorio",
      description:
        "Svolge solo un compito preparatorio rispetto a una valutazione rilevante per i casi Annex III.",
      ref: "Art. 6(3)(d) AI Act",
    },
  ],

  transparencyFlags: [
    {
      id: "chatbot",
      label: "Le persone interagiscono direttamente con l'AI (es. chatbot)",
      description:
        "Obbligo del provider di progettare il sistema perché le persone sappiano di interagire con un'AI, salvo evidenza dal contesto.",
      ref: "Art. 50(1) AI Act",
    },
    {
      id: "synthetic-content",
      label: "Genera contenuti sintetici (testo, immagini, audio, video)",
      description:
        "Obbligo del provider di marcare gli output in formato leggibile dalla macchina e rilevabili come generati/manipolati artificialmente.",
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
      description:
        "Obbligo del deployer di rendere noto che il contenuto è stato generato o manipolato artificialmente.",
      ref: "Art. 50(4) AI Act",
      note: "Modalità attenuate per opere manifestamente artistiche/creative/satiriche.",
    },
    {
      id: "public-interest-text",
      label: "Pubblica testi generati dall'AI su temi di interesse pubblico",
      description:
        "Obbligo del deployer di dichiarare la generazione artificiale del testo pubblicato per informare il pubblico.",
      ref: "Art. 50(4) AI Act",
      note: "Eccezione: revisione umana con responsabilità editoriale.",
    },
  ],

  highRiskProvider: [
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
  ],

  highRiskDeployer: [
    { id: "hr-d-26-1", label: "Uso conforme alle istruzioni", description: "Misure tecniche e organizzative per usare il sistema secondo le istruzioni del provider.", ref: "Art. 26(1) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-2", label: "Sorveglianza umana competente", description: "Affidare la sorveglianza a persone con competenza, formazione e autorità adeguate.", ref: "Art. 26(2) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-4", label: "Pertinenza dei dati di input", description: "Garantire che i dati di input sotto il proprio controllo siano pertinenti e sufficientemente rappresentativi.", ref: "Art. 26(4) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-5", label: "Monitoraggio e segnalazione", description: "Monitorare il funzionamento; in caso di rischio sospendere l'uso e informare provider e autorità.", ref: "Art. 26(5) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-6", label: "Conservazione dei log (≥ 6 mesi)", description: "Conservare i log generati dal sistema, se sotto il proprio controllo, per almeno sei mesi.", ref: "Art. 26(6) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-7", label: "Informativa ai lavoratori", description: "Prima dell'uso sul luogo di lavoro, informare lavoratori e rappresentanze.", ref: "Art. 26(7) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-26-9", label: "Raccordo con la DPIA GDPR", description: "Usare le informazioni del provider per la valutazione d'impatto privacy (art. 35 GDPR), se dovuta.", ref: "Art. 26(9) AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true },
    { id: "hr-d-27", label: "Valutazione d'impatto sui diritti fondamentali (FRIA)", description: "Dovuta per organismi pubblici e privati che erogano servizi pubblici; per credit scoring e pricing assicurazioni vita/salute.", ref: "Art. 27 AI Act", appliesTo: ["deployer"], deadline: "2 dic 2027 (Annex III)", pendingOmnibus: true, note: "Verifica se la tua azienda rientra nelle categorie tenute alla FRIA." },
  ],

  baseline: [
    {
      id: "base-4",
      label: "Alfabetizzazione AI del personale",
      description:
        "Misure per sostenere lo sviluppo di un adeguato livello di alfabetizzazione AI di staff e collaboratori.",
      ref: "Art. 4 AI Act",
      appliesTo: ["provider", "deployer"],
      note: "In vigore dal 2 feb 2025. L'Omnibus ne attenua la formulazione (da «garantire» a «adottare misure di sostegno»).",
    },
    {
      id: "base-inventory",
      label: "Inventario dei sistemi AI",
      description:
        "Censimento interno dei sistemi AI in uso con finalità, ruolo (provider/deployer) e dati trattati.",
      ref: "Buona prassi (propedeutica agli obblighi AI Act)",
      appliesTo: ["provider", "deployer"],
    },
    {
      id: "base-gdpr",
      label: "Conformità GDPR dei trattamenti",
      description:
        "Base giuridica, informative, DPIA ove necessaria: l'AI Act si aggiunge, non sostituisce, il GDPR.",
      ref: "Reg. (UE) 2016/679",
      appliesTo: ["provider", "deployer"],
    },
  ],

  art63Doc: {
    id: "hr-63-doc",
    label: "Documentare la valutazione di non-alto-rischio",
    description:
      "Se invochi una deroga art. 6(3), la valutazione va documentata prima dell'immissione/uso e il sistema registrato nella banca dati UE.",
    ref: "Art. 6(3)–(4) e Art. 49(2) AI Act",
    appliesTo: ["provider"],
    note: "L'Omnibus semplifica le informazioni da registrare (Annex VIII, sez. B). L'autorità può chiedere conto della valutazione.",
  },

  gpai: [
    {
      id: "gpai-53",
      label: "Obblighi per provider di modelli GPAI",
      description:
        "Documentazione tecnica, informazioni ai downstream provider, policy sul diritto d'autore, sintesi dei contenuti di addestramento.",
      ref: "Artt. 53–55 AI Act",
      appliesTo: ["provider"],
      note: "In vigore dal 2 ago 2025. Obblighi rafforzati se il modello presenta rischio sistemico. Ambito specialistico: approfondimento dedicato consigliato.",
    },
  ],

  prohibitedGuidance: [
    {
      id: "proh-stop",
      label: "Cessare immissione sul mercato e uso della pratica",
      description:
        "Le pratiche art. 5 sono vietate e sanzionabili fino a 35 M€ o al 7% del fatturato mondiale annuo.",
      ref: "Art. 5 e Art. 99(3) AI Act",
      appliesTo: ["provider", "deployer"],
      note: "Se ritieni applicabile un'eccezione, non procedere senza parere legale professionale.",
    },
  ],

  strings: {
    prohibitedPrefix: "Pratica vietata:",
    transparencyPrefix: "Obbligo di trasparenza:",
    dlProhibited: {
      date: "Già applicabile (dal 2 feb 2025)",
      what: "Divieti art. 5 in vigore; sanzioni fino a 35 M€ / 7% del fatturato mondiale.",
      ref: "Artt. 5, 99(3) e 113 AI Act",
    },
    dlNcii: {
      date: "2 dic 2026",
      what: "Efficacia del nuovo divieto su NCII/CSAM introdotto dall'Omnibus.",
      ref: "Art. 5 AI Act mod. Omnibus",
      pendingOmnibus: true,
    },
    dlAnnex3: {
      date: "2 dic 2027",
      what: "Applicazione obblighi alto rischio per sistemi Annex III (post-Omnibus; era 2 ago 2026).",
      ref: "Art. 113 AI Act mod. Omnibus",
      pendingOmnibus: true,
    },
    dlAnnex1: {
      date: "2 ago 2028",
      what: "Applicazione obblighi alto rischio per sistemi Annex I (post-Omnibus; era 2 ago 2027).",
      ref: "Art. 113 AI Act mod. Omnibus",
      pendingOmnibus: true,
    },
    dlArt50: {
      date: "2 ago 2026",
      what: "Obblighi di trasparenza art. 50: NON rinviati dall'Omnibus (unica grazia: marcatura 50(2) al 2 dic 2026 per sistemi già sul mercato).",
      ref: "Art. 50 e 113 AI Act",
    },
    dlGpai: {
      date: "Già applicabile (dal 2 ago 2025)",
      what: "Obblighi per provider di modelli GPAI.",
      ref: "Artt. 51–56 e 113 AI Act",
    },
    fAnnex1: {
      title: "Alto rischio — Annex I (prodotto regolamentato)",
      detail:
        "Sistema che è (o è componente di sicurezza di) un prodotto soggetto alla normativa UE armonizzata elencata in Annex I, sez. A.",
      ref: "Art. 6(1) e Annex I AI Act",
    },
    fCarveout: {
      title: "Prodotto regolamentato, ma funzione non di sicurezza",
      detail:
        "Funzioni limitate ad assistenza, ottimizzazione, comfort o controllo qualità non costituiscono «componente di sicurezza» se un malfunzionamento non mette in pericolo salute o sicurezza (definizione ristretta dall'Omnibus). Da documentare.",
      ref: "Art. 6(1) AI Act mod. Omnibus",
    },
    fMachinery: {
      title: "Macchinari: regime speciale post-Omnibus",
      detail:
        "Il Regolamento Macchine è spostato in Annex I sez. B: gli obblighi AI Act cap. III non si applicano direttamente; i requisiti AI saranno integrati nella normativa di settore (atti delegati attesi entro ago 2028). Resta la conformità al Reg. Macchine.",
      ref: "Annex I AI Act mod. Omnibus; Reg. (UE) 2023/1230",
    },
    fProfiling: {
      title: "Deroga art. 6(3) non applicabile per profilazione",
      detail:
        "Un sistema Annex III che effettua profilazione di persone fisiche è sempre considerato ad alto rischio, anche se ricorre una delle condizioni di deroga.",
      ref: "Art. 6(3), ultimo comma, AI Act",
    },
    fExempt63: {
      title: "Caso d'uso Annex III con deroga art. 6(3) rivendicata",
      ref: "Art. 6(3)–(4) AI Act",
      detail: (areas, exemptions) =>
        `Aree: ${areas}. Deroghe: ${exemptions}. La valutazione va documentata e il sistema registrato.`,
    },
    fMinimal: {
      title: "Nessun obbligo specifico individuato (rischio minimo)",
      detail:
        "In base alle risposte, il sistema non ricade in divieti, alto rischio o obblighi di trasparenza. Restano le buone prassi e gli obblighi generali.",
      ref: "Reg. (UE) 2024/1689 (impianto per livelli di rischio)",
    },
    fGpai: {
      title: "Provider di modello GPAI",
      detail:
        "Obblighi specifici in vigore dal 2 ago 2025 (documentazione, copyright policy, sintesi training data).",
      ref: "Artt. 51–56 AI Act",
    },
    cProhibitedException:
      "Esito basato sulle tue risposte: se ritieni applicabile un'eccezione prevista dall'art. 5, serve una verifica legale professionale prima di procedere.",
    cExempt63:
      "La deroga art. 6(3) è un'autovalutazione che l'autorità può contestare: documentala con rigore e falla verificare da un professionista.",
    cMachinery:
      "Ambito macchinari in evoluzione: monitora gli atti delegati della Commissione prima di considerare stabile questo esito.",
    cAnnexIUnsure:
      "Non hai saputo indicare se il sistema rientra in un prodotto regolamentato (Annex I): verifica con il fornitore o un consulente, perché cambia scadenze e obblighi.",
  },
};
