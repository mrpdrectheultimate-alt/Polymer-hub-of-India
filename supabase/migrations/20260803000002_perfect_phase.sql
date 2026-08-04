-- supabase/migrations/20260803000002_perfect_phase.sql

-- 1. 3D Models Table
CREATE TABLE IF NOT EXISTS public.three_d_models (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category in ('material', 'product', 'molecule', 'machine')),
  material_slug   TEXT,
  model_type      TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.three_d_models ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "3D models publicly readable" ON public.three_d_models;
CREATE POLICY "3D models publicly readable" ON public.three_d_models FOR SELECT USING (true);

-- 2. Student Projects Table
CREATE TABLE IF NOT EXISTS public.student_projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category in ('research', 'design', 'processing', 'recycling', 'product')),
  status          TEXT NOT NULL CHECK (status in ('draft', 'published', 'archived')) DEFAULT 'published',
  image_url       TEXT,
  github_url      TEXT,
  team_members    TEXT[] DEFAULT '{}',
  guide_name      TEXT,
  guide_org       TEXT,
  tags            TEXT[] DEFAULT '{}',
  upvotes         INTEGER DEFAULT 0,
  views           INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Project Upvotes track table to prevent double upvoting
CREATE TABLE IF NOT EXISTS public.project_upvotes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id      UUID NOT NULL REFERENCES public.student_projects(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, project_id)
);

-- Project Comments Table
CREATE TABLE IF NOT EXISTS public.project_comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES public.student_projects(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_text    TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Projects readable by all" ON public.student_projects;
CREATE POLICY "Projects readable by all" ON public.student_projects FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Users manage own projects" ON public.student_projects;
CREATE POLICY "Users manage own projects" ON public.student_projects FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Upvotes readable by all" ON public.project_upvotes;
CREATE POLICY "Upvotes readable by all" ON public.project_upvotes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users submit own upvotes" ON public.project_upvotes;
CREATE POLICY "Users submit own upvotes" ON public.project_upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Comments readable by all" ON public.project_comments;
CREATE POLICY "Comments readable by all" ON public.project_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users insert own comments" ON public.project_comments;
CREATE POLICY "Users insert own comments" ON public.project_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Lesson Notes Table
CREATE TABLE IF NOT EXISTS public.user_lesson_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_slug     TEXT NOT NULL,
  content         TEXT NOT NULL,
  note_title      TEXT DEFAULT 'Untitled Note',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_slug)
);

ALTER TABLE public.user_lesson_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own notes" ON public.user_lesson_notes;
CREATE POLICY "Users manage own notes" ON public.user_lesson_notes FOR ALL USING (auth.uid() = user_id);

-- 4. Seed 3D Models
INSERT INTO public.three_d_models (name, description, category, material_slug, model_type) VALUES
  ('Polyethylene (PE) Molecule', 'Linear polymer chain showing repeating carbon-carbon backbones with tetrahedral hydrogen atoms. Used in packaging, bottles, and films.', 'molecule', 'polyethylene', 'molecule_pe'),
  ('Polypropylene (PP) Molecule', 'Polymer chain showing repeating propane monomers with methyl branchings along the linear chain. Used in automotive, packaging, and textiles.', 'molecule', 'polypropylene', 'molecule_pp'),
  ('PVC Molecule', 'Aromatic chain showing repeating vinyl chloride monomers with chlorine atoms. Used in pipes, cables, and window profiles.', 'molecule', 'pvc', 'molecule_pvc'),
  ('Nylon 6,6 Molecule', 'Hydrogen-bonding polymers showcasing nylon linkages and amide backbones. Used in gears, ropes, and textiles.', 'molecule', 'nylon-66', 'molecule_nylon'),
  ('PET Water Bottle', 'Water bottle design made of high density blow-molded Polyethylene Terephthalate. Common in beverage packaging.', 'product', 'pet', 'product_bottle'),
  ('Automotive Bumper', 'Tough bumper design using impact-modified PP composite. Common in modern vehicles for lightweighting.', 'product', 'polypropylene', 'product_bumper'),
  ('Extrusion Screw & Barrel', 'Barrel and rotating helical screw design showcasing compounding process principles. Core of polymer processing.', 'machine', null, 'machine_extruder')
ON CONFLICT DO NOTHING;

-- 5. Seed Student Projects dynamically if a user exists
DO $$
DECLARE
  first_user_id UUID;
BEGIN
  SELECT id INTO first_user_id FROM auth.users LIMIT 1;
  IF first_user_id IS NOT NULL THEN
    INSERT INTO public.student_projects (user_id, title, description, category, image_url, tags, guide_name, guide_org) VALUES
      (
        first_user_id,
        'PET Bottle to rPET Recycling Line',
        'Designed a complete recycling line converting post-consumer PET bottles into food-grade rPET pellets. Includes decontamination, SSP, and quality control checkpoints.',
        'recycling',
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
        ARRAY['recycling', 'PET', 'sustainability'],
        'Dr. Rajesh Kumar',
        'CIPET Ahmedabad'
      ),
      (
        first_user_id,
        'Injection Molding Cycle Time Optimization',
        'Optimized cooling layout and runner configuration for automotive bumper injection mold. Reduced cycle time from 62s to 45s without warpage.',
        'processing',
        'https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=400',
        ARRAY['injection molding', 'optimization', 'automotive'],
        'Mr. Suresh Patel',
        'Supreme Industries'
      ),
      (
        first_user_id,
        'Biodegradable Packaging from PLA',
        'Developed PLA-based food packaging with enhanced barrier properties. Meets EN 13432 compostability standards.',
        'product',
        'https://images.unsplash.com/photo-1579021241074-3ab7e854742a?w=400',
        ARRAY['PLA', 'biodegradable', 'packaging'],
        'Dr. Priya Mehta',
        'Reliance Industries'
      )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
