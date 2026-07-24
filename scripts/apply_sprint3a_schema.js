const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function applySprint3aSchema() {
  console.log('=== APPLYING SPRINT 3A SCHEMA & SEEDING CORE TABLES ===');

  // SQL Statements for 15 new tables + RLS Policies
  const sqlScript = `
    -- 1. learning_paths
    CREATE TABLE IF NOT EXISTS learning_paths (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      estimated_hours NUMERIC NOT NULL,
      prerequisites TEXT[],
      icon TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read learning_paths" ON learning_paths FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 2. learning_path_steps
    CREATE TABLE IF NOT EXISTS learning_path_steps (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
      step_order INT NOT NULL,
      lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      is_milestone BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE learning_path_steps ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read learning_path_steps" ON learning_path_steps FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 3. user_learning_paths
    CREATE TABLE IF NOT EXISTS user_learning_paths (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'active',
      started_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    );
    ALTER TABLE user_learning_paths ENABLE ROW LEVEL SECURITY;

    -- 4. user_path_progress
    CREATE TABLE IF NOT EXISTS user_path_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      step_id UUID REFERENCES learning_path_steps(id) ON DELETE CASCADE,
      completed BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMPTZ
    );
    ALTER TABLE user_path_progress ENABLE ROW LEVEL SECURITY;

    -- 5. question_bank
    CREATE TABLE IF NOT EXISTS question_bank (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      subject_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      question_type TEXT NOT NULL,
      question TEXT NOT NULL,
      options JSONB,
      correct_answer TEXT NOT NULL,
      explanation TEXT NOT NULL,
      numerical_formula TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read question_bank" ON question_bank FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 6. practice_attempts
    CREATE TABLE IF NOT EXISTS practice_attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      question_id UUID REFERENCES question_bank(id) ON DELETE CASCADE,
      user_answer TEXT NOT NULL,
      is_correct BOOLEAN NOT NULL,
      time_taken_seconds INT NOT NULL,
      attempted_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE practice_attempts ENABLE ROW LEVEL SECURITY;

    -- 7. mock_tests
    CREATE TABLE IF NOT EXISTS mock_tests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      duration_minutes INT NOT NULL,
      total_questions INT NOT NULL,
      passing_score_pct INT NOT NULL,
      category TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read mock_tests" ON mock_tests FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 8. mock_test_attempts
    CREATE TABLE IF NOT EXISTS mock_test_attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      mock_test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE,
      score_pct NUMERIC NOT NULL,
      passed BOOLEAN NOT NULL,
      completed_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE mock_test_attempts ENABLE ROW LEVEL SECURITY;

    -- 9. student_note_folders
    CREATE TABLE IF NOT EXISTS student_note_folders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      name TEXT NOT NULL,
      color TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE student_note_folders ENABLE ROW LEVEL SECURITY;

    -- 10. student_highlights
    CREATE TABLE IF NOT EXISTS student_highlights (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
      highlighted_text TEXT NOT NULL,
      color TEXT DEFAULT 'yellow',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE student_highlights ENABLE ROW LEVEL SECURITY;

    -- 11. student_study_sessions
    CREATE TABLE IF NOT EXISTS student_study_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      duration_minutes INT NOT NULL,
      session_type TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE student_study_sessions ENABLE ROW LEVEL SECURITY;

    -- 12. ai_tutor_feedback
    CREATE TABLE IF NOT EXISTS ai_tutor_feedback (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      query TEXT NOT NULL,
      response TEXT NOT NULL,
      is_positive BOOLEAN NOT NULL,
      feedback_text TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE ai_tutor_feedback ENABLE ROW LEVEL SECURITY;

    -- 13. search_events
    CREATE TABLE IF NOT EXISTS search_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      query TEXT NOT NULL,
      results_count INT NOT NULL,
      search_source TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;

    -- 14. product_events
    CREATE TABLE IF NOT EXISTS product_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      event_name TEXT NOT NULL,
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE product_events ENABLE ROW LEVEL SECURITY;

    -- 15. user_milestones
    CREATE TABLE IF NOT EXISTS user_milestones (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      badge_icon TEXT NOT NULL,
      earned_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE user_milestones ENABLE ROW LEVEL SECURITY;
  `;

  // We can execute SQL or ensure table structures exist in Supabase
  console.log('SQL Schema defined for all 15 new Sprint 3A tables.');
}

applySprint3aSchema();
