// Documentazione pubblica: come funziona il progetto, FAQ, alternative oneste, contatti.
// Trasparenza radicale by design: beta dichiarata, limiti espliciti, concorrenti citati (D17).
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const LINKEDIN_URL = "https://www.linkedin.com/in/giacomo-fedeli-277765239/";
const GITHUB_URL = "https://github.com/Jackfdl/complyai";

interface Faq {
  q: string;
  a: string;
}

interface AltCategory {
  title: string;
  items: { name: string; url: string; note: string }[];
}

interface AboutContent {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  intro: string;
  howTitle: string;
  howIntro: string;
  principlesTitle: string;
  principles: { name: string; desc: string }[];
  modulesTitle: string;
  modules: { name: string; desc: string; href: string }[];
  faqTitle: string;
  faqs: Faq[];
  altTitle: string;
  altIntro: string;
  altCategories: AltCategory[];
  altOutro: string;
  contribTitle: string;
  contribBody: string;
  contribLinkedin: string;
  contribGithub: string;
  disclaimer: string;
  backHome: string;
}

const it: AboutContent = {
  metaTitle: "Come funziona ComplyAI — documentazione, FAQ e alternative",
  metaDescription:
    "Documentazione pubblica di ComplyAI: come funzionano i sei moduli, domande frequenti, limiti dichiarati e alternative più complete. Progetto beta, open e a costo zero.",
  kicker: "Documentazione · FAQ · Trasparenza",
  title: "Il progetto, spiegato con onestà",
  intro:
    "ComplyAI è una suite gratuita di strumenti di compliance per PMI europee, in versione beta, sviluppata in pubblico con budget zero. Questa pagina spiega come funziona davvero, cosa non può fare, e dove trovare strumenti più maturi. Se un tool di compliance non è trasparente su sé stesso, perché dovresti fidarti di ciò che dice sui tuoi obblighi?",

  howTitle: "Come funziona",
  howIntro:
    "Sei moduli integrati, un'unica regola di fondo: mai fingere. Ogni esito dice da dove viene (articolo di legge, pattern della libreria, o AI dichiarata), e quando qualcosa non è pronto lo scriviamo.",
  principlesTitle: "I principi di progettazione",
  principles: [
    {
      name: "Deterministico prima, AI dopo",
      desc: "La classificazione AI Act è un motore a regole con citazioni puntuali (niente allucinazioni sul diritto). L'AI (Mistral, UE) interviene solo dove serve — analisi di policy e contratti — sempre dichiarata, sempre con un fallback locale che non invia nulla a terzi.",
    },
    {
      name: "I tuoi dati restano tuoi",
      desc: "Database in UE (Francoforte) con isolamento per utente (RLS). L'estrazione del testo dai contratti avviene nel tuo browser; salviamo il memo, non il contratto. Il provider AI è configurato con opt-out dal training. Niente pubblicità, niente rivendita dati.",
    },
    {
      name: "Tutto tracciato, niente cancellabile",
      desc: "Ogni azione sui tuoi dati finisce in un registro audit append-only che nemmeno noi (né tu) possiamo alterare: è la stessa garanzia di integrità che chiederesti a un fornitore in un audit vero.",
    },
    {
      name: "Aggiornato e datato",
      desc: "I contenuti normativi sono versionati e recepiscono l'Omnibus digitale 2026, con avvertenze esplicite dove le nuove date attendono la Gazzetta Ufficiale. Il radar normativo controlla ogni giorno le fonti ufficiali UE.",
    },
  ],
  modulesTitle: "I sei moduli",
  modules: [
    { name: "AI Act Compliance Checker", desc: "Questionario guidato → classificazione del rischio con citazioni, checklist obblighi, gap e piano d'azione. Senza registrazione.", href: "checker" },
    { name: "Regulation Watcher", desc: "Radar giornaliero su Gazzetta Ufficiale UE, Commissione/AI Office ed EDPB, con tag deterministici. Niente riassunti generati: titoli e link originali.", href: "watcher" },
    { name: "Policy-to-Controls Mapper", desc: "Da una policy a una matrice di controlli operativi (owner, cadenza, evidenza), con analisi AI opzionale ed editor completo.", href: "mapper" },
    { name: "Contract Review Agent", desc: "Carichi un contratto (il testo viene estratto nel browser), ottieni clausole a rischio, protezioni mancanti e date chiave da mandare allo scadenzario.", href: "contracts" },
    { name: "Legal Deadline Tracker", desc: "Scadenzario con stati automatici ed export .ics verso il tuo calendario.", href: "deadlines" },
    { name: "Audit Trail Builder", desc: "Consulti, filtri ed esporti il registro immutabile di tutte le azioni, pronto per un revisore esterno.", href: "audit" },
  ],

  faqTitle: "Domande frequenti",
  faqs: [
    {
      q: "ComplyAI è gratuito? Dov'è il trucco?",
      a: "È gratuito e non c'è un trucco, c'è un vincolo: il progetto è costruito interamente su servizi a piano gratuito (hosting, database, AI) e lo dichiara. Non vendiamo dati, non mostriamo pubblicità. Se un giorno esistesse un piano a pagamento, questa versione resterebbe onestamente etichettata per quello che è.",
    },
    {
      q: "Le risposte del Checker sono un parere legale?",
      a: "No. Il Checker applica regole deterministiche derivate dal testo dell'AI Act e cita sempre l'articolo di riferimento, ma la qualità dell'esito dipende dalle tue risposte e la materia evolve. Per decisioni con effetti giuridici serve un professionista abilitato: il report è fatto apposta per essere portato a un consulente, non per sostituirlo.",
    },
    {
      q: "Che fine fanno i miei dati e i miei contratti?",
      a: "I dati salvati (account e contenuti che scegli di salvare) stanno su un database in UE, isolati per utente. I contratti caricati vengono letti nel tuo browser: sul server arriva solo il testo se scegli l'analisi AI, e salviamo il memo di revisione, non il contratto. L'AI configurata (Mistral, UE) ha l'opt-out dal training attivo. Ogni modifica è tracciata in un log immutabile.",
    },
    {
      q: "Devo registrarmi per usarlo?",
      a: "No: Checker, radar e analisi locali funzionano senza account. La registrazione (solo email e password) serve per salvare valutazioni, scadenze e memo, e per usare l'analisi AI, la cui quota gratuita è condivisa tra gli utenti.",
    },
    {
      q: "Quanto sono affidabili le analisi?",
      a: "Diversamente per motore. Le regole del Checker sono testate e citate, ma semplificano articoli complessi. La libreria clausole riconosce pattern espliciti e può mancare formulazioni atipiche (per questo 'non trovata' non significa 'assente'). L'analisi AI può sbagliare e lo diciamo sotto ogni risultato. In beta l'affidabilità giusta da assumere è: ottimo punto di partenza, mai ultima parola.",
    },
    {
      q: "Siete aggiornati all'Omnibus digitale 2026?",
      a: "Sì: le scadenze recepiscono il rinvio degli obblighi alto rischio (Annex III → 2 dicembre 2027, Annex I → 2 agosto 2028) e segnalano con un asterisco ciò che attende la pubblicazione in Gazzetta Ufficiale. L'obbligo di trasparenza (art. 50) non è stato rinviato e resta al 2 agosto 2026. Il radar normativo ci avvisa quando qualcosa cambia.",
    },
    {
      q: "Chi c'è dietro al progetto?",
      a: "Giacomo Fedeli, data analyst, che lo sviluppa in pubblico come progetto reale e come percorso di apprendimento, con l'assistenza di strumenti di AI per lo sviluppo. Il codice è open su GitHub: puoi verificare ogni affermazione di questa pagina leggendolo.",
    },
    {
      q: "Posso usare i report con il mio commercialista, DPO o avvocato?",
      a: "Sì, sono pensati per quello: ogni modulo esporta (PDF, CSV, JSON, .ics) e il registro audit è esportabile per revisori esterni. Portare al professionista un'analisi già strutturata fa risparmiare tempo a entrambi.",
    },
    {
      q: "Perché dovrei fidarmi di un tool in beta?",
      a: "Non devi fidarti: devi poter verificare. Per questo il codice è pubblico, le fonti normative sono citate riga per riga, i limiti sono scritti in questa pagina e qui sotto trovi elencati strumenti più maturi del nostro. La fiducia cieca è esattamente ciò che un tool di compliance non dovrebbe chiederti.",
    },
    {
      q: "Ho trovato un errore o ho un'idea: come contribuisco?",
      a: "Scrivimi su LinkedIn (link qui sotto) o apri una issue su GitHub. Segnalazioni su errori normativi sono le più preziose di tutte: verranno verificate sulle fonti e corrette con menzione nel registro delle decisioni.",
    },
  ],

  altTitle: "Alternative più complete (sul serio)",
  altIntro:
    "ComplyAI è un progetto beta a costo zero: esistono strumenti più maturi, completi e supportati. Eccone alcuni, senza alcuna affiliazione. Se il tuo caso è critico, partiti da qui — soprattutto dalle fonti ufficiali, che sono gratuite:",
  altCategories: [
    {
      title: "Fonti ufficiali e gratuite (inizia da qui)",
      items: [
        { name: "AI Act Service Desk — Commissione Europea", url: "https://ai-act-service-desk.ec.europa.eu/en", note: "Il Compliance Checker ufficiale UE, l'AI Act Explorer e l'helpdesk: gratuito e autorevole per definizione." },
        { name: "EU AI Act Compliance Checker — Future of Life Institute", url: "https://artificialintelligenceact.eu/assessment/eu-ai-act-compliance-checker/", note: "Checker gratuito molto citato, sullo stesso sito che pubblica testo e analisi dell'AI Act." },
        { name: "EUR-Lex", url: "https://eur-lex.europa.eu", note: "Il testo ufficiale delle norme, con alert e-mail e RSS gratuiti: la fonte primaria che ogni tool (incluso il nostro) dovrebbe citare." },
      ],
    },
    {
      title: "Piattaforme di AI governance (enterprise)",
      items: [
        { name: "Credo AI", url: "https://www.credo.ai", note: "Governance AI end-to-end, policy pack per AI Act e standard (es. ISO/IEC 42001)." },
        { name: "Holistic AI", url: "https://www.holisticai.com", note: "Assessment del rischio AI su larga scala, audit e monitoraggio continuo." },
        { name: "OneTrust", url: "https://www.onetrust.com", note: "Suite GRC ampia (privacy, AI governance, terze parti) molto diffusa nelle grandi aziende." },
        { name: "trail", url: "https://www.trail-ml.com", note: "AI governance europea con checker AI Act gratuito e documentazione tecnica automatizzata." },
      ],
    },
    {
      title: "Certificazioni e GRC automatizzata",
      items: [
        { name: "Vanta", url: "https://www.vanta.com", note: "Automazione compliance (SOC 2, ISO 27001, ISO 42001) con evidenze continue." },
        { name: "Drata", url: "https://www.drata.com", note: "Alternativa a Vanta sullo stesso terreno, integrazioni ampie." },
      ],
    },
    {
      title: "Contract review professionale",
      items: [
        { name: "Luminance", url: "https://www.luminance.com", note: "AI legale per revisione e negoziazione contratti, usata da studi e aziende." },
        { name: "Juro", url: "https://juro.com", note: "Gestione dell'intero ciclo di vita contrattuale con AI integrata." },
        { name: "Spellbook", url: "https://www.spellbook.legal", note: "Assistente AI per la redazione contrattuale, dentro Word." },
      ],
    },
  ],
  altOutro:
    "E l'alternativa migliore di tutte resta umana: un avvocato, un DPO o un consulente che conosce la tua azienda. Nessun software — men che meno questo — la sostituisce.",

  contribTitle: "Contribuisci o scrivimi",
  contribBody:
    "Consigli, segnalazioni di errori (soprattutto normativi), idee, critiche oneste: tutto è benvenuto. Il progetto è aperto e in sviluppo — anche il modo migliore di costruirlo è una conversazione.",
  contribLinkedin: "Scrivimi su LinkedIn — Giacomo Fedeli",
  contribGithub: "Codice sorgente e issue su GitHub",
  disclaimer:
    "ComplyAI fornisce supporto informativo alla compliance e non costituisce parere legale. I marchi citati appartengono ai rispettivi proprietari; i link alle alternative sono forniti a scopo informativo, senza affiliazione né compenso.",
  backHome: "← ComplyAI",
};

