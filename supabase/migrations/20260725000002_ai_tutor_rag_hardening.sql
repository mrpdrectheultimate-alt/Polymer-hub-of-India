-- ============================================================
-- POLYMERHUB — AI TUTOR & RAG VECTOR SEARCH HARDENING
-- Migration: 20260725_ai_tutor_rag_hardening.sql
-- ============================================================

-- Ensure is_published column exists on subjects and lessons before they are used in functions or policies
ALTER TABLE public.subjects
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Ensure lesson_embeddings table exists with vector(768)
CREATE TABLE IF NOT EXISTS public.lesson_embeddings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  chunk_text  TEXT NOT NULL,
  chunk_index INT NOT NULL DEFAULT 0,
  embedding   vector(768),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lesson_embeddings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Embeddings readable by all" ON public.lesson_embeddings;
CREATE POLICY "Embeddings readable by all"
  ON public.lesson_embeddings FOR SELECT
  USING (true);

-- 3. Stored RPC function for RAG similarity match (768-dim)
DROP FUNCTION IF EXISTS public.match_lesson_chunks(vector,double precision,integer);
DROP FUNCTION IF EXISTS public.match_lesson_chunks(extensions.vector,double precision,integer);
DROP FUNCTION IF EXISTS public.match_lesson_chunks(vector,float,integer);
DROP FUNCTION IF EXISTS public.match_lesson_chunks(extensions.vector,float,integer);
CREATE OR REPLACE FUNCTION public.match_lesson_chunks(
  query_embedding  vector(768),
  match_threshold  FLOAT,
  match_count      INT
)
RETURNS TABLE (
  id           UUID,
  lesson_id    UUID,
  lesson_title TEXT,
  lesson_slug  TEXT,
  content      TEXT,
  similarity   FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT
    le.id,
    le.lesson_id,
    l.title AS lesson_title,
    l.slug AS lesson_slug,
    le.chunk_text AS content,
    (1 - (le.embedding <=> query_embedding))::FLOAT AS similarity
  FROM public.lesson_embeddings le
  JOIN public.lessons l ON l.id = le.lesson_id
  WHERE (1 - (le.embedding <=> query_embedding)) > match_threshold
    AND l.is_published = true
  ORDER BY le.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
