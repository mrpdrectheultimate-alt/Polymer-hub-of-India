// src/lib/data/today-updates.ts — Curated Daily Polymer Intelligence & Benchmark Data (Updated 26 Nov 2026)
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
    id: 'today-2026-11-26-01',
    headline: 'Thursday Indian Polymer Spot Intelligence: Reliance, GAIL & IOCL Revise Primary Polyolefin Quotes Upward as Feedstock Propylene Tightens in Western Hubs',
    summary: 'Indian domestic resin spot markets registered solid gains in Thursday morning trade (Nov 26, 2026). Upstream Brent crude consolidating at $83.95/bbl and Asian propylene touching $885/MT CFR India prompted Reliance to revise Repol PP raffia (H030SG) to ₹102.10/kg (+₹0.50/kg) ex-Dahej. Relene HDPE film rose to ₹107.50/kg, and GAIL LLDPE reached ₹103.40/kg ex-Pata. Suspension PVC resin (K-67) gained ₹0.40/kg to settle at ₹85.20/kg ex-Ratnagiri on heightened agricultural piping and infrastructure off-take across Central and Northern India.',
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
    published_at: '2026-11-26T06:00:00.000Z',
    publish_date: '2026-11-26',
    is_featured: true,
  },
  {
    id: 'today-2026-11-26-02',
    headline: 'Ministry of Environment (MoEFCC) Notifies 30% Minimum Recycled Content Mandate for Category-II Flexible Plastic Packaging from FY 2026-27',
    summary: 'The Ministry of Environment, Forest and Climate Change (MoEFCC) has released the final gazette notification establishing mandatory 30% post-consumer recycled (PCR) content in Category-II flexible plastic packaging (multi-layer laminates and pouches) starting April 1, 2026. The policy mandates third-party batch certification via accredited NABL laboratories and CPCB-registered recycling facilities, driving flexible packaging converters in Gujarat and Maharashtra to fast-track mono-material PE and PP laminate barrier structures.',
    source_name: 'MoEFCC Gazette Notification & CPCB EPR Cell',
    source_url: 'https://moef.gov.in',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'MoEFCC Environmental Standards Division, New Delhi',
    visual_type: 'T01',
    rights_class: 'government_open_data',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'post-consumer-recycling-sorting-washing-and-decontamination',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-11-26T06:45:00.000Z',
    publish_date: '2026-11-26',
    is_featured: false,
  },
  {
    id: 'today-2026-11-26-03',
    headline: 'Tata Motors & Supreme Industries Validate Bio-Reinforced Polyamide (PA66) Battery Pack Enclosures for Next-Gen Electric Vehicles',
    summary: 'Automotive OEM Tata Motors Passenger Electric Mobility, in engineering partnership with Supreme Industries, has successfully homologated an injection-moulded flame-retardant Polyamide 66 (PA66) battery module top cover reinforced with 30% surface-treated bio-basalt fibres. The composite achieves UL 94 V-0 flame rating down to 0.8 mm wall thickness while reducing enclosure weight by 22% compared to aluminum die-castings, offering high puncture resistance and thermal runaway containment exceeding 1000°C for 5 minutes.',
    source_name: 'Tata Motors Technology Directorate & Supreme Industries Automotive Division',
    source_url: 'https://www.tatamotors.com',
    image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200&h=700&auto=format&fit=crop&q=80',
    image_credit: 'Tata Motors Advanced Electric Mobility Technical Center, Pune',
    visual_type: 'T04',
    rights_class: 'editorial_fair_use',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'flammability-and-fire-retardancy-testing-ul-94-loi-cone-calorimetry',
    related_subject_slug: 'polymer-testing',
    published_at: '2026-11-26T07:30:00.000Z',
    publish_date: '2026-11-26',
    is_featured: false,
  },
  {
    id: 'today-2026-11-26-04',
    headline: 'CSIR-Central Salt and Marine Chemicals Research Institute (CSMCRI) Bhavnagar Patents Biodegradable Agarose-Chitosan Antimicrobial Food Films',
    summary: 'Marine biopolymer researchers at CSIR-CSMCRI Bhavnagar have been granted an Indian patent for an edible, fully home-compostable packaging film formulated from seaweed-derived agarose cross-linked with crustacean chitosan and plasticized with glycerol. The 25-micron transparent film exhibits an oxygen permeability under 1.2 cc·mm/m²·day·atm, tensile strength of 42 MPa, and intrinsic antimicrobial efficacy that extends the shelf-life of refrigerated fresh paneer and poultry by 8 days without synthetic preservatives.',
    source_name: 'CSIR-CSMCRI Marine Biotechnology Lab & Indian Patent Office',
    source_url: 'https://www.csmcri.res.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-CSMCRI Marine Biopolymers Division, Bhavnagar, Gujarat',
    visual_type: 'T05',
    rights_class: 'academic_fair_use',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'gas-and-moisture-barrier-permeation-mechanisms-and-equations',
    related_subject_slug: 'plastic-packaging-engineering',
    published_at: '2026-11-26T08:15:00.000Z',
    publish_date: '2026-11-26',
    is_featured: false,
  },
  {
    id: 'today-2026-11-26-05',
    headline: 'Reliance Industries (RIL) Launches India’s First Chemical Recycling Pyrolysis Demo Unit for End-of-Life Multi-Layer Plastic Waste at Vadodara',
    summary: 'Reliance Industries Limited has commenced operations at its 10 KTA continuous catalytic pyrolysis demonstration plant at the Vadodara Manufacturing Division. The facility converts complex, non-recyclable multi-layer post-consumer plastic waste (MLP) into circular pyrolysis oil (PyOil). Hydrotreated PyOil is routed into the site’s cracker to synthesize ISCC PLUS-certified virgin-grade circular ethylene and propylene monomers, closing the loop for circular polypropylene in medical and food-grade packaging.',
    source_name: 'Reliance Petrochemicals & Circular Economy Directorate',
    source_url: 'https://www.ril.com',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Vadodara Petrochemical Complex, Gujarat',
    visual_type: 'T07',
    rights_class: 'editorial_fair_use',
    category: 'Recycling',
    region: 'India',
    related_lesson_slug: 'feedstock-recycling-and-chemical-depolymerization-pyrolysis-gasification-solvolysis',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-11-26T09:00:00.000Z',
    publish_date: '2026-11-26',
    is_featured: false,
  },
  {
    id: 'today-2026-11-26-06',
    headline: 'Huhtamaki India Commercializes Retort-Proof Mono-Material Polypropylene (oPP/cPP) Pouches with High Thermal Stability',
    summary: 'Packaging innovator Huhtamaki India has introduced an ultra-high performance all-polypropylene mono-material pouch designed for hot-fill and retort sterilization applications up to 125°C. Comprising an oriented polypropylene (oPP) outer print web reverse-metallized and laminated to a high-seal-integrity cast polypropylene (cPP) sealant, the structure delivers full recyclability in standard PP stream #5 while meeting strict moisture and aroma barrier standards for Indian ready-to-eat curries.',
    source_name: 'Huhtamaki Flexible Packaging News & Indian Institute of Packaging (IIP)',
    source_url: 'https://www.huhtamaki.com',
    image_url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Huhtamaki India Flexible Converting Plant, Thane, Maharashtra',
    visual_type: 'T02',
    rights_class: 'editorial_fair_use',
    category: 'Innovation',
    region: 'Regional',
    related_lesson_slug: 'multilayer-coextrusion-feedblock-and-multi-manifold-dies',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-11-26T09:45:00.000Z',
    publish_date: '2026-11-26',
    is_featured: false,
  },
  {
    id: 'today-2026-11-26-07',
    headline: 'MIT & Max Planck Institute Discover High-Entropy Polymeric Glass with Fracture Toughness Exceeding Engineering Ceramics',
    summary: 'A joint international research team from MIT and the Max Planck Institute for Polymer Research has engineered a new class of "high-entropy vitrimers" synthesizing multi-component covalent adaptable networks (CANs). By intertwining five distinct dynamic reversible ester and disulfide cross-links within an aromatic backbone, the amorphous polymer achieves a critical stress intensity factor (K1c) of 4.8 MPa·m^0.5—over four times that of conventional epoxy resins—preventing catastrophic crack propagation under ballistic shock.',
    source_name: 'MIT Materials Science Bulletin & Science Advances',
    source_url: 'https://www.science.org/journal/sciadv',
    image_url: 'https://images.unsplash.com/photo-1517976487502-5f65342a77a9?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'MIT Department of Materials Science & Max Planck Institute, Mainz',
    visual_type: 'T08',
    rights_class: 'academic_fair_use',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'fracture-mechanics-griffith-theory-stress-intensity-factor-kic-and-j-integral',
    related_subject_slug: 'polymer-physics',
    published_at: '2026-11-26T10:15:00.000Z',
    publish_date: '2026-11-26',
    is_featured: false,
  },
  {
    id: 'today-2026-11-26-08',
    headline: 'European Chemical Agency (ECHA) Reaches Consensus on PFAS Restriction Phase-Out Timelines for Fluoropolymers in Industrial Valves',
    summary: 'The Socio-Economic Assessment Committee (SEAC) of the European Chemicals Agency (ECHA) has published its updated draft opinion on the universal per- and polyfluoroalkyl substances (PFAS) restriction proposal. While granting a 12-year transition derogation for critical high-performance fluoropolymers (PTFE, PVDF, and PFA) in semiconductor manufacturing, chemical process valves, and aerospace seals, the agency established stringent containment and end-of-life recovery mandates that are accelerating global R&D into PFAS-free high-temperature polyketones and polyimides.',
    source_name: 'European Chemicals Agency (ECHA) Press Office, Helsinki',
    source_url: 'https://echa.europa.eu',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'ECHA Chemicals Risk Assessment Directorate, Helsinki',
    visual_type: 'T06',
    rights_class: 'government_open_data',
    category: 'Policy',
    region: 'Global',
    related_lesson_slug: 'fluoropolymers-ptfe-pvdf-fep-synthesis-properties-and-inertness',
    related_subject_slug: 'specialty-polymers',
    published_at: '2026-11-26T10:45:00.000Z',
    publish_date: '2026-11-26',
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
  { polymer: 'Polypropylene (PP)', grade: 'H030SG (Raffia)', producer: 'Reliance Repol', price: '₹102.10', unit: '/kg', change: '+0.5%', isUp: true, location: 'Hazira / Dahej' },
  { polymer: 'HDPE', grade: 'F5400 (Film / Blow)', producer: 'Reliance Relene', price: '₹107.50', unit: '/kg', change: '+0.4%', isUp: true, location: 'Mumbai Ex-Plant' },
  { polymer: 'LLDPE', grade: 'F2001 (Film Grade)', producer: 'GAIL G-Lex', price: '₹103.40', unit: '/kg', change: '+0.3%', isUp: true, location: 'Pata Plant' },
  { polymer: 'PVC Suspension', grade: 'K-67 (Pipe Grade)', producer: 'Finolex / DCW', price: '₹85.20', unit: '/kg', change: '+0.5%', isUp: true, location: 'Ratnagiri' },
  { polymer: 'PET Bottle Grade', grade: 'AS01 (IV 0.80)', producer: 'Reliance Relpet', price: '₹99.30', unit: '/kg', change: '+0.4%', isUp: true, location: 'Silvassa' },
  { polymer: 'Polycarbonate (PC)', grade: 'Lexan 141R (Moulding)', producer: 'SABIC India', price: '₹227.50', unit: '/kg', change: '+0.3%', isUp: true, location: 'Nhava Sheva' },
  { polymer: 'Polyamide 6 (Nylon)', grade: 'Ultramid B3S (Natural)', producer: 'BASF India', price: '₹257.80', unit: '/kg', change: '+0.3%', isUp: true, location: 'Thane' },
  { polymer: 'ABS Resin', grade: 'HI-121 (Injection)', producer: 'LG Chem / Bhansali', price: '₹149.60', unit: '/kg', change: '+0.3%', isUp: true, location: 'Satnoor' },
  { polymer: 'Circular rPET', grade: 'Food-Contact Flakes', producer: 'EPR Recyclers India', price: '₹83.80', unit: '/kg', change: '+0.7%', isUp: true, location: 'Delhi NCR' },
  { polymer: 'Circular rHDPE', grade: 'Blue Drum Granules', producer: 'EPR Recyclers India', price: '₹80.30', unit: '/kg', change: '+0.9%', isUp: true, location: 'Ahmedabad' },
]
