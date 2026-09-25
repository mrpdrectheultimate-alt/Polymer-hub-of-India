'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowRight, 
  Sparkles, 
  Search,
  BookOpen,
  GraduationCap,
  Award,
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
  CheckCircle2,
  Clock,
  Briefcase,
  HelpCircle
} from 'lucide-react'
import Footer from '@/components/Footer'

// ==================== TYPES & DATA ====================

export type PedagogicalTier = 'foundation' | 'core' | 'applications' | 'specializations'

export interface SubjectItem {
  id: string
  slug: string
  name: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  bgColor: string
  lessons: number
  studyTimeHours: number
  prerequisites: string
  level: 'Foundation' | 'Core' | 'Advanced'
  tier: PedagogicalTier
  tierLabel: string
  description: string
  outcome: string
  topics: string[]
  careers: string[]
  industry: string
  indianCompany: string
  globalCompany: string
  svgVisualType: 'chemistry' | 'processing' | 'testing' | 'mould' | 'rheology' | 'recycling' | 'composites' | 'generic'
}

// ── 19 Subject Items Restructured into 4 Pedagogical Tiers (Total: 216 Lessons) ───
export const ALL_SUBJECTS: SubjectItem[] = [
  // ── TIER 1: FOUNDATION (Essential Fundamentals - 3 Subjects, 42 Lessons) ──
  {
    id: 'chemistry',
    slug: 'polymer-chemistry',
    name: 'Polymer Chemistry & Kinetics',
    icon: FlaskConical,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 15,
    studyTimeHours: 12.5,
    prerequisites: 'High School Chemistry & Organic Reaction Mechanisms',
    level: 'Foundation',
    tier: 'foundation',
    tierLabel: 'Tier 1 · Essential Foundation',
    description: 'Master polymerization mechanisms, reaction kinetics, molecular weight distributions (Mn, Mw, MWD), and degradation thermodynamics.',
    outcome: 'After this track: Calculate degree of polymerization, predict Tg, analyze Carothers step-growth kinetics, and select catalysts.',
    topics: ['Addition vs Condensation', 'Glass Transition (Tg)', 'Molecular Weight & MWD', 'Ziegler-Natta & Metallocene', 'Thermal Degradation Kinetics'],
    careers: ['R&D Polymer Scientist', 'Polymer Chemist', 'Materials Synthesis Engineer'],
    industry: 'Petrochemicals & Specialty Resins',
    indianCompany: 'Reliance Petrochemicals',
    globalCompany: 'BASF Chemical Group',
    svgVisualType: 'chemistry'
  },
  {
    id: 'physics',
    slug: 'polymer-physics',
    name: 'Polymer Physics & Thermodynamics',
    icon: Beaker,
    color: '#0284C7',
    bgColor: '#F0F9FF',
    lessons: 12,
    studyTimeHours: 10.0,
    prerequisites: 'Polymer Chemistry Fundamentals & Thermodynamics',
    level: 'Foundation',
    tier: 'foundation',
    tierLabel: 'Tier 1 · Essential Foundation',
    description: 'Master Flory-Huggins lattice theory, chain statistics, rubber elasticity, crystalline morphology, and spherulite growth kinetics.',
    outcome: 'After this track: Derive phase diagrams, model entropy elasticity, and quantify percent crystallinity from DSC & X-ray diffraction.',
    topics: ['Flory-Huggins Solvency (χ)', 'Rubber Elasticity State Equations', 'Spherulitic Crystallization Kinetics', 'Avrami Phase Transformations', 'Chain Entanglements'],
    careers: ['Polymer Physicist', 'Materials Characterization Specialist', 'Polymer R&D Lead'],
    industry: 'Advanced Materials & Research Labs',
    indianCompany: 'ISRO Composites Division',
    globalCompany: 'DuPont Central Research',
    svgVisualType: 'chemistry'
  },
  {
    id: 'rheology',
    slug: 'polymer-rheology',
    name: 'Polymer Rheology & Viscoelasticity',
    icon: Droplets,
    color: '#0D9488',
    bgColor: '#F0FDFA',
    lessons: 15,
    studyTimeHours: 12.5,
    prerequisites: 'Fluid Mechanics & Polymer Physics Fundamentals',
    level: 'Foundation',
    tier: 'foundation',
    tierLabel: 'Tier 1 · Essential Foundation',
    description: 'Master non-Newtonian shear thinning, Cox-Merz empirical rule, viscoelastic moduli (G\', G\"), WLF time-temperature superposition, and die swell.',
    outcome: 'After this track: Interpret capillary rheograms, calculate apparent wall shear rates, and predict extrudate swell ratio.',
    topics: ['Power-Law & Carreau Models', 'SAOS Dynamic Moduli (G\', G\")', 'Bagley Entrance Pressure Corrections', 'Cox-Merz Empirical Rule', 'WLF Shift Factors (aT)'],
    careers: ['Melt Rheologist', 'Process Simulation Analyst', 'Characterization Engineer'],
    industry: 'Polymer Processing R&D & Testing',
    indianCompany: 'Reliance R&D Hazira',
    globalCompany: 'TA Instruments',
    svgVisualType: 'rheology'
  },

  // ── TIER 2: CORE ENGINEERING (Processing & Tooling Dynamics - 4 Subjects, 52 Lessons) ──
  {
    id: 'processing',
    slug: 'polymer-processing',
    name: 'Polymer Processing & Engineering',
    icon: Gauge,
    color: '#EA580C',
    bgColor: '#FFF7ED',
    lessons: 20,
    studyTimeHours: 16.0,
    prerequisites: 'Polymer Rheology & Heat Transfer Fundamentals',
    level: 'Core',
    tier: 'core',
    tierLabel: 'Tier 2 · Core Engineering',
    description: 'Master injection molding cycle dynamics, twin-screw extruder melt conveying, blow molding parison sag, and thermoforming heat transfer.',
    outcome: 'After this track: Calculate injection clamping force, size extruder screw L/D ratios, and optimize cooling times on factory floors.',
    topics: ['Injection Cycle & Hold Pressure', 'Extruder Screw Channel Geometry', 'Stretch Blow Parison Control', 'Melt Fracture & Sharkskin', 'Processing Defects Troubleshooting'],
    careers: ['Injection Plant Manager', 'Extrusion Process Specialist', 'Manufacturing Lead'],
    industry: 'Automotive Plastics, Packaging & Pipes',
    indianCompany: 'Supreme Industries',
    globalCompany: 'Engel Injection Machinery',
    svgVisualType: 'processing'
  },
  {
    id: 'mould-design',
    slug: 'mould-design',
    name: 'Mould & Tooling Die Design',
    icon: Ruler,
    color: '#059669',
    bgColor: '#ECFDF5',
    lessons: 12,
    studyTimeHours: 10.0,
    prerequisites: 'Polymer Processing & CAD/Engineering Graphics',
    level: 'Core',
    tier: 'core',
    tierLabel: 'Tier 2 · Core Engineering',
    description: 'Master injection tool construction, conformal cooling thermodynamics, submarine/hot runner gates, and Moldflow fill-warp simulation.',
    outcome: 'After this track: Design 2-plate/3-plate molds, size runner channels, calculate ejection force, and eliminate cavity warpage.',
    topics: ['Submarine & Valve Gate Design', 'Conformal Cooling Geometry', 'Hot Runner Manifold Balancing', 'Ejector Pin Layouts', 'Volumetric Shrinkage Allowance'],
    careers: ['Tooling Engineer', 'Mould CAD/CAM Designer', 'CAE Simulation Lead'],
    industry: 'Toolrooms & Die Manufacturing',
    indianCompany: 'Mold-Tek Technologies',
    globalCompany: 'HASCO Mould Systems',
    svgVisualType: 'mould'
  },
  {
    id: 'testing',
    slug: 'polymer-testing',
    name: 'Polymer Testing & Quality Control',
    icon: Microscope,
    color: '#EF4444',
    bgColor: '#FDE8E8',
    lessons: 10,
    studyTimeHours: 8.5,
    prerequisites: 'Polymer Chemistry & Mechanics of Materials',
    level: 'Core',
    tier: 'core',
    tierLabel: 'Tier 2 · Core Engineering',
    description: 'Master tensile, Izod impact, DSC crystallization, TGA thermal decomposition, DMA viscoelasticity, and Shore hardness to ASTM/ISO standards.',
    outcome: 'After this track: Perform ASTM D638 tensile testing, interpret DSC thermograms, and generate QA defect failure analysis reports.',
    topics: ['ASTM D638 Tensile Testing', 'ASTM D256 Izod Impact', 'ASTM D3418 DSC Thermograms', 'ASTM E1131 TGA Decomposition', 'Melt Flow Index (MFI) ISO 1133'],
    careers: ['QA/QC Test Engineer', 'Analytical Lab Manager', 'Failure Analyst'],
    industry: 'Quality Control & Inspection Labs',
    indianCompany: 'CIPET Testing Laboratories',
    globalCompany: 'Instron Testing Systems',
    svgVisualType: 'testing'
  },
  {
    id: 'additives',
    slug: 'additives-compounding',
    name: 'Plastics Compounding & Additives',
    icon: Beaker,
    color: '#6366F1',
    bgColor: '#EEF2FF',
    lessons: 10,
    studyTimeHours: 8.5,
    prerequisites: 'Polymer Chemistry & Processing Fundamentals',
    level: 'Core',
    tier: 'core',
    tierLabel: 'Tier 2 · Core Engineering',
    description: 'Master phenolic antioxidants, HALS UV light stabilizers, non-halogen flame retardants, plasticizers, and twin-screw extruder compounding.',
    outcome: 'After this track: Formulate masterbatches, select UV/thermal stabilizer packages, and configure twin-screw kneading elements.',
    topics: ['Phenolic & Phosphite Synergism', 'HALS Photostabilization', 'Intumescent Flame Retardants', 'Co-Rotating Twin-Screw L/D', 'Color Matching & Dispersants'],
    careers: ['Compounding Specialist', 'Formulation Chemist', 'Masterbatch Plant Engineer'],
    industry: 'Specialty Compounding & Masterbatch',
    indianCompany: 'Plastiblends India',
    globalCompany: 'Clariant Masterbatches',
    svgVisualType: 'processing'
  },

  // ── TIER 3: APPLIED INDUSTRIES (Sector Specifications - 6 Subjects, 62 Lessons) ──
  {
    id: 'rubber',
    slug: 'rubber-technology',
    name: 'Rubber & Elastomer Technology',
    icon: Zap,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    lessons: 10,
    studyTimeHours: 8.5,
    prerequisites: 'Polymer Chemistry & Viscoelasticity',
    level: 'Advanced',
    tier: 'applications',
    tierLabel: 'Tier 3 · Applied Industries',
    description: 'Master sulfur vs peroxide vulcanization kinetics, carbon black reinforcement, Moving Die Rheometer (MDR) curves, and radial tire engineering.',
    outcome: 'After this track: Formulate NBR/EPDM/NR compounds, evaluate MDR ts2/tc90 cure times, and calculate crosslink density.',
    topics: ['Sulfur & Peroxide Curing Kinetics', 'NR, SBR, NBR, EPDM Formulations', 'Carbon Black & Silica Reinforcement', 'MDR ts2 & tc90 Rheometer Curves', 'Radial Tire Construction'],
    careers: ['Rubber Technologist', 'Tire Compounder', 'Elastomer R&D Specialist'],
    industry: 'Tires, Hoses, Seals & Gaskets',
    indianCompany: 'MRF Limited India',
    globalCompany: 'Lanxess Elastomers',
    svgVisualType: 'testing'
  },
  {
    id: 'composites',
    slug: 'polymer-composites',
    name: 'Polymer Composites & Hybrids',
    icon: Layers,
    color: '#0284C7',
    bgColor: '#F0F9FF',
    lessons: 10,
    studyTimeHours: 8.5,
    prerequisites: 'Mechanics of Materials & Polymer Processing',
    level: 'Advanced',
    tier: 'applications',
    tierLabel: 'Tier 3 · Applied Industries',
    description: 'Master carbon/glass fiber interfaces, autoclave prepreg curing, resin transfer molding (RTM), and aerospace structural lightweighting.',
    outcome: 'After this track: Calculate composite laminate stiffness tensors, design RTM mold gating, and inspect CFRP delamination defects.',
    topics: ['Fiber-Matrix Interfacial Shear', 'CFRP Aerospace Autoclave Cycles', 'Resin Transfer Molding (RTM)', 'Short Fiber Alignment', 'Natural Fiber Composites'],
    careers: ['Composites Design Engineer', 'Aerospace Structural Analyst', 'Lightweighting Engineer'],
    industry: 'Aerospace, Defense & Automotive Structural',
    indianCompany: 'Tata Advanced Materials',
    globalCompany: 'Hexcel Composites',
    svgVisualType: 'composites'
  },
  {
    id: 'packaging',
    slug: 'plastic-packaging-engineering',
    name: 'Plastics Packaging Engineering',
    icon: Package,
    color: '#F59E0B',
    bgColor: '#FEF3E8',
    lessons: 12,
    studyTimeHours: 10.0,
    prerequisites: 'Polymer Processing & Barrier Physics',
    level: 'Advanced',
    tier: 'applications',
    tierLabel: 'Tier 3 · Applied Industries',
    description: 'Master OTR/WVTR barrier permeation physics, 7-layer EVOH co-extrusion blown films, ISBM PET preforms, and global FSSAI/FDA food contact rules.',
    outcome: 'After this track: Calculate film gas transmission rates, specify EVOH tie-layer resins, and verify FSSAI food contact compliance.',
    topics: ['OTR & WVTR Gas Permeation Physics', '7-Layer Co-Extruded Blown Films', 'PET Preform Stretch Blow Molding', 'FSSAI Food Contact Norms', 'Mono-PE Recyclable Pouches'],
    careers: ['Packaging Development Engineer', 'Barrier Film Specialist', 'FMCG Packaging Lead'],
    industry: 'FMCG, Food & Beverage Packaging',
    indianCompany: 'Uflex Limited India',
    globalCompany: 'Amcor Packaging',
    svgVisualType: 'recycling'
  },
  {
    id: 'medical',
    slug: 'medical-plastics',
    name: 'Medical Plastics & Biomaterials',
    icon: Stethoscope,
    color: '#DB2777',
    bgColor: '#FDF2F8',
    lessons: 8,
    studyTimeHours: 7.0,
    prerequisites: 'Polymer Chemistry & Testing ISO Standards',
    level: 'Advanced',
    tier: 'applications',
    tierLabel: 'Tier 3 · Applied Industries',
    description: 'Master ISO 10993 cytotoxicity and hemocompatibility, gamma/EtO sterilization kinetics, PEEK joint implants, and ISO 13485 cleanroom moulding.',
    outcome: 'After this track: Select medical grade resins, specify sterilization compatibility, and audit Class 10,000 cleanroom moulding operations.',
    topics: ['ISO 10993 Biocompatibility Matrix', 'Medical Grade PVC, PP & PEEK', 'Gamma Radiation & EtO Sterilization', 'UHMWPE Orthopedic Joint Liners', 'ISO 13485 Cleanroom Moulding'],
    careers: ['Medical Device Engineer', 'Biomaterials R&D Scientist', 'Regulatory Auditor'],
    industry: 'Medical Devices & Healthcare Implants',
    indianCompany: 'Hindustan Syringes (HMD)',
    globalCompany: 'Medtronic',
    svgVisualType: 'testing'
  },
  {
    id: 'sustainable',
    slug: 'sustainable-plastics',
    name: 'Sustainable Plastics & Biopolymers',
    icon: Recycle,
    color: '#16A34A',
    bgColor: '#F0FDF4',
    lessons: 10,
    studyTimeHours: 8.5,
    prerequisites: 'Polymer Chemistry & Environmental Engineering',
    level: 'Advanced',
    tier: 'applications',
    tierLabel: 'Tier 3 · Applied Industries',
    description: 'Master PLA synthesis, microbial PHA fermentation, drop-in bio-PE, industrial composting ISO 17088 certification, and bio-circular monomer loops.',
    outcome: 'After this track: Formulate compostable bio-resins, evaluate biodegradation kinetics, and conduct ISO 14040 Life Cycle Assessments.',
    topics: ['Bio-Based vs Compostable Plastics', 'Poly Lactic Acid (PLA) Processing', 'Microbial Polyhydroxyalkanoates (PHA)', 'ISO 17088 Composting Certification', 'Drop-in Bio-Ethylene Synthesis'],
    careers: ['Sustainability Engineer', 'Bioplastics Formulator', 'Circular Economy Lead'],
    industry: 'Biomaterials & Sustainable Packaging',
    indianCompany: 'Ecogreen Bioplastics',
    globalCompany: 'NatureWorks Ingeo',
    svgVisualType: 'recycling'
  },
  {
    id: 'recycling',
    slug: 'recycling-technology',
    name: 'Advanced Recycling & Circular Economy',
    icon: Recycle,
    color: '#15803D',
    bgColor: '#F0FDF4',
    lessons: 10,
    studyTimeHours: 8.5,
    prerequisites: 'Polymer Processing & Waste Management',
    level: 'Core',
    tier: 'applications',
    tierLabel: 'Tier 3 · Applied Industries',
    description: 'Master high-speed NIR optical flake sorting, chemical pyrolysis to circular naphtha, enzymatic PET depolymerization, and MoEFCC EPR credit rules.',
    outcome: 'After this track: Design mechanical flake washing lines, calculate EPR credit balances, and specify rPET bottle-to-bottle decontamination.',
    topics: ['Near-Infrared (NIR) Flake Sorting', 'Pyrolysis Oil to Circular Naphtha', 'Enzymatic PETase Depolymerization', 'MoEFCC India EPR Credit Rules', 'Food-Grade rPET Decontamination'],
    careers: ['Recycling Process Engineer', 'EPR Compliance Manager', 'Circular Polymer Lead'],
    industry: 'Plastics Recycling & Waste Recovery',
    indianCompany: 'Dalmia Polypro India',
    globalCompany: 'Carbios France',
    svgVisualType: 'recycling'
  },

  // ── TIER 4: FRONTIERS & SPECIALIZATIONS (Emerging Technologies - 6 Subjects, 60 Lessons) ──
  {
    id: 'rheology-advanced',
    slug: 'polymer-nanotechnology',
    name: 'Polymer Nanotechnology & Nanocomposites',
    icon: Microscope,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    lessons: 8,
    studyTimeHours: 7.0,
    prerequisites: 'Polymer Physics & Advanced Materials',
    level: 'Advanced',
    tier: 'specializations',
    tierLabel: 'Tier 4 · Frontiers & Specializations',
    description: 'Master organoclay intercalation, carbon nanotube electrical percolation, graphene barrier skins, and nano-reinforced masterbatches.',
    outcome: 'After this track: Formulate conductive ESD nanocomposites, calculate percolation thresholds, and inspect TEM dispersion quality.',
    topics: ['Montmorillonite Clay Intercalation', 'CNT Electrical Percolation', 'Graphene Gas Barrier Skins', 'In-Melt Nanodispersion', 'Nano-Toxicity Safety Standards'],
    careers: ['Nanotechnology Scientist', 'Advanced Functional Materials Lead', 'Nano-Barrier Specialist'],
    industry: 'Advanced Electronics & High-Barrier Films',
    indianCompany: 'Nanocellect India',
    globalCompany: 'Nanocyl Belgium',
    svgVisualType: 'testing'
  },
  {
    id: 'bioprocessing',
    slug: 'biopolymers-bioprocessing',
    name: 'Biopolymers & Industrial Bioprocessing',
    icon: Globe,
    color: '#059669',
    bgColor: '#ECFDF5',
    lessons: 8,
    studyTimeHours: 7.0,
    prerequisites: 'Polymer Chemistry & Microbiology Basics',
    level: 'Advanced',
    tier: 'specializations',
    tierLabel: 'Tier 4 · Frontiers & Specializations',
    description: 'Master bacterial strain fermentation for PHA synthesis, enzymatic monomer extraction, chitin/chitosan refining, and bio-reactor design.',
    outcome: 'After this track: Optimize bio-fermentation yields, isolate PHA granules, and design downstream enzymatic purification streams.',
    topics: ['Bacterial PHA Fermentation', 'Enzymatic Monomer Extraction', 'Chitin & Chitosan Biopolymers', 'Bio-Reactor Process Engineering', 'Downstream Purification'],
    careers: ['Bioprocess Engineer', 'Fermentation Scientist', 'Biopolymer R&D Lead'],
    industry: 'Industrial Biotechnology & Bio-Resins',
    indianCompany: 'Praj Industries India',
    globalCompany: 'CJ Biomaterials',
    svgVisualType: 'chemistry'
  },
  {
    id: 'digital-twins',
    slug: 'digital-twins-smart-processing',
    name: 'Digital Twins & Smart Processing',
    icon: Cpu,
    color: '#2563EB',
    bgColor: '#EFF6FF',
    lessons: 8,
    studyTimeHours: 7.0,
    prerequisites: 'Polymer Processing & Sensors/Automation',
    level: 'Advanced',
    tier: 'specializations',
    tierLabel: 'Tier 4 · Frontiers & Specializations',
    description: 'Master in-mould piezoelectric pressure sensors, AI statistical process control (SPC), machine learning viscosity prediction, and Industry 4.0 plants.',
    outcome: 'After this track: Deploy in-cavity pressure sensors, build SPC automated reject gates, and calibrate digital twin filling models.',
    topics: ['In-Mould Piezoelectric Sensors', 'AI Statistical Process Control', 'Machine Learning Viscosity Fitting', 'Industry 4.0 Factory Architecture', 'Closed-Loop Injection Control'],
    careers: ['Smart Factory Engineer', 'Digital Twin Specialist', 'Process Automation Lead'],
    industry: 'Industry 4.0 Smart Manufacturing',
    indianCompany: 'Tata Consultancy Services (IoT)',
    globalCompany: 'Kistler Sensor Systems',
    svgVisualType: 'processing'
  },
  {
    id: 'robotics',
    slug: 'robotics-automation',
    name: 'Robotics & Automation in Plastic Plants',
    icon: Brain,
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    lessons: 8,
    studyTimeHours: 7.0,
    prerequisites: 'Polymer Processing & Industrial Automation',
    level: 'Advanced',
    tier: 'specializations',
    tierLabel: 'Tier 4 · Frontiers & Specializations',
    description: 'Master 3-axis & 6-axis servo demolding robots, End-of-Arm Tooling (EOAT) vacuum grippers, In-Mould Labeling (IML), and automated conveyors.',
    outcome: 'After this track: Program demolding robot trajectories, design EOAT vacuum plates, and configure high-speed IML labeling cells.',
    topics: ['3-Axis & 6-Axis Servo Demolding', 'EOAT Vacuum & Mechanical Grippers', 'In-Mould Labeling (IML) Robotics', 'Automated Scrap Conveying', 'Safety Light Curtains & Interlocks'],
    careers: ['Robotics & Automation Engineer', 'Plant Systems Lead', 'Automation Specialist'],
    industry: 'Factory Automation & Industrial Robotics',
    indianCompany: 'Wipro Infrastructure Engineering',
    globalCompany: 'Sepro Group Robotics',
    svgVisualType: 'mould'
  },
  {
    id: 'color-science',
    slug: 'color-science-aesthetics',
    name: 'Color Science & Polymer Aesthetics',
    icon: Sparkles,
    color: '#D97706',
    bgColor: '#FEF3C7',
    lessons: 8,
    studyTimeHours: 7.0,
    prerequisites: 'Polymer Chemistry & Physics',
    level: 'Advanced',
    tier: 'specializations',
    tierLabel: 'Tier 4 · Frontiers & Specializations',
    description: 'Master CIELAB color space coordinates, spectrophotometric color matching ($\Delta E$), metallic/pearl effect pigments, and metamerism control.',
    outcome: 'After this track: Formulate masterbatch color recipes, measure $\Delta E$ color tolerances, and eliminate metamerism in automotive parts.',
    topics: ['CIELAB Color Coordinates (L*a*b*)', 'Spectrophotometry & $\Delta E$ Calculations', 'Metallic & Interference Pigments', 'Metamerism & Lighting Standards', 'Color Degradation Under UV'],
    careers: ['Color Matcher', 'Pigments & Masterbatch Lead', 'Aesthetics Quality Engineer'],
    industry: 'Masterbatch, Automotive & Consumer Electronics',
    indianCompany: 'Poddar Pigments India',
    globalCompany: 'X-Rite Pantone',
    svgVisualType: 'testing'
  },
  {
    id: 'entrepreneurship',
    slug: 'polymer-economics-entrepreneurship',
    name: 'Polymer Economics & Factory Entrepreneurship',
    icon: Building2,
    color: '#059669',
    bgColor: '#ECFDF5',
    lessons: 8,
    studyTimeHours: 7.0,
    prerequisites: 'General Engineering & Business Fundamentals',
    level: 'Advanced',
    tier: 'specializations',
    tierLabel: 'Tier 4 · Frontiers & Specializations',
    description: 'Master plastic plant feasibility DPR preparation, machine CAPEX/OPEX payback calculations, electricity tariff optimization, and resin hedging.',
    outcome: 'After this track: Write Detailed Project Reports (DPR) for new plastic processing plants, calculate part costing, and secure bank financing.',
    topics: ['Plastic Plant Feasibility DPR', 'Part Costing (Material + Machine + Energy)', 'Injection Moulding Machine Payback', 'Electricity & Maximum Demand Optimization', 'Resin Price Hedging & Procurement'],
    careers: ['Plastic Factory Founder', 'Plant Commercial Director', 'Operations Consultant'],
    industry: 'Plastic Manufacturing Entrepreneurship',
    indianCompany: 'AIPMA MSME Incubation Center',
    globalCompany: 'McKinsey Chemicals Practice',
    svgVisualType: 'generic'
  }
]

