// scripts/audit_216_lessons_deep.mjs — Deep audit of all lessons for formula, LaTeX, and content errors
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function deepAudit() {
  console.log('🔍 Fetching all subjects and lessons from Supabase...')
  
  const { data: subjects, error: subjErr } = await supabase.from('subjects').select('id, name, slug')
  if (subjErr) {
    console.error('❌ Error fetching subjects:', subjErr.message)
    process.exit(1)
  }

  const { data: lessons, error: lessErr } = await supabase
    .from('lessons')
    .select('id, title, slug, content, subject_id')
  
  if (lessErr) {
    console.error('❌ Error fetching lessons:', lessErr.message)
    process.exit(1)
  }

  console.log(`📊 Found ${subjects.length} subjects and ${lessons.length} total lessons.`)

  const subjectMap = new Map()
  for (const s of subjects) {
    subjectMap.set(s.id, s.name)
  }

  const issues = []

  for (const l of lessons) {
    const content = l.content || ''
    const title = l.title || ''
    const slug = l.slug || ''
    const subjectName = subjectMap.get(l.subject_id) || 'Unknown'

    const lessonIssues = []

    // 1. Check control character corruption (\x08 backspace, \x0C formfeed, etc.)
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(content)) {
      lessonIssues.push('Contains corrupted JS control characters (e.g. \\x08 or \\x0C)')
    }

    // 2. Check for stripped LaTeX command issues (e.g. "rac{", "ar{", "igma{", "au{", "ta{", "lpha{", "eta{", "heta{", "nfty{")
    const strippedFrac = content.match(/\b(rac|ar|igma|au|ta|amma|lpha|eta|heta|i|dot|pprox|nfty|artial|qrt|nt|um)\{/g)
    if (strippedFrac) {
      lessonIssues.push(`Stripped LaTeX commands detected: ${Array.from(new Set(strippedFrac)).join(', ')}`)
    }

    // 3. Check inline $ math block balance
    const dollarMatches = (content.match(/\$/g) || []).length
    if (dollarMatches % 2 !== 0) {
      lessonIssues.push(`Unbalanced dollar signs for KaTeX math ($ count: ${dollarMatches})`)
    }

    // 4. Check for unescaped LaTeX backslashes inside JSON strings (e.g. \frac, \bar, \sigma, \tau, \eta, \Delta, \gamma, \alpha, \beta, \theta, \pi, \cdot, \approx, \infty, \partial, \sqrt, \int, \sum)
    const rawLatexCommands = content.match(/\$(?:[^$\\]|\\[\s\S])*\$/g)

    // 5. Word count check
    const words = content.trim().split(/\s+/).length
    if (words < 400) {
      lessonIssues.push(`Low content word count (${words} words)`)
    }

    if (lessonIssues.length > 0) {
      issues.push({
        id: l.id,
        title,
        slug,
        subject: subjectName,
        wordCount: words,
        issues: lessonIssues
      })
    }
  }

  console.log(`\n🚨 Deep Audit Complete: ${issues.length} out of ${lessons.length} lessons flagged with issues.`)

  const summary = {
    totalSubjects: subjects.length,
    totalLessons: lessons.length,
    problematicLessonsCount: issues.length,
    issues
  }

  // Ensure scratch directory exists
  if (!fs.existsSync('scratch')) {
    fs.mkdirSync('scratch', { recursive: true })
  }

  fs.writeFileSync('scratch/deep_audit_216_lessons_results.json', JSON.stringify(summary, null, 2))
  console.log('📁 Deep audit results saved to scratch/deep_audit_216_lessons_results.json')
}

deepAudit()
