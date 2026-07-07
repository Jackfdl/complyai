# ComplyAI — Piano delle fasi

Metodo: **incrementale**. Ogni fase termina solo quando il risultato è **deployato e realmente usabile**. Al termine di ogni fase: checklist "Cosa devi fare tu" per le azioni manuali dell'utente.

## Contesto normativo (aggiornato al 6 luglio 2026)

Il pacchetto **Omnibus digitale UE** (accordo provvisorio 7 maggio 2026, Parlamento 16 giugno, via libera finale del Consiglio 29 giugno 2026) ha modificato il calendario dell'AI Act:

| Obbligo | Scadenza originale | Nuova scadenza |
|---|---|---|
| Sistemi alto rischio **stand-alone (Annex III)** | 2 ago 2026 | **2 dic 2027** |
| AI in **prodotti regolamentati (Annex I)** | 2 ago 2027 | **2 ago 2028** |
| Divieti (art. 5) e AI literacy | in vigore da feb 2025 | invariati |
| Obblighi GPAI | in vigore da ago 2025 | invariati |

⚠️ **Assunzione da verificare**: pubblicazione in Gazzetta Ufficiale UE attesa entro il 2 ago 2026 ma, alla data odierna, da confermare. Il modulo Regulation Watcher (Fase 2) nasce esattamente per intercettare questi aggiornamenti. Prima del rilascio del Checker: ricontrollo su EUR-Lex + revisione legale professionale consigliata.

**Implicazione di prodotto**: il rinvio non riduce il bisogno — lo aumenta. Le PMI ora devono capire *quale* calendario si applica a loro. Il Checker parte da qui.

---

## Fase 0 — Setup e deploy ✅ (completata il 6 lug 2026)

**Obiettivo**: piattaforma online da subito, pipeline di deploy automatica.

