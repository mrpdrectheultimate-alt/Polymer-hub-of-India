-- ============================================================
-- POLYMERHUB — RESEARCH & PATENT HUB SCHEMA
-- Phase 12: Research publications, Patents, Drafts, and pitches
-- ============================================================

-- ── 1. ACADEMIC RESEARCH PAPERS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.research_papers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  authors          TEXT NOT NULL,
  journal          TEXT NOT NULL,
  publication_year INT NOT NULL,
  doi              TEXT,
  abstract         TEXT NOT NULL,
  subject_slug     TEXT,
  pdf_url          TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.research_papers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Research papers publicly readable" ON public.research_papers;
CREATE POLICY "Research papers publicly readable" 
  ON public.research_papers FOR SELECT USING (true);

-- ── 2. PATENT REGISTRY ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.patents (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patent_number    TEXT UNIQUE NOT NULL,
  title            TEXT NOT NULL,
  inventors        TEXT NOT NULL,
  assignee         TEXT,
  filing_date      DATE,
  publication_date DATE,
  status           TEXT NOT NULL CHECK (status in ('pending', 'published', 'granted')),
  abstract         TEXT NOT NULL,
  claims           TEXT[] NOT NULL,
  jurisdiction     TEXT NOT NULL CHECK (jurisdiction in ('India', 'US', 'PCT')),
  subject_slug     TEXT,
  created_at       TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.patents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Patents publicly readable" ON public.patents;
CREATE POLICY "Patents publicly readable" 
  ON public.patents FOR SELECT USING (true);

-- ── 3. PATENT DRAFTS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.patent_drafts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title              TEXT NOT NULL DEFAULT 'Untitled Patent Draft',
  field_of_invention TEXT,
  abstract           TEXT,
  description        TEXT,
  claims             JSONB DEFAULT '[]', -- Array of claims (strings)
  status             TEXT NOT NULL CHECK (status in ('draft', 'submitted')),
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.patent_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own drafts" ON public.patent_drafts;
CREATE POLICY "Users manage own drafts" 
  ON public.patent_drafts FOR ALL USING (auth.uid() = user_id);

-- ── 4. RESEARCH PITCHE COLLABORATIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.research_pitches (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  subject_slug TEXT,
  contact_info TEXT NOT NULL,
  status       TEXT NOT NULL CHECK (status in ('open', 'closed')),
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.research_pitches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Pitches publicly readable" ON public.research_pitches;
CREATE POLICY "Pitches publicly readable" 
  ON public.research_pitches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own pitches" ON public.research_pitches;
CREATE POLICY "Users manage own pitches" 
  ON public.research_pitches FOR ALL USING (auth.uid() = user_id);


-- ── 5. SEEDING SECTIONS ─────────────────────────────────────────────────────

-- Seed 5 Academic Papers
INSERT INTO public.research_papers (title, authors, journal, publication_year, doi, abstract, subject_slug) VALUES
('Advances in PLA Biodegradation Pathways', 'Kumar, S., Singh, R.', 'Polymer Degradation & Stability', 2025, '10.1016/j.polymdegradstab.2025.123456', 'Detailed study on chemical and biological mechanisms of PLA degradation under industrial composting conditions. Evaluates microbial enzyme efficiency and degradation times.', 'recycling-technology'),
('Carbon Nanotube Reinforced Polymer Composites', 'Zhang, W., Li, J.', 'Composites Science & Technology', 2024, '10.1016/j.compscitech.2024.987654', 'Investigation of dispersion behavior and mechanical performance enhancements of multi-walled carbon nanotubes in epoxy matrices. Demonstrates a 45% increase in tensile strength.', 'polymer-composites'),
('Novel Flame Retardant Additives for Polypropylene', 'Patel, A., Shah, M.', 'Fire Safety Journal', 2025, '10.1016/j.firesaf.2025.111222', 'Synthesizing halogen-free flame retardants to improve limiting oxygen index of PP compounds. Shows zero-dripping behaviors in vertical burn tests.', 'additives-compounding'),
('Sustainable Packaging: The Rise of PHA', 'Mehta, P., Reddy, K.', 'Green Chemistry', 2024, '10.1039/d4gc000123', 'Analyzing polyhydroxyalkanoates (PHA) synthesis from microbial sources and its mechanical profile for high-barrier films. Compares permeability attributes against classic LDPE.', 'plastic-packaging-engineering'),
('Digital Twins in Injection Molding', 'Sharma, R., Gupta, V.', 'Polymer Engineering & Science', 2025, '10.1002/pen.2025.333444', 'Utilizing real-time sensor data from cavity transducers to construct digital twins predicting warpage. Saves up to 25% tooling commissioning times.', 'digital-twins-plastics')
ON CONFLICT DO NOTHING;

-- Seed 5 Patents
INSERT INTO public.patents (patent_number, title, inventors, assignee, filing_date, publication_date, status, abstract, claims, jurisdiction, subject_slug) VALUES
('IN2025P000123', 'High-Barrier Multi-layer Packaging Film', 'Desai, R., Kumar, A.', 'NextGen Packaging India', '2024-05-10', '2025-01-15', 'granted', 'A co-extruded five-layer flexible film structure comprising EVOH and polyamide cores for enhanced barrier properties against oxygen.', ARRAY['A co-extruded five-layer flexible film structure.', 'The structure of claim 1 where the core layer is EVOH.', 'The structure of claim 1 where outer layers are metallocene LLDPE.'], 'India', 'plastic-packaging-engineering'),
('US2025P004567', 'Bio-based Flame Retardant Composition', 'Patel, N., Singh, M.', 'EcoMaterials LLC', '2024-06-12', '2025-02-18', 'published', 'A bio-derived intumescent flame retardant composition comprising starch-based phosphates for thermoplastics.', ARRAY['A bio-derived flame retardant composition.', 'The composition of claim 1 further comprising zinc borate synergist.'], 'US', 'additives-compounding'),
('IN2025P000789', 'Recyclable PET Bottle with Oxygen Scavenger', 'Mehta, S., Reddy, P.', 'GreenBottle Tech India', '2024-08-01', '2025-03-20', 'pending', 'A single-layer PET stretch blow molded container containing a localized cobalt-free active oxygen scavenger formulation.', ARRAY['A recyclable polyester container.', 'The container of claim 1 containing a cobalt-free active oxygen scavenger.'], 'India', 'recycling-technology'),
('PCT/IN2025/000456', '3D Printing Filament from Recycled PET', 'Kumar, V., Sharma, A.', 'MakerPlast India', '2024-09-15', '2025-04-10', 'published', 'A fused deposition modeling (FDM) filament comprising 100% recycled PET bottle flakes with chain-extending additives.', ARRAY['A fused deposition modeling filament.', 'The filament of claim 1 comprising recycled polyethylene terephthalate.'], 'PCT', 'polymer-processing'),
('IN2025P001234', 'Rubber Vulcanization with Bio-sulfur', 'Rao, K., Gupta, S.', 'TyreGreen India Ltd', '2024-11-20', '2025-05-02', 'granted', 'A vulcanization process for natural rubber using high-purity sulfur derived from bio-desulfurization of biogas.', ARRAY['A rubber vulcanization process.', 'The process of claim 1 utilizing sulfur sourced from biological desulfurization.'], 'India', 'rubber-technology')
ON CONFLICT (patent_number) DO NOTHING;
