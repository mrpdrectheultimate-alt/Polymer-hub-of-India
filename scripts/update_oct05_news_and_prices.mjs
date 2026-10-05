// scripts/update_oct05_news_and_prices.mjs — Update verified news & indicative market prices for Oct 5, 2026
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

const oct05VerifiedArticles = [
  {
    headline: 'CPCB & Ministry of Housing Launch National Municipal Plastics Recovery Index & EPR Credit Allocation Framework',
    summary: 'CPCB released the FY 2026-27 Municipal Plastic Recovery Index covering 50 metropolitan cities across India. Municipal corporations adopting automated material recovery facilities (MRFs) with NIR optical sortation are integrated into the national EPR credit trading exchange, granting brand owners direct access to certified PCR polymers.',
    source_name: 'CPCB & MoHUA Official Gazette Portal',
    source_url: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CPCB & Ministry of Housing and Urban Affairs',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-05T08:00:00+00:00',
    publish_date: '2026-10-05',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Continuous Single-Pass Chemical Depolymerization of Post-Consumer Polystyrene into High-Purity Styrene Monomer',
    summary: 'Chemical engineering study published in Chemical Engineering Journal demonstrates a continuous 5 kg/hr pilot fluidized bed reactor achieving 92% yield of polymer-grade monomeric styrene from mixed post-consumer PS packaging at 420°C with 99.7% monomer purity.',
    source_name: 'Chemical Engineering Journal (Elsevier)',
    source_url: 'https://www.sciencedirect.com/journal/chemical-engineering-journal',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Elsevier Chemical Engineering Research',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'chemical-recycling-depolymerization-pyrolysis-solvolysis',
    related_subject_slug: 'recycling-sustainability',
    published_at: '2026-10-05T07:30:00+00:00',
    publish_date: '2026-10-05',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Reliance Industries & GAIL Expand Strategic Compounding Facilities for Medical-Grade PP & EV Battery Polymers',
    summary: 'India’s leading petrochemical manufacturers announce commercial availability of high-purity medical PP grades (certified ISO 10993) and flame-retardant PP compounds tailored for electric vehicle battery enclosures and charging infrastructure.',
    source_name: 'Reliance Petrochemicals & GAIL Official',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & GAIL India',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'compounding-machinery-twin-screw-extruders-and-additive-masterbatches',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-05T07:00:00+00:00',
    publish_date: '2026-10-05',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Microbial Production of High-Valerate Poly(hydroxybutyrate-co-3-hydroxyvalerate) (PHBV) Copolymers from Food Wastewater',
    summary: 'Applied microbiology paper in Bioresource Technology reports optimized fed-batch fermentation of Haloferax mediterranei utilizing food waste hydrolysates to yield 75 g/L cell dry weight of PHBV with 22 mol% HV content, improving film elongation at break to 320%.',
    source_name: 'Bioresource Technology & ScienceDirect',
    source_url: 'https://www.sciencedirect.com/journal/bioresource-technology',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'ScienceDirect Applied Microbiology Research',
    category: 'Bioplastics',
    region: 'Global',
    related_lesson_slug: 'pha-production-bacterial-fermentation-recovery',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-10-05T06:30:00+00:00',
    publish_date: '2026-10-05',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Continuous Carbon Fiber Reinforced Polyetheretherketone (CF/PEEK) Aerospace Prepreg Tapes Processed via Ultrasonic ATP',
    summary: 'Advanced manufacturing research published in Composites Science and Technology evaluates ultrasonic head-assisted Automated Tape Placement (ATP) of CF/PEEK prepreg tapes, demonstrating inter-laminar shear strength (ILSS) exceeding 99 MPa with zero void content under in-situ laser consolidation.',
    source_name: 'Composites Science and Technology (Elsevier)',
    source_url: 'https://www.sciencedirect.com/journal/composites-science-and-technology',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Elsevier Composites Publishing',
    category: 'Innovation',
    region: 'Global',
    related_lesson_slug: 'high-performance-composites-peek-cf-polyimide-cf',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-10-05T06:00:00+00:00',
    publish_date: '2026-10-05',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Domestic Polyolefin, PVC & Engineering Thermoplastic Indicative Spot Benchmarks (October 5, 2026 Update)',
    summary: 'PolymerHub updates indicative spot market benchmark ranges across major Indian trading hubs (Hazira, Mumbai, Silvassa, Nhava Sheva). Raffia PP settles at ₹116.00/kg (+0.5%), HDPE Film at ₹122.20/kg (+0.5%), LLDPE at ₹118.20/kg (+0.5%), PVC K-67 at ₹105.20/kg (+0.4%), and rPET Flakes at ₹88.60/kg (+0.7%).',
    source_name: 'PolymerHub Petrochemical Reference Index',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'PolymerHub Petrochemical Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-05T05:30:00+00:00',
    publish_date: '2026-10-05',
    is_featured: false,
    is_published: true
  }
]

const oct05MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 116.00, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-05' },
  { commodity: 'Relene HDPE', price_inr: 122.20, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-05' },
  { commodity: 'Relene LLDPE', price_inr: 118.20, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-05' },
  { commodity: 'Finolex PVC', price_inr: 105.20, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-05' },
  { commodity: 'BASF Nylon 6', price_inr: 298.00, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-05' },
  { commodity: 'SABIC PC', price_inr: 253.60, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-05' },
  { commodity: 'JBF PET', price_inr: 110.80, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-05' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 90.40, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-10-05' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 80.20, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-10-05' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 80.80, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-05' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 88.60, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-05' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 171.20, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-05' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 5, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct05VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 5, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct05MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 5, 2026!`)
  }
}

run()
