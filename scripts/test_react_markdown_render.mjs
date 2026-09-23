import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, serviceRoleKey)

export function sanitizeLatex(text) {
  if (!text) return ''

  let str = text
    .replace(/\x0C/g, '\\f')
    .replace(/\x0D/g, '\\r')
    .replace(/\x08/g, '\\b')
    .replace(/\x09/g, '\\t')
    .replace(/\x0B/g, '\\v')

  // Auto-wrap bare Flory-Huggins, thermodynamics, or un-delimited math expressions
  str = str.replace(/(\bDelta\s*G_?m?\s*=\s*RT[\s\S]*?\\?right\]|\b\Delta\s*G_?m?\s*=\s*RT[\s\S]*?\))/gi, (match) => {
    if (match.startsWith('$')) return match
    return `$$\n${match}\n$$`
  })

  // Normalize stripped LaTeX tokens (e.g. frac -> \frac, left -> \left, right -> \right) if inside unformatted math strings
  str = str.replace(/DeltaG_m/g, '\\Delta G_m')
  str = str.replace(/DeltaP/g, '\\Delta P')

  // Target inline math ($...$) and display math ($$...$$) blocks
  // Pre-process math blocks to double-escape single backslashes so ReactMarkdown preserves single backslashes for KaTeX
  str = str.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+\$)/g, (mathBlock) => {
    return mathBlock
      .replace(/\\/g, '\\\\')
      .replace(/\\\\\\\\/g, '\\\\')
  })

  return str
}

async function runTest() {
  const { data: lesson } = await supabase
    .from('lessons')
    .select('content')
    .eq('slug', 'polymer-solution-thermodynamics-flory-huggins-theory')
    .single()

  console.log('=== 1. RAW DB CONTENT SNIPPET ===')
  const rawContent = lesson.content
  const mathBlockIdx = rawContent.indexOf('Delta G_m')
  console.log(rawContent.slice(mathBlockIdx - 30, mathBlockIdx + 200))

  console.log('\n=== 2. SANITIZED CONTENT SNIPPET ===')
  const sanitized = sanitizeLatex(rawContent)
  const mathBlockIdx2 = sanitized.indexOf('Delta G_m')
  console.log(sanitized.slice(mathBlockIdx2 - 30, mathBlockIdx2 + 200))

  process.exit(0)
}

runTest()
