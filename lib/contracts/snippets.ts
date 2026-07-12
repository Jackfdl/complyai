// Libreria di formulazioni contrattuali di riferimento (RAG, D21) — v1 curata, IT.
// Ogni snippet è una formulazione TIPICA: "standard" = equilibrata/di mercato,
// "risky" = sfavorevole alla PMI cliente. Gli embedding vengono calcolati dal
// endpoint di seeding e salvati in Supabase (pgvector). Versionare a ogni modifica.
import { CLAUSE_CATEGORIES } from "./library";

export const SNIPPETS_VERSION = "v0.1.0 (10 luglio 2026)";

export interface ReferenceSnippet {
  id: string;
  /** Deve corrispondere a un id di CLAUSE_CATEGORIES. */
  category: string;
  kind: "standard" | "risky";
  lang: "it";
  text: string;
}

export const REFERENCE_SNIPPETS: ReferenceSnippet[] = [
  // --- Durata e rinnovo ---
  {
    id: "renewal-std-1",
    category: "auto-renewal",
    kind: "standard",
    lang: "it",
    text: "Il contratto ha durata di dodici mesi e si intenderà rinnovato per uguale periodo salvo disdetta da comunicarsi per iscritto con preavviso di almeno sessanta giorni prima della scadenza.",
  },
  {
    id: "renewal-risky-1",
    category: "auto-renewal",
    kind: "risky",
    lang: "it",
    text: "Il contratto si rinnova automaticamente di anno in anno; la disdetta potrà essere comunicata esclusivamente a mezzo raccomandata non oltre centottanta giorni prima della scadenza, pena il rinnovo per un ulteriore periodo di ventiquattro mesi.",
  },
  // --- Recesso ---
  {
    id: "termination-std-1",
    category: "termination",
    kind: "standard",
    lang: "it",
    text: "Ciascuna parte può recedere dal contratto in qualsiasi momento con preavviso scritto di trenta giorni, senza oneri ulteriori rispetto ai corrispettivi maturati fino alla data di efficacia del recesso.",
  },
  {
    id: "termination-risky-1",
    category: "termination",
    kind: "risky",
    lang: "it",
    text: "Il Fornitore potrà recedere in qualsiasi momento con effetto immediato; al Cliente non è riconosciuta alcuna facoltà di recesso anticipato e, in caso di scioglimento anticipato, resteranno dovuti tutti i corrispettivi residui fino alla scadenza naturale.",
  },
  // --- Limitazione di responsabilità ---
  {
    id: "liability-std-1",
    category: "liability-cap",
    kind: "standard",
    lang: "it",
    text: "La responsabilità complessiva di ciascuna parte è limitata all'ammontare dei corrispettivi pagati nei dodici mesi precedenti l'evento dannoso, salvo il caso di dolo o colpa grave.",
  },
  {
    id: "liability-risky-1",
    category: "liability-cap",
    kind: "risky",
    lang: "it",
    text: "In nessun caso il Fornitore sarà responsabile per danni diretti o indiretti di qualsiasi natura, anche derivanti da malfunzionamento del servizio, restando ogni rischio integralmente a carico del Cliente.",
  },
  // --- Penali ---
  {
    id: "penalties-std-1",
    category: "penalties",
    kind: "standard",
    lang: "it",
    text: "In caso di ritardo imputabile al Fornitore si applica una penale pari allo 0,5% del corrispettivo mensile per ogni giorno di ritardo, fino a un massimo del 10%, salvo il risarcimento del maggior danno.",
  },
  {
    id: "penalties-risky-1",
    category: "penalties",
    kind: "risky",
    lang: "it",
    text: "Per ogni inadempimento del Cliente, anche di lieve entità, sarà dovuta una penale pari al 30% del valore complessivo del contratto, cumulabile con il risarcimento di ogni ulteriore danno e con la risoluzione immediata del rapporto.",
  },
  // --- Riservatezza ---
  {
    id: "confidentiality-std-1",
    category: "confidentiality",
    kind: "standard",
    lang: "it",
    text: "Le parti si impegnano reciprocamente a mantenere riservate le informazioni scambiate in esecuzione del contratto e a utilizzarle esclusivamente per le finalità del medesimo, per tutta la durata del rapporto e per i tre anni successivi.",
  },
  {
    id: "confidentiality-risky-1",
    category: "confidentiality",
    kind: "risky",
    lang: "it",
    text: "Il Cliente autorizza il Fornitore a utilizzare le informazioni e i dati acquisiti nell'esecuzione del contratto anche per finalità proprie, incluse attività promozionali e di sviluppo di prodotti, senza limiti di durata.",
  },
  // --- Protezione dati ---
  {
    id: "gdpr-std-1",
    category: "data-protection",
    kind: "standard",
    lang: "it",
    text: "Il Fornitore tratta i dati personali per conto del Cliente in qualità di responsabile del trattamento ai sensi dell'art. 28 GDPR, secondo l'accordo sul trattamento allegato, adottando misure tecniche e organizzative adeguate.",
  },
  {
    id: "gdpr-risky-1",
    category: "data-protection",
    kind: "risky",
    lang: "it",
    text: "Il Fornitore potrà trasferire i dati trattati verso paesi terzi e avvalersi di sub-fornitori a propria discrezione, senza necessità di preventiva autorizzazione o comunicazione al Cliente.",
  },
  // --- Foro e legge ---
  {
    id: "law-std-1",
    category: "governing-law",
    kind: "standard",
    lang: "it",
    text: "Il contratto è regolato dalla legge italiana. Per ogni controversia è competente in via esclusiva il foro della sede del convenuto.",
  },
  {
    id: "law-risky-1",
    category: "governing-law",
    kind: "risky",
    lang: "it",
    text: "Il contratto è regolato dal diritto di uno Stato estero e ogni controversia è devoluta in via esclusiva a un arbitrato con sede all'estero, in lingua straniera, con spese di avvio interamente anticipate dal Cliente.",
  },
  // --- Manleva ---
  {
    id: "indemnity-std-1",
    category: "indemnity",
    kind: "standard",
    lang: "it",
    text: "Ciascuna parte terrà indenne l'altra dai danni derivanti da violazioni di legge o del contratto ad essa imputabili, nei limiti della responsabilità stabilita dal presente accordo.",
  },
  {
    id: "indemnity-risky-1",
    category: "indemnity",
    kind: "risky",
    lang: "it",
    text: "Il Cliente si obbliga a manlevare e tenere indenne il Fornitore da qualsiasi pretesa di terzi comunque connessa all'uso del servizio, anche se derivante da fatto del Fornitore, senza limiti di importo.",
  },
  // --- Modifiche unilaterali ---
  {
    id: "unilateral-std-1",
    category: "unilateral-changes",
    kind: "standard",
    lang: "it",
    text: "Eventuali modifiche delle condizioni contrattuali saranno comunicate con almeno sessanta giorni di anticipo; in caso di modifiche peggiorative il Cliente potrà recedere senza penali entro la data di efficacia.",
  },
  {
    id: "unilateral-risky-1",
    category: "unilateral-changes",
    kind: "risky",
    lang: "it",
    text: "Il Fornitore si riserva la facoltà di modificare in qualsiasi momento e a propria discrezione le condizioni economiche e i livelli di servizio, con effetto immediato dalla pubblicazione sul proprio sito.",
  },
  // --- Revisione prezzi ---
  {
    id: "price-std-1",
    category: "price-revision",
    kind: "standard",
    lang: "it",
    text: "Il canone potrà essere adeguato annualmente in misura non superiore alla variazione dell'indice ISTAT FOI, con comunicazione scritta almeno trenta giorni prima.",
  },
  {
    id: "price-risky-1",
    category: "price-revision",
    kind: "risky",
    lang: "it",
    text: "Il Fornitore potrà aggiornare i listini in qualunque momento senza preavviso; i nuovi prezzi si applicheranno automaticamente anche ai contratti in corso a far data dalla loro pubblicazione.",
  },
  // --- Garanzie ---
  {
    id: "warranty-std-1",
    category: "warranty",
    kind: "standard",
    lang: "it",
    text: "Il Fornitore garantisce la conformità del servizio alle specifiche concordate per l'intera durata del contratto e si impegna a correggere senza oneri i difetti segnalati entro tempi ragionevoli.",
  },
  {
    id: "warranty-risky-1",
    category: "warranty",
    kind: "risky",
    lang: "it",
    text: "Il servizio è fornito nello stato in cui si trova, senza garanzia alcuna di funzionamento, disponibilità o idoneità a uno scopo specifico, con esclusione di ogni garanzia anche implicita.",
  },
  // --- Forza maggiore ---
  {
    id: "force-std-1",
    category: "force-majeure",
    kind: "standard",
    lang: "it",
    text: "Nessuna parte sarà responsabile per inadempimenti dovuti a eventi di forza maggiore, restando sospese le obbligazioni per la durata dell'evento; superati i sessanta giorni ciascuna parte potrà recedere senza oneri.",
  },
];

/** Controllo di integrità usato dai test: ogni snippet punta a una categoria reale. */
export function validateSnippets(): string[] {
  const validCategories = new Set(CLAUSE_CATEGORIES.map((c) => c.id));
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const s of REFERENCE_SNIPPETS) {
    if (seen.has(s.id)) errors.push(`id duplicato: ${s.id}`);
    seen.add(s.id);
    if (!validCategories.has(s.category)) errors.push(`categoria ignota: ${s.category} (${s.id})`);
    if (s.text.trim().length < 60) errors.push(`testo troppo corto: ${s.id}`);
  }
  return errors;
}
