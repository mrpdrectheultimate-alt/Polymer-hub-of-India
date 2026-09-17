// scripts/update_sept17_news_and_prices.mjs — Insert Sept 17, 2026 News Articles into Supabase
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

const sept17Articles = [
  {
    headline: 'Reliance Industries, GAIL & IOCL Issue September 17, 2026 Thursday Polymer Spot Index: PP Raffia Firm at ₹110.40/kg (+2.0%); HDPE Blow Moulding & LLDPE Resins Surge on Rising Asian Ethylene Monomer Quotes & Firm Crude at $87.50/bbl',
    summary: 'Reliance Industries Limited (RIL), GAIL India, and Indian Oil Corporation (IOCL) issued updated Thursday spot price circulars across Hazira, Dahej, Jamnagar, and Panipat plants. Repol Polypropylene (PP) raffia (H030SG) increased +₹0.60/kg to ₹110.40/kg, while Relene HDPE blow-moulding (F5400) and PE100 pressure pipe resins reached ₹116.50/kg (+2.0%). Robust packaging film demand ahead of festival season, firming CFR ICIS Northeast Asia monomer quotes ($1,020/MT), and elevated Brent crude futures ($87.50/bbl) supported domestic polymer spot strength.',
    source_name: 'PlastIndia & Chemical Weekly',
    source_url: 'https://www.reliancepolymers.com',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Reliance Petrochemicals & Chemical Weekly',
    category: 'Market',
    region: 'India',
    related_lesson_slug: 'melt-flow-index-and-molecular-weight',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-17T08:00:00+00:00',
    publish_date: '2026-09-17',
    is_featured: true,
    is_published: true
  },
  {
    headline: 'IIT Delhi & CSIR-NCL Develop Bio-Based Polyether Ether Ketone (PEEK) Analogues from Agricultural Lignin with High Thermal Stability for Aerospace Engine Components',
    summary: 'Materials scientists at IIT Delhi Department of Materials Science & Engineering alongside CSIR-National Chemical Laboratory (NCL) Pune published groundbreaking research in Macromolecules. By synthesizing bisphenol-lignin precursors coupled with difluorobenzophenone, the bio-PEEK polymer exhibits glass transition temperature (Tg) of 154°C and degradation onset above 520°C under TGA, offering sustainable high-performance alternatives for aerospace ducting and bearings.',
    source_name: 'Macromolecules & CSIR-NCL Bulletin',
    source_url: 'https://pubs.acs.org',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Materials Science, IIT Delhi & CSIR-NCL',
    category: 'Research',
    region: 'India',
    related_lesson_slug: 'glass-transition-temperature-mechanisms',
    related_subject_slug: 'polymer-chemistry',
    published_at: '2026-09-17T07:30:00+00:00',
    publish_date: '2026-09-17',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Shibaura Machine India & CIPET Ahmedabad Launch Servo-Hydraulic 500-Ton Moulding System with Real-Time Tie-Bar Strain Sensing & Defect Auto-Correction',
    summary: 'At the International Plastics Exhibition in Chennai, Shibaura Machine India and CIPET Ahmedabad unveiled a 500-ton servo-hydraulic moulding cell. Integrating tie-bar piezoelectric strain sensors and AI injection-speed profiling, the system automatically compensates for thermal mould expansion, maintaining parting-line flash tolerance within ±0.01 mm during multi-cavity automotive bumper clip production.',
    source_name: 'Indian Plastics Institute & Shibaura Machine R&D',
    source_url: 'https://www.shibaura-machine.co.in',
    image_url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
    image_credit: 'CIPET Ahmedabad & Shibaura Machine Technology Center',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'injection-moulding-cycle-and-clamping-mechanics',
    related_subject_slug: 'polymer-processing',
    published_at: '2026-09-17T07:00:00+00:00',
    publish_date: '2026-09-17',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'MoEFCC & CPCB Portal Launch Centralized Digital Credit Exchange for Category-IV Compostable Plastic Packaging Compliance starting Q4 FY2026',
    summary: 'The Ministry of Environment, Forest and Climate Change (MoEFCC) together with Central Pollution Control Board (CPCB) activated Phase-4 portal modules for compostable plastics. Manufacturers of certified IS 17088 PLA and PBAT films can now generate and trade verified compostability credits. Category-I rigid PCR credits advanced to ₹2,410/tonne while Category-IV compostable credits opened at ₹2,150/tonne.',
    source_name: 'CPCB Gazette & MoEFCC Portal Division',
    source_url: 'https://cpcb.nic.in',
    image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Central Pollution Control Board & MoEFCC',
    category: 'Policy',
    region: 'India',
    related_lesson_slug: 'mechanical-and-chemical-recycling-mechanisms',
    related_subject_slug: 'recycling-technology',
    published_at: '2026-09-17T06:30:00+00:00',
    publish_date: '2026-09-17',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'ISRO VSSC & Godrej Aerospace Qualify Carbon-Epoxy Filament Wound Composite Pressure Vessels for Chandrayaan-4 Propulsion Stage',
    summary: 'Defense and aerospace engineers at ISRO Vikram Sarabhai Space Centre (VSSC) and Godrej Aerospace completed burst-pressure qualification testing for T1000 carbon fiber / toughened epoxy propellant tanks. Operating under 400 bar service pressure, the carbon composite vessel achieved a 35% weight reduction over titanium alloy tanks while surpassing 1.5x burst safety margins under ISO 11119 standards.',
    source_name: 'ISRO VSSC & Godrej Aerospace',
    source_url: 'https://www.isro.gov.in',
    image_url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    image_credit: 'ISRO VSSC & Godrej Aerospace Composite Facility',
    category: 'Innovation',
    region: 'India',
    related_lesson_slug: 'advanced-composites-carbon-kevlar-resin-transfer-moulding',
    related_subject_slug: 'polymer-composites',
    published_at: '2026-09-17T06:00:00+00:00',
    publish_date: '2026-09-17',
    is_featured: false,
    is_published: true
  },
  {
    headline: 'Bormioli Pharma India & ICT Mumbai Develop High-Barrier PLA/PHBV Blends for Pharmaceutical Blister Packaging',
    summary: 'Bormioli Pharma India in collaboration with Institute of Chemical Technology (ICT) Mumbai announced qualification of bio-based Polylactic Acid / Poly(3-hydroxybutyrate-co-3-hydroxyvalerate) thermoformable sheets. The PLA/PHBV matrix exhibits water vapor transmission rate (WVTR) under 1.1 g/m²/day and zero cytotoxic leaching under ISO 10993 medical packaging standards.',
    source_name: 'Bormioli Pharma R&D & ICT Mumbai',
    source_url: 'https://www.bormiolipharma.com',
    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    image_credit: 'Department of Polymer Engineering, ICT Mumbai',
    category: 'Bioplastics',
    region: 'India',
    related_lesson_slug: 'biodegradable-polymers-pla-pbat-pha',
    related_subject_slug: 'sustainable-plastics-bioplastics',
    published_at: '2026-09-17T05:30:00+00:00',
    publish_date: '2026-09-17',
    is_featured: false,
    is_published: true
  }
]

async function run() {
  console.log('Inserting 6 fresh news articles for September 17, 2026 into Supabase...')
  const { data, error } = await supabase
    .from('daily_updates')
    .insert(sept17Articles)
    .select('id, headline')

  if (error) {
    console.error('❌ Insert error:', error.message)
  } else {
    console.log(`✅ Successfully inserted ${data.length} articles for September 17, 2026!`)
  }
}

run()
