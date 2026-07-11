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

## D10 — Persistenza e audit trail: Supabase + RLS + trigger DB (6 lug 2026)

**Decisione**: salvataggio degli assessment direttamente dal browser su Supabase (anon key pubblica by design), con sicurezza interamente lato database: RLS per-utente su `assessments` e `audit_log`; `audit_log` **append-only** tramite tre livelli (nessuna policy update/delete, `REVOKE`, trigger che solleva eccezione); audit automatico via trigger su insert/update/delete di `assessments` — il client non può aggirarlo né dimenticarlo. Regione **eu-central-1** (GDPR). Auth email+password con conferma email disattivata in beta (il servizio email del Free tier ha limiti orari; SMTP dedicato in Fase 4). Degradazione elegante: senza env var l'app resta pienamente usabile in modalità anonima.

**Motivazione**: niente backend proprio da mantenere (D2), sicurezza dichiarativa verificabile nello schema SQL (`docs/SETUP-SUPABASE.md`), e l'audit trail nasce come vincolo infrastrutturale — fondamenta reali del modulo 4 (Audit Trail Builder). Dati minimi by design: email account + payload assessment, nient'altro.

**Alternative scartate**: API route + service key (più codice e segreti server-side senza benefici a questo stadio); magic link (rate limit email del Free tier lo rende inaffidabile per una beta pubblica).

## D11 — Checker bilingue: EN pubblicato con caveat di revisione (6 lug 2026)

**Decisione**: i contenuti normativi vivono in `content-it.ts` (riferimento) e `content-en.ts` (traduzione), stessi id verificati dai test di parità; il motore è unico e `classify(answers, locale)` produce esiti identici nelle due lingue. L'EN espone in UI e nei caveat del report la dicitura "non ancora revisionato da un professionista legale; fa fede la versione italiana".

**Motivazione**: meglio un inglese utile e onestamente etichettato che un rinvio indefinito; i test di parità impediscono che le due versioni divergano strutturalmente.

## D12 — Regulation Watcher: fonti ufficiali, tagging deterministico, cron Vercel (6 lug 2026)

