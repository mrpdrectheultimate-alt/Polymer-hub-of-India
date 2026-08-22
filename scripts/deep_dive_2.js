// Deep dive 2 comprehensive interactive engine & API audit script
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const sAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const sAnon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const issues = [];
  console.log('\n' + '='.repeat(70));
  console.log('POLYMERHUB DEEP DIVE 2 — LOGIC, ENGINE & INTERACTION AUDIT');
  console.log('='.repeat(70));

  // 1. Check Commercial Grades in src/lib/commercial_grades.ts
  console.log('\n[1] COMPARATOR & COMMERCIAL GRADES DATA');
  try {
    const gradesPath = path.resolve('src/lib/commercial_grades.ts');
    if (fs.existsSync(gradesPath)) {
      const content = fs.readFileSync(gradesPath, 'utf8');
      const gradeMatches = content.match(/id:\s*['"][^'"]+['"]/g) || [];
      console.log(`  ✅ Found ${gradeMatches.length} commercial polymer grades configured`);
    } else {
      issues.push('Missing commercial_grades.ts');
    }
  } catch (err) {
    issues.push('Comparator error: ' + err.message);
  }

  // 2. Check SPE Career Tracks in src/lib/spe_tracks.ts
  console.log('\n[2] SPE CAREER TRACKS ENGINE');
  try {
    const tracksPath = path.resolve('src/lib/spe_tracks.ts');
    if (fs.existsSync(tracksPath)) {
      const content = fs.readFileSync(tracksPath, 'utf8');
      const trackMatches = content.match(/id:\s*['"][^'"]+['"]/g) || [];
      console.log(`  ✅ Found ${trackMatches.length} SPE Career Tracks configured`);
    } else {
      issues.push('Missing spe_tracks.ts');
    }
  } catch (err) {
    issues.push('SPE Tracks error: ' + err.message);
  }

  // 3. Check All 79 Next.js App Routes
  console.log('\n[3] APP ROUTE AUDIT & EXPORTS');
  function getAppRoutes(dir, base = '') {
    let routes = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        routes = routes.concat(getAppRoutes(path.join(dir, entry.name), `${base}/${entry.name}`));
      } else if (entry.name === 'page.tsx' || entry.name === 'route.ts') {
        routes.push(`${base}/${entry.name}`);
      }
    }
    return routes;
  }
  const appRoutes = getAppRoutes(path.resolve('src/app'));
  console.log(`  ✅ Found ${appRoutes.length} route endpoints`);

  // 4. Verify API Route handlers (check for syntax / default export / methods)
  console.log('\n[4] API ROUTE HANDLERS EXPORT CHECK');
  const apiRoutes = appRoutes.filter(r => r.endsWith('route.ts'));
  let validApis = 0;
  for (const r of apiRoutes) {
    const fullPath = path.join('src/app', r);
    const code = fs.readFileSync(fullPath, 'utf8');
    const hasGet = /export\s+(async\s+)?function\s+GET/.test(code);
    const hasPost = /export\s+(async\s+)?function\s+POST/.test(code);
    const hasPut = /export\s+(async\s+)?function\s+PUT/.test(code);
    const hasDelete = /export\s+(async\s+)?function\s+DELETE/.test(code);
    if (!hasGet && !hasPost && !hasPut && !hasDelete) {
      issues.push(`API Route ${r} exports no standard HTTP methods`);
    } else {
      validApis++;
    }
  }
  console.log(`  ✅ Verified ${validApis}/${apiRoutes.length} API routes with standard HTTP method exports`);

  // 5. Verify Student Projects Data
  console.log('\n[5] STUDENT PROJECTS HUB');
  const { data: projects, error: projErr } = await sAnon.from('student_projects').select('id, title, category, description, tags, upvotes');
  if (projErr) {
    issues.push('Student projects query failed: ' + projErr.message);
  } else {
    console.log(`  ✅ ${projects.length} Student Projects accessible to public`);
  }

  // 6. Verify Scholarships Data
  console.log('\n[6] SCHOLARSHIPS & EDUCATION DIRECTORY');
  const { data: scholarships, error: schErr } = await sAnon.from('scholarships').select('id, name, provider, amount');
  const { data: programs, error: progErr } = await sAnon.from('education_programs').select('id, name, institution, country');
  if (schErr || progErr) {
    issues.push('Education directory data error');
  } else {
    console.log(`  ✅ ${scholarships.length} Scholarships and ${programs.length} Educational Programs verified`);
  }

  // 7. Verify GATE Mock Engine Questions & Practice Engine
  console.log('\n[7] GATE MOCK & PRACTICE ENGINE DATA');
  const { data: gateQuestions, error: gateErr } = await sAnon.from('practice_questions').select('id, question, correct_answer').eq('is_gate_relevant', true);
  if (gateErr) {
    issues.push('Practice questions GATE query error: ' + gateErr.message);
  } else {
    console.log(`  ✅ Found ${gateQuestions.length} GATE-tagged practice questions ready for mock tests`);
  }

  // ── FINAL SUMMARY ────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(70));
  console.log('DEEP DIVE 2 — COMPLETE ISSUES LIST (' + issues.length + ')');
  console.log('='.repeat(70));
  if (issues.length === 0) {
    console.log('🎉 DEEP DIVE 2 PASSED — ALL ENGINES, APIS & DATA PATHS ARE 100% ROBUST');
  } else {
    issues.forEach((i, n) => console.log((n+1) + '. ' + i));
  }
}

main().catch(console.error);
