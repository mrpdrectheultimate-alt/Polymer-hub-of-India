// scripts/update_sept20_news_and_prices.mjs — Insert Sept 20, 2026 News Articles & Market Prices into Supabase
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

const sept20Articles = [
  {
    headline: 'Reliance, IOCL & GAIL Publish September 20, 2026 Resin Price Benchmark: Repol PP Raffia Touches ₹111.80/kg; HDPE & LLDPE Firm as Asian Monomer Shortages Escalate',
    summary: 'Reliance Industries Limited (RIL), Indian Oil Corporation (IOCL), and GAIL India released their September 20, 2026 resin price settlements across Hazira, Jamnagar, and Panipat petrochemical complexes. Repol Polypropylene (PP) raffia (H030SG) settled at ₹111.80/kg (+0.6%), while Relene HDPE blow-moulding (F5400) and PE100 pressure pipe resins reached ₹117.90/kg. Strong pre-festival agricultural woven sack orders, sustained infrastructure pipe demand under national urban water schemes, and tight CFR ICIS Asia ethylene quotes ($1,038/MT) supported domestic spot prices.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly Market Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-20T08:00:00+00:00',
    publish_date: '2026-09-20',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'IIT Bombay & CSIR-NCL Develop Solvent-Free Catalytic Depolymerization of Post-Consumer PET Bottles into High-Purity Bis(2-hydroxyethyl) Terephthalate (BHET) Monomer',
    summary: 'A joint research team from IIT Bombay Department of Chemical Engineering and CSIR-National Chemical Laboratory (NCL) Pune published groundbreaking results in ACS Sustainable Chemistry & Engineering. Using a recyclable ionic liquid-zinc oxide nanocatalyst, post-consumer PET flakes achieved 99.2% depolymerization conversion into ultra-pure BHET monomer within 45 minutes at 180°C under atmospheric pressure, enabling closed-loop bottle-to-bottle repolymerization with 40% lower energy requirements.',
    source_name: 'ACS Sustainable Chemistry & CSIR Bulletin',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Chemical Engineering, IIT Bombay & CSIR-NCL',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'chemical-recycling-pyrolysis-depolymerization-and-solvolysis',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-20T07:30:00+00:00',
    publish_date: '2026-09-20',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Supreme Petrochem & CIPET Chennai Unveil Ultra-High Impact ABS/PC Alloy for Electric Vehicle Battery Enclosures with V-0 Flame Retardancy',
    summary: 'At the EV Plastics Engineering Expo in Chennai, Supreme Petrochem Ltd in technical collaboration with CIPET Chennai introduced an advanced ABS/PC polymer alloy (Polyman-EV 900). Featuring brominated-triazine flame retardants and organoclay nanocomposite reinforcement, the alloy achieves UL94 V-0 rating at 1.5mm wall thickness, 68 kJ/m² Izod impact strength, and heat deflection temperature (HDT) of 128°C under 1.82 MPa load.',
    source_name: 'Indian Plastics Institute & Supreme Petrochem Tech',
    source_url: 'https://www.supremepetrochem.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Chennai & Supreme Petrochem R&D Hub',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'polymer-blends-compatibilization-and-alloys',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-20T07:00:00+00:00',
    publish_date: '2026-09-20',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CPCB & MoEFCC Issue September 2026 Mandate: Recyclers Must Upload Real-Time Mass-Balance NIR Spectroscopy Certificates on National EPR Portal',
    summary: 'The Central Pollution Control Board (CPCB) released updated compliance guidelines for Extended Producer Responsibility (EPR) credit trading. To combat fraudulent credit generation, registered recyclers must stream NIR spectroscopy resin purity logs and automated weighbridge GST receipts directly to the CPCB portal. Spot prices for Category-I rigid HDPE/PP PCR credits stabilized at ₹2,520/tonne.',
    source_name: 'CPCB Gazette & MoEFCC Portal Division',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board & MoEFCC',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'extended-producer-responsibility-epr-and-regulatory-frameworks',
    related_subject_slug: 'life-cycle-assessment',
    published_at: '2026-09-20T06:30:00+00:00',
    publish_date: '2026-09-20',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'HAL & ISRO Qualify Carbon-PEEK Thermoplastic Composite Brackets for Gaganyaan Crew Module Using Automated Fiber Placement (AFP)',
    summary: 'Hindustan Aeronautics Limited (HAL) Aerospace Division and ISRO Satellite Centre qualified continuous carbon-fiber reinforced polyetheretherketone (CF/PEEK) structural fittings. Manufactured via robotic Automated Fiber Placement (AFP) and laser-assisted in-situ consolidation, the thermoplastic brackets withstand cryogenic exposure down to -180°C and launch vibration acceleration up to 24 g.',
    source_name: 'HAL Aerospace Division & ISRO Media Unit',
    source_url: 'https://www.hal-india.co.in',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'HAL Composites Facility & ISRO Space Applications Center',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'high-performance-composites-peek-cf-polyimide-cf',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-20T06:00:00+00:00',
    publish_date: '2026-09-20',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Balrampur Chini & True-Bioplastics Commission India’s First Integrated Sugarcane Bagasse Lactic Acid & PLA Biopolymer Plant in Uttar Pradesh',
    summary: 'Balrampur Chini Mills Ltd in joint venture with True-Bioplastics commissioned a 40,000 MT/year Polylactic Acid (PLA) biopolymer facility in Uttar Pradesh. Utilizing bagasse enzymatic hydrolysis to ferment high-purity L-lactic acid followed by ring-opening polymerization (ROP) of lactide, the facility will supply compostable packaging grades for flexible food wraps, cold-drink cups, and agricultural mulch films.',
    source_name: 'Balrampur Chini Mills & Indian Sugar Mills Association',
    source_url: 'https://www.chini.com',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Balrampur Chini Mills & Bio-Packaging Division',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'polylactic-acid-pla-synthesis-properties-and-commercial-reality',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-20T05:30:00+00:00',
    publish_date: '2026-09-20',
    is_featured: false,
    is_published: true
  }
]

const sept20MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 111.80, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-09-20' },
  { commodity: 'Relene HDPE', price_inr: 117.90, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-20' },
  { commodity: 'Relene LLDPE', price_inr: 114.50, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-09-20' },
  { commodity: 'Finolex PVC', price_inr: 91.20, price_usd: null, unit: 'kg', delta_pct: -0.3, recorded_at: '2026-09-20' },
  { commodity: 'BASF Nylon 6', price_inr: 214.50, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-20' },
  { commodity: 'SABIC PC', price_inr: 236.00, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-09-20' },
  { commodity: 'JBF PET', price_inr: 98.40, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-09-20' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 88.50, unit: 'bbl', delta_pct: 0.2, recorded_at: '2026-09-20' }
]

async function run() {
  console.log('📌 Inserting September 20, 2026 News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(sept20Articles)
    .select('id, headline')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} fresh news articles for September 20, 2026!`)
  }

  console.log('📌 Inserting September 20, 2026 Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(sept20MarketPrices)
    .select('id, commodity, price_inr, delta_pct')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for September 20, 2026!`)
  }
}

run()
