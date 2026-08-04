-- ============================================================
-- POLYMERHUB — DIGITAL LIBRARY SCHEMA V2
-- Phase 11: Digital Library 2.0 (Kindle-like Reading Room)
-- ============================================================

-- ── 1. READING PROGRESS TRACKING TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.library_reading_progress (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id          UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  chapter_id       TEXT NOT NULL,
  progress_percent INT DEFAULT 0,
  seconds_spent    INT DEFAULT 0,
  last_read_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, book_id, chapter_id)
);

ALTER TABLE public.library_reading_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own reading progress" ON public.library_reading_progress;
CREATE POLICY "Users can manage own reading progress" 
  ON public.library_reading_progress 
  FOR ALL USING (auth.uid() = user_id);

-- ── 2. FLASHCARDS STUDY DECK TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.library_flashcards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id     UUID NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  chapter_id  TEXT NOT NULL,
  front       TEXT NOT NULL,
  back        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.library_flashcards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own study flashcards" ON public.library_flashcards;
CREATE POLICY "Users can manage own study flashcards" 
  ON public.library_flashcards 
  FOR ALL USING (auth.uid() = user_id);
