-- Sprint 0A-R2: Detailed Video Audit & Verification Schema Update
-- Adds strict source title preservation, verification timestamps, and manual playback tracking

ALTER TABLE public.videos
ADD COLUMN IF NOT EXISTS source_title text,
ADD COLUMN IF NOT EXISTS display_title text,
ADD COLUMN IF NOT EXISTS thumbnail_url text,
ADD COLUMN IF NOT EXISTS subject_slug text,
ADD COLUMN IF NOT EXISTS oembed_verified_at timestamptz,
ADD COLUMN IF NOT EXISTS thumbnail_verified_at timestamptz,
ADD COLUMN IF NOT EXISTS manual_playback_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS manual_playback_verified_at timestamptz,
ADD COLUMN IF NOT EXISTS verified_by text DEFAULT 'audit_suite_0A_R2';
