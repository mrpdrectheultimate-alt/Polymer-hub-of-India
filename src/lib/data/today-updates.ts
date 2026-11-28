// src/lib/data/today-updates.ts — Curated Daily Polymer Intelligence & Benchmark Data (Updated 28 Nov 2026)
export interface CuratedNewsItem {
  id: string
  headline: string
  summary: string
  source_name: string
  source_url: string | null
  image_url: string | null
  image_credit: string | null
  visual_type?: string | null
  rights_class?: string | null
  category: string
  region: 'India' | 'Global' | 'Regional'
  related_lesson_slug: string | null
  related_subject_slug: string | null
  published_at: string
  publish_date: string
  is_featured: boolean
}

export const TODAY_CURATED_UPDATES: CuratedNewsItem[] = [
  {
    id: 'today-2026-11-28-01',
    headline: 'Saturday Indian Polymer Spot Intelligence: Weekend Domestic Polyolefin Benchmarks Hold Strong Amid Rising Naphtha and Upstream Gulf Energy Tightness',
    summary: 'Indian domestic polymer spot benchmarks consolidated at monthly highs on Saturday, November 28, 2026. Upstream Brent crude holding firm at $84.35/bbl alongside CFR West Coast India naphtha crossing $715/MT sustained primary polyolefin offers across Hazira, Dahej, and Jamnagar distribution centers. Reliance Repol PP raffia (H030SG) was assessed at ₹102.70/kg ex-Dahej, while Relene HDPE film closed at ₹108.10/kg ex-Hazira. GAIL G-Lex LLDPE held steady at ₹104.00/kg ex-Pata, and Finolex suspension PVC (K-67) maintained ₹85.80/kg ex-Ratnagiri supported by steady agricultural pipe demand across Maharashtra and Gujarat.',
    source_name: 'S&P Global Platts Petrochemical Alert & Indian Petrochem Circulars',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Platts Global Petrochemical Intelligence & Energy Trading Desk',
    visual_type: 'T03',
    rights_class: 'editorial_fair_use',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-11-28T06:00:00.000Z',
    publish_date: '2026-11-28',
    is_featured: true,
  },
  {
    id: 'today-2026-11-28-02',
    headline: 'IIT Delhi & CIPET Ahmedabad Develop High-Thermal-Conductivity Boron Nitride Filled Polyimide Films for EV Battery Packs',
    summary: 'Researchers at IIT Delhi\'s Centre for Polymer Science and Engineering in partnership with CIPET: IPT Ahmedabad have synthesized surface-functionalized hexagonal boron nitride (h-BN) polyimide nanocomposite dielectric films. Exhibiting through-plane thermal conductivity of 3.8 W/m·K (a 16-fold increase over unfilled polyimide) and breakdown voltage exceeding 280 kV/mm, the flexible insulating films prevent thermal runaway propagation in high-density electric vehicle (EV) cylindrical battery modules.',
    source_name: 'ACS Applied Polymer Materials & IIT Delhi Research Directorate',
    source_url: 'https://pubs.acs.org/journal/aapmcd',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CIPET: IPT Advanced Polymer Design Lab, Ahmedabad',
    visual_type: 'T05',
    rights_class: 'academic_fair_use',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'thermal-and-oxidative-degradation-chain-scission-and-stabilizers',
    related_subject_slug: 'specialty-polymers',
    published_at: '2026-11-28T06:45:00.000Z',
    publish_date: '2026-11-28',
    is_featured: false,
  },
  {
    id: 'today-2026-11-28-03',
    headline: 'Indian Oil Corporation Limited (IOCL) Paradip Petrochemical Complex Commissions New 650 KTA Polypropylene Unit',
    summary: 'IOCL has achieved first on-spec polymer production from its newly expanded 650,000 MT/year dual-reactor polypropylene plant at Paradip Refinery in Odisha. Utilizing LyondellBasell Spheripol generation-6 technology, the facility is formulated to manufacture high-melt-flow homopolymer and heterophasic impact copolymers specifically for India\'s booming automotive injection molding and non-woven hygiene spunbond fabric markets.',
    source_name: 'IOCL Petrochemicals Directorate & Ministry of Petroleum and Natural Gas',
    source_url: 'https://www.iocl.com',
    image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200&h=700&auto=format&fit=crop&q=80',
    image_credit: 'IOCL Integrated Petrochemical Complex, Paradip, Odisha',
    visual_type: 'T04',
    rights_class: 'editorial_fair_use',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'co-polymerization-random-block-graft-and-crosslinked-architectures',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-11-28T07:30:00.000Z',
    publish_date: '2026-11-28',
    is_featured: false,
  },
  {
    id: 'today-2026-11-28-04',
    headline: 'CSIR-NCL Pune Engineers Enzymatically Depolymerizable Bio-Polyester Blends for Zero-Waste Fast-Food Containers',
    summary: 'Biochemical and polymer scientists at CSIR-National Chemical Laboratory (NCL) Pune have formulated a novel poly(butylene succinate-co-adipate) (PBSA) composite incorporated with immobilized bacterial esterase nanocapsules. The packaging remains hydrolytically stable during hot food storage (up to 95°C) but activates accelerated bulk depolymerization within 45 days in ambient municipal compost, degrading into benign succinic acid and water without leaving microplastic fragments.',
    source_name: 'CSIR-NCL Polymer Science & Engineering Division',
    source_url: 'https://www.ncl-india.org',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-NCL Green Polymer Synthesis Pilot Plant, Pune',
    visual_type: 'T07',
    rights_class: 'academic_fair_use',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'bio-based-polymers-pla-pha-bio-pe-synthesis-and-properties',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-11-28T08:15:00.000Z',
    publish_date: '2026-11-28',
    is_featured: false,
  },
  {
    id: 'today-2026-11-28-05',
    headline: 'Banyan Nation and Unilever India Expand Mechanical Recycling Network to 50,000 MT/Year Circular HDPE Supply',
    summary: 'Circular plastics pioneer Banyan Nation has finalized an agreement with FMCG leader Hindustan Unilever to scale closed-loop post-consumer recycled HDPE (PCR-HDPE) washing, thermo-mechanical decontamination, and deodorization across southern manufacturing corridors. The high-purity recycled granules pass rigorous stress-crack resistance (ESCR) and zero-odor migration criteria for 50% PCR personal care bottles, aligning with India\'s mandatory Plastic Waste Management Rules EPR targets.',
    source_name: 'Banyan Nation Circular Materials Press Release & HUL Sustainability Cell',
    source_url: 'https://www.banyannation.com',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Banyan Nation Automated Polymer Recycling & Deodorization Facility, Hyderabad',
    visual_type: 'T01',
    rights_class: 'editorial_fair_use',
    category: 'Recycling',
    region: 'India',
    related_lesson_slug: 'post-consumer-recycling-sorting-washing-and-decontamination',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-11-28T09:00:00.000Z',
    publish_date: '2026-11-28',
    is_featured: false,
  },
  {
    id: 'today-2026-11-28-06',
    headline: 'CPCB Issues Compliance Guidance on Mandatory Recycled Content Verification via Central EPR Portal for FY 2026-27',
    summary: 'The Central Pollution Control Board (CPCB) has published comprehensive implementation guidelines governing third-party certification of recycled plastic content in flexible and rigid packaging. Brand owners and plastic waste processors must register all batch testing certificates from NABL-accredited laboratories using differential scanning calorimetry (DSC) and carbon-14 isotope tracking to claim legitimate EPR offset credits on the national portal.',
    source_name: 'Central Pollution Control Board (CPCB) EPR Division, New Delhi',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CPCB Environmental Quality Directorate, Parivesh Bhawan, New Delhi',
    visual_type: 'T02',
    rights_class: 'government_open_data',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'post-consumer-recycling-sorting-washing-and-decontamination',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-11-28T09:45:00.000Z',
    publish_date: '2026-11-28',
    is_featured: false,
  },
  {
    id: 'today-2026-11-28-07',
    headline: 'MIT & Max Planck Institute Synthesize Self-Healing Vitrimeric Polyurethanes with Fast Dynamic Transcarbamoylation',
    summary: 'Polymer physicists at MIT and the Max Planck Institute for Polymer Research have synthesized crosslinked polyurethane vitrimers using organocatalyzed dynamic transcarbamoylation without heavy-metal catalysts. Scratched coatings recover 100% tensile strength and optical clarity within 120 seconds under mild heating (80°C) through associative bond-exchange reactions, eliminating creep while maintaining high solvent and chemical resistance for aerospace coatings.',
    source_name: 'Science Advances & MIT Materials Science Lab',
    source_url: 'https://www.science.org/journal/sciadv',
    image_url: 'https://images.unsplash.com/photo-1517976487502-5f65342a77a9?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'MIT Department of Materials Science and Engineering, Cambridge, MA',
    visual_type: 'T08',
    rights_class: 'academic_fair_use',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'crosslinking-vulcanization-and-gelation-theory',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-11-28T10:15:00.000Z',
    publish_date: '2026-11-28',
    is_featured: false,
  },
  {
    id: 'today-2026-11-28-08',
    headline: 'European Commission Formalizes Microplastics REACH Restriction Timelines for Synthetic Infill and Cosmetics',
    summary: 'The European Chemicals Agency (ECHA) and European Commission have issued final enforcement timelines for Annex XVII microplastic restrictions under REACH regulation. Polymeric infill materials for synthetic sports pitches face an 8-year transition period ending in 2031, while leave-on microplastic bead formulations in cosmetics must transition to bio-based and biodegradable crosslinked celluloses by late 2027.',
    source_name: 'European Chemicals Agency (ECHA) Official Directorate, Helsinki',
    source_url: 'https://echa.europa.eu',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'European Chemicals Agency (ECHA) Regulatory Directorate, Helsinki',
    visual_type: 'T06',
    rights_class: 'government_open_data',
    category: 'Policy',
    region: 'Global',
    related_lesson_slug: 'life-cycle-assessment-lca-cradle-to-grave-methodology-for-polymers',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-11-28T10:45:00.000Z',
    publish_date: '2026-11-28',
    is_featured: false,
  },
]

