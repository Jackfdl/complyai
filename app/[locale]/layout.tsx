import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import ThemeToggle from "../theme-toggle";
import "../globals.css";

// Applica il tema PRIMA del paint (niente lampo bianco): localStorage,
// altrimenti preferenza di sistema. Eseguito come primo script del body.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`;

// Solo le lingue dichiarate in lib/i18n.ts: qualunque altro prefisso → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { meta } = getDictionary(locale);
  return { title: meta.title, description: meta.description };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-white text-slate-900 antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
        <ThemeToggle locale={locale} />
      </body>
    </html>
  );
}
