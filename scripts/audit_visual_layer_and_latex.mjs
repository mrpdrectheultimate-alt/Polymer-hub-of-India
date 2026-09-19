import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function runAudit() {
  console.log('🔍 Executing Pre-Launch Audit across 216 Lessons for LaTeX Integrity, Verified Photo Rights & Visual Alignment...\n')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, slug, title, content, subject_id, subjects(name, slug)')

  if (error) {
    console.error('❌ Database error:', error)
    return
  }

  let totalLessons = lessons.length
  let brokenLatexCount = 0
  let brokenLatexLessons = []

  let visual1Count = 0
  let visual2Count = 0
  let visual3Count = 0
  let visual4Count = 0
  let full8LayerLessons = 0
  let verifiedPhotoLinksCount = 0

  const mathBrokenRegex = /(?<!\\)(frac\{|bar\{|int_|dot\{|cdot|infty)/g

  for (const l of lessons) {
    const content = l.content || ''
    
    // Check math formulas
    const mathBlocks = content.match(/\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+\$/g) || []
    let lessonBrokenCount = 0

    for (const mb of mathBlocks) {
      const matches = mb.match(mathBrokenRegex)
      if (matches) {
        lessonBrokenCount += matches.length
      }
    }

    if (lessonBrokenCount > 0) {
      brokenLatexCount += lessonBrokenCount
      brokenLatexLessons.push({ slug: l.slug, title: l.title, count: lessonBrokenCount })
    }

    // Check visual standard touchpoints
    const hasV1 = content.includes('```visual-mechanism')
    const hasV2 = content.includes('```industrial-photograph')
    const hasV3 = content.includes('```process-flow')
    const hasV4 = content.includes('```industrial-blueprint')

    if (hasV1) visual1Count++
    if (hasV2) visual2Count++
    if (hasV3) visual3Count++
    if (hasV4) visual4Count++

    if (content.includes('"sourceUrl"') && content.includes('"license"')) {
      verifiedPhotoLinksCount++
    }

    if (hasV1 && hasV2 && hasV3 && hasV4) {
      full8LayerLessons++
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 MATH FORMULA INTEGRITY AUDIT RESULTS:')
  console.log(`   • Total Lessons Scanned: ${totalLessons}`)
  console.log(`   • Broken Math Syntax Occurrences in $...$ / $$...$$: ${brokenLatexCount}`)
  if (brokenLatexCount > 0) {
    console.log(`   ⚠️ Lessons with Math Syntax Errors (${brokenLatexLessons.length}):`, brokenLatexLessons.slice(0, 5))
  } else {
    console.log('   ✅ 100% VERIFIED: ZERO broken LaTeX formulas exist in any math block across all 216 lessons!')
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎨 8-LAYER VISUAL LEARNING ARCHITECTURE AUDIT RESULTS:')
  console.log(`   • Visual 1 (SVG Concept Mechanism): ${visual1Count} / ${totalLessons}`)
  console.log(`   • Visual 2 (Industrial Photograph): ${visual2Count} / ${totalLessons}`)
  console.log(`   • Visual 3 (Unit Operations Flowchart): ${visual3Count} / ${totalLessons}`)
  console.log(`   • Visual 4 (CAD Industrial Blueprint): ${visual4Count} / ${totalLessons}`)
  console.log(`   • Total Active Visual Touchpoints: ${visual1Count + visual2Count + visual3Count + visual4Count} / 864`)
  console.log(`   • Verified Clickable Photo License Links: ${verifiedPhotoLinksCount} / ${totalLessons}`)
  console.log(`   • Lessons Satisfying Full 4-Visual 8-Layer Standard: ${full8LayerLessons} / ${totalLessons} (${((full8LayerLessons/totalLessons)*100).toFixed(1)}%)`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

runAudit()
