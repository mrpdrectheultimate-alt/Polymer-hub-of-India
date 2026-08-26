'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Brain, 
  Trophy, 
  Zap, 
  Shield, 
  Award, 
  Clock, 
  Target, 
  Check, 
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Footer from '@/components/Footer'

// ==================== TYPES & INTERFACES ====================

export interface Question {
  id: string
  question: string
  type: 'mcq' | 'msq' | 'numerical'
  options?: string[] | null
  correct_answer: string
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string | null
  is_gate_relevant: boolean
  subject_id?: string
  subject_name?: string
  concept?: string
}

export interface AnswerState {
  selected: string | null
  revealed: boolean
  correct: boolean | null
}

export interface SubjectCategory {
  id: string
  title: string
  badge: string
  subjects: {
    slug: string
    name: string
    questionsCount: number
    accuracy: number
    color: string
    isCoreGate?: boolean
  }[]
}

// ==================== CURATED DATA ====================

// Default Seed Questions for instant hero preview & offline resilience
const SAMPLE_PREVIEW_QUESTION: Question = {
  id: 'preview-mfi-01',
  question: 'The Melt Flow Index (MFI, ASTM D1238) of a thermoplastic polymer melt at constant temperature is inversely proportional to which of the following rheological parameters?',
  type: 'mcq',
  options: [
    'A. Average Molecular Weight (Mw)',
    'B. Melt Viscosity (η)',
    'C. Shear Rate in the Die',
    'D. Crosshead Velocity'
  ],
  correct_answer: 'B. Melt Viscosity (η)',
  explanation: 'MFI measures the mass of polymer extruded in 10 minutes through a standard orifice under a fixed load. Higher viscosity creates greater hydrodynamic flow resistance, leading to a lower MFI value (MFI ∝ 1/η ∝ 1/Mw^3.4).',
  difficulty: 'medium',
  topic: 'Polymer Rheology & Melt Flow',
  is_gate_relevant: true,
  subject_name: 'Polymer Rheology',
  concept: 'Non-Newtonian Flow & Viscosity Power Law'
}

