-- Migration: Normalized Curriculum Modules Entity & Lesson FK Mappings

CREATE TABLE IF NOT EXISTS public.curriculum_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  sequence_number integer NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (subject_id, slug),
  UNIQUE (subject_id, sequence_number)
);

ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS module_id uuid
REFERENCES public.curriculum_modules(id);

-- Update lesson_revisions table to support complete snapshot metadata
ALTER TABLE public.lesson_revisions
ADD COLUMN IF NOT EXISTS module_id uuid,
ADD COLUMN IF NOT EXISTS module_name text,
ADD COLUMN IF NOT EXISTS level text,
ADD COLUMN IF NOT EXISTS quiz_snapshot jsonb,
ADD COLUMN IF NOT EXISTS source_list_snapshot jsonb;

-- Update lesson_sources table to support full academic citation fields
ALTER TABLE public.lesson_sources
ADD COLUMN IF NOT EXISTS url text,
ADD COLUMN IF NOT EXISTS publication_date text,
ADD COLUMN IF NOT EXISTS verified_at timestamptz DEFAULT now();
