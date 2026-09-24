import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function embedVisuals() {
  console.log('🚀 Embedding Technical Diagrams across all 216 lessons in Supabase PostgreSQL...')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, slug, title, content')

  if (error) {
    console.error('Error fetching lessons:', error)
    return
  }

  console.log(`Processing ${lessons.length} lessons...`)
  let updatedCount = 0

  for (const l of lessons) {
    let content = l.content || ''
    const imagePath = `/images/lessons/${l.slug}-diagram.svg`
    const markdownImage = `\n\n![Technical Schematic: ${l.title}](${imagePath})\n\n`

    // Check if image link is already embedded
    if (!content.includes(imagePath)) {
      // Find insertion point: insert right after Section 3 heading (## 3. Core Theory or ## 3. Technical Theory)
      const section3Match = content.match(/##\s*3\.\s*[^#\n]+/i) || content.match(/##\s*Core Theory/i)

      if (section3Match) {
        const insertIdx = content.indexOf(section3Match[0]) + section3Match[0].length
        content = content.slice(0, insertIdx) + markdownImage + content.slice(insertIdx)
      } else {
        // Fallback insertion: after Section 2 or at 1/3 point of lesson
        const section2Match = content.match(/##\s*2\.\s*[^#\n]+/i)
        if (section2Match) {
          const insertIdx = content.indexOf(section2Match[0]) + section2Match[0].length
          content = content.slice(0, insertIdx) + markdownImage + content.slice(insertIdx)
        } else {
          content = markdownImage + content
        }
      }

      const { error: updateErr } = await supabase
        .from('lessons')
        .update({ content })
        .eq('id', l.id)


      if (updateErr) {
        console.error(`Error updating lesson ${l.slug}:`, updateErr)
      } else {
        updatedCount++
      }
    }
  }

  console.log(`\n✅ 100% Visual Embedding Complete! Updated ${updatedCount}/${lessons.length} lessons in Supabase PostgreSQL.`)
}

embedVisuals()
