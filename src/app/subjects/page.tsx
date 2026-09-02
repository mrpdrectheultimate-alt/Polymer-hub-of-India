'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Sparkles, 
  Search,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Award,
  X,
  Play,
  Layers,
  Microscope,
  FlaskConical,
  Gauge,
  Ruler,
  Zap,
  Droplets,
  Beaker,
  Globe,
  Cpu,
  Recycle,
  Package,
  Building2,
  Brain,
  Stethoscope,
  Compass,
  CheckCircle2
} from 'lucide-react'
import Footer from '@/components/Footer'

// ==================== TYPES & DATA ====================

export interface SubjectItem {
  id: string
  slug: string
  name: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  bgColor: string
  lessons: number
  level: 'Foundation' | 'Core' | 'Advanced'
  tier: 'featured' | 'core' | 'specialization'
  description: string
  topics: string[]
  careers: string[]
  industry: string
  image: string
  indianCompany: string
  globalCompany: string
}

// ─── TIER 1: Featured Flagships (3) ───
const FEATURED_SUBJECTS: SubjectItem[] = [
  {
    id: 'chemistry',
    slug: 'polymer-chemistry',
    name: 'Polymer Chemistry',
    icon: FlaskConical,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 15,
    level: 'Foundation',
    tier: 'featured',
    description: 'Master polymerization mechanisms, reaction kinetics, thermodynamics, molecular weight distributions, and structure-property relationships.',
    topics: ['Addition vs Condensation', 'Glass Transition (Tg)', 'Molecular Weight & MWD', 'Degradation Kinetics', 'Ziegler-Natta Catalysis'],
    careers: ['R&D Polymer Scientist', 'Polymer Chemist', 'Materials Synthesis Engineer'],
    industry: 'Petrochemicals, Specialty Resins',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1000&q=80',
    indianCompany: 'Reliance Petrochemicals',
    globalCompany: 'BASF',
  },
  {
    id: 'processing',
    slug: 'polymer-processing',
    name: 'Polymer Processing',
    icon: Gauge,
    color: '#EA580C',
    bgColor: '#FFF7ED',
    lessons: 20,
    level: 'Core',
    tier: 'featured',
    description: 'Master industrial injection molding parameters, twin-screw extrusion, blow molding parison control, and thermoforming physics.',
    topics: ['Injection Cycle Dynamics', 'Extrusion Screw Geometry', 'Blow Molding Parison Control', 'Melt Fracture Prevention', 'Processing Defects Guide'],
    careers: ['Process Engineer', 'Injection Plant Manager', 'Extrusion Specialist'],
    industry: 'Automotive Plastics, Packaging',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1000&q=80',
    indianCompany: 'Supreme Industries',
    globalCompany: 'Engel Machinery',
  },
  {
    id: 'testing',
    slug: 'polymer-testing',
    name: 'Polymer Testing & Characterization',
    icon: Microscope,
    color: '#EF4444',
    bgColor: '#FDE8E8',
    lessons: 10,
    level: 'Core',
    tier: 'featured',
    description: 'Master tensile, Izod impact, DSC crystallization, TGA decomposition, DMA viscoelasticity, and Shore hardness to ASTM/ISO standards.',
    topics: ['ASTM D638 Tensile Testing', 'ASTM D256 Izod Impact', 'ASTM D3418 DSC Thermograms', 'ASTM E1131 TGA Decomposition', 'Capillary Rheometry'],
    careers: ['QA/QC Test Engineer', 'Analytical Lab Manager', 'Materials Failure Analyst'],
    industry: 'Quality Assurance, Testing Labs',
    image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=1000&q=80',
    indianCompany: 'CIPET Testing Laboratories',
    globalCompany: 'Instron Testing Systems',
  },
]

