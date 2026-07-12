"use client";
// Interruttore tema chiaro/scuro (D19), flottante su tutte le pagine.
// Stato: localStorage("theme") = "dark" | "light"; se assente vale la
// preferenza di sistema (applicata dallo script no-FOUC nel layout).
import { useEffect, useState } from "react";

export default function ThemeToggle({ locale }: { locale: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  if (dark === null) return null; // evita mismatch di idratazione

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage non disponibile: il tema vale per la sessione */
    }
    setDark(next);
  };

  const label =
    locale === "it"
      ? dark
        ? "Passa al tema chiaro"
        : "Passa al tema scuro"
      : dark
        ? "Switch to light theme"
        : "Switch to dark theme";

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="no-print fixed bottom-4 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-lg shadow-md transition-transform hover:scale-105"
    >
      <span aria-hidden>{dark ? "☀️" : "🌙"}</span>
    </button>
  );
}