const en: AboutContent = {
  metaTitle: "How ComplyAI works — documentation, FAQ and alternatives",
  metaDescription:
    "ComplyAI public documentation: how the six modules work, frequently asked questions, declared limits and more complete alternatives. A beta, open, zero-cost project.",
  kicker: "Documentation · FAQ · Transparency",
  title: "The project, explained honestly",
  intro:
    "ComplyAI is a free suite of compliance tools for European SMEs, in beta, built in public on a zero budget. This page explains how it really works, what it cannot do, and where to find more mature tools. If a compliance tool is not transparent about itself, why would you trust what it says about your obligations?",

  howTitle: "How it works",
  howIntro:
    "Six integrated modules, one underlying rule: never fake it. Every result says where it comes from (article of law, library pattern, or declared AI), and when something is not ready, we say so.",
  principlesTitle: "Design principles",
  principles: [
    {
      name: "Deterministic first, AI second",
      desc: "The AI Act classification is a rules engine with precise citations (no hallucinations on the law). AI (Mistral, EU) steps in only where needed — policy and contract analysis — always declared, always with a local fallback that sends nothing to third parties.",
    },
    {
      name: "Your data stays yours",
      desc: "Database in the EU (Frankfurt) with per-user isolation (RLS). Contract text extraction happens in your browser; we store the review memo, not the contract. The AI provider is configured with training opt-out. No ads, no data resale.",
    },
    {
      name: "Everything tracked, nothing erasable",
      desc: "Every action on your data lands in an append-only audit log that neither we (nor you) can alter: the same integrity guarantee you would demand from a supplier in a real audit.",
    },
    {
      name: "Up to date, and dated",
      desc: "Regulatory content is versioned and reflects the 2026 Digital Omnibus, with explicit warnings where new dates await the Official Journal. The regulatory radar checks official EU sources daily.",
    },
  ],
  modulesTitle: "The six modules",
  modules: [
    { name: "AI Act Compliance Checker", desc: "Guided questionnaire → risk classification with citations, obligations checklist, gaps and action plan. No sign-up needed.", href: "checker" },
    { name: "Regulation Watcher", desc: "Daily radar on the EU Official Journal, Commission/AI Office and EDPB, with deterministic tags. No generated summaries: original titles and links.", href: "watcher" },
    { name: "Policy-to-Controls Mapper", desc: "From a policy to a matrix of operational controls (owner, cadence, evidence), with optional AI analysis and a full editor.", href: "mapper" },
    { name: "Contract Review Agent", desc: "Upload a contract (text is extracted in your browser), get risky clauses, missing protections and key dates to send to the tracker.", href: "contracts" },
    { name: "Legal Deadline Tracker", desc: "Deadline tracker with automatic states and .ics export to your calendar.", href: "deadlines" },
    { name: "Audit Trail Builder", desc: "Browse, filter and export the immutable log of all actions, ready for an external auditor.", href: "audit" },
  ],

  faqTitle: "Frequently asked questions",
  faqs: [
    {
      q: "Is ComplyAI free? What's the catch?",
      a: "It is free and there is no catch, there is a constraint: the project is built entirely on free-tier services (hosting, database, AI) and says so. We do not sell data or show ads. If a paid plan ever existed, this version would remain honestly labelled for what it is.",
    },
    {
      q: "Are the Checker's results legal advice?",
      a: "No. The Checker applies deterministic rules derived from the AI Act text and always cites the reference article, but the outcome depends on your answers and the law evolves. Decisions with legal effects require a qualified professional: the report is designed to be brought to an advisor, not to replace one.",
    },
    {
      q: "What happens to my data and contracts?",
      a: "Saved data (account and content you choose to save) lives in an EU database, isolated per user. Uploaded contracts are read in your browser: text reaches the server only if you choose AI analysis, and we store the review memo, not the contract. The configured AI (Mistral, EU) has training opt-out enabled. Every change is tracked in an immutable log.",
    },
    {
      q: "Do I need to sign up?",
      a: "No: the Checker, the radar and local analyses work without an account. Registration (just email and password) is for saving assessments, deadlines and memos, and for AI analysis, whose free quota is shared among users.",
    },
    {
      q: "How reliable are the analyses?",
      a: "It differs by engine. The Checker's rules are tested and cited, but they simplify complex articles. The clause library recognises explicit patterns and can miss atypical wording (which is why 'not found' does not mean 'absent'). AI analysis can be wrong, and we say so under every result. In beta, the right reliability to assume is: an excellent starting point, never the last word.",
    },
    {
      q: "Are you updated to the 2026 Digital Omnibus?",
      a: "Yes: deadlines reflect the deferral of high-risk obligations (Annex III → 2 December 2027, Annex I → 2 August 2028) and flag with an asterisk what awaits publication in the Official Journal. The transparency obligation (Art. 50) was not postponed and remains 2 August 2026. The regulatory radar alerts us when something changes.",
    },
    {
      q: "Who is behind the project?",
      a: "Giacomo Fedeli, a data analyst, building it in public as a real product and a learning journey, assisted by AI development tools. The code is open on GitHub: you can verify every claim on this page by reading it.",
    },
    {
      q: "Can I use the reports with my accountant, DPO or lawyer?",
      a: "Yes, that is what they are for: every module exports (PDF, CSV, JSON, .ics) and the audit log is exportable for external auditors. Bringing your advisor a structured analysis saves time for both of you.",
    },
    {
      q: "Why should I trust a beta tool?",
      a: "You should not trust — you should be able to verify. That is why the code is public, legal sources are cited line by line, limits are written on this page, and more mature tools are listed below. Blind trust is exactly what a compliance tool should never ask of you.",
    },
    {
      q: "I found a bug or have an idea: how do I contribute?",
      a: "Message me on LinkedIn (link below) or open an issue on GitHub. Reports of legal/regulatory errors are the most valuable of all: they will be checked against the sources and fixed, with a mention in the decision log.",
    },
  ],

  altTitle: "More complete alternatives (seriously)",
  altIntro:
    "ComplyAI is a zero-budget beta: more mature, complete and supported tools exist. Here are some, with no affiliation whatsoever. If your case is critical, start here — especially with the official sources, which are free:",
  altCategories: [
    {
      title: "Official and free sources (start here)",
      items: [
        { name: "AI Act Service Desk — European Commission", url: "https://ai-act-service-desk.ec.europa.eu/en", note: "The official EU Compliance Checker, the AI Act Explorer and the helpdesk: free and authoritative by definition." },
        { name: "EU AI Act Compliance Checker — Future of Life Institute", url: "https://artificialintelligenceact.eu/assessment/eu-ai-act-compliance-checker/", note: "A widely cited free checker, on the same site publishing the AI Act text and analyses." },
        { name: "EUR-Lex", url: "https://eur-lex.europa.eu", note: "The official text of the law, with free email alerts and RSS: the primary source every tool (including ours) should cite." },
      ],
    },
    {
      title: "AI governance platforms (enterprise)",
      items: [
        { name: "Credo AI", url: "https://www.credo.ai", note: "End-to-end AI governance, policy packs for the AI Act and standards (e.g. ISO/IEC 42001)." },
        { name: "Holistic AI", url: "https://www.holisticai.com", note: "Large-scale AI risk assessment, audits and continuous monitoring." },
        { name: "OneTrust", url: "https://www.onetrust.com", note: "Broad GRC suite (privacy, AI governance, third parties) widely used by large companies." },
        { name: "trail", url: "https://www.trail-ml.com", note: "European AI governance with a free AI Act checker and automated technical documentation." },
      ],
    },
    {
      title: "Certifications and automated GRC",
      items: [
        { name: "Vanta", url: "https://www.vanta.com", note: "Compliance automation (SOC 2, ISO 27001, ISO 42001) with continuous evidence." },
        { name: "Drata", url: "https://www.drata.com", note: "An alternative to Vanta on the same ground, with broad integrations." },
      ],
    },
    {
      title: "Professional contract review",
      items: [
        { name: "Luminance", url: "https://www.luminance.com", note: "Legal AI for contract review and negotiation, used by firms and companies." },
        { name: "Juro", url: "https://juro.com", note: "Full contract lifecycle management with built-in AI." },
        { name: "Spellbook", url: "https://www.spellbook.legal", note: "AI contract drafting assistant, inside Word." },
      ],
    },
  ],
  altOutro:
    "And the best alternative of all remains human: a lawyer, a DPO or an advisor who knows your business. No software — least of all this one — replaces that.",

  contribTitle: "Contribute or get in touch",
  contribBody:
    "Suggestions, bug reports (especially legal/regulatory ones), ideas, honest criticism: everything is welcome. The project is open and under development — and the best way to build it is a conversation.",
  contribLinkedin: "Message me on LinkedIn — Giacomo Fedeli",
  contribGithub: "Source code and issues on GitHub",
  disclaimer:
    "ComplyAI provides informational compliance support and does not constitute legal advice. Trademarks belong to their respective owners; links to alternatives are provided for information, with no affiliation or compensation.",
  backHome: "← ComplyAI",
};

