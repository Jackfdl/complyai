# Registro decisioni (ADR-lite)

Formato: decisione, motivazione, alternative scartate, rischi/caveat. Aggiornato ad ogni scelta rilevante.

## D1 — Nome: "ComplyAI" come nome di lavoro (6 lug 2026)

**Decisione**: l'utente ha scelto "ComplyAI"; adottato come *working title*.

**Caveat serio — spazio nomi affollato**: esistono già [ComplyAI di Comply.com](https://www.comply.com/solutions/firm-compliance/complyai/) (RegTech USA, MCP server lanciato apr 2026), [complyai.solutions](https://www.complyai.solutions/) (governance AI), [comply-ai.site](https://comply-ai.site/) (proprio EU AI Act compliance), oltre a complai.com, gocomply.ai, aicomply.ai, compliance.ai. Rischio: confondibilità di marchio nello **stesso settore** e SEO quasi impossibile.

**Azione richiesta prima del lancio pubblico**: ricerca su [tmview (EUIPO)](https://www.tmdn.org/tmview/) classi Nizza 9/42/45 + verifica domini. Rinominare in Fase 0–1 costa minuti; dopo, molto di più. Alternative già vagliate e libere da collisioni note: **NormaChiara**, **Cardine**.

**Aggiornamento 6 lug 2026**: nome riconfermato dall'utente come working title, con dichiarata ambizione internazionale → interfaccia bilingue IT/EN (vedi D7). Il caveat marchio resta aperto.

## D2 — Architettura: Next.js full-stack su Vercel, nessun backend separato (6 lug 2026)

**Decisione**: API route di Next.js al posto di FastAPI/Express su hosting separato.

**Motivazione**: un solo deploy, un solo free tier, zero cold start di servizi terzi, meno superficie di configurazione per un utente alle prime armi con il deploy. Python non è necessario in Fase 1 (motore a regole in TypeScript).

**Alternative scartate**: Render free (spin-down con cold start ~50s), Railway (non più free permanente: solo crediti una tantum), Fly.io (free tier non più disponibile per nuove organizzazioni). Se in futuro servirà Python (parsing documenti avanzato), si valuterà un worker separato.

## D3 — Hosting e dati: Vercel Hobby + Supabase Free (6 lug 2026)

**Decisione**: Vercel (piano Hobby) per l'app; Supabase Free per Postgres + Auth + Storage + pgvector (dalla Fase 1).

**Caveat 1 — Vercel Hobby è solo per uso non commerciale** ([fair use policy](https://vercel.com/docs/limits/fair-use-guidelines)): accettabile finché ComplyAI è gratuito e senza ricavi. **Trigger di migrazione**: qualsiasi monetizzazione → Vercel Pro ($20/mese) o migrazione a Cloudflare Workers/Pages (free tier che consente uso commerciale, via adapter OpenNext).

**Caveat 2 — Supabase Free va in pausa dopo ~7 giorni senza attività DB** ([docs](https://supabase.com/docs/guides/platform/free-project-pausing)); riattivazione manuale dal dashboard. **Mitigazione**: dal modulo Regulation Watcher (Fase 2.1) un job schedulato giornaliero scrive sul DB (uso legittimo, non keep-alive fittizio). Fino ad allora: uso settimanale reale o riattivazione manuale documentata.

**Alternativa pronta**: Neon (Postgres serverless, auto-resume senza pausa manuale) + Auth.js, se la pausa Supabase diventasse un problema operativo.

## D4 — LLM: motore a regole in Fase 1, LLM solo dove indispensabile (6 lug 2026)

**Decisione**: la classificazione del rischio AI Act è implementata come questionario + regole deterministiche con citazioni normative puntuali. Nessuna inferenza LLM nell'MVP.

**Motivazione**: costo zero garantito, nessuna allucinazione su materia legale (prudenza richiesta), output riproducibile e auditabile — un vantaggio di prodotto, non un ripiego. L'LLM entra dalla Fase 2.3 (Policy Mapper) con decisione esplicita sull'opzione: Ollama locale / free tier API / abbonamento esistente in copy-paste; mai API a pagamento senza conferma esplicita dell'utente.

## D5 — Versioni bloccate (6 lug 2026)

next 16.2.10 · react/react-dom 19.2.7 · tailwindcss + @tailwindcss/postcss 4.3.2 · typescript 5.9.3 · @types/node ^22 (allineato al runtime Node 22). Motivo: build riproducibile; upgrade deliberati, non impliciti.

## D6 — Date AI Act post-Omnibus (6 lug 2026)

Il piano assume le scadenze modificate dall'Omnibus digitale (Annex III → 2 dic 2027; Annex I → 2 ago 2028; via libera finale Consiglio 29 giu 2026 — fonti: [Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/), [Sidley](https://datamatters.sidley.com/2026/06/22/eu-lawmakers-reach-provisional-agreement-to-delay-key-eu-ai-act-obligations/), [White & Case](https://www.whitecase.com/insight-alert/eu-agrees-digital-omnibus-deal-simplify-ai-rules)). **Assunzione da verificare** alla pubblicazione in GU UE; il contenuto normativo del Checker andrà validato su [EUR-Lex](https://eur-lex.europa.eu) e, idealmente, da revisione legale professionale prima del rilascio.

## D7 — i18n bilingue senza librerie (6 lug 2026)

**Decisione**: internazionalizzazione fatta in casa (~35 righe in `lib/i18n.ts`): route `app/[locale]/`, dizionari JSON in `messages/`, redirect `/` → `/it`, `dynamicParams = false` (lingue ignote → 404), `<html lang>` e metadata corretti per lingua.

**Motivazione**: con 2 sole lingue e zero bisogno di rilevamento automatico, una libreria (next-intl) aggiungerebbe middleware e dipendenze senza benefici proporzionati. La struttura `[locale]` è comunque quella standard: migrare a next-intl in futuro sarà un'evoluzione, non una riscrittura.

**Convenzioni**: codice, chiavi e identificatori in **inglese**; contenuti UI nei dizionari; l'**italiano è la lingua di riferimento** (`type Messages = typeof it` — se l'inglese diverge nelle chiavi, TypeScript blocca la build). Contenuti normativi del Checker: prima IT, poi EN. Rimandati a Fase 4: hreflang/sitemap, rilevamento lingua browser.

## D8 — Workflow di sviluppo con agente (6 lug 2026)

**Decisione**: il repo di lavoro è `C:\dev\...\complyai` (montato nella sessione Cowork). L'agente modifica i file e verifica la build in sandbox; l'utente rivede in locale (`npm run dev`), poi esegue **commit e push** (deploy automatico Vercel). L'agente non committa: la storia git resta interamente dell'utente.

**Nota**: la copia su OneDrive è dismessa (file segnaposto lasciato in loco). Identità git globale configurata (`Jackfdl` / email personale); il primo commit porta l'email istituzionale auto-rilevata — fix opzionale documentato in chat. Connector Vercel attivo per monitoraggio deploy e log.

## D9 — Checker: contenuti normativi versionati e "date-flag" Omnibus (6 lug 2026)

**Decisione**: i contenuti normativi vivono in `lib/checker/content.ts` con `CONTENT_VERSION` esplicita, citazione puntuale per ogni voce e flag `pendingOmnibus` sulle date/regole che derivano dall'Omnibus non ancora in GU. Il motore (`engine.ts`) è a funzioni pure e coperto da test (`engine.test.ts`), che fissano i comportamenti normativi critici: divieti che prevalgono su tutto, profilazione che annulla la deroga 6(3), trasparenza che si somma senza abbassare l'alto rischio, differenziazione obblighi provider/deployer.

**Motivazione**: in materia legale la riproducibilità vale più della brillantezza: stessa domanda → stessa risposta → stessa citazione. I test rendono le regole falsificabili e ogni futura modifica dei contenuti verificabile. Il flag Omnibus evita l'errore più insidioso del momento: presentare come vigenti date che vincolano solo dopo la pubblicazione in GU.

**Limiti accettati (v0.1.0-beta)**: eccezioni art. 5 e confini art. 6(3) trattati con note prudenziali; GPAI solo come rinvio; EN non ancora tradotto (avviso onesto su /en/checker). Revisione legale professionale prima dell'uscita dalla beta — elencato in `FONTI-NORMATIVE.md`.
