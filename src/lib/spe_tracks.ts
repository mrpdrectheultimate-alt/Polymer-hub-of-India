// src/lib/spe_tracks.ts

export interface MappedItem {
  title: string;
  url: string;
  type: 'Lesson' | 'Virtual Lab' | 'Micro-Sim' | 'Screencast' | 'Standard';
  badge: string;
}

export interface SPETrack {
  id: string;
  title: string;
  speDivision: string;
  tagline: string;
  salaryIndia: string;
  salaryGlobal: string;
  demandRating: 'Very High' | 'High' | 'Explosive Growth';
  color: string;
  bg: string;
  borderColor: string;
  summary: string;
  coreResponsibilities: string[];
  mappedCurriculum: MappedItem[];
  essentialStandards: string[];
  keyTools: string[];
  topRecruiters: string[];
  sampleInterviewQuestions: {
    question: string;
    keyConcept: string;
  }[];
}

export const SPE_TRACKS: SPETrack[] = [
  {
    id: 'compounding-specialist',
    title: 'Compounding & Masterbatch Specialist',
    speDivision: 'SPE Color & Appearance / Polymer Modifiers & Additives',
    tagline: 'Formulate masterbatches, flame retardants, mineral fillers & engineered polymer blends.',
    salaryIndia: '₹6–20 LPA',
    salaryGlobal: ',000–,000 / yr',
    demandRating: 'Very High',
    color: '#D97706',
    bg: '#FFFBEB',
    borderColor: '#B45309',
    summary: 'Compounding specialists engineer the precise additive cocktail (antioxidants, UV stabilizers, pigments, coupling agents, impact modifiers) and operate co-rotating twin-screw extruders to turn commodity resin into high-value engineered compounds.',
    coreResponsibilities: [
      'Formulate color masterbatches and calculate let-down ratios (LDR %)',
      'Design twin-screw screw configurations (kneading blocks, reverse elements, venting zones)',
      'Optimize filler loading (CaCO3, talc, glass fibers) without sacrificing melt flow or ductility',
      'Troubleshoot thermal degradation, pigment agglomeration, and die drool',
    ],
    mappedCurriculum: [
      {
        title: 'Masterbatch Let-Down Ratio (LDR) & Cost Solver',
        url: '/videos',
        type: 'Screencast',
        badge: 'Screencast #7',
      },
      {
        title: 'Twin-Screw Extrusion & Additives Compounding',
        url: '/lessons/twin-screw-extrusion-and-compounding-principles',
        type: 'Lesson',
        badge: 'Core Lesson',
      },
      {
        title: 'Polymer Degradation & Stabilization',
        url: '/lessons/polymer-degradation-and-stabilization',
        type: 'Lesson',
        badge: 'Chemistry',
      },
      {
        title: 'Shear Thinning Mechanics & Viscosity Curve',
        url: '/simulations',
        type: 'Micro-Sim',
        badge: 'Bench #15',
      },
      {
        title: 'Extruder Screw Compression Ratio Calculator',
        url: '/videos',
        type: 'Screencast',
        badge: 'Screencast #6',
      },
    ],
    essentialStandards: [
      'ASTM D1238 (Melt Flow Rate)',
      'ISO 1133 (Melt Mass-Flow Rate)',
      'ASTM D2244 (Color Difference & Delta E)',
      'UL 94 (Flammability Testing V-0/V-1/V-2/HB)',
    ],
    keyTools: [
      'Co-rotating Twin-Screw Extruders (Coperion, Leistritz, Steer)',
      'Loss-in-Weight Gravimetric Feeders',
      'Spectrophotometers (X-Rite Ci7800)',
      'High-Speed Henschel Mixers',
    ],
    topRecruiters: [
      'Clariant / Avient Masterbatches',
      'Ampacet Corporation',
      'Plastiblends India',
      'Supreme Industries',
      'BASF Performance Materials',
      'SABIC Specialties',
    ],
    sampleInterviewQuestions: [
      {
        question: 'How do you prevent titanium dioxide (TiO2) pigment agglomeration during high-concentration white masterbatch production?',
        keyConcept: 'Surface treatment with stearates/silanes, dispersive kneading blocks in melting zone, and maintaining sufficient shear stress.',
      },
      {
        question: 'What is the difference between primary phenolic antioxidants and secondary phosphite antioxidants?',
        keyConcept: 'Phenolic antioxidants are free radical scavengers (chain-breaking); phosphites are hydroperoxide decomposers during melt processing.',
      },
    ],
  },
  {
    id: 'blow-molding-packaging',
    title: 'Blow Molding & Rigid Packaging Engineer',
    speDivision: 'SPE Blow Molding Division',
    tagline: 'Design bottles, parison programs, multi-layer barrier containers & ISBM preforms.',
    salaryIndia: '₹5–18 LPA',
    salaryGlobal: ',000–,000 / yr',
    demandRating: 'High',
    color: '#0284C7',
    bg: '#F0F9FF',
    borderColor: '#0369A1',
    summary: 'Blow molding engineers develop packaging solutions spanning Extrusion Blow Molding (EBM), Injection Blow Molding (IBM), and Injection Stretch Blow Molding (ISBM) for beverage, edible oil, pharmaceutical, and chemical container industries.',
    coreResponsibilities: [
      'Program electronic parison thickness controllers (WDS/PDS) to prevent container corner thinning',
      'Calculate Blow-Up Ratio (BUR) and parison die swell for HDPE, PP, and PET',
      'Design container pinch-off inserts, flash pockets, and neck finish tooling',
      'Optimize stretch rod speed and pre-blow pressure profiles for PET beverage preforms',
    ],
    mappedCurriculum: [
      {
        title: 'Blow Molding Parison Swell & Blow-Up Ratio (BUR)',
        url: '/videos',
        type: 'Screencast',
        badge: 'Screencast #8',
      },
      {
        title: 'Extrusion Blow Moulding: Parison Programming & Tooling',
        url: '/lessons/extrusion-blow-moulding-parison-programming-and-tooling',
        type: 'Lesson',
        badge: 'Core Lesson',
      },
      {
        title: 'Injection Stretch Blow Moulding (ISBM) for PET Containers',
        url: '/lessons/injection-stretch-blow-moulding-isbm-for-pet-containers',
        type: 'Lesson',
        badge: 'Packaging',
      },
      {
        title: 'Environmental Stress Crack Resistance (ESCR) Tester',
        url: '/simulations',
        type: 'Virtual Lab',
        badge: 'Bench #8',
      },
      {
        title: 'Carbon Footprint & LCA Recycled vs Virgin Plastics',
        url: '/videos',
        type: 'Screencast',
        badge: 'Screencast #11',
      },
    ],
    essentialStandards: [
      'ASTM D2561 (ESCR of Blow-Molded Polyethylene Containers)',
      'IS 15410 (PET Containers for Packaged Drinking Water)',
      'IS 12887 (HDPE Containers for Chemical Packaging)',
      'ASTM D2463 (Drop Impact Resistance of Blow-Molded Containers)',
    ],
    keyTools: [
      'Bekum / Uniloy Continuous Extrusion Blow Machines',
      'Nissei ASB / Husky ISBM Preform Machines',
      'Moog Electronic Parison Controllers',
      'Torque & Top-load Compression Gauges',
    ],
    topRecruiters: [
      'Manjushree Technopack',
      'Ester Industries',
      'ALPLA India',
      'Amcor Rigid Packaging',
      'Reliance Packaging Division',
      'Hindustan National Glass (Plastics Div)',
    ],
    sampleInterviewQuestions: [
      {
        question: 'Why does parison sag occur during the extrusion of large 200L HDPE drums, and how do you counteract it?',
        keyConcept: 'Parison sag is gravitational draw-down before mold clamp. Counteracted using accumulator head extrusion and high molecular weight bimodal HDPE with high zero-shear viscosity.',
      },
      {
        question: 'What causes pearlescence or haze in PET stretch blow molded bottles?',
        keyConcept: 'Stretching below the natural draw ratio temperature (~90–105°C) causing cold stress-induced micro-voids, or exceeding the upper limit causing thermal crystallization.',
      },
    ],
  },
  {
    id: 'quality-testing-analyst',
    title: 'Quality Control & ASTM/ISO Testing Analyst',
    speDivision: 'SPE Quality & Polymer Characterization Division',
    tagline: 'Standardize incoming resin checks, run ISO/ASTM mechanical testing & certify compliance.',
    salaryIndia: '₹4.5–16 LPA',
    salaryGlobal: ',000–,000 / yr',
    demandRating: 'Very High',
    color: '#7C3AED',
    bg: '#F5F3FF',
    borderColor: '#6D28D9',
    summary: 'Quality Control analysts are the ultimate gatekeepers of polymer integrity in manufacturing plants, NABL accredited testing laboratories (such as CIPET), and tier-1 automotive suppliers.',
    coreResponsibilities: [
      'Conduct ASTM D638 tensile, flexural modulus (ISO 178), and Izod/Charpy impact tests',
      'Measure Melt Flow Index (MFI) and Melt Flow Ratio (MFR) to detect polymer degradation',
      'Operate Differential Scanning Calorimeters (DSC) to calculate % crystallinity and identify resin blends',
      'Establish Statistical Process Control (SPC) charts (Cp, Cpk) for high-cavitation production',
    ],
    mappedCurriculum: [
      {
        title: 'Stress-Strain Curve Analysis & Toughness Modulus Solver',
        url: '/videos',
        type: 'Screencast',
        badge: 'Screencast #3',
      },
      {
        title: 'How to Read a DSC Thermogram & % Crystallinity',
        url: '/videos',
        type: 'Screencast',
        badge: 'Screencast #1',
      },
      {
        title: 'MFI to Power-Law Viscosity & Molecular Weight',
        url: '/videos',
        type: 'Screencast',
        badge: 'Screencast #2',
      },
      {
        title: 'Universal Testing Machine (UTM) Tensile Bench',
        url: '/simulations',
        type: 'Virtual Lab',
        badge: 'Bench #1',
      },
      {
        title: 'HDT vs Vicat Softening Point Solver',
        url: '/videos',
        type: 'Screencast',
        badge: 'Screencast #10',
      },
    ],
    essentialStandards: [
      'ASTM D638 / ISO 527 (Tensile Properties of Plastics)',
      'ASTM D256 / ISO 180 (Izod Pendulum Impact Resistance)',
      'ASTM D3418 / ISO 11357 (DSC Transition Temperatures & Crystallinity)',
      'ASTM D648 / ISO 75 (Deflection Temperature Under Load / HDT)',
      'ISO/IEC 17025 (General Requirements for Testing Laboratories)',
    ],
    keyTools: [
      'Instron / ZwickRoell Universal Testing Machines',
      'Dynisco / CEAST Melt Flow Indexers',
      'TA Instruments Discovery DSC / TGA',
      'Mitutoyo Digital Micrometers & Video Measuring Systems (VMS)',
    ],
    topRecruiters: [
      'CIPET Testing Laboratories',
      'Bureau Veritas / SGS India / TÜV SÜD',
      'Motherson Sumi Systems',
      'Tata AutoComp Systems',
      'Reliance Petrochemicals QC',
      'Finolex Industries Quality Lab',
    ],
    sampleInterviewQuestions: [
      {
        question: 'Why does an increase in testing crosshead speed cause tensile modulus and yield strength to increase while elongation at break decreases?',
        keyConcept: 'Polymers are viscoelastic. Higher strain rates give polymer chains insufficient relaxation time to disentangle and reorient, making the material behave more rigidly and brittle.',
      },
      {
        question: 'How do you determine if a batch of regrind HDPE has undergone thermal degradation without waiting for tensile test dogbones?',
        keyConcept: 'Test high-load MFI (21.6 kg) and standard MFI (2.16 kg). A change in Melt Flow Ratio (MFR = HL-MFI / MFI) indicates molecular weight distribution broadening or chain scission.',
      },
    ],
  },
  {
    id: 'polymer-rnd-scientist',
    title: 'Polymer R&D & Formulation Scientist',
    speDivision: 'SPE Polymer Engineering & Science (PES) Division',
    tagline: 'Synthesize novel polymers, engineer biodegradable bioplastics & develop nano-composites.',
    salaryIndia: '₹8–28 LPA',
    salaryGlobal: ',000–,000 / yr',
    demandRating: 'Explosive Growth',
    color: '#059669',
    bg: '#ECFDF5',
    borderColor: '#047857',
    summary: 'R&D scientists lead fundamental and applied breakthroughs in high-performance materials, PHA/PLA biodegradable polymers, carbon-fiber aerospace composites, and conductive polymers for battery electrolytes.',
    coreResponsibilities: [
      'Design copolymer architectures (block, graft, random) and control polydispersity (PDI)',
      'Formulate nanocomposites with graphene, carbon nanotubes, and nano-silica',
      'Analyze FTIR spectra, GPC molecular weight distribution curves, and TGA decomposition curves',
      'Write patent disclosures and publish peer-reviewed papers in SPE and ACS journals',
    ],
    mappedCurriculum: [
      {
        title: 'Molecular Weight (Mn, Mw, PDI) & Distribution Solver',
        url: '/videos',
        type: 'Screencast',
        badge: 'Screencast #5',
      },
      {
        title: 'Polymer Chain Folding & Lamellae Crystallization',
        url: '/simulations',
        type: 'Micro-Sim',
        badge: 'Bench #14',
      },
      {
        title: 'Spherulite Crystallization & Polarized Microscopy',
        url: '/simulations',
        type: 'Micro-Sim',
        badge: 'Bench #13',
      },
      {
        title: 'Step-Growth vs Chain-Growth Polymerization Kinetics',
        url: '/lessons/step-growth-vs-chain-growth-polymerization-mechanisms-and-kinetics',
        type: 'Lesson',
        badge: 'Chemistry',
      },
      {
        title: 'Thermogravimetric Analysis (TGA) Lab Bench',
        url: '/simulations',
        type: 'Virtual Lab',
        badge: 'Bench #4',
      },
    ],
    essentialStandards: [
      'ASTM D5296 (Molecular Weight by Gel Permeation Chromatography / GPC)',
      'ASTM E1131 (Standard Test Method for Compositional Analysis by TGA)',
      'ASTM D6400 (Standard Specification for Compostable Plastics)',
      'ISO 11358 (Thermogravimetry of Polymers)',
    ],
    keyTools: [
      'Waters Gel Permeation Chromatography (GPC / SEC)',
      'Thermo Fisher Nicolet FTIR Spectrometers',
      'Anton Paar Rheometer (Oscillatory & Rotational)',
      'SEM / TEM Electron Microscopy',
    ],
    topRecruiters: [
      'Reliance R&D Center (RIL)',
      'BASF Innovation Hub India',
      'SABIC Technology Center Bengaluru',
      'CSIR-NCL (National Chemical Laboratory)',
      'Shell Technology Center',
      'Victrex India',
    ],
    sampleInterviewQuestions: [
      {
        question: 'Why does Gel Permeation Chromatography (GPC) measure hydrodynamic volume rather than absolute molecular weight, and how do you calibrate it?',
        keyConcept: 'GPC separates by steric exclusion based on molecular coil size in solution. Calibrated using monodisperse Polystyrene standards or universal calibration using Mark-Houwink parameters [η]·M.',
      },
      {
        question: 'What is the mechanism of compatibilization when blending immiscible polymers like PA6 and PP using PP-g-MAH?',
        keyConcept: 'Maleic anhydride groups on PP-g-MAH chemically react with PA6 terminal amine groups to form in-situ block copolymer at the interface, reducing interfacial tension and preventing phase coalescence.',
      },
    ],
  },
];
