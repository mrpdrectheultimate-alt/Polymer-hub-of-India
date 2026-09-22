// scripts/verify_target_lessons.mjs — Verify exact rendering payloads for the 4 critical lessons
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function verifyTargets() {
  console.log('🔍 Fetching the exact equation payloads for target lesson:\n')

  const { data: l, error } = await supabase
    .from('lessons')
    .select('title, slug, content')
    .eq('slug', 'non-newtonian-rheology-power-law-and-carreau-models')
    .single()

  if (error || !l) {
    console.error(`❌ Failed:`, error?.message)
    return
  }

  console.log(`📌 Lesson: "${l.title}"`)
  const blocks = l.content.split('$$').filter((_, i) => i % 2 === 1)
  blocks.forEach((b, idx) => {
    console.log(`\n--- Equation Block [${idx + 1}] ---`)
    console.log(b.trim())
  })
}

verifyTargets()
