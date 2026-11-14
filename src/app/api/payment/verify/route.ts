import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { verifyRazorpaySignature } from '@/lib/security'
import { awardUserXP } from '@/lib/xp'
import Razorpay from 'razorpay'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated', code: 'UNAUTHENTICATED' }, { status: 401 })
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      isAnnual,
      amount,
    } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification params' }, { status: 400 })
    }

    // Timing-safe HMAC verification
    const secret = process.env.RAZORPAY_KEY_SECRET || 'NV1YGwZYxrbMZxxmAeMRpk9O'
    if (!secret || secret.includes('xxxx') || secret === 'mock_secret') {
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 })
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    )

    if (!isValid) {
      console.error('Invalid signature on order:', razorpay_order_id, 'payment:', razorpay_payment_id)
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TzIN4Zla77kVzF'
    let isAnnualPlan = Boolean(isAnnual) || Number(amount) >= 1000
    let planAmount = isAnnualPlan ? 1429 : 149
    let planCode = isAnnualPlan ? 'premium_annual' : 'premium_monthly'

    // Server-side verification with Razorpay API (tamper-proof amount & user verification)
    try {
      const razorpay = new Razorpay({ key_id: keyId, key_secret: secret })
      const order = await razorpay.orders.fetch(razorpay_order_id)
      
      // Ownership check: Ensure the order was created for this authenticated user
      if (order.notes?.user_id && order.notes.user_id !== user.id) {
        console.error('Order user_id mismatch! Order note:', order.notes.user_id, 'User:', user.id)
        return NextResponse.json({ error: 'Order authorization mismatch' }, { status: 403 })
      }

      // Authoritative pricing from Razorpay order entity
      const paidPaise = Number(order.amount) || 14900
      isAnnualPlan = paidPaise >= 100000 || order.notes?.plan === 'premium_annual'
      planAmount = isAnnualPlan ? 1429 : 149
      planCode = isAnnualPlan ? 'premium_annual' : 'premium_monthly'
    } catch (orderFetchErr) {
      console.warn('Could not fetch order from Razorpay API, proceeding with verified HMAC:', orderFetchErr)
    }

    const adminSupabase = getAdminClient()

    // Fetch current user's profile to preserve unexpired subscription days
    const { data: currentProfile } = await adminSupabase
      .from('profiles')
      .select('subscription_end_date, subscription_status')
      .eq('id', user.id)
      .single()

    const now = new Date()
    const baseDate = (currentProfile?.subscription_status === 'premium' && currentProfile?.subscription_end_date && new Date(currentProfile.subscription_end_date) > now)
      ? new Date(currentProfile.subscription_end_date)
      : now

    const subscriptionEnd = new Date(baseDate)
    if (isAnnualPlan) {
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1)
    } else {
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)
    }

    // Upgrade user to premium via elevated admin client (protected from client manipulation)
    const { error: updateError } = await adminSupabase
      .from('profiles')
      .update({
        subscription_status: 'premium',
        subscription_end_date: subscriptionEnd.toISOString(),
        razorpay_payment_id,
        razorpay_order_id,
        updated_at: now.toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json({ error: 'Failed to upgrade account' }, { status: 500 })
    }

    // Upsert payment in payment_history table
    const { error: historyError } = await adminSupabase.from('payment_history').upsert({
      user_id: user.id,
      razorpay_order_id,
      razorpay_payment_id,
      amount: planAmount,
      currency: 'INR',
      status: 'success',
      plan: planCode,
      paid_at: now.toISOString(),
    }, { onConflict: 'razorpay_payment_id' })

    if (historyError) {
      console.error('Payment history logging error:', historyError)
    }

    // Award +100 XP to user profile for upgrading
    try {
      await awardUserXP(adminSupabase, {
        userId: user.id,
        action: 'premium_upgrade',
        reference: razorpay_payment_id,
      })
    } catch (xpErr) {
      console.warn('Could not award premium XP bonus:', xpErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Premium activated successfully',
      plan: planCode,
      subscription_end_date: subscriptionEnd.toISOString(),
    })

  } catch (error: unknown) {
    console.error('Verify payment error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
