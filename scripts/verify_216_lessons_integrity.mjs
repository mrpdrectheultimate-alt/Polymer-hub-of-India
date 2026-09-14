// scripts/verify_216_lessons_integrity.mjs — Strict Quality Gate & Audit Verification for all 216 Lessons
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

async function verifyIntegrity() {
  console.log('🔍 Executing Strict Quality Gate Verification across all 216 Lessons...')

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

  const subjectMap = new Map()
  for (const s of subjects) {
    subjectMap.set(s.id, s.name)
  }

  let totalErrors = 0
  let totalWarnings = 0
  const failedLessons = []

  const strippedTokensRegex = /\b(rac|ar|igma|au|ta|lpha|eta|heta|nfty|qrt|artial|nt|um)\{/g

  for (const l of lessons) {
    const content = l.content || ''
    const title = l.title || ''
    const slug = l.slug || ''
    const subject = subjectMap.get(l.subject_id) || 'Unknown'
    const words = content.trim().split(/\s+/).length

    const errors = []
    const warnings = []

    // 1. Control character check
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(content)) {
      errors.push('CRITICAL: Contains corrupted ASCII control characters (e.g. \\x08 or \\x0C)')
    }

    // 2. Stripped LaTeX command tokens check
    const strippedMatches = content.match(strippedTokensRegex)
    if (strippedMatches) {
      const uniqueTokens = Array.from(new Set(strippedMatches))
      errors.push(`CRITICAL: Contains stripped LaTeX tokens: ${uniqueTokens.join(', ')}`)
    }

    // 3. Math delimiter balance check
    const dollarMatches = (content.match(/\$/g) || []).length
    if (dollarMatches % 2 !== 0) {
      errors.push(`CRITICAL: Unbalanced KaTeX dollar signs ($ count: ${dollarMatches})`)
    }

    // 4. Content depth check
    if (words < 500) {
      errors.push(`CRITICAL: Content word count below 500-word academic threshold (${words} words)`)
    }

    if (errors.length > 0) {
      totalErrors += errors.length
      failedLessons.push({ title, slug, subject, words, errors, warnings })
    }
  }

  console.log(`\n=================== VERIFICATION AUDIT SUMMARY ===================`)
  console.log(`Total Subjects Verified : ${subjects.length}`)
  console.log(`Total Lessons Verified  : ${lessons.length}`)
  console.log(`Total Critical Errors   : ${totalErrors}`)
  console.log(`Total Warnings          : ${totalWarnings}`)
  console.log(`==================================================================\n`)

  if (totalErrors > 0) {
    console.error(`❌ QUALITY GATE FAILED! ${failedLessons.length} lessons failed integrity check:`)
    failedLessons.forEach((f, idx) => {
      console.error(`\n[${idx + 1}] "${f.title}" (${f.slug}) [Subject: ${f.subject} | ${f.words} words]`)
      f.errors.forEach((e) => console.error(`    🚨 ${e}`))
    })
    console.error('\n🛑 Build stopped with process.exit(1)')
    process.exit(1)
  } else {
    console.log(`✅ QUALITY GATE PASSED! All ${lessons.length} lessons across ${subjects.length} subjects have ZERO broken LaTeX equations, ZERO control characters, and exceed 500 words academic depth!`)
  }
}

verifyIntegrity()
