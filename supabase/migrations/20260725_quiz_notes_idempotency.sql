-- ============================================================
-- POLYMERHUB — QUIZ, NOTES & XP IDEMPOTENCY MIGRATION
-- Migration: 20260725_quiz_notes_idempotency.sql
-- ============================================================

-- 1. Add submission_id to quiz_attempts for idempotency
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS submission_id UUID;
CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_attempts_submission_id ON public.quiz_attempts (submission_id);

-- 2. Unique source index on xp_log to prevent double XP allocation
CREATE UNIQUE INDEX IF NOT EXISTS idx_xp_log_unique_source ON public.xp_log (user_id, action, reference);

-- 3. Create user_notes table with full RLS ownership controls
CREATE TABLE IF NOT EXISTS public.user_notes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id   UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  title       TEXT,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own notes" ON public.user_notes;
CREATE POLICY "Users read own notes"
  ON public.user_notes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own notes" ON public.user_notes;
CREATE POLICY "Users insert own notes"
  ON public.user_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own notes" ON public.user_notes;
CREATE POLICY "Users update own notes"
  ON public.user_notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own notes" ON public.user_notes;
CREATE POLICY "Users delete own notes"
  ON public.user_notes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_notes_user ON public.user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_lesson ON public.user_notes(lesson_id);
