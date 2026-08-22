'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Brain } from 'lucide-react';

const ERAS = [
  {
    id: 'foundation',
    year: '1860s-1900',
    title: 'The Foundation of Polymer Science',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', // vintage laboratory/factory
    events: [
      { year: '1839', text: 'Charles Goodyear discovers vulcanization — adding sulfur to natural rubber to form polyisoprene crosslinks, solving temperature sensitivity.' },
      { year: '1856', text: 'Alexander Parkes creates Parkesine (nitrocellulose modified with solvents), the first semi-synthetic man-made plastic.' },
      { year: '1869', text: 'John Wesley Hyatt combines cellulose nitrate with camphor to invent Celluloid — the first successful commercial thermoplastic.' },
      { year: '1872', text: 'John Wesley Hyatt patents the first primitive plunger injection molding machine.' },
      { year: '1872', text: 'German chemist Eugen Baumann accidentally synthesizes polyvinyl chloride (PVC) as a white powder.' },
    ],
    summary: 'The birth of plastics arose from the quest to replace scarce natural materials like ivory and tortoiseshell. By modifying natural polymers (cellulose and rubber), early innovators proved that materials could be artificially processed, laying the foundation for modern manufacturing.',
    engineering_insight: 'Vulcanization introduced the concept of chemical crosslinking, converting linear polymer chains into a three-dimensional elastomeric network. Celluloid demonstrated plasticization, showing that rigid polymers could be made processable using chemical additives like camphor.',
  },
  {
    id: 'bakelite',
    year: '1900-1929',
    title: 'Early Synthetics & The Birth of Bakelite',
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80', // vintage electronics/bakelite
    events: [
      { year: '1907', text: 'Leo Hendrik Baekeland patents Bakelite — the first fully synthetic thermosetting resin made from phenol and formaldehyde.' },
      { year: '1910', text: 'General Bakelite Company begins industrial manufacturing of electrical insulators and housings.' },
      { year: '1920', text: 'Hermann Staudinger publishes his pioneering theory that polymers are long-chain macromolecules, not simple aggregates.' },
      { year: '1926', text: 'Eckert & Ziegler patent the first modern hydraulic-powered injection molding machine.' },
      { year: '1929', text: 'Siemens orders Bakelite moulding powder at scale for the iconic Type 29 telephone casing.' },
    ],
    summary: 'Leo Baekeland proved that materials could be synthesized entirely from scratch rather than modifying natural feedstocks. Controlling the condensation reaction of phenol and formaldehyde unlocked a durable, heat-resistant, non-conductive thermoset that powered the electrical era.',
    engineering_insight: 'Bakelite is a phenolic thermosetting resin. Heating initiates an irreversible condensation polymerization that forms a highly crosslinked network, making the cured material infusible and insoluble. Staudinger\'s macromolecular theory later provided the scientific framework for these structures.',
  },
  {
    id: 'industry',
    year: '1930s',
    title: 'Plastics as an Industry',
    image: 'https://images.unsplash.com/photo-1581093458791-9d58e74010a8?w=1200&q=80', // industrial chemistry laboratory
    events: [
      { year: '1933', text: 'Eric Fawcett and Reginald Gibson at ICI accidentally discover polyethylene (LDPE) under extreme high pressure.' },
      { year: '1933', text: 'John Crawford at ICI develops a commercial synthesis route for poly(methyl methacrylate) (Perspex/acrylic).' },
      { year: '1935', text: 'Wallace Carothers and his team at DuPont synthesize Nylon 6,6 — the first fully synthetic polyamide fiber.' },
      { year: '1937', text: 'BASF begins the first commercial production of polystyrene (PS).' },
      { year: '1938', text: 'Roy Plunkett at DuPont accidentally discovers polytetrafluoroethylene (PTFE/Teflon) inside a gas cylinder.' },
    ],
    summary: 'The 1930s witnessed the discovery and commercialization of the foundational thermoplastics that dominate production today. From high-pressure polyolefins to synthetic fibers and transparent acrylics, the polymer industry emerged as a distinct discipline.',
    engineering_insight: 'Wallace Carothers\' synthesis of Nylon was a landmark achievement in step-growth (condensation) polymerization, establishing clear relationships between monomer stoichiometry and molecular weight. Concurrently, high-pressure free-radical polymerization enabled chain-growth processing of ethylene.',
  },
  {
    id: 'war',
    year: '1940s',
    title: 'Plastics in War & Strategic Production',
    image: 'https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=1200&q=80', // historical aviation/military
    events: [
      { year: '1940', text: 'First commercial PVC production starts in the UK, immediately diverted for military cable insulation.' },
      { year: '1942', text: 'Harry Coover at Eastman Kodak discovers cyanoacrylates (Super Glue) while researching transparent gun sights.' },
      { year: '1943', text: 'PTFE is deployed as a critical sealant for corrosive uranium hexafluoride in the Manhattan Project.' },
      { year: '1945', text: 'Polyethylene production increases by orders of magnitude to insulate airborne radar cabling.' },
      { year: '1948', text: 'ABS (acrylonitrile-butadiene-styrene) is patented, blending stiffness, toughness, and chemical resistance.' },
    ],
    summary: 'World War II forced plastics into strategic military service. Polyethylene insulated radar cables, Perspex replaced glass in aircraft cockpits, and nylon replaced silk in parachutes. The U.S. plastics industry tripled its capacity during the war, transforming from novelty products to heavy industrial manufacturing.',
    engineering_insight: 'The war years forced engineers to optimize mechanical properties under extreme conditions. Perspex (PMMA) offered a lightweight, shatterproof alternative to inorganic glass, while PTFE (Teflon) demonstrated unprecedented chemical inertness and temperature resistance due to the strength of the carbon-fluorine bond.',
  },
  {
    id: 'golden-age',
    year: '1950s-1960s',
    title: 'The Ziegler-Natta Catalyst & Polyolefin Boom',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80', // manufacturing pipeline/extrusion
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
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200&q=80', // environmental waste/plastics recycling
    events: [
      { year: '1970', text: 'The first Earth Day is celebrated; growing awareness of non-degradable municipal solid waste leads to environmental debates.' },
      { year: '1974', text: 'DuPont commercializes Kevlar (poly-paraphenylene terephthalamide), an ultra-high-strength aramid fiber.' },
      { year: '1980', text: 'Walter Kaminsky and Walter Sinn discover metallocene catalysts, allowing precise molecular weight distributions.' },
      { year: '1988', text: 'The Society of the Plastics Industry introduces the Resin Identification Code (RIC) system to sort plastics.' },
    ],
    summary: 'While advanced polymers like Kevlar and metallocene-catalyzed polyolefins expanded engineering frontiers, this era also saw the birth of public environmental awareness. As plastic consumption surged, the industry turned its focus toward recycling, collection, and resource efficiency.',
    engineering_insight: 'Kevlar achieves its high tensile strength due to the alignment of rigid aromatic rings and inter-chain hydrogen bonding. Metallocene catalysts introduced single-site polymerization, enabling narrow molecular weight distributions and highly uniform copolymer compositions.',
  },
  {
    id: 'advanced',
    year: '1990s-2000s',
    title: 'Precision Polymers & Functional Systems',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&q=80', // advanced lab nanotechnology
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
    image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1200&q=80', // ocean plastics/enzymatic recycling
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
    image: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=1200&q=80', // futuristic biotech/nanotech network
    events: [
      { year: '2030s', text: 'Commercialization of self-healing polymers that seal micro-cracks under ambient conditions, preventing structural failure.' },
      { year: '2030s', text: 'Depolymerizable-by-design plastics replace standard multi-layer packaging films to ensure 100% recyclability.' },
      { year: '2040s', text: 'Highly radiation-resistant polymer nanocomposites enable long-duration space structures and lightweight shielding.' },
    ],
    summary: 'The next era of polymer science belongs to you. Future engineers will design materials with built-in end-of-life pathways, self-healing matrices, bio-integrated medical devices, and advanced composites designed to withstand space travel and extreme environments.',
    engineering_insight: 'Designing for circularity requires synthesizing polymers with reversible covalent bonds (vitrimers) or dynamic networks. These materials exhibit thermoplastic processability while maintaining the performance of thermosets, enabling easy reuse and structural longevity.',
  },
];

