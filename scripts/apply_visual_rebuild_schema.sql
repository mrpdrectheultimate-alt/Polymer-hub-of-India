-- scripts/apply_visual_rebuild_schema.sql
-- Add image fields to library_books
ALTER TABLE public.library_books
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
  ADD COLUMN IF NOT EXISTS chapter_images JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS topic_images JSONB DEFAULT '{}';

-- Add image fields to lessons
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS concept_images JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS process_images JSONB DEFAULT '[]';

-- Add image fields to materials
ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS molecular_image_url TEXT,
  ADD COLUMN IF NOT EXISTS product_images JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS processing_images JSONB DEFAULT '[]';