const GATE_FALLBACK_QUESTIONS: Question[] = [
  SAMPLE_PREVIEW_QUESTION,
  {
    id: 'gate-chem-02',
    question: 'During step-growth (condensation) polymerization, according to the Carothers equation, what extent of reaction (p) is required to achieve a number-average degree of polymerization (Xn) of 100 for a stoichiometric bifunctional monomer mixture?',
    type: 'mcq',
    options: [
      'A. 0.900 (90%)',
      'B. 0.950 (95%)',
      'C. 0.990 (99%)',
      'D. 0.999 (99.9%)'
    ],
    correct_answer: 'C. 0.990 (99%)',
    explanation: 'Carothers Equation for equimolar stoichiometric bifunctional monomers: Xn = 1 / (1 - p). Rearranging for p gives: 1 - p = 1/100 = 0.01 ⇒ p = 0.99 (99% conversion).',
    difficulty: 'medium',
    topic: 'Condensation Kinetics',
    is_gate_relevant: true,
    subject_name: 'Polymer Chemistry',
    concept: 'Carothers Stoichiometric Conversion'
  },
  {
    id: 'gate-testing-03',
    question: 'In Differential Scanning Calorimetry (DSC) of a semi-crystalline polymer (e.g. Polyethylene Terephthalate, PET), which thermal transition is observed as an exothermic peak during heating?',
    type: 'mcq',
    options: [
      'A. Glass Transition Temperature (Tg)',
      'B. Cold Crystallization Peak (Tcc)',
      'C. Melting Peak (Tm)',
      'D. Thermal Decomposition Onset'
    ],
    correct_answer: 'B. Cold Crystallization Peak (Tcc)',
    explanation: 'Tg appears as a step change in baseline heat capacity (endothermic shift). Melting (Tm) is an endothermic peak requiring heat absorption. Cold crystallization (Tcc) releases latent heat of crystallization, producing an exothermic peak.',
    difficulty: 'hard',
    topic: 'Thermal Characterization',
    is_gate_relevant: true,
    subject_name: 'Polymer Testing',
    concept: 'DSC Thermal Phase Transitions'
  },
  {
    id: 'gate-rubber-04',
    question: 'In a Moving Die Rheometer (MDR) vulcanization cure curve of natural rubber, the scorch time (ts2) represents:',
    type: 'mcq',
    options: [
      'A. The time to reach 90% optimum crosslink density',
      'B. The induction time before premature crosslinking begins',
      'C. The time required for full thermal reversion',
      'D. The minimum torque (ML) during melt plasticization'
    ],
    correct_answer: 'B. The induction time before premature crosslinking begins',
    explanation: 'ts2 is the time required for torque to increase by 2 units above the minimum torque (ML), representing the safety processing margin before scorch (premature vulcanization) occurs in the mold.',
    difficulty: 'medium',
    topic: 'Rubber Vulcanization',
    is_gate_relevant: true,
    subject_name: 'Rubber Technology',
    concept: 'Vulcanization Scorch Kinetics'
  },
  {
    id: 'gate-comp-05',
    question: 'For a continuous unidirectional carbon-fiber reinforced epoxy composite, the longitudinal tensile modulus (E1) along the fiber orientation is governed by:',
    type: 'mcq',
    options: [
      'A. Inverse Rule of Mixtures (Iso-stress)',
      'B. Voigt Linear Rule of Mixtures (Iso-strain)',
      'C. Halpin-Tsai semi-empirical equations',
      'D. Mark-Houwink-Sakurada relationship'
    ],
    correct_answer: 'B. Voigt Linear Rule of Mixtures (Iso-strain)',
    explanation: 'Under longitudinal loading parallel to the fibers, fibers and matrix experience equal strain (iso-strain condition). E1 = Ef*Vf + Em*Vm (Voigt Rule of Mixtures).',
    difficulty: 'easy',
    topic: 'Polymer Composites Mechanics',
    is_gate_relevant: true,
    subject_name: 'Polymer Composites',
    concept: 'Voigt Rule of Mixtures'
  }
]

const KNOWLEDGE_CATEGORIES: SubjectCategory[] = [
  {
    id: 'core-gate',
    title: 'Core GATE XE-F Syllabus Units',
    badge: 'GATE 2026 Focus',
    subjects: [
      { slug: 'polymer-chemistry', name: 'Polymer Chemistry', questionsCount: 45, accuracy: 82, color: '#2563EB', isCoreGate: true },
      { slug: 'polymer-processing', name: 'Polymer Processing', questionsCount: 40, accuracy: 71, color: '#EA580C', isCoreGate: true },
      { slug: 'polymer-testing', name: 'Polymer Testing & QA', questionsCount: 35, accuracy: 78, color: '#EF4444', isCoreGate: true },
      { slug: 'polymer-rheology', name: 'Polymer Rheology & Flow', questionsCount: 28, accuracy: 54, color: '#0284C7', isCoreGate: true },
      { slug: 'polymer-composites', name: 'Composites & Blends', questionsCount: 32, accuracy: 64, color: '#0D9488', isCoreGate: true },
      { slug: 'rubber-technology', name: 'Rubber & Elastomers', questionsCount: 25, accuracy: 69, color: '#8B5CF6', isCoreGate: true },
    ]
  },
  {
    id: 'applied-engineering',
    title: 'Tooling & Industrial Applications',
    badge: 'Industry Practice',
    subjects: [
      { slug: 'mould-design', name: 'Mould & Die Design', questionsCount: 30, accuracy: 62, color: '#059669' },
      { slug: 'plastic-packaging-engineering', name: 'Packaging Engineering', questionsCount: 35, accuracy: 75, color: '#F59E0B' },
      { slug: 'additives-compounding', name: 'Additives & Compounding', questionsCount: 28, accuracy: 80, color: '#6366F1' },
      { slug: 'sustainable-plastics', name: 'Bioplastics & Sustainability', questionsCount: 30, accuracy: 88, color: '#16A34A' },
      { slug: 'medical-plastics', name: 'Medical Plastics & Biocompatibility', questionsCount: 20, accuracy: 58, color: '#DB2777' },
      { slug: 'recycling-technology', name: 'Recycling & Circular Economy', questionsCount: 25, accuracy: 84, color: '#15803D' },
    ]
  },
  {
    id: 'emerging-frontiers',
    title: 'Smart Molding & Emerging Frontiers',
    badge: 'Industry 4.0',
    subjects: [
      { slug: 'digital-twins-ai', name: 'Digital Twins & AI Molding', questionsCount: 18, accuracy: 50, color: '#6D28D9' },
      { slug: 'polymer-nanotechnology', name: 'Nanotechnology & Nanocomposites', questionsCount: 22, accuracy: 66, color: '#7C3AED' },
      { slug: 'robotics-automation', name: 'Robotics & Automation in Plastics', questionsCount: 15, accuracy: 70, color: '#DC2626' },
      { slug: 'color-science-masterbatch', name: 'Color Science & Spectrophotometry', questionsCount: 16, accuracy: 72, color: '#E11D48' },
      { slug: 'lca-sustainability', name: 'Life Cycle Assessment (LCA)', questionsCount: 15, accuracy: 65, color: '#0891B2' },
      { slug: 'entrepreneurship-plastics', name: 'Entrepreneurship & Factory Setup', questionsCount: 20, accuracy: 90, color: '#CA8A04' },
    ]
  }
]

