-- Migration: Review Status Governance & Governance Status Column

-- 1. Drop existing constraint if present and recreate safely
ALTER TABLE public.lessons
DROP CONSTRAINT IF EXISTS lessons_review_status_check;

ALTER TABLE public.lessons
ADD CONSTRAINT lessons_review_status_check
CHECK (review_status IN (
  'pending',
  'needs_light_revision',
  'needs_deep_revision',
  'rewrite_required',
  'internally_reviewed',
  'internally_approved',
  'externally_approved',
  'approved',
  'archived'
));

-- 2. Add review_governance_status column to lessons table
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS review_governance_status text DEFAULT 'internally_curated'
CHECK (review_governance_status IN (
  'not_reviewed',
  'internally_curated',
  'external_review_pending',
  'externally_verified'
));

-- 3. Add regulatory_verification_status column to lessons table
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS regulatory_verification_status text DEFAULT 'not_applicable'
CHECK (regulatory_verification_status IN (
  'not_applicable',
  'verification_pending',
  'verified_current'
));
