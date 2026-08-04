-- ============================================================
-- POLYMERHUB — INDUSTRY & CAREER HUB SCHEMA
-- Phase 13: Job listings and user resume profiles
-- ============================================================

-- ── 1. JOB AND INTERNSHIP LISTINGS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.career_listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  company         TEXT NOT NULL,
  location        TEXT NOT NULL,
  type            TEXT NOT NULL CHECK (type in ('Full-time', 'Internship')),
  salary          TEXT NOT NULL,
  description     TEXT NOT NULL,
  application_url TEXT NOT NULL,
  subject_slug    TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.career_listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Careers publicly readable" ON public.career_listings;
CREATE POLICY "Careers publicly readable" 
  ON public.career_listings FOR SELECT USING (true);

-- ── 2. RESUME PROFILES ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resume_profiles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name  TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  education  JSONB DEFAULT '[]', -- Array of { degree, institute, year }
  experience JSONB DEFAULT '[]', -- Array of { role, company, duration, desc }
  projects   JSONB DEFAULT '[]', -- Array of { name, tech, desc }
  skills     TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.resume_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own resume" ON public.resume_profiles;
CREATE POLICY "Users manage own resume" 
  ON public.resume_profiles FOR ALL USING (auth.uid() = user_id);

-- ── 3. SEEDING CAREER OPPORTUNITIES ─────────────────────────────────────────
INSERT INTO public.career_listings (title, company, location, type, salary, description, application_url, subject_slug) VALUES
('Polymer Process Engineer', 'Reliance Industries', 'Jamnagar, Gujarat', 'Full-time', '₹8-12 LPA', 'Responsible for managing and optimizing polymer production lines (PP/PE). Troubleshoot extrusion outputs, monitor temperature profiles, and ensure compliance with ISO standards.', 'https://reliance.careers/jobs/polymer-process-engineer', 'polymer-processing'),
('Injection Molding Intern', 'Supreme Industries', 'Mumbai, Maharashtra', 'Internship', '₹25,000/month', 'Assist in mold installation, parameters calibration, and defect analysis (warpage, sink marks). Ideal for final-year students looking for hands-on machine experience.', 'https://supreme.co.in/careers/intern-molding', 'mould-design'),
('Research Assistant', 'CIPET', 'Chennai, Tamil Nadu', 'Full-time', '₹6-8 LPA', 'Work on sustainable biopolymer packaging projects. Perform thermal analysis (DSC, TGA) and barrier property testing. M.Tech / B.Tech in Polymer Tech preferred.', 'https://cipet.gov.in/careers/research-assistant-biopolymers', 'sustainable-plastics'),
('Moldflow Simulation Intern', 'Motherson Sumi', 'Noida, UP', 'Internship', '₹30,000/month', 'Conduct cavity filling, packing, and cooling simulations for automotive plastics parts. Analyze weld line positions and gate layout optimizations.', 'https://motherson.careers/moldflow-simulation-intern', 'mould-design'),
('Extrusion Process Lead', 'Astral Pipes', 'Ahmedabad, Gujarat', 'Full-time', '₹10-15 LPA', 'Lead extrusion lines for uPVC and CPVC pipe manufacturing. Manage die configurations, screw speeds, and active compounding recipes to ensure high quality.', 'https://astralpipes.com/careers/extrusion-process-lead', 'polymer-processing')
ON CONFLICT DO NOTHING;
