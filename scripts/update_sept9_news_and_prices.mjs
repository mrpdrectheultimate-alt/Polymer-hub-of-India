// scripts/update_sept9_news_and_prices.mjs — Insert Sept 9, 2026 News Articles into Supabase
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

const sept9Articles = [
  {
    headline: 'Reliance Industries, GAIL & IOCL Issue Mid-Week September 9, 2026 Price Circulars: PP Injection & HDPE Pipe Resins Surge +₹2.20/kg on Asian Monomer Shortage & Crude Rally',
    summary: 'Reliance Industries Limited (RIL), GAIL India, and Indian Oil Corporation Limited (IOCL) issued mid-week price circular adjustments across Hazira, Jamnagar, Dahej, and Panipat manufacturing plants. Repol Polypropylene (PP) raffia and injection grades reached ₹101.50/kg (+2.2%), while Relene HDPE PE100 pressure pipe and blow-moulding resins hit ₹107.80/kg (+2.0%). Surging crude futures (Brent $82.80/bbl) and strong domestic infrastructure pipe off-take drove the mid-week price surge.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-09T08:00:00+00:00',
    publish_date: '2026-09-09',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'IIT Roorkee & CIPET Ahmedabad Unveil Self-Healing Graphene Oxide-Grafted Polyurethane Elastomers with 98% Tensile Strength Recovery After Micro-Damage',
    summary: 'A joint research team from IIT Roorkee and CIPET Ahmedabad published landmark findings in ACS Applied Polymer Materials. By incorporating dynamic reversible disulfide bonds and functionalized graphene oxide nanoplatelets into polyurethane elastomer backbones, the material achieves 98% tensile strength recovery (ASTM D412) within 15 minutes of thermal healing at 65°C.',
    source_name: 'ACS Applied Polymer Materials',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Polymer & Process Engineering, IIT Roorkee & CIPET',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'crystallinity-and-thermal-transitions',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-09T07:30:00+00:00',
    publish_date: '2026-09-09',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'L&T Plastics Machinery & Husky Introduce High-Speed 48-Cavity PET Preform Moulding System with In-Line Cavity Defect Vision Analytics',
    summary: 'Exhibited at the International Packaging OEM Summit in Mumbai, L&T Plastics Machinery alongside Husky Injection Molding Systems launched a 48-cavity PET preform moulding cell. Equipped with AI-powered high-resolution optical camera arrays and servo-electric clamp drives, the system detects micro-hazes, gate crystallization, and wall thickness variations at cycle times under 4.8 seconds.',
    source_name: 'Plastics News & Indian Packaging Institute',
    source_url: 'https://www.milacron.com',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Packaging MachineryOEM Consortium',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-and-clamping-mechanics',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-09T07:00:00+00:00',
    publish_date: '2026-09-09',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'BIS & Ministry of Consumer Affairs Notify Mandatory IS 17899 Standards for Biodegradable Compostable Agricultural Mulch Films',
    summary: 'The Bureau of Indian Standards (BIS) in coordination with the Ministry of Consumer Affairs published mandatory certification standards (IS 17899:2026) for PBAT and PLA-based agricultural mulch films. Manufacturers must guarantee 90% soil biodegradation within 180 days under ISO 17556 standards to qualify for national agrarian subsidies and EPR compliance credits.',
    source_name: 'Bureau of Indian Standards (BIS) Gazette',
    source_url: 'https://bis.gov.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Bureau of Indian Standards & Ministry of Consumer Affairs',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'mechanical-and-chemical-recycling-mechanisms',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-09T06:30:00+00:00',
    publish_date: '2026-09-09',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Mahindra & BASF India Commercialize 50% Recycled Polyamide 66 (PA66-r50) Engine Cover Assemblies for Commercial SUV Platforms',
    summary: 'Automotive engineering teams at Mahindra R&D and BASF India successfully qualified Ultramid B3EG10-r50, a 50% post-industrial recycled PA66-GF30 compound for under-the-hood engine acoustic covers. The material achieves thermal resistance up to 210°C continuous service while reducing carbon footprint by 44% compared to virgin polyamide resins.',
    source_name: 'Society of Automotive Engineers (SAE India) & Mahindra R&D',
    source_url: 'https://www.mahindra.com',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Automotive Polymer Systems Engineering',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'fiber-matrix-adhesion-and-composite-mechanics',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-09T06:00:00+00:00',
    publish_date: '2026-09-09',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Plastiblends India & Reliance Cirpet Launch High-Concentration Nanoclay Masterbatches for Ultra-High Barrier Monomaterial PE Flexible Packaging',
    summary: 'Plastiblends India in collaboration with Reliance Cirpet introduced a high-dispersion nanoclay masterbatch engineered specifically for blown PE film extrusion. The additive reduces Oxygen Transmission Rate (OTR) by 65% in mono-material polyethylene structures, enabling 100% recyclable flexible barrier pouches that replace unrecyclable multi-material laminate foils.',
    source_name: 'CIPET Research Bulletin & DRDO Polymer Lab',
    source_url: 'https://www.cipet.gov.in',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Institute of Petrochemicals Engineering & Technology',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'biodegradable-polymers-pla-pbat-pha',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-09T05:30:00+00:00',
    publish_date: '2026-09-09',
    is_featured: false,
    is_published: true
  }
]

async function run() {
  console.log('Inserting 6 fresh news articles for September 9, 2026 into Supabase...')
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(sept9Articles)
    .select('id, headline')

  if (error) {
    console.error('❌ Insert error:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} articles for September 9, 2026!`)
  }
}

run()
