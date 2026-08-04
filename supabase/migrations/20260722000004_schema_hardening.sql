-- Sprint 0A-R3: Schema Hardening & Learning Role Constraints
-- Prevents duplicate YouTube IDs and enforces strict enumeration check constraints

-- 1. Unique index on external_video_id to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS videos_external_video_id_unique
ON public.videos (external_video_id)
WHERE external_video_id IS NOT NULL;

-- 2. Column additions
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS learning_role text DEFAULT 'foundation',
ADD COLUMN IF NOT EXISTS channel_name text,
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS duration_seconds int,
ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- 3. Check constraints (wrapped safely)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_status_check') THEN
    ALTER TABLE public.videos ADD CONSTRAINT videos_status_check
      CHECK (status IN ('draft', 'review', 'published', 'unpublished', 'archived'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_embed_status_check') THEN
    ALTER TABLE public.videos ADD CONSTRAINT videos_embed_status_check
      CHECK (embed_status IN ('unchecked', 'working', 'blocked', 'removed', 'private', 'restricted', 'invalid'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_academic_review_check') THEN
    ALTER TABLE public.videos ADD CONSTRAINT videos_academic_review_check
      CHECK (academic_review_status IN ('pending', 'approved', 'approved_with_caveat', 'remap_required', 'replacement_required', 'rejected'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_mapping_level_check') THEN
    ALTER TABLE public.videos ADD CONSTRAINT videos_mapping_level_check
      CHECK (mapping_level IN ('lesson', 'module', 'subject'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_relevance_score_check') THEN
    ALTER TABLE public.videos ADD CONSTRAINT videos_relevance_score_check
      CHECK (relevance_score IS NULL OR (relevance_score BETWEEN 0 AND 100));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_learning_role_check') THEN
    ALTER TABLE public.videos ADD CONSTRAINT videos_learning_role_check
      CHECK (learning_role IN ('foundation', 'applied', 'case_study', 'future_research'));
  END IF;
END $$;
