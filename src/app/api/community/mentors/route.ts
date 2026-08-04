import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/community/mentors — list active mentors (public)
// POST /api/community/mentors — submit a mentorship match request (authenticated, +25 XP on approval)
export async function GET() {
  const supabase = createClient()

  const { data: mentors, error } = await supabase
    .from('mentorship_profiles')
    .select('id, name, company, designation, bio, experience_years, specialization, avatar_initials')
    .eq('is_active', true)
    .order('experience_years', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ mentors })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  // Verify authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { mentor_id, message } = body

  if (!mentor_id) {
    return NextResponse.json({ error: 'mentor_id is required' }, { status: 400 })
  }

  // Submit mentorship match request
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

  if (matchError) {
    if (matchError.code === '23505') {
      return NextResponse.json({ error: 'Match request already submitted for this mentor' }, { status: 409 })
    }
    return NextResponse.json({ error: matchError.message }, { status: 500 })
  }

  // Award +25 XP for submitting a mentorship request (engagement reward)
  const { error: xpError } = await supabase.rpc('increment_xp', {
    p_user_id: session.user.id,
    p_amount: 25,
    p_reason: 'mentorship_request',
  })

  if (xpError) {
    console.warn('XP award failed:', xpError.message)
  }

  return NextResponse.json({
    success: true,
    match,
    xp_awarded: 25,
    message: 'Match request submitted! +25 XP awarded. The mentor will contact you within 48 hours.',
  })
}
