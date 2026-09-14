// scripts/audit_quizzes.mjs — Audit quizzes and quiz_questions in Supabase
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function auditQuizzes() {
  const { data: lessons } = await supabase.from('lessons').select('id, title, slug')
  const { data: quizzes } = await supabase.from('quizzes').select('id, lesson_id, title')
  const { data: questions } = await supabase.from('quiz_questions').select('id, quiz_id, question_text')

  console.log(`📊 Quiz System Scope:`)
  console.log(`- Lessons: ${lessons ? lessons.length : 0}`)
  console.log(`- Quizzes: ${quizzes ? quizzes.length : 0}`)
  console.log(`- Questions: ${questions ? questions.length : 0}`)

  const quizLessonMap = new Set((quizzes || []).map(q => q.lesson_id))
  let missingQuizzes = 0

  if (lessons) {
    for (const l of lessons) {
      if (!quizLessonMap.has(l.id)) {
        missingQuizzes++
      }
    }
  }

  console.log(`- Lessons with active Quiz: ${quizLessonMap.size}`)
  console.log(`- Lessons missing Quiz: ${missingQuizzes}`)
}

auditQuizzes()
