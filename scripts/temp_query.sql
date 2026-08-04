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
  advantages          TEXT[],
  disadvantages       TEXT[],
  description         TEXT,
  is_published        BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_materials_slug ON public.materials (slug);
