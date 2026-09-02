export interface IndustryEvent {
  id: string
  title: string
  shortTitle: string
  slug: string
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  dateDisplay: string
  monthYearBadge: string
  city: string
  state: string
  venue: string
  focus: string
  focusTags: string[]
  organizer: string
  sourceName: string
  sourceUrl: string
  lastVerified: string
  eventType: 'Exhibition & Expo' | 'Academic Conference' | 'Industry Summit'
  isAnchorEvent?: boolean
  idealFor: string[]
  whatToSee: { step: string; title: string; desc: string }[]
  studentMode: {
    advice: string
    keyPavilions: string[]
    networkingTip: string
  }
}

export const VERIFIED_INDUSTRY_EVENTS: IndustryEvent[] = [
  {
    id: 'event-001',
    title: 'Plast Champions — International Plastics Expo 2026',
    shortTitle: 'Plast Champions Vadodara',
    slug: 'plast-champions-vadodara-2026',
    startDate: '2026-10-30',
    endDate: '2026-11-01',
    dateDisplay: 'October 30 – November 1, 2026',
    monthYearBadge: 'OCT 2026',
    city: 'Vadodara',
    state: 'Gujarat',
    venue: 'Anusuya Leprosy Ground, Opp Sardar Estate, Vadodara, Gujarat 390019',
    focus: 'Plastics materials, high-speed processing machinery, petrochemical masterbatches, and auxiliary equipment.',
    focusTags: ['Plastics Materials', 'Machinery', 'Petrochemicals', 'Extrusion & Tooling'],
    organizer: 'Plast Champions Expo Committee',
    sourceName: 'Tradeindia / Official Organizer',
    sourceUrl: 'https://www.tradeindia.com',
    lastVerified: '02 Sep 2026',
    eventType: 'Exhibition & Expo',
    isAnchorEvent: false,
    idealFor: [
      'Polymer Engineering Students & CIPET Trainees',
      'Injection Moulding & Extrusion Plant Managers',
      'Petrochemical Compounders & Masterbatch Formulators',
      'Machinery & Auxiliary Tooling OEMs'
    ],
    whatToSee: [
      { step: '01', title: 'Polymer & Resin Suppliers', desc: 'Direct stalls from Western India polyolefin distributors, engineered resin compounding units, and specialty color masterbatches.' },
      { step: '02', title: 'Injection & Blow Machinery', desc: 'Live demonstrations of toggle clamp injection presses, high-output single/twin-screw extrusion lines, and chiller automation.' },
      { step: '03', title: 'Testing & Quality Tools', desc: 'Melt Flow Indexers (MFI), universal tensile testers, and optical color spectrophotometers.' }
    ],
    studentMode: {
      advice: 'Vadodara is Gujarat\'s petrochemical heartland (near Reliance Vadodara & IPCL complexes). Carry your college ID card, printed copies of your CV, and a notebook to record machinery specifications.',
      keyPavilions: ['Machinery & Automation Hall', 'Raw Material & Additive Pavilion', 'Gujarat CIPET Alumni Desk'],
      networkingTip: 'Visit machine manufacturer stalls during afternoon hours to ask application engineers about cycle-time optimization formulas.'
    }
  },
  {
    id: 'event-002',
    title: 'Plast Pack 2026 — International Plastics & Packaging Exhibition',
    shortTitle: 'Plast Pack Indore',
    slug: 'plast-pack-indore-2026',
    startDate: '2026-11-27',
    endDate: '2026-11-30',
    dateDisplay: 'November 27 – 30, 2026',
    monthYearBadge: 'NOV 2026',
    city: 'Indore',
    state: 'Madhya Pradesh',
    venue: 'Labh Ganga Exhibition Centre, Bypass Road, Indore, Madhya Pradesh 452010',
    focus: 'Plastics processing, flexible barrier packaging, multilayer blown film lines, and industrial printing.',
    focusTags: ['Packaging Films', 'Blow Moulding', 'Printing & Converting', 'Circular rPET'],
    organizer: 'Indore Plastics Manufacturers Association & Trade Feeds',
    sourceName: 'The Wire / Lokmat Times / Official Industry Feed',
    sourceUrl: 'https://www.thewire.in',
    lastVerified: '02 Sep 2026',
    eventType: 'Exhibition & Expo',
    isAnchorEvent: false,
    idealFor: [
      'Flexible Packaging Engineers & Film Converters',
      'FMCG Pouch & Bottle Manufacturing Technicians',
      'Food-Grade rPET & Sustainable Plastics Specialists',
      'Central India SME Plastic Processors'
    ],
    whatToSee: [
      { step: '01', title: 'Multilayer Blown Film Lines', desc: '3-layer and 5-layer co-extrusion blown film dies for high-barrier EVOH/Nylon pouches.' },
      { step: '02', title: 'Pouch Making & Flexo Printing', desc: 'High-speed solvent-free laminators, automatic side-seal pouch machines, and CI flexographic printers.' },
      { step: '03', title: 'EPR & Post-Consumer Recycling', desc: 'Friction washers, hot-melt decontamination extruders, and food-grade rPET pelletizers.' }
    ],
    studentMode: {
      advice: 'Indore and Pithampur are major FMCG packaging hubs. Perfect show to understand barrier property testing (OTR, WVTR) and blown film extrusion bubble stability.',
      keyPavilions: ['Packaging & Converting Hall', 'Recycling & EPR Hub', 'Raw Materials Zone'],
      networkingTip: 'Introduce yourself to plant technical heads at converting machine booths; ask about internships in flexible packaging QC.'
    }
  },
  {
    id: 'event-003',
    title: 'POLYMERA 2027 — International Conference on Advances in Polymeric Materials',
    shortTitle: 'POLYMERA 2027 Conference',
    slug: 'polymera-2027-kottayam',
    startDate: '2027-01-28',
    endDate: '2027-01-29',
    dateDisplay: 'January 28 – 29, 2027',
    monthYearBadge: 'JAN 2027',
    city: 'Kottayam',
    state: 'Kerala',
    venue: 'Seminar Hall, Convergence Academia Complex, Mahatma Gandhi University, Kottayam, Kerala 686560',
    focus: 'Academic & research conference on polymer nanocomposites, biopolymer synthesis, green chemistry, and smart hydrogels.',
    focusTags: ['Academic Conference', 'Nanocomposites', 'Biopolymers', 'Smart Materials', 'R&D Papers'],
    organizer: 'School of Chemical Sciences, Mahatma Gandhi University',
    sourceName: 'MG University (Official Academic Source)',
    sourceUrl: 'https://www.mgu.ac.in',
    lastVerified: '02 Sep 2026',
    eventType: 'Academic Conference',
    isAnchorEvent: false,
    idealFor: [
      'B.Tech / M.Tech / PhD Polymer Science Researchers',
      'GATE XE-F Aspirants & Academic Faculty',
      'Nanotechnology & Polymer Matrix Scientists',
      'Biopolymer & Biodegradable Material Developers'
    ],
    whatToSee: [
      { step: '01', title: 'Peer-Reviewed Research Tracks', desc: 'Technical paper presentations on graphene oxide nanocomposites, self-healing thermosets, and natural rubber modification.' },
      { step: '02', title: 'Keynote Lectures by Global Scientists', desc: 'Plenary lectures by international professors on advanced rheology, polymer physics, and circular depolymerization.' },
      { step: '03', title: 'Poster Sessions & Patent Workshops', desc: 'Over 120 technical posters detailing characterization methodologies (TEM, AFM, DSC, DMA).' }
    ],
    studentMode: {
      advice: 'This is India\'s premier academic gathering founded in Kerala (the natural rubber heartland). If you are preparing research papers or planning M.Tech/MS applications, submit your abstract before November.',
      keyPavilions: ['Oral Presentation Theatre', 'Nanomaterials Poster Gallery', 'Academic Networking Lounge'],
      networkingTip: 'Engage with professors during the high-tea and poster session; this is the best forum to secure funded PhD and research project assistantships.'
    }
  },
  {
    id: 'event-004',
    title: 'Plastivision India 2027 — The Premier Global Plastics Showcase',
    shortTitle: 'Plastivision India 2027',
    slug: 'plastivision-india-mumbai-2027',
    startDate: '2027-01-21',
    endDate: '2027-01-25',
    dateDisplay: 'January 21 – 25, 2027',
    monthYearBadge: 'JAN 2027',
    city: 'Mumbai',
    state: 'Maharashtra',
    venue: 'Bombay Exhibition Centre (BEC), NESCO, Western Express Highway, Goregaon East, Mumbai, Maharashtra 400063',
    focus: 'THE ANCHOR EVENT OF INDIA. Full-spectrum polymer industry: multi-tonne injection presses, petrochemical giants, mould tooling, automation, and circular circularity.',
    focusTags: ['Anchor Mega Show', 'AIPMA', 'Machinery & Moulds', 'Reliance & Global Petrochemicals', 'Industry 4.0'],
    organizer: 'The All India Plastics Manufacturers’ Association (AIPMA)',
    sourceName: 'Plastics-technology.com / AIPMA',
    sourceUrl: 'https://www.plastivision.org',
    lastVerified: '02 Sep 2026',
    eventType: 'Exhibition & Expo',
    isAnchorEvent: true,
    idealFor: [
      'Every Polymer Engineering & Chemical Engineering Student',
      'CEOs, Plant Heads, & Toolroom Specialists across India',
      'Global Raw Material Traders (RIL, SABIC, BASF, GAIL, LG Chem)',
      'Automation, Robotics, & Smart Manufacturing Engineers'
    ],
    whatToSee: [
      { step: '01', title: 'Heavy Processing Machinery Halls', desc: 'Over 500 running injection molding machines (Engel, Wittmann, Toshiba, Milacron, Windsor) producing live components.' },
      { step: '02', title: 'Petrochemical & Commodity Pavilions', desc: 'Massive installations from Reliance, Indian Oil, GAIL, SABIC, Covestro, and LyondellBasell showcasing latest prime grades.' },
      { step: '03', title: 'PlastiCircle & Sustainable Recycling Hub', desc: 'Chemical recycling depolymerization units, bottle-to-bottle rPET decontamination, and biopolymer compounding.' },
      { step: '04', title: 'Precision Mould & Toolroom Pavilion', desc: 'Hot runner systems, 5-axis CNC mold machining, EDM spark erosion, and beryllium copper conformal cooling inserts.' }
    ],
    studentMode: {
      advice: 'Plastivision is mandatory for any serious polymer student in India. Spread across 100,000+ sqm with 1,500+ exhibitors. Plan to spend at least 2 full days. AIPMA provides special subsidized student delegation passes with college authorization letters.',
      keyPavilions: ['Hall 1: Raw Materials & Polymers', 'Hall 2 & 3: Machinery in Motion', 'Hall 4: Moulds, Dies & Automation', 'Hall 5: Circular Plastics Pavilion'],
      networkingTip: 'Visit the HR and recruitment desks at major producer stalls. Bring 15+ hard-copy resumes and request visiting cards from shop-floor application specialists.'
    }
  },
  {
    id: 'event-005',
    title: 'IPLAS 2027 — International Plastics Exhibition Chennai',
    shortTitle: 'IPLAS 2027 Chennai',
    slug: 'iplas-chennai-2027',
    startDate: '2027-06-11',
    endDate: '2027-06-14',
    dateDisplay: 'June 11 – 14, 2027',
    monthYearBadge: 'JUN 2027',
    city: 'Chennai',
    state: 'Tamil Nadu',
    venue: 'Chennai Trade Centre, CTC Complex, Nandambakkam, Chennai, Tamil Nadu 600089',
    focus: 'Premier South India show. Automotive plastics, electrical switchgear components, precision moulds, dies, and recycling tech.',
    focusTags: ['South India Premier', 'Automotive Plastics', 'Precision Moulds & Dies', 'CIPET Guindy Aligned'],
    organizer: 'Tamil Nadu Plastics Manufacturers’ Association (TAPMA)',
    sourceName: 'TAPMA / Plastemart',
    sourceUrl: 'https://www.plastemart.com',
    lastVerified: '02 Sep 2026',
    eventType: 'Exhibition & Expo',
    isAnchorEvent: false,
    idealFor: [
      'Automotive Component Molders & Tier-1 Suppliers (Hyundai, Renault, Tata)',
      'CIPET Guindy & Anna University Students / Alumni',
      'Tool & Die Makers from Chennai & Coimbatore Clusters',
      'Medical & Healthcare Injection Molding Technicians'
    ],
    whatToSee: [
      { step: '01', title: 'Automotive Plastics & Under-Hood Parts', desc: 'High-temperature Polyamides (PA66-GF30), Polycarbonate headlamp bezels, and PP bumper compounding.' },
      { step: '02', title: 'Precision Mould & Toolroom Showcase', desc: 'Coimbatore & Chennai toolmakers demonstrating hardened P20/H13 core-cavity tooling and multicavity hot runners.' },
      { step: '03', title: 'All-Electric High-Precision Presses', desc: 'Cleanroom medical moulding machines for syringes, IV connectors, and microfluidic polymer chips.' }
    ],
    studentMode: {
      advice: 'Chennai is India\'s Detroit and the home of CIPET Corporate Head Office. Excellent opportunity to meet automotive molders and secure plant placement interviews.',
      keyPavilions: ['Automotive & Engineering Plastics Hall', 'Tool & Die Specialist Arena', 'South India Recyclers Pavilion'],
      networkingTip: 'Ask exhibitors about their automotive PP-GF and PA66 validation cycles; demonstrate your knowledge of ASTM D638 and Izod impact standards.'
    }
  }
]

