'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Camera,
  Save,
  ArrowLeft,
  Check,
  AlertCircle,
  User as UserIcon,
  Sparkles,
  GraduationCap,
  Target
} from 'lucide-react'

const EDUCATION_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated', 'Working Professional']
const TARGET_PATHS = [
  { value: 'job', label: '🏭 Industry Operations & Tooling' },
  { value: 'gate', label: '📝 Crack GATE XE-F / PSU' },
  { value: 'business', label: '🏗️ Plastics & Mould Manufacturing' },
  { value: 'rnd', label: '🔬 Advanced Polymer R&D' },
  { value: 'industry', label: '⚙️ Processing & Compounding' },
]

type ProfileForm = {
  full_name: string
  bio: string
  goals: string
  college_name: string
  education_level: string
  branch: string
  graduation_year: string
  target_path: string
  is_hod: boolean
  is_recruiter: boolean
  recruiter_company: string
}

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<ProfileForm>({
    full_name: '',
    bio: '',
    goals: '',
    college_name: '',
    education_level: '',
    branch: 'B.Tech Plastic Polymer Engineering',
    graduation_year: '',
    target_path: '',
    is_hod: false,
    is_recruiter: false,
    recruiter_company: '',
  })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      setEmail(session.user.email ?? '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      let activeProfile = profile
      if (!activeProfile) {
        const defaultName = session.user.email ? session.user.email.split('@')[0] : 'Student'
        const { data: newProf } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            full_name: defaultName,
            subscription_status: 'free',
            ai_queries_today: 0,
            avatar_url: null,
            bio: null,
            goals: null,
            college_name: null,
            education_level: null,
            branch: 'B.Tech Plastic Polymer Engineering',
            graduation_year: null,
            target_path: null,
          })
          .select()
          .single()
        activeProfile = newProf
      }

      if (activeProfile) {
        setForm({
          full_name: activeProfile.full_name ?? '',
          bio: activeProfile.bio ?? '',
          goals: activeProfile.goals ?? '',
          college_name: activeProfile.college_name ?? '',
          education_level: activeProfile.education_level ?? '',
          branch: activeProfile.branch ?? 'B.Tech Plastic Polymer Engineering',
          graduation_year: activeProfile.graduation_year ? String(activeProfile.graduation_year) : '',
          target_path: activeProfile.target_path ?? '',
          is_hod: activeProfile.is_hod ?? false,
          is_recruiter: activeProfile.is_recruiter ?? false,
          recruiter_company: activeProfile.recruiter_company ?? '',
        })
        setAvatarUrl(activeProfile.avatar_url ?? null)
      }
      setLoading(false)
    }
    load()
  }, [supabase, router])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Photo must be under 2MB')
      return
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      let uploadedAvatarUrl = avatarUrl

      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop()
        const path = `avatars/${session.user.id}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true })

        if (uploadError) {
          const { error: fallbackErr } = await supabase.storage
            .from('public')
            .upload(path, avatarFile, { upsert: true })
          if (!fallbackErr) {
            const { data: { publicUrl } } = supabase.storage.from('public').getPublicUrl(path)
            uploadedAvatarUrl = publicUrl
          }
        } else {
          const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
          uploadedAvatarUrl = publicUrl
        }
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: form.full_name || null,
          bio: form.bio || null,
          goals: form.goals || null,
          college_name: form.college_name || null,
          education_level: form.education_level || null,
          branch: form.branch || null,
          graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
          target_path: form.target_path || null,
          avatar_url: uploadedAvatarUrl,
          is_hod: form.is_hod,
          is_recruiter: form.is_recruiter,
          recruiter_company: form.is_recruiter ? form.recruiter_company : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id)

      if (updateError) throw updateError

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-6">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-[#2563EB] rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
          Loading Profile Workspace…
        </p>
      </div>
    )
  }

  const displayAvatar = avatarPreview || avatarUrl

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16">
      {/* ── Top Bar ── */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white px-4 sm:px-8 py-8 sm:py-10 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center border border-white/15"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                Engineering Profile
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{email}</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl font-mono text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            {saving ? (
              'Saving…'
            ) : saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* ── Form Container ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-xs text-red-800 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Avatar Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#2563EB]" />
            <span>Student Identity &amp; Photo</span>
          </h2>

          <div className="flex items-center gap-6 flex-wrap">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
                {displayAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl bg-[#2563EB] text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 mb-0.5">Upload Official Profile Photo</p>
              <p className="text-[11px] font-mono text-slate-500">JPG, PNG or WebP · Maximum 2MB</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-mono text-xs font-bold transition-colors"
              >
                Choose Photo
              </button>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Basic Information</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                placeholder="e.g. Siddharth Sen"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-sans text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Technical Bio
              </label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Share your interests (e.g. Injection moulding defect analysis, biodegradable packaging, rheological testing)..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-sans text-slate-900 resize-none focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>

        {/* Education & College */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#2563EB]" />
            <span>Academic &amp; Institution Details</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                College / Institute Name
              </label>
              <input
                type="text"
                value={form.college_name}
                onChange={e => setForm(f => ({ ...f, college_name: e.target.value }))}
                placeholder="e.g. CIPET Ahmedabad, ICT Mumbai, Anna University"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-sans text-slate-900 focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Academic Year / Level
                </label>
                <select
                  value={form.education_level}
                  onChange={e => setForm(f => ({ ...f, education_level: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-900"
                >
                  <option value="">Select Level</option>
                  {EDUCATION_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expected Graduation Year
                </label>
                <input
                  type="number"
                  value={form.graduation_year}
                  onChange={e => setForm(f => ({ ...f, graduation_year: e.target.value }))}
                  placeholder="2026"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-sans text-slate-900 focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Career Target Path */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Target Career Pathway</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TARGET_PATHS.map(path => {
              const isSelected = form.target_path === path.value
              return (
                <button
                  key={path.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, target_path: path.value }))}
                  className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-[#2563EB] bg-blue-50/80 text-[#1E40AF] shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  {path.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
