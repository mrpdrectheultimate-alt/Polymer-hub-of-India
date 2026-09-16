// scripts/update_sept16_news_and_prices.mjs — Insert Sept 16, 2026 News Articles into Supabase
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const sept16Articles = [
  {
    headline: 'Reliance Industries, GAIL & Haldia Petrochemicals Release September 16, 2026 Polymer Spot Revision: PP Raffia Touches ₹109.80/kg (+1.9%); LLDPE & PVC Grades Rise as Crude Holds at $87.10/bbl & Asian Freight Rates Firm Up',
    summary: 'Reliance Industries Limited (RIL), GAIL India, and Haldia Petrochemicals Ltd (HPL) issued fresh midweek price circulars across Dahej, Hazira, Haldia, and Nagothane manufacturing hubs. Repol Polypropylene (PP) raffia (H030SG) gained +₹0.60/kg to ₹109.80/kg, while Relene HDPE injection moulding (M50181) and PE100 pressure pipe resins rose to ₹115.90/kg (+1.9%). Strong automotive compounding demand in Chakan/Guindy, tightening CFR ICIS Northeast Asia monomer quotes ($1,015/MT), and Brent crude ($87.10/bbl) supported domestic polymer spot firmness.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-16T08:00:00+00:00',
    publish_date: '2026-09-16',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'CSIR-NCL Pune & IIT Madras Synthesize Bio-Based Polycarbonate from Industrial CO2 & Epoxides with 45% Higher Scratch Resistance for Optical Displays',
    summary: 'Chemical engineers at CSIR-National Chemical Laboratory (NCL) Pune and IIT Madras Department of Chemical Engineering published joint findings in ACS Sustainable Chemistry & Engineering. Utilizing zinc-cobalt double metal cyanide (DMC) catalysts, the team synthesized high-molecular-weight poly(limonene carbonate) (PLC) achieving glass transition temperature (Tg) of 132°C and Pencil Hardness rating of 3H, enabling eco-friendly replacement of conventional BPA-polycarbonate in electronic touchscreens.',
    source_name: 'ACS Sustainable Chemistry & CSIR Bulletin',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Chemical Engineering, IIT Madras & CSIR-NCL',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'glass-transition-temperature-mechanisms',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-16T07:30:00+00:00',
    publish_date: '2026-09-16',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Windsor Machines & LKM Mould Base Unveil 3D Printed Conformal Cooling Cavity Inserts for Ultra-Fast PET Preform Injection Moulding',
    summary: 'At the International Mould & Die Exhibition (DIEMOLD) in Mumbai, Windsor Machines alongside LKM Mould Base demonstrated direct metal laser sintered (DMLS) maraging steel cavity inserts with conformal cooling channels. Applied across 48-cavity bottle preform tooling, the conformal channel design reduced cavity temperature gradients to ±1.5°C, cutting total injection cycle times from 14.2s to 11.1s (21.8% productivity gain).',
    source_name: 'Indian Plastics Institute & DIEMOLD Expo',
    source_url: 'https://www.windsormachines.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'LKM Mould Base & Windsor Machines R&D',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-and-clamping-mechanics',
    related_subject_slug: 'mould-design',
    published_at: '2026-09-16T07:00:00+00:00',
    publish_date: '2026-09-16',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'MoEFCC & CPCB Notification: 100% Mandate for QR-Coded Mass Balance Audit Certificates on Post-Consumer Recycled (PCR) Resin Shipments from October 2026',
    summary: 'The Ministry of Environment, Forest and Climate Change (MoEFCC) together with Central Pollution Control Board (CPCB) issued a joint gazette notification. Plastic recyclers and compounding units must issue QR-coded digital audit certificates under IS 14534 standards for all PCR shipments. Category-I rigid PCR credits advanced to ₹2,380/tonne while Category-III industrial packaging credits traded at ₹1,920/tonne.',
    source_name: 'CPCB Gazette & MoEFCC Notification',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board & MoEFCC',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'mechanical-and-chemical-recycling-mechanisms',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-16T06:30:00+00:00',
    publish_date: '2026-09-16',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'HAL Composites Division & CIPET Ahmedabad Qualify Carbon Fiber / Epoxy Autoclave Prepregs for Light Combat Aircraft (LCA Tejas Mk2) Wing Spars',
    summary: 'Defense materials engineers at Hindustan Aeronautics Limited (HAL) Composites Division and CIPET Ahmedabad completed structural fatigue testing under MIL-HDBK-17 standards for toughened epoxy/high-modulus carbon prepregs. The composite spars demonstrated short beam shear strength (SBSS) of 92 MPa and zero micro-void delamination after 10,000 thermal shock cycles (-55°C to 150°C).',
    source_name: 'HAL Composites & CIPET Defense R&D',
    source_url: 'https://www.hal-india.co.in',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'HAL Aircraft Composites Facility',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'advanced-composites-carbon-kevlar-resin-transfer-moulding',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-16T06:00:00+00:00',
    publish_date: '2026-09-16',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'UFlex Chemical Division & IIT Roorkee Partner to Commercialize High-Barrier Biodegradable Aliphatic-Aromatic Co-Polyester (PBAT/PLA) Co-Extruded Films',
    summary: 'UFlex Ltd Chemical Division in partnership with IIT Roorkee Centre for Packaging Materials launched 3-layer co-extruded bio-barrier films for snack food packaging. Incorporating nano-clays in PLA/PBAT matrices, the film achieves water vapor transmission rates (WVTR) under 1.2 g/m²/day and oxygen permeability below 8 cc/m²/day, meeting ASTM F1249 barrier specifications.',
    source_name: 'UFlex Corporate R&D & IIT Roorkee',
    source_url: 'https://www.uflexltd.com',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'UFlex Packaging Research & IIT Roorkee',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'biodegradable-polymers-pla-pbat-pha',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-16T05:30:00+00:00',
    publish_date: '2026-09-16',
    is_featured: false,
    is_published: true
  }
]

async function run() {
  console.log('Inserting 6 fresh news articles for September 16, 2026 into Supabase...')
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(sept16Articles)
    .select('id, headline')

  if (error) {
    console.error('❌ Insert error:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} articles for September 16, 2026!`)
  }
}

run()
