import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

import { ArrowLeft, ArrowRight, Lock, Brain, ChevronRight, CheckCircle, BookOpen } from 'lucide-react'
import { LessonShareBar } from '@/components/WhatsAppShare'
import DownloadNotes from '@/components/DownloadNotes'
import TechnicalMarkdownRenderer from '@/components/TechnicalMarkdownRenderer'
import { LessonNotes } from '@/components/LessonNotes'
import { LESSON_IMAGES, LessonImage } from '@/lib/lesson_images'

type UserProgressRow = {
  quiz_passed?: boolean | null
  quiz_score?: number | null
}

// ─── Domain color map ─────────────────────────────────────────────────────────

const DOMAIN: Record<string, { color: string; bg: string; label: string; tag: string }> = {
  'polymer-chemistry':         { color: '#1D4ED8', bg: '#EFF6FF', label: 'Chemistry & Science', tag: 'Foundation' },
  'polymer-processing':        { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', tag: 'Manufacturing' },
  'mould-design':              { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', tag: 'Engineering' },
  'polymer-testing':           { color: '#7C3AED', bg: '#F5F3FF', label: 'Testing & QA/QC', tag: 'QA / QC' },
  'rubber-technology':         { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', tag: 'Elastomers' },
  'recycling-technology':      { color: '#15803D', bg: '#F0FDF4', label: 'Circular Economy', tag: 'Recycling' },
  'sustainable-plastics':      { color: '#15803D', bg: '#F0FDF4', label: 'Circular Economy', tag: 'Bioplastics' },
  'polymer-composites':        { color: '#1D4ED8', bg: '#EFF6FF', label: 'Advanced Materials', tag: 'Composites' },
  'entrepreneurship-plastics': { color: '#CA8A04', bg: '#FEFCE8', label: 'Business', tag: 'Entrepreneurship' },
  'medical-plastics':          { color: '#7C3AED', bg: '#F5F3FF', label: 'Specialised', tag: 'Medical' },
  'polymer-rheology':          { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', tag: 'Advanced' },
  'additives-compounding':     { color: '#1D4ED8', bg: '#EFF6FF', label: 'Chemistry & Science', tag: 'Formulation' },
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
  const domain = DOMAIN[subjectSlug] ?? { color: '#1D4ED8', bg: '#EFF6FF', label: 'Polymer Engineering', tag: 'Lesson' }

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
  const fallbackImages = LESSON_IMAGES[params.slug] || null;
  const heroImageUrl = lesson.hero_image_url || fallbackImages?.hero || null;
  const conceptImages = (lesson.concept_images && (lesson.concept_images as unknown as LessonImage[]).length > 0)
    ? (lesson.concept_images as unknown as LessonImage[])
    : (fallbackImages?.concepts || []);
  const productImages = (lesson.product_images && (lesson.product_images as unknown as LessonImage[]).length > 0)
    ? (lesson.product_images as unknown as LessonImage[])
    : (fallbackImages?.products || []);
  const machineImages = (lesson.machine_images && (lesson.machine_images as unknown as LessonImage[]).length > 0)
    ? (lesson.machine_images as unknown as LessonImage[])
    : (lesson.process_images && (lesson.process_images as unknown as LessonImage[]).length > 0)
      ? (lesson.process_images as unknown as LessonImage[])
      : (fallbackImages?.machines || []);


  // Adjacent lessons
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title, slug, order_index, is_premium')
    .eq('subject_id', lesson.subject_id)
    .order('order_index')

  const currentIndex = allLessons?.findIndex(l => l.id === lesson.id) ?? -1
  const prevLesson = currentIndex > 0 ? allLessons![currentIndex - 1] : null
  const nextLesson = currentIndex < (allLessons?.length ?? 0) - 1 ? allLessons![currentIndex + 1] : null

  // Quiz status
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, title, passing_score')
    .eq('lesson_id', lesson.id)
    .single()

  const quizPassed = userProgress?.quiz_passed === true

  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-2 w-full" style={{ backgroundColor: domain.color }} />

      {/* Breadcrumb */}
      <div className="border-b-4 border-ink px-6 md:px-10 py-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap" style={{ backgroundColor: domain.bg }}>
        <Link href="/subjects" className="font-mono text-[10px] font-bold text-ink/50 hover:text-ink uppercase tracking-wider transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Subjects
        </Link>
        <ChevronRight className="w-3 h-3 text-ink/40 flex-shrink-0" />
        <Link href={`/subjects/${subjectSlug}`} className="font-mono text-[10px] font-bold uppercase tracking-wider hover:text-ink transition-colors flex-shrink-0" style={{ color: domain.color }}>
          {subjectName}
        </Link>
        <ChevronRight className="w-3 h-3 text-ink/40 flex-shrink-0" />
        <span className="font-mono text-[10px] font-bold text-ink uppercase tracking-wider truncate">{lesson.title}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ── MAIN CONTENT ─────────────────────────────── */}
          <article className="lg:col-span-3">

            {/* Hero Image */}
            {heroImageUrl && (
              <div className="w-full h-64 relative mb-6 border-4 border-ink overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-slate-200">
                <Image
                  src={heroImageUrl}
                  alt={lesson.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Lesson header */}
            <div className="border-4 border-ink p-6 md:p-8 mb-6 relative overflow-hidden" style={{ boxShadow: `6px 6px 0px 0px ${domain.color}` }}>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full" style={{ backgroundColor: domain.color, filter: 'blur(20px)' }} />
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="font-mono text-[10px] font-black border-2 border-ink px-3 py-1 uppercase tracking-widest" style={{ backgroundColor: domain.color, color: 'white' }}>
                  {domain.tag}
                </span>
                <span className="font-mono text-[10px] text-ink/50 border-2 border-ink/20 px-3 py-1 uppercase tracking-wider">
                  Lesson {lesson.order_index}
                </span>
                {lesson.is_premium && (
                  <span className="font-mono text-[10px] font-black border-2 border-yellow bg-yellow-light text-yellow px-3 py-1 uppercase tracking-wider flex items-center gap-1" style={{ borderColor: '#CA8A04', color: '#CA8A04', backgroundColor: '#FEFCE8' }}>
                    <Lock className="w-2.5 h-2.5" /> Premium
                  </span>
                )}
                {quizPassed && (
                  <span className="font-mono text-[10px] font-black border-2 border-green bg-green/10 text-green px-3 py-1 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> Completed
                  </span>
                )}
                <div className="ml-auto">
                  <DownloadNotes
                    lessonSlug={lesson.slug}
                    lessonTitle={lesson.title}
                    isPremium={isPremium}
                    compact={true}
                  />
                </div>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-black text-ink leading-tight mb-4">{lesson.title}</h1>
              <p className="text-ink/70 text-base leading-relaxed border-l-4 pl-4" style={{ borderColor: domain.color }}>
                {lesson.summary}
              </p>
            </div>

            {/* Premium locked */}
            {isContentLocked && (
              <div className="border-4 border-ink p-8 md:p-12 text-center mb-6" style={{ boxShadow: `6px 6px 0px 0px ${domain.color}` }}>
                <div className="w-16 h-16 border-4 border-ink mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: domain.color }}>
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-display text-3xl font-black text-ink mb-3">Premium Lesson</h2>
                <p className="text-ink/70 mb-8 max-w-md mx-auto leading-relaxed">
                  Unlock all 216 lessons for ₹149/month. Cancel anytime.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/pricing" className="cn-btn-yellow text-sm justify-center">
                    Get Premium — ₹149/mo <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/login" className="cn-btn-black text-sm justify-center">Sign In</Link>
                </div>
              </div>
            )}

            {!isContentLocked && (
              <>
                {/* Concept Diagrams Gallery */}
                {conceptImages.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                      <span>📊</span> Scientific & Concept Diagrams
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {conceptImages.map((img: LessonImage, idx: number) => (
                        <figure key={`concept-${idx}`} className="bg-white border-4 border-ink p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <div className="aspect-video relative bg-slate-100 border-2 border-ink overflow-hidden">
                            <Image
                              src={img.url}
                              alt={img.caption || `Concept Diagram ${idx + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                          {img.caption && (
                            <figcaption className="mt-3 text-xs text-ink-muted text-center font-mono font-bold uppercase tracking-wider">
                              {img.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Lesson Body Text */}
                <div
                  className="border-4 border-ink p-6 md:p-8 bg-canvas mb-8 max-w-[72ch] mx-auto lesson-body"
                  style={{ boxShadow: `4px 4px 0px 0px ${domain.color}` }}
                >
                  <TechnicalMarkdownRenderer
                    content={lesson.content}
                    domainColor={domain.color}
                    domainBg={domain.bg}
                  />
                </div>

                {/* Products & Applications Gallery */}
                {productImages.length > 0 && (
                  <div className="border-4 border-ink p-6 bg-white mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                      <span>🛠️</span> Products & Applications
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {productImages.map((img: LessonImage, idx: number) => (
                        <div key={`product-${idx}`} className="bg-[#F8FAFC] border-2 border-ink p-3 hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                          <div className="relative aspect-square rounded-lg overflow-hidden border border-ink/20">
                            <Image
                              src={img.url}
                              alt={img.caption || `Product ${idx + 1}`}
                              fill
                              className="object-cover animate-soft-fade"
                            />
                          </div>
                          {img.caption && (
                            <p className="text-xs text-slate-500 mt-2 text-center leading-tight">
                              {img.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Processing Equipment Gallery */}
                {machineImages.length > 0 && (
                  <div className="border-4 border-ink p-6 bg-white mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                      <span>⚙️</span> Processing Equipment
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {machineImages.map((img: LessonImage, idx: number) => (
                        <div key={`machine-${idx}`} className="bg-[#F8FAFC] border-2 border-ink p-3 hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                          <div className="relative aspect-square rounded-lg overflow-hidden border border-ink/20">
                            <Image
                              src={img.url}
                              alt={img.caption || `Machine ${idx + 1}`}
                              fill
                              className="object-cover animate-soft-fade"
                            />
                          </div>
                          {img.caption && (
                            <p className="text-xs text-slate-500 mt-2 text-center leading-tight">
                              {img.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* WhatsApp share */}
                <div className="border-4 border-ink p-5 mb-6" style={{ backgroundColor: domain.bg }}>
                  <LessonShareBar
                    lessonTitle={lesson.title}
                    lessonUrl={`https://polymer-hub-six.vercel.app/lessons/${lesson.slug}`}
                    subjectName={subjectName}
                    lessonSummary={lesson.summary}
                  />
                </div>

                {/* Download Notes Card */}
                <div className="mb-6">
                  <DownloadNotes
                    lessonSlug={lesson.slug}
                    lessonTitle={lesson.title}
                    isPremium={isPremium}
                  />
                </div>

                {/* Quiz CTA */}
                {quiz && (
                  <div
                    className="border-4 border-ink overflow-hidden mb-6"
                    style={{ boxShadow: quizPassed ? '4px 4px 0px 0px #15803D' : `4px 4px 0px 0px ${domain.color}` }}
                  >
                    <div
                      className="border-b-4 border-ink px-5 py-4 flex items-center justify-between flex-wrap gap-3"
                      style={{ backgroundColor: quizPassed ? '#15803D' : domain.color }}
                    >
                      <div className="flex items-center gap-3">
                        {quizPassed
                          ? <CheckCircle className="w-5 h-5 text-white" />
                          : <BookOpen className="w-5 h-5 text-white" />}
                        <div>
                          <div className="font-mono text-[9px] font-bold text-white/70 uppercase tracking-widest">
                            {quizPassed ? 'Lesson Completed' : 'Topic Self-Assessment'}
                          </div>
                          <div className="font-display text-base font-black text-white">{quiz.title}</div>
                        </div>
                      </div>
                      <Link
                        href={`/quiz/${lesson.slug}`}
                        className="border-4 border-white font-mono text-[10px] font-black uppercase tracking-wider px-4 py-2.5 text-white hover:bg-white transition-colors flex items-center gap-2"
                        style={{ ['--hover-color' as string]: quizPassed ? '#15803D' : domain.color }}
                      >
                        {quizPassed ? 'Retake Quiz' : 'Take Topic Quiz'}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    {!quizPassed && (
                      <div className="px-5 py-3 font-mono text-[10px] text-ink/60" style={{ backgroundColor: domain.bg }}>
                        Test your understanding of this topic with a 5-question practice quiz (Optional).
                      </div>
                    )}
                    {quizPassed && userProgress?.quiz_score !== null && (
                      <div className="px-5 py-3 flex items-center gap-3 bg-green/5">
                        <span className="font-mono text-[10px] text-green font-bold">✓ Your best score: {userProgress?.quiz_score}%</span>
                        <span className="font-mono text-[10px] text-ink/40">Keep it up!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Private Lesson Notes */}
                <div className="mb-8 border-t-4 border-ink pt-8">
                  <LessonNotes lessonSlug={lesson.slug} />
                </div>

                {/* Prev/Next navigation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prevLesson ? (
                    <Link href={`/lessons/${prevLesson.slug}`}
                      className="border-4 border-ink p-4 flex items-center gap-3 hover:bg-ink hover:text-white group transition-colors shadow-hard"
                    >
                      <ArrowLeft className="w-5 h-5 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-mono text-[9px] text-ink/50 group-hover:text-white/50 uppercase tracking-wider mb-0.5">Previous</div>
                        <div className="font-bold text-sm leading-tight truncate">{prevLesson.title}</div>
                      </div>
                    </Link>
                  ) : <div />}

                  {nextLesson ? (
                    <Link href={`/lessons/${nextLesson.slug}`}
                      className="border-4 border-ink p-4 flex items-center justify-end gap-3 text-right text-white group transition-colors"
                      style={{ backgroundColor: domain.color, boxShadow: `4px 4px 0px 0px ${domain.color}` }}
                    >
                      <div className="min-w-0">
                        <div className="font-mono text-[9px] text-white/70 uppercase tracking-wider mb-0.5">Next Lesson</div>
                        <div className="font-black text-sm leading-tight truncate">{nextLesson.title}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 flex-shrink-0" />
                    </Link>
                  ) : (
                    <Link href={`/subjects/${subjectSlug}`}
                      className="border-4 border-ink p-4 flex items-center justify-end gap-3 text-right hover:bg-ink hover:text-white transition-colors shadow-hard"
                    >
                      <div>
                        <div className="font-mono text-[9px] text-ink/50 uppercase tracking-wider mb-0.5">Subject Complete</div>
                        <div className="font-black text-sm">Back to {subjectName}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 flex-shrink-0" />
                    </Link>
                  )}
                </div>
              </>
            )}
          </article>

          {/* ── SIDEBAR ──────────────────────────────────── */}
          <aside className="lg:col-span-1 space-y-4">

            {/* Subject lessons */}
            <div className="border-4 border-ink" style={{ boxShadow: `4px 4px 0px 0px ${domain.color}` }}>
              <div className="border-b-4 border-ink p-4" style={{ backgroundColor: domain.color }}>
                <div className="font-mono text-[10px] font-black text-white uppercase tracking-widest mb-0.5">{domain.label}</div>
                <div className="font-display text-lg font-black text-white leading-tight">{subjectName}</div>
              </div>
              <div className="bg-canvas divide-y-2 divide-ink/10">
                {allLessons?.map((l, i) => {
                  const isCurrent = l.id === lesson.id
                  return (
                    <Link key={l.id} href={`/lessons/${l.slug}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors"
                      style={isCurrent ? { backgroundColor: domain.color } : {}}
                    >
                      <span className="font-mono text-[10px] font-black w-5 h-5 border-2 flex items-center justify-center flex-shrink-0"
                        style={{ borderColor: isCurrent ? 'white' : domain.color, color: isCurrent ? 'white' : domain.color }}>
                        {i + 1}
                      </span>
                      <span className={`text-xs leading-tight flex-1 font-medium ${isCurrent ? 'text-white font-bold' : 'text-ink'}`}>
                        {l.title}
                      </span>
                      {l.is_premium && !isPremium && <Lock className="w-3 h-3 flex-shrink-0 text-ink/40" />}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* AI Tutor */}
            <div className="border-4 border-ink bg-ink" style={{ boxShadow: '4px 4px 0px 0px #15803D' }}>
              <div className="border-b-4 border-white/20 p-4">
                <div className="font-mono text-[10px] font-bold text-yellow-bright uppercase tracking-widest mb-1">AI Tutor</div>
                <p className="text-white/80 text-sm">Question about this lesson?</p>
              </div>
              <div className="p-4">
                <Link href="/ai-tutor" className="cn-btn-yellow w-full justify-center text-xs">
                  <Brain className="w-3.5 h-3.5" /> Ask AI Tutor
                </Link>
              </div>
            </div>

            {/* Premium card */}
            {!isPremium && (
              <div className="border-4 border-ink p-5" style={{ backgroundColor: domain.bg, boxShadow: `4px 4px 0px 0px ${domain.color}` }}>
                <div className="font-mono text-[10px] font-black border-2 border-ink px-2 py-0.5 mb-3 inline-block uppercase tracking-wider" style={{ backgroundColor: domain.color, color: 'white' }}>
                  Premium
                </div>
                <p className="font-display text-lg font-black text-ink leading-tight mb-2">Unlock all 216 lessons</p>
                <p className="text-xs text-ink/60 mb-4 leading-relaxed">₹149/month · All subjects · Unlimited AI · Cancel anytime</p>
                <Link href="/pricing" className="cn-btn-black w-full justify-center text-xs">
                  Get Premium <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: lesson } = await supabase
    .from('lessons')
    .select('title, summary, subjects(name)')
    .eq('slug', params.slug)
    .single()

  if (!lesson) return { title: 'Lesson Not Found' }

  return {
    title: lesson.title,
    description: `${lesson.summary} | Part of ${(lesson.subjects as unknown as { name: string })?.name} on PolymerHub.`,
  }
}
