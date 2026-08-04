import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/community/events — list all events (public)
// POST /api/community/events — register for an event (authenticated, +10 XP)
export async function GET() {
  const supabase = createClient()

  const { data: events, error } = await supabase
    .from('community_events')
    .select('*')
    .order('event_date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ events })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()

  // Verify authentication
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { event_id } = body

  if (!event_id) {
    return NextResponse.json({ error: 'event_id is required' }, { status: 400 })
  }

  // Register for event (unique constraint prevents double-registration)
  const { data: registration, error: regError } = await supabase
    .from('event_registrations')
    .insert({ user_id: session.user.id, event_id })
    .select()
    .single()

  if (regError) {
    if (regError.code === '23505') {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 409 })
    }
    return NextResponse.json({ error: regError.message }, { status: 500 })
  }

  // Award +10 XP for registering
  const { error: xpError } = await supabase.rpc('increment_xp', {
    p_user_id: session.user.id,
    p_amount: 10,
    p_reason: 'webinar_registration',
  })

  if (xpError) {
    // XP award is best-effort — don't fail the registration
    console.warn('XP award failed:', xpError.message)
  }

  return NextResponse.json({
    success: true,
    registration,
    xp_awarded: 10,
    message: 'Successfully registered! +10 XP awarded.',
  })
}
