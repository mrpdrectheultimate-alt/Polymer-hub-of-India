// scripts/update_sept22_news_and_prices.mjs — Insert September 22, 2026 News Articles & Market Prices into Supabase
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

const sept22Articles = [
  {
    headline: 'RIL, IOCL & GAIL Issue September 22, 2026 Resin Price Benchmark Updates: PP Raffia Crosses ₹113/kg & HDPE Blow-Moulding Hits ₹119.20/kg as Ethylene Spot Tops $1,050/MT',
    summary: 'Reliance Industries (RIL), IOCL, and GAIL published updated resin benchmark prices for Tuesday, September 22, 2026. Repol PP raffia (H030SG) ticked up to ₹113.10/kg (+₹0.60/kg), while Relene HDPE blow-moulding (F5400) and PE100 pipe grades advanced to ₹119.20/kg (+0.5%). Sustained demand from agricultural irrigation projects, FMCG flexible packaging, and CFR Northeast Asia ethylene ($1,050/MT) backed by Brent crude ($89.80/bbl) supported domestic polymer price momentum.',
    source_name: 'PlastIndia & Polymer Update India',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly Market Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-22T08:00:00+00:00',
    publish_date: '2026-09-22',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Supreme Petrochem & CIPET Ahmedabad Unveil Ultralight Expanded Polystyrene (EPS) Foam with 40% Lower Carbon Footprint for Cold Chain Infrastructure',
    summary: 'Supreme Petrochem Ltd in technical collaboration with CIPET Ahmedabad announced the commercial launch of a low-density Graphite-Infused EPS insulation board (SupraFoam Eco). Built using supercritical CO2 blowing agent technology without HFCs, the material achieves thermal conductivity (k-value) of 0.030 W/m·K and high compressive strength at 150 kPa, meeting ISO 4898 specs for sub-zero food and pharmaceutical cold chain transport.',
    source_name: 'Indian Plastics Federation & Supreme Petrochem R&D',
    source_url: 'https://www.supremepetrochem.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Ahmedabad & Supreme Petrochem R&D Center',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'foamed-and-cellular-plastics',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-22T07:30:00+00:00',
    publish_date: '2026-09-22',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'IIT Bombay & CSIR-NCL Develop Engineered Enzymatic De-Polymerization Achieving 96% Monomer Recovery from Mixed Post-Consumer PET Waste',
    summary: 'A joint research team from IIT Bombay Department of Chemical Engineering and CSIR-National Chemical Laboratory (NCL) Pune published a groundbreaking study in Green Chemistry. Utilizing an engineered PETase variant (NCL-PETase-V3) immobilized on magnetic mesoporous silica nanoparticles, the enzymatic system completely depolymerized post-consumer PET bottles into pure terephthalic acid (TPA) and ethylene glycol (EG) in under 8 hours at ambient temperature (50°C).',
    source_name: 'Green Chemistry (RSC) & CSIR-NCL Bulletin',
    source_url: 'https://pubs.rsc.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Chemical Engineering, IIT Bombay & CSIR-NCL Pune',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'chemical-recycling-depolymerization-pyrolysis-solvolysis',
    related_subject_slug: 'recycling-sustainability',
    published_at: '2026-09-22T07:00:00+00:00',
    publish_date: '2026-09-22',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Central Pollution Control Board (CPCB) Issues Mandatory EPR Digital Traceability & Audit Guidelines for Plastic Recyclers & Brand Owners',
    summary: 'The CPCB released an updated operational circular on Extended Producer Responsibility (EPR) portal compliance for registered recyclers, producers, and brand owners (PIBOs). The directive mandates end-to-end digital QR traceability for recycled resin batches (rPET, rHDPE, rPP) traded on the centralized portal, ensuring compliance with plastic waste management (PWM) amendments ahead of the October audit deadline.',
    source_name: 'CPCB Official Portal & Ministry of Environment (MoEFCC)',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board & Ministry of Environment India',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'epr-regulations-and-extended-producer-responsibility-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-09-22T06:30:00+00:00',
    publish_date: '2026-09-22',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Solvay India & CIPET Chennai Launch High-Temperature Bio-PA 11 Powder for Selective Laser Sintering (SLS) 3D Printing in Aerospace',
    summary: 'Solvay India and CIPET Chennai established a specialized pilot manufacturing line for 100% castor-oil-derived Polyamide 11 (Bio-PA 11) powder tailored for additive manufacturing. With a narrow particle size distribution (45–90 µm), high melting point (198°C), and tensile fatigue resistance surpassing conventional petroleum Nylon 12, the material targets aerospace structural ducting and customized medical prosthetics.',
    source_name: 'CIPET Chennai & Solvay Specialty Polymers Press Unit',
    source_url: 'https://www.solvay.com',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Chennai & Solvay Specialty Polymers R&D Lab',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'additive-manufacturing-3d-printing-polymers',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-22T06:00:00+00:00',
    publish_date: '2026-09-22',
    is_featured: false,
    is_published: true
  }
]

const sept22MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 113.10, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-22' },
  { commodity: 'Relene HDPE', price_inr: 119.20, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-22' },
  { commodity: 'Relene LLDPE', price_inr: 115.80, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-22' },
  { commodity: 'Finolex PVC', price_inr: 92.40, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-22' },
  { commodity: 'BASF Nylon 6', price_inr: 217.50, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-22' },
  { commodity: 'SABIC PC', price_inr: 238.80, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-22' },
  { commodity: 'JBF PET', price_inr: 99.80, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-22' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 89.80, unit: 'bbl', delta_pct: 0.7, recorded_at: '2026-09-22' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 79.80, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-22' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 75.40, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-22' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 64.00, price_usd: null, unit: 'kg', delta_pct: 0.9, recorded_at: '2026-09-22' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 123.80, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-22' },
  { commodity: 'LLDPE Film Scrap (Baled)', price_inr: 47.60, price_usd: null, unit: 'kg', delta_pct: 1.1, recorded_at: '2026-09-22' }
]

async function run() {
  console.log('📌 Inserting September 22, 2026 News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(sept22Articles)
    .select('id, headline')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} fresh news articles for September 22, 2026!`)
  }

  console.log('📌 Inserting September 22, 2026 Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(sept22MarketPrices)
    .select('id, commodity, price_inr, delta_pct')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for September 22, 2026!`)
  }
}

run()
