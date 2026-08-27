'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { 
  Mail, 
  Shield, 
  CheckCircle, 
  Lock, 
  Phone,
  ArrowRight, 
  Cpu, 
  BookOpen, 
  Users, 
  AlertCircle,
  Eye,
  EyeOff,
  Atom
} from 'lucide-react'

// Material Preset data for the interactive live telemetry widget on the left
const MATERIAL_PRESETS = [
  {
    id: 'pp',
    name: 'Polypropylene (PP)',
    short: 'PP Homopolymer',
    tag: 'Automotive / Packaging',
    color: '#3B82F6',
    tensileStrength: '34.5 MPa',
    flexuralModulus: '1.45 GPa',
    mfr: '12.0 g/10min',
    hdt: '95 °C',
    yieldStrain: '9.2%',
    clampForce: '185 Tonnes',
    curvePath: 'M 10 130 C 30 50, 60 40, 90 42 C 140 46, 180 50, 220 54',
    yieldPoint: { x: 90, y: 42 }
  },
  {
    id: 'pa66',
    name: 'Polyamide 6,6 (Nylon)',
    short: 'PA66 30% GF',
    tag: 'High Mechanical / Thermal',
    color: '#10B981',
    tensileStrength: '82.0 MPa',
    flexuralModulus: '2.85 GPa',
    mfr: '4.5 g/10min',
    hdt: '220 °C',
    yieldStrain: '4.5%',
    clampForce: '240 Tonnes',
    curvePath: 'M 10 130 C 25 30, 50 15, 75 18 C 110 22, 150 28, 180 35',
    yieldPoint: { x: 75, y: 18 }
  },
  {
    id: 'peek',
    name: 'PEEK Polymer',
    short: 'Polyetheretherketone',
    tag: 'Aerospace / Medical',
    color: '#8B5CF6',
    tensileStrength: '100.0 MPa',
    flexuralModulus: '4.10 GPa',
    mfr: '2.8 g/10min',
    hdt: '260 °C',
    yieldStrain: '5.1%',
    clampForce: '310 Tonnes',
    curvePath: 'M 10 130 C 20 20, 45 8, 70 10 C 100 12, 140 18, 170 24',
    yieldPoint: { x: 70, y: 10 }
  },
  {
    id: 'pc',
    name: 'Polycarbonate (PC)',
    short: 'Optical Grade PC',
    tag: 'High Impact / Optical',
    color: '#F59E0B',
    tensileStrength: '65.0 MPa',
    flexuralModulus: '2.30 GPa',
    mfr: '10.5 g/10min',
    hdt: '135 °C',
    yieldStrain: '6.0%',
    clampForce: '210 Tonnes',
    curvePath: 'M 10 130 C 28 40, 55 25, 80 28 C 120 32, 160 38, 200 45',
    yieldPoint: { x: 80, y: 28 }
  }
]

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<'magic-link' | 'password' | 'phone'>('magic-link')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [activeMaterial, setActiveMaterial] = useState(MATERIAL_PRESETS[0])

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    setIsSuccess(false)

    try {
      if (authMode === 'magic-link') {
        const cleanEmail = email.trim().toLowerCase()
        if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
          throw new Error('Please enter a valid work or academic email address')
        }

        const { error: authError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        if (authError) throw new Error(authError.message)

        setIsSuccess(true)
        setSuccessMessage(`Secure sign-in link dispatched to ${cleanEmail}. Click the link in your inbox to enter.`)
      } else if (authMode === 'password') {
        const cleanEmail = email.trim().toLowerCase()
        if (!cleanEmail || !password) {
          throw new Error('Please enter both your email address and password.')
        }

        const { error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        })

        if (authError) throw new Error(authError.message)

        window.location.href = '/dashboard'
      } else if (authMode === 'phone') {
        const cleanPhone = phone.trim().replace(/\s+/g, '')
        if (cleanPhone.length < 10) {
          throw new Error('Please enter a valid 10-digit mobile number')
        }

        const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`
        const { error: authError } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        })

        if (authError) throw new Error(authError.message)

        setIsSuccess(true)
        setSuccessMessage(`One-time security code dispatched via SMS to ${formattedPhone}.`)
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'azure' | 'github') => {
    setErrorMessage('')
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: provider as 'google' | 'azure' | 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (oauthError) setErrorMessage(oauthError.message)
    } catch {
      setErrorMessage(`Failed to initialize ${provider} sign-in.`)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* ── Top Micro-Navigation Bar ── */}
      <header className="w-full border-b border-slate-800/80 bg-[#0A0F1D]/90 backdrop-blur-md z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-44 sm:w-56">
            <Image
              src="/logo-horizontal.jpg"
              alt="Polymer Hub of India"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/subjects"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-blue-400 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Explore 19 Subjects</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-xs font-mono text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
          >
            <span>Back to Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ── Main Split-Screen Layout ── */}
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 gap-8 lg:gap-12 items-center">
        
        {/* ============================================================ */}
        {/* LEFT SIDE (55%): THE DIGITAL POLYMER ENGINEERING LAB PREVIEW */}
        {/* ============================================================ */}
        <div className="hidden lg:flex flex-col flex-1 max-w-xl space-y-6">
          
          {/* Engineering Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-mono w-fit shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>THE DIGITAL POLYMER ENGINEERING COMMAND CENTER</span>
          </div>

          {/* Core Value Statement */}
          <div className="space-y-3">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Master Materials. <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                Simulate Physics. Build with Precision.
              </span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Connect to India&apos;s authoritative engineering workspace — grounded in CIPET, IIT, and global ASTM/ISO standards.
            </p>
          </div>

          {/* Interactive Live Material Telemetry & Curve Widget */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-xl">
            
            {/* Ambient Corner Glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono font-bold text-slate-300 tracking-wide uppercase">
                  Live Material Telemetry
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 font-semibold">
                ASTM D638 / ISO 527
              </span>
            </div>

            {/* Material Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {MATERIAL_PRESETS.map((mat) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => setActiveMaterial(mat)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-center transition-all ${
                    activeMaterial.id === mat.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {mat.id.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Selected Material Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{activeMaterial.name}</h4>
                <p className="text-[11px] font-mono text-slate-400">{activeMaterial.tag}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400 block">Clamp Force Est.</span>
                <span className="text-sm font-mono font-bold text-emerald-400">{activeMaterial.clampForce}</span>
              </div>
            </div>

            {/* Stress-Strain Real-Time Visualization SVG */}
            <div className="relative bg-slate-950 rounded-xl p-3 border border-slate-800/80">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>Stress-Strain Curve ($\sigma$ vs $\varepsilon$)</span>
                <span className="text-blue-400 font-semibold">Yield Point: {activeMaterial.yieldStrain}</span>
              </div>

              <div className="h-28 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 240 140" fill="none">
                  {/* Grid Lines */}
                  <line x1="10" y1="10" x2="10" y2="130" stroke="#334155" strokeWidth="1" />
                  <line x1="10" y1="130" x2="230" y2="130" stroke="#334155" strokeWidth="1" />
                  <line x1="10" y1="70" x2="230" y2="70" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="120" y1="10" x2="120" y2="130" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Animated Curve */}
                  <path
                    d={activeMaterial.curvePath}
                    stroke={activeMaterial.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Yield Point Dot */}
                  <circle
                    cx={activeMaterial.yieldPoint.x}
                    cy={activeMaterial.yieldPoint.y}
                    r="4"
                    fill={activeMaterial.color}
                    className="animate-ping opacity-75"
                  />
                  <circle
                    cx={activeMaterial.yieldPoint.x}
                    cy={activeMaterial.yieldPoint.y}
                    r="4"
                    fill="#FFFFFF"
                    stroke={activeMaterial.color}
                    strokeWidth="2"
                  />

                  {/* Labels */}
                  <text x="15" y="22" fill="#94A3B8" fontSize="8" fontFamily="monospace">σ (MPa)</text>
                  <text x="195" y="125" fill="#94A3B8" fontSize="8" fontFamily="monospace">ε (%)</text>
                </svg>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-center font-mono">
                <div className="p-1.5 rounded bg-slate-900/80">
                  <span className="text-[9px] text-slate-400 block uppercase">Tensile</span>
                  <span className="text-xs font-bold text-white">{activeMaterial.tensileStrength}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900/80">
                  <span className="text-[9px] text-slate-400 block uppercase">Modulus</span>
                  <span className="text-xs font-bold text-blue-400">{activeMaterial.flexuralModulus}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900/80">
                  <span className="text-[9px] text-slate-400 block uppercase">MFR</span>
                  <span className="text-xs font-bold text-amber-400">{activeMaterial.mfr}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-900/80">
                  <span className="text-[9px] text-slate-400 block uppercase">HDT</span>
                  <span className="text-xs font-bold text-emerald-400">{activeMaterial.hdt}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                218+ Lessons
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                Polymer AI Copilot
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                5,000+ Engineers
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT SIDE (45%): THE AUTHENTICATION TERMINAL               */}
        {/* ============================================================ */}
        <div className="w-full lg:w-[460px] relative z-10">
          
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
            
            {/* Indian Tricolor Header Strip */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

            {/* Header Lockup */}
            <div className="text-center mb-6 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-300 mb-3">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>SECURE ENGINEERING WORKSTATION</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, engineer.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                Your courses, simulations, tools, and AI copilot &mdash; all in one place.
              </p>
            </div>

            {/* Auth Mode Toggle Tabs */}
            <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5 text-xs font-mono font-medium">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('magic-link')
                  setErrorMessage('')
                  setIsSuccess(false)
                }}
                className={`py-2 rounded-lg text-center transition-all ${
                  authMode === 'magic-link'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Magic Link
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('password')
                  setErrorMessage('')
                  setIsSuccess(false)
                }}
                className={`py-2 rounded-lg text-center transition-all ${
                  authMode === 'password'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('phone')
                  setErrorMessage('')
                  setIsSuccess(false)
                }}
                className={`py-2 rounded-lg text-center transition-all ${
                  authMode === 'phone'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Mobile OTP
              </button>
            </div>

            {/* Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {authMode !== 'phone' ? (
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                    WORK OR ACADEMIC EMAIL
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setErrorMessage('')
                      }}
                      placeholder="name@company.com or you@institution.ac.in"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                      required
                      autoFocus
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                    MOBILE NUMBER (INDIA)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        setErrorMessage('')
                      }}
                      placeholder="9876543210"
                      className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                      required
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* Password Field (Only when Password mode is selected) */}
              {authMode === 'password' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-mono font-semibold text-slate-300">
                      PASSWORD
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('magic-link')
                      }}
                      className="text-[11px] font-mono text-blue-400 hover:underline"
                    >
                      Forgot password? Use Magic Link
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setErrorMessage('')
                      }}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Security Hint */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>256-bit encrypted authentication. We never store raw passwords.</span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Message Banner */}
              {isSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* CTA Button with Micro-Animation */}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className={`w-full py-3.5 rounded-xl font-bold font-mono text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isLoading || isSuccess
                    ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Sending Secure Credentials...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Dispatched Successfully ✓</span>
                  </>
                ) : authMode === 'magic-link' ? (
                  <>
                    <span>Send Secure Sign-In Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : authMode === 'password' ? (
                  <>
                    <span>Sign In to Command Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Send Mobile Security Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Social Authentication Divider */}
            <div className="flex items-center gap-3 my-5">
              <span className="flex-1 h-px bg-slate-800" />
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                or authenticate with
              </span>
              <span className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Single-Line Social Buttons: Google & Microsoft */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2 text-xs font-mono text-slate-200"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('azure')}
                className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2 text-xs font-mono text-slate-200"
              >
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
                <span>Microsoft SSO</span>
              </button>
            </div>

            {/* Auto-Creation Notice */}
            <div className="mt-5 text-center text-xs font-mono text-slate-400">
              <span>New to PolymerHub? </span>
              <button
                type="button"
                onClick={() => setAuthMode('magic-link')}
                className="text-blue-400 font-bold hover:underline"
              >
                Your account initializes instantly upon first sign-in.
              </button>
            </div>

            {/* Secondary Escape Link */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
              <Link
                href="/subjects"
                className="text-xs font-mono text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
              >
                <span>Explore PolymerHub without signing in</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer Trust & Compliance Strip ── */}
      <footer className="w-full border-t border-slate-800/80 bg-[#0A0F1D] py-4 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Personal Data Protection (DPDP) Act 2023 Compliant</span>
          </div>
          <div>
            <span>&copy; 2026 Polymer Hub of India &middot; All Rights Reserved</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/terms" className="hover:text-slate-200 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy</Link>
            <Link href="/community" className="hover:text-slate-200 transition-colors">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
