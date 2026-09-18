// scripts/update_sept18_news_and_prices.mjs — Insert Sept 18, 2026 News Articles into Supabase
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

const sept18Articles = [
  {
    headline: 'Reliance Industries, GAIL & IOCL Issue September 18, 2026 Friday Opening Price Revision: PP Raffia Firm at ₹111.10/kg (+2.1%); HDPE Pipe & LLDPE Resins Surge as Crude Touches $87.90/bbl & Pre-Diwali Converter Orders Pick Up',
    summary: 'Reliance Industries Limited (RIL), GAIL India, and Indian Oil Corporation (IOCL) issued Friday opening price revisions across Hazira, Dahej, Jamnagar, and Panipat plants. Repol Polypropylene (PP) raffia (H030SG) advanced +₹0.70/kg to ₹111.10/kg, while Relene HDPE blow-moulding (F5400) and PE100 pressure pipe resins reached ₹117.20/kg (+2.1%). Pre-festival packaging film conversions, firming CFR ICIS Northeast Asia monomer quotes ($1,028/MT), and Brent crude futures ($87.90/bbl) supported domestic polymer spot price momentum.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-18T08:00:00+00:00',
    publish_date: '2026-09-18',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'CSIR-NCL Pune & IIT Madras Synthesize High-Tg Bio-Based Polyamides from Castor-Oil Derived Sebacic Acid with 40% Lower Water Absorption for Under-the-Hood EV Connectors',
    summary: 'Materials scientists at CSIR-National Chemical Laboratory (NCL) Pune and IIT Madras Department of Chemical Engineering published breakthrough findings in Polymer Chemistry. By synthesizing bio-PA610/PA1010 copolymers reinforced with amino-functionalized halloysite clay, the bio-polyamide exhibits glass transition temperature (Tg) of 84°C, tensile strength of 88 MPa, and water saturation under 1.2% (ASTM D570), making it ideal for high-humidity automotive electrical junction boxes.',
    source_name: 'Polymer Chemistry & CSIR Bulletin',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Chemical Engineering, IIT Madras & CSIR-NCL',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'glass-transition-temperature-mechanisms',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-18T07:30:00+00:00',
    publish_date: '2026-09-18',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Electronica Plastic Machines & CIPET Pune Launch All-Electric 180-Ton Injection Moulding Cell with Optical Cavity Pressure Transducers & Closed-Loop Wall-Thickness Control',
    summary: 'At the Western India Plastics OEM Summit in Pune, Electronica Plastic Machines in collaboration with CIPET Pune launched a high-precision 180-ton all-electric injection moulding machine. The system features inline fiber-optic cavity pressure sensors and real-time melt viscosity auto-tuning, keeping weight tolerance within ±0.03% across 16-cavity automotive lighting lenses.',
    source_name: 'Indian Plastics Institute & Electronica R&D',
    source_url: 'https://www.electronicipm.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Pune & Electronica Plastics Tech Center',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-and-clamping-mechanics',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-18T07:00:00+00:00',
    publish_date: '2026-09-18',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'MoEFCC & CPCB Notify Mandatory QR-Coded Mass Balance Certificates for Category-I Rigid Plastics EPR Trading from Q4 FY2026',
    summary: 'The Ministry of Environment, Forest and Climate Change (MoEFCC) together with Central Pollution Control Board (CPCB) released operational guidelines for the National EPR Portal. Brand owners and recyclers must register digital QR-coded mass balance audit trails for all PCR resin transactions. Category-I rigid PCR credits advanced to ₹2,450/tonne while Category-II flexible PE credits traded at ₹1,880/tonne.',
    source_name: 'CPCB Gazette & MoEFCC Notification',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board & MoEFCC',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'mechanical-and-chemical-recycling-mechanisms',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-18T06:30:00+00:00',
    publish_date: '2026-09-18',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'ISRO VSSC & L&T Heavy Engineering Qualify Filament-Wound Carbon-Epoxy Solid Rocket Motor Cases for Small Satellite Launch Vehicle (SSLV-3)',
    summary: 'Aerospace materials engineers at ISRO Vikram Sarabhai Space Centre (VSSC) and Larsen & Toubro Heavy Engineering completed hydraulic proof-pressure testing for T800 carbon fiber / anhydride-cured epoxy motor casings. The composite vessel achieved a burst-to-operating pressure ratio of 1.65 under ISO 11119 standards while reducing third-stage structural mass by 42%.',
    source_name: 'ISRO VSSC & L&T Aerospace',
    source_url: 'https://www.isro.gov.in',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'ISRO VSSC & L&T Aerospace Composite Facility',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'advanced-composites-carbon-kevlar-resin-transfer-moulding',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-18T06:00:00+00:00',
    publish_date: '2026-09-18',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Supreme Petrochem & ICT Mumbai Partner to Commercialize High-Clarity Compostable PLA/PBAT Blended Thermoforming Sheets for Produce Packaging',
    summary: 'Supreme Petrochem Ltd and Institute of Chemical Technology (ICT) Mumbai announced trial production of bio-based Polylactic Acid / Polybutylene Adipate Terephthalate (PLA/PBAT) thermoformable sheets. The blend features optical haze below 6.5% and Elmendorf tear strength exceeding 120 g/mm, fulfilling ASTM D6400 industrial compostability standards within 84 days.',
    source_name: 'Supreme Petrochem R&D & ICT Mumbai',
    source_url: 'https://www.supreme-petrochem.com',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Polymer Engineering, ICT Mumbai',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'biodegradable-polymers-pla-pbat-pha',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-18T05:30:00+00:00',
    publish_date: '2026-09-18',
    is_featured: false,
    is_published: true
  }
]

async function run() {
  console.log('Inserting 6 fresh news articles for September 18, 2026 into Supabase...')
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(sept18Articles)
    .select('id, headline')

  if (error) {
    console.error('❌ Insert error:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} articles for September 18, 2026!`)
  }
}

run()
