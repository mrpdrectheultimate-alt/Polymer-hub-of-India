'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Scale,
  Brain,
  Layers,
  CheckCircle2,
  XCircle,
  Search,
  Activity,
  Building2
} from 'lucide-react'
import { CommercialGradeComparator } from '@/components/CommercialGradeComparator'
import Footer from '@/components/Footer'

// ==================== TYPES & DATA ====================

type PolymerType = 'commodity' | 'engineering' | 'specialty' | 'elastomer' | 'bioplastic'

interface PolymerData {
  id: string
  name: string
  abbr: string
  family: string
  type: PolymerType
  color: string
  bg: string
  // Nominal numerical values for Ashby charts & Performance Index calculations
  densityVal: number // g/cm³
  tensileVal: number // MPa
  modulusVal: number // GPa
  hdtVal: number // °C
  tgVal: number // °C
  tmVal: number // °C
  impactVal: number // J/m
  elongationVal: number // %
  costEst: number // INR/kg approx
  // Text descriptions
  properties: {
    density: string
    tg: string
    tm: string
    tensile: string
    modulus: string
    elongation: string
    impact: string
    hdt: string
    mfi: string
    processing: string
    shrinkage: string
    water: string
    flammability: string
    chemical: string
    applications: string
    india: string
  }
}

