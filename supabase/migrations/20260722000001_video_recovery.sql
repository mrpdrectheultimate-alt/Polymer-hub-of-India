-- Sprint 0A-R: Real Video Recovery Migration
-- Adds publishing status, embed tracking, canonical URLs, and verification timestamps

ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
ADD COLUMN IF NOT EXISTS embed_status text NOT NULL DEFAULT 'working',
ADD COLUMN IF NOT EXISTS checked_at timestamptz DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS canonical_url text,
ADD COLUMN IF NOT EXISTS external_video_id text,
ADD COLUMN IF NOT EXISTS provider text DEFAULT 'youtube',
ADD COLUMN IF NOT EXISTS source_organization text,
ADD COLUMN IF NOT EXISTS verification_notes text,
ADD COLUMN IF NOT EXISTS failure_reason text;

-- Add index on status and embed_status for fast queries
CREATE INDEX IF NOT EXISTS idx_videos_published_status ON public.videos (status, embed_status);

-- RLS Policy: Allow public read access to published videos only
DROP POLICY IF EXISTS "Allow public read access to published videos" ON public.videos;
CREATE POLICY "Allow public read access to published videos"
ON public.videos FOR SELECT
USING (status = 'published' AND embed_status IN ('working', 'blocked'));
