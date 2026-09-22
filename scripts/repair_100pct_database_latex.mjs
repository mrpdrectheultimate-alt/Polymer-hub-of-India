// scripts/repair_100pct_database_latex.mjs — Double-escape single backslash LaTeX math blocks across all 216 lessons in Supabase
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
    .replace(/\x0B/g, '\\v')

  // Target math blocks ($...$ and $$...$$) and ensure all LaTeX commands have double backslashes
  str = str.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+\$)/g, (mathBlock) => {
    return mathBlock
      .replace(/\\/g, '\\\\')
      .replace(/\\\\\\\\/g, '\\\\')
  })

  return str
}

async function runDatabaseRepair() {
  console.log('📌 Fetching all lessons from Supabase for 100% LaTeX double-escape repair...')
  const { data: lessons, error: fetchErr } = await supabase
    .from('lessons')
    .select('id, slug, title, content')

  if (fetchErr) {
    console.error('❌ Error fetching lessons:', fetchErr.message)
    process.exit(1)
  }

  console.log(`✅ Loaded ${lessons.length} lessons. Processing LaTeX repairs...`)

  let repairedCount = 0

  for (let i = 0; i < lessons.length; i++) {
    const lesson = lessons[i]
    if (!lesson.content) continue

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
        if (repairedCount % 20 === 0 || i === lessons.length - 1) {
          console.log(`[${i + 1}/${lessons.length}] Repaired ${repairedCount} lessons so far...`)
        }
      }
    }
  }

  console.log(`🎉 100% COMPLETE! Repaired and updated ${repairedCount} lessons in Supabase!`)
}

runDatabaseRepair()
