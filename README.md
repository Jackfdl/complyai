# ComplyAI

Suite di strumenti AI per la compliance delle **PMI europee** — EU AI Act, contratti, audit trail. Progetto a **costo zero** (solo free tier permanenti), sviluppo **incrementale**: ogni fase è deployata e realmente usabile prima della successiva.

> ⚠️ "ComplyAI" è un **nome di lavoro**: esistono prodotti simili con nomi affini (vedi `docs/DECISIONI.md`, D1). Verifica marchio/dominio prima del lancio pubblico.

> ⚠️ ComplyAI fornisce supporto informativo e **non costituisce parere legale**.

## Stato

| Fase | Contenuto | Stato |
|------|-----------|-------|
| 0 | Scaffold + deploy online + bilingue IT/EN | ✅ **online**: [complyai-mu.vercel.app](https://complyai-mu.vercel.app) |
| 1 | AI Act Compliance Checker (MVP) | 🔨 **beta online** su `/it/checker` e `/en/checker` · account, salvataggio e audit log via Supabase |
| 2 | Altri 5 moduli, uno alla volta | 🔨 2.1 Watcher `/it/watcher` · 2.2 Deadline Tracker `/it/deadlines` · 2.3 Policy-to-Controls Mapper `/it/mapper` (AI Mistral + fallback euristico) — tutti **beta** |
| 3 | Ruoli, audit trail, guardrail, RAG | pianificata |
| 4 | Hardening, GDPR review, docs | pianificata |

Roadmap completa: [`docs/PIANO-FASI.md`](docs/PIANO-FASI.md) · Decisioni tecniche: [`docs/DECISIONI.md`](docs/DECISIONI.md)

**Documentazione pubblica** (come funziona, FAQ, alternative più complete): [`/it/about`](https://complyai-mu.vercel.app/it/about) · **Privacy** (GDPR, con cancellazione account self-service): [`/it/privacy`](https://complyai-mu.vercel.app/it/privacy) · Contributi e segnalazioni: [LinkedIn — Giacomo Fedeli](https://www.linkedin.com/in/giacomo-fedeli-277765239/) o le issue di questo repo.

## Stack

- **Next.js 16** (App Router, TypeScript) — frontend **e** API route: nessun backend separato
- **Tailwind CSS 4** — design minimale professionale
- **i18n leggero senza dipendenze** — IT (default, `/it`) + EN (`/en`), dizionari in `messages/` (vedi `docs/DECISIONI.md`, D7)
- **Vercel** (hosting, piano Hobby) · **Supabase** (Postgres + Auth + Storage + pgvector, dalla Fase 1)
- **LLM**: nessuno in Fase 1 (motore a regole deterministico con citazioni normative); opzioni a costo zero valutate quando servirà

## Requisiti

- [Node.js](https://nodejs.org) LTS (≥ 20)
- [Git](https://git-scm.com)

## Sviluppo locale

```bash
npm install
npm run dev
# apri http://localhost:3000  (redirect a /it; inglese su /en)

npm test   # test del motore di classificazione del Checker (vitest)
```

### Variabili d'ambiente (facoltative in sviluppo)

Senza configurazione l'app funziona in modalità anonima (nessun salvataggio). Per abilitare account e salvataggi: copia `.env.local.example` in `.env.local` e segui [`docs/SETUP-SUPABASE.md`](docs/SETUP-SUPABASE.md).

> 💡 **Windows + OneDrive**: lavora su una copia **fuori** da OneDrive (es. `C:\dev\complyai`). `node_modules` contiene decine di migliaia di file: OneDrive li sincronizza e blocca, rallentando tutto.

Verifica API: `http://localhost:3000/api/health` → `{ "status": "ok" }`

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
│   ├── [locale]/             # route localizzate (it | en)
│   │   ├── checker/          # modulo 1: AI Act Compliance Checker (beta)
│   │   ├── layout.tsx        # layout root (lang dinamico, metadata localizzati)
│   │   └── page.tsx          # landing con roadmap moduli e switch lingua
│   ├── api/health/route.ts   # health check API
│   └── globals.css           # Tailwind v4 + stili di stampa report
├── lib/
│   ├── checker/              # dominio Checker: content (citazioni), engine (regole pure), test
│   └── i18n.ts               # locales, tipi e dizionari
├── messages/
│   ├── it.json               # contenuti italiano (lingua di riferimento)
│   └── en.json               # contenuti inglese
├── docs/
│   ├── PIANO-FASI.md         # roadmap dettagliata fasi 0–4
│   ├── FONTI-NORMATIVE.md    # fonti del Checker e stato di verifica
│   └── DECISIONI.md          # registro decisioni (ADR)
├── next.config.ts            # redirect / → /it
├── postcss.config.mjs
├── package.json
└── tsconfig.json
```
