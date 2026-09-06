-- Supabase Migration: 20260906000001_digital_library_v3.sql
-- Digital Library v3: 4-Class Legal Classification & Normalized Block Architecture

-- Upgrade existing library_books table with 4-Class Legal Classification columns
CREATE TABLE IF NOT EXISTS public.library_books (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  legal_class TEXT NOT NULL DEFAULT 'Class A',
  license_type TEXT NOT NULL DEFAULT 'Proprietary',
  license_url TEXT,
  category TEXT NOT NULL DEFAULT 'original_guide',
  difficulty TEXT NOT NULL DEFAULT 'Intermediate',
  focus TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  cover_url TEXT NOT NULL DEFAULT '',
  purchase_url TEXT,
  file_url TEXT,
  worldcat_url TEXT,
  openlibrary_url TEXT,
  publisher TEXT,
  publication_year INT,
  isbn TEXT,
  doi TEXT,
  careers TEXT[] DEFAULT '{}',
  subject_slugs TEXT[] DEFAULT '{}',
  notice TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure missing columns are added if table already existed
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS legal_class TEXT DEFAULT 'Class A';
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS license_type TEXT DEFAULT 'Proprietary';
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS license_url TEXT;
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS worldcat_url TEXT;
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS openlibrary_url TEXT;
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS publisher TEXT;
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS publication_year INT;
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS isbn TEXT;
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS doi TEXT;
ALTER TABLE public.library_books ADD COLUMN IF NOT EXISTS notice TEXT;

-- Library Chapters
CREATE TABLE IF NOT EXISTS public.library_chapters (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  chapter_code TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(book_id, chapter_code)
);

-- Library Sections
CREATE TABLE IF NOT EXISTS public.library_sections (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES public.library_chapters(id) ON DELETE CASCADE,
  section_number INT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library Content Blocks (Typed block system for prose, formulas, parameter tables, worked examples, callouts)
CREATE TABLE IF NOT EXISTS public.library_content_blocks (
  id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES public.library_chapters(id) ON DELETE CASCADE,
  section_id TEXT REFERENCES public.library_sections(id) ON DELETE SET NULL,
  block_type TEXT NOT NULL CHECK (block_type IN ('prose', 'formula', 'parameter_table', 'worked_example', 'shopfloor_rule', 'figure', 'callout', 'exercise', 'key_takeaway')),
  sequence_order INT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  plain_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library References (DOI, ISBN, External URL citations)
CREATE TABLE IF NOT EXISTS public.library_references (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  doi TEXT,
  isbn TEXT,
  url TEXT,
  citation_title TEXT NOT NULL,
  publisher_info TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library Sources (For tracking external assets and standards)
CREATE TABLE IF NOT EXISTS public.library_sources (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  uri TEXT,
  verified_by TEXT DEFAULT 'PolymerHub Legal Audit Team',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library Rights Reviews (Audit log for legal status verification)
CREATE TABLE IF NOT EXISTS public.library_rights_reviews (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL REFERENCES public.library_books(id) ON DELETE CASCADE,
  review_status TEXT NOT NULL CHECK (review_status IN ('APPROVED', 'FLAGGED', 'CONVERTED_TO_CLASS_D', 'REJECTED')),
  notes TEXT NOT NULL,
  reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for ultra-fast block querying
CREATE INDEX IF NOT EXISTS idx_library_books_slug ON public.library_books(slug);
CREATE INDEX IF NOT EXISTS idx_library_books_class ON public.library_books(legal_class);
CREATE INDEX IF NOT EXISTS idx_library_chapters_book ON public.library_chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_library_blocks_chapter ON public.library_content_blocks(chapter_id, sequence_order);
CREATE INDEX IF NOT EXISTS idx_library_references_book ON public.library_references(book_id);

-- Enable Row Level Security
ALTER TABLE public.library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_rights_reviews ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on library_books') THEN
    CREATE POLICY "Allow public read access on library_books" ON public.library_books FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on library_chapters') THEN
    CREATE POLICY "Allow public read access on library_chapters" ON public.library_chapters FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on library_sections') THEN
    CREATE POLICY "Allow public read access on library_sections" ON public.library_sections FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on library_content_blocks') THEN
    CREATE POLICY "Allow public read access on library_content_blocks" ON public.library_content_blocks FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on library_references') THEN
    CREATE POLICY "Allow public read access on library_references" ON public.library_references FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on library_sources') THEN
    CREATE POLICY "Allow public read access on library_sources" ON public.library_sources FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access on library_rights_reviews') THEN
    CREATE POLICY "Allow public read access on library_rights_reviews" ON public.library_rights_reviews FOR SELECT USING (true);
  END IF;
END $$;
