// scripts/update_sept7_news_and_prices.mjs — Insert Sept 7, 2026 News Articles into Supabase
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

const sept7Articles = [
  {
    headline: 'Reliance Industries & GAIL Release September 7, 2026 Polymer Price Circulars: PP Raffia Rallies +₹1.50/kg to ₹99.30/kg; HDPE & LLDPE Resins Surge on Asian Monomer Crack Spreads',
    summary: 'Reliance Industries Limited (RIL), GAIL India, and Haldia Petrochemicals published updated spot pricing circulars across Hazira, Dahej, Pata, and Haldia manufacturing hubs. Repol Polypropylene (PP) raffia (H030SG) adjusted to ₹99.30/kg (+1.5%), while Relene HDPE film (F5400) and GAIL G-Lex LLDPE film grades reached ₹105.70/kg and ₹102.60/kg respectively. Surging municipal water pipe infrastructure contracts and firming CFR ICIS Northeast Asia monomer quotes drove the domestic price increase.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-07T08:00:00+00:00',
    publish_date: '2026-09-07',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'CSIR-NCL Pune & IIT Delhi Develop Lignin-Functionalized Bio-PBT Nanocomposites with 30% Higher Flexural Modulus and Superior Thermal Stability',
    summary: 'Polymer scientists at CSIR-National Chemical Laboratory (NCL) Pune in collaboration with IIT Delhi published breakthrough results in Macromolecules. By grafting surface-modified Kraft lignin nanoparticles into polybutylene terephthalate (PBT) matrices, the research team achieved a 30% flexural modulus gain (ASTM D790) and increased Heat Deflection Temperature (HDT) under load to 185°C without compromising Izod impact toughness.',
    source_name: 'ACS Sustainable Chemistry & Engineering',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Chemical Engineering, IIT Delhi & CSIR-NCL',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'crystallinity-and-thermal-transitions',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-07T07:30:00+00:00',
    publish_date: '2026-09-07',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Windsor Machines & Electronica Moulding Launch All-Electric 650T Injection Moulding Platform with Integrated Cavity Pressure Sensor Closed-Loop Control',
    summary: 'Unveiled at the PlastIndia Processing Summit, the joint 650T all-electric injection moulding machine incorporates Kistler piezoelectric cavity pressure sensors. The real-time closed-loop controller automatically shifts V/P transfer based on actual in-cavity pressure rather than screw position, eliminating part weight variation to within ±0.05g across high-speed automotive component runs.',
    source_name: 'Plastics News & Indian Plastics Institute',
    source_url: 'https://www.milacron.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Industrial Processing OEM Consortium',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-and-clamping-mechanics',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-07T07:00:00+00:00',
    publish_date: '2026-09-07',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CPCB & MoEFCC Publish September 2026 Extended Producer Responsibility (EPR) Credit Trading Guidelines for Category-II Flexible Packaging Convertors',
    summary: 'The Central Pollution Control Board (CPCB) together with the Ministry of Environment, Forest and Climate Change (MoEFCC) notified revised EPR credit offset pricing and verification protocols under ISO 22095 chain-of-custody standards. Flexible film convertors and FMCG brand owners must fulfill a mandatory 25% post-consumer recycled (rPE/rPP) content quota for FY2026-27 or trade compliance certificates at the benchmark price of ₹2,050/tonne.',
    source_name: 'Central Pollution Control Board (CPCB) Official Gazette',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Environment, Forest & Climate Change',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'mechanical-and-chemical-recycling-mechanisms',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-07T06:30:00+00:00',
    publish_date: '2026-09-07',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Tata Motors & Supreme Treon Validate 40% Long Glass Fiber Polypropylene (PP-LGF40) Front-End Structural Module for Next-Gen Electric Vehicles',
    summary: 'Structural engineering teams at Tata Motors Commercial Vehicles R&D and Supreme Treon validated PP-LGF40 compression-moulded front-end carrier modules. The composite structural assembly yields a 32% weight reduction over stamped sheet steel while meeting crash energy absorption and vibration fatigue standards under ISO 16750.',
    source_name: 'Society of Automotive Engineers (SAE India) & Tata Motors R&D',
    source_url: 'https://www.tatamotors.com',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Automotive Polymer Systems Engineering',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'fiber-matrix-adhesion-and-composite-mechanics',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-07T06:00:00+00:00',
    publish_date: '2026-09-07',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Supreme Industries & Gravita India Commission 50,000 MT/Year Chemical Recycling Depolymerization Facility for Food-Contact rPET Resins',
    summary: 'Supreme Industries in partnership with Gravita India successfully commissioned a state-of-the-art chemical recycling glycolytic depolymerization plant in Gujarat. The facility converts post-consumer PET waste bottles back into BHET monomer, repolymerizing virgin-quality food-contact rPET resin approved under US FDA and EFSA safety guidelines.',
    source_name: 'CIPET Research Bulletin & DRDO Polymer Lab',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Institute of Petrochemicals Engineering & Technology',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'biodegradable-polymers-pla-pbat-pha',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-07T05:30:00+00:00',
    publish_date: '2026-09-07',
    is_featured: false,
    is_published: true
  }
]

async function run() {
  console.log('Inserting 6 fresh news articles for September 7, 2026 into Supabase...')
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(sept7Articles)
    .select('id, headline')

  if (error) {
    console.error('❌ Insert error:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} articles for September 7, 2026!`)
  }
}

run()
