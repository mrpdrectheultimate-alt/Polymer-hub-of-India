// scripts/generate_lesson_visual_mapping.mjs
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function generateMapping() {
  console.log('📌 Generating Deterministic 216-Lesson Topic Visual Mapping (lesson_visual_mapping.json)...')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, slug, title, subject_id, subjects(slug, name)')

  if (error) {
    console.error('❌ Error fetching lessons:', error)
    return
  }

  const mapping = {}

  for (const lesson of lessons) {
    const slug = lesson.slug
    const title = lesson.title
    const subjectSlug = lesson.subjects?.slug || 'polymer-chemistry'

    // Determine topic-matched primitive IDs
    let mechanismPrimitive = 'primitive-romp'
    let photoId = 'photo-injection-moulding-machine'
    let pfdType = 'standard-extrusion-pfd'
    let blueprintType = 'standard-mould-blueprint'

    if (subjectSlug.includes('chemistry') || slug.includes('polymerization') || slug.includes('synthesis')) {
      mechanismPrimitive = slug.includes('romp') ? 'primitive-romp' : slug.includes('radical') ? 'primitive-free-radical' : slug.includes('carothers') || slug.includes('gel') ? 'primitive-carothers' : 'primitive-reaction-kinetics'
      photoId = 'photo-testing-dsc-lab'
      pfdType = 'chemical-synthesis-pfd'
      blueprintType = 'reactor-vessel-blueprint'
    } else if (subjectSlug.includes('rheology') || slug.includes('viscosity') || slug.includes('flow')) {
      mechanismPrimitive = 'primitive-rheology-shear-thinning'
      photoId = 'photo-extrusion-strand-die'
      pfdType = 'rheological-characterization-pfd'
      blueprintType = 'capillary-die-blueprint'
    } else if (subjectSlug.includes('mould') || subjectSlug.includes('processing') || slug.includes('injection') || slug.includes('extrusion')) {
      mechanismPrimitive = slug.includes('screw') ? 'primitive-extrusion-screw' : 'primitive-spherulite'
      photoId = 'photo-mould-core-cavity-tooling'
      pfdType = 'molding-cycle-pfd'
      blueprintType = 'injection-mould-2cavity-blueprint'
    } else if (subjectSlug.includes('testing') || slug.includes('dsc') || slug.includes('tensile') || slug.includes('impact')) {
      mechanismPrimitive = slug.includes('dsc') ? 'primitive-dsc-thermogram' : slug.includes('tensile') ? 'primitive-tensile-stress-strain' : 'primitive-gpc-chromatogram'
      photoId = 'photo-testing-dsc-lab'
      pfdType = 'astm-iso-testing-pfd'
      blueprintType = 'tensile-specimen-dogbone-blueprint'
    } else if (subjectSlug.includes('recycling') || subjectSlug.includes('sustainable') || slug.includes('recycling') || slug.includes('pla') || slug.includes('pha')) {
      mechanismPrimitive = 'primitive-pyrolysis-recycling'
      photoId = 'photo-recycling-sorting-plant'
      pfdType = 'mechanical-recycling-wash-line-pfd'
      blueprintType = 'wash-line-hydrocyclone-blueprint'
    } else if (subjectSlug.includes('composites') || slug.includes('fiber') || slug.includes('rtm')) {
      mechanismPrimitive = 'primitive-composite-interphase'
      photoId = 'photo-composite-carbon-fiber'
      pfdType = 'rtm-resin-transfer-moulding-pfd'
      blueprintType = 'filament-winding-mandrel-blueprint'
    } else if (subjectSlug.includes('rubber') || slug.includes('vulcanization')) {
      mechanismPrimitive = 'primitive-vulcanization-sulfur'
      photoId = 'photo-rubber-vulcanization-press'
      pfdType = 'rubber-compounding-banbury-pfd'
      blueprintType = 'cure-rheometer-rotor-blueprint'
    } else if (subjectSlug.includes('medical') || slug.includes('scaffold') || slug.includes('drug')) {
      mechanismPrimitive = 'primitive-biomedical-scaffold'
      photoId = 'photo-biomedical-scaffold'
      pfdType = 'cleanroom-medical-molding-pfd'
      blueprintType = 'catheter-extrusion-die-blueprint'
    }

    mapping[slug] = {
      title,
      subjectSlug,
      visual1: { primitiveId: mechanismPrimitive, title: `${title} — Mechanism & Physics Diagram` },
      visual2: { photoId, caption: `Industrial photographic microscopy & real-world setup for ${title}.` },
      visual3: { pfdType, title: `${title} — Industrial Process Flow Diagram (PFD)` },
      visual4: { blueprintType, title: `${title} — CAD Tooling & Machine Geometry Blueprint` }
    }
  }

  fs.writeFileSync('scripts/lesson_visual_mapping.json', JSON.stringify(mapping, null, 2))
  console.log(`✅ Successfully generated deterministic visual mapping for all ${Object.keys(mapping).length} lessons in scripts/lesson_visual_mapping.json!`)
}

generateMapping()
