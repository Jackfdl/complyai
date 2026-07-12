"use client";
// Wizard dell'AI Act Compliance Checker — multilingua (IT/EN) + salvataggio opzionale (Sprint 1.2).
// Le risposte restano nel browser finché l'utente non sceglie di salvarle nel proprio account.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Locale } from "@/lib/i18n";
import { classify } from "@/lib/checker/classify";
import { getContent } from "@/lib/checker/packs";
import { getUi } from "@/lib/checker/ui";
import {
  getAssessment,
  logEvent,
  saveAssessment,
} from "@/lib/checker/storage";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { createDeadline } from "@/lib/deadlines/storage";
import type {
  CheckerAnswers,
  CitedItem,
  DeadlineItem,
  ObligationStatus,
  RiskLevel,
} from "@/lib/checker/types";
import AuthPanel from "./auth-panel";

const initialAnswers: CheckerAnswers = {
  role: "deployer",
  systemName: "",
  systemDescription: "",
  prohibitedPractices: [],
  annexI: "no",
  safetyCarveout: false,
  annexIIIAreas: [],
  art63Exemptions: [],
  profiling: false,
  transparencyFlags: [],
  gpai: false,
};

const LEVEL_TONE: Record<RiskLevel, { tone: string; badge: string }> = {
  prohibited: { tone: "border-red-300 bg-red-50 text-red-900", badge: "bg-red-600" },
  high: { tone: "border-amber-300 bg-amber-50 text-amber-900", badge: "bg-amber-600" },
  transparency: { tone: "border-sky-300 bg-sky-50 text-sky-900", badge: "bg-sky-600" },
  minimal: { tone: "border-emerald-300 bg-emerald-50 text-emerald-900", badge: "bg-emerald-600" },
};

