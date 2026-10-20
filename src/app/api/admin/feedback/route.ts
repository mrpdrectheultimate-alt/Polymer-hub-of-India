// src/app/api/admin/feedback/route.ts — Secure Admin Feedback Management API
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

export async function GET(request: Request) {
  try {
    const authCheck = await verifyAdminAuth()
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const adminSupabase = getAdminSupabase()
    let query = adminSupabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)

    if (type && type !== 'all') {
      query = query.eq('type', type)
    }
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ feedback: data || [] })
  } catch (error) {
    console.error('Admin feedback GET error:', error)
    return NextResponse.json({ error: 'Failed to retrieve feedback records' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const authCheck = await verifyAdminAuth()
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const body = await request.json()
    const { id, status, adminNote } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing feedback item id' }, { status: 400 })
    }

    const updates: Record<string, string | null> = {}
    if (status) updates.status = status
    if (adminNote !== undefined) updates.admin_note = adminNote

    const adminSupabase = getAdminSupabase()
    const { data, error } = await adminSupabase
      .from('feedback')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, item: data })
  } catch (error) {
    console.error('Admin feedback PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update feedback item' }, { status: 500 })
  }
}
