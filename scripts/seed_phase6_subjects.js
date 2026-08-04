// scripts/seed_phase6_subjects.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const newSubjects = [
  {
    name: 'Polymer Nanotechnology',
    slug: 'polymer-nanotechnology',
    order_index: 16
  },
  {
    name: 'Bioprocessing & Fermentation',
    slug: 'bioprocessing-fermentation',
    order_index: 17
  },
  {
    name: 'Robotics in Plastics Manufacturing',
    slug: 'robotics-plastics',
    order_index: 18
  },
  {
    name: 'Digital Twins in Polymer Manufacturing',
    slug: 'digital-twins-plastics',
    order_index: 19
  }
];

async function seed() {
  console.log('Seeding 4 new subjects for Phase 6...');
  
  for (const subject of newSubjects) {
    const { data: existing } = await supabase
      .from('subjects')
      .select('id')
      .eq('slug', subject.slug)
      .single();

    if (existing) {
      console.log(`Subject ${subject.name} already exists with ID: ${existing.id}`);
    } else {
      const { data, error } = await supabase
        .from('subjects')
        .insert([subject])
        .select('id, name')
        .single();
      
      if (error) {
        console.error(`Error inserting ${subject.name}:`, error);
      } else {
        console.log(`Inserted subject ${data.name} with ID: ${data.id}`);
      }
    }
  }
}

seed();
