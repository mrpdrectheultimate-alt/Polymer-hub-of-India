'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Layers } from 'lucide-react'

export interface SubjectItem {
  name: string
  icon: string
  color: string
  lessons: number
  slug: string
  category: string
  description: string
}

export const SUBJECTS_DATA: SubjectItem[] = [
  { name: 'Polymer Chemistry', icon: '🧪', color: '#4F8FFF', lessons: 12, slug: 'polymer-chemistry', category: 'Core Science', description: 'Step-growth, chain-growth, copolymerization kinetics, Ziegler-Natta & metallocene catalysts.' },
  { name: 'Polymer Processing', icon: '⚙️', color: '#7C3AED', lessons: 15, slug: 'polymer-processing', category: 'Manufacturing', description: 'Single/twin screw extrusion, injection moulding cycles, blow moulding & thermoforming.' },
  { name: 'Mould Design', icon: '🔧', color: '#10B981', lessons: 10, slug: 'mould-design', category: 'Tooling', description: '2-plate, 3-plate, hot runner tooling, runner sizing, cooling channels & shrinkage.' },
  { name: 'Polymer Testing', icon: '📊', color: '#FF7722', lessons: 8, slug: 'polymer-testing', category: 'Characterization', description: 'ASTM D638 tensile, D256 Izod, D1238 MFI, DSC, TGA & HDT thermal analysis.' },
  { name: 'Rubber Technology', icon: '⚡', color: '#EC4899', lessons: 6, slug: 'rubber-technology', category: 'Elastomers', description: 'Natural rubber, SBR, EPDM, sulfur vulcanization, carbon black reinforcement & Mooney viscosity.' },
  { name: 'Sustainable Plastics', icon: '♻️', color: '#10B981', lessons: 9, slug: 'sustainable-plastics', category: 'Sustainability', description: 'PLA, PHA, bio-PET, enzyme degradation, EPR legislation & closed-loop circularity.' },
  { name: 'Medical Plastics', icon: '🏥', lessons: 7, slug: 'medical-plastics', color: '#06B6D4', category: 'High Performance', description: 'USP Class VI, ISO 10993, EtO/gamma sterilization, catheter tubing & implant grade PEEK.' },
  { name: 'Plastic Packaging', icon: '📦', lessons: 16, slug: 'plastic-packaging', color: '#F59E0B', category: 'Industrial', description: 'Multilayer blown film, EVOH barrier coatings, pouch sealing & shelf-life calculation.' },
  { name: 'Additives & Compounding', icon: '🧬', color: '#8B5CF6', lessons: 11, slug: 'additives-and-compounding', category: 'Formulation', description: 'Plasticizers, halogen-free flame retardants, UV stabilizers & masterbatch twin-screw mixing.' },
  { name: 'Composites & Blends', icon: '🧪', color: '#3B82F6', lessons: 8, slug: 'polymer-composites', category: 'Advanced', description: 'Glass/carbon fiber reinforcement, Rule of Mixtures, interfacial adhesion & autoclaving.' },
  { name: 'Rheology & Flow', icon: '🌊', color: '#06B6D4', lessons: 5, slug: 'polymer-rheology', category: 'Physics', description: 'Non-Newtonian shear thinning, Power Law, Carreau-Yasuda, die swell & Weissenberg effect.' },
  { name: 'Polymer Nanotechnology', icon: '🔬', color: '#EC4899', lessons: 6, slug: 'polymer-nanotechnology', category: 'Advanced', description: 'Nanoclay exfoliation, CNT electrical percolation & barrier tortuosity path enhancement.' },
  { name: 'Bioprocessing & Fermentation', icon: '🧫', color: '#10B981', lessons: 4, slug: 'bioprocessing-and-fermentation', category: 'Bio-Engineering', description: 'Bacterial PHA synthesis, sugar cane ethanol to bio-ethylene & enzymatic bioreactors.' },
  { name: 'Robotics & Automation', icon: '🤖', color: '#6366F1', lessons: 8, slug: 'robotics-in-manufacturing', category: 'Industry 4.0', description: 'EOAT sprue pickers, 6-axis articulated demoulding, vision defect sorting & cobots.' },
  { name: 'Digital Twins & AI', icon: '💻', color: '#3B82F6', lessons: 5, slug: 'digital-twins-in-plastics', category: 'Industry 4.0', description: 'Moldflow FEA, cavity sensor telemetry, neural network warpage prediction & physics simulation.' },
  { name: 'Color Science & Masterbatch', icon: '🎨', color: '#F43F5E', lessons: 4, slug: 'color-science', category: 'Formulation', description: 'CIE L*a*b* spectrophotometry, Delta E tolerances, metamerism & pigment dispersion.' },
  { name: 'Life Cycle Assessment (LCA)', icon: '🌍', color: '#10B981', lessons: 6, slug: 'life-cycle-assessment', category: 'Sustainability', description: 'ISO 14040 cradle-to-grave GHG modeling, carbon footprint & PCR vs virgin polymer audits.' },
  { name: 'Entrepreneurship in Plastics', icon: '💼', color: '#F59E0B', lessons: 5, slug: 'entrepreneurship-in-plastics', category: 'Business', description: 'MSME machinery capex, raw material working capital, BIS certification & export schemes.' },
  { name: 'Recycling Technology', icon: '♻️', color: '#10B981', lessons: 7, slug: 'recycling-technology', category: 'Circularity', description: 'Mechanical optical sorting, hot-wash flake decontamination, chemical solvolysis & pyrolysis.' },
]

export function FloatingSubjects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {SUBJECTS_DATA.map((subject, index) => {
        const isHovered = hoveredIndex === index
        return (
          <div
            key={subject.slug}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative"
          >
            <motion.div
              animate={{
                y: isHovered ? -6 : 0,
                scale: isHovered ? 1.015 : 1,
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className={`
                h-full rounded-2xl p-5 flex flex-col justify-between
                bg-slate-900/60 backdrop-blur-xl border
                ${isHovered ? 'border-white/30 shadow-[0_12px_32px_rgba(0,0,0,0.35)]' : 'border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.15)]'}
                transition-all duration-300
              `}
            >
              {/* Card Ambient Radial Glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none blur-2xl opacity-30"
                style={{ background: subject.color }}
              />

              <div>
                {/* Header: Icon & Category Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/10"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    {subject.icon}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10">
                    {subject.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-bold text-white tracking-tight leading-snug mb-1.5">
                  {subject.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-2">
                  {subject.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  {subject.lessons} lessons
                </span>
                <Link
                  href={`/subjects/${subject.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider group"
                >
                  Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
