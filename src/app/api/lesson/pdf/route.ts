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

    const htmlContent = generateLessonHTML(lesson, subjectName, studentName)

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

function generateLessonHTML(lesson: LessonPDFData, subjectName: string, studentName: string): string {
  const now = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  let content = lesson.content || ''

  // Convert tables
  content = content.replace(/(\|.+\|\n)+/g, (table: string) => {
    const rows = table.trim().split('\n')
    if (rows.length < 2) return table
    const headers = rows[0].split('|').filter(Boolean).map((h: string) => h.trim())
    const bodyRows = rows.slice(2)
    const bodyHtml = bodyRows.map((row: string) => {
      const cells = row.split('|').filter(Boolean).map((c: string) => c.trim())
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join('')}</tr>`
    }).join('')
    return `<div class="table-container"><table><thead><tr>${headers.map((h: string) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`
  })

  // Basic Markdown replacements
  content = content.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  content = content.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  content = content.replace(/^---$/gm, '<hr>')
  content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  content = content.replace(/`([^`]+)`/g, '<code>$1</code>')
  content = content.replace(/^- (.+)$/gm, '<li>$1</li>')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${lesson.title} — PolymerHub Study Notes</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 20mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.65;
      color: #0F172A;
      max-width: 820px;
      margin: 0 auto;
      padding: 30px 20px;
      background: #FFFFFF;
    }
    .print-bar {
      position: sticky;
      top: 10px;
      z-index: 1000;
      background: #0A1628;
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }
    .print-btn {
      background: #2563EB;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 13px;
      cursor: pointer;
    }
    .header {
      border-bottom: 3px solid #0A1628;
      padding-bottom: 18px;
      margin-bottom: 25px;
    }
    .sub-brand {
      font-size: 11px;
      font-family: monospace;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #2563EB;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .title {
      font-size: 26px;
      font-weight: 900;
      color: #0F172A;
      margin: 0 0 8px 0;
      line-height: 1.25;
    }
    .meta-bar {
      font-size: 12px;
      font-family: monospace;
      color: #64748B;
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    h2 {
      font-size: 18px;
      font-weight: 800;
      color: #1E293B;
      border-bottom: 1.5px solid #E2E8F0;
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 12px;
    }
    h3 {
      font-size: 15px;
      font-weight: 700;
      color: #334155;
      margin-top: 20px;
      margin-bottom: 8px;
    }
    p {
      margin: 0 0 14px 0;
      font-size: 14px;
      color: #334155;
    }
    li {
      margin-bottom: 6px;
      font-size: 14px;
      color: #334155;
    }
    .table-container {
      overflow-x: auto;
      margin: 18px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #CBD5E1;
      padding: 8px 12px;
      text-align: left;
    }
    th {
      background: #F1F5F9;
      font-weight: 800;
      color: #0F172A;
    }
    code {
      background: #F1F5F9;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      color: #2563EB;
    }
    .footer-watermark {
      margin-top: 45px;
      padding-top: 15px;
      border-top: 1.5px dashed #CBD5E1;
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-family: monospace;
      color: #94A3B8;
    }
    @media print {
      .print-bar {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <div>
      <strong>PolymerHub of India</strong> &mdash; Printable Notes &amp; Exam Sheet
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="header">
    <div class="sub-brand">${subjectName} &middot; Lesson ${lesson.order_index + 1} &middot; GATE XE-F / AICTE Aligned</div>
    <h1 class="title">${lesson.title}</h1>
    <div class="meta-bar">
      <span>Curriculum: <strong>${subjectName}</strong></span>
      <span>Target: <strong>Polymer Engineering</strong></span>
      <span>Export Date: <strong>${now}</strong></span>
    </div>
  </div>

  <div class="content">
    ${content}
  </div>

  <div class="footer-watermark">
    <span>PolymerHub India &middot; Verified Curriculum Repository</span>
    <span>Licensed Scholar: ${studentName}</span>
    <span>Generated: ${now}</span>
  </div>

  <script>
    // Auto trigger print prompt on load
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`
}
