-- supabase/migrations/20260731000004_gamification_v2.sql
-- 1. Push subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, subscription)
);

-- 2. Study groups table
CREATE TABLE IF NOT EXISTS public.study_groups (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  subject_id  UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  created_by  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. Study group members table
CREATE TABLE IF NOT EXISTS public.study_group_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- 4. Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_members ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS "Users can manage own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can manage own push subscriptions"
  ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public study groups are readable by all" ON public.study_groups;
CREATE POLICY "Public study groups are readable by all"
  ON public.study_groups
  FOR SELECT USING (is_public = true OR auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can create study groups" ON public.study_groups;
CREATE POLICY "Users can create study groups"
  ON public.study_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update own study groups" ON public.study_groups;
CREATE POLICY "Users can update own study groups"
  ON public.study_groups
  FOR UPDATE USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Study group members are readable by members" ON public.study_group_members;
DROP POLICY IF EXISTS "Study group members are readable by all" ON public.study_group_members;
CREATE POLICY "Study group members are readable by all"
  ON public.study_group_members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join study groups" ON public.study_group_members;
CREATE POLICY "Users can join study groups"
  ON public.study_group_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave study groups" ON public.study_group_members;
CREATE POLICY "Users can leave study groups"
  ON public.study_group_members
  FOR DELETE USING (auth.uid() = user_id);
