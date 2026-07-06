import { describe, expect, it } from "vitest";
import {
  addDays,
  daysUntil,
  deadlineState,
  escapeIcs,
  toIcs,
} from "./logic";

const TODAY = "2026-07-06";

describe("deadlineState", () => {
  it("completata prevale su tutto", () => {
    expect(deadlineState("2020-01-01", "2026-07-01T10:00:00Z", TODAY)).toBe("completed");
  });
  it("scaduta ieri → overdue", () => {
    expect(deadlineState("2026-07-05", null, TODAY)).toBe("overdue");
  });
  it("oggi → soon (non ancora scaduta)", () => {
    expect(deadlineState("2026-07-06", null, TODAY)).toBe("soon");
  });
  it("entro 30 giorni → soon; oltre → upcoming", () => {
    expect(deadlineState("2026-08-05", null, TODAY)).toBe("soon");
    expect(deadlineState("2026-08-06", null, TODAY)).toBe("upcoming");
  });
});

describe("addDays / daysUntil", () => {
  it("attraversa i mesi correttamente", () => {
    expect(addDays("2026-07-06", 30)).toBe("2026-08-05");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
  it("daysUntil positivo, zero e negativo", () => {
    expect(daysUntil("2026-07-08", TODAY)).toBe(2);
    expect(daysUntil("2026-07-06", TODAY)).toBe(0);
    expect(daysUntil("2026-07-01", TODAY)).toBe(-5);
  });
});

describe("iCalendar export", () => {
  it("escaping RFC 5545 di virgole, punti e virgola e newline", () => {
    expect(escapeIcs("a,b;c\nd")).toBe("a\\,b\\;c\\nd");
  });
  it("genera un VCALENDAR valido con eventi giornata intera", () => {
    const ics = toIcs([
      { id: "1", title: "Rinnovo contratto, fornitore X", due_date: "2026-09-30", notes: "Disdetta entro 60gg" },
    ]);
    expect(ics).toMatch(/^BEGIN:VCALENDAR\r\n/);
    expect(ics).toContain("DTSTART;VALUE=DATE:20260930");
    expect(ics).toContain("SUMMARY:Rinnovo contratto\\, fornitore X");
    expect(ics).toContain("UID:complyai-deadline-1");
    expect(ics).toContain("DESCRIPTION:Disdetta entro 60gg");
    expect(ics.trim().endsWith("END:VCALENDAR")).toBe(true);
  });
});
