import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    // 1. HARD SECURITY BLOCKER: Completely disabled in production unless explicitly enabled via ALLOW_PAYMENT_SIMULATE=true
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PAYMENT_SIMULATE !== 'true') {
      return NextResponse.json(
        { error: 'Payment simulation endpoint is strictly disabled in production environments.' },
        { status: 403 }
      )
    }

    // 2. REQUIRE AUTHENTICATED ADMIN SESSION
    const supabaseUserClient = createClient()
    const { data: { user } } = await supabaseUserClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required for simulation.' }, { status: 401 })
    }

    const { data: callerProfile } = await supabaseUserClient
      .from('profiles')
      .select('role, is_admin')
      .eq('id', user.id)
      .single()

    if (!callerProfile || (callerProfile.role !== 'admin' && callerProfile.role !== 'organization_owner' && !callerProfile.is_admin)) {
      return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 })
    }

    const { userId } = await request.json().catch(() => ({}))
    const targetUserId = userId || user.id

    // 3. SECURE ADMIN PROMOTION VIA CENTRALIZED SERVICE-ROLE CLIENT
    const supabaseAdmin = getAdminClient()

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ subscription_status: 'premium' })
      .eq('id', targetUserId)
      .select()
      .single()

    if (profileError) {
      throw profileError
    }

    await supabaseAdmin
      .from('payment_requests')
      .update({ 
        status: 'approved',
        reviewed_at: new Date().toISOString()
      })
      .eq('user_id', targetUserId)
      .eq('status', 'pending')

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription successfully promoted to premium in sandbox mode.',
      profile 
    })
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: errorMessage || 'Verification simulation failed' }, { status: 500 })
  }
}
