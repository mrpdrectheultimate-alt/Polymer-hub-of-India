-- Sprint 0A-R2Q: Academic Quality Review & Mapping Governance Schema
-- Adds academic review status, mapping confidence, relevance scores, and mapping levels

ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS academic_review_status text NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS relevance_score int DEFAULT 4,
ADD COLUMN IF NOT EXISTS academic_reviewed_at timestamptz,
ADD COLUMN IF NOT EXISTS academic_reviewed_by text DEFAULT 'academic_curator',
ADD COLUMN IF NOT EXISTS academic_review_notes text,
ADD COLUMN IF NOT EXISTS mapping_confidence text DEFAULT 'unreviewed',
ADD COLUMN IF NOT EXISTS mapping_level text DEFAULT 'subject';

-- Update RLS Policy: Only show published videos that are approved or approved_with_caveat
DROP POLICY IF EXISTS "Allow public read access to published videos" ON public.videos;
DROP POLICY IF EXISTS "Allow public read access to academically approved videos" ON public.videos;
CREATE POLICY "Allow public read access to academically approved videos"
ON public.videos FOR SELECT
USING (
  status = 'published' 
  AND embed_status IN ('working', 'blocked')
  AND academic_review_status IN ('approved', 'approved_with_caveat')
);
