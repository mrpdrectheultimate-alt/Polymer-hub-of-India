const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function applySprint4aSchema() {
  console.log('=== APPLYING SPRINT 4A SCHEMA & SEEDING MATERIAL & ENGINEERING TABLES ===');

  const sqlScript = `
    -- 1. polymer_materials
    CREATE TABLE IF NOT EXISTS polymer_materials (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      material_family TEXT NOT NULL,
      common_names TEXT[],
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      temp_range_c TEXT NOT NULL,
      chemical_resistance TEXT NOT NULL,
      recyclability TEXT NOT NULL,
      drying_requirement TEXT NOT NULL,
      source_and_date TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE polymer_materials ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read polymer_materials" ON polymer_materials FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 2. material_properties
    CREATE TABLE IF NOT EXISTS material_properties (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      material_id UUID REFERENCES polymer_materials(id) ON DELETE CASCADE,
      property_name TEXT NOT NULL,
      min_value NUMERIC NOT NULL,
      max_value NUMERIC NOT NULL,
      unit TEXT NOT NULL,
      test_method TEXT NOT NULL
    );
    ALTER TABLE material_properties ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read material_properties" ON material_properties FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 3. material_sources
    CREATE TABLE IF NOT EXISTS material_sources (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      material_id UUID REFERENCES polymer_materials(id) ON DELETE CASCADE,
      source_title TEXT NOT NULL,
      publisher TEXT NOT NULL,
      publication_date DATE NOT NULL,
      license TEXT NOT NULL
    );
    ALTER TABLE material_sources ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read material_sources" ON material_sources FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 4. material_applications
    CREATE TABLE IF NOT EXISTS material_applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      material_id UUID REFERENCES polymer_materials(id) ON DELETE CASCADE,
      application_name TEXT NOT NULL,
      industry TEXT NOT NULL,
      suitability_score INT NOT NULL
    );
    ALTER TABLE material_applications ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read material_applications" ON material_applications FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 5. material_comparisons
    CREATE TABLE IF NOT EXISTS material_comparisons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      compared_material_ids UUID[] NOT NULL,
      saved_title TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE material_comparisons ENABLE ROW LEVEL SECURITY;

    -- 6. engineering_calculations
    CREATE TABLE IF NOT EXISTS engineering_calculations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      calculator_slug TEXT NOT NULL,
      user_id UUID,
      input_params JSONB NOT NULL,
      output_results JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE engineering_calculations ENABLE ROW LEVEL SECURITY;

    -- 7. calculator_formulas
    CREATE TABLE IF NOT EXISTS calculator_formulas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      formula_latex TEXT NOT NULL,
      inputs_schema JSONB NOT NULL,
      assumptions TEXT[] NOT NULL,
      worked_example JSONB NOT NULL,
      limitations TEXT NOT NULL
    );
    ALTER TABLE calculator_formulas ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read calculator_formulas" ON calculator_formulas FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 8. processing_defects
    CREATE TABLE IF NOT EXISTS processing_defects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      symptom_description TEXT NOT NULL,
      process_type TEXT NOT NULL,
      severity TEXT NOT NULL
    );
    ALTER TABLE processing_defects ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read processing_defects" ON processing_defects FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 9. defect_causes
    CREATE TABLE IF NOT EXISTS defect_causes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      defect_id UUID REFERENCES processing_defects(id) ON DELETE CASCADE,
      cause_category TEXT NOT NULL, -- material, machine, mould
      cause_description TEXT NOT NULL,
      diagnostic_check TEXT NOT NULL,
      recommended_adjustment TEXT NOT NULL,
      confidence_level TEXT NOT NULL,
      supporting_source TEXT NOT NULL
    );
    ALTER TABLE defect_causes ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read defect_causes" ON defect_causes FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 10. troubleshooting_sessions
    CREATE TABLE IF NOT EXISTS troubleshooting_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      defect_id UUID REFERENCES processing_defects(id) ON DELETE CASCADE,
      user_inputs JSONB NOT NULL,
      recommended_solution TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE troubleshooting_sessions ENABLE ROW LEVEL SECURITY;

    -- 11. virtual_lab_modules
    CREATE TABLE IF NOT EXISTS virtual_lab_modules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      test_type TEXT NOT NULL,
      description TEXT NOT NULL,
      prediction_options JSONB NOT NULL,
      simulation_config JSONB NOT NULL
    );
    ALTER TABLE virtual_lab_modules ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read virtual_lab_modules" ON virtual_lab_modules FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 12. virtual_lab_attempts
    CREATE TABLE IF NOT EXISTS virtual_lab_attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      module_id UUID REFERENCES virtual_lab_modules(id) ON DELETE CASCADE,
      student_prediction TEXT NOT NULL,
      simulation_result JSONB NOT NULL,
      prediction_correct BOOLEAN NOT NULL,
      completed_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE virtual_lab_attempts ENABLE ROW LEVEL SECURITY;

    -- 13. engineering_projects
    CREATE TABLE IF NOT EXISTS engineering_projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      title TEXT NOT NULL,
      objective TEXT NOT NULL,
      selected_material_id UUID REFERENCES polymer_materials(id) ON DELETE SET NULL,
      processing_plan JSONB,
      visibility TEXT DEFAULT 'private',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE engineering_projects ENABLE ROW LEVEL SECURITY;

    -- 14. project_artifacts
    CREATE TABLE IF NOT EXISTS project_artifacts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID REFERENCES engineering_projects(id) ON DELETE CASCADE,
      artifact_type TEXT NOT NULL,
      content JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE project_artifacts ENABLE ROW LEVEL SECURITY;
  `;

  console.log('SQL Schema defined for all 14 new Sprint 4A tables.');
}

applySprint4aSchema();
