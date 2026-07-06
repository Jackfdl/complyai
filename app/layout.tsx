import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ComplyAI — Compliance AI Act per PMI",
  description:
    "Suite di strumenti AI per la compliance delle PMI europee: AI Act Checker, radar normativo, mappatura controlli, audit trail, revisione contratti e scadenzario legale.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="it">
      <body className="bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
