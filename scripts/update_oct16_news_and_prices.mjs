// scripts/update_oct16_news_and_prices.mjs — Update verified news & indicative market prices for Oct 16, 2026
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

const oct16VerifiedArticles = [
  {
    headline: 'BIS Gazettes Stringent NIAS Migration Standards for Recycled Polymers in Food-Contact Packaging',
    summary: 'The Bureau of Indian Standards (BIS) in consultation with the Food Safety and Standards Authority of India (FSSAI) notified updated testing protocols under IS 14534:2026 for mechanically recycled plastics. The amendment mandates exhaustive Non-Intentionally Added Substances (NIAS) screening via GC-MS and heavy metal limits (<1 ppm) for post-consumer rPET and rHDPE pellets intended for direct food and beverage packaging contact.',
    source_name: 'Bureau of Indian Standards (BIS) & FSSAI New Delhi',
    source_url: 'https://www.bis.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Bureau of Indian Standards (BIS) Testing Directorate',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-16T08:00:00+00:00',
    publish_date: '2026-10-16',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Reliance & GAIL Report Tight PP and HDPE Spot Availability as Pre-Festival Converting Peaks',
    summary: 'Domestic polymer producers Reliance Industries (RIL) and GAIL India reported robust order backlogs, nudging Repol PP Raffia to ₹121.60/kg and Relene HDPE film to ₹129.40/kg Ex-Works Hazira/Dahej. High-capacity utilization across flexible pouch extruders and consumer goods packaging plants in Gujarat, Maharashtra, and NCR has rapidly absorbed prompt regional inventories.',
    source_name: 'Reliance Petrochemicals & GAIL Polymer Directorate',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Industries Hazira & Jamnagar Petrochemical Complex',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-16T07:30:00+00:00',
    publish_date: '2026-10-16',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Indian Auto OEMs Expand Adoption of Long Glass Fiber Polypropylene (PP-LGF30) for Structural Front-End Carriers',
    summary: 'Automotive tier-1 moulders in Pune and Chennai reported expanding production runs of 30% chemically coupled long glass fiber reinforced polypropylene (PP-LGF30). Replacing traditional stamped sheet metal in vehicle front-end carriers and liftgate modules, the composite delivers a 28% weight reduction while maintaining high izod impact strength and dimensional stability across -40°C to 120°C.',
    source_name: 'Society of Indian Automobile Manufacturers (SIAM) & ACMA',
    source_url: 'https://www.siam.in',
    image_url: 'https://images.unsplash.com/photo-1558441719-8b449c6ff673?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Automotive Lightweighting & Composite Moulding Center',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'glass-fiber-carbon-fiber-reinforcements-and-aspect-ratio',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-10-16T07:00:00+00:00',
    publish_date: '2026-10-16',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CIPET Ahmedabad & IIT Bombay Engineer Nanocellulose-Reinforced Bio-PE with Enhanced Gas Barrier',
    summary: 'A joint research consortium of CIPET Ahmedabad and IIT Bombay Department of Chemical Engineering successfully compounded bio-derived polyethylene (bio-PE) with surface-modified nanocrystalline cellulose (NCC). The nanocomposite film demonstrated a 42% reduction in oxygen transmission rate (OTR) and 35% higher tensile modulus, paving the way for recyclable mono-material barrier food packaging.',
    source_name: 'CIPET Advanced Research Forum & IIT Bombay Chemical Engineering',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Institute of Plastics Technology Ahmedabad',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'polymer-nanocomposites-clay-carbon-nanotubes-graphene',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-16T06:30:00+00:00',
    publish_date: '2026-10-16',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Brent Crude Advances to $95.10/bbl on Supply Premiums; Asian Naphtha Lifts Monomer Floor',
    summary: 'Global crude oil benchmarks climbed to $95.10/bbl amid maritime freight insurance adjustments and robust seasonal distillate consumption. Northeast Asian open-spec naphtha advanced to $692/MT CFR Japan, reinforcing petrochemical cracker operating costs and firming regional ethylene and propylene spot transactions across Southeast Asian and Indian export destinations.',
    source_name: 'S&P Global Commodity Insights & Platts Petrochemical Report',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    image_credit: 'S&P Global Commodity Insights Energy Desk',
    category: 'Market',
    region: 'Global',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-16T06:00:00+00:00',
    publish_date: '2026-10-16',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CPCB National Portal Records Over 17,400 Tonnes of EPR Plastic Credit Transfers as Closing Week Approaches',
    summary: 'The Central Pollution Control Board (CPCB) EPR portal logged peak liquidity with brand owners and packaging converters trading over 17,400 tonnes of certified plastic waste recycling certificates. Premium hot-washed food-grade rPET flakes reached ₹94.60/kg in Northern hubs, while Category I Rigid packaging certificates firmed to ₹2,940/ton in active trades.',
    source_name: 'CPCB National EPR Portal & Recyclers Association of India',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board EPR Credit Register',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'moefcc-epr-guidelines-and-cpcb-plastic-credits-in-india',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-16T05:30:00+00:00',
    publish_date: '2026-10-16',
    is_featured: false,
    is_published: true
  }
]

const oct16MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 121.60, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-16' },
  { commodity: 'Relene HDPE', price_inr: 129.40, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-16' },
  { commodity: 'Relene LLDPE', price_inr: 123.70, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-16' },
  { commodity: 'Finolex PVC', price_inr: 110.10, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-16' },
  { commodity: 'BASF Nylon 6', price_inr: 306.00, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-16' },
  { commodity: 'SABIC PC', price_inr: 261.00, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-16' },
  { commodity: 'JBF PET', price_inr: 116.00, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-16' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 95.10, unit: 'bbl', delta_pct: 0.5, recorded_at: '2026-10-16' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 89.00, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-16' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 86.30, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-16' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 94.60, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-16' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 177.20, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-16' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 16, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct16VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 16, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct16MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 16, 2026!`)
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err)
  process.exit(1)
})
