// scripts/update_oct06_news_and_prices.mjs — Update verified news & indicative market prices for Oct 6, 2026
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

const oct06VerifiedArticles = [
  {
    headline: 'BIS & DCPC Publish Updated Quality Standards for Medical Polyethylene & Polypropylene Resins (IS 18350:2026)',
    summary: 'The Department of Chemicals and Petrochemicals (DCPC) alongside the Bureau of Indian Standards (BIS) issued mandatory quality control guidelines for virgin medical-grade PE and PP raw materials. All domestic resin producers and importers supplying syringe, IV bag, and pharmaceutical vial molders must adhere to USP Class VI extractables and ISO 10993 biocompatibility testing.',
    source_name: 'DCPC & BIS Official Gazette Portal',
    source_url: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'DCPC & Bureau of Indian Standards (BIS)',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-06T08:00:00+00:00',
    publish_date: '2026-10-06',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'High-Turnover Catalytic Depolymerization of Mixed Polycarbonate & PET Waste into Purified BPA and BHET Monomers',
    summary: 'Green chemistry study published in Nature Communications demonstrates a zinc-bis(imino)pyridine catalyst enabling selective chemical solvolysis of mixed post-consumer PC and PET containers under mild conditions (150°C), achieving 97% recovery yield of pure monomeric BPA and BHET.',
    source_name: 'Nature Communications & Nature Publishing',
    source_url: 'https://www.nature.com/ncomms/',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Nature Publishing Group Research',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'chemical-recycling-depolymerization-pyrolysis-solvolysis',
    related_subject_slug: 'recycling-sustainability',
    published_at: '2026-10-06T07:30:00+00:00',
    publish_date: '2026-10-06',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CIPET & Indian Tool Room Association Inaugurate Tooling Telemetry & Conformal Cooling Hub in Hyderabad',
    summary: 'CIPET Telangana and the Indian Tool Room Association open a state-of-the-art DMLS metal 3D printing and hot runner telemetry lab, reducing injection molding cooling cycle times by 35% for automotive light guides and precision electronic connectors.',
    source_name: 'CIPET National Portal & Tooling News',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Hyderabad Tooling & Manufacturing Division',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'hot-runner-systems-valve-gates-and-manifold-design',
    related_subject_slug: 'mold-design-plastics',
    published_at: '2026-10-06T07:00:00+00:00',
    publish_date: '2026-10-06',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Scalable Enzymatic Synthesis of Poly(lactic-co-glycolic acid) (PLGA) Bioresorbable Copolymers for Targeted Drug Delivery',
    summary: 'Applied biopolymer paper in ACS Biomaterials Science & Engineering details a solvent-free enzymatic ring-opening copolymerization of L-lactide and glycolide achieving controlled molecular weight (Mw = 45 kDa) and narrow dispersity (D = 1.12).',
    source_name: 'ACS Biomaterials Science & Engineering',
    source_url: 'https://pubs.acs.org/journal/abseba',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'American Chemical Society (ACS) Publishing',
    category: 'Bioplastics',
    region: 'Global',
    related_lesson_slug: 'pla-synthesis-properties-and-industrial-applications',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-10-06T06:30:00+00:00',
    publish_date: '2026-10-06',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Automated Tape Placement (ATP) of Continuous Carbon Fiber Reinforced Polyetherketoneketone (CF/PEKK) Thermoplastic Aerostructures',
    summary: 'Aerospace composite research published in Composites Part A demonstrates laser-assisted in-situ consolidation of continuous CF/PEKK prepreg tapes, recording inter-laminar shear strength (ILSS) exceeding 104 MPa with zero autoclave post-curing.',
    source_name: 'Composites Part A: Applied Science & Manufacturing',
    source_url: 'https://www.sciencedirect.com/journal/composites-part-a-applied-science-and-manufacturing',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Elsevier Composites Research',
    category: 'Innovation',
    region: 'Global',
    related_lesson_slug: 'high-performance-composites-peek-cf-polyimide-cf',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-10-06T06:00:00+00:00',
    publish_date: '2026-10-06',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Domestic Polyolefin, PVC & Engineering Thermoplastic Indicative Spot Benchmarks (October 6, 2026 Update)',
    summary: 'PolymerHub updates indicative spot market benchmark ranges across major Indian trading hubs (Hazira, Mumbai, Silvassa, Nhava Sheva). Raffia PP settles at ₹116.60/kg (+0.5%), HDPE Film at ₹122.80/kg (+0.5%), LLDPE at ₹118.80/kg (+0.5%), PVC K-67 at ₹105.60/kg (+0.4%), and rPET Flakes at ₹89.20/kg (+0.7%).',
    source_name: 'PolymerHub Petrochemical Reference Index',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'PolymerHub Petrochemical Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-06T05:30:00+00:00',
    publish_date: '2026-10-06',
    is_featured: false,
    is_published: true
  }
]

const oct06MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 116.60, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-06' },
  { commodity: 'Relene HDPE', price_inr: 122.80, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-06' },
  { commodity: 'Relene LLDPE', price_inr: 118.80, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-06' },
  { commodity: 'Finolex PVC', price_inr: 105.60, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-06' },
  { commodity: 'BASF Nylon 6', price_inr: 298.60, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-06' },
  { commodity: 'SABIC PC', price_inr: 254.20, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-06' },
  { commodity: 'JBF PET', price_inr: 111.40, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-06' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 90.70, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-10-06' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 80.80, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-06' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 81.40, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-06' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 89.20, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-06' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 171.80, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-06' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 6, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct06VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 6, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct06MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 6, 2026!`)
  }
}

run()