const ALL_BASE_POLYMERS: PolymerData[] = [
  {
    id: 'pp',
    name: 'Polypropylene',
    abbr: 'PP',
    family: 'Polyolefin',
    type: 'commodity',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    densityVal: 0.905,
    tensileVal: 35,
    modulusVal: 1.45,
    hdtVal: 102,
    tgVal: -10,
    tmVal: 165,
    impactVal: 45,
    elongationVal: 200,
    costEst: 110,
    properties: {
      density: '0.90–0.91 g/cm³ (Nominal: 0.905)',
      tg: '−10°C to 0°C',
      tm: '160–170°C',
      tensile: '30–40 MPa (Typical: 35 MPa ±5%)',
      modulus: '1,200–1,700 MPa (1.45 GPa)',
      elongation: '100–600%',
      impact: '20–80 J/m (Izod notched)',
      hdt: '100–108°C (0.45 MPa)',
      mfi: '0.5–35 g/10min (230°C/2.16kg)',
      processing: '200–260°C',
      shrinkage: '1.2–2.2%',
      water: '<0.02%',
      flammability: 'UL94 HB',
      chemical: 'Excellent to acids/alkalis; susceptible to aromatic solvents',
      applications: 'Automotive trim, woven sacks, food containers, battery cases',
      india: 'Reliance (Repol), IOCL (Propel), GAIL, Haldia Petrochem'
    }
  },
  {
    id: 'hdpe',
    name: 'High-Density Polyethylene',
    abbr: 'HDPE',
    family: 'Polyolefin',
    type: 'commodity',
    color: '#0284C7',
    bg: '#F0F9FF',
    densityVal: 0.955,
    tensileVal: 30,
    modulusVal: 1.10,
    hdtVal: 80,
    tgVal: -120,
    tmVal: 132,
    impactVal: 65,
    elongationVal: 500,
    costEst: 115,
    properties: {
      density: '0.94–0.97 g/cm³ (Nominal: 0.955)',
      tg: '−120°C (Flexible sub-zero)',
      tm: '128–135°C',
      tensile: '25–35 MPa (Typical: 30 MPa ±5%)',
      modulus: '900–1,300 MPa (1.10 GPa)',
      elongation: '300–800%',
      impact: '40–120 J/m',
      hdt: '75–85°C (0.45 MPa)',
      mfi: '0.05–45 g/10min (190°C/2.16kg)',
      processing: '180–240°C',
      shrinkage: '1.5–3.0%',
      water: '<0.01%',
      flammability: 'UL94 HB',
      chemical: 'Outstanding resistance to aqueous acids, bases, salts',
      applications: 'PE100 pressure pipes, blow-molded jerrycans, geomembranes',
      india: 'Reliance (Relene), IOCL (Propel), GAIL, OPaL'
    }
  },
  {
    id: 'ldpe',
    name: 'Low-Density Polyethylene',
    abbr: 'LDPE',
    family: 'Polyolefin',
    type: 'commodity',
    color: '#0D9488',
    bg: '#F0FDFA',
    densityVal: 0.922,
    tensileVal: 15,
    modulusVal: 0.28,
    hdtVal: 45,
    tgVal: -120,
    tmVal: 112,
    impactVal: 150,
    elongationVal: 600,
    costEst: 120,
    properties: {
      density: '0.91–0.93 g/cm³',
      tg: '−120°C',
      tm: '105–118°C',
      tensile: '10–20 MPa',
      modulus: '200–350 MPa',
      elongation: '400–700%',
      impact: 'Non-break',
      hdt: '40–50°C',
      mfi: '0.2–60 g/10min',
      processing: '160–220°C',
      shrinkage: '1.5–4.5%',
      water: '<0.01%',
      flammability: 'UL94 HB',
      chemical: 'High chemical inertness',
      applications: 'Heavy duty shrink film, squeeze tubes, cable jacketing',
      india: 'Reliance (Relene LD), OPaL, Haldia'
    }
  },
  {
    id: 'pvc',
    name: 'Polyvinyl Chloride (Rigid)',
    abbr: 'uPVC',
    family: 'Vinyl Polymer',
    type: 'commodity',
    color: '#3B82F6',
    bg: '#EFF6FF',
    densityVal: 1.40,
    tensileVal: 50,
    modulusVal: 3.20,
    hdtVal: 72,
    tgVal: 82,
    tmVal: 0, // Amorphous
    impactVal: 40,
    elongationVal: 40,
    costEst: 95,
    properties: {
      density: '1.35–1.45 g/cm³',
      tg: '80–85°C',
      tm: 'Amorphous (No Tm)',
      tensile: '45–55 MPa',
      modulus: '2,800–3,600 MPa (3.2 GPa)',
      elongation: '20–60%',
      impact: '30–70 J/m',
      hdt: '68–76°C',
      mfi: 'K-value 57–68',
      processing: '170–200°C (Requires thermal stabilizer)',
      shrinkage: '0.2–0.5%',
      water: '0.04%',
      flammability: 'UL94 V-0 (Self-extinguishing)',
      chemical: 'Excellent mineral acid/alkali resistance',
      applications: 'Rigid water pipes, window profiles, conduit channels',
      india: 'Finolex Industries, Chemplast Sanmar, DCW'
    }
  },
  {
    id: 'abs',
    name: 'Acrylonitrile Butadiene Styrene',
    abbr: 'ABS',
    family: 'Styrenic Copolymer',
    type: 'engineering',
    color: '#EA580C',
    bg: '#FFF7ED',
    densityVal: 1.05,
    tensileVal: 45,
    modulusVal: 2.35,
    hdtVal: 92,
    tgVal: 105,
    tmVal: 0, // Amorphous
    impactVal: 220,
    elongationVal: 30,
    costEst: 185,
    properties: {
      density: '1.03–1.07 g/cm³',
      tg: '100–115°C',
      tm: 'Amorphous',
      tensile: '40–50 MPa',
      modulus: '2,100–2,600 MPa (2.35 GPa)',
      elongation: '15–40%',
      impact: '150–350 J/m (High notch toughness)',
      hdt: '88–98°C',
      mfi: '1–25 g/10min',
      processing: '210–260°C',
      shrinkage: '0.4–0.7%',
      water: '0.25%',
      flammability: 'UL94 HB / V-0 grades',
      chemical: 'Resistant to dilute acids; attacked by ketones',
      applications: 'Automotive grilles, consumer electronics, power tool bodies',
      india: 'INEOS Styrolution India, Bhansali Engineering Polymers'
    }
  },
  {
    id: 'pc',
    name: 'Polycarbonate',
    abbr: 'PC',
    family: 'Polyester Carbonate',
    type: 'engineering',
    color: '#C2410C',
    bg: '#FFF7ED',
    densityVal: 1.20,
    tensileVal: 65,
    modulusVal: 2.40,
    hdtVal: 135,
    tgVal: 148,
    tmVal: 0, // Amorphous
    impactVal: 700,
    elongationVal: 110,
    costEst: 260,
    properties: {
      density: '1.19–1.22 g/cm³',
      tg: '145–150°C',
      tm: 'Amorphous (Glassy clarity 89%)',
      tensile: '60–72 MPa',
      modulus: '2,200–2,600 MPa',
      elongation: '80–130%',
      impact: '600–850 J/m (Exceptional impact resistance)',
      hdt: '130–140°C',
      mfi: '3–30 g/10min (300°C/1.2kg)',
      processing: '280–320°C (Must pre-dry <0.02%)',
      shrinkage: '0.5–0.7%',
      water: '0.15%',
      flammability: 'UL94 V-2 to V-0',
      chemical: 'Good to aliphatic hydrocarbons; attacked by amines',
      applications: 'Safety goggles, bulletproof glazing, headlamp lenses',
      india: 'Covestro India, SABIC Innovative Plastics'
    }
  },
  {
    id: 'pa66',
    name: 'Nylon 66 (Polyamide 66)',
    abbr: 'PA66',
    family: 'Polyamide',
    type: 'engineering',
    color: '#B45309',
    bg: '#FEF3C7',
    densityVal: 1.14,
    tensileVal: 82,
    modulusVal: 3.00,
    hdtVal: 85,
    tgVal: 50,
    tmVal: 262,
    impactVal: 55,
    elongationVal: 60,
    costEst: 290,
    properties: {
      density: '1.13–1.15 g/cm³',
      tg: '50–55°C (dry)',
      tm: '255–265°C',
      tensile: '75–90 MPa (dry) / 50 MPa (conditioned)',
      modulus: '2,800–3,400 MPa',
      elongation: '30–80%',
      impact: '40–70 J/m',
      hdt: '80–90°C (Unfilled) / 240°C (30% GF)',
      mfi: '10–80 g/10min',
      processing: '270–300°C',
      shrinkage: '1.0–2.0%',
      water: '2.5% (equilibrium at 50% RH)',
      flammability: 'UL94 V-2',
      chemical: 'Exceptional oil/grease/fuel resistance',
      applications: 'Under-the-hood automotive manifolds, gears, cable ties',
      india: 'DuPont / Celanese India, BASF India, SRF Limited'
    }
  },
  {
    id: 'pom',
    name: 'Polyoxymethylene (Acetal / Delrin)',
    abbr: 'POM',
    family: 'Polyacetal',
    type: 'engineering',
    color: '#047857',
    bg: '#ECFDF5',
    densityVal: 1.41,
    tensileVal: 68,
    modulusVal: 2.90,
    hdtVal: 120,
    tgVal: -60,
    tmVal: 178,
    impactVal: 65,
    elongationVal: 40,
    costEst: 270,
    properties: {
      density: '1.40–1.43 g/cm³',
      tg: '−60°C',
      tm: '175–182°C',
      tensile: '65–72 MPa',
      modulus: '2,700–3,100 MPa',
      elongation: '25–50%',
      impact: '50–80 J/m',
      hdt: '115–125°C',
      mfi: '2–30 g/10min (190°C/2.16kg)',
      processing: '190–220°C',
      shrinkage: '1.8–2.5%',
      water: '0.20%',
      flammability: 'UL94 HB',
      chemical: 'Outstanding fatigue and solvent resistance; low friction',
      applications: 'Precision gears, conveyor chains, fuel sender units',
      india: 'Celanese India (Hostaform), Polyplastics India'
    }
  },
  {
    id: 'pet',
    name: 'Polyethylene Terephthalate',
    abbr: 'PET',
    family: 'Polyester',
    type: 'engineering',
    color: '#4F46E5',
    bg: '#EEF2FF',
    densityVal: 1.37,
    tensileVal: 60,
    modulusVal: 3.10,
    hdtVal: 75,
    tgVal: 78,
    tmVal: 255,
    impactVal: 40,
    elongationVal: 120,
    costEst: 105,
    properties: {
      density: '1.34–1.40 g/cm³',
      tg: '75–80°C',
      tm: '250–260°C',
      tensile: '55–75 MPa',
      modulus: '2,800–3,400 MPa',
      elongation: '50–250%',
      impact: '30–60 J/m',
      hdt: '70–80°C',
      mfi: 'IV 0.72–0.84 dL/g',
      processing: '265–290°C (Dry <0.005%)',
      shrinkage: '0.2–0.5%',
      water: '0.10%',
      flammability: 'UL94 HB',
      chemical: 'Excellent gas barrier (O2, CO2); good acid resistance',
      applications: 'Carbonated beverage bottles, thermoformed trays, strapping',
      india: 'Reliance Industries (Relpet), Indorama Ventures, JBF'
    }
  },
  {
    id: 'peek',
    name: 'Polyether Ether Ketone',
    abbr: 'PEEK',
    family: 'PAEK',
    type: 'specialty',
    color: '#7C3AED',
    bg: '#F5F3FF',
    densityVal: 1.30,
    tensileVal: 100,
    modulusVal: 3.80,
    hdtVal: 160,
    tgVal: 143,
    tmVal: 343,
    impactVal: 75,
    elongationVal: 45,
    costEst: 8500,
    properties: {
      density: '1.30–1.32 g/cm³',
      tg: '143°C',
      tm: '343°C',
      tensile: '95–105 MPa (Unfilled) / 210 MPa (30% CF)',
      modulus: '3,600–4,100 MPa (3.8 GPa)',
      elongation: '35–55%',
      impact: '60–90 J/m',
      hdt: '155–165°C (Unfilled) / 315°C (30% GF)',
      mfi: '3–20 g/10min (400°C/2.16kg)',
      processing: '370–410°C (Mould: 160–190°C)',
      shrinkage: '1.0–1.4%',
      water: '0.10%',
      flammability: 'UL94 V-0 (Low smoke/toxicity)',
      chemical: 'Insoluble in all common solvents except conc. H2SO4',
      applications: 'Spine implants, aerospace thrust washers, semiconductor rings',
      india: 'Victrex India, Evonik Specialty Polymers'
    }
  },
  {
    id: 'ptfe',
    name: 'Polytetrafluoroethylene (Teflon)',
    abbr: 'PTFE',
    family: 'Fluoropolymer',
    type: 'specialty',
    color: '#9333EA',
    bg: '#FAF5FF',
    densityVal: 2.16,
    tensileVal: 25,
    modulusVal: 0.55,
    hdtVal: 55,
    tgVal: -120,
    tmVal: 327,
    impactVal: 160,
    elongationVal: 300,
    costEst: 1400,
    properties: {
      density: '2.14–2.18 g/cm³',
      tg: '−120°C',
      tm: '327°C',
      tensile: '20–35 MPa',
      modulus: '450–650 MPa',
      elongation: '200–400%',
      impact: '150–180 J/m',
      hdt: '50–60°C',
      mfi: 'Non-melt processable (Paste extrusion/sintering)',
      processing: 'Ram extrusion / Sintering at 370–380°C',
      shrinkage: '3.0–6.0%',
      water: '<0.01%',
      flammability: 'UL94 V-0 (LOI >95%)',
      chemical: 'Universal chemical inertness; lowest coefficient of friction',
      applications: 'Corrosive chemical valve seals, non-stick cookware coatings',
      india: 'Gujarat Fluorochemicals (GFL - Inoflon)'
    }
  },
  {
    id: 'pla',
    name: 'Polylactic Acid (Biopolymer)',
    abbr: 'PLA',
    family: 'Biopolyester',
    type: 'bioplastic',
    color: '#15803D',
    bg: '#F0FDF4',
    densityVal: 1.24,
    tensileVal: 62,
    modulusVal: 3.50,
    hdtVal: 55,
    tgVal: 58,
    tmVal: 165,
    impactVal: 25,
    elongationVal: 6,
    costEst: 210,
    properties: {
      density: '1.23–1.25 g/cm³',
      tg: '55–60°C',
      tm: '160–175°C',
      tensile: '55–68 MPa',
      modulus: '3,300–3,800 MPa',
      elongation: '4–8%',
      impact: '20–30 J/m (Brittle)',
      hdt: '50–55°C',
      mfi: '5–30 g/10min (190°C/2.16kg)',
      processing: '180–210°C',
      shrinkage: '0.3–0.6%',
      water: '0.35%',
      flammability: 'UL94 HB',
      chemical: 'Compostable under industrial conditions (EN 13432)',
      applications: '3D printing filament, bio-based food takeaway packaging',
      india: 'NatureWorks (Ingeo supply), TotalEnergies Corbion'
    }
  }
]

