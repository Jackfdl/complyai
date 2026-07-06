// Parsing RSS 2.0 / Atom → FeedItem normalizzati. Deterministico, testato in watcher.test.ts.
import { XMLParser } from "fast-xml-parser";

export interface FeedItem {
  guid: string;
  title: string;
  url: string;
  summary: string;
  publishedAt: string | null; // ISO
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  // I feed possono avere un solo <item>/<entry>: forziamo sempre l'array.
  isArray: (name) => name === "item" || name === "entry",
});

function text(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  if (v && typeof v === "object" && "#text" in (v as Record<string, unknown>)) {
    return text((v as Record<string, unknown>)["#text"]);
  }
  return "";
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function toIso(v: unknown): string | null {
  const s = text(v);
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseFeed(xml: string): FeedItem[] {
  let doc: any;
  try {
    doc = parser.parse(xml);
  } catch {
    return [];
  }
  const items: FeedItem[] = [];

  // RSS 2.0: rss.channel.item[]
  const rssItems: any[] = doc?.rss?.channel?.item ?? [];
  for (const it of rssItems) {
    const link = text(it.link) || text(it.guid);
    const title = stripHtml(text(it.title));
    if (!title || !link) continue;
    items.push({
      guid: text(it.guid) || link,
      title,
      url: link,
      summary: stripHtml(text(it.description)).slice(0, 500),
      publishedAt: toIso(it.pubDate ?? it["dc:date"]),
    });
  }

  // Atom: feed.entry[]
  const atomEntries: any[] = doc?.feed?.entry ?? [];
  for (const e of atomEntries) {
    const linkNode = Array.isArray(e.link) ? e.link[0] : e.link;
    const link = text(linkNode?.["@_href"]) || text(linkNode);
    const title = stripHtml(text(e.title));
    if (!title || !link) continue;
    items.push({
      guid: text(e.id) || link,
      title,
      url: link,
      summary: stripHtml(text(e.summary) || text(e.content)).slice(0, 500),
      publishedAt: toIso(e.updated ?? e.published),
    });
  }

  return items;
}
