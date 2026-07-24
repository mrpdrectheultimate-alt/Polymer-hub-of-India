const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function applySprint3cSchema() {
  console.log('=== APPLYING SPRINT 3C SCHEMA & SEEDING MASTERY & BILLING TABLES ===');

  const sqlScript = `
    -- 1. study_plans
    CREATE TABLE IF NOT EXISTS study_plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      title TEXT NOT NULL,
      target_date DATE NOT NULL,
      available_hours_per_week NUMERIC NOT NULL,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

    -- 2. study_plan_items
    CREATE TABLE IF NOT EXISTS study_plan_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
      lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
      scheduled_date DATE NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMPTZ
    );
    ALTER TABLE study_plan_items ENABLE ROW LEVEL SECURITY;

    -- 3. study_reminders
    CREATE TABLE IF NOT EXISTS study_reminders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      reminder_time TIME NOT NULL,
      days_of_week INT[] NOT NULL,
      is_enabled BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE study_reminders ENABLE ROW LEVEL SECURITY;

    -- 4. topic_mastery
    CREATE TABLE IF NOT EXISTS topic_mastery (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      subject_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      mastery_score_pct NUMERIC DEFAULT 0,
      last_assessed_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE topic_mastery ENABLE ROW LEVEL SECURITY;

    -- 5. revision_queue
    CREATE TABLE IF NOT EXISTS revision_queue (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
      due_date DATE NOT NULL,
      interval_days INT DEFAULT 1,
      ease_factor NUMERIC DEFAULT 2.5,
      status TEXT DEFAULT 'due'
    );
    ALTER TABLE revision_queue ENABLE ROW LEVEL SECURITY;

    -- 6. revision_attempts
    CREATE TABLE IF NOT EXISTS revision_attempts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      queue_id UUID REFERENCES revision_queue(id) ON DELETE CASCADE,
      confidence_rating INT NOT NULL,
      attempted_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE revision_attempts ENABLE ROW LEVEL SECURITY;

    -- 7. notifications
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      event_type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

    -- 8. notification_preferences
    CREATE TABLE IF NOT EXISTS notification_preferences (
      user_id UUID PRIMARY KEY,
      email_study_reminders BOOLEAN DEFAULT TRUE,
      email_quiz_results BOOLEAN DEFAULT TRUE,
      email_marketing BOOLEAN DEFAULT FALSE,
      in_app_notifications BOOLEAN DEFAULT TRUE,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

    -- 9. billing_events
    CREATE TABLE IF NOT EXISTS billing_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      event_type TEXT NOT NULL,
      amount_inr NUMERIC NOT NULL,
      payment_id TEXT UNIQUE NOT NULL,
      idempotency_key TEXT UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE billing_events ENABLE ROW LEVEL SECURITY;

    -- 10. subscription_entitlements
    CREATE TABLE IF NOT EXISTS subscription_entitlements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      plan_type TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      valid_until TIMESTAMPTZ NOT NULL,
      server_authorized_by TEXT DEFAULT 'system_service_role',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE subscription_entitlements ENABLE ROW LEVEL SECURITY;

    -- 11. certificates
    CREATE TABLE IF NOT EXISTS certificates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      certificate_number TEXT UNIQUE NOT NULL,
      user_id UUID NOT NULL,
      learner_name TEXT NOT NULL,
      path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
      score_pct NUMERIC NOT NULL,
      issue_date DATE NOT NULL,
      revocation_status BOOLEAN DEFAULT FALSE,
      verification_url TEXT NOT NULL
    );
    ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read valid certificates" ON certificates FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 12. certificate_verifications
    CREATE TABLE IF NOT EXISTS certificate_verifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      certificate_number TEXT REFERENCES certificates(certificate_number) ON DELETE CASCADE,
      verified_by_ip TEXT,
      verified_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE certificate_verifications ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      CREATE POLICY "Public read certificate_verifications" ON certificate_verifications FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- 13. content_versions
    CREATE TABLE IF NOT EXISTS content_versions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
      version_number INT NOT NULL,
      content TEXT NOT NULL,
      reviewer_id UUID NOT NULL,
      change_reason TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;

    -- 14. content_review_actions
    CREATE TABLE IF NOT EXISTS content_review_actions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
      stage TEXT NOT NULL,
      action TEXT NOT NULL,
      reviewer_identity TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE content_review_actions ENABLE ROW LEVEL SECURITY;
  `;

  console.log('SQL Schema defined for all 14 new Sprint 3C tables.');
}

applySprint3cSchema();
