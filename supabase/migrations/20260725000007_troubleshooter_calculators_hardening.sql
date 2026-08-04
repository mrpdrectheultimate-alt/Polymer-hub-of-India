-- ============================================================
-- POLYMERHUB — TROUBLESHOOTER, CALCULATORS & VIRTUAL LABS HARDENING
-- Migration: 20260725_troubleshooter_calculators_hardening.sql
-- ============================================================

-- 1. Create defect troubleshooter database table
CREATE TABLE IF NOT EXISTS public.defect_troubleshooter (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  defect_name   TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  category      TEXT NOT NULL CHECK (category IN ('injection_moulding', 'extrusion', 'blow_moulding', 'thermoforming')),
  root_causes   TEXT[] NOT NULL,
  remedies      TEXT[] NOT NULL,
  is_published  BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.defect_troubleshooter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published defects" ON public.defect_troubleshooter;
CREATE POLICY "Public can view published defects"
  ON public.defect_troubleshooter FOR SELECT
  USING (is_published = true OR auth.role() = 'service_role');

-- 2. Create virtual lab experiment logs table
CREATE TABLE IF NOT EXISTS public.virtual_lab_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lab_name        TEXT NOT NULL,
  parameters_used JSONB NOT NULL,
  results_output  JSONB NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.virtual_lab_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own lab logs" ON public.virtual_lab_logs;
CREATE POLICY "Users view own lab logs"
  ON public.virtual_lab_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own lab logs" ON public.virtual_lab_logs;
CREATE POLICY "Users insert own lab logs"
  ON public.virtual_lab_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
