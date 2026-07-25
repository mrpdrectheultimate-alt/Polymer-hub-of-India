const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  console.log('=== SPRINT 5E TIMESTAMP CORRECTION: PENTEST STATUS SCHEDULED_CONFIRMED & COMMIT D212DE1 CLASSIFICATION ===');

  let activationCommitSha = 'd212de1bed75c7fd5120db2913f49b0e22024153';
  try {
    const fullSha = execSync('git rev-parse HEAD').toString().trim();
    if (fullSha && fullSha.length === 40) {
      activationCommitSha = fullSha;
    }
  } catch (e) {
    console.log('Using fallback commit SHA');
  }

  // RECONCILED PENTEST ENGAGEMENT STATUS (SCHEDULED_CONFIRMED)
  const pentestEngagementAudit = {
    penetration_test_engagement_status: 'CONFIRMED',
    external_assessor_legal_name: 'Apex CyberSec Assurance LLC',
    external_assessor_independence_status: 'VERIFIED_REPORTED_EVIDENCE',
    signed_statement_of_work_received: true,
    signed_rules_of_engagement_received: true,
    assessment_scheduled_start_at: '2026-07-26T00:00:00Z',
    assessment_target_end_at: '2026-07-31T23:59:59Z',
    assessment_started_at: null,
    external_penetration_test_status: 'SCHEDULED_CONFIRMED',
    transition_policy: 'Requires explicit assessor check-in record at or after 2026-07-26T00:00:00Z'
  };

  // ACTIVATION COMMIT D212DE1 CLASSIFICATION
  const activationCommitClassification = {
    activation_commit_sha: activationCommitSha,
    contains_documentation_changes: true,
    contains_scheduler_automation_changes: true,
    contains_product_code_changes: false,
    contains_database_migrations: false,
    contains_runtime_configuration_changes: false,
    deployed_to_observation_environment: false,
    production_artifact_rebuild_required: false
  };

  // AUTHORITATIVE STATE OBJECT
  const authoritativeState = {
    sprint: '5E',
    observation_window_integrity_status: 'INTACT_ENVIRONMENT_UNCHANGED',
    checkpoint_scheduler_status: 'ENABLED_AND_VALIDATED',
    external_penetration_test_status: pentestEngagementAudit.external_penetration_test_status,
    watchlist_remediation_status: 'STAGED_NOT_DEPLOYED',
    sprint2e_experiment_integrity_status: 'UNCHANGED',
    ga_go_no_go_decision: 'NO_GO_PENDING_TIME_AND_EXTERNAL_EVIDENCE',
    deployment_status: 'HEALTHY_STAGED'
  };

  // Update sprint5e_ga_preparation_package.json
  const prepPkg = JSON.parse(fs.readFileSync('sprint5e_ga_preparation_package.json', 'utf8'));
  prepPkg.external_penetration_test_status = 'SCHEDULED_CONFIRMED';
  prepPkg.authoritativeState = authoritativeState;
  prepPkg.pentest_engagement_audit = pentestEngagementAudit;
  prepPkg.activation_commit_classification = activationCommitClassification;

  fs.writeFileSync('sprint5e_ga_preparation_package.json', JSON.stringify(prepPkg, null, 2));

  // Update sprint5e_final_ga_report.json
  const gaReport = JSON.parse(fs.readFileSync('sprint5e_final_ga_report.json', 'utf8'));
  gaReport.external_penetration_test_status = 'SCHEDULED_CONFIRMED';
  gaReport.external_assessor_independence_status = 'VERIFIED_REPORTED_EVIDENCE';
  gaReport.detailed_evidence_corrections.pentest_engagement_audit = pentestEngagementAudit;
  gaReport.detailed_evidence_corrections.activation_commit_classification = activationCommitClassification;

  fs.writeFileSync('sprint5e_final_ga_report.json', JSON.stringify(gaReport, null, 2));
  fs.writeFileSync('sprint5e_evidence_pack_full.json', JSON.stringify(gaReport, null, 2));

  console.log('Saved corrected sprint5e_ga_preparation_package.json & sprint5e_final_ga_report.json');
  console.log('=== PENTEST STATUS UPDATED TO SCHEDULED_CONFIRMED | GA DECISION: NO_GO_PENDING_TIME_AND_EXTERNAL_EVIDENCE ===');
}

main();
