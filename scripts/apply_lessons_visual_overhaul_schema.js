// scripts/apply_lessons_visual_overhaul_schema.js
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function applySchema() {
  console.log('=== APPLYING LESSONS VISUAL OVERHAUL SCHEMA ===\n');

  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.log('⚠️ No DATABASE_URL or SUPABASE_DB_URL set in environment.');
    console.log('📋 Please copy and run the following SQL inside your Supabase Studio SQL Editor:\n');
    console.log(`
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS concept_images JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS product_images JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS machine_images JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS formula_spacing TEXT DEFAULT '1.8';
    `);
    console.log('\nOnce applied, run your image seeding script.');
    return;
  }

  const pool = new Pool({ connectionString: dbUrl });

  try {
    console.log('Altering public.lessons table structure to add visual columns...');

    const columns = [
      { name: 'hero_image_url', type: 'TEXT' },
      { name: 'concept_images', type: 'JSONB DEFAULT \'[]\'' },
      { name: 'product_images', type: 'JSONB DEFAULT \'[]\'' },
      { name: 'machine_images', type: 'JSONB DEFAULT \'[]\'' },
      { name: 'formula_spacing', type: 'TEXT DEFAULT \'1.8\'' }
    ];

    for (const col of columns) {
      try {
        await pool.query(`
          ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};
        `);
        console.log(`  Added/verified column: ${col.name}`);
      } catch (err) {
        console.error(`  ❌ Failed to add column ${col.name}:`, err.message);
      }
    }

    console.log('\n✅ Database schema updated successfully.');
  } catch (err) {
    console.error('❌ Fatal migration error:', err);
  } finally {
    await pool.end();
  }
}

applySchema().catch(console.error);
