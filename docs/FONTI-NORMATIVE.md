# Fonti normative del Checker — stato di verifica

Contenuti: `lib/checker/content.ts` · Versione: **v0.1.0-beta (6 luglio 2026)**

Questo file traccia da dove viene ogni affermazione normativa del Checker e con quale grado di certezza. Va aggiornato ad ogni revisione dei contenuti (e automaticamente sorvegliato dal modulo Regulation Watcher, Fase 2.1).

## Fonte primaria

- **Regolamento (UE) 2024/1689 (AI Act)** — testo su [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2024/1689/oj). In vigore dal 1 ago 2024, applicazione scaglionata (art. 113).

## Modifiche Omnibus digitale su AI — ⚠️ IN ATTESA DI PUBBLICAZIONE IN GU

Iter: proposta Commissione 19 nov 2025 → accordo provvisorio trilogo 7 mag 2026 → Parlamento 16 giu 2026 → **via libera finale Consiglio 29 giu 2026** → pubblicazione in GU attesa entro il 2 ago 2026 (entrata in vigore: 3° giorno dopo la pubblicazione).

**AZIONE RICORRENTE**: verificare su EUR-Lex se l'Omnibus è stato pubblicato; alla pubblicazione, rimuovere i flag `pendingOmnibus` da `content.ts`/`engine.ts` e confermare le date sul testo ufficiale.

| Cosa recepiamo | Nuovo valore | Fonte secondaria |
|---|---|---|
| Obblighi alto rischio Annex III | 2 ago 2026 → **2 dic 2027** | Gibson Dunn, Covington (v. sotto) |
| Obblighi alto rischio Annex I | 2 ago 2027 → **2 ago 2028** | idem |
| Art. 50 trasparenza | **INVARIATO: 2 ago 2026**; sola marcatura 50(2) per sistemi pre-esistenti → 2 dic 2026 | idem |
| Nuovo divieto art. 5: NCII/CSAM | efficace **2 dic 2026**; condizioni diverse provider/deployer | idem |
| Reg. Macchine spostato in Annex I sez. B | obblighi cap. III non diretti; atti delegati entro ago 2028 | Covington |
| «Componente di sicurezza» ristretto | escluse funzioni di sola assistenza/ottimizzazione/comfort/QC senza rischio salute/sicurezza | idem |
| Art. 4 literacy | formulazione attenuata («misure di sostegno») | idem |
| Registrazione autovalutazione 6(3) | semplificata (Annex VIII sez. B, punti 7 e 9 soppressi) | idem |
| Sandbox nazionali | 2 ago 2026 → 2 ago 2027 | idem |

## Fonti secondarie usate (studi legali, consultate il 6 lug 2026)

- Covington — [EU AI Act Update: Timeline Relief, Targeted Simplification, and New Prohibitions](https://www.insideglobaltech.com/2026/05/28/eu-ai-act-update-timeline-relief-targeted-simplification-and-new-prohibitions/) (28 mag 2026)
- Gibson Dunn — [EU AI Act Omnibus Agreement](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/) (27 mag 2026)
- Sidley — [EU Lawmakers Reach Provisional Agreement](https://datamatters.sidley.com/2026/06/22/eu-lawmakers-reach-provisional-agreement-to-delay-key-eu-ai-act-obligations/) (22 giu 2026)
- White & Case — [EU agrees Digital Omnibus deal](https://www.whitecase.com/insight-alert/eu-agrees-digital-omnibus-deal-simplify-ai-rules) (giu 2026)

## Limiti dichiarati della v0.1.0-beta

1. Le sintesi di articoli/allegati sono **semplificazioni divulgative**: fanno fede i testi ufficiali.
2. Le eccezioni all'art. 5 (es. RBI per law enforcement) e i confini fini dell'art. 6(3) sono trattati con note prudenziali, non modellati in dettaglio.
3. Obblighi GPAI: solo rinvio informativo (artt. 51–56), non checklist operativa.
4. Contenuti in italiano; versione inglese non ancora revisionata.
5. **Revisione legale professionale raccomandata prima di promuovere il tool fuori beta.**
