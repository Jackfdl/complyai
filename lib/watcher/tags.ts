// Tagging deterministico per parole chiave (niente LLM, D4): stessi input → stessi tag.
// I feed ufficiali sono in inglese: le keyword includono comunque varianti italiane.

export interface TagRule {
  id: string;
  keywords: string[];
}

export const TAG_RULES: TagRule[] = [
  {
    id: "ai-act",
    keywords: [
      "artificial intelligence act",
      "ai act",
      "2024/1689",
      "regolamento sull'intelligenza artificiale",
    ],
  },
  {
    id: "omnibus",
    keywords: ["omnibus"],
  },
  {
    id: "gpai",
    keywords: ["general-purpose ai", "general purpose ai", "gpai", "foundation model"],
  },
  {
    id: "ai",
    keywords: ["artificial intelligence", "intelligenza artificiale", " ai ", "machine learning"],
  },
  {
    id: "gdpr",
    keywords: ["gdpr", "2016/679", "data protection", "protezione dei dati", "privacy"],
  },
  {
    id: "cyber",
    keywords: ["cybersecurity", "cyber resilience", "nis2", "cibersicurezza"],
  },
];

/** Tag il cui match rende l'elemento "rilevante" per il profilo ComplyAI. */
export const RELEVANT_TAGS = new Set(["ai-act", "omnibus", "gpai"]);

export function tagItem(title: string, summary: string): string[] {
  const haystack = ` ${title.toLowerCase()} ${summary.toLowerCase()} `;
  const tags: string[] = [];
  for (const rule of TAG_RULES) {
    if (rule.keywords.some((k) => haystack.includes(k))) tags.push(rule.id);
  }
  return tags;
}

export function isRelevant(tags: string[]): boolean {
  return tags.some((t) => RELEVANT_TAGS.has(t));
}