// ─── TIER 2: Core Engineering Fundamentals (8) ───
const CORE_SUBJECTS: SubjectItem[] = [
  {
    id: 'mould-design',
    slug: 'mould-design',
    name: 'Mould & Die Design',
    icon: Ruler,
    color: '#059669',
    bgColor: '#ECFDF5',
    lessons: 12,
    level: 'Advanced',
    tier: 'core',
    description: 'Learn injection tooling, conformal cooling thermodynamics, cold/hot runner gating, and Moldflow fill-pack-warp simulation.',
    topics: ['Submarine & Valve Gate Design', 'Conformal Cooling Geometry', 'Runner Balancing & Pressure Drop', 'Ejector Pin Placement', 'Shrinkage & Draft Calculations'],
    careers: ['Tooling Engineer', 'Mould CAD/CAM Designer', 'Product Development Engineer'],
    industry: 'Tooling, Die Manufacturing',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
    indianCompany: 'Mold-Tek Technologies',
    globalCompany: 'HASCO Tooling',
  },
  {
    id: 'rubber',
    slug: 'rubber-technology',
    name: 'Rubber & Elastomer Technology',
    icon: Zap,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    lessons: 9,
    level: 'Core',
    tier: 'core',
    description: 'Master sulfur vs peroxide vulcanization, carbon black compounding, Moving Die Rheometer (MDR) kinetics, and radial tire engineering.',
    topics: ['Sulfur & Peroxide Curing', 'NR, SBR, NBR, EPDM Formulations', 'Carbon Black Reinforcement', 'MDR ts2 & tc90 Cure Curves', 'Radial Tire Construction'],
    careers: ['Rubber Technologist', 'Tyre Compounder', 'Elastomer R&D Specialist'],
    industry: 'Tyres, Automotive Hoses & Seals',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    indianCompany: 'MRF Limited',
    globalCompany: 'Lanxess Elastomers',
  },
  {
    id: 'packaging',
    slug: 'plastic-packaging-engineering',
    name: 'Plastic Packaging Engineering',
    icon: Package,
    color: '#F59E0B',
    bgColor: '#FEF3E8',
    lessons: 16,
    level: 'Advanced',
    tier: 'core',
    description: 'Master OTR/WVTR barrier physics, 7-layer EVOH co-extrusion, ISBM PET preforms, and global FSSAI/FDA food contact migration rules.',
    topics: ['OTR & WVTR Gas Permeation', '7-Layer Co-Extruded Blown Films', 'PET Preform Stretch Blow Molding', 'FSSAI Food Contact Compliance', 'Mono-PE Recyclable Pouches'],
    careers: ['Packaging Development Engineer', 'Barrier Film Specialist', 'FMCG Packaging Lead'],
    industry: 'FMCG, Food & Beverage Packaging',
    image: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&q=80',
    indianCompany: 'Uflex Limited',
    globalCompany: 'Amcor Packaging',
  },
  {
    id: 'composites',
    slug: 'polymer-composites',
    name: 'Polymer Composites & Hybrids',
    icon: Layers,
    color: '#0D9488',
    bgColor: '#F0FDFA',
    lessons: 16,
    level: 'Advanced',
    tier: 'core',
    description: 'Master carbon/glass fiber interfaces, autoclave prepreg curing, resin transfer molding (RTM), and aerospace structural lightweighting.',
    topics: ['Fiber-Matrix Interfacial Adhesion', 'CFRP Aerospace Autoclave Cycles', 'Resin Transfer Molding (RTM)', 'Short Glass Fiber Compounding', 'Jute & Coir Natural Composites'],
    careers: ['Composites Design Engineer', 'Aerospace Structural Analyst', 'Lightweighting Specialist'],
    industry: 'Aerospace, Defense, EV Structural',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
    indianCompany: 'Tata Advanced Materials',
    globalCompany: 'Hexcel Composites',
  },
  {
    id: 'additives',
    slug: 'additives-compounding',
    name: 'Additives, Masterbatches & Compounding',
    icon: Beaker,
    color: '#6366F1',
    bgColor: '#EEF2FF',
    lessons: 16,
    level: 'Advanced',
    tier: 'core',
    description: 'Master phenolic antioxidants, HALS UV light stabilizers, non-halogen flame retardants, plasticizers, and twin-screw extruder compounding.',
    topics: ['Phenolic & Phosphite Synergism', 'HALS Photostabilization Mechanism', 'Non-Halogen Intumescent Retardants', 'Co-Rotating Twin-Screw L/D Zones', 'Masterbatch Color Matching'],
    careers: ['Compounding Specialist', 'Formulation Chemist', 'Masterbatch Plant Manager'],
    industry: 'Specialty Compounding, Additives',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&q=80',
    indianCompany: 'Plastiblends India',
    globalCompany: 'Clariant Masterbatches',
  },
  {
    id: 'sustainable',
    slug: 'sustainable-plastics',
    name: 'Sustainable Plastics & Biopolymers',
    icon: Recycle,
    color: '#16A34A',
    bgColor: '#F0FDF4',
    lessons: 18,
    level: 'Advanced',
    tier: 'core',
    description: 'Master PLA, microbial PHA, drop-in bio-PE, industrial composting ISO 17088 certification, and bio-circular monomer loops.',
    topics: ['Bio-Based vs Biodegradable vs Compostable', 'Poly Lactic Acid (PLA) Extrusion', 'Microbial Polyhydroxyalkanoates (PHA)', 'ISO 17088 Composting Norms', 'Drop-in Bio-Ethylene Technology'],
    careers: ['Sustainability Engineer', 'Bioplastics Formulation Lead', 'Circular Economy Consultant'],
    industry: 'Biomaterials, Sustainable Packaging',
    image: 'https://images.unsplash.com/photo-1569427830807-c1429cbabed9?w=800&q=80',
    indianCompany: 'Ecogreen Bioplastics',
    globalCompany: 'NatureWorks Ingeo',
  },
  {
    id: 'medical',
    slug: 'medical-plastics',
    name: 'Medical Plastics & Biomaterials',
    icon: Stethoscope,
    color: '#DB2777',
    bgColor: '#FDF2F8',
    lessons: 12,
    level: 'Advanced',
    tier: 'core',
    description: 'Master ISO 10993 cytotoxicity and hemocompatibility, gamma/EtO sterilization kinetics, PEEK implants, and ISO 13485 cleanrooms.',
    topics: ['ISO 10993 Biocompatibility Matrix', 'Medical Grade PVC, PP & PEEK', 'Gamma Radiation & EtO Sterilization', 'UHMWPE Orthopedic Joint Liners', 'ISO 13485 Class 10,000 Cleanrooms'],
    careers: ['Medical Device Engineer', 'Biomaterials R&D Scientist', 'Healthcare Regulatory Auditor'],
    industry: 'Medical Devices, Healthcare Implants',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
    indianCompany: 'Hindustan Syringes (HMD)',
    globalCompany: 'Medtronic',
  },
  {
    id: 'recycling',
    slug: 'recycling-technology',
    name: 'Advanced Recycling & Circular Economy',
    icon: Recycle,
    color: '#15803D',
    bgColor: '#F0FDF4',
    lessons: 12,
    level: 'Core',
    tier: 'core',
    description: 'Master high-speed NIR optical flake sorting, chemical pyrolysis to circular naphtha, enzymatic PET depolymerization, and India EPR rules.',
    topics: ['Near-Infrared (NIR) Flake Sorting', 'Pyrolysis Oil to Circular Crackers', 'Enzymatic PETase Depolymerization', 'MoEFCC India EPR Regulations', 'Bottle-to-Bottle rPET Decontamination'],
    careers: ['Recycling Process Engineer', 'EPR Compliance Manager', 'Circular Polymer Specialist'],
    industry: 'Plastics Recycling, Waste Management',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    indianCompany: 'Dalmia Polypro',
    globalCompany: 'Carbios France',
  },
]

