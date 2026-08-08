-- supabase/migrations/20260808000001_3d_labs_expansion.sql

-- Add columns to three_d_models
ALTER TABLE public.three_d_models
  ADD COLUMN IF NOT EXISTS model_data JSONB,
  ADD COLUMN IF NOT EXISTS animation_url TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[],
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'beginner',
  ADD COLUMN IF NOT EXISTS related_lesson_slug TEXT,
  ADD COLUMN IF NOT EXISTS is_animated BOOLEAN DEFAULT false;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_three_d_models_category ON three_d_models(category);
CREATE INDEX IF NOT EXISTS idx_three_d_models_tags ON three_d_models USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_three_d_models_difficulty ON three_d_models(difficulty);
