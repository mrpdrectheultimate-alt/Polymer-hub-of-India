import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


async function repositionVisuals() {
  console.log('🚀 Repositioning ALL Visual Diagrams & Schematics directly inside lesson reading sections (Sections 3, 4, 5)...')

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
    const originalContent = content

    // Extract Visual 1 (mechanism), Visual 2 (photograph), Visual 3 (process-flow), Visual 4 (industrial-blueprint)
    const visualBlocks = []
    const visualRegex = /```(visual-mechanism|industrial-photograph|process-flow|industrial-blueprint)[\s\S]*?```/g
    let match
    while ((match = visualRegex.exec(content)) !== null) {
      visualBlocks.push(match[0])
    }

    // Strip trailing visual dumps from the end of content
    content = content.replace(/###\s*[🖼️📸🔄📐]\s*Visual\s*\d+:[\s\S]*$/gi, '').trim()
    content = content.replace(/\n*!\[Technical Schematic[^\]]*\]\([^)]+\)\n*/gi, '\n\n').trim()

    // SVG Diagram Image Tag
    const imagePath = `/images/lessons/${l.slug}-diagram.svg`
    const svgFigureTag = `\n\n![Technical Schematic & Mechanism Blueprint: ${l.title}](${imagePath})\n\n`

    // Insertion 1: Insert SVG Diagram Tag & Visual 1 (Mechanism) into Section 3 (Core Theory)
    const sec3Match = content.match(/##\s*3\.\s*[^#\n]+/i) || content.match(/##\s*Core Theory/i)
    if (sec3Match) {
      const idx = content.indexOf(sec3Match[0]) + sec3Match[0].length
      let insertionContent = svgFigureTag
      const mechanismBlock = visualBlocks.find(b => b.includes('visual-mechanism'))
      if (mechanismBlock) {
        insertionContent += `\n\n${mechanismBlock}\n\n`
      }
      content = content.slice(0, idx) + insertionContent + content.slice(idx)
    } else {
      content = svgFigureTag + content
    }

    // Insertion 2: Insert Visual 3 (Process Flow PFD) or Visual 2 into Section 4 (Worked Example)
    const pfdBlock = visualBlocks.find(b => b.includes('process-flow'))
    if (pfdBlock) {
      const sec4Match = content.match(/##\s*4\.\s*[^#\n]+/i) || content.match(/##\s*Worked Example/i)
      if (sec4Match) {
        const idx = content.indexOf(sec4Match[0]) + sec4Match[0].length
        content = content.slice(0, idx) + `\n\n${pfdBlock}\n\n` + content.slice(idx)
      }
    }

    // Insertion 3: Insert Visual 4 (CAD Blueprint) into Section 5 (Industry Context)
    const blueprintBlock = visualBlocks.find(b => b.includes('industrial-blueprint'))
    if (blueprintBlock) {
      const sec5Match = content.match(/##\s*5\.\s*[^#\n]+/i) || content.match(/##\s*Indian Industry Context/i)
      if (sec5Match) {
        const idx = content.indexOf(sec5Match[0]) + sec5Match[0].length
        content = content.slice(0, idx) + `\n\n${blueprintBlock}\n\n` + content.slice(idx)
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

  console.log(`\n🎉 Success! Repositioned Visual Schematics inside reading flow for ${updatedCount}/${lessons.length} lessons in Supabase!`)
}

repositionVisuals()