// ─── TIER 3: Emerging Specializations (8) ───
const SPECIALIZATIONS: SubjectItem[] = [
  {
    id: 'rheology',
    slug: 'polymer-rheology',
    name: 'Polymer Rheology & Non-Newtonian Flow',
    icon: Droplets,
    color: '#0284C7',
    bgColor: '#F0F9FF',
    lessons: 9,
    level: 'Advanced',
    tier: 'specialization',
    description: 'Master shear-thinning pseudoplasticity, Cox-Merz rule, viscoelastic storage/loss moduli (G\', G\"), and extrudate swell physics.',
    topics: ['Power-Law & Carreau-Yasuda Models', 'Dynamic Oscillatory Shear (G\', G\")', 'Capillary Entry Pressure Loss (Bagley)', 'Melt Elasticity & Extrudate Swell', 'WLF Temperature Superposition'],
    careers: ['Rheologist', 'Polymer Melt Rheology Specialist', 'Simulation Engineer'],
    industry: 'Polymer Processing R&D, Characterization',
    image: 'https://images.unsplash.com/photo-1544257121-654dbcc18e5e?w=800&q=80',
    indianCompany: 'Reliance Petrochemicals R&D',
    globalCompany: 'TA Instruments',
  },
  {
    id: 'nanotech',
    slug: 'polymer-nanotechnology',
    name: 'Polymer Nanotechnology & Nanocomposites',
    icon: Microscope,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    lessons: 8,
    level: 'Advanced',
    tier: 'specialization',
    description: 'Master organoclay intercalation, carbon nanotube electrical percolation, graphene barrier skins, and nano-reinforced masterbatches.',
    topics: ['Montmorillonite Clay Intercalation', 'CNT Electrical Percolation Thresholds', 'Graphene Gas Barrier Flakes', 'In-Situ In-Melt Nanodispersion', 'Nano-Toxicity Safety Standards'],
    careers: ['Nanotechnology Scientist', 'Advanced Functional Materials Lead', 'Nano-Barrier Engineer'],
    industry: 'Nanotechnology, High-Barrier Films',
    image: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&q=80',
    indianCompany: 'Nanocellect India',
    globalCompany: 'Nanocyl Belgium',
  },
  {
    id: 'bioprocessing',
    slug: 'bioprocessing-biopolymers',
    name: 'Bioprocessing & Microbial Macromolecules',
    icon: FlaskConical,
    color: '#047857',
    bgColor: '#ECFDF5',
    lessons: 8,
    level: 'Advanced',
    tier: 'specialization',
    description: 'Master aerobic bacterial fermentation for PHA biosynthesis, downstream solvent extraction, and genetic promoter yield tuning.',
    topics: ['Cupriavidus necator Fermentation', 'Carbon Source Optimization (Waste Sugars)', 'Downstream Centrifugal Separation', 'Polymer Chain Length Biosynthesis', 'Scale-up Bioreactor Design'],
    careers: ['Bioprocess Engineer', 'Fermentation Specialist', 'Microbial Polymer Biochemist'],
    industry: 'Biotechnology, Industrial Microbiology',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
    indianCompany: 'Praj Industries',
    globalCompany: 'Danimer Scientific',
  },
  {
    id: 'robotics',
    slug: 'robotics-automation',
    name: 'Robotics & Automation in Plastics',
    icon: Cpu,
    color: '#DC2626',
    bgColor: '#FEF2F2',
    lessons: 8,
    level: 'Core',
    tier: 'specialization',
    description: 'Master 3-axis servo side-entry robots, IML (In-Mould Labeling) high-speed automation, and vision-guided degating cells.',
    topics: ['3-Axis & 6-Axis Robotic Take-Out', 'High-Speed In-Mould Labeling (IML)', 'Automated Hot Runner Degating', 'Machine Vision Defect Inspection', 'PLC & Industry 4.0 Euromap 77'],
    careers: ['Automation & Robotics Engineer', 'Plastics Factory Automation Lead', 'Vision Systems Specialist'],
    industry: 'Smart Factory Manufacturing, Automation',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    indianCompany: 'Wittmann Battenfeld India',
    globalCompany: 'Sepro Group',
  },
  {
    id: 'digital-twins',
    slug: 'digital-twins-ai',
    name: 'Digital Twins, AI & Smart Molding',
    icon: Brain,
    color: '#6D28D9',
    bgColor: '#F5F3FF',
    lessons: 8,
    level: 'Advanced',
    tier: 'specialization',
    description: 'Master cavity pressure sensor feedback loops, machine learning defect prediction, and additive manufacturing slicing physics.',
    topics: ['Piezoelectric Cavity Pressure Transducers', 'Real-Time Viscosity Auto-Correction', 'ML Flaw Classification Models', 'Digital Twin Machine Simulation', 'Additive FDM/SLA Polymeric Slicing'],
    careers: ['AI Manufacturing Engineer', 'Digital Twin Architect', 'Smart Moulding Specialist'],
    industry: 'Industry 4.0, Artificial Intelligence',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    indianCompany: 'Kistler India Instruments',
    globalCompany: 'RJG Smart Molding',
  },
  {
    id: 'color-science',
    slug: 'color-science-masterbatch',
    name: 'Color Science, Spectrophotometry & Pigments',
    icon: Beaker,
    color: '#E11D48',
    bgColor: '#FFF1F2',
    lessons: 8,
    level: 'Core',
    tier: 'specialization',
    description: 'Master CIE L*a*b* color coordinates, Delta-E 2000 tolerances, spectrophotometric color matching, and organic pigment dispersion.',
    topics: ['CIE L*a*b* Color Space & Illuminants', 'Delta-E (dE*ab / dE2000) Limits', 'Spectrophotometer D65/10 Calibration', 'Organic vs Inorganic Pigment Heat Stability', 'Metamerism Elimination Techniques'],
    careers: ['Color Matcher', 'Masterbatch QC Manager', 'Pigment Formulation Specialist'],
    industry: 'Color Masterbatch, Pigments',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
    indianCompany: 'Poddar Pigments',
    globalCompany: 'Avient Colorants',
  },
  {
    id: 'lca',
    slug: 'lca-sustainability',
    name: 'Life Cycle Assessment (LCA) & Carbon Footprint',
    icon: Globe,
    color: '#0891B2',
    bgColor: '#ECFEFF',
    lessons: 8,
    level: 'Core',
    tier: 'specialization',
    description: 'Master ISO 14040/14044 cradle-to-grave LCA boundary scopes, SimaPro/GaBi carbon modeling, and Scope 1-3 corporate emissions.',
    topics: ['ISO 14040 / 14044 LCA Frameworks', 'Cradle-to-Grave vs Cradle-to-Gate Scopes', 'Global Warming Potential (GWP kg CO2e)', 'SimaPro & Ecoinvent Database Auditing', 'EPR Plastic Credit Offset Math'],
    careers: ['LCA Analyst', 'ESG Carbon Footprint Lead', 'Sustainability Auditor'],
    industry: 'Sustainability Consulting, ESG Compliance',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
    indianCompany: 'GIST Impact India',
    globalCompany: 'Sphera GaBi',
  },
  {
    id: 'entrepreneurship',
    slug: 'entrepreneurship-plastics',
    name: 'Entrepreneurship & Factory Setup in Plastics',
    icon: Building2,
    color: '#CA8A04',
    bgColor: '#FEFCE8',
    lessons: 11,
    level: 'Core',
    tier: 'specialization',
    description: 'Build a profitable plastics manufacturing venture &mdash; from ₹10L blow film units to ₹2Cr recycling plants. MUDRA, PMEGP, and BIS certification.',
    topics: ['₹10–25L Entry Tier Units', '₹25–75L Masterbatch Plants', '₹75L–2Cr Pipe Extrusion', 'PMEGP / MUDRA Subsidies', 'BIS & Export Norms'],
    careers: ['Plastics Business Founder', 'Plant Director', 'Industrial Project Consultant'],
    industry: 'Entrepreneurship, SME Manufacturing',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    indianCompany: 'Supreme Industries',
    globalCompany: 'PLEXCONCIL India',
  },
]

