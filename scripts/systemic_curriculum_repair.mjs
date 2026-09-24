import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function repairCurriculum() {
  console.log('🚀 Starting Systemic Curriculum Repair across all 216 lessons...')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, slug, title, content')

  if (error) {
    console.error('❌ Failed to fetch lessons:', error)
    return
  }

  console.log(`Loaded ${lessons.length} lessons from Supabase. Processing...`)
  let updatedCount = 0

  for (const lesson of lessons) {
    let content = lesson.content || ''
    const originalContent = content

    // 1. Collapse double backslashes in math blocks (\\approx, \\frac, \\Delta, \\textbf) -> (\approx, \frac, \Delta, \textbf)
    content = content.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+\$)/g, (mathBlock) => {
      return mathBlock.replace(/\\{2,}/g, '\\')
    })

    // 2. Fix problem statement and solution step HTML div formatting
    // Convert <div class="..."> -> <div className="...">
    content = content.replace(/<div\s+class=["']([^"']+)["']/gi, '<div className="$1"')

    // 3. Remove stray or double unclosed </div> tags around worked examples
    content = content.replace(/(<\/div>\s*){2,}/gi, '</div>\n\n')

    // 4. Ensure problem statement divs wrap cleanly
    // If <div className="problem-statement"> is immediately closed before Solution:, extend/fix wrapping
    if (content.includes('problem-statement') || content.includes('solution-step')) {
      // Normalize space around div tags
      content = content
        .replace(/<div\s+className=["']problem-statement["']>\s*/gi, '<div className="problem-statement">\n\n')
        .replace(/<div\s+className=["']solution-step["']>\s*/gi, '<div className="solution-step">\n\n')
    }

    if (content !== originalContent) {
      const { error: updateErr } = await supabase
        .from('lessons')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', lesson.id)

      if (updateErr) {
        console.error(`❌ Error updating lesson ${lesson.slug}:`, updateErr)
      } else {
        updatedCount++
      }
    }
  }

  console.log(`\n✅ Systemic Repair Complete! Updated ${updatedCount}/${lessons.length} lessons in Supabase PostgreSQL.`)
}

repairCurriculum()
