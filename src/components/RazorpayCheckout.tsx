'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode } from 'lucide-react'
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
  buttonClass = 'w-full py-3.5 rounded-xl font-bold text-white bg-[#2563EB] hover:bg-blue-700 transition-all text-sm flex items-center justify-center gap-2',
  planName = 'Premium Engineer',
  amount = 149,
  isAnnual = false,
  onSuccess,
}: RazorpayCheckoutProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePayment = async () => {
    // If Razorpay live public key is missing or in staging, directly open UPI Screenshot Payment Modal
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'mock_id') {
      setIsModalOpen(true)
      return
    }

    setLoading(true)

    try {
      if (!window.Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        await new Promise((resolve) => {
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
          document.body.appendChild(script)
        })
      }

      if (!window.Razorpay) {
        setIsModalOpen(true)
        setLoading(false)
        return
      }

      const orderRes = await fetch('/api/payment/create-order', { method: 'POST' })
      if (!orderRes.ok) {
        // Fallback to manual screenshot payment flow
        setIsModalOpen(true)
        setLoading(false)
        return
      }

      const { order_id, amount: orderAmount, currency, user_name, user_email } = await orderRes.json()

      const options: Record<string, unknown> = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency,
        name: 'PolymerHub',
        description: `${planName} — ₹${amount}`,
        image: 'https://polymer-hub-six.vercel.app/logo.png',
        order_id,
        prefill: {
          name: user_name,
          email: user_email,
        },
        theme: {
          color: '#2563EB',
          backdrop_color: '#0B172A',
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
          }
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', () => {
        setLoading(false)
        router.push('/payment/failed')
      })
      rzp.open()

    } catch {
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
            <QrCode className="w-4 h-4" /> {buttonText}
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
