import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function scanVisuals() {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, slug, title, content, subject_id, subjects(name, slug)')

  if (error) {
    console.error('Error fetching lessons:', error)
    return
  }

  console.log(`Total lessons fetched: ${lessons.length}`)

  let withImages = 0
  let withTables = 0
  let withVisualBlocks = 0
  let noVisualsAtAll = 0

  const subjectStats = {}
  const lessonsNeedingVisuals = []

  for (const l of lessons) {
    const content = l.content || ''
    const subjectName = l.subjects?.name || 'Unknown'

    if (!subjectStats[subjectName]) {
      subjectStats[subjectName] = { total: 0, images: 0, tables: 0, blocks: 0, none: 0 }
    }
    subjectStats[subjectName].total++

    const hasImage = /!\[.*?\]\(.*?\)|<img[^>]+>/i.test(content)
    const hasTable = /\|[^\n]+\|\n\|[-:\s|]+\|/i.test(content)
    const hasVisualBlock = /```(visual|industrial|process|graph|mechanism|diagram|primitive)[-\w]*/i.test(content)

    if (hasImage) {
      withImages++
      subjectStats[subjectName].images++
    }
    if (hasTable) {
      withTables++
      subjectStats[subjectName].tables++
    }
    if (hasVisualBlock) {
      withVisualBlocks++
      subjectStats[subjectName].blocks++
    }

    if (!hasImage && !hasVisualBlock) {
      noVisualsAtAll++
      subjectStats[subjectName].none++
      lessonsNeedingVisuals.push({
        slug: l.slug,
        title: l.title,
        subject: subjectName,
        hasTable
      })
    }
  }

  console.log('\n--- VISUAL INVENTORY SCAN RESULTS ---')
  console.log(`Lessons with Markdown Images (![alt](url)): ${withImages} / ${lessons.length}`)
  console.log(`Lessons with Markdown Tables (|---|): ${withTables} / ${lessons.length}`)
  console.log(`Lessons with Interactive/Visual Code Blocks: ${withVisualBlocks} / ${lessons.length}`)
  console.log(`Lessons WITHOUT any Images or Visual Blocks: ${noVisualsAtAll} / ${lessons.length}`)


  console.log('\n--- BY SUBJECT BREAKDOWN ---')
  console.table(subjectStats)

  console.log('\n--- SAMPLE LESSONS NEEDING VISUALS ---')
  console.log(lessonsNeedingVisuals.slice(0, 15))
}

scanVisuals()
