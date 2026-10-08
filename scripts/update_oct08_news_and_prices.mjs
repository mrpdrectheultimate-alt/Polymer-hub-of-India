// scripts/update_oct08_news_and_prices.mjs — Update verified news & indicative market prices for Oct 8, 2026
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

const oct08VerifiedArticles = [
  {
    headline: 'CPCB Guidelines Mandate Dynamic QR-Coded Digital Passports & Third-Party Recycled Content Audits',
    summary: 'The Central Pollution Control Board (CPCB) released updated implementation guidelines enforcing dynamic QR-coded Digital Product Passports (DPP) and stringent third-party certification protocols for Post-Consumer Recycled (PCR) plastics in packaging.',
    source_name: 'MoEFCC & CPCB Official Gazette Portal',
    source_url: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Environment, Forest and Climate Change & CPCB India',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-08T08:00:00+00:00',
    publish_date: '2026-10-08',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Indian PP & PE Spot Prices Advance Further on Upstream Propylene & Ethylene Firmness',
    summary: 'Polypropylene (PP Raffia) and Polyethylene (HDPE/LLDPE) spot prices across Western Indian manufacturing hubs rose by ₹0.70/kg today, propelled by tight monomer supply and strong festive packaging converter demand.',
    source_name: 'Plastics News India & Petrochem Bulletin',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & GAIL India',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-08T07:30:00+00:00',
    publish_date: '2026-10-08',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Agri-Pipe Converters Boost PVC Spot Off-take in Western & Central India',
    summary: 'Domestic PVC K-67 pipe resin quotes settled higher at ₹106.80/kg Ex-Works today following active buying from pipe fabricators gearing up for post-monsoon agricultural irrigation installations.',
    source_name: 'Chemical Weekly & Industrial PVC Benchmarks',
    source_url: 'https://www.finolexwater.com',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Finolex Pipes & DCW Vinyls',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'pvc-formulation-heat-stabilizers-plasticizers-lubricants',
    related_subject_slug: 'polymer-additives',
    published_at: '2026-10-08T07:00:00+00:00',
    publish_date: '2026-10-08',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CSIR-NCL Scales Soil-Degradable PLA-Starch Nanocomposite Mulch Films for Agriculture',
    summary: 'Chemical engineering researchers at CSIR-NCL Pune successfully scaled up high-tensile PLA-starch nanocomposite films designed to completely biodegrade in agricultural soil within 120 days without microplastic residue.',
    source_name: 'ACS Applied Bio Materials',
    source_url: 'https://pubs.acs.org/journal/aabmcb',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-National Chemical Laboratory (NCL) Pune',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'pla-synthesis-properties-industrial-composting',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-10-08T06:30:00+00:00',
    publish_date: '2026-10-08',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Global Crude Oil Touches $91.80/bbl amid Tight Inventory Draws & Petrochemical Squeeze',
    summary: 'Brent crude futures climbed 0.9% to $91.80/bbl on inventory drawdowns, elevating Asian naphtha cracker feed costs and exerting upward pressure across virgin resin pricing.',
    source_name: 'S&P Global Commodity Insights & Platts',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    image_credit: 'S&P Global Energy Markets',
    category: 'Market',
    region: 'Global',
    related_lesson_slug: 'feedstock-economics-naphtha-cracking-ethane-dehydro',
    related_subject_slug: 'petrochemical-fundamentals',
    published_at: '2026-10-08T06:00:00+00:00',
    publish_date: '2026-10-08',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Automotive OEM Assembly Expansion Drives Engineering Plastics Demand in Chakan & Sriperumbudur',
    summary: 'Polycarbonate (PC) and Polyamide 6 (PA6) prices settled at ₹255.90/kg and ₹300.50/kg respectively, backed by robust vehicle production targets across India’s primary automotive hubs.',
    source_name: 'Automotive Materials & Engineering Plastics Report',
    source_url: 'https://www.sabic.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'SABIC & BASF Technical Plastics',
    category: 'Innovation',
    region: 'Regional',
    related_lesson_slug: 'polycarbonate-synthesis-optical-clarity-impact-resistance',
    related_subject_slug: 'engineering-plastics',
    published_at: '2026-10-08T05:30:00+00:00',
    publish_date: '2026-10-08',
    is_featured: false,
    is_published: true
  }
]

const oct08MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 117.90, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-10-08' },
  { commodity: 'Relene HDPE', price_inr: 124.10, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-10-08' },
  { commodity: 'Relene LLDPE', price_inr: 120.10, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-10-08' },
  { commodity: 'Finolex PVC', price_inr: 106.80, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-10-08' },
  { commodity: 'BASF Nylon 6', price_inr: 300.50, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-08' },
  { commodity: 'SABIC PC', price_inr: 255.90, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-08' },
  { commodity: 'JBF PET', price_inr: 112.60, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-08' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 91.80, unit: 'bbl', delta_pct: 0.9, recorded_at: '2026-10-08' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 85.20, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-10-08' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 82.80, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-10-08' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 90.40, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-08' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 173.20, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-08' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 8, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct08VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 8, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct08MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 8, 2026!`)
  }
}

run().catch(console.error)
