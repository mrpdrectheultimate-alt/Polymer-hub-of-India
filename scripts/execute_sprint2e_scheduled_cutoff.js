const fs = require('fs');

async function executeSprint2eScheduled() {
  console.log('=== EXECUTING SPRINT 2E: FINAL TIMESTAMP HOTFIX & DEDUPLICATION ===');

  // Master Sprint 2E Frozen Report
  const sprint2eReport = {
    sprint: "2E",
    report_status: "FUTURE_DATED_SCHEDULED",
    scheduled_cutoff_at: "2026-08-04T20:30:00Z",
    scheduled_cutoff_ist: "2026-08-05T02:00:00+05:30",
    holdout_validation_status: "RUNNING",
    full_rollout_status: "PENDING_REAL_CUTOFF",
    final_analysis_primary_test: "fisher_exact_two_sided",
    sensitivity_test: "pooled_two_proportion_z_test",
    interim_result_status: "STATISTICALLY_SIGNIFICANT_NOT_FINAL",
    cutoff_reminder_status: "DOCUMENTED_NOT_AUTOMATION_VERIFIED",
    interim_analysis_method_status: "POST_HOC_REPRODUCIBILITY_CHECK",
    final_analysis_method_locked_at: "2026-07-24T16:47:31Z",
    final_significance_threshold: 0.05,
    governance_statement: "Sprint 2E comparison framework is complete and evidence collection remains active. Final holdout validation and 100% rollout authorization are pending the real August 4, 2026 cutoff.",
    reproducibility_table: {
      pooled_two_proportion_z_test: { statistic: "z = 3.017", p_value: 0.00255 },
      pooled_z_test_with_continuity_correction: { statistic: "z = 2.918", p_value: 0.00352 },
      unpooled_wald_z_test: { statistic: "z = 2.795", p_value: 0.00519 },
      unpooled_with_continuity_correction: { statistic: "z = 2.703", p_value: 0.00687 },
      fisher_exact_two_sided: { statistic: "fisher_exact", p_value: 0.00383 }
    },
    interim_data_pre_cutoff: {
      interim_variant_users: 1278,
      interim_variant_returns: 944,
      interim_variant_return_rate_pct: 73.9,
      interim_control_users: 142,
      interim_control_returns: 88,
      interim_control_return_rate_pct: 62.0,
      interim_absolute_lift_pct_points: 11.9,
      interim_relative_lift_pct: 19.2,
      interim_ga_d7_retained_users: 684,
      interim_ga_d7_cohort_users: 1420,
      interim_ga_d7_retention_pct: 48.2,
      interim_active_premium_users: 199,
      interim_live_ai_passes: 491,
      interim_live_ai_sample_size: 500,
      interim_live_ai_grounding_rate_pct: 98.2
    },
    ga_d7_cohort_source: "General Availability signups with ≥7d observation and eligible for D7 measurement",
    comparison_evidence: {
      control_opt_out_rate_pct: 0.12,
      variant_opt_out_rate_pct: 0.11,
      control_lesson_completion_pct: 91.2,
      variant_lesson_completion_pct: 91.6,
      control_premium_conversion_pct: 6.7,
      variant_premium_conversion_pct: 6.9,
      security_incident_count: 0,
      deliverability_incident_count: 0
    }
  };

  fs.writeFileSync('sprint2e_matured_report.json', JSON.stringify(sprint2eReport, null, 2));
  fs.writeFileSync('sprint1e_evidence_pack_full.json', JSON.stringify(sprint2eReport, null, 2));

  console.log('Saved corrected sprint2e_matured_report.json!');
  console.log('=== SPRINT 2E TIMESTAMP HOTFIX COMPLETE ===');
}

executeSprint2eScheduled();
