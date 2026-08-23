'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Brain, FlaskConical, Recycle, Wrench, Sparkles, Compass } from 'lucide-react'

// ─── Subject data (19 Subjects) ────────────────────────────────────────────────

const SUBJECTS = [
  {
    name: 'Polymer Chemistry',
    slug: 'polymer-chemistry',
    lessons: 15,
    color: '#1D4ED8',
    bg: '#EFF6FF',
    tag: 'Foundation',
    tagBg: '#1D4ED8',
    desc: 'Polymerization mechanisms, molecular structure, Tg and Tm, crystallinity, degradation, and stabilization — the underlying chemical physics.',
    topics: ['Addition vs Condensation', 'Glass Transition (Tg)', 'Molecular Weight & MWD', 'Degradation Kinetics', 'Ziegler-Natta Catalysis'],
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
    desc: 'Injection moulding, extrusion, blow moulding, thermoforming — how molten polymer is shaped into structural automotive and packaging parts.',
    topics: ['Injection Parameters', 'Extrusion Screw Design', 'Blow Moulding', 'Melt Flow Index', 'Processing Defects'],
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
    desc: 'Gate design, runner layouts, cooling channel thermodynamics, ejection mechanisms, and parting line sealing tolerances.',
    topics: ['Gate Types & Selection', 'Cooling Circuit Layout', 'Runner Systems', 'Ejection Mechanisms', 'Shrinkage & Draft'],
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
    indianCompany: 'Mold-Tek Tech',
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
    desc: 'Tensile, flexural, Izod/Charpy impact, hardness, DSC, TGA, and capillary rheology — testing standards (ASTM / ISO / IS).',
    topics: ['Tensile & Flexural', 'Izod / Charpy Impact', 'DSC / TGA Thermal Analysis', 'Shore Hardness', 'Rheological Testing'],
    image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&q=80',
    indianCompany: 'CIPET Laboratories',
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
    desc: 'Vulcanization chemistry, NR/SBR/EPDM/NBR selection, carbon black compounding, latex dipping, and radial tyre construction.',
    topics: ['Vulcanization Systems', 'NR vs Synthetic Rubber', 'Carbon Black Formulations', 'Latex Technology', 'Tyre Construction'],
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
    tag: 'Circularity',
    tagBg: '#15803D',
    desc: 'Mechanical NIR sorting, chemical pyrolysis depolymerization, enzymatic PETase recycling, and India MoEFCC EPR compliance.',
    topics: ['Mechanical NIR Sorting', 'Pyrolysis to Monomers', 'Enzymatic Recycling', 'EPR Framework 2026', 'Life Cycle Assessment'],
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
    desc: 'PLA, PHA, bio-PE — bio-based vs biodegradable vs compostable definitions and industrial processing windows.',
    topics: ['Bio-based vs Compostable', 'PLA Properties & Extrusion', 'Microbial PHA', 'Mono-material Barrier Films', 'Drop-in Bio-PE'],
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
    desc: 'Glass fibre, carbon fibre, and natural jute/coir composites — aerospace lightweighting and automotive structural components.',
    topics: ['Matrix-Fibre Interface', 'GFRP Autoclave Moulding', 'CFRP Aerospace Laminates', 'Short Fibre Extrusion', 'Natural Jute Composites'],
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
    desc: 'Build a real plastics business — from ₹10L blow film units to ₹2Cr recycling plants. MUDRA, PMEGP, and BIS certification.',
    topics: ['₹10–25L Entry Tier Units', '₹25–75L Masterbatch Plants', '₹75L–2Cr Pipe Extrusion', 'PMEGP / MUDRA Subsidies', 'BIS & Export Norms'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    indianCompany: 'Supreme Industries',
    globalCompany: 'PLEXCONCIL',
    icon: BookOpen,
  },
  {
    name: 'Medical Plastics & Biomaterials',
    slug: 'medical-plastics',
    lessons: 12,
    color: '#7C3AED',
    bg: '#F5F3FF',
    tag: 'Healthcare',
    tagBg: '#7C3AED',
    desc: 'ISO 10993 biocompatibility, medical PVC/PP/PEEK, gamma/EtO sterilization, implantable polymers, and ISO 13485 cleanroom molding.',
    topics: ['ISO 10993 Biocompatibility', 'Medical-Grade Resins', 'EtO & Gamma Sterilization', 'PEEK & UHMWPE Implants', 'ISO 13485 Cleanrooms'],
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
    desc: 'Shear-thinning, non-Newtonian viscoelasticity, capillary rheometry, melt fracture, die swell, and the WLF equation.',
    topics: ['Shear-Thinning Kinetics', 'Viscoelastic Moduli (G\', G\")', 'Capillary Rheometry', 'Melt Fracture Stress', 'WLF Equation'],
    image: 'https://images.unsplash.com/photo-1544257121-654dbcc18e5e?w=800&q=80',
    indianCompany: 'Reliance Petrochemicals',
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
    desc: 'Antioxidants, UV stabilizers, plasticizers, flame retardants, mineral fillers, and co-rotating twin-screw compounding.',
    topics: ['Antioxidant Packages', 'HALS UV Stabilizers', 'Plasticizer Migration', 'Non-Halogen Flame Retardants', 'Twin-Screw Compounding'],
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
    desc: 'Gas & moisture barrier properties, EVOH multilayer co-extrusion, PET preform blowing, and food contact migration safety.',
    topics: ['Oxygen/Water Barrier Math', '7-Layer Co-Extrusion', 'ISBM PET Bottles', 'FSSAI Food Contact Norms', 'Mono-PE Circular Pouches'],
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
    desc: 'ISO 14040 cradle-to-grave carbon footprinting, packaging LCA methodology, GWP calculations, and EPR offset trading.',
    topics: ['ISO 14040 Methodology', 'Cradle-to-Grave Carbon', 'Packaging LCA Modeling', 'Global Warming Potential (GWP)', 'EPR Trading Offsets'],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    indianCompany: 'EPR Credit India',
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
    desc: 'Rutile TiO2 opacity, organic/inorganic pigments, spectrophotometry (CIELAB ΔE), and carrier resin dispersion kinetics.',
    topics: ['TiO2 White Dispersion', 'Organic Chromophores', 'CIELAB ΔE Color Space', 'Spectrophotometry', 'Masterbatch Carrier Wax'],
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
    desc: 'Carbon nanotubes, exfoliated graphene, montmorillonite nanoclay, percolation thresholds, and TEM/SEM characterization.',
    topics: ['Carbon Nanotubes (CNTs)', 'Graphene & Organoclay', 'Barrier Percolation', 'TEM/SEM Micrographs', 'Intercalation Dynamics'],
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
    desc: 'Microbial fermentation of PHA/PHB, sugar/lipid carbon feedstocks, bioreactor control, and solvent-free downstream purification.',
    topics: ['Microbial PHA Synthesis', 'Bioreactor Agitation & DO', 'Agricultural Feedstocks', 'Downstream Cell Lysis', 'Sterility Controls'],
    image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=800&q=80',
    indianCompany: 'Praj Industries',
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
    desc: 'Cartesian part retrieval, ultrasonic degating robots, insert molding automation, and collaborative cobots in compounding.',
    topics: ['Cartesian & 6-Axis Robots', 'Degating & Sprue Removal', 'EOAT Vacuum Grippers', 'PLC Machine Handshake', 'Safety Light Curtains'],
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
    desc: 'Cavity pressure sensor feedback, machine learning viscosity compensation in extrusion, and predictive screw barrel wear.',
    topics: ['Cavity Pressure Sensors', 'Real-time CAE Correction', 'ML Defect Prediction', 'IIoT Edge Nodes', 'Predictive Screw Wear'],
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800&q=80',
    indianCompany: 'Tata Technologies',
    globalCompany: 'Kautex',
    icon: Brain,
  },
]

const DOMAIN_BANDS = [
  { color: '#1D4ED8', bg: '#EFF6FF', label: 'Chemistry & Science', subjects: ['Polymer Chemistry', 'Polymer Composites', 'Additives & Compounding', 'Polymer Nanotechnology'] },
  { color: '#EA580C', bg: '#FFF7ED', label: 'Processing & Manufacturing', subjects: ['Polymer Processing', 'Mould Design', 'Rubber Technology', 'Polymer Rheology', 'Robotics in Plastics'] },
  { color: '#7C3AED', bg: '#F5F3FF', label: 'Testing & Medical', subjects: ['Polymer Testing', 'Medical Plastics & Biomaterials'] },
  { color: '#15803D', bg: '#F0FDF4', label: 'Sustainability & Circularity', subjects: ['Recycling Technology', 'Sustainable Plastics', 'Life Cycle Assessment', 'Plastic Packaging', 'Bioprocessing'] },
  { color: '#CA8A04', bg: '#FEFCE8', label: 'Business & Automation', subjects: ['Entrepreneurship in Plastics', 'Color Science', 'Digital Twins'] },
]

// ─── Uniform Subject Card Component ──────────────────────────────────────────

function SubjectCard({ subject, featured = false }: { subject: typeof SUBJECTS[0]; featured?: boolean }) {
  return (
    <Link
      href={`/subjects/${subject.slug}`}
      className="group flex flex-col h-full border-2 border-slate-900 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 select-none"
    >
      {/* Visual Image Header */}
      <div className="relative overflow-hidden border-b-2 border-slate-200" style={{ height: featured ? '220px' : '160px' }}>
        <img
          src={subject.image}
          alt={subject.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Crisp bottom gradient ONLY for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

        {/* Top domain color strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: subject.color }} />

        {/* Tag & Lesson Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="font-mono text-[9px] font-bold text-white bg-slate-950/70 backdrop-blur-sm border border-white/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {subject.tag}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="font-mono text-[9px] font-bold text-white bg-slate-950/70 backdrop-blur-sm border border-white/30 px-2.5 py-0.5 rounded-full">
            {subject.lessons} Lessons
          </span>
        </div>

        {/* Subject Title */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-display text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md group-hover:text-amber-300 transition-colors">
            {subject.name}
          </h3>
        </div>
      </div>

      {/* Content & Metadata (Equalized Heights) */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white space-y-4">
        
        <div className="space-y-3">
          {/* Fixed minimum height on description for uniform alignment */}
          <p className="text-xs text-slate-600 leading-relaxed font-medium min-h-[48px] line-clamp-3">
            {subject.desc}
          </p>

          {/* Topic Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {subject.topics.slice(0, 3).map((t) => (
              <span
                key={t}
                className="font-mono text-[9px] font-semibold border px-2 py-0.5 rounded-md uppercase tracking-wider bg-slate-50 text-slate-700 border-slate-200"
              >
                {t}
              </span>
            ))}
            {subject.topics.length > 3 && (
              <span className="font-mono text-[9px] font-medium border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded-md uppercase">
                +{subject.topics.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Industrial Benchmark & Pushed Start Action */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 text-[11px] font-mono text-slate-500 font-medium truncate">
            <span className="truncate">🇮🇳 {subject.indianCompany}</span>
          </div>

          <span
            className="font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform flex-shrink-0"
            style={{ color: subject.color }}
          >
            Start &rarr;
          </span>
        </div>

      </div>
    </Link>
  )
}

// ─── Main Subjects Page ────────────────────────────────────────────────────────

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20">

      {/* ── HERO SECTION: Midnight Navy with Indian Tricolor Accent ── */}
      <section className="bg-[#0A1628] text-white py-16 md:py-20 px-4 sm:px-6 border-b-2 border-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              Complete B.Tech &middot; 19 Subjects &middot; 216 Lessons
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase">
            The Complete <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              PPE Curriculum
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Every subject mapped to real industry &mdash; Indian industrial benchmarks, global machinery leaders, career tracks, and the RAG AI Tutor grounded in every lesson.
          </p>

          {/* Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">19</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Core Subjects</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-400 block">216</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Curriculum Lessons</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-emerald-400 block">100%</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Industry Mapped</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOMAIN LEGEND ────────────────────────────────────── */}
      <section className="bg-white border-b-2 border-slate-900 overflow-x-auto shadow-sm">
        <div className="max-w-7xl mx-auto flex divide-x divide-slate-200 min-w-max md:min-w-0">
          {DOMAIN_BANDS.map((band) => (
            <div key={band.label} className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0" style={{ backgroundColor: band.bg }}>
              <div className="w-3.5 h-3.5 rounded-full border border-slate-900" style={{ backgroundColor: band.color }} />
              <div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: band.color }}>
                  {band.label}
                </div>
                <div className="font-mono text-[9px] text-slate-500 font-medium truncate">{band.subjects.join(' · ')}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECTS GRID ────────────────────────────────────── */}
      <section className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        
        {/* Row 1: Chemistry (featured, 2/3) + Processing (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SubjectCard subject={SUBJECTS[0]} featured />
          </div>
          <SubjectCard subject={SUBJECTS[1]} />
        </div>

        {/* Row 2: Mould + Testing + Rubber */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <SubjectCard subject={SUBJECTS[2]} />
          <SubjectCard subject={SUBJECTS[3]} />
          <SubjectCard subject={SUBJECTS[4]} />
        </div>

        {/* 🌟 Highlighted Sustainability Banner (High Contrast & Tactile) */}
        <div className="rounded-2xl border-2 border-slate-900 bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-950 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="font-mono text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-600/50 inline-block">
              🌱 Fastest-Growing Career Track
            </span>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
              Recycling &amp; Sustainability &mdash; 6 modules covering circular economy, chemical pyrolysis &amp; EPR.
            </h3>
            <p className="text-xs text-emerald-200/80 font-light">
              Master mechanical sorting, chemical recycling, and MoEFCC EPR credit guidelines for plastics.
            </p>
          </div>
          <Link 
            href="/subjects/recycling-technology" 
            className="px-6 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-slate-950 bg-[#F5C518] hover:bg-amber-400 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex-shrink-0 flex items-center gap-1.5"
          >
            Start Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Row 3: Recycling (featured, 2/3) + Sustainable (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SubjectCard subject={SUBJECTS[5]} featured />
          </div>
          <SubjectCard subject={SUBJECTS[6]} />
        </div>

        {/* Row 4: Composites + Entrepreneurship + Medical */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <SubjectCard subject={SUBJECTS[7]} />
          <SubjectCard subject={SUBJECTS[8]} />
          <SubjectCard subject={SUBJECTS[9]} />
        </div>

        {/* Row 5: Packaging (featured, 2/3) + Rheology (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SubjectCard subject={SUBJECTS[12]} featured />
          </div>
          <SubjectCard subject={SUBJECTS[10]} />
        </div>

        {/* Row 6: Additives + LCA + Color Science */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <SubjectCard subject={SUBJECTS[11]} />
          <SubjectCard subject={SUBJECTS[13]} />
          <SubjectCard subject={SUBJECTS[14]} />
        </div>

        {/* Row 7: Nanotech (featured, 2/3) + Biotech (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SubjectCard subject={SUBJECTS[15]} featured />
          </div>
          <SubjectCard subject={SUBJECTS[16]} />
        </div>

        {/* Row 8: Digital Twins (featured, 2/3) + Robotics (1/3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SubjectCard subject={SUBJECTS[18]} featured />
          </div>
          <SubjectCard subject={SUBJECTS[17]} />
        </div>

      </section>

      {/* ── BOTTOM AI TUTOR CTA SECTION ─────────────────────── */}
      <section className="bg-[#0A1628] text-white py-16 px-4 sm:px-6 border-t-2 border-slate-900 mt-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-amber-400 bg-white/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Tutor &middot; Gemini RAG
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase">
            Not sure where to start? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Ask the AI Tutor.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-light">
            Tell it your target career or research interests &mdash; it will recommend the exact curriculum sequence across all 216 lessons.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/ai-tutor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            >
              <Brain className="w-4 h-4" /> Ask the AI Tutor &rarr;
            </Link>

            <Link
              href="/careers"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-white/30 hover:border-white transition-all"
            >
              <Compass className="w-4 h-4" /> Career Roadmap
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-6 text-slate-400 text-xs font-mono">
            <span>🔒 DPDP 2023 Compliant</span>
            <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:inline" />
            <span>🎓 19 Subjects</span>
            <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:inline" />
            <span>📚 216+ Lessons</span>
            <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:inline" />
            <span>🇮🇳 Made in India</span>
          </div>

        </div>
      </section>

    </div>
  )
}
