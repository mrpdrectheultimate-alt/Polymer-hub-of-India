const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log('=== PHASE 16: SEEDING COMMUNITY EVENTS & MENTORS ===\n');

  // Clear existing seed data first (idempotent)
  await supabase.from('community_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('mentorship_profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // Seed Events
  console.log('📅 Seeding community events...');
  const events = [
    {
      title: 'Introduction to Injection Molding: Design for Manufacturability',
      description: 'A deep dive into DFM principles for plastic components, covering draft angles, wall thickness, gating strategies, and common defect avoidance. Ideal for 2nd and 3rd year PPE students.',
      speaker: 'Dr. Ramesh Patel', company: 'Reliance Industries Ltd.',
      event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_url: 'https://meet.google.com/polymer-hub-inj-mold',
      subject_slug: null, is_live: false, tags: ['injection-molding', 'DFM', 'beginner'], max_seats: 300,
    },
    {
      title: 'Sustainable Plastics: Biopolymers & Circular Economy',
      description: 'Industry expert discusses the rise of PHA, PLA, and bio-based PET in Indian manufacturing. Covers LCA methodology, recyclability metrics, and EPR regulations.',
      speaker: 'Priya Krishnamurthy', company: 'Supreme Industries',
      event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_url: 'https://meet.google.com/polymer-hub-sustainable',
      subject_slug: null, is_live: false, tags: ['sustainability', 'biopolymers', 'EPR'], max_seats: 250,
    },
    {
      title: 'Polymer Rheology: Melt Flow & Viscosity for Processing Engineers',
      description: 'Master the relationship between MFI, viscosity curves, and die swell. Troubleshoot extrusion and injection moulding issues using rheology data.',
      speaker: 'Prof. Anand Sharma', company: 'IIT Bombay – Polymer Engineering Dept.',
      event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_url: 'https://meet.google.com/polymer-hub-rheology',
      subject_slug: null, is_live: false, tags: ['rheology', 'MFI', 'viscosity', 'advanced'], max_seats: 200,
    },
    {
      title: 'GATE Polymer Engineering — Topper Strategy Session',
      description: 'A GATE 2025 AIR-7 topper shares preparation strategy, high-weightage topic map, and mock test methodology. Q&A included. For final-year B.Tech students.',
      speaker: 'Arjun Verma', company: 'GATE 2025 AIR-7 | IIT Kharagpur',
      event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_url: 'https://meet.google.com/polymer-hub-gate',
      subject_slug: null, is_live: false, tags: ['GATE', 'exam-prep', 'strategy', 'topper'], max_seats: 500,
    },
    {
      title: 'Rubber Technology & Vulcanization: Live Q&A with Industry Expert',
      description: 'Live discussion on NR vs. SR compounding, vulcanization chemistry, accelerator systems, and rubber mould design. Real plant case studies from Apollo Tyres.',
      speaker: 'Sanjay Nair', company: 'Apollo Tyres Ltd.',
      event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      meeting_url: 'https://meet.google.com/polymer-hub-rubber',
      subject_slug: null, is_live: true, tags: ['rubber', 'vulcanization', 'live', 'industry'], max_seats: 150,
    },
  ];

  const { data: evData, error: evErr } = await supabase
    .from('community_events')
    .insert(events)
    .select('id, title');

  if (evErr) {
    console.error('❌ Events error:', evErr.message);
  } else {
    console.log(`✅ Seeded ${evData?.length} events:`);
    evData?.forEach(e => console.log('  •', e.title));
  }

  // Seed Mentors
  console.log('\n👥 Seeding mentorship profiles...');
  const mentors = [
    { name: 'Dr. Kavita Mehta', company: 'Reliance Industries Ltd.', designation: 'Senior Polymer Scientist', email: 'kavita.mehta@example.com', bio: 'PhD in Polymer Chemistry from IIT Delhi. 18 years of R&D experience in polyolefins, specialty compounds, and additive systems. Author of 22 research papers on HDPE and PP processing.', experience_years: 18, specialization: 'Polyolefins & Additive Systems', avatar_initials: 'KM', is_active: true },
    { name: 'Rajan Pillai', company: 'Supreme Industries', designation: 'Head of Manufacturing', email: 'rajan.pillai@example.com', bio: 'B.Tech PPE from CIPET Chennai, MBA from IIM Ahmedabad. 14 years in injection moulding plant operations, tooling management, and lean manufacturing implementation.', experience_years: 14, specialization: 'Injection Moulding & Lean Manufacturing', avatar_initials: 'RP', is_active: true },
    { name: 'Dr. Sunita Agarwal', company: 'CIPET: IPT – Chennai', designation: 'Professor & HOD, PPE', email: 'sunita.agarwal@example.com', bio: 'Academic with 20+ years of teaching and research in polymer processing. Expert in GATE coaching, curriculum design, and polymer blends. Guide to 45+ M.Tech students.', experience_years: 20, specialization: 'Polymer Processing & GATE Preparation', avatar_initials: 'SA', is_active: true },
    { name: 'Karthik Balasubramaniam', company: 'Borouge (ADNOC + Borealis JV)', designation: 'Technical Sales Engineer', email: 'karthik.b@example.com', bio: 'Works on polyolefin application development for GCC and South Asia. Specialises in pipe, film, and automotive grades. Helps fresh graduates understand international polymer markets.', experience_years: 9, specialization: 'Polyolefin Applications & Global Markets', avatar_initials: 'KB', is_active: true },
    { name: 'Neha Saxena', company: 'Uflex Ltd.', designation: 'R&D Engineer – Packaging Films', email: 'neha.saxena@example.com', bio: 'Expert in multilayer blown and cast film technology, barrier coatings, and flexible packaging regulations. Helps students build career paths in the fast-growing packaging sector.', experience_years: 7, specialization: 'Flexible Packaging & Film Technology', avatar_initials: 'NS', is_active: true },
    { name: 'Dr. Prasad Kulkarni', company: 'National Chemical Laboratory (NCL)', designation: 'Principal Scientist', email: 'prasad.kulkarni@example.com', bio: 'Research leader in bio-based polymers, polymer nanocomposites, and sustainable materials. Has supervised 12 PhD students and is deeply involved in industry-academia collaborations.', experience_years: 22, specialization: 'Biopolymers & Nanocomposites', avatar_initials: 'PK', is_active: true },
  ];

  const { data: menData, error: menErr } = await supabase
    .from('mentorship_profiles')
    .insert(mentors)
    .select('id, name');

  if (menErr) {
    console.error('❌ Mentors error:', menErr.message);
  } else {
    console.log(`✅ Seeded ${menData?.length} mentors:`);
    menData?.forEach(m => console.log('  •', m.name));
  }

  console.log('\n=== PHASE 16 SEED COMPLETE ===');
}

seed().catch(console.error);
