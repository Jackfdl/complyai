// Libreria delle clausole contrattuali — v1 curata e versionata nel codice (D15).
// Ogni categoria ha pattern deterministici IT/EN, una nota di rischio e un flag
// "expected": se attesa e assente, viene segnalata tra le protezioni mancanti.
// Il RAG semantico su libreria estesa è previsto in Fase 3.

export const CLAUSE_LIBRARY_VERSION = "v0.1.0 (7 luglio 2026)";

export type ClauseLevel = "info" | "warning";

export interface ClauseCategory {
  id: string;
  label: { it: string; en: string };
  /** Sottostringhe (lowercase) che identificano la clausola. */
  patterns: string[];
  /** Nota di attenzione mostrata quando la clausola è presente. */
  riskNote?: { it: string; en: string };
  /** Livello quando trovata. */
  level: ClauseLevel;
  /** Se true e non trovata → protezione mancante da segnalare. */
  expected: boolean;
  /** Perché è attesa (mostrato se mancante). */
  whyExpected?: { it: string; en: string };
}

export const CLAUSE_CATEGORIES: ClauseCategory[] = [
  {
    id: "auto-renewal",
    label: { it: "Durata e rinnovo tacito", en: "Term and tacit renewal" },
    patterns: ["rinnovo tacito", "tacitamente rinnovat", "rinnova tacitamente", "si rinnova automaticamente", "rinnova automaticamente", "rinnovo automatico", "automatically renew", "auto-renew", "tacit renewal"],
    riskNote: {
      it: "Rinnovo tacito: individua subito la finestra di disdetta e mettila a calendario, o il contratto si rinnova da solo.",
      en: "Tacit renewal: find the cancellation window immediately and calendar it, or the contract renews by itself.",
    },
    level: "warning",
    expected: false,
  },
  {
    id: "termination",
    label: { it: "Recesso e disdetta", en: "Termination and withdrawal" },
    patterns: ["recesso", "disdetta", "risoluzione del contratto", "facoltà di recedere", "termination", "right to terminate", "withdraw from the contract", "notice of termination"],
    riskNote: {
      it: "Verifica che il recesso non sia previsto solo a favore della controparte e che il preavviso sia sostenibile.",
      en: "Check that termination is not one-sided in favour of the counterparty and that the notice period is sustainable.",
    },
    level: "info",
    expected: true,
    whyExpected: {
      it: "Senza clausola di recesso rischi di restare vincolato senza via d'uscita ordinaria.",
      en: "Without a termination clause you may remain bound with no ordinary way out.",
    },
  },
  {
    id: "penalties",
    label: { it: "Penali", en: "Penalties / liquidated damages" },
    patterns: ["penale", "penali", "a titolo di penale", "liquidated damages", "penalty of", "penalties"],
    riskNote: {
      it: "Quantifica le penali: importi, presupposti, cumulabilità con il risarcimento del danno.",
      en: "Quantify penalties: amounts, triggers, whether they can be combined with damages.",
    },
    level: "warning",
    expected: false,
  },
  {
    id: "liability-cap",
    label: { it: "Limitazione di responsabilità", en: "Limitation of liability" },
    patterns: ["limitazione di responsabilità", "limitazione della responsabilità", "responsabilità è limitata", "responsabilità limitata", "è limitata all'importo", "è limitata al", "esclusione di responsabilità", "limitation of liability", "liability is limited", "shall not be liable", "exclusion of liability"],
    riskNote: {
      it: "Verifica che la limitazione sia reciproca, con massimale ragionevole, e che non copra dolo/colpa grave (nulla ex art. 1229 c.c.).",
      en: "Check the cap is mutual, reasonable, and does not cover wilful misconduct/gross negligence.",
    },
    level: "warning",
    expected: true,
    whyExpected: {
      it: "Senza massimale, la tua esposizione al risarcimento è potenzialmente illimitata.",
      en: "Without a cap, your damages exposure is potentially unlimited.",
    },
  },
  {
    id: "payment",
    label: { it: "Pagamenti e interessi di mora", en: "Payment and late interest" },
    patterns: ["termini di pagamento", "pagamento entro", "interessi di mora", "fatturazione", "payment terms", "late payment interest", "invoice", "giorni data fattura"],
    level: "info",
    expected: false,
  },
  {
    id: "confidentiality",
    label: { it: "Riservatezza (NDA)", en: "Confidentiality (NDA)" },
    patterns: ["riservatezza", "informazioni riservate", "obbligo di segretezza", "confidential", "confidentiality", "non-disclosure"],
    level: "info",
    expected: true,
    whyExpected: {
      it: "Se scambierai informazioni sensibili, senza clausola di riservatezza non hai protezione contrattuale.",
      en: "If you will exchange sensitive information, without a confidentiality clause you have no contractual protection.",
    },
  },
  {
    id: "data-protection",
    label: { it: "Protezione dati (GDPR)", en: "Data protection (GDPR)" },
    patterns: ["gdpr", "2016/679", "trattamento dei dati", "responsabile del trattamento", "titolare del trattamento", "data processing", "data protection", "processor", "dpa"],
    riskNote: {
      it: "Se il fornitore tratta dati personali per tuo conto serve un accordo ex art. 28 GDPR (DPA): verifica che ci sia o richiedilo.",
      en: "If the supplier processes personal data on your behalf, an Art. 28 GDPR agreement (DPA) is required: check it exists or request it.",
    },
    level: "info",
    expected: true,
    whyExpected: {
      it: "Quasi ogni fornitura B2B tocca dati personali: l'assenza di previsioni GDPR è un gap di compliance.",
      en: "Almost every B2B supply touches personal data: missing GDPR provisions are a compliance gap.",
    },
  },
  {
    id: "governing-law",
    label: { it: "Foro competente e legge applicabile", en: "Jurisdiction and governing law" },
    patterns: ["foro competente", "foro esclusivo", "legge applicabile", "legge italiana", "governing law", "jurisdiction", "competent court", "exclusive forum"],
    riskNote: {
      it: "Foro o legge straniera/lontana aumentano molto i costi di un eventuale contenzioso: valuta se negoziarli.",
      en: "A foreign/distant forum or law greatly increases litigation costs: consider negotiating them.",
    },
    level: "warning",
    expected: false,
  },
  {
    id: "warranty",
    label: { it: "Garanzie", en: "Warranties" },
    patterns: ["garanzia", "garantisce che", "vizi e difetti", "warranty", "warrants that", "as is", '"as is"', "senza alcuna garanzia"],
    riskNote: {
      it: "Attenzione alle forniture \"as is\" (senza garanzia): verifica cosa è garantito e per quanto tempo.",
      en: "Watch for \"as is\" supplies (no warranty): check what is warranted and for how long.",
    },
    level: "info",
    expected: false,
  },
  {
    id: "indemnity",
    label: { it: "Indennizzo / manleva", en: "Indemnity / hold harmless" },
    patterns: ["manleva", "manlevare", "tenere indenne", "indennizzare", "indemnify", "hold harmless", "indemnification"],
    riskNote: {
      it: "Le manleve sono spesso unilaterali: verifica chi manleva chi, per cosa e con quali limiti.",
      en: "Indemnities are often one-sided: check who indemnifies whom, for what, and with what limits.",
    },
    level: "warning",
    expected: false,
  },
  {
    id: "force-majeure",
    label: { it: "Forza maggiore", en: "Force majeure" },
    patterns: ["forza maggiore", "caso fortuito", "force majeure", "act of god"],
    level: "info",
    expected: true,
    whyExpected: {
      it: "Senza clausola di forza maggiore, eventi imprevedibili possono lasciarti inadempiente senza tutele.",
      en: "Without a force majeure clause, unforeseeable events may leave you in breach without protection.",
    },
  },
  {
    id: "assignment",
    label: { it: "Cessione e subappalto", en: "Assignment and subcontracting" },
    patterns: ["cessione del contratto", "cedere il contratto", "subappalto", "subfornitura", "assignment", "assign this agreement", "subcontract"],
    riskNote: {
      it: "Verifica che la controparte non possa cedere il contratto o subappaltare senza il tuo consenso scritto.",
      en: "Check the counterparty cannot assign or subcontract without your written consent.",
    },
    level: "info",
    expected: false,
  },
  {
    id: "ip",
    label: { it: "Proprietà intellettuale", en: "Intellectual property" },
    patterns: ["proprietà intellettuale", "diritti di proprietà intellettuale", "proprietà industriale", "titolarità dei diritti", "intellectual property", "ip rights", "ownership of the deliverables"],
    riskNote: {
      it: "Verifica a chi restano i diritti su sviluppi, personalizzazioni e dati: spesso restano al fornitore. Chiedi una licenza chiara o la titolarità di ciò che paghi.",
      en: "Check who keeps the rights to developments, customisations and data: they often stay with the supplier. Ask for a clear licence or ownership of what you pay for.",
    },
    level: "warning",
    expected: false,
  },
  {
    id: "exclusivity",
    label: { it: "Esclusiva", en: "Exclusivity" },
    patterns: ["patto di esclusiva", "clausola di esclusiva", "diritto di esclusiva", "in esclusiva", "esclusiva di fornitura", "exclusivity", "exclusive supply", "exclusive distribution", "sole supplier"],
    riskNote: {
      it: "L'esclusiva ti vincola a un solo fornitore/cliente: valuta durata, uscite e conseguenze del mancato raggiungimento di minimi.",
      en: "Exclusivity ties you to a single supplier/customer: weigh duration, exits and the consequences of missing minimums.",
    },
    level: "warning",
    expected: false,
  },
  {
    id: "unilateral-changes",
    label: { it: "Modifiche unilaterali", en: "Unilateral changes" },
    patterns: ["modifica unilaterale", "modificare unilateralmente", "facoltà di modificare", "ius variandi", "si riserva di modificare", "unilaterally modify", "unilateral change", "reserves the right to modify", "reserves the right to change"],
    riskNote: {
      it: "Le modifiche unilaterali (di prezzi, condizioni o servizio) sono sfavorevoli: pretendi preavviso adeguato e diritto di recesso se non le accetti.",
      en: "Unilateral changes (to price, terms or service) are unfavourable: require adequate notice and a right to withdraw if you do not accept them.",
    },
    level: "warning",
    expected: false,
  },
  {
    id: "price-revision",
    label: { it: "Revisione e adeguamento prezzi", en: "Price revision and indexation" },
    patterns: ["revisione dei prezzi", "adeguamento dei prezzi", "adeguamento istat", "indicizzazione", "aggiornamento del canone", "price adjustment", "price revision", "indexation", "cpi adjustment"],
    riskNote: {
      it: "Verifica come e quando i prezzi possono aumentare (indice, tetto massimo, periodicità): senza un cap l'adeguamento può erodere il tuo budget.",
      en: "Check how and when prices can rise (index, cap, frequency): without a cap, indexation can erode your budget.",
    },
    level: "warning",
    expected: false,
  },
  {
    id: "sla",
    label: { it: "Livelli di servizio (SLA)", en: "Service levels (SLA)" },
    patterns: ["livello di servizio", "livelli di servizio", "service level", "sla", "uptime", "disponibilità garantita", "tempi di ripristino"],
    riskNote: {
      it: "Verifica che gli SLA siano misurabili e con conseguenze (penali/crediti di servizio) in caso di mancato rispetto: senza conseguenze sono solo promesse.",
      en: "Check that SLAs are measurable and carry consequences (penalties/service credits) if missed: without consequences they are just promises.",
    },
    level: "info",
    expected: false,
  },
];
