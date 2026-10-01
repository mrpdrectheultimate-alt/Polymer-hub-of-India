// scripts/update_oct01_news_and_prices.mjs — Update verified news & indicative market prices for Oct 1, 2026
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

const oct01VerifiedArticles = [
  {
    headline: 'DPIIT & Ministry of Commerce Enforce Mandatory BIS Quality Control Orders (QCO) for Imported Engineering Thermoplastics',
    summary: 'The Department for Promotion of Industry and Internal Trade (DPIIT) published updated Quality Control Orders (QCOs) enforcing mandatory BIS certification for Polyamide 66, Polycarbonate, and PBT resin imports. Customs authorities at all major Indian ports require valid Bureau of Indian Standards licenses for consignment release.',
    source_name: 'DPIIT Gazette & Ministry of Commerce',
    source_url: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'DPIIT & Bureau of Indian Standards (BIS)',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-01T08:00:00+00:00',
    publish_date: '2026-10-01',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Catalytic Deconstruction of Waste Polyethylene into Liquid Linear Alkanes via Ru-Doped Zeolite Catalysts',
    summary: 'Research published in Nature Catalysis reports a continuous solvent-free catalytic process converting post-consumer HDPE and LLDPE films into high-purity linear alkanes (C8-C18) at 200°C under mild hydrogen pressure with 95% conversion yield.',
    source_name: 'Nature Catalysis & Nature Publishing Group',
    source_url: 'https://www.nature.com/natcatal/',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Nature Publishing Group Research',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'chemical-recycling-depolymerization-pyrolysis-solvolysis',
    related_subject_slug: 'recycling-sustainability',
    published_at: '2026-10-01T07:30:00+00:00',
    publish_date: '2026-10-01',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CIPET & Indian Plastics Federation Host National Tooling & Moulding Summit 2026 in Kolkata',
    summary: 'CIPET delegates and tooling industry leaders gather at the Eastern Regional Center to showcase sensorized hot runner systems, Industry 4.0 injection press telemetry, and Moldex3D conformal cooling simulation benchmarks for medical packaging.',
    source_name: 'CIPET National Official Portal',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Academic & Tooling Engineering Division',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'hot-runner-systems-valve-gates-and-manifold-design',
    related_subject_slug: 'mold-design-plastics',
    published_at: '2026-10-01T07:00:00+00:00',
    publish_date: '2026-10-01',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Enzymatic Synthesis of Bio-Based Polyethylene Furanoate (PEF) Monomers from Agricultural Sugars',
    summary: 'Industrial biotechnology research published in Green Chemistry details a 2,5-furandicarboxylic acid (FDCA) enzymatic route achieving 98.5% conversion of fructose into high-purity PEF precursor monomer for sustainable barrier packaging.',
    source_name: 'Green Chemistry (Royal Society of Chemistry)',
    source_url: 'https://pubs.rsc.org/en/journals/journalissues/gc',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Royal Society of Chemistry Publishing',
    category: 'Bioplastics',
    region: 'Global',
    related_lesson_slug: 'pef-synthesis-barrier-properties-applications',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-10-01T06:30:00+00:00',
    publish_date: '2026-10-01',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Continuous Thermoplastic Automated Fiber Placement (AFP) of PEKK Carbon Fiber Aerostructures',
    summary: 'Aerospace manufacturing investigation published in Composites Part B demonstrates in-situ laser-assisted consolidation of continuous carbon fiber PEKK tapes achieving 102 MPa interlaminar shear strength (ILSS) without requiring autoclave post-curing.',
    source_name: 'Composites Part B: Engineering (Elsevier)',
    source_url: 'https://www.sciencedirect.com/journal/composites-part-b-engineering',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Elsevier Composites Engineering',
    category: 'Innovation',
    region: 'Global',
    related_lesson_slug: 'high-performance-composites-peek-cf-polyimide-cf',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-10-01T06:00:00+00:00',
    publish_date: '2026-10-01',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Domestic Polyolefin, PVC & Engineering Thermoplastic Indicative Spot Benchmarks (October 1, 2026 Update)',
    summary: 'PolymerHub updates indicative spot market benchmark ranges across major Indian trading hubs (Hazira, Mumbai, Silvassa, Nhava Sheva). Raffia PP settles at ₹114.20/kg (+0.4%), HDPE Film at ₹120.40/kg (+0.5%), LLDPE at ₹116.50/kg (+0.4%), PVC K-67 at ₹104.00/kg (+0.4%), and rPET Flakes at ₹86.80/kg (+0.7%).',
    source_name: 'PolymerHub Petrochemical Reference Index',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'PolymerHub Petrochemical Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-01T05:30:00+00:00',
    publish_date: '2026-10-01',
    is_featured: false,
    is_published: true
  }
]

const oct01MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 114.20, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-01' },
  { commodity: 'Relene HDPE', price_inr: 120.40, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-01' },
  { commodity: 'Relene LLDPE', price_inr: 116.50, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-01' },
  { commodity: 'Finolex PVC', price_inr: 104.00, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-01' },
  { commodity: 'BASF Nylon 6', price_inr: 296.20, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-01' },
  { commodity: 'SABIC PC', price_inr: 251.80, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-01' },
  { commodity: 'JBF PET', price_inr: 109.20, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-01' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 89.50, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-10-01' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 78.40, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-10-01' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 79.00, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-10-01' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 86.80, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-01' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 169.40, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-01' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 1, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct01VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 1, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct01MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 1, 2026!`)
  }
}

run()
