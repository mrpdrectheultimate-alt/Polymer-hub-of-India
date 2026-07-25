import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

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
    const { data: { session } } = await supabaseUserClient.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Authentication required for simulation.' }, { status: 401 })
    }

    const { data: callerProfile } = await supabaseUserClient
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!callerProfile || (callerProfile.role !== 'admin' && callerProfile.role !== 'organization_owner')) {
      return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 })
    }

    const { userId } = await request.json()
    const targetUserId = userId || session.user.id

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase environment configuration error' }, { status: 500 })
    }

    // 3. SECURE ADMIN PROMOTION
    const supabaseAdmin = createAdminClient(supabaseUrl, supabaseServiceKey)

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