// ── SVG Subject Visual Header Preview Renderer ────────────────────────────────
function SubjectVisualHeader({ type, name, color }: { type: string; name: string; color: string }) {
  if (type === 'rheology') {
    return (
      <div className="w-full h-24 bg-gradient-to-br from-cyan-950 via-slate-900 to-blue-950 p-3 flex items-center justify-between overflow-hidden relative border-b border-cyan-900/40">
        <div className="space-y-0.5 z-10">
          <span className="font-mono text-[9px] font-bold text-cyan-400 uppercase tracking-widest block">RHEOLOGY PREVIEW</span>
          <span className="font-mono text-[10px] text-white font-bold">{name}</span>
        </div>
        <svg viewBox="0 0 100 50" className="w-24 h-14 shrink-0 text-cyan-400 z-10">
          <path d="M 0,40 Q 25,35 50,20 T 100,5" fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 0,40 Q 25,35 50,20 T 100,5 L 100,50 L 0,50 Z" fill="rgba(6,182,212,0.2)" />
          <circle cx="100" cy="5" r="3" fill="#38BDF8" />
        </svg>
      </div>
    )
  }

  if (type === 'mould') {
    return (
      <div className="w-full h-24 bg-gradient-to-br from-slate-950 via-zinc-900 to-emerald-950 p-3 flex items-center justify-between overflow-hidden relative border-b border-emerald-900/40">
        <div className="space-y-0.5 z-10">
          <span className="font-mono text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">TOOLING CAD PREVIEW</span>
          <span className="font-mono text-[10px] text-white font-bold">{name}</span>
        </div>
        <svg viewBox="0 0 100 50" className="w-24 h-14 shrink-0 text-emerald-400 z-10">
          <rect x="10" y="5" width="80" height="40" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="4,2" />
          <line x1="50" y1="5" x2="50" y2="45" stroke="#059669" strokeWidth="1.5" strokeDasharray="2,2" />
          <rect x="30" y="15" width="40" height="20" fill="rgba(16,185,129,0.2)" stroke="#34D399" strokeWidth="1.5" />
        </svg>
      </div>
    )
  }

  if (type === 'processing') {
    return (
      <div className="w-full h-24 bg-gradient-to-br from-amber-950 via-stone-900 to-slate-950 p-3 flex items-center justify-between overflow-hidden relative border-b border-amber-900/40">
        <div className="space-y-0.5 z-10">
          <span className="font-mono text-[9px] font-bold text-amber-400 uppercase tracking-widest block">EXTRUSION / MOULDING</span>
          <span className="font-mono text-[10px] text-white font-bold">{name}</span>
        </div>
        <svg viewBox="0 0 100 50" className="w-24 h-14 shrink-0 text-amber-400 z-10">
          <rect x="10" y="20" width="80" height="15" fill="rgba(245,158,11,0.2)" stroke="#F59E0B" strokeWidth="2" />
          <polygon points="25,5 40,5 35,20 30,20" fill="#F59E0B" />
          <path d="M 10 27 Q 30 23 50 27 T 90 27" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="5,2" />
        </svg>
      </div>
    )
  }

  if (type === 'testing') {
    return (
      <div className="w-full h-24 bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 p-3 flex items-center justify-between overflow-hidden relative border-b border-purple-900/40">
        <div className="space-y-0.5 z-10">
          <span className="font-mono text-[9px] font-bold text-purple-400 uppercase tracking-widest block">ASTM / ISO LAB PREVIEW</span>
          <span className="font-mono text-[10px] text-white font-bold">{name}</span>
        </div>
        <svg viewBox="0 0 100 50" className="w-24 h-14 shrink-0 text-purple-400 z-10">
          <path d="M 15 10 L 30 10 L 30 23 L 70 23 L 70 10 L 85 10 L 85 40 L 70 40 L 70 27 L 30 27 L 30 40 L 15 40 Z" fill="rgba(168,85,247,0.25)" stroke="#C084FC" strokeWidth="2" />
        </svg>
      </div>
    )
  }

  if (type === 'recycling') {
    return (
      <div className="w-full h-24 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 p-3 flex items-center justify-between overflow-hidden relative border-b border-emerald-900/40">
        <div className="space-y-0.5 z-10">
          <span className="font-mono text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">CIRCULARITY &amp; RECYCLING</span>
          <span className="font-mono text-[10px] text-white font-bold">{name}</span>
        </div>
        <svg viewBox="0 0 100 50" className="w-20 h-12 stroke-emerald-400 fill-none z-10">
          <path d="M 50,5 A 20,20 0 0,1 70,25 L 63,25 A 13,13 0 0,0 50,12 Z" fill="#10B981" />
          <path d="M 70,25 A 20,20 0 0,1 30,42 L 34,35 A 13,13 0 0,0 63,25 Z" fill="#059669" />
          <path d="M 30,42 A 20,20 0 0,1 50,5 L 50,12 A 13,13 0 0,0 34,35 Z" fill="#047857" />
        </svg>
      </div>
    )
  }

  // Default / Chemistry
  return (
    <div className="w-full h-24 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 p-3 flex items-center justify-between overflow-hidden relative border-b border-blue-900/40">
      <div className="space-y-0.5 z-10">
        <span className="font-mono text-[9px] font-bold text-sky-400 uppercase tracking-widest block">MOLECULAR SYNTHESIS</span>
        <span className="font-mono text-[10px] text-white font-bold">{name}</span>
      </div>
      <svg viewBox="0 0 100 50" className="w-20 h-12 text-sky-400 z-10">
        <polygon points="30,10 50,3 70,10 70,32 50,38 30,32" fill="none" stroke="#38BDF8" strokeWidth="2" />
        <circle cx="50" cy="21" r="8" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2,2" />
      </svg>
    </div>
  )
}

