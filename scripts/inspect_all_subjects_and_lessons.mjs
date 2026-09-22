import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function run() {
  const { data: subjects, error } = await supabase.from('subjects').select('id, name, slug').order('name')
  if (error) { console.error(error); return }
  
  console.log(`Total Subjects in DB: ${subjects.length}\n`)
  let totalLessons = 0

  for (const s of subjects) {
    const { data: lessons, count } = await supabase
      .from('lessons')
      .select('id, title, slug, order_index, content', { count: 'exact' })
      .eq('subject_id', s.id)
      .order('order_index')

    const lessonCount = count || 0
    totalLessons += lessonCount
    
    let totalWords = 0
    let mathEquationCount = 0
    if (lessons) {
      for (const l of lessons) {
        const words = (l.content || '').split(/\s+/).filter(Boolean).length
        totalWords += words
        const mathMatches = (l.content || '').match(/\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+\$/g)
        mathEquationCount += mathMatches ? mathMatches.length : 0
      }
    }

    console.log(`📚 Subject: ${s.name} (${s.slug})`)
    console.log(`   Lessons: ${lessonCount} | Total Words: ${totalWords.toLocaleString()} | Total Formulas/Equations: ${mathEquationCount}`)
    if (lessons && lessons.length > 0) {
      lessons.forEach((l, idx) => {
        const w = (l.content || '').split(/\s+/).filter(Boolean).length
        console.log(`     Lesson ${(idx + 1).toString().padStart(2, '0')}: "${l.title}" (${w} words)`)
      })
    }
    console.log('')
  }

  console.log(`=========================================`)
  console.log(`GRAND TOTAL: ${subjects.length} Subjects | ${totalLessons} Lessons`)
  console.log(`=========================================`)
}

run()
