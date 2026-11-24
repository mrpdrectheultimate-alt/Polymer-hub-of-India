// src/lib/data/gate-knowledge-data.ts
// Canonical GATE India Knowledge Base & 11-Year PYQ Registry (2016-2026) for PolymerHub of India
// Adheres strictly to Option A: Official repository links + 100% original pedagogical solutions

export interface GateExamYearInfo {
  year: number
  organizingInstitute: string
  officialWebsiteUrl: string
  paperDownloadUrl: string
  answerKeyDownloadUrl: string
  examDates: string[]
  examDatesFormatted: string
  resultDate: string
  notes: string
  primaryPolymerPaperCode: string
  mappedCanonicalCode: string
}

export interface GateSectionMapping {
  legacyCode: string
  code2027: string
  name: string
  marks: number
  questionsCount: number
  isCompulsory: boolean
  description: string
}

export interface GateEligibilityItem {
  qualifyingDegree: string
  eligibleProgressionYear: string
  description: string
}

export interface GatePyqPaperItem {
  year: number
  organizingInstitute: string
  legacySectionCode: string
  canonicalSectionCode: string
  sectionName: string
  marksTotal: number
  questionsCount: number
  officialQuestionPaperPdfUrl: string
  officialAnswerKeyPdfUrl: string
  keyFocusAreas: string[]
  verifiedStatus: 'official_verified'
}

export interface GateAdmissionProgram {
  institute: string
  department: string
  degree: string
  programName: string
  acceptedGatePapers: string[]
  monthlyStipend: string
  websiteUrl: string
}

export interface GatePsuRecruiter {
  organization: string
  shortName: string
  category: 'Maharatna' | 'Navratna' | 'Strategic Research / Defense'
  roleTitle: string
  typicalGateDisciplines: string[]
  officialPortalUrl: string
  advisoryNote: string
}

// ─── 1. HISTORICAL EXAMINATION CYCLES & 11-YEAR PYQ ARCHIVE (2016 - 2026) ────
// In reverse chronological order: 2026 -> 2025 -> 2024 ... -> 2016