export function computeEventStatus(startDate: string, endDate: string): {
  status: 'Live Today' | 'Upcoming' | 'Past Event'
  badgeColor: string
  daysUntil: number
} {
  const now = new Date()
  const start = new Date(startDate + 'T00:00:00+05:30')
  const end = new Date(endDate + 'T23:59:59+05:30')

  if (now >= start && now <= end) {
    return {
      status: 'Live Today',
      badgeColor: 'bg-red-500 text-white animate-pulse',
      daysUntil: 0
    }
  }

  if (now < start) {
    const diffTime = start.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return {
      status: 'Upcoming',
      badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
      daysUntil: diffDays
    }
  }

  return {
    status: 'Past Event',
    badgeColor: 'bg-slate-100 text-slate-500 border border-slate-200',
    daysUntil: -1
  }
}

export function generateEventGoogleCalendarUrl(event: IndustryEvent): string {
  const startStr = event.startDate.replace(/-/g, '') + 'T090000Z'
  const endStr = event.endDate.replace(/-/g, '') + 'T180000Z'
  const title = encodeURIComponent(event.title)
  const details = encodeURIComponent(`${event.title}\n\nVenue: ${event.venue}\nFocus: ${event.focus}\nOrganizer: ${event.organizer}\n\nVerified via PolymerHub of India: https://polymerhubofindia.com/community`)
  const location = encodeURIComponent(event.venue)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`
}
