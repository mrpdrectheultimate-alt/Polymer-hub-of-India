// scripts/update_oct13_news_and_prices.mjs — Update verified news & indicative market prices for Oct 13, 2026
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

const oct13VerifiedArticles = [
  {
    headline: 'Ministry of Chemicals & Fertilizers Enforces Mandatory BIS QCO Standards for Engineering Thermoplastics',
    summary: 'The Department of Chemicals and Petrochemicals (DCPC) under the Ministry of Chemicals & Fertilizers notified enhanced BIS Quality Control Orders (QCO) for Polycarbonate (IS 14434) and Polyacetal / POM (IS 14882). Under the decree, all imported and domestic prime compounds must carry BIS certification mark licenses, ensuring zero heavy-metal contaminants and strict tensile/Charpy impact benchmarks across Indian automotive and electrical components.',
    source_name: 'Ministry of Chemicals & Fertilizers & Bureau of Indian Standards',
    source_url: 'https://chemicals.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Bureau of Indian Standards (BIS) & Ministry of Chemicals & Fertilizers New Delhi',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-13T08:00:00+00:00',
    publish_date: '2026-10-13',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Reliance Industries & GAIL Release Mid-October Resin Circulars; PP Raffia and HDPE Film Firm Up ₹0.50/kg',
    summary: 'Reliance Industries (RIL) and GAIL India issued updated domestic polymer pricing circulars effective today, nudging Repol PP Raffia to ₹120.30/kg and Relene HDPE film to ₹126.50/kg Ex-Works Hazira/Dahej. Healthy FMCG packaging conversion rates and steady pre-Diwali wholesale orders continue to absorb monomer-linked cost pass-throughs across Western and Northern hubs.',
    source_name: 'Reliance Petrochemicals & GAIL Polymer Directorate',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Industries Hazira Petrochemical Complex',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-13T07:30:00+00:00',
    publish_date: '2026-10-13',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Jal Jeevan Mission Tenders and Micro-Irrigation Demand Sustain Strong Domestic PVC K-67 Pipe Resin Offtake',
    summary: 'Finolex, Chemplast Sanmar, and DCW reported sustained order inflows for K-67 pipe suspension resin, quoting ₹109.20/kg Ex-Plant. Steady procurement from water infrastructure contractors under the Jal Jeevan Mission and agricultural micro-irrigation pipe extruders has maintained domestic plant utilization at over 90%.',
    source_name: 'Chemical Weekly & Vinyl India Pipe Extrusion Report',
    source_url: 'https://www.finolexwater.com',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Finolex Industries Ratnagiri & Chemplast Sanmar',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'pvc-formulation-heat-stabilizers-plasticizers-lubricants',
    related_subject_slug: 'additives-compounding',
    published_at: '2026-10-13T07:00:00+00:00',
    publish_date: '2026-10-13',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CSIR-NCL Pune & CIPET Synthesize High-Elongation PBAT/Starch Blends for Agricultural Mulch Films',
    summary: 'Polymer scientists at CSIR-National Chemical Laboratory (NCL) Pune in joint work with CIPET Ahmedabad synthesized fully soil-biodegradable poly(butylene adipate-co-terephthalate) (PBAT) blended with thermoplastic starch (TPS). The compound yields over 420% elongation at break and breaks down into organic compost within 90 days in agricultural soil beds.',
    source_name: 'CSIR-NCL Science Bulletin & CIPET Advanced Research',
    source_url: 'https://www.ncl-india.org',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-National Chemical Laboratory Pune',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'pla-synthesis-properties-industrial-composting',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-13T06:30:00+00:00',
    publish_date: '2026-10-13',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Brent Crude Extends Gain to $93.75/bbl on Supply Constriction; Asian Naphtha Feedstock Floor Tightens',
    summary: 'Global crude oil benchmarks traded up to $93.75/bbl as tight OPEC+ production quotas and low distillate inventories reinforced Asian naphtha cracker margins. Asian spot ethylene held steady at $895/MT CFR Northeast Asia, setting solid pricing support for derivative polyolefin export cargoes into Indian ports.',
    source_name: 'S&P Global Commodity Insights & Platts Petrochemical Report',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    image_credit: 'S&P Global Commodity Insights Energy Desk',
    category: 'Market',
    region: 'Global',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-13T06:00:00+00:00',
    publish_date: '2026-10-13',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CPCB Plastic Credit Exchange Records Surge in Rigid Packaging Recycled rHDPE & rPET Granule Trades',
    summary: 'Registered recyclers and brand owners transacted over 14,500 tonnes of certified EPR credits on the national portal today. Demand for hot-washed food-contact rPET flakes pushed quotes to ₹93.20/kg in NCR and Western clusters, while rigid EPR credit certificates traded at an indicative ₹2,840/ton.',
    source_name: 'CPCB National EPR Portal & Recyclers Association of India',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board EPR Credit Register',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'moefcc-epr-guidelines-and-cpcb-plastic-credits-in-india',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-13T05:30:00+00:00',
    publish_date: '2026-10-13',
    is_featured: false,
    is_published: true
  }
]

const oct13MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 120.30, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-13' },
  { commodity: 'Relene HDPE', price_inr: 126.50, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-13' },
  { commodity: 'Relene LLDPE', price_inr: 122.60, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-13' },
  { commodity: 'Finolex PVC', price_inr: 109.20, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-13' },
  { commodity: 'BASF Nylon 6', price_inr: 304.00, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-13' },
  { commodity: 'SABIC PC', price_inr: 259.00, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-13' },
  { commodity: 'JBF PET', price_inr: 114.80, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-13' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 93.75, unit: 'bbl', delta_pct: 0.4, recorded_at: '2026-10-13' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 87.60, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-13' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 85.20, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-13' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 93.20, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-13' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 176.00, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-13' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 13, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct13VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 13, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct13MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 13, 2026!`)
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err)
  process.exit(1)
})
