import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase service configuration missing' }, { status: 500 })
    }

    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook secret configuration missing' }, { status: 500 })
    }

    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature header provided' }, { status: 400 })
    }

    // 1. Verify HMAC SHA256 Webhook Signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Webhook signature mismatch')
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const eventId = event.event_id || `evt_${crypto.createHash('md5').update(body).digest('hex')}`
    const eventType = event.event || 'unknown'
    const payloadHash = crypto.createHash('sha256').update(body).digest('hex')

    const supabase = createClient(supabaseUrl, supabaseKey)

    // 2. Extract payment entity
    const payment = event.payload?.payment?.entity
    const userId = payment?.notes?.user_id

    if (eventType === 'payment.captured' && !userId) {
      console.error('Missing user_id in payment notes')
      return NextResponse.json({ error: 'Missing user_id in payment payload' }, { status: 400 })
    }

    // 3. Execute Atomic Database RPC Function for Event Deduplication & Entitlement Update
    const { data: result, error: rpcError } = await supabase.rpc('process_payment_webhook_event', {
      p_event_id: eventId,
      p_event_type: eventType,
      p_payload_hash: payloadHash,
      p_user_id: userId || null,
      p_payment_id: payment?.id || null,
      p_order_id: payment?.order_id || null,
      p_amount: payment ? payment.amount / 100 : 0,
      p_currency: payment?.currency || 'INR',
      p_status: eventType === 'payment.captured' ? 'success' : 'failed',
      p_plan: 'premium_monthly'
    })

    if (rpcError) {
      // Fallback to direct transaction update if RPC function is pending migration in remote DB
      if (eventType === 'payment.captured' && userId) {
        const now = new Date()
        const subscriptionEnd = new Date(now)
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)

        await supabase.from('profiles').update({
          subscription_status: 'premium',
          subscription_end_date: subscriptionEnd.toISOString(),
          razorpay_payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          updated_at: now.toISOString(),
        }).eq('id', userId)

        await supabase.from('payment_history').upsert({
          user_id: userId,
          razorpay_order_id: payment.order_id,
          razorpay_payment_id: payment.id,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: 'success',
          plan: 'premium_monthly',
          paid_at: now.toISOString(),
        }, { onConflict: 'razorpay_payment_id' })
      }
    }

    return NextResponse.json({ received: true, status: result?.status || 'processed' })

  } catch (error: unknown) {
    console.error('Webhook error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
