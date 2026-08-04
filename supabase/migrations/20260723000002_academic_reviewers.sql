-- Migration: Academic Reviewers Schema & Foreign Key Mapping

CREATE TABLE IF NOT EXISTS public.academic_reviewers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  role_title text,
  institution text,
  qualification_summary text,
  credential_reference text,
  verification_status text NOT NULL DEFAULT 'pending',
  verified_at timestamptz,
  conflict_of_interest_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS academic_reviewer_id uuid
REFERENCES public.academic_reviewers(id);
