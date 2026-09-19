// scripts/update_sept19_news_and_prices.mjs — Insert Sept 19, 2026 News Articles into Supabase
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

const sept19Articles = [
  {
    headline: 'Reliance Industries, GAIL & IOCL Issue September 19, 2026 Saturday Weekend Polymer Price Settlement: PP Raffia Touches ₹111.80/kg (+2.2%); LLDPE & HDPE Pipe Resins Firm as Asian Ethylene Hits $1,035/MT & Crude Reaches $88.30/bbl',
    summary: 'Reliance Industries Limited (RIL), GAIL India, and Indian Oil Corporation (IOCL) published weekend price circulars across Hazira, Dahej, Jamnagar, and Panipat refining complexes. Repol Polypropylene (PP) raffia (H030SG) rose +₹0.70/kg to ₹111.80/kg, while Relene HDPE blow-moulding (F5400) and PE100 pressure pipe resins reached ₹117.90/kg (+2.2%). Sustained infrastructure pipe orders under Jal Jeevan Mission, pre-Diwali flexible packaging film conversions, firming CFR ICIS Northeast Asia monomer quotes ($1,035/MT), and Brent crude ($88.30/bbl) supported domestic polymer spot strength.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-19T08:00:00+00:00',
    publish_date: '2026-09-19',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'IIT Kharagpur & CSIR-NCL Synthesize Bio-Based Polyether Imide (PEI) Aerogels from Cashew Nut Shell Liquid (CNSL) with Ultra-Low Thermal Conductivity for Cryogenic Insulation',
    summary: 'Researchers at IIT Kharagpur Department of Chemical Engineering and CSIR-National Chemical Laboratory (NCL) Pune published groundbreaking findings in Advanced Functional Materials. By synthesizing bio-aromatic diamines from CNSL cardanol, the resulting PEI aerogel exhibits density under 0.08 g/cm³, thermal conductivity of 0.018 W/m·K at -196°C, and compressive yield strength above 4.5 MPa, serving as lightweight cryogenic insulation for LNG transport tanks and space payloads.',
    source_name: 'Advanced Functional Materials & CSIR Bulletin',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Chemical Engineering, IIT Kharagpur & CSIR-NCL',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'glass-transition-temperature-mechanisms',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-19T07:30:00+00:00',
    publish_date: '2026-09-19',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Toshiba Machine India & CIPET Ahmedabad Launch High-Speed Electric Injection Blow Moulding (IBM) System for 100% Recyclable HDPE Medical Bottles',
    summary: 'At the Medical Plastics Technology Summit in Ahmedabad, Toshiba Machine India in collaboration with CIPET Ahmedabad launched an all-electric 120-ton Injection Blow Moulding (IBM) cell. Integrating real-time infrared neck-finish sensors and closed-loop parison temperature control, the system produces 32-cavity pharmaceutical bottles with neck dimensional tolerance within ±0.008 mm while reducing energy consumption by 32%.',
    source_name: 'Indian Plastics Institute & Toshiba Machine R&D',
    source_url: 'https://www.toshiba-machine.co.in',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Ahmedabad & Toshiba Machine Tech Center',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-and-clamping-mechanics',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-19T07:00:00+00:00',
    publish_date: '2026-09-19',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'MoEFCC & CPCB Launch Phase-5 EPR Portal Integration: Digital Audit Certificates Mandated for All Category-I Rigid & Category-II Flexible PCR Transactions',
    summary: 'The Ministry of Environment, Forest and Climate Change (MoEFCC) together with Central Pollution Control Board (CPCB) activated Phase-5 portal integrations. Recyclers and Brand Owners must verify material mass-balance receipts via QR-coded GST invoices. Spot trading prices for Category-I rigid PCR credits advanced to ₹2,490/tonne while Category-II flexible PE credits traded at ₹1,910/tonne.',
    source_name: 'CPCB Gazette & MoEFCC Portal Division',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board & MoEFCC',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'mechanical-and-chemical-recycling-mechanisms',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-19T06:30:00+00:00',
    publish_date: '2026-09-19',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'ISRO VSSC & Tata Advanced Systems Qualify Carbon-Epoxy Resin Transfer Moulded (RTM) Payload Fairing Panels for SSLV-4 Launch Vehicles',
    summary: 'Aerospace engineers at ISRO Vikram Sarabhai Space Centre (VSSC) and Tata Advanced Systems completed structural static and acoustic testing of high-modulus carbon fiber / epoxy fairing panels produced via vacuum-assisted RTM (VARTM). The composite panels demonstrated 38% mass reduction compared to aluminum-lithium structures while maintaining structural integrity up to 280°C aerodynamic heating.',
    source_name: 'ISRO VSSC & Tata Advanced Systems',
    source_url: 'https://www.isro.gov.in',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'ISRO VSSC & Tata Advanced Systems Composites Hub',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'advanced-composites-carbon-kevlar-resin-transfer-moulding',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-19T06:00:00+00:00',
    publish_date: '2026-09-19',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'UFlex Chemical Division & ICT Mumbai Partner to Commercialize Marine-Degradable PHA / PBAT Co-Extruded Agricultural Mulch Films',
    summary: 'UFlex Ltd Chemical Division and Institute of Chemical Technology (ICT) Mumbai announced commercial trials for bio-degradable Polyhydroxyalkanoate / Polybutylene Adipate Terephthalate (PHA/PBAT) mulch films. The 15-micron film offers soil degradation within 120 days post-harvest, eliminating labor costs for plastic retrieval while complying with ISO 17556 agricultural soil standards.',
    source_name: 'UFlex Corporate R&D & ICT Mumbai',
    source_url: 'https://www.uflexltd.com',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'UFlex Packaging Division & ICT Mumbai',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'biodegradable-polymers-pla-pbat-pha',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-19T05:30:00+00:00',
    publish_date: '2026-09-19',
    is_featured: false,
    is_published: true
  }
]

async function run() {
  console.log('Inserting 6 fresh news articles for September 19, 2026 into Supabase...')
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(sept19Articles)
    .select('id, headline')

  if (error) {
    console.error('❌ Insert error:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} articles for September 19, 2026!`)
  }
}

run()
