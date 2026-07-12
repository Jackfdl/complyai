"use client";
// Contract Review Agent (Fase 2.4).
// Estrazione testo INTERAMENTE nel browser (D15); analisi AI server-side per
// utenti autenticati (D14) con fallback su libreria clausole locale per tutti.
// Le date chiave si agganciano allo Scadenzario (Fase 2.2) con un click.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { analyzeContract } from "@/lib/contracts/analyze";
import { extractTextFromFile } from "@/lib/contracts/extract";
import {
  deleteReview,
  getReview,
  listReviews,
  saveReview,
  type ReviewSummary,
} from "@/lib/contracts/storage";
import { getContractsUi } from "@/lib/contracts/ui";
import type { ClauseAssessment, ContractAnalysis } from "@/lib/contracts/types";
import { createDeadline } from "@/lib/deadlines/storage";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import AuthPanel from "../checker/auth-panel";
import { getUi } from "@/lib/checker/ui";

const MAX_CHARS = 30000;

const LEVEL_STYLE: Record<ClauseAssessment, { border: string; badge: string }> = {
  info: { border: "border-slate-200 bg-white", badge: "bg-slate-500" },
  warning: { border: "border-amber-300 bg-amber-50/50", badge: "bg-amber-600" },
  risk: { border: "border-red-300 bg-red-50/50", badge: "bg-red-600" },
};

type ExtractState =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "ok"; chars: number }
  | { kind: "error"; message: string };

