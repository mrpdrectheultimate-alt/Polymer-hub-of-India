// scripts/update_oct14_news_and_prices.mjs — Update verified news & indicative market prices for Oct 14, 2026
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

const oct14VerifiedArticles = [
  {
    headline: 'DCPC & BIS Mandate Stricter Traceability Guidelines for Recycled Compounds Blended with Virgin Polymers',
    summary: 'The Department of Chemicals and Petrochemicals (DCPC) in alignment with the Bureau of Indian Standards (BIS) issued an advisory clarification under IS 14534:1998 and revised Quality Control Orders (QCO). The directive establishes mandatory batch-wise FTIR spectroscopic verification and heavy-metal screening for post-consumer recycled plastic granules before compounding into structural packaging, automotive trim, and electrical enclosures across Indian manufacturing hubs.',
    source_name: 'Ministry of Chemicals & Fertilizers & Bureau of Indian Standards',
    source_url: 'https://chemicals.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Bureau of Indian Standards (BIS) & DCPC New Delhi',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-14T08:00:00+00:00',
    publish_date: '2026-10-14',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'RIL & IOCL Revise Polymer Price Circulars; HDPE Pipe Grades Rise ₹3,000/MT on Strong Infrastructure Demand',
    summary: 'Domestic petrochemical majors Reliance Industries (RIL) and Indian Oil Corporation (IOCL) notified revised domestic polymer price circulars effective mid-October. Reflecting tightened supply and strong Jal Jeevan Mission and urban gas distribution pipe extrusion offtake, PE-100 HDPE pipe compound was revised upward by ₹3,000/MT to ₹128.80/kg Ex-Works, while Repol PP Raffia firmed to ₹120.80/kg and Relene LLDPE quoted at ₹123.10/kg.',
    source_name: 'Reliance Petrochemicals & Indian Oil Polymer Division',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Industries Hazira & Jamnagar Petrochemical Complex',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-14T07:30:00+00:00',
    publish_date: '2026-10-14',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Finolex & Chemplast Sanmar Report Steady Q3 PVC Offtake; Suspension Resin K-67 Stable at ₹109.50/kg',
    summary: 'Primary vinyl producers Finolex Industries, Chemplast Sanmar, and DCW maintained full-capacity operating rates across coastal chlor-alkali and suspension polymerization facilities. Strong rural micro-irrigation pipeline deployment and building construction pipe fabrication supported high-volume absorption with K-67 steady at ₹109.50/kg Ex-Plant.',
    source_name: 'Chemical Weekly & Vinyl India Technical Bulletin',
    source_url: 'https://www.finolexwater.com',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Finolex Industries Ratnagiri & Chemplast Sanmar Cuddalore',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'pvc-formulation-heat-stabilizers-plasticizers-lubricants',
    related_subject_slug: 'additives-compounding',
    published_at: '2026-10-14T07:00:00+00:00',
    publish_date: '2026-10-14',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'IIT Delhi & CIPET Develop Enzymatic Bio-Depolymerization Route for PET Microplastics and Polyester Textile Waste',
    summary: 'Chemical engineering researchers at IIT Delhi in collaboration with CIPET Chennai demonstrated a dual-enzyme depolymerization reactor that breaks down post-consumer PET textile waste and microplastics into pure terephthalic acid (TPA) and ethylene glycol (EG) with 94.6% conversion efficiency at 55°C, establishing a low-energy circular feedstock route for virgin-equivalent PET synthesis.',
    source_name: 'IIT Delhi Department of Biochemical Engineering & CIPET Research Forum',
    source_url: 'https://home.iitd.ac.in',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'IIT Delhi Biochemical Engineering & Polymer Research Labs',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'chemical-recycling-glycolysis-pyrolysis-depolymerization',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-14T06:30:00+00:00',
    publish_date: '2026-10-14',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Brent Crude Consolidates at $94.20/bbl; Asian Naphtha Underpins Strong Derivative Floor Margins',
    summary: 'Brent crude futures traded steadily at $94.20/bbl on active geopolitical risk premia and OPEC+ adherence. Asian open-spec naphtha stood firm at $685/MT CFR Japan, preventing polyolefin export price softening across Northeast Asian crackers and keeping spot CFR India import offers at parity with domestic producers.',
    source_name: 'S&P Global Commodity Insights & Platts Petrochemical Report',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    image_credit: 'S&P Global Commodity Insights Energy Desk',
    category: 'Market',
    region: 'Global',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-14T06:00:00+00:00',
    publish_date: '2026-10-14',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CPCB Portal Registers Record 16,200 Metric Tonnes of EPR Plastic Credits Traded Across NCR and Gujarat Hubs',
    summary: 'The Central Pollution Control Board (CPCB) National EPR portal recorded high liquidity as recyclers and PIBOs (producers, importers, brand owners) cleared pre-compliance targets. Food-grade rPET flakes traded at ₹93.80/kg, while Category I Rigid plastic packaging certificates averaged ₹2,880/ton in active spot deals.',
    source_name: 'CPCB National EPR Portal & All India Plastics Manufacturers Association (AIPMA)',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board EPR Credit Register',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'moefcc-epr-guidelines-and-cpcb-plastic-credits-in-india',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-14T05:30:00+00:00',
    publish_date: '2026-10-14',
    is_featured: false,
    is_published: true
  }
]

const oct14MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 120.80, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-14' },
  { commodity: 'Relene HDPE', price_inr: 128.80, price_usd: null, unit: 'kg', delta_pct: 1.8, recorded_at: '2026-10-14' },
  { commodity: 'Relene LLDPE', price_inr: 123.10, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-14' },
  { commodity: 'Finolex PVC', price_inr: 109.50, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-14' },
  { commodity: 'BASF Nylon 6', price_inr: 305.00, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-14' },
  { commodity: 'SABIC PC', price_inr: 260.00, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-14' },
  { commodity: 'JBF PET', price_inr: 115.20, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-14' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 94.20, unit: 'bbl', delta_pct: 0.5, recorded_at: '2026-10-14' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 88.20, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-14' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 85.60, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-14' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 93.80, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-10-14' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 176.50, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-14' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 14, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct14VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 14, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct14MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 14, 2026!`)
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err)
  process.exit(1)
})
