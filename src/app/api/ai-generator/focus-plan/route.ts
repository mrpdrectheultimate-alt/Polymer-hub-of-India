import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-flash-latest']
const OPENROUTER_MODELS = [
  'google/gemini-2.5-flash',
  'deepseek/deepseek-chat',
  'meta-llama/llama-3.3-70b-instruct',
]

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // ── Fetch user progress and subject structure ───────────────────────────
    const [
      { data: subjects },
      { data: lessons },
      { data: progress },
    ] = await Promise.all([
      supabase.from('subjects').select('id, name, slug').order('order_index'),
      supabase.from('lessons').select('id, title, subject_id, order_index'),
      supabase.from('user_progress').select('lesson_id, quiz_score, quiz_passed').eq('user_id', userId),
    ])

    if (!subjects || !lessons) {
      return NextResponse.json({ error: 'Failed to load course metadata.' }, { status: 500 })
    }

    // Aggregate performance per subject
    const subjectProfile = subjects.map(sub => {
      const subLessons = lessons.filter(l => l.subject_id === sub.id)
      const subProgress = (progress ?? []).filter(p => subLessons.some(l => l.id === p.lesson_id))
      const completed = subProgress.filter(p => p.quiz_passed).length
      const scores = subProgress.filter(p => p.quiz_score !== null).map(p => p.quiz_score!)
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null
      const pct = subLessons.length > 0 ? (completed / subLessons.length) * 100 : 0

      return {
        name: sub.name,
        total: subLessons.length,
        completed,
        pct: Math.round(pct),
        avgScore: avgScore !== null ? Math.round(avgScore) : null,
      }
    })

    // Filter subjects where student has progress
    const activeSubjects = subjectProfile.filter(s => s.completed > 0 || s.avgScore !== null)

    let summaryText = ''
    if (activeSubjects.length === 0) {
      summaryText = 'The student has not completed any lessons or quizzes yet. They are starting as a fresh candidate.'
    } else {
      summaryText = activeSubjects.map(s => {
        return `- **Subject: ${s.name}**: Completed ${s.completed}/${s.total} lessons (${s.pct}%). Average Quiz Score: ${s.avgScore !== null ? s.avgScore + '%' : 'N/A'}`
      }).join('\n')
    }

    const prompt = `You are the Lead Career Advisor & Curriculum Director at PolymerHub.
Your target audience is Indian B.Tech students studying Plastic and Polymer Engineering (PPE) at institutes like CIPET, IITs, or state universities.

We want you to build a highly personalized Focus & Career Plan based on the student's academic progress report:

Academic Summary:
${summaryText}

Please structure your response into the following four clear sections using clean Markdown:

### 1. Performance Overview & Strengths
- Summarize where the student is excelling based on their scores.
- Discuss how these strengths relate to core industrial applications (e.g. extrusion, injection molding, compounding, testing).

### 2. 4-Week Study Focus Plan
- Provide a clear, prioritized checklist of topics or subjects they must concentrate on.
- Detail weekly goals (e.g., Week 1: Master rheology & shear viscosity formulas, Week 2: Review mold cooling design parameters).

### 3. Customized Career Pathways
- Align their strengths to specific roles in the plastics industry (e.g., Mold Design Engineer, Production Executive, R&D/Formulation Scientist, Sustainability Analyst/LCA Auditor).
- Highlight the average starting salaries in India (ranging from ₹4 to 40 LPA depending on role).

### 4. Target Employers in India
- Recommend 3-5 specific top companies operating in India that align with their skill profile (e.g., Reliance Industries, Supreme Industries, Apollo Tyres, Uflex, Prince Pipes, CIPET R&D).
- Include 3 specific next steps they can take immediately (e.g., visit Career Board, start specific simulations).

Make the tone encouraging, highly professional, and engineering-focused.`

    let plan = ''

    // ── Tier 1: Direct Google Gemini ─────────────────────────────────────────
    if (process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      for (const modelName of GEMINI_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { temperature: 0.2, maxOutputTokens: 1500 },
          })
          const result = await model.generateContent(prompt)
          const text = result.response.text()
          if (text && text.trim().length > 0) {
            plan = text.trim()
            break
          }
        } catch (mErr) {
          console.warn(`AI Focus Plan Direct Gemini ${modelName} failed:`, mErr)
        }
      }
    }

    // ── Tier 2: OpenRouter Multi-Model Cascade ───────────────────────────────
    if (!plan && process.env.OPENROUTER_API_KEY) {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENROUTER_API_KEY,
          baseURL: 'https://openrouter.ai/api/v1',
          defaultHeaders: {
            'HTTP-Referer': 'https://polymerhubofindia.com',
            'X-Title': 'Polymer Hub of India',
          }
        })

        for (const model of OPENROUTER_MODELS) {
          try {
            const response = await openai.chat.completions.create({
              model,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.2,
              max_tokens: 1500,
            })
            const content = response.choices?.[0]?.message?.content
            if (content && content.trim()) {
              plan = content.trim()
              break
            }
          } catch (modelErr) {
            console.warn(`AI Focus Plan OpenRouter model ${model} failed:`, modelErr)
          }
        }
      } catch (orErr) {
        console.warn('AI Focus Plan OpenRouter failed:', orErr)
      }
    }

    // ── Tier 3: Zero-Downtime Rule-Based Focus Plan Fallback ───────────────────
    if (!plan) {
      plan = `### 1. Performance Overview & Strengths
You are developing foundational knowledge in Polymer Engineering and Material Sciences. To build industrial readiness, prioritize key engineering fundamentals across injection moulding, melt rheology, and mechanical testing (ASTM D638, ASTM D256).

### 2. 4-Week Study Focus Plan
- **Week 1: Fundamentals of Polymer Chemistry & Rheology** — Focus on molecular weight distribution, shear thinning behavior, and melt flow index (ASTM D1238).
- **Week 2: Injection Moulding & Extrusion Process Engineering** — Master temperature profiling, injection speed vs. pressure switchover, and defect elimination (sink marks, warpage, flash).
- **Week 3: Tool & Mould Design** — Study runner balancing, draft angles, gate geometries, and conformal cooling circuits.
- **Week 4: Quality Control & ASTM/ISO Testing** — Practice calculating tensile strength, flexural modulus, HDT (Heat Deflection Temp), and Izod impact resistance.

### 3. Customized Career Pathways
- **Tooling & Mould Design Engineer**: ₹4.5 - ₹10 LPA (Specializing in CAD/CAM, runner analysis, and mould manufacturing).
- **Process Optimization Engineer**: ₹5.0 - ₹12 LPA (Specializing in plant floor cycle time reduction and scrap minimization).
- **Polymer R&D / Compounding Specialist**: ₹6.0 - ₹15+ LPA (Masterbatches, engineering composites, recycling compatibilizers).

### 4. Target Employers in India
- **Reliance Industries Limited (RIL)** — Petrochemicals & Polymer Division (Hazira, Vadodara, Jamnagar)
- **Supreme Industries** — Advanced Injection Moulding & Piping Solutions
- **Uflex Ltd & Jindal Poly Films** — Flexible Packaging & BOPP/BOPET Films
- **CIPET R&D / Tata Motors Polymer Division** — Automotive Lightweighting

**Immediate Next Steps**: Complete the 216 curriculum modules in the PolymerHub Library, take the daily technical quizzes, and explore the Virtual Machinery Labs.`
    }

    return NextResponse.json({ plan })
  } catch (error: unknown) {
    console.error('AI Focus Plan error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: message || 'Failed to generate plan.' },
      { status: 500 }
    )
  }
}
