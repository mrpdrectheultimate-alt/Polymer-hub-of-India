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
    bgColor: '#F3E8FF',
    lessons: 12,
    level: 'Core',
    tier: 'core',
    description: 'Master natural rubber vulcanization kinetics, Mooney viscosity, carbon black reinforcement, and tire compounding formulations.',
    topics: ['Sulfur vs Peroxide Crosslinking', 'Mooney Viscometer (ML 1+4)', 'Carbon Black & Silica Reinforcement', 'NR/SBR/EPDM/NBR Selection', 'Rheometer MDR 2000 Vulcanization Curves'],
    careers: ['Rubber Compounder', 'Tire Technology Specialist', 'Elastomer R&D Scientist'],
    industry: 'Tires, Automotive Seals, Belting',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&q=80',
    indianCompany: 'MRF / Apollo Tyres',
    globalCompany: 'Continental AG',
  },
  {
    id: 'packaging',
    slug: 'plastic-packaging',
    name: 'Plastic Packaging Technology',
    icon: Package,
    color: '#D97706',
    bgColor: '#FEF3C7',
    lessons: 12,
    level: 'Core',
    tier: 'core',
    description: 'Master flexible multi-layer film extrusion, EVOH barrier math, aseptic PET bottle blow molding, and MAP food shelf-life physics.',
    topics: ['Multi-Layer Co-Extrusion (7-Layer)', 'EVOH & PVDC Oxygen Barrier Math', 'PET Preform Design & Stretch Blow', 'Modified Atmosphere Packaging (MAP)', 'Retort Pouch Thermal Lamination'],
    careers: ['Packaging Engineer', 'FMCG Packaging Technologist', 'Converter Development Lead'],
    industry: 'FMCG, Food & Pharma Packaging',
    image: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=800&q=80',
    indianCompany: 'UFlex Packaging',
    globalCompany: 'Amcor Packaging',
  },
  {
    id: 'composites',
    slug: 'polymer-composites',
    name: 'Polymer Composites & Fiber Engineering',
    icon: Layers,
    color: '#0284C7',
    bgColor: '#E0F2FE',
    lessons: 12,
    level: 'Advanced',
    tier: 'core',
    description: 'Master carbon fiber reinforced polymers (CFRP), glass mat thermoplastics (GMT), resin transfer molding (RTM), and autoclave curing.',
    topics: ['Classical Laminated Plate Theory', 'RTM & Vacuum-Assisted Resin Infusion', 'Carbon vs Glass vs Arimid Fiber Specs', 'Thermoset Epoxy Curing Kinetics', 'Short Fiber Orientation Tensor'],
    careers: ['Composite Design Engineer', 'Aerospace Structural Specialist', 'Wind Turbine Blade Engineer'],
    industry: 'Aerospace, Defense, Wind Energy',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    indianCompany: 'HAL Composite Wing',
    globalCompany: 'Toray Carbon Fibers',
  },
  {
    id: 'additives',
    slug: 'additives-and-compounding',
    name: 'Additives & Polymer Compounding',
    icon: Beaker,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    lessons: 12,
    level: 'Core',
    tier: 'core',
    description: 'Master antioxidants (Irganox), HALS UV stabilizers, brominated flame retardants, nucleating agents, and twin-screw compounding.',
    topics: ['Hindered Phenol Antioxidants (AO-1010)', 'HALS Photostabilization Mechanism', 'Flame Retardancy (UL-94 V0)', 'Twin-Screw Kneading Block Geometry', 'Calcium Carbonate Fillers & Coupling'],
    careers: ['Compounding Manager', 'Masterbatch Technologist', 'Additives R&D Chemist'],
    industry: 'Masterbatch, Resins Compounding',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    indianCompany: 'Plastiblends India',
    globalCompany: 'Songwon Additives',
  },
  {
    id: 'sustainable',
    slug: 'sustainable-plastics',
    name: 'Sustainable Plastics & Circular Economy',
    icon: Recycle,
    color: '#16A34A',
    bgColor: '#DCFCE7',
    lessons: 12,
    level: 'Core',
    tier: 'core',
    description: 'Master mechanical recycling flake washing, chemical pyrolysis depolymerization, MoEFCC EPR plastic credit trading, and LCA GWP calculations.',
    topics: ['Mechanical Wash Line & Sorting', 'Chemical Pyrolysis & Monomer Recovery', 'EPR Credit Guidelines (MoEFCC)', 'ISO 14040 Life Cycle Assessment', 'Monomaterial Design for Recyclability'],
    careers: ['Sustainability Lead', 'Circular Economy Manager', 'Recycling Plant Manager'],
    industry: 'Recycling, Environmental Compliance',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
    indianCompany: 'Banyan Nation',
    globalCompany: 'Veolia Plastics',
  },
  {
    id: 'medical',
    slug: 'medical-polymers',
    name: 'Medical Plastics & Biomaterials',
    icon: Stethoscope,
    color: '#0891B2',
    bgColor: '#CFFAFE',
    lessons: 10,
    level: 'Advanced',
    tier: 'core',
    description: 'Master ISO 10993 biocompatibility standards, USP Class VI medical resins, gamma/EtO sterilization stability, and bioresorbable PGLA implants.',
    topics: ['USP Class VI & ISO 10993 Testing', 'Gamma Ray & EtO Sterilization Resistance', 'Bioresorbable PLA/PGLA Sutures', 'Medical Grade PVC Blood Bags', 'Catheter Micro-Extrusion Tech'],
    careers: ['Medical Plastics Engineer', 'Biomaterials R&D Scientist', 'Regulatory Compliance Manager'],
    industry: 'Medical Devices, Healthcare Packaging',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80',
    indianCompany: 'HLL Lifecare',
    globalCompany: 'Covestro Healthcare Resins',
  },
  {
    id: 'recycling',
    slug: 'recycling-technologies',
    name: 'Advanced Recycling & Waste Processing',
    icon: Droplets,
    color: '#059669',
    bgColor: '#D1FAE5',
    lessons: 10,
    level: 'Core',
    tier: 'core',
    description: 'Master NIR optical sorting, solid-state polycondensation (SSP) rPET IV restoration, and marine ocean plastic de-contamination.',
    topics: ['NIR Automated Resin Sorting', 'SSP Bottle-to-Bottle rPET Reactivation', 'Solvolysis & Glycolysis Chemical Recycling', 'Multi-Layer Packaging Delamination', 'Ocean Plastic De-Contamination'],
    careers: ['Recycling Process Specialist', 'Pyrolysis Plant Engineer', 'Regrind Quality Lead'],
    industry: 'Waste Management, CleanTech',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&q=80',
    indianCompany: 'Ganesha Ecosphere',
    globalCompany: 'TOMRA Sorting Solutions',
  },
]

