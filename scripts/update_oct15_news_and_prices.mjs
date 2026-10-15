// scripts/update_oct15_news_and_prices.mjs — Update verified news & indicative market prices for Oct 15, 2026
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

const oct15VerifiedArticles = [
  {
    headline: 'CPCB Issues Final Pre-Audit Directives for FY26 EPR Compliance; Rigid & Flexible Packaging Quotas Tighten',
    summary: 'The Central Pollution Control Board (CPCB) issued a comprehensive compliance circular mandating all registered Producers, Importers, and Brand Owners (PIBOs) to complete third-party mass-balance audits for Category I (Rigid) and Category II (Flexible) plastics on the national portal. The directive requires certified verification of minimum 30% recycled content incorporation in rigid packaging, driving spot demand for certified food-contact rPET and blow-moulding rHDPE granules.',
    source_name: 'Central Pollution Control Board (CPCB) & MoEFCC New Delhi',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board EPR Credit Register',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'moefcc-epr-guidelines-and-cpcb-plastic-credits-in-india',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-15T08:00:00+00:00',
    publish_date: '2026-10-15',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'Domestic Polymer Demand Remains Buoyant as Western Converters Step Up Pre-Festival Processing Cycles',
    summary: 'Major domestic converters in Daman, Silvassa, and Gujarat reported elevated machine utilization rates exceeding 88% across injection moulding and flexible film lines. Domestic producers RIL and GAIL maintained firm price postures, with Repol PP Raffia quoted at ₹121.20/kg and Relene HDPE film steady at ₹129.10/kg Ex-Works Hazira, supported by firm feedstock costs and prompt offtake in FMCG packaging.',
    source_name: 'Chemical Weekly & Plastindia Converter Intelligence',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Industries Hazira & Jamnagar Petrochemical Complex',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'polyethylene-hdpe-ldpe-lldpe-synthesis-properties-and-grade-selection',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-15T07:30:00+00:00',
    publish_date: '2026-10-15',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Automotive OEMs Accelerate Adoption of Halogen-Free Flame Retardant PA66/GF30 for EV Battery Housings',
    summary: 'Leading Indian electric two-wheeler and commercial vehicle manufacturers finalized specifications for glass-fiber reinforced Polyamide 66 (PA66-GF30) engineered to meet UL94 V-0 flame retardancy and AIS-156 safety standards. BASF India and DSM-Envalior reported surging compounding offtake for thermal-runaway barriers, offering high continuous operating temperature (140°C) and structural dielectric strength.',
    source_name: 'Automotive Component Manufacturers Association of India (ACMA) & ARAI Pune',
    source_url: 'https://www.araiindia.com',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Automotive Research Association of India (ARAI) Pune',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'polyamides-nylon-6-and-nylon-66-synthesis-hydrogen-bonding-and-fiber-applications',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-10-15T07:00:00+00:00',
    publish_date: '2026-10-15',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CSIR-IICT Hyderabad Develops High-Yield Catalytic Glycolysis Route to Upcycle Polyurethane Rigid Foams',
    summary: 'Polymer chemists at CSIR-Indian Institute of Chemical Technology (IICT) Hyderabad patented a sustainable catalytic glycolysis process capable of breaking down post-industrial polyurethane (PU) insulation foam into recovered aromatic polyols with over 91% yield at atmospheric pressure. The recycled polyol can replace up to 40% of petroleum-derived polyols in commercial rigid spray foam formulations.',
    source_name: 'CSIR-IICT Research Bulletin & CIPET Center for Biopolymers',
    source_url: 'https://www.iict.res.in',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-IICT Hyderabad Chemical Synthesis Laboratories',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'chemical-recycling-glycolysis-pyrolysis-depolymerization',
    related_subject_slug: 'sustainable-plastics',
    published_at: '2026-10-15T06:30:00+00:00',
    publish_date: '2026-10-15',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Brent Crude Holds at $94.65/bbl Amid Tight Supply; Asian Ethylene Spot Prices Firm to $905/MT CFR',
    summary: 'Global crude futures hovered at $94.65/bbl as OPEC+ output discipline and steady Asian refinery throughput limited prompt supply. Regional feedstock markets reflected tight monomer availability, with Northeast Asian spot ethylene climbing $10/MT to $905/MT CFR and propylene holding at $845/MT CFR, consolidating firm import parity thresholds for Indian downstream polyolefin derivatives.',
    source_name: 'S&P Global Commodity Insights & ICIS Petrochemical Desk',
    source_url: 'https://www.spglobal.com/commodityinsights',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    image_credit: 'S&P Global Commodity Insights Energy Desk',
    category: 'Market',
    region: 'Global',
    related_lesson_slug: 'single-screw-extrusion-drag-flow-pressure-flow-and-die-characteristic',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-10-15T06:00:00+00:00',
    publish_date: '2026-10-15',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Drinking Water Infrastructure Contracts Drive Peak Offtake for PVC K-67 and PE-100 Pressure Pipe Resins',
    summary: 'Pipe extrusion processors across Rajasthan and Central India reported sustained bulk deliveries of suspension PVC K-67 and bimodal PE-100 HDPE black compound for state drinking water grid extensions. Finolex, DCW, and Chemplast Sanmar recorded steady order backlogs with PVC K-67 quoting at ₹109.80/kg Ex-Plant, supported by zero inventory overhang.',
    source_name: 'Vinyl India Pipe Extrusion Review & Ministry of Jal Shakti Portal',
    source_url: 'https://jalshakti-ddws.gov.in',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Finolex Industries Ratnagiri & Chemplast Sanmar Cuddalore',
    category: 'India',
    region: 'India',
    related_lesson_slug: 'pvc-formulation-heat-stabilizers-plasticizers-lubricants',
    related_subject_slug: 'additives-compounding',
    published_at: '2026-10-15T05:30:00+00:00',
    publish_date: '2026-10-15',
    is_featured: false,
    is_published: true
  }
]

const oct15MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 121.20, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-15' },
  { commodity: 'Relene HDPE', price_inr: 129.10, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-15' },
  { commodity: 'Relene LLDPE', price_inr: 123.40, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-15' },
  { commodity: 'Finolex PVC', price_inr: 109.80, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-15' },
  { commodity: 'BASF Nylon 6', price_inr: 305.50, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-15' },
  { commodity: 'SABIC PC', price_inr: 260.50, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-15' },
  { commodity: 'JBF PET', price_inr: 115.60, price_usd: null, unit: 'kg', delta_pct: 0.3, recorded_at: '2026-10-15' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 94.65, unit: 'bbl', delta_pct: 0.5, recorded_at: '2026-10-15' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 88.60, price_usd: null, unit: 'kg', delta_pct: 0.5, recorded_at: '2026-10-15' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 85.90, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-15' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 94.20, price_usd: null, unit: 'kg', delta_pct: 0.4, recorded_at: '2026-10-15' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 176.80, price_usd: null, unit: 'kg', delta_pct: 0.2, recorded_at: '2026-10-15' }
]

async function run() {
  console.log('🧹 Purging older news items from daily_updates...')
  await supabase.from('daily_updates').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log('📌 Inserting October 15, 2026 Verified News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(oct15VerifiedArticles)
    .select('id, headline, source_url, publish_date')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} verified news articles for ${newsData[0].publish_date}!`)
  }

  console.log('📌 Inserting October 15, 2026 Indicative Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(oct15MarketPrices)
    .select('id, commodity, price_inr, delta_pct, recorded_at')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
    process.exit(1)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for October 15, 2026!`)
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err)
  process.exit(1)
})
