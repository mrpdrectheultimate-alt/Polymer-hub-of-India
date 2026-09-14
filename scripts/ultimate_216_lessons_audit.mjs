// scripts/ultimate_216_lessons_audit.mjs — Comprehensive 360-Degree Deep-Dive Audit of all 216 Lessons & Curriculum Health
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function ultimateAudit() {
  console.log('🔍 Starting Ultimate 360-Degree Deep-Dive Audit across all 216 Lessons...\n')

  // 1. Fetch Subjects
  const { data: subjects, error: subjErr } = await supabase.from('subjects').select('id, name, slug')
  if (subjErr) {
    console.error('❌ Error fetching subjects:', subjErr.message)
    process.exit(1)
  }

  // 2. Fetch Lessons
  const { data: lessons, error: lessErr } = await supabase.from('lessons').select('id, title, slug, content, subject_id')
  if (lessErr) {
    console.error('❌ Error fetching lessons:', lessErr.message)
    process.exit(1)
  }

  // 3. Fetch Practice Questions / Quizzes
  const { data: practiceQuestions, error: pqErr } = await supabase.from('practice_questions').select('id, lesson_slug, question, options, correct_answer')
  
  console.log(`📊 Scope: ${subjects.length} Subjects | ${lessons.length} Lessons | ${practiceQuestions ? practiceQuestions.length : 0} Practice Questions\n`)

  const subjectMap = new Map()
  for (const s of subjects) subjectMap.set(s.id, s.name)

  const pqMap = new Map()
  if (practiceQuestions) {
    for (const pq of practiceQuestions) {
      if (!pqMap.has(pq.lesson_slug)) pqMap.set(pq.lesson_slug, [])
      pqMap.get(pq.lesson_slug).push(pq)
    }
  }

  let totalMathBlocks = 0
  let totalWords = 0
  let lessonsWithMissingQuestions = 0
  let lessonsWithShortContent = 0
  let corruptedLatexCount = 0

  const subjectStats = {}
  for (const s of subjects) {
    subjectStats[s.name] = { count: 0, totalWords: 0, minWords: Infinity, maxWords: 0 }
  }

  for (const l of lessons) {
    const content = l.content || ''
    const title = l.title || ''
    const slug = l.slug || ''
    const subjName = subjectMap.get(l.subject_id) || 'Unassigned'
    const words = content.trim().split(/\s+/).length

    totalWords += words

    // Subject stats
    if (subjectStats[subjName]) {
      subjectStats[subjName].count++
      subjectStats[subjName].totalWords += words
      if (words < subjectStats[subjName].minWords) subjectStats[subjName].minWords = words
      if (words > subjectStats[subjName].maxWords) subjectStats[subjName].maxWords = words
    }

    // Check KaTeX math blocks
    const inlineMath = (content.match(/\$[^$\n]+\$/g) || []).length
    const blockMath = (content.match(/\$\$[\s\S]*?\$\$/g) || []).length
    totalMathBlocks += inlineMath + blockMath

    // Check for broken stripped LaTeX tokens
    if (/\b(rac|ar|igma|au|ta|lpha|eta|heta|nfty|qrt|artial|nt|um)\{/g.test(content)) {
      corruptedLatexCount++
    }

    // Check for short content (< 500 words)
    if (words < 500) {
      lessonsWithShortContent++
    }

    // Check Question linkage
    const lessonPQs = pqMap.get(l.slug) || []
    if (lessonPQs.length === 0) {
      lessonsWithMissingQuestions++
    }
  }

  const avgWords = Math.round(totalWords / lessons.length)

  console.log('=================== ULTIMATE AUDIT METRICS ===================')
  console.log(`Total Curriculum Content Volume : ${totalWords.toLocaleString()} words`)
  console.log(`Average Word Count per Lesson   : ${avgWords} words/lesson`)
  console.log(`Total Mathematical Equations    : ${totalMathBlocks.toLocaleString()} formulas ($ & $$)`)
  console.log(`Corrupted / Stripped LaTeX      : ${corruptedLatexCount}`)
  console.log(`Lessons Below 500 Words         : ${lessonsWithShortContent}`)
  console.log(`Lessons Missing Quiz Questions  : ${lessonsWithMissingQuestions}`)
  console.log('==============================================================\n')

  console.log('--- SUBJECT LEVEL BREAKDOWN ---')
  for (const [sName, stats] of Object.entries(subjectStats)) {
    const avg = stats.count > 0 ? Math.round(stats.totalWords / stats.count) : 0
    console.log(`• ${sName.padEnd(42)}: ${stats.count.toString().padStart(2)} lessons | Avg: ${avg.toString().padStart(4)}w | Range: [${stats.minWords}w - ${stats.maxWords}w]`)
  }
}

ultimateAudit()
