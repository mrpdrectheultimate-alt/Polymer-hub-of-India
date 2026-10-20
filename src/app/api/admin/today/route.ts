// src/app/api/admin/today/route.ts — Secure Admin Daily Intelligence Engine API
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { isUserAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'

const getAdminSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createAdminClient(url, key)
}

async function verifyAdminAuth() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { authorized: false, status: 401, error: 'Unauthorized: Please log in' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!isUserAdmin(user, profile)) {
    return { authorized: false, status: 403, error: 'Forbidden: Admin clearance required' }
  }

  return { authorized: true, user }
}

export async function GET() {
  try {
    const authCheck = await verifyAdminAuth()
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const adminSupabase = getAdminSupabase()
    const { data, error } = await adminSupabase
      .from('daily_updates')
      .select('*')
      .order('publish_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ entries: data || [] })
  } catch (error) {
    console.error('Admin daily updates GET error:', error)
    return NextResponse.json({ error: 'Failed to retrieve daily updates' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authCheck = await verifyAdminAuth()
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const body = await request.json()
    const {
      headline,
      summary,
      source_name,
      source_url,
      image_url,
      image_credit,
      category,
      region,
      related_lesson_slug,
      related_subject_slug,
      is_featured,
      publish_date,
      editorial_status
    } = body

    if (!headline || !summary || !source_name) {
      return NextResponse.json({ error: 'Headline, summary, and source name are required' }, { status: 400 })
    }

    const adminSupabase = getAdminSupabase()
    const { data, error } = await adminSupabase
      .from('daily_updates')
      .insert({
        headline: headline.trim(),
        summary: summary.trim(),
        source_name: source_name.trim(),
        source_url: source_url ? source_url.trim() : null,
        image_url: image_url ? image_url.trim() : null,
        image_credit: image_credit ? image_credit.trim() : null,
        category: category || 'Research',
        region: region || 'Global',
        related_lesson_slug: related_lesson_slug ? related_lesson_slug.trim() : null,
        related_subject_slug: related_subject_slug ? related_subject_slug.trim() : null,
        is_featured: Boolean(is_featured),
        publish_date: publish_date || new Date().toISOString().split('T')[0],
        is_published: editorial_status === 'published'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, entry: data })
  } catch (error) {
    console.error('Admin daily updates POST error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const authCheck = await verifyAdminAuth()
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing entry id' }, { status: 400 })
    }

    const adminSupabase = getAdminSupabase()
    const { error } = await adminSupabase
      .from('daily_updates')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin daily updates DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete update' }, { status: 500 })
  }
}
