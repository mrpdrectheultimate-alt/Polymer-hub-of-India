import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null

type LessonChunk = {
  lesson_title: string
  lesson_slug: string
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Sign in to use the AI Tutor.' }, { status: 401 })
    }

    // ── Check + enforce query limit ──────────────────────────────────────────
    const { data: profile } = await supabase
      .from('profiles')
      .select('ai_queries_today, ai_queries_reset_at, subscription_status')
      .eq('id', session.user.id)
      .single()

    const isPremium = profile?.subscription_status === 'premium'

    if (!isPremium) {
      const now = new Date()
      const resetAt = profile?.ai_queries_reset_at ? new Date(profile.ai_queries_reset_at) : null
      const needsReset = !resetAt || now.toDateString() !== resetAt.toDateString()

      if (needsReset) {
        await supabase.from('profiles').update({
          ai_queries_today: 0,
          ai_queries_reset_at: now.toISOString(),
        }).eq('id', session.user.id)
      } else if ((profile?.ai_queries_today ?? 0) >= 15) {
        return NextResponse.json(
          { error: 'Daily limit of 15 queries reached. Upgrade to Premium for unlimited queries.' },
          { status: 429 }
        )
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
      // Determine if UUID or slug
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
    }

    // ── Generate query embedding ─────────────────────────────────────────────
    let queryEmbedding: number[] = []

    if (process.env.GEMINI_API_KEY && genAI) {
      const embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })
      const embeddingResult = await embeddingModel.embedContent(message)
      queryEmbedding = embeddingResult.embedding.values
    } else if (process.env.OPENROUTER_API_KEY) {
      const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
      })
      const response = await openai.embeddings.create({
        model: 'openai/text-embedding-3-small',
        input: message,
      })
      queryEmbedding = response.data[0].embedding
    } else {
      return NextResponse.json({ error: 'AI integration keys not configured.' }, { status: 500 })
    }

    // ── Vector similarity search ─────────────────────────────────────────────
    const { data: chunks } = await supabase.rpc('match_lesson_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.65,
      match_count: 5,
    })

    // ── Build context from retrieved chunks ───────────────────────────────────
    let context = chunks && chunks.length > 0
      ? (chunks as LessonChunk[]).map((c) => `[From lesson: "${c.lesson_title}"]\n${c.content}`).join('\n\n---\n\n')
      : ''

    if (lessonContext) {
      context = `${lessonContext}\n\n---\n\n${context}`
    }

    let sources = chunks && chunks.length > 0
      ? Array.from(new Map((chunks as LessonChunk[]).map((c) => [c.lesson_slug, { title: c.lesson_title, slug: c.lesson_slug }])).values()).slice(0, 3)
      : []

    if (lessonSources.length > 0) {
      const existing = new Set(sources.map(s => s.slug))
      lessonSources.forEach(s => {
        if (!existing.has(s.slug)) {
          sources = [s, ...sources]
        }
      })
    }

    // ── System instruction ────────────────────────────────────────────────────
    const systemInstruction = `You are the PolymerHub AI Tutor — an expert polymer engineering educator for Indian B.Tech PPE (Plastic Polymer Engineering) students.

Your knowledge is grounded in PolymerHub's curriculum covering: Polymer Chemistry, Polymer Processing, Mould Design, Polymer Testing, Rubber Technology, Recycling Technology, Sustainable Plastics & Bioplastics, Polymer Composites, Entrepreneurship in Plastics, and Medical Plastics & Biomaterials.

CORE RULES:
1. Always answer from the lesson context provided when relevant
2. Connect theory to Indian industry examples (Reliance, Supreme Industries, MRF, CIPET, etc.)
3. Use precise technical terms but explain them clearly
4. When context is insufficient, say so honestly and answer from general polymer knowledge
5. Keep answers focused and educational — you are a tutor, not a chatbot
6. Remember the conversation history and build on previous questions naturally
7. If a student asks a follow-up, connect it explicitly to what was discussed before

ANSWER FORMAT:
- Lead with the direct answer (1-2 sentences)
- Expand with explanation (3-5 sentences)
- Include a practical example or Indian industry connection where relevant
- Keep total response under 250 words unless the question genuinely requires more depth

${context ? `\nRELEVANT LESSON CONTENT:\n${context}` : '\nNote: No specific lesson content was retrieved for this query — answer from general polymer engineering knowledge.'}`

    let answer = ''

    if (process.env.OPENROUTER_API_KEY) {
      const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://polymer-hub-six.vercel.app',
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

      const response = await openai.chat.completions.create({
        model: 'google/gemini-2.5-flash',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        messages: openRouterMessages as any,
        temperature: 0.3,
        max_tokens: 1024,
      })

      answer = response.choices[0].message.content || ''
    } else if (process.env.GEMINI_API_KEY && genAI) {
      // ── Build conversation history for Gemini ────────────────────────────────
      const conversationHistory = history.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction,
      })

      const chat = model.startChat({
        history: conversationHistory,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.3,
        },
      })

      const result = await chat.sendMessage(message)
      answer = result.response.text()
    } else {
      return NextResponse.json({ error: 'AI configuration is missing.' }, { status: 500 })
    }

    // ── Update query count ────────────────────────────────────────────────────
    if (!isPremium) {
      await supabase.from('profiles')
        .update({ ai_queries_today: (profile?.ai_queries_today ?? 0) + 1 })
        .eq('id', session.user.id)
    }

    return NextResponse.json({ answer, sources })

  } catch (error) {
    console.error('Chat API error:', error)

    if (error && typeof error === 'object' && 'status' in error && (error as { status?: number }).status === 429) {
      return NextResponse.json(
        { error: 'AI service temporarily busy. Please try again in a moment.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
