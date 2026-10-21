-- ==============================================================================
-- POLYMERHUB OF INDIA — CORE SCHEMA, STORAGE & SECURITY HARDENING
-- Migration: 20261021000001_core_schema_and_storage_hardening.sql
-- Covers: Storage buckets, profile protection trigger, payment_requests alignment,
-- GATE mock attempts tracking, baseline tables idempotency, and RLS policies.
-- ==============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. STORAGE BUCKETS & RLS POLICIES
-- ─────────────────────────────────────────────────────────────────────────────

-- Ensure 'avatars' bucket exists (public read, authenticated user write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Ensure 'receipts' bucket exists (private read, authenticated user write)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', false)
ON CONFLICT (id) DO NOTHING;

-- Avatars Policies
DROP POLICY IF EXISTS "Public view for avatars" ON storage.objects;
CREATE POLICY "Public view for avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.role() = 'authenticated'
  );

-- Receipts Policies (Payment Verification)
DROP POLICY IF EXISTS "Users can upload receipts" ON storage.objects;
CREATE POLICY "Users can upload receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'receipts' 
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users and admins can view receipts" ON storage.objects;
CREATE POLICY "Users and admins can view receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR auth.role() = 'service_role'
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
      )
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. PROFILE SENSITIVE COLUMNS PROTECTION (PREVENT CLIENT PRIVILEGE ESCALATION)
-- ─────────────────────────────────────────────────────────────────────────────

-- Ensure essential profile columns exist
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS ai_queries_today INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_queries_reset_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_hod BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS college_name TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS goals TEXT,
  ADD COLUMN IF NOT EXISTS education_level TEXT,
  ADD COLUMN IF NOT EXISTS branch TEXT,
  ADD COLUMN IF NOT EXISTS graduation_year INTEGER,
  ADD COLUMN IF NOT EXISTS target_path TEXT,
  ADD COLUMN IF NOT EXISTS xp_points INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_date DATE,
  ADD COLUMN IF NOT EXISTS total_lessons_completed INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_quizzes_passed INTEGER DEFAULT 0;

-- Trigger function: Prevents non-service_role users from updating sensitive columns
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Service role and database administrators bypass protection
  IF current_setting('request.jwt.claim.role', true) = 'service_role' 
     OR current_setting('role', true) IN ('postgres', 'service_role') THEN
    RETURN NEW;
  END IF;

  -- Block client privilege escalation attempts
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE EXCEPTION 'Unauthorized: Users cannot modify profile role directly.';
  END IF;

  IF OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Users cannot modify is_admin clearance directly.';
  END IF;

  IF OLD.is_hod IS DISTINCT FROM NEW.is_hod THEN
    RAISE EXCEPTION 'Unauthorized: Users cannot modify is_hod status directly.';
  END IF;

  IF OLD.subscription_status IS DISTINCT FROM NEW.subscription_status THEN
    RAISE EXCEPTION 'Unauthorized: Users cannot modify subscription_status directly.';
  END IF;

  IF OLD.subscription_end_date IS DISTINCT FROM NEW.subscription_end_date THEN
    RAISE EXCEPTION 'Unauthorized: Users cannot modify subscription_end_date directly.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_sensitive_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_sensitive_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_sensitive_columns();

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. PAYMENT REQUESTS SCHEMA & RLS RECONCILIATION
-- ─────────────────────────────────────────────────────────────────────────────

-- Ensure columns needed for manual UPI / proof verification exist
ALTER TABLE public.payment_requests
  ADD COLUMN IF NOT EXISTS screenshot_url TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ALTER COLUMN plan_code DROP NOT NULL,
  ALTER COLUMN razorpay_order_id DROP NOT NULL,
  ALTER COLUMN expires_at DROP NOT NULL;

-- Widen status check constraint to support both automated and manual flows
ALTER TABLE public.payment_requests
  DROP CONSTRAINT IF EXISTS payment_requests_status_check;

ALTER TABLE public.payment_requests
  ADD CONSTRAINT payment_requests_status_check
  CHECK (status IN ('created', 'paid', 'failed', 'expired', 'pending', 'approved', 'rejected'));

-- RLS policies for payment_requests
DROP POLICY IF EXISTS "Users read own payment requests" ON public.payment_requests;
CREATE POLICY "Users read own payment requests"
  ON public.payment_requests FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

DROP POLICY IF EXISTS "Users insert own payment requests" ON public.payment_requests;
CREATE POLICY "Users insert own payment requests"
  ON public.payment_requests FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "Admins and service role update payment requests" ON public.payment_requests;
CREATE POLICY "Admins and service role update payment requests"
  ON public.payment_requests FOR UPDATE
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. GATE MOCK ATTEMPTS PERSISTENCE TABLE
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.gate_mock_attempts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score               NUMERIC(6, 2) NOT NULL,
  total_marks         NUMERIC(6, 2) NOT NULL,
  accuracy_pct        NUMERIC(5, 2) NOT NULL,
  time_taken_seconds  INTEGER NOT NULL DEFAULT 0,
  question_breakdown  JSONB DEFAULT '[]'::jsonb,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gate_mock_user_id ON public.gate_mock_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_gate_mock_created_at ON public.gate_mock_attempts(created_at DESC);

