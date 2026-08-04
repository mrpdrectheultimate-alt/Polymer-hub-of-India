const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyPhase16Tables() {
  console.log('=== APPLYING PHASE 16: COMMUNITY TABLES VIA INDIVIDUAL SQL ===\n');

  // We apply each DDL statement via the pg-meta/query endpoint
  const { Pool } = require('pg');

  // Use the Supabase direct DB connection from env
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.log('No DATABASE_URL set — using Supabase management API fallback...');
    await applyViaManagementAPI();
    return;
  }

  const pool = new Pool({ connectionString: dbUrl });

  const statements = [
    `CREATE TABLE IF NOT EXISTS public.community_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      speaker TEXT NOT NULL,
      company TEXT NOT NULL,
      event_date TIMESTAMPTZ NOT NULL,
      meeting_url TEXT NOT NULL,
      subject_slug TEXT,
      is_live BOOLEAN NOT NULL DEFAULT false,
      tags TEXT[] DEFAULT '{}',
      max_seats INT DEFAULT 200,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
    `ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='community_events' AND policyname='community_events_public_read') THEN
       CREATE POLICY "community_events_public_read" ON public.community_events FOR SELECT USING (true);
     END IF; END $$`,
    `CREATE TABLE IF NOT EXISTS public.event_registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      event_id UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(user_id, event_id)
    )`,
    `ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY`,
    `CREATE TABLE IF NOT EXISTS public.mentorship_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      company TEXT NOT NULL,
      designation TEXT NOT NULL,
      email TEXT NOT NULL,
      bio TEXT NOT NULL,
      experience_years INT NOT NULL,
      specialization TEXT NOT NULL,
      avatar_initials TEXT,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,
    `ALTER TABLE public.mentorship_profiles ENABLE ROW LEVEL SECURITY`,
    `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='mentorship_profiles' AND policyname='mentorship_profiles_public_read') THEN
       CREATE POLICY "mentorship_profiles_public_read" ON public.mentorship_profiles FOR SELECT USING (is_active = true);
     END IF; END $$`,
    `CREATE TABLE IF NOT EXISTS public.mentorship_matches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      mentor_id UUID NOT NULL REFERENCES public.mentorship_profiles(id) ON DELETE CASCADE,
      message TEXT,
      status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'declined')) DEFAULT 'pending',
      matched_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE(student_id, mentor_id)
    )`,
    `ALTER TABLE public.mentorship_matches ENABLE ROW LEVEL SECURITY`,
  ];

  for (const sql of statements) {
    try {
      await pool.query(sql);
      console.log('✅ Executed:', sql.substring(0, 50).trim() + '...');
    } catch (err) {
      console.log('⚠️ Skipped (may already exist):', err.message.substring(0, 80));
    }
  }

  await pool.end();
  console.log('\n✅ Tables applied. Now seeding...');
  await seedData();
}

async function applyViaManagementAPI() {
  // Try using the Supabase REST API with service role to create tables
  // We'll use the raw query endpoint if available
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\./)?.[1];
  if (!projectRef) {
    console.error('Cannot determine project ref. Please run the migration via Supabase Studio.');
    console.log('\n📋 SQL to paste into Supabase Studio SQL Editor:\n');
    console.log(getFullSQL());
    return;
  }
  await seedData();
}

