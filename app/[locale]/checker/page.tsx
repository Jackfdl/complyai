import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/lib/i18n";
import CheckerWizard from "./wizard";

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

  // Da Sprint 1.2 il wizard è disponibile in entrambe le lingue;
  // i contenuti EN portano un caveat di revisione (D7/D9).
  return <CheckerWizard locale={locale} />;
}
