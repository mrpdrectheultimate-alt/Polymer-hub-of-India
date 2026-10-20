// src/app/api/admin/videos/route.ts — Secure Admin Video Management API
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
      .from('videos')
      .select('*')
      .order('title', { ascending: true })

    if (error) throw error

    return NextResponse.json({ videos: data || [] })
  } catch (error) {
    console.error('Admin videos GET error:', error)
    return NextResponse.json({ error: 'Failed to retrieve videos' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const authCheck = await verifyAdminAuth()
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
    }

    const body = await request.json()
    const { id, updates } = body

    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing video id or updates payload' }, { status: 400 })
    }

    const adminSupabase = getAdminSupabase()
    const { data, error } = await adminSupabase
      .from('videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, video: data })
  } catch (error) {
    console.error('Admin video PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update video record' }, { status: 500 })
  }
}