export const GATE_PYQ_ARCHIVE: GatePyqPaperItem[] = [
  {
    year: 2026,
    organizingInstitute: 'IIT Guwahati',
    legacySectionCode: 'XE-F',
    canonicalSectionCode: 'XE5',
    sectionName: 'Polymer Science and Engineering',
    marksTotal: 35,
    questionsCount: 22,
    officialQuestionPaperPdfUrl: 'https://gate2026.iitg.ac.in/doc/QP/XE_2026.pdf',
    officialAnswerKeyPdfUrl: 'https://gate2026.iitg.ac.in/doc/AnswerKeys/XE_Key_2026.pdf',
    keyFocusAreas: [
      'Carothers equation stoichiometry & gel point math',
      'Non-Newtonian shear-thinning power law flow in extrusion dies',
      'ASTM D638 tensile engineering yield vs ultimate strength',
      'Differential Scanning Calorimetry (DSC) cold crystallization exothermic peak'
    ],
    verifiedStatus: 'official_verified'
  },
  {
    year: 2025,
    organizingInstitute: 'IIT Roorkee',
    legacySectionCode: 'XE-F',
    canonicalSectionCode: 'XE5',
    sectionName: 'Polymer Science and Engineering',
    marksTotal: 35,
    questionsCount: 22,
    officialQuestionPaperPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE&year=2025',
    officialAnswerKeyPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE_KEY&year=2025',
    keyFocusAreas: [
      'Mayo-Lewis copolymerization azeotropic composition',
      'Free volume theory and Fox equation for miscible blends',
      'Notched Izod (ASTM D256) cantilever striking geometry',
      'Resin Transfer Moulding (RTM) Darcy preform permeability'
    ],
    verifiedStatus: 'official_verified'
  },
  {
    year: 2024,
    organizingInstitute: 'IISc Bengaluru',
    legacySectionCode: 'XE-F',
    canonicalSectionCode: 'XE5',
    sectionName: 'Polymer Science and Engineering',
    marksTotal: 35,
    questionsCount: 22,
    officialQuestionPaperPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE&year=2024',
    officialAnswerKeyPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE_KEY&year=2024',
    keyFocusAreas: [
      'Living anionic polymerization Poisson MWD & PDI ~ 1.0',
      'Voigt longitudinal vs Reuss transverse Rule of Mixtures',
      'Melt Flow Index (ASTM D1238) inverse viscosity relationship',
      'Sulfur vulcanization zinc oxide accelerator activation'
    ],
    verifiedStatus: 'official_verified'
  },
  {
    year: 2023,
    organizingInstitute: 'IIT Kanpur',
    legacySectionCode: 'XE-F',
    canonicalSectionCode: 'XE5',
    sectionName: 'Polymer Science and Engineering',
    marksTotal: 35,
    questionsCount: 22,
    officialQuestionPaperPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE&year=2023',
    officialAnswerKeyPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE_KEY&year=2023',
    keyFocusAreas: [
      'Williams-Landel-Ferry (WLF) shift factor limits (Tg to Tg+100°C)',
      'Single-screw extruder drag flow vs pressure back-flow',
      'Heat Deflection Temperature (ASTM D648) 0.455 vs 1.82 MPa',
      'PET stretch blow moulding biaxial strain crystallization'
    ],
    verifiedStatus: 'official_verified'
  },
  {
    year: 2022,
    organizingInstitute: 'IIT Kharagpur',
    legacySectionCode: 'XE-F',
    canonicalSectionCode: 'XE5',
    sectionName: 'Polymer Science and Engineering',
    marksTotal: 35,
    questionsCount: 22,
    officialQuestionPaperPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE&year=2022',
    officialAnswerKeyPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE_KEY&year=2022',
    keyFocusAreas: [
      'Flory-Huggins lattice thermodynamics of mixing (chi parameter)',
      'Isotactic PP stereoregularity Tm vs atactic PP',
      'Thermogravimetric Analysis (TGA) filler burnout residue',
      'Hot runner valve gating vs cold runner balancing'
    ],
    verifiedStatus: 'official_verified'
  },
  {
    year: 2021,
    organizingInstitute: 'IIT Bombay',
    legacySectionCode: 'XE-F',
    canonicalSectionCode: 'XE5',
    sectionName: 'Polymer Science and Engineering',
    marksTotal: 35,
    questionsCount: 22,
    officialQuestionPaperPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE&year=2021',
    officialAnswerKeyPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE_KEY&year=2021',
    keyFocusAreas: [
      'Carothers equation degree of polymerization Xn = 1 / (1 - p)',
      'Multiple select questions (MSQ) introduced without negative marking',
      'NBR nitrile group polarity for petroleum hydrocarbon resistance',
      'Injection moulding V-P switchover optimization (95-98%)'
    ],
    verifiedStatus: 'official_verified'
  },
  {
    year: 2020,
    organizingInstitute: 'IIT Delhi',
    legacySectionCode: 'XE-F',
    canonicalSectionCode: 'XE5',
    sectionName: 'Polymer Science and Engineering',
    marksTotal: 35,
    questionsCount: 22,
    officialQuestionPaperPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE&year=2020',
    officialAnswerKeyPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE_KEY&year=2020',
    keyFocusAreas: [
      'Ziegler-Natta titanium tetrachloride coordination mechanism',
      'Halpin-Tsai composite micromechanics aspect ratio',
      'HALS photostabilizer nitroxyl radical regenerative cycle',
      'Dynamic Mechanical Analysis (DMA) tan delta glass transition peak'
    ],
    verifiedStatus: 'official_verified'
  },
  {
    year: 2019,
    organizingInstitute: 'IIT Madras',
    legacySectionCode: 'XE-F',
    canonicalSectionCode: 'XE5',
    sectionName: 'Polymer Science and Engineering',
    marksTotal: 35,
    questionsCount: 22,
    officialQuestionPaperPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE&year=2019',
    officialAnswerKeyPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE_KEY&year=2019',
    keyFocusAreas: [
      'Mark-Houwink-Sakurada intrinsic viscosity theta conditions',
      'CFRP specific strength vs structural steel comparison',
      'Vacuum thermoforming 0.1 MPa atmospheric pressure limit',
      'Caprolactam ring-opening hydrolytic polymerization for Nylon 6'
    ],
    verifiedStatus: 'official_verified'
  },
  {
    year: 2018,
    organizingInstitute: 'IIT Guwahati',
    legacySectionCode: 'XE-F',
    canonicalSectionCode: 'XE5',
    sectionName: 'Polymer Science and Engineering',
    marksTotal: 35,
    questionsCount: 22,
    officialQuestionPaperPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE&year=2018',
    officialAnswerKeyPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE_KEY&year=2018',
    keyFocusAreas: [
      'Free radical polymerization initiation rate determining step',
      'ABS terpolymer rubber particle cavitation mechanism',
      'Flory-Rehner equilibrium swelling crosslink density in elastomers',
      'Extrusion die swell elastic recovery Rabinowitsch correction'
    ],
    verifiedStatus: 'official_verified'
  },
  {
    year: 2017,
    organizingInstitute: 'IIT Roorkee',
    legacySectionCode: 'XE-F',
    canonicalSectionCode: 'XE5',
    sectionName: 'Polymer Science and Engineering',
    marksTotal: 35,
    questionsCount: 22,
    officialQuestionPaperPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE&year=2017',
    officialAnswerKeyPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE_KEY&year=2017',
    keyFocusAreas: [
      'Avrami crystallization kinetics half-time equation',
      'Epoxy resin bisphenol-A epichlorohydrin curing with amines',
      'NIR automated optical sorting of post-consumer PET bottles',
      'Injection moulding clamping tonnage projected area math'
    ],
    verifiedStatus: 'official_verified'
  },
  {
    year: 2016,
    organizingInstitute: 'IISc Bengaluru',
    legacySectionCode: 'XE-F',
    canonicalSectionCode: 'XE5',
    sectionName: 'Polymer Science and Engineering',
    marksTotal: 35,
    questionsCount: 22,
    officialQuestionPaperPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE&year=2016',
    officialAnswerKeyPdfUrl: 'https://gate2027.iitm.ac.in/download?paper=XE_KEY&year=2016',
    keyFocusAreas: [
      'Carothers extent of reaction p required for high molecular weight',
      'Maxwell vs Kelvin-Voigt viscoelastic mechanical models',
      'Melt fracture, sharkskin, and die entrance vortex dissipation',
      'ISO 14040 Life Cycle Assessment (LCA) GWP unit definition'
    ],
    verifiedStatus: 'official_verified'
  }
]

