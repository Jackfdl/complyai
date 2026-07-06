// Persistenza delle matrici controlli su Supabase (RLS per-utente, audit via trigger).
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ControlRow } from "./types";

export interface MatrixSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export async function saveMatrix(
  supabase: SupabaseClient,
  title: string,
  sourceText: string,
  rows: ControlRow[],
  existingId?: string
): Promise<{ id?: string; error?: string }> {
  const row = { title: title || "—", source_text: sourceText, rows };
  const query = existingId
    ? supabase.from("control_matrices").update(row).eq("id", existingId).select("id").single()
    : supabase.from("control_matrices").insert(row).select("id").single();
  const { data, error } = await query;
  if (error) return { error: error.message };
  return { id: data.id as string };
}

export async function listMatrices(
  supabase: SupabaseClient
): Promise<{ items: MatrixSummary[]; error?: string }> {
  const { data, error } = await supabase
    .from("control_matrices")
    .select("id, title, created_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) return { items: [], error: error.message };
  return { items: (data ?? []) as MatrixSummary[] };
}

export async function getMatrix(
  supabase: SupabaseClient,
  id: string
): Promise<{ item?: { id: string; title: string; source_text: string; rows: ControlRow[] }; error?: string }> {
  const { data, error } = await supabase
    .from("control_matrices")
    .select("id, title, source_text, rows")
    .eq("id", id)
    .single();
  if (error) return { error: error.message };
  return { item: data as never };
}

export async function deleteMatrix(
  supabase: SupabaseClient,
  id: string
): Promise<{ error?: string }> {
  const { error } = await supabase.from("control_matrices").delete().eq("id", id);
  return { error: error?.message };
}

/** Export CSV (separatore ; per Excel italiano), con escaping RFC 4180. */
export function toCsv(rows: ControlRow[], headers: string[]): string {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const lines = [headers.map(esc).join(";")];
  for (const r of rows) {
    lines.push(
      [r.requirement, r.control, r.owner, r.frequency, r.evidence, r.status]
        .map(esc)
        .join(";")
    );
  }
  return "﻿" + lines.join("\r\n"); // BOM per Excel
}
