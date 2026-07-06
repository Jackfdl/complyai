"use client";
// Policy-to-Controls Mapper (Fase 2.3).
// Analisi AI server-side per utenti autenticati (D14), euristica locale per tutti.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { analyzeHeuristic } from "@/lib/mapper/heuristics";
import {
  deleteMatrix,
  getMatrix,
  listMatrices,
  saveMatrix,
  toCsv,
  type MatrixSummary,
} from "@/lib/mapper/storage";
import { getMapperUi } from "@/lib/mapper/ui";
import type { AnalysisEngine, ControlRow, RowStatus } from "@/lib/mapper/types";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import AuthPanel from "../checker/auth-panel";
import { getUi } from "@/lib/checker/ui";

let rowSeq = 0;
const newId = () => `r${++rowSeq}-${Date.now() % 100000}`;

export default function MapperPage() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = isLocale(params.locale) ? params.locale : defaultLocale;
  const ui = getMapperUi(locale);
  const authUi = getUi(locale);
  const supabase = getSupabase();

  const [session, setSession] = useState<Session | null>(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [rows, setRows] = useState<ControlRow[]>([]);
  const [engine, setEngine] = useState<AnalysisEngine | null>(null);
  const [fallbackWarning, setFallbackWarning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const [matrices, setMatrices] = useState<MatrixSummary[]>([]);

  const refreshList = async () => {
    if (!supabase) return;
    const { items } = await listMatrices(supabase);
    setMatrices(items);
  };

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) void refreshList();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) void refreshList();
      else setMatrices([]);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const applyRows = (r: Omit<ControlRow, "status">[]) =>
    setRows(r.map((x) => ({ ...x, id: newId(), status: "todo" as RowStatus })));

  const analyze = async () => {
    setBusy(true);
    setFallbackWarning(false);
    setSavedId(null);
    setSaveState("idle");
    try {
      if (session) {
        const res = await fetch("/api/mapper/analyze", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ text, locale }),
        });
        if (res.ok) {
          const data = await res.json();
          applyRows(data.rows);
          setEngine(data.engine as AnalysisEngine);
          setFallbackWarning(data.warning === "llm-fallback");
          return;
        }
      }
      // Anonimo (o API non disponibile): euristica locale, nulla lascia il browser.
      const local = analyzeHeuristic(text, locale);
      applyRows(local.rows);
      setEngine(local.engine);
    } finally {
      setBusy(false);
    }
  };

  const setCell = (id: string, field: keyof ControlRow, value: string) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const addRow = () =>
    setRows((rs) => [
      ...rs,
      { id: newId(), requirement: "", control: "", owner: "", frequency: "", evidence: "", status: "todo" },
    ]);

  const removeRow = (id: string) => setRows((rs) => rs.filter((r) => r.id !== id));

  const exportCsv = () => {
    const csv = toCsv(rows, [
      ui.colRequirement,
      ui.colControl,
      ui.colOwner,
      ui.colFrequency,
      ui.colEvidence,
      ui.colStatus,
    ]);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "complyai-matrice-controlli.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const doSave = async () => {
    if (!supabase || !session) return;
    setSaveState("saving");
    const { id, error } = await saveMatrix(supabase, title, text, rows, savedId ?? undefined);
    if (error) {
      setSaveState("error");
      setSaveError(error);
    } else {
      setSavedId(id ?? null);
      setSaveState("saved");
      void refreshList();
    }
  };

  const openMatrix = async (id: string) => {
    if (!supabase) return;
    const { item } = await getMatrix(supabase, id);
    if (!item) return;
    setTitle(item.title);
    setText(item.source_text);
    setRows(item.rows);
    setSavedId(item.id);
    setEngine(null);
    setSaveState("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: string) => {
    if (!supabase || !window.confirm(ui.confirmDelete)) return;
    await deleteMatrix(supabase, id);
    if (savedId === id) setSavedId(null);
    void refreshList();
  };

  const canAnalyze = text.trim().length >= 40 && !busy;

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

        {isSupabaseConfigured && supabase && !session && (
          <div className="mt-6">
            <p className="mb-3 text-sm text-slate-600">{ui.needLogin}</p>
            <AuthPanel supabase={supabase} ui={authUi} onAuthed={() => void refreshList()} />
          </div>
        )}
        {!isSupabaseConfigured && (
          <p className="mt-4 text-sm text-slate-500">{ui.notConfigured}</p>
        )}

        <label className="mt-6 block text-sm font-medium text-slate-700">
          {ui.titleLabel}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={ui.titlePh}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          {ui.inputLabel}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            maxLength={12000}
            placeholder={ui.inputPh}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 font-mono text-sm focus:border-indigo-500 focus:outline-none"
          />
        </label>
        <button
          onClick={() => void analyze()}
          disabled={!canAnalyze}
          className="mt-4 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {busy ? ui.analyzing : ui.analyzeBtn}
        </button>

        {engine && (
          <p className="mt-4 text-sm text-slate-500">
            {fallbackWarning
              ? ui.engineFallback
              : engine === "llm"
                ? ui.engineLlm
                : ui.engineHeuristic}
          </p>
        )}
        {engine && rows.length === 0 && (
          <p className="mt-2 text-sm text-amber-700">{ui.noRows}</p>
        )}
      </div>

      {rows.length > 0 && (
        <section id="report" className="mt-8">
          <div className="mb-4 hidden print:block">
            <p className="text-lg font-semibold">{ui.reportTitle}</p>
            <p className="text-sm text-slate-500">{title}</p>
          </div>

          <ol className="space-y-4">
            {rows.map((r, i) => (
              <li key={r.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    #{i + 1}
                  </span>
                  <button
                    onClick={() => removeRow(r.id)}
                    className="no-print text-xs font-medium text-slate-400 hover:text-red-600"
                  >
                    {ui.removeRow}
                  </button>
                </div>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-slate-500 sm:col-span-2">
                    {ui.colRequirement}
                    <textarea
                      value={r.requirement}
                      onChange={(e) => setCell(r.id, "requirement", e.target.value)}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                    />
                  </label>
                  <label className="text-xs font-medium text-slate-500 sm:col-span-2">
                    {ui.colControl}
                    <textarea
                      value={r.control}
                      onChange={(e) => setCell(r.id, "control", e.target.value)}
                      rows={2}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                    />
                  </label>
                  <label className="text-xs font-medium text-slate-500">
                    {ui.colOwner}
                    <input
                      value={r.owner}
                      onChange={(e) => setCell(r.id, "owner", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                    />
                  </label>
                  <label className="text-xs font-medium text-slate-500">
                    {ui.colFrequency}
                    <input
                      value={r.frequency}
                      onChange={(e) => setCell(r.id, "frequency", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                    />
                  </label>
                  <label className="text-xs font-medium text-slate-500">
                    {ui.colEvidence}
                    <input
                      value={r.evidence}
                      onChange={(e) => setCell(r.id, "evidence", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                    />
                  </label>
                  <label className="text-xs font-medium text-slate-500">
                    {ui.colStatus}
                    <select
                      value={r.status}
                      onChange={(e) => setCell(r.id, "status", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                    >
                      {(Object.keys(ui.statuses) as RowStatus[]).map((k) => (
                        <option key={k} value={k}>
                          {ui.statuses[k]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </li>
            ))}
          </ol>

          <div className="no-print mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={addRow}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
            >
              {ui.addRow}
            </button>
            <button
              onClick={exportCsv}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-400"
            >
              {ui.csvBtn}
            </button>
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

      {session && matrices.length > 0 && (
        <section className="no-print mt-12">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-slate-500">
            {ui.myMatrices} ({matrices.length})
          </h2>
          <ul className="space-y-2">
            {matrices.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3"
              >
                <span className="min-w-0 truncate font-medium text-slate-900">{m.title}</span>
                <span className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => void openMatrix(m.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    {ui.open}
                  </button>
                  <button
                    onClick={() => void onDelete(m.id)}
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
