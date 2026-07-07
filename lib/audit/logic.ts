// Audit Trail Builder (modulo 4): logica pura e testata.
// Legge l'audit_log append-only popolato dai trigger DB di tutti i moduli
// (assessment.*, deadline.*, contract_review.*, matrix.*) — nessuna scrittura da qui.

export type AuditVerb = "created" | "updated" | "deleted" | "other";

export interface AuditRecord {
  id: number;
  at: string; // ISO timestamptz
  action: string; // es. "deadline.updated"
  entity: string | null; // es. "deadlines"
  entity_id: string | null;
  details: Record<string, unknown> | null;
  prev_state: Record<string, unknown> | null;
  new_state: Record<string, unknown> | null;
}

export interface ParsedAction {
  /** prefisso dell'azione, es. "deadline" (chiave di modulo). */
  module: string;
  verb: AuditVerb;
}

export function parseAction(action: string): ParsedAction {
  const dot = action.indexOf(".");
  const module = dot === -1 ? action : action.slice(0, dot);
  const rest = dot === -1 ? "" : action.slice(dot + 1);
  const verb: AuditVerb =
    rest === "created" || rest === "updated" || rest === "deleted" ? rest : "other";
  return { module, verb };
}

// --- Etichette bilingui (dati, testabili) -------------------------------------
// Chiave = prefisso azione. La colonna `entity` (plurale) è normalizzata a queste.
const MODULE_LABELS: Record<string, { it: string; en: string }> = {
  assessment: { it: "Valutazione AI Act", en: "AI Act assessment" },
  deadline: { it: "Scadenza", en: "Deadline" },
  contract_review: { it: "Revisione contratto", en: "Contract review" },
  matrix: { it: "Matrice controlli", en: "Controls matrix" },
};

const ENTITY_TO_MODULE: Record<string, string> = {
  assessments: "assessment",
  deadlines: "deadline",
  contract_reviews: "contract_review",
  control_matrices: "matrix",
};

const VERB_LABELS: Record<AuditVerb, { it: string; en: string }> = {
  created: { it: "Creazione", en: "Created" },
  updated: { it: "Modifica", en: "Updated" },
  deleted: { it: "Eliminazione", en: "Deleted" },
  other: { it: "Azione", en: "Action" },
};

/** Elenco dei moduli noti, per i filtri della UI. */
export function knownModules(): string[] {
  return Object.keys(MODULE_LABELS);
}

export function moduleKey(rec: AuditRecord): string {
  const fromAction = parseAction(rec.action).module;
  if (MODULE_LABELS[fromAction]) return fromAction;
  if (rec.entity && ENTITY_TO_MODULE[rec.entity]) return ENTITY_TO_MODULE[rec.entity];
  return fromAction || "other";
}

export function moduleLabel(key: string, locale: "it" | "en"): string {
  return MODULE_LABELS[key] ? MODULE_LABELS[key][locale] : key;
}

export function verbLabel(verb: AuditVerb, locale: "it" | "en"): string {
  return VERB_LABELS[verb][locale];
}

export function verbColor(verb: AuditVerb): string {
  return verb === "created"
    ? "bg-emerald-600"
    : verb === "updated"
      ? "bg-amber-600"
      : verb === "deleted"
        ? "bg-red-600"
        : "bg-slate-500";
}

// --- Sintesi leggibile dello stato -------------------------------------------
const STATE_KEYS: { key: string; it: string; en: string }[] = [
  { key: "system_name", it: "Sistema", en: "System" },
  { key: "title", it: "Titolo", en: "Title" },
  { key: "level", it: "Livello", en: "Level" },
  { key: "due_date", it: "Scadenza", en: "Due date" },
  { key: "completed_at", it: "Completata", en: "Completed" },
  { key: "clauses", it: "Clausole", en: "Clauses" },
  { key: "rows", it: "Righe", en: "Rows" },
];

/** Riepilogo breve dello stato più informativo (new_state, poi prev_state, poi details). */
export function summarizeEntry(rec: AuditRecord, locale: "it" | "en"): string {
  const src = rec.new_state ?? rec.prev_state ?? rec.details;
  if (!src || typeof src !== "object") return "";
  const o = src as Record<string, unknown>;
  const parts: string[] = [];
  for (const { key, it, en } of STATE_KEYS) {
    const v = o[key];
    if (v === undefined || v === null || v === "") continue;
    parts.push(`${locale === "it" ? it : en}: ${String(v)}`);
  }
  return parts.join(" · ");
}

// --- Filtri ------------------------------------------------------------------
export interface AuditFilter {
  module?: string; // chiave di modulo o "all"
  verb?: AuditVerb | "all";
  query?: string;
}

export function filterEntries(
  entries: AuditRecord[],
  filter: AuditFilter,
  locale: "it" | "en"
): AuditRecord[] {
  const q = (filter.query ?? "").trim().toLowerCase();
  return entries.filter((e) => {
    if (filter.module && filter.module !== "all" && moduleKey(e) !== filter.module) return false;
    if (filter.verb && filter.verb !== "all" && parseAction(e.action).verb !== filter.verb) return false;
    if (q) {
      const hay = [
        e.action,
        e.entity_id ?? "",
        moduleLabel(moduleKey(e), locale),
        summarizeEntry(e, locale),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

// --- Export CSV (RFC 4180) ---------------------------------------------------
function csvCell(s: string): string {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function auditToCsv(
  entries: AuditRecord[],
  locale: "it" | "en",
  headers: string[]
): string {
  const lines = [headers.map(csvCell).join(",")];
  for (const e of entries) {
    const { verb } = parseAction(e.action);
    lines.push(
      [
        e.at,
        moduleLabel(moduleKey(e), locale),
        verbLabel(verb, locale),
        e.action,
        e.entity_id ?? "",
        summarizeEntry(e, locale),
      ]
        .map((c) => csvCell(String(c)))
        .join(",")
    );
  }
  return lines.join("\r\n") + "\r\n";
}
