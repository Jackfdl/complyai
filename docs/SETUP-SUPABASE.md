# Setup Supabase — guida passo passo (Sprint 1.2)

Tempo: ~15 minuti. Costo: zero (piano Free). Prerequisito: nessuno.

## 1. Crea account e progetto

1. Vai su [supabase.com](https://supabase.com) → **Start your project** → accedi con **GitHub** (Continue with GitHub → Authorize).
2. **New project**:
   - Organization: quella proposta (personale) va bene.
   - Name: `complyai`
   - Database password: generane una col bottone e **salvala nel tuo password manager** (serve solo per accesso diretto al DB, non per l'app).
   - **Region: `eu-central-1` (Francoforte)** — importante per il GDPR: i dati restano nell'UE.
   - Piano: **Free**.
3. Attendi ~2 minuti che il progetto sia pronto.

## 2. Crea le tabelle (SQL)

1. Menu laterale → **SQL Editor** → **New query**.
2. Incolla TUTTO il blocco qui sotto → **Run** (deve dire "Success. No rows returned"):

```sql
-- ============================================================
-- ComplyAI — Schema Sprint 1.2: assessments + audit_log append-only
-- ============================================================

-- ---------- Tabella: valutazioni salvate ----------
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  system_name text not null default '—',
  level text not null,
  answers jsonb not null,
  result jsonb not null,
  statuses jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assessments enable row level security;

create policy "select own" on public.assessments
  for select using (auth.uid() = user_id);
create policy "insert own" on public.assessments
  for insert with check (auth.uid() = user_id);
create policy "update own" on public.assessments
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own" on public.assessments
  for delete using (auth.uid() = user_id);

-- ---------- Tabella: registro audit (append-only) ----------
create table public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor uuid not null default auth.uid(),
  action text not null,
  entity text,
  entity_id text,
  details jsonb,
  prev_state jsonb,
  new_state jsonb
);

alter table public.audit_log enable row level security;

create policy "select own audit" on public.audit_log
  for select using (auth.uid() = actor);
create policy "insert own audit" on public.audit_log
  for insert with check (auth.uid() = actor);
-- Nessuna policy UPDATE/DELETE: già negati da RLS. In più:
revoke update, delete on public.audit_log from anon, authenticated;

-- Cintura e bretelle: blocco a livello di trigger (vale per chiunque)
create or replace function public.forbid_audit_mutation()
returns trigger language plpgsql as $$
begin
  raise exception 'audit_log is append-only';
end $$;

create trigger audit_log_immutable
  before update or delete on public.audit_log
  for each row execute function public.forbid_audit_mutation();

-- ---------- Audit automatico: il client non può dimenticarsene ----------
create or replace function public.log_assessment_change()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_log (actor, action, entity, entity_id, new_state)
    values (auth.uid(), 'assessment.created', 'assessments', new.id::text,
            jsonb_build_object('system_name', new.system_name, 'level', new.level));
    return new;
  elsif tg_op = 'UPDATE' then
    new.updated_at := now();
    insert into public.audit_log (actor, action, entity, entity_id, prev_state, new_state)
    values (auth.uid(), 'assessment.updated', 'assessments', new.id::text,
            jsonb_build_object('system_name', old.system_name, 'level', old.level, 'updated_at', old.updated_at),
            jsonb_build_object('system_name', new.system_name, 'level', new.level));
    return new;
  else
    insert into public.audit_log (actor, action, entity, entity_id, prev_state)
    values (auth.uid(), 'assessment.deleted', 'assessments', old.id::text,
            jsonb_build_object('system_name', old.system_name, 'level', old.level));
    return old;
  end if;
end $$;

create trigger assessments_audit_insert
  before insert or update on public.assessments
  for each row execute function public.log_assessment_change();

create trigger assessments_audit_delete
  after delete on public.assessments
  for each row execute function public.log_assessment_change();
```

## 3. Impostazioni Auth (per la beta)

1. Menu → **Authentication** → **Sign In / Providers** (o "Providers" a seconda della UI) → **Email**.
2. **Disattiva "Confirm email"** (toggle OFF) → Save. Motivo: in beta evitiamo la dipendenza dalle email di conferma (il servizio email incluso nel piano Free ha limiti orari molto bassi). Lo riattiveremo con un provider SMTP dedicato prima dell'uscita dalla beta (Fase 4).

## 4. Copia le chiavi

1. Menu → **Project Settings** (ingranaggio) → **API** (o "API Keys").
2. Copia: **Project URL** (es. `https://abcd1234.supabase.co`) e la **anon public key** (stringa lunga che inizia con `eyJ…` o `sb_publishable_…`).
3. La anon key è pensata per essere pubblica: la sicurezza la fanno le RLS policies appena create. **Non copiare mai** la `service_role` key.

## 5. Configura l'app

**In locale**: nella cartella del progetto copia `.env.local.example` in un nuovo file chiamato `.env.local` e incolla i due valori. Riavvia `npm run dev`.

**Su Vercel**: vercel.com → progetto `complyai` → **Settings** → **Environment Variables** → aggiungi entrambe (Name/Value, ambiente: tutte):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Poi rideploya (basta il prossimo `git push`, oppure Deployments → ⋯ → Redeploy).

## 6. Verifica

1. Apri il Checker → completa una valutazione → nel report appare "Salva nel tuo account" → registrati (email + password) → salva.
2. "Le mie valutazioni" deve mostrarla; aprila, modificala, risalva.
3. Su Supabase → **Table Editor** → `audit_log`: devi vedere `assessment.created` / `assessment.updated` con attore e timestamp. Prova a cancellare una riga di `audit_log` dal Table Editor: deve fallire con "audit_log is append-only".

## 7. Regulation Watcher (Fase 2.1) — SQL aggiuntivo

Nel **SQL Editor** esegui anche questo blocco:

```sql
-- ============================================================
-- ComplyAI — Schema Fase 2.1: Regulation Watcher
-- ============================================================

create table public.watch_items (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  guid text not null,
  title text not null,
  url text not null,
  summary text,
  published_at timestamptz,
  tags text[] not null default '{}',
  relevant boolean not null default false,
  created_at timestamptz not null default now(),
  unique (source, guid)
);

alter table public.watch_items enable row level security;
-- Lettura pubblica (sono notizie/atti pubblici); scrittura solo via service role (bypassa RLS).
create policy "public read" on public.watch_items for select using (true);

create table public.watch_runs (
  id bigint generated always as identity primary key,
  run_at timestamptz not null default now(),
  ok boolean not null,
  stats jsonb
);

alter table public.watch_runs enable row level security;
create policy "public read runs" on public.watch_runs for select using (true);
```

Poi aggiungi **due variabili d'ambiente in più** (locale in `.env.local` e su Vercel):

- `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API → chiave `service_role` (**segreta**: bypassa le RLS, mai esporla; su Vercel NON usare il prefisso NEXT_PUBLIC).
- `CRON_SECRET` — una stringa casuale lunga generata da te (es. 40+ caratteri); Vercel la usa automaticamente per autenticare le chiamate del cron a `/api/watcher/run`.

Il cron è definito in `vercel.json` (ogni giorno alle 6:00 UTC). Primo test manuale: dopo il deploy, da PowerShell:

```powershell
curl.exe -H "Authorization: Bearer IL-TUO-CRON-SECRET" https://complyai-mu.vercel.app/api/watcher/run
```

Deve rispondere con le statistiche delle fonti; poi `/it/watcher` mostra le voci raccolte. **Bonus**: l'esecuzione giornaliera genera attività sul DB e mitiga la pausa del piano Free.

## 8. Legal Deadline Tracker (Fase 2.2) — SQL aggiuntivo

Nel **SQL Editor** esegui anche questo blocco:

```sql
-- ============================================================
-- ComplyAI — Schema Fase 2.2: Legal Deadline Tracker
-- ============================================================

create table public.deadlines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  notes text,
  category text,
  due_date date not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.deadlines enable row level security;

create policy "select own deadlines" on public.deadlines
  for select using (auth.uid() = user_id);
create policy "insert own deadlines" on public.deadlines
  for insert with check (auth.uid() = user_id);
create policy "update own deadlines" on public.deadlines
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own deadlines" on public.deadlines
  for delete using (auth.uid() = user_id);

-- Audit automatico anche per lo scadenzario (stesso schema di assessments)
create or replace function public.log_deadline_change()
returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_log (actor, action, entity, entity_id, new_state)
    values (auth.uid(), 'deadline.created', 'deadlines', new.id::text,
            jsonb_build_object('title', new.title, 'due_date', new.due_date));
    return new;
  elsif tg_op = 'UPDATE' then
    new.updated_at := now();
    insert into public.audit_log (actor, action, entity, entity_id, prev_state, new_state)
    values (auth.uid(), 'deadline.updated', 'deadlines', new.id::text,
            jsonb_build_object('title', old.title, 'due_date', old.due_date, 'completed_at', old.completed_at),
            jsonb_build_object('title', new.title, 'due_date', new.due_date, 'completed_at', new.completed_at));
    return new;
  else
    insert into public.audit_log (actor, action, entity, entity_id, prev_state)
    values (auth.uid(), 'deadline.deleted', 'deadlines', old.id::text,
            jsonb_build_object('title', old.title, 'due_date', old.due_date));
    return old;
  end if;
end $$;

create trigger deadlines_audit_insert
  before insert or update on public.deadlines
  for each row execute function public.log_deadline_change();

create trigger deadlines_audit_delete
  after delete on public.deadlines
  for each row execute function public.log_deadline_change();
```

Nessuna variabile d'ambiente nuova: lo scadenzario usa le stesse chiavi del Checker.

## Note operative

- **Pausa da inattività**: il progetto Free si pausa dopo ~7 giorni senza attività DB; si riattiva dal dashboard in ~1 minuto (mitigazione strutturale in Fase 2.1 col Regulation Watcher).
- I dati salvati sono minimi by design: email dell'account + contenuto degli assessment. Niente altro (D10).
