import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { verifyRazorpaySignature } from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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
    if (!secret) {
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 })
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      secret
    )

    if (!isValid) {
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

    // Upgrade user to premium via elevated admin client (protected from client manipulation)
    const adminSupabase = getAdminClient()
    const { error: updateError } = await adminSupabase
      .from('profiles')
      .update({
        subscription_status: 'premium',
        subscription_end_date: subscriptionEnd.toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json({ error: 'Failed to upgrade account' }, { status: 500 })
    }

    // Log payment in payment_history table
    const { error: historyError } = await adminSupabase.from('payment_history').insert({
      user_id: user.id,
      razorpay_order_id,
      razorpay_payment_id,
      amount: isAnnualPlan ? 1429 : 149,
      currency: 'INR',
      status: 'success',
      plan: isAnnualPlan ? 'premium_annual' : 'premium_monthly',
      paid_at: now.toISOString(),
    })

    if (historyError) {
      console.error('Payment history logging error:', historyError)
      // We don't block the response since premium was successfully activated on the profile
    }

    return NextResponse.json({ success: true, message: 'Premium activated successfully' })

  } catch (error: unknown) {
    console.error('Verify payment error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