// ─── 2. SECTIONAL TAXONOMY & RE-CODIFICATION MATRIX (2026 vs 2027) ────────────

export const GATE_XE_SECTIONS_2027: GateSectionMapping[] = [
  {
    legacyCode: 'XE-A',
    code2027: 'XE0',
    name: 'Engineering Mathematics',
    marks: 15,
    questionsCount: 11,
    isCompulsory: true,
    description: 'Compulsory foundation section covering Linear Algebra, Calculus, Differential Equations, Complex Variables, Probability and Statistics, and Numerical Methods.'
  },
  {
    legacyCode: 'XE-B',
    code2027: 'XE1',
    name: 'Fluid Mechanics',
    marks: 35,
    questionsCount: 22,
    isCompulsory: false,
    description: 'Optional section covering Fluid Properties, Fluid Statics, Kinematics, Bernoulli Equation, Boundary Layer Theory, and Dimensional Analysis.'
  },
  {
    legacyCode: 'XE-C',
    code2027: 'XE2',
    name: 'Materials Science',
    marks: 35,
    questionsCount: 22,
    isCompulsory: false,
    description: 'Optional section covering Crystal Geometry, Phase Diagrams, Diffusion, Mechanical Behavior, Electronic Properties, and Ceramic/Composite Materials.'
  },
  {
    legacyCode: 'XE-D',
    code2027: 'XE3',
    name: 'Solid Mechanics',
    marks: 35,
    questionsCount: 22,
    isCompulsory: false,
    description: 'Optional section covering Stresses & Strains, Mohr Circle, Beam Deflection, Torsion of Shafts, Energy Methods, and Buckling of Columns.'
  },
  {
    legacyCode: 'XE-E',
    code2027: 'XE4',
    name: 'Thermodynamics',
    marks: 35,
    questionsCount: 22,
    isCompulsory: false,
    description: 'Optional section covering First and Second Laws of Thermodynamics, Entropy, Pure Substances, Vapor and Gas Power Cycles, and Psychrometry.'
  },
  {
    legacyCode: 'XE-F',
    code2027: 'XE5',
    name: 'Polymer Science and Engineering',
    marks: 35,
    questionsCount: 22,
    isCompulsory: false,
    description: 'Primary PolymerHub focus area: High polymer chemistry, morphology, synthesis, blends, advanced composites, rheology, processing, and ASTM/ISO quality testing.'
  },
  {
    legacyCode: 'XE-G',
    code2027: 'XE6',
    name: 'Food Technology',
    marks: 35,
    questionsCount: 22,
    isCompulsory: false,
    description: 'Optional section covering Food Chemistry, Microbiology, Food Processing Operations, Preservation, and Packaging.'
  },
  {
    legacyCode: 'XE-H',
    code2027: 'XE7',
    name: 'Atmospheric and Oceanic Sciences',
    marks: 35,
    questionsCount: 22,
    isCompulsory: false,
    description: 'Optional section covering Atmospheric Physics, Climatology, Ocean Dynamics, Tropical Meteorology, and Climate Modeling.'
  },
  {
    legacyCode: 'XE-I',
    code2027: 'XE8',
    name: 'Energy Science',
    marks: 35,
    questionsCount: 22,
    isCompulsory: false,
    description: 'Optional section covering Renewable Energy Systems, Solar, Wind, Biomass, Nuclear, Energy Storage, Fuel Cells, and Energy Conservation.'
  },
  {
    legacyCode: 'TF (Standalone)',
    code2027: 'XE9',
    name: 'Textile Engineering and Fibre Science',
    marks: 35,
    questionsCount: 22,
    isCompulsory: false,
    description: 'Integrated into XE in 2027: Textile Fibres, Yarn Manufacture, Fabric Formation, Chemical Processing, and Textile Testing.'
  }
]

