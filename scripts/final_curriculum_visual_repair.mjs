import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function executeFinalRepair() {
  console.log('🚀 Executing Final Zero-Defect Curriculum Repair across all 216 lessons...')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, slug, title, content')

  if (error) {
    console.error('Error fetching lessons:', error)
    return
  }

  console.log(`Fetched ${lessons.length} lessons. Running final database canonicalization...`)
  let updatedCount = 0

  for (const l of lessons) {
    let content = l.content || ''
    const originalContent = content

    // 1. Strip legacy visual JSON dumps from end of content
    const jsonDumpIdx = content.indexOf('### 🖼️ Visual 1:')
    if (jsonDumpIdx !== -1) {
      content = content.substring(0, jsonDumpIdx).trim()
    }

    // 2. Strip any duplicate image tags to ensure clean single placement
    content = content.replace(/\n*!\[Technical Schematic[^\]]*\]\([^)]+\)\n*/gi, '\n\n').trim()

    // 3. Fix math equation \textbf -> \mathbf inside $$...$$ and $...$
    content = content.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+\$)/g, (mathBlock) => {
      let clean = mathBlock.replace(/\\{2,}/g, '\\')
      clean = clean.replace(/\\textbf\{([^}]+)\}/g, '\\mathbf{$1}')
      return clean
    })

    // 4. Ensure HTML div tags for problem statements and solution steps wrap cleanly
    content = content
      .replace(/<div\s+class(?:Name)?=["']problem-statement["']>\s*/gi, '<div className="problem-statement">\n\n')
      .replace(/<div\s+class(?:Name)?=["']solution-step["']>\s*/gi, '<div className="solution-step">\n\n')

    // 5. Insert 1 Primary SVG Diagram Tag directly under Section 3 (Core Theory)
    const imagePath = `/images/lessons/${l.slug}-diagram.svg`
    const markdownImage = `\n\n![Technical Schematic & Mechanism Blueprint: ${l.title}](${imagePath})\n\n`

    let sec3Match = content.match(/##\s*3\.\s*[^#\n]+/i) || content.match(/##\s*Core Theory/i)
    if (!sec3Match) {
      sec3Match = content.match(/##\s*2\.\s*[^#\n]+/i)
    }

    if (sec3Match) {
      const insertPos = content.indexOf(sec3Match[0]) + sec3Match[0].length
      content = content.slice(0, insertPos) + markdownImage + content.slice(insertPos)
    } else {
      content = markdownImage + content
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

  console.log(`\n🎉 Success! Final Zero-Defect Repair completed for ${updatedCount}/${lessons.length} lessons in Supabase PostgreSQL!`)
}

executeFinalRepair()
