import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topic } = await req.json()

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: 'Topic is required.' }, { status: 400 })
    }

    const prompt = `You are a university professor in Plastic & Polymer Engineering.
Generate exactly 5 multiple-choice questions (MCQs) for B.Tech students on the topic: "${topic}".

Rules:
1. Cover chemistry, processing parameters, testing standards (ASTM/ISO), or troubleshooting where applicable.
2. The questions should be challenging, testing conceptual understanding and industrial applications.
3. Provide exactly 4 options (A, B, C, D) for each question.
4. Provide a detailed explanation explaining why the correct option is correct.

You must return a JSON array containing exactly 5 items, matching this JSON schema:
[
  {
    "question": "string (the question text)",
    "option_a": "string (option A text)",
    "option_b": "string (option B text)",
    "option_c": "string (option C text)",
    "option_d": "string (option D text)",
    "correct_option": "string (must be one of: 'A', 'B', 'C', 'D')",
    "explanation": "string (detailed explanation)"
  }
]`

    let responseText = ''

    if (process.env.OPENROUTER_API_KEY) {
      const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://polymer-hub-six.vercel.app',
          'X-Title': 'Polymer Hub of India',
        }
      })

      const response = await openai.chat.completions.create({
        model: 'google/gemini-flash-1.5',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      })

      responseText = response.choices[0].message.content || ''
    } else if (process.env.GEMINI_API_KEY && genAI) {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      })
      const result = await model.generateContent(prompt)
      responseText = result.response.text()
    } else {
      return NextResponse.json({ error: 'AI configuration is missing.' }, { status: 500 })
    }

    if (!responseText) {
      throw new Error('Empty response from AI engine')
    }

    // Clean JSON response if it contains markdown code fences
    let cleanText = responseText.trim()
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7, cleanText.length - 3).trim()
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3, cleanText.length - 3).trim()
    }

    const questions = JSON.parse(cleanText)

    return NextResponse.json({ questions })
  } catch (error: unknown) {
    console.error('AI Quiz Generator error:', error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: message || 'Failed to generate quiz. Please try again.' },
      { status: 500 }
    )
  }
}
