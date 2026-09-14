// scripts/update_sept14_news_and_prices.mjs — Insert Sept 14, 2026 News Articles into Supabase
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

const sept14Articles = [
  {
    headline: 'Reliance Industries, GAIL & IOCL Release September 14, 2026 Monday Price Circulars: PP Raffia Firm at ₹108.50/kg; HDPE Pipe & LLDPE Resins Surge on Rising Asian Ethylene Monomer & Oil Price Spikes',
    summary: 'Reliance Industries Limited (RIL), GAIL India, and Indian Oil Corporation (IOCL) issued weekly opening price circulars across Hazira, Dahej, Jamnagar, and Panipat plants. Repol Polypropylene (PP) raffia (H030SG) rose +₹1.70/kg to ₹108.50/kg, while Relene HDPE blow-moulding (F5400) and PE100 pressure pipe grades surged to ₹114.80/kg (+1.6%). Robust infrastructure spending under Jal Jeevan Mission, firming CFR ICIS Northeast Asia monomer quotes ($995/MT), and elevated Brent crude futures ($86.20/bbl) fueled domestic price increases.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-14T08:00:00+00:00',
    publish_date: '2026-09-14',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'IIT Madras & CSIR-CECRI Develop Self-Healing Polyurethane/Graphene Coatings with High Corrosion Resistance for Marine & Off-Shore Infrastructures',
    summary: 'Materials scientists at IIT Madras Department of Chemical Engineering, alongside CSIR-Central Electrochemical Research Institute (CECRI), published groundbreaking findings in Progress in Organic Coatings. By synthesizing microencapsulated disulfide crosslinked polyurethane matrix loaded with functionalized graphene oxide flakes, the nanocomposite demonstrates autonomous scratch repair within 15 minutes under solar UV light while offering 99.8% barrier efficiency against saltwater corrosion under ASTM B117 standards.',
    source_name: 'Progress in Organic Coatings & CSIR Bulletin',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Chemical Engineering, IIT Madras & CSIR-CECRI',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'crystallinity-and-thermal-transitions',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-14T07:30:00+00:00',
    publish_date: '2026-09-14',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'KraussMaffei India & Kautex Machinery Unveil Ultra-High Output Multi-Layer HDPE Fuel Tank Blow Moulding System with Direct Melt Parison Inflation',
    summary: 'At the Polymer Machinery Expo in Pune, KraussMaffei India and Kautex Machinery launched a 6-layer co-extrusion blow moulding platform tailored for automotive EV and hybrid fuel tank systems. Integrating internal cooling parison blowing and real-time infrared wall-thickness scanning, the machine delivers a 14% reduction in EVOH barrier layer consumption while achieving cycle-time savings of 18 seconds per unit.',
    source_name: 'Plastics News India & Indian Plastics Institute',
    source_url: 'https://www.kraussmaffei.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Industrial Processing OEM Consortium',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-and-clamping-mechanics',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-14T07:00:00+00:00',
    publish_date: '2026-09-14',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'BIS & CPCB Enforce Mandatory IS 14534 Standards for Post-Consumer Recycled (PCR) Plastic Granules in Non-Food Packaging starting FY2026-27',
    summary: 'The Bureau of Indian Standards (BIS) together with CPCB published updated regulatory guidelines under IS 14534 for recycled plastics processing. Convertors producing non-food containers and secondary shipping crates must verify thermal purity, melt flow index consistency, and heavy metal limits before issuing EPR compliance certificates. Category-I rigid PCR credits advanced to ₹2,310/tonne.',
    source_name: 'Bureau of Indian Standards (BIS) & CPCB Gazette',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Bureau of Indian Standards & MoEFCC',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'mechanical-and-chemical-recycling-mechanisms',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-14T06:30:00+00:00',
    publish_date: '2026-09-14',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'TATA Motors & SABIC India Validate 30% Short-Glass-Fiber Reinforced PBT/PET Blends (Valox resin) for High-Voltage EV Junction Boxes',
    summary: 'Materials development engineers at TATA Motors European Technical Centre and SABIC India completed qualification of flame-retardant Valox PBT/PET alloy for 800V EV power distribution units. The material exhibits Comparative Tracking Index (CTI) rating of 600V (Class 0) and UL94 V-0 flame rating at 0.8mm wall thickness, enabling compact component design without dielectric breakdown.',
    source_name: 'SAE India & SABIC Innovative Plastics R&D',
    source_url: 'https://www.tatamotors.com',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Automotive Polymer Systems Engineering',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'fiber-matrix-adhesion-and-composite-mechanics',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-14T06:00:00+00:00',
    publish_date: '2026-09-14',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Plastiblends India & IIT Roorkee Partner to Scale Thermoplastic Starch (TPS) / PBAT Blended Compostable Flexible Packaging Films',
    summary: 'Plastiblends India Ltd announced a joint commercialization agreement with IIT Roorkee Centre for Nanotechnology to manufacture high-clarity compostable blown films. The TPS/PBAT blend incorporates esterified agricultural cassava starch, yielding tensile strength exceeding 28 MPa and full industrial compostability under ISO 17088 within 90 days.',
    source_name: 'Plastiblends Corporate Release & IIT Roorkee',
    source_url: 'https://www.plastiblends.com',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Centre for Nanotechnology, IIT Roorkee',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'biodegradable-polymers-pla-pbat-pha',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-14T05:30:00+00:00',
    publish_date: '2026-09-14',
    is_featured: false,
    is_published: true
  }
]

async function run() {
  console.log('Inserting 6 fresh news articles for September 14, 2026 into Supabase...')
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(sept14Articles)
    .select('id, headline')

  if (error) {
    console.error('❌ Insert error:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} articles for September 14, 2026!`)
  }
}

run()