export default function HistoryPage() {
  const [active, setActive] = useState(4); // default: Ziegler-Natta/Boom era
  const era = ERAS[active];
  const fillPct = (active / (ERAS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="h-2 bg-[#1D4ED8]" />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="border-b-4 border-slate-900 bg-slate-900 px-6 md:px-12 py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[10px] font-black text-yellow-400 border-2 border-yellow-400 px-3 py-1 uppercase tracking-widest">
              Past · Present · Future
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black text-white leading-none mb-4 uppercase">
            162 Years of a<br />
            <span className="text-yellow-400 italic">Material That</span><br />
            Remade Civilization
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
            Drag through the timeline. This is the story you are stepping into as a polymer engineer — and the part you could write next.
          </p>
        </div>
      </section>

      {/* ── TIMELINE CONTROLLER ──────────────────────────── */}
      <section className="border-b-4 border-slate-900 px-6 md:px-12 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between mb-2">
            <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">1860s — FOUNDATION</span>
            <span className="font-mono text-[9px] font-bold text-emerald-600 uppercase tracking-widest">TODAY — CIRCULAR</span>
            <span className="font-mono text-[9px] font-bold text-purple-600 uppercase tracking-widest">2030s+ — FUTURE</span>
          </div>

          {/* Slider track */}
          <div className="relative h-2 bg-slate-100 border-2 border-slate-900 mb-6">
            <div
              className="absolute top-0 left-0 h-full bg-[#1D4ED8] transition-all duration-300"
              style={{ width: `${fillPct}%` }}
            />
            {ERAS.map((e, i) => {
              const isActive = i === active;
              const pos = (i / (ERAS.length - 1)) * 100;
              return (
                <button
                  key={e.id}
                  onClick={() => setActive(i)}
                  className={`absolute -top-3 w-7 h-7 border-4 border-slate-900 transition-all rounded-full flex items-center justify-center ${
                    isActive ? 'bg-[#1D4ED8] scale-110' : 'bg-white hover:bg-slate-100'
                  }`}
                  style={{
                    left: `${pos}%`,
                    transform: 'translateX(-50%)',
                    boxShadow: isActive ? '2px 2px 0px 0px rgba(0,0,0,1)' : '1px 1px 0px 0px rgba(0,0,0,1)',
                  }}
                  title={e.title}
                />
              );
            })}
          </div>

          {/* Prev/Next buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActive(Math.max(0, active - 1))}
              disabled={active === 0}
              className="border-4 border-slate-900 w-10 h-10 flex items-center justify-center bg-white text-slate-900 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Decade pill tags */}
            <div className="flex gap-1.5 overflow-x-auto py-1 px-2 max-w-[60%] sm:max-w-none scrollbar-none">
              {ERAS.map((eraItem, i) => (
                <button
                  key={eraItem.id}
                  onClick={() => setActive(i)}
                  className={`font-mono text-[9px] font-black border-2 border-slate-900 px-2 py-1 rounded transition-colors flex-shrink-0 ${
                    i === active ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {eraItem.year}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActive(Math.min(ERAS.length - 1, active + 1))}
              disabled={active === ERAS.length - 1}
              className="border-4 border-slate-900 w-10 h-10 flex items-center justify-center bg-white text-slate-900 disabled:opacity-30 hover:bg-slate-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT DISPLAY ─────────────────────────── */}
      <section className="px-6 md:px-12 py-10 max-w-5xl mx-auto">
        <div className="border-4 border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300">
          {/* Image banner */}
          <div className="relative w-full h-72 border-b-4 border-slate-900 bg-slate-900">
            <Image
              src={era.image}
              alt={era.title}
              fill
              priority
              className="object-cover opacity-85 transition-opacity duration-300"
              sizes="(max-w-1024px) 100vw, 1024px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="font-mono text-[9px] font-black text-yellow-400 bg-slate-900/60 border border-yellow-400/40 px-2 py-0.5 rounded uppercase tracking-wider">
                {era.year}
              </span>
              <h2 className="font-display text-2xl md:text-3.5xl font-black mt-2 text-white leading-tight uppercase">
                {era.title}
              </h2>
            </div>
          </div>

          {/* Description & Insight */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <h3 className="font-mono text-[10px] font-black uppercase text-slate-400 tracking-wider">Historical Context</h3>
              <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                {era.summary}
              </p>
            </div>

            {/* Engineering insight note */}
            <div className="border-l-4 border-[#1D4ED8] bg-blue-50/50 p-4 rounded-r-lg">
              <h4 className="font-mono text-[9px] font-black text-[#1D4ED8] uppercase tracking-wider mb-1">
                ⚙️ Polymer Engineering Insight
              </h4>
              <p className="text-slate-700 text-xs md:text-sm leading-relaxed font-medium">
                {era.engineering_insight}
              </p>
            </div>

            {/* Milestones list */}
            <div className="border-t-2 border-slate-100 pt-6">
              <h3 className="font-mono text-[10px] font-black uppercase text-slate-400 tracking-wider mb-4">
                🔑 Key Milestones &amp; Patents
              </h3>
              <ul className="space-y-3.5">
                {era.events.map((event, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="font-mono text-[11px] font-black px-2 py-1 bg-slate-100 border border-slate-300 rounded text-slate-900 leading-none">
                      {event.year}
                    </span>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                      {event.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── BE PART OF IT CTA ────────────────────────────── */}
      <section className="border-t-4 border-slate-900 px-6 md:px-12 py-14 bg-slate-950 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl font-black uppercase text-white mb-4">
            How to Be <span className="text-yellow-400 italic">Part of It</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-10">
            The next chapters — vitrimers, self-healing composite matrices, enzyme-driven circular loops — will be written by engineers starting exactly where you are today.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
            {[
              { title: 'Learn the Fundamentals', desc: 'Master polymer chemistry and processing basics.', href: '/subjects' },
              { title: 'Explore Real Materials', desc: 'See CAMPUS-style grades driving manufacturing.', href: '/materials' },
              { title: 'Ask AI Tutor', desc: 'Get RAG-grounded answers based on 216 lessons.', href: '/ai-tutor' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="border-4 p-5 rounded-xl border-slate-700 bg-slate-900/45 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:border-white flex flex-col justify-between"
                style={{ textDecoration: 'none' }}
              >
                <div>
                  <h3 className="font-display text-base font-black text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.desc}</p>
                </div>
                <span className="font-mono text-[9px] font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>

          <Link href="/login" className="px-6 py-3.5 bg-yellow-400 text-slate-900 font-display font-black text-sm uppercase rounded-xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-350 transition-all inline-flex items-center gap-2">
            Start Your Journey Free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* AI Tutor RAG Quick CTA */}
      <section className="border-t-4 border-slate-900 px-6 md:px-12 py-10 text-white" style={{ backgroundColor: '#581C87' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-mono text-[9px] font-bold text-purple-300 uppercase tracking-widest mb-1.5">
              AI Tutor · Gemini RAG
            </div>
            <h3 className="font-display text-xl md:text-2.5xl font-black uppercase">
              Curious how Ziegler-Natta chemistry works?
            </h3>
            <p className="text-purple-100 text-xs md:text-sm mt-1 max-w-2xl">
              Ask PolymerHub AI — it is fully grounded in your 216 lessons and can explain the chemical mechanism behind every historical era.
            </p>
          </div>
          <Link href="/ai-tutor" className="px-5 py-2.5 bg-white text-purple-900 font-bold text-xs uppercase rounded-lg border-2 border-purple-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 transition-all flex items-center gap-1.5 flex-shrink-0">
            <Brain className="w-4 h-4" /> Ask AI Tutor
          </Link>
        </div>
      </section>
    </div>
  );
}
