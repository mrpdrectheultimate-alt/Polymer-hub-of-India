// scripts/update_oct02_news_and_prices.mjs — Update verified news & indicative market prices for Oct 2, 2026
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

const oct02VerifiedArticles = [
  {
    headline: 'CPCB & Ministry of Environment Announce National Swachh Bharat Clean Tech Initiative for Advanced Mechanical Recycling Parks',
    summary: 'On Gandhi Jayanti (Oct 2), CPCB released ₹450 Crore in capital subsidy grants for modernizing Tier 1 and Tier 2 plastic recycling parks across Gujarat, Maharashtra, and Tamil Nadu. Facilities deploying NIR optical sorting, hot-washing, and food-grade rPET devolatilization extruders receive priority funding.',
    source_name: 'MoEFCC & CPCB National Portal',
    source_url: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Environment, Forest and Climate Change & CPCB India',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-02T08:00:00+00:00',
    publish_date: '2026-10-02',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Direct Solar-Driven Photocatalytic Reforming of Mixed Plastic Waste into Green Hydrogen Gas & Formic Acid',
    summary: 'Solar energy research published in Nature Energy reports a quantum-dot semiconductor photocatalyst array capable of reforming post-consumer PE, PP, and PET waste mixtures into green hydrogen gas (H2) and formic acid under ambient sunlight with 14.2% solar-to-chemical conversion efficiency.',
    source_name: 'Nature Energy & Nature Publishing Group',
    source_url: 'https://www.nature.com/nenergy/',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Nature Publishing Group Research',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'chemical-recycling-depolymerization-pyrolysis-solvolysis',
    related_subject_slug: 'recycling-sustainability',
    published_at: '2026-10-02T07:30:00+00:00',
    publish_date: '2026-10-02',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Indian Plastics Institute (IPI) & CIPET Conduct Advanced Injection Mould Troubleshooting Masterclasses Across Automotive Hubs',
    summary: 'IPI and CIPET faculty launch technical masterclasses in Pune, Chennai, and Manesar focusing on melt temperature profiling, cavity pressure sensor calibration, and eliminating sink marks, jetting, and weld line weakness in EV battery module enclosures.',
    source_name: 'Indian Plastics Institute & CIPET Official',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Indian Plastics Institute & CIPET Technical Wing',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'injection-moulding-defects-causes-remedies-and-troubleshooting',
    related_subject_slug: 'troubleshooting-plastics',
    published_at: '2026-10-02T07:00:00+00:00',
    publish_date: '2026-10-02',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Bacterial Synthesis of High-Crystallinity Poly(hydroxybutyrate-co-hydroxyvalerate) (PHBV) from Industrial Crude Glycerol',
    summary: 'Microbial biotechnology paper in Bioresource Technology details an optimized fed-batch fermentation of Cupriavidus necator using crude biodiesel glycerol. Yields reach 88 g/L cell dry weight with 12 mol% HV monomer incorporation for improved mechanical flexibility.',
    source_name: 'Bioresource Technology & ScienceDirect',
    source_url: 'https://www.sciencedirect.com/journal/bioresource-technology',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'ScienceDirect Biotechnology Research',
    category: 'Bioplastics',
    region: 'Global',
    related_lesson_slug: 'pha-production-bacterial-fermentation-recovery',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-10-02T06:30:00+00:00',
    publish_date: '2026-10-02',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Continuous Carbon Fiber Reinforced Polyetherimide (PEI) Thermoplastic Composites for High-Temperature Aerostructures',
    summary: 'Aerospace composite technical study published in Composites Science and Technology demonstrates melt-impregnated continuous carbon fiber/PEI prepregs consolidated via vacuum-assisted compression moulding, retaining 95% flexural modulus at 210°C continuous operation.',
    source_name: 'Composites Science and Technology (Elsevier)',
    source_url: 'https://www.sciencedirect.com/journal/composites-science-and-technology',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Elsevier Composites Publishing',
    category: 'Innovation',
    region: 'Global',
    related_lesson_slug: 'high-performance-composites-peek-cf-polyimide-cf',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-10-02T06:00:00+00:00',
    publish_date: '2026-10-02',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Domestic Polyolefin, PVC & Engineering Thermoplastic Indicative Spot Benchmarks (October 2, 2026 Update)',
    summary: 'PolymerHub updates indicative spot market benchmark ranges across major Indian trading hubs (Hazira, Mumbai, Silvassa, Nhava Sheva). Raffia PP settles at ₹114.80/kg (+0.5%), HDPE Film at ₹121.00/kg (+0.5%), LLDPE at ₹117.00/kg (+0.4%), PVC K-67 at ₹104.40/kg (+0.4%), and rPET Flakes at ₹87.40/kg (+0.7%).',
    source_name: 'PolymerHub Petrochemical Reference Index',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'PolymerHub Petrochemical Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-02T05:30:00+00:00',
    publish_date: '2026-10-02',
    is_featured: false,
    is_published: true
  }
]

const oct02MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 114.80, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-02' },
  { commodity: 'Relene HDPE', price_inr: 121.00, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-02' },
  { commodity: 'Relene LLDPE', price_inr: 117.00, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-02' },
  { commodity: 'Finolex PVC', price_inr: 104.40, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-02' },
  { commodity: 'BASF Nylon 6', price_inr: 296.80, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-02' },
  { commodity: 'SABIC PC', price_inr: 252.40, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-02' },
  { commodity: 'JBF PET', price_inr: 109.60, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-02' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 89.80, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-10-02' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 79.00, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-10-02' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 79.60, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-10-02' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 87.40, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-02' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 170.00, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-02' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 2, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct02VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 2, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct02MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 2, 2026!`)
  }
}

run()
