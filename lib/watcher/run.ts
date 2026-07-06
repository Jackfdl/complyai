// Esecuzione del Regulation Watcher: fetch fonti → parse → tag → dedupe → insert.
// Gira server-side (API route schedulata) con la service role key: mai nel browser.
import type { SupabaseClient } from "@supabase/supabase-js";
import { parseFeed } from "./parse";
import { SOURCES } from "./sources";
import { isRelevant, tagItem } from "./tags";

export interface RunStats {
  ok: boolean;
  sources: { id: string; fetched: number; inserted: number; error?: string }[];
  startedAt: string;
  finishedAt: string;
}

export async function runWatcher(admin: SupabaseClient): Promise<RunStats> {
  const startedAt = new Date().toISOString();
  const stats: RunStats["sources"] = [];

  for (const source of SOURCES) {
    try {
      const res = await fetch(source.url, {
        headers: { "user-agent": "ComplyAI RegulationWatcher/0.1 (+https://complyai-mu.vercel.app)" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        stats.push({ id: source.id, fetched: 0, inserted: 0, error: `HTTP ${res.status}` });
        continue;
      }
      const xml = await res.text();
      const items = parseFeed(xml).slice(0, 50); // prudenza: max 50 per run/fonte

      let inserted = 0;
      for (const item of items) {
        const tags = tagItem(item.title, item.summary);
        // upsert con ignoreDuplicates: il vincolo unique su (source, guid) deduplica
        const { error, data } = await admin
          .from("watch_items")
          .upsert(
            {
              source: source.id,
              guid: item.guid,
              title: item.title,
              url: item.url,
              summary: item.summary,
              published_at: item.publishedAt,
              tags,
              relevant: isRelevant(tags),
            },
            { onConflict: "source,guid", ignoreDuplicates: true }
          )
          .select("id");
        if (!error && data && data.length > 0) inserted += 1;
      }
      stats.push({ id: source.id, fetched: items.length, inserted });
    } catch (e) {
      stats.push({
        id: source.id,
        fetched: 0,
        inserted: 0,
        error: e instanceof Error ? e.message : "unknown error",
      });
    }
  }

  const result: RunStats = {
    ok: stats.every((s) => !s.error),
    sources: stats,
    startedAt,
    finishedAt: new Date().toISOString(),
  };

  await admin.from("watch_runs").insert({ ok: result.ok, stats: result });
  return result;
}