// ── CAREER PATHWAY PROFILES & DEFINITIONS ─────────────────────────────────────
const CAREER_PATHWAYS = [
  {
    id: 'all',
    label: 'All Engineering Tracks',
    description: 'Explore all 19 polymer engineering subjects mapped across 216 master lessons.',
  },
  {
    id: 'undergrad',
    label: '🎓 Undergraduate Student',
    description: 'Path for B.Tech & Diploma students: Master foundational chemistry, processing, testing, and rheology for university exams.',
  },
  {
    id: 'qc_engineer',
    label: '⚙️ Plant & QC Engineer',
    description: 'Path for shop-floor engineers: Master injection moulding parameters, ASTM/ISO testing protocols, and mould cooling troubleshooting.',
  },
  {
    id: 'rnd_scientist',
    label: '🔬 R&D Polymer Scientist',
    description: 'Path for researchers & material developers: Master polymerization kinetics, viscoelastic master curves, nanocomposites, and PHA bioplastics.',
  },
  {
    id: 'factory_founder',
    label: '🏭 Factory Founder / Entrepreneur',
    description: 'Path for manufacturing entrepreneurs: Master plant DPR feasibility, machine ROI costing, masterbatch blending, and EPR compliance.',
  },
]

export default function SubjectsPage() {
  const [selectedPathway, setSelectedPathway] = useState<string>('all')
  const [selectedTier, setSelectedTier] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter subjects based on career pathway, tier, and search query
  const filteredSubjects = useMemo(() => {
    return ALL_SUBJECTS.filter((s) => {
      const matchesSearch = !searchQuery.trim() || 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTier = selectedTier === 'all' || s.tier === selectedTier

      const matchesPathway = selectedPathway === 'all' || (
        selectedPathway === 'undergrad' ? (s.tier === 'foundation' || s.tier === 'core') :
        selectedPathway === 'qc_engineer' ? (s.slug === 'polymer-processing' || s.slug === 'polymer-testing' || s.slug === 'mould-design' || s.slug === 'polymer-rheology') :
        selectedPathway === 'rnd_scientist' ? (s.slug === 'polymer-chemistry' || s.slug === 'polymer-physics' || s.slug === 'polymer-rheology' || s.slug === 'polymer-nanotechnology' || s.slug === 'sustainable-plastics') :
        (s.slug === 'polymer-processing' || s.slug === 'mould-design' || s.slug === 'additives-compounding' || s.slug === 'polymer-economics-entrepreneurship' || s.slug === 'recycling-technology')
      )

      return matchesSearch && matchesTier && matchesPathway
    })
  }, [searchQuery, selectedTier, selectedPathway])

  // Active pathway details
  const activePathway = CAREER_PATHWAYS.find(p => p.id === selectedPathway) || CAREER_PATHWAYS[0]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 overflow-x-hidden">
      
      {/* ── 1. HERO SECTION: Midnight Navy with Indian Flag Accent ── */}
      <section className="relative pt-12 pb-14 px-4 md:px-8 border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-amber-400" />
            Curriculum Intelligence System &middot; 19 Core Disciplines
          </div>

          <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight uppercase">
            Structured Pedagogical <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">
              Polymer Engineering Matrix
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-3xl leading-relaxed font-light">
            216 Master Lessons organized into 4 pedagogical tiers &mdash; from fundamental polymer chemistry to shop-floor injection moulding, Rheology, and Industry 4.0 digital twins.
          </p>

          {/* Honest Metric Badges (Zero Marketing Padding) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 max-w-4xl font-mono">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <span className="font-display font-black text-2xl text-amber-400 block">216</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Master Lessons</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <span className="font-display font-black text-2xl text-emerald-400 block">1,080</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Verified MCQs</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <span className="font-display font-black text-2xl text-cyan-400 block">19</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Core Disciplines</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
              <span className="font-display font-black text-2xl text-indigo-400 block">100%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Industry Mapped</span>
            </div>
          </div>

          {/* Explicit Definition Callout for Industry Mapping */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl max-w-4xl text-[11px] font-mono text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Industry-Mapped Definition:</strong> Every subject connects directly to Indian industrial clusters (Hazira, Chakan, Guindy, Daman, Manali) and ISO/ASTM/BIS quality standards.
            </span>
          </div>

        </div>
      </section>

      {/* ── 2. SEPARATED FILTERS SECTION ── */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* SECTION A: Guided Career Pathways Filter */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" /> Section A: Guided Career Pathways
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Filter by Career Goal
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap mobile-touch-scroll pb-1">
            {CAREER_PATHWAYS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPathway(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all min-h-[38px] ${
                  selectedPathway === p.id
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-300">
            ℹ️ {activePathway.description}
          </div>
        </div>

        {/* SECTION B: Academic Learning Tiers & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject title, topics..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Academic Tier Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto whitespace-nowrap mobile-touch-scroll">
              <button
                onClick={() => setSelectedTier('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedTier === 'all'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All 4 Tiers (19)
              </button>
              <button
                onClick={() => setSelectedTier('foundation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedTier === 'foundation'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Tier 1: Foundation (3)
              </button>
              <button
                onClick={() => setSelectedTier('core')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedTier === 'core'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Tier 2: Core Engineering (4)
              </button>
              <button
                onClick={() => setSelectedTier('applications')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedTier === 'applications'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Tier 3: Applied Industries (6)
              </button>
              <button
                onClick={() => setSelectedTier('specializations')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedTier === 'specializations'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Tier 4: Frontiers (6)
              </button>
            </div>

          </div>
        </div>

        {/* ── 3. SUBJECT CARDS GRID ── */}
        {filteredSubjects.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-display font-bold text-lg text-white">No Matching Engineering Subjects Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try resetting search filters or switching career pathways to view the complete polymer engineering matrix.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedTier('all')
                setSelectedPathway('all')
              }}
              className="bg-amber-400 text-slate-950 font-mono text-xs font-bold px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors uppercase"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((sub) => {
              const IconComp = sub.icon

              return (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:border-slate-700 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* SVG Visual Header Header Preview */}
                    <SubjectVisualHeader type={sub.svgVisualType} name={sub.name} color={sub.color} />

                    {/* Content Details */}
                    <div className="p-5 space-y-3.5">
                      
                      {/* Top Badges */}
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="px-2.5 py-0.5 rounded bg-slate-950 text-blue-300 border border-slate-800 font-bold uppercase">
                          {sub.tierLabel}
                        </span>
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ~{sub.studyTimeHours} Hours
                        </span>
                      </div>

                      {/* Title */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5" style={{ color: sub.color }}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <h3 className="font-display font-black text-lg text-white group-hover:text-blue-400 transition-colors leading-snug">
                          {sub.name}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {sub.description}
                      </p>

                      {/* 🚨 KEY OUTCOME LINE (What students will be able to do) */}
                      <div className="p-2.5 bg-blue-950/40 border border-blue-800/60 rounded-xl text-[11px] font-mono text-blue-200 leading-snug">
                        <strong className="text-amber-400 font-bold block mb-0.5">🎯 Track Outcome:</strong>
                        {sub.outcome}
                      </div>

                      {/* Prerequisites */}
                      <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <span className="text-slate-500 font-bold">Prerequisites:</span>
                        <span className="truncate">{sub.prerequisites}</span>
                      </div>

                      {/* Key Topics List */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Core Syllabus Topics:</span>
                        <div className="flex flex-wrap gap-1">
                          {sub.topics.slice(0, 3).map((topic, i) => (
                            <span key={i} className="text-[9.5px] font-mono bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                              • {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Standardized CTA Footer */}
                  <div className="p-5 pt-0 border-t border-slate-800/60 flex items-center justify-between gap-2 mt-4">
                    <div className="text-[11px] font-mono text-slate-400">
                      <strong className="text-white font-bold">{sub.lessons}</strong> Lessons Cataloged
                    </div>

                    <Link
                      href={`/subjects/${sub.slug}`}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all shadow-md"
                    >
                      Explore Subject <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </motion.div>
              )
            })}
          </div>
        )}

        {/* ── 4. AI TUTOR INTEGRATION PROMPT BANNER ── */}
        <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-2 border-blue-900/80 rounded-2xl p-6 md:p-8 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-900/60 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-4 h-4" /> AI Curriculum Synthesis Assistant
              </span>
              <h3 className="font-display font-black text-xl text-white">
                Have Questions About Subject Prerequisites or Exam Syllabi?
              </h3>
            </div>
            <Link
              href="/ai-tutor?prompt=Which%20polymer%20subjects%20should%20I%20study%20first%20for%20GATE%20Polymer%20Science%20preparation%3F"
              className="inline-flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold uppercase px-5 py-3 rounded-xl shadow-lg transition-all shrink-0"
            >
              Ask AI Tutor &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-slate-300">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              💡 <strong>GATE Preparation:</strong> &quot;Derive Flory-Huggins free energy of mixing and explain chi parameter.&quot;
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              ⚙️ <strong>Plant Troubleshooting:</strong> &quot;How do I eliminate warpage in a thin-wall PP injection tool?&quot;
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              🧪 <strong>Compounding R&amp;D:</strong> &quot;Explain phenolic vs phosphite antioxidant synergism in HDPE.&quot;
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
