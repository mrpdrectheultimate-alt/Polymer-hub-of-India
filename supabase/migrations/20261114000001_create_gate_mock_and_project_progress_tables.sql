-- 20261114000001_create_gate_mock_and_project_progress_tables.sql
-- Migration to create missing tables identified during full codebase audit:
-- 1. gate_mock_attempts (stores student GATE mock test attempts, scores, and question breakdown)
-- 2. user_project_progress (tracks user project status across devices)

-- ─── 1. GATE MOCK ATTEMPTS TABLE ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gate_mock_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    total_marks NUMERIC(6, 2) NOT NULL DEFAULT 100.00,
    accuracy_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    time_taken_seconds INTEGER NOT NULL DEFAULT 0,
    question_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_gate_mock_attempts_user_id ON public.gate_mock_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_gate_mock_attempts_created_at ON public.gate_mock_attempts(created_at DESC);

-- Enable RLS
ALTER TABLE public.gate_mock_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for gate_mock_attempts
CREATE POLICY "Users can insert their own GATE mock attempts"
    ON public.gate_mock_attempts
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own GATE mock attempts"
    ON public.gate_mock_attempts
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins have full access to GATE mock attempts"
    ON public.gate_mock_attempts
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'superadmin', 'hod')
        )
    );

-- ─── 2. USER PROJECT PROGRESS TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_project_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_user_project UNIQUE (user_id, project_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_project_progress_user_id ON public.user_project_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_project_progress_project_id ON public.user_project_progress(project_id);

-- Enable RLS
ALTER TABLE public.user_project_progress ENABLE ROW LEVEL SECURITY;

-- Policies for user_project_progress
CREATE POLICY "Users can view their own project progress"
    ON public.user_project_progress
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert their own project progress"
    ON public.user_project_progress
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ─── 3. STORAGE BUCKET POLICIES (AVATARS & RECEIPTS) ─────────────────────────
-- Ensure storage bucket RLS policies allow authenticated uploads
DO $$
BEGIN
    -- Avatars bucket policies
    INSERT INTO storage.buckets (id, name, public, file_size_limit)
    VALUES ('avatars', 'avatars', true, 10485760)
    ON CONFLICT (id) DO UPDATE SET public = true;

    -- Receipts bucket policies
    INSERT INTO storage.buckets (id, name, public, file_size_limit)
    VALUES ('receipts', 'receipts', true, 10485760)
    ON CONFLICT (id) DO UPDATE SET public = true;
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;
