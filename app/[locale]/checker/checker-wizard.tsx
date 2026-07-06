"use client";
// Wizard dell'AI Act Compliance Checker — Sprint 1.1 (anonimo).
// I dati restano nel browser: nessun invio a server, nessun account.
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  LEGAL_DISCLAIMER,
  annexIIIAreas,
  art63Exemptions,
  prohibitedPractices,
  transparencyFlags,
} from "@/lib/checker/content";
import { classify } from "@/lib/checker/engine";
import type {
  CheckerAnswers,
  CitedItem,
  ObligationStatus,
  RiskLevel,
} from "@/lib/checker/types";

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

const LEVEL_UI: Record<
  RiskLevel,
  { title: string; tone: string; badge: string }
> = {
  prohibited: {
    title: "Pratica vietata",
    tone: "border-red-300 bg-red-50 text-red-900",
    badge: "bg-red-600",
  },
  high: {
    title: "Alto rischio",
    tone: "border-amber-300 bg-amber-50 text-amber-900",
    badge: "bg-amber-600",
  },
  transparency: {
    title: "Rischio limitato — obblighi di trasparenza",
    tone: "border-sky-300 bg-sky-50 text-sky-900",
    badge: "bg-sky-600",
  },
  minimal: {
    title: "Rischio minimo",
    tone: "border-emerald-300 bg-emerald-50 text-emerald-900",
    badge: "bg-emerald-600",
  },
};

