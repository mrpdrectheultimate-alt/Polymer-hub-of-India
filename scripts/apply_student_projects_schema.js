// scripts/apply_student_projects_schema.js
require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function applySchema() {
  console.log('=== APPLYING STUDENT PROJECTS SCHEMA EXPANSION ===\n');

  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error('❌ Error: DATABASE_URL or SUPABASE_DB_URL is not defined in environment.');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });

  try {
    // 1. Alter student_projects table to drop user_id NOT NULL and add new columns
    console.log('Altering student_projects table structure...');
    
    // Check constraints on student_projects to drop the category check constraint if it exists
    await pool.query(`
      ALTER TABLE public.student_projects ALTER COLUMN user_id DROP NOT NULL;
    `);

    // Add columns dynamically
    const columns = [
      { name: 'difficulty', type: 'TEXT' },
      { name: 'duration', type: 'TEXT' },
      { name: 'skills', type: 'TEXT[] DEFAULT \'{}\'' },
      { name: 'equipment', type: 'TEXT[] DEFAULT \'{}\'' },
      { name: 'deliverables', type: 'TEXT[] DEFAULT \'{}\'' },
      { name: 'why_matters', type: 'TEXT' },
      { name: 'real_world_app', type: 'TEXT' },
      { name: 'curriculum_match', type: 'TEXT[] DEFAULT \'{}\'' },
      { name: 'video_url', type: 'TEXT' },
      { name: 'steps', type: 'JSONB DEFAULT \'[]\'' },
      { name: 'resources', type: 'JSONB DEFAULT \'[]\'' },
      { name: 'start_count', type: 'INT DEFAULT 0' },
      { name: 'complete_count', type: 'INT DEFAULT 0' },
      { name: 'is_predefined', type: 'BOOLEAN DEFAULT FALSE' }
    ];

    for (const col of columns) {
      try {
        await pool.query(`
          ALTER TABLE public.student_projects ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};
        `);
        console.log(`  Added/verified column: ${col.name}`);
      } catch (err) {
        console.error(`  ❌ Failed to add column ${col.name}:`, err.message);
      }
    }

    // Drop and re-create the category check constraint
    console.log('Updating category check constraint...');
    try {
      await pool.query(`
        ALTER TABLE public.student_projects DROP CONSTRAINT IF EXISTS student_projects_category_check;
      `);
      await pool.query(`
        ALTER TABLE public.student_projects ADD CONSTRAINT student_projects_category_check 
        CHECK (category in ('research', 'design', 'processing', 'recycling', 'product', 'foundation', 'intermediate', 'advanced', 'expert'));
      `);
      console.log('  Updated category check constraint successfully.');
    } catch (err) {
      console.error('  ❌ Failed to update category check constraint:', err.message);
    }

    // 2. Create user_project_progress table
    console.log('Creating user_project_progress table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.user_project_progress (
        id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        project_id      UUID NOT NULL REFERENCES public.student_projects(id) ON DELETE CASCADE,
        status          TEXT NOT NULL CHECK (status in ('not_started', 'in_progress', 'completed')),
        started_at      TIMESTAMPTZ,
        completed_at    TIMESTAMPTZ,
        notes           TEXT,
        UNIQUE(user_id, project_id)
      );
    `);
    console.log('  Created/verified user_project_progress table.');

    // Enable RLS and add policies
    console.log('Enabling Row Level Security on user_project_progress...');
    await pool.query(`
      ALTER TABLE public.user_project_progress ENABLE ROW LEVEL SECURITY;
    `);

    // Drop policies if exist and create them
    await pool.query(`
      DROP POLICY IF EXISTS "Users view own progress" ON public.user_project_progress;
      CREATE POLICY "Users view own progress" ON public.user_project_progress FOR SELECT USING (auth.uid() = user_id);
    `);
    await pool.query(`
      DROP POLICY IF EXISTS "Users manage own progress" ON public.user_project_progress;
      CREATE POLICY "Users manage own progress" ON public.user_project_progress FOR ALL USING (auth.uid() = user_id);
    `);
    console.log('  Configured RLS policies successfully.');

    console.log('\n✅ Database schema expanded successfully!');
  } catch (error) {
    console.error('❌ Schema application failed:', error.message);
  } finally {
    await pool.end();
  }
}

applySchema();
