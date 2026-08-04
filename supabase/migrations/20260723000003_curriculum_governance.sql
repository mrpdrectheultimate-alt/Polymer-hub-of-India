-- Sprint 1A: Curriculum Governance Schema Additions

ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS module_name text,
ADD COLUMN IF NOT EXISTS level text DEFAULT 'foundation',
ADD COLUMN IF NOT EXISTS quality_score integer,
ADD COLUMN IF NOT EXISTS review_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
ADD COLUMN IF NOT EXISTS reviewed_by text,
ADD COLUMN IF NOT EXISTS last_verified_at timestamptz,
ADD COLUMN IF NOT EXISTS version integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS prerequisites text[],
ADD COLUMN IF NOT EXISTS estimated_minutes integer;

-- Check Constraints
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_lessons_level') THEN
    ALTER TABLE public.lessons 
    ADD CONSTRAINT chk_lessons_level 
    CHECK (level IN ('foundation', 'intermediate', 'advanced', 'industrial', 'research'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_lessons_review_status') THEN
    ALTER TABLE public.lessons 
    ADD CONSTRAINT chk_lessons_review_status 
    CHECK (review_status IN ('pending', 'needs_light_revision', 'needs_deep_revision', 'rewrite_required', 'approved', 'archived'));
  END IF;
END $$;
