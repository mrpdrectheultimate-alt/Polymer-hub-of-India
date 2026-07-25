-- ============================================================
-- POLYMERHUB — CURRICULUM & PROGRESSION HARDENING MIGRATION
-- Migration: 20260725_curriculum_progression_hardening.sql
-- ============================================================

-- 1. Ensure unique index on user_progress (user_id, lesson_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_progress_user_lesson ON public.user_progress (user_id, lesson_id);

-- 2. Ensure RLS is active on subjects and lessons
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published subjects" ON public.subjects;
CREATE POLICY "Public can view published subjects"
  ON public.subjects FOR SELECT
  USING (is_published = true OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public can view published lessons" ON public.lessons;
CREATE POLICY "Public can view published lessons"
  ON public.lessons FOR SELECT
  USING (is_published = true OR auth.role() = 'service_role');

-- 3. Stored RPC function for user subject progress percentage
CREATE OR REPLACE FUNCTION public.get_user_subject_progress(
  p_user_id UUID,
  p_subject_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_total_published INT;
  v_completed_count INT;
  v_percentage NUMERIC;
BEGIN
  -- Count total accessible published lessons in subject
  SELECT COUNT(*) INTO v_total_published
  FROM public.lessons
  WHERE subject_id = p_subject_id AND is_published = true;

  IF v_total_published = 0 THEN
    RETURN jsonb_build_object(
      'total_lessons', 0,
      'completed_lessons', 0,
      'progress_percentage', 0
    );
  END IF;

  -- Count user's completed published lessons in subject
  SELECT COUNT(DISTINCT up.lesson_id) INTO v_completed_count
  FROM public.user_progress up
  JOIN public.lessons l ON l.id = up.lesson_id
  WHERE up.user_id = p_user_id
    AND l.subject_id = p_subject_id
    AND l.is_published = true
    AND (up.status = 'completed' OR up.quiz_passed = true);

  v_percentage := ROUND((v_completed_count::NUMERIC / v_total_published::NUMERIC) * 100, 2);

  RETURN jsonb_build_object(
    'total_lessons', v_total_published,
    'completed_lessons', v_completed_count,
    'progress_percentage', v_percentage
  );
END;
$$;
