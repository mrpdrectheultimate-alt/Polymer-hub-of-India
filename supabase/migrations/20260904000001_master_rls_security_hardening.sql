-- ==============================================================================
-- POLYMERHUB MASTER ROW-LEVEL-SECURITY (RLS) & IDOR PREVENTION MIGRATION
-- Migration: 20260904000001_master_rls_security_hardening.sql
-- ==============================================================================

-- 1. PROFILES TABLE (User identity & Entitlements)
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. USER PROGRESS & QUIZ SUBMISSIONS (Student Records)
ALTER TABLE IF EXISTS public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE IF EXISTS public.quiz_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own quiz submissions" ON public.quiz_submissions;
CREATE POLICY "Users can view own quiz submissions"
  ON public.quiz_submissions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz submissions" ON public.quiz_submissions;
CREATE POLICY "Users can insert own quiz submissions"
  ON public.quiz_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. PAYMENT & MONETIZATION ENTITLEMENTS (Financial Records - ZERO IDOR)
ALTER TABLE IF EXISTS public.payment_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view only own payment history" ON public.payment_history;
CREATE POLICY "Users can view only own payment history"
  ON public.payment_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role manages payment history" ON public.payment_history;
CREATE POLICY "Service role manages payment history"
  ON public.payment_history FOR ALL
  USING (auth.role() = 'service_role');

ALTER TABLE IF EXISTS public.payment_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only service role can access webhook events" ON public.payment_webhook_events;
CREATE POLICY "Only service role can access webhook events"
  ON public.payment_webhook_events FOR ALL
  USING (auth.role() = 'service_role');

-- 4. RESEARCH & PATENT HUB (Intellectual Property Protection)
ALTER TABLE IF EXISTS public.patent_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own patent drafts" ON public.patent_drafts;
CREATE POLICY "Users can view own patent drafts"
  ON public.patent_drafts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own patent drafts" ON public.patent_drafts;
CREATE POLICY "Users can create own patent drafts"
  ON public.patent_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own patent drafts" ON public.patent_drafts;
CREATE POLICY "Users can update own patent drafts"
  ON public.patent_drafts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own patent drafts" ON public.patent_drafts;
CREATE POLICY "Users can delete own patent drafts"
  ON public.patent_drafts FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE IF EXISTS public.pitch_decks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own pitch decks" ON public.pitch_decks;
CREATE POLICY "Users can view own pitch decks"
  ON public.pitch_decks FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own pitch decks" ON public.pitch_decks;
CREATE POLICY "Users can create own pitch decks"
  ON public.pitch_decks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own pitch decks" ON public.pitch_decks;
CREATE POLICY "Users can update own pitch decks"
  ON public.pitch_decks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own pitch decks" ON public.pitch_decks;
CREATE POLICY "Users can delete own pitch decks"
  ON public.pitch_decks FOR DELETE
  USING (auth.uid() = user_id);

-- 5. STUDENT PROJECTS & PORTFOLIO
ALTER TABLE IF EXISTS public.student_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published projects are viewable by everyone" ON public.student_projects;
CREATE POLICY "Published projects are viewable by everyone"
  ON public.student_projects FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON public.student_projects;
CREATE POLICY "Users can insert own projects"
  ON public.student_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON public.student_projects;
CREATE POLICY "Users can update own projects"
  ON public.student_projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON public.student_projects;
CREATE POLICY "Users can delete own projects"
  ON public.student_projects FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE IF EXISTS public.project_upvotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Upvotes are viewable by all" ON public.project_upvotes;
CREATE POLICY "Upvotes are viewable by all"
  ON public.project_upvotes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own upvotes" ON public.project_upvotes;
CREATE POLICY "Users can insert own upvotes"
  ON public.project_upvotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own upvotes" ON public.project_upvotes;
CREATE POLICY "Users can delete own upvotes"
  ON public.project_upvotes FOR DELETE
  USING (auth.uid() = user_id);

-- 6. STUDY GROUPS & CIRCLES
ALTER TABLE IF EXISTS public.study_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Study groups are viewable by everyone" ON public.study_groups;
CREATE POLICY "Study groups are viewable by everyone"
  ON public.study_groups FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create study groups" ON public.study_groups;
CREATE POLICY "Authenticated users can create study groups"
  ON public.study_groups FOR INSERT
  WITH CHECK (auth.uid() = created_by);

ALTER TABLE IF EXISTS public.study_group_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Study group memberships are viewable by everyone" ON public.study_group_members;
CREATE POLICY "Study group memberships are viewable by everyone"
  ON public.study_group_members FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can join study groups" ON public.study_group_members;
CREATE POLICY "Users can join study groups"
  ON public.study_group_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave study groups" ON public.study_group_members;
CREATE POLICY "Users can leave study groups"
  ON public.study_group_members FOR DELETE
  USING (auth.uid() = user_id);

-- 7. CHALLENGE SUBMISSIONS & RECRUITER TALENT
ALTER TABLE IF EXISTS public.challenge_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own challenge submissions" ON public.challenge_submissions;
CREATE POLICY "Users can view own challenge submissions"
  ON public.challenge_submissions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own challenge submissions" ON public.challenge_submissions;
CREATE POLICY "Users can insert own challenge submissions"
  ON public.challenge_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE IF EXISTS public.student_resumes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own resume" ON public.student_resumes;
CREATE POLICY "Users can view own resume"
  ON public.student_resumes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own resume" ON public.student_resumes;
CREATE POLICY "Users can manage own resume"
  ON public.student_resumes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 8. PUBLIC CURRICULUM CATALOGS (Strict Read-Only for Anonymous/Authenticated)
ALTER TABLE IF EXISTS public.subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view subjects" ON public.subjects;
CREATE POLICY "Public can view subjects" ON public.subjects FOR SELECT USING (true);

ALTER TABLE IF EXISTS public.lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published lessons" ON public.lessons;
CREATE POLICY "Public can view published lessons" ON public.lessons FOR SELECT USING (is_published = true);

ALTER TABLE IF EXISTS public.polymer_database ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view polymer database" ON public.polymer_database;
CREATE POLICY "Public can view polymer database" ON public.polymer_database FOR SELECT USING (true);
