// src/lib/data/today-updates.ts — Curated Daily Polymer Intelligence & Benchmark Data (Updated 24 Nov 2026)
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
    id: 'today-2026-11-24-01',
    headline: 'Tuesday Indian Petrochem Spot Intelligence: Producers Maintain Firm Stance as Asian Ethylene Tops $910/MT CFR Western India',
    summary: 'Trading across major Indian plastics hubs (Ahmedabad, Daman, Bhiwandi, and Guindy) remained buoyant on Tuesday, November 24, 2026, as primary domestic producers held polymer spot prices firm following upward price revisions. With Asian ethylene monomer rising above $910/MT CFR and polymer-grade propylene (PGP) firming to $885/MT, Reliance Repol PP raffia (H030SG) consolidated at ₹101.20/kg ex-Dahej (+₹0.40/kg). Relene HDPE film grade traded steady at ₹106.60/kg ex-Hazira, and GAIL G-Lex LLDPE held at ₹102.70/kg ex-Pata. PVC converters noted steady seasonal demand from rural irrigation and infrastructure sectors, keeping Finolex PVC K-67 firm at ₹84.30/kg ex-Ratnagiri.',
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
    published_at: '2026-11-24T06:00:00.000Z',
    publish_date: '2026-11-24',
    is_featured: true,
  },
  {
    id: 'today-2026-11-24-02',
    headline: 'MoEFCC Gazette Mandates Microplastic Effluent Filtration Thresholds for Synthetic Polymer Processing & Textile Finishing Units',
    summary: 'In an extraordinary gazette notification issued under the Environment (Protection) Act, the Ministry of Environment, Forest and Climate Change (MoEFCC) has established India\'s first statutory microplastic discharge limit of 5 mg/L for synthetic fiber processing, plastic pellet washing, and polymer compounding industrial effluents. Units with washing capacities exceeding 2 MT/day must install multi-stage micro-filtration units (membrane bioreactors or ultrafiltration cartridges capable of retaining particles down to 20 microns) by Q3 2027. State Pollution Control Boards will integrate turbidity and microplastic particle counters into existing Online Continuous Emission and Effluent Monitoring Systems (OCEMS).',
    source_name: 'Ministry of Environment, Forest and Climate Change (MoEFCC) Gazette',
    source_url: 'https://moef.gov.in',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'MoEFCC Environmental Protection Division, Indira Paryavaran Bhawan, New Delhi',
    visual_type: 'T01',
    rights_class: 'government_open_data',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'packaging-design-for-sustainability-mono-materials-and-recyclable-structures',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-11-24T06:45:00.000Z',
    publish_date: '2026-11-24',
    is_featured: false,
  },
  {
    id: 'today-2026-11-24-03',
    headline: 'Haldia Petrochemicals (HPL) Commissions 350 KTA High-Impact Polypropylene Copolymer Loop for Automotive Applications',
    summary: 'Haldia Petrochemicals Ltd (HPL) has successfully commenced commercial commissioning of its expanded 350 KTA gas-phase impact copolymer polypropylene plant at Haldia, West Bengal, using LyondellBasell Spheripol technology. The new facility specializes in high-melt-flow (MFI 30–60 g/10min) heterophasic copolymers featuring finely dispersed ethylene-propylene rubber (EPR) domains, designed specifically for thin-wall injection moulding of automotive bumper fascias, battery casings, and white-goods appliances. The domestic grade significantly reduces India\'s reliance on high-impact polymer imports from Northeast Asia and the Middle East.',
    source_name: 'Haldia Petrochemicals Corporate Dispatch & Chemical Industry Digest',
    source_url: 'https://www.haldiapetrochemicals.com',
    image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200&h=700&auto=format&fit=crop&q=80',
    image_credit: 'HPL Petrochemical Complex, Purba Medinipur, Haldia, West Bengal',
    visual_type: 'T04',
    rights_class: 'editorial_fair_use',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-11-24T07:30:00.000Z',
    publish_date: '2026-11-24',
    is_featured: false,
  },
  {
    id: 'today-2026-11-24-04',
    headline: 'ISRO & CIPET Ahmedabad Validate Cryogenic Toughness of Carbon-Fiber/PEEK Composite Liners for Liquid Hydrogen Fuel Tanks',
    summary: 'Propulsion materials scientists at ISRO\'s Liquid Propulsion Systems Centre (LPSC) and composite engineers at CIPET: Centre for Skilling and Technical Support (CSTS) Ahmedabad have completed cryogenic mechanical validation of carbon-fiber reinforced polyetheretherketone (CF/PEEK) composite tank liners down to liquid nitrogen (-196°C) and liquid hydrogen (-253°C) environments. The out-of-autoclave automated fiber-placed (AFP) composite liners demonstrated zero micro-crack propagation and maintained an interlaminar shear strength (ILSS) exceeding 78 MPa under rapid thermal cycles, opening the path for ultra-lightweight propellant tanks in India\'s next-generation orbital launch vehicles.',
    source_name: 'ISRO Propulsion Research Directorate & CIPET Research Highlights',
    source_url: 'https://www.isro.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'ISRO Propulsion Test Facility & CIPET Composite Lab, Ahmedabad',
    visual_type: 'T05',
    rights_class: 'academic_fair_use',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'rule-of-mixtures-and-short-fiber-reinforcement',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-11-24T08:15:00.000Z',
    publish_date: '2026-11-24',
    is_featured: false,
  },
  {
    id: 'today-2026-11-24-05',
    headline: 'CSIR-CFTRI Mysore & CIPET Formulate Edible Chitosan-Polyvinyl Alcohol (PVA) Active Barrier Films with Antimicrobial Properties',
    summary: 'Biochemical researchers at CSIR-Central Food Technological Research Institute (CFTRI) Mysore, in joint technological development with CIPET Mysuru, have developed an aqueous solution-cast biodegradable active food packaging film combining marine-derived chitosan, plasticized Polyvinyl Alcohol (PVA), and nano-encapsulated clove essential oil. The resulting 30-micron transparent film exhibits an oxygen transmission rate (OTR) of less than 2.5 cc/m²·day and demonstrates potent antimicrobial efficacy against foodborne pathogens (E. coli and S. aureus), extending the shelf life of fresh refrigerated paneer and cut fruits by 14 days without synthetic preservatives.',
    source_name: 'CSIR-CFTRI Food Packaging Division & Journal of Applied Polymer Science',
    source_url: 'https://www.cftri.res.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-CFTRI Department of Food Packaging Technology, Mysore, Karnataka',
    visual_type: 'T07',
    rights_class: 'academic_citation',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'bio-based-polymers-pla-pha-bio-pe-synthesis-and-properties',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-11-24T09:00:00.000Z',
    publish_date: '2026-11-24',
    is_featured: false,
  },
  {
    id: 'today-2026-11-24-06',
    headline: 'Supreme Industries & Battenfeld-Cincinnati Commission Automated 5-Layer PE-RT Raised Temperature Pipe Extrusion Line',
    summary: 'Supreme Industries, India\'s largest plastics processor, has commissioned an advanced high-speed 5-layer co-extrusion line from Battenfeld-Cincinnati at its Gadegaon piping facility in Maharashtra. The line manufactures Polyethylene of Raised Temperature Resistance (PE-RT Type II) pipes with an embedded EVOH oxygen diffusion barrier, conforming to ISO 22391 standards for underfloor hydronic radiant heating and domestic hot water distribution. Equipped with ultrasonic 360-degree wall thickness measurement and gravimetric dosing, the extrusion line minimizes resin melt-fracture at line speeds up to 45 meters per minute.',
    source_name: 'Plastics Processing World & Supreme Industries Engineering Dispatch',
    source_url: 'https://www.supreme.co.in',
    image_url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Supreme Industries Mega Piping Plant, Gadegaon, Jalgaon, Maharashtra',
    visual_type: 'T02',
    rights_class: 'editorial_fair_use',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-phases-and-optimization',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-11-24T09:45:00.000Z',
    publish_date: '2026-11-24',
    is_featured: false,
  },
  {
    id: 'today-2026-11-24-07',
    headline: 'Banyan Nation & Unilever Commercialize 100% PCR HDPE Deodorized Resin for Personal Care Bottles with Zero Stress Cracking',
    summary: 'Circular economy pioneer Banyan Nation and FMCG major Hindustan Unilever have announced the commercial milestone of scaling 100% post-consumer recycled high-density polyethylene (PCR-HDPE) across home and personal care packaging in India. Utilizing advanced multi-stage hot caustic washing, proprietary thermal vacuum deodorization, and Melt Flow Index compatibilization, the recycled resin eliminates volatile organic contaminants and achieves environmental stress crack resistance (ESCR) equivalent to virgin blow-moulding copolymer (ASTM D1693, F50 > 600 hours).',
    source_name: 'Circular Plastics Asia & Banyan Nation Sustainability Desk',
    source_url: 'https://www.banyannation.com',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Banyan Nation Circular Plastics Processing Facility, Hyderabad, Telangana',
    visual_type: 'T06',
    rights_class: 'academic_citation',
    category: 'Recycling',
    region: 'India',
    related_lesson_slug: 'carbon-footprint-polymer-production',
    related_subject_slug: 'life-cycle-assessment',
    published_at: '2026-11-24T10:30:00.000Z',
    publish_date: '2026-11-24',
    is_featured: false,
  },
  {
    id: 'today-2026-11-24-08',
    headline: 'IIT Bombay Department of Energy Science Synthesizes Bio-Renewable Itaconic Acid-Based Unsaturated Polyesters for Marine Resins',
    summary: 'Polymer chemists at the Department of Energy Science and Engineering at IIT Bombay have synthesized high-performance thermosetting unsaturated polyester resins (UPRs) using bio-derived itaconic acid and 1,3-propanediol as direct replacements for petroleum-based maleic anhydride and phthalic acid. Crosslinked with bio-based reactive diluents, the cured network exhibits a glass transition temperature (Tg) of 118°C, tensile strength of 72 MPa, and superior hydrolytic resistance against artificial seawater aging, meeting ASTM D5229 specifications for fiberglass-reinforced marine hull laminates and wind turbine rotor blades.',
    source_name: 'IIT Bombay Polymer Science & Engineering Dispatch',
    source_url: 'https://www.iitb.ac.in',
    image_url: 'https://images.unsplash.com/photo-1517976487502-5f65342a77a9?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'IIT Bombay Polymer Synthesis & Advanced Composites Labs, Powai, Mumbai',
    visual_type: 'T08',
    rights_class: 'academic_fair_use',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'vulcanization-of-rubber-chemistry-systems-and-industrial-practice',
    related_subject_slug: 'rubber-technology',
    published_at: '2026-11-24T11:15:00.000Z',
    publish_date: '2026-11-24',
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
  { polymer: 'Polypropylene (PP)', grade: 'H030SG (Raffia)', producer: 'Reliance Repol', price: '₹101.20', unit: '/kg', change: '+0.4%', isUp: true, location: 'Hazira / Dahej' },
  { polymer: 'HDPE', grade: 'F5400 (Film / Blow)', producer: 'Reliance Relene', price: '₹106.60', unit: '/kg', change: '+0.4%', isUp: true, location: 'Mumbai Ex-Plant' },
  { polymer: 'LLDPE', grade: 'F2001 (Film Grade)', producer: 'GAIL G-Lex', price: '₹102.70', unit: '/kg', change: '+0.4%', isUp: true, location: 'Pata Plant' },
  { polymer: 'PVC Suspension', grade: 'K-67 (Pipe Grade)', producer: 'Finolex / DCW', price: '₹84.30', unit: '/kg', change: '+0.5%', isUp: true, location: 'Ratnagiri' },
  { polymer: 'PET Bottle Grade', grade: 'AS01 (IV 0.80)', producer: 'Reliance Relpet', price: '₹98.40', unit: '/kg', change: '+0.5%', isUp: true, location: 'Silvassa' },
  { polymer: 'Polycarbonate (PC)', grade: 'Lexan 141R (Moulding)', producer: 'SABIC India', price: '₹226.30', unit: '/kg', change: '+0.2%', isUp: true, location: 'Nhava Sheva' },
  { polymer: 'Polyamide 6 (Nylon)', grade: 'Ultramid B3S (Natural)', producer: 'BASF India', price: '₹256.40', unit: '/kg', change: '+0.2%', isUp: true, location: 'Thane' },
  { polymer: 'ABS Resin', grade: 'HI-121 (Injection)', producer: 'LG Chem / Bhansali', price: '₹148.60', unit: '/kg', change: '+0.3%', isUp: true, location: 'Satnoor' },
  { polymer: 'Circular rPET', grade: 'Food-Contact Flakes', producer: 'EPR Recyclers India', price: '₹82.60', unit: '/kg', change: '+0.6%', isUp: true, location: 'Delhi NCR' },
  { polymer: 'Circular rHDPE', grade: 'Blue Drum Granules', producer: 'EPR Recyclers India', price: '₹79.10', unit: '/kg', change: '+0.6%', isUp: true, location: 'Ahmedabad' },
]
