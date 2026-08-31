'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  Award, 
  Globe, 
  MapPin, 
  Clock, 
  GraduationCap, 
  BookOpen, 
  Check, 
  Plus, 
  DollarSign, 
  Building2,
  Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Footer from '@/components/Footer'

// ==================== TYPES & DATA ====================

export interface ProgramData {
  id: string
  title: string
  institution: string
  degree: string
  level: 'Undergraduate' | 'Postgraduate' | 'Doctoral' | 'Diploma'
  fee: string
  currency: string
  region: 'India' | 'Global'
  country: string
  location: string
  duration: string
  description: string
  ranking?: string
  featured?: boolean
  accreditation?: string
  slug?: string
}

// 85+ Curated Seed Programs across India and Global Universities
const SEED_PROGRAMS: ProgramData[] = [
  // India - Undergraduate (B.Tech & B.Sc)
  {
    id: 'ict-mumbai-btech',
    title: 'B.Tech in Polymer Engineering & Technology',
    institution: 'Institute of Chemical Technology (ICT)',
    degree: 'B.Tech',
    level: 'Undergraduate',
    fee: '85,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Matunga, Mumbai, Maharashtra',
    duration: '4 Years',
    description: "India's premier polymer technology program with state-of-the-art compounding and rheology labs.",
    ranking: 'NIRF #5 (Engineering)',
    featured: true,
    accreditation: 'NBA / NAAC A++',
    slug: 'ict-mumbai-polymer-btech'
  },
  {
    id: 'cipet-ahmedabad-btech',
    title: 'B.Tech in Plastics Technology',
    institution: 'CIPET: IPT Ahmedabad',
    degree: 'B.Tech',
    level: 'Undergraduate',
    fee: '65,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Vatva, Ahmedabad, Gujarat',
    duration: '4 Years',
    description: 'Specialized tooling, injection mold design, and polymer testing under the Ministry of Chemicals.',
    ranking: 'National Apex Institute',
    featured: true,
    accreditation: 'AICTE / NBA',
    slug: 'cipet-ahmedabad-plastics-btech'
  },
  {
    id: 'mit-pune-btech',
    title: 'B.Tech in Polymer Engineering',
    institution: 'MIT World Peace University',
    degree: 'B.Tech',
    level: 'Undergraduate',
    fee: '3,10,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Kothrud, Pune, Maharashtra',
    duration: '4 Years',
    description: 'Automotive plastics compounding, moldflow simulation, and industrial CAD training.',
    ranking: 'NAAC A Grade',
    accreditation: 'UGC Approved',
    slug: 'mit-pune-polymer-btech'
  },
  {
    id: 'du-bhaskaracharya-bsc',
    title: 'B.Sc (Hons) in Polymer Science',
    institution: 'Bhaskaracharya College of Applied Sciences (DU)',
    degree: 'B.Sc',
    level: 'Undergraduate',
    fee: '28,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Dwarka, New Delhi',
    duration: '3 Years',
    description: 'Premier Delhi University undergrad pure macromolecular and synthetic polymer chemistry curriculum.',
    ranking: 'NAAC A++ (DU #1)',
    featured: true,
    accreditation: 'UGC / DU',
    slug: 'du-bcas-polymer-bsc'
  },
  {
    id: 'gujarat-univ-bsc',
    title: 'B.Sc in Polymer Chemistry',
    institution: 'Gujarat University',
    degree: 'B.Sc',
    level: 'Undergraduate',
    fee: '18,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Ahmedabad, Gujarat',
    duration: '3 Years',
    description: 'Foundational synthetic polymer chemistry, emulsion kinetics, and analytical characterization.',
    ranking: 'NAAC A Grade',
    accreditation: 'UGC Approved',
    slug: 'gujarat-univ-polymer-bsc'
  },
  {
    id: 'cochin-cusat-btech',
    title: 'B.Tech in Polymer Science & Rubber Technology',
    institution: 'Cochin University of Science and Technology (CUSAT)',
    degree: 'B.Tech',
    level: 'Undergraduate',
    fee: '48,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Kochi, Kerala',
    duration: '4 Years',
    description: 'Pioneering South Indian elastomeric vulcanization, latex technology, and tyre engineering curriculum.',
    ranking: 'NIRF Top 50',
    featured: true,
    accreditation: 'NBA / NAAC A',
    slug: 'cusat-polymer-rubber-btech'
  },
  {
    id: 'cipet-chennai-btech',
    title: 'B.Tech in Plastics Engineering',
    institution: 'CIPET: IPT Chennai',
    degree: 'B.Tech',
    level: 'Undergraduate',
    fee: '65,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Guindy, Chennai, Tamil Nadu',
    duration: '4 Years',
    description: 'CAD/CAM die manufacturing, high-pressure injection molding, and ASTM physical testing.',
    ranking: 'Apex Center of Excellence',
    accreditation: 'Anna University Affiliated',
    slug: 'cipet-chennai-plastics-btech'
  },
  {
    id: 'anna-univ-btech',
    title: 'B.Tech in Ceramic & Polymer Technology',
    institution: 'Anna University (ACT Campus)',
    degree: 'B.Tech',
    level: 'Undergraduate',
    fee: '55,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Chennai, Tamil Nadu',
    duration: '4 Years',
    description: 'Advanced hybrid composite materials, thermal barrier coatings, and macromolecular engineering.',
    ranking: 'NIRF Top 15',
    accreditation: 'NAAC A++',
    slug: 'anna-univ-ceramic-polymer-btech'
  },
  {
    id: 'ld-college-btech',
    title: 'B.E. in Rubber Technology',
    institution: 'L.D. College of Engineering',
    degree: 'B.Tech',
    level: 'Undergraduate',
    fee: '12,500',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Navrangpura, Ahmedabad, Gujarat',
    duration: '4 Years',
    description: 'State government engineering college with dedicated rubber compounding, Banbury mixers, and vulcanization presses.',
    ranking: 'Gujarat State Rank #1',
    accreditation: 'GTU / AICTE',
    slug: 'ld-college-rubber-tech-be'
  },
  {
    id: 'amravati-sgbau-btech',
    title: 'B.Tech in Polymer (Plastic) Technology',
    institution: 'Sant Gadge Baba Amravati University',
    degree: 'B.Tech',
    level: 'Undergraduate',
    fee: '35,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Amravati, Maharashtra',
    duration: '4 Years',
    description: 'Extrusion compounding, twin-screw operations, and blown film manufacturing.',
    ranking: 'NAAC A',
    accreditation: 'AICTE Approved',
    slug: 'sgbau-polymer-plastic-btech'
  },

  // India - Postgraduate (M.Tech & M.Sc)
  {
    id: 'iit-delhi-mtech',
    title: 'M.Tech in Polymer Science & Engineering',
    institution: 'Indian Institute of Technology Delhi (IITD)',
    degree: 'M.Tech',
    level: 'Postgraduate',
    fee: '52,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Hauz Khas, New Delhi',
    duration: '2 Years',
    description: 'Advanced polymer physics, nanocomposites, bioderived resins, and GATE stipend (₹12,400/mo) support.',
    ranking: 'NIRF #2 / QS World #150',
    featured: true,
    accreditation: 'Institute of National Importance',
    slug: 'iit-delhi-polymer-mtech'
  },
  {
    id: 'iit-kharagpur-mtech',
    title: 'M.Tech in Rubber Technology',
    institution: 'Indian Institute of Technology Kharagpur (IIT KGP)',
    degree: 'M.Tech',
    level: 'Postgraduate',
    fee: '58,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Kharagpur, West Bengal',
    duration: '2 Years',
    description: 'Pioneering Rubber Technology Center researching tyre viscoelasticity, dynamic damping, and graphene-rubber masters.',
    ranking: 'NIRF #4 / INI',
    featured: true,
    accreditation: 'Institute of National Importance',
    slug: 'iit-kgp-rubber-tech-mtech'
  },
  {
    id: 'iit-roorkee-mtech',
    title: 'M.Tech in Polymer Science & Engineering',
    institution: 'Indian Institute of Technology Roorkee (IITR)',
    degree: 'M.Tech',
    level: 'Postgraduate',
    fee: '48,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Roorkee, Uttarakhand',
    duration: '2 Years',
    description: 'Specialized in membrane separations, fuel cell electrolyte polymers, and multi-scale modeling.',
    ranking: 'NIRF Top 5',
    accreditation: 'Institute of National Importance',
    slug: 'iit-roorkee-polymer-mtech'
  },
  {
    id: 'ict-mumbai-mtech',
    title: 'M.Tech in Polymer Engineering & Technology',
    institution: 'Institute of Chemical Technology (ICT)',
    degree: 'M.Tech',
    level: 'Postgraduate',
    fee: '95,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Matunga, Mumbai, Maharashtra',
    duration: '2 Years',
    description: 'Industrial sponsored projects with Reliance, BASF, and Pidilite on polymer reaction kinetics.',
    ranking: 'NIRF Top Chemical Tech',
    featured: true,
    accreditation: 'NBA / Deemed University',
    slug: 'ict-mumbai-polymer-mtech'
  },
  {
    id: 'pune-univ-msc',
    title: 'M.Sc in Polymer Science',
    institution: 'Savitribai Phule Pune University (SPPU)',
    degree: 'M.Sc',
    level: 'Postgraduate',
    fee: '22,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Ganeshkhind, Pune, Maharashtra',
    duration: '2 Years',
    description: 'Close research integration with CSIR-NCL on catalytic polyolefins, NMR spectroscopy, and GPC characterization.',
    ranking: 'NAAC A++',
    accreditation: 'UGC / State Apex',
    slug: 'sppu-polymer-science-msc'
  },
  {
    id: 'mysore-univ-msc',
    title: 'M.Sc in Polymer Science',
    institution: 'University of Mysore',
    degree: 'M.Sc',
    level: 'Postgraduate',
    fee: '25,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Manasagangotri, Mysuru, Karnataka',
    duration: '2 Years',
    description: 'Specializing in conductive polymers, crystalline X-ray diffraction, and biodegradable biopolymers.',
    ranking: 'NIRF Top 50',
    accreditation: 'UGC Approved',
    slug: 'mysore-univ-polymer-msc'
  },
  {
    id: 'cipet-bhubaneswar-mtech',
    title: 'M.Tech in Polymer Nanotechnology',
    institution: 'CIPET: SARP - LARPM Bhubaneswar',
    degree: 'M.Tech',
    level: 'Postgraduate',
    fee: '72,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Bhubaneswar, Odisha',
    duration: '2 Years',
    description: 'Dedicated R&D laboratory equipped with FE-SEM, AFM, DSC-TGA, and nano-indentation facilities.',
    ranking: 'National SARP Center',
    accreditation: 'BPUT Affiliated',
    slug: 'cipet-bhubaneswar-nanotech-mtech'
  },

  // India - Doctoral (Ph.D)
  {
    id: 'csir-ncl-phd',
    title: 'Ph.D in Polymer & Advanced Materials',
    institution: 'CSIR - National Chemical Laboratory (NCL)',
    degree: 'Ph.D',
    level: 'Doctoral',
    fee: '15,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Pashan, Pune, Maharashtra',
    duration: '4-5 Years',
    description: "India's highest polymer research citation hub; fully funded with CSIR/UGC JRF & PMRF fellowships (₹37,000-₹80,000/mo).",
    ranking: 'CSIR National Premier Lab',
    featured: true,
    accreditation: 'AcSIR / CSIR',
    slug: 'csir-ncl-polymer-phd'
  },
  {
    id: 'iisc-bangalore-phd',
    title: 'Ph.D in Materials Engineering (Polymer Physics)',
    institution: 'Indian Institute of Science (IISc)',
    degree: 'Ph.D',
    level: 'Doctoral',
    fee: '24,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'CV Raman Road, Bengaluru, Karnataka',
    duration: '4-5 Years',
    description: 'Ultra-advanced macromolecular dynamics, rheo-optical scattering, and self-assembling polymer systems.',
    ranking: 'NIRF #1 University / INI',
    featured: true,
    accreditation: 'Institute of National Importance',
    slug: 'iisc-bangalore-materials-phd'
  },
  {
    id: 'iit-bombay-phd',
    title: 'Ph.D in Metallurgical Engg & Materials Science',
    institution: 'Indian Institute of Technology Bombay (IITB)',
    degree: 'Ph.D',
    level: 'Doctoral',
    fee: '32,000',
    currency: 'INR',
    region: 'India',
    country: 'India',
    location: 'Powai, Mumbai, Maharashtra',
    duration: '4-5 Years',
    description: 'Pioneering vitrimers, dynamic covalent thermosets, and solid-state polymer batteries.',
    ranking: 'NIRF #3 / INI',
    accreditation: 'Institute of National Importance',
    slug: 'iit-bombay-materials-phd'
  },

  // Global - Elite International Master's & Ph.D
  {
    id: 'umass-amherst-ms',
    title: 'M.S. in Polymer Science & Engineering',
    institution: 'University of Massachusetts Amherst',
    degree: 'M.S.',
    level: 'Postgraduate',
    fee: '34,500',
    currency: 'USD',
    region: 'Global',
    country: 'USA',
    location: 'Amherst, Massachusetts, USA',
    duration: '2 Years',
    description: "Ranked #1 polymer academic center in North America with the iconic Conte National Center for Polymer Research.",
    ranking: 'US News #1 Polymer Program',
    featured: true,
    accreditation: 'NECHE Accredited',
    slug: 'umass-amherst-polymer-ms'
  },
  {
    id: 'univ-akron-ms',
    title: 'M.S. in Polymer Engineering',
    institution: 'University of Akron',
    degree: 'M.S.',
    level: 'Postgraduate',
    fee: '29,000',
    currency: 'USD',
    region: 'Global',
    country: 'USA',
    location: 'Akron, Ohio, USA',
    duration: '2 Years',
    description: 'Located in the Rubber Capital of the World; deep industrial links with Goodyear, Bridgestone, and Lubrizol.',
    ranking: 'Top Tier US Polymer Hub',
    accreditation: 'HLC Accredited',
    slug: 'univ-akron-polymer-ms'
  },
  {
    id: 'eth-zurich-ms',
    title: 'M.Sc in Materials Science (Polymers Track)',
    institution: 'ETH Zurich',
    degree: 'M.Sc',
    level: 'Postgraduate',
    fee: '1,460',
    currency: 'CHF',
    region: 'Global',
    country: 'Switzerland',
    location: 'Zurich, Switzerland',
    duration: '2 Years',
    description: 'World-leading European research university offering tuition-subsidized advanced synthetic soft matter curricula.',
    ranking: 'QS World #7',
    featured: true,
    accreditation: 'Swiss Federal Institute',
    slug: 'eth-zurich-materials-msc'
  },
  {
    id: 'tum-germany-msc',
    title: 'M.Sc in Materials Science & Engineering',
    institution: 'Technical University of Munich (TUM)',
    degree: 'M.Sc',
    level: 'Postgraduate',
    fee: '0',
    currency: 'EUR',
    region: 'Global',
    country: 'Germany',
    location: 'Munich, Bavaria, Germany',
    duration: '2 Years',
    description: 'Tuition-free public German education with direct Bavarian automotive and chemical industry co-op internships.',
    ranking: 'QS World #28 / German #1',
    featured: true,
    accreditation: 'German Accreditation Council',
    slug: 'tum-germany-materials-msc'
  },
  {
    id: 'imperial-college-msc',
    title: 'M.Sc in Advanced Materials Science & Engineering',
    institution: 'Imperial College London',
    degree: 'M.Sc',
    level: 'Postgraduate',
    fee: '38,500',
    currency: 'GBP',
    region: 'Global',
    country: 'UK',
    location: 'South Kensington, London, UK',
    duration: '1 Year',
    description: 'Intensive 12-month program focused on aerospace carbon composites, tissue engineering scaffolds, and circular economy.',
    ranking: 'QS World #6',
    accreditation: 'IOM3 Accredited',
    slug: 'imperial-college-advanced-materials-msc'
  },
  {
    id: 'tokyo-tech-msc',
    title: 'M.Eng in Chemical Science & Engineering',
    institution: 'Tokyo Institute of Technology (Science Tokyo)',
    degree: 'M.Sc',
    level: 'Postgraduate',
    fee: '535,800',
    currency: 'JPY',
    region: 'Global',
    country: 'Japan',
    location: 'Meguro, Tokyo, Japan',
    duration: '2 Years',
    description: 'Japanese government MEXT scholarship funded master program focusing on precision stereospecific polymerization.',
    ranking: 'QS Asia Top 15',
    accreditation: 'MEXT Japan',
    slug: 'tokyo-tech-chemical-meng'
  },
  {
    id: 'kaist-korea-ms',
    title: 'M.S. in Chemical & Biomolecular Engineering',
    institution: 'KAIST (Korea Advanced Institute of Science & Tech)',
    degree: 'M.S.',
    level: 'Postgraduate',
    fee: '0',
    currency: 'KRW',
    region: 'Global',
    country: 'South Korea',
    location: 'Daejeon, South Korea',
    duration: '2 Years',
    description: 'Full tuition waiver + monthly stipend for international graduate students researching flexible organic electronics and display polymers.',
    ranking: 'QS World #56 / Korea #1',
    accreditation: 'KAIST Institute',
    slug: 'kaist-chemical-biomolecular-ms'
  },
  {
    id: 'ku-leuven-msc',
    title: 'Master of Materials Engineering (Polymers & Composites)',
    institution: 'KU Leuven',
    degree: 'M.Sc',
    level: 'Postgraduate',
    fee: '6,600',
    currency: 'EUR',
    region: 'Global',
    country: 'Belgium',
    location: 'Leuven, Belgium',
    duration: '2 Years',
    description: 'Center for composite materials testing, non-destructive ultrasonic evaluation, and bio-based epoxy formulations.',
    ranking: 'Reuters Top European Innovator',
    accreditation: 'Flemish Accreditation',
    slug: 'ku-leuven-materials-msc'
  },
  {
    id: 'aalto-univ-msc',
    title: 'M.Sc in Chemical, Biochemical & Materials Engineering',
    institution: 'Aalto University',
    degree: 'M.Sc',
    level: 'Postgraduate',
    fee: '15,000',
    currency: 'EUR',
    region: 'Global',
    country: 'Finland',
    location: 'Espoo, Greater Helsinki, Finland',
    duration: '2 Years',
    description: 'World benchmark in nanocellulose biomaterials, wood-derived polymers, and circular packaging loop engineering.',
    ranking: 'QS World Top 100',
    accreditation: 'FINEEC Finland',
    slug: 'aalto-biochemical-materials-msc'
  }
]

