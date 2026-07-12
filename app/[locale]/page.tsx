// Landing page bilingue (IT default, EN).
// Nessuna funzionalità simulata: i moduli sono dichiarati "in sviluppo" o "in roadmap".
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { LogoMark, ModuleIcon } from "../brand";

// Percorso del modulo per indice di card (solo per i moduli attivi).
const moduleHrefs = ["checker", "watcher", "mapper", "audit", "contracts", "deadlines"];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 py-5">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-7" />
          <span className="text-lg font-semibold tracking-tight">
            Comply<span className="text-gradient-brand">AI</span>
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {t.header.badge}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-slate-500 sm:inline">
            {t.header.tagline}
          </span>
          <nav
            aria-label={t.header.langLabel}
            className="flex items-center gap-0.5 rounded-lg border border-slate-200 p-0.5"
          >
            {locales.map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                aria-current={l === locale ? "page" : undefined}
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  l === locale
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 sm:py-24">
        <div
          aria-hidden
          className="bg-dots pointer-events-none absolute inset-0 [mask-image:radial-gradient(65%_65%_at_28%_22%,black,transparent)]"
        />
        <p className="animate-rise mb-4 text-sm font-medium uppercase tracking-widest text-indigo-600">
          {t.hero.kicker}
        </p>
        <h1 className="animate-rise animate-rise-1 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {t.hero.title}
        </h1>
        <p className="animate-rise animate-rise-2 mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          {t.hero.subtitle}
        </p>
        <div className="animate-rise animate-rise-3 mt-8 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          {t.hero.status}
        </div>
      </section>

      {/* Moduli */}
      <section className="pb-16">
        <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-slate-500">
          {t.modules.title}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.modules.items.map((m, i) => (
            <article
              key={m.name}
              className={`group rounded-xl border p-5 transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg ${
                m.active
                  ? "border-indigo-200 bg-indigo-50/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <span
                aria-hidden
                className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-600 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110"
              >
                <ModuleIcon id={moduleHrefs[i] || "checker"} className="h-5 w-5" />
              </span>
              <h3 className="font-medium text-slate-900">{m.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {m.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <p
                  className={`text-xs font-medium ${
                    m.active ? "text-indigo-700" : "text-slate-400"
                  }`}
                >
                  {m.status}
                </p>
                {m.active && moduleHrefs[i] && (
                  <Link
                    href={`/${locale}/${moduleHrefs[i]}`}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    {t.modules.cta}
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer con disclaimer */}
      <footer className="mt-auto border-t border-slate-200 py-8 text-sm text-slate-500">
        <p className="max-w-3xl leading-relaxed">
          <strong className="font-medium text-slate-600">
            {t.footer.noteLabel}
          </strong>{" "}
          {t.footer.disclaimer}
        </p>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          <Link
            href={`/${locale}/about`}
            className="font-medium text-indigo-600 hover:text-indigo-800"
          >
            {t.footer.aboutLink}
          </Link>
          <Link
            href={`/${locale}/guardrail`}
            className="font-medium text-indigo-600 hover:text-indigo-800"
          >
            {t.footer.guardrailLink}
          </Link>
          <Link
            href={`/${locale}/privacy`}
            className="font-medium text-indigo-600 hover:text-indigo-800"
          >
            {t.footer.privacyLink}
          </Link>
        </p>
        <p className="mt-3">
          © {new Date().getFullYear()} ComplyAI — {t.footer.tagline}
        </p>
      </footer>
    </main>
  );
}