async function seedData() {
  console.log('\n📅 Seeding Community Events...');
  const events = [
    {
      title: 'Introduction to Injection Molding: Design for Manufacturability',
      description: 'A deep dive into DFM principles for plastic components, covering draft angles, wall thickness, gating strategies, and common defect avoidance. Ideal for 2nd and 3rd year PPE students.',
      speaker: 'Dr. Ramesh Patel',
      company: 'Reliance Industries Ltd.',
      event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_url: 'https://meet.google.com/polymer-hub-inj-mold',
      subject_slug: 'injection-moulding',
      is_live: false,
      tags: ['injection-molding', 'DFM', 'beginner'],
      max_seats: 300,
    },
    {
      title: 'Sustainable Plastics: Biopolymers & Circular Economy',
      description: 'Industry expert discusses the rise of PHA, PLA, and bio-based PET in Indian manufacturing. Covers LCA methodology, recyclability metrics, and regulatory trends under EPR rules.',
      speaker: 'Priya Krishnamurthy',
      company: 'Supreme Industries',
      event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_url: 'https://meet.google.com/polymer-hub-sustainable',
      subject_slug: 'sustainable-plastics',
      is_live: false,
      tags: ['sustainability', 'biopolymers', 'EPR', 'circular-economy'],
      max_seats: 250,
    },
    {
      title: 'Polymer Rheology: Melt Flow & Viscosity for Processing Engineers',
      description: 'Master the relationship between MFI, viscosity curves, and die swell. Learn how to use rheology data to troubleshoot extrusion and injection moulding issues in real production environments.',
      speaker: 'Prof. Anand Sharma',
      company: 'IIT Bombay – Polymer Engineering Dept.',
      event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_url: 'https://meet.google.com/polymer-hub-rheology',
      subject_slug: 'rheology',
      is_live: false,
      tags: ['rheology', 'MFI', 'viscosity', 'advanced'],
      max_seats: 200,
    },
    {
      title: 'GATE Polymer Engineering — Topper Strategy Session',
      description: 'A GATE 2025 AIR-7 topper shares their preparation strategy, high-weightage topic map, and mock test methodology. Q&A session included. Aimed at final-year B.Tech students.',
      speaker: 'Arjun Verma',
      company: 'GATE 2025 AIR-7 | IIT Kharagpur',
      event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_url: 'https://meet.google.com/polymer-hub-gate',
      subject_slug: null,
      is_live: false,
      tags: ['GATE', 'exam-prep', 'strategy', 'topper'],
      max_seats: 500,
    },
    {
      title: 'Rubber Technology & Vulcanization: Live Q&A with Industry Expert',
      description: 'Join a live discussion on NR vs. SR compounding, vulcanization chemistry, accelerator systems, and rubber mould design. Includes real plant case studies from APOLLO Tyres.',
      speaker: 'Sanjay Nair',
      company: 'Apollo Tyres Ltd.',
      event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_url: 'https://meet.google.com/polymer-hub-rubber',
      subject_slug: 'rubber-technology',
      is_live: true,
      tags: ['rubber', 'vulcanization', 'live', 'industry'],
      max_seats: 150,
    },
  ];

  const { data: evData, error: evErr } = await supabase
    .from('community_events')
    .upsert(events, { onConflict: 'title' })
    .select('id, title');

  if (evErr) {
    console.error('❌ Events seed error:', evErr.message);
  } else {
    console.log(`✅ Seeded ${evData?.length} events`);
    evData?.forEach(e => console.log('  -', e.title));
  }

  console.log('\n👥 Seeding Mentorship Profiles...');
  const mentors = [
    { name: 'Dr. Kavita Mehta', company: 'Reliance Industries Ltd.', designation: 'Senior Polymer Scientist', email: 'kavita.mehta@example.com', bio: 'PhD in Polymer Chemistry from IIT Delhi. 18 years of R&D experience in polyolefins, specialty compounds, and additive systems.', experience_years: 18, specialization: 'Polyolefins & Additive Systems', avatar_initials: 'KM', is_active: true },
    { name: 'Rajan Pillai', company: 'Supreme Industries', designation: 'Head of Manufacturing', email: 'rajan.pillai@example.com', bio: 'B.Tech PPE from CIPET Chennai, MBA from IIM Ahmedabad. 14 years in injection moulding plant operations and lean manufacturing.', experience_years: 14, specialization: 'Injection Moulding & Lean Manufacturing', avatar_initials: 'RP', is_active: true },
    { name: 'Dr. Sunita Agarwal', company: 'CIPET: IPT – Chennai', designation: 'Professor & HOD, PPE', email: 'sunita.agarwal@example.com', bio: 'Academic with 20+ years of teaching and research in polymer processing. Expert in GATE coaching and curriculum design.', experience_years: 20, specialization: 'Polymer Processing & GATE Preparation', avatar_initials: 'SA', is_active: true },
    { name: 'Karthik Balasubramaniam', company: 'Borouge (ADNOC + Borealis JV)', designation: 'Technical Sales Engineer', email: 'karthik.b@example.com', bio: 'Works on polyolefin application development for GCC and South Asia. Specialises in pipe, film, and automotive grades.', experience_years: 9, specialization: 'Polyolefin Applications & Global Markets', avatar_initials: 'KB', is_active: true },
    { name: 'Neha Saxena', company: 'Uflex Ltd.', designation: 'R&D Engineer – Packaging Films', email: 'neha.saxena@example.com', bio: 'Expert in multilayer blown and cast film technology, barrier coatings, and flexible packaging regulations.', experience_years: 7, specialization: 'Flexible Packaging & Film Technology', avatar_initials: 'NS', is_active: true },
    { name: 'Dr. Prasad Kulkarni', company: 'National Chemical Laboratory (NCL)', designation: 'Principal Scientist', email: 'prasad.kulkarni@example.com', bio: 'Research leader in bio-based polymers, polymer nanocomposites, and sustainable materials. Has supervised 12 PhD students.', experience_years: 22, specialization: 'Biopolymers & Nanocomposites', avatar_initials: 'PK', is_active: true },
  ];

  const { data: menData, error: menErr } = await supabase
    .from('mentorship_profiles')
    .upsert(mentors, { onConflict: 'email' })
    .select('id, name');

  if (menErr) {
    console.error('❌ Mentors seed error:', menErr.message);
  } else {
    console.log(`✅ Seeded ${menData?.length} mentors`);
    menData?.forEach(m => console.log('  -', m.name));
  }

  console.log('\n=== PHASE 16 COMPLETE ===');
}

function getFullSQL() {
  return `
-- Run this in Supabase Studio SQL Editor

CREATE TABLE IF NOT EXISTS public.community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT NOT NULL,
  speaker TEXT NOT NULL, company TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL, meeting_url TEXT NOT NULL,
  subject_slug TEXT, is_live BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}', max_seats INT DEFAULT 200,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "community_events_public_read" ON public.community_events FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, event_id)
);
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "event_registrations_authenticated_insert" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.mentorship_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, company TEXT NOT NULL, designation TEXT NOT NULL,
  email TEXT NOT NULL, bio TEXT NOT NULL,
  experience_years INT NOT NULL, specialization TEXT NOT NULL,
  avatar_initials TEXT, is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mentorship_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "mentorship_profiles_public_read" ON public.mentorship_profiles FOR SELECT USING (is_active = true);

CREATE TABLE IF NOT EXISTS public.mentorship_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.mentorship_profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'declined')) DEFAULT 'pending',
  matched_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, mentor_id)
);
ALTER TABLE public.mentorship_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "mentorship_matches_authenticated_insert" ON public.mentorship_matches FOR INSERT WITH CHECK (auth.uid() = student_id);
  `;
}

applyPhase16Tables().catch(console.error);
