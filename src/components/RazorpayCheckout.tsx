'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import PaymentModal from '@/components/PaymentModal'

interface RazorpayInstance {
  open: () => void
  on: (event: string, callback: () => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance
  }
}

type RazorpayCheckoutProps = {
  buttonText?: string
  buttonClass?: string
  planName?: string
  amount?: number
  isAnnual?: boolean
  onSuccess?: () => void
}

export default function RazorpayCheckout({
  buttonText = 'Get Premium — ₹149/mo',
  buttonClass = 'w-full py-3.5 rounded-xl font-bold text-white bg-[#2563EB] hover:bg-blue-700 transition-all text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer',
  planName = 'Premium Engineer',
  amount = 149,
  isAnnual = false,
  onSuccess,
}: RazorpayCheckoutProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePayment = async () => {
    // 1. Check if user is logged in
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/pricing'
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
      return
    }

    setLoading(true)

    try {
      // 2. Ensure Razorpay Checkout SDK is loaded
      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        await new Promise((resolve) => {
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
          document.body.appendChild(script)
        })
      }

      // 3. Create server-side Razorpay order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ isAnnual, amount })
      })

      const orderData = await orderRes.json().catch(() => ({}))

      if (!orderRes.ok) {
        console.error('Create order error response:', orderRes.status, orderData)
        if (orderData.code === 'ALREADY_PREMIUM') {
          alert('You already have an active Premium membership!')
          router.push('/dashboard')
          setLoading(false)
          return
        }

        if (orderData.code === 'UNAUTHENTICATED') {
          router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
          setLoading(false)
          return
        }

        // Fallback to manual screenshot payment flow if keys aren't ready on server
        setIsModalOpen(true)
        setLoading(false)
        return
      }

      const { order_id, amount: orderAmount, currency, user_name, user_email, key_id: serverKey } = orderData
      const activeKey = serverKey || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TzIN4Zla77kVzF'

      if (!activeKey || activeKey.includes('xxxx') || activeKey === 'mock_id') {
        console.error('Active Razorpay key is invalid or placeholder:', activeKey)
        setIsModalOpen(true)
        setLoading(false)
        return
      }

      // 4. Configure Razorpay modal options
      const options: Record<string, unknown> = {
        key: activeKey,
        amount: orderAmount,
        currency: currency || 'INR',
        name: 'PolymerHub of India',
        description: `${planName} (${isAnnual ? 'Annual — ₹1,429/yr' : 'Monthly — ₹149/mo'})`,
        image: 'https://polymerhubofindia.com/logo.png',
        order_id,
        prefill: {
          name: user_name,
          email: user_email,
        },
        theme: {
          color: '#0A1628',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                isAnnual,
                amount,
              }),
            })

            if (verifyRes.ok) {
              onSuccess?.()
              router.push('/payment/success')
            } else {
              router.push('/payment/failed')
            }
          } catch {
            router.push('/payment/failed')
          } finally {
            setLoading(false)
          }
        },
      }

      if (!window.Razorpay) {
        setIsModalOpen(true)
        setLoading(false)
        return
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        setLoading(false)
        router.push('/payment/failed')
      })
      rzp.open()

    } catch (err) {
      console.warn('Razorpay checkout initialization error:', err)
      // Graceful fallback to UPI screenshot modal
      setIsModalOpen(true)
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handlePayment}
        disabled={loading}
        className={buttonClass + ' disabled:opacity-50 disabled:cursor-not-allowed shadow-xs'}
      >
        {loading ? (
          'Opening payment...'
        ) : (
          <span className="flex items-center gap-1.5 justify-center">
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" /> {buttonText}
          </span>
        )}
      </button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={planName}
        amount={amount}
        isAnnual={isAnnual}
        onSuccess={onSuccess}
      />
    </>
  )
}
