-- supabase/migrations/20260819000000_lessons_visual_overhaul.sql
-- Add image fields to lessons
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS concept_images JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS product_images JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS machine_images JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS formula_spacing TEXT DEFAULT '1.8';
