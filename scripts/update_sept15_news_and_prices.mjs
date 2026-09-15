// scripts/update_sept15_news_and_prices.mjs — Insert Sept 15, 2026 News Articles into Supabase
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

const sept15Articles = [
  {
    headline: 'Reliance Industries, GAIL & IOCL Revise September 15, 2026 Polymer Spot Index: PP Raffia Firm at ₹109.20/kg (+1.8%); LLDPE & HDPE Resins Surge on Rising Asian Ethylene Monomer & Oil Price Spikes',
    summary: 'Reliance Industries Limited (RIL), GAIL India, and Indian Oil Corporation (IOCL) issued mid-week spot pricing updates across Hazira, Dahej, Jamnagar, and Panipat refineries. Repol Polypropylene (PP) raffia (H030SG) increased +₹0.70/kg to ₹109.20/kg, while Relene HDPE blow-moulding (F5400) and PE100 pressure pipe grades climbed to ₹115.40/kg (+1.8%). Sustained agricultural piping demand under Jal Jeevan Mission, firming CFR ICIS Northeast Asia monomer quotes ($1,005/MT), and Brent crude futures ($86.80/bbl) supported domestic polymer price momentum.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-15T08:00:00+00:00',
    publish_date: '2026-09-15',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'IIT Bombay & CSIR-NCL Synthesize Bio-Based Polyketone Nanocomposites with 35% Higher Heat Deflection Temperature (HDT) for Automotive Under-the-Hood Parts',
    summary: 'Materials scientists at IIT Bombay Department of Chemical Engineering and CSIR-National Chemical Laboratory (NCL) Pune published groundbreaking findings in Macromolecules. By incorporating silane-functionalized halloysite nanotubes into bio-derived carbon monoxide-ethylene-propylene polyketones, the nanocomposite demonstrates HDT elevation to 215°C under 1.82 MPa (ASTM D648) alongside a 40% reduction in moisture absorption compared to standard PA66.',
    source_name: 'Macromolecules & CSIR-NCL Bulletin',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Chemical Engineering, IIT Bombay & CSIR-NCL',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'glass-transition-temperature-mechanisms',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-15T07:30:00+00:00',
    publish_date: '2026-09-15',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CIPET Chennai & WINDSOR Machines Unveil High-Speed Electric Injection Moulding Cell with Real-Time Cavity Pressure Feedback & AI Rheology Compensation',
    summary: 'At the Plastivision Technology Summit in Chennai, CIPET Chennai and Windsor Machines launched an all-electric 250-ton injection moulding cell. The system utilizes inline piezoelectric cavity transducers and AI-driven melt viscosity compensation to dynamically adjust holding pressure, achieving weight variance under 0.05% across 32-cavity medical syringe production.',
    source_name: 'Indian Plastics Institute & CIPET Chennai',
    source_url: 'https://www.windsormachines.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Chennai & Windsor Machines Tech Center',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-and-clamping-mechanics',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-15T07:00:00+00:00',
    publish_date: '2026-09-15',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'MoEFCC & CPCB Portal Mandate Real-Time Blockchain Verification for Category-II Flexible Packaging EPR Credit Trading starting Q3 FY2026',
    summary: 'The Ministry of Environment, Forest and Climate Change (MoEFCC) together with Central Pollution Control Board (CPCB) issued operational circulars for the National EPR Portal. Recyclers and Brand Owners must verify material mass-balance receipts via QR-linked GST invoices. Spot trading prices for Category-II flexible plastic EPR credits reached ₹1,850/tonne, while Category-I rigid PCR credits stabilized at ₹2,340/tonne.',
    source_name: 'CPCB Gazette & MoEFCC EPR Division',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board & MoEFCC',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'mechanical-and-chemical-recycling-mechanisms',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-15T06:30:00+00:00',
    publish_date: '2026-09-15',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'ISRO & HAL Validate Carbon-PEEK Thermoplastic Composite Grid-Stiffened Structures for Launch Vehicle Payload Fairings',
    summary: 'Structural engineers at ISRO Vikram Sarabhai Space Centre (VSSC) and Hindustan Aeronautics Limited (HAL) completed acoustic and vibration testing of automated fiber placement (AFP) Carbon fiber/PEEK grid panels. Thermoplastic in-situ consolidation reduced manufacturing lead time by 60% compared to thermoset autoclaving while preserving structural rigidity up to 260°C operating temperatures.',
    source_name: 'ISRO VSSC & HAL Composites Division',
    source_url: 'https://www.isro.gov.in',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'ISRO VSSC Composites Facility',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'advanced-composites-carbon-kevlar-resin-transfer-moulding',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-15T06:00:00+00:00',
    publish_date: '2026-09-15',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Supreme Petrochem & ICT Mumbai Launch Commercial Scale Bio-Polystyrene / PHA Blends for High-Clarity Thermoformed Food Trays',
    summary: 'Supreme Petrochem Ltd in collaboration with Institute of Chemical Technology (ICT) Mumbai announced trial production of bio-compatible Polystyrene/Polyhydroxyalkanoate (PHA) alloys. Incorporating 30% marine-degradable PHA, the resin provides optical clarity above 88% and Elmendorf tear resistance exceeding ASTM D1922 packaging standards.',
    source_name: 'Supreme Petrochem R&D & ICT Mumbai',
    source_url: 'https://www.supreme-petrochem.com',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Polymer & Surface Engineering, ICT Mumbai',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'biodegradable-polymers-pla-pbat-pha',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-15T05:30:00+00:00',
    publish_date: '2026-09-15',
    is_featured: false,
    is_published: true
  }
]

async function run() {
  console.log('Inserting 6 fresh news articles for September 15, 2026 into Supabase...')
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(sept15Articles)
    .select('id, headline')

  if (error) {
    console.error('❌ Insert error:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} articles for September 15, 2026!`)
  }
}

run()
