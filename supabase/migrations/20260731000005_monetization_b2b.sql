-- ============================================================
-- POLYMERHUB — MONETIZATION & B2B LICENSE MIGRATION
-- Migration: 20260731000005_monetization_b2b.sql
-- ============================================================

-- 1. Extend profiles table with HOD status
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS is_hod BOOLEAN DEFAULT false;

-- 2. Institution licenses table
CREATE TABLE IF NOT EXISTS public.institution_licenses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_name    TEXT UNIQUE NOT NULL,
  total_seats     INTEGER NOT NULL DEFAULT 0,
  allocated_seats INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE public.institution_licenses ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Licenses viewable by associated HODs" ON public.institution_licenses;
CREATE POLICY "Licenses viewable by associated HODs"
  ON public.institution_licenses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_hod = true 
      AND profiles.college_name = institution_licenses.college_name
    )
  );

DROP POLICY IF EXISTS "Licenses modifiable by service role" ON public.institution_licenses;
CREATE POLICY "Licenses modifiable by service role"
  ON public.institution_licenses
  FOR ALL
  USING (auth.role() = 'service_role');

-- 5. Seed default mock licenses for testing
INSERT INTO public.institution_licenses (college_name, total_seats, allocated_seats)
VALUES 
  ('Institute of Chemical Technology, Mumbai', 50, 0),
  ('CIPET, Chennai', 50, 0),
  ('COEP Technological University, Pune', 50, 0)
ON CONFLICT (college_name) DO NOTHING;
