"use client";
// Pannello di autenticazione minimale (email + password, senza conferma email in beta — D10).
import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CheckerUi } from "@/lib/checker/ui";

export default function AuthPanel({
  supabase,
  ui,
  onAuthed,
}: {
  supabase: SupabaseClient;
  ui: CheckerUi;
  onAuthed: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (mode: "in" | "up") => {
    setBusy(true);
    setError(null);
    const { error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) {
      setError(`${ui.authErr} ${error.message}`);
    } else {
      onAuthed();
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-medium text-slate-500">
          {ui.authEmail}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
          />
        </label>
        <label className="text-xs font-medium text-slate-500">
          {ui.authPassword}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
          />
        </label>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={() => run("in")}
          disabled={busy || !email || password.length < 6}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {ui.authSignIn}
        </button>
        <span className="text-xs text-slate-400">{ui.authOr}</span>
        <button
          onClick={() => run("up")}
          disabled={busy || !email || password.length < 6}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-50"
        >
          {ui.authSignUp}
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">{ui.authHint}</p>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
