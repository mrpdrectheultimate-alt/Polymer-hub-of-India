import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase service configuration missing' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Webhook signature mismatch')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    console.log('Razorpay webhook event:', event.event)

    // Handle payment.captured event (successful payment)
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const userId = payment.notes?.user_id

      if (!userId) {
        console.error('No user_id in payment notes')
        return NextResponse.json({ error: 'No user_id' }, { status: 400 })
      }

      const now = new Date()
      const subscriptionEnd = new Date(now)
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)

      // Upgrade user to premium
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: 'premium',
          subscription_end_date: subscriptionEnd.toISOString(),
          razorpay_payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          updated_at: now.toISOString(),
        })
        .eq('id', userId)

      if (error) {
        console.error('Failed to upgrade user:', error)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }

      // Log in payment history
      await supabase.from('payment_history').upsert({
        user_id: userId,
        razorpay_order_id: payment.order_id,
        razorpay_payment_id: payment.id,
        amount: payment.amount / 100, // paise to rupees
        currency: payment.currency,
        status: 'success',
        plan: 'premium_monthly',
        paid_at: now.toISOString(),
      }, { onConflict: 'razorpay_payment_id' })

      console.log(`✅ Premium activated for user: ${userId}`)
    }

    // Handle payment.failed event
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity
      const userId = payment.notes?.user_id

      if (userId) {
        await supabase.from('payment_history').insert({
          user_id: userId,
          razorpay_order_id: payment.order_id,
          razorpay_payment_id: payment.id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: 'failed',
          plan: 'premium_monthly',
          paid_at: new Date().toISOString(),
        })
      }
    }

    return NextResponse.json({ received: true })

  } catch (error: unknown) {
    console.error('Webhook error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
