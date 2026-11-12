'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  CreditCard,
  IndianRupee,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  AlertCircle,
  FileImage,
  Copy,
  Check
} from 'lucide-react'

interface PaymentHistoryItem {
  id: string
  user_id: string
  razorpay_order_id: string
  razorpay_payment_id: string
  amount: number
  currency: string
  status: string
  plan: string
  paid_at: string
}

interface PaymentRequestItem {
  id: string
  user_id: string
  amount: number
  screenshot_url: string
  status: string
  created_at: string
  metadata?: {
    utr?: string
    user_email?: string
    plan?: string
    submitted_at?: string
  }
}

interface SubscriberProfile {
  id: string
  full_name: string | null
  email: string | null
  subscription_status: string
  subscription_end_date: string | null
  razorpay_payment_id: string | null
  created_at: string
}

export default function AdminPaymentsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'history' | 'requests' | 'subscribers'>('history')
  const [searchTerm, setSearchTerm] = useState('')

  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscribersCount: 0,
    pendingRequestsCount: 0,
    totalTransactions: 0,
  })

  const [history, setHistory] = useState<PaymentHistoryItem[]>([])
  const [requests, setRequests] = useState<PaymentRequestItem[]>([])
  const [subscribers, setSubscribers] = useState<SubscriberProfile[]>([])

  // Grant desk form state
  const [grantEmail, setGrantEmail] = useState('')
  const [grantDays, setGrantDays] = useState(30)
  const [grantLoading, setGrantLoading] = useState(false)
  const [grantMessage, setGrantMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Copy helper
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/payments')
      if (res.status === 401 || res.status === 403) {
        setError('Forbidden: Administrative access required to view financial records.')
        setLoading(false)
        return
      }
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setStats(data.stats || { totalRevenue: 0, activeSubscribersCount: 0, pendingRequestsCount: 0, totalTransactions: 0 })
        setHistory(data.history || [])
        setRequests(data.requests || [])
        setSubscribers(data.subscribers || [])
      }
    } catch (err) {
      console.error('Failed to load admin payments:', err)
      setError('An error occurred connecting to the admin payments service.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleGrantPremium = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!grantEmail.trim()) return

    setGrantLoading(true)
    setGrantMessage(null)

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'grant_premium',
          email: grantEmail.trim(),
          days: grantDays,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setGrantMessage({ type: 'success', text: data.message })
        setGrantEmail('')
        loadData()
      } else {
        setGrantMessage({ type: 'error', text: data.error || 'Failed to grant premium access.' })
      }
    } catch {
      setGrantMessage({ type: 'error', text: 'Network failure while granting entitlement.' })
    } finally {
      setGrantLoading(false)
    }
  }

  const handleRevokePremium = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to revoke Premium status for ${email || 'this user'}?`)) return

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'revoke_premium',
          userId,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        loadData()
      } else {
        alert(data.error || 'Failed to revoke premium.')
      }
    } catch {
      alert('Error communicating with server.')
    }
  }

  const handleRequestAction = async (requestId: string, action: 'approve_request' | 'reject_request') => {
    const actionLabel = action === 'approve_request' ? 'Approve & Activate' : 'Reject'
    if (!confirm(`Are you sure you want to ${actionLabel} this payment request?`)) return

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          requestId,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        loadData()
      } else {
        alert(data.error || 'Failed to update request.')
      }
    } catch {
      alert('Error updating payment request.')
    }
  }

  // Filtered lists based on search
  const filteredHistory = history.filter((h) =>
    (h.razorpay_payment_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.razorpay_order_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.user_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredRequests = requests.filter((r) =>
    (r.metadata?.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.metadata?.utr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.user_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSubscribers = subscribers.filter((s) =>
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas p-6 md:p-12 flex items-center justify-center">
        <div className="border-4 border-ink p-8 bg-white shadow-hard-md flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-ink animate-spin" />
          <span className="font-mono text-sm font-bold uppercase tracking-wider">
            Loading Financial & Payment Desk...
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-canvas p-6 md:p-12 flex items-center justify-center">
        <div className="border-4 border-ink p-8 bg-white shadow-hard-md max-w-md text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-orange mx-auto" />
          <h2 className="font-display text-2xl font-black text-ink uppercase">Access Prohibited</h2>
          <p className="font-mono text-xs text-ink/70">{error}</p>
          <div className="pt-2 flex justify-center gap-3">
            <Link href="/admin" className="cn-btn-black text-xs">
              &larr; Admin Command
            </Link>
            <Link href="/login" className="cn-btn-white text-xs">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas p-4 sm:p-6 md:p-12 text-ink">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b-4 border-ink pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-sm inline-flex mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Treasury & Entitlements Governance
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black text-ink uppercase tracking-tight flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-[#2563EB]" />
              Payments & Subscriptions Desk
            </h1>
            <p className="font-mono text-xs text-ink/60 mt-1">
              Live Razorpay Gateway Orders, UPI Screenshot Verifications & Entitlement Overrides
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="cn-btn-white text-xs flex items-center gap-1.5 cursor-pointer"
              title="Refresh Records"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <Link href="/admin" className="cn-btn-black text-xs flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Admin Hub
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-4 border-ink p-4 bg-white shadow-hard-sm">
            <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider flex items-center justify-between">
              Total Revenue
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="font-display text-3xl font-black text-emerald-600 mt-1">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] font-mono text-ink/60 mt-1">Verified gross earnings</div>
          </div>

          <div className="border-4 border-ink p-4 bg-white shadow-hard-sm">
            <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider flex items-center justify-between">
              Active Subscribers
              <Users className="w-3.5 h-3.5 text-[#2563EB]" />
            </div>
            <div className="font-display text-3xl font-black text-ink mt-1">
              {stats.activeSubscribersCount}
            </div>
            <div className="text-[10px] font-mono text-blue-600 font-bold mt-1">
              Premium tier users
            </div>
          </div>

          <div className="border-4 border-ink p-4 bg-white shadow-hard-sm">
            <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider flex items-center justify-between">
              Pending Proofs
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className={`font-display text-3xl font-black mt-1 ${stats.pendingRequestsCount > 0 ? 'text-amber-600' : 'text-ink'}`}>
              {stats.pendingRequestsCount}
            </div>
            <div className="text-[10px] font-mono text-ink/60 mt-1">
              {stats.pendingRequestsCount > 0 ? 'Awaiting verification' : 'Queue all clear'}
            </div>
          </div>

          <div className="border-4 border-ink p-4 bg-white shadow-hard-sm">
            <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider flex items-center justify-between">
              All Orders Logged
              <CreditCard className="w-3.5 h-3.5 text-ink" />
            </div>
            <div className="font-display text-3xl font-black text-ink mt-1">
              {stats.totalTransactions}
            </div>
            <div className="text-[10px] font-mono text-ink/60 mt-1">Razorpay + Manual</div>
          </div>
        </div>

        {/* Quick Manual Grant Entitlement Box */}
        <div className="border-4 border-ink p-6 bg-white shadow-hard-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="font-display text-lg font-black text-ink uppercase">
                Instant Entitlement Grant & Override
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              For direct UPI transfers, institutional demos, or student waivers
            </span>
          </div>

          <form onSubmit={handleGrantPremium} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="email"
              placeholder="Enter student email (e.g. user@gmail.com)"
              value={grantEmail}
              onChange={(e) => setGrantEmail(e.target.value)}
              className="flex-1 border-2 border-ink px-4 py-2.5 font-mono text-xs focus:outline-none focus:bg-amber-50"
              required
            />
            <select
              value={grantDays}
              onChange={(e) => setGrantDays(Number(e.target.value))}
              aria-label="Select premium duration"
              className="border-2 border-ink px-3 py-2.5 font-mono text-xs bg-white focus:outline-none"
            >
              <option value={30}>30 Days (Monthly — ₹149)</option>
              <option value={365}>365 Days (Annual — ₹1,429)</option>
              <option value={7}>7 Days (Trial Pass)</option>
              <option value={730}>2 Years (Campus Honor)</option>
            </select>
            <button
              type="submit"
              disabled={grantLoading || !grantEmail.trim()}
              className="cn-btn-black text-xs shrink-0 cursor-pointer disabled:opacity-50"
            >
              {grantLoading ? 'Granting...' : 'Grant Premium Access'}
            </button>
          </form>

          {grantMessage && (
            <div
              className={`p-3 border-2 border-ink font-mono text-xs flex items-center gap-2 ${
                grantMessage.type === 'success' ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'
              }`}
            >
              {grantMessage.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{grantMessage.text}</span>
            </div>
          )}
        </div>

        {/* Tab Selection & Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b-2 border-ink pb-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 border-2 border-ink transition-all cursor-pointer ${
                  activeTab === 'history' ? 'bg-ink text-white shadow-hard-xs' : 'bg-white text-ink hover:bg-amber-50'
                }`}
              >
                Transactions History ({history.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('requests')}
                className={`font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 border-2 border-ink transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'requests' ? 'bg-ink text-white shadow-hard-xs' : 'bg-white text-ink hover:bg-amber-50'
                }`}
              >
                Manual Proofs ({requests.length})
                {stats.pendingRequestsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('subscribers')}
                className={`font-mono text-xs font-bold uppercase tracking-wider px-4 py-2 border-2 border-ink transition-all cursor-pointer ${
                  activeTab === 'subscribers' ? 'bg-ink text-white shadow-hard-xs' : 'bg-white text-ink hover:bg-amber-50'
                }`}
              >
                Active Subscribers ({subscribers.length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Search email, UTR, or payment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 border-2 border-ink font-mono text-xs bg-white w-full sm:w-64 focus:outline-none"
              />
            </div>
          </div>

          {/* TAB 1: Transactions History */}
          {activeTab === 'history' && (
            <div className="border-4 border-ink bg-white shadow-hard-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-canvas border-b-2 border-ink text-ink font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Payment ID / UTR</th>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-ink/10">
                    {filteredHistory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-ink/50 font-mono text-xs">
                          No payment records found.
                        </td>
                      </tr>
                    ) : (
                      filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="p-3 text-ink/70 whitespace-nowrap">
                            {new Date(item.paid_at).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3 font-bold text-ink">
                            ₹{item.amount}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 border border-ink/20 rounded-sm uppercase text-[10px]">
                              {item.plan}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-ink truncate max-w-[150px]">{item.razorpay_payment_id}</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(item.razorpay_payment_id, item.id + '_pay')}
                                className="p-1 hover:bg-slate-100 rounded text-slate-500"
                                title="Copy ID"
                              >
                                {copiedId === item.id + '_pay' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-ink/60 text-[11px] truncate max-w-[150px]">
                            {item.razorpay_order_id}
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle className="w-3 h-3" /> {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Pending Manual Requests */}
          {activeTab === 'requests' && (
            <div className="border-4 border-ink bg-white shadow-hard-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-canvas border-b-2 border-ink text-ink font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Submitted</th>
                      <th className="p-3">User Email</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">12-Digit UTR</th>
                      <th className="p-3">Screenshot Proof</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-ink/10">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-ink/50 font-mono text-xs">
                          No manual payment requests recorded.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="p-3 text-ink/70 whitespace-nowrap">
                            {new Date(req.created_at).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-3 font-bold text-ink">
                            {req.metadata?.user_email || req.user_id.slice(0, 10)}
                          </td>
                          <td className="p-3 font-bold text-ink">
                            ₹{req.amount}
                          </td>
                          <td className="p-3">
                            {req.metadata?.utr ? (
                              <code className="bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-900">
                                {req.metadata.utr}
                              </code>
                            ) : (
                              <span className="text-slate-400">None</span>
                            )}
                          </td>
                          <td className="p-3">
                            {req.screenshot_url && req.screenshot_url.startsWith('http') ? (
                              <a
                                href={req.screenshot_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[#2563EB] hover:underline font-bold"
                              >
                                <FileImage className="w-3.5 h-3.5" /> View Proof <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Direct submission</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                req.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : req.status === 'rejected'
                                  ? 'bg-red-100 text-red-900 border border-red-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {req.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleRequestAction(req.id, 'approve_request')}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-[10px] font-bold rounded cursor-pointer transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRequestAction(req.id, 'reject_request')}
                                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-mono text-[10px] font-bold rounded cursor-pointer transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-ink/40 text-[10px] uppercase">Processed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Active Subscribers */}
          {activeTab === 'subscribers' && (
            <div className="border-4 border-ink bg-white shadow-hard-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-canvas border-b-2 border-ink text-ink font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3">Member</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Expires On</th>
                      <th className="p-3">Gateway Payment ID</th>
                      <th className="p-3 text-right">Revoke Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-ink/10">
                    {filteredSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-ink/50 font-mono text-xs">
                          No active premium subscribers found.
                        </td>
                      </tr>
                    ) : (
                      filteredSubscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="p-3 font-bold text-ink">
                            {sub.full_name || 'Engineer'}
                          </td>
                          <td className="p-3 text-ink">
                            {sub.email || 'N/A'}
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                              <CheckCircle className="w-3 h-3" /> {sub.subscription_status}
                            </span>
                          </td>
                          <td className="p-3 text-ink/70">
                            {sub.subscription_end_date ? (
                              new Date(sub.subscription_end_date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            ) : (
                              <span className="text-slate-400">Lifetime / Uncapped</span>
                            )}
                          </td>
                          <td className="p-3 text-[11px] text-ink/60 truncate max-w-[150px]">
                            {sub.razorpay_payment_id || 'Manual Admin Grant'}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRevokePremium(sub.id, sub.email || '')}
                              className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-mono text-[10px] font-bold rounded border border-red-300 cursor-pointer transition-colors"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

