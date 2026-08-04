-- ============================================================
-- POLYMERHUB — MATERIALS DATABASE & COMPARATOR HARDENING
-- Migration: 20260725_materials_comparator_hardening.sql
-- ============================================================

-- 1. Materials table with unique slug constraint
CREATE TABLE IF NOT EXISTS public.materials (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,
  family              TEXT NOT NULL,
  type                TEXT NOT NULL CHECK (type IN ('commodity', 'engineering', 'specialty', 'elastomer', 'bioplastic')),
  density             NUMERIC CHECK (density IS NULL OR density > 0),
  tensile_strength    NUMERIC CHECK (tensile_strength IS NULL OR tensile_strength >= 0),
  flexural_modulus    NUMERIC CHECK (flexural_modulus IS NULL OR flexural_modulus >= 0),
  melt_temp           NUMERIC CHECK (melt_temp IS NULL OR melt_temp >= 0),
  heat_deflection_temp NUMERIC CHECK (heat_deflection_temp IS NULL OR heat_deflection_temp >= 0),
  water_absorption    NUMERIC CHECK (water_absorption IS NULL OR water_absorption >= 0),
  shrinkage           NUMERIC CHECK (shrinkage IS NULL OR shrinkage >= 0),
  top_applications    TEXT[],
  indian_trade_names  TEXT[],
  is_published        BOOLEAN DEFAULT TRUE,
  is_premium          BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_materials_slug ON public.materials (slug);
CREATE INDEX IF NOT EXISTS idx_materials_family ON public.materials (family);
CREATE INDEX IF NOT EXISTS idx_materials_type ON public.materials (type);

-- 2. Row Level Security
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published materials" ON public.materials;
CREATE POLICY "Public can view published materials"
  ON public.materials FOR SELECT
  USING (is_published = true OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins manage materials" ON public.materials;
CREATE POLICY "Admins manage materials"
  ON public.materials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'organization_owner')
    )
  );
