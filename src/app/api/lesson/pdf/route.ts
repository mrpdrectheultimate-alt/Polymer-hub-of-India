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

    if (!session) {
      return NextResponse.json({ error: 'Sign in to download lesson notes.' }, { status: 401 })
    }

    // Check premium subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, full_name, is_premium')
      .eq('id', session.user.id)
      .single()

    const isPremium = profile?.subscription_status === 'premium' || profile?.is_premium === true
    if (!isPremium) {
      return NextResponse.json(
        { error: 'PDF download is a Premium feature. Upgrade for ₹149/month.' },
        { status: 403 }
      )
    }

    // Get lesson
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

    // Log PDF download
    await supabase.from('pdf_download_log').insert({
      user_id: session.user.id,
      lesson_id: lesson.id,
      downloaded_at: new Date().toISOString()
    })

    const subjects = lesson.subjects as unknown as { name: string; slug: string }
    const subjectName = subjects?.name ?? 'Polymer Engineering'
    const studentName = profile?.full_name ?? 'Student'

    // Generate the PDF content as HTML that will be rendered/printed
    const htmlContent = generateLessonHTML(lesson, subjectName, studentName)

    const safeFilename = lesson.title
      .replace(/[^a-zA-Z0-9-_ ]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80)

    // Return HTML with PDF security headers
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="${safeFilename}.html"`,
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        'X-Lesson-Title': safeFilename,
      },
    })

  } catch (error) {
    const err = error as Error
    console.error('PDF generation error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ─── HTML Template for PDF ────────────────────────────────────────────────────

function generateLessonHTML(lesson: LessonPDFData, subjectName: string, studentName: string): string {
  const now = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  let content = lesson.content || ''

  content = content.replace(/(\|.+\|\n)+/g, (table: string) => {
    const rows = table.trim().split('\n')
    const headers = rows[0].split('|').filter(Boolean).map((h: string) => h.trim())
    const bodyRows = rows.slice(2)
    const bodyHtml = bodyRows.map((row: string) => {
      const cells = row.split('|').filter(Boolean).map((c: string) => c.trim())
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join('')}</tr>`
    }).join('')
    return `<table><thead><tr>${headers.map((h: string) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${bodyHtml}</tbody></table>`
  })

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
  <title>${lesson.title} — PolymerHub Notes</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
    .title { font-size: 28px; font-weight: 900; text-transform: uppercase; margin: 0; }
    .subtitle { font-size: 14px; color: #666; font-weight: bold; margin-top: 5px; }
    .watermark { font-size: 11px; color: #888; border-top: 1px solid #ddd; margin-top: 40px; padding-top: 15px; display: flex; justify-content: space-between; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
    th { background: #f4f4f4; font-weight: bold; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="header">
    <div class="subtitle">${subjectName.toUpperCase()} — POLYMERHUB EXCLUSIVE NOTES</div>
    <h1 class="title">${lesson.title}</h1>
  </div>
  <div class="content">${content}</div>
  <div class="watermark">
    <span>Licensed to: ${studentName}</span>
    <span>Generated: ${now}</span>
    <span>PolymerHub — All Rights Reserved</span>
  </div>
</body>
</html>`
}
