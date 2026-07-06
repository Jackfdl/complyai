// Esecuzione schedulata del Regulation Watcher (Vercel Cron, vedi vercel.json).
// Sicurezza: Vercel invia "Authorization: Bearer <CRON_SECRET>" se la env var esiste;
// la service role key resta solo server-side e non transita mai nel browser.
import { createClient } from "@supabase/supabase-js";
import { runWatcher } from "@/lib/watcher/run";

export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return Response.json({ error: "watcher not configured" }, { status: 503 });
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
  const stats = await runWatcher(admin);
  return Response.json(stats, { status: stats.ok ? 200 : 207 });
}
