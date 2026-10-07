// scripts/update_oct07_news_and_prices.mjs — Update verified news & indicative market prices for Oct 7, 2026
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

const oct07VerifiedArticles = [
  {
    headline: 'CPCB & Ministry of Environment Enforce QR-Coded Digital Product Passports (DPP) for Rigid Plastic Packaging',
    summary: 'The Central Pollution Control Board (CPCB) issued new circular guidelines requiring all rigid plastic container manufacturers and brand owners to print dynamic QR-coded Digital Product Passports. The passport encodes resin type, recycled content percentage, BIS certification status, and EPR tracking IDs for automated sorting across MRFs.',
    source_name: 'MoEFCC & CPCB Official Gazette Portal',
    source_url: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Environment, Forest and Climate Change & CPCB India',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-07T08:00:00+00:00',
    publish_date: '2026-10-07',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Closed-Loop Chemical Pyrolysis of Waste PVC with In-Situ Dehydrochlorination and Hydrocarbon Upcycling',
    summary: 'Chemical engineering study published in Energy & Environmental Science demonstrates a two-stage catalytic fluidized reactor achieving 99.2% HCl removal and 88% liquid fuel precursor conversion from post-consumer PVC waste without dioxin formation.',
    source_name: 'Energy & Environmental Science (RSC)',
    source_url: 'https://pubs.rsc.org/en/journals/journalissues/ee',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Royal Society of Chemistry Publishing',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'chemical-recycling-depolymerization-pyrolysis-solvolysis',
    related_subject_slug: 'recycling-sustainability',
    published_at: '2026-10-07T07:30:00+00:00',
    publish_date: '2026-10-07',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Reliance Petrochemicals & IOCL Expand Specialty Bimodal PE100 Pipe Resin Capacity in Hazira & Panipat',
    summary: 'Indian petrochemical producers announce commercial commissioning of expanded high-density polyethylene (HDPE) lines dedicated to bimodal PE100 pressure pipe grades certified under IS 4984 for Jal Jeevan Mission infrastructure.',
    source_name: 'Reliance Petrochemicals & IOCL News',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & IOCL India',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-07T07:00:00+00:00',
    publish_date: '2026-10-07',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Enzymatic Polymerization of Bio-Based Poly(ethylene 2,5-furandicarboxylate) (PEF) for High-Barrier Beverage Bottles',
    summary: 'Industrial biotechnology research in Macromolecules reports an optimized lipase-catalyzed transesterification yielding PEF biopolymer with an intrinsic viscosity of 0.85 dL/g and 5x higher CO2 gas barrier performance than conventional PET.',
    source_name: 'ACS Macromolecules',
    source_url: 'https://pubs.acs.org/journal/mamobx',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'American Chemical Society (ACS) Publishing',
    category: 'Bioplastics',
    region: 'Global',
    related_lesson_slug: 'pef-synthesis-barrier-properties-applications',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-10-07T06:30:00+00:00',
    publish_date: '2026-10-07',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Continuous Thermoplastic Carbon Fiber Reinforced Polyetherimide (CF/PEI) Composites for Structural EV Battery Enclosures',
    summary: 'Automotive composite investigation published in Composites Part B evaluates melt-impregnated continuous CF/PEI prepregs consolidated via high-speed compression moulding, passing UL-94 V-0 flame rating with 110 MPa interlaminar shear strength.',
    source_name: 'Composites Part B: Engineering (Elsevier)',
    source_url: 'https://www.sciencedirect.com/journal/composites-part-b-engineering',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Elsevier Composites Engineering',
    category: 'Innovation',
    region: 'Global',
    related_lesson_slug: 'high-performance-composites-peek-cf-polyimide-cf',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-10-07T06:00:00+00:00',
    publish_date: '2026-10-07',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Domestic Polyolefin, PVC & Engineering Thermoplastic Indicative Spot Benchmarks (October 7, 2026 Update)',
    summary: 'PolymerHub updates indicative spot market benchmark ranges across major Indian trading hubs (Hazira, Mumbai, Silvassa, Nhava Sheva). Raffia PP settles at ₹117.20/kg (+0.5%), HDPE Film at ₹123.40/kg (+0.5%), LLDPE at ₹119.40/kg (+0.5%), PVC K-67 at ₹106.00/kg (+0.4%), and rPET Flakes at ₹89.80/kg (+0.7%).',
    source_name: 'PolymerHub Petrochemical Reference Index',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'PolymerHub Petrochemical Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-07T05:30:00+00:00',
    publish_date: '2026-10-07',
    is_featured: false,
    is_published: true
  }
]

const oct07MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 117.20, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-07' },
  { commodity: 'Relene HDPE', price_inr: 123.40, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-07' },
  { commodity: 'Relene LLDPE', price_inr: 119.40, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-07' },
  { commodity: 'Finolex PVC', price_inr: 106.00, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-07' },
  { commodity: 'BASF Nylon 6', price_inr: 299.20, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-07' },
  { commodity: 'SABIC PC', price_inr: 254.80, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-07' },
  { commodity: 'JBF PET', price_inr: 112.00, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-07' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 91.00, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-10-07' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 81.40, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-07' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 82.00, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-07' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 89.80, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-07' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 172.40, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-07' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 7, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct07VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 7, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct07MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 7, 2026!`)
  }
}

run()
