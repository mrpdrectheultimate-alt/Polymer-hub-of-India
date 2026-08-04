-- ============================================================
-- POLYMERHUB — EDUCATION HUB MIGRATION
-- Phase 5: Indian & Global Academic Programs + Scholarships
-- ============================================================

-- 1. Create education_programs table
create table if not exists public.education_programs (
  id                  uuid default gen_random_uuid() primary key,
  slug                text not null unique,
  name                text not null,
  institution         text not null,
  location            text not null,
  country             text not null,
  degree_type         text not null check (degree_type in ('B.Tech', 'M.Tech', 'M.Sc', 'MS', 'Ph.D', 'Diploma', 'B.Sc')),
  duration            text not null,
  fees_annual         text not null,
  ranking             text,
  admission_process   text not null,
  eligibility         text not null,
  curriculum_highlights text[] default '{}',
  website_url         text,
  is_indian           boolean default true,
  created_at          timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create scholarships table
create table if not exists public.scholarships (
  id                  uuid default gen_random_uuid() primary key,
  name                text not null,
  provider            text not null,
  amount              text not null,
  eligibility         text not null,
  deadline            text not null,
  apply_url           text,
  description         text not null,
  is_indian           boolean default true,
  created_at          timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS and define Policies
alter table public.education_programs enable row level security;
alter table public.scholarships enable row level security;

-- DROP policies if they already exist to be safe
drop policy if exists "Allow public read education_programs" on public.education_programs;
drop policy if exists "Allow public read scholarships" on public.scholarships;

create policy "Allow public read education_programs" on public.education_programs
  for select using (true);

create policy "Allow public read scholarships" on public.scholarships
  for select using (true);
