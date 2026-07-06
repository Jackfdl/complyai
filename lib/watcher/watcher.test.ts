import { describe, expect, it } from "vitest";
import { parseFeed } from "./parse";
import { isRelevant, tagItem } from "./tags";

const RSS_FIXTURE = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>Test</title>
  <item>
    <title>Regulation amending the Artificial Intelligence Act published</title>
    <link>https://example.eu/act-1</link>
    <guid>act-1</guid>
    <description>&lt;p&gt;The Digital &lt;b&gt;Omnibus&lt;/b&gt; on AI enters into force.&lt;/p&gt;</description>
    <pubDate>Mon, 06 Jul 2026 08:00:00 GMT</pubDate>
  </item>
  <item>
    <title>Fisheries quota decision</title>
    <link>https://example.eu/fish</link>
    <guid>fish-1</guid>
    <description>Nothing about technology.</description>
    <pubDate>Mon, 06 Jul 2026 08:00:00 GMT</pubDate>
  </item>
</channel></rss>`;

const ATOM_FIXTURE = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Atom test</title>
  <entry>
    <id>urn:1</id>
    <title>EDPB opinion on data protection and machine learning</title>
    <link href="https://example.eu/edpb-1"/>
    <summary>Guidance under the GDPR.</summary>
    <updated>2026-07-06T08:00:00Z</updated>
  </entry>
</feed>`;

describe("parseFeed", () => {
  it("estrae gli item RSS 2.0 con titolo, link, guid, data e descrizione senza HTML", () => {
    const items = parseFeed(RSS_FIXTURE);
    expect(items).toHaveLength(2);
    expect(items[0].title).toMatch(/Artificial Intelligence Act/);
    expect(items[0].url).toBe("https://example.eu/act-1");
    expect(items[0].guid).toBe("act-1");
    expect(items[0].summary).not.toMatch(/</);
    expect(items[0].publishedAt).toMatch(/^2026-07-06T/);
  });

  it("estrae le entry Atom", () => {
    const items = parseFeed(ATOM_FIXTURE);
    expect(items).toHaveLength(1);
    expect(items[0].url).toBe("https://example.eu/edpb-1");
    expect(items[0].guid).toBe("urn:1");
  });

  it("XML invalido → array vuoto, nessuna eccezione", () => {
    expect(parseFeed("non è xml <<<")).toEqual([]);
  });

  it("un solo item resta un array (isArray forzato)", () => {
    const single = RSS_FIXTURE.replace(/<item>[\s\S]*?<\/item>\s*(?=<item>)/, "");
    expect(parseFeed(single)).toHaveLength(1);
  });
});

describe("tagItem / isRelevant", () => {
  it("riconosce AI Act e Omnibus e li marca rilevanti", () => {
    const tags = tagItem(
      "Regulation amending the Artificial Intelligence Act",
      "The Digital Omnibus on AI enters into force."
    );
    expect(tags).toContain("ai-act");
    expect(tags).toContain("omnibus");
    expect(isRelevant(tags)).toBe(true);
  });

  it("GDPR taggato ma non 'rilevante' da solo", () => {
    const tags = tagItem("EDPB opinion", "Guidance under the GDPR.");
    expect(tags).toContain("gdpr");
    expect(isRelevant(tags)).toBe(false);
  });

  it("contenuti non pertinenti → nessun tag", () => {
    expect(tagItem("Fisheries quota decision", "Nothing about technology.")).toEqual([]);
  });

  it("il tagging è case-insensitive", () => {
    expect(tagItem("THE AI ACT EXPLAINED", "")).toContain("ai-act");
  });
});
