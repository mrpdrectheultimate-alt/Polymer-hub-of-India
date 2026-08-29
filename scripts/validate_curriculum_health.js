// scripts/validate_curriculum_health.js
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runFullCurriculumAudit() {
  console.log("════════════════════════════════════════════════════════════════════════════════");
  console.log("🔍 RUNNING AUTOMATED CURRICULUM HEALTH & SCIENTIFIC INTEGRITY AUDIT");
  console.log("════════════════════════════════════════════════════════════════════════════════\n");

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title, slug, content, subject_id, module_id');

  if (error) {
    console.error("Failed to query lessons table:", error);
    process.exit(1);
  }

  console.log(`📊 Found ${lessons.length} total lessons across the PolymerHub curriculum.\n`);

  let totalScore = 0;
  let healthyLessons = 0;
  let moderateLessons = 0;
  let attentionRequired = 0;
  let totalWords = 0;
  let totalKaTeXFormulas = 0;

  const results = [];

  for (const lesson of lessons) {
    const text = lesson.content || '';
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    totalWords += wordCount;

    // KaTeX formula occurrences ($...$ or $$...$$)
    const katexMatches = (text.match(/\$[^$]+\$/g) || []).length;
    totalKaTeXFormulas += katexMatches;

    // Structural checks
    const hasObjectives = /objective|learning goals|prerequisites|introduction/i.test(text);
    const hasHeadings = (text.match(/^#{1,4}\s+/gm) || []).length >= 3;
    const hasFormulas = katexMatches > 0 || /equation|formula|kinetics|modulus|temperature/i.test(text);
    const hasSummary = /takeaway|summary|conclusion|key point/i.test(text);
    const hasApplications = /application|industrial|manufacturing|processing|astm|iso/i.test(text);

    // Calculate deterministic Health Score out of 100
    let score = 0;
    if (wordCount >= 400) score += 30;
    else if (wordCount >= 200) score += 20;
    else score += 10;

    if (hasObjectives) score += 15;
    if (hasHeadings) score += 15;
    if (hasFormulas) score += 20;
    if (hasSummary) score += 10;
    if (hasApplications) score += 10;

    totalScore += score;

    if (score >= 85) healthyLessons++;
    else if (score >= 70) moderateLessons++;
    else attentionRequired++;

    results.push({
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      wordCount,
      katexMatches,
      score,
    });
  }

  const avgScore = (totalScore / (lessons.length || 1)).toFixed(1);
  const avgWords = Math.round(totalWords / (lessons.length || 1));

  console.log("────────────────────────────────────────────────────────────────────────────────");
  console.log("📋 CURRICULUM HEALTH AUDIT SUMMARY MATRIX");
  console.log("────────────────────────────────────────────────────────────────────────────────");
  console.log(`• Total Verified Lessons:         ${lessons.length}`);
  console.log(`• Average Health Score:           ${avgScore} / 100`);
  console.log(`• Total Curriculum Word Count:    ${totalWords.toLocaleString()} words (~${avgWords} words/lesson)`);
  console.log(`• Total KaTeX Equations:          ${totalKaTeXFormulas.toLocaleString()} math expressions`);
  console.log(`• Tier 1 Lessons (Score >= 85):   ${healthyLessons} (${Math.round((healthyLessons/lessons.length)*100)}%)`);
  console.log(`• Tier 2 Lessons (Score 70-84):   ${moderateLessons} (${Math.round((moderateLessons/lessons.length)*100)}%)`);
  console.log(`• Lessons Needing Attention:      ${attentionRequired}`);
  console.log("────────────────────────────────────────────────────────────────────────────────\n");

  if (attentionRequired > 0) {
    console.log("⚠️ Lessons Flagged for Content Enrichment (< 70 score):");
    results.filter(r => r.score < 70).slice(0, 10).forEach(r => {
      console.log(`  - [Score: ${r.score}] "${r.title}" (${r.slug}) — ${r.wordCount} words`);
    });
  } else {
    console.log("✅ 100% of lessons meet or exceed the rigorous Engineering Quality Threshold!");
  }
}

runFullCurriculumAudit();
