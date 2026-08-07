'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Brain, FlaskConical, Recycle, Wrench } from 'lucide-react'

// ─── Subject data ───────────────────
const SUBJECTS = [
  {
    name: 'Polymer Chemistry',
    slug: 'polymer-chemistry',
    lessons: 15,
    color: '#1D4ED8',
    bg: '#EFF6FF',
    tag: 'Foundation',
    tagBg: '#1D4ED8',
    desc: 'Polymerization mechanisms, molecular structure, Tg and Tm, crystallinity, degradation, and stabilization — the science underneath everything else.',
    topics: ['Addition vs Condensation', 'Glass Transition (Tg)', 'Molecular Weight & MWD', 'Polymer Degradation', 'Ziegler-Natta Catalysis'],
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    indianCompany: 'Reliance Industries',
    globalCompany: 'BASF',
    icon: FlaskConical,
  },
  {
    name: 'Polymer Processing',
    slug: 'polymer-processing',
    lessons: 20,
    color: '#EA580C',
    bg: '#FFF7ED',
    tag: 'Manufacturing',
    tagBg: '#EA580C',
    desc: 'Injection moulding, extrusion, blow moulding, thermoforming — how molten polymer is shaped into every product you see around you.',
    topics: ['Injection Moulding Parameters', 'Extrusion & Screw Design', 'Blow Moulding', 'Melt Flow Index', 'Processing Defects'],
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    indianCompany: 'Supreme Industries',
    globalCompany: 'Engel',
    icon: Wrench,
  },
  {
    name: 'Mould Design',
    slug: 'mould-design',
    lessons: 12,
    color: '#EA580C',
    bg: '#FFF7ED',
    tag: 'Engineering',
    tagBg: '#EA580C',
    desc: 'Gate design, runner systems, cooling channels, ejection mechanisms, and the mould design principles that determine part quality before the machine starts.',
    topics: ['Gate Types & Selection', 'Cooling System Design', 'Runner Layout', 'Ejection Mechanisms', 'Shrinkage & Draft Angles'],
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
    indianCompany: 'Mold-Tek Technologies',
    globalCompany: 'Hasco',
    icon: Wrench,
  },
  {
    name: 'Polymer Testing',
    slug: 'polymer-testing',
    lessons: 10,
    color: '#7C3AED',
    bg: '#F5F3FF',
    tag: 'QA / QC',
    tagBg: '#7C3AED',
    desc: 'Tensile, flexural, impact, hardness, DSC, TGA, MFI, rheology — the tests that verify a material performs what the datasheet claims.',
    topics: ['Tensile & Flexural Testing', 'Izod & Charpy Impact', 'DSC / TGA Thermal Analysis', 'Shore Hardness', 'Rheological Testing'],
    image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=80',
    indianCompany: 'CIPET',
    globalCompany: 'Instron',
    icon: FlaskConical,
  },
  {
    name: 'Rubber Technology',
    slug: 'rubber-technology',
    lessons: 9,
    color: '#EA580C',
    bg: '#FFF7ED',
    tag: 'Elastomers',
    tagBg: '#EA580C',
    desc: 'Vulcanization chemistry, NR/SBR/EPDM/NBR selection, carbon black compounding, latex processing, and tyre construction.',
    topics: ['Vulcanization Systems', 'NR vs Synthetic Rubbers', 'Carbon Black Compounding', 'Latex Technology', 'Tyre Construction'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    indianCompany: 'MRF Limited',
    globalCompany: 'Lanxess',
    icon: FlaskConical,
  },
  {
    name: 'Recycling Technology',
    slug: 'recycling-technology',
    lessons: 12,
    color: '#15803D',
    bg: '#F0FDF4',
    tag: 'Circular Economy',
    tagBg: '#15803D',
    desc: 'Mechanical recycling, chemical recycling (pyrolysis, depolymerization), enzymatic PETase recycling, EPR compliance frameworks, and LCA.',
    topics: ['Mechanical Recycling & NIR Sorting', 'Pyrolysis to Fuel', 'Enzymatic (PETase) Recycling', 'India EPR Framework', 'Life Cycle Assessment'],
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    indianCompany: 'Dalmia Polypro',
    globalCompany: 'Carbios',
    icon: Recycle,
  },
  {
    name: 'Sustainable Plastics & Bioplastics',
    slug: 'sustainable-plastics',
    lessons: 18,
    color: '#15803D',
    bg: '#F0FDF4',
    tag: 'Bioplastics',
    tagBg: '#15803D',
    desc: 'PLA, PHA, bio-PE — the difference between bio-based, biodegradable, and compostable, and the engineering reality behind each claim.',
    topics: ['Bio-based vs Biodegradable vs Compostable', 'PLA: Properties & Processing', 'PHA from Bacteria', 'Mono-material Packaging Design', 'Drop-in Bio-based Polymers'],
    image: 'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=800&q=80',
    indianCompany: 'Ecogreen Bioplastics',
    globalCompany: 'NatureWorks',
    icon: Recycle,
  },
  {
    name: 'Polymer Composites',
    slug: 'polymer-composites',
    lessons: 16,
    color: '#1D4ED8',
    bg: '#EFF6FF',
    tag: 'Advanced Materials',
    tagBg: '#1D4ED8',
    desc: 'Glass fibre, carbon fibre, natural fibre composites — how to engineer materials with properties no single polymer can achieve alone.',
    topics: ['Matrix & Reinforcement Interface', 'GFRP: Processing & Applications', 'CFRP: Aerospace to Automotive', 'Short Fibre Injection Moulding', 'Natural Fibre: Jute, Coir, Bamboo'],
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    indianCompany: 'Tata Advanced Materials',
    globalCompany: 'Hexcel',
    icon: FlaskConical,
  },
  {
    name: 'Entrepreneurship in Plastics',
    slug: 'entrepreneurship-plastics',
    lessons: 11,
    color: '#CA8A04',
    bg: '#FEFCE8',
    tag: 'Business',
    tagBg: '#CA8A04',
    desc: 'Build a real plastics business — from ₹10L bubble wrap units to ₹2Cr recycling plants. MUDRA, PMEGP, BIS certification, DPR writing.',
    topics: ['₹10–25L Entry Tier Products', '₹25–75L Masterbatch & Fittings', '₹75L–2Cr Pipe & Recycling Plants', 'Government Funding Schemes', 'BIS Certification & Export'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    indianCompany: 'Supreme Industries (origin)',
    globalCompany: 'PLEXCONCIL',
    icon: BookOpen,
  },
  {
    name: 'Medical Plastics & Biomaterials',
    slug: 'medical-plastics',
    lessons: 12,
    color: '#7C3AED',
    bg: '#F5F3FF',
    tag: 'Specialised',
    tagBg: '#7C3AED',
    desc: 'ISO 10993 biocompatibility, medical-grade PVC/PP/PEEK, sterilization methods, implantable polymers, cleanroom moulding, ISO 13485.',
    topics: ['ISO 10993 Biocompatibility', 'Medical-Grade Polymers', 'Sterilization Compatibility', 'PEEK & UHMWPE Implants', 'Cleanroom ISO 13485'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
    indianCompany: 'HMD Syringes',
    globalCompany: 'Medtronic',
    icon: FlaskConical,
  },
  {
    name: 'Polymer Rheology',
    slug: 'polymer-rheology',
    lessons: 9,
    color: '#EA580C',
    bg: '#FFF7ED',
    tag: 'Advanced',
    tagBg: '#EA580C',
    desc: 'Shear-thinning, viscoelasticity, capillary rheometry, melt fracture, WLF equation.',
    topics: ['Shear-thinning', 'Viscoelasticity', 'Capillary Rheometry', 'Melt Fracture', 'WLF Equation'],
    image: 'https://images.unsplash.com/photo-1544257121-654dbcc18e5e?w=800&q=80',
    indianCompany: 'Reliance Industries',
    globalCompany: 'TA Instruments',
    icon: Wrench,
  },
  {
    name: 'Additives & Compounding',
    slug: 'additives-compounding',
    lessons: 16,
    color: '#1D4ED8',
    bg: '#EFF6FF',
    tag: 'Formulation',
    tagBg: '#1D4ED8',
    desc: 'Antioxidants, UV stabilizers, plasticizers, flame retardants, twin-screw compounding.',
    topics: ['Antioxidants', 'UV Stabilizers', 'Plasticizers', 'Flame Retardants', 'Twin-Screw Compounding'],
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&q=80',
    indianCompany: 'Plastiblends India',
    globalCompany: 'Clariant',
    icon: FlaskConical,
  },
  {
    name: 'Plastic Packaging Engineering',
    slug: 'plastic-packaging-engineering',
    lessons: 16,
    color: '#15803D',
    bg: '#F0FDF4',
    tag: 'Application',
    tagBg: '#15803D',
    desc: 'Barrier properties, multilayer films, PET bottles, food contact regulations, sustainable design.',
    topics: ['Barrier Properties', 'Multilayer Films', 'PET Bottles', 'Food Contact', 'Sustainable Design'],
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&q=80',
    indianCompany: 'Uflex Limited',
    globalCompany: 'Amcor',
    icon: Recycle,
  },
  {
    name: 'Life Cycle Assessment',
    slug: 'life-cycle-assessment',
    lessons: 8,
    color: '#15803D',
    bg: '#F0FDF4',
    tag: 'Sustainability',
    tagBg: '#15803D',
    desc: 'ISO 14040, carbon footprint, LCA of packaging, GWP calculations, EPR connection.',
    topics: ['ISO 14040', 'Carbon Footprint', 'LCA of Packaging', 'GWP Calculations', 'EPR Connection'],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    indianCompany: 'EPR India',
    globalCompany: 'Sphera',
    icon: Recycle,
  },
  {
    name: 'Color Science & Masterbatches',
    slug: 'color-science-masterbatches',
    lessons: 8,
    color: '#CA8A04',
    bg: '#FEFCE8',
    tag: 'Design',
    tagBg: '#CA8A04',
    desc: 'TiO2, organic pigments, spectrophotometry, Delta E, masterbatch formulation.',
    topics: ['TiO2', 'Organic Pigments', 'Spectrophotometry', 'Delta E', 'Masterbatch Formulation'],
    image: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=800&q=80',
    indianCompany: 'Poddar Pigments',
    globalCompany: 'Avient',
    icon: Wrench,
  },
  {
    name: 'Polymer Nanotechnology',
    slug: 'polymer-nanotechnology',
    lessons: 6,
    color: '#1D4ED8',
    bg: '#EFF6FF',
    tag: 'Nanotech',
    tagBg: '#1D4ED8',
    desc: 'Nanocomposites, carbon nanotubes, nanoclay, properties enhancement, characterization.',
    topics: ['Carbon Nanotubes', 'Nanoclay & Graphene', 'Properties Enhancement', 'TEM & SEM Characterization', 'Exfoliation vs Intercalation'],
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    indianCompany: 'Aditya Birla Science & Tech',
    globalCompany: 'Arkema',
    icon: FlaskConical,
  },
  {
    name: 'Bioprocessing & Fermentation',
    slug: 'bioprocessing-fermentation',
    lessons: 6,
    color: '#15803D',
    bg: '#F0FDF4',
    tag: 'Biotech',
    tagBg: '#15803D',
    desc: 'Microbial synthesis of PHA, fermentation parameters, feedstock purification, downstream recovery.',
    topics: ['Microbial PHA Synthesis', 'Bioreactor Design', 'Carbon Feedstocks', 'Downstream Processing', 'Sterilization Protocols'],
    image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=800&q=80',
    indianCompany: 'Praji Industries',
    globalCompany: 'Genomatica',
    icon: Recycle,
  },
  {
    name: 'Robotics in Plastics Manufacturing',
    slug: 'robotics-plastics',
    lessons: 6,
    color: '#EA580C',
    bg: '#FFF7ED',
    tag: 'Automation',
    tagBg: '#EA580C',
    desc: 'Part retrieval, degating robots, insert molding automation, cobots in compounding & packaging.',
    topics: ['Cartesian & Articulated Robots', 'Degating & Sprue Removal', 'EOAT Design', 'PLC & Robot Integration', 'Safety Interlocks'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    indianCompany: 'Yaskawa India',
    globalCompany: 'Kuka',
    icon: Wrench,
  },
  {
    name: 'Digital Twins in Polymer Manufacturing',
    slug: 'digital-twins-plastics',
    lessons: 6,
    color: '#CA8A04',
    bg: '#FEFCE8',
    tag: 'Industry 4.0',
    tagBg: '#CA8A04',
    desc: 'Real-time cavity pressure matching, machine learning in extrusion, predictive maintenance.',
    topics: ['Sensorized Moulds', 'Real-time CAE Correction', 'ML Quality Prediction', 'IIoT Edge Nodes', 'Predictive Screw Wear'],
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&q=80',
    indianCompany: 'Tata Technologies',
    globalCompany: 'Kautex',
    icon: Brain,
  }
]

const DOMAIN_BANDS = [
  { color: '#1D4ED8', bg: '#EFF6FF', label: 'Chemistry & Science', subjects: ['Polymer Chemistry', 'Polymer Composites', 'Additives & Compounding', 'Polymer Nanotechnology'] },
  { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', subjects: ['Polymer Processing', 'Mould Design', 'Rubber Technology', 'Polymer Rheology', 'Robotics in Plastics Manufacturing'] },
  { color: '#7C3AED', bg: '#F5F3FF', label: 'Testing & Medical', subjects: ['Polymer Testing', 'Medical Plastics & Biomaterials'] },
  { color: '#15803D', bg: '#F0FDF4', label: 'Sustainability & Circular Economy', subjects: ['Recycling Technology', 'Sustainable Plastics & Bioplastics', 'Life Cycle Assessment', 'Plastic Packaging Engineering', 'Bioprocessing & Fermentation'] },
  { color: '#CA8A04', bg: '#FEFCE8', label: 'Business & Automation', subjects: ['Entrepreneurship in Plastics', 'Color Science & Masterbatches', 'Digital Twins in Polymer Manufacturing'] },
]

// ─── Components ───────────────────────────────────────────────────────────────

function SubjectCard({ subject, featured = false }: { subject: typeof SUBJECTS[0]; featured?: boolean }) {
  return (
    <Link
      href={`/subjects/${subject.slug}`}
      className="group block border-4 border-ink bg-canvas overflow-hidden"
      style={{
        boxShadow: `4px 4px 0px 0px ${subject.color}`,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translate(-3px, -3px)'
        el.style.boxShadow = `7px 7px 0px 0px ${subject.color}`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translate(0, 0)'
        el.style.boxShadow = `4px 4px 0px 0px ${subject.color}`
      }}
    >
      {/* Image zone */}
      <div className="relative overflow-hidden border-b-4 border-ink" style={{ height: featured ? '220px' : '160px' }}>
        <img
          src={subject.image}
          alt={subject.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0" style={{ backgroundColor: subject.color + 'CC' }} />

        {/* Tag */}
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[10px] font-black text-white border-2 border-white px-2 py-0.5 uppercase tracking-widest bg-transparent">
            {subject.tag}
          </span>
        </div>

        {/* Lesson count */}
        <div className="absolute top-3 right-3">
          <span className="font-mono text-[10px] font-black text-white border-2 border-white px-2 py-0.5">
            {subject.lessons} LESSONS
          </span>
        </div>

        {/* Subject name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-xl font-black text-white leading-tight">
            {subject.name}
          </h3>
        </div>
      </div>

      {/* Content zone */}
      <div className="p-5" style={{ backgroundColor: subject.bg }}>
        <p className="text-sm text-ink/70 leading-relaxed mb-4">{subject.desc}</p>

        {/* Topic pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {subject.topics.slice(0, 3).map((t) => (
            <span
              key={t}
              className="font-mono text-[9px] font-bold border-2 px-2 py-0.5 uppercase tracking-wider"
              style={{ borderColor: subject.color, color: subject.color }}
            >
              {t}
            </span>
          ))}
          {subject.topics.length > 3 && (
            <span className="font-mono text-[9px] font-bold border-2 border-ink/30 text-ink/50 px-2 py-0.5 uppercase tracking-wider">
              +{subject.topics.length - 3} more
            </span>
          )}
        </div>

        {/* Companies */}
        <div className="flex items-center justify-between border-t-2 border-ink/10 pt-3">
          <div className="flex gap-3">
            <span className="font-mono text-[9px] text-ink/50 flex items-center gap-1">
              <span className="text-[10px]">🇮🇳</span> {subject.indianCompany}
            </span>
            <span className="font-mono text-[9px] text-ink/50 flex items-center gap-1">
              <span className="text-[10px]">🌍</span> {subject.globalCompany}
            </span>
          </div>
          <span
            className="font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1 group-hover:underline"
            style={{ color: subject.color, textDecorationColor: subject.color }}
          >
            Start <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-canvas">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="border-b-4 border-ink bg-ink px-6 md:px-12 py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 animate-blob-pulse" style={{ backgroundColor: '#EA580C', filter: 'blur(40px)' }} />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full opacity-10 animate-blob-pulse" style={{ backgroundColor: '#1D4ED8', filter: 'blur(30px)', animationDelay: '3s' }} />

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-yellow-bright border-4 border-yellow-bright flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-ink" />
            </div>
            <span className="font-mono text-xs font-bold text-yellow-bright uppercase tracking-widest border-2 border-yellow-bright px-3 py-1">
              19 Subjects · 216 Lessons
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-black text-white leading-none mb-4">
            THE COMPLETE<br />
            <span className="text-yellow-bright italic">PPE CURRICULUM</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Every subject mapped to real industry — Indian companies, global benchmarks, career paths, and the AI Tutor that knows every lesson.
          </p>
        </div>
      </section>

      {/* ── DOMAIN LEGEND ────────────────────────────────────── */}
      <section className="border-b-4 border-ink overflow-x-auto">
        <div className="flex divide-x-4 divide-ink min-w-max md:min-w-0">
          {DOMAIN_BANDS.map((band) => (
            <div key={band.label} className="flex items-center gap-3 px-5 py-3 flex-shrink-0" style={{ backgroundColor: band.bg }}>
              <div className="w-4 h-4 border-2 border-ink" style={{ backgroundColor: band.color }} />
              <div>
                <div className="font-mono text-[9px] font-bold uppercase tracking-widest" style={{ color: band.color }}>
                  {band.label}
                </div>
                <div className="font-mono text-[9px] text-ink/50">{band.subjects.join(' · ')}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECTS GRID ────────────────────────────────────── */}
      <section className="p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Row 1: Chemistry (featured, 2/3) + Processing (1/3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[0]} featured />
            </div>
            <SubjectCard subject={SUBJECTS[1]} />
          </div>

          {/* Row 2: Mould + Testing + Rubber */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <SubjectCard subject={SUBJECTS[2]} />
            <SubjectCard subject={SUBJECTS[3]} />
            <SubjectCard subject={SUBJECTS[4]} />
          </div>

          {/* Quote break */}
          <div className="border-4 border-green bg-green p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">The fastest-growing career track</p>
              <p className="font-display text-2xl md:text-3xl font-black text-white leading-tight">
                Recycling & Sustainability — 6 lessons covering the circular economy from EPR policy to enzymatic recycling.
              </p>
            </div>
            <Link href="/subjects/recycling-technology" className="cn-btn bg-white text-green border-white flex-shrink-0">
              Start Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Row 3: Recycling (featured, 2/3) + Sustainable (1/3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[5]} featured />
            </div>
            <SubjectCard subject={SUBJECTS[6]} />
          </div>

          {/* Row 4: Composites + Entrepreneurship + Medical */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <SubjectCard subject={SUBJECTS[7]} />
            <SubjectCard subject={SUBJECTS[8]} />
            <SubjectCard subject={SUBJECTS[9]} />
          </div>

          {/* Row 5: Packaging (featured, 2/3) + Rheology (1/3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[12]} featured />
            </div>
            <SubjectCard subject={SUBJECTS[10]} />
          </div>

          {/* Row 6: Additives + LCA + Color Science */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <SubjectCard subject={SUBJECTS[11]} />
            <SubjectCard subject={SUBJECTS[13]} />
            <SubjectCard subject={SUBJECTS[14]} />
          </div>

          {/* Row 7: Nanotech (featured, 2/3) + Biotech (1/3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[15]} featured />
            </div>
            <SubjectCard subject={SUBJECTS[16]} />
          </div>

          {/* Row 8: Digital Twins (featured, 2/3) + Robotics (1/3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <SubjectCard subject={SUBJECTS[18]} featured />
            </div>
            <SubjectCard subject={SUBJECTS[17]} />
          </div>
        </div>
      </section>

      {/* ── AI TUTOR CTA ─────────────────────────────────────── */}
      <section className="border-t-4 border-ink bg-ink px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="font-mono text-xs font-bold text-yellow-bright border-2 border-yellow-bright px-3 py-1 mb-4 inline-block uppercase tracking-widest">
              AI Tutor · Gemini RAG
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-black text-white leading-tight mb-3">
              Not sure where to start?<br />Ask the AI Tutor.
            </h2>
            <p className="text-white/60 max-w-lg leading-relaxed">
              Tell it your interests or your target career — it will point you to the right subject and lesson. Grounded in all 102 lessons via real vector similarity search.
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <Link href="/ai-tutor" className="cn-btn-yellow text-sm">
              <Brain className="w-4 h-4" /> Ask AI Tutor
            </Link>
            <Link href="/careers" className="cn-btn-white text-sm">
              <ArrowRight className="w-4 h-4" /> Career Roadmap
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