Deliverable:
- [x] Scaffold Next.js 16 + TypeScript + Tailwind 4
- [x] Landing page (roadmap trasparente, disclaimer legale)
- [x] API route di health check (`/api/health`)
- [x] README + piano fasi + registro decisioni
- [x] Repo GitHub ([Jackfdl/complyai](https://github.com/Jackfdl/complyai)) + deploy Vercel: **[complyai-mu.vercel.app](https://complyai-mu.vercel.app)**
- [x] *(estensione post-fase)* Sito bilingue IT/EN con i18n senza dipendenze (D7)

**Exit criteria**: ✅ URL pubblico raggiungibile; push su `main` → rideploy automatico.

## Fase 1 — MVP: AI Act Compliance Checker

**Obiettivo**: primo modulo end-to-end realmente utile, **senza LLM** (motore a regole deterministico, citazioni puntuali di articoli/allegati).

Contenuto:
1. **Questionario guidato** (wizard multi-step): descrizione del sistema AI usato dall'azienda — ruolo (provider/deployer), finalità, settore, dati trattati, interazione con persone.
2. **Motore a regole di classificazione**: pratiche vietate (art. 5) → alto rischio (Annex III, con eccezioni art. 6(3)) → rischio limitato/trasparenza (art. 50) → minimo. Ogni esito cita la fonte normativa.
3. **Checklist obblighi** applicabili (es. artt. 9–15 per alto rischio) con stato: conforme / parziale / mancante.
4. **Report "AI System Risk Assessment"**: classificazione + gap + piano d'azione prioritizzato (placeholder owner/scadenza), esportabile.
5. Persistenza su **Supabase** (Postgres) + autenticazione base (email) + tabella `audit_log` append-only fin da subito (fondamenta del modulo 4).

Fuori scope Fase 1: upload/analisi PDF di policy (richiede LLM → Fase 2), ruoli avanzati, RAG.

**Sprint interni** (ognuno deployato):
- **Sprint 1.1 — Checker anonimo** ✅ (6 lug 2026): wizard 7 passi + motore a regole deterministico testato (vitest) + report stampabile/JSON. Nessun account, nessun dato lato server. Contenuti normativi IT v0.1.0-beta aggiornati all'Omnibus (fonti e limiti in `FONTI-NORMATIVE.md`); su /en avviso onesto con rimando alla versione italiana.
- **Sprint 1.2 — Persistenza + EN** ✅ (6 lug 2026, in attesa di config Supabase utente): Supabase con RLS per-utente, salvataggio/aggiornamento assessment, `audit_log` append-only con trigger DB automatici (revoke + trigger di immutabilità), dashboard "Le mie valutazioni", auth email+password senza conferma (beta). Checker tradotto in EN (stessi id, caveat di revisione) — `/en/checker` ora serve il wizard vero. Setup: `docs/SETUP-SUPABASE.md`.

**Exit criteria**: una PMI reale può completare il questionario online e scaricare un report corretto e citato.

## Fase 2 — Moduli rimanenti, uno alla volta

Ordine proposto (complessità crescente, ogni modulo deployato prima del successivo):

| # | Modulo | Perché in questa posizione |
|---|--------|---------------------------|
| 2.1 | **Regulation Watcher** ✅ (6 lug 2026) | Feed verificati: EUR-Lex GU serie L, Commissione/AI Office, EDPB. Cron Vercel giornaliero → `/api/watcher/run` (CRON_SECRET) → tagging deterministico per keyword → digest pubblico su `/[locale]/watcher`. Il run giornaliero tiene attivo il DB Supabase. Valutazione d'impatto per profilo azienda: rimandata (richiede profili, Fase 3) |
| 2.2 | **Legal Deadline Tracker** ✅ (6 lug 2026) | Scadenzario per-utente su `/[locale]/deadlines`: stati automatici (in ritardo / entro 30 gg / future / completate), export **.ics** per Google/Outlook/Apple Calendar, audit automatico via trigger DB. Reminder e-mail rimandati a Fase 3 (limiti SMTP free tier, D13); si aggancerà al modulo 5 |
| 2.3 | **Policy-to-Controls Mapper** ✅ (7 lug 2026) | Primo modulo con LLM: scelta utente = **API free tier** → Mistral Experiment (UE, opt-out training obbligatorio) via endpoint OpenAI-compatibile configurabile. Analisi AI server-side per utenti autenticati + **fallback euristico deterministico** sempre disponibile (anche anonimo, nulla lascia il browser). Matrice editabile → CSV/stampa/salvataggio con audit (D14) |
| 2.4 | **Contract Review Agent** ✅ (7 lug 2026) | Il più complesso. Estrazione testo **nel browser** (PDF via pdfjs-dist, DOCX via mammoth): il contratto non lascia il PC salvo analisi AI esplicita. Libreria clausole v1 **curata e versionata** con pattern deterministici IT/EN → clausole trovate, protezioni mancanti, date/finestre chiave; analisi AI opzionale (Mistral) con fallback locale. **Prima integrazione fra moduli**: date chiave → un click → Scadenzario. Memo salvato (non il contratto) con RLS + audit. **RAG pgvector rimandato a Fase 3** (D15) |
| 2.5 | **Audit Trail Builder** ✅ (7 lug 2026) | Ultimo modulo → **suite completa 6/6**. UI di consultazione su `/[locale]/audit` dell'`audit_log` append-only già popolato dai trigger DB di tutti i moduli (assessment/deadline/contract_review/matrix · created/updated/deleted): filtri per modulo/azione/testo, sintesi leggibile di prev/new state, export **CSV/JSON** per revisori esterni. Sola lettura (RLS: ognuno vede solo le proprie righe; log immutabile). Nessun nuovo SQL. Logica pura testata (D16) |

## Fase 3 — Hardening trasversale

Ruoli e approvazioni (analyst / reviewer / admin con matrice permessi), audit trail completo con UI di consultazione ed export, guardrail espliciti (cosa l'agente fa in autonomia vs conferma umana; mai inviare comunicazioni esterne; mai eliminare audit log; mai certezza legale assoluta), template strutturati riutilizzabili, knowledge base/RAG rifinita su tutti i moduli.

## Fase 4 — Rifinitura e security review

Design finale, gestione errori, documentazione utente, security & GDPR review del prodotto stesso (registro trattamenti, data retention, informativa privacy — il prodotto tratta documenti aziendali sensibili), case study per LinkedIn.

---

## Cosa devi fare tu — Fase 0 ✅ (tutto completato il 6 lug 2026)

Checklist storica, conservata per riferimento:

1. Verifica nome (Google + [EUIPO/tmview](https://www.tmdn.org/tmview/) + disponibilità dominio) — "ComplyAI" è affollato, vedi `DECISIONI.md` D1.
2. Installa **Node.js LTS** da [nodejs.org](https://nodejs.org) (installer Windows, opzioni predefinite).
3. Installa **Git** da [git-scm.com/download/win](https://git-scm.com/download/win) (opzioni predefinite).
4. Crea account **GitHub** ([github.com](https://github.com) → Sign up).
5. Copia la cartella `complyai` **fuori da OneDrive** (es. `C:\dev\complyai`).
6. Test locale: `npm install` poi `npm run dev` → apri http://localhost:3000.
7. Crea il repository su GitHub (nome `complyai`, **Public** consigliato per il portfolio, senza file iniziali).
8. Primo push (comandi nella risposta dell'agente).
9. Crea account **Vercel** con "Continue with GitHub" → Import del repo → Deploy.
10. Verifica l'URL pubblico e `/api/health`, poi comunica l'URL all'agente.