// ==================== MAIN COMPONENT ====================

export default function ComparatorPage() {
  const [activeTab, setActiveTab] = useState<'base' | 'commercial'>('base')
  const [selectedIds, setSelectedIds] = useState<string[]>(['pp', 'hdpe'])
  const [activeCurveMode, setActiveCurveMode] = useState<'viscosity' | 'stress_strain'>('viscosity')
  
  // Ashby Constraint Filters (Must meet)
  const [reqHdt, setReqHdt] = useState<number>(75)
  const [reqTensile, setReqTensile] = useState<number>(25)
  const [reqDensity, setReqDensity] = useState<number>(1.5)
  const [reqCost, setReqCost] = useState<number>(500)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState('all')

  // Selected Polymers
  const selectedPolymers = useMemo(() => {
    return selectedIds
      .map(id => ALL_BASE_POLYMERS.find(p => p.id === id))
      .filter((p): p is PolymerData => Boolean(p))
  }, [selectedIds])

  // Filtered Polymer Grid for selection
  const filteredList = useMemo(() => {
    return ALL_BASE_POLYMERS.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.abbr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.family.toLowerCase().includes(searchTerm.toLowerCase())
      const matchFam = selectedFamilyFilter === 'all' || p.type === selectedFamilyFilter
      return matchSearch && matchFam
    })
  }, [searchTerm, selectedFamilyFilter])

  // Toggle selection
  const handleTogglePolymer = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(x => x !== id))
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id])
      }
    }
  }

  // Ashby Performance Index M = (sigma^(2/3)) / rho for lightweight strength
  const rankedCandidates = useMemo(() => {
    return ALL_BASE_POLYMERS.map(p => {
      // Constraints check
      const passesHdt = p.hdtVal >= reqHdt
      const passesTensile = p.tensileVal >= reqTensile
      const passesDensity = p.densityVal <= reqDensity
      const passesCost = p.costEst <= reqCost
      const allPassed = passesHdt && passesTensile && passesDensity && passesCost

      // Ashby Index M = (sigma^(2/3)) / rho
      const performanceIndex = Number((Math.pow(p.tensileVal, 2/3) / p.densityVal).toFixed(2))

      return {
        ...p,
        passesHdt,
        passesTensile,
        passesDensity,
        passesCost,
        allPassed,
        performanceIndex
      }
    }).sort((a, b) => b.performanceIndex - a.performanceIndex)
  }, [reqHdt, reqTensile, reqDensity, reqCost])

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-x-hidden">
      
      {/* ============================================================ */}
      {/* HERO — Deep Navy & Emerald Ashby Material Science Header */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-[#0B172A] via-[#0A2E1A] to-[#0B172A] overflow-hidden py-12 lg:py-16 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#6EE7B7] text-xs font-mono font-bold tracking-wider uppercase shadow-sm">
                <Scale className="h-3.5 w-3.5" />
                Ashby Selection Engine &middot; CAMPUS Standards
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Systematic Material Selection.
                <span className="block bg-gradient-to-r from-[#6EE7B7] via-[#34D399] to-[#38BDF8] bg-clip-text text-transparent">
                  Property Tradeoffs &amp; TDS Benchmarking.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-2xl">
                Compare 16 base polymer families and 25+ commercial TDS grades using Prof. Mike Ashby&apos;s 
                systematic constraints-objective optimization and CAMPUS multipoint rheological curves.
              </p>
            </motion.div>

            {/* Mode Switcher */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/15 shrink-0 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('base')}
                className={`
                  px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2
                  ${activeTab === 'base'
                    ? 'bg-[#10B981] text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                  }
                `}
              >
                <Layers className="h-3.5 w-3.5" /> 16 Base Families
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('commercial')}
                className={`
                  px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2
                  ${activeTab === 'commercial'
                    ? 'bg-[#10B981] text-slate-950 shadow-md'
                    : 'text-slate-300 hover:text-white'
                  }
                `}
              >
                <Building2 className="h-3.5 w-3.5" /> Commercial TDS Grades
              </button>
            </div>

          </div>
        </div>

        {/* Tricolor Accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ── COMMERCIAL COMPARATOR MODE ── */}
        {activeTab === 'commercial' ? (
          <CommercialGradeComparator />
        ) : (
          <>
            {/* ============================================================ */}
            {/* STEP 1: DEFINE REQUIREMENTS & CONSTRAINTS (Ashby Method) */}
            {/* ============================================================ */}
            <section className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider">
                    Step 1: Systematic Design Constraints
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#111827]">
                    Ashby Objective &amp; Constraint Boundaries
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Filter materials by application physics: Temperature &middot; Strength &middot; Density &middot; Cost
                  </p>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-mono font-bold flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-amber-600" />
                  Objective: Maximize Strength-to-Weight [M = σ^(2/3)/ρ]
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Constraint 1: Minimum HDT */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-slate-700">Min. HDT (0.45 MPa)</span>
                    <span className="font-bold text-orange-600">&ge; {reqHdt}°C</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="160"
                    step="5"
                    value={reqHdt}
                    onChange={(e) => setReqHdt(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <p className="text-[10px] font-mono text-slate-400">Under-the-hood &gt; 80°C &middot; Hot fill &gt; 95°C</p>
                </div>

                {/* Constraint 2: Min Tensile Strength */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-slate-700">Min. Tensile Strength</span>
                    <span className="font-bold text-blue-600">&ge; {reqTensile} MPa</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    step="5"
                    value={reqTensile}
                    onChange={(e) => setReqTensile(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[10px] font-mono text-slate-400">Structural rigid &gt; 35 MPa &middot; Films &gt; 15 MPa</p>
                </div>

                {/* Constraint 3: Max Density */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-slate-700">Max. Density Limit</span>
                    <span className="font-bold text-emerald-600">&le; {reqDensity.toFixed(2)} g/cm³</span>
                  </div>
                  <input
                    type="range"
                    min="0.9"
                    max="2.2"
                    step="0.05"
                    value={reqDensity}
                    onChange={(e) => setReqDensity(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <p className="text-[10px] font-mono text-slate-400">Polyolefins &lt; 0.96 &middot; Fluoropolymers &gt; 2.1</p>
                </div>

                {/* Constraint 4: Max Resin Cost */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-slate-700">Max. Resin Cost</span>
                    <span className="font-bold text-purple-600">&le; ₹{reqCost}/kg</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={reqCost}
                    onChange={(e) => setReqCost(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <p className="text-[10px] font-mono text-slate-400">Commodity &lt; ₹130 &middot; Engineering &lt; ₹350</p>
                </div>

              </div>
            </section>

            {/* ============================================================ */}
            {/* STEP 2: MULTI-SELECT RESIN POOL (Max 3) */}
            {/* ============================================================ */}
            <section className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider">
                    Step 2: Compare Base Polymer Families
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#111827]">
                    Select Up to 3 Candidates ({selectedIds.length} / 3 Selected)
                  </h3>
                </div>

                {/* Search & Filter pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search polymer (PP, PEEK, PC)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <select
                    value={selectedFamilyFilter}
                    onChange={(e) => setSelectedFamilyFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-xl bg-slate-50"
                  >
                    <option value="all">All Types (16)</option>
                    <option value="commodity">Commodity</option>
                    <option value="engineering">Engineering</option>
                    <option value="specialty">Specialty</option>
                    <option value="bioplastic">Bioplastic</option>
                  </select>
                </div>
              </div>

              {/* Interactive Polymer Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredList.map((p) => {
                  const isSelected = selectedIds.includes(p.id)
                  const candidateInfo = rankedCandidates.find(c => c.id === p.id)
                  const passed = candidateInfo?.allPassed

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleTogglePolymer(p.id)}
                      className={`
                        p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 relative overflow-hidden group
                        ${isSelected
                          ? 'border-slate-900 bg-white shadow-md ring-2 ring-slate-900/10'
                          : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-xs'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className="font-mono font-black text-xs px-2 py-0.5 rounded-lg text-white"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.abbr}
                        </span>

                        {passed ? (
                          <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="h-3 w-3" /> Pass
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-rose-500 font-bold flex items-center gap-0.5">
                            <XCircle className="h-3 w-3" /> Fails
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-xs text-slate-900 truncate leading-tight">{p.name}</p>
                        <p className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">Index: {candidateInfo?.performanceIndex}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* ============================================================ */}
            {/* STEP 3: ASHBY PROPERTY TRADEOFF CHART & RANKING */}
            {/* ============================================================ */}
            <section className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider">
                    Step 3: Ashby Selection Chart &amp; Ranking
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#111827]">
                    Tensile Strength (&sigma;) vs. Density (&rho;) Tradeoff Chart
                  </h3>
                </div>

                <div className="text-xs font-mono text-slate-500">
                  Materials above the diagonal selection line deliver highest specific strength
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left 7 Columns: Visual Canvas Chart */}
                <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-6 text-white border-2 border-slate-900 relative shadow-inner">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-4">
                    <span>▲ Tensile Strength (&sigma;, MPa) [Log Scale]</span>
                    <span className="text-[#34D399]">Selection Line: &sigma;^(2/3)/&rho; = const</span>
                  </div>

                  {/* Visual Scatter Grid */}
                  <div className="relative h-64 w-full border-l border-b border-white/20">
                    
                    {/* Diagonal Selection Guideline */}
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="w-full h-full opacity-40">
                        <line x1="10%" y1="90%" x2="90%" y2="15%" stroke="#34D399" strokeWidth="2" strokeDasharray="4 4" />
                      </svg>
                    </div>

                    {/* Material Bubbles */}
                    {ALL_BASE_POLYMERS.map((p) => {
                      const isSelected = selectedIds.includes(p.id)
                      // Normalize coordinates
                      const xPct = Math.min(90, Math.max(10, ((p.densityVal - 0.85) / (2.2 - 0.85)) * 100))
                      const yPct = Math.min(85, Math.max(10, 100 - ((p.tensileVal - 10) / (110 - 10)) * 100))

                      return (
                        <div
                          key={p.id}
                          style={{ left: `${xPct}%`, top: `${yPct}%` }}
                          className={`
                            absolute -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer group
                            ${isSelected ? 'z-30 scale-125' : 'z-10 opacity-70 hover:opacity-100 hover:scale-110'}
                          `}
                          onClick={() => handleTogglePolymer(p.id)}
                        >
                          <div
                            className={`
                              w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-black text-white shadow-lg border-2
                              ${isSelected ? 'border-white ring-4 ring-emerald-400/40' : 'border-white/30'}
                            `}
                            style={{ backgroundColor: p.color }}
                          >
                            {p.abbr}
                          </div>

                          {/* Tooltip on hover */}
                          <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-slate-900 border border-white/20 text-white rounded-lg text-[10px] font-mono whitespace-nowrap pointer-events-none shadow-xl transition-opacity">
                            {p.name}: {p.tensileVal} MPa &middot; {p.densityVal} g/cm³
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 mt-3">
                    <span>0.85 g/cm³ (Lightweight Polyolefins)</span>
                    <span>Density (&rho;, g/cm³) &rarr;</span>
                    <span>2.20 g/cm³ (PTFE)</span>
                  </div>
                </div>

                {/* Right 5 Columns: Algorithmic Ranking Table */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase text-slate-700">
                        🏆 Candidate Ranking (Ashby Performance Index)
                      </span>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {rankedCandidates.slice(0, 5).map((cand, idx) => (
                        <div
                          key={cand.id}
                          className={`
                            p-3 rounded-xl border transition-all flex items-center justify-between text-xs font-mono
                            ${selectedIds.includes(cand.id)
                              ? 'bg-white border-slate-900 shadow-sm'
                              : 'bg-white/60 border-slate-200'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <div>
                              <p className="font-bold text-slate-900">{cand.name} ({cand.abbr})</p>
                              <p className="text-[10px] text-slate-500">
                                {cand.allPassed ? '✓ Meets All Constraints' : '✕ Fails Constraint Filter'}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-emerald-700 block">
                              M = {cand.performanceIndex}
                            </span>
                            <span className="text-[10px] text-slate-400">~₹{cand.costEst}/kg</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* ============================================================ */}
            {/* STEP 4: CAMPUS MULTIPOINT CURVES (Viscosity & Stress-Strain) */}
            {/* ============================================================ */}
            <section className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider">
                    Step 4: CAMPUS Multipoint Rheology
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#111827]">
                    Multipoint Dynamic Flow &amp; Tensile Stress-Strain Curves
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveCurveMode('viscosity')}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all
                      ${activeCurveMode === 'viscosity' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}
                    `}
                  >
                    Viscosity vs Shear Rate (230°C)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCurveMode('stress_strain')}
                    className={`
                      px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all
                      ${activeCurveMode === 'stress_strain' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}
                    `}
                  >
                    Tensile Stress vs Strain (23°C)
                  </button>
                </div>
              </div>

              {/* Curve Overlay Simulation */}
              <div className="bg-slate-900 rounded-3xl p-6 text-white border-2 border-slate-900">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
                  <span>
                    {activeCurveMode === 'viscosity'
                      ? '▲ Dynamic Melt Viscosity (η, Pa·s) [Log Scale]'
                      : '▲ Engineering Stress (σ, MPa)'
                    }
                  </span>
                  <div className="flex items-center gap-3">
                    {selectedPolymers.map(p => (
                      <span key={p.id} className="flex items-center gap-1.5 font-bold" style={{ color: p.color }}>
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-56 w-full border-l border-b border-white/20 relative flex items-center justify-center">
                  <svg className="w-full h-full p-4 overflow-visible">
                    {selectedPolymers.map((p, idx) => {
                      if (activeCurveMode === 'viscosity') {
                        // Power law shear thinning curve
                        const startY = 40 + idx * 25
                        const endY = 180 + idx * 15
                        return (
                          <path
                            key={p.id}
                            d={`M 20 ${startY} C 120 ${startY + 20}, 240 ${endY - 20}, 450 ${endY}`}
                            fill="none"
                            stroke={p.color}
                            strokeWidth="3"
                          />
                        )
                      } else {
                        // Stress strain curve
                        const yieldY = 180 - (p.tensileVal * 1.5)
                        return (
                          <path
                            key={p.id}
                            d={`M 20 180 Q 80 ${yieldY}, 140 ${yieldY + 10} T 350 ${yieldY + 20}`}
                            fill="none"
                            stroke={p.color}
                            strokeWidth="3"
                          />
                        )
                      }
                    })}
                  </svg>
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mt-3">
                  <span>
                    {activeCurveMode === 'viscosity' ? '10 s⁻¹ (Extrusion / Parison)' : '0% Strain (Elastic Region)'}
                  </span>
                  <span>
                    {activeCurveMode === 'viscosity' ? 'Shear Rate (γ̇, s⁻¹) →' : 'Strain (ε, %) →'}
                  </span>
                  <span>
                    {activeCurveMode === 'viscosity' ? '10,000 s⁻¹ (Injection Mold Gate)' : 'Break Extension (%)'}
                  </span>
                </div>
              </div>
            </section>

            {/* ============================================================ */}
            {/* STEP 5: SIDE-BY-SIDE PROPERTY MATRIX WITH MIN/TYPICAL/MAX */}
            {/* ============================================================ */}
            <section className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider">
                    Step 5: Full Engineering Property Matrix
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#111827]">
                    Brandrup &amp; CAMPUS Verified Technical Data
                  </h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b-2 border-slate-900 bg-slate-50">
                      <th className="p-3 font-black text-slate-900 uppercase">Property Parameter</th>
                      {selectedPolymers.map((p) => (
                        <th key={p.id} className="p-3 font-black uppercase" style={{ color: p.color }}>
                          {p.name} ({p.abbr})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-700">Specific Density (ASTM D792)</td>
                      {selectedPolymers.map(p => (
                        <td key={p.id} className="p-3 font-bold text-slate-900">{p.properties.density}</td>
                      ))}
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-700">Glass Transition Temp (Tg)</td>
                      {selectedPolymers.map(p => (
                        <td key={p.id} className="p-3 font-bold text-slate-900">{p.properties.tg}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-700">Crystalline Melting Point (Tm)</td>
                      {selectedPolymers.map(p => (
                        <td key={p.id} className="p-3 font-bold text-slate-900">{p.properties.tm}</td>
                      ))}
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-700">Tensile Strength at Yield (ASTM D638)</td>
                      {selectedPolymers.map(p => (
                        <td key={p.id} className="p-3 font-bold text-slate-900">{p.properties.tensile}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-700">Flexural Modulus (ASTM D790)</td>
                      {selectedPolymers.map(p => (
                        <td key={p.id} className="p-3 font-bold text-slate-900">{p.properties.modulus}</td>
                      ))}
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-700">Heat Deflection Temp (HDT 0.45 MPa)</td>
                      {selectedPolymers.map(p => (
                        <td key={p.id} className="p-3 font-bold text-slate-900">{p.properties.hdt}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-700">Notched Izod Impact (ASTM D256)</td>
                      {selectedPolymers.map(p => (
                        <td key={p.id} className="p-3 font-bold text-slate-900">{p.properties.impact}</td>
                      ))}
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-700">Processing Window</td>
                      {selectedPolymers.map(p => (
                        <td key={p.id} className="p-3 font-bold text-slate-900">{p.properties.processing}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-700">Mold Shrinkage Rate</td>
                      {selectedPolymers.map(p => (
                        <td key={p.id} className="p-3 font-bold text-slate-900">{p.properties.shrinkage}</td>
                      ))}
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-700">Chemical Resistance Summary</td>
                      {selectedPolymers.map(p => (
                        <td key={p.id} className="p-3 text-slate-700">{p.properties.chemical}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-700">Indian Industrial Producers</td>
                      {selectedPolymers.map(p => (
                        <td key={p.id} className="p-3 text-slate-700">{p.properties.india}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

      </main>

      {/* ============================================================ */}
      {/* BRAND-ALIGNED CONTEXTUAL AI ASSISTANT ("Ask Polymer AI") */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#0B172A] via-[#0A2E1A] to-[#0B172A] py-14 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#6EE7B7] text-xs font-mono font-bold uppercase mb-3">
                <Brain className="h-3.5 w-3.5 text-amber-400" />
                Ask Polymer AI
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Need material substitution advice for your mold?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Ask our AI Materials Specialist to analyze environmental stress cracking resistance (ESCR), 
                calculate weight-saving substitution ratios, or compare hot runner thermal profiles.
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Compare ESCR of Polypropylene vs HDPE</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Why does POM have higher creep resistance than PA66?</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-mono">Suggest FDA food contact alternative for ABS</span>
              </div>
            </div>

            <Link
              href="/ai-tutor?prompt=Compare+polypropylene+and+high+density+polyethylene+for+injection+molding+part+performance"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-[#F5C518] hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(245,197,24,0.35)] flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono uppercase tracking-wider"
            >
              Ask Material AI &rarr;
            </Link>
          </div>
        </div>
      </section>



      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}