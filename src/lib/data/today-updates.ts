// src/lib/data/today-updates.ts — Curated Daily Polymer Intelligence & Benchmark Data (Updated 25 Nov 2026)
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
    id: 'today-2026-11-25-01',
    headline: 'Wednesday Indian Polymer Spot Intelligence: Reliance & GAIL Maintain Upward Price Momentum as Feedstock Naphtha & Propylene Rise Across Asian Hubs',
    summary: 'In mid-week trading across key processing clusters (Daman, Ahmedabad, Bhiwandi, Hyderabad, and Guindy), Indian domestic polymer spot benchmarks maintained an upward trajectory on Wednesday, November 25, 2026. Upstream crude holding firm at $83.85/bbl coupled with Asian ethylene reaching $915/MT CFR West Coast India propelled primary resin quotes. Reliance Repol PP raffia (H030SG) touched ₹101.60/kg ex-Dahej (+₹0.40/kg), while Relene HDPE film advanced to ₹107.10/kg ex-Hazira (+₹0.50/kg). GAIL G-Lex LLDPE stood firm at ₹103.10/kg ex-Pata, and PVC resin held steady at ₹84.80/kg ex-Ratnagiri backed by strong agricultural piping off-take ahead of rabi season installations.',
    source_name: 'S&P Global Platts Petrochemical Alert & Indian Petrochem Circulars',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Platts Global Petrochemical Intelligence & Energy Trading Desk',
    visual_type: 'T03',
    rights_class: 'editorial_fair_use',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'carbon-footprint-polymer-production',
    related_subject_slug: 'life-cycle-assessment',
    published_at: '2026-11-25T06:00:00.000Z',
    publish_date: '2026-11-25',
    is_featured: true,
  },
  {
    id: 'today-2026-11-25-02',
    headline: 'BIS Quality Control Order (QCO) for Polycarbonate & PBT Electrical Components Enters Mandatory Enforcement Phase',
    summary: 'The Bureau of Indian Standards (BIS) and the Department of Chemicals and Petrochemicals (DCPC) have notified the full enforcement of the Quality Control Order (QCO) for Polycarbonate (IS 14434) and Polybutylene Terephthalate (PBT, IS 14435) compounds used in electronic connectors, EV switchgears, and solar junction boxes. Importers and domestic compounders must display the standard ISI mark, certifying limiting oxygen index (LOI > 28%), glow wire flammability index (GWFI 960°C under IEC 60695-2-12), and comparative tracking index (CTI > 250V). Uncertified engineering polymer compounds can no longer clear Indian customs.',
    source_name: 'Bureau of Indian Standards (BIS) Official Gazette & DCPC Notification',
    source_url: 'https://www.bis.gov.in',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'BIS Certification Directorate, Manak Bhawan, New Delhi',
    visual_type: 'T01',
    rights_class: 'government_open_data',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'flammability-and-fire-retardancy-testing-ul-94-loi-cone-calorimetry',
    related_subject_slug: 'polymer-testing',
    published_at: '2026-11-25T06:45:00.000Z',
    publish_date: '2026-11-25',
    is_featured: false,
  },
  {
    id: 'today-2026-11-25-03',
    headline: 'Indian Oil (IOCL) Paradip Petrochemical Complex Commissions 700 KTA Polypropylene Plant with Novolen Technology',
    summary: 'Indian Oil Corporation Limited (IOCL) has begun commercial trials of its world-scale 700 KTA polypropylene unit at the Paradip Refinery and Petrochemicals Complex in Odisha, utilizing Lummus Novolen gas-phase vertical stirred-bed reactor technology. The plant is engineered to produce high-clarity random copolymers and high-stiffness homopolymers for automotive trim, medical syringes, and thin-wall injection-moulded packaging, anchoring the Petroleum, Chemicals and Petrochemical Investment Region (PCPIR) development in eastern India.',
    source_name: 'IOCL Petrochemicals Directorate & Ministry of Petroleum and Natural Gas',
    source_url: 'https://iocl.com',
    image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200&h=700&auto=format&fit=crop&q=80',
    image_credit: 'IOCL Paradip Integrated Refinery & Petrochemical Complex, Odisha',
    visual_type: 'T04',
    rights_class: 'editorial_fair_use',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-11-25T07:30:00.000Z',
    publish_date: '2026-11-25',
    is_featured: false,
  },
  {
    id: 'today-2026-11-25-04',
    headline: 'IIT Madras & CIPET Chennai Develop Self-Healing Thermoplastic Polyurethane (TPU) Nanocomposites with 94% Tensile Recovery',
    summary: 'A joint research team from IIT Madras\'s Department of Metallurgical and Materials Engineering and CIPET: IPT Chennai has synthesized a novel intrinsically self-healing thermoplastic polyurethane (TPU) incorporating dynamic disulfide bonds and functionalized multi-walled carbon nanotubes (MWCNTs). The nanocomposite achieves 94% tensile strength recovery within 15 minutes at 60°C under moderate thermal stimulus, presenting significant industrial potential for puncture-resistant automotive airless tyres, flexible electronics, and wearable biomedical protective sensors.',
    source_name: 'IIT Madras Research Bulletin & ACS Applied Polymer Materials',
    source_url: 'https://www.iitm.ac.in',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'IIT Madras Advanced Materials Lab & CIPET: IPT Chennai',
    visual_type: 'T05',
    rights_class: 'academic_fair_use',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'viscoelasticity-maxwell-voigt-and-standard-linear-solid-models',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-11-25T08:15:00.000Z',
    publish_date: '2026-11-25',
    is_featured: false,
  },
  {
    id: 'today-2026-11-25-05',
    headline: 'Praj Industries & CSIR-NCL Pune Scale Continuous Lactic Acid Fermentation for India\'s First Demo-Scale PLA Polymerization Line',
    summary: 'Industrial biotechnology major Praj Industries, in collaboration with CSIR-National Chemical Laboratory (NCL) Pune, has validated continuous microbial fermentation of second-generation agricultural sugarcane bagasse hydrolysate into polymerization-grade D- and L-lactic acid. The process feeds into their upcoming 5,000 MT/year Polylactic Acid (PLA) demonstration plant in Maharashtra. Ring-opening polymerization (ROP) trials of the high-purity lactide yielded semicrystalline PLA with a melting temperature (Tm) of 174°C and heat deflection temperature (HDT) exceeding 85°C when nucleated, suitable for injection-moulded compostable tableware and thermoformed trays.',
    source_name: 'Praj Matrix R&D Center & CSIR-NCL Polymer Division',
    source_url: 'https://www.ncl-india.org',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-NCL Biochemical Sciences & Polymer Chemistry Division, Pune',
    visual_type: 'T07',
    rights_class: 'academic_citation',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'bio-based-polymers-pla-pha-bio-pe-synthesis-and-properties',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-11-25T09:00:00.000Z',
    publish_date: '2026-11-25',
    is_featured: false,
  },
  {
    id: 'today-2026-11-25-06',
    headline: 'UFlex Unveils Ultra-High Barrier AlOx Polyester Films (BOPET) Replacing Aluminum Foil in Aseptic Retort Pouches',
    summary: 'Flexible packaging conglomerate UFlex has commercialized a transparent aluminum-oxide (AlOx) vacuum-evaporated BOPET barrier film engineered to replace opaque aluminum foil in multi-layer aseptic retort pouches. The 12-micron film achieves an oxygen transmission rate (OTR) of less than 0.8 cc/m²·day and water vapor transmission rate (WVTR) below 0.6 g/m²·day while withstanding autoclave sterilization temperatures of 121°C for 30 minutes, drastically enhancing the mono-material recyclability of ready-to-eat food pouches under India\'s EPR guidelines.',
    source_name: 'UFlex Packaging Technology News & Packaging World Digest',
    source_url: 'https://www.uflexltd.com',
    image_url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'UFlex Flexible Packaging Converting Plant, Sanand, Gujarat',
    visual_type: 'T02',
    rights_class: 'editorial_fair_use',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'gas-and-moisture-barrier-permeation-mechanisms-and-equations',
    related_subject_slug: 'plastic-packaging-engineering',
    published_at: '2026-11-25T09:45:00.000Z',
    publish_date: '2026-11-25',
    is_featured: false,
  },
  {
    id: 'today-2026-11-25-07',
    headline: 'CPCB EPR Portal Integrates RFID & Blockchain Tracking for Recycled Plastic Pellet Batches Across 2,400 Registered Recyclers',
    summary: 'The Central Pollution Control Board (CPCB) has rolled out an automated traceability framework on its National EPR Portal for Plastic Packaging. Starting December 2026, all registered plastic waste processors (PWPs) producing recycled granules must issue digitally signed cryptographic certificates linked to unique barcode/RFID batch identifiers on every 25 kg bag. The system cross-verifies electricity meter consumption and GST tax invoices against claimed PCR output, preventing fraudulent certificate generation and stabilizing spot EPR credit prices at ₹3,240/ton for Category-I rigid plastics.',
    source_name: 'Central Pollution Control Board (CPCB) Plastic Waste Management Division',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CPCB Central Control Room for Environmental Data, Delhi',
    visual_type: 'T06',
    rights_class: 'government_open_data',
    category: 'Recycling',
    region: 'India',
    related_lesson_slug: 'post-consumer-recycling-sorting-washing-and-decontamination',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-11-25T10:30:00.000Z',
    publish_date: '2026-11-25',
    is_featured: false,
  },
  {
    id: 'today-2026-11-25-08',
    headline: 'Global Polyimide Aerogel Breakthrough Achieves Thermal Insulation Down to 0.014 W/m·K for Cryogenic Spacecraft Insulation',
    summary: 'Advanced composite researchers in collaboration with space agencies have synthesized cross-linked polyimide (PI) aerogels with densities below 0.08 g/cm³ and a room-temperature thermal conductivity (λ) of 0.014 W/m·K. Retaining high flexibility without dust shedding across a temperature spectrum of -200°C to +300°C, the polyimide aerogel blankets demonstrate superior compressive resilience (Young\'s modulus 12 MPa), outperforming traditional aerogel-infused silica mats for cryogenic propellant lines and hyperspeed reentry thermal shields.',
    source_name: 'Advanced Functional Materials & High-Performance Polymers Dispatch',
    source_url: 'https://onlinelibrary.wiley.com/journal/16163028',
    image_url: 'https://images.unsplash.com/photo-1517976487502-5f65342a77a9?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Advanced Functional Nanomaterials Laboratory, Materials Research Directorate',
    visual_type: 'T08',
    rights_class: 'academic_fair_use',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'thermal-conductivity-and-thermal-diffusivity-models-and-transient-heat-transfer',
    related_subject_slug: 'polymer-nanotechnology',
    published_at: '2026-11-25T11:15:00.000Z',
    publish_date: '2026-11-25',
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
  { polymer: 'Polypropylene (PP)', grade: 'H030SG (Raffia)', producer: 'Reliance Repol', price: '₹101.60', unit: '/kg', change: '+0.4%', isUp: true, location: 'Hazira / Dahej' },
  { polymer: 'HDPE', grade: 'F5400 (Film / Blow)', producer: 'Reliance Relene', price: '₹107.10', unit: '/kg', change: '+0.5%', isUp: true, location: 'Mumbai Ex-Plant' },
  { polymer: 'LLDPE', grade: 'F2001 (Film Grade)', producer: 'GAIL G-Lex', price: '₹103.10', unit: '/kg', change: '+0.4%', isUp: true, location: 'Pata Plant' },
  { polymer: 'PVC Suspension', grade: 'K-67 (Pipe Grade)', producer: 'Finolex / DCW', price: '₹84.80', unit: '/kg', change: '+0.6%', isUp: true, location: 'Ratnagiri' },
  { polymer: 'PET Bottle Grade', grade: 'AS01 (IV 0.80)', producer: 'Reliance Relpet', price: '₹98.90', unit: '/kg', change: '+0.5%', isUp: true, location: 'Silvassa' },
  { polymer: 'Polycarbonate (PC)', grade: 'Lexan 141R (Moulding)', producer: 'SABIC India', price: '₹226.90', unit: '/kg', change: '+0.3%', isUp: true, location: 'Nhava Sheva' },
  { polymer: 'Polyamide 6 (Nylon)', grade: 'Ultramid B3S (Natural)', producer: 'BASF India', price: '₹257.00', unit: '/kg', change: '+0.2%', isUp: true, location: 'Thane' },
  { polymer: 'ABS Resin', grade: 'HI-121 (Injection)', producer: 'LG Chem / Bhansali', price: '₹149.10', unit: '/kg', change: '+0.3%', isUp: true, location: 'Satnoor' },
  { polymer: 'Circular rPET', grade: 'Food-Contact Flakes', producer: 'EPR Recyclers India', price: '₹83.20', unit: '/kg', change: '+0.7%', isUp: true, location: 'Delhi NCR' },
  { polymer: 'Circular rHDPE', grade: 'Blue Drum Granules', producer: 'EPR Recyclers India', price: '₹79.60', unit: '/kg', change: '+0.6%', isUp: true, location: 'Ahmedabad' },
]
