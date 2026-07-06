"use client";
// "Le mie valutazioni" — dashboard degli assessment salvati (Sprint 1.2).
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { getUi } from "@/lib/checker/ui";
import {
  deleteAssessment,
  listAssessments,
  type SavedAssessmentSummary,
} from "@/lib/checker/storage";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { RiskLevel } from "@/lib/checker/types";
import AuthPanel from "../checker/auth-panel";

const LEVEL_BADGE: Record<string, string> = {
  prohibited: "bg-red-600",
  high: "bg-amber-600",
  transparency: "bg-sky-600",
  minimal: "bg-emerald-600",
};

export default function AssessmentsPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const ui = getUi(locale);
  const supabase = getSupabase();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<SavedAssessmentSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!supabase) return;
    const { items, error } = await listAssessments(supabase);
    setItems(items);
    setError(error ?? null);
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
      else setItems([]);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const onDelete = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm(ui.dashConfirmDelete)) return;
    const { error } = await deleteAssessment(supabase, id);
    if (!error) void refresh();
  };

  const dateLocale = locale === "it" ? "it-IT" : "en-GB";
  const fmt = (iso: string) => new Date(iso).toLocaleDateString(dateLocale);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
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

      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{ui.dashTitle}</h1>

      {!isSupabaseConfigured || !supabase ? (
        <p className="mt-6 text-sm text-slate-500">{ui.notConfigured}</p>
      ) : !ready ? (
        <p className="mt-6 text-sm text-slate-500">{ui.loading}</p>
      ) : !session ? (
        <div className="mt-6">
          <p className="mb-4 text-sm text-slate-600">{ui.dashNeedLogin}</p>
          <AuthPanel supabase={supabase} ui={ui} onAuthed={() => void refresh()} />
        </div>
      ) : (
        <>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {items.length === 0 ? (
            <p className="mt-6 text-sm text-slate-600">{ui.dashEmpty}</p>
          ) : (
            <ul className="mt-6 space-y-3">
              {items.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{a.system_name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      <span
                        className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${
                          LEVEL_BADGE[a.level as RiskLevel] ?? "bg-slate-500"
                        }`}
                      >
                        {ui.levels[a.level as RiskLevel] ?? a.level}
                      </span>
                      {ui.dashSavedOn} {fmt(a.created_at)} · {ui.dashUpdatedOn} {fmt(a.updated_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => router.push(`/${locale}/checker?load=${a.id}`)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      {ui.dashOpen}
                    </button>
                    <button
                      onClick={() => void onDelete(a.id)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-red-300 hover:text-red-600"
                    >
                      {ui.dashDelete}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/${locale}/checker`}
            className="mt-8 inline-block rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-slate-400"
          >
            {ui.dashNewAssessment}
          </Link>
        </>
      )}
    </main>
  );
}
