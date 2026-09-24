import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function injectVisualsIntoTheory() {
  console.log('🚀 Injecting Visual Schematics directly INSIDE Core Theory (Section 3 & 4) across all 216 lessons...')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, slug, title, content')

  if (error) {
    console.error('Error fetching lessons:', error)
    return
  }

  console.log(`Fetched ${lessons.length} lessons. Running inline visual injection...`)
  let updatedCount = 0

  for (const l of lessons) {
    let content = l.content || ''
    const originalContent = content
    const imagePath = `/images/lessons/${l.slug}-diagram.svg`
    const primaryFigureTag = `\n\n![Technical Schematic & Mechanism Blueprint: ${l.title}](${imagePath})\n\n`

    // 1. Remove trailing legacy JSON visual dumps from the end of content
    content = content.replace(/###\s*[🖼️📸🔄📐]\s*Visual\s*\d+:[\s\S]*$/gi, '').trim()

    // 2. Ensure image tag is not duplicated
    content = content.replace(/!\[Technical Schematic[^\]]*\]\([^)]+\)/gi, '').trim()

    // 3. Inject primary figure tag directly inside Section 3 (Core Theory) right after 3.1 or 3.2
    const sec31Match = content.match(/###\s*3\.1\s*[^#\n]+/i) || content.match(/##\s*3\.\s*[^#\n]+/i) || content.match(/##\s*Core Theory/i)

    if (sec31Match) {
      const idx = content.indexOf(sec31Match[0]) + sec31Match[0].length
      // Find the end of the first paragraph after 3.1
      const nextDoubleNewline = content.indexOf('\n\n', idx)
      if (nextDoubleNewline !== -1) {
        content = content.slice(0, nextDoubleNewline) + primaryFigureTag + content.slice(nextDoubleNewline)
      } else {
        content = content.slice(0, idx) + primaryFigureTag + content.slice(idx)
      }
    } else {
      // Fallback: after Section 2 or at top of Section 1
      const sec2Match = content.match(/##\s*2\.\s*[^#\n]+/i)
      if (sec2Match) {
        const idx = content.indexOf(sec2Match[0]) + sec2Match[0].length
        content = content.slice(0, idx) + primaryFigureTag + content.slice(idx)
      } else {
        content = primaryFigureTag + content
      }
    }

    if (content !== originalContent) {
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

  console.log(`\n✅ 100% Inline Visual Placement Complete! Updated ${updatedCount}/${lessons.length} lessons in Supabase PostgreSQL.`)
}

injectVisualsIntoTheory()
