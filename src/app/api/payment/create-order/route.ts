import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Razorpay from 'razorpay'

export async function POST(request: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    const isPlaceholder = !keyId || !keySecret || 
      keyId.includes('xxxx') || keyId === 'mock_id' || 
      keySecret.includes('xxxx') || keySecret === 'mock_secret'

    if (isPlaceholder) {
      return NextResponse.json({
        error: 'Razorpay keys not configured on server',
        code: 'GATEWAY_NOT_CONFIGURED',
      }, { status: 503 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required. Please sign in to upgrade.',
        code: 'UNAUTHENTICATED'
      }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const isAnnual = Boolean(body.isAnnual) || Number(body.amount) >= 1000

    // Check if user is already premium
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, full_name, subscription_end_date')
      .eq('id', user.id)
      .single()

    if (profile?.subscription_status === 'premium') {
      return NextResponse.json({ 
        error: 'Already premium',
        message: 'You already possess an active Premium membership.',
        code: 'ALREADY_PREMIUM',
        subscription_end_date: profile.subscription_end_date
      }, { status: 400 })
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    // Determine plan and price in paise: ₹149/mo (14900 paise) or ₹1429/yr (142900 paise)
    const amountInPaise = isAnnual ? 142900 : 14900
    const planName = isAnnual ? 'premium_annual' : 'premium_monthly'

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `ph_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: {
        user_id: user.id,
        email: user.email ?? '',
        plan: planName,
        platform: 'PolymerHub of India',
      },
    })

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
      user_name: profile?.full_name ?? user.email?.split('@')[0] ?? 'Engineer',
      user_email: user.email ?? '',
      plan: planName,
    })

  } catch (error: unknown) {
    console.error('Create order error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
