-- supabase/migrations/20260803000001_enterprise_features.sql

-- 1. Extend profiles with recruiter status
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS is_recruiter BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS recruiter_company TEXT DEFAULT null;

-- 2. Sponsored Challenges table
CREATE TABLE IF NOT EXISTS public.sponsored_challenges (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  company_name    TEXT NOT NULL,
  description     TEXT NOT NULL,
  prize_pool      TEXT NOT NULL,
  difficulty      TEXT NOT NULL CHECK (difficulty in ('Easy', 'Medium', 'Hard')) DEFAULT 'Medium',
  deadline        TIMESTAMPTZ NOT NULL,
  criteria        TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 3. Challenge Submissions table
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id    UUID NOT NULL REFERENCES public.sponsored_challenges(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  solution_text   TEXT NOT NULL,
  solution_url    TEXT,
  status          TEXT NOT NULL CHECK (status in ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  review_feedback TEXT,
  xp_rewarded     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  reviewed_at     TIMESTAMPTZ,
  UNIQUE(user_id, challenge_id)
);

-- 4. Enterprise inquiries table
CREATE TABLE IF NOT EXISTS public.enterprise_inquiries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name    TEXT NOT NULL,
  contact_name    TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT,
  interest_area   TEXT NOT NULL,
  message         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable RLS
ALTER TABLE public.sponsored_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_inquiries ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies
DROP POLICY IF EXISTS "Challenges public readable" ON public.sponsored_challenges;
CREATE POLICY "Challenges public readable" ON public.sponsored_challenges
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Recruiters manage own challenges" ON public.sponsored_challenges;
CREATE POLICY "Recruiters manage own challenges" ON public.sponsored_challenges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_recruiter = true
      AND profiles.recruiter_company = sponsored_challenges.company_name
    )
  );

DROP POLICY IF EXISTS "Users manage own submissions" ON public.challenge_submissions;
CREATE POLICY "Users manage own submissions" ON public.challenge_submissions
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Recruiters view submissions to own company" ON public.challenge_submissions;
CREATE POLICY "Recruiters view submissions to own company" ON public.challenge_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.sponsored_challenges c ON c.company_name = p.recruiter_company
      WHERE p.id = auth.uid()
      AND p.is_recruiter = true
      AND c.id = challenge_submissions.challenge_id
    )
  );

DROP POLICY IF EXISTS "Recruiters update submissions to own company" ON public.challenge_submissions;
CREATE POLICY "Recruiters update submissions to own company" ON public.challenge_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.sponsored_challenges c ON c.company_name = p.recruiter_company
      WHERE p.id = auth.uid()
      AND p.is_recruiter = true
      AND c.id = challenge_submissions.challenge_id
    )
  );

DROP POLICY IF EXISTS "Public can submit inquiries" ON public.enterprise_inquiries;
CREATE POLICY "Public can submit inquiries" ON public.enterprise_inquiries
  FOR INSERT WITH CHECK (true);

-- 7. Seed initial challenges
INSERT INTO public.sponsored_challenges (title, company_name, description, prize_pool, difficulty, deadline, criteria)
VALUES 
  (
    'Sustainable Biodegradable Plasticizer Formulation',
    'Reliance Industries',
    'Design an eco-friendly plasticizer formulation for PVC sheets that maintains thermal stability and high tensile properties while matching mechanical performance of traditional phthalates. Submissions must explain raw material pathways, compounding temperature profiles, and biodegradability test compliance.',
    '₹50,000 + Pre-placement Internship Interview',
    'Hard',
    now() + INTERVAL '30 days',
    'Raw material efficiency, compliance with ISO 14855 standards, cost-feasibility breakdown, and structural simulation parameters.'
  ),
  (
    'Automotive Bumper Injection Mould Cycle Time Optimization',
    'Supreme Industries',
    'Optimize the cooling layout and runner configuration of an automotive bumper injection mold. Provide gate positions, filling patterns, and active parameter modifications (injection speed, hold pressure) to reduce total cycle time from 62 seconds to under 48 seconds without structural warpage.',
    '₹1,00,000 + Placement Interview',
    'Medium',
    now() + INTERVAL '45 days',
    'Cycle time minimization, warpage deformation threshold below 1.5mm, and detailed gate layout drawings/formulas.'
  ),
  (
    'Recycled PET (rPET) Food-Grade Processing Line',
    'Reliance Industries',
    'Design a complete processing line to convert post-consumer PET bottles into food-grade rPET pellets. Include decontamination steps, solid-state polymerization (SSP) parameters, and quality control checkpoints. Address economic viability and production capacity targets.',
    '₹75,000 + Pre-placement Internship Interview',
    'Hard',
    now() + INTERVAL '60 days',
    'Decontamination efficiency, SSP process optimization, cost per kg analysis, and compliance with FDA/EFSA food-contact standards.'
  )
ON CONFLICT DO NOTHING;

-- 8. Add award_xp function for Postgres RPC execution
CREATE OR REPLACE FUNCTION public.award_xp(user_id UUID, amount INTEGER, reason TEXT, ref TEXT DEFAULT 'enterprise_challenge')
RETURNS VOID AS $$
BEGIN
  -- Insert into xp_log with unique safety checks
  INSERT INTO public.xp_log (user_id, xp_earned, action, reference)
  VALUES (user_id, amount, reason, ref)
  ON CONFLICT (user_id, action, reference) DO NOTHING;

  -- Update profiles
  UPDATE public.profiles
  SET xp_points = COALESCE(xp_points, 0) + amount
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
