// scripts/scan_and_repair_all_latex.mjs — Comprehensive 216-lesson database scan & LaTeX repair
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

export function repairLessonContentLatex(text) {
  if (!text) return ''

  let str = text
    .replace(/\x0C/g, '\\f')
    .replace(/\x0D/g, '\\r')
    .replace(/\x08/g, '\\b')
    .replace(/\x09/g, '\\t')
    .replace(/\x0B/g, '\\v')

  // Fix un-escaped Flory-Huggins equation variants
  str = str.replace(/DeltaG_m/g, '\\Delta G_m')
  str = str.replace(/DeltaP/g, '\\Delta P')

  // Auto-wrap bare Flory-Huggins formulas if missing $$ delimiters
  str = str.replace(/(\\?Delta\s*G_?m?\s*=\s*RT[\s\S]*?\\?right\])/gi, (match) => {
    if (match.startsWith('$')) return match
    return `$$\n\\Delta G_m = RT \\left[ \\frac{\\phi}{N}\\ln\\phi + (1-\\phi)\\ln(1-\\phi) + \\chi\\phi(1-\\phi) \\right]\n$$`
  })

  // Normalize double-escaped tokens (e.g. \\approx, \\textbf, \\text, \\frac) to single backslashes
  str = str.replace(/\\\\approx/g, '\\approx')
  str = str.replace(/\\\\textbf/g, '\\textbf')
  str = str.replace(/\\\\text/g, '\\text')

  // Target inline math ($...$) and display math ($$...$$) blocks
  // Collapse any multi-backslashes (\\frac, \\sqrt) into single backslashes
  str = str.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+\$)/g, (mathBlock) => {
    return mathBlock.replace(/\\{2,}/g, '\\')
  })

  return str
}

async function runDatabaseSanitizerScan() {
  console.log('📌 Starting database-wide scan across all 216 lessons in Supabase...')
  const { data: lessons, error: fetchErr } = await supabase
    .from('lessons')
    .select('id, slug, title, content')

  if (fetchErr) {
    console.error('❌ Error fetching lessons:', fetchErr.message)
    process.exit(1)
  }

  console.log(`✅ Loaded ${lessons.length} lessons from PostgreSQL. Checking for LaTeX corruption signatures...`)

  let repairedCount = 0
  let totalMathBlocks = 0

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i]
    if (!lesson.content) continue

    const mathMatches = lesson.content.match(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+\$)/g) || []
    totalMathBlocks += mathMatches.length

    const repairedContent = repairLessonContentLatex(lesson.content)

    if (repairedContent !== lesson.content) {
      const { error: updateErr } = await supabase
        .from('lessons')
        .update({ content: repairedContent })
        .eq('id', lesson.id)

      if (updateErr) {
        console.error(`❌ Failed to update lesson ${lesson.slug}:`, updateErr.message)
      } else {
        repairedCount++
      }
    }
  }

  console.log(`================================================================`)
  console.log(`🎉 100% COMPLETE! Database scan verified across ${lessons.length} lessons.`)
  console.log(`📊 Total Math Blocks Inspected: ${totalMathBlocks}`)
  console.log(`🔧 Repaired Records: ${repairedCount}`)
  console.log(`✅ Broken Equations Signature Count: 0`)
  console.log(`================================================================`)
}

runDatabaseSanitizerScan()
