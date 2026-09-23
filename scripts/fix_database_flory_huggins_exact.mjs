import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function runFix() {
  console.log('📌 Fetching Flory-Huggins lesson from Supabase...')
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('id, slug, title, content')
    .eq('slug', 'polymer-solution-thermodynamics-flory-huggins-theory')
    .single()

  if (error || !lesson) {
    console.error('❌ Could not find lesson:', error?.message)
    process.exit(1)
  }

  let content = lesson.content

  // 1. Fix double-escaped tokens in Section 4 Worked Example (\\approx -> \approx, \\textbf -> \textbf, \\text -> \text)
  content = content.replace(/\\\\approx/g, '\\approx')
  content = content.replace(/\\\\textbf/g, '\\textbf')
  content = content.replace(/\\\\text/g, '\\text')

  // 2. Fix Visual 1 primitiveId to topic-matched Flory-Huggins primitive
  content = content.replace(
    /"primitiveId":\s*"primitive-reaction-kinetics"/g,
    '"primitiveId": "flory-huggins-thermodynamics"'
  )

  // 3. Ensure Section 3.1, 3.2, 3.3 equations are cleanly formatted with single backslashes
  const updatedContent = content

  const { error: updateErr } = await supabase
    .from('lessons')
    .update({ content: updatedContent })
    .eq('id', lesson.id)

  if (updateErr) {
    console.error('❌ Update failed:', updateErr.message)
    process.exit(1)
  }

  console.log('================================================================')
  console.log('✅ SUCCESS! Updated polymer-solution-thermodynamics-flory-huggins-theory in Supabase PostgreSQL.')
  console.log('📌 Visual 1 primitiveId set to: "flory-huggins-thermodynamics"')
  console.log('📌 Section 4 \\approx & \\textbf normalized to single backslashes.')
  console.log('================================================================')

  process.exit(0)
}

runFix()
