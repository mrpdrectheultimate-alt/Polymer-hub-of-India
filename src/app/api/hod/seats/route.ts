// src/app/api/hod/seats/route.ts
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 })
    }

    // Get user profile
    const { data: profile, error: profError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (!profile.is_hod) {
      return NextResponse.json({ error: 'Unauthorized: HOD institutional access required' }, { status: 403 })
    }

    if (!profile.college_name) {
      return NextResponse.json({ error: 'No college affiliation set in your profile' }, { status: 400 })
    }

    const adminSupabase = getAdminClient()

    // Get institution license
    const { data: license } = await adminSupabase
      .from('institution_licenses')
      .select('*')
      .eq('college_name', profile.college_name)
      .single()

    // Get students from same college
    const { data: students } = await adminSupabase
      .from('profiles')
      .select('id, full_name, email, subscription_status, xp_points, current_streak, college_name')
      .eq('college_name', profile.college_name)
      .neq('id', user.id)
      .order('xp_points', { ascending: false })

    return NextResponse.json({
      license: license || { total_seats: 0, allocated_seats: 0, college_name: profile.college_name, is_active: false },
      students: students || []
    })
  } catch (error) {
    console.error('HOD seats GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const studentId = body.studentId || body.student_id
    const action = body.action

    if (!studentId || !action) {
      return NextResponse.json({ error: 'Missing studentId or action' }, { status: 400 })
    }

    // Verify HOD status
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_hod) {
      return NextResponse.json({ error: 'Unauthorized: HOD access required' }, { status: 403 })
    }

    const adminSupabase = getAdminClient()

    // Get license
    const { data: license } = await adminSupabase
      .from('institution_licenses')
      .select('*')
      .eq('college_name', profile.college_name)
      .single()

    if (!license) {
      return NextResponse.json({ error: 'No institutional license found for this college' }, { status: 400 })
    }

    if (action === 'allocate') {
      if (license.allocated_seats >= license.total_seats) {
        return NextResponse.json({ error: 'No remaining institutional seats available' }, { status: 400 })
      }

      // Update student to premium (strictly scoped to same college)
      const { error: studentUpdateErr } = await adminSupabase
        .from('profiles')
        .update({ subscription_status: 'premium' })
        .eq('id', studentId)
        .eq('college_name', profile.college_name)

      if (studentUpdateErr) {
        return NextResponse.json({ error: 'Failed to update student entitlement' }, { status: 500 })
      }

      // Increment allocated seats
      await adminSupabase
        .from('institution_licenses')
        .update({ allocated_seats: license.allocated_seats + 1 })
        .eq('college_name', profile.college_name)

    } else if (action === 'revoke') {
      // Update student to free (strictly scoped to same college)
      const { error: studentRevokeErr } = await adminSupabase
        .from('profiles')
        .update({ subscription_status: 'free' })
        .eq('id', studentId)
        .eq('college_name', profile.college_name)

      if (studentRevokeErr) {
        return NextResponse.json({ error: 'Failed to revoke student entitlement' }, { status: 500 })
      }

      // Decrement allocated seats
      await adminSupabase
        .from('institution_licenses')
        .update({ allocated_seats: Math.max(0, license.allocated_seats - 1) })
        .eq('college_name', profile.college_name)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('HOD seats POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
