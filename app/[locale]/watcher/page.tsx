// Regulation Watcher — digest pubblico (rigenerato al massimo ogni ora, ISR).
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { isLocale } from "@/lib/i18n";
import { SOURCES } from "@/lib/watcher/sources";
import { getWatcherUi } from "@/lib/watcher/ui";
import { isSupabaseConfigured } from "@/lib/supabase";

export const revalidate = 3600;

interface WatchItem {
  id: string;
  source: string;
  title: string;
  url: string;
  summary: string;
  published_at: string | null;
  tags: string[];
  relevant: boolean;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = getWatcherUi(locale);
  return { title: `${ui.title} — ComplyAI`, description: ui.body };
}

async function fetchItems(): Promise<WatchItem[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  const supabase = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from("watch_items")
    .select("id, source, title, url, summary, published_at, tags, relevant")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(30);
  if (error) return null;
  return (data ?? []) as WatchItem[];
}

export default async function WatcherPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ui = getWatcherUi(locale);
  const items = isSupabaseConfigured ? await fetchItems() : null;
  const dateLocale = locale === "it" ? "it-IT" : "en-GB";
  const sourceName = (id: string) => SOURCES.find((s) => s.id === id)?.name ?? id;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <Link href={`/${locale}`} className="text-sm text-slate-500 hover:text-slate-900">
          {ui.backHome}
        </Link>
      </header>

      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-indigo-600">
        {ui.kicker}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{ui.title}</h1>
      <p className="mt-4 leading-relaxed text-slate-600">{ui.body}</p>
      <p className="mt-2 text-xs text-slate-400">{ui.updatedDaily}</p>

      {items === null ? (
        <p className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          {ui.notConfigured}
        </p>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="font-medium text-slate-900">{ui.emptyTitle}</p>
          <p className="mt-1 text-sm text-slate-600">{ui.emptyBody}</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`rounded-xl border p-4 ${
                item.relevant
                  ? "border-indigo-300 bg-indigo-50/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                {item.relevant && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {ui.relevantBadge}
                  </span>
                )}
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600"
                  >
                    {ui.tagLabels[t] ?? t}
                  </span>
                ))}
                {item.published_at && (
                  <span className="ml-auto text-xs text-slate-400">
                    {new Date(item.published_at).toLocaleDateString(dateLocale)}
                  </span>
                )}
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block font-medium text-slate-900 hover:text-indigo-700"
              >
                {item.title}
              </a>
              {item.summary && (
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.summary}</p>
              )}
              <p className="mt-2 text-xs text-slate-400">
                {ui.sourceLabel}: {sourceName(item.source)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
