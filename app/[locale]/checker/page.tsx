import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import CheckerWizard from "./checker-wizard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { checker } = getDictionary(locale);
  return { title: checker.metaTitle, description: checker.metaDescription };
}

export default async function CheckerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Sprint 1.1: contenuti normativi disponibili in italiano.
  // In inglese: avviso onesto + rimando, finché la traduzione non è verificata (D7).
  if (locale === "en") {
    const t = getDictionary("en");
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
          AI Act Compliance Checker
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          {t.checker.noticeTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-lg leading-relaxed text-slate-600">
          {t.checker.noticeBody}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/it/checker"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
          >
            {t.checker.noticeCta}
          </Link>
          <Link
            href="/en"
            className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:border-slate-400"
          >
            ← ComplyAI
          </Link>
        </div>
      </main>
    );
  }

  return <CheckerWizard locale={locale} />;
}
