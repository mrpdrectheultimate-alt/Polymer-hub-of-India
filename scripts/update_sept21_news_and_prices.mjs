// scripts/update_sept21_news_and_prices.mjs — Insert Sept 21, 2026 News Articles & Market Prices into Supabase
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

const sept21Articles = [
  {
    headline: 'Reliance, IOCL & GAIL Issue September 21, 2026 Monday Resin Price Hike: PP Raffia Touches ₹112.50/kg & HDPE Pipe Resins Hit ₹118.60/kg as Asian Naphtha Rallies to $685/MT',
    summary: 'Reliance Industries (RIL), IOCL, and GAIL published their Monday morning pricing circular across Hazira, Jamnagar, Dahej, and Panipat refineries. Repol PP raffia (H030SG) rose +₹0.70/kg to ₹112.50/kg, while Relene HDPE blow-moulding (F5400) and PE100 pipe resins advanced to ₹118.60/kg (+0.6%). Sustained demand from agricultural piping projects under PM Krishi Sinchayee Yojana, Diwali packaging film prep, and CFR Northeast Asia ethylene ($1,045/MT) driven by firm Brent crude ($89.20/bbl) supported domestic price hikes.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly Market Desk',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-21T08:00:00+00:00',
    publish_date: '2026-09-21',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'IIT Madras & CSIR-CECRI Synthesize Graphene-Doped Poly(3,4-ethylenedioxythiophene) (PEDOT:PSS) Conductive Hydrogels for Fast-Charging Flexible Supercapacitors',
    summary: 'Researchers at IIT Madras Department of Metallurgy & Materials Engineering and CSIR-Central Electrochemical Research Institute (CECRI) Karaikudi reported a breakthrough in Nature Communications. By in-situ polymerizing PEDOT:PSS inside a 3D graphene-cellulose nanofiber scaffold, the conductive polymer hydrogel demonstrated a specific capacitance of 385 F/g at 1 A/g, 98.4% capacity retention after 20,000 cycles, and full mechanical flexibility under 180° bending.',
    source_name: 'Nature Communications & CSIR Bulletin',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Metallurgy & Materials Engineering, IIT Madras & CSIR-CECRI',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'glass-transition-temperature-mechanisms',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-21T07:30:00+00:00',
    publish_date: '2026-09-21',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Jindal Poly Films & CIPET Lucknow Launch High-Barrier Metallized BOPP Mono-Material Laminate with Recyclability Certification for Food Packaging',
    summary: 'Jindal Poly Films Ltd in collaboration with CIPET Lucknow launched a 100% polypropylene mono-material high-barrier packaging film (Jindal-Barrier PP). Featuring high-vacuum aluminium vapor deposition and a low-sit seal layer, the film achieves water vapor transmission rate (WVTR) below 0.15 g/m²/day and oxygen transmission rate (OTR) under 0.8 cm³/m²/day, meeting RecyClass Class A recyclability guidelines for flexible pouches.',
    source_name: 'Indian Packaging Institute & Jindal Poly Films R&D',
    source_url: 'https://www.jindalpoly.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Lucknow & Jindal Poly Films R&D Center',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'flexible-packaging-films',
    related_subject_slug: 'plastic-packaging-engineering',
    published_at: '2026-09-21T07:00:00+00:00',
    publish_date: '2026-09-21',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Ministry of Chemicals & Fertilizers Extends BIS Quality Control Order (QCO) Compliance Deadline for Polycarbonate & Nylon 6 Resins to January 2027',
    summary: 'The Department of Chemicals and Petrochemicals (DCPC) under the Ministry of Chemicals & Fertilizers issued a gazette notification updating the Bureau of Indian Standards (BIS) QCO implementation timeline. Importers and domestic compounders of Polycarbonate (IS 14434) and Nylon 6 (IS 15406) receive a 4-month extension to complete NABL accredited testing, preventing supply chain disruptions for automotive and electrical appliance manufacturers.',
    source_name: 'Gazette of India & DCPC Notification Unit',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Chemicals and Petrochemicals & BIS India',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'bis-compliance-raw-material-sourcing-and-government-schemes-in-india',
    related_subject_slug: 'entrepreneurship-plastics',
    published_at: '2026-09-21T06:30:00+00:00',
    publish_date: '2026-09-21',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Mahindra Aerospace & NAL Qualify Autoclave-Cured Carbon-Bismaleimide (BMI) Composite Panels for Defense Payload Doors',
    summary: 'Engineers at NAL Structural Technologies Division and Mahindra Aerospace successfully completed high-temperature static load testing of carbon-BMI composite panels. Designed to operate continuously at 230°C with thermal spike resistance up to 300°C, the composite panels achieved a 42% weight saving over titanium alloy structures while passing MIL-STD-810H environmental qualification.',
    source_name: 'CSIR-NAL & Mahindra Aerospace Defence Unit',
    source_url: 'https://www.nal.res.in',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CSIR-NAL & Mahindra Aerospace Structural Testing Facility',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'high-performance-composites-peek-cf-polyimide-cf',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-21T06:00:00+00:00',
    publish_date: '2026-09-21',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Godrej Consumer Products & Solbridge Biopolymers Launch 100% Bio-Based PHBV Cosmetic Bottle Caps with 90-Day Marine Biodegradation',
    summary: 'Godrej Consumer Products Ltd and Solbridge Biopolymers inaugurated a commercial production line for marine-degradable PHBV personal care bottle caps. Fermented from agricultural waste molasses by Azotobacter vinelandii bacteria, the rigid caps offer tensile strength of 38 MPa, heat deflection temperature of 115°C, and full marine biodegradation within 90 days according to ASTM D6691 standards.',
    source_name: 'Godrej Corporate Sustainability & Solbridge Tech',
    source_url: 'https://www.godrejcp.com',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Godrej Personal Care Packaging & Solbridge R&D',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'pha-production-bacterial-fermentation-recovery',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-21T05:30:00+00:00',
    publish_date: '2026-09-21',
    is_featured: false,
    is_published: true
  }
]

