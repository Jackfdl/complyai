# ComplyAI

Suite di strumenti AI per la compliance delle **PMI europee** — EU AI Act, contratti, audit trail. Progetto a **costo zero** (solo free tier permanenti), sviluppo **incrementale**: ogni fase è deployata e realmente usabile prima della successiva.

> ⚠️ "ComplyAI" è un **nome di lavoro**: esistono prodotti simili con nomi affini (vedi `docs/DECISIONI.md`, D1). Verifica marchio/dominio prima del lancio pubblico.

> ⚠️ ComplyAI fornisce supporto informativo e **non costituisce parere legale**.

## Stato

| Fase | Contenuto | Stato |
|------|-----------|-------|
| 0 | Scaffold + deploy online | ✅ codice pronto — in attesa di deploy |
| 1 | AI Act Compliance Checker (MVP) | 🔜 prossima |
| 2 | Altri 5 moduli, uno alla volta | pianificata |
| 3 | Ruoli, audit trail, guardrail, RAG | pianificata |
| 4 | Hardening, GDPR review, docs | pianificata |

Roadmap completa: [`docs/PIANO-FASI.md`](docs/PIANO-FASI.md) · Decisioni tecniche: [`docs/DECISIONI.md`](docs/DECISIONI.md)

## Stack

- **Next.js 16** (App Router, TypeScript) — frontend **e** API route: nessun backend separato
- **Tailwind CSS 4** — design minimale professionale
- **Vercel** (hosting, piano Hobby) · **Supabase** (Postgres + Auth + Storage + pgvector, dalla Fase 1)
- **LLM**: nessuno in Fase 1 (motore a regole deterministico con citazioni normative); opzioni a costo zero valutate quando servirà

## Requisiti

- [Node.js](https://nodejs.org) LTS (≥ 20)
- [Git](https://git-scm.com)

## Sviluppo locale

```bash
npm install
npm run dev
# apri http://localhost:3000
```

> 💡 **Windows + OneDrive**: lavora su una copia **fuori** da OneDrive (es. `C:\dev\complyai`). `node_modules` contiene decine di migliaia di file: OneDrive li sincronizza e blocca, rallentando tutto.

Verifica API: `http://localhost:3000/api/health` → `{ "stato": "ok" }`

## Build di produzione

```bash
npm run build
npm start
```

## Deploy (Vercel)

1. Push del repo su GitHub.
2. Su [vercel.com](https://vercel.com): **Add New → Project → Import** del repo.
3. Nessuna configurazione necessaria (framework rilevato automaticamente) → **Deploy**.
4. Verifica l'URL `*.vercel.app` e l'endpoint `/api/health`.

Ogni push su `main` rideploya automaticamente (CI minima inclusa, richiesta dalla Fase 0).

## Struttura

```
complyai/
├── app/
│   ├── api/health/route.ts   # health check API
│   ├── globals.css           # Tailwind v4
│   ├── layout.tsx            # layout root (lang=it, metadata)
│   └── page.tsx              # landing con roadmap moduli
├── docs/
│   ├── PIANO-FASI.md         # roadmap dettagliata fasi 0–4
│   └── DECISIONI.md          # registro decisioni (ADR)
├── next.config.ts
├── postcss.config.mjs
├── package.json
└── tsconfig.json
```
