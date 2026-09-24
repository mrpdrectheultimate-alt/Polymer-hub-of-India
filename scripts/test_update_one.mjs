import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)


async function testOne() {
  const { data: l, error: fetchErr } = await supabase
    .from('lessons')
    .select('id, slug, title, content')
    .eq('slug', 'hot-runner-valve-gating-mechanics-and-sequential-injection')
    .single()

  if (fetchErr) {
    console.error('Fetch error:', fetchErr)
    return
  }

  let content = l.content
  const imageTag = `\n\n![Technical Schematic: ${l.title}](/images/lessons/${l.slug}-diagram.svg)\n\n`

  // Insert right after ## 3. Core Theory
  const targetStr = '## 3. Core Theory'
  const idx = content.indexOf(targetStr)
  if (idx !== -1) {
    const insertPos = idx + targetStr.length
    content = content.slice(0, insertPos) + imageTag + content.slice(insertPos)
  } else {
    content = imageTag + content
  }

  console.log('Sending update to Supabase for ID:', l.id)
  const { data: updateRes, error: updateErr } = await supabase
    .from('lessons')
    .update({ content })
    .eq('id', l.id)
    .select()

  console.log('Update Error:', updateErr)
  console.log('Update Result count:', updateRes ? updateRes.length : 0)
}

testOne()