**Decisione**: il radar normativo legge tre feed RSS ufficiali verificati (EUR-Lex atti GU serie L `display-feed.rss?rssId=222`, Commissione [digital-strategy.ec.europa.eu/en/rss.xml](https://digital-strategy.ec.europa.eu/en/rss.xml), EDPB `feed/news_en`), applica **tag deterministici per parole chiave** (niente riassunti LLM: titoli e link originali) e salva su `watch_items` (lettura pubblica, scrittura solo service role). Esecuzione: **Vercel Cron** giornaliero (6:00 UTC) su `/api/watcher/run`, autenticato con `CRON_SECRET`; ogni run è tracciato in `watch_runs`. UI: digest bilingue su `/[locale]/watcher` con ISR oraria.

**Motivazione**: coerenza con D4 (zero LLM finché non indispensabile: un digest di fonti primarie non richiede riassunti generati, che introdurrebbero rischio di allucinazione proprio sul contenuto normativo); il run giornaliero produce attività DB reale che mitiga la pausa del Free tier (mitigazione promessa in D3). Il tag "rilevante" (ai-act/omnibus/gpai) prepara la valutazione d'impatto per profilo azienda (Fase 3) e ci avviserà della pubblicazione dell'Omnibus in GU (D6).

**Limiti accettati**: tagging keyword-based = possibili falsi negativi su titoli generici; fonti in inglese; nessuna notifica push (solo pagina) — evoluzioni in Fase 3.

## D13 — Deadline Tracker: reminder senza e-mail, export .ics (6 lug 2026)

**Decisione**: il modulo 6 (Legal Deadline Tracker) parte come scadenzario per-utente con **stati calcolati deterministicamente** dalla data (in ritardo / entro 30 giorni / future / completate — `lib/deadlines/logic.ts`, testato) e **export iCalendar (.ics)** generato client-side, importabile in qualunque calendario. Niente reminder e-mail in beta. Date gestite come stringhe `YYYY-MM-DD` con confronti lessicografici (immuni ai fusi orari). Stessa infrastruttura di D10: RLS per-utente, audit automatico via trigger DB (`deadline.created/updated/deleted`).

**Motivazione**: il servizio e-mail del Supabase Free ha limiti orari severi (già discusso in D10): promettere reminder e-mail oggi significherebbe romperli domani. L'export .ics delega i promemoria al calendario che l'utente usa già — zero costi, zero infrastruttura, notifiche native sul suo telefono. E-mail digest in Fase 3 con SMTP dedicato (es. free tier Resend), insieme all'aggancio automatico dal Contract Review Agent (modulo 5).

**Limiti accettati**: l'.ics esportato è una fotografia (non si auto-aggiorna); niente ricorrenze; il campo categoria è testo libero (tassonomia rimandata a quando ci saranno dati reali).

## D14 — Mapper: LLM via API free tier (scelta utente) con salvaguardie (7 lug 2026)

**Decisione dell'utente**: analisi AI automatica via **API free tier** (opzioni proposte: euristica+copy-paste consigliata, free tier, Ollama). **Provider scelto: Mistral, piano Experiment** — azienda UE (niente trasferimenti extra-UE), ~1 mld token/mese gratuiti, endpoint OpenAI-compatibile. ⚠️ Vincolo documentato: sul piano gratuito Mistral **usa i dati per il training di default** → **opt-out obbligatorio** nel pannello privacy (passo critico nella checklist di setup, §9). Retention 30 gg per abuse-monitoring. Alternativa pronta: Groq (nessun training, zero retention di default, ma infrastruttura USA) — cambio = 3 env var (`LLM_BASE_URL/KEY/MODEL`).

**Salvaguardie implementate**: (1) chiave API solo server-side, endpoint `/api/mapper/analyze` che richiede autenticazione (la quota gratuita è condivisa: niente accesso anonimo); (2) avvertenza privacy esplicita in UI: non incollare dati personali/segreti, anonimizzare prima; (3) **fallback euristico deterministico** (`segment.ts`+`heuristics.ts`, testato) sempre disponibile — anche per utenti anonimi, nel browser, senza inviare nulla a terzi; se l'LLM non risponde o restituisce JSON invalido, il fallback scatta automaticamente e viene dichiarato in UI; (4) risposta LLM validata rigidamente (schema, max 40 righe, scarto righe malformate); (5) temperatura 0 e istruzione di non inventare requisiti; ogni riga resta una bozza editabile.

**Motivazione**: rispetto della scelta dell'utente minimizzandone i rischi; il fallback garantisce che il modulo non dipenda mai dalla disponibilità/quota del provider (nessuna funzione che "muore" se il free tier cambia — coerente con D2/D3).

**Fonti (consultate 7 lug 2026)**: [Groq — Your Data](https://console.groq.com/docs/your-data), [Groq privacy](https://groq.com/privacy-policy), [Mistral pricing/tiers](https://mistral.ai/pricing/), [Mistral data retention](https://meetily.ai/llm-privacy/mistral).

## D17 — Trasparenza radicale come posizionamento: /about con FAQ e alternative (8 lug 2026)

**Decisione** (richiesta dell'utente): pagina pubblica bilingue `/[locale]/about` con documentazione di come funziona il progetto (principi: deterministico-prima, dati EU, audit immutabile, contenuti versionati), FAQ, **elenco di alternative più mature** — a partire dal [Compliance Checker ufficiale della Commissione UE](https://ai-act-service-desk.ec.europa.eu/en) e dal [checker del Future of Life Institute](https://artificialintelligenceact.eu/assessment/eu-ai-act-compliance-checker/) — e contatti per contribuire ([LinkedIn Giacomo Fedeli](https://www.linkedin.com/in/giacomo-fedeli-277765239/), GitHub). Link nel footer della landing.

**Motivazione**: per un tool di compliance la credibilità È il prodotto. Citare i concorrenti migliori e le fonti ufficiali gratuite costa traffico ma compra fiducia — e per un progetto beta/portfolio la fiducia vale più del traffico. Nessuna affiliazione, marchi dei rispettivi proprietari, invito costante alla consulenza umana.

**Nota di manutenzione**: l'elenco alternative va riverificato periodicamente (nomi e URL possono cambiare); errori segnalati → correzione con menzione qui.

## D15 — Contract Review Agent: estrazione nel browser, libreria clausole curata, RAG rimandato (7 lug 2026)

**Decisione**: il modulo 5 (Contract Review Agent) parte con un **perimetro onesto**:

1. **Estrazione testo interamente client-side** (`lib/contracts/extract.ts`): PDF via `pdfjs-dist`, DOCX via `mammoth`, TXT/MD nativo — import dinamici (caricati solo se servono). Il contratto **non lascia il PC** dell'utente a meno che, da loggato, non attivi l'analisi AI (che invia il *testo*, non il file, al provider LLM configurato — §9/D14).
2. **Libreria clausole v1 curata e versionata nel codice** (`lib/contracts/library.ts`, `CLAUSE_LIBRARY_VERSION`): categorie con pattern deterministici IT/EN, nota di rischio e flag `expected` (se attesa e assente → protezione mancante). Analisi euristica pura e testata (`analyze.ts` + `contracts.test.ts`): clausole trovate, protezioni mancanti, **date/finestre chiave** (date assolute con `isoDate`, preavvisi, durate/rinnovi).
3. **Analisi AI opzionale** (`lib/contracts/llm.ts`) sullo stesso client LLM condiviso, con le stesse salvaguardie di D14: endpoint autenticato, JSON validato rigidamente, **fallback automatico** sulla libreria locale se l'LLM non risponde/risponde male, e dichiarazione dell'engine in UI. Livelli clausola: `info` / `warning` / `risk`.
4. **Prima integrazione reale fra moduli**: le date con `isoDate` si agganciano allo **Scadenzario** (Fase 2.2) con un click (`createDeadline`, categoria "contratti") — mantiene la promessa di D13.
5. **Persistenza del memo, non del contratto** (`storage.ts`, tabella `contract_reviews`, §10): RLS per-utente + audit via trigger (`contract_review.created/updated/deleted`), coerente con D10.

**RAG semantico con pgvector: esplicitamente rimandato alla Fase 3.** La "libreria clausole" v1 è curata nel codice, versionata e testabile: preferibile a un RAG immaturo su materia legale. L'estensione semantica su libreria ampia entrerà quando ci saranno dati e clausole reali su cui valutarla.

**Motivazione**: coerenza con D2/D4/D14 (zero costi, nessuna dipendenza forte dal provider, output riproducibile e auditabile) e con il vincolo di privacy (il documento resta locale per default). Meglio un modulo deterministico e onesto sui limiti che una promessa "AI magica" sul contratto.

**Limiti accettati (v0.1.0)**: i PDF scansionati senza testo (immagine) non sono estraibili (nessun OCR in beta → messaggio esplicito, si incolla il testo); pattern keyword-based = possibili falsi negativi su formulazioni atipiche (avviso "non trovate ≠ certamente assenti"); nessun parere legale (disclaimer in UI). OCR ed estensione libreria: Fase 3/4.

**Correzione in verifica (7 lug 2026)**: la verifica in sandbox del modulo ha scoperto 2 pattern lasciati non funzionanti dalla stesura iniziale — `auto-renewal` e `liability-cap` non riconoscevano l'ordine naturale italiano ("si rinnova tacitamente", "responsabilità … è limitata"): i loro stessi test fallivano. Corretti in `library.ts` e validati (11/11 test + demo end-to-end su contratto .docx di esempio in `docs/esempi-contratti/`).

## D16 — Audit Trail Builder: consultazione read-only del log immutabile, export per revisori (7 lug 2026)

**Decisione**: il modulo 4 (Audit Trail Builder) **non introduce nuova persistenza**: consuma l'`audit_log` append-only già creato in D10 e popolato automaticamente dai trigger DB di tutti i moduli (`assessment.*`, `deadline.*`, `contract_review.*`, `matrix.*`). La pagina `/[locale]/audit` è **sola lettura**: elenco cronologico, filtri per modulo/azione/testo, sintesi leggibile ricavata da `new_state`/`prev_state`, ed **export CSV/JSON** per un revisore esterno. RLS invariata (ognuno vede solo le proprie righe, `auth.uid() = actor`); nessuna scrittura dal client. Logica di parsing/etichettatura/filtro/CSV in `lib/audit/logic.ts`, pura e testata.

**Motivazione**: chiude la suite a 6/6 riusando fondamenta già poste (D10: "l'audit trail nasce come vincolo infrastrutturale — fondamenta reali del modulo 4"). Costruire prima l'infrastruttura e poi la sua UI ha ripagato: il modulo 4 è essenzialmente presentazione, senza nuovo schema né rischi di integrità. Le etichette dei moduli/azioni sono bilingui e derivate dal prefisso dell'azione (con fallback sulla colonna `entity`), così i filtri restano stabili anche se in futuro cambia la tassonomia.

**Limiti accettati (v0.1.0)**: nessuna paginazione (fetch delle ultime 500 righe, filtri lato client — sufficiente ai volumi di una PMI in beta; paginazione/infinite scroll se servirà); export limitato all'insieme filtrato corrente; niente vista "diff" campo-per-campo (mostriamo una sintesi, non il confronto integrale prev/new). Ruoli/permessi di consultazione (un admin che vede il log del team) restano Fase 3.

## D17 — Guardrail espliciti: i limiti come feature versionata e verificabile (7 lug 2026, Fase 3.2)

**Decisione**: rendere i confini operativi della suite un artefatto di prodotto, non una riga di disclaimer sepolta. `lib/guardrails/content.ts` elenca 11 guardrail **versionati e bilingui** in 6 categorie — autonomia/controllo, nessuna comunicazione esterna, tracciabilità immutabile, nessuna certezza legale assoluta, dati/privacy, determinismo/riproducibilità. Ogni guardrail dichiara il **principio** e il **meccanismo concreto** con cui è garantito (estrazione nel browser, RLS, trigger append-only, temperatura 0 + fallback, opt-out training, marcatura date pending-GU), con rimando alla decisione di origine. Pagina pubblica `/[locale]/guardrail` (server component, nessun login, indicizzabile) linkata dal footer; integrità verificata da test (versione, id unici, parità IT/EN, copertura categorie).

**Motivazione**: per un prodotto di compliance la fiducia è il prodotto. Dichiarare in modo puntuale "cosa fa in autonomia vs cosa richiede l'utente, mai comunicazioni esterne, mai eliminare l'audit, mai certezza legale assoluta" — e collegarlo al *come* è tecnicamente imposto — trasforma i vincoli in un vantaggio competitivo verificabile, coerente con la filosofia deterministica/onesta del progetto (D4/D9/D10/D14/D15). Tenere i guardrail come dati versionati (non testo libero sparso) evita derive fra ciò che promettiamo e ciò che il codice fa.

**Alternative scartate**: solo un documento markdown statico (meno visibile all'utente, non testabile, tende a divergere dal codice); guardrail "hard" applicati a runtime da un motore di policy (sovradimensionato a questo stadio: i vincoli chiave sono già imposti dall'infrastruttura — RLS, trigger, estrazione client-side — non da un layer di policy separato).

**Limiti accettati**: i guardrail descrivono e rimandano ai meccanismi, ma non li *eseguono* (l'enforcement resta dove già vive: DB, browser, API); la pagina è informativa. Un motore di policy esplicito e i ruoli/approvazioni che vi si appoggiano restano ai prossimi sprint di Fase 3.
