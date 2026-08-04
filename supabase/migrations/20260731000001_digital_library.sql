-- ============================================================
-- POLYMERHUB — DIGITAL LIBRARY SCHEMA
-- Phase 3: Reading Room & Digital Library Support
-- ============================================================

-- ── 1. LIBRARY BOOKS TABLE ──────────────────────────────────────────────────
create table if not exists public.library_books (
  id            uuid default gen_random_uuid() primary key,
  slug          text not null unique,
  title         text not null,
  authors       text not null,
  cover_url     text,
  category      text not null check (category in ('original_guide', 'open_access', 'commercial')),
  difficulty    text check (difficulty in ('Foundational', 'Intermediate', 'Advanced', 'Reference')),
  focus         text,
  summary       text,
  toc           jsonb,               -- Array of { "title": "Chapter 1", "id": "ch1" }
  chapters      jsonb,               -- Map of chapterId -> markdown content (null for commercial)
  purchase_url  text,               -- For commercial books
  file_url      text,               -- For downloadable open-access PDFs
  careers       text[],             -- Array of matching careers
  subject_slugs text[],            -- Mapped subjects
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- RLS
alter table public.library_books enable row level security;

drop policy if exists "Books are publicly readable" on public.library_books;
create policy "Books are publicly readable" 
  on public.library_books 
  for select using (true);

-- ── 2. LIBRARY BOOKMARKS TABLE ──────────────────────────────────────────────
create table if not exists public.library_bookmarks (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  book_id     uuid not null references public.library_books(id) on delete cascade,
  chapter_id  text not null,
  scroll_pos  integer default 0,
  note        text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(user_id, book_id, chapter_id)
);

-- RLS
alter table public.library_bookmarks enable row level security;

drop policy if exists "Users manage own bookmarks" on public.library_bookmarks;
create policy "Users manage own bookmarks" 
  on public.library_bookmarks 
  for all using (auth.uid() = user_id);

-- ── 3. LIBRARY HIGHLIGHTS TABLE ─────────────────────────────────────────────
create table if not exists public.library_highlights (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid not null references auth.users(id) on delete cascade,
  book_id       uuid not null references public.library_books(id) on delete cascade,
  chapter_id    text not null,
  selected_text text not null,
  color         text default 'yellow',
  note          text,
  created_at    timestamptz default now()
);

-- RLS
alter table public.library_highlights enable row level security;

drop policy if exists "Users manage own highlights" on public.library_highlights;
create policy "Users manage own highlights" 
  on public.library_highlights 
  for all using (auth.uid() = user_id);
