-- ==============================================================================
-- POLYMERHUB MASTER RLS & SECURITY MIGRATION (100% IDEMPOTENT & ZERO-ERROR)
-- Safely checks table existence dynamically before applying policies.
-- ==============================================================================

DO $$
BEGIN

  -- 1. PROFILES
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
    CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
    CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;

  -- 2. USER PROGRESS
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_progress') THEN
    ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
    CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
    CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
    CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- 3. QUIZ SUBMISSIONS (Creates if not exists + applies RLS)
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'quiz_submissions') THEN
    CREATE TABLE public.quiz_submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      lesson_slug TEXT,
      score INTEGER,
      total_questions INTEGER,
      passed BOOLEAN DEFAULT false,
      answers JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
  ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Users can view own quiz submissions" ON public.quiz_submissions;
  CREATE POLICY "Users can view own quiz submissions" ON public.quiz_submissions FOR SELECT USING (auth.uid() = user_id);
  DROP POLICY IF EXISTS "Users can insert own quiz submissions" ON public.quiz_submissions;
  CREATE POLICY "Users can insert own quiz submissions" ON public.quiz_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

  -- 4. PAYMENT HISTORY
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payment_history') THEN
    ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can view only own payment history" ON public.payment_history;
    CREATE POLICY "Users can view only own payment history" ON public.payment_history FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- 5. PAYMENT WEBHOOK EVENTS
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payment_webhook_events') THEN
    ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;
  END IF;

  -- 6. PATENT DRAFTS
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'patent_drafts') THEN
    ALTER TABLE public.patent_drafts ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can view own patent drafts" ON public.patent_drafts;
    CREATE POLICY "Users can view own patent drafts" ON public.patent_drafts FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can create own patent drafts" ON public.patent_drafts;
    CREATE POLICY "Users can create own patent drafts" ON public.patent_drafts FOR INSERT WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can update own patent drafts" ON public.patent_drafts;
    CREATE POLICY "Users can update own patent drafts" ON public.patent_drafts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can delete own patent drafts" ON public.patent_drafts;
    CREATE POLICY "Users can delete own patent drafts" ON public.patent_drafts FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- 7. PITCH DECKS
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pitch_decks') THEN
    ALTER TABLE public.pitch_decks ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can view own pitch decks" ON public.pitch_decks;
    CREATE POLICY "Users can view own pitch decks" ON public.pitch_decks FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can create own pitch decks" ON public.pitch_decks;
    CREATE POLICY "Users can create own pitch decks" ON public.pitch_decks FOR INSERT WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can update own pitch decks" ON public.pitch_decks;
    CREATE POLICY "Users can update own pitch decks" ON public.pitch_decks FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can delete own pitch decks" ON public.pitch_decks;
    CREATE POLICY "Users can delete own pitch decks" ON public.pitch_decks FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- 8. STUDENT PROJECTS
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'student_projects') THEN
    ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Published projects are viewable by everyone" ON public.student_projects;
    CREATE POLICY "Published projects are viewable by everyone" ON public.student_projects FOR SELECT USING (status = 'published' OR auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can insert own projects" ON public.student_projects;
    CREATE POLICY "Users can insert own projects" ON public.student_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can update own projects" ON public.student_projects;
    CREATE POLICY "Users can update own projects" ON public.student_projects FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can delete own projects" ON public.student_projects;
    CREATE POLICY "Users can delete own projects" ON public.student_projects FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- 9. PROJECT UPVOTES
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_upvotes') THEN
    ALTER TABLE public.project_upvotes ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Upvotes are viewable by all" ON public.project_upvotes;
    CREATE POLICY "Upvotes are viewable by all" ON public.project_upvotes FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Users can insert own upvotes" ON public.project_upvotes;
    CREATE POLICY "Users can insert own upvotes" ON public.project_upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can delete own upvotes" ON public.project_upvotes;
    CREATE POLICY "Users can delete own upvotes" ON public.project_upvotes FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- 10. STUDY GROUPS
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'study_groups') THEN
    ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Study groups are viewable by everyone" ON public.study_groups;
    CREATE POLICY "Study groups are viewable by everyone" ON public.study_groups FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Authenticated users can create study groups" ON public.study_groups;
    CREATE POLICY "Authenticated users can create study groups" ON public.study_groups FOR INSERT WITH CHECK (auth.uid() = created_by);
  END IF;

  -- 11. STUDY GROUP MEMBERS
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'study_group_members') THEN
    ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Study group memberships are viewable by everyone" ON public.study_group_members;
    CREATE POLICY "Study group memberships are viewable by everyone" ON public.study_group_members FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Users can join study groups" ON public.study_group_members;
    CREATE POLICY "Users can join study groups" ON public.study_group_members FOR INSERT WITH CHECK (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can leave study groups" ON public.study_group_members;
    CREATE POLICY "Users can leave study groups" ON public.study_group_members FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- 12. CHALLENGE SUBMISSIONS
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'challenge_submissions') THEN
    ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can view own challenge submissions" ON public.challenge_submissions;
    CREATE POLICY "Users can view own challenge submissions" ON public.challenge_submissions FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can insert own challenge submissions" ON public.challenge_submissions;
    CREATE POLICY "Users can insert own challenge submissions" ON public.challenge_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- 13. RESUME PROFILES / STUDENT RESUMES
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'resume_profiles') THEN
    ALTER TABLE public.resume_profiles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Users can view own resume" ON public.resume_profiles;
    CREATE POLICY "Users can view own resume" ON public.resume_profiles FOR SELECT USING (auth.uid() = user_id);
    DROP POLICY IF EXISTS "Users can manage own resume" ON public.resume_profiles;
    CREATE POLICY "Users can manage own resume" ON public.resume_profiles FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- 14. PUBLIC CATALOGS (SUBJECTS, LESSONS, VIDEOS)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subjects') THEN
    ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public can view subjects" ON public.subjects;
    CREATE POLICY "Public can view subjects" ON public.subjects FOR SELECT USING (true);
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'lessons') THEN
    ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public can view published lessons" ON public.lessons;
    CREATE POLICY "Public can view published lessons" ON public.lessons FOR SELECT USING (is_published = true);
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'videos') THEN
    ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public can view videos" ON public.videos;
    CREATE POLICY "Public can view videos" ON public.videos FOR SELECT USING (true);
  END IF;

END $$;
