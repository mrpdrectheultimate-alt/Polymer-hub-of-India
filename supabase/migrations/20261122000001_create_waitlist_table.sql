-- Migration: 20261122000001_create_waitlist_table.sql
-- Description: Create dedicated waitlist table for PolymerHub of India campaign landing page

CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  persona TEXT DEFAULT 'student', -- 'student', 'gate', 'engineer', 'academician', 'other'
  college_or_company TEXT,
  waitlist_position SERIAL,
  referral_source TEXT DEFAULT 'launch_page',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to insert their waitlist entry
CREATE POLICY "Allow anonymous waitlist insert"
  ON public.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous visitors to read their own record by email or check waitlist counts
CREATE POLICY "Allow public waitlist select"
  ON public.waitlist
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Indexes for lightning-fast lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist (email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist (created_at DESC);
