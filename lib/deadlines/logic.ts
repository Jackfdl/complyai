// Logica del Legal Deadline Tracker: stati scadenza + export iCalendar.
// Funzioni pure e deterministiche, testate in logic.test.ts.

export type DeadlineState = "overdue" | "soon" | "upcoming" | "completed";

export interface DeadlineRecord {
  id: string;
  title: string;
  notes: string | null;
  category: string | null;
  due_date: string; // YYYY-MM-DD
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Data locale in formato YYYY-MM-DD (confronti lessicografici = confronti di date, senza trappole di fuso). */
export function localDateString(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d + days);
  return localDateString(date);
}

/** Finestra di preavviso "in scadenza": 30 giorni. */
export const SOON_WINDOW_DAYS = 30;

export function deadlineState(
  dueDate: string,
  completedAt: string | null,
  today: string = localDateString()
): DeadlineState {
  if (completedAt) return "completed";
  if (dueDate < today) return "overdue";
  if (dueDate <= addDays(today, SOON_WINDOW_DAYS)) return "soon";
  return "upcoming";
}

/** Giorni mancanti (negativi se in ritardo), su date pure YYYY-MM-DD. */
export function daysUntil(dueDate: string, today: string = localDateString()): number {
  const toUtc = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(dueDate) - toUtc(today)) / 86_400_000);
}

// ---------------------------------------------------------------------------
// Export iCalendar (RFC 5545): eventi giornata intera, importabili ovunque.
// ---------------------------------------------------------------------------
export function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

export function toIcs(
  items: { id: string; title: string; due_date: string; notes?: string | null }[]
): string {
  const stamp =
    new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ComplyAI//Legal Deadline Tracker//IT",
    "CALSCALE:GREGORIAN",
  ];
  for (const item of items) {
    const date = item.due_date.replace(/-/g, "");
    lines.push(
      "BEGIN:VEVENT",
      `UID:complyai-deadline-${item.id}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${date}`,
      `SUMMARY:${escapeIcs(item.title)}`,
      ...(item.notes ? [`DESCRIPTION:${escapeIcs(item.notes)}`] : []),
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