const ALL_SUBJECTS: SubjectItem[] = [...FEATURED_SUBJECTS, ...CORE_SUBJECTS, ...SPECIALIZATIONS]

const LEVELS = ['All Levels', 'Foundation', 'Core', 'Advanced']

const STATS = [
  { value: '19', label: 'Curated Subjects', icon: BookOpen },
  { value: '216+', label: 'Master Lessons', icon: GraduationCap },
  { value: '100%', label: 'Industrial Mapped', icon: Play },
  { value: '500+', label: 'GATE & Industry MCQs', icon: Award },
]

// ==================== MAIN COMPONENT ====================

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Filtered Subject Catalog
  const filteredSubjects = useMemo(() => {
    return ALL_SUBJECTS.filter((subject) => {
      const matchesSearch =
        !searchQuery.trim() ||
        subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        subject.careers.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesLevel = selectedLevel === 'All Levels' || subject.level === selectedLevel

      // Persona Quick Path
      let matchesPersona = true
      if (selectedPersona === 'student') {
        matchesPersona = subject.level === 'Foundation' || subject.level === 'Core'
      } else if (selectedPersona === 'industry') {
        matchesPersona = subject.industry.toLowerCase().includes('processing') || subject.industry.toLowerCase().includes('manufacturing') || subject.id === 'testing' || subject.id === 'mould-design'
      } else if (selectedPersona === 'researcher') {
        matchesPersona = subject.level === 'Advanced' || subject.id === 'chemistry' || subject.id === 'nanotech' || subject.id === 'bioprocessing'
      } else if (selectedPersona === 'founder') {
        matchesPersona = subject.id === 'entrepreneurship' || subject.id === 'packaging' || subject.id === 'sustainable' || subject.id === 'recycling'
      }

      return matchesSearch && matchesLevel && matchesPersona
    })
  }, [searchQuery, selectedLevel, selectedPersona])

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO — Cinematic Navy & Emerald Gradient */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-[#0B172A] via-[#0A2E1A] to-[#0B172A] overflow-hidden py-16 lg:py-24 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#10B981]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA] text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
              📚 Complete PPE Curriculum Matrix
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] pb-1 tracking-tight">
              Master Polymer Engineering.
              <span className="block bg-gradient-to-r from-[#60A5FA] via-[#34D399] to-[#10B981] bg-clip-text text-transparent pb-3 pt-1 leading-[1.15]">
                19 Subjects, One Learning Universe.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed font-light">
              Every subject mapped to real industry &mdash; Indian industrial benchmarks, global machinery leaders, 
              career tracks, and the RAG AI Tutor grounded across 216+ master lessons.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
              {STATS.map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-sm"
                  >
                    <StatIcon className="h-5 w-5 text-[#34D399] shrink-0" />
                    <div>
                      <p className="text-white font-bold text-base sm:text-lg font-mono leading-none">{stat.value}</p>
                      <p className="text-slate-300 text-[10px] sm:text-xs font-mono uppercase mt-1">{stat.label}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Instant Search Bar */}
            <div className="relative mt-8 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search subjects, topics, careers, or standards (e.g. Mould Design, Injection Molding, ASTM)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-white/15 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder:text-slate-400 text-sm font-sans focus:outline-none focus:border-[#60A5FA] focus:ring-2 focus:ring-[#2563EB]/30 transition-all shadow-inner"
              />
            </div>
          </motion.div>
        </div>

        {/* Tricolor Bottom Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      </section>

      {/* ============================================================ */}
      {/* LEARNING PATH NAVIGATOR — "Where to Start" */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-4 sm:p-5"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#2563EB]" />
              <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider whitespace-nowrap">
                Guided Career Pathways:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'student', label: '🎓 Undergrad Student', path: 'Foundation → Core → Advanced' },
                { id: 'industry', label: '🏭 Plant & QC Engineer', path: 'Processing → Testing → Tooling' },
                { id: 'researcher', label: '🔬 R&D Scientist', path: 'Chemistry → Nanotech → Rheology' },
                { id: 'founder', label: '💼 Factory Founder', path: 'Entrepreneurship → Packaging → Circularity' },
              ].map((item) => {
                const isActive = selectedPersona === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPersona(isActive ? null : item.id)}
                    className={`
                      px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all
                      ${isActive
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }
                    `}
                  >
                    {item.label}
                  </button>
                )
              })}

              {selectedPersona && (
                <button
                  type="button"
                  onClick={() => setSelectedPersona(null)}
                  className="px-2.5 py-1 text-[11px] font-mono text-rose-600 hover:underline"
                >
                  Clear Pathway
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* LEVEL SELECTOR BAR */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mr-2">Level:</span>
            {LEVELS.map((lvl) => {
              const isSelected = selectedLevel === lvl
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`
                    px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all
                    ${isSelected
                      ? 'bg-[#2563EB] text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }
                  `}
                >
                  {lvl}
                </button>
              )
            })}
          </div>

          <span className="text-xs font-mono text-slate-500 font-bold">
            {filteredSubjects.length} of 19 subjects displayed
          </span>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TIER 1: FEATURED FLAGSHIP SUBJECTS (3) */}
      {/* ============================================================ */}
      {selectedLevel === 'All Levels' && !searchQuery && !selectedPersona && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#F5C518] uppercase tracking-wider">Tier 1 &middot; Flagship Disciplines</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827]">Core Pillars of Polymer Engineering</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_SUBJECTS.map((subject, index) => {
              const Icon = subject.icon
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -6 }}
                  onClick={() => window.location.href = `/subjects/${subject.slug}`}
                  className="group bg-white rounded-3xl border-2 border-slate-200 overflow-hidden hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition-all cursor-pointer flex flex-col justify-between"
                  style={{ borderColor: `${subject.color}40` }}
                >
                  <div>
                    {/* Blueprint Vector Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between" style={{ backgroundColor: subject.bgColor }}>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs" style={{ backgroundColor: 'white', borderColor: `${subject.color}40` }}>
                        <Icon className="h-7 w-7" style={{ color: subject.color }} />
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F5C518] text-slate-950 text-[10px] font-mono font-black uppercase tracking-wider shadow-xs">
                          ⭐ Featured
                        </span>
                        <span 
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white uppercase shadow-xs"
                          style={{ backgroundColor: subject.color }}
                        >
                          {subject.level}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div className="px-6 pt-5 pb-1">
                      <h3 className="font-black text-[#111827] text-xl leading-snug group-hover:text-[#2563EB] transition-colors font-display">
                        {subject.name}
                      </h3>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed font-light line-clamp-2">
                        {subject.description}
                      </p>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-1.5">
                        {subject.topics.slice(0, 3).map((topic) => (
                          <span key={topic} className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-mono font-medium">
                            {topic}
                          </span>
                        ))}
                        {subject.topics.length > 3 && (
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-mono">
                            +{subject.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span className="font-bold text-slate-900">{subject.lessons} Lessons</span>
                      <span className="w-px h-3 bg-slate-300" />
                      <span className="truncate max-w-[120px]">{subject.careers[0]}</span>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#2563EB] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Explore &rarr;
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* TIER 2: CORE ENGINEERING FUNDAMENTALS (8) */}
      {/* ============================================================ */}
      {selectedLevel === 'All Levels' && !searchQuery && !selectedPersona && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Tier 2 &middot; Engineering Disciplines</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827]">Core Manufacturing &amp; Materials Technologies</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CORE_SUBJECTS.map((subject, index) => {
              const Icon = subject.icon
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * index }}
                  whileHover={{ y: -4 }}
                  onClick={() => window.location.href = `/subjects/${subject.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all cursor-pointer flex flex-col justify-between"
                  style={{ borderColor: `${subject.color}30` }}
                >
                  <div>
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between" style={{ backgroundColor: subject.bgColor }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs" style={{ backgroundColor: 'white', borderColor: `${subject.color}40` }}>
                        <Icon className="h-5 w-5" style={{ color: subject.color }} />
                      </div>
                      <span 
                        className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold text-white uppercase shadow-2xs"
                        style={{ backgroundColor: subject.color }}
                      >
                        {subject.level}
                      </span>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h3 className="font-extrabold text-[#111827] text-sm leading-snug group-hover:text-[#2563EB] transition-colors">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-light line-clamp-2 leading-relaxed">
                        {subject.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 font-bold">{subject.lessons} Lessons</span>
                    <span className="text-[#2563EB] font-bold flex items-center gap-0.5">
                      Details <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* TIER 3: EMERGING SPECIALIZATIONS (8) */}
      {/* ============================================================ */}
      {selectedLevel === 'All Levels' && !searchQuery && !selectedPersona && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#7C3AED] uppercase tracking-wider">Tier 3 &middot; Future Specializations</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827]">Emerging Frontiers &amp; Industry 4.0</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SPECIALIZATIONS.map((subject, index) => {
              const Icon = subject.icon
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * index }}
                  whileHover={{ y: -4 }}
                  onClick={() => window.location.href = `/subjects/${subject.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all cursor-pointer flex flex-col justify-between"
                  style={{ borderColor: `${subject.color}30` }}
                >
                  <div>
                    <div className="p-3.5 border-b border-slate-100 flex items-center justify-between" style={{ backgroundColor: subject.bgColor }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center border shadow-xs" style={{ backgroundColor: 'white', borderColor: `${subject.color}40` }}>
                        <Icon className="h-4.5 w-4.5" style={{ color: subject.color }} />
                      </div>
                      <span 
                        className="px-2 py-0.5 rounded text-[8px] font-mono font-bold text-white uppercase shadow-2xs"
                        style={{ backgroundColor: subject.color }}
                      >
                        {subject.level}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <h3 className="font-extrabold text-[#111827] text-xs leading-snug group-hover:text-[#2563EB] transition-colors truncate">
                        {subject.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-light line-clamp-2 leading-tight">
                        {subject.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 font-bold">{subject.lessons} Lessons</span>
                    <span className="text-[#2563EB] font-bold flex items-center gap-0.5">
                      Explore <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* FILTERED CATALOG RESULTS (When searching or filtering) */}
      {/* ============================================================ */}
      {(selectedLevel !== 'All Levels' || searchQuery || selectedPersona) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Filtered Results</span>
              <h2 className="text-2xl font-black text-[#111827]">Matching Subjects</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">Found {filteredSubjects.length} subjects</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject, index) => {
              const Icon = subject.icon
              return (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.02 * index }}
                  whileHover={{ y: -4 }}
                  onClick={() => window.location.href = `/subjects/${subject.slug}`}
                  className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all cursor-pointer flex flex-col justify-between"
                  style={{ borderColor: `${subject.color}40` }}
                >
                  <div>
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between" style={{ backgroundColor: subject.bgColor }}>
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs" style={{ backgroundColor: 'white', borderColor: `${subject.color}40` }}>
                        <Icon className="h-6 w-6" style={{ color: subject.color }} />
                      </div>
                      <span 
                        className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-white uppercase shadow-xs"
                        style={{ backgroundColor: subject.color }}
                      >
                        {subject.level}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-extrabold text-[#111827] text-base leading-snug group-hover:text-[#2563EB] transition-colors font-display">
                        {subject.name}
                      </h3>
                      <p className="text-xs text-slate-600 font-light line-clamp-2 leading-relaxed">
                        {subject.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {subject.topics.slice(0, 3).map((topic) => (
                          <span key={topic} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 font-bold">{subject.lessons} Lessons</span>
                    <span className="text-[#2563EB] font-bold flex items-center gap-1">
                      Start Subject &rarr;
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <span className="text-4xl block mb-3">🔍</span>
              <h3 className="text-lg font-bold text-[#111827]">No matching subjects found</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">Try adjusting your search terms or clear level filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedLevel('All Levels')
                  setSelectedPersona(null)
                }}
                className="mt-4 px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-mono font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* BRAND-ALIGNED AI TUTOR CTA */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#0B172A] via-[#0A2E1A] to-[#0B172A] py-14 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA] text-xs font-mono font-bold uppercase mb-3">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                RAG AI Curriculum Copilot
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Ask our RAG-grounded AI Tutor about any PPE subject
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Get instant polymer engineering solutions grounded in 216+ master lessons, industrial ASTM standards, 
                and gate-level derivations.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Derive Flory-Huggins Theta State</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Troubleshoot Warpage in PP Moulding</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Explain EVOH Barrier Layer Math</span>
              </div>
            </div>

            <Link
              href="/ai-tutor"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-[#F5C518] hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(245,197,24,0.35)] flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono uppercase tracking-wider"
            >
              Ask AI Curriculum Copilot
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>



      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

      {/* ============================================================ */}
      {/* SUBJECT DETAIL INTERACTIVE MODAL */}
      {/* ============================================================ */}
      <AnimatePresence>
        {selectedSubject && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelectedSubject(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 border-b border-slate-100 relative" style={{ backgroundColor: selectedSubject.bgColor }}>
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 transition-all flex items-center justify-center border border-slate-200 shadow-xs"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs bg-white"
                    style={{ borderColor: `${selectedSubject.color}40` }}
                  >
                    <selectedSubject.icon className="h-7 w-7" style={{ color: selectedSubject.color }} />
                  </div>
                  <div>
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-white uppercase shadow-xs mb-1.5 inline-block"
                      style={{ backgroundColor: selectedSubject.color }}
                    >
                      {selectedSubject.level} &middot; {selectedSubject.lessons} Lessons
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-[1.15] pb-1 font-display">
                      {selectedSubject.name}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Curriculum Synopsis</h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-light mt-1">
                    {selectedSubject.description}
                  </p>
                </div>

                {/* Topics Covered */}
                <div>
                  <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Core Lesson Modules Covered</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {selectedSubject.topics.map((topic: string) => (
                      <div key={topic} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry & Career Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                    <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">Target Engineering Careers</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSubject.careers.map((career: string) => (
                        <span key={career} className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-mono font-bold">
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                    <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider block mb-1">Industrial Benchmark Leaders</span>
                    <p className="text-xs font-mono text-slate-700 font-bold mt-0.5">🇮🇳 {selectedSubject.indianCompany}</p>
                    <p className="text-xs font-mono text-slate-600">🌍 {selectedSubject.globalCompany}</p>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/subjects/${selectedSubject.slug}`}
                    className="flex-1 py-3 px-6 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all text-center shadow-md flex items-center justify-center gap-2"
                  >
                    Start Subject Curriculum
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`/ai-tutor`}
                    className="py-3 px-5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Brain className="h-4 w-4" />
                    Ask AI Tutor
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
