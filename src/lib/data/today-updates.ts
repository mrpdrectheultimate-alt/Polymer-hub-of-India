// src/lib/data/today-updates.ts — Curated Daily Polymer Intelligence & Benchmark Data (Updated 23 Nov 2026)
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
    id: 'today-2026-11-23-01',
    headline: 'Monday Indian Petrochemical Price Intelligence: Reliance, GAIL & IOCL Revise Weekly Polymer Spot Quotes Upward by ₹400–600/MT',
    summary: 'Opening the final full trading week of November 2026, Indian primary polymer producers announced modest upward spot adjustments of ₹400 to ₹600 per metric tonne across polyolefin grades, supported by firmer Asian CFR naphtha and monomer benchmarks. Reliance Repol PP raffia (H030SG) inched up to ₹100.80/kg ex-works Dahej/Hazira (+₹0.40/kg), while Relene HDPE film grade (F5400) settled at ₹106.20/kg ex-plant Mumbai (+₹0.40/kg). GAIL G-Lex LLDPE was quoted firm at ₹102.30/kg ex-Pata, and Finolex PVC K-67 rigid pipe grade consolidated at ₹83.90/kg ex-Ratnagiri (+₹0.40/kg). Converters across Ahmedabad, Daman, and Bhiwandi report robust baseline demand driven by agricultural pipe and FMCG packaging consumption.',
    source_name: 'S&P Global Commodity Insights & Platts Petrochemical Report',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Platts Global Petrochemical Intelligence & Energy Trading Desk',
    visual_type: 'T03',
    rights_class: 'editorial_fair_use',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'carbon-footprint-polymer-production',
    related_subject_slug: 'life-cycle-assessment',
    published_at: '2026-11-23T06:00:00.000Z',
    publish_date: '2026-11-23',
    is_featured: true,
  },
  {
    id: 'today-2026-11-23-02',
    headline: 'Ministry of Environment & CPCB Finalize Phase-III EPR Digital Portal Framework Mandating 30% Recycled Content in Rigid Packaging',
    summary: 'The Ministry of Environment, Forest and Climate Change (MoEFCC) together with the Central Pollution Control Board (CPCB) has rolled out the Phase-III audit portal for Extended Producer Responsibility (EPR). Effective from the current fiscal cycle, Brand Owners (BOs) and Plastic Waste Processors (PWPs) must submit blockchain-verified mass-balance certificates demonstrating a minimum 30% post-consumer recycled (PCR) resin incorporation in Category-I rigid containers. The digital platform integrates GST e-invoicing and GPS-tagged dispatch verification to eliminate duplicate paper credits across all state pollution boards.',
    source_name: 'Central Pollution Control Board (CPCB) & Ministry of Environment Gazette',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CPCB Waste Management Division, Manak Bhawan, New Delhi',
    visual_type: 'T01',
    rights_class: 'government_open_data',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'packaging-design-for-sustainability-mono-materials-and-recyclable-structures',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-11-23T06:30:00.000Z',
    publish_date: '2026-11-23',
    is_featured: false,
  },
  {
    id: 'today-2026-11-23-03',
    headline: 'Indian Oil Corporation (IOCL) Successfully Commissions 200 KTA High-Purity 1-Butene Comonomer Plant at Panipat Refinery Complex',
    summary: 'Indian Oil Corporation Limited (IOCL) has announced the successful on-stream commercial operation of its 200 kilo-tonnes per annum (KTA) high-purity 1-butene unit within the Panipat Naphtha Cracker Complex in Haryana. Utilizing Axens AlphaButol ethylene dimerization technology, the captive 1-butene stream replaces imported co-monomer feeds in IOCL’s downstream Swing LLDPE/HDPE polymerization loops, yielding higher puncture resistance, narrower molecular weight distribution, and reduced dart drop failure in heavy-duty shipping sacks and stretch packaging films.',
    source_name: 'IOCL Corporate Technical Dispatch & MoPNG',
    source_url: 'https://iocl.com',
    image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200&h=700&auto=format&fit=crop&q=80',
    image_credit: 'IOCL Petrochemical Complex, Panipat, Haryana',
    visual_type: 'T04',
    rights_class: 'editorial_fair_use',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-11-23T07:15:00.000Z',
    publish_date: '2026-11-23',
    is_featured: false,
  },
  {
    id: 'today-2026-11-23-04',
    headline: 'CIPET Chennai & DRDO Validate Carbon-Fiber Reinforced Polyetheretherketone (PEEK) Brackets for Light Combat Aircraft Applications',
    summary: 'Research metallurgists and composite engineers at CIPET: Institute of Plastics Technology (IPT) Chennai in joint technical trials with the Defence Research and Development Organisation (DRDO) have validated continuous carbon-fiber reinforced polyetheretherketone (CF/PEEK) structural brackets for avionics enclosures. Utilizing high-temperature automated compression moulding at 390°C followed by controlled cooling crystallization, the thermoplastic composite achieves an ultimate flexural strength of 820 MPa and continuous service temperature tolerance up to 260°C, delivering a 42% weight reduction over aerospace-grade titanium alloy Ti-6Al-4V while providing intrinsic UL94 V-0 flame retardancy.',
    source_name: 'Plastics Engineering Journal & DRDO Advanced Composites Division',
    source_url: 'https://www.drdo.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Advanced Tooling Centre & Composite Testing Laboratory, Chennai',
    visual_type: 'T05',
    rights_class: 'academic_fair_use',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'rule-of-mixtures-and-short-fiber-reinforcement',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-11-23T08:00:00.000Z',
    publish_date: '2026-11-23',
    is_featured: false,
  },
  {
    id: 'today-2026-11-23-05',
    headline: 'IIT Delhi Center for Sustainable Polymer Technologies Synthesizes High-Impact Polyhydroxyalkanoate (PHA)/PBAT Blends for Agricultural Mulch Films',
    summary: 'Chemical engineers at the Center for Sustainable Polymer Technologies at IIT Delhi, in technical collaboration with industrial compounding partners, have formulated high-performance soil-biodegradable agricultural mulch films combining Polyhydroxybutyrate-co-valerate (PHBV) with Polybutylene adipate terephthalate (PBAT). By employing a maleic anhydride-grafted compatibilizer and micro-talc nucleating agents, the 15-micron extruded blown film achieves 450% elongation at break and complete field degradation within 180 days under tropical soil microbial activity (ISO 17556 standard), eliminating hazardous microplastic accumulation in agricultural soil.',
    source_name: 'Chemical Weekly & IIT Delhi Research Highlights',
    source_url: 'https://home.iitd.ac.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'IIT Delhi Sustainable Polymer Research Laboratories, New Delhi',
    visual_type: 'T07',
    rights_class: 'academic_citation',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'bio-based-polymers-pla-pha-bio-pe-synthesis-and-properties',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-11-23T08:45:00.000Z',
    publish_date: '2026-11-23',
    is_featured: false,
  },
  {
    id: 'today-2026-11-23-06',
    headline: 'Tata Motors & Motherson Group Commercialize MuCell Microcellular Foam Injection Moulding for Next-Gen Electric Vehicle Door Modules',
    summary: 'Automotive tooling engineers at Tata Motors Passenger Vehicles and Motherson Group have commercialized Trexel MuCell supercritical nitrogen (N2) microcellular foam injection moulding across door inner carriers and instrument panel structural beams for upcoming electric SUVs. By injecting supercritical gas into molten 20% talc-filled polypropylene copolymer (PP-CP), the process creates closed-cell micro-voids (10–25 micron diameter) throughout the core section, slashing finished component weight by 14.5%, reducing sink marks over structural ribs, and cutting injection moulding clamp tonnage requirements by 22%.',
    source_name: 'Automotive Component Manufacturers Association (ACMA) Dispatch',
    source_url: 'https://www.motherson.com',
    image_url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Motherson Advanced Automotive Tooling & Moulding Center, Pune',
    visual_type: 'T02',
    rights_class: 'editorial_fair_use',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-phases-and-optimization',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-11-23T09:30:00.000Z',
    publish_date: '2026-11-23',
    is_featured: false,
  },
  {
    id: 'today-2026-11-23-07',
    headline: 'CSIR-National Chemical Laboratory (NCL) Pune & Reliance Industries Commission Continuous Catalytic Pyrolysis Pilot for Mixed Polyolefin Waste',
    summary: 'Scientists at CSIR-NCL Pune and Reliance Industries Petrochemicals R&D have commissioned an automated 5-tonne-per-day continuous catalytic pyrolysis pilot reactor at Vadodara, Gujarat. Operating with proprietary hierarchical ZSM-5 zeolite catalysts, the plant converts contaminated post-consumer municipal polyolefin waste (LDPE, HDPE, and PP) into high-yield circular pyrolysis oil (CPO) with a paraffinic content exceeding 72%. The purified oil is fed directly into steam crackers as alternative circular feedstock to synthesize virgin-grade circular ethylene and propylene with ISCC Plus certification.',
    source_name: 'CSIR-NCL Technical Bulletins & Chemical & Engineering News',
    source_url: 'https://www.ncl-india.org',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-NCL Catalysis & Polymer Chemical Engineering Division, Pune',
    visual_type: 'T06',
    rights_class: 'academic_citation',
    category: 'Recycling',
    region: 'India',
    related_lesson_slug: 'carbon-footprint-polymer-production',
    related_subject_slug: 'life-cycle-assessment',
    published_at: '2026-11-23T10:15:00.000Z',
    publish_date: '2026-11-23',
    is_featured: false,
  },
  {
    id: 'today-2026-11-23-08',
    headline: 'Rubber Research Institute of India (RRII) & Apollo Tyres Formulate Epoxidized Natural Rubber (ENR) for Ultra-Low Rolling Resistance Commercial Treads',
    summary: 'The Rubber Research Institute of India (RRII), Kottayam, in joint industrial validation with Apollo Tyres R&D, has formulated high-performance commercial truck-bus radial (TBR) tread vulcanizates utilizing 25 mol% epoxidized natural rubber (ENR-25) coupled with precipitated silica nanofillers. Dynamic mechanical thermal analysis (DMTA) demonstrates a 24% reduction in tangent delta at 60°C, correlating with significantly reduced rolling resistance and greenhouse gas emissions, while maintaining superior wet braking skid resistance on wet monsoon highways compared to standard solution-SBR compounds.',
    source_name: 'Rubber News Asia & Apollo Tyres Advanced Mobility Division',
    source_url: 'https://www.apollotyres.com',
    image_url: 'https://images.unsplash.com/photo-1517976487502-5f65342a77a9?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Apollo Tyres Global R&D Centre, Chennai, Tamil Nadu',
    visual_type: 'T08',
    rights_class: 'academic_fair_use',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'vulcanization-of-rubber-chemistry-systems-and-industrial-practice',
    related_subject_slug: 'rubber-technology',
    published_at: '2026-11-23T11:00:00.000Z',
    publish_date: '2026-11-23',
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
  { polymer: 'Polypropylene (PP)', grade: 'H030SG (Raffia)', producer: 'Reliance Repol', price: '₹100.80', unit: '/kg', change: '+0.4%', isUp: true, location: 'Hazira / Dahej' },
  { polymer: 'HDPE', grade: 'F5400 (Film / Blow)', producer: 'Reliance Relene', price: '₹106.20', unit: '/kg', change: '+0.4%', isUp: true, location: 'Mumbai Ex-Plant' },
  { polymer: 'LLDPE', grade: 'F2001 (Film Grade)', producer: 'GAIL G-Lex', price: '₹102.30', unit: '/kg', change: '+0.4%', isUp: true, location: 'Pata Plant' },
  { polymer: 'PVC Suspension', grade: 'K-67 (Pipe Grade)', producer: 'Finolex / DCW', price: '₹83.90', unit: '/kg', change: '+0.5%', isUp: true, location: 'Ratnagiri' },
  { polymer: 'PET Bottle Grade', grade: 'AS01 (IV 0.80)', producer: 'Reliance Relpet', price: '₹97.90', unit: '/kg', change: '+0.5%', isUp: true, location: 'Silvassa' },
  { polymer: 'Polycarbonate (PC)', grade: 'Lexan 141R (Moulding)', producer: 'SABIC India', price: '₹225.80', unit: '/kg', change: '+0.2%', isUp: true, location: 'Nhava Sheva' },
  { polymer: 'Polyamide 6 (Nylon)', grade: 'Ultramid B3S (Natural)', producer: 'BASF India', price: '₹255.90', unit: '/kg', change: '+0.2%', isUp: true, location: 'Thane' },
  { polymer: 'ABS Resin', grade: 'HI-121 (Injection)', producer: 'LG Chem / Bhansali', price: '₹148.20', unit: '/kg', change: '+0.3%', isUp: true, location: 'Satnoor' },
  { polymer: 'Circular rPET', grade: 'Food-Contact Flakes', producer: 'EPR Recyclers India', price: '₹82.10', unit: '/kg', change: '+0.6%', isUp: true, location: 'Delhi NCR' },
  { polymer: 'Circular rHDPE', grade: 'Blue Drum Granules', producer: 'EPR Recyclers India', price: '₹78.60', unit: '/kg', change: '+0.5%', isUp: true, location: 'Ahmedabad' },
]
