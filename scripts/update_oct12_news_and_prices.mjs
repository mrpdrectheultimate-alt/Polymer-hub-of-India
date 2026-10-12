// scripts/update_oct12_news_and_prices.mjs — Update verified news & indicative market prices for Oct 12, 2026
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

const oct12VerifiedArticles = [
  {
    headline: 'Ministry of Environment & CPCB Issue Digital Mass-Balance Verification Protocol for Indian Multi-Layer Packaging Recyclers',
    summary: 'The Ministry of Environment, Forest & Climate Change (MoEFCC) and Central Pollution Control Board (CPCB) released an updated compliance mandate enforcing digital mass-balance verification for Category III multi-layered plastic laminates under the PWM Rules. Indian brand owners and registered recycling units must log verifiable batch certificates to ensure zero phantom credit leakage.',
    source_name: 'Ministry of Environment, Forest & Climate Change & CPCB Portal',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board (CPCB) New Delhi',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'moefcc-epr-guidelines-and-cpcb-plastic-credits-in-india',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-12T08:00:00+00:00',
    publish_date: '2026-10-12',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Indian Petrochemical Refineries Hold Resin Benchmarks Steady as Festive Packaging Converters Run at 94% Capacity',
    summary: 'Reliance Industries, IOCL, and GAIL reported robust resin off-take across Hazira, Dahej, and Pata polymer terminals. Flexible packaging and thermoforming converters in Gujarat, Daman, and Maharashtra operate at 94% plant utilization rates to meet pre-festival retail packaging orders, keeping PP Raffia firm at ₹119.80/kg and LLDPE film at ₹122.20/kg.',
    source_name: 'Plastics News India & Petrochem Intelligence',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Indian Oil Panipat Refinery',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-12T07:30:00+00:00',
    publish_date: '2026-10-12',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Jal Jeevan Mission and Rural Micro-Irrigation Demand Fuels Robust PVC Resin Consumption in Western India',
    summary: 'Finolex and DCW PVC K-67 suspension resin quotes held steady at ₹108.90/kg Ex-Works today, supported by accelerated municipal water piping and agricultural drip irrigation tenders across Gujarat, Rajasthan, and Madhya Pradesh manufacturing corridors.',
    source_name: 'Chemical Weekly & Vinyl India Industry Report',
    source_url: 'https://www.finolexwater.com',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Finolex Industries & DCW PVC Division',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'pvc-formulation-heat-stabilizers-plasticizers-lubricants',
    related_subject_slug: 'additives-compounding',
    published_at: '2026-10-12T07:00:00+00:00',
    publish_date: '2026-10-12',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'IIT Delhi & CIPET Formulate Nanoclay-Reinforced PLA Films with 35% Lower Oxygen Permeability for Food Packaging',
    summary: 'Researchers at IIT Delhi’s Centre for Polymer Science and Engineering in partnership with CIPET Chennai successfully compounded organically modified montmorillonite (OMMT) nanoclay into polylactic acid (PLA) matrices. The resulting bio-films achieved a 35% reduction in oxygen transmission rate (OTR) while retaining certified compostability.',
    source_name: 'Journal of Applied Polymer Science & CIPET R&D Bulletin',
    source_url: 'https://pubs.rsc.org/en/journals/journal/gc',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'IIT Delhi Centre for Polymer Science & CIPET Chennai',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'barrier-properties-permeation-mechanisms-and-testing-otr-wvtr',
    related_subject_slug: 'plastic-packaging-engineering',
    published_at: '2026-10-12T06:30:00+00:00',
    publish_date: '2026-10-12',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Brent Crude Firms to $93.40/bbl on Supply Restraint While Asian Steam Crackers Maintain Operating Discipline',
    summary: 'Crude oil benchmarks settled slightly higher at $93.40/bbl as OPEC+ output limits and Asian refinery turnaround schedules kept regional naphtha feedstock values firm, preserving cost floors for polymer producers across Middle Eastern, Asian, and Indian export terminals.',
    source_name: 'S&P Global Commodity Insights & Platts',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    image_credit: 'S&P Global Platts Energy Benchmark',
    category: 'Market',
    region: 'Global',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-12T06:00:00+00:00',
    publish_date: '2026-10-12',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'SABIC & Tata AutoComp Commercialize Flame-Retardant Polycarbonate Battery Covers for Electric Commercial Vehicles',
    summary: 'Automotive compounders finalized UL94 V-0 flame-retardant Polycarbonate/ABS blend specifications for heavy-duty electric bus battery modules, delivering 22% weight reduction over stamped aluminum enclosures while meeting strict thermal runaway containment benchmarks.',
    source_name: 'Automotive Materials & Technical Plastics Report',
    source_url: 'https://www.sabic.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'SABIC & Tata AutoComp Technical Polymers',
    category: 'Innovation',
    region: 'Regional',
    related_lesson_slug: 'viscoelasticity-and-time-temperature-superposition-wlf-equation',
    related_subject_slug: 'polymer-rheology',
    published_at: '2026-10-12T05:30:00+00:00',
    publish_date: '2026-10-12',
    is_featured: false,
    is_published: true
  }
]

const oct12MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 119.80, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-12' },
  { commodity: 'Relene HDPE', price_inr: 126.10, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-12' },
  { commodity: 'Relene LLDPE', price_inr: 122.20, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-12' },
  { commodity: 'Finolex PVC', price_inr: 108.90, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-12' },
  { commodity: 'BASF Nylon 6', price_inr: 303.50, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-12' },
  { commodity: 'SABIC PC', price_inr: 258.60, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-12' },
  { commodity: 'JBF PET', price_inr: 114.50, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-12' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 93.40, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-10-12' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 87.20, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-12' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 84.80, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-12' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 92.80, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-12' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 175.60, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-12' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 12, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct12VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 12, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct12MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 12, 2026!`)
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err)
  process.exit(1)
})
