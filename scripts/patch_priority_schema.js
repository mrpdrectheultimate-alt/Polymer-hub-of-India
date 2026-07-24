const fs = require('fs');

const backlogPath = 'curriculum_expansion_backlog_46_final.json';
const backlog = JSON.parse(fs.readFileSync(backlogPath, 'utf8'));

const updatedBacklog = backlog.map(item => {
  const b = item.priority_score_breakdown || {};
  const necessity = b.curriculum_necessity || 18;
  const prereqImp = b.prerequisite_importance || 13;
  const industrialRel = b.industrial_relevance || 13;
  const univGate = b.university_gate_alignment || 8;
  const numVal = b.numerical_learning_value || 8;
  const labVal = b.laboratory_testing_value || 8;
  const srcAvail = b.source_readiness || 8;
  const demand = b.learner_usefulness_demand || 8;
  
  // Penalties stored as positive magnitudes
  const dupPenMag = Math.abs(b.duplication_penalty || 0);
  const regPenMag = Math.abs(b.regulatory_risk_penalty || 0);

  const positiveSum = necessity + prereqImp + industrialRel + univGate + numVal + labVal + srcAvail + demand;
  const calculatedScore = positiveSum - dupPenMag - regPenMag;
  const clampedScore = Math.max(0, Math.min(100, calculatedScore));

  return {
    ...item,
    priority_score_breakdown: {
      curriculum_necessity: necessity,
      prerequisite_importance: prereqImp,
      industrial_relevance: industrialRel,
      university_gate_alignment: univGate,
      numerical_learning_value: numVal,
      laboratory_testing_value: labVal,
      source_readiness: srcAvail,
      learner_usefulness_demand: demand,
      duplication_penalty_magnitude: dupPenMag,
      regulatory_risk_penalty_magnitude: regPenMag,
      positive_sum: positiveSum,
      calculated_score: calculatedScore,
      clamped_priority_score: clampedScore
    },
    priority_score: clampedScore,
    lesson_quality_score: null // Explicitly null until post-production QA gate
  };
});

fs.writeFileSync(backlogPath, JSON.stringify(updatedBacklog, null, 2));
console.log('Successfully patched curriculum_expansion_backlog_46_final.json with clamped priority scores and lesson_quality_score: null');
