// scripts/seed_lesson_images.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { LESSON_IMAGES } = require('../src/lib/lesson_images.js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedLessonImages() {
  console.log('🖼️ Seeding lesson images into Supabase database...');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase environment variables in .env.local.');
    process.exit(1);
  }

  let count = 0;
  let skipped = 0;
  
  const entries = Object.entries(LESSON_IMAGES);
  console.log(`Mapping contains ${entries.length} lessons. Starting updates...`);

  for (const [slug, images] of entries) {
    const { data, error } = await supabase
      .from('lessons')
      .update({
        hero_image_url: images.hero,
        concept_images: images.concepts,
        product_images: images.products,
        machine_images: images.machines,
      })
      .eq('slug', slug)
      .select('id');
    
    if (error) {
      console.error(`❌ Failed to update ${slug}:`, error.message);
    } else if (data && data.length > 0) {
      count++;
      if (count % 20 === 0) {
        console.log(`   Progress: ${count} lessons updated...`);
      }
    } else {
      skipped++;
    }
  }
  
  console.log(`\n🎉 Done! Seeding complete.`);
  console.log(`   - Successfully updated: ${count} lessons`);
  console.log(`   - Skipped/not in DB: ${skipped} lessons`);
}

seedLessonImages().catch(console.error);
