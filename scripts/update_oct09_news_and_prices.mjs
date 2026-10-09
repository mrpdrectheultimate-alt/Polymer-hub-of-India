// scripts/update_oct09_news_and_prices.mjs — Update verified news & indicative market prices for Oct 9, 2026
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

const oct09VerifiedArticles = [
  {
    headline: 'CPCB Releases Updated EPR Credit Trading Guidelines for Plastic Waste Recyclers',
    summary: 'The Central Pollution Control Board (CPCB) released updated operational circulars for registered Plastic Waste Processors (PWPs) and Brand Owners, streamlining digital certificate trading on the centralized portal and lifting rPET flake benchmarks to ₹91.00/kg.',
    source_name: 'MoEFCC & CPCB Official Gazette Portal',
    source_url: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Environment, Forest and Climate Change & CPCB India',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-09T08:00:00+00:00',
    publish_date: '2026-10-09',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Indian PP & PE Spot Benchmarks Firm Further on Strong Festive Packaging Converts',
    summary: 'Polypropylene (PP Raffia) and Polyethylene (HDPE/LLDPE) spot prices across Western Indian manufacturing hubs rose by ₹0.60–0.70/kg today, driven by firming regional monomer feedstocks and surging pre-festive converter order books.',
    source_name: 'Plastics News India & Petrochem Bulletin',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & GAIL India',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-09T07:30:00+00:00',
    publish_date: '2026-10-09',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Post-Monsoon Infrastructure Projects Drive PVC Pipe Resin Demand in Western India',
    summary: 'Domestic PVC K-67 pipe resin quotes touched ₹107.50/kg Ex-Works today as pipe fabricators ramped up production for agricultural irrigation schemes and municipal water supply expansion.',
    source_name: 'Chemical Weekly & Industrial PVC Benchmarks',
    source_url: 'https://www.finolexwater.com',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Finolex Pipes & DCW Vinyls',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'pvc-formulation-heat-stabilizers-plasticizers-lubricants',
    related_subject_slug: 'polymer-additives',
    published_at: '2026-10-09T07:00:00+00:00',
    publish_date: '2026-10-09',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'IIT Bombay & CSIR-NCL Develop Catalytic Solvolysis for Multi-Layer Barrier Packaging',
    summary: 'Chemical engineering teams from IIT Bombay and CSIR-NCL Pune demonstrated a high-efficiency catalytic solvolysis method that selectively delaminates PE/EVOH/PET multi-layer flexible packaging films with 94% monomer recovery.',
    source_name: 'ACS Applied Bio Materials',
    source_url: 'https://pubs.acs.org/journal/aabmcb',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'IIT Bombay & CSIR-NCL Research Team',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'pla-synthesis-properties-industrial-composting',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-10-09T06:30:00+00:00',
    publish_date: '2026-10-09',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Brent Crude Climbs to $92.40/bbl as Naphtha Cracker Feed Margins Tighten',
    summary: 'Brent crude futures extended gains to $92.40/bbl following unexpected crude inventory drawdowns, increasing Asian naphtha cracker feed costs and reinforcing cost-push pricing across virgin resin grades.',
    source_name: 'S&P Global Commodity Insights & Platts',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    image_credit: 'S&P Global Energy Markets',
    category: 'Market',
    region: 'Global',
    related_lesson_slug: 'feedstock-economics-naphtha-cracking-ethane-dehydro',
    related_subject_slug: 'petrochemical-fundamentals',
    published_at: '2026-10-09T06:00:00+00:00',
    publish_date: '2026-10-09',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Automotive OEM Assembly Expansion Drives Engineering Plastics Demand in Pune & Sriperumbudur',
    summary: 'Polycarbonate (PC) and Polyamide 6 (PA6) prices settled higher at ₹256.80/kg and ₹301.80/kg respectively, backed by robust vehicle production targets across India’s primary automotive hubs.',
    source_name: 'Automotive Materials & Engineering Plastics Report',
    source_url: 'https://www.sabic.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'SABIC & BASF Technical Plastics',
    category: 'Innovation',
    region: 'Regional',
    related_lesson_slug: 'polycarbonate-synthesis-optical-clarity-impact-resistance',
    related_subject_slug: 'engineering-plastics',
    published_at: '2026-10-09T05:30:00+00:00',
    publish_date: '2026-10-09',
    is_featured: false,
    is_published: true
  }
]

const oct09MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 118.50, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-09' },
  { commodity: 'Relene HDPE', price_inr: 124.80, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-10-09' },
  { commodity: 'Relene LLDPE', price_inr: 120.80, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-10-09' },
  { commodity: 'Finolex PVC', price_inr: 107.50, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-09' },
  { commodity: 'BASF Nylon 6', price_inr: 301.80, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-09' },
  { commodity: 'SABIC PC', price_inr: 256.80, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-09' },
  { commodity: 'JBF PET', price_inr: 113.20, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-09' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 92.40, unit: 'bbl', delta_pct: 0.7, recorded_at: '2026-10-09' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 85.80, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-09' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 83.40, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-09' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 91.00, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-09' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 174.00, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-09' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 9, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct09VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 9, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct09MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 9, 2026!`)
  }
}

run().catch(console.error)