ALTER TABLE public.gate_mock_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own gate attempts" ON public.gate_mock_attempts;
CREATE POLICY "Users view own gate attempts"
  ON public.gate_mock_attempts FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users insert own gate attempts" ON public.gate_mock_attempts;
CREATE POLICY "Users insert own gate attempts"
  ON public.gate_mock_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. BASELINE TABLES IDEMPOTENT CONSOLIDATION
-- ─────────────────────────────────────────────────────────────────────────────

-- 5A. FEEDBACK
CREATE TABLE IF NOT EXISTS public.feedback (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type         TEXT NOT NULL CHECK (type IN ('bug', 'feature', 'content', 'general', 'praise')),
  rating       INTEGER CHECK (rating BETWEEN 1 AND 5),
  message      TEXT NOT NULL,
  page_url     TEXT,
  user_email   TEXT,
  user_name    TEXT,
  status       TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved', 'planned')),
  admin_note   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
CREATE POLICY "Anyone can submit feedback"
  ON public.feedback FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users view own feedback" ON public.feedback;
CREATE POLICY "Users view own feedback"
  ON public.feedback FOR SELECT
  USING (
    auth.uid() = user_id 
    OR auth.role() = 'service_role'
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
  );

-- 5B. DAILY UPDATES
CREATE TABLE IF NOT EXISTS public.daily_updates (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  headline              TEXT NOT NULL,
  summary               TEXT NOT NULL,
  full_body             TEXT,
  source_name           TEXT NOT NULL,
  source_url            TEXT,
  image_url             TEXT,
  category              TEXT NOT NULL,
  related_lesson_slug   TEXT,
  related_subject_slug  TEXT,
  published_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  publish_date          DATE NOT NULL DEFAULT CURRENT_DATE,
  is_featured           BOOLEAN DEFAULT FALSE,
  is_published          BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.daily_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published updates" ON public.daily_updates;
CREATE POLICY "Public can view published updates"
  ON public.daily_updates FOR SELECT
  USING (is_published = true OR auth.role() = 'service_role');

-- 5C. GAMIFICATION: BADGES, USER_BADGES, XP_LOG
CREATE TABLE IF NOT EXISTS public.badges (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL,
  color       TEXT NOT NULL,
  xp_reward   INTEGER DEFAULT 50,
  category    TEXT NOT NULL,
  condition   TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view for badges" ON public.badges;
CREATE POLICY "Public view for badges"
  ON public.badges FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id   UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view user badges" ON public.user_badges;
CREATE POLICY "Users can view user badges"
  ON public.user_badges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own badges" ON public.user_badges;
CREATE POLICY "Users insert own badges"
  ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE TABLE IF NOT EXISTS public.xp_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action      TEXT NOT NULL,
  xp_earned   INTEGER NOT NULL,
  reference   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own xp log" ON public.xp_log;
CREATE POLICY "Users can view own xp log"
  ON public.xp_log FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users insert own xp log" ON public.xp_log;
CREATE POLICY "Users insert own xp log"
  ON public.xp_log FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- 5D. FORUM QUESTIONS, ANSWERS, UPVOTES
CREATE TABLE IF NOT EXISTS public.forum_questions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  tags        TEXT[] DEFAULT '{}',
  upvotes     INTEGER DEFAULT 0,
  views       INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  has_accepted_answer BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.forum_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view for forum questions" ON public.forum_questions;
CREATE POLICY "Public view for forum questions"
  ON public.forum_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert forum questions" ON public.forum_questions;
CREATE POLICY "Users insert forum questions"
  ON public.forum_questions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own forum questions" ON public.forum_questions;
CREATE POLICY "Users update own forum questions"
  ON public.forum_questions FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.forum_answers (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.forum_questions(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body        TEXT NOT NULL,
  upvotes     INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.forum_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view for forum answers" ON public.forum_answers;
CREATE POLICY "Public view for forum answers"
  ON public.forum_answers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert forum answers" ON public.forum_answers;
CREATE POLICY "Users insert forum answers"
  ON public.forum_answers FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own forum answers" ON public.forum_answers;
CREATE POLICY "Users update own forum answers"
  ON public.forum_answers FOR UPDATE USING (auth.uid() = user_id);

-- 5E. PRACTICE QUESTIONS
CREATE TABLE IF NOT EXISTS public.practice_questions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question    TEXT NOT NULL,
  options     JSONB NOT NULL,
  correct_idx INTEGER NOT NULL,
  explanation TEXT,
  topic       TEXT NOT NULL,
  difficulty  TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category    TEXT DEFAULT 'general',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view for practice questions" ON public.practice_questions;
CREATE POLICY "Public view for practice questions"
  ON public.practice_questions FOR SELECT USING (true);
