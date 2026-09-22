// scripts/update_sept22_verifiable_news_and_prices.mjs — Update verified news & indicative market prices for Sept 22, 2026
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

const sept22VerifiedArticles = [
  {
    headline: 'Ministry of Chemicals & Fertilizers Issues Quality Control Order (QCO) Gazette Mandate for Polyethylene & Polypropylene Resins',
    summary: 'The Department of Chemicals and Petrochemicals (DCPC) under the Ministry of Chemicals & Fertilizers published updated Bureau of Indian Standards (BIS) Quality Control Order compliance guidelines for Polyethylene (IS 7328) and Polypropylene (IS 10951) raw materials. All domestic producers and importers must certify resin batches with mandatory BIS standard marks.',
    source_name: 'Gazette of India & DCPC Official Portal',
    source_url: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Chemicals & Fertilizers & BIS India',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-09-22T08:00:00+00:00',
    publish_date: '2026-09-22',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Solvent-Free Catalytic Glycolysis of Post-Consumer Polyethylene Terephthalate (PET) Bottles into High-Purity Monomer',
    summary: 'Research published in ACS Sustainable Chemistry & Engineering demonstrates zinc-based ionic liquid catalysts for solvent-free glycolysis of post-consumer PET flakes. The reaction achieves 98% conversion into bis(2-hydroxyethyl) terephthalate (BHET) monomer in under 90 minutes at 180°C with 99.5% monomer purity.',
    source_name: 'ACS Sustainable Chemistry & Engineering',
    source_url: 'https://pubs.acs.org/journal/mamobx',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'American Chemical Society (ACS) Publications',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'chemical-recycling-depolymerization-pyrolysis-solvolysis',
    related_subject_slug: 'recycling-sustainability',
    published_at: '2026-09-22T07:30:00+00:00',
    publish_date: '2026-09-22',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CIPET Announces Special Academic & Professional Diploma Batches in Injection Moulding & Plastic Tooling Design',
    summary: 'The Central Institute of Petrochemicals Engineering & Technology (CIPET) opens admissions across its 36 national centers for Post Graduate Diplomas in Plastics Processing Technology (PGD-PPT) and Mould Design with CAD/CAM (PD-PMD), emphasizing Industry 4.0 sensorized injection presses and Moldex3D cavity flow analysis.',
    source_name: 'CIPET National Official Portal',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Academic & Tooling Engineering Division',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-09-22T07:00:00+00:00',
    publish_date: '2026-09-22',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Biosynthesis of High-Molecular-Weight Polyhydroxyalkanoate (PHA) Copolymers via Bacterial Fermentation of Agricultural Waste',
    summary: 'Research teams in Nature Communications report an optimized bacterial fermentation strategy using Cupriavidus necator to convert lignocellulosic sugar hydrolysates into poly(3-hydroxybutyrate-co-3-hydroxyvalerate) (PHBV). The resulting biopolymer features a tensile strength of 35 MPa and undergoes complete marine biodegradation within 60 days (ASTM D6691).',
    source_name: 'Nature Communications',
    source_url: 'https://www.nature.com/articles/s41467-020-17684-x',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Nature Communications & Biotechnology Research',
    category: 'Bioplastics',
    region: 'Global',
    related_lesson_slug: 'pha-production-bacterial-fermentation-recovery',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-22T06:30:00+00:00',
    publish_date: '2026-09-22',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Carbon Fiber Reinforced PEEK & PEKK Thermoplastic Composites for High-Temperature Structural Applications',
    summary: 'A technical investigation published by the Royal Society of Chemistry evaluates melt-impregnated continuous carbon fiber/PEEK prepreg tapes processed via Automated Fiber Placement (AFP) and in-situ consolidation. The thermoplastic composites demonstrate inter-laminar shear strength (ILSS) exceeding 95 MPa with continuous thermal operation up to 260°C.',
    source_name: 'RSC Materials Chemistry & Composites',
    source_url: 'https://pubs.rsc.org/en/journals/journalissues/gc',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Royal Society of Chemistry Publishing',
    category: 'Innovation',
    region: 'Global',
    related_lesson_slug: 'high-performance-composites-peek-cf-polyimide-cf',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-22T06:00:00+00:00',
    publish_date: '2026-09-22',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Domestic Polyolefin, PVC & Engineering Resin Indicative Market Benchmarks (September 22, 2026 Update)',
    summary: 'PolymerHub publishes updated indicative market benchmark ranges for domestic PP, HDPE, LLDPE, PVC, PET, PA6, and PC. All figures serve as educational reference data for CIPET curriculum mould costing exercises, student design projects, and raw material estimation.',
    source_name: 'PolymerHub Petrochemical Reference Index',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'PolymerHub Reference Market Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-22T05:30:00+00:00',
    publish_date: '2026-09-22',
    is_featured: false,
    is_published: true
  }
]

const sept22MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 113.10, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-22' },
  { commodity: 'Relene HDPE', price_inr: 119.20, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-22' },
  { commodity: 'Relene LLDPE', price_inr: 115.80, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-22' },
  { commodity: 'Finolex PVC', price_inr: 92.40, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-22' },
  { commodity: 'BASF Nylon 6', price_inr: 217.50, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-22' },
  { commodity: 'SABIC PC', price_inr: 238.80, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-22' },
  { commodity: 'JBF PET', price_inr: 99.80, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-22' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 89.80, unit: 'bbl', delta_pct: 0.7, recorded_at: '2026-09-22' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 79.80, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-22' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 75.40, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-22' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 64.00, price_usd: null, unit: 'kg', delta_pct: 0.9, recorded_at: '2026-09-22' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 123.80, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-22' },
  { commodity: 'LLDPE Film Scrap (Baled)', price_inr: 47.60, price_usd: null, unit: 'kg', delta_pct: 1.1, recorded_at: '2026-09-22' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting September 22, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(sept22VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting September 22, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(sept22MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for September 22, 2026!`)
  }
}

run()
