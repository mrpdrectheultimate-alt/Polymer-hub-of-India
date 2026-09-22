import fs from 'fs'

const data = JSON.parse(fs.readFileSync('scratch/deep_audit_216_lessons_results.json', 'utf8'))

const issueTypes = {
  controlChars: 0,
  strippedLatex: 0,
  unbalancedDollars: 0,
  lowWordCount: 0
}

const subjectBreakdown = {}

for (const issue of data.issues) {
  const subj = issue.subject || 'Unknown'
  if (!subjectBreakdown[subj]) {
    subjectBreakdown[subj] = { count: 0, lessons: [] }
  }
  subjectBreakdown[subj].count++
  subjectBreakdown[subj].lessons.push({
    title: issue.title,
    slug: issue.slug,
    issues: issue.issues,
    wordCount: issue.wordCount
  })

  for (const i of issue.issues) {
    if (i.includes('control characters')) issueTypes.controlChars++
    if (i.includes('Stripped LaTeX')) issueTypes.strippedLatex++
    if (i.includes('Unbalanced dollar')) issueTypes.unbalancedDollars++
    if (i.includes('Low content word count')) issueTypes.lowWordCount++
  }
}

console.log('=== DEEP AUDIT SUMMARY ===')
console.log(`Total Subjects: ${data.totalSubjects}`)
console.log(`Total Lessons: ${data.totalLessons}`)
console.log(`Flagged Lessons: ${data.problematicLessonsCount}`)
console.log('\n--- ISSUE TYPE BREAKDOWN ---')
console.log(`1. Control Character Corruption (e.g. \\x08, \\x0C): ${issueTypes.controlChars}`)
console.log(`2. Stripped LaTeX Commands (e.g. rac{, ar{, dot{): ${issueTypes.strippedLatex}`)
console.log(`3. Unbalanced Dollar Signs ($): ${issueTypes.unbalancedDollars}`)
console.log(`4. Low Content Length (<400 words): ${issueTypes.lowWordCount}`)

console.log('\n--- SUBJECT BREAKDOWN ---')
for (const [subj, info] of Object.entries(subjectBreakdown)) {
  console.log(`• ${subj}: ${info.count} lessons flagged`)
}
