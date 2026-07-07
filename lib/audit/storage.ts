// Lettura dell'audit_log (append-only). RLS: l'utente vede solo le proprie righe
// (auth.uid() = actor). Nessuna scrittura/aggiornamento: il registro è immutabile (D10).
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuditRecord } from "./logic";

export async function listAudit(
  supabase: SupabaseClient,
  limit = 500
): Promise<{ items: AuditRecord[]; error?: string }> {
  const { data, error } = await supabase
    .from("audit_log")
    .select("id, at, action, entity, entity_id, details, prev_state, new_state")
    .order("at", { ascending: false })
    .limit(limit);
  if (error) return { items: [], error: error.message };
  return { items: (data ?? []) as AuditRecord[] };
}
