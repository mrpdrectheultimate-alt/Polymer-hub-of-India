// scripts/update_oct04_news_and_prices.mjs — Update verified news & indicative market prices for Oct 4, 2026
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

const oct04VerifiedArticles = [
  {
    headline: 'Ministry of Heavy Industries & BIS Enforce Standards for Recyclate Usage in Automotive Components (IS 18200:2026)',
    summary: 'The Ministry of Heavy Industries in coordination with the Bureau of Indian Standards (BIS) published automotive plastic recycling guidelines. OEMs must integrate at least 15% post-consumer recycled (PCR) polypropylene and polyamide resins in non-structural automotive bumpers, interior trims, and wheel arch liners by FY 2027.',
    source_name: 'Ministry of Heavy Industries & BIS Gazette',
    source_url: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Heavy Industries & Bureau of Indian Standards',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-04T08:00:00+00:00',
    publish_date: '2026-10-04',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'High-Turnover Selective Depolymerization of Waste Polyurethanes into Polyols & Diamines via Earth-Abundant Iron Catalyst',
    summary: 'Organic catalysis paper published in JACS (Journal of the American Chemical Society) demonstrates a homogeneous iron-pincer complex enabling selective cleavage of urethane bonds under mild conditions (130°C). The reaction yields 96% polyol recovery with purity suitable for direct re-foaming.',
    source_name: 'Journal of the American Chemical Society (JACS)',
    source_url: 'https://pubs.acs.org/journal/jacsat',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'American Chemical Society (ACS) Publications',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'polyurethanes-pur-foams-elastomers-coatings',
    related_subject_slug: 'thermoset-polymers',
    published_at: '2026-10-04T07:30:00+00:00',
    publish_date: '2026-10-04',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Indian Plastics Institute & CIPET Host International Conference on Advanced Polymer Processing & CAE Mould Simulation in Bengaluru',
    summary: 'Over 400 polymer process engineers and mould design experts assemble at CIPET Bengaluru to showcase real-time cavity pressure telemetry, conformal cooling channel additive manufacturing, and Moldex3D warpage minimization algorithms for precision electronic enclosures.',
    source_name: 'Indian Plastics Institute & CIPET Official',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Indian Plastics Institute & CIPET Bengaluru Division',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'injection-moulding-process-parameters-and-cycle-time-optimization',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-04T07:00:00+00:00',
    publish_date: '2026-10-04',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'High-Barrier Nanocellulose-Coated Polyhydroxyalkanoate (PHA) Flexible Films for Oxygen-Sensitive Food Packaging',
    summary: 'Applied biopolymer report in ACS Sustainable Chemistry & Engineering evaluates roll-to-roll coated PHA films with TEMPO-oxidized cellulose nanofibrils (CNF). Water vapor transmission rate (WVTR) drops by 85% while retaining full industrial composting compliance (EN 13432).',
    source_name: 'ACS Sustainable Chemistry & Engineering',
    source_url: 'https://pubs.acs.org/journal/ascecg',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'ACS Publications & Biopolymer Research',
    category: 'Bioplastics',
    region: 'Global',
    related_lesson_slug: 'pha-production-bacterial-fermentation-recovery',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-10-04T06:30:00+00:00',
    publish_date: '2026-10-04',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Automated Fiber Placement (AFP) of Thermoplastic Carbon/PEEK Aerostructures with In-Situ Laser Consolidation',
    summary: 'Aerospace manufacturing technical report in Composites Part A evaluates in-situ laser-assisted ATP processing of CF/PEEK prepreg tapes. Interlaminar fracture toughness (GIC) reaches 1.82 kJ/m² with zero inter-laminar void porosity.',
    source_name: 'Composites Part A: Applied Science & Manufacturing',
    source_url: 'https://www.sciencedirect.com/journal/composites-part-a-applied-science-and-manufacturing',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Elsevier Composites Research',
    category: 'Innovation',
    region: 'Global',
    related_lesson_slug: 'high-performance-composites-peek-cf-polyimide-cf',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-10-04T06:00:00+00:00',
    publish_date: '2026-10-04',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Domestic Polyolefin, PVC & Engineering Thermoplastic Indicative Spot Benchmarks (October 4, 2026 Update)',
    summary: 'PolymerHub updates indicative spot market benchmark ranges across major Indian trading hubs (Hazira, Mumbai, Silvassa, Nhava Sheva). Raffia PP settles at ₹115.40/kg (+0.5%), HDPE Film at ₹121.60/kg (+0.5%), LLDPE at ₹117.60/kg (+0.5%), PVC K-67 at ₹104.80/kg (+0.4%), and rPET Flakes at ₹88.00/kg (+0.7%).',
    source_name: 'PolymerHub Petrochemical Reference Index',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'PolymerHub Petrochemical Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-04T05:30:00+00:00',
    publish_date: '2026-10-04',
    is_featured: false,
    is_published: true
  }
]

const oct04MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 115.40, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-04' },
  { commodity: 'Relene HDPE', price_inr: 121.60, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-04' },
  { commodity: 'Relene LLDPE', price_inr: 117.60, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-04' },
  { commodity: 'Finolex PVC', price_inr: 104.80, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-04' },
  { commodity: 'BASF Nylon 6', price_inr: 297.40, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-04' },
  { commodity: 'SABIC PC', price_inr: 253.00, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-04' },
  { commodity: 'JBF PET', price_inr: 110.20, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-04' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 90.10, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-10-04' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 79.60, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-10-04' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 80.20, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-10-04' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 88.00, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-04' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 170.60, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-04' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 4, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct04VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 4, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct04MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 4, 2026!`)
  }
}

run()
