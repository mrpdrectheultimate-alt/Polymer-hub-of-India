'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight, Brain, Sparkles, Clock, BookOpen, Layers } from 'lucide-react'

interface MilestoneEvent {
  year: string
  text: string
}

interface Era {
  id: string
  year: string
  title: string
  icon: string
  image: string
  events: MilestoneEvent[]
  summary: string
  engineering_insight: string
}

const ERAS: Era[] = [
  {
    id: 'foundation',
    year: '1860s-1900',
    title: 'The Foundation of Polymer Science',
    icon: '🧪',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    events: [
      { year: '1839', text: 'Charles Goodyear discovers vulcanization — adding sulfur to natural rubber to form polyisoprene crosslinks, eliminating temperature sensitivity.' },
      { year: '1856', text: 'Alexander Parkes creates Parkesine (nitrocellulose modified with solvents), the first semi-synthetic man-made plastic.' },
      { year: '1869', text: 'John Wesley Hyatt combines cellulose nitrate with camphor to invent Celluloid — the first successful commercial thermoplastic.' },
      { year: '1872', text: 'John Wesley Hyatt patents the first primitive plunger injection molding machine.' },
      { year: '1872', text: 'German chemist Eugen Baumann accidentally synthesizes polyvinyl chloride (PVC) as a white powder.' },
    ],
    summary: 'The birth of plastics arose from the quest to replace scarce natural materials like ivory and tortoiseshell. By modifying natural polymers (cellulose and rubber), early innovators proved that materials could be artificially processed, laying the foundation for modern industrial manufacturing.',
    engineering_insight: 'Vulcanization introduced the concept of chemical crosslinking, converting linear polymer chains into a three-dimensional elastomeric network. Celluloid demonstrated plasticization, proving that rigid polymers could be made processable using chemical additives like camphor.',
  },
  {
    id: 'bakelite',
    year: '1900-1929',
    title: 'Early Synthetics & The Birth of Bakelite',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80',
    events: [
      { year: '1907', text: 'Leo Hendrik Baekeland patents Bakelite — the first fully synthetic thermosetting resin made from phenol and formaldehyde.' },
      { year: '1910', text: 'General Bakelite Company begins industrial manufacturing of electrical insulators and housings.' },
      { year: '1920', text: 'Hermann Staudinger publishes his pioneering theory that polymers are long-chain macromolecules, not simple physical aggregates.' },
      { year: '1926', text: 'Eckert & Ziegler patent the first modern hydraulic-powered injection molding machine.' },
      { year: '1929', text: 'Siemens orders Bakelite moulding powder at scale for the iconic Type 29 telephone casing.' },
    ],
    summary: 'Leo Baekeland proved that materials could be synthesized entirely from scratch rather than modifying natural feedstocks. Controlling the condensation reaction of phenol and formaldehyde unlocked a durable, heat-resistant, non-conductive thermoset that powered the global electrical era.',
    engineering_insight: 'Bakelite is a phenolic thermosetting resin. Heating initiates an irreversible condensation polymerization that forms a highly crosslinked network, making the cured material infusible and insoluble. Staudinger\'s macromolecular theory provided the scientific foundation for modern polymer physics.',
  },
  {
    id: 'industry',
    year: '1930s',
    title: 'Plastics as an Industrial Commodity',
    icon: '🏭',
    image: 'https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=1200&q=80',
    events: [
      { year: '1933', text: 'Eric Fawcett and Reginald Gibson at ICI accidentally discover polyethylene (LDPE) under extreme high pressure.' },
      { year: '1933', text: 'John Crawford at ICI develops a commercial synthesis route for poly(methyl methacrylate) (Perspex/acrylic).' },
      { year: '1935', text: 'Wallace Carothers and his team at DuPont synthesize Nylon 6,6 — the first fully synthetic polyamide fiber.' },
      { year: '1937', text: 'BASF begins the first commercial production of polystyrene (PS).' },
      { year: '1938', text: 'Roy Plunkett at DuPont accidentally discovers polytetrafluoroethylene (PTFE/Teflon) inside a gas cylinder.' },
    ],
    summary: 'The 1930s witnessed the discovery and commercialization of the foundational thermoplastics that dominate global production today. From high-pressure polyolefins to synthetic fibers and transparent acrylics, the polymer industry emerged as a distinct engineering discipline.',
    engineering_insight: 'Wallace Carothers\' synthesis of Nylon was a landmark achievement in step-growth (condensation) polymerization, establishing fundamental relationships between monomer stoichiometry and molecular weight (Carothers Equation).',
  },
  {
    id: 'war',
    year: '1940s',
    title: 'Plastics in War & Strategic Production',
    icon: '🛡️',
    image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=1200&q=80',
    events: [
      { year: '1940', text: 'First commercial PVC production starts in the UK, immediately diverted for military radar cable insulation.' },
      { year: '1942', text: 'Harry Coover at Eastman Kodak discovers cyanoacrylates (Super Glue) while researching transparent gun sights.' },
      { year: '1943', text: 'PTFE is deployed as a critical sealant for corrosive uranium hexafluoride in the Manhattan Project.' },
      { year: '1945', text: 'Polyethylene production increases by orders of magnitude to insulate airborne microwave radar cabling.' },
      { year: '1948', text: 'ABS (acrylonitrile-butadiene-styrene) is patented, blending stiffness, toughness, and chemical resistance.' },
    ],
    summary: 'World War II forced plastics into strategic military service. Polyethylene insulated radar cables, Perspex replaced glass in aircraft cockpits, and nylon replaced silk in parachutes. The plastics industry tripled its capacity during the war, transforming from novelty products into heavy industrial manufacturing.',
    engineering_insight: 'The war years forced engineers to optimize mechanical properties under extreme environments. Perspex (PMMA) offered a lightweight, shatterproof alternative to inorganic glass, while PTFE demonstrated unprecedented chemical inertness due to the extreme strength of the carbon-fluorine bond.',
  },
  {
    id: 'golden-age',
    year: '1950s-1960s',
    title: 'The Ziegler-Natta Catalyst & Polyolefin Boom',
    icon: '🔬',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80',
    events: [
      { year: '1953', text: 'Karl Ziegler discovers a catalyst system (titanium halides + organoaluminum compounds) to polymerize ethylene at low pressures.' },
      { year: '1954', text: 'Giulio Natta uses Ziegler\'s catalyst to polymerize propylene, creating stereoregular (isotactic) polypropylene.' },
      { year: '1959', text: 'Polycarbonate (PC) is commercialized independently by Bayer and General Electric for high-impact applications.' },
      { year: '1963', text: 'Karl Ziegler and Giulio Natta receive the Nobel Prize in Chemistry for stereospecific polymerization.' },
    ],
    summary: 'The catalytic revolution allowed chemists to control polymer microstructure. Low-pressure catalysis enabled high-density polyethylene (HDPE) and isotactic polypropylene, driving an explosion of cheap, durable, and highly crystalline consumer packaging and industrial components.',
    engineering_insight: 'Ziegler-Natta catalysts facilitate coordination polymerization. Unlike free-radical processes that yield branched polymers (LDPE), coordination catalysts produce highly linear chains (HDPE), promoting close chain packing, high crystallinity, superior tensile strength, and elevated melting temperatures.',
  },
  {
    id: 'awareness',
    year: '1970s-1980s',
    title: 'Expansion, High-Performance & Ecology',
    icon: '🌱',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=80',
    events: [
      { year: '1970', text: 'The first Earth Day is celebrated; growing awareness of non-degradable municipal solid waste leads to environmental debates.' },
      { year: '1974', text: 'DuPont commercializes Kevlar (poly-paraphenylene terephthalamide), an ultra-high-strength aramid fiber.' },
      { year: '1980', text: 'Walter Kaminsky and Walter Sinn discover metallocene catalysts, allowing precise molecular weight distributions.' },
      { year: '1988', text: 'The Society of the Plastics Industry introduces the Resin Identification Code (RIC) system (1-7) to sort plastics.' },
    ],
    summary: 'While advanced polymers like Kevlar and metallocene-catalyzed polyolefins expanded engineering frontiers, this era also saw the birth of public environmental awareness. As plastic consumption surged, the industry turned its focus toward recycling, collection, and resource efficiency.',
    engineering_insight: 'Kevlar achieves its extreme tensile strength due to the alignment of rigid aromatic rings and inter-chain hydrogen bonding. Metallocene catalysts introduced single-site polymerization, enabling narrow molecular weight distributions and highly uniform copolymer architectures.',
  },
  {
    id: 'advanced',
    year: '1990s-2000s',
    title: 'Precision Polymers & Functional Systems',
    icon: '⚙️',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&q=80',
    events: [
      { year: '1994', text: 'Krzysztof Matyjaszewski develops Atom Transfer Radical Polymerization (ATRP) for controlled radical polymerization.' },
      { year: '2000', text: 'Alan Heeger, Alan MacDiarmid, and Hideki Shirakawa win the Nobel Prize for discovering conductive polyacetylene.' },
      { year: '2002', text: 'NatureWorks opens the first large-scale commercial plant producing PLA (polylactic acid) bioplastic from corn.' },
    ],
    summary: 'Polymer science transitioned into functional systems. Conducting polymers challenged the definition of plastics as insulators, while new "living" radical polymerization techniques allowed engineers to build precise block copolymers and nanostructured materials.',
    engineering_insight: 'ATRP and other reversible deactivation radical polymerizations (RDRP) maintain a low concentration of active radicals, suppressing termination reactions. This allows chemists to build complex architectures like block copolymers, star polymers, and polymer brushes.',
  },
  {
    id: 'sustainability',
    year: '2010s-2020s',
    title: 'The Circular Economy & Bio-Catalysis',
    icon: '♻️',
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1200&q=80',
    events: [
      { year: '2016', text: 'Yoshikazu Yoshida and his team discover Ideonella sakaiensis, a bacterium expressing PETase to depolymerize PET.' },
      { year: '2019', text: 'The European Union passes the Single-Use Plastics Directive, mandating recycled content and collection targets.' },
      { year: '2022', text: 'India bans select single-use plastics and implements mandatory Extended Producer Responsibility (EPR) targets.' },
      { year: '2024', text: 'Engineered PETase enzymes achieve rapid, low-temperature depolymerization of post-consumer textiles.' },
    ],
    summary: 'Driven by microplastic accumulation and greenhouse emissions, polymer engineering entered a circular revolution. Research shifted toward chemical recycling, bio-based feedstocks (such as PLA and PHA), and enzyme-driven depolymerization to convert waste back into high-purity monomers.',
    engineering_insight: 'Enzymatic recycling uses hydrolases (like PETase) to target the ester bonds in polyethylene terephthalate. Unlike thermal pyrolysis, enzymatic degradation operates under mild temperatures (30-70°C) and is highly selective, producing pure monomers without affecting pigments or fillers.',
  },
  {
    id: 'future',
    year: '2030s+',
    title: 'The Future — Molecular Circularity & Smart Materials',
    icon: '🚀',
    image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=1200&q=80',
    events: [
      { year: '2030s', text: 'Commercialization of vitrimers and self-healing polymers that seal micro-cracks under ambient conditions, preventing structural failure.' },
      { year: '2030s', text: 'Depolymerizable-by-design plastics replace standard multi-layer packaging films to ensure 100% closed-loop recyclability.' },
      { year: '2040s', text: 'Highly radiation-resistant polymer nanocomposites enable long-duration space habitats and deep-space radiation shielding.' },
    ],
    summary: 'The next era of polymer science belongs to you. Future engineers will design materials with built-in end-of-life pathways, self-healing matrices, bio-integrated medical devices, and advanced composites designed to withstand space travel and extreme environments.',
    engineering_insight: 'Designing for circularity requires synthesizing polymers with reversible covalent bonds (vitrimers) or dynamic networks. These materials exhibit thermoplastic processability while maintaining the high mechanical performance of thermosets.',
  },
]