function CheckboxList({
  items,
  selected,
  onChange,
  noneLabel,
}: {
  items: CitedItem[];
  selected: string[];
  onChange: (ids: string[]) => void;
  noneLabel: string;
}) {
  const toggle = (id: string) =>
    onChange(
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]
    );
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <label
          key={item.id}
          className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${
            selected.includes(item.id)
              ? "border-indigo-400 bg-indigo-50/60"
              : "border-slate-200 hover:border-slate-300"
          }`}
        >
          <input
            type="checkbox"
            checked={selected.includes(item.id)}
            onChange={() => toggle(item.id)}
            className="mt-1 h-4 w-4 accent-indigo-600"
          />
          <span>
            <span className="block font-medium text-slate-900">{item.label}</span>
            <span className="mt-0.5 block text-sm text-slate-600">{item.description}</span>
            <span className="mt-1 block text-xs font-medium text-slate-400">
              {item.ref}
              {item.note ? ` · ${item.note}` : ""}
            </span>
          </span>
        </label>
      ))}
      <label
        className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${
          selected.length === 0
            ? "border-emerald-400 bg-emerald-50/60"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <input
          type="checkbox"
          checked={selected.length === 0}
          onChange={() => onChange([])}
          className="mt-1 h-4 w-4 accent-emerald-600"
        />
        <span className="font-medium text-slate-900">{noneLabel}</span>
      </label>
    </div>
  );
}

export default function CheckerWizard({ locale }: { locale: Locale }) {
  const ui = getUi(locale);
  const content = getContent(locale);
  const supabase = getSupabase();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CheckerAnswers>(initialAnswers);
  const [statuses, setStatuses] = useState<Record<string, ObligationStatus>>({});
  const [owners, setOwners] = useState<Record<string, string>>({});
  const [dues, setDues] = useState<Record<string, string>>({});
  const [session, setSession] = useState<Session | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string>("");
  const [loadError, setLoadError] = useState(false);
  const [addedDeadlines, setAddedDeadlines] = useState<Record<number, boolean>>({});

  // Aggancio al Legal Deadline Tracker (Fase 2.2): una data normativa → una scadenza.
  const addRegDeadline = async (i: number, d: DeadlineItem) => {
    if (!supabase || !session || !d.isoDate) return;
    const name = answers.systemName.trim();
    const short = d.what.length > 60 ? `${d.what.slice(0, 60)}…` : d.what;
    const { error } = await createDeadline(supabase, {
      title: name ? `${name} — AI Act: ${short}` : `AI Act: ${short}`,
      due_date: d.isoDate,
      category: "AI Act",
      notes: `${d.date} · ${d.ref}`,
    });
    if (!error) setAddedDeadlines((m) => ({ ...m, [i]: true }));
  };

  // Sessione auth (se Supabase è configurato)
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // Caricamento di un assessment salvato (?load=<id>)
  useEffect(() => {
    if (!supabase) return;
    const id = new URLSearchParams(window.location.search).get("load");
    if (!id) return;
    getAssessment(supabase, id).then(({ item, error }) => {
      if (error || !item) {
        setLoadError(true);
        return;
      }
      setAnswers(item.answers);
      setStatuses(item.statuses);
      setOwners(item.owners);
      setDues(item.dues);
      setSavedId(item.id);
      setStep(8);
    });
  }, [supabase]);

  const set = <K extends keyof CheckerAnswers>(k: K, v: CheckerAnswers[K]) =>
    setAnswers((a) => ({ ...a, [k]: v }));

  const hasAnnexIII = answers.annexIIIAreas.length > 0;
  const stepsFlow = useMemo(() => {
    const flow = [0, 1, 2, 3, 4];
    if (hasAnnexIII) flow.push(5);
    flow.push(6, 7, 8);
    return flow;
  }, [hasAnnexIII]);
  const pos = stepsFlow.indexOf(step);
  const next = () => setStep(stepsFlow[Math.min(pos + 1, stepsFlow.length - 1)]);
  const back = () => setStep(stepsFlow[Math.max(pos - 1, 0)]);

  const result = useMemo(
    () => (step === 8 ? classify(answers, locale) : null),
    [step, answers, locale]
  );

  const gaps = result
    ? result.obligations.filter((o) => {
        const s = statuses[o.id] ?? "unknown";
        return s === "missing" || s === "partial" || s === "unknown";
      })
    : [];

  const doSave = async () => {
    if (!supabase || !result) return;
    setSaveState("saving");
    const { id, error } = await saveAssessment(
      supabase,
      { systemName: answers.systemName, answers, result, statuses, owners, dues },
      savedId ?? undefined
    );
    if (error) {
      setSaveState("error");
      setSaveError(error);
    } else {
      setSavedId(id ?? null);
      setSaveState("saved");
    }
  };

  const downloadJson = () => {
    if (!result) return;
    const data = {
      generatedAt: new Date().toISOString(),
      tool: "ComplyAI — AI Act Compliance Checker",
      locale,
      contentVersion: result.contentVersion,
      answers,
      classification: result,
      obligationStatuses: statuses,
      actionPlan: gaps.map((g) => ({
        obligation: g.label,
        ref: g.ref,
        status: statuses[g.id] ?? "unknown",
        owner: owners[g.id] ?? "",
        due: dues[g.id] ?? "",
      })),
      disclaimer: content.legalDisclaimer,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "complyai-risk-assessment.json";
    a.click();
    URL.revokeObjectURL(url);
    if (supabase && savedId) {
      void logEvent(supabase, "assessment.exported_json", "assessments", savedId);
    }
  };

  const dateLocale = locale === "it" ? "it-IT" : "en-GB";

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="no-print mb-8 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-sm text-slate-500 hover:text-slate-900">
          {ui.backHome}
        </Link>
        <div className="flex items-center gap-4">
          {isSupabaseConfigured && session && (
            <Link
              href={`/${locale}/assessments`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              {ui.myAssessments}
            </Link>
          )}
          {step > 0 && step < 8 && (
            <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
              {ui.stepLabel(pos, stepsFlow.length - 2)}
            </span>
          )}
        </div>
      </header>

      {loadError && (
        <p className="no-print mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {ui.loadErr}
        </p>
      )}

      {step === 0 && (
        <section>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-600">
            {ui.kicker}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{ui.introTitle}</h1>
          <p className="mt-4 leading-relaxed text-slate-600">{ui.introBody}</p>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            {ui.introBullets.map((b, i) => (
              <li key={i}>• {b}</li>
            ))}
          </ul>
          {content.reviewCaveat && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {content.reviewCaveat}
            </p>
          )}
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {content.legalDisclaimer}
          </div>
          <button
            onClick={next}
            className="mt-8 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
          >
            {ui.start}
          </button>
        </section>
      )}

      {step === 1 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">{ui.s1Title}</h2>
          <label className="mt-6 block text-sm font-medium text-slate-700">
            {ui.s1Name}
            <input
              value={answers.systemName}
              onChange={(e) => set("systemName", e.target.value)}
              placeholder={ui.s1NamePh}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="mt-4 block text-sm font-medium text-slate-700">
            {ui.s1Desc}
            <textarea
              value={answers.systemDescription}
              onChange={(e) => set("systemDescription", e.target.value)}
              rows={2}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-slate-700">{ui.s1RoleLegend}</legend>
            <div className="mt-3 space-y-3">
              {(["deployer", "provider", "both"] as const).map((value) => (
                <label
                  key={value}
                  className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${
                    answers.role === value
                      ? "border-indigo-400 bg-indigo-50/60"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    checked={answers.role === value}
                    onChange={() => set("role", value)}
                    className="mt-1 h-4 w-4 accent-indigo-600"
                  />
                  <span>
                    <span className="block font-medium text-slate-900">
                      {ui.roles[value].label}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-600">
                      {ui.roles[value].desc}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">{ui.s1RoleNote}</p>
          </fieldset>
        </section>
      )}

      {step === 2 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">{ui.s2Title}</h2>
          <p className="mt-2 text-sm text-slate-600">{ui.s2Body}</p>
          <div className="mt-6">
            <CheckboxList
              items={content.prohibitedPractices}
              selected={answers.prohibitedPractices}
              onChange={(ids) => set("prohibitedPractices", ids)}
              noneLabel={ui.s2None}
            />
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">{ui.s3Title}</h2>
          <p className="mt-2 text-sm text-slate-600">{ui.s3Body}</p>
          <div className="mt-6 space-y-3">
            {(["no", "sectionA", "machinery", "unsure"] as const).map((value) => (
              <label
                key={value}
                className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${
                  answers.annexI === value
                    ? "border-indigo-400 bg-indigo-50/60"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="annexI"
                  checked={answers.annexI === value}
                  onChange={() => set("annexI", value)}
                  className="mt-1 h-4 w-4 accent-indigo-600"
                />
                <span>
                  <span className="block font-medium text-slate-900">
                    {ui.annexI[value].label}
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-600">
                    {ui.annexI[value].desc}
                  </span>
                </span>
              </label>
            ))}
          </div>
          {answers.annexI === "sectionA" && (
            <label className="mt-4 flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-4 hover:border-slate-300">
              <input
                type="checkbox"
                checked={answers.safetyCarveout}
                onChange={(e) => set("safetyCarveout", e.target.checked)}
                className="mt-1 h-4 w-4 accent-indigo-600"
              />
              <span className="text-sm text-slate-600">
                <span className="block font-medium text-slate-900">{ui.s3Carveout}</span>
                {ui.s3CarveoutDesc}
              </span>
            </label>
          )}
        </section>
      )}

      {step === 4 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">{ui.s4Title}</h2>
          <p className="mt-2 text-sm text-slate-600">{ui.s4Body}</p>
          <div className="mt-6">
            <CheckboxList
              items={content.annexIIIAreas}
              selected={answers.annexIIIAreas}
              onChange={(ids) => set("annexIIIAreas", ids)}
              noneLabel={ui.s4None}
            />
          </div>
        </section>
      )}

      {step === 5 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">{ui.s5Title}</h2>
          <p className="mt-2 text-sm text-slate-600">{ui.s5Body}</p>
          <div className="mt-6">
            <CheckboxList
              items={content.art63Exemptions}
              selected={answers.art63Exemptions}
              onChange={(ids) => set("art63Exemptions", ids)}
              noneLabel={ui.s5None}
            />
          </div>
          <label className="mt-6 flex cursor-pointer gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
            <input
              type="checkbox"
              checked={answers.profiling}
              onChange={(e) => set("profiling", e.target.checked)}
              className="mt-1 h-4 w-4 accent-amber-600"
            />
            <span className="text-sm text-slate-700">
              <span className="block font-medium text-slate-900">{ui.s5Profiling}</span>
              {ui.s5ProfilingDesc}
            </span>
          </label>
        </section>
      )}

      {step === 6 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">{ui.s6Title}</h2>
          <p className="mt-2 text-sm text-slate-600">{ui.s6Body}</p>
          <div className="mt-6">
            <CheckboxList
              items={content.transparencyFlags}
              selected={answers.transparencyFlags}
              onChange={(ids) => set("transparencyFlags", ids)}
              noneLabel={ui.s6None}
            />
          </div>
        </section>
      )}

      {step === 7 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">{ui.s7Title}</h2>
          <label className="mt-6 flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-4 hover:border-slate-300">
            <input
              type="checkbox"
              checked={answers.gpai}
              onChange={(e) => set("gpai", e.target.checked)}
              className="mt-1 h-4 w-4 accent-indigo-600"
            />
            <span className="text-sm text-slate-600">
              <span className="block font-medium text-slate-900">{ui.s7Gpai}</span>
              {ui.s7GpaiDesc}
            </span>
          </label>
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <p className="font-medium text-slate-900">{ui.s7Summary}</p>
            <ul className="mt-2 space-y-1">
              <li>
                {ui.s7System}: {answers.systemName || ui.s7Unnamed} · {ui.s7Role}: {answers.role}
              </li>
              <li>
                {ui.s7Prohibited}: {answers.prohibitedPractices.length}
              </li>
              <li>
                Annex I: {answers.annexI}
                {answers.safetyCarveout ? ` ${ui.s7CarveoutShort}` : ""}
              </li>
              <li>
                {ui.s7Areas}: {answers.annexIIIAreas.length} · {ui.s7Exemptions}:{" "}
                {answers.art63Exemptions.length} · {ui.s7Profiling}:{" "}
                {answers.profiling ? ui.yes : ui.no}
              </li>
              <li>
                {ui.s7Transparency}: {answers.transparencyFlags.length} · GPAI:{" "}
                {answers.gpai ? ui.yes : ui.no}
              </li>
            </ul>
          </div>
        </section>
      )}

      {step === 8 && result && (
        <section id="report">
          <div className="mb-6 hidden print:block">
            <p className="text-lg font-semibold">{ui.reportTitle}</p>
            <p className="text-sm text-slate-500">
              {ui.generatedOn} {new Date().toLocaleDateString(dateLocale)} · {result.contentVersion}
            </p>
          </div>

          <div className={`rounded-xl border p-6 ${LEVEL_TONE[result.level].tone}`}>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${LEVEL_TONE[result.level].badge}`}
            >
              {ui.levels[result.level]}
            </span>
            <p className="mt-3 text-lg font-medium">
              {answers.systemName || ui.evaluatedSystem}
              {answers.systemDescription ? ` — ${answers.systemDescription}` : ""}
            </p>
            <p className="mt-1 text-sm opacity-80">
              {ui.roleLabel}: {answers.role === "both" ? ui.bothRoles : answers.role}
            </p>
          </div>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">{ui.whyTitle}</h3>
          <ul className="mt-3 space-y-3">
            {result.findings.map((f, i) => (
              <li key={i} className="rounded-lg border border-slate-200 p-4">
                <p className="font-medium text-slate-900">{f.title}</p>
                <p className="mt-1 text-sm text-slate-600">{f.detail}</p>
                <p className="mt-1 text-xs font-medium text-slate-400">{f.ref}</p>
              </li>
            ))}
          </ul>

          {result.deadlines.length > 0 && (
            <>
              <h3 className="mt-8 text-lg font-semibold text-slate-900">{ui.deadlinesTitle}</h3>
              <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-300 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-4">{ui.thWhen}</th>
                    <th className="py-2 pr-4">{ui.thWhat}</th>
                    <th className="py-2">{ui.thSource}</th>
                    <th className="no-print py-2" />
                  </tr>
                </thead>
                <tbody>
                  {result.deadlines.map((d, i) => (
                    <tr key={i} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-4 font-medium whitespace-nowrap">
                        {d.date}
                        {d.pendingOmnibus && <span title={ui.pendingGu}> *</span>}
                      </td>
                      <td className="py-2 pr-4 text-slate-600">{d.what}</td>
                      <td className="py-2 text-xs text-slate-400">{d.ref}</td>
                      <td className="no-print py-2 whitespace-nowrap text-right">
                        {session && d.isoDate && (
                          <button
                            onClick={() => void addRegDeadline(i, d)}
                            disabled={addedDeadlines[i]}
                            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-indigo-700 hover:border-indigo-400 disabled:border-emerald-300 disabled:text-emerald-700"
                          >
                            {addedDeadlines[i] ? ui.addedToDeadlines : ui.addToDeadlines}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              {!session && result.deadlines.some((d) => d.isoDate) && (
                <p className="no-print mt-2 text-xs text-slate-400">{ui.deadlineToTrackerHint}</p>
              )}
            </>
          )}

          <h3 className="mt-8 text-lg font-semibold text-slate-900">{ui.checklistTitle}</h3>
          <p className="mt-1 text-sm text-slate-600">{ui.checklistHint}</p>
          <ul className="mt-3 space-y-3">
            {result.obligations.map((o) => (
              <li key={o.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{o.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{o.description}</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {o.ref}
                      {o.deadline
                        ? ` · ${ui.dueBy} ${o.deadline}${o.pendingOmnibus ? " *" : ""}`
                        : ` · ${ui.alreadyApplicable}`}
                      {o.note ? ` · ${o.note}` : ""}
                    </p>
                  </div>
                  <select
                    value={statuses[o.id] ?? "unknown"}
                    onChange={(e) =>
                      setStatuses((s) => ({
                        ...s,
                        [o.id]: e.target.value as ObligationStatus,
                      }))
                    }
                    className="no-print rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    {(Object.keys(ui.statuses) as ObligationStatus[]).map((k) => (
                      <option key={k} value={k}>
                        {ui.statuses[k]}
                      </option>
                    ))}
                  </select>
                  <span className="hidden text-sm font-medium print:inline">
                    [{ui.statuses[statuses[o.id] ?? "unknown"]}]
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">
            {ui.planTitle(gaps.length)}
          </h3>
          {gaps.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">{ui.planEmpty}</p>
          ) : (
            <ol className="mt-3 space-y-3">
              {gaps.map((g, i) => (
                <li key={g.id} className="rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">
                    {i + 1}. {g.label}
                    <span className="ml-2 text-xs font-semibold uppercase text-amber-600">
                      {ui.statuses[statuses[g.id] ?? "unknown"]}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {g.ref}
                    {g.deadline ? ` · ${ui.dueBy} ${g.deadline}` : ""}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-medium text-slate-500">
                      {ui.ownerLabel}
                      <input
                        value={owners[g.id] ?? ""}
                        onChange={(e) =>
                          setOwners((s) => ({ ...s, [g.id]: e.target.value }))
                        }
                        placeholder={ui.ownerPh}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                      />
                    </label>
                    <label className="text-xs font-medium text-slate-500">
                      {ui.dueLabel}
                      <input
                        value={dues[g.id] ?? ""}
                        onChange={(e) => setDues((s) => ({ ...s, [g.id]: e.target.value }))}
                        placeholder={ui.duePh}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                      />
                    </label>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {/* Salvataggio account (Sprint 1.2) */}
          <div className="no-print mt-8 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
            <p className="font-semibold text-slate-900">{ui.saveTitle}</p>
            <p className="mt-1 text-sm text-slate-600">{ui.saveHint}</p>
            {!isSupabaseConfigured || !supabase ? (
              <p className="mt-3 text-sm text-slate-500">{ui.notConfigured}</p>
            ) : !session ? (
              <div className="mt-4">
                <AuthPanel supabase={supabase} ui={ui} onAuthed={() => void 0} />
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={doSave}
                  disabled={saveState === "saving"}
                  className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {savedId ? ui.updateBtn : ui.saveBtn}
                </button>
                {saveState === "saved" && (
                  <span className="text-sm font-medium text-emerald-700">{ui.savedOk}</span>
                )}
                {saveState === "error" && (
                  <span className="text-sm text-red-600">
                    {ui.saveErr} {saveError}
                  </span>
                )}
                <Link
                  href={`/${locale}/assessments`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  {ui.myAssessments}
                </Link>
              </div>
            )}
          </div>

          {result.caveats.length > 0 && (
            <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">{ui.warningsTitle}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.caveats.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-6 text-xs leading-relaxed text-slate-400">
            {content.legalDisclaimer} · {ui.sourcesNote} {result.contentVersion} ·{" "}
            {ui.reportFooterNote}
          </p>

          <div className="no-print mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
            >
              {ui.printBtn}
            </button>
            <button
              onClick={downloadJson}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:border-slate-400"
            >
              {ui.jsonBtn}
            </button>
            <button
              onClick={() => {
                setAnswers(initialAnswers);
                setStatuses({});
                setOwners({});
                setDues({});
                setSavedId(null);
                setSaveState("idle");
                setStep(0);
              }}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:border-slate-400"
            >
              {ui.restartBtn}
            </button>
          </div>
        </section>
      )}

      {step > 0 && step < 8 && (
        <div className="no-print mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
          <button onClick={back} className="text-sm font-medium text-slate-500 hover:text-slate-900">
            {ui.back}
          </button>
          <button
            onClick={next}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700"
          >
            {step === 7 ? ui.seeResult : ui.next}
          </button>
        </div>
      )}
    </div>
  );
}
