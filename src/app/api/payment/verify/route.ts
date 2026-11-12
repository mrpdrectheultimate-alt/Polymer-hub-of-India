import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { verifyRazorpaySignature } from '@/lib/security'
import { awardUserXP } from '@/lib/xp'

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
    const secret = process.env.RAZORPAY_KEY_SECRET
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

    // Calculate subscription end date (1 year for annual, 1 month for monthly)
    const isAnnualPlan = Boolean(isAnnual) || Number(amount) >= 1000
    const now = new Date()
    const subscriptionEnd = new Date(now)
    if (isAnnualPlan) {
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1)
    } else {
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)
    }

    const planCode = isAnnualPlan ? 'premium_annual' : 'premium_monthly'
    const planAmount = isAnnualPlan ? 1429 : 149

    // Upgrade user to premium via elevated admin client (protected from client manipulation)
    const adminSupabase = getAdminClient()
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
