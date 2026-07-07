// Persistenza dei memo di revisione contrattuale (RLS per-utente, audit via trigger).
// Scelta privacy (D15): salviamo il MEMO (analisi), non il testo integrale del contratto.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ContractAnalysis } from "./types";

export interface ReviewSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export async function saveReview(
  supabase: SupabaseClient,
  title: string,
  analysis: ContractAnalysis,
  existingId?: string
): Promise<{ id?: string; error?: string }> {
  const row = { title: title || "—", analysis };
  const query = existingId
    ? supabase.from("contract_reviews").update(row).eq("id", existingId).select("id").single()
    : supabase.from("contract_reviews").insert(row).select("id").single();
  const { data, error } = await query;
  if (error) return { error: error.message };
  return { id: data.id as string };
}

export async function listReviews(
  supabase: SupabaseClient
): Promise<{ items: ReviewSummary[]; error?: string }> {
  const { data, error } = await supabase
    .from("contract_reviews")
    .select("id, title, created_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) return { items: [], error: error.message };
  return { items: (data ?? []) as ReviewSummary[] };
}

export async function getReview(
  supabase: SupabaseClient,
  id: string
): Promise<{ item?: { id: string; title: string; analysis: ContractAnalysis }; error?: string }> {
  const { data, error } = await supabase
    .from("contract_reviews")
    .select("id, title, analysis")
    .eq("id", id)
    .single();
  if (error) return { error: error.message };
  return { item: data as never };
}

export async function deleteReview(
  supabase: SupabaseClient,
  id: string
): Promise<{ error?: string }> {
  const { error } = await supabase.from("contract_reviews").delete().eq("id", id);
  return { error: error?.message };
}
