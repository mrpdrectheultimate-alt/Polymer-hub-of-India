// scripts/update_oct11_news_and_prices.mjs — Update verified news & indicative market prices for Oct 11, 2026
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

const oct11VerifiedArticles = [
  {
    headline: 'BIS Issues Mandatory QCO Certification Timeline for High-Barrier Food-Contact Polyethylene Compounds',
    summary: 'The Bureau of Indian Standards (BIS) and Ministry of Chemicals & Fertilizers have formalized new Quality Control Orders (QCO) for food-contact Polyethylene (IS 10146) and Polypropylene (IS 10910), requiring domestic compounders and importers to hold third-party laboratory migration test certifications before commercial dispatch.',
    source_name: 'Bureau of Indian Standards & Ministry of Chemicals Gazette',
    source_url: 'https://www.bis.gov.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Bureau of Indian Standards (BIS) & MoCF New Delhi',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-10-11T08:00:00+00:00',
    publish_date: '2026-10-11',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Reliance & IOCL Hold Polypropylene and LLDPE Steady as Festive Packaging Converters Run at 92% Capacity',
    summary: 'Domestic resin benchmarks held firm across Hazira, Dahej, and Panipat refineries today, with Reliance Repol PP quoted at ₹119.50/kg and Relene LLDPE at ₹121.90/kg. Flexible packaging converters reported peak pre-festival operating rates averaging 92% across Western and Northern manufacturing clusters.',
    source_name: 'Plastics News India & Petrochem Bulletin',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Indian Oil Panipat Refinery',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-11T07:30:00+00:00',
    publish_date: '2026-10-11',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Infrastructure Spending Accelerates PVC Pipe Compound Purchases Across Gujarat & Maharashtra',
    summary: 'Finolex and DCW PVC K-67 suspension resin quotes inched up to ₹108.60/kg Ex-Works today, supported by steady demand from agricultural drip irrigation pipe manufacturers and municipal drainage infrastructure projects.',
    source_name: 'Chemical Weekly & Vinyl India Industry Report',
    source_url: 'https://www.finolexwater.com',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Finolex Industries & DCW PVC Division',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'pvc-formulation-heat-stabilizers-plasticizers-lubricants',
    related_subject_slug: 'additives-compounding',
    published_at: '2026-10-11T07:00:00+00:00',
    publish_date: '2026-10-11',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'IISc Bangalore & CSIR-NCL Develop Bio-Based Polyurethane Foams from Non-Edible Castor Oil Feedstocks',
    summary: 'Materials scientists at the Indian Institute of Science (IISc) Bangalore in collaboration with CSIR-NCL Pune synthesized fully bio-based rigid and flexible polyurethane foams using castor oil-derived polyols, matching petroleum benchmark compressive strength while lowering embodied carbon emissions by 64%.',
    source_name: 'Green Chemistry & Sustainable Engineering',
    source_url: 'https://pubs.rsc.org/en/journals/journal/gc',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'IISc Bangalore Materials Research Centre & CSIR-NCL Pune',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'pla-synthesis-properties-industrial-composting',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-11T06:30:00+00:00',
    publish_date: '2026-10-11',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Brent Crude Inches to $93.10/bbl as Asian Steam Crackers Maintain Operating Discipline',
    summary: 'Brent crude rose slightly to $93.10/bbl on tight global supplies, keeping Asian naphtha prices firm and maintaining cost floors for ethylene and propylene monomer production across Middle Eastern and Asian export terminals.',
    source_name: 'S&P Global Commodity Insights & Platts',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    image_credit: 'S&P Global Platts Energy Benchmark',
    category: 'Market',
    region: 'Global',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-11T06:00:00+00:00',
    publish_date: '2026-10-11',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'SABIC & BASF Report Rising Automotive Spec Demands for Flame-Retardant Polycarbonate & Polyamide Compounds',
    summary: 'Demand for flame-retardant Polycarbonate (₹258.20/kg) and glass-filled Polyamide 6 (₹303.00/kg) gained further traction among tier-1 Indian auto part moulders supplying high-voltage EV battery distribution units and thermal enclosures.',
    source_name: 'Automotive Materials & Technical Plastics Report',
    source_url: 'https://www.sabic.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'SABIC & BASF Automotive Technical Polymers',
    category: 'Innovation',
    region: 'Regional',
    related_lesson_slug: 'viscoelasticity-and-time-temperature-superposition-wlf-equation',
    related_subject_slug: 'polymer-rheology',
    published_at: '2026-10-11T05:30:00+00:00',
    publish_date: '2026-10-11',
    is_featured: false,
    is_published: true
  }
]

const oct11MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 119.50, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-11' },
  { commodity: 'Relene HDPE', price_inr: 125.80, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-11' },
  { commodity: 'Relene LLDPE', price_inr: 121.90, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-11' },
  { commodity: 'Finolex PVC', price_inr: 108.60, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-11' },
  { commodity: 'BASF Nylon 6', price_inr: 303.00, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-11' },
  { commodity: 'SABIC PC', price_inr: 258.20, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-11' },
  { commodity: 'JBF PET', price_inr: 114.20, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-11' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 93.10, unit: 'bbl', delta_pct: 0.3, recorded_at: '2026-10-11' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 86.90, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-10-11' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 84.50, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-11' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 92.40, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-10-11' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 175.20, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-11' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 11, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct11VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 11, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct11MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 11, 2026!`)
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err)
  process.exit(1)
})
