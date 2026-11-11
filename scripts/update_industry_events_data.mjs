// scripts/update_industry_events_data.mjs
import fs from 'fs';

let content = fs.readFileSync('src/lib/industry_events_data.ts', 'utf8');

// 1. Remove event-000 and event-001 from VERIFIED_INDUSTRY_EVENTS
// We find from `export const VERIFIED_INDUSTRY_EVENTS: IndustryEvent[] = [\n  {\n    id: 'event-000'`
// down to right before `  {\n    id: 'event-002'`
const startActivePattern = /export const VERIFIED_INDUSTRY_EVENTS: IndustryEvent\[\] = \[\r?\n  \{\r?\n    id: 'event-000',[\s\S]*?(?=  \{\r?\n    id: 'event-002')/;

if (!startActivePattern.test(content)) {
  console.error('Could not find startActivePattern');
  process.exit(1);
}

content = content.replace(startActivePattern, 'export const VERIFIED_INDUSTRY_EVENTS: IndustryEvent[] = [\n');

// 2. Insert Indplas 2027 right before event-009
const indplasCode = `  {
    id: 'event-indplas-2027',
    title: 'Indplas 2027 — 9th International Exhibition on Plastics',
    shortTitle: 'Indplas 2027 Kolkata',
    slug: 'indplas-kolkata-2027',
    startDate: '2027-02-26',
    endDate: '2027-03-01',
    dateDisplay: 'February 26 – March 1, 2027',
    monthYearBadge: 'FEB 2027',
    city: 'Kolkata',
    state: 'West Bengal',
    venue: 'Biswa Bangla Mela Prangan, Opp Science City, J.B.S. Haldane Avenue, Kolkata, West Bengal 700046',
    focus: 'Eastern India and SAARC gateway for polymers: high-output injection moulding, heavy-duty blow moulding, multilayer film extrusion, recycling machinery, and petrochemical masterbatches.',
    focusTags: ['Eastern India Hub', 'IPF Kolkata', 'Biswa Bangla', 'SAARC Gateway', 'Injection & Extrusion'],
    organizer: 'Indian Plastics Federation (IPF)',
    sourceName: 'Indian Plastics Federation Official Portal',
    sourceUrl: 'https://www.indplas.in',
    lastVerified: '11 Nov 2026',
    eventType: 'Exhibition & Expo',
    priorityBadge: 'P0 Flagship',
    isAnchorEvent: true,
    idealFor: [
      'Eastern India & SAARC Polymer Processors (Bangladesh, Nepal, Bhutan)',
      'Haldia Petrochemicals & IOCL Downstream Converter Units',
      'Blow Moulding, Container, & Industrial Drum Manufacturers',
      'CIPET Kolkata, CIPET Bhubaneswar, & Calcutta University Polymer Tech Trainees'
    ],
    whatToSee: [
      { step: '01', title: 'High-Output Extrusion & Blow Moulding', desc: 'Continuous extrusion blow moulding lines for 5L to 200L L-ring chemical drums and industrial containers.' },
      { step: '02', title: 'Petrochemical & Polymer Granules', desc: 'Direct pavilions from Haldia Petrochemicals (HPL), Indian Oil (IOCL), Reliance, and international polymer traders.' },
      { step: '03', title: 'Circular Economy & EPR Solutions', desc: 'Post-consumer washing plants, friction washers, and odorless mechanical recycling compounders.' }
    ],
    studentMode: {
      advice: 'Indplas is Eastern India\\'s premier flagship plastics exhibition. Outstanding platform to connect with plant managers from Haldia, Durgapur, Guwahati, and Cuttack polymer clusters.',
      keyPavilions: ['IPF Flagship Machinery Arena', 'HPL & Petrochemical Pavilion', 'Recycling & Masterbatch Zone'],
      networkingTip: 'Visit Indian Plastics Federation helpdesk to learn about regional technical seminars and placement drives in Eastern India.'
    }
  },
`;

content = content.replace(/(\r?\n  \{\r?\n    id: 'event-009',)/, '\n' + indplasCode + '$1');

// 3. Insert PackPlus 2027 right before event-010
const packplusCode = `  {
    id: 'event-packplus-2027',
    title: 'PackPlus 2027 — Total Packaging, Converting & Supply Chain Showcase',
    shortTitle: 'PackPlus 2027 New Delhi',
    slug: 'packplus-delhi-2027',
    startDate: '2027-05-06',
    endDate: '2027-05-08',
    dateDisplay: 'May 6 – 8, 2027',
    monthYearBadge: 'MAY 2027',
    city: 'New Delhi',
    state: 'Delhi NCR',
    venue: 'Bharat Mandapam (IECC), Pragati Maidan, New Delhi 110001',
    focus: 'Total packaging value chain: flexible barrier films, pouches, multilayer co-extrusion, rigid plastic containers, corrugated packaging, and automation technologies.',
    focusTags: ['Flexible Packaging', 'Barrier Films', 'RX India', 'Bharat Mandapam', 'Packaging Automation'],
    organizer: 'RX India (Reed Exhibitions)',
    sourceName: 'PackPlus Official Portal',
    sourceUrl: 'https://www.packplus.in',
    lastVerified: '11 Nov 2026',
    eventType: 'Exhibition & Expo',
    priorityBadge: 'P0 Flagship',
    isAnchorEvent: true,
    idealFor: [
      'Flexible Packaging Converters & Multi-layer Extrusion Specialists',
      'FMCG, Food & Pharma Packaging Development Engineers',
      'Barrier Resin Compounders (EVOH, PVDC, PA-6)',
      'IIT Delhi, CIPET Murthal, & Delhi Technological University Students'
    ],
    whatToSee: [
      { step: '01', title: 'Multilayer Barrier Extrusion', desc: '5-layer and 7-layer barrier blown film structures for retort food and modified atmosphere packaging.' },
      { step: '02', title: 'High-Speed Pouching & Form-Fill-Seal', desc: 'Servo-driven FFS machinery, stand-up pouch makers with zipper insertion, and solventless lamination.' },
      { step: '03', title: 'Mono-Material Recyclable Laminates', desc: 'All-PE and all-PP recyclable flexible packaging substrates conforming to CPCB EPR mandates.' }
    ],
    studentMode: {
      advice: 'The leading packaging expo in North India. Crucial for students specializing in polymer packaging, barrier properties (OTR/WVTR), and EPR compliance.',
      keyPavilions: ['Flexible Packaging Hall', 'Converting & Printing Arena', 'Sustainable Materials Pavilion'],
      networkingTip: 'Speak with technical packaging managers about ASTM barrier test methods and mono-material pouch barrier retention.'
    }
  },
`;

content = content.replace(/(\r?\n  \{\r?\n    id: 'event-010',)/, '\n' + packplusCode + '$1');

// 4. Insert RubberTech 2027 right after event-016 before end of VERIFIED_INDUSTRY_EVENTS array
const rubberTechCode = `,
  {
    id: 'event-rubbertech-2027',
    title: 'RubberTech India 2027 — International Exhibition on Rubber Technology & Elastomers',
    shortTitle: 'RubberTech India 2027 Mumbai',
    slug: 'rubbertech-mumbai-2027',
    startDate: '2027-10-07',
    endDate: '2027-10-09',
    dateDisplay: 'October 7 – 9, 2027',
    monthYearBadge: 'OCT 2027',
    city: 'Mumbai',
    state: 'Maharashtra',
    venue: 'Bombay Exhibition Centre (BEC/NESCO), Western Express Highway, Goregaon East, Mumbai, Maharashtra 400063',
    focus: 'Elastomer processing, synthetic rubber compounding, carbon black, vulcanization accelerators, tyre testing, and rubber-to-metal bonding.',
    focusTags: ['Rubber Technology', 'Elastomers', 'Synthetic Rubber', 'Compounding Chemicals', 'BEC Mumbai'],
    organizer: 'All India Rubber Industries Association & International Exhibition Partners',
    sourceName: 'RubberTech India Official Portal',
    sourceUrl: 'https://www.rubbertech-expo.com',
    lastVerified: '11 Nov 2026',
    eventType: 'Exhibition & Expo',
    priorityBadge: 'P1 Regional',
    isAnchorEvent: false,
    idealFor: [
      'Rubber Technologists & Elastomer Compounders',
      'Tyre (MRF, Apollo, CEAT, JK) & Non-Tyre Rubber Compound Engineers',
      'Synthetic Rubber (SBR, NBR, EPDM, FKM) Processors',
      'ICT Mumbai, IIT Kharagpur Rubber Technology, & Rubber Skill Development Trainees'
    ],
    whatToSee: [
      { step: '01', title: 'Internal Mixers & Two-Roll Mills', desc: 'Tangential and intermeshing Banbury mixers, automated chemical batch dosing, and stock blenders.' },
      { step: '02', title: 'Elastomer Testing & Rheometry', desc: 'Moving Die Rheometers (MDR), Mooney viscometers, and automated DIN abrasion testers.' },
      { step: '03', title: 'Green Tyre Technology & Silica Compounding', desc: 'Silane coupling agents, low-rolling-resistance functionalized synthetic rubbers, and reclaim rubber devulcanization.' }
    ],
    studentMode: {
      advice: 'Rubber and elastomer technology is a high-demand core field with lucrative placements in tyre and auto component majors. Focus on vulcanization kinetics and filler reinforcement.',
      keyPavilions: ['Elastomer Raw Materials Pavilion', 'Machinery & Mixing Hall', 'Tyre Testing Technology Zone'],
      networkingTip: 'Ask compounders about cure curve parameters (ts2, tc90) and the trade-off between heat build-up and tensile strength in dynamic applications.'
    }
  }
];`;

content = content.replace(/\r?\n  \}\r?\n\]\r?\n\r?\n\/\/ ── 2\. HISTORICAL ARCHIVE/, rubberTechCode + '\n\n// ── 2. HISTORICAL ARCHIVE');

// 5. Append DIEMEX and Plast Champions to ARCHIVED_INDUSTRY_EVENTS
const archivedDiemexAndChampions = `,
  {
    id: 'arch-007',
    title: 'DIEMEX 2026 — International Tooling, Die & Mould Exhibition',
    shortTitle: 'DIEMEX 2026 Pune',
    slug: 'diemex-pune-2026',
    startDate: '2026-10-08',
    endDate: '2026-10-10',
    dateDisplay: 'October 8 – 10, 2026',
    monthYearBadge: 'OCT 2026',
    city: 'Pune',
    state: 'Maharashtra',
    venue: 'Auto Cluster Exhibition Centre, H-Block, Chinchwad, Pune, Maharashtra 411019',
    focus: 'Die & mould manufacturing, precision tooling solutions, CNC machining, EDM spark erosion, and advanced manufacturing across automotive, aerospace, electronics, consumer goods, and packaging sectors.',
    focusTags: ['Completed Event', 'Die & Mould', 'Precision Tooling', 'Automotive Plastics', 'Pune Cluster'],
    organizer: 'Auto Cluster Exhibition Centre & Tooling Industry Association',
    sourceName: 'Auto Cluster Official Portal',
    sourceUrl: 'https://www.autocluster.in',
    lastVerified: '11 Nov 2026',
    eventType: 'Exhibition & Expo',
    priorityBadge: 'P1 Regional',
    isAnchorEvent: false,
    idealFor: [
      'Die & Mould Designers & Toolroom Engineers',
      'Automotive Component Molders & Tier-1 Suppliers (Tata Motors, Bajaj, Mahindra)',
      'Precision Injection Moulding & Tooling Technicians',
      'COEP, MIT Pune, & Government Polytechnic Tooling Trainees'
    ],
    whatToSee: [
      { step: '01', title: 'Precision Tooling & Mould Inserts', desc: 'Hardened P20, H13, and NAK80 steel core/cavity machining, 5-axis CNC contour milling, and wire-EDM spark erosion.' },
      { step: '02', title: 'Hot Runner & Temperature Control', desc: 'Valve-gated hot runner manifolds, sequential valve timers, and conformal cooling channel inserts.' },
      { step: '03', title: 'Automotive & Aerospace Enclosures', desc: 'Precision plastic components for automotive dashboard panels, electrical connectors, and packaging molds.' }
    ],
    studentMode: {
      advice: 'Successfully concluded in October 2026 at Auto Cluster Chinchwad, Pune. Next edition planned for October 2028.',
      keyPavilions: ['Tooling & Die Mould Pavilion', 'CNC & Precision Machining Arena', 'Automotive Plastics Zone'],
      networkingTip: 'Visit hot runner and tool steel stalls; ask application engineers about core deflection calculation methods and cooling channel optimization.'
    }
  },
  {
    id: 'arch-008',
    title: 'Plast Champions — International Plastics Expo 2026',
    shortTitle: 'Plast Champions Vadodara',
    slug: 'plast-champions-vadodara-2026',
    startDate: '2026-10-30',
    endDate: '2026-11-01',
    dateDisplay: 'October 30 – November 1, 2026',
    monthYearBadge: 'OCT 2026',
    city: 'Vadodara',
    state: 'Gujarat',
    venue: 'Navlakhi Ground / Anusuya Leprosy Ground, Opp Sardar Estate, Vadodara, Gujarat 390019',
    focus: 'Plastics raw materials, high-speed processing machinery, petrochemical masterbatches, and auxiliary equipment.',
    focusTags: ['Completed Event', 'Plastics Materials', 'Machinery', 'Petrochemicals', 'Extrusion & Tooling'],
    organizer: 'Plast Champions Expo Committee & IPMA',
    sourceName: 'TradeIndia / Official Organizer Portal',
    sourceUrl: 'https://www.tradeindia.com',
    lastVerified: '11 Nov 2026',
    eventType: 'Exhibition & Expo',
    priorityBadge: 'P1 Regional',
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
      advice: 'Successfully concluded on November 1, 2026 in Vadodara (Gujarat\\'s petrochemical hub). Follow IPMA announcements for the next edition.',
      keyPavilions: ['Machinery & Automation Hall', 'Raw Material & Additive Pavilion', 'Gujarat CIPET Alumni Desk'],
      networkingTip: 'Visit machine manufacturer stalls during afternoon hours to ask application engineers about cycle-time optimization formulas.'
    }
  }
];`;

content = content.replace(/\r?\n  \}\r?\n\]\r?\n\r?\n\/\/ ── 3\. HELPER FUNCTIONS/, archivedDiemexAndChampions + '\n\n// ── 3. HELPER FUNCTIONS');

// 6. Add master exports and dynamic partitioning functions
const newHelperFunctions = `
// ── MASTER COMBINED REGISTRY (26 VERIFIED INDUSTRY EVENTS) ─────────────────────
export const ALL_VERIFIED_INDUSTRY_EVENTS: IndustryEvent[] = [
  ...VERIFIED_INDUSTRY_EVENTS,
  ...ARCHIVED_INDUSTRY_EVENTS
];

export function isEventUpcoming(event: IndustryEvent, asOfDate: Date = new Date()): boolean {
  const asOfStr = asOfDate.toISOString().slice(0, 10);
  return event.endDate >= asOfStr;
}

export function isEventLive(event: IndustryEvent, asOfDate: Date = new Date()): boolean {
  const asOfStr = asOfDate.toISOString().slice(0, 10);
  return event.startDate <= asOfStr && event.endDate >= asOfStr;
}

export function isEventConcluded(event: IndustryEvent, asOfDate: Date = new Date()): boolean {
  const asOfStr = asOfDate.toISOString().slice(0, 10);
  return event.endDate < asOfStr;
}

export function partitionIndustryEvents(events: IndustryEvent[], asOfDate: Date = new Date()): {
  live: IndustryEvent[]
  upcoming: IndustryEvent[]
  concluded: IndustryEvent[]
} {
  const asOfStr = asOfDate.toISOString().slice(0, 10);
  const live: IndustryEvent[] = [];
  const upcoming: IndustryEvent[] = [];
  const concluded: IndustryEvent[] = [];

  for (const ev of events) {
    if (ev.startDate <= asOfStr && ev.endDate >= asOfStr) {
      live.push(ev);
      upcoming.push(ev);
    } else if (ev.startDate > asOfStr) {
      upcoming.push(ev);
    } else {
      concluded.push(ev);
    }
  }

  // Chronological sort: nearest upcoming first
  upcoming.sort((a, b) => a.startDate.localeCompare(b.startDate));
  // Reverse chronological: most recent concluded first
  concluded.sort((a, b) => b.endDate.localeCompare(a.endDate));

  return { live, upcoming, concluded };
}
`;

content += newHelperFunctions;

fs.writeFileSync('src/lib/industry_events_data.ts', content, 'utf8');
console.log('Successfully updated src/lib/industry_events_data.ts');
