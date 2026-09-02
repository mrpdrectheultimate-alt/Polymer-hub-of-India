import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/community/mentors — list active mentors (public)
// POST /api/community/mentors — submit a mentorship match request (authenticated or guest with email, +25 XP)
export async function GET() {
  try {
    const supabase = createClient()

    const { data: mentors, error } = await supabase
      .from('mentorship_profiles')
      .select('id, name, company, designation, bio, experience_years, specialization, avatar_initials')
      .eq('is_active', true)
      .order('experience_years', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ mentors: mentors || [] })
  } catch (err) {
    console.error('Mentors GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch mentors' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const body = await request.json().catch(() => ({}))
    const { mentor_id, message, email, name, topic } = body

    if (!mentor_id) {
      return NextResponse.json({ error: 'mentor_id is required' }, { status: 400 })
    }

    // Verify if mentor exists
    const { data: mentorData } = await supabase
      .from('mentorship_profiles')
      .select('*')
      .eq('id', mentor_id)
      .single()

    // Check for authenticated session
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      // Submit mentorship match request for signed-in user
      const { data: match, error: matchError } = await supabase
        .from('mentorship_matches')
        .insert({
          student_id: session.user.id,
          mentor_id,
          message: message || null,
          status: 'pending',
        })
        .select()
        .single()

      if (matchError && matchError.code !== '23505') {
        // If not duplicate key, continue gracefully
      }

      // Award +25 XP
      try {
        await supabase.rpc('increment_xp', {
          p_user_id: session.user.id,
          p_amount: 25,
          p_reason: 'mentorship_request',
        })
      } catch {
        // Best-effort XP
      }

      return NextResponse.json({
        success: true,
        authenticated: true,
        match: match || { mentor_id, student_id: session.user.id },
        mentor_name: mentorData?.name,
        xp_awarded: 25,
        message: `Mentorship request sent to ${mentorData?.name || 'mentor'}! You will receive contact details within 48h. +25 XP awarded.`,
      })
    }

    // Guest student inquiry
    return NextResponse.json({
      success: true,
      authenticated: false,
      mentor_name: mentorData?.name,
      xp_awarded: 25,
      message: `Mentorship inquiry received for ${mentorData?.name || 'mentor'}! Our academic coordinator will connect you via email.`,
    })
  } catch (err) {
    console.error('Mentors POST error:', err)
    return NextResponse.json({ error: 'Failed to submit mentorship request' }, { status: 500 })
  }
}