export default function ContractsPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const ui = getContractsUi(locale);
  const authUi = getUi(locale); // pannello auth condiviso col Checker
  const supabase = getSupabase();
  const fileRef = useRef<HTMLInputElement>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [extract, setExtract] = useState<ExtractState>({ kind: "idle" });

  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [busy, setBusy] = useState(false);

  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const [reviews, setReviews] = useState<ReviewSummary[]>([]);
  const [addedDates, setAddedDates] = useState<Record<number, boolean>>({});

  const refreshList = async () => {
    if (!supabase) return;
    const { items } = await listReviews(supabase);
    setReviews(items);
  };

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      if (data.session) void refreshList();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) void refreshList();
      else setReviews([]);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setExtract({ kind: "busy" });
    const { text: extracted, error } = await extractTextFromFile(file);
    if (error === "unsupported") {
      setExtract({ kind: "error", message: ui.extractUnsupported });
      return;
    }
    if (error || extracted === undefined) {
      setExtract({ kind: "error", message: ui.extractFailed });
      return;
    }
    const clean = extracted.replace(/\s+\n/g, "\n").trim();
    setText(clean.slice(0, MAX_CHARS));
    setExtract({ kind: "ok", chars: clean.length });
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, ""));
  };

  const analyze = async () => {
    setBusy(true);
    setSavedId(null);
    setSaveState("idle");
    setAddedDates({});
    try {
      if (session) {
        const res = await fetch("/api/contracts/analyze", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ text, locale }),
        });
        if (res.ok) {
          setAnalysis((await res.json()) as ContractAnalysis);
          return;
        }
      }
      // Anonimo (o API non disponibile): libreria locale, nulla lascia il browser.
      setAnalysis(analyzeContract(text, locale));
    } finally {
      setBusy(false);
    }
  };

  const addDate = async (index: number, label: string, isoDate: string, raw: string) => {
    if (!supabase || !session) return;
    const { error } = await createDeadline(supabase, {
      title: title.trim() ? `${title.trim()} — ${label}` : label,
      due_date: isoDate,
      category: locale === "it" ? "contratti" : "contracts",
      notes: raw,
    });
    if (!error) setAddedDates((m) => ({ ...m, [index]: true }));
  };

  const doSave = async () => {
    if (!supabase || !session || !analysis) return;
    setSaveState("saving");
    const { id, error } = await saveReview(supabase, title, analysis, savedId ?? undefined);
    if (error) {
      setSaveState("error");
      setSaveError(error);
    } else {
      setSavedId(id ?? null);
      setSaveState("saved");
      void refreshList();
    }
  };

  const openReview = async (id: string) => {
    if (!supabase) return;
    const { item } = await getReview(supabase, id);
    if (!item) return;
    setTitle(item.title);
    setAnalysis(item.analysis);
    setText("");
    setExtract({ kind: "idle" });
    setSavedId(item.id);
    setSaveState("idle");
    setAddedDates({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: string) => {
    if (!supabase || !window.confirm(ui.confirmDelete)) return;
    await deleteReview(supabase, id);
    if (savedId === id) setSavedId(null);
    void refreshList();
  };

  const canAnalyze = text.trim().length >= 200 && text.length <= MAX_CHARS && !busy;
  const fallbackWarning = analysis?.warning === "llm-fallback";

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="no-print mb-8 flex items-center justify-between">
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

      <div className="no-print">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-600">
          {ui.kicker}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{ui.title}</h1>
        <p className="mt-4 leading-relaxed text-slate-600">{ui.body}</p>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {ui.privacyNotice}
        </p>

        {isSupabaseConfigured && supabase && ready && !session && (
          <div className="mt-6">
            <p className="mb-3 text-sm text-slate-600">{ui.needLogin}</p>
            <AuthPanel supabase={supabase} ui={authUi} onAuthed={() => void refreshList()} />
          </div>
        )}
        {!isSupabaseConfigured && (
          <p className="mt-4 text-sm text-slate-500">{ui.notConfigured}</p>
        )}

        {/* Caricamento file */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-700">{ui.uploadLabel}</p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt,.md,application/pdf,text/plain"
            onChange={(e) => void onFile(e.target.files?.[0])}
            className="mt-2 block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-700"
          />
          <p className="mt-2 text-xs text-slate-400">{ui.uploadHint}</p>
          {extract.kind === "busy" && (
            <p className="mt-2 text-sm text-slate-500">{ui.extracting}</p>
          )}
          {extract.kind === "ok" && (
            <p className="mt-2 text-sm text-emerald-700">{ui.extractedOk(extract.chars)}</p>
          )}
          {extract.kind === "error" && (
            <p className="mt-2 text-sm text-red-600">{extract.message}</p>
          )}
        </div>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          {ui.pasteLabel}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={9}
            maxLength={MAX_CHARS}
            placeholder={ui.pastePh}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 font-mono text-sm focus:border-indigo-500 focus:outline-none"
          />
        </label>
        <p className="mt-1 text-xs text-slate-400">
          {text.length.toLocaleString(locale === "it" ? "it-IT" : "en-GB")} / {MAX_CHARS.toLocaleString(locale === "it" ? "it-IT" : "en-GB")}
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          {ui.titleLabel}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={ui.titlePh}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
          />
        </label>

        <button
          onClick={() => void analyze()}
          disabled={!canAnalyze}
          className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {busy ? ui.analyzing : ui.analyzeBtn}
        </button>

        {analysis && (
          <p className="mt-4 text-sm text-slate-500">
            {fallbackWarning
              ? ui.engineFallback
              : analysis.engine === "llm"
                ? ui.engineLlm
                : ui.engineHeuristic}
          </p>
        )}
      </div>

      {analysis && (
        <section id="report" className="mt-8">
          <div className="mb-4 hidden print:block">
            <p className="text-lg font-semibold">{ui.memoTitle}</p>
            <p className="text-sm text-slate-500">{title}</p>
          </div>

          {analysis.summary && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-sm font-medium uppercase tracking-widest text-slate-500">
                {ui.summaryTitle}
              </h2>
              <p className="mt-2 leading-relaxed text-slate-700">{analysis.summary}</p>
            </div>
          )}

          {/* Clausole individuate */}
          <h2 className="mt-8 mb-3 text-sm font-medium uppercase tracking-widest text-slate-500">
            {ui.clausesTitle} ({analysis.clauses.length})
          </h2>
          {analysis.ragUsed && (
            <p className="-mt-1 mb-3 text-xs text-slate-400">{ui.refHint}</p>
          )}
          {analysis.clauses.length === 0 ? (
            <p className="text-sm text-amber-700">{ui.noClauses}</p>
          ) : (
            <ul className="space-y-3">
              {analysis.clauses.map((c, i) => (
                <li
                  key={`${c.category}-${i}`}
                  className={`rounded-xl border p-4 ${LEVEL_STYLE[c.level].border}`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${LEVEL_STYLE[c.level].badge}`}
                    >
                      {ui.levels[c.level]}
                    </span>
                    <span className="font-medium text-slate-900">{c.label}</span>
                    {c.occurrences && c.occurrences > 1 && (
                      <span className="text-xs text-slate-400">×{c.occurrences}</span>
                    )}
                  </div>
                  <p className="mt-2 border-l-2 border-slate-200 pl-3 text-sm italic text-slate-600">
                    “{c.excerpt}”
                  </p>
                  {c.comment && <p className="mt-2 text-sm text-slate-700">{c.comment}</p>}
                  {c.reference && (
                    <div
                      className={`mt-3 rounded-lg border p-3 ${
                        c.reference.kind === "risky"
                          ? "border-red-200 bg-red-50/40"
                          : "border-emerald-200 bg-emerald-50/40"
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          c.reference.kind === "risky" ? "text-red-700" : "text-emerald-700"
                        }`}
                      >
                        {c.reference.kind === "risky" ? ui.refRisky : ui.refStandard}
                        <span className="ml-2 font-normal normal-case text-slate-500">
                          {ui.refSimilarity} {(c.reference.similarity * 100).toFixed(0)}%
                        </span>
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        “{c.reference.text}”
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Protezioni mancanti */}
          {analysis.missing.length > 0 && (
            <>
              <h2 className="mt-8 mb-1 text-sm font-medium uppercase tracking-widest text-slate-500">
                {ui.missingTitle} ({analysis.missing.length})
              </h2>
              <p className="mb-3 text-xs text-slate-400">{ui.missingHint}</p>
              <ul className="space-y-2">
                {analysis.missing.map((m, i) => (
                  <li
                    key={`${m.category}-${i}`}
                    className="rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <p className="font-medium text-slate-900">{m.label}</p>
                    {m.why && <p className="mt-1 text-sm text-slate-600">{m.why}</p>}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Date e termini chiave */}
          {analysis.keyDates.length > 0 && (
            <>
              <h2 className="mt-8 mb-3 text-sm font-medium uppercase tracking-widest text-slate-500">
                {ui.datesTitle} ({analysis.keyDates.length})
              </h2>
              <ul className="space-y-2">
                {analysis.keyDates.map((d, i) => (
                  <li
                    key={i}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">{d.label}</p>
                      <p className="mt-1 text-sm text-slate-600">{d.raw}</p>
                    </div>
                    {d.isoDate && session && (
                      <button
                        onClick={() => void addDate(i, d.label, d.isoDate!, d.raw)}
                        disabled={addedDates[i]}
                        className="no-print shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:border-indigo-400 disabled:border-emerald-300 disabled:text-emerald-700"
                      >
                        {addedDates[i] ? ui.addedToDeadlines : ui.addToDeadlines}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="mt-6 text-xs text-slate-400">
            {ui.libraryLabel} {analysis.libraryVersion}
          </p>
          <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
            {ui.disclaimer}
          </p>

          <div className="no-print mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => window.print()}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
            >
              {ui.printBtn}
            </button>
            {session && (
              <button
                onClick={() => void doSave()}
                disabled={saveState === "saving"}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {savedId ? ui.updateBtn : ui.saveBtn}
              </button>
            )}
            {saveState === "saved" && (
              <span className="text-sm font-medium text-emerald-700">{ui.savedOk}</span>
            )}
            {saveState === "error" && (
              <span className="text-sm text-red-600">
                {ui.saveErr} {saveError}
              </span>
            )}
          </div>
        </section>
      )}

      {session && reviews.length > 0 && (
        <section className="no-print mt-12">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-slate-500">
            {ui.myReviews} ({reviews.length})
          </h2>
          <ul className="space-y-2">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3"
              >
                <span className="min-w-0 truncate font-medium text-slate-900">{r.title}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => void openReview(r.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    {ui.open}
                  </button>
                  <button
                    onClick={() => void onDelete(r.id)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-red-300 hover:text-red-600"
                  >
                    {ui.del}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
