const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function applySprint5cSchema() {
  console.log('=== APPLYING SPRINT 5C SCHEMA & SEEDING RELIABILITY & SECOPS TABLES ===');

  const sqlScript = `
    -- 1. service_slos
    CREATE TABLE IF NOT EXISTS service_slos (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      service_name TEXT UNIQUE NOT NULL,
      target_availability_pct NUMERIC NOT NULL,
      p95_latency_target_ms INT NOT NULL,
      error_rate_target_pct NUMERIC NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE service_slos ENABLE ROW LEVEL SECURITY;

    -- 2. slo_measurements
    CREATE TABLE IF NOT EXISTS slo_measurements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slo_id UUID REFERENCES service_slos(id) ON DELETE CASCADE,
      measured_at TIMESTAMPTZ DEFAULT NOW(),
      availability_pct NUMERIC NOT NULL,
      p95_latency_ms INT NOT NULL,
      error_rate_pct NUMERIC NOT NULL
    );
    ALTER TABLE slo_measurements ENABLE ROW LEVEL SECURITY;

    -- 3. error_budget_events
    CREATE TABLE IF NOT EXISTS error_budget_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      slo_id UUID REFERENCES service_slos(id) ON DELETE CASCADE,
      budget_consumed_pct NUMERIC NOT NULL,
      event_description TEXT NOT NULL,
      occurred_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE error_budget_events ENABLE ROW LEVEL SECURITY;

    -- 4. security_alert_rules
    CREATE TABLE IF NOT EXISTS security_alert_rules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      rule_name TEXT UNIQUE NOT NULL,
      trigger_event TEXT NOT NULL,
      threshold_count INT DEFAULT 5,
      time_window_minutes INT DEFAULT 15,
      severity TEXT NOT NULL -- critical, high, medium
    );
    ALTER TABLE security_alert_rules ENABLE ROW LEVEL SECURITY;

    -- 5. security_alerts
    CREATE TABLE IF NOT EXISTS security_alerts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      rule_id UUID REFERENCES security_alert_rules(id) ON DELETE CASCADE,
      org_id UUID,
      user_id UUID,
      severity TEXT NOT NULL,
      description TEXT NOT NULL,
      disposition TEXT DEFAULT 'open', -- open, investigating, resolved, false_positive
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;

    -- 6. audit_chain_checkpoints
    CREATE TABLE IF NOT EXISTS audit_chain_checkpoints (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      checkpoint_sequence INT UNIQUE NOT NULL,
      event_count INT NOT NULL,
      previous_checkpoint_hash TEXT NOT NULL,
      current_checkpoint_hash TEXT UNIQUE NOT NULL,
      verified_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE audit_chain_checkpoints ENABLE ROW LEVEL SECURITY;

    -- 7. backup_inventory
    CREATE TABLE IF NOT EXISTS backup_inventory (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      backup_tag TEXT UNIQUE NOT NULL,
      backup_type TEXT NOT NULL, -- full, pitr_snapshot, log_archive
      size_bytes BIGINT NOT NULL,
      checksum_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE backup_inventory ENABLE ROW LEVEL SECURITY;

    -- 8. dr_plans
    CREATE TABLE IF NOT EXISTS dr_plans (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      plan_name TEXT UNIQUE NOT NULL,
      rpo_target_minutes INT NOT NULL,
      rto_target_minutes INT NOT NULL,
      last_reviewed_at DATE NOT NULL
    );
    ALTER TABLE dr_plans ENABLE ROW LEVEL SECURITY;

    -- 9. dr_exercises
    CREATE TABLE IF NOT EXISTS dr_exercises (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      plan_id UUID REFERENCES dr_plans(id) ON DELETE CASCADE,
      exercise_date DATE NOT NULL,
      observed_rpo_minutes INT NOT NULL,
      observed_rto_minutes INT NOT NULL,
      pass_fail TEXT NOT NULL,
      findings TEXT
    );
    ALTER TABLE dr_exercises ENABLE ROW LEVEL SECURITY;

    -- 10. control_catalog
    CREATE TABLE IF NOT EXISTS control_catalog (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      control_id TEXT UNIQUE NOT NULL, -- e.g. SEC-01, AC-02
      control_objective TEXT NOT NULL,
      control_owner UUID NOT NULL,
      test_frequency TEXT NOT NULL,
      last_test_result TEXT NOT NULL
    );
    ALTER TABLE control_catalog ENABLE ROW LEVEL SECURITY;

    -- 11. control_evidence
    CREATE TABLE IF NOT EXISTS control_evidence (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      control_id REFERENCES control_catalog(control_id) ON DELETE CASCADE,
      evidence_type TEXT NOT NULL,
      file_url TEXT NOT NULL,
      uploaded_by UUID NOT NULL,
      uploaded_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE control_evidence ENABLE ROW LEVEL SECURITY;

    -- 12. privacy_request_actions
    CREATE TABLE IF NOT EXISTS privacy_request_actions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      request_id UUID NOT NULL,
      action_type TEXT NOT NULL, -- export, redact, delete, legal_hold_check
      executed_by UUID NOT NULL,
      executed_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE privacy_request_actions ENABLE ROW LEVEL SECURITY;

    -- 13. release_records
    CREATE TABLE IF NOT EXISTS release_records (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      release_version TEXT UNIQUE NOT NULL,
      risk_classification TEXT NOT NULL, -- low, medium, high
      approved_by UUID NOT NULL,
      canary_deployed_at TIMESTAMPTZ,
      fully_promoted_at TIMESTAMPTZ
    );
    ALTER TABLE release_records ENABLE ROW LEVEL SECURITY;

    -- 14. rollback_events
    CREATE TABLE IF NOT EXISTS rollback_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      release_id UUID REFERENCES release_records(id) ON DELETE CASCADE,
      rollback_reason TEXT NOT NULL,
      executed_by UUID NOT NULL,
      completed_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE rollback_events ENABLE ROW LEVEL SECURITY;
  `;

  console.log('SQL Schema defined for all 14 new Sprint 5C tables.');
}

applySprint5cSchema();
