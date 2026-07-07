// Pagina pubblica dei guardrail (Fase 3.2) — trasparenza sui confini della suite.
// Server component: contenuto statico bilingue, nessun JS lato client necessario.
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import {
  CATEGORY_LABELS,
  GUARDRAILS_VERSION,
  GUARDRAIL_CATEGORY_ORDER,
  guardrailsByCategory,
} from "@/lib/guardrails/content";
import { getGuardrailsUi } from "@/lib/guardrails/ui";

export default async function GuardrailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ui = getGuardrailsUi(locale);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <Link href={`/${locale}`} className="text-sm text-slate-500 hover:text-slate-900">
          {ui.backHome}
        </Link>
      </header>

      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-600">
        {ui.kicker}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{ui.title}</h1>
      <p className="mt-4 leading-relaxed text-slate-600">{ui.intro}</p>

      {GUARDRAIL_CATEGORY_ORDER.map((cat) => (
        <section key={cat} className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500">
            {CATEGORY_LABELS[cat][locale]}
          </h2>
          <ul className="mt-3 space-y-3">
            {guardrailsByCategory(cat).map((g) => (
              <li key={g.id} className="rounded-xl border border-slate-200 p-5">
                <p className="font-medium text-slate-900">{g.principle[locale]}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{g.detail[locale]}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mt-10 text-xs text-slate-400">
        {ui.versionLabel} {GUARDRAILS_VERSION}
      </p>
      <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
        {ui.footerNote}
      </p>
    </main>
  );
}