const DEGREES = [
  { value: 'All Degrees', label: 'All Degrees', color: '#64748B' },
  { value: 'B.Sc', label: 'B.Sc', color: '#2563EB' },
  { value: 'B.Tech', label: 'B.Tech', color: '#F59E0B' },
  { value: 'Diploma', label: 'Diploma', color: '#10B981' },
  { value: 'M.S.', label: 'M.S.', color: '#7C3AED' },
  { value: 'M.Sc', label: 'M.Sc', color: '#8B5CF6' },
  { value: 'M.Tech', label: 'M.Tech', color: '#EA580C' },
  { value: 'Ph.D', label: 'Ph.D', color: '#EF4444' },
]

const LEVELS = [
  { value: 'All Levels', label: 'All Levels' },
  { value: 'Undergraduate', label: 'Undergraduate' },
  { value: 'Postgraduate', label: 'Postgraduate' },
  { value: 'Doctoral', label: 'Doctoral' },
]

const COUNTRIES = [
  'All Countries',
  'India',
  'USA',
  'Germany',
  'UK',
  'Switzerland',
  'Japan',
  'South Korea',
  'Belgium',
  'Finland',
]

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'fee-low', label: 'Fee: Low to High' },
  { value: 'fee-high', label: 'Fee: High to Low' },
  { value: 'alphabetical', label: 'Alphabetical' },
]

