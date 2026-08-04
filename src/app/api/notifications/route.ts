// src/app/api/notifications/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
}

if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    'mailto:admin@polymerhub.in',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  )
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json()
    const { action } = body

    if (action === 'subscribe') {
      const { subscription } = body
      if (!subscription) return NextResponse.json({ error: 'Subscription missing' }, { status: 400 })

      const { error } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id: session.user.id,
          subscription
        })

      if (error && error.code !== '23505') { // Ignore duplicate keys
        throw error
      }

      return NextResponse.json({ success: true })
    }

    if (action === 'send') {
      const { targetUserId, title, body: noteBody, url } = body
      if (!targetUserId) return NextResponse.json({ error: 'Target user ID missing' }, { status: 400 })

      // Get user's push subscriptions
      const { data: subscriptions, error } = await supabase
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', targetUserId)

      if (error) throw error

      if (!subscriptions || subscriptions.length === 0) {
        return NextResponse.json({ success: true, message: 'No subscriptions found for user' })
      }

      const payload = JSON.stringify({
        title: title || 'PolymerHub Alert',
        body: noteBody || 'You have a new update.',
        url: url || '/dashboard'
      })

      const notifications = subscriptions.map((sub: { subscription: webpush.PushSubscription }) =>
        webpush.sendNotification(sub.subscription, payload)
          .catch(err => {
            console.error('Failed to send notification to one subscription:', err)
            // If subscription has expired or is invalid, delete it
            if (err.statusCode === 410 || err.statusCode === 404) {
              supabase
                .from('push_subscriptions')
                .delete()
                .eq('user_id', targetUserId)
                .eq('subscription', JSON.stringify(sub.subscription))
                .then(() => console.log('Cleaned up stale push subscription.'))
            }
          })
      )

      await Promise.all(notifications)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Notification API error:', error)
    const errMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errMessage }, { status: 500 })
  }
}
