// Persistenza degli assessment su Supabase (Sprint 1.2).
// Le RLS policies garantiscono che ogni utente veda solo i propri dati;
// i trigger del database scrivono automaticamente su audit_log (append-only),
// quindi il client non può "dimenticarsi" di tracciare creazioni/modifiche/eliminazioni.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CheckerAnswers, ClassificationResult, ObligationStatus } from "./types";

export interface AssessmentPayload {
  systemName: string;
  answers: CheckerAnswers;
  result: ClassificationResult;
  statuses: Record<string, ObligationStatus>;
  owners: Record<string, string>;
  dues: Record<string, string>;
}

export interface SavedAssessmentSummary {
  id: string;
  system_name: string;
  level: string;
  created_at: string;
  updated_at: string;
}

export interface SavedAssessment extends SavedAssessmentSummary {
  answers: CheckerAnswers;
  statuses: Record<string, ObligationStatus>;
  owners: Record<string, string>;
  dues: Record<string, string>;
}

interface AssessmentRow {
  id: string;
  system_name: string;
  level: string;
  created_at: string;
  updated_at: string;
  answers: CheckerAnswers;
  statuses: {
    statuses?: Record<string, ObligationStatus>;
    owners?: Record<string, string>;
    dues?: Record<string, string>;
  } | null;
}

export async function saveAssessment(
  supabase: SupabaseClient,
  payload: AssessmentPayload,
  existingId?: string
): Promise<{ id?: string; error?: string }> {
  const row = {
    system_name: payload.systemName || "—",
    level: payload.result.level,
    answers: payload.answers,
    result: payload.result,
    statuses: {
      statuses: payload.statuses,
      owners: payload.owners,
      dues: payload.dues,
    },
  };
  const query = existingId
    ? supabase.from("assessments").update(row).eq("id", existingId).select("id").single()
    : supabase.from("assessments").insert(row).select("id").single();
  const { data, error } = await query;
  if (error) return { error: error.message };
  return { id: data.id as string };
}

export async function listAssessments(
  supabase: SupabaseClient
): Promise<{ items: SavedAssessmentSummary[]; error?: string }> {
  const { data, error } = await supabase
    .from("assessments")
    .select("id, system_name, level, created_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) return { items: [], error: error.message };
  return { items: (data ?? []) as SavedAssessmentSummary[] };
}

export async function getAssessment(
  supabase: SupabaseClient,
  id: string
): Promise<{ item?: SavedAssessment; error?: string }> {
  const { data, error } = await supabase
    .from("assessments")
    .select("id, system_name, level, created_at, updated_at, answers, statuses")
    .eq("id", id)
    .single();
  if (error) return { error: error.message };
  const row = data as unknown as AssessmentRow;
  return {
    item: {
      id: row.id,
      system_name: row.system_name,
      level: row.level,
      created_at: row.created_at,
      updated_at: row.updated_at,
      answers: row.answers,
      statuses: row.statuses?.statuses ?? {},
      owners: row.statuses?.owners ?? {},
      dues: row.statuses?.dues ?? {},
    },
  };
}

export async function deleteAssessment(
  supabase: SupabaseClient,
  id: string
): Promise<{ error?: string }> {
  const { error } = await supabase.from("assessments").delete().eq("id", id);
  return { error: error?.message };
}

/** Log manuale per eventi client-side non coperti dai trigger DB (es. export). */
export async function logEvent(
  supabase: SupabaseClient,
  action: string,
  entity: string,
  entityId: string,
  details?: Record<string, unknown>
): Promise<void> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return; // eventi anonimi non tracciabili per-utente
  await supabase.from("audit_log").insert({
    actor: data.user.id,
    action,
    entity,
    entity_id: entityId,
    details: details ?? {},
  });
}
