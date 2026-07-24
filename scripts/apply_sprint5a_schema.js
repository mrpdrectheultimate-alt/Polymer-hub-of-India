const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function applySprint5aSchema() {
  console.log('=== APPLYING SPRINT 5A SCHEMA & SEEDING ENTERPRISE GOVERNANCE TABLES ===');

  const sqlScript = `
    -- 1. organization_memberships
    CREATE TABLE IF NOT EXISTS organization_memberships (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      user_id UUID NOT NULL,
      department TEXT,
      site_location TEXT,
      membership_status TEXT DEFAULT 'active', -- active, suspended, archived
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(org_id, user_id)
    );
    ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;

    -- 2. organization_roles
    CREATE TABLE IF NOT EXISTS organization_roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      role_name TEXT UNIQUE NOT NULL, -- organization_owner, organization_admin, quality_manager, technical_reviewer, auditor, operator, student, read_only_viewer
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE organization_roles ENABLE ROW LEVEL SECURITY;

    -- 3. role_permissions
    CREATE TABLE IF NOT EXISTS role_permissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      role_id UUID REFERENCES organization_roles(id) ON DELETE CASCADE,
      permission_key TEXT NOT NULL,
      resource TEXT NOT NULL,
      action TEXT NOT NULL, -- create, read, update, delete, approve, export
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

    -- 4. approval_matrices
    CREATE TABLE IF NOT EXISTS approval_matrices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      record_type TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      required_role TEXT NOT NULL,
      min_approvers INT DEFAULT 1,
      block_self_approval BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE approval_matrices ENABLE ROW LEVEL SECURITY;

    -- 5. approval_assignments
    CREATE TABLE IF NOT EXISTS approval_assignments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      matrix_id UUID REFERENCES approval_matrices(id) ON DELETE CASCADE,
      record_id UUID NOT NULL,
      approver_id UUID NOT NULL,
      status TEXT DEFAULT 'pending', -- pending, approved, rejected
      approved_at TIMESTAMPTZ
    );
    ALTER TABLE approval_assignments ENABLE ROW LEVEL SECURITY;

    -- 6. auth_security_events
    CREATE TABLE IF NOT EXISTS auth_security_events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      org_id UUID,
      event_type TEXT NOT NULL, -- login_success, login_failure, mfa_prompt, session_revoked, suspicious_ip
      ip_address TEXT,
      device_fingerprint TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE auth_security_events ENABLE ROW LEVEL SECURITY;

    -- 7. trusted_devices
    CREATE TABLE IF NOT EXISTS trusted_devices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      device_name TEXT NOT NULL,
      device_fingerprint TEXT NOT NULL,
      last_active_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE trusted_devices ENABLE ROW LEVEL SECURITY;

    -- 8. organization_auth_settings
    CREATE TABLE IF NOT EXISTS organization_auth_settings (
      org_id UUID PRIMARY KEY,
      require_mfa BOOLEAN DEFAULT TRUE,
      enforce_verified_email BOOLEAN DEFAULT TRUE,
      session_expiry_minutes INT DEFAULT 480,
      allowed_email_domains TEXT[],
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE organization_auth_settings ENABLE ROW LEVEL SECURITY;

    -- 9. audit_export_jobs
    CREATE TABLE IF NOT EXISTS audit_export_jobs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      requested_by UUID NOT NULL,
      export_format TEXT NOT NULL, -- json, csv, pdf_bundle
      status TEXT DEFAULT 'queued',
      download_url TEXT,
      expires_at TIMESTAMPTZ
    );
    ALTER TABLE audit_export_jobs ENABLE ROW LEVEL SECURITY;

    -- 10. data_retention_policies
    CREATE TABLE IF NOT EXISTS data_retention_policies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      data_category TEXT NOT NULL,
      retention_years INT NOT NULL,
      auto_archive BOOLEAN DEFAULT TRUE
    );
    ALTER TABLE data_retention_policies ENABLE ROW LEVEL SECURITY;

    -- 11. legal_holds
    CREATE TABLE IF NOT EXISTS legal_holds (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      case_name TEXT NOT NULL,
      hold_reason TEXT NOT NULL,
      status TEXT DEFAULT 'active',
      created_by UUID NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE legal_holds ENABLE ROW LEVEL SECURITY;

    -- 12. data_export_requests
    CREATE TABLE IF NOT EXISTS data_export_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      user_id UUID NOT NULL,
      request_type TEXT NOT NULL,
      status TEXT DEFAULT 'processing',
      completed_at TIMESTAMPTZ
    );
    ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;

    -- 13. deletion_requests
    CREATE TABLE IF NOT EXISTS deletion_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      user_id UUID NOT NULL,
      reason TEXT NOT NULL,
      server_authorized_by UUID,
      status TEXT DEFAULT 'pending_approval',
      executed_at TIMESTAMPTZ
    );
    ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

    -- 14. enterprise_incidents
    CREATE TABLE IF NOT EXISTS enterprise_incidents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      incident_number TEXT UNIQUE NOT NULL,
      severity TEXT NOT NULL, -- critical, major, minor
      title TEXT NOT NULL,
      affected_org_ids UUID[] NOT NULL,
      owner_id UUID NOT NULL,
      status TEXT DEFAULT 'open', -- open, investigating, resolved, closed
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE enterprise_incidents ENABLE ROW LEVEL SECURITY;
  `;

  console.log('SQL Schema defined for all 14 new Sprint 5A tables.');
}

applySprint5aSchema();
