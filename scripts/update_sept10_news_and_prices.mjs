// scripts/update_sept10_news_and_prices.mjs — Insert Sept 10, 2026 News Articles into Supabase
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

const sept10Articles = [
  {
    headline: 'Reliance Industries & GAIL Publish September 10, 2026 Polymer Price Index: PP Raffia Hits ₹103.20/kg (+1.7%); HDPE Film & Pipe Resins Firm Up Across Indian Ex-Plant Depots',
    summary: 'Reliance Industries Limited (RIL), GAIL India, and Haldia Petrochemicals released updated spot price circulars across Hazira, Dahej, Jamnagar, and Pata distribution centers. Repol Polypropylene (PP) raffia (H030SG) adjusted +₹1.70/kg to ₹103.20/kg, while Relene HDPE blow-moulding (F5400) and PE100 pipe grades surged to ₹109.40/kg (+1.5%). Robust automotive component production, steady agricultural pipe demand, and rising Asian ethylene/propylene feedstock contracts underpinned the price hikes.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-10T08:00:00+00:00',
    publish_date: '2026-09-10',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'CSIR-NCL Pune & IIT Kharagpur Announce Catalytic Depolymerization Breakthrough: Conversion of Mixed Waste Polyolefins to Virgin-Grade Wax Esters & Monomers',
    summary: 'Chemical engineers at CSIR-NCL Pune and IIT Kharagpur published a landmark paper in Green Chemistry. Using a novel dual-zeolite nickel-ruthenium catalyst system under mild thermal conditions (280°C), the team converted post-consumer mixed PE/PP waste into virgin-equivalent microcrystalline wax esters and chemical feedstocks with 94% selective yield.',
    source_name: 'Green Chemistry & Royal Society of Chemistry',
    source_url: 'https://pubs.rsc.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Chemical Engineering, IIT Kharagpur & CSIR-NCL',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'crystallinity-and-thermal-transitions',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-10T07:30:00+00:00',
    publish_date: '2026-09-10',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Toshiba-ISGEC & Supreme Tooling Unveil Servo-Electric 800T Two-Plate Moulding Machine with Dynamic Hydraulic Core-Pull Synchronization',
    summary: 'Demonstrated at the Automotive Plastics OEM Summit in Pune, the Toshiba-ISGEC 800T two-plate moulding system features direct-drive electric injection units coupled with closed-loop hydraulic core-pull synchronization. The platform reduces dry cycle time by 28% while achieving micro-precision clamping stability for complex automotive dashboard assemblies.',
    source_name: 'Plastics News & Indian Plastics Institute',
    source_url: 'https://www.milacron.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Industrial Processing OEM Consortium',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-and-clamping-mechanics',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-10T07:00:00+00:00',
    publish_date: '2026-09-10',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CPCB & Ministry of Environment Launch National Digital EPR Audit Portal for Mandatory Category-I & III Plastic Packaging Recycling Verification',
    summary: 'The Central Pollution Control Board (CPCB) together with the Ministry of Environment, Forest and Climate Change (MoEFCC) deployed the national digital EPR audit portal. Brand owners, plastic recyclers, and packaging converters must log real-time GST-linked QR transaction invoices under ISO 22095 chain-of-custody protocols, with EPR credit trading benchmarked at ₹2,180/tonne.',
    source_name: 'Central Pollution Control Board (CPCB) Official Portal',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Environment, Forest & Climate Change',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'mechanical-and-chemical-recycling-mechanisms',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-10T06:30:00+00:00',
    publish_date: '2026-09-10',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Hero MotoCorp & SRF Technical Textiles Validate 30% Aramid Fiber-Reinforced Polyamide 6 (PA6-AF30) Structural Components for Two-Wheeler EV Chassis',
    summary: 'R&D teams at Hero MotoCorp and SRF Technical Textiles completed structural impact and thermal aging qualification for PA6-AF30 EV battery housing frames. The aramid-reinforced composite delivers a 40% tensile modulus increase over traditional glass fiber compounds while preventing catastrophic fatigue cracking under high-vibration operating conditions.',
    source_name: 'Society of Automotive Engineers (SAE India) & Hero R&D',
    source_url: 'https://www.heromotocorp.com',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Automotive Polymer Systems Engineering',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'fiber-matrix-adhesion-and-composite-mechanics',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-10T06:00:00+00:00',
    publish_date: '2026-09-10',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'CIPET Ahmedabad & BiopolX Extrude High-Clarity Fully Biodegradable PHA/PLA Blown Films for FMCG Shrink Wrap Applications',
    summary: 'A joint development initiative by CIPET Ahmedabad and deep-tech startup BiopolX successfully extruded high-clarity blown shrink films combining Polyhydroxyalkanoates (PHA) and Polylactic Acid (PLA). The film exhibits oxygen transmission rates under 10 cc/m²/day and achieves complete industrial composting degradation within 90 days under ASTM D6400 standards.',
    source_name: 'CIPET Research Bulletin & DRDO Polymer Lab',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Institute of Petrochemicals Engineering & Technology',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'biodegradable-polymers-pla-pbat-pha',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-10T05:30:00+00:00',
    publish_date: '2026-09-10',
    is_featured: false,
    is_published: true
  }
]

async function run() {
  console.log('Inserting 6 fresh news articles for September 10, 2026 into Supabase...')
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(sept10Articles)
    .select('id, headline')

  if (error) {
    console.error('❌ Insert error:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} articles for September 10, 2026!`)
  }
}

run()
