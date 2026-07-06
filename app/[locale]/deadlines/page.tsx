"use client";
// Legal Deadline Tracker — scadenzario per-utente (Fase 2.2).
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import {
  daysUntil,
  deadlineState,
  toIcs,
  type DeadlineRecord,
  type DeadlineState,
} from "@/lib/deadlines/logic";
import {
  createDeadline,
  deleteDeadline,
  listDeadlines,
  setDeadlineCompleted,
} from "@/lib/deadlines/storage";
import { getDeadlinesUi } from "@/lib/deadlines/ui";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import AuthPanel from "../checker/auth-panel";
import { getUi } from "@/lib/checker/ui";

const STATE_STYLE: Record<DeadlineState, { border: string; badge: string }> = {
  overdue: { border: "border-red-300 bg-red-50/50", badge: "bg-red-600" },
  soon: { border: "border-amber-300 bg-amber-50/50", badge: "bg-amber-600" },
  upcoming: { border: "border-slate-200 bg-white", badge: "bg-slate-500" },
  completed: { border: "border-emerald-200 bg-emerald-50/40", badge: "bg-emerald-600" },
};

const GROUP_ORDER: DeadlineState[] = ["overdue", "soon", "upcoming", "completed"];

export default function DeadlinesPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const ui = getDeadlinesUi(locale);
  const authUi = getUi(locale); // stringhe del pannello auth condivise col Checker
  const supabase = getSupabase();

  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState<DeadlineRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");

  const refresh = async () => {
    if (!supabase) return;
    const { items, error } = await listDeadlines(supabase);
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

  const grouped = useMemo(() => {
    const g: Record<DeadlineState, DeadlineRecord[]> = {
      overdue: [],
      soon: [],
      upcoming: [],
      completed: [],
    };
    for (const d of items) g[deadlineState(d.due_date, d.completed_at)].push(d);
    return g;
  }, [items]);

  const onAdd = async () => {
    if (!supabase || !title.trim() || !due) return;
    setBusy(true);
    const { error } = await createDeadline(supabase, {
      title: title.trim(),
      due_date: due,
      category: category.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    setBusy(false);
    if (error) {
      setError(error);
    } else {
      setTitle("");
      setDue("");
      setCategory("");
      setNotes("");
      void refresh();
    }
  };

  const onToggle = async (d: DeadlineRecord) => {
    if (!supabase) return;
    await setDeadlineCompleted(supabase, d.id, !d.completed_at);
    void refresh();
  };

  const onDelete = async (id: string) => {
    if (!supabase) return;
    if (!window.confirm(ui.confirmDelete)) return;
    await deleteDeadline(supabase, id);
    void refresh();
  };

  const exportIcs = () => {
    const open = items.filter((d) => !d.completed_at);
    const blob = new Blob([toIcs(open)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "complyai-scadenze.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const dateLocale = locale === "it" ? "it-IT" : "en-GB";
  const fmt = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(dateLocale);
  };

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

      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-600">
        {ui.kicker}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{ui.title}</h1>
      <p className="mt-4 leading-relaxed text-slate-600">{ui.body}</p>

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
          {/* Form nuova scadenza */}
          <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-semibold text-slate-900">{ui.formTitle}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-500 sm:col-span-2">
                {ui.fTitle}
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={ui.fTitlePh}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                {ui.fDue}
                <input
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                {ui.fCategory}
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder={ui.fCategoryPh}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                />
              </label>
              <label className="text-xs font-medium text-slate-500 sm:col-span-2">
                {ui.fNotes}
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={ui.fNotesPh}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                />
              </label>
            </div>
            <button
              onClick={() => void onAdd()}
              disabled={busy || !title.trim() || !due}
              className="mt-4 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {busy ? ui.adding : ui.addBtn}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </section>

          {items.length === 0 ? (
            <p className="mt-8 text-sm text-slate-600">{ui.empty}</p>
          ) : (
            <>
              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={exportIcs}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
                >
                  {ui.icsBtn}
                </button>
                <span className="text-xs text-slate-400">{ui.icsHint}</span>
              </div>

              {GROUP_ORDER.map((state) =>
                grouped[state].length === 0 ? null : (
                  <section key={state} className="mt-8">
                    <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-slate-500">
                      {ui.groups[state]} ({grouped[state].length})
                    </h2>
                    <ul className="space-y-3">
                      {grouped[state].map((d) => {
                        const n = daysUntil(d.due_date);
                        return (
                          <li
                            key={d.id}
                            className={`rounded-xl border p-4 ${STATE_STYLE[state].border}`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`font-medium text-slate-900 ${
                                    state === "completed" ? "line-through opacity-60" : ""
                                  }`}
                                >
                                  {d.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  <span
                                    className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${STATE_STYLE[state].badge}`}
                                  >
                                    {fmt(d.due_date)}
                                  </span>
                                  {state !== "completed" &&
                                    (n < 0 ? ui.daysLate(-n) : ui.daysLeft(n))}
                                  {d.category && ` · ${d.category}`}
                                </p>
                                {d.notes && (
                                  <p className="mt-1 text-sm text-slate-600">{d.notes}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => void onToggle(d)}
                                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
                                >
                                  {d.completed_at ? ui.reopenBtn : ui.completeBtn}
                                </button>
                                <button
                                  onClick={() => void onDelete(d.id)}
                                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-red-300 hover:text-red-600"
                                >
                                  {ui.deleteBtn}
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
