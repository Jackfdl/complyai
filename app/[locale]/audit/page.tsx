"use client";
// Audit Trail Builder (modulo 4). Consultazione del registro append-only
// (audit_log) popolato dai trigger DB di tutti i moduli. Sola lettura + export.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import {
  auditToCsv,
  filterEntries,
  knownModules,
  moduleKey,
  moduleLabel,
  parseAction,
  summarizeEntry,
  verbColor,
  verbLabel,
  type AuditRecord,
  type AuditVerb,
} from "@/lib/audit/logic";
import { listAudit } from "@/lib/audit/storage";
import { getAuditUi } from "@/lib/audit/ui";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import AuthPanel from "../checker/auth-panel";
import { getUi } from "@/lib/checker/ui";

const VERB_OPTIONS: (AuditVerb | "all")[] = ["all", "created", "updated", "deleted", "other"];

export default function AuditPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const ui = getAuditUi(locale);
  const authUi = getUi(locale);
  const supabase = getSupabase();

  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [entries, setEntries] = useState<AuditRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [fModule, setFModule] = useState("all");
  const [fVerb, setFVerb] = useState<AuditVerb | "all">("all");
  const [query, setQuery] = useState("");

  const refresh = async () => {
    if (!supabase) return;
    setLoading(true);
    const { items, error } = await listAudit(supabase);
    setEntries(items);
    setError(error ?? null);
    setLoading(false);
  };

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      if (data.session) void refresh();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) void refresh();
      else setEntries([]);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const filtered = useMemo(
    () => filterEntries(entries, { module: fModule, verb: fVerb, query }, locale),
    [entries, fModule, fVerb, query, locale]
  );

  const dateLocale = locale === "it" ? "it-IT" : "en-GB";
  const fmt = (iso: string) => new Date(iso).toLocaleString(dateLocale);

  const download = (content: string, type: string, name: string) => {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };
  const exportCsv = () =>
    download(
      auditToCsv(filtered, locale, [ui.colWhen, ui.colModule, ui.fVerb, ui.colAction, ui.colId, ui.colDetail]),
      "text/csv;charset=utf-8",
      "complyai-audit.csv"
    );
  const exportJson = () =>
    download(JSON.stringify(filtered, null, 2), "application/json", "complyai-audit.json");

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-sm text-slate-500 hover:text-slate-900">
          {ui.backHome}
        </Link>
        {session && supabase && (
          <button
            onClick={() => void supabase.auth.signOut()}
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            {ui.signOut}
          </button>
        )}
      </header>

      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-600">{ui.kicker}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{ui.title}</h1>
      <p className="mt-4 leading-relaxed text-slate-600">{ui.body}</p>
      <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
        {ui.appendOnly}
      </p>

      {!isSupabaseConfigured || !supabase ? (
        <p className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          {ui.notConfigured}
        </p>
      ) : !ready ? (
        <p className="mt-8 text-sm text-slate-500">{ui.loading}</p>
      ) : !session ? (
        <div className="mt-8">
          <p className="mb-4 text-sm text-slate-600">{ui.needLogin}</p>
          <AuthPanel supabase={supabase} ui={authUi} onAuthed={() => void refresh()} />
        </div>
      ) : (
        <>
          {/* Filtri */}
          <section className="mt-8 grid gap-3 sm:grid-cols-3">
            <label className="text-xs font-medium text-slate-500">
              {ui.fModule}
              <select
                value={fModule}
                onChange={(e) => setFModule(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
              >
                <option value="all">{ui.all}</option>
                {knownModules().map((m) => (
                  <option key={m} value={m}>
                    {moduleLabel(m, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-slate-500">
              {ui.fVerb}
              <select
                value={fVerb}
                onChange={(e) => setFVerb(e.target.value as AuditVerb | "all")}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
              >
                {VERB_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {ui.verbs[v]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs font-medium text-slate-500">
              {ui.fSearch}
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={ui.fSearchPh}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
              />
            </label>
          </section>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-500">{ui.count(filtered.length, entries.length)}</span>
            <button
              onClick={() => void refresh()}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-50"
            >
              {loading ? ui.loading : ui.refresh}
            </button>
            <button
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-50"
            >
              {ui.csvBtn}
            </button>
            <button
              onClick={exportJson}
              disabled={filtered.length === 0}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-400 disabled:opacity-50"
            >
              {ui.jsonBtn}
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          {entries.length === 0 ? (
            <p className="mt-8 text-sm text-slate-600">{ui.empty}</p>
          ) : filtered.length === 0 ? (
            <p className="mt-8 text-sm text-slate-600">{ui.noMatch}</p>
          ) : (
            <ul className="mt-6 space-y-2">
              {filtered.map((e) => {
                const verb = parseAction(e.action).verb;
                const summary = summarizeEntry(e, locale);
                return (
                  <li key={e.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${verbColor(verb)}`}
                      >
                        {verbLabel(verb, locale)}
                      </span>
                      <span className="font-medium text-slate-900">{moduleLabel(moduleKey(e), locale)}</span>
                      <span className="text-xs text-slate-400">{fmt(e.at)}</span>
                    </div>
                    {summary && <p className="mt-2 text-sm text-slate-600">{summary}</p>}
                    <p className="mt-1 font-mono text-[11px] text-slate-400">
                      {e.action}
                      {e.entity_id ? ` · ${e.entity_id}` : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
