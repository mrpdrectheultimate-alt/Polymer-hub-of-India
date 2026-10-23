import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-flash-latest']

const OPENROUTER_MODELS = [
  'google/gemini-2.5-flash',
  'deepseek/deepseek-chat',
  'meta-llama/llama-3.3-70b-instruct',
  'qwen/qwen-2.5-72b-instruct',
]

const STOPWORDS = new Set([
  'what', 'when', 'where', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having',
  'do', 'does', 'did', 'doing', 'would', 'should', 'could', 'ought', 'the', 'and', 'but',
  'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about',
  'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further',
  'then', 'once', 'here', 'there', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 'can', 'will', 'just', 'tell', 'explain', 'give', 'help', 'you', 'please', 'difference'
])

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let isGuest = false
    let isPremium = false
    let guestQueriesUsed = 0
    let userQueriesToday = 0

    if (!user) {
      isGuest = true
      const guestCookie = req.cookies.get('ph_guest_ai_count')?.value
      guestQueriesUsed = guestCookie ? parseInt(guestCookie, 10) : 0
      if (isNaN(guestQueriesUsed)) guestQueriesUsed = 0

      if (guestQueriesUsed >= 10) {
        return NextResponse.json(
          { error: 'You have used your 10 free guest queries. Create a free account to continue asking questions.', guestLimitReached: true },
          { status: 403 }
        )
      }
    } else {
      // ── Check + enforce logged-in user query limit ───────────────────────────
      const { data: profile } = await supabase
        .from('profiles')
        .select('ai_queries_today, ai_queries_reset_at, subscription_status')
        .eq('id', user.id)
        .single()

      isPremium = profile?.subscription_status === 'premium' || profile?.subscription_status === 'active'
      userQueriesToday = profile?.ai_queries_today ?? 0

      if (!isPremium) {
        const now = new Date()
        const resetAt = profile?.ai_queries_reset_at ? new Date(profile.ai_queries_reset_at) : null
        const needsReset = !resetAt || now.toDateString() !== resetAt.toDateString()

        if (needsReset) {
          userQueriesToday = 0
          await supabase.from('profiles').update({
            ai_queries_today: 0,
            ai_queries_reset_at: now.toISOString(),
          }).eq('id', user.id)
        } else if (userQueriesToday >= 15) {
          return NextResponse.json(
            { error: 'Daily limit of 15 queries reached. Upgrade to Premium for unlimited queries.' },
            { status: 429 }
          )
        }
      }
    }

    // ── Parse request ────────────────────────────────────────────────────────
    const { message, history = [], lessonId } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }

    // ── Fetch active lesson context if lessonId is provided ──────────────────
    let lessonContext = ''
    let lessonSources: { title: string; slug: string }[] = []

    if (lessonId) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lessonId)
        const query = supabase
          .from('lessons')
          .select('id, title, slug, summary, content, module_name')

        const { data: lesson } = isUuid
          ? await query.eq('id', lessonId).single()
          : await query.eq('slug', lessonId).single()

        if (lesson) {
          const excerpt = (lesson.content || '').slice(0, 3500)
          lessonContext = `[From active lesson: "${lesson.title}" (${lesson.module_name || 'Polymer Engineering'})]
Summary: ${lesson.summary || ''}
Key Content Excerpt:
${excerpt}`
          lessonSources = [{ title: lesson.title, slug: lesson.slug }]
        }
      } catch (err) {
        console.warn('Lesson context fetch warning:', err)
      }
    }

    // ── Context and sources retrieval via curriculum matching ───────────────
    let context = ''
    let sources: { title: string; slug: string }[] = []

    if (lessonContext) {
      context = lessonContext
      sources = lessonSources
    } else {
      // Fast keyword search on the 216 curriculum lessons
      try {
        const keywords = message
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter((w: string) => w.length > 2 && !STOPWORDS.has(w))

        if (keywords.length > 0) {
          const orFilter = keywords
            .slice(0, 4)
            .map((k: string) => `title.ilike.%${k}%`)
            .join(',')

          const { data: matchingLessons } = await supabase
            .from('lessons')
            .select('id, title, slug, summary, content, module_name')
            .or(orFilter)
            .limit(2)

          if (matchingLessons && matchingLessons.length > 0) {
            context = matchingLessons
              .map(
                (l) =>
                  `[From curriculum lesson: "${l.title}" (${l.module_name || 'Polymer Engineering'})]\nSummary: ${l.summary || ''}\nKey Concepts:\n${(l.content || '').slice(0, 1600)}`
              )
              .join('\n\n---\n\n')

            sources = matchingLessons.map((l) => ({ title: l.title, slug: l.slug }))
          }
        }
      } catch (searchErr) {
        console.warn('Curriculum keyword search warning:', searchErr)
      }
    }

    // ── System instruction ────────────────────────────────────────────────────
    const systemInstruction = `You are PolymerHub AI Copilot — India's premier technical AI specialist for Plastic & Polymer Engineering.
Your expertise spans: Polymer Chemistry, Injection Molding & Extrusion, Mould Design, ASTM/ISO/IS Testing Standards, Rubber Technology, Mechanical & Chemical Recycling, Sustainable Bioplastics, Additives Compounding, and Indian Petrochemical Industry benchmarks (Reliance, Supreme, GAIL, CIPET, IOCL).

CORE RULES:
1. Provide accurate, clear, and highly practical engineering answers.
2. If context is provided, ground your answer in it and reference relevant principles.
3. Connect theory to Indian industrial applications and plant standards (e.g. CIPET standards, Reliance/Supreme grades, ASTM/ISO testing protocols) where relevant.
4. Keep the tone professional, structured, and educational with clear bullet points and formulas where appropriate.

${context ? `\nRELEVANT CURRICULUM CONTEXT:\n${context}` : ''}`

    let answer = ''

    // ── Tier 1: Google Gemini Direct (Fastest, zero proxy latency) ───────────
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai')
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

        for (const modelName of GEMINI_MODELS) {
          try {
            const geminiModel = genAI.getGenerativeModel({
              model: modelName,
              systemInstruction,
              generationConfig: { temperature: 0.3, maxOutputTokens: 1500 }
            })
            const prompt = `${(history || []).map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`).join('\n')}\nStudent: ${message}`
            const result = await geminiModel.generateContent(prompt)
            const text = result.response.text()
            if (text && text.trim().length > 0) {
              answer = text.trim()
              break
            }
          } catch (mErr) {
            console.warn(`Direct Gemini ${modelName} failed, trying next:`, mErr)
          }
        }
      } catch (geminiErr) {
        console.warn('GoogleGenerativeAI init failed:', geminiErr)
      }
    }

    // ── Tier 2: OpenRouter Multi-Model Cascade ───────────────────────────────
    if (!answer && process.env.OPENROUTER_API_KEY) {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENROUTER_API_KEY,
          baseURL: 'https://openrouter.ai/api/v1',
          defaultHeaders: {
            'HTTP-Referer': 'https://polymerhubofindia.com',
            'X-Title': 'Polymer Hub of India',
          }
        })

        const openRouterMessages = [
          { role: 'system', content: systemInstruction },
          ...history.map((msg: { role: string; content: string }) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content,
          })),
          { role: 'user', content: message }
        ]

        for (const model of OPENROUTER_MODELS) {
          try {
            const response = await openai.chat.completions.create({
              model,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              messages: openRouterMessages as any,
              temperature: 0.3,
              max_tokens: 1500,
            })

            const content = response.choices?.[0]?.message?.content
            if (content && content.trim().length > 0) {
              answer = content.trim()
              break
            }
          } catch (modelErr) {
            console.warn(`OpenRouter model ${model} failed, trying next fallback:`, modelErr)
          }
        }
      } catch (orErr) {
        console.warn('OpenRouter engine failed:', orErr)
      }
    }

    // ── Tier 3: Zero-Downtime Curriculum Knowledge Synthesis ─────────────────
    if (!answer) {
      if (sources.length > 0 && context) {
        answer = `### 🎓 Technical Briefing: Polymer Engineering Analysis\n\n` +
          `Based on the verified curriculum from **${sources.map(s => s.title).join(' & ')}**:\n\n` +
          `${context.replace(/\[From.*?\]\n?/g, '').slice(0, 1200).trim()}...\n\n` +
          `#### ⚙️ Practical Industrial Principles & Best Practices:\n` +
          `- **Material Behavior & Rheology**: Ensure temperature control adheres to recommended melt temperature profiles and shear rate limits.\n` +
          `- **Testing & Standards**: Cross-reference ASTM / ISO testing protocols (e.g. ASTM D1238 for MFI, ASTM D638 for Tensile, ASTM D256 for Izod Impact).\n` +
          `- **Quality Assurance**: Check mould cooling layout, cycle time consistency, and resin moisture content prior to compounding or moulding.\n\n` +
          `*Explore the full interactive lessons in the PolymerHub Library below for complete formulas, troubleshooting trees, and industrial case studies.*`
      } else {
        answer = `### 💡 PolymerHub Technical Copilot Guidance\n\n` +
          `Regarding your query on **"${message.slice(0, 80)}"**:\n\n` +
          `1. **Core Polymer Engineering Principle**: Plastics processing (injection moulding, extrusion, blow moulding) requires precise control of polymer rheology, thermal crystallization kinetics, and mould cooling parameters.\n` +
          `2. **Standard Industrial Benchmark**: In Indian industrial plants (Reliance, Supreme, GAIL, CIPET guidelines), ensure resins are pre-dried to specified moisture levels (< 0.02% for hygroscopic polymers like PET/PA, < 0.1% for polyolefins) and mould temperatures are monitored with calibrated thermocouples.\n` +
          `3. **Recommended Next Steps**: Search the **PolymerHub Library** for detailed interactive lessons on moulding defect troubleshooting, polymer characterization (DSC, FTIR, TGA), and mould design formulas.`
      }
    }

    // ── Update query count ────────────────────────────────────────────────────
    if (user && !isPremium) {
      try {
        await supabase.from('profiles')
          .update({ ai_queries_today: userQueriesToday + 1 })
          .eq('id', user.id)
      } catch (profileErr) {
        console.warn('Profile query count update skipped:', profileErr)
      }
    }

    const res = NextResponse.json({
      answer,
      sources,
      isGuest,
      guestQueriesUsed: isGuest ? guestQueriesUsed + 1 : undefined,
      guestQueriesLeft: isGuest ? Math.max(0, 10 - (guestQueriesUsed + 1)) : undefined,
    })

    if (isGuest) {
      res.cookies.set('ph_guest_ai_count', String(guestQueriesUsed + 1), {
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      })
    }

    return res

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
