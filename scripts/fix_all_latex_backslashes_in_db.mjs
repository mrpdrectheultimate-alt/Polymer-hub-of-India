// scripts/fix_all_latex_backslashes_in_db.mjs
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

export function repairLatexText(text) {
  if (!text) return ''

  // Clean form feeds (\x0C) and control characters first
  let cleaned = text
    .replace(/\x0C/g, '')
    .replace(/\x08/g, '')
    .replace(/\x09/g, ' ')
    .replace(/\x0B/g, '')

  // Fix repetitive form-feed / backslash corruption sequences
  cleaned = cleaned
    .replace(/(\\+f)*\\*rac\{/gi, '\\frac{')
    .replace(/(?<!\\)frac\{/gi, '\\frac{')
    .replace(/(\\+b)*\\*ar\{/gi, '\\bar{')
    .replace(/(?<!\\)bar\{/gi, '\\bar{')
    .replace(/(\\+[a-z])*\\*int_/gi, '\\int_')
    .replace(/(?<!\\)int_/gi, '\\int_')
    .replace(/(\\+[a-z])*\\*dot\{/gi, '\\dot{')
    .replace(/(?<!\\)dot\{/gi, '\\dot{')
    .replace(/(\\+[a-z])*\\*cdot/gi, '\\cdot')
    .replace(/(?<!\\)cdot/gi, '\\cdot')
    .replace(/(\\+[a-z])*\\*infty/gi, '\\infty')
    .replace(/(?<!\\)infty/gi, '\\infty')

  return cleaned
}

async function run() {
  console.log('🔧 Executing Precision Database LaTeX Backslash Repair across 216 lessons...')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, slug, title, content')

  if (error) {
    console.error('❌ Error fetching lessons:', error)
    return
  }

  let repairedCount = 0
  let totalFixes = 0

  for (const lesson of lessons) {
    const originalContent = lesson.content || ''
    const repairedContent = repairLatexText(originalContent)

    if (originalContent !== repairedContent) {
      const { error: updateErr } = await supabase
        .from('lessons')
        .update({ content: repairedContent })
        .eq('id', lesson.id)

      if (updateErr) {
        console.error(`❌ Failed to update ${lesson.slug}:`, updateErr)
      } else {
        repairedCount++
        console.log(`  ✓ Repaired LaTeX backslashes in "${lesson.title}" (${lesson.slug})`)
      }
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ PRECISION LATEX REPAIR COMPLETED:`)
  console.log(`   • Repaired Lessons: ${repairedCount} / ${lessons.length}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

run()
