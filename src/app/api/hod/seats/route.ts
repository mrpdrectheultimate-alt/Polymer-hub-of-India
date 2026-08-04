// src/app/api/hod/seats/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
      return NextResponse.json({ error: 'Unauthorized: HOD access required' }, { status: 403 })
    }

    // Get institution license
    const { data: license } = await supabase
      .from('institution_licenses')
      .select('*')
      .eq('college_name', profile.college_name)
      .single()

    // Get students from same college
    const { data: students } = await supabase
      .from('profiles')
      .select('id, full_name, email, subscription_status, xp_points, current_streak')
      .eq('college_name', profile.college_name)
      .neq('id', user.id)

    return NextResponse.json({
      license: license || { total_seats: 0, allocated_seats: 0, college_name: profile.college_name },
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

    const { studentId, action } = await request.json()

    // Verify HOD status
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile || !profile.is_hod) {
      return NextResponse.json({ error: 'Unauthorized: HOD access required' }, { status: 403 })
    }

    // Get license
    const { data: license } = await supabase
      .from('institution_licenses')
      .select('*')
      .eq('college_name', profile.college_name)
      .single()

    if (!license) {
      return NextResponse.json({ error: 'No license found for this college' }, { status: 400 })
    }

    if (action === 'allocate') {
      if (license.allocated_seats >= license.total_seats) {
        return NextResponse.json({ error: 'No seats available' }, { status: 400 })
      }

      // Update student to premium
      await supabase
        .from('profiles')
        .update({ subscription_status: 'premium' })
        .eq('id', studentId)

      // Increment allocated seats
      await supabase
        .from('institution_licenses')
        .update({ allocated_seats: license.allocated_seats + 1 })
        .eq('college_name', profile.college_name)

    } else if (action === 'revoke') {
      // Update student to free
      await supabase
        .from('profiles')
        .update({ subscription_status: 'free' })
        .eq('id', studentId)

      // Decrement allocated seats
      await supabase
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
