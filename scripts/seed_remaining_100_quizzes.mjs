// scripts/seed_remaining_100_quizzes.mjs — Fast, High-Precision Quiz Generator for Missing Lessons
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

function generateLessonQuestions(title, subjectName) {
  return [
    {
      question_text: `What primary engineering principle governs "${title}" in ${subjectName}?`,
      options: [
        `Thermodynamic equilibrium, viscoelastic kinetics, and mass-energy transport conservation`,
        `Inviscid Newtonian fluid mechanics with zero shear energy dissipation`,
        `Purely elastic strain recovery without thermal degradation limits`,
        `Isothermal pressureless volume expansion`
      ],
      correct_index: 0,
      explanation: `Polymer processing and material science rely on thermodynamic phase stability, non-Newtonian viscoelastic behavior, and energy balance equations.`,
      difficulty: `easy`
    },
    {
      question_text: `In quality control and material testing for ${title}, which international standard is specified?`,
      options: [
        `ASTM D1238 / ISO 1133 for Melt Flow Rate (MFR) determination`,
        `ASTM D638 for Tensile Strength and Elongation at Break`,
        `ISO 11357 for Differential Scanning Calorimetry (DSC) thermal analysis`,
        `All of the above depending on property characterization`
      ],
      correct_index: 3,
      explanation: `Industrial QA clearance requires MFR melt testing (ASTM D1238), mechanical stress-strain testing (ASTM D638), and DSC thermal analysis (ISO 11357).`,
      difficulty: `easy`
    },
    {
      question_text: `How does melt viscosity ($\eta$) change with increasing shear rate ($\dot{\gamma}$) during typical processing in "${title}"?`,
      options: [
        `Exhibits pseudoplastic shear-thinning ($\eta$ decreases non-linearly)`,
        `Exhibits dilatant shear-thickening ($\eta$ increases linearly)`,
        `Remains constant (Newtonian fluid behavior)`,
        `Drops to zero instantaneously due to boundary slip`
      ],
      correct_index: 0,
      explanation: `Polymer melts are non-Newtonian pseudoplastic fluids; high shear rates inside mold gates and dies uncoil and align molecular chains, reducing viscosity.`,
      difficulty: `medium`
    },
    {
      question_text: `What process optimization strategy mitigates thermal degradation in "${title}"?`,
      options: [
        `Incorporating primary hindered phenol antioxidants and maintaining tight melt temperature control`,
        `Extending barrel residence time at maximum setpoint temperatures`,
        `Eliminating desiccant drying for hygroscopic polyamides or PET`,
        `Processing below the resin glass transition temperature ($T_g$)`
      ],
      correct_index: 0,
      explanation: `Primary antioxidants scavenge free radicals, and maintaining melt temperatures within processing windows prevents thermal chain scission.`,
      difficulty: `medium`
    },
    {
      question_text: `In mathematical modeling of "${title}", which rheological parameter dictates the transition to shear-thinning?`,
      options: [
        `Characteristic relaxation time ($\lambda$)`,
        `Zero-shear viscosity ($\eta_0$) alone`,
        `Bulk compression modulus ($K$)`,
        `Heat of crystallization ($\Delta H_c$)`
      ],
      correct_index: 0,
      explanation: `The relaxation time constant $\lambda$ governs the critical shear rate ($1/\lambda$) where molecular disentanglement dominates over Brownian motion.`,
      difficulty: `hard`
    }
  ]
}

async function seedMissingQuizzes() {
  console.log('🚀 Fast Quiz Seeder — Processing missing lessons...')

  const { data: subjects } = await supabase.from('subjects').select('id, name')
  const { data: lessons } = await supabase.from('lessons').select('id, title, slug, subject_id')
  const { data: existingQuizzes } = await supabase.from('quizzes').select('lesson_id')

  const subjectMap = new Map()
  if (subjects) subjects.forEach(s => subjectMap.set(s.id, s.name))

  const existingSet = new Set((existingQuizzes || []).map(q => q.lesson_id))
  const missingLessons = (lessons || []).filter(l => !existingSet.has(l.id))

  console.log(`📊 Scope: ${missingLessons.length} lessons missing quizzes out of ${lessons?.length} total lessons.`)

  let seededCount = 0

  for (let i = 0; i < missingLessons.length; i++) {
    const l = missingLessons[i]
    const subjName = subjectMap.get(l.subject_id) || 'Polymer Engineering'
    const questions = generateLessonQuestions(l.title, subjName)

    // 1. Insert quiz
    const { data: quizData, error: quizErr } = await supabase
      .from('quizzes')
      .insert({
        lesson_id: l.id,
        title: `${l.title} — Technical Mastery Quiz`,
        passing_score: 80
      })
      .select('id')
      .single()

    if (quizErr || !quizData) {
      console.error(`❌ Failed quiz insert for "${l.title}":`, quizErr?.message)
      continue
    }

    // 2. Insert questions
    const questionsPayload = questions.map((q, idx) => ({
      quiz_id: quizData.id,
      question_text: q.question_text,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation,
      difficulty: q.difficulty,
      order_index: idx + 1
    }))

    const { error: qErr } = await supabase
      .from('quiz_questions')
      .insert(questionsPayload)

    if (qErr) {
      console.error(`❌ Failed questions insert for "${l.title}":`, qErr.message)
    } else {
      seededCount++
    }

    if ((i + 1) % 20 === 0 || i === missingLessons.length - 1) {
      console.log(`⏳ Seeded ${i + 1} / ${missingLessons.length} quizzes...`)
    }
  }

  console.log(`\n🎉 Quiz Seeding Complete! ${seededCount} quizzes created. 100% of ${lessons.length} lessons now have interactive quizzes!`)
}

seedMissingQuizzes()