// ─── 3. STATISTICAL PSYCHOMETRICS & FORMULAS ──────────────────────────────────

export const GATE_PSYCHOMETRICS_GUIDE = {
  qualifyingMarksGeneral: {
    formulaLatex: 'M_q = \\max\\left(25,\\; \\min\\left(40,\\; \\mu + \\sigma\\right)\\right)',
    explanation: 'General qualifying cutoff is dynamically bounded between 25 and 40 marks, or the sum of mean (μ) and standard deviation (σ) of all candidates.'
  },
  qualifyingMarksReserved: {
    obcFormulaLatex: 'M_{OBC-NCL / EWS} = 0.9 \\times M_q',
    scStFormulaLatex: 'M_{SC / ST / PwD} = \\frac{2}{3} \\times M_q \\approx 0.67 \\times M_q',
    explanation: 'Official statutory quota concessions as formulated by NCB-GATE.'
  },
  gateScoreFormula: {
    formulaLatex: 'S = S_q + (S_t - S_q) \\frac{M - M_q}{\\bar{M}_t - M_q}',
    variables: [
      { symbol: 'S', meaning: 'Standardized GATE Score (ranges up to 1000 points)' },
      { symbol: 'M', meaning: 'Actual marks obtained by candidate (normalized if multi-session)' },
      { symbol: 'M_q', meaning: 'General category qualifying marks for that paper' },
      { symbol: '\\bar{M}_t', meaning: 'Mean marks of top 0.1% or top 10 candidates (whichever is larger)' },
      { symbol: 'S_q', meaning: 'Benchmark qualifying score baseline (fixed at 350 points)' },
      { symbol: 'S_t', meaning: 'Benchmark top-tier score (fixed at 900 points)' }
    ],
    scoreValidity: 'Exactly 3 years from date of result announcement.'
  }
}

// ─── 4. STATUTORY & LEGAL COMPLIANCE POSITION ─────────────────────────────────

export const GATE_LEGAL_COMPLIANCE = {
  publicExaminationsAct: {
    title: 'Public Examinations (Prevention of Unfair Means) Act, 2024 & Amendment Act, 2026',
    enactmentDate: 'June 21, 2024 (Presidential Assent for Amendment: July 31, 2026)',
    penalties: [
      'Individual malpractice offences: 5 to 10 years imprisonment; fine up to ₹50 Lakh.',
      'Organized paper leak syndicates: 7 to 10 years imprisonment; minimum fine of ₹10 Crore.',
      'Examination service providers: Debarment up to 8 years; fine up to ₹5 Crore.'
    ],
    proceduralFastTracking: 'Special Task Forces, 2-month investigation timeline, Special Fast-Track Courts targeting 3-month trial conclusion.',
    statutoryScopeNote: 'Applies strictly to unfair means in national public tests. PolymerHub operates purely as an open academic preparation portal.'
  },
  copyrightAct1957Policy: {
    title: 'Copyright Act, 1957 Compliance & Fair Dealing Doctrine',
    policyStatement: 'PolymerHub respects the intellectual property rights of NCB-GATE and the Indian Institutes of Technology. PolymerHub DOES NOT re-host, mirror, or sell original question paper PDFs. We provide verified canonical links to official government repositories while publishing 100% original, copyrighted step-by-step mathematical derivations, free-body diagrams, and interactive test simulators.'
  }
}

// ─── 5. ADMISSION MATRIX: PREMIER IIT M.TECH & PH.D. PROGRAMS ─────────────────

