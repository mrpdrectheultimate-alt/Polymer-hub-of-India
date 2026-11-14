'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CheckCircle, ArrowRight, BookOpen, Brain, Zap, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function PaymentSuccessPage() {
  const [show, setShow] = useState(false)
  const [planDetails, setPlanDetails] = useState<{
    amount: number
    planLabel: string
    endDate: string | null
  }>({
    amount: 149,
    planLabel: 'Monthly Plan',
    endDate: null,
  })

  useEffect(() => {
    setTimeout(() => setShow(true), 100)

    async function fetchPlan() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_end_date')
        .eq('id', user.id)
        .single()

      const { data: history } = await supabase
        .from('payment_history')
        .select('amount, plan')
        .eq('user_id', user.id)
        .order('paid_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const amount = Number(history?.amount) || 149
      const isAnnual = amount >= 1000 || history?.plan?.includes('annual')
      
      setPlanDetails({
        amount,
        planLabel: isAnnual ? 'Annual Pro Plan' : 'Monthly Plan',
        endDate: profile?.subscription_end_date
          ? new Date(profile.subscription_end_date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : null,
      })
    }

    fetchPlan()
  }, [])

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className={`max-w-md w-full transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

        {/* Success card */}
        <div className="border-4 border-ink overflow-hidden" style={{ boxShadow: '6px 6px 0px 0px #15803D' }}>
          <div className="border-b-4 border-ink px-6 py-5 bg-green text-center">
            <CheckCircle className="w-12 h-12 text-white mx-auto mb-2" />
            <h1 className="font-display text-3xl font-black text-white">Premium Activated!</h1>
          </div>

          <div className="p-6 bg-canvas text-center">
            <div className="font-display text-5xl font-black text-green mb-1">
              ₹{planDetails.amount}
            </div>
            <p className="font-mono text-xs text-ink/70 font-semibold uppercase tracking-wider mb-1">
              {planDetails.planLabel}
            </p>
            {planDetails.endDate && (
              <p className="font-mono text-[10px] text-ink/50 uppercase tracking-wider mb-5">
                Active until {planDetails.endDate}
              </p>
            )}

            <div className="space-y-2 mb-6 text-left">
              {[
                { icon: BookOpen, text: 'All 216 lessons across 19 subjects — unlocked', color: '#1D4ED8' },
                { icon: Brain, text: 'Unlimited AI Tutor queries — zero limits', color: '#15803D' },
                { icon: Zap, text: 'GATE XE5 mock tests & industrial calculators', color: '#CA8A04' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.text} className="flex items-center gap-3 border-4 border-ink p-3" style={{ backgroundColor: item.color + '15' }}>
                    <div className="w-7 h-7 border-2 border-ink flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color }}>
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-ink">{item.text}</span>
                  </div>
                )
              })}
            </div>

            <Link href="/dashboard" className="cn-btn-black w-full justify-center text-sm mb-3">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/subjects" className="block font-mono text-[10px] text-ink/40 hover:text-ink uppercase tracking-wider transition-colors">
              Browse all subjects →
            </Link>
          </div>
        </div>

        <p className="font-mono text-[9px] text-ink/30 text-center mt-4 uppercase tracking-wider">
          Receipt sent to your registered email · Cancel anytime from profile
        </p>
      </div>
    </div>
  )
}