const STATUS_LABEL: Record<ObligationStatus, string> = {
  ok: "Conforme",
  partial: "Parziale",
  missing: "Mancante",
  unknown: "Da valutare",
  na: "Non applicabile",
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
            <span className="mt-0.5 block text-sm text-slate-600">
              {item.description}
            </span>
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

export default function CheckerWizard({ locale }: { locale: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CheckerAnswers>(initialAnswers);
  const [statuses, setStatuses] = useState<Record<string, ObligationStatus>>({});
  const [owners, setOwners] = useState<Record<string, string>>({});
  const [dues, setDues] = useState<Record<string, string>>({});

  const set = <K extends keyof CheckerAnswers>(k: K, v: CheckerAnswers[K]) =>
    setAnswers((a) => ({ ...a, [k]: v }));

  const hasAnnexIII = answers.annexIIIAreas.length > 0;
  // Passi: 0 intro, 1 ruolo, 2 art5, 3 annexI, 4 annexIII, 5 63(cond), 6 art50, 7 gpai/riepilogo, 8 risultati
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
    () => (step === 8 ? classify(answers) : null),
    [step, answers]
  );

  const gaps = result
    ? result.obligations.filter((o) => {
        const s = statuses[o.id] ?? "unknown";
        return s === "missing" || s === "partial" || s === "unknown";
      })
    : [];

  const downloadJson = () => {
    if (!result) return;
    const data = {
      generatedAt: new Date().toISOString(),
      tool: "ComplyAI — AI Act Compliance Checker",
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
      disclaimer: LEGAL_DISCLAIMER,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "complyai-risk-assessment.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Intestazione modulo */}
      <header className="no-print mb-8 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-sm text-slate-500 hover:text-slate-900">
          ← ComplyAI
        </Link>
        {step > 0 && step < 8 && (
          <span className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Passo {pos} di {stepsFlow.length - 2}
          </span>
        )}
      </header>

      {step === 0 && (
        <section>
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-600">
            AI Act Compliance Checker · beta
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Classifica il rischio AI Act di un tuo sistema, in 10 minuti.
          </h1>
          <p className="mt-4 leading-relaxed text-slate-600">
            Un questionario guidato ti porta alla classificazione del rischio
            secondo il Regolamento (UE) 2024/1689 (AI Act), con la checklist
            degli obblighi applicabili, i gap e un piano d&apos;azione. Ogni esito
            cita la base normativa: nessuna intelligenza artificiale generativa,
            solo regole deterministiche verificabili.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li>• Un sistema AI alla volta (ripetibile per ogni sistema).</li>
            <li>• Le risposte restano nel tuo browser: nessun dato inviato ai nostri server.</li>
            <li>• Aggiornato alle modifiche dell&apos;Omnibus digitale (giugno 2026), con avvertenze dove non ancora in Gazzetta Ufficiale.</li>
          </ul>
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            {LEGAL_DISCLAIMER}
          </div>
          <button
            onClick={next}
            className="mt-8 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
          >
            Inizia la valutazione
          </button>
        </section>
      )}

      {step === 1 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Il sistema e il tuo ruolo</h2>
          <label className="mt-6 block text-sm font-medium text-slate-700">
            Nome del sistema AI (come lo chiamate in azienda)
            <input
              value={answers.systemName}
              onChange={(e) => set("systemName", e.target.value)}
              placeholder="Es. screening CV con AI, chatbot assistenza clienti…"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <label className="mt-4 block text-sm font-medium text-slate-700">
            Cosa fa, in una frase (opzionale)
            <textarea
              value={answers.systemDescription}
              onChange={(e) => set("systemDescription", e.target.value)}
              rows={2}
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
            />
          </label>
          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-slate-700">
              Qual è il ruolo della tua azienda rispetto a questo sistema?
            </legend>
            <div className="mt-3 space-y-3">
              {(
                [
                  ["deployer", "Lo usiamo (deployer)", "Utilizziamo un sistema AI sviluppato da altri, sotto la nostra autorità."],
                  ["provider", "Lo sviluppiamo/forniamo (provider)", "Sviluppiamo il sistema e lo immettiamo sul mercato o in servizio con il nostro nome/marchio (anche solo per uso interno)."],
                  ["both", "Entrambi", "Lo abbiamo sviluppato e lo usiamo noi stessi."],
                ] as const
              ).map(([value, label, desc]) => (
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
                    <span className="block font-medium text-slate-900">{label}</span>
                    <span className="mt-0.5 block text-sm text-slate-600">{desc}</span>
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Definizioni: art. 3, punti 3–4 AI Act. Il ruolo determina quali obblighi si applicano.
            </p>
          </fieldset>
        </section>
      )}

      {step === 2 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Pratiche vietate</h2>
          <p className="mt-2 text-sm text-slate-600">
            Il sistema svolge una di queste pratiche? Sono vietate dal 2 febbraio
            2025 (art. 5 AI Act), a prescindere da tutto il resto.
          </p>
          <div className="mt-6">
            <CheckboxList
              items={prohibitedPractices}
              selected={answers.prohibitedPractices}
              onChange={(ids) => set("prohibitedPractices", ids)}
              noneLabel="Nessuna di queste pratiche"
            />
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Prodotti regolamentati (Annex I)</h2>
          <p className="mt-2 text-sm text-slate-600">
            Il sistema è un prodotto — o un componente di sicurezza di un prodotto —
            già soggetto a normativa UE armonizzata (dispositivi medici, giocattoli,
            ascensori, apparecchiature radio, veicoli, macchinari…)?
          </p>
          <div className="mt-6 space-y-3">
            {(
              [
                ["no", "No", "Il sistema non fa parte di prodotti soggetti a normativa UE di prodotto."],
                ["sectionA", "Sì, un prodotto regolamentato", "Es. dispositivo medico, giocattolo, ascensore, apparecchiatura radio (Annex I, sez. A)."],
                ["machinery", "Sì, un macchinario", "Prodotto soggetto al Regolamento Macchine (UE) 2023/1230 — regime speciale post-Omnibus."],
                ["unsure", "Non lo so", "Segnaleremo di verificarlo: cambia scadenze e obblighi."],
              ] as const
            ).map(([value, label, desc]) => (
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
                  <span className="block font-medium text-slate-900">{label}</span>
                  <span className="mt-0.5 block text-sm text-slate-600">{desc}</span>
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
                <span className="block font-medium text-slate-900">
                  L&apos;AI svolge solo funzioni di assistenza, ottimizzazione, comfort o controllo qualità
                </span>
                …e un suo malfunzionamento non metterebbe in pericolo salute o
                sicurezza (definizione ristretta di «componente di sicurezza»,
                Omnibus).
              </span>
            </label>
          )}
        </section>
      )}

      {step === 4 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Casi d&apos;uso ad alto rischio (Annex III)</h2>
          <p className="mt-2 text-sm text-slate-600">
            Il sistema è usato in una di queste aree? (Obblighi dal 2 dicembre
            2027, salvo deroghe — le vediamo al passo successivo.)
          </p>
          <div className="mt-6">
            <CheckboxList
              items={annexIIIAreas}
              selected={answers.annexIIIAreas}
              onChange={(ids) => set("annexIIIAreas", ids)}
              noneLabel="Nessuna di queste aree"
            />
          </div>
        </section>
      )}

      {step === 5 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Possibili deroghe (art. 6(3))</h2>
          <p className="mt-2 text-sm text-slate-600">
            Un sistema in area Annex III può non essere ad alto rischio se ricorre
            una di queste condizioni. Attenzione: è un&apos;autovalutazione da
            documentare, e la profilazione la esclude sempre.
          </p>
          <div className="mt-6">
            <CheckboxList
              items={art63Exemptions}
              selected={answers.art63Exemptions}
              onChange={(ids) => set("art63Exemptions", ids)}
              noneLabel="Nessuna condizione applicabile"
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
              <span className="block font-medium text-slate-900">
                Il sistema effettua profilazione di persone fisiche
              </span>
              Valutazione automatizzata di aspetti personali (rendimento, affidabilità,
              interessi, comportamento…). Se sì, la deroga non si applica mai
              (art. 6(3), ultimo comma).
            </span>
          </label>
        </section>
      )}

      {step === 6 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Trasparenza (art. 50)</h2>
          <p className="mt-2 text-sm text-slate-600">
            Questi obblighi si applicano <strong>dal 2 agosto 2026</strong> e
            l&apos;Omnibus NON li ha rinviati. Il sistema rientra in uno di questi casi?
          </p>
          <div className="mt-6">
            <CheckboxList
              items={transparencyFlags}
              selected={answers.transparencyFlags}
              onChange={(ids) => set("transparencyFlags", ids)}
              noneLabel="Nessuno di questi casi"
            />
          </div>
        </section>
      )}

      {step === 7 && (
        <section>
          <h2 className="text-2xl font-semibold text-slate-900">Ultima domanda e riepilogo</h2>
          <label className="mt-6 flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-4 hover:border-slate-300">
            <input
              type="checkbox"
              checked={answers.gpai}
              onChange={(e) => set("gpai", e.target.checked)}
              className="mt-1 h-4 w-4 accent-indigo-600"
            />
            <span className="text-sm text-slate-600">
              <span className="block font-medium text-slate-900">
                Sviluppiamo un modello di AI per finalità generali (GPAI)
              </span>
              Cioè un modello di base (es. un LLM addestrato da voi) fornito a terzi
              — raro per una PMI: usare ChatGPT/Claude non ti rende provider GPAI.
            </span>
          </label>
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <p className="font-medium text-slate-900">Riepilogo risposte</p>
            <ul className="mt-2 space-y-1">
              <li>Sistema: {answers.systemName || "(senza nome)"} · Ruolo: {answers.role}</li>
              <li>Pratiche vietate selezionate: {answers.prohibitedPractices.length}</li>
              <li>Annex I: {answers.annexI}{answers.safetyCarveout ? " (solo funzioni non di sicurezza)" : ""}</li>
              <li>Aree Annex III: {answers.annexIIIAreas.length} · Deroghe 6(3): {answers.art63Exemptions.length} · Profilazione: {answers.profiling ? "sì" : "no"}</li>
              <li>Casi di trasparenza art. 50: {answers.transparencyFlags.length} · GPAI: {answers.gpai ? "sì" : "no"}</li>
            </ul>
          </div>
        </section>
      )}

      {step === 8 && result && (
        <section id="report">
          <div className="mb-6 hidden print:block">
            <p className="text-lg font-semibold">ComplyAI — AI System Risk Assessment Report</p>
            <p className="text-sm text-slate-500">
              Generato il {new Date().toLocaleDateString("it-IT")} · {result.contentVersion}
            </p>
          </div>

          <div className={`rounded-xl border p-6 ${LEVEL_UI[result.level].tone}`}>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${LEVEL_UI[result.level].badge}`}>
              {LEVEL_UI[result.level].title}
            </span>
            <p className="mt-3 text-lg font-medium">
              {answers.systemName || "Il sistema valutato"}
              {answers.systemDescription ? ` — ${answers.systemDescription}` : ""}
            </p>
            <p className="mt-1 text-sm opacity-80">
              Ruolo: {answers.role === "both" ? "provider e deployer" : answers.role}
            </p>
          </div>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">Perché questo esito</h3>
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
              <h3 className="mt-8 text-lg font-semibold text-slate-900">Date rilevanti per te</h3>
              <table className="mt-3 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-300 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-4">Quando</th>
                    <th className="py-2 pr-4">Cosa</th>
                    <th className="py-2">Fonte</th>
                  </tr>
                </thead>
                <tbody>
                  {result.deadlines.map((d, i) => (
                    <tr key={i} className="border-b border-slate-100 align-top">
                      <td className="py-2 pr-4 font-medium whitespace-nowrap">
                        {d.date}
                        {d.pendingOmnibus && <span title="In attesa di pubblicazione in GU UE"> *</span>}
                      </td>
                      <td className="py-2 pr-4 text-slate-600">{d.what}</td>
                      <td className="py-2 text-xs text-slate-400">{d.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <h3 className="mt-8 text-lg font-semibold text-slate-900">Checklist degli obblighi</h3>
          <p className="mt-1 text-sm text-slate-600">
            Indica lo stato attuale di ciascun obbligo: gap e piano d&apos;azione si
            aggiornano di conseguenza.
          </p>
          <ul className="mt-3 space-y-3">
            {result.obligations.map((o) => (
              <li key={o.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{o.label}</p>
                    <p className="mt-1 text-sm text-slate-600">{o.description}</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {o.ref}
                      {o.deadline ? ` · entro ${o.deadline}${o.pendingOmnibus ? " *" : ""}` : " · già applicabile"}
                      {o.note ? ` · ${o.note}` : ""}
                    </p>
                  </div>
                  <select
                    value={statuses[o.id] ?? "unknown"}
                    onChange={(e) =>
                      setStatuses((s) => ({ ...s, [o.id]: e.target.value as ObligationStatus }))
                    }
                    className="no-print rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    {(Object.keys(STATUS_LABEL) as ObligationStatus[]).map((k) => (
                      <option key={k} value={k}>{STATUS_LABEL[k]}</option>
                    ))}
                  </select>
                  <span className="hidden text-sm font-medium print:inline">
                    [{STATUS_LABEL[statuses[o.id] ?? "unknown"]}]
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">
            Piano d&apos;azione ({gaps.length} elementi)
          </h3>
          {gaps.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">
              Nessun gap: tutti gli obblighi risultano conformi o non applicabili.
            </p>
          ) : (
            <ol className="mt-3 space-y-3">
              {gaps.map((g, i) => (
                <li key={g.id} className="rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-900">
                    {i + 1}. {g.label}
                    <span className="ml-2 text-xs font-semibold uppercase text-amber-600">
                      {STATUS_LABEL[statuses[g.id] ?? "unknown"]}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{g.ref}{g.deadline ? ` · entro ${g.deadline}` : ""}</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="text-xs font-medium text-slate-500">
                      Responsabile (owner)
                      <input
                        value={owners[g.id] ?? ""}
                        onChange={(e) => setOwners((s) => ({ ...s, [g.id]: e.target.value }))}
                        placeholder="Es. Resp. IT, HR, titolare…"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                      />
                    </label>
                    <label className="text-xs font-medium text-slate-500">
                      Scadenza interna
                      <input
                        value={dues[g.id] ?? ""}
                        onChange={(e) => setDues((s) => ({ ...s, [g.id]: e.target.value }))}
                        placeholder="Es. 30/09/2026"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal"
                      />
                    </label>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {result.caveats.length > 0 && (
            <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Avvertenze</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.caveats.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-6 text-xs leading-relaxed text-slate-400">
            {LEGAL_DISCLAIMER} · Contenuti normativi: {result.contentVersion} ·
            Fonti e stato di verifica: docs/FONTI-NORMATIVE.md nel repository.
            {" "}* = data derivante dall&apos;Omnibus, in attesa di pubblicazione in GU UE.
          </p>

          <div className="no-print mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700"
            >
              Stampa / salva PDF
            </button>
            <button
              onClick={downloadJson}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:border-slate-400"
            >
              Scarica dati (JSON)
            </button>
            <button
              onClick={() => {
                setAnswers(initialAnswers);
                setStatuses({});
                setOwners({});
                setDues({});
                setStep(0);
              }}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:border-slate-400"
            >
              Nuova valutazione
            </button>
          </div>
        </section>
      )}

      {/* Navigazione */}
      {step > 0 && step < 8 && (
        <div className="no-print mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
          <button onClick={back} className="text-sm font-medium text-slate-500 hover:text-slate-900">
            ← Indietro
          </button>
          <button
            onClick={next}
            className="rounded-lg bg-indigo-600 px-6 py-2.5 font-medium text-white hover:bg-indigo-700"
          >
            {step === 7 ? "Vedi il risultato" : "Avanti"}
          </button>
        </div>
      )}
    </div>
  );
}
