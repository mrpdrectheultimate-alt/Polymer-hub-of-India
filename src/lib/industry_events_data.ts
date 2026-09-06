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
    organizer: 'Indore Plastics Manufacturers Association (IPMA) & Trade Feeds',
    sourceName: 'Indore Plastics Manufacturers Association (IPMA) / TradeIndia',
    sourceUrl: 'https://www.tradeindia.com',
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
    lastVerified: '06 Sep 2026',
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
  },
  {
    id: 'event-006',
    title: 'Plexpo India 2026 — 9th International Plastics Exhibition',
    shortTitle: 'Plexpo India Gandhinagar',
    slug: 'plexpo-india-gandhinagar-2026',
    startDate: '2026-12-17',
    endDate: '2026-12-20',
    dateDisplay: 'December 17 – 20, 2026',
    monthYearBadge: 'DEC 2026',
    city: 'Gandhinagar',
    state: 'Gujarat',
    venue: 'Helipad Exhibition Centre, Near J2 Circle, Swarnim Park, Gandhinagar, Gujarat 382016',
    focus: 'Gujarat flagship show. High-throughput extrusion, polyolefin compounding, masterbatches, and packaging converting machinery.',
    focusTags: ['Gujarat Flagship', 'High-Speed Extrusion', 'Masterbatch Formulations', 'GSPMA'],
    organizer: 'Gujarat State Plastics Manufacturers Association (GSPMA)',
    sourceName: 'GSPMA / Plexpo India Official',
    sourceUrl: 'https://www.plexpoindia.com',
    lastVerified: '06 Sep 2026',
    eventType: 'Exhibition & Expo',
    isAnchorEvent: false,
    idealFor: [
      'Extrusion & Pipe Manufacturing Engineers',
      'Masterbatch & Additive Formulators',
      'Flexible Packaging Converters & Printers',
      'Polymer Engineering Students & Researchers'
    ],
    whatToSee: [
      { step: '01', title: 'High-Output Pipe & Sheet Extrusion', desc: 'Live running HDPE pressure pipe lines and multilayer sheet extrusion dies.' },
      { step: '02', title: 'Additive & Color Masterbatch Pavilion', desc: 'Concentrated UV stabilizer masterbatches, filler masterbatches ($\text{CaCO}_3$), and flame retardants.' },
      { step: '03', title: 'Recycling & Melt Filtration', desc: 'Automatic continuous screen changers and pelletizing lines for post-industrial scrap.' }
    ],
    studentMode: {
      advice: 'GSPMA is one of India\'s largest regional plastics associations. Great venue to interact with twin-screw extruder manufacturers.',
      keyPavilions: ['Extrusion Machinery Hall', 'Masterbatch & Chemical Pavilion', 'Toolroom & Auxiliary Equipment Zone'],
      networkingTip: 'Inquire about Specific Mechanical Energy ($\text{SME}$) calculations with twin-screw extrusion application engineers.'
    }
  },
  {
    id: 'event-007',
    title: 'India Rubber Expo 2027 (IRE 2027) — 11th International Rubber Conference & Expo',
    shortTitle: 'India Rubber Expo New Delhi',
    slug: 'india-rubber-expo-delhi-2027',
    startDate: '2027-03-18',
    endDate: '2027-03-20',
    dateDisplay: 'March 18 – 20, 2027',
    monthYearBadge: 'MAR 2027',
    city: 'New Delhi',
    state: 'Delhi NCR',
    venue: 'Pragati Maidan Exhibition Complex, Mathura Road, New Delhi 110001',
    focus: 'Asia\'s largest rubber show. Natural & synthetic rubbers (SBR, EPDM, NBR), vulcanization accelerators, tire compounding, and rubber machinery.',
    focusTags: ['Rubber & Elastomers', 'Tire Compounding', 'Sulfur Vulcanization', 'AIRIA Mega Show'],
    organizer: 'All India Rubber Industries Association (AIRIA)',
    sourceName: 'AIRIA Official / India Rubber Expo',
    sourceUrl: 'https://www.indiarubberexpo.in',
    lastVerified: '06 Sep 2026',
    eventType: 'Exhibition & Expo',
    isAnchorEvent: true,
    idealFor: [
      'Rubber Technologists & Tire Compounders',
      'Elastomeric Product Designers (O-Rings, Seals, Hoses)',
      'Synthetic Rubber & Silica Filler Suppliers',
      'Polymer & Rubber Technology Students'
    ],
    whatToSee: [
      { step: '01', title: 'Rubber Vulcanization & Mixing', desc: 'Banbury internal mixers, two-roll compounding mills, and Moving Die Rheometers (MDR).' },
      { step: '02', title: 'Synthetic Elastomers & Silica', desc: 'Solution SBR, EPDM, Nitrile rubber (NBR), and nano-silica reinforcing agents.' },
      { step: '03', title: 'Automotive Rubber Moldings', desc: 'Weatherstrips, engine mounts, fuel hoses, and anti-vibration automotive dampers.' }
    ],
    studentMode: {
      advice: 'The absolute pinnacle event for rubber technology students. Study MDR cure curves ($t_{s2}, t_{90}$) and sulfur crosslink chemistry before attending.',
      keyPavilions: ['Synthetic & Natural Rubber Hall', 'Rubber Machinery & Presses', 'Testing & Rheology Arena'],
      networkingTip: 'Engage compounders at tire producer booths (MRF, Apollo, CEAT) regarding internship projects in rubber characterization.'
    }
  },
  {
    id: 'event-008',
    title: 'IPLEX 2027 — 13th International Plastics Exhibition Hyderabad',
    shortTitle: 'IPLEX 2027 Hyderabad',
    slug: 'iplex-hyderabad-2027',
    startDate: '2027-08-20',
    endDate: '2027-08-23',
    dateDisplay: 'August 20 – 23, 2027',
    monthYearBadge: 'AUG 2027',
    city: 'Hyderabad',
    state: 'Telangana',
    venue: 'HITEX Exhibition Centre, Trade Fair Office Building, IZZAT Nagar, Hyderabad, Telangana 500084',
    focus: 'Joint South-Central India Expo. Pharmaceutical blister packaging, medical devices, rigid containers, and injection moulding automation.',
    focusTags: ['Pharma Packaging', 'Medical Plastics', 'Rigid Containers', 'South Plastics Alliance'],
    organizer: 'TAIPMA, KADPMA, APMSME & Telangana Plastics Association',
    sourceName: 'IPLEX Official / TradeIndia',
    sourceUrl: 'https://www.iplexindia.com',
    lastVerified: '06 Sep 2026',
    eventType: 'Exhibition & Expo',
    isAnchorEvent: false,
    idealFor: [
      'Pharmaceutical Packaging Technologists',
      'Medical Device Injection Molding Engineers',
      'Telangana & Andhra Pradesh SME Processors',
      'CIPET Hyderabad Students & Faculty'
    ],
    whatToSee: [
      { step: '01', title: 'Pharma & Medical Cleanroom Moulding', desc: 'ISO Class 7 cleanroom all-electric injection molding presses for IV sets and diagnostic cassettes.' },
      { step: '02', title: 'High-Barrier Blister Packaging', desc: 'PVC/PVDC, Alu-Alu cold forming, and cyclic olefin copolymer (COC) barrier films.' },
      { step: '03', title: 'Blow Moulding & Rigid Bottles', desc: 'ISBM (Injection Stretch Blow Moulding) machines for pharmaceutical syrup and reagent bottles.' }
    ],
    studentMode: {
      advice: 'Hyderabad is India\'s pharma capital. Focus your visit on medical grade polymer compliance (ISO 10993, USP Class VI).',
      keyPavilions: ['Pharma & Healthcare Plastics Zone', 'Machinery & Moulds Hall', 'Resin & Additives Hub'],
      networkingTip: 'Ask technical directors about regulatory validation steps for medical grade polypropylene and polycarbonate.'
    }
  },
  {
    id: 'event-009',
    title: 'PlastAsia 2027 — 8th International Plastics Exhibition Bengaluru',
    shortTitle: 'PlastAsia 2027 Bengaluru',
    slug: 'plastasia-bengaluru-2027',
    startDate: '2027-07-09',
    endDate: '2027-07-12',
    dateDisplay: 'July 9 – 12, 2027',
    monthYearBadge: 'JUL 2027',
    city: 'Bengaluru',
    state: 'Karnataka',
    venue: 'Bengaluru International Exhibition Centre (BIEC), 10th Mile, Tumkur Road, Bengaluru, Karnataka 560073',
    focus: 'High-tech plastics show. Aerospace carbon fiber composites, 3D printing filaments, precision electronics housings, and Industry 4.0 IoT moulding.',
    focusTags: ['Aerospace Composites', '3D Printing Filament', 'Precision Electronics', 'Industry 4.0'],
    organizer: 'Triune Exhibitors Pvt Ltd & Karnataka State Plastics Association (KSPA)',
    sourceName: 'PlastAsia Official / BIEC',
    sourceUrl: 'https://www.plastasia.in',
    lastVerified: '06 Sep 2026',
    eventType: 'Exhibition & Expo',
    isAnchorEvent: false,
    idealFor: [
      'Aerospace & Defense Composite Engineers (HAL, ISRO suppliers)',
      'Electronics Enclosure Moulding Technicians',
      'Additive Manufacturing & 3D Printing Researchers',
      'Bengaluru Tech Hub Polymer Engineers'
    ],
    whatToSee: [
      { step: '01', title: 'Carbon Fiber & CFRP Composites', desc: 'Resin Transfer Moulding (RTM), autoclave prepregs, and carbon-fiber reinforced polyamides (PA66-CF30).' },
      { step: '02', title: 'Polymer 3D Printing & SLS', desc: 'Industrial Selective Laser Sintering (SLS) with PEEK/PA12 powders and high-temp FDM filaments.' },
      { step: '03', title: 'Smart Factory & Mould Sensors', desc: 'IoT cavity pressure sensors, automated robotic demolding arms, and energy monitoring dashboards.' }
    ],
    studentMode: {
      advice: 'BIEC Bengaluru hosts India\'s highest-tech composite and additive manufacturing exhibits. Bring your research questions on composite mechanics.',
      keyPavilions: ['Advanced Composites & 3D Printing Hall', 'Precision Machinery Hall', 'Smart Factory & Automation Zone'],
      networkingTip: 'Visit composite prepreg stalls and ask application specialists about classical lamination theory $[A][B][D]$ matrix validation.'
    }
  },
  {
    id: 'event-010',
    title: 'Plast Asia Central Expo 2026 — Raipur Plastics & Infrastructure Expo',
    shortTitle: 'Plast Central Raipur',
    slug: 'plast-central-raipur-2026',
    startDate: '2026-12-04',
    endDate: '2026-12-07',
    dateDisplay: 'December 4 – 7, 2026',
    monthYearBadge: 'DEC 2026',
    city: 'Raipur',
    state: 'Chhattisgarh',
    venue: 'Shriram Business Park / Science Centre Ground, Vidhan Sabha Road, Raipur, Chhattisgarh 492007',
    focus: 'Central India regional infrastructure expo. HDPE/PVC pipe extrusion, agricultural drip irrigation systems, and woven sack looms.',
    focusTags: ['Agricultural Plastics', 'HDPE/PVC Pipes', 'Woven Sacks', 'Central India'],
    organizer: 'Chhattisgarh Plastics Manufacturers Association (CPMA)',
    sourceName: 'TradeIndia / CPMA',
    sourceUrl: 'https://www.tradeindia.com',
    lastVerified: '06 Sep 2026',
    eventType: 'Exhibition & Expo',
    isAnchorEvent: false,
    idealFor: [
      'Agricultural Pipe & Drip Irrigation Extruders',
      'Woven Sack Packaging Plant Supervisors',
      'Central India Infrastructure Contractors',
      'Regional Polymer & Chemical Diploma Students'
    ],
    whatToSee: [
      { step: '01', title: 'HDPE Pipe Extrusion Lines', desc: 'Continuous pipe extrusion dies, vacuum calibration tanks, and haul-off units for PE100 municipal water pipes.' },
      { step: '02', title: 'Woven Sack & Circular Looms', desc: 'High-speed circular looms for PP raffia bags used in fertilizer and cement packaging.' },
      { step: '03', title: 'Recycled Granules & Washers', desc: 'Post-agricultural film wash lines and repelletizing machinery.' }
    ],
    studentMode: {
      advice: 'Great hands-on venue to study pipe extrusion pressure flow ($Q_p$) and circular loom raffia orientation.',
      keyPavilions: ['Pipe Extrusion & Irrigation Pavilion', 'Woven Sack Machinery Zone', 'Regional Processors Desk'],
      networkingTip: 'Ask pipe machine operators about vacuum sizing tank temperature control and pipe wall thickness tolerances under IS 4984.'
    }
  },
  {
    id: 'event-011',
    title: 'Global Plastics Circularity Summit & K-Preview 2027',
    shortTitle: 'Global Circularity Summit Mumbai',
    slug: 'global-circularity-summit-mumbai-2027',
    startDate: '2027-05-14',
    endDate: '2027-05-15',
    dateDisplay: 'May 14 – 15, 2027',
    monthYearBadge: 'MAY 2027',
    city: 'Mumbai',
    state: 'Maharashtra',
    venue: 'World Trade Centre Mumbai, Cuffe Parade, Mumbai, Maharashtra 400005 (Hybrid Online Stream)',
    focus: 'International summit on chemical recycling, depolymerization kinetics, bio-feedstocks, life cycle carbon offsets, and global packaging policies.',
    focusTags: ['Global Summit', 'Chemical Recycling', 'Depolymerization', 'LCA & Net Zero', 'Hybrid Stream'],
    organizer: 'International Polymer Sustainability Forum & AIPMA Committee',
    sourceName: 'Plastics News & WTC Mumbai',
    sourceUrl: 'https://www.wtcmumbai.org',
    lastVerified: '06 Sep 2026',
    eventType: 'Industry Summit',
    isAnchorEvent: false,
    idealFor: [
      'Sustainability Directors & Chief Technology Officers',
      'Chemical Recycling & Pyrolysis Plant Developers',
      'Lifecycle Assessment (LCA) Researchers & Consultants',
      'Polymer Students interested in Net-Zero Materials'
    ],
    whatToSee: [
      { step: '01', title: 'Chemical Recycling & Pyrolysis', desc: 'Engineering keynotes on thermal cracking, solvolysis, and mass-balance ISCC PLUS certification.' },
      { step: '02', title: 'Life Cycle Assessment (LCA) Software', desc: 'Simulations of cradle-to-grave carbon footprint modeling for bio-PE vs petroleum polyolefins.' },
      { step: '03', title: 'Global Regulatory & EPR Panel', desc: 'Discussions with EU, US FDA, EFSA, and Indian CPCB regulatory heads on recycled plastic contact approvals.' }
    ],
    studentMode: {
      advice: 'Join via student hybrid livestream if traveling to Mumbai isn\'t feasible. Excellent exposure to chemical recycling reactors and LCA methodologies.',
      keyPavilions: ['Plenary Keynote Stage', 'Chemical Depolymerization Gallery', 'LCA & ESG Strategy Hub'],
      networkingTip: 'Participate actively during Q&A sessions on chemical recycling yield ratios to catch the attention of sustainability hiring managers.'
    }
  }
]

export function computeEventStatus(startDate: string, endDate: string): {
  status: 'Live Today' | 'Upcoming' | 'Past Event'
  badgeText: string
  badgeColor: string
  daysUntil: number
} {
  const now = new Date()
  const start = new Date(startDate + 'T00:00:00+05:30')
  const end = new Date(endDate + 'T23:59:59+05:30')

  if (now >= start && now <= end) {
    return {
      status: 'Live Today',
      badgeText: '● Live Today',
      badgeColor: 'bg-red-50 text-red-700 border border-red-200 animate-pulse',
      daysUntil: 0
    }
  }

  if (now < start) {
    const diffTime = start.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return {
      status: 'Upcoming',
      badgeText: `In ${diffDays}d`,
      badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      daysUntil: diffDays
    }
  }

  return {
    status: 'Past Event',
    badgeText: 'Past Event',
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