// ─── TIER 3: Emerging Frontiers & Industry 4.0 (8) ───
const SPECIALIZATIONS: SubjectItem[] = [
  {
    id: 'rheology',
    slug: 'polymer-rheology',
    name: 'Polymer Rheology & Melt Flow Mechanics',
    icon: Compass,
    color: '#0284C7',
    bgColor: '#E0F2FE',
    lessons: 11,
    level: 'Core',
    tier: 'specialization',
    description: 'Master non-Newtonian flow models (Power-Law, Carreau-Yasuda), Cox-Merz rule, capillary Bagley corrections, and extrudate die swell.',
    topics: ['Pseudoplastic Shear Thinning', 'Carreau-Yasuda 5-Parameter Model', 'Capillary Bagley & Rabinowitsch', 'Small Amplitude Oscillatory Shear (SAOS)', 'Cox-Merz Empirical Rule'],
    careers: ['Melt Rheologist', 'CAE Simulation Lead', 'Resin Development Engineer'],
    industry: 'Analytical Rheology, Polymer Physics',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80',
    indianCompany: 'Reliance R&D Center',
    globalCompany: 'TA Instruments Rheometers',
  },
  {
    id: 'nanotech',
    slug: 'nanotechnology-polymers',
    name: 'Polymer Nanotechnology & Nanocomposites',
    icon: Cpu,
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    lessons: 8,
    level: 'Advanced',
    tier: 'specialization',
    description: 'Master organoclay intercalation, carbon nanotube electrical percolation networks, and graphene gas barrier enhancement.',
    topics: ['Organoclay Exfoliation vs Intercalation', 'CNT Electrical Percolation Threshold', 'Graphene Oxygen Barrier Enhancement', 'Sol-Gel Nanoparticle Synthesis', 'Nanocomposite Mechanical Reinforcement'],
    careers: ['Nanotechnology Scientist', 'Advanced Materials Specialist', 'Barrier Film Developer'],
    industry: 'Advanced Nanomaterials, Electronics',
    image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&q=80',
    indianCompany: 'ISRO Composite Unit',
    globalCompany: 'Evonik Nanomaterials',
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

const PATHWAYS = [
  { id: 'all', label: 'All Pathways' },
  { id: 'student', label: 'Undergraduate Student' },
  { id: 'industry', label: 'Plant & QC Engineer' },
  { id: 'researcher', label: 'R&D Scientist' },
  { id: 'founder', label: 'Factory Founder' },
]

const LEVELS = ['All Levels', 'Foundation', 'Core', 'Advanced']

const STATS = [
  { value: '19', label: 'Curated Subjects', icon: BookOpen },
  { value: '216', label: 'Master Lessons', icon: GraduationCap },
  { value: '100%', label: 'Industry-Mapped', icon: Play },
  { value: '1,080', label: 'GATE & Industry MCQs', icon: Award },
]

// Locked Semantic Difficulty Badge System
function DifficultyBadge({ level }: { level: 'Foundation' | 'Core' | 'Advanced' }) {
  const badgeStyles = {
    Foundation: 'bg-blue-100 text-blue-800 border border-blue-200 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase',
    Core: 'bg-amber-100 text-amber-900 border border-amber-200 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase',
    Advanced: 'bg-red-100 text-red-800 border border-red-200 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase'
  }[level]

  return <span className={badgeStyles}>{level}</span>
}

// ==================== MAIN COMPONENT ====================

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [selectedPathway, setSelectedPathway] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null)

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

      // Career Pathway Filter
      let matchesPathway = true
      if (selectedPathway === 'student') {
        matchesPathway = subject.level === 'Foundation' || subject.level === 'Core'
      } else if (selectedPathway === 'industry') {
        matchesPathway = subject.industry.toLowerCase().includes('processing') || subject.industry.toLowerCase().includes('manufacturing') || subject.id === 'testing' || subject.id === 'mould-design'
      } else if (selectedPathway === 'researcher') {
        matchesPathway = subject.level === 'Advanced' || subject.id === 'chemistry' || subject.id === 'nanotech' || subject.id === 'bioprocessing'
      } else if (selectedPathway === 'founder') {
        matchesPathway = subject.id === 'entrepreneurship' || subject.id === 'packaging' || subject.id === 'sustainable' || subject.id === 'recycling'
      }

      return matchesSearch && matchesLevel && matchesPathway
    })
  }, [searchQuery, selectedLevel, selectedPathway])

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO — Midnight Navy & Emerald Accent Header */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-[#0B172A] via-[#0A2E1A] to-[#0B172A] overflow-hidden py-16 lg:py-20 text-white border-b-2 border-slate-900">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#10B981]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 text-[#60A5FA] text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
              📚 Curriculum Matrix &middot; Built for India&apos;s Polymer Engineering Students &amp; Industry
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight uppercase">
              Master Polymer Engineering. <br />
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A] pb-2 pt-0.5 leading-[1.15]">
                19 Subjects, 216 Master Lessons.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-light">
              Every subject mapped directly to Indian manufacturing hubs (Hazira, Chakan, Guindy, Dahej, Manali, Noida, Hosur) &mdash; with 216 verified master lessons, ASTM/ISO characterization standards, and RAG AI Copilot synthesis.
            </p>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-4xl">
              {STATS.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
                    <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="font-display font-black text-white text-xl sm:text-2xl block leading-none mb-1">{stat.value}</span>
                    <span className="font-mono text-[10px] text-slate-300 uppercase tracking-wider block font-bold">{stat.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SEPARATED DUAL FILTER CONTROL TOOLBAR */}
      {/* ============================================================ */}
      <section className="bg-white border-b-2 border-slate-900 py-6 px-4 sm:px-6 lg:px-8 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Search Input & Quick Info */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects, topics, standards (e.g. Mould Design, Injection Molding, ASTM)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all text-slate-900 font-sans"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 font-bold">
              <span>Showing <strong className="text-slate-900">{filteredSubjects.length}</strong> of 19 Curriculum Tracks</span>
            </div>
          </div>

          {/* Row 1: Filter by Career Pathway */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              Filter by Career Pathway Goal:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap mobile-touch-scroll pb-1">
              {PATHWAYS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPathway(p.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedPathway === p.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Filter by Difficulty Level */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
              Filter by Difficulty Level:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap mobile-touch-scroll pb-1">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedLevel === lvl
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3-TIER CURRICULUM CATALOG */}
      {/* ============================================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* ── TIER 1: FLAGSHIP FOUNDATIONS ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider block">TIER 1 PEDAGOGY</span>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Flagship Engineering Core</h2>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
              Foundational &amp; Primary Tracks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_SUBJECTS.filter((s) => filteredSubjects.some((f) => f.id === s.id)).map((subject) => {
              const Icon = subject.icon
              return (
                <article
                  key={subject.id}
                  className="bg-white border-2 border-slate-900 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    {/* Header Banner */}
                    <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-xs" style={{ backgroundColor: subject.bgColor, color: subject.color }}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <DifficultyBadge level={subject.level} />
                          <h3 className="font-display font-black text-lg text-slate-900 mt-1 leading-tight">{subject.name}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 space-y-4">
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {subject.description}
                      </p>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Industry Benchmark Partner:</span>
                        <span className="text-xs font-bold text-slate-900 font-sans block">{subject.indianCompany} &middot; {subject.globalCompany}</span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">Key Syllabus Topics:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {subject.topics.slice(0, 3).map((topic, i) => (
                            <span key={i} className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                    <span className="text-xs font-mono font-bold text-slate-600">{subject.lessons} Master Lessons</span>
                    <Link
                      href={`/subjects/${subject.slug}`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-all"
                    >
                      Explore Subject <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ── TIER 2: CORE MANUFACTURING & MATERIALS ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider block">TIER 2 PEDAGOGY</span>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Core Manufacturing &amp; Materials</h2>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full">
              Industrial Processing &amp; Tooling
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_SUBJECTS.filter((s) => filteredSubjects.some((f) => f.id === s.id)).map((subject) => {
              const Icon = subject.icon
              return (
                <article
                  key={subject.id}
                  className="bg-white border-2 border-slate-900 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: subject.bgColor, color: subject.color }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <DifficultyBadge level={subject.level} />
                        <h3 className="font-display font-bold text-sm text-slate-900 mt-0.5 leading-tight">{subject.name}</h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                        {subject.description}
                      </p>

                      <div className="text-[10px] font-mono text-slate-500 font-semibold">
                        📍 {subject.indianCompany}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                    <span className="text-[11px] font-mono font-bold text-slate-600">{subject.lessons} Lessons</span>
                    <Link
                      href={`/subjects/${subject.slug}`}
                      className="inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-700 hover:text-blue-900 uppercase"
                    >
                      Explore Subject <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ── TIER 3: EMERGING FRONTIERS & INDUSTRY 4.0 ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider block">TIER 3 PEDAGOGY</span>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Emerging Frontiers &amp; Specializations</h2>
            </div>
            <span className="text-xs font-mono font-bold bg-red-50 text-red-800 border border-red-200 px-3 py-1 rounded-full">
              Advanced R&amp;D &amp; Smart Factory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPECIALIZATIONS.filter((s) => filteredSubjects.some((f) => f.id === s.id)).map((subject) => {
              const Icon = subject.icon
              return (
                <article
                  key={subject.id}
                  className="bg-white border-2 border-slate-900 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden"
                >
                  <div>
                    <div className="p-5 border-b border-slate-100 bg-slate-50/70 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: subject.bgColor, color: subject.color }}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <DifficultyBadge level={subject.level} />
                        <h3 className="font-display font-bold text-sm text-slate-900 mt-0.5 leading-tight">{subject.name}</h3>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                        {subject.description}
                      </p>

                      <div className="text-[10px] font-mono text-slate-500 font-semibold">
                        📍 {subject.indianCompany}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                    <span className="text-[11px] font-mono font-bold text-slate-600">{subject.lessons} Lessons</span>
                    <Link
                      href={`/subjects/${subject.slug}`}
                      className="inline-flex items-center gap-1 font-mono text-xs font-bold text-blue-700 hover:text-blue-900 uppercase"
                    >
                      Explore Subject <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* STREAMLINED AI CURRICULUM COPILOT WIDGET */}
        {/* ============================================================ */}
        <section className="bg-[#0A1628] text-white border-2 border-slate-900 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Brain className="w-5 h-5" /> RAG AI Curriculum Copilot
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full uppercase">
              216 Lessons Grounded
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
              Connect Syllabus Engineering Concepts to Real Exam &amp; Plant Problems
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Ask the AI Copilot to synthesize syllabus concepts or generate practice numericals for GATE &amp; B.Tech exams.
            </p>
          </div>

          {/* 3 Prominent Example Prompt Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href={`/ai-tutor?prompt=${encodeURIComponent("Derive the Flory-Huggins lattice model equation for polymer-solvent mixing and explain the interaction parameter chi.")}`}
              className="p-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 hover:border-amber-400 transition-all text-left group"
            >
              <span className="text-[10px] font-mono font-bold text-amber-400 block mb-1">PROMPT 1 &middot; THERMODYNAMICS</span>
              <p className="text-xs text-white font-medium group-hover:text-amber-300 transition-colors">
                &quot;Derive Flory-Huggins State Equation &amp; Parameter &chi;&quot; &rarr;
              </p>
            </Link>

            <Link
              href={`/ai-tutor?prompt=${encodeURIComponent("Troubleshoot warpage and sink marks in PP injection moulding with step-by-step processing parameter fixes.")}`}
              className="p-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 hover:border-amber-400 transition-all text-left group"
            >
              <span className="text-[10px] font-mono font-bold text-amber-400 block mb-1">PROMPT 2 &middot; INJECTION MOULDING</span>
              <p className="text-xs text-white font-medium group-hover:text-amber-300 transition-colors">
                &quot;Troubleshoot Warpage &amp; Sink Marks in PP Moulding&quot; &rarr;
              </p>
            </Link>

            <Link
              href={`/ai-tutor?prompt=${encodeURIComponent("Explain EVOH barrier layer math and oxygen permeation rate calculations for 7-layer film extrusion.")}`}
              className="p-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 hover:border-amber-400 transition-all text-left group"
            >
              <span className="text-[10px] font-mono font-bold text-amber-400 block mb-1">PROMPT 3 &middot; PACKAGING BARRIER</span>
              <p className="text-xs text-white font-medium group-hover:text-amber-300 transition-colors">
                &quot;Explain EVOH Barrier Layer Math &amp; Permeation Rate&quot; &rarr;
              </p>
            </Link>
          </div>

          {/* Primary Copilot CTA */}
          <div className="pt-2">
            <Link
              href="/ai-tutor"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md"
            >
              Ask AI Curriculum Copilot <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
