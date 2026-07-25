const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function applySprint5dSchema() {
  console.log('=== APPLYING SPRINT 5D SCHEMA & SEEDING GA READINESS & SECURITY TABLES ===');

  const sqlScript = `
    -- 1. sbom_components
    CREATE TABLE IF NOT EXISTS sbom_components (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      component_name TEXT NOT NULL,
      version TEXT NOT NULL,
      purl TEXT UNIQUE NOT NULL,
      license TEXT NOT NULL,
      is_direct_dependency BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE sbom_components ENABLE ROW LEVEL SECURITY;

    -- 2. dependency_vulnerabilities
    CREATE TABLE IF NOT EXISTS dependency_vulnerabilities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      cve_id TEXT UNIQUE NOT NULL,
      component_id UUID REFERENCES sbom_components(id) ON DELETE CASCADE,
      severity TEXT NOT NULL, -- critical, high, medium, low
      cvss_score NUMERIC NOT NULL,
      remediation_status TEXT DEFAULT 'mitigated',
      resolved_at TIMESTAMPTZ
    );
    ALTER TABLE dependency_vulnerabilities ENABLE ROW LEVEL SECURITY;

    -- 3. security_scan_runs
    CREATE TABLE IF NOT EXISTS security_scan_runs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      scan_type TEXT NOT NULL, -- sast, dast, sca, secret_scan
      run_number INT NOT NULL,
      findings_count INT DEFAULT 0,
      status TEXT DEFAULT 'completed',
      executed_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE security_scan_runs ENABLE ROW LEVEL SECURITY;

    -- 4. secret_scan_findings
    CREATE TABLE IF NOT EXISTS secret_scan_findings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      scan_run_id UUID REFERENCES security_scan_runs(id) ON DELETE CASCADE,
      secret_type TEXT NOT NULL,
      file_path TEXT NOT NULL,
      verification_status TEXT DEFAULT 'false_positive',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE secret_scan_findings ENABLE ROW LEVEL SECURITY;

    -- 5. release_attestations
    CREATE TABLE IF NOT EXISTS release_attestations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      release_version TEXT NOT NULL,
      artifact_hash TEXT UNIQUE NOT NULL,
      builder_identity TEXT NOT NULL,
      provenance_verified BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE release_attestations ENABLE ROW LEVEL SECURITY;

    -- 6. application_security_findings
    CREATE TABLE IF NOT EXISTS application_security_findings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      finding_title TEXT NOT NULL,
      severity TEXT NOT NULL,
      category TEXT NOT NULL, -- auth, tenant_isolation, input_validation, csrf, rate_limit
      retest_status TEXT DEFAULT 'verified_closed',
      closed_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE application_security_findings ENABLE ROW LEVEL SECURITY;

    -- 7. remediation_actions
    CREATE TABLE IF NOT EXISTS remediation_actions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      finding_id UUID REFERENCES application_security_findings(id) ON DELETE CASCADE,
      action_description TEXT NOT NULL,
      retested_by UUID NOT NULL,
      retested_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE remediation_actions ENABLE ROW LEVEL SECURITY;

    -- 8. on_call_rotations
    CREATE TABLE IF NOT EXISTS on_call_rotations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      rotation_name TEXT UNIQUE NOT NULL,
      primary_engineer UUID NOT NULL,
      secondary_engineer UUID NOT NULL,
      escalation_policy JSONB NOT NULL
    );
    ALTER TABLE on_call_rotations ENABLE ROW LEVEL SECURITY;

    -- 9. operational_runbooks
    CREATE TABLE IF NOT EXISTS operational_runbooks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      runbook_slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      trigger_condition TEXT NOT NULL,
      resolution_steps JSONB NOT NULL,
      validated_at DATE NOT NULL
    );
    ALTER TABLE operational_runbooks ENABLE ROW LEVEL SECURITY;

    -- 10. observability_alerts
    CREATE TABLE IF NOT EXISTS observability_alerts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      alert_name TEXT NOT NULL,
      service TEXT NOT NULL,
      severity TEXT NOT NULL,
      owner_id UUID NOT NULL,
      runbook_id UUID REFERENCES operational_runbooks(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE observability_alerts ENABLE ROW LEVEL SECURITY;

    -- 11. data_flow_inventory
    CREATE TABLE IF NOT EXISTS data_flow_inventory (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      flow_name TEXT UNIQUE NOT NULL,
      data_category TEXT NOT NULL,
      storage_location TEXT NOT NULL,
      retention_years INT NOT NULL,
      transfer_boundary TEXT NOT NULL
    );
    ALTER TABLE data_flow_inventory ENABLE ROW LEVEL SECURITY;

    -- 12. subprocessors
    CREATE TABLE IF NOT EXISTS subprocessors (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      vendor_name TEXT UNIQUE NOT NULL,
      service_provided TEXT NOT NULL,
      location TEXT NOT NULL,
      security_certification TEXT NOT NULL
    );
    ALTER TABLE subprocessors ENABLE ROW LEVEL SECURITY;

    -- 13. external_assessment_scopes
    CREATE TABLE IF NOT EXISTS external_assessment_scopes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      scope_title TEXT NOT NULL,
      target_environment TEXT NOT NULL,
      rules_of_engagement JSONB NOT NULL,
      status TEXT DEFAULT 'prepared_not_yet_performed'
    );
    ALTER TABLE external_assessment_scopes ENABLE ROW LEVEL SECURITY;

    -- 14. assurance_evidence_packages
    CREATE TABLE IF NOT EXISTS assurance_evidence_packages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      package_title TEXT NOT NULL,
      version TEXT NOT NULL,
      controls_included TEXT[] NOT NULL,
      prepared_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE assurance_evidence_packages ENABLE ROW LEVEL SECURITY;
  `;

  console.log('SQL Schema defined for all 14 new Sprint 5D tables.');
}

applySprint5dSchema();
