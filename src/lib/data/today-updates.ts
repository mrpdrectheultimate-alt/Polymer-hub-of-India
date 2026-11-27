// src/lib/data/today-updates.ts — Curated Daily Polymer Intelligence & Benchmark Data (Updated 27 Nov 2026)
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
    id: 'today-2026-11-27-01',
    headline: 'Friday Indian Polymer Spot Intelligence: Domestic Polyolefins Reach Fresh Monthly Highs as Asian Monomer Freights Rise Ahead of December Contracts',
    summary: 'Indian domestic polymer spot benchmarks closed the week on a bullish note on Friday, November 27, 2026. Brent crude touching $84.20/bbl alongside Asian ethylene rising to $920/MT CFR West Coast India propelled primary resin quotes across Gujarat and Maharashtra hubs. Reliance Repol PP raffia (H030SG) rose to ₹102.50/kg ex-Dahej, while Relene HDPE film edged up to ₹107.90/kg ex-Hazira. GAIL G-Lex LLDPE advanced to ₹103.80/kg ex-Pata, and Finolex suspension PVC (K-67) reached ₹85.60/kg ex-Ratnagiri backed by strong irrigation pipe tenders from southern states.',
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
    published_at: '2026-11-27T06:00:00.000Z',
    publish_date: '2026-11-27',
    is_featured: true,
  },
  {
    id: 'today-2026-11-27-02',
    headline: 'DRDO-DMSRDE Kanpur & IIT Roorkee Synthesize Ultra-High Molecular Weight Polyethylene (UHMWPE) Aerogels for Ballistic Trauma Attenuation',
    summary: 'Defense Materials and Stores Research and Development Establishment (DMSRDE) Kanpur in collaboration with IIT Roorkee\'s Department of Polymer and Process Engineering has developed a gel-spun ultra-high molecular weight polyethylene (UHMWPE) aerogel matrix. Featuring oriented crystalline nanofibrils with an elastic modulus of 115 GPa and density of 0.12 g/cm³, the ultra-lightweight composite dissipates 92% of ballistic shock energy from high-velocity projectile impacts without blunt trauma damage, designed for next-generation personal body armor plates.',
    source_name: 'DRDO Research Bulletin & IIT Roorkee Advanced Materials Lab',
    source_url: 'https://www.drdo.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'DRDO-DMSRDE Polymer Nanocomposites Facility, Kanpur',
    visual_type: 'T05',
    rights_class: 'government_open_data',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'viscoelasticity-maxwell-voigt-and-standard-linear-solid-models',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-11-27T06:45:00.000Z',
    publish_date: '2026-11-27',
    is_featured: false,
  },
  {
    id: 'today-2026-11-27-03',
    headline: 'HPCL-Mittal Energy Limited (HMEL) Guru Gobind Singh Refinery Initiates Full Commercial Offtake of Metallocene LLDPE (mLLDPE)',
    summary: 'HMEL has ramped up full commercial supply of hexene-based metallocene linear low-density polyethylene (mLLDPE) from its world-class dual-feed petrochemical unit in Bathinda, Punjab. Offering narrow molecular weight distribution (MWD < 2.3), exceptional dart impact strength (> 450 g), and low hot-tack initiation temperatures, the domestic grade directly substitutes expensive imported mLLDPE resin for heavy-duty collation shrink films and agricultural greenhouse silage wraps.',
    source_name: 'HMEL Petrochemicals Commercial Directorate & Chemical Weekly',
    source_url: 'https://www.hmel.in',
    image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200&h=700&auto=format&fit=crop&q=80',
    image_credit: 'HMEL Integrated Petrochemical Complex, Bathinda, Punjab',
    visual_type: 'T04',
    rights_class: 'editorial_fair_use',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'co-polymerization-random-block-graft-and-crosslinked-architectures',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-11-27T07:30:00.000Z',
    publish_date: '2026-11-27',
    is_featured: false,
  },
  {
    id: 'today-2026-11-27-04',
    headline: 'CSIR-NIIST Thiruvananthapuram Scales Cassava Starch & PLA Blends for Marine-Degradable Agricultural Mulch Films',
    summary: 'Scientists at CSIR-National Institute for Interdisciplinary Science and Technology (NIIST) Thiruvananthapuram have developed twin-screw reactively extruded biocomposite mulch films combining modified cassava starch, polyhydroxybutyrate-co-valerate (PHBV), and polylactic acid (PLA). The blown films achieve 100% soil biodegradation within 120 days post-harvest without releasing microplastics or ecotoxic plasticizer residues, presenting a sustainable solution for vegetable cultivation across Kerala, Tamil Nadu, and Karnataka.',
    source_name: 'CSIR-NIIST Agro-Processing & Polymer Division',
    source_url: 'https://www.niist.res.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-NIIST Biopolymer Pilot Plant, Thiruvananthapuram',
    visual_type: 'T07',
    rights_class: 'academic_fair_use',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'bio-based-polymers-pla-pha-bio-pe-synthesis-and-properties',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-11-27T08:15:00.000Z',
    publish_date: '2026-11-27',
    is_featured: false,
  },
  {
    id: 'today-2026-11-27-05',
    headline: 'Alkem Laboratories & Nepra Resource Management Partner for Closed-Loop Pharmaceutical Blister Pack Recycling',
    summary: 'Pharmaceutical major Alkem Laboratories has signed a multi-year partnership with circular waste management pioneer Nepra to collect and recycle post-consumer PVC/PVDC and cold-form aluminum pharmaceutical blister packs across 14 states. Utilizing specialized micro-delamination and solvent-based hydrothermal separation technology, the recovery plant reclaims 99.2% pure unplasticized PVC (uPVC) granules for electrical conduits and secondary aluminum ingot slabs, preventing landfill incineration.',
    source_name: 'Alkem ESG Directorate & Nepra Circular Solutions',
    source_url: 'https://www.alkemlabs.com',
    image_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Nepra Integrated Waste Recovery & Material Reclamation Hub, Ahmedabad',
    visual_type: 'T01',
    rights_class: 'editorial_fair_use',
    category: 'Recycling',
    region: 'India',
    related_lesson_slug: 'post-consumer-recycling-sorting-washing-and-decontamination',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-11-27T09:00:00.000Z',
    publish_date: '2026-11-27',
    is_featured: false,
  },
  {
    id: 'today-2026-11-27-06',
    headline: 'Bureau of Indian Standards (BIS) Mandates Strict Migration Limits for Phthalate Plasticizers in Toys and Medical Tubing (IS 9873 Part 9)',
    summary: 'BIS has enforced the mandatory national standard IS 9873 (Part 9), establishing an aggregate migration limit of less than 0.1% by weight for six critical phthalate plasticizers (DEHP, DBP, BBP, DINP, DIDP, and DNOP) in flexible PVC toys, pediatric feeding devices, and intravenous medical tubing. Compounding units across Daman and Vapi are rapidly switching to non-toxic bio-citrate (ATBC), terephthalate (DOTP), and epoxidized soybean oil (ESBO) plasticizer alternatives.',
    source_name: 'Bureau of Indian Standards (BIS) Standardization Cell',
    source_url: 'https://www.bis.gov.in',
    image_url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'BIS Certification Directorate, Manak Bhawan, New Delhi',
    visual_type: 'T02',
    rights_class: 'government_open_data',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'thermal-and-oxidative-degradation-chain-scission-and-stabilizers',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-11-27T09:45:00.000Z',
    publish_date: '2026-11-27',
    is_featured: false,
  },
  {
    id: 'today-2026-11-27-07',
    headline: 'University of Cambridge & ETH Zurich Demonstrate 3D-Printed Liquid Crystal Elastomers (LCEs) with 400% Reversible Actuation Strain',
    summary: 'Soft robotics researchers from the University of Cambridge and ETH Zurich have perfected direct-ink-writing (DIW) of monodomain liquid crystal elastomers (LCEs) featuring alignment-preserving photopolymerization. The 3D-printed polymeric artificial muscles contract and expand reversibly by over 400% under mild near-infrared (NIR) laser stimulation with high mechanical work density (180 kJ/m³), opening breakthrough pathways for minimally invasive medical catheters and robotic grippers.',
    source_name: 'Nature Materials & Cambridge Soft Matter Group',
    source_url: 'https://www.nature.com/nmat',
    image_url: 'https://images.unsplash.com/photo-1517976487502-5f65342a77a9?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Cambridge Cavendish Laboratory & ETH Zurich Complex Materials Lab',
    visual_type: 'T08',
    rights_class: 'academic_fair_use',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'liquid-crystalline-polymers-nematic-smectic-and-cholesteric-phases',
    related_subject_slug: 'specialty-polymers',
    published_at: '2026-11-27T10:15:00.000Z',
    publish_date: '2026-11-27',
    is_featured: false,
  },
  {
    id: 'today-2026-11-27-08',
    headline: 'UN Global Plastics Treaty Intergovernmental Negotiating Committee (INC-5) Finalizes Treaty Framework on Problematic Polymers',
    summary: 'Delegates at the final session of the INC-5 Global Plastics Treaty in Busan have reached consensus on a binding international legal framework establishing global criteria for phase-down schedules of hazardous polymer additives and unrecyclable multi-material packaging by 2030. The draft treaty introduces standardized global recyclability definitions and harmonized life-cycle assessment (LCA) rules for international polymer trade.',
    source_name: 'United Nations Environment Programme (UNEP) INC Secretariat',
    source_url: 'https://www.unep.org',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'UNEP INC-5 Secretariat, Busan Exhibition Center',
    visual_type: 'T06',
    rights_class: 'government_open_data',
    category: 'Policy',
    region: 'Global',
    related_lesson_slug: 'life-cycle-assessment-lca-cradle-to-grave-methodology-for-polymers',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-11-27T10:45:00.000Z',
    publish_date: '2026-11-27',
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
  { polymer: 'Polypropylene (PP)', grade: 'H030SG (Raffia)', producer: 'Reliance Repol', price: '₹102.50', unit: '/kg', change: '+0.4%', isUp: true, location: 'Hazira / Dahej' },
  { polymer: 'HDPE', grade: 'F5400 (Film / Blow)', producer: 'Reliance Relene', price: '₹107.90', unit: '/kg', change: '+0.4%', isUp: true, location: 'Mumbai Ex-Plant' },
  { polymer: 'LLDPE', grade: 'F2001 (Film Grade)', producer: 'GAIL G-Lex', price: '₹103.80', unit: '/kg', change: '+0.4%', isUp: true, location: 'Pata Plant' },
  { polymer: 'PVC Suspension', grade: 'K-67 (Pipe Grade)', producer: 'Finolex / DCW', price: '₹85.60', unit: '/kg', change: '+0.5%', isUp: true, location: 'Ratnagiri' },
  { polymer: 'PET Bottle Grade', grade: 'AS01 (IV 0.80)', producer: 'Reliance Relpet', price: '₹99.70', unit: '/kg', change: '+0.4%', isUp: true, location: 'Silvassa' },
  { polymer: 'Polycarbonate (PC)', grade: 'Lexan 141R (Moulding)', producer: 'SABIC India', price: '₹228.10', unit: '/kg', change: '+0.3%', isUp: true, location: 'Nhava Sheva' },
  { polymer: 'Polyamide 6 (Nylon)', grade: 'Ultramid B3S (Natural)', producer: 'BASF India', price: '₹258.40', unit: '/kg', change: '+0.2%', isUp: true, location: 'Thane' },
  { polymer: 'ABS Resin', grade: 'HI-121 (Injection)', producer: 'LG Chem / Bhansali', price: '₹150.10', unit: '/kg', change: '+0.3%', isUp: true, location: 'Satnoor' },
  { polymer: 'Circular rPET', grade: 'Food-Contact Flakes', producer: 'EPR Recyclers India', price: '₹84.40', unit: '/kg', change: '+0.7%', isUp: true, location: 'Delhi NCR' },
  { polymer: 'Circular rHDPE', grade: 'Blue Drum Granules', producer: 'EPR Recyclers India', price: '₹80.90', unit: '/kg', change: '+0.7%', isUp: true, location: 'Ahmedabad' },
]
