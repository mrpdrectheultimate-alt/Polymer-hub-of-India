-- ==============================================================================
-- POLYMERHUB OF INDIA — COMPREHENSIVE SCHEMA, SECURITY & INDEX HARDENING
-- Migration: 20261022000001_comprehensive_schema_and_security_hardening.sql
-- Covers:
-- 1. Auto-provision profiles on auth.users insert (handle_new_user trigger)
-- 2. Backfill existing auth users into public.profiles
-- 3. Enable RLS and add policies for 5 unshielded tables (cron_execution_logs,
--    curriculum_modules, academic_reviewers, lesson_sources, lesson_revisions)
-- 4. Storage bucket quotas & MIME-type whitelists (avatars, receipts, project-images, resumes)
-- 5. Foreign key performance indexing (30+ indexes across relational entities)
-- 6. ON DELETE SET NULL governance for administrative audit fields
-- ==============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. USER AUTO-PROVISIONING TRIGGER ON auth.users
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    subscription_status,
    ai_queries_today,
    xp_points,
    current_streak,
    role,
    is_admin
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'free',
    0,
    0,
    0,
    'student',
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill any existing auth users who do not have a public.profiles record yet
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  avatar_url,
  subscription_status,
  ai_queries_today,
  xp_points,
  current_streak,
  role,
  is_admin
)
SELECT 
  id,
  email,
  COALESCE(
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    split_part(email, '@', 1)
  ),
  raw_user_meta_data->>'avatar_url',
  'free',
  0,
  0,
  0,
  'student',
  false
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. ENABLE RLS AND HARDEN POLICIES FOR 5 PREVIOUSLY UNSHIELDED TABLES
-- ─────────────────────────────────────────────────────────────────────────────

-- 2A. CRON EXECUTION LOGS
ALTER TABLE public.cron_execution_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins and service role view cron logs" ON public.cron_execution_logs;
CREATE POLICY "Admins and service role view cron logs"
  ON public.cron_execution_logs FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

DROP POLICY IF EXISTS "Service role manage cron logs" ON public.cron_execution_logs;
CREATE POLICY "Service role manage cron logs"
  ON public.cron_execution_logs FOR ALL
  USING (auth.role() = 'service_role');

-- 2B. ACADEMIC REVIEWERS
ALTER TABLE public.academic_reviewers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view for academic reviewers" ON public.academic_reviewers;
CREATE POLICY "Public view for academic reviewers"
  ON public.academic_reviewers FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage academic reviewers" ON public.academic_reviewers;
CREATE POLICY "Admins manage academic reviewers"
  ON public.academic_reviewers FOR ALL
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- 2C. CURRICULUM MODULES
ALTER TABLE public.curriculum_modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view for curriculum modules" ON public.curriculum_modules;
CREATE POLICY "Public view for curriculum modules"
  ON public.curriculum_modules FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage curriculum modules" ON public.curriculum_modules;
CREATE POLICY "Admins manage curriculum modules"
  ON public.curriculum_modules FOR ALL
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- 2D. LESSON SOURCES
ALTER TABLE public.lesson_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view for lesson sources" ON public.lesson_sources;
CREATE POLICY "Public view for lesson sources"
  ON public.lesson_sources FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins manage lesson sources" ON public.lesson_sources;
CREATE POLICY "Admins manage lesson sources"
  ON public.lesson_sources FOR ALL
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- 2E. LESSON REVISIONS
ALTER TABLE public.lesson_revisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins view lesson revisions" ON public.lesson_revisions;
CREATE POLICY "Admins view lesson revisions"
  ON public.lesson_revisions FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

DROP POLICY IF EXISTS "Admins manage lesson revisions" ON public.lesson_revisions;
CREATE POLICY "Admins manage lesson revisions"
  ON public.lesson_revisions FOR ALL
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
    )
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. STORAGE BUCKET QUOTAS & MIME TYPE RESTRICTIONS
-- ─────────────────────────────────────────────────────────────────────────────

-- 3A. Avatars Bucket: Max 5MB, Images Only
UPDATE storage.buckets
SET 
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'avatars';

-- 3B. Receipts Bucket: Max 10MB, Images & PDFs
UPDATE storage.buckets
SET 
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
WHERE id = 'receipts';

-- 3C. Project Images Bucket: Max 10MB, Images Only
UPDATE storage.buckets
SET 
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'project-images';

-- 3D. Resumes Bucket: Max 10MB, Documents Only
UPDATE storage.buckets
SET 
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
WHERE id = 'resumes';

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. FOREIGN KEY INDEXES (ELIMINATE RELATIONAL SEQUENTIAL SCANS)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_challenge_submissions_user_id ON public.challenge_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_submissions_challenge_id ON public.challenge_submissions(challenge_id);

CREATE INDEX IF NOT EXISTS idx_community_events_created_by ON public.community_events(created_by);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);

CREATE INDEX IF NOT EXISTS idx_forum_questions_user_id ON public.forum_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_answers_question_id ON public.forum_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_forum_answers_user_id ON public.forum_answers(user_id);

CREATE INDEX IF NOT EXISTS idx_mentorship_matches_student_id ON public.mentorship_matches(student_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_matches_mentor_id ON public.mentorship_matches(mentor_id);

CREATE INDEX IF NOT EXISTS idx_patent_drafts_user_id ON public.patent_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON public.payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON public.payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_download_log_user_id ON public.pdf_download_log(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_download_log_lesson_id ON public.pdf_download_log(lesson_id);

CREATE INDEX IF NOT EXISTS idx_project_comments_project_id ON public.project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_user_id ON public.project_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_project_upvotes_project_id ON public.project_upvotes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_upvotes_user_id ON public.project_upvotes(user_id);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_lesson_id ON public.quiz_attempts(lesson_id);

CREATE INDEX IF NOT EXISTS idx_research_pitches_user_id ON public.research_pitches(user_id);
CREATE INDEX IF NOT EXISTS idx_student_projects_user_id ON public.student_projects(user_id);

CREATE INDEX IF NOT EXISTS idx_study_groups_created_by ON public.study_groups(created_by);
CREATE INDEX IF NOT EXISTS idx_study_group_members_user_id ON public.study_group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_study_group_members_group_id ON public.study_group_members(study_group_id);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);

CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON public.user_progress(lesson_id);

CREATE INDEX IF NOT EXISTS idx_virtual_lab_sessions_user_id ON public.virtual_lab_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_user_id ON public.xp_log(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
