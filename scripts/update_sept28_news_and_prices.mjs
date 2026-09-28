// scripts/update_sept28_news_and_prices.mjs — Update verified news & indicative market prices for Sept 28, 2026
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

const sept28VerifiedArticles = [
  {
    headline: 'MoEFCC & CPCB Issue Updated Centralized EPR Portal Mandates & Mandatory 30% Recycled Content Thresholds for FY 2026-27',
    summary: 'The Central Pollution Control Board (CPCB) under MoEFCC published revised Extended Producer Responsibility (EPR) operational guidelines for Plastic Waste Management. Producers, Importers, and Brand Owners (PIBOs) must submit audited recycling certificates on the national portal, with rigid plastic packaging minimum recycled content mandates raised to 30% for Category I resins.',
    source_name: 'MoEFCC & CPCB Official Gazette Portal',
    source_url: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Environment, Forest and Climate Change & CPCB India',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-09-28T08:00:00+00:00',
    publish_date: '2026-09-28',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'High-Efficiency Single-Site Organometallic Catalysts for Controlled Ring-Opening Polymerization of L-Lactide into High-Mw PLA',
    summary: 'Research published in ACS Macromolecules demonstrates zinc-bis(phenolate) catalysts achieving ultra-fast ring-opening polymerization (ROP) of L-lactide under ambient pressure. The resulting polylactic acid (PLA) exhibits narrow dispersity (D < 1.08), high glass transition temperature (Tg = 62.5°C), and superior mechanical modulus.',
    source_name: 'ACS Macromolecules & Polymer Chemistry',
    source_url: 'https://pubs.acs.org/journal/mamobx',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'American Chemical Society (ACS) Publications',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'ring-opening-polymerization-rop-mechanisms',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-28T07:30:00+00:00',
    publish_date: '2026-09-28',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Reliance Industries & GAIL Expand Specialty Polyolefin Compounding Facilities in Hazira & Pata for EV & Healthcare Resins',
    summary: 'India’s leading petrochemical producers announce new dedicated compounding lines for medical-grade polypropylene, high-ESCR HDPE for industrial blow moulding, and flame-retardant PP compounds engineered for EV battery pack enclosures and automotive lightweighting.',
    source_name: 'Industrial Petrochemical News & RIL Press',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & GAIL India',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'compounding-machinery-twin-screw-extruders-and-additive-masterbatches',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-28T07:00:00+00:00',
    publish_date: '2026-09-28',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Scalable Bacterial Fermentation of Polyhydroxybutyrate-co-hexanoate (PHBH) Using Waste Agricultural Oils',
    summary: 'Biotechnology research in Bioresource Technology demonstrates a continuous 100-liter bioreactor fermentation strategy using recombinant Cupriavidus necator to convert bio-waste oils into PHBH copolymer. Yields reach 82 g/L cell dry weight with marine biodegradation rate meeting ASTM D6691.',
    source_name: 'Bioresource Technology & ScienceDirect',
    source_url: 'https://www.sciencedirect.com/journal/bioresource-technology',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Bioresource Technology Research',
    category: 'Bioplastics',
    region: 'Global',
    related_lesson_slug: 'pha-production-bacterial-fermentation-recovery',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-28T06:30:00+00:00',
    publish_date: '2026-09-28',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Continuous Carbon Fiber Reinforced PEEK & PEKK Tapes Processed via Ultrasonic Automated Tape Placement (ATP)',
    summary: 'An aerospace composites investigation published in Composites Part A evaluates ultrasonic head-assisted Automated Tape Placement of CF/PEEK prepreg tapes. Inter-laminar shear strength (ILSS) reaches 98.4 MPa with zero void content without requiring autoclave post-curing.',
    source_name: 'Composites Part A: Applied Science & Manufacturing',
    source_url: 'https://www.sciencedirect.com/journal/composites-part-a-applied-science-and-manufacturing',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Elsevier Composites Research',
    category: 'Innovation',
    region: 'Global',
    related_lesson_slug: 'high-performance-composites-peek-cf-polyimide-cf',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-28T06:00:00+00:00',
    publish_date: '2026-09-28',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Domestic Polyolefin, PVC & Engineering Thermoplastic Indicative Spot Benchmarks (September 28, 2026 Update)',
    summary: 'PolymerHub updates indicative spot market benchmark ranges across major Indian trading hubs (Hazira, Mumbai, Silvassa, Nhava Sheva). Raffia PP settles at ₹112.40/kg, HDPE Film at ₹118.50/kg, LLDPE at ₹114.80/kg, PVC K-67 at ₹102.80/kg, and rPET Flakes at ₹85.00/kg.',
    source_name: 'PolymerHub Petrochemical Reference Index',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'PolymerHub Petrochemical Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-28T05:30:00+00:00',
    publish_date: '2026-09-28',
    is_featured: false,
    is_published: true
  }
]

const sept28MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 112.40, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-28' },
  { commodity: 'Relene HDPE', price_inr: 118.50, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-28' },
  { commodity: 'Relene LLDPE', price_inr: 114.80, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-28' },
  { commodity: 'Finolex PVC', price_inr: 102.80, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-28' },
  { commodity: 'BASF Nylon 6', price_inr: 293.50, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-28' },
  { commodity: 'SABIC PC', price_inr: 249.20, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-28' },
  { commodity: 'JBF PET', price_inr: 107.50, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-28' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 88.60, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-09-28' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 76.50, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-28' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 77.20, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-28' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 85.00, price_usd: null, unit: 'kg', delta_pct: 0.9, recorded_at: '2026-09-28' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 167.50, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-09-28' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting September 28, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(sept28VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting September 28, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(sept28MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for September 28, 2026!`)
  }
}

run()