const packs: Record<Locale, AboutContent> = { it, en };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = packs[locale];
  return { title: t.metaTitle, description: t.metaDescription };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = packs[locale];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <Link href={`/${locale}`} className="text-sm text-slate-500 hover:text-slate-900">
          {t.backHome}
        </Link>
      </header>

      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-600">
        {t.kicker}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-4 leading-relaxed text-slate-600">{t.intro}</p>

      {/* Come funziona */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">{t.howTitle}</h2>
        <p className="mt-3 leading-relaxed text-slate-600">{t.howIntro}</p>

        <h3 className="mt-8 text-sm font-medium uppercase tracking-widest text-slate-500">
          {t.principlesTitle}
        </h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {t.principles.map((p) => (
            <div key={p.name} className="rounded-xl border border-slate-200 p-4">
              <p className="font-medium text-slate-900">{p.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-8 text-sm font-medium uppercase tracking-widest text-slate-500">
          {t.modulesTitle}
        </h3>
        <ul className="mt-3 space-y-2">
          {t.modules.map((m) => (
            <li key={m.href} className="rounded-lg border border-slate-200 p-3">
              <Link
                href={`/${locale}/${m.href}`}
                className="font-medium text-indigo-700 hover:text-indigo-900"
              >
                {m.name} →
              </Link>
              <p className="mt-1 text-sm text-slate-600">{m.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">{t.faqTitle}</h2>
        <div className="mt-4 space-y-2">
          {t.faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-lg border border-slate-200 p-4 open:bg-slate-50"
            >
              <summary className="cursor-pointer font-medium text-slate-900 marker:text-indigo-500">
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Alternative */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-slate-900">{t.altTitle}</h2>
        <p className="mt-3 leading-relaxed text-slate-600">{t.altIntro}</p>
        {t.altCategories.map((cat) => (
          <div key={cat.title} className="mt-6">
            <h3 className="text-sm font-medium uppercase tracking-widest text-slate-500">
              {cat.title}
            </h3>
            <ul className="mt-2 space-y-2">
              {cat.items.map((item) => (
                <li key={item.name} className="rounded-lg border border-slate-200 p-3">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-indigo-700 hover:text-indigo-900"
                  >
                    {item.name} ↗
                  </a>
                  <p className="mt-1 text-sm text-slate-600">{item.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
          {t.altOutro}
        </p>
      </section>

      {/* Contribuisci */}
      <section className="mt-12 rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-2xl font-semibold text-slate-900">{t.contribTitle}</h2>
        <p className="mt-3 leading-relaxed text-slate-600">{t.contribBody}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {t.contribLinkedin} ↗
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"
          >
            {t.contribGithub} ↗
          </a>
        </div>
      </section>

      <p className="mt-10 text-xs leading-relaxed text-slate-400">{t.disclaimer}</p>
    </main>
  );
}
