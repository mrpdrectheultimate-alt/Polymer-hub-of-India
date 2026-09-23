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

  // Target inline math ($...$) and display math ($$...$$) blocks
  // Pre-process math blocks to double-escape single backslashes so ReactMarkdown preserves single backslashes for KaTeX
  str = str.replace(/(\$\$[\s\S]*?\$\$|\$[^\$\n]+\$)/g, (mathBlock) => {
    return mathBlock
      .replace(/\\/g, '\\\\')
      .replace(/\\\\\\\\/g, '\\\\')
  })

  return str
}

async function debug() {
  const { data } = await supabase.from('lessons').select('slug, title, content').eq('slug', 'polymer-solution-thermodynamics-flory-huggins-theory').single()
  
  const sec3Idx = data.content.indexOf('## 3.')
  const sec4Idx = data.content.indexOf('## 4.')
  const rawSec3 = data.content.slice(sec3Idx, sec4Idx)

  console.log('--- 1. RAW DB STRING ---')
  console.log(JSON.stringify(rawSec3))

  const sanitized = sanitizeLatex(rawSec3)
  console.log('--- 2. AFTER SANITIZATION ---')
  console.log(JSON.stringify(sanitized))
}

debug()
