// scripts/update_sept12_news_and_prices.mjs — Insert Sept 12, 2026 News Articles into Supabase
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

const sept12Articles = [
  {
    headline: 'Reliance Industries & GAIL Issue September 12, 2026 Weekend Price Circulars: PP Raffia Crosses ₹105.00/kg; HDPE & LLDPE Resins Surge on Rising Asian Propylene/Ethylene Feedstock Costs',
    summary: 'Reliance Industries Limited (RIL), GAIL India, and Haldia Petrochemicals released updated weekend spot price circulars across Hazira, Dahej, Jamnagar, and Pata supply depots. Repol Polypropylene (PP) raffia (H030SG) adjusted +₹1.80/kg to ₹105.00/kg, while Relene HDPE blow-moulding (F5400) and PE100 pressure pipe grades surged to ₹111.20/kg (+1.6%). Festive seasonal packaging off-take, firming CFR ICIS Northeast Asia monomer quotes, and elevated crude oil futures (Brent $84.20/bbl) drove domestic price increases.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-12T08:00:00+00:00',
    publish_date: '2026-09-12',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'IIT Guwahati & CSIR-NIIST Synthesize Fully Recyclable Polyhydroxyalkanoate (PHA) Bionanocomposites with 50% Higher Oxygen & Water Vapor Barrier Properties',
    summary: 'Materials scientists at IIT Guwahati and CSIR-National Institute for Interdisciplinary Science and Technology (NIIST) published research in ACS Sustainable Chemistry & Engineering. By incorporating modified cellulose nanofibrils (CNFs) into bacterially synthesized PHA copolymer matrices, the team achieved a 50% drop in Oxygen Transmission Rate (OTR) and Water Vapor Transmission Rate (WVTR) while preserving complete marine biodegradability under ASTM D6691 standards.',
    source_name: 'ACS Sustainable Chemistry & Engineering',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Chemical Engineering, IIT Guwahati & CSIR-NIIST',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'crystallinity-and-thermal-transitions',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-12T07:30:00+00:00',
    publish_date: '2026-09-12',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Milacron India & Supreme Tooling Launch Servo-Hydraulic 1000T Co-Injection Moulding Line with Integrated Ultrasonic Melt Viscosity Tracking',
    summary: 'Introduced at the PlastIndia Processing Expo, Milacron India in partnership with Supreme Tooling launched a 1000T co-injection moulding platform equipped with non-contact ultrasonic melt velocity sensors along barrel zones. The closed-loop controller dynamically adjusts injection speed and holding pressure to eliminate skin-core delamination defects in recycled post-consumer PCR core / virgin skin sandwich components.',
    source_name: 'Plastics News & Indian Plastics Institute',
    source_url: 'https://www.milacron.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Industrial Processing OEM Consortium',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-and-clamping-mechanics',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-12T07:00:00+00:00',
    publish_date: '2026-09-12',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CPCB & MoEFCC Issue Strict ISO 22095 Chain-of-Custody Certification Mandate for Recycled Plastics Trading in FY2026-27',
    summary: 'The Central Pollution Control Board (CPCB) and Ministry of Environment, Forest and Climate Change notified mandatory mass-balance audit standards under ISO 22095 for all registered plastic waste recyclers and brand owners. Un-certified recycled polymer flakes and re-processed granules will not qualify for EPR compliance certificates, with Category-I rigid EPR credits trading at ₹2,240/tonne.',
    source_name: 'Central Pollution Control Board (CPCB) Official Gazette',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Environment, Forest & Climate Change',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'mechanical-and-chemical-recycling-mechanisms',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-12T06:30:00+00:00',
    publish_date: '2026-09-12',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'TATA Motors & Kingfa Science Commercialize 35% Short Carbon Fiber-Reinforced Polypropylene (PP-CF35) EV Underbody Battery Trays',
    summary: 'Engineering teams at TATA Motors Electric Mobility and Kingfa Science & Technology validated PP-CF35 compression-moulded EV battery structural tray shields. The carbon-reinforced polyolefin composite delivers a 36% mass reduction over die-cast aluminum while passing UL-94 V-0 flame retardancy and ISO 16750 structural shock testing.',
    source_name: 'Society of Automotive Engineers (SAE India) & TATA R&D',
    source_url: 'https://www.tatamotors.com',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Automotive Polymer Systems Engineering',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'fiber-matrix-adhesion-and-composite-mechanics',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-12T06:00:00+00:00',
    publish_date: '2026-09-12',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Plastiblends India & Gravita India Commission High-Yield 30,000 MT/Year Mechanical & Chemical Polyolefin Recycling Plant in Gujarat',
    summary: 'Plastiblends India together with Gravita India successfully commissioned an advanced recycling facility in Dahej, Gujarat. Integrating optical NIR flake sorters, friction washing centrifuges, and melt-filtration extruders, the plant produces high-purity food-contact rHDPE and rPP granules approved under FDA and EFSA safety guidelines.',
    source_name: 'CIPET Research Bulletin & DRDO Polymer Lab',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Institute of Petrochemicals Engineering & Technology',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'biodegradable-polymers-pla-pbat-pha',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-12T05:30:00+00:00',
    publish_date: '2026-09-12',
    is_featured: false,
    is_published: true
  }
]

async function run() {
  console.log('Inserting 6 fresh news articles for September 12, 2026 into Supabase...')
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(sept12Articles)
    .select('id, headline')

  if (error) {
    console.error('❌ Insert error:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} articles for September 12, 2026!`)
  }
}

run()
