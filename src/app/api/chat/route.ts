import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

type LessonChunk = {
  lesson_title: string
  lesson_slug: string
  content: string
}

const FALLBACK_MODELS = [
  'google/gemini-2.5-flash',
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-chat',
  'google/gemini-2.0-flash-lite-001',
]

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    let isGuest = false
    let isPremium = false
    let guestQueriesUsed = 0
    let userQueriesToday = 0

    if (!session) {
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
        .eq('id', session.user.id)
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
          }).eq('id', session.user.id)
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
          .select('title, slug, why_matters, core_concept, deep_dive, formulas, real_world, common_mistakes, key_takeaways')

        const { data: lesson } = isUuid
          ? await query.eq('id', lessonId).single()
          : await query.eq('slug', lessonId).single()

        if (lesson) {
          lessonContext = `[From active lesson: "${lesson.title}"]
Why This Matters: ${lesson.why_matters || ''}
Core Concept: ${lesson.core_concept || ''}
Deep Dive: ${lesson.deep_dive || ''}
Formulas: ${lesson.formulas || ''}
Real-World Application: ${lesson.real_world || ''}
Common Student Mistakes: ${lesson.common_mistakes || ''}
Key Takeaways: ${lesson.key_takeaways || ''}`
          lessonSources = [{ title: lesson.title, slug: lesson.slug }]
        }
      } catch (err) {
        console.warn('Lesson context fetch warning:', err)
      }
    }

    // ── Context and sources retrieval ─────────────────────────────────────────
    let context = ''
    let sources: { title: string; slug: string }[] = []

    if (lessonContext) {
      context = lessonContext
      sources = lessonSources
    }

    // Optional vector search (gracefully fails if RPC or keys unavailable)
    if (process.env.OPENROUTER_API_KEY) {
      try {
        const openai = new OpenAI({
          apiKey: process.env.OPENROUTER_API_KEY,
          baseURL: 'https://openrouter.ai/api/v1',
        })
        const embRes = await openai.embeddings.create({
          model: 'openai/text-embedding-3-small',
          input: message,
        }).catch(() => null)

        if (embRes?.data?.[0]?.embedding) {
          try {
            const { data: chunks } = await supabase.rpc('match_lesson_chunks', {
              query_embedding: embRes.data[0].embedding,
              match_threshold: 0.65,
              match_count: 4,
            })

            if (chunks && chunks.length > 0) {
              const chunkText = (chunks as LessonChunk[])
                .map((c) => `[From lesson: "${c.lesson_title}"]\n${c.content}`)
                .join('\n\n---\n\n')
              context = context ? `${context}\n\n---\n\n${chunkText}` : chunkText

              const retrievedSources = Array.from(
                new Map((chunks as LessonChunk[]).map((c) => [c.lesson_slug, { title: c.lesson_title, slug: c.lesson_slug }])).values()
              ).slice(0, 3)

              const existingSlugs = new Set(sources.map(s => s.slug))
              retrievedSources.forEach(s => {
                if (!existingSlugs.has(s.slug)) sources.push(s)
              })
            }
          } catch (rpcErr) {
            console.warn('RPC match chunks skipped:', rpcErr)
          }
        }
      } catch (embErr) {
        console.warn('Vector embedding skipped/failed:', embErr)
      }
    }

    // ── System instruction ────────────────────────────────────────────────────
    const systemInstruction = `You are PolymerHub AI Copilot — India's premier technical AI specialist for Plastic & Polymer Engineering.

Your expertise spans: Polymer Chemistry, Injection Molding & Extrusion, Mould Design, ASTM/ISO Testing, Rubber Technology, Mechanical & Chemical Recycling, Sustainable Bioplastics, Additives Compounding, and Indian Petrochemical Industry benchmarks (Reliance, Supreme, GAIL, CIPET, IOCL).

CORE RULES:
1. Provide accurate, clear, and highly practical engineering answers.
2. If context is provided, ground your answer in it.
3. Connect theory to Indian industrial applications and plant standards where relevant.
4. Keep the tone professional, structured, and educational.

${context ? `\nRELEVANT CURRICULUM CONTEXT:\n${context}` : ''}`

    let answer = ''

    if (process.env.OPENROUTER_API_KEY) {
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

      // Try fallback models in order
      for (const model of FALLBACK_MODELS) {
        try {
          const response = await openai.chat.completions.create({
            model,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages: openRouterMessages as any,
            temperature: 0.3,
            max_tokens: 1024,
          })

          const content = response.choices?.[0]?.message?.content
          if (content && content.trim().length > 0) {
            answer = content
            break
          }
        } catch (modelErr) {
          console.warn(`OpenRouter model ${model} failed, trying next fallback:`, modelErr)
        }
      }
    }

    if (!answer) {
      return NextResponse.json(
        { error: 'AI Copilot is momentarily calibrating. Please try asking again in a few seconds.' },
        { status: 503 }
      )
    }

    // ── Update query count ────────────────────────────────────────────────────
    if (session && !isPremium) {
      try {
        await supabase.from('profiles')
          .update({ ai_queries_today: userQueriesToday + 1 })
          .eq('id', session.user.id)
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
