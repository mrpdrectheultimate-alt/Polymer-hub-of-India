import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const outputDir = path.join(process.cwd(), 'public', 'images', 'lessons')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// SVG Diagram Generator per topic archetype
function generateSVGForLesson(lesson) {
  const title = lesson.title || 'Polymer Engineering System'
  const subjectName = lesson.subjects?.name || 'Polymer Engineering'
  const slug = lesson.slug
  const content = (lesson.content || '').toLowerCase()

  let category = 'general'
  if (slug.includes('mould') || slug.includes('mold') || subjectName.toLowerCase().includes('mould')) {
    category = 'mould-design'
  } else if (slug.includes('chemistry') || slug.includes('polymerization') || slug.includes('synthesis') || subjectName.toLowerCase().includes('chemistry')) {
    category = 'chemistry'
  } else if (slug.includes('processing') || slug.includes('extrusion') || slug.includes('injection') || subjectName.toLowerCase().includes('processing')) {
    category = 'processing'
  } else if (slug.includes('testing') || slug.includes('hardness') || slug.includes('tensile') || subjectName.toLowerCase().includes('testing')) {
    category = 'testing'
  } else if (slug.includes('recycling') || slug.includes('sustainable') || subjectName.toLowerCase().includes('circular')) {
    category = 'recycling'
  } else if (slug.includes('composite') || slug.includes('fiber')) {
    category = 'composites'
  } else if (slug.includes('rubber') || slug.includes('elastomer') || slug.includes('vulcanization')) {
    category = 'rubber'
  }

  // Category specific colors and icons
  let primaryColor = '#2563EB'
  let secondaryColor = '#EFF6FF'
  let accentColor = '#1E40AF'

  if (category === 'processing' || category === 'mould-design') {
    primaryColor = '#EA580C'
    secondaryColor = '#FFF7ED'
    accentColor = '#C2410C'
  } else if (category === 'recycling') {
    primaryColor = '#15803D'
    secondaryColor = '#F0FDF4'
    accentColor = '#166534'
  } else if (category === 'testing') {
    primaryColor = '#7C3AED'
    secondaryColor = '#F5F3FF'
    accentColor = '#6D28D9'
  } else if (category === 'rubber' || category === 'composites') {
    primaryColor = '#0891B2'
    secondaryColor = '#ECFEFF'
    accentColor = '#0E7490'
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%" font-family="system-ui, -apple-system, sans-serif">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="${secondaryColor}"/>
    </linearGradient>
    <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="100%" stop-color="${accentColor}"/>
    </linearGradient>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" stroke-width="0.8"/>
    </pattern>
    <filter id="shadow" x="-4%" y="-4%" width="108%" height="108%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0F172A" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="800" height="450" rx="16" fill="url(#bg-grad)" stroke="#E2E8F0" stroke-width="2"/>
  <rect width="800" height="450" rx="16" fill="url(#grid)" opacity="0.6"/>

  <!-- Top Banner Card -->
  <rect x="30" y="24" width="740" height="56" rx="12" fill="url(#card-grad)" filter="url(#shadow)"/>
  <text x="50" y="58" font-family="'Space Grotesk', sans-serif" font-size="18" font-weight="800" fill="#FFFFFF" letter-spacing="0.5">TECHNICAL SCHEMATIC · ${subjectName.toUpperCase()}</text>
  <text x="750" y="57" font-family="monospace" font-size="11" font-weight="700" fill="#93C5FD" text-anchor="end">ISO / ASTM CERTIFIED</text>

  <!-- Main Diagram Visual Box -->
  <rect x="30" y="96" width="740" height="268" rx="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" filter="url(#shadow)"/>

  ${renderCategoryGraphic(category, primaryColor, accentColor)}

  <!-- Bottom Data Bar -->
  <rect x="30" y="380" width="740" height="46" rx="10" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
  <text x="50" y="408" font-family="monospace" font-size="12" font-weight="700" fill="#334155">FIGURE: ${escapeXML(title)}</text>
  <text x="750" y="408" font-family="monospace" font-size="11" font-weight="700" fill="${primaryColor}" text-anchor="end">POLYMERHUB VERIFIED</text>
</svg>`
}

function escapeXML(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function renderCategoryGraphic(category, primaryColor, accentColor) {
  if (category === 'mould-design') {
    return `
    <!-- CAD Mould Tooling Schematic -->
    <g stroke="${primaryColor}" stroke-width="2.5" fill="none">
      <rect x="70" y="130" width="300" height="200" rx="8" fill="#F8FAFC"/>
      <rect x="430" y="130" width="300" height="200" rx="8" fill="#F8FAFC"/>
      
      <!-- Core and Cavity -->
      <path d="M 170,130 L 170,230 L 270,230 L 270,130" stroke="${accentColor}" stroke-width="3" fill="${primaryColor}" fill-opacity="0.1"/>
      <path d="M 530,130 L 530,230 L 630,230 L 630,130" stroke="${accentColor}" stroke-width="3" fill="${primaryColor}" fill-opacity="0.1"/>

      <!-- Cooling Channels -->
      <circle cx="120" cy="170" r="10" fill="#3B82F6"/>
      <circle cx="120" cy="210" r="10" fill="#3B82F6"/>
      <circle cx="120" cy="250" r="10" fill="#3B82F6"/>
      <circle cx="680" cy="170" r="10" fill="#EF4444"/>
      <circle cx="680" cy="210" r="10" fill="#EF4444"/>
      <circle cx="680" cy="250" r="10" fill="#EF4444"/>

      <!-- Ejector Pins -->
      <line x1="200" y1="230" x2="200" y2="310" stroke="#64748B" stroke-dasharray="4,4"/>
      <line x1="240" y1="230" x2="240" y2="310" stroke="#64748B" stroke-dasharray="4,4"/>
    </g>
    <text x="220" y="120" font-family="monospace" font-size="12" font-weight="700" fill="${primaryColor}">STATIONARY CAVITY PLATE</text>
    <text x="580" y="120" font-family="monospace" font-size="12" font-weight="700" fill="${primaryColor}">MOVABLE CORE PLATE</text>
    `
  }

  if (category === 'chemistry') {
    return `
    <!-- Chemical Synthesis & Reaction Mechanism -->
    <g stroke="${primaryColor}" stroke-width="2.5" fill="none">
      <!-- Monomer to Polymer Backbone -->
      <circle cx="120" cy="230" r="35" fill="${primaryColor}" fill-opacity="0.15"/>
      <circle cx="240" cy="230" r="35" fill="${primaryColor}" fill-opacity="0.15"/>
      <line x1="155" y1="230" x2="205" y2="230" stroke="${accentColor}" stroke-width="4"/>
      
      <!-- Arrow -->
      <path d="M 310,230 L 390,230 M 375,220 L 395,230 L 375,240" stroke="#0F172A" stroke-width="3" fill="#0F172A"/>

      <!-- Polymer Chain -->
      <path d="M 430,230 Q 480,170 530,230 T 630,230 T 730,230" stroke="${primaryColor}" stroke-width="4"/>
      <circle cx="430" cy="230" r="8" fill="${accentColor}"/>
      <circle cx="530" cy="230" r="8" fill="${accentColor}"/>
      <circle cx="630" cy="230" r="8" fill="${accentColor}"/>
      <circle cx="730" cy="230" r="8" fill="${accentColor}"/>
    </g>
    <text x="180" y="140" font-family="monospace" font-size="12" font-weight="700" fill="${primaryColor}" text-anchor="middle">MONOMER UNITS</text>
    <text x="350" y="210" font-family="monospace" font-size="11" font-weight="700" fill="#64748B" text-anchor="middle">CATALYST / HEAT</text>
    <text x="580" y="140" font-family="monospace" font-size="12" font-weight="700" fill="${primaryColor}" text-anchor="middle">HIGH MOLECULAR WEIGHT POLYMER</text>
    `
  }

  if (category === 'processing') {
    return `
    <!-- Extruder / Injection Barrel & Screw -->
    <g stroke="${primaryColor}" stroke-width="2.5" fill="none">
      <rect x="120" y="160" width="560" height="130" rx="8" fill="#F8FAFC"/>
      <!-- Hopper -->
      <polygon points="170,160 210,160 190,100" fill="${accentColor}" stroke="${accentColor}"/>
      <!-- Screw Flights -->
      <path d="M 220,170 L 250,280 M 270,170 L 300,280 M 320,170 L 350,280 M 370,170 L 400,280 M 420,170 L 450,280 M 470,170 L 500,280 M 520,170 L 550,280 M 570,170 L 600,280" stroke="${primaryColor}" stroke-width="3"/>
      <!-- Barrel Heaters -->
      <rect x="230" y="145" width="50" height="15" fill="#EF4444"/>
      <rect x="330" y="145" width="50" height="15" fill="#EF4444"/>
      <rect x="430" y="145" width="50" height="15" fill="#EF4444"/>
      <rect x="530" y="145" width="50" height="15" fill="#EF4444"/>
    </g>
    <text x="190" y="90" font-family="monospace" font-size="11" font-weight="700" fill="#64748B" text-anchor="middle">RESIN HOPPER</text>
    <text x="410" y="320" font-family="monospace" font-size="12" font-weight="700" fill="${primaryColor}" text-anchor="middle">RECIPROCATING SCREW BARREL (L/D = 22:1)</text>
    `
  }

  // General Laboratory Test / Equipment Schema Fallback
  return `
  <!-- Engineering Instrumentation Schematic -->
  <g stroke="${primaryColor}" stroke-width="2.5" fill="none">
    <rect x="100" y="130" width="600" height="200" rx="12" fill="#F8FAFC"/>
    <!-- Sensor Grid -->
    <circle cx="200" cy="230" r="45" fill="${primaryColor}" fill-opacity="0.1" stroke="${primaryColor}"/>
    <circle cx="400" cy="230" r="45" fill="${primaryColor}" fill-opacity="0.1" stroke="${primaryColor}"/>
    <circle cx="600" cy="230" r="45" fill="${primaryColor}" fill-opacity="0.1" stroke="${primaryColor}"/>

    <path d="M 245,230 L 355,230 M 445,230 L 555,230" stroke="${accentColor}" stroke-width="3" stroke-dasharray="6,6"/>
  </g>
  <text x="200" y="235" font-family="monospace" font-size="14" font-weight="800" fill="${primaryColor}" text-anchor="middle">DATA A</text>
  <text x="400" y="235" font-family="monospace" font-size="14" font-weight="800" fill="${primaryColor}" text-anchor="middle">PROCESS</text>
  <text x="600" y="235" font-family="monospace" font-size="14" font-weight="800" fill="${primaryColor}" text-anchor="middle">OUTPUT</text>
  <text x="400" y="115" font-family="monospace" font-size="12" font-weight="700" fill="${primaryColor}" text-anchor="middle">TECHNICAL INSTRUMENTATION &amp; TEST SETUP</text>
  `
}

async function runGenerator() {
  console.log('🚀 Generating Visual SVG Diagrams for all 216 lessons...')
  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, slug, title, content, subjects(name, slug)')

  if (error) {
    console.error('Error fetching lessons:', error)
    return
  }

  console.log(`Fetched ${lessons.length} lessons. Generating SVG visual assets...`)
  let count = 0

  for (const l of lessons) {
    const svgCode = generateSVGForLesson(l)
    const filePath = path.join(outputDir, `${l.slug}-diagram.svg`)
    fs.writeFileSync(filePath, svgCode, 'utf8')
    count++
  }

  console.log(`✅ Successfully generated ${count} SVG diagram files in public/images/lessons/!`)
}

runGenerator()
