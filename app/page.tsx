// Landing page — Fase 0.
// Scopo: piattaforma online e deployata fin dal primo giorno, con roadmap trasparente.
// Nessuna funzionalità simulata: i moduli sono dichiarati "in sviluppo" o "in roadmap".

const moduli = [
  {
    nome: "AI Act Compliance Checker",
    descrizione:
      "Classifica il rischio dei tuoi sistemi AI secondo l'EU AI Act e genera checklist di obblighi, gap e piano d'azione.",
    stato: "Fase 1 — in sviluppo",
    attivo: true,
  },
  {
    nome: "Regulation Watcher",
    descrizione:
      "Radar normativo su fonti ufficiali UE: digest periodici e valutazione d'impatto sul profilo della tua azienda.",
    stato: "In roadmap",
    attivo: false,
  },
  {
    nome: "Policy-to-Controls Mapper",
    descrizione:
      "Trasforma policy e requisiti in controlli operativi con owner, cadenza ed evidenze richieste.",
    stato: "In roadmap",
    attivo: false,
  },
  {
    nome: "Audit Trail Builder",
    descrizione:
      "Log append-only di ogni azione umana e AI, consultabile ed esportabile per revisori esterni.",
    stato: "In roadmap",
    attivo: false,
  },
  {
    nome: "Contract Review Agent",
    descrizione:
      "Estrae clausole chiave dai contratti, segnala clausole rischiose o anomale e protezioni mancanti.",
    stato: "In roadmap",
    attivo: false,
  },
  {
    nome: "Legal Deadline Tracker",
    descrizione:
      "Scadenzario di obblighi, rinnovi e finestre di recesso con reminder e stato di avanzamento.",
    stato: "In roadmap",
    attivo: false,
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 py-5">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">
            Comply<span className="text-indigo-600">AI</span>
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            anteprima
          </span>
        </div>
        <span className="text-sm text-slate-500">Compliance per PMI europee</span>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-indigo-600">
          EU AI Act · GDPR · Contratti
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          La compliance normativa, alla portata delle PMI.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          Una suite di strumenti AI, aperta e in costruzione pubblica, per capire
          quali obblighi si applicano alla tua azienda, colmare i gap e
          documentare ogni decisione — senza costi di ingresso.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          Fase 0 completata: piattaforma online. Il primo modulo è in sviluppo.
        </div>
      </section>

      {/* Moduli */}
      <section className="pb-16">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-slate-500">
          I sei moduli della suite
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {moduli.map((m) => (
            <article
              key={m.nome}
              className={`rounded-xl border p-5 ${
                m.attivo
                  ? "border-indigo-200 bg-indigo-50/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="font-medium text-slate-900">{m.nome}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {m.descrizione}
              </p>
              <p
                className={`mt-4 text-xs font-medium ${
                  m.attivo ? "text-indigo-700" : "text-slate-400"
                }`}
              >
                {m.stato}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Footer con disclaimer */}
      <footer className="mt-auto border-t border-slate-200 py-8 text-sm text-slate-500">
        <p className="max-w-3xl leading-relaxed">
          <strong className="font-medium text-slate-600">Nota:</strong> ComplyAI
          fornisce supporto informativo alla compliance e non costituisce parere
          legale. Per decisioni con effetti giuridici rivolgiti a un
          professionista abilitato.
        </p>
        <p className="mt-3">
          © {new Date().getFullYear()} ComplyAI — progetto open, in sviluppo
          incrementale.
        </p>
      </footer>
    </main>
  );
}
