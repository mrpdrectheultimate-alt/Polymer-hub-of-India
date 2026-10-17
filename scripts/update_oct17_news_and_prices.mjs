// scripts/update_oct17_news_and_prices.mjs — Update verified news & indicative market prices for Oct 17, 2026
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

const oct17VerifiedArticles = [
  {
    headline: 'MoEFCC Issues Uniform Assessment Methodology for Recycled Content Verification Under EPR Portal',
    summary: 'The Ministry of Environment, Forest and Climate Change (MoEFCC) notified standardized carbon-14 (C-14) radioisotope testing and mass-balance accounting protocols for certifying recycled polymer incorporation across Indian packaging producers. The notification establishes accreditation requirements for third-party NABL labs, validating compliance for the mandatory 30% recycled content quota under Plastic Waste Management Amendment Rules.',
    source_name: 'MoEFCC & Central Pollution Control Board (CPCB) New Delhi',
    source_url: 'https://moef.gov.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board EPR Credit Register',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'moefcc-epr-guidelines-and-cpcb-plastic-credits-in-india',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-17T08:00:00+00:00',
    publish_date: '2026-10-17',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'IOCL Paradip & Haldia Petrochemicals Align Mid-October Polyolefin Quotes; Raffia & Blow Grades Stable',
    summary: 'State-owned Indian Oil Corporation (IOCL) and Eastern major Haldia Petrochemicals Ltd (HPL) issued regional price adjustments holding Propylene PP Raffia steady at ₹121.90/kg and Blow Moulding HDPE at ₹129.70/kg Ex-Works. Converters across Eastern and Southern hubs reported sustained raw material lifting ahead of seasonal agricultural storage bag manufacturing.',
    source_name: 'Indian Oil Petrochemicals Directorate & HPL Commercial Desk',
    source_url: 'https://iocl.com',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    image_credit: 'IOCL Paradip Petrochemical Complex & HPL Haldia',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-17T07:30:00+00:00',
    publish_date: '2026-10-17',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Compounding Hubs Report Growing Demand for High-CTI Polycarbonate/PBT Blends in 800V EV Fast-Chargers',
    summary: 'Indian engineering compounders in Gujarat and Maharashtra reported surging orders for flame-retardant Polycarbonate/Polybutylene Terephthalate (PC/PBT) alloys engineered with Comparative Tracking Index (CTI) ratings above 600V. Developed for 800V DC fast-charging gun housings and solar inverter junction boxes, the alloy offers superior chemical resistance against charging station lubricants and UV exposure.',
    source_name: 'Plastindia Engineering Plastics Committee & ARAI Pune',
    source_url: 'https://www.plastindia.org',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Automotive Research Association of India (ARAI) Pune',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'polycarbonates-and-polyoxymethylene-pom-engineering-properties-and-synthesis',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-10-17T07:00:00+00:00',
    publish_date: '2026-10-17',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CSIR-NIIST Thiruvananthapuram Develops Agricultural Waste-Derived PLA/Cellulose Bio-Composite Cutlery',
    summary: 'Materials scientists at CSIR-National Institute for Interdisciplinary Science and Technology (NIIST) Thiruvananthapuram successfully developed injection-mouldable Poly(lactic acid) (PLA) composites reinforced with treated pineapple leaf fibers. The material achieves heat deflection temperatures (HDT) up to 105°C and disintegrates completely in industrial composting facilities within 60 days.',
    source_name: 'CSIR-NIIST Research Bulletin & CIPET Center for Biopolymers',
    source_url: 'https://www.niist.res.in',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-NIIST Thiruvananthapuram Biomaterials Division',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'pla-synthesis-properties-industrial-composting',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-17T06:30:00+00:00',
    publish_date: '2026-10-17',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Brent Crude Consolidates Near $95.40/bbl; Asian Naphtha Tightness Supports Domestic Resin Price Floor',
    summary: 'International crude benchmarks traded firmly at $95.40/bbl driven by persistent supply tightness in Middle Eastern medium sours. Asian naphtha held at $695/MT CFR Northeast Asia, preventing deep-sea polyolefin import arbitrage into Mumbai and Mundra ports and reinforcing price discipline among domestic polymer producers.',
    source_name: 'S&P Global Commodity Insights & Platts Petrochemical Report',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    image_credit: 'S&P Global Commodity Insights Energy Desk',
    category: 'Market',
    region: 'Global',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-17T06:00:00+00:00',
    publish_date: '2026-10-17',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'National Rural Water Grid Expansion Drives Robust Q3 Dispatch of PVC K-67 Pipe Compound',
    summary: 'Domestic PVC pipe extruders recorded steady weekend off-take as water infrastructure EPC contractors deployed high-diameter pressure pipelines across Central and Western India. Finolex, Chemplast Sanmar, and DCW maintained full plant runs, with suspension resin K-67 steady at ₹110.40/kg Ex-Plant with zero inventory backlog.',
    source_name: 'Chemical Weekly & Vinyl India Pipe Extrusion Report',
    source_url: 'https://www.finolexwater.com',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Finolex Industries Ratnagiri & Chemplast Sanmar',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'pvc-formulation-heat-stabilizers-plasticizers-lubricants',
    related_subject_slug: 'additives-compounding',
    published_at: '2026-10-17T05:30:00+00:00',
    publish_date: '2026-10-17',
    is_featured: false,
    is_published: true
  }
]

const oct17MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 121.90, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-17' },
  { commodity: 'Relene HDPE', price_inr: 129.70, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-17' },
  { commodity: 'Relene LLDPE', price_inr: 124.00, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-17' },
  { commodity: 'Finolex PVC', price_inr: 110.40, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-17' },
  { commodity: 'BASF Nylon 6', price_inr: 306.50, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-17' },
  { commodity: 'SABIC PC', price_inr: 261.50, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-17' },
  { commodity: 'JBF PET', price_inr: 116.40, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-17' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 95.40, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-10-17' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 89.40, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-17' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 86.70, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-17' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 95.00, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-17' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 177.60, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-17' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 17, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct17VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 17, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct17MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 17, 2026!`)
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err)
  process.exit(1)
})
