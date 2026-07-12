// Cancellazione account self-service (GDPR art. 17) — D18.
// Flusso: verifica identità con il token utente → audit "account.deleted" →
// eliminazione utente (i dati collegati cadono via ON DELETE CASCADE).
// Il registro audit resta, pseudonimo: l'UUID non è più riconducibile a una persona.
// Richiede i trigger tolleranti di SETUP-SUPABASE.md §11 (auth.uid() è nullo nel cascade).
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 30;

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) {
    return Response.json({ error: "not configured" }, { status: 503 });
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return Response.json({ error: "unauthorized" }, { status: 401 });
  const client = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error: authError } = await client.auth.getUser(token);
  if (authError || !data.user) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createClient(url, service, { auth: { persistSession: false } });

  // Traccia PRIMA di cancellare (dopo non esisterebbe più l'attore).
  await admin.from("audit_log").insert({
    actor: data.user.id,
    action: "account.deleted",
    entity: "auth.users",
    entity_id: data.user.id,
    details: { requested_by: "self-service" },
  });

  const { error } = await admin.auth.admin.deleteUser(data.user.id);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ ok: true });
}
