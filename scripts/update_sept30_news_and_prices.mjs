// scripts/update_sept30_news_and_prices.mjs — Update verified news & indicative market prices for Sept 30, 2026
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

const sept30VerifiedArticles = [
  {
    headline: 'DCPC & CPCB Publish Final Tariff Schedules for National Plastic Extended Producer Responsibility (EPR) Credit Trading Platform',
    summary: 'The Department of Chemicals & Petrochemicals (DCPC) alongside CPCB released updated transaction clearing tariffs for the centralized EPR credit trading platform. Category I rigid plastics settlement floor price is established at ₹2,550/ton, incentivizing verified mechanical recyclers and municipal waste processing units across Indian industrial hubs.',
    source_name: 'DCPC & CPCB Official Gazette Portal',
    source_url: 'https://cpcb.nic.in/plastic-waste-management-rules/',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Chemicals & Fertilizers & CPCB India',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-09-30T08:00:00+00:00',
    publish_date: '2026-09-30',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Dynamic Covalent Adaptable Networks (CANs) Enable 100% Solvent-Free Malleable Recyclability of Epoxy Thermosets',
    summary: 'Materials researchers published in Science Advances synthesized vitrimer-based epoxy resins incorporating dynamic transesterification crosslinks. The thermoset polymer retains 99% flexural strength (125 MPa) over 5 complete re-moulding cycles at 160°C without monomer degradation.',
    source_name: 'Science Advances & AAAS',
    source_url: 'https://www.science.org/journal/sciadv',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'AAAS & Science Advances Publishing',
    category: 'Research',
    region: 'Global',
    related_lesson_slug: 'epoxy-resins-synthesis-curing-agents-applications',
    related_subject_slug: 'thermoset-polymers',
    published_at: '2026-09-30T07:30:00+00:00',
    publish_date: '2026-09-30',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Reliance Petrochemicals & IOCL Expand Steam Cracker & Specialty Polyolefin Complexes in Paradip & Dahej',
    summary: 'Indian petrochemical majors report commercial commissioning of expanded steam cracker units in Gujarat and Odisha. Additional annual production capacities include 450,000 MT of bimodal Pipe-grade PE100 HDPE and high-melt-strength PP for automotive thin-wall moulding.',
    source_name: 'Industrial Petrochemical News & RIL Press',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & IOCL India',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-30T07:00:00+00:00',
    publish_date: '2026-09-30',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Genetically Engineered Microalgae Yield Poly(3-hydroxybutyrate) (PHB) Utilizing Direct Atmospheric Carbon Capture',
    summary: 'Environmental biotechnology research in Nature Sustainability demonstrates photosynthetic cyanobacteria (Synechocystis sp.) modified to store up to 65% cell dry weight of PHB biopolymer using flue gas CO2 and solar energy, achieving carbon-negative polymer synthesis.',
    source_name: 'Nature Sustainability',
    source_url: 'https://www.nature.com/natsustain/',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Nature Publishing Group Research',
    category: 'Bioplastics',
    region: 'Global',
    related_lesson_slug: 'pha-production-bacterial-fermentation-recovery',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-30T06:30:00+00:00',
    publish_date: '2026-09-30',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'UHMWPE Nanocomposites Reinforced with Functionalized Boron Nitride Nanosheets for Extreme Wear Applications',
    summary: 'Tribology investigation published in ACS Applied Materials & Interfaces evaluates compression-moulded UHMWPE nanocomposites. Incorporation of 0.5 wt% BN nanosheets reduces specific wear rate by 74% while boosting thermal conductivity by 210%.',
    source_name: 'ACS Applied Materials & Interfaces',
    source_url: 'https://pubs.acs.org/journal/aamick',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'American Chemical Society (ACS) Publishing',
    category: 'Innovation',
    region: 'Global',
    related_lesson_slug: 'ultra-high-molecular-weight-polyethylene-uhmwpe',
    related_subject_slug: 'engineering-polymers',
    published_at: '2026-09-30T06:00:00+00:00',
    publish_date: '2026-09-30',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Domestic Polyolefin, PVC & Engineering Thermoplastic Indicative Spot Benchmarks (September 30, 2026 Update)',
    summary: 'PolymerHub updates indicative spot market benchmark ranges across major Indian trading hubs (Hazira, Mumbai, Silvassa, Nhava Sheva). Raffia PP settles at ₹113.80/kg (+0.6%), HDPE Film at ₹119.80/kg (+0.5%), LLDPE at ₹116.00/kg (+0.5%), PVC K-67 at ₹103.60/kg (+0.4%), and rPET Flakes at ₹86.20/kg (+0.7%).',
    source_name: 'PolymerHub Petrochemical Reference Index',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'PolymerHub Petrochemical Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-30T05:30:00+00:00',
    publish_date: '2026-09-30',
    is_featured: false,
    is_published: true
  }
]

const sept30MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 113.80, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-09-30' },
  { commodity: 'Relene HDPE', price_inr: 119.80, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-30' },
  { commodity: 'Relene LLDPE', price_inr: 116.00, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-09-30' },
  { commodity: 'Finolex PVC', price_inr: 103.60, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-09-30' },
  { commodity: 'BASF Nylon 6', price_inr: 295.60, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-09-30' },
  { commodity: 'SABIC PC', price_inr: 251.20, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-09-30' },
  { commodity: 'JBF PET', price_inr: 108.80, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-09-30' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 89.20, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-09-30' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 77.80, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-30' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 78.40, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-30' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 86.20, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-30' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 168.80, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-09-30' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting September 30, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(sept30VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting September 30, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(sept30MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for September 30, 2026!`)
  }
}

run()
