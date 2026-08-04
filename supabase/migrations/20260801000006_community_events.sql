-- Phase 16: Community & Live Events
-- Migration: 20260801000006_community_events.sql

-- 1. Community Events (Webinars, Panels, Live Sessions)
CREATE TABLE IF NOT EXISTS public.community_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT NOT NULL,
  speaker         TEXT NOT NULL,
  company         TEXT NOT NULL,
  event_date      TIMESTAMPTZ NOT NULL,
  meeting_url     TEXT NOT NULL,
  subject_slug    TEXT REFERENCES public.subjects(slug) ON DELETE SET NULL,
  is_live         BOOLEAN NOT NULL DEFAULT false,
  tags            TEXT[] DEFAULT '{}',
  max_seats       INT DEFAULT 200,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read events
CREATE POLICY "community_events_public_read"
  ON public.community_events FOR SELECT
  USING (true);

-- Only service role inserts (admin seeded)
CREATE POLICY "community_events_service_insert"
  ON public.community_events FOR INSERT
  WITH CHECK (false);

-- 2. Event Registrations (user signups for webinars)
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id        UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Users can read their own registrations
CREATE POLICY "event_registrations_own_read"
  ON public.event_registrations FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can register
CREATE POLICY "event_registrations_authenticated_insert"
  ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can unregister themselves
CREATE POLICY "event_registrations_own_delete"
  ON public.event_registrations FOR DELETE
  USING (auth.uid() = user_id);

-- 3. Mentorship Profiles (Alumni / Industry Expert volunteers)
CREATE TABLE IF NOT EXISTS public.mentorship_profiles (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  company           TEXT NOT NULL,
  designation       TEXT NOT NULL,
  email             TEXT NOT NULL,
  bio               TEXT NOT NULL,
  experience_years  INT NOT NULL,
  specialization    TEXT NOT NULL,
  avatar_initials   TEXT,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mentorship_profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read active mentor profiles
CREATE POLICY "mentorship_profiles_public_read"
  ON public.mentorship_profiles FOR SELECT
  USING (is_active = true);

-- 4. Mentorship Match Requests (students requesting a mentor pairing)
CREATE TABLE IF NOT EXISTS public.mentorship_matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id       UUID NOT NULL REFERENCES public.mentorship_profiles(id) ON DELETE CASCADE,
  message         TEXT,
  status          TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'declined')) DEFAULT 'pending',
  matched_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, mentor_id)
);

ALTER TABLE public.mentorship_matches ENABLE ROW LEVEL SECURITY;

-- Students can read their own match requests
CREATE POLICY "mentorship_matches_own_read"
  ON public.mentorship_matches FOR SELECT
  USING (auth.uid() = student_id);

-- Authenticated students can submit match requests
CREATE POLICY "mentorship_matches_authenticated_insert"
  ON public.mentorship_matches FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can withdraw their pending requests
CREATE POLICY "mentorship_matches_own_delete"
  ON public.mentorship_matches FOR DELETE
  USING (auth.uid() = student_id AND status = 'pending');