// ==================== MAIN COMPONENT ====================

export default function PracticePage() {
  // Hero Live Interactive Question State
  const [heroSelectedOption, setHeroSelectedOption] = useState<string | null>(null)
  const [heroRevealed, setHeroRevealed] = useState(false)
  const [heroIsCorrect, setHeroIsCorrect] = useState<boolean | null>(null)

  // Practice Engine Active Arena State
  const [activeSession, setActiveSession] = useState(false)
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>(GATE_FALLBACK_QUESTIONS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerState[]>(
    GATE_FALLBACK_QUESTIONS.map(() => ({ selected: null, revealed: false, correct: null }))
  )
  const [sessionFinished, setSessionFinished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeAiTab, setActiveAiTab] = useState<'explain' | 'derive' | 'similar' | 'mistake' | null>(null)

  const supabase = useMemo(() => createClient(), [])

  // Hero Check Answer Handler
  const handleHeroCheckAnswer = () => {
    if (!heroSelectedOption) return
    const isCorrect = heroSelectedOption === SAMPLE_PREVIEW_QUESTION.correct_answer
    setHeroIsCorrect(isCorrect)
    setHeroRevealed(true)
  }

  // Load Questions from Supabase or Fallback
  const startPracticeSession = async (subjectSlug: string = 'all', isGate: boolean = false) => {
    setLoading(true)
    setActiveSession(true)
    setSessionFinished(false)
    setCurrentIndex(0)
    setActiveAiTab(null)

    try {
      let query = supabase.from('practice_questions').select('*')

      if (subjectSlug !== 'all') {
        const { data: subData } = await supabase.from('subjects').select('id').eq('slug', subjectSlug).single()
        if (subData) {
          query = query.eq('subject_id', subData.id)
        }
      }

      if (isGate) {
        query = query.eq('is_gate_relevant', true)
      }

      const { data: dbData } = await query.limit(10)

      if (dbData && dbData.length > 0) {
        const mapped: Question[] = dbData.map((q) => ({
          id: q.id,
          question: q.question,
          type: q.type || 'mcq',
          options: q.options || (q.option_a ? [`A. ${q.option_a}`, `B. ${q.option_b}`, `C. ${q.option_c}`, `D. ${q.option_d}`] : null),
          correct_answer: q.correct_answer || q.correct_option || 'A',
          explanation: q.explanation || 'Detailed chemical engineering derivation verified by PolymerHub.',
          difficulty: q.difficulty || 'medium',
          topic: q.topic || 'Core Engineering Unit',
          is_gate_relevant: q.is_gate_relevant ?? true,
          subject_name: q.subject_name || 'Polymer Science'
        }))

        const shuffled = [...mapped].sort(() => Math.random() - 0.5)
        setSessionQuestions(shuffled)
        setAnswers(shuffled.map(() => ({ selected: null, revealed: false, correct: null })))
      } else {
        const shuffled = [...GATE_FALLBACK_QUESTIONS].sort(() => Math.random() - 0.5)
        setSessionQuestions(shuffled)
        setAnswers(shuffled.map(() => ({ selected: null, revealed: false, correct: null })))
      }
    } catch {
      setSessionQuestions(GATE_FALLBACK_QUESTIONS)
      setAnswers(GATE_FALLBACK_QUESTIONS.map(() => ({ selected: null, revealed: false, correct: null })))
    } finally {
      setLoading(false)
      const el = document.getElementById('practice-arena')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Handle Answer Selection in Active Arena
  const handleArenaSelectAnswer = (option: string) => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === currentIndex ? { ...a, selected: option } : a))
    )
  }

  // Check Answer in Active Arena
  const handleArenaCheckAnswer = () => {
    const q = sessionQuestions[currentIndex]
    const currentAns = answers[currentIndex].selected
    const isCorrect = currentAns === q.correct_answer
    setAnswers((prev) =>
      prev.map((a, i) => (i === currentIndex ? { ...a, revealed: true, correct: isCorrect } : a))
    )
  }

  // Next Question
  const handleArenaNext = () => {
    setActiveAiTab(null)
    if (currentIndex < sessionQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setSessionFinished(true)
    }
  }

  // Reset Arena
  const handleArenaRetry = () => {
    setAnswers(sessionQuestions.map(() => ({ selected: null, revealed: false, correct: null })))
    setCurrentIndex(0)
    setSessionFinished(false)
    setActiveAiTab(null)
  }

  const currentQ = sessionQuestions[currentIndex]
  const currentAnswerState = answers[currentIndex] || { selected: null, revealed: false, correct: null }
  const totalScore = answers.filter((a) => a.correct === true).length
  const accuracyPct = Math.round((totalScore / (sessionQuestions.length || 1)) * 100)

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO: COMMAND CENTER + LIVE PRODUCT QUESTION PREVIEW */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-[#0B172A] via-[#0A2E1A] to-[#0B172A] overflow-hidden py-14 lg:py-20 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#10B981]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Mission Narrative & Launch Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#FBBF24] text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
                <Zap className="h-3.5 w-3.5" />
                GATE XE-F Practice Engine 3.0
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Master Polymer Engineering.
                <span className="block bg-gradient-to-r from-[#FBBF24] via-[#34D399] to-[#10B981] bg-clip-text text-transparent">
                  One Question At A Time.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                Grounded GATE-pattern practice with instant thermodynamic derivations, 
                adaptive accuracy feedback, and context-aware RAG explanations.
              </p>

              {/* Quick Launch CTA Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => startPracticeSession('all', false)}
                  className="px-6 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-slate-950 bg-[#F59E0B] hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-102"
                >
                  <Zap className="h-4 w-4" />
                  ⚡ Quick Practice
                </button>

                <button
                  type="button"
                  onClick={() => startPracticeSession('all', true)}
                  className="px-6 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-2"
                >
                  <Target className="h-4 w-4 text-[#34D399]" />
                  🎯 GATE Simulation
                </button>

                <Link
                  href="/practice/ai-generator"
                  className="px-5 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-purple-200 bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 transition-all flex items-center gap-1.5"
                >
                  <Brain className="h-4 w-4 text-purple-400" />
                  AI Question Generator
                </Link>
              </div>

              {/* Actionable Personal Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 max-w-lg">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <p className="text-xl sm:text-2xl font-black font-mono text-emerald-400 leading-none">78%</p>
                  <p className="text-[10px] sm:text-xs font-mono text-slate-300 uppercase mt-1">Accuracy</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <p className="text-xl sm:text-2xl font-black font-mono text-amber-400 leading-none flex items-center gap-1">
                    🔥 8
                  </p>
                  <p className="text-[10px] sm:text-xs font-mono text-slate-300 uppercase mt-1">Day Streak</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                  <p className="text-xl sm:text-2xl font-black font-mono text-blue-400 leading-none">127</p>
                  <p className="text-[10px] sm:text-xs font-mono text-slate-300 uppercase mt-1">Attempted</p>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Interactive Live Question Card Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-6"
            >
              <div className="bg-white text-slate-900 rounded-3xl border-2 border-slate-900 shadow-2xl p-6 sm:p-7 relative overflow-hidden">
                {/* Header info */}
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold uppercase">
                      Polymer Rheology
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono text-[10px] font-bold">
                      GATE XE-F
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-400">
                    Question 47 / 225
                  </span>
                </div>

                {/* Question Prompt */}
                <div className="py-4">
                  <p className="text-sm sm:text-base font-bold text-[#111827] leading-relaxed">
                    {SAMPLE_PREVIEW_QUESTION.question}
                  </p>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {SAMPLE_PREVIEW_QUESTION.options?.map((option) => {
                    const isSelected = heroSelectedOption === option
                    let optStyle = 'border-slate-200 hover:border-blue-400 bg-white'

                    if (heroRevealed) {
                      if (option === SAMPLE_PREVIEW_QUESTION.correct_answer) {
                        optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                      } else if (isSelected) {
                        optStyle = 'border-rose-400 bg-rose-50 text-rose-900'
                      }
                    } else if (isSelected) {
                      optStyle = 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-xs'
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          if (!heroRevealed) setHeroSelectedOption(option)
                        }}
                        className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm font-sans transition-all flex items-center justify-between ${optStyle}`}
                      >
                        <span>{option}</span>
                        {heroRevealed && option === SAMPLE_PREVIEW_QUESTION.correct_answer && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {heroRevealed && isSelected && option !== SAMPLE_PREVIEW_QUESTION.correct_answer && (
                          <XCircle className="h-4 w-4 text-rose-600 shrink-0 ml-2" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Action / Explanation Box */}
                {!heroRevealed ? (
                  <button
                    type="button"
                    onClick={handleHeroCheckAnswer}
                    disabled={!heroSelectedOption}
                    className="w-full mt-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    Check Answer &rarr;
                  </button>
                ) : (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold uppercase ${heroIsCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {heroIsCorrect ? '✓ Correct Answer!' : '✕ Needs Review'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setHeroRevealed(false)
                          setHeroSelectedOption(null)
                        }}
                        className="text-[11px] font-mono text-slate-500 hover:text-slate-900 underline"
                      >
                        Reset Question
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">
                      {SAMPLE_PREVIEW_QUESTION.explanation}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>

        {/* Tricolor Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      </section>

      {/* ============================================================ */}
      {/* "CONTINUE WHERE YOU LEFT OFF" RESUME BANNER */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                    Resume Active Track
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">Polymer Processing Unit 2</span>
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#111827] mt-0.5">
                  Question 18 / 30 &middot; 68% Current Accuracy
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => startPracticeSession('polymer-processing', true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
              >
                Continue Practice
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* GATE READINESS DIAGNOSTIC SCORECARD */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-4 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-white/15 pb-6 lg:pb-0 lg:pr-6">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                GATE XE-F Benchmark
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">GATE Readiness Score</h2>
              <div className="mt-4 inline-flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black font-mono text-emerald-400">74</span>
                <span className="text-xl font-mono text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-300 font-light mt-1">Based on 127 recent answers across 8 syllabus units</p>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Strong Mastery Areas
                  </span>
                  <span className="text-slate-300">80%+ Accuracy</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-xs font-mono text-white flex flex-wrap gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-400/30">Polymer Chemistry</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-400/30">Testing & Characterization</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-400/30">Bioplastics</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Priority Areas to Improve
                  </span>
                  <span className="text-slate-300">&lt;65% Accuracy</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-xs font-mono text-white flex flex-wrap gap-2">
                  <span className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-400/30">Polymer Rheology (54%)</span>
                  <span className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-400/30">Composites Mechanics (64%)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 text-center lg:text-right">
              <Link
                href="/ai-tutor?prompt=Generate+a+targeted+GATE+Polymer+Science+study+plan+for+Rheology+and+Composites"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 transition-all shadow-md"
              >
                <Brain className="h-4 w-4" />
                Build My Study Plan &rarr;
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ACTIVE INTERACTIVE PRACTICE ARENA (When Started) */}
      {/* ============================================================ */}
      {activeSession && (
        <section id="practice-arena" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-3xl border-2 border-slate-900 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Arena Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs">
                  {currentIndex + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#2563EB] uppercase">
                      {currentQ.subject_name || 'Polymer Science'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 uppercase">
                      {currentQ.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{currentQ.topic || 'Concept Mastery'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500">
                  {currentIndex + 1} of {sessionQuestions.length} Questions
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSession(false)}
                  className="text-xs font-mono text-rose-600 hover:underline"
                >
                  Exit Session
                </button>
              </div>
            </div>

            {/* Loading Indicator or Content */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 text-[#2563EB] animate-spin mb-3" />
                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Generating GATE Practice Batch...</p>
              </div>
            ) : sessionFinished ? (
              <div className="text-center py-10 space-y-6">
                <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-700">
                  <Trophy className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-black text-slate-900">Practice Session Complete!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  You scored <strong>{totalScore}</strong> out of <strong>{sessionQuestions.length}</strong> ({accuracyPct}% accuracy).
                  +15 XP points awarded to your engineering profile!
                </p>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleArenaRetry}
                    className="px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Retry Questions
                  </button>
                  <button
                    type="button"
                    onClick={() => startPracticeSession('all', false)}
                    className="px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase bg-[#2563EB] text-white hover:bg-blue-600"
                  >
                    Next Practice Batch &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Question Prompt */}
                <div className="space-y-2">
                  <p className="text-base sm:text-lg font-extrabold text-[#111827] leading-relaxed">
                    {currentQ.question}
                  </p>
                </div>

                {/* Question Options */}
                <div className="space-y-3">
                  {currentQ.options?.map((option) => {
                    const isSelected = currentAnswerState.selected === option
                    let optStyle = 'border-slate-200 hover:border-blue-400 bg-white'

                    if (currentAnswerState.revealed) {
                      if (option === currentQ.correct_answer) {
                        optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold'
                      } else if (isSelected) {
                        optStyle = 'border-rose-400 bg-rose-50 text-rose-950'
                      }
                    } else if (isSelected) {
                      optStyle = 'border-blue-600 bg-blue-50 text-blue-950 font-bold shadow-xs'
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          if (!currentAnswerState.revealed) handleArenaSelectAnswer(option)
                        }}
                        className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-center justify-between ${optStyle}`}
                      >
                        <span>{option}</span>
                        {currentAnswerState.revealed && option === currentQ.correct_answer && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {currentAnswerState.revealed && isSelected && option !== currentQ.correct_answer && (
                          <XCircle className="h-5 w-5 text-rose-600 shrink-0 ml-2" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Arena Controls */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {!currentAnswerState.revealed ? (
                    <button
                      type="button"
                      onClick={handleArenaCheckAnswer}
                      disabled={!currentAnswerState.selected}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white bg-[#2563EB] hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Zap className="h-4 w-4" /> Check Answer
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleArenaNext}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      {currentIndex < sessionQuestions.length - 1 ? 'Next Question →' : 'Finish Session & See Score →'}
                    </button>
                  )}
                </div>

                {/* Deep Result Explanations & 4 Contextual AI Action Pills */}
                {currentAnswerState.revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl border-2 space-y-4 ${
                      currentAnswerState.correct ? 'bg-emerald-50/70 border-emerald-300' : 'bg-rose-50/70 border-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold uppercase flex items-center gap-1.5 ${
                        currentAnswerState.correct ? 'text-emerald-800' : 'text-rose-800'
                      }`}>
                        {currentAnswerState.correct ? <Check className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        {currentAnswerState.correct ? 'Correct! Strong understanding demonstrated.' : 'Incorrect. Review key underlying principle below:'}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
                      {currentQ.explanation}
                    </p>

                    {/* 4 Contextual AI Actions */}
                    <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase mr-1">
                        AI Clarifications:
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveAiTab('explain')}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-medium hover:border-purple-500 hover:text-purple-700 transition-all"
                      >
                        💡 Explain Simply
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveAiTab('derive')}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-medium hover:border-purple-500 hover:text-purple-700 transition-all"
                      >
                        📐 Show Derivation
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveAiTab('similar')}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-mono font-medium hover:border-purple-500 hover:text-purple-700 transition-all"
                      >
                        🔄 Give Similar Question
                      </button>
                      <Link
                        href={`/ai-tutor?prompt=Explain+the+chemical+engineering+principles+behind+${encodeURIComponent(currentQ.question)}`}
                        className="px-3 py-1 rounded-lg bg-purple-100 text-purple-800 text-xs font-mono font-bold hover:bg-purple-200 transition-all flex items-center gap-1"
                      >
                        <Brain className="h-3 w-3" />
                        Ask AI Copilot
                      </Link>
                    </div>

                    {/* AI Explanation Tab Drawer */}
                    {activeAiTab && (
                      <div className="p-4 rounded-xl bg-white border border-purple-200 text-xs font-mono space-y-1.5 shadow-sm">
                        <p className="font-bold text-purple-900">
                          {activeAiTab === 'explain' && '💡 Simplified Explanation:'}
                          {activeAiTab === 'derive' && '📐 Thermodynamic Derivation:'}
                          {activeAiTab === 'similar' && '🔄 Similar Practice Formulation:'}
                        </p>
                        <p className="text-slate-600 font-sans leading-relaxed">
                          {activeAiTab === 'explain' && 'Think of melt flow like honey through a straw: colder/longer molecular chains tangle more, causing high viscosity and lowering how many grams exit per 10 minutes.'}
                          {activeAiTab === 'derive' && 'For Newtonian laminar Hagen-Poiseuille pipe flow: Q = (π * ΔP * R^4) / (8 * η * L). Since MFI is proportional to volumetric throughput Q, MFI ∝ 1/η.'}
                          {activeAiTab === 'similar' && 'If Polymer A has a zero-shear viscosity 10x higher than Polymer B under ASTM D1238 test conditions, compare their anticipated MFI values.'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}

          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* YOUR POLYMER ENGINEERING KNOWLEDGE MAP (Organized Taxonomy) */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Structured Knowledge Map</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#111827]">Polymer Engineering Curriculum Units</h2>
            <p className="text-xs font-mono text-slate-500 mt-0.5">Track your mastery level and launch targeted question sets</p>
          </div>
        </div>

        <div className="space-y-8">
          {KNOWLEDGE_CATEGORIES.map((category) => (
            <div key={category.id} className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-extrabold text-[#111827] text-base sm:text-lg">{category.title}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 uppercase">
                    {category.badge}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.subjects.map((sub) => (
                  <div
                    key={sub.slug}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[#111827] text-sm truncate">{sub.name}</span>
                        <span className="text-xs font-mono font-bold" style={{ color: sub.color }}>
                          {sub.accuracy}%
                        </span>
                      </div>

                      {/* Accuracy Bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${sub.accuracy}%`, backgroundColor: sub.color }}
                        />
                      </div>

                      <p className="text-[11px] font-mono text-slate-500">{sub.questionsCount} GATE-Aligned Questions</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">MCQ &middot; MSQ &middot; NAT</span>
                      <button
                        type="button"
                        onClick={() => startPracticeSession(sub.slug, Boolean(sub.isCoreGate))}
                        className="text-xs font-mono font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                      >
                        Practice &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* REAL INDUSTRY PROBLEM SOLVING & CHALLENGES */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#F59E0B] uppercase tracking-wider">Industrial Problem Solving</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827]">Solve Real Factory Defect Challenges</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Troubleshoot real molding, extrusion, and compounding flaws &middot; Earn XP &middot; Showcase technical capability
              </p>
            </div>

            <Link
              href="/practice/challenges"
              className="px-5 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow-sm"
            >
              Explore All Challenges &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">Injection Moulding Defect</span>
              <h4 className="font-bold text-sm text-[#111827] mt-1">Severe Warpage in Thin-Wall Polypropylene Pails</h4>
              <p className="text-xs text-slate-500 mt-1 font-light">Diagnose differential cooling shrinkage and asymmetrical gate shear heating.</p>
              <div className="mt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-600 font-bold">+25 XP</span>
                <Link href="/practice/challenges" className="text-[#2563EB] font-bold hover:underline">Solve Defect &rarr;</Link>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <span className="text-[10px] font-mono font-bold text-orange-600 uppercase">Film Extrusion Defect</span>
              <h4 className="font-bold text-sm text-[#111827] mt-1">Sharkskin Melt Fracture in LLDPE Blown Film</h4>
              <p className="text-xs text-slate-500 mt-1 font-light">Optimize die exit wall shear stress and fluoropolymer PPA processing aid loading.</p>
              <div className="mt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-600 font-bold">+25 XP</span>
                <Link href="/practice/challenges" className="text-[#2563EB] font-bold hover:underline">Solve Defect &rarr;</Link>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <span className="text-[10px] font-mono font-bold text-purple-600 uppercase">Elastomer Processing Defect</span>
              <h4 className="font-bold text-sm text-[#111827] mt-1">Premature Scorch during SBR Banbury Mixing</h4>
              <p className="text-xs text-slate-500 mt-1 font-light">Adjust sulfur-to-accelerator MBTS ratio and dump temperature control.</p>
              <div className="mt-3 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-600 font-bold">+25 XP</span>
                <Link href="/practice/challenges" className="text-[#2563EB] font-bold hover:underline">Solve Defect &rarr;</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* BRAND-ALIGNED AI TUTOR */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#0B172A] via-[#0A2E1A] to-[#0B172A] py-14 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#FBBF24] text-xs font-mono font-bold uppercase mb-3">
                <Brain className="h-3.5 w-3.5" />
                AI Practice Specialist
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Stuck on an equation or difficult GATE concept?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Ask our AI Tutor to break down any step-growth kinetics, WLF temperature shift equation, 
                or composite stress-strain matrix with verified derivations.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Derive Flory-Fox Tg Equation</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Calculate Extruder L/D Pressure Drop</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Solve Mooney-Rivlin C1 and C2 Constants</span>
              </div>
            </div>

            <Link
              href="/ai-tutor"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-[#F5C518] hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(245,197,24,0.35)] flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono uppercase tracking-wider"
            >
              Ask AI Practice Tutor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TRUST & COMPLIANCE BAR */}
      {/* ============================================================ */}
      <section className="bg-white py-6 border-t border-[#F1F5F9]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-600" />
              DPDP Act 2023 Compliant
            </span>
            <span className="w-px h-3.5 bg-[#E2E8F0]" />
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-blue-600" />
              AES-256 Encrypted Scores
            </span>
            <span className="w-px h-3.5 bg-[#E2E8F0]" />
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-[#F5C518]" />
              100% Verified GATE XE-F Syllabus Alignment
            </span>
            <span className="w-px h-3.5 bg-[#E2E8F0]" />
            <span className="flex items-center gap-1.5">🇮🇳 Made in India</span>
          </div>
        </div>
      </section>

      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}
