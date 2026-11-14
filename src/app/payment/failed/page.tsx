'use client'

import Link from 'next/link'
import { XCircle, RotateCcw } from 'lucide-react'

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '6px 6px 0px 0px #EA580C' }}>
          <div className="border-b-4 border-ink px-6 py-5 bg-orange text-center">
            <XCircle className="w-12 h-12 text-white mx-auto mb-2" />
            <h1 className="font-display text-3xl font-black text-white">Payment Failed</h1>
          </div>
          <div className="p-6 bg-canvas text-center">
            <p className="text-ink/80 text-sm mb-4 leading-relaxed font-sans">
              Your payment session was interrupted or declined by your bank.
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-left text-xs text-amber-900 mb-6 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-950">
                <span>🛡️</span> Debited from your bank?
              </p>
              <p className="text-amber-800 leading-normal">
                If money was deducted from your UPI or card, Razorpay&apos;s webhook will automatically verify and activate your Premium membership within 1–2 minutes. Check your dashboard to confirm.
              </p>
            </div>
            <div className="space-y-3">
              <Link href="/pricing" className="cn-btn-black w-full justify-center text-sm">
                <RotateCcw className="w-4 h-4" /> Try Again Safely
              </Link>
              <Link href="/dashboard" className="block font-mono text-xs text-ink/60 hover:text-ink uppercase tracking-wider transition-colors text-center py-2 border border-ink/20 hover:border-ink">
                Check Membership in Dashboard →
              </Link>
              <a
                href="https://wa.me/918125358468?text=Hello%20PolymerHub%20Support,%20I%20had%20an%20issue%20with%20my%20payment"
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-[10px] text-ink/40 hover:text-ink transition-colors text-center"
              >
                Need Help? WhatsApp Founder Support: +91 81253 58468
              </a>
            </div>
          </div>
        </div>
        <p className="font-mono text-[9px] text-ink/30 text-center mt-4 uppercase tracking-wider">
          Need help? Contact us — no payment was deducted
        </p>
      </div>
    </div>
  )
}
