-- Sprint 0A-R3 Batch 2: Verification Governance, Health Checks & Performance Indexes

-- 1. Columns for source provenance & automated health checking
ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'industry_demonstration',
ADD COLUMN IF NOT EXISTS verification_due_at timestamptz,
ADD COLUMN IF NOT EXISTS last_health_check_at timestamptz,
ADD COLUMN IF NOT EXISTS consecutive_health_failures int DEFAULT 0;

-- 2. Indexes for fast public library queries & filtering
CREATE INDEX IF NOT EXISTS videos_public_status_idx
ON public.videos (
  status,
  embed_status,
  academic_review_status
);

CREATE INDEX IF NOT EXISTS videos_subject_idx
ON public.videos (subject_id);

CREATE INDEX IF NOT EXISTS videos_learning_role_idx
ON public.videos (learning_role);

-- 3. Check constraint for source_type
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'videos_source_type_check') THEN
    ALTER TABLE public.videos ADD CONSTRAINT videos_source_type_check
      CHECK (source_type IN ('official_academic', 'third_party_educational', 'industry_demonstration', 'reupload'));
  END IF;
END $$;
