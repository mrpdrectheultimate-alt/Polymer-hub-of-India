import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'

export async function POST(request: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'mock_id',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret',
    })
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const isAnnual = Boolean(body.isAnnual) || Number(body.amount) >= 1000

    // Check not already premium
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, full_name')
      .eq('id', session.user.id)
      .single()

    if (profile?.subscription_status === 'premium') {
      return NextResponse.json({ error: 'Already premium' }, { status: 400 })
    }

    // Determine plan and price in paise
    const amountInPaise = isAnnual ? 142900 : 14900
    const planName = isAnnual ? 'premium_annual' : 'premium_monthly'

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `ph_${session.user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        user_id: session.user.id,
        email: session.user.email ?? '',
        plan: planName,
      },
    })

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      user_name: profile?.full_name ?? session.user.email?.split('@')[0] ?? 'Student',
      user_email: session.user.email ?? '',
    })

  } catch (error: unknown) {
    console.error('Create order error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
