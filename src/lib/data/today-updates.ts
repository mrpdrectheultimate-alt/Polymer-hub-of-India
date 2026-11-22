// src/lib/data/today-updates.ts — Curated Daily Polymer Intelligence & Benchmark Data (Updated 22 Nov 2026)
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
    id: 'today-2026-11-22-01',
    headline: 'GAIL (India) Limited Commences Trial Runs at 500 KTA Propane Dehydrogenation (PDH) & Polypropylene Unit at Usar, Maharashtra',
    summary: 'GAIL (India) Limited has initiated integrated pre-commissioning and cold-flushing trials at its flagship 500 kilo-tonnes per annum (KTA) Propane Dehydrogenation (PDH) and downstream Polypropylene (PP) complex in Usar, Raigad district, Maharashtra. Utilizing Lummus Catofin PDH technology coupled with LyondellBasell Spheripol-VI polymerization loops, the facility converts imported propane into high-purity polymer-grade propylene and specialized random and impact copolymers. The plant introduces G-Lex P500, a narrow-MWD raffia and injection moulding resin specifically optimized for high-speed automated thin-wall food packaging, automotive battery cases, and non-woven spunbond medical geotextiles across the western industrial corridor.',
    source_name: 'GAIL Corporate Technical Dispatch & Ministry of Petroleum and Natural Gas (MoPNG)',
    source_url: 'https://www.gailonline.com',
    image_url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200&h=700&auto=format&fit=crop&q=80',
    image_credit: 'GAIL Petrochemicals Manufacturing Complex, Usar, Maharashtra',
    visual_type: 'T04',
    rights_class: 'editorial_fair_use',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-11-22T01:30:00.000Z',
    publish_date: '2026-11-22',
    is_featured: true,
  },
  {
    id: 'today-2026-11-22-02',
    headline: 'CPCB Issues National Standard Operating Procedure (SOP) for Geo-Tagged Audit of End-of-Life Plastic Co-Processing in Cement Kilns',
    summary: 'The Central Pollution Control Board (CPCB) has notified a binding National Standard Operating Procedure (SOP) governing the disposal and co-processing of non-recyclable multi-layered combustible plastics (Refuse Derived Fuel, RDF) in industrial cement clinker kilns. Under the amended guidelines, cement producers and recycling processors must implement automated continuous emission monitoring systems (CEMS) measuring dioxins, furans, and hydrogen chloride (HCl) in real-time, accompanied by GPS-tracked weighbridge data. The regulation prevents fraudulent EPR credit generation, mandating that co-processing plants achieve a minimum thermal substitution rate (TSR) of 15% with verified calorific value (>3,500 kcal/kg).',
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
    published_at: '2026-11-22T02:15:00.000Z',
    publish_date: '2026-11-22',
    is_featured: false,
  },
  {
    id: 'today-2026-11-22-03',
    headline: 'IIT Bombay & CIPET Bhubaneswar Develop Electro-Conductive Graphene-MXene/PVDF Nanocomposites for 5G EMI Shielding',
    summary: 'A joint research team from IIT Bombay Department of Metallurgical Engineering & Materials Science and CIPET Bhubaneswar has synthesized lightweight, flexible electromagnetic interference (EMI) shielding films based on Poly(vinylidene fluoride) (PVDF) reinforced with 2D titanium carbide MXene (Ti3C2Tx) and functionalized exfoliated graphene nanosheets. Fabricated via solution casting followed by controlled bi-axial stretching to induce polar beta-phase crystallization, the 120-micron thick nanocomposite achieves an outstanding total shielding effectiveness (SET) of 58.4 dB across the X-band and Ku-band microwave frequencies (8.2–18 GHz), offering aerospace and 5G telecommunication electronics superior lightweight alternative to heavy copper foils.',
    source_name: 'ACS Applied Materials & Interfaces & IIT Bombay Research Highlights',
    source_url: 'https://www.iitb.ac.in',
    image_url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'IIT Bombay Advanced 2D Nanomaterials & Polymer Characterization Lab, Mumbai',
    visual_type: 'T02',
    rights_class: 'academic_citation',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'piezoelectric-polymers-pvdf-mechanisms-beta-phase-polarization-energy-harvesting',
    related_subject_slug: 'polymer-nanotechnology',
    published_at: '2026-11-22T03:00:00.000Z',
    publish_date: '2026-11-22',
    is_featured: false,
  },
  {
    id: 'today-2026-11-22-04',
    headline: 'Ester Industries & UFlex Develop 100% PCR Chemical Polyethylene Terephthalate (rPET) Film for High-Speed Form-Fill-Seal Packaging',
    summary: 'Specialty polymer manufacturers Ester Industries and packaging giant UFlex have commercialized an ultra-thin 12-micron biaxially oriented polyethylene terephthalate (BOPET) film synthesized entirely from post-consumer recycled (PCR) monomers through high-vacuum chemical glycolysis and melt-phase condensation. Exhibiting optical haze under 1.8%, ultimate tensile strength of 220 MPa, and pinhole flex-crack resistance matching 100% virgin PET film, the material enables brand owners to meet national 30% recycled content mandates in high-speed form-fill-seal (FFS) dry-food pouches without loss of metallization adhesion or sealing integrity.',
    source_name: 'Indian Flexible Packaging Bulletin & UFlex Global Technical Release',
    source_url: 'https://www.uflexltd.com',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'UFlex Advanced BOPET Film Manufacturing Complex, Sanand, Gujarat',
    visual_type: 'T06',
    rights_class: 'editorial_fair_use',
    category: 'Recycling',
    region: 'India',
    related_lesson_slug: 'barrier-properties-otr-wvtr',
    related_subject_slug: 'plastic-packaging-engineering',
    published_at: '2026-11-22T03:45:00.000Z',
    publish_date: '2026-11-22',
    is_featured: false,
  },
  {
    id: 'today-2026-11-22-05',
    headline: 'JK Tyre & Indian Institute of Technology Kharagpur Formulate Liquid Polybutadiene-Silica Rubber for Silent Low-Noise EV Treads',
    summary: 'Tire technology engineers at JK Tyre R&D Centre in Mysuru in technical partnership with the Rubber Technology Centre at IIT Kharagpur have formulated an advanced passenger car radial (PCR) tread compound integrating functionalized liquid polybutadiene rubber (LPBR) alongside treated micro-silica and silane coupling agents (Si-69). Tailored to minimize electric vehicle cabin rumble and high-frequency road hiss, dynamic mechanical thermal analysis (DMTA) demonstrates a 2.8 dB acoustic noise reduction at 80 km/h and a 14% improvement in laboratory DIN abrasion resistance (ASTM D5963), addressing rapid tire wear caused by instantaneous high EV motor torque.',
    source_name: 'Rubber News Asia & JK Tyre Advanced Mobility Division',
    source_url: 'https://www.jktyre.com',
    image_url: 'https://images.unsplash.com/photo-1517976487502-5f65342a77a9?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'JK Tyre Raghupati Singhania Centre of Excellence, Mysuru, Karnataka',
    visual_type: 'T08',
    rights_class: 'academic_fair_use',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'vulcanization-of-rubber-chemistry-systems-and-industrial-practice',
    related_subject_slug: 'rubber-technology',
    published_at: '2026-11-22T04:30:00.000Z',
    publish_date: '2026-11-22',
    is_featured: false,
  },
  {
    id: 'today-2026-11-22-06',
    headline: 'Praj Industries & ICT Mumbai Validate Continuous Enzymatic L-Lactic Acid Fermentation for High-D-Content PLA Copolymers',
    summary: 'Industrial biotechnology major Praj Industries in technical collaboration with the Institute of Chemical Technology (ICT) Mumbai has successfully validated a continuous enzymatic sugar-to-lactic acid fermentation pilot facility producing ultra-pure L-lactic acid and D-lactic acid stereoisomers from sugarcane bagasse hydrolysate. The high-purity optical isomers enable the precision ring-opening polymerization (ROP) of stereo-complexed Polylactic Acid (sc-PLA) with a crystalline melting point exceeding 225°C—a 45°C elevation over conventional PLLA—unlocking heat-resistant, microwaveable bioplastic food containers and injection-moulded hot beverage cutlery without thermal deformation.',
    source_name: 'Chemical Weekly & Praj Industries Matrix R&D Center',
    source_url: 'https://www.praj.net',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'Praj Industries Matrix Bio-Process Research Facility, Pune, Maharashtra',
    visual_type: 'T07',
    rights_class: 'editorial_fair_use',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'bio-based-polymers-pla-pha-bio-pe-synthesis-and-properties',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-11-22T05:15:00.000Z',
    publish_date: '2026-11-22',
    is_featured: false,
  },
  {
    id: 'today-2026-11-22-07',
    headline: 'Sunday Indian Petrochemical Price Intelligence: Reliance, GAIL & IOCL Consolidate Polymer Spot Quotes Ahead of New Trading Week',
    summary: 'Heading into the final trading week of November 2026, domestic polymer markets across regional processing hubs in Ahmedabad, Daman, Bhiwandi, and Delhi NCR report solid baseline demand as converters maintain inventory ahead of anticipated month-end price circular adjustments. Primary resin producers kept spot benchmarks firm: Reliance Repol PP raffia (H030SG) held steady at ₹100.40/kg ex-works, Relene HDPE film grade (F5400) stood at ₹105.80/kg, GAIL G-Lex LLDPE was quoted at ₹101.90/kg, and Finolex PVC K-67 rigid pipe grade consolidated at ₹83.50/kg ex-plant. International feedstocks showed ICE Brent crude hovering at $82.90/bbl, providing sustained upstream support across Indian olefin cracking complexes.',
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
    published_at: '2026-11-22T06:00:00.000Z',
    publish_date: '2026-11-22',
    is_featured: false,
  },
  {
    id: 'today-2026-11-22-08',
    headline: 'CIPET Lucknow & Godrej Tooling Validate Piezoelectric Cavity Pressure Transducers for Zero-Defect Micro-Injection Moulding',
    summary: 'The Advanced Tooling and Precision Moulding Centre at CIPET Lucknow in joint technical trials with Godrej & Boyce Tooling Division has validated in-cavity piezoelectric quartz pressure sensors (Kistler 6183A standard) integrated into multi-cavity electronic micro-connector moulds. By capturing dynamic real-time pressure-time profiles directly inside the tool runner and gate junction, the automated control system dynamically shifts the injection moulding machine from velocity to holding packing pressure at the exact micro-second of volumetric cavity filling (switchover pressure 850 bar). The sensor-driven closed loop slashes flash defects and short-shots by 94% on high-speed LCP and PBT terminal blocks.',
    source_name: 'Plastics Engineering Journal & Godrej Tooling Technical Papers',
    source_url: 'https://www.godrej.com',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Advanced Tooling Centre & Precision Moulding Lab, Lucknow, Uttar Pradesh',
    visual_type: 'T05',
    rights_class: 'editorial_fair_use',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-phases-and-optimization',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-11-22T06:45:00.000Z',
    publish_date: '2026-11-22',
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
  { polymer: 'Polypropylene (PP)', grade: 'H030SG (Raffia)', producer: 'Reliance Repol', price: '₹100.40', unit: '/kg', change: '+0.1%', isUp: true, location: 'Hazira / Dahej' },
  { polymer: 'HDPE', grade: 'F5400 (Film / Blow)', producer: 'Reliance Relene', price: '₹105.80', unit: '/kg', change: '+0.1%', isUp: true, location: 'Mumbai Ex-Plant' },
  { polymer: 'LLDPE', grade: 'F2001 (Film Grade)', producer: 'GAIL G-Lex', price: '₹101.90', unit: '/kg', change: '+0.1%', isUp: true, location: 'Pata Plant' },
  { polymer: 'PVC Suspension', grade: 'K-67 (Pipe Grade)', producer: 'Finolex / DCW', price: '₹83.50', unit: '/kg', change: '+0.1%', isUp: true, location: 'Ratnagiri' },
  { polymer: 'PET Bottle Grade', grade: 'AS01 (IV 0.80)', producer: 'Reliance Relpet', price: '₹97.40', unit: '/kg', change: '+0.1%', isUp: true, location: 'Silvassa' },
  { polymer: 'Polycarbonate (PC)', grade: 'Lexan 141R (Moulding)', producer: 'SABIC India', price: '₹225.30', unit: '/kg', change: '+0.1%', isUp: true, location: 'Nhava Sheva' },
  { polymer: 'Polyamide 6 (Nylon)', grade: 'Ultramid B3S (Natural)', producer: 'BASF India', price: '₹255.30', unit: '/kg', change: '+0.1%', isUp: true, location: 'Thane' },
  { polymer: 'ABS Resin', grade: 'HI-121 (Injection)', producer: 'LG Chem / Bhansali', price: '₹147.80', unit: '/kg', change: '+0.1%', isUp: true, location: 'Satnoor' },
  { polymer: 'Circular rPET', grade: 'Food-Contact Flakes', producer: 'EPR Recyclers India', price: '₹81.60', unit: '/kg', change: '+0.1%', isUp: true, location: 'Delhi NCR' },
  { polymer: 'Circular rHDPE', grade: 'Blue Drum Granules', producer: 'EPR Recyclers India', price: '₹78.20', unit: '/kg', change: '+0.3%', isUp: true, location: 'Ahmedabad' },
]
