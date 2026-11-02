-- ReportDisputer / credit-analyzer-ai — Supabase database setup
-- Paste this whole file into Supabase Dashboard → SQL Editor → Run.
-- Safe to run more than once.
--
-- Grants are explicit on purpose: new Supabase projects no longer expose
-- tables to the Data API automatically, so each role gets exactly what it needs.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. profiles — one row per user (replaces Firestore users/{uid})
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id                      uuid primary key references auth.users (id) on delete cascade,
  email                   text,
  display_name            text,
  avatar_url              text,
  is_paid                 boolean not null default false,
  plan                    text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  has_used_free_download  boolean not null default false,
  payment_date            timestamptz,
  stripe_session_id       text,
  stripe_customer_id      text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Users may only change their display name themselves.
-- Paid status / plan can ONLY be set by the Stripe webhook (server secret key),
-- so nobody can make themselves "paid" from the browser.
revoke all on public.profiles from anon;
revoke insert, update, delete on public.profiles from authenticated;
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;
-- Server-side code (Stripe webhook, delete-account) uses the secret key = service_role.
grant select, insert, update, delete on public.profiles to service_role;

-- Create a profile automatically whenever someone signs up (email or Google).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.touch_updated_at() from public, anon, authenticated;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- One-way switch for the free download: users can mark it used, never reset it.
create or replace function public.mark_free_download_used()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.profiles
     set has_used_free_download = true
   where id = (select auth.uid());
$$;

revoke all on function public.mark_free_download_used() from public, anon;
grant execute on function public.mark_free_download_used() to authenticated;

-- Backfill profiles for any users that signed up before this script ran.
insert into public.profiles (id, email, display_name, avatar_url)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
  coalesce(u.raw_user_meta_data ->> 'avatar_url', u.raw_user_meta_data ->> 'picture')
from auth.users u
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. disputes — the dispute tracker (replaces Firestore users/{uid}/disputes)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.disputes (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  bureau         text not null,
  account_name   text not null,
  letter_type    text not null,
  sent_date      date not null,
  deadline_date  date not null,
  status         text not null default 'pending'
                   check (status in ('pending', 'responded', 'resolved', 'escalated')),
  notes          text,
  created_at     timestamptz not null default now()
);

create index if not exists disputes_user_created_idx
  on public.disputes (user_id, created_at desc);

alter table public.disputes enable row level security;

drop policy if exists "Users manage their own disputes" on public.disputes;
create policy "Users manage their own disputes"
  on public.disputes for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on public.disputes from anon;
grant select, insert, update, delete on public.disputes to authenticated;
grant select, insert, update, delete on public.disputes to service_role;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Live updates (so "Premium" shows up the moment Stripe confirms payment)
-- ─────────────────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
     where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;
  if not exists (
    select 1 from pg_publication_tables
     where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'disputes'
  ) then
    alter publication supabase_realtime add table public.disputes;
  end if;
end;
$$;
