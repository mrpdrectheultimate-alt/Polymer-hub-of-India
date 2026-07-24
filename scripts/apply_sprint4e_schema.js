const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function applySprint4eSchema() {
  console.log('=== APPLYING SPRINT 4E SCHEMA & SEEDING ENTERPRISE QUALITY TABLES ===');

  const sqlScript = `
    -- 1. suppliers
    CREATE TABLE IF NOT EXISTS suppliers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      supplier_name TEXT NOT NULL,
      supplier_code TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'qualified',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

    -- 2. supplier_qualifications
    CREATE TABLE IF NOT EXISTS supplier_qualifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
      qualification_type TEXT NOT NULL,
      valid_until DATE NOT NULL,
      approved_by UUID NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE supplier_qualifications ENABLE ROW LEVEL SECURITY;

    -- 3. certificates_of_analysis
    CREATE TABLE IF NOT EXISTS certificates_of_analysis (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
      coa_number TEXT UNIQUE NOT NULL,
      batch_number TEXT NOT NULL,
      test_data JSONB NOT NULL,
      is_valid BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE certificates_of_analysis ENABLE ROW LEVEL SECURITY;

    -- 4. quality_instruments
    CREATE TABLE IF NOT EXISTS quality_instruments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      instrument_tag TEXT UNIQUE NOT NULL,
      model_name TEXT NOT NULL,
      serial_number TEXT NOT NULL,
      calibration_frequency_days INT DEFAULT 365,
      last_calibrated_at DATE NOT NULL,
      next_calibration_due DATE NOT NULL,
      status TEXT DEFAULT 'in_service'
    );
    ALTER TABLE quality_instruments ENABLE ROW LEVEL SECURITY;

    -- 5. calibration_records
    CREATE TABLE IF NOT EXISTS calibration_records (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      instrument_id UUID REFERENCES quality_instruments(id) ON DELETE CASCADE,
      certificate_number TEXT NOT NULL,
      calibration_date DATE NOT NULL,
      pass_fail TEXT NOT NULL,
      performed_by TEXT NOT NULL
    );
    ALTER TABLE calibration_records ENABLE ROW LEVEL SECURITY;

    -- 6. controlled_documents
    CREATE TABLE IF NOT EXISTS controlled_documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      doc_number TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      version INT DEFAULT 1,
      status TEXT DEFAULT 'effective', -- effective, obsolete, draft
      effective_date DATE NOT NULL,
      approved_by UUID NOT NULL
    );
    ALTER TABLE controlled_documents ENABLE ROW LEVEL SECURITY;

    -- 7. document_acknowledgements
    CREATE TABLE IF NOT EXISTS document_acknowledgements (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      doc_id UUID REFERENCES controlled_documents(id) ON DELETE CASCADE,
      user_id UUID NOT NULL,
      acknowledged_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE document_acknowledgements ENABLE ROW LEVEL SECURITY;

    -- 8. training_assignments
    CREATE TABLE IF NOT EXISTS training_assignments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      doc_id UUID REFERENCES controlled_documents(id) ON DELETE CASCADE,
      user_id UUID NOT NULL,
      due_date DATE NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      completed_at TIMESTAMPTZ
    );
    ALTER TABLE training_assignments ENABLE ROW LEVEL SECURITY;

    -- 9. competency_records
    CREATE TABLE IF NOT EXISTS competency_records (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      competency_title TEXT NOT NULL,
      authorization_expires_at DATE NOT NULL,
      assessed_by UUID NOT NULL
    );
    ALTER TABLE competency_records ENABLE ROW LEVEL SECURITY;

    -- 10. change_controls
    CREATE TABLE IF NOT EXISTS change_controls (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      change_number TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      impact_analysis TEXT NOT NULL,
      status TEXT DEFAULT 'proposed' -- proposed, approved, implemented, closed
    );
    ALTER TABLE change_controls ENABLE ROW LEVEL SECURITY;

    -- 11. change_control_approvals
    CREATE TABLE IF NOT EXISTS change_control_approvals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      change_id UUID REFERENCES change_controls(id) ON DELETE CASCADE,
      approver_id UUID NOT NULL,
      approval_role TEXT NOT NULL,
      approved_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE change_control_approvals ENABLE ROW LEVEL SECURITY;

    -- 12. internal_audits
    CREATE TABLE IF NOT EXISTS internal_audits (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      audit_number TEXT UNIQUE NOT NULL,
      audit_title TEXT NOT NULL,
      scheduled_date DATE NOT NULL,
      lead_auditor UUID NOT NULL,
      status TEXT DEFAULT 'scheduled'
    );
    ALTER TABLE internal_audits ENABLE ROW LEVEL SECURITY;

    -- 13. audit_findings
    CREATE TABLE IF NOT EXISTS audit_findings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      audit_id UUID REFERENCES internal_audits(id) ON DELETE CASCADE,
      finding_type TEXT NOT NULL, -- major, minor, observation
      description TEXT NOT NULL,
      owner_id UUID NOT NULL,
      due_date DATE NOT NULL,
      closed_at TIMESTAMPTZ
    );
    ALTER TABLE audit_findings ENABLE ROW LEVEL SECURITY;

    -- 14. quality_risks
    CREATE TABLE IF NOT EXISTS quality_risks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      org_id UUID NOT NULL,
      risk_title TEXT NOT NULL,
      severity INT NOT NULL,
      likelihood INT NOT NULL,
      risk_priority_number INT GENERATED ALWAYS AS (severity * likelihood) STORED,
      mitigation_plan TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE quality_risks ENABLE ROW LEVEL SECURITY;
  `;

  console.log('SQL Schema defined for all 14 new Sprint 4E tables.');
}

applySprint4eSchema();
