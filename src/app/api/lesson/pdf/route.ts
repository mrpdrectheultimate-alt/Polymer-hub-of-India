import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type LessonPDFData = {
  id: string
  title: string
  summary: string
  content: string
  order_index: number
  is_published?: boolean
  is_premium?: boolean
}

type QuizQuestion = {
  id: string
  question_text: string
  options: string[]
  correct_index: number
  explanation: string
  difficulty: string
  order_index: number
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    // Get lesson slug
    const slug = req.nextUrl.searchParams.get('slug')
    if (!slug) {
      return NextResponse.json({ error: 'Lesson slug required' }, { status: 400 })
    }

    const { data: lesson } = await supabase
      .from('lessons')
      .select('*, subjects(name, slug)')
      .eq('slug', slug)
      .single()

    if (!lesson || lesson.is_published === false) {
      return NextResponse.json({ error: 'Lesson not found or unpublished' }, { status: 404 })
    }

    // Fetch quiz and quiz questions for PDF export if available
    let quizQuestions: QuizQuestion[] = []
    const { data: quizData } = await supabase
      .from('quizzes')
      .select('id')
      .eq('lesson_id', lesson.id)
      .single()

    if (quizData) {
      const { data: qData } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizData.id)
        .order('order_index')
      if (qData) quizQuestions = qData as QuizQuestion[]
    }

    let studentName = 'Engineering Scholar'
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', session.user.id)
        .single()
      if (profile?.full_name) {
        studentName = profile.full_name
      }

      // Log download
      try {
        await supabase.from('pdf_download_log').insert({
          user_id: session.user.id,
          lesson_id: lesson.id,
          downloaded_at: new Date().toISOString()
        })
      } catch {
        // ignore log error
      }
    }

    const subjects = lesson.subjects as unknown as { name: string; slug: string }
    const subjectName = subjects?.name ?? 'Polymer Engineering'

    const htmlContent = generateLessonHTML(lesson, subjectName, studentName, quizQuestions)

    const safeFilename = lesson.title
      .replace(/[^a-zA-Z0-9-_ ]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80)

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${safeFilename}.html"`,
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    })

  } catch (error) {
    const err = error as Error
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * Markdown to Clean Semantic HTML Parser with KaTeX compatibility
 */
function parseMarkdownToHTML(rawMarkdown: string): string {
  if (!rawMarkdown) return ''

  let text = rawMarkdown

  // 1. Sanitize raw LaTeX backslashes if un-escaped
  text = text
    .replace(/\x08/g, '\\b')
    .replace(/\x0C/g, '\\f')
    .replace(/\x09/g, '\\t')
    .replace(/\x0B/g, '\\v')
    .replace(/(?<!\\)rac\{/g, '\\frac{')
    .replace(/(?<!\\)ar\{/g, '\\bar{')
    .replace(/(?<!\\)dot\{/g, '\\dot{')
    .replace(/(?<!\\)igma\{/g, '\\sigma{')
    .replace(/(?<!\\)au\{/g, '\\tau{')

  // 2. Extract code blocks and placeholders to avoid corruption
  const codeBlocks: string[] = []
  text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
    const idx = codeBlocks.length
    codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`)
    return `___CODEBLOCK_${idx}___`
  })

  // 3. Convert Tables
  text = text.replace(/(\|.+\|\n)+/g, (tableStr: string) => {
    const lines = tableStr.trim().split('\n')
    if (lines.length < 2) return tableStr
    const headers = lines[0].split('|').filter(Boolean).map(h => h.trim())
    const bodyLines = lines.slice(2)
    const bodyHtml = bodyLines.map(row => {
      const cells = row.split('|').filter(Boolean).map(c => c.trim())
      return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`
    }).join('')
    return `<div class="table-container no-break"><table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`
  })

  // 4. Split into block lines
  const lines = text.split('\n')
  const htmlOutput: string[] = []

  let inUnorderedList = false
  let inOrderedList = false

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim()

    if (!line) {
      if (inUnorderedList) { htmlOutput.push('</ul>'); inUnorderedList = false }
      if (inOrderedList) { htmlOutput.push('</ol>'); inOrderedList = false }
      continue
    }

    // Headings
    if (line.startsWith('# ')) {
      if (inUnorderedList) { htmlOutput.push('</ul>'); inUnorderedList = false }
      if (inOrderedList) { htmlOutput.push('</ol>'); inOrderedList = false }
      htmlOutput.push(`<h1>${line.slice(2).trim()}</h1>`)
      continue
    }
    if (line.startsWith('## ')) {
      if (inUnorderedList) { htmlOutput.push('</ul>'); inUnorderedList = false }
      if (inOrderedList) { htmlOutput.push('</ol>'); inOrderedList = false }
      htmlOutput.push(`<h2>${line.slice(3).trim()}</h2>`)
      continue
    }
    if (line.startsWith('### ')) {
      if (inUnorderedList) { htmlOutput.push('</ul>'); inUnorderedList = false }
      if (inOrderedList) { htmlOutput.push('</ol>'); inOrderedList = false }
      htmlOutput.push(`<h3>${line.slice(4).trim()}</h3>`)
      continue
    }
    if (line.startsWith('#### ')) {
      if (inUnorderedList) { htmlOutput.push('</ul>'); inUnorderedList = false }
      if (inOrderedList) { htmlOutput.push('</ol>'); inOrderedList = false }
      htmlOutput.push(`<h4>${line.slice(5).trim()}</h4>`)
      continue
    }

    // Horizontal Rule
    if (line === '---' || line === '***') {
      if (inUnorderedList) { htmlOutput.push('</ul>'); inUnorderedList = false }
      if (inOrderedList) { htmlOutput.push('</ol>'); inOrderedList = false }
      htmlOutput.push('<hr>')
      continue
    }

    // Blockquotes / Callout boxes
    if (line.startsWith('> ')) {
      if (inUnorderedList) { htmlOutput.push('</ul>'); inUnorderedList = false }
      if (inOrderedList) { htmlOutput.push('</ol>'); inOrderedList = false }
      htmlOutput.push(`<blockquote class="callout no-break"><p>${line.slice(2).trim()}</p></blockquote>`)
      continue
    }

    // Unordered List Items (- or *)
    const ulMatch = line.match(/^[-*]\s+(.+)$/)
    if (ulMatch) {
      if (inOrderedList) { htmlOutput.push('</ol>'); inOrderedList = false }
      if (!inUnorderedList) { htmlOutput.push('<ul>'); inUnorderedList = true }
      htmlOutput.push(`<li>${ulMatch[1].trim()}</li>`)
      continue
    }

    // Ordered List Items (1. 2. etc)
    const olMatch = line.match(/^(\d+)\.\s+(.+)$/)
    if (olMatch) {
      if (inUnorderedList) { htmlOutput.push('</ul>'); inUnorderedList = false }
      if (!inOrderedList) { htmlOutput.push('<ol>'); inOrderedList = true }
      htmlOutput.push(`<li>${olMatch[2].trim()}</li>`)
      continue
    }

    // Codeblock placeholder
    if (line.startsWith('___CODEBLOCK_')) {
      if (inUnorderedList) { htmlOutput.push('</ul>'); inUnorderedList = false }
      if (inOrderedList) { htmlOutput.push('</ol>'); inOrderedList = false }
      const idx = parseInt(line.replace('___CODEBLOCK_', '').replace('___', ''), 10)
      htmlOutput.push(codeBlocks[idx] || line)
      continue
    }

    // Paragraph
    if (inUnorderedList) { htmlOutput.push('</ul>'); inUnorderedList = false }
    if (inOrderedList) { htmlOutput.push('</ol>'); inOrderedList = false }
    htmlOutput.push(`<p>${line}</p>`)
  }

  if (inUnorderedList) htmlOutput.push('</ul>')
  if (inOrderedList) htmlOutput.push('</ol>')

  let result = htmlOutput.join('\n')

  // Inline formatting
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>')

  return result
}

function generateLessonHTML(
  lesson: LessonPDFData,
  subjectName: string,
  studentName: string,
  quizQuestions: QuizQuestion[]
): string {
  const now = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const parsedContent = parseMarkdownToHTML(lesson.content || '')

  // Generate Quiz Section HTML if quiz questions exist
  let quizSectionHTML = ''
  if (quizQuestions && quizQuestions.length > 0) {
    const questionsHTML = quizQuestions.map((q, idx) => {
      const optionsHTML = q.options.map((opt, optIdx) => {
        const isCorrect = optIdx === q.correct_index
        return `<div class="quiz-option ${isCorrect ? 'correct' : ''}">
          <span class="option-badge">${String.fromCharCode(65 + optIdx)}</span>
          <span class="option-text">${opt}</span>
          ${isCorrect ? '<span class="correct-badge">✓ Correct Answer</span>' : ''}
        </div>`
      }).join('')

      return `<div class="quiz-card no-break">
        <div class="quiz-question">
          <span class="q-num">Q${idx + 1}.</span> ${q.question_text}
        </div>
        <div class="quiz-options">
          ${optionsHTML}
        </div>
        <div class="quiz-explanation">
          <strong>💡 Technical Explanation:</strong> ${q.explanation}
        </div>
      </div>`
    }).join('')

    quizSectionHTML = `
      <div class="page-break"></div>
      <div class="quiz-container">
        <h2>9. Interactive Knowledge & Exam Quiz</h2>
        <p class="quiz-subtitle">Verified Assessment Questions aligned with AICTE & GATE XE-F Standards</p>
        ${questionsHTML}
      </div>
    `
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lesson.title} — PolymerHub Study Notes</title>

  <!-- KaTeX CSS & JS Auto-Render -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>

  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 20mm 15mm;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.7;
      color: #0F172A;
      max-width: 840px;
      margin: 0 auto;
      padding: 30px 20px;
      background: #FFFFFF;
      -webkit-font-smoothing: antialiased;
    }

    /* Screen Action Bar */
    .print-bar {
      position: sticky;
      top: 15px;
      z-index: 9999;
      background: #0A1628;
      color: white;
      padding: 14px 22px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 35px;
      box-shadow: 0 8px 24px rgba(10,22,40,0.25);
    }
    .print-bar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 0.5px;
    }
    .print-bar-tag {
      background: #2563EB;
      color: white;
      font-size: 10px;
      font-family: monospace;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      font-weight: 700;
    }
    .print-btn {
      background: #F5C518;
      color: #0A1628;
      border: none;
      padding: 9px 20px;
      border-radius: 8px;
      font-weight: 900;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .print-btn:hover {
      background: #EAB308;
    }

    /* Header */
    .header {
      border-bottom: 3px solid #0A1628;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .sub-brand {
      font-size: 11px;
      font-family: monospace;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #2563EB;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .title {
      font-size: 26px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 10px 0;
      line-height: 1.25;
    }
    .meta-bar {
      font-size: 12px;
      font-family: monospace;
      color: #64748B;
      display: flex;
      gap: 18px;
      flex-wrap: wrap;
    }

    /* Content Styling */
    h1, h2, h3, h4 {
      color: #0F172A;
      font-weight: 800;
      line-height: 1.3;
    }
    h2 {
      font-size: 19px;
      border-bottom: 2px solid #E2E8F0;
      padding-bottom: 8px;
      margin-top: 32px;
      margin-bottom: 14px;
    }
    h3 {
      font-size: 16px;
      margin-top: 24px;
      margin-bottom: 10px;
      color: #1E293B;
    }
    h4 {
      font-size: 14px;
      margin-top: 18px;
      margin-bottom: 8px;
      color: #334155;
    }
    p {
      margin: 0 0 14px 0;
      font-size: 14.5px;
      color: #334155;
      text-align: justify;
    }
    ul, ol {
      margin: 0 0 16px 0;
      padding-left: 24px;
    }
    li {
      margin-bottom: 6px;
      font-size: 14px;
      color: #334155;
    }
    blockquote.callout {
      margin: 18px 0;
      padding: 14px 18px;
      background: #F8FAFC;
      border-left: 4px solid #2563EB;
      border-radius: 0 8px 8px 0;
      font-size: 14px;
      color: #1E293B;
    }
    blockquote.callout p {
      margin: 0;
    }

    /* Tables */
    .table-container {
      margin: 22px 0;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #CBD5E1;
      padding: 9px 13px;
      text-align: left;
    }
    th {
      background: #F1F5F9;
      font-weight: 800;
      color: #0F172A;
    }

    /* KaTeX Adjustments */
    .katex-display {
      margin: 18px 0 !important;
      padding: 12px 0;
      overflow-x: auto;
      overflow-y: hidden;
      text-align: center;
    }
    .katex {
      font-size: 1.08em;
    }

    /* Quiz Cards */
    .quiz-container {
      margin-top: 35px;
    }
    .quiz-subtitle {
      font-size: 13px;
      font-family: monospace;
      color: #64748B;
      margin-bottom: 20px;
    }
    .quiz-card {
      background: #F8FAFC;
      border: 1.5px solid #E2E8F0;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 18px;
    }
    .quiz-question {
      font-weight: 800;
      font-size: 14.5px;
      color: #0F172A;
      margin-bottom: 12px;
    }
    .q-num {
      color: #2563EB;
    }
    .quiz-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
    }
    @media (max-width: 600px) {
      .quiz-options {
        grid-template-columns: 1fr;
      }
    }
    .quiz-option {
      background: white;
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .quiz-option.correct {
      border-color: #16A34A;
      background: #F0FDF4;
    }
    .option-badge {
      font-family: monospace;
      font-weight: 800;
      background: #E2E8F0;
      color: #0F172A;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      flex-shrink: 0;
    }
    .quiz-option.correct .option-badge {
      background: #16A34A;
      color: white;
    }
    .option-text {
      flex: 1;
      color: #334155;
    }
    .correct-badge {
      font-size: 10px;
      font-weight: 800;
      color: #16A34A;
      font-family: monospace;
      white-space: nowrap;
    }
    .quiz-explanation {
      font-size: 12.5px;
      background: #EFF6FF;
      border-left: 3px solid #2563EB;
      padding: 8px 12px;
      border-radius: 0 6px 6px 0;
      color: #1E3A8A;
    }

    /* Footer Watermark */
    .footer-watermark {
      margin-top: 50px;
      padding-top: 16px;
      border-top: 1.5px dashed #CBD5E1;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-family: monospace;
      color: #94A3B8;
    }

    /* Print Specific Rules */
    .page-break {
      page-break-before: always;
    }
    .no-break {
      page-break-inside: avoid;
    }

    @media print {
      .print-bar {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      body {
        padding: 0 !important;
        max-width: 100% !important;
        background: white !important;
      }
    }
  </style>
</head>
<body>

  <!-- Screen Top Bar -->
  <div class="print-bar">
    <div class="print-bar-brand">
      <span>PolymerHub of India</span>
      <span class="print-bar-tag">Verified Exam &amp; Study Sheet</span>
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <!-- Lesson Header -->
  <div class="header">
    <div class="sub-brand">${subjectName} &middot; Lesson ${lesson.order_index + 1} &middot; GATE XE-F / AICTE Aligned</div>
    <h1 class="title">${lesson.title}</h1>
    <div class="meta-bar">
      <span>Subject: <strong>${subjectName}</strong></span>
      <span>Scholar: <strong>${studentName}</strong></span>
      <span>Export Date: <strong>${now}</strong></span>
    </div>
  </div>

  <!-- Lesson Body -->
  <div class="content">
    ${parsedContent}
  </div>

  <!-- Quiz Section -->
  ${quizSectionHTML}

  <!-- Footer Watermark -->
  <div class="footer-watermark no-break">
    <span>PolymerHub India &middot; Verified Curriculum Repository</span>
    <span>Licensed Scholar: ${studentName}</span>
    <span>Generated: ${now}</span>
  </div>

  <!-- KaTeX Auto Render Script -->
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      if (window.renderMathInElement) {
        window.renderMathInElement(document.body, {
          delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$", right: "$", display: false}
          ],
          throwOnError: false
        });
      }
    });
  </script>
</body>
</html>`
}
