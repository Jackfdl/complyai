// Fonti ufficiali monitorate dal Regulation Watcher (tutte gratuite, RSS pubblici).
// Verificate il 6 lug 2026. Aggiungere fonti = aggiungere una riga qui.

export interface WatchSource {
  id: string;
  name: string;
  url: string;
  homepage: string;
}

export const SOURCES: WatchSource[] = [
  {
    id: "eurlex-oj-l",
    name: "EUR-Lex — Atti della Gazzetta Ufficiale UE (serie L)",
    url: "https://eur-lex.europa.eu/EN/display-feed.rss?rssId=222",
    homepage: "https://eur-lex.europa.eu/oj/daily-view/L-series/default.html",
  },
  {
    id: "ec-digital",
    name: "Commissione Europea — Digital Strategy / AI Office",
    url: "https://digital-strategy.ec.europa.eu/en/rss.xml",
    homepage: "https://digital-strategy.ec.europa.eu/en",
  },
  {
    id: "edpb",
    name: "EDPB — European Data Protection Board",
    url: "https://www.edpb.europa.eu/feed/news_en",
    homepage: "https://www.edpb.europa.eu/news/news_en",
  },
];