export interface PolymerPriceIndex {
  polymer: string
  grade: string
  producer: string
  price: string
  unit: string
  change: string
  isUp: boolean
  location: string
}

export const INDIAN_POLYMER_PRICES: PolymerPriceIndex[] = [
  { polymer: 'Polypropylene (PP)', grade: 'H030SG (Raffia)', producer: 'Reliance Repol', price: '₹102.70', unit: '/kg', change: '+0.2%', isUp: true, location: 'Hazira / Dahej' },
  { polymer: 'HDPE', grade: 'F5400 (Film / Blow)', producer: 'Reliance Relene', price: '₹108.10', unit: '/kg', change: '+0.2%', isUp: true, location: 'Mumbai Ex-Plant' },
  { polymer: 'LLDPE', grade: 'F2001 (Film Grade)', producer: 'GAIL G-Lex', price: '₹104.00', unit: '/kg', change: '+0.2%', isUp: true, location: 'Pata Plant' },
  { polymer: 'PVC Suspension', grade: 'K-67 (Pipe Grade)', producer: 'Finolex / DCW', price: '₹85.80', unit: '/kg', change: '+0.2%', isUp: true, location: 'Ratnagiri' },
  { polymer: 'PET Bottle Grade', grade: 'AS01 (IV 0.80)', producer: 'Reliance Relpet', price: '₹99.90', unit: '/kg', change: '+0.2%', isUp: true, location: 'Silvassa' },
  { polymer: 'Polycarbonate (PC)', grade: 'Lexan 141R (Moulding)', producer: 'SABIC India', price: '₹228.40', unit: '/kg', change: '+0.1%', isUp: true, location: 'Nhava Sheva' },
  { polymer: 'Polyamide 6 (Nylon)', grade: 'Ultramid B3S (Natural)', producer: 'BASF India', price: '₹258.80', unit: '/kg', change: '+0.2%', isUp: true, location: 'Thane' },
  { polymer: 'ABS Resin', grade: 'HI-121 (Injection)', producer: 'LG Chem / Bhansali', price: '₹150.40', unit: '/kg', change: '+0.2%', isUp: true, location: 'Satnoor' },
  { polymer: 'Circular rPET', grade: 'Food-Contact Flakes', producer: 'EPR Recyclers India', price: '₹84.80', unit: '/kg', change: '+0.5%', isUp: true, location: 'Delhi NCR' },
  { polymer: 'Circular rHDPE', grade: 'Blue Drum Granules', producer: 'EPR Recyclers India', price: '₹81.30', unit: '/kg', change: '+0.5%', isUp: true, location: 'Ahmedabad' },
]
