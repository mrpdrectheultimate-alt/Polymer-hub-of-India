// scripts/verify_library_depth_and_latex.mjs
import { ALL_LIBRARY_BOOKS } from '../src/lib/library_data.ts'

console.log('🔍 Starting Comprehensive Digital Library Verification Audit (Strict 800+ Word Textbook Standard)...\n')

let classACount = 0
let classBCount = 0
let classDCount = 0
let latexErrors = 0
let classDErrors = 0
let depthErrors = 0
let depthWarnings = 0
let totalClassAWords = 0
let flagshipBookWords = 0

ALL_LIBRARY_BOOKS.forEach((book, idx) => {
  console.log(`[Book ${idx + 1}/20] [${book.legal_class}] "${book.title}" (${book.slug})`)

  if (book.legal_class === 'Class A') classACount++
  if (book.legal_class === 'Class B') classBCount++
  if (book.legal_class === 'Class D') classDCount++

  // Check Class D books for strictly empty chapters
  if (book.legal_class === 'Class D') {
    const chapterKeys = Object.keys(book.chapters || {})
    if (chapterKeys.length > 0) {
      console.error(`   ❌ FAIL: Class D book has non-empty chapters: ${chapterKeys.join(', ')}`)
      classDErrors++
    } else {
      console.log(`   ✅ Class D Verified: 0 body chapters stored (Catalog Card only). ISBN: ${book.isbn || 'N/A'}, DOI: ${book.doi || 'N/A'}`)
    }
  }

  // Check Class A books for content depth & LaTeX backslash escaping
  if (book.legal_class === 'Class A') {
    const chapters = book.chapters || {}
    const chKeys = Object.keys(chapters)
    console.log(`   📚 Class A Chapters Found: ${chKeys.length}`)
    let bookWordSum = 0

    chKeys.forEach(chId => {
      const content = chapters[chId] || ''
      const wordCount = content.split(/\s+/).length
      bookWordSum += wordCount
      totalClassAWords += wordCount

      // Check for broken KaTeX occurrences (control chars or unescaped commands)
      const hasBackspaceChar = /\x08/.test(content)
      const hasFormfeedChar = /\x0C/.test(content)
      const hasBrokenAr = /(?<![b\\])ar\{/.test(content)
      const hasBrokenRac = /(?<![f\\])rac\{/.test(content)

      if (hasBackspaceChar || hasFormfeedChar || hasBrokenAr || hasBrokenRac) {
        console.error(`   ❌ KaTeX FAIL in ${chId}: Broken equation formatting detected! (BS:${hasBackspaceChar}, FF:${hasFormfeedChar}, AR:${hasBrokenAr}, RAC:${hasBrokenRac})`)
        latexErrors++
      }

      if (wordCount < 500) {
        console.error(`   ❌ CRITICAL DEPTH FAIL in ${chId}: Only ${wordCount} words (STUB DETECTED - Strict Minimum 500 Words Required!).`)
        depthErrors++
      } else if (wordCount < 800) {
        console.warn(`   ⚠️ Depth Warning in ${chId}: ${wordCount} words (Passes 500-word baseline, but below 800-word academic target).`)
        depthWarnings++
      } else {
        console.log(`   ✅ ${chId}: ${wordCount} words (Deep Academic Textbook Chapter Verified).`)
      }
    })

    console.log(`   📖 Total Book Word Count: ${bookWordSum} words`)
    if (book.slug === 'injection-moulding-defect-mastery') {
      flagshipBookWords = bookWordSum
      if (bookWordSum >= 12000) {
        console.log(`   🌟 FLAGSHIP BOOK VERIFIED: ${bookWordSum} words (Exceeds 12,000-Word Gold Standard!)`)
      } else {
        console.warn(`   ⚠️ Flagship Book Warning: ${bookWordSum} words (Target: 12,000+ words)`)
      }
    }
  }
})

console.log('\n==================================================')
console.log('📊 COMPREHENSIVE VERIFICATION SUMMARY:')
console.log(`- Total Books: ${ALL_LIBRARY_BOOKS.length} (Class A: ${classACount}, Class B: ${classBCount}, Class D: ${classDCount})`)
console.log(`- Total Class A Library Word Count: ${totalClassAWords} words`)
console.log(`- Flagship Book Word Count: ${flagshipBookWords} words`)
console.log(`- Class D Legal Check: ${classDErrors === 0 ? '✅ PASSED (100% Clean Catalog Cards)' : '❌ FAILED'}`)
console.log(`- KaTeX Equation Check: ${latexErrors === 0 ? '✅ PASSED (0 Broken Equations)' : `❌ FAILED (${latexErrors} errors)`}`)
console.log(`- Content Depth Hard Check (<500 words): ${depthErrors === 0 ? '✅ PASSED (0 Critical Stubs)' : `❌ FAILED (${depthErrors} critical errors)`}`)
console.log(`- Academic Depth Target Check (<800 words): ${depthWarnings === 0 ? '✅ PASSED (100% Chapters >= 800 words)' : `⚠️ ${depthWarnings} warnings`}`)
console.log('==================================================\n')

if (classDErrors === 0 && latexErrors === 0 && depthErrors === 0 && depthWarnings === 0) {
  console.log('🎉 ALL VERIFICATION AUDITS PASSED WITH ZERO ERRORS & ZERO WARNINGS! 100% WORLD-CLASS ACADEMIC TEXTBOOK STANDARD ACHIEVED! 🚀')
} else {
  console.log('❌ Audit incomplete. Please address errors/warnings.')
  process.exit(1)
}