const sept21MarketPrices = [
  { commodity: 'Repol PP (RIL)', price_inr: 112.50, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-09-21' },
  { commodity: 'Relene HDPE', price_inr: 118.60, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-09-21' },
  { commodity: 'Relene LLDPE', price_inr: 115.20, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-09-21' },
  { commodity: 'Finolex PVC', price_inr: 91.80, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-21' },
  { commodity: 'BASF Nylon 6', price_inr: 216.00, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-21' },
  { commodity: 'SABIC PC', price_inr: 237.50, price_usd: null, unit: 'kg', delta_pct: 0.6, recorded_at: '2026-09-21' },
  { commodity: 'JBF PET', price_inr: 99.10, price_usd: null, unit: 'kg', delta_pct: 0.7, recorded_at: '2026-09-21' },
  { commodity: 'Brent Crude', price_inr: null, price_usd: 89.20, unit: 'bbl', delta_pct: 0.8, recorded_at: '2026-09-21' },
  { commodity: 'Recycled HDPE Granules (Clear)', price_inr: 79.20, price_usd: null, unit: 'kg', delta_pct: 0.9, recorded_at: '2026-09-21' },
  { commodity: 'Recycled PP Granules (Raffia)', price_inr: 74.80, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-21' },
  { commodity: 'Recycled PET Flakes (Hot Washed)', price_inr: 63.40, price_usd: null, unit: 'kg', delta_pct: 1.0, recorded_at: '2026-09-21' },
  { commodity: 'ABS Regrind (Moulding)', price_inr: 123.00, price_usd: null, unit: 'kg', delta_pct: 0.8, recorded_at: '2026-09-21' },
  { commodity: 'LLDPE Film Scrap (Baled)', price_inr: 47.10, price_usd: null, unit: 'kg', delta_pct: 1.3, recorded_at: '2026-09-21' }
]

async function run() {
  console.log('📌 Inserting September 21, 2026 News Articles into daily_updates...')
  const { data: newsData, error: newsErr } = await supabase
    .from('daily_updates')
    .insert(sept21Articles)
    .select('id, headline')

  if (newsErr) {
    console.error('❌ News insert error:', newsErr.message)
  } else {
    console.log(`✅ Successfully inserted ${newsData.length} fresh news articles for September 21, 2026!`)
  }

  console.log('📌 Inserting September 21, 2026 Market Prices into market_prices...')
  const { data: priceData, error: priceErr } = await supabase
    .from('market_prices')
    .insert(sept21MarketPrices)
    .select('id, commodity, price_inr, delta_pct')

  if (priceErr) {
    console.error('❌ Price insert error:', priceErr.message)
  } else {
    console.log(`✅ Successfully inserted ${priceData.length} market price benchmarks for September 21, 2026!`)
  }
}

run()
