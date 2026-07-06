// Landing page bilingue (IT default, EN).
// Nessuna funzionalità simulata: i moduli sono dichiarati "in sviluppo" o "in roadmap".
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/lib/i18n";

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
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">
            Comply<span className="text-indigo-600">AI</span>
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
      <section className="py-16 sm:py-24">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-indigo-600">
          {t.hero.kicker}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          {t.hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          {t.hero.subtitle}
        </p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
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
          {t.modules.items.map((m) => (
            <article
              key={m.name}
              className={`rounded-xl border p-5 ${
                m.active
                  ? "border-indigo-200 bg-indigo-50/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="font-medium text-slate-900">{m.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {m.description}
              </p>
              <p
                className={`mt-4 text-xs font-medium ${
                  m.active ? "text-indigo-700" : "text-slate-400"
                }`}
              >
                {m.status}
              </p>
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
        <p className="mt-3">
          © {new Date().getFullYear()} ComplyAI — {t.footer.tagline}
        </p>
      </footer>
    </main>
  );
}
