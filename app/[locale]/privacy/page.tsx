// Informativa privacy (GDPR artt. 13–14) — bilingue, onesta, versionata (D18).
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const LINKEDIN_URL = "https://www.linkedin.com/in/giacomo-fedeli-277765239/";
const GITHUB_URL = "https://github.com/Jackfdl/complyai";
const POLICY_VERSION = "v1.0 — 8 luglio 2026";

interface Section {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface PrivacyContent {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  intro: string;
  sections: Section[];
  contactTitle: string;
  contactBody: string;
  contactLinkedin: string;
  contactGithub: string;
  versionLabel: string;
  backHome: string;
  deleteCta: string;
}

const it: PrivacyContent = {
  metaTitle: "Informativa privacy — ComplyAI",
  metaDescription:
    "Come ComplyAI tratta i tuoi dati: cosa raccogliamo (poco), dove sta (UE), chi li vede (nessuno), come cancellarli (da solo, subito). Informativa GDPR in linguaggio chiaro.",
  kicker: "Privacy · GDPR",
  title: "Informativa privacy, in linguaggio chiaro",
  intro:
    "ComplyAI tratta pochi dati, li tiene in UE e ti dà il pulsante per cancellarli da solo. Questa pagina lo spiega senza legalese inutile — ma è un'informativa vera, ai sensi degli artt. 13–14 del GDPR. Se qualcosa non torna, segnalalo: correggere questa pagina è un obbligo, non una cortesia.",
  sections: [
    {
      title: "Chi è il titolare del trattamento",
      paragraphs: [
        "Giacomo Fedeli, che sviluppa ComplyAI come progetto personale aperto e non commerciale. Contatti in fondo alla pagina (LinkedIn o GitHub): rispondo io, non un ufficio.",
      ],
    },
    {
      title: "Quali dati trattiamo",
      bullets: [
        "Account (solo se ti registri): email e password. La password è gestita e cifrata da Supabase Auth: non la vediamo mai in chiaro.",
        "Contenuti che scegli di salvare: valutazioni AI Act, scadenze, matrici di controlli, memo di revisione contrattuale. Se non salvi, restano nel tuo browser e non li riceviamo.",
        "Contratti caricati: vengono letti NEL TUO BROWSER. Il testo raggiunge i nostri server solo se scegli l'analisi AI; in ogni caso salviamo il memo di revisione, mai il file originale.",
        "Registro audit: chi (il tuo ID), cosa (creato/modificato/eliminato) e quando, per ogni azione sui tuoi dati. È append-only: nessuno può alterarlo, garanzia di integrità.",
        "Dati tecnici minimi dei provider di hosting (log di erogazione del servizio). Non installiamo strumenti di analytics né pixel di tracciamento.",
      ],
    },
    {
      title: "Cosa NON facciamo",
      bullets: [
        "Niente pubblicità, niente profilazione, niente vendita o cessione di dati.",
        "Niente cookie di tracciamento: solo cookie/storage tecnici per tenerti collegato.",
        "Niente addestramento di modelli AI sui tuoi dati: il provider AI è configurato con l'opt-out dal training.",
        "Niente email di marketing (in beta non inviamo email del tutto).",
      ],
    },
    {
      title: "Dove stanno i dati e chi li tratta per noi",
      bullets: [
        "Supabase (database e autenticazione) — dati salvati nella regione UE, Francoforte. Responsabile del trattamento.",
        "Vercel (hosting dell'applicazione) — le funzioni server sono configurate nella regione di Francoforte; la CDN che serve le pagine statiche è globale. Responsabile del trattamento.",
        "Mistral AI (analisi AI, solo su tua richiesta esplicita) — società UE; i testi inviati non vengono usati per addestrare modelli (opt-out attivo) e sono soggetti alla retention tecnica del provider.",
        "Nessun altro: il codice è pubblico su GitHub e chiunque può verificarlo.",
      ],
    },
    {
      title: "Base giuridica e conservazione",
      bullets: [
        "Esecuzione del servizio che richiedi (art. 6(1)(b) GDPR) per account e contenuti salvati.",
        "Tua azione esplicita per l'analisi AI: il testo parte solo quando premi tu il bottone.",
        "Conservazione: finché tieni l'account. Se lo elimini, i dati collegati vengono cancellati subito; le copie di sicurezza tecniche dei provider decadono nei loro cicli ordinari.",
        "Il registro audit resta anche dopo la cancellazione, in forma pseudonima: l'identificativo non è più riconducibile a una persona.",
      ],
    },
    {
      title: "I tuoi diritti (artt. 15–22 GDPR)",
      paragraphs: [
        "Accesso, rettifica, cancellazione, limitazione, portabilità, opposizione: valgono tutti. Due li hai già in mano senza chiedere nulla: puoi esportare i tuoi dati (PDF, CSV, JSON, .ics da ogni modulo) e puoi eliminare l'account e tutti i dati da solo, subito, dalla pagina «Le mie valutazioni». Per il resto scrivimi; hai comunque il diritto di reclamo al Garante per la protezione dei dati personali.",
      ],
    },
  ],
  contactTitle: "Contatti",
  contactBody:
    "Per qualunque richiesta su questa informativa o sui tuoi dati (è un progetto personale: rispondo direttamente io):",
  contactLinkedin: "LinkedIn — Giacomo Fedeli",
  contactGithub: "Issue su GitHub",
  versionLabel: "Versione",
  backHome: "← ComplyAI",
  deleteCta: "Elimina il tuo account da «Le mie valutazioni» →",
};

const en: PrivacyContent = {
  metaTitle: "Privacy notice — ComplyAI",
  metaDescription:
    "How ComplyAI handles your data: what we collect (little), where it lives (EU), who sees it (nobody), how to delete it (yourself, instantly). A GDPR notice in plain language.",
  kicker: "Privacy · GDPR",
  title: "Privacy notice, in plain language",
  intro:
    "ComplyAI processes little data, keeps it in the EU and gives you the button to delete it yourself. This page explains that without pointless legalese — but it is a real notice under Articles 13–14 GDPR. If something looks wrong, report it: fixing this page is an obligation, not a courtesy.",
  sections: [
    {
      title: "Who is the data controller",
      paragraphs: [
        "Giacomo Fedeli, who develops ComplyAI as an open, non-commercial personal project. Contacts at the bottom of this page (LinkedIn or GitHub): I answer personally, not an office.",
      ],
    },
    {
      title: "What data we process",
      bullets: [
        "Account (only if you sign up): email and password. The password is managed and encrypted by Supabase Auth: we never see it in clear text.",
        "Content you choose to save: AI Act assessments, deadlines, control matrices, contract review memos. If you do not save, it stays in your browser and never reaches us.",
        "Uploaded contracts: they are read IN YOUR BROWSER. The text reaches our servers only if you choose AI analysis; in any case we store the review memo, never the original file.",
        "Audit log: who (your ID), what (created/updated/deleted) and when, for every action on your data. It is append-only: nobody can alter it — an integrity guarantee.",
        "Minimal technical data from hosting providers (service delivery logs). We install no analytics tools or tracking pixels.",
      ],
    },
    {
      title: "What we do NOT do",
      bullets: [
        "No advertising, no profiling, no selling or sharing of data.",
        "No tracking cookies: only technical cookies/storage to keep you signed in.",
        "No AI model training on your data: the AI provider is configured with training opt-out.",
        "No marketing emails (in beta we send no emails at all).",
      ],
    },
    {
      title: "Where the data lives and who processes it for us",
      bullets: [
        "Supabase (database and authentication) — data stored in the EU region, Frankfurt. Data processor.",
        "Vercel (application hosting) — server functions are configured in the Frankfurt region; the CDN serving static pages is global. Data processor.",
        "Mistral AI (AI analysis, only at your explicit request) — an EU company; submitted texts are not used to train models (opt-out enabled) and are subject to the provider's technical retention.",
        "Nobody else: the code is public on GitHub and anyone can verify it.",
      ],
    },
    {
      title: "Legal basis and retention",
      bullets: [
        "Performance of the service you request (Art. 6(1)(b) GDPR) for account and saved content.",
        "Your explicit action for AI analysis: text is sent only when you press the button.",
        "Retention: as long as you keep the account. If you delete it, linked data is erased immediately; providers' technical backups expire in their ordinary cycles.",
        "The audit log survives account deletion, pseudonymised: the identifier is no longer attributable to a person.",
      ],
    },
    {
      title: "Your rights (Arts. 15–22 GDPR)",
      paragraphs: [
        "Access, rectification, erasure, restriction, portability, objection: they all apply. Two are already in your hands without asking: you can export your data (PDF, CSV, JSON, .ics from every module) and you can delete your account and all data yourself, instantly, from the “My assessments” page. For everything else, write to me; you also have the right to complain to your data protection authority.",
      ],
    },
  ],
  contactTitle: "Contacts",
  contactBody:
    "For any request about this notice or your data (it is a personal project: I answer directly):",
  contactLinkedin: "LinkedIn — Giacomo Fedeli",
  contactGithub: "Issues on GitHub",
  versionLabel: "Version",
  backHome: "← ComplyAI",
  deleteCta: "Delete your account from “My assessments” →",
};

const packs: Record<Locale, PrivacyContent> = { it, en };

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

export default async function PrivacyPage({
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

      {t.sections.map((s) => (
        <section key={s.title} className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">{s.title}</h2>
          {s.paragraphs?.map((p, i) => (
            <p key={i} className="mt-3 leading-relaxed text-slate-600">
              {p}
            </p>
          ))}
          {s.bullets && (
            <ul className="mt-3 space-y-2">
              {s.bullets.map((b, i) => (
                <li key={i} className="rounded-lg border border-slate-200 p-3 text-sm leading-relaxed text-slate-600">
                  {b}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <p className="mt-8">
        <Link
          href={`/${locale}/assessments`}
          className="font-medium text-red-700 hover:text-red-900"
        >
          {t.deleteCta}
        </Link>
      </p>

      <section className="mt-10 rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-xl font-semibold text-slate-900">{t.contactTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.contactBody}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {t.contactLinkedin} ↗
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"
          >
            {t.contactGithub} ↗
          </a>
        </div>
      </section>

      <p className="mt-8 text-xs text-slate-400">
        {t.versionLabel}: {POLICY_VERSION}
      </p>
    </main>
  );
}
