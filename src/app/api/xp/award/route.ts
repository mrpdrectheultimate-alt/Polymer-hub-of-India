import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { awardUserXP } from '@/lib/xp'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json()
    const action = body.action
    const reference = body.reference ?? body.referenceId ?? body.simulationId ?? null

    const result = await awardUserXP(supabase, {
      userId: session.user.id,
      action,
      reference
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to award XP' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      xp_earned: result.xp_earned,
      total_xp: result.total_xp,
      xp_points: result.total_xp,
      new_badges: result.new_badges,
      streak: result.streak,
    })

  } catch (error) {
    console.error('XP award error:', error)
    const errMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errMessage }, { status: 500 })
  }
}
