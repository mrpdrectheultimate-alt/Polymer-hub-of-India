import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Target,
  FlaskConical,
  Lightbulb,
  FileCheck,
  Share2
} from 'lucide-react'
import { LessonShareBar } from '@/components/WhatsAppShare'
import DownloadNotes from '@/components/DownloadNotes'
import TechnicalMarkdownRenderer from '@/components/TechnicalMarkdownRenderer'
import { LessonNotes } from '@/components/LessonNotes'
import InteractiveKnowledgeCheck from '@/components/InteractiveKnowledgeCheck'
import { LESSON_IMAGES, LessonImage } from '@/lib/lesson_images'

type UserProgressRow = {
  quiz_passed?: boolean | null
  quiz_score?: number | null
}

// ─── Domain color map ─────────────────────────────────────────────────────────

const DOMAIN: Record<string, { color: string; bg: string; label: string; tag: string }> = {
  'polymer-chemistry':         { color: '#2563EB', bg: '#EFF6FF', label: 'Chemistry & Science', tag: 'Foundation' },
  'polymer-processing':        { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', tag: 'Manufacturing' },
  'mould-design':              { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', tag: 'Engineering' },
  'polymer-testing':           { color: '#7C3AED', bg: '#F5F3FF', label: 'Testing & QA/QC', tag: 'QA / QC' },
  'rubber-technology':         { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', tag: 'Elastomers' },
  'recycling-technology':      { color: '#15803D', bg: '#F0FDF4', label: 'Circular Economy', tag: 'Recycling' },
  'sustainable-plastics':      { color: '#15803D', bg: '#F0FDF4', label: 'Circular Economy', tag: 'Bioplastics' },
  'polymer-composites':        { color: '#2563EB', bg: '#EFF6FF', label: 'Advanced Materials', tag: 'Composites' },
  'entrepreneurship-plastics': { color: '#CA8A04', bg: '#FEFCE8', label: 'Business', tag: 'Entrepreneurship' },
  'medical-plastics':          { color: '#7C3AED', bg: '#F5F3FF', label: 'Specialised', tag: 'Medical' },
  'polymer-rheology':          { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', tag: 'Advanced' },
  'additives-compounding':     { color: '#2563EB', bg: '#EFF6FF', label: 'Chemistry & Science', tag: 'Formulation' },
  'plastic-packaging-engineering': { color: '#15803D', bg: '#F0FDF4', label: 'Applications', tag: 'Packaging' },
  'life-cycle-assessment':     { color: '#15803D', bg: '#F0FDF4', label: 'Circular Economy', tag: 'Sustainability' },
  'color-science-masterbatches': { color: '#CA8A04', bg: '#FEFCE8', label: 'Specialised', tag: 'Design' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function LessonPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  // Auth
  const { data: { session } } = await supabase.auth.getSession()

  // Fetch lesson + subject
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*, subjects(name, slug)')
    .eq('slug', params.slug)
    .single()

  if (!lesson) notFound()

  const subjectSlug = (lesson.subjects as unknown as { slug: string })?.slug ?? ''
  const subjectName = (lesson.subjects as unknown as { name: string })?.name ?? ''
  const domain = DOMAIN[subjectSlug] ?? { color: '#2563EB', bg: '#EFF6FF', label: 'Polymer Engineering', tag: 'Lesson' }

  // Subscription check
  let isPremium = false
  let userProgress: UserProgressRow | null = null

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', session.user.id)
      .single()
    isPremium = profile?.subscription_status === 'premium'

    // Get user progress for this lesson
    const { data: prog } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('lesson_id', lesson.id)
      .single()
    userProgress = prog

    // Mark as reading if not already started
    if (!userProgress) {
      await supabase.from('user_progress').upsert({
        user_id: session.user.id,
        lesson_id: lesson.id,
        status: 'reading',
        started_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' })

      try {
        const host = headers().get('host') || 'localhost:3000'
        const protocol = host.includes('localhost') ? 'http' : 'https'
        await fetch(`${protocol}://${host}/api/xp/award`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'cookie': headers().get('cookie') || ''
          },
          body: JSON.stringify({ action: 'lesson_complete', reference: lesson.slug })
        })
      } catch (err) {
        console.error('Failed to award lesson XP:', err)
      }
    }
  }

  const isContentLocked = lesson.is_premium && !isPremium && !session

  // Load images with fallback to static registry
  const fallbackImages = LESSON_IMAGES[params.slug] || null
  const conceptImages = (lesson.concept_images && (lesson.concept_images as unknown as LessonImage[]).length > 0)
    ? (lesson.concept_images as unknown as LessonImage[])
    : (fallbackImages?.concepts || [])
  const productImages = (lesson.product_images && (lesson.product_images as unknown as LessonImage[]).length > 0)
    ? (lesson.product_images as unknown as LessonImage[])
    : (fallbackImages?.products || [])
  const machineImages = (lesson.machine_images && (lesson.machine_images as unknown as LessonImage[]).length > 0)
    ? (lesson.machine_images as unknown as LessonImage[])
    : (lesson.process_images && (lesson.process_images as unknown as LessonImage[]).length > 0)
      ? (lesson.process_images as unknown as LessonImage[])
      : (fallbackImages?.machines || [])

  // Adjacent lessons
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title, slug, order_index, is_premium')
    .eq('subject_id', lesson.subject_id)
    .order('order_index')

  const currentIndex = allLessons?.findIndex(l => l.id === lesson.id) ?? -1
  const prevLesson = currentIndex > 0 ? allLessons![currentIndex - 1] : null
  const nextLesson = currentIndex < (allLessons?.length ?? 0) - 1 ? allLessons![currentIndex + 1] : null

  // Format lesson index uniformly (e.g. Lesson 03)
  const displayLessonNumber = String(Math.max(1, (lesson.order_index ?? 0) + 1)).padStart(2, '0')

  const quizPassed = userProgress?.quiz_passed === true

  return (
    <div className="min-h-screen bg-[#FAF8F5]">

      {/* ─── STICKY TOP BREADCRUMB & PROGRESS BAR ─── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-mono">
          <Link href="/subjects" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Subjects
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
          <Link href={`/subjects/${subjectSlug}`} className="font-bold text-[#2563EB] hover:underline flex-shrink-0">
            {subjectName}
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
          <span className="text-slate-800 font-bold truncate max-w-[280px]">
            Lesson {displayLessonNumber} · {lesson.title}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <DownloadNotes
            lessonSlug={lesson.slug}
            lessonTitle={lesson.title}
            isPremium={isPremium}
            compact={true}
          />
          {quizPassed && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              <span>Completed</span>
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ─── MAIN LESSON WORKSPACE (COL 1-3) ─── */}
          <article className="lg:col-span-3 space-y-8 max-w-[76ch] mx-auto w-full">

            {/* ── CARD 01: MODULAR LESSON TITLE & CONTEXT CARD ── */}
            <header className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="flex items-center gap-2.5 flex-wrap mb-4">
                <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-[#1E40AF] border border-blue-200">
                  {domain.label}
                </span>
                <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  Lesson {displayLessonNumber}
                </span>
                <span className="font-mono text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200/60 flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-[#2563EB]" />
                  19 PPE Syllabus Aligned
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
                {lesson.title}
              </h1>

              <p className="text-slate-600 font-sans text-base sm:text-lg leading-relaxed border-l-3 border-[#2563EB] pl-4 mb-5">
                {lesson.summary}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-500 pt-4 border-t border-slate-100 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                  ~35 min technical deep-dive
                </span>
                <span>·</span>
                <span>Standard Indian Curricula (CIPET / Anna Univ / ICT)</span>
              </div>
            </header>

            {/* ── CARD 02: WHY THIS MATTERS & LEARNING OBJECTIVES ── */}
            <div className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 border border-blue-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <h2 className="font-display text-base font-bold text-slate-900">
                  01 · Why This Matters in Industry &amp; GATE XE-F
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                Applied directly across petrochemical refining, compounding plants, mold-flow simulations, and automotive part manufacturing (e.g., Reliance Industries, Supreme Petrochem, IOCL, CIPET testing protocols).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white border border-blue-100 rounded-xl flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <p className="text-xs text-slate-700 font-sans leading-snug">
                    <strong className="text-slate-900">Molecular Mechanism:</strong> Master conformational physics, transition temperatures, and reaction kinetics.
                  </p>
                </div>
                <div className="p-3 bg-white border border-blue-100 rounded-xl flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <p className="text-xs text-slate-700 font-sans leading-snug">
                    <strong className="text-slate-900">Process &amp; Quality:</strong> Predict viscosity behavior, solve molding defects, and apply ASTM/ISO testing standards.
                  </p>
                </div>
              </div>
            </div>

            {/* ── PREMIUM LOCK BANNER (If unauthenticated on locked lesson) ── */}
            {isContentLocked && (
              <div className="border border-amber-200 bg-amber-50/70 rounded-3xl p-8 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 mx-auto flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">Full Lesson Access</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                    Sign in to access complete lesson text, formulas, video explanations, and interactive quizzes across all 218 curriculum lessons.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <Link
                    href="/login"
                    className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-mono text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Sign In Free →
                  </Link>
                  <Link
                    href="/pricing"
                    className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-mono text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    View Pro Features
                  </Link>
                </div>
              </div>
            )}

            {/* ── CARD 03: CORE TECHNICAL LESSON BODY (UNBOXED KaTeX & VECTOR GRAPHS) ── */}
            {!isContentLocked && (
              <>
                <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider mb-6 pb-3 border-b border-slate-100">
                    <FlaskConical className="w-4 h-4 text-[#2563EB]" />
                    <span>02 · Technical Theory &amp; Governing Equations</span>
                  </div>

                  <TechnicalMarkdownRenderer
                    content={lesson.content}
                    domainColor={domain.color}
                    domainBg={domain.bg}
                  />
                </section>

                {/* ── CARD 04: VERIFIED CONCEPT & SCIENTIFIC DIAGRAMS ── */}
                {conceptImages.length > 0 && (
                  <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-5 pb-3 border-b border-slate-100">
                      <span>📊</span>
                      <span>03 · Validated Scientific &amp; Concept Diagrams</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {conceptImages.map((img: LessonImage, idx: number) => (
                        <figure key={`concept-${idx}`} className="bg-slate-50/60 border border-slate-200 rounded-2xl p-3 shadow-xs">
                          <div className="aspect-video relative bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                            <Image
                              src={img.url}
                              alt={img.caption || `Concept Diagram ${idx + 1}`}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          {img.caption && (
                            <figcaption className="mt-2.5 text-xs text-slate-600 text-center font-mono font-medium leading-tight">
                              {img.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── CARD 05: INDUSTRIAL PRODUCTS & APPLICATIONS ── */}
                {(productImages.length > 0 || machineImages.length > 0) && (
                  <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 uppercase tracking-wider mb-5 pb-3 border-b border-slate-100">
                      <span>⚙️</span>
                      <span>04 · Industrial Applications &amp; Processing Machinery</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[...productImages, ...machineImages].slice(0, 6).map((img: LessonImage, idx: number) => (
                        <div key={`app-${idx}`} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                          <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                            <Image
                              src={img.url}
                              alt={img.caption || `Application ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {img.caption && (
                            <p className="text-[11px] font-sans text-slate-600 mt-2 text-center leading-tight line-clamp-2">
                              {img.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── CARD 06: INTERACTIVE SELF-ASSESSMENT KNOWLEDGE CHECK ── */}
                <InteractiveKnowledgeCheck
                  lessonSlug={lesson.slug}
                  quizPassed={quizPassed}
                  quizScore={userProgress?.quiz_score}
                />

                {/* ── CARD 07: KEY TAKEAWAYS CHEAT SHEET ── */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-display font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-emerald-700" />
                    <span>Summary Cheat Sheet &amp; GATE Takeaways</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-emerald-950 font-sans leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <span>Always evaluate molecular weight distribution (MWD) alongside zero-shear viscosity when calculating mold shear rates.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <span>Differential Scanning Calorimetry (DSC) provides $T_g$, $T_c$, and $T_m$ to define optimal processing temperatures.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0" />
                      <span>Comply with ASTM D638 / ISO 527 tensile specimen sizing to prevent premature necking artifacts.</span>
                    </li>
                  </ul>
                </div>

                {/* ── CARD 08: SHARE & DOWNLOAD TOOLS ── */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Share2 className="w-4 h-4 text-[#2563EB]" />
                    <span className="text-xs font-mono font-bold text-slate-800">Share with Study Group:</span>
                  </div>
                  <LessonShareBar
                    lessonTitle={lesson.title}
                    lessonUrl={`https://polymer-hub-six.vercel.app/lessons/${lesson.slug}`}
                    subjectName={subjectName}
                    lessonSummary={lesson.summary}
                  />
                </div>

                {/* ── CARD 09: PRIVATE NOTES DRAWER ── */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <LessonNotes lessonSlug={lesson.slug} />
                </div>

                {/* ── CARD 10: PREV / NEXT NAVIGATION ── */}
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {prevLesson ? (
                    <Link
                      href={`/lessons/${prevLesson.slug}`}
                      className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 hover:shadow-xs transition-all group flex items-center gap-3"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 transition-transform" />
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Previous Lesson</div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">{prevLesson.title}</div>
                      </div>
                    </Link>
                  ) : <div />}

                  {nextLesson ? (
                    <Link
                      href={`/lessons/${nextLesson.slug}`}
                      className="p-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-2xl shadow-xs hover:shadow-md transition-all group flex items-center justify-end gap-3 text-right"
                    >
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] text-blue-200 uppercase tracking-wider">Next Lesson</div>
                        <div className="font-bold text-xs sm:text-sm truncate">{nextLesson.title}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <Link
                      href={`/subjects/${subjectSlug}`}
                      className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-400 transition-all flex items-center justify-end gap-3 text-right"
                    >
                      <div>
                        <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">Subject Completed</div>
                        <div className="font-bold text-xs sm:text-sm text-slate-900">Back to {subjectName}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  )}
                </nav>
              </>
            )}

          </article>

          {/* ─── SIDEBAR: CURRICULUM SYLLABUS RAIL ─── */}
          <aside className="lg:col-span-1 space-y-4">

            {/* Subject Syllabus List */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden sticky top-16">
              <div className="p-4 border-b border-slate-100 bg-slate-50/80">
                <div className="font-mono text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                  {domain.label}
                </div>
                <h2 className="font-display text-sm font-bold text-slate-900 mt-0.5 leading-tight">
                  {subjectName}
                </h2>
                <p className="text-[10px] font-mono text-slate-500 mt-1">
                  {allLessons?.length ?? 0} Curriculum Lessons
                </p>
              </div>

              <div className="max-h-[calc(100vh-280px)] overflow-y-auto divide-y divide-slate-100 text-xs">
                {allLessons?.map((l, i) => {
                  const isCurrent = l.id === lesson.id
                  const formattedIndex = String(i + 1).padStart(2, '0')
                  return (
                    <Link
                      key={l.id}
                      href={`/lessons/${l.slug}`}
                      className={`flex items-center gap-2.5 px-3.5 py-3 transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 text-[#1E40AF] font-bold border-l-3 border-[#2563EB]'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`font-mono text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                        isCurrent ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {formattedIndex}
                      </span>
                      <span className="truncate flex-1 font-sans">
                        {l.title}
                      </span>
                      {l.is_premium && !isPremium && (
                        <Lock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>

          </aside>

        </div>
      </div>

      {/* ─── SINGLE STICKY AI COPILOT LAUNCH BUTTON ─── */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href={`/ai-tutor`}
          className="flex items-center gap-2 px-4 py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-2xl font-mono text-xs font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span>Ask AI Copilot</span>
        </Link>
      </div>

    </div>
  )
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title, summary, subjects(name)')
    .eq('slug', params.slug)
    .single()

  if (!lesson) return { title: 'Lesson Not Found' }

  return {
    title: `${lesson.title} | PolymerHub Engineering Lab`,
    description: `${lesson.summary} | Part of ${(lesson.subjects as unknown as { name: string })?.name} on PolymerHub.`,
  }
}
