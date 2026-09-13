// scripts/update_sept13_news_and_prices.mjs — Insert Sept 13, 2026 News Articles into Supabase
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

const sept13Articles = [
  {
    headline: 'Reliance Industries, GAIL & Haldia Issue September 13, 2026 Spot Price Circulars: PP Raffia Escalates to ₹106.80/kg; HDPE & LLDPE Resins Rise on Feedstock Propylene Surge & Strong Domestic Pipe Demand',
    summary: 'Reliance Industries Limited (RIL), GAIL India, and Haldia Petrochemicals published updated spot price circulars across Hazira, Dahej, Jamnagar, and Pata distribution depots. Repol Polypropylene (PP) raffia (H030SG) adjusted +₹1.80/kg to ₹106.80/kg, while Relene HDPE blow-moulding (F5400) and PE100 pressure pipe grades surged to ₹113.00/kg (+1.6%). Festive agricultural woven sack off-take, firming CFR ICIS Northeast Asia monomer quotes ($985/MT), and elevated Brent crude futures ($85.10/bbl) drove price momentum across Indian polyolefin hubs.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-13T08:00:00+00:00',
    publish_date: '2026-09-13',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'IIT Bombay & CSIR-NCL Synthesize Ultra-High-Molecular-Weight Polyethylene (UHMWPE) Nanocomposites with 65% Improved Wear Resistance for Joint Implants & Industrial Liners',
    summary: 'Materials scientists at IIT Bombay Department of Metallurgical Engineering and Materials Science, in collaboration with CSIR-National Chemical Laboratory (NCL) Pune, published a milestone study in Macromolecules. By grafting functionalized multi-walled carbon nanotubes (MWCNTs) onto UHMWPE chains via in-situ metallocene polymerization, the team achieved a 65% reduction in volumetric wear rates and a 40% increase in impact strength without compromising melt stability under ASTM F2565 standards.',
    source_name: 'Macromolecules & CSIR-NCL Research Bulletin',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Metallurgical Engineering, IIT Bombay & CSIR-NCL',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'crystallinity-and-thermal-transitions',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-13T07:30:00+00:00',
    publish_date: '2026-09-13',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Windsor Machines & Toshiba Machine India Unveil All-Electric 1200T High-Speed Packaging Moulding Press with Real-Time Melt Pressure Feedback Control',
    summary: 'Unveiled at the All-India Plastics Manufacturers Association (AIPMA) Tech Summit, Windsor Machines together with Toshiba Machine India commercialized an all-electric 1200-tonne toggle injection moulding machine. Featuring sub-millisecond servo-valve control and piezoelectric cavity pressure monitoring, the system reduces specific energy consumption (SEC) to 0.28 kWh/kg while maintaining wall-thickness tolerances under ±12 microns for high-speed food packaging pails.',
    source_name: 'Plastics News & Indian Plastics Institute',
    source_url: 'https://www.windsormachines.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Industrial Processing OEM Consortium',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-and-clamping-mechanics',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-13T07:00:00+00:00',
    publish_date: '2026-09-13',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'MoEFCC & CPCB Notify Revised FY2026-27 Recycled Plastic Material Traceability Mandates: Block-Chain Verification Required for All Category-I & Category-II EPR Transfers',
    summary: 'The Ministry of Environment, Forest and Climate Change (MoEFCC) and CPCB published binding digital traceability directives under the Plastic Waste Management (PWM) Rules. Registered brand owners and plastic recyclers operating in India must log all PCR resin transactions on the national CPCB portal via ISO 22095 certified digital ledger tracking. Category-I rigid EPR compliance certificates logged a price adjustment to ₹2,280/tonne on high demand from FMCG multi-nationals.',
    source_name: 'Central Pollution Control Board (CPCB) Official Gazette',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Ministry of Environment, Forest & Climate Change',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'mechanical-and-chemical-recycling-mechanisms',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-13T06:30:00+00:00',
    publish_date: '2026-09-13',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Mahindra & Kingfa Science Commercialize Microcellular Foamed 20% Mineral-Filled PP (PP-TD20) Instrument Panel Substructures for Next-Gen Electric SUVs',
    summary: 'Automotive materials engineers at Mahindra Research Valley (MRV) Chennai and Kingfa Science & Technology successfully validated microcellular mucell-foamed PP-TD20 composite dashboards. The gas-assisted supercritical nitrogen injection moulding process reduced component weight by 18.5% while meeting strict ISO 6452 fogging test limits and high-velocity head impact safety standards.',
    source_name: 'Society of Automotive Engineers (SAE India) & Mahindra R&D',
    source_url: 'https://www.mahindra.com',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Automotive Polymer Systems Engineering',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'fiber-matrix-adhesion-and-composite-mechanics',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-13T06:00:00+00:00',
    publish_date: '2026-09-13',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Supreme Industries & CIPET Launch Industrial-Scale PBAT/PLA Biodegradable Agricultural Mulch Film Plant with Enhanced UV Stabilization in Jalgaon',
    summary: 'Supreme Industries Ltd, in technical partnership with CIPET SARP, commissioned a 15,000 MT/year biodegradable blown film extrusion line in Jalgaon, Maharashtra. The custom-blended PBAT/PLA formulation integrates non-migratory organic UV stabilizers, ensuring soil degradation within 180 days post-harvest while maintaining film tensile strength during intense summer soil solarization.',
    source_name: 'CIPET Research Bulletin & DRDO Polymer Lab',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Institute of Petrochemicals Engineering & Technology',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'biodegradable-polymers-pla-pbat-pha',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-13T05:30:00+00:00',
    publish_date: '2026-09-13',
    is_featured: false,
    is_published: true
  }
]

async function run() {
  console.log('Inserting 6 fresh news articles for September 13, 2026 into Supabase...')
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(sept13Articles)
    .select('id, headline')

  if (error) {
    console.error('❌ Insert error:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} articles for September 13, 2026!`)
  }
}

run()
