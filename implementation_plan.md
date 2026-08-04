# Implementation Plan — Phase 16: Community & Live Events

## Overview
We will build a **Community & Live Events** hub to connect polymer engineering students with industry experts, webinars, and mentor pairings.
This involves:
1. Creating database tables `community_events`, `event_registrations`, and `mentorship_profiles` with RLS.
2. Building an interactive events and mentor match dashboard at `/community` (or `/events`).
3. Adding API routes to handle webinar registrations (awarding **+10 XP**) and mentorship matches (awarding **+25 XP**).

---

## 🗄️ Database Schema & Migrations

We will create a new migration `20260801000006_community_events.sql` to add:
```sql
-- 1. Community Events (Webinars, Panels)
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
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Event Registrations (User signups)
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id        UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- 3. Mentorship Profiles (Alumni / Industry volunteers)
CREATE TABLE IF NOT EXISTS public.mentorship_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  company         TEXT NOT NULL,
  designation     TEXT NOT NULL,
  email           TEXT NOT NULL,
  bio             TEXT NOT NULL,
  experience_years INT NOT NULL,
  specialization  TEXT NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Mentorship Match requests
CREATE TABLE IF NOT EXISTS public.mentorship_matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id       UUID NOT NULL REFERENCES public.mentorship_profiles(id) ON DELETE CASCADE,
  status          TEXT NOT NULL CHECK (status in ('pending', 'approved', 'declined')) DEFAULT 'pending',
  matched_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, mentor_id)
);
```

---

## Proposed Changes

### 1. Database Setup
#### [NEW] [20260801000006_community_events.sql](file:///c:/Users/lpk%20naidu/OneDrive/Desktop/NEXTGENINDIA%20-%20PLASTIC%20POLYMER/supabase/migrations/20260801000006_community_events.sql)
Creates SQL tables, registers RLS policies (public select reads, authenticated writes for registrations and match requests).

---

### 2. API Endpoints

#### [NEW] [api/community/events/route.ts](file:///c:/Users/lpk%20naidu/OneDrive/Desktop/NEXTGENINDIA%20-%20PLASTIC%20POLYMER/src/app/api/community/events/route.ts)
Handles event listing and authenticated registrations. On successful registration, it awards **+10 XP** to the user.

#### [NEW] [api/community/mentors/route.ts](file:///c:/Users/lpk%20naidu/OneDrive/Desktop/NEXTGENINDIA%20-%20PLASTIC%20POLYMER/src/app/api/community/mentors/route.ts)
Handles fetching active mentors and submitting mentorship match requests. On approved matches, it awards **+25 XP** to the student profile.

---

### 3. Frontend Layouts

#### [NEW] [community/page.tsx](file:///c:/Users/lpk%20naidu/OneDrive/Desktop/NEXTGENINDIA%20-%20PLASTIC%20POLYMER/src/app/community/page.tsx)
Builds the Neobrutalist three-tab hub:
- **Webinars**: Cards displaying upcoming webinars, list of speakers, and a "Register Now" button with immediate state sync.
- **Mentorship Hub**: Grid of mentor profiles with a "Request Match" widget prompting for contact confirmation.
- **Discussion Board**: Embedded shortcuts to join study groups and subject forums.

#### [MODIFY] [components/Navbar.tsx](file:///c:/Users/lpk%20naidu/OneDrive/Desktop/NEXTGENINDIA%20-%20PLASTIC%20POLYMER/src/components/Navbar.tsx)
Integrates a "Community" shortcut into the header navigation navigation menu.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure 0 compilation or linting errors.

### Manual Verification
1. Access `/community`. Verify that seeded webinars are visible.
2. Click "Register Now" for an upcoming webinar. Confirm that user registrations log in `event_registrations` and **+10 XP** is added to the user's dashboard profile.
3. Access the **Mentorship Hub** tab. Click "Request Match" on a mentor. Verify a record enters `mentorship_matches` with state `pending`.
