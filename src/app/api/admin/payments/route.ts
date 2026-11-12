import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { isUserAdmin } from '@/lib/admin'
import { awardUserXP } from '@/lib/xp'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_admin')
      .eq('id', user.id)
      .single()

    if (!isUserAdmin(user, profile)) {
      return NextResponse.json({ error: 'Forbidden — Admin clearance required' }, { status: 403 })
    }

    const adminDb = getAdminClient()

    // Fetch transactions, requests, and active subscribers in parallel
    const [
      { data: history, error: historyErr },
      { data: requests, error: requestsErr },
      { data: subscribers, error: subErr },
    ] = await Promise.all([
      adminDb
        .from('payment_history')
        .select('*')
        .order('paid_at', { ascending: false })
        .limit(100),
      adminDb
        .from('payment_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100),
      adminDb
        .from('profiles')
        .select('id, full_name, email, subscription_status, subscription_end_date, razorpay_payment_id, created_at')
        .eq('subscription_status', 'premium')
        .order('subscription_end_date', { ascending: false })
        .limit(100),
    ])

    if (historyErr || requestsErr || subErr) {
      console.error('Error fetching admin payments data:', { historyErr, requestsErr, subErr })
    }

    // Compute aggregate figures
    const totalTransactions = history?.length ?? 0
    const totalRevenue = (history ?? [])
      .filter((h) => h.status === 'success' || h.status === 'captured')
      .reduce((sum, h) => sum + (Number(h.amount) || 0), 0)

    const pendingRequestsCount = (requests ?? []).filter((r) => r.status === 'pending').length
    const activeSubscribersCount = subscribers?.length ?? 0

    return NextResponse.json({
      stats: {
        totalRevenue,
        activeSubscribersCount,
        pendingRequestsCount,
        totalTransactions,
      },
      history: history ?? [],
      requests: requests ?? [],
      subscribers: subscribers ?? [],
    })

  } catch (error: unknown) {
    console.error('Admin payments GET error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_admin')
      .eq('id', user.id)
      .single()

    if (!isUserAdmin(user, profile)) {
      return NextResponse.json({ error: 'Forbidden — Admin clearance required' }, { status: 403 })
    }

    const body = await req.json().catch(() => ({}))
    const { action } = body
    const adminDb = getAdminClient()
    const now = new Date()

    if (action === 'grant_premium') {
      const { email, days = 30 } = body
      if (!email || typeof email !== 'string') {
        return NextResponse.json({ error: 'User email is required' }, { status: 400 })
      }

      // Find user by email in profiles
      const { data: targetProfile, error: findErr } = await adminDb
        .from('profiles')
        .select('id, email, full_name')
        .ilike('email', email.trim())
        .single()

      if (findErr || !targetProfile) {
        return NextResponse.json({ error: `User with email "${email}" not found in database.` }, { status: 404 })
      }

      const endDate = new Date(now)
      endDate.setDate(endDate.getDate() + Number(days))

      const planType = Number(days) > 60 ? 'premium_annual' : 'premium_monthly'

      const { error: updErr } = await adminDb
        .from('profiles')
        .update({
          subscription_status: 'premium',
          subscription_end_date: endDate.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('id', targetProfile.id)

      if (updErr) {
        return NextResponse.json({ error: updErr.message }, { status: 500 })
      }

      // Record in payment history as manual grant
      await adminDb.from('payment_history').insert({
        user_id: targetProfile.id,
        razorpay_order_id: `manual_grant_${Date.now()}`,
        razorpay_payment_id: `admin_override_${user.id.slice(0, 6)}_${Date.now()}`,
        amount: Number(days) > 60 ? 1429 : 149,
        currency: 'INR',
        status: 'success',
        plan: planType,
        paid_at: now.toISOString(),
      })

      // Award XP
      try {
        await awardUserXP(adminDb, {
          userId: targetProfile.id,
          action: 'premium_upgrade',
          reference: 'admin_manual_grant',
        })
      } catch (e) {
        console.warn('Could not award XP on manual grant:', e)
      }

      return NextResponse.json({
        success: true,
        message: `Premium granted to ${targetProfile.email} until ${endDate.toDateString()}`,
      })
    }

    if (action === 'revoke_premium') {
      const { userId } = body
      if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 })
      }

      const { error: revErr } = await adminDb
        .from('profiles')
        .update({
          subscription_status: 'free',
          subscription_end_date: null,
          updated_at: now.toISOString(),
        })
        .eq('id', userId)

      if (revErr) {
        return NextResponse.json({ error: revErr.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Premium status revoked.' })
    }

    if (action === 'approve_request') {
      const { requestId } = body
      if (!requestId) {
        return NextResponse.json({ error: 'requestId is required' }, { status: 400 })
      }

      const { data: request, error: fetchErr } = await adminDb
        .from('payment_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (fetchErr || !request) {
        return NextResponse.json({ error: 'Payment request not found' }, { status: 404 })
      }

      const isAnnual = Number(request.amount) >= 1000
      const endDate = new Date(now)
      if (isAnnual) {
        endDate.setFullYear(endDate.getFullYear() + 1)
      } else {
        endDate.setMonth(endDate.getMonth() + 1)
      }

      // Mark request approved
      await adminDb
        .from('payment_requests')
        .update({ status: 'approved', updated_at: now.toISOString() })
        .eq('id', requestId)

      // Elevate profile
      await adminDb
        .from('profiles')
        .update({
          subscription_status: 'premium',
          subscription_end_date: endDate.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('id', request.user_id)

      // Record in history
      await adminDb.from('payment_history').insert({
        user_id: request.user_id,
        razorpay_order_id: `manual_req_${requestId}`,
        razorpay_payment_id: request.metadata?.utr ? `utr_${request.metadata.utr}` : `manual_verified_${requestId}`,
        amount: request.amount || (isAnnual ? 1429 : 149),
        currency: 'INR',
        status: 'success',
        plan: isAnnual ? 'premium_annual' : 'premium_monthly',
        paid_at: now.toISOString(),
      })

      // Award XP
      try {
        await awardUserXP(adminDb, {
          userId: request.user_id,
          action: 'premium_upgrade',
          reference: `req_${requestId}`,
        })
      } catch (e) {
        console.warn('Could not award XP on approval:', e)
      }

      return NextResponse.json({ success: true, message: 'Request approved and Premium activated.' })
    }

    if (action === 'reject_request') {
      const { requestId } = body
      if (!requestId) {
        return NextResponse.json({ error: 'requestId is required' }, { status: 400 })
      }

      await adminDb
        .from('payment_requests')
        .update({ status: 'rejected', updated_at: now.toISOString() })
        .eq('id', requestId)

      return NextResponse.json({ success: true, message: 'Request marked as rejected.' })
    }

    return NextResponse.json({ error: `Unknown action: "${action}"` }, { status: 400 })

  } catch (error: unknown) {
    console.error('Admin payments POST error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

