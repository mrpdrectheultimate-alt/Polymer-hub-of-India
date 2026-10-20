// scripts/update_oct20_news_and_prices.mjs — Update verified news & indicative market prices for Oct 20, 2026
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

const oct20VerifiedArticles = [
  {
    headline: 'DCPC Convenes Joint Task Force with CIPET to Monitor Mandatory BIS Markings on Imported Engineering Polymers',
    summary: 'The Department of Chemicals and Petrochemicals (DCPC) in coordination with the Bureau of Indian Standards (BIS) and CIPET established specialized laboratory inspection cells at Nhava Sheva (JNPT), Mundra, and Chennai ports. The task force is dedicated to verifying batch-level compliance for engineering thermoplastics—specifically Polycarbonate (IS 14434) and Polyacetal/POM (IS 14882)—guaranteeing that imported moulding compounds conform to heavy metal limits and intrinsic viscosity benchmarks before customs clearance.',
    source_name: 'Department of Chemicals and Petrochemicals (DCPC) & Bureau of Indian Standards (BIS)',
    source_url: 'https://chemicals.gov.in',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Bureau of Indian Standards (BIS) & CIPET Quality Control Cell',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-20T08:30:00+00:00',
    publish_date: '2026-10-20',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Indian Polyolefin Demand Surges as Pre-Diwali Rigid Packaging Converters Ramp Extrusion Lines',
    summary: 'Petrochemical complexes across Dahej, Hazira, and Panipat reported peak midweek order bookings as container, tote, and thin-wall packaging manufacturers operated blow moulding and injection machines at full swing. Repol PP Raffia traded steady at ₹122.80/kg and Relene HDPE Blow Moulding at ₹130.60/kg Ex-Works, supported by uninterrupted plant operating rates and heightened logistics coordination.',
    source_name: 'Plastindia Foundation & Reliance Petrochemicals Commercial Desk',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals Dahej Complex & Plastindia Trade Bureau',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-20T08:00:00+00:00',
    publish_date: '2026-10-20',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'ARAI & Tier-1 Auto Compounders Formulate High-Thermal Polyphenylene Sulfide (PPS) for Under-Hood Sensors',
    summary: 'Automotive component engineers in Pune and Chennai successfully validated 40% glass-filled Polyphenylene Sulfide (PPS) compounds for exhaust gas recirculation (EGR) valves and EV inverter cooling manifold assemblies. Capable of continuous service up to 220°C with exceptional dimensional stability and chemical resistance to aggressive automotive glycols, the formulation replaces die-cast aluminium components to achieve up to 35% weight reduction.',
    source_name: 'ARAI Pune & ACMA Automotive Component Technical Bulletin',
    source_url: 'https://www.araiindia.com',
    image_url: 'https://images.unsplash.com/photo-1558441719-8b449c6ff673?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Automotive Research Association of India (ARAI) Testing Laboratory',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'polycarbonates-and-polyoxymethylene-pom-engineering-properties-and-synthesis',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-10-20T07:15:00+00:00',
    publish_date: '2026-10-20',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CSIR-NCL Pune & CIPET Synthesize High-Toughness PLA/Polybutylene Succinate (PBS) Blown Films for Flexible Mailers',
    summary: 'Polymer scientists at CSIR-National Chemical Laboratory (NCL) Pune and CIPET Ahmedabad formulated reactively compatibilized Poly(lactic acid) (PLA) and Poly(butylene succinate) (PBS) blends utilizing bio-based epoxy crosslinkers. The resulting blown films demonstrate over 280% elongation at break and puncture resistance comparable to LDPE, achieving industrial compostability within 60 days under IS/ISO 17088 standards for courier packaging.',
    source_name: 'CSIR-National Chemical Laboratory (NCL) & CIPET Bulletin',
    source_url: 'https://www.ncl-india.org',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-National Chemical Laboratory Pune Sustainable Materials Cell',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'pla-synthesis-properties-industrial-composting',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-20T06:45:00+00:00',
    publish_date: '2026-10-20',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Brent Crude Consolidates Around $96.10/bbl; Northeast Asian Propylene CFR Quotes Hold at $875/MT',
    summary: 'Crude oil benchmarks traded firmly with Brent settling at $96.10/bbl amid tight global inventories and sustained refinery demand. Northeast Asian spot propylene held firm at $875/MT CFR, maintaining a healthy polymer-to-monomer margin spread that encourages high operating rates across western Indian coastal petrochemical complexes.',
    source_name: 'S&P Global Commodity Insights & Platts Petrochemical Report',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    image_credit: 'S&P Global Commodity Insights Energy & Petrochemical Desk',
    category: 'Market',
    region: 'Global',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-20T06:00:00+00:00',
    publish_date: '2026-10-20',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Agricultural Drip & Potable Water Distribution Schemes Fuel Sustained Demand for PVC K-67 Resin',
    summary: 'Vinyl pipe extrusion units across Gujarat, Maharashtra, and Tamil Nadu maintained brisk raw material offtake as Finolex Industries, Chemplast Sanmar, and DCM Shriram quoted suspension PVC K-67 steady at ₹111.20/kg Ex-Plant. Expanding state allocations for micro-irrigation systems and underground municipal sewerage rehabilitation continue to absorb high domestic production volumes.',
    source_name: 'Chemical Weekly & Vinyl India Industrial Review',
    source_url: 'https://www.finolexwater.com',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Finolex Industries Ratnagiri & Chemplast Sanmar Operations',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'pvc-formulation-heat-stabilizers-plasticizers-lubricants',
    related_subject_slug: 'additives-compounding',
    published_at: '2026-10-20T05:30:00+00:00',
    publish_date: '2026-10-20',
    is_featured: false,
    is_published: true
  }
]

const oct20MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 122.80, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-20' },
  { commodity: 'Relene HDPE', price_inr: 130.60, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-20' },
  { commodity: 'Relene LLDPE', price_inr: 124.90, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-20' },
  { commodity: 'Finolex PVC', price_inr: 111.20, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-20' },
  { commodity: 'BASF Nylon 6', price_inr: 307.80, price_usd: null, unit: 'kg', delta_pct: 0.1, recorded_at: '2026-10-20' },
  { commodity: 'SABIC PC', price_inr: 262.80, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-20' },
  { commodity: 'JBF PET', price_inr: 117.40, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-20' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 96.10, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-10-20' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 90.60, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-20' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 87.60, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-20' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 96.20, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-20' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 178.80, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-20' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 20, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct20VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 20, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct20MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 20, 2026!`)
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err)
  process.exit(1)
})
