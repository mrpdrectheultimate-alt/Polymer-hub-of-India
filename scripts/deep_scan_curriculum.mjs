import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function scanCurriculum() {
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, slug, title, content')

  if (error) {
    console.error('Error fetching lessons:', error)
    return
  }

  console.log('Total lessons fetched:', lessons.length)

  let divCount = 0
  let quizSectionCount = 0
  let codeBlockCount = 0
  const divClasses = new Set()
  const codeLangs = new Set()
  const problematicLessons = []

  for (const l of lessons) {
    const content = l.content || ''

    // Check divs
    const divRegex = /<div[^>]*class(?:Name)?=["']([^"']+)["']/gi
    let match
    let hasDiv = false
    while ((match = divRegex.exec(content)) !== null) {
      hasDiv = true
      divClasses.add(match[1])
    }
    if (hasDiv) divCount++

    // Check quiz headings
    const hasQuizSection = /##\s*\d*\.?\s*(Quiz|Self-Assessment|Practice Questions)/i.test(content)
    if (hasQuizSection) {
      quizSectionCount++
    }

    // Check code blocks
    const codeRegex = /```(\w[-\w]*)/g
    let codeMatch
    let hasCode = false
    while ((codeMatch = codeRegex.exec(content)) !== null) {
      hasCode = true
      codeLangs.add(codeMatch[1])
    }
    if (hasCode) codeBlockCount++

    if (hasDiv || hasQuizSection || hasCode) {
      problematicLessons.push({
        slug: l.slug,
        hasDiv,
        hasQuizSection,
        hasCode
      })
    }
  }

  console.log('\n--- SCAN RESULTS ---')
  console.log('Lessons with <div> tags:', divCount)
  console.log('Unique <div> class names found:', Array.from(divClasses))
  console.log('Lessons with inline Quiz text sections:', quizSectionCount)
  console.log('Lessons with ``` code blocks:', codeBlockCount)
  console.log('Unique code block languages found:', Array.from(codeLangs))
  console.log('Sample affected lessons:', problematicLessons.slice(0, 10))
}

scanCurriculum()