export default function HistoryPage() {
  const [active, setActive] = useState(4) // default: Ziegler-Natta era
  const era = ERAS[active]
  const fillPct = (active / (ERAS.length - 1)) * 100

  return (
    <div className="min-h-screen bg-[#FDF8F0] text-slate-900 pb-20">
      
      {/* ── Top Header Bar: Amber / Gold ── */}
      <div className="bg-[#8B6914] border-b-4 border-[#C9A84C]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#FDE68A] text-xs font-mono font-bold uppercase tracking-wider">162 Years of Innovation</span>
              <div className="flex flex-wrap gap-4 mt-1 text-white text-xs font-mono">
                <span>1862 <span className="text-[#FDE68A]">Parkesine</span></span>
                <span className="w-px h-3 bg-white/20" />
                <span>1907 <span className="text-[#FDE68A]">Bakelite</span></span>
                <span className="w-px h-3 bg-white/20" />
                <span>1935 <span className="text-[#FDE68A]">Nylon</span></span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#FDE68A] text-xs font-mono font-bold">9 Eras</p>
              <p className="text-white/60 text-[10px] font-mono">162 Years of Science</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Section: Amber Gradient ── */}
      <section className="bg-gradient-to-br from-[#8B6914] via-[#C9A84C] to-[#684C0B] text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-2">
            <Clock className="w-4 h-4 text-amber-200" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/90">
              162 Years of Polymer Science &middot; Past &middot; Present &middot; Future
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase font-serif">
            162 Years of a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#FFFFFF] to-[#FCD34D]">
              Material That Remade Civilization
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-amber-100 max-w-2xl mx-auto leading-relaxed font-light">
            Slide through the timeline. This is the industrial story you are stepping into as a polymer engineer &mdash; and the next chapters you will help design.
          </p>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">162</span>
              <span className="text-[10px] font-mono text-amber-200 uppercase tracking-wider">Years of Innovation</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-amber-200 block">9</span>
              <span className="text-[10px] font-mono text-amber-200 uppercase tracking-wider">Historic Eras</span>
            </div>
            <div className="bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-center">
              <span className="font-display text-xl font-bold text-white block">216</span>
              <span className="text-[10px] font-mono text-amber-200 uppercase tracking-wider">Lessons Connected</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive Timeline Controller ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="bg-white border-2 border-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-mono font-bold">
            <span className="text-slate-500 uppercase tracking-wider">1860s &mdash; Foundation</span>
            <span className="text-emerald-700 uppercase tracking-wider">Today &mdash; Circularity</span>
            <span className="text-purple-700 uppercase tracking-wider">2030s+ &mdash; Future</span>
          </div>

          {/* Slider track */}
          <div className="relative h-3 bg-slate-100 rounded-full border border-slate-300">
            <div
              className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${fillPct}%` }}
            />
            {ERAS.map((e, i) => {
              const isActive = i === active
              const pos = (i / (ERAS.length - 1)) * 100
              return (
                <button
                  key={e.id}
                  onClick={() => setActive(i)}
                  className={`absolute -top-2 w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center text-xs font-mono font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white border-slate-900 scale-125 shadow-md'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-slate-900'
                  }`}
                  style={{
                    left: `${pos}%`,
                    transform: 'translateX(-50%)',
                  }}
                  title={e.title}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setActive(Math.max(0, active - 1))}
              disabled={active === 0}
              className="px-3.5 py-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all font-mono text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            {/* Decade Pill Tags */}
            <div className="flex gap-1.5 overflow-x-auto py-1 px-2 scrollbar-none max-w-xl">
              {ERAS.map((eraItem, i) => (
                <button
                  key={eraItem.id}
                  onClick={() => setActive(i)}
                  className={`font-mono text-[11px] font-bold px-3 py-1.5 rounded-xl border-2 transition-all flex-shrink-0 ${
                    i === active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {eraItem.year}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActive(Math.min(ERAS.length - 1, active + 1))}
              disabled={active === ERAS.length - 1}
              className="px-3.5 py-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all font-mono text-xs font-bold flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* ── Main Era Dossier Display ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
          
          {/* Image Showcase Banner */}
          <div className="relative w-full h-80 sm:h-96 bg-slate-950 overflow-hidden border-b-2 border-slate-900">
            <Image
              src={era.image}
              alt={era.title}
              fill
              priority
              className="object-cover transition-opacity duration-500"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/30 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{era.icon}</span>
                <span className="font-mono text-xs font-bold text-amber-400 bg-black/40 backdrop-blur-md border border-amber-400/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
                  {era.year}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
                {era.title}
              </h2>
            </div>
          </div>

          {/* Dossier Content */}
          <div className="p-6 sm:p-10 space-y-8">
            
            {/* Historical Context */}
            <div className="space-y-2">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" /> Historical Context
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-medium">
                {era.summary}
              </p>
            </div>

            {/* Polymer Engineering Insight */}
            <div className="bg-blue-50/70 border-2 border-blue-200 p-5 rounded-2xl space-y-1.5">
              <h4 className="font-mono text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                ⚙️ Polymer Chemistry &amp; Engineering Insight
              </h4>
              <p className="text-slate-800 text-xs sm:text-sm leading-relaxed font-medium">
                {era.engineering_insight}
              </p>
            </div>

            {/* Key Milestones & Patents */}
            <div className="space-y-4 pt-2">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-600" /> Key Milestones &amp; Patents
              </h3>
              
              <div className="space-y-3">
                {era.events.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-slate-900 flex-shrink-0 mt-0.5">
                      {event.year}
                    </span>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                      {event.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── Be Part of It Section ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-[#0A1628] text-white rounded-3xl p-8 sm:p-12 border-2 border-slate-900 shadow-2xl text-center space-y-8">
          
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase">
              How to Be <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8A00] via-[#FFFFFF] to-[#16A34A]">Part of It</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-light">
              The next chapters &mdash; vitrimers, self-healing composite matrices, and enzymatic recycling loops &mdash; will be written by engineers starting right here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              { title: 'Learn Fundamentals', desc: 'Master polymer chemistry and processing basics.', href: '/subjects', label: '19 Subjects' },
              { title: 'Explore Materials', desc: 'Inspect CAMPUS-style property datasheets.', href: '/materials', label: '50 Resins' },
              { title: 'Ask AI Specialist', desc: 'Get RAG-grounded explanations of mechanisms.', href: '/ai-tutor', label: 'Gemini RAG' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="bg-slate-900/80 border-2 border-slate-700 hover:border-white p-5 rounded-2xl transition-all hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">{item.label}</span>
                  <h3 className="font-display text-base font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-mono font-bold text-white flex items-center gap-1">
                  Explore Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl border-2 border-slate-900 transition-all shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5"
            >
              Start Your Journey Free &rarr;
            </Link>
          </div>

        </div>
      </section>

      {/* ── AI Tutor RAG Quick CTA ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-gradient-to-r from-[#4A0E4E] via-[#2A0845] to-[#0A1628] text-white rounded-2xl p-6 sm:p-8 border-2 border-slate-900 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-mono text-[10px] font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" /> AI Tutor &middot; Gemini RAG
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              Curious how {era.title} chemistry works?
            </h3>
            <p className="text-purple-200 text-xs max-w-xl">
              Ask PolymerHub AI &mdash; it is grounded in your 216 lessons and can break down the exact coordination polymerization equations.
            </p>
          </div>
          <Link
            href={`/ai-tutor?prompt=${encodeURIComponent(`Explain the chemical mechanism and industrial significance of ${era.title} (${era.year})`)}`}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-purple-950 font-mono font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] flex-shrink-0"
          >
            <Brain className="w-4 h-4 text-purple-900" /> Ask AI Tutor &rarr;
          </Link>
        </div>
      </section>

    </div>
  )
}
