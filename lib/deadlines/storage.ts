// CRUD del Legal Deadline Tracker su Supabase.
// RLS per-utente; audit automatico via trigger DB (come per assessments, D10).
import type { SupabaseClient } from "@supabase/supabase-js";
import type { DeadlineRecord } from "./logic";

export interface NewDeadline {
  title: string;
  due_date: string; // YYYY-MM-DD
  category?: string;
  notes?: string;
}

export async function listDeadlines(
  supabase: SupabaseClient
): Promise<{ items: DeadlineRecord[]; error?: string }> {
  const { data, error } = await supabase
    .from("deadlines")
    .select("id, title, notes, category, due_date, completed_at, created_at, updated_at")
    .order("due_date", { ascending: true });
  if (error) return { items: [], error: error.message };
  return { items: (data ?? []) as DeadlineRecord[] };
}

export async function createDeadline(
  supabase: SupabaseClient,
  input: NewDeadline
): Promise<{ error?: string }> {
  const { error } = await supabase.from("deadlines").insert({
    title: input.title,
    due_date: input.due_date,
    category: input.category || null,
    notes: input.notes || null,
  });
  return { error: error?.message };
}

export async function setDeadlineCompleted(
  supabase: SupabaseClient,
  id: string,
  completed: boolean
): Promise<{ error?: string }> {
  const { error } = await supabase
    .from("deadlines")
    .update({ completed_at: completed ? new Date().toISOString() : null })
    .eq("id", id);
  return { error: error?.message };
}

export async function deleteDeadline(
  supabase: SupabaseClient,
  id: string
): Promise<{ error?: string }> {
  const { error } = await supabase.from("deadlines").delete().eq("id", id);
  return { error: error?.message };
}
