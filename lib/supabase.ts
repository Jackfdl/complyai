// Client Supabase (browser) con degradazione elegante:
// se le variabili d'ambiente non sono configurate, l'app funziona comunque
// e le funzioni di salvataggio/account restano semplicemente nascoste.
// Sicurezza: la anon key è pubblica by design; i dati sono protetti dalle
// Row Level Security policies definite in docs/SETUP-SUPABASE.md (D10).
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/** Restituisce il client Supabase, o null se l'ambiente non è configurato. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(url as string, anonKey as string);
  }
  return client;
}
