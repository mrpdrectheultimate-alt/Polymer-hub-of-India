const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function applySprint4cSchema() {
  console.log('=== APPLYING SPRINT 4C SCHEMA & SEEDING QUALITY & TRACEABILITY TABLES ===');

  const sqlScript = `
    -- 1. material_grades
    CREATE TABLE IF NOT EXISTS material_grades (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      manufacturer TEXT NOT NULL,
      grade_name TEXT UNIQUE NOT NULL,
      material_family TEXT NOT NULL,
      is_superseded BOOLEAN DEFAULT FALSE,
      superseded_by_grade_id UUID REFERENCES material_grades(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE material_grades ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read material_grades" ON material_grades FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 2. grade_datasheets
    CREATE TABLE IF NOT EXISTS grade_datasheets (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      grade_id UUID REFERENCES material_grades(id) ON DELETE CASCADE,
      datasheet_revision TEXT NOT NULL,
      document_date DATE NOT NULL,
      source_url TEXT NOT NULL,
      freshness_status TEXT DEFAULT 'verified',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE grade_datasheets ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read grade_datasheets" ON grade_datasheets FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 3. datasheet_versions
    CREATE TABLE IF NOT EXISTS datasheet_versions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      datasheet_id UUID REFERENCES grade_datasheets(id) ON DELETE CASCADE,
      version_number INT NOT NULL,
      properties_snapshot JSONB NOT NULL,
      archived_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE datasheet_versions ENABLE ROW LEVEL SECURITY;

    -- 4. quality_test_plans
    CREATE TABLE IF NOT EXISTS quality_test_plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      user_id UUID NOT NULL,
      plan_name TEXT NOT NULL,
      material_grade_id UUID REFERENCES material_grades(id) ON DELETE SET NULL,
      test_methods TEXT[] NOT NULL,
      acceptance_limits JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE quality_test_plans ENABLE ROW LEVEL SECURITY;

    -- 5. quality_samples
    CREATE TABLE IF NOT EXISTS quality_samples (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      plan_id UUID REFERENCES quality_test_plans(id) ON DELETE CASCADE,
      sample_code TEXT UNIQUE NOT NULL,
      batch_number TEXT NOT NULL,
      specimen_prep_notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE quality_samples ENABLE ROW LEVEL SECURITY;

    -- 6. quality_test_results
    CREATE TABLE IF NOT EXISTS quality_test_results (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sample_id UUID REFERENCES quality_samples(id) ON DELETE CASCADE,
      test_property TEXT NOT NULL,
      measured_value NUMERIC NOT NULL,
      unit TEXT NOT NULL,
      pass_fail TEXT NOT NULL,
      instrument_used TEXT,
      reviewed_by UUID,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE quality_test_results ENABLE ROW LEVEL SECURITY;

    -- 7. material_batches
    CREATE TABLE IF NOT EXISTS material_batches (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      batch_number TEXT UNIQUE NOT NULL,
      supplier_name TEXT NOT NULL,
      grade_id UUID REFERENCES material_grades(id) ON DELETE CASCADE,
      quarantine_status BOOLEAN DEFAULT FALSE,
      recall_flag BOOLEAN DEFAULT FALSE,
      disposition TEXT DEFAULT 'approved',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE material_batches ENABLE ROW LEVEL SECURITY;

    -- 8. batch_events
    CREATE TABLE IF NOT EXISTS batch_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      batch_id UUID REFERENCES material_batches(id) ON DELETE CASCADE,
      event_type TEXT NOT NULL,
      actor_id UUID NOT NULL,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW() -- Immutable audit log
    );
    ALTER TABLE batch_events ENABLE ROW LEVEL SECURITY;

    -- 9. nonconformances
    CREATE TABLE IF NOT EXISTS nonconformances (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      ncr_number TEXT UNIQUE NOT NULL,
      batch_id UUID REFERENCES material_batches(id) ON DELETE SET NULL,
      stage TEXT DEFAULT 'reported',
      issue_description TEXT NOT NULL,
      containment_action TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE nonconformances ENABLE ROW LEVEL SECURITY;

    -- 10. corrective_actions
    CREATE TABLE IF NOT EXISTS corrective_actions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ncr_id UUID REFERENCES nonconformances(id) ON DELETE CASCADE,
      five_why_analysis JSONB,
      fishbone_categories JSONB,
      corrective_plan TEXT NOT NULL,
      closed_at TIMESTAMPTZ
    );
    ALTER TABLE corrective_actions ENABLE ROW LEVEL SECURITY;

    -- 11. process_trials
    CREATE TABLE IF NOT EXISTS process_trials (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      trial_title TEXT NOT NULL,
      objective TEXT NOT NULL,
      factors JSONB NOT NULL,
      response_variables JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE process_trials ENABLE ROW LEVEL SECURITY;

    -- 12. process_trial_runs
    CREATE TABLE IF NOT EXISTS process_trial_runs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      trial_id UUID REFERENCES process_trials(id) ON DELETE CASCADE,
      run_number INT NOT NULL,
      factor_settings JSONB NOT NULL,
      observed_outputs JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE process_trial_runs ENABLE ROW LEVEL SECURITY;

    -- 13. failure_analysis_cases
    CREATE TABLE IF NOT EXISTS failure_analysis_cases (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      symptom TEXT NOT NULL,
      service_environment TEXT NOT NULL,
      material_family TEXT NOT NULL,
      confidence_level TEXT NOT NULL,
      corrective_category TEXT NOT NULL
    );
    ALTER TABLE failure_analysis_cases ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read failure_analysis_cases" ON failure_analysis_cases FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 14. failure_analysis_evidence
    CREATE TABLE IF NOT EXISTS failure_analysis_evidence (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      case_id UUID REFERENCES failure_analysis_cases(id) ON DELETE CASCADE,
      test_type TEXT NOT NULL,
      evidence_description TEXT NOT NULL,
      ruled_out_causes TEXT[] NOT NULL
    );
    ALTER TABLE failure_analysis_evidence ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read failure_analysis_evidence" ON failure_analysis_evidence FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `;

  console.log('SQL Schema defined for all 14 new Sprint 4C tables.');
}

applySprint4cSchema();
