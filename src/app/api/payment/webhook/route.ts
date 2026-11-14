import { getAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { verifyRazorpayWebhookSignature } from '@/lib/security'
import { awardUserXP } from '@/lib/xp'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'polymerhubofindia@2026'

    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature header provided' }, { status: 400 })
    }

    // 1. Timing-Safe HMAC SHA256 Webhook Signature Verification
    const isValidSignature = verifyRazorpayWebhookSignature(body, signature, webhookSecret)
    if (!isValidSignature) {
      console.error('Webhook signature mismatch for incoming payload')
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const eventId = event.event_id || `evt_${crypto.createHash('md5').update(body).digest('hex')}`
    const eventType = event.event || 'unknown'
    const payloadHash = crypto.createHash('sha256').update(body).digest('hex')

    const supabase = getAdminClient()

    // 2. Extract payment and order entities
    const payment = event.payload?.payment?.entity
    const order = event.payload?.order?.entity
    const userId = payment?.notes?.user_id || order?.notes?.user_id || payment?.notes?.userId || order?.notes?.userId

    // If Razorpay sends a test webhook from the dashboard without user_id, return 200 OK immediately
    if (!userId) {
      console.warn(`Webhook [${eventType}] received without user_id in notes (dashboard test or sample ping). Acknowledged with 200 OK.`)
      return NextResponse.json({
        received: true,
        message: 'Webhook acknowledged. Sample or unlinked test ping received successfully.',
        event: eventType,
      }, { status: 200 })
    }

    const rawAmount = payment?.amount ?? order?.amount ?? 0
    const amountInRupees = rawAmount > 0 ? rawAmount / 100 : 149
    const isAnnualPayment = Boolean(amountInRupees >= 1000 || payment?.notes?.plan?.includes('annual') || order?.notes?.plan?.includes('annual'))
    const webhookPlan = isAnnualPayment ? 'premium_annual' : 'premium_monthly'
    const paymentId = payment?.id || (order?.id ? `ord_${order.id}` : `pay_${Date.now()}`)
    const orderId = payment?.order_id || order?.id || `ord_ref_${Date.now()}`
    const currency = payment?.currency || order?.currency || 'INR'

    // 3. Handle successful payment events: 'payment.captured' or 'order.paid'
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      // Fetch current profile to preserve unexpired subscription days
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('subscription_end_date, subscription_status')
        .eq('id', userId)
        .single()

      const now = new Date()
      const baseDate = (currentProfile?.subscription_status === 'premium' && currentProfile?.subscription_end_date && new Date(currentProfile.subscription_end_date) > now)
        ? new Date(currentProfile.subscription_end_date)
        : now

      const subscriptionEnd = new Date(baseDate)
      if (isAnnualPayment) {
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1)
      } else {
        subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)
      }

      // Execute Atomic Database RPC Function for Event Deduplication
      const { data: result, error: rpcError } = await supabase.rpc('process_payment_webhook_event', {
        p_event_id: eventId,
        p_event_type: 'payment.captured',
        p_payload_hash: payloadHash,
        p_user_id: userId,
        p_payment_id: paymentId,
        p_order_id: orderId,
        p_amount: amountInRupees,
        p_currency: currency,
        p_status: 'success',
        p_plan: webhookPlan
      })

      // Guarantee profile entitlement reflects exact plan duration (365 days for annual, 30 days for monthly)
      await supabase.from('profiles').update({
        subscription_status: 'premium',
        subscription_end_date: subscriptionEnd.toISOString(),
        razorpay_payment_id: paymentId,
        razorpay_order_id: orderId,
        updated_at: now.toISOString(),
      }).eq('id', userId)

      // Ensure payment history record is logged even if RPC was bypassed
      if (rpcError || !result || result.status !== 'success') {
        await supabase.from('payment_history').upsert({
          user_id: userId,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          amount: amountInRupees,
          currency,
          status: 'success',
          plan: webhookPlan,
          paid_at: now.toISOString(),
        }, { onConflict: 'razorpay_payment_id' })
      }

      // Award +100 XP to the user
      try {
        await awardUserXP(supabase, {
          userId,
          action: 'premium_upgrade',
          reference: paymentId,
        })
      } catch (xpErr) {
        console.warn('Webhook could not award XP:', xpErr)
      }

      return NextResponse.json({
        received: true,
        status: 'processed',
        event: eventType,
        user_id: userId,
        plan: webhookPlan,
      })
    }

    // 4. Handle failure events: 'payment.failed'
    if (eventType === 'payment.failed') {
      await supabase.from('payment_history').upsert({
        user_id: userId,
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        amount: amountInRupees,
        currency,
        status: 'failed',
        plan: webhookPlan,
        paid_at: new Date().toISOString(),
      }, { onConflict: 'razorpay_payment_id' })

      return NextResponse.json({ received: true, status: 'failure_recorded' })
    }

    // Acknowledge any other event types cleanly
    return NextResponse.json({ received: true, status: 'unhandled_event_type', event: eventType })

  } catch (error: unknown) {
    console.error('Webhook error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