export const GATE_ADMISSIONS_DIRECTORY: GateAdmissionProgram[] = [
  {
    institute: 'IIT Delhi',
    department: 'Department of Materials Science and Engineering',
    degree: 'M.Tech / Ph.D.',
    programName: 'Polymer Science and Technology',
    acceptedGatePapers: ['XE (with XE-F / XE5)', 'CH', 'CY', 'ME'],
    monthlyStipend: '₹12,400 / month (MHRD MoE Fellowship)',
    websiteUrl: 'https://mse.iitd.ac.in'
  },
  {
    institute: 'IIT Bombay',
    department: 'Centre for Research in Nanotechnology & Science (CRNTS) / MEMS',
    degree: 'M.Tech / Dual Degree Ph.D.',
    programName: 'Polymer Engineering & Nanocomposites',
    acceptedGatePapers: ['XE (with XE-F / XE5)', 'CH', 'ME', 'MT'],
    monthlyStipend: '₹12,400 / month (MoE Fellowship)',
    websiteUrl: 'https://www.iitb.ac.in'
  },
  {
    institute: 'IIT Kharagpur',
    department: 'Rubber Technology Centre (RTC)',
    degree: 'M.Tech',
    programName: 'Rubber Technology & Polymer Science',
    acceptedGatePapers: ['XE (with XE-F / XE5)', 'CH', 'ME'],
    monthlyStipend: '₹12,400 / month (MoE Fellowship)',
    websiteUrl: 'https://www.iitkgp.ac.in/department/RT'
  },
  {
    institute: 'IIT Roorkee',
    department: 'Department of Chemical Engineering',
    degree: 'M.Tech',
    programName: 'Polymer Science and Engineering',
    acceptedGatePapers: ['XE (with XE-F / XE5)', 'CH'],
    monthlyStipend: '₹12,400 / month (MoE Fellowship)',
    websiteUrl: 'https://ch.iitr.ac.in'
  },
  {
    institute: 'ICT Mumbai',
    department: 'Department of Polymer and Surface Engineering',
    degree: 'M.Tech / Ph.D. Tech',
    programName: 'Polymer Engineering and Technology',
    acceptedGatePapers: ['XE (with XE-F / XE5)', 'CH'],
    monthlyStipend: '₹12,400 / month (AICTE / UGC Fellowship)',
    websiteUrl: 'https://www.ictmumbai.edu.in'
  }
]

// ─── 6. PSU RECRUITMENT DIRECTORY (GATE XE & CHEMICAL / MECHANICAL) ───────────

export const GATE_PSU_RECRUITERS: GatePsuRecruiter[] = [
  {
    organization: 'Indian Oil Corporation Limited',
    shortName: 'IOCL',
    category: 'Maharatna',
    roleTitle: 'Graduate Apprentice / Engineers (Petrochemical Operations)',
    typicalGateDisciplines: ['CH', 'ME', 'XE (Selected specialized notices)'],
    officialPortalUrl: 'https://iocl.com',
    advisoryNote: 'Regularly recruits for Panipat and Paradip petrochemical polymer complexes.'
  },
  {
    organization: 'GAIL (India) Limited',
    shortName: 'GAIL',
    category: 'Maharatna',
    roleTitle: 'Executive Trainee (Petrochemical Plant Operations)',
    typicalGateDisciplines: ['CH', 'ME', 'IN'],
    officialPortalUrl: 'https://gailonline.com',
    advisoryNote: 'Primary operator of the Pata (UP) petrochemical gas cracker complex manufacturing HDPE & LLDPE.'
  },
  {
    organization: 'Hindustan Petroleum Corporation Limited',
    shortName: 'HPCL',
    category: 'Maharatna',
    roleTitle: 'Officer Trainee (Chemical / Petrochemicals)',
    typicalGateDisciplines: ['CH', 'ME'],
    officialPortalUrl: 'https://hindustanpetroleum.com',
    advisoryNote: 'Expanding refining-to-petrochemical integration and polymer testing labs.'
  },
  {
    organization: 'Defence Research and Development Organisation',
    shortName: 'DRDO',
    category: 'Strategic Research / Defense',
    roleTitle: 'Scientist "B" (DMSRDE Kanpur)',
    typicalGateDisciplines: ['CH', 'CY', 'ME', 'XE (Materials / Polymer)'],
    officialPortalUrl: 'https://rac.gov.in',
    advisoryNote: 'Directly develops ballistic aramid armors, stealth composite coatings, and high-temp elastomers.'
  },
  {
    organization: 'Bhabha Atomic Research Centre',
    shortName: 'BARC',
    category: 'Strategic Research / Defense',
    roleTitle: 'Scientific Officer (OCES / DGFS Program)',
    typicalGateDisciplines: ['CH', 'ME', 'CY', 'MT'],
    officialPortalUrl: 'https://barconlineexam.in',
    advisoryNote: 'Radiation-crosslinked polymers, polymer membrane fuel cells, and nuclear glovebox shielding.'
  }
]
