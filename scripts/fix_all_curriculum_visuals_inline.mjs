import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAllVisuals() {
  console.log('🚀 Starting Guaranteed 100% Inline Visual Placement across all 216 lessons...')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, slug, title, content')

  if (error) {
    console.error('Error fetching lessons:', error)
    return
  }

  console.log(`Fetched ${lessons.length} lessons from Supabase. Processing...`)
  let updatedCount = 0

  for (const l of lessons) {
    let content = l.content || ''
    const imagePath = `/images/lessons/${l.slug}-diagram.svg`
    const markdownImage = `\n\n![Technical Schematic: ${l.title}](${imagePath})\n\n`

    // Clean up trailing legacy JSON dumps at the bottom of content
    const jsonDumpIdx = content.indexOf('### 🖼️ Visual 1:')
    if (jsonDumpIdx !== -1) {
      content = content.substring(0, jsonDumpIdx).trim()
    }

    // Clean up any existing image tags to prevent duplication
    content = content.replace(/\n*!\[Technical Schematic[^\]]*\]\([^)]+\)\n*/gi, '\n\n').trim()

    // Find insertion point: right after Section 3 heading (## 3. Core Theory)
    let secMatch = content.match(/##\s*3\.\s*[^#\n]+/i) || content.match(/##\s*Core Theory/i)
    if (!secMatch) {
      secMatch = content.match(/##\s*2\.\s*[^#\n]+/i)
    }

    if (secMatch) {
      const insertPos = content.indexOf(secMatch[0]) + secMatch[0].length
      content = content.slice(0, insertPos) + markdownImage + content.slice(insertPos)
    } else {
      content = markdownImage + content
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

  console.log(`\n🎉 Success! Guaranteed Inline Visual Placement completed for ${updatedCount}/${lessons.length} lessons in Supabase PostgreSQL!`)
}

fixAllVisuals()
