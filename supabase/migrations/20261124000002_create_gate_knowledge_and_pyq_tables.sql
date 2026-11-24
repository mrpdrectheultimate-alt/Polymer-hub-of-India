-- 20261124000002_create_gate_knowledge_and_pyq_tables.sql
-- Migration to create GATE historical knowledge base and 10-year PYQ registry
-- Adheres to Option A: Canonical official links + 100% original pedagogical solutions

-- ─── 1. GATE EXAM YEARS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gate_exam_years (
    year INTEGER PRIMARY KEY,
    organizing_institute TEXT NOT NULL,
    official_website_url TEXT NOT NULL,
    brochure_pdf_url TEXT,
    pyq_download_url TEXT,
    exam_dates TEXT[] NOT NULL DEFAULT '{}',
    result_date TEXT,
    total_papers INTEGER NOT NULL DEFAULT 30,
    is_active_cycle BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ─── 2. GATE PAPER CODE MAPPINGS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gate_paper_code_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_code TEXT NOT NULL,           -- e.g. 'XE-F'
    canonical_2027_code TEXT NOT NULL,   -- e.g. 'XE5'
    discipline_name TEXT NOT NULL,       -- 'Polymer Science and Engineering'
    parent_paper TEXT NOT NULL,          -- 'XE'
    valid_from_year INTEGER NOT NULL,    -- 2027
    valid_until_year INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_gate_code_mapping UNIQUE (legacy_code, valid_from_year)
);

-- ─── 3. GATE PYQ SOURCES (OFFICIAL REPOSITORY LINKS - OPTION A) ───────────────
CREATE TABLE IF NOT EXISTS public.gate_pyq_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_year INTEGER NOT NULL REFERENCES public.gate_exam_years(year) ON DELETE CASCADE,
    paper_code TEXT NOT NULL,            -- e.g. 'XE' or 'XE-F'
    mapped_code TEXT NOT NULL,           -- e.g. 'XE5'
    official_paper_pdf_url TEXT NOT NULL,
    official_key_pdf_url TEXT NOT NULL,
    source_institute TEXT NOT NULL,      -- e.g. 'IIT Guwahati', 'IIT Madras', 'IISc Bengaluru'
    is_verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_gate_pyq_source UNIQUE (exam_year, paper_code)
);

-- ─── 4. STRUCTURED GATE QUESTIONS & DERIVATIONS ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gate_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_year INTEGER NOT NULL REFERENCES public.gate_exam_years(year) ON DELETE CASCADE,
    paper_code TEXT NOT NULL,            -- Original code at time of exam (e.g. 'XE-F')
    mapped_code TEXT NOT NULL,           -- 2027 canonical code (e.g. 'XE5')
    question_number INTEGER NOT NULL,
    section_name TEXT NOT NULL,          -- 'Polymer Science and Engineering'
    question_type TEXT NOT NULL CHECK (question_type IN ('MCQ', 'MSQ', 'NAT')),
    marks INTEGER NOT NULL CHECK (marks IN (1, 2)),
    negative_marks NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    question_statement_latex TEXT NOT NULL,
    options JSONB DEFAULT '[]'::jsonb,   -- Array of strings for MCQ/MSQ
    correct_answer TEXT NOT NULL,        -- '0', '1', '2', '3' for MCQ, or number range for NAT
    step_by_step_derivation TEXT NOT NULL,
    syllabus_unit TEXT NOT NULL,         -- e.g. 'Unit 1: Chemistry of High Polymers'
    lesson_slug TEXT,                    -- Reference to PolymerHub curriculum lesson
    formula_slug TEXT,                   -- Reference to MASTER_CANONICAL_FORMULAS
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_gate_exam_q UNIQUE (exam_year, paper_code, question_number)
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_gate_questions_year ON public.gate_questions(exam_year DESC);
CREATE INDEX IF NOT EXISTS idx_gate_questions_mapped_code ON public.gate_questions(mapped_code);
CREATE INDEX IF NOT EXISTS idx_gate_questions_unit ON public.gate_questions(syllabus_unit);
CREATE INDEX IF NOT EXISTS idx_gate_pyq_sources_year ON public.gate_pyq_sources(exam_year DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.gate_exam_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_paper_code_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_pyq_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gate_questions ENABLE ROW LEVEL SECURITY;

-- Public read policies (Knowledge is open and free for all students)
CREATE POLICY "Public read for gate_exam_years" ON public.gate_exam_years FOR SELECT TO public USING (true);
CREATE POLICY "Public read for gate_paper_code_mappings" ON public.gate_paper_code_mappings FOR SELECT TO public USING (true);
CREATE POLICY "Public read for gate_pyq_sources" ON public.gate_pyq_sources FOR SELECT TO public USING (true);
CREATE POLICY "Public read for gate_questions" ON public.gate_questions FOR SELECT TO public USING (true);

-- Admin write policies
CREATE POLICY "Admin write for gate_exam_years" ON public.gate_exam_years FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin', 'hod'))
);
CREATE POLICY "Admin write for gate_paper_code_mappings" ON public.gate_paper_code_mappings FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin', 'hod'))
);
CREATE POLICY "Admin write for gate_pyq_sources" ON public.gate_pyq_sources FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin', 'hod'))
);
CREATE POLICY "Admin write for gate_questions" ON public.gate_questions FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin', 'hod'))
);
