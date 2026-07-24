const fs = require('fs');

const planPath = 'curriculum_dual_track_batch_plan_final.json';
const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));

plan.metadata.interim_ledger_after_batch_1a_passing = {
  total_lessons: 107,
  grade_a: 41,
  grade_b: 66,
  grade_c: 0,
  status: "Conditioned on Batch 1A QA gate passing score >= 85/100 for all 8 actions"
};

fs.writeFileSync(planPath, JSON.stringify(plan, null, 2));
console.log('Successfully updated curriculum_dual_track_batch_plan_final.json with Batch 1A interim ledger definitions.');