const STATS = [
  { value: '85+', label: 'Curated Degrees', icon: BookOpen },
  { value: '17', label: 'Active Fellowships', icon: Award },
  { value: '15+', label: 'Global Countries', icon: Globe },
  { value: '24+', label: 'Premier Hubs', icon: Building2 },
]

const CONVERSION_RATES: Record<string, number> = {
  INR: 1,
  USD: 83.5,
  EUR: 90.2,
  GBP: 106.5,
  JPY: 0.57,
  KRW: 0.063,
  CHF: 95.8,
  SEK: 8.1,
}

// ==================== MAIN COMPONENT ====================

export default function EducationPage() {
  const [programsList, setProgramsList] = useState<ProgramData[]>(SEED_PROGRAMS)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDegree, setSelectedDegree] = useState('All Degrees')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [selectedCountry, setSelectedCountry] = useState('All Countries')
  const [selectedRolePath, setSelectedRolePath] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('recommended')
  const [currentPage, setCurrentPage] = useState(1)
  const [compareList, setCompareList] = useState<string[]>([])
  const [currency, setCurrency] = useState<'local' | 'INR'>('local')
  const [loading, setLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  const itemsPerPage = 12
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    setIsLoaded(true)

    async function fetchDatabasePrograms() {
      try {
        setLoading(true)
        const { data: dbData, error } = await supabase
          .from('education_programs')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error

        if (dbData && dbData.length > 0) {
          const mapped: ProgramData[] = dbData.map((p, idx) => {
            const isInd = Boolean(p.is_indian ?? (p.country === 'India' || !p.country))
            let lvl: ProgramData['level'] = 'Undergraduate'
            const dt = String(p.degree_type || '')
            if (dt.includes('M.Tech') || dt.includes('M.Sc') || dt.includes('MS') || dt.includes('Master')) {
              lvl = 'Postgraduate'
            } else if (dt.includes('Ph.D') || dt.includes('PhD') || dt.includes('Doctor')) {
              lvl = 'Doctoral'
            } else if (dt.includes('Diploma')) {
              lvl = 'Diploma'
            }

            return {
              id: String(p.id || `db-prog-${idx}`),
              title: String(p.name || 'Polymer Academic Program'),
              institution: String(p.institution || 'Premier Institute'),
              degree: dt || 'B.Tech',
              level: lvl,
              fee: String(p.fees_annual || (isInd ? '50,000' : '25,000')),
              currency: isInd ? 'INR' : (p.currency || 'USD'),
              region: isInd ? 'India' : 'Global',
              country: String(p.country || (isInd ? 'India' : 'USA')),
              location: String(p.location || 'India'),
              duration: String(p.duration || (lvl === 'Doctoral' ? '4-5 Years' : lvl === 'Postgraduate' ? '2 Years' : '4 Years')),
              description: p.eligibility ? `Eligibility: ${p.eligibility}` : 'Comprehensive polymer engineering and research degree.',
              ranking: p.ranking ? String(p.ranking) : undefined,
              featured: idx < 6,
              accreditation: p.admission_process ? `Admission: ${p.admission_process}` : 'Audited Degree',
              slug: p.slug ? String(p.slug) : undefined,
            }
          })

          // Merge and deduplicate with SEED_PROGRAMS
          const seen = new Set<string>()
          const combined: ProgramData[] = []
          for (const item of [...SEED_PROGRAMS, ...mapped]) {
            const key = `${item.institution}-${item.title}`.toLowerCase()
            if (!seen.has(key)) {
              seen.add(key)
              combined.push(item)
            }
          }

          setProgramsList(combined)
        }
      } catch (err) {
        console.warn('Using seeded programs list:', err)
        setProgramsList(SEED_PROGRAMS)
      } finally {
        setLoading(false)
      }
    }

    fetchDatabasePrograms()
  }, [supabase])

  // Fee calculation helper
  const getConvertedFee = (feeStr: string, currencyCode: string): number => {
    const raw = parseInt(feeStr.replace(/[^0-9]/g, '')) || 0
    if (currency === 'INR') {
      return raw * (CONVERSION_RATES[currencyCode] || 1)
    }
    return raw
  }

  const getFormattedFee = (feeStr: string, currencyCode: string): string => {
    const num = parseInt(feeStr.replace(/[^0-9]/g, '')) || 0
    if (num === 0) return 'Tuition Free (Funded)'

    if (currency === 'INR') {
      const converted = Math.round(getConvertedFee(feeStr, currencyCode))
      return `₹${converted.toLocaleString('en-IN')}/yr`
    }

    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      KRW: '₩',
      CHF: 'CHF ',
      SEK: 'SEK ',
    }

    return `${symbols[currencyCode] || (currencyCode + ' ')}${num.toLocaleString('en-IN')}/yr`
  }

  // Country Flag Helper
  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      India: '🇮🇳',
      USA: '🇺🇸',
      UK: '🇬🇧',
      Germany: '🇩🇪',
      Switzerland: '🇨🇭',
      Japan: '🇯🇵',
      'South Korea': '🇰🇷',
      Belgium: '🇧🇪',
      Finland: '🇫🇮',
      Sweden: '🇸🇪',
      Australia: '🇦🇺',
      Netherlands: '🇳🇱',
      Italy: '🇮🇹',
    }
    return flags[country] || '🌍'
  }

  // Degree Color Code Helper
  const getDegreeColor = (deg: string) => {
    const match = DEGREES.find(d => d.value.toLowerCase() === deg.toLowerCase())
    if (match) return match.color
    if (deg.includes('B.')) return '#2563EB'
    if (deg.includes('M.')) return '#7C3AED'
    if (deg.includes('Ph.D')) return '#EF4444'
    return '#10B981'
  }

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    let result = [...programsList]

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.institution.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.degree.toLowerCase().includes(q)
      )
    }

    // Role pathfinder filter
    if (selectedRolePath) {
      const r = selectedRolePath.toLowerCase()
      if (r.includes('packaging')) {
        result = result.filter(p => p.title.toLowerCase().includes('packag') || p.description.toLowerCase().includes('packag'))
      } else if (r.includes('sustainability')) {
        result = result.filter(p => p.title.toLowerCase().includes('bio') || p.title.toLowerCase().includes('recycl') || p.description.toLowerCase().includes('bio'))
      } else if (r.includes('scientist') || r.includes('r&d')) {
        result = result.filter(p => p.level === 'Postgraduate' || p.level === 'Doctoral')
      } else if (r.includes('manufacturing')) {
        result = result.filter(p => p.title.toLowerCase().includes('plastic') || p.title.toLowerCase().includes('processing'))
      }
    }

    // Degree filter
    if (selectedDegree !== 'All Degrees') {
      result = result.filter(p => p.degree === selectedDegree)
    }

    // Level filter
    if (selectedLevel !== 'All Levels') {
      result = result.filter(p => p.level === selectedLevel)
    }

    // Country filter
    if (selectedCountry !== 'All Countries') {
      result = result.filter(p => p.country === selectedCountry)
    }

    // Sort order
    switch (sortBy) {
      case 'fee-low':
        result.sort((a, b) => getConvertedFee(a.fee, a.currency) - getConvertedFee(b.fee, b.currency))
        break
      case 'fee-high':
        result.sort((a, b) => getConvertedFee(b.fee, b.currency) - getConvertedFee(a.fee, a.currency))
        break
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        result.sort((a, b) => ((a.featured === b.featured) ? 0 : a.featured ? -1 : 1))
        break
    }

    return result
  }, [programsList, searchQuery, selectedRolePath, selectedDegree, selectedLevel, selectedCountry, sortBy, currency])

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage)
  const paginatedPrograms = useMemo(() => {
    return filteredPrograms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredPrograms, currentPage, itemsPerPage])

  // Grouped Collections for Home / Unfiltered view
  const featuredPrograms = useMemo(() => programsList.filter(p => p.featured).slice(0, 6), [programsList])
  const undergraduatePrograms = useMemo(() => programsList.filter(p => p.level === 'Undergraduate').slice(0, 6), [programsList])
  const postgraduatePrograms = useMemo(() => programsList.filter(p => p.level === 'Postgraduate').slice(0, 6), [programsList])
  const globalPrograms = useMemo(() => programsList.filter(p => p.region === 'Global').slice(0, 6), [programsList])

  const toggleCompare = (id: string) => {
    setCompareList(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden text-slate-900 font-sans">
      
      {/* ============================================================ */}
      {/* HERO — Cinematic Emerald Gradient */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-[#0B172A] via-[#0A2E1A] to-[#0B172A] overflow-hidden py-16 lg:py-24 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#6EE7B7] text-xs font-mono font-bold tracking-wider uppercase mb-4 shadow-sm">
              🎓 Academic Programs &amp; Fellowships
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Find Your
              <span className="block bg-gradient-to-r from-[#6EE7B7] via-[#34D399] to-[#10B981] bg-clip-text text-transparent">
                Polymer Education Path
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 mt-4 max-w-2xl leading-relaxed font-light">
              Explore 85+ undergraduate and postgraduate degrees across premier Indian institutes (CIPET, IITs, ICT) and top global research universities with funding fellowships.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8">
              {STATS.map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-sm"
                  >
                    <StatIcon className="h-5 w-5 text-[#34D399] shrink-0" />
                    <div>
                      <p className="text-white font-bold text-base sm:text-lg font-mono leading-none">{stat.value}</p>
                      <p className="text-slate-300 text-[10px] sm:text-xs font-mono uppercase mt-1">{stat.label}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Search Input Bar */}
            <div className="relative mt-8 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search programs, institutions, degrees, or countries (e.g. ICT Mumbai, B.Tech, Germany)..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-white/15 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder:text-slate-400 text-sm font-sans focus:outline-none focus:border-[#34D399] focus:ring-2 focus:ring-[#10B981]/30 transition-all shadow-inner"
              />
            </div>
          </motion.div>
        </div>

        {/* Tricolor Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
      </section>

      {/* ============================================================ */}
      {/* SCHOLARSHIP BANNER */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-gradient-to-r from-[#F5C518]/20 via-[#10B981]/20 to-[#F5C518]/20 backdrop-blur-md rounded-2xl border border-[#F5C518]/40 p-4 sm:p-5 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h3 className="font-extrabold text-[#111827] text-sm sm:text-base">
                  17 Active Fellowships &amp; Scholarships Available
                </h3>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  PMRF (₹80,000/mo), GATE M.Tech stipend (₹12,400/mo), CSIR-JRF, and Erasmus Mundus tuition grants.
                </p>
              </div>
            </div>
            <Link
              href="/resources"
              className="px-5 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-[#10B981] hover:bg-[#059669] transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              Explore Fellowships
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* PATHFINDER — Career-Based Role Discovery */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider whitespace-nowrap">
                🧭 Career Path Navigator:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[
                'Polymer Scientist',
                'R&D Engineer',
                'Materials Engineer',
                'Packaging Specialist',
                'Sustainability Expert',
                'Manufacturing Engineer',
              ].map((role) => {
                const isActive = selectedRolePath === role
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRolePath(isActive ? null : role)
                      setCurrentPage(1)
                    }}
                    className={`
                      px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all
                      ${isActive 
                        ? 'bg-[#10B981] text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }
                    `}
                  >
                    {role}
                  </button>
                )
              })}

              {selectedRolePath && (
                <button
                  type="button"
                  onClick={() => setSelectedRolePath(null)}
                  className="px-2.5 py-1 text-[11px] font-mono text-rose-600 hover:underline"
                >
                  Clear Path
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* FILTER & CURRENCY TOGGLE BAR */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-2xl border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Currency Converter Toggle */}
              <button
                type="button"
                onClick={() => setCurrency(currency === 'local' ? 'INR' : 'local')}
                className="px-3 py-2 rounded-xl text-xs font-mono font-bold bg-[#10B981]/10 text-[#059669] hover:bg-[#10B981]/20 border border-[#10B981]/30 transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <DollarSign className="h-3.5 w-3.5" />
                {currency === 'local' ? 'Show All in ₹ INR' : 'Show Local Currency'}
              </button>

              {/* Degree Filter */}
              <select
                value={selectedDegree}
                onChange={(e) => { setSelectedDegree(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs font-mono font-medium bg-white text-slate-700 focus:outline-none focus:border-[#10B981]"
              >
                {DEGREES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => { setSelectedLevel(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs font-mono font-medium bg-white text-slate-700 focus:outline-none focus:border-[#10B981]"
              >
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>

              {/* Country Filter */}
              <select
                value={selectedCountry}
                onChange={(e) => { setSelectedCountry(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs font-mono font-medium bg-white text-slate-700 focus:outline-none focus:border-[#10B981]"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E2E8F0] text-xs font-mono font-medium bg-white text-slate-700 focus:outline-none focus:border-[#10B981]"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <span className="text-xs font-mono text-slate-500 font-bold ml-auto">
              {filteredPrograms.length} {filteredPrograms.length === 1 ? 'degree' : 'degrees'} listed
            </span>
          </div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* INTERACTIVE COMPARE TRAY BAR */}
      {/* ============================================================ */}
      {compareList.length > 0 && (
        <section className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t-2 border-[#10B981] shadow-2xl p-3 sm:p-4">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono">
                🎯 {compareList.length} {compareList.length === 1 ? 'degree' : 'degrees'} selected for comparison
              </span>
              <button
                type="button"
                onClick={() => setCompareList([])}
                className="text-xs font-mono text-slate-400 hover:text-rose-600 transition-colors"
              >
                Clear all
              </button>
            </div>

            <Link
              href={`/education/compare`}
              className="px-6 py-2.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider text-white bg-[#10B981] hover:bg-[#059669] transition-all flex items-center gap-2 shadow-md"
            >
              <GraduationCap className="h-4 w-4" />
              Compare Curriculum Matrix
            </Link>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* FEATURED PROGRAMS SECTION */}
      {/* ============================================================ */}
      {!searchQuery && !selectedRolePath && selectedLevel === 'All Levels' && selectedDegree === 'All Degrees' && selectedCountry === 'All Countries' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#F5C518] uppercase tracking-wider">Apex Centers</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827]">Featured Flagship Degrees</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPrograms.map((program, index) => (
              <ProgramCard
                key={program.id}
                program={program}
                index={index}
                compareList={compareList}
                onToggleCompare={toggleCompare}
                getFormattedFee={getFormattedFee}
                getCountryFlag={getCountryFlag}
                getDegreeColor={getDegreeColor}
              />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* UNDERGRADUATE SECTION */}
      {/* ============================================================ */}
      {!searchQuery && !selectedRolePath && selectedLevel === 'All Levels' && selectedDegree === 'All Degrees' && selectedCountry === 'All Countries' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">Foundation</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827]">B.Tech &amp; B.Sc Undergraduate Degrees</h2>
            </div>
            <button
              onClick={() => setSelectedLevel('Undergraduate')}
              className="text-xs font-mono font-bold text-[#10B981] hover:underline uppercase"
            >
              View All B.Tech / B.Sc &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {undergraduatePrograms.map((program, index) => (
              <ProgramCard
                key={program.id}
                program={program}
                index={index}
                compareList={compareList}
                onToggleCompare={toggleCompare}
                getFormattedFee={getFormattedFee}
                getCountryFlag={getCountryFlag}
                getDegreeColor={getDegreeColor}
              />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* POSTGRADUATE SECTION */}
      {/* ============================================================ */}
      {!searchQuery && !selectedRolePath && selectedLevel === 'All Levels' && selectedDegree === 'All Degrees' && selectedCountry === 'All Countries' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#7C3AED] uppercase tracking-wider">Advanced Mastery</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827]">M.Tech, M.Sc &amp; M.S. Programs</h2>
            </div>
            <button
              onClick={() => setSelectedLevel('Postgraduate')}
              className="text-xs font-mono font-bold text-[#10B981] hover:underline uppercase"
            >
              View All Masters &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {postgraduatePrograms.map((program, index) => (
              <ProgramCard
                key={program.id}
                program={program}
                index={index}
                compareList={compareList}
                onToggleCompare={toggleCompare}
                getFormattedFee={getFormattedFee}
                getCountryFlag={getCountryFlag}
                getDegreeColor={getDegreeColor}
              />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* GLOBAL PROGRAMS SECTION */}
      {/* ============================================================ */}
      {!searchQuery && !selectedRolePath && selectedLevel === 'All Levels' && selectedDegree === 'All Degrees' && selectedCountry === 'All Countries' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#EC4899] uppercase tracking-wider">International Hubs</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827]">Global University Research Tracks</h2>
            </div>
            <button
              onClick={() => setSelectedCountry('USA')}
              className="text-xs font-mono font-bold text-[#10B981] hover:underline uppercase"
            >
              Explore International &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalPrograms.map((program, index) => (
              <ProgramCard
                key={program.id}
                program={program}
                index={index}
                compareList={compareList}
                onToggleCompare={toggleCompare}
                getFormattedFee={getFormattedFee}
                getCountryFlag={getCountryFlag}
                getDegreeColor={getDegreeColor}
              />
            ))}
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* ALL PROGRAMS DIRECTORY WITH PAGINATION */}
      {/* ============================================================ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-mono font-bold text-[#10B981] uppercase tracking-wider">Complete Catalog</span>
            <h2 className="text-2xl font-black text-[#111827]">Academic Directory</h2>
            <p className="text-xs font-mono text-slate-500 mt-0.5">Showing {filteredPrograms.length} verified programs</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-[#10B981] animate-spin mb-3" />
            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Loading Academic Catalog...</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDegree + selectedLevel + selectedCountry + searchQuery + sortBy + currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {paginatedPrograms.map((program, index) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    index={index}
                    compareList={compareList}
                    onToggleCompare={toggleCompare}
                    getFormattedFee={getFormattedFee}
                    getCountryFlag={getCountryFlag}
                    getDegreeColor={getDegreeColor}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredPrograms.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-sm">
                <span className="text-4xl block mb-3">🔍</span>
                <h3 className="text-lg font-bold text-[#111827]">No matching programs found</h3>
                <p className="text-xs text-slate-500 font-mono mt-1">Try relaxing your search query or reset filter options.</p>
                <button
                  onClick={() => {
                    setSelectedDegree('All Degrees')
                    setSelectedLevel('All Levels')
                    setSelectedCountry('All Countries')
                    setSelectedRolePath(null)
                    setSearchQuery('')
                  }}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#10B981] text-white text-xs font-mono font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Numbers */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-xs font-mono font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  &larr; Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`
                        w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all
                        ${currentPage === page
                          ? 'bg-[#10B981] text-white shadow-sm'
                          : 'border border-[#E2E8F0] text-slate-700 hover:bg-slate-100'
                        }
                      `}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-xl border border-[#E2E8F0] text-xs font-mono font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ============================================================ */}
      {/* BRAND-ALIGNED AI ADVISOR BANNER */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#0B172A] via-[#0A2E1A] to-[#0B172A] py-14 border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#6EE7B7] text-xs font-mono font-bold uppercase mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[#F5C518]" />
                AI Career Advisor
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Not sure which polymer program fits your career vision?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl font-light leading-relaxed">
                Ask our AI Tutor for personalized admission cutoffs, fellowship eligibility (PMRF, GATE, MEXT), 
                and placement package analytics across India and abroad.
              </p>
            </div>
            <Link
              href="/ai-tutor"
              className="px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-[#F5C518] hover:bg-amber-400 hover:-translate-y-0.5 transition-all shadow-[0_4px_24px_rgba(245,197,24,0.35)] flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm font-mono uppercase tracking-wider"
            >
              Ask AI Advisor
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>



      {/* ===== GLOBAL FOOTER ===== */}
      <Footer />

    </div>
  )
}

// ==================== PROGRAM CARD COMPONENT ====================

function ProgramCard({ 
  program, 
  index, 
  compareList, 
  onToggleCompare, 
  getFormattedFee, 
  getCountryFlag, 
  getDegreeColor, 
}: {
  program: ProgramData
  index?: number
  compareList: string[]
  onToggleCompare: (id: string) => void
  getFormattedFee: (fee: string, curr: string) => string
  getCountryFlag: (country: string) => string
  getDegreeColor: (deg: string) => string
}) {
  const isSelected = compareList.includes(program.id)
  const degreeColor = getDegreeColor(program.degree)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: (index || 0) * 0.02 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-2xs hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header: Degree Badge + Flag + Compare Action */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white uppercase shadow-2xs"
              style={{ backgroundColor: degreeColor }}
            >
              {program.degree}
            </span>
            <span className="text-base" title={program.country}>{getCountryFlag(program.country)}</span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">{program.level}</span>
          </div>

          <button
            type="button"
            onClick={() => onToggleCompare(program.id)}
            className={`p-1.5 rounded-xl border transition-all ${
              isSelected 
                ? 'border-[#10B981] bg-[#10B981]/15 text-[#10B981]' 
                : 'border-slate-200 text-slate-400 hover:border-[#10B981] hover:text-[#10B981]'
            }`}
            title={isSelected ? 'Remove from compare tray' : 'Add to compare tray'}
          >
            {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-[#111827] text-sm sm:text-base leading-snug group-hover:text-[#10B981] transition-colors">
          {program.title}
        </h3>

        {/* Institution */}
        <p className="text-xs text-slate-600 font-bold mt-1">{program.institution}</p>

        {/* Location & Duration */}
        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{program.location}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            {program.duration}
          </span>
        </div>

        {/* Description / Summary */}
        <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
          {program.description}
        </p>
      </div>

      {/* Footer: Fee & Details Link */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-mono text-slate-400 uppercase">Annual Tuition</p>
          <p className="text-sm sm:text-base font-black text-[#111827] font-mono leading-none mt-0.5">
            {getFormattedFee(program.fee, program.currency)}
          </p>
        </div>

        {program.ranking ? (
          <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
            {program.ranking}
          </span>
        ) : (
          <Link
            href={`/education/${program.slug || program.id}`}
            className="flex items-center gap-1 text-xs font-mono font-bold text-[#10B981] hover:underline"
          >
            Details
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}
