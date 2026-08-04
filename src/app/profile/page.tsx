'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Camera, Save, ArrowLeft, Check, AlertCircle, User } from 'lucide-react'

const EDUCATION_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated', 'Working Professional']
const TARGET_PATHS = [
  { value: 'job', label: '🏭 Get a Job in the Industry' },
  { value: 'gate', label: '📝 Crack GATE / PSU' },
  { value: 'business', label: '🏗️ Start a Plastics Business' },
  { value: 'rnd', label: '🔬 R&D / Research Career' },
  { value: 'industry', label: '⚙️ Industry Skill Building' },
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
          graduation_year: activeProfile.graduation_year?.toString() ?? '',
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
  }, [router, supabase])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setError('Image must be under 2MB'); return }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!form.full_name.trim()) { setError('Name is required'); return }
    setSaving(true); setError(null)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/login'); return }

    let newAvatarUrl = avatarUrl

    // Upload avatar if changed
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `${session.user.id}/avatar.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, avatarFile, { upsert: true })

      if (uploadError) {
        setError(`Avatar upload failed: ${uploadError.message}`)
        setSaving(false); return
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
      newAvatarUrl = publicUrl
    }

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name.trim(),
        bio: form.bio.trim() || null,
        goals: form.goals.trim() || null,
        college_name: form.college_name.trim() || null,
        education_level: form.education_level || null,
        branch: form.branch.trim() || null,
        graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
        target_path: form.target_path || null,
        is_hod: form.is_hod,
        is_recruiter: form.is_recruiter,
        recruiter_company: form.recruiter_company.trim() || null,
        avatar_url: newAvatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.user.id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false); return
    }

    setAvatarUrl(newAvatarUrl)
    setSaved(true)
    setSaving(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="border-4 border-ink p-8 shadow-hard font-display text-xl font-black text-ink animate-pulse">
          Loading your profile...
        </div>
      </div>
    )
  }

  const displayAvatar = avatarPreview || avatarUrl

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 bg-violet" />

      {/* Header */}
      <div className="border-b-4 border-ink bg-ink px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="border-2 border-white/30 text-white p-1.5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="font-display text-lg font-black text-white">Your Profile</div>
            <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">{email}</div>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="cn-btn-yellow text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Profile</>}
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* Error */}
        {error && (
          <div className="border-4 border-orange p-4 flex items-center gap-3" style={{ backgroundColor: '#FFF7ED', boxShadow: '3px 3px 0px 0px #EA580C' }}>
            <AlertCircle className="w-5 h-5 text-orange flex-shrink-0" />
            <p className="text-sm font-bold text-ink">{error}</p>
          </div>
        )}

        {/* Avatar */}
        <div className="border-4 border-ink overflow-hidden shadow-hard">
          <div className="border-b-4 border-ink px-5 py-3 bg-violet">
            <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Profile Photo</span>
          </div>
          <div className="p-6 bg-canvas flex items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 border-4 border-ink overflow-hidden bg-violet/10 flex items-center justify-center">
                {displayAvatar ? (
                  <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-ink/30" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 border-4 border-ink bg-yellow-bright flex items-center justify-center hover:bg-ink hover:text-white transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>
            <div>
              <p className="font-bold text-ink mb-1">Upload your photo</p>
              <p className="text-sm text-ink/60">JPG, PNG or WebP · Max 2MB</p>
              <button onClick={() => fileInputRef.current?.click()} className="font-mono text-[10px] font-bold text-violet border-2 border-violet px-3 py-1 mt-2 hover:bg-violet hover:text-white transition-colors uppercase tracking-wider">
                Choose Photo
              </button>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="border-4 border-ink overflow-hidden shadow-hard">
          <div className="border-b-4 border-ink px-5 py-3 bg-blue">
            <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Basic Information</span>
          </div>
          <div className="p-5 space-y-4 bg-canvas">
            <div>
              <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest block mb-1.5">
                Full Name <span className="text-orange">*</span>
              </label>
              <input
                value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                className="w-full border-4 border-ink px-4 py-3 text-sm font-bold text-ink focus:outline-none focus:border-blue shadow-hard-sm"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest block mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                className="w-full border-4 border-ink px-4 py-3 text-sm text-ink focus:outline-none focus:border-blue resize-none shadow-hard-sm"
                placeholder="Tell other students about yourself — interests, specialization, what excites you about polymer engineering..."
              />
            </div>
            <div>
              <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest block mb-1.5">Career Goals</label>
              <textarea
                value={form.goals}
                onChange={e => setForm(f => ({ ...f, goals: e.target.value }))}
                rows={2}
                className="w-full border-4 border-ink px-4 py-3 text-sm text-ink focus:outline-none focus:border-blue resize-none shadow-hard-sm"
                placeholder="e.g. Get placed at Reliance R&D, start a masterbatch business, crack GATE 2026..."
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="border-4 border-ink overflow-hidden shadow-hard">
          <div className="border-b-4 border-ink px-5 py-3 bg-orange">
            <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Education</span>
          </div>
          <div className="p-5 space-y-4 bg-canvas">
            <div>
              <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest block mb-1.5">College / University</label>
              <input
                value={form.college_name}
                onChange={e => setForm(f => ({ ...f, college_name: e.target.value }))}
                className="w-full border-4 border-ink px-4 py-3 text-sm text-ink focus:outline-none focus:border-orange shadow-hard-sm"
                placeholder="e.g. CIPET Ahmedabad, PLAST India International University"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest block mb-1.5">Year / Level</label>
                <div className="flex flex-col gap-1.5">
                  {EDUCATION_LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => setForm(f => ({ ...f, education_level: level }))}
                      className="border-4 border-ink px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider transition-all"
                      style={{
                        backgroundColor: form.education_level === level ? '#EA580C' : 'white',
                        color: form.education_level === level ? 'white' : '#0A0A0A',
                        boxShadow: form.education_level === level ? '2px 2px 0px 0px #EA580C' : '2px 2px 0px 0px #0A0A0A',
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div>
                  <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest block mb-1.5">Branch</label>
                  <input
                    value={form.branch}
                    onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
                    className="w-full border-4 border-ink px-3 py-2 text-sm text-ink focus:outline-none shadow-hard-sm mb-4"
                    placeholder="B.Tech PPE"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] font-bold text-ink/50 uppercase tracking-widest block mb-1.5">Graduation Year</label>
                  <input
                    type="number"
                    value={form.graduation_year}
                    onChange={e => setForm(f => ({ ...f, graduation_year: e.target.value }))}
                    className="w-full border-4 border-ink px-3 py-2 text-sm text-ink focus:outline-none shadow-hard-sm"
                    placeholder="2026"
                    min="2020" max="2030"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Target path */}
        <div className="border-4 border-ink overflow-hidden shadow-hard">
          <div className="border-b-4 border-ink px-5 py-3 bg-green">
            <span className="font-mono text-[10px] font-black text-white uppercase tracking-widest">Your Learning Target</span>
          </div>
          <div className="p-5 bg-canvas">
            <p className="text-sm text-ink/60 mb-3">What are you primarily using PolymerHub for?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TARGET_PATHS.map(path => (
                <button
                  key={path.value}
                  onClick={() => setForm(f => ({ ...f, target_path: path.value }))}
                  className="border-4 border-ink p-4 text-left font-bold text-sm transition-all"
                  style={{
                    backgroundColor: form.target_path === path.value ? '#15803D' : 'white',
                    color: form.target_path === path.value ? 'white' : '#0A0A0A',
                    boxShadow: form.target_path === path.value ? '3px 3px 0px 0px #15803D' : '3px 3px 0px 0px #0A0A0A',
                  }}
                >
                  {path.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* HOD / B2B Simulation (B2B Testing) */}
        <div className="border-4 border-ink overflow-hidden shadow-hard" style={{ borderColor: '#7C3AED' }}>
          <div className="border-b-4 border-ink px-5 py-3 bg-violet-600 text-white flex justify-between items-center">
            <span className="font-mono text-[10px] font-black uppercase tracking-widest">🏛️ HOD / Institutional Testing</span>
            {form.is_hod && (
              <Link href="/hod-dashboard" className="font-mono text-[9px] bg-white text-violet-700 border-2 border-white px-2 py-0.5 font-bold uppercase hover:bg-violet-50 transition-colors">
                Go to HOD Dashboard →
              </Link>
            )}
          </div>
          <div className="p-5 bg-violet-50/50 space-y-3">
            <p className="text-xs text-ink/70 leading-relaxed font-bold">
              Toggle HOD (Head of Department) status below to test B2B seat allocation features. In HOD mode, you can allocate/revoke premium subscriptions for students in your college.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_hod_checkbox"
                checked={form.is_hod}
                onChange={e => setForm(f => ({ ...f, is_hod: e.target.checked }))}
                className="w-5 h-5 border-4 border-ink cursor-pointer accent-violet-600 rounded bg-white"
              />
              <label htmlFor="is_hod_checkbox" className="text-sm font-bold text-ink cursor-pointer select-none">
                Enable HOD mode for my account
              </label>
            </div>
            {form.is_hod && !form.college_name && (
              <p className="text-[10px] text-amber-600 font-mono uppercase font-black">
                ⚠️ Warning: You must select/enter a College / University above to match seats with students!
              </p>
            )}
          </div>
        </div>

        {/* Recruiter / Enterprise Simulation (Recruiter Testing) */}
        <div className="border-4 border-ink overflow-hidden shadow-hard" style={{ borderColor: '#2563EB' }}>
          <div className="border-b-4 border-ink px-5 py-3 bg-blue-600 text-white flex justify-between items-center">
            <span className="font-mono text-[10px] font-black uppercase tracking-widest">👔 Recruiter / Enterprise Testing</span>
            {form.is_recruiter && (
              <Link href="/recruiter" className="font-mono text-[9px] bg-white text-blue-700 border-2 border-white px-2 py-0.5 font-bold uppercase hover:bg-blue-50 transition-colors">
                Go to Recruiter Portal →
              </Link>
            )}
          </div>
          <div className="p-5 bg-blue-50/50 space-y-4">
            <p className="text-xs text-ink/70 leading-relaxed font-bold">
              Toggle Recruiter status to access recruiter features. Enter your target company to manage challenges sponsored by your firm and view the candidate directory.
            </p>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_recruiter_checkbox"
                checked={form.is_recruiter}
                onChange={e => setForm(f => ({ ...f, is_recruiter: e.target.checked }))}
                className="w-5 h-5 border-4 border-ink cursor-pointer accent-blue-600 rounded bg-white"
              />
              <label htmlFor="is_recruiter_checkbox" className="text-sm font-bold text-ink cursor-pointer select-none">
                Enable Recruiter mode for my account
              </label>
            </div>
            {form.is_recruiter && (
              <div>
                <label className="font-mono text-[9px] text-slate-500 uppercase tracking-wide block font-bold mb-1">Recruiter Company Name</label>
                <input
                  type="text"
                  value={form.recruiter_company}
                  onChange={e => setForm(f => ({ ...f, recruiter_company: e.target.value }))}
                  placeholder="e.g. Reliance Industries, Supreme Industries"
                  className="w-full border-4 border-ink p-2 font-mono text-xs bg-white focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="cn-btn-black w-full justify-center text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? <><Check className="w-4 h-4" /> Profile Saved!</> : <><Save className="w-4 h-4" /> Save All Changes</>}
        </button>

        <Link href="/dashboard" className="block text-center font-mono text-[10px] text-ink/40 hover:text-ink uppercase tracking-wider py-2 transition-colors">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
